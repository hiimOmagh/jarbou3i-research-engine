# XR-7.6 — First-View Density + Product Identity Pass

## Decision

XR-7.5 was technically locked, but the visual audit still found three pre-gate weaknesses: the mobile app bar consumed too much of the first viewport, the desktop hero retained an under-filled right side, and the product identity still read as a clean generic AI workbench rather than a distinctive Jarbou3i intelligence engine.

XR-7.6 is a final visual-correction pass before **XR-8 — Visual Evidence Gate Upgrade**. It does not change schemas, provider behavior, export contracts, import behavior, tested IDs, or backend/storage behavior.

## Visual objectives

1. Make the mobile app bar compact enough that the real task appears faster.
2. Replace the lonely AI bubble with a structured-intelligence identity panel.
3. Reduce hero empty space without adding decorative clutter.
4. Keep the composer and lens decision visible earlier above the fold.
5. Tune Arabic mobile typography so it remains readable without oversized hierarchy.
6. Preserve XR-7 accessibility and localization hardening.

## Implementation summary

- Added XR-7.6 CSS variables for first-view density and identity sizing.
- Tightened the mobile app bar layout, button heights, avatar/logo size, and title scale.
- Added title ellipsis on small screens to avoid oversized header wrapping.
- Rebuilt `.xrComposerSignal` into a compact structured-intelligence identity panel using node/grid/causal-line visual language.
- Reduced composer intro, task header, topic input, and lens-card vertical weight.
- Added Arabic-specific mobile type corrections for brand title, hero title, task heading, and helper text.
- Added static checks that lock the XR-7.6 visual tokens and documentation.

## Acceptance criteria

- Desktop first screen looks intentionally premium, not empty.
- Mobile first screen reaches the actual tool faster.
- The product has a recognizable Jarbou3i intelligence identity.
- No decorative element exists without function.
- Arabic remains readable but less oversized.
- Browser and no-browser gates pass.

## Non-goals

- No schema changes.
- No prompt contract changes.
- No export metadata changes.
- No provider, backend, OAuth, or storage changes.
- No removal of browser-tested selectors.
- No visual-evidence gate expansion yet; that belongs to **XR-8 — Visual Evidence Gate Upgrade**.
