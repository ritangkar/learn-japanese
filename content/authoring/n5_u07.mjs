// n5_u07 "Places, location and existence" - hand-written original content.
// Grammar: place に あります / います, location words (うえ, まえ, となり ...), ここ / そこ / あそこ / どこ.
// Kanji scope: 口 出 入 駅 店 町 家 学 校. Scenario: a residential street.
import { kanaToRomaji, hasKanji } from '../../src/content/romaji.js';
import { unit, choices, countChars, meaningQuestions, kit, spiral, SPIRAL_EXCLUDE } from '../../scripts/lib/author-helpers.mjs';
import u01 from './n5_u01.mjs';
import u02 from './n5_u02.mjs';
import u03 from './n5_u03.mjs';
import u04 from './n5_u04.mjs';
import u05 from './n5_u05.mjs';
import u06 from './n5_u06.mjs';

const U = unit('n5_u07');
const { vocab: V, sentence: S, question: Q, lesson: L, listening: LS, passage: PS, dialogue: DG, grammar: GR, kanji: KJ } = U;

// ---------- vocabulary ----------
const vocabL = {
  l1: [
    V('soto', 'そと', 'そと', ['outside'], 'noun', ['s_n5u07_k07']),
    V('mae', 'まえ', 'まえ', ['front', 'in front of'], 'noun', ['s_n5u07_k08']),
    V('ushiro', 'うしろ', 'うしろ', ['behind', 'back'], 'noun', ['s_n5u07_k10']),
    V('tonari', 'となり', 'となり', ['next to', 'neighbour'], 'noun', ['s_n5u07_k09']),
    V('yoko', 'よこ', 'よこ', ['beside', 'side'], 'noun', ['s_n5u07_k21']),
    V('chikaku', 'ちかく', 'ちかく', ['nearby', 'near'], 'noun', ['s_n5u07_k13']),
    V('hidari', 'ひだり', 'ひだり', ['left'], 'noun', ['s_n5u07_k11']),
    V('migi', 'みぎ', 'みぎ', ['right'], 'noun', ['s_n5u07_k12']),
  ],
  l2: [
    V('heya', 'へや', 'へや', ['room'], 'noun', ['s_n5u07_k01']),
    V('niwa', 'にわ', 'にわ', ['garden', 'yard'], 'noun', ['s_n5u07_k22']),
    V('kouen', 'こうえん', 'こうえん', ['park'], 'noun', ['s_n5u07_k10']),
    V('ginkou', 'ぎんこう', 'ぎんこう', ['bank'], 'noun', ['s_n5u07_k08']),
    V('yuubinkyoku', 'ゆうびんきょく', 'ゆうびんきょく', ['post office'], 'noun', ['s_n5u07_k09']),
    V('honya', 'ほんや', 'ほんや', ['bookstore'], 'noun', ['s_n5u07_k23']),
    V('panya', 'パンや', 'x', ['bakery'], 'noun', ['s_n5u07_k12'], { note: '～や after a word makes "the shop that sells ～".' }),
    V('konbini', 'コンビニ', 'x', ['convenience store'], 'noun (loanword)', ['s_n5u07_k11'], { destination_tags: ['konbini'] }),
  ],
  l3: [
    V('tsukue', 'つくえ', 'つくえ', ['desk'], 'noun', ['s_n5u07_k02']),
    V('teeburu', 'テーブル', 'x', ['table'], 'noun (loanword)', ['s_n5u07_k06']),
    V('hondana', 'ほんだな', 'ほんだな', ['bookshelf'], 'noun', ['s_n5u07_k25']),
    V('denki', 'でんき', 'でんき', ['electric light', 'electricity'], 'noun', ['s_n5u07_k21']),
    V('eakon', 'エアコン', 'x', ['air conditioner'], 'noun (loanword)', ['s_n5u07_k24']),
    V('inu', 'いぬ', 'いぬ', ['dog'], 'noun', ['s_n5u07_k07']),
    V('tori', 'とり', 'とり', ['bird'], 'noun', ['s_n5u07_k22']),
  ],
  l4: [
    V('doko', 'どこ', 'どこ', ['where'], 'question word', ['s_n5u07_k14']),
  ],
  l5: [
    V('arimasu', 'あります', 'あります', ['there is / I have (things)'], 'verb', ['s_n5u07_k02', 's_n5u07_k04'], { note: 'あります is for things that do not move on their own: books, tables, shops.' }),
    V('imasu', 'います', 'います', ['there is (people and animals)'], 'verb', ['s_n5u07_k03', 's_n5u07_k05'], { note: 'います is for living things that move: people and animals.' }),
    V('arimasen', 'ありません', 'ありません', ['there is not (things)'], 'verb', ['s_n5u07_k20']),
    V('imasen', 'いません', 'いません', ['there is not (people, animals)'], 'verb', ['s_n5u07_k18']),
  ],
};
const vocab = Object.values(vocabL).flat();
for (const w of vocab) if (!hasKanji(w.surface)) { w.reading_kana = w.surface; w.romaji = kanaToRomaji(w.surface); }

// ---------- kanji ----------
const kanji = [
  KJ('k_kuchi', { char: '口', meanings_en: ['mouth', 'opening', 'entrance'], on_readings: ['こう'], kun_readings: ['くち', 'ぐち'], reading_notes: 'ぐち in compounds such as いりぐち / でぐち.', stroke_count: 3, example_word_ids: ['v_kuchi', 'v_deguchi', 'v_iriguchi'], tags: ['places'] }),
  KJ('k_de', { char: '出', meanings_en: ['go out', 'exit'], on_readings: ['しゅつ'], kun_readings: ['で', 'だ'], stroke_count: 5, example_word_ids: ['v_deguchi'], confusable_with: ['k_iri'], tags: ['places'] }),
  KJ('k_iri', { char: '入', meanings_en: ['enter', 'put in'], on_readings: ['にゅう'], kun_readings: ['い', 'はい'], stroke_count: 2, example_word_ids: ['v_iriguchi'], confusable_with: ['k_de', 'k_hito'], tags: ['places'] }),
  KJ('k_eki', { char: '駅', meanings_en: ['station'], on_readings: ['えき'], kun_readings: [], stroke_count: 14, example_word_ids: ['v_eki'], tags: ['places'] }),
  KJ('k_mise', { char: '店', meanings_en: ['shop'], on_readings: ['てん'], kun_readings: ['みせ'], stroke_count: 8, example_word_ids: ['v_mise', 'v_tenin'], tags: ['places'] }),
  KJ('k_machi', { char: '町', meanings_en: ['town'], on_readings: ['ちょう'], kun_readings: ['まち'], stroke_count: 7, example_word_ids: ['v_machi'], tags: ['places'] }),
  KJ('k_ie', { char: '家', meanings_en: ['house', 'home'], on_readings: ['か'], kun_readings: ['いえ', 'うち'], stroke_count: 10, example_word_ids: ['v_ie'], tags: ['places'] }),
  KJ('k_gaku', { char: '学', meanings_en: ['study', 'learning'], on_readings: ['がく'], kun_readings: ['まな'], stroke_count: 8, example_word_ids: ['v_gakusei', 'v_daigakusei'], confusable_with: ['k_kou'], tags: ['school'] }),
  KJ('k_kou', { char: '校', meanings_en: ['school'], on_readings: ['こう'], kun_readings: [], stroke_count: 10, example_word_ids: ['v_gakkou'], confusable_with: ['k_gaku'], tags: ['school'] }),
];

// ---------- phrases and sentences ----------
const sn = (n, text, en, ids, extra = {}) => S(`s_n5u07_${n}`, 'sentence', text, text, en, ids, extra);
const kj = (n, text, reading, en, ids, ruby) => S(`s_n5u07_${n}`, 'phrase', text, reading, en, ids, { ruby, kanji_used: [...text].filter((c) => /[一-龥]/.test(c)) });
const sentences = [
  sn('k01', 'ここ は わたし の へや です', 'This is my room.', ['v_koko', 'v_watashi', 'v_heya', 'v_desu']), sn('k02', 'つくえ の うえ に ほん が あります', 'There is a book on the desk.', ['v_tsukue', 'v_ue', 'v_hon', 'v_arimasu']),
  sn('k03', 'いす の した に ねこ が います', 'There is a cat under the chair.', ['v_isu', 'v_shita', 'v_neko', 'v_imasu']), sn('k04', 'ほん は つくえ の うえ に あります', 'The book is on the desk.', ['v_hon', 'v_tsukue', 'v_ue', 'v_arimasu']),
  sn('k05', 'ねこ は いす の した に います', 'The cat is under the chair.', ['v_neko', 'v_isu', 'v_shita', 'v_imasu']), sn('k06', 'へや の なか に テーブル が あります', 'There is a table in the room.', ['v_heya', 'v_naka', 'v_teeburu', 'v_arimasu']),
  sn('k07', 'へや の そと に いぬ が います', 'There is a dog outside the room.', ['v_heya', 'v_soto', 'v_inu', 'v_imasu']), sn('k08', 'ぎんこう は えき の まえ に あります', 'The bank is in front of the station.', ['v_ginkou', 'v_eki', 'v_mae', 'v_arimasu']),
  sn('k09', 'ゆうびんきょく は ぎんこう の となり に あります', 'The post office is next to the bank.', ['v_yuubinkyoku', 'v_ginkou', 'v_tonari', 'v_arimasu']), sn('k10', 'こうえん は えき の うしろ に あります', 'The park is behind the station.', ['v_kouen', 'v_eki', 'v_ushiro', 'v_arimasu']),
  sn('k11', 'コンビニ は ひだり に あります', 'The convenience store is on the left.', ['v_konbini', 'v_hidari', 'v_arimasu']), sn('k12', 'パンや は みぎ に あります', 'The bakery is on the right.', ['v_panya', 'v_migi', 'v_arimasu']),
  sn('k13', 'ちかく に スーパー が あります', 'There is a supermarket nearby.', ['v_chikaku', 'v_suupaa', 'v_arimasu']), sn('k14', 'おてあらい は どこ です か', 'Where is the restroom?', ['v_otearai', 'v_doko', 'v_desu']),
  sn('k15', 'おてあらい は あそこ に あります', 'The restroom is over there.', ['v_otearai', 'v_asoko', 'v_arimasu']), sn('k16', 'ぎんこう は どこ に あります か', 'Where is the bank?', ['v_ginkou', 'v_doko', 'v_arimasu']),
  sn('k17', 'ここ に ねこ が います か', 'Is there a cat here?', ['v_koko', 'v_neko', 'v_imasu']), sn('k18', 'いいえ いません', 'No, there is not.', ['v_imasen']), sn('k19', 'はい います', 'Yes, there is.', ['v_imasu']),
  sn('k20', 'つくえ の うえ に ほん は ありません', 'There is no book on the desk.', ['v_tsukue', 'v_ue', 'v_hon', 'v_arimasen']), sn('k21', 'でんき は つくえ の よこ に あります', 'The light is beside the desk.', ['v_denki', 'v_tsukue', 'v_yoko', 'v_arimasu']),
  sn('k22', 'とり が にわ に います', 'There is a bird in the garden.', ['v_tori', 'v_niwa', 'v_imasu']), sn('k23', 'ほんや は こうえん の となり に あります', 'The bookstore is next to the park.', ['v_honya', 'v_kouen', 'v_tonari', 'v_arimasu']),
  sn('k24', 'エアコン は ドア の うえ に あります', 'The air conditioner is above the door.', ['v_eakon', 'v_doa', 'v_ue', 'v_arimasu']), sn('k25', 'ほんだな の なか に ほん が あります', 'There are books in the bookshelf.', ['v_hondana', 'v_naka', 'v_hon', 'v_arimasu']),
  sn('k26', 'わたし の いえ は えき の ちかく に あります', 'My house is near the station.', ['v_watashi', 'v_ie', 'v_eki', 'v_chikaku', 'v_arimasu']), sn('k27', 'そこ に いぬ が います か', 'Is there a dog there?', ['v_soko', 'v_inu', 'v_imasu']),
  sn('k28', 'ほんや は どこ に あります か', 'Where is the bookstore?', ['v_honya', 'v_doko', 'v_arimasu']), sn('k29', 'パンや は えき の となり に あります', 'The bakery is next to the station.', ['v_panya', 'v_eki', 'v_tonari', 'v_arimasu']),
  sn('k30', 'いえ の まえ に こうえん が あります', 'There is a park in front of the house.', ['v_ie', 'v_mae', 'v_kouen', 'v_arimasu']),
  kj('n01', '出口', 'でぐち', 'exit', ['v_deguchi'], { 出口: 'でぐち' }), kj('n02', '入口', 'いりぐち', 'entrance', ['v_iriguchi'], { 入口: 'いりぐち' }), kj('n03', '駅', 'えき', 'station', ['v_eki'], { 駅: 'えき' }),
  kj('n04', '駅 の 中', 'えき の なか', 'inside the station', ['v_eki', 'v_naka'], { 駅: 'えき', 中: 'なか' }), kj('n05', '学校', 'がっこう', 'school', ['v_gakkou'], { 学校: 'がっこう' }), kj('n06', '大きい 町', 'おおきい まち', 'a big town', ['v_ookii', 'v_machi'], { 大: 'おお', 町: 'まち' }),
  kj('n07', '小さい 店', 'ちいさい みせ', 'a small shop', ['v_chiisai', 'v_mise'], { 小: 'ちい', 店: 'みせ' }), kj('n08', '家 の 上', 'いえ の うえ', 'above the house', ['v_ie', 'v_ue'], { 家: 'いえ', 上: 'うえ' }),
];
const sentIdx = Object.fromEntries(sentences.map((s) => [s.id, s]));
const K = kit(Q, 'n5u07', sentIdx);

const questions = [];
const add = (...q) => questions.push(...q);

// ---------- location words ----------
const lw = (n, prompt, ja, ch, note, tg) => Q(`q_n5u07_lw${n}`, 'mcq', { stem: { prompt, ja }, choices: choices(ch.map(([id, t, j]) => [id, t, j])), answer: 'a', explanation_correct: note, explanation_per_distractor: Object.fromEntries(ch.slice(1).map(([id, t]) => [id, `${t} is a different word.`])), facet: 'meaning', targets: tg, difficulty: 1 });
add(lw('01', 'What does this word mean?', 'となり', [['a', 'next to'], ['b', 'behind'], ['c', 'inside']], 'となり = next to; the neighbour.', ['v_tonari']), lw('02', 'What does this word mean?', 'うしろ', [['a', 'behind'], ['b', 'in front of'], ['c', 'on top of']], 'うしろ = behind.', ['v_ushiro']), lw('03', 'What does this word mean?', 'ひだり', [['a', 'left'], ['b', 'right'], ['c', 'above']], 'ひだり = left.', ['v_hidari']),
  lw('04', 'What does this word mean?', 'みぎ', [['a', 'right'], ['b', 'left'], ['c', 'below']], 'みぎ = right.', ['v_migi']), lw('05', 'Which word means "in front of"?', null, [['a', 'まえ', true], ['b', 'うしろ', true], ['c', 'よこ', true]], 'まえ = front.', ['v_mae']), lw('06', 'Which word means "outside"?', null, [['a', 'そと', true], ['b', 'なか', true], ['c', 'した', true]], 'そと = outside; なか = inside.', ['v_soto', 'v_naka']),
  lw('07', 'Which word means "nearby"?', null, [['a', 'ちかく', true], ['b', 'よこ', true], ['c', 'みぎ', true]], 'ちかく = nearby.', ['v_chikaku']), lw('08', 'Which word means "beside"?', null, [['a', 'よこ', true], ['b', 'まえ', true], ['c', 'うえ', true]], 'よこ = beside.', ['v_yoko']));
add(Q('q_n5u07_lmt01', 'matching', { stem: { prompt: 'Match each location word with its meaning.' }, pairs: [['うえ', 'above'], ['した', 'below'], ['まえ', 'in front'], ['うしろ', 'behind'], ['なか', 'inside'], ['そと', 'outside']], answer: ['うえ', 'した', 'まえ', 'うしろ', 'なか', 'そと'], explanation_correct: 'Location words come after の: つくえ の うえ.', facet: 'meaning', targets: ['v_ue', 'v_shita', 'v_mae', 'v_ushiro', 'v_naka', 'v_soto'], difficulty: 2 }),
  Q('q_n5u07_lmt02', 'matching', { stem: { prompt: 'Match each place word with its meaning.' }, pairs: [['へや', 'room'], ['にわ', 'garden'], ['こうえん', 'park'], ['ぎんこう', 'bank'], ['ゆうびんきょく', 'post office'], ['ほんや', 'bookstore']], answer: ['へや', 'にわ', 'こうえん', 'ぎんこう', 'ゆうびんきょく', 'ほんや'], explanation_correct: 'Places you may see on a street.', facet: 'meaning', targets: ['v_heya', 'v_niwa', 'v_kouen', 'v_ginkou', 'v_yuubinkyoku', 'v_honya'], difficulty: 2 }));
add(K.ty('01', 'outside', 'そと', 'v_soto'), K.ty('02', 'next to', 'となり', 'v_tonari'), K.ty('03', 'bank', 'ぎんこう', 'v_ginkou'), K.ty('04', 'park', 'こうえん', 'v_kouen'), K.ty('05', 'room', 'へや', 'v_heya'), K.ty('06', 'desk', 'つくえ', 'v_tsukue'), K.ty('07', 'dog', 'いぬ', 'v_inu'), K.ty('08', 'where', 'どこ', 'v_doko'));
add(...meaningQuestions(Q, vocab));
add(...spiral(Q, 'n5u07', [...u01.vocab, ...u02.vocab.filter((w) => w.pos !== 'expression'), ...u03.vocab, ...u04.vocab, ...u05.vocab, ...u06.vocab].filter((w) => !SPIRAL_EXCLUDE.test(w.id)), { rem: 2, step: 4, n: 90, mod: 7 }));

// ---------- grammar ----------
const gq = { ni: [], aru: [], doko: [] };
const G = (key, ...q) => { gq[key].push(...q.map((x) => x.id)); add(...q); };
G('ni',
  Q('q_n5u07_gn01', 'fill_blank', { stem: { prompt: 'Complete: The book is on the desk.', ja: 'ほん は つくえ の うえ ＿＿ あります' }, choices: choices([['a', 'に', true], ['b', 'の', true], ['c', 'か', true]]), answer: 'a', explanation_correct: 'に marks the place where something is or exists.', explanation_per_distractor: { b: 'の links nouns; here it is already used after つくえ.', c: 'か makes a question.' }, facet: 'construct', targets: ['g_ni_location', 'v_tsukue', 'v_ue'], source_sentence_id: 's_n5u07_k04', difficulty: 2 }),
  Q('q_n5u07_gn02', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'ぎんこう は えき の まえ に あります' }, choices: choices([['a', 'The bank is in front of the station.'], ['b', 'The bank is behind the station.'], ['c', 'The station is in front of the bank.']]), answer: 'a', explanation_correct: 'えき の まえ = in front of the station; に あります = is there.', explanation_per_distractor: { b: 'うしろ would be "behind".', c: 'The first noun is the thing located.' }, facet: 'meaning', targets: ['g_ni_location', 'v_ginkou', 'v_eki', 'v_mae'], source_sentence_id: 's_n5u07_k08', difficulty: 2 }),
  Q('q_n5u07_gn03', 'sentence_order', { stem: { prompt: 'Put the words in order: The post office is next to the bank.' }, tiles: ['あります', 'の', 'ゆうびんきょく', 'に', 'は', 'ぎんこう', 'となり'], answer: ['ゆうびんきょく', 'は', 'ぎんこう', 'の', 'となり', 'に', 'あります'], explanation_correct: 'Thing は reference の location-word に あります.', facet: 'construct', targets: ['g_ni_location', 'v_yuubinkyoku', 'v_ginkou', 'v_tonari'], source_sentence_id: 's_n5u07_k09', difficulty: 3 }),
  Q('q_n5u07_gn04', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'わたし の いえ は えき の ちかく に あります' }, choices: choices([['a', 'My house is near the station.'], ['b', 'My house is the station.'], ['c', 'The station is far from my house.']]), answer: 'a', explanation_correct: 'ちかく = nearby.', explanation_per_distractor: { b: 'に あります gives a location, not an identity.', c: 'ちかく means near, not far.' }, facet: 'meaning', targets: ['g_ni_location', 'v_ie', 'v_eki', 'v_chikaku'], source_sentence_id: 's_n5u07_k26', difficulty: 2 }),
  Q('q_n5u07_gn05', 'error_correction', { stem: { prompt: 'One word is wrong. What replaces は so the sentence means "The cat is under the chair"?', ja: 'ねこ は いす の した は います' }, choices: choices([['a', 'に', true], ['b', 'も', true], ['c', 'か', true]]), answer: 'a', explanation_correct: 'ねこ は いす の した に います.', explanation_per_distractor: { b: 'も means "also".', c: 'か would make a question.' }, facet: 'construct', targets: ['g_ni_location', 'v_neko', 'v_isu', 'v_shita'], source_sentence_id: 's_n5u07_k05', difficulty: 3 }),
  Q('q_n5u07_gn06', 'mcq', { stem: { prompt: 'Which sentence says the bakery is on the right?' }, choices: choices([['a', 'パンや は みぎ に あります', true], ['b', 'パンや は ひだり に あります', true], ['c', 'パンや は みぎ です か', true]]), answer: 'a', explanation_correct: 'みぎ = right.', explanation_per_distractor: { b: 'ひだり = left.', c: 'です か makes it a question.' }, facet: 'meaning', targets: ['g_ni_location', 'v_panya', 'v_migi'], source_sentence_id: 's_n5u07_k12', difficulty: 2 }));
G('aru',
  Q('q_n5u07_ga01', 'mcq', { stem: { prompt: 'Which verb do you use for a cat?' }, choices: choices([['a', 'います', true], ['b', 'あります', true], ['c', 'です', true]]), answer: 'a', explanation_correct: 'います is for people and animals; あります is for things.', explanation_per_distractor: { b: 'あります is for things that do not move on their own.', c: 'です does not describe existence.' }, facet: 'meaning', targets: ['g_aru_iru', 'v_imasu', 'v_neko'], difficulty: 1 }),
  Q('q_n5u07_ga02', 'mcq', { stem: { prompt: 'Which verb do you use for a bookstore?' }, choices: choices([['a', 'あります', true], ['b', 'います', true], ['c', 'いません', true]]), answer: 'a', explanation_correct: 'Shops and things use あります.', explanation_per_distractor: { b: 'います is for living things.', c: 'いません is the negative of います.' }, facet: 'meaning', targets: ['g_aru_iru', 'v_arimasu', 'v_honya'], difficulty: 1 }),
  Q('q_n5u07_ga03', 'fill_blank', { stem: { prompt: 'Complete: There is a book on the desk.', ja: 'つくえ の うえ に ほん ＿＿ あります' }, choices: choices([['a', 'が', true], ['b', 'を', true], ['c', 'も', true]]), answer: 'a', explanation_correct: 'が marks the thing that exists when you first mention it.', explanation_per_distractor: { b: 'を is for objects of actions (later).', c: 'も means "also".' }, facet: 'construct', targets: ['g_aru_iru', 'v_tsukue', 'v_hon'], source_sentence_id: 's_n5u07_k02', difficulty: 2 }),
  Q('q_n5u07_ga04', 'sentence_order', { stem: { prompt: 'Put the words in order: There is a cat under the chair.' }, tiles: ['います', 'が', 'の', 'ねこ', 'いす', 'した', 'に'], answer: ['いす', 'の', 'した', 'に', 'ねこ', 'が', 'います'], explanation_correct: 'Place に thing が あります/います.', facet: 'construct', targets: ['g_aru_iru', 'v_isu', 'v_shita', 'v_neko'], source_sentence_id: 's_n5u07_k03', difficulty: 3 }),
  Q('q_n5u07_ga05', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'つくえ の うえ に ほん は ありません' }, choices: choices([['a', 'There is no book on the desk.'], ['b', 'The book is on the desk.'], ['c', 'There is a book under the desk.']]), answer: 'a', explanation_correct: 'ありません is the negative of あります.', explanation_per_distractor: { b: 'The negative flips the meaning.', c: 'うえ is above, not below.' }, facet: 'meaning', targets: ['g_aru_iru', 'v_arimasen', 'v_tsukue'], source_sentence_id: 's_n5u07_k20', difficulty: 2 }),
  Q('q_n5u07_ga06', 'dialogue_complete', { stem: { prompt: 'A asks: "Is there a cat here?" There is none. What does B say?', ja: 'ここ に ねこ が います か' }, choices: choices([['a', 'いいえ いません', true], ['b', 'いいえ ありません', true], ['c', 'はい います', true]]), answer: 'a', explanation_correct: 'Cats use います, so the negative is いません.', explanation_per_distractor: { b: 'ありません is for things.', c: 'はい います means yes, there is.' }, facet: 'meaning', targets: ['g_aru_iru', 'v_imasen', 'v_neko'], source_sentence_id: 's_n5u07_k17', difficulty: 2 }),
  Q('q_n5u07_ga07', 'error_correction', { stem: { prompt: 'One word is wrong. What replaces あります so the sentence is correct?', ja: 'へや の そと に いぬ が あります' }, choices: choices([['a', 'います', true], ['b', 'です', true], ['c', 'ありません', true]]), answer: 'a', explanation_correct: 'A dog is alive, so use います.', explanation_per_distractor: { b: 'です cannot give a location.', c: 'ありません would be negative.' }, facet: 'construct', targets: ['g_aru_iru', 'v_inu', 'v_imasu'], source_sentence_id: 's_n5u07_k07', difficulty: 3 }));
G('doko',
  Q('q_n5u07_gd01', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'ぎんこう は どこ に あります か' }, choices: choices([['a', 'Where is the bank?'], ['b', 'What is the bank?'], ['c', 'Who is at the bank?']]), answer: 'a', explanation_correct: 'どこ = where.', explanation_per_distractor: { b: 'なん would be "what".', c: 'だれ would be "who".' }, facet: 'meaning', targets: ['g_koko_soko_asoko', 'v_doko', 'v_ginkou'], source_sentence_id: 's_n5u07_k16', difficulty: 1 }),
  Q('q_n5u07_gd02', 'mcq', { stem: { prompt: 'The shop is far from both of you. Which place word do you use?' }, choices: choices([['a', 'あそこ', true], ['b', 'ここ', true], ['c', 'そこ', true]]), answer: 'a', explanation_correct: 'ここ is near me, そこ is near you, あそこ is far from both, どこ asks where.', explanation_per_distractor: { b: 'ここ is near the speaker.', c: 'そこ is near the listener.' }, facet: 'meaning', targets: ['g_koko_soko_asoko', 'v_asoko'], difficulty: 1 }),
  Q('q_n5u07_gd03', 'fill_blank', { stem: { prompt: 'Complete: The restroom is over there.', ja: 'おてあらい は ＿＿ に あります' }, choices: choices([['a', 'あそこ', true], ['b', 'どこ', true], ['c', 'これ', true]]), answer: 'a', explanation_correct: 'あそこ = over there.', explanation_per_distractor: { b: 'どこ means "where" and asks a question.', c: 'これ means "this thing", not a place.' }, facet: 'construct', targets: ['g_koko_soko_asoko', 'v_otearai', 'v_asoko'], source_sentence_id: 's_n5u07_k15', difficulty: 2 }),
  Q('q_n5u07_gd04', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'おてあらい は どこ です か' }, choices: choices([['a', 'Where is the restroom?'], ['b', 'What is the restroom?'], ['c', 'Is this the restroom?']]), answer: 'a', explanation_correct: 'どこ です か also asks "where?".', explanation_per_distractor: { b: 'なん would be "what".', c: 'There is no ここ in the sentence.' }, facet: 'meaning', targets: ['g_koko_soko_asoko', 'v_otearai', 'v_doko'], source_sentence_id: 's_n5u07_k14', difficulty: 2 }),
  Q('q_n5u07_gd05', 'sentence_order', { stem: { prompt: 'Put the words in order: Where is the bookstore?' }, tiles: ['か', 'どこ', 'あります', 'に', 'は', 'ほんや'], answer: ['ほんや', 'は', 'どこ', 'に', 'あります', 'か'], explanation_correct: 'Topic は どこ に あります か.', facet: 'construct', targets: ['g_koko_soko_asoko', 'v_honya', 'v_doko'], source_sentence_id: 's_n5u07_k28', difficulty: 3 }),
  Q('q_n5u07_gd06', 'mcq', { stem: { prompt: 'Which place word do you use for a place near the person you are talking to?' }, choices: choices([['a', 'そこ', true], ['b', 'ここ', true], ['c', 'あそこ', true]]), answer: 'a', explanation_correct: 'そこ = there, near the listener.', explanation_per_distractor: { b: 'ここ is near the speaker.', c: 'あそこ is far from both.' }, facet: 'meaning', targets: ['g_koko_soko_asoko', 'v_soko'], difficulty: 1 }));
const grammar = [
  GR('g_ni_location', { title: 'Place に あります: where something is', pattern: 'X は place に あります', meaning_en: 'X is at (a place).', explanation: ['To say where something is, use the particle に for the place and あります (things) or います (people and animals): ほん は つくえ の うえ に あります.', 'Location words (うえ, した, まえ, うしろ, なか, そと, よこ, となり, ちかく) come after の: えき の まえ (in front of the station).', 'To ask, say どこ に あります か.'], structure_notes: 'Thing は (reference の location word) に あります/います.', examples: ['s_n5u07_k04', 's_n5u07_k05', 's_n5u07_k08', 's_n5u07_k09'], common_mistakes: ['Using は instead of に for the place.', 'Using あります for a person or an animal.'], contrast_with: ['g_aru_iru'], practice_question_ids: gq.ni, register: 'polite', tags: ['location'] }),
  GR('g_aru_iru', { title: 'あります and います: existence', pattern: 'place に thing が あります / います', meaning_en: 'There is a thing / person at a place.', explanation: ['あります is for things and plants; います is for people and animals. The negatives are ありません and いません.', 'To say "there is X" put the place first with に, then X with が, then the verb: つくえ の うえ に ほん が あります. が marks the new thing that exists.', 'To say there is none, use は: ほん は ありません. To ask: ここ に ねこ が います か.'], structure_notes: 'Place に + thing が + あります/います.', examples: ['s_n5u07_k02', 's_n5u07_k03', 's_n5u07_k18', 's_n5u07_k20'], common_mistakes: ['Using います for a thing.', 'Forgetting が and using を.'], contrast_with: ['g_ni_location'], practice_question_ids: gq.aru, register: 'polite', tags: ['existence'] }),
  GR('g_koko_soko_asoko', { title: 'ここ・そこ・あそこ・どこ', pattern: 'ここ / そこ / あそこ / どこ', meaning_en: 'Here / there (near you) / over there / where.', explanation: ['The place words follow the same near-far pattern as これ・それ・あれ: ここ (near me), そこ (near you), あそこ (far from both), どこ (where).', 'They are used alone as places: おてあらい は あそこ です. With に: あそこ に あります.', 'どこ asks where: ぎんこう は どこ です か.'], structure_notes: 'Place word + に / です.', examples: ['s_n5u07_k14', 's_n5u07_k15', 's_n5u07_k16', 's_n5u07_k17'], common_mistakes: ['Using これ when a place is meant.'], contrast_with: ['g_kore_sore_are'], practice_question_ids: gq.doko, register: 'neutral', tags: ['places'] }),
];

// ---------- kanji ----------
add(K.kd('01', '口', 'mouth / opening', ['person', 'shop'], 'k_kuchi', ['v_kuchi'], '口 is an opening: mouth, and the opening of an entrance or exit.'), K.kd('02', '出', 'go out / exit', ['enter', 'school'], 'k_de', ['v_deguchi'], '出 is going out.'), K.kd('03', '入', 'enter', ['go out', 'person'], 'k_iri', ['v_iriguchi'], '入 is entering.'),
  K.kd('04', '駅', 'station', ['shop', 'town'], 'k_eki', ['v_eki'], '駅 is a station.'), K.kd('05', '店', 'shop', ['house', 'school'], 'k_mise', ['v_mise'], '店 is a shop.'), K.kd('06', '町', 'town', ['station', 'mountain'], 'k_machi', ['v_machi'], '町 is a town.'),
  K.kd('07', '家', 'house / home', ['town', 'shop'], 'k_ie', ['v_ie'], '家 is a house.'), K.kd('08', '学', 'study', ['school', 'person'], 'k_gaku', ['v_gakusei'], '学 is study.'), K.kd('09', '校', 'school', ['study', 'town'], 'k_kou', ['v_gakkou'], '校 is school.'));
add(K.kk('01', '駅', 'eki', ['mise', 'machi'], 'k_eki', 'v_eki', '駅 is read えき.'), K.kk('02', '店', 'mise', ['eki', 'ie'], 'k_mise', 'v_mise', '店 alone is read みせ.'), K.kk('03', '町', 'machi', ['mise', 'ie'], 'k_machi', 'v_machi', '町 alone is read まち.'), K.kk('04', '家', 'ie', ['machi', 'mise'], 'k_ie', 'v_ie', '家 alone is read いえ.'),
  K.kk('05', '出口', 'deguchi', ['iriguchi', 'eki'], 'k_de', 'v_deguchi', '出口 = deguchi (exit).'), K.kk('06', '入口', 'iriguchi', ['deguchi', 'eki'], 'k_iri', 'v_iriguchi', '入口 = iriguchi (entrance).'), K.kk('07', '学校', 'gakkou', ['eki', 'mise'], 'k_kou', 'v_gakkou', '学校 = gakkou (school).'));
add(Q('q_n5u07_kmt01', 'matching', { stem: { prompt: 'Match each kanji word with its meaning.' }, pairs: [['出口', 'exit'], ['入口', 'entrance'], ['駅', 'station'], ['学校', 'school'], ['店', 'shop'], ['町', 'town']], answer: ['出口', '入口', '駅', '学校', '店', '町'], explanation_correct: 'Signs you will see every day.', facet: 'meaning', targets: ['k_de', 'k_iri', 'k_eki', 'k_gaku', 'k_kou', 'k_mise', 'k_machi'], difficulty: 2 }),
  Q('q_n5u07_kcf01', 'mcq', { stem: { prompt: 'Which sign means "exit"?' }, choices: choices([['a', '出口'], ['b', '入口'], ['c', '駅']]), answer: 'a', explanation_correct: '出 (go out) + 口 (opening) = exit.', explanation_per_distractor: { b: '入口 is the entrance.', c: '駅 is a station.' }, facet: 'read', targets: ['k_de', 'k_kuchi'], difficulty: 2 }),
  Q('q_n5u07_kcf02', 'mcq', { stem: { prompt: 'Which sign means "entrance"?' }, choices: choices([['a', '入口'], ['b', '出口'], ['c', '学校']]), answer: 'a', explanation_correct: '入 (enter) + 口 (opening) = entrance.', explanation_per_distractor: { b: '出口 is the exit.', c: '学校 is a school.' }, facet: 'read', targets: ['k_iri', 'k_kuchi'], difficulty: 2 }),
  Q('q_n5u07_kcf03', 'mcq', { stem: { prompt: 'Which kanji pair is "school"?' }, choices: choices([['a', '学校'], ['b', '学生'], ['c', '大学']]), answer: 'a', explanation_correct: '学校 = gakkou, the school.', explanation_per_distractor: { b: '学生 is a student (gakusei).', c: '大学 is a university.' }, facet: 'read', targets: ['k_gaku', 'k_kou'], difficulty: 3 }));

// ---------- dictation and listening ----------
add(K.dc('01', 'ぎんこう', 'v_ginkou', 'ぎんこう = bank.'), K.dc('02', 'こうえん', 'v_kouen', 'こうえん = park.'), K.dc('03', 'ゆうびんきょく', 'v_yuubinkyoku', 'ゆうびんきょく = post office.'), K.dc('04', 'となり', 'v_tonari', 'となり = next to.'));
add(K.gl('01', 'n5u07_ls1', 'まえ', ['うしろ', 'よこ'], 'v_mae', 'You heard まえ: front.'), K.gl('02', 'n5u07_ls1', 'うしろ', ['まえ', 'そと'], 'v_ushiro', 'You heard うしろ: behind.'), K.gl('03', 'n5u07_ls1', 'みぎ', ['ひだり', 'した'], 'v_migi', 'You heard みぎ: right.'), K.gl('04', 'n5u07_ls1', 'ひだり', ['みぎ', 'うえ'], 'v_hidari', 'You heard ひだり: left.'),
  K.gl('05', 'n5u07_ls2', 'ほん が あります', ['ほん が います', 'ねこ が います'], 'v_arimasu', 'You heard あります: a thing exists.'), K.gl('06', 'n5u07_ls2', 'ねこ が います', ['ねこ が あります', 'いぬ が あります'], 'v_imasu', 'You heard います: an animal exists.'), K.gl('07', 'n5u07_ls2', 'いいえ いません', ['はい います', 'いいえ ありません'], 'v_imasen', 'You heard いません: there is none (living thing).'), K.gl('08', 'n5u07_ls2', 'ぎんこう は どこ です か', ['えき は どこ です か', 'ほんや は どこ です か'], 'v_doko', 'You heard ぎんこう: bank.'));
const listening = [
  LS('n5u07_ls1', { item_type: 'Word recognition (lesson practice)', title: 'Where? Location words', script_turns: ['まえ', 'うしろ', 'みぎ', 'ひだり'].map((t) => ({ speaker: 'A', text_ja: t })), question_ids: ['q_n5u07_gl01', 'q_n5u07_gl02', 'q_n5u07_gl03', 'q_n5u07_gl04'] }),
  LS('n5u07_ls2', { item_type: 'Verbal expressions (lesson practice)', title: 'Is there ...?', script_turns: ['ほん が あります', 'ねこ が います', 'いいえ いません', 'ぎんこう は どこ です か'].map((t) => ({ speaker: 'A', text_ja: t })), question_ids: ['q_n5u07_gl05', 'q_n5u07_gl06', 'q_n5u07_gl07', 'q_n5u07_gl08'] }),
];

// ---------- dialogues ----------
const dialogues = [
  DG('n5u07_d1', { title: 'Where is the bank?', setting: 'residential_street', turns: [{ speaker: 'A', sentence_id: 's_n5u07_k16' }, { speaker: 'B', sentence_id: 's_n5u07_k08' }, { speaker: 'A', sentence_id: 's_n5u02_g07' }], comprehension_question_ids: ['q_n5u07_dg01', 'q_n5u07_dg02'], register: 'polite' }),
  DG('n5u07_d2', { title: 'A cat here?', setting: 'residential_street', turns: [{ speaker: 'A', sentence_id: 's_n5u07_k17' }, { speaker: 'B', sentence_id: 's_n5u07_k18' }], comprehension_question_ids: ['q_n5u07_dg03'], register: 'polite' }),
  DG('n5u07_d3', { title: 'The bakery', setting: 'residential_street', turns: [{ speaker: 'A', sentence_id: 's_n5u07_k28' }, { speaker: 'B', sentence_id: 's_n5u07_k23' }], comprehension_question_ids: ['q_n5u07_dg04', 'q_n5u07_dg05'], register: 'polite' }),
  DG('n5u07_d4', { title: 'Near my house', setting: 'residential_street', turns: [{ speaker: 'A', sentence_id: 's_n5u07_k26' }, { speaker: 'B', sentence_id: 's_n5u07_k13' }], comprehension_question_ids: ['q_n5u07_dg06'], register: 'polite' }),
];
add(K.dg('01', 'n5u07_d1', 'Where is the bank?', [['a', 'In front of the station'], ['b', 'Behind the station'], ['c', 'Next to the park']], 'a', 'ぎんこう は えき の まえ に あります.', ['v_ginkou', 'v_mae']), K.dg('02', 'n5u07_d1', 'What does A say at the end?', [['a', 'ありがとう ございます', true], ['b', 'おやすみなさい', true], ['c', 'いただきます', true]], 'a', 'A thanks B.', ['v_arigatougozaimasu']),
  K.dg('03', 'n5u07_d2', 'Is there a cat?', [['a', 'No'], ['b', 'Yes'], ['c', 'Not stated']], 'a', 'いいえ いません.', ['v_neko', 'v_imasen']), K.dg('04', 'n5u07_d3', 'What does A look for?', [['a', 'A bookstore'], ['b', 'A bakery'], ['c', 'A bank']], 'a', 'ほんや は どこ に あります か.', ['v_honya']),
  K.dg('05', 'n5u07_d3', 'Where is it?', [['a', 'Next to the park'], ['b', 'Next to the station'], ['c', 'Behind the bank']], 'a', 'こうえん の となり に あります.', ['v_kouen', 'v_tonari']), K.dg('06', 'n5u07_d4', 'What is near the house?', [['a', 'A supermarket'], ['b', 'A park'], ['c', 'A bank']], 'a', 'ちかく に スーパー が あります.', ['v_suupaa', 'v_chikaku']));

// ---------- reading (signs and a street note) ----------
const r1 = ['駅', '出口', '入口', '学校', '店'];
const r2b = ['えき の まえ に ぎんこう が あります', '駅 の 中 に 店 が あります', '学校 は えき の ちかく です'];
const r3b = ['ここ は 小さい 町 です', 'えき の まえ に 大きい 店 が あります', 'ぎんこう は えき の となり です'];
const passages = [
  PS('n5u07_r1', { title: 'Street signs', paragraphs: r1, ruby: { 駅: 'えき', 出口: 'でぐち', 入口: 'いりぐち', 学校: 'がっこう', 店: 'みせ' }, translation_en: 'Station / Exit / Entrance / School / Shop', word_count_chars: countChars(r1), question_ids: ['q_n5u07_rq01', 'q_n5u07_rq02', 'q_n5u07_rq03', 'q_n5u07_rq04'], genre: 'signs' }),
  PS('n5u07_r2', { title: 'A street note', paragraphs: r2b, ruby: { 駅: 'えき', 中: 'なか', 学校: 'がっこう', 店: 'みせ' }, translation_en: 'There is a bank in front of the station. / There is a shop inside the station. / The school is near the station.', word_count_chars: countChars(r2b), question_ids: ['q_n5u07_rq05', 'q_n5u07_rq06', 'q_n5u07_rq07'], genre: 'notes' }),
  PS('n5u07_r3', { title: 'My town', paragraphs: r3b, ruby: { 小: 'ちい', 町: 'まち', 大: 'おお', 店: 'みせ' }, translation_en: 'This is a small town. / There is a big shop in front of the station. / The bank is next to the station.', word_count_chars: countChars(r3b), question_ids: ['q_n5u07_rq08', 'q_n5u07_rq09', 'q_n5u07_rq10'], genre: 'notes' }),
];
add(K.rq('01', 'n5u07_r1', 'Which sign shows the way out?', [['a', '出口'], ['b', '入口'], ['c', '駅']], 'a', '出口 = exit.', ['k_de', 'k_kuchi'], 'information_retrieval'), K.rq('02', 'n5u07_r1', 'Which sign shows the way in?', [['a', '入口'], ['b', '出口'], ['c', '店']], 'a', '入口 = entrance.', ['k_iri', 'k_kuchi'], 'information_retrieval'),
  K.rq('03', 'n5u07_r1', 'Which sign is a station?', [['a', '駅'], ['b', '学校'], ['c', '店']], 'a', '駅 = station.', ['k_eki'], 'information_retrieval'), K.rq('04', 'n5u07_r1', 'Which sign is a school?', [['a', '学校'], ['b', '駅'], ['c', '出口']], 'a', '学校 = school.', ['k_gaku', 'k_kou'], 'information_retrieval'),
  K.rq('05', 'n5u07_r2', 'Where is the bank?', [['a', 'In front of the station'], ['b', 'Inside the station'], ['c', 'Near the school']], 'a', 'えき の まえ に ぎんこう が あります.', ['v_ginkou', 'v_mae'], 'information_retrieval'), K.rq('06', 'n5u07_r2', 'What is inside the station?', [['a', 'A shop'], ['b', 'A bank'], ['c', 'A school']], 'a', '駅 の 中 に 店 が あります.', ['k_naka', 'k_mise'], 'information_retrieval'),
  K.rq('07', 'n5u07_r2', 'Where is the school?', [['a', 'Near the station'], ['b', 'In the station'], ['c', 'Next to the bank']], 'a', '学校 は えき の ちかく です.', ['k_kou', 'v_chikaku'], 'information_retrieval'), K.rq('08', 'n5u07_r3', 'What kind of town is it?', [['a', 'A small town'], ['b', 'A big town'], ['c', 'A new town']], 'a', 'ちいさい まち.', ['k_shou', 'k_machi']),
  K.rq('09', 'n5u07_r3', 'What is in front of the station?', [['a', 'A big shop'], ['b', 'A bank'], ['c', 'A school']], 'a', 'えき の まえ に 大きい 店 が あります.', ['k_dai', 'k_mise'], 'information_retrieval'), K.rq('10', 'n5u07_r3', 'Where is the bank?', [['a', 'Next to the station'], ['b', 'In front of the station'], ['c', 'Behind the station']], 'a', 'ぎんこう は えき の となり です.', ['v_ginkou', 'v_tonari'], 'information_retrieval'));

// ---------- translate / construct ----------
add(K.tr('01', 's_n5u07_k02', 'There is a book on the desk.', ['The book is under the desk.', 'The desk is on the book.'], 'うえ = on top of.'), K.tr('02', 's_n5u07_k03', 'There is a cat under the chair.', ['There is a cat on the chair.', 'There is a dog under the chair.'], 'した = below.'), K.tr('03', 's_n5u07_k06', 'There is a table in the room.', ['There is a table outside the room.', 'The room is a table.'], 'なか = inside.'),
  K.tr('04', 's_n5u07_k07', 'There is a dog outside the room.', ['There is a dog in the room.', 'There is a cat outside the room.'], 'そと = outside.'), K.tr('05', 's_n5u07_k10', 'The park is behind the station.', ['The park is in front of the station.', 'The station is behind the park.'], 'うしろ = behind.'), K.tr('06', 's_n5u07_k11', 'The convenience store is on the left.', ['The convenience store is on the right.', 'The convenience store is here.'], 'ひだり = left.'),
  K.tr('07', 's_n5u07_k13', 'There is a supermarket nearby.', ['The supermarket is far.', 'This is a supermarket.'], 'ちかく = nearby.'), K.tr('08', 's_n5u07_k21', 'The light is beside the desk.', ['The light is on the desk.', 'The desk is beside the light.'], 'よこ = beside.'), K.tr('09', 's_n5u07_k22', 'There is a bird in the garden.', ['There is a dog in the garden.', 'The garden is a bird.'], 'とり = bird; にわ = garden.'),
  K.tr('10', 's_n5u07_k25', 'There are books in the bookshelf.', ['The bookshelf is a book.', 'There is a bookshelf in the room.'], 'ほんだな の なか = inside the bookshelf.'), K.tr('11', 's_n5u07_k30', 'There is a park in front of the house.', ['There is a house in front of the park.', 'The house is a park.'], 'いえ の まえ = in front of the house.'), K.tr('12', 's_n5u07_k24', 'The air conditioner is above the door.', ['The air conditioner is beside the door.', 'The door is above the air conditioner.'], 'エアコン = air conditioner.'));

// ---------- lessons ----------
const ids = (arr) => arr.map((x) => x.id);
const qs = (...x) => x.map((n) => `q_n5u07_${n}`);
const vmq = (arr) => arr.map((x) => `q_n5u07_vm_${x.id.slice(2)}`);
const spiralIds = questions.filter((q) => q.id.startsWith('q_n5u07_sr_')).map((q) => q.id);
const lessons = [
  L('n5_u07_l1', { title: 'Location words', goal: 'Say where things are: in front, behind, next to, inside, outside, left and right.', introduces: { vocab: ids(vocabL.l1) },
    explain: [{ heading: 'Words that come after の', body: ['Location words work like nouns: えき の まえ (in front of the station), つくえ の うえ (on the desk). You already know うえ, した and なか; now add そと, まえ, うしろ, となり, よこ, ちかく, ひだり, みぎ.'], examples: [{ ja: 'えき の まえ', reading: 'eki no mae', en: 'in front of the station' }, { ja: 'つくえ の よこ', reading: 'tsukue no yoko', en: 'beside the desk' }] }],
    practice: { question_ids: qs('lw01', 'lw02', 'lw03', 'lw04', 'lw05', 'lw06', 'lw07', 'lw08', 'lmt01', 'ty01', 'ty02', 'gl01', 'gl02', 'gl03', 'gl04').concat(vmq(vocabL.l1)) },
    exit_check: { question_ids: qs('lw01', 'lw03', 'lw05', 'lw06', 'lmt01', 'ty02', 'gl01'), pass: 0.7 } }),
  L('n5_u07_l2', { title: 'Places in town', goal: 'Name places on a street.', introduces: { vocab: ids(vocabL.l2) },
    explain: [{ heading: 'Shops and public places', body: ['へや (room), にわ (garden), こうえん (park), ぎんこう (bank), ゆうびんきょく (post office), ほんや (bookstore), パンや (bakery), コンビニ (convenience store). ～や after a word means "a shop that sells ～".'], examples: [{ ja: 'パンや', reading: 'panya', en: 'bakery' }, { ja: 'ほんや', reading: 'honya', en: 'bookstore' }] }],
    practice: { question_ids: qs('lmt02', 'ty03', 'ty04', 'ty05', 'dc01', 'dc02', 'dc03').concat(vmq(vocabL.l2)) },
    exit_check: { question_ids: qs('lmt02', 'ty03', 'ty04', 'dc01', 'dc02'), pass: 0.7 } }),
  L('n5_u07_l3', { title: 'In the room', goal: 'Name things and animals around you.', introduces: { vocab: ids(vocabL.l3) },
    explain: [{ heading: 'Furniture and animals', body: ['つくえ (desk), テーブル, ほんだな, でんき, エアコン. Animals: ねこ (cat), いぬ (dog), とり (bird).'], examples: [{ ja: 'つくえ と いす', reading: 'tsukue to isu', en: 'a desk and a chair' }] }],
    practice: { question_ids: qs('ty06', 'ty07').concat(vmq(vocabL.l3)) },
    exit_check: { question_ids: qs('ty06', 'ty07'), pass: 0.7 } }),
  L('n5_u07_l4', { title: 'ここ・そこ・あそこ・どこ', goal: 'Ask where a place is and point to it.', introduces: { vocab: ids(vocabL.l4), grammar: ['g_koko_soko_asoko'] },
    explain: [{ heading: 'Near, near you, far, where', body: ['ここ is near me, そこ is near you, あそこ is far from both. どこ asks "where?". Example: おてあらい は どこ です か → あそこ です.'], examples: [{ ja: 'おてあらい は どこ です か', reading: 'otearai wa doko desu ka', en: 'Where is the restroom?' }] }],
    practice: { question_ids: qs('gd01', 'gd02', 'gd03', 'gd04', 'gd05', 'gd06', 'ty08').concat(vmq(vocabL.l4)) },
    exit_check: { question_ids: qs('gd01', 'gd02', 'gd03', 'gd04', 'gd06', 'ty08'), pass: 0.7 } }),
  L('n5_u07_l5', { title: 'あります and います', goal: 'Say that something exists and where it is.', introduces: { vocab: ids(vocabL.l5), grammar: ['g_ni_location', 'g_aru_iru'] },
    explain: [{ heading: 'Things and living things', body: ['あります is for things; います is for people and animals. The negatives are ありません and いません.', 'Where something is: ほん は つくえ の うえ に あります. That something exists: つくえ の うえ に ほん が あります.'], examples: [{ ja: 'つくえ の うえ に ほん が あります', reading: 'tsukue no ue ni hon ga arimasu', en: 'There is a book on the desk.' }, { ja: 'いす の した に ねこ が います', reading: 'isu no shita ni neko ga imasu', en: 'There is a cat under the chair.' }] }],
    practice: { question_ids: qs('gn01', 'gn02', 'gn03', 'gn04', 'ga01', 'ga02', 'ga03', 'ga04', 'tr01', 'tr02', 'tr03', 'tr04').concat(vmq(vocabL.l5)) },
    context: { question_ids: qs('gn05', 'gn06', 'ga05', 'ga06', 'ga07', 'tr05', 'tr06', 'tr07', 'tr08', 'tr09', 'tr10', 'tr11', 'tr12') },
    exit_check: { question_ids: qs('gn01', 'gn02', 'gn04', 'ga01', 'ga02', 'ga03', 'ga06', 'tr01'), pass: 0.7 } }),
  L('n5_u07_l6', { title: 'Kanji: 口 出 入 駅 店 町 家 学 校', goal: 'Read the kanji you see on station and street signs.', introduces: { kanji: ids(kanji) },
    explain: [{ heading: 'Signs in kanji', body: ['出口 (exit) and 入口 (entrance) are on every station. 駅 is a station, 店 a shop, 町 a town, 家 a house, 学校 a school.', 'Kanji appear with furigana until you have learned them.'], examples: [{ ja: '出口', reading: 'deguchi', en: 'exit' }, { ja: '駅', reading: 'eki', en: 'station' }] }],
    practice: { question_ids: qs('kd01', 'kd02', 'kd03', 'kd04', 'kd05', 'kd06', 'kd07', 'kd08', 'kd09', 'kk01', 'kk02', 'kk03', 'kk04', 'kk05', 'kk06', 'kk07', 'kmt01', 'kcf01', 'kcf02', 'kcf03') },
    exit_check: { question_ids: qs('kd01', 'kd02', 'kd03', 'kd04', 'kk05', 'kk06', 'kmt01', 'kcf01'), pass: 0.7 } }),
  L('n5_u07_l7', { title: 'Listen and read', goal: 'Understand street directions by ear and read signs and notes.', introduces: {},
    explain: [{ heading: 'Directions in short phrases', body: ['Listen for the location word and the place. Then read short notes and signs.'], examples: [{ ja: 'ぎんこう は どこ です か', reading: 'ginkou wa doko desu ka', en: 'Where is the bank?' }] }],
    practice: { question_ids: qs('gl05', 'gl06', 'gl07', 'gl08', 'dg01', 'dg02', 'dg03', 'dg04', 'dg05', 'dg06', 'dc04') },
    context: { question_ids: qs('rq01', 'rq02', 'rq03', 'rq04', 'rq05', 'rq06', 'rq07', 'rq08', 'rq09', 'rq10') },
    exit_check: { question_ids: qs('gl05', 'gl07', 'dg01', 'dg03', 'rq01', 'rq05', 'rq08'), pass: 0.7 } }),
  L('n5_u07_l8', { title: 'Review: units 1 to 7', goal: 'Mix words from the first seven units.', introduces: {},
    explain: [{ heading: 'Review', body: ['Earlier words return to keep them fresh.'], examples: [{ ja: 'わたし の いえ', reading: 'watashi no ie', en: 'my house' }] }],
    practice: { question_ids: spiralIds.slice(0, 20) },
    context: { question_ids: spiralIds.slice(20, 44) },
    exit_check: { question_ids: spiralIds.slice(0, 5).concat(spiralIds.slice(44, 48)), pass: 0.7 } }),
];

// ---------- Residential street quest (QT_READ_SIGN): 10 items, 3+ from earlier units ----------
const quests = [{ id: 'q_residential_street_1', destination_id: 'residential_street', type: 'QT_READ_SIGN', unit_id: 'n5_u07', min_accuracy: 0.8, provenance: 'orig',
  question_ids: ['q_n5u07_rq01', 'q_n5u07_rq02', 'q_n5u07_rq03', 'q_n5u07_rq04', 'q_n5u07_rq05', 'q_n5u07_rq06', 'q_n5u07_rq08', 'q_n5u06_rq04', 'q_n5u05_rq04', 'q_n5u04_rq04'],
  spiral_question_ids: ['q_n5u06_rq04', 'q_n5u05_rq04', 'q_n5u04_rq04'] }];

export default { vocab, kanji, sentences, questions, listening, passages, lessons, dialogues, grammar, quests };
