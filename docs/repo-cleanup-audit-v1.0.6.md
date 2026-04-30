# Repository Cleanup Audit — v1.0.6 Hotfix

## Verdict

The CI failure is correct. The GitHub repository still contains at least one stale file that must be removed from version control:

```bash
git rm docs/v1.0.5-browser-qa-visual-regression-hardening.md
```

This file is a misnamed duplicate of the browser QA / visual regression documentation. The canonical document is:

```text
docs/v1.0.4-browser-qa-visual-regression-hardening.md
```

The clean v1.0.6 package does not contain the misnamed duplicate, which means the deletion was likely not staged or committed in the GitHub repository.

## Required delete list

Delete these if they exist in the GitHub repo:

```bash
git rm -f docs/v1.0.5-browser-qa-visual-regression-hardening.md
git rm -f scripts/XXKuyryP
git rm -f src/XXSyA2D3
```

## Generated/local artifacts that must not be committed

These must stay untracked and outside release archives:

```text
node_modules/
dist/
build/
coverage/
playwright-report/
test-results/
.nyc_output/
*.zip
*.log
*.tmp
.DS_Store
Thumbs.db
.env
.env.*
backend/.dev.vars
backend/.dev.vars.local
```

Exception:

```text
backend/.dev.vars.example
```

## Versioned docs that should remain

Do not delete these release-history files. They are part of the documented development trail and are intentionally kept:

```text
docs/v0.16.0-beta-provider-browser-privacy-qa.md
docs/v0.17.0-beta-state-migration.md
docs/v0.18.0-beta-module-split.md
docs/v0.19.0-beta-privacy-audit-hardening.md
docs/v0.20.0-beta-ux-reliability-pass.md
docs/v0.21.0-beta-project-workspace.md
docs/v0.22.0-beta-analysis-template-system.md
docs/v0.23.0-beta-advanced-quality-gate-v3.md
docs/v0.24.0-beta-export-pack-v2.md
docs/v0.25.0-beta-real-backend-provider-hardening.md
docs/v0.26.0-beta-real-source-connector-prototype.md
docs/v0.27.0-beta-web-search-provider-abstraction.md
docs/v0.28.0-beta-real-portable-oauth-spike.md
docs/v0.29.0-rc.1-release-candidate-freeze.md
docs/v1.0.0-ci-browser-validation.md
docs/v1.0.0-public-beta-stable-research-engine.md
docs/v1.0.1-patch-only-stabilization.md
docs/v1.0.2-ux-stabilization-patch.md
docs/v1.0.3-screen-discipline-patch.md
docs/v1.0.4-browser-qa-visual-regression-hardening.md
docs/v1.0.5-onboarding-first-run-success.md
docs/v1.0.6-documentation-release-packaging-cleanup.md
```

## New guard

`tests/repo-file-hygiene-check.mjs` performs a repository-level file audit and reports exact deletion actions when stale/generated/secret-like files are present. It is included in the no-browser CI gate after the release-packaging cleanup check.

## Local verification commands

```bash
npm run test:release-packaging
npm run test:repo:hygiene
npm run test:ci:no-browser
```

If CI still fails at `release-packaging-cleanup-check.mjs`, the repository still contains the stale duplicate file. Use `git status --short` to confirm that the deletion is staged.
