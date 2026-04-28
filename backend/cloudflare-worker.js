/*
 * Jarbou3i Research Engine Hosted Backend Proxy v0.25.0-beta
 *
 * Cloudflare Worker contract:
 * - POST /api/provider-task
 * - POST /api/source-task
 * - GET  /api/health
 *
 * Required secret:
 * - OPENAI_API_KEY
 *
 * Optional environment variables:
 * - OPENAI_BASE_URL=https://api.openai.com/v1/chat/completions
 * - OPENAI_MODEL=gpt-4.1-mini
 * - ALLOWED_MODELS=gpt-4.1-mini,gpt-4.1
 * - ALLOWED_ORIGINS=https://your-pages-domain.pages.dev,https://yourdomain.com
 * - MAX_PROMPT_CHARS=30000
 * - MAX_BODY_BYTES=180000
 * - MAX_UPSTREAM_BYTES=400000
 * - PROVIDER_TIMEOUT_MS=25000
 * - RATE_LIMIT_SECONDS=8
 * - AUDIT_LOGS_ENABLED=false
 */

const VERSION = '0.25.0-beta';
const ALLOWED_TASKS = new Set(['plan', 'synthesis', 'repair', 'critique', 'source_discipline']);
const ALLOWED_SOURCE_TASKS = new Set(['source_plan', 'query_plan', 'claim_extraction', 'evidence_scoring', 'cluster_plan']);
const RATE_BUCKETS = globalThis.__JARBOU3I_BACKEND_RATE_BUCKETS__ || new Map();
globalThis.__JARBOU3I_BACKEND_RATE_BUCKETS__ = RATE_BUCKETS;

// structured_error_code_category_retryable
const ERROR_TAXONOMY = Object.freeze({
  cors_origin_not_allowed: ['security', false],
  method_not_allowed: ['validation', false],
  not_found: ['routing', false],
  missing_OPENAI_API_KEY_secret: ['configuration', false],
  request_body_too_large: ['limits', false],
  invalid_json_body: ['validation', false],
  invalid_task: ['validation', false],
  invalid_source_task: ['validation', false],
  prompt_too_short: ['validation', false],
  prompt_too_large: ['limits', false],
  model_not_allowed: ['policy', false],
  rate_limited: ['abuse_control', true],
  upstream_timeout: ['upstream', true],
  upstream_fetch_failed: ['upstream', true],
  upstream_response_too_large: ['limits', true],
  upstream_error: ['upstream', true]
});

const SECRET_TEXT_PATTERNS = Object.freeze([
  /Bearer\s+[A-Za-z0-9._~+/=-]{12,}/gi,
  /sk-[A-Za-z0-9_-]{16,}/gi,
  /ghp_[A-Za-z0-9_]{16,}/gi,
  /github_pat_[A-Za-z0-9_]{20,}/gi,
  /ya29\.[A-Za-z0-9._-]{20,}/gi,
  /(access[_-]?token|refresh[_-]?token|api[_-]?key|authorization)\s*[:=]\s*["'][^"']{8,}["']/gi
]);

function requestId() {
  try { return crypto.randomUUID(); }
  catch (_) { return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`; }
}

function numberEnv(env, key, fallback, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const n = Number(env?.[key]);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function csvEnv(env, key) {
  return String(env?.[key] || '').split(',').map((x) => x.trim()).filter(Boolean);
}

function redactText(value, max = 500) {
  let text = String(value ?? '');
  for (const pattern of SECRET_TEXT_PATTERNS) text = text.replace(pattern, '[REDACTED]');
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function safeDetails(details = {}) {
  const out = {};
  for (const [key, value] of Object.entries(details || {})) {
    if (/prompt|body|content|authorization|token|secret|api[_-]?key/i.test(key)) {
      if (/chars|bytes|length|count|status|ms|id|allowed|limit|retry/i.test(key)) out[key] = value;
      else out[key] = '[REDACTED_FIELD]';
      continue;
    }
    if (typeof value === 'string') out[key] = redactText(value, 300);
    else out[key] = value;
  }
  return out;
}

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...headers
    }
  });
}

function configuredOrigins(env) {
  return csvEnv(env, 'ALLOWED_ORIGINS');
}

function isOriginAllowed(request, env) {
  const origin = request.headers.get('Origin') || '';
  const configured = configuredOrigins(env);
  if (configured.length === 0) return true;
  if (!origin) return true;
  return configured.includes(origin);
}

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const configured = configuredOrigins(env);
  let allowOrigin = '*';
  if (configured.length === 0) allowOrigin = origin || '*';
  else if (origin && configured.includes(origin)) allowOrigin = origin;
  else allowOrigin = configured[0];
  return {
    'access-control-allow-origin': allowOrigin,
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type,x-request-id',
    'vary': 'Origin'
  };
}

function reject(code, status, request, env, details = {}, headers = null) {
  const [category, retryable] = ERROR_TAXONOMY[code] || ['unknown', false];
  const reqId = request.headers.get('x-request-id') || requestId();
  const body = {
    ok: false,
    proxy_version: VERSION,
    error: code,
    error_code: code,
    error_category: category,
    retryable,
    request_id: reqId,
    details: safeDetails(details)
  };
  auditLog(request, env, { event:'reject', request_id:reqId, code, status, category, retryable, details:body.details });
  return json(body, status, headers || corsHeaders(request, env));
}

function auditLog(request, env, event) {
  if (String(env?.AUDIT_LOGS_ENABLED || '').toLowerCase() !== 'true') return;
  const payload = {
    log_type: 'jarbou3i_backend_audit',
    proxy_version: VERSION,
    method: request.method,
    path: (() => { try { return new URL(request.url).pathname; } catch (_) { return 'unknown'; } })(),
    origin_allowed: isOriginAllowed(request, env),
    ...safeDetails(event)
  };
  console.log(JSON.stringify(payload));
}

async function readJsonLimited(request, env) {
  const maxBodyBytes = numberEnv(env, 'MAX_BODY_BYTES', 180000, 1, 2_000_000);
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength && contentLength > maxBodyBytes) {
    return { ok:false, code:'request_body_too_large', status:413, details:{ max_body_bytes:maxBodyBytes, content_length:contentLength } };
  }
  let text = '';
  try { text = await request.text(); }
  catch (error) { return { ok:false, code:'invalid_json_body', status:400, details:{ message:String(error && error.message || error) } }; }
  const bodyBytes = new TextEncoder().encode(text).length;
  if (bodyBytes > maxBodyBytes) return { ok:false, code:'request_body_too_large', status:413, details:{ max_body_bytes:maxBodyBytes, body_bytes:bodyBytes } };
  try { return { ok:true, payload: JSON.parse(text || '{}'), body_bytes: bodyBytes }; }
  catch (_) { return { ok:false, code:'invalid_json_body', status:400, details:{ body_bytes:bodyBytes } }; }
}

function stripSecretFields(payload) {
  if (!payload || typeof payload !== 'object') return payload;
  const clone = structuredClone(payload);
  if (clone.provider_config) {
    delete clone.provider_config.api_key;
    clone.provider_config.remember_key = false;
  }
  if (clone.provider_safety) {
    clone.provider_safety.key_present = false;
    clone.provider_safety.key_exported = false;
    clone.provider_safety.key_storage = 'server_environment_secret';
  }
  delete clone.api_key;
  delete clone.access_token;
  delete clone.refresh_token;
  delete clone.authorization;
  return clone;
}

function clientRateKey(request, task, endpoint) {
  const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.headers.get('Origin') || 'unknown-client';
  return `${endpoint}:${task}:${ip}`;
}

function checkRateLimit(request, env, task, endpoint = 'provider-task') {
  const seconds = numberEnv(env, 'RATE_LIMIT_SECONDS', 8, 0, 3600);
  if (seconds <= 0) return { allowed:true, limit_seconds:0 };
  const now = Date.now();
  const key = clientRateKey(request, task, endpoint);
  const last = RATE_BUCKETS.get(key) || 0;
  const elapsed = (now - last) / 1000;
  if (last && elapsed < seconds) {
    return { allowed:false, retry_after_seconds: Math.ceil(seconds - elapsed), limit_seconds: seconds };
  }
  RATE_BUCKETS.set(key, now);
  if (RATE_BUCKETS.size > 5000) {
    const cutoff = now - 60 * 60 * 1000;
    for (const [k, timestamp] of RATE_BUCKETS.entries()) if (timestamp < cutoff) RATE_BUCKETS.delete(k);
  }
  return { allowed:true, limit_seconds:seconds };
}

function resolveModel(safePayload, env) {
  const model = String(safePayload.provider_config?.model || env.OPENAI_MODEL || 'gpt-4.1-mini');
  const allowed = csvEnv(env, 'ALLOWED_MODELS');
  if (allowed.length && !allowed.includes(model)) return { ok:false, model, allowed_models: allowed };
  return { ok:true, model, allowed_models: allowed };
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort('provider_timeout'), timeoutMs);
  try { return await fetch(url, { ...options, signal: controller.signal }); }
  finally { clearTimeout(timer); }
}

async function limitedResponseText(response, env) {
  const text = await response.text();
  const maxBytes = numberEnv(env, 'MAX_UPSTREAM_BYTES', 400000, 1000, 5_000_000);
  const bytes = new TextEncoder().encode(text).length;
  if (bytes > maxBytes) return { ok:false, code:'upstream_response_too_large', text:'', bytes, maxBytes };
  return { ok:true, text, bytes, maxBytes };
}

async function handleProviderTask(request, env) {
  const headers = corsHeaders(request, env);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (!isOriginAllowed(request, env)) return reject('cors_origin_not_allowed', 403, request, env, { configured_origins: configuredOrigins(env).length }, headers);
  if (request.method !== 'POST') return reject('method_not_allowed', 405, request, env, {}, headers);
  if (!env.OPENAI_API_KEY) return reject('missing_OPENAI_API_KEY_secret', 500, request, env, {}, headers);

  const parsedBody = await readJsonLimited(request, env);
  if (!parsedBody.ok) return reject(parsedBody.code, parsedBody.status, request, env, parsedBody.details, headers);

  const safePayload = stripSecretFields(parsedBody.payload);
  const task = String(safePayload.task || '');
  const prompt = String(safePayload.prompt || '');
  const maxPromptChars = numberEnv(env, 'MAX_PROMPT_CHARS', 30000, 50, 200000);

  if (!ALLOWED_TASKS.has(task)) return reject('invalid_task', 400, request, env, { allowed_tasks: [...ALLOWED_TASKS] }, headers);
  if (!prompt || prompt.length < 50) return reject('prompt_too_short', 400, request, env, { prompt_chars: prompt.length }, headers);
  if (prompt.length > maxPromptChars) return reject('prompt_too_large', 413, request, env, { max_prompt_chars: maxPromptChars, prompt_chars: prompt.length }, headers);

  const modelCheck = resolveModel(safePayload, env);
  if (!modelCheck.ok) return reject('model_not_allowed', 400, request, env, { model:modelCheck.model, allowed_models:modelCheck.allowed_models }, headers);

  const rate = checkRateLimit(request, env, task, 'provider-task');
  if (!rate.allowed) return reject('rate_limited', 429, request, env, rate, { ...headers, 'retry-after': String(rate.retry_after_seconds) });

  const baseUrl = env.OPENAI_BASE_URL || 'https://api.openai.com/v1/chat/completions';
  const model = modelCheck.model;
  const upstreamBody = {
    model,
    temperature: task === 'critique' ? 0.2 : 0.1,
    messages: [
      {
        role: 'system',
        content: 'You are the hosted provider for Jarbou3i Research Engine. Follow the requested response contract exactly. Return JSON only. Do not add markdown.'
      },
      { role: 'user', content: prompt }
    ],
    response_format: { type: 'json_object' }
  };

  const timeoutMs = numberEnv(env, 'PROVIDER_TIMEOUT_MS', 25000, 100, 120000);
  const reqId = request.headers.get('x-request-id') || requestId();
  auditLog(request, env, { event:'provider_task_start', request_id:reqId, task, model, prompt_chars:prompt.length, body_bytes:parsedBody.body_bytes, timeout_ms:timeoutMs, rate_limit_seconds:rate.limit_seconds });

  let upstream;
  try {
    upstream = await fetchWithTimeout(baseUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(upstreamBody)
    }, timeoutMs);
  } catch (error) {
    const message = String(error && error.name || error || '');
    const code = /Abort|timeout|provider_timeout/i.test(message) ? 'upstream_timeout' : 'upstream_fetch_failed';
    return reject(code, code === 'upstream_timeout' ? 504 : 502, request, env, { message, timeout_ms: timeoutMs }, headers);
  }

  const upstreamText = await limitedResponseText(upstream, env);
  if (!upstreamText.ok) return reject(upstreamText.code, 502, request, env, { upstream_bytes:upstreamText.bytes, max_upstream_bytes:upstreamText.maxBytes }, headers);

  let upstreamJson = null;
  try { upstreamJson = JSON.parse(upstreamText.text); }
  catch (_) { upstreamJson = { raw_text: redactText(upstreamText.text, 1000) }; }

  if (!upstream.ok) {
    return reject('upstream_error', upstream.status, request, env, {
      status: upstream.status,
      provider_message: upstreamJson?.error?.message || upstreamJson?.raw_text || 'unknown'
    }, headers);
  }

  const content = upstreamJson?.choices?.[0]?.message?.content || upstreamJson?.output_text || JSON.stringify(upstreamJson);
  let data;
  try { data = JSON.parse(String(content).trim().replace(/^```(?:json)?/i, '').replace(/```$/,'').trim()); }
  catch (error) { data = { raw_text: redactText(content, 5000), parse_error: String(error && error.message || error) }; }

  auditLog(request, env, { event:'provider_task_success', request_id:reqId, task, model, upstream_status:upstream.status, upstream_bytes:upstreamText.bytes, usage_total_tokens:upstreamJson?.usage?.total_tokens || 0 });

  return json({
    ok: true,
    proxy_version: VERSION,
    provider: 'backend_proxy',
    task,
    type: safePayload.response_contract?.type || 'provider_response',
    model,
    request_id: reqId,
    data,
    usage: upstreamJson?.usage || null,
    safety: {
      api_key_exposed: false,
      key_storage: 'server_environment_secret',
      payload_secret_fields_stripped: true,
      prompt_logged: false,
      audit_logs_redacted: true,
      timeout_ms: timeoutMs,
      rate_limit_seconds: rate.limit_seconds,
      model_allowlist_enforced: modelCheck.allowed_models.length > 0,
      max_body_bytes: numberEnv(env, 'MAX_BODY_BYTES', 180000, 1, 2_000_000),
      max_prompt_chars: maxPromptChars,
      max_upstream_bytes: upstreamText.maxBytes
    }
  }, 200, headers);
}

async function handleSourceTask(request, env) {
  const headers = corsHeaders(request, env);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (!isOriginAllowed(request, env)) return reject('cors_origin_not_allowed', 403, request, env, { configured_origins: configuredOrigins(env).length }, headers);
  if (request.method !== 'POST') return reject('method_not_allowed', 405, request, env, {}, headers);

  const parsedBody = await readJsonLimited(request, env);
  if (!parsedBody.ok) return reject(parsedBody.code, parsedBody.status, request, env, parsedBody.details, headers);

  const safePayload = stripSecretFields(parsedBody.payload);
  const task = String(safePayload.task || 'source_plan');
  const connector = String(safePayload.connector || 'manual_mock');
  if (!ALLOWED_SOURCE_TASKS.has(task)) return reject('invalid_source_task', 400, request, env, { allowed_source_tasks: [...ALLOWED_SOURCE_TASKS] }, headers);

  const response = {
    ok:true,
    proxy_version: VERSION,
    endpoint:'source-task',
    connector,
    task,
    live_fetching_enabled:false,
    type: safePayload.task_contract?.type || task,
    data:{
      plan_type: task,
      connector,
      live_fetching_performed:false,
      source_targets: Array.isArray(safePayload.target_sources) ? safePayload.target_sources : [],
      query_count: Array.isArray(safePayload.research_questions) ? safePayload.research_questions.length : 0,
      safety_constraints: safePayload.safety_policy?.prohibited_actions || ['planning-only: no live source fetching'],
      verdict:'backend_source_planning_ready_no_live_fetch'
    },
    safety:{
      api_key_exposed:false,
      source_fetching_performed:false,
      policy:'planning_only',
      body_bytes: parsedBody.body_bytes,
      prompt_logged:false,
      audit_logs_redacted:true
    }
  };
  auditLog(request, env, { event:'source_task_success', task, connector, body_bytes:parsedBody.body_bytes, live_fetching_enabled:false });
  return json(response, 200, headers);
}

export default {
  async fetch(request, env = {}) {
    const headers = corsHeaders(request, env);
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') {
      if (!isOriginAllowed(request, env)) return reject('cors_origin_not_allowed', 403, request, env, { configured_origins: configuredOrigins(env).length }, headers);
      return new Response(null, { status: 204, headers });
    }
    if (url.pathname === '/api/health') {
      if (!isOriginAllowed(request, env)) return reject('cors_origin_not_allowed', 403, request, env, { configured_origins: configuredOrigins(env).length }, headers);
      return json({
        ok:true,
        proxy_version:VERSION,
        status:'healthy',
        hardening:{
          error_taxonomy:'structured',
          cors_allowlist: configuredOrigins(env).length > 0,
          rate_limit_seconds: numberEnv(env, 'RATE_LIMIT_SECONDS', 8, 0, 3600),
          provider_timeout_ms: numberEnv(env, 'PROVIDER_TIMEOUT_MS', 25000, 100, 120000),
          max_body_bytes: numberEnv(env, 'MAX_BODY_BYTES', 180000, 1, 2_000_000),
          max_prompt_chars: numberEnv(env, 'MAX_PROMPT_CHARS', 30000, 50, 200000),
          max_upstream_bytes: numberEnv(env, 'MAX_UPSTREAM_BYTES', 400000, 1000, 5_000_000),
          audit_logs_enabled: String(env.AUDIT_LOGS_ENABLED || '').toLowerCase() === 'true',
          audit_logs_redacted:true,
          model_allowlist_configured: csvEnv(env, 'ALLOWED_MODELS').length > 0
        }
      }, 200, headers);
    }
    if (url.pathname === '/api/provider-task') return handleProviderTask(request, env);
    if (url.pathname === '/api/source-task') return handleSourceTask(request, env);
    return reject('not_found', 404, request, env, {}, headers);
  }
};
