import { AGE_GUIDES, FLOWS, JAPAN_OREGON_GUIDES, LAST_REVIEWED, SOURCES } from "../data/knowledge.js";

const MAX_MESSAGE_LENGTH = 1200;
const MAX_HISTORY_ITEMS = 8;
const MAX_HISTORY_ITEM_LENGTH = 3500;

export function normalizeHistory(value) {
  if (!Array.isArray(value)) return [];
  return value
    .slice(-MAX_HISTORY_ITEMS)
    .filter(item => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string")
    .map(item => ({ role: item.role, content: item.content.trim().slice(0, MAX_HISTORY_ITEM_LENGTH) }))
    .filter(item => item.content);
}

export function extractOutputText(result) {
  if (typeof result?.output_text === "string" && result.output_text.trim()) {
    return result.output_text.trim();
  }

  if (!Array.isArray(result?.output)) return "";
  return result.output
    .filter(item => item?.type === "message" && Array.isArray(item.content))
    .flatMap(item => item.content)
    .filter(content => content?.type === "output_text" && typeof content.text === "string")
    .map(content => content.text.trim())
    .filter(Boolean)
    .join("\n\n");
}

function json(response, status, body) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(body));
}

async function readBody(request) {
  if (request.body && typeof request.body === "object") return request.body;
  let raw = "";
  for await (const chunk of request) {
    raw += chunk;
    if (raw.length > 10_000) throw new Error("REQUEST_TOO_LARGE");
  }
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return json(response, 405, { error: "POSTのみ利用できます。" });
  }

  try {
    const body = await readBody(request);
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const history = normalizeHistory(body.history);
    if (!message || message.length > MAX_MESSAGE_LENGTH) {
      return json(response, 400, { error: `質問は1～${MAX_MESSAGE_LENGTH}文字で入力してください。` });
    }
    if (!process.env.OPENAI_API_KEY) {
      return json(response, 503, { error: "AI質問機能は未設定です。上の選択式ガイドをご利用ください。" });
    }

    const sourceText = SOURCES.map((source, index) => `[${index + 1}] ${source.title}: ${source.url}`).join("\n");
    const responseFromOpenAI = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
        store: false,
        instructions: `あなたはOregon DMVの車両手続き案内係です。日本語で簡潔に回答してください。
法的助言はせず、提供された知識だけを根拠にします。根拠が不足する場合は「あっぷる — 公式情報だけでは確認できません」と明示してください。
免許証番号、VIN、SSN、生年月日、住所などの個人情報を入力しないよう案内してください。
回答末尾に参照した公式URLを記載し、手続き前にOregon DMVで再確認するよう促してください。
知識の確認日: ${LAST_REVIEWED}
公式情報:
${JSON.stringify(FLOWS)}
${JSON.stringify(AGE_GUIDES)}
${JSON.stringify(JAPAN_OREGON_GUIDES)}
${sourceText}`,
        input: [...history, { role: "user", content: message }],
        max_output_tokens: 700
      })
    });

    if (!responseFromOpenAI.ok) {
      const requestId = responseFromOpenAI.headers.get("x-request-id");
      console.error("OpenAI request failed", { status: responseFromOpenAI.status, requestId });
      return json(response, 502, { error: "AIサービスへの接続に失敗しました。時間をおいて再試行してください。" });
    }

    const result = await responseFromOpenAI.json();
    const answer = extractOutputText(result);
    if (!answer) {
      console.error("OpenAI response contained no text", {
        requestId: responseFromOpenAI.headers.get("x-request-id"),
        status: result.status,
        incompleteReason: result.incomplete_details?.reason
      });
      return json(response, 502, { error: "AIの回答本文を取得できませんでした。もう一度お試しください。" });
    }
    return json(response, 200, { answer });
  } catch (error) {
    console.error("Chat handler error", { name: error.name, message: error.message });
    return json(response, 400, { error: "リクエストを処理できませんでした。" });
  }
}
