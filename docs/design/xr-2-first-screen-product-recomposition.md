# XR-2 — First-Screen Product Recomposition

## Status

Prepared as the first major visual implementation after the XR-0 audit freeze and XR-1 design-token foundation.

## Goal

Rebuild the first visible product surface around one premium composer-first action instead of a cluster of competing hero cards.

XR-2 intentionally does not alter schema behavior, export metadata, provider behavior, backend behavior, OAuth behavior, storage behavior, or analysis logic.

## Design Decision

The previous UI-R landing surface had too many visual anchors above the fold:

- identity card
- mascot block
- action composer
- mission card
- metrics row
- workflow guidance
- mode banner
- import card

The result was visually crowded and structurally fragile. XR-2 changes the first-screen hierarchy to:

1. One dominant composer surface.
2. Lens selection as visual cards within the composer.
3. A compact workflow strip inside the composer.
4. Compact metrics below the composer.
5. Import/review/export surfaces below the first action.

## New First-Screen Architecture

```text
Top app bar
└─ controls: language, Simple/Expert, theme

Primary composer
├─ product-intent title
├─ large topic input
├─ language selector
├─ strategic / biopolitical lens cards
├─ advanced options drawer
├─ primary CTA: copy prompt
├─ secondary CTAs: preview / sample
└─ compact workflow strip

Compact capability strip

Guidance + mode status

Import station below the first action
```

## Visual Direction

XR-2 uses the XR-1 token system rather than ad-hoc colors:

- Analyst Aurora light theme
- Midnight Intelligence dark theme
- semantic surfaces, text, borders, focus, shadows
- lens-specific strategic/biopolitical accents
- tokenized radius, spacing, and target sizes

## Accepted Changes

- The mascot/identity support block is no longer visible in the first hero.
- The separate mission card is no longer visible in the first hero.
- The action composer is the only dominant first-screen surface.
- The topic input is immediately visible.
- Lens choices are treated as card-like decisions instead of small toggles.
- The workflow summary is compact and embedded into the composer.
- Prompt sample visibility is preserved for browser contracts.

## Preserved Runtime Contracts

The following browser-sensitive IDs remain present and usable:

- `#topicInput`
- `#analysisLang`
- `#analysisLens`
- `#promptMode`
- `#jsonInput`
- `#importBtn`
- `#exportHtml`
- `#reviewPanel`
- `#reviewTitle`

The following behavior is explicitly out of scope:

- schema changes
- export metadata changes
- provider/backend/OAuth/storage changes
- source/import contract changes
- review scoring logic changes

## Accessibility Requirements

XR-2 preserves the XR-1 accessibility rules:

- visible focus rings
- minimum 44px target size
- readable contrast in light and dark modes
- no horizontal overflow
- reduced-motion compatibility
- RTL-safe layout

## Acceptance Criteria

XR-2 is acceptable only if:

- browser core passes 50/50
- hosted evidence passes
- stable release readiness passes
- no-browser passes after cleanup
- desktop first screenshot shows the composer as the dominant first surface
- mobile first screenshot reaches the action composer quickly
- no vertical text columns exist
- no floating mascot gap exists
- no support-card canyon exists
- no random colors are introduced outside the XR token system

## Next Phase

After XR-2 lock, the next planned milestone is:

```text
XR-3 — Guided Wizard Mode
```

XR-3 should make Simple Mode behave like a true step-focused wizard rather than a dense single-page layout.
