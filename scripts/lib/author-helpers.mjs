// Builders for hand-written content. They only add boilerplate (ids, unit, level, provenance, computed romaji).
// Every Japanese string, translation and explanation is written by hand in content/authoring/*.mjs.
import { kanaToRomaji } from '../../src/content/romaji.js';

export function unit(unitId, level = 'N5') {
  const base = { unit_id: unitId, instructional_level: level };
  const prov = { provenance: 'orig' };
  const vocab = (id, surface, reading, meanings, pos, sentences, extra = {}) => ({ id: `v_${id}`, surface, reading_kana: reading, romaji: kanaToRomaji(reading), meanings_en: meanings, pos, ...base, example_sentence_ids: sentences, ...extra, ...prov });
  const sentence = (id, kind, text, reading, en, vocabIds, extra = {}) => ({ id, kind, text_ja: text, reading_kana: reading, translation_en: en, vocab_ids: vocabIds, ...base, naturalness: 'checked_auto', ...extra, ...prov });
  const question = (id, type, f) => ({ id, type, ...base, difficulty: 1, targets: [], facet: 'meaning', section: null, jlpt_item_type: null, ...f, ...prov });
  const lesson = (id, f) => ({ id, ...base, ...f, provenance: 'orig' });
  const listening = (id, f) => ({ id, audio_mode: 'tts', synthetic_audio_flag: true, speaker_voice_hint: [], ...base, ...f, ...prov });
  const passage = (id, f) => ({ id, ...base, ...f, ...prov });
  const dialogue = (id, f) => ({ id, ...base, ...f, ...prov });
  const grammar = (id, f) => ({ id, ...base, ...f, ...prov });
  const kanji = (id, f) => ({ id, ...base, ...f, ...prov });
  return { vocab, sentence, question, lesson, listening, passage, dialogue, grammar, kanji, base };
}

/** Choice list from [id, text, isJapanese?] tuples. */
export const choices = (list) => list.map(([id, text, ja]) => (ja ? { id, text, ja: true } : { id, text }));
export const countChars = (paragraphs) => paragraphs.join('').replace(/\s/g, '').length;

const words = (t) => new Set(t.toLowerCase().replace(/[()]/g, '').split(/[^a-z]+/).filter((w) => w.length > 2));
/** One meaning question per word, built from the vocabulary table (tagged "templated" so coverage reports it separately). */
export function meaningQuestions(Q, vocab, pool = vocab) {
  const first = (v) => v.meanings_en[0];
  return vocab.map((v, i) => {
    const mine = words(first(v)); const cands = [];
    for (let k = 1; cands.length < 3 && k < pool.length * 3; k++) {
      const c = pool[(i * 5 + k * 7) % pool.length];
      const theirs = words(first(c));
      if (c.id === v.id || [...theirs].some((w) => mine.has(w)) || cands.some((x) => first(x) === first(c)) || first(c) === first(v)) continue;
      cands.push(c);
    }
    const opts = [v, ...cands]; const ids = ['a', 'b', 'c', 'd'];
    const ordered = [1, 2, 3, 0].map((o) => opts[(o + i) % 4]);
    const ans = ids[ordered.indexOf(v)];
    return Q(`q_${v.unit_id.replace(/_/g, '')}_vm_${v.id.slice(2)}`, 'mcq', { stem: { prompt: 'What does this word mean?', ja: v.surface }, choices: ordered.map((o, k) => ({ id: ids[k], text: first(o), concept: o.id })), answer: ans, explanation_correct: `${v.surface} (${v.romaji}) means "${first(v)}".`, explanation_per_distractor: Object.fromEntries(ordered.map((o, k) => [ids[k], `${o.surface} means "${first(o)}".`]).filter(([k]) => k !== ans)), facet: 'meaning', targets: [v.id], difficulty: 1, tags: ['templated'] });
  });
}

/**
 * Question builders shared by the authoring files of later units. Every stem, choice, explanation and note is still written by hand
 * in the unit file; these helpers only fill in ids, the unit and the repeated structure.
 */
const JA = /[぀-ヿ一-鿿]/;
const autoJa = (ch) => ch.map(([id, t, j]) => [id, t, j ?? JA.test(t)]);
export function kit(Q, unitKey, sentIdx = {}) {
  const P = `q_${unitKey}_`;
  const wrongNote = (s) => `That is not what ${s} says.`;
  const tr = (n, sid, correct, wrong, note, extra = []) => {
    const s = sentIdx[sid];
    return Q(`${P}tr${n}`, 'translate', { stem: { prompt: 'Choose the meaning.', ja: s.text_ja }, choices: choices([['a', correct], ['b', wrong[0]], ['c', wrong[1]]]), answer: 'a', explanation_correct: note, explanation_per_distractor: { b: wrongNote(s.text_ja), c: wrongNote(s.text_ja) }, facet: 'meaning', targets: [...s.vocab_ids, ...extra], source_sentence_id: sid, difficulty: 2 });
  };
  const ty = (n, en, ans, vid, alt = null) => Q(`${P}ty${n}`, 'typing_ja', { stem: { prompt: `Type "${en}" in hiragana (romaji is accepted).` }, answer: ans, accept_alternatives: alt, explanation_correct: `${en} = ${ans}.`, facet: 'produce', targets: [vid], difficulty: 2 });
  const dc = (n, word, vid, note) => Q(`${P}dc${n}`, 'dictation', { stem: { prompt: 'Listen, then type what you hear in hiragana (romaji is accepted).', audio_text: word }, answer: word, explanation_correct: note, facet: 'listen', targets: [vid], difficulty: 3, tags: ['listening_relevant'] });
  const gl = (n, lid, phrase, others, vid, note) => Q(`${P}gl${n}`, 'listening_comp', { stem: { prompt: 'What did you hear?', audio_text: phrase, context_id: lid }, choices: choices([['a', phrase, true], ...others.map((o, i) => [`d${i + 1}`, o, true])]), answer: 'a', explanation_correct: note, explanation_per_distractor: Object.fromEntries(others.map((o, i) => [`d${i + 1}`, `${o} sounds different: listen again.`])), facet: 'listen', targets: [vid], difficulty: 2, tags: ['listening_relevant'] });
  const dg = (n, did, prompt, ch, ans, note, targets) => Q(`${P}dg${n}`, 'dialogue_complete', { stem: { prompt, context_id: did }, choices: choices(autoJa(ch)), answer: ans, explanation_correct: note, explanation_per_distractor: Object.fromEntries(ch.filter(([id]) => id !== ans).map(([id, t]) => [id, `${t} is not what the dialogue says.`])), facet: 'meaning', targets, difficulty: 2 });
  const rq = (n, pid, prompt, ch, ans, note, tg, type = 'reading_comp') => Q(`${P}rq${n}`, type, { stem: { prompt, context_id: pid }, choices: choices(autoJa(ch)), answer: ans, explanation_correct: note, explanation_per_distractor: Object.fromEntries(ch.filter(([id]) => id !== ans).map(([id, t]) => [id, `Check the text again: ${t} does not match.`])), facet: 'read', targets: tg, difficulty: 2 });
  const kd = (n, ch, ans, others, kid, vids, note) => Q(`${P}kd${n}`, 'mcq', { stem: { prompt: 'What does this kanji mean?', ja: ch }, choices: choices([['a', ans], ...others.map((o, i) => [`d${i + 1}`, o])]), answer: 'a', explanation_correct: note, explanation_per_distractor: Object.fromEntries(others.map((o, i) => [`d${i + 1}`, 'That is the meaning of a different kanji.'])), facet: 'meaning', targets: [kid, ...vids], difficulty: 1 });
  const kk = (n, ch, rom, others, kid, vid, note) => Q(`${P}kk${n}`, 'mcq', { stem: { prompt: 'How is this kanji read in this word?', ja: ch }, choices: choices([['a', rom], ...others.map((o, i) => [`d${i + 1}`, o])]), answer: 'a', explanation_correct: note, explanation_per_distractor: Object.fromEntries(others.map((o, i) => [`d${i + 1}`, 'That is another reading.'])), facet: 'read', targets: [kid, vid], difficulty: 2 });
  return { tr, ty, dc, gl, dg, rq, kd, kk };
}

/** Spiral review questions (reported as "templated"): "Which word means X?" for words of earlier units. */
export function spiral(Q, unitKey, old, { rem = 1, step = 3, n = 80, mod = 11 } = {}) {
  const first = (x) => x.meanings_en[0];
  const out = [];
  old.filter((_, i) => i % step === rem).slice(0, n).forEach((w, i) => {
    const cands = old.filter((c) => c.id !== w.id && first(c) !== first(w)).filter((_, k) => (k + i) % mod === 0).slice(0, 3);
    const ordered = [cands[0], w, cands[1], cands[2]].filter(Boolean);
    const ids4 = ['a', 'b', 'c', 'd'];
    out.push(Q(`q_${unitKey}_sr_${w.id.slice(2)}`, 'mcq', { stem: { prompt: `Which word means "${first(w)}"?` }, choices: ordered.map((o, k) => ({ id: ids4[k], text: o.surface, ja: true, concept: o.id })), answer: ids4[ordered.indexOf(w)], explanation_correct: `"${first(w)}" is ${w.surface} (${w.romaji}).`, explanation_per_distractor: Object.fromEntries(ordered.map((o, k) => [ids4[k], `${o.surface} means "${first(o)}".`]).filter((_, k) => ordered[k] !== w)), facet: 'produce', targets: [w.id], difficulty: 1, tags: ['templated', 'spiral'] }));
  });
  return out;
}

/** Vocabulary of earlier units that is safe to use as spiral material (no numeral kanji words, no irregular price/time words). */
export const SPIRAL_EXCLUDE = /^v_(num|ichiji|niji|sanji|yoji|goji|rokuji|shichiji|hachiji|kuji|juuji|juuichiji|juuniji|sanbyaku|roppyaku|happyaku|sanzen|hassen)/;
