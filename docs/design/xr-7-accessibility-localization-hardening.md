# XR-7 — Accessibility + Localization Hardening

## Decision

XR-7 hardens the rebuilt interface for keyboard users, mobile users, Arabic RTL, French text expansion, reduced-motion preferences, and visible focus states. This phase is a stability and inclusivity layer, not a visual redesign.

## Scope

- Add a keyboard-accessible skip link to the main work surface.
- Add stable ARIA live regions for toast, topic status, and JSON status feedback.
- Strengthen `aria-describedby` relationships for topic, context, import, language, prompt mode, and assistant controls.
- Add explicit runtime locale markers for Arabic RTL, English LTR, and French LTR.
- Harden touch targets to at least 44px, with larger mobile targets.
- Add visible focus rings for buttons, tabs, links, form controls, lens buttons, mode buttons, and review navigation.
- Add reduced-motion handling and forced-colors fallback.
- Improve Arabic line height and French text expansion resilience.
- Preserve Simple Mode and Expert Mode behavior.

## Non-goals

- No schema changes.
- No provider/backend/OAuth/storage changes.
- No export metadata changes.
- No new generic `data-lens` selectors.
- No duplicate export IDs.
- No redesign of the XR-5 review layer or XR-6 export report.

## Runtime markers

XR-7 introduces the following markers for static and browser-evidence review:

- `data-xr7-accessibility="localization-hardening"`
- `data-xr7-a11y-shell="keyboard-localized"`
- `data-xr7-locale-mode`
- `data-xr7-target="touch-keyboard-safe"`
- `data-xr7-keyboard="visible-focus"`
- `data-xr7-skip-link="workspace"`
- `data-xr7-review="localized-brief"`
- `data-xr7-wizard="one-action-readable"`
- `data-xr7-expert="a11y-localized"`

## Accessibility contracts

- Focus states must be visible in light and dark mode.
- Touch targets must be minimum 44px and 48px on narrow screens.
- Status feedback must be announced politely through live regions.
- Arabic must remain RTL with readable line height.
- French controls must tolerate longer strings without horizontal overflow.
- Reduced-motion users must not receive unnecessary animation.
- Forced-colors users must retain a visible focus outline.

## Validation expectations

Required before commit:

```powershell
git diff --check
npm install
npx playwright install chromium
npm run test:ci:browser
```

Then cleanup and no-browser:

```powershell
Remove-Item -Recurse -Force .\node_modules, .\playwright-report, .\test-results, .\hosted-demo-evidence-local, .\hosted-demo-evidence -ErrorAction SilentlyContinue
Remove-Item -Force .\hosted-demo-evidence*.zip -ErrorAction SilentlyContinue
Remove-Item -Force .\stable-release-lock-report-v*.json, .\stable-release-lock-report-v*.md -ErrorAction SilentlyContinue
npm run test:ci:no-browser
```

## Acceptance

XR-7 is accepted only if:

- Browser core remains 50/50.
- Hosted evidence remains 2/2.
- Stable release readiness passes.
- No-browser passes after cleanup.
- Workspace hygiene passes.
- EN/AR/FR remain stable.
- RTL/mobile remains stable.
- Export contracts remain stable.

## Next phase

XR-8 — Visual Evidence Gate Upgrade.

XR-8 should expand visual evidence coverage across light/dark, Simple/Expert, empty/valid/review/export states, and viewport-specific screenshots so future green gates cannot mask weak visual quality.
