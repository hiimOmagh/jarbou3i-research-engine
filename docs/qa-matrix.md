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
