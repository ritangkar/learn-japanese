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
