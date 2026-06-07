import fs from 'node:fs';
import path from 'node:path';

const fail = (message) => {
  console.error(`Workspace hygiene check failed: ${message}`);
  process.exit(1);
};

const root = process.cwd();
const forbiddenNames = ['preview', 'biopreview', 'playwright-report', 'test-results'];

for (const name of forbiddenNames) {
  if (fs.existsSync(path.join(root, name))) fail(`remove generated or duplicate workspace path: ${name}`);
}

for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (entry.name.startsWith('_patch-')) fail(`remove patch staging folder: ${entry.name}`);
}

console.log('Workspace hygiene check passed.');
