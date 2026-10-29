import { chromium } from 'playwright';
const out = process.argv[2]; const tag = process.argv[3]; const routes = process.argv[4].split(',');
const sizes = process.argv[5] === 'm' ? [['m', { width: 390, height: 844 }]] : process.argv[5] === 'd' ? [['d', { width: 1280, height: 800 }]] : [['m', { width: 390, height: 844 }], ['d', { width: 1280, height: 800 }]];
const b = await chromium.launch();
for (const [name, vp] of sizes) {
  const ctx = await b.newContext({ viewport: vp, serviceWorkers: 'block' }); const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('PAGEERR', e.message)); page.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
  await page.goto('http://localhost:4173/learn-japanese/'); await page.waitForTimeout(1500);
  const skip = page.getByRole('button', { name: /skip/i }); if (await skip.count()) await skip.first().click().catch(() => {});
  for (const r of routes) { await page.goto('http://localhost:4173/learn-japanese/#' + r); await page.waitForTimeout(900); await page.screenshot({ path: `${out}/${tag}-${name}-${r.replace(/\W+/g, '_')}.png`, fullPage: process.env.FULL === '1' }); }
  await ctx.close();
}
await b.close();
