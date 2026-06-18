# XR-8.2 — Arabic Mobile Header Control Compression Hotfix

## Purpose

XR-8 locked the expanded visual evidence gate, but the manual visual audit found a release-blocking defect in the Arabic mobile screenshots: the header control cluster clipped the Simple/Expert segmented switch in both `mobile-first-screen.png` and `mobile-first-screen-dark.png`.

XR-8.2 is a targeted visual hotfix. It does not change the analysis model, export contracts, hosted evidence structure, provider behavior, source handling, storage behavior, or runtime workflow semantics.

## Defect

The Arabic mobile header had three competing control groups in one narrow row:

1. the language selector,
2. the Simple/Expert mode switch,
3. the theme toggle.

The earlier overflow guard prevented horizontal scrolling, but it also allowed the Simple/Expert control to become visually squeezed and clipped. That made the first-screen Arabic mobile state look broken even though the automated RTL overflow test passed.

## Fix

The Arabic RTL mobile header now uses a controlled two-row layout:

- Row 1: language selector plus compact theme button.
- Row 2: full-width Simple/Expert switch.

This preserves all controls, keeps the language selector readable, prevents the Simple/Expert switch from being squeezed, and keeps the no-horizontal-overflow browser contract intact.

## Scope

Changed surfaces:

- `src/styles.css`
- `tests/static-check.mjs`
- `docs/design/xr-8.2-arabic-mobile-header-control-compression-hotfix.md`

No changed runtime JavaScript.
No changed HTML IDs.
No changed export schema.
No changed XR-8 visual evidence matrix file list.

## Acceptance Criteria

- `mobile-first-screen.png` shows no clipped Arabic header controls.
- `mobile-first-screen-dark.png` shows no clipped Arabic header controls.
- Simple/Expert is visible as a usable switch.
- The language selector remains readable.
- The theme button remains accessible.
- RTL/mobile horizontal overflow remains blocked.
- The XR-8 visual evidence matrix remains unchanged and valid.
- Browser core, hosted evidence, stable readiness, and no-browser gates pass.

## Next Step

After XR-8.2 passes, rerun the XR-8 visual evidence matrix and perform XR-9 as the visual release closure and product demo audit.
