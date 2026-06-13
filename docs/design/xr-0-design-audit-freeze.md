# XR-0 — Design Audit Freeze

**Project:** Jarbou3i Research Engine / Jarbou3i Model  
**Track:** Experience Rebuild (XR)  
**Status:** Design freeze / no runtime changes  
**Version context:** `1.4.0-bio.1.1`  
**Purpose:** Stop incremental UI patching and define a top-tier product-design plan before any new implementation phase starts.

---

## 1. Executive decision

The UI-R track produced useful engineering improvements, but it did not fully satisfy the intended design ambition. UI-R should be treated as a stabilization baseline, not as the final product experience.

### What UI-R achieved

- Safer workflow state handling.
- Stronger visual direction than the original interface.
- Export reliability preserved.
- RTL/mobile overflow protection added.
- Prompt-sample visibility regression identified and fixed.
- Visual evidence discipline improved.

### What UI-R did not achieve

- A genuine “wow” first impression.
- A clean, premium, human-centered product flow.
- A coherent design system across light/dark modes.
- A true separation between Simple Mode and Expert Mode.
- A first screen that feels like an elite AI-assisted analysis studio.
- A review experience that feels like a professional intelligence brief.

### Freeze decision

No more direct UI patching should happen until the XR rebuild architecture is agreed.

The next implementation work must start from a product system, not from isolated CSS fixes.

---

## 2. Product vision

Jarbou3i should feel like:

- A premium AI-assisted analysis studio.
- A structured thinking cockpit.
- A guided research canvas.
- A serious but beautiful intelligence workbench.
- A tool that can be used by normal people without hiding its analytical power from experts.

It must not feel like:

- A JSON validator.
- A long configuration form.
- A patched dashboard.
- A generic admin panel.
- A prompt generator with decoration.
- A developer test harness exposed as a product.

The first five seconds should communicate:

1. This is powerful.
2. I know what to do first.
3. The tool will guide me safely.
4. Advanced analysis exists, but it will not overwhelm me.
5. The result will look professional.

---

## 3. Current visual audit

### 3.1 Primary observed defect

The current layout still exposes too many competing surfaces above the fold:

- App bar.
- Action composer.
- Identity/command center support card.
- Mission/support card.
- Mascot artifact.
- Metrics strip.
- Workflow stepper.
- Workflow guidance banner.
- Interface mode banner.
- Import panel.

The result is not a single intentional composition. It is a stack of competing explanations.

### 3.2 Current failure pattern

| Area | Problem | Impact | Severity |
|---|---|---:|---:|
| First screen | Too many visible concepts at once | Cognitive load increases before user starts | High |
| Hero | Support cards compete with composer | First action loses dominance | High |
| Mascot | Used as layout object, not brand accent | Creates awkward gaps and visual noise | Medium |
| Simple Mode | Still exposes advanced controls and import concepts too early | Does not feel truly simple | High |
| Expert Mode | Not yet a proper expert workspace | Feels like denser simple mode | Medium |
| Import section | Appears too early in the overall journey | User sees JSON/repair concepts before understanding prompt flow | High |
| Mobile | Header and hero consume too much vertical space | User reaches action slower | High |
| Review | Analytical output lacks enough visual structure | Weak “professional brief” effect | High |
| Dark mode | Not designed as a first-class palette system yet | Risk of inconsistent contrast and weak polish | High |

### 3.3 Product diagnosis

The problem is not one broken card. The problem is an information architecture mismatch.

The interface currently tries to show the full workflow, the brand identity, the lens model, the import repair station, and advanced controls too early.

A premium tool should progressively disclose complexity:

- First: ask for topic.
- Then: generate prompt.
- Then: import answer.
- Then: review analysis.
- Then: export report.

---

## 4. Target user model

### 4.1 User groups

| User group | Needs | Risks |
|---|---|---|
| Non-technical user | Clear steps, plain language, minimal decisions | JSON/schema language scares them |
| Student/researcher | Reliable prompt, organized output, exportable report | Too much interface complexity slows them |
| Analyst/power user | Model transparency, evidence, diagnostics, expert controls | Oversimplified UI hides necessary detail |
| Multilingual user | AR/EN/FR clarity, RTL correctness | Layout breaks or translated text feels cramped |
| Older/less technical user | Large controls, predictable flow, strong guidance | Tiny text and dense cards cause abandonment |

### 4.2 Core job-to-be-done

> “Help me transform a topic into a structured, high-quality strategic or biopolitical analysis, using AI safely, then review and export it as a professional report.”

### 4.3 Primary user journey

1. User enters a topic.
2. User chooses the analysis lens.
3. Tool creates a high-quality prompt.
4. User sends prompt to AI assistant.
5. User pastes structured answer back.
6. Tool validates/repairs/imports.
7. User reviews the analysis through a guided dashboard.
8. User exports a polished report.

---

## 5. New information architecture

### 5.1 Required application modes

The app should be organized around five explicit work modes:

1. **Start** — define topic and lens.
2. **Prompt** — create/copy/load prompt.
3. **Import** — paste and validate AI structured answer.
4. **Review** — inspect analysis, evidence, scenarios, maps.
5. **Export** — generate polished HTML report.

Each mode gets:

- One dominant primary action.
- One secondary explanation region.
- Optional expert details.
- Clear readiness status.

### 5.2 Screen-level principle

One screen should answer one question:

| Screen | User question | Primary CTA |
|---|---|---|
| Start | What do I want to analyze? | Continue to prompt |
| Prompt | What should I ask the AI? | Copy prompt |
| Import | What answer do I paste back? | Validate and open analysis |
| Review | What did the analysis say? | Inspect sections |
| Export | How do I share/report this? | Export HTML |

### 5.3 Proposed desktop architecture

```text
┌──────────────────────────────────────────────────────────────┐
│ App Bar: brand · language · simple/expert · theme             │
└──────────────────────────────────────────────────────────────┘

┌───────────────────────────────┬──────────────────────────────┐
│ Main work surface              │ Context / preview rail        │
│                               │                              │
│ Step title                    │ Lens explanation / progress   │
│ Large action area             │ Help / example / diagnostics  │
│ Primary CTA                   │                              │
└───────────────────────────────┴──────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Workflow spine: Topic → Prompt → Import → Review → Export     │
└──────────────────────────────────────────────────────────────┘
```

### 5.4 Proposed mobile architecture

```text
┌──────────────────────────────┐
│ Compact app bar              │
├──────────────────────────────┤
│ Step label + mode switch     │
├──────────────────────────────┤
│ Primary action surface       │
│ Large input / cards / CTA     │
├──────────────────────────────┤
│ Compact progress             │
├──────────────────────────────┤
│ Context help accordion        │
└──────────────────────────────┘
```

Mobile should prioritize the action area over brand decoration.

---

## 6. Keep / Remove / Move decision table

| Element | Decision | Reason |
|---|---|---|
| App bar | Keep, redesign | Needed globally, but must be compact and polished |
| Mascot | Move to small brand accent only | Should not drive layout or create gaps |
| Large hero identity card | Remove from first screen | Competes with primary action |
| Mission card | Merge into composer checklist | Separate card creates clutter |
| Topic input | Keep and elevate | Core action of the product |
| Lens toggle | Replace with lens cards | Current toggle is functional but not meaningful enough |
| Language selector | Keep | Required product function |
| Simple/Expert toggle | Keep, strengthen behavior | Should meaningfully alter experience density |
| Advanced options | Move into drawer | Must remain visible/test-safe but visually secondary |
| Prompt sample | Keep visible where contract requires | Browser contract and useful onboarding |
| Workflow stepper | Keep as navigation spine | Good mental model when visually refined |
| Workflow guidance banner | Merge into step header | Current extra banner creates vertical noise |
| Interface mode banner | Remove or fold into mode switch tooltip | Repeats concept already visible in top bar |
| Import panel | Move to Import step | Too early on first screen |
| Engine map | Expert mode / Review step | Too advanced for first screen |
| Review panel | Keep, redesign later | Output experience needs its own phase |
| Export controls | Keep in Export step | Should not dominate earlier phases |

---

## 7. Visual direction

### 7.1 Chosen direction

**Clean Intelligence Studio with subtle Futuristic Cockpit cues.**

This combines:

- Clean editorial readability.
- High-trust institutional polish.
- Subtle AI/analysis visual energy.
- Minimal but premium glass/depth effects.
- Structured intelligence motifs: chains, nodes, layers, systems rings.

### 7.2 Avoided directions

| Direction | Why not |
|---|---|
| Heavy sci-fi cockpit | Too noisy, may reduce trust |
| Generic SaaS dashboard | Not distinctive enough |
| Academic paper interface | Too dry, not attractive enough |
| Mascot-led product | Too playful for serious analysis |
| Maximal glassmorphism | Readability and accessibility risks |

### 7.3 Visual motifs

Use:

- Thin connector lines.
- Layered cards with meaningful hierarchy.
- Soft aurora backgrounds.
- Lens-specific accents.
- Small map/ring illustrations where they clarify the model.
- Strong whitespace, but not empty wasted space.

Avoid:

- Floating random images.
- Decorative cards with no action.
- Text below readable size.
- Large gradients behind small controls.
- Multiple competing CTAs.

---

## 8. Theme and token system

### 8.1 Light mode — Analyst Aurora

```css
--color-bg: #F6F8FC;
--color-bg-wash: #EAF2FF;
--color-surface: #FFFFFF;
--color-surface-elevated: #F8FBFF;
--color-surface-glass: rgba(255, 255, 255, 0.78);

--color-text: #0B1220;
--color-text-secondary: #42526B;
--color-text-muted: #6B7890;

--color-border: #D7E0EE;
--color-border-strong: #AFC2DA;

--color-primary: #2563EB;
--color-primary-strong: #1D4ED8;
--color-accent-cyan: #06B6D4;
--color-accent-violet: #7C3AED;
--color-accent-indigo: #4F46E5;

--color-success: #059669;
--color-warning: #D97706;
--color-danger: #DC2626;
--color-info: #0284C7;

--focus-ring: #38BDF8;
```

### 8.2 Dark mode — Midnight Intelligence

```css
--color-bg: #050816;
--color-bg-wash: #0B1226;
--color-surface: #101827;
--color-surface-elevated: #151F33;
--color-surface-glass: rgba(15, 23, 42, 0.82);

--color-text: #F8FAFC;
--color-text-secondary: #CBD5E1;
--color-text-muted: #94A3B8;

--color-border: #263449;
--color-border-strong: #3B4A63;

--color-primary: #60A5FA;
--color-primary-strong: #3B82F6;
--color-accent-cyan: #22D3EE;
--color-accent-violet: #A78BFA;
--color-accent-indigo: #818CF8;

--color-success: #34D399;
--color-warning: #FBBF24;
--color-danger: #FB7185;
--color-info: #38BDF8;

--focus-ring: #67E8F9;
```

### 8.3 Lens accents

| Lens | Primary | Secondary | Motif |
|---|---|---|---|
| Strategic | `#2563EB` | `#4F46E5` | actor network, power path, tool chain |
| Biopolitical | `#7C3AED` | `#06B6D4` | population layers, systems ring, governance flow |

### 8.4 Token principle

Implementation must not introduce random one-off colors.

Every color should map to:

- Background.
- Surface.
- Text.
- Border.
- Accent.
- State.
- Lens.
- Focus.

---

## 9. Typography and spacing

### 9.1 Typography scale

| Role | Desktop | Mobile |
|---|---:|---:|
| Display title | 44–56px | 30–36px |
| Page title | 30–38px | 24–30px |
| Section title | 22–26px | 20–24px |
| Card title | 17–20px | 17–19px |
| Body | 15.5–17px | 15.5–16.5px |
| Helper | 14–15px | 14–15px |
| Metadata | 12.5–13.5px | 12.5–13.5px |

No instructional text should be smaller than 14px.

### 9.2 Font stack

```css
font-family:
  Inter,
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

Arabic fallback:

```css
font-family:
  Inter,
  "Noto Sans Arabic",
  "Segoe UI",
  Tahoma,
  Arial,
  sans-serif;
```

### 9.3 Spacing scale

Use a fixed spacing scale:

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

Avoid arbitrary margins unless there is a documented layout exception.

---

## 10. Accessibility requirements

### 10.1 Contrast

Minimum:

- Body text: WCAG AA 4.5:1.
- Large text: WCAG AA 3:1.
- Buttons and active states: 4.5:1 where possible.
- Focus indicators must be clearly visible in light and dark modes.

### 10.2 Touch targets

- Minimum: 44px × 44px.
- Preferred CTA height: 52–56px.
- Segmented controls: at least 42px high.

### 10.3 Keyboard flow

Required sequence:

1. Language.
2. Mode.
3. Theme.
4. Topic input.
5. Lens choice.
6. Primary CTA.
7. Secondary actions.
8. Advanced drawer.
9. Step navigation.

### 10.4 RTL and localization

Arabic RTL must be treated as a first-class layout, not a post-process.

Required checks:

- No horizontal overflow.
- No clipped text.
- Lens cards mirror correctly.
- Stepper direction makes sense.
- Long French text does not break cards.
- Controls keep readable widths.

### 10.5 Motion

- Use short transitions: 150–220ms.
- Avoid large animated layout shifts.
- Respect `prefers-reduced-motion`.

---

## 11. Simple Mode and Expert Mode

### 11.1 Simple Mode target

Simple Mode should behave like a guided wizard:

- One main task per step.
- Human labels.
- No schema jargon on first contact.
- Import explained as “AI structured answer.”
- Advanced options hidden in a drawer, not removed.
- Only one primary CTA visible at a time.

### 11.2 Expert Mode target

Expert Mode should behave like an analyst cockpit:

- Multi-panel workspace.
- Model map visible.
- Schema diagnostics visible.
- Prompt mode and context controls prominent.
- Evidence/counter-evidence visible.
- Faster navigation.
- Export metadata visible.

### 11.3 Mode-switch rule

Switching modes should not break the user’s place.

Same data, different density:

- Simple = guided and linear.
- Expert = expanded and inspectable.

---

## 12. Review experience target

The review area should become the strongest “analysis value” moment.

### Required review modules

- Executive brief.
- Lens-specific map.
- Causal chain visualization.
- Evidence / counter-evidence split.
- Uncertainty and falsifiers.
- Contradiction groups.
- Scenario cards.
- Completeness diagnostics.
- Export readiness.

### Review visual direction

Strategic review should emphasize:

- Actors.
- Interests.
- Tools.
- Narrative.
- Results.
- Feedback loops.

Biopolitical review should emphasize:

- Problematization.
- Populations/subjects.
- Governance techniques.
- Norms/subjectivation.
- Embodied/social outcomes.
- Resistance/feedback.
- Expanded systems axes.

---

## 13. Evidence gate upgrade

Current gates are strong technically, but they do not prevent bad-looking UI.

XR must add a visual review discipline.

### 13.1 Required screenshot matrix

| State | Desktop light | Desktop dark | Mobile light | Mobile dark | AR RTL | EN | FR |
|---|---:|---:|---:|---:|---:|---:|---:|
| Empty start | required | required | required | required | required | required | required |
| Prompt ready | required | required | required | required | required | required | required |
| Import empty | required | required | required | required | required | required | required |
| Import invalid | required | required | required | required | required | required | required |
| Review loaded | required | required | required | required | required | required | required |
| Export ready | required | required | required | required | required | required | required |

### 13.2 Manual visual signoff checklist

A phase cannot be accepted only because tests pass.

It must also pass:

- First action visible quickly.
- No vertical text columns.
- No floating decorative object in empty space.
- No huge empty canyon.
- No clipped controls.
- No unreadably small guidance.
- No contrast weakness.
- No decorative element competing with primary action.
- Mobile first screen has a useful action visible.
- Dark mode does not look like an afterthought.

---

## 14. XR roadmap

### XR-1 — Design Tokens + Theme System

Goal: establish the visual foundation.

Scope:

- CSS token layer.
- Light/dark palettes.
- Semantic colors.
- Typography scale.
- Spacing scale.
- Radius/shadow system.
- Focus rings.
- Reduced-motion rules.
- Static token checks.

Acceptance:

- No random colors.
- Dark mode is first-class.
- Focus states are visible.
- Existing app behavior unchanged.

### XR-2 — First-Screen Product Recomposition

Goal: create the true premium first impression.

Scope:

- Composer-first landing.
- Lens decision cards.
- One primary CTA.
- Compact app bar.
- Remove support-card clutter.
- Remove mascot as layout object.

Acceptance:

- Topic input visible immediately.
- First screen looks like a premium product.
- Mobile shows meaningful action in the first viewport.

### XR-3 — Guided Wizard Mode

Goal: make Simple Mode genuinely simple.

Scope:

- One-step-at-a-time flow.
- Next/back navigation.
- Plain-language readiness states.
- Import guidance without schema anxiety.

Acceptance:

- Non-technical user can complete flow without understanding JSON internals.

### XR-4 — Expert Analyst Dashboard

Goal: make Expert Mode powerful and controlled.

Scope:

- Split-pane workspace.
- Model map.
- Diagnostics.
- Evidence controls.
- Prompt details.
- Faster navigation.

Acceptance:

- Expert mode feels dense but organized.

### XR-5 — Review Experience Wow Layer

Goal: make imported analysis feel like a professional intelligence brief.

Scope:

- Causal chain visualization.
- Systems ring/map.
- Evidence/counter-evidence panels.
- Scenario cards.
- Contradiction groups.
- Falsifier blocks.

Acceptance:

- Review screenshot has clear analytical value before reading every line.

### XR-6 — Export Report Redesign

Goal: make exported HTML match the product quality.

Scope:

- Cover page.
- Executive summary.
- Lens-specific structure.
- Print styles.
- Metadata appendix.

Acceptance:

- Export looks like a polished report, not dumped HTML.

### XR-7 — Accessibility + Localization Hardening

Goal: make the product robust for real users.

Scope:

- Contrast checks.
- Keyboard flow.
- Screen-reader structure.
- Arabic RTL layout audit.
- French text expansion.
- Mobile touch target audit.

Acceptance:

- AR/EN/FR are all usable and visually stable.

### XR-8 — Visual Evidence Gate Upgrade

Goal: prevent future “green but ugly” regressions.

Scope:

- Screenshot matrix.
- Manual visual signoff doc.
- Theme/mode/state evidence.
- Visual blocker checklist.

Acceptance:

- Visual acceptance is documented before closure.

---

## 15. Non-goals

During XR rebuild, do not change:

- Core schema.
- Export metadata contract.
- Provider/backend/OAuth/storage behavior.
- Analysis scoring logic.
- Existing browser-critical IDs unless tests are migrated deliberately.

Do not introduce:

- Random decorative cards.
- Mascot-led layout.
- Untracked colors.
- New hidden browser-contract elements.
- More above-the-fold explanations without removing old ones.

---

## 16. Design acceptance criteria

A phase is acceptable only if all are true:

1. Browser/no-browser gates pass.
2. Screenshot evidence is visually reviewed.
3. Light and dark mode remain readable.
4. Arabic RTL does not overflow.
5. Mobile has meaningful action above the fold.
6. Simple Mode is actually simpler.
7. Expert Mode is powerful without feeling chaotic.
8. Primary CTA is obvious.
9. No decorative element competes with the primary task.
10. The phase improves the product, not only the CSS.

---

## 17. Stop conditions

Stop and redesign before coding further if:

- A card becomes too narrow for normal sentence text.
- A support panel creates vertical word wrapping.
- A mascot or decorative object creates layout gaps.
- The topic/action composer is not visible early enough.
- The user sees JSON/import concepts before understanding the prompt step.
- Dark mode cannot reach contrast targets.
- AR/FR text expansion breaks layout.
- Browser tests pass but screenshots look worse.

---

## 18. XR-1 readiness

XR-0 is complete when the team agrees on:

- Clean Intelligence Studio + subtle Futuristic Cockpit as the direction.
- Token-first implementation.
- Simple Mode as guided wizard.
- Expert Mode as analyst dashboard.
- Light and dark mode as equal priorities.
- Visual evidence as a required gate.

Recommended next milestone:

```text
XR-1 — Design Tokens + Theme System
```

Implementation should start only after this document is accepted.
