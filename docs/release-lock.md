# Release Lock — v1.4.0-bio-alpha.1

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
- `hosted-demo-evidence/`
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
npm run test:browser:hosted
```

## GitHub Actions contract

The workflow must run the stable no-browser alias and the hardened pnpm browser fallback:

- `npm run test:ci:no-browser`
- `pnpm exec playwright test`

The browser job must depend on the no-browser job. CI no-browser gates run without dependency installation because they use first-party Node scripts only. The browser job uses Corepack + pnpm to avoid the GitHub npm install instability observed during alpha.6 remote locking. The browser job sets `HOSTED_DEMO_EVIDENCE_DIR=hosted-demo-evidence`, reviews that directory with `tests/hosted-demo-evidence-review-check.mjs`, and uploads it as a GitHub Actions artifact.

## Lock criteria

A release may be locked only when all are true:

- package version is `1.4.0-bio-alpha.1`
- source-of-truth check passes
- workspace hygiene check passes after cleanup
- no-browser CI alias passes
- browser CI alias passes
- strategic import contract passes
- biopolitical import contract passes
- EN/AR/FR export metadata contracts pass
- hosted-demo evidence capture passes
- hosted-demo evidence review passes
- no preview or biopreview folder exists at root

## v1.4.0-bio-alpha.1 stable release archive

The stable `v1.4.0-bio-alpha.1` pass promotes the locked release-candidate baseline to the stable release line. No product behavior changes are included. Use `docs/stable-release-archive.md` for tag, archive, and generated-artifact rules.


## v1.4.0-bio-alpha.1 — Expanded Biopolitical Systems Model

Adds an optional expanded biopolitical systems map covering human, society, state, market, corporate/platform, geopolitical, technology, and behavioral-engineering layers. The base Strategic/Biopolitical lens contract remains backward-compatible with v1.3.0-bio imports. See `docs/expanded-biopolitical-systems-model.md`.
