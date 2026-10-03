import { test, expect } from '@playwright/test';

const base = process.env.JYC_BASE_URL || 'http://127.0.0.1:5173';
const routes = ['/', '/about', '/clubs', '/events', '/gallery', '/team', '/planner', '/map', '/my-jyc', '/contact', '/fests', '/guide'];

test('public app mounts with no runtime errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  page.on('console', message => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#root')).toBeAttached();
  await expect(page).toHaveTitle(/JYC|JIIT YOUTH CLUB/i);
  await expect(page.locator('#root')).not.toBeEmpty();
  expect(errors).toEqual([]);
});

for (const route of routes) {
  test(`route ${route} loads without a runtime error`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
    page.on('console', message => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
    await page.goto(base + route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#root')).toBeAttached();
    await expect(page.locator('#root')).not.toBeEmpty();
    await expect(page.locator('body')).toBeVisible();
    expect(errors, `runtime errors on ${route}`).toEqual([]);
  });
}


test('homepage accessibility and responsive guardrails', async ({ page }) => {
  await page.goto(base, { waitUntil: 'domcontentloaded' });

  const missingAlt = await page.locator('img:not([alt])').count();
  expect(missingAlt).toBe(0);

  const unnamedButtons = await page.locator('button').evaluateAll(buttons =>
    buttons.filter(button => {
      const text = (button.innerText || '').trim();
      const aria = button.getAttribute('aria-label') || button.getAttribute('aria-labelledby');
      return !text && !aria;
    }).length
  );
  expect(unnamedButtons).toBe(0);

  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
  );
  expect(overflow).toBe(false);
});

test('reduced-motion mode disables hero animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  const animationNames = await page.locator('.hero-logo-stage img').evaluateAll(nodes =>
    nodes.map(node => getComputedStyle(node).animationName)
  );
  expect(animationNames.every(name => name === 'none')).toBe(true);
});
