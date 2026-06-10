# Expanded Biopolitical Systems Model

Version: `1.4.0-bio-alpha.3.1`

This alpha keeps the stable strategic/biopolitical dual-lens contract and hardens the expanded systems map as a visible review and export surface.

## Systems axes

Biopolitical analyses can include an optional `systems.items` map with these eight axes:

1. `human`
2. `society`
3. `state`
4. `market`
5. `corporate`
6. `geopolitical`
7. `technology`
8. `behavioral_engineering`

Each item should connect actor, mechanism, incentive, norm, outcome, resistance, and power shift.

## Compatibility

The six base arrays remain the import/export backbone:

`interests`, `actors`, `tools`, `narrative`, `results`, `feedback`

For biopolitical analyses they are interpreted as:

`problematization`, `populations/subjects`, `governance techniques`, `norms/subjectivation`, `embodied/social outcomes`, `resistance/feedback`.

`systems.items` is optional. If it is absent, the UI derives a fallback systems map so older `v1.3.0-bio` JSON remains importable.

## Alpha.2 hardening

- Adds a dedicated Systems Map review tab for biopolitical imports.
- Adds a biopolitical fixture with all eight systems axes.
- Adds browser coverage for systems-map rendering and HTML export metadata.
- Keeps strategic mode unchanged.

## v1.4.0-bio-alpha.3.1 — Export polish and prompt sample UX

Alpha.3 makes the expanded systems model easier to review before and after export:

- The biopolitical guide now exposes an expanded prompt sample topic for TikTok, youth attention, algorithmic addiction, and state security anxiety.
- The sample is intentionally chosen because it exercises all eight axes: human, society, state, market, corporate/platform, geopolitical, technology, and behavioral engineering.
- The HTML export now includes a polished systems narrative, readable systems table, and card fallback for archival use.
- The export keeps machine-readable attributes such as `data-system-map="expanded-biopolitical"`, `data-system-export-polish="readable-table"`, and `data-system-axis="behavioral_engineering"`.

Alpha.3 does not change the strategic lens contract.
