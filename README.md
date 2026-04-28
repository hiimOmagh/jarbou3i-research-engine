# Jarbou3i Research Engine

Experimental next-generation research workflow layer for the Jarbou3i Model.

This repository is intentionally separate from the stable `Jarbou3i_Model` public repo. It is a lab for research planning, evidence discipline, causal links, analysis compilation, provider-ready AI workflows, critique, hosted-provider experiments, portable-account experiments, privacy-safe exports, browser QA, and Quality Gate v2. The stable manual workflow remains preserved inside the app.

## Current version

`v0.16.0-beta — Provider Mode Browser QA + Privacy Export Tests`

Manual/private mode remains the default. This beta hardens the v0.15 portable-account mock flow with provider-mode browser tests and a privacy export guard that audits/sanitizes JSON export payloads before download.

## What this beta adds

- `src/research/privacy-export-guard.js` for export-time secret detection and redaction.
- Privacy metadata on workflow packets: `privacy_export` with explicit `*_exported: false` guardrail flags.
- Browser QA for provider mode switching across mock, BYOK, hosted backend proxy, and portable OAuth mock.
- Browser QA for portable-account mock connect/refresh/dry-run flow.
- Browser QA ensuring BYOK test keys never render into diagnostics or run-ledger UI.
- New QA: `tests/privacy-export-guard-check.mjs`, `tests/privacy-export-check.mjs`, and `tests/provider-mode-browser.spec.mjs`.
- `npm run test:privacy`, `npm run test:browser:provider`, and `npm run test:v016`.

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
→ Privacy Export Guard
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
Exports: keys and raw tokens are sanitized before JSON download
Validation: provider output must pass contract checks before being applied
```

## Local QA

```bash
npm install
npm run test:qa
npm run test:privacy
```

Browser tests require Playwright browsers:

```bash
npx playwright install --with-deps
npm run test:browser:provider
npm run test:browser
```

Full v0.16 QA target:

```bash
npm run test:v016
```

## Deployment

The app remains static and GitHub Pages-compatible. The optional Cloudflare Worker backend scaffold is present for hosted proxy experiments, but the app must continue to work without it.
