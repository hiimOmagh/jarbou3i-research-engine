# XR-7.7 — Simple Mode Progressive Disclosure + Mobile Flow Compression

## Purpose

XR-7.7 is the final pre-XR-8 visual simplification pass. XR-7.6.1 restored technical stability and RTL/mobile safety, but the mobile Simple Mode flow was still too long, too repetitive, and too form-heavy.

This phase reduces visible complexity without changing the analysis schema, export contracts, provider behavior, storage, OAuth, or backend assumptions.

## Design decision

Simple Mode should feel like a guided path, not a full workbench with all expert controls visible at once.

Expert Mode keeps the full density. Simple Mode prioritizes:

1. topic input,
2. copy prompt,
3. import AI answer,
4. review,
5. export.

## Changes

### 1. Advanced options become secondary in Simple Mode

Advanced options remain in the DOM for browser-tested controls and power users, but their details are visually collapsed in Simple Mode. Expert Mode keeps them available as a full control surface.

### 2. Repeated guidance is removed from the visible Simple Mode path

The duplicate workflow guidance and interface-mode banner are hidden in Simple Mode. The Guided Wizard becomes the main flow spine instead of another repeated instruction block.

### 3. Welcome card is compressed, not removed

The RTL/mobile browser contract expects `.welcomeCard` to remain visible. XR-7.7 keeps it visible while compressing it into a short mission strip.

### 4. Expanded Prompt Sample is compacted

The expanded prompt sample remains visible and still contains the browser-tested TikTok topic, but the explanatory body and context are compressed in Simple Mode to reduce scroll cost.

### 5. Mobile stepper is compressed

On mobile Simple Mode, the stepper shows the current step rather than five full stacked steps. This reduces repetition while preserving the workflow state.

### 6. Import help is compressed on mobile

The detailed import steps are hidden on small screens. The import station still explains the task, but no longer creates a long pre-input reading wall.

## Acceptance criteria

- Simple Mode mobile first flow is shorter.
- User reaches copy/import workflow faster.
- Advanced options no longer dominate Simple Mode.
- Repeated “start with one topic” guidance is reduced.
- The Guided Wizard is the main Simple Mode navigation spine.
- Expanded Prompt Sample remains browser-visible.
- `.welcomeCard` remains visible for RTL/mobile contracts.
- No export, import, lens, RTL, or systems-map contracts regress.
- Browser and no-browser gates pass.

## XR-8 handoff

XR-8 — Visual Evidence Gate Upgrade should only begin after this phase is visually accepted from desktop and mobile screenshots.

This phase explicitly targets mobile flow compression before XR-8.
