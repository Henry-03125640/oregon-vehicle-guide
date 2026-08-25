const options = document.querySelector("#flow-options");
const result = document.querySelector("#flow-result");
const sourceList = document.querySelector("#source-list");
const reviewed = document.querySelector("#reviewed");
const form = document.querySelector("#chat-form");
const message = document.querySelector("#message");
const status = document.querySelector("#chat-status");
const answer = document.querySelector("#chat-answer");
const ageOptions = document.querySelector("#age-options");
const ageResult = document.querySelector("#age-result");
const transferOptions = document.querySelector("#transfer-options");
const transferResult = document.querySelector("#transfer-result");
const slides = [...document.querySelectorAll(".hero-slide")];
const dots = [...document.querySelectorAll(".hero-dot")];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let activeSlide = 0;
let slideTimer;

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, character => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" })[character]);
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
