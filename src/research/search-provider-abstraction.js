/* Jarbou3i Research Engine web search provider abstraction v0.27.0-beta. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};
  const VERSION = '0.27.0-beta';

  const SEARCH_PROVIDERS = Object.freeze({
    mock_search: {
      provider_id:'mock_search',
      display_name:'Mock Search Provider',
      status:'available_dry_run',
      auth_type:'none',
      billing_owner:'none',
      live_supported:false,
      key_exposure:'none',
      privacy_mode:'local_planning_only',
      production_status:'test_fixture',
      description:'Deterministic local web-search planning fixture. No network search is performed.'
    },
    brave_search_api: {
      provider_id:'brave_search_api',
      display_name:'Brave Search API',
      status:'planned_provider_adapter',
      auth_type:'server_side_api_key',
      billing_owner:'app_or_deployer',
      live_supported:false,
      key_exposure:'server_only_when_enabled_later',
      privacy_mode:'backend_search_provider_planned',
      production_status:'planned_not_live',
      description:'Future compliant search API adapter. v0.27 only models request/identity/budget policy.'
    },
    tavily_search_api: {
      provider_id:'tavily_search_api',
      display_name:'Tavily Search API',
      status:'planned_provider_adapter',
      auth_type:'server_side_api_key',
      billing_owner:'app_or_deployer',
      live_supported:false,
      key_exposure:'server_only_when_enabled_later',
      privacy_mode:'backend_search_provider_planned',
      production_status:'planned_not_live',
      description:'Future research-oriented search provider adapter. v0.27 performs no live search.'
    },
    serpapi: {
      provider_id:'serpapi',
      display_name:'SerpApi-compatible provider',
      status:'planned_provider_adapter',
      auth_type:'server_side_api_key',
      billing_owner:'app_or_deployer',
      live_supported:false,
      key_exposure:'server_only_when_enabled_later',
      privacy_mode:'backend_search_provider_planned',
      production_status:'planned_not_live',
      description:'Future SERP provider abstraction. v0.27 only prepares provider-neutral contracts.'
    },
    custom_search_api: {
      provider_id:'custom_search_api',
      display_name:'Custom Search API',
      status:'planned_provider_adapter',
      auth_type:'server_side_api_key',
      billing_owner:'deployer_or_user_backend',
      live_supported:false,
      key_exposure:'server_only_when_enabled_later',
      privacy_mode:'backend_search_provider_planned',
      production_status:'planned_not_live',
      description:'Provider-neutral slot for a compliant search API selected by the deployer.'
    }
  });

  const DEFAULT_BUDGET = Object.freeze({
    budget_version: VERSION,
    max_queries: 6,
    max_results_per_query: 5,
    max_total_results: 30,
    counter_evidence_queries: 2,
    freshness_window_days: 365,
    min_source_type_diversity: 3,
    require_counter_evidence: true,
    require_source_date: true,
    require_source_url: true,
    allow_snippets_only: true,
    live_search_enabled: false
  });

  const SOURCE_DIVERSITY_TARGETS = Object.freeze([
    'official_or_primary_source',
    'credible_news_or_wire_chronology',
    'expert_or_academic_interpretation',
    'counter_position_or_disconfirming_source',
    'public_signal_or_discussion_source'
  ]);

  function clampInt(value, fallback, min, max){
    const n = Number(value);
    if(!Number.isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, Math.round(n)));
  }
  function normalizeProviderId(value){
    const id = String(value || 'mock_search').trim();
    return SEARCH_PROVIDERS[id] ? id : 'mock_search';
  }
  function searchProviderIdentity(providerId = 'mock_search', options = {}){
    const id = normalizeProviderId(providerId);
    const base = SEARCH_PROVIDERS[id];
    return Object.assign({}, base, {
      identity_version: options.version || VERSION,
      provider_id:id,
      live_enabled:false,
      live_ready:false,
      key_present:false,
      key_exported:false,
      raw_token_exported:false,
      request_router:'source-task',
      evidence_gate:'evidence_review_queue_required',
      warnings: id === 'mock_search'
        ? ['Mock search produces planning fixtures only.']
        : ['Provider adapter is planned only in v0.27. No live web search is executed.']
    });
  }
  function buildSearchQueryBudget(options = {}){
    const maxQueries = clampInt(options.max_queries, DEFAULT_BUDGET.max_queries, 1, 20);
    const perQuery = clampInt(options.max_results_per_query, DEFAULT_BUDGET.max_results_per_query, 1, 20);
    const maxTotal = clampInt(options.max_total_results, Math.min(maxQueries * perQuery, DEFAULT_BUDGET.max_total_results), 1, 100);
    const counterQueries = clampInt(options.counter_evidence_queries, Math.min(2, maxQueries), 0, maxQueries);
    return Object.assign({}, DEFAULT_BUDGET, {
      budget_version: options.version || VERSION,
      max_queries:maxQueries,
      max_results_per_query:perQuery,
      max_total_results:Math.min(maxTotal, maxQueries * perQuery),
      counter_evidence_queries:counterQueries,
      freshness_window_days:clampInt(options.freshness_window_days, DEFAULT_BUDGET.freshness_window_days, 0, 3650),
      min_source_type_diversity:clampInt(options.min_source_type_diversity, DEFAULT_BUDGET.min_source_type_diversity, 1, SOURCE_DIVERSITY_TARGETS.length),
      require_counter_evidence: options.require_counter_evidence !== false,
      require_source_date: options.require_source_date !== false,
      require_source_url: options.require_source_url !== false,
      live_search_enabled:false
    });
  }
  function buildSearchPolicy(providerId = 'mock_search', options = {}){
    const identity = searchProviderIdentity(providerId, options);
    const budget = buildSearchQueryBudget(options);
    return {
      search_policy_version: options.version || VERSION,
      provider_identity:identity,
      query_budget:budget,
      current_layer:'web_search_provider_abstraction_dry_run',
      live_search_enabled:false,
      allowed_actions:[
        'build provider-neutral web-search task contracts',
        'generate dry-run query plans',
        'model query budgets and result limits',
        'require counter-evidence query families',
        'route future search results through Evidence Review Queue'
      ],
      prohibited_actions:[
        'perform live web search in v0.27',
        'scrape search result pages',
        'store provider search API keys in browser state or exports',
        'promote search results directly into Evidence Matrix',
        'claim external verification from dry-run query plans'
      ],
      source_diversity_targets:SOURCE_DIVERSITY_TARGETS.slice(),
      verdict:'web_search_abstraction_ready_no_live_fetch'
    };
  }
  function compact(values){ return Array.isArray(values) ? values.map(v => String(v || '').trim()).filter(Boolean) : []; }
  function buildQueryText(parts){ return parts.map(v => String(v || '').trim()).filter(Boolean).join(' '); }
  function buildWebSearchQueryPlan(input = {}){
    const topic = String(input.topic || 'Unspecified topic').trim();
    const context = String(input.context || 'Context not specified').trim();
    const questions = compact(input.research_questions || input.questions).slice(0, 5);
    const keywords = compact(input.keywords).slice(0, 8);
    const budget = buildSearchQueryBudget(input.budget || input.connector_options || {});
    const language = String(input.language || input.connector_options?.language || 'auto').trim() || 'auto';
    const base = questions.length ? questions : [`What evidence is needed for ${topic}?`];
    const queries = [];
    base.forEach((question, index) => {
      if(queries.length >= budget.max_queries) return;
      queries.push({
        query_id:`WSQ${queries.length + 1}`,
        purpose:index === 0 ? 'primary_evidence' : 'supporting_evidence',
        query:buildQueryText([topic, context !== 'Context not specified' ? context : '', question, keywords.slice(0,3).join(' ')]),
        source_diversity_target:SOURCE_DIVERSITY_TARGETS[index % SOURCE_DIVERSITY_TARGETS.length],
        freshness_window_days:budget.freshness_window_days,
        max_results:budget.max_results_per_query,
        language
      });
    });
    const counterSeeds = [
      `evidence against ${topic}`,
      `${topic} criticism counter evidence`,
      `${topic} contradictory data`,
      `${topic} failed prediction`
    ];
    for(let i = 0; i < budget.counter_evidence_queries && queries.length < budget.max_queries; i += 1){
      queries.push({
        query_id:`WSQ${queries.length + 1}`,
        purpose:'counter_evidence',
        query:buildQueryText([counterSeeds[i], context !== 'Context not specified' ? context : '', keywords.slice(0,4).join(' ')]),
        source_diversity_target:'counter_position_or_disconfirming_source',
        freshness_window_days:budget.freshness_window_days,
        max_results:budget.max_results_per_query,
        language
      });
    }
    return {
      plan_version: input.version || VERSION,
      provider_id:normalizeProviderId(input.provider_id || input.connector_options?.search_provider),
      query_budget:budget,
      source_diversity_targets:SOURCE_DIVERSITY_TARGETS.slice(),
      counter_evidence_required:budget.require_counter_evidence,
      queries:queries.slice(0, budget.max_queries),
      dedupe_policy:'dedupe by canonical URL, source title, and claim similarity before review queue insertion',
      ranking_rules:[
        'prefer primary/official sources for event facts',
        'prefer dated sources for time-sensitive claims',
        'separate observation snippets from interpretation snippets',
        'include disconfirming results before synthesis'
      ],
      extraction_fields:['claim','source_title','source_url','source_type','source_date','snippet','supports','contradicts','confidence'],
      review_gate:'evidence_review_queue_required',
      verdict:'web_search_query_plan_ready_no_live_fetch'
    };
  }
  function mockWebSearchResponse(request = {}){
    const providerId = normalizeProviderId(request.connector_options?.search_provider || request.search_provider || 'mock_search');
    const identity = searchProviderIdentity(providerId, {version:request.request_version || VERSION});
    const policy = buildSearchPolicy(providerId, Object.assign({}, request.connector_options || {}, {version:request.request_version || VERSION}));
    const query_plan = buildWebSearchQueryPlan({
      version:request.request_version || VERSION,
      provider_id:providerId,
      connector_options:request.connector_options || {},
      topic:request.topic,
      context:request.context,
      research_questions:request.research_questions,
      keywords:request.keywords
    });
    return {
      ok:true,
      type:'web_search_provider_abstraction_result',
      connector:'web_search_api',
      provider_identity:identity,
      search_policy:policy,
      live_fetching_enabled:false,
      source_fetching_performed:false,
      data:{
        plan_type:'web_search_provider_abstraction',
        connector:'web_search_api',
        provider_id:providerId,
        live_search_performed:false,
        query_plan,
        source_diversity_targets:SOURCE_DIVERSITY_TARGETS.slice(),
        counter_evidence_required:query_plan.counter_evidence_required,
        review_gate:'evidence_review_queue_required',
        verdict:'web_search_abstraction_ready_no_live_fetch'
      },
      warnings:['Web search provider abstraction is dry-run only in v0.27. No external search was performed.']
    };
  }
  function searchDiagnostics(request = {}, response = {}){
    const providerId = normalizeProviderId(request.connector_options?.search_provider || response.provider_identity?.provider_id || 'mock_search');
    const plan = response.data?.query_plan || buildWebSearchQueryPlan({provider_id:providerId, connector_options:request.connector_options || {}, topic:request.topic, context:request.context, research_questions:request.research_questions, keywords:request.keywords});
    const counterQueries = (plan.queries || []).filter(q => q.purpose === 'counter_evidence').length;
    return {
      diagnostics_version: request.request_version || VERSION,
      connector:'web_search_api',
      provider_id:providerId,
      live_search_enabled:false,
      query_count:(plan.queries || []).length,
      counter_evidence_query_count:counterQueries,
      source_diversity_target_count:(plan.source_diversity_targets || SOURCE_DIVERSITY_TARGETS).length,
      review_gate:'evidence_review_queue_required',
      readiness: counterQueries ? 'search_plan_ready_with_counter_evidence' : 'search_plan_needs_counter_evidence',
      warnings: response.warnings || []
    };
  }

  root.searchProviderAbstraction = Object.freeze({
    VERSION,
    SEARCH_PROVIDERS,
    DEFAULT_BUDGET,
    SOURCE_DIVERSITY_TARGETS,
    normalizeProviderId,
    searchProviderIdentity,
    buildSearchQueryBudget,
    buildSearchPolicy,
    buildWebSearchQueryPlan,
    mockWebSearchResponse,
    searchDiagnostics
  });
})(typeof window !== 'undefined' ? window : globalThis);
