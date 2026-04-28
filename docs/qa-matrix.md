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
- `npm run test:qa`

## Browser gates

- `npm run test:browser`
- `tests/research.spec.js` verifies the research workflow, evidence loading, analysis compilation, mock generation, and mock critique.
- `tests/rtl-mobile.spec.js` protects Arabic RTL/mobile layout.
- `tests/a11y.spec.js` protects basic accessibility behavior.

## v0.8.0-alpha specific checks

- Research schema requires `analysis_brief`, `diagnostics`, and `ai_runs`.
- Research schema defines `ai_run`, `response_validation`, `repair_trace`, `provider_diagnostics`, and `provider_fixture_report` metadata.
- Research fixture includes source clusters, coverage diagnostics, provider validation, repair trace, provider diagnostics, provider fixture report, and a provider run ledger.
- Static QA checks for `buildProviderPayload`, provider module delegation, `responseContract`, `providerContractPreview`, `providerPromptPreview`, `runProviderFixtureSuite`, `runProviderTask`, `validateProviderResponse`, `repairProviderResponse`, `compileAnalysisBrief`, `buildSourceClusters`, and `diagnosticReport`.
- Provider output must pass task-specific contract validation before entering the analysis import box.
- Invalid provider output must be rejected or explicitly repaired through a traceable fallback.
- API keys are not exported into research packets, analysis briefs, reports, or run ledgers.

## v0.8 provider UX / fixture checks

- `src/research/prompt-builders.js` exists and compiles.
- `src/research/provider-core.js` exists and compiles.
- `src/research/mock-provider.js` exists and compiles.
- `src/research/openai-compatible-provider.js` exists and compiles.
- `index.html` loads research modules before `src/research-engine.js`.
- `src/research-engine.js` delegates provider and prompt work to `window.Jarbou3iResearchModules`.

- `src/research/provider-fixtures.js` exists and compiles.
- `fixtures/provider/` contains accepted, rejected, and noisy-response cases.
- Provider contracts expose title, purpose, required fields, rejection rules, diagnostic hints, and example shapes.
