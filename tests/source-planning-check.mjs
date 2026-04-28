import fs from 'node:fs';
import vm from 'node:vm';

const fail = (message) => {
  console.error(`Source planning check failed: ${message}`);
  process.exit(1);
};
const read = (file) => fs.readFileSync(file, 'utf8');

const sourceModule = read('src/research/source-connectors.js');
const index = read('index.html');
const researchApp = read('src/research-engine.js');
const schema = JSON.parse(read('schema/research-workflow.schema.json'));
const fixture = JSON.parse(read('fixtures/research/sample-research-workflow-en.json'));

try { new vm.Script(sourceModule, { filename: 'src/research/source-connectors.js' }); }
catch (error) { fail(`source-connectors syntax error: ${error.message}`); }

for (const token of [
  'SOURCE_CONNECTORS',
  'SOURCE_TASKS',
  'sourcePolicy',
  'buildSourceTaskRequest',
  'mockSourceTaskResponse',
  'sourceDiagnostics',
  'runSourceFixtureSuite'
]) {
  if (!sourceModule.includes(token)) fail(`source module missing token: ${token}`);
}
if (!index.includes('src="src/research/source-connectors.js" defer')) fail('source connectors module missing from index');
if (!index.includes('id="sourcePlanningOutput"')) fail('source planning UI output missing');
if (!index.includes('id="buildSourceTaskBtn"')) fail('source task button missing');
if (!researchApp.includes('runSourceTask')) fail('research app missing source task runner');
if (!researchApp.includes('source_policy')) fail('research packet missing source policy support');
if (!researchApp.includes('source_fixture_report')) fail('research packet missing source fixture support');
if (!researchApp.includes('sourcePlanningScore')) fail('quality gate missing source planning score');
if (schema.properties.workflow_version.const !== '0.14.0-beta') fail('schema workflow version mismatch');
for (const key of ['source_policy','source_diagnostics','source_fixture_report','source_requests','source_runs']) {
  if (!schema.required.includes(key)) fail(`research schema must require ${key}`);
  if (!schema.properties[key]) fail(`research schema missing property ${key}`);
}
for (const def of ['source_policy','source_request','source_diagnostics','source_fixture_report','source_run']) {
  if (!schema.$defs[def]) fail(`research schema missing definition ${def}`);
}
if (schema.$defs.source_policy.properties.live_fetching_enabled.const !== false) fail('source policy must enforce live_fetching_enabled=false');
if (fixture.workflow_version !== '0.14.0-beta') fail('fixture version mismatch');
if (!fixture.source_policy || fixture.source_policy.live_fetching_enabled !== false) fail('fixture source policy must be planning-only');
if (!Array.isArray(fixture.source_requests) || !fixture.source_requests.length) fail('fixture must include source_requests');
if (!fixture.source_fixture_report || fixture.source_fixture_report.fail_count !== 0) fail('fixture source fixture report must pass');
console.log('Source planning checks passed.');
process.exit(0);
