# AI Prompt — Continue the Doomsday Countdown Project

Copy the prompt below into a new AI or Codex conversation whenever you want to resume development.

---

## Prompt

Open the existing Doomsday-Countdown project in my workspace and continue editing that project. Do not create a replacement project, duplicate the app, or restart from a generic template.

First, inspect the existing project and read these files before making changes:

1. `PROJECT-NOTES.md` — current purpose, completed features, future roadmap, product principles, and handoff details.
2. `index.html` — the working single-file timer application and current source of truth for the user experience.
3. `PUBLISHING.md` — the here.now publishing workflow and security requirements.
4. `.env.example`, `.gitignore`, and `publish.mjs` — local configuration and publishing behavior.
5. `CONTINUE-PROJECT-PROMPT.md` — this continuation contract.

Do not display, quote, expose, upload, commit, or place the contents of `.env` into any source file. Never put `HERENOW_API_KEY` inside `index.html`. Treat all credentials as secrets.

The existing working application is the baseline. Preserve these behaviors unless I explicitly ask to change them:

- A five-hour cleaning and Puerto Rico packing schedule.
- A default 7:00 PM finish plan plus a “Start sprint now” option.
- Individual task countdowns, pause, restart, add-time, completion, and next-task controls.
- Local progress persistence.
- Early-finish time banking that redistributes unused time across unfinished tasks without moving the overall goal time.
- A beat-the-clock congratulations state when every task is completed early.
- Responsive phone and desktop layout.
- A standalone offline `index.html` that does not require a server.
- Optional authenticated here.now publishing that uploads only `index.html`.

My requested change for this session is:

> **[DESCRIBE THE CHANGE I WANT HERE]**

Before editing, give me a concise description of what you believe I want and identify any decision that truly requires my input. If the request is sufficiently clear, proceed without making me answer unnecessary questions.

While working:

- Make the smallest coherent changes that satisfy the request.
- Preserve the single-file offline version unless I explicitly authorize a larger architecture change.
- Keep the interface distraction-resistant: one obvious task, one obvious timer, and minimal competing controls.
- Keep touch targets, keyboard access, accessible labels, and phone responsiveness intact.
- Do not silently add accounts, tracking, analytics, subscriptions, databases, advertisements, or third-party services.
- For AI, music, authentication, hosting, or other external integrations, verify current official documentation before implementation and explain meaningful privacy, pricing, platform, and account limitations.
- Do not publish, deploy, change access permissions, or send data to an external service without my explicit instruction for that action.
- Update `PROJECT-NOTES.md` whenever a decision or feature materially changes the future handoff.

After editing:

1. Validate the HTML and JavaScript syntax.
2. Test the affected interaction in a real browser when browser testing is available.
3. Confirm that timers, progress saving, task completion, and phone layout still work when relevant to the change.
4. Verify that `.env` and secrets are not included in the published file.
5. Update the downloadable project package while preserving all unrelated files.
6. Tell me exactly what changed, what was tested, and give me the updated project file or link.

Treat `PROJECT-NOTES.md` as the product roadmap, but do not automatically implement future ideas merely because they are documented there. Only implement the change I request for the current session.

---

## Quick-use version

For smaller follow-ups, use this shorter prompt:

> Open my existing `Doomsday-Countdown` project and continue from its current files. Read `PROJECT-NOTES.md` and `CONTINUE-PROJECT-PROMPT.md` first, preserve the working standalone `index.html`, never expose `.env` or `HERENOW_API_KEY`, and do not create a replacement project. My requested change is: **[DESCRIBE CHANGE]**. Implement it, test the affected behavior, update the project notes when necessary, and return the updated project package.
