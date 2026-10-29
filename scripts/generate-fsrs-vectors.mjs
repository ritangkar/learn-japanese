#!/usr/bin/env node
// Generates tests/vectors/fsrs45.json by running the REAL ts-fsrs 3.5.7 library (dev dependency, never bundled).
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const lib = require('ts-fsrs');
const pkg = require('ts-fsrs/package.json');
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const f = lib.fsrs({ request_retention: 0.9, enable_fuzz: false });
const alg = new lib.FSRSAlgorithm({ request_retention: 0.9 });
const vec = { source: { package: 'ts-fsrs', version: pkg.version, FSRSVersion: lib.FSRSVersion, generatedBy: 'scripts/generate-fsrs-vectors.mjs' }, w: lib.default_w, pure: {}, review: [], newCard: [], retentions: [] };
// pure functions
vec.pure.forgetting = []; vec.pure.initD = []; vec.pure.initS = []; vec.pure.nextD = []; vec.pure.recall = []; vec.pure.forget = []; vec.pure.interval = [];
for (const t of [0, 1, 2, 5, 10, 30, 100]) for (const s of [0.1, 0.5, 1, 4.1386, 10, 50, 365]) vec.pure.forgetting.push({ t, s, r: alg.forgetting_curve(t, s) });
for (const g of [1, 2, 3, 4]) { vec.pure.initD.push({ g, d: alg.init_difficulty(g) }); vec.pure.initS.push({ g, s: alg.init_stability(g) }); }
for (const d of [1, 2.5, 5.1443, 7, 10]) for (const g of [1, 2, 3, 4]) vec.pure.nextD.push({ d, g, v: alg.next_difficulty(d, g) });
for (const d of [1, 3, 5.1443, 8, 10]) for (const s of [0.5, 1, 4, 12, 60, 400]) for (const r of [0.5, 0.7, 0.9, 0.99]) {
  for (const g of [2, 3, 4]) vec.pure.recall.push({ d, s, r, g, v: alg.next_recall_stability(d, s, r, g) });
  vec.pure.forget.push({ d, s, r, v: alg.next_forget_stability(d, s, r) });
}
for (const s of [0.1, 0.5, 1, 3, 4.1386, 10, 33.3, 100, 400, 5000]) for (const ret of [0.8, 0.85, 0.9, 0.95]) { const a = new lib.FSRSAlgorithm({ request_retention: ret }); vec.pure.interval.push({ s, ret, v: a.next_interval(s, 0, false), mod: a.interval_modifier }); }
// full review step from the Review state (elapsed days from last_review to now)
const base = new Date('2026-01-01T00:00:00Z');
for (const d of [2, 5.1443, 8]) for (const s of [1, 4.1386, 20]) for (const elapsed of [0, 1, 3, 10, 40]) {
  const last = new Date(base); const now = new Date(base.getTime() + elapsed * 86400000);
  const card = { due: now, stability: s, difficulty: d, elapsed_days: 0, scheduled_days: 5, reps: 4, lapses: 0, state: lib.State.Review, last_review: last };
  const rec = f.repeat(card, now);
  vec.review.push({ d, s, elapsed, out: Object.fromEntries([1, 2, 3, 4].map((g) => [g, { s: rec[g].card.stability, d: rec[g].card.difficulty, days: rec[g].card.scheduled_days, state: rec[g].card.state, lapses: rec[g].card.lapses }])) });
}
// new card
{
  const card = lib.createEmptyCard(base);
  const rec = f.repeat(card, base);
  vec.newCard = [1, 2, 3, 4].map((g) => ({ g, s: rec[g].card.stability, d: rec[g].card.difficulty, days: rec[g].card.scheduled_days, state: rec[g].card.state }));
}
// review sequences driven by the library with day granularity (grades: all Good, then a lapse)
vec.sequences = [];
for (const seq of [[3, 3, 3, 3, 3, 3], [3, 4, 4, 3, 2, 3], [3, 3, 1, 3, 3, 3], [4, 4, 4, 4], [2, 2, 3, 3, 3]]) {
  let card = lib.createEmptyCard(base); let now = new Date(base); const steps = [];
  for (const g of seq) {
    const rec = f.repeat(card, now);
    card = rec[g].card;
    steps.push({ g, s: card.stability, d: card.difficulty, state: card.state, days: card.scheduled_days, due: card.due.toISOString() });
    // next review happens on the due day (day granularity); for sub-day steps jump one day
    const days = Math.max(1, card.scheduled_days);
    now = new Date(now.getTime() + days * 86400000);
  }
  vec.sequences.push({ grades: seq, steps });
}
mkdirSync(join(root, 'tests/vectors'), { recursive: true });
writeFileSync(join(root, 'tests/vectors/fsrs45.json'), `${JSON.stringify(vec)}\n`);
console.log(`vectors: ts-fsrs ${pkg.version} (${lib.FSRSVersion}); pure ${Object.values(vec.pure).flat().length}, review ${vec.review.length}, sequences ${vec.sequences.length}`);
