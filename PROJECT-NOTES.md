# Doomsday Countdown — Project Handoff

## Current purpose

This is intentionally a one-use, zero-setup HTML timer for José's five-hour home-cleaning and Puerto Rico packing sprint. Open `index.html` in a browser. It does not need a server, account, build step, or internet connection.

The current schedule is embedded directly in the HTML. Do not refactor it before tonight's sprint; the priority is that the existing page remains dependable and immediately usable.

## What already works

- A 12-block schedule totaling exactly five hours by default
- Editable scheduled start and finish times, defaulting to 7:00 PM–12:00 AM
- “Start sprint now” to use the current moment through the selected finish line
- Proportional task-time scaling so every block fits the selected time window exactly
- One active countdown with pause, restart, add-five-minutes, and next-block controls
- Completion checkboxes and overall progress
- Early-finish time banking: unused seconds are divided across unfinished tasks without moving the overall finish line
- A beat-the-clock congratulations message when the full list is completed early
- Audible/vibration alert when a block expires
- Local progress persistence through browser `localStorage`
- Responsive layout for phone and desktop
- A root-level `.env` location protected by `.gitignore`; credentials remain separate from the offline HTML
- A clearly marked `planDefaults` block in `index.html` for editing the title, subtitle, default times, hard-stop rule, and task list
- A restrictive single-file Content Security Policy and referrer policy with no external browser connections
- Optional authenticated here.now publishing through `publish.mjs`, restricted to `index.html` and verified after upload

## Repository and publishing

- Local location: `<project-root>` (wherever you cloned the repo)
- The repository is local-first and keeps `.env`, deployment state, packages, editor metadata, build output, and logs out of Git.
- Put `HERENOW_API_KEY` in the ignored root-level `.env` or the here.now-recommended `~/.herenow/credentials` file.
- `publish.mjs` is the only publishing entry point. It uploads only `index.html`; see `PUBLISHING.md`.
- A published site is public to anyone with the link by default. Do not change access controls without an explicit request.

## Future reusable version

The next version should separate plan data from the rendering engine while remaining local-first. Keep the tool simple: one renderer, one plan format, no backend.

Recommended structure:

```text
Doomsday-Countdown/
├── index.html
├── plans/
│   └── puerto-rico-prep.json
├── PLAN-SCHEMA.md
└── CREATE-PLAN-PROMPT.md
```

Because browsers may block `fetch()` for adjacent local files opened with `file://`, prefer either:

1. A JSON file picker/import button, or
2. A paste-JSON box that validates and loads a plan.

Do not rely on silently fetching `plans/*.json` unless the project is being served locally.

Suggested JSON shape:

```json
{
  "title": "Puerto Rico Prep Sprint",
  "subtitle": "Five focused hours. Done beats perfect tonight.",
  "defaultStartTime": "19:00",
  "hardStopRule": "When the timer rings, finish the one thing in your hands and move on.",
  "tasks": [
    {
      "name": "Kitchen reset",
      "minutes": 45,
      "details": "Load or stack dishes, clear sink, put items in their homes."
    }
  ]
}
```

## LLM-assisted plan creation

Later, add `CREATE-PLAN-PROMPT.md`. Its job should be to have an LLM ask a short series of questions and output valid plan JSON only. At minimum, it should ask:

1. What must be finished, and by what time?
2. What tasks are required, and which one is largest or messiest?
3. Which tasks can receive a quick pass instead of a deep pass?
4. Are breaks required?
5. Should overtime be allowed, or should each block be a hard stop?
6. What short instructions belong under each task?

The prompt should then verify that all task minutes equal the available window, prioritize the hardest task early, add a small final-reset block, and return JSON matching the documented schema.

## Longer-term product vision

Turn Doomsday Countdown into an all-in-one, music-powered timeboxing app for people who need momentum, structure, and a satisfying finish line. It should be useful for cleaning and chores, but remain general enough for packing, studying, project work, exercise, room resets, errands, and other deadline-based sprints. An important audience is people with ADHD, as well as anyone who works better with music, visible goals, short timeboxes, and immediate feedback.

### Natural-language and voice setup

- Make the primary entry point one large text box with optional voice dictation.
- Let the user describe what they need to accomplish in ordinary language, including a desired completion time or total time limit.
- Have an integrated AI model turn that input into an ordered, realistic timeboxed plan like the Puerto Rico prep sprint.
- The AI should identify the largest or messiest task, prioritize it appropriately, distinguish quick passes from deep work, include breaks when useful, and make all blocks fit the finish line.
- Let the user review, edit, reorder, add, or remove tasks before starting.
- Support follow-up instructions such as “give the kitchen more time,” “make this less intense,” or “I only have three hours now” without rebuilding the plan manually.
- Keep typing fully supported; voice should be optional convenience, not a requirement.

### Music integrations

- Explore integrations with Spotify, Apple Music, and YouTube or YouTube Music. Start with one provider rather than building all three at once.
- Let signed-in users choose a playlist, album, station, or individual songs from a compact music panel beside the active timer.
- Play music during a task block.
- When a timer expires, pause or lower the music and play a clear task-complete alert.
- Keep the music paused while the app asks the user to check off the task, extend it, or move to the next block.
- Resume music after the user acknowledges the alert and starts the next block.
- Preserve ordinary playback controls, volume control, and a no-music mode.
- Investigate each provider's playback SDK, account requirements, subscription limitations, mobile-browser restrictions, and rules before choosing the first integration. Do not assume every provider permits identical embedded playback behavior.

### Gamification and motivation

- Treat each block as a goal time, with unused time banked and shared across remaining tasks.
- Celebrate beating an individual block and give a larger celebration for beating the overall finish line.
- Consider points, streaks, levels, badges, personal bests, completion percentage, and “time reclaimed” statistics.
- Reward consistency and completion without punishing missed days or encouraging unhealthy urgency.
- Use encouraging, low-friction language and make recovery easy when a user falls behind.
- Consider optional modes such as Calm, Standard, and Challenge so the experience works for different energy and attention levels.

### Accounts, saved plans, and history

- A hosted version could support Google sign-in first, with other sign-in methods considered later.
- Save reusable plans, completed sessions, task results, planned versus actual times, time banked, music choice, and personal-best data.
- Provide a history view so users can see what they accomplished, when they used the app, and how their estimates improved.
- Let users duplicate a prior session and adjust it rather than starting from zero.
- Decide persistence after the product flow is proven. Options to evaluate include a normal application database, user-owned Google Drive files, or a Google Sheet. Do not choose Drive or Sheets merely because Google sign-in is present; compare privacy, reliability, query needs, offline behavior, portability, and operating cost.
- Keep data export and account deletion straightforward.

### Suggested product phases

1. **Reusable local planner:** JSON import/paste, plan validation, and offline timer engine.
2. **AI plan generator:** natural-language and voice input, editable generated schedule, no accounts required.
3. **Motivation layer:** early-finish banking, celebrations, personal bests, and accessible ADHD-friendly modes.
4. **First music provider:** one carefully chosen playback integration with timer-aware pause and resume.
5. **Hosted accounts:** Google sign-in, saved plans, session history, and a deliberately selected persistence layer.
6. **Expansion:** additional music providers, cross-device sync, richer insights, and optional social or shared challenges only if users actually want them.

### Product principles for a future agent

- The core promise is: describe the work, set the finish line, press start, and let the app carry the structure.
- Do not let AI, music, accounts, or gamification make starting a timer slower.
- Keep the plan editable and make AI output a suggestion, never an unexplained command.
- Design for distraction resistance: one obvious current task, one obvious timer, and few competing controls.
- Treat ADHD support as thoughtful product design, not a medical claim or cure.
- Request only the minimum music, microphone, Google, and storage permissions required for the feature the user activates.
- Keep a useful free/local mode even if a hosted version is built later.

## Guardrails for the next agent

- Preserve the single-file offline option.
- Do not add accounts, a database, analytics, subscriptions, or cloud dependencies.
- Keep imported plans on-device unless the user explicitly requests syncing.
- Maintain accessible labels, large touch targets, phone responsiveness, and keyboard operation.
- Add export/import of progress only if it remains understandable without instructions.
- Keep tonight's Puerto Rico plan as the first example plan and regression test.
