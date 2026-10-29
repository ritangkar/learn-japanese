# 5. Screen-by-screen plan (what was built)

| Screen | Result |
|---|---|
| First launch / tour | 4-step welcome with progress bar; the install card appears on the first and last step where an install path exists. |
| Install | `src/pwa/install.js` + `install-ui.js`: native prompt on Chromium; Share → Add to Home Screen steps on iPhone/iPad Safari; "open in Safari" on other iOS browsers; hidden when installed; 14-day snooze after "Not now"; permanent row in **Me** to reopen it. |
| Home | Location backdrop for the current stop, station plate, "Welcome aboard" (new learner) or "You are in <stop>", one dark **next step** card (resume/start), unfinished-exam card first when there is one, install card, weekly ring + week dots, streak/XP/lessons tiles (only after first activity), N-level journey line, stamp preview, quick links. |
| Explore | Map/List segmented control; magnifier zoom in/out + reset (with % readout); big pins; starts zoomed on phones, centred on the current stop; tapping a pin changes the backdrop and opens the **stop sheet** (art, status, objectives, unlock requirements or progress, stamp preview, primary action); `?stop=` keeps the selection. List view with thumbnails. |
| Stop page | Hero over the stop's scene, requirements checklist, quests, stamp, revisit tiers, cultural note (still marked unverified), ambience. |
| Learn | Hero + week dots; step cards with icons, minutes, type and "why this"; optional extras; quick links. |
| Lesson | Stage chips (Learn · Practice · In context · Check), goal card, explanation steps with progress and consistent Previous/Next, sticky Check/Continue footer, close-with-confirm. |
| Exercises | Same logic as before; choice cards, feedback panel with icon, explanation, sticky actions. |
| Completion | Accuracy ring, XP/stamp/achievement tiles from the events the engine actually awarded, stamp-earned banner, then the **stamp awarding modal** (stamp presses onto a paper page, optional sound, "See my stamp book"). |
| Journal | Stamp book grouped by level with silhouettes, detail dialog per stamp, postcards, milestones, cultural discoveries, "How rewards work" (XP rules with caps, streak rule, unlock rule, no duplicates). |
| JLPT hub | "What do you want to do?" (learn / practise / mock / review), attempt card first, level cards with lock reasons and progress, criteria in a disclosure. |
| JLPT level | Practice sections as buttons with icons, mock list, readiness/milestone, official structure in a disclosure, units, self-report. |
| Exam | Same engine; resume screen replaced by the attempt card (answers saved, time left, what Resume/Discard do; Discard confirms). `#/exam?resume=1` resumes directly. |
| Me | Profile hub with install row and icon list. |
| Others | Settings, backup, storage, status, library, kana, speak, info screens share the new header block and tokens. |
