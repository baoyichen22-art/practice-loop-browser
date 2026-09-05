# Practice Loop

Practice Loop is a Chrome/Edge side-panel extension that turns user-selected YouTube and X tutorials into short, real-world practice sessions.

The page stays on the left while Practice Loop opens on the right. The extension helps the learner move from passive consumption to an active loop: understand, practice, submit evidence, revise, and retain.

## MVP features

- Chrome Manifest V3 side panel
- YouTube and X page capture
- Chinese and English interface
- 5, 15, and 30 minute practice modes
- One active plan plus a practice queue
- Evidence submission and self-assessment
- Scored feedback with an 80-point pass threshold
- Local profile and plan storage
- Daily browser reminders
- Return-and-edit flow for incorrect setup information

## Install locally

1. Download or clone this repository.
2. Open `chrome://extensions` or `edge://extensions`.
3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Choose this repository folder.
6. Open a YouTube or X tutorial and select the Practice Loop toolbar icon.

## Current boundary

This is a local MVP. It reads visible page text and a YouTube transcript when that transcript is present in the page. If a platform does not expose a transcript, the learner can paste a transcript, post, or notes manually.

Plans and user profile data stay in `chrome.storage.local`. No remote AI or transcription service is connected in this version.

## Product direction

The next layer will add reliable video transcription, semantic extraction of core principles, evidence-based practice generation, stronger artifact review, and spaced follow-up at day 7 and day 30.
