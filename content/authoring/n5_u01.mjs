// n5_u01 "Sounds and the first hiragana" - hand-written original content (see content/provenance.json).
// Kana scope: hiragana rows a, ka, sa, ta, na. Everything learner-facing here uses only those kana.
import { unit, choices, countChars } from '../../scripts/lib/author-helpers.mjs';

const U = unit('n5_u01');
const { vocab: V, sentence: S, question: Q, lesson: L, listening: LS, passage: PS } = U;

// ---------- vocabulary (47 words; each uses only kana introduced by its own lesson or earlier) ----------
const vocabL = {
  l1: [
    V('ai', 'あい', 'あい', ['love', 'affection'], 'noun', ['s_n5u01_32'], { destination_tags: [] }),
    V('ao', 'あお', 'あお', ['blue', 'green (traffic-light sense)'], 'noun', ['s_n5u01_22'], { note: 'Also used for the colour of a green traffic light.' }),
    V('ie', 'いえ', 'いえ', ['house', 'home'], 'noun', ['s_n5u01_03']),
    V('ue', 'うえ', 'うえ', ['above', 'on top of'], 'noun', ['s_n5u01_25']),
  ],
  l2: [
    V('aka', 'あか', 'あか', ['red'], 'noun', ['s_n5u01_22']),
    V('aki', 'あき', 'あき', ['autumn', 'fall'], 'noun', ['s_n5u01_17']),
    V('akai', 'あかい', 'あかい', ['red (adjective)'], 'i-adjective', ['s_n5u01_01']),
    V('aoi', 'あおい', 'あおい', ['blue (adjective)'], 'i-adjective', ['s_n5u01_02']),
    V('ika', 'いか', 'いか', ['squid'], 'noun', ['s_n5u01_21']),
    V('kao', 'かお', 'かお', ['face'], 'noun', ['s_n5u01_20']),
    V('koe', 'こえ', 'こえ', ['voice'], 'noun', ['s_n5u01_14']),
    V('koko', 'ここ', 'ここ', ['here'], 'pronoun (place)', ['s_n5u01_11']),
    V('ookii', 'おおきい', 'おおきい', ['big', 'large'], 'i-adjective', ['s_n5u01_03']),
  ],
  l3: [
    V('asa', 'あさ', 'あさ', ['morning'], 'noun', ['s_n5u01_16']),
    V('kasa', 'かさ', 'かさ', ['umbrella'], 'noun', ['s_n5u01_01', 's_n5u01_09']),
    V('kesa', 'けさ', 'けさ', ['this morning'], 'noun (time)', ['s_n5u01_18']),
    V('isu', 'いす', 'いす', ['chair'], 'noun', ['s_n5u01_11', 's_n5u01_25']),
    V('ushi', 'うし', 'うし', ['cow'], 'noun', ['s_n5u01_26']),
    V('okashi', 'おかし', 'おかし', ['sweets', 'confectionery'], 'noun', ['s_n5u01_07']),
    V('asoko', 'あそこ', 'あそこ', ['over there'], 'pronoun (place)', ['s_n5u01_10']),
    V('shio', 'しお', 'しお', ['salt'], 'noun', ['s_n5u01_31']),
    V('sushi', 'すし', 'すし', ['sushi'], 'noun', ['s_n5u01_05'], { destination_tags: ['tokyo'] }),
    V('seki', 'せき', 'せき', ['seat'], 'noun', ['s_n5u01_12']),
    V('sekai', 'せかい', 'せかい', ['world'], 'noun', ['s_n5u01_19']),
    V('soko', 'そこ', 'そこ', ['there (near you)'], 'pronoun (place)', ['s_n5u01_12']),
    V('oishii', 'おいしい', 'おいしい', ['delicious', 'tasty'], 'i-adjective', ['s_n5u01_05', 's_n5u01_06', 's_n5u01_07', 's_n5u01_08']),
  ],
  l4: [
    V('ikutsu', 'いくつ', 'いくつ', ['how many', 'how old (things)'], 'question word', ['s_n5u01_29'], { note: 'Used for asking how many things there are; also for asking age informally.' }),
    V('kutsu', 'くつ', 'くつ', ['shoes'], 'noun', ['s_n5u01_02', 's_n5u01_28']),
    V('kuchi', 'くち', 'くち', ['mouth'], 'noun', ['s_n5u01_15']),
    V('tako', 'たこ', 'たこ', ['octopus'], 'noun', ['s_n5u01_21']),
    V('tsuki', 'つき', 'つき', ['moon'], 'noun', ['s_n5u01_17']),
    V('te', 'て', 'て', ['hand'], 'noun', ['s_n5u01_13']),
    V('tokei', 'とけい', 'とけい', ['clock', 'watch'], 'noun', ['s_n5u01_27'], { destination_tags: ['tokyo_station'] }),
    V('chiisai', 'ちいさい', 'ちいさい', ['small', 'little'], 'i-adjective', ['s_n5u01_04', 's_n5u01_26']),
    V('uta', 'うた', 'うた', ['song'], 'noun', ['s_n5u01_19', 's_n5u01_32']),
    V('oto', 'おと', 'おと', ['sound', 'noise'], 'noun', ['s_n5u01_18']),
    V('otoko', 'おとこ', 'おとこ', ['man', 'male'], 'noun', ['s_n5u01_14']),
    V('ichi', 'いち', 'いち', ['one (1)'], 'number', ['s_n5u01_23']),
    V('shichi', 'しち', 'しち', ['seven (7)'], 'number', ['s_n5u01_24'], { note: 'Also read なな (nana), which you will meet later.' }),
  ],
  l5: [
    V('natsu', 'なつ', 'なつ', ['summer'], 'noun', ['s_n5u01_16']),
    V('nani', 'なに', 'なに', ['what'], 'question word', ['s_n5u01_30']),
    V('niku', 'にく', 'にく', ['meat'], 'noun', ['s_n5u01_08']),
    V('neko', 'ねこ', 'ねこ', ['cat'], 'noun', ['s_n5u01_04', 's_n5u01_13', 's_n5u01_20']),
    V('nuno', 'ぬの', 'ぬの', ['cloth', 'fabric'], 'noun', ['s_n5u01_28']),
    V('sakana', 'さかな', 'さかな', ['fish'], 'noun', ['s_n5u01_06', 's_n5u01_15', 's_n5u01_31']),
    V('anata', 'あなた', 'あなた', ['you'], 'pronoun', ['s_n5u01_09'], { note: 'Polite but impersonal; Japanese often avoids "you" and uses a name instead.' }),
    V('ni', 'に', 'に', ['two (2)'], 'number', ['s_n5u01_23']),
  ],
};
const vocab = Object.values(vocabL).flat();

// ---------- phrases (kana-only noun phrases; spaces are added for beginners) ----------
const ph = (n, text, en, vids, extra = {}) => S(`s_n5u01_${n}`, 'phrase', text, text, en, vids.map((v) => `v_${v}`), extra);
const sentences = [
  ph('01', 'あかい かさ', 'a red umbrella', ['akai', 'kasa']),
  ph('02', 'あおい くつ', 'blue shoes', ['aoi', 'kutsu']),
  ph('03', 'おおきい いえ', 'a big house', ['ookii', 'ie']),
  ph('04', 'ちいさい ねこ', 'a small cat', ['chiisai', 'neko']),
  ph('05', 'おいしい すし', 'delicious sushi', ['oishii', 'sushi']),
  ph('06', 'おいしい さかな', 'delicious fish', ['oishii', 'sakana']),
  ph('07', 'おいしい おかし', 'delicious sweets', ['oishii', 'okashi']),
  ph('08', 'おいしい にく', 'delicious meat', ['oishii', 'niku']),
  ph('09', 'あなた の かさ', 'your umbrella', ['anata', 'kasa']),
  ph('10', 'あそこ の えき', 'the station over there', ['asoko']),
  ph('11', 'ここ の いす', 'the chair here', ['koko', 'isu']),
  ph('12', 'そこ の せき', 'the seat there', ['soko', 'seki']),
  ph('13', 'ねこ の て', "a cat's paw (literally: the cat's hand)", ['neko', 'te']),
  ph('14', 'おとこ の こえ', "a man's voice", ['otoko', 'koe']),
  ph('15', 'さかな の くち', "a fish's mouth", ['sakana', 'kuchi']),
  ph('16', 'なつ の あさ', 'a summer morning', ['natsu', 'asa']),
  ph('17', 'あき の つき', 'the autumn moon', ['aki', 'tsuki']),
  ph('18', 'けさ の おと', "this morning's sounds", ['kesa', 'oto']),
  ph('19', 'せかい の うた', 'songs of the world', ['sekai', 'uta']),
  ph('20', 'ねこ の かお', "a cat's face", ['neko', 'kao']),
  ph('21', 'いか と たこ', 'squid and octopus', ['ika', 'tako']),
  ph('22', 'あか と あお', 'red and blue', ['aka', 'ao']),
  ph('23', 'いち と に', 'one and two', ['ichi', 'ni']),
  ph('24', 'しち と いち', 'seven and one', ['shichi', 'ichi']),
  ph('25', 'いす の うえ', 'on top of the chair', ['isu', 'ue']),
  ph('26', 'ちいさい うし', 'a small cow', ['chiisai', 'ushi']),
  ph('27', 'えき の とけい', 'the clock at the station', ['tokei']),
  ph('28', 'ぬの の くつ', 'cloth shoes (shoes made of cloth)', ['nuno', 'kutsu']),
  S('s_n5u01_29', 'expression', 'いくつ', 'いくつ', 'How many?', ['v_ikutsu']),
  S('s_n5u01_30', 'expression', 'なに', 'なに', 'What?', ['v_nani']),
  ph('31', 'しお と さかな', 'salt and fish', ['shio', 'sakana']),
  ph('32', 'あい と うた', 'love and song', ['ai', 'uta']),
];
// "えき" (v_eki) is not in the lesson vocab above: add it so the phrases with えき have their word.
vocabL.l3.push(V('eki', 'えき', 'えき', ['station', 'train station'], 'noun', ['s_n5u01_10', 's_n5u01_27'], { destination_tags: ['tokyo_station'] }));
vocab.push(vocabL.l3[vocabL.l3.length - 1]);
for (const s of sentences) if (['s_n5u01_10', 's_n5u01_27'].includes(s.id)) s.vocab_ids.push('v_eki');
sentences.find((s) => s.id === 's_n5u01_10').vocab_ids = ['v_asoko', 'v_eki'];
sentences.find((s) => s.id === 's_n5u01_27').vocab_ids = ['v_eki', 'v_tokei'];

// ---------- questions ----------
const questions = [];
const add = (...q) => questions.push(...q);

// kana recognition with per-distractor notes (authored)
const kr = (n, ch, rom, others, lessonNote, kid) => Q(`q_n5u01_kr${n}`, 'kana_recog', { stem: { prompt: 'Which sound is this kana?', ja: ch }, choices: choices([['a', rom], ...others.map((o, i) => [`d${i + 1}`, o])]), answer: 'a', explanation_correct: lessonNote, explanation_per_distractor: Object.fromEntries(others.map((o, i) => [`d${i + 1}`, `That is not the sound of ${ch}.`])), facet: 'read', targets: [kid], difficulty: 1 });
add(
  kr('01', 'お', 'o', ['a', 'u'], 'お is read "o".', 'ka_h_o'),
  kr('02', 'き', 'ki', ['ku', 'ka'], 'き is read "ki" (like "key").', 'ka_h_ki'),
  kr('03', 'し', 'shi', ['su', 'sa'], 'し is read "shi". Some keyboards also accept "si".', 'ka_h_shi'),
  kr('04', 'ち', 'chi', ['tsu', 'ta'], 'ち is read "chi" (like "cheese" without the final s).', 'ka_h_chi'),
  kr('05', 'つ', 'tsu', ['chi', 'tu'], 'つ is read "tsu" (the sound in "cats", then a short u).', 'ka_h_tsu'),
  kr('06', 'ぬ', 'nu', ['ne', 'no'], 'ぬ is read "nu".', 'ka_h_nu'),
  kr('07', 'せ', 'se', ['sa', 'so'], 'せ is read "se" (like "set").', 'ka_h_se'),
  kr('08', 'ね', 'ne', ['nu', 'na'], 'ね is read "ne" (like "net").', 'ka_h_ne'),
);
// kana recall (typed or on-screen kana picker)
const rc = (n, rom, ch, kid) => Q(`q_n5u01_rc${n}`, 'kana_recall', { stem: { prompt: `Write the hiragana for "${rom}".` }, answer: ch, explanation_correct: `"${rom}" is written ${ch}.`, facet: 'produce', targets: [kid], difficulty: 2 });
add(rc('01', 'ka', 'か', 'ka_h_ka'), rc('02', 'to', 'と', 'ka_h_to'), rc('03', 'no', 'の', 'ka_h_no'), rc('04', 'su', 'す', 'ka_h_su'), rc('05', 'e', 'え', 'ka_h_e'));
// matching (kana <-> romaji)
const mt = (n, pairs, ids, note) => Q(`q_n5u01_mt${n}`, 'matching', { stem: { prompt: 'Match each kana with its sound.' }, pairs, answer: pairs.map((p) => p[0]), explanation_correct: note, facet: 'read', targets: ids, difficulty: 1 });
add(
  mt('01', [['あ', 'a'], ['い', 'i'], ['う', 'u'], ['え', 'e'], ['お', 'o']], ['ka_h_a', 'ka_h_i', 'ka_h_u', 'ka_h_e', 'ka_h_o'], 'あ a, い i, う u, え e, お o: the five vowels.'),
  mt('02', [['か', 'ka'], ['き', 'ki'], ['く', 'ku'], ['け', 'ke'], ['こ', 'ko']], ['ka_h_ka', 'ka_h_ki', 'ka_h_ku', 'ka_h_ke', 'ka_h_ko'], 'The k row is k + each vowel.'),
  mt('03', [['さ', 'sa'], ['し', 'shi'], ['す', 'su'], ['せ', 'se'], ['そ', 'so']], ['ka_h_sa', 'ka_h_shi', 'ka_h_su', 'ka_h_se', 'ka_h_so'], 'The s row; し is "shi".'),
  mt('04', [['た', 'ta'], ['ち', 'chi'], ['つ', 'tsu'], ['て', 'te'], ['と', 'to']], ['ka_h_ta', 'ka_h_chi', 'ka_h_tsu', 'ka_h_te', 'ka_h_to'], 'The t row; ち is "chi" and つ is "tsu".'),
  mt('05', [['な', 'na'], ['に', 'ni'], ['ぬ', 'nu'], ['ね', 'ne'], ['の', 'no']], ['ka_h_na', 'ka_h_ni', 'ka_h_nu', 'ka_h_ne', 'ka_h_no'], 'The n row is n + each vowel.'),
  mt('06', [['あ', 'a'], ['く', 'ku'], ['そ', 'so'], ['ち', 'chi'], ['ね', 'ne'], ['の', 'no']], ['ka_h_a', 'ka_h_ku', 'ka_h_so', 'ka_h_chi', 'ka_h_ne', 'ka_h_no'], 'Mixed review of all five rows.'),
);
// word meaning questions: templated from the vocabulary table (counted separately as "templated")
const firstMeaning = (v) => v.meanings_en[0];
const words = (s) => new Set(s.toLowerCase().replace(/[()]/g, '').split(/[^a-z]+/).filter((w) => w.length > 2));
vocab.forEach((v, i) => {
  const mine = words(firstMeaning(v));
  const cands = [];
  for (let k = 1; cands.length < 3 && k < vocab.length; k++) {
    const c = vocab[(i + k * 7) % vocab.length];
    const theirs = words(firstMeaning(c));
    if (c.id === v.id || [...theirs].some((w) => mine.has(w)) || cands.some((x) => firstMeaning(x) === firstMeaning(c))) continue;
    cands.push(c);
  }
  const opts = [v, ...cands];
  const order = [(i + 1) % 4, (i + 2) % 4, (i + 3) % 4, i % 4];
  const ids = ['a', 'b', 'c', 'd'];
  const ordered = order.map((o) => opts[o]);
  const ans = ids[ordered.indexOf(v)];
  add(Q(`q_n5u01_vm_${v.id.slice(2)}`, 'mcq', { stem: { prompt: 'What does this word mean?', ja: v.surface }, choices: ordered.map((o, k) => ({ id: ids[k], text: firstMeaning(o), concept: o.id })), answer: ans, explanation_correct: `${v.surface} (${v.romaji}) means "${firstMeaning(v)}".`, explanation_per_distractor: Object.fromEntries(ordered.map((o, k) => [ids[k], `${o.surface} means "${firstMeaning(o)}".`]).filter(([k]) => k !== ans)), facet: 'meaning', targets: [v.id], difficulty: 1, tags: ['templated'] }));
});
// phrase translation (authored)
const tr = (n, sid, correct, wrong, note) => { const s = sentences.find((x) => x.id === sid); return Q(`q_n5u01_tr${n}`, 'translate', { stem: { prompt: 'Choose the meaning.', ja: s.text_ja }, choices: choices([['a', correct], ['b', wrong[0]], ['c', wrong[1]]]), answer: 'a', explanation_correct: note, explanation_per_distractor: { b: `That is not what ${s.text_ja} says.`, c: `That is not what ${s.text_ja} says.` }, facet: 'meaning', targets: s.vocab_ids, source_sentence_id: sid, difficulty: 2 }); };
add(
  tr('01', 's_n5u01_01', 'a red umbrella', ['a blue umbrella', 'a red house'], 'あかい = red, かさ = umbrella.'),
  tr('02', 's_n5u01_05', 'delicious sushi', ['small sushi', 'delicious fish'], 'おいしい = delicious, すし = sushi.'),
  tr('03', 's_n5u01_04', 'a small cat', ['a big cat', 'a small cow'], 'ちいさい = small, ねこ = cat.'),
  tr('04', 's_n5u01_10', 'the station over there', ['the station here', 'the house over there'], 'あそこ = over there; the little word の links the two nouns: "the station of over-there".'),
  tr('05', 's_n5u01_13', "a cat's paw", ["a cat's face", "a cat's voice"], 'ねこ の て: の links "cat" and "hand"; it works a bit like \'s in English.'),
  tr('06', 's_n5u01_14', "a man's voice", ["a man's face", "a cat's voice"], 'おとこ の こえ = a man\'s voice.'),
  tr('07', 's_n5u01_16', 'a summer morning', ['an autumn morning', 'a summer moon'], 'なつ = summer, あさ = morning.'),
  tr('08', 's_n5u01_17', 'the autumn moon', ['the summer moon', 'the autumn sound'], 'あき = autumn, つき = moon.'),
  tr('09', 's_n5u01_21', 'squid and octopus', ['squid and fish', 'cat and octopus'], 'と means "and" between two nouns.'),
  tr('10', 's_n5u01_25', 'on top of the chair', ['under the chair', 'a big chair'], 'うえ = top/above; いす の うえ = the top of the chair.'),
);
// fill in the blank (choices)
const fb = (n, ja, prompt, ch, ans, note, tg) => Q(`q_n5u01_fb${n}`, 'fill_blank', { stem: { prompt, ja }, choices: choices(ch.map(([id, t]) => [id, t, true])), answer: ans, explanation_correct: note, explanation_per_distractor: Object.fromEntries(ch.filter(([id]) => id !== ans).map(([id, t]) => [id, `${t} does not fit the meaning "${prompt.replace(/^Complete: /, '')}".`])), facet: 'construct', targets: tg, difficulty: 2 });
add(
  fb('01', '＿＿ いす', 'Complete: a small chair', [['a', 'ちいさい'], ['b', 'おおきい'], ['c', 'おいしい']], 'a', 'ちいさい = small. おおきい means big and おいしい means delicious.', ['v_chiisai', 'v_isu']),
  fb('02', 'おいしい ＿＿', 'Complete: delicious sweets', [['a', 'かさ'], ['b', 'おかし'], ['c', 'くつ']], 'b', 'おかし = sweets.', ['v_okashi', 'v_oishii']),
  fb('03', '＿＿ の えき', 'Complete: the station over there', [['a', 'ここ'], ['b', 'あそこ'], ['c', 'あなた']], 'b', 'あそこ = over there.', ['v_asoko', 'v_eki']),
  fb('04', 'あか と ＿＿', 'Complete: red and blue', [['a', 'あき'], ['b', 'あさ'], ['c', 'あお']], 'c', 'あお = blue.', ['v_ao', 'v_aka']),
);
// sentence (phrase) ordering
const so = (n, prompt, tiles, ans, sid, note) => Q(`q_n5u01_so${n}`, 'sentence_order', { stem: { prompt }, tiles, answer: ans, explanation_correct: note, facet: 'construct', targets: sentences.find((s) => s.id === sid).vocab_ids, source_sentence_id: sid, difficulty: 2 });
add(
  so('01', 'Put the words in order: a red umbrella', ['かさ', 'あかい'], ['あかい', 'かさ'], 's_n5u01_01', 'The describing word comes before the noun: あかい かさ.'),
  so('02', 'Put the words in order: the station over there', ['の', 'えき', 'あそこ'], ['あそこ', 'の', 'えき'], 's_n5u01_10', 'あそこ の えき: the linking の sits between the two nouns.'),
  so('03', 'Put the words in order: delicious sushi', ['すし', 'おいしい'], ['おいしい', 'すし'], 's_n5u01_05', 'おいしい すし.'),
  so('04', 'Put the words in order: squid and octopus', ['と', 'たこ', 'いか'], ['いか', 'と', 'たこ'], 's_n5u01_21', 'いか と たこ: と comes between the two nouns.'),
);
// dictation (typed after listening; transcript mode is disabled with an explanation when no voice exists)
const dc = (n, word, vid, note) => Q(`q_n5u01_dc${n}`, 'dictation', { stem: { prompt: 'Listen, then type the word in hiragana (romaji is accepted).', audio_text: word }, answer: word, explanation_correct: note, facet: 'listen', targets: [vid], difficulty: 3, tags: ['listening_relevant'] });
add(dc('01', 'ねこ', 'v_neko', 'ねこ (neko) = cat.'), dc('02', 'さかな', 'v_sakana', 'さかな (sakana) = fish.'), dc('03', 'いえ', 'v_ie', 'いえ (ie) = house.'), dc('04', 'とけい', 'v_tokei', 'とけい (tokei) = clock.'), dc('05', 'おいしい', 'v_oishii', 'おいしい (oishii) = delicious.'));
// typing
const ty = (n, en, ans, vid) => Q(`q_n5u01_ty${n}`, 'typing_ja', { stem: { prompt: `Type "${en}" in hiragana (romaji is accepted).` }, answer: ans, explanation_correct: `${en} = ${ans}.`, facet: 'produce', targets: [vid], difficulty: 2 });
add(ty('01', 'cat', 'ねこ', 'v_neko'), ty('02', 'umbrella', 'かさ', 'v_kasa'), ty('03', 'station', 'えき', 'v_eki'), ty('04', 'fish', 'さかな', 'v_sakana'), ty('05', 'summer', 'なつ', 'v_natsu'));
// listening (word discrimination)
const lq = (n, lid, word, others, vid, note) => Q(`q_n5u01_lq${n}`, 'listening_comp', { stem: { prompt: 'Which word did you hear?', audio_text: word, context_id: lid }, choices: choices([['a', word, true], ...others.map((o, i) => [`d${i + 1}`, o, true])]), answer: 'a', explanation_correct: note, explanation_per_distractor: Object.fromEntries(others.map((o, i) => [`d${i + 1}`, `${o} sounds different: listen again for each beat.`])), facet: 'listen', targets: [vid], difficulty: 2, tags: ['listening_relevant'] });
add(
  lq('01', 'n5u01_ls1', 'かさ', ['かお', 'あさ'], 'v_kasa', 'You heard かさ (kasa), "umbrella".'),
  lq('02', 'n5u01_ls1', 'ねこ', ['ぬの', 'にく'], 'v_neko', 'You heard ねこ (neko), "cat".'),
  lq('03', 'n5u01_ls1', 'くち', ['くつ', 'すし'], 'v_kuchi', 'You heard くち (kuchi), "mouth". くつ (kutsu) is "shoes".'),
  lq('04', 'n5u01_ls1', 'あさ', ['あき', 'あお'], 'v_asa', 'You heard あさ (asa), "morning".'),
  lq('05', 'n5u01_ls2', 'とけい', ['えき', 'いえ'], 'v_tokei', 'You heard とけい (tokei), "clock".'),
  lq('06', 'n5u01_ls2', 'おと', ['おとこ', 'うた'], 'v_oto', 'You heard おと (oto), "sound". おとこ (otoko) has one more beat.'),
  lq('07', 'n5u01_ls2', 'たこ', ['いか', 'さかな'], 'v_tako', 'You heard たこ (tako), "octopus".'),
  lq('08', 'n5u01_ls2', 'しお', ['すし', 'せき'], 'v_shio', 'You heard しお (shio), "salt".'),
);
const listening = [
  LS('n5u01_ls1', { item_type: 'Word recognition (lesson practice)', title: 'Which word? Set 1', script_turns: ['かさ', 'ねこ', 'くち', 'あさ'].map((t) => ({ speaker: 'A', text_ja: t })), question_ids: ['q_n5u01_lq01', 'q_n5u01_lq02', 'q_n5u01_lq03', 'q_n5u01_lq04'] }),
  LS('n5u01_ls2', { item_type: 'Word recognition (lesson practice)', title: 'Which word? Set 2', script_turns: ['とけい', 'おと', 'たこ', 'しお'].map((t) => ({ speaker: 'A', text_ja: t })), question_ids: ['q_n5u01_lq05', 'q_n5u01_lq06', 'q_n5u01_lq07', 'q_n5u01_lq08'] }),
];
// reading (labels and a menu board)
const mkChoices = (list) => choices(list.map(([id, t, ja]) => [id, t, ja]));
const rq = (n, pid, prompt, ch, ans, note, tg, type = 'reading_comp', ja = null) => Q(`q_n5u01_rq${n}`, type, { stem: { prompt, ja, context_id: pid }, choices: mkChoices(ch), answer: ans, explanation_correct: note, explanation_per_distractor: Object.fromEntries(ch.filter(([id]) => id !== ans).map(([id, t]) => [id, `Check the label again: ${t} is not the answer.`])), facet: 'read', targets: tg, difficulty: 2 });
add(
  rq('01', 'n5u01_r1', 'Which item is あおい (blue)?', [['a', 'かさ', true], ['b', 'くつ', true], ['c', 'とけい', true], ['d', 'いす', true]], 'b', 'あおい くつ: the blue item is the shoes.', ['v_aoi', 'v_kutsu']),
  rq('02', 'n5u01_r1', 'Which item is ちいさい (small)?', [['a', 'かさ', true], ['b', 'くつ', true], ['c', 'とけい', true], ['d', 'いす', true]], 'c', 'ちいさい とけい: the small item is the clock.', ['v_chiisai', 'v_tokei']),
  rq('03', 'n5u01_r1', 'What does the first label say?', [['a', 'a red umbrella'], ['b', 'a blue umbrella'], ['c', 'red shoes']], 'a', 'あかい かさ = a red umbrella.', ['v_akai', 'v_kasa']),
  rq('04', 'n5u01_r2', 'Which line is sweets?', [['a', 'すし', true], ['b', 'さかな', true], ['c', 'にく', true], ['d', 'おかし', true]], 'd', 'おいしい おかし = delicious sweets.', ['v_okashi'], 'information_retrieval'),
  rq('05', 'n5u01_r2', 'Which line is meat?', [['a', 'すし', true], ['b', 'さかな', true], ['c', 'にく', true], ['d', 'おかし', true]], 'c', 'おいしい にく = delicious meat.', ['v_niku'], 'information_retrieval'),
);
const p1 = ['あかい かさ', 'あおい くつ', 'ちいさい とけい', 'おおきい いす'];
const p2 = ['おいしい すし', 'おいしい さかな', 'おいしい にく', 'おいしい おかし'];
const passages = [
  PS('n5u01_r1', { title: 'Shop labels', paragraphs: p1, translation_en: 'A red umbrella / Blue shoes / A small clock / A big chair', word_count_chars: countChars(p1), question_ids: ['q_n5u01_rq01', 'q_n5u01_rq02', 'q_n5u01_rq03'], genre: 'labels' }),
  PS('n5u01_r2', { title: 'Menu board', paragraphs: p2, translation_en: 'Delicious sushi / Delicious fish / Delicious meat / Delicious sweets', word_count_chars: countChars(p2), question_ids: ['q_n5u01_rq04', 'q_n5u01_rq05'], genre: 'menu' }),
];

// ---------- lessons ----------
const ids = (arr) => arr.map((v) => v.id);
const kids = (rom) => rom.map((r) => `ka_h_${r}`);
const qs = (...x) => x.map((n) => `q_n5u01_${n}`);
const vmq = (arr) => arr.map((v) => `q_n5u01_vm_${v.id.slice(2)}`);
const lessons = [
  L('n5_u01_l1', { title: 'The five vowels あいうえお', goal: 'Read and say the five vowel kana, the first step to reading signs at your arrival in Tokyo.', introduces: { kana: kids(['a', 'i', 'u', 'e', 'o']), vocab: ids(vocabL.l1) },
    explain: [
      { heading: 'Japanese is spoken in even beats', body: ['Japanese is counted in short, even beats called morae. Each hiragana you learn is exactly one beat. So あい is two beats (a-i) and いえ is two beats (i-e). Tap the table once for each kana to feel the rhythm.', 'English tends to stress some syllables and squash others. In Japanese try to give every beat the same length.'], examples: [{ ja: 'あい', reading: 'ai', en: 'love (2 beats)' }, { ja: 'いえ', reading: 'ie', en: 'house (2 beats)' }] },
      { heading: 'The five vowels', body: ['Every Japanese syllable ends in one of five clear vowels: あ "a" (as in "father"), い "i" (as in "machine"), う "u" (like "moon" but with relaxed lips), え "e" (as in "bed") and お "o" (as in "more", without gliding).', 'The audio in this app is your device\'s Japanese text-to-speech voice. It is synthetic, and quality differs from device to device.'], examples: [{ ja: 'うえ', reading: 'ue', en: 'above' }, { ja: 'あお', reading: 'ao', en: 'blue' }] },
      { heading: 'About the romaji hints', body: ['Under each kana you will see romaji (the Latin spelling) as a helper. It is a crutch: the hint fades once a kana is secure, because the goal is to read kana directly.'] },
    ],
    practice: { question_ids: qs('kr01', 'mt01', ...[]).concat(vmq(vocabL.l1)), gen: [{ type: 'kana_recog', from: 'kana', ids: kids(['a', 'i', 'u', 'e', 'o']), n: 5 }, { type: 'kana_listen', from: 'kana', ids: kids(['a', 'i', 'u', 'e', 'o']), n: 4 }] },
    exit_check: { gen: [{ type: 'kana_recog', from: 'kana', ids: kids(['a', 'i', 'u', 'e', 'o']), n: 6 }, { type: 'vocab_meaning', from: 'vocab', ids: ids(vocabL.l1), n: 4 }], pass: 0.7 } }),
  L('n5_u01_l2', { title: 'The k row かきくけこ', goal: 'Add five more kana and read your first colour and body words.', introduces: { kana: kids(['ka', 'ki', 'ku', 'ke', 'ko']), vocab: ids(vocabL.l2) },
    explain: [
      { heading: 'Consonant + vowel', body: ['The k row is the consonant k followed by each vowel in the same order as before: か ka, き ki, く ku, け ke, こ ko.', 'Say k lightly, without the puff of air English adds in "kite". The vowel stays pure and short.'], examples: [{ ja: 'あか', reading: 'aka', en: 'red' }, { ja: 'かお', reading: 'kao', en: 'face' }, { ja: 'こえ', reading: 'koe', en: 'voice' }] },
      { heading: 'Words you can already read', body: ['With only ten kana you can read adjectives that end in い: あかい (red), あおい (blue) and おおきい (big). Words ending in い that describe things are called i-adjectives; you will study them properly in a later unit.'], examples: [{ ja: 'あかい', reading: 'akai', en: 'red (adjective)' }, { ja: 'おおきい', reading: 'ookii', en: 'big (the first お is written twice: a long "oo")' }] },
    ],
    practice: { question_ids: qs('kr02', 'mt02', 'rc01').concat(vmq(vocabL.l2).slice(0, 6)), gen: [{ type: 'kana_recog', from: 'kana', ids: kids(['ka', 'ki', 'ku', 'ke', 'ko']), n: 5 }, { type: 'kana_recall', from: 'kana', ids: kids(['ka', 'ki', 'ku', 'ke', 'ko']), n: 4 }] },
    exit_check: { gen: [{ type: 'kana_recog', from: 'kana', ids: kids(['a', 'i', 'u', 'e', 'o', 'ka', 'ki', 'ku', 'ke', 'ko']), n: 6 }, { type: 'vocab_meaning', from: 'vocab', ids: ids(vocabL.l2), n: 4 }], pass: 0.7 } }),
  L('n5_u01_l3', { title: 'The s row さしすせそ', goal: 'Learn the s row, including the special sound し, and read food words you will see in Tokyo.', introduces: { kana: kids(['sa', 'shi', 'su', 'se', 'so']), vocab: ids(vocabL.l3) },
    explain: [
      { heading: 'The s row and the sound "shi"', body: ['さ sa, し shi, す su, せ se, そ so. Notice し is "shi", not "si": it is pronounced like the start of "sheep". Keyboards usually accept both "shi" and "si" when you type.', 'The u in す is often very light in everyday speech, so すし sounds close to "ssh-shi". Aim for a short, quiet u.'], examples: [{ ja: 'すし', reading: 'sushi', en: 'sushi' }, { ja: 'せかい', reading: 'sekai', en: 'world' }, { ja: 'しお', reading: 'shio', en: 'salt' }] },
      { heading: 'Little words for places', body: ['ここ (here), そこ (there, near the listener) and あそこ (over there, far from both of you) form a set. You will use all three at a station.'], examples: [{ ja: 'ここ', reading: 'koko', en: 'here' }, { ja: 'あそこ', reading: 'asoko', en: 'over there' }] },
    ],
    practice: { question_ids: qs('kr03', 'mt03', 'rc04').concat(vmq(vocabL.l3).slice(0, 6)), gen: [{ type: 'kana_recog', from: 'kana', ids: kids(['sa', 'shi', 'su', 'se', 'so']), n: 5 }, { type: 'matching', from: 'kana', ids: kids(['ka', 'ki', 'ku', 'sa', 'shi', 'su']), n: 6 }] },
    exit_check: { gen: [{ type: 'kana_recog', from: 'kana', ids: kids(['ka', 'ki', 'ku', 'ke', 'ko', 'sa', 'shi', 'su', 'se', 'so']), n: 6 }, { type: 'vocab_meaning', from: 'vocab', ids: ids(vocabL.l3), n: 4 }], pass: 0.7 } }),
  L('n5_u01_l4', { title: 'The t row たちつてと', goal: 'Finish the t row, the two special sounds ち and つ, and start counting.', introduces: { kana: kids(['ta', 'chi', 'tsu', 'te', 'to']), vocab: ids(vocabL.l4) },
    explain: [
      { heading: 'Two special sounds', body: ['た ta, ち chi, つ tsu, て te, と to. Two of them change the consonant: ち is "chi" (like "cheese") and つ is "tsu" (the "ts" of "cats" followed by a short u). Do not say "ti" or "tu".'], examples: [{ ja: 'つき', reading: 'tsuki', en: 'moon' }, { ja: 'とけい', reading: 'tokei', en: 'clock' }, { ja: 'いち', reading: 'ichi', en: 'one' }] },
      { heading: 'Counting and asking "how many"', body: ['いち is one and しち is seven. The word いくつ asks "how many?" about things; the answer pattern comes in a later unit.'], examples: [{ ja: 'いくつ', reading: 'ikutsu', en: 'how many?' }, { ja: 'しち', reading: 'shichi', en: 'seven' }] },
    ],
    practice: { question_ids: qs('kr04', 'kr05', 'mt04', 'rc02').concat(vmq(vocabL.l4).slice(0, 6)), gen: [{ type: 'kana_recog', from: 'kana', ids: kids(['ta', 'chi', 'tsu', 'te', 'to']), n: 5 }, { type: 'kana_listen', from: 'kana', ids: kids(['ta', 'chi', 'tsu', 'te', 'to']), n: 4 }] },
    exit_check: { gen: [{ type: 'kana_recog', from: 'kana', ids: kids(['sa', 'shi', 'su', 'se', 'so', 'ta', 'chi', 'tsu', 'te', 'to']), n: 6 }, { type: 'vocab_meaning', from: 'vocab', ids: ids(vocabL.l4), n: 4 }], pass: 0.7 } }),
  L('n5_u01_l5', { title: 'The n row なにぬねの', goal: 'Complete your first 25 kana, including look-alikes ぬ, ね and の, and read animal and food words.', introduces: { kana: kids(['na', 'ni', 'nu', 'ne', 'no']), vocab: ids(vocabL.l5) },
    explain: [
      { heading: 'Five more, and look-alikes', body: ['な na, に ni, ぬ nu, ね ne, の no. Some kana look alike, such as ぬ and ね: compare them side by side and say the sound aloud each time you see them.', 'の is also a very common little word that links two nouns; you will see it in phrases like ねこ の て (the cat\'s paw) in the next lesson.'], examples: [{ ja: 'ねこ', reading: 'neko', en: 'cat' }, { ja: 'さかな', reading: 'sakana', en: 'fish' }, { ja: 'なつ', reading: 'natsu', en: 'summer' }] },
      { heading: 'Where the pitch goes', body: ['Japanese words have a pitch pattern (high and low tones) rather than strong stress. This course does not teach pitch accent yet; the synthetic voice gives a rough idea, but it is not a reliable model.'] },
    ],
    practice: { question_ids: qs('kr06', 'kr07', 'kr08', 'mt05', 'rc03', 'rc05').concat(vmq(vocabL.l5)), gen: [{ type: 'kana_recog', from: 'kana', ids: kids(['na', 'ni', 'nu', 'ne', 'no']), n: 5 }, { type: 'kana_recall', from: 'kana', ids: kids(['na', 'ni', 'nu', 'ne', 'no']), n: 4 }] },
    exit_check: { question_ids: qs('mt06'), gen: [{ type: 'kana_recog', from: 'kana', ids: kids(['ta', 'chi', 'tsu', 'te', 'to', 'na', 'ni', 'nu', 'ne', 'no']), n: 6 }, { type: 'vocab_meaning', from: 'vocab', ids: ids(vocabL.l5), n: 4 }], pass: 0.7 } }),
  L('n5_u01_l6', { title: 'Words in phrases', goal: 'Read short phrases built from your 25 kana, as on shop labels and menus.', introduces: {},
    explain: [
      { heading: 'Spaces and the little words の and と', body: ['Beginner and children\'s texts put spaces between words, as in this course. Normal adult text has no spaces; you will meet that soon.', 'の links two nouns: A の B is "B of A", like \'s in English (ねこ の て: the cat\'s paw). と links two nouns with "and" (いか と たこ: squid and octopus). Treat them as small connecting words for now.'], examples: [{ ja: 'あかい かさ', reading: 'akai kasa', en: 'a red umbrella' }, { ja: 'ねこ の て', reading: 'neko no te', en: "a cat's paw" }, { ja: 'いか と たこ', reading: 'ika to tako', en: 'squid and octopus' }] },
      { heading: 'Describing words go first', body: ['The word that describes a noun comes right before it: おいしい すし (delicious sushi), ちいさい ねこ (a small cat).'], examples: [{ ja: 'おいしい すし', reading: 'oishii sushi', en: 'delicious sushi' }] },
    ],
    practice: { question_ids: qs('tr01', 'tr02', 'tr03', 'tr04', 'tr05', 'fb01', 'fb02', 'so01', 'so03'), gen: [{ type: 'vocab_produce', from: 'vocab', ids: ids(vocab.slice(0, 20)), n: 4 }] },
    context: { question_ids: qs('tr06', 'tr07', 'tr08', 'tr09', 'tr10', 'fb03', 'fb04', 'so02', 'so04', 'ty01', 'ty02', 'ty03') },
    exit_check: { question_ids: qs('tr01', 'tr04', 'tr09', 'fb01', 'fb02', 'so01'), pass: 0.7 } }),
  L('n5_u01_l7', { title: 'Listen and read', goal: 'Tell similar-sounding words apart by ear and read a shop sign and a menu board.', introduces: {},
    explain: [
      { heading: 'Listening for every beat', body: ['Many mix-ups come from missing a beat: くち (2 beats) and くつ (2 beats) differ in the last kana, while おと (2 beats) and おとこ (3 beats) differ by length. Count the beats as you listen.', 'If your device has no Japanese voice, the app shows the transcript instead and says so.'], examples: [{ ja: 'くち', reading: 'kuchi', en: 'mouth' }, { ja: 'くつ', reading: 'kutsu', en: 'shoes' }, { ja: 'おとこ', reading: 'otoko', en: 'man' }] },
      { heading: 'Reading signs', body: ['Shop labels and menu boards use short phrases: what it is, and what it is like. Find the describing word and the noun, then answer the question.'], examples: [{ ja: 'おいしい おかし', reading: 'oishii okashi', en: 'delicious sweets' }] },
    ],
    practice: { question_ids: qs('lq01', 'lq02', 'lq03', 'lq04', 'dc01', 'dc02', 'dc03') },
    context: { question_ids: qs('rq01', 'rq02', 'rq03', 'rq04', 'rq05', 'lq05', 'lq06', 'lq07', 'lq08', 'dc04', 'dc05', 'ty04', 'ty05') },
    exit_check: { question_ids: qs('lq01', 'lq05', 'lq08', 'rq01', 'rq02', 'rq04', 'rq05'), pass: 0.7 } }),
];

export default { vocab, sentences, questions, listening, passages, lessons };
