# AI Integration Policy

v0.7.0-alpha is provider-ready and module-hardened, but manual/private mode remains first-class.

The app currently provides:

- provider-ready mock task execution
- OpenAI-compatible BYOK plumbing behind explicit opt-in
- provider request payload contracts
- task-specific response contracts
- provider response parsing and contract validation
- controlled repair fallback for invalid provider responses
- run ledger with fingerprints, response validation, repair trace, warnings, and safety metadata
- mock analysis generation
- mock repair
- mock critique
- mock source-discipline audit
- compiled analysis brief
- synthesis prompt builder
- dedicated prompt/provider modules under `src/research/`

## Provider sequence

1. Mock provider harness — complete.
2. BYOK OpenAI-compatible provider — alpha plumbing complete.
3. Provider response validation and repair loop — complete.
4. Provider/prompt module split — current.
5. Optional hosted backend proxy.
5. Source-assisted backend only after schema, evidence, and validation workflows are stable.

## Provider tasks

- `plan`: produce a research plan.
- `synthesis`: produce schema-compatible strategic analysis JSON.
- `repair`: repair malformed or incomplete strategic JSON.
- `critique`: produce structured critique.
- `source_discipline`: inspect source metadata completeness and counter-evidence gaps.

## Response validation rule

Every provider response must pass this chain before it changes analysis state:

```text
provider output → JSON parse/extract → task response contract → optional repair fallback → accepted/rejected ledger entry
```

Rejected responses are recorded in the Run Ledger but are not inserted into the main JSON import box.

## Non-negotiable rules

- Manual/private mode remains first-class.
- AI output is never trusted before response-contract validation.
- Do not claim source verification unless a real source fetch/check layer exists.
- API keys must never be exported, logged, or stored unless the user explicitly opts into local storage.
- Provider responses must include a task-specific response contract.
- Repair is a controlled fallback, not proof of factual correctness.
