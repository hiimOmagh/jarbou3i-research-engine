# Hosted Backend Proxy Prototype

This directory contains the optional Cloudflare Worker proxy for Jarbou3i Research Engine v0.9.0-beta.

## Purpose

The proxy lets the browser call a server endpoint instead of exposing a provider API key in the frontend.

## Required secret

```bash
npx wrangler secret put OPENAI_API_KEY
```

## Optional variables

Set these in `wrangler.toml` or Cloudflare dashboard:

```text
OPENAI_BASE_URL=https://api.openai.com/v1/chat/completions
OPENAI_MODEL=gpt-4.1-mini
ALLOWED_ORIGINS=https://your-pages-domain.pages.dev
MAX_PROMPT_CHARS=30000
MAX_BODY_BYTES=180000
```

## Local test

```bash
npx wrangler dev backend/cloudflare-worker.js
```

Then set the app provider to `Hosted backend proxy` and endpoint to:

```text
http://localhost:8787/api/provider-task
```

## Security rule

The proxy must never return or log `OPENAI_API_KEY`.
