#!/usr/bin/env node
// Production build orchestrator: content build -> validators -> vite -> precache manifest/sw -> checks. Stops on first failure.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const steps = [
  ['spec validator', 'node', ['scripts/validate-spec.mjs']],
  ...(existsSync(join(root, 'scripts/validate-content.mjs')) ? [['content validators', 'node', ['scripts/validate-content.mjs']], ['content bundles', 'node', ['scripts/build-content.mjs']]] : []),
  ['vite build', 'npx', ['vite', 'build']],
  ['precache manifest + service worker', 'node', ['scripts/build-precache.mjs']],
  ...(existsSync(join(root, 'scripts/check-fixtures-not-shipped.mjs')) ? [['fixtures not shipped', 'node', ['scripts/check-fixtures-not-shipped.mjs']]] : []),
  ...(existsSync(join(root, 'scripts/license-audit.mjs')) ? [['license audit', 'node', ['scripts/license-audit.mjs']]] : []),
  ...(existsSync(join(root, 'scripts/check-sizes.mjs')) ? [['size budgets', 'node', ['scripts/check-sizes.mjs']]] : []),
];
for (const [name, cmd, args] of steps) {
  console.log(`\n=== ${name} ===`);
  const r = spawnSync(cmd, args, { cwd: root, stdio: 'inherit' });
  if (r.status !== 0) { console.error(`\nBUILD FAILED at step: ${name}`); process.exit(r.status || 1); }
}
console.log('\nBUILD OK');
