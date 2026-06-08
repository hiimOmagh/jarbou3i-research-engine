## v1.3.0-bio-rc.1 — Release Candidate Label + Final Handoff

- Relabeled the locked alpha.7 evidence/release-candidate baseline as `v1.3.0-bio-rc.1`.
- Added final handoff documentation for source-of-truth, validation, evidence, CI, and commit/push expectations.
- Preserved the Strategic/Biopolitical dual-lens feature set without product expansion.
- Kept the isolated hosted-evidence browser gate and evidence-review check as release-candidate requirements.
- Updated app, export, tests, documentation, package, and lockfile metadata to `1.3.0-bio-rc.1`.

## v1.3.0-bio-rc.1 — Evidence Artifact Review + Release Candidate Freeze

- Added `tests/hosted-demo-evidence-review-check.mjs` to verify hosted-demo evidence artifacts after browser capture.
- Added `npm run test:evidence:hosted` as the manual/local evidence review alias.
- Updated GitHub Actions to review `hosted-demo-evidence/` before uploading the artifact.
- Added `docs/evidence-artifact-review.md` to document required evidence files, metadata, locale snapshots, and release-candidate freeze rules.
- Bumped root app identity and lockfile metadata to `1.3.0-bio-rc.1`.

## v1.3.0-bio-rc.1 — Hosted Demo Evidence + Public UI Lock

- Added `tests/hosted-demo-evidence.spec.js` for browser-captured public UI evidence.
- Added `npm run test:browser:hosted` as a focused hosted-demo evidence gate.
- Captures desktop/mobile screenshots plus Arabic, English, and French visible-text snapshots.
- Added GitHub Actions artifact upload for `hosted-demo-evidence`.
- Hardened workspace hygiene against both local and CI hosted-demo evidence folders.
- Updated release-lock and export docs to cover public UI evidence capture.
- Bumped root app identity and lockfile metadata to `1.3.0-bio-rc.1`.

## v1.3.0-bio-alpha.5 — Release Lock + CI Hygiene Hardening

- Added stable CI aliases: `test:ci:no-browser`, `test:ci:browser`, and `test:ci`.
- Updated GitHub Actions to run the same no-browser and browser aliases validated locally.
- Added `tests/ci-script-contract-check.mjs` to prevent workflow/package-script drift.
- Hardened workspace hygiene against preview tracks, Playwright output, patch folders, and root patch/package ZIP artifacts.
- Added release lock documentation in `docs/release-lock.md`.
- Bumped root app identity and lockfile metadata to `1.3.0-bio-alpha.5`.

# Changelog

## v1.3.0-bio-alpha.5 — Review Title Lens Contract Hotfix

- Made the review heading explicitly lens-aware for strategic mode as well as biopolitical mode.
- Preserved the stable `#reviewTitle` browser-test anchor added in alpha.4.1.
- Bumped contract checks to `1.3.0-bio-alpha.5`.

## v1.3.0-bio-alpha.5 — Lens Import Contract + Cross-Locale Export QA

- Added browser import-contract coverage proving `analysis_lens` in imported JSON overrides the previous UI lens state.
- Added browser export coverage across Arabic, English, and French for both Strategic and Biopolitical lenses.
- Added a root source-of-truth guard to reject committed `preview/` or `biopreview/` duplicate app tracks.
- Added optional workspace hygiene checks for patch folders and Playwright output artifacts before commit.
- Preserved the explicit HTML export contract markers introduced in alpha.3.

## v1.3.0-bio-alpha.3.3 — Export Scenario Rationale Contract Hotfix

- Includes scenario rationale text in downloaded HTML reports so export evidence preserves why a scenario is plausible.
- Keeps the biopolitical export contract assertion for the English `proof infrastructure` sample token.
- Adds a static guard so the scenario rationale renderer cannot silently disappear.

## v1.3.0-bio-alpha.3.2 — Export Contract Locale Determinism Hotfix

- Fixed export-contract browser coverage so English sample-token assertions first switch the UI locale to English.
- Preserved the lens contract assertions for Strategic and Biopolitical exports.
- No runtime/export behavior change beyond version identity.

## v1.3.0-bio-alpha.3 — Browser Evidence + Export Contract Hardening

- Added exported HTML contract markers for `app-version` and `analysis-lens`.
- Added `data-analysis-lens` and `data-app-version` attributes to the standalone report shell.
- Added browser export contract coverage that downloads Strategic and Biopolitical HTML reports through the real UI and attaches them as Playwright evidence.
- Added positive/negative export assertions so Strategic reports do not leak Biopolitical report identity and Biopolitical reports do not leak the Strategic report chain.
- Added `docs/export-contract.md` and `npm run test:browser:export`.

## v1.3.0-bio-alpha.2.2 — Runtime Metric Renderer Smoke Fix

- Restored the missing `metricCard` runtime renderer used by the overview quality panel.
- Added a static guard so future scoring UI updates cannot pass without the metric renderer.
- Preserved the alpha.2.1 layout and review-panel stability fixes.


## v1.3.0-bio-alpha.2.1 — Browser Smoke Hotfix

- Hardened the Strategic/Biopolitical lens toggle layout so adjacent select fields cannot intercept browser click targets.
- Added defensive review-tab fallback rendering so sample loading cannot leave the review panel empty after viewport-dependent interaction timing.

## 1.3.0-bio-alpha.2 — Lens-Aware Scoring + Preview Track Decision

- Added biopolitical ontology diagnostics for problematization, population construction, governance techniques, normalization/subjectivation, embodied/social outcomes, and resistance/feedback.
- Made the quality score lens-aware: Strategic keeps the original strategic scoring emphasis, while Biopolitical increases weight on governance coherence and protection/control contradictions.
- Added biopolitical-specific score diagnostics, health warnings, formula text, and evidence pressure checks.
- Added `docs/preview-track-decision.md` to prevent root/preview source-of-truth drift.
- Strengthened QA/static gates to require lens-aware scoring and the preview-track decision document.

## 1.3.0-bio-alpha.1 — Biopolitical Lens Toggle Foundation

- Added a visible Strategic/Biopolitical analysis lens toggle.
- Preserved the original strategic model and backward-compatible six-array JSON structure.
- Added `analysis_lens` support to normalization, generated schema prompts, formal schema, and fixtures.
- Added biopolitical prompt ontology: problematization, populations, governance techniques, norms/subjectivation, embodied/social outcomes, and resistance/feedback.
- Added lens-aware UI labels, topic placeholders, engine map copy, report subtitle, health messages, and score hints.
- Added trilingual biopolitical labels for Arabic, English, and French.
- Added strategic and biopolitical sample routing through the existing sample button.
- Added biopolitical fixtures in Arabic, English, and French.
- Strengthened QA gates to detect missing analysis-lens support and missing biopolitical ontology tokens.


## 1.2.0 — Modular QA hardening

- Split the former single-file app into `index.html`, `src/styles.css`, and `src/app.js` while preserving static GitHub Pages deployment.
- Added app version metadata for release verification.
- Added consolidated QA gate at `tests/qa-check.mjs`.
- Added dedicated schema governance check at `tests/schema-check.mjs`.
- Added static accessibility gate at `tests/a11y-static-check.mjs`.
- Added mobile RTL Playwright smoke coverage at `tests/rtl-mobile.spec.js`.
- Added runtime accessibility Playwright smoke coverage at `tests/a11y.spec.js`.
- Strengthened the formal JSON schema with required IDs, minimum section counts, evidence counter-pressure, and scenario falsifier requirements.
- Updated package scripts for QA, schema, fixture, accessibility, browser, and RTL checks.

## 1.1.0 — Analytical rigor upgrade

- Added formal schema contract at `schema/strategic-analysis.schema.json`.
- Added Research prompt mode with source discipline, counter-evidence, uncertainty, IDs, and silent self-audit instructions.
- Added computed model metrics: API, NSI, tool pressure score, and interest weight.
- Added quality gate logic before publication/export.
- Strengthened evidence handling with source metadata and counter-evidence.
- Added fixture validation tests.

## 1.0.0 — Initial public release

- Public semantic versioning starts here.
- Added optimized runtime image assets: 512 px, 192 px, 180 px, and 32 px versions. The original 2048 px mascot remains as the editable/source asset only.
- Added trilingual UI: Arabic, English, and French.
- Fixed RTL welcome layout and mascot integration.
- Simplified export workflow to HTML report only.
- Added static release checks and Playwright smoke test skeleton.
