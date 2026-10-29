import { test, expect } from '@playwright/test';
import { waitReady, skipTour } from './helpers.js';

test.describe('Journey D: close and reopen -> progress and settings persist', () => {
  test('settings changes survive a reload and a new page in the same profile', async ({ page, context }) => {
    await page.goto('./'); await waitReady(page); await skipTour(page);
    await page.goto('./#/settings');
    await page.locator('#s-min').selectOption('45'); await page.locator('#s-rom').selectOption('never'); await page.locator('#s-theme').selectOption('dark'); await page.locator('#s-motion').selectOption('on'); await page.locator('#s-text').selectOption('1.25');
    await page.evaluate(() => window.__tabi.store.flush());
    await page.reload(); await waitReady(page);
    const s = await page.evaluate(() => window.__tabi.store.state.settings);
    expect(s).toMatchObject({ dailyCoreMinutes: 45, romajiMode: 'never', theme: 'dark', reducedMotion: 'on', textScale: 1.25 });
    expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe('dark');
    expect(await page.evaluate(() => document.documentElement.getAttribute('data-motion'))).toBe('reduce');
    const p2 = await context.newPage(); await p2.goto('./'); await waitReady(p2);
    expect(await p2.evaluate(() => window.__tabi.store.state.settings.dailyCoreMinutes)).toBe(45);
  });
  test('romaji mode never hides romaji hints in a lesson; always shows them', async ({ page }) => {
    await page.goto('./'); await waitReady(page); await skipTour(page);
    await page.evaluate(() => window.__tabi.store.update('settings', (s) => ({ ...s, romajiMode: 'never' })));
    await page.goto('./#/lesson/n5_u01_l1'); await expect(page.locator('.kana-cell small')).toHaveCount(0);
    await page.evaluate(() => window.__tabi.store.update('settings', (s) => ({ ...s, romajiMode: 'always' })));
    await page.goto('./#/kana'); await page.goto('./#/lesson/n5_u01_l1'); await expect(page.locator('.kana-cell small').first()).toBeVisible();
  });
});

test.describe('Journey H: invalid or corrupted import -> graceful errors, valid data untouched', () => {
  const cases = [['not JSON', '{ nope', /not valid JSON/], ['wrong marker', JSON.stringify({ format: 'x', formatVersion: 1, data: {} }), /not a backup file from this app/], ['newer version', JSON.stringify({ format: 'jla-backup', formatVersion: 9, data: {} }), /newer version/], ['empty file', '', /not valid JSON/]];
  for (const [name, content, msg] of cases) {
    test(`${name}`, async ({ page }) => {
      await page.goto('./'); await waitReady(page); await skipTour(page);
      await page.evaluate(() => { window.__tabi.store.update('progress', (p) => ({ ...p, lessons: { keep_me: { doneAt: 1, score: 1, count: 1 } } })); window.__tabi.store.flush(); });
      await page.goto('./#/backup');
      await page.locator('#import-file').setInputFiles({ name: 'x.json', mimeType: 'application/json', buffer: Buffer.from(content) });
      await expect(page.locator('#backup-status')).toContainText(msg);
      await expect(page.locator('#do-restore')).toHaveCount(0);
      expect(await page.evaluate(() => Object.keys(window.__tabi.store.state.progress.lessons))).toEqual(['keep_me']);
    });
  }
  test('a tampered but well-formed backup is refused by its checksum', async ({ page }) => {
    await page.goto('./'); await waitReady(page); await skipTour(page); await page.goto('./#/backup');
    const [dl] = await Promise.all([page.waitForEvent('download'), page.locator('#do-export').click()]);
    const doc = JSON.parse((await import('node:fs')).readFileSync(await dl.path(), 'utf8')); doc.data.journal.xp.total = 424242;
    await page.locator('#import-file').setInputFiles({ name: 'b.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(doc)) });
    await expect(page.locator('#backup-status')).toContainText('checksum does not match');
  });
});

test.describe('Journey G: mobile and desktop layouts', () => {
  for (const [w, h] of [[360, 640], [390, 844], [1280, 800]]) {
    test(`${w}x${h}: tabs navigate, nothing overflows horizontally, Start today is visible without scrolling`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await page.goto('./'); await waitReady(page); await skipTour(page);
      const cta = page.locator('#start-today'); await expect(cta).toBeInViewport();
      for (const [tab, heading] of [['Learn', "Today's itinerary"], ['JLPT', 'JLPT area'], ['Journal', 'Stamp book'], ['Explore', 'Explore Japan'], ['Home', null]]) {
        await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: tab }).click();
        if (heading) await expect(page.getByRole('heading', { name: heading, exact: true }).first()).toBeVisible();
        const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); expect(over, tab).toBeLessThanOrEqual(1);
      }
      for (const h2 of ['#/kana', '#/library', '#/settings', '#/backup', '#/content', '#/jlpt/N5', '#/lesson/n5_u01_l1', '#/journal', '#/about', '#/credits']) { await page.goto(`./${h2}`); await page.waitForSelector('main > *'); expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), h2).toBeLessThanOrEqual(1); }
    });
  }
});

test.describe('storage health and honesty screens', () => {
  test('filling storage shows a warning and an export prompt; nothing is discarded', async ({ page }) => {
    await page.goto('./'); await waitReady(page); await skipTour(page);
    await page.evaluate(() => { localStorage.setItem('jla:v1:filler', 'x'.repeat(1_300_000)); });
    await page.goto('./#/storage');
    await expect(page.locator('.chip', { hasText: /Getting full|Nearly full/ })).toBeVisible();
    await page.goto('./#/'); await expect(page.locator('#banners')).toContainText(/Storage is (getting|nearly) full/);
    expect(await page.evaluate(() => window.__tabi.store.state.progress.currentDestination)).toBe('tokyo');
  });
  test('AC28: content status screen shows badges and counts computed from the shipped bundles; 0 % human reviewed', async ({ page, request }) => {
    await page.goto('./'); await waitReady(page); await skipTour(page);
    const n5 = await (await request.get('content/N5.json')).json();
    await page.goto('./#/content');
    await expect(page.locator('main')).toContainText('0 %');
    await expect(page.locator('main')).toContainText('Auto-checked');
    const row = page.locator('tbody tr', { hasText: /^N5/ });
    await expect(row).toContainText(`${n5.vocab.length} / 600`);
    const idx = await (await request.get('content/index.json')).json();
    await expect(row).toContainText(`${idx.mocks.filter((m) => m.level === 'N5').length} of 20`);
    await expect(page.locator('main')).toContainText('Readings are not dictionary-verified');
    expect(n5.vocab.every((v) => v.content_status === 'auto_checked')).toBe(true);
    expect([...n5.vocab, ...n5.sentences, ...n5.questions].some((x) => x.content_status === 'human_reviewed')).toBe(false);
  });
  test('about screen lists L-01..L-10 and the credits page lists no third-party assets', async ({ page }) => {
    await page.goto('./'); await waitReady(page); await skipTour(page);
    await page.goto('./#/about'); for (let i = 1; i <= 10; i++) await expect(page.locator('#limitations')).toContainText(`L-${String(i).padStart(2, '0')}`);
    await page.goto('./#/credits'); await expect(page.locator('main')).toContainText('Shippori Mincho'); await expect(page.locator('main')).toContainText('SIL Open Font License'); await expect(page.locator('main')).toContainText('Nothing is loaded from third-party servers');
    await expect(page.locator('main')).toContainText('not derived from KanjiVG');
  });
  test('library: kanji are listed from released units only; stroke order is not claimed; unknown ids are stated honestly', async ({ page }) => {
    await page.goto('./'); await waitReady(page); await skipTour(page);
    await page.goto('./#/library?tab=kanji');
    const n = await page.evaluate(async () => (await window.__tabi.ctx.getContent()).kanji.length);
    expect(n).toBeGreaterThan(0);
    await expect(page.locator('main a.card')).toHaveCount(n);
    await page.goto('./#/kanji/k_san'); await expect(page.locator('#stroke-na')).toContainText('Stroke order is not available yet');
    await expect(page.locator('main')).not.toContainText(/KanjiVG/i);
    await page.goto('./#/kanji/none'); await expect(page.locator('main')).toContainText('not available yet');
  });
});
