import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const EXPECTED_VERSION = '1.3.0-bio';

async function readFixture(name) {
  const raw = await fs.readFile(path.join(process.cwd(), 'fixtures', name), 'utf8');
  return JSON.parse(raw);
}

async function importFixture(page, fixtureName, wrongInitialLens) {
  const data = await readFixture(fixtureName);

  await page.goto('/');
  await expect(page.locator('#copyPromptBtn')).toBeVisible();
  await page.locator('#langEn').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  // Prove import, not the previous UI toggle state, controls the final lens.
  await page.locator(`[data-lens="${wrongInitialLens}"]`).click();
  await expect(page.locator(`[data-lens="${wrongInitialLens}"]`)).toHaveAttribute('aria-pressed', 'true');

  await page.locator('#jsonInput').fill(JSON.stringify(data, null, 2));
  await expect(page.locator('#importBtn')).toBeEnabled();
  await page.locator('#importBtn').click();

  return data;
}

async function exportCurrentReport(page, testInfo, label) {
  await page.locator('[data-review="exports"]').click();
  await expect(page.locator('#exportHtml')).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#exportHtml').click();
  const download = await downloadPromise;
  const filePath = testInfo.outputPath(`${label}-import-export.html`);
  await download.saveAs(filePath);
  await testInfo.attach(`${label}-import-export.html`, { path: filePath, contentType: 'text/html' });
  return fs.readFile(filePath, 'utf8');
}

test.describe('Imported analysis lens contract', () => {
  test('strategic JSON import overrides a biopolitical UI state', async ({ page }, testInfo) => {
    await importFixture(page, 'sample-analysis-en.json', 'biopolitical');

    await expect(page.locator('[data-lens="strategic"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-lens="biopolitical"]')).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('h1')).toContainText('Strategic');
    await expect(page.locator('#reviewTitle')).toContainText('Strategic');
    await expect(page.locator('#reviewContent')).toContainText('World War II');

    const html = await exportCurrentReport(page, testInfo, 'strategic');
    expect(html).toContain(`name="app-version" content="${EXPECTED_VERSION}"`);
    expect(html).toContain('name="analysis-lens" content="strategic"');
    expect(html).toContain('data-analysis-lens="strategic"');
    expect(html).toContain('data-export-contract-lens="strategic"');
    expect(html).toContain('Strategic Analysis Report');
    expect(html).toContain('Interests → Actors → Tools → Narrative → Results → Feedback');
    expect(html).not.toContain('Biopolitical Analysis Report');
  });

  test('biopolitical JSON import overrides a strategic UI state', async ({ page }, testInfo) => {
    await importFixture(page, 'sample-analysis-bio-en.json', 'strategic');

    await expect(page.locator('[data-lens="biopolitical"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-lens="strategic"]')).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('h1')).toContainText('Biopolitical');
    await expect(page.locator('#reviewTitle')).toContainText('Biopolitical');
    await expect(page.locator('#reviewContent')).toContainText('health passport');

    const html = await exportCurrentReport(page, testInfo, 'biopolitical');
    expect(html).toContain(`name="app-version" content="${EXPECTED_VERSION}"`);
    expect(html).toContain('name="analysis-lens" content="biopolitical"');
    expect(html).toContain('data-analysis-lens="biopolitical"');
    expect(html).toContain('data-export-contract-lens="biopolitical"');
    expect(html).toContain('Biopolitical Analysis Report');
    expect(html).toContain('Problematization → Populations / Subjects → Governance Techniques');
    expect(html).not.toContain('Strategic Analysis Report');
  });
});
