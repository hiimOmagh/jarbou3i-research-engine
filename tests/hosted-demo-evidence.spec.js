import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const EXPECTED_VERSION = '1.4.0-bio-alpha.2.1';
const EVIDENCE_DIR = process.env.HOSTED_DEMO_EVIDENCE_DIR || 'hosted-demo-evidence-local';
const languageButtons = {
  ar: '#langAr',
  en: '#langEn',
  fr: '#langFr'
};
const languageDirections = {
  ar: 'rtl',
  en: 'ltr',
  fr: 'ltr'
};

async function ensureEvidenceDir() {
  await fs.mkdir(path.join(process.cwd(), EVIDENCE_DIR), { recursive: true });
}

function evidencePath(fileName) {
  return path.join(process.cwd(), EVIDENCE_DIR, fileName);
}

async function writeJson(fileName, data) {
  await ensureEvidenceDir();
  await fs.writeFile(evidencePath(fileName), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

async function captureScreenshot(page, testInfo, fileName) {
  await ensureEvidenceDir();
  const filePath = evidencePath(fileName);

  // Keep hosted evidence to viewport screenshots. Full-page screenshots can fail
  // intermittently when this spec runs inside the full parallel browser suite.
  await page.screenshot({
    path: filePath,
    fullPage: false,
    animations: 'disabled',
    caret: 'hide',
    timeout: 15000
  });

  await testInfo.attach(fileName, { path: filePath, contentType: 'image/png' });
}

async function selectLanguage(page, lang) {
  await page.locator(languageButtons[lang]).click();
  await expect(page.locator('html')).toHaveAttribute('lang', lang);
  await expect(page.locator('html')).toHaveAttribute('dir', languageDirections[lang]);
}

async function readRuntimeAppVersion(page) {
  const appVersion = await page.locator('meta[name="app-version"]').getAttribute('content');
  expect(appVersion).toBe(EXPECTED_VERSION);
  return appVersion;
}

async function visibleTextSnapshot(page, lang) {
  await selectLanguage(page, lang);
  const appVersion = await readRuntimeAppVersion(page);
  const text = await page.locator('body').innerText();
  return {
    app_version: appVersion,
    expected_app_version: EXPECTED_VERSION,
    app_version_source: 'meta[name="app-version"]',
    html_lang: lang,
    html_dir: languageDirections[lang],
    analysis_lens_buttons_present: {
      strategic: await page.locator('[data-lens="strategic"]').isVisible(),
      biopolitical: await page.locator('[data-lens="biopolitical"]').isVisible()
    },
    visible_text_length: text.length,
    visible_text: text
  };
}

test.describe('Hosted demo public UI evidence', () => {
  test('captures public UI evidence and visible text snapshots', async ({ page }, testInfo) => {
    await page.goto('/');
    await expect(page.locator('#copyPromptBtn')).toBeVisible();
    await expect(page.locator('meta[name="app-version"]')).toHaveAttribute('content', EXPECTED_VERSION);
    await expect(page.locator('#analysisLens')).toBeVisible();
    await expect(page.locator('[data-lens="strategic"]')).toHaveAttribute('aria-pressed', 'true');

    if (testInfo.project.name === 'chromium') {
      await captureScreenshot(page, testInfo, 'desktop-first-screen.png');

      await selectLanguage(page, 'en');
      await expect(page.locator('h1')).toContainText('Strategic');
      await captureScreenshot(page, testInfo, 'strategic-mode.png');

      await page.locator('[data-lens="biopolitical"]').click();
      await expect(page.locator('[data-lens="biopolitical"]')).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('h1')).toContainText('Biopolitical');
      await captureScreenshot(page, testInfo, 'biopolitical-mode.png');

      for (const lang of ['ar', 'en', 'fr']) {
        const snapshot = await visibleTextSnapshot(page, lang);
        expect(snapshot.visible_text_length).toBeGreaterThan(500);
        await writeJson(`visible-text-${lang}.json`, snapshot);
        await testInfo.attach(`visible-text-${lang}.json`, {
          path: evidencePath(`visible-text-${lang}.json`),
          contentType: 'application/json'
        });
      }

      await writeJson('hosted-demo-metadata.json', {
        app_version: EXPECTED_VERSION,
        evidence_version: EXPECTED_VERSION,
        capture_set: 'public-ui-lock',
        generated_by: 'tests/hosted-demo-evidence.spec.js',
        projects: ['chromium', 'mobile-chrome'],
        required_files: [
          'desktop-first-screen.png',
          'mobile-first-screen.png',
          'strategic-mode.png',
          'biopolitical-mode.png',
          'visible-text-ar.json',
          'visible-text-en.json',
          'visible-text-fr.json',
          'hosted-demo-metadata.json'
        ],
        public_ui_contract: {
          app_version_meta: true,
          strategic_toggle: true,
          biopolitical_toggle: true,
          trilingual_visible_text: true,
          rtl_arabic: true,
          ltr_english_french: true
        }
      });
      await testInfo.attach('hosted-demo-metadata.json', {
        path: evidencePath('hosted-demo-metadata.json'),
        contentType: 'application/json'
      });
    }

    if (testInfo.project.name === 'mobile-chrome') {
      await captureScreenshot(page, testInfo, 'mobile-first-screen.png');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(2);
    }
  });
});
