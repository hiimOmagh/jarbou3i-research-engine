# Architecture — Jarbou3i Research Engine

## Current version

`v0.2.0-alpha — Evidence + Causal Link Workbench`

The repository is a separate lab branch for a future research-governed strategic intelligence workflow. It preserves the stable manual Jarbou3i Model workflow while adding an experimental layer above it.

## Core pipeline

```text
Topic/context
→ Research Plan
→ Evidence Matrix
→ Causal Links
→ Mock/AI synthesis
→ Strategic Analysis JSON
→ Critique
→ Quality Gate v2
→ Export
```

## Runtime layers

- `index.html`: static app shell and research lab DOM.
- `src/app.js`: stable manual prompt/import/review/export workflow.
- `src/research-engine.js`: isolated alpha research workflow logic.
- `schema/strategic-analysis.schema.json`: strategic analysis contract.
- `schema/research-workflow.schema.json`: research packet contract.
- `fixtures/`: stable strategic-analysis fixtures.
- `fixtures/research/`: research-packet fixtures.
- `tests/`: static, schema, fixture, accessibility, and research checks.

## Research packet contract

A research packet contains:

```text
workflow_version
research_plan
evidence_matrix
causal_links
critique optional
```

Evidence items are first-class objects. Causal links are separate objects that connect model IDs through evidence IDs.

## Provider policy

No live AI calls exist in v0.2.0-alpha. The mock workflow is intentionally local and deterministic enough for architecture testing. Real providers must later use a provider abstraction and must never become required for manual mode.
