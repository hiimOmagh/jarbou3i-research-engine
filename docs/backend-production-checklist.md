# Backend Production Checklist

Use this checklist before enabling hosted backend proxy mode for public users.

## Required

- [ ] `OPENAI_API_KEY` is stored only as a Cloudflare secret.
- [ ] `wrangler.toml` contains no real secrets.
- [ ] `.dev.vars` is local-only and ignored by Git.
- [ ] `ALLOWED_ORIGINS` is restricted to the production Pages domain and any custom domain.
- [ ] `ALLOWED_MODELS` contains only approved model IDs.
- [ ] `MAX_PROMPT_CHARS`, `MAX_BODY_BYTES`, and `MAX_UPSTREAM_BYTES` are set to conservative values.
- [ ] `PROVIDER_TIMEOUT_MS` is set and tested.
- [ ] `RATE_LIMIT_SECONDS` is set or Cloudflare-native rate limiting is enabled.
- [ ] `AUDIT_LOGS_ENABLED` is off by default unless metadata logging is explicitly needed.
- [ ] `npm run test:qa` passes.
- [ ] `npm run test:backend` passes.
- [ ] `npm run test:backend:hardening` passes.
- [ ] `npm run test:browser` passes in CI.
- [ ] Hosted proxy mode is still opt-in in the frontend.
- [ ] Manual mode remains usable with the backend disabled.

## Structured failure modes to verify

- [ ] `cors_origin_not_allowed` for disallowed origins.
- [ ] `missing_OPENAI_API_KEY_secret` for missing server secret.
- [ ] `invalid_task` for unsupported provider task names.
- [ ] `invalid_source_task` for unsupported source task names.
- [ ] `prompt_too_large` for excessive prompt length.
- [ ] `request_body_too_large` for oversized request bodies.
- [ ] `model_not_allowed` when a browser requests a model outside `ALLOWED_MODELS`.
- [ ] `rate_limited` with retryable `429` for repeated requests.
- [ ] `upstream_timeout` with retryable `504` for slow provider calls.
- [ ] `upstream_response_too_large` for excessive provider responses.
- [ ] `upstream_error` for provider 4xx/5xx responses.

## Recommended before public use

- [ ] Add Cloudflare-native rate limiting or Durable Object/KV-backed abuse controls.
- [ ] Add provider account daily usage budget alerts.
- [ ] Add dashboard monitoring for error categories without logging prompts.
- [ ] Add a visible privacy notice explaining hosted mode.
- [ ] Test failures for 401, 429, 500, malformed upstream JSON, and timeout behavior.

## Redacted audit logs

Audit logs must remain metadata-only. Allowed examples:

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

Forbidden in logs:

```text
raw prompt text
provider response text
OPENAI_API_KEY
Authorization header
Bearer token
client-supplied api_key
OAuth access_token
OAuth refresh_token
```

## Do not ship if

- [ ] Any API key appears in exported packets, run ledgers, reports, browser console output, Worker responses, or audit logs.
- [ ] Audit logs include raw prompts or provider responses.
- [ ] The app requires the backend to use manual mode.
- [ ] Invalid provider output can bypass validation.
- [ ] The Worker accepts arbitrary task names.
- [ ] The browser can select unauthorized models.
- [ ] Provider calls can hang without timeout handling.
- [ ] Production CORS allows every origin without a conscious decision.
