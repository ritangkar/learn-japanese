// n4_u03 "Plain form and casual speech" - hand-written original content. Level tag: instructional N4 (unofficial).
// Grammar: the dictionary form, casual plain-style statements (including the plain negative) and the plain past (ta-form).
// Kanji scope: 光 神 森 池 近 遠 色 花. Scenario: a shrine town, talking with a friend.
import { kanaToRomaji, hasKanji } from '../../src/content/romaji.js';
import { unit, choices, countChars, meaningQuestions, kit, spiral } from '../../scripts/lib/author-helpers.mjs';
import { N5_SPIRAL_VOCAB } from '../../scripts/lib/spiral-pools.mjs';
import u01 from './n4_u01.mjs';
import u02 from './n4_u02.mjs';

const U = unit('n4_u03', 'N4');
const { vocab: V, sentence: S, question: Q, lesson: L, listening: LS, passage: PS, dialogue: DG, grammar: GR, kanji: KJ } = U;

// ---------- vocabulary ----------
const vocabL = {
  l1: [
    V('jinja', 'じんじゃ', 'じんじゃ', ['shrine'], 'noun', ['s_n4u03_k01']), V('ike', 'いけ', 'いけ', ['pond'], 'noun', ['s_n4u03_k02']), V('mori', 'もり', 'もり', ['forest', 'grove'], 'noun', ['s_n4u03_k03']),
    V('omamori', 'おまもり', 'おまもり', ['charm', 'amulet'], 'noun', ['s_n4u03_k05']), V('sandou', 'さんどう', 'さんどう', ['approach path (to a shrine)'], 'noun', ['s_n4u03_k06']),
    V('kamisama', 'かみさま', 'かみさま', ['god', 'deity'], 'noun', ['s_n4u03_k07']), V('hanami', 'はなみ', 'はなみ', ['flower viewing', 'cherry-blossom viewing'], 'noun', ['s_n4u03_k09']), V('hikari', 'ひかり', 'ひかり', ['light'], 'noun', ['s_n4u03_k10']),
  ],
  l2: [
    V('un', 'うん', 'うん', ['yeah', 'yes (casual)'], 'expression', ['s_n4u03_c03']), V('uun', 'ううん', 'ううん', ['no (casual)'], 'expression', ['s_n4u03_c04']), V('tabun', 'たぶん', 'たぶん', ['probably', 'maybe'], 'adverb', ['s_n4u03_c05']),
    V('mochiron', 'もちろん', 'もちろん', ['of course'], 'adverb', ['s_n4u03_c06']), V('yappari', 'やっぱり', 'やっぱり', ['as expected', 'after all'], 'adverb', ['s_n4u03_c07']),
    V('chikai', 'ちかい', 'ちかい', ['near', 'close'], 'i-adjective', ['s_n4u03_k11']), V('tooi', 'とおい', 'とおい', ['far'], 'i-adjective', ['s_n4u03_k12']), V('iro', 'いろ', 'いろ', ['colour', 'color'], 'noun', ['s_n4u03_k13']),
  ],
  l3: [
    V('ogamimasu', 'おがみます', 'おがみます', ['pray to', 'worship'], 'verb', ['s_n4u03_k07']), V('toorimasu', 'とおります', 'とおります', ['pass along', 'go through'], 'verb', ['s_n4u03_k06']),
    V('atsumarimasu', 'あつまります', 'あつまります', ['gather', 'come together'], 'verb', ['s_n4u03_k08']), V('oboemasu', 'おぼえます', 'おぼえます', ['remember', 'memorise'], 'verb', ['s_n4u03_k14']),
  ],
};
const vocab = Object.values(vocabL).flat();
for (const w of vocab) if (!hasKanji(w.surface)) { w.reading_kana = w.surface; w.romaji = kanaToRomaji(w.surface); }

// ---------- kanji ----------
const kanji = [
  KJ('k_n4_hikari', { char: '光', meanings_en: ['light'], on_readings: ['こう'], kun_readings: ['ひかり', 'ひか'], stroke_count: 6, example_word_ids: ['v_hikari'], tags: ['nature'] }),
  KJ('k_n4_kami', { char: '神', meanings_en: ['god', 'deity'], on_readings: ['しん', 'じん'], kun_readings: ['かみ'], stroke_count: 9, example_word_ids: ['v_kamisama', 'v_jinja'], tags: ['culture'] }),
  KJ('k_n4_mori', { char: '森', meanings_en: ['forest'], on_readings: ['しん'], kun_readings: ['もり'], stroke_count: 12, example_word_ids: ['v_mori'], tags: ['nature'] }),
  KJ('k_n4_ike', { char: '池', meanings_en: ['pond'], on_readings: ['ち'], kun_readings: ['いけ'], stroke_count: 6, example_word_ids: ['v_ike'], tags: ['nature'] }),
  KJ('k_n4_chika', { char: '近', meanings_en: ['near'], on_readings: ['きん'], kun_readings: ['ちか'], stroke_count: 7, example_word_ids: ['v_chikai'], confusable_with: ['k_n4_too'], tags: ['places'] }),
  KJ('k_n4_too', { char: '遠', meanings_en: ['far'], on_readings: ['えん'], kun_readings: ['とお'], stroke_count: 13, example_word_ids: ['v_tooi'], confusable_with: ['k_n4_chika'], tags: ['places'] }),
  KJ('k_n4_iro', { char: '色', meanings_en: ['colour'], on_readings: ['しょく'], kun_readings: ['いろ'], stroke_count: 6, example_word_ids: ['v_iro'], tags: ['nature'] }),
  KJ('k_n4_hana', { char: '花', meanings_en: ['flower'], on_readings: ['か'], kun_readings: ['はな'], stroke_count: 7, example_word_ids: ['v_hana', 'v_hanami'], tags: ['nature'] }),
];

// ---------- sentences ----------
const sn = (n, text, en, ids) => S(`s_n4u03_${n}`, 'sentence', text, text, en, ids);
const kj = (n, text, reading, en, ids, ruby) => S(`s_n4u03_${n}`, 'phrase', text, reading, en, ids, { ruby, kanji_used: [...text].filter((c) => /[一-龥]/.test(c)) });
const sentences = [
  sn('k01', 'ここ は じんじゃ です', 'This is a shrine.', ['v_koko', 'v_jinja']), sn('k02', 'じんじゃ の まえ に いけ が あります', 'There is a pond in front of the shrine.', ['v_jinja', 'v_mae', 'v_ike']),
  sn('k03', 'もり の なか を あるきます', 'We walk through the forest.', ['v_mori']), sn('k04', 'おみくじ を ひきます', 'I draw a fortune slip.', ['v_omikuji']),
  sn('k05', 'おまもり を かいます', 'I buy a charm.', ['v_omamori', 'v_kaimasu']), sn('k06', 'さんどう を とおります', 'We walk along the approach path.', ['v_sandou', 'v_toorimasu']),
  sn('k07', 'かみさま に おがみます', 'I pray to the god.', ['v_kamisama', 'v_ogamimasu']), sn('k08', 'ひと が あつまります', 'People gather.', ['v_atsumarimasu']),
  sn('k09', 'はなみ を します', 'We go flower viewing.', ['v_hanami']), sn('k10', 'ひかり が きれい です', 'The light is beautiful.', ['v_hikari']),
  sn('k11', 'ここ から じんじゃ は ちかい です', 'The shrine is near here.', ['v_koko', 'v_jinja', 'v_chikai']), sn('k12', 'いけ は とおい です', 'The pond is far.', ['v_ike', 'v_tooi']),
  sn('k13', 'この いろ は きれい です', 'This colour is beautiful.', ['v_kono', 'v_iro']), sn('k14', 'ことば を おぼえます', 'I memorise words.', ['v_oboemasu']),
  sn('c01', 'あした にっこう へ いく', 'I am going to Nikko tomorrow.', ['v_ashita']), sn('c02', 'いっしょに いく の', 'Are you coming along?', []),
  sn('c03', 'うん いく', 'Yeah, I will go.', ['v_un']), sn('c04', 'ううん いかない', 'No, I will not go.', ['v_uun']),
  sn('c05', 'たぶん あした は ゆき', 'It will probably snow tomorrow.', ['v_tabun', 'v_ashita']), sn('c06', 'もちろん いく', 'Of course I will go.', ['v_mochiron']),
  sn('c07', 'やっぱり いかない', 'After all, I will not go.', ['v_yappari']), sn('c08', 'おみくじ を ひく', 'I draw a fortune slip.', ['v_omikuji']),
  sn('c09', 'おまもり を かう', 'I buy a charm.', ['v_omamori']), sn('c10', 'さんどう を とおる', 'I walk along the approach path.', ['v_sandou']),
  sn('c11', 'かみさま に おがむ', 'I pray to the god.', ['v_kamisama']), sn('c12', 'みず を のまない', 'I do not drink water.', ['v_mizu']),
  sn('c13', 'くつ を ぬぐ', 'I take off my shoes.', ['v_kutsu']), sn('c14', 'ここ で まつ', 'I will wait here.', ['v_koko']),
  sn('t01', 'きのう にっこう へ いった', 'I went to Nikko yesterday.', ['v_kinou']), sn('t02', 'おみくじ を ひいた', 'I drew a fortune slip.', ['v_omikuji']),
  sn('t03', 'おまもり を かった', 'I bought a charm.', ['v_omamori']), sn('t04', 'もり を あるいた', 'I walked through the forest.', ['v_mori']),
  sn('t05', 'ともだち と おがんだ', 'I prayed with my friend.', ['v_tomodachi']), sn('t06', 'さんどう を とおった', 'I walked along the approach path.', ['v_sandou']),
  sn('t07', 'ひと が あつまった', 'People gathered.', []), sn('t08', 'くつ を ぬいだ', 'I took off my shoes.', ['v_kutsu']),
  sn('t09', 'なにも かわなかった', 'I did not buy anything.', []), sn('t10', 'きのう は あめ だった', 'It was rainy yesterday.', ['v_kinou']),
  sn('s01', 'にっこう の じんじゃ', 'A shrine in Nikko', ['v_jinja']), sn('s02', 'さんどう を あるいて ください', 'Please walk along the approach path.', ['v_sandou']),
  kj('n01', '光', 'ひかり', 'light', [], { 光: 'ひかり' }), kj('n02', '神', 'かみ', 'god', [], { 神: 'かみ' }), kj('n03', '森', 'もり', 'forest', [], { 森: 'もり' }), kj('n04', '池', 'いけ', 'pond', [], { 池: 'いけ' }),
  kj('n05', '近い', 'ちかい', 'near', [], { 近: 'ちか' }), kj('n06', '遠い', 'とおい', 'far', [], { 遠: 'とお' }), kj('n07', '色', 'いろ', 'colour', [], { 色: 'いろ' }), kj('n08', '花', 'はな', 'flower', [], { 花: 'はな' }),
];
const sentIdx = Object.fromEntries(sentences.map((s) => [s.id, s]));
const K = kit(Q, 'n4u03', sentIdx);

const questions = [];
const add = (...q) => questions.push(...q);
const JA = /[぀-ヿ一-鿿]/;
// Generic multiple-choice builder: the first choice is always the correct one.
const M = (id, type, stem, ch, note, wrong, targets, extra = {}) => Q(`q_n4u03_${id}`, type, { stem, choices: choices(ch.map(([i, t]) => [i, t, JA.test(t)])), answer: 'a', explanation_correct: note, explanation_per_distractor: wrong, facet: 'construct', targets, difficulty: 2, ...extra });
const opts = (...t) => t.map((x, i) => [['a', 'b', 'c', 'd'][i], x]);

// ---------- verb meanings ----------
const vb = (n, word, ans, others, vid) => Q(`q_n4u03_vb${n}`, 'mcq', { stem: { prompt: 'What does this verb mean?', ja: word }, choices: choices([['a', ans], ...others.map((o, i) => [`d${i + 1}`, o])]), answer: 'a', explanation_correct: `${word} = ${ans}.`, explanation_per_distractor: Object.fromEntries(others.map((o, i) => [`d${i + 1}`, 'That is a different verb.'])), facet: 'meaning', targets: [vid], difficulty: 1 });
add(vb('01', 'おがみます', 'pray to', ['gather', 'remember'], 'v_ogamimasu'), vb('02', 'とおります', 'pass along', ['pray to', 'gather'], 'v_toorimasu'), vb('03', 'あつまります', 'gather', ['pass along', 'remember'], 'v_atsumarimasu'), vb('04', 'おぼえます', 'remember', ['pray to', 'pass along'], 'v_oboemasu'));

// ---------- grammar: dictionary form ----------
const gq = { dict: [], plain: [], past: [] };
const G = (key, ...q) => { gq[key].push(...q.map((x) => x.id)); add(...q); };
const df = (n, base, ans, others, vid, note) => M(`df${n}`, 'mcq', { prompt: `What is the dictionary form of ${base}?`, ja: base }, opts(ans, ...others), note, Object.fromEntries(others.map((_, i) => [['b', 'c', 'd'][i], 'The ending does not match the verb group.'])), [vid, 'g_dict_form'], { difficulty: 2 });
G('dict',
  df('01', 'たべます', 'たべる', ['たべう', 'たべす'], 'v_tabemasu', 'Group 2: drop ます, add る.'), df('02', 'のみます', 'のむ', ['のる', 'のぶ'], 'v_nomimasu', 'Group 1: the ます-stem ends in み, so the ending is む.'),
  df('03', 'かいます', 'かう', ['かる', 'かす'], 'v_kaimasu', 'Group 1: い → う.'), df('04', 'します', 'する', ['しる', 'さる'], 'v_shimasu', 'Irregular: する.'),
  df('05', 'きます', 'くる', ['きる', 'こる'], 'v_kimasu', 'Irregular: くる.'), df('06', 'はなします', 'はなす', ['はなる', 'はなく'], 'v_hanashimasu', 'Group 1: し → す.'),
  df('07', 'いきます', 'いく', ['いす', 'いる'], 'v_ikimasu', 'Group 1: き → く.'), df('08', 'およぎます', 'およぐ', ['およく', 'およる'], 'v_oyogimasu', 'Group 1: ぎ → ぐ.'),
  K.tr('d1', 's_n4u03_c09', 'I buy a charm.', ['I bought a charm.', 'I do not buy a charm.'], 'かう is the dictionary form (plain present).', ['g_dict_form']),
  M('gd02', 'fill_blank', { prompt: 'Complete the dictionary form of おがみます (pray).', ja: 'かみさま に おが＿＿' }, opts('む', 'る', 'う'), 'おがみます → おがむ.', { b: 'る is the ending of group 2 verbs.', c: 'う is for verbs like かいます.' }, ['g_dict_form', 'v_ogamimasu', 'v_kamisama'], { source_sentence_id: 's_n4u03_c11' }),
  M('gd03', 'sentence_order', { prompt: 'Put the words in order: I walk along the approach path.' }, [], 'Object を verb.', {}, ['g_dict_form', 'v_sandou', 'v_toorimasu'], { tiles: ['とおる', 'さんどう', 'を'], answer: ['さんどう', 'を', 'とおる'], source_sentence_id: 's_n4u03_c10' }),
  M('gd04', 'error_correction', { prompt: 'One word is wrong for plain speech. What replaces ぬぎる?', ja: 'くつ を ぬぎる' }, opts('ぬぐ', 'ぬぎ', 'ぬげる'), 'ぬぎます → ぬぐ (ぎ → ぐ).', { b: 'ぬぎ is only the stem.', c: 'ぬげる is a different form.' }, ['g_dict_form', 'v_kutsu'], { source_sentence_id: 's_n4u03_c13', difficulty: 3 }),
  M('gd05', 'mcq', { prompt: 'Which verb is in the dictionary form?' }, opts('おまもり を かう', 'おまもり を かいます', 'おまもり を かった'), 'かう is the dictionary form.', { b: 'かいます is polite.', c: 'かった is the past.' }, ['g_dict_form', 'v_omamori'], { source_sentence_id: 's_n4u03_c09' }),
  M('gd06', 'dialogue_complete', { prompt: 'A asks casually: "Will you wait here?" B says yes and repeats the verb.', ja: 'ここ で まつ の' }, opts('うん まつ', 'うん まちます', 'ううん まつ'), 'Casual yes: うん + dictionary form.', { b: 'まちます is polite.', c: 'ううん means no.' }, ['g_dict_form', 'v_koko', 'v_un'], { source_sentence_id: 's_n4u03_c14' }));

// ---------- grammar: plain casual style ----------
G('plain',
  K.tr('p1', 's_n4u03_c04', 'No, I will not go.', ['Yeah, I will go.', 'No, I did not go.'], 'いかない is the plain negative; ううん means no.', ['g_plain_casual']),
  K.tr('p2', 's_n4u03_c06', 'Of course I will go.', ['I might go.', 'Of course I did not go.'], 'もちろん + dictionary form.', ['g_plain_casual']),
  M('pc03', 'fill_blank', { prompt: 'Complete the plain negative: I do not drink water.', ja: 'みず を のま＿＿' }, opts('ない', 'ます', 'ません'), 'ない-form is the plain negative.', { b: 'ます is polite affirmative.', c: 'ません is polite negative.' }, ['g_plain_casual', 'v_mizu', 'v_nomimasu'], { source_sentence_id: 's_n4u03_c12' }),
  M('pc04', 'mcq', { prompt: 'Which sentence is in casual (plain) style?' }, opts('おまもり を かわない', 'おまもり を かいません', 'おまもり を かいます'), 'Casual speech uses plain forms: かわない.', { b: 'かいません is polite.', c: 'かいます is polite.' }, ['g_plain_casual', 'v_omamori'], { difficulty: 1 }),
  M('pc05', 'mcq', { prompt: 'What is the plain negative of いきます?' }, opts('いかない', 'いきない', 'いくない'), 'Group 1: き → か + ない.', { b: 'The last sound must change.', c: 'くない is for い-adjectives.' }, ['g_plain_casual', 'v_ikimasu']),
  M('pc06', 'dialogue_complete', { prompt: 'A asks casually: "Are you coming along?" B declines.', ja: 'いっしょに いく の' }, opts('ううん いかない', 'うん いかない', 'ううん いく'), 'ううん = no; いかない = will not go.', { b: 'うん means yes, so it clashes with いかない.', c: 'ううん いく contradicts itself.' }, ['g_plain_casual', 'v_uun'], { source_sentence_id: 's_n4u03_c02' }),
  M('pc07', 'sentence_order', { prompt: 'Put the words in order: I am going to Nikko tomorrow.' }, [], 'Time, place へ, verb.', {}, ['g_plain_casual', 'v_ashita'], { tiles: ['いく', 'あした', 'へ', 'にっこう'], answer: ['あした', 'にっこう', 'へ', 'いく'], source_sentence_id: 's_n4u03_c01' }),
  M('pc08', 'mcq', { prompt: 'Which word means "of course"?' }, opts('もちろん', 'たぶん', 'やっぱり'), 'もちろん = of course.', { b: 'たぶん = probably.', c: 'やっぱり = after all.' }, ['g_plain_casual', 'v_mochiron'], { facet: 'meaning', difficulty: 1 }),
  M('pc09', 'error_correction', { prompt: 'One word makes this casual sentence sound polite. What replaces いきません?', ja: 'ううん いきません' }, opts('いかない', 'いきない', 'いくない'), 'In casual speech use the plain negative: いかない.', { b: 'The stem must change.', c: 'くない is for い-adjectives.' }, ['g_plain_casual', 'v_ikimasu'], { difficulty: 3 }));

// ---------- grammar: plain past ----------
const ta = (n, base, ans, others, vid, note) => M(`ta${n}`, 'mcq', { prompt: `What is the plain past (ta-form) of ${base}?`, ja: base }, opts(ans, ...others), note, Object.fromEntries(others.map((_, i) => [['b', 'c', 'd'][i], 'Check the te-form: た replaces て, だ replaces で.'])), [vid, 'g_ta_form'], { difficulty: 2 });
G('past',
  ta('01', 'のみます', 'のんだ', ['のみた', 'のった'], 'v_nomimasu', 'のんで → のんだ.'), ta('02', 'いきます', 'いった', ['いきた', 'いんだ'], 'v_ikimasu', 'いって → いった.'),
  ta('03', 'かいます', 'かった', ['かいた', 'かんだ'], 'v_kaimasu', 'かって → かった.'), ta('04', 'たべます', 'たべた', ['たべった', 'たべんだ'], 'v_tabemasu', 'Group 2: stem + た.'),
  ta('05', 'します', 'した', ['しった', 'しんだ'], 'v_shimasu', 'Irregular: した.'), ta('06', 'およぎます', 'およいだ', ['およいた', 'およんだ'], 'v_oyogimasu', 'およいで → およいだ.'),
  ta('07', 'きます', 'きた', ['くた', 'きった'], 'v_kimasu', 'Irregular: きた.'), ta('08', 'はなします', 'はなした', ['はなった', 'はなしだ'], 'v_hanashimasu', 'はなして → はなした.'),
  K.tr('t1', 's_n4u03_t01', 'I went to Nikko yesterday.', ['I am going to Nikko tomorrow.', 'I did not go to Nikko yesterday.'], 'いった is the plain past of いく.', ['g_ta_form']),
  M('ta10', 'fill_blank', { prompt: 'Complete the plain past: I bought a charm.', ja: 'おまもり を か＿＿' }, opts('った', 'いた', 'んだ'), 'かう → かって → かった.', { b: 'いた is used after く verbs.', c: 'んだ is used after む verbs.' }, ['g_ta_form', 'v_omamori'], { source_sentence_id: 's_n4u03_t03' }),
  M('ta11', 'sentence_order', { prompt: 'Put the words in order: I took off my shoes.' }, [], 'Object を verb-た.', {}, ['g_ta_form', 'v_kutsu'], { tiles: ['ぬいだ', 'くつ', 'を'], answer: ['くつ', 'を', 'ぬいだ'], source_sentence_id: 's_n4u03_t08' }),
  M('ta12', 'error_correction', { prompt: 'The sentence should be past. What replaces あるく?', ja: 'きのう もり を あるく' }, opts('あるいた', 'あるいで', 'あるった'), 'あるいて → あるいた.', { b: 'で is used after ぐ, ぬ, ぶ, む verbs.', c: 'った is used after う, つ, る verbs.' }, ['g_ta_form', 'v_mori', 'v_kinou'], { source_sentence_id: 's_n4u03_t04', difficulty: 3 }),
  M('ta13', 'dialogue_complete', { prompt: 'A asks casually: "Did you go to Nikko yesterday?" B says yes.', ja: 'きのう にっこう へ いった の' }, opts('うん いった', 'うん いく', 'ううん いった'), 'うん + plain past.', { b: 'いく is the present.', c: 'ううん means no.' }, ['g_ta_form', 'v_un', 'v_kinou'], { source_sentence_id: 's_n4u03_t01' }),
  K.tr('t2', 's_n4u03_t09', 'I did not buy anything.', ['I bought nothing yesterday only.', 'I will not buy anything.'], 'かわなかった is the plain negative past (ない → なかった).', ['g_ta_form']),
  M('ta15', 'mcq', { prompt: 'What is the plain negative past of かいます?' }, opts('かわなかった', 'かわなかった です', 'かいなかった'), 'ない-form → なかった.', { b: 'です is not added in casual speech here.', c: 'Group 1 い becomes わ first.' }, ['g_ta_form', 'v_kaimasu'], { difficulty: 3 }));
add(Q('q_n4u03_mt01', 'matching', { stem: { prompt: 'Match each polite verb with its plain past (ta-form).' }, pairs: [['のみます', 'のんだ'], ['いきます', 'いった'], ['かいます', 'かった'], ['します', 'した'], ['きます', 'きた'], ['およぎます', 'およいだ']], answer: ['のみます', 'いきます', 'かいます', 'します', 'きます', 'およぎます'], explanation_correct: 'The ta-form follows the same sound changes as the te-form.', facet: 'construct', targets: ['g_ta_form', 'v_nomimasu', 'v_ikimasu', 'v_kaimasu', 'v_shimasu', 'v_kimasu', 'v_oyogimasu'], difficulty: 2 }));

const grammar = [
  GR('g_dict_form', { title: 'The dictionary form', pattern: 'verb dictionary form (る / う / く / ぐ / す / つ / ぬ / ぶ / む)', meaning_en: 'The plain present form listed in dictionaries.', explanation: ['Group 2 (る-verbs): drop ます, add る: たべます → たべる.', 'Group 1: change the last sound of the ます-stem to the う-row: のみます → のむ, かいます → かう, はなします → はなす, いきます → いく, およぎます → およぐ.', 'Irregular: します → する, きます → くる. In casual speech the dictionary form is the plain present: おまもり を かう.'], structure_notes: 'Stem change to the う-row.', examples: ['s_n4u03_c08', 's_n4u03_c09', 's_n4u03_c10', 's_n4u03_c11'], common_mistakes: ['Keeping the ます-stem (ぬぎ instead of ぬぐ).'], contrast_with: ['g_plain_casual'], practice_question_ids: gq.dict, register: 'casual', tags: ['plain form'] }),
  GR('g_plain_casual', { title: 'Casual plain style', pattern: 'plain present / plain negative; うん / ううん', meaning_en: 'How friends talk: plain forms instead of ます / ません.', explanation: ['Between friends the polite ます / ません are replaced by the dictionary form and the ない-form: いきます → いく, いきません → いかない.', 'A rising tone or の at the end marks a question: いっしょに いく の. Answer with うん (yes) or ううん (no).', 'Use plain style with friends and family only. In unfamiliar situations the polite style is safer.'], structure_notes: 'Plain form; sentence-final の for questions.', examples: ['s_n4u03_c01', 's_n4u03_c03', 's_n4u03_c04', 's_n4u03_c06', 's_n4u03_c07'], common_mistakes: ['Mixing ません with a casual うん.'], contrast_with: ['g_dict_form'], practice_question_ids: gq.plain, register: 'casual', tags: ['plain form'] }),
  GR('g_ta_form', { title: 'The plain past (ta-form)', pattern: 'verb-た; verb-なかった', meaning_en: 'Did / did not (plain).', explanation: ['Take the te-form and replace て with た and で with だ: かって → かった, のんで → のんだ, いって → いった, およいで → およいだ.', 'Irregular: した, きた. The plain negative past replaces ない with なかった: かわなかった.', 'Use the ta-form with friends: きのう にっこう へ いった.'], structure_notes: 'te-form → ta-form.', examples: ['s_n4u03_t01', 's_n4u03_t02', 's_n4u03_t03', 's_n4u03_t04', 's_n4u03_t09'], common_mistakes: ['Using った after む verbs (のんだ, not のった).'], contrast_with: ['g_dict_form'], practice_question_ids: gq.past, register: 'casual', tags: ['plain form'] }),
];

// ---------- kanji ----------
add(K.kd('01', '光', 'light', ['shade', 'fire'], 'k_n4_hikari', ['v_hikari'], '光 = light.'), K.kd('02', '神', 'god', ['mountain', 'water'], 'k_n4_kami', ['v_kamisama'], '神 = god.'), K.kd('03', '森', 'forest', ['tree', 'river'], 'k_n4_mori', ['v_mori'], '森 = forest.'), K.kd('04', '池', 'pond', ['river', 'sea'], 'k_n4_ike', ['v_ike'], '池 = pond.'),
  K.kd('05', '近', 'near', ['far', 'wide'], 'k_n4_chika', ['v_chikai'], '近 = near.'), K.kd('06', '遠', 'far', ['near', 'tall'], 'k_n4_too', ['v_tooi'], '遠 = far.'), K.kd('07', '色', 'colour', ['light', 'shape'], 'k_n4_iro', ['v_iro'], '色 = colour.'), K.kd('08', '花', 'flower', ['grass', 'leaf'], 'k_n4_hana', ['v_hana'], '花 = flower.'));
add(K.kk('01', '光', 'hikari', ['hoshi', 'hana'], 'k_n4_hikari', 'v_hikari', '光 = ひかり.'), K.kk('02', '神', 'kami', ['mori', 'iro'], 'k_n4_kami', 'v_kamisama', '神 = かみ.'), K.kk('03', '森', 'mori', ['ike', 'hana'], 'k_n4_mori', 'v_mori', '森 = もり.'), K.kk('04', '池', 'ike', ['mori', 'iro'], 'k_n4_ike', 'v_ike', '池 = いけ.'),
  K.kk('05', '近い', 'chikai', ['tooi', 'takai'], 'k_n4_chika', 'v_chikai', '近い = ちかい.'), K.kk('06', '遠い', 'tooi', ['chikai', 'ooi'], 'k_n4_too', 'v_tooi', '遠い = とおい.'), K.kk('07', '色', 'iro', ['ike', 'kami'], 'k_n4_iro', 'v_iro', '色 = いろ.'), K.kk('08', '花', 'hana', ['hikari', 'mori'], 'k_n4_hana', 'v_hana', '花 = はな.'));
add(Q('q_n4u03_kmt01', 'matching', { stem: { prompt: 'Match each kanji with its meaning.' }, pairs: [['光', 'light'], ['神', 'god'], ['森', 'forest'], ['池', 'pond'], ['色', 'colour'], ['花', 'flower']], answer: ['光', '神', '森', '池', '色', '花'], explanation_correct: 'Kanji for a shrine garden.', facet: 'meaning', targets: ['k_n4_hikari', 'k_n4_kami', 'k_n4_mori', 'k_n4_ike', 'k_n4_iro', 'k_n4_hana'], difficulty: 2 }),
  Q('q_n4u03_kcf01', 'mcq', { stem: { prompt: 'Which kanji is "near" (not "far")?' }, choices: choices([['a', '近'], ['b', '遠'], ['c', '山']]), answer: 'a', explanation_correct: '近 = near; 遠 = far.', explanation_per_distractor: { b: '遠 is far.', c: '山 is mountain.' }, facet: 'read', targets: ['k_n4_chika', 'k_n4_too'], difficulty: 3 }),
  Q('q_n4u03_kcf02', 'mcq', { stem: { prompt: 'Which kanji is "pond" (not "river")?' }, choices: choices([['a', '池'], ['b', '川'], ['c', '山']]), answer: 'a', explanation_correct: '池 = pond; 川 = river.', explanation_per_distractor: { b: '川 is river.', c: '山 is mountain.' }, facet: 'read', targets: ['k_n4_ike'], difficulty: 3 }));

// ---------- typing, dictation, listening ----------
add(K.ty('01', 'shrine', 'じんじゃ', 'v_jinja'), K.ty('02', 'pond', 'いけ', 'v_ike'), K.ty('03', 'charm', 'おまもり', 'v_omamori'), K.ty('04', 'of course', 'もちろん', 'v_mochiron'), K.ty('05', 'probably', 'たぶん', 'v_tabun'), K.ty('06', 'light', 'ひかり', 'v_hikari'));
add(K.dc('01', 'じんじゃ', 'v_jinja', 'じんじゃ = shrine.'), K.dc('02', 'おまもり', 'v_omamori', 'おまもり = charm.'), K.dc('03', 'やっぱり', 'v_yappari', 'やっぱり = after all.'));
add(K.gl('01', 'n4u03_ls1', 'あした にっこう へ いく', ['あした にっこう へ いった', 'あした にっこう へ いかない'], 'v_ashita', 'You heard the plain present: いく.'), K.gl('02', 'n4u03_ls1', 'ううん いかない', ['うん いく', 'ううん いった'], 'v_uun', 'You heard ううん + plain negative.'),
  K.gl('03', 'n4u03_ls1', 'おまもり を かう', ['おまもり を かった', 'おまもり を かわない'], 'v_omamori', 'You heard the dictionary form: かう.'), K.gl('04', 'n4u03_ls1', 'さんどう を とおる', ['さんどう を とおった', 'さんどう を とおらない'], 'v_sandou', 'You heard the dictionary form: とおる.'),
  K.gl('05', 'n4u03_ls2', 'きのう にっこう へ いった', ['きのう にっこう へ いく', 'きのう にっこう へ いかない'], 'v_kinou', 'You heard the plain past: いった.'), K.gl('06', 'n4u03_ls2', 'おまもり を かった', ['おまもり を かう', 'おまもり を かわなかった'], 'v_omamori', 'You heard かった (past, affirmative).'),
  K.gl('07', 'n4u03_ls2', 'くつ を ぬいだ', ['くつ を ぬぐ', 'くつ を ぬがなかった'], 'v_kutsu', 'You heard ぬいだ (past).'), K.gl('08', 'n4u03_ls2', 'ひと が あつまった', ['ひと が あつまる', 'ひと が あつまらない'], 'v_atsumarimasu', 'You heard あつまった (past).'));
const listening = [
  LS('n4u03_ls1', { item_type: 'Verbal expressions (lesson practice)', title: 'Casual present', script_turns: ['あした にっこう へ いく', 'ううん いかない', 'おまもり を かう', 'さんどう を とおる'].map((t) => ({ speaker: 'A', text_ja: t })), question_ids: ['q_n4u03_gl01', 'q_n4u03_gl02', 'q_n4u03_gl03', 'q_n4u03_gl04'] }),
  LS('n4u03_ls2', { item_type: 'Verbal expressions (lesson practice)', title: 'Casual past', script_turns: ['きのう にっこう へ いった', 'おまもり を かった', 'くつ を ぬいだ', 'ひと が あつまった'].map((t) => ({ speaker: 'A', text_ja: t })), question_ids: ['q_n4u03_gl05', 'q_n4u03_gl06', 'q_n4u03_gl07', 'q_n4u03_gl08'] }),
];

// ---------- dialogues ----------
const dialogues = [
  DG('n4u03_d1', { title: 'Going together', setting: 'nikko', turns: [{ speaker: 'A', sentence_id: 's_n4u03_c02' }, { speaker: 'B', sentence_id: 's_n4u03_c03' }, { speaker: 'A', sentence_id: 's_n4u03_c01' }], comprehension_question_ids: ['q_n4u03_dg01', 'q_n4u03_dg02'], register: 'casual' }),
  DG('n4u03_d2', { title: 'Not today', setting: 'nikko', turns: [{ speaker: 'A', sentence_id: 's_n4u03_c02' }, { speaker: 'B', sentence_id: 's_n4u03_c04' }], comprehension_question_ids: ['q_n4u03_dg03'], register: 'casual' }),
  DG('n4u03_d3', { title: 'Fortune and charm', setting: 'nikko', turns: [{ speaker: 'A', sentence_id: 's_n4u03_t02' }, { speaker: 'B', sentence_id: 's_n4u03_t03' }], comprehension_question_ids: ['q_n4u03_dg04'], register: 'casual' }),
  DG('n4u03_d4', { title: 'Wait here', setting: 'nikko', turns: [{ speaker: 'A', sentence_id: 's_n4u03_c14' }, { speaker: 'B', sentence_id: 's_n4u03_c06' }], comprehension_question_ids: ['q_n4u03_dg05'], register: 'casual' }),
];
add(K.dg('01', 'n4u03_d1', 'What does B say to A?', [['a', 'Yes, I will go'], ['b', 'No, I will not go'], ['c', 'I went yesterday']], 'a', 'うん いく.', ['v_un']), K.dg('02', 'n4u03_d1', 'Where is A going tomorrow?', [['a', 'Nikko'], ['b', 'Tokyo'], ['c', 'Hakone']], 'a', 'にっこう へ いく.', ['v_ashita']),
  K.dg('03', 'n4u03_d2', 'What does B say?', [['a', 'No, I will not go'], ['b', 'Yes, I will go'], ['c', 'Of course I will go']], 'a', 'ううん いかない.', ['v_uun']), K.dg('04', 'n4u03_d3', 'What did B buy?', [['a', 'A charm'], ['b', 'A fortune slip'], ['c', 'Flowers']], 'a', 'おまもり を かった.', ['v_omamori']),
  K.dg('05', 'n4u03_d4', 'What will A do?', [['a', 'Wait here'], ['b', 'Go home'], ['c', 'Take photos']], 'a', 'ここ で まつ.', ['v_koko']));

// ---------- reading ----------
const r1 = ['にっこう の じんじゃ', 'さんどう を あるいて ください', 'もり の なか に いけ が あります', 'ここ で おみくじ を ひいても いいです', 'おまもり は あそこ で かいます'];
const r2 = ['きのう にっこう へ いった', 'もり を あるいた', 'いけ の まえ で おみくじ を ひいた', 'おまもり を かった', 'かみさま に おがんだ'];
const passages = [
  PS('n4u03_r1', { title: 'Shrine guide', paragraphs: r1, translation_en: 'A shrine in Nikko / Please walk along the approach path. / There is a pond in the forest. / You may draw a fortune slip here. / Charms are bought over there.', word_count_chars: countChars(r1), question_ids: ['q_n4u03_rq01', 'q_n4u03_rq02', 'q_n4u03_rq03', 'q_n4u03_rq04'], genre: 'signs' }),
  PS('n4u03_r2', { title: 'A short diary', paragraphs: r2, translation_en: 'I went to Nikko yesterday. / I walked through the forest. / I drew a fortune slip in front of the pond. / I bought a charm. / I prayed to the god.', word_count_chars: countChars(r2), question_ids: ['q_n4u03_rq05', 'q_n4u03_rq06', 'q_n4u03_rq07'], genre: 'diary' }),
];
add(K.rq('01', 'n4u03_r1', 'What may visitors do here?', [['a', 'Draw a fortune slip'], ['b', 'Buy a charm'], ['c', 'Take photos']], 'a', 'おみくじ を ひいても いいです.', ['v_omikuji'], 'information_retrieval'), K.rq('02', 'n4u03_r1', 'Where is the pond?', [['a', 'In the forest'], ['b', 'By the gate'], ['c', 'Over there']], 'a', 'もり の なか に いけ.', ['v_ike', 'v_mori'], 'information_retrieval'),
  K.rq('03', 'n4u03_r1', 'Where are charms bought?', [['a', 'Over there'], ['b', 'Here'], ['c', 'At the pond']], 'a', 'おまもり は あそこ で かいます.', ['v_omamori', 'v_asoko'], 'information_retrieval'), K.rq('04', 'n4u03_r1', 'What should visitors do on the approach path?', [['a', 'Walk along it'], ['b', 'Run along it'], ['c', 'Wait on it']], 'a', 'さんどう を あるいて ください.', ['v_sandou'], 'information_retrieval'),
  K.rq('05', 'n4u03_r2', 'Where did the writer go yesterday?', [['a', 'Nikko'], ['b', 'Kamakura'], ['c', 'Hakone']], 'a', 'きのう にっこう へ いった.', ['v_kinou'], 'information_retrieval'), K.rq('06', 'n4u03_r2', 'What did the writer buy?', [['a', 'A charm'], ['b', 'A fortune slip'], ['c', 'A book']], 'a', 'おまもり を かった.', ['v_omamori'], 'information_retrieval'),
  K.rq('07', 'n4u03_r2', 'Where did the writer draw a fortune slip?', [['a', 'In front of the pond'], ['b', 'In the forest'], ['c', 'At the gate']], 'a', 'いけ の まえ で おみくじ を ひいた.', ['v_ike', 'v_mae', 'v_omikuji'], 'information_retrieval'));

// ---------- translate / meaning / spiral ----------
add(K.tr('01', 's_n4u03_c03', 'Yeah, I will go.', ['No, I will not go.', 'Yeah, I went.'], 'うん = yes (casual).'), K.tr('02', 's_n4u03_c06', 'Of course I will go.', ['I might go.', 'I will not go.'], 'もちろん = of course.'), K.tr('03', 's_n4u03_c07', 'After all, I will not go.', ['After all, I will go.', 'Of course I will go.'], 'やっぱり = after all.'),
  K.tr('04', 's_n4u03_c05', 'It will probably snow tomorrow.', ['It snowed yesterday.', 'It will certainly snow tomorrow.'], 'たぶん = probably.'), K.tr('05', 's_n4u03_k11', 'The shrine is near here.', ['The shrine is far from here.', 'The shrine is here.'], 'ちかい = near.'),
  K.tr('06', 's_n4u03_k12', 'The pond is far.', ['The pond is near.', 'The pond is big.'], 'とおい = far.'), K.tr('07', 's_n4u03_k13', 'This colour is beautiful.', ['This flower is beautiful.', 'This light is beautiful.'], 'いろ = colour.'));
add(...meaningQuestions(Q, vocab.filter((w) => w.pos !== 'verb'), vocab.filter((w) => w.pos !== 'verb'), 1));
add(...spiral(Q, 'n4u03', [...N5_SPIRAL_VOCAB, ...u01.vocab.filter((w) => w.pos !== 'conjunction'), ...u02.vocab], { rem: 3, step: 6, n: 70, mod: 11 }));

// ---------- lessons ----------
const ids = (arr) => arr.map((x) => x.id);
const qs = (...x) => x.map((n) => `q_n4u03_${n}`);
const vmq = (arr) => arr.filter((w) => w.pos !== 'verb').map((x) => `q_n4u03_vm_${x.id.slice(2)}`);
const spiralIds = questions.filter((q) => q.id.startsWith('q_n4u03_sr_')).map((q) => q.id);
const lessons = [
  L('n4_u03_l1', { title: 'At the shrine', goal: 'Name what you see at a shrine.', introduces: { vocab: ids(vocabL.l1) },
    explain: [{ heading: 'Shrine words', body: ['じんじゃ (shrine), いけ (pond), もり (forest), おまもり (charm), さんどう (approach path), かみさま (god), はなみ (flower viewing), ひかり (light).'], examples: [{ ja: 'ここ は じんじゃ です', reading: 'koko wa jinja desu', en: 'This is a shrine.' }] }],
    practice: { question_ids: qs('ty01', 'ty02', 'ty03', 'ty06', 'dc01', 'dc02').concat(vmq(vocabL.l1)) },
    exit_check: { question_ids: qs('ty01', 'ty02', 'ty03', 'dc01'), pass: 0.7 } }),
  L('n4_u03_l2', { title: 'Casual words and near / far', goal: 'Use casual answers and describe distance.', introduces: { vocab: ids(vocabL.l2) },
    explain: [{ heading: 'Friends\' words', body: ['うん (yes), ううん (no), たぶん (probably), もちろん (of course), やっぱり (after all). Also ちかい (near), とおい (far), いろ (colour).'], examples: [{ ja: 'もちろん いく', reading: 'mochiron iku', en: 'Of course I will go.' }] }],
    practice: { question_ids: qs('ty04', 'ty05', 'dc03', 'tr01', 'tr02', 'tr03', 'tr04', 'tr05', 'tr06', 'tr07').concat(vmq(vocabL.l2)) },
    exit_check: { question_ids: qs('ty04', 'ty05', 'dc03', 'tr01', 'tr05'), pass: 0.7 } }),
  L('n4_u03_l3', { title: 'Verbs at the shrine', goal: 'Learn four verbs for a visit.', introduces: { vocab: ids(vocabL.l3) },
    explain: [{ heading: 'Four verbs', body: ['おがみます (pray to), とおります (pass along), あつまります (gather), おぼえます (remember).'], examples: [{ ja: 'かみさま に おがみます', reading: 'kamisama ni ogamimasu', en: 'I pray to the god.' }] }],
    practice: { question_ids: qs('vb01', 'vb02', 'vb03', 'vb04') }, exit_check: { question_ids: qs('vb01', 'vb02', 'vb03', 'vb04'), pass: 0.7 } }),
  L('n4_u03_l4', { title: 'The dictionary form', goal: 'Make and recognise the dictionary form.', introduces: { grammar: ['g_dict_form'] },
    explain: [{ heading: 'Rules', body: ['Group 2: drop ます, add る. Group 1: change the last sound of the ます-stem to the う-row (み → む, い → う, し → す, き → く, ぎ → ぐ). Irregular: する, くる.'], examples: [{ ja: 'のみます → のむ', reading: 'nomimasu → nomu', en: 'drink (polite → plain)' }] }],
    practice: { question_ids: qs('df01', 'df02', 'df03', 'df04', 'df05', 'df06', 'df07', 'df08', 'trd1', 'gd02', 'gd03', 'gd04', 'gd05', 'gd06') },
    exit_check: { question_ids: qs('df01', 'df02', 'df03', 'df05', 'df08', 'trd1', 'gd02'), pass: 0.7 } }),
  L('n4_u03_l5', { title: 'Casual plain style', goal: 'Talk to a friend with plain forms.', introduces: { grammar: ['g_plain_casual'] },
    explain: [{ heading: 'Friends talk', body: ['Plain forms replace ます / ません: いく, いかない. Add の for a question and answer with うん / ううん.'], examples: [{ ja: 'ううん いかない', reading: 'uun ikanai', en: 'No, I will not go.' }] }],
    practice: { question_ids: qs('trp1', 'trp2', 'pc03', 'pc04', 'pc05', 'pc06', 'pc07', 'pc08', 'pc09', 'gl01', 'gl02', 'gl03', 'gl04') },
    exit_check: { question_ids: qs('trp1', 'pc03', 'pc04', 'pc05', 'pc06', 'gl02'), pass: 0.7 } }),
  L('n4_u03_l6', { title: 'The plain past', goal: 'Say what you did, in plain style.', introduces: { grammar: ['g_ta_form'] },
    explain: [{ heading: 'ta-form', body: ['Replace て with た and で with だ in the te-form: かった, のんだ, いった, およいだ. Plain negative past: かわなかった.'], examples: [{ ja: 'きのう にっこう へ いった', reading: 'kinou nikkou e itta', en: 'I went to Nikko yesterday.' }] }],
    practice: { question_ids: qs('ta01', 'ta02', 'ta03', 'ta04', 'ta05', 'ta06', 'ta07', 'ta08', 'trt1', 'ta10', 'ta11', 'ta12', 'ta13', 'trt2', 'ta15', 'mt01', 'gl05', 'gl06', 'gl07', 'gl08') },
    exit_check: { question_ids: qs('ta01', 'ta02', 'ta03', 'ta05', 'trt1', 'ta10', 'mt01', 'gl05'), pass: 0.7 } }),
  L('n4_u03_l7', { title: 'Kanji: 光 神 森 池 近 遠 色 花', goal: 'Read eight kanji for a shrine garden.', introduces: { kanji: ids(kanji) },
    explain: [{ heading: 'Garden kanji', body: ['光 (light), 神 (god), 森 (forest), 池 (pond), 近い (near), 遠い (far), 色 (colour), 花 (flower). 近 and 遠 are a pair of opposites.'], examples: [{ ja: '近い', reading: 'chikai', en: 'near' }, { ja: '遠い', reading: 'tooi', en: 'far' }] }],
    practice: { question_ids: qs('kd01', 'kd02', 'kd03', 'kd04', 'kd05', 'kd06', 'kd07', 'kd08', 'kk01', 'kk02', 'kk03', 'kk04', 'kk05', 'kk06', 'kk07', 'kk08', 'kmt01', 'kcf01', 'kcf02') },
    exit_check: { question_ids: qs('kd01', 'kd02', 'kd03', 'kd05', 'kk04', 'kk05', 'kk06', 'kmt01'), pass: 0.7 } }),
  L('n4_u03_l8', { title: 'Dialogues and a shrine guide', goal: 'Follow casual conversations and read a short guide.', introduces: {},
    explain: [{ heading: 'In Nikko', body: ['Listen for うん / ううん and plain verb endings; read the guide for what you may do.'], examples: [{ ja: 'いっしょに いく の', reading: 'issho ni iku no', en: 'Are you coming along?' }] }],
    practice: { question_ids: qs('dg01', 'dg02', 'dg03', 'dg04', 'dg05') }, context: { question_ids: qs('rq01', 'rq02', 'rq03', 'rq04', 'rq05', 'rq06', 'rq07') },
    exit_check: { question_ids: qs('dg01', 'dg03', 'dg05', 'rq01', 'rq05'), pass: 0.7 } }),
  L('n4_u03_l9', { title: 'Review: earlier words in plain style', goal: 'Revisit earlier vocabulary.', introduces: {},
    explain: [{ heading: 'Review', body: ['Earlier words return to keep them fresh.'], examples: [{ ja: 'おまもり を かった', reading: 'omamori o katta', en: 'I bought a charm.' }] }],
    practice: { question_ids: spiralIds.slice(0, 20) }, context: { question_ids: spiralIds.slice(20, 44) },
    exit_check: { question_ids: spiralIds.slice(0, 5).concat(spiralIds.slice(44, 48)), pass: 0.7 } }),
];

// ---------- Nikko quest (QT_PASSAGE): 10 items, 3 from earlier units ----------
const quests = [{ id: 'q_nikko_1', destination_id: 'nikko', type: 'QT_PASSAGE', unit_id: 'n4_u03', min_accuracy: 0.8, provenance: 'orig',
  question_ids: ['q_n4u03_rq01', 'q_n4u03_rq02', 'q_n4u03_rq03', 'q_n4u03_rq04', 'q_n4u03_rq05', 'q_n4u03_rq06', 'q_n4u03_rq07', 'q_n4u02_rq01', 'q_n4u02_rq04', 'q_n4u02_rq05'],
  spiral_question_ids: ['q_n4u02_rq01', 'q_n4u02_rq04', 'q_n4u02_rq05'] }];

export default { vocab, kanji, sentences, questions, listening, passages, lessons, dialogues, grammar, quests };
