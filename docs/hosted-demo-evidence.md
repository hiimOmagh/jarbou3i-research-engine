# Hosted Demo Evidence — v1.3.0-bio-alpha.6

This release adds a browser evidence contract for the public/root UI. The evidence gate runs against the same static app served by Playwright and can be used locally or in GitHub Actions.

## Command

```bash
npm run test:browser:hosted
```

By default, evidence is written to:

```text
hosted-demo-evidence-local/
```

GitHub Actions sets:

```text
HOSTED_DEMO_EVIDENCE_DIR=hosted-demo-evidence
```

and uploads the folder as the `hosted-demo-evidence` artifact.

## Required evidence files

The evidence capture writes:

```text
desktop-first-screen.png
mobile-first-screen.png
strategic-mode.png
biopolitical-mode.png
visible-text-ar.json
visible-text-en.json
visible-text-fr.json
hosted-demo-metadata.json
```

## Contract

The public UI evidence proves:

- the root page loads from the deployable source of truth;
- the app version metadata matches `1.3.0-bio-alpha.6`;
- the Strategic and Biopolitical lens controls are visible;
- Strategic mode is visible on the first public screen;
- Biopolitical mode can be activated from the public UI;
- Arabic visible text is captured with `dir="rtl"`;
- English and French visible text are captured with `dir="ltr"`;
- desktop and mobile screenshots are attached as Playwright evidence.

## Hygiene rule

Evidence folders are generated artifacts. Before commit, remove:

```text
hosted-demo-evidence/
hosted-demo-evidence-local/
playwright-report/
test-results/
```

Then run:

```bash
npm run test:hygiene
```
