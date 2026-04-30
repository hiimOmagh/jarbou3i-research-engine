import { test, expect } from '@playwright/test';

const STRICT_VISUAL = process.env.VISUAL_BASELINE_STRICT === '1';

async function stabilize(page) {
  await page.addStyleTag({ content: `*,*::before,*::after{transition:none!important;animation:none!important;scroll-behavior:auto!important}` });
  await page.evaluate(() => window.scrollTo(0, 0));
}

async function captureOrCompare(page, name) {
  await stabilize(page);
  if (STRICT_VISUAL) {
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true, animations: 'disabled' });
    return;
  }
  const buffer = await page.screenshot({ fullPage: true, animations: 'disabled' });
  await test.info().attach(`${name}.png`, { body: buffer, contentType: 'image/png' });
  expect(buffer.byteLength).toBeGreaterThan(20_000);
}

async function selectTab(page, tab) {
  await page.locator(`#researchModeNav .uxTab[data-ux-tab="${tab}"]`).click();
  await expect(page.locator(`#researchModeNav .uxTab[data-ux-tab="${tab}"]`)).toHaveAttribute('aria-selected', 'true');
}

test.describe('v1.0.4 visual regression capture', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('captures stable desktop workflow states', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 950 });
    for (const tab of ['analysis', 'evidence', 'sources', 'quality', 'advanced']) {
      await selectTab(page, tab);
      await captureOrCompare(page, `v104-desktop-${tab}`);
    }
  });

  test('captures stable mobile workflow states', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await selectTab(page, 'analysis');
    await captureOrCompare(page, 'v104-mobile-analysis');
    await selectTab(page, 'evidence');
    await captureOrCompare(page, 'v104-mobile-evidence');
  });
});
