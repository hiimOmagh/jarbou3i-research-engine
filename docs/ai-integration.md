# AI Integration Policy

v0.10.0-beta hardens the optional hosted backend proxy with Worker smoke tests and a local Worker guide. Manual/private mode remains first-class.

## Provider modes

```text
MockProvider
- Local deterministic responses.
- Default mode.
- No network call.

OpenAI-compatible BYOK
- Browser calls provider directly.
- User key is memory-only by default.
- Optional local-device storage requires explicit checkbox.

Hosted backend proxy
- Browser calls your backend.
- Provider API key is stored as a server environment secret.
- No provider key is sent to or stored by the browser.
```

## Backend contract

The prototype Cloudflare Worker exposes:

```text
GET  /api/health
POST /api/provider-task
```

Required server secret:

```text
OPENAI_API_KEY
```

Optional environment variables:

```text
OPENAI_BASE_URL
OPENAI_MODEL
ALLOWED_ORIGINS
MAX_PROMPT_CHARS
MAX_BODY_BYTES
```

## Response validation rule

Every provider response must pass this chain before it changes analysis state:

```text
provider output → JSON parse/extract → task response contract → optional repair fallback → accepted/rejected ledger entry
```

Rejected responses are recorded in the Run Ledger but are not inserted into the main JSON import box.

## Non-negotiable rules

- Manual/private mode remains first-class.
- MockProvider remains available even if backend fails.
- Live hosted proxy calls require explicit opt-in.
- AI output is never trusted before response-contract validation.
- Do not claim source verification unless a real source fetch/check layer exists.
- API keys must never be exported, logged, or stored unless the user explicitly opts into local browser storage for BYOK.
- Backend secrets must only exist in the server/Worker environment.
- Repair is a controlled fallback, not proof of factual correctness.
