# Jarbou3i Research Engine

Experimental next-generation research workflow layer for the Jarbou3i Model.

This repository is intentionally separate from the stable `Jarbou3i_Model` public repo. It is a lab for research planning, evidence discipline, causal links, analysis compilation, provider-ready AI workflows, critique, hosted-provider experiments, portable-account experiments, privacy-safe exports, browser QA, migration safety, module boundaries, and Quality Gate v3. The stable manual workflow remains preserved inside the app.

## Current version

`v1.0.2 — Public Beta / Stable Research Engine`

Manual/private mode remains the default. This beta adds the first controlled live source connector: GitHub public repository metadata through the hardened backend `/api/source-task` endpoint. Fetched metadata becomes Evidence Review Queue candidates and never bypasses human review. No real OAuth, private repository access, or scraping is added.

## What this beta adds

- GitHub public repository metadata connector: `github_public_repo`
- backend source fetch support in `/api/source-task`
- public repository, release, and language metadata retrieval
- Evidence Review Queue candidate generation from fetched metadata
- `source_results` ledger in research packets and schema
- `tests/github-source-connector-check.mjs`
- `tests/v026-no-browser-suite.mjs`
- `fixtures/migrations/v0.25.0-packet.json`
- `fixtures/privacy/browser-generated-export-v0.29.json`
- `docs/v1.0.2-public-beta-stable-research-engine.md`

The previous backend hardening, Export Pack v2, Quality Gate v3, analysis templates, local workspace, migration layer, and privacy audit release gate remain active.

## Source connector contract

```text
GitHub public metadata → source result ledger → Evidence Review Queue → human review → Evidence Matrix
```

The first real connector is intentionally limited to public GitHub repository/release/language metadata. It preserves source URLs and dates, records source fetching in the source run ledger, and queues evidence candidates for review.

## Backend hardening contract

The optional hosted proxy now enforces:

```text
Structured errors: error_code + error_category + retryable + request_id
CORS allow-list: ALLOWED_ORIGINS
Rate limiting: RATE_LIMIT_SECONDS
Request limits: MAX_BODY_BYTES + MAX_PROMPT_CHARS
Upstream limits: MAX_UPSTREAM_BYTES + PROVIDER_TIMEOUT_MS
Model policy: ALLOWED_MODELS
Audit policy: AUDIT_LOGS_ENABLED with metadata-only redaction
```

## Intended pipeline

```text
Topic/context
→ Research Plan
→ Evidence Matrix
→ Evidence Review Queue
→ Causal Links
→ Analysis Brief Compiler
→ Provider Harness: mock / dry-run / BYOK / hosted proxy / portable mock
→ Provider Response Validation
→ Controlled Repair Loop if needed
→ Privacy Export Guard
→ Privacy Audit Release Gate
→ Strategic Analysis JSON
→ Critique
→ Quality Gate
→ Export
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
Portable account mode: provider=portable_oauth uses a local mock OAuth lifecycle only in this beta
Backend key storage: server environment secret only
Portable account storage: token hash only; no raw access/refresh token exists
Exports: keys and raw tokens are blocked by the privacy guard and audit release gate
Validation: provider output must pass contract checks before being applied
```

## Local QA

```bash
npm install
npm run test:qa
npm run test:privacy
npm run test:privacy:audit
npm run test:privacy:release-gate
npm run test:export-pack
npm run test:backend
npm run test:backend:hardening
npm run test:v025:no-browser
```

Browser tests require Playwright browsers:

```bash
npx playwright install --with-deps
npm run test:browser:provider
npm run test:browser
```

Full v0.25 QA target:

```bash
npm run test:v025
```

## Deployment

The app remains static and GitHub Pages-compatible. The optional Cloudflare Worker backend scaffold is present for hosted proxy experiments, but the app must continue to work without it.

### v0.20.0-beta — UX Reliability Pass

This release improves interaction reliability without changing the core workflow contract.

Added:

- provider mode guide for mock, BYOK, backend proxy, and portable-account mock modes
- richer empty states for research panels
- disabled states for unavailable actions
- destructive-action confirmations before imports and reset-style operations
- export confirmation summary before packet download
- `src/research/ux-reliability.js`
- `tests/ux-reliability-check.mjs`
- `tests/v020-no-browser-suite.mjs`

Run:

```bash
npm run test:v025:no-browser
npm run test:browser:provider
```

## v0.22.0-beta — Project Workspace

This release adds local-only project workspace management. Users can save named research projects, duplicate them, delete them, export a project bundle, and import a project bundle later. The workspace remains browser-local and does not add accounts, cloud persistence, real OAuth, or live source fetching.

Key files:

- `src/research/project-workspace.js`
- `tests/project-workspace-check.mjs`
- `tests/v021-no-browser-suite.mjs`
- `docs/v0.22.0-beta-project-workspace.md`

Run the v0.22 no-browser gate:

```bash
npm run test:v021:no-browser
```

## v0.22.0-beta — Analysis Template System

v0.22 adds selectable analysis templates without changing the shared evidence/review discipline.

Templates included:

- Strategic Analysis Engine
- Geopolitical Event Analysis
- Policy Impact Analysis
- Market / Technology Trend Analysis
- Actor Incentive Map
- Contradiction Audit
- Scenario Forecast

New files:

- `src/research/analysis-templates.js`
- `tests/analysis-template-check.mjs`
- `docs/v0.22.0-beta-analysis-template-system.md`

Run:

```bash
npm run test:templates
npm run test:v022:no-browser
```


## v1.0.2 — Advanced Quality Gate v3

v0.24 upgrades the research quality layer into an actionable diagnostic gate. It adds structured scoring for completeness, evidence strength, contradiction coverage, source diversity, actor/layer coverage, causal-link density, provider safety, privacy safety, migration safety, and template fit.

New files:

- `tests/quality-gate-v3-check.mjs`
- `tests/v023-no-browser-suite.mjs`
- `docs/v1.0.2-advanced-quality-gate-v3.md`

Run the v0.24 no-browser gate:

```bash
npm run test:v023:no-browser
```

## v1.0.2 — Web Search Provider Abstraction

This release adds a provider-neutral web-search abstraction without enabling live search. The new `web_search_api` connector builds dry-run query plans with provider identity, query budgets, source-diversity targets, and counter-evidence requirements. It does not scrape, does not store browser-side search API keys, and does not promote results directly into the Evidence Matrix.

Run the new targeted check:

```bash
npm run test:source:web-search
```

Full v0.29 no-browser release check:

```bash
npm run test:v027:no-browser
```

## v1.0.2 — Real Portable OAuth Spike

This release adds a controlled OAuth/PKCE development spike for `portable_oauth` provider mode. It can build a real authorization URL, parse callback URLs, and exchange authorization codes through the backend token-exchange endpoint. Token responses are sanitized into hashes/status metadata only.

The spike is not production OAuth. It exports no raw tokens or PKCE verifier, enables no live provider inference, and blocks refresh until a backend token vault is designed.

Run:

```bash
npm run test:provider:oauth
npm run test:v028:no-browser
```

## v1.0.2 — Public Beta / Stable Research Engine

This release promotes the v0.29.0-rc.1 baseline after external CI/browser validation was reported successful. It adds stable release metadata while preserving the RC privacy/export/migration/browser gate discipline.

Allowed after RC:

```text
bugfix
docs
qa
a11y
privacy_audit
migration_compatibility
release_packaging
```

Blocked after RC:

```text
new_major_feature
new_live_provider
new_source_connector
oauth_production_enablement
schema_break_without_migration
secret_export_weakening
```

Run:

```bash
npm run test:rc
npm run test:v029:no-browser
npm run test:browser:provider
```

## v1.0.2 — Patch-only Stabilization

v1.0.2 is a patch-only stabilization release. It fixes release-copy and CI wrapper alignment defects without adding new providers, connectors, OAuth behavior, source fetching, or schema-breaking capability.

Patch QA:

```bash
npm run test:patch
npm run test:stable
npm run test:v102:no-browser
```

## v1.0.2 — UX Stabilization Patch

This patch improves product framing without changing engine capability. The research lab now has workflow tabs, a release-health summary, and collapsed advanced panels so the stable product no longer opens as one long developer console.

Run the patch gate:

```bash
npm run test:patch
npm run test:ux:stabilization
```
