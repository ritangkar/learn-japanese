#!/usr/bin/env node
// Fails if test fixtures leak into the shipped build or the shipped source imports from tests/.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];
function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const n of readdirSync(dir)) { const p = join(dir, n); statSync(p).isDirectory() ? walk(p, out) : out.push(p); }
  return out;
}
for (const f of walk(join(root, 'dist'))) {
  if (/\.(js|json|html|css|webmanifest)$/.test(f)) {
    const t = readFileSync(f, 'utf8');
    if (t.includes('FIXTURE — not shipped') || t.includes('FIXTURE - not shipped')) problems.push(`${relative(root, f)} contains a fixture marker`);
    if (/tests\/(fixtures|vectors)/.test(t)) problems.push(`${relative(root, f)} references tests/fixtures or tests/vectors`);
  }
}
for (const f of walk(join(root, 'src')).filter((p) => p.endsWith('.js'))) {
  if (/from\s+['"][^'"]*tests\//.test(readFileSync(f, 'utf8'))) problems.push(`${relative(root, f)} imports from tests/`);
}
// bundles and status must not count fixture content
for (const f of walk(join(root, 'dist/content')).filter((p) => p.endsWith('.json'))) {
  if (/"id":"[^"]*(fixture|bad_)/i.test(readFileSync(f, 'utf8'))) problems.push(`${relative(root, f)} contains fixture-looking ids`);
}
if (problems.length) { console.error('FIXTURES SHIPPED:'); for (const p of problems) console.error(` - ${p}`); process.exit(1); }
console.log('fixtures not shipped: OK');
