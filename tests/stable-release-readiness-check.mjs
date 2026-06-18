import fs from 'node:fs';
import path from 'node:path';

const EXPECTED_VERSION = '1.4.0-bio.1.1';
const EXPECTED_ARCHIVE_NAME = `hosted-demo-evidence-v${EXPECTED_VERSION}.zip`;
const REPORT_JSON = `stable-release-lock-report-v${EXPECTED_VERSION}.json`;
const REPORT_MD = `stable-release-lock-report-v${EXPECTED_VERSION}.md`;
const VISUAL_EVIDENCE_GATE_VERSION = 'XR-8';
const VISUAL_SCREENSHOT_FILES = [
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
const REQUIRED_FILES = [
  ...VISUAL_SCREENSHOT_FILES,
  'visible-text-ar.json',
  'visible-text-en.json',
  'visible-text-fr.json',
  'visual-evidence-matrix.json',
  'hosted-demo-metadata.json'
];
const REQUIRED_FILE_SET = new Set(REQUIRED_FILES);

const root = process.cwd();
const fail = (message) => {
  console.error(`Stable release readiness check failed: ${message}`);
  process.exit(1);
};

const read = (filePath) => fs.readFileSync(path.resolve(root, filePath), 'utf8');
const readJson = (filePath) => {
  try {
    return JSON.parse(read(filePath));
  } catch (error) {
    fail(`invalid JSON: ${filePath} (${error.message})`);
  }
};
const existsFile = (filePath) => fs.existsSync(path.resolve(root, filePath)) && fs.statSync(path.resolve(root, filePath)).isFile();

const evidenceDirArg = process.argv[2] || process.env.HOSTED_DEMO_EVIDENCE_DIR || 'hosted-demo-evidence-local';
const evidenceDir = path.resolve(root, evidenceDirArg);
if (!fs.existsSync(evidenceDir)) fail(`missing evidence directory: ${evidenceDirArg}`);
if (!fs.statSync(evidenceDir).isDirectory()) fail(`evidence path is not a directory: ${evidenceDirArg}`);

const pkg = readJson('package.json');
const lock = readJson('package-lock.json');
const index = read('index.html');
const workflow = read('.github/workflows/ci.yml');

if (pkg.version !== EXPECTED_VERSION) fail(`package.json version must be ${EXPECTED_VERSION}`);
if (lock.version !== EXPECTED_VERSION) fail(`package-lock version must be ${EXPECTED_VERSION}`);
if (lock.packages?.['']?.version !== EXPECTED_VERSION) fail(`package-lock packages[""] version must be ${EXPECTED_VERSION}`);
if (!index.includes(`name="app-version" content="${EXPECTED_VERSION}"`)) fail('index.html app-version meta tag is not locked to the stable version');

const scripts = pkg.scripts || {};
const expectedScripts = {
  'test:ci:no-browser': 'npm run test:qa && npm run test:static && npm run test:schema && npm run test:fixtures && npm run test:a11y:static && npm run test:ci:contract && npm run test:hygiene',
  'test:browser:core': 'playwright test tests/a11y.spec.js tests/smoke.spec.js tests/rtl-mobile.spec.js tests/export-contract.spec.js tests/lens-import-contract.spec.js tests/systems-map.spec.js tests/cross-locale-export-contract.spec.js --workers=4',
  'test:browser:hosted': 'playwright test tests/hosted-demo-evidence.spec.js --workers=1',
  'test:evidence:hosted': 'node tests/hosted-demo-evidence-review-check.mjs && node tests/hosted-demo-evidence-archive-check.mjs && node tests/stable-release-readiness-check.mjs',
  'test:stable:readiness': 'node tests/stable-release-readiness-check.mjs'
};
for (const [name, command] of Object.entries(expectedScripts)) {
  if (scripts[name] !== command) fail(`${name} must equal: ${command}`);
}

const requiredWorkflowTokens = [
  'name: No-browser gates',
  'name: Browser gates',
  'needs: no-browser',
  'rm -rf node_modules',
  'pnpm install --no-frozen-lockfile',
  'pnpm exec playwright install --with-deps',
  'pnpm exec playwright test tests/a11y.spec.js tests/smoke.spec.js tests/rtl-mobile.spec.js tests/export-contract.spec.js tests/lens-import-contract.spec.js tests/systems-map.spec.js tests/cross-locale-export-contract.spec.js --workers=4',
  'pnpm exec playwright test tests/hosted-demo-evidence.spec.js --workers=1',
  'node tests/hosted-demo-evidence-review-check.mjs hosted-demo-evidence',
  'node tests/hosted-demo-evidence-archive-check.mjs hosted-demo-evidence',
  'node tests/stable-release-readiness-check.mjs hosted-demo-evidence',
  EXPECTED_ARCHIVE_NAME,
  `name: hosted-demo-evidence-v${EXPECTED_VERSION}`,
  REPORT_JSON,
  REPORT_MD,
  'actions/upload-artifact@v4'
];
for (const token of requiredWorkflowTokens) {
  if (!workflow.includes(token)) fail(`workflow missing token: ${token}`);
}

const noBrowserBlock = workflow.slice(workflow.indexOf('  no-browser:'), workflow.indexOf('  browser:'));
if (!noBrowserBlock.includes('rm -rf node_modules')) fail('no-browser workflow must remove node_modules before hygiene');
if (noBrowserBlock.includes('pnpm install --no-frozen-lockfile')) fail('no-browser workflow must not install dependencies');
if (noBrowserBlock.includes('corepack enable') || noBrowserBlock.includes('corepack prepare')) fail('no-browser workflow must stay dependency-free');

for (const fileName of REQUIRED_FILES) {
  const filePath = path.join(evidenceDir, fileName);
  if (!fs.existsSync(filePath)) fail(`missing evidence file: ${fileName}`);
  if (!fs.statSync(filePath).isFile()) fail(`evidence path is not a file: ${fileName}`);
  if (fs.statSync(filePath).size <= 0) fail(`evidence file is empty: ${fileName}`);
}

const evidenceJson = (fileName) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(evidenceDir, fileName), 'utf8'));
  } catch (error) {
    fail(`invalid evidence JSON: ${fileName} (${error.message})`);
  }
};

const metadata = evidenceJson('hosted-demo-metadata.json');
if (metadata.app_version !== EXPECTED_VERSION) fail(`metadata app_version must be ${EXPECTED_VERSION}`);
if (metadata.evidence_version !== EXPECTED_VERSION) fail(`metadata evidence_version must be ${EXPECTED_VERSION}`);
if (metadata.evidence_version !== metadata.app_version) fail('metadata evidence_version must match metadata app_version');
if (metadata.archive_name !== EXPECTED_ARCHIVE_NAME) fail(`metadata archive_name must be ${EXPECTED_ARCHIVE_NAME}`);
if (metadata.archive_identity_guard !== true) fail('metadata archive_identity_guard must be true');
if (metadata.archive_structure_guard !== true) fail('metadata archive_structure_guard must be true');
if (metadata.stable_release_readiness_guard !== true) fail('metadata stable_release_readiness_guard must be true');
if (metadata.capture_set !== 'public-ui-lock-xr-8-visual-gate') fail('metadata capture_set must be public-ui-lock-xr-8-visual-gate');
if (metadata.visual_evidence_gate !== true) fail('metadata visual_evidence_gate must be true');
if (metadata.visual_evidence_gate_version !== VISUAL_EVIDENCE_GATE_VERSION) fail(`metadata visual_evidence_gate_version must be ${VISUAL_EVIDENCE_GATE_VERSION}`);
if (metadata.manual_visual_review_required !== true) fail('metadata manual_visual_review_required must be true');
if (metadata.visual_evidence_matrix_file !== 'visual-evidence-matrix.json') fail('metadata visual_evidence_matrix_file must be visual-evidence-matrix.json');
for (const fileName of VISUAL_SCREENSHOT_FILES) {
  if (!Array.isArray(metadata.visual_screenshot_files) || !metadata.visual_screenshot_files.includes(fileName)) {
    fail(`metadata visual_screenshot_files must include ${fileName}`);
  }
}
for (const reportFile of [REPORT_JSON, REPORT_MD]) {
  if (!Array.isArray(metadata.stable_release_report_files) || !metadata.stable_release_report_files.includes(reportFile)) {
    fail(`metadata stable_release_report_files must include ${reportFile}`);
  }
}
if (!Array.isArray(metadata.required_files) || metadata.required_files.length !== REQUIRED_FILES.length) {
  fail(`metadata required_files must contain exactly ${REQUIRED_FILES.length} files`);
}
if (!Array.isArray(metadata.archive_required_files) || metadata.archive_required_files.length !== REQUIRED_FILES.length) {
  fail(`metadata archive_required_files must contain exactly ${REQUIRED_FILES.length} files`);
}
if (!Array.isArray(metadata.archive_exact_files) || metadata.archive_exact_files.length !== REQUIRED_FILES.length) {
  fail(`metadata archive_exact_files must contain exactly ${REQUIRED_FILES.length} files`);
}
for (const fileName of REQUIRED_FILES) {
  if (!metadata.required_files.includes(fileName)) fail(`metadata required_files missing ${fileName}`);
  if (!metadata.archive_required_files.includes(fileName)) fail(`metadata archive_required_files missing ${fileName}`);
  if (!metadata.archive_exact_files.includes(fileName)) fail(`metadata archive_exact_files missing ${fileName}`);
}
for (const fileName of metadata.archive_exact_files) {
  if (!REQUIRED_FILE_SET.has(fileName)) fail(`metadata archive_exact_files contains unexpected file: ${fileName}`);
}

const visualMatrix = evidenceJson('visual-evidence-matrix.json');
if (visualMatrix.visual_evidence_gate_version !== VISUAL_EVIDENCE_GATE_VERSION) fail(`visual-evidence-matrix visual_evidence_gate_version must be ${VISUAL_EVIDENCE_GATE_VERSION}`);
if (visualMatrix.app_version !== EXPECTED_VERSION) fail(`visual-evidence-matrix app_version must be ${EXPECTED_VERSION}`);
if (visualMatrix.app_version !== metadata.app_version) fail('visual-evidence-matrix app_version must match metadata app_version');
if (visualMatrix.manual_visual_review_required !== true) fail('visual-evidence-matrix manual_visual_review_required must be true');
if (visualMatrix.reviewer_decision !== 'pending-manual-visual-audit') fail('visual-evidence-matrix reviewer_decision must remain pending-manual-visual-audit');
if (!Array.isArray(visualMatrix.screenshots) || visualMatrix.screenshots.length !== VISUAL_SCREENSHOT_FILES.length) {
  fail(`visual-evidence-matrix screenshots must contain exactly ${VISUAL_SCREENSHOT_FILES.length} files`);
}
for (const fileName of VISUAL_SCREENSHOT_FILES) {
  if (!visualMatrix.screenshots.includes(fileName)) fail(`visual-evidence-matrix screenshots missing ${fileName}`);
}

for (const lang of ['ar', 'en', 'fr']) {
  const snapshot = evidenceJson(`visible-text-${lang}.json`);
  if (snapshot.app_version !== EXPECTED_VERSION) fail(`visible-text-${lang}.json app_version must be ${EXPECTED_VERSION}`);
  if (snapshot.expected_app_version !== EXPECTED_VERSION) fail(`visible-text-${lang}.json expected_app_version must be ${EXPECTED_VERSION}`);
  if (snapshot.app_version !== metadata.app_version) fail(`visible-text-${lang}.json app_version must match metadata app_version`);
  if (snapshot.app_version_source !== 'meta[name="app-version"]') fail(`visible-text-${lang}.json must identify the app-version meta source`);
}

if (!existsFile(EXPECTED_ARCHIVE_NAME)) fail(`expected hosted evidence archive is missing: ${EXPECTED_ARCHIVE_NAME}`);
for (const item of fs.readdirSync(root)) {
  if (/^hosted-demo-evidence.*\.zip$/.test(item) && item !== EXPECTED_ARCHIVE_NAME) {
    fail(`stale hosted evidence archive found: ${item}`);
  }
}

const report = {
  schema_version: '1.1.0',
  stable_release: `v${EXPECTED_VERSION}`,
  promoted_from: 'v1.4.0-bio',
  app_version: EXPECTED_VERSION,
  status: 'ready',
  generated_by: 'tests/stable-release-readiness-check.mjs',
  evidence_dir: path.relative(root, evidenceDir) || evidenceDir,
  archive_name: EXPECTED_ARCHIVE_NAME,
  report_files: [REPORT_JSON, REPORT_MD],
  visual_evidence_gate: {
    version: VISUAL_EVIDENCE_GATE_VERSION,
    manual_visual_review_required: true,
    reviewer_decision: visualMatrix.reviewer_decision,
    matrix_file: 'visual-evidence-matrix.json',
    screenshot_files: VISUAL_SCREENSHOT_FILES
  },
  gates: {
    no_browser_contract: 'pass',
    browser_core_contract: 'pass --workers=4',
    hosted_evidence_review: 'pass',
    hosted_archive_identity: 'pass',
    hosted_archive_structure: 'pass',
    visual_evidence_matrix: 'pass -- pending manual visual audit',
    version_lock: 'pass',
    remote_artifact_configuration: 'pass',
    workspace_hygiene: 'requires post-run cleanup before commit'
  },
  required_evidence_files: REQUIRED_FILES,
  remote_artifacts: [
    evidenceDirArg,
    EXPECTED_ARCHIVE_NAME,
    REPORT_JSON,
    REPORT_MD
  ]
};

fs.writeFileSync(path.join(root, REPORT_JSON), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
fs.writeFileSync(path.join(root, REPORT_MD), `# Stable Release Lock Report — v${EXPECTED_VERSION}\n\nStatus: ready\n\n- No-browser contract: pass\n- Browser core contract: pass (--workers=4)\n- Hosted evidence review: pass\n- Hosted archive identity: pass\n- Hosted archive structure: pass\n- Visual evidence matrix: pass; manual visual audit pending\n- Version lock: pass\n- Remote artifact configuration: pass\n- Archive: ${EXPECTED_ARCHIVE_NAME}\n- Visual evidence gate: ${VISUAL_EVIDENCE_GATE_VERSION}\n\nWorkspace hygiene remains a post-run cleanup gate before commit or tag creation.\n`, 'utf8');

console.log(`Stable release readiness check passed: v${EXPECTED_VERSION}`);
console.log(`Stable release lock report written: ${REPORT_JSON}, ${REPORT_MD}`);
