# XR-11 — Premium Product Art Direction Rebuild

## Status

Prepared as the corrective visual pass after the release-candidate path was paused.

RC-1 paused because the manual visual audit rejected the current look: the UI was technically green but still read as a soft glass prototype rather than a premium analytical command-center.

## Decision

XR-11 reopens visual work with a constrained art-direction rebuild. It does not change provider logic, backend behavior, schema, OAuth, storage, export contracts, hosted evidence infrastructure, or browser-tested DOM IDs.

## Problem

The latest XR evidence showed a stable but visually unsatisfying product:

- too much soft glass and pale glow;
- header still too dominant;
- weak command-center identity;
- decorative AI motif did not define the product;
- Arabic mobile typography still felt oversized in the header;
- desktop hero balance still felt more like a form than an analytical cockpit.

## Implementation

XR-11 applies a CSS-only premium art-direction pass:

1. Replaces the soft glass look with a sharper product shell.
2. Introduces a compact command bar instead of a dominant banner.
3. Strengthens the first-screen command-center surface.
4. Gives the primary composer a harder rail, stronger border, and higher contrast.
5. Sharpens the AI / structured-intelligence motif without adding new DOM.
6. Compresses Arabic mobile typography and header density again.
7. Reduces blur/fog while preserving light and dark theme support.
8. Preserves the XR-8 evidence matrix and all browser contract anchors.

## Acceptance criteria

XR-11 is acceptable only if:

- desktop light looks premium rather than washed out;
- desktop dark reads as a serious analysis cockpit;
- mobile Arabic is compact, readable, and free of clipped controls;
- the first screen feels like a command-center, not a generic SaaS form;
- Simple Mode remains guided without visual clutter;
- browser core, hosted evidence, stable readiness, and no-browser gates pass;
- the next RC-1 attempt is based on updated evidence, not the rejected visual state.

## Non-goals

- No release tag.
- No RC-1 continuation until visual evidence is rechecked.
- No schema, source, provider, OAuth, backend, or storage changes.
- No ID changes to tested controls.

## Next

Run the full browser evidence matrix after applying XR-11. If manual visual audit accepts the new screenshots, return to RC-1. If not, record the remaining blockers instead of tagging.
