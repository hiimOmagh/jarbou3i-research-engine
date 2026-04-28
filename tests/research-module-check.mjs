import fs from 'node:fs';
import vm from 'node:vm';

const fail = (message) => {
  console.error(`Research module check failed: ${message}`);
  process.exit(1);
};
const read = (file) => fs.readFileSync(file, 'utf8');
const modules = ["src/research/render-helpers.js", "src/research/state-store.js", "src/research/evidence-controller.js", "src/research/evidence-review-controller.js", "src/research/provider-controller.js", "src/research/source-controller.js", "src/research/export-controller.js", "src/research/quality-gate.js", "src/research/prompt-builders.js", "src/research/provider-core.js", "src/research/provider-identity.js", "src/research/portable-account-mock.js", "src/research/privacy-export-guard.js", "src/research/privacy-audit.js", "src/research/migrations.js", "src/research/provider-fixtures.js", "src/research/mock-provider.js", "src/research/openai-compatible-provider.js", "src/research/backend-proxy-provider.js", "src/research/source-connectors.js", "src/research/source-import-adapter.js"];
for (const file of modules) {
  if (!fs.existsSync(file)) fail(`missing module: ${file}`);
  try { new vm.Script(read(file), { filename: file }); }
  catch (error) { fail(`${file} syntax error: ${error.message}`); }
}
const index = read('index.html');
const order = modules.map((file) => index.indexOf(`src="${file}" defer`));
if (order.some((pos) => pos < 0)) fail('one or more research modules are not loaded by index.html');
for (let i = 1; i < order.length; i += 1) {
  if (order[i] <= order[i - 1]) fail('research modules must load in dependency order');
}
const engine = read('src/research-engine.js');
for (const token of [
  'modules.renderHelpers',
  'modules.stateStore',
  'modules.evidenceController',
  'modules.exportController',
  'modules.qualityGate',
  'modules.providerController',
  'modules.sourceController',
  'modules.evidenceReviewController',
  'Jarbou3iResearchModules.prompts.buildPlanPrompt',
  'Jarbou3iResearchModules.providerCore.validateProviderResponse',
  'Jarbou3iResearchModules.providerIdentity.providerIdentity',
  'Jarbou3iResearchModules.portableAccountMock.status',
  'Jarbou3iResearchModules.providerFixtures.runContractFixtureSuite',
  'Jarbou3iResearchModules.mockProvider.response',
  'Jarbou3iResearchModules.openAICompatibleProvider.call',
  'Jarbou3iResearchModules.backendProxyProvider.call',
  'Jarbou3iResearchModules.sourceConnectors.buildSourceTaskRequest',
  'window.Jarbou3iResearchModules.sourceImportAdapter'
]) {
  if (!engine.includes(token)) fail(`research engine does not delegate to module token: ${token}`);
}
if (engine.length > 100000) fail(`research-engine.js remains too large after v0.19 module split: ${engine.length} bytes`);
console.log('Research module checks passed.');
process.exit(0);
