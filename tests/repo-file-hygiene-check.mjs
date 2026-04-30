import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const exists = (relativePath) => fs.existsSync(path.join(repoRoot, relativePath));
const posix = (value) => value.split(path.sep).join('/');

const readDirSafe = (dir) => {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch (error) {
    return [];
  }
};

const walk = (dir, base = '') => {
  const entries = [];
  for (const entry of readDirSafe(path.join(repoRoot, dir))) {
    const relative = posix(path.join(base, entry.name));
    if (relative === '.git' || relative === 'node_modules') continue;
    if (entry.isDirectory()) {
      entries.push({ type: 'dir', path: relative });
      entries.push(...walk(path.join(dir, entry.name), relative));
    } else if (entry.isFile()) {
      entries.push({ type: 'file', path: relative });
    } else {
      entries.push({ type: 'special', path: relative });
    }
  }
  return entries;
};

const allEntries = walk('.');
const allPaths = new Set(allEntries.map((entry) => entry.path));

const requiredDeletes = [
  {
    path: 'docs/v1.0.5-browser-qa-visual-regression-hardening.md',
    reason: 'misnamed duplicate of the v1.0.4 browser QA / visual regression document'
  },
  {
    path: 'scripts/XXKuyryP',
    reason: 'orphan temporary script artifact'
  },
  {
    path: 'src/XXSyA2D3',
    reason: 'orphan temporary source artifact'
  }
];

const generatedRootNames = [
  'node_modules',
  'dist',
  'build',
  'coverage',
  'playwright-report',
  'test-results',
  '.nyc_output'
];

const forbiddenSecretFiles = [
  '.env',
  '.env.local',
  '.env.production',
  '.env.development',
  'backend/.dev.vars',
  'backend/.dev.vars.local'
];

const failures = [];
for (const item of requiredDeletes) {
  if (exists(item.path)) failures.push(`DELETE ${item.path} — ${item.reason}`);
}

for (const name of generatedRootNames) {
  if (exists(name)) failures.push(`DELETE ${name}/ — generated dependency/build/test output must not be committed`);
}

for (const file of forbiddenSecretFiles) {
  if (exists(file)) failures.push(`DELETE ${file} — local secret/config file must not be committed`);
}

for (const entry of allEntries) {
  if (entry.type === 'special') failures.push(`DELETE ${entry.path} — special filesystem entry is not release-safe`);
  if (entry.type === 'file' && entry.path.endsWith('.zip')) failures.push(`DELETE ${entry.path} — release archives must stay outside the committed repo`);
  if (entry.type === 'file' && /(^|\/)Thumbs\.db$|(^|\/)\.DS_Store$/.test(entry.path)) failures.push(`DELETE ${entry.path} — OS metadata file`);
  if (entry.type === 'file' && /(^|\/).*\.tmp$/.test(entry.path)) failures.push(`DELETE ${entry.path} — temporary file`);
  if (entry.type === 'file' && /(^|\/).*\.log$/.test(entry.path)) failures.push(`DELETE ${entry.path} — log file`);
}

const expectedReleaseDocs = [
  'docs/v0.16.0-beta-provider-browser-privacy-qa.md',
  'docs/v0.17.0-beta-state-migration.md',
  'docs/v0.18.0-beta-module-split.md',
  'docs/v0.19.0-beta-privacy-audit-hardening.md',
  'docs/v0.20.0-beta-ux-reliability-pass.md',
  'docs/v0.21.0-beta-project-workspace.md',
  'docs/v0.22.0-beta-analysis-template-system.md',
  'docs/v0.23.0-beta-advanced-quality-gate-v3.md',
  'docs/v0.24.0-beta-export-pack-v2.md',
  'docs/v0.25.0-beta-real-backend-provider-hardening.md',
  'docs/v0.26.0-beta-real-source-connector-prototype.md',
  'docs/v0.27.0-beta-web-search-provider-abstraction.md',
  'docs/v0.28.0-beta-real-portable-oauth-spike.md',
  'docs/v0.29.0-rc.1-release-candidate-freeze.md',
  'docs/v1.0.0-ci-browser-validation.md',
  'docs/v1.0.0-public-beta-stable-research-engine.md',
  'docs/v1.0.1-patch-only-stabilization.md',
  'docs/v1.0.2-ux-stabilization-patch.md',
  'docs/v1.0.3-screen-discipline-patch.md',
  'docs/v1.0.4-browser-qa-visual-regression-hardening.md',
  'docs/v1.0.5-onboarding-first-run-success.md',
  'docs/v1.0.6-documentation-release-packaging-cleanup.md'
];

const actualReleaseDocs = [...allPaths]
  .filter((file) => /^docs\/v\d+\.\d+\.\d+/.test(file))
  .sort();

for (const expected of expectedReleaseDocs) {
  if (!allPaths.has(expected)) failures.push(`RESTORE ${expected} — expected versioned release document missing`);
}

const unexpectedReleaseDocs = actualReleaseDocs.filter((file) => !expectedReleaseDocs.includes(file));
for (const file of unexpectedReleaseDocs) failures.push(`REVIEW ${file} — unexpected versioned release document`);

if (failures.length) {
  console.error('Repository file hygiene check failed. Required actions:');
  for (const failure of failures) console.error(`- ${failure}`);
  assert.fail(`${failures.length} repository hygiene issue(s) found`);
}

console.log('Repository file hygiene checks passed.');
process.exit(0);
