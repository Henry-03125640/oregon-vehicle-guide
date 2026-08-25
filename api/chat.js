import { AGE_GUIDES, FLOWS, JAPAN_OREGON_GUIDES, LAST_REVIEWED, SOURCES } from "../data/knowledge.js";

const MAX_MESSAGE_LENGTH = 1200;

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
        input: message,
        max_output_tokens: 700
      })
    });

    if (!responseFromOpenAI.ok) {
      const requestId = responseFromOpenAI.headers.get("x-request-id");
      console.error("OpenAI request failed", { status: responseFromOpenAI.status, requestId });
      return json(response, 502, { error: "AIサービスへの接続に失敗しました。時間をおいて再試行してください。" });
    }

    const result = await responseFromOpenAI.json();
    return json(response, 200, { answer: result.output_text || "あっぷる — 回答を生成できませんでした。" });
  } catch (error) {
    console.error("Chat handler error", { name: error.name, message: error.message });
    return json(response, 400, { error: "リクエストを処理できませんでした。" });
  }
}
