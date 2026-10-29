#!/usr/bin/env node
// Size budgets: core precache <= 8 MB, map source+data <= 120 KB, single JS file warning above 400 KB.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];
const KB = 1024;

const pre = JSON.parse(readFileSync(join(root, 'dist/precache-manifest.json'), 'utf8'));
const coreBytes = pre.coreBytes;
if (coreBytes > 8 * KB * KB) problems.push(`core precache is ${(coreBytes / KB / KB).toFixed(2)} MB, budget 8 MB`);

const mapDir = join(root, 'src/map');
const mapBytes = readdirSync(mapDir).reduce((n, f) => n + statSync(join(mapDir, f)).size, 0);
if (mapBytes > 120 * KB) problems.push(`map source and data is ${(mapBytes / KB).toFixed(1)} KB, budget 120 KB`);

const assets = join(root, 'dist/assets');
for (const f of readdirSync(assets)) {
  const s = statSync(join(assets, f)).size;
  if (f.endsWith('.js') && s > 400 * KB) problems.push(`${f} is ${(s / KB).toFixed(0)} KB (budget 400 KB per script)`);
}

console.log(`sizes: core precache ${(coreBytes / KB).toFixed(1)} KB (budget 8192 KB), map ${(mapBytes / KB).toFixed(1)} KB (budget 120 KB)`);
if (problems.length) { console.error('SIZE BUDGETS FAILED:'); for (const p of problems) console.error(` - ${p}`); process.exit(1); }
console.log('size budgets OK');
