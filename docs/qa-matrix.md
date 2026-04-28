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
npm run test:qa
```

## v0.17.0-beta specific checks

- `tests/migration-check.mjs`
- `tests/no-browser-qa-suite.mjs`
- `tests/v017-no-browser-suite.mjs`
- `npm run test:migrations`
- `npm run test:v017:no-browser`
- `npm run test:v017`

Checks performed:

- old packets from v0.11 through v0.16 migrate to v0.17
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
- inject a fake BYOK key with live calls disabled and confirm it never renders in the page
