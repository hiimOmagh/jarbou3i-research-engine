import fs from 'node:fs';
import vm from 'node:vm';

const fail = (message) => {
  console.error(`Research workflow check failed: ${message}`);
  process.exit(1);
};
const read = (file) => fs.readFileSync(file, 'utf8');
const index = read('index.html');
const app = read('src/research-engine.js');
const schema = JSON.parse(read('schema/research-workflow.schema.json'));
const fixture = JSON.parse(read('fixtures/research/sample-research-workflow-en.json'));

try { new vm.Script(app, { filename: 'src/research-engine.js' }); } catch (error) { fail(`research JS syntax error: ${error.message}`); }

for (const id of ['researchLabPanel','generatePlanBtn','copyPlanPromptBtn','evClaim','addEvidenceBtn','cancelEvidenceEditBtn','exportWorkflowBtn','importWorkflowInput','addCausalLinkBtn','inferCausalLinksBtn','causalLinksOutput','compileBriefBtn','copySynthesisPromptBtn','analysisBriefOutput','validationDiagnosticsOutput','providerName','providerTask','runProviderTaskBtn','copyProviderPayloadBtn','exportRunLedgerBtn','clearRunLedgerBtn','providerRunOutput','providerDiagnosticsOutput','providerContractPreview','providerPromptPreview','previewProviderContractBtn','previewProviderPromptBtn','runProviderFixtureSuiteBtn','exportProviderDiagnosticsBtn','sourceConnector','sourceTask','buildSourceTaskBtn','copySourceRequestBtn','runSourceFixtureSuiteBtn','exportSourcePolicyBtn','sourcePlanningOutput','providerEndpoint','providerModel','providerApiKey','rememberProviderKey','enableLiveByok','validateProviderSettingsBtn','dryRunProviderRequestBtn','generateMockAnalysisBtn','runMockRepairBtn','runCritiqueBtn','researchQualityOutput']) {
  if (!index.includes(`id="${id}"`)) fail(`missing research UI id: ${id}`);
}
for (const token of ['buildResearchPlan','compileAnalysisBrief','buildSynthesisPrompt','buildSourceClusters','diagnosticReport','responseContract','buildProviderPayload','mockProviderResponse','runProviderTask','callOpenAICompatibleProvider','providerSafetyReport','providerIdentityReport','providerBillingPolicy','dryRunProviderResponse','validateProviderResponse','repairProviderResponse','response_validation','repair_trace','providerContractPreview','providerPromptPreview','providerDiagnostics','runProviderFixtureSuite','runSourceTask','runSourceFixtureSuite','source_policy','buildMockAnalysis','buildCritique','evidence_matrix','causal_links','analysis_brief','research_plan','Quality Gate v2']) {
  if (!app.includes(token) && !index.includes(token)) fail(`missing research workflow token: ${token}`);
}
if (schema.$schema !== 'https://json-schema.org/draft/2020-12/schema') fail('research schema must use draft 2020-12');
if (schema.properties?.workflow_version?.const !== '0.19.0-beta') fail('workflow_version const mismatch');
for (const key of ['workflow_version','research_plan','evidence_matrix','analysis_brief','diagnostics','provider_identity','provider_billing_policy','privacy_export','ai_runs','source_policy','source_diagnostics','source_fixture_report','source_requests','source_runs']) {
  if (!schema.required?.includes(key)) fail(`research schema must require ${key}`);
}
const plan = fixture.research_plan;
const evidence = fixture.evidence_matrix;
const causalLinks = fixture.causal_links;
if (fixture.workflow_version !== '0.19.0-beta') fail('fixture workflow version mismatch');
if (!plan || plan.plan_version !== '0.19.0-beta') fail('fixture missing alpha research plan');
if (!Array.isArray(plan.questions) || plan.questions.length < 3) fail('fixture needs at least three research questions');
if (!Array.isArray(plan.counter_evidence_targets) || !plan.counter_evidence_targets.length) fail('fixture needs counter-evidence targets');
if (!Array.isArray(plan.early_warning_indicators) || !plan.early_warning_indicators.length) fail('fixture needs early-warning indicators');
if (!Array.isArray(evidence) || !evidence.length) fail('fixture needs evidence matrix');
if (!Array.isArray(causalLinks) || !causalLinks.length) fail('fixture needs causal links');
if (!fixture.analysis_brief || fixture.analysis_brief.brief_version !== '0.19.0-beta') fail('fixture needs compiled analysis brief');
if (!Array.isArray(fixture.analysis_brief.source_clusters) || !fixture.analysis_brief.source_clusters.length) fail('fixture needs source clusters');
if (!fixture.diagnostics || fixture.diagnostics.diagnostics_version !== '0.19.0-beta') fail('fixture needs diagnostics');
for (const [idx, item] of evidence.entries()) {
  if (!/^E\d+$/.test(item.evidence_id || '')) fail(`evidence[${idx}] invalid evidence_id`);
  if (!item.claim) fail(`evidence[${idx}] missing claim`);
  if (!Array.isArray(item.supports)) fail(`evidence[${idx}] supports must be array`);
  if (!Array.isArray(item.contradicts)) fail(`evidence[${idx}] contradicts must be array`);
}

if (!fixture.provider_config || fixture.provider_config.allow_live !== false) fail('fixture needs safe provider_config');
if (!fixture.provider_identity || fixture.provider_identity.key_exported !== false || !fixture.provider_identity.auth_type) fail('fixture needs provider identity metadata');
if (!fixture.provider_billing_policy || !fixture.provider_billing_policy.billing_owner || !Array.isArray(fixture.provider_billing_policy.notes)) fail('fixture needs provider billing policy metadata');
if (!fixture.provider_validation || fixture.provider_validation.accepted !== true) fail('fixture needs accepted provider validation');
if (!fixture.repair_trace || fixture.repair_trace.attempted !== false) fail('fixture needs no-repair trace');
if (!fixture.provider_diagnostics || fixture.provider_diagnostics.key_exported !== false) fail('fixture needs provider diagnostics with key_exported false');
if (!fixture.provider_fixture_report || fixture.provider_fixture_report.fail_count !== 0) fail('fixture needs passing provider fixture report');
if (!fixture.privacy_export || fixture.privacy_export.guard_version !== '0.19.0-beta' || fixture.privacy_export.key_exported !== false || fixture.privacy_export.raw_token_exported !== false) fail('fixture needs privacy export guard metadata');

if (!fixture.source_policy || fixture.source_policy.live_fetching_enabled !== false || fixture.source_policy.verdict !== 'safe_planning_layer_only') fail('fixture needs planning-only source policy');
if (!fixture.source_diagnostics || fixture.source_diagnostics.live_fetching_enabled !== false) fail('fixture needs planning-only source diagnostics');
if (!fixture.source_fixture_report || fixture.source_fixture_report.fail_count !== 0 || fixture.source_fixture_report.live_fetching_performed !== false) fail('fixture needs passing source fixture report');
if (!Array.isArray(fixture.source_requests) || !fixture.source_requests.length || fixture.source_requests[0].live_fetching_enabled !== false) fail('fixture needs source request with live_fetching_enabled false');
if (!Array.isArray(fixture.source_runs) || !fixture.source_runs.length || fixture.source_runs[0].live_fetching_performed !== false) fail('fixture needs source run ledger with no live fetching');

if (!Array.isArray(fixture.ai_runs) || !fixture.ai_runs.length) fail('fixture needs provider run ledger');
if (!fixture.ai_runs.every((run) => run.run_version === '0.19.0-beta' && run.provider && run.task && run.response_contract && run.response_validation && run.repair_trace && run.provider_safety && run.provider_identity && run.provider_billing_policy)) fail('fixture provider runs need contracts, identity, billing, and safety metadata');

for (const [idx, link] of causalLinks.entries()) {
  if (!/^[A-Z]+\d+$/.test(link.from || '')) fail(`causal_links[${idx}] invalid from`);
  if (!/^[A-Z]+\d+$/.test(link.to || '')) fail(`causal_links[${idx}] invalid to`);
  if (!Array.isArray(link.evidence_ids) || !link.evidence_ids.length) fail(`causal_links[${idx}] needs evidence_ids`);
}

console.log('Research workflow checks passed.');
process.exit(0);
