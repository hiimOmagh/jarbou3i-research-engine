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
  ['index', 'import button references validation status', 'aria-describedby="jsonStatus jsonStatusMeta"'],
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


const importRepairUxContracts = [
  ['index', 'plain-language import explainer exists', 'id="importExplainer" data-import-ux="plain-language"'],
  ['index', 'visible import validation ladder exists', 'id="importStatusLadder" data-import-ladder="visible" data-import-state="empty"'],
  ['index', 'AI structured answer label replaces raw JSON framing', 'data-i18n="jsonLabel">الجواب المنظّم من الذكاء الاصطناعي'],
  ['index', 'repair button references repair help', 'aria-describedby="jsonStatus jsonRepairHelp"'],
  ['index', 'status meta guidance exists', 'id="jsonStatusMeta" data-import-ux="status-meta"'],
  ['index', 'repair help guidance exists', 'id="jsonRepairHelp" data-repair-state="empty" data-import-ux="repair-guidance"'],
  ['app', 'import metadata helper exists', 'function jsonImportMetaKey(kind)'],
  ['app', 'repair help helper exists', 'function jsonRepairHelpKey(kind)'],
  ['app', 'import ladder update exists', 'function updateImportLadder(kind)'],
  ['app', 'import guidance update exists', 'function updateImportGuidance(kind)'],
  ['app', 'repair state is data-driven', "repair.dataset.repairState=kind"],
  ['app', 'repair prompt uses final JSON-only instruction', "t('repairPromptReturnOnly')"],
  ['app', 'English import help is localized', '"importHelpTitle":"What should I paste here?"'],
  ['app', 'French repair guidance is localized', '"repairHelpTitle":"Quand utiliser la réparation ?"'],
  ['app', 'Arabic repair copied guidance is localized', '"repairCopied":"تم نسخ برومبت الإصلاح. الصقه في نفس محادثة المساعد ثم أعد النتيجة المصححة هنا."'],
  ['css', 'UI-4 import repair block exists', 'Phase UI-4 — Import and Repair UX'],
  ['css', 'plain-language import helper is styled', '.importHelp[data-import-ux="plain-language"]'],
  ['css', 'import ladder is styled', '.importStatusLadder[data-import-ladder="visible"]'],
  ['css', 'repair guidance is styled', '.repairHelp[data-import-ux="repair-guidance"]'],
  ['css', 'invalid repair state is styled', '.repairHelp[data-repair-state="invalid"]'],
  ['css', 'repair button receives actionable invalid state', '.importCommand[data-repair-available="true"] #repairPromptBtn']
];
for (const [surface, label, token] of importRepairUxContracts) {
  const haystack = surface === 'index' ? index : surface === 'app' ? app : css;
  if (!haystack.includes(token)) fail(`import-repair UX contract missing ${label}`);
}


const exportReportPolishContracts = [
  ['app', 'UI-6 export metadata helper exists', 'function exportReportMetaHtml'],
  ['app', 'UI-6 export table of contents helper exists', 'function exportReportTocHtml'],
  ['app', 'UI-6 export readiness helper exists', 'function exportReportReadinessHtml'],
  ['app', 'UI-6 export readiness helper dependency exists', 'function schemaCompletenessMessage'],
  ['app', 'UI-6 export preview helper exists', 'function exportPanelPreviewHtml'],
  ['app', 'HTML report exposes UI-6 polish data contract', 'data-export-report-polish="ui-6" data-report-surface="polished-html"'],
  ['app', 'HTML report metadata block is machine-readable', 'data-export-metadata="polished"'],
  ['app', 'HTML report TOC is present', 'data-export-toc="polished"'],
  ['app', 'HTML report readiness block is present', 'data-export-readiness="polished"'],
  ['app', 'export tab exposes UI-6 workspace', 'data-export-workspace="ui-6-polish"'],
  ['app', 'export tab preview is present', 'data-export-preview="ui-6"'],
  ['app', 'machine-readable analysis lens meta is preserved', 'name="analysis-lens" content="${escapeHtml(reportLens)}"'],
  ['app', 'data analysis lens contract is preserved', 'data-analysis-lens="${escapeHtml(reportLens)}"'],
  ['app', 'explicit export lens contract is preserved', 'data-export-contract-lens="${escapeHtml(reportLens)}"'],
  ['css', 'UI-6 runtime export polish styles exist', 'Phase UI-6 — Export and Final Report Polish'],
  ['css', 'UI-6 export workspace is styled', '.exportGrid[data-export-workspace="ui-6-polish"]'],
  ['css', 'UI-6 export preview is styled', '.exportPreview[data-export-preview="ui-6"]'],
  ['css', 'UI-6 export preview metadata is styled', '.exportPreviewMeta']
];
for (const [surface, label, token] of exportReportPolishContracts) {
  const haystack = surface === 'index' ? index : surface === 'app' ? app : css;
  if (!haystack.includes(token)) fail(`export report polish contract missing ${label}`);
}


const exportDownloadHotfixContracts = [
  ['app', 'UI-6.2 safe export report wrapper exists', 'function safeHtmlReport()'],
  ['app', 'UI-6.2 fallback report preserves download on report errors', 'function fallbackHtmlReport(error)'],
  ['app', 'UI-6.2 export click is delegated for rerendered report buttons', "document.addEventListener('click',e=>{const target=e.target?.closest?.('#exportHtml,#exportHtmlInline,[data-export-html-action]')"],
  ['app', 'UI-6.2 direct export handler no longer owns fragile download', "eh.onclick=null;eh.dataset.exportBound='delegated';"],
  ['app', 'UI-6.2 export download uses safe report wrapper', "download(exportReportFileName(),safeHtmlReport(),'text/html')"]
];
for (const [surface, label, token] of exportDownloadHotfixContracts) {
  const haystack = surface === 'index' ? index : surface === 'app' ? app : css;
  if (!haystack.includes(token)) fail(`export download hotfix contract missing ${label}`);
}


const simpleExpertModeContracts = [
  ['index', 'Simple/Expert mode switch exists', 'id="interfaceModeSegment" data-mode-switch="simple-expert"'],
  ['index', 'Simple mode button exposes pressed state', 'id="modeSimpleBtn" type="button" aria-pressed="true" data-mode="simple"'],
  ['index', 'Expert mode button exists', 'id="modeExpertBtn" type="button" aria-pressed="false" data-mode="expert"'],
  ['index', 'interface mode banner exists', 'id="interfaceModeBanner" data-mode-surface="simple-expert" data-interface-mode="simple"'],
  ['index', 'advanced controls are mode-aware but remain open for browser contracts', 'id="advancedOptions" open data-mode-surface="advanced-controls" data-interface-mode="simple"'],
  ['index', 'technical JSON example is marked expert-only', 'class="jsonExample expertOnly" data-import-ux="example" data-mode-surface="technical-example"'],
  ['index', 'model map is mode-aware', 'id="enginePanel" data-mode-surface="model-map" data-analysis-ready="false"'],
  ['app', 'interface mode is persisted in settings', "interfaceMode:['simple','expert'].includes(savedSettings.interfaceMode)?savedSettings.interfaceMode:'simple'"],
  ['app', 'interface mode copy helper exists', 'function interfaceModeCopy()'],
  ['app', 'interface mode sync helper exists', 'function syncInterfaceMode()'],
  ['app', 'interface mode setter persists settings', 'function setInterfaceMode(mode)'],
  ['app', 'body data interface mode is updated', 'document.body.dataset.interfaceMode=mode'],
  ['app', 'advanced options mode dataset is updated', 'advanced.dataset.interfaceMode=mode'],
  ['app', 'engine panel readiness is mode-aware', "engine.dataset.analysisReady=state.analysis?'true':'false'"],
  ['app', 'Simple/Expert buttons are bound safely', "$('modeSimpleBtn').onclick=()=>setInterfaceMode('simple')"],
  ['css', 'UI-7 Simple/Expert block exists', 'Phase UI-7 — Simple Mode / Expert Mode'],
  ['css', 'mode segment is styled', '.modeSegment[data-mode-switch="simple-expert"]'],
  ['css', 'mode banner is styled', '.interfaceModeBanner[data-mode-surface="simple-expert"]'],
  ['css', 'simple mode hides expert-only surfaces', 'body[data-interface-mode="simple"] .expertOnly'],
  ['css', 'simple mode hides pre-analysis model map complexity', 'body[data-interface-mode="simple"] #enginePanel[data-analysis-ready="false"]'],
  ['css', 'expert mode reveals full model map', 'body[data-interface-mode="expert"] #enginePanel'],
  ['css', 'prompt mode remains browser-visible through open advanced options', '.advancedOptions[data-interface-mode="simple"]']
];
for (const [surface, label, token] of simpleExpertModeContracts) {
  const haystack = surface === 'index' ? index : surface === 'app' ? app : css;
  if (!haystack.includes(token)) fail(`Simple/Expert mode contract missing ${label}`);
}


const visualRebuildR1Contracts = [
  ['index', 'R1 shell exposes visual rebuild contract', 'data-visual-rebuild="r1-shell"'],
  ['index', 'R1 command center exposes visual rebuild contract', 'id="workflowPanel" data-clarity="workflow-start" data-visual-rebuild="r1-command-center"'],
  ['index', 'R1 landing hero exists', 'id="visualIdentityHero" data-visual-rebuild="r1-landing-workspace"'],
  ['index', 'R1 hero command surface exists', 'data-visual-role="command-surface"'],
  ['index', 'R1 cockpit metrics exist', 'class="cockpitMetrics"'],
  ['index', 'R1 landing grid exists', 'data-visual-rebuild="r1-landing-grid"'],
  ['index', 'R1 topic command surface exists', 'data-visual-role="topic-command"'],
  ['index', 'R1 lens decision surface exists', 'data-visual-role="lens-decision"'],
  ['index', 'R1 import rail surface exists', 'data-visual-role="import-rail"'],
  ['app', 'R1 hero eyebrow Arabic copy is localized', '"r1HeroEyebrow":"قمرة تحليل حديثة"'],
  ['app', 'R1 hero eyebrow English copy is localized', '"r1HeroEyebrow":"Analysis cockpit"'],
  ['app', 'R1 hero eyebrow French copy is localized', '"r1HeroEyebrow":"Cockpit d’analyse"'],
  ['css', 'UI-R1 visual rebuild block exists', 'Phase UI-R1 — Visual Identity Rebuild + Landing Workspace Redesign'],
  ['css', 'R1 cockpit hero is styled', '.cockpitHero[data-visual-rebuild="r1-landing-workspace"]'],
  ['css', 'R1 command panel reset is styled', '.commandPanel[data-visual-rebuild="r1-command-center"]'],
  ['css', 'R1 landing grid is styled', '.landingGrid[data-visual-rebuild="r1-landing-grid"]'],
  ['css', 'R1 topic command is styled', '.topicCommand[data-visual-role="topic-command"]'],
  ['css', 'R1 lens decision field is styled', '.lensField[data-visual-role="lens-decision"]'],
  ['css', 'R1 import rail is styled', '.importCommand[data-visual-role="import-rail"]']
];
for (const [surface, label, token] of visualRebuildR1Contracts) {
  const haystack = surface === 'index' ? index : surface === 'app' ? app : css;
  if (!haystack.includes(token)) fail(`visual identity rebuild R1 contract missing ${label}`);
}


const visualRebuildR1OverflowContracts = [
  ['css', 'R1.1 RTL mobile overflow guard block exists', 'Phase UI-R1.1 — RTL Mobile Overflow Guard'],
  ['css', 'R1.1 cockpit hero clips decorative mobile overflow', '.cockpitHero[data-visual-rebuild="r1-landing-workspace"]{\n    overflow:hidden;'],
  ['css', 'R1.1 cockpit hero pseudo no longer expands mobile viewport', '.cockpitHero[data-visual-rebuild="r1-landing-workspace"]::before{\n    inset:0;'],
  ['css', 'R1.1 RTL landing surfaces cap width', 'html[dir="rtl"] .cockpitHero[data-visual-rebuild="r1-landing-workspace"]']
];
for (const [surface, label, token] of visualRebuildR1OverflowContracts) {
  const haystack = surface === 'index' ? index : surface === 'app' ? app : css;
  if (!haystack.includes(token)) fail(`visual identity rebuild R1 overflow contract missing ${label}`);
}


const visualRebuildR2Contracts = [
  ['css', 'R2 composition polish block exists', 'Phase UI-R2 — Composition Polish + Above-the-Fold Action Density'],
  ['css', 'R2 hero grid widens mission card', 'grid-template-columns:minmax(0,1.08fr) minmax(430px,.92fr);'],
  ['css', 'R2 hero height is compacted', 'min-height:218px;'],
  ['css', 'R2 landing grid increases topic action density', 'grid-template-columns:minmax(0,1.52fr) minmax(330px,.48fr);'],
  ['css', 'R2 topic input stays above the fold', 'min-height:136px;'],
  ['css', 'R2 mobile hero uses compact two-column composition', 'grid-template-columns:68px minmax(0,1fr);'],
  ['css', 'R2 mobile metrics remain dense and visible', 'grid-template-columns:repeat(3,minmax(0,1fr));'],
  ['css', 'R2 narrow mobile fallback prevents cramped lens cards', '@media(max-width:440px)']
];
for (const [surface, label, token] of visualRebuildR2Contracts) {
  const haystack = surface === 'index' ? index : surface === 'app' ? app : css;
  if (!haystack.includes(token)) fail(`visual identity rebuild R2 contract missing ${label}`);
}


const visualRebuildR3Contracts = [
  ['index', 'R3 action-first hero recomposition marker exists', 'data-visual-recomposition="r3-action-first"'],
  ['index', 'R3 topic composer moved into hero surface', 'class="card flat topicCommand heroComposer" id="topicCard"'],
  ['index', 'R3 action composer contract exists', 'data-visual-rebuild="r3-action-composer"'],
  ['index', 'R3 follow-up grid contract exists', 'data-visual-refinement="r3-followup-grid"'],
  ['css', 'UI-R3 action-first block exists', 'Phase UI-R3 — Action-First Landing Recomposition'],
  ['css', 'R3 hero uses action-first grid areas', 'grid-template-areas:\n    "composer identity"'],
  ['css', 'R3 hero composer is styled', '.heroComposer[data-visual-rebuild="r3-action-composer"]'],
  ['css', 'R3 mobile keeps composer first', 'grid-template-areas:\n      "composer"\n      "identity"\n      "metrics"\n      "mission";'],
  ['css', 'R3 follow-up import grid is styled', '.landingGrid[data-visual-refinement="r3-followup-grid"] .importCommand[data-visual-role="import-rail"]'],
  ['css', 'R3 simple mode keeps mini guide scoped for action-first density', 'body[data-interface-mode="simple"] .heroComposer[data-visual-rebuild="r3-action-composer"] .miniGuide'],
  ['css', 'R3.1 expanded biopolitical prompt sample remains browser-visible', '.promptSampleCard[data-prompt-sample="expanded-biopolitical"]{']
];
for (const [surface, label, token] of visualRebuildR3Contracts) {
  const haystack = surface === 'index' ? index : surface === 'app' ? app : css;
  if (!haystack.includes(token)) fail(`visual identity rebuild R3 contract missing ${label}`);
}

const visualRebuildR4Contracts = [
  ['css', 'UI-R4 layout repair block exists', 'Phase UI-R4 — Action Surface Layout Repair'],
  ['css', 'R4 composer spans the full first row', `grid-template-areas:
    "composer composer"
    "identity mission"
    "metrics metrics";`],
  ['css', 'R4 narrow fallback prevents side rail text wrapping', '@media(max-width:920px)'],
  ['css', 'R4 mission title no longer uses a narrow side-rail width', 'max-width:30ch;'],
  ['css', 'R4 mission checklist distributes space instead of vertical wrapping', 'flex:1 1 80px;']
];
for (const [surface, label, token] of visualRebuildR4Contracts) {
  const haystack = surface === 'index' ? index : surface === 'app' ? app : css;
  if (!haystack.includes(token)) fail(`visual identity rebuild R4 contract missing ${label}`);
}


const xr1DesignTokenContracts = [
  ['css', 'XR-1 token block exists', 'Phase XR-1 — Design Tokens + Theme System'],
  ['css', 'XR-1 light theme is named', '--xr-theme-name:"Analyst Aurora"'],
  ['css', 'XR-1 dark theme is named', '--xr-theme-name:"Midnight Intelligence"'],
  ['css', 'XR-1 background semantic token exists', '--color-bg-base:#F6F8FC'],
  ['css', 'XR-1 dark background semantic token exists', '--color-bg-base:#050816'],
  ['css', 'XR-1 primary text semantic token exists', '--color-text-primary:#0B1220'],
  ['css', 'XR-1 dark primary text semantic token exists', '--color-text-primary:#F8FAFC'],
  ['css', 'XR-1 primary action semantic token exists', '--color-primary:#2563EB'],
  ['css', 'XR-1 dark primary action semantic token exists', '--color-primary:#60A5FA'],
  ['css', 'XR-1 strategic lens token exists', '--lens-strategic-primary:#2563EB'],
  ['css', 'XR-1 biopolitical lens token exists', '--lens-biopolitical-primary:#7C3AED'],
  ['css', 'XR-1 typography token exists', '--font-sans:"Inter","Noto Sans Arabic"'],
  ['css', 'XR-1 spacing scale exists', '--space-8:32px'],
  ['css', 'XR-1 radius scale exists', '--radius-2xl-token:38px'],
  ['css', 'XR-1 elevation token exists', '--shadow-elevated:0 28px 84px rgba(15,23,42,.12)'],
  ['css', 'XR-1 target size token exists', '--target-min:44px'],
  ['css', 'XR-1 visible focus ring token exists', '--focus-ring-width:2px'],
  ['css', 'XR-1 legacy alias maps background to semantic token', '--bg:var(--color-bg-base)'],
  ['css', 'XR-1 primary button consumes semantic tokens', '.btn.primary,.segBtn.active,.lensBtn[aria-checked="true"]'],
  ['css', 'XR-1 strategic lens active style consumes lens tokens', '.lensBtn[data-lens="strategic"][aria-checked="true"]'],
  ['css', 'XR-1 biopolitical lens active style consumes lens tokens', '.lensBtn[data-lens="biopolitical"][aria-checked="true"]'],
  ['css', 'XR-1 focus ring is outline based', 'outline:var(--focus-ring-width) solid var(--focus-ring-color)'],
  ['css', 'XR-1 reduced motion token override exists', '--motion-fast:0ms;--motion-normal:0ms;--motion-slow:0ms;scroll-behavior:auto']
];
for (const [surface, label, token] of xr1DesignTokenContracts) {
  const haystack = surface === 'index' ? index : surface === 'app' ? app : css;
  if (!haystack.includes(token)) fail(`XR-1 design-token contract missing ${label}`);
}
if (!fs.existsSync('docs/design/xr-0-design-audit-freeze.md')) fail('XR-0 design audit freeze document missing');
if (!fs.existsSync('docs/design/xr-1-design-tokens-theme-system.md')) fail('XR-1 design token document missing');
const xr1Doc = read('docs/design/xr-1-design-tokens-theme-system.md');
for (const token of ['Analyst Aurora', 'Midnight Intelligence', 'Clean Intelligence Studio', 'Legacy compatibility', 'XR-2 — First-Screen Product Recomposition']) {
  if (!xr1Doc.includes(token)) fail(`XR-1 design token document missing token: ${token}`);
}


const xr2FirstScreenContracts = [
  ['index', 'XR-2 composer-first recomposition marker exists', 'data-xr-recomposition="xr-2-composer-first"'],
  ['index', 'XR-2 primary composer surface exists', 'data-xr2-surface="primary-composer"'],
  ['index', 'XR-2 composer intro surface exists', 'data-xr2-surface="composer-intro"'],
  ['index', 'XR-2 workflow strip surface exists', 'data-xr2-surface="workflow-strip"'],
  ['css', 'XR-2 block exists', 'Phase XR-2 — First-Screen Product Recomposition'],
  ['css', 'XR-2 removes visible identity-card canyon', '.cockpitHero[data-xr-recomposition="xr-2-composer-first"] .heroIdentity,'],
  ['css', 'XR-2 keeps composer as dominant first surface', '.topicCommand[data-xr2-surface="primary-composer"]'],
  ['css', 'XR-2 lens choices are card-like', '.topicCommand[data-xr2-surface="primary-composer"] .lensBtn{'],
  ['css', 'XR-2 workflow strip is embedded into composer', '.xrWorkflowStrip[data-xr2-surface="workflow-strip"]'],
  ['css', 'XR-2 mobile preserves single-column composer flow', '@media(max-width:640px)'],
  ['css', 'XR-2 prompt sample remains visible after recomposition', '.promptSampleCard[data-prompt-sample="expanded-biopolitical"]'],
  ['css', 'XR-2.1 keeps welcomeCard browser contract visible', 'Phase XR-2.1 — Welcome Card Contract Visibility Hotfix'],
  ['css', 'XR-2.1 welcomeCard becomes compact mission strip', '.cockpitHero[data-xr-recomposition="xr-2-composer-first"] .heroMission[data-visual-role="command-surface"]'],
  ['css', 'XR-2.1 hero grid reserves mission strip row', '"mission"'],
];
for (const [surface, label, token] of xr2FirstScreenContracts) {
  const haystack = surface === 'index' ? index : surface === 'app' ? app : css;
  if (!haystack.includes(token)) fail(`XR-2 first-screen recomposition contract missing ${label}`);
}
if (!fs.existsSync('docs/design/xr-2-first-screen-product-recomposition.md')) fail('XR-2 first-screen product recomposition document missing');
const xr2Doc = read('docs/design/xr-2-first-screen-product-recomposition.md');
for (const token of ['composer-first', 'Analyst Aurora', 'Midnight Intelligence', 'XR-3 — Guided Wizard Mode', '#topicInput', '#exportHtml']) {
  if (!xr2Doc.includes(token)) fail(`XR-2 design document missing token: ${token}`);
}


const xr3GuidedWizardContracts = [
  ['index', 'XR-3 workflow panel carries guided wizard marker', 'data-xr3-wizard="guided-simple"'],
  ['index', 'XR-3 wizard panel exists', 'id="xrWizardPanel"'],
  ['index', 'XR-3 wizard next action exists', 'id="wizardNextBtn"'],
  ['index', 'XR-3 wizard back action exists', 'id="wizardBackBtn"'],
  ['index', 'XR-3 topic surface is mapped to wizard step', 'data-xr3-step="topic"'],
  ['index', 'XR-3 import surface is mapped to wizard step', 'data-xr3-step="import"'],
  ['index', 'XR-3 review surface is mapped to wizard step', 'data-xr3-step="review"'],
  ['app', 'XR-3 guided wizard label copy exists', 'function guidedWizardLabels()'],
  ['app', 'XR-3 guided wizard step derivation exists', 'function guidedWizardStep(progress=workflowProgress())'],
  ['app', 'XR-3 guided wizard sync exists', 'function syncGuidedWizard()'],
  ['app', 'XR-3 wizard next handler exists', 'function handleWizardNext()'],
  ['app', 'XR-3 wizard back handler exists', 'function handleWizardBack()'],
  ['app', 'XR-3 wizard sync is called from workflow surfaces', 'syncGuidedWizard();'],
  ['css', 'XR-3 guided wizard block exists', 'Phase XR-3 — Guided Wizard Mode'],
  ['css', 'XR-3 wizard panel is styled', '.xrWizardPanel[data-xr3-wizard="guided-simple"]'],
  ['css', 'XR-3 expert mode hides simple wizard shell', 'body[data-interface-mode="expert"] .xrWizardPanel[data-xr3-wizard="guided-simple"]'],
  ['css', 'XR-3 simple mode current step is emphasized', 'body[data-interface-mode="simple"] [data-xr3-step][data-xr3-step-state="current"]'],
  ['css', 'XR-3 wizard preserves browser-dependent controls instead of hard hiding them', 'Browser-dependent controls remain visible and operable'],
  ['css', 'XR-3 mobile header compression exists', 'body[data-interface-mode="simple"] .brand p'],
];
for (const [surface, label, token] of xr3GuidedWizardContracts) {
  const haystack = surface === 'index' ? index : surface === 'app' ? app : css;
  if (!haystack.includes(token)) fail(`XR-3 guided wizard contract missing ${label}`);
}
if (!fs.existsSync('docs/design/xr-3-guided-wizard-mode.md')) fail('XR-3 guided wizard design document missing');
const xr3Doc = read('docs/design/xr-3-guided-wizard-mode.md');
for (const token of ['Simple Mode', 'Guided Wizard Mode', 'Expert Mode', '#jsonInput', '#exportHtml', 'XR-4 — Expert Analyst Dashboard']) {
  if (!xr3Doc.includes(token)) fail(`XR-3 design document missing token: ${token}`);
}


const xr4ExpertDashboardContracts = [
  ['index', 'XR-4 expert dashboard panel exists', 'id="expertAnalystPanel" data-xr4-expert-dashboard="analyst-cockpit"'],
  ['index', 'XR-4 expert dashboard body exists', 'id="expertAnalystBody" data-xr4-expert-body="signals"'],
  ['index', 'XR-4 expert dashboard remains expert-only', 'class="panel expertAnalystPanel expertOnly"'],
  ['app', 'XR-4 expert dashboard renderer exists', 'function renderExpertAnalystDashboard()'],
  ['app', 'XR-4 expert dashboard labels exist', 'function expertDashboardLabel(key)'],
  ['app', 'XR-4 signal card renderer exists', 'function expertDashboardCard('],
  ['app', 'XR-4 expert dashboard calculates schema health', 'const health=schemaHealth(a);'],
  ['app', 'XR-4 expert dashboard calculates evidence pressure', 'const ev=evidencePressureStats(a);'],
  ['app', 'XR-4 expert dashboard supports section jumps', 'data-expert-jump'],
  ['app', 'XR-4.1 lens toggle selectors stay scoped to lens buttons', "document.querySelectorAll('.lensBtn[data-lens]')"],
  ['app', 'XR-4.1 expert dashboard uses non-contract lens mirror', 'panel.dataset.expertLens=lens;'],
  ['app', 'XR-4.1 expert dashboard removes stale generic lens attribute', 'delete panel.dataset.lens;'],
  ['css', 'XR-4 expert dashboard block exists', 'Phase XR-4 — Expert Analyst Dashboard'],
  ['css', 'XR-4 expert dashboard is hidden outside expert mode', 'body:not([data-interface-mode="expert"]) #expertAnalystPanel[data-xr4-expert-dashboard="analyst-cockpit"]'],
  ['css', 'XR-4 diagnostic grid is styled', '.expertSignalGrid[data-xr4-expert-grid="diagnostic-signals"]'],
  ['css', 'XR-4 quality pipeline is styled', '.expertPipeline[data-xr4-expert-pipeline="quality-path"]'],
];
for (const [surface, label, token] of xr4ExpertDashboardContracts) {
  const haystack = surface === 'index' ? index : surface === 'app' ? app : css;
  if (!haystack.includes(token)) fail(`XR-4 expert analyst dashboard contract missing ${label}`);
}
if (app.includes('panel.dataset.lens=lens;')) fail('XR-4.1 regression: expert panel must not expose generic data-lens selector');
if (app.includes("document.querySelectorAll('[data-lens]')")) fail('XR-4.1 regression: lens toggle wiring must not use broad [data-lens] selector');
if (!fs.existsSync('docs/design/xr-4-expert-analyst-dashboard.md')) fail('XR-4 expert analyst dashboard design document missing');
const xr4Doc = read('docs/design/xr-4-expert-analyst-dashboard.md');
for (const token of ['Expert Analyst Dashboard', 'Simple Mode', 'Expert Mode', 'schema health', 'evidence pressure', 'XR-5 — Review Experience Wow Layer']) {
  if (!xr4Doc.includes(token)) fail(`XR-4 design document missing token: ${token}`);
}


const xr42ExportGuardContracts = [
  ['app', 'XR-4.2 persistent export action renderer exists', 'function renderPersistentExportAction()'],
  ['app', 'XR-4.2 primary export action keeps stable #exportHtml contract', "action.id='exportHtml';"],
  ['app', 'XR-4.2 inline export action no longer duplicates #exportHtml', 'id="exportHtmlInline" data-export-html-action="inline"'],
  ['app', 'XR-4.2 delegated export handler accepts primary and inline actions', "closest?.('#exportHtml,#exportHtmlInline,[data-export-html-action]')"],
  ['css', 'XR-4.2 persistent export action styles exist', 'Phase XR-4.2 — Persistent Export Action Guard'],
  ['css', 'XR-4.2 primary export action uses semantic hook', '.reviewExportAction[data-export-html-action="primary"]'],
];
for (const [surface, label, token] of xr42ExportGuardContracts) {
  const haystack = surface === 'app' ? app : css;
  if (!haystack.includes(token)) fail(`${label} missing`);
}
if (app.includes('id="exportHtml" type="button"')) {
  fail('XR-4.2 regression: dynamic export tab must not duplicate #exportHtml');
}


const xr5ReviewWowContracts = [
  ['app', 'XR-5 wow layer renderer exists', 'function xr5ReviewWowLayerHtml(a=state.analysis)'],
  ['app', 'XR-5 lens map renderer exists', 'function xr5LensMapHtml(a=state.analysis)'],
  ['app', 'XR-5 contradiction board renderer exists', 'function xr5ContradictionBoardHtml(a=state.analysis)'],
  ['app', 'XR-5 scenario falsifier board renderer exists', 'function xr5ScenarioBoardHtml(a=state.analysis)'],
  ['app', 'XR-5 confidence signal calculation exists', 'function xr5ConfidenceScore(a=state.analysis)'],
  ['app', 'XR-5 review frame includes intelligence brief layer', 'xr5ReviewWowLayerHtml(state.analysis)'],
  ['app', 'XR-5 strategic lens map has stable marker', 'data-xr5-lens-map="strategic-actor-tool-result"'],
  ['app', 'XR-5 biopolitical lens map has stable marker', 'data-xr5-lens-map="biopolitical-systems"'],
  ['app', 'XR-5 scenario cards preserve falsifier language', 'data-xr5-scenario-board="falsifier-cards"'],
  ['css', 'XR-5 style block exists', 'Phase XR-5 — Review Experience Wow Layer'],
  ['css', 'XR-5 main intelligence brief surface is styled', '.xr5ReviewWowLayer[data-xr5-review-wow-layer="intelligence-brief"]'],
  ['css', 'XR-5 lens map is styled', '.xr5LensMap,'],
  ['css', 'XR-5 strategic path is styled', '.xr5StrategicPath'],
  ['css', 'XR-5 systems orbit is styled', '.xr5SystemsOrbit'],
  ['css', 'XR-5 contradiction board is styled', '.xr5ContradictionBoard'],
  ['css', 'XR-5 scenario board is styled', '.xr5ScenarioBoard'],
  ['css', 'XR-5 mobile collapse is present', '@media(max-width:980px)'],
];
for (const [surface, label, token] of xr5ReviewWowContracts) {
  const haystack = surface === 'index' ? index : surface === 'app' ? app : css;
  if (!haystack.includes(token)) fail(`XR-5 review wow layer contract missing ${label}`);
}
if (app.includes('data-lens="strategic-actor-tool-result"') || app.includes('data-lens="biopolitical-systems"')) {
  fail('XR-5 regression: review lens maps must not use generic data-lens selectors');
}
if (!fs.existsSync('docs/design/xr-5-review-experience-wow-layer.md')) fail('XR-5 review experience design document missing');
const xr5Doc = read('docs/design/xr-5-review-experience-wow-layer.md');
for (const token of ['Review Experience Wow Layer', 'intelligence brief', 'causal spine', 'falsifier cards', 'evidence pressure', 'XR-6 — Export Report Redesign']) {
  if (!xr5Doc.includes(token)) fail(`XR-5 design document missing token: ${token}`);
}


const xr6ExportReportContracts = [
  ['app', 'XR-6 export preview marker exists', 'data-xr6-export-preview="report-grade"'],
  ['app', 'XR-6 export card marker exists', 'data-xr6-export-card="report-redesign"'],
  ['app', 'XR-6 report text helper exists', 'function xr6ReportText(key)'],
  ['app', 'XR-6 report cover renderer exists', 'function xr6ExportCoverHtml('],
  ['app', 'XR-6 intelligence brief renderer exists', 'function xr6ExportBriefHtml('],
  ['app', 'XR-6 lens visual renderer exists', 'function xr6ExportLensVisualHtml('],
  ['app', 'XR-6 causal spine renderer exists', 'function xr6ExportCausalSpineHtml('],
  ['app', 'XR-6 evidence pressure renderer exists', 'function xr6ExportEvidencePressureHtml('],
  ['app', 'XR-6 scenario falsifier renderer exists', 'function xr6ExportScenarioFalsifierHtml('],
  ['app', 'XR-6 contradiction pressure renderer exists', 'function xr6ExportContradictionPressureHtml('],
  ['app', 'XR-6 export CSS generator exists', 'function xr6ReportCss()'],
  ['app', 'XR-6 export report marker exists', 'data-xr6-export-report="premium-brief"'],
  ['app', 'XR-6 report cover marker exists', 'data-xr6-export-cover="report-grade"'],
  ['app', 'XR-6 report brief marker exists', 'data-xr6-export-brief="intelligence-summary"'],
  ['app', 'XR-6 causal spine marker exists', 'data-xr6-export-causal-spine="lens-chain"'],
  ['app', 'XR-6 strategic export map marker exists', 'data-xr6-export-map="strategic-actor-tool-result"'],
  ['app', 'XR-6 biopolitical export map marker exists', 'data-xr6-export-map="biopolitical-systems-orbit"'],
  ['app', 'XR-6 evidence pressure marker exists', 'data-xr6-export-evidence="pressure-board"'],
  ['app', 'XR-6 scenario falsifier marker exists', 'data-xr6-export-scenarios="falsifier-cards"'],
  ['app', 'XR-6 export preserves UI-6 contract marker', 'data-export-report-polish="ui-6" data-report-surface="polished-html"'],
  ['css', 'XR-6 in-app export panel style block exists', 'Phase XR-6 — Export Report Redesign'],
  ['css', 'XR-6 export card style exists', '.exportGrid[data-export-workspace="ui-6-polish"] .exportCard[data-xr6-export-card="report-redesign"]'],
  ['css', 'XR-6 export preview style exists', '.exportPreview[data-export-preview="ui-6"][data-xr6-export-preview="report-grade"]'],
];
for (const [surface, label, token] of xr6ExportReportContracts) {
  const haystack = surface === 'index' ? index : surface === 'app' ? app : css;
  if (!haystack.includes(token)) fail(`XR-6 export report redesign contract missing ${label}`);
}
if (app.includes('data-lens="strategic-actor-tool-result"') || app.includes('data-lens="biopolitical-systems-orbit"')) {
  fail('XR-6 regression: export maps must not use generic data-lens selectors');
}
if (!fs.existsSync('docs/design/xr-6-export-report-redesign.md')) fail('XR-6 export report redesign design document missing');
const xr6Doc = read('docs/design/xr-6-export-report-redesign.md');
for (const token of ['Export Report Redesign', 'report-grade intelligence brief', 'causal spine', 'scenario falsifier', 'machine-readable metadata', 'XR-7 — Accessibility + Localization Hardening']) {
  if (!xr6Doc.includes(token)) fail(`XR-6 design document missing token: ${token}`);
}


const xr7AccessibilityLocalizationContracts = [
  ['app', 'XR-7 accessibility label helper exists', 'function xr7AccessibilityLabels()'],
  ['app', 'XR-7 hardening sync exists', 'function syncAccessibilityLocalizationHardening()'],
  ['app', 'XR-7 global key handler exists', 'function handleGlobalAccessibilityKeys(e)'],
  ['app', 'XR-7 body accessibility marker exists', "dataset.xr7Accessibility='localization-hardening'"],
  ['app', 'XR-7 locale marker exists', 'dataset.xr7Locale=state.lang'],
  ['app', 'XR-7 direction marker exists', 'dataset.xr7Dir=dir'],
  ['app', 'XR-7 motion marker exists', 'dataset.xr7Motion=window.matchMedia'],
  ['app', 'XR-7 skip link marker exists', "skip.dataset.xr7SkipLink='workspace'"],
  ['app', 'XR-7 touch target marker exists', "el.dataset.xr7Target='touch-keyboard-safe'"],
  ['app', 'XR-7 keyboard marker exists', "el.dataset.xr7Keyboard='visible-focus'"],
  ['app', 'XR-7 live region setup exists', "setAttribute('aria-live',live)"],
  ['app', 'XR-7 input described-by setup exists', "topicInput:'topicStatus workflowGuidanceTitle workflowGuidanceBody'"],
  ['app', 'XR-7 review marker exists', "review.dataset.xr7Review='localized-brief'"],
  ['app', 'XR-7 wizard marker exists', "wizard.dataset.xr7Wizard='one-action-readable'"],
  ['app', 'XR-7 expert marker exists', "expert.dataset.xr7Expert='a11y-localized'"],
  ['css', 'XR-7 style block exists', 'Phase XR-7 — Accessibility + Localization Hardening'],
  ['css', 'XR-7 skip link style exists', '.xr7SkipLink[data-xr7-skip-link="workspace"]'],
  ['css', 'XR-7 visible focus style exists', ':where(button,a[href],input,select,textarea,[tabindex]:not([tabindex="-1"])):focus-visible'],
  ['css', 'XR-7 touch target style exists', '[data-xr7-target="touch-keyboard-safe"]'],
  ['css', 'XR-7 Arabic locale style exists', 'body[data-xr7-locale="ar"]'],
  ['css', 'XR-7 French locale style exists', 'body[data-xr7-locale="fr"]'],
  ['css', 'XR-7 RTL direction style exists', 'body[data-xr7-dir="rtl"]'],
  ['css', 'XR-7 reduced motion guard exists', '@media(prefers-reduced-motion:reduce)'],
  ['css', 'XR-7 forced colors guard exists', '@media(forced-colors:active)'],
];
for (const [surface, label, token] of xr7AccessibilityLocalizationContracts) {
  const haystack = surface === 'index' ? index : surface === 'app' ? app : css;
  if (!haystack.includes(token)) fail(`XR-7 accessibility/localization contract missing ${label}`);
}
if (!fs.existsSync('docs/design/xr-7-accessibility-localization-hardening.md')) fail('XR-7 accessibility localization design document missing');
const xr7Doc = read('docs/design/xr-7-accessibility-localization-hardening.md');
for (const token of ['Accessibility + Localization Hardening', 'keyboard-accessible skip link', 'ARIA live regions', 'Arabic RTL', 'French text expansion', 'reduced-motion', 'XR-8 — Visual Evidence Gate Upgrade']) {
  if (!xr7Doc.includes(token)) fail(`XR-7 design document missing token: ${token}`);
}
if (app.includes('data-lens="strategic-actor-tool-result"') || app.includes('data-lens="biopolitical-systems-orbit"')) {
  fail('XR-7 regression: accessibility hardening must not add generic data-lens selectors');
}


const xr75VisualCompositionAuditContracts = [
  ['css', 'XR-7.5 style block exists', 'Phase XR-7.5 — Visual Composition Audit Fixes'],
  ['css', 'XR-7.5 sticky safe token exists', '--xr75-sticky-safe'],
  ['css', 'XR-7.5 mobile sticky safe token exists', '--xr75-mobile-sticky-safe'],
  ['css', 'XR-7.5 scroll padding guard exists', 'scroll-padding-top:var(--xr75-sticky-safe)'],
  ['css', 'XR-7.5 workflow scroll margin exists', ':where(#workflowPanel,#reviewPanel,#xrWizardPanel,#expertAnalystPanel,.panel,.contentPanel)'],
  ['css', 'XR-7.5 structured intelligence motif exists', 'repeating-linear-gradient(135deg'],
  ['css', 'XR-7.5 compact command panel exists', '.commandPanel[data-visual-rebuild="r1-command-center"]'],
  ['css', 'XR-7.5 compact composer exists', '.topicCommand[data-xr2-surface="primary-composer"]'],
  ['css', 'XR-7.5 AI badge repurpose exists', '.xrComposerSignal'],
  ['css', 'XR-7.5 mobile header compaction exists', '.topActions{'],
  ['css', 'XR-7.5 mobile brand compaction exists', '.brand h1'],
  ['css', 'XR-7.5 Arabic mobile type correction exists', 'body[data-xr7-locale="ar"] .xrComposerIntro[data-xr2-surface="composer-intro"] h2'],
  ['css', 'XR-7.5 mobile metrics suppression exists', 'body[data-xr7-accessibility="localization-hardening"] .cockpitHero[data-xr-recomposition="xr-2-composer-first"] .cockpitMetrics{'],
];
for (const [surface, label, token] of xr75VisualCompositionAuditContracts) {
  const haystack = surface === 'index' ? index : surface === 'app' ? app : css;
  if (!haystack.includes(token)) fail(`XR-7.5 visual composition audit contract missing ${label}`);
}
if (!fs.existsSync('docs/design/xr-7.5-visual-composition-audit-fixes.md')) fail('XR-7.5 visual composition audit fixes design document missing');
const xr75Doc = read('docs/design/xr-7.5-visual-composition-audit-fixes.md');
for (const token of ['Visual Composition Audit Fixes', 'compact mobile header', 'sticky header overlap', 'hero vertical dead space', 'Arabic mobile typography', 'structured-intelligence motif', 'XR-8 — Visual Evidence Gate Upgrade']) {
  if (!xr75Doc.includes(token)) fail(`XR-7.5 design document missing token: ${token}`);
}


const xr76FirstViewDensityIdentityContracts = [
  ['css', 'XR-7.6 style block exists', 'Phase XR-7.6 — First-View Density + Product Identity Pass'],
  ['css', 'XR-7.6 mobile header token exists', '--xr76-mobile-header-max'],
  ['css', 'XR-7.6 identity panel token exists', '--xr76-identity-panel'],
  ['css', 'XR-7.6 top underline exists', '.top::after'],
  ['css', 'XR-7.6 composer signal map exists', '.xrComposerSignal::before'],
  ['css', 'XR-7.6 composer signal spine exists', '.xrComposerSignal::after'],
  ['css', 'XR-7.6 mobile top grid exists', 'grid-template-columns:minmax(0,1fr) minmax(96px,.76fr) 34px'],
  ['css', 'XR-7.6 mobile brand ellipsis exists', 'text-overflow:ellipsis'],
  ['css', 'XR-7.6 mobile compact composer signal exists', 'min-height:34px'],
  ['css', 'XR-7.6 Arabic mobile tighter title exists', 'body[data-xr7-locale="ar"] .brand h1'],
  ['css', 'XR-7.6 compact mobile topic input exists', 'min-height:82px'],
  ['css', 'XR-7.6 identity grid exists', 'grid-template-columns:minmax(0,1fr) minmax(210px,var(--xr76-identity-panel))'],
];
for (const [surface, label, token] of xr76FirstViewDensityIdentityContracts) {
  const haystack = surface === 'index' ? index : surface === 'app' ? app : css;
  if (!haystack.includes(token)) fail(`XR-7.6 first-view density identity contract missing ${label}`);
}
if (!fs.existsSync('docs/design/xr-7.6-first-view-density-product-identity-pass.md')) fail('XR-7.6 first-view density product identity pass design document missing');
const xr76Doc = read('docs/design/xr-7.6-first-view-density-product-identity-pass.md');
for (const token of ['First-View Density + Product Identity Pass', 'mobile app bar', 'structured-intelligence identity panel', 'Arabic mobile typography', 'hero empty space', 'XR-8 — Visual Evidence Gate Upgrade']) {
  if (!xr76Doc.includes(token)) fail(`XR-7.6 design document missing token: ${token}`);
}


const xr761RtlMobileOverflowHotfixContracts = [
  ['css', 'XR-7.6.1 style block exists', 'Phase XR-7.6.1 — RTL Mobile Overflow Hotfix'],
  ['css', 'XR-7.6.1 RTL overflow clip exists', 'html[dir="rtl"] body[data-xr7-accessibility="localization-hardening"]'],
  ['css', 'XR-7.6.1 top actions constrained grid exists', 'grid-template-columns:minmax(0,1fr) minmax(0,.82fr) 32px'],
  ['css', 'XR-7.6.1 segment overflow guard exists', '.topActions .segment'],
  ['css', 'XR-7.6.1 button ellipsis guard exists', 'text-overflow:ellipsis'],
  ['css', 'XR-7.6.1 composer paint containment exists', 'contain:paint'],
  ['css', 'XR-7.6.1 narrow viewport guard exists', '@media(max-width:380px)'],
];
for (const [surface, label, token] of xr761RtlMobileOverflowHotfixContracts) {
  const haystack = surface === 'index' ? index : surface === 'app' ? app : css;
  if (!haystack.includes(token)) fail(`XR-7.6.1 RTL mobile overflow hotfix contract missing ${label}`);
}
if (!fs.existsSync('docs/design/xr-7.6.1-rtl-mobile-overflow-hotfix.md')) fail('XR-7.6.1 RTL mobile overflow hotfix design document missing');
const xr761Doc = read('docs/design/xr-7.6.1-rtl-mobile-overflow-hotfix.md');
for (const token of ['RTL Mobile Overflow Hotfix', '39px horizontal overflow', 'topActions', 'composer identity graphic', 'XR-8 — Visual Evidence Gate Upgrade']) {
  if (!xr761Doc.includes(token)) fail(`XR-7.6.1 design document missing token: ${token}`);
}


const xr77SimpleModeProgressiveDisclosureContracts = [
  ['css', 'XR-7.7 style block exists', 'Phase XR-7.7 — Simple Mode Progressive Disclosure + Mobile Flow Compression'],
  ['css', 'XR-7.7 compressed panel gap token exists', '--xr77-compressed-panel-gap'],
  ['css', 'XR-7.7 simple advanced controls are visually collapsed', '.advancedOptions[data-mode-surface="advanced-controls"] .detailsGrid'],
  ['css', 'XR-7.7 expert mode keeps advanced controls open', 'body[data-interface-mode="expert"][data-xr7-accessibility="localization-hardening"] .advancedOptions[data-mode-surface="advanced-controls"] .detailsGrid'],
  ['css', 'XR-7.7 duplicate workflow guidance hidden in simple mode', '.workflowGuidance[data-guidance="active"]'],
  ['css', 'XR-7.7 interface mode banner hidden in simple mode', '.interfaceModeBanner[data-mode-surface="simple-expert"]'],
  ['css', 'XR-7.7 welcome card remains visible but compressed', '.heroMission[data-visual-role="command-surface"]'],
  ['css', 'XR-7.7 simple stepper shows only current mobile step', '.stage[data-xr3-stepper="guided-wizard"] .stageItem:not([data-step-state="current"])'],
  ['css', 'XR-7.7 mini guide list is collapsed in simple mode', '.miniGuide ol'],
  ['css', 'XR-7.7 prompt sample is compact but browser-visible', '.promptSampleCard[data-prompt-sample="expanded-biopolitical"]'],
  ['css', 'XR-7.7 import help steps are compressed on mobile', '.importHelpSteps'],
];
for (const [surface, label, token] of xr77SimpleModeProgressiveDisclosureContracts) {
  const haystack = surface === 'index' ? index : surface === 'app' ? app : css;
  if (!haystack.includes(token)) fail(`XR-7.7 simple mode progressive disclosure contract missing ${label}`);
}
if (!fs.existsSync('docs/design/xr-7.7-simple-mode-progressive-disclosure-mobile-flow-compression.md')) fail('XR-7.7 simple mode progressive disclosure design document missing');
const xr77Doc = read('docs/design/xr-7.7-simple-mode-progressive-disclosure-mobile-flow-compression.md');
for (const token of ['Simple Mode Progressive Disclosure', 'Advanced options', 'Expanded Prompt Sample', 'Guided Wizard', 'mobile flow compression', 'XR-8 — Visual Evidence Gate Upgrade']) {
  if (!xr77Doc.includes(token)) fail(`XR-7.7 design document missing token: ${token}`);
}


const xr8VisualEvidenceGateContracts = [
  ['hostedSpec', 'XR-8 visual gate version exists', "VISUAL_EVIDENCE_GATE_VERSION = 'XR-8'"],
  ['hostedSpec', 'XR-8 desktop dark screenshot exists', 'desktop-first-screen-dark.png'],
  ['hostedSpec', 'XR-8 mobile dark screenshot exists', 'mobile-first-screen-dark.png'],
  ['hostedSpec', 'XR-8 simple mode screenshot exists', 'simple-mode.png'],
  ['hostedSpec', 'XR-8 expert mode screenshot exists', 'expert-mode.png'],
  ['hostedSpec', 'XR-8 import state screenshot exists', 'import-state.png'],
  ['hostedSpec', 'XR-8 review state screenshot exists', 'review-state.png'],
  ['hostedSpec', 'XR-8 export state screenshot exists', 'export-state.png'],
  ['hostedSpec', 'XR-8 visual evidence matrix write exists', 'visual-evidence-matrix.json'],
  ['hostedSpec', 'XR-8 theme helper exists', 'setEvidenceTheme'],
  ['hostedSpec', 'XR-8 interface mode helper exists', 'setEvidenceInterfaceMode'],
  ['hostedSpec', 'XR-8 manual visual review contract exists', 'manual_visual_review_required'],
  ['hostedReview', 'XR-8 review matrix gate exists', 'visual_evidence_gate_version must be XR-8'],
  ['hostedReview', 'XR-8 pending manual reviewer decision exists', 'pending-manual-visual-audit'],
  ['hostedArchive', 'XR-8 archive visual screenshot list exists', 'VISUAL_SCREENSHOT_FILES'],
  ['hostedArchive', 'XR-8 archive visual matrix identity exists', 'visual evidence matrix app_version must match metadata app_version']
];
for (const [surface, label, token] of xr8VisualEvidenceGateContracts) {
  const haystack = surface === 'hostedSpec' ? hostedSpec : surface === 'hostedReview' ? hostedReview : hostedArchive;
  if (!haystack.includes(token)) fail(`XR-8 visual evidence gate contract missing ${label}`);
}
if (!fs.existsSync('docs/design/xr-8-visual-evidence-gate-upgrade.md')) fail('XR-8 visual evidence gate upgrade design document missing');
const xr8Doc = read('docs/design/xr-8-visual-evidence-gate-upgrade.md');
for (const token of ['Visual Evidence Gate Upgrade', 'light/dark mode', 'Simple/Expert mode', 'import/review/export states', 'visual-evidence-matrix.json', 'pending-manual-visual-audit', 'XR-9']) {
  if (!xr8Doc.includes(token)) fail(`XR-8 design document missing token: ${token}`);
}

console.log('Static checks passed.');
process.exit(0);

// Phase UI-5 review dashboard redesign contracts
for (const token of [
  'data-review-workspace="dashboard-redesign"',
  'data-review-shell="dashboard-redesign"'
]) {
  if (!index.includes(token)) fail(`UI-5 review dashboard DOM contract missing token: ${token}`);
}
for (const token of [
  'reviewDashboardFrame',
  'data-review-dashboard="redesigned"',
  'reviewExecutiveBriefHtml',
  'reviewCausalChainHtml',
  'data-review-causal-chain="visible"',
  'reviewSectionCardsHtml',
  'data-review-signal-cards="visible"',
  'reviewEvidenceSnapshotHtml',
  'data-review-evidence-snapshot="counter-evidence-visible"',
  'data-review-nav="dashboard-section"',
  'data-review-detail-surface',
  'reviewPillarCountGrid',
  'evidencePressureStats'
]) {
  if (!app.includes(token)) fail(`UI-5 review dashboard logic missing token: ${token}`);
}
for (const token of [
  '.reviewDashboard[data-review-dashboard="redesigned"]',
  '.reviewExecutiveBrief',
  '.reviewSignalCards[data-review-signal-cards="visible"]',
  '.reviewCausalChain',
  '.reviewLayerFlow',
  '.reviewEvidenceSnapshot[data-review-evidence-snapshot="counter-evidence-visible"]',
  '.reviewDetailSurface[data-review-detail-surface]'
]) {
  if (!styles.includes(token)) fail(`UI-5 review dashboard style missing token: ${token}`);
}
