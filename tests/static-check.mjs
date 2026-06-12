import fs from 'node:fs';
import vm from 'node:vm';

const fail = (message) => {
  console.error(`Static check failed: ${message}`);
  process.exit(1);
};

const read = (file) => fs.readFileSync(file, 'utf8');
const index = read('index.html');
const app = read('src/app.js');
const css = read('src/styles.css');
const manifest = JSON.parse(read('manifest.webmanifest'));
const pkg = JSON.parse(read('package.json'));
const schema = JSON.parse(read('schema/strategic-analysis.schema.json'));

try {
  new vm.Script(app, { filename: 'src/app.js' });
} catch (error) {
  fail(`JavaScript syntax error: ${error.message}`);
}

const ids = [...index.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
if (new Set(ids).size !== ids.length) fail('duplicate DOM ids found in index.html');

const forbiddenEverywhere = [
  'id="exportJson"',
  'id="exportMd"',
  'id="printBtn"',
  'id="selfCheckBtn"',
  'function markdown(',
  'function selfCheckResults(',
  'function runSelfCheck(',
  'function playwrightSnippet(',
  'window.StrategicWorkbenchSelfCheck',
  'assets/jarbou3i-mascot.png"',
  'v1.1.2',
  'v1.1.1'
];
for (const token of forbiddenEverywhere) {
  if ((index + app + css).includes(token)) fail(`forbidden legacy token remains: ${token}`);
}

const requiredFiles = [
  'src/app.js',
  'src/styles.css',
  'assets/favicon-32.png',
  'assets/apple-touch-icon.png',
  'assets/jarbou3i-mascot-192.png',
  'assets/jarbou3i-mascot-512.png',
  'schema/strategic-analysis.schema.json'
];
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) fail(`missing required file: ${file}`);
}

const runtimeAssetLimit = 600 * 1024;
for (const asset of ['assets/jarbou3i-mascot-192.png', 'assets/jarbou3i-mascot-512.png']) {
  const size = fs.statSync(asset).size;
  if (size > runtimeAssetLimit) fail(`${asset} is too large for runtime use: ${size} bytes`);
}

if (index.length > 50000) fail(`index.html is too large after modularization: ${index.length} bytes`);
if (!index.includes('href="src/styles.css"')) fail('external stylesheet link missing');
for (const token of ['.lensToggle', '.lensBtn', '.lensBtn.active', '[aria-pressed="true"]', 'grid-template-columns:repeat(2,minmax(0,1fr))']) {
  if (!css.includes(token)) fail(`lens toggle visual state contract missing token: ${token}`);
}
if (!index.includes('src="src/app.js" defer')) fail('deferred app script missing');
if (/<style>[\s\S]*<\/style>/.test(index)) fail('index.html still contains inline stylesheet');
if (/<script>[\s\S]*<\/script>/.test(index)) fail('index.html still contains inline script');

if (!manifest.icons?.some((icon) => icon.sizes === '192x192')) fail('manifest lacks 192x192 icon');
if (!manifest.icons?.some((icon) => icon.sizes === '512x512')) fail('manifest lacks 512x512 icon');
if (!index.includes('manifest.webmanifest')) fail('manifest link missing from index.html');
if (!index.includes('aria-current="step"') && !app.includes('aria-current="step"')) fail('stage accessibility marker missing');
if (!app.includes('SETTINGS_KEY')) fail('settings persistence is missing');
if (!app.includes('schema_version')) fail('schema_version support is missing');
if (!app.includes('modeResearch')) fail('research prompt mode is missing');
if (!index.includes('id="analysisLens"')) fail('analysis lens toggle is missing');
if (!index.includes('id="reviewTitle"')) fail('stable review title anchor is missing');
if (!app.includes('analysis_lens')) fail('analysis_lens support is missing');
if (!app.includes('Biopolitical') && !app.includes('biopolitical')) fail('biopolitical lens support is missing');
if (!app.includes('qualityGateHtml')) fail('quality gate UI is missing');
if (!app.includes('actorPowerScore')) fail('computed API scoring is missing');
if (!app.includes('bioDiagnosticScores')) fail('biopolitical scoring diagnostics missing');
if (!app.includes('function metricCard(')) fail('runtime metric card renderer missing');
if (!fs.existsSync('docs/preview-track-decision.md')) fail('preview track decision document missing');
if (!fs.existsSync('docs/hosted-demo-evidence.md')) fail('hosted demo evidence document missing');
if (!fs.existsSync('docs/final-handoff.md')) fail('final handoff document missing');
if (!fs.existsSync('tests/export-contract.spec.js')) fail('browser export contract test missing');
if (!fs.existsSync('tests/lens-import-contract.spec.js')) fail('browser lens import contract test missing');
if (!fs.existsSync('tests/cross-locale-export-contract.spec.js')) fail('browser cross-locale export contract test missing');
if (!fs.existsSync('tests/hosted-demo-evidence.spec.js')) fail('hosted demo evidence browser test missing');
if (!fs.existsSync('tests/source-of-truth-check.mjs')) fail('source-of-truth check missing');
if (!fs.existsSync('tests/ci-script-contract-check.mjs')) fail('CI script contract check missing');
if (!fs.existsSync('tests/workspace-hygiene-check.mjs')) fail('workspace hygiene check missing');
for (const script of ['test:ci:no-browser','test:ci:browser','test:ci','test:hygiene','test:ci:contract','test:browser:core','test:browser:hosted','test:evidence:hosted','test:evidence:hosted:archive','test:local:no-browser','test:local:browser','test:local:split','test:local:all']) {
  if (!pkg.scripts?.[script]) fail(`package script missing: ${script}`);
}
if (!pkg.scripts['test:ci:no-browser'].includes('test:hygiene')) fail('no-browser CI alias must include workspace hygiene');
if (!pkg.scripts['test:ci:no-browser'].includes('test:ci:contract')) fail('no-browser CI alias must include CI script contract');
if (pkg.scripts['test:browser:core'] !== 'playwright test tests/a11y.spec.js tests/smoke.spec.js tests/rtl-mobile.spec.js tests/export-contract.spec.js tests/lens-import-contract.spec.js tests/systems-map.spec.js tests/cross-locale-export-contract.spec.js --workers=4') fail('core browser script missing or unstable');
if (pkg.scripts['test:browser:hosted'] !== 'playwright test tests/hosted-demo-evidence.spec.js --workers=1') fail('hosted demo evidence browser script missing or unstable');
if (pkg.scripts['test:ci:browser'] !== 'npm run test:browser && npm run test:evidence:hosted') fail('browser CI alias must run browser suite and hosted evidence review');
if (pkg.scripts['test:evidence:hosted'] !== 'node tests/hosted-demo-evidence-review-check.mjs && node tests/hosted-demo-evidence-archive-check.mjs && node tests/stable-release-readiness-check.mjs') fail('hosted evidence CI alias must run review, archive, and stable release readiness checks');
if (pkg.scripts['test:stable:readiness'] !== 'node tests/stable-release-readiness-check.mjs') fail('stable release readiness script missing');
if (pkg.scripts['test:evidence:hosted:archive'] !== 'node tests/hosted-demo-evidence-archive-check.mjs') fail('hosted evidence archive identity script missing');
if (!fs.existsSync('tests/hosted-demo-evidence-archive-check.mjs')) fail('hosted demo evidence archive check missing');

if (!fs.existsSync('docs/local-ci-split.md')) fail('local CI split document missing');
if (!fs.existsSync('tests/local-ci-split-contract-check.mjs')) fail('local CI split contract check missing');
if (pkg.scripts['test:local:no-browser'] !== 'npm run test:ci:no-browser') fail('local no-browser script must alias no-browser CI');
if (pkg.scripts['test:local:browser'] !== 'npm run test:ci:browser') fail('local browser script must alias browser CI');
if (pkg.scripts['test:local:split'] !== 'node tests/local-ci-split-contract-check.mjs') fail('local split script must run local CI split contract check');
const localSplitDoc = read('docs/local-ci-split.md');
for (const token of ['Run no-browser gates before installing browser dependencies','node_modules/ must not be present during hygiene lock','npm run test:ci:no-browser','npm run test:ci:browser']) {
  if (!localSplitDoc.includes(token)) fail(`local CI split document missing token: ${token}`);
}

const exportSpec = read('tests/export-contract.spec.js');
if (!exportSpec.includes('data-analysis-lens')) fail('export contract test must assert data-analysis-lens');
if (!exportSpec.includes('data-export-contract-lens')) fail('export contract test must assert explicit export contract lens');
if (!exportSpec.includes('testInfo.attach')) fail('export contract test must attach downloaded report evidence');
const importSpec = read('tests/lens-import-contract.spec.js');
if (!importSpec.includes('wrongInitialLens')) fail('lens import contract must prove imported JSON overrides previous UI lens');
const localeSpec = read('tests/cross-locale-export-contract.spec.js');
if (!localeSpec.includes('#langAr') || !localeSpec.includes('#langFr')) fail('cross-locale export contract must cover Arabic and French');
if (!app.includes('name="analysis-lens" content="${escapeHtml(reportLens)}"')) fail('HTML report export must include analysis-lens meta contract');
if (!app.includes('data-analysis-lens="${escapeHtml(reportLens)}"')) fail('HTML report export must include analysis-lens data contract');
if (!app.includes('data-export-contract-lens="${escapeHtml(reportLens)}"')) fail('HTML report export must include explicit export contract lens block');
if (!app.includes('s.rationale?`<p>${escapeHtml(s.rationale)}</p>`')) fail('HTML report export must include scenario rationale text');
if (pkg.version !== '1.4.0-bio.1.1') fail('package version must be 1.4.0-bio.1.1');
if (!index.includes('name="app-version" content="1.4.0-bio.1.1"')) fail('app version metadata missing');
const hostedSpec = read('tests/hosted-demo-evidence.spec.js');
for (const token of ['HOSTED_DEMO_EVIDENCE_DIR', 'desktop-first-screen.png', 'mobile-first-screen.png', 'visible-text-ar.json', 'visible-text-en.json', 'visible-text-fr.json', 'hosted-demo-metadata.json', 'EXPECTED_ARCHIVE_NAME', 'archive_identity_guard', 'archive_structure_guard', 'stable_release_readiness_guard', 'stable_release_report_files', 'archive_required_files', 'archive_exact_files']) {
  if (!hostedSpec.includes(token)) fail(`hosted demo evidence spec missing token: ${token}`);
}

const hostedArchive = read('tests/hosted-demo-evidence-archive-check.mjs');
for (const token of ['EXPECTED_ARCHIVE_NAME', 'stale or unversioned hosted evidence archive found', 'archive filename must be', 'metadata archive_name must be', 'writeVersionedZip', 'readZipEntries', 'assertArchiveStructure', 'nested ZIP payload is forbidden', 'archive must contain exactly', 'archive entries must be root-level files only']) {
  if (!hostedArchive.includes(token)) fail(`hosted evidence archive identity guard missing token: ${token}`);
}
const hostedReview = read('tests/hosted-demo-evidence-review-check.mjs');
for (const token of ['expected_app_version', 'app_version_source', 'metadata evidence_version must match metadata app_version', 'metadata archive_name must be', 'metadata archive_identity_guard must be true', 'metadata archive_structure_guard must be true', 'metadata archive_exact_files must include', 'app_version must match metadata app_version']) {
  if (!hostedReview.includes(token)) fail(`hosted evidence version guard missing token: ${token}`);
}
if (!hostedSpec.includes('readRuntimeAppVersion')) fail('hosted demo evidence spec must read runtime app version from DOM metadata');

const ciWorkflow = fs.existsSync('.github/workflows/ci.yml') ? read('.github/workflows/ci.yml') : '';
for (const token of [
  'npm run test:ci:no-browser',
  'needs: no-browser',
  'node-version: 20',
  'rm -rf node_modules',
  'corepack enable',
  'corepack prepare pnpm@9.15.9 --activate',
  'pnpm install --no-frozen-lockfile',
  'pnpm exec playwright install --with-deps',
  'pnpm exec playwright test tests/a11y.spec.js tests/smoke.spec.js tests/rtl-mobile.spec.js tests/export-contract.spec.js tests/lens-import-contract.spec.js tests/systems-map.spec.js tests/cross-locale-export-contract.spec.js --workers=4',
  'pnpm exec playwright test tests/hosted-demo-evidence.spec.js --workers=1',
  'node tests/hosted-demo-evidence-review-check.mjs hosted-demo-evidence',
  'node tests/hosted-demo-evidence-archive-check.mjs hosted-demo-evidence',
  'node tests/stable-release-readiness-check.mjs hosted-demo-evidence',
  'stable-release-lock-report-v1.4.0-bio.1.1.json',
  'stable-release-lock-report-v1.4.0-bio.1.1.md',
  'hosted-demo-evidence-v1.4.0-bio.1.1.zip',
  'name: hosted-demo-evidence-v1.4.0-bio.1.1',
  'HOSTED_DEMO_EVIDENCE_DIR: hosted-demo-evidence',
  'actions/upload-artifact@v4'
]) {
  if (!ciWorkflow.includes(token)) fail(`CI workflow missing token: ${token}`);
}


const noBrowserBlock = ciWorkflow.slice(
  ciWorkflow.indexOf('  no-browser:'),
  ciWorkflow.indexOf('  browser:')
);
if (!noBrowserBlock.includes('rm -rf node_modules')) fail('no-browser workflow must remove node_modules before hygiene');
if (noBrowserBlock.includes('pnpm install --no-frozen-lockfile')) fail('no-browser workflow must not install dependencies before hygiene');

for (const token of [
  'node-version: 22',
  'cache: npm',
  'npm ci',
  'npm install --no-audit --no-fund || true',
  'npm install --no-audit --no-fund --no-save @playwright/test',
  'npx playwright install --with-deps',
  'npx playwright test'
]) {
  if (ciWorkflow.includes(token)) fail(`CI workflow must not contain stale token: ${token}`);
}


for (const token of ['Expanded Biopolitical Systems Model','human + society + state + market + corporate + geopolitics + technology + behavioral engineering','behavioral_engineering','systemsMapHtml','renderSystemsMap','data-system-review="expanded-biopolitical"','data-system-axis','data-system-map="expanded-biopolitical"','data-system-export-polish="readable-table"','data-system-export-evidence="localized-systems-map"','data-system-export-locale','data-system-export-dir','data-system-axis-label','data-prompt-sample="expanded-biopolitical"','expandedPromptSampleTopic','expandedBiopoliticalPromptContract','Life Process','Population Construction','Technology Mediation','Power Redistribution','systems.items','power_shift','systemsCompletenessDiagnostics','systemsCompletenessDiagnosticHtml','exportSystemsCompletenessDiagnosticHtml','data-system-quality-export="expanded-biopolitical"','data-system-critical-completion','data-system-quality-diagnostics="expanded-biopolitical"','data-system-quality-warning','missing-technology-mediation','missing-behavioral-engineering','missing-power-redistribution','Systems Completeness','Systems Completeness Diagnostic']) {
  if (!app.includes(token)) fail(`expanded biopolitical systems model missing token: ${token}`);
}
if (!fs.existsSync('docs/expanded-biopolitical-systems-model.md')) fail('expanded biopolitical systems model document missing');
if (!schema.properties.systems) fail('schema missing optional systems property');
if (!fs.existsSync('tests/systems-map.spec.js')) fail('systems map browser spec missing');
if (!fs.existsSync('tests/stable-release-readiness-check.mjs')) fail('stable release readiness check missing');
if (!fs.existsSync('fixtures/sample-analysis-bio-en.json')) fail('biopolitical systems fixture missing');
if (!fs.existsSync('fixtures/sample-analysis-bio-thin-en.json')) fail('thin biopolitical systems evidence replay fixture missing');
const systemsMapSpec = read('tests/systems-map.spec.js');
for (const token of ['LOCALIZED_SYSTEM_EXPORTS', 'PROMPT_CONTRACT_CASES', 'locks the systems prompt contract', 'localized-biopolitical-systems-export.html', 'data-system-export-evidence="localized-systems-map"', 'data-system-export-locale', 'جدول الأنظمة الموسّع', 'Tableau systémique élargi', 'Power Redistribution', 'إعادة توزيع القوة', 'Redistribution du pouvoir', 'sample-analysis-bio-thin-en.json', 'thin-biopolitical-systems-export.html', 'data-system-quality-export="expanded-biopolitical"', 'data-system-critical-completion', 'missing-power-redistribution']) {
  if (!systemsMapSpec.includes(token)) fail(`systems-map localization/export evidence lock missing token: ${token}`);
}


const visualStateContracts = [
  ['index', 'language segment role', 'id="languageSegment"'],
  ['index', 'language buttons expose aria-pressed', 'id="langAr" type="button" aria-pressed="true"'],
  ['index', 'theme button exposes theme state', 'data-theme-state="light"'],
  ['index', 'stage bar is list-labelled', 'id="stageBar" role="list"'],
  ['index', 'lens buttons expose radio state', 'role="radio" data-lens="strategic" aria-pressed="true" aria-checked="true"'],
  ['index', 'import card exposes empty state', 'id="pasteCard" data-state="empty"'],
  ['index', 'import button references validation status', 'aria-describedby="jsonStatus"'],
  ['app', 'language state sync updates aria-pressed', "btn.setAttribute('aria-pressed',active?'true':'false')"],
  ['app', 'lens state sync updates aria-checked', "btn.setAttribute('aria-checked',active?'true':'false')"],
  ['app', 'theme state is stored on button', "btn.dataset.themeState=isDark?'dark':'light'"],
  ['app', 'JSON control state helper exists', 'function setJsonImportState(kind,messageKey)'],
  ['app', 'disabled import state uses aria-disabled', "importBtn.setAttribute('aria-disabled',kind==='valid'?'false':'true')"],
  ['app', 'step state is data-driven', 'data-step-state="${stepState}"'],
  ['css', 'UI-1 visual state foundation block exists', 'Phase UI-1 — Visual State Foundation'],
  ['css', 'active language state is styled', '.segBtn[aria-pressed="true"]'],
  ['css', 'active lens checked state is styled', '.lensBtn[aria-checked="true"]'],
  ['css', 'disabled aria state is styled', '.btn[aria-disabled="true"]'],
  ['css', 'import valid state is styled', '.importCommand[data-state="valid"]'],
  ['css', 'step complete state is styled', '.stageItem[data-step-state="complete"]'],
  ['css', 'reduced motion is respected', '@media (prefers-reduced-motion: reduce)']
];
for (const [surface, label, token] of visualStateContracts) {
  const haystack = surface === 'index' ? index : surface === 'app' ? app : css;
  if (!haystack.includes(token)) fail(`visual-state contract missing ${label}`);
}


const firstScreenClarityContracts = [
  ['index', 'workflow panel exposes clarity state', 'id="workflowPanel" data-clarity="workflow-start"'],
  ['index', 'mission card is the primary first-screen guide', 'data-clarity="primary-mission"'],
  ['index', 'mission title anchors the hero copy', 'id="missionTitle"'],
  ['index', 'mission checklist compresses workflow overview', 'class="missionChecklist"'],
  ['index', 'topic card is marked as first action', 'data-clarity="first-action-card"'],
  ['index', 'core options are separated from advanced settings', 'data-clarity="core-options"'],
  ['index', 'advanced options remain visible for browser contracts while visually secondary', 'id="advancedOptions" open'],
  ['index', 'import panel is marked as next step', 'data-clarity="next-step-card"'],
  ['app', 'Arabic mission title is localized', '"missionTitle":"اكتب موضوعًا واضحًا. الأداة ستبني البرومبت."'],
  ['app', 'English mission title is localized', '"missionTitle":"Write one clear topic. The tool will build the prompt."'],
  ['app', 'French mission title is localized', '"missionTitle":"Écrivez un sujet clair. L’outil construira le prompt."'],
  ['css', 'UI-2 first-screen clarity block exists', 'Phase UI-2 — First-Screen Clarity'],
  ['css', 'mission card clarity state is styled', '.missionCard[data-clarity="primary-mission"]'],
  ['css', 'first action card is visually dominant', '.topicCommand[data-clarity="first-action-card"]'],
  ['css', 'core option grid is styled', '.coreChoiceGrid'],
  ['css', 'advanced options disclosure is styled', '.advancedOptions summary'],
  ['css', 'next step card is visually secondary', '.nextStepCard[data-clarity="next-step-card"]']
];
for (const [surface, label, token] of firstScreenClarityContracts) {
  const haystack = surface === 'index' ? index : surface === 'app' ? app : css;
  if (!haystack.includes(token)) fail(`first-screen clarity contract missing ${label}`);
}


const guidedWorkflowContracts = [
  ['index', 'workflow guidance panel exists', 'id="workflowGuidance" data-guidance-state="topic" data-guidance="active"'],
  ['index', 'workflow guidance title is addressable', 'id="workflowGuidanceTitle"'],
  ['index', 'workflow next action is addressable', 'id="workflowNextAction"'],
  ['app', 'workflow progress derives real prerequisites', 'function workflowProgress()'],
  ['app', 'five-step workflow labels exist', "export:'Export'"],
  ['app', 'step states include ready', "if(key==='export') return progress.importReady?(progress.exportActive?'current':'ready'):'locked';"],
  ['app', 'workflow surfaces update after JSON validation', 'renderWorkflowSurfaces();'],
  ['app', 'step items expose stable keys', 'data-step-key="${key}"'],
  ['app', 'step state labels are localized', 'function workflowStepStatusLabel(stateName)'],
  ['css', 'UI-3 guided workflow block exists', 'Phase UI-3 — Guided Workflow Upgrade'],
  ['css', 'workflow guidance card is styled', '.workflowGuidance[data-guidance="active"]'],
  ['css', 'workflow next action pill is styled', '.workflowNextAction'],
  ['css', 'five-step desktop stepper is styled', '.stage{grid-template-columns:repeat(5,minmax(0,1fr))}'],
  ['css', 'ready step state is styled', '.stageItem[data-step-state="ready"]'],
  ['css', 'mission checklist states are styled', '.missionChecklist span[data-check-state="complete"]']
];
for (const [surface, label, token] of guidedWorkflowContracts) {
  const haystack = surface === 'index' ? index : surface === 'app' ? app : css;
  if (!haystack.includes(token)) fail(`guided-workflow contract missing ${label}`);
}

console.log('Static checks passed.');
process.exit(0);
