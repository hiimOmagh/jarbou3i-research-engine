# XR-3 — Guided Wizard Mode

## Status

Planned implementation package for the XR rebuild track.

XR-0 froze the design direction. XR-1 introduced the token and theme system. XR-2 recomposed the first screen around the primary composer. XR-3 turns Simple Mode into a guided wizard layer without breaking the existing browser-tested workbench controls.

## Goal

XR-3 makes the tool easier for non-technical users by converting Simple Mode from a dense one-page workbench into a guided path with one primary action at a time:

1. Topic
2. Import
3. Review
4. Export

The implementation does not remove or rename stable controls. It keeps the underlying DOM and tested IDs intact so browser contracts remain valid.

## Product decision

Simple Mode should feel like a guided wizard. Expert Mode should remain a full analyst workbench.

### Simple Mode

Simple Mode prioritizes:

- one visible active step state,
- a clear next action,
- plain-language guidance,
- a wizard progress rail,
- reduced cognitive load,
- mobile header compression,
- visible focus on the current work surface.

Simple Mode does not require users to understand schema, JSON, export metadata, or internal model structure before using the tool.

### Expert Mode

Expert Mode preserves the full workbench density:

- advanced settings,
- model map visibility,
- diagnostic panels,
- review tabs,
- export metadata,
- schema-governed import behavior.

Expert Mode hides the Simple Mode wizard shell while keeping all normal workbench surfaces available.

## Compatibility guard

XR-3 intentionally avoids hard-hiding browser-dependent controls such as:

- `#topicInput`
- `#copyPromptBtn`
- `#previewPromptBtn`
- `#loadSampleBtn`
- `#jsonInput`
- `#importBtn`
- `#reviewPanel`
- `#exportHtml`

The existing Playwright tests interact with these controls directly. XR-3 therefore implements a guided visual layer and step-state emphasis, not a destructive DOM replacement.

## UX behavior

### Wizard shell

XR-3 adds a compact wizard panel below the workflow stage bar.

The panel contains:

- localized step title,
- localized step body,
- progress dots,
- Back action,
- Next action.

The wizard tracks runtime state through `workflowProgress()` and maps it to one of four simple steps:

- `topic`
- `import`
- `review`
- `export`

### Step progression

The runtime wizard step is derived from the real workflow state:

- no topic or only topic setup → `topic`
- prompt copied or JSON text present → `import`
- analysis imported → `review`
- export tab active → `export`

### Next action behavior

The Next button does not perform destructive hidden automation. It focuses the next useful control:

- topic step without topic → focus `#topicInput`
- topic step with topic → focus `#copyPromptBtn`
- import step without valid JSON → focus `#jsonInput`
- import step with valid JSON → focus `#importBtn`
- review step → open/focus export flow
- export step → focus `#exportHtml`

This keeps the user in control while reducing decision friction.

## Accessibility

XR-3 preserves accessibility by:

- keeping IDs stable,
- keeping browser-tested controls operable,
- avoiding `display:none` for important controls required by runtime tests,
- using `aria-live` on the wizard panel,
- using non-conflicting progress-dot data states so the existing workflow stage remains the only `[aria-current="step"]` target,
- preserving keyboard focus targets,
- using the XR-1 focus-ring system,
- keeping minimum target sizes for wizard actions.

## Mobile behavior

XR-3 adds mobile Simple Mode compression:

- top header padding reduced,
- brand subtitle hidden on narrow screens,
- logo reduced,
- segmented controls compressed,
- wizard actions stack cleanly.

This directly addresses the XR-2 visual weakness: the mobile header consumed too much vertical space before the user reached the working area.

## Non-goals

XR-3 does not:

- change schemas,
- change generated prompt contracts,
- change export metadata,
- change provider/backend/OAuth/storage behavior,
- rename stable browser-tested IDs,
- remove Expert Mode,
- redesign the review dashboard.

## Acceptance criteria

XR-3 is acceptable when:

- Simple Mode shows a guided wizard shell,
- the current step is visually emphasized,
- Expert Mode hides the wizard shell and keeps the workbench dense,
- `#jsonInput` remains usable by direct browser tests,
- `#exportHtml` remains exportable,
- RTL/mobile still has no horizontal overflow,
- EN/AR/FR remain supported,
- all no-browser gates pass,
- browser core and hosted evidence gates pass locally.

## Validation expectation

Run:

```powershell
git diff --check
npm install
npx playwright install chromium
npm run test:ci:browser
```

Then cleanup and no-browser:

```powershell
Remove-Item -Recurse -Force .\node_modules, .\playwright-report, .\test-results, .\hosted-demo-evidence-local, .\hosted-demo-evidence -ErrorAction SilentlyContinue
Remove-Item -Force .\hosted-demo-evidence*.zip -ErrorAction SilentlyContinue
Remove-Item -Force .\stable-release-lock-report-v*.json, .\stable-release-lock-report-v*.md -ErrorAction SilentlyContinue

npm run test:ci:no-browser
git status --short
```

## Next milestone

XR-4 — Expert Analyst Dashboard

XR-4 should rebuild Expert Mode as a controlled analyst dashboard with better multi-panel density, diagnostic surfacing, evidence/counter-evidence structure, model-map navigation, and export readiness signals.
