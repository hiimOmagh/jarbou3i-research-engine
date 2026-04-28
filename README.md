# Jarbou3i Research Engine

Experimental next-generation research workflow layer for the Jarbou3i Model.

This repository is intentionally separate from the stable `Jarbou3i_Model` public repo. It is a lab for research planning, evidence discipline, causal links, analysis compilation, provider-ready AI workflows, critique, hosted-provider experiments, and Quality Gate v2. The stable manual workflow remains preserved inside the app.

## Current version

`v0.13.0-beta — Evidence Review Queue`

Manual/private mode remains the default. This beta changes the source-import semantics: pasted deep-research / last30days-style outputs no longer enter the Evidence Matrix directly. They are converted into review candidates first, then accepted, edited, or rejected by the user.

## What this beta adds

- Evidence Review Queue panel.
- Imported evidence candidates now use a pending/reviewed lifecycle.
- Source import now routes candidates to the review queue instead of directly appending them to the Evidence Matrix.
- Per-candidate actions:
  - accept
  - edit candidate in the Evidence Matrix form
  - accept edited candidate
  - reject
- Bulk actions:
  - accept all pending
  - export review queue
  - clear resolved candidates
- New schema fields:
  - `evidence_review_queue`
  - `evidence_review_report`
- New QA:
  - `tests/evidence-review-queue-check.mjs`
  - `npm run test:evidence-review`
- Quality Gate v2 now includes an Evidence Review score.

## Intended pipeline

```text
Topic/context
→ Research Plan
→ Evidence Matrix
→ Causal Links
→ Analysis Brief Compiler
→ Provider Harness: mock / dry-run / BYOK / hosted proxy
→ Provider Response Validation
→ Controlled Repair Loop if needed
→ Strategic Analysis JSON
→ Critique
→ Quality Gate
→ Export
```

## Provider safety model

```text
Default: MockProvider / dry-run only
BYOK live calls: require provider=openai_compatible + API key + live opt-in
Hosted live calls: require provider=backend_proxy + proxy endpoint + live opt-in
Backend key storage: server environment secret only
Exports: keys are never included
Validation: provider output must pass contract checks before being applied
```

## Backend setup

```bash
cp backend/.dev.vars.example backend/.dev.vars
npx wrangler secret put OPENAI_API_KEY
npx wrangler dev backend/cloudflare-worker.js --env-file backend/.dev.vars
```

Use this endpoint locally:

```text
http://localhost:8787/api/provider-task
```

Deploy the worker separately from the static GitHub Pages app, then set the Provider Harness endpoint to your deployed `/api/provider-task`.

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
npm run test:backend
npm run test:backend:worker
npm run test:a11y:static
npm run test:qa
```

Browser checks after installing Playwright browsers:

```bash
npx playwright install --with-deps
npm run test:browser
```

## Repository discipline

This repo is an R&D branch, not the stable public product. Merge features back into the stable repo only after they work without AI, preserve manual mode, pass static/schema/provider/backend/browser checks, preserve EN/AR/FR, and keep RTL intact.


## v0.11.0-beta — Source-Assisted Backend Planning Layer

This increment adds the planning layer for future source-assisted research. It does **not** perform live crawling, scraping, or factual source verification.

Added capabilities:
- Source connector registry with `manual_mock`, planned web search, GitHub, Hacker News, YouTube, Reddit, and Polymarket connectors.
- Source task contracts for source planning, query planning, claim extraction, evidence scoring, and source clustering.
- Planning-only backend endpoint `POST /api/source-task`.
- Source policy object enforcing `live_fetching_enabled: false`.
- Source diagnostics and source fixture suite.
- Quality Gate v2 source-planning, source-policy, and source-fixture scores.

Operational rule: the source layer may prepare requests and evidence-extraction contracts, but it must not claim real source verification until a compliant fetch/search connector is implemented.

## v0.12.0-beta — Source Import Adapter

This beta adds a manual source-import bridge for external research outputs. Paste notes from deep-research workflows, last30days-style reports, or generic source summaries into the Source Import Adapter. The app previews candidate evidence items and can import them into the Evidence Matrix.

Safety rule: the adapter does not fetch, scrape, crawl, or verify sources. Imported entries are marked as manual/unverified candidates and must be reviewed before synthesis or publication.

New QA command:

```bash
npm run test:source:import
```
