# Changelog

## v0.3.0-alpha — Analysis Compiler + Diagnostics

Third experimental research-engine release.

### Added

- Analysis Compiler panel.
- Compiled `analysis_brief` with readiness score, source clusters, coverage, gaps, synthesis constraints, and handoff summary.
- Source-cluster generation from evidence `supports` and `contradicts` IDs.
- Validation diagnostics with linked IDs, layer coverage, gap list, missing evidence references, and readiness status.
- Strict synthesis prompt builder for external/future AI synthesis.
- Separate analysis brief export.
- Quality Gate v2 now includes a compiler score.
- Research schema upgraded to include `analysis_brief` and `diagnostics`.
- Research fixture upgraded to v0.3.0-alpha with source clusters and diagnostics.

### Preserved

- Editable Evidence Matrix.
- Causal Link Workbench.
- Full research-packet import/export.
- Mock AI generation, repair, and critique.
- Manual prompt copy workflow.
- JSON import and validation.
- Six-layer strategic analysis review.
- HTML report export.
- Trilingual app shell and RTL handling.
- No live AI provider and no backend dependency.

## v0.2.0-alpha — Evidence + Causal Link Workbench

Second experimental research-engine release.

### Added

- Editable evidence workflow: add, edit, cancel edit, delete, and renumber evidence items.
- Full research-packet export/import using `workflow_version`, `research_plan`, `evidence_matrix`, `causal_links`, and optional `critique`.
- Causal Link Workbench with manual link creation.
- Causal-link inference from evidence `supports` and `contradicts` fields.
- Expanded Quality Gate v2 with source discipline, source diversity, counter-evidence, causal-link, critique, and readiness scoring.
- Stronger mock critique with evidence volume, source traceability, source diversity, counter-evidence, causal-risk, and publication-risk findings.

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
