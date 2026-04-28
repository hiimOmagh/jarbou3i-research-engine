import { execFileSync } from 'node:child_process';

const tests = [
  'tests/no-browser-qa-suite.mjs',
  'tests/provider-identity-check.mjs',
  'tests/portable-account-check.mjs',
  'tests/provider-response-check.mjs',
  'tests/provider-fixtures-check.mjs',
  'tests/research-module-check.mjs',
  'tests/source-planning-check.mjs',
  'tests/source-import-check.mjs',
  'tests/evidence-review-queue-check.mjs',
  'tests/backend-proxy-check.mjs',
  'tests/backend-worker-smoke.mjs'
];

for (const file of tests) {
  execFileSync(process.execPath, [file], { stdio: 'inherit' });
}

console.log('v0.17 no-browser suite passed.');
process.exit(0);
