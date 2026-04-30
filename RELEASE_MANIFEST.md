# Release Manifest — v1.0.6

## Package identity

- Package: `jarbou3i-research-engine`
- Version: `1.0.6`
- Release name: `Documentation + Release Packaging Cleanup`
- Release type: patch
- Runtime capability change: no

## Entry points

- Static app: `index.html`
- Main UI script: `src/app.js`
- Research runtime: `src/research-engine.js`
- Workflow schema: `schema/research-workflow.schema.json`
- Strategic output schema: `schema/strategic-analysis.schema.json`
- Optional backend worker: `backend/cloudflare-worker.js`

## Required package directories

- `.github/`
- `assets/`
- `backend/`
- `docs/`
- `fixtures/`
- `schema/`
- `scripts/`
- `src/`
- `tests/`

## Required root files

- `.nojekyll`
- `.gitignore`
- `.releaseignore`
- `CHANGELOG.md`
- `CONTRIBUTING.md`
- `LICENSE`
- `README.md`
- `RELEASE_MANIFEST.md`
- `SECURITY.md`
- `index.html`
- `manifest.webmanifest`
- `package.json`
- `playwright.config.js`
- `wrangler.toml`

## Compatibility boundary

v1.0.6 must not change provider behavior, OAuth behavior, backend endpoint behavior, source connector behavior, storage model, or schema-breaking workflow structure. The patch is allowed to change release documentation, release packaging metadata, QA wrappers, version snapshots, and packaging hygiene checks.

## Required no-browser gates

```bash
npm run test:qa
npm run test:privacy
npm run test:provider
npm run test:source
npm run test:backend
npm run test:export-pack
npm run test:quality
npm run test:migrations
npm run test:release-packaging
npm run test:v106:no-browser
```

## Required browser gates before publishing

```bash
npm run test:browser:provider
npm run test:browser:layout
npm run test:browser:visual
npm run test:browser
```

## Release archive exclusions

Generated dependency folders, test reports, browser screenshots, coverage output, OS metadata, logs, and local environment files must not be shipped in release archives. See `.releaseignore`.
