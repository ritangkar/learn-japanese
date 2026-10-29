import { test } from '@playwright/test';
import { skipTour } from './helpers.js';
test('shots', async ({ page }) => {
  await page.goto('./'); await page.waitForFunction(() => !!window.__tabi);
  await skipTour(page);
  await page.waitForSelector('.map-svg'); await page.screenshot({ path: '/tmp/claude-0/shots/10-home.png', fullPage: true });
  await page.locator('[data-dest="tokyo"]').click(); await page.screenshot({ path: '/tmp/claude-0/shots/11-sheet.png' });
  await page.goto('./#/dest/tokyo'); await page.waitForSelector('.scene'); await page.screenshot({ path: '/tmp/claude-0/shots/12-dest.png', fullPage: true });
  await page.goto('./#/jlpt'); await page.waitForSelector('.level-card'); await page.screenshot({ path: '/tmp/claude-0/shots/13-jlpt.png', fullPage: true });
  await page.goto('./#/tokyo'); await page.waitForSelector('.tokyo-map'); await page.screenshot({ path: '/tmp/claude-0/shots/14-tokyo.png', fullPage: true });
});
