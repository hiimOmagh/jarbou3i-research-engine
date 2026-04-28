# Backend Proxy Smoke Tests + Local Worker Guide

This directory contains the optional Cloudflare Worker proxy for Jarbou3i Research Engine v0.16.0-beta.

The backend remains optional. Manual mode, MockProvider, BYOK mode, and dry-run mode must continue working without it.

## Purpose

The proxy lets the browser call a server endpoint instead of exposing a provider API key in the frontend.

```text
Browser → /api/provider-task → Cloudflare Worker → AI provider
```

The Worker is designed as a thin provider proxy, not as a source crawler. It enforces request limits, task allow-lists, CORS headers, and server-side secret handling.

## Endpoints

```text
GET  /api/health
POST /api/provider-task
```

## Required secret

```bash
npx wrangler secret put OPENAI_API_KEY
```

Never put real secrets into `wrangler.toml` or source control.

## Optional variables

Set these in `wrangler.toml` or the Cloudflare dashboard:

```text
OPENAI_BASE_URL=https://api.openai.com/v1/chat/completions
OPENAI_MODEL=gpt-4.1-mini
ALLOWED_ORIGINS=https://your-pages-domain.pages.dev
MAX_PROMPT_CHARS=30000
MAX_BODY_BYTES=180000
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

The Worker smoke test imports the Worker in Node, mocks the upstream AI provider, and verifies:

- `/api/health` returns `ok:true`.
- OPTIONS preflight returns `204`.
- missing server secret is rejected.
- invalid tasks are rejected.
- oversized prompts are rejected.
- valid provider task reaches the mock upstream.
- client-side secret fields are stripped.
- response safety reports `api_key_exposed:false`.

## Security rule

The proxy must never return or log `OPENAI_API_KEY`, client-supplied API keys, or remembered BYOK settings.


## Response safety fields

Successful proxy responses include:

```json
{
  "safety": {
    "api_key_exposed": false,
    "key_storage": "server_environment_secret",
    "payload_secret_fields_stripped": true
  }
}
```


## v0.16.0-beta — Source-Assisted Backend Planning Layer

This increment adds the planning layer for future source-assisted research. It does **not** perform live crawling, scraping, or factual source verification.

Added capabilities:
- Source connector registry with `manual_mock`, planned web search, GitHub, Hacker News, YouTube, Reddit, and Polymarket connectors.
- Source task contracts for source planning, query planning, claim extraction, evidence scoring, and source clustering.
- Planning-only backend endpoint `POST /api/source-task`.
- Source policy object enforcing `live_fetching_enabled: false`.
- Source diagnostics and source fixture suite.
- Quality Gate v2 source-planning, source-policy, and source-fixture scores.

Operational rule: the source layer may prepare requests and evidence-extraction contracts, but it must not claim real source verification until a compliant fetch/search connector is implemented.
