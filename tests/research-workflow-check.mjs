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

for (const id of ['researchLabPanel','generatePlanBtn','copyPlanPromptBtn','evClaim','addEvidenceBtn','cancelEvidenceEditBtn','exportWorkflowBtn','importWorkflowInput','addCausalLinkBtn','inferCausalLinksBtn','causalLinksOutput','generateMockAnalysisBtn','runMockRepairBtn','runCritiqueBtn','researchQualityOutput']) {
  if (!index.includes(`id="${id}"`)) fail(`missing research UI id: ${id}`);
}
for (const token of ['buildResearchPlan','buildMockAnalysis','buildCritique','evidence_matrix','causal_links','research_plan','Quality Gate v2']) {
  if (!app.includes(token) && !index.includes(token)) fail(`missing research workflow token: ${token}`);
}
if (schema.$schema !== 'https://json-schema.org/draft/2020-12/schema') fail('research schema must use draft 2020-12');
if (schema.properties?.workflow_version?.const !== '0.2.0-alpha') fail('workflow_version const mismatch');
for (const key of ['workflow_version','research_plan','evidence_matrix']) {
  if (!schema.required?.includes(key)) fail(`research schema must require ${key}`);
}
const plan = fixture.research_plan;
const evidence = fixture.evidence_matrix;
const causalLinks = fixture.causal_links;
if (fixture.workflow_version !== '0.2.0-alpha') fail('fixture workflow version mismatch');
if (!plan || plan.plan_version !== '0.2.0-alpha') fail('fixture missing alpha research plan');
if (!Array.isArray(plan.questions) || plan.questions.length < 3) fail('fixture needs at least three research questions');
if (!Array.isArray(plan.counter_evidence_targets) || !plan.counter_evidence_targets.length) fail('fixture needs counter-evidence targets');
if (!Array.isArray(plan.early_warning_indicators) || !plan.early_warning_indicators.length) fail('fixture needs early-warning indicators');
if (!Array.isArray(evidence) || !evidence.length) fail('fixture needs evidence matrix');
if (!Array.isArray(causalLinks) || !causalLinks.length) fail('fixture needs causal links');
for (const [idx, item] of evidence.entries()) {
  if (!/^E\d+$/.test(item.evidence_id || '')) fail(`evidence[${idx}] invalid evidence_id`);
  if (!item.claim) fail(`evidence[${idx}] missing claim`);
  if (!Array.isArray(item.supports)) fail(`evidence[${idx}] supports must be array`);
  if (!Array.isArray(item.contradicts)) fail(`evidence[${idx}] contradicts must be array`);
}

for (const [idx, link] of causalLinks.entries()) {
  if (!/^[A-Z]+\d+$/.test(link.from || '')) fail(`causal_links[${idx}] invalid from`);
  if (!/^[A-Z]+\d+$/.test(link.to || '')) fail(`causal_links[${idx}] invalid to`);
  if (!Array.isArray(link.evidence_ids) || !link.evidence_ids.length) fail(`causal_links[${idx}] needs evidence_ids`);
}

console.log('Research workflow checks passed.');
process.exit(0);
