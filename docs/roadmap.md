# Roadmap

## v0.1.0-alpha

Research Workflow Skeleton: plan, evidence matrix, mock synthesis, critique, Quality Gate v2 draft.

## v0.2.0-alpha

Evidence + Causal Link Workbench: editable evidence, research-packet import/export, causal-link creation and inference.

## v0.3.0-alpha

Analysis Compiler + Diagnostics: source clusters, layer coverage, gap detection, synthesis prompt, analysis brief export.

## v0.4.0-alpha

Provider Harness + Run Ledger: provider-ready payloads, response contracts, deterministic mock provider tasks, source-discipline audit, and run-ledger export.

## v0.5.0-alpha

BYOK Provider Alpha: OpenAI-compatible endpoint/model/key settings, memory-only key default, explicit live-call opt-in, dry-run payload builder, provider safety metadata.

## v0.6.0-alpha

Provider Response Validation Alpha: parse provider responses, validate task contracts, reject bad output, route invalid output through a controlled repair fallback, and record validation/repair metadata in the Run Ledger.

## v0.7.0-alpha

Provider Module Split + Prompt Hardening: move mock/OpenAI provider, response validators, repair routing, stable hashing, JSON extraction, and prompt builders into dedicated static modules.

## v0.8.0-alpha

Provider UX + Contract Fixtures: add provider-task fixtures, response-contract previews, prompt previews, diagnostics export, and stronger malformed-response tests.

## v0.9.0-beta

Hosted Backend Proxy Prototype: optional Cloudflare Worker proxy, server-side provider secret, input limits, CORS controls, secret stripping, backend proxy provider adapter, and backend QA gate.

## v0.10.0-beta

Backend Proxy Smoke Tests + Local Worker Guide: executable Worker smoke tests, local Worker `.dev.vars` guide, mock upstream fixture, production checklist, and stronger backend QA around secrets, limits, CORS, health, and provider-task success.

## v1.0.0

Stable Research Engine: proven research workflow, browser QA, accessibility QA, schema governance, optional AI integration, privacy controls, and documented merge criteria back into the stable Jarbou3i product line.

## Later

True source-assisted backend: `/search`, `/fetch-source`, `/extract-claims`, `/score-evidence`, and `/cluster-evidence`. This must come after backend proxy stability and source/legal policy review.


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

## After v0.14

Current: v0.14.0-beta — Evidence Review Queue. Imported evidence now moves through accept/edit/reject states before joining the main Evidence Matrix permanently.

Next candidate: v0.14.0-beta — Provider Identity + Billing Abstraction.


## v0.14.0-beta — Evidence Review Queue

Imported source candidates now enter a review queue before promotion to the Evidence Matrix.
