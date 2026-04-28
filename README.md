# Jarbou3i Research Engine

Experimental next-generation research workflow layer for the Jarbou3i Model.

This repository is intentionally separate from the stable `Jarbou3i_Model` public repo. It is a lab for research planning, evidence discipline, causal links, analysis compilation, provider-ready AI workflows, critique, hosted-provider experiments, portable-account experiments, privacy-safe exports, browser QA, migration safety, module boundaries, and Quality Gate v2. The stable manual workflow remains preserved inside the app.

## Current version

`v0.18.0-beta — Research Engine Module Split`

Manual/private mode remains the default. This beta is a behavior-preserving architecture release: stable responsibilities were moved out of `src/research-engine.js` into focused browser modules while keeping v0.17 migration safety, privacy export guardrails, provider modes, and evidence review behavior intact.

## What this beta adds

- `src/research/render-helpers.js`
- `src/research/state-store.js`
- `src/research/evidence-controller.js`
- `src/research/evidence-review-controller.js`
- `src/research/provider-controller.js`
- `src/research/source-controller.js`
- `src/research/export-controller.js`
- `src/research/quality-gate.js`
- `docs/v0.18.0-beta-module-split.md`
- `tests/research-module-check.mjs` now enforces the v0.18 module boundary and dependency order.
- `npm run test:v018:no-browser` and `npm run test:v018` are the current release gates.

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

## Module dependency boundary

```text
index.html
→ focused research modules
→ src/research-engine.js orchestration layer
```

The engine still owns UI wiring and orchestration. Stable helper/state/export/quality logic now lives in smaller modules so future refactors can happen without changing user-visible behavior.

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
npm run test:v018:no-browser
```

Browser tests require Playwright browsers:

```bash
npx playwright install --with-deps
npm run test:browser:provider
npm run test:browser
```

Full v0.18 QA target:

```bash
npm run test:v018
```

## Deployment

The app remains static and GitHub Pages-compatible. The optional Cloudflare Worker backend scaffold is present for hosted proxy experiments, but the app must continue to work without it.
