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

## 6. Export

Use **Export HTML report** to download a polished standalone report for sharing or archiving. The export subtitle and layer labels follow the active lens.

## Important caution

This tool structures analysis. It does not automatically verify facts. Always verify claims, sources, and interpretations independently.

For biopolitical analysis, avoid assuming that every public-health, welfare, education, or security intervention is only domination. The stronger analysis distinguishes protection, care, optimization, discipline, exclusion, normalization, and resistance.
