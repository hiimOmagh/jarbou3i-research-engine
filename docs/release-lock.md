# Release Lock — v1.3.0-bio-alpha.5

This release locks the promoted root-only Jarbou3i Model biopolitical/strategic dual-lens branch.

## Required root state

The deployable app must live at repository root:

- `index.html`
- `src/app.js`
- `src/styles.css`
- `schema/strategic-analysis.schema.json`
- `fixtures/*.json`
- `tests/*.mjs`
- `tests/*.spec.js`

The following paths must not exist in the release root:

- `preview/`
- `biopreview/`
- `_patch-*`
- `playwright-report/`
- `test-results/`
- `dist/`
- `ci-artifacts/`
- `hosted-demo-evidence-local/`
- root patch ZIPs or package ZIPs

## Required validation ladder

No-browser:

```bash
npm run test:ci:no-browser
```

Browser:

```bash
npx playwright install --with-deps
npm run test:ci:browser
```

Full local release check:

```bash
npm run test:ci
```

Focused browser contracts:

```bash
npm run test:browser:import
npm run test:browser:locale
npm run test:browser:export
```

## GitHub Actions contract

The workflow must run the same stable root aliases:

- `npm run test:ci:no-browser`
- `npm run test:ci:browser`

The browser job must depend on the no-browser job. CI must install with `npm ci` so `package-lock.json` remains part of the release identity.

## Lock criteria

A release may be locked only when all are true:

- package version is `1.3.0-bio-alpha.5`
- source-of-truth check passes
- workspace hygiene check passes after cleanup
- no-browser CI alias passes
- browser CI alias passes
- strategic import contract passes
- biopolitical import contract passes
- EN/AR/FR export metadata contracts pass
- no preview or biopreview folder exists at root
