# QA Matrix

## No-browser gates

- `node tests/static-check.mjs`
- `node tests/schema-check.mjs`
- `node tests/fixtures-check.mjs`
- `node tests/research-workflow-check.mjs`
- `node tests/provider-response-check.mjs`
- `node tests/provider-fixtures-check.mjs`
- `node tests/research-module-check.mjs`
- `node tests/a11y-static-check.mjs`
- `node tests/qa-check.mjs`
- `npm run test:backend`
- `node tests/backend-worker-smoke.mjs`
- `npm run test:qa`

## Browser gates

- `npm run test:browser`
- `tests/research.spec.js` verifies the research workflow, evidence loading, analysis compilation, mock generation, and mock critique.
- `tests/rtl-mobile.spec.js` protects Arabic RTL/mobile layout.
- `tests/a11y.spec.js` protects basic accessibility behavior.

## v0.12.0-beta specific checks

- Research schema requires `analysis_brief`, `diagnostics`, and `ai_runs`.
- Research schema defines `ai_run`, `response_validation`, `repair_trace`, `provider_diagnostics`, and `provider_fixture_report` metadata.
- Research fixture includes source clusters, coverage diagnostics, provider validation, repair trace, provider diagnostics, provider fixture report, and a provider run ledger.
- Static QA checks for `buildProviderPayload`, provider module delegation, `responseContract`, `providerContractPreview`, `providerPromptPreview`, `runProviderFixtureSuite`, `runProviderTask`, `validateProviderResponse`, `repairProviderResponse`, `compileAnalysisBrief`, `buildSourceClusters`, and `diagnosticReport`.
- Provider output must pass task-specific contract validation before entering the analysis import box.
- Invalid provider output must be rejected or explicitly repaired through a traceable fallback.
- API keys are not exported into research packets, analysis briefs, reports, or run ledgers.

## Provider UX / fixture checks

- `src/research/prompt-builders.js` exists and compiles.
- `src/research/provider-core.js` exists and compiles.
- `src/research/mock-provider.js` exists and compiles.
- `src/research/openai-compatible-provider.js` exists and compiles.
- `index.html` loads research modules before `src/research-engine.js`.
- `src/research-engine.js` delegates provider and prompt work to `window.Jarbou3iResearchModules`.

- `src/research/provider-fixtures.js` exists and compiles.
- `fixtures/provider/` contains accepted, rejected, and noisy-response cases.
- Provider contracts expose title, purpose, required fields, rejection rules, diagnostic hints, and example shapes.


## Backend proxy QA

```bash
npm run test:backend
```

Checks:

- Cloudflare Worker scaffold exists.
- Worker can be imported directly in Node.
- `/api/health` returns `ok:true`.
- OPTIONS preflight returns `204`.
- missing server secret is rejected.
- invalid tasks are rejected.
- oversized prompts are rejected.
- mock-upstream success path returns parsed JSON and usage.
- client-side secret fields do not leak into upstream requests or Worker responses.
- `/api/provider-task` and `/api/health` are declared.
- `OPENAI_API_KEY` is referenced only as a server environment secret.
- Browser backend proxy adapter is loaded.
- Provider dropdown includes Hosted backend proxy.
- Research engine includes hosted proxy privacy mode and server-secret safety labels.


## v0.12.0-beta — Source-Assisted Backend Planning Layer

This increment adds the planning layer for future source-assisted research. It does **not** perform live crawling, scraping, or factual source verification.

Added capabilities:
- Source connector registry with `manual_mock`, planned web search, GitHub, Hacker News, YouTube, Reddit, and Polymarket connectors.
- Source task contracts for source planning, query planning, claim extraction, evidence scoring, and source clustering.
- Planning-only backend endpoint `POST /api/source-task`.
- Source policy object enforcing `live_fetching_enabled: false`.
- Source diagnostics and source fixture suite.
- Quality Gate v2 source-planning, source-policy, and source-fixture scores.

Operational rule: the source layer may prepare requests and evidence-extraction contracts, but it must not claim real source verification until a compliant fetch/search connector is implemented.

## v0.12 Source Import QA

- `tests/source-import-check.mjs` validates parser syntax, no-live-fetch guarantees, UI hooks, schema additions, and fixture import reports.
- Import reports must preserve `live_fetching_performed: false` and `verification_claimed: false`.
- Imported evidence must include `supports` and `contradicts` arrays so users can link it into the strategic model.
