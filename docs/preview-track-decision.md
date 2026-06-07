# Preview Track Decision — v1.3.0-bio-alpha.2

## Decision

The biopolitical preview is no longer a parallel product track. It is the development candidate that should be promoted to the repository root when the maintainer is ready.

After promotion, the repository should have one authoritative app surface:

```text
index.html
src/
schema/
fixtures/
tests/
```

A copied `preview/` or `biopreview/` folder may be used temporarily for manual inspection, but it should not become a second committed source of truth.

## Rationale

The alpha.1 work introduced Strategic/Biopolitical lens support while preserving the legacy six-key JSON contract. Keeping the upgraded app inside a preview folder and the old app at root causes CI drift: local tests can pass in `preview/` while GitHub Pages and CI still validate the obsolete root.

## Required promotion rule

Before release lock:

```text
root app = current app
preview/ = absent, archived outside the repo, or explicitly documented as non-authoritative
biopreview/ = absent
```

## Non-goals

This decision does not remove backward-compatible strategic imports. It only removes ambiguity about where the deployable app lives.

## Validation expectation

All gates must be run from the repository root after promotion:

```bash
npm run test:qa
node tests/static-check.mjs
node tests/schema-check.mjs
node tests/fixtures-check.mjs
node tests/a11y-static-check.mjs
npm run test:browser
```
