#!/usr/bin/env node
// Generates content/kana.json (original data: character facts only). Re-run only when the kana plan changes.
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { kanaToRomaji, toKatakana } from '../src/content/romaji.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const rows = [
  ['a', 'あいうえお', 'n5_u01', 'basic'], ['ka', 'かきくけこ', 'n5_u01', 'basic'], ['sa', 'さしすせそ', 'n5_u01', 'basic'], ['ta', 'たちつてと', 'n5_u01', 'basic'], ['na', 'なにぬねの', 'n5_u01', 'basic'],
  ['ha', 'はひふへほ', 'n5_u02', 'basic'], ['ma', 'まみむめも', 'n5_u02', 'basic'], ['ya', 'やゆよ', 'n5_u02', 'basic'], ['ra', 'らりるれろ', 'n5_u02', 'basic'], ['wa', 'わを', 'n5_u02', 'basic'], ['n', 'ん', 'n5_u02', 'basic'],
  ['ga', 'がぎぐげご', 'n5_u02', 'dakuten'], ['za', 'ざじずぜぞ', 'n5_u02', 'dakuten'], ['da', 'だぢづでど', 'n5_u02', 'dakuten'], ['ba', 'ばびぶべぼ', 'n5_u02', 'dakuten'], ['pa', 'ぱぴぷぺぽ', 'n5_u02', 'handakuten'],
];
const youon = [['kya', 'きゃきゅきょ'], ['sha', 'しゃしゅしょ'], ['cha', 'ちゃちゅちょ'], ['nya', 'にゃにゅにょ'], ['hya', 'ひゃひゅひょ'], ['mya', 'みゃみゅみょ'], ['rya', 'りゃりゅりょ'], ['gya', 'ぎゃぎゅぎょ'], ['ja', 'じゃじゅじょ'], ['bya', 'びゃびゅびょ'], ['pya', 'ぴゃぴゅぴょ']];
const extKatakana = [['ex_t', 'ティトゥ'], ['ex_d', 'ディドゥ'], ['ex_f', 'ファフィフェフォ'], ['ex_w', 'ウィウェウォ'], ['ex_sh', 'シェジェチェ']];
const similarH = [['あ', 'お'], ['ぬ', 'め'], ['ね', 'れ'], ['れ', 'わ'], ['る', 'ろ'], ['は', 'ほ'], ['さ', 'ち'], ['い', 'り'], ['こ', 'に'], ['き', 'さ'], ['す', 'む'], ['め', 'ぬ'], ['ま', 'も'], ['つ', 'っ'], ['ふ', 'ぶ'], ['う', 'ら']];
const similarK = [['ソ', 'ン'], ['シ', 'ツ'], ['ク', 'ケ'], ['ク', 'タ'], ['ウ', 'ワ'], ['ウ', 'フ'], ['ノ', 'メ'], ['ミ', 'シ'], ['コ', 'ユ'], ['ス', 'ヌ'], ['マ', 'ム'], ['ア', 'マ'], ['チ', 'テ'], ['ヲ', 'ラ']];

const out = [];
const sim = (c, pairs) => [...new Set(pairs.filter((p) => p.includes(c)).flatMap((p) => p.filter((x) => x !== c)))];
const rom = (c) => (c === 'を' ? 'o' : kanaToRomaji(c));
let ord = 0;
function add(script, ch, row, unit, group, pairs) {
  const k = script === 'hiragana' ? ch : toKatakana(ch);
  const r = ch === 'を' ? 'wo' : rom(ch);
  out.push({ id: `ka_${script === 'hiragana' ? 'h' : 'k'}_${ch === 'ぢ' ? 'dji' : ch === 'づ' ? 'dzu' : r}`, char: k, script, romaji: r === 'wo' ? 'o' : r, row, group, unit_id: unit, order: ord++, similar_to: sim(k, pairs), instructional_level: 'N5' });
}
const hiraUnit = (u) => u;
for (const [row, chars, unit, group] of rows) for (const ch of chars) add('hiragana', ch, row, hiraUnit(unit), group, similarH);
for (const [row, chars] of youon) for (let i = 0; i < chars.length; i += 2) add('hiragana', chars.slice(i, i + 2), row, 'n5_u03', 'youon', similarH);
out.push({ id: 'ka_h_sokuon', char: 'っ', script: 'hiragana', romaji: '(pause)', row: 'special', group: 'sokuon', unit_id: 'n5_u03', order: ord++, similar_to: ['つ'], instructional_level: 'N5' });
// katakana: basic rows in u04, dakuten/handakuten/youon/extended in u05
for (const [row, chars, , group] of rows) {
  const base = group === 'basic';
  for (const ch of chars) add('katakana', ch, row, base ? 'n5_u04' : 'n5_u05', group, similarK);
}
for (const [row, chars] of youon) for (let i = 0; i < chars.length; i += 2) add('katakana', chars.slice(i, i + 2), row, 'n5_u05', 'youon', similarK);
for (const [row, chars] of extKatakana) { const seg = chars.match(/..?/g) || []; for (const ch of seg) { const hira = ch; out.push({ id: `ka_k_${kanaToRomaji(hira)}`, char: ch, script: 'katakana', romaji: kanaToRomaji(hira), row, group: 'extended', unit_id: 'n5_u05', order: ord++, similar_to: [], instructional_level: 'N5' }); } }
out.push({ id: 'ka_k_sokuon', char: 'ッ', script: 'katakana', romaji: '(pause)', row: 'special', group: 'sokuon', unit_id: 'n5_u05', order: ord++, similar_to: ['ツ'], instructional_level: 'N5' });
out.push({ id: 'ka_k_choon', char: 'ー', script: 'katakana', romaji: '(long vowel)', row: 'special', group: 'long', unit_id: 'n5_u05', order: ord++, similar_to: [], instructional_level: 'N5' });
// fix id collisions defensively
const seen = new Set();
for (const k of out) { while (seen.has(k.id)) k.id += '_2'; seen.add(k.id); }
writeFileSync(join(root, 'content/kana.json'), `${JSON.stringify(out, null, 0).replace(/\},\{/g, '},\n{')}\n`);
console.log(`kana.json: ${out.length} entries (hiragana ${out.filter((k) => k.script === 'hiragana').length}, katakana ${out.filter((k) => k.script === 'katakana').length})`);
