import fs from 'node:fs';
import vm from 'node:vm';

const fail = (message) => {
  console.error(`Source planning check failed: ${message}`);
  process.exit(1);
};
const read = (file) => fs.readFileSync(file, 'utf8');

const sourceModule = read('src/research/source-connectors.js');
const index = read('index.html');
const researchApp = read('src/research-engine.js');
const schema = JSON.parse(read('schema/research-workflow.schema.json'));
const fixture = JSON.parse(read('fixtures/research/sample-research-workflow-en.json'));

try { new vm.Script(sourceModule, { filename: 'src/research/source-connectors.js' }); }
catch (error) { fail(`source-connectors syntax error: ${error.message}`); }

for (const token of [
  'github_public_repo',
  'web_search_api',
  'web_search_abstraction_ready_no_live_fetch',
  'parseGitHubRepoRef',
  'SOURCE_CONNECTORS',
  'SOURCE_TASKS',
  'sourcePolicy',
  'buildSourceTaskRequest',
  'mockSourceTaskResponse',
  'sourceDiagnostics',
  'runSourceFixtureSuite'
]) {
  if (!sourceModule.includes(token)) fail(`source module missing token: ${token}`);
}
if (!index.includes('src="src/research/source-connectors.js" defer')) fail('source connectors module missing from index');
if (!index.includes('id="sourcePlanningOutput"')) fail('source planning UI output missing');
if (!index.includes('id="buildSourceTaskBtn"')) fail('source task button missing');
if (!index.includes('value="github_public_repo"')) fail('GitHub public connector option missing');
if (!index.includes('value="web_search_api"')) fail('web search connector option missing');
if (!index.includes('id="searchProviderSelect"')) fail('search provider selector missing');
if (!index.includes('id="githubRepoInput"')) fail('GitHub repo input missing');
if (!index.includes('id="sourceBackendEndpoint"')) fail('source backend endpoint input missing');
if (!researchApp.includes('runSourceTask')) fail('research app missing source task runner');
if (!researchApp.includes('source_policy')) fail('research packet missing source policy support');
if (!researchApp.includes('source_fixture_report')) fail('research packet missing source fixture support');
if (!researchApp.includes('sourcePlanningScore')) fail('quality gate missing source planning score');
if (schema.properties.workflow_version.const !== '1.0.3') fail('schema workflow version mismatch');
for (const key of ['source_policy','source_diagnostics','source_fixture_report','source_requests','source_runs','source_results','search_provider_identity','search_query_budget','search_policy']) {
  if (!schema.required.includes(key)) fail(`research schema must require ${key}`);
  if (!schema.properties[key]) fail(`research schema missing property ${key}`);
}
for (const def of ['source_policy','source_request','source_diagnostics','source_fixture_report','source_run','source_result','search_provider_identity','search_query_budget','search_policy']) {
  if (!schema.$defs[def]) fail(`research schema missing definition ${def}`);
}
if (schema.$defs.source_policy.properties.live_fetching_enabled.type !== 'boolean') fail('source policy must allow boolean live_fetching_enabled for controlled connectors');
if (fixture.workflow_version !== '1.0.3') fail('fixture version mismatch');
if (!fixture.source_policy || fixture.source_policy.live_fetching_enabled !== false) fail('fixture source policy must be planning-only');
if (!Array.isArray(fixture.source_requests) || !fixture.source_requests.length) fail('fixture must include source_requests');
if (!fixture.source_fixture_report || fixture.source_fixture_report.fail_count !== 0) fail('fixture source fixture report must pass');
if (!Array.isArray(fixture.source_results)) fail('fixture must include source_results array');
if (!fixture.search_provider_identity || fixture.search_provider_identity.provider_id !== 'mock_search' || fixture.search_provider_identity.key_exported !== false) fail('fixture must include safe search provider identity');
if (!fixture.search_query_budget || fixture.search_query_budget.live_search_enabled !== false) fail('fixture must include no-live search query budget');
if (!fixture.search_policy || fixture.search_policy.verdict !== 'web_search_abstraction_ready_no_live_fetch') fail('fixture must include web search abstraction policy');
console.log('Source planning checks passed.');
process.exit(0);
