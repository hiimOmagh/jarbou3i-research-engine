# Contributing

Keep contributions disciplined. This is a focused analytical tool, not a general dashboard framework.

## Good contributions

- UI/RTL bug fixes
- accessibility improvements
- browser compatibility fixes
- report/export polish
- better tests
- clearer translations
- schema normalization improvements

## Avoid

- adding backend dependencies without strong justification
- adding account/login flows
- adding API-key workflows by default
- adding unrelated analysis models
- adding visual clutter

## Quality bar

Before opening a pull request:

```bash
npm install
npx playwright install --with-deps
npm test
```

Also complete `docs/visual-qa.md` manually for major UI changes.
