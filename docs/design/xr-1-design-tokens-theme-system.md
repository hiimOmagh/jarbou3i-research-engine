# XR-1 — Design Tokens + Theme System

## Status

Accepted for implementation as a foundation phase after XR-0.

XR-1 does not redesign the page architecture. It creates the semantic visual foundation required before XR-2, XR-3, and later screen recomposition work.

## Purpose

The previous UI-R track produced useful browser-safe UI improvements, but visual decisions were still too patch-based. XR-1 establishes a token-first system so future design changes are made through stable, named design decisions instead of one-off colors, shadows, spacing, and focus rules.

## Design direction

Primary direction:

- Clean Intelligence Studio
- subtle Futuristic Cockpit
- premium, calm, precise, readable
- no decorative element unless it helps comprehension

## Theme model

XR-1 defines two first-class themes.

### Light theme: Analyst Aurora

Core intent: bright, readable, premium, approachable.

| Token | Value | Usage |
|---|---:|---|
| `--color-bg-base` | `#F6F8FC` | page background |
| `--color-bg-wash` | `#EAF2FF` | soft background wash |
| `--color-surface-primary` | `#FFFFFF` | primary cards/controls |
| `--color-surface-elevated` | `#F8FBFF` | raised surfaces |
| `--color-surface-muted` | `#EEF4FC` | inactive/helper surfaces |
| `--color-surface-glass` | `rgba(255,255,255,.82)` | translucent shell surfaces |
| `--color-border-subtle` | `#D7E0EE` | normal borders |
| `--color-border-strong` | `#AFC2DA` | emphasized borders |
| `--color-text-primary` | `#0B1220` | primary text |
| `--color-text-secondary` | `#42526B` | secondary text |
| `--color-text-muted` | `#6B7890` | metadata/helper text |
| `--color-primary` | `#2563EB` | primary actions |
| `--color-accent-cyan` | `#06B6D4` | secondary accent |
| `--color-accent-violet` | `#7C3AED` | biopolitical/premium accent |
| `--color-accent-indigo` | `#4F46E5` | bridge accent |
| `--focus-ring-color` | `#38BDF8` | accessible focus ring |

### Dark theme: Midnight Intelligence

Core intent: serious analyst cockpit with readable contrast.

| Token | Value | Usage |
|---|---:|---|
| `--color-bg-base` | `#050816` | page background |
| `--color-bg-wash` | `#0B1226` | soft background wash |
| `--color-surface-primary` | `#101827` | primary cards/controls |
| `--color-surface-elevated` | `#151F33` | raised surfaces |
| `--color-surface-muted` | `#1D2940` | inactive/helper surfaces |
| `--color-surface-glass` | `rgba(15,23,42,.84)` | translucent shell surfaces |
| `--color-border-subtle` | `#263449` | normal borders |
| `--color-border-strong` | `#3B4A63` | emphasized borders |
| `--color-text-primary` | `#F8FAFC` | primary text |
| `--color-text-secondary` | `#CBD5E1` | secondary text |
| `--color-text-muted` | `#94A3B8` | metadata/helper text |
| `--color-primary` | `#60A5FA` | primary actions |
| `--color-accent-cyan` | `#22D3EE` | secondary accent |
| `--color-accent-violet` | `#A78BFA` | biopolitical/premium accent |
| `--color-accent-indigo` | `#818CF8` | bridge accent |
| `--focus-ring-color` | `#67E8F9` | accessible focus ring |

## Lens accents

Strategic and biopolitical analysis need distinct visual identities while remaining part of the same system.

| Lens | Primary | Secondary | Intended meaning |
|---|---:|---:|---|
| Strategic | `--lens-strategic-primary` | `--lens-strategic-secondary` | actors, interests, decisions, leverage |
| Biopolitical | `--lens-biopolitical-primary` | `--lens-biopolitical-secondary` | bodies, populations, norms, risk, governance |

## Typography tokens

| Token | Usage |
|---|---|
| `--font-sans` | UI text, Arabic/EN/FR-safe stack |
| `--font-mono` | JSON and structured data |
| `--type-display` | future landing display title |
| `--type-page-title` | major page/workspace title |
| `--type-section-title` | section headings |
| `--type-card-title` | card headings |
| `--type-body` | default body text |
| `--type-helper` | helper text |
| `--type-meta` | metadata; must not go below readable minimum |

## Spacing tokens

XR-1 adds a base spacing scale:

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

Future phases must use this scale before introducing new spacing values.

## Shape and elevation tokens

XR-1 adds named radii and shadow tokens:

- `--radius-xs`
- `--radius-sm`
- `--radius-md`
- `--radius-lg-token`
- `--radius-xl-token`
- `--radius-2xl-token`
- `--shadow-card`
- `--shadow-elevated`
- `--shadow-floating`
- `--shadow-inner-light`

These tokens prevent random card radii and uncontrolled glass shadows.

## Interaction and accessibility tokens

| Token | Requirement |
|---|---|
| `--target-min` | minimum interactive target size: 44px |
| `--target-comfortable` | preferred mobile CTA height: 52px |
| `--focus-ring-color` | visible focus color for each theme |
| `--focus-ring-width` | 2px |
| `--focus-ring-offset` | 3px |
| `--focus-shadow` | secondary visible focus halo |
| `--motion-fast` | 150ms |
| `--motion-normal` | 220ms |
| `--motion-slow` | 320ms |

XR-1 also respects `prefers-reduced-motion`.

## Legacy compatibility

XR-1 maps existing legacy CSS variables to the new semantic tokens:

- `--bg`
- `--surface`
- `--surface-solid`
- `--surface-soft`
- `--surface-muted`
- `--line`
- `--line-strong`
- `--text`
- `--strong`
- `--muted`
- `--accent`
- `--accent-2`
- `--accent-3`
- `--success`
- `--warn`
- `--danger`
- `--shadow-*`
- `--radius-*`
- `--focus`

This allows the current app to remain stable while XR-2 and later phases progressively move components to semantic tokens.

## Rules for future phases

1. Do not introduce hard-coded colors unless they become named tokens.
2. Do not introduce new shadows unless they become named elevation tokens.
3. Do not create new focus styles outside the focus token system.
4. Do not make dark mode an afterthought.
5. Do not use lens-specific gradients without `--lens-*` tokens.
6. Do not hide browser-tested controls to achieve visual polish.
7. Do not use decoration when layout simplification would solve the problem.

## Acceptance criteria

XR-1 is accepted only when:

- semantic light and dark tokens exist
- legacy aliases map to semantic tokens
- focus states are visibly tokenized
- reduced-motion handling remains present
- Strategic/Biopolitical lens accent tokens exist
- typography, spacing, radius, shadow, and target-size tokens exist
- no schema/export/provider/backend behavior changes are introduced
- no-browser checks pass

## Next phase

XR-2 — First-Screen Product Recomposition.

XR-2 must use the XR-1 tokens and should remove the current hero clutter instead of patching support cards.
