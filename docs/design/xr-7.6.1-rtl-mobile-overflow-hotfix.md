# XR-7.6.1 — RTL Mobile Overflow Hotfix

## Decision

XR-7.6 improved first-view density and product identity, but browser validation exposed a regression in the RTL/mobile layout contract: the Arabic mobile flow produced a 39px horizontal overflow. This hotfix is a contract-restoration patch, not a new visual milestone.

## Root cause

The XR-7.6 first-view compression introduced tighter header grids and a structured-intelligence identity graphic. On small RTL/mobile viewports, the combined width pressure from `topActions`, segmented controls, the icon button, and identity surfaces could exceed the viewport.

## Scope

- Restore the RTL/mobile no-horizontal-overflow contract.
- Keep the XR-7.6 compressed first-view direction.
- Constrain `topActions` and segmented controls with `min-width:0`, clipped overflow, and ellipsis.
- Constrain composer identity surfaces and the composer identity graphic.
- Add a narrow-viewport guard for very small mobile widths.
- Preserve all export, lens import, systems-map, accessibility, localization, and hosted-evidence contracts.

## Non-goals

- No app logic changes.
- No export/report behavior changes.
- No schema/provider/backend/OAuth/storage changes.
- No visual evidence gate expansion yet.

## Acceptance criteria

- RTL/mobile browser test returns to green.
- Measured horizontal overflow is <= 2px.
- Desktop composition remains unchanged except for safe constraints.
- Mobile header remains compact.
- `XR-8 — Visual Evidence Gate Upgrade` starts only after screenshot audit confirms the first-view result is visually acceptable.
