import fs from 'node:fs';
import vm from 'node:vm';

const fail = (message) => {
  console.error(`Source import check failed: ${message}`);
  process.exit(1);
};
const read = (file) => fs.readFileSync(file, 'utf8');
const moduleText = read('src/research/source-import-adapter.js');
const index = read('index.html');
const researchApp = read('src/research-engine.js');
const schema = JSON.parse(read('schema/research-workflow.schema.json'));
const fixture = JSON.parse(read('fixtures/research/sample-research-workflow-en.json'));
try { new vm.Script(moduleText, { filename: 'src/research/source-import-adapter.js' }); }
catch (error) { fail(`source import adapter syntax error: ${error.message}`); }
const context = { window: { Jarbou3iResearchModules: {} }, URL };
context.global = context.window;
vm.createContext(context);
new vm.Script(moduleText).runInContext(context);
const adapter = context.window.Jarbou3iResearchModules.sourceImportAdapter;
if (!adapter) fail('sourceImportAdapter namespace missing');
for (const token of ['parseSourceImportText','previewSourceImport','inferFormat','inferSourceType']) {
  if (typeof adapter[token] !== 'function') fail(`adapter missing function: ${token}`);
}
const sample = read('fixtures/research/source-import-sample.txt');
const parsed = adapter.parseSourceImportText(sample, { format: 'auto' });
if (!parsed.ok) fail('sample import should be ok');
if (parsed.report.live_fetching_performed !== false) fail('source import must not perform live fetching');
if (parsed.report.verification_claimed !== false) fail('source import must not claim verification');
if (parsed.evidence.length < 3) fail('sample import should produce at least 3 evidence items');
if (!parsed.evidence.some((e) => e.source_url)) fail('imported evidence should include URLs');
if (!parsed.evidence.every((e) => Array.isArray(e.supports) && Array.isArray(e.contradicts))) fail('imported evidence needs supports/contradicts arrays');
if (!index.includes('src="src/research/source-import-adapter.js" defer')) fail('source import adapter module missing from index');
for (const id of ['sourceImportText','previewSourceImportBtn','importSourceEvidenceBtn','sourceImportOutput']) {
  if (!index.includes(`id="${id}"`)) fail(`source import UI missing ${id}`);
}
for (const token of ['previewSourceImport','importSourceEvidence','source_import_report','source_imports','sourceImportScore','queueImportedEvidence','evidence_review_queue']) {
  if (!researchApp.includes(token)) fail(`research app missing token: ${token}`);
}
if (!schema.required.includes('source_imports')) fail('schema must require source_imports');
if (!schema.required.includes('source_import_report')) fail('schema must require source_import_report');
if (!schema.$defs.source_import) fail('schema missing source_import definition');
if (!schema.$defs.source_import_report) fail('schema missing source_import_report definition');
if (schema.$defs.source_import_report.properties.live_fetching_performed.const !== false) fail('import report must force live_fetching_performed=false');
if (schema.$defs.source_import_report.properties.verification_claimed.const !== false) fail('import report must force verification_claimed=false');
if (fixture.workflow_version !== '1.0.5') fail('research fixture version mismatch');
if (!fixture.source_import_report || fixture.source_import_report.live_fetching_performed !== false) fail('fixture import report missing or unsafe');
if (!Array.isArray(fixture.source_imports) || !fixture.source_imports.length) fail('fixture source_imports missing');
if (!fixture.source_imports.some((item) => item.queue_only === true)) fail('source imports should be queue_only in v0.14');
console.log('Source import checks passed.');
process.exit(0);
