## v1.0.6 — Documentation + Release Packaging Cleanup

### Repository hygiene hotfix

- Added `tests/repo-file-hygiene-check.mjs` for full repository file cleanup auditing.
- Added `docs/repo-cleanup-audit-v1.0.6.md` with exact deletion/retention guidance.
- Added `npm run test:repo:hygiene` and wired the hygiene guard into `test:ci:no-browser`.
- Clarified that `docs/v1.0.5-browser-qa-visual-regression-hardening.md` must be removed; `docs/v1.0.4-browser-qa-visual-regression-hardening.md` is the canonical file.


- Corrected historical release labels across README, changelog, QA matrix, and versioned docs.
- Added `RELEASE_MANIFEST.md` as the canonical package inventory for review before publishing.
- Added `.releaseignore` to document generated/local files that should not enter release archives.
- Removed the duplicate/misnamed `docs/v1.0.5-browser-qa-visual-regression-hardening.md`; v1.0.4 remains the canonical browser-QA hardening document.
- Added `docs/v1.0.6-documentation-release-packaging-cleanup.md`.
- Added `tests/release-packaging-cleanup-check.mjs` and `tests/v106-no-browser-suite.mjs`.
- Added v1.0.6 migration/privacy snapshots.
- Preserved provider, OAuth, backend, source connector, storage, and schema compatibility boundaries.

## v1.0.5 — Onboarding + First-Run Success

- Added local-only first-run guide: topic → plan → evidence → review queue → quality gate → safe export.
- Added `src/research/onboarding.js`.
- Added onboarding state persistence through local state store.
- Added export-safe `onboarding` metadata to research packets, schema, fixtures, privacy snapshots, and migration defaults.
- Added `tests/onboarding-first-run-check.mjs` and `tests/v105-no-browser-suite.mjs`.
- Preserved provider, OAuth, backend, source connector, and storage boundaries.

## v1.0.4 — Browser QA + Visual Regression Hardening

- Added browser layout persistence tests.
- Added visual regression capture scaffolding with optional strict baseline mode.
- Added browser QA hardening metadata to exported packets and schema.
- Updated CI browser gate to include provider, layout, visual capture, and full browser suite.
- Preserved patch-only boundary: no new engine feature, connector, provider, or OAuth behavior.

## v1.0.3 — Screen Discipline Patch

- Removed global section numbering from workflow cards.
- Collapsed duplicate command surfaces by default.
- Added explicit show/hide toggles and compact next-action guidance.
- Converted advanced/internal cards into collapsed accordion-style panels.
- Added `tests/screen-discipline-patch-check.mjs` and `tests/v103-no-browser-suite.mjs`.

## v1.0.2 — UX Stabilization Patch

- Added workflow navigation tabs for Analysis, Evidence, Sources, Quality & Export, and Settings / Advanced.
- Added Release Health summary card.
- Collapsed advanced/provider/backend/source/OAuth/release internals behind explicit advanced navigation.
- Added `tests/ux-stabilization-patch-check.mjs`.

## v1.0.1 — Patch-only Stabilization

- Fixed stable badge copy that still used release-candidate wording.
- Updated CI no-browser syntax gate to target the stable patch wrapper.
- Added `tests/patch-stabilization-check.mjs`.
- Preserved patch-only boundary.

## v1.0.0 — Public Beta / Stable Research Engine

- Promoted v0.29.0-rc.1 to public beta/stable baseline after external CI/browser validation was reported successful.
- Added stable release metadata while preserving RC privacy/export/migration/browser gate discipline.
- Added stable-release QA gates and v1.0.0 migration/privacy support.

## v0.29.0-rc.1 — Release Candidate Freeze

- Added release candidate freeze metadata and policy.
- Added `src/research/release-candidate.js`.
- Blocked production OAuth, new live connectors, schema-breaking changes without migration, and secret export weakening.

## v0.28.0-beta — Real Portable OAuth Spike

- Added OAuth/PKCE development spike for authorization URL generation, callback parsing, and backend-mediated token exchange.
- Sanitized token responses into hashes/status metadata only.
- Kept production OAuth and token refresh blocked until a token-vault design exists.

## v0.27.0-beta — Web Search Provider Abstraction

- Added provider-neutral web-search abstraction module.
- Added `web_search_api` connector as dry-run only.
- Added search provider identity, query budget, search policy metadata, and counter-evidence planning.

## v0.26.0-beta — Real Source Connector Prototype

- Added controlled live GitHub public repository metadata connector through backend-mediated source tasks.
- Added review-gated evidence candidate generation from fetched GitHub metadata.
- Added source result ledger metadata.

## v0.25.0-beta — Real Backend Provider Hardening

- Hardened optional hosted backend proxy with structured errors, CORS allow-listing, rate limiting, request limits, upstream timeout/size limits, model allow-listing, and metadata-only audit logging.
- Added backend hardening tests and Worker smoke coverage.

## v0.24.0-beta — Export Pack v2

- Added structured professional export bundles.
- Added `research-packet.json`, `analysis-brief.md`, `evidence-matrix.csv`, `review-queue.csv`, `provider-run-ledger.json`, `quality-report.json`, and `privacy-audit.json` artifacts.

## v0.23.0-beta — Advanced Quality Gate v3

- Upgraded quality diagnostics with weighted dimensions, weakest-dimension reporting, publication readiness, observed counts, and fix actions.

## v0.22.0-beta — Analysis Template System

- Added selectable analysis template registry and template-fit diagnostics.
- Added templates for strategic analysis, geopolitical events, policy impact, market/technology trends, actor incentives, contradiction audit, and scenario forecast.

## v0.21.0-beta — Project Workspace + Local Storage Management

- Added local-only project workspace management for saving, duplicating, deleting, exporting, and importing project bundles.

## v0.20.0-beta — UX Reliability Pass

- Added provider mode guide, stronger empty states, disabled states for unavailable actions, destructive-action confirmations, and export confirmation summary.

## v0.19.0-beta — Privacy Audit Hardening

- Added privacy audit release gate, final exported-payload scanner, and browser-generated privacy export fixture.

## v0.18.0-beta — Research Engine Module Split

- Split stable responsibilities into focused browser modules while preserving behavior.

## v0.17.0-beta — State Migration + Version Compatibility Layer

- Added packet migration module, migration report metadata, legacy fixtures, and secret-redaction migration checks.

## v0.16.0-beta — Provider Mode Browser QA + Privacy Export Tests

- Added provider-mode browser QA and privacy export tests.

## v0.15.0-beta — Portable Account Mock Flow

- Added local portable-account/OAuth mock lifecycle without real OAuth credentials, raw tokens, or vendor dependency.
