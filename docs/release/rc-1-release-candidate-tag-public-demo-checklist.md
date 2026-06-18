# RC-1 — Release Candidate Tag + Public Demo Checklist

## Release candidate decision

**Status:** release-candidate ready after XR UI overhaul closure.

**Candidate version:** `v1.4.0-bio.1.1`

**Final prepared commit before RC-1:** `a9598f3`

**Release track:** XR visual overhaul → evidence gate → release candidate handoff.

RC-1 is not a runtime feature milestone. It packages the already validated XR track into a tag-ready, demo-ready operational checklist. No UI, provider, schema, OAuth, backend, storage, or export contract changes are included in this milestone.

## Locked prerequisite milestones

| Milestone | Decision |
|---|---|
| XR-7.7 — Simple Mode Progressive Disclosure + Mobile Flow Compression | Locked |
| XR-8 — Visual Evidence Gate Upgrade | Locked after XR-8.1 readiness hotfix |
| XR-8.2 — Arabic Mobile Header Control Compression Hotfix | Locked |
| XR-9 — Visual Release Closure + Product Demo Audit | Visual release closure approved |
| XR-10 — Release Candidate Packaging + Demo Handoff | Demo handoff prepared |

## Required release candidate evidence

Before creating the release candidate tag, regenerate and retain the following files outside the committed repo tree:

```text
hosted-demo-evidence-v1.4.0-bio.1.1.zip
stable-release-lock-report-v1.4.0-bio.1.1.md
stable-release-lock-report-v1.4.0-bio.1.1.json
```

The hosted evidence archive must contain the XR-8 visual evidence matrix:

```text
desktop-first-screen.png
desktop-first-screen-dark.png
mobile-first-screen.png
mobile-first-screen-dark.png
simple-mode.png
expert-mode.png
strategic-mode.png
biopolitical-mode.png
import-state.png
review-state.png
export-state.png
visible-text-ar.json
visible-text-en.json
visible-text-fr.json
visual-evidence-matrix.json
hosted-demo-metadata.json
```

The stable release lock report must show:

```text
Status: ready
No-browser contract: pass
Browser core contract: pass
Hosted evidence review: pass
Hosted archive identity: pass
Hosted archive structure: pass
Visual evidence matrix: pass
Version lock: pass
Remote artifact configuration: pass
```

`visual-evidence-matrix.json` may continue to mark `reviewer_decision` as `pending-manual-visual-audit` if the manual decision is documented in XR-9. That is intentional: the machine gate proves evidence completeness; XR-9 records human visual acceptance.

## Final validation commands

Run this from the repository root before tagging:

```powershell
git status --short
git diff --check
npm install
npx playwright install chromium
npm run test:ci:browser
```

Then clean generated artifacts and run the no-browser gate:

```powershell
Remove-Item -Recurse -Force .\node_modules, .\playwright-report, .\test-results, .\hosted-demo-evidence-local, .\hosted-demo-evidence -ErrorAction SilentlyContinue
Remove-Item -Force .\hosted-demo-evidence*.zip -ErrorAction SilentlyContinue
Remove-Item -Force .\stable-release-lock-report-v*.json, .\stable-release-lock-report-v*.md -ErrorAction SilentlyContinue

npm run test:ci:no-browser
git status --short
```

Expected final status:

```text
# no output
```

## Release candidate tag procedure

After all gates pass and the workspace is clean:

```powershell
git rev-parse --short HEAD
git tag -a v1.4.0-bio.1.1-rc.1 -m "v1.4.0-bio.1.1-rc.1 — XR visual overhaul release candidate"
git push origin v1.4.0-bio.1.1-rc.1
```

Verification:

```powershell
git tag --list "v1.4.0-bio.1.1-rc.1"
git ls-remote --tags origin "v1.4.0-bio.1.1-rc.1"
```

Do not create the tag while generated evidence archives, Playwright reports, `node_modules`, or lock reports remain in the working tree.

## Public demo checklist

### Demo opening

Position the product as:

> A lens-aware research workbench for generating structured strategic or biopolitical analysis prompts, importing AI-produced JSON, reviewing evidence quality, and exporting a polished HTML report.

### Demo path

1. Open the hosted demo.
2. Show the redesigned first screen in Simple Mode.
3. Confirm language selector and Strategic/Biopolitical lens selector.
4. Load the built-in expanded systems sample.
5. Copy or preview the generated prompt.
6. Paste/import a structured AI answer or use the available fixture path.
7. Open the review workspace.
8. Show evidence, causal links, systems map, contradictions, and scenario/falsifier coverage.
9. Export the HTML report.
10. Explain the evidence archive and visual evidence matrix as the release proof.

### Demo proof artifacts

Use these as the credibility layer during handoff:

```text
hosted-demo-evidence-v1.4.0-bio.1.1.zip
stable-release-lock-report-v1.4.0-bio.1.1.md
XR-9 visual release closure audit
XR-10 release candidate demo handoff
```

## Known non-blocking limitations

These items do not block the release candidate:

1. The current product identity is strong enough for demo, but not a final long-term brand system.
2. Header density on mobile is acceptable after XR-8.2, but may be refined later.
3. The product remains a local/static research workflow; there is no backend persistence, OAuth, account system, or provider execution layer in this release candidate.
4. AI output quality still depends on the external assistant/model used by the operator.
5. The visual evidence matrix validates screenshot completeness; qualitative approval remains documented by XR-9.

## Rollback notes

If the release candidate tag is created incorrectly:

```powershell
git tag -d v1.4.0-bio.1.1-rc.1
git push origin --delete v1.4.0-bio.1.1-rc.1
```

If a post-tag blocker appears, do not rewrite history silently. Prefer a new hotfix commit and a new tag:

```text
v1.4.0-bio.1.1-rc.2
```

## Next milestone

After RC-1 tag verification:

```text
RC-2 — Release Notes + Public Launch Freeze
```

RC-2 should finalize external-facing release notes and launch wording. It should not introduce UI redesign or runtime behavior changes unless a concrete release-candidate blocker is found.
