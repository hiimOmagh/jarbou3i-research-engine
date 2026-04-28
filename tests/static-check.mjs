import fs from 'node:fs';
import vm from 'node:vm';

const fail = (message) => {
  console.error(`Static check failed: ${message}`);
  process.exit(1);
};

const read = (file) => fs.readFileSync(file, 'utf8');
const index = read('index.html');
const app = read('src/app.js');
const researchApp = read('src/research-engine.js');
const sourceConnectors = read('src/research/source-connectors.js');
const providerIdentity = read('src/research/provider-identity.js');
const portableAccountMock = read('src/research/portable-account-mock.js');
const privacyExportGuard = read('src/research/privacy-export-guard.js');
const sourceImportAdapter = read('src/research/source-import-adapter.js');
const css = read('src/styles.css');
const manifest = JSON.parse(read('manifest.webmanifest'));
const pkg = JSON.parse(read('package.json'));

try {
  new vm.Script(app, { filename: 'src/app.js' });
  new vm.Script(researchApp, { filename: 'src/research-engine.js' });
  new vm.Script(sourceConnectors, { filename: 'src/research/source-connectors.js' });
  new vm.Script(providerIdentity, { filename: 'src/research/provider-identity.js' });
  new vm.Script(portableAccountMock, { filename: 'src/research/portable-account-mock.js' });
  new vm.Script(privacyExportGuard, { filename: 'src/research/privacy-export-guard.js' });
  new vm.Script(sourceImportAdapter, { filename: 'src/research/source-import-adapter.js' });
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
  if ((index + app + researchApp + css).includes(token)) fail(`forbidden legacy token remains: ${token}`);
}

const requiredFiles = [
  'src/app.js',
  'src/styles.css',
  'assets/favicon-32.png',
  'assets/apple-touch-icon.png',
  'assets/jarbou3i-mascot-192.png',
  'assets/jarbou3i-mascot-512.png',
  'schema/strategic-analysis.schema.json',
  'schema/research-workflow.schema.json',
  'src/research-engine.js',
  'src/research/source-connectors.js',
  'src/research/provider-identity.js'
  ,'src/research/portable-account-mock.js'
  ,'src/research/privacy-export-guard.js'
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
if (!index.includes('src="src/app.js" defer')) fail('deferred app script missing');
if (!index.includes('src="src/research-engine.js" defer')) fail('deferred research script missing');
if (!index.includes('id="researchLabPanel"')) fail('research lab panel missing');
if (!index.includes('src="src/research/provider-identity.js" defer')) fail('provider identity module missing from index');
if (!index.includes('src="src/research/portable-account-mock.js" defer')) fail('portable account mock module missing from index');
if (!index.includes('src="src/research/privacy-export-guard.js" defer')) fail('privacy export guard module missing from index');
if (!index.includes('id="connectPortableAccountBtn"')) fail('portable account connect UI missing');
if (!index.includes('value="portable_oauth"')) fail('portable OAuth provider option missing');
if (!providerIdentity.includes('PROVIDER_REGISTRY') || !providerIdentity.includes('portable_oauth')) fail('provider identity registry missing portable mode');
if (!portableAccountMock.includes('portableAccountMock') || !portableAccountMock.includes('connect')) fail('portable account mock lifecycle missing');
if (!privacyExportGuard.includes('privacyExportGuard') || !privacyExportGuard.includes('attachPrivacyExportReport')) fail('privacy export guard lifecycle missing');
if (!index.includes('src="src/research/source-connectors.js" defer')) fail('source connectors module missing from index');
if (!index.includes('src="src/research/source-import-adapter.js" defer')) fail('source import adapter module missing from index');
if (!index.includes('id="sourcePlanningOutput"')) fail('source planning panel missing');
if (!researchApp.includes('runSourceTask')) fail('source planning workflow missing');
if (!researchApp.includes('importSourceEvidence')) fail('source import workflow missing');
if (!researchApp.includes('queueImportedEvidence') || !researchApp.includes('evidence_review_queue')) fail('evidence review queue workflow missing');
if (!index.includes('id="sourceImportOutput"')) fail('source import UI missing');
if (!index.includes('id="evidenceReviewOutput"')) fail('evidence review queue UI missing');
if (!sourceConnectors.includes('SOURCE_CONNECTORS')) fail('source connector module missing contracts');
if (/<style>[\s\S]*<\/style>/.test(index)) fail('index.html still contains inline stylesheet');
if (/<script>[\s\S]*<\/script>/.test(index)) fail('index.html still contains inline script');

if (!manifest.icons?.some((icon) => icon.sizes === '192x192')) fail('manifest lacks 192x192 icon');
if (!manifest.icons?.some((icon) => icon.sizes === '512x512')) fail('manifest lacks 512x512 icon');
if (!index.includes('manifest.webmanifest')) fail('manifest link missing from index.html');
if (!index.includes('aria-current="step"') && !app.includes('aria-current="step"')) fail('stage accessibility marker missing');
if (!app.includes('SETTINGS_KEY')) fail('settings persistence is missing');
if (!app.includes('schema_version')) fail('schema_version support is missing');
if (!app.includes('modeResearch')) fail('research prompt mode is missing');
if (!app.includes('qualityGateHtml')) fail('quality gate UI is missing');
if (!app.includes('actorPowerScore')) fail('computed API scoring is missing');
if (pkg.version !== '0.16.0-beta') fail('package version must be 0.16.0-beta');
if (!index.includes('name="app-version" content="0.16.0-beta"')) fail('app version metadata missing');

console.log('Static checks passed.');
process.exit(0);
