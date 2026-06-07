import { test, expect } from '@playwright/test';

test.describe('RTL and mobile layout smoke', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('Arabic mobile flow remains readable and does not overflow horizontally', async ({ page }) => {
    await page.goto('/');
    await page.locator('#langAr').click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('.welcomeMascot')).toBeVisible();
    await page.locator('#loadSampleBtn').click();
    await expect(page.locator('#reviewContent')).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);

    await page.locator('[data-review="evidence"]').click();
    await expect(page.locator('#reviewContent')).toBeVisible();
    await expect(page.locator('#reviewContent')).toContainText(/الأدلة|Evidence|Preuves/);
  });
});
