# AI Integration Policy

## Current alpha

No live AI is used. All synthesis is produced by local mock logic.

## Future modes

### Manual mode

No data leaves the browser.

### BYOK mode

The user provides an API key. Default behavior must keep the key in memory only. Local persistence may exist only behind explicit user opt-in.

### Hosted mode

The frontend calls a backend proxy. The provider key must be stored only as an environment secret server-side.

## Non-negotiable rules

- Never render or export API keys.
- Never claim source verification unless sources are actually fetched and checked.
- Validate AI output before rendering it.
- Preserve manual mode as first-class.
- Keep provider-specific code behind a provider abstraction.
