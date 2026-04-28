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
  ALLOWED_MODELS: 'gpt-test,gpt-safe',
  MAX_PROMPT_CHARS: '30000',
  MAX_BODY_BYTES: '180000',
  MAX_UPSTREAM_BYTES: '400000',
  PROVIDER_TIMEOUT_MS: '25000',
  RATE_LIMIT_SECONDS: '0'
};

function providerRequest(body, extraHeaders = {}) {
  return new Request('https://worker.local/api/provider-task', {
    method: 'POST',
    headers: { 'content-type': 'application/json', Origin: 'https://example.pages.dev', ...extraHeaders },
    body: JSON.stringify(body)
  });
}

let response = await worker.fetch(new Request('https://worker.local/api/health', {
  method: 'GET',
  headers: { Origin: 'https://example.pages.dev' }
}), baseEnv);
if (response.status !== 200) fail(`health status expected 200, got ${response.status}`);
let body = await json(response);
if (!body.ok || body.proxy_version !== '0.25.0-beta') fail('health response missing expected version/ok fields');
if (body.hardening?.error_taxonomy !== 'structured') fail('health response missing hardening summary');
if (response.headers.get('access-control-allow-origin') !== 'https://example.pages.dev') fail('health CORS origin mismatch');

response = await worker.fetch(new Request('https://worker.local/api/health', {
  method: 'GET',
  headers: { Origin: 'https://evil.example' }
}), baseEnv);
body = await json(response);
if (response.status !== 403 || body.error !== 'cors_origin_not_allowed' || body.error_category !== 'security') fail('blocked CORS origin should return structured security error');

response = await worker.fetch(new Request('https://worker.local/api/provider-task', {
  method: 'OPTIONS',
  headers: { Origin: 'https://example.pages.dev' }
}), baseEnv);
if (response.status !== 204) fail(`OPTIONS expected 204, got ${response.status}`);

response = await worker.fetch(providerRequest({ task: 'plan', prompt: 'x'.repeat(80) }), { ...baseEnv, OPENAI_API_KEY: '' });
body = await json(response);
if (response.status !== 500 || body.error !== 'missing_OPENAI_API_KEY_secret' || body.error_code !== 'missing_OPENAI_API_KEY_secret') fail('missing secret should be rejected with explicit structured error');

response = await worker.fetch(providerRequest({ task: 'not_allowed', prompt: 'x'.repeat(80) }), baseEnv);
body = await json(response);
if (response.status !== 400 || body.error !== 'invalid_task' || body.error_category !== 'validation') fail('invalid task should be rejected');

response = await worker.fetch(providerRequest({ task: 'plan', provider_config: { model: 'gpt-not-allowed' }, prompt: 'x'.repeat(80) }), baseEnv);
body = await json(response);
if (response.status !== 400 || body.error !== 'model_not_allowed' || body.error_category !== 'policy') fail('disallowed model should be rejected');

response = await worker.fetch(providerRequest({ task: 'plan', prompt: 'x'.repeat(101) }), { ...baseEnv, MAX_PROMPT_CHARS: '100' });
body = await json(response);
if (response.status !== 413 || body.error !== 'prompt_too_large') fail('oversized prompt should be rejected');

response = await worker.fetch(new Request('https://worker.local/api/source-task', {
  method: 'POST',
  headers: { 'content-type': 'application/json', Origin: 'https://example.pages.dev' },
  body: JSON.stringify({
    request_version: '0.25.0-beta',
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
          plan_version: '0.25.0-beta',
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
  response = await worker.fetch(providerRequest({
    provider: 'backend_proxy',
    task: 'plan',
    response_contract: { type: 'research_plan' },
    provider_config: { api_key: 'SHOULD_NOT_LEAVE_BROWSER', model: 'gpt-test', remember_key: true },
    provider_safety: { key_present: true, key_exported: true },
    prompt: 'Generate a strict research plan for the Worker smoke-test topic. Return JSON only and include questions, target actors, target sources, keywords, counter-evidence targets, and early-warning indicators.'
  }), baseEnv);
} finally {
  globalThis.fetch = originalFetch;
}

body = await json(response);
if (response.status !== 200 || !body.ok) fail(`valid provider task should pass, got ${response.status}`);
if (body.proxy_version !== '0.25.0-beta') fail('provider task response version mismatch');
if (body.provider !== 'backend_proxy') fail('provider task must identify backend_proxy');
if (!body.request_id) fail('provider task should include request_id');
if (body.safety?.api_key_exposed !== false) fail('provider task must report api_key_exposed:false');
if (body.safety?.payload_secret_fields_stripped !== true) fail('provider task must report stripped payload secrets');
if (body.safety?.prompt_logged !== false || body.safety?.audit_logs_redacted !== true) fail('provider task must declare redacted audit policy');
if (body.safety?.model_allowlist_enforced !== true) fail('provider task must report model allowlist enforcement when configured');
if (JSON.stringify(body).includes('SHOULD_NOT_LEAVE_BROWSER')) fail('response leaked client-side secret field');
if (!capturedUpstream || capturedUpstream.url !== baseEnv.OPENAI_BASE_URL) fail('upstream fetch was not called with configured URL');
if (String(capturedUpstream.options.body || '').includes('SHOULD_NOT_LEAVE_BROWSER')) fail('upstream request leaked client-side secret field');
if (body.data?.topic !== 'Smoke test topic') fail('upstream JSON data was not returned correctly');
if (body.usage?.total_tokens !== 30) fail('usage passthrough missing');

// Configurable in-isolate rate limiting: first valid task passes, second identical client/task is rejected.
let rateCalls = 0;
globalThis.fetch = async () => {
  rateCalls += 1;
  return new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify({ ok: true }) } }] }), { status: 200 });
};
try {
  const rateEnv = { ...baseEnv, RATE_LIMIT_SECONDS: '60', ALLOWED_MODELS: '', OPENAI_MODEL: 'gpt-test' };
  const ratePayload = { task: 'plan', prompt: 'Rate-limit smoke prompt long enough to pass validation and reach the upstream once.' };
  response = await worker.fetch(providerRequest(ratePayload, { 'CF-Connecting-IP': '198.51.100.10' }), rateEnv);
  if (response.status !== 200) fail(`first rate-limit request should pass, got ${response.status}`);
  response = await worker.fetch(providerRequest(ratePayload, { 'CF-Connecting-IP': '198.51.100.10' }), rateEnv);
  body = await json(response);
  if (response.status !== 429 || body.error !== 'rate_limited' || body.retryable !== true) fail('second rate-limit request should receive retryable 429');
  if (rateCalls !== 1) fail('rate-limited second request should not reach upstream');
} finally {
  globalThis.fetch = originalFetch;
}

// Provider timeout should become a structured retryable upstream error.
globalThis.fetch = async (_url, options = {}) => new Promise((resolve, reject) => {
  options.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
});
try {
  response = await worker.fetch(providerRequest({ task: 'plan', prompt: 'Timeout smoke prompt long enough to pass validation and force the configured timeout path.' }, { 'CF-Connecting-IP': '198.51.100.20' }), { ...baseEnv, PROVIDER_TIMEOUT_MS: '100', RATE_LIMIT_SECONDS: '0', ALLOWED_MODELS: '' });
  body = await json(response);
  if (response.status !== 504 || body.error !== 'upstream_timeout' || body.retryable !== true) fail('provider timeout should return retryable 504 upstream_timeout');
} finally {
  globalThis.fetch = originalFetch;
}

// Redacted metadata-only audit logging must not include prompts or secrets.
let logs = [];
const originalLog = console.log;
console.log = (value) => { logs.push(String(value)); };
globalThis.fetch = async () => new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify({ ok: true }) } }] }), { status: 200 });
try {
  await worker.fetch(providerRequest({
    task: 'plan',
    provider_config: { api_key: 'SHOULD_NOT_LEAVE_BROWSER', model: 'gpt-test' },
    prompt: 'Audit smoke prompt that must never appear in metadata-only Worker logs. It is deliberately long enough to pass validation.'
  }, { 'CF-Connecting-IP': '198.51.100.30' }), { ...baseEnv, AUDIT_LOGS_ENABLED: 'true', RATE_LIMIT_SECONDS: '0' });
} finally {
  globalThis.fetch = originalFetch;
  console.log = originalLog;
}
const joinedLogs = logs.join('\n');
if (!joinedLogs.includes('jarbou3i_backend_audit')) fail('audit logging enabled should write metadata event');
if (joinedLogs.includes('Audit smoke prompt') || joinedLogs.includes('SHOULD_NOT_LEAVE_BROWSER') || joinedLogs.includes(baseEnv.OPENAI_API_KEY)) fail('audit logs leaked prompt or secret content');
if (!joinedLogs.includes('prompt_chars')) fail('audit logs should include prompt length metadata');

console.log('Backend Worker smoke checks passed.');
process.exit(0);
