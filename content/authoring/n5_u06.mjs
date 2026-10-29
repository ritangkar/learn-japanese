// n5_u06 "People, things and ownership" - hand-written original content.
// Grammar: の (possession and "mine"), も (also), じゃ ありません (is not). Kanji scope: 人 大 小 山 川 上 下 中. Scenario: a visit to a tower.
import { kanaToRomaji, hasKanji } from '../../src/content/romaji.js';
import { unit, choices, countChars, meaningQuestions } from '../../scripts/lib/author-helpers.mjs';
import u01 from './n5_u01.mjs';
import u02 from './n5_u02.mjs';
import u03 from './n5_u03.mjs';
import u04 from './n5_u04.mjs';
import u05 from './n5_u05.mjs';

const U = unit('n5_u06');
const { vocab: V, sentence: S, question: Q, lesson: L, listening: LS, passage: PS, dialogue: DG, grammar: GR, kanji: KJ } = U;

// ---------- vocabulary ----------
const vocabL = {
  l1: [
    V('kazoku', 'かぞく', 'かぞく', ['family'], 'noun', ['s_n5u06_k01']),
    V('chichi', 'ちち', 'ちち', ['my father'], 'noun', ['s_n5u06_k02'], { note: 'Used for your own father when speaking to others. For someone else\'s father use おとうさん.' }),
    V('haha', 'はは', 'はは', ['my mother'], 'noun', ['s_n5u06_k03'], { note: 'Used for your own mother when speaking to others.' }),
    V('ani', 'あに', 'あに', ['my older brother'], 'noun', ['s_n5u06_k04']),
    V('ane', 'あね', 'あね', ['my older sister'], 'noun', ['s_n5u06_k05']),
    V('otouto', 'おとうと', 'おとうと', ['my younger brother'], 'noun', ['s_n5u06_k06']),
    V('imouto', 'いもうと', 'いもうと', ['my younger sister'], 'noun', ['s_n5u06_k07']),
    V('otousan', 'おとうさん', 'おとうさん', ["(someone's) father", 'dad'], 'noun', ['s_n5u06_k08'], { note: 'Polite: used for another person\'s father, or for your own father when speaking to him.' }),
    V('okaasan', 'おかあさん', 'おかあさん', ["(someone's) mother", 'mom'], 'noun', ['s_n5u06_k09']),
    V('oniisan', 'おにいさん', 'おにいさん', ["(someone's) older brother"], 'noun', ['s_n5u06_k10']),
    V('oneesan', 'おねえさん', 'おねえさん', ["(someone's) older sister"], 'noun', ['s_n5u06_k11']),
    V('ryoushin', 'りょうしん', 'りょうしん', ['parents'], 'noun', ['s_n5u06_k12']),
  ],
  l2: [
    V('isha', 'いしゃ', 'いしゃ', ['doctor'], 'noun', ['s_n5u06_k13']),
    V('daigakusei', 'だいがくせい', 'だいがくせい', ['university student'], 'noun', ['s_n5u06_k14']),
    V('enjinia', 'エンジニア', 'x', ['engineer'], 'noun (loanword)', ['s_n5u06_k15']),
    V('tenin', 'てんいん', 'てんいん', ['shop clerk', 'shop assistant'], 'noun', ['s_n5u06_k16']),
    V('shufu', 'しゅふ', 'しゅふ', ['homemaker'], 'noun', ['s_n5u06_k17']),
    V('kangoshi', 'かんごし', 'かんごし', ['nurse'], 'noun', ['s_n5u06_k18']),
    V('saifu', 'さいふ', 'さいふ', ['wallet'], 'noun', ['s_n5u06_k19']),
    V('megane', 'めがね', 'めがね', ['glasses'], 'noun', ['s_n5u06_k20']),
    V('tegami', 'てがみ', 'てがみ', ['letter'], 'noun', ['s_n5u06_k21']),
    V('tawaa', 'タワー', 'x', ['tower'], 'noun (loanword)', ['s_n5u06_k22'], { destination_tags: ['tokyo_tower'] }),
    V('chiketto', 'チケット', 'x', ['ticket (for an event or place)'], 'noun (loanword)', ['s_n5u06_k23'], { destination_tags: ['tokyo_tower'], note: 'きっぷ is a transport ticket; チケット is for events and attractions.' }),
    V('omiyage', 'おみやげ', 'おみやげ', ['souvenir', 'gift from a trip'], 'noun', ['s_n5u06_k24'], { destination_tags: ['tokyo_tower'] }),
  ],
  l3: [
    V('minna', 'みんな', 'みんな', ['everyone'], 'noun', ['s_n5u06_k01']),
    V('watashitachi', 'わたしたち', 'わたしたち', ['we', 'us'], 'pronoun', ['s_n5u06_k26']),
  ],
  l4: [
    V('sou', 'そう', 'そう', ['so', 'that way'], 'adverb', ['s_n5u06_k27'], { note: 'そう です means "that is right"; そう です か means "is that so?".' }),
    V('chigaimasu', 'ちがいます', 'ちがいます', ['that is wrong', 'no, it is different'], 'expression', ['s_n5u06_k28']),
    V('hontou', 'ほんとう', 'ほんとう', ['truth', 'really'], 'noun', ['s_n5u06_k29']),
  ],
  l5: [
    V('erebeetaa', 'エレベーター', 'x', ['elevator'], 'noun (loanword)', ['s_n5u06_k30'], { destination_tags: ['tokyo_tower'] }),
    V('otearai', 'おてあらい', 'おてあらい', ['restroom', 'toilet'], 'noun', ['s_n5u06_k31'], { destination_tags: ['tokyo_tower'] }),
    V('chizu', 'ちず', 'ちず', ['map'], 'noun', ['s_n5u06_k32'], { destination_tags: ['tokyo_tower'] }),
  ],
  l6: [
    V('shita', 'した', 'した', ['below', 'under'], 'noun', ['s_n5u06_k33']),
    V('naka', 'なか', 'なか', ['inside', 'middle'], 'noun', ['s_n5u06_k34']),
  ],
};
const vocab = Object.values(vocabL).flat();
for (const w of vocab) if (!hasKanji(w.surface)) { w.reading_kana = w.surface; w.romaji = kanaToRomaji(w.surface); }

// ---------- kanji ----------
const kanji = [
  KJ('k_hito', { char: '人', meanings_en: ['person'], on_readings: ['じん', 'にん'], kun_readings: ['ひと'], reading_notes: 'ひと alone; じん after a country (にほんじん).', stroke_count: 2, example_word_ids: ['v_hito', 'v_nihonjin'], confusable_with: ['k_dai'], tags: ['people'] }),
  KJ('k_dai', { char: '大', meanings_en: ['big'], on_readings: ['だい'], kun_readings: ['おお'], stroke_count: 3, example_word_ids: ['v_ookii'], confusable_with: ['k_shou', 'k_hito'], tags: ['size'] }),
  KJ('k_shou', { char: '小', meanings_en: ['small'], on_readings: ['しょう'], kun_readings: ['ちい', 'こ'], stroke_count: 3, example_word_ids: ['v_chiisai'], confusable_with: ['k_dai'], tags: ['size'] }),
  KJ('k_yama', { char: '山', meanings_en: ['mountain'], on_readings: ['さん'], kun_readings: ['やま'], stroke_count: 3, example_word_ids: ['v_yama'], confusable_with: ['k_kawa'], tags: ['nature'] }),
  KJ('k_kawa', { char: '川', meanings_en: ['river'], on_readings: ['せん'], kun_readings: ['かわ'], stroke_count: 3, example_word_ids: ['v_kawa'], confusable_with: ['k_yama'], tags: ['nature'] }),
  KJ('k_ue', { char: '上', meanings_en: ['above', 'up'], on_readings: ['じょう'], kun_readings: ['うえ', 'あ'], stroke_count: 3, example_word_ids: ['v_ue'], confusable_with: ['k_shita'], tags: ['position'] }),
  KJ('k_shita', { char: '下', meanings_en: ['below', 'down'], on_readings: ['か', 'げ'], kun_readings: ['した', 'さ'], stroke_count: 3, example_word_ids: ['v_shita'], confusable_with: ['k_ue'], tags: ['position'] }),
  KJ('k_naka', { char: '中', meanings_en: ['middle', 'inside'], on_readings: ['ちゅう'], kun_readings: ['なか'], stroke_count: 4, example_word_ids: ['v_naka'], tags: ['position'] }),
];

// ---------- phrases and sentences ----------
const ph = (n, text, en, ids) => S(`s_n5u06_${n}`, 'phrase', text, text, en, ids);
const sn = (n, text, en, ids, extra = {}) => S(`s_n5u06_${n}`, 'sentence', text, text, en, ids, extra);
const kj = (n, text, reading, en, ids, ruby) => S(`s_n5u06_${n}`, 'phrase', text, reading, en, ids, { ruby, kanji_used: [...text].filter((c) => /[一-龥]/.test(c)) });
const sentences = [
  sn('k01', 'わたし の かぞく は みんな にほんじん です', 'My whole family is Japanese.', ['v_watashi', 'v_kazoku', 'v_minna', 'v_nihonjin', 'v_desu']), sn('k02', 'わたし の ちち は いしゃ です', 'My father is a doctor.', ['v_watashi', 'v_chichi', 'v_isha', 'v_desu']),
  sn('k03', 'わたし の はは は せんせい です', 'My mother is a teacher.', ['v_watashi', 'v_haha', 'v_sensei', 'v_desu']), sn('k04', 'あに は だいがくせい です', 'My older brother is a university student.', ['v_ani', 'v_daigakusei', 'v_desu']),
  sn('k05', 'あね は かんごし です', 'My older sister is a nurse.', ['v_ane', 'v_kangoshi', 'v_desu']), sn('k06', 'おとうと は がくせい です', 'My younger brother is a student.', ['v_otouto', 'v_gakusei', 'v_desu']),
  sn('k07', 'いもうと は こども です', 'My younger sister is a child.', ['v_imouto', 'v_kodomo', 'v_desu']), sn('k08', 'おとうさん は かいしゃいん です か', 'Is your father a company employee?', ['v_otousan', 'v_kaishain', 'v_desu']),
  sn('k09', 'おかあさん は しゅふ です か', 'Is your mother a homemaker?', ['v_okaasan', 'v_shufu', 'v_desu']), sn('k10', 'おにいさん は エンジニア です', 'Your older brother is an engineer.', ['v_oniisan', 'v_enjinia', 'v_desu']),
  sn('k11', 'おねえさん は てんいん です か', 'Is your older sister a shop clerk?', ['v_oneesan', 'v_tenin', 'v_desu']), sn('k12', 'りょうしん は とうきょう です', 'My parents are in Tokyo.', ['v_ryoushin', 'v_toukyou', 'v_desu']),
  sn('k13', 'これ は わたし の さいふ です', 'This is my wallet.', ['v_kore', 'v_watashi', 'v_saifu', 'v_desu']), sn('k14', 'それ は たなか さん の めがね です', "That is Ms. Tanaka's glasses.", ['v_sore', 'v_san', 'v_megane', 'v_desu']),
  sn('k15', 'あれ は ともだち の てがみ です', "That is my friend's letter.", ['v_are', 'v_tomodachi', 'v_tegami', 'v_desu']), sn('k16', 'この かさ は だれ の です か', 'Whose is this umbrella?', ['v_kono', 'v_kasa', 'v_dare', 'v_desu']),
  sn('k17', 'その かさ は わたし の です', 'That umbrella is mine.', ['v_sono', 'v_kasa', 'v_watashi', 'v_desu']), sn('k18', 'にほんご の ほん は あそこ です', 'The Japanese book is over there.', ['v_nihongo', 'v_hon', 'v_asoko', 'v_desu']),
  sn('k19', 'わたし も がくせい です', 'I am a student too.', ['v_watashi', 'v_gakusei', 'v_desu']), sn('k20', 'たなか さん も せんせい です', 'Ms. Tanaka is also a teacher.', ['v_san', 'v_sensei', 'v_desu']),
  sn('k21', 'ともだち も にほんじん です', 'My friend is Japanese too.', ['v_tomodachi', 'v_nihonjin', 'v_desu']), sn('k22', 'わたし は いしゃ じゃ ありません', 'I am not a doctor.', ['v_watashi', 'v_isha']),
  sn('k23', 'これ は わたし の かばん じゃ ありません', 'This is not my bag.', ['v_kore', 'v_watashi', 'v_kaban']), sn('k24', 'あの ひと は せんせい じゃ ありません', 'That person is not a teacher.', ['v_ano', 'v_hito', 'v_sensei']),
  sn('k26', 'わたしたち は ともだち です', 'We are friends.', ['v_watashitachi', 'v_tomodachi', 'v_desu']),
  sn('k27', 'そう です', 'That is right.', ['v_sou', 'v_desu']), sn('k28', 'いいえ ちがいます', 'No, that is not right.', ['v_chigaimasu']), sn('k29', 'ほんとう です か', 'Is that true? / Really?', ['v_hontou', 'v_desu']),
  sn('k30', 'エレベーター は あそこ です', 'The elevator is over there.', ['v_erebeetaa', 'v_asoko', 'v_desu']), sn('k31', 'おてあらい は あそこ です か', 'Is the restroom over there?', ['v_otearai', 'v_asoko', 'v_desu']),
  sn('k32', 'ちず は ここ です', 'The maps are here.', ['v_chizu', 'v_desu']), sn('k33', 'した は レストラン です', 'Downstairs is a restaurant.', ['v_shita', 'v_resutoran', 'v_desu']), sn('k34', 'なか は おおきい です', 'The inside is big.', ['v_naka', 'v_ookii', 'v_desu']),
  sn('t01', 'これ は とうきょう タワー です', 'This is Tokyo Tower.', ['v_kore', 'v_tawaa', 'v_toukyou', 'v_desu']), sn('t02', 'チケット は ここ です', 'Tickets are here.', ['v_chiketto', 'v_desu']),
  sn('t03', 'おみやげ は した です', 'Souvenirs are downstairs.', ['v_omiyage', 'v_shita', 'v_desu']), sn('t04', 'この ひと は わたし の ともだち です', 'This person is my friend.', ['v_kono', 'v_hito', 'v_watashi', 'v_tomodachi', 'v_desu']),
  sn('t05', 'あなた の チケット です か', 'Is it your ticket?', ['v_anata', 'v_chiketto', 'v_desu']), sn('t06', 'はい わたし の です', 'Yes, it is mine.', ['v_watashi', 'v_desu']),
  sn('t07', 'いいえ わたし の じゃ ありません', 'No, it is not mine.', ['v_watashi']),
  ph('p01', 'ちち と はは', 'my father and mother', ['v_chichi', 'v_haha']), ph('p02', 'あに と あね', 'my older brother and sister', ['v_ani', 'v_ane']), ph('p03', 'おとうと と いもうと', 'my younger brother and sister', ['v_otouto', 'v_imouto']),
  ph('p04', 'おみやげ と ちず', 'souvenirs and maps', ['v_omiyage', 'v_chizu']), ph('p05', 'さいふ と めがね', 'a wallet and glasses', ['v_saifu', 'v_megane']),
  kj('n01', '山 と 川', 'やま と かわ', 'mountains and rivers', ['v_yama', 'v_kawa'], { 山: 'やま', 川: 'かわ' }), kj('n02', '大きい 人', 'おおきい ひと', 'a big person', ['v_ookii', 'v_hito'], { 大: 'おお', 人: 'ひと' }),
  kj('n03', '小さい 山', 'ちいさい やま', 'a small mountain', ['v_chiisai', 'v_yama'], { 小: 'ちい', 山: 'やま' }), kj('n04', '山 の 上', 'やま の うえ', 'the top of a mountain', ['v_yama', 'v_ue'], { 山: 'やま', 上: 'うえ' }),
  kj('n05', '山 の 下', 'やま の した', 'the foot of a mountain', ['v_yama', 'v_shita'], { 山: 'やま', 下: 'した' }), kj('n06', '川 の 中', 'かわ の なか', 'in the river', ['v_kawa', 'v_naka'], { 川: 'かわ', 中: 'なか' }),
];
const sentIdx = Object.fromEntries(sentences.map((s) => [s.id, s]));
void sentIdx;

const questions = [];
const add = (...q) => questions.push(...q);

// ---------- family words ----------
add(Q('q_n5u06_mt01', 'matching', { stem: { prompt: 'Match the word for YOUR OWN family member with its meaning.' }, pairs: [['ちち', 'my father'], ['はは', 'my mother'], ['あに', 'my older brother'], ['あね', 'my older sister'], ['おとうと', 'my younger brother'], ['いもうと', 'my younger sister']], answer: ['ちち', 'はは', 'あに', 'あね', 'おとうと', 'いもうと'], explanation_correct: 'These are the plain words used for your own family when speaking to others.', facet: 'meaning', targets: ['v_chichi', 'v_haha', 'v_ani', 'v_ane', 'v_otouto', 'v_imouto'], difficulty: 2 }),
  Q('q_n5u06_mt02', 'matching', { stem: { prompt: "Match the polite word for SOMEONE ELSE's family member with its meaning." }, pairs: [['おとうさん', "(someone's) father"], ['おかあさん', "(someone's) mother"], ['おにいさん', "(someone's) older brother"], ['おねえさん', "(someone's) older sister"]], answer: ['おとうさん', 'おかあさん', 'おにいさん', 'おねえさん'], explanation_correct: 'The お...さん forms are respectful and used for other people\'s family.', facet: 'meaning', targets: ['v_otousan', 'v_okaasan', 'v_oniisan', 'v_oneesan'], difficulty: 2 }),
  Q('q_n5u06_fa01', 'mcq', { stem: { prompt: 'You are telling a stranger about your OWN mother. Which word do you use?' }, choices: choices([['a', 'はは', true], ['b', 'おかあさん', true], ['c', 'おとうさん', true]]), answer: 'a', explanation_correct: 'For your own family use the plain word: はは.', explanation_per_distractor: { b: 'おかあさん is for someone else\'s mother (or when speaking to your own mother).', c: 'おとうさん is father.' }, facet: 'meaning', targets: ['v_haha', 'v_okaasan'], difficulty: 2 }),
  Q('q_n5u06_fa02', 'mcq', { stem: { prompt: "You ask a friend about THEIR father. Which word do you use?" }, choices: choices([['a', 'おとうさん', true], ['b', 'ちち', true], ['c', 'あに', true]]), answer: 'a', explanation_correct: "For someone else's father use the respectful おとうさん.", explanation_per_distractor: { b: 'ちち is for your own father.', c: 'あに is your own older brother.' }, facet: 'meaning', targets: ['v_otousan', 'v_chichi'], difficulty: 2 }),
  Q('q_n5u06_fa03', 'mcq', { stem: { prompt: 'Which word means "my older sister"?' }, choices: choices([['a', 'あね', true], ['b', 'あに', true], ['c', 'いもうと', true]]), answer: 'a', explanation_correct: 'あね = my older sister; あに = my older brother.', explanation_per_distractor: { b: 'あに is a brother.', c: 'いもうと is a younger sister.' }, facet: 'meaning', targets: ['v_ane', 'v_ani', 'v_imouto'], difficulty: 1 }),
  Q('q_n5u06_fa04', 'mcq', { stem: { prompt: 'Which word means "parents"?' }, choices: choices([['a', 'りょうしん', true], ['b', 'かぞく', true], ['c', 'こども', true]]), answer: 'a', explanation_correct: 'りょうしん = parents; かぞく = family.', explanation_per_distractor: { b: 'かぞく means family.', c: 'こども means child.' }, facet: 'meaning', targets: ['v_ryoushin', 'v_kazoku'], difficulty: 1 }),
  Q('q_n5u06_fa05', 'mcq', { stem: { prompt: 'Who is older than you?' }, choices: choices([['a', 'あに', true], ['b', 'おとうと', true], ['c', 'いもうと', true]]), answer: 'a', explanation_correct: 'あに is your older brother; おとうと and いもうと are younger siblings.', explanation_per_distractor: { b: 'おとうと is a younger brother.', c: 'いもうと is a younger sister.' }, facet: 'meaning', targets: ['v_ani', 'v_otouto', 'v_imouto'], difficulty: 2 }));
const tyP = (n, en, ans, vid, alt = null) => Q(`q_n5u06_ty${n}`, 'typing_ja', { stem: { prompt: `Type "${en}" in hiragana (romaji is accepted).` }, answer: ans, accept_alternatives: alt, explanation_correct: `${en} = ${ans}.`, facet: 'produce', targets: [vid], difficulty: 2 });
add(tyP('01', 'my father', 'ちち', 'v_chichi'), tyP('02', 'my mother', 'はは', 'v_haha'), tyP('03', 'family', 'かぞく', 'v_kazoku'), tyP('04', 'doctor', 'いしゃ', 'v_isha'), tyP('05', 'wallet', 'さいふ', 'v_saifu'), tyP('06', 'glasses', 'めがね', 'v_megane'), tyP('07', 'map', 'ちず', 'v_chizu'), tyP('08', 'inside', 'なか', 'v_naka'));
add(...meaningQuestions(Q, vocab));
{
  const old = [...u01.vocab, ...u02.vocab.filter((w) => w.pos !== 'expression'), ...u03.vocab.filter((w) => !/^v_num/.test(w.id)), ...u04.vocab.filter((w) => !/^v_(num|ichiji|niji|sanji|yoji|goji|rokuji|shichiji|hachiji|kuji|juuji|juuichiji|juuniji)/.test(w.id)), ...u05.vocab.filter((w) => !/^v_(num|sanbyaku|roppyaku|happyaku|sanzen|hassen)/.test(w.id))];
  const first = (x) => x.meanings_en[0];
  const pick = old.filter((_, i) => i % 4 === 3).slice(0, 80);
  pick.forEach((w, i) => {
    const cands = old.filter((c) => c.id !== w.id && first(c) !== first(w)).filter((_, k) => (k + i) % 13 === 0).slice(0, 3);
    const ordered = [cands[0], w, cands[1], cands[2]].filter(Boolean);
    const ids4 = ['a', 'b', 'c', 'd'];
    add(Q(`q_n5u06_sr_${w.id.slice(2)}`, 'mcq', { stem: { prompt: `Which word means "${first(w)}"?` }, choices: ordered.map((o, k) => ({ id: ids4[k], text: o.surface, ja: true, concept: o.id })), answer: ids4[ordered.indexOf(w)], explanation_correct: `"${first(w)}" is ${w.surface} (${w.romaji}).`, explanation_per_distractor: Object.fromEntries(ordered.map((o, k) => [ids4[k], `${o.surface} means "${first(o)}".`]).filter((_, k) => ordered[k] !== w)), facet: 'produce', targets: [w.id], difficulty: 1, tags: ['templated', 'spiral'] }));
  });
}

// ---------- grammar ----------
const gq = { no: [], mo: [], ja: [] };
const G = (key, ...q) => { gq[key].push(...q.map((x) => x.id)); add(...q); };
G('no',
  Q('q_n5u06_gn01', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'わたし の さいふ' }, choices: choices([['a', 'my wallet'], ['b', 'I am a wallet'], ['c', 'a wallet and me']]), answer: 'a', explanation_correct: 'A の B: B belonging to A. わたし の さいふ = my wallet.', explanation_per_distractor: { b: 'の does not mean "am".', c: 'と would mean "and".' }, facet: 'meaning', targets: ['g_no_possessive', 'v_watashi', 'v_saifu'], difficulty: 1 }),
  Q('q_n5u06_gn02', 'fill_blank', { stem: { prompt: "Complete: Ms. Tanaka's glasses", ja: 'たなか さん ＿＿ めがね' }, choices: choices([['a', 'の', true], ['b', 'は', true], ['c', 'と', true]]), answer: 'a', explanation_correct: 'の links the owner to the thing owned.', explanation_per_distractor: { b: 'は marks the topic.', c: 'と means "and".' }, facet: 'construct', targets: ['g_no_possessive', 'v_san', 'v_megane'], source_sentence_id: 's_n5u06_k14', difficulty: 1 }),
  Q('q_n5u06_gn03', 'sentence_order', { stem: { prompt: "Put the words in order: my friend's letter" }, tiles: ['てがみ', 'の', 'ともだち'], answer: ['ともだち', 'の', 'てがみ'], explanation_correct: 'Owner の thing.', facet: 'construct', targets: ['g_no_possessive', 'v_tomodachi', 'v_tegami'], difficulty: 2 }),
  Q('q_n5u06_gn04', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'この かさ は だれ の です か' }, choices: choices([['a', 'Whose is this umbrella?'], ['b', 'Who is this umbrella?'], ['c', 'Where is this umbrella?']]), answer: 'a', explanation_correct: 'だれ の = whose. The thing is left out after の.', explanation_per_distractor: { b: 'The question is about the owner, not "who is".', c: 'Where would be どこ (later).' }, facet: 'meaning', targets: ['g_no_possessive', 'v_dare', 'v_kasa'], source_sentence_id: 's_n5u06_k16', difficulty: 2 }),
  Q('q_n5u06_gn05', 'dialogue_complete', { stem: { prompt: 'A asks: "Whose is this umbrella?" Which is the best answer?', ja: 'この かさ は だれ の です か' }, choices: choices([['a', 'わたし の です', true], ['b', 'わたし です', true], ['c', 'かさ です', true]]), answer: 'a', explanation_correct: 'わたし の です = "It is mine". The noun after の is dropped.', explanation_per_distractor: { b: 'わたし です would mean "it is me".', c: 'かさ です would mean "it is an umbrella", which does not answer whose.' }, facet: 'meaning', targets: ['g_no_possessive', 'v_watashi'], source_sentence_id: 's_n5u06_k17', difficulty: 2 }),
  Q('q_n5u06_gn06', 'error_correction', { stem: { prompt: 'One word is wrong. What should replace は so the phrase means "my mother\'s bag"?', ja: 'わたし の はは は かばん' }, choices: choices([['a', 'の', true], ['b', 'も', true], ['c', 'か', true]]), answer: 'a', explanation_correct: 'わたし の はは の かばん: の links each owner to the next thing.', explanation_per_distractor: { b: 'も means "also".', c: 'か makes a question.' }, facet: 'construct', targets: ['g_no_possessive', 'v_haha', 'v_kaban'], difficulty: 3 }),
  Q('q_n5u06_gn07', 'sentence_order', { stem: { prompt: 'Put the words in order: This is my wallet.' }, tiles: ['さいふ', 'わたし', 'です', 'の', 'これ', 'は'], answer: ['これ', 'は', 'わたし', 'の', 'さいふ', 'です'], explanation_correct: 'これ は + owner の thing + です.', facet: 'construct', targets: ['g_no_possessive', 'v_saifu'], source_sentence_id: 's_n5u06_k13', difficulty: 3 }));
G('mo',
  Q('q_n5u06_gm01', 'fill_blank', { stem: { prompt: 'Complete: I am a student too.', ja: 'わたし ＿＿ がくせい です' }, choices: choices([['a', 'も', true], ['b', 'の', true], ['c', 'か', true]]), answer: 'a', explanation_correct: 'も replaces は and means "also".', explanation_per_distractor: { b: 'の links nouns.', c: 'か makes a question.' }, facet: 'construct', targets: ['g_mo_also', 'v_watashi', 'v_gakusei'], source_sentence_id: 's_n5u06_k19', difficulty: 1 }),
  Q('q_n5u06_gm02', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'たなか さん も せんせい です' }, choices: choices([['a', 'Ms. Tanaka is also a teacher.'], ['b', 'Ms. Tanaka is a teacher.'], ['c', 'Ms. Tanaka is not a teacher.']]), answer: 'a', explanation_correct: 'も adds "also": someone else is a teacher too.', explanation_per_distractor: { b: 'Without も there is no "also".', c: 'That needs じゃ ありません.' }, facet: 'meaning', targets: ['g_mo_also', 'v_san', 'v_sensei'], source_sentence_id: 's_n5u06_k20', difficulty: 2 }),
  Q('q_n5u06_gm03', 'sentence_order', { stem: { prompt: 'Put the words in order: My friend is Japanese too.' }, tiles: ['です', 'にほんじん', 'も', 'ともだち'], answer: ['ともだち', 'も', 'にほんじん', 'です'], explanation_correct: 'も takes the place of は.', facet: 'construct', targets: ['g_mo_also', 'v_tomodachi', 'v_nihonjin'], source_sentence_id: 's_n5u06_k21', difficulty: 2 }),
  Q('q_n5u06_gm04', 'mcq', { stem: { prompt: 'A says: "I am a student." B is also a student. What does B say?' }, choices: choices([['a', 'わたし も がくせい です', true], ['b', 'わたし は がくせい です', true], ['c', 'わたし の がくせい です', true]]), answer: 'a', explanation_correct: 'も = also.', explanation_per_distractor: { b: 'は does not say "also".', c: 'の would change the meaning to "my student".' }, facet: 'meaning', targets: ['g_mo_also', 'v_gakusei'], difficulty: 2 }),
  Q('q_n5u06_gm05', 'error_correction', { stem: { prompt: 'One word is wrong. What should replace は so the sentence means "My older sister is a nurse too"?', ja: 'あね は かんごし です' }, choices: choices([['a', 'も', true], ['b', 'の', true], ['c', 'と', true]]), answer: 'a', explanation_correct: 'あね も かんごし です.', explanation_per_distractor: { b: 'の would not add "also".', c: 'と means "and".' }, facet: 'construct', targets: ['g_mo_also', 'v_ane', 'v_kangoshi'], difficulty: 3 }),
  Q('q_n5u06_gm06', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'ちち も はは も いしゃ です' }, choices: choices([['a', 'My father and my mother are both doctors.'], ['b', 'My father is a doctor.'], ['c', 'My parents are teachers.']]), answer: 'a', explanation_correct: 'X も Y も ... です = both X and Y.', explanation_per_distractor: { b: 'The mother is included too.', c: 'いしゃ means doctor, not teacher.' }, facet: 'meaning', targets: ['g_mo_also', 'v_chichi', 'v_haha', 'v_isha'], difficulty: 3 }));
G('ja',
  Q('q_n5u06_gj01', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'わたし は いしゃ じゃ ありません' }, choices: choices([['a', 'I am not a doctor.'], ['b', 'I am a doctor.'], ['c', 'Am I a doctor?']]), answer: 'a', explanation_correct: 'じゃ ありません is the polite negative of です.', explanation_per_distractor: { b: 'The negative flips the meaning.', c: 'There is no か.' }, facet: 'meaning', targets: ['g_ja_arimasen', 'v_watashi', 'v_isha'], source_sentence_id: 's_n5u06_k22', difficulty: 2 }),
  Q('q_n5u06_gj02', 'fill_blank', { stem: { prompt: 'Complete: That person is not a teacher.', ja: 'あの ひと は せんせい ＿＿' }, choices: choices([['a', 'じゃ ありません', true], ['b', 'です', true], ['c', 'です か', true]]), answer: 'a', explanation_correct: 'Negative: じゃ ありません.', explanation_per_distractor: { b: 'です is positive.', c: 'です か is a question.' }, facet: 'construct', targets: ['g_ja_arimasen', 'v_ano', 'v_hito', 'v_sensei'], source_sentence_id: 's_n5u06_k24', difficulty: 2 }),
  Q('q_n5u06_gj03', 'sentence_order', { stem: { prompt: 'Put the words in order: This is not my bag.' }, tiles: ['かばん', 'じゃ', 'の', 'わたし', 'これ', 'は', 'ありません'], answer: ['これ', 'は', 'わたし', 'の', 'かばん', 'じゃ', 'ありません'], explanation_correct: 'Positive pattern + じゃ ありません at the end.', facet: 'construct', targets: ['g_ja_arimasen', 'v_kaban', 'v_watashi'], source_sentence_id: 's_n5u06_k23', difficulty: 3 }),
  Q('q_n5u06_gj04', 'dialogue_complete', { stem: { prompt: 'A asks: "Is that your ticket?" It is not. What does B say?', ja: 'あなた の チケット です か' }, choices: choices([['a', 'いいえ わたし の じゃ ありません', true], ['b', 'はい わたし の です', true], ['c', 'いいえ わたし の です', true]]), answer: 'a', explanation_correct: 'いいえ + the negative: わたし の じゃ ありません.', explanation_per_distractor: { b: 'はい means yes.', c: 'いいえ with the positive ending contradicts itself.' }, facet: 'meaning', targets: ['g_ja_arimasen', 'v_chiketto', 'v_watashi'], source_sentence_id: 's_n5u06_t07', difficulty: 2 }),
  Q('q_n5u06_gj05', 'mcq', { stem: { prompt: 'Which means "That is not a rice ball"?' }, choices: choices([['a', 'それ は おにぎり じゃ ありません', true], ['b', 'それ は おにぎり です', true], ['c', 'それ も おにぎり です', true]]), answer: 'a', explanation_correct: 'じゃ ありません makes it negative.', explanation_per_distractor: { b: 'です is positive.', c: 'も adds "also".' }, facet: 'meaning', targets: ['g_ja_arimasen', 'v_sore', 'v_onigiri'], difficulty: 2 }),
  Q('q_n5u06_gj06', 'error_correction', { stem: { prompt: 'One word is wrong. What should replace です so the sentence means "I am not a student"?', ja: 'わたし は がくせい です' }, choices: choices([['a', 'じゃ ありません', true], ['b', 'ありません', true], ['c', 'ません', true]]), answer: 'a', explanation_correct: 'The full negative is じゃ ありません.', explanation_per_distractor: { b: 'ありません alone is not enough here.', c: 'ません is not a word by itself.' }, facet: 'construct', targets: ['g_ja_arimasen', 'v_gakusei'], difficulty: 3 }));
const grammar = [
  GR('g_no_possessive', { title: 'の: A の B', pattern: 'A の B', meaning_en: 'B belonging to A; A\'s B.', explanation: ['の links two nouns. The first noun owns or describes the second: わたし の さいふ (my wallet), にほんご の ほん (a Japanese book).', 'The thing owned can be dropped when it is obvious: この かさ は わたし の です ("this umbrella is mine"). To ask who owns it say だれ の です か.', 'You can chain の: わたし の はは の かばん is "my mother\'s bag".'], structure_notes: 'Owner/category + の + thing.', examples: ['s_n5u06_k13', 's_n5u06_k14', 's_n5u06_k16', 's_n5u06_k17'], common_mistakes: ['Putting the thing before の (the owner goes first).', 'Using は where の is needed.'], contrast_with: ['g_wa_desu'], practice_question_ids: gq.no, register: 'neutral', tags: ['particles'] }),
  GR('g_mo_also', { title: 'も: also', pattern: 'X も Y です', meaning_en: 'X too is Y.', explanation: ['も replaces は and adds "also, too": わたし も がくせい です (I am a student too).', 'Use X も Y も for "both": ちち も はは も いしゃ です.', 'Do not use both は and も for the same word.'], structure_notes: 'Topic も description です.', examples: ['s_n5u06_k19', 's_n5u06_k20', 's_n5u06_k21'], common_mistakes: ['Writing は も together.', 'Using も when the second item is different in kind.'], contrast_with: ['g_wa_desu'], practice_question_ids: gq.mo, register: 'neutral', tags: ['particles'] }),
  GR('g_ja_arimasen', { title: 'じゃ ありません: is not', pattern: 'X は Y じゃ ありません', meaning_en: 'X is not Y.', explanation: ['The polite negative of です is じゃ ありません. わたし は いしゃ じゃ ありません = I am not a doctor.', 'In careful writing and speech you may also hear では ありません; じゃ is the everyday form.', 'To ask a negative question add か, and to answer use いいえ.'], structure_notes: 'Topic は noun じゃ ありません.', examples: ['s_n5u06_k22', 's_n5u06_k23', 's_n5u06_k24'], common_mistakes: ['Forgetting じゃ and saying ありません only.', 'Mixing positive です with いいえ.'], contrast_with: ['g_wa_desu'], practice_question_ids: gq.ja, register: 'polite', tags: ['negation'] }),
];

// ---------- kanji ----------
const kd = (n, ch, ans, others, kid, vids, note) => Q(`q_n5u06_kd${n}`, 'mcq', { stem: { prompt: 'What does this kanji mean?', ja: ch }, choices: choices([['a', ans], ...others.map((o, i) => [`d${i + 1}`, o])]), answer: 'a', explanation_correct: note, explanation_per_distractor: Object.fromEntries(others.map((o, i) => [`d${i + 1}`, 'That is the meaning of a different kanji.'])), facet: 'meaning', targets: [kid, ...vids], difficulty: 1 });
add(kd('01', '人', 'person', ['mountain', 'river'], 'k_hito', ['v_hito'], '人 looks like a person walking: person.'), kd('02', '大', 'big', ['small', 'person'], 'k_dai', ['v_ookii'], '大 is a person with arms stretched wide: big.'), kd('03', '小', 'small', ['big', 'middle'], 'k_shou', ['v_chiisai'], '小 is small.'),
  kd('04', '山', 'mountain', ['river', 'above'], 'k_yama', ['v_yama'], '山 looks like three peaks: mountain.'), kd('05', '川', 'river', ['mountain', 'below'], 'k_kawa', ['v_kawa'], '川 looks like flowing water: river.'), kd('06', '上', 'above', ['below', 'middle'], 'k_ue', ['v_ue'], '上 is above.'),
  kd('07', '下', 'below', ['above', 'middle'], 'k_shita', ['v_shita'], '下 is below.'), kd('08', '中', 'inside / middle', ['above', 'big'], 'k_naka', ['v_naka'], '中 is a line through the middle of a box: inside.'));
const kr = (n, ch, rom, others, kid, vid, note) => Q(`q_n5u06_kk${n}`, 'mcq', { stem: { prompt: 'How is this kanji read in this word?', ja: ch }, choices: choices([['a', rom], ...others.map((o, i) => [`d${i + 1}`, o])]), answer: 'a', explanation_correct: note, explanation_per_distractor: Object.fromEntries(others.map((o, i) => [`d${i + 1}`, 'That is another reading.'])), facet: 'read', targets: [kid, vid], difficulty: 2 });
add(kr('01', '山', 'yama', ['kawa', 'ue'], 'k_yama', 'v_yama', '山 alone is read やま.'), kr('02', '川', 'kawa', ['yama', 'shita'], 'k_kawa', 'v_kawa', '川 alone is read かわ.'), kr('03', '上', 'ue', ['shita', 'naka'], 'k_ue', 'v_ue', '上 alone is read うえ.'), kr('04', '下', 'shita', ['ue', 'naka'], 'k_shita', 'v_shita', '下 alone is read した.'), kr('05', '中', 'naka', ['ue', 'shita'], 'k_naka', 'v_naka', '中 alone is read なか.'),
  kr('06', '人', 'hito', ['kawa', 'yama'], 'k_hito', 'v_hito', '人 alone is read ひと.'));
add(Q('q_n5u06_kmt01', 'matching', { stem: { prompt: 'Match each kanji with its meaning.' }, pairs: [['人', 'person'], ['大', 'big'], ['小', 'small'], ['山', 'mountain'], ['川', 'river'], ['上', 'above']], answer: ['人', '大', '小', '山', '川', '上'], explanation_correct: 'The first six kanji of this unit.', facet: 'meaning', targets: ['k_hito', 'k_dai', 'k_shou', 'k_yama', 'k_kawa', 'k_ue'], difficulty: 2 }),
  Q('q_n5u06_kmt02', 'matching', { stem: { prompt: 'Match each phrase with its meaning.' }, pairs: [['山 の 上', 'the top of a mountain'], ['川 の 中', 'in the river'], ['大きい 人', 'a big person'], ['小さい 山', 'a small mountain']], answer: ['山 の 上', '川 の 中', '大きい 人', '小さい 山'], explanation_correct: 'Kanji in context: read each part.', facet: 'meaning', targets: ['k_yama', 'k_ue', 'k_kawa', 'k_naka', 'k_dai', 'k_hito', 'k_shou'], difficulty: 3 }),
  Q('q_n5u06_kcf01', 'mcq', { stem: { prompt: 'Which kanji is "big" (not "person")?' }, choices: choices([['a', '大'], ['b', '人'], ['c', '小']]), answer: 'a', explanation_correct: '大 has a long horizontal stroke; 人 is two strokes only.', explanation_per_distractor: { b: '人 means person.', c: '小 means small.' }, facet: 'read', targets: ['k_dai', 'k_hito'], difficulty: 2 }),
  Q('q_n5u06_kcf02', 'mcq', { stem: { prompt: 'Which kanji is "mountain"?' }, choices: choices([['a', '山'], ['b', '川'], ['c', '中']]), answer: 'a', explanation_correct: '山 has a tall middle peak; 川 has three vertical lines.', explanation_per_distractor: { b: '川 means river.', c: '中 means inside.' }, facet: 'read', targets: ['k_yama', 'k_kawa'], difficulty: 2 }),
  Q('q_n5u06_kcf03', 'mcq', { stem: { prompt: 'Which kanji is "above"?' }, choices: choices([['a', '上'], ['b', '下'], ['c', '中']]), answer: 'a', explanation_correct: '上 has its short stroke on top of the long line; 下 has it below.', explanation_per_distractor: { b: '下 means below.', c: '中 means inside.' }, facet: 'read', targets: ['k_ue', 'k_shita'], difficulty: 2 }));

// ---------- dictation and listening ----------
const dc = (n, word, vid, note) => Q(`q_n5u06_dc${n}`, 'dictation', { stem: { prompt: 'Listen, then type what you hear in hiragana (romaji is accepted).', audio_text: word }, answer: word, explanation_correct: note, facet: 'listen', targets: [vid], difficulty: 3, tags: ['listening_relevant'] });
add(dc('01', 'かぞく', 'v_kazoku', 'かぞく = family.'), dc('02', 'おかあさん', 'v_okaasan', 'おかあさん = (someone\'s) mother.'), dc('03', 'いもうと', 'v_imouto', 'いもうと = my younger sister.'), dc('04', 'りょうしん', 'v_ryoushin', 'りょうしん = parents.'));
const gl = (n, lid, phrase, others, vid, note, ja = true) => Q(`q_n5u06_gl${n}`, 'listening_comp', { stem: { prompt: 'What did you hear?', audio_text: phrase, context_id: lid }, choices: choices([['a', phrase, ja], ...others.map((o, i) => [`d${i + 1}`, o, ja])]), answer: 'a', explanation_correct: note, explanation_per_distractor: Object.fromEntries(others.map((o, i) => [`d${i + 1}`, `${o} sounds different: listen again.`])), facet: 'listen', targets: [vid], difficulty: 2, tags: ['listening_relevant'] });
add(gl('01', 'n5u06_ls1', 'おとうさん', ['おとうと', 'おじさん'], 'v_otousan', 'You heard おとうさん: (someone\'s) father.'), gl('02', 'n5u06_ls1', 'おにいさん', ['おねえさん', 'おじいさん'], 'v_oniisan', 'You heard おにいさん: older brother.'), gl('03', 'n5u06_ls1', 'おねえさん', ['おにいさん', 'おばあさん'], 'v_oneesan', 'You heard おねえさん: older sister.'), gl('04', 'n5u06_ls1', 'おとうと', ['おとうさん', 'いもうと'], 'v_otouto', 'You heard おとうと: younger brother.'),
  gl('05', 'n5u06_ls2', 'わたし の です', ['わたし じゃ ありません', 'わたし も です'], 'v_watashi', 'You heard わたし の です: "it is mine".'), gl('06', 'n5u06_ls2', 'じゃ ありません', ['です', 'ありがとう'], 'v_desu', 'You heard じゃ ありません: "is not".'), gl('07', 'n5u06_ls2', 'わたし も がくせい です', ['わたし は がくせい です', 'わたし の がくせい です'], 'v_gakusei', 'You heard も: "also".'), gl('08', 'n5u06_ls2', 'エレベーター は あそこ です', ['おてあらい は あそこ です', 'ちず は あそこ です'], 'v_erebeetaa', 'You heard エレベーター: the elevator.'));
const listening = [
  LS('n5u06_ls1', { item_type: 'Word recognition (lesson practice)', title: 'Family words', script_turns: ['おとうさん', 'おにいさん', 'おねえさん', 'おとうと'].map((t) => ({ speaker: 'A', text_ja: t })), question_ids: ['q_n5u06_gl01', 'q_n5u06_gl02', 'q_n5u06_gl03', 'q_n5u06_gl04'] }),
  LS('n5u06_ls2', { item_type: 'Verbal expressions (lesson practice)', title: 'Mine, also, not', script_turns: ['わたし の です', 'じゃ ありません', 'わたし も がくせい です', 'エレベーター は あそこ です'].map((t) => ({ speaker: 'A', text_ja: t })), question_ids: ['q_n5u06_gl05', 'q_n5u06_gl06', 'q_n5u06_gl07', 'q_n5u06_gl08'] }),
];

// ---------- dialogues ----------
const dialogues = [
  DG('n5u06_d1', { title: 'Tower tickets', setting: 'tokyo_tower', turns: [{ speaker: 'A', sentence_id: 's_n5u06_t05' }, { speaker: 'B', sentence_id: 's_n5u06_t06' }, { speaker: 'A', sentence_id: 's_n5u06_t02' }], comprehension_question_ids: ['q_n5u06_dg01', 'q_n5u06_dg02'], register: 'polite' }),
  DG('n5u06_d2', { title: 'Whose is this?', setting: 'tokyo_tower', turns: [{ speaker: 'A', sentence_id: 's_n5u06_k16' }, { speaker: 'B', sentence_id: 's_n5u06_k17' }], comprehension_question_ids: ['q_n5u06_dg03', 'q_n5u06_dg04'], register: 'polite' }),
  DG('n5u06_d3', { title: 'Not my ticket', setting: 'tokyo_tower', turns: [{ speaker: 'A', sentence_id: 's_n5u06_t05' }, { speaker: 'B', sentence_id: 's_n5u06_t07' }], comprehension_question_ids: ['q_n5u06_dg05'], register: 'polite' }),
  DG('n5u06_d4', { title: 'Introducing a friend', setting: 'tokyo_tower', turns: [{ speaker: 'A', sentence_id: 's_n5u06_t04' }, { speaker: 'B', sentence_id: 's_n5u03_k18' }, { speaker: 'A', sentence_id: 's_n5u06_k26' }], comprehension_question_ids: ['q_n5u06_dg06', 'q_n5u06_dg07'], register: 'polite' }),
  DG('n5u06_d5', { title: 'Where is the elevator?', setting: 'tokyo_tower', turns: [{ speaker: 'A', sentence_id: 's_n5u06_k31' }, { speaker: 'B', sentence_id: 's_n5u06_k30' }], comprehension_question_ids: ['q_n5u06_dg08'], register: 'polite' }),
];
const dg = (n, did, prompt, ch, ans, note, targets) => Q(`q_n5u06_dg${n}`, 'dialogue_complete', { stem: { prompt, context_id: did }, choices: choices(ch), answer: ans, explanation_correct: note, explanation_per_distractor: Object.fromEntries(ch.filter(([id]) => id !== ans).map(([id, t]) => [id, `${t} is not what the dialogue says.`])), facet: 'meaning', targets, difficulty: 2 });
add(dg('01', 'n5u06_d1', 'What does A ask?', [['a', 'Whether it is B\'s ticket'], ['b', 'The price of a ticket'], ['c', 'Where the tower is']], 'a', 'あなた の チケット です か.', ['v_chiketto']),
  dg('02', 'n5u06_d1', 'Is the ticket B\'s?', [['a', 'Yes'], ['b', 'No'], ['c', 'Not stated']], 'a', 'B answers はい わたし の です.', ['v_watashi']),
  dg('03', 'n5u06_d2', 'What does A want to know?', [['a', 'Whose umbrella it is'], ['b', 'What an umbrella costs'], ['c', 'Where the umbrella is']], 'a', 'だれ の です か = whose is it?', ['v_dare', 'v_kasa']),
  dg('04', 'n5u06_d2', 'Whose umbrella is it?', [['a', "B's"], ['b', "A's"], ['c', "Ms. Tanaka's"]], 'a', 'B says わたし の です.', ['v_watashi']),
  dg('05', 'n5u06_d3', 'Is it B\'s ticket?', [['a', 'No'], ['b', 'Yes'], ['c', 'Maybe']], 'a', 'じゃ ありません = is not.', ['v_chiketto']),
  dg('06', 'n5u06_d4', 'Who is the person A introduces?', [['a', "A's friend"], ['b', "A's mother"], ['c', "A's teacher"]], 'a', 'わたし の ともだち です.', ['v_tomodachi']),
  dg('07', 'n5u06_d4', 'What does B say first?', [['a', 'はじめまして たなか です', true], ['b', 'さようなら', true], ['c', 'ありがとう', true]], 'a', 'B introduces themself.', ['v_desu']),
  dg('08', 'n5u06_d5', 'Where is the elevator?', [['a', 'Over there'], ['b', 'Downstairs'], ['c', 'Here']], 'a', 'エレベーター は あそこ です.', ['v_erebeetaa', 'v_asoko']));

// ---------- reading ----------
const r1 = ['わたし の かぞく', 'ちち は いしゃ です', 'はは も いしゃ です', 'あに は だいがくせい です', 'いもうと は こども です'];
const r2 = ['エレベーター は あそこ', 'チケット は ここ', 'おみやげ は した', 'おてあらい は あそこ'];
const passages = [
  PS('n5u06_r1', { title: 'My family', paragraphs: r1, translation_en: 'My family / My father is a doctor. / My mother is a doctor too. / My older brother is a university student. / My younger sister is a child.', word_count_chars: countChars(r1), question_ids: ['q_n5u06_rq01', 'q_n5u06_rq02', 'q_n5u06_rq03'], genre: 'notes' }),
  PS('n5u06_r2', { title: 'Tower signs', paragraphs: r2, translation_en: 'Elevator: over there / Tickets: here / Souvenirs: downstairs / Restroom: over there', word_count_chars: countChars(r2), question_ids: ['q_n5u06_rq04', 'q_n5u06_rq05'], genre: 'signs' }),
];
const rq = (n, pid, prompt, ch, ans, note, tg, type = 'reading_comp') => Q(`q_n5u06_rq${n}`, type, { stem: { prompt, context_id: pid }, choices: choices(ch), answer: ans, explanation_correct: note, explanation_per_distractor: Object.fromEntries(ch.filter(([id]) => id !== ans).map(([id, t]) => [id, `Check the text again: ${t} does not match.`])), facet: 'read', targets: tg, difficulty: 2 });
add(rq('01', 'n5u06_r1', "What is the writer's father?", [['a', 'A doctor'], ['b', 'A teacher'], ['c', 'A university student']], 'a', 'ちち は いしゃ です.', ['v_chichi', 'v_isha'], 'information_retrieval'),
  rq('02', 'n5u06_r1', 'Who is a university student?', [['a', 'The older brother'], ['b', 'The mother'], ['c', 'The younger sister']], 'a', 'あに は だいがくせい です.', ['v_ani', 'v_daigakusei'], 'information_retrieval'),
  rq('03', 'n5u06_r1', 'Which sentence uses も to say "also"?', [['a', 'はは も いしゃ です', true], ['b', 'ちち は いしゃ です', true], ['c', 'いもうと は こども です', true]], 'a', 'も = also.', ['v_haha', 'v_isha']),
  rq('04', 'n5u06_r2', 'Where are the tickets?', [['a', 'Here'], ['b', 'Over there'], ['c', 'Downstairs']], 'a', 'チケット は ここ.', ['v_chiketto']),
  rq('05', 'n5u06_r2', 'What is downstairs?', [['a', 'Souvenirs'], ['b', 'The elevator'], ['c', 'The restroom']], 'a', 'おみやげ は した.', ['v_omiyage', 'v_shita']));

// ---------- translate / construct ----------
const tr = (n, sid, correct, wrong, note, extra = []) => { const s = sentIdx[sid]; return Q(`q_n5u06_tr${n}`, 'translate', { stem: { prompt: 'Choose the meaning.', ja: s.text_ja }, choices: choices([['a', correct], ['b', wrong[0]], ['c', wrong[1]]]), answer: 'a', explanation_correct: note, explanation_per_distractor: { b: `That is not what ${s.text_ja} says.`, c: `That is not what ${s.text_ja} says.` }, facet: 'meaning', targets: [...s.vocab_ids, ...extra], source_sentence_id: sid, difficulty: 2 }); };
add(tr('01', 's_n5u06_k02', 'My father is a doctor.', ['My father is a teacher.', 'Your father is a doctor.'], 'ちち = my father; いしゃ = doctor.'), tr('02', 's_n5u06_k04', 'My older brother is a university student.', ['My younger brother is a university student.', 'My older brother is a teacher.'], 'あに = older brother.'),
  tr('03', 's_n5u06_k08', 'Is your father a company employee?', ['Is my father a company employee?', 'Your father is a company employee.'], 'おとうさん = (your) father.'), tr('04', 's_n5u06_k12', 'My parents are in Tokyo.', ['My parents are Japanese.', 'My family is big.'], 'りょうしん = parents.'),
  tr('05', 's_n5u06_k15', "That is my friend's letter.", ["That is my friend's wallet.", 'My friend is a letter.'], 'ともだち の てがみ = my friend\'s letter.'), tr('06', 's_n5u06_k26', 'We are friends.', ['They are friends.', 'We are students.'], 'わたしたち = we.'),
  tr('07', 's_n5u06_k34', 'The inside is big.', ['The top is big.', 'The inside is small.'], 'なか = inside.'), tr('08', 's_n5u06_k33', 'Downstairs is a restaurant.', ['Upstairs is a restaurant.', 'The restaurant is big.'], 'した = below.'),
  tr('09', 's_n5u06_t01', 'This is Tokyo Tower.', ['That is Tokyo Tower.', 'Tokyo Tower is big.'], 'これ = this; タワー = tower.'), tr('10', 's_n5u06_k29', 'Is that true? / Really?', ['That is true.', 'Is that a book?'], 'ほんとう です か = really?'));
add(Q('q_n5u06_so01', 'sentence_order', { stem: { prompt: 'Put the words in order: My mother is a teacher.' }, tiles: ['せんせい', 'は', 'です', 'わたし', 'の', 'はは'], answer: ['わたし', 'の', 'はは', 'は', 'せんせい', 'です'], explanation_correct: 'わたし の はは = my mother; then は and the description.', facet: 'construct', targets: ['v_haha', 'v_sensei'], source_sentence_id: 's_n5u06_k03', difficulty: 3 }),
  Q('q_n5u06_so02', 'sentence_order', { stem: { prompt: 'Put the words in order: Is your sister a nurse?' }, tiles: ['か', 'かんごし', 'です', 'は', 'おねえさん'], answer: ['おねえさん', 'は', 'かんごし', 'です', 'か'], explanation_correct: 'Statement order + か.', facet: 'construct', targets: ['v_oneesan', 'v_kangoshi'], difficulty: 3 }),
  Q('q_n5u06_so03', 'sentence_order', { stem: { prompt: "Put the words in order: Where's the elevator? — it is over there." }, tiles: ['あそこ', 'です', 'は', 'エレベーター'], answer: ['エレベーター', 'は', 'あそこ', 'です'], explanation_correct: 'Topic は place です.', facet: 'construct', targets: ['v_erebeetaa', 'v_asoko'], source_sentence_id: 's_n5u06_k30', difficulty: 2 }));

// ---------- lessons ----------
const ids = (arr) => arr.map((x) => x.id);
const qs = (...x) => x.map((n) => `q_n5u06_${n}`);
const vmq = (arr) => arr.map((x) => `q_n5u06_vm_${x.id.slice(2)}`);
const spiralIds = questions.filter((q) => q.id.startsWith('q_n5u06_sr_')).map((q) => q.id);
const lessons = [
  L('n5_u06_l1', { title: 'Family: mine and yours', goal: 'Name family members, and learn the two sets of words (own and someone else\'s).', introduces: { vocab: ids(vocabL.l1) },
    explain: [{ heading: 'Two sets of words', body: ['Japanese uses different words for your own family and for someone else\'s. For your own family speaking to others: ちち, はは, あに, あね, おとうと, いもうと. For another person\'s family, add respect: おとうさん, おかあさん, おにいさん, おねえさん.', 'りょうしん means "parents" and かぞく means "family".'], examples: [{ ja: 'わたし の ちち は いしゃ です', reading: 'watashi no chichi wa isha desu', en: 'My father is a doctor.' }, { ja: 'おとうさん は かいしゃいん です か', reading: 'otousan wa kaishain desu ka', en: 'Is your father a company employee?' }] }],
    practice: { question_ids: qs('mt01', 'mt02', 'fa01', 'fa02', 'fa03', 'fa04', 'fa05', 'ty01', 'ty02', 'ty03', 'dc01', 'dc02', 'dc03', 'dc04', 'gl01', 'gl02', 'gl03', 'gl04').concat(vmq(vocabL.l1)) },
    exit_check: { question_ids: qs('mt01', 'mt02', 'fa01', 'fa02', 'fa05', 'ty01', 'gl01', 'gl03'), pass: 0.7 } }),
  L('n5_u06_l2', { title: 'Jobs and things', goal: 'Name common jobs and personal items.', introduces: { vocab: ids(vocabL.l2) },
    explain: [{ heading: 'Jobs and items', body: ['いしゃ (doctor), だいがくせい (university student), エンジニア (engineer), てんいん (shop clerk), しゅふ (homemaker), かんごし (nurse). Items: さいふ (wallet), めがね (glasses), てがみ (letter).', 'タワー, チケット and おみやげ appear on a tower visit.'], examples: [{ ja: 'あね は かんごし です', reading: 'ane wa kangoshi desu', en: 'My older sister is a nurse.' }, { ja: 'チケット は ここ です', reading: 'chiketto wa koko desu', en: 'Tickets are here.' }] }],
    practice: { question_ids: qs('ty04', 'ty05', 'ty06', 'tr01', 'tr02', 'tr03', 'tr04', 'tr09', 'so02').concat(vmq(vocabL.l2)) },
    exit_check: { question_ids: qs('ty04', 'ty05', 'ty06', 'tr01', 'tr04', 'tr09'), pass: 0.7 } }),
  L('n5_u06_l3', { title: 'の: A の B', goal: 'Say whose thing it is: my wallet, my friend\'s letter.', introduces: { vocab: ids(vocabL.l3), grammar: ['g_no_possessive'] },
    explain: [{ heading: 'Owner の thing', body: ['の links two nouns. The owner goes first: わたし の さいふ (my wallet), ともだち の てがみ (my friend\'s letter).', 'You can drop the thing when it is clear: これ は わたし の です ("this is mine"). Ask だれ の です か ("whose is it?").'], examples: [{ ja: 'この かさ は だれ の です か', reading: 'kono kasa wa dare no desu ka', en: 'Whose is this umbrella?' }, { ja: 'その かさ は わたし の です', reading: 'sono kasa wa watashi no desu', en: 'That umbrella is mine.' }] }],
    practice: { question_ids: qs('gn01', 'gn02', 'gn03', 'gn04', 'gn05', 'tr05', 'tr06', 'so01').concat(vmq(vocabL.l3)) },
    context: { question_ids: qs('gn06', 'gn07') },
    exit_check: { question_ids: qs('gn01', 'gn02', 'gn04', 'gn05', 'gn07', 'tr05'), pass: 0.7 } }),
  L('n5_u06_l4', { title: 'も and じゃ ありません', goal: 'Say "also" and "is not".', introduces: { vocab: ids(vocabL.l4), grammar: ['g_mo_also', 'g_ja_arimasen'] },
    explain: [{ heading: 'も: also', body: ['も replaces は and adds "too": わたし も がくせい です. For "both": ちち も はは も いしゃ です.'], examples: [{ ja: 'たなか さん も せんせい です', reading: 'tanaka san mo sensei desu', en: 'Ms. Tanaka is also a teacher.' }] },
      { heading: 'じゃ ありません: is not', body: ['The polite negative of です is じゃ ありません. わたし は いしゃ じゃ ありません. Answer a question with いいえ, then the negative. そう です means "that is right"; ちがいます means "no, that is wrong".'], examples: [{ ja: 'わたし は いしゃ じゃ ありません', reading: 'watashi wa isha ja arimasen', en: 'I am not a doctor.' }] }],
    practice: { question_ids: qs('gm01', 'gm02', 'gm03', 'gm04', 'gj01', 'gj02', 'gj03', 'gj04', 'gj05', 'tr10').concat(vmq(vocabL.l4)) },
    context: { question_ids: qs('gm05', 'gm06', 'gj06') },
    exit_check: { question_ids: qs('gm01', 'gm02', 'gm04', 'gj01', 'gj02', 'gj04', 'gj05'), pass: 0.7 } }),
  L('n5_u06_l5', { title: 'At the tower', goal: 'Handle a short tower visit: tickets, the elevator, souvenirs.', introduces: { vocab: ids(vocabL.l5) },
    explain: [{ heading: 'A tower visit', body: ['Buy a チケット, take the エレベーター, look at the ちず (map), find the おてあらい and the おみやげ shop.'], examples: [{ ja: 'エレベーター は あそこ です', reading: 'erebeetaa wa asoko desu', en: 'The elevator is over there.' }] }],
    practice: { question_ids: qs('dg01', 'dg02', 'dg03', 'dg04', 'dg05', 'dg08', 'so03', 'ty07').concat(vmq(vocabL.l5)) },
    context: { question_ids: qs('dg06', 'dg07') },
    exit_check: { question_ids: qs('dg01', 'dg03', 'dg05', 'dg08', 'so03', 'ty07'), pass: 0.7 } }),
  L('n5_u06_l6', { title: 'Kanji: 人 大 小 山 川 上 下 中', goal: 'Learn eight common kanji.', introduces: { kanji: ids(kanji), vocab: ids(vocabL.l6) },
    explain: [{ heading: 'Eight everyday kanji', body: ['人 is a person (ひと), 大 is big, 小 is small, 山 is a mountain (やま), 川 is a river (かわ), 上 is above (うえ), 下 is below (した), 中 is the middle or inside (なか).', 'Kanji can have several readings. Here they are shown with furigana until you have learned them.'], examples: [{ ja: '山 と 川', reading: 'yama to kawa', en: 'mountains and rivers' }, { ja: '山 の 上', reading: 'yama no ue', en: 'the top of a mountain' }] }],
    practice: { question_ids: qs('tr07', 'tr08', 'ty08', 'kd01', 'kd02', 'kd03', 'kd04', 'kd05', 'kd06', 'kd07', 'kd08', 'kk01', 'kk02', 'kk03', 'kk04', 'kk05', 'kk06', 'kmt01', 'kmt02', 'kcf01', 'kcf02', 'kcf03').concat(vmq(vocabL.l6)) },
    exit_check: { question_ids: qs('kd01', 'kd02', 'kd04', 'kd06', 'kk01', 'kk03', 'kmt01', 'kcf02'), pass: 0.7 } }),
  L('n5_u06_l7', { title: 'Listen and read', goal: 'Follow family words and signs.', introduces: {},
    explain: [{ heading: 'Longer sounds', body: ['Family words are often heard with long vowels: おにいさん, おねえさん. Listen for the extra beat.'], examples: [{ ja: 'おにいさん', reading: 'oniisan', en: "(someone's) older brother" }] }],
    practice: { question_ids: qs('gl05', 'gl06', 'gl07', 'gl08') },
    context: { question_ids: qs('rq01', 'rq02', 'rq03', 'rq04', 'rq05') },
    exit_check: { question_ids: qs('gl05', 'gl06', 'gl07', 'rq01', 'rq04'), pass: 0.7 } }),
  L('n5_u06_l8', { title: 'Review: units 1 to 6', goal: 'Mix words from the first six units.', introduces: {},
    explain: [{ heading: 'Review', body: ['Words from earlier units come back to keep them fresh.'], examples: [{ ja: 'わたし の かぞく', reading: 'watashi no kazoku', en: 'my family' }] }],
    practice: { question_ids: spiralIds.slice(0, 20) },
    context: { question_ids: spiralIds.slice(20, 44) },
    exit_check: { question_ids: spiralIds.slice(0, 5).concat(spiralIds.slice(44, 48)), pass: 0.7 } }),
];

// ---------- Tokyo Tower quest (QT_DIALOGUE): 10 items, 3+ from earlier units ----------
const quests = [{ id: 'q_tokyo_tower_1', destination_id: 'tokyo_tower', type: 'QT_DIALOGUE', unit_id: 'n5_u06', min_accuracy: 0.8, provenance: 'orig',
  question_ids: ['q_n5u06_dg01', 'q_n5u06_dg03', 'q_n5u06_dg05', 'q_n5u06_dg06', 'q_n5u06_dg08', 'q_n5u06_gl05', 'q_n5u06_gj04', 'q_n5u05_dg03', 'q_n5u04_dg05', 'q_n5u03_dg03'],
  spiral_question_ids: ['q_n5u05_dg03', 'q_n5u04_dg05', 'q_n5u03_dg03'] }];

export default { vocab, kanji, sentences, questions, listening, passages, lessons, dialogues, grammar, quests };
