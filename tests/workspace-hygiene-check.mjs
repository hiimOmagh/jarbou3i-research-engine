import fs from 'node:fs';
import path from 'node:path';

const fail = (message) => {
  console.error(`Workspace hygiene check failed: ${message}`);
  process.exit(1);
};

const forbidden = [
  'node_modules',
  'playwright-report',
  'test-results',
  'dist',
  'hosted-demo-evidence',
  'hosted-demo-evidence-local'
];

for (const entry of forbidden) {
  if (fs.existsSync(path.join(process.cwd(), entry))) fail(`${entry}/ must not be committed or present during hygiene lock`);
}

for (const name of fs.readdirSync(process.cwd())) {
  if (/^_patch-/.test(name)) fail(`${name} must be removed before commit`);
  if (/\.zip$/i.test(name)) fail(`${name} archive must not be committed`);
}

console.log('Workspace hygiene check passed.');
