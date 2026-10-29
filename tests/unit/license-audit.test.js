// AC27 (disallowed or missing manifest entries fail the build), AC36 (no paid service), AC39 (manifest lists every asset).
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

const run = (...args) => spawnSync('node', ['scripts/license-audit.mjs', ...args], { cwd: process.cwd(), encoding: 'utf8' });

describe('licence audit (AC27, AC39)', () => {
  it('passes for the shipped manifest', () => {
    const r = run();
    expect(r.status, r.stderr).toBe(0);
  });
  it('fails for a manifest with a disallowed licence, a missing creator and missing fields', () => {
    const r = run('--manifest', 'tests/fixtures/bad-asset-manifest.json');
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/licence that is not allowed: CC-BY-NC-4\.0/);
    expect(r.stderr).toMatch(/lacks creator/);
    expect(r.stderr).toMatch(/lacks license/);
  });
  it('fails when a media file ships without a manifest entry', () => {
    const r = run('--dist', 'tests/fixtures/unlisted-media-dist');
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/media file with no manifest entry/);
  });
  it('the fixture manifest is not part of the shipped content', () => {
    expect(JSON.parse(readFileSync('content/assets.manifest.json', 'utf8'))).toEqual([]);
  });
});

describe('no paid service or secret in the repository (AC36)', () => {
  it('the deploy workflow uses only GitHub-owned actions and has no secrets', () => {
    expect(existsSync('.github/workflows/pages.yml')).toBe(true);
    const y = readFileSync('.github/workflows/pages.yml', 'utf8');
    const uses = [...y.matchAll(/uses:\s*([^\s@]+)/g)].map((m) => m[1]);
    for (const u of uses) expect(u.startsWith('actions/')).toBe(true);
    expect(y).not.toMatch(/secrets\./);
  });
  it('package.json has no runtime dependencies and no paid-service SDKs', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    expect(pkg.dependencies || {}).toEqual({});
    const all = Object.keys({ ...pkg.devDependencies });
    for (const bad of ['openai', '@anthropic-ai/sdk', 'firebase', 'supabase', '@supabase/supabase-js', 'stripe', 'algoliasearch', 'workbox-build']) expect(all).not.toContain(bad);
  });
});
