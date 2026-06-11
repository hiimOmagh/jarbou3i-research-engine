import fs from 'node:fs';
import path from 'node:path';

const EXPECTED_VERSION = '1.4.0-bio';
const EXPECTED_ARCHIVE_NAME = `hosted-demo-evidence-v${EXPECTED_VERSION}.zip`;

const fail = (message) => {
  console.error(`Hosted demo evidence review failed: ${message}`);
  process.exit(1);
};

const root = process.cwd();
const evidenceDir = process.argv[2] || process.env.HOSTED_DEMO_EVIDENCE_DIR || 'hosted-demo-evidence-local';
const evidencePath = path.resolve(root, evidenceDir);

if (!fs.existsSync(evidencePath)) {
  fail(`missing evidence directory: ${evidenceDir}`);
}

if (!fs.statSync(evidencePath).isDirectory()) {
  fail(`evidence path is not a directory: ${evidenceDir}`);
}

const requiredFiles = [
  'desktop-first-screen.png',
  'mobile-first-screen.png',
  'strategic-mode.png',
  'biopolitical-mode.png',
  'visible-text-ar.json',
  'visible-text-en.json',
  'visible-text-fr.json',
  'hosted-demo-metadata.json'
];

for (const fileName of requiredFiles) {
  const filePath = path.join(evidencePath, fileName);
  if (!fs.existsSync(filePath)) fail(`missing required evidence file: ${fileName}`);
  const stat = fs.statSync(filePath);
  if (!stat.isFile()) fail(`required evidence path is not a file: ${fileName}`);
  if (stat.size <= 0) fail(`required evidence file is empty: ${fileName}`);
}

const readJson = (fileName) => {
  const filePath = path.join(evidencePath, fileName);
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`invalid JSON evidence file: ${fileName} (${error.message})`);
  }
};

const metadata = readJson('hosted-demo-metadata.json');

if (metadata.app_version !== EXPECTED_VERSION) {
  fail(`metadata app_version must be ${EXPECTED_VERSION}`);
}

if (metadata.evidence_version !== EXPECTED_VERSION) {
  fail(`metadata evidence_version must be ${EXPECTED_VERSION}`);
}

if (metadata.evidence_version !== metadata.app_version) {
  fail('metadata evidence_version must match metadata app_version');
}

if (metadata.archive_name !== EXPECTED_ARCHIVE_NAME) {
  fail(`metadata archive_name must be ${EXPECTED_ARCHIVE_NAME}`);
}

if (metadata.archive_format !== 'zip') {
  fail('metadata archive_format must be zip');
}

if (metadata.archive_identity_guard !== true) {
  fail('metadata archive_identity_guard must be true');
}

if (metadata.archive_structure_guard !== true) {
  fail('metadata archive_structure_guard must be true');
}

if (metadata.stable_release_readiness_guard !== true) {
  fail('metadata stable_release_readiness_guard must be true');
}

for (const reportFile of ['stable-release-lock-report-v1.4.0-bio.json', 'stable-release-lock-report-v1.4.0-bio.md']) {
  if (!Array.isArray(metadata.stable_release_report_files) || !metadata.stable_release_report_files.includes(reportFile)) {
    fail(`metadata stable_release_report_files must include ${reportFile}`);
  }
}

if (metadata.capture_set !== 'public-ui-lock') {
  fail('metadata capture_set must be public-ui-lock');
}

if (metadata.generated_by !== 'tests/hosted-demo-evidence.spec.js') {
  fail('metadata generated_by must identify hosted-demo-evidence.spec.js');
}

for (const project of ['chromium', 'mobile-chrome']) {
  if (!Array.isArray(metadata.projects) || !metadata.projects.includes(project)) {
    fail(`metadata projects must include ${project}`);
  }
}

for (const fileName of requiredFiles) {
  if (!Array.isArray(metadata.required_files) || !metadata.required_files.includes(fileName)) {
    fail(`metadata required_files must include ${fileName}`);
  }
}

for (const fileName of requiredFiles) {
  if (!Array.isArray(metadata.archive_required_files) || !metadata.archive_required_files.includes(fileName)) {
    fail(`metadata archive_required_files must include ${fileName}`);
  }
  if (!Array.isArray(metadata.archive_exact_files) || !metadata.archive_exact_files.includes(fileName)) {
    fail(`metadata archive_exact_files must include ${fileName}`);
  }
}

if (metadata.archive_exact_files.length !== requiredFiles.length) {
  fail(`metadata archive_exact_files must contain exactly ${requiredFiles.length} files`);
}

const contract = metadata.public_ui_contract || {};
for (const [name, value] of Object.entries({
  app_version_meta: true,
  strategic_toggle: true,
  biopolitical_toggle: true,
  trilingual_visible_text: true,
  rtl_arabic: true,
  ltr_english_french: true
})) {
  if (contract[name] !== value) fail(`public_ui_contract.${name} must be ${value}`);
}

const localeExpectations = {
  ar: 'rtl',
  en: 'ltr',
  fr: 'ltr'
};

for (const [lang, dir] of Object.entries(localeExpectations)) {
  const snapshot = readJson(`visible-text-${lang}.json`);
  if (snapshot.app_version !== EXPECTED_VERSION) {
    fail(`visible-text-${lang}.json app_version must be ${EXPECTED_VERSION}`);
  }
  if (snapshot.app_version !== metadata.app_version) {
    fail(`visible-text-${lang}.json app_version must match metadata app_version`);
  }
  if (snapshot.expected_app_version !== EXPECTED_VERSION) {
    fail(`visible-text-${lang}.json expected_app_version must be ${EXPECTED_VERSION}`);
  }
  if (snapshot.app_version_source !== 'meta[name="app-version"]') {
    fail(`visible-text-${lang}.json app_version_source must identify the runtime app-version meta tag`);
  }
  if (snapshot.html_lang !== lang) {
    fail(`visible-text-${lang}.json html_lang must be ${lang}`);
  }
  if (snapshot.html_dir !== dir) {
    fail(`visible-text-${lang}.json html_dir must be ${dir}`);
  }
  if (snapshot.analysis_lens_buttons_present?.strategic !== true) {
    fail(`visible-text-${lang}.json must confirm strategic lens button visibility`);
  }
  if (snapshot.analysis_lens_buttons_present?.biopolitical !== true) {
    fail(`visible-text-${lang}.json must confirm biopolitical lens button visibility`);
  }
  if (typeof snapshot.visible_text !== 'string' || snapshot.visible_text.length < 500) {
    fail(`visible-text-${lang}.json visible_text must contain substantial UI text`);
  }
  if (typeof snapshot.visible_text_length !== 'number' || snapshot.visible_text_length !== snapshot.visible_text.length) {
    fail(`visible-text-${lang}.json visible_text_length must match visible_text.length`);
  }
}

console.log(`Hosted demo evidence review passed: ${path.relative(root, evidencePath) || evidencePath}`);
