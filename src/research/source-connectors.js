/* Jarbou3i Research Engine source-assisted planning contracts v0.21.0-beta. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};

  const SOURCE_CONNECTORS = {
    manual_mock: {
      label:'Manual / Mock',
      status:'available',
      live_fetching:false,
      description:'Manual source planning and mock fixtures only. No network fetch is performed.'
    },
    web_search_planned: {
      label:'Web Search',
      status:'planned',
      live_fetching:false,
      description:'Future connector for compliant web search APIs. Planning only in v0.14.'
    },
    github_planned: {
      label:'GitHub',
      status:'planned',
      live_fetching:false,
      description:'Future connector for public repository metadata and release signals. Planning only in v0.14.'
    },
    hn_planned: {
      label:'Hacker News',
      status:'planned',
      live_fetching:false,
      description:'Future connector for HN public-discussion signals. Planning only in v0.14.'
    },
    youtube_planned: {
      label:'YouTube',
      status:'planned',
      live_fetching:false,
      description:'Future connector for video/transcript metadata through compliant APIs. Planning only in v0.14.'
    },
    reddit_planned: {
      label:'Reddit',
      status:'planned',
      live_fetching:false,
      description:'Future connector for public discourse signals through compliant APIs/providers. Planning only in v0.14.'
    },
    polymarket_planned: {
      label:'Polymarket',
      status:'planned',
      live_fetching:false,
      description:'Future connector for market-implied probability signals. Planning only in v0.14.'
    }
  };

  const SOURCE_TASKS = {
    source_plan: {
      type:'source_plan',
      title:'Source Plan',
      purpose:'Convert research questions into source targets, query families, collection limits, and evidence extraction rules.',
      required:['query_families','source_targets','collection_limits','extraction_fields','safety_constraints']
    },
    query_plan: {
      type:'query_plan',
      title:'Query Plan',
      purpose:'Create connector-specific query candidates without executing live searches.',
      required:['queries','connector','time_window','dedupe_policy','ranking_rules']
    },
    claim_extraction: {
      type:'claim_extraction_plan',
      title:'Claim Extraction Plan',
      purpose:'Define how future fetched/source-pasted material should be converted into evidence-matrix items.',
      required:['claim_fields','source_metadata_fields','linking_rules','rejection_rules']
    },
    evidence_scoring: {
      type:'evidence_scoring_plan',
      title:'Evidence Scoring Plan',
      purpose:'Define transparent scoring rules for strength, recency, source type, public signal, and counter-evidence.',
      required:['score_dimensions','weights','penalties','publish_thresholds']
    },
    cluster_plan: {
      type:'source_cluster_plan',
      title:'Source Cluster Plan',
      purpose:'Define how evidence items should be clustered by claim, actor, layer, source type, and contradiction.',
      required:['cluster_keys','merge_rules','conflict_rules','output_fields']
    }
  };

  function sourcePolicy(version = '0.21.0-beta'){
    return {
      policy_version: version,
      generated_at: new Date().toISOString(),
      live_fetching_enabled: false,
      current_layer: 'planning_only',
      allowed_actions: [
        'build source task payloads',
        'generate mock source plans',
        'define connector contracts',
        'import manually collected evidence',
        'score and cluster evidence metadata'
      ],
      prohibited_actions: [
        'claim source verification without a real fetch/search layer',
        'scrape platforms without compliant API or permission',
        'store API keys in exported research packets',
        'merge unverified generated source URLs as verified evidence'
      ],
      future_connector_requirement: [
        'explicit source API or compliant data provider',
        'rate limits and input limits',
        'source URL/date/type preservation',
        'fetch logs or source run ledger',
        'source diversity and counter-evidence checks'
      ],
      verdict: 'safe_planning_layer_only'
    };
  }

  function compactArray(values, fallback){
    const arr = Array.isArray(values) ? values.filter(Boolean) : [];
    return arr.length ? arr : fallback;
  }

  function buildSourceTaskRequest(input){
    const packet = input.packet || {};
    const plan = packet.research_plan || input.plan || {};
    const connector = input.connector || 'manual_mock';
    const task = input.task || 'source_plan';
    const contract = SOURCE_TASKS[task] || SOURCE_TASKS.source_plan;
    const targetSources = compactArray(plan.target_sources, ['official documents','credible news chronology','counter-position sources']);
    const questions = compactArray(plan.questions, [`What source evidence is needed for ${input.topic || 'the topic'}?`]);
    const keywords = compactArray(plan.keywords, String(input.topic || '').split(/\s+/).filter(Boolean).slice(0,8));
    return {
      request_version: input.version || '0.21.0-beta',
      created_at: new Date().toISOString(),
      connector,
      connector_contract: SOURCE_CONNECTORS[connector] || SOURCE_CONNECTORS.manual_mock,
      task,
      task_contract: contract,
      privacy_mode: 'manual_or_backend_source_planning_only',
      live_fetching_enabled: false,
      topic: input.topic || plan.topic || 'Unspecified topic',
      context: input.context || plan.context || 'Context not specified',
      research_questions: questions,
      target_sources: targetSources,
      keywords,
      counter_evidence_targets: compactArray(plan.counter_evidence_targets, ['Find evidence contradicting dominant causal explanations']),
      extraction_target: {
        output_schema:'evidence_matrix_item',
        required_fields:['claim','source_title','source_url','source_type','source_date','evidence_strength','supports','contradicts','confidence'],
        linkable_ids:['I*','A*','T*','N*','R*','F*','S*']
      },
      safety_policy: sourcePolicy(input.version || '0.21.0-beta')
    };
  }

  function mockSourceTaskResponse(request){
    const baseQueries = (request.keywords || []).slice(0,5);
    const queryFamilies = (request.research_questions || []).slice(0,5).map((q, i) => ({
      query_id:`Q${i+1}`,
      question:q,
      queries:[
        `${baseQueries.join(' ')} ${request.context || ''} official source`.trim(),
        `${baseQueries.join(' ')} ${request.context || ''} counter evidence`.trim(),
        `${baseQueries.join(' ')} ${request.context || ''} analysis chronology`.trim()
      ].filter(Boolean),
      preferred_source_types: request.target_sources || [],
      evidence_goal: i === 0 ? 'primary causal claim' : 'supporting or disconfirming evidence'
    }));
    const responseByTask = {
      source_plan: {
        plan_type:'source_plan',
        connector:request.connector,
        query_families:queryFamilies,
        source_targets:request.target_sources || [],
        collection_limits:{max_sources_per_family:5, max_same_domain:2, require_dates:true, require_counter_evidence:true},
        extraction_fields:request.extraction_target.required_fields,
        safety_constraints:request.safety_policy.prohibited_actions,
        verdict:'planning_ready_no_live_fetch'
      },
      query_plan: {
        plan_type:'query_plan',
        connector:request.connector,
        time_window:request.context,
        queries:queryFamilies.flatMap(f => f.queries.map(query => ({query_id:f.query_id, query, source_goal:f.evidence_goal}))),
        dedupe_policy:'deduplicate by canonical URL/domain/title similarity before evidence import',
        ranking_rules:['source_type_priority','date_recency','direct relevance to target layer','counter-evidence value'],
        verdict:'query_plan_ready_no_live_fetch'
      },
      claim_extraction: {
        plan_type:'claim_extraction_plan',
        connector:request.connector,
        claim_fields:['claim','observed_event','actor','tool','outcome','uncertainty'],
        source_metadata_fields:['source_title','source_url','source_type','source_date','author_or_institution'],
        linking_rules:['map causal claims to I/A/T/N/R/F/S IDs','separate observation from inference','attach counter-evidence when present'],
        rejection_rules:['missing source date for time-sensitive claim','unsupported probability','generated URL without real source'],
        verdict:'claim_extraction_rules_ready'
      },
      evidence_scoring: {
        plan_type:'evidence_scoring_plan',
        connector:request.connector,
        score_dimensions:['source_type_quality','recency','directness','independence','counter_evidence_value','public_signal_strength'],
        weights:{source_type_quality:0.25, recency:0.15, directness:0.25, independence:0.15, counter_evidence_value:0.10, public_signal_strength:0.10},
        penalties:['same-source overconcentration','missing URL','missing date','pure opinion without observable basis'],
        publish_thresholds:{draft:45, review:65, publish:80},
        verdict:'scoring_plan_ready'
      },
      cluster_plan: {
        plan_type:'source_cluster_plan',
        connector:request.connector,
        cluster_keys:['target_model_id','claim_similarity','source_type','time_window','contradiction_status'],
        merge_rules:['merge only when claims support the same target ID and same causal relationship','preserve dissenting sources separately'],
        conflict_rules:['flag direct contradiction','prefer primary sources for event facts','preserve minority evidence in counter-evidence notes'],
        output_fields:['cluster_id','target_id','evidence_ids','dominant_claim','counter_claim','source_type_mix','confidence_mix'],
        verdict:'cluster_plan_ready'
      }
    };
    return {
      ok:true,
      type:(SOURCE_TASKS[request.task] || SOURCE_TASKS.source_plan).type,
      data: responseByTask[request.task] || responseByTask.source_plan,
      warnings:['Mock source planning only. No search, fetch, scrape, or external verification was performed.']
    };
  }

  function sourceDiagnostics(packet, request, response){
    const evidence = packet?.evidence_matrix || [];
    const policy = sourcePolicy(packet?.workflow_version || '0.21.0-beta');
    const sourceTypes = new Set(evidence.map(e => e.source_type).filter(Boolean));
    const missingUrls = evidence.filter(e => !e.source_url).map(e => e.evidence_id);
    const missingDates = evidence.filter(e => !e.source_date || e.source_date === 'unknown').map(e => e.evidence_id);
    const counterGaps = evidence.filter(e => !(e.contradicts || []).length).map(e => e.evidence_id);
    const warnings = [];
    if(missingUrls.length) warnings.push('some evidence items lack URLs');
    if(missingDates.length) warnings.push('some evidence items lack source dates');
    if(sourceTypes.size < 2) warnings.push('low source-type diversity');
    if(counterGaps.length === evidence.length && evidence.length) warnings.push('no counter-evidence links present');
    if(response?.warnings?.length) warnings.push(...response.warnings);
    return {
      diagnostics_version: policy.policy_version,
      checked_at:new Date().toISOString(),
      connector:request?.connector || 'manual_mock',
      task:request?.task || 'source_plan',
      live_fetching_enabled:false,
      evidence_count:evidence.length,
      source_type_count:sourceTypes.size,
      missing_urls:missingUrls,
      missing_dates:missingDates,
      counter_evidence_gaps:counterGaps,
      policy_verdict:policy.verdict,
      readiness:warnings.length ? 'review_required' : 'source_plan_ready',
      warnings
    };
  }

  function runSourceFixtureSuite(version = '0.21.0-beta'){
    const request = buildSourceTaskRequest({
      version,
      topic:'Fixture topic',
      context:'Fixture context',
      connector:'manual_mock',
      task:'source_plan',
      plan:{
        questions:['What happened?','Who benefits?','What contradicts the dominant explanation?'],
        target_sources:['official documents','news chronology','counter-position sources'],
        keywords:['fixture','topic'],
        counter_evidence_targets:['contradict dominant explanation']
      }
    });
    const tasks = Object.keys(SOURCE_TASKS);
    const results = tasks.map(task => {
      const taskRequest = Object.assign({}, request, {task, task_contract:SOURCE_TASKS[task]});
      const response = mockSourceTaskResponse(taskRequest);
      const required = SOURCE_TASKS[task].required || [];
      const missing = required.filter(key => !(key in (response.data || {})));
      return {fixture_id:`source-${task}`, task, pass:response.ok === true && missing.length === 0, missing, response_type:response.type};
    });
    return {
      suite_version:version,
      fixture_count:results.length,
      pass_count:results.filter(r => r.pass).length,
      fail_count:results.filter(r => !r.pass).length,
      live_fetching_performed:false,
      results
    };
  }

  root.sourceConnectors = {SOURCE_CONNECTORS, SOURCE_TASKS, sourcePolicy, buildSourceTaskRequest, mockSourceTaskResponse, sourceDiagnostics, runSourceFixtureSuite};
})(window);
