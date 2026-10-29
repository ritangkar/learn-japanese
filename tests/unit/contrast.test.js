import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../../src/ui/styles.css', import.meta.url), 'utf8');

function blockVars(block) {
  const vars = {};
  for (const m of block.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)) vars[m[1]] = m[2];
  return vars;
}
// Light = :root first block; dark = [data-theme="dark"] block; OS-dark = media block (must equal data-theme dark).
const light = blockVars(css.slice(css.indexOf(':root {'), css.indexOf(':root[data-theme="dark"]')));
const darkStart = css.indexOf(':root[data-theme="dark"]');
const dark = { ...light, ...blockVars(css.slice(darkStart, css.indexOf('@media (prefers-color-scheme: dark)'))) };
const mediaStart = css.indexOf('@media (prefers-color-scheme: dark)');
const osDark = { ...light, ...blockVars(css.slice(mediaStart, css.indexOf('*, *::before', mediaStart))) };

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const TEXT_PAIRS = [
  ['ink', 'paper'], ['ink', 'surface'], ['ink', 'surface-2'], ['ink', 'mist'], ['ink-2', 'paper'], ['ink-2', 'surface'], ['ink-2', 'mist'], ['ink-2', 'surface-2'],
  ['indigo', 'paper'], ['indigo', 'surface'], ['indigo', 'mist'], ['on-indigo', 'indigo'], ['vermilion', 'paper'], ['vermilion', 'surface'], ['on-vermilion', 'vermilion'],
  ['matcha', 'paper'], ['matcha', 'surface'], ['gold', 'paper'], ['gold', 'surface'],
  ['ok-ink', 'ok-bg'], ['bad-ink', 'bad-bg'], ['warn-ink', 'warn-bg'], ['info-ink', 'info-bg'],
];
const UI_PAIRS = [['border', 'paper'], ['border', 'surface'], ['focus', 'paper'], ['focus', 'surface'], ['indigo', 'surface']];

describe('WCAG AA contrast per token pair (AC31/R022, task 9)', () => {
  for (const [name, set] of [['light', light], ['dark', dark], ['os-dark media block', osDark]]) {
    it(`${name}: all text pairs >= 4.5:1`, () => {
      const fails = TEXT_PAIRS.map(([f, b]) => [f, b, ratio(set[f], set[b])]).filter(([, , r]) => r < 4.5);
      expect(fails).toEqual([]);
    });
    it(`${name}: UI component pairs >= 3:1`, () => {
      const fails = UI_PAIRS.map(([f, b]) => [f, b, ratio(set[f], set[b])]).filter(([, , r]) => r < 3);
      expect(fails).toEqual([]);
    });
  }
  it('OS dark block defines the same tokens as the data-theme dark block', () => {
    for (const k of Object.keys(dark)) expect(osDark[k]).toBe(dark[k]);
  });
});

describe('contrast helper sanity', () => {
  it('parses tokens and computes known ratios', () => {
    expect(light.ink).toBe('#1F2A37');
    expect(dark.paper).toBe('#121A24');
    expect(ratio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
    expect(ratio('#777777', '#FFFFFF')).toBeLessThan(4.5); // known AA failure (4.48)
    expect(ratio(light.ink, light.paper)).toBeGreaterThan(10);
  });
});
