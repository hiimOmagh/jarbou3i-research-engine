/*
 * Jarbou3i Research Engine Hosted Backend Proxy v0.18.0-beta
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
 * - ALLOWED_ORIGINS=https://your-pages-domain.pages.dev,https://yourdomain.com
 * - MAX_PROMPT_CHARS=30000
 * - RATE_LIMIT_SECONDS=8
 */

const VERSION = '0.18.0-beta';
const ALLOWED_TASKS = new Set(['plan', 'synthesis', 'repair', 'critique', 'source_discipline']);
const ALLOWED_SOURCE_TASKS = new Set(['source_plan', 'query_plan', 'claim_extraction', 'evidence_scoring', 'cluster_plan']);

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

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const configured = String(env.ALLOWED_ORIGINS || '').split(',').map((x) => x.trim()).filter(Boolean);
  const allowOrigin = configured.length === 0 ? origin || '*' : (configured.includes(origin) ? origin : configured[0]);
  return {
    'access-control-allow-origin': allowOrigin,
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type',
    'vary': 'Origin'
  };
}

function reject(message, status, request, env, details = {}) {
  return json({ ok:false, proxy_version:VERSION, error:message, details }, status, corsHeaders(request, env));
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
  return clone;
}

async function handleProviderTask(request, env) {
  const headers = corsHeaders(request, env);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') return reject('method_not_allowed', 405, request, env);
  if (!env.OPENAI_API_KEY) return reject('missing_OPENAI_API_KEY_secret', 500, request, env);

  const contentLength = Number(request.headers.get('content-length') || 0);
  const maxBodyBytes = Number(env.MAX_BODY_BYTES || 180000);
  if (contentLength && contentLength > maxBodyBytes) return reject('request_body_too_large', 413, request, env, { max_body_bytes: maxBodyBytes });

  let payload;
  try { payload = await request.json(); }
  catch (error) { return reject('invalid_json_body', 400, request, env); }

  const safePayload = stripSecretFields(payload);
  const task = String(safePayload.task || '');
  const prompt = String(safePayload.prompt || '');
  const maxPromptChars = Number(env.MAX_PROMPT_CHARS || 30000);

  if (!ALLOWED_TASKS.has(task)) return reject('invalid_task', 400, request, env, { allowed_tasks: [...ALLOWED_TASKS] });
  if (!prompt || prompt.length < 50) return reject('prompt_too_short', 400, request, env);
  if (prompt.length > maxPromptChars) return reject('prompt_too_large', 413, request, env, { max_prompt_chars: maxPromptChars });

  const baseUrl = env.OPENAI_BASE_URL || 'https://api.openai.com/v1/chat/completions';
  const model = safePayload.provider_config?.model || env.OPENAI_MODEL || 'gpt-4.1-mini';
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

  let upstream;
  try {
    upstream = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(upstreamBody)
    });
  } catch (error) {
    return reject('upstream_fetch_failed', 502, request, env, { message: String(error && error.message || error) });
  }

  let upstreamJson = null;
  const upstreamText = await upstream.text();
  try { upstreamJson = JSON.parse(upstreamText); }
  catch (_) { upstreamJson = { raw_text: upstreamText }; }

  if (!upstream.ok) {
    return reject('upstream_error', upstream.status, request, env, {
      status: upstream.status,
      provider_message: upstreamJson?.error?.message || upstreamJson?.raw_text || 'unknown'
    });
  }

  const content = upstreamJson?.choices?.[0]?.message?.content || upstreamJson?.output_text || JSON.stringify(upstreamJson);
  let data;
  try { data = JSON.parse(String(content).trim().replace(/^```(?:json)?/i, '').replace(/```$/,'').trim()); }
  catch (error) {
    data = { raw_text: content, parse_error: String(error && error.message || error) };
  }

  return json({
    ok: true,
    proxy_version: VERSION,
    provider: 'backend_proxy',
    task,
    type: safePayload.response_contract?.type || 'provider_response',
    model,
    data,
    usage: upstreamJson?.usage || null,
    safety: {
      api_key_exposed: false,
      key_storage: 'server_environment_secret',
      payload_secret_fields_stripped: true
    }
  }, 200, headers);
}


async function handleSourceTask(request, env) {
  const headers = corsHeaders(request, env);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') return reject('method_not_allowed', 405, request, env);

  const contentLength = Number(request.headers.get('content-length') || 0);
  const maxBodyBytes = Number(env.MAX_BODY_BYTES || 180000);
  if (contentLength && contentLength > maxBodyBytes) return reject('request_body_too_large', 413, request, env, { max_body_bytes: maxBodyBytes });

  let payload;
  try { payload = await request.json(); }
  catch (error) { return reject('invalid_json_body', 400, request, env); }

  const safePayload = stripSecretFields(payload);
  const task = String(safePayload.task || 'source_plan');
  const connector = String(safePayload.connector || 'manual_mock');
  if (!ALLOWED_SOURCE_TASKS.has(task)) return reject('invalid_source_task', 400, request, env, { allowed_source_tasks: [...ALLOWED_SOURCE_TASKS] });

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
      policy:'planning_only'
    }
  };
  return json(response, 200, headers);
}


export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    if (url.pathname === '/api/health') return json({ ok:true, proxy_version:VERSION, status:'healthy' }, 200, corsHeaders(request, env));
    if (url.pathname === '/api/provider-task') return handleProviderTask(request, env);
    if (url.pathname === '/api/source-task') return handleSourceTask(request, env);
    return reject('not_found', 404, request, env);
  }
};
