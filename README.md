# Jarbou3i Research Engine

Experimental next-generation research workflow layer for the Jarbou3i Model.

This repository is intentionally separate from the stable `Jarbou3i_Model` public repo. It is a lab for research planning, evidence discipline, causal links, mock AI workflows, critique, and Quality Gate v2. The stable manual workflow remains preserved inside the app, but this repo is allowed to evolve aggressively before anything is merged back.

## Current version

`v0.1.0-alpha — Research Workflow Skeleton`

No live AI calls. No backend. No API keys. No external data fetching.

## What this alpha adds

- Research Plan panel
- Evidence Matrix panel
- Mock AI Workflow panel
- Quality Gate v2 draft
- Research workflow schema: `schema/research-workflow.schema.json`
- Research fixture: `fixtures/research/sample-research-workflow-en.json`
- Research QA gate: `tests/research-workflow-check.mjs`
- Existing manual prompt/import/review/export workflow remains intact

## Intended pipeline

```text
Topic/context
→ Research Plan
→ Evidence Matrix
→ Mock/AI synthesis
→ Strategic Analysis JSON
→ Critique
→ Quality Gate
→ Export
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

## Roadmap

- `v0.1.0-alpha`: Research workflow skeleton — current.
- `v0.2.0-alpha`: Cleaner provider abstraction and mock-provider fixtures.
- `v0.3.0-alpha`: Evidence import adapters and causal-link editor.
- `v0.4.0-beta`: BYOK OpenAI-compatible provider.
- `v0.5.0-beta`: Hosted backend proxy experiment.
- `v1.0.0`: Stable research engine candidate.
