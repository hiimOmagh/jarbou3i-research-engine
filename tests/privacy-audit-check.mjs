import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const context = { console, globalThis: {} };
context.window = context.globalThis;
vm.createContext(context);
for (const file of ['src/research/privacy-export-guard.js', 'src/research/privacy-audit.js']) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
}

const audit = context.globalThis.Jarbou3iResearchModules.privacyAudit;
assert.equal(audit.PRIVACY_AUDIT_VERSION, '0.29.0-rc.1');
assert.equal(typeof audit.scanPrivacyPayload, 'function');
assert.equal(typeof audit.assertPrivacyReleaseGate, 'function');
assert.equal(audit.isSafeDerivedKey('token_hash'), true);
assert.equal(audit.sensitiveKeyMatch('api_key')?.id, 'api-key');
assert.equal(audit.sensitiveKeyMatch('key_exported'), null);

const secret = 'sk-' + 'x'.repeat(28);
const bearer = 'Bearer ' + 'y'.repeat(28);
const payload = {
  workflow_version: '0.29.0-rc.1',
  provider_config: { api_key: secret, remember_key: true },
  portable_account: { token_hash: 'h-safe-derived', raw_token: bearer, raw_token_exported: false, key_exported: false },
  notes: `credential ${bearer}`
};

const before = audit.scanPrivacyPayload(payload);
assert.equal(before.safe, false);
assert.ok(before.issue_count >= 3);

const result = audit.sanitizeAndAuditPrivacyPayload(payload, { version: '0.29.0-rc.1' });
assert.equal(result.privacy_export.audit_version, '0.29.0-rc.1');
assert.equal(result.privacy_export.release_gate, 'pass');
assert.equal(result.privacy_export.safe, true);
assert.equal(result.privacy_export.pre_redaction_issue_count >= 3, true);
assert.equal(result.privacy_export.post_redaction_issue_count, 0);
assert.equal(Object.prototype.hasOwnProperty.call(result.sanitized_payload.provider_config, 'api_key'), false);
assert.equal(result.sanitized_payload.portable_account.token_hash, 'h-safe-derived');
assert.equal(Object.prototype.hasOwnProperty.call(result.sanitized_payload.portable_account, 'raw_token'), false);
assert.equal(result.sanitized_payload.notes, '[REDACTED_BY_PRIVACY_AUDIT]');

audit.assertPrivacyReleaseGate(result.sanitized_payload);
assert.throws(() => audit.assertPrivacyReleaseGate(payload), /Privacy release gate failed/);

console.log('PASS privacy-audit-check');
process.exit(0);
