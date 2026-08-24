const options = document.querySelector("#flow-options");
const result = document.querySelector("#flow-result");
const sourceList = document.querySelector("#source-list");
const reviewed = document.querySelector("#reviewed");
const form = document.querySelector("#chat-form");
const message = document.querySelector("#message");
const status = document.querySelector("#chat-status");
const answer = document.querySelector("#chat-answer");

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, character => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" })[character]);
}

async function loadGuide() {
  const response = await fetch("/api/guide");
  if (!response.ok) throw new Error("案内データを読み込めませんでした。");
  const guide = await response.json();

  Object.entries(guide.flows).forEach(([id, flow]) => {
    const button = document.createElement("button");
    button.className = "flow-card";
    button.type = "button";
    button.innerHTML = `${escapeHtml(flow.label)}<span aria-hidden="true">→</span>`;
    button.addEventListener("click", () => showFlow(flow));
    options.append(button);
  });

  reviewed.textContent = `情報確認日：${guide.lastReviewed}`;
  guide.sources.forEach(source => {
    const item = document.createElement("li");
    item.innerHTML = `<a href="${source.url}" target="_blank" rel="noreferrer"><span>${escapeHtml(source.title)}</span><span>↗</span></a>`;
    sourceList.append(item);
  });
}

function showFlow(flow) {
  result.innerHTML = `<h3>${escapeHtml(flow.label)}</h3><p>${escapeHtml(flow.summary)}</p><ol>${flow.steps.map(step => `<li>${escapeHtml(step)}</li>`).join("")}</ol><div class="notes"><strong>確認ポイント</strong><ul>${flow.notes.map(note => `<li>${escapeHtml(note)}</li>`).join("")}</ul></div>`;
  result.hidden = false;
  result.scrollIntoView({ behavior:"smooth", block:"nearest" });
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const submit = form.querySelector("button");
  submit.disabled = true;
  answer.hidden = true;
  status.textContent = "公式情報をもとに確認しています…";
  try {
    const response = await fetch("/api/chat", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ message:message.value }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "回答を取得できませんでした。");
    answer.textContent = data.answer;
    answer.hidden = false;
    status.textContent = "";
  } catch (error) {
    status.textContent = error.message;
  } finally {
    submit.disabled = false;
  }
});

loadGuide().catch(error => { options.textContent = error.message; });

