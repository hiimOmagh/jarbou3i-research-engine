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
  'tests/ux-reliability-check.mjs',
  'tests/project-workspace-check.mjs',
  'tests/analysis-template-check.mjs',
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
    console.log(`RUN ${file}`);
    execFileSync(process.execPath, [file], { stdio: 'inherit', timeout: 120000 });
  } catch (error) {
    console.error(`v0.22 no-browser suite failed while running ${file}: ${error.message}`);
    process.exit(error.status || 1);
  }
}
console.log('v0.22 no-browser suite passed. Run npm run test:browser:provider after Playwright browser install.');
process.exit(0);
