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
