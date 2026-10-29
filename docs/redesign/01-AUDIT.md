# 1. Current-state UI/UX audit (before the redesign)

How this was done: I read the code (`src/app.js`, `src/ui/**`, `src/map/**`, `src/pwa/**`), built the production bundle, served it under the GitHub-Pages sub-path and took screenshots of 12 routes at 390x844 and 1280x800 with Playwright/Chromium. Nothing below is guessed; each finding names where it was seen.

## Baseline

* Stack: vanilla ES modules + Vite 8, hash routing, hand-written service worker, `localStorage` (`jla:v1:` shards), zero runtime dependencies.
* Baseline checks before touching the UI: 293 unit tests, 195 Playwright tests across three Chromium viewports, lint clean, production build OK.
* The live site showed a white page because GitHub Pages was set to "Deploy from a branch" (raw source); that was a settings problem, fixed by switching the source to GitHub Actions. It is not a code defect.

## Findings (mapped to the reported problems)

| # | Where | Finding | Evidence |
|---|---|---|---|
| A1 | Whole app | Visual identity is flat: one indigo/ivory pairing, system font, generic rounded cards, no illustration outside one destination page. | screenshots of `/`, `/learn`, `/me` |
| A2 | Navigation | Four tabs (Explore, Learn, JLPT, Me) with emoji icons; "Me" is a grab-bag of 13 links; the stamp book and achievements were two levels down (Me → Travel journal). | `app.js` TABS, `me.js` |
| A3 | Header | The title "Tabi Nihongo" repeated on every screen; no route title, no back button. Each screen drew its own "← Back" button in the body (inconsistent labels/places). | `app.js`, `common.js` `back()` |
| A4 | Explore | The home route was the map. Pins were ~5 px on a phone (r=15 in a 1000-unit viewBox shown ~350 px wide). Labels hidden at zoom 1. | `render.js`, screenshot |
| A5 | Explore | Selecting a stop rendered a compact card below the map, out of view on phones; no artwork, no unlock requirements, no progress. | `explore.js` `destCard` |
| A6 | Explore controls | "Map / List" were two small buttons, "+ / −" had no visual meaning beyond text; no reset; nothing said what they did. | screenshot |
| A7 | Learn | Emoji icons (🔁 ⚖ 🪝 👂 🧩 🎯), a "Why this?" disclosure on every card, no sense of where you are in the day. | `learn.js` |
| A8 | Lessons | Back / Next at inconsistent places; the explanation was a plain card; completion was a bare list ("🎉 Lesson complete", "+N XP" lines). | `lesson.js` |
| A9 | Stamps | A generic red ring with the Japanese name. Not a collectible. No awarding moment; only a text banner on the quest result. | `stamps.js`, `practice.js` |
| A10 | Gamification | XP/streak only on "Me"; no explanation of what earns XP or how streaks work; no progress toward goals on the first screen. | `me.js` |
| A11 | JLPT | Level cards mix status, criteria text and counts; the unfinished attempt was a bare "Unfinished attempt" paragraph with two buttons; Discard acted immediately without confirmation. | `jlpt.js`, `exam.js` |
| A12 | Install | `beforeinstallprompt` was captured in `ctx.installPrompt` and **never used**. iOS guidance existed only as a tip in step 4 of the tour. No install control anywhere. | `app.js`, `info.js` |
| A13 | PWA | Manifest/SW were correct (scope, start_url, icons), but the icon was a crude blocky torii. | `public/icons/icon-512.png` |
| A14 | CSP | `style-src 'self'` forbids inline `style` attributes. Any new code that sets `style="..."` is silently dropped. (Found while redesigning: fixed centrally in `dom.js`.) | console errors during development |
| A15 | Accessibility | Contrast tokens were already tested. Emoji used as icons are read inconsistently by screen readers. | `labels`, `tabbar` |

## What was already good (kept)

* Learning engine, FSRS scheduling, planner, exam engine, validators, storage layer, backup/restore, content pipeline.
* Pins use shape + text, never colour alone. Keyboard-operable pins. WCAG-tested colour tokens.
* Honest content labelling (instructional levels unofficial, practice estimates, unverified cultural notes).

## Issues I could not reproduce

* "Buttons / bottom navigation broken": on desktop and phone viewports every tab link and button worked in the baseline e2e run; the reports are consistent with the inconsistent back controls (A3) and unclear Map/List/zoom controls (A6) rather than dead buttons. Real-device behaviour (iOS Safari) was not available to test.
