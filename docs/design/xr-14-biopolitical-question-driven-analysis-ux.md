# XR-14 — Biopolitical Question-Driven Analysis UX

## Status

Design/package milestone for applying the XR-13 user-friendly product logic to the Biopolitical / Life-Governance lens.

## Source model

This milestone operationalizes the **Jarbou3i Life-Governance Analysis Engine** without exposing its full theory stack to every user at once.

The engine remains intact:

- Vital Problem Construction
- Population Construction
- Classification + Measurement Infrastructure
- Governance Apparatus + Actor Capacity
- Techniques of Power + Subject Formation
- Life-Chance Redistribution + Exposure + Residue
- Evidence protocol, confidence caps, alternative hypotheses, predictions, disconfirmation, and lower-harm alternative generation

## Product correction

The model should not begin by showing every expert term.

The interface must begin with **seven questions before theory**.

This is a progressive disclosure rule:

1. Simple Mode gives plain-language questions.
2. Expert Mode reveals the Life-Governance ontology behind each question.
3. Evidence Mode verifies claims before confidence.
4. Final Mode produces judgment, prediction, disconfirmation, and lower-harm alternative.

## Life-Governance Clarity Gate

Before a biopolitical analysis can feel final, it must answer these user-facing questions:

1. What happened?
2. What life issue is being presented as a problem?
3. Who is being targeted, protected, corrected, or blamed?
4. What categories, data, records, or scores make the group governable?
5. Who gains authority, capacity, money, data, or control?
6. What behavior is encouraged, punished, normalized, or made risky?
7. Who benefits, who is exposed to harm, and what remains afterward?

## Question-to-ontology map

| User-facing question | Expert label | Purpose |
|---|---|---|
| What happened? | Event / Direct observations | Prevents premature interpretation. |
| What life issue is being presented as a problem? | Vital Problem Construction | Identifies the life-process being governed. |
| Who is being targeted, protected, corrected, or blamed? | Population Construction | Shows how a group becomes visible and governable. |
| What categories, data, records, or scores make the group governable? | Classification + Measurement Infrastructure | Separates narrative from the machinery of measurement. |
| Who gains authority, capacity, money, data, or control? | Governance Apparatus + Actor Capacity | Detects institutional, market, platform, and expert capacity. |
| What behavior is encouraged, punished, normalized, or made risky? | Techniques of Power + Subject Formation | Detects self-regulation, normalization, compliance, and risk behavior. |
| Who benefits, who is exposed to harm, and what remains afterward? | Life-Chance Redistribution + Exposure + Residue | Links care, control, harm, permanence, and lower-harm alternatives. |

## Mode architecture

### Simple Mode

Simple Mode asks the seven questions and keeps the expert labels secondary.

The goal is that a beginner can start a biopolitical analysis without knowing the term “biopolitics.”

### Expert Mode

Expert Mode keeps the full Life-Governance framework available:

- vital problem
- population construction
- classification
- measurement infrastructure
- governance apparatus
- techniques of power
- normative frame
- subject formation
- life-chance redistribution
- necropolitical exposure
- market capture
- institutional residue
- resistance
- feedback

The expert label is never the first user-facing instruction. The question comes first; the label comes second.

### Evidence Mode

Evidence Mode enforces **evidence before confidence**.

It checks:

- source strength
- source independence
- directness
- specificity
- corroboration
- missing evidence
- confidence caps
- alternative hypotheses
- disconfirmation conditions

### Final Mode

Final Mode must include:

- final mechanism
- strongest evidence
- weakest point
- confidence cap
- preferred and competing hypotheses
- conditional prediction
- watch indicators
- disconfirmation
- lower-harm alternative

## UX decision

The old biopolitical lens exposed strong concepts, but the user still had to understand the model before using it.

XR-14 reverses the order:

```text
Question → mechanism → evidence → expert term → final judgment
```

not:

```text
Expert term → theory → scoring → user confusion
```

## Static contracts

This milestone adds explicit contracts for:

- `data-xr14-biopolitical-question-ux="question-driven-analysis"`
- `data-xr14-question-grid="simple-seven"`
- `data-xr14-clarity-gate="life-governance"`
- `data-xr14-evidence-mode="confidence-capped"`
- `data-xr14-final-mode="judgment-prediction-alternatives"`
- `function biopoliticalQuestionUxCopy()`
- `function renderBiopoliticalQuestionUx()`
- `function biopoliticalQuestionPromptContract()`

## Non-goals

This package does not change provider execution, backend behavior, storage, OAuth, schema version, export identity, or hosted release identity.

## Acceptance

XR-14 is acceptable only if:

- the biopolitical lens exposes seven plain-language questions;
- expert ontology remains available but secondary;
- prompt generation applies the Life-Governance Clarity Gate;
- evidence is placed before confidence;
- the final mode requires lower-harm alternative output;
- strategic lens behavior remains unchanged;
- browser-tested controls remain visible and accessible;
- the XR-8 evidence matrix remains compatible.
