# Jarbou3i Research Engine

Experimental research-to-strategy workflow layer for schema-governed strategic analysis. The app remains a static, browser-first workspace with manual/private mode preserved as the default operating mode.

## Current version

`v1.0.6 — Documentation + Release Packaging Cleanup`

This patch cleans the stable release package without changing runtime capability. It corrects historical release labels, adds a canonical release manifest, adds a packaging hygiene gate, and keeps the v1.0.5 onboarding layer intact.

## What this patch changes

- Corrects historical README, changelog, QA matrix, and versioned-doc labels.
- Removes a duplicate/misnamed browser-QA release document.
- Adds `RELEASE_MANIFEST.md` as the canonical package inventory.
- Adds `.releaseignore` to document what should not be included in release archives.
- Adds `tests/release-packaging-cleanup-check.mjs`.
- Adds `tests/v106-no-browser-suite.mjs`.
- Adds v1.0.6 migration and privacy snapshots.

## Compatibility boundary

- No provider behavior change.
- No OAuth behavior change.
- No backend endpoint behavior change.
- No source connector behavior change.
- No storage model change.
- No schema-breaking change.
- Manual/private mode remains first-class.
- Existing advanced panels remain collapsed by default.

## Stable workflow

```text
Topic/context
→ Research Plan
→ Evidence Matrix
→ Evidence Review Queue
→ Causal Links
→ Analysis Brief Compiler
→ Provider Harness: mock / dry-run / BYOK / hosted proxy / portable mock
→ Provider Response Validation
→ Controlled Repair Loop
→ Privacy Export Guard
→ Privacy Audit Release Gate
→ Quality Gate
→ Export Pack
```

## First-run workflow

The v1.0.5 onboarding layer remains active in v1.0.6:

```text
Topic → Plan → Evidence → Review queue → Quality gate → Safe export
```

The first-run state is local-only and exports only safe onboarding metadata.

## Source connector contract

```text
GitHub public metadata → source result ledger → Evidence Review Queue → human review → Evidence Matrix
```

The first real connector is intentionally limited to public GitHub repository/release/language metadata. It preserves source URLs and dates, records source fetching in the source run ledger, and queues evidence candidates for review.

## Backend hardening contract

The optional hosted proxy enforces:

```text
Structured errors: error_code + error_category + retryable + request_id
CORS allow-list: ALLOWED_ORIGINS
Rate limiting: RATE_LIMIT_SECONDS
Request limits: MAX_BODY_BYTES + MAX_PROMPT_CHARS
Upstream limits: MAX_UPSTREAM_BYTES + PROVIDER_TIMEOUT_MS
Model policy: ALLOWED_MODELS
Audit policy: AUDIT_LOGS_ENABLED with metadata-only redaction
```

## Privacy export contract

Final exported payloads must report:

```text
privacy_export.release_gate: pass
privacy_export.post_redaction_issue_count: 0
privacy_export.key_exported: false
privacy_export.raw_token_exported: false
privacy_export.access_token_exported: false
privacy_export.refresh_token_exported: false
```

Safe derived metadata such as token hashes and exported-false flags remains allowed. Raw keys, raw tokens, bearer strings, and secret-shaped values are blocked from final export payloads.

## Provider safety model

```text
Default: MockProvider / dry-run only
BYOK live calls: require provider=openai_compatible + API key + live opt-in
Hosted live calls: require provider=backend_proxy + proxy endpoint + live opt-in
Portable account mode: provider=portable_oauth uses a local mock OAuth lifecycle only
Backend key storage: server environment secret only
Portable account storage: token hash only; no raw access/refresh token exists
Exports: keys and raw tokens are blocked by privacy guard and audit release gate
Validation: provider output must pass contract checks before application
```

## Local QA

```bash
npm install
npm run test:qa
npm run test:privacy
npm run test:provider
npm run test:source
npm run test:backend
npm run test:export-pack
npm run test:quality
npm run test:migrations
npm run test:release-packaging
npm run test:v106:no-browser
```

Browser tests require Playwright browsers:

```bash
npx playwright install --with-deps
npm run test:browser:provider
npm run test:browser:layout
npm run test:browser:visual
npm run test:browser
```

Full release gate:

```bash
npm run test:ci
```

## Deployment

The app remains static and GitHub Pages-compatible. The optional Cloudflare Worker backend scaffold is present for hosted proxy experiments, but the app must continue to work without it.

## Release history map

| Version | Release focus | Runtime capability added? |
|---|---|---:|
| v1.0.6 | Documentation + Release Packaging Cleanup | No |
| v1.0.5 | Onboarding + First-Run Success | Yes, local-only onboarding metadata/UI |
| v1.0.4 | Browser QA + Visual Regression Hardening | No |
| v1.0.3 | Screen Discipline Patch | No |
| v1.0.2 | UX Stabilization Patch | No |
| v1.0.1 | Patch-only Stabilization | No |
| v1.0.0 | Public Beta / Stable Research Engine | No, release promotion |
| v0.29.0-rc.1 | Release Candidate Freeze | No, freeze metadata |
| v0.28.0-beta | Real Portable OAuth Spike | Development spike only; no production OAuth |
| v0.27.0-beta | Web Search Provider Abstraction | Dry-run abstraction only |
| v0.26.0-beta | Real Source Connector Prototype | Review-gated GitHub public metadata connector |
| v0.25.0-beta | Real Backend Provider Hardening | Optional hosted proxy hardening |
| v0.24.0-beta | Export Pack v2 | Structured export bundle |
| v0.23.0-beta | Advanced Quality Gate v3 | Quality diagnostics |
| v0.22.0-beta | Analysis Template System | Template selection |
| v0.21.0-beta | Project Workspace + Local Storage Management | Local-only project storage |
| v0.20.0-beta | UX Reliability Pass | Reliability helpers |
| v0.19.0-beta | Privacy Audit Hardening | Privacy audit gate |
| v0.18.0-beta | Module Split | Architecture/module split |
| v0.17.0-beta | State Migration + Version Compatibility Layer | Migration layer |
| v0.16.0-beta | Provider Mode Browser QA + Privacy Export Tests | QA hardening |
| v0.15.0-beta | Portable Account Mock Flow | Local mock flow only |
