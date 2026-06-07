# Export Contract — v1.3.0-bio-alpha.4.2

The deployable root app has one HTML export mode. The exported report must preserve the selected analytical lens so downstream review, archival, and browser evidence can distinguish Strategic and Biopolitical reports without inspecting app state.

## Required exported report markers

Every downloaded HTML report must include:

```html
<meta name="app-version" content="1.3.0-bio-alpha.4.2">
<meta name="analysis-lens" content="strategic|biopolitical">
<main class="shell" data-analysis-lens="strategic|biopolitical" data-app-version="1.3.0-bio-alpha.4.2">
```

## Strategic export expectations

A Strategic export must include the strategic report identity and layer chain:

```text
Strategic Analysis Report
Interests → Actors → Tools → Narrative → Results → Feedback
```

It must not present the Biopolitical report identity or biopolitical layer contract.

## Biopolitical export expectations

A Biopolitical export must include the biopolitical report identity and lens-specific layers:

```text
Biopolitical Analysis Report
Problematization
Populations / Subjects
Governance Techniques
Norms / Subjectivation
Embodied / Social Outcomes
Resistance / Normalization Feedback
```

It must not present the Strategic report identity or strategic layer chain.

## Browser evidence

`tests/export-contract.spec.js` downloads both reports through the real browser UI, saves them as Playwright artifacts, and asserts the positive and negative token contracts above.


## Locale determinism

Browser export-contract tests must select the expected UI locale before loading a sample. Sample content is localized, while the lens contract metadata is locale-independent.


## v1.3.0-bio-alpha.4.2 scenario rationale coverage

Downloaded HTML reports must preserve scenario rationale text, not only drivers, early signals, and falsifiers. This keeps the exported evidence contract aligned with the review model and prevents sample-token assertions such as `proof infrastructure` from failing when the rationale is omitted.

## v1.3.0-bio-alpha.4.2 import and locale coverage

Alpha.4 extends the export contract with two additional browser gates:

1. **Lens import contract** — imported JSON controls the final app lens. A Strategic JSON import cannot silently export as Biopolitical, and a Biopolitical JSON import cannot silently export as Strategic.
2. **Cross-locale export contract** — Arabic, English, and French exports preserve `html lang`, `dir`, `app-version`, `analysis-lens`, `data-analysis-lens`, and `data-export-contract-lens`.

The tests intentionally assert machine-readable metadata instead of relying only on localized visible text. This keeps the contract stable across Arabic, English, and French copy changes.

## v1.3.0-bio-alpha.4.2 review title lens contract

The visible review heading now reflects the active/imported lens: Strategic imports render a Strategic review title, and Biopolitical imports render a Biopolitical review title. The stable `#reviewTitle` anchor remains available for browser contracts.

