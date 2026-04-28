# Jarbou3i Research Engine

Experimental next-generation research workflow layer for the Jarbou3i Model.

This repository is intentionally separate from the stable `Jarbou3i_Model` public repo. It is a lab for research planning, evidence discipline, causal links, analysis compilation, provider-ready AI workflows, critique, and Quality Gate v2. The stable manual workflow remains preserved inside the app, but this repo is allowed to evolve aggressively before anything is merged back.

## Current version

`v0.8.0-alpha — Provider UX + Contract Fixtures`

Manual/private mode remains the default. This alpha does not add a backend or force live AI. It makes the provider layer inspectable before backend work by adding response-contract previews, prompt previews, provider diagnostics, and fixture-driven malformed-response tests while preserving the module split from v0.7.0-alpha.

## What this alpha adds

- Provider response-contract preview for every task.
- Provider prompt preview with prompt length, fingerprint, privacy mode, and truncation status.
- Provider diagnostics export covering contract, prompt preview, safety, validation, repair trace, and fixture results.
- `src/research/provider-fixtures.js` for deterministic contract fixtures.
- `fixtures/provider/` with valid, malformed, and noisy provider response cases.
- `tests/provider-fixtures-check.mjs` and `npm run test:provider:fixtures`.
- Quality Gate v2 Contract Fixtures score.

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
npm run test:provider:fixtures
npm run test:modules
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
