import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

const EXPECTED_VERSION = '1.3.0-bio-alpha.4.2';

const LOCALES = [
  { id: 'ar', button: '#langAr', dir: 'rtl' },
  { id: 'en', button: '#langEn', dir: 'ltr' },
  { id: 'fr', button: '#langFr', dir: 'ltr' }
];

const LENSES = [
  {
    id: 'strategic',
    title: 'Strategic Analysis Report',
    chain: 'Interests → Actors → Tools → Narrative → Results → Feedback',
    forbidden: 'Biopolitical Analysis Report'
  },
  {
    id: 'biopolitical',
    title: 'Biopolitical Analysis Report',
    chain: 'Problematization → Populations / Subjects → Governance Techniques',
    forbidden: 'Strategic Analysis Report'
  }
];

async function exportLocalizedSample(page, testInfo, locale, lens) {
  await page.goto('/');
  await expect(page.locator('#copyPromptBtn')).toBeVisible();

  await page.locator(locale.button).click();
  await expect(page.locator('html')).toHaveAttribute('lang', locale.id);
  await expect(page.locator('html')).toHaveAttribute('dir', locale.dir);

  await page.locator(`[data-lens="${lens.id}"]`).click();
  await expect(page.locator(`[data-lens="${lens.id}"]`)).toHaveAttribute('aria-pressed', 'true');

  await page.locator('#loadSampleBtn').click();
  await expect(page.locator('#reviewPanel')).toBeVisible();
  await expect(page.locator('#reviewContent')).toContainText(/\S/);

  await page.locator('[data-review="exports"]').click();
  await expect(page.locator('#exportHtml')).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#exportHtml').click();
  const download = await downloadPromise;
  const filePath = testInfo.outputPath(`${locale.id}-${lens.id}-export.html`);
  await download.saveAs(filePath);
  await testInfo.attach(`${locale.id}-${lens.id}-export.html`, { path: filePath, contentType: 'text/html' });
  return fs.readFile(filePath, 'utf8');
}

test.describe('Cross-locale HTML export contract', () => {
  for (const locale of LOCALES) {
    for (const lens of LENSES) {
      test(`${locale.id} ${lens.id} export keeps machine-readable lens metadata`, async ({ page }, testInfo) => {
        const html = await exportLocalizedSample(page, testInfo, locale, lens);

        expect(html).toContain(`<html lang="${locale.id}" dir="${locale.dir}"`);
        expect(html).toContain(`name="app-version" content="${EXPECTED_VERSION}"`);
        expect(html).toContain(`name="analysis-lens" content="${lens.id}"`);
        expect(html).toContain(`data-analysis-lens="${lens.id}"`);
        expect(html).toContain(`data-export-contract-lens="${lens.id}"`);
        expect(html).toContain(lens.title);
        expect(html).toContain(lens.chain);
        expect(html).not.toContain(lens.forbidden);
      });
    }
  }
});
