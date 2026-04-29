/* Jarbou3i Research Engine render helpers v0.29.0-rc.1. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};
  const COPY = {
    en: {
      researchTitle:'Research Workflow Lab',
      researchSubtitle:'Experimental research-to-strategy pipeline. Manual mode remains untouched; this layer builds plan, evidence, causal links, mock AI, critique, and Quality Gate v3.',
      alphaBadge:'v0.29.0-rc.1 · Release Candidate Freeze',
      planTitle:'1. Research Plan',
      planSubtitle:'Convert the topic into research questions, source targets, actor targets, counter-evidence targets, and early-warning indicators.',
      planMode:'Research mode',
      modeStructural:'Structural', modeRecent:'Recent signals', modeSourceHeavy:'Source-heavy', modeAdversarial:'Adversarial',
      generatePlan:'Generate research plan', copyPlanPrompt:'Copy plan prompt', clearPlan:'Clear plan', noPlan:'No research plan yet.',
      evidenceTitle:'2. Evidence Matrix',
      evidenceSubtitle:'Evidence becomes a first-class object before analysis. Each claim can support or contradict model layers.',
      claim:'Claim', sourceTitle:'Source title', sourceUrl:'Source URL', sourceType:'Source type', sourceDate:'Source date', strength:'Strength', timeRelevance:'Time relevance', publicSignal:'Public signal', supports:'Supports IDs', contradicts:'Contradicts IDs', confidence:'Confidence', notes:'Notes',
      addEvidence:'Add evidence', updateEvidence:'Update evidence', cancelEdit:'Cancel edit', loadDemoEvidence:'Load demo evidence', exportWorkflow:'Export research packet', exportPackV2:'Export Pack v2', statusExportPackExported:'Export Pack v2 generated.', importWorkflow:'Import research packet', clearEvidence:'Clear evidence', matrixEmpty:'Evidence matrix is empty.', edit:'Edit', remove:'Remove',
      causalTitle:'3. Causal Links', causalSubtitle:'Connect interests, actors, tools, narratives, results, feedback, and evidence into explicit causal claims.', linkFrom:'From', linkTo:'To', relationship:'Relationship', evidenceIds:'Evidence IDs', addCausalLink:'Add causal link', inferCausalLinks:'Infer from evidence', clearCausalLinks:'Clear links', causalEmpty:'No causal links yet.',
      compilerTitle:'4. Analysis Compiler', compilerSubtitle:'Compile evidence, source clusters, coverage gaps, and causal links into a synthesis-ready analysis brief.', compileBrief:'Compile analysis brief', copySynthesisPrompt:'Copy synthesis prompt', exportAnalysisBrief:'Export analysis brief', clearAnalysisBrief:'Clear brief', noAnalysisBrief:'No analysis brief compiled yet.', clusterTitle:'Source clusters', gapsTitle:'Coverage gaps', diagnosticsTitle:'Validation diagnostics', compilerScore:'Compiler', statusCompiled:'Analysis brief compiled.', statusBriefExported:'Analysis brief exported.', statusBriefCleared:'Analysis brief cleared.',
      providerTitle:'5. Provider Harness', providerSubtitle:'Provider-ready request contracts with mock, BYOK, hosted backend proxy, and portable-account mock modes. Live calls require explicit opt-in.', providerName:'Provider', providerTask:'Task', providerEndpoint:'Endpoint', providerModel:'Model', providerApiKey:'API key', rememberProviderKey:'Remember locally on this device', enableLiveByok:'Enable live provider calls', providerSafety:'Safety: manual/private mode remains default. Keys are never exported into packets, reports, or run ledgers.', validateProviderSettings:'Validate provider settings', dryRunProviderRequest:'Build dry-run request', taskPlan:'Research plan', taskSynthesis:'Strategic synthesis', taskRepair:'JSON repair', taskCritique:'Critique', taskSourceDiscipline:'Source discipline', runProviderTask:'Run provider task', copyProviderPayload:'Copy provider payload', exportRunLedger:'Export run ledger', clearRunLedger:'Clear run ledger', runLedgerEmpty:'No provider runs yet.', providerScore:'Provider harness', byokScore:'BYOK safety', backendProxyScore:'Backend proxy', providerIdentityScore:'Provider identity', statusProviderRun:'Provider task completed.', statusProviderDryRun:'Provider payload built without live network call.', statusProviderSettingsSaved:'Provider settings validated and saved.', statusProviderLiveDisabled:'Live provider calls disabled; dry-run/mock response recorded.', statusProviderLiveError:'Live provider call failed; no key was stored in the run ledger.', statusBackendProxyReady:'Hosted backend proxy selected. Browser sends no provider key.', statusProviderValidationFailed:'Provider response rejected by contract validation.', statusProviderRepaired:'Provider response failed validation and was repaired through the controlled fallback.', responseValidationScore:'Response validation', statusLedgerExported:'Run ledger exported.', statusLedgerCleared:'Run ledger cleared.', previewProviderContract:'Preview contract', previewProviderPrompt:'Preview prompt', runProviderFixtureSuite:'Run fixture suite', exportProviderDiagnostics:'Export diagnostics', providerContractLabel:'Response contract', providerPromptLabel:'Prompt preview', providerDiagnosticsTitle:'Provider diagnostics', fixtureSuiteTitle:'Contract fixture suite', contractFixtureScore:'Contract fixtures', statusProviderContractPreviewed:'Provider response contract previewed.', statusProviderPromptPreviewed:'Provider prompt previewed.', statusProviderFixtureSuiteRun:'Provider fixture suite completed.', statusProviderDiagnosticsExported:'Provider diagnostics exported.', portableTitle:'Portable account mock', portableSubtitle:'Simulate OAuth/PKCE account linking without real tokens or vendor dependency.', connectPortable:'Connect mock portable account', refreshPortable:'Refresh mock token', disconnectPortable:'Disconnect portable account', exportPortableStatus:'Export portable status', portableScore:'Portable account', statusPortableConnected:'Mock portable account connected. No live OAuth or provider call was made.', statusPortableRefreshed:'Mock portable token refreshed. No raw token is stored or exported.', statusPortableDisconnected:'Portable account disconnected.', statusPortableExported:'Portable account status exported.', workflowTitle:'8. Mock AI Workflow', workflowSubtitle:'Legacy quick actions remain available, but provider harness is now the main AI integration path.', generateMock:'Generate mock analysis JSON', runMockRepair:'Run mock repair', runCritique:'Run mock critique', copyDeepPrompt:'Copy deep-research prompt',
      qualityTitle:'Quality Gate v3', planScore:'Plan', evidenceScore:'Evidence', causalScore:'Causal links', critiqueScore:'Critique', sourceScore:'Source discipline', diversityScore:'Source diversity', counterScore:'Counter-evidence', readiness:'Readiness',
      statusReady:'Research workflow ready for mock synthesis.', statusNeedPlan:'Generate a research plan first.', statusNeedEvidence:'Add evidence before synthesis.', statusGenerated:'Mock analysis JSON generated and placed in the import box.', statusRepaired:'Mock repair produced schema-compatible JSON.', statusCritiqued:'Mock critique generated.', statusImported:'Research packet imported.', statusExported:'Research packet exported.', statusEditing:'Evidence item loaded for editing.', statusLinkAdded:'Causal link added.', statusLinksInferred:'Causal links inferred from evidence.', statusInvalidPacket:'Invalid research packet.', statusInvalidLink:'Causal link requires From, To, and at least one evidence ID.', copied:'Copied.', copyFailed:'Copy failed. Use the visible text manually.',
      urlOptional:'https://example.com/source', claimPlaceholder:'Observable claim or research finding', sourcePlaceholder:'Publication, report, dataset, transcript, or note title', supportsPlaceholder:'I1,A1,T1', contradictsPlaceholder:'N1,R1', notesPlaceholder:'Why this evidence matters / uncertainty / limitations', sourcePlanningTitle:'6. Source Planning Layer', sourcePlanningSubtitle:'Plan future source-assisted research without live crawling or verification claims.', sourceConnector:'Connector', sourceTask:'Source task', sourceTaskPlan:'Source plan', sourceTaskQuery:'Query plan', sourceTaskClaim:'Claim extraction', sourceTaskScoring:'Evidence scoring', sourceTaskCluster:'Cluster plan', sourcePolicyNote:'Planning-only: no scraping, no live search, no source verification claims.', buildSourceTask:'Build source task', copySourceRequest:'Copy source request', runSourceFixtureSuite:'Run source fixture suite', exportSourcePolicy:'Export source policy', sourcePlanningScore:'Source planning', sourceFixtureScore:'Source fixtures', sourcePolicyScore:'Source policy', sourceDiagnosticsTitle:'Source diagnostics', sourceFixtureSuiteTitle:'Source fixture suite', statusSourceTaskBuilt:'Source task built. No live fetch was performed.', statusSourceRequestCopied:'Source request copied.', statusSourceFixtureSuiteRun:'Source fixture suite completed.', statusSourcePolicyExported:'Source policy exported.', sourceImportTitle:'7. Source Import Adapter', sourceImportSubtitle:'Paste deep-research / last30days-style outputs and convert them into Evidence Matrix candidates.', sourceImportFormat:'Import format', formatAuto:'Auto detect', sourceImportText:'Source output', sourceImportPlaceholder:'Paste external research output, source notes, links, or signal summaries here.', sourceImportPolicyNote:'Manual-only import: no fetch, no scraping, no verification claim.', previewSourceImport:'Preview import', importSourceEvidence:'Import as evidence', exportSourceImportReport:'Export import report', clearSourceImport:'Clear import', sourceImportScore:'Source import', sourceImportReportTitle:'Source import report', statusSourceImportPreviewed:'Source import preview generated.', statusSourceImported:'Source evidence imported into the matrix.', statusSourceImportCleared:'Source import cleared.', statusSourceImportReportExported:'Source import report exported.', statusSourceImportEmpty:'Paste source output before importing.'
    },
    ar: {
      researchTitle:'مختبر سير العمل البحثي',
      researchSubtitle:'طبقة تجريبية تربط البحث بالتحليل الاستراتيجي. النمط اليدوي يبقى كما هو؛ هذه الطبقة تضيف خطة، مصفوفة أدلة، روابط سببية، محاكاة AI، نقد، وبوابة جودة v2.',
      alphaBadge:'v0.29.0-rc.1 · تجميد مرشح الإصدار' ,
      planTitle:'1. خطة البحث',
      planSubtitle:'حوّل الموضوع إلى أسئلة بحث، مصادر مستهدفة، فاعلين، أدلة مضادة، ومؤشرات إنذار مبكر.',
      planMode:'نمط البحث',
      modeStructural:'هيكلي', modeRecent:'إشارات حديثة', modeSourceHeavy:'مرتكز على المصادر', modeAdversarial:'نقدي/خصومي',
      generatePlan:'توليد خطة البحث', copyPlanPrompt:'نسخ برومبت الخطة', clearPlan:'مسح الخطة', noPlan:'لا توجد خطة بحث بعد.',
      evidenceTitle:'2. مصفوفة الأدلة',
      evidenceSubtitle:'الدليل يصبح كائنًا مستقلًا قبل التحليل. كل ادعاء يمكن أن يدعم أو يناقض طبقات النموذج.',
      claim:'الادعاء', sourceTitle:'عنوان المصدر', sourceUrl:'رابط المصدر', sourceType:'نوع المصدر', sourceDate:'تاريخ المصدر', strength:'القوة', timeRelevance:'الملاءمة الزمنية', publicSignal:'الإشارة العامة', supports:'يدعم IDs', contradicts:'يناقض IDs', confidence:'الثقة', notes:'ملاحظات',
      addEvidence:'إضافة دليل', updateEvidence:'تحديث الدليل', cancelEdit:'إلغاء التعديل', loadDemoEvidence:'تحميل أدلة تجريبية', exportWorkflow:'تصدير حزمة البحث', exportPackV2:'تصدير حزمة v2', statusExportPackExported:'تم إنشاء حزمة التصدير v2.', importWorkflow:'استيراد حزمة بحث', clearEvidence:'مسح الأدلة', matrixEmpty:'مصفوفة الأدلة فارغة.', edit:'تعديل', remove:'حذف',
      causalTitle:'3. الروابط السببية', causalSubtitle:'اربط المصالح والفاعلين والأدوات والسرديات والنتائج والتغذية الراجعة والأدلة بادعاءات سببية صريحة.', linkFrom:'من', linkTo:'إلى', relationship:'العلاقة', evidenceIds:'IDs الأدلة', addCausalLink:'إضافة رابط سببي', inferCausalLinks:'استنتاج من الأدلة', clearCausalLinks:'مسح الروابط', causalEmpty:'لا توجد روابط سببية بعد.',
      compilerTitle:'4. مُصرّف التحليل', compilerSubtitle:'حوّل الأدلة والعناقيد المصدرية والفجوات والروابط السببية إلى موجز جاهز للتوليف.', compileBrief:'تجميع موجز التحليل', copySynthesisPrompt:'نسخ برومبت التوليف', exportAnalysisBrief:'تصدير الموجز', clearAnalysisBrief:'مسح الموجز', noAnalysisBrief:'لا يوجد موجز تحليل بعد.', clusterTitle:'عناقيد المصادر', gapsTitle:'فجوات التغطية', diagnosticsTitle:'تشخيص التحقق', compilerScore:'المُصرّف', statusCompiled:'تم تجميع موجز التحليل.', statusBriefExported:'تم تصدير موجز التحليل.', statusBriefCleared:'تم مسح موجز التحليل.',
      workflowTitle:'8. سير AI تجريبي', workflowSubtitle:'تجريد المزوّد يبدأ بمزوّد وهمي. ينتج JSON صالحًا دون الاتصال بأي API خارجي.', generateMock:'توليد JSON تحليلي تجريبي', runMockRepair:'تشغيل إصلاح تجريبي', runCritique:'تشغيل نقد تجريبي', copyDeepPrompt:'نسخ برومبت البحث العميق', providerEndpoint:'Endpoint', providerModel:'Model', providerApiKey:'API key', rememberProviderKey:'Remember locally on this device', enableLiveByok:'Enable live provider calls', providerSafety:'Safety: manual/private mode remains default. Keys are never exported.', validateProviderSettings:'Validate provider settings', dryRunProviderRequest:'Build dry-run request', byokScore:'BYOK safety', backendProxyScore:'Backend proxy', providerIdentityScore:'Provider identity', statusProviderDryRun:'Provider payload built without live network call.', statusProviderSettingsSaved:'Provider settings validated and saved.', statusProviderLiveDisabled:'Live provider calls disabled; dry-run/mock response recorded.', statusProviderLiveError:'Live provider call failed; no key was stored in the run ledger.', statusBackendProxyReady:'Hosted backend proxy selected. Browser sends no provider key.',
      qualityTitle:'بوابة الجودة v3', planScore:'الخطة', evidenceScore:'الأدلة', causalScore:'الروابط السببية', critiqueScore:'النقد', sourceScore:'انضباط المصادر', diversityScore:'تنوع المصادر', counterScore:'الأدلة المضادة', readiness:'الجاهزية',
      statusReady:'سير العمل البحثي جاهز للمحاكاة.', statusNeedPlan:'ولّد خطة بحث أولًا.', statusNeedEvidence:'أضف أدلة قبل التوليف.', statusGenerated:'تم توليد JSON تجريبي ووضعه في خانة الاستيراد.', statusRepaired:'الإصلاح التجريبي أنتج JSON متوافقًا.', statusCritiqued:'تم توليد نقد تجريبي.', statusImported:'تم استيراد حزمة البحث.', statusExported:'تم تصدير حزمة البحث.', statusEditing:'تم تحميل الدليل للتعديل.', statusLinkAdded:'تمت إضافة الرابط السببي.', statusLinksInferred:'تم استنتاج الروابط السببية من الأدلة.', statusInvalidPacket:'حزمة البحث غير صالحة.', statusInvalidLink:'الرابط السببي يحتاج من/إلى وعلى الأقل ID دليل واحد.', copied:'تم النسخ.', copyFailed:'تعذر النسخ. استخدم النص الظاهر يدويًا.',
      urlOptional:'https://example.com/source', claimPlaceholder:'ادعاء قابل للملاحظة أو نتيجة بحثية', sourcePlaceholder:'تقرير، دراسة، قاعدة بيانات، تفريغ، أو ملاحظة', supportsPlaceholder:'I1,A1,T1', contradictsPlaceholder:'N1,R1', notesPlaceholder:'لماذا هذا الدليل مهم / عدم اليقين / الحدود'
    },
    fr: {
      researchTitle:'Laboratoire de workflow de recherche',
      researchSubtitle:'Couche expérimentale reliant la recherche à l’analyse stratégique. Le mode manuel reste intact; cette couche ajoute plan, matrice de preuves, liens causaux, IA simulée, critique et barrière qualité v2.',
      alphaBadge:'v0.29.0-rc.1 · Gel release candidate',
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
      workflowTitle:'8. Workflow IA simulé', workflowSubtitle:'L’abstraction fournisseur commence par un fournisseur simulé. Il crée un JSON valide sans API externe.', generateMock:'Générer JSON simulé', runMockRepair:'Réparation simulée', runCritique:'Critique simulée', copyDeepPrompt:'Copier prompt deep-research', providerEndpoint:'Endpoint', providerModel:'Model', providerApiKey:'API key', rememberProviderKey:'Remember locally on this device', enableLiveByok:'Enable live provider calls', providerSafety:'Safety: manual/private mode remains default. Keys are never exported.', validateProviderSettings:'Validate provider settings', dryRunProviderRequest:'Build dry-run request', byokScore:'BYOK safety', backendProxyScore:'Backend proxy', providerIdentityScore:'Provider identity', statusProviderDryRun:'Provider payload built without live network call.', statusProviderSettingsSaved:'Provider settings validated and saved.', statusProviderLiveDisabled:'Live provider calls disabled; dry-run/mock response recorded.', statusProviderLiveError:'Live provider call failed; no key was stored in the run ledger.', statusBackendProxyReady:'Hosted backend proxy selected. Browser sends no provider key.',
      qualityTitle:'Barrière qualité v3', planScore:'Plan', evidenceScore:'Preuves', causalScore:'Liens causaux', critiqueScore:'Critique', sourceScore:'Discipline sources', diversityScore:'Diversité sources', counterScore:'Contre-preuves', readiness:'Préparation',
      statusReady:'Workflow prêt pour synthèse simulée.', statusNeedPlan:'Générez d’abord un plan.', statusNeedEvidence:'Ajoutez des preuves avant la synthèse.', statusGenerated:'JSON simulé généré et placé dans la zone d’import.', statusRepaired:'Réparation simulée compatible avec le schéma.', statusCritiqued:'Critique simulée générée.', statusImported:'Paquet de recherche importé.', statusExported:'Paquet de recherche exporté.', statusEditing:'Élément chargé pour édition.', statusLinkAdded:'Lien causal ajouté.', statusLinksInferred:'Liens causaux inférés.', statusInvalidPacket:'Paquet de recherche invalide.', statusInvalidLink:'Un lien causal exige De, Vers et au moins un ID preuve.', copied:'Copié.', copyFailed:'Copie impossible. Utilisez le texte visible manuellement.',
      urlOptional:'https://example.com/source', claimPlaceholder:'Énoncé observable ou résultat de recherche', sourcePlaceholder:'Publication, rapport, données, transcript ou note', supportsPlaceholder:'I1,A1,T1', contradictsPlaceholder:'N1,R1', notesPlaceholder:'Pourquoi cette preuve compte / incertitude / limites'
    }
  };

  Object.assign(COPY.en, {
    importSourceEvidence:'Send to review queue',
    evidenceReviewTitle:'8. Evidence Review Queue',
    evidenceReviewSubtitle:'Imported source candidates must be accepted, edited, or rejected before entering the Evidence Matrix.',
    evidenceReviewEmpty:'No pending imported evidence. Paste a source output and send candidates to review.',
    evidenceReviewScore:'Evidence review',
    reviewStatus:'Review status',
    pending:'pending',
    accepted:'accepted',
    rejected:'rejected',
    needsEdit:'needs edit',
    accept:'Accept',
    reject:'Reject',
    editCandidate:'Edit candidate',
    acceptAllReviewEvidence:'Accept all pending',
    acceptEditedReviewEvidence:'Accept edited candidate',
    exportEvidenceReviewQueue:'Export review queue',
    clearResolvedReviewEvidence:'Clear resolved',
    statusSourceImported:'Imported candidates sent to the evidence review queue.',
    statusEvidenceAccepted:'Evidence candidate accepted into the matrix.',
    statusEvidenceRejected:'Evidence candidate rejected.',
    statusReviewEditing:'Evidence candidate loaded into the form for review editing.',
    statusReviewQueueExported:'Evidence review queue exported.',
    statusReviewQueueCleared:'Resolved evidence review items cleared.',
    statusNoReviewSelection:'Load a review candidate before accepting edited evidence.'
  });
  Object.assign(COPY.ar, {
    importSourceEvidence:'إرسال إلى صف المراجعة',
    evidenceReviewTitle:'8. صف مراجعة الأدلة',
    evidenceReviewSubtitle:'الأدلة المستوردة لا تدخل المصفوفة قبل قبولها أو تعديلها أو رفضها.',
    evidenceReviewEmpty:'لا توجد أدلة مستوردة بانتظار المراجعة.',
    evidenceReviewScore:'مراجعة الأدلة',
    reviewStatus:'حالة المراجعة',
    pending:'قيد المراجعة',
    accepted:'مقبول',
    rejected:'مرفوض',
    needsEdit:'يحتاج تعديل',
    accept:'قبول',
    reject:'رفض',
    editCandidate:'تعديل المرشح',
    acceptAllReviewEvidence:'قبول كل المعلّق',
    acceptEditedReviewEvidence:'قبول المرشح المعدّل',
    exportEvidenceReviewQueue:'تصدير صف المراجعة',
    clearResolvedReviewEvidence:'مسح المحسوم',
    statusSourceImported:'تم إرسال المرشحات إلى صف مراجعة الأدلة.',
    statusEvidenceAccepted:'تم قبول الدليل في المصفوفة.',
    statusEvidenceRejected:'تم رفض المرشح.',
    statusReviewEditing:'تم تحميل المرشح في النموذج للتعديل.',
    statusReviewQueueExported:'تم تصدير صف المراجعة.',
    statusReviewQueueCleared:'تم مسح عناصر المراجعة المحسومة.',
    statusNoReviewSelection:'حمّل مرشح مراجعة قبل قبول النسخة المعدلة.'
  });
  Object.assign(COPY.fr, {
    importSourceEvidence:'Envoyer en revue',
    evidenceReviewTitle:'8. File de revue des preuves',
    evidenceReviewSubtitle:'Les candidats importés doivent être acceptés, modifiés ou rejetés avant d’entrer dans la matrice.',
    evidenceReviewEmpty:'Aucune preuve importée en attente de revue.',
    evidenceReviewScore:'Revue des preuves',
    reviewStatus:'Statut de revue',
    pending:'en attente',
    accepted:'accepté',
    rejected:'rejeté',
    needsEdit:'à modifier',
    accept:'Accepter',
    reject:'Rejeter',
    editCandidate:'Modifier le candidat',
    acceptAllReviewEvidence:'Accepter tous les éléments en attente',
    acceptEditedReviewEvidence:'Accepter le candidat modifié',
    exportEvidenceReviewQueue:'Exporter la file de revue',
    clearResolvedReviewEvidence:'Effacer les éléments résolus',
    statusSourceImported:'Candidats envoyés dans la file de revue des preuves.',
    statusEvidenceAccepted:'Candidat accepté dans la matrice.',
    statusEvidenceRejected:'Candidat rejeté.',
    statusReviewEditing:'Candidat chargé dans le formulaire pour modification.',
    statusReviewQueueExported:'File de revue exportée.',
    statusReviewQueueCleared:'Éléments résolus effacés.',
    statusNoReviewSelection:'Chargez un candidat avant d’accepter la version modifiée.'
  });


  Object.assign(COPY.en, {
    qualityV3Score:'Quality v3',
    completenessScore:'Completeness',
    evidenceStrengthScore:'Evidence strength',
    contradictionCoverageScore:'Contradiction coverage',
    sourceDiversityScore:'Source diversity',
    actorLayerCoverageScore:'Actor/layer coverage',
    causalLinkDensityScore:'Causal-link density',
    providerSafetyScore:'Provider safety',
    privacySafetyScore:'Privacy safety',
    migrationSafetyScore:'Migration safety',
    publicationReadiness:'Publication readiness',
    weakestDimensions:'Weakest dimensions',
    fixActions:'Fix actions',
    templateTitle:'1. Analysis Template',
    templateSubtitle:'Choose the analytical lens. Templates change prompts and diagnostics, not the shared evidence discipline.',
    analysisTemplate:'Analysis template',
    applyTemplate:'Apply template to plan',
    exportTemplateProfile:'Export template profile',
    templateScore:'Template fit',
    templateOutputFocus:'Output focus',
    templateRequiredLayers:'Required layers',
    templatePromptDirectives:'Prompt directives',
    statusTemplateApplied:'Analysis template applied to the research plan.',
    statusTemplateExported:'Analysis template profile exported.'
  });
  Object.assign(COPY.ar, {
    qualityV3Score:'الجودة v3',
    completenessScore:'الاكتمال',
    evidenceStrengthScore:'قوة الأدلة',
    contradictionCoverageScore:'تغطية التناقضات',
    sourceDiversityScore:'تنوع المصادر',
    actorLayerCoverageScore:'تغطية الفاعلين/الطبقات',
    causalLinkDensityScore:'كثافة الروابط السببية',
    providerSafetyScore:'أمان المزوّد',
    privacySafetyScore:'أمان الخصوصية',
    migrationSafetyScore:'أمان الترحيل',
    publicationReadiness:'جاهزية النشر',
    weakestDimensions:'أضعف الأبعاد',
    fixActions:'خطوات التصحيح',
    templateTitle:'1. قالب التحليل',
    templateSubtitle:'اختر عدسة التحليل. القوالب تغيّر البرومبتات والتشخيصات فقط، ولا تتجاوز انضباط الأدلة.',
    analysisTemplate:'قالب التحليل',
    applyTemplate:'تطبيق القالب على الخطة',
    exportTemplateProfile:'تصدير ملف القالب',
    templateScore:'ملاءمة القالب',
    templateOutputFocus:'محور الإخراج',
    templateRequiredLayers:'الطبقات المطلوبة',
    templatePromptDirectives:'توجيهات البرومبت',
    statusTemplateApplied:'تم تطبيق قالب التحليل على خطة البحث.',
    statusTemplateExported:'تم تصدير ملف قالب التحليل.'
  });
  Object.assign(COPY.fr, {
    qualityV3Score:'Qualité v3',
    completenessScore:'Complétude',
    evidenceStrengthScore:'Force des preuves',
    contradictionCoverageScore:'Couverture contradictions',
    sourceDiversityScore:'Diversité sources',
    actorLayerCoverageScore:'Couverture acteurs/couches',
    causalLinkDensityScore:'Densité causale',
    providerSafetyScore:'Sécurité fournisseur',
    privacySafetyScore:'Sécurité confidentialité',
    migrationSafetyScore:'Sécurité migration',
    publicationReadiness:'Préparation publication',
    weakestDimensions:'Dimensions faibles',
    fixActions:'Actions correctives',
    templateTitle:'1. Modèle d’analyse',
    templateSubtitle:'Choisissez la lentille analytique. Les modèles changent les prompts et diagnostics, pas la discipline des preuves.',
    analysisTemplate:'Modèle d’analyse',
    applyTemplate:'Appliquer au plan',
    exportTemplateProfile:'Exporter le profil du modèle',
    templateScore:'Adéquation modèle',
    templateOutputFocus:'Focus de sortie',
    templateRequiredLayers:'Couches requises',
    templatePromptDirectives:'Directives prompt',
    statusTemplateApplied:'Modèle d’analyse appliqué au plan de recherche.',
    statusTemplateExported:'Profil du modèle exporté.'
  });


  const SUPPORTED_LANGS = ['ar','en','fr'];
  function esc(value){ return String(value ?? '').replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char])); }
  function getLang(){
    const lang = (global.document?.documentElement?.lang || global.localStorage?.getItem('jarbou3i.lang') || 'ar').slice(0,2).toLowerCase();
    return SUPPORTED_LANGS.includes(lang) ? lang : 'en';
  }
  function tr(key){ return (COPY[getLang()] && COPY[getLang()][key]) || COPY.en[key] || key; }
  function applyLabels(documentRef, updateEvidenceButtonLabel){
    documentRef.querySelectorAll('[data-r-i18n]').forEach(el => { el.textContent = tr(el.getAttribute('data-r-i18n')); });
    documentRef.querySelectorAll('[data-r-placeholder]').forEach(el => { el.setAttribute('placeholder', tr(el.getAttribute('data-r-placeholder'))); });
    if(typeof updateEvidenceButtonLabel === 'function') updateEvidenceButtonLabel();
  }
  root.renderHelpers = {COPY, SUPPORTED_LANGS, esc, getLang, tr, applyLabels};
})(window);
