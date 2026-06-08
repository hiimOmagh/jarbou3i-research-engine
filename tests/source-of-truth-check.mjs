import fs from 'node:fs';
import path from 'node:path';

const fail = (message) => {
  console.error(`Source-of-truth check failed: ${message}`);
  process.exit(1);
};

const root = process.cwd();
const forbiddenTracks = ['preview', 'biopreview'];

for (const dir of forbiddenTracks) {
  if (fs.existsSync(path.join(root, dir))) {
    fail(`${dir}/ must not exist in the release root. Promote or remove it before locking.`);
  }
}

for (const required of ['index.html', 'src/app.js', 'src/styles.css', 'tests/smoke.spec.js']) {
  if (!fs.existsSync(path.join(root, required))) {
    fail(`missing root source file: ${required}`);
  }
}

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.version !== '1.3.0-bio') {
  fail('root package version must be 1.3.0-bio');
}

for (const script of ['test:ci:no-browser', 'test:ci:browser', 'test:ci', 'test:hygiene']) {
  if (!packageJson.scripts?.[script]) fail(`missing package script: ${script}`);
}

console.log('Source-of-truth check passed.');
