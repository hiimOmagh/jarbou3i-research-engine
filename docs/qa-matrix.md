# QA Matrix

## No-browser gates

| Command | Purpose |
|---|---|
| `npm run test:static` | Syntax, required files, app metadata, legacy-token checks |
| `npm run test:schema` | Strategic analysis schema and fixtures |
| `npm run test:fixtures` | Analysis fixture integrity |
| `npm run test:research` | Research workflow schema/UI/fixture checks |
| `npm run test:a11y:static` | Static accessibility checks |
| `npm run test:qa` | Consolidated no-browser QA |

## Browser gates

| Command | Purpose |
|---|---|
| `npm run test:browser` | Playwright browser suite |
| `npm run test:e2e` | Main manual workflow smoke test |
| `npm run test:rtl` | RTL/mobile visual behavior |

## Manual QA focus

- Arabic RTL layout in research panel.
- Evidence table horizontal overflow on mobile.
- Mock analysis JSON validation.
- Import button state after mock generation.
- Manual workflow still usable without touching research panel.
