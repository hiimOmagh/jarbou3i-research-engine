import { pathToFileURL } from 'node:url';
import path from 'node:path';

const fail = (message) => {
  console.error(`Backend Worker smoke failed: ${message}`);
  process.exit(1);
};

const workerUrl = pathToFileURL(path.resolve('backend/cloudflare-worker.js')).href;
const mod = await import(workerUrl + `?smoke=${Date.now()}`);
const worker = mod.default;
if (!worker || typeof worker.fetch !== 'function') fail('worker default export must expose fetch(request, env)');

const json = async (response) => {
  const text = await response.text();
  try { return JSON.parse(text); }
  catch (error) { fail(`response is not JSON: ${text.slice(0, 200)}`); }
};

const baseEnv = {
  OPENAI_API_KEY: 'sk-test-server-secret',
  OPENAI_BASE_URL: 'https://mock-upstream.local/v1/chat/completions',
  OPENAI_MODEL: 'gpt-test',
  ALLOWED_ORIGINS: 'https://example.pages.dev',
  MAX_PROMPT_CHARS: '30000',
  MAX_BODY_BYTES: '180000'
};

let response = await worker.fetch(new Request('https://worker.local/api/health', {
  method: 'GET',
  headers: { Origin: 'https://example.pages.dev' }
}), baseEnv);
if (response.status !== 200) fail(`health status expected 200, got ${response.status}`);
let body = await json(response);
if (!body.ok || body.proxy_version !== '0.24.0-beta') fail('health response missing expected version/ok fields');
if (response.headers.get('access-control-allow-origin') !== 'https://example.pages.dev') fail('health CORS origin mismatch');

response = await worker.fetch(new Request('https://worker.local/api/provider-task', {
  method: 'OPTIONS',
  headers: { Origin: 'https://example.pages.dev' }
}), baseEnv);
if (response.status !== 204) fail(`OPTIONS expected 204, got ${response.status}`);

response = await worker.fetch(new Request('https://worker.local/api/provider-task', {
  method: 'POST',
  headers: { 'content-type': 'application/json', Origin: 'https://example.pages.dev' },
  body: JSON.stringify({ task: 'plan', prompt: 'x'.repeat(80) })
}), { ...baseEnv, OPENAI_API_KEY: '' });
body = await json(response);
if (response.status !== 500 || body.error !== 'missing_OPENAI_API_KEY_secret') fail('missing secret should be rejected with explicit error');

response = await worker.fetch(new Request('https://worker.local/api/provider-task', {
  method: 'POST',
  headers: { 'content-type': 'application/json', Origin: 'https://example.pages.dev' },
  body: JSON.stringify({ task: 'not_allowed', prompt: 'x'.repeat(80) })
}), baseEnv);
body = await json(response);
if (response.status !== 400 || body.error !== 'invalid_task') fail('invalid task should be rejected');

response = await worker.fetch(new Request('https://worker.local/api/provider-task', {
  method: 'POST',
  headers: { 'content-type': 'application/json', Origin: 'https://example.pages.dev' },
  body: JSON.stringify({ task: 'plan', prompt: 'x'.repeat(101) })
}), { ...baseEnv, MAX_PROMPT_CHARS: '100' });
body = await json(response);
if (response.status !== 413 || body.error !== 'prompt_too_large') fail('oversized prompt should be rejected');


response = await worker.fetch(new Request('https://worker.local/api/source-task', {
  method: 'POST',
  headers: { 'content-type': 'application/json', Origin: 'https://example.pages.dev' },
  body: JSON.stringify({
    request_version: '0.24.0-beta',
    connector: 'manual_mock',
    task: 'source_plan',
    live_fetching_enabled: false,
    topic: 'Smoke source topic',
    context: 'Worker source planning smoke',
    research_questions: ['What sources are needed?', 'What would disconfirm the thesis?'],
    target_sources: ['official documents', 'news chronology'],
    safety_policy: { prohibited_actions: ['no scraping'], verdict: 'safe_planning_layer_only' }
  })
}), { ...baseEnv, OPENAI_API_KEY: '' });
body = await json(response);
if (response.status !== 200 || !body.ok) fail('source-task should work without OPENAI_API_KEY because it is planning-only');
if (body.endpoint !== 'source-task') fail('source-task endpoint marker missing');
if (body.live_fetching_enabled !== false || body.safety?.source_fetching_performed !== false) fail('source-task must be planning-only and perform no fetching');
if (body.data?.verdict !== 'backend_source_planning_ready_no_live_fetch') fail('source-task verdict mismatch');

response = await worker.fetch(new Request('https://worker.local/api/source-task', {
  method: 'POST',
  headers: { 'content-type': 'application/json', Origin: 'https://example.pages.dev' },
  body: JSON.stringify({ task: 'crawl_everything', connector: 'manual_mock' })
}), baseEnv);
body = await json(response);
if (response.status !== 400 || body.error !== 'invalid_source_task') fail('invalid source task should be rejected');


let capturedUpstream = null;
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, options = {}) => {
  capturedUpstream = { url: String(url), options };
  const auth = String(options.headers?.authorization || options.headers?.Authorization || '');
  if (auth !== `Bearer ${baseEnv.OPENAI_API_KEY}`) return new Response(JSON.stringify({ error: { message: 'bad auth in smoke mock' } }), { status: 401 });
  const upstreamBody = JSON.parse(String(options.body || '{}'));
  if (upstreamBody.model !== 'gpt-test') return new Response(JSON.stringify({ error: { message: 'bad model in smoke mock' } }), { status: 400 });
  return new Response(JSON.stringify({
    choices: [{
      message: {
        content: JSON.stringify({
          plan_version: '0.24.0-beta',
          topic: 'Smoke test topic',
          context: 'Worker smoke test',
          questions: ['What changed?', 'Who benefits?', 'What would disprove the thesis?'],
          target_actors: ['Actor A'],
          target_sources: ['official', 'academic', 'news'],
          keywords: ['smoke', 'worker', 'proxy'],
          counter_evidence_targets: ['Contrary evidence'],
          early_warning_indicators: ['Indicator movement']
        })
      }
    }],
    usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 }
  }), { status: 200, headers: { 'content-type': 'application/json' } });
};

try {
  response = await worker.fetch(new Request('https://worker.local/api/provider-task', {
    method: 'POST',
    headers: { 'content-type': 'application/json', Origin: 'https://example.pages.dev' },
    body: JSON.stringify({
      provider: 'backend_proxy',
      task: 'plan',
      response_contract: { type: 'research_plan' },
      provider_config: { api_key: 'SHOULD_NOT_LEAVE_BROWSER', model: 'gpt-test', remember_key: true },
      provider_safety: { key_present: true, key_exported: true },
      prompt: 'Generate a strict research plan for the Worker smoke-test topic. Return JSON only and include questions, target actors, target sources, keywords, counter-evidence targets, and early-warning indicators.'
    })
  }), baseEnv);
} finally {
  globalThis.fetch = originalFetch;
}

body = await json(response);
if (response.status !== 200 || !body.ok) fail(`valid provider task should pass, got ${response.status}`);
if (body.proxy_version !== '0.24.0-beta') fail('provider task response version mismatch');
if (body.provider !== 'backend_proxy') fail('provider task must identify backend_proxy');
if (body.safety?.api_key_exposed !== false) fail('provider task must report api_key_exposed:false');
if (body.safety?.payload_secret_fields_stripped !== true) fail('provider task must report stripped payload secrets');
if (JSON.stringify(body).includes('SHOULD_NOT_LEAVE_BROWSER')) fail('response leaked client-side secret field');
if (!capturedUpstream || capturedUpstream.url !== baseEnv.OPENAI_BASE_URL) fail('upstream fetch was not called with configured URL');
if (String(capturedUpstream.options.body || '').includes('SHOULD_NOT_LEAVE_BROWSER')) fail('upstream request leaked client-side secret field');
if (body.data?.topic !== 'Smoke test topic') fail('upstream JSON data was not returned correctly');
if (body.usage?.total_tokens !== 30) fail('usage passthrough missing');

console.log('Backend Worker smoke checks passed.');
process.exit(0);
