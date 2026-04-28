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


## v0.24.0-beta — Advanced Quality Gate v3 QA

| Check | Command | Purpose |
| --- | --- | --- |
| Quality Gate v3 | `node tests/quality-gate-v3-check.mjs` | Validates v3 dimensions, readiness labels, fix actions, schema, and fixture integration. |
| v0.24 no-browser suite | `node tests/v023-no-browser-suite.mjs` | Runs the v0.24 no-browser release gates. |
| Browser provider QA | `npm run test:browser:provider` | Confirms provider mode UI coverage after Playwright installation. |

## v0.24.0-beta — Export Pack v2 QA

| Check | Command | Purpose |
| --- | --- | --- |
| Export Pack v2 | `node tests/export-pack-v2-check.mjs` | Validates manifest, Markdown, CSV, JSON artifacts, privacy redaction, schema metadata, and v0.23 migration defaulting. |
| v0.24 no-browser suite | `node tests/v024-no-browser-suite.mjs` | Runs the v0.24 no-browser release gates. |
| Browser provider QA | `npm run test:browser:provider` | Confirms provider mode UI coverage after Playwright installation. |

Release gate: Export Pack v2 must never bypass the privacy export guard or privacy audit final pass.
