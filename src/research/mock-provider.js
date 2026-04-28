/* Jarbou3i Research Engine mock provider v0.17.0-beta. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};
  function response(payload, ctx = {}){
    const task = payload.task;
    if(task === 'plan') return {ok:true, type:'research_plan', data: ctx.buildResearchPlan(), warnings:['Mock provider: no external source search was performed.']};
    if(task === 'synthesis') return {ok:true, type:'strategic_analysis', data: ctx.buildMockAnalysis(), warnings:['Mock synthesis is deterministic and evidence-bounded.']};
    if(task === 'repair') return {ok:true, type:'repaired_strategic_analysis', data: ctx.buildMockAnalysis(), warnings:['Mock repair replaced invalid structure with schema-compatible deterministic output.']};
    if(task === 'critique') return {ok:true, type:'critique_report', data: ctx.buildCritique(), warnings:['Mock critique checks metadata and structural coverage only.']};
    const evidence = Array.isArray(ctx.evidence) ? ctx.evidence : [];
    const clampScore = ctx.clampScore || ((v) => Math.max(1, Math.min(5, Number(v) || 3)));
    const missingUrls = evidence.filter(e => !e.source_url).map(e => e.evidence_id);
    const missingDates = evidence.filter(e => !e.source_date || e.source_date === 'unknown').map(e => e.evidence_id);
    const weakTypes = evidence.filter(e => ['other','social'].includes(e.source_type) && clampScore(e.evidence_strength) < 4).map(e => e.evidence_id);
    const counterGaps = evidence.filter(e => !(e.contradicts || []).length).map(e => e.evidence_id);
    return {ok:true, type:'source_discipline_report', data:{missing_urls:missingUrls, missing_dates:missingDates, weak_source_types:weakTypes, counter_evidence_gaps:counterGaps, verdict: missingUrls.length || missingDates.length || counterGaps.length ? 'review_required' : 'source_metadata_ready'}, warnings:['This is metadata discipline, not factual source verification.']};
  }
  root.mockProvider = {response};
})(window);
