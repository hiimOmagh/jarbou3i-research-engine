import fs from 'node:fs';

const fail = (message) => {
  console.error(`Provider response check failed: ${message}`);
  process.exit(1);
};
const read = (file) => fs.readFileSync(file, 'utf8');
const app = read('src/research-engine.js') + read('src/research/provider-core.js') + read('src/research/provider-fixtures.js') + read('src/research/mock-provider.js') + read('src/research/openai-compatible-provider.js');
const schema = JSON.parse(read('schema/research-workflow.schema.json'));
const fixture = JSON.parse(read('fixtures/research/sample-research-workflow-en.json'));

for (const token of [
  'normalizeProviderTextResponse',
  'validateProviderResponse',
  'repairProviderResponse',
  'validationSummary',
  'response_validation',
  'repair_trace',
  'validation_error',
  'mock_provider_contract_fallback',
  'contractFixtures',
  'runContractFixtureSuite'
]) {
  if (!app.includes(token)) fail(`missing provider reliability token: ${token}`);
}
if (!schema.$defs?.response_validation) fail('schema missing response_validation definition');
if (!schema.$defs?.repair_trace) fail('schema missing repair_trace definition');
if (!schema.$defs?.provider_diagnostics) fail('schema missing provider_diagnostics definition');
if (!schema.$defs?.provider_fixture_report) fail('schema missing provider_fixture_report definition');
if (!schema.$defs?.ai_run?.required?.includes('response_validation')) fail('ai_run must require response_validation');
if (!schema.$defs?.ai_run?.required?.includes('repair_trace')) fail('ai_run must require repair_trace');
if (!schema.$defs?.ai_run?.properties?.status?.enum?.includes('validation_error')) fail('ai_run status must allow validation_error');
if (!schema.$defs?.ai_run?.properties?.status?.enum?.includes('repaired')) fail('ai_run status must allow repaired');

if (!fixture.provider_validation?.accepted) fail('fixture must include accepted top-level provider validation');
if (fixture.repair_trace?.attempted !== false) fail('fixture must include no-repair trace');
if (fixture.provider_diagnostics?.key_exported !== false) fail('fixture provider diagnostics must keep key_exported false');
if (fixture.provider_fixture_report?.fail_count !== 0) fail('fixture provider fixture report must pass');
for (const [idx, run] of fixture.ai_runs.entries()) {
  if (!run.response_validation) fail(`ai_runs[${idx}] missing response_validation`);
  if (!run.repair_trace) fail(`ai_runs[${idx}] missing repair_trace`);
  if (run.provider_safety?.key_exported !== false) fail(`ai_runs[${idx}] must keep key_exported false`);
}

console.log('Provider response checks passed.');
