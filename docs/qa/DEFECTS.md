# Defect log

Every defect found while building and testing, with how it was found, how it was fixed and how the fix is covered. "Found by" names the test or tool that exposed it (several were found by my own tests failing, which is the point of having them).

| ID | Area | Defect | Found by | Fix | Regression coverage |
|---|---|---|---|---|---|
| D-001 | Storage | Compaction could re-enter itself while retrying a write after a quota error. | `tests/unit/storage.test.js` | Re-entrancy guard flag. | storage tests (quota, compaction) |
| D-002 | SRS | New card rated Good went straight to Review instead of Learning (only Easy graduates). | FSRS reference vectors (`tests/unit/srs.test.js`) | Ported the transition table from the library source. | 597 reference vectors plus multi-review sequences |
| D-003 | Romaji | `tu` / `とぅ` conflict: the converter table order produced the wrong kana. | `tests/unit/romaji.test.js` | Reordered the table. | romaji tests |
| D-004 | Build | ajv 2020 was imported from the wrong entry point. | validator run | `ajv/dist/2020.js`. | `npm run validate:content` in every build |
| D-005 | Content | Validators found real authoring bugs: digraph unit override (X06), words used before their lesson (X12), unit-2 stem equality (A08), missing spiral items (X03). | content validators | Authoring fixes (not validator weakening). | validators run in every build and in CI |
| D-006 | Tooling | `promote-content` promoted kana and units that had no lessons. | review of coverage output | Only units with lessons are promoted. | coverage report |
| D-007 | Test | Planner fixtures left SRS state behind, and review-minute rounding differed from the spec. | `tests/unit/planner.test.js` | Fixture helper clears SRS; rounding aligned to the spec. | planner tests |
| D-008 | UI | The literal text "null" appeared in the DOM when a builder received a null child. | e2e text scan | Null-safe `append` / `prepend` in `src/ui/dom.js`. | e2e text checks |
| D-009 | Map | Pins intercepted each other's clicks in dense areas. | `tests/e2e/explore.spec.js` | Re-optimised pin offsets, larger hit radius, labels shown from zoom 2. | explore e2e, map unit tests |
| D-010 | Accessibility | axe: `aria-pressed` on links; a "+N" text node in a pin read badly. | `tests/e2e/a11y.spec.js` | `aria-current` on links; decorative circles. | a11y e2e on every screen |
| D-011 | Keyboard | After choosing with a number key, Enter did not check; focus was not placed on the first choice because the session element was still detached. | keyboard e2e | Enter/number-key handler rewritten; focus set after attach. | a11y and keyboard e2e |
| D-012 | Layout | Wide tables overflowed the page at 360 px and 390 px (`#/content`, 213 px and 183 px). | Journey G e2e | Tables become horizontally scrollable below 600 px. | Journey G at three viewports |
| D-013 | Test | The service-worker update test flaked once on its first run (no controller yet). | pwa e2e | `waitSwReady` waits for a controller; 5 reruns passed. | pwa e2e |
| D-014 | Romaji display | A standalone particle は was shown as "ha" in sentence romaji. | self-review while authoring unit 3 | `spokenRomaji` shows wa / e / o for standalone は / へ / を. | `tests/unit/romaji.test.js` |
| D-015 | Validator | X06 rejected small katakana kana (ャ ュ ョ ァ ィ ゥ ェ ォ). | validators on unit 5 | Added the katakana small kana to the allowed set. | validators |
| D-016 | Validator | A10 compared only prompt and context, so listening questions with identical prompts all matched each other, and a second mock could have slipped through on audio text. | validators on mock 1 | The similarity test now uses the full question text (prompt, ja, context, audio text, choices). | negative fixtures in `tests/unit/validators.test.js` |
| D-017 | Tooling | `promote-content` could not promote new items because X09 (status consistency) is a function of the very statuses it writes. | promoting mock 1 | X09 is excluded from the promotion decision and re-run by `validate-content` afterwards. | validators |
| D-018 | Authoring helper | `meaningQuestions` produced fewer than four options for small vocabulary pools (the stride shared a factor with the pool size). | unit 8 authoring | Configurable stride; later units pass stride 1. | unit validators |
| D-019 | Test | Tests hard-coded "2 of 12 units", "0 of 20 mocks", and "no kanji released", so growing content failed them. | e2e after unit 4 | Counts are read from the shipped content. | jlpt, misc e2e |
| D-020 | Test | A planner unit test assumed N5 had partial content. | unit run after unit 12 | The test uses N4 (no released units). | `tests/unit/exam.test.js` |
| D-021 | Process | A commit with one failing unit test was pushed (the test depended on content size). | post-push unit run | Test fixed in the next commit; unit tests are now run before every commit. | CI workflow runs the unit tests before deploy |
| D-022 | Explore | N4 destinations (Kamakura, Nikko) showed "The quest for this stop has not been written yet" because quests live in the N4 level bundle, which the map and stop screens never loaded. | New journey C3 for Kamakura and Nikko | Home, Tokyo and stop screens load the bundle of every level the learner has opened (`loadUnlockedLevels`). | `tests/e2e/explore.spec.js` journey C3 (kamakura, nikko) |
| D-023 | Test | The full-mock e2e test raced the "Unfinished attempt" screen (conditional click on `#exam-resume`). | New full-mock test | Unconditional wait and click, as the other exam tests do. | `tests/e2e/jlpt.spec.js` full mock |
| D-024 | Test | AC28 content-status test hard-coded "0 of 20" N5 mocks; failed on all three viewports once mock 1 shipped. | Full e2e run (189 passed, 3 failed) | The count is read from `content/index.json`. | `tests/e2e/misc.spec.js` AC28 |
| D-025 | Test | AC29 keyboard-only lesson test failed intermittently (390x844, slower CI runner): after Continue the answered exercise was briefly still in the DOM, so the test read its stale answer/order and pressed the wrong key. | CI run on PR 2 (and an earlier CI run) | The test waits for a new question id before answering. | `tests/e2e/a11y.spec.js` AC29 (9/9 passes across 3 viewports locally) |
| D-026 | Layout | The bottom tab bar kept `display:flex` and so ignored the `hidden` attribute: it stayed on top of lesson content and intercepted taps (Next/Check) in immersive screens. | New redesign lesson tests (`Next` "intercepts pointer events") | Global `[hidden] { display: none !important }`. | redesign.spec (navigation, journeys 4/5/9), sanity lesson sweep |
| D-027 | Security/CSP | New UI set inline `style` attributes, which the strict CSP (`style-src 'self'`) silently blocks. | Console errors while building the redesign | `h()` / `s()` apply style strings through the CSSOM (`applyStyle`), keeping the CSP strict. | `tests/unit/redesign.test.js`, shell/sanity e2e (zero console errors) |
| D-028 | UI | `replaceChildren(null)` rendered the text "null" (the null-safe patch covered only `append`/`prepend`). Seen on the tour. | `sanity.spec.js` route crawl | `replaceChildren` is patched like `append`/`prepend`. | sanity route crawl |
| D-029 | Accessibility | Two `h1` per screen (header title and page title). | `shell.spec.js` strict-mode heading lookup | The header title is not a heading unless the screen has no `h1` of its own. | shell/a11y e2e |
| D-030 | Install | The install card only appeared if the browser offered installation before Home rendered; Chromium usually fires `beforeinstallprompt` after load. | Journey 1 test | Home subscribes to install availability and refreshes its slot. | redesign.spec journey 1 |
| D-031 | A11y/labels | Stamp-book links had an `aria-label` that did not contain the visible text (axe `label-content-name-mismatch`), and locked kana cells lost contrast through `opacity`. | `a11y.spec.js` axe sweep | Names come from content; locked cells use dashed borders and tokens, not opacity. | a11y e2e |
| D-032 | Test | Several tests assumed the map lived at `#/`, an old Discard label, the old tab set, and "no third-party assets". | First post-redesign e2e run | Updated to the new IA (`#/explore`, attempt card, five tabs, Credits lists the fonts) without weakening assertions. | whole suite |

## Known open issues (not fixed in this release)

* WebKit and Firefox are untested (browser download blocked in the build sandbox).
* Real iPhone / Android installation is untested (AC35).
* Japanese content is unreviewed by a native speaker (L-10); readings are not dictionary-verified (A07 not run).
* Kanji stroke-order diagrams are not available; the kanji screen says so.
