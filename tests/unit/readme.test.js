// AC25 (README states the exact number of released mocks per level against the target of 20) and honesty statements.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { loadContent } from '../../scripts/lib/load-content.mjs';

describe('README mock counters (AC25)', () => {
  const readme = readFileSync('README.md', 'utf8');
  const raw = loadContent();
  for (const level of ['N5', 'N4', 'N3', 'N2', 'N1']) {
    it(`${level}: README row equals the number of released mocks`, () => {
      const released = raw.mocks.filter((m) => m.level === level && ['auto_checked', 'human_reviewed'].includes(raw.status[m.id]?.status)).length;
      expect(readme).toMatch(new RegExp(`\\| ${level} \\| ${released} of 20 released \\| 20 \\|`));
    });
  }
  it('states that the 20-per-level goal is not met and that no JLPT score is given', () => {
    expect(readme).toMatch(/not met in this release/i);
    expect(readme).toMatch(/not JLPT scores/i);
    expect(readme).toMatch(/Original practice exam\. Not an official JLPT paper\./);
    expect(readme).not.toMatch(/\/\s?180|CEFR/);
  });
});
