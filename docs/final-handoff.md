# Final Handoff — v1.3.0-bio-rc.1

This handoff freezes the dual-lens Jarbou3i Model release candidate. The product supports both Strategic and Biopolitical analysis modes from one root app and one shared schema-compatible six-layer engine.

## Source of truth

The release candidate is root-only. The deployable app is:

```text
index.html
src/app.js
src/styles.css
schema/strategic-analysis.schema.json
fixtures/*.json
tests/*.mjs
tests/*.spec.js
```

The following paths are generated or duplicate workspace state and must not be committed:

```text
preview/
biopreview/
_patch-*
playwright-report/
test-results/
hosted-demo-evidence/
hosted-demo-evidence-local/
dist/
ci-artifacts/
*.zip
```

## Release candidate validation

Run from repository root.

No-browser gates:

```bash
npm run test:ci:no-browser
```

Focused hosted evidence:

```bash
npm run test:browser:hosted
node tests/hosted-demo-evidence-review-check.mjs hosted-demo-evidence-local
```

Full release candidate gate:

```bash
npm run test:ci
```

Cleanup before commit:

```bash
npm run test:hygiene
git diff --check
```

## Browser evidence model

The core browser suite and hosted-demo evidence capture are intentionally isolated:

```bash
npm run test:browser:core
npm run test:browser:hosted
npm run test:evidence:hosted
```

Hosted evidence runs with one worker to avoid screenshot protocol instability under the full parallel suite.

## CI model

GitHub Actions keeps no-browser and browser gates separated. The no-browser job runs first. The browser job uses Corepack + pnpm for Playwright because GitHub npm install showed runner instability during alpha.6 remote locking.

Expected remote result:

```text
No-browser gates: PASS
Browser gates: PASS
hosted-demo-evidence artifact uploaded
```

## Release freeze rule

Do not add features in this RC track. Only accept fixes for:

- CI reliability
- release metadata drift
- evidence artifact review
- blocker-level browser/test instability
- documentation errors that could mislead release operators

## Current product contract

The RC preserves:

- Strategic lens
- Biopolitical lens
- lens-aware import behavior
- lens-aware HTML exports
- EN/AR/FR visible UI and export metadata contracts
- Arabic RTL layout smoke coverage
- hosted demo screenshot and visible-text evidence
- root-only source-of-truth guard
