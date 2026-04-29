import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const searchModule = fs.readFileSync('src/research/search-provider-abstraction.js', 'utf8');
const sourceModule = fs.readFileSync('src/research/source-connectors.js', 'utf8');
const workerSource = fs.readFileSync('backend/cloudflare-worker.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('src/research-engine.js', 'utf8');
const schema = JSON.parse(fs.readFileSync('schema/research-workflow.schema.json', 'utf8'));
const fixture = JSON.parse(fs.readFileSync('fixtures/research/sample-research-workflow-en.json', 'utf8'));

for (const token of [
  'web_search_api',
  'SEARCH_PROVIDERS',
  'buildSearchQueryBudget',
  'buildWebSearchQueryPlan',
  'mockWebSearchResponse',
  'web_search_abstraction_ready_no_live_fetch',
  'evidence_review_queue_required'
]) assert.ok(searchModule.includes(token) || sourceModule.includes(token) || workerSource.includes(token), `missing web search token: ${token}`);

assert.ok(index.includes('value="web_search_api"'), 'source connector select must expose web_search_api');
assert.ok(index.includes('id="searchProviderSelect"'), 'search provider selector missing');
assert.ok(index.includes('id="searchMaxQueries"'), 'search query budget input missing');
assert.ok(index.includes('src="src/research/search-provider-abstraction.js" defer'), 'search abstraction module missing from index');
assert.ok(app.includes('searchProviderIdentity'), 'research packet must export search provider identity');
assert.ok(app.includes('searchQueryBudget'), 'research packet must export search query budget');
assert.ok(app.includes('searchPolicyReport'), 'research packet must export search policy');
assert.ok(workerSource.includes('web_search_provider_abstraction_result'), 'backend must understand web search abstraction source task');
assert.equal(schema.properties.workflow_version.const, '1.0.0');
for (const key of ['search_provider_identity','search_query_budget','search_policy']) {
  assert.ok(schema.required.includes(key), `schema must require ${key}`);
  assert.ok(schema.properties[key], `schema must expose ${key}`);
}
assert.equal(fixture.search_provider_identity.provider_id, 'mock_search');
assert.equal(fixture.search_provider_identity.key_exported, false);
assert.equal(fixture.search_query_budget.live_search_enabled, false);
assert.equal(fixture.search_policy.live_search_enabled, false);
assert.equal(fixture.search_policy.verdict, 'web_search_abstraction_ready_no_live_fetch');

const context = { window: {}, console };
context.window.Jarbou3iResearchModules = {};
vm.createContext(context);
vm.runInContext(searchModule, context, { filename: 'src/research/search-provider-abstraction.js' });
vm.runInContext(sourceModule, context, { filename: 'src/research/source-connectors.js' });
const abstraction = context.window.Jarbou3iResearchModules.searchProviderAbstraction;
const connectors = context.window.Jarbou3iResearchModules.sourceConnectors;

const identity = abstraction.searchProviderIdentity('brave_search_api', { version:'1.0.0' });
assert.equal(identity.provider_id, 'brave_search_api');
assert.equal(identity.live_enabled, false);
assert.equal(identity.key_exported, false);
assert.equal(identity.raw_token_exported, false);
assert.equal(identity.evidence_gate, 'evidence_review_queue_required');

const budget = abstraction.buildSearchQueryBudget({ version:'1.0.0', max_queries:99, max_results_per_query:99, counter_evidence_queries:4 });
assert.equal(budget.max_queries, 20, 'budget caps max queries');
assert.equal(budget.max_results_per_query, 20, 'budget caps per-query results');
assert.equal(budget.live_search_enabled, false);

const req = connectors.buildSourceTaskRequest({
  version:'1.0.0',
  connector:'web_search_api',
  task:'query_plan',
  topic:'AI regulation in Europe',
  context:'2024-2026',
  connector_options:{ search_provider:'tavily_search_api', max_queries:5, counter_evidence_queries:2 }
});
assert.equal(req.connector, 'web_search_api');
assert.equal(req.live_fetching_enabled, false);
assert.equal(req.privacy_mode, 'web_search_abstraction_dry_run');
assert.equal(req.web_search.provider_identity.provider_id, 'tavily_search_api');
assert.equal(req.web_search.query_budget.max_queries, 5);
const response = connectors.mockSourceTaskResponse(req);
assert.equal(response.ok, true);
assert.equal(response.data.live_search_performed, false);
assert.equal(response.data.query_plan.review_gate, 'evidence_review_queue_required');
assert.ok(response.data.query_plan.queries.some((q) => q.purpose === 'counter_evidence'), 'query plan must include counter-evidence queries');
const diagnostics = connectors.sourceDiagnostics({ evidence_matrix:[], workflow_version:'1.0.0' }, req, response);
assert.equal(diagnostics.search_diagnostics.provider_id, 'tavily_search_api');
assert.equal(diagnostics.search_diagnostics.live_search_enabled, false);

const workerUrl = pathToFileURL(path.resolve('backend/cloudflare-worker.js')).href;
const worker = (await import(workerUrl + `?websearch=${Date.now()}`)).default;
const env = { ALLOWED_ORIGINS:'https://example.pages.dev', RATE_LIMIT_SECONDS:'0' };
const sourceRequest = new Request('https://worker.local/api/source-task', { method:'POST', headers:{'content-type':'application/json', Origin:'https://example.pages.dev'}, body:JSON.stringify(req) });
const workerResponse = await worker.fetch(sourceRequest, env);
const body = await workerResponse.json();
assert.equal(workerResponse.status, 200);
assert.equal(body.ok, true);
assert.equal(body.connector, 'web_search_api');
assert.equal(body.proxy_version, '1.0.0');
assert.equal(body.live_fetching_enabled, false);
assert.equal(body.safety.live_search_enabled, false);
assert.equal(body.safety.search_api_key_exposed, false);
assert.equal(body.data.review_gate, 'evidence_review_queue_required');
assert.ok(body.data.query_plan.queries.some((q) => q.purpose === 'counter_evidence'));

console.log('Web search provider abstraction checks passed.');
process.exit(0);
