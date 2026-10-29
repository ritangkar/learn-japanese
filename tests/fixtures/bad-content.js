// FIXTURE — not shipped, not counted. Synthetic defective content used only to prove the validators fail correctly.
export const FIXTURE_MARK = 'FIXTURE — not shipped, not counted';

export const base = { instructional_level: 'N5', provenance: 'orig' };

export const kanjiSentence = { id: 'fx_s_kanji', kind: 'sentence', text_ja: '猫が好きです', reading_kana: 'ねこがすきです', translation_en: 'I like cats.', vocab_ids: [], unit_id: 'n5_u01', naturalness: 'checked_auto', ...base };
export const kanjiSentenceWithRuby = { ...kanjiSentence, id: 'fx_s_kanji_ruby', ruby: { 猫: 'ねこ', 好: 'す' } };
export const futureVocabSentence = { id: 'fx_s_future', kind: 'phrase', text_ja: 'ねこ', reading_kana: 'ねこ', translation_en: 'cat', vocab_ids: ['fx_v_future'], unit_id: 'n5_u01', naturalness: 'checked_auto', ...base };
export const futureVocab = { id: 'fx_v_future', surface: 'ねこ', reading_kana: 'ねこ', romaji: 'neko', meanings_en: ['cat'], pos: 'noun', unit_id: 'n5_u03', example_sentence_ids: ['fx_s_future'], ...base, instructional_level: 'N5' };
export const badRomajiVocab = { id: 'fx_v_romaji', surface: 'ねこ', reading_kana: 'ねこ', romaji: 'nyako', meanings_en: ['cat'], pos: 'noun', unit_id: 'n5_u01', example_sentence_ids: ['s_n5u01_04'], ...base };
export const romajiInReading = { id: 'fx_v_reading', surface: 'ねこ', reading_kana: 'neko', romaji: 'neko', meanings_en: ['cat'], pos: 'noun', unit_id: 'n5_u01', example_sentence_ids: ['s_n5u01_04'], ...base };
export const dupChoiceQ = { id: 'fx_q_dup', type: 'mcq', unit_id: 'n5_u01', instructional_level: 'N5', stem: { prompt: 'Pick', ja: 'ねこ' }, choices: [{ id: 'a', text: 'cat' }, { id: 'b', text: 'cat' }, { id: 'c', text: 'dog' }], answer: 'a', explanation_correct: 'x', facet: 'meaning', targets: ['v_neko'], difficulty: 1, ...base };
export const twoCorrectQ = { ...dupChoiceQ, id: 'fx_q_nocorrect', choices: [{ id: 'a', text: 'cat' }, { id: 'b', text: 'dog' }], answer: 'zzz' };
export const emptyAnswerQ = { id: 'fx_q_empty', type: 'typing_ja', unit_id: 'n5_u01', instructional_level: 'N5', stem: { prompt: 'Type' }, answer: '。', explanation_correct: 'x', facet: 'produce', targets: ['v_neko'], difficulty: 1, ...base };
export const danglingQ = { id: 'fx_q_dangling', type: 'mcq', unit_id: 'n5_u01', instructional_level: 'N5', stem: { prompt: 'Pick', ja: 'ねこ' }, choices: [{ id: 'a', text: 'cat' }, { id: 'b', text: 'dog' }], answer: 'a', explanation_correct: 'x', facet: 'meaning', targets: ['v_does_not_exist'], difficulty: 1, ...base };
export const lateKanaQ = { id: 'fx_q_latekana', type: 'mcq', unit_id: 'n5_u01', instructional_level: 'N5', stem: { prompt: 'Pick', ja: 'ほん' }, choices: [{ id: 'a', text: 'book' }, { id: 'b', text: 'dog' }], answer: 'a', explanation_correct: 'x', facet: 'meaning', targets: ['v_neko'], difficulty: 1, ...base };
export const placeholderSentence = { id: 'fx_s_placeholder', kind: 'phrase', text_ja: 'ねこ', reading_kana: 'ねこ', translation_en: 'TODO fill in later', vocab_ids: ['v_neko'], unit_id: 'n5_u01', naturalness: 'checked_auto', ...base };
export const claimSentence = { id: 'fx_s_claim', kind: 'phrase', text_ja: 'ねこ', reading_kana: 'ねこ', translation_en: 'You will pass JLPT with this', vocab_ids: ['v_neko'], unit_id: 'n5_u01', naturalness: 'checked_auto', ...base };
export const longListening = { id: 'fx_ls_long', item_type: 'x', audio_mode: 'tts', synthetic_audio_flag: true, unit_id: 'n5_u01', instructional_level: 'N5', provenance: 'orig', script_turns: [{ speaker: 'A', text_ja: 'あいうえおかきくけこさしすせそたちつてとなにぬねのあいうえおかきくけこさしすせそたちつてとなにぬねの' }], question_ids: ['q_n5u01_lq01'] };

/** A minimal two-mock set that shares a question id and has wrong minutes. */
export function badMocks(raw) {
  const q = raw.questions.find((x) => x.id === 'q_n5u01_lq01');
  const mk = (id, minutes) => ({ id, level: 'N5', title: 'fixture', series: 'fx', sections: [{ id: 'vocab', official_section_name: 'Language Knowledge (Vocabulary)', minutes, question_ids: [q.id] }, { id: 'grammar_reading', official_section_name: 'Language Knowledge (Grammar) / Reading', minutes: 40, question_ids: [] }, { id: 'listening', official_section_name: 'Listening', minutes: 30, question_ids: [] }], created_on: '2026-10-29', disclaimer_key: 'practice_not_official', provenance: 'orig' });
  return [mk('fx_mock_a', 20), mk('fx_mock_b', 25)];
}
