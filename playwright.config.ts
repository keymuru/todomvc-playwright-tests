import { defineConfig, devices } from '@playwright/test';

/**
 * Central Playwright configuration for the TodoMVC end-to-end test suite.
 * See https://playwright.dev/docs/test-configuration for the full reference.
 */
export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',

  // Fail the build on CI if someone accidentally leaves `test.only` in the source.
  forbidOnly: !!process.env.CI,

  // Spec files are written to be independent, so they are safe to run fully in parallel.
  fullyParallel: true,

  // Retry flaky runs on CI only; keep local runs fast and deterministic.
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ...(process.env.CI ? [['github'] as const] : []),
  ],

  use: {
    // Trailing slash matters: relative navigations (`page.goto('./')`) are
    // resolved against this URL, and a leading "/" in goto() would otherwise
    // strip the "/todomvc" path and hit the origin root.
    baseURL: process.env.BASE_URL ?? 'https://demo.playwright.dev/todomvc/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
