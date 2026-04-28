# Jarbou3i Research Engine

Experimental next-generation research workflow layer for the Jarbou3i Model.

This repository is intentionally separate from the stable `Jarbou3i_Model` public repo. It is a lab for research planning, evidence discipline, causal links, analysis compilation, provider-ready AI workflows, critique, hosted-provider experiments, portable-account experiments, privacy-safe exports, browser QA, migration safety, module boundaries, and Quality Gate v2. The stable manual workflow remains preserved inside the app.

## Current version

`v0.20.0-beta — Privacy Audit Hardening`

Manual/private mode remains the default. This beta promotes export privacy from a sanitation helper to an explicit release gate. JSON exports now pass through a privacy guard and a final audit scan before download.

## What this beta adds

- `src/research/privacy-audit.js`
- `tests/privacy-audit-check.mjs`
- `tests/privacy-release-gate-check.mjs`
- `fixtures/privacy/browser-generated-export-v0.20.json`
- `docs/privacy-audit.md`
- `docs/v0.20.0-beta-privacy-audit-hardening.md`
- `tests/v020-no-browser-suite.mjs`

The previous v0.18 module split remains active. The main orchestration file still delegates stable helper, state, export, quality, provider, source, and evidence-review boundaries into focused modules.

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
npm run test:v020:no-browser
```

Browser tests require Playwright browsers:

```bash
npx playwright install --with-deps
npm run test:browser:provider
npm run test:browser
```

Full v0.20 QA target:

```bash
npm run test:v020
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
npm run test:v020:no-browser
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
