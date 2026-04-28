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

## v0.3.0-alpha specific checks

- Research schema requires `analysis_brief` and `diagnostics`.
- Research fixture includes source clusters and coverage diagnostics.
- Static QA checks for `compileAnalysisBrief`, `buildSourceClusters`, and `diagnosticReport`.
