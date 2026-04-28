# Architecture — Jarbou3i Research Engine

## Principle

The AI layer must feed the model; it must not become the model.

The strategic model remains:

```text
Interests → Actors → Tools → Narrative → Results → Feedback
```

The research engine adds a pre-analysis layer:

```text
Research Plan → Evidence Matrix → Causal Links → Strategic JSON → Critique → Quality Gate
```

## Current alpha architecture

```text
index.html
src/styles.css
src/app.js                 stable inherited app logic
src/research-engine.js     isolated alpha research workflow
schema/strategic-analysis.schema.json
schema/research-workflow.schema.json
fixtures/
tests/
```

`src/research-engine.js` does not call external APIs. It reads/writes only the DOM and localStorage, then places generated mock JSON into the existing import field.

## Why mock first

Mock-first development proves workflow correctness before adding provider complexity, billing, CORS, keys, backend security, or rate limits.

## Future provider interface

```text
generateResearchPlan(input)
generateAnalysis(input)
repairAnalysis(input)
critiqueAnalysis(input)
strengthenEvidence(input)
```

Providers should be swappable:

```text
MockProvider
OpenAICompatibleProvider
BackendProxyProvider
Future local/provider adapters
```
