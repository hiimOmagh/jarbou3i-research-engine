# Architecture

`jarbou3i-research-engine` is a static, client-side lab derived from the stable Jarbou3i Model app.

## Current v0.7.0-alpha pipeline

```text
Research Plan → Evidence Matrix → Causal Links → Analysis Compiler → Provider Harness → Response Validation → Repair Loop → Critique → Quality Gate v2
```

## Core files

- `index.html` — static app shell and research-lab UI.
- `src/app.js` — preserved stable manual strategic-analysis workflow.
- `src/research-engine.js` — isolated alpha workflow orchestrator.
- `src/research/prompt-builders.js` — plan/deep-research/synthesis prompt builders.
- `src/research/provider-core.js` — response contracts, JSON extraction, response validation, repair routing, stable hash, and validation summaries.
- `src/research/mock-provider.js` — deterministic local provider outputs for plan/synthesis/repair/critique/source-discipline tasks.
- `src/research/openai-compatible-provider.js` — BYOK OpenAI-compatible chat-completions adapter.
- `schema/strategic-analysis.schema.json` — schema for the final strategic analysis object.
- `schema/research-workflow.schema.json` — schema for research packets, evidence, causal links, analysis brief, diagnostics, provider run ledger, response validation, and repair trace.
- `fixtures/research/sample-research-workflow-en.json` — research workflow regression fixture.

## Provider harness

The provider harness supports MockProvider, dry-run payload inspection, and OpenAI-compatible BYOK plumbing behind explicit opt-in. Its core request payload contains:

```text
request_version
provider
provider_config without API key
provider_safety
task
language
privacy_mode
response_contract
input_fingerprint
prompt
packet
```

## Provider reliability layer

Every provider output follows this chain:

```text
raw output → JSON parse/extract → response contract validation → controlled repair fallback if needed → accepted/rejected run ledger entry
```

Only accepted or repaired strategic outputs are inserted into the main JSON import box. Invalid responses are recorded in the Run Ledger with `validation_error` status and are not silently trusted.

## v0.7 modular boundary

The app intentionally keeps browser-global modules instead of introducing Vite/TypeScript yet. This preserves GitHub Pages compatibility and avoids build-step complexity while creating clean seams for a future backend or TypeScript migration.

```text
src/research-engine.js = UI orchestration + state
src/research/*.js      = provider/prompt/reliability primitives
```

## Design rule

The research engine must work without live AI. AI providers remain optional and subordinate to the schema, response contracts, run ledger, and Quality Gate.
