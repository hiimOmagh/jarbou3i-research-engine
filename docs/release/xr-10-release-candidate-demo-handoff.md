# XR-10 — Release Candidate Packaging + Demo Handoff

## Status

XR-10 converts the locked XR visual rebuild into a release-candidate handoff package. It does not change runtime UI, provider behavior, schema behavior, OAuth, storage, or export semantics.

Release-candidate decision: **demo-ready candidate**.

## Base evidence

XR-10 is based on the following locked chain:

- XR-8 — Visual Evidence Gate Upgrade
- XR-8.1 — Stable Readiness Visual Evidence Matrix Hotfix
- XR-8.2 — Arabic Mobile Header Control Compression Hotfix
- XR-9 — Visual Release Closure + Product Demo Audit

The release lock report state for the handoff is expected to remain:

- Browser core contract: pass
- Hosted evidence review: pass
- Hosted archive identity: pass
- Hosted archive structure: pass
- Visual evidence matrix: pass
- Manual visual audit: completed by XR-9 closure document
- Workspace hygiene: required after every browser run

## Release candidate package scope

This release candidate packages the public-facing UI overhaul as a product demo, not as a new feature expansion.

Included in the demo scope:

1. Clean intelligence-studio visual identity.
2. Light and dark first-screen evidence.
3. Mobile and desktop visual evidence.
4. Simple Mode progressive disclosure.
5. Expert Mode analyst dashboard availability.
6. Strategic and biopolitical lens switching.
7. Import, review, and export state evidence.
8. HTML export report polish.
9. Arabic RTL/mobile header correction.
10. Stable evidence archive and readiness checks.

Excluded from this release candidate:

1. Backend provider execution.
2. OAuth or account management.
3. Persistent storage or database adapters.
4. New schema fields.
5. New AI model integrations.
6. Monetization or public account flows.

## Demo narrative

Use this narrative when presenting the upgraded product:

> Jarbou3i Research Engine is now a lens-aware analysis workbench. A user starts in Simple Mode with one topic, generates a structured prompt, asks an AI assistant for the answer, imports the structured result, reviews the quality and evidence pressure, and exports a polished HTML intelligence report. Expert Mode remains available for analysts who need deeper controls, while the strategic and biopolitical lenses keep the workflow domain-specific.

## Demo path

Recommended live demo path:

1. Open the landing page in light mode.
2. Show the app identity, language switcher, Simple/Expert switch, and lens selector.
3. Keep Simple Mode active.
4. Use the expanded prompt sample for the TikTok/youth attention topic.
5. Copy or preview the generated prompt.
6. Paste a valid structured answer from a fixture or prior assistant output.
7. Open the review dashboard.
8. Highlight evidence pressure, causal map, systems map, contradictions, and scenario falsifiers.
9. Export the HTML report.
10. Switch to dark mode to show visual parity.
11. Switch to Arabic to show RTL/mobile readiness if presenting localization.

## Acceptance checklist

Before calling the candidate ready for a tag or public demo, verify:

- `npm run test:ci:no-browser` passes.
- `npm run test:ci:browser` passes.
- `hosted-demo-evidence-v1.4.0-bio.1.1.zip` contains the full 16-file XR-8 evidence matrix.
- `stable-release-lock-report-v1.4.0-bio.1.1.md` reports `Status: ready`.
- `visual-evidence-matrix.json` remains present in the archive.
- `mobile-first-screen.png` and `mobile-first-screen-dark.png` show no clipped Arabic mobile header controls.
- Workspace cleanup is performed after browser evidence generation.
- `git status --short` returns no output before tag creation.

## Known non-blocking polish backlog

These items are not release blockers for the current demo-ready candidate:

1. Further reduce mobile header vertical footprint in a future visual polish cycle.
2. Make the identity motif more distinctive once the release candidate is stable.
3. Add a guided sample-result walkthrough for non-technical first-time users.
4. Improve copy density in long review/export states.
5. Add a concise public landing explanation separate from the workbench surface.

## Tag readiness recommendation

XR-10 may proceed to a release-candidate tag only after a final clean workspace confirmation and a fresh stable lock report.

Recommended next operational step:

```powershell
npm install
npx playwright install chromium
npm run test:ci:browser
Remove-Item -Recurse -Force .\node_modules, .\playwright-report, .\test-results, .\hosted-demo-evidence-local, .\hosted-demo-evidence -ErrorAction SilentlyContinue
Remove-Item -Force .\hosted-demo-evidence*.zip -ErrorAction SilentlyContinue
Remove-Item -Force .\stable-release-lock-report-v*.json, .\stable-release-lock-report-v*.md -ErrorAction SilentlyContinue
npm run test:ci:no-browser
git status --short
```

If all commands pass and the workspace is clean, the project is ready for release-candidate tagging.

## Next milestone

Recommended next milestone: **RC-1 — Release Candidate Tag + Public Demo Checklist**.

RC-1 should not redesign the UI. It should create the final tag checklist, release notes, demo script, archive verification instructions, and rollback notes.
