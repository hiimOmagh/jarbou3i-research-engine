import { execFileSync } from 'node:child_process';

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
  'tests/provider-identity-check.mjs',
  'tests/portable-account-check.mjs',
  'tests/provider-response-check.mjs',
  'tests/provider-fixtures-check.mjs',
  'tests/source-planning-check.mjs',
  'tests/source-import-check.mjs',
  'tests/evidence-review-queue-check.mjs',
  'tests/backend-proxy-check.mjs',
  'tests/backend-worker-smoke.mjs'
];

for (const file of tests) {
  try {
    execFileSync('sh', ['-lc', `node ${file}`], { stdio: 'inherit', timeout: 30000 });
  } catch (error) {
    console.error(`v0.19 no-browser suite failed while running ${file}.`);
    process.exit(error.status || 1);
  }
}

console.log('v0.19 no-browser suite passed. Run npm run test:browser:provider after Playwright browser install.');
process.exit(0);
