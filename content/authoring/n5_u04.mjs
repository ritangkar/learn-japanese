// n5_u04 "Katakana I, numbers and time" - hand-written original content.
// Kana scope: basic katakana (a, ka, sa, ta, na, ha, ma, ya, ra, wa rows and ン). No katakana with dakuten, small kana or the long-vowel mark (unit 5).
// Kanji scope: 一 二 三 四 五 六 (counting). Grammar: telling the time with じ / ふん and いま なんじ です か.
import { kanaToRomaji, hasKanji } from '../../src/content/romaji.js';
import { unit, choices, countChars, meaningQuestions } from '../../scripts/lib/author-helpers.mjs';
import u01 from './n5_u01.mjs';
import u02 from './n5_u02.mjs';
import u03 from './n5_u03.mjs';

const U = unit('n5_u04');
const { vocab: V, sentence: S, question: Q, lesson: L, listening: LS, passage: PS, dialogue: DG, grammar: GR, kanji: KJ } = U;

// ---------- vocabulary ----------
const vocabL = {
  l1: [
    V('kokoa', 'ココア', 'ここあ', ['cocoa', 'hot chocolate'], 'noun (loanword)', ['s_n5u04_01']),
    V('aisu', 'アイス', 'あいす', ['ice cream', 'ice'], 'noun (loanword)', ['s_n5u04_01']),
  ],
  l2: [
    V('tenisu', 'テニス', 'てにす', ['tennis'], 'noun (loanword)', ['s_n5u04_02']),
    V('naifu', 'ナイフ', 'ないふ', ['knife'], 'noun (loanword)', ['s_n5u04_03']),
    V('hamu', 'ハム', 'はむ', ['ham'], 'noun (loanword)', ['s_n5u04_04']),
    V('tomato', 'トマト', 'とまと', ['tomato'], 'noun (loanword)', ['s_n5u04_04']),
    V('nekutai', 'ネクタイ', 'ねくたい', ['necktie', 'tie'], 'noun (loanword)', ['s_n5u04_05']),
  ],
  l3: [
    V('hoteru', 'ホテル', 'ほてる', ['hotel'], 'noun (loanword)', ['s_n5u04_06', 's_n5u04_t09'], { destination_tags: ['tokyo'] }),
    V('kamera', 'カメラ', 'かめら', ['camera'], 'noun (loanword)', ['s_n5u04_07']),
    V('miruku', 'ミルク', 'みるく', ['milk (in drinks)'], 'noun (loanword)', ['s_n5u04_08']),
    V('meron', 'メロン', 'めろん', ['melon'], 'noun (loanword)', ['s_n5u04_08']),
    V('taoru', 'タオル', 'たおる', ['towel'], 'noun (loanword)', ['s_n5u04_09']),
    V('masuku', 'マスク', 'ますく', ['face mask'], 'noun (loanword)', ['s_n5u04_10']),
    V('resutoran', 'レストラン', 'れすとらん', ['restaurant'], 'noun (loanword)', ['s_n5u04_11', 's_n5u04_t10']),
    V('amerika', 'アメリカ', 'あめりか', ['the United States', 'America'], 'noun (proper)', ['s_n5u04_12']),
    V('roshia', 'ロシア', 'ろしあ', ['Russia'], 'noun (proper)', ['s_n5u04_12']),
    V('sumaho', 'スマホ', 'すまほ', ['smartphone'], 'noun (loanword)', ['s_n5u04_13']),
    V('itaria', 'イタリア', 'いたりあ', ['Italy'], 'noun (proper)', ['s_n5u04_14']),
    V('furansu', 'フランス', 'ふらんす', ['France'], 'noun (proper)', ['s_n5u04_14']),
    V('remon', 'レモン', 'れもん', ['lemon'], 'noun (loanword)', ['s_n5u04_15']),
    V('wain', 'ワイン', 'わいん', ['wine'], 'noun (loanword)', ['s_n5u04_15']),
    V('anime', 'アニメ', 'あにめ', ['anime', 'animation'], 'noun (loanword)', ['s_n5u04_16']),
  ],
  l4: [
    V('num1', '一', 'いち', ['one (1)'], 'number', ['s_n5u04_n01'], { note: 'The same word as いち, written with a kanji.' }),
    V('num2', '二', 'に', ['two (2)'], 'number', ['s_n5u04_n01']),
    V('num3', '三', 'さん', ['three (3)'], 'number', ['s_n5u04_n01']),
    V('num4', '四', 'よん', ['four (4)'], 'number', ['s_n5u04_n02'], { note: 'Also read し (shi) in a few words. よん is the usual spoken reading.' }),
    V('num5', '五', 'ご', ['five (5)'], 'number', ['s_n5u04_n02']),
    V('num6', '六', 'ろく', ['six (6)'], 'number', ['s_n5u04_n02']),
    V('nana', 'なな', 'なな', ['seven (7)'], 'number', ['s_n5u04_n03'], { note: 'The same number as しち. Both are used; なな is clearer on the phone.' }),
    V('hachi', 'はち', 'はち', ['eight (8)'], 'number', ['s_n5u04_n03']),
    V('kyuu', 'きゅう', 'きゅう', ['nine (9)'], 'number', ['s_n5u04_n03'], { note: 'Also read く (ku) in a few words such as くじ (9 o\'clock).' }),
    V('juu', 'じゅう', 'じゅう', ['ten (10)'], 'number', ['s_n5u04_n04']),
    V('rei', 'れい', 'れい', ['zero (0)'], 'number', ['s_n5u04_n04']),
    V('sen', 'せん', 'せん', ['one thousand (1,000)'], 'number', ['s_n5u04_n05']),
    V('man', 'まん', 'まん', ['ten thousand (10,000)'], 'number', ['s_n5u04_n05'], { note: 'Japanese counts in units of ten thousand: 100,000 is じゅうまん ("ten ten-thousands").' }),
  ],
  l5: [
    V('ima', 'いま', 'いま', ['now'], 'noun (time)', ['s_n5u04_t01', 's_n5u04_t02']),
    V('nanji', 'なんじ', 'なんじ', ['what time'], 'question word', ['s_n5u04_t01']),
    V('ichiji', 'いちじ', 'いちじ', ["1 o'clock"], 'time', ['s_n5u04_t11']),
    V('niji', 'にじ', 'にじ', ["2 o'clock"], 'time', ['s_n5u04_t11']),
    V('sanji', 'さんじ', 'さんじ', ["3 o'clock"], 'time', ['s_n5u04_t02', 's_n5u04_t06']),
    V('yoji', 'よじ', 'よじ', ["4 o'clock"], 'time', ['s_n5u04_t11'], { note: 'Irregular: よじ, not よんじ.' }),
    V('goji', 'ごじ', 'ごじ', ["5 o'clock"], 'time', ['s_n5u04_t11']),
    V('rokuji', 'ろくじ', 'ろくじ', ["6 o'clock"], 'time', ['s_n5u04_t03']),
    V('shichiji', 'しちじ', 'しちじ', ["7 o'clock"], 'time', ['s_n5u04_t04'], { note: 'Irregular: しちじ, not ななじ.' }),
    V('hachiji', 'はちじ', 'はちじ', ["8 o'clock"], 'time', ['s_n5u04_t07']),
    V('kuji', 'くじ', 'くじ', ["9 o'clock"], 'time', ['s_n5u04_t11'], { note: 'Irregular: くじ, not きゅうじ.' }),
    V('juuji', 'じゅうじ', 'じゅうじ', ["10 o'clock"], 'time', ['s_n5u04_t05']),
    V('juuichiji', 'じゅういちじ', 'じゅういちじ', ["11 o'clock"], 'time', ['s_n5u04_t11']),
    V('juuniji', 'じゅうにじ', 'じゅうにじ', ["12 o'clock"], 'time', ['s_n5u04_t08']),
    V('gozen', 'ごぜん', 'ごぜん', ['a.m.', 'morning (before noon)'], 'noun (time)', ['s_n5u04_t04', 's_n5u04_t05']),
    V('gogo', 'ごご', 'ごご', ['p.m.', 'afternoon'], 'noun (time)', ['s_n5u04_t03']),
    V('han', 'はん', 'はん', ['half past'], 'noun (time)', ['s_n5u04_t03']),
    V('gofun', 'ごふん', 'ごふん', ['five minutes'], 'time', ['s_n5u04_t06']),
    V('densha', 'でんしゃ', 'でんしゃ', ['train', 'electric train'], 'noun', ['s_n5u04_s02', 's_n5u04_t04'], { destination_tags: ['tokyo_station'] }),
    V('juppun', 'じゅっぷん', 'じゅっぷん', ['ten minutes'], 'time', ['s_n5u04_t07'], { note: 'Irregular: じゅっぷん (small っ and ぷ).' }),
  ],
  l6: [
    V('kippu', 'きっぷ', 'きっぷ', ['ticket'], 'noun', ['s_n5u04_s03'], { destination_tags: ['tokyo_station'] }),
    V('bansen', 'ばんせん', 'ばんせん', ['platform number', 'track number'], 'counter', ['s_n5u04_s04'], { destination_tags: ['tokyo_station'], note: 'ばんせん follows a number: さんばんせん is "platform 3". なんばんせん asks "which platform?".' }),
  ],
};
const vocab = Object.values(vocabL).flat();
for (const w of vocab) if (!hasKanji(w.surface)) { w.reading_kana = w.surface; w.romaji = kanaToRomaji(w.surface); }

// ---------- kanji ----------
const kanji = [
  KJ('k_ichi', { char: '一', meanings_en: ['one'], on_readings: ['いち'], kun_readings: ['ひと'], reading_notes: 'いち counts numbers; ひとつ counts objects.', stroke_count: 1, example_word_ids: ['v_num1'], confusable_with: ['k_ni'], tags: ['numbers'] }),
  KJ('k_ni', { char: '二', meanings_en: ['two'], on_readings: ['に'], kun_readings: ['ふた'], stroke_count: 2, example_word_ids: ['v_num2'], confusable_with: ['k_ichi', 'k_san'], tags: ['numbers'] }),
  KJ('k_san', { char: '三', meanings_en: ['three'], on_readings: ['さん'], kun_readings: ['みっ'], stroke_count: 3, example_word_ids: ['v_num3'], confusable_with: ['k_ni'], tags: ['numbers'] }),
  KJ('k_shi', { char: '四', meanings_en: ['four'], on_readings: ['し'], kun_readings: ['よん', 'よっ'], reading_notes: 'よん is the usual spoken reading of the number; し appears inside a few words.', stroke_count: 5, example_word_ids: ['v_num4'], confusable_with: ['k_go'], tags: ['numbers'] }),
  KJ('k_go', { char: '五', meanings_en: ['five'], on_readings: ['ご'], kun_readings: ['いつ'], stroke_count: 4, example_word_ids: ['v_num5'], confusable_with: ['k_shi'], tags: ['numbers'] }),
  KJ('k_roku', { char: '六', meanings_en: ['six'], on_readings: ['ろく'], kun_readings: ['むっ'], stroke_count: 4, example_word_ids: ['v_num6'], tags: ['numbers'] }),
];

// ---------- phrases and sentences ----------
const ph = (n, text, en, ids, extra = {}) => S(`s_n5u04_${n}`, 'phrase', text, text.replace(/\s/g, ' '), en, ids, extra);
const sn = (n, text, en, ids, extra = {}) => S(`s_n5u04_${n}`, 'sentence', text, text, en, ids, extra);
const kana = (n, text, reading, en, ids, ruby) => S(`s_n5u04_${n}`, 'phrase', text, reading, en, ids, { ruby, kanji_used: [...text].filter((c) => /[一-龥]/.test(c)) });
const sentences = [
  ph('01', 'ココア と アイス', 'cocoa and ice cream', ['v_kokoa', 'v_aisu']),
  ph('02', 'テニス の ほん', 'a tennis book', ['v_tenisu']),
  ph('03', 'ふるい ナイフ', 'an old knife', ['v_naifu']),
  ph('04', 'ハム と トマト', 'ham and tomatoes', ['v_hamu', 'v_tomato']),
  ph('05', 'あたらしい ネクタイ', 'a new necktie', ['v_nekutai']),
  ph('06', 'おおきい ホテル', 'a big hotel', ['v_hoteru']),
  ph('07', 'ふるい カメラ', 'an old camera', ['v_kamera']),
  ph('08', 'ミルク と メロン', 'milk and melon', ['v_miruku', 'v_meron']),
  ph('09', 'あたらしい タオル', 'a new towel', ['v_taoru']),
  ph('10', 'ちいさい マスク', 'a small mask', ['v_masuku']),
  ph('11', 'おいしい レストラン', 'a delicious restaurant', ['v_resutoran']),
  ph('12', 'アメリカ と ロシア', 'America and Russia', ['v_amerika', 'v_roshia']),
  ph('13', 'わたし の スマホ', 'my smartphone', ['v_sumaho']),
  ph('14', 'イタリア と フランス', 'Italy and France', ['v_itaria', 'v_furansu']),
  ph('15', 'レモン と ワイン', 'lemon and wine', ['v_remon', 'v_wain']),
  ph('16', 'ふるい アニメ', 'an old anime', ['v_anime']),
  kana('n01', '一 二 三', 'いち に さん', 'one, two, three', ['v_num1', 'v_num2', 'v_num3'], { 一: 'いち', 二: 'に', 三: 'さん' }),
  kana('n02', '四 五 六', 'よん ご ろく', 'four, five, six', ['v_num4', 'v_num5', 'v_num6'], { 四: 'よん', 五: 'ご', 六: 'ろく' }),
  ph('n03', 'なな と はち と きゅう', 'seven, eight and nine', ['v_nana', 'v_hachi', 'v_kyuu']),
  ph('n04', 'じゅう と れい', 'ten and zero', ['v_juu', 'v_rei']),
  ph('n05', 'せん と まん', 'one thousand and ten thousand', ['v_sen', 'v_man']),
  sn('t01', 'いま なんじ です か', 'What time is it now?', ['v_ima', 'v_nanji', 'v_desu']),
  sn('t02', 'いま さんじ です', "It is 3 o'clock now.", ['v_ima', 'v_sanji', 'v_desu']),
  sn('t03', 'いま ごご ろくじ はん です', 'It is 6:30 p.m. now.', ['v_ima', 'v_gogo', 'v_rokuji', 'v_han', 'v_desu']),
  sn('t04', 'でんしゃ は ごぜん しちじ です', 'The train is at 7 a.m.', ['v_densha', 'v_gozen', 'v_shichiji', 'v_desu']),
  sn('t05', 'いま ごぜん じゅうじ です', 'It is 10 a.m. now.', ['v_ima', 'v_gozen', 'v_juuji', 'v_desu']),
  sn('t06', 'いま さんじ ごふん です', 'It is 3:05 now.', ['v_ima', 'v_sanji', 'v_gofun', 'v_desu']),
  sn('t07', 'いま はちじ じゅっぷん です', 'It is 8:10 now.', ['v_ima', 'v_hachiji', 'v_juppun', 'v_desu']),
  sn('t08', 'いま じゅうにじ です', 'It is 12 o\'clock now.', ['v_ima', 'v_juuniji', 'v_desu']),
  sn('t09', 'ホテル は あそこ です', 'The hotel is over there.', ['v_hoteru', 'v_desu']),
  sn('t10', 'レストラン は ここ です', 'The restaurant is here.', ['v_resutoran', 'v_desu']),
  ph('t11', 'いちじ にじ よじ ごじ くじ じゅういちじ', '1, 2, 4, 5, 9 and 11 o\'clock', ['v_ichiji', 'v_niji', 'v_yoji', 'v_goji', 'v_kuji', 'v_juuichiji']),
  ph('s01', 'えき', 'station', ['v_eki']),
  sn('s02', 'でんしゃ は ここ です', 'The train is here.', ['v_densha', 'v_desu']),
  sn('s03', 'きっぷ は ここ です か', 'Is the ticket here?', ['v_kippu', 'v_desu']),
  ph('s04', 'さんばんせん', 'platform 3', ['v_bansen', 'v_num3']),
  sn('s05', 'すみません でんしゃ は なんばんせん です か', 'Excuse me, which platform is the train?', ['v_densha', 'v_bansen', 'v_desu']),
  sn('s06', 'さんばんせん です', 'It is platform 3.', ['v_bansen', 'v_desu']),
  sn('s07', 'すみません いま なんじ です か', 'Excuse me, what time is it now?', ['v_ima', 'v_nanji', 'v_desu']),
  sn('s08', 'いま ごご さんじ です', 'It is 3 p.m. now.', ['v_ima', 'v_gogo', 'v_sanji', 'v_desu']),
  sn('s09', 'でんしゃ は なんじ です か', 'What time is the train?', ['v_densha', 'v_nanji', 'v_desu']),
  sn('s10', 'ごぜん くじ はん です', 'It is 9:30 a.m.', ['v_gozen', 'v_kuji', 'v_han', 'v_desu']),
  sn('s11', 'はい ここ です', 'Yes, it is here.', ['v_desu']),
  sn('s12', 'でんしゃ は ごご ろくじ です', 'The train is at 6 p.m.', ['v_densha', 'v_gogo', 'v_rokuji', 'v_desu']),
];
const sent = (id) => sentences.find((s) => s.id === id);
void sent;

const questions = [];
const add = (...q) => questions.push(...q);

// ---------- katakana ----------
const KATA = {
  a: 'ア', i: 'イ', u: 'ウ', e: 'エ', o: 'オ', ka: 'カ', ki: 'キ', ku: 'ク', ke: 'ケ', ko: 'コ', sa: 'サ', shi: 'シ', su: 'ス', se: 'セ', so: 'ソ',
  ta: 'タ', chi: 'チ', tsu: 'ツ', te: 'テ', to: 'ト', na: 'ナ', ni: 'ニ', nu: 'ヌ', ne: 'ネ', no: 'ノ', ha: 'ハ', hi: 'ヒ', fu: 'フ', he: 'ヘ', ho: 'ホ',
  ma: 'マ', mi: 'ミ', mu: 'ム', me: 'メ', mo: 'モ', ya: 'ヤ', yu: 'ユ', yo: 'ヨ', ra: 'ラ', ri: 'リ', ru: 'ル', re: 'レ', ro: 'ロ', wa: 'ワ', wo: 'ヲ', n: 'ン',
};
const kr = (n, rom, others, note) => Q(`q_n5u04_kr${n}`, 'kana_recog', { stem: { prompt: 'Which sound is this katakana?', ja: KATA[rom] }, choices: choices([['a', rom], ...others.map((o, i) => [`d${i + 1}`, o])]), answer: 'a', explanation_correct: note, explanation_per_distractor: Object.fromEntries(others.map((o, i) => [`d${i + 1}`, `${KATA[rom]} is not "${o}".`])), facet: 'read', targets: [`ka_k_${rom}`], difficulty: 1 });
add(kr('01', 'ka', ['ku', 'ke'], 'カ is "ka". Its hiragana cousin is か.'), kr('02', 'ki', ['ke', 'ku'], 'キ is "ki": three strokes, like a key (ki).'), kr('03', 'ku', ['ke', 'ka'], 'ク is "ku": it opens like a beak.'), kr('04', 'ko', ['ka', 'ku'], 'コ is "ko": two strokes forming a corner.'),
  kr('05', 'shi', ['tsu', 'so'], 'シ is "shi". Compare ツ (tsu): in シ the two short strokes lie almost flat; in ツ they stand almost upright.'), kr('06', 'tsu', ['shi', 'so'], 'ツ is "tsu": its short strokes stand almost upright.'),
  kr('07', 'so', ['n', 'shi'], 'ソ is "so". Compare ン (n): the long stroke of ソ comes down; the long stroke of ン sweeps up.'), kr('08', 'n', ['so', 'shi'], 'ン is "n". The long stroke sweeps up from the lower left.'),
  kr('09', 'ta', ['ku', 'chi'], 'タ is "ta".'), kr('10', 'chi', ['te', 'ta'], 'チ is "chi".'), kr('11', 'te', ['chi', 'to'], 'テ is "te": three horizontal-ish strokes with a hook.'), kr('12', 'nu', ['su', 'me'], 'ヌ is "nu". Compare ス (su): ヌ has an extra short stroke.'),
  kr('13', 'su', ['nu', 'ma'], 'ス is "su".'), kr('14', 'ha', ['ho', 'hi'], 'ハ is "ha": two slanted strokes.'), kr('15', 'fu', ['u', 'wa'], 'フ is "fu": a single stroke.'), kr('16', 'ma', ['a', 'mu'], 'マ is "ma".'),
  kr('17', 'ra', ['ru', 'ro'], 'ラ is "ra".'), kr('18', 'ru', ['ro', 'ra'], 'ル is "ru".'), kr('19', 'wa', ['u', 'fu'], 'ワ is "wa". Compare ウ (u), which has a top mark.'), kr('20', 'u', ['wa', 'fu'], 'ウ is "u": a top mark above a hook.'));
const rc = (n, rom) => Q(`q_n5u04_rc${n}`, 'kana_recall', { stem: { prompt: `Write the katakana for "${rom}".` }, answer: KATA[rom], explanation_correct: `"${rom}" is written ${KATA[rom]}.`, facet: 'produce', targets: [`ka_k_${rom}`], difficulty: 2 });
['a', 'ka', 'ko', 'sa', 'su', 'ta', 'to', 'na', 'ni', 'ha', 'ho', 'ma', 'mi', 'me', 'ya', 'ra', 're', 'ro', 'wa', 'n'].forEach((r, i) => add(rc(String(i + 1).padStart(2, '0'), r)));
const mt = (n, rows, note) => Q(`q_n5u04_mt${n}`, 'matching', { stem: { prompt: 'Match each katakana with its sound.' }, pairs: rows.map((r) => [KATA[r], r]), answer: rows.map((r) => KATA[r]), explanation_correct: note, facet: 'read', targets: rows.map((r) => `ka_k_${r}`), difficulty: 1 });
add(mt('01', ['a', 'i', 'u', 'e', 'o', 'ka'], 'The vowels, then カ.'), mt('02', ['ki', 'ku', 'ke', 'ko', 'sa', 'shi'], 'The rest of the k row, then サ and シ.'), mt('03', ['su', 'se', 'so', 'ta', 'chi', 'tsu'], 'The s and t rows.'),
  mt('04', ['te', 'to', 'na', 'ni', 'nu', 'ne'], 'The end of the t row and most of the n row.'), mt('05', ['no', 'ha', 'hi', 'fu', 'he', 'ho'], 'The h row, preceded by ノ.'), mt('06', ['ma', 'mi', 'mu', 'me', 'mo', 'ya'], 'The m row and ヤ.'),
  mt('07', ['yu', 'yo', 'ra', 'ri', 'ru', 're'], 'ユ ヨ and the r row.'), mt('08', ['ro', 'wa', 'wo', 'n', 'a', 'ka'], 'The end of the chart: ロ ワ ヲ ン.'));
const lk = (n, prompt, rom, ch, note) => Q(`q_n5u04_lk${n}`, 'mcq', { stem: { prompt }, choices: choices(ch.map(([id, t]) => [id, t, true])), answer: ch.find(([, , k]) => k)?.[0] || 'a', explanation_correct: note, explanation_per_distractor: Object.fromEntries(ch.slice(1).map(([id, t]) => [id, `${t} looks similar but is a different sound.`])), facet: 'read', targets: [`ka_k_${rom}`], difficulty: 2 });
add(lk('01', 'Which one is シ (shi)?', 'shi', [['a', 'シ'], ['b', 'ツ'], ['c', 'ソ']], 'シ lies flat; ツ and ソ are the look-alikes.'), lk('02', 'Which one is ツ (tsu)?', 'tsu', [['a', 'ツ'], ['b', 'シ'], ['c', 'ン']], 'ツ has near-upright short strokes.'),
  lk('03', 'Which one is ソ (so)?', 'so', [['a', 'ソ'], ['b', 'ン'], ['c', 'ツ']], 'ソ: the long stroke comes down.'), lk('04', 'Which one is ン (n)?', 'n', [['a', 'ン'], ['b', 'ソ'], ['c', 'シ']], 'ン: the long stroke sweeps up.'),
  lk('05', 'Which one is ウ (u)?', 'u', [['a', 'ウ'], ['b', 'ワ'], ['c', 'フ']], 'ウ has a small top mark.'), lk('06', 'Which one is ワ (wa)?', 'wa', [['a', 'ワ'], ['b', 'ウ'], ['c', 'ク']], 'ワ has no top mark.'));
// katakana words by sound (authored)
const rd = (n, word, en, ch, note, vid, extra = []) => Q(`q_n5u04_rd${n}`, 'mcq', { stem: { prompt: 'This word is borrowed from another language. What does it mean?', ja: word }, choices: choices(ch.map(([id, t]) => [id, t])), answer: 'a', explanation_correct: note, explanation_per_distractor: Object.fromEntries(ch.slice(1).map(([id, t]) => [id, `${t} is not what ${word} means.`])), facet: 'meaning', targets: [vid, ...extra], difficulty: 1 });
add(rd('01', 'ココア', 'cocoa', [['a', 'cocoa'], ['b', 'coffee'], ['c', 'cake']], 'ココア (kokoa) sounds like "cocoa".', 'v_kokoa'), rd('02', 'アイス', 'ice', [['a', 'ice cream'], ['b', 'ice skates'], ['c', 'a glass']], 'アイス (aisu) from "ice (cream)".', 'v_aisu'),
  rd('03', 'テニス', 'tennis', [['a', 'tennis'], ['b', 'tent'], ['c', 'tennis shoes']], 'テニス (tenisu).', 'v_tenisu'), rd('04', 'ホテル', 'hotel', [['a', 'hotel'], ['b', 'hospital'], ['c', 'hot tea']], 'ホテル (hoteru).', 'v_hoteru'),
  rd('05', 'カメラ', 'camera', [['a', 'camera'], ['b', 'camel'], ['c', 'chameleon']], 'カメラ (kamera).', 'v_kamera'), rd('06', 'ミルク', 'milk', [['a', 'milk (in drinks)'], ['b', 'a mill'], ['c', 'mink']], 'ミルク (miruku).', 'v_miruku'),
  rd('07', 'レストラン', 'restaurant', [['a', 'restaurant'], ['b', 'rest area'], ['c', 'restroom']], 'レストラン (resutoran).', 'v_resutoran'), rd('08', 'アメリカ', 'America', [['a', 'the United States'], ['b', 'Africa'], ['c', 'Australia']], 'アメリカ (amerika).', 'v_amerika'),
  rd('09', 'スマホ', 'smartphone', [['a', 'smartphone'], ['b', 'smart watch'], ['c', 'small house']], 'スマホ (sumaho) is short for smartphone.', 'v_sumaho'), rd('10', 'フランス', 'France', [['a', 'France'], ['b', 'Franc (money)'], ['c', 'Prance']], 'フランス (furansu).', 'v_furansu'),
  rd('11', 'ワイン', 'wine', [['a', 'wine'], ['b', 'a wing'], ['c', 'win']], 'ワイン (wain).', 'v_wain'), rd('12', 'アニメ', 'anime', [['a', 'anime (animation)'], ['b', 'animal'], ['c', 'enemy']], 'アニメ (anime).', 'v_anime'));
add(...meaningQuestions(Q, vocab.filter((x) => !/^v_(ichiji|niji|sanji|yoji|goji|rokuji|shichiji|hachiji|kuji|juuji|juuichiji|juuniji)$/.test(x.id))));

// spiral review (units 1 to 3) from the vocabulary tables
{
  const old = [...u01.vocab, ...u02.vocab.filter((w) => w.pos !== 'expression'), ...u03.vocab.filter((w) => !/^(num|ji)/.test(w.id))];
  const first = (x) => x.meanings_en[0];
  const pick = old.filter((_, i) => i % 3 === 2).slice(0, 64);
  pick.forEach((w, i) => {
    const cands = old.filter((c) => c.id !== w.id && first(c) !== first(w)).filter((_, k) => (k + i) % 9 === 0).slice(0, 3);
    const ordered = [cands[0], w, cands[1], cands[2]].filter(Boolean);
    const ids4 = ['a', 'b', 'c', 'd'];
    add(Q(`q_n5u04_sr_${w.id.slice(2)}`, 'mcq', { stem: { prompt: `Which word means "${first(w)}"?` }, choices: ordered.map((o, k) => ({ id: ids4[k], text: o.surface, ja: true, concept: o.id })), answer: ids4[ordered.indexOf(w)], explanation_correct: `"${first(w)}" is ${w.surface} (${w.romaji}).`, explanation_per_distractor: Object.fromEntries(ordered.map((o, k) => [ids4[k], `${o.surface} means "${first(o)}".`]).filter((_, k) => ordered[k] !== w)), facet: 'produce', targets: [w.id], difficulty: 1, tags: ['templated', 'spiral'] }));
  });
}

// ---------- numbers and kanji ----------
const nk = (n, ch, rom, others, kid, vid, note) => Q(`q_n5u04_nk${n}`, 'mcq', { stem: { prompt: 'How is this number read?', ja: ch }, choices: choices([['a', rom], ...others.map((o, i) => [`d${i + 1}`, o])]), answer: 'a', explanation_correct: note, explanation_per_distractor: Object.fromEntries(others.map((o, i) => [`d${i + 1}`, `That is the reading of a different number.`])), facet: 'read', targets: [kid, vid], difficulty: 1 });
add(nk('01', '一', 'ichi', ['ni', 'san'], 'k_ichi', 'v_num1', '一 is one line: one.'), nk('02', '二', 'ni', ['ichi', 'san'], 'k_ni', 'v_num2', '二 is two lines: two.'), nk('03', '三', 'san', ['ni', 'roku'], 'k_san', 'v_num3', '三 is three lines: three.'),
  nk('04', '四', 'yon', ['go', 'roku'], 'k_shi', 'v_num4', '四 is four, usually yon.'), nk('05', '五', 'go', ['yon', 'roku'], 'k_go', 'v_num5', '五 is five.'), nk('06', '六', 'roku', ['go', 'san'], 'k_roku', 'v_num6', '六 is six.'));
const nm = (n, ch, ans, others, kid, vid) => Q(`q_n5u04_nm${n}`, 'mcq', { stem: { prompt: 'Which number is this kanji?', ja: ch }, choices: choices([['a', ans], ...others.map((o, i) => [`d${i + 1}`, o])]), answer: 'a', explanation_correct: `${ch} = ${ans}.`, explanation_per_distractor: Object.fromEntries(others.map((o, i) => [`d${i + 1}`, `${o} is written with a different kanji.`])), facet: 'meaning', targets: [kid, vid], difficulty: 1 });
add(nm('01', '一', '1', ['2', '3'], 'k_ichi', 'v_num1'), nm('02', '二', '2', ['1', '5'], 'k_ni', 'v_num2'), nm('03', '三', '3', ['2', '6'], 'k_san', 'v_num3'), nm('04', '四', '4', ['5', '6'], 'k_shi', 'v_num4'), nm('05', '五', '5', ['4', '6'], 'k_go', 'v_num5'), nm('06', '六', '6', ['4', '5'], 'k_roku', 'v_num6'));
add(Q('q_n5u04_nmt01', 'matching', { stem: { prompt: 'Match each kanji with its number.' }, pairs: [['一', '1'], ['二', '2'], ['三', '3'], ['四', '4'], ['五', '5'], ['六', '6']], answer: ['一', '二', '三', '四', '五', '六'], explanation_correct: 'Kanji for one to three are one, two and three lines.', facet: 'meaning', targets: ['k_ichi', 'k_ni', 'k_san', 'k_shi', 'k_go', 'k_roku'], difficulty: 2 }),
  Q('q_n5u04_nmt02', 'matching', { stem: { prompt: 'Match each number word with its meaning.' }, pairs: [['なな', '7'], ['はち', '8'], ['きゅう', '9'], ['じゅう', '10'], ['れい', '0'], ['せん', '1,000']], answer: ['なな', 'はち', 'きゅう', 'じゅう', 'れい', 'せん'], explanation_correct: 'These numbers are written in kana for now.', facet: 'meaning', targets: ['v_nana', 'v_hachi', 'v_kyuu', 'v_juu', 'v_rei', 'v_sen'], difficulty: 2 }),
  Q('q_n5u04_nmq01', 'mcq', { stem: { prompt: 'Which is ten thousand?' }, choices: choices([['a', 'まん', true], ['b', 'せん', true], ['c', 'ひゃく', true]]), answer: 'a', explanation_correct: 'まん = 10,000; せん = 1,000; ひゃく = 100.', explanation_per_distractor: { b: 'せん is one thousand.', c: 'ひゃく is one hundred.' }, facet: 'meaning', targets: ['v_man', 'v_sen', 'v_hyaku'], difficulty: 2 }),
  Q('q_n5u04_nmq02', 'mcq', { stem: { prompt: 'Which number is seven?' }, choices: choices([['a', 'なな', true], ['b', 'はち', true], ['c', 'ろく', true]]), answer: 'a', explanation_correct: 'なな and しち both mean seven.', explanation_per_distractor: { b: 'はち is eight.', c: 'ろく is six.' }, facet: 'meaning', targets: ['v_nana', 'v_shichi'], difficulty: 1 }),
  Q('q_n5u04_nmq03', 'mcq', { stem: { prompt: 'Which kanji is the smaller number: 二 or 五?', ja: '二 五' }, choices: choices([['a', '二 (2)'], ['b', '五 (5)']]), answer: 'a', explanation_correct: '二 is two and 五 is five.', explanation_per_distractor: { b: '五 is five, the larger number.' }, facet: 'meaning', targets: ['k_ni', 'k_go'], difficulty: 2 }));
const nty = (n, en, ans, vid, alt = null) => Q(`q_n5u04_nty${n}`, 'typing_ja', { stem: { prompt: `Type "${en}" in hiragana (romaji is accepted).` }, answer: ans, accept_alternatives: alt, explanation_correct: `${en} = ${ans}.`, facet: 'produce', targets: [vid], difficulty: 2 });
add(nty('01', 'three', 'さん', 'v_num3'), nty('02', 'six', 'ろく', 'v_num6'), nty('03', 'eight', 'はち', 'v_hachi'), nty('04', 'nine', 'きゅう', 'v_kyuu'), nty('05', 'ten', 'じゅう', 'v_juu'));

// ---------- time (grammar) ----------
const gcq = [];
{
  const g = (...q) => { gcq.push(...q.map((x) => x.id)); add(...q); };
  g(Q('q_n5u04_ti01', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'いま なんじ です か' }, choices: choices([['a', 'What time is it now?'], ['b', 'What day is it today?'], ['c', 'Where is the station?']]), answer: 'a', explanation_correct: 'いま = now, なんじ = what time, です か makes it a polite question.', explanation_per_distractor: { b: 'The day of the week is asked differently (later unit).', c: 'えき (station) is not in the sentence.' }, facet: 'meaning', targets: ['g_clock_time', 'v_ima', 'v_nanji'], source_sentence_id: 's_n5u04_t01', difficulty: 2 }),
    Q('q_n5u04_ti02', 'fill_blank', { stem: { prompt: "Complete: It is 3 o'clock now.", ja: 'いま ＿＿ です' }, choices: choices([['a', 'さんじ', true], ['b', 'さんふん', true], ['c', 'さんばん', true]]), answer: 'a', explanation_correct: 'さん + じ = さんじ, 3 o\'clock.', explanation_per_distractor: { b: 'ふん counts minutes.', c: 'ばん counts numbered items.' }, facet: 'construct', targets: ['g_clock_time', 'v_sanji'], source_sentence_id: 's_n5u04_t02', difficulty: 2 }),
    Q('q_n5u04_ti03', 'mcq', { stem: { prompt: "How do you say 4 o'clock?" }, choices: choices([['a', 'よじ', true], ['b', 'よんじ', true], ['c', 'しじ', true]]), answer: 'a', explanation_correct: "4 o'clock is irregular: よじ.", explanation_per_distractor: { b: 'よんじ is not used for the hour.', c: 'しじ is not used for the hour.' }, facet: 'meaning', targets: ['g_clock_time', 'v_yoji'], difficulty: 2 }),
    Q('q_n5u04_ti04', 'mcq', { stem: { prompt: "How do you say 7 o'clock?" }, choices: choices([['a', 'しちじ', true], ['b', 'ななじ', true], ['c', 'なのじ', true]]), answer: 'a', explanation_correct: "7 o'clock is しちじ.", explanation_per_distractor: { b: 'ななじ is not the hour reading.', c: 'なのじ is not a word.' }, facet: 'meaning', targets: ['g_clock_time', 'v_shichiji'], difficulty: 2 }),
    Q('q_n5u04_ti05', 'mcq', { stem: { prompt: "How do you say 9 o'clock?" }, choices: choices([['a', 'くじ', true], ['b', 'きゅうじ', true], ['c', 'ここのじ', true]]), answer: 'a', explanation_correct: "9 o'clock is くじ.", explanation_per_distractor: { b: 'きゅうじ is not the hour reading.', c: 'ここのじ is not a word.' }, facet: 'meaning', targets: ['g_clock_time', 'v_kuji'], difficulty: 2 }),
    Q('q_n5u04_ti06', 'sentence_order', { stem: { prompt: "Put the words in order: It is 6:30 p.m. now." }, tiles: ['はん', 'ろくじ', 'です', 'ごご', 'いま'], answer: ['いま', 'ごご', 'ろくじ', 'はん', 'です'], explanation_correct: 'Order: now, p.m., hour, half, です.', facet: 'construct', targets: ['g_clock_time', 'v_ima', 'v_gogo', 'v_rokuji', 'v_han'], source_sentence_id: 's_n5u04_t03', difficulty: 3 }),
    Q('q_n5u04_ti07', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'でんしゃ は ごぜん しちじ です' }, choices: choices([['a', 'The train is at 7 a.m.'], ['b', 'The train is at 7 p.m.'], ['c', 'The train is at 9 a.m.']]), answer: 'a', explanation_correct: 'ごぜん = a.m., しちじ = 7 o\'clock.', explanation_per_distractor: { b: 'ごご would mean p.m.', c: 'くじ would be 9 o\'clock.' }, facet: 'meaning', targets: ['g_clock_time', 'v_densha', 'v_gozen', 'v_shichiji'], source_sentence_id: 's_n5u04_t04', difficulty: 2 }),
    Q('q_n5u04_ti08', 'mcq', { stem: { prompt: 'Which means "10 minutes"?' }, choices: choices([['a', 'じゅっぷん', true], ['b', 'じゅうふん', true], ['c', 'じゅうじ', true]]), answer: 'a', explanation_correct: '10 minutes is じゅっぷん (irregular).', explanation_per_distractor: { b: 'じゅうふん is not used for 10 minutes.', c: 'じゅうじ is 10 o\'clock.' }, facet: 'meaning', targets: ['g_clock_time', 'v_juppun'], difficulty: 2 }),
    Q('q_n5u04_ti09', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'いま さんじ ごふん です' }, choices: choices([['a', 'It is 3:05 now.'], ['b', 'It is 5:03 now.'], ['c', 'It is 3 o\'clock now.']]), answer: 'a', explanation_correct: 'さんじ = 3 o\'clock, ごふん = 5 minutes.', explanation_per_distractor: { b: 'The hour comes first in Japanese.', c: 'ごふん adds five minutes.' }, facet: 'meaning', targets: ['g_clock_time', 'v_sanji', 'v_gofun'], source_sentence_id: 's_n5u04_t06', difficulty: 2 }));
}
const grammar = [GR('g_clock_time', { title: 'Telling the time: ～じ and ～ふん', pattern: 'いま ＋ (ごぜん / ごご) ＋ number + じ ＋ (number + ふん / はん) ＋ です', meaning_en: 'States the time; いま なんじ です か asks it.',
  explanation: ['Hours are a number plus じ: いちじ, にじ, さんじ ... but three are irregular: よじ (4), しちじ (7), くじ (9). 10, 11 and 12 are じゅうじ, じゅういちじ, じゅうにじ.', 'Add はん for "half past" and number + ふん / ぷん for minutes: さんじ ごふん is 3:05. Some minutes are irregular, such as じゅっぷん (10 minutes).', 'ごぜん means a.m. and ごご means p.m., and both go before the hour. To ask the time say いま なんじ です か.'],
  structure_notes: 'いま (ごぜん/ごご) + hour + (minutes / はん) + です.', examples: ['s_n5u04_t01', 's_n5u04_t02', 's_n5u04_t03', 's_n5u04_t06'], common_mistakes: ['Saying よんじ instead of よじ.', 'Saying ななじ instead of しちじ.', 'Putting the minutes before the hour.'], contrast_with: ['g_ka_question'], practice_question_ids: gcq.map((x) => x), register: 'polite', tags: ['time', 'counters'] })];

// ---------- dictation, typing, listening ----------
const dc = (n, word, vid, note) => Q(`q_n5u04_dc${n}`, 'dictation', { stem: { prompt: 'Listen, then type what you hear in hiragana (romaji is accepted).', audio_text: word }, answer: word, explanation_correct: note, facet: 'listen', targets: [vid], difficulty: 3, tags: ['listening_relevant'] });
add(dc('01', 'さんじ', 'v_sanji', "さんじ = 3 o'clock."), dc('02', 'ろくじ', 'v_rokuji', "ろくじ = 6 o'clock."), dc('03', 'しちじ', 'v_shichiji', "しちじ = 7 o'clock (irregular)."), dc('04', 'くじ', 'v_kuji', "くじ = 9 o'clock (irregular)."));
const ty = (n, en, ans, vid, alt = null) => Q(`q_n5u04_ty${n}`, 'typing_ja', { stem: { prompt: `Type "${en}" in hiragana (romaji is accepted).` }, answer: ans, accept_alternatives: alt, explanation_correct: `${en} = ${ans}.`, facet: 'produce', targets: [vid], difficulty: 2 });
add(ty('01', "4 o'clock", 'よじ', 'v_yoji'), ty('02', "7 o'clock", 'しちじ', 'v_shichiji'), ty('03', "9 o'clock", 'くじ', 'v_kuji'), ty('04', 'station', 'えき', 'v_eki'), ty('05', 'train', 'でんしゃ', 'v_densha'), ty('06', 'ticket', 'きっぷ', 'v_kippu'), ty('07', 'now', 'いま', 'v_ima'));
const gl = (n, lid, phrase, others, vid, note, ja = true) => Q(`q_n5u04_gl${n}`, 'listening_comp', { stem: { prompt: 'What did you hear?', audio_text: phrase, context_id: lid }, choices: choices([['a', phrase, ja], ...others.map((o, i) => [`d${i + 1}`, o, ja])]), answer: 'a', explanation_correct: note, explanation_per_distractor: Object.fromEntries(others.map((o, i) => [`d${i + 1}`, `${o} sounds different: listen again for the number.`])), facet: 'listen', targets: [vid], difficulty: 2, tags: ['listening_relevant'] });
add(gl('01', 'n5u04_ls1', 'さんじ', ['ろくじ', 'はちじ'], 'v_sanji', "You heard さんじ: 3 o'clock."), gl('02', 'n5u04_ls1', 'よじ', ['くじ', 'しちじ'], 'v_yoji', "You heard よじ: 4 o'clock."), gl('03', 'n5u04_ls1', 'じゅうにじ', ['じゅうじ', 'じゅういちじ'], 'v_juuniji', "You heard じゅうにじ: 12 o'clock."), gl('04', 'n5u04_ls1', 'ごじ', ['ろくじ', 'さんじ'], 'v_goji', "You heard ごじ: 5 o'clock."),
  gl('05', 'n5u04_ls2', 'さんばんせん', ['ごばんせん', 'いちばんせん'], 'v_bansen', 'You heard さんばんせん: platform 3.'), gl('06', 'n5u04_ls2', 'ごばんせん', ['さんばんせん', 'ろくばんせん'], 'v_bansen', 'You heard ごばんせん: platform 5.'), gl('07', 'n5u04_ls2', 'にばんせん', ['さんばんせん', 'よんばんせん'], 'v_bansen', 'You heard にばんせん: platform 2.'), gl('08', 'n5u04_ls2', 'ろくばんせん', ['ごばんせん', 'さんばんせん'], 'v_bansen', 'You heard ろくばんせん: platform 6.'),
  gl('09', 'n5u04_ls3', 'ホテル', ['カメラ', 'タオル'], 'v_hoteru', 'You heard ほてる: ホテル.'), gl('10', 'n5u04_ls3', 'カメラ', ['ホテル', 'マスク'], 'v_kamera', 'You heard かめら: カメラ.'), gl('11', 'n5u04_ls3', 'レストラン', ['ホテル', 'テニス'], 'v_resutoran', 'You heard れすとらん: レストラン.'), gl('12', 'n5u04_ls3', 'ワイン', ['ミルク', 'アイス'], 'v_wain', 'You heard わいん: ワイン.'));
const listening = [
  LS('n5u04_ls1', { item_type: 'Word recognition (lesson practice)', title: 'What time? Set 1', script_turns: ['さんじ', 'よじ', 'じゅうにじ', 'ごじ'].map((t) => ({ speaker: 'A', text_ja: t })), question_ids: ['q_n5u04_gl01', 'q_n5u04_gl02', 'q_n5u04_gl03', 'q_n5u04_gl04'] }),
  LS('n5u04_ls2', { item_type: 'Word recognition (lesson practice)', title: 'Which platform?', script_turns: ['さんばんせん', 'ごばんせん', 'にばんせん', 'ろくばんせん'].map((t) => ({ speaker: 'A', text_ja: t })), question_ids: ['q_n5u04_gl05', 'q_n5u04_gl06', 'q_n5u04_gl07', 'q_n5u04_gl08'] }),
  LS('n5u04_ls3', { item_type: 'Word recognition (lesson practice)', title: 'Loanwords by ear', script_turns: ['ホテル', 'カメラ', 'レストラン', 'ワイン'].map((t) => ({ speaker: 'A', text_ja: t })), question_ids: ['q_n5u04_gl09', 'q_n5u04_gl10', 'q_n5u04_gl11', 'q_n5u04_gl12'] }),
];

// ---------- dialogues ----------
const dialogues = [
  DG('n5u04_d1', { title: 'Which platform?', setting: 'tokyo_station', turns: [{ speaker: 'A', sentence_id: 's_n5u04_s05' }, { speaker: 'B', sentence_id: 's_n5u04_s06' }, { speaker: 'A', sentence_id: 's_n5u02_g07' }, { speaker: 'B', sentence_id: 's_n5u02_g08' }], comprehension_question_ids: ['q_n5u04_dg01', 'q_n5u04_dg02'], register: 'polite' }),
  DG('n5u04_d2', { title: 'What time is it?', setting: 'tokyo_station', turns: [{ speaker: 'A', sentence_id: 's_n5u04_s07' }, { speaker: 'B', sentence_id: 's_n5u04_s08' }, { speaker: 'A', sentence_id: 's_n5u02_g07' }], comprehension_question_ids: ['q_n5u04_dg03', 'q_n5u04_dg04'], register: 'polite' }),
  DG('n5u04_d3', { title: 'What time is the train?', setting: 'tokyo_station', turns: [{ speaker: 'A', sentence_id: 's_n5u04_s09' }, { speaker: 'B', sentence_id: 's_n5u04_s10' }], comprehension_question_ids: ['q_n5u04_dg05', 'q_n5u04_dg06'], register: 'polite' }),
  DG('n5u04_d4', { title: 'The ticket', setting: 'tokyo_station', turns: [{ speaker: 'A', sentence_id: 's_n5u04_s03' }, { speaker: 'B', sentence_id: 's_n5u04_s11' }], comprehension_question_ids: ['q_n5u04_dg07'], register: 'polite' }),
];
const dg = (n, did, prompt, ch, ans, note, targets, type = 'dialogue_complete') => Q(`q_n5u04_dg${n}`, type, { stem: { prompt, context_id: did }, choices: choices(ch), answer: ans, explanation_correct: note, explanation_per_distractor: Object.fromEntries(ch.filter(([id]) => id !== ans).map(([id, t]) => [id, `${t} is not what the dialogue says.`])), facet: 'meaning', targets, difficulty: 2 });
add(dg('01', 'n5u04_d1', 'Which platform does the train leave from?', [['a', 'Platform 3'], ['b', 'Platform 5'], ['c', 'Platform 6']], 'a', 'B answers さんばんせん です.', ['v_bansen', 'v_num3']),
  dg('02', 'n5u04_d1', 'What does B say after the thanks?', [['a', 'どういたしまして', true], ['b', 'いただきます', true], ['c', 'こんばんは', true]], 'a', 'どういたしまして = "you are welcome".', ['v_douitashimashite']),
  dg('03', 'n5u04_d2', 'What time is it?', [['a', "3 p.m."], ['b', "3 a.m."], ['c', "6 p.m."]], 'a', 'B says いま ごご さんじ です.', ['v_gogo', 'v_sanji']),
  dg('04', 'n5u04_d2', 'What does A ask first?', [['a', 'いま なんじ です か', true], ['b', 'でんしゃ は ここ です か', true], ['c', 'おなまえ は なん です か', true]], 'a', 'A asks the time with すみません いま なんじ です か.', ['v_ima', 'v_nanji']),
  dg('05', 'n5u04_d3', 'What time is the train?', [['a', '9:30 a.m.'], ['b', '9:30 p.m.'], ['c', '3:30 a.m.']], 'a', 'ごぜん くじ はん = 9:30 a.m.', ['v_gozen', 'v_kuji', 'v_han']),
  dg('06', 'n5u04_d3', 'Is the train in the morning or the afternoon?', [['a', 'Morning'], ['b', 'Afternoon'], ['c', 'Not stated']], 'a', 'ごぜん means a.m.', ['v_gozen']),
  dg('07', 'n5u04_d4', 'Where is the ticket, according to B?', [['a', 'Here'], ['b', 'Over there'], ['c', 'At the hotel']], 'a', 'B answers はい ここ です.', ['v_kippu']));

// ---------- reading ----------
const r1 = ['ごぜん しちじ  いちばんせん', 'ごぜん くじ はん  さんばんせん', 'ごご さんじ  ごばんせん', 'ごご ろくじ  にばんせん'];
const r2 = ['ホテル は あそこ です', 'レストラン は ここ です', 'えき は あそこ です'];
const passages = [
  PS('n5u04_r1', { title: 'Train timetable', paragraphs: r1, translation_en: '7 a.m. platform 1 / 9:30 a.m. platform 3 / 3 p.m. platform 5 / 6 p.m. platform 2', word_count_chars: countChars(r1), question_ids: ['q_n5u04_rq01', 'q_n5u04_rq02', 'q_n5u04_rq03'], genre: 'signs' }),
  PS('n5u04_r2', { title: 'Station map notes', paragraphs: r2, translation_en: 'The hotel is over there. / The restaurant is here. / The station is over there.', word_count_chars: countChars(r2), question_ids: ['q_n5u04_rq04', 'q_n5u04_rq05'], genre: 'signs' }),
];
const rq = (n, pid, prompt, ch, ans, note, tg, type = 'reading_comp') => Q(`q_n5u04_rq${n}`, type, { stem: { prompt, context_id: pid }, choices: choices(ch), answer: ans, explanation_correct: note, explanation_per_distractor: Object.fromEntries(ch.filter(([id]) => id !== ans).map(([id, t]) => [id, `Check the board again: ${t} does not match.`])), facet: 'read', targets: tg, difficulty: 2 });
add(rq('01', 'n5u04_r1', 'Which platform has the 7 a.m. train?', [['a', 'Platform 1'], ['b', 'Platform 3'], ['c', 'Platform 5']], 'a', 'ごぜん しちじ → いちばんせん.', ['v_shichiji', 'v_bansen'], 'information_retrieval'),
  rq('02', 'n5u04_r1', 'What time is the train from platform 5?', [['a', '3 p.m.'], ['b', '6 p.m.'], ['c', '9:30 a.m.']], 'a', 'ごご さんじ → ごばんせん.', ['v_sanji', 'v_gogo', 'v_bansen'], 'information_retrieval'),
  rq('03', 'n5u04_r1', 'Which train leaves at 6 p.m.?', [['a', 'Platform 2'], ['b', 'Platform 1'], ['c', 'Platform 3']], 'a', 'ごご ろくじ → にばんせん.', ['v_rokuji', 'v_bansen'], 'information_retrieval'),
  rq('04', 'n5u04_r2', 'Where is the restaurant?', [['a', 'Here'], ['b', 'Over there'], ['c', 'At the station']], 'a', 'レストラン は ここ です.', ['v_resutoran']),
  rq('05', 'n5u04_r2', 'Which place is over there?', [['a', 'The hotel and the station'], ['b', 'Only the restaurant'], ['c', 'Nothing']], 'a', 'ホテル and えき are both あそこ.', ['v_hoteru', 'v_eki']));

// ---------- translate / construct (station vocabulary) ----------
const sentIdx = Object.fromEntries(sentences.map((s) => [s.id, s]));
const tr = (n, sid, correct, wrong, note, extra = []) => { const s = sentIdx[sid]; return Q(`q_n5u04_tr${n}`, 'translate', { stem: { prompt: 'Choose the meaning.', ja: s.text_ja }, choices: choices([['a', correct], ['b', wrong[0]], ['c', wrong[1]]]), answer: 'a', explanation_correct: note, explanation_per_distractor: { b: `That is not what ${s.text_ja} says.`, c: `That is not what ${s.text_ja} says.` }, facet: 'meaning', targets: [...s.vocab_ids, ...extra], source_sentence_id: sid, difficulty: 2 }); };
add(tr('01', 's_n5u04_s05', 'Excuse me, which platform is the train?', ['Excuse me, what time is the train?', 'Excuse me, where is the station?'], 'なんばんせん = which platform.'), tr('02', 's_n5u04_s09', 'What time is the train?', ['Which platform is the train?', 'Where is the train?'], 'なんじ asks the time.'),
  tr('03', 's_n5u04_s03', 'Is the ticket here?', ['Where is the ticket?', 'The ticket is here.'], 'です か makes it a question.'), tr('04', 's_n5u04_t09', 'The hotel is over there.', ['The hotel is big.', 'The hotel is here.'], 'あそこ = over there.'),
  tr('05', 's_n5u04_t05', 'It is 10 a.m. now.', ['It is 10 p.m. now.', 'It is 9 a.m. now.'], 'ごぜん = a.m.; じゅうじ = 10 o\'clock.'), tr('06', 's_n5u04_t07', 'It is 8:10 now.', ['It is 10:08 now.', 'It is 8 o\'clock now.'], 'はちじ じゅっぷん = 8:10.'));
add(Q('q_n5u04_so01', 'sentence_order', { stem: { prompt: 'Put the words in order: What time is the train?' }, tiles: ['か', 'です', 'なんじ', 'は', 'でんしゃ'], answer: ['でんしゃ', 'は', 'なんじ', 'です', 'か'], explanation_correct: 'Topic は question word です か.', facet: 'construct', targets: ['v_densha', 'v_nanji', 'g_clock_time'], source_sentence_id: 's_n5u04_s09', difficulty: 3 }),
  Q('q_n5u04_so02', 'sentence_order', { stem: { prompt: 'Put the words in order: It is 3 p.m. now.' }, tiles: ['です', 'さんじ', 'いま', 'ごご'], answer: ['いま', 'ごご', 'さんじ', 'です'], explanation_correct: 'now, p.m., hour, です.', facet: 'construct', targets: ['v_ima', 'v_gogo', 'v_sanji', 'g_clock_time'], source_sentence_id: 's_n5u04_s08', difficulty: 3 }),
  Q('q_n5u04_so03', 'sentence_order', { stem: { prompt: 'Put the words in order: It is platform 3.' }, tiles: ['です', 'さんばんせん'], answer: ['さんばんせん', 'です'], explanation_correct: 'Number + ばんせん + です.', facet: 'construct', targets: ['v_bansen', 'v_num3'], source_sentence_id: 's_n5u04_s06', difficulty: 2 }));

// ---------- lessons ----------
const ids = (arr) => arr.map((x) => x.id);
const qs = (...x) => x.map((n) => `q_n5u04_${n}`);
const vmq = (arr) => arr.map((x) => `q_n5u04_vm_${x.id.slice(2)}`);
const kk = (rows) => rows.map((r) => `ka_k_${r}`);
const r1k = ['a', 'i', 'u', 'e', 'o', 'ka', 'ki', 'ku', 'ke', 'ko', 'sa', 'shi', 'su', 'se', 'so'];
const r2k = ['ta', 'chi', 'tsu', 'te', 'to', 'na', 'ni', 'nu', 'ne', 'no', 'ha', 'hi', 'fu', 'he', 'ho'];
const r3k = ['ma', 'mi', 'mu', 'me', 'mo', 'ya', 'yu', 'yo', 'ra', 'ri', 'ru', 're', 'ro', 'wa', 'wo', 'n'];
const spiralIds = questions.filter((q) => q.id.startsWith('q_n5u04_sr_')).map((q) => q.id);
const timeWords = vocabL.l5.filter((x) => /^v_(ichiji|niji|sanji|yoji|goji|rokuji|shichiji|hachiji|kuji|juuji|juuichiji|juuniji)$/.test(x.id));
const lessons = [
  L('n5_u04_l1', { title: 'Katakana I: vowels, K and S', goal: 'Read katakana a, i, u, e, o and the k and s rows. Katakana is used for words borrowed from other languages.', introduces: { kana: kk(r1k), vocab: ids(vocabL.l1) },
    explain: [{ heading: 'A second kana set', body: ['Katakana has the same sounds as hiragana but different shapes: ア = あ, カ = か. It is used for foreign loanwords, names of foreign places and people, and emphasis.', 'Look-alikes to watch: シ (shi) and ツ (tsu) have almost-upright versus almost-flat short strokes; ソ and ン differ by the direction of the long stroke.'], examples: [{ ja: 'ココア', reading: 'kokoa', en: 'cocoa' }, { ja: 'アイス', reading: 'aisu', en: 'ice cream' }] }],
    practice: { question_ids: qs('kr01', 'kr02', 'kr03', 'kr04', 'kr05', 'kr07', 'kr13', 'kr20', 'mt01', 'mt02', 'rc01', 'rc02', 'rc03', 'rc04', 'rc05', 'rd01', 'rd02').concat(vmq(vocabL.l1)), gen: [{ type: 'kana_recog', from: 'kana', ids: kk(r1k), n: 6 }, { type: 'kana_listen', from: 'kana', ids: kk(r1k), n: 4 }] },
    exit_check: { gen: [{ type: 'kana_recog', from: 'kana', ids: kk(r1k), n: 8 }], pass: 0.7 } }),
  L('n5_u04_l2', { title: 'Katakana II: T, N and H', goal: 'Read the t, n and h rows of katakana and your first loanwords.', introduces: { kana: kk(r2k), vocab: ids(vocabL.l2) },
    explain: [{ heading: 'Three more rows', body: ['タ チ ツ テ ト, ナ ニ ヌ ネ ノ, ハ ヒ フ ヘ ホ. Note ス (su) versus ヌ (nu): ヌ has an extra short stroke.', 'The sounds are the same as the hiragana rows: チ is "chi", ツ is "tsu", フ is "fu".'], examples: [{ ja: 'テニス', reading: 'tenisu', en: 'tennis' }, { ja: 'トマト', reading: 'tomato', en: 'tomato' }, { ja: 'ネクタイ', reading: 'nekutai', en: 'necktie' }] }],
    practice: { question_ids: qs('kr06', 'kr09', 'kr10', 'kr11', 'kr12', 'kr14', 'kr15', 'mt03', 'mt04', 'mt05', 'rc06', 'rc07', 'rc08', 'rc09', 'rc10', 'rc11', 'rd03').concat(vmq(vocabL.l2)), gen: [{ type: 'kana_recog', from: 'kana', ids: kk(r2k), n: 6 }, { type: 'kana_recall', from: 'kana', ids: kk(r2k), n: 4 }] },
    exit_check: { gen: [{ type: 'kana_recog', from: 'kana', ids: [...kk(r1k), ...kk(r2k)], n: 8 }], pass: 0.7 } }),
  L('n5_u04_l3', { title: 'Katakana III: M, Y, R, W and ン', goal: 'Finish the basic katakana chart and read travel and food loanwords.', introduces: { kana: kk(r3k), vocab: ids(vocabL.l3) },
    explain: [{ heading: 'The last rows', body: ['マ ミ ム メ モ, ヤ ユ ヨ, ラ リ ル レ ロ, ワ ヲ, ン. Compare ウ (u) with ワ (wa): ウ has a small mark on top.', 'ヲ is the katakana for "o" but is hardly ever used; you will rarely see it.'], examples: [{ ja: 'ホテル', reading: 'hoteru', en: 'hotel' }, { ja: 'カメラ', reading: 'kamera', en: 'camera' }, { ja: 'アメリカ', reading: 'amerika', en: 'the United States' }, { ja: 'レストラン', reading: 'resutoran', en: 'restaurant' }] }],
    practice: { question_ids: qs('kr08', 'kr16', 'kr17', 'kr18', 'kr19', 'mt06', 'mt07', 'mt08', 'lk01', 'lk02', 'lk03', 'lk04', 'lk05', 'lk06', 'rc12', 'rc13', 'rc14', 'rc15', 'rc16', 'rc17', 'rc18', 'rc19', 'rc20', 'rd04', 'rd05', 'rd06', 'rd07', 'rd08', 'rd09', 'rd10', 'rd11', 'rd12').concat(vmq(vocabL.l3)), gen: [{ type: 'kana_recog', from: 'kana', ids: kk(r3k), n: 6 }, { type: 'kana_recall', from: 'kana', ids: kk(r3k), n: 4 }] },
    exit_check: { gen: [{ type: 'kana_recog', from: 'kana', ids: [...kk(r2k), ...kk(r3k)], n: 8 }, { type: 'vocab_meaning', from: 'vocab', ids: ids(vocabL.l3), n: 4 }], pass: 0.7 } }),
  L('n5_u04_l4', { title: 'Counting: numbers and kanji 一〜六', goal: 'Read and say the numbers 0 to 10 and up to 10,000, with six kanji.', introduces: { kanji: ids(kanji), vocab: ids(vocabL.l4) },
    explain: [{ heading: 'The numbers', body: ['いち に さん よん ご ろく なな はち きゅう じゅう. Seven is しち or なな, four is よん or し, nine is きゅう or く. 0 is れい; 100 is ひゃく, 1,000 is せん, 10,000 is まん.', 'The first three kanji are simply that many lines: 一 二 三. Then 四 五 六.'], examples: [{ ja: '一 二 三', reading: 'ichi ni san', en: 'one, two, three' }, { ja: '四 五 六', reading: 'yon go roku', en: 'four, five, six' }], },
      { heading: 'Learn by reading', body: ['At this stage the kanji appear with furigana (small kana above) until you have studied them. Stroke order is not shown yet in this release.'], examples: [{ ja: '三', reading: 'san', en: 'three' }] }],
    practice: { question_ids: qs('nk01', 'nk02', 'nk03', 'nk04', 'nk05', 'nk06', 'nm01', 'nm02', 'nm03', 'nm04', 'nm05', 'nm06', 'nmt01', 'nmt02', 'nmq01', 'nmq02', 'nmq03', 'nty01', 'nty02', 'nty03', 'nty04', 'nty05').concat(vmq(vocabL.l4)) },
    exit_check: { question_ids: qs('nk01', 'nk03', 'nk05', 'nm02', 'nm04', 'nm06', 'nmt01', 'nmt02', 'nty01', 'nty03'), pass: 0.7 } }),
  L('n5_u04_l5', { title: 'What time is it?', goal: 'Tell and ask the time with じ, ふん and はん.', introduces: { vocab: ids(vocabL.l5), grammar: ['g_clock_time'] },
    explain: [{ heading: 'Hours', body: ['Number + じ makes an hour: いちじ, にじ, さんじ, ごじ, ろくじ, はちじ. The irregular ones are よじ (4), しちじ (7), くじ (9).'], examples: [{ ja: 'さんじ', reading: 'sanji', en: "3 o'clock" }, { ja: 'よじ', reading: 'yoji', en: "4 o'clock" }, { ja: 'くじ', reading: 'kuji', en: "9 o'clock" }] },
      { heading: 'Minutes and the half hour', body: ['はん is "half past". ごふん is 5 minutes; じゅっぷん is 10. Put ごぜん (a.m.) or ごご (p.m.) before the hour.', 'To ask: いま なんじ です か.'], examples: [{ ja: 'いま ごご ろくじ はん です', reading: 'ima gogo rokuji han desu', en: 'It is 6:30 p.m. now.' }] }],
    practice: { question_ids: qs('ti01', 'ti02', 'ti03', 'ti04', 'ti05', 'ti06', 'ti07', 'ti08', 'ti09', 'ty01', 'ty02', 'ty03', 'ty07').concat(vmq(vocabL.l5.filter((x) => !timeWords.includes(x)))) },
    context: { question_ids: qs('gl01', 'gl02', 'gl03', 'gl04', 'dc01', 'dc02', 'dc03', 'dc04') },
    exit_check: { question_ids: qs('ti01', 'ti02', 'ti03', 'ti05', 'ti06', 'ti07', 'gl02', 'dc03'), pass: 0.7 } }),
  L('n5_u04_l6', { title: 'At the station', goal: 'Ask which platform and what time the train leaves.', introduces: { vocab: ids(vocabL.l6) },
    explain: [{ heading: 'Platforms', body: ['Number + ばんせん is a platform: さんばんせん is "platform 3". なんばんせん asks "which platform?".', 'A typical exchange: すみません でんしゃ は なんばんせん です か → さんばんせん です.'], examples: [{ ja: 'さんばんせん', reading: 'sanbansen', en: 'platform 3' }, { ja: 'すみません でんしゃ は なんばんせん です か', reading: 'sumimasen densha wa nanbansen desu ka', en: 'Excuse me, which platform is the train?' }] }],
    practice: { question_ids: qs('tr01', 'tr02', 'tr03', 'tr04', 'so01', 'so03', 'ty04', 'ty05', 'ty06', 'dg01', 'dg02').concat(vmq(vocabL.l6)) },
    context: { question_ids: qs('dg03', 'dg04', 'dg05', 'dg06', 'dg07', 'tr05', 'tr06', 'so02') },
    exit_check: { question_ids: qs('dg01', 'dg03', 'dg05', 'dg07', 'tr01', 'tr02', 'so03'), pass: 0.7 } }),
  L('n5_u04_l7', { title: 'Listen and read', goal: 'Follow platform numbers and times by ear, and read a timetable.', introduces: {},
    explain: [{ heading: 'Numbers by ear', body: ['Platform numbers and times are announced fast. Listen for the number before ばんせん or じ.'], examples: [{ ja: 'ごばんせん', reading: 'gobansen', en: 'platform 5' }] }],
    practice: { question_ids: qs('gl05', 'gl06', 'gl07', 'gl08', 'gl09', 'gl10', 'gl11', 'gl12') },
    context: { question_ids: qs('rq01', 'rq02', 'rq03', 'rq04', 'rq05').concat(spiralIds.slice(0, 12)) },
    exit_check: { question_ids: qs('gl05', 'gl07', 'gl09', 'gl11', 'rq01', 'rq02', 'rq04'), pass: 0.7 } }),
  L('n5_u04_l8', { title: 'Review: units 1 to 4', goal: 'Mix words from the first four units.', introduces: {},
    explain: [{ heading: 'Keeping it fresh', body: ['Spaced review is how words stay in memory. This lesson revisits vocabulary from units 1 to 3 beside the new katakana and numbers.'], examples: [{ ja: 'いま さんじ です', reading: 'ima sanji desu', en: "It is 3 o'clock now." }] }],
    practice: { question_ids: spiralIds.slice(12, 28) },
    context: { question_ids: spiralIds.slice(28, 46) },
    exit_check: { question_ids: spiralIds.slice(0, 4).concat(spiralIds.slice(30, 34)), pass: 0.7 } }),
];

// ---------- Tokyo Station quest (QT_NAVIGATE): 10 items, 3+ from earlier units ----------
const quests = [{ id: 'q_tokyo_station_1', destination_id: 'tokyo_station', type: 'QT_NAVIGATE', unit_id: 'n5_u04', min_accuracy: 0.8, provenance: 'orig',
  question_ids: ['q_n5u04_dg01', 'q_n5u04_dg03', 'q_n5u04_dg05', 'q_n5u04_gl05', 'q_n5u04_gl01', 'q_n5u04_rq01', 'q_n5u04_rq02', 'q_n5u03_dg03', 'q_n5u02_dg04', 'q_n5u03_gl05'],
  spiral_question_ids: ['q_n5u03_dg03', 'q_n5u02_dg04', 'q_n5u03_gl05'] }];

export default { vocab, kanji, sentences, questions, listening, passages, lessons, dialogues, grammar, quests };
