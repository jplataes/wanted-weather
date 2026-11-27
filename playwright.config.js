// Browser tests (npm run test:e2e). They run the real production build in Chromium,
// with the weather proxy replaced by saved real responses (tests/e2e/fixtures), so they
// don't need the network or an API key and never spend the free-tier quota.
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4174/',
    trace: 'off',
    permissions: [],
  },
  projects: [
    { name: 'phone', use: { ...devices['Pixel 7'] } },
    { name: 'desktop', use: { viewport: { width: 1280, height: 900 } } },
  ],
  webServer: {
    command: 'npm run build:e2e && npx vite preview --outDir dist-e2e --port 4174 --strictPort',
    url: 'http://localhost:4174/',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
