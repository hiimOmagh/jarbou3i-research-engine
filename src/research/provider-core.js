/* Jarbou3i Research Engine provider contracts and validation v0.7.0-alpha. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};
  function responseContract(task){
    const contracts = {
      plan: {type:'research_plan', required:['questions','target_actors','target_sources','counter_evidence_targets','early_warning_indicators']},
      synthesis: {type:'strategic_analysis', required:['schema_version','subject','interests','actors','tools','narrative','results','feedback','scenarios']},
      repair: {type:'repaired_strategic_analysis', required:['schema_version','analysis_id','evidence','scenarios']},
      critique: {type:'critique_report', required:['summary','findings','recommended_next_actions']},
      source_discipline: {type:'source_discipline_report', required:['missing_urls','missing_dates','weak_source_types','counter_evidence_gaps']}
    };
    return contracts[task] || contracts.synthesis;
  }
  function stableHash(text){
    let hash = 2166136261;
    const input = String(text || '');
    for(let i = 0; i < input.length; i += 1){ hash ^= input.charCodeAt(i); hash = Math.imul(hash, 16777619); }
    return `h${(hash >>> 0).toString(16).padStart(8,'0')}`;
  }
  function normalizeProviderTextResponse(text){
    const raw = String(text || '').trim().replace(/^```(?:json)?/i,'').replace(/```$/,'').trim();
    try { return JSON.parse(raw); }
    catch(firstError){
      const firstBrace = raw.indexOf('{');
      const lastBrace = raw.lastIndexOf('}');
      if(firstBrace >= 0 && lastBrace > firstBrace){
        const candidate = raw.slice(firstBrace, lastBrace + 1);
        try { return JSON.parse(candidate); }
        catch(secondError){ return {raw_text: raw, parse_error: String(secondError && secondError.message || secondError)}; }
      }
      return {raw_text: raw, parse_error: String(firstError && firstError.message || firstError)};
    }
  }
  function hasOwn(obj, key){ return !!obj && Object.prototype.hasOwnProperty.call(obj, key); }
  function responseArrayOk(data, key, min = 1){ return Array.isArray(data?.[key]) && data[key].length >= min; }
  function validateProviderResponse(payload, response, options = {}){
    const data = response?.data;
    const contract = payload?.response_contract || responseContract(payload?.task || 'synthesis');
    const issues = [];
    if(!response || response.ok !== true) issues.push('provider_response_not_ok');
    if(!data || typeof data !== 'object') issues.push('response_data_not_object');
    if(data && data.raw_text) issues.push('response_not_valid_json_object');
    for(const field of (contract.required || [])){
      if(!hasOwn(data, field)) issues.push(`missing_required_field:${field}`);
    }
    if(payload?.task === 'plan'){
      if(!responseArrayOk(data, 'questions', 3)) issues.push('plan_requires_at_least_three_questions');
      if(!responseArrayOk(data, 'counter_evidence_targets')) issues.push('plan_missing_counter_evidence_targets');
    }
    if(payload?.task === 'synthesis' || payload?.task === 'repair'){
      for(const key of ['interests','actors','tools','narrative','results','feedback','scenarios']){
        if(!responseArrayOk(data, key)) issues.push(`strategic_analysis_missing_or_empty:${key}`);
      }
      if(!data?.schema_version) issues.push('strategic_analysis_missing_schema_version');
    }
    if(payload?.task === 'critique'){
      if(!responseArrayOk(data, 'findings')) issues.push('critique_missing_findings');
      if(!responseArrayOk(data, 'recommended_next_actions')) issues.push('critique_missing_next_actions');
    }
    if(payload?.task === 'source_discipline'){
      for(const key of ['missing_urls','missing_dates','weak_source_types','counter_evidence_gaps']){
        if(!Array.isArray(data?.[key])) issues.push(`source_discipline_missing_array:${key}`);
      }
    }
    const accepted = response?.ok === true && issues.length === 0;
    const nowIso = options.nowIso || (() => new Date().toISOString());
    return {
      validation_version: options.version || '0.7.0-alpha',
      validated_at: nowIso(),
      task: payload?.task || 'unknown',
      expected_type: contract.type,
      received_type: response?.type || 'unknown',
      accepted,
      repair_required: !accepted && ['synthesis','repair','plan','critique','source_discipline'].includes(payload?.task),
      issue_count: issues.length,
      issues
    };
  }
  function repairProviderResponse(payload, response, validation, options = {}){
    if(!validation?.repair_required){ return {attempted:false, status:'not_required'}; }
    const task = payload.task === 'synthesis' ? 'repair' : payload.task;
    const repairPayload = Object.assign({}, payload, { task, response_contract: responseContract(task) });
    const mockProviderResponse = options.mockProviderResponse;
    const validate = options.validateProviderResponse || validateProviderResponse;
    if(typeof mockProviderResponse !== 'function'){
      return {attempted:true, strategy:'unavailable', status:'failed', original_task:payload.task, repair_task:task, original_issues:validation.issues || []};
    }
    const repairedResponse = mockProviderResponse(repairPayload);
    repairedResponse.warnings = [...(repairedResponse.warnings || []), 'Controlled fallback repair was applied after provider contract validation failed.'];
    const repairedValidation = validate(repairPayload, repairedResponse);
    return {
      attempted:true,
      strategy:'mock_provider_contract_fallback',
      original_task: payload.task,
      repair_task: task,
      status: repairedValidation.accepted ? 'repaired' : 'failed',
      original_issues: validation.issues || [],
      validation: repairedValidation,
      response: repairedResponse
    };
  }
  function validationSummary(validation, repairTrace){
    if(!validation) return 'not validated';
    const base = validation.accepted ? 'accepted' : 'rejected';
    const repair = repairTrace?.attempted ? ` · repair:${repairTrace.status}` : '';
    return `${base} · issues:${validation.issue_count}${repair}`;
  }
  root.providerCore = {responseContract, stableHash, normalizeProviderTextResponse, validateProviderResponse, repairProviderResponse, validationSummary};
})(window);
