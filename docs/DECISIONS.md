# Decisions and spec reconciliations

Source of truth: `spec/application_spec.json` (SHA-256 `1f02a1ca…0cb243`, verified identical to the supplied file on 2026-10-29).
Where prose differs from the JSON, the JSON wins. Differences found are listed here.

## Reconciliation decisions applied (owner brief)

| # | Topic | Decision |
|---|---|---|
| 1 | Level N+1 unlock | ALL of: released units completed ≥ 90 %, internal mastery average ≥ 0.7, passed readiness check (40 mixed questions, ≥ 70 %, every skill group ≥ 50 %), and a milestone practice ≥ 65 % (a heuristic, not an official threshold). Thresholds apply to **released units only**; the UI says so. No manual override. |
| 2 | AC ids | Follow the JSON. Mock counters = AC25. AC32–AC34 = readiness, planner, official facts. |
| 3 | Storage | Budget 1.5 MB; warn at 2500 KB; urgent at 3500 KB. At urgent or on `QuotaExceededError`: compact once, retry, then a blocking export prompt without discarding in-memory state. |
| 4 | Sounds / icons | 22 sound ids (JSON count; prose said 21). 4 PNG icons (192, 512, maskable 512, apple-touch 180). |
| 5 | Speech | Presets 0.9 / 0.65 / 0.5; slider 0.5–1.0 (prose said 0.6–1.0). |
| 6 | Manifest | `start_url "./#/"`, `scope "./"` (prose said `"./"`). |
| 7 | Scoring groups | Taken from each question's `section` field (vocabulary, grammar, reading, listening). N5/N4: Language Knowledge + Reading is one 0–120 group, Listening is a 0–60 group. N3–N1: three groups of 0–60 (language knowledge = vocabulary+grammar, reading, listening). Only percentages are shown; no scaled scores. |
| 8 | First rewards | First XP after lesson 1. First stamp at Tokyo completion (`n5_u02` + `QT_GREET` ≥ 0.8). (JSON journey J01 says "Tokyo arrival stamp" after the first lesson; the destination definition `tokyo.completion` requires `n5_u02`, which is the stricter rule and is what is implemented.) |
| 9 | content_status | enum `draft / auto_checked / human_reviewed`. Units marked `to_be_authored` are not releasable. Cultural notes carry a separate fact-check marker (`draft_requires_fact_check`) and always show "unverified". |
| 10 | A07 | Runs only if a build-time dictionary exists; otherwise reported "not run". It does not block `auto_checked`. **Readings are not dictionary-verified**; documented in README, CONTENT_STATUS.md. |
| 11 | Mock blueprint | Per-section question counts (U-002) are unknown; they live in `content/mock_blueprint.json`, labelled "approximate planning blueprint, not official counts". |
| 12 | CEFR | No CEFR display anywhere in the app (JSON `cefr_reference` fields are not rendered). |
| 13 | Licences | Code MIT; original content CC BY 4.0 (changeable, U-006). Kana stroke guides are original and simplified; **KanjiVG is not used** (U-005). Kanji stroke diagrams deferred; the kanji screen says "stroke order not available yet". |
| 14 | SRS | See "SRS provenance" below. |

## SRS provenance (D-010, U-003)

* Source: official open-spaced-repetition `ts-fsrs` **3.5.7** (MIT, npm tarball, git repository `open-spaced-repetition/ts-fsrs`), which implements FSRS-4.5 (17 default weights, `DECAY = -0.5`, `FACTOR = 19/81`).
* Equations and default weights in `src/engine/srs.js` were ported by reading that package's `dist/index.mjs` (not from memory).
* `scripts/generate-fsrs-vectors.mjs` runs the real library (dev dependency only; never bundled) over a grid and writes `tests/vectors/fsrs45.json`. `tests/unit/srs.test.js` asserts the port equals those vectors.
* Deviation (documented): the library schedules learning steps in minutes (1/5/10 min). This app schedules per facet in whole days (storage encoding is day-epoch based, per spec). First exposure uses `init_stability` and the interval rule from the same library; no sub-day steps. Fuzz is disabled (determinism).
* The Leitner fallback from the spec is also implemented and table-tested but is not the active scheduler.

## JSON vs prose differences found

| Item | Prose | JSON (used) |
|---|---|---|
| Sound ids | 21 | 22 |
| Speech rate range | 0.6–1.0 | presets 0.9/0.65/0.5 |
| Mock counters AC | AC23 | AC25 |
| Manifest start_url | `./` | `./#/` |
| Storage warn threshold | 3.0 MB (D-003, research report) | `thresholds` 2500/3500 KB (and owner brief) |
| Icon count | 3 | `planned.icons.count` 3 but lists 4 types |
| Validator section count | "41 sections" (validation report) | 45 sections in the file; V03 here checks all 45 |

## Spec points deliberately not implemented in 1.0 (see docs/FEATURES.md)

* D-012 "placement challenge" (timed quiz that satisfies the curriculum threshold) – deferred; the brief states no manual override and the placement path would be a second unlock route needing its own content.
* Handwriting canvas (pointer capture) – the guided handwriting exercise uses a static stroke guide plus self-check (allowed fallback).
* Optional audio packs, KanjiVG stroke data, Tatoeba/JMdict/Tanos data – not used (default: not used).

## Validator note

`scripts/validate-spec.mjs` reproduces V01–V34 from the validation report's description. The original Python validator was not supplied, so check logic was re-derived from the report's check names and messages; it is a re-implementation, not a copy.
