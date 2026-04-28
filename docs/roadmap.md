# Roadmap

## v0.1.0-alpha — Research Workflow Skeleton

Shipped the first isolated lab layer: research plan, evidence matrix draft, mock analysis, mock repair, critique, and Quality Gate v2 draft.

## v0.2.0-alpha — Evidence + Causal Link Workbench

Current version.

Adds editable evidence, research-packet import/export, manual causal-link creation, causal-link inference, and expanded readiness scoring.

## v0.3.0-alpha — Provider Abstraction + Prompt Modules

Planned:

- Split mock provider and prompt builders out of `research-engine.js`.
- Add explicit provider interface: `generatePlan`, `generateAnalysis`, `repairAnalysis`, `critiqueAnalysis`.
- Add prompt fixtures and prompt regression tests.
- Add JSON repair fixtures.

## v0.4.0-beta — BYOK AI Provider

Planned:

- Add OpenAI-compatible direct browser provider.
- Keep API key memory-only by default.
- Add safety checks to ensure keys are not exported, logged, or stored accidentally.
- Manual mode remains first-class.

## v1.0.0 — Stable Research Engine

Release only after:

- Manual mode works.
- Mock mode works.
- Optional AI mode works.
- Research-packet schema is stable.
- EN/AR/FR and RTL QA pass.
- Browser tests pass in CI.
