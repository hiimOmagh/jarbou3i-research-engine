import fs from 'node:fs';
import path from 'node:path';

const fail = (message) => {
  console.error(`CI script contract check failed: ${message}`);
  process.exit(1);
};

const read = (file) => fs.readFileSync(file, 'utf8');
const root = process.cwd();
const pkg = JSON.parse(read(path.join(root, 'package.json')));
const lock = JSON.parse(read(path.join(root, 'package-lock.json')));
const workflowPath = path.join(root, '.github', 'workflows', 'ci.yml');

if (!fs.existsSync(workflowPath)) fail('missing .github/workflows/ci.yml');

const workflow = read(workflowPath);
const scripts = pkg.scripts || {};

const requiredScripts = {
  'test:ci:no-browser':
    'npm run test:qa && npm run test:static && npm run test:schema && npm run test:fixtures && npm run test:a11y:static && npm run test:ci:contract && npm run test:hygiene',
  'test:ci:browser': 'npm run test:browser',
  'test:ci': 'npm run test:ci:no-browser && npm run test:ci:browser',
  'test:source': 'node tests/source-of-truth-check.mjs',
  'test:hygiene': 'node tests/workspace-hygiene-check.mjs',
  'test:browser:hosted': 'playwright test tests/hosted-demo-evidence.spec.js'
};

for (const [name, command] of Object.entries(requiredScripts)) {
  if (scripts[name] !== command) fail(`${name} must equal: ${command}`);
}

const requiredWorkflowTokens = [
  'name: No-browser gates',
  'name: Browser gates',
  'needs: no-browser',
  'node-version: 20',
  'npm install --no-audit --no-fund',
  'npm run test:ci:no-browser',
  'npx playwright install --with-deps',
  'npm run test:ci:browser',
  'HOSTED_DEMO_EVIDENCE_DIR: hosted-demo-evidence',
  'actions/upload-artifact@v4',
  'name: hosted-demo-evidence'
];

for (const token of requiredWorkflowTokens) {
  if (!workflow.includes(token)) fail(`workflow missing token: ${token}`);
}

const forbiddenWorkflowTokens = [
  'node-version: 22',
  'cache: npm',
  'npm ci',
  'node tests/qa-check.mjs'
];

for (const token of forbiddenWorkflowTokens) {
  if (workflow.includes(token)) fail(`workflow must not contain token: ${token}`);
}

if (workflow.includes('npm run test:browser') && !workflow.includes('npm run test:ci:browser')) {
  fail('workflow must call the stable browser CI alias');
}

if (pkg.version !== '1.3.0-bio-alpha.6') {
  fail('package version must be 1.3.0-bio-alpha.6');
}

if (lock.version !== pkg.version) {
  fail('package-lock root version must match package.json');
}

if (lock.packages?.['']?.version !== pkg.version) {
  fail('package-lock packages[""] version must match package.json');
}

console.log('CI script contract check passed.');