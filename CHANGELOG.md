# Changelog

## v0.24.0-beta — Export Pack v2

- Added `src/research/export-pack.js` for structured professional export bundles.
- Added Export Pack v2 UI action and export summary output.
- Added export artifacts: `research-packet.json`, `analysis-brief.md`, `evidence-matrix.csv`, `review-queue.csv`, `provider-run-ledger.json`, `quality-report.json`, and `privacy-audit.json`.
- Added `export_pack` metadata to workflow packets, schema, fixture, and migration defaults.
- Added `tests/export-pack-v2-check.mjs` and `tests/v024-no-browser-suite.mjs`.
- Added v0.23 migration fixture and v0.24 privacy export fixture.
- Preserved manual/private mode, privacy audit release gate, migration safety, and provider/source review guardrails.


## v0.20.0-beta — Privacy Audit Hardening

- Added privacy audit release-gate module.
- Added final exported-payload scanner after redaction.
- Added browser-generated export fixture under `fixtures/privacy`.
- Added privacy audit and release-gate tests.
- Added `docs/privacy-audit.md` and v0.20 release notes.
- Bumped workflow, schema, fixtures, backend proxy, and app metadata to `0.20.0-beta`.


## v0.18.0-beta — Research Engine Module Split

Eighteenth experimental research-engine release. This beta is a behavior-preserving architecture release that moves stable responsibilities out of `src/research-engine.js` into focused browser modules.

### Added

- `src/research/render-helpers.js` for translation copy, escaping, and label/placeholder rendering helpers.
- `src/research/state-store.js` for default state, hydration, local persistence, and evidence renumbering.
- `src/research/evidence-controller.js` for evidence ID and score helper logic.
- `src/research/evidence-review-controller.js` for review queue metrics and pending selection.
- `src/research/provider-controller.js` for provider config sanitation boundaries.
- `src/research/source-controller.js` for source policy boundaries.
- `src/research/export-controller.js` for privacy-safe JSON download routing.
- `src/research/quality-gate.js` for Quality Gate v2 scoring.
- `docs/v0.18.0-beta-module-split.md` with the module dependency graph.
- Updated `tests/research-module-check.mjs` to enforce v0.18 module order and delegation.

### Changed

- `src/research-engine.js` now delegates stable helper/state/export/quality logic to focused modules.
- Current release scripts moved to `test:v018` and `test:v018:no-browser`.
- Migration target was `0.18.0-beta` and supported legacy packets through `0.17.0-beta`.

### Guardrails

- No behavior change intended.
- No real OAuth, real source connector, or live-provider expansion introduced.
- Privacy-safe export remains the JSON download boundary.
- Migration-first import remains active.
- Manual/private mode remains first-class.

## v0.17.0-beta — State Migration + Version Compatibility Layer

Seventeenth experimental research-engine release. This beta adds a compatibility layer so older research packets can be upgraded safely before validation/import.

### Added

- `src/research/migrations.js` packet migration module.
- `packet_migration_report` in workflow packets and schema.
- Legacy migration fixtures for `v0.11.0-beta` through `v0.16.0-beta`.
- `tests/migration-check.mjs` migration compatibility and secret-redaction checks.
- `tests/no-browser-qa-suite.mjs` aggregate no-browser QA runner.
- `docs/v0.17.0-beta-state-migration.md`.

### Changed

- Packet import now migrates first and validates second.
- Missing legacy fields receive safe defaults.
- Evidence IDs are renumbered and causal-link evidence references are repaired.
- Provider live calls and remembered-key settings are disabled after migration.
- Workflow schema now requires `packet_migration_report`.

### Guardrails

- Migration redacts sensitive keys, raw tokens, bearer text, and secret-like strings.
- Migrated packets still pass through the privacy export guard.
- No real OAuth, real source crawling, or live provider expansion is introduced.

## v0.15.0-beta — Portable Account Mock Flow

Fifteenth experimental research-engine release. This beta adds a local portable-account/OAuth mock lifecycle so future BrainLink/OpenRouter-style provider flows can be tested without real OAuth credentials, raw tokens, or vendor dependency.

### Added

- `src/research/portable-account-mock.js` mock OAuth/PKCE-style lifecycle.
- Portable account controls: connect mock account, refresh mock token, disconnect, and export safe status.
- `portable_account` metadata in research packets and provider run-ledger entries.
- Portable Account score in Quality Gate v2.
- `tests/portable-account-check.mjs` and `npm run test:provider:portable`.

### Changed

- `portable_oauth` is now a mock-flow provider identity rather than only a placeholder.
- Provider diagnostics render portable account connection and token-hash state.
- Provider runs through `portable_oauth` use MockProvider responses when a mock account is connected; no live OAuth/provider call is made.

### Guardrails

- No raw access token or refresh token exists in the mock flow.
- Exports include token hash/status metadata only, never raw credentials.
- Live portable-account provider calls remain unsupported and blocked.
- Manual/private mode remains first-class.

## v0.14.0-beta — Provider Identity + Billing Abstraction

Fourteenth experimental research-engine release. This beta adds the identity/billing abstraction required to support BYOK, hosted proxy, and future portable-account/OAuth providers without coupling the product to one provider.

### Added

- `src/research/provider-identity.js` provider registry.
- Provider modes modeled by auth type, billing owner, key exposure, privacy mode, credential class, live support, and production status.
- Planned `portable_oauth` provider option for BrainLink/OpenRouter-style account-provider flows.
- `provider_identity` and `provider_billing_policy` in research packets and run-ledger entries.
- Provider Identity score in Quality Gate v2.
- `tests/provider-identity-check.mjs` and `npm run test:provider:identity`.

### Changed

- Provider diagnostics now expose auth type, billing owner, key exposure, and provider identity metadata.
- BYOK, hosted proxy, mock, and portable account modes now share one identity/billing contract.
- `portable_oauth` is explicitly dry-run/planned; live OAuth/PKCE is not implemented in this beta.

### Guardrails

- Manual/private mode remains first-class.
- No raw provider key or OAuth token is exported into packets, run ledgers, or reports.
- Portable account mode cannot perform live calls yet and records a live blocker if enabled.


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

## v0.20.0-beta — UX Reliability Pass

- Added UX reliability helper module.
- Added provider mode guide inside Provider Harness.
- Added rich empty states for core workflow panels.
- Added disabled-state management for unavailable actions.
- Added destructive-action confirmations before import/reset-style operations.
- Added export confirmation summary before research packet export.
- Added UX reliability tests and v0.20 no-browser QA suite.
- Preserved privacy audit release gate and provider/source safety guardrails.

## v0.22.0-beta — Project Workspace + Local Storage Management

- Added local-only project workspace management.
- Added named project save, duplicate, delete, export, and import controls.
- Added `src/research/project-workspace.js` with local storage diagnostics.
- Added `project_workspace` metadata to research packet schema and fixtures.
- Added v0.20 → v0.22 migration support.
- Added project workspace QA and v0.22 no-browser suite.
- Preserved privacy export/audit release gates and manual/private mode.

## v0.22.0-beta — Analysis Template System

- Added selectable analysis template registry.
- Added template UI, template profile export, and template fit diagnostics.
- Added analysis template metadata to research packets, research plans, and compiled briefs.
- Updated synthesis and planning prompts to include active template directives.
- Added v0.21 → v0.22 migration support.
- Added template QA and v0.22 no-browser suite.


## v0.24.0-beta — Advanced Quality Gate v3

- Upgraded `src/research/quality-gate.js` to Advanced Quality Gate v3.
- Added structured `quality_gate` export metadata to research packets.
- Added `analysis_brief.quality_gate_report`, publication readiness labels, weakest dimensions, and fix actions.
- Added v3 dimensions: completeness, evidence strength, contradiction coverage, source diversity, actor/layer coverage, causal-link density, provider safety, privacy safety, migration safety, and template fit.
- Added v0.22 → v0.24 migration fixture.
- Added `tests/quality-gate-v3-check.mjs` and `tests/v023-no-browser-suite.mjs`.
- Preserved manual/private mode, privacy audit, migration safety, source review discipline, and provider validation.
