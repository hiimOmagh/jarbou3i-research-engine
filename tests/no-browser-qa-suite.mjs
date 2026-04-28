import { execFileSync } from 'node:child_process';

const tests = [
  'tests/qa-check.mjs',
  'tests/static-check.mjs',
  'tests/schema-check.mjs',
  'tests/fixtures-check.mjs',
  'tests/research-workflow-check.mjs',
  'tests/privacy-export-guard-check.mjs',
  'tests/privacy-export-check.mjs',
  'tests/privacy-audit-check.mjs',
  'tests/privacy-release-gate-check.mjs',
  'tests/migration-check.mjs',
  'tests/research-module-check.mjs',
  'tests/ux-reliability-check.mjs',
  'tests/project-workspace-check.mjs'
];

for (const file of tests) {
  try {
    execFileSync('sh', ['-lc', `node ${file}`], { stdio: 'inherit', timeout: 30000 });
  } catch (error) {
    console.error(`No-browser QA suite failed while running ${file}.`);
    process.exit(error.status || 1);
  }
}

console.log('No-browser QA suite passed. Run targeted provider/source/backend/browser scripts for full subsystem gates.');
process.exit(0);
