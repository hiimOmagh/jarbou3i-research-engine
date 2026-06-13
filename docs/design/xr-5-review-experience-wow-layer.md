# XR-5 — Review Experience Wow Layer

## Status

Implementation package prepared after XR-4 lock.

XR-5 upgrades the imported analysis review from a structured rendering surface into a premium intelligence brief. It does not change schema, provider behavior, backend behavior, storage, OAuth, or export metadata contracts.

## Product intent

The review page must feel like the moment where the tool becomes valuable. The user should not see a dumped JSON structure. They should see an interpreted analytical surface with hierarchy, pressure, and falsifiability.

Target experience:

- executive intelligence brief first
- visible causal spine
- evidence pressure is obvious
- contradiction groups are readable
- scenario falsifiers are exposed
- strategic and biopolitical lenses have distinct visual maps
- Simple Mode remains readable
- Expert Mode gains more analytical density

## Implemented surfaces

### Intelligence brief layer

The new `data-xr5-review-wow-layer="intelligence-brief"` block summarizes:

- overall score
- confidence signal
- evidence pressure
- scenario falsifier coverage

This gives users a fast executive reading before they inspect details.

### Lens map

Strategic lens receives an actor → tool → result pressure path.

Biopolitical lens receives a systems orbit for human, society, state, market, corporate, geopolitical, technology, and behavior coverage.

Stable markers:

- `data-xr5-lens-map="strategic-actor-tool-result"`
- `data-xr5-lens-map="biopolitical-systems"`

The implementation intentionally avoids generic `data-lens` selectors to prevent the XR-4.1 strict-mode regression from returning.

### Contradiction board

The new contradiction board exposes contradiction groups as pressure cards. Each card summarizes:

- contradiction type
- rhetoric/name/title
- interpretation or first action
- affected model layers

Stable marker:

- `data-xr5-contradiction-board="pressure-groups"`

### Scenario falsifier cards

The new scenario board makes falsifiability visually explicit. Each scenario card shows:

- scenario name
- probability ring
- first disproof / weakening condition

Stable marker:

- `data-xr5-scenario-board="falsifier-cards"`

### Evidence pressure

XR-5 keeps the existing evidence snapshot and adds pressure into the intelligence layer. The user sees both source-grounded evidence and counter-evidence pressure at the review level.

## Design rules

XR-5 uses XR-1 semantic tokens only. It avoids new random colors and uses existing semantic surfaces:

- `--color-primary`
- `--color-accent-violet`
- `--color-success`
- `--color-warning`
- `--color-surface-primary`
- `--color-surface-elevated`
- `--color-border-subtle`
- `--shadow-elevated`
- `--shadow-card-token`

The design must remain responsive:

- desktop: intelligence layer uses two-column composition
- tablet: lens and contradiction maps collapse into one column
- mobile: metric cards and scenario cards become single-column

## Accessibility and localization

XR-5 preserves:

- EN / AR / FR localization through `labelText(...)`
- RTL direction compatibility
- no duplicate IDs
- no duplicate `data-lens` selectors
- existing browser-controlled export and import selectors
- readable mobile cards

## Preserved contracts

XR-5 must preserve:

- `#topicInput`
- `#copyPromptBtn`
- `#previewPromptBtn`
- `#loadSampleBtn`
- `#jsonInput`
- `#importBtn`
- `#reviewPanel`
- `#reviewTitle`
- `#exportHtml`
- `.welcomeCard`
- `data-review="exports"`
- cross-locale export metadata
- lens import behavior
- systems-map export behavior
- expanded biopolitical prompt sample behavior

## Non-goals

XR-5 does not:

- rewrite export reports
- change schema
- change sample fixtures
- change provider/source execution policy
- change browser tests
- hide browser-controlled controls
- add backend/storage behavior

## Acceptance criteria

XR-5 is acceptable only if:

- browser core passes 50/50
- hosted browser evidence passes 2/2
- hosted archive and stable readiness pass
- no-browser passes after cleanup
- workspace hygiene passes
- review page visibly reads as an intelligence brief
- scenario falsifiers are visible without opening every detail
- biopolitical systems coverage and strategic actor/tool/result pressure are visible
- no generic `data-lens` selector duplication returns

## Next milestone

XR-6 — Export Report Redesign

Goal: make exported HTML match the upgraded review experience with report-grade cover, section hierarchy, lens-specific visuals, and print-safe layout.
