import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const read = (file) => fs.readFileSync(file, 'utf8');
const json = (file) => JSON.parse(read(file));

const pkg = json('package.json');
const index = read('index.html');
const readme = read('README.md');
const changelog = read('CHANGELOG.md');
const manifest = read('RELEASE_MANIFEST.md');
const releaseIgnore = read('.releaseignore');
const roadmap = read('docs/roadmap.md');
const qaMatrix = read('docs/qa-matrix.md');
const schema = json('schema/research-workflow.schema.json');
const fixture = json('fixtures/research/sample-research-workflow-en.json');
const migrationFixture = json('fixtures/migrations/v1.0.6-packet.json');
const privacyFixture = json('fixtures/privacy/browser-generated-export-v1.0.6.json');

assert.equal(pkg.version, '1.0.6');
assert.ok(pkg.description.includes('documentation and release packaging cleanup patch'));
assert.ok(index.includes('name="app-version" content="1.0.6"'));
assert.ok(index.includes('v1.0.6 · Documentation + Release Packaging Cleanup'));
assert.equal(schema.properties.workflow_version.const, '1.0.6');
assert.equal(fixture.workflow_version, '1.0.6');
assert.equal(migrationFixture.workflow_version, '1.0.6');
assert.equal(privacyFixture.workflow_version, '1.0.6');
assert.equal(privacyFixture.privacy_export.release_gate, 'pass');
assert.equal(privacyFixture.privacy_export.raw_token_exported, false);
assert.equal(privacyFixture.privacy_export.key_exported, false);

for (const file of [
  'README.md',
  'CHANGELOG.md',
  'RELEASE_MANIFEST.md',
  'docs/v1.0.6-documentation-release-packaging-cleanup.md',
  'tests/release-packaging-cleanup-check.mjs',
  'tests/v106-no-browser-suite.mjs',
  'tests/repo-file-hygiene-check.mjs',
  'docs/repo-cleanup-audit-v1.0.6.md',
  '.releaseignore'
]) {
  assert.ok(fs.existsSync(file), `missing release cleanup file: ${file}`);
}
assert.equal(fs.existsSync('docs/v1.0.5-browser-qa-visual-regression-hardening.md'), false, 'duplicate/misnamed v1.0.5 browser-QA doc must be removed');

const expectedDocHeadings = new Map([
  ['docs/v1.0.0-public-beta-stable-research-engine.md', '# v1.0.0 — Public Beta / Stable Research Engine'],
  ['docs/v1.0.1-patch-only-stabilization.md', '# v1.0.1 — Patch-only Stabilization'],
  ['docs/v1.0.2-ux-stabilization-patch.md', '# v1.0.2 — UX Stabilization Patch'],
  ['docs/v1.0.3-screen-discipline-patch.md', '# v1.0.3 — Screen Discipline Patch'],
  ['docs/v1.0.4-browser-qa-visual-regression-hardening.md', '# v1.0.4 — Browser QA + Visual Regression Hardening'],
  ['docs/v1.0.5-onboarding-first-run-success.md', '# v1.0.5 — Onboarding + First-Run Success'],
  ['docs/v1.0.6-documentation-release-packaging-cleanup.md', '# v1.0.6 — Documentation + Release Packaging Cleanup']
]);
for (const [file, heading] of expectedDocHeadings) {
  assert.equal(read(file).split('\n')[0], heading, `${file} heading drifted`);
}

const forbiddenHistoricalDrift = [
  'v1.0.5 — Advanced Quality Gate v3',
  'v1.0.5 — Real Source Connector Prototype',
  'v1.0.5 — Web Search Provider Abstraction',
  'v1.0.5 — Real Portable OAuth Spike',
  'v1.0.5 — Public Beta / Stable Research Engine',
  'v1.0.5 — Patch-only Stabilization',
  'v1.0.5 — UX Stabilization Patch',
  'v1.0.5 — Screen Discipline Patch',
  'v1.0.5 — Browser QA + Visual Regression Hardening'
];
const docsCorpus = [readme, changelog, roadmap, qaMatrix, ...[...expectedDocHeadings.keys()].map(read)].join('\n');
for (const token of forbiddenHistoricalDrift) {
  assert.equal(docsCorpus.includes(token), false, `stale historical release label remains: ${token}`);
}

for (const token of [
  'v1.0.6 — Documentation + Release Packaging Cleanup',
  'v1.0.5 — Onboarding + First-Run Success',
  'v1.0.4 — Browser QA + Visual Regression Hardening',
  'v1.0.3 — Screen Discipline Patch',
  'v1.0.2 — UX Stabilization Patch',
  'v1.0.1 — Patch-only Stabilization',
  'v1.0.0 — Public Beta / Stable Research Engine',
  'v0.29.0-rc.1 — Release Candidate Freeze',
  'v0.28.0-beta — Real Portable OAuth Spike',
  'v0.27.0-beta — Web Search Provider Abstraction',
  'v0.26.0-beta — Real Source Connector Prototype',
  'v0.25.0-beta — Real Backend Provider Hardening',
  'v0.24.0-beta — Export Pack v2',
  'v0.23.0-beta — Advanced Quality Gate v3'
]) {
  assert.ok(docsCorpus.includes(token), `release history map missing ${token}`);
}

for (const token of ['node_modules/','playwright-report/','test-results/','*.zip','backend/.dev.vars']) {
  assert.ok(releaseIgnore.includes(token), `.releaseignore missing ${token}`);
}
for (const token of ['Package: `jarbou3i-research-engine`','Version: `1.0.6`','Runtime capability change: no','Required browser gates before publishing','Release archive exclusions']) {
  assert.ok(manifest.includes(token), `release manifest missing ${token}`);
}

for (const script of ['test:release-packaging','test:repo:hygiene','test:v106:no-browser','test:v106']) {
  assert.ok(pkg.scripts[script], `missing package script ${script}`);
}
assert.ok(pkg.scripts['test:patch'].includes('release-packaging-cleanup-check.mjs'));
assert.ok(pkg.scripts['test:stable'].includes('release-packaging-cleanup-check.mjs'));

const rootFiles = fs.readdirSync('.').filter((name) => name.endsWith('.zip') || name === 'node_modules' || name === 'playwright-report' || name === 'test-results');
assert.deepEqual(rootFiles, [], `release tree contains generated archive/dependency/test-output artifacts: ${rootFiles.join(', ')}`);

for (const orphan of ['scripts/XXKuyryP','src/XXSyA2D3']) {
  assert.equal(fs.existsSync(orphan), false, `orphan temporary file must not ship: ${orphan}`);
}

console.log('Release packaging cleanup checks passed.');
process.exit(0);
