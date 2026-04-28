# Privacy Audit Release Gate

`v0.20.0-beta` treats every exported JSON payload as a security boundary.

The privacy system now has two layers:

1. `privacy-export-guard.js` redacts obvious sensitive fields and secret-shaped text.
2. `privacy-audit.js` performs a final release-gate scan on the exported payload after redaction/removal.

## Export contract

Every safe export receives a `privacy_export` object with:

- `audit_version`
- `guard_version`
- `release_gate`
- `pre_redaction_issue_count`
- `post_redaction_issue_count`
- `key_exported:false`
- `raw_token_exported:false`
- `access_token_exported:false`
- `refresh_token_exported:false`
- `secret_exported:false`
- `credential_exported:false`
- `redaction_applied`
- `redacted_issues`

## Hard rule

Final exported payloads must pass with:

```text
release_gate: pass
post_redaction_issue_count: 0
key_exported: false
raw_token_exported: false
```

The scanner allows safe derived metadata such as `token_hash`, `key_exported:false`, and `raw_token_exported:false`. It does not allow raw secret fields or secret-shaped values in the final payload.

## Tests

```bash
npm run test:privacy
npm run test:privacy:audit
npm run test:privacy:release-gate
```

Release-gate candidates include workflow fixtures, migration fixtures, schema JSON, and the browser-generated export fixture in `fixtures/privacy/`.
