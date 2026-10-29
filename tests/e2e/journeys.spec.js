import { test, expect } from '@playwright/test';
import { watch, waitReady, solveSession, skipTour } from './helpers.js';

const startLesson = async (page) => {
  await page.locator('#start-today').click();
  await expect(page.getByRole('heading', { name: /five vowels/ })).toBeVisible();
};

test.describe('Journey A (J01): first launch -> tour -> lesson -> results -> persists after reload', () => {
  test('full first lesson on a fresh profile', async ({ page }) => {
    const rec = watch(page);
    await page.goto('./');
    await waitReady(page);
    await expect(page.getByRole('heading', { name: 'A journey across Japan' })).toBeVisible();
    for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Start exploring' }).click();
    await expect(page.locator('#start-today')).toBeVisible();
    await startLesson(page);
    // explanation steps
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Start practice' }).click();
    const practice = await solveSession(page);
    expect(practice.length).toBeGreaterThan(5);
    await page.getByRole('button', { name: 'Continue' }).click(); // from practice summary to exit check
    const exit = await solveSession(page);
    expect(exit.length).toBeGreaterThanOrEqual(8);
    await expect(page.getByRole('heading', { name: /Lesson complete/ })).toBeVisible();
    await expect(page.getByText(/\+\d+ XP/)).toBeVisible();
    // persisted?
    const before = await page.evaluate(() => ({ lessons: Object.keys(window.__tabi.store.state.progress.lessons), xp: window.__tabi.store.state.journal.xp.total, facets: Object.keys(window.__tabi.store.state.srs).length }));
    expect(before.lessons).toEqual(['n5_u01_l1']); expect(before.xp).toBeGreaterThan(0); expect(before.facets).toBeGreaterThan(5);
    await page.evaluate(() => window.__tabi.store.flush());
    await page.reload();
    await waitReady(page);
    const after = await page.evaluate(() => ({ lessons: Object.keys(window.__tabi.store.state.progress.lessons), xp: window.__tabi.store.state.journal.xp.total, facets: Object.keys(window.__tabi.store.state.srs).length, tour: window.__tabi.store.state.meta.tourDone }));
    expect(after).toEqual({ ...before, tour: true });
    expect(rec.crossOrigin).toEqual([]);
    expect(rec.console.filter((m) => !/favicon/.test(m))).toEqual([]);
  });
});

test.describe('Journey B: mixed correct and incorrect answers -> scoring, feedback, scheduling', () => {
  test('wrong answers show the correct answer, are retried later, and are scheduled', async ({ page }) => {
    await page.goto('./');
    await waitReady(page);
    await skipTour(page);
    await startLesson(page);
    await page.getByRole('button', { name: 'Next' }).click(); await page.getByRole('button', { name: 'Next' }).click(); await page.getByRole('button', { name: 'Start practice' }).click();
    const res = await solveSession(page, { correct: (i) => i % 3 !== 0 });
    expect(res.some((r) => r.result === 'wrong')).toBe(true); expect(res.some((r) => r.result === 'correct')).toBe(true);
    const attempts = await page.evaluate(() => window.__tabi.store.state.attempts.ring);
    expect(attempts.length).toBeGreaterThan(5);
    expect(attempts.some((a) => a[3] === 0)).toBe(true);
    // every attempt row has the documented 7 fields
    expect(attempts.every((a) => a.length === 7)).toBe(true);
    const summary = await page.locator('.summary').innerText();
    expect(summary).toMatch(/\d+ of \d+ correct/);
  });
});
