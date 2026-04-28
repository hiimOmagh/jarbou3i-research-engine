# QA Matrix

## No-browser gates

- `node tests/static-check.mjs`
- `node tests/schema-check.mjs`
- `node tests/fixtures-check.mjs`
- `node tests/research-workflow-check.mjs`
- `node tests/a11y-static-check.mjs`
- `node tests/qa-check.mjs`

## Browser gates

- `npm run test:browser`
- `tests/research.spec.js` verifies the research workflow, evidence loading, analysis compilation, mock generation, and mock critique.
- `tests/rtl-mobile.spec.js` protects Arabic RTL/mobile layout.
- `tests/a11y.spec.js` protects basic accessibility behavior.

## v0.4.0-alpha specific checks

- Research schema requires `analysis_brief`, `diagnostics`, and `ai_runs`.
- Research schema defines `ai_run` response-contract metadata.
- Research fixture includes source clusters, coverage diagnostics, and a provider run ledger.
- Static QA checks for `buildProviderPayload`, `responseContract`, `runProviderTask`, `compileAnalysisBrief`, `buildSourceClusters`, and `diagnosticReport`.
- No live AI/API tokens are introduced.
