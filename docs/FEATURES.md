# Features: implemented, partial and deferred

## Implemented and tested
* Offline-first PWA: hand-written service worker, versioned precache, user-confirmed updates, "Ready offline" only when every precache entry is in Cache Storage (AC01–AC04).
* Storage: `localStorage` only (no IndexedDB), sharded and size-metered, corruption quarantine, tested migrations, export/import with preview, confirmation, checksum and validation (AC05–AC09).
* Learning engine: FSRS-4.5 scheduler (reference-vector tested), mastery model, daily planner with comeback / welcome-back / backlog modes, deterministic generators (AC20–AC22).
* Curriculum gating: level unlock needs all four criteria, no manual override (AC10–AC12).
* Lessons and 23 exercise types, kana trainer with original stroke guides, kanji introduced gradually with furigana.
* Explore Japan map (SVG ≤ 120 KB with list alternative), destinations with state machine, quests, stamps, postcards, journal (AC13–AC15).
* Audio: 22 procedural sounds, gesture-gated ambience (off by default), device text-to-speech with transcript fallback, optional local recording (AC16–AC18).
* JLPT area: official facts with source and date, section practice, exam runner with autosave, readiness check, exam-date planner, "N of 20 released" counters, "practice estimate" labelling (AC23, AC25, AC32–AC34).
* Accessibility: axe on all screens, keyboard flows, 44 px targets, reduced motion, 200 % text (AC29–AC31).

## Partial
* **Curriculum content:** N5 units 1–12 (all of N5) and N4 units 1–3 (see README and `content/coverage.md`). N4 units 4+ and N3–N1 have unit skeletons and unlock rules but no released units. Nothing is native-speaker reviewed.
* **Mock exams:** the mock runner and validators exist; **one** mock paper is released (N5 mock 1 of the 20 targeted per level, L-01). The README states the released count per level.
* **Kanji:** six kanji (一〜六) with readings and examples; stroke-order diagrams are not available.

## Deferred (not implemented in this release)
* D-012 "placement challenge" (a second route to unlock levels).
* Handwriting canvas with pointer capture (the guided handwriting exercise uses a static guide and self-check).
* Optional audio packs, KanjiVG stroke data, and external dictionary/corpus data (Tatoeba/JMdict/Tanos): not used.
* Secondary (non-primary) destination quests, other than those authored (see `content/quests.json`).
* Real-device checks (AC35): Android Chrome install and iPhone Home Screen instructions are shown in the app, but no device test was run.

## Redesign features (see docs/redesign/)
Five-tab navigation with a deterministic header back button; Home dashboard; location-aware backdrops; Explore map with stop sheet and magnifier zoom; station-style stamps, stamp-awarding moment and stamp book; unfinished-exam attempt card; install card (native prompt on Chromium, manual steps on iPhone/iPad Safari, hidden when installed, re-openable from Me). Not implemented: hand-drawn region polygons on the map, native-speaker audio, N3-N1 content.
