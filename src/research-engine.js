/* Jarbou3i Research Engine v0.12.0-beta — source-assisted backend planning layer. Manual mode remains first-class. */
(function(){
  'use strict';

  const VERSION = '0.12.0-beta';
  const STORAGE_KEY = 'jarbou3i.researchEngine.alpha.v0.8';
  const BYOK_KEY_STORAGE = 'jarbou3i.researchEngine.byokKey.v0.8';
  const SUPPORTED_LANGS = ['ar','en','fr'];
  const RELATIONSHIPS = ['motivates','enables','constrains','contradicts','amplifies'];
  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const nowIso = () => new Date().toISOString();

  const COPY = {
    en: {
      researchTitle:'Research Workflow Lab',
      researchSubtitle:'Experimental research-to-strategy pipeline. Manual mode remains untouched; this layer builds plan, evidence, causal links, mock AI, critique, and Quality Gate v2.',
      alphaBadge:'v0.12.0-beta · source-assisted backend planning layer',
      planTitle:'1. Research Plan',
      planSubtitle:'Convert the topic into research questions, source targets, actor targets, counter-evidence targets, and early-warning indicators.',
      planMode:'Research mode',
      modeStructural:'Structural', modeRecent:'Recent signals', modeSourceHeavy:'Source-heavy', modeAdversarial:'Adversarial',
      generatePlan:'Generate research plan', copyPlanPrompt:'Copy plan prompt', clearPlan:'Clear plan', noPlan:'No research plan yet.',
      evidenceTitle:'2. Evidence Matrix',
      evidenceSubtitle:'Evidence becomes a first-class object before analysis. Each claim can support or contradict model layers.',
      claim:'Claim', sourceTitle:'Source title', sourceUrl:'Source URL', sourceType:'Source type', sourceDate:'Source date', strength:'Strength', timeRelevance:'Time relevance', publicSignal:'Public signal', supports:'Supports IDs', contradicts:'Contradicts IDs', confidence:'Confidence', notes:'Notes',
      addEvidence:'Add evidence', updateEvidence:'Update evidence', cancelEdit:'Cancel edit', loadDemoEvidence:'Load demo evidence', exportWorkflow:'Export research packet', importWorkflow:'Import research packet', clearEvidence:'Clear evidence', matrixEmpty:'Evidence matrix is empty.', edit:'Edit', remove:'Remove',
      causalTitle:'3. Causal Links', causalSubtitle:'Connect interests, actors, tools, narratives, results, feedback, and evidence into explicit causal claims.', linkFrom:'From', linkTo:'To', relationship:'Relationship', evidenceIds:'Evidence IDs', addCausalLink:'Add causal link', inferCausalLinks:'Infer from evidence', clearCausalLinks:'Clear links', causalEmpty:'No causal links yet.',
      compilerTitle:'4. Analysis Compiler', compilerSubtitle:'Compile evidence, source clusters, coverage gaps, and causal links into a synthesis-ready analysis brief.', compileBrief:'Compile analysis brief', copySynthesisPrompt:'Copy synthesis prompt', exportAnalysisBrief:'Export analysis brief', clearAnalysisBrief:'Clear brief', noAnalysisBrief:'No analysis brief compiled yet.', clusterTitle:'Source clusters', gapsTitle:'Coverage gaps', diagnosticsTitle:'Validation diagnostics', compilerScore:'Compiler', statusCompiled:'Analysis brief compiled.', statusBriefExported:'Analysis brief exported.', statusBriefCleared:'Analysis brief cleared.',
      providerTitle:'5. Provider Harness', providerSubtitle:'Provider-ready request contracts with mock, BYOK, and hosted backend proxy modes. Live calls require explicit opt-in.', providerName:'Provider', providerTask:'Task', providerEndpoint:'Endpoint', providerModel:'Model', providerApiKey:'API key', rememberProviderKey:'Remember locally on this device', enableLiveByok:'Enable live provider calls', providerSafety:'Safety: manual/private mode remains default. Keys are never exported into packets, reports, or run ledgers.', validateProviderSettings:'Validate provider settings', dryRunProviderRequest:'Build dry-run request', taskPlan:'Research plan', taskSynthesis:'Strategic synthesis', taskRepair:'JSON repair', taskCritique:'Critique', taskSourceDiscipline:'Source discipline', runProviderTask:'Run provider task', copyProviderPayload:'Copy provider payload', exportRunLedger:'Export run ledger', clearRunLedger:'Clear run ledger', runLedgerEmpty:'No provider runs yet.', providerScore:'Provider harness', byokScore:'BYOK safety', backendProxyScore:'Backend proxy', statusProviderRun:'Provider task completed.', statusProviderDryRun:'Provider payload built without live network call.', statusProviderSettingsSaved:'Provider settings validated and saved.', statusProviderLiveDisabled:'Live provider calls disabled; dry-run/mock response recorded.', statusProviderLiveError:'Live provider call failed; no key was stored in the run ledger.', statusBackendProxyReady:'Hosted backend proxy selected. Browser sends no provider key.', statusProviderValidationFailed:'Provider response rejected by contract validation.', statusProviderRepaired:'Provider response failed validation and was repaired through the controlled fallback.', responseValidationScore:'Response validation', statusLedgerExported:'Run ledger exported.', statusLedgerCleared:'Run ledger cleared.', previewProviderContract:'Preview contract', previewProviderPrompt:'Preview prompt', runProviderFixtureSuite:'Run fixture suite', exportProviderDiagnostics:'Export diagnostics', providerContractLabel:'Response contract', providerPromptLabel:'Prompt preview', providerDiagnosticsTitle:'Provider diagnostics', fixtureSuiteTitle:'Contract fixture suite', contractFixtureScore:'Contract fixtures', statusProviderContractPreviewed:'Provider response contract previewed.', statusProviderPromptPreviewed:'Provider prompt previewed.', statusProviderFixtureSuiteRun:'Provider fixture suite completed.', statusProviderDiagnosticsExported:'Provider diagnostics exported.', workflowTitle:'8. Mock AI Workflow', workflowSubtitle:'Legacy quick actions remain available, but provider harness is now the main AI integration path.', generateMock:'Generate mock analysis JSON', runMockRepair:'Run mock repair', runCritique:'Run mock critique', copyDeepPrompt:'Copy deep-research prompt',
      qualityTitle:'Quality Gate v2', planScore:'Plan', evidenceScore:'Evidence', causalScore:'Causal links', critiqueScore:'Critique', sourceScore:'Source discipline', diversityScore:'Source diversity', counterScore:'Counter-evidence', readiness:'Readiness',
      statusReady:'Research workflow ready for mock synthesis.', statusNeedPlan:'Generate a research plan first.', statusNeedEvidence:'Add evidence before synthesis.', statusGenerated:'Mock analysis JSON generated and placed in the import box.', statusRepaired:'Mock repair produced schema-compatible JSON.', statusCritiqued:'Mock critique generated.', statusImported:'Research packet imported.', statusExported:'Research packet exported.', statusEditing:'Evidence item loaded for editing.', statusLinkAdded:'Causal link added.', statusLinksInferred:'Causal links inferred from evidence.', statusInvalidPacket:'Invalid research packet.', statusInvalidLink:'Causal link requires From, To, and at least one evidence ID.', copied:'Copied.', copyFailed:'Copy failed. Use the visible text manually.',
      urlOptional:'https://example.com/source', claimPlaceholder:'Observable claim or research finding', sourcePlaceholder:'Publication, report, dataset, transcript, or note title', supportsPlaceholder:'I1,A1,T1', contradictsPlaceholder:'N1,R1', notesPlaceholder:'Why this evidence matters / uncertainty / limitations', sourcePlanningTitle:'6. Source Planning Layer', sourcePlanningSubtitle:'Plan future source-assisted research without live crawling or verification claims.', sourceConnector:'Connector', sourceTask:'Source task', sourceTaskPlan:'Source plan', sourceTaskQuery:'Query plan', sourceTaskClaim:'Claim extraction', sourceTaskScoring:'Evidence scoring', sourceTaskCluster:'Cluster plan', sourcePolicyNote:'Planning-only: no scraping, no live search, no source verification claims.', buildSourceTask:'Build source task', copySourceRequest:'Copy source request', runSourceFixtureSuite:'Run source fixture suite', exportSourcePolicy:'Export source policy', sourcePlanningScore:'Source planning', sourceFixtureScore:'Source fixtures', sourcePolicyScore:'Source policy', sourceDiagnosticsTitle:'Source diagnostics', sourceFixtureSuiteTitle:'Source fixture suite', statusSourceTaskBuilt:'Source task built. No live fetch was performed.', statusSourceRequestCopied:'Source request copied.', statusSourceFixtureSuiteRun:'Source fixture suite completed.', statusSourcePolicyExported:'Source policy exported.', sourceImportTitle:'7. Source Import Adapter', sourceImportSubtitle:'Paste deep-research / last30days-style outputs and convert them into Evidence Matrix candidates.', sourceImportFormat:'Import format', formatAuto:'Auto detect', sourceImportText:'Source output', sourceImportPlaceholder:'Paste external research output, source notes, links, or signal summaries here.', sourceImportPolicyNote:'Manual-only import: no fetch, no scraping, no verification claim.', previewSourceImport:'Preview import', importSourceEvidence:'Import as evidence', exportSourceImportReport:'Export import report', clearSourceImport:'Clear import', sourceImportScore:'Source import', sourceImportReportTitle:'Source import report', statusSourceImportPreviewed:'Source import preview generated.', statusSourceImported:'Source evidence imported into the matrix.', statusSourceImportCleared:'Source import cleared.', statusSourceImportReportExported:'Source import report exported.', statusSourceImportEmpty:'Paste source output before importing.'
    },
    ar: {
      researchTitle:'مختبر سير العمل البحثي',
      researchSubtitle:'طبقة تجريبية تربط البحث بالتحليل الاستراتيجي. النمط اليدوي يبقى كما هو؛ هذه الطبقة تضيف خطة، مصفوفة أدلة، روابط سببية، محاكاة AI، نقد، وبوابة جودة v2.',
      alphaBadge:'v0.12.0-beta · اختبارات proxy الخلفية ودليل Worker محلي',
      planTitle:'1. خطة البحث',
      planSubtitle:'حوّل الموضوع إلى أسئلة بحث، مصادر مستهدفة، فاعلين، أدلة مضادة، ومؤشرات إنذار مبكر.',
      planMode:'نمط البحث',
      modeStructural:'هيكلي', modeRecent:'إشارات حديثة', modeSourceHeavy:'مرتكز على المصادر', modeAdversarial:'نقدي/خصومي',
      generatePlan:'توليد خطة البحث', copyPlanPrompt:'نسخ برومبت الخطة', clearPlan:'مسح الخطة', noPlan:'لا توجد خطة بحث بعد.',
      evidenceTitle:'2. مصفوفة الأدلة',
      evidenceSubtitle:'الدليل يصبح كائنًا مستقلًا قبل التحليل. كل ادعاء يمكن أن يدعم أو يناقض طبقات النموذج.',
      claim:'الادعاء', sourceTitle:'عنوان المصدر', sourceUrl:'رابط المصدر', sourceType:'نوع المصدر', sourceDate:'تاريخ المصدر', strength:'القوة', timeRelevance:'الملاءمة الزمنية', publicSignal:'الإشارة العامة', supports:'يدعم IDs', contradicts:'يناقض IDs', confidence:'الثقة', notes:'ملاحظات',
      addEvidence:'إضافة دليل', updateEvidence:'تحديث الدليل', cancelEdit:'إلغاء التعديل', loadDemoEvidence:'تحميل أدلة تجريبية', exportWorkflow:'تصدير حزمة البحث', importWorkflow:'استيراد حزمة بحث', clearEvidence:'مسح الأدلة', matrixEmpty:'مصفوفة الأدلة فارغة.', edit:'تعديل', remove:'حذف',
      causalTitle:'3. الروابط السببية', causalSubtitle:'اربط المصالح والفاعلين والأدوات والسرديات والنتائج والتغذية الراجعة والأدلة بادعاءات سببية صريحة.', linkFrom:'من', linkTo:'إلى', relationship:'العلاقة', evidenceIds:'IDs الأدلة', addCausalLink:'إضافة رابط سببي', inferCausalLinks:'استنتاج من الأدلة', clearCausalLinks:'مسح الروابط', causalEmpty:'لا توجد روابط سببية بعد.',
      compilerTitle:'4. مُصرّف التحليل', compilerSubtitle:'حوّل الأدلة والعناقيد المصدرية والفجوات والروابط السببية إلى موجز جاهز للتوليف.', compileBrief:'تجميع موجز التحليل', copySynthesisPrompt:'نسخ برومبت التوليف', exportAnalysisBrief:'تصدير الموجز', clearAnalysisBrief:'مسح الموجز', noAnalysisBrief:'لا يوجد موجز تحليل بعد.', clusterTitle:'عناقيد المصادر', gapsTitle:'فجوات التغطية', diagnosticsTitle:'تشخيص التحقق', compilerScore:'المُصرّف', statusCompiled:'تم تجميع موجز التحليل.', statusBriefExported:'تم تصدير موجز التحليل.', statusBriefCleared:'تم مسح موجز التحليل.',
      workflowTitle:'8. سير AI تجريبي', workflowSubtitle:'تجريد المزوّد يبدأ بمزوّد وهمي. ينتج JSON صالحًا دون الاتصال بأي API خارجي.', generateMock:'توليد JSON تحليلي تجريبي', runMockRepair:'تشغيل إصلاح تجريبي', runCritique:'تشغيل نقد تجريبي', copyDeepPrompt:'نسخ برومبت البحث العميق', providerEndpoint:'Endpoint', providerModel:'Model', providerApiKey:'API key', rememberProviderKey:'Remember locally on this device', enableLiveByok:'Enable live provider calls', providerSafety:'Safety: manual/private mode remains default. Keys are never exported.', validateProviderSettings:'Validate provider settings', dryRunProviderRequest:'Build dry-run request', byokScore:'BYOK safety', backendProxyScore:'Backend proxy', statusProviderDryRun:'Provider payload built without live network call.', statusProviderSettingsSaved:'Provider settings validated and saved.', statusProviderLiveDisabled:'Live provider calls disabled; dry-run/mock response recorded.', statusProviderLiveError:'Live provider call failed; no key was stored in the run ledger.', statusBackendProxyReady:'Hosted backend proxy selected. Browser sends no provider key.',
      qualityTitle:'بوابة الجودة v2', planScore:'الخطة', evidenceScore:'الأدلة', causalScore:'الروابط السببية', critiqueScore:'النقد', sourceScore:'انضباط المصادر', diversityScore:'تنوع المصادر', counterScore:'الأدلة المضادة', readiness:'الجاهزية',
      statusReady:'سير العمل البحثي جاهز للمحاكاة.', statusNeedPlan:'ولّد خطة بحث أولًا.', statusNeedEvidence:'أضف أدلة قبل التوليف.', statusGenerated:'تم توليد JSON تجريبي ووضعه في خانة الاستيراد.', statusRepaired:'الإصلاح التجريبي أنتج JSON متوافقًا.', statusCritiqued:'تم توليد نقد تجريبي.', statusImported:'تم استيراد حزمة البحث.', statusExported:'تم تصدير حزمة البحث.', statusEditing:'تم تحميل الدليل للتعديل.', statusLinkAdded:'تمت إضافة الرابط السببي.', statusLinksInferred:'تم استنتاج الروابط السببية من الأدلة.', statusInvalidPacket:'حزمة البحث غير صالحة.', statusInvalidLink:'الرابط السببي يحتاج من/إلى وعلى الأقل ID دليل واحد.', copied:'تم النسخ.', copyFailed:'تعذر النسخ. استخدم النص الظاهر يدويًا.',
      urlOptional:'https://example.com/source', claimPlaceholder:'ادعاء قابل للملاحظة أو نتيجة بحثية', sourcePlaceholder:'تقرير، دراسة، قاعدة بيانات، تفريغ، أو ملاحظة', supportsPlaceholder:'I1,A1,T1', contradictsPlaceholder:'N1,R1', notesPlaceholder:'لماذا هذا الدليل مهم / عدم اليقين / الحدود'
    },
    fr: {
      researchTitle:'Laboratoire de workflow de recherche',
      researchSubtitle:'Couche expérimentale reliant la recherche à l’analyse stratégique. Le mode manuel reste intact; cette couche ajoute plan, matrice de preuves, liens causaux, IA simulée, critique et barrière qualité v2.',
      alphaBadge:'v0.12.0-beta · tests proxy backend + guide Worker local',
      planTitle:'1. Plan de recherche',
      planSubtitle:'Transformer le sujet en questions, sources cibles, acteurs, contre-preuves et signaux précoces.',
      planMode:'Mode de recherche',
      modeStructural:'Structurel', modeRecent:'Signaux récents', modeSourceHeavy:'Très sourcé', modeAdversarial:'Adversarial',
      generatePlan:'Générer le plan', copyPlanPrompt:'Copier le prompt du plan', clearPlan:'Effacer le plan', noPlan:'Aucun plan de recherche.',
      evidenceTitle:'2. Matrice de preuves',
      evidenceSubtitle:'La preuve devient un objet avant l’analyse. Chaque élément peut soutenir ou contredire des couches du modèle.',
      claim:'Énoncé', sourceTitle:'Titre de source', sourceUrl:'URL source', sourceType:'Type de source', sourceDate:'Date source', strength:'Force', timeRelevance:'Pertinence temps', publicSignal:'Signal public', supports:'Soutient IDs', contradicts:'Contredit IDs', confidence:'Confiance', notes:'Notes',
      addEvidence:'Ajouter preuve', updateEvidence:'Mettre à jour', cancelEdit:'Annuler édition', loadDemoEvidence:'Charger preuves démo', exportWorkflow:'Exporter paquet recherche', importWorkflow:'Importer paquet recherche', clearEvidence:'Effacer preuves', matrixEmpty:'La matrice de preuves est vide.', edit:'Modifier', remove:'Supprimer',
      causalTitle:'3. Liens causaux', causalSubtitle:'Relier intérêts, acteurs, outils, narratifs, résultats, feedback et preuves dans des affirmations causales explicites.', linkFrom:'De', linkTo:'Vers', relationship:'Relation', evidenceIds:'IDs preuve', addCausalLink:'Ajouter lien causal', inferCausalLinks:'Inférer depuis preuves', clearCausalLinks:'Effacer liens', causalEmpty:'Aucun lien causal.',
      compilerTitle:'4. Compilateur d’analyse', compilerSubtitle:'Compiler preuves, clusters de sources, lacunes et liens causaux dans un brief prêt pour synthèse.', compileBrief:'Compiler le brief', copySynthesisPrompt:'Copier prompt synthèse', exportAnalysisBrief:'Exporter le brief', clearAnalysisBrief:'Effacer le brief', noAnalysisBrief:'Aucun brief compilé.', clusterTitle:'Clusters de sources', gapsTitle:'Lacunes de couverture', diagnosticsTitle:'Diagnostics validation', compilerScore:'Compilateur', statusCompiled:'Brief d’analyse compilé.', statusBriefExported:'Brief exporté.', statusBriefCleared:'Brief effacé.',
      workflowTitle:'8. Workflow IA simulé', workflowSubtitle:'L’abstraction fournisseur commence par un fournisseur simulé. Il crée un JSON valide sans API externe.', generateMock:'Générer JSON simulé', runMockRepair:'Réparation simulée', runCritique:'Critique simulée', copyDeepPrompt:'Copier prompt deep-research', providerEndpoint:'Endpoint', providerModel:'Model', providerApiKey:'API key', rememberProviderKey:'Remember locally on this device', enableLiveByok:'Enable live provider calls', providerSafety:'Safety: manual/private mode remains default. Keys are never exported.', validateProviderSettings:'Validate provider settings', dryRunProviderRequest:'Build dry-run request', byokScore:'BYOK safety', backendProxyScore:'Backend proxy', statusProviderDryRun:'Provider payload built without live network call.', statusProviderSettingsSaved:'Provider settings validated and saved.', statusProviderLiveDisabled:'Live provider calls disabled; dry-run/mock response recorded.', statusProviderLiveError:'Live provider call failed; no key was stored in the run ledger.', statusBackendProxyReady:'Hosted backend proxy selected. Browser sends no provider key.',
      qualityTitle:'Barrière qualité v2', planScore:'Plan', evidenceScore:'Preuves', causalScore:'Liens causaux', critiqueScore:'Critique', sourceScore:'Discipline sources', diversityScore:'Diversité sources', counterScore:'Contre-preuves', readiness:'Préparation',
      statusReady:'Workflow prêt pour synthèse simulée.', statusNeedPlan:'Générez d’abord un plan.', statusNeedEvidence:'Ajoutez des preuves avant la synthèse.', statusGenerated:'JSON simulé généré et placé dans la zone d’import.', statusRepaired:'Réparation simulée compatible avec le schéma.', statusCritiqued:'Critique simulée générée.', statusImported:'Paquet de recherche importé.', statusExported:'Paquet de recherche exporté.', statusEditing:'Élément chargé pour édition.', statusLinkAdded:'Lien causal ajouté.', statusLinksInferred:'Liens causaux inférés.', statusInvalidPacket:'Paquet de recherche invalide.', statusInvalidLink:'Un lien causal exige De, Vers et au moins un ID preuve.', copied:'Copié.', copyFailed:'Copie impossible. Utilisez le texte visible manuellement.',
      urlOptional:'https://example.com/source', claimPlaceholder:'Énoncé observable ou résultat de recherche', sourcePlaceholder:'Publication, rapport, données, transcript ou note', supportsPlaceholder:'I1,A1,T1', contradictsPlaceholder:'N1,R1', notesPlaceholder:'Pourquoi cette preuve compte / incertitude / limites'
    }
  };

  function getLang(){
    const lang = (document.documentElement.lang || localStorage.getItem('jarbou3i.lang') || 'ar').slice(0,2).toLowerCase();
    return SUPPORTED_LANGS.includes(lang) ? lang : 'en';
  }
  function tr(key){return (COPY[getLang()] && COPY[getLang()][key]) || COPY.en[key] || key;}
  function topic(){return ($('topicInput')?.value || '').trim() || 'Unspecified strategic analysis topic';}
  function context(){return ($('timeframeInput')?.value || '').trim() || 'Context not specified';}
  function researchMode(){return $('researchMode')?.value || 'structural';}
  function idsFrom(value){return String(value || '').split(',').map(x=>x.trim()).filter(Boolean);}
  function clampScore(v){const n = Number(v); return Math.max(1, Math.min(5, Number.isFinite(n) ? n : 3));}
  function validId(id){return /^[A-Z]+\d+$/.test(String(id || '').trim());}
  function normalizeEvidenceIds(ids){return ids.filter(id => /^E\d+$/.test(id));}

  const defaultState = () => ({
    plan: null,
    evidence: [],
    causal_links: [],
    critique: null,
    analysis_brief: null,
    diagnostics: null,
    lastMockAnalysis: null,
    ai_runs: [],
    activeProviderTask: 'synthesis',
    editingEvidenceIndex: -1,
    provider: 'mock',
    provider_config: {endpoint:'https://api.openai.com/v1/chat/completions', model:'gpt-4.1-mini', allow_live:false, remember_key:false},
    last_provider_payload: null,
    last_provider_validation: null,
    last_repair_trace: null,
    last_provider_contract_preview: null,
    last_provider_prompt_preview: null,
    provider_fixture_report: null,
    provider_diagnostics: null,
    source_connector: 'manual_mock',
    source_task: 'source_plan',
    source_policy: null,
    source_diagnostics: null,
    source_fixture_report: null,
    last_source_request: null,
    source_runs: [],
    source_imports: [],
    last_source_import_preview: null,
    source_import_report: null,
    version: VERSION
  });

  function migrate(parsed){
    const next = Object.assign(defaultState(), parsed || {});
    next.version = VERSION;
    next.evidence = Array.isArray(next.evidence) ? next.evidence : (Array.isArray(next.evidence_matrix) ? next.evidence_matrix : []);
    next.causal_links = Array.isArray(next.causal_links) ? next.causal_links : [];
    next.ai_runs = Array.isArray(next.ai_runs) ? next.ai_runs.slice(-25) : [];
    next.source_runs = Array.isArray(next.source_runs) ? next.source_runs.slice(-25) : [];
    next.source_imports = Array.isArray(next.source_imports) ? next.source_imports.slice(-25) : [];
    next.last_source_import_preview = next.last_source_import_preview && typeof next.last_source_import_preview === 'object' ? next.last_source_import_preview : null;
    next.source_import_report = next.source_import_report && typeof next.source_import_report === 'object' ? next.source_import_report : null;
    next.source_connector = next.source_connector || 'manual_mock';
    next.source_task = next.source_task || 'source_plan';
    next.source_policy = next.source_policy && typeof next.source_policy === 'object' ? next.source_policy : null;
    next.source_diagnostics = next.source_diagnostics && typeof next.source_diagnostics === 'object' ? next.source_diagnostics : null;
    next.source_fixture_report = next.source_fixture_report && typeof next.source_fixture_report === 'object' ? next.source_fixture_report : null;
    next.last_source_request = next.last_source_request && typeof next.last_source_request === 'object' ? next.last_source_request : null;
    next.provider_config = Object.assign(defaultState().provider_config, next.provider_config || {});
    next.provider_config.allow_live = !!next.provider_config.allow_live;
    next.provider_config.remember_key = !!next.provider_config.remember_key;
    next.last_provider_validation = next.last_provider_validation && typeof next.last_provider_validation === 'object' ? next.last_provider_validation : null;
    next.last_repair_trace = next.last_repair_trace && typeof next.last_repair_trace === 'object' ? next.last_repair_trace : null;
    next.analysis_brief = next.analysis_brief && typeof next.analysis_brief === 'object' ? next.analysis_brief : null;
    next.diagnostics = next.diagnostics && typeof next.diagnostics === 'object' ? next.diagnostics : null;
    next.editingEvidenceIndex = Number.isInteger(next.editingEvidenceIndex) ? next.editingEvidenceIndex : -1;
    if(next.plan && next.plan.plan_version) next.plan.plan_version = VERSION;
    return renumberEvidence(next);
  }
  function load(){
    try { return migrate(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')); }
    catch (_) { return defaultState(); }
  }
  let state = load();
  function save(){localStorage.setItem(STORAGE_KEY, JSON.stringify(state));}

  function renumberEvidence(targetState = state){
    const idMap = new Map();
    targetState.evidence = targetState.evidence.map((e,i)=>{
      const nextId = `E${i+1}`;
      if(e.evidence_id) idMap.set(e.evidence_id, nextId);
      return Object.assign({}, e, {evidence_id: nextId});
    });
    const validEvidenceIds = new Set(targetState.evidence.map(e => e.evidence_id));
    if(Array.isArray(targetState.causal_links)){
      targetState.causal_links = targetState.causal_links.map(link => Object.assign({}, link, {
        evidence_ids: (link.evidence_ids || []).map(id => idMap.get(id) || id).filter(id => validEvidenceIds.has(id))
      })).filter(link => (link.evidence_ids || []).length);
    }
    return targetState;
  }

  function buildResearchPlan(){
    const mode = researchMode();
    const t = topic();
    const c = context();
    const recent = mode === 'recent';
    const sourceHeavy = mode === 'source-heavy';
    const adversarial = mode === 'adversarial';
    return {
      plan_version: VERSION,
      topic: t,
      context: c,
      mode,
      generated_at: nowIso(),
      questions: [
        `What are the dominant interests behind ${t}?`,
        `Which actors have decision power, disruption capacity, or narrative influence in ${c}?`,
        `Which tools are being used, and what constraints do those tools reveal?`,
        `Which declared narratives diverge from observable actions or outcomes?`,
        `What feedback loops could reshape the system after the first-order outcomes?`
      ].concat(recent ? [`Which signals changed in the last 30/90 days and which are noise?`] : [])
       .concat(adversarial ? [`Which comfortable explanation would be disproven by contrary evidence?`] : []),
      target_actors: ['State institutions','Political factions','Corporate or financial actors','Media/narrative brokers','External actors'],
      target_sources: sourceHeavy
        ? ['official documents','primary datasets','academic literature','credible news chronology','expert interviews or testimony','counter-position sources']
        : ['official statements','news chronology','public discourse signals','expert commentary'],
      keywords: t.split(/[\s,;:،]+/).filter(Boolean).slice(0,8),
      counter_evidence_targets: [
        'Evidence that the dominant narrative is wrong or incomplete',
        'Actors benefiting from the opposite outcome',
        'Outcomes that contradict stated goals',
        'Missing incentives or hidden constraints'
      ],
      early_warning_indicators: [
        'Tool escalation or rapid legal changes',
        'Narrative synchronization across institutions/media',
        'Unusual alliance or actor realignment',
        'Economic or public-signal anomalies'
      ]
    };
  }

  function buildPlanPrompt(){
    return window.Jarbou3iResearchModules.prompts.buildPlanPrompt({
      version: VERSION,
      topic: topic(),
      context: context(),
      mode: researchMode()
    });
  }
  function researchPacket(){
    return {
      workflow_version: VERSION,
      generated_at: nowIso(),
      research_plan: state.plan,
      evidence_matrix: state.evidence,
      causal_links: state.causal_links,
      analysis_brief: state.analysis_brief,
      diagnostics: diagnosticReport(),
      provider: state.provider || 'mock',
      provider_config: sanitizedProviderConfig(state.provider_config || {}),
      provider_validation: state.last_provider_validation || null,
      repair_trace: state.last_repair_trace || null,
      provider_diagnostics: state.provider_diagnostics || null,
      provider_fixture_report: state.provider_fixture_report || null,
      source_policy: state.source_policy || sourcePolicy(),
      source_diagnostics: state.source_diagnostics || null,
      source_fixture_report: state.source_fixture_report || null,
      source_requests: state.last_source_request ? [state.last_source_request] : [],
      source_runs: state.source_runs || [],
      source_imports: state.source_imports || [],
      source_import_report: state.source_import_report || null,
      ai_runs: state.ai_runs || [],
      critique: state.critique
    };
  }

  function buildDeepResearchPrompt(){
    return window.Jarbou3iResearchModules.prompts.buildDeepResearchPrompt({packet: researchPacket()});
  }
  function makeEvidenceEntry(){
    const entry = {
      evidence_id: state.editingEvidenceIndex >= 0 ? state.evidence[state.editingEvidenceIndex]?.evidence_id : `E${state.evidence.length + 1}`,
      claim: ($('evClaim')?.value || '').trim(),
      source_title: ($('evSourceTitle')?.value || '').trim(),
      source_url: ($('evSourceUrl')?.value || '').trim(),
      source_type: $('evSourceType')?.value || 'other',
      source_date: ($('evSourceDate')?.value || '').trim() || 'unknown',
      time_relevance_score: clampScore($('evTimeScore')?.value || 3),
      evidence_strength: clampScore($('evStrength')?.value || 3),
      public_signal_score: clampScore($('evPublicSignal')?.value || 1),
      supports: idsFrom($('evSupports')?.value),
      contradicts: idsFrom($('evContradicts')?.value),
      confidence: $('evConfidence')?.value || 'medium',
      notes: ($('evNotes')?.value || '').trim()
    };
    if(!entry.claim) throw new Error('claim_required');
    return entry;
  }

  function clearEvidenceForm(){
    ['evClaim','evSourceTitle','evSourceUrl','evSourceDate','evSupports','evContradicts','evNotes'].forEach(id=>{if($(id)) $(id).value='';});
    if($('evStrength')) $('evStrength').value = '3';
    if($('evTimeScore')) $('evTimeScore').value = '3';
    if($('evPublicSignal')) $('evPublicSignal').value = '1';
    if($('evConfidence')) $('evConfidence').value = 'medium';
    state.editingEvidenceIndex = -1;
    updateEvidenceButtonLabel();
  }

  function fillEvidenceForm(evidence, index){
    if(!evidence) return;
    state.editingEvidenceIndex = index;
    if($('evClaim')) $('evClaim').value = evidence.claim || '';
    if($('evSourceTitle')) $('evSourceTitle').value = evidence.source_title || '';
    if($('evSourceUrl')) $('evSourceUrl').value = evidence.source_url || '';
    if($('evSourceType')) $('evSourceType').value = evidence.source_type || 'other';
    if($('evSourceDate')) $('evSourceDate').value = evidence.source_date || '';
    if($('evStrength')) $('evStrength').value = evidence.evidence_strength || 3;
    if($('evTimeScore')) $('evTimeScore').value = evidence.time_relevance_score || 3;
    if($('evPublicSignal')) $('evPublicSignal').value = evidence.public_signal_score || 1;
    if($('evConfidence')) $('evConfidence').value = evidence.confidence || 'medium';
    if($('evSupports')) $('evSupports').value = (evidence.supports || []).join(',');
    if($('evContradicts')) $('evContradicts').value = (evidence.contradicts || []).join(',');
    if($('evNotes')) $('evNotes').value = evidence.notes || '';
    updateEvidenceButtonLabel();
    setStatus(tr('statusEditing'), 'warn');
  }

  function updateEvidenceButtonLabel(){
    const btn = $('addEvidenceBtn');
    if(btn) btn.textContent = state.editingEvidenceIndex >= 0 ? tr('updateEvidence') : tr('addEvidence');
  }

  function loadDemoEvidence(){
    const t = topic();
    state.evidence = [
      {evidence_id:'E1', claim:`Observable actor incentives shape the strategic trajectory of ${t}.`, source_title:'Demo chronology note', source_url:'', source_type:'other', source_date:'unknown', time_relevance_score:3, evidence_strength:3, public_signal_score:2, supports:['I1','A1'], contradicts:[], confidence:'medium', notes:'Placeholder evidence; replace with real source-backed material before publication.'},
      {evidence_id:'E2', claim:'Declared narratives do not fully explain tool selection or outcome distribution.', source_title:'Demo contradiction note', source_url:'', source_type:'other', source_date:'unknown', time_relevance_score:3, evidence_strength:3, public_signal_score:2, supports:['N1','T1'], contradicts:['R1'], confidence:'medium', notes:'Used to test contradiction handling.'},
      {evidence_id:'E3', claim:'Future scenarios depend on whether feedback loops amplify or dampen current incentives.', source_title:'Demo scenario note', source_url:'', source_type:'other', source_date:'unknown', time_relevance_score:4, evidence_strength:3, public_signal_score:1, supports:['F1','S1'], contradicts:[], confidence:'medium', notes:'Used to test scenario and falsifier discipline.'}
    ];
    inferCausalLinks();
    save(); render();
  }

  function makeCausalLink(){
    const from = ($('linkFrom')?.value || '').trim();
    const to = ($('linkTo')?.value || '').trim();
    const relationship = $('linkRelationship')?.value || 'enables';
    const evidence_ids = normalizeEvidenceIds(idsFrom($('linkEvidenceIds')?.value));
    const confidence = $('linkConfidence')?.value || 'medium';
    if(!validId(from) || !validId(to) || !evidence_ids.length || !RELATIONSHIPS.includes(relationship)) throw new Error('invalid_link');
    return {from, to, relationship, evidence_ids, confidence};
  }

  function clearCausalForm(){
    ['linkFrom','linkTo','linkEvidenceIds'].forEach(id=>{if($(id)) $(id).value='';});
    if($('linkRelationship')) $('linkRelationship').value='enables';
    if($('linkConfidence')) $('linkConfidence').value='medium';
  }

  function inferCausalLinks(){
    const links = [];
    for(const evidence of state.evidence){
      const ids = [...(evidence.supports || []), ...(evidence.contradicts || [])].filter(validId);
      for(let i=0; i<ids.length-1; i++){
        links.push({from: ids[i], to: ids[i+1], relationship: (evidence.contradicts || []).includes(ids[i+1]) ? 'contradicts' : 'enables', evidence_ids:[evidence.evidence_id], confidence:evidence.confidence || 'medium'});
      }
    }
    const seen = new Set();
    state.causal_links = links.filter(link => {
      const key = `${link.from}|${link.to}|${link.relationship}|${link.evidence_ids.join(',')}`;
      if(seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return state.causal_links;
  }

  function layerFromId(id){
    const prefix = String(id || '').replace(/[0-9]/g,'');
    return ({I:'interests',A:'actors',T:'tools',N:'narrative',R:'results',F:'feedback',S:'scenarios',C:'contradictions'})[prefix] || 'other';
  }

  function collectLinkedIds(){
    const ids = new Set();
    for(const evidence of state.evidence){
      [...(evidence.supports || []), ...(evidence.contradicts || [])].filter(validId).forEach(id => ids.add(id));
    }
    for(const link of state.causal_links){
      if(validId(link.from)) ids.add(link.from);
      if(validId(link.to)) ids.add(link.to);
    }
    return [...ids].sort();
  }

  function buildSourceClusters(){
    const clusters = new Map();
    for(const evidence of state.evidence){
      const ids = [...(evidence.supports || []), ...(evidence.contradicts || [])].filter(validId);
      const targets = ids.length ? ids : ['UNLINKED'];
      for(const target of targets){
        if(!clusters.has(target)) clusters.set(target, []);
        clusters.get(target).push(evidence);
      }
    }
    return [...clusters.entries()].map(([target_id, items], index) => {
      const sourceTypes = [...new Set(items.map(item => item.source_type || 'other'))];
      const avgStrength = items.reduce((sum,item)=>sum + clampScore(item.evidence_strength), 0) / Math.max(1, items.length);
      const contradictions = items.filter(item => (item.contradicts || []).includes(target_id)).length;
      return {
        cluster_id: `CL${index + 1}`,
        target_id,
        layer: layerFromId(target_id),
        evidence_ids: items.map(item => item.evidence_id),
        claims: items.map(item => item.claim),
        source_types: sourceTypes,
        average_strength: Number(avgStrength.toFixed(2)),
        contradiction_count: contradictions,
        confidence_mix: [...new Set(items.map(item => item.confidence || 'medium'))]
      };
    });
  }

  function diagnosticReport(){
    const linkedIds = collectLinkedIds();
    const evidenceIds = new Set(state.evidence.map(item => item.evidence_id));
    const missingEvidenceRefs = [];
    for(const link of state.causal_links){
      for(const id of link.evidence_ids || []){
        if(!evidenceIds.has(id)) missingEvidenceRefs.push(`${link.from}->${link.to}:${id}`);
      }
    }
    const coverage = {
      interests: linkedIds.filter(id => layerFromId(id) === 'interests').length,
      actors: linkedIds.filter(id => layerFromId(id) === 'actors').length,
      tools: linkedIds.filter(id => layerFromId(id) === 'tools').length,
      narrative: linkedIds.filter(id => layerFromId(id) === 'narrative').length,
      results: linkedIds.filter(id => layerFromId(id) === 'results').length,
      feedback: linkedIds.filter(id => layerFromId(id) === 'feedback').length,
      scenarios: linkedIds.filter(id => layerFromId(id) === 'scenarios').length,
      contradictions: linkedIds.filter(id => layerFromId(id) === 'contradictions').length
    };
    const required = ['interests','actors','tools','narrative','results','feedback'];
    const gaps = [];
    if(!state.plan) gaps.push('research_plan_missing');
    if(state.evidence.length < 5) gaps.push('evidence_volume_below_research_threshold');
    if(state.evidence.filter(e => e.source_url).length < 3) gaps.push('source_urls_below_traceability_threshold');
    if(state.evidence.filter(e => e.source_date && e.source_date !== 'unknown').length < 3) gaps.push('source_dates_below_traceability_threshold');
    if(new Set(state.evidence.map(e => e.source_type)).size < 3) gaps.push('source_type_diversity_low');
    if(!state.evidence.some(e => (e.contradicts || []).length)) gaps.push('counter_evidence_missing');
    if(state.causal_links.length < 3) gaps.push('causal_links_sparse');
    if(!(state.ai_runs || []).some(run => run.status === 'ok')) gaps.push('provider_harness_not_exercised');
    for(const key of required){ if(!coverage[key]) gaps.push(`${key}_coverage_missing`); }
    if(missingEvidenceRefs.length) gaps.push('causal_links_reference_missing_evidence');
    return {
      diagnostics_version: VERSION,
      generated_at: nowIso(),
      linked_ids: linkedIds,
      coverage,
      gaps,
      missing_evidence_references: missingEvidenceRefs,
      status: gaps.length ? 'review_required' : 'synthesis_ready'
    };
  }

  function compileAnalysisBrief(shouldPersist = true){
    if(!state.plan) state.plan = buildResearchPlan();
    if(!state.causal_links.length && state.evidence.length) inferCausalLinks();
    const diagnostics = diagnosticReport();
    const clusters = buildSourceClusters();
    const scores = qualityScores();
    const brief = {
      brief_version: VERSION,
      generated_at: nowIso(),
      topic: topic(),
      context: context(),
      mode: researchMode(),
      readiness_score: scores.readiness,
      research_questions: state.plan?.questions || [],
      source_clusters: clusters,
      coverage: diagnostics.coverage,
      gaps: diagnostics.gaps,
      evidence_priorities: diagnostics.gaps.includes('counter_evidence_missing')
        ? ['Add evidence that directly contradicts a dominant narrative or expected result.', 'Add at least three traceable URLs and dates.', 'Add coverage for all six Jarbou3i layers.']
        : ['Verify source dates and URLs before publication.', 'Manually inspect causal-link direction before synthesis.'],
      synthesis_constraints: [
        'Do not claim source verification unless a source URL and source date are present.',
        'Separate observation, inference, and estimate in the final strategic JSON.',
        'Use only causal links that reference existing evidence IDs.',
        'Treat contradiction clusters as high-information diagnostics, not automatic proof of intent.'
      ],
      handoff_summary: `Compile ${state.evidence.length} evidence items and ${state.causal_links.length} causal links into a Jarbou3i strategic analysis for ${topic()}.`
    };
    if(shouldPersist){
      state.analysis_brief = brief;
      state.diagnostics = diagnostics;
      save();
    }
    return brief;
  }

  function buildSynthesisPrompt(){
    const brief = state.analysis_brief || compileAnalysisBrief(false);
    return window.Jarbou3iResearchModules.prompts.buildSynthesisPrompt({brief, packet: researchPacket()});
  }
  function evidenceAsLegacyItems(){
    return state.evidence.map((e, index) => ({
      id: e.evidence_id || `E${index+1}`,
      claim: e.claim,
      basis: e.source_url ? 'source_based' : 'inference',
      source_note: [e.source_title, e.source_type, e.source_date].filter(Boolean).join(' · '),
      confidence: e.confidence || 'medium',
      source_title: e.source_title,
      source_url: e.source_url,
      source_date: e.source_date,
      source_type: e.source_type,
      evidence_strength: e.evidence_strength,
      uncertainty: e.notes || 'Needs stronger source verification before publication.',
      counter_evidence: e.contradicts && e.contradicts.length ? `Contradicts ${e.contradicts.join(', ')}` : 'Counter-evidence target not yet specified.'
    }));
  }

  function buildMockAnalysis(){
    const t = topic();
    const c = context();
    const firstClaim = state.evidence[0]?.claim || `Evidence matrix is required to ground ${t}.`;
    const links = state.causal_links.length ? state.causal_links : inferCausalLinks();
    return {
      schema_version: '1.1.0',
      analysis_id: `jarbou3i-alpha-${Date.now()}`,
      language: getLang(),
      generated_at: nowIso(),
      model_mode: 'research-alpha-mock',
      subject: {title: t, context: c, question: `How should ${t} be interpreted through the Jarbou3i strategic model?`, executive_thesis: `Mock synthesis: ${t} should be treated as an adaptive system where interests, actors, tools, narrative, outcomes, and feedback loops must be tested against evidence rather than accepted as discourse.`},
      research_plan: state.plan,
      evidence_matrix: state.evidence,
      analysis_brief: state.analysis_brief || compileAnalysisBrief(false),
      interests: [
        {id:'I1', name:'Preserve strategic advantage', type:'strategic', intensity:4, horizon:'medium', stakes:'important', confidence:'medium', rationale:`Derived from the research plan and evidence signal: ${firstClaim}`},
        {id:'I2', name:'Control public legitimacy', type:'political', intensity:3, horizon:'short', stakes:'important', confidence:'medium', rationale:'Narrative control affects whether actors can sustain tool use and absorb backlash.'}
      ],
      actors: [
        {id:'A1', name:'Primary decision-making bloc', category:'state', financial:4, decision_access:5, disruption_capacity:4, media_influence:3, confidence:'medium', rationale:'Mock actor representing the decision center that can select tools and shape narratives.'},
        {id:'A2', name:'Narrative amplification network', category:'society', financial:2, decision_access:3, disruption_capacity:3, media_influence:5, confidence:'medium', rationale:'Mock actor representing media, influencers, parties, or institutions that translate interests into public frames.'}
      ],
      tools: [
        {id:'T1', name:'Narrative framing and agenda control', type:'informational', cost:2, risk:3, speed:4, reversibility:3, deniability:4, confidence:'medium', rationale:'Selected because narratives can prepare or justify later policy choices.'},
        {id:'T2', name:'Institutional/legal adjustment', type:'legal', cost:3, risk:4, speed:3, reversibility:2, deniability:2, confidence:'medium', rationale:'Selected when actors need durable rules rather than only persuasion.'}
      ],
      narrative: [{id:'N1', name:'Public-interest justification', frame:'security', coherence:4, media_alignment:3, public_acceptance:3, confidence:'medium', rationale:'Mock narrative layer used to test whether stated legitimacy matches tools and outcomes.'}],
      results: [{id:'R1', name:'Redistribution of influence', type:'indirect', goal_achieved_pct:55, cost_benefit:3, power_balance_impact:'mixed', confidence:'medium', rationale:'Mock result: power shifts are plausible but require better source confirmation.'}],
      feedback: [{id:'F1', description:'Actors adapt tools and narratives after observing public resistance, elite alignment, or institutional friction.', adapts:'tools', speed:'fast', confidence:'medium', rationale:'Feedback loop derived from system dynamics rather than a single-cause explanation.'}],
      causal_links: links,
      contradictions: {items:[{id:'C1', rhetoric:'Declared public-interest rationale', contradiction_type:'rhetoric_vs_action', affected_layers:['narrative','tools','results'], actions:['Tool selection creates winners and losers beyond the stated goal','Observed outcomes require more evidence before accepting the official explanation'], interpretation:'The contradiction is treated as an information-dense diagnostic point, not as proof of bad faith by itself.', severity:3, confidence:'medium'}]},
      scenarios: {items:[{id:'S1', name:'Feedback amplification', probability:55, timeframe:'near-to-medium term', drivers:['Narrative synchronization','Tool escalation','Actor realignment'], early_signals:['More coordinated messaging','Legal or institutional acceleration','Visible backlash or counter-mobilization'], disproven_if:['No tool escalation occurs','Opposing actors fail to mobilize','Evidence shows outcomes remain local and non-systemic'], rationale:'Scenario generated for testing the research workflow, not as a final forecast.'}]},
      evidence: {items:evidenceAsLegacyItems()},
      assumptions: {items:[{id:'AS1', assumption:'The available evidence is representative enough to support a first-pass strategic model.', risk:'high', disproving_test:'Add sources from opposing positions and check whether the causal structure changes.', implication_if_wrong:'The current analysis may overfit a narrow evidence set.'}]},
      quality_gate: {status:'alpha_mock', note:'Generated by MockProvider. Replace demo evidence with verified sources before publication.'}
    };
  }

  function buildCritique(){
    const evidenceCount = state.evidence.length;
    const urlCount = state.evidence.filter(e=>e.source_url).length;
    const datedCount = state.evidence.filter(e=>e.source_date && e.source_date !== 'unknown').length;
    const contradCount = state.evidence.filter(e=>e.contradicts?.length).length;
    const sourceTypes = new Set(state.evidence.map(e=>e.source_type).filter(Boolean));
    const linkCount = state.causal_links.length;
    return {
      critique_version: VERSION,
      generated_at: nowIso(),
      summary: evidenceCount >= 5 && linkCount >= 3 ? 'The workflow has a usable research packet, but source verification remains outside this alpha.' : 'The workflow is still under-evidenced or under-linked and should not be published.',
      findings: [
        {type:'evidence_volume', severity: evidenceCount >= 5 ? 'medium' : 'high', finding: evidenceCount >= 5 ? 'Evidence volume is acceptable for alpha synthesis.' : 'Add at least five evidence items before treating the analysis as serious.'},
        {type:'source_traceability', severity: urlCount >= 3 && datedCount >= 3 ? 'medium' : 'high', finding: 'Strong outputs require source URLs and dates; otherwise claims remain weakly traceable.'},
        {type:'source_diversity', severity: sourceTypes.size >= 3 ? 'medium' : 'high', finding: sourceTypes.size >= 3 ? 'Source-type diversity is emerging.' : 'Evidence is too concentrated in one or two source types.'},
        {type:'counter_evidence_gap', severity: contradCount ? 'medium' : 'high', finding: contradCount ? 'At least one evidence item includes contradiction links.' : 'No evidence item clearly contradicts any claim or layer.'},
        {type:'causal_risk', severity: linkCount >= 3 ? 'medium' : 'high', finding: linkCount >= 3 ? 'Causal links exist; still validate each relationship manually.' : 'Causal graph is too sparse for confident synthesis.'},
        {type:'publication_risk', severity:'high', finding:'Alpha mock output is useful for architecture testing, not for final publication.'}
      ],
      recommended_next_actions: [
        'Add at least five evidence items from diverse source types.',
        'Include source dates and URLs for source-based claims.',
        'Add counter-evidence before running final strategic synthesis.',
        'Use causal links to connect evidence to interests, actors, tools, narrative, results, and feedback.',
        'Test whether scenarios are disproven by contrary indicators.'
      ]
    };
  }

  function defaultEndpointForProvider(provider){
    return provider === 'backend_proxy' ? '/api/provider-task' : 'https://api.openai.com/v1/chat/completions';
  }

  function sanitizedProviderConfig(config = state.provider_config || {}, provider = state.provider || $('providerName')?.value || 'mock'){
    return {
      endpoint: String(config.endpoint || defaultEndpointForProvider(provider)).trim(),
      model: String(config.model || (provider === 'backend_proxy' ? 'server-default' : 'gpt-4.1-mini')).trim(),
      allow_live: !!config.allow_live,
      remember_key: provider === 'backend_proxy' ? false : !!config.remember_key
    };
  }

  function readProviderKey(){
    const fieldValue = $('providerApiKey')?.value || '';
    if(fieldValue.trim()) return fieldValue.trim();
    try { return localStorage.getItem(BYOK_KEY_STORAGE) || ''; } catch(_) { return ''; }
  }

  function getProviderConfigFromUi(){
    const provider = $('providerName')?.value || state.provider || 'mock';
    const endpoint = ($('providerEndpoint')?.value || state.provider_config?.endpoint || defaultEndpointForProvider(provider)).trim();
    const model = ($('providerModel')?.value || state.provider_config?.model || (provider === 'backend_proxy' ? 'server-default' : 'gpt-4.1-mini')).trim();
    return {
      endpoint,
      model,
      allow_live: !!$('enableLiveByok')?.checked,
      remember_key: provider === 'backend_proxy' ? false : !!$('rememberProviderKey')?.checked
    };
  }

  function persistProviderSettings(){
    state.provider = $('providerName')?.value || state.provider || 'mock';
    state.provider_config = sanitizedProviderConfig(getProviderConfigFromUi(), state.provider);
    const key = ($('providerApiKey')?.value || '').trim();
    try {
      if(state.provider_config.remember_key && key) localStorage.setItem(BYOK_KEY_STORAGE, key);
      if(!state.provider_config.remember_key) localStorage.removeItem(BYOK_KEY_STORAGE);
    } catch(_) {}
    save();
    return state.provider_config;
  }

  function applyProviderSettingsToUi(){
    const config = sanitizedProviderConfig(state.provider_config || {}, state.provider || 'mock');
    if($('providerName')) $('providerName').value = state.provider || 'mock';
    if($('providerEndpoint')) $('providerEndpoint').value = config.endpoint;
    if($('providerModel')) $('providerModel').value = config.model;
    if($('enableLiveByok')) $('enableLiveByok').checked = !!config.allow_live;
    if($('rememberProviderKey')) $('rememberProviderKey').checked = !!config.remember_key;
    if($('providerApiKey') && config.remember_key && !$('providerApiKey').value){
      try { $('providerApiKey').value = localStorage.getItem(BYOK_KEY_STORAGE) || ''; } catch(_) {}
    }
  }


  function sourcePolicy(){
    return window.Jarbou3iResearchModules.sourceConnectors.sourcePolicy(VERSION);
  }

  function buildSourceTaskRequest(){
    const connector = $('sourceConnector')?.value || state.source_connector || 'manual_mock';
    const task = $('sourceTask')?.value || state.source_task || 'source_plan';
    const request = window.Jarbou3iResearchModules.sourceConnectors.buildSourceTaskRequest({
      version: VERSION,
      topic: topic(),
      context: context(),
      connector,
      task,
      packet: researchPacket(),
      plan: state.plan
    });
    state.source_connector = connector;
    state.source_task = task;
    state.source_policy = request.safety_policy || sourcePolicy();
    state.last_source_request = request;
    return request;
  }

  function runSourceTask(){
    const request = buildSourceTaskRequest();
    const response = window.Jarbou3iResearchModules.sourceConnectors.mockSourceTaskResponse(request);
    const diagnostics = window.Jarbou3iResearchModules.sourceConnectors.sourceDiagnostics(researchPacket(), request, response);
    const run = {
      run_id: 'SRC-' + Date.now(),
      run_version: VERSION,
      connector: request.connector,
      task: request.task,
      status: response.ok ? 'planned' : 'error',
      live_fetching_performed: false,
      created_at: nowIso(),
      output_summary: response.data?.verdict || 'source planning response generated',
      warnings: response.warnings || []
    };
    state.source_policy = request.safety_policy || sourcePolicy();
    state.source_diagnostics = diagnostics;
    state.source_runs = [...(state.source_runs || []), run].slice(-25);
    save();
    render();
    setStatus(tr('statusSourceTaskBuilt'), response.ok ? 'good' : 'warn');
    return {request, response, diagnostics, run};
  }

  function runSourceFixtureSuite(){
    const report = window.Jarbou3iResearchModules.sourceConnectors.runSourceFixtureSuite(VERSION);
    state.source_fixture_report = report;
    state.source_policy = sourcePolicy();
    state.source_diagnostics = window.Jarbou3iResearchModules.sourceConnectors.sourceDiagnostics(researchPacket(), state.last_source_request || buildSourceTaskRequest(), {ok:true, warnings:[]});
    save();
    render();
    setStatus(tr('statusSourceFixtureSuiteRun'), report.fail_count ? 'warn' : 'good');
    return report;
  }

  function exportSourcePolicy(){
    const payload = {source_policy: state.source_policy || sourcePolicy(), source_diagnostics: state.source_diagnostics || null, source_fixture_report: state.source_fixture_report || null};
    downloadJson(`jarbou3i-source-policy-${Date.now()}.json`, payload);
    setStatus(tr('statusSourcePolicyExported'), 'good');
  }

  async function copySourceRequest(){
    const request = state.last_source_request || buildSourceTaskRequest();
    await copyText(JSON.stringify(request, null, 2));
    setStatus(tr('statusSourceRequestCopied'), 'good');
  }

  function sourceImportFormat(){return $('sourceImportFormat')?.value || 'auto';}
  function sourceImportText(){return ($('sourceImportText')?.value || '').trim();}
  function parseSourceImport(){
    const adapter = window.Jarbou3iResearchModules.sourceImportAdapter;
    if(!adapter) throw new Error('source_import_adapter_missing');
    return adapter.parseSourceImportText(sourceImportText(), {format: sourceImportFormat()});
  }
  function previewSourceImport(){
    const adapter = window.Jarbou3iResearchModules.sourceImportAdapter;
    const preview = adapter.previewSourceImport(sourceImportText(), {format: sourceImportFormat()});
    state.last_source_import_preview = preview;
    state.source_import_report = preview.report;
    save(); render();
    setStatus(preview.ok ? tr('statusSourceImportPreviewed') : tr('statusSourceImportEmpty'), preview.ok ? 'good' : 'warn');
    return preview;
  }
  function importSourceEvidence(){
    const parsed = parseSourceImport();
    if(!parsed.ok){
      state.last_source_import_preview = {preview_version: VERSION, ok:false, report:parsed.report, sample_evidence:[], warnings:parsed.warnings};
      state.source_import_report = parsed.report;
      save(); render(); setStatus(tr('statusSourceImportEmpty'), 'warn');
      return parsed;
    }
    const start = state.evidence.length;
    const imported = parsed.evidence.map((item, idx) => Object.assign({}, item, {evidence_id:`E${start + idx + 1}`}));
    state.evidence = state.evidence.concat(imported);
    state.source_import_report = parsed.report;
    state.last_source_import_preview = {preview_version: VERSION, ok:true, report:parsed.report, sample_evidence:imported.slice(0,5), warnings:parsed.warnings};
    state.source_imports = [...(state.source_imports || []), {import_id:'IMP-' + Date.now(), imported_at:nowIso(), report:parsed.report, evidence_ids:imported.map(e=>e.evidence_id)}].slice(-25);
    renumberEvidence();
    save(); render(); setStatus(tr('statusSourceImported'), 'good');
    return parsed;
  }
  function exportSourceImportReport(){
    const report = state.source_import_report || (state.last_source_import_preview && state.last_source_import_preview.report) || null;
    downloadJson(`jarbou3i-source-import-report-${Date.now()}.json`, {workflow_version:VERSION, source_import_report:report, source_imports:state.source_imports || []});
    setStatus(tr('statusSourceImportReportExported'), 'good');
  }
  function clearSourceImport(){
    if($('sourceImportText')) $('sourceImportText').value = '';
    if($('sourceImportFormat')) $('sourceImportFormat').value = 'auto';
    state.last_source_import_preview = null;
    state.source_import_report = null;
    save(); render(); setStatus(tr('statusSourceImportCleared'), 'warn');
  }

  function providerSafetyReport(){
    const provider = $('providerName')?.value || state.provider || 'mock';
    const config = sanitizedProviderConfig(state.provider_config || {}, provider);
    const keyPresent = provider === 'backend_proxy' ? false : !!readProviderKey();
    const verdict = provider === 'mock' ? 'mock_safe' : (provider === 'backend_proxy' ? (config.allow_live ? 'hosted_proxy_ready' : 'dry_run_only') : (config.allow_live && keyPresent ? 'live_byok_ready' : 'dry_run_only'));
    return {
      provider,
      endpoint_configured: !!config.endpoint,
      model_configured: !!config.model,
      live_opt_in: !!config.allow_live,
      key_present: keyPresent,
      key_exported: false,
      key_storage: provider === 'backend_proxy' ? 'server_environment_secret' : (config.remember_key ? 'local_device_only' : 'memory_only'),
      verdict
    };
  }

  function normalizeProviderTextResponse(text){
    return window.Jarbou3iResearchModules.providerCore.normalizeProviderTextResponse(text);
  }
  function hasOwn(obj, key){return !!obj && Object.prototype.hasOwnProperty.call(obj, key);}
  function responseArrayOk(data, key, min = 1){return Array.isArray(data?.[key]) && data[key].length >= min;}

  function validateProviderResponse(payload, response){
    return window.Jarbou3iResearchModules.providerCore.validateProviderResponse(payload, response, {version: VERSION, nowIso});
  }
  function repairProviderResponse(payload, response, validation){
    return window.Jarbou3iResearchModules.providerCore.repairProviderResponse(payload, response, validation, {
      mockProviderResponse,
      validateProviderResponse
    });
  }
  function validationSummary(validation, repairTrace){
    return window.Jarbou3iResearchModules.providerCore.validationSummary(validation, repairTrace);
  }
  async function callOpenAICompatibleProvider(payload, apiKey, config){
    return window.Jarbou3iResearchModules.openAICompatibleProvider.call(payload, apiKey, config, normalizeProviderTextResponse);
  }
  async function callBackendProxyProvider(payload, config){
    return window.Jarbou3iResearchModules.backendProxyProvider.call(payload, config, normalizeProviderTextResponse);
  }
  function dryRunProviderResponse(payload){
    return {
      ok:true,
      type:'provider_dry_run',
      data:{
        verdict:'dry_run_only',
        provider: payload.provider,
        task: payload.task,
        endpoint: payload.provider_config?.endpoint,
        model: payload.provider_config?.model,
        response_contract: payload.response_contract,
        prompt_chars: payload.prompt.length,
        packet_fingerprint: payload.input_fingerprint
      },
      warnings:[tr('statusProviderLiveDisabled')]
    };
  }


  function responseContract(task){
    return window.Jarbou3iResearchModules.providerCore.responseContract(task);
  }
  function stableHash(text){
    return window.Jarbou3iResearchModules.providerCore.stableHash(text);
  }
  function buildProviderPayload(task = $('providerTask')?.value || state.activeProviderTask || 'synthesis'){
    const providerConfig = persistProviderSettings();
    if(!state.plan) state.plan = buildResearchPlan();
    if(task !== 'plan' && !state.analysis_brief && state.evidence.length) compileAnalysisBrief(true);
    const packet = researchPacket();
    const promptMap = {
      plan: buildPlanPrompt(),
      synthesis: buildSynthesisPrompt(),
      repair: `Repair this Jarbou3i strategic analysis candidate so it conforms to schema_version 1.1.0. Return JSON only.\n\nCandidate:\n${JSON.stringify(state.lastMockAnalysis || buildMockAnalysis(), null, 2)}`,
      critique: buildDeepResearchPrompt(),
      source_discipline: `Audit the following research packet for source discipline. Do not verify sources; only inspect metadata completeness and diversity. Return structured JSON.\n\n${JSON.stringify(packet, null, 2)}`
    };
    return {
      request_version: VERSION,
      provider: $('providerName')?.value || state.provider || 'mock',
      provider_config: sanitizedProviderConfig(providerConfig),
      provider_safety: providerSafetyReport(),
      task,
      language: getLang(),
      created_at: nowIso(),
      privacy_mode: (($('providerName')?.value || state.provider) === 'backend_proxy' && providerConfig.allow_live) ? 'hosted_proxy_user_opt_in' : ((($('providerName')?.value || state.provider) === 'openai_compatible' && providerConfig.allow_live) ? 'byok_live_user_opt_in' : 'local_or_dry_run'),
      response_contract: responseContract(task),
      input_fingerprint: stableHash(JSON.stringify(packet)),
      prompt: promptMap[task] || promptMap.synthesis,
      packet
    };
  }


  function providerContractPreview(task = $('providerTask')?.value || state.activeProviderTask || 'synthesis'){
    const contract = responseContract(task);
    return {
      preview_version: VERSION,
      task,
      type: contract.type,
      title: contract.title || contract.type,
      purpose: contract.purpose || '',
      required: contract.required || [],
      recommended: contract.recommended || [],
      reject_if: contract.reject_if || [],
      diagnostic_hints: contract.diagnostic_hints || [],
      example_shape: contract.example_shape || {}
    };
  }

  function providerPromptPreview(payload = buildProviderPayload()){
    return {
      preview_version: VERSION,
      task: payload.task,
      provider: payload.provider,
      prompt_chars: payload.prompt.length,
      prompt_fingerprint: stableHash(payload.prompt),
      input_fingerprint: payload.input_fingerprint,
      privacy_mode: payload.privacy_mode,
      first_1200_chars: payload.prompt.slice(0, 1200),
      truncated: payload.prompt.length > 1200
    };
  }

  function providerDiagnostics(payload = state.last_provider_payload || buildProviderPayload()){
    const contract = payload.response_contract || responseContract(payload.task);
    const safety = payload.provider_safety || providerSafetyReport();
    const missing = [];
    if(!payload.prompt || payload.prompt.length < 200) missing.push('prompt_too_short');
    if(!contract.required || !contract.required.length) missing.push('contract_missing_required_fields');
    if(payload.provider === 'openai_compatible' && payload.provider_config?.allow_live && !safety.key_present) missing.push('live_byok_enabled_without_key');
    if(payload.provider === 'backend_proxy' && payload.provider_config?.allow_live && !payload.provider_config?.endpoint) missing.push('backend_proxy_endpoint_missing');
    if(payload.task !== 'plan' && !state.analysis_brief) missing.push('analysis_brief_not_compiled');
    if(payload.task !== 'plan' && !state.evidence.length) missing.push('evidence_matrix_empty');
    return {
      diagnostics_version: VERSION,
      checked_at: nowIso(),
      task: payload.task,
      provider: payload.provider,
      contract_type: contract.type,
      required_count: (contract.required || []).length,
      prompt_chars: payload.prompt.length,
      input_fingerprint: payload.input_fingerprint,
      privacy_mode: payload.privacy_mode,
      key_exported: false,
      live_opt_in: !!payload.provider_config?.allow_live,
      readiness: missing.length ? 'review_required' : 'provider_ready',
      warnings: missing
    };
  }

  function runProviderFixtureSuite(){
    const report = window.Jarbou3iResearchModules.providerFixtures.runContractFixtureSuite(window.Jarbou3iResearchModules.providerCore);
    state.provider_fixture_report = report;
    state.provider_diagnostics = providerDiagnostics();
    save();
    render();
    setStatus(tr('statusProviderFixtureSuiteRun'), report.fail_count ? 'warn' : 'good');
    return report;
  }

  function mockProviderResponse(payload){
    return window.Jarbou3iResearchModules.mockProvider.response(payload, {
      evidence: state.evidence,
      clampScore,
      buildResearchPlan,
      buildMockAnalysis,
      buildCritique
    });
  }
  function summarizeProviderOutput(data){
    if(!data) return 'No output.';
    if(data.subject?.title) return `Strategic analysis: ${data.subject.title}`;
    if(data.questions) return `Research plan: ${data.questions.length} questions, ${data.target_sources?.length || 0} source targets.`;
    if(data.findings) return `Critique: ${data.findings.length} findings.`;
    if(data.verdict) return `Source discipline: ${data.verdict}.`;
    return 'Structured mock output generated.';
  }

  async function runProviderTask(){
    const started = performance.now();
    const payload = buildProviderPayload();
    state.last_provider_payload = payload;
    state.last_provider_contract_preview = providerContractPreview(payload.task);
    state.last_provider_prompt_preview = providerPromptPreview(payload);
    state.provider_diagnostics = providerDiagnostics(payload);
    let response;
    try {
      if(payload.provider === 'openai_compatible'){
        const key = readProviderKey();
        if(payload.provider_config?.allow_live && key){
          const data = await callOpenAICompatibleProvider(payload, key, payload.provider_config || {});
          response = {ok:true, type: payload.response_contract.type, data, warnings:['Live BYOK provider response. Verify schema and evidence before publication.']};
        } else {
          response = dryRunProviderResponse(payload);
        }
      } else if(payload.provider === 'backend_proxy'){
        if(payload.provider_config?.allow_live){
          const data = await callBackendProxyProvider(payload, payload.provider_config || {});
          response = {ok:true, type: payload.response_contract.type, data, warnings:['Hosted backend proxy response. Verify schema and evidence before publication.']};
        } else {
          response = dryRunProviderResponse(payload);
        }
      } else {
        response = mockProviderResponse(payload);
      }
    } catch(error) {
      response = {ok:false, type:'provider_error', data:{error:String(error && error.message || error)}, warnings:[tr('statusProviderLiveError')]};
    }

    let validation = validateProviderResponse(payload, response);
    let repairTrace = null;
    let appliedResponse = response;
    if(response.ok && validation.repair_required){
      repairTrace = repairProviderResponse(payload, response, validation);
      if(repairTrace.status === 'repaired'){
        appliedResponse = repairTrace.response;
        validation = repairTrace.validation;
      }
    }

    const accepted = !!validation.accepted;
    const completed = performance.now();
    const status = accepted ? (repairTrace?.status === 'repaired' ? 'repaired' : 'ok') : (response.ok ? 'validation_error' : 'error');
    const warnings = [...(response.warnings || [])];
    if(repairTrace?.attempted) warnings.push(repairTrace.status === 'repaired' ? tr('statusProviderRepaired') : tr('statusProviderValidationFailed'));
    if(!accepted && !repairTrace?.attempted) warnings.push(tr('statusProviderValidationFailed'));

    const run = {
      run_id: 'RUN-' + Date.now(),
      run_version: VERSION,
      provider: payload.provider,
      task: payload.task,
      status,
      started_at: payload.created_at,
      completed_at: nowIso(),
      duration_ms: Math.max(1, Math.round(completed - started)),
      input_fingerprint: payload.input_fingerprint,
      response_type: appliedResponse.type,
      response_contract: payload.response_contract,
      response_validation: validation,
      repair_trace: repairTrace ? {
        attempted: repairTrace.attempted,
        strategy: repairTrace.strategy,
        status: repairTrace.status,
        original_task: repairTrace.original_task,
        repair_task: repairTrace.repair_task,
        original_issues: repairTrace.original_issues || []
      } : {attempted:false, status:'not_required'},
      provider_safety: payload.provider_safety,
      warnings,
      output_summary: accepted ? summarizeProviderOutput(appliedResponse.data) : `Rejected: ${(validation.issues || []).slice(0,3).join('; ')}`
    };
    state.ai_runs = [...(state.ai_runs || []), run].slice(-25);
    state.last_provider_validation = validation;
    state.last_repair_trace = run.repair_trace;
    if(accepted && payload.task === 'plan' && appliedResponse.data?.questions) state.plan = appliedResponse.data;
    if(accepted && (payload.task === 'synthesis' || payload.task === 'repair')) state.lastMockAnalysis = appliedResponse.data;
    if(accepted && payload.task === 'critique') state.critique = appliedResponse.data;
    state.provider = payload.provider;
    state.provider_config = sanitizedProviderConfig(payload.provider_config || {});
    state.activeProviderTask = payload.task;
    save(); render();
    const input = $('jsonInput');
    if(input && accepted && (payload.task === 'synthesis' || payload.task === 'repair')){ input.value = JSON.stringify(appliedResponse.data, null, 2); input.dispatchEvent(new Event('input', {bubbles:true})); }
    const statusMessage = accepted ? (repairTrace?.status === 'repaired' ? tr('statusProviderRepaired') : tr('statusProviderRun')) : tr('statusProviderValidationFailed');
    setStatus(statusMessage, accepted ? 'good' : 'bad');
    return {payload, response: appliedResponse, run, validation, repairTrace};
  }

  function qualityScores(){
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
    const safety = providerSafetyReport();
    const byok = safety.provider === 'mock' ? 100 : (safety.provider === 'backend_proxy' ? 100 : ((safety.endpoint_configured && safety.model_configured ? 45 : 0) + (safety.live_opt_in ? 20 : 0) + (safety.key_present ? 20 : 0) + (safety.key_exported === false ? 15 : 0)));
    const backendProxy = safety.provider === 'backend_proxy' ? ((safety.endpoint_configured ? 40 : 0) + (safety.live_opt_in ? 30 : 0) + (safety.key_storage === 'server_environment_secret' ? 20 : 0) + (safety.key_exported === false ? 10 : 0)) : 0;
    const source = Math.min(100, urlCount * 18 + datedCount * 14 + sourceTypes.size * 10);
    const diversity = Math.min(100, sourceTypes.size * 25);
    const counter = Math.min(100, counterCount * 34);
    const readiness = Math.min(100, Math.round((plan * 0.09) + (evidence * 0.14) + (source * 0.10) + (diversity * 0.05) + (counter * 0.07) + (causal * 0.09) + (compiler * 0.07) + (provider * 0.06) + (responseValidation * 0.07) + (contractFixtures * 0.05) + (sourcePlanning * 0.05) + (sourcePolicyScore * 0.04) + (sourceFixtures * 0.04) + (sourceImport * 0.04) + (critique * 0.08)));
    return {plan, evidence, causal, critique, compiler, provider, responseValidation, contractFixtures, sourcePlanning, sourcePolicyScore, sourceFixtures, sourceImport, byok: Math.min(100, byok), backendProxy: Math.min(100, backendProxy), source, diversity, counter, readiness};
  }

  function validateWorkflowPacket(packet){
    if(!packet || typeof packet !== 'object') return false;
    if(packet.workflow_version && !String(packet.workflow_version).startsWith('0.')) return false;
    if(!packet.research_plan || !Array.isArray(packet.evidence_matrix)) return false;
    if(!packet.research_plan.questions || packet.research_plan.questions.length < 3) return false;
    return packet.evidence_matrix.every((item, idx) => item && item.claim && Array.isArray(item.supports) && Array.isArray(item.contradicts) && /^E\d+$/.test(item.evidence_id || `E${idx+1}`));
  }

  function importWorkflowPacket(packet){
    if(!validateWorkflowPacket(packet)) throw new Error('invalid_packet');
    state.plan = Object.assign({}, packet.research_plan, {plan_version: VERSION});
    state.evidence = packet.evidence_matrix.map((item, idx) => Object.assign({}, item, {evidence_id:`E${idx+1}`}));
    state.causal_links = Array.isArray(packet.causal_links) ? packet.causal_links.filter(link => link && validId(link.from) && validId(link.to) && Array.isArray(link.evidence_ids)) : [];
    state.analysis_brief = packet.analysis_brief || null;
    state.diagnostics = packet.diagnostics || null;
    state.critique = packet.critique || null;
    state.provider = packet.provider || state.provider || 'mock';
    state.provider_config = sanitizedProviderConfig(packet.provider_config || state.provider_config || {});
    state.ai_runs = Array.isArray(packet.ai_runs) ? packet.ai_runs.slice(-25) : [];
    state.lastMockAnalysis = null;
    state.provider_diagnostics = packet.provider_diagnostics || null;
    state.provider_fixture_report = packet.provider_fixture_report || null;
    state.source_policy = packet.source_policy || null;
    state.source_diagnostics = packet.source_diagnostics || null;
    state.source_fixture_report = packet.source_fixture_report || null;
    state.last_source_request = Array.isArray(packet.source_requests) ? packet.source_requests[0] || null : null;
    state.source_runs = Array.isArray(packet.source_runs) ? packet.source_runs.slice(-25) : [];
    state.source_imports = Array.isArray(packet.source_imports) ? packet.source_imports.slice(-25) : [];
    state.source_import_report = packet.source_import_report || null;
    state.last_source_import_preview = null;
    state.editingEvidenceIndex = -1;
    save(); render(); setStatus(tr('statusImported'), 'good');
  }

  async function copyText(text){
    try{await navigator.clipboard.writeText(text); setStatus(tr('copied'), 'good'); return true;}
    catch(_){setStatus(tr('copyFailed'), 'warn'); return false;}
  }
  function setStatus(message, tone=''){
    const el = $('researchStatus');
    if(!el) return;
    el.className = `status ${tone}`.trim();
    el.textContent = message;
  }
  function downloadJson(filename, payload){
    const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href), 500);
  }

  function renderLabels(){
    document.querySelectorAll('[data-r-i18n]').forEach(el => { el.textContent = tr(el.getAttribute('data-r-i18n')); });
    document.querySelectorAll('[data-r-placeholder]').forEach(el => { el.setAttribute('placeholder', tr(el.getAttribute('data-r-placeholder'))); });
    updateEvidenceButtonLabel();
  }
  function renderPlan(){
    const el = $('researchPlanOutput');
    if(!el) return;
    if(!state.plan){el.innerHTML = `<p class="muted">${esc(tr('noPlan'))}</p>`; return;}
    el.innerHTML = `<div class="researchJsonCard"><div><b>${esc(state.plan.topic)}</b><span>${esc(state.plan.context)} · ${esc(state.plan.mode)}</span></div><h4>Questions</h4><ul>${state.plan.questions.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><h4>Target sources</h4><div class="miniChips">${state.plan.target_sources.map(x=>`<span>${esc(x)}</span>`).join('')}</div><h4>Early-warning indicators</h4><ul>${state.plan.early_warning_indicators.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`;
  }
  function renderEvidence(){
    const el = $('evidenceMatrixOutput');
    if(!el) return;
    if(!state.evidence.length){el.innerHTML = `<p class="muted">${esc(tr('matrixEmpty'))}</p>`; return;}
    el.innerHTML = `<div class="researchTableWrap"><table class="researchTable"><thead><tr><th>ID</th><th>${esc(tr('claim'))}</th><th>${esc(tr('sourceTitle'))}</th><th>${esc(tr('strength'))}</th><th>${esc(tr('supports'))}</th><th>${esc(tr('contradicts'))}</th><th></th></tr></thead><tbody>${state.evidence.map((e,i)=>`<tr><td>${esc(e.evidence_id)}</td><td><b>${esc(e.claim)}</b><small>${esc(e.notes || '')}</small></td><td>${esc([e.source_title,e.source_type,e.source_date].filter(Boolean).join(' · '))}${e.source_url?`<small>${esc(e.source_url)}</small>`:''}</td><td>${esc(e.evidence_strength)}/5</td><td>${esc((e.supports || []).join(', ') || '—')}</td><td>${esc((e.contradicts || []).join(', ') || '—')}</td><td><div class="rowActions"><button class="btn ghost researchEdit" type="button" data-index="${i}">${esc(tr('edit'))}</button><button class="btn ghost researchDelete" type="button" data-index="${i}">${esc(tr('remove'))}</button></div></td></tr>`).join('')}</tbody></table></div>`;
    document.querySelectorAll('.researchEdit').forEach(btn => btn.addEventListener('click', () => fillEvidenceForm(state.evidence[Number(btn.dataset.index)], Number(btn.dataset.index))));
    document.querySelectorAll('.researchDelete').forEach(btn => btn.addEventListener('click', () => {
      const removedId = state.evidence[Number(btn.dataset.index)]?.evidence_id;
      state.evidence.splice(Number(btn.dataset.index),1);
      renumberEvidence();
      state.causal_links = state.causal_links.filter(link => !(link.evidence_ids || []).includes(removedId));
      state.editingEvidenceIndex = -1;
      save(); render();
    }));
  }
  function renderCausalLinks(){
    const el = $('causalLinksOutput');
    if(!el) return;
    if(!state.causal_links.length){el.innerHTML = `<p class="muted">${esc(tr('causalEmpty'))}</p>`; return;}
    el.innerHTML = `<div class="researchTableWrap"><table class="researchTable causalTable"><thead><tr><th>${esc(tr('linkFrom'))}</th><th>${esc(tr('relationship'))}</th><th>${esc(tr('linkTo'))}</th><th>${esc(tr('evidenceIds'))}</th><th>${esc(tr('confidence'))}</th><th></th></tr></thead><tbody>${state.causal_links.map((link,i)=>`<tr><td>${esc(link.from)}</td><td>${esc(link.relationship)}</td><td>${esc(link.to)}</td><td>${esc((link.evidence_ids || []).join(', '))}</td><td>${esc(link.confidence || 'medium')}</td><td><button class="btn ghost causalDelete" type="button" data-index="${i}">${esc(tr('remove'))}</button></td></tr>`).join('')}</tbody></table></div>`;
    document.querySelectorAll('.causalDelete').forEach(btn => btn.addEventListener('click', () => { state.causal_links.splice(Number(btn.dataset.index),1); save(); render(); }));
  }
  function renderAnalysisBrief(){
    const el = $('analysisBriefOutput');
    if(!el) return;
    if(!state.analysis_brief){el.innerHTML = `<p class="muted">${esc(tr('noAnalysisBrief'))}</p>`; renderDiagnostics(); return;}
    const brief = state.analysis_brief;
    const clusters = brief.source_clusters || [];
    const gaps = brief.gaps || [];
    el.innerHTML = `<div class="researchJsonCard analysisBriefCard"><div><b>${esc(brief.topic)}</b><span>${esc(brief.context)} · readiness ${esc(brief.readiness_score)}/100</span></div><h4>${esc(tr('clusterTitle'))}</h4><div class="miniChips">${clusters.slice(0,12).map(c=>`<span>${esc(c.cluster_id)} · ${esc(c.target_id)} · ${esc(c.evidence_ids.length)}E</span>`).join('') || '<span>—</span>'}</div><h4>${esc(tr('gapsTitle'))}</h4><ul>${(gaps.length ? gaps : ['No critical compiler gaps detected.']).map(x=>`<li>${esc(x)}</li>`).join('')}</ul><h4>Handoff</h4><p class="muted">${esc(brief.handoff_summary || '')}</p></div>`;
    renderDiagnostics();
  }

  function renderDiagnostics(){
    const el = $('validationDiagnosticsOutput');
    if(!el) return;
    const diagnostics = state.diagnostics || diagnosticReport();
    const coverage = diagnostics.coverage || {};
    const coverageRows = Object.entries(coverage).map(([key,value])=>`<span>${esc(key)}: ${esc(value)}</span>`).join('');
    el.innerHTML = `<div class="researchJsonCard diagnosticsCard"><h4>${esc(tr('diagnosticsTitle'))}</h4><div class="miniChips">${coverageRows || '<span>—</span>'}</div><small>${esc(diagnostics.status || 'review_required')} · ${esc((diagnostics.gaps || []).length)} gaps</small></div>`;
  }


  function renderSourceLayer(){
    const el = $('sourcePlanningOutput');
    if(!el) return;
    if($('sourceConnector')) $('sourceConnector').value = state.source_connector || 'manual_mock';
    if($('sourceTask')) $('sourceTask').value = state.source_task || 'source_plan';
    const policy = state.source_policy || sourcePolicy();
    const request = state.last_source_request;
    const diagnostics = state.source_diagnostics;
    const fixture = state.source_fixture_report;
    const requestHtml = request ? `<div class="researchJsonCard sourceRequestCard"><h4>Source request</h4><div class="miniChips"><span>${esc(request.connector)}</span><span>${esc(request.task)}</span><span>live:${esc(request.live_fetching_enabled)}</span></div><small>${esc((request.research_questions || []).length)} questions · ${esc((request.target_sources || []).length)} source targets · ${esc((request.keywords || []).length)} keywords</small></div>` : `<p class="muted">${esc(tr('sourcePolicyNote'))}</p>`;
    const policyHtml = `<div class="researchJsonCard sourcePolicyCard"><h4>Source policy</h4><div class="miniChips"><span>${esc(policy.verdict)}</span><span>live_fetching:${esc(policy.live_fetching_enabled)}</span><span>${esc(policy.current_layer)}</span></div><small>${esc((policy.prohibited_actions || []).slice(0,2).join(' · '))}</small></div>`;
    const diagnosticsHtml = diagnostics ? `<div class="researchJsonCard sourceDiagnosticsCard"><h4>${esc(tr('sourceDiagnosticsTitle'))}</h4><div class="miniChips"><span>${esc(diagnostics.readiness)}</span><span>${esc(diagnostics.evidence_count)} evidence</span><span>${esc(diagnostics.source_type_count)} source types</span></div><ul>${(diagnostics.warnings || ['no source warnings']).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>` : '';
    const fixtureHtml = fixture ? `<div class="researchJsonCard sourceFixtureCard"><h4>${esc(tr('sourceFixtureSuiteTitle'))}</h4><div class="miniChips"><span>${esc(fixture.pass_count)}/${esc(fixture.fixture_count)} passed</span><span>fails:${esc(fixture.fail_count)}</span><span>live:${esc(fixture.live_fetching_performed)}</span></div></div>` : '';
    el.innerHTML = requestHtml + policyHtml + diagnosticsHtml + fixtureHtml;
  }

  function renderSourceImportAdapter(){
    const el = $('sourceImportOutput');
    if(!el) return;
    const preview = state.last_source_import_preview;
    const report = state.source_import_report || preview?.report;
    if(!preview && !report){
      el.innerHTML = `<p class="muted">${esc(tr('sourceImportPolicyNote'))}</p>`;
      return;
    }
    const sample = preview?.sample_evidence || [];
    const sampleRows = sample.length ? `<div class="researchTableWrap"><table class="researchTable"><thead><tr><th>ID</th><th>${esc(tr('claim'))}</th><th>${esc(tr('sourceTitle'))}</th><th>${esc(tr('sourceType'))}</th><th>${esc(tr('strength'))}</th></tr></thead><tbody>${sample.map((e,i)=>`<tr><td>${esc(e.evidence_id || `IMP${i+1}`)}</td><td>${esc(e.claim)}</td><td>${esc(e.source_title || '—')}<small>${esc(e.source_url || '')}</small></td><td>${esc(e.source_type || 'other')}</td><td>${esc(e.evidence_strength || 1)}/5</td></tr>`).join('')}</tbody></table></div>` : '';
    const reportHtml = report ? `<div class="researchJsonCard sourceImportReportCard"><h4>${esc(tr('sourceImportReportTitle'))}</h4><div class="miniChips"><span>${esc(report.input_format || 'unknown')}</span><span>${esc(report.converted_count || 0)} converted</span><span>${esc(report.rejected_count || 0)} rejected</span><span>live:${esc(report.live_fetching_performed)}</span><span>verified:${esc(report.verification_claimed)}</span></div><small>${esc((report.source_types || []).join(', ') || 'no source types')}</small></div>` : '';
    el.innerHTML = reportHtml + sampleRows;
  }

  function renderProviderHarness(){
    const contractEl = $('providerContractPreview');
    const promptEl = $('providerPromptPreview');
    const diagEl = $('providerDiagnosticsOutput');
    const runEl = $('providerRunOutput');
    const currentTask = $('providerTask')?.value || state.activeProviderTask || 'synthesis';
    const contract = state.last_provider_contract_preview || providerContractPreview(currentTask);
    const promptPreview = state.last_provider_prompt_preview || (state.last_provider_payload ? providerPromptPreview(state.last_provider_payload) : null);
    const diagnostics = state.provider_diagnostics || (state.last_provider_payload ? providerDiagnostics(state.last_provider_payload) : null);
    const fixtureReport = state.provider_fixture_report;

    if(contractEl){
      contractEl.innerHTML = `<strong>${esc(tr('providerContractLabel'))}</strong><span>${esc(contract.title || contract.type)} · ${esc(contract.type)}</span><small>${esc((contract.required || []).length)} required · ${(contract.required || []).slice(0,5).map(esc).join(', ')}</small>`;
    }
    if(promptEl){
      if(promptPreview){
        promptEl.innerHTML = `<strong>${esc(tr('providerPromptLabel'))}</strong><span>${esc(promptPreview.task)} · ${esc(promptPreview.prompt_chars)} chars · ${esc(promptPreview.prompt_fingerprint)}</span><small>${esc(promptPreview.privacy_mode)}${promptPreview.truncated ? ' · truncated preview' : ''}</small>`;
      } else {
        promptEl.innerHTML = `<strong>${esc(tr('providerPromptLabel'))}</strong><span>No prompt preview yet.</span><small>Use preview or dry-run.</small>`;
      }
    }

    if(diagEl){
      const diagHtml = diagnostics ? `<div class="researchJsonCard providerDiagnosticsCard"><h4>${esc(tr('providerDiagnosticsTitle'))}</h4><div class="miniChips"><span>${esc(diagnostics.readiness)}</span><span>${esc(diagnostics.contract_type)}</span><span>${esc(diagnostics.prompt_chars)} chars</span><span>key_exported:${esc(diagnostics.key_exported)}</span></div><ul>${(diagnostics.warnings || ['no provider diagnostic warnings']).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>` : '';
      const fixtureHtml = fixtureReport ? `<div class="researchJsonCard fixtureSuiteCard"><h4>${esc(tr('fixtureSuiteTitle'))}</h4><div class="miniChips"><span>${esc(fixtureReport.pass_count)}/${esc(fixtureReport.fixture_count)} passed</span><span>fails:${esc(fixtureReport.fail_count)}</span></div><ul>${(fixtureReport.results || []).map(item=>`<li><strong>${esc(item.fixture_id)}</strong>: ${esc(item.pass ? 'pass' : 'fail')} · accepted:${esc(item.accepted)} · issues:${esc(item.issue_count)}</li>`).join('')}</ul></div>` : '';
      diagEl.innerHTML = diagHtml + fixtureHtml;
    }

    if(!runEl) return;
    const runs = state.ai_runs || [];
    if(!runs.length){ runEl.innerHTML = `<p class="muted">${esc(tr('runLedgerEmpty'))}</p>`; return; }
    runEl.innerHTML = `<div class="researchTableWrap"><table class="researchTable providerTable"><thead><tr><th>Run</th><th>${esc(tr('providerTask'))}</th><th>${esc(tr('providerName'))}</th><th>Status</th><th>Validation</th><th>Output</th></tr></thead><tbody>${runs.slice().reverse().map(run=>`<tr><td>${esc(run.run_id)}</td><td>${esc(run.task)}</td><td>${esc(run.provider)}</td><td>${esc(run.status)} · ${esc(run.duration_ms)}ms</td><td>${esc(validationSummary(run.response_validation, run.repair_trace))}</td><td>${esc(run.output_summary)}<small>${esc((run.warnings || []).join(' · '))}</small></td></tr>`).join('')}</tbody></table></div>`;
  }

  function renderCritique(){
    const el = $('critiqueOutput');
    if(!el) return;
    if(!state.critique){el.innerHTML = ''; return;}
    el.innerHTML = `<div class="researchJsonCard critiqueCard"><b>${esc(state.critique.summary)}</b><ul>${state.critique.findings.map(f=>`<li><strong>${esc(f.type)} · ${esc(f.severity)}</strong>: ${esc(f.finding)}</li>`).join('')}</ul><h4>Next actions</h4><ul>${state.critique.recommended_next_actions.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`;
  }
  function renderQuality(){
    const scores = qualityScores();
    const el = $('researchQualityOutput');
    if(!el) return;
    const rows = [['planScore', scores.plan], ['evidenceScore', scores.evidence], ['sourceScore', scores.source], ['diversityScore', scores.diversity], ['counterScore', scores.counter], ['causalScore', scores.causal], ['compilerScore', scores.compiler], ['providerScore', scores.provider], ['responseValidationScore', scores.responseValidation], ['contractFixtureScore', scores.contractFixtures], ['sourcePlanningScore', scores.sourcePlanning], ['sourcePolicyScore', scores.sourcePolicyScore], ['sourceFixtureScore', scores.sourceFixtures], ['sourceImportScore', scores.sourceImport], ['byokScore', scores.byok], ['backendProxyScore', scores.backendProxy], ['critiqueScore', scores.critique], ['readiness', scores.readiness]];
    el.innerHTML = rows.map(([label,value]) => `<div class="researchScore"><span>${esc(tr(label))}</span><strong>${value}</strong><meter min="0" max="100" value="${value}"></meter></div>`).join('');
  }
  function render(){renderLabels(); renderPlan(); renderEvidence(); renderCausalLinks(); renderAnalysisBrief(); renderSourceLayer(); renderSourceImportAdapter(); renderProviderHarness(); renderCritique(); renderQuality();}

  function wire(){
    $('generatePlanBtn')?.addEventListener('click', () => { state.plan = buildResearchPlan(); save(); render(); setStatus(tr('statusReady'), 'good'); });
    $('copyPlanPromptBtn')?.addEventListener('click', () => copyText(buildPlanPrompt()));
    $('clearPlanBtn')?.addEventListener('click', () => { state.plan = null; save(); render(); setStatus(tr('statusNeedPlan'), 'warn'); });
    $('addEvidenceBtn')?.addEventListener('click', () => {
      try {
        const entry = makeEvidenceEntry();
        if(state.editingEvidenceIndex >= 0) state.evidence[state.editingEvidenceIndex] = entry;
        else state.evidence.push(entry);
        renumberEvidence(); save(); clearEvidenceForm(); render(); setStatus(tr('statusReady'), 'good');
      } catch(_) { setStatus(`${tr('claim')} required.`, 'bad'); }
    });
    $('cancelEvidenceEditBtn')?.addEventListener('click', () => { clearEvidenceForm(); save(); render(); });
    $('loadDemoEvidenceBtn')?.addEventListener('click', loadDemoEvidence);
    $('exportWorkflowBtn')?.addEventListener('click', () => { downloadJson('jarbou3i-research-packet-v0.8-alpha.json', researchPacket()); setStatus(tr('statusExported'), 'good'); });
    $('importWorkflowInput')?.addEventListener('change', async (event) => {
      const file = event.target.files?.[0];
      if(!file) return;
      try { importWorkflowPacket(JSON.parse(await file.text())); }
      catch(_) { setStatus(tr('statusInvalidPacket'), 'bad'); }
      event.target.value = '';
    });
    $('clearEvidenceBtn')?.addEventListener('click', () => { state.evidence = []; state.causal_links = []; state.analysis_brief = null; state.diagnostics = null; state.lastMockAnalysis = null; state.editingEvidenceIndex = -1; clearEvidenceForm(); save(); render(); setStatus(tr('statusNeedEvidence'), 'warn'); });
    $('addCausalLinkBtn')?.addEventListener('click', () => {
      try { state.causal_links.push(makeCausalLink()); clearCausalForm(); save(); render(); setStatus(tr('statusLinkAdded'), 'good'); }
      catch(_) { setStatus(tr('statusInvalidLink'), 'bad'); }
    });
    $('inferCausalLinksBtn')?.addEventListener('click', () => { inferCausalLinks(); save(); render(); setStatus(tr('statusLinksInferred'), 'good'); });
    $('clearCausalLinksBtn')?.addEventListener('click', () => { state.causal_links = []; state.analysis_brief = null; state.diagnostics = null; save(); render(); });
    $('compileBriefBtn')?.addEventListener('click', () => { compileAnalysisBrief(true); render(); setStatus(tr('statusCompiled'), 'good'); });
    $('copySynthesisPromptBtn')?.addEventListener('click', () => copyText(buildSynthesisPrompt()));
    $('exportAnalysisBriefBtn')?.addEventListener('click', () => { const brief = state.analysis_brief || compileAnalysisBrief(true); downloadJson('jarbou3i-analysis-brief-v0.8-alpha.json', brief); setStatus(tr('statusBriefExported'), 'good'); });
    $('clearAnalysisBriefBtn')?.addEventListener('click', () => { state.analysis_brief = null; state.diagnostics = null; save(); render(); setStatus(tr('statusBriefCleared'), 'warn'); });
    $('validateProviderSettingsBtn')?.addEventListener('click', () => { persistProviderSettings(); render(); setStatus(tr('statusProviderSettingsSaved'), 'good'); });
    $('dryRunProviderRequestBtn')?.addEventListener('click', () => { persistProviderSettings(); state.last_provider_payload = buildProviderPayload(); state.last_provider_contract_preview = providerContractPreview(state.last_provider_payload.task); state.last_provider_prompt_preview = providerPromptPreview(state.last_provider_payload); state.provider_diagnostics = providerDiagnostics(state.last_provider_payload); save(); render(); setStatus(tr('statusProviderDryRun'), 'good'); });
    $('runProviderTaskBtn')?.addEventListener('click', runProviderTask);
    $('previewProviderContractBtn')?.addEventListener('click', () => {
      const task = $('providerTask')?.value || state.activeProviderTask || 'synthesis';
      state.last_provider_contract_preview = providerContractPreview(task);
      state.provider_diagnostics = providerDiagnostics(buildProviderPayload(task));
      save(); render(); setStatus(tr('statusProviderContractPreviewed'), 'good');
    });
    $('previewProviderPromptBtn')?.addEventListener('click', () => {
      const payload = buildProviderPayload();
      state.last_provider_payload = payload;
      state.last_provider_prompt_preview = providerPromptPreview(payload);
      state.provider_diagnostics = providerDiagnostics(payload);
      save(); render(); setStatus(tr('statusProviderPromptPreviewed'), 'good');
    });
    $('runProviderFixtureSuiteBtn')?.addEventListener('click', runProviderFixtureSuite);
    $('exportProviderDiagnosticsBtn')?.addEventListener('click', () => {
      const payload = state.last_provider_payload || buildProviderPayload();
      const diagnostics = {
        diagnostics_version: VERSION,
        generated_at: nowIso(),
        contract: providerContractPreview(payload.task),
        prompt_preview: providerPromptPreview(payload),
        provider_diagnostics: providerDiagnostics(payload),
        fixture_report: state.provider_fixture_report || null,
        last_validation: state.last_provider_validation || null,
        repair_trace: state.last_repair_trace || null
      };
      downloadJson('jarbou3i-provider-diagnostics-v0.8-alpha.json', diagnostics);
      setStatus(tr('statusProviderDiagnosticsExported'), 'good');
    });
    $('copyProviderPayloadBtn')?.addEventListener('click', () => copyText(JSON.stringify(buildProviderPayload(), null, 2)));
    ['providerName','providerTask','providerEndpoint','providerModel','providerApiKey','enableLiveByok','rememberProviderKey'].forEach(id => $(id)?.addEventListener('change', () => { persistProviderSettings(); state.last_provider_contract_preview = providerContractPreview(); render(); }));
    $('exportRunLedgerBtn')?.addEventListener('click', () => { downloadJson('jarbou3i-provider-run-ledger-v0.8-alpha.json', {workflow_version: VERSION, ai_runs: state.ai_runs || []}); setStatus(tr('statusLedgerExported'), 'good'); });
    $('clearRunLedgerBtn')?.addEventListener('click', () => { state.ai_runs = []; save(); render(); setStatus(tr('statusLedgerCleared'), 'warn'); });
    $('buildSourceTaskBtn')?.addEventListener('click', runSourceTask);
    $('copySourceRequestBtn')?.addEventListener('click', copySourceRequest);
    $('runSourceFixtureSuiteBtn')?.addEventListener('click', runSourceFixtureSuite);
    $('exportSourcePolicyBtn')?.addEventListener('click', exportSourcePolicy);
    $("previewSourceImportBtn")?.addEventListener("click", previewSourceImport);
    $("importSourceEvidenceBtn")?.addEventListener("click", importSourceEvidence);
    $("exportSourceImportReportBtn")?.addEventListener("click", exportSourceImportReport);
    $("clearSourceImportBtn")?.addEventListener("click", clearSourceImport);
    ['sourceConnector','sourceTask'].forEach(id => $(id)?.addEventListener('change', () => { state.source_connector = $('sourceConnector')?.value || 'manual_mock'; state.source_task = $('sourceTask')?.value || 'source_plan'; state.last_source_request = null; save(); render(); }));
    $('generateMockAnalysisBtn')?.addEventListener('click', () => {
      if(!state.plan) state.plan = buildResearchPlan();
      if(!state.evidence.length) loadDemoEvidence();
      if(!state.causal_links.length) inferCausalLinks();
      compileAnalysisBrief(true);
      const analysis = buildMockAnalysis();
      state.lastMockAnalysis = analysis; save(); render();
      const input = $('jsonInput');
      if(input){ input.value = JSON.stringify(analysis, null, 2); input.dispatchEvent(new Event('input', {bubbles:true})); }
      setStatus(tr('statusGenerated'), 'good');
      $('pasteCard')?.scrollIntoView({behavior:'smooth', block:'center'});
    });
    $('runMockRepairBtn')?.addEventListener('click', () => {
      if(!state.plan) state.plan = buildResearchPlan();
      if(!state.evidence.length) loadDemoEvidence();
      if(!state.causal_links.length) inferCausalLinks();
      compileAnalysisBrief(true);
      const analysis = buildMockAnalysis();
      state.lastMockAnalysis = analysis; save(); render();
      const input = $('jsonInput');
      if(input){ input.value = JSON.stringify(analysis, null, 2); input.dispatchEvent(new Event('input', {bubbles:true})); }
      setStatus(tr('statusRepaired'), 'good');
    });
    $('runCritiqueBtn')?.addEventListener('click', () => { state.critique = buildCritique(); save(); render(); setStatus(tr('statusCritiqued'), 'good'); });
    $('copyDeepPromptBtn')?.addEventListener('click', () => copyText(buildDeepResearchPrompt()));
    ['langAr','langEn','langFr'].forEach(id => $(id)?.addEventListener('click', () => setTimeout(render, 40)));
  }

  document.addEventListener('DOMContentLoaded', () => { wire(); applyProviderSettingsToUi(); render(); });
})();
