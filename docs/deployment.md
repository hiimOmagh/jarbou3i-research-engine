# Deployment Notes

## GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to **Settings → Pages**.
3. Use **Deploy from branch**.
4. Select branch `main` and folder `/root`.
5. Save and wait for the Pages URL.

## Required release checks

Run before pushing a release:

```bash
npm install
node tests/qa-check.mjs
npx playwright install --with-deps
npm run test:browser
```

`node tests/qa-check.mjs` is the fast no-browser gate. It checks JavaScript syntax, modular source layout, duplicate DOM IDs, manifest integrity, optimized image references, schema governance, fixture quality, static accessibility basics, and absence of removed legacy export/self-check paths.

`npm run test:browser` runs the Playwright browser flow, runtime accessibility smoke, and RTL/mobile smoke tests.

## CI

The repository includes a GitHub Actions workflow at:

```text
.github/workflows/ci.yml
```

It runs on pushes and pull requests.

## Public release checklist

- [ ] README reviewed
- [ ] Changelog includes `1.2.0` modular QA hardening
- [ ] License selected deliberately
- [ ] Security notice reviewed
- [ ] GitHub Pages deployment works
- [ ] `node tests/qa-check.mjs` passes
- [ ] `npm run test:browser` passes
- [ ] Full CI passes
- [ ] Visual QA checklist completed
- [ ] Arabic, English, and French UI inspected
- [ ] Arabic RTL exported HTML report inspected
- [ ] Mobile width around 390 px inspected
- [ ] Runtime images load from optimized assets, not the 2048 px source file
- [ ] Formal schema exists at `schema/strategic-analysis.schema.json`
- [ ] Fixture validation passes
- [ ] Research mode prompt is manually tested with one fresh topic
