# Practice Loop Browser MVP

## Load in Chrome

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select the `practice-loop-browser` folder.
5. Open a YouTube or X tutorial and click the Practice Loop extension icon.

Chrome opens the extension in its side panel, alongside the current webpage.

## Current MVP boundary

The extension reads visible page text and any YouTube transcript already present in the page. When a platform does not expose a transcript, paste the transcript, post text, or notes into the fallback field. The local prototype generates and stores practice plans without sending personal data to a remote server.

The next integration layer should connect a trusted transcription/content service and the Practice Loop training engine so principles and scoring are generated semantically rather than by local heuristics.
