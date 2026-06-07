# Usage Guide

## 1. Enter a topic

Write the event, conflict, trend, policy, actor, institution, life-process, population question, or governance problem you want to analyze.

Strategic example:

```text
World War II outcomes, 1939–1947, international order
```

Biopolitical example:

```text
Digital health passports and population risk classification, 2020–2022
```

## 2. Choose language, lens, and mode

Select the analysis language, the analysis lens, and the prompt mode.

### Strategic lens

Use this for geopolitical, institutional, strategic, or power-balance analysis.

Model:

```text
Interests → Actors → Tools → Narrative → Results → Feedback
```

### Biopolitical lens

Use this for analysis of how power governs life, bodies, populations, risk, norms, health, conduct, discipline, care, exclusion, and resistance.

Model:

```text
Problematization → Populations → Governance Techniques → Norms/Subjectivation → Embodied Outcomes → Resistance/Feedback
```

### Prompt modes

- **Focused** for a concise structured result.
- **Expert** for evidence, assumptions, and causal links.
- **Research** for source discipline, counter-evidence, uncertainty, and falsifiers.

## 3. Copy the prompt

Click **Copy prompt** and paste it into your preferred AI assistant.

The prompt changes with the selected lens. Biopolitical mode explicitly asks for populations, governance techniques, normalization, subjectivation, embodied outcomes, resistance, and disconfirming conditions.

## 4. Copy only the JSON result

The AI should return valid JSON. Copy only the JSON object. If the AI wraps it in a code block or adds text around it, the tool will usually extract the JSON automatically.

## 5. Import and review

Paste the JSON into the import field and click **Import analysis**. Then inspect:

- Overview
- Layers / Governance layers
- Contradictions
- Scenarios
- Evidence
- Exports

Old strategic JSON remains import-compatible. New biopolitical JSON should include:

```json
"analysis_lens": "biopolitical"
```

## 6. Read the quality score

Strategic mode keeps the original strategy-focused score: completeness, causal coherence, contradiction quality, scenario testability, evidence grounding, and readiness.

Biopolitical mode uses the same visible score slots but changes the internal interpretation. It checks whether the analysis actually identifies:

- problematization of a life/population process
- populations or subjects being classified, measured, protected, optimized, disciplined, or excluded
- concrete governance techniques
- normalization and subjectivation
- embodied or social outcomes
- resistance, adaptation, normalization feedback, or institutional learning

This prevents a cosmetic vocabulary shift where the app says “biopolitical” but still scores like a geopolitical model.

## 7. Export

Use **Export HTML report** to download a polished standalone report for sharing or archiving. The export subtitle and layer labels follow the active lens.

## Preview/root caution

Run release gates from the repository root. Passing tests inside a temporary `preview/` folder is useful for inspection, but it does not prove the deployable root app is green.

## Important caution

This tool structures analysis. It does not automatically verify facts. Always verify claims, sources, and interpretations independently.

For biopolitical analysis, avoid assuming that every public-health, welfare, education, or security intervention is only domination. The stronger analysis distinguishes protection, care, optimization, discipline, exclusion, normalization, and resistance.


## Export contract

From v1.3.0-bio-alpha.5 onward, downloaded HTML reports include explicit `app-version` and `analysis-lens` metadata. Use this to verify whether an archived report was generated under the Strategic or Biopolitical lens. The browser export contract test downloads both reports through the UI and attaches them as evidence artifacts.

## Lens import contract

From v1.3.0-bio-alpha.5 onward, imported JSON is authoritative for the analysis lens. If a JSON result contains:

```json
"analysis_lens": "strategic"
```

the app switches to the Strategic lens even if the UI toggle previously displayed Biopolitical. If it contains:

```json
"analysis_lens": "biopolitical"
```

the app switches to the Biopolitical lens even if the UI toggle previously displayed Strategic.

This prevents a wrong-lens review/export caused by stale UI state.

## Cross-locale export QA

The browser QA now exports reports in Arabic, English, and French for both lenses. The tests verify the exported HTML language direction and the machine-readable report metadata:

```html
<meta name="analysis-lens" content="strategic|biopolitical">
<main data-analysis-lens="strategic|biopolitical">
<section data-export-contract-lens="strategic|biopolitical">
```

Use `npm run test:browser:locale` for focused cross-locale export coverage.

## v1.3.0-bio-alpha.5 review title lens contract

The visible review heading now reflects the active/imported lens: Strategic imports render a Strategic review title, and Biopolitical imports render a Biopolitical review title. The stable `#reviewTitle` anchor remains available for browser contracts.

## v1.3.0-bio-alpha.5 release validation

Before locking or pushing a release branch, clean generated artifacts and run the stable aliases from repository root:

```bash
npm run test:ci:no-browser
npm run test:ci:browser
```

The deployable app is root-only. Do not keep `preview/`, `biopreview/`, patch staging folders, Playwright reports, test-results, or patch ZIPs in the release root.
