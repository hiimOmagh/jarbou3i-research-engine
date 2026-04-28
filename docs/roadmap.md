# Roadmap

## Completed lab increments

- `v0.1.0-alpha`: Research Workflow Skeleton.
- `v0.2.0-alpha`: Evidence + Causal Link Workbench.
- `v0.3.0-alpha`: Analysis Compiler + Diagnostics.
- `v0.4.0-alpha`: Provider Harness + Run Ledger.
- `v0.5.0-alpha`: BYOK Provider Alpha.
- `v0.6.0-alpha`: Provider Response Validation + Repair Loop.
- `v0.7.0-alpha`: Provider Module Split + Prompt Hardening.
- `v0.8.0-alpha`: Provider UX + Contract Fixtures.
- `v0.9.0-beta`: Hosted Backend Proxy Prototype.
- `v0.10.0-beta`: Backend Proxy Smoke Tests + Local Worker Guide.
- `v0.11.0-beta`: Source-Assisted Backend Planning Layer.
- `v0.12.0-beta`: Source Import Adapter.
- `v0.13.0-beta`: Evidence Review Queue.
- `v0.14.0-beta`: Provider Identity + Billing Abstraction.
- `v0.19.0-beta`: Portable Account Mock Flow.

## Current focus

`v0.19.0-beta` keeps portable-account/OAuth support mocked. It simulates account linking, token refresh, disconnect, and safe status export without real credentials or live provider calls.

## Next candidate

`v0.19.0-beta — Provider Mode Hardening + Browser QA`.

Suggested scope:

- Browser E2E for provider mode switching.
- Browser E2E for portable connect/refresh/disconnect.
- Visual QA for provider diagnostics on mobile.
- Stronger privacy assertions for exports and run ledgers.
- Optional provider-mode comparison table in UI.

## Deferred until after v1.0 candidate

- Real portable OAuth/PKCE integration.
- Real source crawling/search APIs.
- Multi-source connector backend.
- User accounts or cloud storage.
