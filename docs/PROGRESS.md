# Progress log

(Updated at every phase. Local working branch `feat/tabi-nihongo`; pushed as `claude/tabi-nihongo-pwa-q9l93j`.)

## P0 – Repo inspection and scaffold

Environment: Node v22.22.0, npm 10.9.4, Linux. Chromium (Playwright 1.63.0) present; WebKit/Firefox browsers NOT installed and their download CDN returns 403 in this sandbox.

Repo state at start (recorded before any change):

```
$ git status
On branch claude/tabi-nihongo-pwa-q9l93j
No commits yet
nothing to commit (create/copy files and use "git add" to track)
$ git remote -v
origin  https://github.com/ritangkar/learn-japanese (fetch/push)
$ ls -la
.git only (empty repository, no commits, no CI, no Pages config, no unrelated files)
```

* New vs existing work: **everything is new**; the repository was empty (no commits), so no unrelated user work exists to preserve.
* Branch: working branch `feat/tabi-nihongo` created locally. The session designates `claude/tabi-nihongo-pwa-q9l93j` as the push branch (see P10).
* Spec: copied to `spec/application_spec.json`; SHA-256 verified = `1f02a1cada9f30d22cb0bdf33903c083ed95d4cacaacbc06d2e855144a0cb243` (match).
* `node scripts/validate-spec.mjs`: 58 passed, 1 warning (V34 informational), 0 failed.

| Status | Item |
|---|---|
| done | P0 |
| in progress | P1 |

## P1 – Core shell (done)
Gate AC01, AC05–AC08: `npx vitest run tests/unit/storage.test.js` 16 passed; `npx playwright test tests/e2e/shell.spec.js --project=chromium-desktop` 4 passed (sub-path `/learn-japanese/`, zero cross-origin requests, no console errors, "Ready offline" only when every precache entry is in Cache Storage). Commit `52322bf`.

## P2 – Content pipeline + real unit n5_u01 (done)
Validators A01–A16 plus X01–X12 (`node scripts/validate-content.mjs`: 27 passed, 0 failed, 1 not run – A07 "no dictionary"). 17 negative-fixture tests prove each validator fails on bad data. content_status recorded in `content/status.json`: everything `auto_checked`, nothing `human_reviewed`.

## P3 – Learning engine (done)
FSRS-4.5 ported from official `ts-fsrs` 3.5.7; 597 reference vectors + review steps + multi-review sequences match the library (`tests/unit/srs.test.js`). Planner rules E01–E12, missed-day logic, mastery, progress/rewards, exam, readiness: 221 unit tests at that point.

## P4 – Lesson and exercise UI (done)
Lesson player, 23 exercise types via seven renderers (with fallbacks), session runner, review, quests, drills, kana trainer with original stroke guides. E2E J01/J02-style journeys A and B pass.

## VERTICAL-SLICE GATE (mandatory before scaling content): PASSED
`npx playwright test tests/e2e/slice.spec.js --project=chromium-desktop`
```
✓ [chromium-desktop] › VERTICAL SLICE: unit + Tokyo destination + review loop + export/import + offline › N5 units 1-2, Tokyo quest -> stamp, review loop, export -> clean profile -> import, offline run (1.8m)
1 passed (1.8m)
```
What it demonstrates, through the UI only: both authored N5 units (14 lessons), the Tokyo destination state machine (available → quest → completed, stamp + postcard awarded once, replay does not duplicate), a review loop over due facets, JSON export → fresh browser context → import with preview + confirmation → identical lessons/stamps/facets, then an offline reload with the map, review and a lesson still working. Zero cross-origin requests.
Note: Tokyo's completion rule needs `n5_u02` (spec), so the slice authored n5_u01 AND n5_u02.

## P5 – Explore Japan (done)
SVG map (original simplified outlines), pins by shape, Okinawa inset, Tokyo sub-map, 27 generated scenes, stamps, journal, achievements.

## P6/P7 (done): audio engine (22 procedural sounds, 25 unit tests), JLPT hub, section practice, exam runner, readiness, planner.

## QA run 1 (before content batch 2)
* `npx playwright test` (Chromium: desktop 1280x800, 360x640, 390x844): **159 passed** (12.3 min), 0 failed.
* Defect found and fixed during this run: wide tables overflowed horizontally at 360/390 px (`#/content`); fixed with scrollable tables (commit `653774b`).
* `npx vitest run`: 278 passed; `npx eslint src scripts tests`: clean.

## P8 content batch 2
* `n5_u03` (combined sounds, small tsu, long vowels, X wa Y desu, question particle ka) and `n5_u04` (katakana I, numbers, kanji 一〜六, telling the time, station theme, Tokyo Station quest) authored by hand; validators 27 passed, 0 failed, A07 not run.
* New helper `spokenRomaji` so a standalone particle は / へ / を is shown as wa / e / o in romaji hints (unit-tested).

## P9 (in progress)
* `scripts/license-audit.mjs`, `scripts/check-fixtures-not-shipped.mjs`, `scripts/check-sizes.mjs` run in every build; negative fixtures for the licence audit.
* Docs: README (mock counters), LIMITATIONS, LICENSES, CONTENT_STATUS, FEATURES, generated `docs/qa/TRACEABILITY.md`.
* GitHub Pages workflow `.github/workflows/pages.yml` (lint, validate, unit, build, e2e; deploy only from the designated branch).

## P8 content batch 3 (N5 complete, first N4 units, first mock)
* `n5_u05`–`n5_u12`: N5 is now 12 of 12 units (all authored, validated, promoted). Destinations Konbini, Tokyo Tower, Residential Street, Asakusa, Shibuya, Shinjuku, Hakone and Mount Fuji each have a quest covered by a table-driven e2e journey (quest absent before prerequisites, one stamp afterwards, never duplicated).
* `mock_n5_01`: the first (and only) released mock — vocabulary 20 min / 25 questions, grammar & reading 40 min / 30, listening 30 min / 24. Mock-only items live in `content/mocks/`. **N5 mocks released: 1 of 20.** No mock was cloned, shuffled or paraphrased to reach the target.
* `n4_u01` (te-form in depth), `n4_u02` (permission, prohibition, obligation; Kamakura quest), `n4_u03` (plain form and casual speech; Nikko quest). N4 units 4+ are not authored.
* Tooling fixes found on the way: validator A10 compares full question text; promote ignores X09 circularity; coverage report syncs README blocks.
* Validators at this point: 27 pass, 0 fail, 1 not run (A07 dictionary check; no dictionary is bundled).
