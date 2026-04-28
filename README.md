# Jarbou3i Research Engine

Experimental next-generation research workflow layer for the Jarbou3i Model.

This repository is intentionally separate from the stable `Jarbou3i_Model` public repo. It is a lab for research planning, evidence discipline, causal links, mock AI workflows, critique, and Quality Gate v2. The stable manual workflow remains preserved inside the app, but this repo is allowed to evolve aggressively before anything is merged back.

## Current version

`v0.2.0-alpha — Evidence + Causal Link Workbench`

No live AI calls. No backend. No API keys. No external data fetching.

## What this alpha adds

- Editable Evidence Matrix: add, edit, delete, import, and export research-packet evidence.
- Causal Link Workbench: manually connect model IDs with evidence-backed relationships.
- Inference helper: generate draft causal links from evidence `supports` and `contradicts` fields.
- Research packet schema: `workflow_version`, `research_plan`, `evidence_matrix`, `causal_links`, and optional `critique`.
- Quality Gate v2 expansion: plan, evidence, source discipline, source diversity, counter-evidence, causal links, critique, and readiness.
- Mock AI Workflow remains local and provider-free.
- Existing manual prompt/import/review/export workflow remains intact.

## Intended pipeline

```text
Topic/context
→ Research Plan
→ Evidence Matrix
→ Causal Links
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

- `v0.1.0-alpha`: Research workflow skeleton.
- `v0.2.0-alpha`: Evidence + causal-link workbench — current.
- `v0.3.0-alpha`: Provider abstraction split and prompt module hardening.
- `v0.4.0-beta`: BYOK OpenAI-compatible provider.
