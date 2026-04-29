/* Jarbou3i Research Engine quality gate v1.0.0 — Advanced Quality Gate v3. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};
  const QUALITY_GATE_VERSION = '1.0.0';
  const LAYERS = Object.freeze(['interests','actors','tools','narrative','results','feedback']);
  function clamp(value){ const n = Number(value); return Math.max(0, Math.min(100, Number.isFinite(n) ? Math.round(n) : 0)); }
  function arr(value){ return Array.isArray(value) ? value : []; }
  function asSet(items){ return new Set(arr(items).filter(Boolean)); }
  function idsFromEvidence(evidence, key){ return arr(evidence).flatMap((item) => arr(item?.[key])); }
  function layerFromId(id){
    const prefix = String(id || '').match(/^[A-Z]+/)?.[0] || '';
    return {I:'interests', A:'actors', T:'tools', N:'narrative', R:'results', F:'feedback', S:'scenarios', C:'contradictions'}[prefix] || 'other';
  }
  function countLayerCoverage(state){
    const ids = idsFromEvidence(state.evidence, 'supports').concat(idsFromEvidence(state.evidence, 'contradicts'));
    const linkIds = arr(state.causal_links).flatMap((link) => [link?.from, link?.to]);
    const coverage = {};
    for(const layer of LAYERS) coverage[layer] = 0;
    for(const id of ids.concat(linkIds)){
      const layer = layerFromId(id);
      if(layer in coverage) coverage[layer] += 1;
    }
    return coverage;
  }
  function evidenceReviewReportFrom(deps){
    const fn = deps.evidenceReviewReport || (() => ({queue_count:0, resolved_count:0, accepted_count:0, rejected_count:0}));
    try { return fn() || {queue_count:0, resolved_count:0}; } catch(_) { return {queue_count:0, resolved_count:0}; }
  }
  function providerSafetyFrom(deps){
    const fn = deps.providerSafetyReport || (() => ({provider:'mock', key_exported:false, provider_identity:{}}));
    try { return fn() || {provider:'mock', key_exported:false, provider_identity:{}}; } catch(_) { return {provider:'mock', key_exported:false, provider_identity:{}}; }
  }
  function basicScores(state, deps = {}){
    const evidence = arr(state.evidence);
    const links = arr(state.causal_links);
    const evCount = evidence.length;
    const urlCount = evidence.filter(e=>e.source_url).length;
    const datedCount = evidence.filter(e=>e.source_date && e.source_date !== 'unknown').length;
    const counterCount = evidence.filter(e=>arr(e.contradicts).length).length;
    const sourceTypes = asSet(evidence.map(e=>e.source_type));
    const plan = state.plan ? 100 : 0;
    const evidenceScore = clamp(evCount * 14 + urlCount * 8 + datedCount * 6 + counterCount * 8);
    const causal = clamp(links.length * 25);
    const critique = state.critique ? 85 : 0;
    const compiler = state.analysis_brief ? clamp(40 + arr(state.analysis_brief.source_clusters).length * 8 + (arr(state.analysis_brief.gaps).length ? 10 : 30)) : 0;
    const acceptedRuns = arr(state.ai_runs).filter(run => run.status === 'ok' || run.status === 'repaired');
    const provider = clamp(acceptedRuns.length * 25 + (arr(state.ai_runs).some(run => run.task === 'critique' && (run.status === 'ok' || run.status === 'repaired')) ? 15 : 0));
    const responseValidation = clamp(acceptedRuns.filter(run => run.response_validation?.accepted).length * 25 + (arr(state.ai_runs).some(run => run.status === 'validation_error') ? 0 : 20));
    const contractFixtures = state.provider_fixture_report ? clamp((state.provider_fixture_report.pass_count / Math.max(1, state.provider_fixture_report.fixture_count)) * 100) : 0;
    const sourcePlanning = state.last_source_request ? 80 : 0;
    const sourcePolicyScore = state.source_policy?.live_fetching_enabled === false && state.source_policy?.verdict === 'safe_planning_layer_only' ? 100 : (state.source_policy ? 60 : 0);
    const sourceFixtures = state.source_fixture_report ? clamp((state.source_fixture_report.pass_count / Math.max(1, state.source_fixture_report.fixture_count)) * 100) : 0;
    const sourceImport = state.source_import_report ? clamp(40 + (state.source_import_report.converted_count || 0) * 12 + (state.source_import_report.url_count || 0) * 6 + (state.source_import_report.date_count || 0) * 4) : 0;
    const templateFit = state.analysis_template_id ? clamp((state.analysis_brief?.template_fit_report?.fit_score) || (state.analysis_template ? 70 : 50)) : 0;
    const reviewReport = evidenceReviewReportFrom(deps);
    const evidenceReview = reviewReport.queue_count ? clamp((reviewReport.resolved_count / Math.max(1, reviewReport.queue_count)) * 100) : 0;
    const safety = providerSafetyFrom(deps);
    const byok = safety.provider === 'mock' ? 100 : (safety.provider === 'backend_proxy' ? 100 : ((safety.endpoint_configured && safety.model_configured ? 45 : 0) + (safety.live_opt_in ? 20 : 0) + (safety.key_present ? 20 : 0) + (safety.key_exported === false ? 15 : 0)));
    const providerIdentityScore = clamp((safety.provider_identity?.provider_id ? 30 : 0) + (safety.auth_type ? 20 : 0) + (safety.billing_owner ? 20 : 0) + (safety.key_exported === false ? 15 : 0) + (arr(safety.provider_identity?.live_blockers).length ? 5 : 15));
    const backendProxy = safety.provider === 'backend_proxy' ? ((safety.endpoint_configured ? 40 : 0) + (safety.live_opt_in ? 30 : 0) + (safety.key_storage === 'server_environment_secret' ? 20 : 0) + (safety.key_exported === false ? 10 : 0)) : 0;
    const portable = safety.provider === 'portable_oauth' ? ((safety.portable_account?.connected ? 45 : 10) + (safety.portable_account?.token_present ? 20 : 0) + (safety.portable_account?.mock_only ? 15 : 0) + (safety.key_exported === false ? 20 : 0)) : 0;
    const source = clamp(urlCount * 18 + datedCount * 14 + sourceTypes.size * 10);
    const diversity = clamp(sourceTypes.size * 25);
    const counter = clamp(counterCount * 34);
    const readiness = clamp((plan * 0.09) + (evidenceScore * 0.14) + (source * 0.10) + (diversity * 0.05) + (counter * 0.07) + (causal * 0.09) + (compiler * 0.07) + (provider * 0.06) + (responseValidation * 0.07) + (contractFixtures * 0.05) + (sourcePlanning * 0.05) + (sourcePolicyScore * 0.04) + (sourceFixtures * 0.035) + (sourceImport * 0.035) + (evidenceReview * 0.05) + (templateFit * 0.04) + (critique * 0.04));
    return {plan, evidence:evidenceScore, causal, critique, compiler, templateFit, provider, providerIdentity: providerIdentityScore, responseValidation, contractFixtures, sourcePlanning, sourcePolicyScore, sourceFixtures, sourceImport, evidenceReview, byok: clamp(byok), backendProxy: clamp(backendProxy), portable: clamp(portable), source, diversity, counter, readiness};
  }
  function readinessLabel(score, blockers){
    if(arr(blockers).length) return 'blocked';
    if(score >= 85) return 'publication_candidate';
    if(score >= 70) return 'research_ready';
    if(score >= 50) return 'reviewable_draft';
    return 'draft_only';
  }
  function severity(score){ return score >= 80 ? 'low' : (score >= 60 ? 'medium' : 'high'); }
  function calculateQualityGateV3Report(state = {}, deps = {}){
    const evidence = arr(state.evidence);
    const links = arr(state.causal_links);
    const sourceTypes = asSet(evidence.map(e=>e.source_type));
    const sourceUrlCount = evidence.filter(e=>e.source_url).length;
    const sourceDateCount = evidence.filter(e=>e.source_date && e.source_date !== 'unknown').length;
    const counterCount = evidence.filter(e=>arr(e.contradicts).length).length;
    const coverage = countLayerCoverage(state);
    const coveredCoreLayers = LAYERS.filter(layer => coverage[layer] > 0).length;
    const reviewReport = evidenceReviewReportFrom(deps);
    const safety = providerSafetyFrom(deps);
    const migration = state.packet_migration_report || {};
    const privacy = state.privacy_export || {safe:true, release_gate:'pass', raw_token_exported:false, access_token_exported:false, refresh_token_exported:false, post_redaction_issue_count:0, issue_count:0};
    const basic = basicScores(state, deps);
    const providerRuns = arr(state.ai_runs);
    const validatedRuns = providerRuns.filter(run => run.response_validation?.accepted).length;
    const dimensions = {
      completeness: clamp((state.plan ? 22 : 0) + (state.analysis_brief ? 18 : 0) + (state.critique ? 12 : 0) + Math.min(28, evidence.length * 4) + Math.min(20, links.length * 5)),
      evidence_strength: clamp(Math.min(55, evidence.length * 9) + Math.min(20, sourceUrlCount * 5) + Math.min(15, sourceDateCount * 4) + Math.min(10, evidence.reduce((sum, item) => sum + (Number(item.evidence_strength) || 0), 0) / Math.max(1, evidence.length) * 2)),
      contradiction_coverage: clamp(Math.min(60, counterCount * 25) + (arr(state.critique?.findings).some(f => String(f.type || '').includes('counter')) ? 20 : 0) + (arr(state.plan?.counter_evidence_targets).length ? 20 : 0)),
      source_diversity: clamp(Math.min(50, sourceTypes.size * 18) + Math.min(25, sourceUrlCount * 5) + Math.min(25, sourceDateCount * 5)),
      actor_layer_coverage: clamp((coveredCoreLayers / LAYERS.length) * 70 + (coverage.actors ? 15 : 0) + (coverage.interests ? 15 : 0)),
      causal_link_density: clamp(Math.min(60, links.length * 18) + Math.min(25, links.filter(link => arr(link.evidence_ids).length).length * 10) + (coveredCoreLayers >= 5 ? 15 : 0)),
      provider_safety: clamp((safety.key_exported === false ? 25 : 0) + (safety.provider_identity?.provider_id ? 15 : 0) + (safety.billing_owner ? 15 : 0) + (validatedRuns ? 25 : 0) + (safety.provider === 'mock' || safety.provider === 'backend_proxy' ? 20 : 10)),
      privacy_safety: clamp((privacy.release_gate === 'pass' || privacy.safe === true ? 40 : 20) + (safety.key_exported === false ? 20 : 0) + (privacy.raw_token_exported === false || privacy.access_token_exported === false ? 20 : 0) + (privacy.post_redaction_issue_count === 0 || privacy.issue_count === 0 ? 20 : 0)),
      migration_safety: clamp((migration.ok === true || !migration.source_version ? 35 : 0) + (migration.import_safe === true || !migration.source_version ? 35 : 0) + (!arr(migration.removed_sensitive_fields).length ? 20 : 5) + (migration.target_version === QUALITY_GATE_VERSION || !migration.target_version ? 10 : 0)),
      template_fit: basic.templateFit
    };
    const weights = {completeness:0.13, evidence_strength:0.14, contradiction_coverage:0.10, source_diversity:0.11, actor_layer_coverage:0.10, causal_link_density:0.10, provider_safety:0.10, privacy_safety:0.10, migration_safety:0.06, template_fit:0.06};
    const overall = clamp(Object.entries(weights).reduce((sum, [key, weight]) => sum + dimensions[key] * weight, 0));
    const blockers = [];
    if(dimensions.privacy_safety < 80) blockers.push('privacy_safety_below_release_threshold');
    if(dimensions.migration_safety < 70) blockers.push('migration_safety_below_release_threshold');
    if(safety.key_exported !== false) blockers.push('provider_key_export_risk');
    if(privacy.raw_token_exported === true || privacy.access_token_exported === true || privacy.refresh_token_exported === true) blockers.push('raw_token_export_risk');
    const weakest_dimensions = Object.entries(dimensions).sort((a,b) => a[1] - b[1]).slice(0, 4).map(([dimension, score]) => ({dimension, score, severity: severity(score)}));
    const fix_actions = [];
    if(dimensions.evidence_strength < 70) fix_actions.push('Add traceable evidence with URLs, dates, source types, and stronger evidence_strength values.');
    if(dimensions.contradiction_coverage < 70) fix_actions.push('Add counter-evidence and contradiction-linked claims before treating the analysis as robust.');
    if(dimensions.source_diversity < 70) fix_actions.push('Diversify source types; avoid relying on one media or signal class.');
    if(dimensions.causal_link_density < 70) fix_actions.push('Add evidence-backed causal links across interests, actors, tools, narrative, results, and feedback.');
    if(dimensions.provider_safety < 80) fix_actions.push('Run provider dry-run/fixture validation and confirm key_exported remains false.');
    if(dimensions.privacy_safety < 80) fix_actions.push('Run privacy export audit and resolve all post-redaction issues before sharing.');
    if(dimensions.migration_safety < 70) fix_actions.push('Re-import through the migration layer and confirm packet_migration_report.import_safe is true.');
    if(!fix_actions.length) fix_actions.push('Proceed to publication review: manually verify sources, causal direction, and scenario falsifiers.');
    return {
      quality_gate_version: QUALITY_GATE_VERSION,
      generated_at: new Date().toISOString(),
      gate_name: 'Advanced Quality Gate v3',
      overall_score: overall,
      readiness_score: overall,
      publication_readiness: readinessLabel(overall, blockers),
      release_gate: blockers.length ? 'blocked' : (overall >= 70 ? 'pass' : 'review_required'),
      dimensions,
      dimension_weights: weights,
      weakest_dimensions,
      fix_actions,
      blockers,
      evidence_thresholds: {minimum_evidence_items:5, minimum_traceable_urls:3, minimum_source_dates:3, minimum_source_types:3, minimum_counter_evidence_items:1, minimum_causal_links:3},
      observed_counts: {evidence_items:evidence.length, traceable_urls:sourceUrlCount, source_dates:sourceDateCount, source_types:sourceTypes.size, counter_evidence_items:counterCount, causal_links:links.length, provider_runs:providerRuns.length, validated_provider_runs:validatedRuns, resolved_review_items:reviewReport.resolved_count || 0},
      layer_coverage: coverage,
      legacy_scores: basic
    };
  }
  function calculateQualityScores(state, deps = {}){
    const report = calculateQualityGateV3Report(state, deps);
    const legacy = report.legacy_scores;
    return Object.assign({}, legacy, {
      qualityV3: report.overall_score,
      completeness: report.dimensions.completeness,
      evidenceStrength: report.dimensions.evidence_strength,
      contradictionCoverage: report.dimensions.contradiction_coverage,
      sourceDiversity: report.dimensions.source_diversity,
      actorLayerCoverage: report.dimensions.actor_layer_coverage,
      causalLinkDensity: report.dimensions.causal_link_density,
      providerSafety: report.dimensions.provider_safety,
      privacySafety: report.dimensions.privacy_safety,
      migrationSafety: report.dimensions.migration_safety,
      publicationReadiness: report.publication_readiness,
      readiness: report.overall_score
    });
  }
  root.qualityGate = {QUALITY_GATE_VERSION, calculateQualityScores, calculateQualityGateV3Report, readinessLabel};
})(window);
