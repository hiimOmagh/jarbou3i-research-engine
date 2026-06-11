import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

const EXPECTED_VERSION = '1.4.0-bio-rc.1.2';

async function exportSampleReport(page, testInfo, lens) {
  await page.goto('/');
  await expect(page.locator('#copyPromptBtn')).toBeVisible();

  // Sample content is localized; pin English before asserting English sample tokens.
  await page.locator('#langEn').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  if (lens === 'biopolitical') {
    await page.locator('[data-lens="biopolitical"]').click();
    await expect(page.locator('[data-lens="biopolitical"]')).toHaveAttribute('aria-pressed', 'true');
  } else {
    await page.locator('[data-lens="strategic"]').click();
    await expect(page.locator('[data-lens="strategic"]')).toHaveAttribute('aria-pressed', 'true');
  }

  await page.locator('#loadSampleBtn').click();
  await expect(page.locator('#reviewPanel')).toBeVisible();
  await expect(page.locator('#reviewContent')).toContainText(/\S/);
  await page.locator('[data-review="exports"]').click();
  await expect(page.locator('#exportHtml')).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#exportHtml').click();
  const download = await downloadPromise;
  const filePath = testInfo.outputPath(`${lens}-export.html`);
  await download.saveAs(filePath);
  await testInfo.attach(`${lens}-export.html`, { path: filePath, contentType: 'text/html' });
  return fs.readFile(filePath, 'utf8');
}

function expectAll(html, tokens) {
  for (const token of tokens) expect(html).toContain(token);
}

function expectNone(html, tokens) {
  for (const token of tokens) expect(html).not.toContain(token);
}

test.describe('HTML export lens contract', () => {
  test('strategic export keeps the strategic report contract', async ({ page }, testInfo) => {
    const html = await exportSampleReport(page, testInfo, 'strategic');

    expectAll(html, [
      `name="app-version" content="${EXPECTED_VERSION}"`,
      'name="analysis-lens" content="strategic"',
      'data-analysis-lens="strategic"',
      'data-export-contract-lens="strategic"',
      'Strategic Analysis Report',
      'Interests',
      'Actors',
      'Tools',
      'Narrative',
      'Results',
      'Feedback',
      'Interests → Actors → Tools → Narrative → Results → Feedback'
    ]);

    expectNone(html, [
      'Biopolitical Analysis Report',
      'Problematization → Populations / Subjects → Governance Techniques',
      'Populations / Subjects',
      'Governance Techniques',
      'Norms / Subjectivation',
      'Embodied / Social Outcomes',
      'Resistance / Normalization Feedback'
    ]);
  });

  test('biopolitical export keeps the biopolitical report contract', async ({ page }, testInfo) => {
    const html = await exportSampleReport(page, testInfo, 'biopolitical');

    expectAll(html, [
      `name="app-version" content="${EXPECTED_VERSION}"`,
      'name="analysis-lens" content="biopolitical"',
      'data-analysis-lens="biopolitical"',
      'data-export-contract-lens="biopolitical"',
      'Biopolitical Analysis Report',
      'Problematization',
      'Populations / Subjects',
      'Governance Techniques',
      'Norms / Subjectivation',
      'Embodied / Social Outcomes',
      'Resistance / Normalization Feedback',
      'health passport',
      'proof infrastructure'
    ]);

    expectNone(html, [
      'Strategic Analysis Report',
      'Interests → Actors → Tools → Narrative → Results → Feedback'
    ]);
  });
});
