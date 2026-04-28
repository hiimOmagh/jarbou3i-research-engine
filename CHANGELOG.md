# Changelog

## v0.13.0-beta — Evidence Review Queue

Thirteenth experimental research-engine release. This beta adds a review gate between source imports and the main Evidence Matrix.

### Added

- Evidence Review Queue panel.
- Pending/accepted/rejected lifecycle for imported evidence candidates.
- Accept, edit, reject, accept-all, export-queue, and clear-resolved actions.
- `evidence_review_queue` and `evidence_review_report` in the research workflow packet.
- `tests/evidence-review-queue-check.mjs` and `npm run test:evidence-review`.
- Evidence Review score in Quality Gate v2.

### Changed

- Source imports no longer write directly into the Evidence Matrix.
- `Import as evidence` now sends candidates to the review queue.
- Source import records are marked `queue_only: true` and carry `review_ids`.

### Guardrails

- Imported source candidates remain unverified until reviewed.
- The review report explicitly records `live_fetching_performed: false` and `verification_claimed: false`.
- Manual/private mode, MockProvider, BYOK, hosted proxy, source planning, and provider validation remain preserved.


## v0.10.0-beta — Backend Proxy Smoke Tests + Local Worker Guide

Tenth experimental research-engine release. This beta hardens the optional hosted backend proxy with executable Worker smoke tests and a local testing guide.

### Added

- Backend Worker smoke test importing the Cloudflare Worker directly in Node.
- `tests/backend-worker-smoke.mjs` and `npm run test:backend:worker`.
- `backend/.dev.vars.example` for local Worker configuration.
- `backend/fixtures/mock-upstream-chat-completion.json` mock upstream fixture.
- `docs/backend-production-checklist.md` production-readiness checklist.
- Hosted backend proxy provider option in the Provider Harness.
- `src/research/backend-proxy-provider.js` browser adapter.
- `backend/cloudflare-worker.js` Cloudflare Worker scaffold.
- `wrangler.toml` prototype configuration.
- Backend endpoints: `GET /api/health` and `POST /api/provider-task`.
- Environment-secret pattern using `OPENAI_API_KEY`.
- Task allow-list, prompt-length limits, body-size limits, CORS controls, and secret-field stripping.
- Hosted proxy privacy mode: `hosted_proxy_user_opt_in`.
- Backend proxy safety labels: `server_environment_secret` and `key_exported: false`.
- Quality Gate v2 backend proxy score.
- `tests/backend-proxy-check.mjs`; `npm run test:backend` now runs both static backend contract and Worker smoke checks.

### Changed

- Provider Harness still supports MockProvider, OpenAI-compatible BYOK, and Hosted backend proxy.
- Backend QA now verifies health, OPTIONS preflight, missing-secret rejection, task allow-listing, prompt-size rejection, mock-upstream success, usage passthrough, and secret non-exposure.
- “Enable live BYOK calls” was generalized to “Enable live provider calls.”
- Provider safety logic distinguishes browser BYOK from server-held backend secrets.
- Run Ledger records hosted proxy runs without exposing provider secrets.

### Guardrails

- Backend proxy is optional and off by default.
- Manual/private mode and MockProvider remain first-class.
- Hosted calls require explicit live-call opt-in.
- The proxy strips client-sent secret fields and never returns the server API key.
- Worker smoke tests fail if client-side secret fields leak into upstream request bodies or Worker responses.
- Provider output still must pass response-contract validation before affecting analysis state.

## v0.8.0-alpha — Provider UX + Contract Fixtures

Eighth experimental research-engine release.

### Added

- Provider response-contract preview for `plan`, `synthesis`, `repair`, `critique`, and `source_discipline`.
- Prompt preview with task, provider, prompt length, prompt fingerprint, input fingerprint, privacy mode, and truncated preview content.
- Provider diagnostics panel and export.
- `src/research/provider-fixtures.js` with deterministic contract fixtures.
- `fixtures/provider/` with valid, malformed, and noisy provider-response examples.
- `tests/provider-fixtures-check.mjs` and `npm run test:provider:fixtures`.
- Quality Gate v2 Contract Fixtures score.
- Schema definitions for `provider_diagnostics` and `provider_fixture_report`.

### Changed

- Provider response contracts now include title, purpose, required fields, recommended fields, rejection rules, diagnostic hints, and example shapes.
- Provider Harness is now inspectable before execution: users can preview the contract and prompt before dry-run/live BYOK.
- Provider packet exports may include diagnostics and fixture-suite reports, but still exclude API keys.

### Guardrails

- No backend dependency was introduced.
- MockProvider remains default.
- Live BYOK remains opt-in only.
- Contract fixtures test malformed output before any hosted provider integration.

## v0.6.0-alpha — Provider Response Validation Alpha

Sixth experimental research-engine release.

### Added

- Provider response parser with fenced-JSON cleanup and JSON-object extraction fallback.
- Task-specific response validation for `plan`, `synthesis`, `repair`, `critique`, and `source_discipline`.
- Controlled repair fallback using the internal mock provider when provider output fails its response contract.
- Run Ledger fields: `response_validation` and `repair_trace`.
- `validation_error` and `repaired` run statuses.
- Quality Gate v2 Response Validation score.
- Top-level `provider_validation` and `repair_trace` in research packets.
- `tests/provider-response-check.mjs` and `npm run test:provider`.
- Schema definitions for `response_validation` and `repair_trace`.

### Changed

- Provider outputs are no longer inserted into the analysis import box unless accepted by response validation.
- Provider-harness score now counts accepted and repaired runs, not raw provider success only.
- Research packet exports include validation metadata but still exclude API keys.

### Guardrails

- Invalid provider output is recorded, not silently trusted.
- Repair fallback is explicitly marked in the run ledger.
- Repair improves structural validity only; it does not verify factual claims or sources.

## v0.5.0-alpha — BYOK Provider Alpha

Fifth experimental research-engine release.

### Added

- OpenAI-compatible BYOK provider option in the Provider Harness.
- Endpoint and model configuration fields.
- API key password field.
- Memory-only key handling by default.
- Optional local-device key persistence behind explicit user checkbox.
- Explicit “Enable live BYOK calls” opt-in.
- Dry-run provider request builder.
- Provider safety metadata in payloads and run ledgers.
- `callOpenAICompatibleProvider()` adapter for chat-completions-compatible APIs.
- Source-safe provider payloads that exclude API keys.
- BYOK safety score in Quality Gate v2.
- Research workflow schema upgraded with `provider_config` and run-level `provider_safety`.

### Preserved

- MockProvider remains default and works without API keys or backend.
- Manual prompt copy workflow.
- JSON import and validation.
- Evidence Matrix.
- Causal Link Workbench.
- Analysis Compiler and diagnostics.
- Run Ledger export.
- Trilingual app shell and RTL handling.

### Guardrails

- API keys are never exported into research packets, analysis briefs, reports, or run ledgers.
- Live provider calls require explicit opt-in.
- Dry-run mode is available for provider payload inspection before any network call.

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


## v0.11.0-beta — Source-Assisted Backend Planning Layer

This increment adds the planning layer for future source-assisted research. It does **not** perform live crawling, scraping, or factual source verification.

Added capabilities:
- Source connector registry with `manual_mock`, planned web search, GitHub, Hacker News, YouTube, Reddit, and Polymarket connectors.
- Source task contracts for source planning, query planning, claim extraction, evidence scoring, and source clustering.
- Planning-only backend endpoint `POST /api/source-task`.
- Source policy object enforcing `live_fetching_enabled: false`.
- Source diagnostics and source fixture suite.
- Quality Gate v2 source-planning, source-policy, and source-fixture scores.

Operational rule: the source layer may prepare requests and evidence-extraction contracts, but it must not claim real source verification until a compliant fetch/search connector is implemented.

## v0.12.0-beta — Source Import Adapter

- Added manual Source Import Adapter for pasted deep-research, last30days-style, and generic research outputs.
- Added candidate evidence extraction with source URL/date/type inference, public-signal scoring, and unverified-import metadata.
- Added import preview, import-to-Evidence-Matrix, clear import, and import-report export actions.
- Added `src/research/source-import-adapter.js`, source import fixtures, and source import QA checks.
- Extended research workflow schema with `source_imports` and `source_import_report` while preserving `live_fetching_performed: false` and `verification_claimed: false`.
- Preserved manual mode, provider safety, backend proxy scaffold, and no-live-crawling policy.
