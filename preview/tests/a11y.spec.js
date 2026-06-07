import { test, expect } from '@playwright/test';

test('runtime accessibility smoke', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('html')).toHaveAttribute('lang', /^(ar|en|fr)$/);
  await expect(page.locator('#toast')).toHaveAttribute('role', 'status');
  await expect(page.locator('#modalBackdrop')).toHaveAttribute('aria-hidden', 'true');

  await page.keyboard.press('Tab');
  const activeTag = await page.evaluate(() => document.activeElement?.tagName.toLowerCase());
  expect(['button', 'input', 'select', 'textarea', 'a']).toContain(activeTag);

  await page.locator('#loadSampleBtn').click();
  await expect(page.locator('[role="tablist"]')).toBeVisible();
  const selectedTabs = await page.locator('[role="tab"][aria-selected="true"]').count();
  expect(selectedTabs).toBe(1);
});
