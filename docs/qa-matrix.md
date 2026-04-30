# QA Matrix

## No-browser gates

```bash
npm run test:static
npm run test:schema
npm run test:fixtures
npm run test:provider
npm run test:source
npm run test:evidence-review
npm run test:backend
npm run test:a11y:static
npm run test:privacy
npm run test:modules
npm run test:qa
```

## v0.18.0-beta specific checks

- `tests/research-module-check.mjs`
- `tests/migration-check.mjs`
- `tests/no-browser-qa-suite.mjs`
- `tests/v018-no-browser-suite.mjs`
- `npm run test:modules`
- `npm run test:migrations`
- `npm run test:v018:no-browser`
- `npm run test:v018`

Checks performed:

- focused research modules exist and load before `src/research-engine.js`
- module load order is explicit in `index.html`
- `src/research-engine.js` delegates stable helper/state/export/quality logic to modules
- engine file size stays under the v0.18 refactor ceiling
- legacy packets from v0.11 through v0.17 migrate to v0.18
- missing fields receive safe defaults
- evidence IDs are renumbered to E1/E2/...
- causal-link evidence references are repaired
- imported provider settings disable live calls and remembered keys
- migration report is exported as `packet_migration_report`
- migration redacts legacy provider secrets before import/export
- privacy export checks still pass after migration fixtures are added

## Browser checks after push

```bash
npx playwright install --with-deps
npm run test:browser:provider
npm run test:browser
```

Manual browser QA:

- switch provider to `portable_oauth`
- connect mock account
- refresh mock token
- run a provider task
- confirm run ledger records portable account metadata
- export workflow packet and confirm no raw token/key fields exist
- import a v0.17 packet and confirm the migration report appears in the exported packet
- inject a fake BYOK key with live calls disabled and confirm it never renders in the page

## v0.20.0-beta specific checks

```bash
npm run test:privacy
npm run test:privacy:audit
npm run test:privacy:release-gate
npm run test:v020:no-browser
```

Release gate requirements:

- `privacy_export.release_gate` is `pass`.
- `privacy_export.post_redaction_issue_count` is `0`.
- JSON export fixtures contain no raw provider key, access token, refresh token, bearer token, or secret-shaped value.
- Safe derived metadata such as token hashes and exported-false flags remain allowed.

## v0.20.0-beta UX reliability gate

| Area | Check |
|---|---|
| UX helper module | `node tests/ux-reliability-check.mjs` |
| No-browser release suite | `node tests/v020-no-browser-suite.mjs` |
| Provider browser QA | `npm run test:browser:provider` after Playwright install |
| Privacy audit | `npm run test:privacy` |
| Migration compatibility | `npm run test:migrations` |

v0.20 is a UX reliability release. It must not introduce live source fetching, real OAuth, or any export path that bypasses the privacy audit.

## v0.22.0-beta — Project Workspace QA

| Gate | Command | Purpose |
|---|---|---|
| Project workspace | `node tests/project-workspace-check.mjs` | Verifies local-only workspace behavior, project CRUD helpers, export/import bundle shape, and UI wiring. |
| v0.22 no-browser suite | `node tests/v021-no-browser-suite.mjs` | Runs core no-browser release gates including migration, privacy, provider/source/backend, UX, and workspace checks. |

## v0.22.0-beta — Analysis Template QA

| Gate | Command | Purpose |
|---|---|---|
| Analysis templates | `node tests/analysis-template-check.mjs` | Validates registry, template profile shape, plan application, fit diagnostics, schema, fixture, and UI wiring. |
| v0.22 no-browser suite | `node tests/v022-no-browser-suite.mjs` | Runs the v0.22 no-browser release gates. |


## v1.0.0 — Advanced Quality Gate v3 QA

| Check | Command | Purpose |
| --- | --- | --- |
| Quality Gate v3 | `node tests/quality-gate-v3-check.mjs` | Validates v3 dimensions, readiness labels, fix actions, schema, and fixture integration. |
| v0.24 no-browser suite | `node tests/v023-no-browser-suite.mjs` | Runs the v0.24 no-browser release gates. |
| Browser provider QA | `npm run test:browser:provider` | Confirms provider mode UI coverage after Playwright installation. |

## v1.0.0 — Export Pack v2 QA

| Check | Command | Purpose |
| --- | --- | --- |
| Export Pack v2 | `node tests/export-pack-v2-check.mjs` | Validates manifest, Markdown, CSV, JSON artifacts, privacy redaction, schema metadata, and v0.23 migration defaulting. |
| v0.24 no-browser suite | `node tests/v024-no-browser-suite.mjs` | Runs the v0.24 no-browser release gates. |
| Browser provider QA | `npm run test:browser:provider` | Confirms provider mode UI coverage after Playwright installation. |

Release gate: Export Pack v2 must never bypass the privacy export guard or privacy audit final pass.


## v1.0.0 — Real Backend Provider Hardening QA

| Check | Command | Purpose |
| --- | --- | --- |
| Backend proxy contract | `node tests/backend-proxy-check.mjs` | Verifies Worker, adapter, docs, and package wiring. |
| Backend hardening static gate | `node tests/backend-hardening-check.mjs` | Verifies structured errors, limits, timeout, model allow-list, audit redaction, schema, and fixture metadata. |
| Backend Worker smoke | `node tests/backend-worker-smoke.mjs` | Exercises health, CORS rejection, invalid tasks, model rejection, prompt limits, source planning, rate limiting, timeout, audit logging, and secret stripping. |
| v0.25 no-browser suite | `node tests/v025-no-browser-suite.mjs` | Runs current no-browser release gates. |
| Browser provider QA | `npm run test:browser:provider` | Confirms provider mode UI after Playwright installation. |

Release gate: backend mode remains optional, server secrets remain server-side, audit logs are metadata-only, and source-task remains planning-only.


## v1.0.0 — Real Source Connector Prototype

| Area | Check | Command |
|---|---|---|
| GitHub source connector | Public metadata connector contract + Worker mock fetch | `node tests/github-source-connector-check.mjs` |
| Source suite | Planning/import/review/GitHub connector | `npm run test:source` |
| v0.29 no-browser release gate | Full no-browser beta suite | `npm run test:v026:no-browser` |

## v1.0.0 — Web Search Provider Abstraction

| Gate | Command | Purpose |
|---|---|---|
| Web search abstraction | `npm run test:source:web-search` | Validates provider identity, query budget, dry-run query planning, backend abstraction response, and no-live-search guardrails. |
| v0.29 no-browser | `npm run test:v027:no-browser` | Runs the v0.29 no-browser release suite. |
| Browser provider QA | `npm run test:browser:provider` | Revalidates provider UI flows with Playwright. |

## v1.0.0 — Real Portable OAuth Spike

| Gate | Command | Purpose |
|---|---|---|
| OAuth/PKCE spike | `node tests/portable-oauth-spike-check.mjs` | Validates PKCE S256 generation, auth URL, callback parsing, backend token exchange, sanitized token output, and blocked refresh. |
| Provider suite | `npm run test:provider` | Includes portable mock and OAuth spike checks. |
| v0.29 no-browser | `npm run test:v028:no-browser` | Runs the v0.29 release suite. |

## v1.0.0 — Release Candidate Freeze QA

| Gate | Command | Purpose |
|---|---|---|
| RC freeze | `npm run test:rc` | Validates freeze metadata, schema, fixture, migration support, and blocked work policy. |
| RC no-browser | `npm run test:v029:no-browser` | Runs the v0.29 RC no-browser release suite. |
| Browser provider QA | `npm run test:browser:provider` | Final browser gate for provider/privacy behavior before v1. |

Release rule: only bugfixes, docs, QA, accessibility, privacy-audit, migration-compatibility, and packaging work should enter after this point.

## v1.0.5 — UX Stabilization Patch

| Gate | Command | Purpose |
|---|---|---|
| UX stabilization | `npm run test:ux:stabilization` | Verifies workflow navigation, release health summary, collapsed advanced hierarchy, and no new feature surface. |
| Patch gate | `npm run test:patch` | Runs patch stabilization + UX stabilization gates. |

## v1.0.5 — Screen Discipline Patch

| Check | Command | Purpose |
| --- | --- | --- |
| Screen discipline patch | `node tests/screen-discipline-patch-check.mjs` | Verifies collapsed command surfaces, local section titles, advanced accordions, compact next-action guidance, and no duplicate template button. |
| v1.0.5 no-browser suite | `node tests/v103-no-browser-suite.mjs` | Runs the v1.0.5 no-browser patch gate. |

## v1.0.5 — Browser QA + Visual Regression Hardening

| Gate | Command | Purpose |
|---|---|---|
| Browser layout persistence | `npm run test:browser:layout` | Checks desktop/tablet/mobile overflow and tab/collapse persistence. |
| Visual capture | `npm run test:browser:visual` | Captures screenshots as CI artifacts without requiring baselines. |
| Strict visual baseline | `npm run test:browser:visual:strict` | Enforces Playwright screenshot baselines when approved snapshots exist. |
| Browser QA bundle | `npm run test:browser:qa` | Runs provider, layout, and visual browser gates. |
| v1.0.5 no-browser | `npm run test:v105:no-browser` | Runs the v1.0.5 no-browser release suite. |
