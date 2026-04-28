# Jarbou3i Research Engine

Experimental next-generation research workflow layer for the Jarbou3i Model.

This repository is intentionally separate from the stable `Jarbou3i_Model` public repo. It is a lab for research planning, evidence discipline, causal links, analysis compilation, provider-ready AI workflows, critique, and Quality Gate v2. The stable manual workflow remains preserved inside the app, but this repo is allowed to evolve aggressively before anything is merged back.

## Current version

`v0.6.0-alpha — Provider Response Validation Alpha`

Manual/private mode remains the default. This alpha adds a reliability layer around provider outputs: JSON extraction, task-specific response validation, controlled repair fallback, validation metadata in the Run Ledger, and a response-validation score in Quality Gate v2.

## What this alpha adds

- Provider response parsing with fenced-JSON cleanup and JSON-object extraction.
- Task-specific response validation for research plan, strategic synthesis, repair, critique, and source discipline.
- Controlled repair fallback when a provider response fails its contract.
- Rejected provider responses no longer enter the analysis import box.
- Run Ledger entries now include `response_validation` and `repair_trace`.
- Quality Gate v2 now includes a dedicated Response Validation score.
- `provider-response-check.mjs` validates the reliability layer.
- BYOK OpenAI-compatible plumbing remains available but live calls still require explicit user opt-in.
- API keys remain excluded from exported packets, analysis briefs, reports, and run ledgers.

## Intended pipeline

```text
Topic/context
→ Research Plan
→ Evidence Matrix
→ Causal Links
→ Analysis Brief Compiler
→ Provider Harness: mock / dry-run / BYOK
→ Provider Response Validation
→ Controlled Repair Loop if needed
→ Strategic Analysis JSON
→ Critique
→ Quality Gate
→ Export
```

## BYOK safety model

```text
Default: MockProvider / dry-run only
Live calls: require provider=openai_compatible + API key + Enable live BYOK calls
Key storage: memory-only unless “Remember locally on this device” is checked
Exports: keys are never included
Validation: provider output must pass contract checks before being applied
```

## Local usage

```bash
npm install
npm run dev
```

Open the local server URL shown by `http-server`.

## QA

No-browser checks:

```bash
npm run test:static
npm run test:schema
npm run test:fixtures
npm run test:research
npm run test:provider
npm run test:a11y:static
npm run test:qa
```

Browser checks after installing Playwright browsers:

```bash
npx playwright install --with-deps
npm run test:browser
```

## Repository discipline

This repo is an R&D branch, not the stable public product. Merge features back into the stable repo only after they work without AI, preserve manual mode, pass static/schema/provider/browser checks, preserve EN/AR/FR, and keep RTL intact.
