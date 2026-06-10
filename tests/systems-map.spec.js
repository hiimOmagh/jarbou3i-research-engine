import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const EXPECTED_VERSION = '1.4.0-bio-alpha.3.1';
const SYSTEM_AXES = [
  'Human',
  'Society',
  'State',
  'Market',
  'Corporate / Platforms',
  'Geopolitics',
  'Technology',
  'Behavioral Engineering'
];

async function importBiopoliticalSystemsFixture(page) {
  const raw = await fs.readFile(path.join(process.cwd(), 'fixtures', 'sample-analysis-bio-en.json'), 'utf8');
  const data = JSON.parse(raw);

  await page.goto('/');
  await expect(page.locator('#copyPromptBtn')).toBeVisible();
  await page.locator('#langEn').click();
  await page.locator('[data-lens="strategic"]').click();
  await page.locator('#jsonInput').fill(JSON.stringify(data, null, 2));
  await expect(page.locator('#importBtn')).toBeEnabled();
  await page.locator('#importBtn').click();
  await expect(page.locator('#reviewPanel')).toBeVisible();
  await expect(page.locator('[data-lens="biopolitical"]')).toHaveAttribute('aria-pressed', 'true');
  return data;
}

test.describe('Expanded systems map review UX', () => {

  test('biopolitical prompt sample loads expanded systems topic before prompt copy', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#copyPromptBtn')).toBeVisible();
    await page.locator('#langEn').click();
    await page.locator('[data-lens="biopolitical"]').click();

    await expect(page.locator('[data-prompt-sample="expanded-biopolitical"]')).toBeVisible();
    await expect(page.locator('[data-prompt-sample="expanded-biopolitical"]')).toContainText('TikTok, youth attention, algorithmic addiction');
    await page.locator('#loadPromptSampleBtn').click();

    await expect(page.locator('#topicInput')).toHaveValue(/TikTok, youth attention/);
    await expect(page.locator('#timeframeInput')).toHaveValue(/2020–2026/);
    await page.locator('#previewPromptBtn').click();
    await expect(page.locator('#modalContent')).toContainText('human + society + state + market + corporate + geopolitics + technology + behavioral engineering');
  });
  test('imported biopolitical fixture renders all eight systems axes in review', async ({ page }) => {
    await importBiopoliticalSystemsFixture(page);

    await expect(page.locator('[data-review="systems"]')).toBeVisible();
    await page.locator('[data-review="systems"]').click();
    await expect(page.locator('#reviewContent [data-system-review="expanded-biopolitical"]')).toBeVisible();
    await expect(page.locator('#reviewContent [data-system-axis-coverage="8"]')).toBeVisible();
    await expect(page.locator('#reviewContent [data-system-map="expanded-biopolitical"]')).toBeVisible();
    await expect(page.locator('#reviewContent [data-system-axis]')).toHaveCount(8);

    for (const label of SYSTEM_AXES) {
      await expect(page.locator('#reviewContent')).toContainText(label);
    }
  });

  test('biopolitical systems map is exported with machine-readable axes', async ({ page }, testInfo) => {
    await importBiopoliticalSystemsFixture(page);
    await page.locator('[data-review="exports"]').click();

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#exportHtml').click();
    const download = await downloadPromise;
    const filePath = testInfo.outputPath('biopolitical-systems-export.html');
    await download.saveAs(filePath);
    await testInfo.attach('biopolitical-systems-export.html', { path: filePath, contentType: 'text/html' });
    const html = await fs.readFile(filePath, 'utf8');

    expect(html).toContain(`name="app-version" content="${EXPECTED_VERSION}"`);
    expect(html).toContain('data-system-map="expanded-biopolitical"');
    expect(html).toContain('data-system-axis="behavioral_engineering"');
    expect(html).toContain('data-system-export-polish="readable-table"');
    expect(html).toContain('data-system-export-narrative="expanded-biopolitical"');
    expect(html).toContain('Expanded systems table');
    expect(html).toContain('Behavioral Engineering');
    expect(html).toContain('Choice architecture redistributes autonomy');
  });
});
