import fs from 'node:fs';
import path from 'node:path';

const fail = (message) => {
  console.error(`Workspace hygiene check failed: ${message}`);
  process.exit(1);
};

const root = process.cwd();
const forbiddenPaths = [
  'preview',
  'biopreview',
  'playwright-report',
  'test-results',
  'dist',
  'ci-artifacts',
  'hosted-demo-evidence-local'
];

for (const name of forbiddenPaths) {
  if (fs.existsSync(path.join(root, name))) fail(`remove generated or duplicate workspace path: ${name}`);
}

const forbiddenRootFilePatterns = [
  /^jarbou3i-model-v.*\.zip$/i,
  /^.*-changed-files\.zip$/i,
  /^.*-hotfix\.zip$/i,
  /^.*-package\.zip$/i,
  /^PACKAGE-MANIFEST\.json$/,
  /^README-PACKAGE\.md$/,
  /^apply-.*\.mjs$/,
  /^validate-.*\.mjs$/
];

for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (entry.name.startsWith('_patch-')) fail(`remove patch staging folder: ${entry.name}`);
  if (forbiddenRootFilePatterns.some((pattern) => pattern.test(entry.name))) {
    fail(`remove root package/artifact file: ${entry.name}`);
  }
}

console.log('Workspace hygiene check passed.');
