#!/usr/bin/env node
// Builds content/<collection>/<unit>.json from content/authoring/*.mjs. `--check` fails if committed JSON differs (no drift).
import { readdirSync, writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');
const dir = join(root, 'content/authoring');
const OUT = { vocab: 'vocab', grammar: 'grammar', sentences: 'sentences', dialogues: 'dialogues', passages: 'passages', listening: 'listening', questions: 'questions', lessons: 'lessons', kanji: null, quests: null, mocks: 'mocks' };

const fmt = (arr) => `[\n${arr.map((x) => JSON.stringify(x)).join(',\n')}\n]\n`;
let drift = 0; let written = 0;
const curPath = join(root, 'content/curriculum.json');
const cur = JSON.parse(readFileSync(curPath, 'utf8'));
const lessonMap = {};
for (const f of readdirSync(dir).filter((x) => x.endsWith('.mjs')).sort()) {
  const mod = (await import(pathToFileURL(join(dir, f)).href)).default;
  const name = f.replace(/\.mjs$/, '');
  for (const l of mod.lessons || []) (lessonMap[l.unit_id] ||= []).push(l.id);
  for (const [coll, sub] of Object.entries(OUT)) {
    const arr = mod[coll];
    if (!arr || !arr.length) continue;
    let target;
    if (sub) target = join(root, 'content', sub, `${name}.json`);
    else if (coll === 'kanji') target = join(root, 'content', 'kanji', `${name}.json`);
    else continue;
    const text = fmt(arr);
    if (check) { if (!existsSync(target) || readFileSync(target, 'utf8') !== text) { console.error(`DRIFT: ${target}`); drift++; } continue; }
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, text); written++;
  }
}
// curriculum: lessons list per unit (derived from authoring); 'to_be_authored' becomes 'draft' once authored content exists
for (const u of cur.units) {
  if (lessonMap[u.id]) { u.lessons = lessonMap[u.id]; if (u.content_status === 'to_be_authored') u.content_status = 'draft'; }
  else { u.lessons = []; u.content_status = 'to_be_authored'; }
}
const curText = `${JSON.stringify(cur, null, 1)}\n`;
if (check) { if (readFileSync(curPath, 'utf8') !== curText) { console.error('DRIFT: content/curriculum.json (lessons)'); drift++; } } else writeFileSync(curPath, curText);
if (check) { if (drift) { console.error(`${drift} file(s) differ from authoring sources. Run: node scripts/author.mjs`); process.exit(1); } console.log('authoring check: committed JSON equals authoring output'); }
else console.log(`author: wrote ${written} file(s)`);
