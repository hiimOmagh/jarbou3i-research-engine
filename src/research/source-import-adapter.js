/* Jarbou3i Research Engine source import adapter v0.14.0-beta. */
(function(global){
  'use strict';
  const root = global.Jarbou3iResearchModules = global.Jarbou3iResearchModules || {};
  const VERSION = '0.14.0-beta';
  const URL_RE = /https?:\/\/[^\s)\]>"']+/gi;
  const DATE_RE = /\b(20\d{2}[-/.](0?[1-9]|1[0-2])[-/.](0?[1-9]|[12]\d|3[01])|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+20\d{2}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+20\d{2})\b/i;
  const BULLET_RE = /^\s*(?:[-*•]|\d+[.)]|\[[x ]\])\s+/;

  function normalizeText(text){return String(text || '').replace(/\r\n/g,'\n').replace(/\t/g,'  ').trim();}
  function unique(values){return [...new Set((values || []).filter(Boolean))];}
  function stableHash(text){const s=String(text||''); let h=0; for(let i=0;i<s.length;i++) h=Math.imul(31,h)+s.charCodeAt(i)|0; return Math.abs(h).toString(36).padStart(6,'0');}
  function inferFormat(text, requested='auto'){
    if(requested && requested !== 'auto') return requested;
    const lower=String(text||'').toLowerCase();
    if(lower.includes('last 30 days') || lower.includes('last30days') || lower.includes('engagement') || lower.includes('recency')) return 'last30days';
    if(lower.includes('deep research') || lower.includes('research plan') || lower.includes('sources') || lower.includes('findings')) return 'deep_research';
    return 'generic_research_report';
  }
  function inferSourceType(text, url){
    const blob=`${text||''} ${url||''}`.toLowerCase();
    if(/\.gov|government|ministry|commission|official|ec\.europa|europa\.eu|un\.org|worldbank|imf\.org/.test(blob)) return 'official';
    if(/doi\.org|journal|university|academic|paper|arxiv|ssrn|jstor|springer|nature|science/.test(blob)) return 'academic';
    if(/github\.com|release|commit|repository|repo\b/.test(blob)) return 'primary';
    if(/youtube|reddit|x\.com|twitter|tiktok|instagram|hacker news|news\.ycombinator|hn\.algolia/.test(blob)) return 'social';
    if(/polymarket|market|prediction|price|odds|betting/.test(blob)) return 'market';
    if(/reuters|apnews|bbc|guardian|ft\.com|nytimes|washingtonpost|politico|euronews|dw\.com|aljazeera|cnn|bloomberg/.test(blob)) return 'news';
    if(/expert|interview|testimony|analyst|commentary/.test(blob)) return 'expert';
    return 'other';
  }
  function normalizeDate(raw){
    if(!raw) return 'unknown';
    const s=String(raw).replace(/[/.]/g,'-').trim();
    const iso=s.match(/20\d{2}-\d{1,2}-\d{1,2}/);
    if(iso){const [y,m,d]=iso[0].split('-'); return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;}
    return s;
  }
  function stripMarkup(line){return String(line||'').replace(BULLET_RE,'').replace(/[#*_`>]+/g,'').replace(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g,'$1 $2').replace(/\s+/g,' ').trim();}
  function claimFromLine(line){const cleaned=stripMarkup(line).replace(URL_RE,'').replace(/\b(source|url|link|date|published|retrieved)\s*[:=]\s*/gi,'').trim(); return cleaned.length>260?`${cleaned.slice(0,257)}…`:cleaned;}
  function sourceTitleFromLine(line, url, idx){
    const md=String(line||'').match(/\[([^\]]{3,120})\]\(https?:\/\/[^\s)]+\)/); if(md) return md[1].trim();
    const after=String(line||'').match(/(?:source|title|publication)\s*[:=]\s*([^\n|;]{3,120})/i); if(after) return stripMarkup(after[1]);
    if(url){try{return new URL(url).hostname.replace(/^www\./,'');}catch(_){}}
    const cleaned=claimFromLine(line); return cleaned?cleaned.slice(0,90):`Imported source ${idx}`;
  }
  function extractCandidateLines(text){
    const lines=normalizeText(text).split('\n').map(x=>x.trim()).filter(Boolean);
    const candidates=[];
    for(const line of lines){
      const hasUrl=(line.match(URL_RE)||[]).length>0;
      const looksBullet=BULLET_RE.test(line);
      const hasClaimMarker=/\b(claim|finding|evidence|source|signal|observation|result|because|shows|indicates|reported|according)\b/i.test(line);
      if(hasUrl || looksBullet || hasClaimMarker){const cleaned=stripMarkup(line); if(cleaned.length>18) candidates.push(cleaned);}
    }
    if(!candidates.length && text.trim()) return text.split(/(?<=[.!?])\s+/).map(x=>x.trim()).filter(x=>x.length>35).slice(0,8);
    return candidates.slice(0,40);
  }
  function scoreLine(line, format){
    const hasUrl=(line.match(URL_RE)||[]).length>0;
    const hasDate=DATE_RE.test(line);
    const strongType=['official','academic','primary','news'].includes(inferSourceType(line,(line.match(URL_RE)||[])[0]||''));
    const publicSignal=/engagement|views|upvotes|likes|shares|comments|trend|viral|polymarket|odds|reddit|youtube|x\.com|twitter|tiktok/i.test(line)?4:1;
    return {
      evidence_strength:Math.max(1,Math.min(5,2+(hasUrl?1:0)+(hasDate?1:0)+(strongType?1:0))),
      public_signal_score:Math.max(1,Math.min(5,publicSignal)),
      time_relevance_score:format==='last30days'?5:(hasDate?4:3)
    };
  }
  function parseSourceImportText(text, options={}){
    const raw=normalizeText(text);
    const format=inferFormat(raw, options.format || 'auto');
    const lines=extractCandidateLines(raw);
    const warnings=[];
    if(!raw) warnings.push('empty import text');
    if(!lines.length) warnings.push('no importable claim lines detected');
    const evidence=[]; const rejected=[];
    lines.forEach((line,idx)=>{
      const urls=unique(line.match(URL_RE)||[]);
      const primaryUrl=urls[0]||'';
      const claim=claimFromLine(line);
      if(!claim || claim.length<12){rejected.push({line_index:idx+1, reason:'claim_too_short', preview:line.slice(0,120)}); return;}
      const dateMatch=line.match(DATE_RE);
      const scores=scoreLine(line, format);
      const sourceType=inferSourceType(line, primaryUrl);
      evidence.push({
        evidence_id:`IMP${evidence.length+1}`,
        claim,
        source_title:sourceTitleFromLine(line, primaryUrl, evidence.length+1),
        source_url:primaryUrl,
        source_type:sourceType,
        source_date:normalizeDate(dateMatch ? dateMatch[0] : ''),
        time_relevance_score:scores.time_relevance_score,
        evidence_strength:scores.evidence_strength,
        public_signal_score:scores.public_signal_score,
        supports:[],
        contradicts:[],
        confidence:primaryUrl?'medium':'low',
        notes:`Imported from ${format}; review claim, source metadata, and link IDs before synthesis.`,
        import_meta:{format, source_urls:urls, raw_hash:stableHash(line), verification_status:'unverified_manual_import'}
      });
    });
    const sourceTypes=unique(evidence.map(e=>e.source_type));
    const report={
      import_version:VERSION,
      imported_at:new Date().toISOString(),
      input_format:format,
      live_fetching_performed:false,
      verification_claimed:false,
      raw_fingerprint:stableHash(raw),
      detected_line_count:lines.length,
      converted_count:evidence.length,
      rejected_count:rejected.length,
      source_type_count:sourceTypes.length,
      url_count:evidence.filter(e=>e.source_url).length,
      date_count:evidence.filter(e=>e.source_date && e.source_date!=='unknown').length,
      source_types:sourceTypes,
      warnings,
      rejected
    };
    return {ok:evidence.length>0, evidence, report, warnings};
  }
  function previewSourceImport(text, options={}){
    const parsed=parseSourceImportText(text, options);
    return {preview_version:VERSION, ok:parsed.ok, report:parsed.report, sample_evidence:parsed.evidence.slice(0,5), warnings:parsed.warnings};
  }
  root.sourceImportAdapter={VERSION,inferFormat,inferSourceType,parseSourceImportText,previewSourceImport};
})(window);
