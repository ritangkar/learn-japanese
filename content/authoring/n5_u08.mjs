// n5_u08 "Daily actions" - hand-written original content.
// Grammar: polite present verbs (ます / ません), を (object), で (place of action / means), へ (direction), に (time and meeting).
// Kanji scope: 食 飲 見 行 来 読 書 話 買 聞. Scenario: a temple-town walk with snack stalls.
import { kanaToRomaji, hasKanji } from '../../src/content/romaji.js';
import { unit, choices, countChars, meaningQuestions, kit, spiral, SPIRAL_EXCLUDE } from '../../scripts/lib/author-helpers.mjs';
import u01 from './n5_u01.mjs';
import u02 from './n5_u02.mjs';
import u03 from './n5_u03.mjs';
import u04 from './n5_u04.mjs';
import u05 from './n5_u05.mjs';
import u06 from './n5_u06.mjs';
import u07 from './n5_u07.mjs';

const U = unit('n5_u08');
const { vocab: V, sentence: S, question: Q, lesson: L, listening: LS, passage: PS, dialogue: DG, grammar: GR, kanji: KJ } = U;

// ---------- vocabulary ----------
const vocabL = {
  l1: [
    V('tabemasu', 'たべます', 'たべます', ['eat'], 'verb', ['s_n5u08_k01', 's_n5u08_k19']),
    V('nomimasu', 'のみます', 'のみます', ['drink'], 'verb', ['s_n5u08_k02']),
    V('mimasu', 'みます', 'みます', ['see', 'watch', 'look at'], 'verb', ['s_n5u08_k03', 's_n5u08_k25']),
    V('kikimasu', 'ききます', 'ききます', ['listen', 'hear', 'ask'], 'verb', ['s_n5u08_k04']),
    V('yomimasu', 'よみます', 'よみます', ['read'], 'verb', ['s_n5u08_k05']),
    V('kakimasu', 'かきます', 'かきます', ['write'], 'verb', ['s_n5u08_k06']),
  ],
  l2: [
    V('ikimasu', 'いきます', 'いきます', ['go'], 'verb', ['s_n5u08_k07', 's_n5u08_k17']),
    V('kimasu', 'きます', 'きます', ['come'], 'verb', ['s_n5u08_k08']),
    V('kaerimasu', 'かえります', 'かえります', ['return', 'go home'], 'verb', ['s_n5u08_k09', 's_n5u08_k18']),
    V('kaimasu', 'かいます', 'かいます', ['buy'], 'verb', ['s_n5u08_k10']),
    V('hanashimasu', 'はなします', 'はなします', ['speak', 'talk'], 'verb', ['s_n5u08_k11']),
    V('shimasu', 'します', 'します', ['do'], 'verb', ['s_n5u08_k12', 's_n5u08_k26']),
    V('nemasu', 'ねます', 'ねます', ['sleep', 'go to bed'], 'verb', ['s_n5u08_k13']),
    V('okimasu', 'おきます', 'おきます', ['get up', 'wake up'], 'verb', ['s_n5u08_k14']),
    V('aimasu', 'あいます', 'あいます', ['meet'], 'verb', ['s_n5u08_k15']),
    V('machimasu', 'まちます', 'まちます', ['wait'], 'verb', ['s_n5u08_k16']),
  ],
  l3: [
    V('soba', 'そば', 'そば', ['soba (buckwheat noodles)'], 'noun', ['s_n5u08_k28'], { destination_tags: ['asakusa'] }),
    V('udon', 'うどん', 'うどん', ['udon (wheat noodles)'], 'noun', ['s_n5u08_k29'], { destination_tags: ['asakusa'] }),
    V('dango', 'だんご', 'だんご', ['dango (sweet rice dumplings)'], 'noun', ['s_n5u08_m01'], { destination_tags: ['asakusa'] }),
    V('senbei', 'せんべい', 'せんべい', ['senbei (rice crackers)'], 'noun', ['s_n5u08_m02'], { destination_tags: ['asakusa'] }),
    V('taiyaki', 'たいやき', 'たいやき', ['taiyaki (fish-shaped cake)'], 'noun', ['s_n5u08_m03'], { destination_tags: ['asakusa'] }),
    V('ongaku', 'おんがく', 'おんがく', ['music'], 'noun', ['s_n5u08_k04']),
    V('shigoto', 'しごと', 'しごと', ['work', 'job'], 'noun', ['s_n5u08_k30']),
    V('benkyou', 'べんきょう', 'べんきょう', ['study'], 'noun', ['s_n5u08_k12']),
    V('kaimono', 'かいもの', 'かいもの', ['shopping'], 'noun', ['s_n5u08_k31']),
  ],
  l4: [
    V('mainichi', 'まいにち', 'まいにち', ['every day'], 'noun (time)', ['s_n5u08_k01']),
    V('hiru', 'ひる', 'ひる', ['noon', 'daytime'], 'noun (time)', ['s_n5u08_k32']),
    V('ban', 'ばん', 'ばん', ['evening', 'night'], 'noun (time)', ['s_n5u08_k33']),
    V('ashita', 'あした', 'あした', ['tomorrow'], 'noun (time)', ['s_n5u08_k08', 's_n5u08_k22']),
    V('itsu', 'いつ', 'いつ', ['when'], 'question word', ['s_n5u08_k22']),
  ],
  l6: [
    V('aruite', 'あるいて', 'あるいて', ['on foot', 'walking'], 'adverb', ['s_n5u08_k18'], { note: 'あるいて いきます = go on foot. No で is needed.' }),
    V('hikouki', 'ひこうき', 'ひこうき', ['airplane'], 'noun', ['s_n5u08_k34']),
    V('jitensha', 'じてんしゃ', 'じてんしゃ', ['bicycle'], 'noun', ['s_n5u08_k35']),
  ],
  l8: [
    V('otera', 'おてら', 'おてら', ['Buddhist temple'], 'noun', ['s_n5u08_k26'], { destination_tags: ['asakusa'] }),
    V('omairi', 'おまいり', 'おまいり', ['visiting a temple or shrine to pray'], 'noun', ['s_n5u08_k26'], { destination_tags: ['asakusa'] }),
    V('omikuji', 'おみくじ', 'おみくじ', ['fortune slip (at a temple)'], 'noun', ['s_n5u08_k36'], { destination_tags: ['asakusa'] }),
    V('menyuu', 'メニュー', 'x', ['menu'], 'noun (loanword)', ['s_n5u08_k27'], { destination_tags: ['asakusa'] }),
  ],
};
const vocab = Object.values(vocabL).flat();
for (const w of vocab) if (!hasKanji(w.surface)) { w.reading_kana = w.surface; w.romaji = kanaToRomaji(w.surface); }

// ---------- kanji ----------
const kanji = [
  KJ('k_shoku', { char: '食', meanings_en: ['eat', 'food'], on_readings: ['しょく'], kun_readings: ['た', 'く'], reading_notes: 'In 食べます the kanji is read た and べます is written in kana.', stroke_count: 9, example_word_ids: ['v_tabemasu', 'v_shokuji'], tags: ['actions'] }),
  KJ('k_in', { char: '飲', meanings_en: ['drink'], on_readings: ['いん'], kun_readings: ['の'], stroke_count: 12, example_word_ids: ['v_nomimasu'], confusable_with: ['k_shoku'], tags: ['actions'] }),
  KJ('k_mi', { char: '見', meanings_en: ['see', 'look'], on_readings: ['けん'], kun_readings: ['み'], stroke_count: 7, example_word_ids: ['v_mimasu'], tags: ['actions'] }),
  KJ('k_gyou', { char: '行', meanings_en: ['go'], on_readings: ['こう', 'ぎょう'], kun_readings: ['い', 'ゆ'], reading_notes: 'In 行きます the kanji is read い.', stroke_count: 6, example_word_ids: ['v_ikimasu'], tags: ['actions'] }),
  KJ('k_rai', { char: '来', meanings_en: ['come'], on_readings: ['らい'], kun_readings: ['き', 'こ', 'く'], reading_notes: 'Irregular: 来ます is きます.', stroke_count: 7, example_word_ids: ['v_kimasu'], tags: ['actions'] }),
  KJ('k_doku', { char: '読', meanings_en: ['read'], on_readings: ['どく'], kun_readings: ['よ'], stroke_count: 14, example_word_ids: ['v_yomimasu'], tags: ['actions'] }),
  KJ('k_sho', { char: '書', meanings_en: ['write'], on_readings: ['しょ'], kun_readings: ['か'], stroke_count: 10, example_word_ids: ['v_kakimasu'], confusable_with: ['k_doku'], tags: ['actions'] }),
  KJ('k_wa', { char: '話', meanings_en: ['talk', 'story'], on_readings: ['わ'], kun_readings: ['はな'], stroke_count: 13, example_word_ids: ['v_hanashimasu'], tags: ['actions'] }),
  KJ('k_bai', { char: '買', meanings_en: ['buy'], on_readings: ['ばい'], kun_readings: ['か'], stroke_count: 12, example_word_ids: ['v_kaimasu'], tags: ['actions'] }),
  KJ('k_bun', { char: '聞', meanings_en: ['hear', 'listen', 'ask'], on_readings: ['ぶん'], kun_readings: ['き'], stroke_count: 14, example_word_ids: ['v_kikimasu'], confusable_with: ['k_mi'], tags: ['actions'] }),
];

// ---------- phrases and sentences ----------
const sn = (n, text, en, ids, extra = {}) => S(`s_n5u08_${n}`, 'sentence', text, text, en, ids, extra);
const kj = (n, text, reading, en, ids, ruby) => S(`s_n5u08_${n}`, 'phrase', text, reading, en, ids, { ruby, kanji_used: [...text].filter((c) => /[一-龥]/.test(c)) });
const sentences = [
  sn('k01', 'わたし は まいにち ごはん を たべます', 'I eat rice every day.', ['v_watashi', 'v_mainichi', 'v_gohan', 'v_tabemasu']), sn('k02', 'おちゃ を のみます', 'I drink tea.', ['v_ocha', 'v_nomimasu']),
  sn('k03', 'テレビ を みます', 'I watch TV.', ['v_terebi', 'v_mimasu']), sn('k04', 'おんがく を ききます', 'I listen to music.', ['v_ongaku', 'v_kikimasu']),
  sn('k05', 'ほん を よみます', 'I read a book.', ['v_hon', 'v_yomimasu']), sn('k06', 'てがみ を かきます', 'I write a letter.', ['v_tegami', 'v_kakimasu']),
  sn('k07', 'がっこう へ いきます', 'I go to school.', ['v_gakkou', 'v_ikimasu']), sn('k08', 'ともだち は あした きます', 'My friend is coming tomorrow.', ['v_tomodachi', 'v_ashita', 'v_kimasu']),
  sn('k09', 'いえ へ かえります', 'I go home.', ['v_ie', 'v_kaerimasu']), sn('k10', 'スーパー で パン を かいます', 'I buy bread at the supermarket.', ['v_suupaa', 'v_pan_k', 'v_kaimasu']),
  sn('k11', 'ともだち と にほんご で はなします', 'I speak Japanese with my friend.', ['v_tomodachi', 'v_nihongo', 'v_hanashimasu']), sn('k12', 'べんきょう を します', 'I study.', ['v_benkyou', 'v_shimasu']),
  sn('k13', 'ばん じゅうじ に ねます', 'I go to bed at ten in the evening.', ['v_ban', 'v_juuji', 'v_nemasu']), sn('k14', 'あさ ろくじ に おきます', 'I get up at six in the morning.', ['v_asa', 'v_rokuji', 'v_okimasu']),
  sn('k15', 'えき で ともだち に あいます', 'I meet my friend at the station.', ['v_eki', 'v_tomodachi', 'v_aimasu']), sn('k16', 'えき で バス を まちます', 'I wait for the bus at the station.', ['v_eki', 'v_basu', 'v_machimasu']),
  sn('k17', 'バス で いきます', 'I go by bus.', ['v_basu', 'v_ikimasu']), sn('k18', 'あるいて かえります', 'I walk home.', ['v_aruite', 'v_kaerimasu']),
  sn('k19', 'なに を たべます か', 'What will you eat?', ['v_nani', 'v_tabemasu']), sn('k20', 'おちゃ を のみません', 'I do not drink tea.', ['v_ocha']),
  sn('k21', 'どこ へ いきます か', 'Where will you go?', ['v_doko', 'v_ikimasu']), sn('k22', 'いつ いきます か', 'When will you go?', ['v_itsu', 'v_ikimasu']),
  sn('k23', 'テレビ は みません', 'I do not watch TV.', ['v_terebi']), sn('k24', 'ごはん を たべません', 'I do not eat rice.', ['v_gohan']),
  sn('k25', 'えいが を みます か', 'Will you watch a movie?', ['v_eiga', 'v_mimasu']), sn('k26', 'おてら で おまいり を します', 'I pray at the temple.', ['v_otera', 'v_omairi', 'v_shimasu']),
  sn('k27', 'メニュー を ください', 'The menu, please.', ['v_menyuu', 'v_kudasai']), sn('k28', 'そば を ください', 'Soba, please.', ['v_soba', 'v_kudasai']),
  sn('k29', 'うどん を たべます', 'I eat udon.', ['v_udon', 'v_tabemasu']), sn('k30', 'しごと へ いきます', 'I go to work.', ['v_shigoto', 'v_ikimasu']),
  sn('k31', 'かいもの を します', 'I go shopping.', ['v_kaimono', 'v_shimasu']), sn('k32', 'ひる に ごはん を たべます', 'I eat at noon.', ['v_hiru', 'v_gohan', 'v_tabemasu']),
  sn('k33', 'ばん に テレビ を みます', 'I watch TV in the evening.', ['v_ban', 'v_terebi', 'v_mimasu']), sn('k34', 'ひこうき で いきます', 'I go by plane.', ['v_hikouki', 'v_ikimasu']),
  sn('k35', 'じてんしゃ で がっこう へ いきます', 'I go to school by bicycle.', ['v_jitensha', 'v_gakkou', 'v_ikimasu']), sn('k36', 'おみくじ を かいます', 'I buy a fortune slip.', ['v_omikuji', 'v_kaimasu']),
  sn('k37', 'ともだち は えいが を みません', 'My friend does not watch movies.', ['v_tomodachi', 'v_eiga']),
  sn('m01', 'だんご  ごひゃく えん', 'Dango: 500 yen.', ['v_dango', 'v_en']), sn('m02', 'せんべい  ひゃくごじゅう えん', 'Senbei: 150 yen.', ['v_senbei', 'v_en']), sn('m03', 'たいやき  さんびゃく えん', 'Taiyaki: 300 yen.', ['v_taiyaki', 'v_sanbyaku', 'v_en']),
  kj('n01', '食べます', 'たべます', 'eat', ['v_tabemasu'], { 食: 'た' }), kj('n02', '飲みます', 'のみます', 'drink', ['v_nomimasu'], { 飲: 'の' }), kj('n03', '見ます', 'みます', 'see, watch', ['v_mimasu'], { 見: 'み' }),
  kj('n04', '行きます', 'いきます', 'go', ['v_ikimasu'], { 行: 'い' }), kj('n05', '来ます', 'きます', 'come', ['v_kimasu'], { 来: 'き' }), kj('n06', '読みます', 'よみます', 'read', ['v_yomimasu'], { 読: 'よ' }),
  kj('n07', '書きます', 'かきます', 'write', ['v_kakimasu'], { 書: 'か' }), kj('n08', '話します', 'はなします', 'speak', ['v_hanashimasu'], { 話: 'はな' }), kj('n09', '買います', 'かいます', 'buy', ['v_kaimasu'], { 買: 'か' }),
  kj('n10', '聞きます', 'ききます', 'listen, ask', ['v_kikimasu'], { 聞: 'き' }), kj('n11', 'ごはん を 食べます', 'ごはん を たべます', 'I eat rice.', ['v_gohan', 'v_tabemasu'], { 食: 'た' }),
  kj('n12', 'えき へ 行きます', 'えき へ いきます', 'I go to the station.', ['v_eki', 'v_ikimasu'], { 行: 'い' }), kj('n13', 'ほん を 読みます', 'ほん を よみます', 'I read a book.', ['v_hon', 'v_yomimasu'], { 読: 'よ' }),
];
const sentIdx = Object.fromEntries(sentences.map((s) => [s.id, s]));
const K = kit(Q, 'n5u08', sentIdx);

const questions = [];
const add = (...q) => questions.push(...q);

// ---------- verbs and vocabulary practice ----------
const vm = (n, word, ans, others, vid, note) => Q(`q_n5u08_vb${n}`, 'mcq', { stem: { prompt: 'What does this verb mean?', ja: word }, choices: choices([['a', ans], ...others.map((o, i) => [`d${i + 1}`, o])]), answer: 'a', explanation_correct: note, explanation_per_distractor: Object.fromEntries(others.map((o, i) => [`d${i + 1}`, 'That is a different verb.'])), facet: 'meaning', targets: [vid], difficulty: 1 });
add(vm('01', 'たべます', 'eat', ['drink', 'buy'], 'v_tabemasu', 'たべます = eat.'), vm('02', 'のみます', 'drink', ['eat', 'read'], 'v_nomimasu', 'のみます = drink.'), vm('03', 'よみます', 'read', ['write', 'see'], 'v_yomimasu', 'よみます = read.'), vm('04', 'かきます', 'write', ['read', 'buy'], 'v_kakimasu', 'かきます = write.'),
  vm('05', 'みます', 'see / watch', ['listen', 'go'], 'v_mimasu', 'みます = see, watch.'), vm('06', 'ききます', 'listen / hear / ask', ['see', 'speak'], 'v_kikimasu', 'ききます = listen.'));
add(vm('07', 'いきます', 'go', ['come', 'return'], 'v_ikimasu', 'いきます = go.'), vm('08', 'きます', 'come', ['go', 'return'], 'v_kimasu', 'きます = come.'), vm('09', 'かえります', 'return / go home', ['go', 'meet'], 'v_kaerimasu', 'かえります = go home.'), vm('10', 'かいます', 'buy', ['eat', 'sleep'], 'v_kaimasu', 'かいます = buy.'),
  vm('11', 'はなします', 'speak', ['wait', 'write'], 'v_hanashimasu', 'はなします = speak.'), vm('12', 'ねます', 'sleep / go to bed', ['get up', 'do'], 'v_nemasu', 'ねます = sleep.'), vm('13', 'おきます', 'get up', ['sleep', 'meet'], 'v_okimasu', 'おきます = get up.'), vm('14', 'あいます', 'meet', ['wait', 'buy'], 'v_aimasu', 'あいます = meet.'),
  vm('15', 'まちます', 'wait', ['meet', 'come'], 'v_machimasu', 'まちます = wait.'), vm('16', 'します', 'do', ['eat', 'go'], 'v_shimasu', 'します = do.'));
add(Q('q_n5u08_vmt01', 'matching', { stem: { prompt: 'Match each verb with its meaning.' }, pairs: [['たべます', 'eat'], ['のみます', 'drink'], ['みます', 'watch'], ['よみます', 'read'], ['かきます', 'write'], ['ききます', 'listen']], answer: ['たべます', 'のみます', 'みます', 'よみます', 'かきます', 'ききます'], explanation_correct: 'The first six polite verbs.', facet: 'meaning', targets: ['v_tabemasu', 'v_nomimasu', 'v_mimasu', 'v_yomimasu', 'v_kakimasu', 'v_kikimasu'], difficulty: 2 }),
  Q('q_n5u08_vmt02', 'matching', { stem: { prompt: 'Match each verb with its meaning.' }, pairs: [['いきます', 'go'], ['きます', 'come'], ['かえります', 'go home'], ['かいます', 'buy'], ['はなします', 'speak'], ['まちます', 'wait']], answer: ['いきます', 'きます', 'かえります', 'かいます', 'はなします', 'まちます'], explanation_correct: 'Verbs of movement and talking.', facet: 'meaning', targets: ['v_ikimasu', 'v_kimasu', 'v_kaerimasu', 'v_kaimasu', 'v_hanashimasu', 'v_machimasu'], difficulty: 2 }));
add(K.ty('01', 'eat', 'たべます', 'v_tabemasu'), K.ty('02', 'drink', 'のみます', 'v_nomimasu'), K.ty('03', 'read', 'よみます', 'v_yomimasu'), K.ty('04', 'go', 'いきます', 'v_ikimasu'), K.ty('05', 'come', 'きます', 'v_kimasu'), K.ty('06', 'buy', 'かいます', 'v_kaimasu'), K.ty('07', 'sleep', 'ねます', 'v_nemasu'), K.ty('08', 'every day', 'まいにち', 'v_mainichi'), K.ty('09', 'tomorrow', 'あした', 'v_ashita'), K.ty('10', 'temple', 'おてら', 'v_otera'));
const nonVerbs = vocab.filter((w) => !/^v_(tabemasu|nomimasu|mimasu|kikimasu|yomimasu|kakimasu|ikimasu|kimasu|kaerimasu|kaimasu|hanashimasu|shimasu|nemasu|okimasu|aimasu|machimasu)$/.test(w.id));
add(...meaningQuestions(Q, nonVerbs, nonVerbs, 1));
add(...spiral(Q, 'n5u08', [...u01.vocab, ...u02.vocab.filter((w) => w.pos !== 'expression'), ...u03.vocab, ...u04.vocab, ...u05.vocab, ...u06.vocab, ...u07.vocab].filter((w) => !SPIRAL_EXCLUDE.test(w.id)), { rem: 1, step: 4, n: 100, mod: 9 }));

// ---------- grammar ----------
const gq = { masu: [], wo: [], de: [], he: [] };
const G = (key, ...q) => { gq[key].push(...q.map((x) => x.id)); add(...q); };
G('masu',
  Q('q_n5u08_gm01', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'おちゃ を のみません' }, choices: choices([['a', 'I do not drink tea.'], ['b', 'I drink tea.'], ['c', 'Do you drink tea?']]), answer: 'a', explanation_correct: 'ません makes the polite verb negative.', explanation_per_distractor: { b: 'ます is positive.', c: 'A question would end in か.' }, facet: 'meaning', targets: ['g_masu_forms', 'v_ocha', 'v_nomimasu'], source_sentence_id: 's_n5u08_k20', difficulty: 2 }),
  Q('q_n5u08_gm02', 'fill_blank', { stem: { prompt: 'Complete: I do not watch TV.', ja: 'テレビ は ＿＿' }, choices: choices([['a', 'みません', true], ['b', 'みます', true], ['c', 'みます か', true]]), answer: 'a', explanation_correct: 'Negative: みません.', explanation_per_distractor: { b: 'みます is positive.', c: 'みます か is a question.' }, facet: 'construct', targets: ['g_masu_forms', 'v_terebi', 'v_mimasu'], source_sentence_id: 's_n5u08_k23', difficulty: 2 }),
  Q('q_n5u08_gm03', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'えいが を みます か' }, choices: choices([['a', 'Will you watch a movie?'], ['b', 'I will watch a movie.'], ['c', 'I do not watch movies.']]), answer: 'a', explanation_correct: 'か turns the polite verb into a question.', explanation_per_distractor: { b: 'A statement has no か.', c: 'ません would be negative.' }, facet: 'meaning', targets: ['g_masu_forms', 'v_eiga', 'v_mimasu'], source_sentence_id: 's_n5u08_k25', difficulty: 2 }),
  Q('q_n5u08_gm04', 'dialogue_complete', { stem: { prompt: 'A asks: "Do you eat rice?" You do not. What do you say?', ja: 'ごはん を たべます か' }, choices: choices([['a', 'いいえ たべません', true], ['b', 'はい たべません', true], ['c', 'いいえ たべます', true]]), answer: 'a', explanation_correct: 'いいえ + the negative verb.', explanation_per_distractor: { b: 'はい with a negative verb contradicts the question.', c: 'いいえ with a positive verb contradicts itself.' }, facet: 'meaning', targets: ['g_masu_forms', 'v_gohan', 'v_tabemasu'], source_sentence_id: 's_n5u08_k24', difficulty: 2 }),
  Q('q_n5u08_gm05', 'mcq', { stem: { prompt: 'Which ending makes a polite verb negative?' }, choices: choices([['a', 'ません', true], ['b', 'ます', true], ['c', 'ました', true]]), answer: 'a', explanation_correct: 'ます → ません.', explanation_per_distractor: { b: 'ます is the positive polite ending.', c: 'ました is the past (a later unit).' }, facet: 'meaning', targets: ['g_masu_forms'], difficulty: 1 }),
  Q('q_n5u08_gm06', 'error_correction', { stem: { prompt: 'One word is wrong. What replaces です so the sentence means "I drink tea"?', ja: 'おちゃ を のみ です' }, choices: choices([['a', 'ます', true], ['b', 'ません', true], ['c', 'か', true]]), answer: 'a', explanation_correct: 'Verbs end in ます, not です: のみます.', explanation_per_distractor: { b: 'ません would mean "do not drink".', c: 'か would make a question.' }, facet: 'construct', targets: ['g_masu_forms', 'v_nomimasu'], difficulty: 3 }));
G('wo',
  Q('q_n5u08_gw01', 'fill_blank', { stem: { prompt: 'Complete: I read a book.', ja: 'ほん ＿＿ よみます' }, choices: choices([['a', 'を', true], ['b', 'に', true], ['c', 'の', true]]), answer: 'a', explanation_correct: 'を marks what the action is done to (the object). It is pronounced "o".', explanation_per_distractor: { b: 'に marks a place or time.', c: 'の links nouns.' }, facet: 'construct', targets: ['g_wo_object', 'v_hon', 'v_yomimasu'], source_sentence_id: 's_n5u08_k05', difficulty: 1 }),
  Q('q_n5u08_gw02', 'sentence_order', { stem: { prompt: 'Put the words in order: I write a letter.' }, tiles: ['かきます', 'を', 'てがみ'], answer: ['てがみ', 'を', 'かきます'], explanation_correct: 'Object を verb.', facet: 'construct', targets: ['g_wo_object', 'v_tegami', 'v_kakimasu'], source_sentence_id: 's_n5u08_k06', difficulty: 2 }),
  Q('q_n5u08_gw03', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'おんがく を ききます' }, choices: choices([['a', 'I listen to music.'], ['b', 'I play music.'], ['c', 'Music is a person.']]), answer: 'a', explanation_correct: 'ききます = listen.', explanation_per_distractor: { b: 'Playing needs a different verb.', c: 'を marks an object, not a description.' }, facet: 'meaning', targets: ['g_wo_object', 'v_ongaku', 'v_kikimasu'], source_sentence_id: 's_n5u08_k04', difficulty: 2 }),
  Q('q_n5u08_gw04', 'mcq', { stem: { prompt: 'Which sentence says "I eat rice every day"?' }, choices: choices([['a', 'まいにち ごはん を たべます', true], ['b', 'まいにち ごはん で たべます', true], ['c', 'まいにち ごはん へ たべます', true]]), answer: 'a', explanation_correct: 'を marks the object.', explanation_per_distractor: { b: 'で marks a place or means.', c: 'へ marks a direction.' }, facet: 'meaning', targets: ['g_wo_object', 'v_mainichi', 'v_gohan'], source_sentence_id: 's_n5u08_k01', difficulty: 2 }),
  Q('q_n5u08_gw05', 'sentence_order', { stem: { prompt: 'Put the words in order: The soup, please. / Soba, please.' }, tiles: ['ください', 'を', 'そば'], answer: ['そば', 'を', 'ください'], explanation_correct: 'Thing を ください.', facet: 'construct', targets: ['g_wo_object', 'v_soba', 'v_kudasai'], source_sentence_id: 's_n5u08_k28', difficulty: 2 }),
  Q('q_n5u08_gw06', 'error_correction', { stem: { prompt: 'One word is wrong. What replaces は so the sentence means "I eat udon"?', ja: 'うどん は たべます' }, choices: choices([['a', 'を', true], ['b', 'も', true], ['c', 'か', true]]), answer: 'a', explanation_correct: 'うどん を たべます: を marks the object of the action.', explanation_per_distractor: { b: 'も means "also".', c: 'か makes a question.' }, facet: 'construct', targets: ['g_wo_object', 'v_udon', 'v_tabemasu'], source_sentence_id: 's_n5u08_k29', difficulty: 3 }),
  Q('q_n5u08_gw07', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'かいもの を します' }, choices: choices([['a', 'I go shopping.'], ['b', 'I buy a shop.'], ['c', 'I do not shop.']]), answer: 'a', explanation_correct: 'N を します = to do N.', explanation_per_distractor: { b: 'かいもの means shopping.', c: 'ません would be negative.' }, facet: 'meaning', targets: ['g_wo_object', 'v_kaimono', 'v_shimasu'], source_sentence_id: 's_n5u08_k31', difficulty: 2 }));
G('de',
  Q('q_n5u08_gd01', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'スーパー で パン を かいます' }, choices: choices([['a', 'I buy bread at the supermarket.'], ['b', 'I buy a supermarket.'], ['c', 'I go to the supermarket.']]), answer: 'a', explanation_correct: 'で marks where the action takes place.', explanation_per_distractor: { b: 'を marks パン as the object.', c: 'へ would mean "to".' }, facet: 'meaning', targets: ['g_de_place_means', 'v_suupaa', 'v_pan_k', 'v_kaimasu'], source_sentence_id: 's_n5u08_k10', difficulty: 2 }),
  Q('q_n5u08_gd02', 'fill_blank', { stem: { prompt: 'Complete: I go by bus.', ja: 'バス ＿＿ いきます' }, choices: choices([['a', 'で', true], ['b', 'を', true], ['c', 'の', true]]), answer: 'a', explanation_correct: 'で also marks the means: バス で = by bus.', explanation_per_distractor: { b: 'を marks an object.', c: 'の links nouns.' }, facet: 'construct', targets: ['g_de_place_means', 'v_basu', 'v_ikimasu'], source_sentence_id: 's_n5u08_k17', difficulty: 2 }),
  Q('q_n5u08_gd03', 'fill_blank', { stem: { prompt: 'Complete: I wait for the bus at the station.', ja: 'えき ＿＿ バス を まちます' }, choices: choices([['a', 'で', true], ['b', 'に', true], ['c', 'が', true]]), answer: 'a', explanation_correct: 'で marks the place of an action.', explanation_per_distractor: { b: 'に marks where something exists or a time.', c: 'が marks what exists (earlier unit).' }, facet: 'construct', targets: ['g_de_place_means', 'v_eki', 'v_machimasu'], source_sentence_id: 's_n5u08_k16', difficulty: 2 }),
  Q('q_n5u08_gd04', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'ともだち と にほんご で はなします' }, choices: choices([['a', 'I speak Japanese with my friend.'], ['b', 'My friend speaks Japanese.'], ['c', 'I speak to my friend at school.']]), answer: 'a', explanation_correct: 'と = with; で = in (a language).', explanation_per_distractor: { b: 'I am the speaker.', c: 'The sentence names a language, not a school.' }, facet: 'meaning', targets: ['g_de_place_means', 'v_tomodachi', 'v_nihongo', 'v_hanashimasu'], source_sentence_id: 's_n5u08_k11', difficulty: 3 }),
  Q('q_n5u08_gd05', 'sentence_order', { stem: { prompt: 'Put the words in order: I go to school by bicycle.' }, tiles: ['いきます', 'で', 'へ', 'じてんしゃ', 'がっこう'], answer: ['じてんしゃ', 'で', 'がっこう', 'へ', 'いきます'], explanation_correct: 'Means で, destination へ, verb.', facet: 'construct', targets: ['g_de_place_means', 'v_jitensha', 'v_gakkou', 'v_ikimasu'], source_sentence_id: 's_n5u08_k35', difficulty: 3 }),
  Q('q_n5u08_gd06', 'mcq', { stem: { prompt: 'What does で mean in ひこうき で いきます?' }, choices: choices([['a', 'by (means)'], ['b', 'at (a place)'], ['c', 'and']]), answer: 'a', explanation_correct: 'ひこうき で = by plane.', explanation_per_distractor: { b: 'With a place noun で means "at".', c: 'と means "and".' }, facet: 'meaning', targets: ['g_de_place_means', 'v_hikouki'], source_sentence_id: 's_n5u08_k34', difficulty: 2 }));
G('he',
  Q('q_n5u08_gh01', 'fill_blank', { stem: { prompt: 'Complete: I go to school.', ja: 'がっこう ＿＿ いきます' }, choices: choices([['a', 'へ', true], ['b', 'を', true], ['c', 'も', true]]), answer: 'a', explanation_correct: 'へ marks the direction or destination. It is pronounced "e".', explanation_per_distractor: { b: 'を marks an object.', c: 'も means "also".' }, facet: 'construct', targets: ['g_he_direction', 'v_gakkou', 'v_ikimasu'], source_sentence_id: 's_n5u08_k07', difficulty: 1 }),
  Q('q_n5u08_gh02', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'どこ へ いきます か' }, choices: choices([['a', 'Where will you go?'], ['b', 'When will you go?'], ['c', 'What will you eat?']]), answer: 'a', explanation_correct: 'どこ へ = to where.', explanation_per_distractor: { b: 'When is いつ.', c: 'What is なに.' }, facet: 'meaning', targets: ['g_he_direction', 'v_doko', 'v_ikimasu'], source_sentence_id: 's_n5u08_k21', difficulty: 2 }),
  Q('q_n5u08_gh03', 'mcq', { stem: { prompt: 'How is へ pronounced as a particle?' }, choices: choices([['a', '"e"'], ['b', '"he"'], ['c', '"o"']]), answer: 'a', explanation_correct: 'The particle へ is pronounced "e".', explanation_per_distractor: { b: 'Inside words (へや) it is "he".', c: 'を is "o".' }, facet: 'read', targets: ['g_he_direction'], difficulty: 2 }),
  Q('q_n5u08_gh04', 'sentence_order', { stem: { prompt: 'Put the words in order: I go home.' }, tiles: ['かえります', 'へ', 'いえ'], answer: ['いえ', 'へ', 'かえります'], explanation_correct: 'Destination へ verb.', facet: 'construct', targets: ['g_he_direction', 'v_ie', 'v_kaerimasu'], source_sentence_id: 's_n5u08_k09', difficulty: 2 }),
  Q('q_n5u08_gh05', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'しごと へ いきます' }, choices: choices([['a', 'I go to work.'], ['b', 'I come to work.'], ['c', 'I do my work.']]), answer: 'a', explanation_correct: 'しごと へ = to work.', explanation_per_distractor: { b: 'きます is "come".', c: 'します is "do".' }, facet: 'meaning', targets: ['g_he_direction', 'v_shigoto', 'v_ikimasu'], source_sentence_id: 's_n5u08_k30', difficulty: 2 }),
  Q('q_n5u08_gh06', 'dialogue_complete', { stem: { prompt: 'A asks: "Where are you going?" Which answer fits?', ja: 'どこ へ いきます か' }, choices: choices([['a', 'こうえん へ いきます', true], ['b', 'こうえん を いきます', true], ['c', 'こうえん です', true]]), answer: 'a', explanation_correct: 'Answer with the destination + へ + いきます.', explanation_per_distractor: { b: 'を does not mark a destination here.', c: 'です does not answer "where to".' }, facet: 'meaning', targets: ['g_he_direction', 'v_kouen', 'v_ikimasu'], source_sentence_id: 's_n5u08_k21', difficulty: 2 }));
const grammar = [
  GR('g_masu_forms', { title: 'Polite verbs: ～ます and ～ません', pattern: 'verb-ます / verb-ません', meaning_en: 'Polite present/future statement; ません is its negative.', explanation: ['Polite verbs end in ます: たべます (eat/will eat), のみます (drink). The negative ends in ません: たべません (do not eat).', 'The same form covers the present and the near future: あした いきます = "I will go tomorrow". Make a question by adding か: たべます か.', 'Answer a question with はい + ます form or いいえ + ません form.'], structure_notes: 'Verb stem + ます / ません (+ か).', examples: ['s_n5u08_k01', 's_n5u08_k20', 's_n5u08_k23', 's_n5u08_k25'], common_mistakes: ['Using です after a verb.', 'Answering いいえ with a positive verb.'], contrast_with: ['g_wa_desu'], practice_question_ids: gq.masu, register: 'polite', tags: ['verbs'] }),
  GR('g_wo_object', { title: 'を: the object of an action', pattern: 'object を verb', meaning_en: 'Marks what the action is done to.', explanation: ['を marks the thing the verb acts on: ほん を よみます (read a book). It is pronounced "o" and written only as a particle.', 'ください follows the same rule: そば を ください (soba, please).', 'N を します means "to do N": べんきょう を します.'], structure_notes: 'Object を verb.', examples: ['s_n5u08_k02', 's_n5u08_k05', 's_n5u08_k28', 's_n5u08_k31'], common_mistakes: ['Using は where を is needed.', 'Saying "wo" instead of "o".'], contrast_with: ['g_wa_desu'], practice_question_ids: gq.wo, register: 'polite', tags: ['particles'] }),
  GR('g_de_place_means', { title: 'で: where and how', pattern: 'place で verb / means で verb', meaning_en: 'At (a place where an action happens); by, in (means or language).', explanation: ['で marks the place where an action happens: スーパー で パン を かいます (buy bread at the supermarket).', 'で also marks the means: バス で いきます (go by bus), にほんご で はなします (speak in Japanese).', 'Compare に: に marks where something exists or a time, で marks where an action is done.'], structure_notes: 'Place/means で verb.', examples: ['s_n5u08_k10', 's_n5u08_k11', 's_n5u08_k16', 's_n5u08_k17'], common_mistakes: ['Using に instead of で for where an action happens.', 'Using で with あるいて.'], contrast_with: ['g_ni_location'], practice_question_ids: gq.de, register: 'polite', tags: ['particles'] }),
  GR('g_he_direction', { title: 'へ: toward a place', pattern: 'place へ いきます / きます / かえります', meaning_en: 'To (a place).', explanation: ['へ marks the direction of movement: がっこう へ いきます. Pronounce the particle へ as "e".', 'It is used with いきます, きます and かえります. に can replace へ in these cases.', 'Ask where with どこ へ いきます か.'], structure_notes: 'Destination へ + movement verb.', examples: ['s_n5u08_k07', 's_n5u08_k09', 's_n5u08_k21', 's_n5u08_k30'], common_mistakes: ['Reading the particle へ as "he".', 'Using で for the destination.'], contrast_with: ['g_de_place_means'], practice_question_ids: gq.he, register: 'polite', tags: ['particles'] }),
];

// ---------- kanji ----------
add(K.kd('01', '食', 'eat / food', ['drink', 'see'], 'k_shoku', ['v_tabemasu'], '食 is eat or food.'), K.kd('02', '飲', 'drink', ['eat', 'write'], 'k_in', ['v_nomimasu'], '飲 is drink.'), K.kd('03', '見', 'see / look', ['hear', 'go'], 'k_mi', ['v_mimasu'], '見 is see.'), K.kd('04', '行', 'go', ['come', 'buy'], 'k_gyou', ['v_ikimasu'], '行 is go.'), K.kd('05', '来', 'come', ['go', 'read'], 'k_rai', ['v_kimasu'], '来 is come.'),
  K.kd('06', '読', 'read', ['write', 'speak'], 'k_doku', ['v_yomimasu'], '読 is read.'), K.kd('07', '書', 'write', ['read', 'buy'], 'k_sho', ['v_kakimasu'], '書 is write.'), K.kd('08', '話', 'talk / story', ['hear', 'go'], 'k_wa', ['v_hanashimasu'], '話 is talk.'), K.kd('09', '買', 'buy', ['see', 'eat'], 'k_bai', ['v_kaimasu'], '買 is buy.'), K.kd('10', '聞', 'hear / listen / ask', ['see', 'write'], 'k_bun', ['v_kikimasu'], '聞 is hear or ask.'));
add(K.kk('01', '食べます', 'tabemasu', ['nomimasu', 'mimasu'], 'k_shoku', 'v_tabemasu', '食べます = tabemasu.'), K.kk('02', '飲みます', 'nomimasu', ['tabemasu', 'kakimasu'], 'k_in', 'v_nomimasu', '飲みます = nomimasu.'), K.kk('03', '見ます', 'mimasu', ['kikimasu', 'kimasu'], 'k_mi', 'v_mimasu', '見ます = mimasu.'), K.kk('04', '行きます', 'ikimasu', ['kimasu', 'kaerimasu'], 'k_gyou', 'v_ikimasu', '行きます = ikimasu.'), K.kk('05', '来ます', 'kimasu', ['ikimasu', 'kikimasu'], 'k_rai', 'v_kimasu', '来ます = kimasu.'),
  K.kk('06', '読みます', 'yomimasu', ['kakimasu', 'nomimasu'], 'k_doku', 'v_yomimasu', '読みます = yomimasu.'), K.kk('07', '書きます', 'kakimasu', ['yomimasu', 'kaimasu'], 'k_sho', 'v_kakimasu', '書きます = kakimasu.'), K.kk('08', '話します', 'hanashimasu', ['kikimasu', 'machimasu'], 'k_wa', 'v_hanashimasu', '話します = hanashimasu.'), K.kk('09', '買います', 'kaimasu', ['kakimasu', 'kaerimasu'], 'k_bai', 'v_kaimasu', '買います = kaimasu.'), K.kk('10', '聞きます', 'kikimasu', ['mimasu', 'kimasu'], 'k_bun', 'v_kikimasu', '聞きます = kikimasu.'));
add(Q('q_n5u08_kmt01', 'matching', { stem: { prompt: 'Match each kanji with its meaning.' }, pairs: [['食', 'eat'], ['飲', 'drink'], ['見', 'see'], ['行', 'go'], ['来', 'come'], ['買', 'buy']], answer: ['食', '飲', '見', '行', '来', '買'], explanation_correct: 'Action kanji.', facet: 'meaning', targets: ['k_shoku', 'k_in', 'k_mi', 'k_gyou', 'k_rai', 'k_bai'], difficulty: 2 }),
  Q('q_n5u08_kmt02', 'matching', { stem: { prompt: 'Match each kanji with its meaning.' }, pairs: [['読', 'read'], ['書', 'write'], ['話', 'talk'], ['聞', 'hear'], ['見', 'see'], ['食', 'eat']], answer: ['読', '書', '話', '聞', '見', '食'], explanation_correct: 'Kanji for reading, writing, talking and hearing.', facet: 'meaning', targets: ['k_doku', 'k_sho', 'k_wa', 'k_bun', 'k_mi', 'k_shoku'], difficulty: 3 }),
  Q('q_n5u08_kcf01', 'mcq', { stem: { prompt: 'Which kanji is "read" (not "write")?' }, choices: choices([['a', '読'], ['b', '書'], ['c', '話']]), answer: 'a', explanation_correct: '読 = read; 書 = write.', explanation_per_distractor: { b: '書 is write.', c: '話 is talk.' }, facet: 'read', targets: ['k_doku', 'k_sho'], difficulty: 2 }),
  Q('q_n5u08_kcf02', 'mcq', { stem: { prompt: 'Which kanji is "see"?' }, choices: choices([['a', '見'], ['b', '聞'], ['c', '買']]), answer: 'a', explanation_correct: '見 = see; 聞 = hear; 買 = buy.', explanation_per_distractor: { b: '聞 is hear or ask.', c: '買 is buy.' }, facet: 'read', targets: ['k_mi', 'k_bun', 'k_bai'], difficulty: 2 }),
  Q('q_n5u08_kcf03', 'mcq', { stem: { prompt: 'Which sentence means "I eat rice"?' }, choices: choices([['a', 'ごはん を 食べます'], ['b', 'ごはん を 飲みます'], ['c', 'ごはん を 見ます']]), answer: 'a', explanation_correct: '食べます = eat.', explanation_per_distractor: { b: '飲みます is drink.', c: '見ます is watch.' }, facet: 'read', targets: ['k_shoku', 'k_in', 'k_mi'], difficulty: 2 }));

// ---------- dictation and listening ----------
add(K.dc('01', 'たべます', 'v_tabemasu', 'たべます = eat.'), K.dc('02', 'いきません', 'v_ikimasu', 'いきません = do not go.'), K.dc('03', 'のみません', 'v_nomimasu', 'のみません = do not drink.'), K.dc('04', 'かえります', 'v_kaerimasu', 'かえります = go home.'));
add(K.gl('01', 'n5u08_ls1', 'たべます', ['のみます', 'みます'], 'v_tabemasu', 'You heard たべます: eat.'), K.gl('02', 'n5u08_ls1', 'よみます', ['かきます', 'のみます'], 'v_yomimasu', 'You heard よみます: read.'), K.gl('03', 'n5u08_ls1', 'いきます', ['きます', 'かえります'], 'v_ikimasu', 'You heard いきます: go.'), K.gl('04', 'n5u08_ls1', 'かいます', ['あいます', 'かきます'], 'v_kaimasu', 'You heard かいます: buy.'),
  K.gl('05', 'n5u08_ls2', 'おちゃ を のみます', ['おちゃ を のみません', 'ごはん を たべます'], 'v_nomimasu', 'You heard のみます (positive).'), K.gl('06', 'n5u08_ls2', 'テレビ は みません', ['テレビ を みます', 'ほん は よみません'], 'v_mimasu', 'You heard みません (negative).'), K.gl('07', 'n5u08_ls2', 'バス で いきます', ['バス を まちます', 'えき へ いきます'], 'v_basu', 'You heard バス で: by bus.'), K.gl('08', 'n5u08_ls2', 'どこ へ いきます か', ['いつ いきます か', 'なに を たべます か'], 'v_doko', 'You heard どこ へ: to where.'));
const listening = [
  LS('n5u08_ls1', { item_type: 'Word recognition (lesson practice)', title: 'Which verb?', script_turns: ['たべます', 'よみます', 'いきます', 'かいます'].map((t) => ({ speaker: 'A', text_ja: t })), question_ids: ['q_n5u08_gl01', 'q_n5u08_gl02', 'q_n5u08_gl03', 'q_n5u08_gl04'] }),
  LS('n5u08_ls2', { item_type: 'Verbal expressions (lesson practice)', title: 'Yes or no? Where?', script_turns: ['おちゃ を のみます', 'テレビ は みません', 'バス で いきます', 'どこ へ いきます か'].map((t) => ({ speaker: 'A', text_ja: t })), question_ids: ['q_n5u08_gl05', 'q_n5u08_gl06', 'q_n5u08_gl07', 'q_n5u08_gl08'] }),
];

// ---------- dialogues ----------
const dialogues = [
  DG('n5u08_d1', { title: 'Where are you going?', setting: 'asakusa', turns: [{ speaker: 'A', sentence_id: 's_n5u08_k21' }, { speaker: 'B', sentence_id: 's_n5u08_k07' }, { speaker: 'A', sentence_id: 's_n5u08_k22' }, { speaker: 'B', sentence_id: 's_n5u08_k08' }], comprehension_question_ids: ['q_n5u08_dg01', 'q_n5u08_dg02'], register: 'polite' }),
  DG('n5u08_d2', { title: 'What will you eat?', setting: 'asakusa', turns: [{ speaker: 'A', sentence_id: 's_n5u08_k19' }, { speaker: 'B', sentence_id: 's_n5u08_k29' }], comprehension_question_ids: ['q_n5u08_dg03'], register: 'polite' }),
  DG('n5u08_d3', { title: 'At the soba stall', setting: 'asakusa', turns: [{ speaker: 'A', sentence_id: 's_n5u08_k27' }, { speaker: 'A', sentence_id: 's_n5u08_k28' }, { speaker: 'B', sentence_id: 's_n5u02_g08' }], comprehension_question_ids: ['q_n5u08_dg04', 'q_n5u08_dg05'], register: 'polite' }),
  DG('n5u08_d4', { title: 'A busy day', setting: 'asakusa', turns: [{ speaker: 'A', sentence_id: 's_n5u08_k14' }, { speaker: 'A', sentence_id: 's_n5u08_k35' }, { speaker: 'A', sentence_id: 's_n5u08_k13' }], comprehension_question_ids: ['q_n5u08_dg06', 'q_n5u08_dg07'], register: 'neutral' }),
];
add(K.dg('01', 'n5u08_d1', 'Where is B going?', [['a', 'To school'], ['b', 'To the temple'], ['c', 'Home']], 'a', 'がっこう へ いきます.', ['v_gakkou', 'v_ikimasu']), K.dg('02', 'n5u08_d1', 'When is the friend coming?', [['a', 'Tomorrow'], ['b', 'Every day'], ['c', 'Tonight']], 'a', 'ともだち は あした きます.', ['v_ashita', 'v_kimasu']),
  K.dg('03', 'n5u08_d2', 'What will B eat?', [['a', 'Udon'], ['b', 'Soba'], ['c', 'Rice']], 'a', 'うどん を たべます.', ['v_udon', 'v_tabemasu']), K.dg('04', 'n5u08_d3', 'What does the customer ask for first?', [['a', 'The menu'], ['b', 'Soba'], ['c', 'Tea']], 'a', 'メニュー を ください.', ['v_menyuu']),
  K.dg('05', 'n5u08_d3', 'What does the customer order?', [['a', 'Soba'], ['b', 'Udon'], ['c', 'Dango']], 'a', 'そば を ください.', ['v_soba', 'v_kudasai']), K.dg('06', 'n5u08_d4', 'When does the speaker get up?', [['a', 'At 6 a.m.'], ['b', 'At 10 p.m.'], ['c', 'At noon']], 'a', 'あさ ろくじ に おきます.', ['v_okimasu', 'v_rokuji']),
  K.dg('07', 'n5u08_d4', 'How does the speaker go to school?', [['a', 'By bicycle'], ['b', 'By bus'], ['c', 'On foot']], 'a', 'じてんしゃ で がっこう へ いきます.', ['v_jitensha']));

// ---------- reading ----------
const r1 = ['だんご  ごひゃく えん', 'せんべい  ひゃくごじゅう えん', 'たいやき  さんびゃく えん', 'おちゃ  ひゃく えん'];
const r2 = ['おてら へ いきます', 'おまいり を します', 'おみくじ を かいます', 'おちゃ を のみます'];
const r3 = ['わたし は あさ ろくじ に おきます', 'ごはん を 食べます', 'バス で 学校 へ 行きます', 'ばん に テレビ を みます'];
const passages = [
  PS('n5u08_r1', { title: 'Snack stall menu', paragraphs: r1, translation_en: 'Dango 500 yen / Senbei 150 yen / Taiyaki 300 yen / Tea 100 yen', word_count_chars: countChars(r1), question_ids: ['q_n5u08_rq01', 'q_n5u08_rq02', 'q_n5u08_rq03', 'q_n5u08_rq04'], genre: 'menu' }),
  PS('n5u08_r2', { title: 'A temple visit', paragraphs: r2, translation_en: 'I go to the temple. / I pray. / I buy a fortune slip. / I drink tea.', word_count_chars: countChars(r2), question_ids: ['q_n5u08_rq05', 'q_n5u08_rq06', 'q_n5u08_rq07'], genre: 'notes' }),
  PS('n5u08_r3', { title: 'My morning', paragraphs: r3, ruby: { 食: 'た', 学校: 'がっこう', 行: 'い' }, translation_en: 'I get up at six in the morning. / I eat rice. / I go to school by bus. / I watch TV in the evening.', word_count_chars: countChars(r3), question_ids: ['q_n5u08_rq08', 'q_n5u08_rq09', 'q_n5u08_rq10'], genre: 'notes' }),
];
add(K.rq('01', 'n5u08_r1', 'How much is the taiyaki?', [['a', '300 yen'], ['b', '500 yen'], ['c', '150 yen']], 'a', 'たいやき さんびゃく えん.', ['v_taiyaki', 'v_sanbyaku'], 'information_retrieval'), K.rq('02', 'n5u08_r1', 'Which item costs 500 yen?', [['a', 'Dango'], ['b', 'Senbei'], ['c', 'Tea']], 'a', 'だんご ごひゃく えん.', ['v_dango'], 'information_retrieval'), K.rq('03', 'n5u08_r1', 'What is the cheapest item?', [['a', 'Tea'], ['b', 'Senbei'], ['c', 'Dango']], 'a', 'おちゃ ひゃく えん is 100 yen.', ['v_ocha', 'v_hyaku'], 'information_retrieval'), K.rq('04', 'n5u08_r1', 'How much is the senbei?', [['a', '150 yen'], ['b', '500 yen'], ['c', '100 yen']], 'a', 'せんべい ひゃくごじゅう えん.', ['v_senbei'], 'information_retrieval'),
  K.rq('05', 'n5u08_r2', 'Where does the writer go?', [['a', 'To a temple'], ['b', 'To school'], ['c', 'To a station']], 'a', 'おてら へ いきます.', ['v_otera'], 'information_retrieval'), K.rq('06', 'n5u08_r2', 'What does the writer buy?', [['a', 'A fortune slip'], ['b', 'Tea'], ['c', 'A ticket']], 'a', 'おみくじ を かいます.', ['v_omikuji', 'v_kaimasu'], 'information_retrieval'), K.rq('07', 'n5u08_r2', 'What does the writer drink?', [['a', 'Tea'], ['b', 'Coffee'], ['c', 'Juice']], 'a', 'おちゃ を のみます.', ['v_ocha', 'v_nomimasu'], 'information_retrieval'),
  K.rq('08', 'n5u08_r3', 'When does the writer get up?', [['a', 'At six in the morning'], ['b', 'At ten at night'], ['c', 'At noon']], 'a', 'あさ ろくじ に おきます.', ['v_rokuji', 'v_okimasu'], 'information_retrieval'), K.rq('09', 'n5u08_r3', 'How does the writer go to school?', [['a', 'By bus'], ['b', 'By bicycle'], ['c', 'On foot']], 'a', 'バス で 学校 へ 行きます.', ['v_basu', 'v_gakkou'], 'information_retrieval'), K.rq('10', 'n5u08_r3', 'What does the writer do in the evening?', [['a', 'Watches TV'], ['b', 'Reads a book'], ['c', 'Goes shopping']], 'a', 'ばん に テレビ を みます.', ['v_ban', 'v_terebi'], 'information_retrieval'));

// ---------- translate / construct ----------
add(K.tr('01', 's_n5u08_k01', 'I eat rice every day.', ['I eat rice tomorrow.', 'I do not eat rice.'], 'まいにち = every day.'), K.tr('02', 's_n5u08_k03', 'I watch TV.', ['I buy a TV.', 'I do not watch TV.'], 'みます = watch.'), K.tr('03', 's_n5u08_k06', 'I write a letter.', ['I read a letter.', 'I send a letter.'], 'かきます = write.'), K.tr('04', 's_n5u08_k09', 'I go home.', ['I come home.', 'I go to school.'], 'かえります = go home.'),
  K.tr('05', 's_n5u08_k13', 'I go to bed at ten in the evening.', ['I get up at ten in the evening.', 'I go to bed at ten in the morning.'], 'ねます = go to bed.'), K.tr('06', 's_n5u08_k15', 'I meet my friend at the station.', ['I wait for my friend at the station.', 'I go to the station with my friend.'], 'あいます = meet; に marks the person met.'), K.tr('07', 's_n5u08_k18', 'I walk home.', ['I take the bus home.', 'I go to school on foot.'], 'あるいて = on foot.'),
  K.tr('08', 's_n5u08_k26', 'I pray at the temple.', ['I go to the temple.', 'I buy something at the temple.'], 'おまいり を します = to pray.'), K.tr('09', 's_n5u08_k32', 'I eat at noon.', ['I eat in the evening.', 'I do not eat.'], 'ひる = noon.'), K.tr('10', 's_n5u08_k36', 'I buy a fortune slip.', ['I read a fortune slip.', 'I write a fortune slip.'], 'おみくじ = fortune slip.'), K.tr('11', 's_n5u08_k37', 'My friend does not watch movies.', ['My friend watches movies.', 'I do not watch movies.'], 'ともだち は ... みません.'), K.tr('12', 's_n5u08_k34', 'I go by plane.', ['I go by bus.', 'I go home.'], 'ひこうき で = by plane.'));
add(Q('q_n5u08_so01', 'sentence_order', { stem: { prompt: 'Put the words in order: I meet my friend at the station.' }, tiles: ['あいます', 'で', 'ともだち', 'に', 'えき'], answer: ['えき', 'で', 'ともだち', 'に', 'あいます'], explanation_correct: 'Place で person に あいます.', facet: 'construct', targets: ['v_eki', 'v_tomodachi', 'v_aimasu'], source_sentence_id: 's_n5u08_k15', difficulty: 3 }),
  Q('q_n5u08_so02', 'sentence_order', { stem: { prompt: 'Put the words in order: I get up at six in the morning.' }, tiles: ['おきます', 'ろくじ', 'に', 'あさ'], answer: ['あさ', 'ろくじ', 'に', 'おきます'], explanation_correct: 'Time に verb.', facet: 'construct', targets: ['v_asa', 'v_rokuji', 'v_okimasu'], source_sentence_id: 's_n5u08_k14', difficulty: 3 }),
  Q('q_n5u08_so03', 'sentence_order', { stem: { prompt: 'Put the words in order: What do you eat?' }, tiles: ['か', 'たべます', 'を', 'なに'], answer: ['なに', 'を', 'たべます', 'か'], explanation_correct: 'Question word を verb か.', facet: 'construct', targets: ['v_nani', 'v_tabemasu'], source_sentence_id: 's_n5u08_k19', difficulty: 2 }));

// ---------- lessons ----------
const ids = (arr) => arr.map((x) => x.id);
const qs = (...x) => x.map((n) => `q_n5u08_${n}`);
const vmq = (arr) => arr.filter((w) => !/^v_(tabemasu|nomimasu|mimasu|kikimasu|yomimasu|kakimasu|ikimasu|kimasu|kaerimasu|kaimasu|hanashimasu|shimasu|nemasu|okimasu|aimasu|machimasu)$/.test(w.id)).map((x) => `q_n5u08_vm_${x.id.slice(2)}`);
const spiralIds = questions.filter((q) => q.id.startsWith('q_n5u08_sr_')).map((q) => q.id);
const lessons = [
  L('n5_u08_l1', { title: 'Verbs I: eat, drink, watch, listen, read, write', goal: 'Learn the polite form (～ます) of six everyday verbs.', introduces: { vocab: ids(vocabL.l1) },
    explain: [{ heading: 'The polite ます form', body: ['Verbs in the polite present end in ます: たべます (eat), のみます (drink), みます (watch), ききます (listen), よみます (read), かきます (write). The same form is used for habits and the near future.'], examples: [{ ja: 'おちゃ を のみます', reading: 'ocha o nomimasu', en: 'I drink tea.' }, { ja: 'ほん を よみます', reading: 'hon o yomimasu', en: 'I read a book.' }] }],
    practice: { question_ids: qs('vb01', 'vb02', 'vb03', 'vb04', 'vb05', 'vb06', 'vmt01', 'ty01', 'ty02', 'ty03', 'dc01', 'gl01', 'gl02') },
    exit_check: { question_ids: qs('vb01', 'vb03', 'vb05', 'vb06', 'vmt01', 'ty01', 'gl01'), pass: 0.7 } }),
  L('n5_u08_l2', { title: 'Verbs II: go, come, buy, speak, sleep, wait', goal: 'Add ten more polite verbs.', introduces: { vocab: ids(vocabL.l2) },
    explain: [{ heading: 'Movement and daily routine', body: ['いきます (go), きます (come), かえります (go home), かいます (buy), はなします (speak), します (do), ねます (sleep), おきます (get up), あいます (meet), まちます (wait).'], examples: [{ ja: 'あさ ろくじ に おきます', reading: 'asa rokuji ni okimasu', en: 'I get up at six in the morning.' }] }],
    practice: { question_ids: qs('vb07', 'vb08', 'vb09', 'vb10', 'vb11', 'vb12', 'vb13', 'vb14', 'vb15', 'vb16', 'vmt02', 'ty04', 'ty05', 'ty06', 'ty07', 'dc04', 'gl03', 'gl04') },
    exit_check: { question_ids: qs('vb07', 'vb09', 'vb12', 'vb14', 'vmt02', 'ty04', 'gl03', 'dc04'), pass: 0.7 } }),
  L('n5_u08_l3', { title: 'Things to eat, do and enjoy', goal: 'Learn the nouns you pair with the verbs.', introduces: { vocab: ids(vocabL.l3) },
    explain: [{ heading: 'Objects of the verbs', body: ['Food: そば, うどん, だんご, せんべい, たいやき. Activities: おんがく (music), しごと (work), べんきょう (study), かいもの (shopping).'], examples: [{ ja: 'うどん を たべます', reading: 'udon o tabemasu', en: 'I eat udon.' }] }],
    practice: { question_ids: qs('tr02', 'tr03').concat(vmq(vocabL.l3)) },
    exit_check: { question_ids: qs('tr02', 'tr03'), pass: 0.7 } }),
  L('n5_u08_l4', { title: 'Time words and ます / ません', goal: 'Say when you do things and negate a verb.', introduces: { vocab: ids(vocabL.l4), grammar: ['g_masu_forms'] },
    explain: [{ heading: 'ます and ません', body: ['A polite verb is negated with ません: のみます → のみません. Add か for a question: のみます か. Answer with はい / いいえ.', 'Time words: まいにち (every day), あした (tomorrow), ひる (noon), ばん (evening) and いつ (when). With a clock time use に: ろくじ に おきます. With まいにち and あした no に is needed.'], examples: [{ ja: 'テレビ は みません', reading: 'terebi wa mimasen', en: 'I do not watch TV.' }] }],
    practice: { question_ids: qs('gm01', 'gm02', 'gm03', 'gm04', 'gm05', 'ty08', 'ty09', 'tr01', 'tr04', 'tr05', 'dc02', 'dc03').concat(vmq(vocabL.l4)) },
    context: { question_ids: qs('gm06', 'tr09', 'tr11') },
    exit_check: { question_ids: qs('gm01', 'gm02', 'gm03', 'gm04', 'gm05', 'tr04'), pass: 0.7 } }),
  L('n5_u08_l5', { title: 'を: the object', goal: 'Say what you eat, read and buy.', introduces: { grammar: ['g_wo_object'] },
    explain: [{ heading: 'Object を verb', body: ['を marks the thing the verb acts on: ごはん を たべます. Read it "o". The same pattern works with ください: そば を ください.'], examples: [{ ja: 'てがみ を かきます', reading: 'tegami o kakimasu', en: 'I write a letter.' }] }],
    practice: { question_ids: qs('gw01', 'gw02', 'gw03', 'gw04', 'gw05', 'gw06', 'gw07', 'so03', 'tr06') },
    exit_check: { question_ids: qs('gw01', 'gw02', 'gw03', 'gw04', 'gw06', 'so03', 'tr06'), pass: 0.7 } }),
  L('n5_u08_l6', { title: 'で and へ: places and means', goal: 'Say where you do things, how you go, and where to.', introduces: { vocab: ids(vocabL.l6), grammar: ['g_de_place_means', 'g_he_direction'] },
    explain: [{ heading: 'で: where and how', body: ['で marks the place of an action (スーパー で かいます) and the means (バス で いきます).'], examples: [{ ja: 'バス で いきます', reading: 'basu de ikimasu', en: 'I go by bus.' }] },
      { heading: 'へ: toward a place', body: ['へ marks the destination and is pronounced "e": がっこう へ いきます. Ask どこ へ いきます か.'], examples: [{ ja: 'どこ へ いきます か', reading: 'doko e ikimasu ka', en: 'Where will you go?' }] }],
    practice: { question_ids: qs('gd01', 'gd02', 'gd03', 'gd04', 'gd05', 'gd06', 'gh01', 'gh02', 'gh03', 'gh04', 'gh05', 'gh06', 'so01', 'so02', 'tr07', 'tr12').concat(vmq(vocabL.l6)) },
    exit_check: { question_ids: qs('gd01', 'gd02', 'gd03', 'gh01', 'gh02', 'gh04', 'so01'), pass: 0.7 } }),
  L('n5_u08_l7', { title: 'Kanji for actions', goal: 'Read ten action kanji.', introduces: { kanji: ids(kanji) },
    explain: [{ heading: 'Verb kanji', body: ['Most verb kanji carry the start of the verb and the ending stays in kana: 食べます, 飲みます, 見ます, 行きます, 来ます, 読みます, 書きます, 話します, 買います, 聞きます.', 'Compare 見 (see) with 聞 (hear) and 読 (read) with 書 (write); they look alike.'], examples: [{ ja: '食べます', reading: 'tabemasu', en: 'eat' }, { ja: '行きます', reading: 'ikimasu', en: 'go' }] }],
    practice: { question_ids: qs('kd01', 'kd02', 'kd03', 'kd04', 'kd05', 'kd06', 'kd07', 'kd08', 'kd09', 'kd10', 'kk01', 'kk02', 'kk03', 'kk04', 'kk05', 'kk06', 'kk07', 'kk08', 'kk09', 'kk10', 'kmt01', 'kmt02', 'kcf01', 'kcf02', 'kcf03') },
    exit_check: { question_ids: qs('kd01', 'kd04', 'kd06', 'kd10', 'kk01', 'kk04', 'kk06', 'kmt01', 'kcf01'), pass: 0.7 } }),
  L('n5_u08_l8', { title: 'A walk in the temple town', goal: 'Handle a visit to a temple and snack stalls.', introduces: { vocab: ids(vocabL.l8) },
    explain: [{ heading: 'At the temple and the stall', body: ['おてら (temple), おまいり (praying), おみくじ (fortune slip), メニュー. Ask for things with を ください.'], examples: [{ ja: 'メニュー を ください', reading: 'menyuu o kudasai', en: 'The menu, please.' }] }],
    practice: { question_ids: qs('dg01', 'dg02', 'dg03', 'dg04', 'dg05', 'dg06', 'dg07', 'tr08', 'tr10').concat(vmq(vocabL.l8)) },
    exit_check: { question_ids: qs('dg01', 'dg03', 'dg04', 'dg05', 'dg06'), pass: 0.7 } }),
  L('n5_u08_l9', { title: 'Listen and read', goal: 'Follow short routines by ear and read a menu and notes.', introduces: {},
    explain: [{ heading: 'Short routines', body: ['Listen for the verb ending: ます or ません.'], examples: [{ ja: 'テレビ は みません', reading: 'terebi wa mimasen', en: 'I do not watch TV.' }] }],
    practice: { question_ids: qs('gl05', 'gl06', 'gl07', 'gl08') },
    context: { question_ids: qs('rq01', 'rq02', 'rq03', 'rq04', 'rq05', 'rq06', 'rq07', 'rq08', 'rq09', 'rq10') },
    exit_check: { question_ids: qs('gl05', 'gl06', 'gl07', 'rq01', 'rq05', 'rq08'), pass: 0.7 } }),
  L('n5_u08_l10', { title: 'Review: units 1 to 8', goal: 'Mix words from the first eight units.', introduces: {},
    explain: [{ heading: 'Review', body: ['Earlier words return to keep them fresh.'], examples: [{ ja: 'ばん に テレビ を みます', reading: 'ban ni terebi o mimasu', en: 'I watch TV in the evening.' }] }],
    practice: { question_ids: spiralIds.slice(0, 20) },
    context: { question_ids: spiralIds.slice(20, 44) },
    exit_check: { question_ids: spiralIds.slice(0, 5).concat(spiralIds.slice(44, 48)), pass: 0.7 } }),
];

// ---------- Asakusa quest (QT_MENU): 10 items, 3+ from earlier units ----------
const quests = [{ id: 'q_asakusa_1', destination_id: 'asakusa', type: 'QT_MENU', unit_id: 'n5_u08', min_accuracy: 0.8, provenance: 'orig',
  question_ids: ['q_n5u08_rq01', 'q_n5u08_rq02', 'q_n5u08_rq03', 'q_n5u08_rq04', 'q_n5u08_dg04', 'q_n5u08_dg05', 'q_n5u08_dg03', 'q_n5u05_rq01', 'q_n5u05_rq02', 'q_n5u05_dg03'],
  spiral_question_ids: ['q_n5u05_rq01', 'q_n5u05_rq02', 'q_n5u05_dg03'] }];

export default { vocab, kanji, sentences, questions, listening, passages, lessons, dialogues, grammar, quests };
