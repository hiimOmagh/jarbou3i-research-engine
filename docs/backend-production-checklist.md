# Backend Production Checklist

Use this checklist before enabling hosted backend proxy mode for public users.

## Required

- [ ] `OPENAI_API_KEY` is stored only as a Cloudflare secret.
- [ ] `wrangler.toml` contains no real secrets.
- [ ] `ALLOWED_ORIGINS` is restricted to the production Pages domain and any custom domain.
- [ ] `MAX_PROMPT_CHARS` and `MAX_BODY_BYTES` are set to conservative values.
- [ ] `npm run test:qa` passes.
- [ ] `npm run test:backend` passes.
- [ ] `npm run test:browser` passes in CI.
- [ ] Hosted proxy mode is still opt-in in the frontend.
- [ ] Manual mode remains usable with the backend disabled.

## Recommended before public use

- [ ] Add Cloudflare rate limiting or durable object/KV-backed abuse controls.
- [ ] Add request logging that excludes prompt text and secrets.
- [ ] Add daily usage budget alerts on the AI provider account.
- [ ] Add model allow-listing on the Worker side.
- [ ] Add a visible privacy notice explaining hosted mode.
- [ ] Test failures for 401, 429, 500, malformed upstream JSON, and timeout behavior.

## Do not ship if

- [ ] Any API key appears in exported packets, run ledgers, reports, browser console output, or Worker responses.
- [ ] The app requires the backend to use manual mode.
- [ ] Invalid provider output can bypass validation.
- [ ] The Worker accepts arbitrary task names.
- [ ] Production CORS allows every origin without a conscious decision.


## v0.18.0-beta — Source-Assisted Backend Planning Layer

This increment adds the planning layer for future source-assisted research. It does **not** perform live crawling, scraping, or factual source verification.

Added capabilities:
- Source connector registry with `manual_mock`, planned web search, GitHub, Hacker News, YouTube, Reddit, and Polymarket connectors.
- Source task contracts for source planning, query planning, claim extraction, evidence scoring, and source clustering.
- Planning-only backend endpoint `POST /api/source-task`.
- Source policy object enforcing `live_fetching_enabled: false`.
- Source diagnostics and source fixture suite.
- Quality Gate v2 source-planning, source-policy, and source-fixture scores.

Operational rule: the source layer may prepare requests and evidence-extraction contracts, but it must not claim real source verification until a compliant fetch/search connector is implemented.
