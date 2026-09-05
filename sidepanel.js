const $ = (selector) => document.querySelector(selector);
let source = null;
let selectedMinutes = 15;
let editingPlanId = null;
let currentLanguage = "zh";

const messages = {
  zh: {
    subtitle: "从学会到做到", sourceTitle: "打开 YouTube 或 X 教程", sourceMeta: "点击下方按钮读取当前页面。",
    read: "读取当前页面", reread: "重新读取", readDone: "已读取当前页面", unknownTitle: "未识别标题",
    back: "← 返回重新读取内容", setup: "转化为实践", projectLabel: "你想把它用在哪个真实项目？",
    projectPlaceholder: "例如：为我的 AI 工具验证 3 个真实用户需求", principlesLabel: "教程最关键的方法或步骤",
    principlesPlaceholder: "可以先写你理解的 1–4 条；之后可继续编辑", generate: "生成训练计划",
    weekly: "本周真实成果", today: "今天 · Day 1", edit: "← 返回修改前期信息", minimum: "最低", standard: "标准", deep: "深入",
    submitEvidence: "提交证据", defaultMinutes: "15 分钟",
    submitReview: "提交与验收", evidenceLabel: "你的成果或证据", evidencePlaceholder: "粘贴成果、链接、数据或描述已上传的文件/截图",
    selfRating: "自评完成度：", blockerLabel: "最困难的地方", blockerPlaceholder: "例如：不知道怎么获得真实反馈", submit: "提交练习",
    settings: "个人档案与提醒", language: "界面语言", defaultPractice: "每天默认练习", reminder: "提醒时间", level: "当前水平",
    levelPlaceholder: "初学 / 熟悉 / 熟练", goal: "主要目标", goalPlaceholder: "你希望在真实工作中达成什么？", save: "保存并开启每日提醒",
    queue: "待实践队列", oneAtTime: "一次只练一个", queueHelp: "主计划完成或放弃后，再从这里选择下一项。", empty: "队列还是空的",
    todayNav: "今日练习", queueNav: "待实践队列", noTranscript: "没有读取到字幕？", manualPlaceholder: "粘贴字幕、帖子正文或你的笔记",
    applyTitle: "把方法用到：", outcome: "今天不做摘要，完成一个能在真实项目中继续使用的最小成果。",
    evidenceShort: "一个最小成果 + 截图或文字", evidenceLong: "成果、链接、代码、截图或真实数据",
    needRead: "请先读取当前页面。", needProject: "请写下要应用的真实项目。", needContent: "暂时没有字幕，请粘贴内容或写下关键方法。",
    queued: "已有主计划，这个教程已加入待实践队列。", needEvidence: "请提交更具体的成果或证据。",
    passed: "通过 · 已形成真实成果", revise: "修改后重交", retry: "拆小后重练",
    passedFeedback: "你已经把方法用于真实项目。下一步是获取真实反馈，并在第 7 天独立复现。",
    reviseFeedback: "优先修改：明确写出你保留了哪条核心原则，并补充成果实际被使用、发布或验证的证据。",
    blocker: "当前阻碍：", saved: "个人档案已保存，每日提醒已开启。", core: "教程的核心原则"
  },
  en: {
    subtitle: "Turn learning into action", sourceTitle: "Open a YouTube or X tutorial", sourceMeta: "Select the button below to read this page.",
    read: "Read current page", reread: "Read again", readDone: "Current page captured", unknownTitle: "Untitled source",
    back: "← Back and read again", setup: "TURN IT INTO PRACTICE", projectLabel: "Which real project will you apply this to?",
    projectPlaceholder: "Example: validate three real user needs for my AI tool", principlesLabel: "The tutorial's essential methods or steps",
    principlesPlaceholder: "Write 1–4 principles you understood; you can edit them later", generate: "Create practice plan",
    weekly: "Real outputs this week", today: "TODAY · DAY 1", edit: "← Edit setup information", minimum: "Minimum", standard: "Standard", deep: "Deep",
    submitEvidence: "Submit evidence", defaultMinutes: "15 minutes",
    submitReview: "SUBMIT & REVIEW", evidenceLabel: "Your output or evidence", evidencePlaceholder: "Paste your output, link, data, or describe the uploaded file/screenshot",
    selfRating: "Self-rated completion: ", blockerLabel: "What was hardest?", blockerPlaceholder: "Example: I don't know how to get real feedback", submit: "Submit practice",
    settings: "PROFILE & REMINDERS", language: "Interface language", defaultPractice: "Default daily practice", reminder: "Reminder time", level: "Current level",
    levelPlaceholder: "Beginner / familiar / proficient", goal: "Primary goal", goalPlaceholder: "What do you want to achieve in real work?", save: "Save and enable daily reminder",
    queue: "PRACTICE QUEUE", oneAtTime: "Practice one thing at a time", queueHelp: "Choose the next item after completing or abandoning the active plan.", empty: "Your queue is empty",
    todayNav: "Today's practice", queueNav: "Practice queue", noTranscript: "No transcript found?", manualPlaceholder: "Paste the transcript, post, or your notes",
    applyTitle: "Apply the method to: ", outcome: "Skip the summary today. Produce the smallest useful output for your real project.",
    evidenceShort: "One minimum output + screenshot or text", evidenceLong: "Output, link, code, screenshot, or real data",
    needRead: "Read the current page first.", needProject: "Describe the real project you will apply this to.", needContent: "No transcript is available. Paste content or enter the key method.",
    queued: "You already have an active plan. This tutorial was added to the practice queue.", needEvidence: "Submit more specific output or evidence.",
    passed: "Passed · Real output created", revise: "Revise and resubmit", retry: "Make it smaller and retry",
    passedFeedback: "You applied the method to a real project. Next, gather real feedback and reproduce it independently on day 7.",
    reviseFeedback: "Priority revision: name the core principle you preserved and add evidence that the output was used, published, or validated.",
    blocker: "Current blocker: ", saved: "Profile saved and daily reminder enabled.", core: "the tutorial's core principle"
  }
};

const t = (key) => messages[currentLanguage][key];

document.addEventListener("DOMContentLoaded", restore);
$("#readButton").addEventListener("click", readCurrentPage);
$("#generateButton").addEventListener("click", generatePlan);
$("#backToSourceButton").addEventListener("click", backToSource);
$("#editPlanButton").addEventListener("click", editActivePlan);
$("#submitButton").addEventListener("click", reviewEvidence);
$("#settingsButton").addEventListener("click", () => toggleSettings(true));
$("#saveSettings").addEventListener("click", saveSettings);
$("#languageSelect").addEventListener("change", changeLanguage);
$("#todayNav").addEventListener("click", showToday);
$("#queueNav").addEventListener("click", showQueue);
$("#selfRating").addEventListener("input", (event) => $("#selfRatingLabel").textContent = `${event.target.value}%`);
document.querySelectorAll(".mode").forEach((button) => button.addEventListener("click", () => selectMode(button)));

async function getState() {
  const { practiceLoopState } = await chrome.storage.local.get("practiceLoopState");
  return practiceLoopState || { profile: { dailyMinutes: 15, minimumMinutes: 5, weeklyTarget: 1 }, activePlan: null, queue: [], submissions: [] };
}

async function saveState(state) {
  await chrome.storage.local.set({ practiceLoopState: state });
}

async function restore() {
  const state = await getState();
  currentLanguage = state.profile?.language || "zh";
  $("#languageSelect").value = currentLanguage;
  applyLanguage();
  if (state.profile) {
    $("#reminderTime").value = state.profile.reminderTime || "20:30";
    $("#levelInput").value = state.profile.level || "";
    $("#goalInput").value = state.profile.goal || "";
  }
  if (state.activePlan) renderPlan(state.activePlan);
}

async function readCurrentPage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;
  try {
    source = await chrome.tabs.sendMessage(tab.id, { type: "READ_PAGE" });
  } catch {
    source = { title: tab.title, url: tab.url, platform: "Web", excerpt: "", transcript: "", needsTranscript: true };
  }
  $("#sourceTitle").textContent = source.title || t("unknownTitle");
  $("#sourceMeta").textContent = `${source.platform} · ${t("readDone")}`;
  $("#readButton").textContent = t("reread");
  $("#fallback").hidden = !source.needsTranscript;
  $("#setupSection").hidden = false;
  $("#setupSection").scrollIntoView({ behavior: "smooth" });
}

async function generatePlan() {
  const project = $("#projectInput").value.trim();
  const principlesText = $("#principlesInput").value.trim();
  const manual = $("#manualContent").value.trim();
  if (!source) return alert(t("needRead"));
  if (!project) return alert(t("needProject"));
  if (!principlesText && !source.transcript && !manual) return alert(t("needContent"));

  const principles = principlesText
    ? principlesText.split(/\n|[；;]/).map((x) => x.replace(/^[-\d.、\s]+/, "").trim()).filter(Boolean).slice(0, 4)
    : derivePrinciples(source.transcript || manual || source.excerpt);
  const plan = {
    id: crypto.randomUUID(), title: source.title, url: source.url, platform: source.platform,
    project, principles, selectedMinutes: 15, day: 1, createdAt: Date.now()
  };
  const state = await getState();
  if (state.activePlan && editingPlanId === state.activePlan.id) {
    state.activePlan = { ...state.activePlan, ...plan, id: editingPlanId, createdAt: state.activePlan.createdAt, updatedAt: Date.now() };
    editingPlanId = null;
    await saveState(state);
    renderPlan(state.activePlan);
    return;
  }
  if (state.activePlan) {
    state.queue.push(plan);
    await saveState(state);
    return alert(t("queued"));
  }
  state.activePlan = plan;
  await saveState(state);
  renderPlan(plan);
}

function backToSource() {
  $("#setupSection").hidden = true;
  $("#planSection").hidden = true;
  $("#sourceSection").hidden = false;
  $("#sourceSection").scrollIntoView({ behavior: "smooth" });
}

async function editActivePlan() {
  const state = await getState();
  const plan = state.activePlan;
  if (!plan) return;
  editingPlanId = plan.id;
  source = { title: plan.title, url: plan.url, platform: plan.platform, transcript: "", excerpt: "", needsTranscript: false };
  $("#projectInput").value = plan.project || "";
  $("#principlesInput").value = (plan.principles || []).join("\n");
  $("#planSection").hidden = true;
  $("#sourceSection").hidden = true;
  $("#setupSection").hidden = false;
  $("#setupSection").scrollIntoView({ behavior: "smooth" });
}

function derivePrinciples(text) {
  const sentences = text.split(/[。！？.!?]/).map((x) => x.trim()).filter((x) => x.length > 18);
  return sentences.slice(0, 3).map((x) => x.slice(0, 110));
}

function renderPlan(plan) {
  $("#sourceSection").hidden = true;
  $("#setupSection").hidden = true;
  $("#settingsSection").hidden = true;
  $("#planSection").hidden = false;
  $("#practiceTitle").textContent = `${t("applyTitle")}${plan.project}`;
  $("#practiceOutcome").textContent = t("outcome");
  renderTasks(plan, selectedMinutes);
}

function selectMode(button) {
  document.querySelectorAll(".mode").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  selectedMinutes = Number(button.dataset.minutes);
  getState().then((state) => state.activePlan && renderTasks(state.activePlan, selectedMinutes));
}

function renderTasks(plan, minutes) {
  const first = plan.principles[0] || t("core");
  const tasks = currentLanguage === "en"
    ? minutes === 5
      ? [`Explain this principle in your own words: “${first}”`, `Take one minimum action in the real project now`, `Save a screenshot, link, or result as evidence`]
      : minutes === 30
        ? [`Recall ${plan.principles.length || 1} core principles without the tutorial`, `Complete one full execution in “${plan.project}”`, `Compare two approaches or collect one piece of real feedback`, `Record data, deviations, and the next revision`]
        : [`Recall the core principles before reopening the tutorial`, `Complete one deliverable step in “${plan.project}”`, `Check that the principle is preserved instead of copying the tool mechanically`, `Submit the output and one real-world signal`]
    : minutes === 5
      ? [`用自己的话写出核心原则：“${first}”`, `立刻在真实项目中完成一个最小动作`, `保存截图、链接或结果作为证据`]
      : minutes === 30
        ? [`不看教程，复述 ${plan.principles.length || 1} 条核心原则`, `在“${plan.project}”中完整执行一次`, `比较两种做法或获取一个真实反馈`, `记录数据、偏差和下一步修改`]
        : [`不看教程，先回忆核心原则`, `在“${plan.project}”中执行一个可交付步骤`, `检查是否保留核心原则，而非机械照抄工具`, `提交成果与一个真实结果信号`];
  $("#taskList").innerHTML = tasks.map((task) => `<li>${escapeHtml(task)}</li>`).join("");
  $("#evidenceHint").textContent = minutes === 5 ? t("evidenceShort") : t("evidenceLong");
}

async function reviewEvidence() {
  const evidence = $("#evidenceInput").value.trim();
  const selfRating = Number($("#selfRating").value);
  const blocker = $("#blockerInput").value.trim();
  if (evidence.length < 20) return alert(t("needEvidence"));
  const state = await getState();
  const plan = state.activePlan;
  const urlEvidence = /https?:\/\//.test(evidence);
  const dataEvidence = /\d+%|\d+\s*(个|次|人|条|份|users?|customers?|tests?|responses?)|反馈|发布|运行|用户|客户|feedback|published|launched|shipped|customer/i.test(evidence);
  const principleEvidence = plan.principles.some((p) => evidence.includes(p.slice(0, Math.min(8, p.length))));
  const fidelity = principleEvidence ? 32 : 24;
  const realWorld = dataEvidence ? 27 : urlEvidence ? 24 : 18;
  const quality = evidence.length > 140 ? 14 : evidence.length > 60 ? 11 : 8;
  const transfer = /调整|改成|结合|因为|适合|adapted|changed|combined|because|fit|suited/i.test(evidence) ? 9 : 6;
  const reflection = blocker || selfRating < 100 ? 8 : 5;
  const score = fidelity + realWorld + quality + transfer + reflection;
  const passed = score >= 80 && fidelity >= 25;
  $("#scoreValue").textContent = score;
  $("#decision").textContent = passed ? t("passed") : score >= 60 ? t("revise") : t("retry");
  $("#feedback").textContent = passed
    ? t("passedFeedback")
    : `${t("reviseFeedback")}${blocker ? ` ${t("blocker")}${blocker}` : ""}`;
  $("#scoreCard").hidden = false;
  state.submissions.push({ planId: plan.id, evidence, selfRating, blocker, score, passed, createdAt: Date.now() });
  await saveState(state);
  $("#scoreCard").scrollIntoView({ behavior: "smooth" });
}

function toggleSettings(show) {
  $("#settingsSection").hidden = !show;
  if (show) {
    $("#planSection").hidden = true;
    $("#sourceSection").hidden = true;
  }
}

async function showToday() {
  $("#todayNav").classList.add("active");
  $("#queueNav").classList.remove("active");
  $("#queueSection").hidden = true;
  $("#settingsSection").hidden = true;
  const state = await getState();
  if (state.activePlan) renderPlan(state.activePlan);
  else $("#sourceSection").hidden = false;
}

async function showQueue() {
  $("#queueNav").classList.add("active");
  $("#todayNav").classList.remove("active");
  $("#sourceSection").hidden = true;
  $("#setupSection").hidden = true;
  $("#planSection").hidden = true;
  $("#settingsSection").hidden = true;
  $("#queueSection").hidden = false;
  const state = await getState();
  $("#queueList").innerHTML = state.queue.length
    ? state.queue.map((item) => `<div class="queue-item"><b>${escapeHtml(item.title)}</b><small>${escapeHtml(item.platform)} · ${escapeHtml(item.project)}</small></div>`).join("")
    : `<div class="empty">${t("empty")}</div>`;
}

async function changeLanguage() {
  currentLanguage = $("#languageSelect").value;
  const state = await getState();
  state.profile = { ...state.profile, language: currentLanguage };
  await saveState(state);
  applyLanguage();
  if (state.activePlan) renderPlan(state.activePlan);
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage === "en" ? "en" : "zh-CN";
  $("#brandSubtitle").textContent = t("subtitle");
  if (!source) { $("#sourceTitle").textContent = t("sourceTitle"); $("#sourceMeta").textContent = t("sourceMeta"); }
  $("#readButton").textContent = source ? t("reread") : t("read");
  $("#fallback summary").textContent = t("noTranscript");
  $("#manualContent").placeholder = t("manualPlaceholder");
  $("#backToSourceButton").textContent = t("back");
  const setupLabels = $("#setupSection").querySelectorAll("label");
  $("#setupSection .eyebrow").textContent = t("setup"); setupLabels[0].textContent = t("projectLabel"); setupLabels[1].textContent = t("principlesLabel");
  $("#projectInput").placeholder = t("projectPlaceholder"); $("#principlesInput").placeholder = t("principlesPlaceholder"); $("#generateButton").textContent = t("generate");
  $(".progress-row span").textContent = t("weekly"); $(".hero-card .eyebrow").textContent = t("today"); $("#editPlanButton").textContent = t("edit");
  const modes = document.querySelectorAll(".mode"); modes[0].innerHTML = `${t("minimum")} <b>5m</b>`; modes[1].innerHTML = `${t("standard")} <b>15m</b>`; modes[2].innerHTML = `${t("deep")} <b>30m</b>`;
  $(".evidence-callout b").textContent = t("submitEvidence");
  const reviewCard = $("#evidenceInput").closest(".card"), reviewLabels = reviewCard.querySelectorAll("label");
  reviewCard.querySelector(".eyebrow").textContent = t("submitReview"); reviewLabels[0].textContent = t("evidenceLabel"); reviewLabels[1].childNodes[0].textContent = t("selfRating"); reviewLabels[2].textContent = t("blockerLabel");
  $("#evidenceInput").placeholder = t("evidencePlaceholder"); $("#blockerInput").placeholder = t("blockerPlaceholder"); $("#submitButton").textContent = t("submit");
  const settingsLabels = $("#settingsSection").querySelectorAll("label"); $("#settingsSection .eyebrow").textContent = t("settings");
  $("#languageLabel").textContent = t("language"); settingsLabels[1].textContent = t("defaultPractice"); settingsLabels[2].textContent = t("reminder"); settingsLabels[3].textContent = t("level"); settingsLabels[4].textContent = t("goal");
  $("#settingsSection input[disabled]").value = t("defaultMinutes");
  $("#levelInput").placeholder = t("levelPlaceholder"); $("#goalInput").placeholder = t("goalPlaceholder"); $("#saveSettings").textContent = t("save");
  $("#queueSection .eyebrow").textContent = t("queue"); $("#queueSection h2").textContent = t("oneAtTime"); $("#queueSection p").textContent = t("queueHelp");
  $("#todayNav").textContent = t("todayNav"); $("#queueNav").textContent = t("queueNav");
}

async function saveSettings() {
  const state = await getState();
  state.profile = { ...state.profile, language: currentLanguage, reminderTime: $("#reminderTime").value, level: $("#levelInput").value.trim(), goal: $("#goalInput").value.trim() };
  await saveState(state);
  await chrome.runtime.sendMessage({ type: "SCHEDULE_REMINDER", time: state.profile.reminderTime });
  alert(t("saved"));
  if (state.activePlan) renderPlan(state.activePlan); else { $("#settingsSection").hidden = true; $("#sourceSection").hidden = false; }
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}
