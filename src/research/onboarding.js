/* Jarbou3i Research Engine onboarding and first-run success helpers v1.0.6. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};
  const VERSION = '1.0.6';
  const STEPS = Object.freeze([
    { step_id:'topic', label:'Define topic', target:'topicInput', tab:'analysis', success:'topic_defined' },
    { step_id:'plan', label:'Generate research plan', target:'generatePlanBtn', tab:'analysis', success:'plan_ready' },
    { step_id:'evidence', label:'Add or import evidence', target:'evClaim', tab:'evidence', success:'evidence_ready' },
    { step_id:'review', label:'Review queue discipline', target:'evidenceReviewOutput', tab:'evidence', success:'review_queue_clear' },
    { step_id:'quality', label:'Check quality gate', target:'researchQualityOutput', tab:'quality', success:'quality_visible' },
    { step_id:'export', label:'Export safely', target:'exportPackBtn', tab:'quality', success:'export_path_visible' }
  ]);
  function nowIso(){ return new Date().toISOString(); }
  function uniqueStrings(value){ return Array.from(new Set(Array.isArray(value) ? value.filter(x => typeof x === 'string' && x.trim()) : [])); }
  function defaultOnboardingState({version = VERSION, now = nowIso()} = {}){
    return {
      onboarding_version: version,
      first_run: true,
      dismissed: false,
      started_at: now,
      updated_at: now,
      completed_step_ids: [],
      last_action: 'created',
      success_state: 'not_started'
    };
  }
  function migrateOnboardingState(input, {version = VERSION, now = nowIso()} = {}){
    const base = defaultOnboardingState({version, now});
    const next = Object.assign({}, base, input && typeof input === 'object' ? input : {});
    next.onboarding_version = version;
    next.first_run = next.first_run !== false;
    next.dismissed = !!next.dismissed;
    next.completed_step_ids = uniqueStrings(next.completed_step_ids).filter(id => STEPS.some(step => step.step_id === id));
    next.started_at = typeof next.started_at === 'string' && next.started_at ? next.started_at : now;
    next.updated_at = typeof next.updated_at === 'string' && next.updated_at ? next.updated_at : now;
    next.last_action = typeof next.last_action === 'string' ? next.last_action : 'migrated';
    next.success_state = typeof next.success_state === 'string' ? next.success_state : 'not_started';
    return next;
  }
  function stateSignals(workflow = {}){
    const evidence = Array.isArray(workflow.evidence) ? workflow.evidence : (Array.isArray(workflow.evidence_matrix) ? workflow.evidence_matrix : []);
    const reviewQueue = Array.isArray(workflow.evidence_review_queue) ? workflow.evidence_review_queue : [];
    const unresolvedReview = reviewQueue.filter(item => !['accepted','rejected'].includes(item && item.status)).length;
    const quality = workflow.quality_gate || workflow.quality_gate_report || {};
    const topicText = typeof workflow.topic === 'string' ? workflow.topic : '';
    return {
      topic_defined: !!(workflow.topic_defined || topicText.trim() || workflow.plan?.topic),
      plan_ready: !!workflow.plan || !!workflow.research_plan,
      evidence_ready: evidence.length > 0,
      review_queue_clear: unresolvedReview === 0,
      quality_visible: !!quality || !!workflow.quality_gate_available,
      export_path_visible: workflow.export_ready === true || !!workflow.export_pack
    };
  }
  function buildFirstRunChecklist(workflow = {}, onboarding = null){
    const signals = stateSignals(workflow);
    const completed = new Set(uniqueStrings(onboarding?.completed_step_ids));
    return STEPS.map((step, index) => {
      const done = !!signals[step.success] || completed.has(step.step_id);
      return Object.assign({}, step, { order:index + 1, done, status: done ? 'done' : 'open' });
    });
  }
  function completionRate(checklist){
    const items = Array.isArray(checklist) ? checklist : [];
    if(!items.length) return 0;
    return Math.round((items.filter(item => item.done).length / items.length) * 100);
  }
  function firstRunReport(workflow = {}, onboarding = null, {version = VERSION, now = nowIso()} = {}){
    const safe = migrateOnboardingState(onboarding, {version, now});
    const checklist = buildFirstRunChecklist(workflow, safe);
    const completion = completionRate(checklist);
    const firstOpen = checklist.find(item => !item.done) || null;
    const successState = completion >= 100 ? 'first_run_success' : (completion >= 50 ? 'in_progress' : 'not_started');
    return {
      onboarding_version: version,
      generated_at: now,
      first_run: safe.first_run,
      dismissed: safe.dismissed,
      completion_rate: completion,
      completed_steps: checklist.filter(item => item.done).map(item => item.step_id),
      open_steps: checklist.filter(item => !item.done).map(item => item.step_id),
      next_step_id: firstOpen ? firstOpen.step_id : null,
      next_step_label: firstOpen ? firstOpen.label : 'First-run path complete',
      checklist,
      success_state: successState,
      acceptance_criteria: [
        'A new user can identify the next action without opening advanced panels.',
        'Manual/private mode remains the default.',
        'No provider, OAuth, backend, or source behavior changes are introduced.',
        'First-run state is local-only and export-safe.'
      ],
      release_gate: 'first_run_success_checked'
    };
  }
  function markStep(onboarding, stepId, {version = VERSION, now = nowIso()} = {}){
    const next = migrateOnboardingState(onboarding, {version, now});
    if(STEPS.some(step => step.step_id === stepId) && !next.completed_step_ids.includes(stepId)) next.completed_step_ids.push(stepId);
    next.updated_at = now;
    next.last_action = `completed:${stepId}`;
    next.success_state = next.completed_step_ids.length >= STEPS.length ? 'first_run_success' : 'in_progress';
    return next;
  }
  function dismissOnboarding(onboarding, {version = VERSION, now = nowIso()} = {}){
    const next = migrateOnboardingState(onboarding, {version, now});
    next.dismissed = true;
    next.first_run = false;
    next.updated_at = now;
    next.last_action = 'dismissed';
    return next;
  }
  function resetOnboarding({version = VERSION, now = nowIso()} = {}){
    return Object.assign(defaultOnboardingState({version, now}), {last_action:'reset'});
  }
  root.onboarding = {VERSION, STEPS, defaultOnboardingState, migrateOnboardingState, buildFirstRunChecklist, completionRate, firstRunReport, markStep, dismissOnboarding, resetOnboarding};
})(window);
