/* Jarbou3i Research Engine provider fixtures v0.18.0-beta. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};

  const minimalStrategicAnalysis = {
    schema_version:'1.1.0',
    analysis_id:'FIXTURE-SYNTHESIS-1',
    subject:{title:'Fixture strategic analysis', context:'Provider contract fixture', question:'Can provider validation accept schema-shaped output?', executive_thesis:'Fixture output contains all core model layers.'},
    interests:[{id:'I1', name:'Fixture interest', type:'strategic', intensity:3, horizon:'medium', stakes:'important', confidence:'medium', observation:'Fixture observation.', inference:'Fixture inference.', estimate:'Fixture estimate.'}],
    actors:[{id:'A1', name:'Fixture actor', category:'state', financial_power:3, decision_access:3, disruption_capacity:3, media_influence:3, confidence:'medium', role:'Fixture role.'}],
    tools:[{id:'T1', name:'Fixture tool', type:'diplomatic', severity:2, cost:2, risk:2, speed:3, reversibility:4, deniability:2, intent_signal:'Fixture signal.', constraint_signal:'Fixture constraint.'}],
    narrative:[{id:'N1', frame:'Fixture narrative', coherence:3, media_alignment:3, public_acceptance:3, mechanism:'Fixture mechanism.', legitimacy_function:'Fixture legitimacy function.'}],
    results:[{id:'R1', name:'Fixture result', type:'direct', observable_indicator:'Fixture indicator.', goal_achievement_pct:50, cost_benefit:'uncertain', power_shift_impact:'limited'}],
    feedback:[{id:'F1', trigger:'Fixture trigger', adaptation:'Fixture adaptation.', speed:'slow', affected_layers:['interests']}],
    contradictions:{items:[]},
    scenarios:{items:[{id:'S1', name:'Fixture scenario', probability:0.5, conditions:['Fixture condition'], weakens_if:['Fixture weakener'], disproven_if:['Fixture falsifier']}]},
    evidence:{items:[{evidence_id:'E1', claim:'Fixture evidence claim.', basis:'source_based', source_title:'Fixture source', source_type:'official', source_date:'2026-01-01', evidence_strength:3, confidence:'medium', counter_evidence:'Fixture counter-evidence note.'}]}
  };

  const minimalPlan = {
    plan_version:'0.18.0-beta',
    topic:'Fixture research plan',
    context:'Contract fixture',
    questions:['What happened?','Who benefits?','What evidence would disconfirm the main thesis?'],
    target_actors:['A1 fixture actor'],
    target_sources:['official','academic','news'],
    keywords:['fixture','contract','validation'],
    counter_evidence_targets:['Evidence against the thesis'],
    early_warning_indicators:['New actor realignment']
  };

  function payload(task){
    const core = root.providerCore;
    return {
      request_version:'0.18.0-beta',
      provider:'fixture',
      provider_config:{endpoint:'fixture://local', model:'fixture-model', allow_live:false, remember_key:false},
      provider_safety:{provider:'fixture', key_exported:false, verdict:'fixture_safe'},
      task,
      language:'en',
      created_at:'2026-04-28T00:00:00.000Z',
      privacy_mode:'local_or_dry_run',
      response_contract: core ? core.responseContract(task) : {type:task, required:[]},
      input_fingerprint:'hfixture',
      prompt:'Fixture prompt',
      packet:{workflow_version:'0.18.0-beta'}
    };
  }

  function contractFixtures(){
    return [
      {
        fixture_id:'valid_plan',
        task:'plan',
        expected:'accepted',
        response:{ok:true, type:'research_plan', data:minimalPlan, warnings:[]}
      },
      {
        fixture_id:'valid_synthesis',
        task:'synthesis',
        expected:'accepted',
        response:{ok:true, type:'strategic_analysis', data:minimalStrategicAnalysis, warnings:[]}
      },
      {
        fixture_id:'malformed_synthesis_missing_actors',
        task:'synthesis',
        expected:'rejected',
        response:{ok:true, type:'strategic_analysis', data:Object.assign({}, minimalStrategicAnalysis, {actors:[]}), warnings:[]}
      },
      {
        fixture_id:'noisy_plan_json',
        task:'plan',
        expected:'accepted_after_normalize',
        raw_text:'```json\n' + JSON.stringify(minimalPlan) + '\n```'
      },
      {
        fixture_id:'invalid_source_discipline_shape',
        task:'source_discipline',
        expected:'rejected',
        response:{ok:true, type:'source_discipline_report', data:{verdict:'review_required'}, warnings:[]}
      }
    ];
  }

  function normalizeFixtureResponse(fixture, core){
    if(fixture.raw_text){
      return {ok:true, type:core.responseContract(fixture.task).type, data:core.normalizeProviderTextResponse(fixture.raw_text), warnings:['Fixture raw text was normalized.']};
    }
    return fixture.response;
  }

  function runContractFixtureSuite(core = root.providerCore){
    const results = contractFixtures().map((fixture) => {
      const p = payload(fixture.task);
      const response = normalizeFixtureResponse(fixture, core);
      const validation = core.validateProviderResponse(p, response, {version:'0.18.0-beta', nowIso:()=>'2026-04-28T00:00:00.000Z'});
      const expectedAccepted = fixture.expected === 'accepted' || fixture.expected === 'accepted_after_normalize';
      const pass = expectedAccepted ? validation.accepted : !validation.accepted;
      return {
        fixture_id: fixture.fixture_id,
        task: fixture.task,
        expected: fixture.expected,
        accepted: validation.accepted,
        issue_count: validation.issue_count,
        issues: validation.issues,
        pass
      };
    });
    return {
      suite_version:'0.18.0-beta',
      fixture_count: results.length,
      pass_count: results.filter(item => item.pass).length,
      fail_count: results.filter(item => !item.pass).length,
      results
    };
  }

  root.providerFixtures = {minimalStrategicAnalysis, minimalPlan, contractFixtures, runContractFixtureSuite};
})(window);
