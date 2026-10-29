# Content status

**Nothing in this release is `human_reviewed`.** No native-speaker reviewer exists for this project (limitation L-10, open question U-010). The `human_reviewed` share is **0 %**, and a validator (X01) fails the build if any item claims `human_reviewed` without a named reviewer and date.

All shipped content is either `draft` (kept out of released units) or `auto_checked`. `auto_checked` means exactly: *the item passed the automated checks A01–A16 and X01–X12* (schema, unique ids and references, kana-only readings with a romaji round-trip, kanji and vocabulary gating by unit and by lesson, multiple-choice integrity, accept-list normalisation, spiral rule, grammar question rule, no placeholder text, no fabricated JLPT claims, and so on). It does **not** mean a person checked the Japanese.

Live counts: [content/coverage.md](../content/coverage.md) (generated) and the *Content status* screen in the app (computed from the shipped bundles).

## Automated checks that did not run

| Check | State | Why |
|---|---|---|
| A07 Reading plausibility (dictionary cross-check) | **NOT RUN** | No build-time dictionary is bundled (third-party dictionary data is off by default). Readings are **not** dictionary-verified. |
| A10–A12 mock distinctness | Run, vacuous | Zero mocks are released, so there is nothing to compare. They are unit-tested with negative fixtures. |

## Human review checklist (all PENDING)

Every check below is pending because there is no reviewer. Status values are `PENDING`; none is passed.

| ID | Check | Status |
|---|---|---|
| H01 | Sentence naturalness and register | PENDING |
| H02 | Translation accuracy and nuance | PENDING |
| H03 | Grammar explanation correctness and level-appropriateness | PENDING |
| H04 | Distractor plausibility and non-ambiguity (no second correct answer) | PENDING |
| H05 | Kanji reading correctness in context | PENDING |
| H06 | Listening script natural speech and difficulty | PENDING |
| H07 | Cultural note fact-check | PENDING |
| H08 | Exam-style realism versus official item-type descriptions | PENDING |

## Provenance

All content is original: written for this project by an AI assistant at the owner's direction (`content/provenance.json`, profile `orig`, CC BY 4.0). No official JLPT questions, word lists, textbook text, or third-party corpora were copied. Level tags are instructional (unofficial). Templated questions (for example one meaning question per vocabulary word) are tagged `templated` and counted separately from hand-written questions.

## How a human reviewer would promote content

1. Review an item against H01–H08.
2. Record `human_reviewed` with `reviewer` (name) and `reviewed_on` (date) in `content/status.json`.
3. Run `npm run validate:content` (X01 verifies the name and date) and `npm run coverage`.
