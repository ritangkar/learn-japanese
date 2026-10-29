// Mastery model (spec mastery_model) and romaji fade (learning_engine.romaji_fade). Pure functions of SRS records and a day number.
import { PARAMS } from './params.js';
import { decode, retrievability, State } from './srs.js';

export const MASTERY_STATES = Object.freeze(['unseen', 'new_introduced', 'practising', 'developing', 'proficient', 'stable_retention']);
export const MASTERY_LABEL = Object.freeze({ unseen: 'Not started', new_introduced: 'Just introduced', practising: 'Practising', developing: 'Developing', proficient: 'Proficient', stable_retention: 'Stable' });
const rank = (s) => MASTERY_STATES.indexOf(s);

export const FACETS_BY_KIND = Object.freeze({
  kana: { all: ['read', 'produce'], required: ['read'] },
  vocab: { all: ['read', 'meaning', 'produce', 'listen'], required: ['read', 'meaning'] },
  kanji: { all: ['read', 'meaning'], required: ['read', 'meaning'] },
  grammar: { all: ['meaning', 'construct'], required: ['meaning', 'construct'] },
});
export const kindOfId = (id) => (id.startsWith('ka_') ? 'kana' : id.startsWith('v_') ? 'vocab' : id.startsWith('kj_') ? 'kanji' : id.startsWith('g_') ? 'grammar' : null);
export const facetKey = (conceptId, facet) => `${conceptId}:${facet}`;

/** Mastery of one facet record at `today`. `successes` counts spaced successes only, so one session can never exceed new_introduced. */
export function facetMastery(rec, today) {
  if (!rec) return { state: 'unseen', needsReview: false, r: 0, stability: 0 };
  const c = decode(rec);
  const r = retrievability(rec, today);
  const recentLapse = c.failBits !== 0 && today - c.lastDay <= PARAMS.mastery.lapse_window_days;
  let state;
  if (c.successes < 2) state = 'new_introduced';
  else if (c.stability < PARAMS.mastery.practising_s) state = 'practising';
  else if (c.stability < PARAMS.mastery.developing_s) state = 'developing';
  else if (c.stability < PARAMS.mastery.proficient_s) state = c.failBits === 0 ? 'proficient' : 'developing';
  else state = c.successes >= 4 && c.successDays >= 3 && c.failBits === 0 ? 'stable_retention' : (c.failBits === 0 ? 'proficient' : 'developing');
  return { state, needsReview: r < PARAMS.mastery.needs_review_r || recentLapse, r, stability: c.stability, lapses: c.lapses };
}

/** Concept mastery = min over required facets; proficient needs >= 2 facets at developing or higher, stable needs >= 2 proficient. */
export function conceptMastery(srs, conceptId, today, kind = kindOfId(conceptId)) {
  const def = FACETS_BY_KIND[kind] || FACETS_BY_KIND.vocab;
  const facets = Object.fromEntries(def.all.map((f) => [f, facetMastery(srs[facetKey(conceptId, f)], today)]));
  const req = def.required.map((f) => facets[f]);
  let state = req.reduce((m, f) => (rank(f.state) < rank(m) ? f.state : m), 'stable_retention');
  const have = Object.values(facets).filter((f) => f.state !== 'unseen');
  const atLeast = (s) => have.filter((f) => rank(f.state) >= rank(s)).length;
  if (rank(state) >= rank('proficient') && have.length >= 2 && atLeast('developing') < 2) state = 'developing';
  if (state === 'stable_retention' && have.length >= 2 && atLeast('proficient') < 2) state = 'proficient';
  const score = req.reduce((a, f) => a + Math.min(1, f.stability / PARAMS.mastery.proficient_s), 0) / req.length;
  return { state, score, needsReview: req.some((f) => f.needsReview), facets };
}

/** Average concept mastery score (0-1) over a list of concept ids. */
export function averageMastery(srs, conceptIds, today) {
  if (!conceptIds.length) return 0;
  return conceptIds.reduce((a, id) => a + conceptMastery(srs, id, today).score, 0) / conceptIds.length;
}

/** Romaji display rule: always | fade (default: hidden once the kana facet reaches proficient) | never. `reveal` is the per-tap override. */
export function showRomajiForKana(mode, srs, kanaId, today) {
  if (mode === 'never') return false;
  if (mode === 'always') return true;
  return rank(facetMastery(srs[facetKey(kanaId, 'read')], today).state) < rank('proficient');
}
/** For a vocabulary word: show romaji only while any of its kana is below proficient. */
export function showRomajiForWord(mode, srs, readingKana, kanaIdByChar, today) {
  if (mode === 'never') return false;
  if (mode === 'always') return true;
  const chars = [...readingKana].filter((c) => kanaIdByChar[c]);
  if (!chars.length) return false;
  return chars.some((c) => showRomajiForKana('fade', srs, kanaIdByChar[c], today));
}
export { State };
