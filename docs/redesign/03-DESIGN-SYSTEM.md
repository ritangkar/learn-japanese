# 3. Design system

Code: tokens in `src/ui/styles.css`, components/layout in `src/ui/theme.css`, helpers in `src/ui/components.js`, icons in `src/ui/icons.js`. Every text/background token pair is asserted ≥ 4.5:1 (UI pairs ≥ 3:1) in light, dark and OS-dark by `tests/unit/contrast.test.js`.

## Colour (tokens)

| Token | Light | Role |
|---|---|---|
| `--paper` | #FAF4E8 | page background (warm washi ivory) |
| `--surface` / `--surface-2` | #FFFDF9 / #F2E9D8 | cards / recessed areas |
| `--ink` / `--ink-2` | #1E2230 / #464C5C | primary / secondary text (sumi ink) |
| `--indigo` (+ `--indigo-deep`) | #233E78 (#162B57) | primary actions, active nav (ai-iro) |
| `--sakura-bg` / `--sakura-ink` / `--sakura` | #FCE7EC / #8A2548 / #F4BFCC | restrained accent: install card, stamp counts, scene art |
| `--vermilion` | #B4301E | stamps, destructive, "current stop" (shu) |
| `--matcha` | #3C6A2C | success, visited stops |
| `--gold` / `--gold-bright` | #7A5A0E / #D9A63B | reward text / reward fills (never used for body text) |
| ok/bad/warn/info pairs | existing | status banners and chips |

Dark mode has its own token set (deep indigo-night paper, same hues lightened). Pink is only used for accents and the install card, never for large surfaces.

## Typography

* Display (page titles, stop names, numbers): **Shippori Mincho** 600/700, self-hosted Latin subset, falls back to the device Mincho for Japanese.
* Body/UI: **Zen Kaku Gothic New** 400/500/700, self-hosted Latin subset.
* Japanese text: the device's Japanese fonts via the existing `.ja` stack (Hiragino, Noto Sans CJK JP, Yu Gothic, Meiryo). No CJK webfont is shipped: it would add megabytes and break the 8 MB core precache budget.
* Scale: eyebrow 0.75 rem caps · h1 1.6–1.9 rem · h2 1.3 · h3 1.05 · body 1 · small 0.875; Japanese vocabulary 1.5 rem (`ja-lg`), exercise stems 2.6–3 rem (`ja-xl`).

## Shape, depth, motion

Radius 16 (cards), 12 (small), pill for chips. Two shadow steps. 220 ms ease for state changes; keyframes only for sheet-in, pop-in, stamp-press, pulse. All disabled by `prefers-reduced-motion` and the in-app "reduce motion" setting.

## Icons

One 24-px, 1.8-stroke, round-cap set drawn for this project (~45 icons in `icons.js`). No emoji are used as UI icons any more. Icons are decorative (`aria-hidden`) unless a `label` is passed; icon-only buttons always carry `aria-label`.

## Components (all with hover, focus-visible, pressed, disabled; loading where relevant)

Buttons (primary, secondary, accent, ghost, danger, small, block, icon, loading) · app header with back/close · five-tab bottom nav · page hero over destination backdrop · station plate · cards (default, tint, flat) · list rows / menu items · progress bar and ring · stat tiles · segmented control (Map/List) · chips · banners · bottom sheet · modal dialog (native `<dialog>`: focus trap, Esc) and confirm dialog · toast · empty state · skeleton · stamp (framed SVG, 3 frames) and stamp book · completion screen · attempt card · install card · iOS steps.

## Assets and licences

Scenes, stamps, icons, map and the app icon are original vector/code art made for this project. The only third-party assets are the five font files (SIL OFL 1.1), listed in `content/assets.manifest.json`, shown on the Credits screen, checked by `scripts/license-audit.mjs` (build fails if a media file is unlisted). No images are downloaded at run time; every backdrop is generated inline SVG, so there is nothing to fail to load. If the SVG backdrop were somehow absent, the page falls back to the paper colour and a soft gradient.
