## v1.4.0-bio-alpha.6.1 — Smoke Tab Stability Hotfix

- Keeps v1.4.0-bio-alpha.6 product behavior unchanged.
- Extends the core smoke test timeout for the expanded diagnostics browser surface.
- Uses explicit tab scrolling, visibility, and selected-state assertions before moving between review tabs.
- Adds the Systems Map tab to the smoke navigation pass.

## v1.4.0-bio-alpha.6.1 — Biopolitical Output Quality Scoring + Systems Completeness Diagnostics

- Added a Systems Completeness diagnostic for Biopolitical analyses.
- Scores whether imported `systems.items` explicitly populate all eight axes and required fields.
- Adds critical warnings for missing incentive structure, technology mediation, behavioral engineering, resistance/adaptation, and power redistribution.
- Displays compact axis coverage, field completion, and critical diagnostic completion inside the review UI.
- Added browser coverage for both complete and thin systems output quality paths.
- Preserved Strategic mode and the alpha.5 prompt/export/evidence guards.

## v1.4.0-bio-alpha.4.1 — Systems Map Review Selector Hotfix

- Scoped the review-axis coverage marker to the primary systems review block.
- Preserved localized systems export evidence markers and canonical export axis coverage.
- Fixed Playwright strict-mode ambiguity caused by review and export-preview blocks sharing `data-system-axis-coverage="8"`.
- No product expansion.

## v1.4.0-bio-alpha.4 — Expanded Systems Map Localization + Export Evidence Lock

- Added localized systems-map export evidence markers for EN/AR/FR: `data-system-export-evidence="localized-systems-map"`, `data-system-export-locale`, `data-system-export-dir`, and `data-system-axis-coverage="8"`.
- Locked exported systems axis labels to the active UI locale while preserving canonical machine-readable axis IDs.
- Added browser evidence coverage for localized biopolitical systems exports in Arabic, English, and French.
- Preserved Strategic mode and the alpha.3.1 systems map export/review hotfix behavior.

## v1.4.0-bio-alpha.3.1 — Systems Map Export Contract Hotfix

- Fixed the Systems Map review contract so `[data-system-axis]` appears exactly once per expanded axis.
- Reused the polished systems map renderer inside HTML exports so `data-system-export-polish="readable-table"` and the export narrative marker are emitted.
- No product scope expansion.

## v1.4.0-bio-alpha.3 — Expanded Systems Map Export Polish + Prompt Sample UX

- Added a visible expanded biopolitical prompt-sample card for the eight-axis systems model.
- Added a one-click prompt sample topic covering platform attention, algorithmic addiction, state security, and US-China geopolitics.
- Polished the Systems Map HTML export with a readable narrative, table, and card layout.
- Added export contract tokens for `data-system-export-polish="readable-table"` and `data-system-export-narrative="expanded-biopolitical"`.
- Preserved Strategic mode and the local CI split / hosted evidence version guard.

## v1.4.0-bio-alpha.2.1 — Local CI Split + Hosted Evidence Version Guard

- Added local split validation aliases and documentation so clean no-browser gates run before `npm install`, browser gates run after dependencies are present, and final hygiene runs after generated artifacts are removed.
- Added `tests/local-ci-split-contract-check.mjs` to prevent local validation instructions from drifting from package scripts.
- Hardened hosted evidence snapshots so per-locale visible-text JSON records the runtime `meta[name="app-version"]` value instead of only stamping a constant.
- Hardened hosted evidence review so metadata `app_version`, metadata `evidence_version`, and every visible-text snapshot `app_version` must agree.
- Preserved product behavior, Systems Map UX, import fixtures, and browser test coverage.

## v1.4.0-bio-alpha.2 — Expanded Systems Map Review UX + Import Fixture Coverage

- Added a dedicated biopolitical Systems Map review tab.
- Added `fixtures/sample-analysis-bio-en.json` with all eight expanded systems axes.
- Added browser coverage for systems map rendering and HTML export machine-readable axes.
- Hardened fixture checks to require all eight systems axes for biopolitical fixtures.
- Preserved strategic mode and older biopolitical imports through derived fallback systems maps.

## v1.4.0-bio-alpha.1 — Stable Release Tag + Archive

- Relabeled the locked alpha.7 evidence/stable baseline as `v1.4.0-bio-alpha.1`.
- Added final handoff documentation for source-of-truth, validation, evidence, CI, and commit/push expectations.
- Preserved the Strategic/Biopolitical dual-lens feature set without product expansion.
- Kept the isolated hosted-evidence browser gate and evidence-review check as stable-release requirements.
- Updated app, export, tests, documentation, package, and lockfile metadata to `1.4.0-bio-alpha.1`.

## v1.4.0-bio-alpha.1 — Evidence Artifact Review + Release Candidate Freeze

- Added `tests/hosted-demo-evidence-review-check.mjs` to verify hosted-demo evidence artifacts after browser capture.
- Added `npm run test:evidence:hosted` as the manual/local evidence review alias.
- Updated GitHub Actions to review `hosted-demo-evidence/` before uploading the artifact.
- Added `docs/evidence-artifact-review.md` to document required evidence files, metadata, locale snapshots, and stable-release freeze rules.
- Bumped root app identity and lockfile metadata to `1.4.0-bio-alpha.1`.

## v1.4.0-bio-alpha.1 — Hosted Demo Evidence + Public UI Lock

- Added `tests/hosted-demo-evidence.spec.js` for browser-captured public UI evidence.
- Added `npm run test:browser:hosted` as a focused hosted-demo evidence gate.
- Captures desktop/mobile screenshots plus Arabic, English, and French visible-text snapshots.
- Added GitHub Actions artifact upload for `hosted-demo-evidence`.
- Hardened workspace hygiene against both local and CI hosted-demo evidence folders.
- Updated release-lock and export docs to cover public UI evidence capture.
- Bumped root app identity and lockfile metadata to `1.4.0-bio-alpha.1`.

## v1.4.0-bio-alpha.1-alpha.5 — Release Lock + CI Hygiene Hardening

- Added stable CI aliases: `test:ci:no-browser`, `test:ci:browser`, and `test:ci`.
- Updated GitHub Actions to run the same no-browser and browser aliases validated locally.
- Added `tests/ci-script-contract-check.mjs` to prevent workflow/package-script drift.
- Hardened workspace hygiene against preview tracks, Playwright output, patch folders, and root patch/package ZIP artifacts.
- Added release lock documentation in `docs/release-lock.md`.
- Bumped root app identity and lockfile metadata to `1.4.0-bio-alpha.1-alpha.5`.

# Changelog

## v1.4.0-bio-alpha.1-alpha.5 — Review Title Lens Contract Hotfix

- Made the review heading explicitly lens-aware for strategic mode as well as biopolitical mode.
- Preserved the stable `#reviewTitle` browser-test anchor added in alpha.4.1.
- Bumped contract checks to `1.4.0-bio-alpha.1-alpha.5`.

## v1.4.0-bio-alpha.1-alpha.5 — Lens Import Contract + Cross-Locale Export QA

- Added browser import-contract coverage proving `analysis_lens` in imported JSON overrides the previous UI lens state.
- Added browser export coverage across Arabic, English, and French for both Strategic and Biopolitical lenses.
- Added a root source-of-truth guard to reject committed `preview/` or `biopreview/` duplicate app tracks.
- Added optional workspace hygiene checks for patch folders and Playwright output artifacts before commit.
- Preserved the explicit HTML export contract markers introduced in alpha.3.

## v1.4.0-bio-alpha.1-alpha.3.3 — Export Scenario Rationale Contract Hotfix

- Includes scenario rationale text in downloaded HTML reports so export evidence preserves why a scenario is plausible.
- Keeps the biopolitical export contract assertion for the English `proof infrastructure` sample token.
- Adds a static guard so the scenario rationale renderer cannot silently disappear.

## v1.4.0-bio-alpha.1-alpha.3.2 — Export Contract Locale Determinism Hotfix

- Fixed export-contract browser coverage so English sample-token assertions first switch the UI locale to English.
- Preserved the lens contract assertions for Strategic and Biopolitical exports.
- No runtime/export behavior change beyond version identity.

## v1.4.0-bio-alpha.1-alpha.3 — Browser Evidence + Export Contract Hardening

- Added exported HTML contract markers for `app-version` and `analysis-lens`.
- Added `data-analysis-lens` and `data-app-version` attributes to the standalone report shell.
- Added browser export contract coverage that downloads Strategic and Biopolitical HTML reports through the real UI and attaches them as Playwright evidence.
- Added positive/negative export assertions so Strategic reports do not leak Biopolitical report identity and Biopolitical reports do not leak the Strategic report chain.
- Added `docs/export-contract.md` and `npm run test:browser:export`.

## v1.4.0-bio-alpha.1-alpha.2.2 — Runtime Metric Renderer Smoke Fix

- Restored the missing `metricCard` runtime renderer used by the overview quality panel.
- Added a static guard so future scoring UI updates cannot pass without the metric renderer.
- Preserved the alpha.2.1 layout and review-panel stability fixes.


## v1.4.0-bio-alpha.1-alpha.2.1 — Browser Smoke Hotfix

- Hardened the Strategic/Biopolitical lens toggle layout so adjacent select fields cannot intercept browser click targets.
- Added defensive review-tab fallback rendering so sample loading cannot leave the review panel empty after viewport-dependent interaction timing.

## 1.4.0-bio-alpha.1-alpha.2 — Lens-Aware Scoring + Preview Track Decision

- Added biopolitical ontology diagnostics for problematization, population construction, governance techniques, normalization/subjectivation, embodied/social outcomes, and resistance/feedback.
- Made the quality score lens-aware: Strategic keeps the original strategic scoring emphasis, while Biopolitical increases weight on governance coherence and protection/control contradictions.
- Added biopolitical-specific score diagnostics, health warnings, formula text, and evidence pressure checks.
- Added `docs/preview-track-decision.md` to prevent root/preview source-of-truth drift.
- Strengthened QA/static gates to require lens-aware scoring and the preview-track decision document.

## 1.4.0-bio-alpha.1-alpha.1 — Biopolitical Lens Toggle Foundation

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


## v1.4.0-bio-alpha.1 — Expanded Biopolitical Systems Model

Adds an optional expanded biopolitical systems map covering human, society, state, market, corporate/platform, geopolitical, technology, and behavioral-engineering layers. The base Strategic/Biopolitical lens contract remains backward-compatible with v1.3.0-bio imports. See `docs/expanded-biopolitical-systems-model.md`.

## v1.4.0-bio-alpha.4 — Expanded Systems Map Export Polish + Prompt Sample UX

- Added a visible expanded biopolitical prompt-sample card for the eight-axis systems model.
- Added a one-click prompt sample topic covering platform attention, algorithmic addiction, state security, and US-China geopolitics.
- Polished the Systems Map HTML export with a readable narrative, table, and card layout.
- Added export contract tokens for `data-system-export-polish="readable-table"` and `data-system-export-narrative="expanded-biopolitical"`.
- Preserved Strategic mode and the local CI split / hosted evidence version guard.
