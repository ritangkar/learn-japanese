import { test, expect } from '@playwright/test';
import { watch, waitReady, skipTour, solveSession } from './helpers.js';

// Whole-app sanity: every route renders without console errors or broken text, and lessons can be played to the end.
// SANITY_ALL=1 plays every released lesson (slow); by default one lesson per released unit is played.
const STATIC = ['/', '/tokyo', '/journal', '/achievements', '/me', '/learn', '/summary', '/speak', '/jlpt', '/jlpt/N5', '/jlpt/N4', '/jlpt/N3', '/jlpt/N2', '/jlpt/N1', '/readiness', '/planner', '/kana', '/library', '/settings', '/audio', '/backup', '/storage', '/status', '/content', '/privacy', '/about', '/credits', '/tour', '/nonexistent'];
const BAD_TEXT = /\bundefined\b|\bNaN\b|\[object |\bnull\b/;

test('every route renders: no console errors, no broken placeholders in the text', async ({ page }) => {
  test.setTimeout(180000);
  const rec = watch(page);
  await page.goto('./'); await waitReady(page); await skipTour(page);
  const content = await page.evaluate(async () => { const c = await window.__tabi.ctx.getContent(); await c.ensureLevel('N4'); return { dests: c.destinations.map((d) => d.id), kanji: c.kanji.slice(0, 200).map((k) => k.id) }; });
  const routes = [...STATIC, ...content.dests.map((d) => `/dest/${d}`), ...content.kanji.filter((_, i) => i % 10 === 0).map((k) => `/kanji/${k}`)];
  const problems = [];
  for (const r of routes) {
    await page.goto(`./#${r}`); await page.waitForTimeout(150);
    const text = await page.locator('main').innerText().catch(() => '');
    if (!text.trim()) problems.push(`${r}: empty main`);
    const m = text.match(BAD_TEXT); if (m) problems.push(`${r}: contains "${m[0]}"`);
  }
  expect(problems).toEqual([]);
  expect(rec.console.filter((c) => !/favicon/.test(c))).toEqual([]);
  expect(rec.bad).toEqual([]);
});

test('released lessons can be played through to the summary', async ({ page }) => {
  const all = !!process.env.SANITY_ALL;
  test.setTimeout(all ? 3 * 3600 * 1000 : 900000);
  test.skip(test.info().project.name !== 'chromium-desktop', 'content sweep runs once, on desktop');
  const rec = watch(page);
  await page.goto('./'); await waitReady(page); await skipTour(page);
  const lessons = await page.evaluate(async () => {
    const c = await window.__tabi.ctx.getContent(); await c.ensureLevel('N4');
    return c.units.filter((u) => u.released).map((u) => ({ unit: u.id, lessons: u.lessons }));
  });
  const failures = [];
  for (const u of lessons) {
    for (const [i, id] of u.lessons.entries()) {
      if (!all && i !== 0 && i !== u.lessons.length - 1) continue;
      try {
        await page.goto(`./#/lesson/${id}`);
        for (let k = 0; k < 15 && !(await page.getByRole('button', { name: 'Start practice' }).count()); k++) {
          const next = page.getByRole('button', { name: 'Next', exact: true });
          if (!(await next.count())) break;
          await next.click();
        }
        const start = page.getByRole('button', { name: 'Start practice' });
        if (await start.count()) await start.click();
        await solveSession(page, { max: 80 });
        if (!(await page.locator('.summary').count())) failures.push(`${id}: no summary reached`);
      } catch (e) { failures.push(`${id}: ${String(e.message).split('\n')[0]}`); }
    }
  }
  expect(failures).toEqual([]);
  expect(rec.console.filter((c) => !/favicon/.test(c))).toEqual([]);
});
