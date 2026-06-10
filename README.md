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
- Hosted/demo evidence capture produces desktop/mobile screenshots and EN/AR/FR visible-text snapshots for public UI review.
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

Local validation is split because the hygiene gate intentionally rejects generated folders such as `node_modules/`. Run the clean no-browser lock first, then install dependencies for browser evidence, then clean generated artifacts before commit. See `docs/local-ci-split.md`.

Clean no-browser lock:

```bash
node tests/ci-script-contract-check.mjs
npm run test:qa
node tests/static-check.mjs
npm run test:ci:no-browser
```

Browser and hosted-evidence lock:

```bash
npm install
npm run test:ci:browser
```

Final hygiene before commit:

```bash
npm run test:hygiene
git diff --check
```

Individual no-browser gates:

```bash
npm run test:static
npm run test:schema
npm run test:fixtures
npm run test:a11y:static
```

Focused export-contract browser gate:

```bash
npm run test:browser:export
```

Focused hosted-demo evidence gate:

```bash
npm run test:browser:hosted
```

## v1.4.0-bio-alpha.1 review title lens contract

The visible review heading now reflects the active/imported lens: Strategic imports render a Strategic review title, and Biopolitical imports render a Biopolitical review title. The stable `#reviewTitle` anchor remains available for browser contracts.

## v1.4.0-bio-alpha.1 hosted demo evidence

The public UI lock adds `npm run test:browser:hosted`, which captures desktop/mobile screenshots, EN/AR/FR visible-text snapshots, and `hosted-demo-metadata.json`. GitHub Actions uploads the generated `hosted-demo-evidence` artifact after the browser job. Local evidence folders are generated artifacts and must be removed before commit.

## v1.4.0-bio-alpha.1 release lock

The release lock uses root-only source control and stable CI aliases. Run `npm run test:ci:no-browser` for static/schema/fixture/a11y/source/hygiene coverage, then `npm run test:ci:browser` for Playwright coverage. GitHub Actions uses the same aliases so local proof and CI proof stay aligned.

## v1.4.0-bio-alpha.1 evidence artifact review

Alpha.7 freezes the hosted-demo/public UI evidence chain as a stable baseline. After browser evidence capture, run:

```bash
node tests/hosted-demo-evidence-review-check.mjs hosted-demo-evidence-local
```

GitHub Actions reviews `hosted-demo-evidence/` before uploading the evidence artifact. The review verifies required screenshots, EN/AR/FR visible-text snapshots, metadata version alignment, lens toggle visibility, RTL/LTR contracts, and public UI lock flags.

## v1.4.0-bio-alpha.1 final handoff

The Stable release freezes the dual-lens biopolitical baseline without feature expansion. Use `docs/final-handoff.md` as the operator handoff for source-of-truth rules, validation commands, evidence review, CI expectations, and release-freeze boundaries.

## v1.4.0-bio-alpha.1 stable release archive

The stable `v1.4.0-bio-alpha.1` pass promotes the locked release-candidate baseline to the stable release line. No product behavior changes are included. Use `docs/stable-release-archive.md` for tag, archive, and generated-artifact rules.


## v1.4.0-bio-alpha.1 — Expanded Biopolitical Systems Model

Adds an optional expanded biopolitical systems map covering human, society, state, market, corporate/platform, geopolitical, technology, and behavioral-engineering layers. The base Strategic/Biopolitical lens contract remains backward-compatible with v1.3.0-bio imports. See `docs/expanded-biopolitical-systems-model.md`.

## v1.4.0-bio-alpha.2.1 — Local CI Split + Hosted Evidence Version Guard

Adds split local validation scripts and documentation so `node_modules/` does not collide with the hygiene lock. Hosted evidence snapshots now record the runtime `meta[name="app-version"]` value and the evidence-review gate requires metadata and visible-text version agreement. Product behavior is unchanged.

## v1.4.0-bio-alpha.2 — Expanded Systems Map Review UX

Biopolitical imports now expose a dedicated Systems Map review tab covering human, society, state, market, corporate/platform, geopolitical, technology, and behavioral-engineering axes. The `systems.items` block remains optional for backward compatibility, but the alpha.2 fixture and browser checks now verify all eight axes when explicit systems data is provided.

## v1.4.0-bio-alpha.4.1 review selector hotfix

This hotfix keeps the localized systems export evidence unchanged and scopes the systems review coverage marker to avoid Playwright strict-mode ambiguity between review and export-preview blocks.

## v1.4.0-bio-alpha.4 export and prompt sample polish

The biopolitical lens now includes a prompt-sample UX for the expanded systems model. In Biopolitical mode, the guide displays a sample topic that demonstrates all eight axes before the user copies the prompt. The Systems Map export is also easier to read, with a systems narrative, table, and card fallback while keeping machine-readable export attributes.
## v1.4.0-bio-alpha.7.1 prompt contract and sample gate

Biopolitical prompt generation now includes an explicit Expanded Biopolitical Systems Prompt Contract. The copied/previewed prompt requires `systems.items` to cover all eight axes and to separate life process, population construction, governance infrastructure, incentive structure, technology mediation, behavioral engineering, resistance/adaptation, and power redistribution. The localized EN/AR/FR prompt sample path now demonstrates the expanded systems model before prompt copy.


## v1.4.0-bio-alpha.7.1 systems completeness diagnostics

Biopolitical review now includes a compact **Systems Completeness** diagnostic. It scores whether imported `systems.items` explicitly cover all eight expanded systems axes and whether each axis includes actor, mechanism, incentive, norm, outcome, resistance, and power-shift fields. The diagnostic warns when incentive structure, technology mediation, behavioral engineering, resistance/adaptation, or power redistribution are missing.

Strategic mode is unchanged.

## v1.4.0-bio-alpha.7.1 smoke stability note

This hotfix does not change product behavior. It stabilizes the browser smoke gate after the expanded systems diagnostics increased the review surface. The smoke test now has a larger timeout budget and explicitly verifies tab selected-state while traversing Overview, Systems Map, Layers, Contradictions, Scenarios, Evidence, and Exports.


## v1.4.0-bio-alpha.7.1 diagnostics export and replay fixture

Alpha.7 exports the biopolitical Systems Completeness diagnostic into the HTML report. The export now carries machine-readable markers for quality score, axis coverage, field completion, critical completion, source, and missing critical fields. It also adds `fixtures/sample-analysis-bio-thin-en.json` as an evidence replay fixture for incomplete systems output, proving that missing incentive, technology mediation, behavioral engineering, resistance, and power redistribution signals remain visible after export.
