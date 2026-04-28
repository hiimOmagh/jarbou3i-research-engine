# Backend Proxy Smoke Tests + Local Worker Guide

This directory contains the optional Cloudflare Worker proxy for Jarbou3i Research Engine v0.25.0-beta.

The backend remains optional. Manual mode, MockProvider, BYOK mode, and dry-run mode must continue working without it.

## Purpose

The proxy lets the browser call a server endpoint instead of exposing a provider API key in the frontend.

```text
Browser → /api/provider-task → Cloudflare Worker → AI provider
```

The Worker is a thin provider proxy, not a source crawler. It enforces request limits, task allow-lists, CORS headers, server-side secret handling, model policy, provider timeouts, structured errors, and redacted metadata-only audit logging.

## Endpoints

```text
GET  /api/health
POST /api/provider-task
POST /api/source-task
```

## Required secret

```bash
npx wrangler secret put OPENAI_API_KEY
```

Never put real secrets into `wrangler.toml`, `.dev.vars.example`, docs, tests, or source control.

## Optional variables

Set these in `wrangler.toml`, Cloudflare dashboard variables, or a local uncommitted `.dev.vars`:

```text
OPENAI_BASE_URL=https://api.openai.com/v1/chat/completions
OPENAI_MODEL=gpt-4.1-mini
ALLOWED_MODELS=gpt-4.1-mini,gpt-4.1
ALLOWED_ORIGINS=https://your-pages-domain.pages.dev,https://yourdomain.com
MAX_PROMPT_CHARS=30000
MAX_BODY_BYTES=180000
MAX_UPSTREAM_BYTES=400000
PROVIDER_TIMEOUT_MS=25000
RATE_LIMIT_SECONDS=8
AUDIT_LOGS_ENABLED=false
```

## CORS allow-list

`ALLOWED_ORIGINS` is the CORS allow-list for browser origins. Disallowed origins return `cors_origin_not_allowed`.

## Structured error taxonomy

Backend errors use a stable shape:

```json
{
  "ok": false,
  "proxy_version": "0.25.0-beta",
  "error": "rate_limited",
  "error_code": "rate_limited",
  "error_category": "abuse_control",
  "retryable": true,
  "request_id": "generated-request-id",
  "details": {}
}
```

Core error codes include:

```text
cors_origin_not_allowed
missing_OPENAI_API_KEY_secret
invalid_task
invalid_source_task
prompt_too_large
request_body_too_large
model_not_allowed
rate_limited
upstream_timeout
upstream_fetch_failed
upstream_response_too_large
upstream_error
```

## Rate limiting

`RATE_LIMIT_SECONDS` applies a best-effort in-isolate cooldown per endpoint, task, and client key. For high-risk public deployments, add Cloudflare-native rate limiting or Durable Object/KV-backed counters.

## Provider timeout

`PROVIDER_TIMEOUT_MS` aborts slow upstream provider calls and returns:

```text
upstream_timeout / 504 / retryable:true
```

## Model allow-list

`ALLOWED_MODELS` blocks unsupported client-selected models on the Worker side. This prevents the browser from silently escalating to an expensive or unauthorized model.

## Redacted audit logs

Set `AUDIT_LOGS_ENABLED=true` only when needed. Audit events are metadata-only and must not include raw prompts, provider response text, authorization headers, API keys, access tokens, or refresh tokens.

Logged fields may include:

```text
request_id
path
task
model
prompt_chars
body_bytes
upstream_status
usage_total_tokens
```

## Local Worker setup

Copy the example file and add a local test key:

```bash
cp backend/.dev.vars.example backend/.dev.vars
```

Run the Worker locally:

```bash
npx wrangler dev backend/cloudflare-worker.js --env-file backend/.dev.vars
```

Then set the app provider to `Hosted backend proxy` and endpoint to:

```text
http://localhost:8787/api/provider-task
```

## Smoke tests

Static backend contract check:

```bash
npm run test:backend
```

Worker-only smoke test:

```bash
npm run test:backend:worker
```

Hardening-only check:

```bash
npm run test:backend:hardening
```

The Worker smoke test imports the Worker in Node, mocks the upstream AI provider, and verifies:

- `/api/health` returns `ok:true` and hardening metadata.
- OPTIONS preflight returns `204` for allowed origins.
- disallowed CORS origins are rejected.
- missing server secret is rejected.
- invalid tasks are rejected.
- oversized prompts are rejected.
- disallowed models are rejected.
- rate-limited repeated tasks return retryable `429`.
- provider timeouts return retryable `504`.
- audit logs remain metadata-only.
- valid provider task reaches the mock upstream.
- client-side secret fields are stripped.
- response safety reports `api_key_exposed:false`.

## Security rule

The proxy must never return or log `OPENAI_API_KEY`, client-supplied API keys, raw prompts in audit mode, OAuth access tokens, OAuth refresh tokens, or remembered BYOK settings.

## Response safety fields

Successful proxy responses include:

```json
{
  "safety": {
    "api_key_exposed": false,
    "key_storage": "server_environment_secret",
    "payload_secret_fields_stripped": true,
    "prompt_logged": false,
    "audit_logs_redacted": true,
    "model_allowlist_enforced": true
  }
}
```

## Source-assisted backend planning layer

`POST /api/source-task` remains planning-only. It does **not** perform live crawling, scraping, or factual source verification.

Operational rule: the source layer may prepare requests and evidence-extraction contracts, but it must not claim real source verification until a compliant fetch/search connector is implemented.
