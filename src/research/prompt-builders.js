/* Jarbou3i Research Engine prompt builders v0.12.0-beta. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};
  function stringify(value){ return JSON.stringify(value, null, 2); }
  function buildPlanPrompt(input = {}){
    const version = input.version || '0.12.0-beta';
    const topic = input.topic || 'Unspecified strategic analysis topic';
    const context = input.context || 'Context not specified';
    const mode = input.mode || 'structural';
    return `You are a rigorous research-planning agent for Jarbou3i Research Engine.\n\nTopic: ${topic}\nContext: ${context}\nMode: ${mode}\n\nReturn JSON only with this shape:\n{\n  "plan_version": "${version}",\n  "topic": "string",\n  "context": "string",\n  "questions": ["string"],\n  "target_actors": ["string"],\n  "target_sources": ["official|academic|news|social|market|expert|primary|other"],\n  "keywords": ["string"],\n  "counter_evidence_targets": ["string"],\n  "early_warning_indicators": ["string"]\n}\n\nRules:\n- Separate observation, inference, and estimate.\n- Include counter-evidence targets.\n- Include early-warning indicators.\n- Do not generate the final strategic analysis yet.`;
  }
  function buildDeepResearchPrompt(input = {}){
    return `You are a deep-research agent feeding Jarbou3i Research Engine.\n\nUse the provided research packet to produce a source-disciplined strategic analysis.\n\nInput research packet:\n${stringify(input.packet || {})}\n\nTask:\n1. Identify missing evidence and source weaknesses.\n2. Cluster related evidence claims.\n3. Separate observation, inference, and estimate.\n4. Use causal_links only where evidence_ids are present.\n5. Produce a Jarbou3i strategic analysis JSON using Interests → Actors → Tools → Narrative → Results → Feedback.\n6. Include contradictions, scenarios, assumptions, evidence, counter-evidence, and falsifiers.\n7. Return JSON only.\n\nDo not claim that sources are verified unless URLs and dates are present.`;
  }
  function buildSynthesisPrompt(input = {}){
    return `You are the synthesis agent for Jarbou3i Research Engine.\n\nUse the compiled analysis brief and research packet to produce a schema-valid Jarbou3i strategic analysis JSON.\n\nCompiled analysis brief:\n${stringify(input.brief || {})}\n\nResearch packet:\n${stringify(input.packet || {})}\n\nRules:\n- Return JSON only.\n- Preserve schema_version = "1.1.0" for the strategic analysis object.\n- Use stable IDs: I1, A1, T1, N1, R1, F1, C1, S1, AS1.\n- Separate observation, inference, and estimate.\n- Every major claim must reference evidence IDs where possible.\n- Include counter-evidence and uncertainty.\n- Include scenario falsifiers under disproven_if.\n- Do not invent source verification.\n- If evidence is weak, lower confidence instead of overstating certainty.`;
  }
  root.prompts = {buildPlanPrompt, buildDeepResearchPrompt, buildSynthesisPrompt};
})(window);
