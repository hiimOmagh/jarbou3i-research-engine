import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const code = fs.readFileSync('src/research/privacy-export-guard.js', 'utf8');
const sandbox = { console, globalThis: {} };
sandbox.window = sandbox.globalThis;
vm.createContext(sandbox);
vm.runInContext(code, sandbox, { filename: 'src/research/privacy-export-guard.js' });
const guard = sandbox.globalThis.Jarbou3iResearchModules.privacyExportGuard;

assert.equal(guard.PRIVACY_EXPORT_GUARD_VERSION, '1.0.5');
assert.equal(guard.isSensitivePrivacyKey('api_key'), true);
assert.equal(guard.isSensitivePrivacyKey('access_token'), true);
assert.equal(guard.isSensitivePrivacyKey('token_hash'), false);
assert.equal(guard.isSensitivePrivacyKey('key_exported'), false);

const payload = {
  workflow_version: '1.0.5',
  provider_config: { endpoint: 'https://example.test/v1/chat/completions', api_key: 'sk-this-must-not-export-1234567890' },
  portable_account: { token_hash: 'h12345678', raw_token: 'secret-token-value', raw_token_exported: false, key_exported: false },
  ai_runs: [{ warning: 'Bearer abcdefghijklmnopqrstuvwxyz123456' }]
};

const sanitized = guard.sanitizePrivacyExport(payload);
assert.equal(sanitized.privacy_export.safe, false);
assert.equal(sanitized.privacy_export.raw_token_exported, false);
assert.equal(sanitized.privacy_export.key_exported, false);
assert.ok(sanitized.privacy_export.issue_count >= 3);
assert.equal(sanitized.sanitized_payload.provider_config.api_key, '[REDACTED_BY_PRIVACY_EXPORT_GUARD]');
assert.equal(sanitized.sanitized_payload.portable_account.token_hash, 'h12345678');
assert.equal(sanitized.sanitized_payload.portable_account.raw_token, '[REDACTED_BY_PRIVACY_EXPORT_GUARD]');
assert.equal(sanitized.sanitized_payload.ai_runs[0].warning, '[REDACTED_BY_PRIVACY_EXPORT_GUARD]');

const attached = guard.attachPrivacyExportReport({ portable_account: { token_hash: 'h87654321', raw_token_exported: false }});
assert.equal(attached.privacy_export.guard_version, '1.0.5');
assert.equal(attached.privacy_export.safe, true);
assert.equal(attached.portable_account.token_hash, 'h87654321');

console.log('PASS privacy-export-guard-check');

process.exit(0);
