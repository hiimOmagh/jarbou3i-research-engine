# AI Integration Policy

v0.5.0-alpha contains no live AI calls.

The app currently provides:

- provider-ready mock task execution
- provider request payload contracts
- response contracts by task
- run ledger with fingerprints and warnings
- mock analysis generation
- mock repair
- mock critique
- mock source-discipline audit
- compiled analysis brief
- synthesis prompt builder

## Provider sequence

1. Mock provider harness — current.
2. BYOK OpenAI-compatible provider.
3. Optional hosted backend proxy.
4. Source-assisted backend only after schema and evidence workflows are stable.

## Provider tasks

- `plan`: produce a research plan.
- `synthesis`: produce schema-compatible strategic analysis JSON.
- `repair`: repair malformed or incomplete strategic JSON.
- `critique`: produce structured critique.
- `source_discipline`: inspect source metadata completeness and counter-evidence gaps.

## Non-negotiable rules

- Manual/private mode remains first-class.
- AI output is never trusted before schema validation.
- Do not claim source verification unless a real source fetch/check layer exists.
- API keys must never be exported, logged, or stored unless the user explicitly opts into local storage.
- Provider responses must include a task-specific response contract.
