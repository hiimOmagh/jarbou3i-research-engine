import fs from 'node:fs';
import assert from 'node:assert/strict';

const worker = fs.readFileSync('backend/cloudflare-worker.js', 'utf8');
const readme = fs.readFileSync('backend/README.md', 'utf8');
const checklist = fs.readFileSync('docs/backend-production-checklist.md', 'utf8');
const schema = JSON.parse(fs.readFileSync('schema/research-workflow.schema.json', 'utf8'));
const fixture = JSON.parse(fs.readFileSync('fixtures/research/sample-research-workflow-en.json', 'utf8'));
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

for (const token of [
  'RATE_LIMIT_SECONDS',
  'PROVIDER_TIMEOUT_MS',
  'MAX_UPSTREAM_BYTES',
  'ALLOWED_MODELS',
  'AUDIT_LOGS_ENABLED',
  'ERROR_TAXONOMY',
  'cors_origin_not_allowed',
  'model_not_allowed',
  'rate_limited',
  'upstream_timeout',
  'audit_logs_redacted',
  'prompt_logged: false',
  'structured_error_code_category_retryable'
]) assert.ok(worker.includes(token), `Worker missing hardening token: ${token}`);

for (const token of [
  'Structured error taxonomy',
  'Rate limiting',
  'Provider timeout',
  'Model allow-list',
  'Redacted audit logs',
  'CORS allow-list',
  'npm run test:backend:hardening'
]) assert.ok(readme.includes(token) || checklist.includes(token), `Docs missing hardening token: ${token}`);

assert.equal(pkg.version, '1.0.5');
assert.ok(pkg.scripts['test:backend:hardening']?.includes('backend-hardening-check'), 'package missing backend hardening script');
assert.ok(pkg.scripts['test:backend']?.includes('backend-hardening-check'), 'test:backend must include backend hardening check');
assert.ok(schema.required.includes('backend_hardening'), 'schema must require backend_hardening metadata');
assert.equal(schema.properties.backend_hardening.properties.hardening_version.const, '1.0.5');
assert.equal(fixture.backend_hardening.hardening_version, '1.0.5');
assert.equal(fixture.backend_hardening.audit_policy.prompt_logged, false);
assert.equal(fixture.backend_hardening.audit_policy.secrets_logged, false);
assert.equal(fixture.backend_hardening.release_gate, 'backend_hardening_checked');

console.log('Backend hardening static checks passed.');
process.exit(0);
