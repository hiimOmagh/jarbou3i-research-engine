import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('src/research/analysis-templates.js', 'utf8');
new vm.Script(source, { filename: 'src/research/analysis-templates.js' });
const context = { console, window: {} };
context.globalThis = context;
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'src/research/analysis-templates.js' });
const templates = context.Jarbou3iResearchModules.analysisTemplates;

assert.equal(templates.VERSION, '0.25.0-beta');
assert.equal(templates.DEFAULT_TEMPLATE_ID, 'strategic_analysis_engine');
assert.equal(typeof templates.listTemplates, 'function');
assert.equal(typeof templates.applyToPlan, 'function');
assert.equal(typeof templates.templateFitReport, 'function');

const list = templates.listTemplates();
assert.ok(list.length >= 7, 'template registry should expose the initial template set');
for (const id of ['strategic_analysis_engine','geopolitical_event_analysis','policy_impact_analysis','market_technology_trend_analysis','actor_incentive_map','contradiction_audit','scenario_forecast']) {
  const profile = templates.profile(id);
  assert.equal(profile.template_id, id);
  assert.equal(profile.template_version, '0.25.0-beta');
  assert.ok(profile.description.length > 20, `${id} needs useful description`);
  assert.ok(profile.output_focus.length > 2, `${id} needs output focus`);
  assert.ok(profile.required_layers.length > 2, `${id} needs required layers`);
  assert.ok(profile.prompt_directives.length > 1, `${id} needs prompt directives`);
}

const basePlan = { questions:['Base question'], target_sources:['official statements'], counter_evidence_targets:['base counter'], early_warning_indicators:['base indicator'] };
const policyPlan = templates.applyToPlan(basePlan, 'policy_impact_analysis');
assert.equal(policyPlan.analysis_template_id, 'policy_impact_analysis');
assert.equal(policyPlan.analysis_template_name, 'Policy Impact Analysis');
assert.ok(policyPlan.questions.some((q) => q.includes('policy')));
assert.ok(policyPlan.template_directives.some((d) => d.includes('implementation')));
assert.ok(policyPlan.required_layers.includes('contradictions'));

const fit = templates.templateFitReport({
  analysis_template_id:'scenario_forecast',
  evidence:[{supports:['I1','A1'], contradicts:['S1']}],
  causal_links:[{from:'T1', to:'R1'}, {from:'R1', to:'F1'}]
}, 'scenario_forecast');
assert.equal(fit.template_id, 'scenario_forecast');
assert.equal(fit.fit_version, '0.25.0-beta');
assert.ok(fit.fit_score > 50, 'scenario fixture should cover most required layers');
assert.ok(fit.missing_layers.length < fit.required_layers.length, 'fit report should identify partial coverage');

const index = fs.readFileSync('index.html', 'utf8');
const engine = fs.readFileSync('src/research-engine.js', 'utf8');
const schema = JSON.parse(fs.readFileSync('schema/research-workflow.schema.json', 'utf8'));
const fixture = JSON.parse(fs.readFileSync('fixtures/research/sample-research-workflow-en.json', 'utf8'));
assert.ok(index.includes('id="analysisTemplateSelect"'), 'template selector UI missing');
assert.ok(index.includes('src="src/research/analysis-templates.js" defer'), 'template module load missing');
assert.ok(engine.includes('modules.analysisTemplates'), 'engine should use analysis template module');
assert.ok(engine.includes('activeTemplateProfile'), 'engine should expose active template profile');
assert.ok(schema.required.includes('analysis_template'), 'workflow schema should require analysis_template');
assert.ok(schema.$defs.analysis_template, 'workflow schema should define analysis_template');
assert.equal(fixture.analysis_template.template_id, 'strategic_analysis_engine');
assert.equal(fixture.analysis_brief.analysis_template.template_id, fixture.analysis_template.template_id);
assert.equal(fixture.analysis_brief.template_fit_report.fit_version, '0.25.0-beta');

console.log('Analysis template checks passed.');
process.exit(0);
