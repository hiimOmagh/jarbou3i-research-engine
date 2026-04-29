import fs from 'node:fs';
import vm from 'node:vm';

const fail = (message) => {
  console.error(`QA check failed: ${message}`);
  process.exit(1);
};
const read = (file) => fs.readFileSync(file, 'utf8');
const index = read('index.html');
const app = read('src/app.js');
const researchApp = read('src/research-engine.js');
const providerFixtures = read('src/research/provider-fixtures.js');
const providerIdentity = read('src/research/provider-identity.js');
const portableAccountMock = read('src/research/portable-account-mock.js');
const privacyExportGuard = read('src/research/privacy-export-guard.js');
const privacyAudit = read('src/research/privacy-audit.js');
const migrations = read('src/research/migrations.js');
const backendProxyProvider = read('src/research/backend-proxy-provider.js');
const sourceConnectors = read('src/research/source-connectors.js');
const sourceImportAdapter = read('src/research/source-import-adapter.js');
const backendWorker = read('backend/cloudflare-worker.js');
const css = read('src/styles.css');
const manifest = JSON.parse(read('manifest.webmanifest'));
const pkg = JSON.parse(read('package.json'));
const schema = JSON.parse(read('schema/strategic-analysis.schema.json'));
const researchSchema = JSON.parse(read('schema/research-workflow.schema.json'));

try {
  new vm.Script(app, { filename: 'src/app.js' });
  new vm.Script(researchApp, { filename: 'src/research-engine.js' });
  new vm.Script(providerFixtures, { filename: 'src/research/provider-fixtures.js' });
  new vm.Script(providerIdentity, { filename: 'src/research/provider-identity.js' });
  new vm.Script(portableAccountMock, { filename: 'src/research/portable-account-mock.js' });
  new vm.Script(privacyExportGuard, { filename: 'src/research/privacy-export-guard.js' });
  new vm.Script(privacyAudit, { filename: 'src/research/privacy-audit.js' });
  new vm.Script(migrations, { filename: 'src/research/migrations.js' });
  new vm.Script(backendProxyProvider, { filename: 'src/research/backend-proxy-provider.js' });
  new vm.Script(sourceConnectors, { filename: 'src/research/source-connectors.js' });
  new vm.Script(sourceImportAdapter, { filename: 'src/research/source-import-adapter.js' });
} catch (error) { fail(`JavaScript syntax error: ${error.message}`); }
const ids = [...index.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
if (new Set(ids).size !== ids.length) fail('duplicate DOM ids found in index.html');
for (const token of ['id="exportJson"','id="exportMd"','id="printBtn"','id="selfCheckBtn"','function markdown(','function selfCheckResults(','function runSelfCheck(','function playwrightSnippet(','window.StrategicWorkbenchSelfCheck','assets/jarbou3i-mascot.png"','v1.1.2','v1.1.1']) {
  if ((index + app + researchApp + css).includes(token)) fail(`forbidden legacy token remains: ${token}`);
}
for (const file of ['src/app.js','src/research-engine.js','src/styles.css','assets/favicon-32.png','assets/apple-touch-icon.png','assets/jarbou3i-mascot-192.png','assets/jarbou3i-mascot-512.png','schema/strategic-analysis.schema.json','schema/research-workflow.schema.json','src/research/provider-fixtures.js','src/research/provider-identity.js','src/research/backend-proxy-provider.js','backend/cloudflare-worker.js','wrangler.toml',
  'src/research/source-import-adapter.js', 'src/research/portable-account-mock.js', 'src/research/privacy-export-guard.js', 'src/research/privacy-audit.js', 'src/research/migrations.js']) {
  if (!fs.existsSync(file)) fail(`missing required file: ${file}`);
}
for (const asset of ['assets/jarbou3i-mascot-192.png','assets/jarbou3i-mascot-512.png']) {
  const size = fs.statSync(asset).size;
  if (size > 600 * 1024) fail(`${asset} is too large for runtime use: ${size} bytes`);
}
if (index.length > 50000) fail(`index.html is too large after modularization: ${index.length} bytes`);
if (!index.includes('href="src/styles.css"')) fail('external stylesheet link missing');
if (!index.includes('src="src/app.js" defer')) fail('deferred app script missing');
if (!index.includes('src="src/research-engine.js" defer')) fail('deferred research script missing');
if (!index.includes('id="researchLabPanel"')) fail('research lab panel missing');
if (/<style>[\s\S]*<\/style>/.test(index)) fail('index.html still contains inline stylesheet');
if (/<script>[\s\S]*<\/script>/.test(index)) fail('index.html still contains inline script');
if (!manifest.icons?.some((icon) => icon.sizes === '192x192')) fail('manifest lacks 192x192 icon');
if (!manifest.icons?.some((icon) => icon.sizes === '512x512')) fail('manifest lacks 512x512 icon');
if (!app.includes('SETTINGS_KEY')) fail('settings persistence is missing');
if (!app.includes('schema_version')) fail('schema_version support is missing');
if (!app.includes('modeResearch')) fail('research prompt mode is missing');
if (!app.includes('qualityGateHtml')) fail('quality gate UI is missing');
if (!app.includes('actorPowerScore')) fail('computed API scoring is missing');
if (!researchApp.includes('buildProviderPayload') || !researchApp.includes('runProviderTask')) fail('provider harness workflow missing');
if (!researchApp.includes('evidence_matrix')) fail('evidence matrix support missing');
if (!researchApp.includes('causal_links')) fail('causal link support missing');
if (!researchApp.includes('compileAnalysisBrief')) fail('analysis compiler missing');
if (!researchApp.includes('buildSourceClusters')) fail('source clustering missing');
if (!researchApp.includes('responseContract')) fail('provider response contracts missing');
if (!researchApp.includes('callOpenAICompatibleProvider')) fail('OpenAI-compatible provider adapter missing');
if (!researchApp.includes('BYOK_KEY_STORAGE')) fail('BYOK key storage guard missing');
if (!index.includes('id="enableLiveByok"')) fail('live BYOK opt-in control missing');
if (!researchApp.includes('diagnosticReport')) fail('diagnostics missing');
if (!researchApp.includes('validateProviderResponse')) fail('provider response validation missing');
if (!researchApp.includes('repairProviderResponse')) fail('provider repair routing missing');
if (!researchApp.includes('providerContractPreview')) fail('provider contract preview missing');
if (!researchApp.includes('providerPromptPreview')) fail('provider prompt preview missing');
if (!researchApp.includes('runProviderFixtureSuite')) fail('provider fixture suite runner missing');
if (!index.includes('id="providerContractPreview"')) fail('provider contract preview UI missing');
if (!index.includes('id="providerPromptPreview"')) fail('provider prompt preview UI missing');
if (!index.includes('id="runProviderFixtureSuiteBtn"')) fail('provider fixture suite button missing');
if (!providerFixtures.includes('contractFixtures')) fail('provider fixture module missing contract fixtures');
if (!index.includes('value="backend_proxy"')) fail('backend proxy provider option missing');
if (!index.includes('value="portable_oauth"')) fail('portable OAuth provider option missing');
if (!providerIdentity.includes('PROVIDER_REGISTRY') || !providerIdentity.includes('portable_oauth')) fail('provider identity registry missing portable account mode');
if (!index.includes('src="src/research/provider-identity.js" defer')) fail('provider identity module missing from index');
if (!index.includes('src="src/research/portable-account-mock.js" defer')) fail('portable account mock module missing from index');
if (!index.includes('src="src/research/privacy-export-guard.js" defer')) fail('privacy export guard module missing from index');
if (!index.includes('id="connectPortableAccountBtn"')) fail('portable account connect UI missing');
if (!privacyExportGuard.includes('privacyExportGuard') || !privacyExportGuard.includes('attachPrivacyExportReport')) fail('privacy export guard missing');
if (!privacyAudit.includes('privacyAudit') || !privacyAudit.includes('assertPrivacyReleaseGate')) fail('privacy audit release gate missing');
if (!index.includes('src="src/research/privacy-audit.js" defer')) fail('privacy audit module missing from index');
if (!researchApp.includes('privacySafeExportPayload')) fail('privacy safe JSON export hook missing');
if (!index.includes('src="src/research/backend-proxy-provider.js" defer')) fail('backend proxy module missing from index');
if (!researchApp.includes('callBackendProxyProvider')) fail('backend proxy provider call path missing');
if (!researchApp.includes('hosted_proxy_user_opt_in')) fail('hosted proxy privacy mode missing');
if (!researchApp.includes('providerIdentityReport') || !researchApp.includes('provider_billing_policy')) fail('provider identity/billing integration missing');
if (!backendWorker.includes('OPENAI_API_KEY') || !backendWorker.includes('/api/provider-task')) fail('backend worker proxy contract missing');
if (!index.includes('src="src/research/source-connectors.js" defer')) fail('source connectors module missing from index');
if (!index.includes('src="src/research/source-import-adapter.js" defer')) fail('source import adapter module missing from index');
if (!index.includes('id="sourcePlanningOutput"')) fail('source planning UI missing');
if (!researchApp.includes('runSourceTask')) fail('source task runner missing');
if (!researchApp.includes('importSourceEvidence')) fail('source import runner missing');
if (!index.includes('id="sourceImportOutput"')) fail('source import UI missing');
if (!sourceImportAdapter.includes('parseSourceImportText')) fail('source import adapter missing parser');
if (!researchApp.includes('source_policy')) fail('source policy support missing');
if (!index.includes('id="evidenceReviewOutput"')) fail('evidence review queue UI missing');
if (!researchApp.includes('evidence_review_queue') || !researchApp.includes('promoteReviewItem')) fail('evidence review queue support missing');
if (!sourceConnectors.includes('SOURCE_CONNECTORS') || !sourceConnectors.includes('runSourceFixtureSuite')) fail('source connector contracts missing');
if (pkg.version !== '1.0.0') fail('package version must be 1.0.0');
if (!index.includes('name="app-version" content="1.0.0"')) fail('app version metadata missing');

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

if (researchSchema.properties?.workflow_version?.const !== '1.0.0') fail('research workflow schema version mismatch');
if (!researchSchema.required?.includes('research_plan')) fail('research schema must require research_plan');
if (!researchSchema.required?.includes('evidence_matrix')) fail('research schema must require evidence_matrix');
if (!researchSchema.required?.includes('analysis_brief')) fail('research schema must require analysis_brief');
if (!researchSchema.$defs?.analysis_brief) fail('research schema must define analysis_brief');
if (!researchSchema.required?.includes('ai_runs')) fail('research schema must require ai_runs');
if (!researchSchema.$defs?.ai_run) fail('research schema must define ai_run');
if (!researchSchema.$defs?.provider_config) fail('research schema must define provider_config');
if (!researchSchema.$defs?.response_validation) fail('research schema must define response_validation');
if (!researchSchema.$defs?.repair_trace) fail('research schema must define repair_trace');
if (!researchSchema.$defs?.provider_diagnostics) fail('research schema must define provider_diagnostics');
if (!researchSchema.$defs?.provider_fixture_report) fail('research schema must define provider_fixture_report');
if (!researchSchema.$defs?.provider_config) fail('research schema must define hosted provider config');
if (!researchSchema.required?.includes('provider_identity')) fail('research schema must require provider_identity');
if (!researchSchema.required?.includes('provider_billing_policy')) fail('research schema must require provider_billing_policy');
if (!researchSchema.required?.includes('portable_account')) fail('research schema must require portable_account');
if (!researchSchema.required?.includes('privacy_export')) fail('research schema must require privacy_export');
if (!researchSchema.$defs?.provider_identity) fail('research schema must define provider_identity');
if (!researchSchema.$defs?.provider_billing_policy) fail('research schema must define provider_billing_policy');
if (!researchSchema.$defs?.portable_account) fail('research schema must define portable_account');
if (!researchSchema.$defs?.privacy_export) fail('research schema must define privacy_export');
for (const key of ['source_policy','source_diagnostics','source_fixture_report','source_requests','source_runs','source_results','evidence_review_queue','evidence_review_report']) { if (!researchSchema.required?.includes(key)) fail(`research schema must require ${key}`); }
for (const def of ['source_policy','source_request','source_diagnostics','source_fixture_report','source_run','source_result','evidence_review_item','evidence_review_report']) { if (!researchSchema.$defs?.[def]) fail(`research schema must define ${def}`); }
if (researchSchema.$defs?.source_policy?.properties?.live_fetching_enabled?.type !== 'boolean') fail('source policy must model controlled live metadata as boolean');

const files = fs.readdirSync('fixtures').filter((name) => name.endsWith('.json'));
if (!files.length) fail('no JSON fixtures found');
for (const file of files) {
  const data = JSON.parse(read(`fixtures/${file}`));
  for (const key of requiredTop) if (!(key in data)) fail(`${file}: missing ${key}`);
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
for (const tag of [...(index + app + researchApp).matchAll(/<button\b[^>]*>/g)].map((m) => m[0])) {
  if (!/\btype="button"/.test(tag)) fail(`button without explicit type=button: ${tag}`);
}
if (!/\.srOnly/.test(css)) fail('screen-reader utility class missing');
if (!/:focus-visible/.test(css)) fail('focus-visible styling missing');

console.log('QA checks passed.');
process.exit(0);
