// Node-side loader: reads content/ into the raw model used by validators, coverage and bundling.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { emptyRaw } from '../../src/content/model.js';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));

const DIRS = { kanji: 'kanji', vocab: 'vocab', grammar: 'grammar', sentences: 'sentences', dialogues: 'dialogues', passages: 'passages', listening: 'listening', questions: 'questions', lessons: 'lessons', mocks: 'mocks' };

export function loadContent(dir = join(ROOT, 'content')) {
  const raw = emptyRaw();
  const opt = (f) => (existsSync(join(dir, f)) ? readJson(join(dir, f)) : null);
  raw.curriculum = opt('curriculum.json') || raw.curriculum;
  raw.kana = opt('kana.json') || [];
  raw.quests = opt('quests.json') || [];
  raw.status = opt('status.json') || {};
  raw.provenance = opt('provenance.json') || {};
  raw.blueprint = opt('mock_blueprint.json');
  raw.assets = opt('assets.manifest.json') || [];
  raw.files = {};
  for (const [coll, sub] of Object.entries(DIRS)) {
    const d = join(dir, sub);
    if (!existsSync(d) || !statSync(d).isDirectory()) continue;
    for (const f of readdirSync(d).filter((x) => x.endsWith('.json')).sort()) {
      const data = readJson(join(d, f));
      const arr = Array.isArray(data) ? data : [data];
      raw[coll].push(...arr);
      raw.files[`${sub}/${f}`] = arr.map((x) => x.id);
    }
  }
  return raw;
}

export function loadSpec() {
  return readJson(join(ROOT, 'spec', 'application_spec.json'));
}
