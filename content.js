chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== "READ_PAGE") return;
  sendResponse(readPage());
});

function clean(text) {
  return (text || "").replace(/\s+/g, " ").trim();
}

function readPage() {
  const host = location.hostname;
  const isYouTube = host.includes("youtube.com") || host === "youtu.be";
  const isX = host === "x.com" || host === "twitter.com";
  let title = clean(document.title);
  let body = "";
  let transcript = "";

  if (isYouTube) {
    title = clean(document.querySelector("h1 yt-formatted-string")?.textContent) || title;
    const description = clean(document.querySelector("#description-inline-expander")?.textContent);
    const segments = [...document.querySelectorAll("ytd-transcript-segment-renderer")]
      .map((node) => clean(node.textContent));
    transcript = segments.join(" ");
    body = description;
  } else if (isX) {
    const article = document.querySelector("article");
    body = clean(article?.innerText || document.querySelector("main")?.innerText);
  } else {
    body = clean(document.querySelector("main")?.innerText || document.body.innerText);
  }

  return {
    supported: isYouTube || isX,
    platform: isYouTube ? "YouTube" : isX ? "X" : "Web",
    title,
    url: location.href,
    excerpt: body.slice(0, 8000),
    transcript: transcript.slice(0, 30000),
    needsTranscript: isYouTube && !transcript
  };
}
