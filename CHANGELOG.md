# Changelog

## v0.4.0-alpha — Provider Harness + Run Ledger

Fourth experimental research-engine release.

### Added

- Provider Harness panel.
- `MockProvider` task runner for research plan, strategic synthesis, JSON repair, critique, and source discipline.
- Provider request payload builder with privacy mode, response contract, input fingerprint, and research packet snapshot.
- Response contracts for each provider task.
- Run Ledger with run ID, provider, task, status, duration, input fingerprint, response type, warnings, and output summary.
- Run Ledger export.
- Source-discipline mock audit that detects missing URLs, missing dates, weak source types, and counter-evidence gaps.
- Quality Gate v2 provider-harness score.
- Research workflow schema upgraded with `provider`, `ai_runs`, and `ai_run` definitions.
- Research fixture upgraded with a provider run ledger.

### Preserved

- Analysis Compiler and diagnostics.
- Source clustering.
- Editable Evidence Matrix.
- Causal Link Workbench.
- Full research-packet import/export.
- Legacy quick mock generation, repair, and critique.
- Manual prompt copy workflow.
- JSON import and validation.
- HTML report export.
- Trilingual app shell and RTL handling.
- No live AI provider and no backend dependency.

## v0.3.0-alpha — Analysis Compiler + Diagnostics

Third experimental research-engine release.

### Added

- Analysis Compiler panel.
- Compiled `analysis_brief` with readiness score, source clusters, coverage, gaps, synthesis constraints, and handoff summary.
- Source-cluster generation from evidence `supports` and `contradicts` IDs.
- Validation diagnostics with linked IDs, layer coverage, gap list, missing evidence references, and readiness status.
- Strict synthesis prompt builder for external/future AI synthesis.
- Separate analysis brief export.
- Quality Gate v2 compiler score.
- Research schema upgraded to include `analysis_brief` and `diagnostics`.

## v0.2.0-alpha — Evidence + Causal Link Workbench

Second experimental research-engine release.

### Added

- Editable evidence workflow: add, edit, cancel edit, delete, and renumber evidence items.
- Full research-packet export/import.
- Causal Link Workbench with manual link creation.
- Causal-link inference from evidence `supports` and `contradicts` fields.
- Expanded Quality Gate v2.

## v0.1.0-alpha — Research Workflow Skeleton

Initial experimental research-engine repo release.
