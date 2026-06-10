# Stable Release Archive — v1.4.0-bio-alpha.1

This document records the stable release archive contract for the dual-lens Jarbou3i Model line.

## Release identity

- Stable version: `1.4.0-bio-alpha.1`
- Release title: `v1.4.0-bio-alpha.1 — Stable Release Tag + Archive`
- Source of truth: repository root only
- Duplicate app tracks rejected: `preview/`, `biopreview/`

## Frozen capability baseline

The stable release preserves the validated baseline from `v1.4.0-bio-alpha.1-rc.1`:

- Strategic and Biopolitical analysis lenses.
- Lens-aware prompt generation, UI labels, scoring, imports, and HTML exports.
- Strategic and Biopolitical export contracts.
- EN/AR/FR cross-locale export metadata.
- Imported JSON lens authority.
- Hosted/public UI evidence capture.
- Hosted evidence artifact review.
- Workspace/source-of-truth hygiene.
- CI contract guards.

## Required local validation before tag/archive

Run from a clean repository root:

```bash
npm run test:ci:no-browser
npm run test:browser:hosted
node tests/hosted-demo-evidence-review-check.mjs hosted-demo-evidence-local
npm run test:ci
```

Then clean generated artifacts:

```bash
rm -rf playwright-report test-results hosted-demo-evidence hosted-demo-evidence-local node_modules _patch-*
rm -f *.zip
npm run test:hygiene
git diff --check
```

## Git tag recommendation

After local and GitHub CI are green, create the stable tag:

```bash
git tag -a v1.4.0-bio-alpha.1 -m "v1.4.0-bio-alpha.1 — Stable Release Tag + Archive"
git push origin v1.4.0-bio-alpha.1
```

## Archive rule

Do not commit generated archive ZIP files, Playwright reports, hosted evidence folders, patch folders, or dependency folders. Store release archives outside the repository or publish them through GitHub Releases/artifacts.


## v1.4.0-bio-alpha.1 — Expanded Biopolitical Systems Model

Adds an optional expanded biopolitical systems map covering human, society, state, market, corporate/platform, geopolitical, technology, and behavioral-engineering layers. The base Strategic/Biopolitical lens contract remains backward-compatible with v1.3.0-bio imports. See `docs/expanded-biopolitical-systems-model.md`.
