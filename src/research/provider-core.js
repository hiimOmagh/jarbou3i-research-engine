/* Jarbou3i Research Engine provider contracts and validation v0.22.0-beta. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};
  function responseContract(task){
    const contracts = {
      plan: {
        type:'research_plan',
        title:'Research Plan Contract',
        purpose:'Convert topic/context into research questions, target actors, source targets, keywords, counter-evidence targets, and early-warning indicators.',
        required:['questions','target_actors','target_sources','counter_evidence_targets','early_warning_indicators'],
        recommended:['plan_version','topic','context','keywords'],
        reject_if:['fewer than 3 questions','missing counter-evidence targets','free-text prose instead of JSON object'],
        diagnostic_hints:['Check question count','Check target_sources diversity','Check early-warning indicators'],
        example_shape:{questions:['string'], target_actors:['string'], target_sources:['official'], counter_evidence_targets:['string'], early_warning_indicators:['string']}
      },
      synthesis: {
        type:'strategic_analysis',
        title:'Strategic Analysis Contract',
        purpose:'Return a schema-compatible Jarbou3i strategic analysis object using the Interests → Actors → Tools → Narrative → Results → Feedback model.',
        required:['schema_version','subject','interests','actors','tools','narrative','results','feedback','scenarios'],
        recommended:['analysis_id','evidence','contradictions','causal_links','assumptions'],
        reject_if:['missing any core model layer','markdown-wrapped explanation without JSON','no scenario falsifiers','no evidence/counter-evidence discipline'],
        diagnostic_hints:['Check all six model layers','Check stable IDs','Check scenarios.disproven_if','Check source-based evidence'],
        example_shape:{schema_version:'1.1.0', subject:{title:'string'}, interests:[], actors:[], tools:[], narrative:[], results:[], feedback:[], scenarios:{items:[]}}
      },
      repair: {
        type:'repaired_strategic_analysis',
        title:'Repair Contract',
        purpose:'Repair malformed or incomplete strategic-analysis JSON while preserving meaning where possible.',
        required:['schema_version','analysis_id','evidence','scenarios'],
        recommended:['subject','interests','actors','tools','narrative','results','feedback'],
        reject_if:['still malformed JSON','removes core analytical content','does not preserve schema_version 1.1.0'],
        diagnostic_hints:['Check parseability','Check missing required fields','Check that repair is marked traceably'],
        example_shape:{schema_version:'1.1.0', analysis_id:'A-REPAIRED', evidence:{items:[]}, scenarios:{items:[]}}
      },
      critique: {
        type:'critique_report',
        title:'Critique Contract',
        purpose:'Return structured weaknesses, risk flags, and recommended next actions for the current research packet or analysis.',
        required:['summary','findings','recommended_next_actions'],
        recommended:['severity_distribution','missing_actors','evidence_gaps'],
        reject_if:['findings not array','no recommended next actions','pure praise without falsifiable criticism'],
        diagnostic_hints:['Check finding severity','Check specific next actions','Check evidence-gap references'],
        example_shape:{summary:'string', findings:[{type:'string', severity:'medium', finding:'string'}], recommended_next_actions:['string']}
      },
      source_discipline: {
        type:'source_discipline_report',
        title:'Source Discipline Contract',
        purpose:'Audit source metadata completeness and diversity without claiming factual verification.',
        required:['missing_urls','missing_dates','weak_source_types','counter_evidence_gaps'],
        recommended:['verdict','source_type_distribution','source_risk_notes'],
        reject_if:['claims real source verification without fetch/search','missing required arrays','ignores counter-evidence gaps'],
        diagnostic_hints:['Check URL/date completeness','Check source diversity','Check counter-evidence coverage'],
        example_shape:{missing_urls:['E1'], missing_dates:['E2'], weak_source_types:['E3'], counter_evidence_gaps:['E4'], verdict:'review_required'}
      }
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
  function responseCollectionOk(data, key, min = 1){
    const value = data?.[key];
    if(Array.isArray(value)) return value.length >= min;
    if(value && Array.isArray(value.items)) return value.items.length >= min;
    return false;
  }
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
        if(!responseCollectionOk(data, key)) issues.push(`strategic_analysis_missing_or_empty:${key}`);
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
      validation_version: options.version || '0.22.0-beta',
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
