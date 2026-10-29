# QA report

Everything here was run in the build sandbox; numbers come from the commands shown. See also [docs/redesign/08-TESTING.md](redesign/08-TESTING.md), [docs/qa/DEFECTS.md](qa/DEFECTS.md) (D-001 to D-032) and [docs/qa/TRACEABILITY.md](qa/TRACEABILITY.md) (39 acceptance criteria, 0 without a test).

## Commands and results

| Command | Result |
|---|---|
| `npx eslint .` | clean |
| `npx vitest run` | 20 files, 319 tests passed |
| `node scripts/validate-spec.mjs` | 58 passed, 1 warning, 0 failed |
| `node scripts/validate-content.mjs` | 27 passed, 0 failed, 1 not run (A07: no dictionary bundled, readings not dictionary-verified) |
| `npm run build` | BUILD OK; licence audit OK (5 listed OFL fonts, 0 runtime dependencies); core precache 2863 KB of 8192 KB; map 36 KB of 120 KB |
| `npx playwright test` (Chromium 1280×800, 360×640, 390×844) | 268 passed, 2 skipped (desktop-only lesson sweep), 0 failed, 19.1 min |
| GitHub Actions on `main` | see the run for the merge commit (lint, validate, unit, build, Playwright, deploy) |

## What changed in this release

The complete visual and navigation redesign: [docs/redesign/](redesign/). Learning content and the engines (SRS, planner, exam, storage, backup) are unchanged; the redesign changed how they are presented. Defects found while doing it are D-026 to D-032.

## Not verified

WebKit/Firefox; real-device install on iPhone/Android (AC35); real screen readers; the live URL (not reachable from the sandbox); native-speaker review of Japanese content (`human_reviewed` is 0 %); N3-N1 content and 19 of 20 N5 mocks do not exist (see README and LIMITATIONS).
