/* Jarbou3i Research Engine quality gate v0.18.0-beta. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};
  function calculateQualityScores(state, deps = {}){
    const evidenceReviewReport = deps.evidenceReviewReport || (() => ({queue_count:0, resolved_count:0}));
    const providerSafetyReport = deps.providerSafetyReport || (() => ({provider:'mock', key_exported:false, provider_identity:{}}));
    const evCount = state.evidence.length;
    const urlCount = state.evidence.filter(e=>e.source_url).length;
    const datedCount = state.evidence.filter(e=>e.source_date && e.source_date !== 'unknown').length;
    const counterCount = state.evidence.filter(e=>e.contradicts?.length).length;
    const sourceTypes = new Set(state.evidence.map(e=>e.source_type).filter(Boolean));
    const plan = state.plan ? 100 : 0;
    const evidence = Math.min(100, evCount * 14 + urlCount * 8 + datedCount * 6 + counterCount * 8);
    const causal = Math.min(100, state.causal_links.length * 25);
    const critique = state.critique ? 85 : 0;
    const compiler = state.analysis_brief ? Math.min(100, 40 + (state.analysis_brief.source_clusters || []).length * 8 + (state.analysis_brief.gaps?.length ? 10 : 30)) : 0;
    const acceptedRuns = (state.ai_runs || []).filter(run => run.status === 'ok' || run.status === 'repaired');
    const provider = Math.min(100, acceptedRuns.length * 25 + ((state.ai_runs || []).some(run => run.task === 'critique' && (run.status === 'ok' || run.status === 'repaired')) ? 15 : 0));
    const responseValidation = Math.min(100, acceptedRuns.filter(run => run.response_validation?.accepted).length * 25 + ((state.ai_runs || []).some(run => run.status === 'validation_error') ? 0 : 20));
    const contractFixtures = state.provider_fixture_report ? Math.round((state.provider_fixture_report.pass_count / Math.max(1, state.provider_fixture_report.fixture_count)) * 100) : 0;
    const sourcePlanning = state.last_source_request ? 80 : 0;
    const sourcePolicyScore = state.source_policy?.live_fetching_enabled === false && state.source_policy?.verdict === 'safe_planning_layer_only' ? 100 : (state.source_policy ? 60 : 0);
    const sourceFixtures = state.source_fixture_report ? Math.round((state.source_fixture_report.pass_count / Math.max(1, state.source_fixture_report.fixture_count)) * 100) : 0;
    const sourceImport = state.source_import_report ? Math.min(100, 40 + (state.source_import_report.converted_count || 0) * 12 + (state.source_import_report.url_count || 0) * 6 + (state.source_import_report.date_count || 0) * 4) : 0;
    const reviewReport = evidenceReviewReport();
    const evidenceReview = reviewReport.queue_count ? Math.round((reviewReport.resolved_count / Math.max(1, reviewReport.queue_count)) * 100) : 0;
    const safety = providerSafetyReport();
    const byok = safety.provider === 'mock' ? 100 : (safety.provider === 'backend_proxy' ? 100 : ((safety.endpoint_configured && safety.model_configured ? 45 : 0) + (safety.live_opt_in ? 20 : 0) + (safety.key_present ? 20 : 0) + (safety.key_exported === false ? 15 : 0)));
    const providerIdentityScore = Math.min(100, (safety.provider_identity?.provider_id ? 30 : 0) + (safety.auth_type ? 20 : 0) + (safety.billing_owner ? 20 : 0) + (safety.key_exported === false ? 15 : 0) + (safety.provider_identity?.live_blockers?.length ? 5 : 15));
    const backendProxy = safety.provider === 'backend_proxy' ? ((safety.endpoint_configured ? 40 : 0) + (safety.live_opt_in ? 30 : 0) + (safety.key_storage === 'server_environment_secret' ? 20 : 0) + (safety.key_exported === false ? 10 : 0)) : 0;
    const portable = safety.provider === 'portable_oauth' ? ((safety.portable_account?.connected ? 45 : 10) + (safety.portable_account?.token_present ? 20 : 0) + (safety.portable_account?.mock_only ? 15 : 0) + (safety.key_exported === false ? 20 : 0)) : 0;
    const source = Math.min(100, urlCount * 18 + datedCount * 14 + sourceTypes.size * 10);
    const diversity = Math.min(100, sourceTypes.size * 25);
    const counter = Math.min(100, counterCount * 34);
    const readiness = Math.min(100, Math.round((plan * 0.09) + (evidence * 0.14) + (source * 0.10) + (diversity * 0.05) + (counter * 0.07) + (causal * 0.09) + (compiler * 0.07) + (provider * 0.06) + (responseValidation * 0.07) + (contractFixtures * 0.05) + (sourcePlanning * 0.05) + (sourcePolicyScore * 0.04) + (sourceFixtures * 0.035) + (sourceImport * 0.035) + (evidenceReview * 0.05) + (critique * 0.08)));
    return {plan, evidence, causal, critique, compiler, provider, providerIdentity: providerIdentityScore, responseValidation, contractFixtures, sourcePlanning, sourcePolicyScore, sourceFixtures, sourceImport, evidenceReview, byok: Math.min(100, byok), backendProxy: Math.min(100, backendProxy), portable: Math.min(100, portable), source, diversity, counter, readiness};
  }
  root.qualityGate = {calculateQualityScores};
})(window);
