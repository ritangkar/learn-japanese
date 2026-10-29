#!/usr/bin/env node
// Promotes draft items to auto_checked ONLY if they pass every automated check. Never writes human_reviewed.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { validate } from './validate-content.mjs';
import { ROOT } from './lib/load-content.mjs';
import { COLLECTIONS, statusOf } from '../src/content/model.js';

const date = process.env.PROMOTE_DATE || new Date().toISOString().slice(0, 10);
const { results, raw } = validate({ quiet: true, write: false });
// X09 (status consistency) is a function of the statuses this script is about to write, so it cannot block promotion; it is re-checked by validate-content afterwards.
const relevant = results.filter((r) => r.id !== 'X09');
const bad = new Set(relevant.flatMap((r) => r.errors.map((e) => e.item)));
const hardFail = relevant.filter((r) => r.status === 'fail');
const authoredUnits = new Set(raw.curriculum.units.filter((u) => (u.lessons || []).length).map((u) => u.id));
let promoted = 0; let kept = 0;
const status = { ...raw.status };
for (const c of COLLECTIONS) for (const it of raw[c]) {
  if (bad.has(it.id) || (it.unit_id && !authoredUnits.has(it.unit_id))) { kept++; continue; }
  const cur = statusOf(raw, it.id);
  if (cur === 'draft') { status[it.id] = { status: 'auto_checked', checked_on: date }; promoted++; }
}
// unit status: derived from the items of the unit
const units = raw.curriculum.units.map((u) => {
  if (u.content_status === 'human_reviewed') return u;
  const own = COLLECTIONS.flatMap((c) => raw[c].filter((x) => x.unit_id === u.id));
  if (!own.length || !(u.lessons || []).length) return { ...u, content_status: 'to_be_authored' };
  const all = own.every((x) => (status[x.id]?.status || 'draft') !== 'draft');
  const unitBad = own.some((x) => bad.has(x.id)) || bad.has(u.id);
  return { ...u, content_status: all && !unitBad ? 'auto_checked' : 'draft' };
});
const sorted = Object.fromEntries(Object.entries(status).sort(([a], [b]) => (a < b ? -1 : 1)));
writeFileSync(join(ROOT, 'content/status.json'), `${JSON.stringify(sorted, null, 0).replace(/\},"/g, '},\n"').replace(/^\{/, '{\n').replace(/\}$/, '\n}')}\n`);
writeFileSync(join(ROOT, 'content/curriculum.json'), `${JSON.stringify({ units, unlock_next: raw.curriculum.unlock_next }, null, 1)}\n`);
console.log(`promote: ${promoted} item(s) -> auto_checked on ${date}; ${kept} kept draft (failing checks); failing checks: ${hardFail.map((r) => r.id).join(', ') || 'none'}`);
console.log(`units: ${units.filter((u) => u.content_status === 'auto_checked').length} auto_checked, ${units.filter((u) => u.content_status === 'draft').length} draft, ${units.filter((u) => u.content_status === 'to_be_authored').length} to_be_authored`);
process.exit(hardFail.length ? 1 : 0);
