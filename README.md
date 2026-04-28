# Jarbou3i Research Engine

Experimental next-generation research workflow layer for the Jarbou3i Model.

This repository is intentionally separate from the stable `Jarbou3i_Model` public repo. It is a lab for research planning, evidence discipline, causal links, analysis compilation, provider-ready AI workflows, critique, hosted-provider experiments, portable-account experiments, and Quality Gate v2. The stable manual workflow remains preserved inside the app.

## Current version

`v0.15.0-beta — Portable Account Mock Flow`

Manual/private mode remains the default. This beta adds a mock portable-account/OAuth lifecycle so future BrainLink/OpenRouter-style account providers can be tested architecturally without real OAuth credentials, raw tokens, or live vendor dependency.

## What this beta adds

- `src/research/portable-account-mock.js` for local OAuth/PKCE-style simulation.
- Portable account controls: connect, refresh mock token, disconnect, export safe status.
- `portable_account` metadata in research packets and provider run-ledger entries.
- Provider identity now detects mock portable-token presence without exporting raw tokens.
- Quality Gate v2 now includes a Portable Account score.
- New QA: `tests/portable-account-check.mjs` and `npm run test:provider:portable`.

## Intended pipeline

```text
Topic/context
→ Research Plan
→ Evidence Matrix
→ Evidence Review Queue
→ Causal Links
→ Analysis Brief Compiler
→ Provider Harness: mock / dry-run / BYOK / hosted proxy / portable mock
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
Portable account mode: provider=portable_oauth uses a local mock OAuth lifecycle only in this beta
Backend key storage: server environment secret only
Portable account storage: token hash only; no raw access/refresh token exists
Exports: keys and raw tokens are never included
Validation: provider output must pass contract checks before being applied
```

## Local QA

```bash
npm install
npm run test:qa
```

Browser tests require Playwright browsers:

```bash
npx playwright install --with-deps
npm run test:browser
```

## Deployment

The app remains static and GitHub Pages-compatible. The optional Cloudflare Worker backend scaffold is present for hosted proxy experiments, but the app must continue to work without it.
