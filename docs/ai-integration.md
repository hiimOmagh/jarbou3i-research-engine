# AI Integration Policy

## Current state: v0.20.0-beta

The research engine supports four provider modes:

1. `mock` — deterministic local provider, no network.
2. `openai_compatible` — BYOK direct provider mode, live only with explicit opt-in.
3. `backend_proxy` — hosted proxy scaffold, live only with explicit opt-in.
4. `portable_oauth` — local portable-account mock flow; no real OAuth or live calls.

## Portable account mock flow

The portable account flow simulates the future BrainLink/OpenRouter-style pattern:

```text
Connect mock portable account
→ receive mock account metadata and token hash
→ optionally refresh mock token hash
→ run provider task through MockProvider while preserving portable-account metadata
→ export safe status without raw token
```

No real OAuth authorization endpoint is contacted. No access token or refresh token is generated. Only a mock token hash is stored in state and exports.

## Non-negotiable guardrails

- Manual/private mode remains first-class.
- No raw API key is exported.
- No raw OAuth token is exported.
- Portable-account live calls remain blocked.
- Hosted proxy secrets must stay server-side.
- AI output must pass response-contract validation before it can affect app state.

## Future real OAuth integration requirements

Before adding a real portable account provider:

- OAuth Authorization Code + PKCE must be implemented correctly.
- Access tokens must never be exported in packets, reports, or ledgers.
- Token refresh must be explicit and auditable.
- Billing owner and spending control must be shown clearly.
- Provider terms, privacy, and reliability must be reviewed.
