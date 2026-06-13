# XR-6 — Export Report Redesign

## Status

Implementation package for the XR rebuild track after XR-5.

XR-6 turns the exported HTML report from a polished dump into a report-grade intelligence brief while preserving the existing browser/export contracts.

## Design intent

The application review surface was upgraded in XR-5 with a premium intelligence layer. XR-6 extends that quality into the standalone HTML export so the downloaded report feels like a finished artifact rather than an internal UI snapshot.

The export must be readable by humans, archive-safe for operators, and stable for automated consumers.

## Core changes

- Adds a report-grade export cover with lens, score, model chain, and archive readiness.
- Adds an intelligence brief block with quality, evidence pressure, scenario falsifier, and readiness signals.
- Adds a causal spine section for the six model layers.
- Adds lens-specific visual mapping:
  - Strategic: actor → tool → result path.
  - Biopolitical: systems governance orbit.
- Adds evidence-pressure export cards.
- Adds contradiction-pressure export cards.
- Adds scenario falsifier cards.
- Adds print-safe CSS for report sections.
- Adds an export panel preview marker for the redesigned report.

## Preserved contracts

XR-6 deliberately preserves:

- `#exportHtml`
- `#exportHtmlInline`
- `data-export-html-action`
- `data-export-contract-lens`
- `data-analysis-lens`
- `name="analysis-lens"`
- `name="app-version"`
- biopolitical systems-map export markers
- cross-locale export behavior for AR/EN/FR
- RTL export direction
- stable browser download behavior

## Non-goals

- No schema change.
- No provider/backend/OAuth/storage change.
- No duplicate export IDs.
- No removal of machine-readable metadata.
- No broad `data-lens` selector reintroduction.

## Acceptance criteria

- Browser core remains 50/50 green.
- Hosted evidence remains green.
- Stable release readiness remains green.
- No-browser remains green.
- Exported HTML contains XR-6 markers:
  - `data-xr6-export-report="premium-brief"`
  - `data-xr6-export-cover="report-grade"`
  - `data-xr6-export-brief="intelligence-summary"`
  - `data-xr6-export-causal-spine="lens-chain"`
  - `data-xr6-export-evidence="pressure-board"`
  - `data-xr6-export-scenarios="falsifier-cards"`

## Next milestone

XR-7 — Accessibility + Localization Hardening.
