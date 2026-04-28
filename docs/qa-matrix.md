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
npm run test:qa
```

## v0.15.0-beta specific checks

- `tests/portable-account-check.mjs`
- `npm run test:provider:portable`

Checks performed:

- portable mock module loads
- disconnected state exports no secret
- connect creates mock account metadata
- refresh rotates token hash
- status exposes token presence without raw token
- export strips raw token fields
- `key_exported === false`
- `raw_token_exported === false`
- live calls remain unsupported

## Browser checks still required after push

```bash
npx playwright install --with-deps
npm run test:browser
```

Manual browser QA:

- switch provider to `portable_oauth`
- connect mock account
- refresh mock token
- run a provider task
- confirm run ledger records portable account metadata
- export workflow packet and confirm no raw token/key fields exist
