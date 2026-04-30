import { spawnSync } from 'node:child_process';

const tests = [
  'tests/qa-check.mjs',
  'tests/static-check.mjs',
  'tests/schema-check.mjs',
  'tests/fixtures-check.mjs',
  'tests/research-workflow-check.mjs',
  'tests/a11y-static-check.mjs',
  'tests/privacy-export-guard-check.mjs',
  'tests/privacy-export-check.mjs',
  'tests/privacy-audit-check.mjs',
  'tests/privacy-release-gate-check.mjs',
  'tests/migration-check.mjs',
  'tests/research-module-check.mjs',
  'tests/ux-reliability-check.mjs',
  'tests/project-workspace-check.mjs',
  'tests/analysis-template-check.mjs',
  'tests/quality-gate-v3-check.mjs',
  'tests/export-pack-v2-check.mjs',
  'tests/provider-identity-check.mjs',
  'tests/portable-account-check.mjs',
  'tests/portable-oauth-spike-check.mjs',
  'tests/stable-release-check.mjs',
  'tests/patch-stabilization-check.mjs',
  'tests/provider-response-check.mjs',
  'tests/provider-fixtures-check.mjs',
  'tests/source-planning-check.mjs',
  'tests/source-import-check.mjs',
  'tests/evidence-review-queue-check.mjs',
  'tests/github-source-connector-check.mjs',
  'tests/web-search-provider-check.mjs',
  'tests/backend-proxy-check.mjs',
  'tests/backend-hardening-check.mjs',
  'tests/backend-worker-smoke.mjs'
];

for (const test of tests) {
  const result = spawnSync(process.execPath, [test], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}
console.log(`v1.0.6 no-browser suite passed (${tests.length} checks).`);
process.exit(0);
