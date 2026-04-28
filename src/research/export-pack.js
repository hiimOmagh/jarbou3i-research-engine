/* Jarbou3i Research Engine Export Pack v2 — v0.24.0-beta. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};
  const EXPORT_PACK_VERSION = '0.24.0-beta';
  const EXPORT_PACK_NAME = 'Export Pack v2';

  function nowIso(){ return new Date().toISOString(); }
  function isPlainObject(value){ return Object.prototype.toString.call(value) === '[object Object]'; }
  function clone(value){ return value === undefined ? undefined : JSON.parse(JSON.stringify(value)); }
  function asArray(value){ return Array.isArray(value) ? value : []; }
  function safeString(value){ return String(value ?? ''); }
  function csvCell(value){
    const text = Array.isArray(value) ? value.join('|') : safeString(value);
    return /[",\n\r]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
  }
  function rowsToCsv(rows){ return rows.map((row) => row.map(csvCell).join(',')).join('\n') + '\n'; }
  function jsonContent(value){ return JSON.stringify(value, null, 2) + '\n'; }
  function byteLength(text){ return new TextEncoder().encode(String(text ?? '')).length; }
  function checksum(text){
    const input = String(text ?? '');
    let hash = 2166136261;
    for(let i = 0; i < input.length; i += 1){ hash ^= input.charCodeAt(i); hash = Math.imul(hash, 16777619); }
    return (hash >>> 0).toString(16).padStart(8, '0');
  }
  function privacySafeObject(payload, options = {}){
    if(root.exportController && typeof root.exportController.privacySafeExportPayload === 'function') return root.exportController.privacySafeExportPayload(payload, {version:options.version || EXPORT_PACK_VERSION});
    if(root.privacyAudit && typeof root.privacyAudit.createPrivacySafeExportPayload === 'function') return root.privacyAudit.createPrivacySafeExportPayload(payload, {version:options.version || EXPORT_PACK_VERSION});
    return clone(payload);
  }
  function privacySafeText(text, options = {}){
    const audit = root.privacyAudit;
    if(audit && typeof audit.sanitizeAndAuditPrivacyPayload === 'function'){
      const result = audit.sanitizeAndAuditPrivacyPayload({file_content:safeString(text)}, {version:options.version || EXPORT_PACK_VERSION});
      return safeString(result.sanitized_payload?.file_content ?? text);
    }
    return safeString(text);
  }
  function fileEntry(path, mimeType, content, kind){
    const safeContent = privacySafeText(content);
    return {path, kind:kind || 'artifact', mime_type:mimeType, content:safeContent, bytes:byteLength(safeContent), checksum:checksum(safeContent)};
  }
  function markdownList(items){ return asArray(items).length ? asArray(items).map((item) => `- ${safeString(item)}`).join('\n') : '- None recorded'; }
  function evidenceMatrixCsv(packet){
    const rows = [['evidence_id','claim','source_title','source_url','source_type','source_date','time_relevance_score','evidence_strength','public_signal_score','confidence','supports','contradicts','notes']];
    asArray(packet.evidence_matrix).forEach((item) => rows.push([item.evidence_id, item.claim, item.source_title, item.source_url, item.source_type, item.source_date, item.time_relevance_score, item.evidence_strength, item.public_signal_score, item.confidence, asArray(item.supports).join('|'), asArray(item.contradicts).join('|'), item.notes]));
    return rowsToCsv(rows);
  }
  function reviewQueueCsv(packet){
    const rows = [['review_id','import_id','status','created_at','decision_at','accepted_evidence_id','claim','source_title','source_url','source_type','source_date','review_notes']];
    asArray(packet.evidence_review_queue).forEach((item) => {
      const evidence = item.evidence || item.candidate || {};
      rows.push([item.review_id, item.import_id, item.status, item.created_at, item.decision_at, item.accepted_evidence_id, evidence.claim, evidence.source_title, evidence.source_url, evidence.source_type, evidence.source_date, item.review_notes]);
    });
    return rowsToCsv(rows);
  }
  function providerRunLedger(packet){
    return privacySafeObject({workflow_version:packet.workflow_version || EXPORT_PACK_VERSION, generated_at:nowIso(), ledger_version:EXPORT_PACK_VERSION, provider:packet.provider || 'mock', provider_identity:packet.provider_identity || null, provider_diagnostics:packet.provider_diagnostics || null, provider_validation:packet.provider_validation || null, repair_trace:packet.repair_trace || null, ai_runs:asArray(packet.ai_runs)});
  }
  function qualityReport(packet){
    return privacySafeObject({workflow_version:packet.workflow_version || EXPORT_PACK_VERSION, generated_at:nowIso(), quality_report_version:EXPORT_PACK_VERSION, quality_gate:packet.quality_gate || null, analysis_brief_quality_gate_report:packet.analysis_brief?.quality_gate_report || null, diagnostics:packet.diagnostics || null, evidence_review_report:packet.evidence_review_report || null});
  }
  function privacyAuditReport(packet, files){
    const audit = root.privacyAudit;
    const fileReports = asArray(files).map((file) => {
      const report = audit && typeof audit.scanPrivacyPayload === 'function' ? audit.scanPrivacyPayload({path:file.path, content:file.content}) : {safe:true, issue_count:0, issues:[]};
      return {path:file.path, mime_type:file.mime_type, bytes:file.bytes, checksum:file.checksum, safe:report.safe, issue_count:report.issue_count, issues:report.issues || []};
    });
    const allSafe = fileReports.every((item) => item.safe);
    return privacySafeObject({workflow_version:packet.workflow_version || EXPORT_PACK_VERSION, generated_at:nowIso(), privacy_audit_version:EXPORT_PACK_VERSION, export_pack_version:EXPORT_PACK_VERSION, release_gate:allSafe && packet.privacy_export?.release_gate !== 'fail' ? 'pass' : 'fail', packet_privacy_export:packet.privacy_export || null, file_reports:fileReports, raw_token_exported:false, access_token_exported:false, refresh_token_exported:false, key_exported:false, secret_exported:false, credential_exported:false});
  }
  function analysisBriefMarkdown(packet){
    const brief = packet.analysis_brief || {};
    const template = packet.analysis_template || {};
    const quality = packet.quality_gate || brief.quality_gate_report || {};
    const clusters = asArray(brief.source_clusters).map((cluster) => `- ${safeString(cluster.cluster_id || cluster.layer || 'cluster')}: ${asArray(cluster.claims).join('; ') || 'No claims recorded'} (${asArray(cluster.evidence_ids).join(', ') || 'no evidence IDs'})`).join('\n') || '- No source clusters recorded';
    const links = asArray(packet.causal_links).map((link) => `- ${safeString(link.from)} ${safeString(link.relationship)} ${safeString(link.to)} — evidence: ${asArray(link.evidence_ids).join(', ') || 'none'}; confidence: ${safeString(link.confidence || 'unknown')}`).join('\n') || '- No causal links recorded';
    const evidence = asArray(packet.evidence_matrix).map((item) => `- ${safeString(item.evidence_id)}: ${safeString(item.claim)} — ${safeString(item.source_title || 'untitled source')}`).join('\n') || '- No evidence recorded';
    return [
      `# ${safeString(brief.topic || packet.research_plan?.topic || 'Jarbou3i Analysis Brief')}`,
      '',
      `**Context:** ${safeString(brief.context || packet.research_plan?.context || 'Not specified')}`,
      `**Template:** ${safeString(template.display_name || template.template_id || 'Strategic Analysis Engine')}`,
      `**Workflow version:** ${safeString(packet.workflow_version || EXPORT_PACK_VERSION)}`,
      `**Publication readiness:** ${safeString(quality.publication_readiness || 'review_required')} (${safeString(quality.overall_score ?? 'n/a')}/100)`,
      '',
      '## Handoff Summary',
      safeString(brief.handoff_summary || 'No handoff summary recorded.'),
      '',
      '## Research Questions',
      markdownList(brief.research_questions || packet.research_plan?.questions),
      '',
      '## Evidence Matrix',
      evidence,
      '',
      '## Source Clusters',
      clusters,
      '',
      '## Causal Links',
      links,
      '',
      '## Coverage Gaps',
      markdownList(brief.gaps || packet.diagnostics?.gaps),
      '',
      '## Synthesis Constraints',
      markdownList(brief.synthesis_constraints),
      '',
      '## Quality Gate Fix Actions',
      markdownList(quality.fix_actions),
      '',
      '## Privacy Status',
      `- Release gate: ${safeString(packet.privacy_export?.release_gate || 'unknown')}`,
      `- Post-redaction issues: ${safeString(packet.privacy_export?.post_redaction_issue_count ?? 'unknown')}`,
      ''
    ].join('\n');
  }
  function baseManifest(packet, files){
    return {export_pack_version:EXPORT_PACK_VERSION, name:EXPORT_PACK_NAME, generated_at:nowIso(), workflow_version:packet.workflow_version || EXPORT_PACK_VERSION, topic:packet.research_plan?.topic || packet.analysis_brief?.topic || 'Untitled research packet', file_count:files.length, files:files.map((file) => ({path:file.path, kind:file.kind, mime_type:file.mime_type, bytes:file.bytes, checksum:file.checksum})), privacy_release_gate:packet.privacy_export?.release_gate || 'unknown', quality_publication_readiness:packet.quality_gate?.publication_readiness || 'review_required'};
  }
  function createExportPack(packet, options = {}){
    const version = options.version || EXPORT_PACK_VERSION;
    const safePacket = privacySafeObject(Object.assign({}, packet || {}, {workflow_version:(packet && packet.workflow_version) || version}), {version});
    const files = [];
    files.push(fileEntry('research-packet.json', 'application/json', jsonContent(safePacket), 'packet'));
    files.push(fileEntry('analysis-brief.md', 'text/markdown', analysisBriefMarkdown(safePacket), 'brief'));
    files.push(fileEntry('evidence-matrix.csv', 'text/csv', evidenceMatrixCsv(safePacket), 'evidence'));
    files.push(fileEntry('review-queue.csv', 'text/csv', reviewQueueCsv(safePacket), 'review'));
    files.push(fileEntry('provider-run-ledger.json', 'application/json', jsonContent(providerRunLedger(safePacket)), 'provider-ledger'));
    files.push(fileEntry('quality-report.json', 'application/json', jsonContent(qualityReport(safePacket)), 'quality'));
    files.push(fileEntry('privacy-audit.json', 'application/json', jsonContent(privacyAuditReport(safePacket, files)), 'privacy'));
    const manifest = baseManifest(safePacket, files);
    files.unshift(fileEntry('export-manifest.json', 'application/json', jsonContent(manifest), 'manifest'));
    return {export_pack_version:EXPORT_PACK_VERSION, generated_at:nowIso(), manifest, files, privacy_release_gate:manifest.privacy_release_gate, file_count:files.length};
  }
  function downloadFile(file){
    if(!global.document || typeof Blob === 'undefined') return false;
    const blob = new Blob([file.content], {type:file.mime_type || 'text/plain'});
    const a = global.document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = file.path;
    global.document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 500);
    return true;
  }
  function downloadExportPack(packet, options = {}){
    const pack = createExportPack(packet, options);
    pack.files.forEach(downloadFile);
    return pack;
  }
  function exportPackSummaryHtml(pack, esc){
    const safeEsc = typeof esc === 'function' ? esc : (value) => safeString(value).replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
    const fileRows = asArray(pack.files).map((file) => `<span>${safeEsc(file.path)} · ${safeEsc(file.bytes)} B</span>`).join('');
    return `<div class="researchJsonCard exportPackCard"><h4>Export Pack v2</h4><div class="miniChips"><span>${safeEsc(pack.file_count)} files</span><span>privacy:${safeEsc(pack.privacy_release_gate)}</span><span>${safeEsc(pack.export_pack_version)}</span></div><div class="miniChips">${fileRows}</div><small>Downloaded as separate files for GitHub, archive, Claude/ChatGPT handoff, or publication pipeline.</small></div>`;
  }
  root.exportPack = Object.freeze({EXPORT_PACK_VERSION, EXPORT_PACK_NAME, createExportPack, downloadExportPack, evidenceMatrixCsv, reviewQueueCsv, analysisBriefMarkdown, providerRunLedger, qualityReport, privacyAuditReport, exportPackSummaryHtml});
  if(typeof module !== 'undefined' && module.exports) module.exports = root.exportPack;
})(typeof window !== 'undefined' ? window : globalThis);
