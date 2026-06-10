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
  'test:browser:core':
    'playwright test tests/a11y.spec.js tests/smoke.spec.js tests/rtl-mobile.spec.js tests/export-contract.spec.js tests/lens-import-contract.spec.js tests/systems-map.spec.js tests/cross-locale-export-contract.spec.js',
  'test:browser:hosted': 'playwright test tests/hosted-demo-evidence.spec.js --workers=1',
  'test:browser': 'npm run test:browser:core && npm run test:browser:hosted',
  'test:ci:browser': 'npm run test:browser && npm run test:evidence:hosted',
  'test:ci': 'npm run test:ci:no-browser && npm run test:ci:browser',
  'test:source': 'node tests/source-of-truth-check.mjs',
  'test:hygiene': 'node tests/workspace-hygiene-check.mjs',
  'test:evidence:hosted': 'node tests/hosted-demo-evidence-review-check.mjs',
  'test:local:no-browser': 'npm run test:ci:no-browser',
  'test:local:browser': 'npm run test:ci:browser',
  'test:local:split': 'node tests/local-ci-split-contract-check.mjs',
  'test:local:all': 'npm run test:local:split && npm run test:local:no-browser && npm run test:local:browser'
};

for (const [name, command] of Object.entries(requiredScripts)) {
  if (scripts[name] !== command) fail(`${name} must equal: ${command}`);
}

const requiredWorkflowTokens = [
  'name: No-browser gates',
  'name: Browser gates',
  'needs: no-browser',
  'node-version: 20',
  'corepack enable',
  'corepack prepare pnpm@9.15.9 --activate',
  'pnpm install --no-frozen-lockfile',
  'pnpm exec playwright install --with-deps',
  'pnpm exec playwright test tests/a11y.spec.js tests/smoke.spec.js tests/rtl-mobile.spec.js tests/export-contract.spec.js tests/lens-import-contract.spec.js tests/systems-map.spec.js tests/cross-locale-export-contract.spec.js',
  'pnpm exec playwright test tests/hosted-demo-evidence.spec.js --workers=1',
  'node tests/hosted-demo-evidence-review-check.mjs hosted-demo-evidence',
  'npm run test:ci:no-browser',
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
  'npm install --no-audit --no-fund || true',
  'npm install --no-audit --no-fund --no-save @playwright/test',
  'npx playwright install --with-deps',
  'npx playwright test',
  'node tests/qa-check.mjs'
];

for (const token of forbiddenWorkflowTokens) {
  if (workflow.includes(token)) fail(`workflow must not contain token: ${token}`);
}

if (workflow.includes('npm run test:browser') && !workflow.includes('npm run test:ci:browser')) {
  fail('workflow must call the stable browser CI alias when package scripts are used directly');
}

if (pkg.version !== '1.4.0-bio-alpha.3.1') {
  fail('package version must be 1.4.0-bio-alpha.3.1');
}

if (lock.version !== pkg.version) {
  fail('package-lock root version must match package.json');
}

if (lock.packages?.['']?.version !== pkg.version) {
  fail('package-lock packages[""] version must match package.json');
}


const localSplitDoc = read(path.join(root, 'docs', 'local-ci-split.md'));
for (const token of [
  'v1.4.0-bio-alpha.3.1',
  'Run no-browser gates before installing browser dependencies',
  'npm run test:ci:no-browser',
  'npm run test:ci:browser',
  'node_modules/ must not be present during hygiene lock'
]) {
  if (!localSplitDoc.includes(token)) fail(`local CI split documentation missing token: ${token}`);
}

console.log('CI script contract check passed.');
