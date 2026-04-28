# Jarbou3i Research Engine

Experimental next-generation research workflow layer for the Jarbou3i Model.

This repository is intentionally separate from the stable `Jarbou3i_Model` public repo. It is a lab for research planning, evidence discipline, causal links, analysis compilation, provider-ready AI workflows, critique, hosted-provider experiments, portable-account experiments, privacy-safe exports, browser QA, and Quality Gate v2. The stable manual workflow remains preserved inside the app.

## Current version

`v0.17.0-beta — State Migration + Version Compatibility Layer`

Manual/private mode remains the default. This beta adds an explicit migration layer so legacy research packets from v0.11 through v0.16 can be imported safely into the current schema before validation.

## What this beta adds

- `src/research/migrations.js` with `migrateResearchPacket()`.
- `packet_migration_report` in workflow exports and schema.
- migration fixtures for `v0.11.0-beta` through `v0.16.0-beta`.
- migration-first import path: raw packet → migration → validation → state assignment.
- migration privacy guardrails: live calls disabled, remembered keys disabled, raw secrets redacted.
- New QA: `tests/migration-check.mjs`, `tests/no-browser-qa-suite.mjs`, and `tests/v017-no-browser-suite.mjs`.
- `npm run test:migrations`, `npm run test:v017:no-browser`, and `npm run test:v017`.

## Intended pipeline

```text
Topic/context
→ Research Plan
→ Evidence Matrix
→ Evidence Review Queue
→ Causal Links
→ Analysis Brief Compiler
→ Provider Harness: mock / dry-run / BYOK / hosted proxy / portable mock
→ Provider Response Validation
→ Controlled Repair Loop if needed
→ Privacy Export Guard
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
Portable account mode: provider=portable_oauth uses a local mock OAuth lifecycle only in this beta
Backend key storage: server environment secret only
Portable account storage: token hash only; no raw access/refresh token exists
Exports: keys and raw tokens are sanitized before JSON download
Validation: provider output must pass contract checks before being applied
```

## Local QA

```bash
npm install
npm run test:qa
npm run test:privacy
```

Browser tests require Playwright browsers:

```bash
npx playwright install --with-deps
npm run test:browser:provider
npm run test:browser
```

Full v0.17 QA target:

```bash
npm run test:v017
```

## Deployment

The app remains static and GitHub Pages-compatible. The optional Cloudflare Worker backend scaffold is present for hosted proxy experiments, but the app must continue to work without it.
