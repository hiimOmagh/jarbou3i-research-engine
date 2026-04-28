# Changelog

## v0.9.0-beta — Hosted Backend Proxy Prototype

Ninth experimental research-engine release and first beta-marked backend integration prototype.

### Added

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
- `tests/backend-proxy-check.mjs` and `npm run test:backend`.

### Changed

- Provider Harness now supports MockProvider, OpenAI-compatible BYOK, and Hosted backend proxy.
- “Enable live BYOK calls” was generalized to “Enable live provider calls.”
- Provider safety logic distinguishes browser BYOK from server-held backend secrets.
- Run Ledger records hosted proxy runs without exposing provider secrets.

### Guardrails

- Backend proxy is optional and off by default.
- Manual/private mode and MockProvider remain first-class.
- Hosted calls require explicit live-call opt-in.
- The proxy strips client-sent secret fields and never returns the server API key.
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
