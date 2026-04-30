import assert from 'node:assert/strict';
import fs from 'node:fs';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const schema = JSON.parse(fs.readFileSync('schema/research-workflow.schema.json', 'utf8'));
const fixture = JSON.parse(fs.readFileSync('fixtures/research/sample-research-workflow-en.json', 'utf8'));
const migrationFixture = JSON.parse(fs.readFileSync('fixtures/migrations/v1.0.1-packet.json', 'utf8'));
const migrations = fs.readFileSync('src/research/migrations.js', 'utf8');
const renderHelpers = fs.readFileSync('src/research/render-helpers.js', 'utf8');
const ciNoBrowser = fs.readFileSync('scripts/ci-no-browser.sh', 'utf8');
const v102 = fs.readFileSync('tests/v103-no-browser-suite.mjs', 'utf8');
const release = fs.readFileSync('src/research/release-candidate.js', 'utf8');

assert.equal(pkg.version, '1.0.5');
assert.equal(schema.properties.workflow_version.const, '1.0.5');
assert.equal(fixture.workflow_version, '1.0.5');
assert.equal(fixture.release_candidate.stable_release_version, '1.0.5');
assert.equal(migrationFixture.workflow_version, '1.0.1', 'v1.0.1 migration fixture must preserve the previous patch source version');
assert.ok(migrations.includes("'1.0.0','1.0.1','1.0.2','1.0.3','1.0.4','1.0.5'"), 'migrations must support v1.0.3 → v1.0.5');
assert.ok(ciNoBrowser.includes('tests/v105-no-browser-suite.mjs'), 'CI no-browser syntax gate must target v105 suite');
assert.ok(v102.includes('patch-stabilization-check.mjs'), 'v103 no-browser suite must include patch gate');
assert.ok(v102.includes('ux-stabilization-patch-check.mjs'), 'v103 no-browser suite must include UX stabilization gate');
assert.ok(pkg.scripts['test:patch'].includes('ux-stabilization-patch-check'), 'patch script must include UX stabilization gate');
assert.ok(renderHelpers.includes("alphaBadge:'v1.0.5 · Onboarding + First-Run Success'"), 'English stable badge must be fixed');
assert.ok(renderHelpers.includes('إصدار عام تجريبي / محرك بحث مستقر'), 'Arabic stable badge must be fixed');
assert.ok(renderHelpers.includes('Bêta publique / moteur stable'), 'French stable badge must be fixed');
assert.ok(release.includes("'patch_release'"), 'stable policy must allow patch_release work only after stable');
for (const forbidden of ['new_major_feature','new_live_provider','new_source_connector','oauth_production_enablement','secret_export_weakening']) {
  assert.ok(release.includes(forbidden), `release policy must keep blocked-work guard: ${forbidden}`);
}
assert.ok(pkg.scripts['test:stable'].includes('patch-stabilization-check'), 'test:stable must include patch stabilization gate');
assert.ok(pkg.scripts['test:v105:no-browser'].includes('v105-no-browser-suite'), 'package must expose v105 no-browser suite');

console.log('Patch-only stabilization checks passed.');
process.exit(0);
