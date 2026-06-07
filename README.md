# Jarbou3i Model — Dual-Lens Analysis Workbench

A trilingual, client-side workbench for structured analysis with two switchable lenses:

1. **Strategic / geopolitical lens** — **Interests → Actors → Tools → Narrative → Results → Feedback**
2. **Biopolitical lens** — **Problematization → Populations → Governance Techniques → Norms/Subjectivation → Embodied Outcomes → Resistance/Feedback**

The tool generates a structured prompt for your preferred AI assistant, imports the JSON answer, then turns it into a navigable analysis with scoring diagnostics, contradictions, scenarios, evidence, assumptions, quality gates, and a polished standalone HTML report export.

## Live usage model

1. Enter an analysis topic.
2. Choose the analysis language, prompt mode, and analysis lens.
3. Use **Strategic** for geopolitical/state/institutional power analysis.
4. Use **Biopolitical** for analysis of bodies, populations, health, risk, classification, normalization, conduct, and resistance.
5. Copy the generated prompt.
6. Paste it into ChatGPT, Claude, Gemini, Perplexity, or another AI assistant.
7. Copy only the JSON result.
8. Paste the JSON into the workbench.
9. Review, score, inspect, and export the analysis as HTML.

## Key properties

- Strategic and biopolitical modes remain available through a visible toggle.
- No API key required.
- No backend required.
- Static GitHub Pages compatible.
- Runs client-side in the browser.
- Arabic, English, and French UI.
- RTL/LTR aware.
- Modular static source: `index.html` + `src/styles.css` + `src/app.js`.
- Structured JSON import with recovery from common messy output wrappers.
- Formal schema contract at `schema/strategic-analysis.schema.json` with `analysis_lens` support.
- Research Mode prompt with evidence, uncertainty, counter-evidence, and falsifier requirements.
- Lens-aware layer labels, prompt ontology, sample loading, report subtitle, diagnostics, and scoring formulas.
- Biopolitical scoring checks problematization, population construction, governance techniques, normalization/subjectivation, embodied/social outcomes, and resistance/feedback.
- Computed model diagnostics, contradiction review, scenario/falsifier review, evidence and assumption review.
- HTML report export only, to keep the workflow focused.
- Exported reports carry explicit `app-version` and `analysis-lens` metadata so Strategic and Biopolitical reports remain auditable outside the app.
- Imported JSON `analysis_lens` is authoritative and overrides stale UI toggle state.
- Cross-locale export QA covers Arabic, English, and French for both lenses.
- Root source-of-truth QA rejects duplicate committed app tracks such as `preview/` or `biopreview/`.
- Optimized mascot/icon assets for public web deployment.
- PWA manifest for install/share metadata.
- Static, schema, fixture, accessibility, RTL, and browser QA gates.

## Lens behavior

The implementation keeps the original six internal JSON arrays for backward compatibility. The selected lens changes their semantic interpretation:

| Internal key | Strategic lens | Biopolitical lens |
|---|---|---|
| `interests` | Interests | Problematization |
| `actors` | Actors | Populations / Subjects |
| `tools` | Tools | Governance Techniques |
| `narrative` | Narrative | Norms / Subjectivation |
| `results` | Results | Embodied / Social Outcomes |
| `feedback` | Feedback | Resistance / Normalization Feedback |

This prevents old strategic JSON imports from breaking while allowing biopolitical prompts and fixtures to produce materially different analysis.

## Preview/root source-of-truth rule

The deployable app must live at repository root. A `preview/` or `biopreview/` folder may be used temporarily for manual inspection, but after promotion it should not remain as a second committed app track. See `docs/preview-track-decision.md`.

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

Focused export-contract browser gate:

```bash
npm run test:browser:export
```

## v1.3.0-bio-alpha.4.2 review title lens contract

The visible review heading now reflects the active/imported lens: Strategic imports render a Strategic review title, and Biopolitical imports render a Biopolitical review title. The stable `#reviewTitle` anchor remains available for browser contracts.

