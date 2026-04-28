/* Jarbou3i Research Engine analysis templates v0.24.0-beta. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};
  const VERSION = '0.24.0-beta';
  const DEFAULT_TEMPLATE_ID = 'strategic_analysis_engine';
  const TEMPLATE_REGISTRY = Object.freeze({
    strategic_analysis_engine: Object.freeze({
      template_id:'strategic_analysis_engine', template_version:VERSION, display_name:'Strategic Analysis Engine', short_name:'Strategic',
      description:'Default Interests → Actors → Tools → Narrative → Outcomes → Feedback model with evidence review discipline.',
      output_focus:['interests','actors','tools','narrative','outcomes','feedback','contradictions','scenarios'],
      required_layers:['interests','actors','tools','narrative','results','feedback'],
      plan_questions:['What interests dominate the system and what stakes do actors attach to them?','Which actors possess decision access, disruption capacity, or narrative influence?','Which tools reveal real constraints rather than public rhetoric?','Which feedback loops can reverse or amplify first-order outcomes?'],
      source_priorities:['official documents','credible chronology','expert analysis','counter-position sources'],
      counter_evidence_targets:['Evidence that the dominant strategic narrative is wrong or incomplete','Outcomes that contradict stated actor goals'],
      prompt_directives:['Use the full six-layer Jarbou3i model.','Separate observation, inference, and estimate.','Include falsifiable scenario conditions.'],
      quality_focus:['layer_coverage','causal_density','counter_evidence','source_diversity']
    }),
    geopolitical_event_analysis: Object.freeze({
      template_id:'geopolitical_event_analysis', template_version:VERSION, display_name:'Geopolitical Event Analysis', short_name:'Geopolitical',
      description:'Analyzes state power, alliances, geography, security dilemmas, escalation paths, and external constraints.',
      output_focus:['state_interests','alliances','military/economic tools','legitimacy narratives','regional spillovers','escalation feedback'],
      required_layers:['interests','actors','tools','narrative','results','feedback','scenarios'],
      plan_questions:['Which security, territorial, regime, or alliance interests shape actor behavior?','Which external powers constrain or enable the local actors?','Which tools create escalation, deterrence, coercion, or bargaining leverage?','Which regional spillovers or alliance feedback loops could reshape incentives?'],
      source_priorities:['official state statements','treaties or legal texts','defense/economic data','regional expert analysis','credible chronology'],
      counter_evidence_targets:['Evidence that material constraints dominate ideology or rhetoric','Evidence of alliance divergence or hidden bargaining limits'],
      prompt_directives:['Model geography, alliance structure, and escalation risk explicitly.','Separate declared interests from operational constraints.','Include regional and third-party feedback loops.'],
      quality_focus:['actor_coverage','tool_escalation','scenario_falsifiers','counter_evidence']
    }),
    policy_impact_analysis: Object.freeze({
      template_id:'policy_impact_analysis', template_version:VERSION, display_name:'Policy Impact Analysis', short_name:'Policy',
      description:'Assesses policy incentives, implementation capacity, distributional effects, stakeholder resistance, and unintended consequences.',
      output_focus:['policy_objectives','stakeholders','implementation_tools','public narrative','distributional outcomes','institutional feedback'],
      required_layers:['interests','actors','tools','narrative','results','feedback','contradictions'],
      plan_questions:['What problem does the policy claim to solve and who benefits materially or politically?','Which agencies, firms, unions, courts, or public groups can block or distort implementation?','Which implementation tools create compliance, capture, resistance, or evasion?','Which second-order distributional effects are likely after implementation?'],
      source_priorities:['law or draft bill text','budget data','regulatory guidance','stakeholder statements','implementation case studies'],
      counter_evidence_targets:['Evidence that implementation capacity is weaker than the policy narrative','Evidence that affected actors can evade or capture the policy'],
      prompt_directives:['Distinguish policy intent from implementation capacity.','Analyze winners, losers, veto points, and unintended consequences.','Include conditions that would disprove expected impact.'],
      quality_focus:['implementation_constraints','stakeholder_incentives','distributional_effects','failure_modes']
    }),
    market_technology_trend_analysis: Object.freeze({
      template_id:'market_technology_trend_analysis', template_version:VERSION, display_name:'Market / Technology Trend Analysis', short_name:'Market/Tech',
      description:'Maps adoption incentives, bottlenecks, platform power, investment signals, technical feasibility, and hype-risk.',
      output_focus:['market_interests','platform actors','technical/commercial tools','adoption narrative','market outcomes','adoption feedback'],
      required_layers:['interests','actors','tools','narrative','results','feedback','scenarios'],
      plan_questions:['Which cost, capability, regulation, or distribution incentives drive adoption?','Which incumbents, startups, platforms, suppliers, or regulators control bottlenecks?','Which technical constraints or complements determine whether the trend scales?','Which adoption feedback loops could create hype collapse or compounding advantage?'],
      source_priorities:['primary company filings','technical documentation','market data','developer/user signals','regulatory documents'],
      counter_evidence_targets:['Evidence that adoption is concentrated in demos rather than production use','Evidence that bottlenecks or regulation cap the trend'],
      prompt_directives:['Separate technical feasibility from commercial adoption.','Identify bottlenecks, complements, switching costs, and platform leverage.','Flag hype indicators and disconfirmation conditions.'],
      quality_focus:['technical_constraints','market_signals','adoption_feedback','counter_hype']
    }),
    actor_incentive_map: Object.freeze({
      template_id:'actor_incentive_map', template_version:VERSION, display_name:'Actor Incentive Map', short_name:'Incentives',
      description:'Prioritizes actor incentives, resources, constraints, coalitions, bargaining power, and likely strategic moves.',
      output_focus:['actor_preferences','resources','constraints','coalitions','tools','bargaining outcomes'],
      required_layers:['interests','actors','tools','results','feedback'],
      plan_questions:['What does each actor gain, lose, protect, or avoid?','Which actor has decision access, money, coercive power, information, or legitimacy?','Where do actor incentives align, conflict, or produce unstable coalitions?','Which moves become rational once constraints and incentives are separated from rhetoric?'],
      source_priorities:['actor statements','funding or ownership data','institutional roles','past behavior chronology','credible opposition signals'],
      counter_evidence_targets:['Evidence that an actor’s stated preference conflicts with revealed behavior','Evidence that resource constraints prevent the expected move'],
      prompt_directives:['Separate actor preference, capability, constraint, and revealed behavior.','Map coalition stability and bargaining leverage.','Avoid treating public rhetoric as preference without behavioral evidence.'],
      quality_focus:['actor_coverage','resource_mapping','constraint_mapping','revealed_preferences']
    }),
    contradiction_audit: Object.freeze({
      template_id:'contradiction_audit', template_version:VERSION, display_name:'Contradiction Audit', short_name:'Contradictions',
      description:'Finds rhetoric/action gaps, policy/tool mismatch, incentive conflicts, missing variables, and narrative overreach.',
      output_focus:['declared_claims','observed_actions','mismatches','incentive_conflicts','disconfirming evidence','repair hypotheses'],
      required_layers:['narrative','tools','results','contradictions','feedback'],
      plan_questions:['Which claims, narratives, or official goals are being asserted?','Which observed actions or outcomes contradict those claims?','Which incentives explain the contradiction without assuming irrationality?','Which evidence would show the contradiction is only superficial or temporary?'],
      source_priorities:['official claims','observed action chronology','implementation records','opposition evidence','counter-explanations'],
      counter_evidence_targets:['Evidence that apparent contradiction is explained by sequencing, capacity, or legal constraint','Evidence supporting a benign or non-strategic explanation'],
      prompt_directives:['Group multiple contradictory actions under the same rhetoric when appropriate.','Generate competing explanations before assigning intent.','State what would weaken or disprove each contradiction hypothesis.'],
      quality_focus:['contradiction_density','competing_hypotheses','disconfirming_conditions','narrative_action_gap']
    }),
    scenario_forecast: Object.freeze({
      template_id:'scenario_forecast', template_version:VERSION, display_name:'Scenario Forecast', short_name:'Scenarios',
      description:'Builds competing scenarios, triggers, indicators, probabilities, failure modes, and falsification conditions.',
      output_focus:['scenario_drivers','triggers','indicators','probabilities','failure_modes','disproven_if'],
      required_layers:['interests','actors','tools','results','feedback','scenarios'],
      plan_questions:['Which variables most determine future direction and which are noise?','What are the 2-4 competing scenarios and their trigger conditions?','Which early indicators would raise or lower probability for each scenario?','What evidence would clearly disprove each scenario?'],
      source_priorities:['time-series indicators','policy calendars','market/public signals','actor commitments','historical analogues with limits'],
      counter_evidence_targets:['Evidence that a forecast driver is weak or lagging','Evidence that an assumed trigger already occurred without the expected outcome'],
      prompt_directives:['Provide competing hypotheses, not one future.','Attach indicators and disproven_if conditions to every scenario.','Separate base-case, upside/downside, and wild-card dynamics.'],
      quality_focus:['scenario_count','indicator_quality','probability_reasoning','falsifiability']
    })
  });
  function clone(value){ return JSON.parse(JSON.stringify(value)); }
  function listTemplates(){ return Object.values(TEMPLATE_REGISTRY).map(clone); }
  function getTemplate(id){ return clone(TEMPLATE_REGISTRY[id] || TEMPLATE_REGISTRY[DEFAULT_TEMPLATE_ID]); }
  function normalizeTemplateId(id){ return TEMPLATE_REGISTRY[id] ? id : DEFAULT_TEMPLATE_ID; }
  function profile(id){
    const t = getTemplate(normalizeTemplateId(id));
    return {template_id:t.template_id, template_version:t.template_version, display_name:t.display_name, short_name:t.short_name, description:t.description, output_focus:t.output_focus, required_layers:t.required_layers, source_priorities:t.source_priorities, counter_evidence_targets:t.counter_evidence_targets, prompt_directives:t.prompt_directives, quality_focus:t.quality_focus};
  }
  function mergeUnique(base = [], extra = [], limit = 12){
    const out = [];
    for(const item of [...base, ...extra]){ const text = String(item || '').trim(); if(text && !out.includes(text)) out.push(text); if(out.length >= limit) break; }
    return out;
  }
  function applyToPlan(plan, id){
    const t = getTemplate(normalizeTemplateId(id));
    const next = Object.assign({}, plan || {});
    next.analysis_template_id = t.template_id;
    next.analysis_template_name = t.display_name;
    next.template_directives = t.prompt_directives.slice();
    next.required_layers = t.required_layers.slice();
    next.questions = mergeUnique(next.questions || [], t.plan_questions, 14);
    next.target_sources = mergeUnique(next.target_sources || [], t.source_priorities, 12);
    next.counter_evidence_targets = mergeUnique(next.counter_evidence_targets || [], t.counter_evidence_targets, 10);
    next.early_warning_indicators = mergeUnique(next.early_warning_indicators || [], [`Template signal: ${t.short_name} assumptions begin failing.`, `Template signal: ${t.short_name} counter-evidence accumulates faster than supporting evidence.`], 10);
    return next;
  }
  function templateFitReport(state = {}, id){
    const t = getTemplate(normalizeTemplateId(id || state.analysis_template_id));
    const linked = new Set();
    for(const e of state.evidence || []) for(const ref of [...(e.supports || []), ...(e.contradicts || [])]) linked.add(String(ref));
    for(const link of state.causal_links || []) { linked.add(String(link.from || '')); linked.add(String(link.to || '')); }
    const layerPrefix = {interests:'I', actors:'A', tools:'T', narrative:'N', results:'R', feedback:'F', scenarios:'S', contradictions:'C'};
    const covered = t.required_layers.filter((layer) => { const prefix = layerPrefix[layer]; return prefix ? [...linked].some((id) => id.startsWith(prefix)) : false; });
    const missing = t.required_layers.filter((layer) => !covered.includes(layer));
    const score = Math.round((covered.length / Math.max(1, t.required_layers.length)) * 100);
    return {fit_version:VERSION, template_id:t.template_id, required_layers:t.required_layers, covered_layers:covered, missing_layers:missing, fit_score:score};
  }
  root.analysisTemplates = Object.freeze({VERSION, DEFAULT_TEMPLATE_ID, TEMPLATE_REGISTRY, listTemplates, getTemplate, normalizeTemplateId, profile, applyToPlan, templateFitReport});
})(window);
