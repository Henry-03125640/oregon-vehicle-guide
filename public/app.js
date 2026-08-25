import { buildShareText, tokenizeLinks } from "./format.js";

const options = document.querySelector("#flow-options");
const result = document.querySelector("#flow-result");
const sourceList = document.querySelector("#source-list");
const reviewed = document.querySelector("#reviewed");
const form = document.querySelector("#chat-form");
const message = document.querySelector("#message");
const status = document.querySelector("#chat-status");
const chatThread = document.querySelector("#chat-thread");
const chatActions = document.querySelector("#chat-actions");
const printChat = document.querySelector("#print-chat");
const shareChat = document.querySelector("#share-chat");
const ageOptions = document.querySelector("#age-options");
const ageResult = document.querySelector("#age-result");
const transferOptions = document.querySelector("#transfer-options");
const transferResult = document.querySelector("#transfer-result");
const slides = [...document.querySelectorAll(".hero-slide")];
const dots = [...document.querySelectorAll(".hero-dot")];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let activeSlide = 0;
let slideTimer;
const conversation = [];

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, character => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" })[character]);
}

function appendLinkedText(container, text) {
  for (const token of tokenizeLinks(text)) {
    if (token.type === "text") {
      container.append(document.createTextNode(token.text));
      continue;
    }

    const link = document.createElement("a");
    link.href = token.href;
    link.textContent = token.text;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    container.append(link);
  }
}

function appendMessage(role, text) {
  const item = document.createElement("article");
  item.className = `chat-message chat-message--${role}`;
  const label = document.createElement("p");
  label.className = "chat-message__label";
  label.textContent = role === "user" ? "あなた" : "AI案内";
  const body = document.createElement("div");
  body.className = "chat-message__body";
  appendLinkedText(body, text);
  item.append(label, body);
  chatThread.append(item);
  item.scrollIntoView({ behavior:"smooth", block:"nearest" });
}

function conversationText() {
  return conversation.map(item => `${item.role === "user" ? "あなた" : "AI案内"}:\n${item.content}`).join("\n\n");
}

function showSlide(index) {
  activeSlide = index;
  slides.forEach((slide, slideIndex) => {
    const active = slideIndex === index;
    slide.classList.toggle("is-active", active);
    slide.setAttribute("aria-hidden", String(!active));
    dots[slideIndex].classList.toggle("is-active", active);
  });
}

function startSlides() {
  if (reduceMotion) return;
  clearInterval(slideTimer);
  slideTimer = setInterval(() => showSlide((activeSlide + 1) % slides.length), 5200);
}

dots.forEach((dot, index) => dot.addEventListener("click", () => {
  showSlide(index);
  startSlides();
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold:.14 });

document.querySelectorAll(".reveal").forEach(element => observer.observe(element));

window.addEventListener("scroll", () => {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  const progress = available > 0 ? Math.min(100, window.scrollY / available * 100) : 0;
  document.documentElement.style.setProperty("--page-progress", `${progress}%`);
}, { passive:true });

startSlides();

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

  Object.values(guide.ageGuides).forEach(ageGuide => {
    const button = document.createElement("button");
    button.className = "age-option";
    button.type = "button";
    button.textContent = ageGuide.label;
    button.addEventListener("click", () => showAgeGuide(ageGuide, button));
    ageOptions.append(button);
  });

  Object.values(guide.japanOregonGuides).forEach(transferGuide => {
    const button = document.createElement("button");
    button.className = "transfer-option";
    button.type = "button";
    button.textContent = transferGuide.label;
    button.addEventListener("click", () => showTransferGuide(transferGuide, button));
    transferOptions.append(button);
  });

  reviewed.textContent = `情報確認日：${guide.lastReviewed}`;
  guide.sources.forEach(source => {
    const item = document.createElement("li");
    item.innerHTML = `<a href="${source.url}" target="_blank" rel="noreferrer"><span>${escapeHtml(source.title)}</span><span>↗</span></a>`;
    sourceList.append(item);
  });
}

function showTransferGuide(guide, selectedButton) {
  transferOptions.querySelectorAll(".transfer-option").forEach(button => button.classList.toggle("is-active", button === selectedButton));
  transferResult.innerHTML = `<div class="transfer-intro"><p class="age-kicker">LICENSE CONVERSION</p><h3>${escapeHtml(guide.title)}</h3><p>${escapeHtml(guide.summary)}</p></div><div class="transfer-columns"><div><h4>免除対象</h4><ul class="exempt-list">${guide.exempt.map(item => `<li>✓ ${escapeHtml(item)}</li>`).join("")}</ul></div><div><h4>必要な条件・手続き</h4><ol>${guide.requirements.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ol><p class="transfer-caution">${escapeHtml(guide.caution)}</p><a class="age-source" href="${guide.sourceUrl}" target="_blank" rel="noreferrer">公式情報を確認 ↗</a></div></div>`;
  transferResult.hidden = false;
  transferResult.scrollIntoView({ behavior:"smooth", block:"nearest" });
}

function showAgeGuide(guide, selectedButton) {
  ageOptions.querySelectorAll(".age-option").forEach(button => button.classList.toggle("is-active", button === selectedButton));
  ageResult.innerHTML = `<div><p class="age-kicker">AGE-BASED GUIDE</p><h3>${escapeHtml(guide.title)}</h3><p>${escapeHtml(guide.summary)}</p></div><div><ol>${guide.steps.map(step => `<li>${escapeHtml(step)}</li>`).join("")}</ol><div class="notes"><strong>確認ポイント</strong><ul>${guide.notes.map(note => `<li>${escapeHtml(note)}</li>`).join("")}</ul></div><a class="age-source" href="${guide.sourceUrl}" target="_blank" rel="noreferrer">Oregon DMV公式情報を確認 ↗</a></div>`;
  ageResult.hidden = false;
  ageResult.scrollIntoView({ behavior:"smooth", block:"nearest" });
}

function showFlow(flow) {
  result.innerHTML = `<h3>${escapeHtml(flow.label)}</h3><p>${escapeHtml(flow.summary)}</p><ol>${flow.steps.map(step => `<li>${escapeHtml(step)}</li>`).join("")}</ol><div class="notes"><strong>確認ポイント</strong><ul>${flow.notes.map(note => `<li>${escapeHtml(note)}</li>`).join("")}</ul></div>`;
  result.hidden = false;
  result.scrollIntoView({ behavior:"smooth", block:"nearest" });
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const submit = form.querySelector("button");
  const currentMessage = message.value.trim();
  const history = conversation.slice(-8);
  submit.disabled = true;
  message.disabled = true;
  appendMessage("user", currentMessage);
  message.value = "";
  status.textContent = "公式情報をもとに確認しています…";
  try {
    const response = await fetch("/api/chat", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ message:currentMessage, history }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "回答を取得できませんでした。");
    conversation.push({ role:"user", content:currentMessage }, { role:"assistant", content:data.answer });
    if (conversation.length > 10) conversation.splice(0, conversation.length - 10);
    appendMessage("assistant", data.answer);
    chatActions.hidden = false;
    form.querySelector("label").textContent = "続けて質問できます。前の回答を踏まえて案内します。";
    message.placeholder = "例：必要な書類だけ一覧にして";
    status.textContent = "";
  } catch (error) {
    status.textContent = error.message;
  } finally {
    submit.disabled = false;
    message.disabled = false;
    message.focus();
  }
});

printChat.addEventListener("click", () => window.print());

shareChat.addEventListener("click", async () => {
  const text = buildShareText(conversationText(), window.location.href);
  try {
    if (navigator.share) {
      await navigator.share({ title:"Oregon Vehicle Guideの案内", text });
      status.textContent = "共有メニューを開きました。";
    } else {
      await navigator.clipboard.writeText(text);
      status.textContent = "会話をクリップボードへコピーしました。";
    }
  } catch (error) {
    if (error.name !== "AbortError") status.textContent = "共有できませんでした。端末の設定をご確認ください。";
  }
});

loadGuide().catch(error => { options.textContent = error.message; });
