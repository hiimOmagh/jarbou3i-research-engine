# Architecture

`jarbou3i-research-engine` is a static, client-side lab derived from the stable Jarbou3i Model app.

## Current v0.4.0-alpha pipeline

```text
Research Plan → Evidence Matrix → Causal Links → Analysis Compiler → Provider Harness → Critique → Quality Gate v2
```

## Core files

- `index.html` — static app shell and research-lab UI.
- `src/app.js` — preserved stable manual strategic-analysis workflow.
- `src/research-engine.js` — isolated alpha workflow logic.
- `schema/strategic-analysis.schema.json` — schema for the final strategic analysis object.
- `schema/research-workflow.schema.json` — schema for research packets, evidence, causal links, analysis brief, diagnostics, and provider run ledger.
- `fixtures/research/sample-research-workflow-en.json` — research workflow regression fixture.

## Provider harness

The provider harness is intentionally local-only in v0.4.0-alpha. It builds request payloads that future live providers can reuse:

```text
request_version
provider
task
language
privacy_mode
response_contract
input_fingerprint
prompt
packet
```

Every mock provider run is stored in `ai_runs` with run metadata and warnings. This creates a testable integration seam before BYOK or backend API calls exist.

## Design rule

The research engine must work without live AI. AI providers come later behind the provider abstraction. The schema, run ledger, and Quality Gate remain the authority.
