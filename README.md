# Jarbou3i Research Engine

Experimental next-generation research workflow layer for the Jarbou3i Model.

This repository is intentionally separate from the stable `Jarbou3i_Model` public repo. It is a lab for research planning, evidence discipline, causal links, analysis compilation, provider-ready AI workflows, critique, hosted-provider experiments, and Quality Gate v2. The stable manual workflow remains preserved inside the app.

## Current version

`v0.10.0-beta — Backend Proxy Smoke Tests + Local Worker Guide`

Manual/private mode remains the default. This beta hardens the optional hosted backend proxy with executable Worker smoke tests, a local Worker setup guide, mock upstream fixture, and production checklist while preserving MockProvider and BYOK modes. The app can now target three provider paths:

```text
MockProvider → local deterministic test mode
OpenAI-compatible BYOK → browser-to-provider with user key
Hosted backend proxy → browser-to-your-server, provider key stored as server secret
```

## What this beta adds

- Hosted backend proxy provider option in the Provider Harness.
- Browser adapter: `src/research/backend-proxy-provider.js`.
- Cloudflare Worker scaffold: `backend/cloudflare-worker.js`.
- `wrangler.toml` prototype config.
- Backend health and provider endpoints:
  - `GET /api/health`
  - `POST /api/provider-task`
- Server-side environment-secret pattern using `OPENAI_API_KEY`.
- Input limits, prompt limits, task allow-list, CORS controls, and secret-field stripping.
- Backend proxy safety metadata: `server_environment_secret`, `key_exported: false`.
- Backend proxy QA tests: `tests/backend-proxy-check.mjs` and `tests/backend-worker-smoke.mjs`.
- Worker smoke tests for health, CORS preflight, missing secret, invalid task, prompt limits, mock-upstream success, usage passthrough, and secret non-exposure.
- Local Worker example env file: `backend/.dev.vars.example`.
- Mock upstream fixture: `backend/fixtures/mock-upstream-chat-completion.json`.
- Production checklist: `docs/backend-production-checklist.md`.
- `npm run test:backend` and `npm run test:backend:worker`.

## Intended pipeline

```text
Topic/context
→ Research Plan
→ Evidence Matrix
→ Causal Links
→ Analysis Brief Compiler
→ Provider Harness: mock / dry-run / BYOK / hosted proxy
→ Provider Response Validation
→ Controlled Repair Loop if needed
→ Strategic Analysis JSON
→ Critique
→ Quality Gate
→ Export
```

## Provider safety model

```text
Default: MockProvider / dry-run only
BYOK live calls: require provider=openai_compatible + API key + live opt-in
Hosted live calls: require provider=backend_proxy + proxy endpoint + live opt-in
Backend key storage: server environment secret only
Exports: keys are never included
Validation: provider output must pass contract checks before being applied
```

## Backend setup

```bash
cp backend/.dev.vars.example backend/.dev.vars
npx wrangler secret put OPENAI_API_KEY
npx wrangler dev backend/cloudflare-worker.js --env-file backend/.dev.vars
```

Use this endpoint locally:

```text
http://localhost:8787/api/provider-task
```

Deploy the worker separately from the static GitHub Pages app, then set the Provider Harness endpoint to your deployed `/api/provider-task`.

## Local usage

```bash
npm install
npm run dev
```

Open the local server URL shown by `http-server`.

## QA

No-browser checks:

```bash
npm run test:static
npm run test:schema
npm run test:fixtures
npm run test:research
npm run test:provider
npm run test:provider:fixtures
npm run test:modules
npm run test:backend
npm run test:backend:worker
npm run test:a11y:static
npm run test:qa
```

Browser checks after installing Playwright browsers:

```bash
npx playwright install --with-deps
npm run test:browser
```

## Repository discipline

This repo is an R&D branch, not the stable public product. Merge features back into the stable repo only after they work without AI, preserve manual mode, pass static/schema/provider/backend/browser checks, preserve EN/AR/FR, and keep RTL intact.
