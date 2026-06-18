# XR-8.1 — Stable Readiness Visual Evidence Matrix Hotfix

## Purpose

XR-8 upgraded hosted visual evidence from the legacy eight-file evidence set to an expanded visual evidence matrix. Browser core, hosted evidence review, and hosted archive structure passed, but stable release readiness still used the legacy eight-file `REQUIRED_FILES` contract.

This caused the stable readiness gate to fail with:

```text
metadata archive_exact_files must contain exactly 8 files
```

The runtime evidence was correct. The stable-readiness checker was stale.

## Scope

- Update `tests/stable-release-readiness-check.mjs` to use the XR-8 expanded visual evidence set.
- Require 16 evidence files:
  - 11 screenshots
  - 3 visible-text JSON files
  - `visual-evidence-matrix.json`
  - `hosted-demo-metadata.json`
- Preserve the manual visual-audit requirement.
- Keep `reviewer_decision` locked to `pending-manual-visual-audit`.
- Add static contracts so stable readiness cannot silently drift back to the old eight-file archive contract.

## Expanded evidence files

```text
desktop-first-screen.png
desktop-first-screen-dark.png
mobile-first-screen.png
mobile-first-screen-dark.png
simple-mode.png
expert-mode.png
strategic-mode.png
biopolitical-mode.png
import-state.png
review-state.png
export-state.png
visible-text-ar.json
visible-text-en.json
visible-text-fr.json
visual-evidence-matrix.json
hosted-demo-metadata.json
```

## Non-goals

- No UI changes.
- No CSS changes.
- No app runtime changes.
- No export metadata changes.
- No relaxation of the XR-8 visual gate.

## Acceptance criteria

- Browser core remains 50/50.
- Hosted evidence review passes.
- Hosted archive check passes.
- Stable release readiness passes with 16 evidence files.
- No-browser passes.
- `visual-evidence-matrix.json` remains required.
- Manual visual review remains required.
- Reviewer decision remains `pending-manual-visual-audit`.

## Next step

After XR-8.1 locks, proceed to XR-9 — Visual Release Closure + Product Demo Audit.
