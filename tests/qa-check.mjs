import fs from 'node:fs';
import vm from 'node:vm';

const fail = (message) => {
  console.error(`QA check failed: ${message}`);
  process.exit(1);
};
const read = (file) => fs.readFileSync(file, 'utf8');
const index = read('index.html');
const app = read('src/app.js');
const css = read('src/styles.css');
const manifest = JSON.parse(read('manifest.webmanifest'));
const pkg = JSON.parse(read('package.json'));
const schema = JSON.parse(read('schema/strategic-analysis.schema.json'));

try { new vm.Script(app, { filename: 'src/app.js' }); } catch (error) { fail(`JavaScript syntax error: ${error.message}`); }
const ids = [...index.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
if (new Set(ids).size !== ids.length) fail('duplicate DOM ids found in index.html');
for (const token of ['id="exportJson"','id="exportMd"','id="printBtn"','id="selfCheckBtn"','function markdown(','function selfCheckResults(','function runSelfCheck(','function playwrightSnippet(','window.StrategicWorkbenchSelfCheck','assets/jarbou3i-mascot.png"','v1.1.2','v1.1.1']) {
  if ((index + app + css).includes(token)) fail(`forbidden legacy token remains: ${token}`);
}
for (const file of ['src/app.js','src/styles.css','assets/favicon-32.png','assets/apple-touch-icon.png','assets/jarbou3i-mascot-192.png','assets/jarbou3i-mascot-512.png','schema/strategic-analysis.schema.json']) {
  if (!fs.existsSync(file)) fail(`missing required file: ${file}`);
}
for (const asset of ['assets/jarbou3i-mascot-192.png','assets/jarbou3i-mascot-512.png']) {
  const size = fs.statSync(asset).size;
  if (size > 600 * 1024) fail(`${asset} is too large for runtime use: ${size} bytes`);
}
if (index.length > 50000) fail(`index.html is too large after modularization: ${index.length} bytes`);
if (!index.includes('href="src/styles.css"')) fail('external stylesheet link missing');
if (!index.includes('src="src/app.js" defer')) fail('deferred app script missing');
if (/<style>[\s\S]*<\/style>/.test(index)) fail('index.html still contains inline stylesheet');
if (/<script>[\s\S]*<\/script>/.test(index)) fail('index.html still contains inline script');
if (!manifest.icons?.some((icon) => icon.sizes === '192x192')) fail('manifest lacks 192x192 icon');
if (!manifest.icons?.some((icon) => icon.sizes === '512x512')) fail('manifest lacks 512x512 icon');
if (!app.includes('SETTINGS_KEY')) fail('settings persistence is missing');
if (!app.includes('schema_version')) fail('schema_version support is missing');
if (!app.includes('modeResearch')) fail('research prompt mode is missing');
if (!index.includes('id="analysisLens"')) fail('analysis lens toggle is missing');
if (!app.includes('analysis_lens')) fail('analysis_lens support is missing');
if (!app.includes('Biopolitical') && !app.includes('biopolitical')) fail('biopolitical lens support is missing');
if (!app.includes('qualityGateHtml')) fail('quality gate UI is missing');
if (!app.includes('actorPowerScore')) fail('computed API scoring is missing');
if (pkg.version !== '1.4.0-bio') fail('package version must be 1.4.0-bio');
if (!index.includes('name="app-version" content="1.4.0-bio"')) fail('app version metadata missing');
const hostedSpec = read('tests/hosted-demo-evidence.spec.js');
for (const token of ['HOSTED_DEMO_EVIDENCE_DIR', 'desktop-first-screen.png', 'mobile-first-screen.png', 'visible-text-ar.json', 'visible-text-en.json', 'visible-text-fr.json', 'hosted-demo-metadata.json', 'EXPECTED_ARCHIVE_NAME', 'archive_identity_guard', 'archive_structure_guard', 'stable_release_readiness_guard', 'stable_release_report_files', 'archive_required_files', 'archive_exact_files']) {
  if (!hostedSpec.includes(token)) fail(`hosted demo evidence spec missing token: ${token}`);
}
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
  'stable-release-lock-report-v1.4.0-bio.json',
  'stable-release-lock-report-v1.4.0-bio.md',
  'hosted-demo-evidence-v1.4.0-bio.zip',
  'name: hosted-demo-evidence-v1.4.0-bio',
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

const requiredTop = ['schema_version','subject','interests','actors','tools','narrative','results','feedback','contradictions','scenarios'];
const arraySections = ['interests','actors','tools','narrative','results','feedback'];
const resolveRequired = (items) => {
  const refName = items?.$ref?.split('/').pop();
  const def = refName ? schema.$defs?.[refName] : items;
  return def?.allOf?.[1]?.required || def?.required || [];
};
if (schema.$schema !== 'https://json-schema.org/draft/2020-12/schema') fail('schema must declare JSON Schema draft 2020-12');
for (const key of requiredTop) {
  if (!schema.required?.includes(key)) fail(`schema missing required key: ${key}`);
  if (!schema.properties?.[key]) fail(`schema missing property declaration: ${key}`);
}
for (const section of arraySections) {
  const prop = schema.properties[section];
  if (prop.type !== 'array') fail(`${section} must be declared as array`);
  if (!prop.minItems || prop.minItems < 1) fail(`${section} must require at least one item`);
  if (!resolveRequired(prop.items).includes('id')) fail(`${section} items must require id`);
}
if (!resolveRequired(schema.properties.evidence?.properties?.items?.items).includes('counter_evidence')) fail('evidence items must require counter_evidence');
if (!resolveRequired(schema.properties.scenarios?.properties?.items?.items).includes('disproven_if')) fail('scenario items must require disproven_if');
if (!schema.properties.analysis_lens) fail('schema missing analysis_lens property');
if (!schema.properties.analysis_lens.enum?.includes('biopolitical')) fail('schema must allow biopolitical lens');

const files = fs.readdirSync('fixtures').filter((name) => name.endsWith('.json'));
if (!files.length) fail('no JSON fixtures found');
for (const file of files) {
  const data = JSON.parse(read(`fixtures/${file}`));
  for (const key of requiredTop) if (!(key in data)) fail(`${file}: missing ${key}`);
  if (!['strategic', 'biopolitical'].includes(data.analysis_lens)) fail(`${file}: invalid analysis_lens`);
  for (const section of arraySections) {
    if (!Array.isArray(data[section]) || data[section].length < 1) fail(`${file}: ${section} must have at least one item`);
    data[section].forEach((item, idx) => { if (!item.id) fail(`${file}: ${section}[${idx}] missing id`); });
  }
  const scenarios = data.scenarios?.items || [];
  if (!scenarios.every((item) => Array.isArray(item.disproven_if) && item.disproven_if.length)) fail(`${file}: each scenario needs disproven_if`);
  const evidence = data.evidence?.items || [];
  if (!evidence.some((item) => item.basis === 'source_based')) fail(`${file}: needs source_based evidence`);
  if (!evidence.some((item) => typeof item.counter_evidence === 'string' && item.counter_evidence.trim())) fail(`${file}: needs counter_evidence`);
}

if (!files.some((file) => JSON.parse(read(`fixtures/${file}`)).analysis_lens === 'biopolitical')) fail('no biopolitical fixture found');
if (!app.includes('Problematization → Populations/Subjects → Governance Techniques')) fail('biopolitical prompt ontology missing');
if (!app.includes('Distinguish protection from control')) fail('biopolitical control/protection guard missing');
if (!app.includes('pillarsBiopolitical')) fail('biopolitical pillar labels missing');
if (!app.includes('bioDiagnosticScores')) fail('lens-aware biopolitical scoring diagnostics missing');
if (!app.includes('protection/control contradiction quality')) fail('biopolitical scoring formula missing');
if (!app.includes('bioOntologyWarnings')) fail('biopolitical ontology warning gate missing');
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
for (const script of ['test:ci:no-browser','test:ci:browser','test:ci','test:hygiene','test:ci:contract','test:browser:core','test:browser:hosted','test:evidence:hosted','test:evidence:hosted:archive']) {
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

const exportSpec = read('tests/export-contract.spec.js');
if (!exportSpec.includes('data-analysis-lens')) fail('export contract test must assert data-analysis-lens');
if (!exportSpec.includes('testInfo.attach')) fail('export contract test must attach downloaded report evidence');
const importSpec = read('tests/lens-import-contract.spec.js');
if (!importSpec.includes('wrongInitialLens')) fail('lens import contract must prove imported JSON overrides previous UI lens');
if (!importSpec.includes('sample-analysis-bio-en.json')) fail('lens import contract must cover biopolitical fixture import');
const localeSpec = read('tests/cross-locale-export-contract.spec.js');
for (const token of ['#langAr', '#langEn', '#langFr', 'data-export-contract-lens']) {
  if (!localeSpec.includes(token)) fail(`cross-locale export contract missing token: ${token}`);
}
if (!app.includes('name="analysis-lens" content="${escapeHtml(reportLens)}"')) fail('HTML report export must include analysis-lens meta contract');
if (!app.includes('data-analysis-lens="${escapeHtml(reportLens)}"')) fail('HTML report export must include analysis-lens data contract');
if (!app.includes('s.rationale?`<p>${escapeHtml(s.rationale)}</p>`')) fail('HTML report export must include scenario rationale text');

if (!/<html[^>]+lang="ar"[^>]+dir="rtl"/.test(index)) fail('root html must define initial lang and dir');
if (!index.includes('name="viewport"')) fail('viewport meta tag missing');
if (!index.includes('aria-live="polite"')) fail('aria-live region missing');
if (!index.includes('role="dialog"')) fail('modal dialog role missing');
if (!index.includes('aria-modal="true"')) fail('modal aria-modal missing');
if (!index.includes('aria-labelledby="modalTitle"')) fail('modal labelling missing');
if (!index.includes('role="tablist"')) fail('tablist role missing');
if (!app.includes('role="tab"')) fail('runtime tabs must use role tab');
if (!app.includes('aria-selected')) fail('runtime tabs must set aria-selected');
if (!app.includes('aria-current="step"')) fail('current stage marker missing');
for (const tag of [...(index + app).matchAll(/<img\b[^>]*>/g)].map((m) => m[0])) {
  if (!/\balt="[^"]*"/.test(tag)) fail(`image without alt attribute: ${tag}`);
}
for (const tag of [...(index + app).matchAll(/<button\b[^>]*>/g)].map((m) => m[0])) {
  if (!/\btype="button"/.test(tag)) fail(`button without explicit type=button: ${tag}`);
}
if (!/\.srOnly/.test(css)) fail('screen-reader utility class missing');
if (!/:focus-visible/.test(css)) fail('focus-visible styling missing');


for (const token of ['Expanded Biopolitical Systems Model','human + society + state + market + corporate + geopolitics + technology + behavioral engineering','behavioral_engineering','systemsMapHtml','renderSystemsMap','data-system-review="expanded-biopolitical"','data-system-axis','data-system-map="expanded-biopolitical"']) {
  if (!app.includes(token)) fail(`expanded biopolitical systems model missing token: ${token}`);
}
if (!fs.existsSync('docs/expanded-biopolitical-systems-model.md')) fail('expanded biopolitical systems model document missing');
if (!schema.properties.systems) fail('schema missing optional systems property');
if (!fs.existsSync('tests/systems-map.spec.js')) fail('systems map browser spec missing');
if (!fs.existsSync('tests/stable-release-readiness-check.mjs')) fail('stable release readiness check missing');
if (!fs.existsSync('fixtures/sample-analysis-bio-en.json')) fail('biopolitical systems fixture missing');


console.log('QA checks passed.');
process.exit(0);
