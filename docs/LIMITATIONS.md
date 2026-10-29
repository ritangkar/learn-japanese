# Limitations of this release

These are explicit, user-visible limitations (they are also shown in the app under *About*). They come from `spec/application_spec.json` (`limitations.items`) plus facts measured in this repository.

| ID | Limitation |
|---|---|
| L-01 | The target of 20 distinct mock exams per level (100 in total) is **not met**. Released mocks: N5 1, N4 0, N3 0, N2 0, N1 0 (see README). |
| L-02 | Listening audio is synthetic (the device's text-to-speech). It is not native-speaker exam audio. N2/N1 natural-speed multi-speaker listening cannot be reproduced. |
| L-03 | No pronunciation scoring. Recording is optional, local, and for self-comparison only. |
| L-04 | No handwriting recognition. Stroke-order guidance is self-assessed. Kana stroke guides are original and simplified. Kanji stroke diagrams are not available yet. |
| L-05 | Content coverage differs by level and is partial (see `content/coverage.md`). Partially covered levels show a coverage badge and make no claim of exam completeness. |
| L-06 | Results are practice estimates, not convertible to official scaled scores. |
| L-07 | On iPhone, Safari outside the installed Home Screen app can evict storage after 7 days without use. There is no automatic install prompt on iOS. |
| L-08 | Ambience is stylised and procedural; it does not sound like a specific real place. |
| L-09 | Community discussions were not directly analysed in the source research; learner-experience claims there are low confidence. |
| L-10 | No native-speaker review exists. **Nothing is `human_reviewed`.** Japanese text and translations were written for this project by an AI assistant and checked only by automated validators. Errors are possible. |

## Additional limitations found while building

* **Dictionary verification not run.** Validator A07 needs a build-time dictionary. None is bundled (third-party dictionary data is not used by default), so readings are checked only by internal consistency (kana-only, romaji round-trip), not against a dictionary.
* **Cultural notes are unverified.** They always display an "unverified" marker.
* **Maps are approximate.** The Japan map uses original, simplified outlines drawn for this project from a coordinate projection; they are schematic, not survey-accurate.
* **Browsers tested.** Only Chromium (desktop and two phone-sized viewports) was exercised. WebKit and Firefox were not installable in the build sandbox. Real iOS Safari and Android Chrome installs were not tested (AC35).
* **Placement challenge (D-012) deferred.** There is no second route to unlock levels; the unlock criteria in the spec apply with no manual override.
* **Handwriting canvas deferred.** The guided handwriting exercise uses a static guide and self-check.
* **Time-of-day / date edge cases.** The planner and streak logic use the device clock; changing the device clock changes behaviour (tested with an injected clock).
