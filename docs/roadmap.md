# Roadmap

## v0.1.0-alpha — Research Workflow Skeleton

Status: built.

Scope:

- Research Plan panel
- Evidence Matrix panel
- Mock AI workflow
- Quality Gate v2 draft
- Research schema and tests

## v0.2.0-alpha — Provider Abstraction Hardening

Planned:

- Move mock-provider logic into `src/ai/mockProvider.js`.
- Add `src/ai/providerContract.js`.
- Add mock response fixtures for valid, malformed, incomplete, and critique outputs.
- Add provider tests.

## v0.3.0-alpha — Evidence/Causal Editor

Planned:

- Dedicated causal-link editor.
- Evidence clustering UI.
- Better source diversity scoring.
- Import/export research workflow JSON.

## v0.4.0-beta — BYOK AI

Planned:

- OpenAI-compatible direct browser provider.
- API key memory-only by default.
- Generate, repair, and critique actions.
- Security tests ensuring keys are not exported or logged.

## v0.5.0-beta — Hosted Proxy Experiment

Planned:

- Cloudflare Worker backend prototype.
- Environment-secret provider key.
- Rate limiting and input-size limits.
- Hosted mode beside manual and BYOK modes.
