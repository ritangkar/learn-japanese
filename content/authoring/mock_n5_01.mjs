// mock_n5_01 "Original N5-style practice exam 1" - hand-written original content (mock-only questions, passages and listening scripts).
// Original practice exam. Not an official JLPT paper. Questions imitate the STRUCTURE of the public test description only; nothing is copied from any official paper.
// Level tag: instructional level N5 (unofficial). Only vocabulary, kanji and grammar taught in units n5_u01 to n5_u12 are used.
import { unit, countChars } from '../../scripts/lib/author-helpers.mjs';

const U = unit('n5_u12');
const { question: Q, passage: PS, listening: LS } = U;
const JA = /[぀-ヿ一-鿿]/;
const LET = ['a', 'b', 'c', 'd'];

/** One exam-style item: opts are the four answer texts in final order, `ans` is the index of the correct one, `why` lists a note for each option (the correct note first explains the answer). */
const mc = (id, section, itemType, stem, opts, ans, correctNote, wrongNotes, extra = {}) => {
  const choices = opts.map((t, i) => ({ id: LET[i], text: t, ...(JA.test(t) ? { ja: true } : {}) }));
  const per = {}; let w = 0;
  opts.forEach((_, i) => { if (i !== ans) per[LET[i]] = wrongNotes[w++]; });
  return Q(`q_m501_${id}`, 'exam_style', { section, jlpt_item_type: itemType, stem, choices, answer: LET[ans], explanation_correct: correctNote, explanation_per_distractor: per, facet: { vocabulary: 'meaning', grammar: 'construct', reading: 'read', listening: 'listen' }[section], targets: [], difficulty: 2, ...extra });
};
const questions = [];
const add = (...q) => questions.push(...q);

// ======================= Section 1: Language Knowledge (Vocabulary) =======================
const KR = 'Kanji reading';
add(
  mc('v01', 'vocabulary', KR, { prompt: 'How is the word in brackets read?', ja: '【駅】 は あそこ に あります' }, ['くち', 'えき', 'みせ', 'まち'], 1, '駅 is read えき (station).', ['口 is くち.', '店 is みせ.', '町 is まち.']),
  mc('v02', 'vocabulary', KR, { prompt: 'How is the word in brackets read?', ja: 'この 【川】 の みず は つめたい です' }, ['やま', 'うみ', 'まち', 'かわ'], 3, '川 is read かわ (river).', ['山 is やま.', '海 is うみ.', '町 is まち.']),
  mc('v03', 'vocabulary', KR, { prompt: 'How is the word in brackets read?', ja: '【今月】 は とても いそがしい です' }, ['こんげつ', 'こんしゅう', 'せんげつ', 'ことし'], 0, '今月 is こんげつ (this month).', ['今週 is こんしゅう.', '先月 is せんげつ.', '今年 is ことし.']),
  mc('v04', 'vocabulary', KR, { prompt: 'How is the word in brackets read?', ja: 'あの 【新しい】 みせ は にんき です' }, ['ふるい', 'あたらしい', 'やすい', 'おそい'], 1, '新しい is read あたらしい (new).', ['古い is ふるい.', '安い is やすい.', '遅い is おそい and has not been taught.']),
  mc('v05', 'vocabulary', KR, { prompt: 'How is the word in brackets read?', ja: '【毎日】 ほん を よみます' }, ['まいあさ', 'まいばん', 'まいにち', 'まいしゅう'], 2, '毎日 is まいにち (every day).', ['毎朝 would be まいあさ.', '毎晩 would be まいばん.', '毎週 would be まいしゅう.']),
  mc('v06', 'vocabulary', KR, { prompt: 'How is the word in brackets read?', ja: 'この ケーキ は 【五百円】 です' }, ['ごせんえん', 'ごひゃくえん', 'ごまんえん', 'ごじゅうえん'], 1, '五百円 is ごひゃくえん (500 yen).', ['五千円 is ごせんえん.', '五万円 is ごまんえん.', '五十円 is ごじゅうえん.']),
  mc('v07', 'vocabulary', KR, { prompt: 'How is the word in brackets read?', ja: '【電車】 で がっこう へ いきます' }, ['でんしゃ', 'くるま', 'じてんしゃ', 'ひこうき'], 0, '電車 is でんしゃ (train).', ['車 is くるま.', '自転車 is じてんしゃ.', '飛行機 is ひこうき.']),
  mc('v08', 'vocabulary', KR, { prompt: 'How is the word in brackets read?', ja: 'きのう 【友だち】 と えいが を みました' }, ['せんせい', 'かぞく', 'こども', 'ともだち'], 3, '友だち is read ともだち (friend).', ['先生 is せんせい.', '家族 is かぞく.', '子供 is こども.']),
);
const OR = 'Orthography';
add(
  mc('v09', 'vocabulary', OR, { prompt: 'Which is the correct way to write the word in brackets?', ja: 'えき の 【まえ】 に ぎんこう が あります' }, ['後', '中', '前', '下'], 2, '前 is まえ (front).', ['後 is うしろ or あと.', '中 is なか.', '下 is した.']),
  mc('v10', 'vocabulary', OR, { prompt: 'Which is the correct way to write the word in brackets?', ja: 'わたし の あに は 【だいがくせい】 です' }, ['大学生', '大学先', '大先生', '学大生'], 0, '大学生 is だいがくせい (university student).', ['大学先 is not a word.', '大先生 is not a word.', '学大生 is not a word.']),
  mc('v11', 'vocabulary', OR, { prompt: 'Which is the correct way to write the word in brackets?', ja: '【にほんご】 の ほん を かいました' }, ['日本人', '日語本', '日本', '日本語'], 3, '日本語 is にほんご (Japanese language).', ['日本人 is にほんじん.', '日語本 is not a word.', '日本 is にほん.']),
  mc('v12', 'vocabulary', OR, { prompt: 'Which is the correct way to write the word in brackets?', ja: 'この 【ほん】 は おもしろい です' }, ['木', '本', '大', '人'], 1, '本 is ほん (book).', ['木 is き.', '大 is おお.', '人 is ひと.']),
  mc('v13', 'vocabulary', OR, { prompt: 'Which is the correct way to write the word in brackets?', ja: '【ごぜん】 くじ に がっこう へ いきます' }, ['午前', '午後', '午分', '今前'], 0, '午前 is ごぜん (a.m.).', ['午後 is ごご.', '午分 is not a word.', '今前 is not a word.']),
);
const CD = 'Contextually-defined expressions';
add(
  mc('v14', 'vocabulary', CD, { prompt: 'Choose the best word for the blank.', ja: 'へや が あつい です。＿＿ を あけて ください。' }, ['まど', 'くつ', 'さいふ', 'めがね'], 0, 'You open a window when a room is hot.', ['You do not open shoes.', 'You do not open a wallet to cool a room.', 'You do not open glasses.']),
  mc('v15', 'vocabulary', CD, { prompt: 'Choose the best word for the blank.', ja: 'わたし は まいあさ ＿＿ を よみます。' }, ['ぎゅうにゅう', 'ふね', 'しんぶん', 'くつ'], 2, 'You read a newspaper (しんぶん).', ['You drink milk, not read it.', 'You do not read a boat.', 'You do not read shoes.']),
  mc('v16', 'vocabulary', CD, { prompt: 'Choose the best word for the blank.', ja: 'この スーパー は ＿＿ です。パン が ひゃく えん です。' }, ['ひろい', 'ながい', 'やすい', 'おもい'], 2, 'A 100-yen bread price means the shop is cheap (やすい).', ['ひろい describes space.', 'ながい describes length.', 'おもい describes weight.']),
  mc('v17', 'vocabulary', CD, { prompt: 'Choose the best word for the blank.', ja: 'えき で でんしゃ を ＿＿。' }, ['のみます', 'かきます', 'ねます', 'まちます'], 3, 'You wait (まちます) for a train.', ['You do not drink a train.', 'You do not write a train.', 'You do not sleep a train.']),
  mc('v18', 'vocabulary', CD, { prompt: 'Choose the best word for the blank.', ja: 'おんせん で ゆっくり ＿＿ に はいります。' }, ['えき', 'ぎんこう', 'おふろ', 'がっこう'], 2, 'You take a bath (おふろ) at a hot spring.', ['You do not enter a station for a bath.', 'You do not enter a bank for a bath.', 'You do not enter a school for a bath.']),
  mc('v19', 'vocabulary', CD, { prompt: 'Choose the best word for the blank.', ja: 'ほん を かいます。＿＿ で かいます。' }, ['ほんや', 'ぎんこう', 'パンや', 'びょういん'], 0, 'You buy books at a bookstore (ほんや).', ['A bank does not sell books.', 'A bakery sells bread.', 'A hospital does not sell books.']),
  mc('v20', 'vocabulary', CD, { prompt: 'Choose the best word for the blank.', ja: 'きょう は さむい です。＿＿ は つめたい です。' }, ['かぜ', 'うみ', 'ふじさん', 'さいふ'], 0, 'Wind (かぜ) can be cold.', ['The sea is not described as cold wind.', 'A mountain is not the cold thing in the sentence.', 'A wallet is not cold.']),
);
const PA = 'Paraphrases';
add(
  mc('v21', 'vocabulary', PA, { prompt: 'Choose the sentence with the closest meaning.', ja: 'ここ は わたし の へや です。' }, ['わたし の へや は ここ です。', 'ここ に へや が あります。', 'わたし は へや の なか に います。', 'へや は わたし の じゃ ありません。'], 0, 'Both say that this place is my room.', ['This says there is a room here, not that it is mine.', 'This says I am inside, not that the place is my room.', 'This says the room is not mine.']),
  mc('v22', 'vocabulary', PA, { prompt: 'Choose the sentence with the closest meaning.', ja: 'あの みせ は やすい です。' }, ['あの みせ は ひろい です。', 'あの みせ は たかく ない です。', 'あの みせ は ふるい です。', 'あの みせ は にぎやか です。'], 1, '"Cheap" is close to "not expensive".', ['This is about size.', 'This is about age.', 'This is about liveliness.']),
  mc('v23', 'vocabulary', PA, { prompt: 'Choose the sentence with the closest meaning.', ja: 'きのう は ひま でした。' }, ['きのう は いそがしかった です。', 'あした は ひま です。', 'きのう は いそがしく なかった です。', 'きのう は さむかった です。'], 2, '"Free" is close to "not busy".', ['This is the opposite.', 'This is about tomorrow.', 'This is about the weather.']),
  mc('v24', 'vocabulary', PA, { prompt: 'Choose the sentence with the closest meaning.', ja: 'この ほん は むずかしく ない です。' }, ['この ほん は やさしい です。', 'この ほん は むずかしい です。', 'この ほん は ふるい です。', 'この ほん は たかい です。'], 0, '"Not difficult" is close to "easy".', ['This is the opposite.', 'This is about age.', 'This is about price.']),
  mc('v25', 'vocabulary', PA, { prompt: 'Choose the sentence with the closest meaning.', ja: 'わたし は ゴルフ が へた です。' }, ['わたし は ゴルフ が すき です。', 'わたし は ゴルフ が あまり じょうず じゃ ありません。', 'わたし は ゴルフ が きらい です。', 'わたし は ゴルフ を しません。'], 1, '"Bad at" is close to "not very good at".', ['Liking is not the same as skill.', 'Disliking is not the same as skill.', 'Not playing is not the same as being bad at it.']),
);

// ======================= Section 2: Language Knowledge (Grammar) and Reading =======================
const G1 = 'Sentential grammar 1 (Selecting grammar form)';
add(
  mc('g01', 'grammar', G1, { prompt: 'Choose the best answer for the blank.', ja: 'わたし ＿＿ がくせい です。たなか さん も がくせい です。' }, ['は', 'を', 'に', 'で'], 0, 'は marks the topic.', ['を marks an object.', 'に marks a place or time.', 'で marks a place of action or means.']),
  mc('g02', 'grammar', G1, { prompt: 'Choose the best answer for the blank.', ja: 'ともだち ＿＿ えいが を みます。' }, ['の', 'が', 'と', 'で'], 2, 'と means "with".', ['の links nouns.', 'が would mark a subject.', 'で marks a place or means.']),
  mc('g03', 'grammar', G1, { prompt: 'Choose the best answer for the blank.', ja: 'まいあさ ごはん ＿＿ たべます。' }, ['が', 'を', 'に', 'へ'], 1, 'を marks the object of the action.', ['が marks the subject of existence or likes.', 'に marks a place or time.', 'へ marks a destination.']),
  mc('g04', 'grammar', G1, { prompt: 'Choose the best answer for the blank.', ja: 'バス ＿＿ がっこう へ いきます。' }, ['を', 'が', 'に', 'で'], 3, 'で marks the means.', ['を marks an object.', 'が marks the subject.', 'に marks a place or time.']),
  mc('g05', 'grammar', G1, { prompt: 'Choose the best answer for the blank.', ja: 'つくえ の うえ に ほん ＿＿ あります。' }, ['を', 'が', 'も', 'の'], 1, 'が marks the thing that exists.', ['を marks an object.', 'も means "also".', 'の links nouns.']),
  mc('g06', 'grammar', G1, { prompt: 'Choose the best answer for the blank.', ja: 'きのう わたし は えいが を ＿＿。' }, ['みます', 'みました', 'みたい', 'みて'], 1, 'きのう needs the past: みました.', ['みます is present or future.', 'みたい means "want to watch".', 'みて is the て-form.']),
  mc('g07', 'grammar', G1, { prompt: 'Choose the best answer for the blank.', ja: 'この ラーメン は ＿＿ です。わたし は すき じゃ ありません。' }, ['おいしい', 'おいしくない', 'おいしかった', 'おいしく'], 1, 'Not liking it suggests it is not delicious: おいしくない.', ['おいしい would not explain why you do not like it.', 'おいしかった is the past.', 'おいしく alone cannot end the sentence.']),
  mc('g08', 'grammar', G1, { prompt: 'Choose the best answer for the blank.', ja: 'ここ に すわって ＿＿。' }, ['ます', 'たい', 'ください', 'です'], 2, 'て-form + ください is a request.', ['ます cannot follow て.', 'たい attaches to the stem.', 'です cannot follow て here.']),
  mc('g09', 'grammar', G1, { prompt: 'Choose the best answer for the blank.', ja: 'きょう は ひま ＿＿ ありません。いそがしい です。' }, ['く', 'な', 'じゃ', 'の'], 2, 'ひま is a な-adjective: ひま じゃ ありません.', ['く is for い-adjectives.', 'な goes before a noun.', 'の links nouns.']),
  mc('g10', 'grammar', G1, { prompt: 'Choose the best answer for the blank.', ja: 'たなか さん は せんせい です。わたし ＿＿ せんせい です。' }, ['が', 'も', 'を', 'に'], 1, 'も means "also".', ['が marks the subject.', 'を marks an object.', 'に marks a place or time.']),
);
const G2 = 'Sentential grammar 2 (Sentence composition)';
add(
  mc('g11', 'grammar', G2, { prompt: 'Put the words in order. Which word goes in the ★ position?', ja: 'ぎんこう は ＿＿ ＿＿ ★ ＿＿ あります。 (1. えき 2. の 3. まえ 4. に)' }, ['えき', 'の', 'まえ', 'に'], 2, 'えき の まえ に: まえ is third.', ['えき is first.', 'の is second.', 'に is fourth.']),
  mc('g12', 'grammar', G2, { prompt: 'Put the words in order. Which word goes in the ★ position?', ja: 'わたし は ＿＿ ＿＿ ★ ＿＿ ます。 (1. まいあさ 2. おちゃ 3. を 4. のみ)' }, ['まいあさ', 'おちゃ', 'を', 'のみ'], 2, 'まいあさ おちゃ を のみ: を is third.', ['まいあさ is first.', 'おちゃ is second.', 'のみ is fourth.']),
  mc('g13', 'grammar', G2, { prompt: 'Put the words in order. Which word goes in the ★ position?', ja: '＿＿ ＿＿ ★ ＿＿ です。 (1. あの 2. ひと 3. は 4. せんせい)' }, ['あの', 'ひと', 'は', 'せんせい'], 2, 'あの ひと は せんせい: は is third.', ['あの is first.', 'ひと is second.', 'せんせい is fourth.']),
  mc('g14', 'grammar', G2, { prompt: 'Put the words in order. Which word goes in the ★ position?', ja: '＿＿ ＿＿ ★ ＿＿ ください。 (1. すみません 2. コーヒー 3. を 4. ふたつ)' }, ['すみません', 'コーヒー', 'を', 'ふたつ'], 2, 'すみません コーヒー を ふたつ ください: を is third.', ['すみません is first.', 'コーヒー is second.', 'ふたつ is fourth.']),
);
const TG = 'Text grammar';
const gPassage = PS('m501_tg', { title: 'A climb with a friend (blanks)', paragraphs: ['きのう わたし は ともだち ［1］ ふじさん ［2］ のぼりました。', 'ちょうじょう は とても さむかった です ［3］、けしき は きれい でした。'], translation_en: 'Yesterday I climbed Mount Fuji with a friend. The summit was very cold, but the view was beautiful.', word_count_chars: countChars(['きのう わたし は ともだち ［1］ ふじさん ［2］ のぼりました。', 'ちょうじょう は とても さむかった です ［3］、けしき は きれい でした。']), question_ids: ['q_m501_g15', 'q_m501_g16', 'q_m501_g17'], genre: 'notes' });
add(
  mc('g15', 'grammar', TG, { prompt: 'Choose the best word for blank [1].', context_id: 'm501_tg' }, ['と', 'の', 'を', 'が'], 0, 'と means "with a friend".', ['の links nouns.', 'を marks an object.', 'が marks a subject.']),
  mc('g16', 'grammar', TG, { prompt: 'Choose the best word for blank [2].', context_id: 'm501_tg' }, ['を', 'で', 'に', 'も'], 2, 'のぼります takes に for the thing climbed.', ['を would mark an object here, but this verb takes に.', 'で marks a place of action.', 'も means "also".']),
  mc('g17', 'grammar', TG, { prompt: 'Choose the best word for blank [3].', context_id: 'm501_tg' }, ['と', 'が', 'を', 'に'], 1, 'が between clauses means "but".', ['と joins nouns.', 'を marks an object.', 'に marks a place or time.']),
);
const RS = 'Comprehension (Short passages)';
const rp1 = PS('m501_r1', { title: 'A note on the table', paragraphs: ['たなか さん へ', 'あした は にちようび です。しちじ に えき の まえ に きて ください。', 'やまだ'], translation_en: 'To Ms. Tanaka: Tomorrow is Sunday. Please come to the front of the station at seven. Yamada', word_count_chars: 0, question_ids: ['q_m501_r01', 'q_m501_r02'], genre: 'notes' });
const rp2 = PS('m501_r2', { title: 'A diary', paragraphs: ['きのう は あめ でした。ともだち と スーパー へ いきました。', 'パン と ミルク を かいました。ぜんぶで ろっぴゃく えん でした。'], translation_en: 'Yesterday was rainy. I went to the supermarket with a friend. We bought bread and milk. It was 600 yen in total.', word_count_chars: 0, question_ids: ['q_m501_r03', 'q_m501_r04', 'q_m501_r05'], genre: 'notes' });
const rp3 = PS('m501_r3', { title: 'A short message', paragraphs: ['らいしゅう の どようび に おんせん へ いきます。', 'おふろ に ゆっくり はいりたい です。', 'あなた も いきます か。'], translation_en: 'Next Saturday I am going to a hot spring. I want to take a long, slow bath. Are you coming too?', word_count_chars: 0, question_ids: ['q_m501_r06', 'q_m501_r07', 'q_m501_r08'], genre: 'notes' });
for (const p of [rp1, rp2, rp3]) p.word_count_chars = countChars(p.paragraphs);
add(
  mc('r01', 'reading', RS, { prompt: 'When should Ms. Tanaka come?', context_id: 'm501_r1' }, ['Sunday at 7', 'Saturday at 7', 'Sunday at 9', 'Monday at 7'], 0, 'あした は にちようび, しちじ に.', ['Saturday is not mentioned.', 'The time is 7, not 9.', 'Monday is not mentioned.']),
  mc('r02', 'reading', RS, { prompt: 'Where should Ms. Tanaka come?', context_id: 'm501_r1' }, ['Behind the station', 'Inside the bank', 'In front of the station', 'To the school'], 2, 'えき の まえ = in front of the station.', ['うしろ would be behind.', 'The bank is not mentioned.', 'The school is not mentioned.']),
  mc('r03', 'reading', RS, { prompt: 'What was the weather yesterday?', context_id: 'm501_r2' }, ['Sunny', 'Cloudy', 'Snowy', 'Rainy'], 3, 'あめ でした.', ['Sunny is not mentioned.', 'Cloudy is not mentioned.', 'Snow is not mentioned.']),
  mc('r04', 'reading', RS, { prompt: 'What did the writer buy?', context_id: 'm501_r2' }, ['Bread and milk', 'Rice and tea', 'Cake and coffee', 'A book'], 0, 'パン と ミルク を かいました.', ['Rice and tea were not bought.', 'Cake and coffee were not bought.', 'A book was not bought.']),
  mc('r05', 'reading', RS, { prompt: 'How much did it cost in total?', context_id: 'm501_r2' }, ['300 yen', '100 yen', '800 yen', '600 yen'], 3, 'ぜんぶで ろっぴゃく えん = 600 yen.', ['さんびゃく would be 300.', 'ひゃく would be 100.', 'はっぴゃく would be 800.']),
  mc('r06', 'reading', RS, { prompt: 'When is the writer going to the hot spring?', context_id: 'm501_r3' }, ['Next Saturday', 'Last Saturday', 'Next Sunday', 'Today'], 0, 'らいしゅう の どようび.', ['せんしゅう would be last week.', 'にちようび is Sunday.', 'きょう is today.']),
  mc('r07', 'reading', RS, { prompt: 'What does the writer want to do?', context_id: 'm501_r3' }, ['Take photos', 'Take a bath slowly', 'Climb a mountain', 'Eat dinner'], 1, 'ゆっくり おふろ に はいりたい.', ['Photos are not mentioned.', 'A climb is not mentioned.', 'Dinner is not mentioned.']),
  mc('r08', 'reading', RS, { prompt: 'What does the writer ask at the end?', context_id: 'm501_r3' }, ['Whether the reader is free', 'Whether the reader will come too', 'Where the hot spring is', 'How much it costs'], 1, 'あなた も いきます か = will you go too?', ['The reader\'s schedule is not asked.', 'The location is not asked.', 'The price is not asked.']),
);
const RM = 'Comprehension (Mid-size passages)';
const rp4 = PS('m501_r4', { title: 'A day at the lake', paragraphs: ['なつ に ともだち と みずうみ へ いきました。', 'あさ ろくじ に いえ を でて、でんしゃ と バス で いきました。', 'ロープウェイ に のって、たかい ばしょ から けしき を みました。', 'みずうみ は ひろくて とても きれい でした。', 'ひる に おにぎり を たべて、しゃしん を とりました。', 'かえり は バス が おそかった です が、たのしかった です。'], translation_en: 'In summer I went to a lake with a friend. I left home at six in the morning and went by train and bus. I rode the ropeway and looked at the view from a high place. The lake was wide and very beautiful. At noon we ate rice balls and took photos. The bus on the way back was late, but it was fun.', word_count_chars: 0, question_ids: ['q_m501_r09', 'q_m501_r10', 'q_m501_r11'], genre: 'notes' });
rp4.word_count_chars = countChars(rp4.paragraphs);
add(
  mc('r09', 'reading', RM, { prompt: 'How did the writer get to the lake?', context_id: 'm501_r4' }, ['By car', 'By train and bus', 'On foot', 'By plane'], 1, 'でんしゃ と バス で いきました.', ['Car is not mentioned.', 'Walking is not mentioned.', 'A plane is not mentioned.']),
  mc('r10', 'reading', RM, { prompt: 'What did the writer eat at noon?', context_id: 'm501_r4' }, ['Cake', 'Noodles', 'Rice balls', 'Bread'], 2, 'ひる に おにぎり を たべて.', ['Cake is not mentioned.', 'Noodles are not mentioned.', 'Bread is not mentioned.']),
  mc('r11', 'reading', RM, { prompt: 'What was the problem on the way back?', context_id: 'm501_r4' }, ['It rained', 'The bus was late', 'The lake was closed', 'The writer was tired'], 1, 'かえり は バス が おそかった です が.', ['Rain is not mentioned.', 'The lake was not closed.', 'Tiredness is not mentioned.']),
);
const IR = 'Information retrieval';
const rp5 = PS('m501_r5', { title: 'Ropeway notice', paragraphs: ['ロープウェイ の おしらせ', '午前 九時 から 午後 五時 まで', 'ひと 千 円　こども 五百 円', '月曜日 は やすみ です'], ruby: { 午前: 'ごぜん', 九時: 'くじ', 午後: 'ごご', 五時: 'ごじ', 千: 'せん', 円: 'えん', 五百: 'ごひゃく', 月曜日: 'げつようび' }, translation_en: 'Ropeway notice / 9 a.m. to 5 p.m. / Adults 1,000 yen per person, children 500 yen / Closed on Mondays', word_count_chars: 0, question_ids: ['q_m501_r12', 'q_m501_r13'], genre: 'signs' });
rp5.word_count_chars = countChars(rp5.paragraphs);
add(
  mc('r12', 'reading', IR, { prompt: 'How much is a ticket for a child?', context_id: 'm501_r5' }, ['1,000 yen', '5,000 yen', '500 yen', '100 yen'], 2, '五百 円 = 500 yen.', ['千 円 is the price for other riders.', 'No 5,000 yen price is listed.', 'No 100 yen price is listed.']),
  mc('r13', 'reading', IR, { prompt: 'On which day is the ropeway closed?', context_id: 'm501_r5' }, ['Sunday', 'Monday', 'Saturday', 'Friday'], 1, '月曜日 は やすみ = closed on Monday.', ['日曜日 is Sunday.', '土曜日 is Saturday.', '金曜日 is Friday.']),
);

// ======================= Section 3: Listening =======================
const TB = 'Task-based comprehension';
add(
  mc('l01', 'listening', TB, { prompt: 'Listen. What time will they meet?', audio_text: 'あした なんじ に あいます か。ごご さんじ に あいます。' }, ['3 p.m.', '3 a.m.', '5 p.m.', '9 a.m.'], 0, 'ごご さんじ = 3 p.m.', ['ごご means p.m., not a.m.', 'The time is 3, not 5.', 'The time is 3, not 9.']),
  mc('l02', 'listening', TB, { prompt: 'Listen. Where will they wait?', audio_text: 'どこ で まちます か。えき の まえ で まちます。' }, ['At the bank', 'In front of the station', 'At school', 'Behind the park'], 1, 'えき の まえ = in front of the station.', ['The bank is not mentioned.', 'The school is not mentioned.', 'The park is not mentioned.']),
  mc('l03', 'listening', TB, { prompt: 'Listen. What does the customer buy?', audio_text: 'なに を かいます か。パン と ミルク を ください。' }, ['Tea and rice', 'Bread and milk', 'Cake and coffee', 'A book'], 1, 'パン と ミルク.', ['Tea and rice are not mentioned.', 'Cake and coffee are not mentioned.', 'A book is not mentioned.']),
  mc('l04', 'listening', TB, { prompt: 'Listen. How will they go?', audio_text: 'なん で いきます か。バス で いきます。' }, ['By train', 'By bus', 'On foot', 'By bicycle'], 1, 'バス で = by bus.', ['Train is not mentioned.', 'Walking is not mentioned.', 'Bicycle is not mentioned.']),
  mc('l05', 'listening', TB, { prompt: 'Listen. When will they go?', audio_text: 'いつ いきます か。らいしゅう の どようび です。' }, ['This Saturday', 'Next Saturday', 'Next Sunday', 'Last Saturday'], 1, 'らいしゅう の どようび = next Saturday.', ['こんしゅう would be this week.', 'にちようび is Sunday.', 'せんしゅう would be last week.']),
  mc('l06', 'listening', TB, { prompt: 'Listen. Who will the speaker go with?', audio_text: 'だれ と いきます か。ともだち と いきます。' }, ['Alone', 'With a teacher', 'With a friend', 'With family'], 2, 'ともだち と = with a friend.', ['The speaker is not alone.', 'A teacher is not mentioned.', 'Family is not mentioned.']),
);
const KP = 'Comprehension of key points';
add(
  mc('l07', 'listening', KP, { prompt: 'Listen. What did the speaker do yesterday?', audio_text: 'きのう は あめ でした。ともだち と えいが を みました。' }, ['Went shopping', 'Watched a movie', 'Climbed a mountain', 'Stayed home'], 1, 'えいが を みました.', ['Shopping is not mentioned.', 'A climb is not mentioned.', 'The speaker went out with a friend.']),
  mc('l08', 'listening', KP, { prompt: 'Listen. Where is the speaker\'s house?', audio_text: 'わたし の いえ は えき の ちかく です。ぎんこう の となり です。' }, ['Next to the bank', 'In front of the park', 'Behind the school', 'Inside the station'], 0, 'ぎんこう の となり.', ['The park is not mentioned.', 'The school is not mentioned.', 'It is near, not inside, the station.']),
  mc('l09', 'listening', KP, { prompt: 'Listen. What is the speaker\'s mother?', audio_text: 'ちち は いしゃ です。はは は せんせい です。' }, ['A doctor', 'A nurse', 'A teacher', 'A shop clerk'], 2, 'はは は せんせい.', ['The father is the doctor.', 'A nurse is not mentioned.', 'A shop clerk is not mentioned.']),
  mc('l10', 'listening', KP, { prompt: 'Listen. What day of the week is it?', audio_text: 'きょう は ごがつ ふつか です。もくようび です。' }, ['Tuesday', 'Wednesday', 'Thursday', 'Friday'], 2, 'もくようび = Thursday.', ['かようび is Tuesday.', 'すいようび is Wednesday.', 'きんようび is Friday.']),
  mc('l11', 'listening', KP, { prompt: 'Listen. What does the speaker say about the ramen?', audio_text: 'この ラーメン は おいしい です が、すこし たかい です。' }, ['Cheap and delicious', 'Delicious but a little expensive', 'Not delicious', 'Big and cheap'], 1, 'おいしい ... が ... たかい.', ['It is not described as cheap.', 'It is described as delicious.', 'Size is not mentioned.']),
  mc('l12', 'listening', KP, { prompt: 'Listen. What time does the speaker get up tomorrow?', audio_text: 'あした は あさ ろくじ に おきます。ごはん を たべて がっこう へ いきます。' }, ['6 a.m.', '6 p.m.', '9 a.m.', '7 a.m.'], 0, 'ろくじ = 6 o\'clock; あさ = morning.', ['あさ means morning, not evening.', 'The time is 6, not 9.', 'The time is 6, not 7.']),
);
const VE = 'Verbal expressions';
add(
  mc('l13', 'listening', VE, { prompt: 'Listen. You are about to eat. What do you say?', audio_text: 'ごはん を たべます。' }, ['いただきます', 'ごちそうさまでした', 'ただいま', 'おやすみなさい'], 0, 'いただきます is said before eating.', ['ごちそうさまでした is said after eating.', 'ただいま is said on coming home.', 'おやすみなさい is said at bedtime.']),
  mc('l14', 'listening', VE, { prompt: 'Listen. You have finished eating. What do you say?', audio_text: 'ごはん を たべました。' }, ['いただきます', 'はじめまして', 'ごちそうさまでした', 'おはよう'], 2, 'ごちそうさまでした is said after a meal.', ['いただきます is before.', 'はじめまして is for first meetings.', 'おはよう is a morning greeting.']),
  mc('l15', 'listening', VE, { prompt: 'Listen. You arrive home. What do you say?', audio_text: 'いえ に かえりました。' }, ['おかえりなさい', 'さようなら', 'ただいま', 'どうぞ'], 2, 'ただいま is said on arriving home.', ['おかえりなさい is what the family says.', 'さようなら is goodbye.', 'どうぞ is "please go ahead".']),
  mc('l16', 'listening', VE, { prompt: 'Listen. Your friend comes home. What do you say?', audio_text: 'ともだち が いえ に かえりました。' }, ['ただいま', 'おかえりなさい', 'ごめんなさい', 'いただきます'], 1, 'おかえりなさい welcomes someone home.', ['ただいま is said by the person arriving.', 'ごめんなさい is an apology.', 'いただきます is said before eating.']),
  mc('l17', 'listening', VE, { prompt: 'Listen. You meet your friend in the morning. What do you say?', audio_text: 'あさ です。ともだち に あいました。' }, ['こんばんは', 'おやすみなさい', 'おはよう', 'さようなら'], 2, 'おはよう is the casual morning greeting.', ['こんばんは is evening.', 'おやすみなさい is bedtime.', 'さようなら is goodbye.']),
  mc('l18', 'listening', VE, { prompt: 'Listen. You want to get a stranger\'s attention. What do you say?', audio_text: 'ひと が います。' }, ['すみません', 'いただきます', 'ただいま', 'おはよう'], 0, 'すみません is the all-purpose "excuse me".', ['いただきます is for meals.', 'ただいま is for coming home.', 'おはよう is a morning greeting.']),
);
const QR = 'Quick response';
add(
  mc('l19', 'listening', QR, { prompt: 'Listen and choose the best reply.', audio_text: 'おなまえ は なん です か。' }, ['たなか です', 'ありがとう', 'あした です', 'ごひゃく えん です'], 0, 'The question asks the name.', ['ありがとう does not give a name.', 'あした is tomorrow.', 'ごひゃく えん is a price.']),
  mc('l20', 'listening', QR, { prompt: 'Listen and choose the best reply.', audio_text: 'ぎんこう は どこ です か。' }, ['はい です', 'ひゃく えん です', 'えき の まえ です', 'さんじ です'], 2, 'The question asks where.', ['はい です does not give a place.', 'ひゃく えん is a price.', 'さんじ is a time.']),
  mc('l21', 'listening', QR, { prompt: 'Listen and choose the best reply.', audio_text: 'きのう なに を たべました か。' }, ['うどん を たべました', 'うどん を たべます', 'うどん が すき です', 'うどん です'], 0, 'Answer in the past with を.', ['たべます is present.', 'This answers a different question.', 'です does not say what was eaten.']),
  mc('l22', 'listening', QR, { prompt: 'Listen and choose the best reply.', audio_text: 'これ は いくら です か。' }, ['ごひゃく えん です', 'あそこ です', 'ともだち です', 'もくようび です'], 0, 'The question asks the price.', ['あそこ is a place.', 'ともだち is a person.', 'もくようび is a day.']),
  mc('l23', 'listening', QR, { prompt: 'Listen and choose the best reply.', audio_text: 'いま なんじ です か。' }, ['ごがつ です', 'さんじ はん です', 'ろっぴゃく えん です', 'はい です'], 1, 'The question asks the time.', ['ごがつ is a month.', 'ろっぴゃく えん is a price.', 'はい です does not give a time.']),
  mc('l24', 'listening', QR, { prompt: 'Listen and choose the best reply.', audio_text: 'あした は いそがしい です か。' }, ['いいえ ひま です', 'いいえ いそがしかった です', 'はい きのう です', 'いいえ あした です'], 0, 'A natural answer: no, I am free.', ['The past tense does not fit a question about tomorrow.', 'きのう is yesterday.', 'The reply repeats the time instead of answering.']),
);
const listeningItems = [];
const listeningQs = questions.filter((q) => q.section === 'listening');
const listening = listeningQs.map((q, i) => LS(`m501_ls${String(i + 1).padStart(2, '0')}`, { item_type: q.jlpt_item_type, title: `Mock 1 listening item ${i + 1}`, script_turns: [{ speaker: 'A', text_ja: q.stem.audio_text }], question_ids: [q.id] }));
void listeningItems;
for (const q of listeningQs) { q.stem.context_id = `m501_ls${String(listeningQs.indexOf(q) + 1).padStart(2, '0')}`; }

const passages = [gPassage, rp1, rp2, rp3, rp4, rp5];
const vq = questions.filter((q) => q.section === 'vocabulary').map((q) => q.id);
const grq = questions.filter((q) => q.section === 'grammar' || q.section === 'reading').map((q) => q.id);
const lq = listeningQs.map((q) => q.id);
const mocks = [{ id: 'mock_n5_01', level: 'N5', title: 'Original N5-style practice exam 1', series: 'Original practice exams', created_on: '2026-10-29', disclaimer_key: 'practice_not_official', provenance: 'orig',
  sections: [
    { id: 'vocab', official_section_name: 'Language Knowledge (Vocabulary)', minutes: 20, question_ids: vq },
    { id: 'grammar_reading', official_section_name: 'Language Knowledge (Grammar) / Reading', minutes: 40, question_ids: grq, shared_passages: passages.map((p) => p.id) },
    { id: 'listening', official_section_name: 'Listening', minutes: 30, question_ids: lq, listening_ids: listening.map((l) => l.id) },
  ] }];

export default { questions, passages, listening, mocks };
