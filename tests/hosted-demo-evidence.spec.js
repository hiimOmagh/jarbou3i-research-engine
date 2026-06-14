import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const EXPECTED_VERSION = '1.4.0-bio.1.1';
const EXPECTED_ARCHIVE_NAME = `hosted-demo-evidence-v${EXPECTED_VERSION}.zip`;
const EVIDENCE_DIR = process.env.HOSTED_DEMO_EVIDENCE_DIR || 'hosted-demo-evidence-local';
const VISUAL_EVIDENCE_GATE_VERSION = 'XR-8';
const visualScreenshotFiles = [
  'desktop-first-screen.png',
  'desktop-first-screen-dark.png',
  'mobile-first-screen.png',
  'mobile-first-screen-dark.png',
  'simple-mode.png',
  'expert-mode.png',
  'strategic-mode.png',
  'biopolitical-mode.png',
  'import-state.png',
  'review-state.png',
  'export-state.png'
];
const requiredEvidenceFiles = [
  ...visualScreenshotFiles,
  'visible-text-ar.json',
  'visible-text-en.json',
  'visible-text-fr.json',
  'visual-evidence-matrix.json',
  'hosted-demo-metadata.json'
];
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

async function setEvidenceTheme(page, theme) {
  const shouldBeDark = theme === 'dark';
  const isDark = await page.locator('body').evaluate((body) => body.classList.contains('dark'));
  if (isDark !== shouldBeDark) await page.locator('#themeBtn').click();
  await expect(page.locator('#themeBtn')).toHaveAttribute('data-theme-state', theme);
}

async function setEvidenceInterfaceMode(page, mode) {
  await page.locator(mode === 'expert' ? '#modeExpertBtn' : '#modeSimpleBtn').click();
  await expect(page.locator('body')).toHaveAttribute('data-interface-mode', mode);
}

async function scrollEvidenceTargetIntoView(page, selector) {
  await page.locator(selector).scrollIntoViewIfNeeded();
  await page.waitForTimeout(120);
}

async function visualEvidenceMatrix(page) {
  const appVersion = await readRuntimeAppVersion(page);
  return {
    app_version: appVersion,
    visual_evidence_gate_version: VISUAL_EVIDENCE_GATE_VERSION,
    generated_by: 'tests/hosted-demo-evidence.spec.js',
    manual_visual_review_required: true,
    screenshots: visualScreenshotFiles,
    viewports: ['desktop', 'mobile'],
    themes: ['light', 'dark'],
    interface_modes: ['simple', 'expert'],
    states: ['first-screen', 'strategic-mode', 'biopolitical-mode', 'import-state', 'review-state', 'export-state'],
    locale_coverage: ['ar-rtl', 'en-ltr', 'fr-ltr'],
    acceptance_criteria: [
      'desktop-first-screen must look crisp and intentional',
      'mobile-first-screen must reach the primary task quickly',
      'simple-mode must be progressively disclosed, not form-heavy',
      'expert-mode must expose analyst cockpit capability without selector collisions',
      'review-state and export-state must look report-grade',
      'dark-theme evidence must be captured before release lock',
      'RTL mobile evidence must remain overflow-safe'
    ],
    reviewer_decision: 'pending-manual-visual-audit'
  };
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
      await setEvidenceTheme(page, 'light');
      await setEvidenceInterfaceMode(page, 'simple');
      await captureScreenshot(page, testInfo, 'desktop-first-screen.png');
      await captureScreenshot(page, testInfo, 'simple-mode.png');

      await setEvidenceTheme(page, 'dark');
      await captureScreenshot(page, testInfo, 'desktop-first-screen-dark.png');
      await setEvidenceTheme(page, 'light');

      await setEvidenceInterfaceMode(page, 'expert');
      await captureScreenshot(page, testInfo, 'expert-mode.png');
      await setEvidenceInterfaceMode(page, 'simple');

      await selectLanguage(page, 'en');
      await expect(page.locator('h1')).toContainText('Strategic');
      await captureScreenshot(page, testInfo, 'strategic-mode.png');

      await page.locator('[data-lens="biopolitical"]').click();
      await expect(page.locator('[data-lens="biopolitical"]')).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('h1')).toContainText('Biopolitical');
      await captureScreenshot(page, testInfo, 'biopolitical-mode.png');

      await scrollEvidenceTargetIntoView(page, '#jsonInput');
      await captureScreenshot(page, testInfo, 'import-state.png');

      await page.locator('#loadSampleBtn').click();
      await expect(page.locator('#reviewPanel')).toBeVisible();
      await scrollEvidenceTargetIntoView(page, '#reviewPanel');
      await captureScreenshot(page, testInfo, 'review-state.png');

      await page.locator('[data-review="exports"]').click();
      await expect(page.locator('#exportHtml')).toBeVisible();
      await scrollEvidenceTargetIntoView(page, '#reviewPanel');
      await captureScreenshot(page, testInfo, 'export-state.png');

      for (const lang of ['ar', 'en', 'fr']) {
        const snapshot = await visibleTextSnapshot(page, lang);
        expect(snapshot.visible_text_length).toBeGreaterThan(500);
        await writeJson(`visible-text-${lang}.json`, snapshot);
        await testInfo.attach(`visible-text-${lang}.json`, {
          path: evidencePath(`visible-text-${lang}.json`),
          contentType: 'application/json'
        });
      }

      const matrix = await visualEvidenceMatrix(page);
      await writeJson('visual-evidence-matrix.json', matrix);
      await testInfo.attach('visual-evidence-matrix.json', {
        path: evidencePath('visual-evidence-matrix.json'),
        contentType: 'application/json'
      });

      await writeJson('hosted-demo-metadata.json', {
        app_version: EXPECTED_VERSION,
        evidence_version: EXPECTED_VERSION,
        capture_set: 'public-ui-lock-xr-8-visual-gate',
        generated_by: 'tests/hosted-demo-evidence.spec.js',
        projects: ['chromium', 'mobile-chrome'],
        required_files: requiredEvidenceFiles,
        archive_name: EXPECTED_ARCHIVE_NAME,
        archive_format: 'zip',
        archive_identity_guard: true,
        archive_structure_guard: true,
        stable_release_readiness_guard: true,
        visual_evidence_gate: true,
        visual_evidence_gate_version: VISUAL_EVIDENCE_GATE_VERSION,
        manual_visual_review_required: true,
        visual_evidence_matrix_file: 'visual-evidence-matrix.json',
        visual_screenshot_files: visualScreenshotFiles,
        stable_release_report_files: [
          'stable-release-lock-report-v1.4.0-bio.1.1.json',
          'stable-release-lock-report-v1.4.0-bio.1.1.md'
        ],
        archive_required_files: requiredEvidenceFiles,
        archive_exact_files: requiredEvidenceFiles,
        public_ui_contract: {
          app_version_meta: true,
          strategic_toggle: true,
          biopolitical_toggle: true,
          trilingual_visible_text: true,
          rtl_arabic: true,
          ltr_english_french: true,
          light_dark_visual_evidence: true,
          simple_expert_visual_evidence: true,
          review_export_visual_evidence: true,
          manual_visual_review_gate: true
        }
      });
      await testInfo.attach('hosted-demo-metadata.json', {
        path: evidencePath('hosted-demo-metadata.json'),
        contentType: 'application/json'
      });
    }

    if (testInfo.project.name === 'mobile-chrome') {
      await setEvidenceTheme(page, 'light');
      await captureScreenshot(page, testInfo, 'mobile-first-screen.png');
      await setEvidenceTheme(page, 'dark');
      await captureScreenshot(page, testInfo, 'mobile-first-screen-dark.png');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(2);
    }
  });
});
