import { defineConfig, devices } from '@playwright/test';

// Served under /<REPO_NAME>/ exactly like a GitHub Pages project site.
const REPO = process.env.REPO_NAME || 'learn-japanese';
const PORT = Number(process.env.PORT || 4173);

const projects = [
  { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
  { name: 'chromium-360x640', use: { ...devices['Pixel 5'], viewport: { width: 360, height: 640 } } },
  { name: 'chromium-390x844', use: { ...devices['Pixel 5'], viewport: { width: 390, height: 844 } } },
];
// WebKit/Firefox projects are only added when their browsers are installed (not available in the sandbox used for development).
if (process.env.ALL_BROWSERS) {
  projects.push({ name: 'webkit', use: { ...devices['Desktop Safari'] } }, { name: 'firefox', use: { ...devices['Desktop Firefox'] } });
}

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0, // CI runners are slower; one retry absorbs a timing flake and the report still lists it as flaky
  reporter: [['list'], ['json', { outputFile: 'test-results/e2e.json' }]],
  use: { baseURL: `http://localhost:${PORT}/${REPO}/`, serviceWorkers: 'allow', trace: 'off', reducedMotion: 'reduce' },
  projects,
  webServer: { command: `node scripts/serve-subpath.mjs`, url: `http://localhost:${PORT}/${REPO}/`, reuseExistingServer: true, env: { REPO_NAME: REPO, PORT: String(PORT) } },
});
