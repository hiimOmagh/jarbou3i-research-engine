import { execFileSync } from 'node:child_process';

const tests = [
  'tests/qa-check.mjs',
  'tests/static-check.mjs',
  'tests/schema-check.mjs',
  'tests/fixtures-check.mjs',
  'tests/a11y-static-check.mjs',
  'tests/research-workflow-check.mjs',
  'tests/privacy-export-guard-check.mjs',
  'tests/privacy-export-check.mjs',
  'tests/migration-check.mjs'
];

for (const file of tests) {
  execFileSync(process.execPath, [file], { stdio: 'inherit' });
}

console.log('No-browser QA suite passed.');
process.exit(0);
