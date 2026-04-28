import { spawnSync } from 'node:child_process';

const tests = [
  'tests/qa-check.mjs',
  'tests/static-check.mjs',
  'tests/schema-check.mjs',
  'tests/fixtures-check.mjs',
  'tests/research-workflow-check.mjs'
];

for (const file of tests) {
  const result = spawnSync(process.execPath, [file], { stdio:'inherit', timeout:20000 });
  if (result.error) {
    console.error(`No-browser QA suite failed while running ${file}: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`No-browser QA suite failed: ${file} exited with ${result.status}`);
    process.exit(result.status || 1);
  }
}

console.log('No-browser QA suite passed. Run targeted privacy/a11y/provider/source/backend scripts for full subsystem gates.');
process.exit(0);
