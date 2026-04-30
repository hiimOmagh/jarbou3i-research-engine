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
const release = context.Jarbou3iResearchModules.releaseCandidate;

assert.equal(pkg.version, '1.0.5');
assert.equal(release.RELEASE_VERSION, '1.0.5');
assert.equal(typeof release.releaseCandidatePolicy, 'function');
assert.equal(typeof release.buildReleaseCandidateReport, 'function');
assert.ok(index.includes('src="src/research/release-candidate.js" defer'), 'release metadata module must be loaded by index');
assert.ok(index.includes('v1.0.5 · Onboarding + First-Run Success'), 'stable badge missing');
assert.ok(engine.includes('releaseCandidateReport'), 'research packet must include releaseCandidateReport()');
assert.ok(engine.includes('release_candidate'), 'research packet must export release metadata');
assert.ok(migrationSource.includes('0.29.0-rc.1'), 'v0.29 rc migration source must remain supported');
assert.ok(migrationSource.includes('1.0.5'), 'v1.0.5 target must be supported');

const policy = release.releaseCandidatePolicy({ version: '1.0.5' });
assert.equal(policy.release_stage, 'public_beta_stable');
assert.equal(policy.freeze_status, 'stable_feature_baseline');
assert.equal(policy.feature_freeze, true);
assert.equal(policy.breaking_changes_allowed, false);
assert.equal(policy.production_oauth_allowed, false);
assert.equal(policy.new_live_connectors_allowed, false);
assert.equal(policy.export_privacy_regression_allowed, false);
assert.equal(policy.ci_validation_required, true);
assert.equal(policy.browser_validation_required, true);
assert.ok(policy.required_gates.includes('test:browser'));
assert.ok(policy.required_gates.includes('test:browser:provider'));
assert.ok(policy.blocked_work.includes('secret_export_weakening'));
assert.ok(policy.allowed_work.includes('patch_release'));

const report = release.buildReleaseCandidateReport({
  workflow_version: '1.0.5',
  privacy_export: { release_gate: 'pass', raw_token_exported: false, access_token_exported: false, refresh_token_exported: false },
  portable_oauth_spike: { raw_token_exported: false, access_token_exported: false, refresh_token_exported: false, code_verifier_exported: false, safety_verdict: 'oauth_dev_disconnected_token_state_cleared' },
  search_policy: { live_search_enabled: false, verdict: 'web_search_abstraction_ready_no_live_fetch' },
  provider_config: { allow_live: false },
  ci_validation: { full_browser_passed: true, browser_provider_passed: true }
}, { version: '1.0.5', externalCiPassed: true, externalCiNotes: 'external CI succeeded' });
assert.equal(report.release_candidate_version, '1.0.5');
assert.equal(report.stable_release_version, '1.0.5');
assert.equal(report.policy.release_stage, 'public_beta_stable');
assert.equal(report.policy.freeze_status, 'stable_feature_baseline');
assert.equal(report.rc_ready, true);
assert.equal(report.stable_ready, true);
assert.equal(report.verdict, 'public_beta_stable_ready');
assert.equal(report.blockers.length, 0);

const blocked = release.buildReleaseCandidateReport({
  workflow_version: '1.0.5',
  privacy_export: { release_gate: 'pass', raw_token_exported: false, access_token_exported: false, refresh_token_exported: false },
  portable_oauth_spike: { raw_token_exported: true, access_token_exported: false, refresh_token_exported: false, code_verifier_exported: false },
  search_policy: { live_search_enabled: true },
  provider_config: { allow_live: true }
}, { version: '1.0.5' });
assert.equal(blocked.stable_ready, false);
assert.ok(blocked.blockers.includes('oauth_secret_export_risk'));
assert.ok(blocked.blockers.includes('web_search_live_enabled_during_public_beta'));
assert.ok(blocked.blockers.includes('provider_live_mode_enabled_in_export'));

assert.equal(schema.properties.workflow_version.const, '1.0.5');
assert.ok(schema.required.includes('release_candidate'), 'schema must require release metadata');
assert.equal(schema.$defs.release_candidate.properties.policy.properties.release_stage.const, 'public_beta_stable');
assert.equal(schema.$defs.release_candidate.properties.policy.properties.freeze_status.const, 'stable_feature_baseline');
assert.equal(schema.$defs.release_candidate.properties.policy.properties.verdict.const, 'public_beta_stable_release_active');
assert.equal(fixture.workflow_version, '1.0.5');
assert.equal(fixture.release_candidate.release_candidate_version, '1.0.5');
assert.equal(fixture.release_candidate.stable_release_version, '1.0.5');
assert.equal(fixture.release_candidate.policy.release_stage, 'public_beta_stable');
assert.equal(fixture.release_candidate.policy.breaking_changes_allowed, false);
assert.equal(fixture.release_candidate.policy.production_oauth_allowed, false);
assert.equal(fixture.release_candidate.policy.new_live_connectors_allowed, false);
assert.equal(fixture.release_candidate.policy.export_privacy_regression_allowed, false);
assert.equal(fixture.release_candidate.stable_ready, true);
assert.equal(fixture.ci_validation.full_browser_passed, true);
assert.ok(pkg.scripts['test:stable'].includes('stable-release-check.mjs'));
assert.ok(pkg.scripts['test:v102:no-browser'].includes('v102-no-browser-suite'));
assert.ok(pkg.scripts['test:patch'].includes('patch-stabilization-check'));
assert.ok(fs.readFileSync('src/research/render-helpers.js','utf8').includes('v1.0.5 · Onboarding + First-Run Success'), 'render helper stable badge must not regress to RC copy');

console.log('Stable release checks passed.');
process.exit(0);
