/* Jarbou3i Research Engine privacy audit release gate v0.28.0-beta. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};
  const PRIVACY_AUDIT_VERSION = '0.28.0-beta';
  const DEFAULT_REDACTION = '[REDACTED_BY_PRIVACY_AUDIT]';

  const SAFE_DERIVED_KEY_PATTERNS = Object.freeze([/hash/i,/fingerprint/i,/^key_exported$/i,/^raw_token_exported$/i,/^access_token_exported$/i,/^refresh_token_exported$/i,/^secret_exported$/i,/^credential_exported$/i,/^has_/i,/_present$/i,/_enabled$/i,/_configured$/i,/_supported$/i,/_available$/i,/_state$/i,/^token_state$/i]);
  const SENSITIVE_KEY_PATTERNS = Object.freeze([
    {id:'access-token-key', pattern:/(^|[_-])access[_-]?token($|[_-])/i},
    {id:'refresh-token-key', pattern:/(^|[_-])refresh[_-]?token($|[_-])/i},
    {id:'raw-token-key', pattern:/(^|[_-])raw[_-]?token($|[_-])/i},
    {id:'id-token-key', pattern:/(^|[_-])id[_-]?token($|[_-])/i},
    {id:'generic-token-key', pattern:/^token$/i},
    {id:'authorization-key', pattern:/^authorization$/i},
    {id:'bearer-key', pattern:/^bearer$/i},
    {id:'api-key', pattern:/(^|[_-])api[_-]?key($|[_-])/i},
    {id:'secret-key', pattern:/(^|[_-])secret($|[_-])/i},
    {id:'client-secret-key', pattern:/(^|[_-])client[_-]?secret($|[_-])/i},
    {id:'private-key', pattern:/(^|[_-])private[_-]?key($|[_-])/i},
    {id:'password-key', pattern:/^password$/i},
    {id:'credential-key', pattern:/^credential(s)?$/i}
  ]);
  const SECRET_TEXT_PATTERNS = Object.freeze([
    {id:'bearer-token-text', pattern:/Bearer\s+[A-Za-z0-9._~+/=-]{12,}/i},
    {id:'openai-style-key-text', pattern:/sk-[A-Za-z0-9_-]{16,}/i},
    {id:'github-classic-token-text', pattern:/ghp_[A-Za-z0-9_]{16,}/i},
    {id:'github-fine-grained-token-text', pattern:/github_pat_[A-Za-z0-9_]{20,}/i},
    {id:'google-oauth-token-text', pattern:/ya29\.[A-Za-z0-9._-]{20,}/i},
    {id:'refresh-token-assignment-text', pattern:/refresh[_-]?token\s*[:=]\s*["'][^"']{8,}["']/i},
    {id:'access-token-assignment-text', pattern:/access[_-]?token\s*[:=]\s*["'][^"']{8,}["']/i},
    {id:'api-key-assignment-text', pattern:/api[_-]?key\s*[:=]\s*["'][^"']{12,}["']/i}
  ]);

  function isPlainObject(value){ return Object.prototype.toString.call(value) === '[object Object]'; }
  function pathText(path){ return path.length ? path.join('.') : '<root>'; }
  function preview(value){ return value === undefined ? undefined : '[REDACTED_PREVIEW]'; }
  function isSafeDerivedKey(key){ return SAFE_DERIVED_KEY_PATTERNS.some((pattern) => pattern.test(String(key || ''))); }
  function sensitiveKeyMatch(key){ const normalized = String(key || '').trim(); return (!normalized || isSafeDerivedKey(normalized)) ? null : (SENSITIVE_KEY_PATTERNS.find((entry) => entry.pattern.test(normalized)) || null); }
  function textPatternMatch(value){ return typeof value === 'string' ? (SECRET_TEXT_PATTERNS.find((entry) => entry.pattern.test(value)) || null) : null; }
  function hasExportableSensitiveValue(value){ return !(value === null || value === undefined || value === false || value === ''); }

  function scanNode(value, path, issues){
    if(Array.isArray(value)){ value.forEach((item, index) => scanNode(item, path.concat(String(index)), issues)); return; }
    if(isPlainObject(value)){
      for(const [key, entry] of Object.entries(value)){
        const nextPath = path.concat(key);
        const keyMatch = sensitiveKeyMatch(key);
        if(keyMatch && hasExportableSensitiveValue(entry)){
          issues.push({path:pathText(nextPath), code:'SENSITIVE_KEY_PRESENT', pattern_id:keyMatch.id, message:`Sensitive key "${key}" contains exportable data.`, value_preview:preview(typeof entry === 'string' ? entry : typeof entry)});
          continue;
        }
        scanNode(entry, nextPath, issues);
      }
      return;
    }
    const textMatch = textPatternMatch(value);
    if(textMatch) issues.push({path:pathText(path), code:'SECRET_LIKE_TEXT_PRESENT', pattern_id:textMatch.id, message:'Secret-like text is present in export payload.', value_preview:preview(value)});
  }

  function stripSensitiveKeys(value, path, issues){
    if(Array.isArray(value)) return value.map((item, index) => stripSensitiveKeys(item, path.concat(String(index)), issues));
    if(isPlainObject(value)){
      const out = {};
      for(const [key, entry] of Object.entries(value)){
        if(key === 'privacy_export') continue;
        const nextPath = path.concat(key);
        const keyMatch = sensitiveKeyMatch(key);
        if(keyMatch){
          if(hasExportableSensitiveValue(entry)) issues.push({path:pathText(nextPath), code:'SENSITIVE_KEY_REMOVED', pattern_id:keyMatch.id, message:`Sensitive key "${key}" was removed from final export payload.`, value_preview:preview(typeof entry === 'string' ? entry : typeof entry)});
          continue;
        }
        out[key] = stripSensitiveKeys(entry, nextPath, issues);
      }
      return out;
    }
    const textMatch = textPatternMatch(value);
    if(textMatch){
      issues.push({path:pathText(path), code:'SECRET_LIKE_TEXT_REDACTED_FINAL_PASS', pattern_id:textMatch.id, message:'Secret-like text was redacted during final export pass.', value_preview:preview(value)});
      return DEFAULT_REDACTION;
    }
    return value;
  }

  function scanPrivacyPayload(payload){
    const issues = [];
    scanNode(payload, [], issues);
    return {audit_version:PRIVACY_AUDIT_VERSION, safe:issues.length === 0, issue_count:issues.length, issues, patterns_checked:SECRET_TEXT_PATTERNS.map((entry) => entry.id), sensitive_key_classes_checked:SENSITIVE_KEY_PATTERNS.map((entry) => entry.id)};
  }

  function sanitizeAndAuditPrivacyPayload(payload, options = {}){
    const guard = root.privacyExportGuard;
    const before = scanPrivacyPayload(payload);
    let sanitizedPayload = payload === undefined ? undefined : JSON.parse(JSON.stringify(payload));
    let guardReport = {guard_version:options.version || PRIVACY_AUDIT_VERSION, issue_count:0, issues:[], redaction_applied:false};
    if(guard && typeof guard.sanitizePrivacyExport === 'function'){
      const guarded = guard.sanitizePrivacyExport(payload, {redaction:DEFAULT_REDACTION});
      sanitizedPayload = guarded.sanitized_payload;
      guardReport = guarded.privacy_export;
    }
    const finalPassIssues = [];
    sanitizedPayload = stripSensitiveKeys(sanitizedPayload, [], finalPassIssues);
    const after = scanPrivacyPayload(sanitizedPayload);
    const report = {audit_version:PRIVACY_AUDIT_VERSION, guard_version:guardReport.guard_version || options.version || PRIVACY_AUDIT_VERSION, safe:after.safe, release_gate:after.safe ? 'pass' : 'fail', issue_count:after.issue_count, pre_redaction_issue_count:before.issue_count, post_redaction_issue_count:after.issue_count, raw_token_exported:false, access_token_exported:false, refresh_token_exported:false, key_exported:false, secret_exported:false, credential_exported:false, redaction_applied:before.issue_count > 0 || finalPassIssues.length > 0 || !!guardReport.redaction_applied, patterns_checked:after.patterns_checked, sensitive_key_classes_checked:after.sensitive_key_classes_checked, issues:after.issues, redacted_issues:(guardReport.issues || before.issues).concat(finalPassIssues), scanner:{pre_redaction_safe:before.safe, post_redaction_safe:after.safe, final_payload_checked:true}};
    return {sanitized_payload:sanitizedPayload, privacy_export:report, before, after};
  }

  function createPrivacySafeExportPayload(payload, options = {}){ const result = sanitizeAndAuditPrivacyPayload(payload, options); return isPlainObject(result.sanitized_payload) ? Object.assign({}, result.sanitized_payload, {privacy_export:result.privacy_export}) : {payload:result.sanitized_payload, privacy_export:result.privacy_export}; }
  function assertPrivacyReleaseGate(payload, options = {}){ const audit = scanPrivacyPayload(payload); if(!audit.safe && options.throw !== false){ const detail = audit.issues.map((item) => `${item.path}: ${item.code}/${item.pattern_id}`).join('\n'); const err = new Error(`Privacy release gate failed.\n${detail}`); err.name = 'PrivacyReleaseGateError'; err.privacy_audit = audit; throw err; } return audit; }

  root.privacyAudit = Object.freeze({PRIVACY_AUDIT_VERSION, scanPrivacyPayload, sanitizeAndAuditPrivacyPayload, createPrivacySafeExportPayload, assertPrivacyReleaseGate, isSafeDerivedKey, sensitiveKeyMatch});
  if(typeof module !== 'undefined' && module.exports) module.exports = root.privacyAudit;
})(typeof window !== 'undefined' ? window : globalThis);
