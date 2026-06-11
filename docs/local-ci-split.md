# Local CI Split — v1.4.0-bio

Run no-browser gates before installing browser dependencies.

The repository hygiene lock intentionally rejects generated folders such as `node_modules/`, `playwright-report/`, `test-results/`, `hosted-demo-evidence/`, and local patch folders. Browser tests require installed dependencies, so the local validation sequence is split into two phases.

## Phase 1 — clean no-browser lock

Run this before `npm install`. Remove patch ZIPs first if the patch archive was downloaded into the repository root:

```powershell
Remove-Item -Force .\*.zip -ErrorAction SilentlyContinue
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

## v1.4.0-bio note

The local split remains unchanged. Prompt-contract browser checks run inside `tests/systems-map.spec.js`, so they are covered by `npm run test:ci:browser` after dependencies are installed.


## v1.4.0-bio note

The browser smoke gate is intentionally allowed a larger per-test timeout because the expanded diagnostics review surface now exercises more tabs under parallel browser load. No product behavior changes are introduced by this hotfix.

## v1.4.0-bio hosted evidence archive step

`npm run test:ci:browser` now performs three hosted evidence steps after the core browser suite:

1. Capture hosted public UI evidence into `hosted-demo-evidence-local` unless `HOSTED_DEMO_EVIDENCE_DIR` overrides it.
2. Review the evidence directory with `tests/hosted-demo-evidence-review-check.mjs`.
3. Generate and validate `hosted-demo-evidence-v1.4.0-bio.zip` with `tests/hosted-demo-evidence-archive-check.mjs`.

The versioned ZIP is a generated artifact. Remove it with `Remove-Item -Force .\hosted-demo-evidence*.zip` before the final hygiene lock. Patch ZIPs are also generated artifacts; remove them with `Remove-Item -Force .\*.zip -ErrorAction SilentlyContinue` before running the hygiene lock.

## v1.4.0-bio browser worker stability note

The browser core gate is intentionally capped at `--workers=4`. The export-heavy Chromium tests create multiple HTML downloads; uncapped 16-worker runs can cancel downloads at the 30s Playwright timeout under local resource pressure. The worker cap preserves the same 50-test coverage while making download and tab traversal evidence deterministic.

## v1.4.0-bio remote no-browser hygiene

Remote no-browser gates now run dependency-free and explicitly remove `node_modules/` before `npm run test:ci:no-browser`. Browser dependencies remain isolated in the browser job. This preserves the hygiene lock while keeping the hosted evidence archive identity guard unchanged.


## v1.4.0-bio archive structure guard

The hosted evidence archive identity check also validates archive structure. Remove patch ZIPs and stale hosted evidence archives before browser validation; the generated archive must be named `hosted-demo-evidence-v1.4.0-bio.zip` and must contain exactly the required evidence files, without nested ZIP files.

## v1.4.0-bio stable-release report cleanup

`npm run test:ci:browser` now writes stable-release lock reports after hosted evidence archive validation:

```text
stable-release-lock-report-v1.4.0-bio.json
stable-release-lock-report-v1.4.0-bio.md
```

Remove these generated reports before the final hygiene lock when running locally:

```powershell
Remove-Item -Force .
elease-candidate-lock-report-v*.json, .
elease-candidate-lock-report-v*.md -ErrorAction SilentlyContinue
```

## v1.4.0-bio.1.1 lens toggle hotfix note

The browser gate covers the lens toggle visual contract in addition to the existing hosted evidence and stable readiness checks.
