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
