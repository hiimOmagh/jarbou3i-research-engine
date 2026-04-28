# AI Integration Policy

v0.3.0-alpha contains no live AI calls.

The app currently provides:

- mock analysis generation
- mock repair
- mock critique
- compiled analysis brief
- synthesis prompt builder

## Provider sequence

1. Mock provider only.
2. Provider abstraction split.
3. BYOK OpenAI-compatible provider.
4. Optional hosted backend proxy.
5. Source-assisted backend only after schema and evidence workflows are stable.

## Non-negotiable rules

- Manual/private mode remains first-class.
- AI output is never trusted before schema validation.
- Do not claim source verification unless a real source fetch/check layer exists.
- API keys must never be exported, logged, or stored unless the user explicitly opts into local storage.
