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
- fixture integrity
- static accessibility basics

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
- prompt preview modal
- sample analysis import
- review navigation
- HTML-only export workflow
- runtime accessibility smoke
- Arabic mobile overflow smoke

## Manual release gate

- Inspect Arabic, English, and French UI.
- Inspect light and dark modes.
- Test mobile width near 390 px.
- Export one HTML report and open it standalone.
- Confirm the 2048 px source mascot is not loaded by the runtime page.
