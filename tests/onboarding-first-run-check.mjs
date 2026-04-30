import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const index = fs.readFileSync('index.html', 'utf8');
const engine = fs.readFileSync('src/research-engine.js', 'utf8');
const stateStore = fs.readFileSync('src/research/state-store.js', 'utf8');
const schema = JSON.parse(fs.readFileSync('schema/research-workflow.schema.json', 'utf8'));
const fixture = JSON.parse(fs.readFileSync('fixtures/research/sample-research-workflow-en.json', 'utf8'));
const docs = fs.existsSync('docs/v1.0.5-onboarding-first-run-success.md') ? fs.readFileSync('docs/v1.0.5-onboarding-first-run-success.md', 'utf8') : '';

const sandbox = { window: {}, console };
sandbox.window.Jarbou3iResearchModules = {};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('src/research/onboarding.js', 'utf8'), sandbox);
const onboarding = sandbox.window.Jarbou3iResearchModules.onboarding;

assert.equal(pkg.version, '1.0.6');
assert.equal(onboarding.VERSION, '1.0.6');
assert.equal(schema.properties.workflow_version.const, '1.0.6');
assert.ok(schema.required.includes('onboarding'), 'schema must require onboarding metadata');
assert.equal(schema.properties.onboarding.properties.onboarding_version.const, '1.0.6');
assert.ok(index.includes('id="firstRunPanel"'), 'first-run panel missing');
assert.ok(index.includes('id="startFirstRunBtn"'), 'guided start action missing');
assert.ok(index.includes('src="src/research/onboarding.js" defer'), 'onboarding module missing from index');
assert.ok(engine.includes('onboardingReport()'), 'research packet must include onboarding report');
assert.ok(engine.includes('renderOnboarding'), 'runtime must render onboarding guide');
assert.ok(stateStore.includes('onboarding:'), 'state store must persist onboarding state');

const emptyReport = onboarding.firstRunReport({ evidence: [], evidence_review_queue: [] }, onboarding.defaultOnboardingState({ version:'1.0.6', now:'2026-04-30T00:00:00.000Z' }), { version:'1.0.6', now:'2026-04-30T00:00:00.000Z' });
assert.equal(emptyReport.completion_rate < 100, true, 'empty first-run should not be complete');
assert.equal(emptyReport.next_step_id, 'topic');
const fullReport = onboarding.firstRunReport({ topic_defined:true, plan:{}, evidence:[{evidence_id:'E1'}], evidence_review_queue:[], quality_gate:{}, export_pack:{} }, onboarding.defaultOnboardingState({ version:'1.0.6', now:'2026-04-30T00:00:00.000Z' }), { version:'1.0.6', now:'2026-04-30T00:00:00.000Z' });
assert.equal(fullReport.completion_rate, 100);
assert.equal(fullReport.success_state, 'first_run_success');
assert.equal(fullReport.release_gate, 'first_run_success_checked');
assert.equal(fixture.onboarding.onboarding_version, '1.0.6');
assert.equal(fixture.onboarding.release_gate, 'first_run_success_checked');
assert.equal(fixture.onboarding.checklist.length >= 6, true);
assert.ok(docs.includes('Onboarding + First-Run Success'), 'v1.0.6 docs missing');

console.log('Onboarding first-run checks passed.');
process.exit(0);
