# Local CI Split — v1.4.0-bio-alpha.3.1

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
