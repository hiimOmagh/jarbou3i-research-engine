/* Jarbou3i Research Engine migrations v0.18.0-beta. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};
  const MIGRATION_VERSION = '0.18.0-beta';
  const TARGET_VERSION = '0.18.0-beta';
  const SUPPORTED_SOURCES = Object.freeze(['0.11.0-beta','0.12.0-beta','0.13.0-beta','0.14.0-beta','0.15.0-beta','0.16.0-beta','0.17.0-beta','0.18.0-beta']);
  const DEFAULT_REDACTION = '[REDACTED_DURING_PACKET_MIGRATION]';

  const SENSITIVE_KEY_PATTERNS = Object.freeze([
    /(^|[_-])access[_-]?token($|[_-])/i,
    /(^|[_-])refresh[_-]?token($|[_-])/i,
    /(^|[_-])raw[_-]?token($|[_-])/i,
    /(^|[_-])id[_-]?token($|[_-])/i,
    /^token$/i,
    /^authorization$/i,
    /^bearer$/i,
    /(^|[_-])api[_-]?key($|[_-])/i,
    /(^|[_-])secret($|[_-])/i,
    /(^|[_-])client[_-]?secret($|[_-])/i,
    /(^|[_-])private[_-]?key($|[_-])/i,
    /^password$/i,
    /^credential(s)?$/i
  ]);
  const SAFE_DERIVED_KEY_PATTERNS = Object.freeze([
    /hash/i, /fingerprint/i, /^key_exported$/i, /^raw_token_exported$/i,
    /^access_token_exported$/i, /^refresh_token_exported$/i, /^secret_exported$/i,
    /^credential_exported$/i, /^has_/i, /_present$/i, /_enabled$/i,
    /_configured$/i, /_supported$/i, /_available$/i, /_state$/i
  ]);
  const SECRET_TEXT_PATTERNS = Object.freeze([
    /Bearer\s+[A-Za-z0-9._~+/=-]{12,}/i,
    /sk-[A-Za-z0-9_-]{16,}/i,
    /ghp_[A-Za-z0-9_]{16,}/i,
    /github_pat_[A-Za-z0-9_]{20,}/i,
    /ya29\.[A-Za-z0-9._-]{20,}/i,
    /refresh[_-]?token\s*[:=]\s*["'][^"']{8,}["']/i,
    /access[_-]?token\s*[:=]\s*["'][^"']{8,}["']/i,
    /api[_-]?key\s*[:=]\s*["'][^"']{12,}["']/i
  ]);

  function nowIso(){ return new Date().toISOString(); }
  function isPlainObject(value){ return Object.prototype.toString.call(value) === '[object Object]'; }
  function clone(value){ return value === undefined ? undefined : JSON.parse(JSON.stringify(value)); }
  function asArray(value){ return Array.isArray(value) ? value : []; }
  function nonEmptyString(value, fallback){ const text = String(value ?? '').trim(); return text || fallback; }
  function clampScore(value, fallback = 3){ const n = Number(value); return Math.max(1, Math.min(5, Number.isFinite(n) ? n : fallback)); }
  function confidence(value){ return ['low','medium','high'].includes(value) ? value : 'medium'; }
  function sourceType(value){ return ['official','academic','news','social','market','expert','primary','other'].includes(value) ? value : 'other'; }
  function relationship(value){ return ['motivates','enables','constrains','contradicts','amplifies'].includes(value) ? value : 'motivates'; }
  function isSafeDerivedKey(key){ return SAFE_DERIVED_KEY_PATTERNS.some((pattern) => pattern.test(String(key || ''))); }
  function isSensitiveKey(key){ const normalized = String(key || '').trim(); return !!normalized && !isSafeDerivedKey(normalized) && SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(normalized)); }
  function containsSecretText(value){ return typeof value === 'string' && SECRET_TEXT_PATTERNS.some((pattern) => pattern.test(value)); }
  function addDefault(report, field){ if(!report.added_defaults.includes(field)) report.added_defaults.push(field); }
  function addStep(report, step){ if(!report.applied_steps.includes(step)) report.applied_steps.push(step); }
  function addWarning(report, warning){ if(!report.warnings.includes(warning)) report.warnings.push(warning); }
  function recordRedaction(report, path){ const value = path.join('.') || '<root>'; if(!report.removed_sensitive_fields.includes(value)) report.removed_sensitive_fields.push(value); }

  function deepSanitize(value, report, path = []){
    if(Array.isArray(value)) return value.map((item, index) => deepSanitize(item, report, path.concat(String(index))));
    if(isPlainObject(value)){
      const out = {};
      for(const [key, entry] of Object.entries(value)){
        const nextPath = path.concat(key);
        if(isSensitiveKey(key)){
          if(entry !== null && entry !== undefined && entry !== false && entry !== '') recordRedaction(report, nextPath);
          out[key] = entry === false || entry === null || entry === undefined || entry === '' ? entry : DEFAULT_REDACTION;
          continue;
        }
        out[key] = deepSanitize(entry, report, nextPath);
      }
      return out;
    }
    if(containsSecretText(value)){ recordRedaction(report, path); return DEFAULT_REDACTION; }
    return value;
  }

  function detectSourceVersion(raw){
    const candidates = [raw?.workflow_version, raw?.version, raw?.research_plan?.plan_version, raw?.plan?.plan_version, raw?.analysis_brief?.brief_version, raw?.portable_account?.portable_account_version].filter(Boolean).map(String);
    for(const candidate of candidates){
      const normalized = candidate.replace(/^v/i, '');
      if(SUPPORTED_SOURCES.includes(normalized)) return normalized;
      const match = normalized.match(/0\.1[1-7]\.0-beta/);
      if(match) return match[0];
    }
    return 'unknown_legacy';
  }

  function migrationPath(sourceVersion, targetVersion){
    if(sourceVersion === targetVersion) return [];
    const order = ['0.11.0-beta','0.12.0-beta','0.13.0-beta','0.14.0-beta','0.15.0-beta','0.16.0-beta','0.17.0-beta','0.18.0-beta'];
    const start = Math.max(0, order.indexOf(sourceVersion));
    const end = order.indexOf(targetVersion);
    const path = [];
    for(let i = start; i < end; i += 1) path.push(`${order[i]}→${order[i+1]}`);
    return path.length ? path : [`${sourceVersion}→${targetVersion}`];
  }

  function safePrivacyExport(){
    return {guard_version: TARGET_VERSION, safe:true, issue_count:0, raw_token_exported:false, access_token_exported:false, refresh_token_exported:false, key_exported:false, secret_exported:false, credential_exported:false, redaction_applied:false, issues:[]};
  }
  function defaultSourcePolicy(){
    return {source_policy_version:TARGET_VERSION, live_fetching_enabled:false, current_layer:'planning_only', verdict:'safe_planning_layer_only', prohibited_actions:['no_scraping','no_live_fetching','no_fake_verification_claims'], allowed_actions:['manual_import','source_planning','review_queue_promotion'], notes:['Migrated default source policy. Source automation remains review-gated.']};
  }
  function defaultProviderIdentity(provider = 'mock'){
    const mode = ['mock','openai_compatible','backend_proxy','portable_oauth'].includes(provider) ? provider : 'mock';
    const map = {mock:['none','none','none','local_private','none','stable_mock',false], openai_compatible:['api_key','user_provider_account','browser_memory_or_local_device','user_controlled_byok','user_secret','beta_guarded',true], backend_proxy:['server_secret','app_owner_or_deployment_owner','server_environment_secret','hosted_proxy_user_opt_in','server_secret','beta_backend',true], portable_oauth:['oauth_pkce_mock','portable_account','mock_token_hash_only','portable_account_mock_only','mock_oauth_token','mock_only',false]}[mode];
    return {provider_id:mode, display_name:mode === 'mock' ? 'MockProvider' : mode, auth_type:map[0], billing_owner:map[1], key_exposure:map[2], privacy_mode:map[3], credential_class:map[4], production_status:map[5], live_supported:map[6], live_opt_in:false, live_ready:mode === 'mock', key_present:false, key_exported:false, remember_key:false, token_present:false, oauth_pkce:mode === 'portable_oauth', portable_account:mode === 'portable_oauth', live_blockers:mode === 'mock' ? [] : ['migrated_packet_requires_user_revalidation'], warnings:['Provider identity was migrated with safe defaults. Revalidate live settings manually.'], description:'Migrated provider identity metadata.'};
  }
  function defaultBillingPolicy(provider = 'mock'){
    const mode = ['mock','openai_compatible','backend_proxy','portable_oauth'].includes(provider) ? provider : 'mock';
    const owner = mode === 'openai_compatible' ? 'user_provider_account' : (mode === 'backend_proxy' ? 'app_owner_or_deployment_owner' : (mode === 'portable_oauth' ? 'portable_account' : 'none'));
    return {billing_policy_version:TARGET_VERSION, provider_id:mode, billing_owner:owner, user_charge_controlled_by_app:false, app_owner_cost_exposure:mode === 'backend_proxy' ? 'possible_backend_proxy_costs_if_enabled' : 'none_in_manual_or_mock_mode', requires_user_acknowledgement:mode !== 'mock', notes:['Migrated billing policy. Live/provider billing must be explicitly revalidated before use.']};
  }
  function defaultPortableAccount(){
    return {portable_account_version:TARGET_VERSION, provider_id:'portable_oauth', status:'disconnected', account_id:null, display_name:null, connected_at:null, token_state:'absent', token_hash:null, token_expires_at:null, token_present:false, refresh_available:false, scopes:[], billing_owner:'portable_account', spending_limit_cents:0, live_calls_enabled:false, live_calls_supported:false, mock_only:true, key_exported:false, raw_token_exported:false, verification:'migrated_disconnected_mock_status', safety_verdict:'safe_no_raw_token', connected:false};
  }
  function normalizePortableAccount(input, report){
    const safe = deepSanitize(isPlainObject(input) ? input : {}, report, ['portable_account']);
    if(!isPlainObject(input)) addDefault(report, 'portable_account');
    return Object.assign(defaultPortableAccount(), safe, {portable_account_version:TARGET_VERSION, provider_id:'portable_oauth', billing_owner:'portable_account', live_calls_enabled:false, live_calls_supported:false, mock_only:true, key_exported:false, raw_token_exported:false, token_present:!!safe.token_hash && safe.status === 'connected_mock', connected:safe.status === 'connected_mock'});
  }
  function normalizePlan(input, raw, report){
    const plan = isPlainObject(input) ? clone(input) : {};
    if(!isPlainObject(input)) addDefault(report, 'research_plan');
    const topic = nonEmptyString(plan.topic || raw?.topic, 'Unspecified strategic analysis topic');
    const context = nonEmptyString(plan.context || raw?.context, 'Context not specified');
    let questions = asArray(plan.questions).map(String).filter(Boolean);
    if(questions.length < 3){ questions = [`What are the primary interests shaping ${topic}?`, `Which actors and tools are most relevant in ${context}?`, 'What evidence would weaken or contradict the dominant interpretation?']; addDefault(report, 'research_plan.questions'); }
    return Object.assign({}, plan, {plan_version:TARGET_VERSION, topic, context, mode:['structural','recent','source-heavy','adversarial'].includes(plan.mode) ? plan.mode : 'structural', generated_at:plan.generated_at || nowIso(), questions, target_actors:asArray(plan.target_actors).length ? asArray(plan.target_actors) : ['primary decision-makers','affected institutions'], target_sources:asArray(plan.target_sources).length ? asArray(plan.target_sources) : ['official documents','reputable reporting','primary statements'], keywords:asArray(plan.keywords), counter_evidence_targets:asArray(plan.counter_evidence_targets).length ? asArray(plan.counter_evidence_targets) : ['disconfirming evidence','alternative causal explanation'], early_warning_indicators:asArray(plan.early_warning_indicators).length ? asArray(plan.early_warning_indicators) : ['policy reversal','actor coalition shift','resource constraint signal']});
  }
  function normalizeEvidence(input, report){
    const rawItems = asArray(input);
    if(!rawItems.length) addDefault(report, 'evidence_matrix');
    const items = rawItems.length ? rawItems : [{claim:'Migrated placeholder evidence. Replace with reviewed source-backed evidence before publication.', source_title:'Migration default', source_type:'other', source_date:'unknown', supports:['I1'], contradicts:[], notes:'Default inserted to preserve import compatibility.'}];
    return items.map((item, index) => {
      const clean = deepSanitize(isPlainObject(item) ? item : {}, report, ['evidence_matrix', String(index)]);
      if(!clean.claim) addDefault(report, `evidence_matrix.${index}.claim`);
      return Object.assign({}, clean, {evidence_id:`E${index + 1}`, claim:nonEmptyString(clean.claim, `Migrated evidence item ${index + 1}. Review required.`), source_title:String(clean.source_title || clean.title || 'Untitled migrated source'), source_url:String(clean.source_url || clean.url || ''), source_type:sourceType(clean.source_type || clean.type), source_date:String(clean.source_date || clean.date || 'unknown'), time_relevance_score:clampScore(clean.time_relevance_score, 3), evidence_strength:clampScore(clean.evidence_strength || clean.strength, 3), public_signal_score:clampScore(clean.public_signal_score, 1), supports:asArray(clean.supports), contradicts:asArray(clean.contradicts), confidence:confidence(clean.confidence), notes:String(clean.notes || '')});
    });
  }
  function normalizeCausalLinks(input, evidence, report){
    const evidenceIds = new Set(evidence.map((item) => item.evidence_id));
    const links = asArray(input).map((item) => deepSanitize(isPlainObject(item) ? item : {}, report, ['causal_links'])).filter(Boolean);
    const normalized = links.map((link) => {
      const ids = asArray(link.evidence_ids).filter((id) => evidenceIds.has(id));
      return {from:/^[A-Z]+\d+$/.test(String(link.from || '')) ? link.from : 'I1', to:/^[A-Z]+\d+$/.test(String(link.to || '')) ? link.to : 'A1', relationship:relationship(link.relationship), evidence_ids:ids.length ? ids : [evidence[0]?.evidence_id || 'E1'], confidence:confidence(link.confidence)};
    }).filter((link) => link.evidence_ids.length);
    if(normalized.length) return normalized;
    addDefault(report, 'causal_links');
    return [{from:'I1', to:'A1', relationship:'motivates', evidence_ids:[evidence[0]?.evidence_id || 'E1'], confidence:'medium'}];
  }
  function normalizeAnalysisBrief(input, plan, evidence, links, report){
    if(!isPlainObject(input)) return null;
    const clean = deepSanitize(input, report, ['analysis_brief']);
    return Object.assign({}, clean, {brief_version:TARGET_VERSION, topic:nonEmptyString(clean.topic, plan.topic), context:nonEmptyString(clean.context, plan.context), readiness_score:Math.max(0, Math.min(100, Number(clean.readiness_score) || 0)), source_clusters:asArray(clean.source_clusters), coverage:isPlainObject(clean.coverage) ? clean.coverage : {}, gaps:asArray(clean.gaps), synthesis_constraints:asArray(clean.synthesis_constraints).length ? asArray(clean.synthesis_constraints) : ['Review migrated packet before publication.'], handoff_summary:nonEmptyString(clean.handoff_summary, `Migrated brief for ${plan.topic} with ${evidence.length} evidence items and ${links.length} causal links.`)});
  }
  function normalizeAiRuns(input, report){
    return asArray(input).slice(-25).map((run, index) => {
      const clean = deepSanitize(isPlainObject(run) ? run : {}, report, ['ai_runs', String(index)]);
      return Object.assign({}, clean, {run_id:clean.run_id || `MIGRATED-RUN-${index + 1}`, run_version:TARGET_VERSION, provider:clean.provider || 'mock', task:clean.task || 'synthesis', status:clean.status || 'migrated', input_fingerprint:clean.input_fingerprint || 'migrated-input', response_type:clean.response_type || 'migrated_response', response_contract:clean.response_contract || {type:'migrated_response', required:[]}, output_summary:clean.output_summary || 'Migrated provider run. Revalidate before publication.', response_validation:clean.response_validation || {validation_version:TARGET_VERSION, accepted:false, issues:['migrated_run_requires_revalidation'], repair_required:false}, repair_trace:clean.repair_trace || {attempted:false, status:'not_required'}});
    });
  }
  function normalizeProviderConfig(input, report){
    const raw = isPlainObject(input) ? input : {};
    const sanitized = deepSanitize(raw, report, ['provider_config']);
    return {endpoint:String(sanitized.endpoint || 'https://api.openai.com/v1/chat/completions'), model:String(sanitized.model || 'gpt-4.1-mini'), allow_live:false, remember_key:false};
  }
  function migrateResearchPacket(rawInput, options = {}){
    const targetVersion = options.targetVersion || TARGET_VERSION;
    const startedAt = nowIso();
    const report = {migration_version:MIGRATION_VERSION, source_version:detectSourceVersion(rawInput || {}), target_version:targetVersion, started_at:startedAt, completed_at:null, migrated:false, ok:false, migration_path:[], applied_steps:[], added_defaults:[], removed_sensitive_fields:[], warnings:[], import_safe:false};
    if(!isPlainObject(rawInput)){ report.completed_at = nowIso(); report.warnings.push('input_not_object'); return {ok:false, packet:null, report}; }
    const raw = clone(rawInput);
    report.migration_path = migrationPath(report.source_version, targetVersion);
    report.migrated = report.source_version !== targetVersion;
    if(report.source_version === 'unknown_legacy') addWarning(report, 'unknown_source_version_assumed_legacy_packet');
    for(const step of report.migration_path) addStep(report, step);
    const provider = ['mock','openai_compatible','backend_proxy','portable_oauth'].includes(raw.provider) ? raw.provider : 'mock';
    const plan = normalizePlan(raw.research_plan || raw.plan, raw, report);
    const evidence = normalizeEvidence(raw.evidence_matrix || raw.evidence, report);
    const links = normalizeCausalLinks(raw.causal_links, evidence, report);
    const packet = {workflow_version:targetVersion, generated_at:raw.generated_at || nowIso(), research_plan:plan, evidence_matrix:evidence, causal_links:links, analysis_brief:normalizeAnalysisBrief(raw.analysis_brief, plan, evidence, links, report), diagnostics:isPlainObject(raw.diagnostics) ? deepSanitize(raw.diagnostics, report, ['diagnostics']) : null, provider, provider_config:normalizeProviderConfig(raw.provider_config, report), provider_identity:isPlainObject(raw.provider_identity) ? deepSanitize(Object.assign(defaultProviderIdentity(provider), raw.provider_identity, {provider_id:provider}), report, ['provider_identity']) : defaultProviderIdentity(provider), provider_billing_policy:isPlainObject(raw.provider_billing_policy) ? deepSanitize(Object.assign(defaultBillingPolicy(provider), raw.provider_billing_policy, {provider_id:provider}), report, ['provider_billing_policy']) : defaultBillingPolicy(provider), portable_account:normalizePortableAccount(raw.portable_account, report), provider_validation:isPlainObject(raw.provider_validation) ? deepSanitize(raw.provider_validation, report, ['provider_validation']) : null, repair_trace:isPlainObject(raw.repair_trace) ? deepSanitize(raw.repair_trace, report, ['repair_trace']) : null, provider_diagnostics:isPlainObject(raw.provider_diagnostics) ? deepSanitize(raw.provider_diagnostics, report, ['provider_diagnostics']) : null, provider_fixture_report:isPlainObject(raw.provider_fixture_report) ? deepSanitize(raw.provider_fixture_report, report, ['provider_fixture_report']) : null, source_policy:isPlainObject(raw.source_policy) ? Object.assign(defaultSourcePolicy(), deepSanitize(raw.source_policy, report, ['source_policy']), {source_policy_version:targetVersion, live_fetching_enabled:false}) : defaultSourcePolicy(), source_diagnostics:isPlainObject(raw.source_diagnostics) ? deepSanitize(raw.source_diagnostics, report, ['source_diagnostics']) : null, source_fixture_report:isPlainObject(raw.source_fixture_report) ? deepSanitize(raw.source_fixture_report, report, ['source_fixture_report']) : null, source_requests:asArray(raw.source_requests).map((item, index) => deepSanitize(item, report, ['source_requests', String(index)])), source_runs:asArray(raw.source_runs).slice(-25).map((item, index) => deepSanitize(item, report, ['source_runs', String(index)])), source_imports:asArray(raw.source_imports).slice(-25).map((item, index) => deepSanitize(item, report, ['source_imports', String(index)])), evidence_review_queue:asArray(raw.evidence_review_queue).slice(-200).map((item, index) => deepSanitize(item, report, ['evidence_review_queue', String(index)])), evidence_review_report:isPlainObject(raw.evidence_review_report) ? deepSanitize(raw.evidence_review_report, report, ['evidence_review_report']) : null, source_import_report:isPlainObject(raw.source_import_report) ? deepSanitize(raw.source_import_report, report, ['source_import_report']) : null, ai_runs:normalizeAiRuns(raw.ai_runs, report), critique:isPlainObject(raw.critique) ? deepSanitize(raw.critique, report, ['critique']) : null, privacy_export:safePrivacyExport(), packet_migration_report:null};
    packet.provider_identity = Object.assign(defaultProviderIdentity(provider), packet.provider_identity, {provider_id:provider, key_exported:false, key_present:false, live_opt_in:false, live_ready:provider === 'mock'});
    packet.provider_billing_policy = Object.assign(defaultBillingPolicy(provider), packet.provider_billing_policy, {provider_id:provider});
    packet.privacy_export.redaction_applied = report.removed_sensitive_fields.length > 0;
    packet.privacy_export.safe = report.removed_sensitive_fields.length === 0;
    packet.privacy_export.issue_count = report.removed_sensitive_fields.length;
    packet.privacy_export.issues = report.removed_sensitive_fields.map((field) => ({path:field, code:'MIGRATION_REDACTED_SENSITIVE_FIELD', message:'Sensitive field was redacted during packet migration.'}));
    report.ok = true; report.import_safe = true; report.completed_at = nowIso(); packet.packet_migration_report = clone(report);
    return {ok:true, packet, report};
  }
  root.migrations = Object.freeze({MIGRATION_VERSION, TARGET_VERSION, SUPPORTED_SOURCES, migrateResearchPacket, detectSourceVersion, migrationPath});
})(typeof window !== 'undefined' ? window : globalThis);
