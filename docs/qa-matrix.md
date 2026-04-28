# QA Matrix

## No-browser gates

```bash
npm run test:static
npm run test:schema
npm run test:fixtures
npm run test:research
npm run test:a11y:static
npm run test:qa
```

## v0.2.0-alpha research checks

- Research lab DOM IDs exist.
- Research workflow schema uses JSON Schema draft 2020-12.
- `workflow_version` is `0.2.0-alpha`.
- Research plan is required.
- Evidence matrix is required.
- Causal links are required.
- Fixture evidence IDs use `E1`, `E2`, ... format.
- Causal links use model-layer IDs and evidence IDs.

## Browser gates

```bash
npx playwright install --with-deps
npm run test:browser
```

Browser checks should confirm:

- Manual workflow still works.
- Research plan generation works.
- Evidence add/edit/delete works.
- Causal-link inference works.
- Mock analysis generation still injects valid JSON into the import box.
- Arabic RTL remains visually usable.
