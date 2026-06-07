# Visual QA Checklist

Complete this before a public release.

## Desktop

- [ ] Chrome / Edge English light mode
- [ ] Chrome / Edge English dark mode
- [ ] Chrome / Edge Arabic light mode
- [ ] Chrome / Edge Arabic dark mode
- [ ] Chrome / Edge French light/dark
- [ ] Firefox English light/dark
- [ ] Firefox Arabic RTL light/dark
- [ ] Safari if available

## Mobile width

- [ ] English 390 px width
- [ ] Arabic 390 px width
- [ ] French 390 px width
- [ ] Header controls wrap without overlap
- [ ] Welcome card stacks cleanly
- [ ] Engine map does not overflow
- [ ] Score rings remain centered
- [ ] Evidence rows wrap cleanly
- [ ] Review tabs remain usable

## Exported reports

- [ ] HTML report opens standalone
- [ ] English report has no raw enum leakage
- [ ] Arabic report uses correct RTL layout
- [ ] French report labels render correctly
- [ ] Score formula does not overflow
- [ ] Evidence table/rows wrap cleanly
- [ ] HTML report layout is clean and shareable

## Analysis quality display

- [ ] Score rings align visually
- [ ] Scenario probability colors are not misleading as quality/error states
- [ ] Evidence basis labels are polished
- [ ] Confidence/risk chips have semantic coloring
- [ ] Assumption cards are visually distinct

## Release asset checks

- [ ] Header logo uses `assets/jarbou3i-mascot-192.png`
- [ ] Welcome card uses `assets/jarbou3i-mascot-512.png`
- [ ] Favicon uses `assets/favicon-32.png`
- [ ] Apple touch icon exists
- [ ] Manifest icon preview works
- [ ] The 2048 px source image is not loaded by the runtime page
