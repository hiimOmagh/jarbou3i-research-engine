# XR-4 — Expert Analyst Dashboard

## Status

Implementation package phase. XR-4 builds on XR-3 after the guided Simple Mode was locked and pushed.

## Purpose

XR-4 separates the expert experience from the Simple Mode wizard. Simple Mode remains a guided path for non-technical users. Expert Mode gains a dense but controlled analyst dashboard that exposes quality, schema health, evidence pressure, scenario discipline, systems coverage, and export readiness without forcing that density onto normal users.

## Design decision

The correct expert experience is not another decorative card cluster. It is an analyst cockpit:

- fast diagnostic signals;
- visible readiness state;
- direct section jumps;
- evidence and counter-evidence pressure;
- scenario falsifier discipline;
- systems coverage when the biopolitical lens is active;
- export readiness summary.

The dashboard is deliberately hidden outside Expert Mode. This preserves Simple Mode clarity while giving advanced users a more powerful control surface.

## Scope

Changed surfaces:

- `index.html`
- `src/app.js`
- `src/styles.css`
- `tests/static-check.mjs`
- `docs/design/xr-4-expert-analyst-dashboard.md`

## What XR-4 adds

### Expert dashboard shell

A new `#expertAnalystPanel` is added as an `expertOnly` panel. It is not visible in Simple Mode. It is placed between the engine map and the review panel so Expert Mode users see a cockpit-level quality summary before entering detailed review sections.

### Runtime diagnostic renderer

`renderExpertAnalystDashboard()` populates the dashboard from the current analysis state. It supports:

- no-analysis placeholder state;
- active lens chip;
- readiness chip;
- schema health percentage;
- six-layer coverage;
- evidence source/counter-evidence pressure;
- scenario falsifier coverage;
- biopolitical systems coverage;
- export readiness.

### Expert section jumps

Signal cards include small section-jump controls using `data-expert-jump`. These route the user to the relevant review section without changing the established review/export contracts.

### Quality pipeline

A compact pipeline summarizes:

- overview/schema readiness;
- evidence grounding;
- scenario discipline;
- export readiness.

## Preserved contracts

XR-4 does not change:

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
- cross-locale export metadata
- lens import behavior
- expanded biopolitical prompt sample visibility
- RTL/mobile smoke flow
- Simple Mode guided wizard controls

## Accessibility and UX constraints

The dashboard follows the XR-1 token system:

- semantic surface, border, text, and accent tokens;
- responsive grid collapse;
- no color-only critical state;
- compact action buttons;
- visible labels and numeric summaries;
- no forced horizontal overflow.

## Simple Mode impact

Simple Mode remains guided. The expert dashboard is hidden outside Expert Mode, so the non-technical path remains focused.

## Expert Mode impact

Expert Mode becomes more useful without turning the entire page into raw schema/debug output. Advanced users get one glanceable control surface before deep review.

## Acceptance criteria

XR-4 is accepted only if:

- no-browser gates pass;
- browser core remains green;
- hosted evidence remains green;
- `.welcomeCard` remains visible for RTL/mobile smoke tests;
- Simple Mode remains wizard-led;
- Expert Mode exposes `#expertAnalystPanel` as a dashboard/cockpit;
- static checks lock the XR-4 DOM, runtime, CSS, and documentation contracts.

## Next milestone

XR-5 — Review Experience Wow Layer

XR-5 should upgrade the imported analysis review itself: causal-chain visual treatment, systems ring/map, evidence confidence chips, contradiction groups, scenario cards, uncertainty/falsifier blocks, and report-grade readability.
