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

## v0.16.0-beta specific checks

- `tests/privacy-export-guard-check.mjs`
- `tests/privacy-export-check.mjs`
- `tests/provider-mode-browser.spec.mjs`
- `npm run test:privacy`
- `npm run test:browser:provider`
- `npm run test:v016`

Checks performed:

- privacy guard redacts sensitive keys and secret-like text
- safe derived fields such as `token_hash` remain exportable
- exported payloads include `privacy_export` metadata
- repository export/provider/fixture candidates contain no dangerous `*_exported: true` flags
- provider modes are browser-selectable
- fake BYOK key is not rendered into diagnostics/run-ledger UI
- portable account mock connect/refresh/dry-run stays credential-safe

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
