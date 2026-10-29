# 8. Testing strategy and results

## Layers

| Layer | Tool | What it covers |
|---|---|---|
| Unit | Vitest (`tests/unit`, 20 files, 319 tests) | engine, storage, SRS vectors, exam, planner, validators; new: `install.test.js` (platform detection, prompt flow, snooze, standalone), `redesign.test.js` (icons, CSP-safe styles, stamps, scenes, pin scaling, back rules, components, requirements), contrast tokens, licence audit, map |
| Content/spec | `validate-spec`, `validate-content` (27 pass, 0 fail, 1 not run), `author --check` | content integrity (unchanged by the redesign) |
| Build checks | `npm run build` | licence audit (5 listed fonts), size budgets (core precache 2863 KB of 8192 KB), fixtures-not-shipped |
| End to end | Playwright, Chromium at 1280×800, 360×640, 390×844 | 90 tests × 3 projects (270 runs; 2 skipped by design: the lesson sweep runs on desktop only) |
| Accessibility | axe-core inside Playwright, keyboard-only flows, 44 px targets, reduced motion | every screen light + dark |

## Synthetic profiles (`tests/e2e/profiles.js`)

new learner · partial progress · stamped learner (units, quest, stamp, postcard, XP, streak) · streak learner (study days, achievement) · locked (N4+ locked). Injected into isolated browser contexts through the app's own store; real data is never touched. Corrupt/invalid imports and an unfinished exam attempt are covered by `misc.spec.js` and `redesign.spec.js`.

## Journeys required by the brief, and where they live

| # | Journey | Test |
|---|---|---|
| 1 | First launch and installation | `redesign.spec.js` "Journey 1" (+1b iPhone/iOS-other-browser), `journeys.spec.js` Journey A |
| 2 | Learning and persistence | `journeys.spec.js` A/B, `slice.spec.js` |
| 3 | Explore Japan | `explore.spec.js` "journey 3" ×2 (several stops, backdrop, lock reasons, zoom/reset, Map/List), C2/C3 for every stop with a quest |
| 4 | Stamp collection | `redesign.spec.js` "Journey 4 and 5" (modal, book, reload, replay no duplicate, reduced motion) |
| 5 | Gamification | same block (XP only from activity, repeat limits, explained rules), `explore.spec.js` C, achievements |
| 6 | JLPT | `redesign.spec.js` "Journey 6", `jlpt.spec.js` (autosave, resume, discard, unlock criteria, full mock) |
| 7 | Export / import | `slice.spec.js`, `misc.spec.js` Journey H (corrupt, tampered, newer version; valid data untouched) |
| 8 | Offline | `pwa.spec.js` Journey F, `slice.spec.js`, `redesign.spec.js` "Journey 8" |
| 9 | Mobile and desktop | `redesign.spec.js` "Journey 9", `misc.spec.js` Journey G, axe at 3 viewports |
| 10 | GitHub Pages sub-path build | `shell.spec.js`, `pwa.spec.js`, `redesign.spec.js` "Journey 10" (served under `/learn-japanese/` by `scripts/serve-subpath.mjs`) |
| – | Whole-app sanity | `sanity.spec.js`: every route renders with no console errors or placeholder text; first and last lesson of every released unit plays to the summary |

## Results of the final run (this repository state)

* `npx eslint .`: clean.
* `npx vitest run`: 20 files, 319 tests passed.
* `npx playwright test` (all three projects): **268 passed, 2 skipped, 0 failed** (19.1 min). The offline journey added after that run was run separately: passed.
* `npm run build`: OK (spec validator 58 passed / 1 warning, content validators 27 passed / 1 not run).

## Not tested

WebKit and Firefox (browser downloads are blocked in the build sandbox), real iPhone/Android installation and Add to Home Screen, real screen readers (VoiceOver/TalkBack), real-device safe-area insets, the production URL itself (the sandbox cannot reach `github.io`; deployment is verified through the GitHub Actions run).
