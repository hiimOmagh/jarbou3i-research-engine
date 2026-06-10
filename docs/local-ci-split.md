# Local CI Split — v1.4.0-bio-alpha.7.2

Run no-browser gates before installing browser dependencies.

The repository hygiene lock intentionally rejects generated folders such as `node_modules/`, `playwright-report/`, `test-results/`, `hosted-demo-evidence/`, and local patch folders. Browser tests require installed dependencies, so the local validation sequence is split into two phases.

## Phase 1 — clean no-browser lock

Run this before `npm install`:

```powershell
node tests/ci-script-contract-check.mjs
npm run test:qa
node tests/static-check.mjs
npm run test:ci:no-browser
```

## Phase 2 — browser and hosted evidence lock

After Phase 1 passes, install dependencies and run browser coverage:

```powershell
npm install
Remove-Item -Recurse -Force .\playwright-report, .\test-results, .\hosted-demo-evidence, .\hosted-demo-evidence-local -ErrorAction SilentlyContinue
npm run test:ci:browser
```

## Final hygiene lock before commit

Before committing, remove generated artifacts and re-run hygiene:

```powershell
Remove-Item -Recurse -Force .\playwright-report, .\test-results, .\hosted-demo-evidence, .\hosted-demo-evidence-local, .\node_modules, .\_patch-* -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\node_modules -ErrorAction SilentlyContinue
Remove-Item -Force .\*.zip -ErrorAction SilentlyContinue
npm run test:hygiene
git diff --check
```

`node_modules/ must not be present during hygiene lock`. A full local run is therefore accepted as a split proof: clean no-browser first, dependency-installed browser second, final cleanup/hygiene before commit.

## v1.4.0-bio-alpha.4.1 note

The browser systems-map test now uses a review-scoped coverage selector so local Playwright strict mode does not confuse the review coverage legend with the export evidence block.

## v1.4.0-bio-alpha.7.2 note

The local split remains unchanged. Prompt-contract browser checks run inside `tests/systems-map.spec.js`, so they are covered by `npm run test:ci:browser` after dependencies are installed.


## v1.4.0-bio-alpha.7.2 note

The browser smoke gate is intentionally allowed a larger per-test timeout because the expanded diagnostics review surface now exercises more tabs under parallel browser load. No product behavior changes are introduced by this hotfix.
