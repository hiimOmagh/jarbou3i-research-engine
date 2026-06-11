import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const EXPECTED_VERSION = '1.4.0-bio';
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


const PROMPT_CONTRACT_CASES = [
  {
    id: 'en',
    button: '#langEn',
    expectedTopic: /TikTok, youth attention/,
    tokens: ['Expanded Biopolitical Systems Prompt Contract', 'Life Process', 'Population Construction', 'Governance Infrastructure', 'Incentive Structure', 'Technology Mediation', 'Behavioral Engineering', 'Resistance / Adaptation', 'Power Redistribution', 'systems.items', 'power_shift', 'human, society, state, market, corporate, geopolitical, technology, behavioral_engineering']
  },
  {
    id: 'ar',
    button: '#langAr',
    expectedTopic: /تيك توك، انتباه الشباب/,
    tokens: ['عقد البرومبت للنموذج الموسّع للأنظمة الحيوسياسية', 'مسار الحياة', 'بناء السكان', 'بنية الحكم', 'نظام الحوافز', 'الوساطة التقنية', 'هندسة السلوك', 'المقاومة / التكيّف', 'إعادة توزيع القوة', 'systems.items', 'power_shift', 'human, society, state, market, corporate, geopolitical, technology, behavioral_engineering']
  },
  {
    id: 'fr',
    button: '#langFr',
    expectedTopic: /TikTok, attention des jeunes/,
    tokens: ['Contrat de prompt pour le modèle systémique biopolitique élargi', 'Processus de vie', 'Construction de population', 'Infrastructure de gouvernement', 'Structure d’incitation', 'Médiation technologique', 'Ingénierie comportementale', 'Résistance / adaptation', 'Redistribution du pouvoir', 'systems.items', 'power_shift', 'human, society, state, market, corporate, geopolitical, technology, behavioral_engineering']
  }
];

const LOCALIZED_SYSTEM_EXPORTS = [
  { id: 'en', button: '#langEn', dir: 'ltr', labels: ['Human', 'Society', 'State', 'Market', 'Corporate / Platforms', 'Geopolitics', 'Technology', 'Behavioral Engineering'], table: 'Expanded systems table', narrative: 'Systems reading' },
  { id: 'ar', button: '#langAr', dir: 'rtl', labels: ['الإنسان', 'المجتمع', 'الدولة', 'السوق', 'الشركات / المنصات', 'الجيوسياسة', 'التكنولوجيا', 'هندسة السلوك'], table: 'جدول الأنظمة الموسّع', narrative: 'قراءة الأنظمة' },
  { id: 'fr', button: '#langFr', dir: 'ltr', labels: ['Humain', 'Société', 'État', 'Marché', 'Entreprises / plateformes', 'Géopolitique', 'Technologie', 'Ingénierie comportementale'], table: 'Tableau systémique élargi', narrative: 'Lecture systémique' }
];

async function importBiopoliticalSystemsFixture(page, localeButton = '#langEn', fixtureName = 'sample-analysis-bio-en.json') {
  const raw = await fs.readFile(path.join(process.cwd(), 'fixtures', fixtureName), 'utf8');
  const data = JSON.parse(raw);

  await page.goto('/');
  await expect(page.locator('#copyPromptBtn')).toBeVisible();
  await page.locator(localeButton).click();
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
    await expect(page.locator('#reviewContent [data-system-review="expanded-biopolitical"] [data-system-review-coverage="8"]')).toBeVisible();
    await expect(page.locator('#reviewContent [data-system-map="expanded-biopolitical"]')).toBeVisible();
    await expect(page.locator('#reviewContent [data-system-axis]')).toHaveCount(8);

    for (const label of SYSTEM_AXES) {
      await expect(page.locator('#reviewContent')).toContainText(label);
    }
  });

  test('complete biopolitical systems output receives a full systems completeness diagnostic', async ({ page }) => {
    await importBiopoliticalSystemsFixture(page);

    await page.locator('[data-review="systems"]').click();
    const diagnostic = page.locator('#reviewContent [data-system-quality-diagnostics="expanded-biopolitical"]');
    await expect(diagnostic).toBeVisible();
    await expect(diagnostic).toHaveAttribute('data-system-quality-source', 'explicit');
    await expect(diagnostic).toHaveAttribute('data-system-quality-score', '100');
    await expect(diagnostic).toHaveAttribute('data-system-field-completion', '100');
    await expect(diagnostic).toHaveAttribute('data-system-missing-critical', '');
    await expect(diagnostic.locator('[data-system-quality-warning="complete"]')).toBeVisible();
    await expect(diagnostic).toContainText('Systems Completeness');
  });

  test('thin biopolitical systems output raises completeness diagnostics and critical warnings', async ({ page }) => {
    await importBiopoliticalSystemsFixture(page, '#langEn', 'sample-analysis-bio-thin-en.json');
    await page.locator('[data-review="systems"]').click();

    const diagnostic = page.locator('#reviewContent [data-system-quality-diagnostics="expanded-biopolitical"]');
    await expect(diagnostic).toBeVisible();
    await expect(diagnostic).toHaveAttribute('data-system-quality-source', 'explicit');
    await expect(diagnostic).toHaveAttribute('data-system-missing-critical', /incentive/);
    await expect(diagnostic).toHaveAttribute('data-system-missing-critical', /technology_mediation/);
    await expect(diagnostic).toHaveAttribute('data-system-missing-critical', /behavioral_engineering/);
    await expect(diagnostic).toHaveAttribute('data-system-missing-critical', /resistance/);
    await expect(diagnostic).toHaveAttribute('data-system-missing-critical', /power_redistribution/);
    await expect(diagnostic.locator('[data-system-quality-warning="missing-incentive"]')).toBeVisible();
    await expect(diagnostic.locator('[data-system-quality-warning="missing-technology-mediation"]')).toBeVisible();
    await expect(diagnostic.locator('[data-system-quality-warning="missing-behavioral-engineering"]')).toBeVisible();
    await expect(diagnostic.locator('[data-system-quality-warning="missing-resistance"]')).toBeVisible();
    await expect(diagnostic.locator('[data-system-quality-warning="missing-power-redistribution"]')).toBeVisible();
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
    expect(html).toContain('data-system-quality-export="expanded-biopolitical"');
    expect(html).toContain('data-system-quality-score="100"');
    expect(html).toContain('data-system-critical-completion="100"');
    expect(html).toContain('data-system-quality-warning="complete"');
    expect(html).toContain('Systems Completeness Diagnostic');
    expect(html).toContain('data-system-map="expanded-biopolitical"');
    expect(html).toContain('data-system-axis="behavioral_engineering"');
    expect(html).toContain('data-system-export-polish="readable-table"');
    expect(html).toContain('data-system-export-narrative="expanded-biopolitical"');
    expect(html).toContain('Expanded systems table');
    expect(html).toContain('Behavioral Engineering');
    expect(html).toContain('Choice architecture redistributes autonomy');
  });


  test('thin biopolitical systems output exports diagnostic warnings from evidence replay fixture', async ({ page }, testInfo) => {
    await importBiopoliticalSystemsFixture(page, '#langEn', 'sample-analysis-bio-thin-en.json');
    await page.locator('[data-review="exports"]').click();

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#exportHtml').click();
    const download = await downloadPromise;
    const filePath = testInfo.outputPath('thin-biopolitical-systems-export.html');
    await download.saveAs(filePath);
    await testInfo.attach('thin-biopolitical-systems-export.html', { path: filePath, contentType: 'text/html' });
    const html = await fs.readFile(filePath, 'utf8');

    expect(html).toContain(`name="app-version" content="${EXPECTED_VERSION}"`);
    expect(html).toContain('data-system-quality-export="expanded-biopolitical"');
    expect(html).toContain('data-system-quality-source="explicit"');
    expect(html).toMatch(/data-system-quality-score="(?!100")\d+"/);
    expect(html).toMatch(/data-system-critical-completion="(?!100")\d+"/);
    expect(html).toContain('data-system-quality-warning="missing-incentive"');
    expect(html).toContain('data-system-quality-warning="missing-technology-mediation"');
    expect(html).toContain('data-system-quality-warning="missing-behavioral-engineering"');
    expect(html).toContain('data-system-quality-warning="missing-resistance"');
    expect(html).toContain('data-system-quality-warning="missing-power-redistribution"');
    expect(html).toContain('Thin biopolitical systems output replay fixture');
  });

  for (const locale of LOCALIZED_SYSTEM_EXPORTS) {
    test(`${locale.id} biopolitical systems map export localizes axis labels and locks evidence markers`, async ({ page }, testInfo) => {
      await importBiopoliticalSystemsFixture(page, locale.button);
      await expect(page.locator('html')).toHaveAttribute('lang', locale.id);
      await expect(page.locator('html')).toHaveAttribute('dir', locale.dir);

      await page.locator('[data-review="exports"]').click();
      const downloadPromise = page.waitForEvent('download');
      await page.locator('#exportHtml').click();
      const download = await downloadPromise;
      const filePath = testInfo.outputPath(`${locale.id}-localized-biopolitical-systems-export.html`);
      await download.saveAs(filePath);
      await testInfo.attach(`${locale.id}-localized-biopolitical-systems-export.html`, { path: filePath, contentType: 'text/html' });
      const html = await fs.readFile(filePath, 'utf8');

      expect(html).toContain(`<html lang="${locale.id}" dir="${locale.dir}"`);
      expect(html).toContain(`name="app-version" content="${EXPECTED_VERSION}"`);
      expect(html).toContain('data-system-export-evidence="localized-systems-map"');
      expect(html).toContain(`data-system-export-locale="${locale.id}"`);
      expect(html).toContain(`data-system-export-dir="${locale.dir}"`);
      expect(html).toContain('data-system-axis-coverage="8"');
      expect(html).toContain(locale.table);
      expect(html).toContain(locale.narrative);

      for (const label of locale.labels) {
        expect(html).toContain(label);
      }
    });
  }


  for (const promptCase of PROMPT_CONTRACT_CASES) {
    test(`${promptCase.id} expanded biopolitical prompt sample locks the systems prompt contract`, async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('#copyPromptBtn')).toBeVisible();
      await page.locator(promptCase.button).click();
      await page.locator('[data-lens="biopolitical"]').click();
      await expect(page.locator('[data-prompt-sample="expanded-biopolitical"]')).toBeVisible();
      await page.locator('#loadPromptSampleBtn').click();
      await expect(page.locator('#topicInput')).toHaveValue(promptCase.expectedTopic);
      await expect(page.locator('#timeframeInput')).not.toHaveValue('');
      await page.locator('#promptMode').selectOption('research');
      await page.locator('#previewPromptBtn').click();
      const prompt = page.locator('#modalContent');
      await expect(prompt).toBeVisible();
      for (const token of promptCase.tokens) {
        await expect(prompt).toContainText(token);
      }
    });
  }

});
