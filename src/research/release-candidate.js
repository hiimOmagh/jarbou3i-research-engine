/* Jarbou3i Research Engine release candidate freeze metadata v0.29.0-rc.1. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};
  const RELEASE_VERSION = '0.29.0-rc.1';
  const REQUIRED_GATES = Object.freeze([
    'test:qa:core',
    'test:privacy',
    'test:provider',
    'test:source',
    'test:backend',
    'test:export-pack',
    'test:quality',
    'test:migrations',
    'test:browser:provider'
  ]);
  const ALLOWED_WORK = Object.freeze(['bugfix','docs','qa','a11y','privacy_audit','migration_compatibility','release_packaging']);
  const BLOCKED_WORK = Object.freeze(['new_major_feature','new_live_provider','new_source_connector','oauth_production_enablement','schema_break_without_migration','secret_export_weakening']);
  function releaseCandidatePolicy(options = {}){
    return {
      release_version: options.version || RELEASE_VERSION,
      release_stage: 'rc',
      rc_number: 1,
      freeze_status: 'feature_freeze',
      feature_freeze: true,
      breaking_changes_allowed: false,
      production_oauth_allowed: false,
      new_live_connectors_allowed: false,
      export_privacy_regression_allowed: false,
      allowed_work: ALLOWED_WORK.slice(),
      blocked_work: BLOCKED_WORK.slice(),
      required_gates: REQUIRED_GATES.slice(),
      gate_policy: 'all_required_gates_must_pass_before_v1',
      release_notes_required: true,
      known_sandbox_limitation: 'aggregate child-process wrappers can timeout in this sandbox; individual gates are authoritative until CI confirms aggregate behavior',
      verdict: 'release_candidate_freeze_active'
    };
  }
  function gateStatus(name, passed = false, notes = ''){
    return {gate:name, required:REQUIRED_GATES.includes(name), passed:!!passed, notes:String(notes || '')};
  }
  function buildReleaseCandidateReport(packet = {}, options = {}){
    const policy = releaseCandidatePolicy(options);
    const privacy = packet.privacy_export || {};
    const quality = packet.quality_gate || {};
    const migration = packet.packet_migration_report || {};
    const oauth = packet.portable_oauth_spike || {};
    const search = packet.search_policy || {};
    const gates = [
      gateStatus('privacy_release_gate', privacy.release_gate === 'pass' && privacy.raw_token_exported === false && privacy.refresh_token_exported === false && privacy.access_token_exported === false, privacy.release_gate || 'unknown'),
      gateStatus('quality_gate_present', !!quality.quality_gate_version, quality.publication_readiness || 'unknown'),
      gateStatus('migration_report_present', !!migration.target_version || packet.workflow_version === policy.release_version, migration.target_version || packet.workflow_version || 'unknown'),
      gateStatus('oauth_tokens_not_exported', oauth.raw_token_exported === false && oauth.access_token_exported === false && oauth.refresh_token_exported === false && oauth.code_verifier_exported === false, oauth.safety_verdict || 'oauth status unknown'),
      gateStatus('search_remains_dry_run', search.live_search_enabled === false, search.verdict || 'search policy missing')
    ];
    const blockers = [];
    if(privacy.release_gate && privacy.release_gate !== 'pass') blockers.push('privacy_release_gate_not_pass');
    if(oauth.raw_token_exported || oauth.access_token_exported || oauth.refresh_token_exported || oauth.code_verifier_exported) blockers.push('oauth_secret_export_risk');
    if(search.live_search_enabled) blockers.push('web_search_live_enabled_during_rc');
    if(packet.provider_config?.allow_live) blockers.push('provider_live_mode_enabled_in_export');
    return {
      release_candidate_version: policy.release_version,
      generated_at: new Date().toISOString(),
      policy,
      gates,
      blockers,
      rc_ready: blockers.length === 0,
      verdict: blockers.length ? 'rc_blocked' : 'rc_freeze_ready_for_ci'
    };
  }
  root.releaseCandidate = Object.freeze({RELEASE_VERSION, REQUIRED_GATES, ALLOWED_WORK, BLOCKED_WORK, releaseCandidatePolicy, buildReleaseCandidateReport});
})(typeof window !== 'undefined' ? window : globalThis);
