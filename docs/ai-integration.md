# AI Integration Policy

v0.14.0-beta adds provider identity and billing abstraction while preserving the optional hosted backend proxy and manual/private mode.

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

Portable account / OAuth provider
- Planned provider class for BrainLink/OpenRouter-style account flows.
- Auth type is modeled as OAuth/PKCE.
- Billing owner is modeled as the user's portable account.
- Live integration is intentionally disabled in this beta.
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


## v0.14.0-beta — Source-Assisted Backend Planning Layer

This increment adds the planning layer for future source-assisted research. It does **not** perform live crawling, scraping, or factual source verification.

Added capabilities:
- Source connector registry with `manual_mock`, planned web search, GitHub, Hacker News, YouTube, Reddit, and Polymarket connectors.
- Source task contracts for source planning, query planning, claim extraction, evidence scoring, and source clustering.
- Planning-only backend endpoint `POST /api/source-task`.
- Source policy object enforcing `live_fetching_enabled: false`.
- Source diagnostics and source fixture suite.
- Quality Gate v2 source-planning, source-policy, and source-fixture scores.

Operational rule: the source layer may prepare requests and evidence-extraction contracts, but it must not claim real source verification until a compliant fetch/search connector is implemented.


## v0.14.0-beta — Evidence Review Queue

Source-imported candidates are now routed through `evidence_review_queue` and must be accepted, edited, or rejected before entering `evidence_matrix`. This preserves evidence discipline and prevents pasted research outputs from contaminating the analysis state without human review.
