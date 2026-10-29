// n5_u05 "Katakana II and food words" - hand-written original content.
// Kana scope: katakana voiced and p-sounds, small ッ, the long-vowel mark ー, combined sounds, extended loanword sounds.
// Kanji scope: 七 八 九 十 百 千. Grammar: これ/それ/あれ/どれ and この/その/あの/どの; prices with いくら. Scenario: a convenience store.
import { readFileSync } from 'node:fs';
import { kanaToRomaji, hasKanji } from '../../src/content/romaji.js';
import { unit, choices, countChars, meaningQuestions } from '../../scripts/lib/author-helpers.mjs';
import u01 from './n5_u01.mjs';
import u02 from './n5_u02.mjs';
import u03 from './n5_u03.mjs';
import u04 from './n5_u04.mjs';

const KANA = JSON.parse(readFileSync(new URL('../kana.json', import.meta.url), 'utf8'));
const chOf = (rom) => KANA.find((k) => k.id === `ka_k_${rom}`).char;

const U = unit('n5_u05');
const { vocab: V, sentence: S, question: Q, lesson: L, listening: LS, passage: PS, dialogue: DG, grammar: GR, kanji: KJ } = U;

// ---------- vocabulary ----------
const vocabL = {
  l1: [
    V('banana', 'バナナ', 'x', ['banana'], 'noun (loanword)', ['s_n5u05_01']),
    V('pan_k', 'パン', 'x', ['bread'], 'noun (loanword)', ['s_n5u05_02'], { note: 'The same word as ぱん, written in katakana because it is a loanword.' }),
    V('doa', 'ドア', 'x', ['door'], 'noun (loanword)', ['s_n5u05_03']),
    V('piza', 'ピザ', 'x', ['pizza'], 'noun (loanword)', ['s_n5u05_04']),
    V('sarada', 'サラダ', 'x', ['salad'], 'noun (loanword)', ['s_n5u05_05']),
    V('gasu', 'ガス', 'x', ['gas (for cooking or heating)'], 'noun (loanword)', ['s_n5u05_06']),
    V('basu', 'バス', 'x', ['bus'], 'noun (loanword)', ['s_n5u05_07'], { destination_tags: ['tokyo_station'] }),
    V('pen', 'ペン', 'x', ['pen'], 'noun (loanword)', ['s_n5u05_08']),
    V('terebi', 'テレビ', 'x', ['television'], 'noun (loanword)', ['s_n5u05_09']),
    V('piano', 'ピアノ', 'x', ['piano'], 'noun (loanword)', ['s_n5u05_10']),
    V('gorufu', 'ゴルフ', 'x', ['golf'], 'noun (loanword)', ['s_n5u05_11']),
    V('dansu', 'ダンス', 'x', ['dance (the activity)'], 'noun (loanword)', ['s_n5u05_12']),
  ],
  l2: [
    V('koohii', 'コーヒー', 'x', ['coffee'], 'noun (loanword)', ['s_n5u05_13', 's_n5u05_k05'], { destination_tags: ['konbini'] }),
    V('keeki', 'ケーキ', 'x', ['cake'], 'noun (loanword)', ['s_n5u05_14', 's_n5u05_k07'], { destination_tags: ['konbini'] }),
    V('karee', 'カレー', 'x', ['curry'], 'noun (loanword)', ['s_n5u05_15']),
    V('raamen', 'ラーメン', 'x', ['ramen noodles'], 'noun (loanword)', ['s_n5u05_16'], { destination_tags: ['konbini'] }),
    V('biiru', 'ビール', 'x', ['beer'], 'noun (loanword)', ['s_n5u05_17']),
    V('suupu', 'スープ', 'x', ['soup'], 'noun (loanword)', ['s_n5u05_18']),
    V('takushii', 'タクシー', 'x', ['taxi'], 'noun (loanword)', ['s_n5u05_19'], { destination_tags: ['tokyo_station'] }),
    V('nooto', 'ノート', 'x', ['notebook'], 'noun (loanword)', ['s_n5u05_20']),
    V('sakkaa', 'サッカー', 'x', ['soccer', 'football'], 'noun (loanword)', ['s_n5u05_21']),
    V('suupaa', 'スーパー', 'x', ['supermarket'], 'noun (loanword)', ['s_n5u05_22']),
    V('kappu', 'カップ', 'x', ['cup (a paper or plastic cup)'], 'noun (loanword)', ['s_n5u05_23']),
    V('beddo', 'ベッド', 'x', ['bed'], 'noun (loanword)', ['s_n5u05_24']),
  ],
  l3: [
    V('juusu', 'ジュース', 'x', ['juice', 'soft drink'], 'noun (loanword)', ['s_n5u05_25'], { destination_tags: ['konbini'] }),
    V('chokoreeto', 'チョコレート', 'x', ['chocolate'], 'noun (loanword)', ['s_n5u05_26'], { destination_tags: ['konbini'] }),
    V('shatsu', 'シャツ', 'x', ['shirt'], 'noun (loanword)', ['s_n5u05_27']),
    V('shawaa', 'シャワー', 'x', ['shower'], 'noun (loanword)', ['s_n5u05_28']),
    V('nyuusu', 'ニュース', 'x', ['news'], 'noun (loanword)', ['s_n5u05_29']),
    V('jamu', 'ジャム', 'x', ['jam'], 'noun (loanword)', ['s_n5u05_30']),
    V('kyabetsu', 'キャベツ', 'x', ['cabbage'], 'noun (loanword)', ['s_n5u05_31']),
    V('yooguruto', 'ヨーグルト', 'x', ['yogurt'], 'noun (loanword)', ['s_n5u05_32'], { destination_tags: ['konbini'] }),
    V('chiizu', 'チーズ', 'x', ['cheese'], 'noun (loanword)', ['s_n5u05_33']),
    V('gyooza', 'ギョーザ', 'x', ['gyoza dumplings'], 'noun (loanword)', ['s_n5u05_34']),
  ],
  l4: [
    V('tii', 'ティー', 'x', ['tea (as in "tea bag" or "milk tea")'], 'noun (loanword)', ['s_n5u05_35'], { note: 'おちゃ is the usual word for Japanese tea; ティー appears in loanword compounds.' }),
    V('paatii', 'パーティー', 'x', ['party'], 'noun (loanword)', ['s_n5u05_36']),
    V('fooku', 'フォーク', 'x', ['fork'], 'noun (loanword)', ['s_n5u05_37']),
    V('fairu', 'ファイル', 'x', ['file', 'folder'], 'noun (loanword)', ['s_n5u05_38']),
    V('firumu', 'フィルム', 'x', ['film (for a camera)'], 'noun (loanword)', ['s_n5u05_39']),
    V('chekku', 'チェック', 'x', ['check', 'checking'], 'noun (loanword)', ['s_n5u05_40']),
    V('shea', 'シェア', 'x', ['share (a meal or a ride)'], 'noun (loanword)', ['s_n5u05_41']),
    V('webu', 'ウェブ', 'x', ['the web'], 'noun (loanword)', ['s_n5u05_42']),
    V('disuku', 'ディスク', 'x', ['disc', 'disk'], 'noun (loanword)', ['s_n5u05_43']),
  ],
  l5: [
    V('kore', 'これ', 'これ', ['this (thing near me)'], 'demonstrative', ['s_n5u05_k01', 's_n5u05_k04']),
    V('sore', 'それ', 'それ', ['that (thing near you)'], 'demonstrative', ['s_n5u05_k02', 's_n5u05_k05']),
    V('are', 'あれ', 'あれ', ['that (thing over there)'], 'demonstrative', ['s_n5u05_k03']),
    V('dore', 'どれ', 'どれ', ['which (of three or more)'], 'question word', ['s_n5u05_k06']),
    V('kono', 'この', 'この', ['this (+ noun)'], 'demonstrative', ['s_n5u05_k07']),
    V('sono', 'その', 'その', ['that (+ noun, near you)'], 'demonstrative', ['s_n5u05_k08']),
    V('ano', 'あの', 'あの', ['that (+ noun, over there)'], 'demonstrative', ['s_n5u05_k09']),
    V('dono', 'どの', 'どの', ['which (+ noun)'], 'question word', ['s_n5u05_k10']),
    V('onigiri', 'おにぎり', 'おにぎり', ['rice ball'], 'noun', ['s_n5u05_k11'], { destination_tags: ['konbini'] }),
  ],
  l6: [
    V('num7', '七', 'しち', ['seven (7)'], 'number', ['s_n5u05_n01'], { note: 'The same word as しち, written with a kanji. なな is also used.' }),
    V('num8', '八', 'はち', ['eight (8)'], 'number', ['s_n5u05_n01']),
    V('num9', '九', 'きゅう', ['nine (9)'], 'number', ['s_n5u05_n01'], { note: 'Also read く in a few words.' }),
    V('num10', '十', 'じゅう', ['ten (10)'], 'number', ['s_n5u05_n02']),
    V('num100', '百', 'ひゃく', ['one hundred (100)'], 'number', ['s_n5u05_n02']),
    V('num1000', '千', 'せん', ['one thousand (1,000)'], 'number', ['s_n5u05_n02']),
    V('en', 'えん', 'えん', ['yen (Japanese currency)'], 'counter', ['s_n5u05_p01'], { destination_tags: ['konbini'] }),
    V('ikura', 'いくら', 'いくら', ['how much'], 'question word', ['s_n5u05_k12'], { destination_tags: ['konbini'] }),
    V('sanbyaku', 'さんびゃく', 'さんびゃく', ['three hundred (300)'], 'number', ['s_n5u05_p03'], { note: 'Irregular: さんびゃく, not さんひゃく.' }),
    V('roppyaku', 'ろっぴゃく', 'ろっぴゃく', ['six hundred (600)'], 'number', ['s_n5u05_p04'], { note: 'Irregular: ろっぴゃく.' }),
    V('happyaku', 'はっぴゃく', 'はっぴゃく', ['eight hundred (800)'], 'number', ['s_n5u05_p05'], { note: 'Irregular: はっぴゃく.' }),
    V('sanzen', 'さんぜん', 'さんぜん', ['three thousand (3,000)'], 'number', ['s_n5u05_p06'], { note: 'Irregular: さんぜん, not さんせん.' }),
    V('hassen', 'はっせん', 'はっせん', ['eight thousand (8,000)'], 'number', ['s_n5u05_p07'], { note: 'Irregular: はっせん.' }),
  ],
  l7: [
    V('irasshai', 'いらっしゃいませ', 'いらっしゃいませ', ['welcome (said by shop staff)'], 'expression', ['s_n5u05_s01'], { destination_tags: ['konbini'], register: 'polite' }),
    V('kudasai', 'ください', 'ください', ['please give me'], 'expression', ['s_n5u05_s03'], { destination_tags: ['konbini'], note: 'After a thing: これ ください means "this one, please".' }),
    V('zenbu', 'ぜんぶで', 'ぜんぶで', ['in total', 'altogether'], 'adverb', ['s_n5u05_s05'], { destination_tags: ['konbini'] }),
    V('reji', 'レジ', 'x', ['cash register', 'checkout'], 'noun (loanword)', ['s_n5u05_s06'], { destination_tags: ['konbini'] }),
    V('fukuro', 'ふくろ', 'ふくろ', ['bag (a shop bag)'], 'noun', ['s_n5u05_s07'], { destination_tags: ['konbini'] }),
    V('otsuri', 'おつり', 'おつり', ['change (money given back)'], 'noun', ['s_n5u05_s08'], { destination_tags: ['konbini'] }),
  ],
};
const vocab = Object.values(vocabL).flat();
for (const w of vocab) if (!hasKanji(w.surface)) { w.reading_kana = w.surface; w.romaji = kanaToRomaji(w.surface); }

// ---------- kanji ----------
const kanji = [
  KJ('k_shichi', { char: '七', meanings_en: ['seven'], on_readings: ['しち'], kun_readings: ['なな'], reading_notes: 'しち and なな are both used; なな is clearer on the phone.', stroke_count: 2, example_word_ids: ['v_num7'], confusable_with: ['k_kyuu'], tags: ['numbers'] }),
  KJ('k_hachi', { char: '八', meanings_en: ['eight'], on_readings: ['はち'], kun_readings: ['や'], stroke_count: 2, example_word_ids: ['v_num8'], confusable_with: ['k_roku'], tags: ['numbers'] }),
  KJ('k_kyuu', { char: '九', meanings_en: ['nine'], on_readings: ['きゅう', 'く'], kun_readings: ['ここの'], stroke_count: 2, example_word_ids: ['v_num9'], confusable_with: ['k_shichi'], tags: ['numbers'] }),
  KJ('k_juu', { char: '十', meanings_en: ['ten'], on_readings: ['じゅう'], kun_readings: ['とお'], stroke_count: 2, example_word_ids: ['v_num10'], tags: ['numbers'] }),
  KJ('k_hyaku', { char: '百', meanings_en: ['hundred'], on_readings: ['ひゃく'], kun_readings: [], stroke_count: 6, example_word_ids: ['v_num100'], tags: ['numbers'] }),
  KJ('k_sen', { char: '千', meanings_en: ['thousand'], on_readings: ['せん'], kun_readings: ['ち'], stroke_count: 3, example_word_ids: ['v_num1000'], confusable_with: ['k_juu'], tags: ['numbers'] }),
];

// ---------- phrases and sentences ----------
const ph = (n, text, en, ids, extra = {}) => S(`s_n5u05_${n}`, 'phrase', text, text, en, ids, extra);
const sn = (n, text, en, ids, extra = {}) => S(`s_n5u05_${n}`, 'sentence', text, text, en, ids, extra);
const withKanji = (n, text, reading, en, ids, ruby) => S(`s_n5u05_${n}`, 'phrase', text, reading, en, ids, { ruby, kanji_used: [...text].filter((c) => /[一-龥]/.test(c)) });
const sentences = [
  ph('01', 'バナナ と りんご', 'bananas and apples', ['v_banana', 'v_ringo']), ph('02', 'あたらしい パン', 'fresh bread', ['v_pan_k', 'v_atarashii']), ph('03', 'おおきい ドア', 'a big door', ['v_doa']),
  ph('04', 'おいしい ピザ', 'delicious pizza', ['v_piza']), ph('05', 'サラダ と スープ', 'salad and soup', ['v_sarada', 'v_suupu']), ph('06', 'ガス と みず', 'gas and water', ['v_gasu']),
  ph('07', 'あそこ の バス', 'the bus over there', ['v_basu']), ph('08', 'あたらしい ペン', 'a new pen', ['v_pen']), ph('09', 'ふるい テレビ', 'an old television', ['v_terebi']),
  ph('10', 'おおきい ピアノ', 'a big piano', ['v_piano']), ph('11', 'ゴルフ と テニス', 'golf and tennis', ['v_gorufu', 'v_tenisu']), ph('12', 'ダンス の せんせい', 'a dance teacher', ['v_dansu', 'v_sensei']),
  ph('13', 'おいしい コーヒー', 'delicious coffee', ['v_koohii']), ph('14', 'おいしい ケーキ', 'delicious cake', ['v_keeki']), ph('15', 'おいしい カレー', 'delicious curry', ['v_karee']),
  ph('16', 'ラーメン と ギョーザ', 'ramen and gyoza', ['v_raamen', 'v_gyooza']), ph('17', 'ビール と ワイン', 'beer and wine', ['v_biiru', 'v_wain']), ph('18', 'おいしい スープ', 'delicious soup', ['v_suupu']),
  ph('19', 'タクシー と バス', 'a taxi and a bus', ['v_takushii', 'v_basu']), ph('20', 'あたらしい ノート', 'a new notebook', ['v_nooto']), ph('21', 'サッカー と テニス', 'soccer and tennis', ['v_sakkaa', 'v_tenisu']),
  ph('22', 'おおきい スーパー', 'a big supermarket', ['v_suupaa']), ph('23', 'ちいさい カップ', 'a small cup', ['v_kappu']), ph('24', 'おおきい ベッド', 'a big bed', ['v_beddo']),
  ph('25', 'おいしい ジュース', 'delicious juice', ['v_juusu']), ph('26', 'チョコレート と ケーキ', 'chocolate and cake', ['v_chokoreeto', 'v_keeki']), ph('27', 'あたらしい シャツ', 'a new shirt', ['v_shatsu']),
  ph('28', 'あさ の シャワー', 'a morning shower', ['v_shawaa']), ph('29', 'きょう の ニュース', "today's news", ['v_nyuusu']), ph('30', 'ジャム と パン', 'jam and bread', ['v_jamu', 'v_pan_k']),
  ph('31', 'おおきい キャベツ', 'a big cabbage', ['v_kyabetsu']), ph('32', 'ヨーグルト と ミルク', 'yogurt and milk', ['v_yooguruto', 'v_miruku']), ph('33', 'チーズ と ハム', 'cheese and ham', ['v_chiizu', 'v_hamu']),
  ph('34', 'おいしい ギョーザ', 'delicious gyoza', ['v_gyooza']), ph('35', 'ミルク ティー', 'milk tea', ['v_tii', 'v_miruku']), ph('36', 'おおきい パーティー', 'a big party', ['v_paatii']),
  ph('37', 'ナイフ と フォーク', 'a knife and a fork', ['v_naifu', 'v_fooku']), ph('38', 'あたらしい ファイル', 'a new file', ['v_fairu']), ph('39', 'ふるい フィルム', 'old film', ['v_firumu']),
  ph('40', 'チェック', 'a check', ['v_chekku']), ph('41', 'シェア', 'sharing', ['v_shea']), ph('42', 'ウェブ の ニュース', 'news on the web', ['v_webu', 'v_nyuusu']), ph('43', 'ふるい ディスク', 'an old disc', ['v_disuku']),
  withKanji('n01', '七 八 九', 'しち はち きゅう', 'seven, eight, nine', ['v_num7', 'v_num8', 'v_num9'], { 七: 'しち', 八: 'はち', 九: 'きゅう' }),
  withKanji('n02', '十 百 千', 'じゅう ひゃく せん', 'ten, hundred, thousand', ['v_num10', 'v_num100', 'v_num1000'], { 十: 'じゅう', 百: 'ひゃく', 千: 'せん' }),
  sn('p01', 'ひゃく えん', '100 yen', ['v_hyaku', 'v_en']), sn('p02', 'ごひゃく えん', '500 yen', ['v_en']), sn('p03', 'さんびゃく えん', '300 yen', ['v_sanbyaku', 'v_en']),
  sn('p04', 'ろっぴゃく えん', '600 yen', ['v_roppyaku', 'v_en']), sn('p05', 'はっぴゃく えん', '800 yen', ['v_happyaku', 'v_en']), sn('p06', 'さんぜん えん', '3,000 yen', ['v_sanzen', 'v_en']), sn('p07', 'はっせん えん', '8,000 yen', ['v_hassen', 'v_en']),
  sn('k01', 'これ は ほん です', 'This is a book.', ['v_kore', 'v_hon', 'v_desu']), sn('k02', 'それ は ペン です', 'That is a pen.', ['v_sore', 'v_pen', 'v_desu']), sn('k03', 'あれ は ホテル です', 'That over there is a hotel.', ['v_are', 'v_hoteru', 'v_desu']),
  sn('k04', 'これ は なん です か', 'What is this?', ['v_kore', 'v_nan', 'v_desu']), sn('k05', 'それ は コーヒー です', 'That is coffee.', ['v_sore', 'v_koohii', 'v_desu']), sn('k06', 'ホテル は どれ です か', 'Which one is the hotel?', ['v_dore', 'v_hoteru', 'v_desu']),
  sn('k07', 'この ケーキ は おいしい です', 'This cake is delicious.', ['v_kono', 'v_keeki', 'v_oishii', 'v_desu']), sn('k08', 'その かばん は あたらしい です', 'That bag (near you) is new.', ['v_sono', 'v_kaban', 'v_atarashii', 'v_desu']),
  sn('k09', 'あの ひと は せんせい です', 'That person over there is a teacher.', ['v_ano', 'v_hito', 'v_sensei', 'v_desu']), sn('k10', 'どの ひと です か', 'Which person is it?', ['v_dono', 'v_hito', 'v_desu']),
  sn('k11', 'これ は おにぎり です', 'This is a rice ball.', ['v_kore', 'v_onigiri', 'v_desu']), sn('k12', 'これ は いくら です か', 'How much is this?', ['v_kore', 'v_ikura', 'v_desu']),
  sn('k13', 'おにぎり は ひゃく えん です', 'The rice ball is 100 yen.', ['v_onigiri', 'v_en', 'v_desu']), sn('k14', 'コーヒー は ひゃくごじゅう えん です', 'The coffee is 150 yen.', ['v_koohii', 'v_en', 'v_desu']),
  sn('k15', 'その ジュース は さんびゃく えん です', 'That juice is 300 yen.', ['v_sono', 'v_juusu', 'v_sanbyaku', 'v_en', 'v_desu']),
  sn('s01', 'いらっしゃいませ', 'Welcome!', ['v_irasshai']), sn('s02', 'すみません これ は いくら です か', 'Excuse me, how much is this?', ['v_kore', 'v_ikura', 'v_desu']), sn('s03', 'これ ください', 'This one, please.', ['v_kore', 'v_kudasai']),
  sn('s04', 'はい ひゃく えん です', 'Yes, it is 100 yen.', ['v_en', 'v_desu']), sn('s05', 'ぜんぶで ろっぴゃく えん です', 'That is 600 yen in total.', ['v_zenbu', 'v_roppyaku', 'v_en', 'v_desu']),
  sn('s06', 'レジ は あそこ です', 'The register is over there.', ['v_reji', 'v_desu']), sn('s07', 'ふくろ ください', 'A bag, please.', ['v_fukuro', 'v_kudasai']), sn('s08', 'おつり は ひゃく えん です', 'Your change is 100 yen.', ['v_otsuri', 'v_hyaku', 'v_en', 'v_desu']),
  sn('s09', 'コーヒー ください', 'A coffee, please.', ['v_koohii', 'v_kudasai']), sn('s10', 'ありがとう ございます', 'Thank you.', []), sn('s11', 'それ は ごひゃく えん です', 'That one is 500 yen.', ['v_sore', 'v_en', 'v_desu']),
];
const sentIdx = Object.fromEntries(sentences.map((s) => [s.id, s]));

const questions = [];
const add = (...q) => questions.push(...q);

// ---------- katakana recognition, recall and matching ----------
const kdata = (rom, others, note) => ({ rom, others, note });
const KR = [
  ['ga', ['ka', 'ba'], 'ガ is カ with two dots: "ga".'], ['gi', ['ki', 'ji'], 'ギ is キ with two dots: "gi".'], ['go', ['ko', 'zo'], 'ゴ is コ with two dots: "go".'], ['za', ['sa', 'da'], 'ザ is サ with two dots: "za".'],
  ['ji', ['shi', 'chi'], 'ジ is シ with two dots: "ji".'], ['zu', ['su', 'tsu'], 'ズ is ス with two dots: "zu".'], ['zo', ['so', 'go'], 'ゾ is ソ with two dots: "zo".'], ['da', ['ta', 'ga'], 'ダ is タ with two dots: "da".'],
  ['de', ['te', 'be'], 'デ is テ with two dots: "de".'], ['do', ['to', 'bo'], 'ド is ト with two dots: "do".'], ['ba', ['pa', 'ha'], 'バ is ハ with two dots: "ba".'], ['bi', ['pi', 'hi'], 'ビ is ヒ with two dots: "bi".'],
  ['bo', ['po', 'ho'], 'ボ is ホ with two dots: "bo".'], ['pa', ['ba', 'ha'], 'パ is ハ with a small circle: "pa".'], ['pi', ['bi', 'hi'], 'ピ is ヒ with a small circle: "pi".'], ['pu', ['bu', 'fu'], 'プ is フ with a small circle: "pu".'],
  ['pe', ['be', 'he'], 'ペ is ヘ with a small circle: "pe".'], ['po', ['bo', 'ho'], 'ポ is ホ with a small circle: "po".'],
];
KR.forEach(([rom, others, note], i) => add(Q(`q_n5u05_kr${String(i + 1).padStart(2, '0')}`, 'kana_recog', { stem: { prompt: 'Which sound is this katakana?', ja: chOf(rom) }, choices: choices([['a', rom], ...others.map((o, k) => [`d${k + 1}`, o])]), answer: 'a', explanation_correct: note, explanation_per_distractor: Object.fromEntries(others.map((o, k) => [`d${k + 1}`, `${chOf(rom)} is not "${o}": look for two dots (voiced) or a small circle (p).`])), facet: 'read', targets: [`ka_k_${rom}`], difficulty: 1, tags: ['templated'] })));
const KRY = [['kya', ['kyu', 'kyo']], ['shu', ['sha', 'sho']], ['cho', ['cha', 'chu']], ['nyu', ['nya', 'nyo']], ['hya', ['hyu', 'hyo']], ['myo', ['mya', 'myu']], ['ryu', ['rya', 'ryo']], ['gyo', ['gya', 'gyu']], ['ja', ['ju', 'jo']], ['byu', ['bya', 'byo']], ['pyo', ['pya', 'pyu']], ['jo', ['ja', 'ju']]];
KRY.forEach(([rom, others], i) => add(Q(`q_n5u05_ky${String(i + 1).padStart(2, '0')}`, 'kana_recog', { stem: { prompt: 'Which sound is this combined katakana?', ja: chOf(rom) }, choices: choices([['a', rom], ...others.map((o, k) => [`d${k + 1}`, o])]), answer: 'a', explanation_correct: `${chOf(rom)} is a big katakana plus a small ャ, ュ or ョ: "${rom}". ャ = a, ュ = u, ョ = o.`, explanation_per_distractor: Object.fromEntries(others.map((o, k) => [`d${k + 1}`, `The small kana decides the vowel: that is not "${o}".`])), facet: 'read', targets: [`ka_k_${rom}`], difficulty: 2, tags: ['templated'] })));
const KRX = [['ti', ['di', 'te']], ['fa', ['fi', 'fo']], ['fi', ['fa', 'fe']], ['fo', ['fa', 'fe']], ['che', ['she', 'je']], ['she', ['che', 'je']], ['wi', ['we', 'wo_2']], ['di', ['ti', 'du']]];
const ROM_OF = { ti: 'ti', fa: 'fa', fi: 'fi', fo: 'fo', che: 'che', she: 'she', wi: 'wi', di: 'di', we: 'we', wo_2: 'wo', je: 'je', du: 'du', te: 'te', fe: 'fe' };
KRX.forEach(([rom, others], i) => add(Q(`q_n5u05_ex${String(i + 1).padStart(2, '0')}`, 'kana_recog', { stem: { prompt: 'Which sound is this loanword katakana?', ja: chOf(rom) }, choices: choices([['a', ROM_OF[rom]], ...others.map((o, k) => [`d${k + 1}`, ROM_OF[o]])]), answer: 'a', explanation_correct: `${chOf(rom)} is read "${ROM_OF[rom]}": a katakana plus a small vowel, used for sounds borrowed from other languages.`, explanation_per_distractor: Object.fromEntries(others.map((o, k) => [`d${k + 1}`, `That is the sound of ${chOf(o)}.`])), facet: 'read', targets: [`ka_k_${rom}`], difficulty: 2, tags: ['templated'] })));
const rc = (n, rom) => Q(`q_n5u05_rc${n}`, 'kana_recall', { stem: { prompt: `Write the katakana for "${rom}".` }, answer: chOf(rom), explanation_correct: `"${rom}" is written ${chOf(rom)}.`, facet: 'produce', targets: [`ka_k_${rom}`], difficulty: 2, tags: ['templated'] });
['ga', 'ze', 'do', 'bi', 'pu', 'kya', 'sha', 'cha', 'nyu', 'ryo', 'ja', 'byo'].forEach((r, i) => add(rc(String(i + 1).padStart(2, '0'), r)));
const mt = (n, rows, note) => Q(`q_n5u05_mt${n}`, 'matching', { stem: { prompt: 'Match each katakana with its sound.' }, pairs: rows.map((r) => [chOf(r), r]), answer: rows.map((r) => chOf(r)), explanation_correct: note, facet: 'read', targets: rows.map((r) => `ka_k_${r}`), difficulty: 1 });
add(mt('01', ['ga', 'gi', 'gu', 'ge', 'go', 'za'], 'The g row and ザ: two dots voice the sound.'), mt('02', ['ji', 'zu', 'ze', 'zo', 'da', 'de'], 'Voiced s and t sounds.'), mt('03', ['do', 'ba', 'bi', 'bu', 'be', 'bo'], 'ド and the b row.'),
  mt('04', ['pa', 'pi', 'pu', 'pe', 'po', 'ba'], 'The p row has a small circle.'), mt('05', ['kya', 'kyu', 'kyo', 'sha', 'shu', 'sho'], 'Combined k and sh sounds.'), mt('06', ['cha', 'chu', 'cho', 'nya', 'nyu', 'nyo'], 'Combined ch and ny sounds.'),
  mt('07', ['hya', 'mya', 'rya', 'gya', 'ja', 'bya'], 'ャ across six rows.'), mt('08', ['ti', 'fa', 'fi', 'fe', 'fo', 'che'], 'Extended sounds for loanwords.'));
// the long-vowel mark and the small tsu (authored)
add(Q('q_n5u05_ch01', 'mcq', { stem: { prompt: 'In katakana, how is a long vowel written?', ja: 'コーヒー' }, choices: choices([['a', 'With a long dash ー after the vowel'], ['b', 'By repeating the vowel kana'], ['c', 'With a small ッ']]), answer: 'a', explanation_correct: 'Katakana uses ー to lengthen the previous vowel: コーヒー is "koohii".', explanation_per_distractor: { b: 'Repeating the vowel is how hiragana does it (おばあさん).', c: 'A small ッ is a pause, not a long vowel.' }, facet: 'read', targets: ['ka_k_choon'], difficulty: 1 }),
  Q('q_n5u05_ch02', 'mcq', { stem: { prompt: 'How many beats does ケーキ (keeki) have?', ja: 'ケーキ' }, choices: choices([['a', '3'], ['b', '2'], ['c', '4']]), answer: 'a', explanation_correct: 'ケ・ー・キ = 3 beats; ー takes a beat of its own.', explanation_per_distractor: { b: 'ー counts as a beat.', c: 'There is no fourth beat.' }, facet: 'read', targets: ['ka_k_choon', 'v_keeki'], difficulty: 2 }),
  Q('q_n5u05_ch03', 'mcq', { stem: { prompt: 'How many beats does サッカー (sakkaa) have?', ja: 'サッカー' }, choices: choices([['a', '4'], ['b', '3'], ['c', '5']]), answer: 'a', explanation_correct: 'サ・ッ・カ・ー = 4 beats: the small ッ and ー each take one.', explanation_per_distractor: { b: 'Both ッ and ー are beats.', c: 'There are only four marks to count.' }, facet: 'read', targets: ['ka_k_sokuon', 'ka_k_choon', 'v_sakkaa'], difficulty: 2 }),
  Q('q_n5u05_ch04', 'mcq', { stem: { prompt: 'Which word is read "kappu" (cup)?' }, choices: choices([['a', 'カップ', true], ['b', 'カプ', true], ['c', 'ガップ', true]]), answer: 'a', explanation_correct: 'The small ッ doubles the p: カップ.', explanation_per_distractor: { b: 'カプ has no pause.', c: 'ガ would be "ga".' }, facet: 'read', targets: ['ka_k_sokuon', 'v_kappu'], difficulty: 2 }),
  Q('q_n5u05_ch05', 'mcq', { stem: { prompt: 'Which word is read "suupaa" (supermarket)?' }, choices: choices([['a', 'スーパー', true], ['b', 'スパー', true], ['c', 'スーバー', true]]), answer: 'a', explanation_correct: 'スーパー: ス + ー + パ + ー. Check the circle on パ.', explanation_per_distractor: { b: 'スパー misses the first long vowel.', c: 'バ has two dots (ba), not a circle.' }, facet: 'read', targets: ['ka_k_choon', 'v_suupaa'], difficulty: 2 }),
  Q('q_n5u05_ch06', 'mcq', { stem: { prompt: 'Which word is read "biiru" (beer)?' }, choices: choices([['a', 'ビール', true], ['b', 'ピール', true], ['c', 'ビル', true]]), answer: 'a', explanation_correct: 'ビール has two dots and a long ー. ビル (biru) means "building".', explanation_per_distractor: { b: 'ピ has a circle: "pi".', c: 'ビル has no long vowel and means "building".' }, facet: 'read', targets: ['ka_k_choon', 'v_biiru'], difficulty: 2 }));
// loanword reading (authored)
const rd = (n, word, ch, note, vid) => Q(`q_n5u05_rd${n}`, 'mcq', { stem: { prompt: 'This word is borrowed from another language. What does it mean?', ja: word }, choices: choices(ch), answer: 'a', explanation_correct: note, explanation_per_distractor: Object.fromEntries(ch.slice(1).map(([id, t]) => [id, `${t} is not what ${word} means.`])), facet: 'meaning', targets: [vid], difficulty: 1 });
add(rd('01', 'バナナ', [['a', 'banana'], ['b', 'bandana'], ['c', 'pineapple']], 'バナナ (banana).', 'v_banana'), rd('02', 'テレビ', [['a', 'television'], ['b', 'telephone'], ['c', 'telegram']], 'テレビ (terebi) is short for "television".', 'v_terebi'), rd('03', 'ピアノ', [['a', 'piano'], ['b', 'pianist'], ['c', 'piazza']], 'ピアノ (piano).', 'v_piano'),
  rd('04', 'コーヒー', [['a', 'coffee'], ['b', 'copy'], ['c', 'coat']], 'コーヒー (koohii).', 'v_koohii'), rd('05', 'ラーメン', [['a', 'ramen noodles'], ['b', 'lemon'], ['c', 'lamp']], 'ラーメン (raamen).', 'v_raamen'), rd('06', 'スーパー', [['a', 'supermarket'], ['b', 'super hero'], ['c', 'soup']], 'スーパー (suupaa) is short for "supermarket".', 'v_suupaa'),
  rd('07', 'ジュース', [['a', 'juice'], ['b', 'jazz'], ['c', 'jewel']], 'ジュース (juusu).', 'v_juusu'), rd('08', 'チョコレート', [['a', 'chocolate'], ['b', 'chocolate milk'], ['c', 'choir']], 'チョコレート (chokoreeto).', 'v_chokoreeto'), rd('09', 'シャツ', [['a', 'shirt'], ['b', 'shoes'], ['c', 'shorts']], 'シャツ (shatsu).', 'v_shatsu'),
  rd('10', 'ニュース', [['a', 'news'], ['b', 'new shoes'], ['c', 'noodles']], 'ニュース (nyuusu).', 'v_nyuusu'), rd('11', 'パーティー', [['a', 'party'], ['b', 'partner'], ['c', 'pasta']], 'パーティー (paatii).', 'v_paatii'), rd('12', 'フォーク', [['a', 'fork'], ['b', 'folk music'], ['c', 'fort']], 'フォーク (fooku).', 'v_fooku'));
add(...meaningQuestions(Q, vocab.filter((x) => !/^v_(sanbyaku|roppyaku|happyaku|sanzen|hassen)$/.test(x.id))));
{
  const old = [...u01.vocab, ...u02.vocab.filter((w) => w.pos !== 'expression'), ...u03.vocab.filter((w) => !/^v_num/.test(w.id)), ...u04.vocab.filter((w) => !/^v_(num|ichiji|niji|sanji|yoji|goji|rokuji|shichiji|hachiji|kuji|juuji|juuichiji|juuniji)/.test(w.id))];
  const first = (x) => x.meanings_en[0];
  const pick = old.filter((_, i) => i % 3 === 1).slice(0, 80);
  pick.forEach((w, i) => {
    const cands = old.filter((c) => c.id !== w.id && first(c) !== first(w)).filter((_, k) => (k + i) % 11 === 0).slice(0, 3);
    const ordered = [cands[0], w, cands[1], cands[2]].filter(Boolean);
    const ids4 = ['a', 'b', 'c', 'd'];
    add(Q(`q_n5u05_sr_${w.id.slice(2)}`, 'mcq', { stem: { prompt: `Which word means "${first(w)}"?` }, choices: ordered.map((o, k) => ({ id: ids4[k], text: o.surface, ja: true, concept: o.id })), answer: ids4[ordered.indexOf(w)], explanation_correct: `"${first(w)}" is ${w.surface} (${w.romaji}).`, explanation_per_distractor: Object.fromEntries(ordered.map((o, k) => [ids4[k], `${o.surface} means "${first(o)}".`]).filter((_, k) => ordered[k] !== w)), facet: 'produce', targets: [w.id], difficulty: 1, tags: ['templated', 'spiral'] }));
  });
}

// ---------- numbers and kanji ----------
const nk = (n, ch, rom, others, kid, vid, note) => Q(`q_n5u05_nk${n}`, 'mcq', { stem: { prompt: 'How is this number read?', ja: ch }, choices: choices([['a', rom], ...others.map((o, i) => [`d${i + 1}`, o])]), answer: 'a', explanation_correct: note, explanation_per_distractor: Object.fromEntries(others.map((o, i) => [`d${i + 1}`, 'That is the reading of a different number.'])), facet: 'read', targets: [kid, vid], difficulty: 1 });
add(nk('01', '七', 'shichi / nana', ['hachi', 'kyuu'], 'k_shichi', 'v_num7', '七 is seven.'), nk('02', '八', 'hachi', ['shichi', 'roku'], 'k_hachi', 'v_num8', '八 is eight.'), nk('03', '九', 'kyuu / ku', ['juu', 'hachi'], 'k_kyuu', 'v_num9', '九 is nine.'),
  nk('04', '十', 'juu', ['kyuu', 'sen'], 'k_juu', 'v_num10', '十 is ten: a cross.'), nk('05', '百', 'hyaku', ['sen', 'juu'], 'k_hyaku', 'v_num100', '百 is one hundred.'), nk('06', '千', 'sen', ['hyaku', 'juu'], 'k_sen', 'v_num1000', '千 is one thousand: a stroke over 十.'));
const nm = (n, ch, ans, others, kid, vid) => Q(`q_n5u05_nm${n}`, 'mcq', { stem: { prompt: 'Which number is this kanji?', ja: ch }, choices: choices([['a', ans], ...others.map((o, i) => [`d${i + 1}`, o])]), answer: 'a', explanation_correct: `${ch} = ${ans}.`, explanation_per_distractor: Object.fromEntries(others.map((o, i) => [`d${i + 1}`, `${o} is written with a different kanji.`])), facet: 'meaning', targets: [kid, vid], difficulty: 1 });
add(nm('01', '七', '7', ['8', '9'], 'k_shichi', 'v_num7'), nm('02', '八', '8', ['7', '9'], 'k_hachi', 'v_num8'), nm('03', '九', '9', ['7', '8'], 'k_kyuu', 'v_num9'), nm('04', '十', '10', ['100', '1,000'], 'k_juu', 'v_num10'), nm('05', '百', '100', ['10', '1,000'], 'k_hyaku', 'v_num100'), nm('06', '千', '1,000', ['100', '10'], 'k_sen', 'v_num1000'));
add(Q('q_n5u05_nmt01', 'matching', { stem: { prompt: 'Match each kanji with its number.' }, pairs: [['七', '7'], ['八', '8'], ['九', '9'], ['十', '10'], ['百', '100'], ['千', '1,000']], answer: ['七', '八', '九', '十', '百', '千'], explanation_correct: 'The big numbers are 十 ten, 百 hundred, 千 thousand.', facet: 'meaning', targets: ['k_shichi', 'k_hachi', 'k_kyuu', 'k_juu', 'k_hyaku', 'k_sen'], difficulty: 2 }),
  Q('q_n5u05_nmt02', 'matching', { stem: { prompt: 'Match each price word with the amount.' }, pairs: [['さんびゃく', '300'], ['ろっぴゃく', '600'], ['はっぴゃく', '800'], ['さんぜん', '3,000'], ['はっせん', '8,000'], ['ひゃく', '100']], answer: ['さんびゃく', 'ろっぴゃく', 'はっぴゃく', 'さんぜん', 'はっせん', 'ひゃく'], explanation_correct: '300, 600, 800, 3,000 and 8,000 are the irregular ones.', facet: 'meaning', targets: ['v_sanbyaku', 'v_roppyaku', 'v_happyaku', 'v_sanzen', 'v_hassen', 'v_hyaku'], difficulty: 3 }),
  Q('q_n5u05_pr01', 'mcq', { stem: { prompt: 'How do you say 300?' }, choices: choices([['a', 'さんびゃく', true], ['b', 'さんひゃく', true], ['c', 'さんぴゃく', true]]), answer: 'a', explanation_correct: '300 is さんびゃく (the h becomes b).', explanation_per_distractor: { b: 'さんひゃく is not the correct sound change.', c: 'ぴゃく is used for 600 and 800 in a different pattern.' }, facet: 'meaning', targets: ['v_sanbyaku'], difficulty: 2 }),
  Q('q_n5u05_pr02', 'mcq', { stem: { prompt: 'How do you say 600?' }, choices: choices([['a', 'ろっぴゃく', true], ['b', 'ろくひゃく', true], ['c', 'ろくびゃく', true]]), answer: 'a', explanation_correct: '600 is ろっぴゃく.', explanation_per_distractor: { b: 'ろくひゃく is not used.', c: 'ろくびゃく is not used.' }, facet: 'meaning', targets: ['v_roppyaku'], difficulty: 2 }),
  Q('q_n5u05_pr03', 'mcq', { stem: { prompt: 'How do you say 3,000?' }, choices: choices([['a', 'さんぜん', true], ['b', 'さんせん', true], ['c', 'みっせん', true]]), answer: 'a', explanation_correct: '3,000 is さんぜん (s becomes z).', explanation_per_distractor: { b: 'さんせん is not used.', c: 'みっせん is not used.' }, facet: 'meaning', targets: ['v_sanzen'], difficulty: 2 }),
  Q('q_n5u05_pr04', 'mcq', { stem: { prompt: 'How do you say 8,000?' }, choices: choices([['a', 'はっせん', true], ['b', 'はちせん', true], ['c', 'はっぜん', true]]), answer: 'a', explanation_correct: '8,000 is はっせん.', explanation_per_distractor: { b: 'はちせん is not used.', c: 'はっぜん is not used.' }, facet: 'meaning', targets: ['v_hassen'], difficulty: 2 }),
  Q('q_n5u05_pr05', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'ろっぴゃく えん' }, choices: choices([['a', '600 yen'], ['b', '60 yen'], ['c', '6,000 yen']]), answer: 'a', explanation_correct: 'ろっぴゃく = 600; えん = yen.', explanation_per_distractor: { b: 'ろくじゅう would be 60.', c: 'ろくせん would be 6,000.' }, facet: 'meaning', targets: ['v_roppyaku', 'v_en'], source_sentence_id: 's_n5u05_p04', difficulty: 2 }),
  Q('q_n5u05_pr06', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'さんぜん えん' }, choices: choices([['a', '3,000 yen'], ['b', '300 yen'], ['c', '30 yen']]), answer: 'a', explanation_correct: 'さんぜん = 3,000.', explanation_per_distractor: { b: 'さんびゃく would be 300.', c: 'さんじゅう would be 30.' }, facet: 'meaning', targets: ['v_sanzen', 'v_en'], source_sentence_id: 's_n5u05_p06', difficulty: 2 }));
const nty = (n, en, ans, vid) => Q(`q_n5u05_nty${n}`, 'typing_ja', { stem: { prompt: `Type "${en}" in hiragana (romaji is accepted).` }, answer: ans, explanation_correct: `${en} = ${ans}.`, facet: 'produce', targets: [vid], difficulty: 2 });
add(nty('01', '300', 'さんびゃく', 'v_sanbyaku'), nty('02', '600', 'ろっぴゃく', 'v_roppyaku'), nty('03', '800', 'はっぴゃく', 'v_happyaku'), nty('04', '3,000', 'さんぜん', 'v_sanzen'), nty('05', 'yen', 'えん', 'v_en'), nty('06', 'how much', 'いくら', 'v_ikura'));

// ---------- grammar: kore/sore/are and kono/sono/ano ----------
const gaq = []; const gbq = [];
{
  const g = (list, ...q) => { list.push(...q.map((x) => x.id)); add(...q); };
  g(gaq,
    Q('q_n5u05_ga01', 'mcq', { stem: { prompt: 'You hold a pen and point to it. Which word means "this"?' }, choices: choices([['a', 'これ', true], ['b', 'それ', true], ['c', 'あれ', true]]), answer: 'a', explanation_correct: 'これ = this, the thing near the speaker.', explanation_per_distractor: { b: 'それ is near the listener.', c: 'あれ is far from both.' }, facet: 'meaning', targets: ['g_kore_sore_are', 'v_kore'], difficulty: 1 }),
    Q('q_n5u05_ga02', 'mcq', { stem: { prompt: 'The shop clerk points at the bottle next to YOU and asks about it. What does the clerk say for "that"?' }, choices: choices([['a', 'それ', true], ['b', 'これ', true], ['c', 'あれ', true]]), answer: 'a', explanation_correct: 'それ = that, the thing near the listener.', explanation_per_distractor: { b: 'これ is near the speaker.', c: 'あれ is far from both.' }, facet: 'meaning', targets: ['g_kore_sore_are', 'v_sore'], difficulty: 2 }),
    Q('q_n5u05_ga03', 'fill_blank', { stem: { prompt: 'Complete: That over there is a hotel.', ja: '＿＿ は ホテル です' }, choices: choices([['a', 'あれ', true], ['b', 'これ', true], ['c', 'どれ', true]]), answer: 'a', explanation_correct: 'あれ = that over there, far from both people.', explanation_per_distractor: { b: 'これ would be "this" near me.', c: 'どれ is the question word "which".' }, facet: 'construct', targets: ['g_kore_sore_are', 'v_are', 'v_hoteru'], source_sentence_id: 's_n5u05_k03', difficulty: 2 }),
    Q('q_n5u05_ga04', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'これ は なん です か' }, choices: choices([['a', 'What is this?'], ['b', 'What is that over there?'], ['c', 'Which one is it?']]), answer: 'a', explanation_correct: 'これ = this, なん = what.', explanation_per_distractor: { b: 'That would be あれ.', c: 'Which would be どれ.' }, facet: 'meaning', targets: ['g_kore_sore_are', 'v_kore', 'v_nan'], source_sentence_id: 's_n5u05_k04', difficulty: 2 }),
    Q('q_n5u05_ga05', 'sentence_order', { stem: { prompt: 'Put the words in order: That is coffee.' }, tiles: ['です', 'コーヒー', 'は', 'それ'], answer: ['それ', 'は', 'コーヒー', 'です'], explanation_correct: 'Topic は thing です.', facet: 'construct', targets: ['g_kore_sore_are', 'v_sore', 'v_koohii'], source_sentence_id: 's_n5u05_k05', difficulty: 2 }),
    Q('q_n5u05_ga06', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'ホテル は どれ です か' }, choices: choices([['a', 'Which one is the hotel?'], ['b', 'Where is the hotel?'], ['c', 'Is that a hotel?']]), answer: 'a', explanation_correct: 'どれ asks "which one" among several things.', explanation_per_distractor: { b: 'Where would be a place word (どこ, later).', c: 'There is no か after a statement here; どれ asks which.' }, facet: 'meaning', targets: ['g_kore_sore_are', 'v_dore', 'v_hoteru'], source_sentence_id: 's_n5u05_k06', difficulty: 2 }),
    Q('q_n5u05_ga07', 'mcq', { stem: { prompt: 'Which word asks "which one?" among three or more things?' }, choices: choices([['a', 'どれ', true], ['b', 'だれ', true], ['c', 'なに', true]]), answer: 'a', explanation_correct: 'どれ = which (one).', explanation_per_distractor: { b: 'だれ = who.', c: 'なに = what.' }, facet: 'meaning', targets: ['g_kore_sore_are', 'v_dore', 'v_dare'], difficulty: 1 }));
  g(gbq,
    Q('q_n5u05_gb01', 'fill_blank', { stem: { prompt: 'Complete: This cake is delicious.', ja: '＿＿ ケーキ は おいしい です' }, choices: choices([['a', 'この', true], ['b', 'これ', true], ['c', 'どの', true]]), answer: 'a', explanation_correct: 'この goes directly before a noun: この ケーキ.', explanation_per_distractor: { b: 'これ stands alone; it cannot sit before a noun.', c: 'どの asks "which".' }, facet: 'construct', targets: ['g_kono_sono_ano', 'v_kono', 'v_keeki'], source_sentence_id: 's_n5u05_k07', difficulty: 2 }),
    Q('q_n5u05_gb02', 'mcq', { stem: { prompt: 'Which is correct: "that person over there"?' }, choices: choices([['a', 'あの ひと', true], ['b', 'あれ ひと', true], ['c', 'あの の ひと', true]]), answer: 'a', explanation_correct: 'あの + noun: あの ひと.', explanation_per_distractor: { b: 'あれ cannot be placed before a noun.', c: 'No の is needed between あの and the noun.' }, facet: 'meaning', targets: ['g_kono_sono_ano', 'v_ano', 'v_hito'], difficulty: 2 }),
    Q('q_n5u05_gb03', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'あの ひと は せんせい です' }, choices: choices([['a', 'That person over there is a teacher.'], ['b', 'This person is a teacher.'], ['c', 'Which person is a teacher?']]), answer: 'a', explanation_correct: 'あの = that (over there).', explanation_per_distractor: { b: 'This would be この.', c: 'Which would be どの.' }, facet: 'meaning', targets: ['g_kono_sono_ano', 'v_ano', 'v_hito', 'v_sensei'], source_sentence_id: 's_n5u05_k09', difficulty: 2 }),
    Q('q_n5u05_gb04', 'sentence_order', { stem: { prompt: 'Put the words in order: That bag (near you) is new.' }, tiles: ['あたらしい', 'です', 'かばん', 'は', 'その'], answer: ['その', 'かばん', 'は', 'あたらしい', 'です'], explanation_correct: 'その + noun + は + description + です.', facet: 'construct', targets: ['g_kono_sono_ano', 'v_sono', 'v_kaban', 'v_atarashii'], source_sentence_id: 's_n5u05_k08', difficulty: 3 }),
    Q('q_n5u05_gb05', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'どの ひと です か' }, choices: choices([['a', 'Which person is it?'], ['b', 'Who is that person?'], ['c', 'Where is that person?']]), answer: 'a', explanation_correct: 'どの + noun asks "which ...?".', explanation_per_distractor: { b: 'Who would be だれ.', c: 'Where would be どこ (later).' }, facet: 'meaning', targets: ['g_kono_sono_ano', 'v_dono', 'v_hito'], source_sentence_id: 's_n5u05_k10', difficulty: 2 }),
    Q('q_n5u05_gb06', 'error_correction', { stem: { prompt: 'One word is wrong. Which word replaces これ so the sentence means "This rice ball is delicious"?', ja: 'これ おにぎり は おいしい です' }, choices: choices([['a', 'この', true], ['b', 'あれ', true], ['c', 'どれ', true]]), answer: 'a', explanation_correct: 'Before a noun use この: この おにぎり.', explanation_per_distractor: { b: 'あれ is "that over there" and cannot sit before a noun.', c: 'どれ is a question word.' }, facet: 'construct', targets: ['g_kono_sono_ano', 'v_kono', 'v_onigiri'], difficulty: 3 }),
    Q('q_n5u05_gb07', 'mcq', { stem: { prompt: 'Which pair is correct?' }, choices: choices([['a', 'これ / この'], ['b', 'これ / あの'], ['c', 'それ / この']]), answer: 'a', explanation_correct: 'これ pairs with この, それ with その, あれ with あの, どれ with どの.', explanation_per_distractor: { b: 'あの pairs with あれ.', c: 'この pairs with これ.' }, facet: 'meaning', targets: ['g_kono_sono_ano', 'v_kore', 'v_kono'], difficulty: 2 }));
}
const grammar = [
  GR('g_kore_sore_are', { title: 'これ・それ・あれ・どれ', pattern: 'これ / それ / あれ は ＿＿ です', meaning_en: 'Points to a thing: this (near me), that (near you), that (over there), which.',
    explanation: ['Japanese has three distance words for things: これ (near the speaker), それ (near the listener) and あれ (far from both). どれ asks "which one?" among three or more.', 'They stand alone as the topic of a sentence: これ は ほん です (This is a book). To ask about a thing say これ は なん です か.', 'It is the position of the thing that matters: if you pick up an item, it is これ for you and それ for the shop assistant.'],
    structure_notes: 'これ/それ/あれ は + noun + です. They replace a noun; they cannot be placed before a noun.', examples: ['s_n5u05_k01', 's_n5u05_k02', 's_n5u05_k03', 's_n5u05_k04'], common_mistakes: ['Putting これ before a noun (use この).', 'Using これ for something that is near the listener.'], contrast_with: ['g_kono_sono_ano'], practice_question_ids: gaq, register: 'neutral', tags: ['demonstratives'] }),
  GR('g_kono_sono_ano', { title: 'この・その・あの・どの', pattern: 'この / その / あの + noun', meaning_en: 'This / that / that over there / which + noun.',
    explanation: ['この, その, あの and どの always come directly before a noun: この ケーキ (this cake), あの ひと (that person over there), どの ひと (which person).', 'They follow the same distance pattern as これ・それ・あれ・どれ. They cannot stand alone.', 'No の is needed between them and the noun.'],
    structure_notes: 'この/その/あの/どの + noun.', examples: ['s_n5u05_k07', 's_n5u05_k08', 's_n5u05_k09', 's_n5u05_k10'], common_mistakes: ['Using これ before a noun.', 'Adding の between この and the noun.'], contrast_with: ['g_kore_sore_are'], practice_question_ids: gbq, register: 'neutral', tags: ['demonstratives'] }),
];

// ---------- typing, dictation, listening ----------
const ty = (n, en, ans, vid, alt = null) => Q(`q_n5u05_ty${n}`, 'typing_ja', { stem: { prompt: `Type "${en}" in hiragana (romaji is accepted).` }, answer: ans, accept_alternatives: alt, explanation_correct: `${en} = ${ans}.`, facet: 'produce', targets: [vid], difficulty: 2 });
add(ty('01', 'this (thing near me)', 'これ', 'v_kore'), ty('02', 'that (thing near you)', 'それ', 'v_sore'), ty('03', 'which (one)', 'どれ', 'v_dore'), ty('04', 'rice ball', 'おにぎり', 'v_onigiri'), ty('05', 'in total', 'ぜんぶで', 'v_zenbu'), ty('06', 'change (money back)', 'おつり', 'v_otsuri'));
const dc = (n, word, vid, note) => Q(`q_n5u05_dc${n}`, 'dictation', { stem: { prompt: 'Listen, then type what you hear in hiragana (romaji is accepted).', audio_text: word }, answer: word, explanation_correct: note, facet: 'listen', targets: [vid], difficulty: 3, tags: ['listening_relevant'] });
add(dc('01', 'ひゃく', 'v_hyaku', 'ひゃく = 100.'), dc('02', 'さんびゃく', 'v_sanbyaku', 'さんびゃく = 300.'), dc('03', 'ろっぴゃく', 'v_roppyaku', 'ろっぴゃく = 600.'), dc('04', 'いくら', 'v_ikura', 'いくら = how much.'));
const gl = (n, lid, phrase, others, vid, note, ja = true) => Q(`q_n5u05_gl${n}`, 'listening_comp', { stem: { prompt: 'What did you hear?', audio_text: phrase, context_id: lid }, choices: choices([['a', phrase, ja], ...others.map((o, i) => [`d${i + 1}`, o, ja])]), answer: 'a', explanation_correct: note, explanation_per_distractor: Object.fromEntries(others.map((o, i) => [`d${i + 1}`, `${o} sounds different: listen again for the number.`])), facet: 'listen', targets: [vid], difficulty: 2, tags: ['listening_relevant'] });
add(gl('01', 'n5u05_ls1', 'さんびゃく えん', ['ろっぴゃく えん', 'はっぴゃく えん'], 'v_sanbyaku', 'You heard さんびゃく えん: 300 yen.'), gl('02', 'n5u05_ls1', 'ろっぴゃく えん', ['さんびゃく えん', 'ごひゃく えん'], 'v_roppyaku', 'You heard ろっぴゃく えん: 600 yen.'), gl('03', 'n5u05_ls1', 'はっぴゃく えん', ['ろっぴゃく えん', 'ひゃく えん'], 'v_happyaku', 'You heard はっぴゃく えん: 800 yen.'), gl('04', 'n5u05_ls1', 'さんぜん えん', ['さんびゃく えん', 'はっせん えん'], 'v_sanzen', 'You heard さんぜん えん: 3,000 yen.'),
  gl('05', 'n5u05_ls2', 'これ ください', ['それ ください', 'あれ ください'], 'v_kudasai', 'You heard これ ください: "This one, please."'), gl('06', 'n5u05_ls2', 'コーヒー', ['ジュース', 'ビール'], 'v_koohii', 'You heard コーヒー.'), gl('07', 'n5u05_ls2', 'ふくろ ください', ['おつり ください', 'レジ ください'], 'v_fukuro', 'You heard ふくろ ください: "A bag, please."'), gl('08', 'n5u05_ls2', 'ぜんぶで ろっぴゃく えん です', ['ぜんぶで さんびゃく えん です', 'ぜんぶで はっぴゃく えん です'], 'v_zenbu', 'You heard ぜんぶで ろっぴゃく えん です: "600 yen in total."'));
const listening = [
  LS('n5u05_ls1', { item_type: 'Word recognition (lesson practice)', title: 'How much? Prices by ear', script_turns: ['さんびゃく えん', 'ろっぴゃく えん', 'はっぴゃく えん', 'さんぜん えん'].map((t) => ({ speaker: 'A', text_ja: t })), question_ids: ['q_n5u05_gl01', 'q_n5u05_gl02', 'q_n5u05_gl03', 'q_n5u05_gl04'] }),
  LS('n5u05_ls2', { item_type: 'Verbal expressions (lesson practice)', title: 'At the register', script_turns: ['これ ください', 'コーヒー', 'ふくろ ください', 'ぜんぶで ろっぴゃく えん です'].map((t) => ({ speaker: 'A', text_ja: t })), question_ids: ['q_n5u05_gl05', 'q_n5u05_gl06', 'q_n5u05_gl07', 'q_n5u05_gl08'] }),
];

// ---------- dialogues ----------
const dialogues = [
  DG('n5u05_d1', { title: 'How much is this?', setting: 'konbini', turns: [{ speaker: 'A', sentence_id: 's_n5u05_s02' }, { speaker: 'B', sentence_id: 's_n5u05_s04' }, { speaker: 'A', sentence_id: 's_n5u05_s03' }], comprehension_question_ids: ['q_n5u05_dg01', 'q_n5u05_dg02'], register: 'polite' }),
  DG('n5u05_d2', { title: 'At the register', setting: 'konbini', turns: [{ speaker: 'B', sentence_id: 's_n5u05_s01' }, { speaker: 'A', sentence_id: 's_n5u05_s09' }, { speaker: 'B', sentence_id: 's_n5u05_k14' }, { speaker: 'A', sentence_id: 's_n5u02_g07' }], comprehension_question_ids: ['q_n5u05_dg03', 'q_n5u05_dg04'], register: 'polite' }),
  DG('n5u05_d3', { title: 'Paying', setting: 'konbini', turns: [{ speaker: 'B', sentence_id: 's_n5u05_s05' }, { speaker: 'A', sentence_id: 's_n5u05_s07' }, { speaker: 'B', sentence_id: 's_n5u05_s08' }], comprehension_question_ids: ['q_n5u05_dg05', 'q_n5u05_dg06'], register: 'polite' }),
  DG('n5u05_d4', { title: 'What is that?', setting: 'konbini', turns: [{ speaker: 'A', sentence_id: 's_n5u05_k04' }, { speaker: 'B', sentence_id: 's_n5u05_k11' }, { speaker: 'A', sentence_id: 's_n5u05_k12' }, { speaker: 'B', sentence_id: 's_n5u05_k13' }], comprehension_question_ids: ['q_n5u05_dg07', 'q_n5u05_dg08'], register: 'polite' }),
];
const dg = (n, did, prompt, ch, ans, note, targets) => Q(`q_n5u05_dg${n}`, 'dialogue_complete', { stem: { prompt, context_id: did }, choices: choices(ch), answer: ans, explanation_correct: note, explanation_per_distractor: Object.fromEntries(ch.filter(([id]) => id !== ans).map(([id, t]) => [id, `${t} is not what the dialogue says.`])), facet: 'meaning', targets, difficulty: 2 });
add(dg('01', 'n5u05_d1', 'How much does the clerk say it is?', [['a', '100 yen'], ['b', '500 yen'], ['c', '300 yen']], 'a', 'はい ひゃく えん です.', ['v_hyaku', 'v_en']),
  dg('02', 'n5u05_d1', 'What does the customer decide?', [['a', 'To buy it (これ ください)'], ['b', 'Not to buy it'], ['c', 'To ask for a bag']], 'a', 'これ ください means "this one, please".', ['v_kudasai']),
  dg('03', 'n5u05_d2', 'How much is the coffee?', [['a', '150 yen'], ['b', '100 yen'], ['c', '500 yen']], 'a', 'コーヒー は ひゃくごじゅう えん です.', ['v_koohii', 'v_en']),
  dg('04', 'n5u05_d2', 'What does the customer order?', [['a', 'A coffee'], ['b', 'A cake'], ['c', 'A juice']], 'a', 'コーヒー ください.', ['v_koohii', 'v_kudasai']),
  dg('05', 'n5u05_d3', 'What is the total?', [['a', '600 yen'], ['b', '800 yen'], ['c', '300 yen']], 'a', 'ぜんぶで ろっぴゃく えん です.', ['v_zenbu', 'v_roppyaku']),
  dg('06', 'n5u05_d3', 'What does the customer ask for?', [['a', 'A bag'], ['b', 'Change'], ['c', 'A receipt']], 'a', 'ふくろ ください.', ['v_fukuro', 'v_kudasai']),
  dg('07', 'n5u05_d4', 'What is it?', [['a', 'A rice ball'], ['b', 'A cake'], ['c', 'Coffee']], 'a', 'これ は おにぎり です.', ['v_onigiri', 'v_kore']),
  dg('08', 'n5u05_d4', 'How much is the rice ball?', [['a', '100 yen'], ['b', '300 yen'], ['c', '600 yen']], 'a', 'おにぎり は ひゃく えん です.', ['v_onigiri', 'v_en']));

// ---------- reading ----------
const r1 = ['おにぎり  ひゃく えん', 'コーヒー  ひゃくごじゅう えん', 'ジュース  さんびゃく えん', 'ケーキ  ろっぴゃく えん'];
const r2 = ['レジ は あそこ です', 'ふくろ は ここ です', 'この ケーキ は おいしい です'];
const passages = [
  PS('n5u05_r1', { title: 'Convenience store price board', paragraphs: r1, translation_en: 'Rice ball 100 yen / Coffee 150 yen / Juice 300 yen / Cake 600 yen', word_count_chars: countChars(r1), question_ids: ['q_n5u05_rq01', 'q_n5u05_rq02', 'q_n5u05_rq03'], genre: 'signs' }),
  PS('n5u05_r2', { title: 'Shop notes', paragraphs: r2, translation_en: 'The register is over there. / Bags are here. / This cake is delicious.', word_count_chars: countChars(r2), question_ids: ['q_n5u05_rq04', 'q_n5u05_rq05'], genre: 'signs' }),
];
const rq = (n, pid, prompt, ch, ans, note, tg, type = 'reading_comp') => Q(`q_n5u05_rq${n}`, type, { stem: { prompt, context_id: pid }, choices: choices(ch), answer: ans, explanation_correct: note, explanation_per_distractor: Object.fromEntries(ch.filter(([id]) => id !== ans).map(([id, t]) => [id, `Check the board again: ${t} does not match.`])), facet: 'read', targets: tg, difficulty: 2 });
add(rq('01', 'n5u05_r1', 'How much is the coffee?', [['a', '150 yen'], ['b', '100 yen'], ['c', '300 yen']], 'a', 'コーヒー ひゃくごじゅう えん.', ['v_koohii', 'v_en'], 'information_retrieval'),
  rq('02', 'n5u05_r1', 'Which item costs 600 yen?', [['a', 'Cake'], ['b', 'Juice'], ['c', 'Rice ball']], 'a', 'ケーキ ろっぴゃく えん.', ['v_keeki', 'v_roppyaku'], 'information_retrieval'),
  rq('03', 'n5u05_r1', 'What is the cheapest item?', [['a', 'Rice ball'], ['b', 'Coffee'], ['c', 'Juice']], 'a', 'おにぎり is 100 yen.', ['v_onigiri', 'v_hyaku'], 'information_retrieval'),
  rq('04', 'n5u05_r2', 'Where is the register?', [['a', 'Over there'], ['b', 'Here'], ['c', 'Not stated']], 'a', 'レジ は あそこ です.', ['v_reji']),
  rq('05', 'n5u05_r2', 'Which sentence says the cake is delicious?', [['a', 'この ケーキ は おいしい です', true], ['b', 'ふくろ は ここ です', true], ['c', 'レジ は あそこ です', true]], 'a', 'おいしい = delicious.', ['v_keeki', 'v_oishii']));

// ---------- translate / construct ----------
const tr = (n, sid, correct, wrong, note, extra = []) => { const s = sentIdx[sid]; return Q(`q_n5u05_tr${n}`, 'translate', { stem: { prompt: 'Choose the meaning.', ja: s.text_ja }, choices: choices([['a', correct], ['b', wrong[0]], ['c', wrong[1]]]), answer: 'a', explanation_correct: note, explanation_per_distractor: { b: `That is not what ${s.text_ja} says.`, c: `That is not what ${s.text_ja} says.` }, facet: 'meaning', targets: [...s.vocab_ids, ...extra], source_sentence_id: sid, difficulty: 2 }); };
add(tr('01', 's_n5u05_k12', 'How much is this?', ['What is this?', 'Which one is this?'], 'いくら = how much.'), tr('02', 's_n5u05_s03', 'This one, please.', ['This is a rice ball.', 'How much is this?'], 'ください = please give me.'), tr('03', 's_n5u05_k15', 'That juice is 300 yen.', ['That juice is 600 yen.', 'This juice is 300 yen.'], 'その = that (near you); さんびゃく = 300.'),
  tr('04', 's_n5u05_s05', 'That is 600 yen in total.', ['That is 800 yen in total.', 'The change is 600 yen.'], 'ぜんぶで = in total.'), tr('05', 's_n5u05_s08', 'Your change is 100 yen.', ['The bag is 100 yen.', 'The total is 100 yen.'], 'おつり = change.'), tr('06', 's_n5u05_s06', 'The register is over there.', ['The register is here.', 'The shop is over there.'], 'レジ = register.'));
add(Q('q_n5u05_so01', 'sentence_order', { stem: { prompt: 'Put the words in order: How much is this?' }, tiles: ['か', 'いくら', 'です', 'は', 'これ'], answer: ['これ', 'は', 'いくら', 'です', 'か'], explanation_correct: 'Topic は question word です か.', facet: 'construct', targets: ['v_kore', 'v_ikura', 'g_kore_sore_are'], source_sentence_id: 's_n5u05_k12', difficulty: 3 }),
  Q('q_n5u05_so02', 'sentence_order', { stem: { prompt: 'Put the words in order: The rice ball is 100 yen.' }, tiles: ['えん', 'です', 'ひゃく', 'おにぎり', 'は'], answer: ['おにぎり', 'は', 'ひゃく', 'えん', 'です'], explanation_correct: 'Item は price です.', facet: 'construct', targets: ['v_onigiri', 'v_hyaku', 'v_en'], source_sentence_id: 's_n5u05_k13', difficulty: 3 }),
  Q('q_n5u05_so03', 'sentence_order', { stem: { prompt: 'Put the words in order: A coffee, please.' }, tiles: ['ください', 'コーヒー'], answer: ['コーヒー', 'ください'], explanation_correct: 'Thing + ください.', facet: 'construct', targets: ['v_koohii', 'v_kudasai'], source_sentence_id: 's_n5u05_s09', difficulty: 2 }));

// ---------- lessons ----------
const ids = (arr) => arr.map((x) => x.id);
const qs = (...x) => x.map((n) => `q_n5u05_${n}`);
const vmq = (arr) => arr.filter((x) => !/^v_(sanbyaku|roppyaku|happyaku|sanzen|hassen)$/.test(x.id)).map((x) => `q_n5u05_vm_${x.id.slice(2)}`);
const kk = (rows) => rows.map((r) => `ka_k_${r}`);
const vo = ['ga', 'gi', 'gu', 'ge', 'go', 'za', 'ji', 'zu', 'ze', 'zo', 'da', 'dji', 'dzu', 'de', 'do', 'ba', 'bi', 'bu', 'be', 'bo', 'pa', 'pi', 'pu', 'pe', 'po'];
const sc = ['sokuon', 'choon'];
const yo = ['kya', 'kyu', 'kyo', 'sha', 'shu', 'sho', 'cha', 'chu', 'cho', 'nya', 'nyu', 'nyo', 'hya', 'hyu', 'hyo', 'mya', 'myu', 'myo', 'rya', 'ryu', 'ryo', 'gya', 'gyu', 'gyo', 'ja', 'ju', 'jo', 'bya', 'byu', 'byo', 'pya', 'pyu', 'pyo'];
const ex = ['ti', 'tu', 'di', 'du', 'fa', 'fi', 'fe', 'fo', 'wi', 'we', 'wo_2', 'she', 'je', 'che'];
const spiralIds = questions.filter((q) => q.id.startsWith('q_n5u05_sr_')).map((q) => q.id);
const priceWords = vocabL.l6.filter((x) => /^v_(sanbyaku|roppyaku|happyaku|sanzen|hassen)$/.test(x.id));
const lessons = [
  L('n5_u05_l1', { title: 'Katakana: dots and circles', goal: 'Read voiced and p-sound katakana (ガ ザ ダ バ パ rows) and your first food and object words.', introduces: { kana: kk(vo), vocab: ids(vocabL.l1) },
    explain: [{ heading: 'The same marks as hiragana', body: ['Two small dots (゛) voice a katakana as in hiragana: カ → ガ, サ → ザ, タ → ダ, ハ → バ. A small circle (゜) makes the h row into the p row: ハ → パ.', 'ジ and ヂ sound the same, and ズ and ヅ sound the same. ヂ and ヅ are rare.'], examples: [{ ja: 'バナナ', reading: 'banana', en: 'banana' }, { ja: 'ピザ', reading: 'piza', en: 'pizza' }, { ja: 'テレビ', reading: 'terebi', en: 'television' }] }],
    practice: { question_ids: qs('kr01', 'kr02', 'kr03', 'kr04', 'kr05', 'kr06', 'kr07', 'kr08', 'kr09', 'kr10', 'kr11', 'kr12', 'kr13', 'kr14', 'kr15', 'kr16', 'kr17', 'kr18', 'mt01', 'mt02', 'mt03', 'mt04', 'rc01', 'rc02', 'rc03', 'rc04', 'rc05', 'rd01', 'rd02', 'rd03').concat(vmq(vocabL.l1)), gen: [{ type: 'kana_recog', from: 'kana', ids: kk(vo), n: 6 }, { type: 'kana_listen', from: 'kana', ids: kk(vo), n: 4 }] },
    exit_check: { gen: [{ type: 'kana_recog', from: 'kana', ids: kk(vo), n: 8 }, { type: 'vocab_meaning', from: 'vocab', ids: ids(vocabL.l1), n: 4 }], pass: 0.7 } }),
  L('n5_u05_l2', { title: 'Small ッ and the long dash ー', goal: 'Read the pause of ッ and the long vowel mark ー in loanwords.', introduces: { kana: kk(sc), vocab: ids(vocabL.l2) },
    explain: [{ heading: 'ッ is a pause, ー is a long vowel', body: ['A small ッ before a consonant makes a short pause and doubles the sound: カップ (kappu), サッカー (sakkaa).', 'In katakana a long vowel is written with ー: コーヒー (koohii), ケーキ (keeki). The dash always repeats the vowel before it. Each ー is one beat.'], examples: [{ ja: 'コーヒー', reading: 'koohii', en: 'coffee' }, { ja: 'ケーキ', reading: 'keeki', en: 'cake' }, { ja: 'カップ', reading: 'kappu', en: 'cup' }] }],
    practice: { question_ids: qs('ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'rd04', 'rd05', 'rd06').concat(vmq(vocabL.l2)) },
    exit_check: { question_ids: qs('ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'rd04', 'rd06'), pass: 0.7 } }),
  L('n5_u05_l3', { title: 'Combined katakana: ャ ュ ョ', goal: 'Read combined katakana in food and everyday words.', introduces: { kana: kk(yo), vocab: ids(vocabL.l3) },
    explain: [{ heading: 'A small kana after an イ-column kana', body: ['The same rule as hiragana: キ + ャ = キャ (kya), シ + ュ = シュ (shu), チ + ョ = チョ (cho). The small kana is much smaller than the big one.', 'ジャ ジュ ジョ read "ja, ju, jo".'], examples: [{ ja: 'ジュース', reading: 'juusu', en: 'juice' }, { ja: 'シャツ', reading: 'shatsu', en: 'shirt' }, { ja: 'チョコレート', reading: 'chokoreeto', en: 'chocolate' }] }],
    practice: { question_ids: qs('ky01', 'ky02', 'ky03', 'ky04', 'ky05', 'ky06', 'ky07', 'ky08', 'ky09', 'ky10', 'ky11', 'ky12', 'mt05', 'mt06', 'mt07', 'rc06', 'rc07', 'rc08', 'rc09', 'rc10', 'rc11', 'rc12', 'rd07', 'rd08', 'rd09', 'rd10').concat(vmq(vocabL.l3)), gen: [{ type: 'kana_recog', from: 'kana', ids: kk(yo), n: 6 }, { type: 'kana_recall', from: 'kana', ids: kk(yo), n: 4 }] },
    exit_check: { gen: [{ type: 'kana_recog', from: 'kana', ids: kk(yo), n: 8 }, { type: 'vocab_meaning', from: 'vocab', ids: ids(vocabL.l3), n: 4 }], pass: 0.7 } }),
  L('n5_u05_l4', { title: 'Loanword sounds: ティ ファ チェ', goal: 'Read the extra katakana made for sounds borrowed from other languages.', introduces: { kana: kk(ex), vocab: ids(vocabL.l4) },
    explain: [{ heading: 'A small vowel changes the sound', body: ['Katakana adds small vowels to make sounds Japanese lacks: ティ (ti), ファ (fa), フィ (fi), フォ (fo), チェ (che), シェ (she), ウィ (wi).', 'You will mostly see them in loanwords: ティー (tea), パーティー (party), フォーク (fork).'], examples: [{ ja: 'パーティー', reading: 'paatii', en: 'party' }, { ja: 'フォーク', reading: 'fooku', en: 'fork' }, { ja: 'チェック', reading: 'chekku', en: 'check' }] }],
    practice: { question_ids: qs('ex01', 'ex02', 'ex03', 'ex04', 'ex05', 'ex06', 'ex07', 'ex08', 'mt08', 'rd11', 'rd12').concat(vmq(vocabL.l4)), gen: [{ type: 'kana_recog', from: 'kana', ids: kk(ex), n: 6 }] },
    exit_check: { gen: [{ type: 'kana_recog', from: 'kana', ids: kk(ex), n: 6 }, { type: 'vocab_meaning', from: 'vocab', ids: ids(vocabL.l4), n: 4 }], pass: 0.7 } }),
  L('n5_u05_l5', { title: 'This, that and which', goal: 'Point to things with これ・それ・あれ・どれ and この・その・あの・どの.', introduces: { vocab: ids(vocabL.l5), grammar: ['g_kore_sore_are', 'g_kono_sono_ano'] },
    explain: [{ heading: 'Three distances for things', body: ['これ is near me, それ is near you, あれ is over there. どれ asks "which one?". Use them alone: これ は ほん です.', 'Before a noun use この・その・あの・どの: この ケーキ, あの ひと.'], examples: [{ ja: 'これ は なん です か', reading: 'kore wa nan desu ka', en: 'What is this?' }, { ja: 'この ケーキ は おいしい です', reading: 'kono keeki wa oishii desu', en: 'This cake is delicious.' }] }],
    practice: { question_ids: qs('ga01', 'ga02', 'ga03', 'ga04', 'ga05', 'ga06', 'ga07', 'gb01', 'gb02', 'gb03', 'ty01', 'ty02', 'ty03').concat(vmq(vocabL.l5)) },
    context: { question_ids: qs('gb04', 'gb05', 'gb06', 'gb07', 'ty04') },
    exit_check: { question_ids: qs('ga01', 'ga02', 'ga04', 'ga06', 'gb01', 'gb02', 'gb03', 'gb05'), pass: 0.7 } }),
  L('n5_u05_l6', { title: 'Prices: 七八九十百千 and えん', goal: 'Read bigger numbers and say how much something costs.', introduces: { kanji: ids(kanji), vocab: ids(vocabL.l6) },
    explain: [{ heading: 'Big numbers', body: ['十 is ten (a cross), 百 is hundred and 千 is thousand. Before 百 and 千 the sound changes for some numbers: 300 さんびゃく, 600 ろっぴゃく, 800 はっぴゃく, 3,000 さんぜん, 8,000 はっせん.', 'Prices end in えん (yen): ひゃく えん is 100 yen. To ask the price say これ は いくら です か.'], examples: [{ ja: '十 百 千', reading: 'juu hyaku sen', en: 'ten, hundred, thousand' }, { ja: 'これ は いくら です か', reading: 'kore wa ikura desu ka', en: 'How much is this?' }] }],
    practice: { question_ids: qs('nk01', 'nk02', 'nk03', 'nk04', 'nk05', 'nk06', 'nm01', 'nm02', 'nm03', 'nm04', 'nm05', 'nm06', 'nmt01', 'nmt02', 'pr01', 'pr02', 'pr03', 'pr04', 'pr05', 'pr06', 'nty01', 'nty02', 'nty03', 'nty04', 'nty05', 'nty06').concat(vmq(vocabL.l6)) },
    exit_check: { question_ids: qs('nk01', 'nk04', 'nk05', 'nm02', 'nm06', 'nmt01', 'pr01', 'pr02', 'pr05', 'nty05'), pass: 0.7 } }),
  L('n5_u05_l7', { title: 'At the convenience store', goal: 'Ask a price, ask for something, and understand the register.', introduces: { vocab: ids(vocabL.l7) },
    explain: [{ heading: 'A short shop conversation', body: ['Staff say いらっしゃいませ ("welcome"). Point and say これ ください ("this one, please"). The staff add the total: ぜんぶで ろっぴゃく えん です.', 'You may also hear おつり (change) and ふくろ (a bag).'], examples: [{ ja: 'これ ください', reading: 'kore kudasai', en: 'This one, please.' }, { ja: 'ぜんぶで ろっぴゃく えん です', reading: 'zenbu de roppyaku en desu', en: 'That is 600 yen in total.' }] }],
    practice: { question_ids: qs('tr01', 'tr02', 'tr03', 'tr04', 'so01', 'so02', 'so03', 'ty05', 'ty06', 'dg01', 'dg02', 'dg03').concat(vmq(vocabL.l7)) },
    context: { question_ids: qs('dg04', 'dg05', 'dg06', 'dg07', 'dg08', 'tr05', 'tr06') },
    exit_check: { question_ids: qs('dg01', 'dg03', 'dg05', 'dg07', 'tr01', 'tr02', 'so01'), pass: 0.7 } }),
  L('n5_u05_l8', { title: 'Listen and read', goal: 'Understand prices and requests by ear, and read a price board.', introduces: {},
    explain: [{ heading: 'Prices are said fast', body: ['Listen for the hundred or thousand word first, then the units. Remember the irregular sounds.'], examples: [{ ja: 'ろっぴゃく えん', reading: 'roppyaku en', en: '600 yen' }] }],
    practice: { question_ids: qs('gl01', 'gl02', 'gl03', 'gl04', 'gl05', 'gl06', 'gl07', 'gl08', 'dc01', 'dc02', 'dc03', 'dc04') },
    context: { question_ids: qs('rq01', 'rq02', 'rq03', 'rq04', 'rq05') },
    exit_check: { question_ids: qs('gl01', 'gl03', 'gl05', 'gl08', 'rq01', 'rq02', 'dc03'), pass: 0.7 } }),
  L('n5_u05_l9', { title: 'Review: units 1 to 5', goal: 'Mix words from the first five units.', introduces: {},
    explain: [{ heading: 'Spaced review', body: ['Words you already know keep returning at growing gaps. This lesson mixes older vocabulary with the new katakana words.'], examples: [{ ja: 'これ ください', reading: 'kore kudasai', en: 'This one, please.' }] }],
    practice: { question_ids: spiralIds.slice(0, 20) },
    context: { question_ids: spiralIds.slice(20, 44) },
    exit_check: { question_ids: spiralIds.slice(0, 5).concat(spiralIds.slice(44, 48)), pass: 0.7 } }),
];
void priceWords;

// ---------- Konbini quest (QT_SHOP): 10 items, 3+ from earlier units ----------
const quests = [{ id: 'q_konbini_1', destination_id: 'konbini', type: 'QT_SHOP', unit_id: 'n5_u05', min_accuracy: 0.8, provenance: 'orig',
  question_ids: ['q_n5u05_dg01', 'q_n5u05_dg03', 'q_n5u05_dg05', 'q_n5u05_dg07', 'q_n5u05_ty05', 'q_n5u05_ty06', 'q_n5u05_nty05', 'q_n5u04_dg03', 'q_n5u04_dg05', 'q_n5u03_dg03'],
  spiral_question_ids: ['q_n5u04_dg03', 'q_n5u04_dg05', 'q_n5u03_dg03'] }];

export default { vocab, kanji, sentences, questions, listening, passages, lessons, dialogues, grammar, quests };
void kdata;
