# Jarbou3i Model — Strategic Analysis Workbench

A trilingual, client-side workbench for structured strategic analysis using the model:

**Interests → Actors → Tools → Narrative → Results → Feedback**

The tool generates a structured prompt for your preferred AI assistant, imports the JSON answer, then turns it into a navigable analysis with scoring diagnostics, contradictions, scenarios, evidence, assumptions, quality gates, and a polished standalone HTML report export.

## Live usage model

1. Enter an analysis topic.
2. Choose the analysis language and prompt mode.
3. Copy the generated prompt.
4. Paste it into ChatGPT, Claude, Gemini, Perplexity, or another AI assistant.
5. Copy only the JSON result.
6. Paste the JSON into the workbench.
7. Review, score, inspect, and export the analysis as HTML.

## Key properties

- No API key required
- No backend required
- Static GitHub Pages compatible
- Runs client-side in the browser
- Arabic, English, and French UI
- RTL/LTR aware
- Modular static source: `index.html` + `src/styles.css` + `src/app.js`
- Structured JSON import with recovery from common messy output wrappers
- Formal schema contract at `schema/strategic-analysis.schema.json`
- Research Mode prompt with evidence, uncertainty, counter-evidence, and falsifier requirements
- Computed model diagnostics: API, NSI, tool pressure, interest weight, and quality gate
- Contradiction analysis with affected layers
- Scenario/falsifier review
- Evidence and assumption review
- HTML report export only, to keep the workflow focused
- Optimized mascot/icon assets for public web deployment
- PWA manifest for install/share metadata
- Static, schema, fixture, accessibility, RTL, and browser QA gates

## Privacy model

This repository contains a static browser-based tool. The tool itself does not include backend storage, tracking, account login, or server-side processing.

You control where you send the generated prompt. If you paste sensitive content into a third-party AI assistant, that content is subject to that assistant/provider's privacy terms.

Do not paste confidential, personal, classified, legally sensitive, or proprietary information into third-party AI systems unless you understand the risk and have permission.

## Local use

Open `index.html` directly in a browser, or run a local static server:

```bash
npm install
npm run dev
```

Then open:

```text
http://127.0.0.1:4173
```

## GitHub Pages deployment

Recommended simple deployment:

1. Create a GitHub repository.
2. Upload this folder's contents.
3. Go to **Settings → Pages**.
4. Select **Deploy from branch**.
5. Choose `main` and `/root`.
6. Save.

Your app will be available at the GitHub Pages URL.

## Testing

Fast no-browser QA:

```bash
node tests/qa-check.mjs
```

Individual no-browser gates:

```bash
npm run test:static
npm run test:schema
npm run test:fixtures
npm run test:a11y:static
```

Browser gate:

```bash
npm install
npx playwright install --with-deps
npm run test:browser
```

Available scripts:

```bash
npm run test:qa       # consolidated no-browser release gate
npm run test:browser  # all Playwright browser tests
npm run test:e2e      # core Playwright flow only
npm run test:rtl      # Arabic mobile/RTL Playwright smoke only
npm test              # QA gate + browser gate
```

The QA suite checks:

- JavaScript syntax
- modular file layout
- duplicate DOM IDs
- optimized runtime asset references and size limits
- manifest integrity
- schema governance
- fixture quality
- static accessibility basics
- absence of removed export/self-check code paths

The browser suite checks:

- page load
- optimized icon/mascot references
- language switch and RTL/LTR direction
- theme toggle state
- prompt preview modal
- sample analysis import
- review tab navigation
- HTML-only export workflow
- mobile Arabic overflow smoke
- runtime accessibility smoke

## Files

```text
index.html                         # deployable static shell
src/styles.css                     # application stylesheet
src/app.js                         # client-side application logic
manifest.webmanifest               # app/share metadata
assets/jarbou3i-mascot.png         # original high-resolution source asset
assets/jarbou3i-mascot-512.png     # optimized welcome/Open Graph/runtime asset
assets/jarbou3i-mascot-192.png     # optimized header/manifest asset
assets/apple-touch-icon.png        # Apple touch icon
assets/favicon-32.png              # browser favicon
schema/strategic-analysis.schema.json
fixtures/sample-analysis-en.json
fixtures/sample-analysis-ar.json
fixtures/sample-analysis-fr.json
tests/qa-check.mjs                 # consolidated no-browser QA gate
tests/static-check.mjs             # static release checks
tests/schema-check.mjs             # schema governance checks
tests/fixtures-check.mjs           # sample fixture checks
tests/a11y-static-check.mjs        # static accessibility checks
tests/smoke.spec.js                # Playwright core flow
tests/a11y.spec.js                 # Playwright runtime accessibility smoke
tests/rtl-mobile.spec.js           # Playwright mobile RTL smoke
docs/usage-guide.md                # usage guide
docs/visual-qa.md                  # manual visual QA checklist
docs/qa-matrix.md                  # release QA matrix
.github/workflows/ci.yml           # GitHub Actions test workflow
```

## Public release

Public semantic versioning starts at **1.0.0**.

- **1.0.0**: initial public static release.
- **1.1.0**: analytical rigor layer with formal schema, Research mode, computed metrics, source discipline, and fixture validation.
- **1.2.0**: modular QA hardening with split source files, schema checks, accessibility checks, mobile RTL coverage, and stronger release gates.

Before announcing a public rollout, run:

```bash
node tests/qa-check.mjs
npm run test:browser
```

Then complete manual visual QA for Arabic RTL, mobile width around 390 px, dark/light modes, and exported HTML reports.

## License

MIT. See [`LICENSE`](LICENSE).
