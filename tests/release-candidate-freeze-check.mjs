import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const releaseModule = fs.readFileSync('src/research/release-candidate.js', 'utf8');
const engine = fs.readFileSync('src/research-engine.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');
const schema = JSON.parse(fs.readFileSync('schema/research-workflow.schema.json', 'utf8'));
const fixture = JSON.parse(fs.readFileSync('fixtures/research/sample-research-workflow-en.json', 'utf8'));
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const migrationSource = fs.readFileSync('src/research/migrations.js', 'utf8');

const context = { console, window: {} };
context.globalThis = context;
context.window = context;
vm.createContext(context);
vm.runInContext(releaseModule, context, { filename: 'src/research/release-candidate.js' });
const rc = context.Jarbou3iResearchModules.releaseCandidate;

assert.equal(pkg.version, '0.29.0-rc.1');
assert.equal(rc.RELEASE_VERSION, '0.29.0-rc.1');
assert.equal(typeof rc.releaseCandidatePolicy, 'function');
assert.equal(typeof rc.buildReleaseCandidateReport, 'function');
assert.ok(index.includes('src="src/research/release-candidate.js" defer'), 'release candidate module must be loaded by index');
assert.ok(index.includes('v0.29.0-rc.1 · Release Candidate Freeze'), 'RC badge missing');
assert.ok(engine.includes('releaseCandidateReport'), 'research packet must include releaseCandidateReport()');
assert.ok(engine.includes('release_candidate'), 'research packet must export release_candidate metadata');
assert.ok(migrationSource.includes('0.28.0-beta'), 'v0.28 migration source must remain supported');
assert.ok(migrationSource.includes('0.29.0-rc.1'), 'v0.29 rc target must be supported');

const policy = rc.releaseCandidatePolicy({ version: '0.29.0-rc.1' });
assert.equal(policy.feature_freeze, true);
assert.equal(policy.breaking_changes_allowed, false);
assert.equal(policy.production_oauth_allowed, false);
assert.equal(policy.new_live_connectors_allowed, false);
assert.equal(policy.export_privacy_regression_allowed, false);
assert.ok(policy.required_gates.includes('test:privacy'));
assert.ok(policy.required_gates.includes('test:browser:provider'));
assert.ok(policy.blocked_work.includes('new_major_feature'));
assert.ok(policy.allowed_work.includes('bugfix'));

const report = rc.buildReleaseCandidateReport({
  workflow_version: '0.29.0-rc.1',
  privacy_export: { release_gate: 'pass', raw_token_exported: false, access_token_exported: false, refresh_token_exported: false },
  portable_oauth_spike: { raw_token_exported: false, access_token_exported: false, refresh_token_exported: false, code_verifier_exported: false, safety_verdict: 'oauth_dev_disconnected_token_state_cleared' },
  search_policy: { live_search_enabled: false, verdict: 'web_search_abstraction_ready_no_live_fetch' },
  provider_config: { allow_live: false }
}, { version: '0.29.0-rc.1' });
assert.equal(report.release_candidate_version, '0.29.0-rc.1');
assert.equal(report.policy.freeze_status, 'feature_freeze');
assert.equal(report.rc_ready, true);
assert.equal(report.verdict, 'rc_freeze_ready_for_ci');
assert.equal(report.blockers.length, 0);

const blocked = rc.buildReleaseCandidateReport({
  workflow_version: '0.29.0-rc.1',
  privacy_export: { release_gate: 'pass', raw_token_exported: false, access_token_exported: false, refresh_token_exported: false },
  portable_oauth_spike: { raw_token_exported: true, access_token_exported: false, refresh_token_exported: false, code_verifier_exported: false },
  search_policy: { live_search_enabled: true },
  provider_config: { allow_live: true }
}, { version: '0.29.0-rc.1' });
assert.equal(blocked.rc_ready, false);
assert.ok(blocked.blockers.includes('oauth_secret_export_risk'));
assert.ok(blocked.blockers.includes('web_search_live_enabled_during_rc'));
assert.ok(blocked.blockers.includes('provider_live_mode_enabled_in_export'));

assert.equal(schema.properties.workflow_version.const, '0.29.0-rc.1');
assert.ok(schema.required.includes('release_candidate'), 'schema must require release_candidate');
assert.equal(schema.$defs.release_candidate.properties.policy.properties.freeze_status.const, 'feature_freeze');
assert.equal(fixture.release_candidate.release_candidate_version, '0.29.0-rc.1');
assert.equal(fixture.release_candidate.policy.feature_freeze, true);
assert.equal(fixture.release_candidate.policy.breaking_changes_allowed, false);
assert.equal(fixture.release_candidate.policy.production_oauth_allowed, false);
assert.equal(fixture.release_candidate.policy.new_live_connectors_allowed, false);
assert.equal(fixture.release_candidate.policy.export_privacy_regression_allowed, false);
assert.equal(fixture.release_candidate.rc_ready, true);
assert.equal(pkg.scripts['test:rc'], 'node tests/release-candidate-freeze-check.mjs');
assert.ok(pkg.scripts['test:v029:no-browser'].includes('v029-rc1-no-browser-suite'));

console.log('Release candidate freeze checks passed.');
process.exit(0);
