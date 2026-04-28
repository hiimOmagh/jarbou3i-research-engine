/* Jarbou3i Research Engine v0.2.0-alpha — evidence + causal-link workbench. No live AI calls. */
(function(){
  'use strict';

  const VERSION = '0.2.0-alpha';
  const STORAGE_KEY = 'jarbou3i.researchEngine.alpha.v0.2';
  const SUPPORTED_LANGS = ['ar','en','fr'];
  const RELATIONSHIPS = ['motivates','enables','constrains','contradicts','amplifies'];
  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const nowIso = () => new Date().toISOString();

  const COPY = {
    en: {
      researchTitle:'Research Workflow Lab',
      researchSubtitle:'Experimental research-to-strategy pipeline. Manual mode remains untouched; this layer builds plan, evidence, causal links, mock AI, critique, and Quality Gate v2.',
      alphaBadge:'v0.2.0-alpha · no live AI',
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
      workflowTitle:'4. Mock AI Workflow', workflowSubtitle:'Provider abstraction starts with a mock provider. It creates valid analysis JSON without calling any external API.', generateMock:'Generate mock analysis JSON', runMockRepair:'Run mock repair', runCritique:'Run mock critique', copyDeepPrompt:'Copy deep-research prompt',
      qualityTitle:'Quality Gate v2', planScore:'Plan', evidenceScore:'Evidence', causalScore:'Causal links', critiqueScore:'Critique', sourceScore:'Source discipline', diversityScore:'Source diversity', counterScore:'Counter-evidence', readiness:'Readiness',
      statusReady:'Research workflow ready for mock synthesis.', statusNeedPlan:'Generate a research plan first.', statusNeedEvidence:'Add evidence before synthesis.', statusGenerated:'Mock analysis JSON generated and placed in the import box.', statusRepaired:'Mock repair produced schema-compatible JSON.', statusCritiqued:'Mock critique generated.', statusImported:'Research packet imported.', statusExported:'Research packet exported.', statusEditing:'Evidence item loaded for editing.', statusLinkAdded:'Causal link added.', statusLinksInferred:'Causal links inferred from evidence.', statusInvalidPacket:'Invalid research packet.', statusInvalidLink:'Causal link requires From, To, and at least one evidence ID.', copied:'Copied.', copyFailed:'Copy failed. Use the visible text manually.',
      urlOptional:'https://example.com/source', claimPlaceholder:'Observable claim or research finding', sourcePlaceholder:'Publication, report, dataset, transcript, or note title', supportsPlaceholder:'I1,A1,T1', contradictsPlaceholder:'N1,R1', notesPlaceholder:'Why this evidence matters / uncertainty / limitations'
    },
    ar: {
      researchTitle:'مختبر سير العمل البحثي',
      researchSubtitle:'طبقة تجريبية تربط البحث بالتحليل الاستراتيجي. النمط اليدوي يبقى كما هو؛ هذه الطبقة تضيف خطة، مصفوفة أدلة، روابط سببية، محاكاة AI، نقد، وبوابة جودة v2.',
      alphaBadge:'v0.2.0-alpha · بدون AI مباشر',
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
      workflowTitle:'4. سير AI تجريبي', workflowSubtitle:'تجريد المزوّد يبدأ بمزوّد وهمي. ينتج JSON صالحًا دون الاتصال بأي API خارجي.', generateMock:'توليد JSON تحليلي تجريبي', runMockRepair:'تشغيل إصلاح تجريبي', runCritique:'تشغيل نقد تجريبي', copyDeepPrompt:'نسخ برومبت البحث العميق',
      qualityTitle:'بوابة الجودة v2', planScore:'الخطة', evidenceScore:'الأدلة', causalScore:'الروابط السببية', critiqueScore:'النقد', sourceScore:'انضباط المصادر', diversityScore:'تنوع المصادر', counterScore:'الأدلة المضادة', readiness:'الجاهزية',
      statusReady:'سير العمل البحثي جاهز للمحاكاة.', statusNeedPlan:'ولّد خطة بحث أولًا.', statusNeedEvidence:'أضف أدلة قبل التوليف.', statusGenerated:'تم توليد JSON تجريبي ووضعه في خانة الاستيراد.', statusRepaired:'الإصلاح التجريبي أنتج JSON متوافقًا.', statusCritiqued:'تم توليد نقد تجريبي.', statusImported:'تم استيراد حزمة البحث.', statusExported:'تم تصدير حزمة البحث.', statusEditing:'تم تحميل الدليل للتعديل.', statusLinkAdded:'تمت إضافة الرابط السببي.', statusLinksInferred:'تم استنتاج الروابط السببية من الأدلة.', statusInvalidPacket:'حزمة البحث غير صالحة.', statusInvalidLink:'الرابط السببي يحتاج من/إلى وعلى الأقل ID دليل واحد.', copied:'تم النسخ.', copyFailed:'تعذر النسخ. استخدم النص الظاهر يدويًا.',
      urlOptional:'https://example.com/source', claimPlaceholder:'ادعاء قابل للملاحظة أو نتيجة بحثية', sourcePlaceholder:'تقرير، دراسة، قاعدة بيانات، تفريغ، أو ملاحظة', supportsPlaceholder:'I1,A1,T1', contradictsPlaceholder:'N1,R1', notesPlaceholder:'لماذا هذا الدليل مهم / عدم اليقين / الحدود'
    },
    fr: {
      researchTitle:'Laboratoire de workflow de recherche',
      researchSubtitle:'Couche expérimentale reliant la recherche à l’analyse stratégique. Le mode manuel reste intact; cette couche ajoute plan, matrice de preuves, liens causaux, IA simulée, critique et barrière qualité v2.',
      alphaBadge:'v0.2.0-alpha · aucune IA active',
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
      workflowTitle:'4. Workflow IA simulé', workflowSubtitle:'L’abstraction fournisseur commence par un fournisseur simulé. Il crée un JSON valide sans API externe.', generateMock:'Générer JSON simulé', runMockRepair:'Réparation simulée', runCritique:'Critique simulée', copyDeepPrompt:'Copier prompt deep-research',
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
    lastMockAnalysis: null,
    editingEvidenceIndex: -1,
    provider: 'mock',
    version: VERSION
  });

  function migrate(parsed){
    const next = Object.assign(defaultState(), parsed || {});
    next.version = VERSION;
    next.evidence = Array.isArray(next.evidence) ? next.evidence : (Array.isArray(next.evidence_matrix) ? next.evidence_matrix : []);
    next.causal_links = Array.isArray(next.causal_links) ? next.causal_links : [];
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
    targetState.evidence = targetState.evidence.map((e,i)=>Object.assign({}, e, {evidence_id:`E${i+1}`}));
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
    return `You are a rigorous research-planning agent for Jarbou3i Research Engine.\n\nTopic: ${topic()}\nContext: ${context()}\nMode: ${researchMode()}\n\nReturn JSON only with this shape:\n{\n  "plan_version": "${VERSION}",\n  "topic": "string",\n  "context": "string",\n  "questions": ["string"],\n  "target_actors": ["string"],\n  "target_sources": ["official|academic|news|social|market|expert|primary|other"],\n  "keywords": ["string"],\n  "counter_evidence_targets": ["string"],\n  "early_warning_indicators": ["string"]\n}\n\nRules:\n- Separate observation, inference, and estimate.\n- Include counter-evidence targets.\n- Include early-warning indicators.\n- Do not generate the final strategic analysis yet.`;
  }

  function researchPacket(){
    return {
      workflow_version: VERSION,
      generated_at: nowIso(),
      research_plan: state.plan,
      evidence_matrix: state.evidence,
      causal_links: state.causal_links,
      critique: state.critique
    };
  }

  function buildDeepResearchPrompt(){
    return `You are a deep-research agent feeding Jarbou3i Research Engine.\n\nUse the provided research packet to produce a source-disciplined strategic analysis.\n\nInput research packet:\n${JSON.stringify(researchPacket(), null, 2)}\n\nTask:\n1. Identify missing evidence and source weaknesses.\n2. Cluster related evidence claims.\n3. Separate observation, inference, and estimate.\n4. Use causal_links only where evidence_ids are present.\n5. Produce a Jarbou3i strategic analysis JSON using Interests → Actors → Tools → Narrative → Results → Feedback.\n6. Include contradictions, scenarios, assumptions, evidence, counter-evidence, and falsifiers.\n7. Return JSON only.\n\nDo not claim that sources are verified unless URLs and dates are present.`;
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
    const source = Math.min(100, urlCount * 18 + datedCount * 14 + sourceTypes.size * 10);
    const diversity = Math.min(100, sourceTypes.size * 25);
    const counter = Math.min(100, counterCount * 34);
    const readiness = Math.round((plan * 0.16) + (evidence * 0.22) + (source * 0.16) + (diversity * 0.10) + (counter * 0.12) + (causal * 0.14) + (critique * 0.10));
    return {plan, evidence, causal, critique, source, diversity, counter, readiness};
  }

  function validateWorkflowPacket(packet){
    if(!packet || typeof packet !== 'object') return false;
    if(packet.workflow_version && packet.workflow_version !== VERSION) return false;
    if(!packet.research_plan || !Array.isArray(packet.evidence_matrix)) return false;
    if(!packet.research_plan.questions || packet.research_plan.questions.length < 3) return false;
    return packet.evidence_matrix.every((item, idx) => item && item.claim && Array.isArray(item.supports) && Array.isArray(item.contradicts) && /^E\d+$/.test(item.evidence_id || `E${idx+1}`));
  }

  function importWorkflowPacket(packet){
    if(!validateWorkflowPacket(packet)) throw new Error('invalid_packet');
    state.plan = Object.assign({}, packet.research_plan, {plan_version: VERSION});
    state.evidence = packet.evidence_matrix.map((item, idx) => Object.assign({}, item, {evidence_id:`E${idx+1}`}));
    state.causal_links = Array.isArray(packet.causal_links) ? packet.causal_links.filter(link => link && validId(link.from) && validId(link.to) && Array.isArray(link.evidence_ids)) : [];
    state.critique = packet.critique || null;
    state.lastMockAnalysis = null;
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
    const rows = [['planScore', scores.plan], ['evidenceScore', scores.evidence], ['sourceScore', scores.source], ['diversityScore', scores.diversity], ['counterScore', scores.counter], ['causalScore', scores.causal], ['critiqueScore', scores.critique], ['readiness', scores.readiness]];
    el.innerHTML = rows.map(([label,value]) => `<div class="researchScore"><span>${esc(tr(label))}</span><strong>${value}</strong><meter min="0" max="100" value="${value}"></meter></div>`).join('');
  }
  function render(){renderLabels(); renderPlan(); renderEvidence(); renderCausalLinks(); renderCritique(); renderQuality();}

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
    $('exportWorkflowBtn')?.addEventListener('click', () => { downloadJson('jarbou3i-research-packet-v0.2-alpha.json', researchPacket()); setStatus(tr('statusExported'), 'good'); });
    $('importWorkflowInput')?.addEventListener('change', async (event) => {
      const file = event.target.files?.[0];
      if(!file) return;
      try { importWorkflowPacket(JSON.parse(await file.text())); }
      catch(_) { setStatus(tr('statusInvalidPacket'), 'bad'); }
      event.target.value = '';
    });
    $('clearEvidenceBtn')?.addEventListener('click', () => { state.evidence = []; state.causal_links = []; state.lastMockAnalysis = null; state.editingEvidenceIndex = -1; clearEvidenceForm(); save(); render(); setStatus(tr('statusNeedEvidence'), 'warn'); });
    $('addCausalLinkBtn')?.addEventListener('click', () => {
      try { state.causal_links.push(makeCausalLink()); clearCausalForm(); save(); render(); setStatus(tr('statusLinkAdded'), 'good'); }
      catch(_) { setStatus(tr('statusInvalidLink'), 'bad'); }
    });
    $('inferCausalLinksBtn')?.addEventListener('click', () => { inferCausalLinks(); save(); render(); setStatus(tr('statusLinksInferred'), 'good'); });
    $('clearCausalLinksBtn')?.addEventListener('click', () => { state.causal_links = []; save(); render(); });
    $('generateMockAnalysisBtn')?.addEventListener('click', () => {
      if(!state.plan) state.plan = buildResearchPlan();
      if(!state.evidence.length) loadDemoEvidence();
      if(!state.causal_links.length) inferCausalLinks();
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

  document.addEventListener('DOMContentLoaded', () => { wire(); render(); });
})();
