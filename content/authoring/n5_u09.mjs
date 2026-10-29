// n5_u09 "Describing things" - hand-written original content.
// Grammar: i-adjectives and na-adjectives (present, negative, before a noun), degree words, が (but) and が with likes. Kanji scope: 高 安 新 古 長 多 少 白 赤 青.
import { kanaToRomaji, hasKanji } from '../../src/content/romaji.js';
import { unit, choices, countChars, meaningQuestions, kit, spiral, SPIRAL_EXCLUDE } from '../../scripts/lib/author-helpers.mjs';
import u01 from './n5_u01.mjs';
import u02 from './n5_u02.mjs';
import u03 from './n5_u03.mjs';
import u04 from './n5_u04.mjs';
import u05 from './n5_u05.mjs';
import u06 from './n5_u06.mjs';
import u07 from './n5_u07.mjs';
import u08 from './n5_u08.mjs';

const U = unit('n5_u09');
const { vocab: V, sentence: S, question: Q, lesson: L, listening: LS, passage: PS, dialogue: DG, grammar: GR, kanji: KJ } = U;

// ---------- vocabulary ----------
const vocabL = {
  l1: [
    V('takai', 'たかい', 'たかい', ['expensive', 'tall', 'high'], 'i-adjective', ['s_n5u09_a01', 's_n5u09_k01']),
    V('yasui', 'やすい', 'やすい', ['cheap', 'inexpensive'], 'i-adjective', ['s_n5u09_a02', 's_n5u09_k02']),
    V('hikui', 'ひくい', 'ひくい', ['low', 'short (height)'], 'i-adjective', ['s_n5u09_a03']),
    V('nagai', 'ながい', 'ながい', ['long'], 'i-adjective', ['s_n5u09_a04']),
    V('mijikai', 'みじかい', 'みじかい', ['short (length)'], 'i-adjective', ['s_n5u09_a05']),
    V('omoi', 'おもい', 'おもい', ['heavy'], 'i-adjective', ['s_n5u09_a06', 's_n5u09_k03']),
    V('karui', 'かるい', 'かるい', ['light (not heavy)'], 'i-adjective', ['s_n5u09_a07']),
    V('atsui', 'あつい', 'あつい', ['hot (weather or things)'], 'i-adjective', ['s_n5u09_a08'], { note: 'Another あつい means "thick"; this one is "hot".' }),
    V('samui', 'さむい', 'さむい', ['cold (weather)'], 'i-adjective', ['s_n5u09_a09', 's_n5u09_k05']),
    V('tsumetai', 'つめたい', 'つめたい', ['cold (to the touch)'], 'i-adjective', ['s_n5u09_a10', 's_n5u09_k06']),
    V('hiroi', 'ひろい', 'ひろい', ['wide', 'spacious'], 'i-adjective', ['s_n5u09_a11', 's_n5u09_k15']),
    V('semai', 'せまい', 'せまい', ['narrow', 'cramped'], 'i-adjective', ['s_n5u09_a12']),
  ],
  l2: [
    V('hayai', 'はやい', 'はやい', ['fast', 'early'], 'i-adjective', ['s_n5u09_a13']),
    V('osoi', 'おそい', 'おそい', ['slow', 'late'], 'i-adjective', ['s_n5u09_a14']),
    V('muzukashii', 'むずかしい', 'むずかしい', ['difficult'], 'i-adjective', ['s_n5u09_k08']),
    V('yasashii', 'やさしい', 'やさしい', ['easy', 'kind'], 'i-adjective', ['s_n5u09_k09'], { note: 'Two meanings: "easy" (a task) and "kind" (a person). Context decides.' }),
    V('omoshiroi', 'おもしろい', 'おもしろい', ['interesting', 'funny'], 'i-adjective', ['s_n5u09_k07']),
    V('tanoshii', 'たのしい', 'たのしい', ['fun', 'enjoyable'], 'i-adjective', ['s_n5u09_a15']),
    V('isogashii', 'いそがしい', 'いそがしい', ['busy'], 'i-adjective', ['s_n5u09_k10']),
    V('shiroi', 'しろい', 'しろい', ['white'], 'i-adjective', ['s_n5u09_a16']),
    V('kuroi', 'くろい', 'くろい', ['black'], 'i-adjective', ['s_n5u09_a17']),
    V('ii', 'いい', 'いい', ['good'], 'i-adjective', ['s_n5u09_a18'], { note: 'いい is the everyday word; its forms use よ: よくない (not good).' }),
    V('warui', 'わるい', 'わるい', ['bad'], 'i-adjective', ['s_n5u09_a19']),
  ],
  l3: [
    V('kirei', 'きれい', 'きれい', ['pretty', 'clean'], 'na-adjective', ['s_n5u09_k16'], { note: 'きれい ends in い but is a na-adjective: きれい な まち.' }),
    V('shizuka', 'しずか', 'しずか', ['quiet'], 'na-adjective', ['s_n5u09_k17']),
    V('nigiyaka', 'にぎやか', 'にぎやか', ['lively', 'bustling'], 'na-adjective', ['s_n5u09_k18']),
    V('genki', 'げんき', 'げんき', ['healthy', 'cheerful'], 'na-adjective', ['s_n5u09_k19']),
    V('suki', 'すき', 'すき', ['liked', 'to like'], 'na-adjective', ['s_n5u09_k20'], { note: 'The thing you like takes が: ねこ が すき です.' }),
    V('kirai', 'きらい', 'きらい', ['disliked', 'to dislike'], 'na-adjective', ['s_n5u09_k21']),
    V('jouzu', 'じょうず', 'じょうず', ['good at', 'skilful'], 'na-adjective', ['s_n5u09_k22']),
    V('heta', 'へた', 'へた', ['bad at', 'unskilful'], 'na-adjective', ['s_n5u09_k23']),
    V('taihen', 'たいへん', 'たいへん', ['hard', 'tough', 'terrible'], 'na-adjective', ['s_n5u09_k24']),
    V('benri', 'べんり', 'べんり', ['convenient'], 'na-adjective', ['s_n5u09_k25']),
    V('hima', 'ひま', 'ひま', ['free (not busy)'], 'na-adjective', ['s_n5u09_k26']),
  ],
  l4: [
    V('totemo', 'とても', 'とても', ['very'], 'adverb', ['s_n5u09_k29']),
    V('amari', 'あまり', 'あまり', ['not very', 'not much (with a negative)'], 'adverb', ['s_n5u09_k30']),
    V('sukoshi', 'すこし', 'すこし', ['a little', 'a few'], 'adverb', ['s_n5u09_k31']),
    V('zenzen', 'ぜんぜん', 'ぜんぜん', ['not at all (with a negative)'], 'adverb', ['s_n5u09_k32']),
    V('dou', 'どう', 'どう', ['how'], 'question word', ['s_n5u09_k33']),
    V('donna', 'どんな', 'どんな', ['what kind of'], 'question word', ['s_n5u09_k34']),
  ],
  l7: [
    V('biru', 'ビル', 'x', ['building (large)'], 'noun (loanword)', ['s_n5u09_t01'], { destination_tags: ['shibuya'] }),
    V('fuku', 'ふく', 'ふく', ['clothes'], 'noun', ['s_n5u09_t02'], { destination_tags: ['shibuya'] }),
    V('basho', 'ばしょ', 'ばしょ', ['place', 'spot'], 'noun', ['s_n5u09_t03'], { destination_tags: ['shibuya'] }),
    V('ninki', 'にんき', 'にんき', ['popular', 'popularity'], 'noun', ['s_n5u09_t03', 's_n5u09_t04'], { destination_tags: ['shibuya'] }),
    V('seeru', 'セール', 'x', ['sale (discount)'], 'noun (loanword)', ['s_n5u09_t05'], { destination_tags: ['shibuya'] }),
    V('koosaten', 'こうさてん', 'こうさてん', ['crossing', 'intersection'], 'noun', ['s_n5u09_t06'], { destination_tags: ['shibuya'] }),
  ],
};
const vocab = Object.values(vocabL).flat();
for (const w of vocab) if (!hasKanji(w.surface)) { w.reading_kana = w.surface; w.romaji = kanaToRomaji(w.surface); }

// ---------- kanji ----------
const kanji = [
  KJ('k_takai', { char: '高', meanings_en: ['high', 'expensive'], on_readings: ['こう'], kun_readings: ['たか'], reading_notes: 'In 高い the kanji is read たか and い is written in kana.', stroke_count: 10, example_word_ids: ['v_takai'], tags: ['adjectives'] }),
  KJ('k_yasu', { char: '安', meanings_en: ['cheap', 'peaceful'], on_readings: ['あん'], kun_readings: ['やす'], stroke_count: 6, example_word_ids: ['v_yasui'], tags: ['adjectives'] }),
  KJ('k_shin', { char: '新', meanings_en: ['new'], on_readings: ['しん'], kun_readings: ['あたら', 'あら'], stroke_count: 13, example_word_ids: ['v_atarashii'], confusable_with: ['k_furu'], tags: ['adjectives'] }),
  KJ('k_furu', { char: '古', meanings_en: ['old (things)'], on_readings: ['こ'], kun_readings: ['ふる'], stroke_count: 5, example_word_ids: ['v_furui'], confusable_with: ['k_shin'], tags: ['adjectives'] }),
  KJ('k_naga', { char: '長', meanings_en: ['long'], on_readings: ['ちょう'], kun_readings: ['なが'], stroke_count: 8, example_word_ids: ['v_nagai'], tags: ['adjectives'] }),
  KJ('k_ooi', { char: '多', meanings_en: ['many', 'much'], on_readings: ['た'], kun_readings: ['おお'], stroke_count: 6, example_word_ids: ['v_ookii'], tags: ['adjectives'] }),
  KJ('k_sukuna', { char: '少', meanings_en: ['few', 'little'], on_readings: ['しょう'], kun_readings: ['すく', 'すこ'], stroke_count: 4, example_word_ids: ['v_sukoshi'], confusable_with: ['k_shou'], tags: ['adjectives'] }),
  KJ('k_shiro', { char: '白', meanings_en: ['white'], on_readings: ['はく', 'びゃく'], kun_readings: ['しろ'], stroke_count: 5, example_word_ids: ['v_shiroi'], tags: ['colours'] }),
  KJ('k_aka', { char: '赤', meanings_en: ['red'], on_readings: ['せき'], kun_readings: ['あか'], stroke_count: 7, example_word_ids: ['v_akai'], confusable_with: ['k_ao'], tags: ['colours'] }),
  KJ('k_ao', { char: '青', meanings_en: ['blue', 'green'], on_readings: ['せい'], kun_readings: ['あお'], stroke_count: 8, example_word_ids: ['v_aoi'], confusable_with: ['k_aka'], tags: ['colours'] }),
];

// ---------- phrases and sentences ----------
const ph = (n, text, en, ids) => S(`s_n5u09_${n}`, 'phrase', text, text, en, ids);
const sn = (n, text, en, ids, extra = {}) => S(`s_n5u09_${n}`, 'sentence', text, text, en, ids, extra);
const kj = (n, text, reading, en, ids, ruby) => S(`s_n5u09_${n}`, 'phrase', text, reading, en, ids, { ruby, kanji_used: [...text].filter((c) => /[一-龥]/.test(c)) });
const sentences = [
  ph('a01', 'たかい とけい', 'an expensive watch', ['v_takai', 'v_tokei']), ph('a02', 'やすい パン', 'cheap bread', ['v_yasui', 'v_pan_k']), ph('a03', 'ひくい つくえ', 'a low desk', ['v_hikui', 'v_tsukue']), ph('a04', 'ながい かわ', 'a long river', ['v_nagai', 'v_kawa']),
  ph('a05', 'みじかい てがみ', 'a short letter', ['v_mijikai', 'v_tegami']), ph('a06', 'おもい かばん', 'a heavy bag', ['v_omoi', 'v_kaban']), ph('a07', 'かるい ふくろ', 'a light bag', ['v_karui', 'v_fukuro']), ph('a08', 'あつい おちゃ', 'hot tea', ['v_atsui', 'v_ocha']),
  ph('a09', 'さむい あさ', 'a cold morning', ['v_samui', 'v_asa']), ph('a10', 'つめたい みず', 'cold water', ['v_tsumetai', 'v_mizu']), ph('a11', 'ひろい へや', 'a spacious room', ['v_hiroi', 'v_heya']), ph('a12', 'せまい みち', 'a narrow road', ['v_semai']),
  ph('a13', 'はやい でんしゃ', 'a fast train', ['v_hayai', 'v_densha']), ph('a14', 'おそい バス', 'a slow bus', ['v_osoi', 'v_basu']), ph('a15', 'たのしい パーティー', 'a fun party', ['v_tanoshii', 'v_paatii']), ph('a16', 'しろい シャツ', 'a white shirt', ['v_shiroi', 'v_shatsu']),
  ph('a17', 'くろい くつ', 'black shoes', ['v_kuroi', 'v_kutsu']), ph('a18', 'いい てんき', 'good weather', ['v_ii']), ph('a19', 'わるい ニュース', 'bad news', ['v_warui', 'v_nyuusu']),
  sn('k01', 'この とけい は たかい です', 'This watch is expensive.', ['v_kono', 'v_tokei', 'v_takai', 'v_desu']), sn('k02', 'この パン は やすい です', 'This bread is cheap.', ['v_kono', 'v_pan_k', 'v_yasui', 'v_desu']), sn('k03', 'この かばん は おもい です', 'This bag is heavy.', ['v_kono', 'v_kaban', 'v_omoi', 'v_desu']),
  sn('k04', 'あの やま は たかい です', 'That mountain over there is tall.', ['v_ano', 'v_yama', 'v_takai', 'v_desu']), sn('k05', 'きょう は さむい です', 'It is cold today.', ['v_kyou', 'v_samui', 'v_desu']), sn('k06', 'この みず は つめたい です', 'This water is cold.', ['v_kono', 'v_mizu', 'v_tsumetai', 'v_desu']),
  sn('k07', 'この ほん は おもしろい です', 'This book is interesting.', ['v_kono', 'v_hon', 'v_omoshiroi', 'v_desu']), sn('k08', 'にほんご は むずかしい です', 'Japanese is difficult.', ['v_nihongo', 'v_muzukashii', 'v_desu']), sn('k09', 'この ほん は やさしい です', 'This book is easy.', ['v_kono', 'v_hon', 'v_yasashii', 'v_desu']),
  sn('k10', 'しごと は いそがしい です', 'Work is busy.', ['v_shigoto', 'v_isogashii', 'v_desu']), sn('k11', 'わたし の いえ は ふるい です', 'My house is old.', ['v_watashi', 'v_ie', 'v_furui', 'v_desu']),
  sn('k12', 'この ケーキ は おいしい です が たかい です', 'This cake is delicious, but expensive.', ['v_kono', 'v_keeki', 'v_oishii', 'v_takai', 'v_desu']), sn('k13', 'この みせ は やすい です が おいしく ない です', 'This shop is cheap, but the food is not good.', ['v_kono', 'v_mise', 'v_yasui', 'v_desu']),
  sn('k14', 'この ラーメン は おいしく ない です', 'This ramen is not delicious.', ['v_kono', 'v_raamen']), sn('k15', 'この へや は ひろく ない です', 'This room is not spacious.', ['v_kono', 'v_heya']),
  sn('k16', 'この まち は きれい です', 'This town is pretty.', ['v_kono', 'v_machi', 'v_kirei', 'v_desu']), sn('k17', 'この こうえん は しずか です', 'This park is quiet.', ['v_kono', 'v_kouen', 'v_shizuka', 'v_desu']), sn('k18', 'しぶや は にぎやか です', 'Shibuya is lively.', ['v_nigiyaka', 'v_desu']),
  sn('k19', 'たなか さん は げんき です', 'Ms. Tanaka is well.', ['v_san', 'v_genki', 'v_desu']), sn('k20', 'わたし は ねこ が すき です', 'I like cats.', ['v_watashi', 'v_neko', 'v_suki', 'v_desu']), sn('k21', 'わたし は ビール が きらい です', 'I dislike beer.', ['v_watashi', 'v_biiru', 'v_kirai', 'v_desu']),
  sn('k22', 'わたし は りょうり が じょうず です', 'I am good at cooking.', ['v_watashi', 'v_ryouri', 'v_jouzu', 'v_desu']), sn('k23', 'ともだち は うた が へた です', 'My friend is bad at singing.', ['v_tomodachi', 'v_uta', 'v_heta', 'v_desu']), sn('k24', 'しごと は たいへん です', 'Work is tough.', ['v_shigoto', 'v_taihen', 'v_desu']),
  sn('k25', 'この ちず は べんり です', 'This map is convenient.', ['v_kono', 'v_chizu', 'v_benri', 'v_desu']), sn('k26', 'きょう は ひま です', 'I am free today.', ['v_kyou', 'v_hima', 'v_desu']), sn('k27', 'この まち は しずか じゃ ありません', 'This town is not quiet.', ['v_kono', 'v_machi', 'v_shizuka']),
  sn('k28', 'たなか さん は ひま じゃ ありません', 'Ms. Tanaka is not free.', ['v_san', 'v_hima']), sn('k29', 'この とけい は とても たかい です', 'This watch is very expensive.', ['v_totemo', 'v_takai', 'v_desu']), sn('k30', 'この とけい は あまり たかく ない です', 'This watch is not very expensive.', ['v_amari', 'v_tokei']),
  sn('k31', 'この スープ は すこし つめたい です', 'This soup is a little cold.', ['v_sukoshi', 'v_suupu', 'v_tsumetai', 'v_desu']), sn('k32', 'この ケーキ は ぜんぜん あまく ない です', 'This cake is not sweet at all.', ['v_zenzen', 'v_keeki']),
  sn('k33', 'この まち は どう です か', 'How is this town?', ['v_dou', 'v_machi', 'v_desu']), sn('k34', 'どんな ほん です か', 'What kind of book is it?', ['v_donna', 'v_hon', 'v_desu']),
  sn('k35', 'きれい な まち です', 'It is a pretty town.', ['v_kirei', 'v_machi', 'v_desu']), sn('k36', 'しずか な こうえん です', 'It is a quiet park.', ['v_shizuka', 'v_kouen', 'v_desu']), sn('k37', 'にぎやか な みせ です', 'It is a lively shop.', ['v_nigiyaka', 'v_mise', 'v_desu']),
  sn('k38', 'おおきい いえ です', 'It is a big house.', ['v_ookii', 'v_ie', 'v_desu']), sn('k39', 'ゆうめい な ひと です', 'It is a famous person.', ['v_yuumei', 'v_hito', 'v_desu']), sn('k40', 'きょう は あつく ない です', 'It is not hot today.', ['v_kyou']),
  sn('k41', 'いい てんき です', 'It is good weather.', ['v_ii', 'v_desu']),
  sn('t01', 'あの ビル は たかい です', 'That building over there is tall.', ['v_ano', 'v_biru', 'v_takai', 'v_desu']), sn('t02', 'この ふく は やすい です', 'These clothes are cheap.', ['v_kono', 'v_fuku', 'v_yasui', 'v_desu']),
  sn('t03', 'ここ は にんき の ばしょ です', 'This is a popular spot.', ['v_koko', 'v_ninki', 'v_basho', 'v_desu']), sn('t04', 'この みせ は にんき です', 'This shop is popular.', ['v_kono', 'v_mise', 'v_ninki', 'v_desu']),
  sn('t05', 'ふく の セール', 'a clothes sale', ['v_fuku', 'v_seeru']), sn('t06', 'こうさてん は にぎやか です', 'The crossing is lively.', ['v_koosaten', 'v_nigiyaka', 'v_desu']),
  sn('t07', 'この みせ は セール です', 'This shop has a sale.', ['v_kono', 'v_mise', 'v_seeru', 'v_desu']), sn('t08', 'この ビル に いい レストラン が あります', 'There is a good restaurant in this building.', ['v_kono', 'v_biru', 'v_ii', 'v_resutoran', 'v_arimasu']),
  kj('n01', '高い', 'たかい', 'expensive, tall', ['v_takai'], { 高: 'たか' }), kj('n02', '安い', 'やすい', 'cheap', ['v_yasui'], { 安: 'やす' }), kj('n03', '新しい', 'あたらしい', 'new', ['v_atarashii'], { 新: 'あたら' }), kj('n04', '古い', 'ふるい', 'old', ['v_furui'], { 古: 'ふる' }),
  kj('n05', '長い', 'ながい', 'long', ['v_nagai'], { 長: 'なが' }), kj('n06', '大きい', 'おおきい', 'big (large)', ['v_ookii'], { 大: 'おお' }), kj('n07', '少し', 'すこし', 'a little', ['v_sukoshi'], { 少: 'すこ' }), kj('n08', '白い', 'しろい', 'white', ['v_shiroi'], { 白: 'しろ' }),
  kj('n09', '赤い', 'あかい', 'red', ['v_akai'], { 赤: 'あか' }), kj('n10', '青い', 'あおい', 'blue', ['v_aoi'], { 青: 'あお' }), kj('n11', '高い 山', 'たかい やま', 'a high mountain', ['v_takai', 'v_yama'], { 高: 'たか' }), kj('n12', '新しい 店', 'あたらしい みせ', 'a new shop', ['v_atarashii', 'v_mise'], { 新: 'あたら', 店: 'みせ' }),
];
const sentIdx = Object.fromEntries(sentences.map((s) => [s.id, s]));
const K = kit(Q, 'n5u09', sentIdx);

const questions = [];
const add = (...q) => questions.push(...q);

// ---------- adjective vocabulary ----------
const av = (n, word, ans, others, vid, note) => Q(`q_n5u09_av${n}`, 'mcq', { stem: { prompt: 'What does this adjective mean?', ja: word }, choices: choices([['a', ans], ...others.map((o, i) => [`d${i + 1}`, o])]), answer: 'a', explanation_correct: note, explanation_per_distractor: Object.fromEntries(others.map((o, i) => [`d${i + 1}`, 'That is a different word.'])), facet: 'meaning', targets: [vid], difficulty: 1 });
add(av('01', 'たかい', 'expensive / tall', ['cheap', 'short'], 'v_takai', 'たかい = expensive or tall.'), av('02', 'やすい', 'cheap', ['expensive', 'easy'], 'v_yasui', 'やすい = cheap.'), av('03', 'おもい', 'heavy', ['light', 'long'], 'v_omoi', 'おもい = heavy.'), av('04', 'かるい', 'light', ['heavy', 'short'], 'v_karui', 'かるい = light in weight.'),
  av('05', 'ながい', 'long', ['short', 'wide'], 'v_nagai', 'ながい = long.'), av('06', 'みじかい', 'short (length)', ['long', 'low'], 'v_mijikai', 'みじかい = short.'), av('07', 'さむい', 'cold (weather)', ['hot', 'cold to the touch'], 'v_samui', 'さむい = cold weather.'), av('08', 'つめたい', 'cold (to the touch)', ['cold weather', 'hot'], 'v_tsumetai', 'つめたい = cold to the touch.'),
  av('09', 'ひろい', 'wide / spacious', ['narrow', 'long'], 'v_hiroi', 'ひろい = wide.'), av('10', 'せまい', 'narrow / cramped', ['wide', 'low'], 'v_semai', 'せまい = narrow.'), av('11', 'はやい', 'fast / early', ['slow', 'late'], 'v_hayai', 'はやい = fast, early.'), av('12', 'おそい', 'slow / late', ['fast', 'early'], 'v_osoi', 'おそい = slow, late.'),
  av('13', 'むずかしい', 'difficult', ['easy', 'busy'], 'v_muzukashii', 'むずかしい = difficult.'), av('14', 'おもしろい', 'interesting', ['difficult', 'busy'], 'v_omoshiroi', 'おもしろい = interesting.'), av('15', 'いそがしい', 'busy', ['fun', 'free'], 'v_isogashii', 'いそがしい = busy.'), av('16', 'たのしい', 'fun', ['busy', 'difficult'], 'v_tanoshii', 'たのしい = fun.'));
add(Q('q_n5u09_amt01', 'matching', { stem: { prompt: 'Match each adjective with its opposite.' }, pairs: [['たかい', 'やすい'], ['おもい', 'かるい'], ['ながい', 'みじかい'], ['ひろい', 'せまい'], ['はやい', 'おそい'], ['あつい', 'さむい']], answer: ['たかい', 'おもい', 'ながい', 'ひろい', 'はやい', 'あつい'], explanation_correct: 'Learn adjectives in opposite pairs.', facet: 'meaning', targets: ['v_takai', 'v_yasui', 'v_omoi', 'v_karui', 'v_nagai', 'v_mijikai', 'v_hiroi', 'v_semai', 'v_hayai', 'v_osoi', 'v_atsui', 'v_samui'], difficulty: 3 }),
  Q('q_n5u09_amt02', 'matching', { stem: { prompt: 'Match each na-adjective with its meaning.' }, pairs: [['きれい', 'pretty, clean'], ['しずか', 'quiet'], ['にぎやか', 'lively'], ['げんき', 'healthy'], ['べんり', 'convenient'], ['ひま', 'free']], answer: ['きれい', 'しずか', 'にぎやか', 'げんき', 'べんり', 'ひま'], explanation_correct: 'These adjectives take な before a noun.', facet: 'meaning', targets: ['v_kirei', 'v_shizuka', 'v_nigiyaka', 'v_genki', 'v_benri', 'v_hima'], difficulty: 2 }));
add(K.ty('01', 'expensive', 'たかい', 'v_takai'), K.ty('02', 'cheap', 'やすい', 'v_yasui'), K.ty('03', 'heavy', 'おもい', 'v_omoi'), K.ty('04', 'cold (weather)', 'さむい', 'v_samui'), K.ty('05', 'difficult', 'むずかしい', 'v_muzukashii'), K.ty('06', 'interesting', 'おもしろい', 'v_omoshiroi'), K.ty('07', 'quiet', 'しずか', 'v_shizuka'), K.ty('08', 'convenient', 'べんり', 'v_benri'), K.ty('09', 'very', 'とても', 'v_totemo'), K.ty('10', 'a little', 'すこし', 'v_sukoshi'));
const nonAdj = vocab.filter((w) => !/^(i-adjective|na-adjective)$/.test(w.pos));
add(...meaningQuestions(Q, nonAdj, nonAdj, 1));
const adjV = vocab.filter((w) => /adjective/.test(w.pos));
add(...meaningQuestions(Q, adjV, adjV, 1));
add(...spiral(Q, 'n5u09', [...u01.vocab, ...u02.vocab.filter((w) => w.pos !== 'expression'), ...u03.vocab, ...u04.vocab, ...u05.vocab, ...u06.vocab, ...u07.vocab, ...u08.vocab].filter((w) => !SPIRAL_EXCLUDE.test(w.id)), { rem: 0, step: 4, n: 100, mod: 11 }));

// ---------- grammar ----------
const gq = { i: [], na: [], deg: [], ga: [] };
const G = (key, ...q) => { gq[key].push(...q.map((x) => x.id)); add(...q); };
G('i',
  Q('q_n5u09_gi01', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'この とけい は たかい です' }, choices: choices([['a', 'This watch is expensive.'], ['b', 'This is an expensive watch shop.'], ['c', 'This watch is not expensive.']]), answer: 'a', explanation_correct: 'An i-adjective + です describes the topic.', explanation_per_distractor: { b: 'There is no word for shop.', c: 'The negative would be たかくない です.' }, facet: 'meaning', targets: ['g_i_adjective', 'v_tokei', 'v_takai'], source_sentence_id: 's_n5u09_k01', difficulty: 1 }),
  Q('q_n5u09_gi02', 'fill_blank', { stem: { prompt: 'Complete: This ramen is not delicious.', ja: 'この ラーメン は おいしく ＿＿ です' }, choices: choices([['a', 'ない', true], ['b', 'ありません', true], ['c', 'じゃ', true]]), answer: 'a', explanation_correct: 'i-adjective negative: remove い, add くない: おいしくない です.', explanation_per_distractor: { b: 'ありません also works as くありません, but it replaces です, not follows it.', c: 'じゃ ありません is for nouns and na-adjectives.' }, facet: 'construct', targets: ['g_i_adjective', 'v_raamen', 'v_oishii'], source_sentence_id: 's_n5u09_k14', difficulty: 2 }),
  Q('q_n5u09_gi03', 'mcq', { stem: { prompt: 'What is the negative of やすい (cheap)?' }, choices: choices([['a', 'やすくない', true], ['b', 'やすじゃない', true], ['c', 'やすいない', true]]), answer: 'a', explanation_correct: 'Drop い, add くない: やすくない. (Polite: やすくない です / やすく ありません.)', explanation_per_distractor: { b: 'じゃない is for nouns and na-adjectives.', c: 'You must drop the final い.' }, facet: 'meaning', targets: ['g_i_adjective', 'v_yasui'], difficulty: 2 }),
  Q('q_n5u09_gi04', 'sentence_order', { stem: { prompt: 'Put the words in order: This room is not spacious.' }, tiles: ['です', 'この', 'ない', 'へや', 'ひろく', 'は'], answer: ['この', 'へや', 'は', 'ひろく', 'ない', 'です'], explanation_correct: 'ひろい → ひろくない + です.', facet: 'construct', targets: ['g_i_adjective', 'v_heya', 'v_hiroi'], source_sentence_id: 's_n5u09_k15', difficulty: 3 }),
  Q('q_n5u09_gi05', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'おおきい いえ です' }, choices: choices([['a', 'It is a big house.'], ['b', 'The house is big.'], ['c', 'It is not a big house.']]), answer: 'a', explanation_correct: 'An i-adjective goes straight before the noun: おおきい いえ.', explanation_per_distractor: { b: 'The structure puts the adjective before the noun, so it describes the noun.', c: 'There is no negative.' }, facet: 'meaning', targets: ['g_i_adjective', 'v_ookii', 'v_ie'], source_sentence_id: 's_n5u09_k38', difficulty: 2 }),
  Q('q_n5u09_gi06', 'error_correction', { stem: { prompt: 'One word is wrong. What replaces たかい so the sentence means "This watch is not expensive"?', ja: 'この とけい は たかい ない です' }, choices: choices([['a', 'たかく', true], ['b', 'たか', true], ['c', 'たかい な', true]]), answer: 'a', explanation_correct: 'たかい → たかくない: drop い and add く before ない.', explanation_per_distractor: { b: 'You need く before ない.', c: 'な is for na-adjectives.' }, facet: 'construct', targets: ['g_i_adjective', 'v_takai', 'v_tokei'], difficulty: 3 }),
  Q('q_n5u09_gi07', 'mcq', { stem: { prompt: 'Which adjective is an exception: its negative is よくない, not いくない?' }, choices: choices([['a', 'いい', true], ['b', 'たかい', true], ['c', 'やすい', true]]), answer: 'a', explanation_correct: 'いい (good) uses the older form よい in its endings: よくない.', explanation_per_distractor: { b: 'たかい is regular.', c: 'やすい is regular.' }, facet: 'meaning', targets: ['g_i_adjective', 'v_ii'], difficulty: 3 }));
G('na',
  Q('q_n5u09_gn01', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'この まち は きれい です' }, choices: choices([['a', 'This town is pretty.'], ['b', 'This is a pretty town shop.'], ['c', 'This town is not pretty.']]), answer: 'a', explanation_correct: 'A na-adjective is used before です just like a noun.', explanation_per_distractor: { b: 'There is no word for shop.', c: 'The negative needs じゃ ありません.' }, facet: 'meaning', targets: ['g_na_adjective', 'v_machi', 'v_kirei'], source_sentence_id: 's_n5u09_k16', difficulty: 1 }),
  Q('q_n5u09_gn02', 'fill_blank', { stem: { prompt: 'Complete: It is a quiet park.', ja: 'しずか ＿＿ こうえん です' }, choices: choices([['a', 'な', true], ['b', 'の', true], ['c', 'い', true]]), answer: 'a', explanation_correct: 'A na-adjective needs な before a noun.', explanation_per_distractor: { b: 'の links nouns, not na-adjectives and nouns.', c: 'い is the ending of i-adjectives.' }, facet: 'construct', targets: ['g_na_adjective', 'v_shizuka', 'v_kouen'], source_sentence_id: 's_n5u09_k36', difficulty: 2 }),
  Q('q_n5u09_gn03', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'この まち は しずか じゃ ありません' }, choices: choices([['a', 'This town is not quiet.'], ['b', 'This town is quiet.'], ['c', 'Is this town quiet?']]), answer: 'a', explanation_correct: 'Negative of a na-adjective: じゃ ありません.', explanation_per_distractor: { b: 'The negative reverses the meaning.', c: 'There is no か.' }, facet: 'meaning', targets: ['g_na_adjective', 'v_machi', 'v_shizuka'], source_sentence_id: 's_n5u09_k27', difficulty: 2 }),
  Q('q_n5u09_gn04', 'sentence_order', { stem: { prompt: 'Put the words in order: It is a lively shop.' }, tiles: ['です', 'みせ', 'な', 'にぎやか'], answer: ['にぎやか', 'な', 'みせ', 'です'], explanation_correct: 'na-adjective + な + noun.', facet: 'construct', targets: ['g_na_adjective', 'v_nigiyaka', 'v_mise'], source_sentence_id: 's_n5u09_k37', difficulty: 2 }),
  Q('q_n5u09_gn05', 'mcq', { stem: { prompt: 'Which is correct: "a famous person"?' }, choices: choices([['a', 'ゆうめい な ひと', true], ['b', 'ゆうめい の ひと', true], ['c', 'ゆうめい い ひと', true]]), answer: 'a', explanation_correct: 'ゆうめい is a na-adjective: ゆうめい な ひと.', explanation_per_distractor: { b: 'の is used between nouns.', c: 'い is for i-adjectives.' }, facet: 'meaning', targets: ['g_na_adjective', 'v_yuumei', 'v_hito'], source_sentence_id: 's_n5u09_k39', difficulty: 2 }),
  Q('q_n5u09_gn06', 'error_correction', { stem: { prompt: 'One word is wrong. What replaces ない so the sentence means "Ms. Tanaka is not free"?', ja: 'たなか さん は ひま ない です' }, choices: choices([['a', 'じゃ ありません', true], ['b', 'くない', true], ['c', 'な', true]]), answer: 'a', explanation_correct: 'ひま is a na-adjective: ひま じゃ ありません.', explanation_per_distractor: { b: 'くない is for i-adjectives.', c: 'な goes before a noun.' }, facet: 'construct', targets: ['g_na_adjective', 'v_hima', 'v_san'], source_sentence_id: 's_n5u09_k28', difficulty: 3 }),
  Q('q_n5u09_gn07', 'mcq', { stem: { prompt: 'きれい ends in い. What kind of adjective is it?' }, choices: choices([['a', 'A na-adjective: きれい な まち'], ['b', 'An i-adjective: きれい まち'], ['c', 'Neither']]), answer: 'a', explanation_correct: 'Some na-adjectives end in い, such as きれい and ゆうめい. Check by asking whether it takes な before a noun.', explanation_per_distractor: { b: 'You say きれい な まち.', c: 'It is a na-adjective.' }, facet: 'meaning', targets: ['g_na_adjective', 'v_kirei'], difficulty: 3 }));
G('deg',
  Q('q_n5u09_gd01', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'この とけい は とても たかい です' }, choices: choices([['a', 'This watch is very expensive.'], ['b', 'This watch is a little expensive.'], ['c', 'This watch is not very expensive.']]), answer: 'a', explanation_correct: 'とても = very.', explanation_per_distractor: { b: 'すこし = a little.', c: 'あまり + negative = not very.' }, facet: 'meaning', targets: ['g_degree_words', 'v_totemo', 'v_takai'], source_sentence_id: 's_n5u09_k29', difficulty: 1 }),
  Q('q_n5u09_gd02', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'この とけい は あまり たかく ない です' }, choices: choices([['a', 'This watch is not very expensive.'], ['b', 'This watch is very expensive.'], ['c', 'This watch is cheap.']]), answer: 'a', explanation_correct: 'あまり + negative = not very.', explanation_per_distractor: { b: 'とても would mean very.', c: 'Not very expensive is not the same as cheap.' }, facet: 'meaning', targets: ['g_degree_words', 'v_amari', 'v_tokei'], source_sentence_id: 's_n5u09_k30', difficulty: 2 }),
  Q('q_n5u09_gd03', 'fill_blank', { stem: { prompt: 'Complete: This soup is a little cold.', ja: 'この スープ は ＿＿ つめたい です' }, choices: choices([['a', 'すこし', true], ['b', 'ぜんぜん', true], ['c', 'あまり', true]]), answer: 'a', explanation_correct: 'すこし = a little (with a positive).', explanation_per_distractor: { b: 'ぜんぜん needs a negative.', c: 'あまり needs a negative.' }, facet: 'construct', targets: ['g_degree_words', 'v_sukoshi', 'v_suupu', 'v_tsumetai'], source_sentence_id: 's_n5u09_k31', difficulty: 2 }),
  Q('q_n5u09_gd04', 'fill_blank', { stem: { prompt: 'Complete: This cake is not sweet at all.', ja: 'この ケーキ は ＿＿ あまく ない です' }, choices: choices([['a', 'ぜんぜん', true], ['b', 'とても', true], ['c', 'すこし', true]]), answer: 'a', explanation_correct: 'ぜんぜん + negative = not at all.', explanation_per_distractor: { b: 'とても means very, with a positive.', c: 'すこし means a little, with a positive.' }, facet: 'construct', targets: ['g_degree_words', 'v_zenzen', 'v_keeki'], source_sentence_id: 's_n5u09_k32', difficulty: 2 }),
  Q('q_n5u09_gd05', 'mcq', { stem: { prompt: 'Which two words must go with a negative ending?' }, choices: choices([['a', 'あまり and ぜんぜん', true], ['b', 'とても and すこし', true], ['c', 'とても and あまり', true]]), answer: 'a', explanation_correct: 'あまり (not very) and ぜんぜん (not at all) go with negatives.', explanation_per_distractor: { b: 'とても and すこし go with positives.', c: 'とても goes with positives.' }, facet: 'meaning', targets: ['g_degree_words', 'v_amari', 'v_zenzen'], difficulty: 2 }),
  Q('q_n5u09_gd06', 'sentence_order', { stem: { prompt: 'Put the words in order: Tokyo is very lively.' }, tiles: ['です', 'とても', 'にぎやか', 'とうきょう', 'は'], answer: ['とうきょう', 'は', 'とても', 'にぎやか', 'です'], explanation_correct: 'Topic は degree word adjective です.', facet: 'construct', targets: ['g_degree_words', 'v_totemo', 'v_nigiyaka', 'v_toukyou'], difficulty: 3 }));
G('ga',
  Q('q_n5u09_gg01', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'この ケーキ は おいしい です が たかい です' }, choices: choices([['a', 'This cake is delicious, but expensive.'], ['b', 'This cake is delicious and cheap.'], ['c', 'This cake is delicious because it is expensive.']]), answer: 'a', explanation_correct: 'が between two clauses means "but".', explanation_per_distractor: { b: 'が joins contrasting ideas.', c: 'が does not mean "because".' }, facet: 'meaning', targets: ['g_ga_but', 'v_keeki', 'v_oishii', 'v_takai'], source_sentence_id: 's_n5u09_k12', difficulty: 2 }),
  Q('q_n5u09_gg02', 'fill_blank', { stem: { prompt: 'Complete: I like cats.', ja: 'わたし は ねこ ＿＿ すき です' }, choices: choices([['a', 'が', true], ['b', 'を', true], ['c', 'に', true]]), answer: 'a', explanation_correct: 'The thing you like takes が: ねこ が すき です.', explanation_per_distractor: { b: 'を is for objects of verbs, not for すき.', c: 'に marks a place or time.' }, facet: 'construct', targets: ['g_ga_but', 'v_neko', 'v_suki'], source_sentence_id: 's_n5u09_k20', difficulty: 2 }),
  Q('q_n5u09_gg03', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'わたし は りょうり が じょうず です' }, choices: choices([['a', 'I am good at cooking.'], ['b', 'I like cooking.'], ['c', 'I am not good at cooking.']]), answer: 'a', explanation_correct: 'N が じょうず = good at N.', explanation_per_distractor: { b: 'すき is "like".', c: 'へた is "bad at".' }, facet: 'meaning', targets: ['g_ga_but', 'v_ryouri', 'v_jouzu'], source_sentence_id: 's_n5u09_k22', difficulty: 2 }),
  Q('q_n5u09_gg04', 'sentence_order', { stem: { prompt: 'Put the words in order: My friend is bad at singing.' }, tiles: ['です', 'うた', 'が', 'へた', 'は', 'ともだち'], answer: ['ともだち', 'は', 'うた', 'が', 'へた', 'です'], explanation_correct: 'Topic は thing が へた です.', facet: 'construct', targets: ['g_ga_but', 'v_uta', 'v_heta'], source_sentence_id: 's_n5u09_k23', difficulty: 3 }),
  Q('q_n5u09_gg05', 'mcq', { stem: { prompt: 'In この みせ は やすい です が おいしく ない です, what does が mean?' }, choices: choices([['a', 'but'], ['b', 'and'], ['c', 'because']]), answer: 'a', explanation_correct: 'が joins two clauses with contrast.', explanation_per_distractor: { b: 'と joins nouns.', c: 'から means because (a later unit).' }, facet: 'meaning', targets: ['g_ga_but', 'v_yasui'], source_sentence_id: 's_n5u09_k13', difficulty: 2 }),
  Q('q_n5u09_gg06', 'error_correction', { stem: { prompt: 'One word is wrong. What replaces を so the sentence means "I dislike beer"?', ja: 'わたし は ビール を きらい です' }, choices: choices([['a', 'が', true], ['b', 'で', true], ['c', 'へ', true]]), answer: 'a', explanation_correct: 'ビール が きらい です: likes and dislikes take が.', explanation_per_distractor: { b: 'で marks a place or means.', c: 'へ marks a destination.' }, facet: 'construct', targets: ['g_ga_but', 'v_biiru', 'v_kirai'], source_sentence_id: 's_n5u09_k21', difficulty: 3 }));
const grammar = [
  GR('g_i_adjective', { title: 'い-adjectives', pattern: 'adjective-い です / adjective-くない です / adjective-い + noun', meaning_en: 'Describes a thing; ends in い.', explanation: ['An い-adjective ends in い: たかい, やすい, おもい. It can end a sentence (with です for politeness), or go straight before a noun: たかい とけい.', 'Negative: drop the final い and add くない: たかくない です (or くありません). The adjective いい (good) uses よ in its endings: よくない.', 'Note that おおきい, ちいさい, あたらしい, ふるい, おいしい (from earlier units) are all い-adjectives.'], structure_notes: 'Adjective-い (です) ; adjective-くない (です) ; adjective-い + noun.', examples: ['s_n5u09_k01', 's_n5u09_k14', 's_n5u09_k15', 's_n5u09_k38'], common_mistakes: ['Adding な before a noun.', 'Using じゃ ありません with an い-adjective.'], contrast_with: ['g_na_adjective'], practice_question_ids: gq.i, register: 'polite', tags: ['adjectives'] }),
  GR('g_na_adjective', { title: 'な-adjectives', pattern: 'adjective です / adjective じゃ ありません / adjective な + noun', meaning_en: 'Describes a thing; needs な before a noun.', explanation: ['A な-adjective works like a noun in the sentence: きれい です, しずか じゃ ありません. Before a noun it takes な: きれい な まち.', 'Common な-adjectives: きれい, しずか, にぎやか, げんき, ゆうめい, べんり, ひま, たいへん, すき, きらい, じょうず, へた.', 'きれい ends in い but is a な-adjective; check with な.'], structure_notes: 'Adjective + です; adjective + じゃ ありません; adjective + な + noun.', examples: ['s_n5u09_k16', 's_n5u09_k27', 's_n5u09_k35', 's_n5u09_k36'], common_mistakes: ['Leaving out な before a noun.', 'Using くない with a な-adjective.'], contrast_with: ['g_i_adjective'], practice_question_ids: gq.na, register: 'polite', tags: ['adjectives'] }),
  GR('g_degree_words', { title: 'とても・あまり・すこし・ぜんぜん', pattern: 'degree word + adjective', meaning_en: 'Very / not very / a little / not at all.', explanation: ['とても (very) and すこし (a little) go with positive adjectives: とても たかい です, すこし つめたい です.', 'あまり (not very) and ぜんぜん (not at all) go with negative adjectives: あまり たかくない です, ぜんぜん あまくない です.', 'どう asks "how is it?" and どんな asks "what kind of?".'], structure_notes: 'Degree word + adjective (negative for あまり and ぜんぜん).', examples: ['s_n5u09_k29', 's_n5u09_k30', 's_n5u09_k31', 's_n5u09_k32'], common_mistakes: ['Using あまり with a positive adjective.'], contrast_with: ['g_i_adjective'], practice_question_ids: gq.deg, register: 'polite', tags: ['adjectives', 'adverbs'] }),
  GR('g_ga_but', { title: 'が: but, and が with likes', pattern: 'clause が clause / thing が すき', meaning_en: 'But; marks what is liked, disliked or done well or badly.', explanation: ['が between two clauses means "but": この ケーキ は おいしい です が たかい です.', 'The things you like, dislike or are good or bad at take が: ねこ が すき, ビール が きらい, りょうり が じょうず, うた が へた.', 'Earlier you met が with あります/います; in each case が marks the thing that is being talked about as the key new information.'], structure_notes: 'Clause が clause. Thing が すき/きらい/じょうず/へた です.', examples: ['s_n5u09_k12', 's_n5u09_k20', 's_n5u09_k22', 's_n5u09_k23'], common_mistakes: ['Using を with すき.', 'Using が for "and".'], contrast_with: ['g_aru_iru'], practice_question_ids: gq.ga, register: 'polite', tags: ['particles'] }),
];

// ---------- kanji ----------
add(K.kd('01', '高', 'expensive / high', ['cheap', 'long'], 'k_takai', ['v_takai'], '高 = high, expensive.'), K.kd('02', '安', 'cheap', ['expensive', 'new'], 'k_yasu', ['v_yasui'], '安 = cheap.'), K.kd('03', '新', 'new', ['old', 'long'], 'k_shin', ['v_atarashii'], '新 = new.'), K.kd('04', '古', 'old (things)', ['new', 'white'], 'k_furu', ['v_furui'], '古 = old.'), K.kd('05', '長', 'long', ['many', 'few'], 'k_naga', ['v_nagai'], '長 = long.'),
  K.kd('06', '多', 'many', ['few', 'long'], 'k_ooi', ['v_ookii'], '多 = many.'), K.kd('07', '少', 'few / little', ['many', 'old'], 'k_sukuna', ['v_sukoshi'], '少 = few.'), K.kd('08', '白', 'white', ['red', 'blue'], 'k_shiro', ['v_shiroi'], '白 = white.'), K.kd('09', '赤', 'red', ['blue', 'white'], 'k_aka', ['v_akai'], '赤 = red.'), K.kd('10', '青', 'blue / green', ['red', 'white'], 'k_ao', ['v_aoi'], '青 = blue.'));
add(K.kk('01', '高い', 'takai', ['yasui', 'nagai'], 'k_takai', 'v_takai', '高い = takai.'), K.kk('02', '安い', 'yasui', ['takai', 'furui'], 'k_yasu', 'v_yasui', '安い = yasui.'), K.kk('03', '新しい', 'atarashii', ['furui', 'nagai'], 'k_shin', 'v_atarashii', '新しい = atarashii.'), K.kk('04', '古い', 'furui', ['atarashii', 'takai'], 'k_furu', 'v_furui', '古い = furui.'), K.kk('05', '長い', 'nagai', ['takai', 'yasui'], 'k_naga', 'v_nagai', '長い = nagai.'),
  K.kk('06', '白い', 'shiroi', ['akai', 'aoi'], 'k_shiro', 'v_shiroi', '白い = shiroi.'), K.kk('07', '赤い', 'akai', ['shiroi', 'aoi'], 'k_aka', 'v_akai', '赤い = akai.'), K.kk('08', '青い', 'aoi', ['akai', 'shiroi'], 'k_ao', 'v_aoi', '青い = aoi.'), K.kk('09', '少し', 'sukoshi', ['takai', 'nagai'], 'k_sukuna', 'v_sukoshi', '少し = sukoshi.'));
add(Q('q_n5u09_kmt01', 'matching', { stem: { prompt: 'Match each kanji with its meaning.' }, pairs: [['高', 'high'], ['安', 'cheap'], ['新', 'new'], ['古', 'old'], ['長', 'long'], ['少', 'few']], answer: ['高', '安', '新', '古', '長', '少'], explanation_correct: 'Adjective kanji.', facet: 'meaning', targets: ['k_takai', 'k_yasu', 'k_shin', 'k_furu', 'k_naga', 'k_sukuna'], difficulty: 2 }),
  Q('q_n5u09_kmt02', 'matching', { stem: { prompt: 'Match each colour kanji with its colour.' }, pairs: [['白', 'white'], ['赤', 'red'], ['青', 'blue']], answer: ['白', '赤', '青'], explanation_correct: 'Colour kanji. 青 covers blue and some greens.', facet: 'meaning', targets: ['k_shiro', 'k_aka', 'k_ao'], difficulty: 1 }),
  Q('q_n5u09_kcf01', 'mcq', { stem: { prompt: 'Which kanji is "new" (not "old")?' }, choices: choices([['a', '新'], ['b', '古'], ['c', '長']]), answer: 'a', explanation_correct: '新 = new; 古 = old.', explanation_per_distractor: { b: '古 is old.', c: '長 is long.' }, facet: 'read', targets: ['k_shin', 'k_furu'], difficulty: 2 }),
  Q('q_n5u09_kcf02', 'mcq', { stem: { prompt: 'Which sentence means "This shop is new"?' }, choices: choices([['a', 'この 店 は 新しい です'], ['b', 'この 店 は 古い です'], ['c', 'この 店 は 安い です']]), answer: 'a', explanation_correct: '新しい = new.', explanation_per_distractor: { b: '古い = old.', c: '安い = cheap.' }, facet: 'read', targets: ['k_shin', 'k_furu', 'k_yasu'], difficulty: 2 }),
  Q('q_n5u09_kcf03', 'mcq', { stem: { prompt: 'Which is the colour of a ripe tomato?' }, choices: choices([['a', '赤'], ['b', '青'], ['c', '白']]), answer: 'a', explanation_correct: '赤 = red.', explanation_per_distractor: { b: '青 is blue.', c: '白 is white.' }, facet: 'read', targets: ['k_aka', 'v_tomato'], difficulty: 1 }));

// ---------- dictation and listening ----------
add(K.dc('01', 'むずかしい', 'v_muzukashii', 'むずかしい = difficult.'), K.dc('02', 'おもしろい', 'v_omoshiroi', 'おもしろい = interesting.'), K.dc('03', 'にぎやか', 'v_nigiyaka', 'にぎやか = lively.'), K.dc('04', 'ぜんぜん', 'v_zenzen', 'ぜんぜん = not at all.'));
add(K.gl('01', 'n5u09_ls1', 'たかい', ['やすい', 'ひくい'], 'v_takai', 'You heard たかい: expensive, tall.'), K.gl('02', 'n5u09_ls1', 'おもい', ['かるい', 'あつい'], 'v_omoi', 'You heard おもい: heavy.'), K.gl('03', 'n5u09_ls1', 'さむい', ['あつい', 'つめたい'], 'v_samui', 'You heard さむい: cold.'), K.gl('04', 'n5u09_ls1', 'ひろい', ['せまい', 'ながい'], 'v_hiroi', 'You heard ひろい: spacious.'),
  K.gl('05', 'n5u09_ls2', 'とても たかい です', ['あまり たかく ない です', 'すこし たかい です'], 'v_totemo', 'You heard とても: very.'), K.gl('06', 'n5u09_ls2', 'あまり おいしく ない です', ['とても おいしい です', 'すこし おいしい です'], 'v_amari', 'You heard あまり ... ない: not very.'), K.gl('07', 'n5u09_ls2', 'しずか な こうえん です', ['にぎやか な こうえん です', 'きれい な こうえん です'], 'v_shizuka', 'You heard しずか: quiet.'), K.gl('08', 'n5u09_ls2', 'おいしい です が たかい です', ['おいしい です が やすい です', 'おいしく ない です が やすい です'], 'v_takai', 'You heard が: but.'));
const listening = [
  LS('n5u09_ls1', { item_type: 'Word recognition (lesson practice)', title: 'Which adjective?', script_turns: ['たかい', 'おもい', 'さむい', 'ひろい'].map((t) => ({ speaker: 'A', text_ja: t })), question_ids: ['q_n5u09_gl01', 'q_n5u09_gl02', 'q_n5u09_gl03', 'q_n5u09_gl04'] }),
  LS('n5u09_ls2', { item_type: 'Verbal expressions (lesson practice)', title: 'How much? What kind?', script_turns: ['とても たかい です', 'あまり おいしく ない です', 'しずか な こうえん です', 'おいしい です が たかい です'].map((t) => ({ speaker: 'A', text_ja: t })), question_ids: ['q_n5u09_gl05', 'q_n5u09_gl06', 'q_n5u09_gl07', 'q_n5u09_gl08'] }),
];

// ---------- dialogues ----------
const dialogues = [
  DG('n5u09_d1', { title: 'How is this town?', setting: 'shibuya', turns: [{ speaker: 'A', sentence_id: 's_n5u09_k33' }, { speaker: 'B', sentence_id: 's_n5u09_k18' }], comprehension_question_ids: ['q_n5u09_dg01'], register: 'polite' }),
  DG('n5u09_d2', { title: 'A good cake?', setting: 'shibuya', turns: [{ speaker: 'A', sentence_id: 's_n5u09_k12' }, { speaker: 'B', sentence_id: 's_n5u09_k30' }], comprehension_question_ids: ['q_n5u09_dg02', 'q_n5u09_dg03'], register: 'polite' }),
  DG('n5u09_d3', { title: 'Shopping for clothes', setting: 'shibuya', turns: [{ speaker: 'A', sentence_id: 's_n5u09_t02' }, { speaker: 'B', sentence_id: 's_n5u09_t07' }], comprehension_question_ids: ['q_n5u09_dg04', 'q_n5u09_dg05'], register: 'polite' }),
  DG('n5u09_d4', { title: 'A quiet place', setting: 'shibuya', turns: [{ speaker: 'A', sentence_id: 's_n5u09_k34' }, { speaker: 'B', sentence_id: 's_n5u09_k07' }, { speaker: 'A', sentence_id: 's_n5u09_k17' }], comprehension_question_ids: ['q_n5u09_dg06'], register: 'polite' }),
];
add(K.dg('01', 'n5u09_d1', 'How does B describe the place?', [['a', 'Lively'], ['b', 'Quiet'], ['c', 'Expensive']], 'a', 'しぶや は にぎやか です.', ['v_nigiyaka']), K.dg('02', 'n5u09_d2', 'What is A saying about the cake?', [['a', 'Delicious but expensive'], ['b', 'Cheap and delicious'], ['c', 'Not delicious']], 'a', 'おいしい です が たかい です.', ['v_oishii', 'v_takai']),
  K.dg('03', 'n5u09_d2', 'What does B say about the watch?', [['a', 'It is not very expensive'], ['b', 'It is very expensive'], ['c', 'It is cheap']], 'a', 'あまり たかく ない です.', ['v_amari']), K.dg('04', 'n5u09_d3', 'What does A say about the clothes?', [['a', 'They are cheap'], ['b', 'They are expensive'], ['c', 'They are old']], 'a', 'この ふく は やすい です.', ['v_fuku', 'v_yasui']),
  K.dg('05', 'n5u09_d3', 'Why are they cheap, according to B?', [['a', 'The shop has a sale'], ['b', 'They are old'], ['c', 'They are small']], 'a', 'この みせ は セール です.', ['v_seeru']), K.dg('06', 'n5u09_d4', 'What does A ask about?', [['a', 'What kind of book it is'], ['b', 'Where the park is'], ['c', 'How much it is']], 'a', 'どんな ほん です か.', ['v_donna']));

// ---------- reading (shop and street signs) ----------
const r1 = ['ふく の セール', 'この ふく は やすい です', 'あの みせ は にんき です', 'とても にぎやか です'];
const r2 = ['この ビル に いい レストラン が あります', 'おいしい です が すこし たかい です', 'きれい な みせ です', 'ひと が おおい'];
const r3 = ['こうさてん は にぎやか です', 'この みち は ひろい です', 'あの 店 は 新しい です', 'あの ビル は 高い です'];
const passages = [
  PS('n5u09_r1', { title: 'Shop window', paragraphs: r1, translation_en: 'Clothes sale / These clothes are cheap. / That shop is popular. / It is very lively.', word_count_chars: countChars(r1), question_ids: ['q_n5u09_rq01', 'q_n5u09_rq02', 'q_n5u09_rq03', 'q_n5u09_rq04'], genre: 'signs' }),
  PS('n5u09_r2', { title: 'A restaurant note', paragraphs: r2.slice(0, 3), translation_en: 'There is a good restaurant in this building. / It is delicious but a little expensive. / It is a pretty shop.', word_count_chars: countChars(r2.slice(0, 3)), question_ids: ['q_n5u09_rq05', 'q_n5u09_rq06', 'q_n5u09_rq07'], genre: 'notes' }),
  PS('n5u09_r3', { title: 'Around the crossing', paragraphs: r3, ruby: { 店: 'みせ', 新: 'あたら', 高: 'たか' }, translation_en: 'The crossing is lively. / This road is wide. / That shop over there is new. / That building over there is tall.', word_count_chars: countChars(r3), question_ids: ['q_n5u09_rq08', 'q_n5u09_rq09', 'q_n5u09_rq10'], genre: 'signs' }),
];
add(K.rq('01', 'n5u09_r1', 'What is on sale?', [['a', 'Clothes'], ['b', 'Bread'], ['c', 'Books']], 'a', 'ふく の セール.', ['v_fuku', 'v_seeru'], 'information_retrieval'), K.rq('02', 'n5u09_r1', 'What does the sign say about the clothes?', [['a', 'They are cheap'], ['b', 'They are expensive'], ['c', 'They are old']], 'a', 'この ふく は やすい です.', ['v_yasui'], 'information_retrieval'), K.rq('03', 'n5u09_r1', 'What is said about that shop?', [['a', 'It is popular'], ['b', 'It is quiet'], ['c', 'It is closed']], 'a', 'あの みせ は にんき です.', ['v_ninki'], 'information_retrieval'), K.rq('04', 'n5u09_r1', 'How is the area?', [['a', 'Very lively'], ['b', 'Very quiet'], ['c', 'Cold']], 'a', 'とても にぎやか です.', ['v_totemo', 'v_nigiyaka'], 'information_retrieval'),
  K.rq('05', 'n5u09_r2', 'Where is the restaurant?', [['a', 'In the building'], ['b', 'At the station'], ['c', 'In the park']], 'a', 'この ビル に いい レストラン が あります.', ['v_biru', 'v_resutoran'], 'information_retrieval'), K.rq('06', 'n5u09_r2', 'What is the problem?', [['a', 'It is a little expensive'], ['b', 'It is not delicious'], ['c', 'It is far']], 'a', 'すこし たかい です.', ['v_sukoshi', 'v_takai'], 'information_retrieval'), K.rq('07', 'n5u09_r2', 'What kind of shop is it?', [['a', 'A pretty one'], ['b', 'A noisy one'], ['c', 'A cheap one']], 'a', 'きれい な みせ.', ['v_kirei'], 'information_retrieval'),
  K.rq('08', 'n5u09_r3', 'What is lively?', [['a', 'The crossing'], ['b', 'The road'], ['c', 'The building']], 'a', 'こうさてん は にぎやか です.', ['v_koosaten', 'v_nigiyaka'], 'information_retrieval'), K.rq('09', 'n5u09_r3', 'What is wide?', [['a', 'The road'], ['b', 'The shop'], ['c', 'The building']], 'a', 'この みち は ひろい です.', ['v_hiroi'], 'information_retrieval'), K.rq('10', 'n5u09_r3', 'What is tall?', [['a', 'That building'], ['b', 'That shop'], ['c', 'This road']], 'a', 'あの ビル は 高い です.', ['k_takai', 'v_biru'], 'information_retrieval'));

// ---------- translate / construct ----------
add(K.tr('01', 's_n5u09_k03', 'This bag is heavy.', ['This bag is light.', 'This bag is new.'], 'おもい = heavy.'), K.tr('02', 's_n5u09_k05', 'It is cold today.', ['It is hot today.', 'It was cold yesterday.'], 'さむい = cold.'), K.tr('03', 's_n5u09_k07', 'This book is interesting.', ['This book is difficult.', 'This book is old.'], 'おもしろい = interesting.'), K.tr('04', 's_n5u09_k08', 'Japanese is difficult.', ['Japanese is easy.', 'Japanese is fun.'], 'むずかしい = difficult.'),
  K.tr('05', 's_n5u09_k10', 'Work is busy.', ['Work is fun.', 'Work is difficult.'], 'いそがしい = busy.'), K.tr('06', 's_n5u09_k17', 'This park is quiet.', ['This park is big.', 'This park is lively.'], 'しずか = quiet.'), K.tr('07', 's_n5u09_k19', 'Ms. Tanaka is well.', ['Ms. Tanaka is busy.', 'Ms. Tanaka is kind.'], 'げんき = healthy, cheerful.'), K.tr('08', 's_n5u09_k24', 'Work is tough.', ['Work is easy.', 'Work is free.'], 'たいへん = hard.'),
  K.tr('09', 's_n5u09_k26', 'I am free today.', ['I am busy today.', 'Today is cold.'], 'ひま = free time.'), K.tr('10', 's_n5u09_k25', 'This map is convenient.', ['This map is old.', 'This map is large.'], 'べんり = convenient.'), K.tr('11', 's_n5u09_k33', 'How is this town?', ['What is this town?', 'Where is this town?'], 'どう = how.'), K.tr('12', 's_n5u09_k34', 'What kind of book is it?', ['Which book is it?', 'Whose book is it?'], 'どんな = what kind of.'));
add(Q('q_n5u09_so01', 'sentence_order', { stem: { prompt: 'Put the words in order: This watch is expensive, but cool. (This cake is delicious but expensive.)' }, tiles: ['が', 'おいしい', 'たかい', 'ケーキ', 'です', 'この', 'は', 'です'], answer: ['この', 'ケーキ', 'は', 'おいしい', 'です', 'が', 'たかい', 'です'], explanation_correct: 'First clause です が second clause です.', facet: 'construct', targets: ['v_keeki', 'v_oishii', 'v_takai'], source_sentence_id: 's_n5u09_k12', difficulty: 3 }),
  Q('q_n5u09_so02', 'sentence_order', { stem: { prompt: 'Put the words in order: I like cats.' }, tiles: ['すき', 'わたし', 'ねこ', 'です', 'が', 'は'], answer: ['わたし', 'は', 'ねこ', 'が', 'すき', 'です'], explanation_correct: 'Topic は thing が すき です.', facet: 'construct', targets: ['v_neko', 'v_suki'], source_sentence_id: 's_n5u09_k20', difficulty: 3 }));

// ---------- lessons ----------
const ids = (arr) => arr.map((x) => x.id);
const qs = (...x) => x.map((n) => `q_n5u09_${n}`);
const vmq = (arr) => arr.map((x) => `q_n5u09_vm_${x.id.slice(2)}`);
const spiralIds = questions.filter((q) => q.id.startsWith('q_n5u09_sr_')).map((q) => q.id);
const lessons = [
  L('n5_u09_l1', { title: 'い-adjectives I', goal: 'Describe things: expensive, cheap, heavy, light, long, short, cold, hot.', introduces: { vocab: ids(vocabL.l1) },
    explain: [{ heading: 'Adjectives ending in い', body: ['い-adjectives end in い: たかい (expensive, tall), やすい (cheap), おもい (heavy), かるい (light), ながい (long), みじかい (short). Learn them in opposite pairs.', 'さむい is cold weather, つめたい is cold to the touch, あつい is hot.'], examples: [{ ja: 'この とけい は たかい です', reading: 'kono tokei wa takai desu', en: 'This watch is expensive.' }, { ja: 'つめたい みず', reading: 'tsumetai mizu', en: 'cold water' }] }],
    practice: { question_ids: qs('av01', 'av02', 'av03', 'av04', 'av05', 'av06', 'av07', 'av08', 'av09', 'av10', 'ty01', 'ty02', 'ty03', 'ty04', 'gl01', 'gl02', 'gl03', 'gl04', 'tr01', 'tr02').concat(vmq(vocabL.l1)) },
    exit_check: { question_ids: qs('av01', 'av03', 'av05', 'av07', 'av08', 'ty01', 'gl01'), pass: 0.7 } }),
  L('n5_u09_l2', { title: 'い-adjectives II', goal: 'Add adjectives about speed, difficulty, feelings and colours.', introduces: { vocab: ids(vocabL.l2) },
    explain: [{ heading: 'More い-adjectives', body: ['はやい (fast, early), おそい (slow, late), むずかしい (difficult), やさしい (easy, kind), おもしろい (interesting), たのしい (fun), いそがしい (busy), しろい (white), くろい (black), いい (good), わるい (bad).'], examples: [{ ja: 'にほんご は むずかしい です', reading: 'nihongo wa muzukashii desu', en: 'Japanese is difficult.' }] }],
    practice: { question_ids: qs('av11', 'av12', 'av13', 'av14', 'av15', 'av16', 'amt01', 'ty05', 'ty06', 'tr03', 'tr04', 'tr05', 'dc01', 'dc02').concat(vmq(vocabL.l2)) },
    exit_check: { question_ids: qs('av11', 'av13', 'av14', 'av15', 'ty05', 'tr04', 'dc01'), pass: 0.7 } }),
  L('n5_u09_l3', { title: 'な-adjectives', goal: 'Learn adjectives that take な before a noun.', introduces: { vocab: ids(vocabL.l3), grammar: ['g_na_adjective'] },
    explain: [{ heading: 'Adjectives with な', body: ['きれい (pretty, clean), しずか (quiet), にぎやか (lively), げんき (cheerful), べんり (convenient), ひま (free), たいへん (tough), すき (liked), きらい (disliked), じょうず (good at), へた (bad at).', 'Before a noun add な: きれい な まち. Negative: しずか じゃ ありません.'], examples: [{ ja: 'しずか な こうえん です', reading: 'shizuka na kouen desu', en: 'It is a quiet park.' }] }],
    practice: { question_ids: qs('amt02', 'gn01', 'gn02', 'gn03', 'gn04', 'gn05', 'ty07', 'ty08', 'tr06', 'tr07', 'tr08', 'tr09', 'tr10', 'dc03').concat(vmq(vocabL.l3)) },
    context: { question_ids: qs('gn06', 'gn07') },
    exit_check: { question_ids: qs('amt02', 'gn01', 'gn02', 'gn03', 'gn05', 'tr06', 'ty07'), pass: 0.7 } }),
  L('n5_u09_l4', { title: 'Very, not very, a little', goal: 'Say how much: とても, あまり, すこし, ぜんぜん.', introduces: { vocab: ids(vocabL.l4), grammar: ['g_degree_words'] },
    explain: [{ heading: 'Degree words', body: ['とても (very) and すこし (a little) go with positive adjectives. あまり (not very) and ぜんぜん (not at all) go with negative adjectives. どう asks "how?" and どんな asks "what kind of?".'], examples: [{ ja: 'この とけい は あまり たかく ない です', reading: 'kono tokei wa amari takakunai desu', en: 'This watch is not very expensive.' }] }],
    practice: { question_ids: qs('gd01', 'gd02', 'gd03', 'gd04', 'gd05', 'gd06', 'ty09', 'ty10', 'tr11', 'tr12', 'dc04').concat(vmq(vocabL.l4)) },
    exit_check: { question_ids: qs('gd01', 'gd02', 'gd03', 'gd04', 'gd05', 'ty09', 'tr11'), pass: 0.7 } }),
  L('n5_u09_l5', { title: 'い-adjective forms and が', goal: 'Make negatives, put adjectives before nouns and say "but".', introduces: { grammar: ['g_i_adjective', 'g_ga_but'] },
    explain: [{ heading: 'い-adjective negatives', body: ['Drop い and add くない: たかい → たかくない です. Before a noun the adjective stays as it is: たかい とけい.'], examples: [{ ja: 'この ラーメン は おいしく ない です', reading: 'kono raamen wa oishikunai desu', en: 'This ramen is not delicious.' }] },
      { heading: 'が: but, and likes', body: ['が between two clauses means "but". The thing you like or dislike takes が: ねこ が すき です.'], examples: [{ ja: 'この ケーキ は おいしい です が たかい です', reading: 'kono keeki wa oishii desu ga takai desu', en: 'This cake is delicious, but expensive.' }] }],
    practice: { question_ids: qs('gi01', 'gi02', 'gi03', 'gi04', 'gi05', 'gg01', 'gg02', 'gg03', 'gg04', 'gg05', 'so01', 'so02') },
    context: { question_ids: qs('gi06', 'gi07', 'gg06') },
    exit_check: { question_ids: qs('gi01', 'gi02', 'gi03', 'gi05', 'gg01', 'gg02', 'gg03'), pass: 0.7 } }),
  L('n5_u09_l6', { title: 'Kanji: 高 安 新 古 長 多 少 白 赤 青', goal: 'Read ten kanji used in adjectives and colours.', introduces: { kanji: ids(kanji) },
    explain: [{ heading: 'Adjective kanji', body: ['Adjective kanji carry the stem; the い stays in kana: 高い (たかい), 安い, 新しい, 古い, 長い. 少し means "a little". Colours: 白い, 赤い, 青い.'], examples: [{ ja: '高い 山', reading: 'takai yama', en: 'a high mountain' }, { ja: '新しい 店', reading: 'atarashii mise', en: 'a new shop' }] }],
    practice: { question_ids: qs('kd01', 'kd02', 'kd03', 'kd04', 'kd05', 'kd06', 'kd07', 'kd08', 'kd09', 'kd10', 'kk01', 'kk02', 'kk03', 'kk04', 'kk05', 'kk06', 'kk07', 'kk08', 'kk09', 'kmt01', 'kmt02', 'kcf01', 'kcf02', 'kcf03') },
    exit_check: { question_ids: qs('kd01', 'kd03', 'kd04', 'kd08', 'kk01', 'kk03', 'kmt01', 'kcf01', 'kcf03'), pass: 0.7 } }),
  L('n5_u09_l7', { title: 'A busy shopping street', goal: 'Describe shops and read shopping signs.', introduces: { vocab: ids(vocabL.l7) },
    explain: [{ heading: 'Street words', body: ['ビル (building), ふく (clothes), ばしょ (place), にんき (popular), セール (sale), こうさてん (crossing).'], examples: [{ ja: 'この みせ は にんき です', reading: 'kono mise wa ninki desu', en: 'This shop is popular.' }] }],
    practice: { question_ids: qs('dg01', 'dg02', 'dg03', 'dg04', 'dg05', 'dg06').concat(vmq(vocabL.l7)) },
    exit_check: { question_ids: qs('dg01', 'dg02', 'dg04', 'dg06'), pass: 0.7 } }),
  L('n5_u09_l8', { title: 'Listen and read', goal: 'Follow descriptions by ear and read shop signs.', introduces: {},
    explain: [{ heading: 'Descriptions', body: ['Listen for the degree word first, then the adjective ending.'], examples: [{ ja: 'とても たかい です', reading: 'totemo takai desu', en: 'It is very expensive.' }] }],
    practice: { question_ids: qs('gl05', 'gl06', 'gl07', 'gl08') },
    context: { question_ids: qs('rq01', 'rq02', 'rq03', 'rq04', 'rq05', 'rq06', 'rq07', 'rq08', 'rq09', 'rq10') },
    exit_check: { question_ids: qs('gl05', 'gl06', 'gl07', 'rq01', 'rq05', 'rq08'), pass: 0.7 } }),
  L('n5_u09_l9', { title: 'Review: units 1 to 9', goal: 'Mix words from the first nine units.', introduces: {},
    explain: [{ heading: 'Review', body: ['Earlier words return to keep them fresh.'], examples: [{ ja: 'きれい な まち です', reading: 'kirei na machi desu', en: 'It is a pretty town.' }] }],
    practice: { question_ids: spiralIds.slice(0, 20) },
    context: { question_ids: spiralIds.slice(20, 44) },
    exit_check: { question_ids: spiralIds.slice(0, 5).concat(spiralIds.slice(44, 48)), pass: 0.7 } }),
];

// ---------- Shibuya quest (QT_READ_SIGN): 10 items, 3+ from earlier units ----------
const quests = [{ id: 'q_shibuya_1', destination_id: 'shibuya', type: 'QT_READ_SIGN', unit_id: 'n5_u09', min_accuracy: 0.8, provenance: 'orig',
  question_ids: ['q_n5u09_rq01', 'q_n5u09_rq02', 'q_n5u09_rq03', 'q_n5u09_rq04', 'q_n5u09_rq05', 'q_n5u09_rq06', 'q_n5u09_rq08', 'q_n5u08_rq01', 'q_n5u07_rq01', 'q_n5u06_rq04'],
  spiral_question_ids: ['q_n5u08_rq01', 'q_n5u07_rq01', 'q_n5u06_rq04'] }];

export default { vocab, kanji, sentences, questions, listening, passages, lessons, dialogues, grammar, quests };
