# Jarbou3i Research Engine

Experimental next-generation research workflow layer for the Jarbou3i Model.

This repository is intentionally separate from the stable `Jarbou3i_Model` public repo. It is a lab for research planning, evidence discipline, causal links, analysis compilation, provider-ready AI workflows, critique, and Quality Gate v2. The stable manual workflow remains preserved inside the app, but this repo is allowed to evolve aggressively before anything is merged back.

## Current version

`v0.5.0-alpha — BYOK Provider Alpha`

Manual/private mode remains the default. This alpha adds OpenAI-compatible BYOK plumbing behind explicit user opt-in. Mock mode still works without a key, backend, or network call.

## What this alpha adds

- OpenAI-compatible BYOK provider option.
- Endpoint and model settings.
- API key password field with memory-only default.
- Optional local-device key storage behind explicit checkbox.
- Explicit live-call opt-in checkbox.
- Dry-run provider request builder.
- Provider safety report inside request payloads and run ledger entries.
- Live provider adapter for `/v1/chat/completions`-style APIs.
- Guardrail: API keys are never exported into research packets, analysis briefs, reports, or run ledgers.
- Existing MockProvider, Analysis Compiler, Evidence Matrix, Causal Link Workbench, and manual workflow remain intact.

## Intended pipeline

```text
Topic/context
→ Research Plan
→ Evidence Matrix
→ Causal Links
→ Analysis Brief Compiler
→ Provider Harness: mock / dry-run / BYOK
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
npm run test:a11y:static
npm run test:qa
```

Browser checks after installing Playwright browsers:

```bash
npx playwright install --with-deps
npm run test:browser
```

## Repository discipline

Do not treat this repo as production. Merge ideas back into the stable repo only if they satisfy all gates:

1. Works without AI.
2. Does not break manual mode.
3. Passes static/schema/fixture/research QA.
4. Works in EN/AR/FR.
5. Preserves RTL.
6. Adds clear user value.
7. Avoids hidden backend or provider dependency.
8. Never exports API keys or sensitive provider secrets.

## Roadmap

- `v0.1.0-alpha`: Research workflow skeleton.
- `v0.2.0-alpha`: Evidence + causal-link workbench.
- `v0.3.0-alpha`: Analysis Compiler + Diagnostics.
- `v0.4.0-alpha`: Provider Harness + Run Ledger.
- `v0.5.0-alpha`: BYOK Provider Alpha — current.
- `v0.6.0-alpha`: Provider response validation + JSON repair loop.
