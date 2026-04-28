import fs from 'node:fs';
import vm from 'node:vm';

const fail = (message) => {
  console.error(`Provider fixture check failed: ${message}`);
  process.exit(1);
};
const read = (file) => fs.readFileSync(file, 'utf8');

const context = { window: {} };
vm.createContext(context);
for (const file of ['src/research/provider-core.js', 'src/research/provider-fixtures.js']) {
  try { vm.runInContext(read(file), context, { filename: file }); }
  catch (error) { fail(`${file} failed to load: ${error.message}`); }
}
const core = context.window.Jarbou3iResearchModules?.providerCore;
const fixtureModule = context.window.Jarbou3iResearchModules?.providerFixtures;
if (!core) fail('providerCore module missing');
if (!fixtureModule) fail('providerFixtures module missing');

const fixtureDir = 'fixtures/provider';
if (!fs.existsSync(fixtureDir)) fail('fixtures/provider directory missing');
const files = fs.readdirSync(fixtureDir).filter((file) => file.endsWith('.json')).sort();
if (files.length < 5) fail('expected at least five provider contract fixtures');

const payload = (task) => ({
  task,
  response_contract: core.responseContract(task),
  provider: 'fixture',
  provider_config: { endpoint: 'fixture://local', model: 'fixture-model', allow_live: false, remember_key: false }
});

for (const file of files) {
  const fixture = JSON.parse(read(`${fixtureDir}/${file}`));
  if (!fixture.task || !fixture.expected) fail(`${file} missing task/expected`);
  let response = fixture.response;
  if (fixture.raw_text) {
    response = { ok: true, type: core.responseContract(fixture.task).type, data: core.normalizeProviderTextResponse(fixture.raw_text), warnings: [] };
  }
  const validation = core.validateProviderResponse(payload(fixture.task), response, { version: '0.22.0-beta', nowIso: () => '2026-04-28T00:00:00.000Z' });
  if ((fixture.expected === 'accepted' || fixture.expected === 'accepted_after_normalize') && !validation.accepted) {
    fail(`${file} should be accepted, got ${validation.issues.join(', ')}`);
  }
  if (fixture.expected === 'rejected' && validation.accepted) {
    fail(`${file} should be rejected`);
  }
}

const report = fixtureModule.runContractFixtureSuite(core);
if (report.suite_version !== '0.22.0-beta') fail('fixture suite version mismatch');
if (report.fixture_count < 5) fail('fixture suite did not run enough fixtures');
if (report.fail_count !== 0) fail(`fixture suite reported failures: ${report.fail_count}`);
for (const result of report.results) {
  if (!result.fixture_id || !result.task || typeof result.pass !== 'boolean') fail('fixture result shape invalid');
}
const synthesis = core.responseContract('synthesis');
for (const key of ['title', 'purpose', 'required', 'recommended', 'reject_if', 'diagnostic_hints', 'example_shape']) {
  if (!(key in synthesis)) fail(`synthesis contract missing preview key: ${key}`);
}

console.log('Provider fixture checks passed.');
process.exit(0);
