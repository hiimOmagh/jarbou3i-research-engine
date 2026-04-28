# Deployment Notes

## Static app: GitHub Pages

1. Push this folder to the GitHub repository.
2. Go to **Settings → Pages**.
3. Use **Deploy from branch**.
4. Select branch `main` and folder `/root`.
5. Save and wait for the Pages URL.

The static app works without a backend. Manual mode, MockProvider, dry-run provider payloads, imports, exports, evidence matrix, causal links, and Quality Gate v2 remain available on GitHub Pages.

## Optional backend: Cloudflare Worker

The hosted proxy is deployed separately from GitHub Pages.

```bash
npm install
npx wrangler secret put OPENAI_API_KEY
npx wrangler deploy
```

Then set the Provider Harness to:

```text
Provider: Hosted backend proxy
Endpoint: https://<your-worker>.<your-subdomain>.workers.dev/api/provider-task
Enable live provider calls: checked
```

Keep MockProvider as the default for public demos.

## Local Worker test

```bash
cp backend/.dev.vars.example backend/.dev.vars
npx wrangler dev backend/cloudflare-worker.js --env-file backend/.dev.vars
```

Use this local endpoint in the app:

```text
http://localhost:8787/api/provider-task
```

## Required release checks

Run before pushing a release:

```bash
npm install
npm run test:qa
npm run test:backend
npx playwright install --with-deps
npm run test:browser
```

`npm run test:qa` is the fast no-browser gate. It checks JavaScript syntax, modular source layout, duplicate DOM IDs, manifest integrity, optimized image references, schema governance, fixture quality, provider contracts, backend proxy contract checks, static accessibility basics, and absence of removed legacy export/self-check paths.

`npm run test:backend` imports the Cloudflare Worker in Node, mocks the upstream provider, and verifies health, CORS, task allow-listing, prompt limits, secret stripping, and successful provider-task response shape.

`npm run test:browser` runs the Playwright browser flow, runtime accessibility smoke, and RTL/mobile smoke tests.

## CI

The repository includes a GitHub Actions workflow at:

```text
.github/workflows/ci.yml
```

It runs on pushes and pull requests.

## Public release checklist

- [ ] README reviewed.
- [ ] Changelog includes `v0.14.0-beta` backend smoke hardening.
- [ ] License selected deliberately.
- [ ] Security notice reviewed.
- [ ] GitHub Pages deployment works.
- [ ] `npm run test:qa` passes.
- [ ] `npm run test:backend` passes.
- [ ] `npm run test:browser` passes.
- [ ] Full CI passes.
- [ ] Visual QA checklist completed.
- [ ] Arabic, English, and French UI inspected.
- [ ] Arabic RTL exported HTML report inspected.
- [ ] Mobile width around 390 px inspected.
- [ ] Runtime images load from optimized assets, not the 2048 px source file.
- [ ] Hosted backend proxy is disabled unless explicitly tested.
- [ ] `OPENAI_API_KEY` exists only as a secret.
- [ ] `ALLOWED_ORIGINS` is restricted before public hosted-mode use.
- [ ] Formal schemas exist at `schema/strategic-analysis.schema.json` and `schema/research-workflow.schema.json`.
- [ ] Fixture validation passes.
- [ ] Research mode prompt is manually tested with one fresh topic.


## v0.14.0-beta — Source-Assisted Backend Planning Layer

This increment adds the planning layer for future source-assisted research. It does **not** perform live crawling, scraping, or factual source verification.

Added capabilities:
- Source connector registry with `manual_mock`, planned web search, GitHub, Hacker News, YouTube, Reddit, and Polymarket connectors.
- Source task contracts for source planning, query planning, claim extraction, evidence scoring, and source clustering.
- Planning-only backend endpoint `POST /api/source-task`.
- Source policy object enforcing `live_fetching_enabled: false`.
- Source diagnostics and source fixture suite.
- Quality Gate v2 source-planning, source-policy, and source-fixture scores.

Operational rule: the source layer may prepare requests and evidence-extraction contracts, but it must not claim real source verification until a compliant fetch/search connector is implemented.
