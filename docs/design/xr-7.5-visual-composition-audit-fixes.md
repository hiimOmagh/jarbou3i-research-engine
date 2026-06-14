# XR-7.5 — Visual Composition Audit Fixes

## Decision

XR-8 must not start until the visual result is corrected. XR-7 proved accessibility and localization stability, but the screenshot audit showed that the interface still needed a composition pass before visual evidence gates are expanded.

XR-7.5 is a targeted visual correction phase. It does not change schema, provider behavior, export metadata, source handling, backend behavior, OAuth behavior, or storage behavior.

## Problems found in the visual audit

1. The mobile header consumed too much vertical space.
2. Sticky header overlap could visually clip major panels in hosted screenshots.
3. The first hero still carried too much vertical dead space.
4. The composer was improved but not high enough above the fold on mobile.
5. Arabic mobile typography was readable but oversized.
6. Decorative intelligence signals were not sufficiently functional.
7. The product needed a subtle structured-intelligence motif before XR-8 visual gates.

## Changes

### Compact mobile header

The compact mobile header requirement is explicit: the app bar should stop dominating the first viewport.

The mobile app bar is compressed through smaller padding, smaller avatar, tighter title, hidden subtitle, tighter language/theme/mode controls, and smaller control gaps. The goal is to make the user reach the task faster without reducing touch safety from XR-7.

### Sticky header overlap protection

The sticky header overlap requirement is explicit: section jumps and hosted screenshots must not clip content under the app shell.

The shell now defines top scroll padding and scroll margins for major panels. This reduces the risk that hosted screenshots or section jumps show content clipped beneath the sticky app bar.

### Reduced hero vertical dead space

The hero vertical dead space requirement is explicit: the first action must appear sooner and decorative whitespace must be reduced.

The command panel and composer now use tighter padding, smaller internal gaps, and a more compact mission strip. Metrics are hidden on the smallest mobile viewports because they are secondary context, not first-action material.

### Arabic mobile typography correction

The Arabic mobile typography requirement is explicit: Arabic remains readable, but the hierarchy is less oversized on mobile.

Arabic title and composer heading scale is reduced on mobile with controlled line height. The intent is to keep Arabic readable without letting the first screen become visually top-heavy.

### Structured-intelligence motif

The structured-intelligence motif requirement is explicit: subtle analytical connector texture replaces empty decoration.

The command surface gets a subtle structured-intelligence motif using low-opacity connector lines and grid-like texture. This provides identity without adding mascot clutter or decorative cards.

## Acceptance criteria

- Desktop first screen feels intentional, not empty.
- Mobile first screen reaches the composer faster.
- No visible content is clipped under the sticky header.
- Arabic remains readable without oversized hierarchy.
- Composer and lens controls appear earlier above the fold.
- Decorative elements support the analysis identity instead of floating without purpose.
- Browser and no-browser gates remain green.

## Non-goals

- No schema changes.
- No provider/backend/OAuth/storage changes.
- No export metadata changes.
- No test selector migration.
- No new major panels.
- No change to Simple/Expert mode behavior.

## Next phase

After XR-7.5 is visually accepted, proceed to **XR-8 — Visual Evidence Gate Upgrade**. XR-8 should expand screenshot evidence across light/dark, Simple/Expert, empty/valid/review/export states, and desktop/mobile viewports.
