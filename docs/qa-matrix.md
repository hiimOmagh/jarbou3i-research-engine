# QA Matrix

## Fast no-browser gate

Run before every commit:

```bash
node tests/qa-check.mjs
```

This verifies:

- JavaScript syntax for `src/app.js`
- modular file layout
- duplicate DOM IDs
- runtime asset size limits
- absence of removed legacy export/self-check paths
- package/app version consistency
- manifest icon coverage
- schema governance requirements
- `analysis_lens` schema support
- fixture integrity for both strategic and biopolitical examples
- static accessibility basics
- biopolitical prompt ontology guard tokens
- lens-aware biopolitical scoring diagnostics
- preview/root source-of-truth decision document

## Individual no-browser gates

```bash
npm run test:static
npm run test:schema
npm run test:fixtures
npm run test:a11y:static
```

## Browser gate

Run before release:

```bash
npm install
npx playwright install --with-deps
npm run test:browser
```

Coverage:

- core user flow
- language switching and RTL/LTR behavior
- theme toggle
- Strategic/Biopolitical lens toggle
- prompt preview modal
- biopolitical sample analysis import
- review navigation
- HTML-only export workflow
- runtime accessibility smoke
- Arabic mobile overflow smoke

## Manual release gate

- Inspect Arabic, English, and French UI.
- Switch between Strategic and Biopolitical modes.
- Confirm the title, placeholder, engine map, layer labels, sample, score formula, diagnostic warnings, and export copy change with the lens.
- Confirm old strategic JSON imports still work.
- Confirm biopolitical JSON imports with `analysis_lens: "biopolitical"` switch the UI lens.
- Inspect light and dark modes.
- Test mobile width near 390 px.
- Export one HTML report from each lens and open it standalone.
- Confirm `preview/` or `biopreview/` is not treated as the deployable source of truth after promotion.
- Confirm the 2048 px source mascot is not loaded by the runtime page.


## v1.3.0-bio-alpha.4.2 export contract coverage

| Gate | Command | Purpose |
|---|---|---|
| Browser export contract | `npm run test:browser:export` | Downloads Strategic and Biopolitical reports, checks lens metadata and layer-token separation, and attaches exported HTML evidence. |
| Full browser gate | `npm run test:browser` | Includes smoke, runtime accessibility, RTL mobile, and export-contract browser coverage. |


## v1.3.0-bio-alpha.4.2 export rationale coverage

- Static QA requires the HTML export renderer to include scenario rationale text.
- Browser export contract continues to assert the English biopolitical sample token `proof infrastructure`, which appears in the scenario rationale.

## v1.3.0-bio-alpha.4.2 lens import and cross-locale export QA

New gates:

- `npm run test:source` — rejects duplicate committed app tracks such as `preview/` or `biopreview/` in the release root.
- `npm run test:hygiene` — optional pre-commit workspace cleanup guard for patch folders and Playwright output artifacts.
- `npm run test:browser:import` — proves imported JSON `analysis_lens` overrides the previous UI toggle state.
- `npm run test:browser:locale` — downloads Strategic and Biopolitical HTML reports across Arabic, English, and French and checks machine-readable lens metadata.

Acceptance:

- Strategic JSON imported while the Biopolitical toggle is active must render/export Strategic labels.
- Biopolitical JSON imported while the Strategic toggle is active must render/export Biopolitical labels.
- Arabic export must keep `lang="ar" dir="rtl"`.
- English and French exports must keep `dir="ltr"`.
- No duplicate preview source track may remain in the release root.

## v1.3.0-bio-alpha.4.2 review title lens contract

The visible review heading now reflects the active/imported lens: Strategic imports render a Strategic review title, and Biopolitical imports render a Biopolitical review title. The stable `#reviewTitle` anchor remains available for browser contracts.

