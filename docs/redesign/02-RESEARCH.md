# 2. UI/UX research: what was actually consulted

**Limits, stated plainly.** This session had web *search* but most web *page fetches* were blocked by the sandbox network policy (`en.wikipedia.org`, `developer.mozilla.org`, `web.dev`, `uxplanet.org`, `hyperallergic.com` did not resolve; the Apple HIG fetch returned only a page title). So the findings below come from **search-result summaries**, not from reading full articles, and some come from my own prior knowledge (marked "prior knowledge, not verified here"). No site or app was installed or run; I did not open Duolingo, Busuu, Memrise or LingoDeer. Treat this as a light-weight desk review, not primary research.

## A. Language-learning products

Sources (search results): [UX and Gamification in Duolingo](https://uxplanet.org/ux-and-gamification-in-duolingo-40d55ee09359), [Analyzing Duolingo from a product design perspective](https://uxplanet.org/analyzing-duolingo-from-product-design-perspective-after-400-days-of-non-stop-practice-c4d4809bdb37), [Duolingo UX breakdown (925studios)](https://www.925studios.co/blog/duolingo-design-breakdown), LingoDeer reviews ([Tofugu](https://www.tofugu.com/japanese-learning-resources-database/lingodeer/), [Ling review](https://ling-app.com/blog/lingodeer-review/), [Self Taught Japanese](https://selftaughtjapanese.com/2018/05/08/japanese-learning-app-review-lingodeer)).

What the summaries said, and what I did with it:

| Finding (secondhand) | Decision here |
|---|---|
| Progress should be visible as you move through lessons; progress bars use the pull of unfinished tasks. | Lesson stage chips + progress bar; journey line on Home; stamp-book progress bar. |
| Streaks/XP/levels give "something always advancing"; streak-retention figures are reported only secondhand. | Streak, weekly ring and XP stay, but only shown once they mean something (no empty/zero stats for new learners) and with an honest "how it works" panel. |
| Critics call parts of the economy/mascot manipulative. | No loss-aversion nags, no fake urgency; one-day gaps bridged by existing rules; gamification can be turned off (existing setting). |
| LingoDeer lessons are short (~5 min), grammar explained in separate tips; audio/sound praised; illustrations praised. | Short explain steps before practice; original illustrated scenes; optional procedural sound (existing). |
| Busuu unlocks chapters gradually; Memrise leans on context. | Stops unlock by finished units (existing rule), now with the exact requirement shown; dialogues/passages remain central. |

I deliberately did not copy any layout, mascot, palette or wording.

## B. Japanese travel / visual culture

Sources (search results): [Eki stamp (Wikipedia)](https://en.wikipedia.org/wiki/Eki_stamp), [National Geographic: guide to collecting eki stamps](https://nationalgeographic.com/travel/article/practical-guide-to-collecting-japans-eki-train-station-stamps), [Hyperallergic: design nostalgia of station stamps](https://hyperallergic.com/the-design-nostalgia-of-japans-train-station-stamps), [Spoon & Tamago: JR East redesign of 78 stamps](https://spoon-tamago.com/japan-train-station-stamp-redesign/).

From the summaries: eki stamps are free commemorative rubber stamps at stations; the practice dates to the early 1930s (one account says Fukui, 1931; sources differ slightly); designs typically combine a local landmark, Japanese characters and a local speciality (*meibutsu*); people collect them in booklets; railway companies also run "stamp rallies"; a digital version appeared in 2022.

Decisions: each stamp is an **original** framed mark (circle, rounded square or oval chosen per destination) with the place name in Japanese, a small landmark glyph, the romanised name and the date, in one ink colour per level (vermilion for N5). A stamp **book** groups them by level with dashed silhouettes for stops not yet visited. The visual tone (washi ivory, sumi ink, ai-iro indigo, shu vermilion, sakura accents) uses colours traditionally associated with Japanese print/stationery; I did not reproduce any real station stamp or JR artwork. The Latin display face (Shippori Mincho) is a Mincho (serif) used in print/editorial Japanese design; body face Zen Kaku Gothic New is a modern gothic similar to signage faces. Both are SIL OFL, self-hosted, Latin subset only (Japanese glyphs come from the device fonts, so no large CJK download).

Stereotype check: no geisha/samurai clichés; landmarks used are stops that exist on the route (station, tower, torii, pagoda, castle, Fuji, sea, snow).

## C. Interaction patterns

* Install: search results (web.dev "Installation prompt" summary, Apple Developer Forums thread requesting `beforeinstallprompt` for Safari, vendor boilerplates) agree on: stash the `beforeinstallprompt` event and call `prompt()` from your own button; iOS Safari has no such API, so show Share → Add to Home Screen instructions; Chrome on iOS cannot install PWAs; hide the prompt when already standalone; don't nag. Implemented in `src/pwa/install.js`.
* Bottom sheet for map details: non-modal sheet while the map stays interactive, visible grab affordance, dismissable (eleken guide, a vp0 article quoting Nielsen Norman Group, eBay playbook; all secondary sources, no official Material page found). Implemented as an inline sheet directly under the map with artwork, status, requirements, progress, stamp preview and one primary action.
* Tab bars: 3–5 tabs, label + icon, stable set, active state obvious (Apple HIG summary; my fetch of the HIG page returned only its title, so this is prior knowledge, not verified here). Five tabs: Home, Explore, Learn, JLPT, Journal.
* Touch targets: WCAG 2.2 AA minimum 24×24 CSS px, AAA 44×44 (search results from W3C understanding pages / Deque). All controls here are ≥ 44 px.
* Reduced motion: `prefers-reduced-motion` is honoured globally (existing CSS) and by the confetti and the stamp animation (prior knowledge of the media query; WCAG 2.3.3 reference not verified here).

## D. Tools

* UI/UX Pro Max / Motion / animation libraries: **not installed.** The project rule is zero runtime dependencies, and everything needed (transitions, a stamp "press" keyframe, a sheet slide-in, a progress ring) is plain CSS/SVG. An available design skill in this session ("design-taste-frontend") targets landing pages and was not used.
* Added assets: 5 Latin-subset `.woff2` files (≈ 96 KB) from the `@fontsource` npm packages (copied into `public/fonts`, licences recorded in `content/assets.manifest.json` and shipped as OFL text).
