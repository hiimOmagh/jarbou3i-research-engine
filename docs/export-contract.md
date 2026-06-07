# Export Contract — v1.3.0-bio-alpha.3.3

The deployable root app has one HTML export mode. The exported report must preserve the selected analytical lens so downstream review, archival, and browser evidence can distinguish Strategic and Biopolitical reports without inspecting app state.

## Required exported report markers

Every downloaded HTML report must include:

```html
<meta name="app-version" content="1.3.0-bio-alpha.3.3">
<meta name="analysis-lens" content="strategic|biopolitical">
<main class="shell" data-analysis-lens="strategic|biopolitical" data-app-version="1.3.0-bio-alpha.3.3">
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


## v1.3.0-bio-alpha.3.3 scenario rationale coverage

Downloaded HTML reports must preserve scenario rationale text, not only drivers, early signals, and falsifiers. This keeps the exported evidence contract aligned with the review model and prevents sample-token assertions such as `proof infrastructure` from failing when the rationale is omitted.
