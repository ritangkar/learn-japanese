// n5_u03 "Combined sounds and self-introduction" - hand-written original content.
// Kana scope: hiragana youon (small ya/yu/yo), sokuon (small tsu), long vowels. Grammar: X wa Y desu, question particle ka.
import { unit, choices, countChars, meaningQuestions } from '../../scripts/lib/author-helpers.mjs';
import u01 from './n5_u01.mjs';
import u02 from './n5_u02.mjs';

const U = unit('n5_u03');
const { vocab: V, sentence: S, question: Q, lesson: L, listening: LS, passage: PS, dialogue: DG, grammar: GR } = U;

// ---------- vocabulary ----------
const vocabL = {
  l1: [
    V('ocha', 'おちゃ', 'おちゃ', ['tea', 'green tea'], 'noun', ['s_n5u03_01', 's_n5u03_10', 's_n5u03_17']),
    V('shashin', 'しゃしん', 'しゃしん', ['photograph', 'photo'], 'noun', ['s_n5u03_02', 's_n5u03_16', 's_n5u03_k14']),
    V('kyaku', 'きゃく', 'きゃく', ['guest', 'customer'], 'noun', ['s_n5u03_20']),
    V('shumi', 'しゅみ', 'しゅみ', ['hobby'], 'noun', ['s_n5u03_k14']),
    V('konnyaku', 'こんにゃく', 'こんにゃく', ['konjac (a firm jelly-like food)'], 'noun', ['s_n5u03_17']),
    V('shokuji', 'しょくじ', 'しょくじ', ['meal'], 'noun', ['s_n5u03_21']),
  ],
  l2: [
    V('hyaku', 'ひゃく', 'ひゃく', ['one hundred (100)'], 'number', ['s_n5u03_07']),
    V('ryokan', 'りょかん', 'りょかん', ['Japanese-style inn'], 'noun', ['s_n5u03_03']),
    V('jaa', 'じゃあ', 'じゃあ', ['well then', 'so'], 'expression', ['s_n5u03_22']),
  ],
  l3: [
    V('gakkou', 'がっこう', 'がっこう', ['school'], 'noun', ['s_n5u03_04', 's_n5u03_09', 's_n5u03_k12']),
    V('kitte', 'きって', 'きって', ['postage stamp'], 'noun', ['s_n5u03_05']),
    V('zasshi', 'ざっし', 'ざっし', ['magazine'], 'noun', ['s_n5u03_06', 's_n5u03_14']),
    V('nikki', 'にっき', 'にっき', ['diary'], 'noun', ['s_n5u03_14']),
    V('chotto', 'ちょっと', 'ちょっと', ['a little', 'a bit'], 'adverb', ['s_n5u03_15']),
    V('toukyou', 'とうきょう', 'とうきょう', ['Tokyo'], 'noun (proper)', ['s_n5u03_12', 's_n5u03_k13', 's_n5u03_k15'], { destination_tags: ['tokyo'] }),
    V('kyou', 'きょう', 'きょう', ['today'], 'noun (time)', ['s_n5u03_13']),
    V('ojiisan', 'おじいさん', 'おじいさん', ['grandfather', 'old man'], 'noun', ['s_n5u03_08'], { note: 'Do not shorten the long ii: おじさん (ojisan) means "uncle".' }),
    V('obaasan', 'おばあさん', 'おばあさん', ['grandmother', 'old woman'], 'noun', ['s_n5u03_08'], { note: 'Do not shorten the long aa: おばさん (obasan) means "aunt".' }),
    V('yuumei', 'ゆうめい', 'ゆうめい', ['famous'], 'na-adjective', ['s_n5u03_k15']),
    V('byouin', 'びょういん', 'びょういん', ['hospital'], 'noun', ['s_n5u03_09', 's_n5u03_k23']),
    V('ryouri', 'りょうり', 'りょうり', ['cooking', 'a dish'], 'noun', ['s_n5u03_19']),
    V('gyuunyuu', 'ぎゅうにゅう', 'ぎゅうにゅう', ['milk'], 'noun', ['s_n5u03_10']),
    V('hokkaidou', 'ほっかいどう', 'ほっかいどう', ['Hokkaido'], 'noun (proper)', ['s_n5u03_11']),
    V('oosaka', 'おおさか', 'おおさか', ['Osaka'], 'noun (proper)', ['s_n5u03_12']),
  ],
  l4: [
    V('desu', 'です', 'です', ['is / am / are (polite)'], 'copula', ['s_n5u03_k01', 's_n5u03_k04'], { note: 'です ends a polite sentence. It works like "is", "am" or "are".' }),
    V('san', 'さん', 'さん', ['Mr. / Ms. / Mrs. (polite name ending)'], 'suffix', ['s_n5u03_k02', 's_n5u03_k03'], { note: 'Added after a name. Never use it for yourself.' }),
    V('gakusei', 'がくせい', 'がくせい', ['student'], 'noun', ['s_n5u03_k01', 's_n5u03_k05']),
    V('kaishain', 'かいしゃいん', 'かいしゃいん', ['company employee', 'office worker'], 'noun', ['s_n5u03_k03']),
    V('nihonjin', 'にほんじん', 'にほんじん', ['Japanese person'], 'noun', ['s_n5u03_k04']),
    V('dare', 'だれ', 'だれ', ['who'], 'question word', ['s_n5u03_k11']),
    V('namae', 'なまえ', 'なまえ', ['name'], 'noun', ['s_n5u03_k09']),
  ],
  l5: [
    V('donata', 'どなた', 'どなた', ['who (polite)'], 'question word', ['s_n5u03_k17']),
    V('onamae', 'おなまえ', 'おなまえ', ["your name (polite)"], 'noun', ['s_n5u03_k08'], { note: 'お shows respect. Use おなまえ for the other person\'s name and なまえ for your own.' }),
    V('kochira', 'こちら', 'こちら', ['this person (polite)', 'this way'], 'pronoun', ['s_n5u03_k10']),
    V('nan', 'なん', 'なん', ['what (before です)'], 'question word', ['s_n5u03_k08'], { note: 'なに becomes なん before です, as in なん です か.' }),
  ],
};
const vocab = Object.values(vocabL).flat();
const v = (id) => `v_${id}`;

// ---------- phrases and sentences ----------
const ph = (n, text, en, ids) => S(`s_n5u03_${n}`, 'phrase', text, text, en, ids.map(v));
const sn = (n, text, en, ids, extra = {}) => S(`s_n5u03_${n}`, 'sentence', text, text, en, ids.map(v), extra);
const sentences = [
  ph('01', 'おいしい おちゃ', 'delicious tea', ['ocha']), ph('02', 'あたらしい しゃしん', 'a new photo', ['shashin']), ph('03', 'にほん の りょかん', 'a Japanese inn', ['ryokan']),
  ph('04', 'おおきい がっこう', 'a big school', ['gakkou']), ph('05', 'ふるい きって', 'an old stamp', ['kitte']), ph('06', 'にほん の ざっし', 'a Japanese magazine', ['zasshi']),
  ph('07', 'ひゃく', 'one hundred', ['hyaku']), ph('08', 'おじいさん と おばあさん', 'grandfather and grandmother', ['ojiisan', 'obaasan']), ph('09', 'びょういん と がっこう', 'a hospital and a school', ['byouin', 'gakkou']),
  ph('10', 'ぎゅうにゅう と おちゃ', 'milk and tea', ['gyuunyuu', 'ocha']), ph('11', 'ほっかいどう の ゆき', 'the snow of Hokkaido', ['hokkaidou']), ph('12', 'とうきょう と おおさか', 'Tokyo and Osaka', ['toukyou', 'oosaka']),
  ph('13', 'きょう の しんぶん', "today's newspaper", ['kyou']), ph('14', 'にっき と ざっし', 'a diary and a magazine', ['nikki', 'zasshi']), ph('15', 'ちょっと', 'a little', ['chotto']),
  ph('16', 'ひと の しゃしん', "a person's photo", ['shashin']), ph('17', 'こんにゃく と おちゃ', 'konjac and tea', ['konnyaku', 'ocha']), ph('18', 'おいしい りょうり', 'a delicious dish', ['ryouri']),
  ph('19', 'おいしい りょうり と おちゃ', 'delicious food and tea', ['ryouri', 'ocha']), ph('20', 'きゃく の しゃしん', "a guest's photo", ['kyaku']), ph('21', 'しょくじ と おちゃ', 'a meal and tea', ['shokuji']),
  S('s_n5u03_22', 'expression', 'じゃあ', 'じゃあ', 'Well then.', [v('jaa')]),
  sn('k01', 'わたし は がくせい です', 'I am a student.', ['watashi', 'gakusei', 'desu']),
  sn('k02', 'たなか さん は せんせい です', 'Ms. Tanaka is a teacher.', ['san', 'sensei', 'desu']),
  sn('k03', 'やまだ さん は かいしゃいん です', 'Mr. Yamada is a company employee.', ['san', 'kaishain', 'desu']),
  sn('k04', 'わたし は にほんじん です', 'I am Japanese.', ['watashi', 'nihonjin', 'desu']),
  sn('k05', 'あなた は がくせい です か', 'Are you a student?', ['anata', 'gakusei', 'desu']),
  sn('k06', 'はい わたし は がくせい です', 'Yes, I am a student.', ['watashi', 'gakusei', 'desu']),
  sn('k07', 'いいえ わたし は せんせい です', 'No, I am a teacher.', ['watashi', 'sensei', 'desu']),
  sn('k08', 'おなまえ は なん です か', 'What is your name?', ['onamae', 'nan', 'desu']),
  sn('k09', 'わたし の なまえ は たなか です', 'My name is Tanaka.', ['watashi', 'namae', 'desu']),
  sn('k10', 'こちら は やまだ さん です', 'This is Mr. Yamada.', ['kochira', 'san', 'desu']),
  sn('k11', 'あそこ の ひと は だれ です か', 'Who is the person over there?', ['dare', 'desu']),
  sn('k12', 'ここ は がっこう です', 'This is a school.', ['gakkou', 'desu']),
  sn('k13', 'とうきょう は おおきい まち です', 'Tokyo is a big city.', ['toukyou', 'desu']),
  sn('k14', 'しゅみ は しゃしん です', 'My hobby is photography.', ['shumi', 'shashin', 'desu']),
  sn('k15', 'とうきょう は ゆうめい です', 'Tokyo is famous.', ['toukyou', 'yuumei', 'desu']),
  sn('k16', 'おちゃ は おいしい です', 'Tea is delicious.', ['ocha', 'desu']),
  sn('k17', 'どなた です か', 'Who is it? (polite)', ['donata', 'desu']),
  sn('k18', 'はじめまして たなか です', "Nice to meet you. I'm Tanaka.", ['desu']),
  sn('k19', 'はじめまして やまだ です', "Nice to meet you. I'm Yamada.", ['desu']),
  sn('k20', 'こちら こそ よろしく おねがいします', 'Likewise. Please treat me well.', []),
  sn('k21', 'たなか さん です', 'It is Ms. Tanaka.', ['san', 'desu']),
  sn('k22', 'たなか です', "I'm Tanaka.", ['desu']),
  sn('k23', 'びょういん は あそこ です', 'The hospital is over there.', ['byouin', 'desu']),
];
const sent = (id) => sentences.find((s) => s.id === id);

const questions = [];
const add = (...q) => questions.push(...q);

// ---------- kana: combined sounds ----------
const kr = (n, ch, rom, others, note, kid) => Q(`q_n5u03_kr${n}`, 'kana_recog', { stem: { prompt: 'Which sound is this combined kana?', ja: ch }, choices: choices([['a', rom], ...others.map((o, i) => [`d${i + 1}`, o])]), answer: 'a', explanation_correct: note, explanation_per_distractor: Object.fromEntries(others.map((o, i) => [`d${i + 1}`, `That is not the sound of ${ch}. Look at the small kana: ゃ is "a", ゅ is "u", ょ is "o".`])), facet: 'read', targets: [kid], difficulty: 1 });
add(kr('01', 'きょ', 'kyo', ['kyu', 'kya'], 'き + small ょ makes one beat: "kyo".', 'ka_h_kyo'), kr('02', 'しゃ', 'sha', ['shu', 'sho'], 'し + small ゃ makes "sha".', 'ka_h_sha'), kr('03', 'ちゅ', 'chu', ['cha', 'cho'], 'ち + small ゅ makes "chu".', 'ka_h_chu'), kr('04', 'にょ', 'nyo', ['nyu', 'nya'], 'に + small ょ makes "nyo".', 'ka_h_nyo'),
  kr('05', 'ひゃ', 'hya', ['hyo', 'mya'], 'ひ + small ゃ makes "hya".', 'ka_h_hya'), kr('06', 'りゅ', 'ryu', ['rya', 'ryo'], 'り + small ゅ makes "ryu".', 'ka_h_ryu'), kr('07', 'ぎょ', 'gyo', ['gya', 'gyu'], 'ぎ + small ょ makes "gyo".', 'ka_h_gyo'), kr('08', 'じゃ', 'ja', ['ju', 'jo'], 'じ + small ゃ makes "ja".', 'ka_h_ja'),
  kr('09', 'びゅ', 'byu', ['bya', 'pyu'], 'び + small ゅ makes "byu". Two dots mean b; a circle would mean p.', 'ka_h_byu'), kr('10', 'ぴょ', 'pyo', ['pyu', 'byo'], 'ぴ + small ょ makes "pyo". A small circle means p.', 'ka_h_pyo'), kr('11', 'みゅ', 'myu', ['mya', 'nyu'], 'み + small ゅ makes "myu".', 'ka_h_myu'), kr('12', 'じょ', 'jo', ['ja', 'ju'], 'じ + small ょ makes "jo".', 'ka_h_jo'));
const rc = (n, rom, ch, kid) => Q(`q_n5u03_rc${n}`, 'kana_recall', { stem: { prompt: `Write the hiragana for "${rom}".` }, answer: ch, explanation_correct: `"${rom}" is written ${ch}: the big kana plus a small ゃ, ゅ or ょ.`, facet: 'produce', targets: [kid], difficulty: 2 });
add(rc('01', 'kya', 'きゃ', 'ka_h_kya'), rc('02', 'shu', 'しゅ', 'ka_h_shu'), rc('03', 'cho', 'ちょ', 'ka_h_cho'), rc('04', 'nya', 'にゃ', 'ka_h_nya'),
  rc('05', 'hyo', 'ひょ', 'ka_h_hyo'), rc('06', 'mya', 'みゃ', 'ka_h_mya'), rc('07', 'ryu', 'りゅ', 'ka_h_ryu'), rc('08', 'gyo', 'ぎょ', 'ka_h_gyo'), rc('09', 'ja', 'じゃ', 'ka_h_ja'), rc('10', 'byu', 'びゅ', 'ka_h_byu'), rc('11', 'pyo', 'ぴょ', 'ka_h_pyo'), rc('12', 'ju', 'じゅ', 'ka_h_ju'));
const mt = (n, pairs, ids, note) => Q(`q_n5u03_mt${n}`, 'matching', { stem: { prompt: 'Match each combined kana with its sound.' }, pairs, answer: pairs.map((p) => p[0]), explanation_correct: note, facet: 'read', targets: ids, difficulty: 1 });
add(mt('01', [['きゃ', 'kya'], ['きゅ', 'kyu'], ['きょ', 'kyo'], ['しゃ', 'sha'], ['しゅ', 'shu'], ['しょ', 'sho']], ['ka_h_kya', 'ka_h_kyu', 'ka_h_kyo', 'ka_h_sha', 'ka_h_shu', 'ka_h_sho'], 'The k and sh groups: the small kana picks the vowel.'),
  mt('02', [['ちゃ', 'cha'], ['ちゅ', 'chu'], ['ちょ', 'cho'], ['にゃ', 'nya'], ['にゅ', 'nyu'], ['にょ', 'nyo']], ['ka_h_cha', 'ka_h_chu', 'ka_h_cho', 'ka_h_nya', 'ka_h_nyu', 'ka_h_nyo'], 'The ch and ny groups.'),
  mt('03', [['ひゃ', 'hya'], ['みゃ', 'mya'], ['りゃ', 'rya'], ['ぎゃ', 'gya'], ['じゃ', 'ja'], ['びゃ', 'bya']], ['ka_h_hya', 'ka_h_mya', 'ka_h_rya', 'ka_h_gya', 'ka_h_ja', 'ka_h_bya'], 'The ゃ column across six rows; じゃ is "ja".'),
  mt('04', [['ぴゃ', 'pya'], ['ひゅ', 'hyu'], ['みゅ', 'myu'], ['りゅ', 'ryu'], ['ぎゅ', 'gyu'], ['じゅ', 'ju']], ['ka_h_pya', 'ka_h_hyu', 'ka_h_myu', 'ka_h_ryu', 'ka_h_gyu', 'ka_h_ju'], 'The ゅ column, plus ぴゃ.'));

// ---------- beats (mora), small tsu and long vowels ----------
const mo = (n, word, rom, beats, wrong, vids, note) => Q(`q_n5u03_mo${n}`, 'mcq', { stem: { prompt: `How many beats does ${word} (${rom}) have? A combined sound like きょ is one beat, a small っ is one beat, and a long vowel adds one beat.`, ja: word }, choices: choices([['a', String(beats)], ['b', String(wrong[0])], ['c', String(wrong[1])]].sort((x, y) => Number(x[1]) - Number(y[1])).map(([, t], i) => ['abc'[i], t])), answer: 'abc'[[beats, wrong[0], wrong[1]].sort((x, y) => x - y).indexOf(beats)], explanation_correct: note, explanation_per_distractor: {}, facet: 'read', targets: vids, difficulty: 2 });
add(mo('01', 'がっこう', 'gakkou', 4, [3, 5], ['v_gakkou', 'ka_h_sokuon'], 'が・っ・こ・う = 4 beats; the small っ takes a beat of silence.'), mo('02', 'しゃしん', 'shashin', 3, [2, 4], ['v_shashin'], 'しゃ・し・ん = 3 beats; しゃ is one beat.'),
  mo('03', 'きょう', 'kyou', 2, [1, 3], ['v_kyou'], 'きょ・う = 2 beats; the long o takes two.'), mo('04', 'ざっし', 'zasshi', 3, [2, 4], ['v_zasshi', 'ka_h_sokuon'], 'ざ・っ・し = 3 beats.'),
  mo('05', 'とうきょう', 'toukyou', 4, [3, 5], ['v_toukyou'], 'と・う・きょ・う = 4 beats.'), mo('06', 'おばあさん', 'obaasan', 5, [4, 6], ['v_obaasan'], 'お・ば・あ・さ・ん = 5 beats; the long aa takes two.'),
  mo('07', 'ちょっと', 'chotto', 3, [2, 4], ['v_chotto', 'ka_h_sokuon'], 'ちょ・っ・と = 3 beats.'), mo('08', 'ひゃく', 'hyaku', 2, [1, 3], ['v_hyaku'], 'ひゃ・く = 2 beats.'));
const ro = (n, rom, ch, ans, note, vid, extraT = []) => Q(`q_n5u03_ro${n}`, 'mcq', { stem: { prompt: `Which word is read "${rom}"?` }, choices: choices(ch.map(([id, t]) => [id, t, true])), answer: ans, explanation_correct: note, explanation_per_distractor: Object.fromEntries(ch.filter(([id]) => id !== ans).map(([id, t]) => [id, `${t} has a different length or sound.`])), facet: 'read', targets: [vid, ...extraT], difficulty: 2 });
add(ro('01', 'gakkou', [['a', 'がっこう'], ['b', 'がこう'], ['c', 'がっこ']], 'a', 'がっこう: small っ, then こう with a long o.', 'v_gakkou', ['ka_h_sokuon']), ro('02', 'kitte', [['a', 'きて'], ['b', 'きって'], ['c', 'きっと']], 'b', 'きって (kitte) = stamp. きて and きっと are different words.', 'v_kitte', ['ka_h_sokuon']),
  ro('03', 'toukyou', [['a', 'ときょ'], ['b', 'とうきょ'], ['c', 'とうきょう']], 'c', 'とうきょう has two long vowels: tou and kyou.', 'v_toukyou'), ro('04', 'obaasan', [['a', 'おばさん'], ['b', 'おばあさん'], ['c', 'おばあさ']], 'b', 'おばあさん (obaasan) = grandmother; おばさん (obasan) = aunt.', 'v_obaasan'));

// ---------- vocabulary meaning (templated) and spiral review of units 1 and 2 ----------
add(...meaningQuestions(Q, vocab));
{
  const old = [...u01.vocab, ...u02.vocab.filter((w) => !['expression'].includes(w.pos))];
  const first = (x) => x.meanings_en[0];
  const pick = old.filter((_, i) => i % 4 === 1).slice(0, 36);
  pick.forEach((w, i) => {
    const cands = old.filter((c) => c.id !== w.id && first(c) !== first(w)).filter((_, k) => (k + i) % 7 === 0).slice(0, 3);
    const ordered = [cands[0], w, cands[1], cands[2]].filter(Boolean);
    const ids4 = ['a', 'b', 'c', 'd'];
    add(Q(`q_n5u03_sr_${w.id.slice(2)}`, 'mcq', { stem: { prompt: `Which word means "${first(w)}"?` }, choices: ordered.map((o, k) => ({ id: ids4[k], text: o.surface, ja: true, concept: o.id })), answer: ids4[ordered.indexOf(w)], explanation_correct: `"${first(w)}" is ${w.surface} (${w.romaji}).`, explanation_per_distractor: Object.fromEntries(ordered.map((o, k) => [ids4[k], `${o.surface} means "${first(o)}".`]).filter((_, k) => ordered[k] !== w)), facet: 'produce', targets: [w.id], difficulty: 1, tags: ['templated', 'spiral'] }));
  });
}

// ---------- grammar: X wa Y desu ----------
const gwq = [];
{
  const g = (...q) => { gwq.push(...q.map((x) => x.id)); add(...q); };
  g(Q('q_n5u03_gw01', 'fill_blank', { stem: { prompt: 'Complete: I am a student.', ja: 'わたし ＿＿ がくせい です' }, choices: choices([['a', 'は', true], ['b', 'の', true], ['c', 'と', true]]), answer: 'a', explanation_correct: 'は marks the topic of the sentence ("As for me ..."). Here it is pronounced "wa".', explanation_per_distractor: { b: 'の links two nouns ("my student").', c: 'と means "and".' }, facet: 'construct', targets: ['g_wa_desu', 'v_watashi', 'v_gakusei'], source_sentence_id: 's_n5u03_k01', difficulty: 2 }),
    Q('q_n5u03_gw02', 'fill_blank', { stem: { prompt: 'Complete: Ms. Tanaka is a teacher.', ja: 'たなか さん は せんせい ＿＿' }, choices: choices([['a', 'です', true], ['b', 'と', true], ['c', 'の', true]]), answer: 'a', explanation_correct: 'です ends a polite statement of the form "X is Y".', explanation_per_distractor: { b: 'と means "and"; it cannot end a sentence.', c: 'の links nouns; it cannot end a sentence.' }, facet: 'construct', targets: ['g_wa_desu', 'v_san', 'v_sensei'], source_sentence_id: 's_n5u03_k02', difficulty: 2 }),
    Q('q_n5u03_gw03', 'sentence_order', { stem: { prompt: 'Put the words in order: I am a student.' }, tiles: ['です', 'がくせい', 'わたし', 'は'], answer: ['わたし', 'は', 'がくせい', 'です'], explanation_correct: 'The pattern is topic + は + description + です.', facet: 'construct', targets: ['g_wa_desu', 'v_watashi', 'v_gakusei'], source_sentence_id: 's_n5u03_k01', difficulty: 2 }),
    Q('q_n5u03_gw04', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'わたし は にほんじん です' }, choices: choices([['a', 'I am Japanese.'], ['b', 'I am a teacher.'], ['c', 'Japan is big.']]), answer: 'a', explanation_correct: 'にほんじん = Japanese person; X は Y です = "X is Y".', explanation_per_distractor: { b: 'せんせい (teacher) is not in this sentence.', c: 'The topic is わたし (I), not Japan.' }, facet: 'meaning', targets: ['g_wa_desu', 'v_nihonjin', 'v_watashi'], source_sentence_id: 's_n5u03_k04', difficulty: 2 }),
    Q('q_n5u03_gw05', 'mcq', { stem: { prompt: 'The は in わたし は がくせい です is pronounced...', ja: 'わたし は がくせい です' }, choices: choices([['a', '"wa"'], ['b', '"ha"'], ['c', '"o"']]), answer: 'a', explanation_correct: 'The topic particle は is always pronounced "wa". Inside words (はな, はる) it stays "ha".', explanation_per_distractor: { b: 'Only when は is part of a word is it "ha".', c: 'を is the "o" particle, a different kana.' }, facet: 'read', targets: ['g_wa_desu'], difficulty: 2 }),
    Q('q_n5u03_gw06', 'sentence_order', { stem: { prompt: 'Put the words in order: Mr. Yamada is a company employee.' }, tiles: ['です', 'かいしゃいん', 'さん', 'は', 'やまだ'], answer: ['やまだ', 'さん', 'は', 'かいしゃいん', 'です'], explanation_correct: 'The name comes first, then さん, then は, then the description and です.', facet: 'construct', targets: ['g_wa_desu', 'v_san', 'v_kaishain'], source_sentence_id: 's_n5u03_k03', difficulty: 3 }),
    Q('q_n5u03_gw07', 'translate', { stem: { prompt: 'Which Japanese sentence means "Ms. Tanaka is a teacher"?' }, choices: choices([['a', 'たなか さん は せんせい です', true], ['b', 'たなか さん の せんせい です', true], ['c', 'わたし は せんせい です', true]]), answer: 'a', explanation_correct: 'X は Y です makes the statement "X is Y".', explanation_per_distractor: { b: 'の would mean "Ms. Tanaka\'s teacher".', c: 'That says "I am a teacher".' }, facet: 'meaning', targets: ['g_wa_desu', 'v_san', 'v_sensei'], source_sentence_id: 's_n5u03_k02', difficulty: 2 }),
    Q('q_n5u03_gw08', 'error_correction', { stem: { prompt: 'One word is wrong. Which word should replace の so the sentence means "I am a student"?', ja: 'わたし の がくせい です' }, choices: choices([['a', 'は', true], ['b', 'と', true], ['c', 'か', true]]), answer: 'a', explanation_correct: 'わたし は がくせい です: は marks the topic.', explanation_per_distractor: { b: 'と means "and".', c: 'か turns a sentence into a question.' }, facet: 'construct', targets: ['g_wa_desu', 'v_gakusei'], difficulty: 3 }));
}
const gkq = [];
{
  const g = (...q) => { gkq.push(...q.map((x) => x.id)); add(...q); };
  g(Q('q_n5u03_gk01', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'あなた は がくせい です か' }, choices: choices([['a', 'Are you a student?'], ['b', 'You are a student.'], ['c', 'Am I a student?']]), answer: 'a', explanation_correct: 'か at the end turns the sentence into a question.', explanation_per_distractor: { b: 'Without か it would be a statement.', c: 'あなた means "you", not "I".' }, facet: 'meaning', targets: ['g_ka_question', 'v_anata', 'v_gakusei'], source_sentence_id: 's_n5u03_k05', difficulty: 2 }),
    Q('q_n5u03_gk02', 'fill_blank', { stem: { prompt: 'Complete the question: Are you a teacher?', ja: 'あなた は せんせい です ＿＿' }, choices: choices([['a', 'か', true], ['b', 'の', true], ['c', 'は', true]]), answer: 'a', explanation_correct: 'Add か at the end of a sentence to ask a question. No question mark is needed.', explanation_per_distractor: { b: 'の does not make a question here.', c: 'は is the topic particle and does not end a sentence.' }, facet: 'construct', targets: ['g_ka_question', 'v_anata', 'v_sensei'], difficulty: 2 }),
    Q('q_n5u03_gk03', 'sentence_order', { stem: { prompt: 'Put the words in order: Are you Japanese?' }, tiles: ['か', 'です', 'あなた', 'は', 'にほんじん'], answer: ['あなた', 'は', 'にほんじん', 'です', 'か'], explanation_correct: 'Statement order, then か at the end.', facet: 'construct', targets: ['g_ka_question', 'v_anata', 'v_nihonjin'], difficulty: 3 }),
    Q('q_n5u03_gk04', 'dialogue_complete', { stem: { prompt: 'A asks: "Are you a student?" Which is a good answer?', ja: 'あなた は がくせい です か' }, choices: choices([['a', 'はい わたし は がくせい です', true], ['b', 'おやすみなさい', true], ['c', 'いただきます', true]]), answer: 'a', explanation_correct: 'Answer yes or no first (はい / いいえ), then repeat the statement.', explanation_per_distractor: { b: 'おやすみなさい is said before sleeping.', c: 'いただきます is said before eating.' }, facet: 'meaning', targets: ['g_ka_question', 'v_gakusei', 'v_hai'], source_sentence_id: 's_n5u03_k06', difficulty: 2 }),
    Q('q_n5u03_gk05', 'mcq', { stem: { prompt: 'What does か at the end of a sentence do?' }, choices: choices([['a', 'It makes the sentence a question'], ['b', 'It means "and"'], ['c', 'It means "my"']]), answer: 'a', explanation_correct: 'か is the question particle.', explanation_per_distractor: { b: 'と means "and".', c: 'の links nouns, like "my".' }, facet: 'meaning', targets: ['g_ka_question'], difficulty: 1 }),
    Q('q_n5u03_gk06', 'translate', { stem: { prompt: 'Choose the meaning.', ja: 'おなまえ は なん です か' }, choices: choices([['a', 'What is your name?'], ['b', 'Who are you?'], ['c', 'Where is the school?']]), answer: 'a', explanation_correct: 'おなまえ = (your) name, なん = what.', explanation_per_distractor: { b: 'だれ means "who"; this sentence has なん.', c: 'がっこう (school) is not in this sentence.' }, facet: 'meaning', targets: ['g_ka_question', 'v_onamae', 'v_nan'], source_sentence_id: 's_n5u03_k08', difficulty: 2 }),
    Q('q_n5u03_gk07', 'sentence_order', { stem: { prompt: 'Put the words in order: What is your name?' }, tiles: ['か', 'なん', 'は', 'おなまえ', 'です'], answer: ['おなまえ', 'は', 'なん', 'です', 'か'], explanation_correct: 'The question word sits where the answer would go; か closes the question.', facet: 'construct', targets: ['g_ka_question', 'v_onamae', 'v_nan'], source_sentence_id: 's_n5u03_k08', difficulty: 3 }),
    Q('q_n5u03_gk08', 'fill_blank', { stem: { prompt: 'Complete: Who is the person over there?', ja: 'あそこ の ひと は ＿＿ です か' }, choices: choices([['a', 'だれ', true], ['b', 'がくせい', true], ['c', 'おちゃ', true]]), answer: 'a', explanation_correct: 'だれ = who.', explanation_per_distractor: { b: 'がくせい means student; it answers the question rather than asking it.', c: 'おちゃ means tea.' }, facet: 'construct', targets: ['g_ka_question', 'v_dare', 'v_asoko', 'v_hito'], source_sentence_id: 's_n5u03_k11', difficulty: 2 }));
}
const grammar = [
  GR('g_wa_desu', { title: 'X は Y です: "X is Y"', pattern: 'X は Y です', meaning_en: 'States what X is, politely.',
    explanation: ['The simplest Japanese sentence says what something is. Put the topic first, add は, then say what it is, and finish with です.', 'は marks the topic ("as for X ..."). When it is a particle, は is pronounced "wa", not "ha". です is the polite ending; it covers "is", "am" and "are".', 'Japanese has no words like "a" or "the", so がくせい です can mean "is a student". The subject is often dropped when it is clear.'],
    structure_notes: 'Topic + は + description + です. Add さん after another person\'s name, never your own.', examples: ['s_n5u03_k01', 's_n5u03_k02', 's_n5u03_k03', 's_n5u03_k04'], common_mistakes: ['Reading the particle は as "ha" (it is "wa").', 'Adding さん to your own name.', 'Using の where は is needed.'], contrast_with: ['g_ka_question'], practice_question_ids: gwq.map((x) => x), register: 'polite', tags: ['sentence_patterns'] }),
  GR('g_ka_question', { title: 'Questions with か', pattern: 'X は Y です か', meaning_en: 'Asks whether X is Y.',
    explanation: ['To ask a yes/no question, add か to the end of the sentence. The word order does not change, and in writing you do not need a question mark.', 'A question word such as だれ (who), なに / なん (what) takes the place of the answer: おなまえ は なん です か. To answer a yes/no question say はい (yes) or いいえ (no) and then repeat the sentence.', 'When talking to someone you often drop あなた and use their name with さん instead.'],
    structure_notes: 'Sentence + か. Answer: はい / いいえ + statement.', examples: ['s_n5u03_k05', 's_n5u03_k08', 's_n5u03_k11', 's_n5u03_k17'], common_mistakes: ['Raising the pitch but forgetting か in polite speech.', 'Putting か at the start of the sentence.'], contrast_with: ['g_wa_desu'], practice_question_ids: gkq.map((x) => x), register: 'polite', tags: ['sentence_patterns', 'questions'] }),
];

// ---------- typing and dictation ----------
const ty = (n, en, ans, vid, alt = null) => Q(`q_n5u03_ty${n}`, 'typing_ja', { stem: { prompt: `Type "${en}" in hiragana (romaji is accepted).` }, answer: ans, accept_alternatives: alt, explanation_correct: `${en} = ${ans}.`, facet: 'produce', targets: [vid], difficulty: 2 });
add(ty('01', 'photo', 'しゃしん', 'v_shashin'), ty('02', 'tea', 'おちゃ', 'v_ocha'), ty('03', 'one hundred', 'ひゃく', 'v_hyaku'), ty('04', 'school', 'がっこう', 'v_gakkou'), ty('05', 'today', 'きょう', 'v_kyou'), ty('06', 'postage stamp', 'きって', 'v_kitte'),
  ty('07', 'Tokyo', 'とうきょう', 'v_toukyou'), ty('08', 'hospital', 'びょういん', 'v_byouin'), ty('09', 'student', 'がくせい', 'v_gakusei'), ty('10', 'Japanese person', 'にほんじん', 'v_nihonjin'));
const dc = (n, word, vid, note) => Q(`q_n5u03_dc${n}`, 'dictation', { stem: { prompt: 'Listen, then type what you hear in hiragana (romaji is accepted).', audio_text: word }, answer: word, explanation_correct: note, facet: 'listen', targets: [vid], difficulty: 3, tags: ['listening_relevant'] });
add(dc('01', 'しゃしん', 'v_shashin', 'しゃしん (shashin) = photo.'), dc('02', 'ひゃく', 'v_hyaku', 'ひゃく (hyaku) = 100.'), dc('03', 'がっこう', 'v_gakkou', 'がっこう (gakkou) = school. Listen for the pause of the small っ.'), dc('04', 'とうきょう', 'v_toukyou', 'とうきょう (toukyou) = Tokyo, with two long vowels.'), dc('05', 'おばあさん', 'v_obaasan', 'おばあさん (obaasan) = grandmother; the long aa matters.'));

// ---------- listening ----------
const gl = (n, lid, phrase, others, vid, note) => Q(`q_n5u03_gl${n}`, 'listening_comp', { stem: { prompt: 'What did you hear?', audio_text: phrase, context_id: lid }, choices: choices([['a', phrase, true], ...others.map((o, i) => [`d${i + 1}`, o, true])]), answer: 'a', explanation_correct: note, explanation_per_distractor: Object.fromEntries(others.map((o, i) => [`d${i + 1}`, `${o} sounds different: listen again for the small kana and the length.`])), facet: 'listen', targets: [vid], difficulty: 2, tags: ['listening_relevant'] });
add(gl('01', 'n5u03_ls1', 'おちゃ', ['きゃく', 'しゅみ'], 'v_ocha', 'You heard おちゃ: tea.'), gl('02', 'n5u03_ls1', 'しゃしん', ['しょくじ', 'おちゃ'], 'v_shashin', 'You heard しゃしん: photo.'), gl('03', 'n5u03_ls1', 'ひゃく', ['きゃく', 'りょかん'], 'v_hyaku', 'You heard ひゃく: one hundred.'), gl('04', 'n5u03_ls1', 'りょかん', ['ひゃく', 'じゃあ'], 'v_ryokan', 'You heard りょかん: a Japanese inn.'),
  gl('05', 'n5u03_ls2', 'おじいさん', ['おじさん', 'おばあさん'], 'v_ojiisan', 'You heard おじいさん (long ii): grandfather. おじさん is "uncle".'), gl('06', 'n5u03_ls2', 'おばあさん', ['おばさん', 'おじいさん'], 'v_obaasan', 'You heard おばあさん (long aa): grandmother. おばさん is "aunt".'),
  gl('07', 'n5u03_ls2', 'がっこう', ['こうこう', 'ぎんこう'], 'v_gakkou', 'You heard がっこう: school.'), gl('08', 'n5u03_ls2', 'きって', ['ざっし', 'にっき'], 'v_kitte', 'You heard きって: a postage stamp.'));
const listening = [
  LS('n5u03_ls1', { item_type: 'Word recognition (lesson practice)', title: 'Combined sounds', script_turns: ['おちゃ', 'しゃしん', 'ひゃく', 'りょかん'].map((t) => ({ speaker: 'A', text_ja: t })), question_ids: ['q_n5u03_gl01', 'q_n5u03_gl02', 'q_n5u03_gl03', 'q_n5u03_gl04'] }),
  LS('n5u03_ls2', { item_type: 'Word recognition (lesson practice)', title: 'Long vowels and small っ', script_turns: ['おじいさん', 'おばあさん', 'がっこう', 'きって'].map((t) => ({ speaker: 'A', text_ja: t })), question_ids: ['q_n5u03_gl05', 'q_n5u03_gl06', 'q_n5u03_gl07', 'q_n5u03_gl08'] }),
];

// ---------- dialogues ----------
const dialogues = [
  DG('n5u03_d1', { title: 'Meeting for the first time', setting: 'tokyo', turns: [{ speaker: 'A', sentence_id: 's_n5u03_k18' }, { speaker: 'B', sentence_id: 's_n5u03_k19' }, { speaker: 'A', sentence_id: 's_n5u02_g13' }, { speaker: 'B', sentence_id: 's_n5u03_k20' }], comprehension_question_ids: ['q_n5u03_dg01', 'q_n5u03_dg02'], register: 'polite' }),
  DG('n5u03_d2', { title: 'Are you a student?', setting: 'tokyo', turns: [{ speaker: 'A', sentence_id: 's_n5u03_k05' }, { speaker: 'B', sentence_id: 's_n5u03_k06' }], comprehension_question_ids: ['q_n5u03_dg03', 'q_n5u03_dg04'], register: 'polite' }),
  DG('n5u03_d3', { title: 'Who is that?', setting: 'tokyo_station', turns: [{ speaker: 'A', sentence_id: 's_n5u03_k11' }, { speaker: 'B', sentence_id: 's_n5u03_k21' }], comprehension_question_ids: ['q_n5u03_dg05'], register: 'polite' }),
  DG('n5u03_d4', { title: 'May I ask your name?', setting: 'tokyo', turns: [{ speaker: 'A', sentence_id: 's_n5u03_k08' }, { speaker: 'B', sentence_id: 's_n5u03_k22' }], comprehension_question_ids: ['q_n5u03_dg06'], register: 'polite' }),
];
const dg = (n, did, prompt, ch, ans, note, targets) => Q(`q_n5u03_dg${n}`, 'dialogue_complete', { stem: { prompt, context_id: did }, choices: choices(ch), answer: ans, explanation_correct: note, explanation_per_distractor: Object.fromEntries(ch.filter(([id]) => id !== ans).map(([id, t]) => [id, `${t} is not what the dialogue says.`])), facet: 'meaning', targets, difficulty: 2 });
add(dg('01', 'n5u03_d1', 'What is the name of person B?', [['a', 'Yamada'], ['b', 'Tanaka'], ['c', 'Suzuki']], 'a', 'B says はじめまして やまだ です.', ['v_desu']),
  dg('02', 'n5u03_d1', 'Which line means "Likewise. Please treat me well"?', [['a', 'こちら こそ よろしく おねがいします', true], ['b', 'はじめまして たなか です', true], ['c', 'さようなら', true]], 'a', 'こちらこそ answers a greeting with "the same to you".', ['v_yoroshiku']),
  dg('03', 'n5u03_d2', 'What does B answer?', [['a', 'Yes, I am a student.'], ['b', 'No, I am a teacher.'], ['c', 'I am Japanese.']], 'a', 'はい = yes; わたし は がくせい です = I am a student.', ['v_gakusei', 'v_hai']),
  dg('04', 'n5u03_d2', 'Is B a student?', [['a', 'Yes'], ['b', 'No'], ['c', 'Not stated']], 'a', 'B begins with はい.', ['v_gakusei', 'v_hai']),
  dg('05', 'n5u03_d3', 'Who is the person over there?', [['a', 'Ms. Tanaka'], ['b', 'Mr. Yamada'], ['c', 'A teacher']], 'a', 'B says たなか さん です.', ['v_dare', 'v_san']),
  dg('06', 'n5u03_d4', 'What is B\'s name?', [['a', 'Tanaka'], ['b', 'Yamada'], ['c', 'Sato']], 'a', 'B says たなか です.', ['v_onamae', 'v_nan']));

// ---------- reading ----------
const r1 = ['わたし は たなか です', 'わたし は がくせい です', 'わたし は にほんじん です'];
const r2 = ['はじめまして', 'やまだ です', 'かいしゃいん です', 'とうきょう は おおきい まち です'];
const passages = [
  PS('n5u03_r1', { title: 'A name card', paragraphs: r1, translation_en: 'I am Tanaka. / I am a student. / I am Japanese.', word_count_chars: countChars(r1), question_ids: ['q_n5u03_rq01', 'q_n5u03_rq02', 'q_n5u03_rq03'], genre: 'notes' }),
  PS('n5u03_r2', { title: 'A short introduction', paragraphs: r2, translation_en: "Nice to meet you. / I'm Yamada. / (I'm) a company employee. / Tokyo is a big city.", word_count_chars: countChars(r2), question_ids: ['q_n5u03_rq04', 'q_n5u03_rq05'], genre: 'notes' }),
];
const rq = (n, pid, prompt, ch, ans, note, tg, type = 'reading_comp') => Q(`q_n5u03_rq${n}`, type, { stem: { prompt, context_id: pid }, choices: choices(ch), answer: ans, explanation_correct: note, explanation_per_distractor: Object.fromEntries(ch.filter(([id]) => id !== ans).map(([id, t]) => [id, `Check the text again: ${t} is not stated.`])), facet: 'read', targets: tg, difficulty: 2 });
add(rq('01', 'n5u03_r1', "What is the writer's name?", [['a', 'Tanaka'], ['b', 'Yamada'], ['c', 'Sato']], 'a', 'わたし は たなか です.', ['v_desu'], 'information_retrieval'),
  rq('02', 'n5u03_r1', 'What does the writer do?', [['a', 'Is a student'], ['b', 'Is a teacher'], ['c', 'Is a company employee']], 'a', 'わたし は がくせい です.', ['v_gakusei']),
  rq('03', 'n5u03_r1', 'What is the writer?', [['a', 'Japanese'], ['b', 'Not stated'], ['c', 'A guest']], 'a', 'わたし は にほんじん です.', ['v_nihonjin']),
  rq('04', 'n5u03_r2', "What is Yamada's job?", [['a', 'Company employee'], ['b', 'Teacher'], ['c', 'Student']], 'a', 'かいしゃいん です.', ['v_kaishain']),
  rq('05', 'n5u03_r2', 'Which line is about a city?', [['a', 'とうきょう は おおきい まち です', true], ['b', 'やまだ です', true], ['c', 'はじめまして', true]], 'a', 'とうきょう = Tokyo; まち = town or city.', ['v_toukyou']));

// ---------- phrase translation ----------
const tr = (n, sid, correct, wrong, note, extra = []) => { const s = sent(sid); return Q(`q_n5u03_tr${n}`, 'translate', { stem: { prompt: 'Choose the meaning.', ja: s.text_ja }, choices: choices([['a', correct], ['b', wrong[0]], ['c', wrong[1]]]), answer: 'a', explanation_correct: note, explanation_per_distractor: { b: `That is not what ${s.text_ja} says.`, c: `That is not what ${s.text_ja} says.` }, facet: 'meaning', targets: [...s.vocab_ids, ...extra], source_sentence_id: sid, difficulty: 2 }); };
add(tr('01', 's_n5u03_k01', 'I am a student.', ['I am a teacher.', 'You are a student.'], 'わたし = I, がくせい = student.'), tr('02', 's_n5u03_k02', 'Ms. Tanaka is a teacher.', ['Ms. Tanaka is a student.', 'I am a teacher.'], 'さん follows a name; せんせい = teacher.'),
  tr('03', 's_n5u03_k03', 'Mr. Yamada is a company employee.', ['Mr. Yamada is a student.', 'Mr. Yamada is Japanese.'], 'かいしゃいん = company employee.'), tr('04', 's_n5u03_k04', 'I am Japanese.', ['I am a company employee.', 'Japan is big.'], 'にほんじん = Japanese person.'),
  tr('05', 's_n5u03_k12', 'This is a school.', ['This is a hospital.', 'The school is big.'], 'ここ = here, がっこう = school.'), tr('06', 's_n5u03_k13', 'Tokyo is a big city.', ['Tokyo is a small town.', 'Osaka is a big city.'], 'おおきい = big, まち = town or city.'),
  tr('07', 's_n5u03_k10', 'This is Mr. Yamada.', ['Yamada is over there.', 'Who is Yamada?'], 'こちら = this person (polite).'), tr('08', 's_n5u03_k11', 'Who is the person over there?', ['What is that over there?', 'Where is that person?'], 'だれ = who.'),
  tr('09', 's_n5u03_k14', 'My hobby is photography.', ['My hobby is tea.', 'My hobby is reading.'], 'しゅみ = hobby, しゃしん = photo.'), tr('10', 's_n5u03_k17', 'Who is it? (polite)', ['What is it?', 'Are you a student?'], 'どなた = who (polite).'),
  tr('11', 's_n5u03_k15', 'Tokyo is famous.', ['Tokyo is delicious.', 'Tokyo is small.'], 'ゆうめい = famous.'), tr('12', 's_n5u03_k23', 'The hospital is over there.', ['The school is over there.', 'The hospital is big.'], 'びょういん = hospital, あそこ = over there.'),
  tr('13', 's_n5u03_k09', 'My name is Tanaka.', ['Your name is Tanaka.', 'Tanaka is a teacher.'], 'なまえ = name; わたし の なまえ = my name.'), tr('14', 's_n5u03_k16', 'Tea is delicious.', ['Tea is hot.', 'Milk is delicious.'], 'おちゃ = tea, おいしい = delicious.'));

// ---------- lessons ----------
const ids = (arr) => arr.map((x) => x.id);
const kids = (rom) => rom.map((r) => `ka_h_${r}`);
const qs = (...x) => x.map((n) => `q_n5u03_${n}`);
const vmq = (arr) => arr.map((x) => `q_n5u03_vm_${x.id.slice(2)}`);
const yk = kids(['kya', 'kyu', 'kyo', 'sha', 'shu', 'sho', 'cha', 'chu', 'cho', 'nya', 'nyu', 'nyo']);
const ym = kids(['hya', 'hyu', 'hyo', 'mya', 'myu', 'myo', 'rya', 'ryu', 'ryo', 'gya', 'gyu', 'gyo', 'ja', 'ju', 'jo', 'bya', 'byu', 'byo', 'pya', 'pyu', 'pyo']);
const spiralIds = questions.filter((q) => q.id.startsWith('q_n5u03_sr_')).map((q) => q.id);
const lessons = [
  L('n5_u03_l1', { title: 'Combined sounds I: ゃ ゅ ょ', goal: 'Read kana pairs such as きゃ and しゅ as one beat each.', introduces: { kana: yk, vocab: ids(vocabL.l1) },
    explain: [{ heading: 'A small kana changes the vowel', body: ['A small ゃ, ゅ or ょ after an い-column kana joins with it into a single beat: き + ゃ = きゃ (kya), し + ゅ = しゅ (shu), ち + ょ = ちょ (cho).', 'Notice the small size: ゃ (ya) is much smaller than や. Compare きゃ (kya, one beat) with きや (ki-ya, two beats).'], examples: [{ ja: 'おちゃ', reading: 'ocha', en: 'tea' }, { ja: 'しゃしん', reading: 'shashin', en: 'photo' }, { ja: 'こんにゃく', reading: 'konnyaku', en: 'konjac' }] }],
    practice: { question_ids: qs('kr01', 'kr02', 'kr03', 'kr04', 'mt01', 'mt02', 'rc01', 'rc02', 'rc03', 'rc04').concat(vmq(vocabL.l1)), gen: [{ type: 'kana_recog', from: 'kana', ids: yk, n: 6 }, { type: 'kana_listen', from: 'kana', ids: yk, n: 4 }] },
    exit_check: { gen: [{ type: 'kana_recog', from: 'kana', ids: yk, n: 6 }, { type: 'vocab_meaning', from: 'vocab', ids: ids(vocabL.l1), n: 4 }], pass: 0.7 } }),
  L('n5_u03_l2', { title: 'Combined sounds II', goal: 'Finish the combined sounds across the h, m, r, g, j, b and p rows.', introduces: { kana: ym, vocab: ids(vocabL.l2) },
    explain: [{ heading: 'The same idea in more rows', body: ['The pattern repeats: ひゃ hya, みゅ myu, りょ ryo, ぎゃ gya, びゅ byu, ぴょ pyo. じゃ じゅ じょ read "ja, ju, jo" (not "jya").', 'Voiced marks stay on the big kana: ぎ + ゃ = ぎゃ, び + ゅ = びゅ, ぴ + ょ = ぴょ.'], examples: [{ ja: 'ひゃく', reading: 'hyaku', en: 'one hundred' }, { ja: 'りょかん', reading: 'ryokan', en: 'Japanese inn' }, { ja: 'じゃあ', reading: 'jaa', en: 'well then' }] }],
    practice: { question_ids: qs('kr05', 'kr06', 'kr07', 'kr08', 'kr09', 'kr10', 'kr11', 'kr12', 'mt03', 'mt04', 'rc05', 'rc06', 'rc07', 'rc08', 'rc09', 'rc10', 'rc11', 'rc12', 'ty03', 'dc02').concat(vmq(vocabL.l2)), gen: [{ type: 'kana_recog', from: 'kana', ids: ym, n: 6 }, { type: 'kana_recall', from: 'kana', ids: ym, n: 4 }] },
    exit_check: { gen: [{ type: 'kana_recog', from: 'kana', ids: [...yk, ...ym], n: 6 }, { type: 'vocab_meaning', from: 'vocab', ids: ids(vocabL.l2), n: 3 }], pass: 0.7 } }),
  L('n5_u03_l3', { title: 'Small っ and long vowels', goal: 'Hear and write the pause of っ and the extra beat of a long vowel.', introduces: { kana: ['ka_h_sokuon'], vocab: ids(vocabL.l3) },
    explain: [{ heading: 'Small っ: a pause', body: ['A small っ before a consonant makes a short silent beat, and the next consonant is doubled in romaji: がっこう (gakkou), きって (kitte), ざっし (zasshi).', 'Compare おと (oto, sound) with おっと (otto, husband): the pause changes the word.'], examples: [{ ja: 'がっこう', reading: 'gakkou', en: 'school' }, { ja: 'きって', reading: 'kitte', en: 'stamp' }, { ja: 'ちょっと', reading: 'chotto', en: 'a little' }] },
      { heading: 'Long vowels', body: ['A long vowel lasts two beats. In hiragana it is written with an extra vowel kana: ああ, いい, うう, ええ (ei), おお or おう (ou).', 'The length changes meaning: おばあさん (grandmother) versus おばさん (aunt); おじいさん (grandfather) versus おじさん (uncle).'], examples: [{ ja: 'おばあさん', reading: 'obaasan', en: 'grandmother' }, { ja: 'とうきょう', reading: 'toukyou', en: 'Tokyo' }, { ja: 'おおさか', reading: 'oosaka', en: 'Osaka' }] }],
    practice: { question_ids: qs('mo01', 'mo02', 'mo03', 'mo04', 'mo05', 'mo06', 'mo07', 'mo08', 'ro01', 'ro02', 'ro03', 'ro04', 'dc03', 'dc04', 'dc05', 'ty04', 'ty05').concat(vmq(vocabL.l3)) },
    exit_check: { question_ids: qs('mo01', 'mo04', 'mo06', 'ro01', 'ro03', 'ro04', 'dc03', 'ty06', 'ty07', 'ty08'), pass: 0.7 } }),
  L('n5_u03_l4', { title: 'Saying what something is: X は Y です', goal: 'Make your first full sentences.', introduces: { vocab: ids(vocabL.l4), grammar: ['g_wa_desu'] },
    explain: [{ heading: 'Topic + は + description + です', body: ['わたし は がくせい です means "I am a student". は marks the topic and is pronounced "wa". です ends the sentence politely.', 'Add さん after someone else\'s name: たなか さん. Never add it to your own name.'], examples: [{ ja: 'わたし は がくせい です', reading: 'watashi wa gakusei desu', en: 'I am a student.' }, { ja: 'たなか さん は せんせい です', reading: 'tanaka san wa sensei desu', en: 'Ms. Tanaka is a teacher.' }] }],
    practice: { question_ids: qs('gw01', 'gw02', 'gw03', 'gw04', 'gw05', 'tr01', 'tr02', 'tr03', 'tr04').concat(vmq(vocabL.l4)) },
    context: { question_ids: qs('gw06', 'gw07', 'gw08', 'tr05', 'tr06', 'ty09', 'ty10') },
    exit_check: { question_ids: qs('gw01', 'gw03', 'gw04', 'gw05', 'gw07', 'tr01', 'tr03'), pass: 0.7 } }),
  L('n5_u03_l5', { title: 'Asking questions: ですか', goal: 'Ask and answer simple questions and introduce yourself.', introduces: { vocab: ids(vocabL.l5), grammar: ['g_ka_question'] },
    explain: [{ heading: 'か makes a question', body: ['Put か at the end: あなた は がくせい です か = "Are you a student?". The word order stays the same.', 'Answer with はい or いいえ, then the statement: はい わたし は がくせい です.'], examples: [{ ja: 'あなた は がくせい です か', reading: 'anata wa gakusei desu ka', en: 'Are you a student?' }, { ja: 'おなまえ は なん です か', reading: 'onamae wa nan desu ka', en: 'What is your name?' }] },
      { heading: 'Introducing yourself', body: ['はじめまして, then your name with です, then よろしく おねがいします. The other person replies こちら こそ.'], examples: [{ ja: 'はじめまして たなか です', reading: 'hajimemashite tanaka desu', en: "Nice to meet you. I'm Tanaka." }] }],
    practice: { question_ids: qs('gk01', 'gk02', 'gk03', 'gk04', 'gk05', 'dg03', 'dg04', 'tr07', 'tr08').concat(vmq(vocabL.l5)) },
    context: { question_ids: qs('gk06', 'gk07', 'gk08', 'dg01', 'dg02', 'dg05', 'dg06', 'tr09', 'tr10') },
    exit_check: { question_ids: qs('gk01', 'gk02', 'gk04', 'gk05', 'gk06', 'dg03', 'dg06'), pass: 0.7 } }),
  L('n5_u03_l6', { title: 'Listen and read', goal: 'Hear long vowels and small kana, and read a name card and an introduction.', introduces: {},
    explain: [{ heading: 'Length matters', body: ['In Japanese, a short pause or a long vowel changes the word. Listen carefully for the number of beats.'], examples: [{ ja: 'おじいさん', reading: 'ojiisan', en: 'grandfather' }, { ja: 'おじさん', reading: 'ojisan', en: 'uncle' }] }],
    practice: { question_ids: qs('gl01', 'gl02', 'gl03', 'gl04', 'gl05', 'gl06', 'gl07', 'gl08', 'dc01') },
    context: { question_ids: qs('rq01', 'rq02', 'rq03', 'rq04', 'rq05') },
    exit_check: { question_ids: qs('gl03', 'gl05', 'gl06', 'gl07', 'rq01', 'rq04', 'dc01'), pass: 0.7 } }),
  L('n5_u03_l7', { title: 'Putting words together', goal: 'Mix the new sounds and sentence patterns with what you learned in units 1 and 2.', introduces: {},
    explain: [{ heading: 'Review through use', body: ['Tell people who you are, ask who they are, and name things around you. Words from the first two units keep coming back so they stay fresh.'], examples: [{ ja: 'しゅみ は しゃしん です', reading: 'shumi wa shashin desu', en: 'My hobby is photography.' }, { ja: 'おちゃ は おいしい です', reading: 'ocha wa oishii desu', en: 'Tea is delicious.' }] }],
    practice: { question_ids: qs('tr11', 'tr12', 'tr13', 'tr14', 'ty01', 'ty02').concat(spiralIds.slice(0, 18)) },
    context: { question_ids: spiralIds.slice(18) },
    exit_check: { question_ids: qs('tr11', 'tr13', 'tr14', 'gw01', 'gk02').concat(spiralIds.slice(0, 3)), pass: 0.7 } }),
];

export default { vocab, sentences, questions, listening, passages, lessons, dialogues, grammar };
