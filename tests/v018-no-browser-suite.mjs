import { spawnSync } from 'node:child_process';

const tests = [
  'tests/static-check.mjs',
  'tests/schema-check.mjs',
  'tests/fixtures-check.mjs',
  'tests/research-workflow-check.mjs',
  'tests/privacy-export-check.mjs',
  'tests/migration-check.mjs',
  'tests/research-module-check.mjs'
];

for (const file of tests) {
  const result = spawnSync(process.execPath, [file], { stdio:'inherit', timeout:20000 });
  if (result.error) {
    console.error(`v0.18 no-browser suite failed while running ${file}: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`v0.18 no-browser suite failed: ${file} exited with ${result.status}`);
    process.exit(result.status || 1);
  }
}

console.log('v0.18 no-browser suite passed. Run npm run test:qa, test:provider, test:source, test:backend, and test:a11y:static for full targeted subsystem coverage.');
process.exit(0);
