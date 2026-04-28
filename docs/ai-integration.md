# AI Integration Policy

## Current state

`v0.2.0-alpha` has no live AI provider, no backend, no source crawling, and no API key storage.

## Principle

AI is a workflow assistant, not the authority. The schema and evidence model remain the authority.

## Required future provider interface

```text
generateResearchPlan(input)
generateAnalysis(packet)
repairAnalysis(invalidJson, validationErrors)
critiqueAnalysis(packetOrAnalysis)
strengthenEvidence(packet)
```

## Forbidden in alpha

- No hidden API calls.
- No backend dependency.
- No claims of source verification.
- No storage of API keys.

## Future BYOK constraints

- API key stored in memory by default.
- Local persistence only by explicit user choice.
- Key must never appear in exports, reports, DOM logs, or research packets.
