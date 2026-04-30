/* Jarbou3i Research Engine state store v1.0.4. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};
  function defaultState(options = {}){
    const version = options.version || '1.0.4';
    return {
      plan: null,
      evidence: [],
      causal_links: [],
      critique: null,
      analysis_brief: null,
      diagnostics: null,
      lastMockAnalysis: null,
      ai_runs: [],
      activeProviderTask: 'synthesis',
      editingEvidenceIndex: -1,
      provider: 'mock',
      provider_config: {endpoint:'https://api.openai.com/v1/chat/completions', model:'gpt-4.1-mini', allow_live:false, remember_key:false},
      last_provider_payload: null,
      last_provider_validation: null,
      last_repair_trace: null,
      last_provider_contract_preview: null,
      last_provider_prompt_preview: null,
      provider_fixture_report: null,
      provider_diagnostics: null,
      portable_account: null,
      portable_oauth_spike: null,
      source_connector: 'manual_mock',
      source_task: 'source_plan',
      source_policy: null,
      source_diagnostics: null,
      source_fixture_report: null,
      last_source_request: null,
      source_runs: [],
      source_results: [],
      search_provider_identity: null,
      search_query_budget: null,
      search_policy: null,
      source_imports: [],
      evidence_review_queue: [],
      evidence_review_report: null,
      editingReviewIndex: -1,
      last_source_import_preview: null,
      source_import_report: null,
      packet_migration_report: null,
      active_project_id: null,
      active_project_name: null,
      project_saved_at: null,
      release_candidate: null,
      browser_qa_hardening: null,
      project_workspace: null,
      export_pack: null,
      analysis_template_id: 'strategic_analysis_engine',
      analysis_template: null,
      quality_gate: null,
      version
    };
  }
  function migrate(parsed, options = {}){
    const version = options.version || '1.0.4';
    const next = Object.assign(defaultState({version}), parsed || {});
    next.version = version;
    next.evidence = Array.isArray(next.evidence) ? next.evidence : (Array.isArray(next.evidence_matrix) ? next.evidence_matrix : []);
    next.causal_links = Array.isArray(next.causal_links) ? next.causal_links : [];
    next.ai_runs = Array.isArray(next.ai_runs) ? next.ai_runs.slice(-25) : [];
    next.source_runs = Array.isArray(next.source_runs) ? next.source_runs.slice(-25) : [];
    next.source_results = Array.isArray(next.source_results) ? next.source_results.slice(-25) : [];
    next.search_provider_identity = next.search_provider_identity && typeof next.search_provider_identity === 'object' ? next.search_provider_identity : null;
    next.search_query_budget = next.search_query_budget && typeof next.search_query_budget === 'object' ? next.search_query_budget : null;
    next.search_policy = next.search_policy && typeof next.search_policy === 'object' ? next.search_policy : null;
    next.source_imports = Array.isArray(next.source_imports) ? next.source_imports.slice(-25) : [];
    next.evidence_review_queue = Array.isArray(next.evidence_review_queue) ? next.evidence_review_queue.slice(-200) : [];
    next.evidence_review_report = next.evidence_review_report && typeof next.evidence_review_report === 'object' ? next.evidence_review_report : null;
    next.editingReviewIndex = Number.isInteger(next.editingReviewIndex) ? next.editingReviewIndex : -1;
    next.last_source_import_preview = next.last_source_import_preview && typeof next.last_source_import_preview === 'object' ? next.last_source_import_preview : null;
    next.source_import_report = next.source_import_report && typeof next.source_import_report === 'object' ? next.source_import_report : null;
    next.packet_migration_report = next.packet_migration_report && typeof next.packet_migration_report === 'object' ? next.packet_migration_report : null;
    next.active_project_id = typeof next.active_project_id === 'string' ? next.active_project_id : null;
    next.active_project_name = typeof next.active_project_name === 'string' ? next.active_project_name : null;
    next.project_saved_at = typeof next.project_saved_at === 'string' ? next.project_saved_at : null;
    next.release_candidate = next.release_candidate && typeof next.release_candidate === 'object' ? next.release_candidate : null;
    next.browser_qa_hardening = next.browser_qa_hardening && typeof next.browser_qa_hardening === 'object' ? next.browser_qa_hardening : null;
    next.project_workspace = next.project_workspace && typeof next.project_workspace === 'object' ? next.project_workspace : null;
    next.export_pack = next.export_pack && typeof next.export_pack === 'object' ? next.export_pack : null;
    next.analysis_template_id = typeof next.analysis_template_id === 'string' ? next.analysis_template_id : (next.analysis_template?.template_id || 'strategic_analysis_engine');
    next.analysis_template = next.analysis_template && typeof next.analysis_template === 'object' ? next.analysis_template : null;
    next.quality_gate = next.quality_gate && typeof next.quality_gate === 'object' ? next.quality_gate : null;
    next.source_connector = next.source_connector || 'manual_mock';
    next.source_task = next.source_task || 'source_plan';
    next.source_policy = next.source_policy && typeof next.source_policy === 'object' ? next.source_policy : null;
    next.source_diagnostics = next.source_diagnostics && typeof next.source_diagnostics === 'object' ? next.source_diagnostics : null;
    next.source_fixture_report = next.source_fixture_report && typeof next.source_fixture_report === 'object' ? next.source_fixture_report : null;
    next.last_source_request = next.last_source_request && typeof next.last_source_request === 'object' ? next.last_source_request : null;
    next.provider_config = Object.assign(defaultState({version}).provider_config, next.provider_config || {});
    next.provider_config.allow_live = !!next.provider_config.allow_live;
    next.provider_config.remember_key = !!next.provider_config.remember_key;
    next.last_provider_validation = next.last_provider_validation && typeof next.last_provider_validation === 'object' ? next.last_provider_validation : null;
    next.portable_account = next.portable_account && typeof next.portable_account === 'object' ? next.portable_account : null;
    next.portable_oauth_spike = next.portable_oauth_spike && typeof next.portable_oauth_spike === 'object' ? next.portable_oauth_spike : null;
    next.last_repair_trace = next.last_repair_trace && typeof next.last_repair_trace === 'object' ? next.last_repair_trace : null;
    next.analysis_brief = next.analysis_brief && typeof next.analysis_brief === 'object' ? next.analysis_brief : null;
    next.diagnostics = next.diagnostics && typeof next.diagnostics === 'object' ? next.diagnostics : null;
    next.editingEvidenceIndex = Number.isInteger(next.editingEvidenceIndex) ? next.editingEvidenceIndex : -1;
    if(next.plan && next.plan.plan_version) next.plan.plan_version = version;
    return renumberEvidence(next);
  }
  function load(storageKey, options = {}){
    try { return migrate(JSON.parse(global.localStorage.getItem(storageKey) || '{}'), options); }
    catch (_) { return defaultState(options); }
  }
  function save(storageKey, state){ global.localStorage.setItem(storageKey, JSON.stringify(state)); }
  function renumberEvidence(targetState){
    const idMap = new Map();
    targetState.evidence = (targetState.evidence || []).map((e,i)=>{
      const nextId = `E${i+1}`;
      if(e.evidence_id) idMap.set(e.evidence_id, nextId);
      return Object.assign({}, e, {evidence_id: nextId});
    });
    const validEvidenceIds = new Set(targetState.evidence.map(e => e.evidence_id));
    if(Array.isArray(targetState.causal_links)){
      targetState.causal_links = targetState.causal_links.map(link => Object.assign({}, link, {
        evidence_ids: (link.evidence_ids || []).map(id => idMap.get(id) || id).filter(id => validEvidenceIds.has(id))
      })).filter(link => (link.evidence_ids || []).length);
    }
    return targetState;
  }
  root.stateStore = {defaultState, migrate, load, save, renumberEvidence};
})(window);
