// Vitest global setup: build the content bundles once so engine tests can run against real data.
import { spawnSync } from 'node:child_process';
export default function setup() {
  const r = spawnSync('node', ['scripts/build-content.mjs'], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error('content build failed');
}
