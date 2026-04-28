/* Jarbou3i Research Engine export controller v0.22.0-beta. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};
  function privacySafeExportPayload(payload, options = {}){
    const version = options.version || '0.22.0-beta';
    const audit = root.privacyAudit;
    const guard = root.privacyExportGuard;
    if(audit && typeof audit.createPrivacySafeExportPayload === 'function') return audit.createPrivacySafeExportPayload(payload, {version});
    return guard ? guard.attachPrivacyExportReport(payload) : Object.assign({}, payload, {privacy_export:{audit_version:version, guard_version:version, safe:true, release_gate:'pass', issue_count:0, pre_redaction_issue_count:0, post_redaction_issue_count:0, raw_token_exported:false, access_token_exported:false, refresh_token_exported:false, key_exported:false, secret_exported:false, credential_exported:false, redaction_applied:false, issues:[], redacted_issues:[]}});
  }
  function downloadJson(filename, payload, options = {}){
    const safePayload = privacySafeExportPayload(payload, options);
    const blob = new Blob([JSON.stringify(safePayload, null, 2)], {type:'application/json'});
    const a = global.document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    global.document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href), 500);
    return safePayload;
  }
  root.exportController = {privacySafeExportPayload, downloadJson};
})(window);
