chrome.runtime.onInstalled.addListener(async () => {
  await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  const { practiceLoopState } = await chrome.storage.local.get("practiceLoopState");
  if (!practiceLoopState) {
    await chrome.storage.local.set({
      practiceLoopState: {
        profile: { dailyMinutes: 15, minimumMinutes: 5, weeklyTarget: 1 },
        activePlan: null,
        queue: [],
        submissions: [],
        streak: 0
      }
    });
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== "SCHEDULE_REMINDER") return;
  const when = nextOccurrence(message.time || "20:30");
  chrome.alarms.create("practice-loop-daily", { when, periodInMinutes: 1440 });
  sendResponse({ ok: true, when });
  return true;
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== "practice-loop-daily") return;
  const { practiceLoopState } = await chrome.storage.local.get("practiceLoopState");
  if (!practiceLoopState?.activePlan) return;
  const english = practiceLoopState.profile?.language === "en";
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon.svg",
    title: english ? "Today's Practice Loop" : "今天的 Practice Loop",
    message: english ? `Make 15 minutes of progress: ${practiceLoopState.activePlan.title}` : `用 15 分钟推进：${practiceLoopState.activePlan.title}`,
    priority: 1
  });
});

function nextOccurrence(value) {
  const [hour, minute] = value.split(":").map(Number);
  const now = new Date();
  const next = new Date();
  next.setHours(hour, minute, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next.getTime();
}
