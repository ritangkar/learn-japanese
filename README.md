# Tabi Nihongo (working title)

A zero-cost, offline-first Japanese-learning web app (PWA) with a JLPT-oriented curriculum (N5 to N1 instructional levels), spaced repetition, original practice exams, and a travel-through-Japan map that rewards progress. It is a static site: no server, no accounts, no database, no AI or model API, no third-party requests at runtime. All progress stays in your browser (`localStorage`) and can be exported to and imported from a JSON file.

> **Honest status.** This is release 1.0-candidate content-wise **partial**. Read [Release status](#release-status) and [docs/LIMITATIONS.md](docs/LIMITATIONS.md) before relying on it.
> The app is not affiliated with, endorsed by, or connected to the JLPT organisers. Level tags are **instructional levels (unofficial)**. Results are **practice estimates, not JLPT scores**. Every mock says: *Original practice exam. Not an official JLPT paper.*

## Release status

### Mock exams: released versus the long-term goal of 20 per level

The long-term goal is 20 distinct mock exams per level (100 in total). **That goal is not met in this release.** Mocks are never padded, cloned, shuffled, relabelled or lightly paraphrased to hit a number.

| Level | Mocks released | Long-term goal |
|---|---|---|
| N5 | 0 of 20 released | 20 |
| N4 | 0 of 20 released | 20 |
| N3 | 0 of 20 released | 20 |
| N2 | 0 of 20 released | 20 |
| N1 | 0 of 20 released | 20 |

The in-app JLPT screen shows the same numbers, computed from the shipped content. The section practice, readiness check, planner and exam runner are fully implemented and tested; there is simply no mock paper content that meets the distinctness validators yet. Release 1.0 keeps the exam runner usable through section practice built from the original practice questions.

### Content coverage

Live numbers are generated into [content/coverage.md](content/coverage.md) (`npm run coverage`) and shown in the app under *Content status*. Summary at the time of writing:

* N5: 4 of 12 planned units released (hiragana, first greetings, combined sounds and self-introduction, katakana I with numbers, time and a station theme).
* N4 to N1: no units released yet. The curriculum skeleton and unlock rules exist; the units are marked `to_be_authored` and are not releasable.
* `human_reviewed` share: **0 %**. No native-speaker reviewer exists for this project. All content is `auto_checked` at best: it passed the automated validators, nothing more.
* Readings are **not dictionary-verified** (validator A07 is "not run": no dictionary is bundled).

### What is verified (and what is not)

See [docs/qa/TRACEABILITY.md](docs/qa/TRACEABILITY.md) and [docs/QA_REPORT.md](docs/QA_REPORT.md). Real-device checks (AC35, iPhone Home Screen install, Android install) are **not run**. WebKit and Firefox could not be installed in the development sandbox (browser download CDN returned 403); only Chromium was tested.

## Features

* Lessons, exercises (23 types), spaced repetition (FSRS-4.5 ported from the open-spaced-repetition `ts-fsrs` 3.5.7, at day granularity), daily planner with comeback / welcome-back / backlog modes.
* Kana trainer with original (simplified) stroke guides; kanji introduced gradually with furigana.
* JLPT area: official test structure facts (sections, minutes, pass marks, with source and verification date), section practice, an exam runner with timers and autosave, a readiness check, and an exam-date planner that never promises a pass.
* Explore Japan: SVG map with 27 destinations in 9 regions, quests, stamps, postcards, journal.
* Procedural audio (22 original sounds), optional ambience (off by default, gesture-gated), device text-to-speech with a transcript fallback, optional local recording for self-comparison.
* Export / import with preview and confirmation, quarantine of corrupted data, storage meter with warnings.
* Accessibility: keyboard flows, 44 px targets, reduced motion (OS and in-app), 200 % text, axe-checked screens.

Deferred or not implemented features are listed in [docs/FEATURES.md](docs/FEATURES.md).

## Development

Requirements: Node 22+.

```bash
npm ci
npm run check        # spec validator, content validators, licence audit, lint, unit tests
npm run build        # full production build into dist/ (also runs validators and budget checks)
npm run preview      # serves dist/ under /learn-japanese/ on http://localhost:4173/learn-japanese/
npx playwright test  # end-to-end tests (Chromium; set ALL_BROWSERS=1 to add WebKit and Firefox where installed)
```

Content pipeline: `content/authoring/*.mjs` (hand-written) → `node scripts/author.mjs` → `content/<collection>/<unit>.json` → `npm run validate:content` (A01–A16, X01–X12) → `node scripts/promote-content.mjs` → `npm run build`.

## Deployment (GitHub Pages)

`.github/workflows/pages.yml` lints, validates, tests, builds `dist/` with relative URLs (`base: './'`) so the site works under `https://<user>.github.io/<repo>/`, and deploys with the official `actions/deploy-pages` action. Enable *Settings → Pages → Source: GitHub Actions* once in the repository. The deploy job runs only on pushes to the designated branch and on manual dispatch.

## Licences

Code: MIT. Original content: CC BY 4.0. No third-party assets, fonts, audio, mascots or logos are included. See [docs/LICENSES.md](docs/LICENSES.md) and the credits page in the app.
