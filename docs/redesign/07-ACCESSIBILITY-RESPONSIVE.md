# 7. Accessibility and responsive requirements

* Contrast: token pairs tested (unit). Backdrop art never sits behind body text: heroes have a paper-coloured scrim, content is on opaque card surfaces.
* Keyboard: all controls are real buttons/links; modal dialogs trap focus and restore it; lesson keyboard flow (number keys + Enter) kept and tested; pins are focusable with Enter/Space.
* Names: icon-only controls have `aria-label`s; stamps are `role="img"` with text names; progress uses `role="progressbar"` with values; rings carry a text alternative.
* Live regions: feedback panels and the shell announcer are polite live regions.
* Zoom/scale: text scale setting still applies via root font size; layouts use rem and wrap.
* Layouts checked at 360×640, 390×844 (phone), 1280×800 (desktop) by Playwright; tab bar respects safe-area insets; sticky exercise footer sits above the bottom edge because the tab bar is hidden in immersive screens.
* Japanese: `lang="ja"` on Japanese runs; romaji hints unchanged; Latin-only webfonts so Japanese glyphs always come from a device font that supports them.
* Not verified: screen-reader testing on real devices (VoiceOver/TalkBack), large-text OS settings beyond the app's own scale, real-device safe areas.
