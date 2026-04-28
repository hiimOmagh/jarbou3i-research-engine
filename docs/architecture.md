# Architecture

## Current v0.20.0-beta pipeline

```text
Topic/context
→ Research Plan
→ Evidence Matrix
→ Evidence Review Queue
→ Causal Links
→ Analysis Brief Compiler
→ Provider Harness
→ Provider Response Validation
→ Controlled Repair Loop
→ Critique
→ Quality Gate v2
→ Export
```

## Provider architecture

Provider code is split into modules:

- `src/research/provider-identity.js`
- `src/research/portable-account-mock.js`
- `src/research/provider-core.js`
- `src/research/mock-provider.js`
- `src/research/openai-compatible-provider.js`
- `src/research/backend-proxy-provider.js`

The provider identity layer models `auth_type`, `billing_owner`, `key_exposure`, `privacy_mode`, `credential_class`, live support, and production status.

## Portable account mock

`portable_oauth` is not a real OAuth integration yet. It is a local simulation that creates safe account metadata:

- account ID
- token hash
- token expiry timestamp
- scopes
- spending limit metadata
- safety verdict

It never creates or exports a raw token.

## Backend layer

The Cloudflare Worker scaffold remains optional. The static app must remain functional without backend deployment.
