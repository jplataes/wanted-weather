// End-to-end tests of the published app (production build, fake proxy with real saved data).
import { test, expect } from '@playwright/test';
import { mockApi } from './mock-api.js';

const ready = (page) => expect(page.locator('#cityName')).not.toBeEmpty({ timeout: 15000 });

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('without location it falls back to Madrid and shows the HUD', async ({ page }) => {
  await page.goto('./');
  await ready(page);
  await expect(page.locator('#cityName')).toHaveText('Madrid');
  await expect(page.locator('#country')).toHaveText('España');
  await expect(page.locator('#temp')).toHaveText(/^-?\d+°$/);
  await expect(page.locator('#wanted svg')).toHaveCount(5);
  await expect(page.locator('#toast')).toContainText('Madrid');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('#teaserTitle')).not.toBeEmpty();
});

test('the stars explain why', async ({ page }) => {
  await page.goto('./');
  await ready(page);
  await page.locator('#wantedBtn').click();
  await expect(page.locator('#wantedWhy')).toBeVisible();
  await expect(page.locator('#wantedWhy')).not.toBeEmpty();
});

test('searching a repeated name offers the other cities', async ({ page }) => {
  await page.goto('./');
  await ready(page);
  await page.locator('#city').fill('Santiago');
  await page.locator('#searchForm button[type=submit]').click();
  await expect(page.locator('#altCities')).toBeVisible();
  await page.locator('.alt-chip', { hasText: 'Chile' }).click();
  await expect(page.locator('#country')).toHaveText('Chile');
});

test('errors are shown in the game style', async ({ page }) => {
  await page.goto('./');
  await ready(page);
  await page.locator('#city').fill('Ciudadquenoexiste');
  await page.locator('#searchForm button[type=submit]').click();
  await expect(page.locator('.error-card')).toHaveAttribute('data-kind', 'notFound');
  await expect(page.locator('#cityName')).toHaveText('Madrid'); // the last good data stays
});

test('quota reached shows its own message', async ({ page }) => {
  await page.unroute('**/proxy.test/api/**');
  await mockApi(page, { status: { weather: 429 } });
  await page.goto('./');
  await expect(page.locator('.error-card')).toHaveAttribute('data-kind', 'limit', { timeout: 15000 });
});

test('zones: missions, arcade and fame', async ({ page }) => {
  await page.goto('./');
  await ready(page);
  await page.locator('[data-zone-link=misiones]').click();
  await expect(page.locator('#mission')).toBeVisible();
  await expect(page.locator('.up-card').first()).toBeVisible();
  await page.locator('[data-zone-link=recreativos]').click();
  await expect(page.locator('#excMachine')).toBeVisible();
  await page.locator('[data-zone-link=fama]').click();
  await expect(page.locator('#nickName')).not.toBeEmpty();
  await expect(page.locator('#ladder li')).toHaveCount(6);
  await expect(page.locator('#posterWhy')).toContainText('Madrid', { timeout: 15000 });
});

test('a city duel plays five rounds', async ({ page }) => {
  await page.goto('./#recreativos');
  await ready(page);
  await page.locator('#duelRival').fill('Reykjavik');
  await page.locator('#duelForm button[type=submit]').click();
  await expect(page.locator('#sbRounds li')).toHaveCount(5, { timeout: 10000 });
  await expect(page.locator('#sbVerdict')).not.toBeEmpty();
});

test('the excuse-o-matic gives an excuse made with today’s weather', async ({ page }) => {
  await page.goto('./#recreativos');
  await ready(page);
  await page.locator('#excPull').click();
  await expect(page.locator('#excText')).not.toBeEmpty({ timeout: 5000 });
  await expect(page.locator('#excWhy')).toContainText('Madrid');
});

test('English switch translates the interface', async ({ page }) => {
  await page.goto('./');
  await ready(page);
  await page.locator('[data-lang=en]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('[data-zone-link=calle]')).toContainText('Street');
});

test('no horizontal scroll and no console errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('./');
  await ready(page);
  const width = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(width).toBeLessThanOrEqual(0);
  expect(errors).toEqual([]);
});
