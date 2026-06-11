import { test, expect } from '@playwright/test';

test('Jarbou3i Model core flow', async ({ page }) => {
  test.setTimeout(60_000);

  await page.goto('/');
  await expect(page.locator('#copyPromptBtn')).toBeVisible();

  await expect(page.locator('.logo img')).toHaveAttribute('src', /jarbou3i-mascot-192\.png$/);
  await expect(page.locator('.welcomeMascot')).toHaveAttribute('src', /jarbou3i-mascot-512\.png$/);
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', 'manifest.webmanifest');

  await page.locator('#langFr').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.locator('#copyPromptBtn')).toContainText('Copier le prompt');

  await page.locator('#langAr').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

  await page.locator('#langEn').click();
  const strategicLens = page.locator('[data-lens="strategic"]');
  const biopoliticalLens = page.locator('[data-lens="biopolitical"]');
  await expect(strategicLens).toHaveAttribute('aria-pressed', 'true');
  await expect(strategicLens).toHaveClass(/active/);
  await expect(biopoliticalLens).toHaveAttribute('aria-pressed', 'false');
  await expect(async () => {
    const activeBackground = await strategicLens.evaluate((node) => getComputedStyle(node).backgroundImage);
    expect(activeBackground).toContain('linear-gradient');
  }).toPass();
  await biopoliticalLens.click();
  await expect(biopoliticalLens).toHaveAttribute('aria-pressed', 'true');
  await expect(biopoliticalLens).toHaveClass(/active/);
  await expect(strategicLens).toHaveAttribute('aria-pressed', 'false');
  await expect(async () => {
    const activeBackground = await biopoliticalLens.evaluate((node) => getComputedStyle(node).backgroundImage);
    expect(activeBackground).toContain('linear-gradient');
  }).toPass();
  await page.locator('#themeBtn').click();
  await expect(page.locator('body')).toHaveClass(/dark/);
  await expect(page.locator('#themeBtn')).toHaveAttribute('aria-pressed', 'true');

  await expect(page.locator('#analysisLens')).toBeVisible();
  await strategicLens.click();
  await expect(strategicLens).toHaveAttribute('aria-pressed', 'true');
  await expect(strategicLens).toHaveClass(/active/);
  await expect(biopoliticalLens).toHaveAttribute('aria-pressed', 'false');
  await biopoliticalLens.click();
  await expect(biopoliticalLens).toHaveAttribute('aria-pressed', 'true');
  await expect(biopoliticalLens).toHaveClass(/active/);
  await expect(page.locator('h1')).toContainText('Biopolitical');
  await page.locator('#topicInput').fill('Digital health passports, 2020-2022');
  await page.locator('#previewPromptBtn').click();
  await expect(page.locator('#modalBackdrop')).toHaveClass(/show/);
  await page.keyboard.press('Escape');

  await page.locator('#loadSampleBtn').click();
  await expect(page.locator('#reviewPanel')).toBeVisible();
  await expect(page.locator('#reviewContent')).toContainText('health passport');
  await expect(page.locator('[aria-current="step"]')).toContainText('Review');

  for (const tab of ['overview', 'systems', 'pillars', 'contradictions', 'scenarios', 'evidence', 'exports']) {
    const tabButton = page.locator(`[data-review="${tab}"]`);
    await tabButton.scrollIntoViewIfNeeded();
    await expect(tabButton).toBeVisible();
    await tabButton.click();
    await expect(tabButton).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#reviewContent')).toBeVisible();
  }

  const exportTab = page.locator('[data-review="exports"]');
  await exportTab.scrollIntoViewIfNeeded();
  await expect(exportTab).toBeVisible();
  await exportTab.click();
  await expect(exportTab).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#exportHtml')).toBeVisible();
  await expect(page.locator('#exportJson')).toHaveCount(0);
  await expect(page.locator('#exportMd')).toHaveCount(0);
  await expect(page.locator('#printBtn')).toHaveCount(0);
  await expect(page.locator('#selfCheckBtn')).toHaveCount(0);

  const hasLegacySelfCheck = await page.evaluate(() => 'StrategicWorkbenchSelfCheck' in window);
  expect(hasLegacySelfCheck).toBe(false);
});
