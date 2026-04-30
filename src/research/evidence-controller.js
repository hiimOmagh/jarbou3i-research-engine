/* Jarbou3i Research Engine evidence controller v1.0.5. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};
  function idsFrom(value){ return String(value || '').split(',').map(x=>x.trim()).filter(Boolean); }
  function clampScore(v){ const n = Number(v); return Math.max(1, Math.min(5, Number.isFinite(n) ? n : 3)); }
  function validId(id){ return /^[A-Z]+\d+$/.test(String(id || '').trim()); }
  function normalizeEvidenceIds(ids){ return (ids || []).filter(id => /^E\d+$/.test(id)); }
  function layerFromId(id){ const prefix = String(id || '').replace(/\d+$/,''); return {I:'interests', A:'actors', T:'tools', N:'narrative', R:'results', F:'feedback'}[prefix] || 'unknown'; }
  function collectLinkedIds(evidence){ return [...new Set((evidence || []).flatMap(e => [...(e.supports || []), ...(e.contradicts || [])]).filter(validId))]; }
  root.evidenceController = {idsFrom, clampScore, validId, normalizeEvidenceIds, layerFromId, collectLinkedIds};
})(window);
