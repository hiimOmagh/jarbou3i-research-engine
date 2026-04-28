# Architecture

`jarbou3i-research-engine` is a static, client-side lab derived from the stable Jarbou3i Model app.

## Current v0.3.0-alpha pipeline

```text
Research Plan → Evidence Matrix → Causal Links → Analysis Compiler → Mock AI Workflow → Critique → Quality Gate v2
```

## Core files

- `index.html` — static app shell and research-lab UI.
- `src/app.js` — preserved stable manual strategic-analysis workflow.
- `src/research-engine.js` — isolated alpha workflow logic.
- `schema/strategic-analysis.schema.json` — schema for the final strategic analysis object.
- `schema/research-workflow.schema.json` — schema for research packets, evidence, causal links, analysis brief, and diagnostics.
- `fixtures/research/sample-research-workflow-en.json` — research workflow regression fixture.

## Design rule

The research engine must work without live AI. AI providers come later behind a provider abstraction. The schema and Quality Gate remain the authority.
