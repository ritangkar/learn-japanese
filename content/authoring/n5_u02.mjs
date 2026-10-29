// n5_u02 "Finish hiragana; first greetings" - hand-written original content.
// Kana scope: all remaining hiragana (h, m, y, r, w rows, ん, voiced and p-sounds). Everything here uses only hiragana known by its lesson.
import { unit, choices, countChars, meaningQuestions } from '../../scripts/lib/author-helpers.mjs';
import u01 from './n5_u01.mjs';

const U = unit('n5_u02');
const { vocab: V, sentence: S, question: Q, lesson: L, listening: LS, passage: PS, dialogue: DG, grammar: GR } = U;

// ---------- vocabulary ----------
const vocabL = {
  l1: [
    V('hito', 'ひと', 'ひと', ['person'], 'noun', ['s_n5u02_01', 's_n5u02_14']),
    V('fune', 'ふね', 'ふね', ['boat', 'ship'], 'noun', ['s_n5u02_02', 's_n5u02_38']),
    V('hoshi', 'ほし', 'ほし', ['star'], 'noun', ['s_n5u02_03', 's_n5u02_39']),
    V('machi', 'まち', 'まち', ['town', 'city district'], 'noun', ['s_n5u02_02', 's_n5u02_13']),
    V('mise', 'みせ', 'みせ', ['shop', 'store'], 'noun', ['s_n5u02_03']),
    V('mochi', 'もち', 'もち', ['rice cake'], 'noun', ['s_n5u02_41'], { destination_tags: ['asakusa'] }),
    V('mushi', 'むし', 'むし', ['insect', 'bug'], 'noun', ['s_n5u02_40']),
    V('kumo', 'くも', 'くも', ['cloud'], 'noun', ['s_n5u02_06']),
    V('hana', 'はな', 'はな', ['flower'], 'noun', ['s_n5u02_08'], { note: 'はな also means "nose" (written differently in kanji and said with a different pitch). In this course it means "flower".' }),
    V('okane', 'おかね', 'おかね', ['money'], 'noun', ['s_n5u02_42'], { destination_tags: ['konbini'] }),
  ],
  l2: [
    V('yama', 'やま', 'やま', ['mountain'], 'noun', ['s_n5u02_07', 's_n5u02_10']),
    V('yuki', 'ゆき', 'ゆき', ['snow'], 'noun', ['s_n5u02_07', 's_n5u02_44']),
    V('yoru', 'よる', 'よる', ['night', 'evening'], 'noun', ['s_n5u02_09']),
    V('sakura', 'さくら', 'さくら', ['cherry blossom', 'cherry tree'], 'noun', ['s_n5u02_10']),
    V('onna', 'おんな', 'おんな', ['woman', 'female'], 'noun', ['s_n5u02_14']),
    V('hon', 'ほん', 'ほん', ['book'], 'noun', ['s_n5u02_01', 's_n5u02_11', 's_n5u02_36']),
    V('sensei', 'せんせい', 'せんせい', ['teacher'], 'noun', ['s_n5u02_11', 's_n5u02_21']),
    V('nihon', 'にほん', 'にほん', ['Japan'], 'noun (proper)', ['s_n5u02_13'], { note: 'Also read にっぽん (nippon).' }),
    V('watashi', 'わたし', 'わたし', ['I', 'me'], 'pronoun', ['s_n5u02_12']),
    V('kawa', 'かわ', 'かわ', ['river'], 'noun', ['s_n5u02_19']),
    V('sora', 'そら', 'そら', ['sky'], 'noun', ['s_n5u02_06']),
    V('haru', 'はる', 'はる', ['spring'], 'noun', ['s_n5u02_08']),
    V('roku', 'ろく', 'ろく', ['six (6)'], 'number', ['s_n5u02_16']),
    V('kuruma', 'くるま', 'くるま', ['car'], 'noun', ['s_n5u02_04']),
    V('yasai', 'やさい', 'やさい', ['vegetables'], 'noun', ['s_n5u02_15']),
    V('yume', 'ゆめ', 'ゆめ', ['dream'], 'noun', ['s_n5u02_17']),
    V('kotori', 'ことり', 'ことり', ['small bird'], 'noun', ['s_n5u02_18']),
    V('atarashii', 'あたらしい', 'あたらしい', ['new'], 'i-adjective', ['s_n5u02_04', 's_n5u02_31']),
    V('furui', 'ふるい', 'ふるい', ['old (not for people)'], 'i-adjective', ['s_n5u02_05'], { note: 'Used for things, not for a person\'s age.' }),
    V('youkoso', 'ようこそ', 'ようこそ', ['welcome'], 'expression', ['s_n5u02_43'], { destination_tags: ['tokyo'] }),
  ],
  l3: [
    V('gohan', 'ごはん', 'ごはん', ['cooked rice', 'meal'], 'noun', ['s_n5u02_20', 's_n5u02_35']),
    V('nihongo', 'にほんご', 'にほんご', ['Japanese (language)'], 'noun', ['s_n5u02_21']),
    V('eiga', 'えいが', 'えいが', ['movie', 'film'], 'noun', ['s_n5u02_45']),
    V('kagi', 'かぎ', 'かぎ', ['key'], 'noun', ['s_n5u02_46']),
    V('tomodachi', 'ともだち', 'ともだち', ['friend'], 'noun', ['s_n5u02_23']),
    V('denwa', 'でんわ', 'でんわ', ['telephone', 'phone call'], 'noun', ['s_n5u02_22']),
    V('douzo', 'どうぞ', 'どうぞ', ['please (go ahead / here you are)'], 'expression', ['s_n5u02_47']),
    V('zou', 'ぞう', 'ぞう', ['elephant'], 'noun', ['s_n5u02_27']),
    V('mado', 'まど', 'まど', ['window'], 'noun', ['s_n5u02_25']),
    V('mizu', 'みず', 'みず', ['water'], 'noun', ['s_n5u02_19', 's_n5u02_30']),
    V('deguchi', 'でぐち', 'でぐち', ['exit'], 'noun', ['s_n5u02_26'], { destination_tags: ['tokyo_station'] }),
    V('iriguchi', 'いりぐち', 'いりぐち', ['entrance'], 'noun', ['s_n5u02_26'], { destination_tags: ['tokyo_station'] }),
    V('ringo', 'りんご', 'りんご', ['apple'], 'noun', ['s_n5u02_28']),
    V('kodomo', 'こども', 'こども', ['child'], 'noun', ['s_n5u02_24']),
  ],
  l4: [
    V('kaban', 'かばん', 'かばん', ['bag'], 'noun', ['s_n5u02_29', 's_n5u02_37']),
    V('tabemono', 'たべもの', 'たべもの', ['food'], 'noun', ['s_n5u02_30']),
    V('enpitsu', 'えんぴつ', 'えんぴつ', ['pencil'], 'noun', ['s_n5u02_37']),
    V('boushi', 'ぼうし', 'ぼうし', ['hat', 'cap'], 'noun', ['s_n5u02_31']),
    V('tenpura', 'てんぷら', 'てんぷら', ['tempura'], 'noun', ['s_n5u02_32']),
    V('pan', 'ぱん', 'ぱん', ['bread'], 'noun', ['s_n5u02_33']),
    V('sanpo', 'さんぽ', 'さんぽ', ['walk', 'stroll'], 'noun', ['s_n5u02_34']),
    V('budou', 'ぶどう', 'ぶどう', ['grapes'], 'noun', ['s_n5u02_28']),
    V('obentou', 'おべんとう', 'おべんとう', ['boxed lunch'], 'noun', ['s_n5u02_35']),
    V('shinbun', 'しんぶん', 'しんぶん', ['newspaper'], 'noun', ['s_n5u02_36']),
  ],
  l5: [
    V('ohayou', 'おはよう', 'おはよう', ['good morning (casual)'], 'expression', ['s_n5u02_g01'], { register: 'casual' }),
    V('ohayougozaimasu', 'おはようございます', 'おはようございます', ['good morning (polite)'], 'expression', ['s_n5u02_g02'], { register: 'polite', destination_tags: ['tokyo'] }),
    V('konnichiwa', 'こんにちは', 'こんにちは', ['hello', 'good afternoon'], 'expression', ['s_n5u02_g03'], { romaji_spoken: 'konnichiwa', note: 'The last は is pronounced "wa" in this greeting.', destination_tags: ['tokyo'] }),
    V('konbanwa', 'こんばんは', 'こんばんは', ['good evening'], 'expression', ['s_n5u02_g04'], { romaji_spoken: 'konbanwa', note: 'The last は is pronounced "wa" in this greeting.' }),
    V('oyasuminasai', 'おやすみなさい', 'おやすみなさい', ['good night (before sleep)'], 'expression', ['s_n5u02_g05']),
    V('arigatou', 'ありがとう', 'ありがとう', ['thank you (casual)'], 'expression', ['s_n5u02_g06'], { register: 'casual' }),
    V('arigatougozaimasu', 'ありがとうございます', 'ありがとうございます', ['thank you (polite)'], 'expression', ['s_n5u02_g07'], { register: 'polite', destination_tags: ['tokyo_station'] }),
    V('douitashimashite', 'どういたしまして', 'どういたしまして', ["you're welcome"], 'expression', ['s_n5u02_g08']),
    V('sumimasen', 'すみません', 'すみません', ['excuse me', "I'm sorry", 'thank you for your trouble'], 'expression', ['s_n5u02_g09'], { note: 'Very common: it gets someone\'s attention, apologises lightly, or thanks them for going to trouble.', destination_tags: ['tokyo_station'] }),
    V('gomennasai', 'ごめんなさい', 'ごめんなさい', ["I'm sorry"], 'expression', ['s_n5u02_g10']),
    V('sayounara', 'さようなら', 'さようなら', ['goodbye'], 'expression', ['s_n5u02_g11'], { note: 'Fairly final. Friends often use other words, which you will learn later.' }),
    V('hajimemashite', 'はじめまして', 'はじめまして', ['nice to meet you (first meeting)'], 'expression', ['s_n5u02_g12']),
    V('yoroshiku', 'よろしくおねがいします', 'よろしくおねがいします', ['please treat me well; nice to meet you'], 'expression', ['s_n5u02_g13'], { register: 'polite' }),
    V('hai', 'はい', 'はい', ['yes'], 'expression', ['s_n5u02_g14']),
    V('iie', 'いいえ', 'いいえ', ['no'], 'expression', ['s_n5u02_g15']),
    V('itadakimasu', 'いただきます', 'いただきます', ['said before eating'], 'expression', ['s_n5u02_g16'], { note: 'There is no exact English equivalent: a polite phrase said before a meal.' }),
    V('gochisousama', 'ごちそうさまでした', 'ごちそうさまでした', ['said after eating (thank you for the meal)'], 'expression', ['s_n5u02_g17']),
    V('tadaima', 'ただいま', 'ただいま', ["I'm home"], 'expression', ['s_n5u02_g18']),
    V('okaerinasai', 'おかえりなさい', 'おかえりなさい', ['welcome back (home)'], 'expression', ['s_n5u02_g19']),
  ],
};
const vocab = Object.values(vocabL).flat();
const v = (id) => `v_${id}`;

// ---------- phrases and expressions ----------
const ph = (n, text, en, ids) => S(`s_n5u02_${n}`, 'phrase', text, text, en, ids.map(v));
const ex = (n, text, en, ids, extra = {}) => S(`s_n5u02_${n}`, 'expression', text, text, en, ids.map(v), extra);
const sentences = [
  ph('01', 'ひと の ほん', "a person's book", ['hito', 'hon']), ph('02', 'おおきい まち', 'a big town', ['machi']), ph('03', 'ちいさい みせ', 'a small shop', ['mise']), ph('04', 'あたらしい くるま', 'a new car', ['atarashii', 'kuruma']),
  ph('05', 'ふるい いえ', 'an old house', ['furui']), ph('06', 'くも と そら', 'clouds and sky', ['kumo', 'sora']), ph('07', 'やま の ゆき', 'mountain snow', ['yama', 'yuki']), ph('08', 'はる の はな', 'spring flowers', ['haru', 'hana']),
  ph('09', 'よる の つき', 'the night moon', ['yoru']), ph('10', 'さくら と やま', 'cherry blossoms and mountains', ['sakura', 'yama']), ph('11', 'せんせい の ほん', "the teacher's book", ['sensei', 'hon']), ph('12', 'わたし の かさ', 'my umbrella', ['watashi']),
  ph('13', 'にほん の まち', 'a town in Japan', ['nihon', 'machi']), ph('14', 'おんな の ひと', 'a woman', ['onna', 'hito']), ph('15', 'やさい と にく', 'vegetables and meat', ['yasai']), ph('16', 'ろく と いち', 'six and one', ['roku']),
  ph('17', 'ゆめ と うた', 'dreams and songs', ['yume']), ph('18', 'ことり の こえ', "a small bird's voice", ['kotori']), ph('19', 'かわ の みず', 'river water', ['kawa', 'mizu']), ph('20', 'ごはん と さかな', 'rice and fish', ['gohan']),
  ph('21', 'にほんご の せんせい', 'a Japanese teacher', ['nihongo', 'sensei']), ph('22', 'でんわ の おと', 'the sound of a phone', ['denwa']), ph('23', 'ともだち の いえ', "a friend's house", ['tomodachi']), ph('24', 'こども の くつ', "a child's shoes", ['kodomo']),
  ph('25', 'まど の うえ', 'above the window', ['mado']), ph('26', 'でぐち と いりぐち', 'exit and entrance', ['deguchi', 'iriguchi']), ph('27', 'ぞう と ねこ', 'an elephant and a cat', ['zou']), ph('28', 'りんご と ぶどう', 'apples and grapes', ['ringo', 'budou']),
  ph('29', 'かばん と かさ', 'a bag and an umbrella', ['kaban']), ph('30', 'たべもの と みず', 'food and water', ['tabemono']), ph('31', 'あたらしい ぼうし', 'a new hat', ['boushi']), ph('32', 'おいしい てんぷら', 'delicious tempura', ['tenpura']),
  ph('33', 'おいしい ぱん', 'delicious bread', ['pan']), ph('34', 'あさ の さんぽ', 'a morning walk', ['sanpo']), ph('35', 'おべんとう の ごはん', 'the rice in the boxed lunch', ['obentou']), ph('36', 'しんぶん と ほん', 'newspaper and book', ['shinbun']),
  ph('37', 'えんぴつ と かばん', 'a pencil and a bag', ['enpitsu']), ph('38', 'ふね の おと', 'the sound of a boat', ['fune']), ph('39', 'ほし と つき', 'stars and moon', ['hoshi']), ph('40', 'むし の こえ', 'the voices of insects', ['mushi']),
  ph('41', 'もち と おかし', 'rice cake and sweets', ['mochi']), ph('42', 'おかね と とけい', 'money and a clock', ['okane']), ex('43', 'ようこそ', 'Welcome!', ['youkoso']), ph('44', 'ゆき の あさ', 'a snowy morning', ['yuki']),
  ph('45', 'えいが と うた', 'movies and songs', ['eiga']), ph('46', 'かぎ と かさ', 'a key and an umbrella', ['kagi']), ex('47', 'どうぞ', 'Please, go ahead. / Here you are.', ['douzo']),
  ex('g01', 'おはよう', 'Good morning. (casual: to friends and family)', ['ohayou']), ex('g02', 'おはようございます', 'Good morning. (polite)', ['ohayougozaimasu']),
  ex('g03', 'こんにちは', 'Hello. / Good afternoon.', ['konnichiwa']), ex('g04', 'こんばんは', 'Good evening.', ['konbanwa']), ex('g05', 'おやすみなさい', 'Good night. (before going to bed)', ['oyasuminasai']),
  ex('g06', 'ありがとう', 'Thank you. (casual)', ['arigatou']), ex('g07', 'ありがとうございます', 'Thank you. (polite)', ['arigatougozaimasu']), ex('g08', 'どういたしまして', "You're welcome.", ['douitashimashite']),
  ex('g09', 'すみません', 'Excuse me. / Sorry. / Thank you for your trouble.', ['sumimasen']), ex('g10', 'ごめんなさい', "I'm sorry.", ['gomennasai']), ex('g11', 'さようなら', 'Goodbye.', ['sayounara']),
  ex('g12', 'はじめまして', 'Nice to meet you. (said at a first meeting)', ['hajimemashite']), ex('g13', 'よろしくおねがいします', 'Please treat me well. / Nice to meet you. (said after introducing yourself)', ['yoroshiku']),
  ex('g14', 'はい', 'Yes.', ['hai']), ex('g15', 'いいえ', 'No.', ['iie']), ex('g16', 'いただきます', 'Thank you for the food. (said before eating)', ['itadakimasu']),
  ex('g17', 'ごちそうさまでした', 'Thank you for the meal. (said after eating)', ['gochisousama']), ex('g18', 'ただいま', "I'm home.", ['tadaima']), ex('g19', 'おかえりなさい', 'Welcome back.', ['okaerinasai']),
];
// reply-only lines used by dialogues
sentences.push(ex('g20', 'こちらこそ', 'Likewise. (the pleasure is mine)', [], {}));
sentences.find((s) => s.id === 's_n5u02_g20').vocab_ids = [];

const questions = [];
const add = (...q) => questions.push(...q);
const sent = (id) => sentences.find((s) => s.id === id);

// kana recognition (authored with per-distractor notes)
const kr = (n, ch, rom, others, note, kid) => Q(`q_n5u02_kr${n}`, 'kana_recog', { stem: { prompt: 'Which sound is this kana?', ja: ch }, choices: choices([['a', rom], ...others.map((o, i) => [`d${i + 1}`, o])]), answer: 'a', explanation_correct: note, explanation_per_distractor: Object.fromEntries(others.map((o, i) => [`d${i + 1}`, `That is not the sound of ${ch}.`])), facet: 'read', targets: [kid], difficulty: 1 });
add(kr('01', 'は', 'ha', ['ho', 'ma'], 'は is "ha". (As a separate little word it is read "wa"; you will meet that soon.)', 'ka_h_ha'), kr('02', 'ふ', 'fu', ['hu', 'bu'], 'ふ is "fu": a soft sound between "h" and "f", made with both lips.', 'ka_h_fu'), kr('03', 'め', 'me', ['nu', 'ne'], 'め is "me".', 'ka_h_me'),
  kr('04', 'る', 'ru', ['ro', 'ri'], 'る is "ru".', 'ka_h_ru'), kr('05', 'ろ', 'ro', ['ru', 'ra'], 'ろ is "ro". It looks like る but has no loop at the end.', 'ka_h_ro'), kr('06', 'わ', 'wa', ['re', 'ne'], 'わ is "wa".', 'ka_h_wa'),
  kr('07', 'ん', 'n', ['nu', 'mu'], 'ん is the single consonant "n" and takes one beat of its own.', 'ka_h_n'), kr('08', 'ぎ', 'gi', ['ki', 'ji'], 'ぎ is き with the two dots: "gi".', 'ka_h_gi'), kr('09', 'ざ', 'za', ['sa', 'da'], 'ざ is さ with the dots: "za".', 'ka_h_za'),
  kr('10', 'ぱ', 'pa', ['ba', 'ha'], 'ぱ is は with a small circle: "pa".', 'ka_h_pa'), kr('11', 'ぞ', 'zo', ['so', 'do'], 'ぞ is そ with the dots: "zo".', 'ka_h_zo'), kr('12', 'べ', 'be', ['he', 'pe'], 'べ is へ with the dots: "be".', 'ka_h_be'));
const rc = (n, rom, ch, kid) => Q(`q_n5u02_rc${n}`, 'kana_recall', { stem: { prompt: `Write the hiragana for "${rom}".` }, answer: ch, explanation_correct: `"${rom}" is written ${ch}.`, facet: 'produce', targets: [kid], difficulty: 2 });
add(rc('01', 'ha', 'は', 'ka_h_ha'), rc('02', 'mi', 'み', 'ka_h_mi'), rc('03', 'ya', 'や', 'ka_h_ya'), rc('04', 're', 'れ', 'ka_h_re'), rc('05', 'ga', 'が', 'ka_h_ga'), rc('06', 'da', 'だ', 'ka_h_da'), rc('07', 'bo', 'ぼ', 'ka_h_bo'), rc('08', 'pu', 'ぷ', 'ka_h_pu'));
const mt = (n, pairs, ids, note) => Q(`q_n5u02_mt${n}`, 'matching', { stem: { prompt: 'Match each kana with its sound.' }, pairs, answer: pairs.map((p) => p[0]), explanation_correct: note, facet: 'read', targets: ids, difficulty: 1 });
add(mt('01', [['は', 'ha'], ['ひ', 'hi'], ['ふ', 'fu'], ['へ', 'he'], ['ほ', 'ho']], ['ka_h_ha', 'ka_h_hi', 'ka_h_fu', 'ka_h_he', 'ka_h_ho'], 'The h row; ふ is "fu".'),
  mt('02', [['ま', 'ma'], ['み', 'mi'], ['む', 'mu'], ['め', 'me'], ['も', 'mo']], ['ka_h_ma', 'ka_h_mi', 'ka_h_mu', 'ka_h_me', 'ka_h_mo'], 'The m row.'),
  mt('03', [['や', 'ya'], ['ゆ', 'yu'], ['よ', 'yo'], ['ら', 'ra'], ['り', 'ri'], ['る', 'ru']], ['ka_h_ya', 'ka_h_yu', 'ka_h_yo', 'ka_h_ra', 'ka_h_ri', 'ka_h_ru'], 'The y row has only three kana; the r row follows.'),
  mt('04', [['が', 'ga'], ['ぎ', 'gi'], ['ぐ', 'gu'], ['げ', 'ge'], ['ご', 'go']], ['ka_h_ga', 'ka_h_gi', 'ka_h_gu', 'ka_h_ge', 'ka_h_go'], 'Two dots turn k into g.'),
  mt('05', [['ざ', 'za'], ['じ', 'ji'], ['ず', 'zu'], ['ぜ', 'ze'], ['ぞ', 'zo']], ['ka_h_za', 'ka_h_ji', 'ka_h_zu', 'ka_h_ze', 'ka_h_zo'], 'Two dots turn s into z; じ is "ji".'),
  mt('06', [['ば', 'ba'], ['び', 'bi'], ['ぶ', 'bu'], ['べ', 'be'], ['ぼ', 'bo']], ['ka_h_ba', 'ka_h_bi', 'ka_h_bu', 'ka_h_be', 'ka_h_bo'], 'Two dots turn h into b.'),
  mt('07', [['ぱ', 'pa'], ['ぴ', 'pi'], ['ぷ', 'pu'], ['ぺ', 'pe'], ['ぽ', 'po']], ['ka_h_pa', 'ka_h_pi', 'ka_h_pu', 'ka_h_pe', 'ka_h_po'], 'A small circle turns h into p.'));
add(...meaningQuestions(Q, vocab));

// spiral review of unit 1 words (templated from the unit 1 vocabulary table; reported separately as templated)
{
  const old = u01.vocab; const first = (x) => x.meanings_en[0];
  const pick = old.filter((_, i) => i % 3 !== 2).slice(0, 32);
  pick.forEach((w, i) => {
    const cands = old.filter((c) => c.id !== w.id && first(c) !== first(w)).filter((_, k) => (k + i) % 5 === 0).slice(0, 3);
    const ordered = [cands[0], w, cands[1], cands[2]].filter(Boolean);
    const ids4 = ['a', 'b', 'c', 'd'];
    add(Q(`q_n5u02_sr_${w.id.slice(2)}`, 'mcq', { stem: { prompt: `Which word means "${first(w)}"?` }, choices: ordered.map((o, k) => ({ id: ids4[k], text: o.surface, ja: true, concept: o.id })), answer: ids4[ordered.indexOf(w)], explanation_correct: `"${first(w)}" is ${w.surface} (${w.romaji}).`, explanation_per_distractor: Object.fromEntries(ordered.map((o, k) => [ids4[k], `${o.surface} means "${first(o)}".`]).filter((_, k) => ordered[k] !== w)), facet: 'produce', targets: [w.id], difficulty: 1, tags: ['templated', 'spiral'] }));
  });
}
// phrase translation (all kana known by the end of lesson 4: used in the context step of lesson 6)
const tr = (n, sid, correct, wrong, note) => { const s = sent(sid); return Q(`q_n5u02_tr${n}`, 'translate', { stem: { prompt: 'Choose the meaning.', ja: s.text_ja }, choices: choices([['a', correct], ['b', wrong[0]], ['c', wrong[1]]]), answer: 'a', explanation_correct: note, explanation_per_distractor: { b: `That is not what ${s.text_ja} says.`, c: `That is not what ${s.text_ja} says.` }, facet: 'meaning', targets: s.vocab_ids.concat(['v_ookii', 'v_chiisai', 'v_neko', 'v_kasa', 'v_oishii', 'v_okashi', 'v_sushi', 'v_kutsu'].filter((x) => s.text_ja && false)), source_sentence_id: sid, difficulty: 2 }); };
add(tr('01', 's_n5u02_01', "a person's book", ['a book of cats', "a person's umbrella"], 'ひと = person, ほん = book; の links them.'), tr('02', 's_n5u02_04', 'a new car', ['an old car', 'a new house'], 'あたらしい = new, くるま = car.'),
  tr('03', 's_n5u02_07', 'mountain snow', ['mountain river', 'snow on a roof'], 'やま = mountain, ゆき = snow.'), tr('04', 's_n5u02_09', 'the night moon', ['the morning moon', 'the night sun'], 'よる = night, つき = moon.'),
  tr('05', 's_n5u02_13', 'a town in Japan', ['a Japanese teacher', 'a town of friends'], 'にほん = Japan; にほん の まち = a town of Japan.'), tr('06', 's_n5u02_21', 'a Japanese teacher', ['a Japanese book', 'a teacher of friends'], 'にほんご = the Japanese language, せんせい = teacher.'),
  tr('07', 's_n5u02_26', 'exit and entrance', ['exit and window', 'entrance and station'], 'でぐち = exit, いりぐち = entrance.'), tr('08', 's_n5u02_32', 'delicious tempura', ['delicious bread', 'small tempura'], 'おいしい = delicious, てんぷら = tempura.'),
  tr('09', 's_n5u02_35', 'the rice in the boxed lunch', ['the bread in the bag', 'a boxed lunch and a book'], 'おべんとう = boxed lunch, ごはん = rice.'), tr('10', 's_n5u02_19', 'river water', ['river fish', 'rain water'], 'かわ = river, みず = water.'),
  tr('11', 's_n5u02_23', "a friend's house", ["a friend's shoes", 'a house of teachers'], 'ともだち = friend; ともだち の いえ = a friend\'s house.'), tr('12', 's_n5u02_28', 'apples and grapes', ['apples and bread', 'grapes and fish'], 'りんご = apple, ぶどう = grapes.'));
// spiral: ties u02 words back to u01 words and kana (targets include earlier-unit items)
const sp = (n, ja, prompt, ch, ans, note, targets, sid) => Q(`q_n5u02_sp${n}`, 'fill_blank', { stem: { prompt, ja }, choices: choices(ch.map(([id, t]) => [id, t, true])), answer: ans, explanation_correct: note, explanation_per_distractor: Object.fromEntries(ch.filter(([id]) => id !== ans).map(([id, t]) => [id, `${t} does not fit the meaning.`])), facet: 'construct', targets, source_sentence_id: sid || null, difficulty: 2 });
add(
  sp('01', 'ちいさい ＿＿', 'Complete: a small shop', [['a', 'みせ'], ['b', 'すし'], ['c', 'いか']], 'a', 'みせ = shop.', ['v_mise', 'v_chiisai'], 's_n5u02_03'),
  sp('02', 'おおきい ＿＿', 'Complete: a big town', [['a', 'かさ'], ['b', 'まち'], ['c', 'ねこ']], 'b', 'まち = town.', ['v_machi', 'v_ookii'], 's_n5u02_02'),
  sp('03', 'あかい ＿＿', 'Complete: a red car', [['a', 'くるま'], ['b', 'さかな'], ['c', 'こえ']], 'a', 'くるま = car.', ['v_kuruma', 'v_akai']),
  sp('04', 'あおい ＿＿', 'Complete: blue sky', [['a', 'ひと'], ['b', 'そら'], ['c', 'いす']], 'b', 'そら = sky.', ['v_sora', 'v_aoi']),
  sp('05', 'おいしい ＿＿', 'Complete: delicious bread', [['a', 'ぱん'], ['b', 'ほし'], ['c', 'くも']], 'a', 'ぱん = bread.', ['v_pan', 'v_oishii'], 's_n5u02_33'),
  sp('06', 'ちいさい ＿＿', 'Complete: a small boat', [['a', 'ふね'], ['b', 'うし'], ['c', 'あき']], 'a', 'ふね = boat.', ['v_fune', 'v_chiisai'], 's_n5u02_02'),
  sp('07', 'あたらしい ＿＿', 'Complete: a new umbrella', [['a', 'ほん'], ['b', 'かさ'], ['c', 'やま']], 'b', 'かさ = umbrella.', ['v_kasa', 'v_atarashii']),
  sp('08', 'わたし の ＿＿', 'Complete: my shoes', [['a', 'くつ'], ['b', 'そら'], ['c', 'ゆめ']], 'a', 'くつ = shoes.', ['v_watashi', 'v_kutsu'], 's_n5u02_12'),
  sp('09', 'せんせい の ＿＿', "Complete: the teacher's cat", [['a', 'ねこ'], ['b', 'かわ'], ['c', 'まど']], 'a', 'ねこ = cat.', ['v_sensei', 'v_neko']),
  sp('10', 'あさ の ＿＿', 'Complete: a morning walk', [['a', 'さんぽ'], ['b', 'よる'], ['c', 'ゆき']], 'a', 'さんぽ = walk.', ['v_sanpo', 'v_asa'], 's_n5u02_34'),
  sp('11', 'なつ の ＿＿', 'Complete: a summer night', [['a', 'みず'], ['b', 'よる'], ['c', 'ほん']], 'b', 'よる = night.', ['v_yoru', 'v_natsu']),
  sp('12', 'ともだち と ＿＿', 'Complete: a friend and a cat', [['a', 'ねこ'], ['b', 'ふね'], ['c', 'でんわ']], 'a', 'ねこ = cat.', ['v_tomodachi', 'v_neko']),
);
const so = (n, prompt, tiles, ans, sid, note) => Q(`q_n5u02_so${n}`, 'sentence_order', { stem: { prompt }, tiles, answer: ans, explanation_correct: note, facet: 'construct', targets: sent(sid).vocab_ids, source_sentence_id: sid, difficulty: 2 });
add(so('01', 'Put the words in order: a new car', ['くるま', 'あたらしい'], ['あたらしい', 'くるま'], 's_n5u02_04', 'The describing word comes first.'), so('02', "Put the words in order: a friend's house", ['の', 'いえ', 'ともだち'], ['ともだち', 'の', 'いえ'], 's_n5u02_23', 'A の B means "B of A".'),
  so('03', 'Put the words in order: apples and grapes', ['ぶどう', 'と', 'りんご'], ['りんご', 'と', 'ぶどう'], 's_n5u02_28', 'と goes between the two nouns.'), so('04', 'Put the words in order: a Japanese teacher', ['せんせい', 'の', 'にほんご'], ['にほんご', 'の', 'せんせい'], 's_n5u02_21', 'にほんご の せんせい.'));
const ty = (n, en, ans, vid, alt = null) => Q(`q_n5u02_ty${n}`, 'typing_ja', { stem: { prompt: `Type "${en}" in hiragana (romaji is accepted).` }, answer: ans, accept_alternatives: alt, explanation_correct: `${en} = ${ans}.`, facet: 'produce', targets: [vid], difficulty: 2 });
add(ty('01', 'book', 'ほん', 'v_hon'), ty('02', 'water', 'みず', 'v_mizu'), ty('03', 'friend', 'ともだち', 'v_tomodachi'), ty('04', 'Japanese language', 'にほんご', 'v_nihongo'), ty('05', 'thank you (casual)', 'ありがとう', 'v_arigatou'), ty('06', 'goodbye', 'さようなら', 'v_sayounara'),
  ty('07', 'hello / good afternoon', 'こんにちは', 'v_konnichiwa', ['こんにちわ']), ty('08', 'yes', 'はい', 'v_hai'), ty('09', 'bread', 'ぱん', 'v_pan'), ty('10', 'cat', 'ねこ', 'v_neko'));
const dc = (n, word, vid, note) => Q(`q_n5u02_dc${n}`, 'dictation', { stem: { prompt: 'Listen, then type what you hear in hiragana (romaji is accepted).', audio_text: word }, answer: word, explanation_correct: note, facet: 'listen', targets: [vid], difficulty: 3, tags: ['listening_relevant'] });
add(dc('01', 'さくら', 'v_sakura', 'さくら (sakura) = cherry blossom.'), dc('02', 'やま', 'v_yama', 'やま (yama) = mountain.'), dc('03', 'ありがとう', 'v_arigatou', 'ありがとう (arigatou) = thank you.'), dc('04', 'でんわ', 'v_denwa', 'でんわ (denwa) = telephone.'));

// ---------- listening (greetings by ear) ----------
const gl = (n, lid, phrase, others, vid, note) => Q(`q_n5u02_gl${n}`, 'listening_comp', { stem: { prompt: 'What did you hear?', audio_text: phrase, context_id: lid }, choices: choices([['a', phrase, true], ...others.map((o, i) => [`d${i + 1}`, o, true])]), answer: 'a', explanation_correct: note, explanation_per_distractor: Object.fromEntries(others.map((o, i) => [`d${i + 1}`, `${o} sounds different: listen again for each beat.`])), facet: 'listen', targets: [vid], difficulty: 2, tags: ['listening_relevant'] });
add(gl('01', 'n5u02_ls1', 'おはようございます', ['こんばんは', 'おやすみなさい'], 'v_ohayougozaimasu', 'You heard おはようございます: polite "good morning".'),
  gl('02', 'n5u02_ls1', 'ありがとうございます', ['どういたしまして', 'すみません'], 'v_arigatougozaimasu', 'You heard ありがとうございます: polite "thank you".'),
  gl('03', 'n5u02_ls1', 'さようなら', ['こんにちは', 'ただいま'], 'v_sayounara', 'You heard さようなら: "goodbye".'),
  gl('04', 'n5u02_ls1', 'はじめまして', ['ごめんなさい', 'いただきます'], 'v_hajimemashite', 'You heard はじめまして: "nice to meet you".'),
  gl('05', 'n5u02_ls2', 'こんにちは', ['こんばんは', 'おはよう'], 'v_konnichiwa', 'You heard こんにちは (konnichiwa): "hello / good afternoon".'),
  gl('06', 'n5u02_ls2', 'いただきます', ['ごちそうさまでした', 'ただいま'], 'v_itadakimasu', 'You heard いただきます: said before eating.'),
  gl('07', 'n5u02_ls2', 'ごめんなさい', ['すみません', 'ありがとう'], 'v_gomennasai', 'You heard ごめんなさい: "I\'m sorry".'),
  gl('08', 'n5u02_ls2', 'おかえりなさい', ['ただいま', 'おやすみなさい'], 'v_okaerinasai', 'You heard おかえりなさい: "welcome back".'));
const listening = [
  LS('n5u02_ls1', { item_type: 'Verbal expressions (lesson practice)', title: 'Which greeting? Set 1', script_turns: ['おはようございます', 'ありがとうございます', 'さようなら', 'はじめまして'].map((t) => ({ speaker: 'A', text_ja: t })), question_ids: ['q_n5u02_gl01', 'q_n5u02_gl02', 'q_n5u02_gl03', 'q_n5u02_gl04'] }),
  LS('n5u02_ls2', { item_type: 'Verbal expressions (lesson practice)', title: 'Which greeting? Set 2', script_turns: ['こんにちは', 'いただきます', 'ごめんなさい', 'おかえりなさい'].map((t) => ({ speaker: 'A', text_ja: t })), question_ids: ['q_n5u02_gl05', 'q_n5u02_gl06', 'q_n5u02_gl07', 'q_n5u02_gl08'] }),
];

// ---------- dialogues ----------
const dialogues = [
  DG('n5u02_d1', { title: 'Good morning at the hotel', setting: 'tokyo', turns: [{ speaker: 'A', sentence_id: 's_n5u02_g02' }, { speaker: 'B', sentence_id: 's_n5u02_g02' }], comprehension_question_ids: ['q_n5u02_dg01'], register: 'polite' }),
  DG('n5u02_d2', { title: 'Meeting someone', setting: 'tokyo', turns: [{ speaker: 'A', sentence_id: 's_n5u02_g12' }, { speaker: 'B', sentence_id: 's_n5u02_g12' }, { speaker: 'B', sentence_id: 's_n5u02_g13' }, { speaker: 'A', sentence_id: 's_n5u02_g20' }], comprehension_question_ids: ['q_n5u02_dg02', 'q_n5u02_dg03'], register: 'polite' }),
  DG('n5u02_d3', { title: 'Thanks and a reply', setting: 'tokyo_station', turns: [{ speaker: 'A', sentence_id: 's_n5u02_g07' }, { speaker: 'B', sentence_id: 's_n5u02_g08' }], comprehension_question_ids: ['q_n5u02_dg04', 'q_n5u02_dg05'], register: 'polite' }),
  DG('n5u02_d4', { title: 'Before and after a meal', setting: 'tokyo', turns: [{ speaker: 'A', sentence_id: 's_n5u02_g16' }, { speaker: 'A', sentence_id: 's_n5u02_g17' }], comprehension_question_ids: ['q_n5u02_dg06'], register: 'polite' }),
  DG('n5u02_d5', { title: 'Coming home', setting: 'residential_street', turns: [{ speaker: 'A', sentence_id: 's_n5u02_g18' }, { speaker: 'B', sentence_id: 's_n5u02_g19' }], comprehension_question_ids: ['q_n5u02_dg07', 'q_n5u02_dg08'], register: 'neutral' }),
];
const dg = (n, did, prompt, ch, ans, note, targets) => Q(`q_n5u02_dg${n}`, 'dialogue_complete', { stem: { prompt, context_id: did }, choices: choices(ch), answer: ans, explanation_correct: note, explanation_per_distractor: Object.fromEntries(ch.filter(([id]) => id !== ans).map(([id, t]) => [id, `${t} would not be a natural reply here.`])), facet: 'meaning', targets, difficulty: 2 });
add(dg('01', 'n5u02_d1', 'It is morning. What does B say back?', [['a', 'おはようございます', true], ['b', 'こんばんは', true], ['c', 'さようなら', true]], 'a', 'Morning greetings are returned with the same greeting.', ['v_ohayougozaimasu']),
  dg('02', 'n5u02_d2', 'What is the first thing both people say?', [['a', 'はじめまして', true], ['b', 'ごめんなさい', true], ['c', 'ただいま', true]], 'a', 'はじめまして is said at a first meeting.', ['v_hajimemashite']),
  dg('03', 'n5u02_d2', 'Which line means "Please treat me well" (said after your name)?', [['a', 'よろしくおねがいします', true], ['b', 'どういたしまして', true], ['c', 'いただきます', true]], 'a', 'よろしくおねがいします closes a self-introduction politely.', ['v_yoroshiku']),
  dg('04', 'n5u02_d3', 'A says thank you. What does B answer?', [['a', 'どういたしまして', true], ['b', 'おはよう', true], ['c', 'いただきます', true]], 'a', 'どういたしまして = "you are welcome".', ['v_douitashimashite']),
  dg('05', 'n5u02_d3', 'What does A say?', [['a', 'Thank you.', false], ['b', 'Excuse me.', false], ['c', 'Goodbye.', false]], 'a', 'ありがとうございます is the polite "thank you".', ['v_arigatougozaimasu']),
  dg('06', 'n5u02_d4', 'Which line is said AFTER eating?', [['a', 'ごちそうさまでした', true], ['b', 'いただきます', true], ['c', 'はじめまして', true]], 'a', 'いただきます is before the meal; ごちそうさまでした is after.', ['v_gochisousama', 'v_itadakimasu']),
  dg('07', 'n5u02_d5', 'Someone comes home and says ただいま. What does the family answer?', [['a', 'おかえりなさい', true], ['b', 'こんにちは', true], ['c', 'どうぞ', true]], 'a', 'おかえりなさい = "welcome back".', ['v_okaerinasai', 'v_tadaima']),
  dg('08', 'n5u02_d5', 'What does ただいま mean?', [['a', "I'm home.", false], ['b', 'Good night.', false], ['c', 'Excuse me.', false]], 'a', 'ただいま is said on arriving home.', ['v_tadaima']));
// expression meaning (mcq): greetings in use (authored, with usage notes)
const gm = (n, ja, prompt, ch, ans, note, vid) => Q(`q_n5u02_gm${n}`, 'mcq', { stem: { prompt, ja }, choices: choices(ch), answer: ans, explanation_correct: note, explanation_per_distractor: Object.fromEntries(ch.filter(([id]) => id !== ans).map(([id]) => [id, 'That is a different situation.'])), facet: 'meaning', targets: [vid], difficulty: 2 });
add(gm('01', 'おやすみなさい', 'When do you say this?', [['a', 'Before going to bed'], ['b', 'On meeting someone'], ['c', 'Before eating']], 'a', 'おやすみなさい = "good night" (before sleeping).', 'v_oyasuminasai'),
  gm('02', null, 'You want to get a stranger\'s attention. Which word fits?', [['a', 'すみません', true], ['b', 'いただきます', true], ['c', 'ただいま', true]], 'a', 'すみません is the all-purpose "excuse me".', 'v_sumimasen'),
  gm('03', 'おはよう', 'Who would you say おはよう (without ございます) to?', [['a', 'A friend or family member'], ['b', 'A stranger at a hotel desk'], ['c', 'Nobody: it is rude']], 'a', 'The short form is casual; add ございます to be polite.', 'v_ohayou'),
  gm('04', 'こんばんは', 'Which time of day is こんばんは?', [['a', 'Evening'], ['b', 'Morning'], ['c', 'Midday']], 'a', 'こんばんは = "good evening". The は is pronounced "wa".', 'v_konbanwa'),
  gm('05', 'いいえ', 'What does いいえ mean?', [['a', 'No'], ['b', 'Yes'], ['c', 'Please']], 'a', 'いいえ = "no". はい = "yes".', 'v_iie'),
  gm('06', 'どうぞ', 'Someone holds a door and says どうぞ. What do they mean?', [['a', 'Please, go ahead'], ['b', 'Goodbye'], ['c', "I'm sorry"]], 'a', 'どうぞ = "please, go ahead / here you are".', 'v_douzo'));

// ---------- reading: station signs and a welcome note ----------
const r3 = ['いりぐち', 'でぐち', 'みず', 'どうぞ'];
const r4 = ['ようこそ', 'ひと の ほん', 'おいしい ぱん', 'ゆき の やま'];
const passages = [
  PS('n5u02_r1', { title: 'Station signs', paragraphs: r3, translation_en: 'Entrance / Exit / Water / Please (go ahead)', word_count_chars: countChars(r3), question_ids: ['q_n5u02_rq01', 'q_n5u02_rq02', 'q_n5u02_rq03'], genre: 'signs' }),
  PS('n5u02_r2', { title: 'Shop window', paragraphs: r4, translation_en: "Welcome / A person's book / Delicious bread / Snowy mountain", word_count_chars: countChars(r4), question_ids: ['q_n5u02_rq04', 'q_n5u02_rq05'], genre: 'signs' }),
];
const rq = (n, pid, prompt, ch, ans, note, tg, type = 'reading_comp') => Q(`q_n5u02_rq${n}`, type, { stem: { prompt, context_id: pid }, choices: choices(ch), answer: ans, explanation_correct: note, explanation_per_distractor: Object.fromEntries(ch.filter(([id]) => id !== ans).map(([id, t]) => [id, `Check the sign again: ${t} is not the answer.`])), facet: 'read', targets: tg, difficulty: 2 });
add(rq('01', 'n5u02_r1', 'Which sign shows the way IN?', [['a', 'いりぐち', true], ['b', 'でぐち', true], ['c', 'みず', true]], 'a', 'いりぐち = entrance.', ['v_iriguchi'], 'information_retrieval'),
  rq('02', 'n5u02_r1', 'Which sign shows the way OUT?', [['a', 'いりぐち', true], ['b', 'でぐち', true], ['c', 'どうぞ', true]], 'b', 'でぐち = exit.', ['v_deguchi'], 'information_retrieval'),
  rq('03', 'n5u02_r1', 'Which sign means "water"?', [['a', 'どうぞ', true], ['b', 'みず', true], ['c', 'でぐち', true]], 'b', 'みず = water.', ['v_mizu']),
  rq('04', 'n5u02_r2', 'Which line is a welcome?', [['a', 'ようこそ', true], ['b', 'おいしい ぱん', true], ['c', 'ゆき の やま', true]], 'a', 'ようこそ = welcome.', ['v_youkoso']),
  rq('05', 'n5u02_r2', 'Which line is about bread?', [['a', 'ひと の ほん', true], ['b', 'ようこそ', true], ['c', 'おいしい ぱん', true]], 'c', 'ぱん = bread.', ['v_pan']));
// fix reading helper fidelity: passage ids already point at questions

// ---------- grammar: greeting set expressions ----------
const grammar = [GR('g_greeting_set', { title: 'Set greeting expressions', pattern: 'fixed phrases (learn each as a whole)', meaning_en: 'Greetings are fixed expressions; the polite form adds ございます or ます endings.',
  explanation: ['Japanese greetings are fixed phrases: learn each one as a whole rather than word by word. They also change with the time of day and with how polite you need to be.', 'Many casual greetings have a polite form made by adding ございます: おはよう (casual) becomes おはようございます (polite), and ありがとう becomes ありがとうございます.', 'The は in こんにちは and こんばんは is pronounced "wa". It is a spelling convention left over from the past.'],
  structure_notes: 'Casual: おはよう, ありがとう. Polite: おはようございます, ありがとうございます.', examples: ['s_n5u02_g02', 's_n5u02_g07', 's_n5u02_g03'], common_mistakes: ['Saying おはよう to a stranger or a boss (use おはようございます).', 'Reading こんにちは as "konnichiha": it is "konnichiwa".'], contrast_with: [], practice_question_ids: ['q_n5u02_dg01', 'q_n5u02_dg04', 'q_n5u02_dg06', 'q_n5u02_gm03', 'q_n5u02_ty05', 'q_n5u02_ty07', 'q_n5u02_gl01'], register: 'mixed', tags: ['greetings'] })];

// ---------- lessons ----------
const ids = (arr) => arr.map((x) => x.id);
const kids = (rom) => rom.map((r) => `ka_h_${r}`);
const qs = (...x) => x.map((n) => `q_n5u02_${n}`);
const vmq = (arr) => arr.map((x) => `q_n5u02_vm_${x.id.slice(2)}`);
const hRow = kids(['ha', 'hi', 'fu', 'he', 'ho']); const mRow = kids(['ma', 'mi', 'mu', 'me', 'mo']);
const yrw = kids(['ya', 'yu', 'yo', 'ra', 'ri', 'ru', 're', 'ro', 'wa', 'wo', 'n']);
const gzd = kids(['ga', 'gi', 'gu', 'ge', 'go', 'za', 'ji', 'zu', 'ze', 'zo', 'da', 'dji', 'dzu', 'de', 'do']);
const bp = kids(['ba', 'bi', 'bu', 'be', 'bo', 'pa', 'pi', 'pu', 'pe', 'po']);
const lessons = [
  L('n5_u02_l1', { title: 'The h and m rows', goal: 'Add ten kana and read your first shop and nature words, on the way to your first stamp in Tokyo.', introduces: { kana: [...hRow, ...mRow], vocab: ids(vocabL.l1) },
    explain: [{ heading: 'The h row and the m row', body: ['は ひ ふ へ ほ read ha, hi, fu, he, ho. ふ is a soft sound made with both lips, between "h" and "f". ま み む め も read ma, mi, mu, me, mo.', 'Look-alikes to watch: は and ほ, め and ぬ (from last unit), ま and も.'], examples: [{ ja: 'ひと', reading: 'hito', en: 'person' }, { ja: 'まち', reading: 'machi', en: 'town' }, { ja: 'くも', reading: 'kumo', en: 'cloud' }] }],
    practice: { question_ids: qs('kr01', 'kr02', 'kr03', 'mt01', 'mt02', 'rc01', 'rc02').concat(vmq(vocabL.l1)), gen: [{ type: 'kana_recog', from: 'kana', ids: [...hRow, ...mRow], n: 6 }, { type: 'kana_listen', from: 'kana', ids: [...hRow, ...mRow], n: 4 }] },
    exit_check: { gen: [{ type: 'kana_recog', from: 'kana', ids: [...hRow, ...mRow], n: 6 }, { type: 'vocab_meaning', from: 'vocab', ids: ids(vocabL.l1), n: 4 }], pass: 0.7 } }),
  L('n5_u02_l2', { title: 'The y, r and w rows, and ん', goal: 'Finish the basic hiragana chart. After this lesson you can read every basic kana.', introduces: { kana: yrw, vocab: ids(vocabL.l2) },
    explain: [{ heading: 'Three groups', body: ['The y row has only three kana: や ゆ よ (ya, yu, yo). The r row, ら り る れ ろ, uses a sound between English "r" and "l": a quick tap of the tongue behind your top teeth.', 'わ is "wa". を is pronounced "o" and is used only as a grammar word (you will meet it in a later unit). ん is a single consonant "n" that takes a full beat of its own.'], examples: [{ ja: 'さくら', reading: 'sakura', en: 'cherry blossom' }, { ja: 'ほん', reading: 'hon', en: 'book (2 beats: ho-n)' }, { ja: 'わたし', reading: 'watashi', en: 'I' }] },
      { heading: 'Welcome to Japan', body: ['ようこそ means "welcome". You will see it on signs in Tokyo.'], examples: [{ ja: 'ようこそ', reading: 'youkoso', en: 'welcome' }] }],
    practice: { question_ids: qs('kr04', 'kr05', 'kr06', 'kr07', 'mt03', 'rc03', 'rc04').concat(vmq(vocabL.l2).slice(0, 8)), gen: [{ type: 'kana_recog', from: 'kana', ids: yrw, n: 6 }, { type: 'kana_recall', from: 'kana', ids: yrw, n: 4 }] },
    exit_check: { gen: [{ type: 'kana_recog', from: 'kana', ids: [...mRow, ...yrw], n: 6 }, { type: 'vocab_meaning', from: 'vocab', ids: ids(vocabL.l2), n: 4 }], pass: 0.7 } }),
  L('n5_u02_l3', { title: 'Voiced sounds: g, z and d', goal: 'Learn the two small dots (dakuten) that voice a consonant: k to g, s to z, t to d.', introduces: { kana: gzd, vocab: ids(vocabL.l3) },
    explain: [{ heading: 'Two small dots', body: ['Add two small dots (゛, called dakuten) to a kana and its consonant becomes voiced: か ka becomes が ga, さ sa becomes ざ za, た ta becomes だ da.', 'Special cases: じ is "ji" (from し), ず is "zu" (from す), で is "de", and ぢ and づ sound the same as じ and ず. ぢ and づ are rare; you mostly see じ and ず.'], examples: [{ ja: 'ごはん', reading: 'gohan', en: 'rice, a meal' }, { ja: 'ともだち', reading: 'tomodachi', en: 'friend' }, { ja: 'でぐち', reading: 'deguchi', en: 'exit' }] }],
    practice: { question_ids: qs('kr08', 'kr09', 'kr11', 'mt04', 'mt05', 'rc05', 'rc06').concat(vmq(vocabL.l3).slice(0, 8)), gen: [{ type: 'kana_recog', from: 'kana', ids: gzd, n: 6 }, { type: 'kana_listen', from: 'kana', ids: gzd, n: 4 }] },
    exit_check: { gen: [{ type: 'kana_recog', from: 'kana', ids: gzd, n: 6 }, { type: 'vocab_meaning', from: 'vocab', ids: ids(vocabL.l3), n: 4 }], pass: 0.7 } }),
  L('n5_u02_l4', { title: 'B and P sounds', goal: 'Finish the chart: two dots make b, and a small circle makes p.', introduces: { kana: bp, vocab: ids(vocabL.l4) },
    explain: [{ heading: 'Dots and a circle', body: ['は ha with two dots is ば ba; with a small circle (゜, called handakuten) it is ぱ pa. The same works for ひ, ふ, へ, ほ.', 'You have now met all the basic hiragana. Next comes combining them (small ゃ ゅ ょ and っ) in the next unit.'], examples: [{ ja: 'かばん', reading: 'kaban', en: 'bag' }, { ja: 'ぱん', reading: 'pan', en: 'bread' }, { ja: 'しんぶん', reading: 'shinbun', en: 'newspaper' }] }],
    practice: { question_ids: qs('kr10', 'kr12', 'mt06', 'mt07', 'rc07', 'rc08').concat(vmq(vocabL.l4).slice(0, 6)), gen: [{ type: 'kana_recog', from: 'kana', ids: bp, n: 6 }, { type: 'kana_recall', from: 'kana', ids: bp, n: 4 }] },
    exit_check: { gen: [{ type: 'kana_recog', from: 'kana', ids: [...gzd, ...bp], n: 6 }, { type: 'vocab_meaning', from: 'vocab', ids: ids(vocabL.l4), n: 4 }], pass: 0.7 } }),
  L('n5_u02_l5', { title: 'First greetings', goal: 'Say hello, thank you and goodbye politely: the words you will use the moment you arrive in Tokyo.', introduces: { vocab: ids(vocabL.l5), grammar: ['g_greeting_set'] },
    explain: [{ heading: 'Casual and polite', body: ['Greetings are fixed phrases. To be polite to strangers, shopkeepers and older people, use the longer form: おはようございます, ありがとうございます.', 'With friends and family the short form is fine: おはよう, ありがとう.'], examples: [{ ja: 'おはようございます', reading: 'ohayou gozaimasu', en: 'Good morning (polite)' }, { ja: 'ありがとうございます', reading: 'arigatou gozaimasu', en: 'Thank you (polite)' }] },
      { heading: 'Across the day', body: ['こんにちは (hello, good afternoon) and こんばんは (good evening) end in は, which is pronounced "wa" here. おやすみなさい is only for going to bed. すみません is the all-purpose "excuse me / sorry / thanks for the trouble".'], examples: [{ ja: 'こんにちは', reading: 'konnichiwa', en: 'Hello / good afternoon' }, { ja: 'すみません', reading: 'sumimasen', en: 'Excuse me' }] },
      { heading: 'Meeting and meals', body: ['はじめまして is said when you meet someone for the first time; after your name you add よろしくおねがいします. At meals say いただきます before eating and ごちそうさまでした afterwards. At home, ただいま is answered with おかえりなさい.'], examples: [{ ja: 'はじめまして', reading: 'hajimemashite', en: 'Nice to meet you' }, { ja: 'ただいま', reading: 'tadaima', en: "I'm home" }] }],
    practice: { question_ids: qs('gm01', 'gm02', 'gm03', 'gm04', 'gm05', 'gm06', 'dg01', 'dg02').concat(vmq(vocabL.l5).slice(0, 8)) },
    context: { question_ids: qs('dg03', 'dg04', 'dg05', 'dg06', 'dg07', 'dg08', 'ty05', 'ty06', 'ty07', 'ty08') },
    exit_check: { question_ids: qs('gm01', 'gm03', 'gm04', 'dg01', 'dg04', 'dg06', 'dg07', 'gl01'), pass: 0.7 } }),
  L('n5_u02_l6', { title: 'Listen and read', goal: 'Hear greetings and read station signs and a shop window.', introduces: {},
    explain: [{ heading: 'Sounds in context', body: ['Greetings are heard far more often than they are read. Listen for the number of beats and the ending of each phrase.', 'On signs, short words like いりぐち (entrance) and でぐち (exit) are worth learning by shape.'], examples: [{ ja: 'いりぐち', reading: 'iriguchi', en: 'entrance' }, { ja: 'でぐち', reading: 'deguchi', en: 'exit' }] }],
    practice: { question_ids: qs('gl01', 'gl02', 'gl03', 'gl04', 'dc01', 'dc02', 'dc03', 'dc04') },
    context: { question_ids: qs('rq01', 'rq02', 'rq03', 'rq04', 'rq05', 'gl05', 'gl06', 'gl07', 'gl08') },
    exit_check: { question_ids: qs('gl03', 'gl05', 'gl08', 'rq01', 'rq02', 'rq04', 'dc02'), pass: 0.7 } }),
  L('n5_u02_l7', { title: 'Putting words together', goal: 'Use your new kana and words in short phrases, mixing in what you learned in unit 1.', introduces: {},
    explain: [{ heading: 'Phrases you can already read', body: ['Describing words come before the noun (あたらしい くるま), の links two nouns (ともだち の いえ) and と means "and" (りんご と ぶどう). With more than 150 words and every hiragana, you can read many labels and signs.'], examples: [{ ja: 'あたらしい くるま', reading: 'atarashii kuruma', en: 'a new car' }, { ja: 'ともだち の いえ', reading: 'tomodachi no ie', en: "a friend's house" }] }],
    practice: { question_ids: qs('tr01', 'tr02', 'tr03', 'tr04', 'tr05', 'tr06', 'sp01', 'sp02', 'sp03', 'sp04', 'so01', 'so02') },
    context: { question_ids: qs('tr07', 'tr08', 'tr09', 'tr10', 'tr11', 'tr12', 'sp05', 'sp06', 'sp07', 'sp08', 'sp09', 'sp10', 'so03', 'so04', 'ty01', 'ty02', 'ty03', 'ty04') },
    exit_check: { question_ids: qs('tr02', 'tr07', 'tr12', 'sp05', 'sp08', 'sp11', 'sp12', 'so02', 'ty01', 'ty09'), pass: 0.7 } }),
];

// ---------- Tokyo quest (QT_GREET): 10 items, 3+ from unit n5_u01 (spiral) ----------
const quests = [{ id: 'q_tokyo_1', destination_id: 'tokyo', type: 'QT_GREET', unit_id: 'n5_u02', min_accuracy: 0.8, provenance: 'orig',
  question_ids: ['q_n5u02_dg01', 'q_n5u02_dg02', 'q_n5u02_dg04', 'q_n5u02_dg07', 'q_n5u02_gl01', 'q_n5u02_gl05', 'q_n5u02_kr01', 'q_n5u01_kr01', 'q_n5u01_lq01', 'q_n5u01_kr03'],
  spiral_question_ids: ['q_n5u01_kr01', 'q_n5u01_lq01', 'q_n5u01_kr03'] }];

export default { vocab, sentences, questions, listening, passages, lessons, dialogues, grammar, quests };
