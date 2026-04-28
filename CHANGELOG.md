# Changelog

## v0.2.0-alpha — Evidence + Causal Link Workbench

Second experimental research-engine release.

### Added

- Editable evidence workflow: add, edit, cancel edit, delete, and renumber evidence items.
- Full research-packet export/import using `workflow_version`, `research_plan`, `evidence_matrix`, `causal_links`, and optional `critique`.
- Causal Link Workbench with manual link creation.
- Causal-link inference from evidence `supports` and `contradicts` fields.
- Expanded Quality Gate v2 with source discipline, source diversity, counter-evidence, causal-link, critique, and readiness scoring.
- Stronger mock critique with evidence volume, source traceability, source diversity, counter-evidence, causal-risk, and publication-risk findings.
- `schema/research-workflow.schema.json` upgraded to require `causal_links`.
- Research fixture upgraded to v0.2.0-alpha.

### Preserved

- Manual prompt copy workflow.
- JSON import and validation.
- Six-layer strategic analysis review.
- HTML report export.
- Trilingual app shell and RTL handling.
- No live AI provider and no backend dependency.

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
