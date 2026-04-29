import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const sourceModule = fs.readFileSync('src/research/source-connectors.js', 'utf8');
const workerSource = fs.readFileSync('backend/cloudflare-worker.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('src/research-engine.js', 'utf8');

for (const token of [
  'github_public_repo',
  'parseGitHubRepoRef',
  'controlled_backend_public_metadata_fetch',
  'evidence_review_queue_required',
  'github_public_metadata_fetched_review_required'
]) assert.ok(sourceModule.includes(token) || workerSource.includes(token) || app.includes(token), `missing GitHub connector token: ${token}`);
assert.ok(index.includes('value="github_public_repo"'), 'source connector select must expose github_public_repo');
assert.ok(index.includes('id="githubRepoInput"'), 'GitHub repo input missing');
assert.ok(index.includes('id="sourceBackendEndpoint"'), 'source backend endpoint input missing');
assert.ok(app.includes('queueSourceConnectorCandidates'), 'app must queue connector candidates for review');
assert.ok(app.includes('source_results'), 'app must store source_results ledger');
assert.ok(workerSource.includes('SOURCE_GITHUB_ENABLED'), 'worker must expose GitHub connector enable flag');
assert.ok(workerSource.includes('GITHUB_API_BASE_URL'), 'worker must allow GitHub API base override for tests/deployments');
assert.ok(workerSource.includes('GITHUB_TOKEN'), 'worker may use server-side GitHub token without exporting it');

const context = { window: {}, console };
context.window.Jarbou3iResearchModules = {};
vm.createContext(context);
vm.runInContext(sourceModule, context, { filename: 'src/research/source-connectors.js' });
const connectors = context.window.Jarbou3iResearchModules.sourceConnectors;
assert.equal(connectors.SOURCE_CONNECTORS.github_public_repo.live_fetching, true);
assert.equal(connectors.parseGitHubRepoRef('octocat/Hello-World').full_name, 'octocat/Hello-World');
assert.equal(connectors.parseGitHubRepoRef('https://github.com/mvanhorn/last30days-skill').full_name, 'mvanhorn/last30days-skill');
const req = connectors.buildSourceTaskRequest({ version:'1.0.0', connector:'github_public_repo', github_repo:'octocat/Hello-World', topic:'GitHub source test', task:'source_plan' });
assert.equal(req.connector, 'github_public_repo');
assert.equal(req.live_fetching_enabled, true);
assert.equal(req.safety_policy.verdict, 'controlled_live_metadata_review_gated');
assert.equal(req.connector_options.github_repo, 'octocat/Hello-World');
const local = connectors.mockSourceTaskResponse(req);
assert.equal(local.data.backend_required, true);
assert.equal(local.data.live_fetching_performed, false);

const workerUrl = pathToFileURL(path.resolve('backend/cloudflare-worker.js')).href;
const worker = (await import(workerUrl + `?github=${Date.now()}`)).default;
const env = {
  OPENAI_API_KEY: '',
  GITHUB_API_BASE_URL: 'https://api.github.test',
  ALLOWED_ORIGINS: 'https://example.pages.dev',
  RATE_LIMIT_SECONDS: '0',
  SOURCE_TIMEOUT_MS: '5000',
  SOURCE_GITHUB_RELEASE_LIMIT: '2'
};
function sourceRequest(body){
  return new Request('https://worker.local/api/source-task', { method:'POST', headers:{'content-type':'application/json', Origin:'https://example.pages.dev'}, body:JSON.stringify(body) });
}
const originalFetch = globalThis.fetch;
const calls = [];
globalThis.fetch = async (url, options = {}) => {
  calls.push({url:String(url), authorization:String(options.headers?.authorization || '')});
  if (String(url).endsWith('/repos/octocat/Hello-World')) {
    return new Response(JSON.stringify({
      full_name:'octocat/Hello-World', html_url:'https://github.com/octocat/Hello-World', description:'Fixture repo', stargazers_count:42, forks_count:7, open_issues_count:1, default_branch:'main', language:'JavaScript', created_at:'2020-01-01T00:00:00Z', updated_at:'2026-01-02T00:00:00Z', pushed_at:'2026-01-03T00:00:00Z', archived:false, disabled:false, visibility:'public'
    }), {status:200, headers:{'content-type':'application/json'}});
  }
  if (String(url).includes('/releases')) {
    return new Response(JSON.stringify([{ id:1, tag_name:'v1.0.0', name:'v1.0.0', draft:false, prerelease:false, created_at:'2026-01-04T00:00:00Z', published_at:'2026-01-05T00:00:00Z', html_url:'https://github.com/octocat/Hello-World/releases/tag/v1.0.0' }]), {status:200, headers:{'content-type':'application/json'}});
  }
  if (String(url).includes('/languages')) {
    return new Response(JSON.stringify({ JavaScript:1000, HTML:200 }), {status:200, headers:{'content-type':'application/json'}});
  }
  return new Response(JSON.stringify({message:'not found'}), {status:404});
};
let response;
try {
  response = await worker.fetch(sourceRequest({ connector:'github_public_repo', task:'source_plan', connector_options:{ github_repo:'octocat/Hello-World' }, topic:'GitHub source test' }), env);
} finally {
  globalThis.fetch = originalFetch;
}
const body = await response.json();
assert.equal(response.status, 200);
assert.equal(body.ok, true);
assert.equal(body.proxy_version, '1.0.0');
assert.equal(body.connector, 'github_public_repo');
assert.equal(body.live_fetching_enabled, true);
assert.equal(body.safety.source_fetching_performed, true);
assert.equal(body.safety.public_metadata_only, true);
assert.equal(body.safety.github_token_exposed, false);
assert.equal(body.data.review_gate, 'evidence_review_queue_required');
assert.ok(body.data.evidence_candidates.length >= 2, 'GitHub connector should generate review candidates');
assert.ok(body.data.evidence_candidates.every((item) => item.source_url && item.source_date && item.notes.includes('Review before promotion')), 'candidates must preserve source metadata and review gating');
assert.ok(calls.every((call) => !call.authorization), 'unauthenticated public GitHub fetch should not send authorization by default');

response = await worker.fetch(sourceRequest({ connector:'github_public_repo', task:'source_plan', connector_options:{ github_repo:'' } }), env);
const errorBody = await response.json();
assert.equal(response.status, 400);
assert.equal(errorBody.error_code, 'github_repo_required');

console.log('GitHub source connector checks passed.');
process.exit(0);
