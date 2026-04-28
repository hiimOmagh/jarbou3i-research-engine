# Changelog

## v0.1.0-alpha — Research Workflow Skeleton

Initial experimental research-engine repo release.

### Added

- Research Workflow Lab panel above the stable manual workflow.
- Research Plan generator using local mock logic.
- Evidence Matrix with claim/source/source-type/source-date/strength/supports/contradicts/confidence fields.
- Mock AI workflow that generates schema-compatible strategic analysis JSON without external API calls.
- Mock repair action for invalid/incomplete JSON workflow testing.
- Mock critique action with evidence-gap and publication-risk diagnostics.
- Quality Gate v2 draft with plan/evidence/causal/critique/readiness scores.
- `src/research-engine.js` as isolated alpha workflow logic.
- `schema/research-workflow.schema.json`.
- `fixtures/research/sample-research-workflow-en.json`.
- `tests/research-workflow-check.mjs`.

### Preserved

- Manual prompt copy workflow.
- JSON import and validation.
- Six-layer strategic analysis review.
- HTML report export.
- Trilingual app shell and RTL handling.

### Not included

- No live AI provider.
- No backend.
- No API key storage.
- No source crawling or real source verification.
