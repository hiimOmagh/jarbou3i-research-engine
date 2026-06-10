import fs from 'node:fs';
import path from 'node:path';

const fail = (message) => {
  console.error(`Local CI split contract check failed: ${message}`);
  process.exit(1);
};

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const scripts = pkg.scripts || {};

const requiredScripts = {
  'test:local:no-browser': 'npm run test:ci:no-browser',
  'test:local:browser': 'npm run test:ci:browser',
  'test:local:split': 'node tests/local-ci-split-contract-check.mjs',
  'test:local:all': 'npm run test:local:split && npm run test:local:no-browser && npm run test:local:browser'
};

for (const [name, command] of Object.entries(requiredScripts)) {
  if (scripts[name] !== command) fail(`${name} must equal: ${command}`);
}

const doc = read('docs/local-ci-split.md');
for (const token of [
  'v1.4.0-bio-alpha.8.2',
  'Run no-browser gates before installing browser dependencies',
  'npm run test:ci:no-browser',
  'npm install',
  'npm run test:ci:browser',
  'node_modules/ must not be present during hygiene lock',
  'Remove-Item -Recurse -Force .\\node_modules'
]) {
  if (!doc.includes(token)) fail(`docs/local-ci-split.md missing token: ${token}`);
}

console.log('Local CI split contract check passed.');
