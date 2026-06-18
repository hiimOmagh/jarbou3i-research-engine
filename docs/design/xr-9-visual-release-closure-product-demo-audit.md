# XR-9 — Visual Release Closure + Product Demo Audit

## Status

**Decision: visual release is release-closeable after manual visual audit.**

XR-9 closes the XR visual rebuild track for `v1.4.0-bio.1.1` as a product-demo-ready interface, not as a perfect final brand system. The XR-8 evidence gate remains the formal screenshot and archive mechanism, while XR-9 records the human review decision based on the expanded evidence matrix after XR-8.2.

## Evidence basis

The manual visual audit reviewed the XR-8 visual evidence matrix generated after the Arabic mobile header hotfix.

Required evidence surfaces reviewed:

- `desktop-first-screen.png`
- `desktop-first-screen-dark.png`
- `mobile-first-screen.png`
- `mobile-first-screen-dark.png`
- `simple-mode.png`
- `expert-mode.png`
- `strategic-mode.png`
- `biopolitical-mode.png`
- `import-state.png`
- `review-state.png`
- `export-state.png`
- `visual-evidence-matrix.json`

The evidence matrix remains intentionally marked as pending machine-side reviewer approval because the project requires a human manual visual audit before calling a visual release closed. XR-9 is that documented manual visual audit record.

## Closure decision

| Area | Decision | Notes |
|---|---|---|
| Desktop first screen | Accepted | Clean cockpit layout, visible action path, acceptable first-screen hierarchy in light and dark themes. |
| Mobile first screen | Accepted with caveat | Arabic mobile header clipping is fixed. Header remains tall, but controls are readable, aligned, and no longer broken. |
| Simple Mode | Accepted | Progressive disclosure is substantially better than the earlier stacked workbench. Advanced concepts no longer dominate the first flow. |
| Expert Mode | Accepted | Expert controls remain accessible without reintroducing selector collisions or excessive first-flow complexity. |
| Strategic lens | Accepted | Strategic mode is clear enough for demo and user-facing validation. |
| Biopolitical lens | Accepted | Biopolitical positioning is visible and coherent as the default research value proposition. |
| Import state | Accepted | Paste/validate/review flow is understandable and no longer visually secondary. |
| Review state | Accepted | Review dashboard appears report-grade and demonstrates analysis quality checks. |
| Export state | Accepted | Export surface supports a credible polished HTML report demo. |
| Dark theme | Accepted | Dark theme is usable and visually differentiated; no release-blocking contrast issue found in the audited screenshots. |
| RTL / Arabic | Accepted with caveat | Main RTL clipping defect is fixed. Future copy-polish should refine Arabic numeric ranges and placeholder rhythm. |

## Release-closeable definition

For XR-9, **release-closeable** means:

1. The interface can be demonstrated publicly without obvious broken controls.
2. The primary Simple Mode path can be understood without explaining every internal feature.
3. Expert Mode still exposes the analyst cockpit capability for power users.
4. Strategic and biopolitical lenses are visually distinguishable and workflow-safe.
5. Review and export states look credible enough for a research-tool demo.
6. The expanded XR-8 evidence matrix can reproduce the visual state for future audits.
7. Remaining issues are polish backlog items, not release blockers.

## Product demo narrative

Use this product demo narrative when presenting the current build:

1. **Open the workbench.** Show that the app is now a lens-aware research workspace rather than a raw prompt form.
2. **Choose Simple Mode.** Explain that Simple Mode hides advanced concepts and walks the user through topic → prompt → import → review → export.
3. **Enter a topic.** Use a concrete geopolitical or biopolitical topic, preferably one with a time range and population/system angle.
4. **Copy the prompt.** The product creates a structured prompt for the selected lens.
5. **Paste the AI answer.** The import station validates the structured JSON and offers repair guidance if needed.
6. **Review the analysis.** Show completeness, confidence, contradictions, scenarios, causal links, systems mapping, and evidence pressure.
7. **Export the report.** Demonstrate the polished HTML report as the public-facing output of the workflow.
8. **Switch to Expert Mode.** Show that advanced controls are still available for power users without burdening the simple path.
9. **Switch lens.** Show Strategic and Biopolitical modes to demonstrate the dual analytical identity.
10. **Mention evidence gates.** Explain that every public release now includes browser, RTL/mobile, export, localization, and visual evidence gates.

## What is no longer a blocker

- Arabic mobile header controls are no longer clipped.
- Simple/Expert toggle is no longer squeezed into an unreadable vertical pill.
- RTL mobile overflow remains guarded by browser tests.
- Light and dark first-screen evidence exists.
- Import, review, and export states are captured by the visual evidence gate.
- Stable readiness is aligned with the expanded 16-file evidence matrix.
- Manual visual audit has a documented closure decision.

## non-blocking polish backlog

The following items should not block closure, but should be considered for a later product polish cycle:

1. Reduce mobile header height further without risking RTL clipping.
2. Refine Arabic numeric range rendering in placeholders and examples.
3. Increase dark-theme placeholder contrast slightly in long input fields.
4. Consider a more distinctive brand motif beyond the current analytical grid graphic.
5. Add a short embedded demo topic library for new users.
6. Add an optional guided tour after release stabilization.
7. Consider a final copy pass for Arabic and French microcopy rhythm.

## Guardrail for the next phase

Do not reopen broad visual redesign during XR-10 unless a browser or visual evidence artifact shows a concrete defect. The visual rebuild track has reached a stable closeable state. Further work should shift toward release packaging, demo narrative, documentation consolidation, and product validation.

## Next milestone

**XR-10 — Release Candidate Packaging + Demo Handoff**

Recommended scope:

- finalize release notes for the XR visual overhaul
- create a short product demo checklist
- document public demo limitations
- preserve the XR-8 visual evidence gate as the release audit mechanism
- keep runtime/product changes out of scope unless a release blocker appears
