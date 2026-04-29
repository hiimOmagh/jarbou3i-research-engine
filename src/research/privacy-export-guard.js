/* Jarbou3i Research Engine privacy export guard v0.27.0-beta. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};
  const PRIVACY_EXPORT_GUARD_VERSION = '0.27.0-beta';
  const DEFAULT_REDACTION = '[REDACTED_BY_PRIVACY_EXPORT_GUARD]';

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
    /hash/i,
    /fingerprint/i,
    /^key_exported$/i,
    /^raw_token_exported$/i,
    /^access_token_exported$/i,
    /^refresh_token_exported$/i,
    /^secret_exported$/i,
    /^credential_exported$/i,
    /^has_/i,
    /_present$/i,
    /_enabled$/i,
    /_configured$/i,
    /_supported$/i,
    /_available$/i,
    /_state$/i
  ]);

  const DANGEROUS_TEXT_PATTERNS = Object.freeze([
    /Bearer\s+[A-Za-z0-9._~+/=-]{12,}/i,
    /sk-[A-Za-z0-9_-]{16,}/i,
    /ghp_[A-Za-z0-9_]{16,}/i,
    /github_pat_[A-Za-z0-9_]{20,}/i,
    /ya29\.[A-Za-z0-9._-]{20,}/i,
    /refresh[_-]?token\s*[:=]\s*["'][^"']{8,}["']/i,
    /access[_-]?token\s*[:=]\s*["'][^"']{8,}["']/i,
    /api[_-]?key\s*[:=]\s*["'][^"']{12,}["']/i
  ]);

  function normalizeKey(key){ return String(key ?? '').trim(); }
  function isPlainObject(value){ return Object.prototype.toString.call(value) === '[object Object]'; }

  function isSafeDerivedPrivacyKey(key){
    const normalized = normalizeKey(key);
    return SAFE_DERIVED_KEY_PATTERNS.some((pattern) => pattern.test(normalized));
  }

  function isSensitivePrivacyKey(key){
    const normalized = normalizeKey(key);
    if(!normalized) return false;
    if(isSafeDerivedPrivacyKey(normalized)) return false;
    return SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(normalized));
  }

  function containsDangerousSecretText(value){
    if(typeof value !== 'string') return false;
    return DANGEROUS_TEXT_PATTERNS.some((pattern) => pattern.test(value));
  }

  function redactValue(value, redaction){
    if(value === null || value === undefined || value === false || value === '') return value;
    return redaction;
  }

  function issue(issues, path, code, message, valuePreview){
    issues.push({
      path: path.length ? path.join('.') : '<root>',
      code,
      message,
      ...((valuePreview !== undefined) ? {value_preview:'[REDACTED_PREVIEW]'} : {})
    });
  }

  function sanitizeNode(value, path, issues, options){
    const redaction = options.redaction || DEFAULT_REDACTION;
    if(Array.isArray(value)) return value.map((item, index) => sanitizeNode(item, path.concat(String(index)), issues, options));
    if(isPlainObject(value)){
      const clean = {};
      for(const [key, entry] of Object.entries(value)){
        if(key === 'privacy_export') continue;
        const nextPath = path.concat(key);
        if(isSensitivePrivacyKey(key)){
          if(entry !== null && entry !== undefined && entry !== false && entry !== ''){
            issue(issues, nextPath, 'SENSITIVE_KEY_REDACTED', `Sensitive export key "${key}" was redacted.`, typeof entry === 'string' ? entry : typeof entry);
          }
          clean[key] = redactValue(entry, redaction);
          continue;
        }
        clean[key] = sanitizeNode(entry, nextPath, issues, options);
      }
      return clean;
    }
    if(containsDangerousSecretText(value)){
      issue(issues, path, 'SECRET_LIKE_TEXT_REDACTED', 'Secret-like text pattern was redacted from export payload.', value);
      return redaction;
    }
    return value;
  }

  function auditPrivacyExport(payload){
    const issues = [];
    sanitizeNode(payload, [], issues, {redaction:DEFAULT_REDACTION});
    return {safe: issues.length === 0, issue_count: issues.length, issues};
  }

  function sanitizePrivacyExport(payload, options = {}){
    const issues = [];
    const sanitized_payload = sanitizeNode(payload, [], issues, options);
    return {
      sanitized_payload,
      privacy_export: {
        guard_version: PRIVACY_EXPORT_GUARD_VERSION,
        safe: issues.length === 0,
        issue_count: issues.length,
        raw_token_exported: false,
        access_token_exported: false,
        refresh_token_exported: false,
        key_exported: false,
        secret_exported: false,
        credential_exported: false,
        redaction_applied: issues.length > 0,
        issues
      }
    };
  }

  function attachPrivacyExportReport(payload, options = {}){
    const result = sanitizePrivacyExport(payload, options);
    if(isPlainObject(result.sanitized_payload)){
      return Object.assign({}, result.sanitized_payload, {privacy_export: result.privacy_export});
    }
    return {payload: result.sanitized_payload, privacy_export: result.privacy_export};
  }

  function assertPrivacyExportSafe(payload, options = {}){
    const report = auditPrivacyExport(payload);
    if(!report.safe && options.throw !== false){
      const detail = report.issues.map((item) => `${item.path}: ${item.code}`).join('\n');
      const err = new Error(`Privacy export is unsafe.\n${detail}`);
      err.name = 'PrivacyExportUnsafeError';
      err.privacy_report = report;
      throw err;
    }
    return report;
  }

  const api = {PRIVACY_EXPORT_GUARD_VERSION, isSafeDerivedPrivacyKey, isSensitivePrivacyKey, containsDangerousSecretText, auditPrivacyExport, sanitizePrivacyExport, attachPrivacyExportReport, assertPrivacyExportSafe};
  root.privacyExportGuard = api;
  if(typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
