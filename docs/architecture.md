# Architecture

`jarbou3i-research-engine` is a static, client-side lab derived from the stable Jarbou3i Model app.

## Current v0.13.0-beta pipeline

```text
Research Plan → Evidence Matrix → Causal Links → Analysis Compiler → Provider Harness → Response Validation → Repair Loop → Critique → Quality Gate v2
```

## Core files

- `index.html` — static app shell and research-lab UI.
- `src/app.js` — preserved stable manual strategic-analysis workflow.
- `src/research-engine.js` — isolated alpha workflow orchestrator.
- `src/research/prompt-builders.js` — plan/deep-research/synthesis prompt builders.
- `src/research/provider-core.js` — response contracts, JSON extraction, response validation, repair routing, stable hash, and validation summaries.
- `src/research/provider-fixtures.js` — deterministic valid/malformed/noisy provider contract fixtures.
- `src/research/mock-provider.js` — deterministic local provider outputs for plan/synthesis/repair/critique/source-discipline tasks.
- `src/research/openai-compatible-provider.js` — BYOK OpenAI-compatible chat-completions adapter.
- `schema/strategic-analysis.schema.json` — schema for the final strategic analysis object.
- `schema/research-workflow.schema.json` — schema for research packets, evidence, causal links, analysis brief, diagnostics, provider run ledger, response validation, and repair trace.
- `fixtures/research/sample-research-workflow-en.json` — research workflow regression fixture.
- `fixtures/provider/` — provider response fixtures for accepted, rejected, and noisy response cases.

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

## Provider UX boundary

The app intentionally keeps browser-global modules instead of introducing Vite/TypeScript yet. v0.8 adds provider-contract and prompt previews so a user can inspect the expected response shape, prompt size, fingerprint, privacy mode, diagnostics, and fixture-suite status before backend integration.

```text
src/research-engine.js = UI orchestration + state
src/research/*.js      = provider/prompt/reliability primitives
```

## Design rule

The research engine must work without live AI. AI providers remain optional and subordinate to the schema, response contracts, run ledger, and Quality Gate.


## v0.13.0-beta backend proxy layer

The backend proxy is optional and independent from the static app.

```text
Browser Provider Harness
→ src/research/backend-proxy-provider.js
→ POST /api/provider-task
→ Cloudflare Worker
→ AI provider using OPENAI_API_KEY server secret
→ JSON response
→ provider-core validation
→ repair fallback if needed
→ Run Ledger
```

Security boundary:

```text
Browser never receives OPENAI_API_KEY.
Research packets never export provider keys.
Hosted proxy calls require explicit user opt-in.
Manual mode and MockProvider continue to work without backend.
```


## v0.13.0-beta — Source-Assisted Backend Planning Layer

This increment adds the planning layer for future source-assisted research. It does **not** perform live crawling, scraping, or factual source verification.

Added capabilities:
- Source connector registry with `manual_mock`, planned web search, GitHub, Hacker News, YouTube, Reddit, and Polymarket connectors.
- Source task contracts for source planning, query planning, claim extraction, evidence scoring, and source clustering.
- Planning-only backend endpoint `POST /api/source-task`.
- Source policy object enforcing `live_fetching_enabled: false`.
- Source diagnostics and source fixture suite.
- Quality Gate v2 source-planning, source-policy, and source-fixture scores.

Operational rule: the source layer may prepare requests and evidence-extraction contracts, but it must not claim real source verification until a compliant fetch/search connector is implemented.

## v0.13 Source Import Adapter

The source-import layer is a conservative ingestion bridge. It parses pasted external research outputs into candidate Evidence Matrix rows. It infers source type, date, URL presence, public-signal score, and evidence strength, but it never claims verification.

Data flow:

```text
Pasted research output → Source Import Adapter → Import preview → Evidence Matrix candidates → User review/linking → Analysis Compiler
```

The adapter is intentionally separate from source connectors. Connectors plan future live source tasks; the import adapter handles manually collected or externally generated research artifacts.


## v0.13.0-beta — Evidence Review Queue

Source-imported candidates are now routed through `evidence_review_queue` and must be accepted, edited, or rejected before entering `evidence_matrix`. This preserves evidence discipline and prevents pasted research outputs from contaminating the analysis state without human review.
