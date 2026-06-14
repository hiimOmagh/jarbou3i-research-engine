# XR-8 — Visual Evidence Gate Upgrade

## Purpose

XR-8 upgrades the hosted evidence contract so visual quality cannot be hidden behind green functional tests.

The goal is not to change the product UI. The goal is to make future release evidence harder to fake, harder to under-scope, and easier to audit manually before a visual release is called locked.

## Background

XR-7.7 compressed Simple Mode and made the mobile flow less form-heavy. XR-8 now formalizes the visual-evidence gate that should have existed earlier in the rebuild.

Before XR-8, hosted evidence captured only a small public UI lock set. That was technically useful, but insufficient for the actual design ambition:

- light/dark mode comparison was not required;
- Simple/Expert mode screenshots were not explicitly locked;
- import/review/export states were not captured as first-class visual states;
- there was no matrix describing what a human reviewer must inspect;
- archive checks validated file identity, but not visual-state coverage.

## Scope

XR-8 adds evidence-gate coverage for:

1. Desktop first screen.
2. Desktop dark first screen.
3. Mobile first screen.
4. Mobile dark first screen.
5. Simple Mode.
6. Expert Mode.
7. Strategic Mode.
8. Biopolitical Mode.
9. Import state.
10. Review state.
11. Export state.
12. Trilingual visible text snapshots.
13. A visual evidence matrix.
14. Metadata requiring manual visual review.

## Non-goals

XR-8 does not alter:

- provider logic;
- backend or storage behavior;
- OAuth or source behavior;
- schema shape;
- export metadata semantics;
- product UI layout.

## Evidence files required after XR-8

```text
# screenshots
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

# text / metadata
visible-text-ar.json
visible-text-en.json
visible-text-fr.json
visual-evidence-matrix.json
hosted-demo-metadata.json
```

## Matrix requirements

`visual-evidence-matrix.json` must declare:

```text
visual_evidence_gate_version = XR-8
manual_visual_review_required = true
viewports = desktop + mobile
themes = light + dark
interface_modes = simple + expert
states = first-screen, strategic-mode, biopolitical-mode, import-state, review-state, export-state
locale_coverage = ar-rtl, en-ltr, fr-ltr
reviewer_decision = pending-manual-visual-audit
```

## Manual review rule

XR-8 intentionally leaves the matrix reviewer decision as:

```text
pending-manual-visual-audit
```

That means the evidence gate produces the evidence package, but it does not pretend to make a subjective visual-quality decision automatically.

A human reviewer must inspect the screenshot set before moving to a visual release closure.

## Acceptance criteria

XR-8 is accepted only if:

- browser core remains 50/50 green;
- hosted evidence remains 2/2 green;
- evidence review passes;
- archive check passes;
- stable release readiness passes;
- no-browser passes after cleanup;
- archive contains exactly the expanded root-level evidence file set;
- metadata declares the XR-8 visual evidence gate;
- `visual-evidence-matrix.json` requires manual visual review;
- no duplicate export IDs or lens selectors are introduced;
- RTL/mobile overflow remains green.

## Next phase

After XR-8 is locked, the next milestone should be:

```text
XR-9 — Visual Release Closure + Product Demo Audit
```

XR-9 should inspect the expanded visual evidence set and either close the visual rebuild or define the final release polish defects.
