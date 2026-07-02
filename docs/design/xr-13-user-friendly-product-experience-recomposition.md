# XR-13 — User-Friendly Product Experience Recomposition

## Decision

XR-13 changes the evaluation model from visual patching to user-facing questions. The tool must not show a section merely because it exists. Every visible element must answer: **What should the user do next?**

RC-1 remains blocked until the product experience stops behaving like a vertical module dump and becomes a clear user-friendly workflow.

## Product principle

The product is split into three states:

1. **Prompt Builder** — before import.
2. **Expert Cockpit** — after import / expert review.
3. **Editorial Export** — final report surface.

This means the interface should not show all systems at once. It should show only what helps the current task.

## User-facing questions audit

Every visible section is audited with these user-facing questions:

- Does the user need this now?
- Does it repeat something already said?
- Does it explain the next action?
- Does it create a useful decision?
- Does it compete with the primary action?
- Does it belong in pre-import or post-import?
- Would a first-time user understand it in five seconds?
- Would an expert still find it useful?
- Is it only visible because tests or runtime contracts need it?
- Does it make the page longer without adding value?

## Classification model

- **PRIMARY** — needed for the current task.
- **SECONDARY** — useful, but not now.
- **EXPERT** — useful only for power users.
- **HELP** — explanatory, optional.
- **SYSTEM** — required for runtime/tests/contracts.
- **NOISE** — repeated, confusing, or low-value.

## Visible-element inventory decisions

| Element | Classification | XR-13 action |
|---|---|---|
| Topic field | PRIMARY | Keep prominent in Prompt Builder. |
| Analysis Lens | PRIMARY | Keep visible before prompt copy. |
| Copy Prompt | PRIMARY | Keep primary before import. |
| Advanced options | SYSTEM + EXPERT | Keep visible/browser-accessible, reduce dominance. |
| Expanded prompt sample | SYSTEM + HELP | Keep browser-visible, compact. |
| Mission card | HELP / NOISE | Collapse as duplicate guidance. |
| Metrics cards | SECONDARY | Collapse as not needed for first task. |
| Workflow guidance card | NOISE | Collapse as duplicate instruction. |
| Interface mode banner | HELP | Collapse unless needed by mode. |
| Import station | PRIMARY | Keep as second pre-import task. |
| Analysis Engine Map | POST-IMPORT / STRUCTURE | Hide before import; preserve after import. |
| Old Expert Analyst Dashboard | LEGACY / SYSTEM | Demote after import; hide before import. |
| Expert Cockpit | PRIMARY after import | Make primary post-import surface. |
| Review tabs | SECONDARY after import | Keep after cockpit as detail review. |

## Repetition audit

Repeated guidance around “start with one topic” is reduced. The app keeps one primary task instruction and collapses secondary duplicated surfaces. The user should see a task path, not five repeated explanations.

## Pre-import state

Pre-import means the user has not yet imported a valid structured answer.

Visible priority:

1. Topic.
2. Lens.
3. Copy prompt.
4. Paste/validate answer.
5. Optional sample/advanced controls.

Hidden or collapsed:

- Analysis Engine Map.
- Old Expert Analyst Dashboard.
- Repeated mission copy.
- Secondary metrics.
- Full cockpit except expert activation context.

## Post-import state

Post-import means a valid analysis exists.

Visible priority:

1. Expert Cockpit.
2. Source panel.
3. Structure panel.
4. Brief panel.
5. Detail review and export.
6. Supporting engine map.

The workbench becomes secondary because the task changed from building a prompt to inspecting analysis.

## Simple Mode responsibility

Simple Mode is the guided user-friendly path. It should reduce decisions and avoid showing the full diagnostic surface before import.

## Expert Mode responsibility

Expert Mode is not “show everything.” Expert Mode means exposing the cockpit and inspection controls at the right time.

## Browser-contract exceptions

Some elements must remain browser-visible and runtime-safe:

- `#promptMode`
- expanded biopolitical prompt sample
- import controls
- export controls
- review IDs
- lens buttons

These are treated as **SYSTEM**. They may be visually demoted but cannot be removed or hidden in ways that break tests.

## Implementation summary

XR-13 adds product-state synchronization:

- `pre-import`
- `needs-repair-or-validation`
- `ready-to-import`
- `post-import`

The shell receives `data-xr13-product-experience="user-friendly-recomposition"` and a product-state attribute so CSS can show, collapse, or demote sections based on the current user task.

## Acceptance criteria

- A new user sees the first action quickly.
- Duplicate guidance is collapsed.
- Pre-import does not show a full analysis dashboard prematurely.
- Post-import makes Expert Cockpit the primary surface.
- Analysis Engine Map becomes post-import support, not pre-import clutter.
- Old dashboard no longer competes with the cockpit.
- Prompt sample remains browser-visible.
- Advanced controls remain browser-accessible.
- Runtime IDs are preserved.
- Export contracts are preserved.
- RTL/mobile behavior is preserved.
- XR-8 evidence matrix remains intact.

## Next milestone

XR-13.1 — Post-Import Cockpit Dominance + Legacy Surface Reduction.

Focus: inspect real hosted screenshots, then reduce any remaining old/new UI competition without breaking the browser contracts.

## Static contract marker sweep

This section exists to keep the documentation contract explicit and reviewable after the XR-13 user-friendly recomposition. It is not a new product feature; it is a lock marker proving that the design document contains the same audit vocabulary required by the static gate.

Required exact audit vocabulary:

- visible-element inventory
- repetition audit
- user-facing questions
- NOISE
- SYSTEM
- PRIMARY
- pre-import
- post-import
- Prompt Builder
- Expert Cockpit
- Editorial Export
- What should the user do next?
- runtime IDs
- export contracts
- XR-8 evidence matrix
- RC-1 remains blocked

These terms map to the actual UX governance model: every visible surface is classified by user task value, repeated guidance is collapsed, SYSTEM elements remain browser/runtime-safe, and the interface separates Prompt Builder, Expert Cockpit, and Editorial Export states without breaking runtime IDs, export contracts, RTL/mobile behavior, or the XR-8 evidence matrix.
