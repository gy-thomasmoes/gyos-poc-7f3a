/* gy-brand.js (9 Oct 2026): the Word document and Slides design systems, shared.
   The Brand agent (agent-brand.html) edits these tokens; every Deliverable page that
   renders a paged document (.cspg) or a deck (.cspg.nsl) loads this file and restyles
   itself from them, live, including in tabs that are already open (storage event).
   Tokens live in localStorage, so a change reaches pages in the same browser only. */
(function(){
  var KEY = 'gyBrandTokens.v1';
  var DEF = {
    doc: {
      headFont:'Manner', headWeight:500, headColour:'#1A0C12', subColour:'#1C1A17',
      bodyColour:'#1C1A17', bodySize:12.5, tableHead:'#F4F1EA',
      cover:'centre', logo:'on', pageNumbers:'on'
    },
    slides: {
      headFont:'Manner', headWeight:500, headColour:'#1A0C12', bodySize:10.5,
      bar:'chapter', keyBg:'#628147', keyText:'#FEFAEC', highlight:'#F9DD5A',
      coverWash:'#FEFAEC', logo:'on', pageNumbers:'on'
    }
  };
  var FONTS = {
    'Manner':"'Manner','Spectral',Georgia,serif",
    'Spectral':"'Spectral',Georgia,serif",
    'IBM Plex Mono':"'IBM Plex Mono',ui-monospace,Menlo,monospace",
    'IBM Plex Sans':"'IBM Plex Sans',-apple-system,system-ui,sans-serif",
    'Sans':"-apple-system,system-ui,Inter,'Segoe UI',sans-serif"
  };
  function clone(o){ return JSON.parse(JSON.stringify(o)); }
  function get(){
    var t = clone(DEF);
    try{ var s = JSON.parse(localStorage.getItem(KEY) || 'null');
      if(s){ ['doc','slides'].forEach(function(k){ if(s[k]) for(var x in s[k]) if(x in t[k]) t[k][x] = s[k][x]; }); }
    }catch(e){}
    return t;
  }
  function set(scope, patch){
    var t = get(); for(var x in patch) t[scope][x] = patch[x];
    try{ localStorage.setItem(KEY, JSON.stringify(t)); }catch(e){}
    apply(); return t;
  }
  function reset(scope){
    var t = get(); t[scope] = clone(DEF[scope]);
    try{ localStorage.setItem(KEY, JSON.stringify(t)); }catch(e){}
    apply(); return t;
  }
  var CSS = ''
   /* Word documents: every paged report, never the slides */
   + '.cspg:not(.nsl){color:var(--gyd-body) !important;font-size:var(--gyd-size) !important}'
   + '.cspg:not(.nsl) .csb h1,.cspg.cover:not(.nsl) .ttl,.cspg.cover:not(.nsl) .sub,.cspg:not(.nsl) .cstoc .tt{font-family:var(--gyd-hf) !important;color:var(--gyd-hc) !important}'
   + '.cspg:not(.nsl) .csb h1,.cspg.cover:not(.nsl) .ttl,.cspg:not(.nsl) .cstoc .tt{font-weight:var(--gyd-hw) !important}'
   + '.cspg:not(.nsl) .csb h2,.cspg:not(.nsl) .csb h3{color:var(--gyd-sub) !important}'
   + '.cspg:not(.nsl) .csb th{background:var(--gyd-th) !important}'
   + 'html[data-gyd-cover="left"] .cspg.cover:not(.nsl){align-items:flex-start !important;text-align:left !important}'
   + 'html[data-gyd-logo="off"] .cspg:not(.nsl) .cslogo{display:none !important}'
   + 'html[data-gyd-pno="off"] .cspg:not(.nsl) .cspno{display:none !important}'
   /* Slides */
   + '.cspg.nsl{font-size:var(--gys-size) !important}'
   + '.nsl:not(.key) .nslt,.nsl.cover .nct,.nsl.cover .ncs,.nsl:not(.key) .nlead,.nsl:not(.key) .nstat b,.nsl:not(.key) .nquote{font-family:var(--gys-hf) !important;color:var(--gys-hc) !important}'
   + '.nsl .nslt,.nsl.cover .nct,.nsl.key .nkm{font-weight:var(--gys-hw) !important}'
   + '.nsl.key .nslt,.nsl.key .nkm{font-family:var(--gys-hf) !important}'
   + 'html[data-gys-bar="fixed"] .cspg.nsl:not(.cover):not(.key){border-top-color:var(--gys-bar) !important}'
   + '.cspg.nsl.key{background:var(--gys-keybg) !important;color:var(--gys-keytx) !important}'
   + '.nsl.key .nchap,.nsl.key .nslt,.nsl.key .nslno,.nsl.key .nkm,.nsl.key .nkr span,.nsl.key .nkr b,.nsl.key .csb.sk .skl{color:var(--gys-keytx) !important}'
   + '.nsl.key .nkr span{border-top-color:color-mix(in srgb,var(--gys-keytx) 50%,transparent) !important}'
   + '.nsl.key .nkm em{border-bottom-color:var(--gys-hl) !important}.nsl.key .nchap i{background:var(--gys-hl) !important}'
   + '.cspg.nsl.cover{background:linear-gradient(90deg,color-mix(in srgb,var(--gys-wash) 96%,transparent) 0%,color-mix(in srgb,var(--gys-wash) 86%,transparent) 42%,color-mix(in srgb,var(--gys-wash) 18%,transparent) 78%),url(\'gy-bg-projects.jpg\') center/cover !important}'
   + 'html[data-gys-logo="off"] .nsl .nslogo{display:none !important}'
   + 'html[data-gys-pno="off"] .nsl .nslno{display:none !important}';
  function apply(){
    var t = get(), r = document.documentElement, d = t.doc, s = t.slides;
    var v = {
      '--gyd-hf':FONTS[d.headFont] || FONTS.Manner, '--gyd-hw':String(d.headWeight), '--gyd-hc':d.headColour, '--gyd-sub':d.subColour,
      '--gyd-body':d.bodyColour, '--gyd-size':d.bodySize+'px', '--gyd-th':d.tableHead,
      '--gys-hf':FONTS[s.headFont] || FONTS.Manner, '--gys-hw':String(s.headWeight), '--gys-hc':s.headColour, '--gys-size':s.bodySize+'px',
      '--gys-bar':s.bar === 'chapter' ? 'transparent' : s.bar, '--gys-keybg':s.keyBg, '--gys-keytx':s.keyText, '--gys-hl':s.highlight, '--gys-wash':s.coverWash
    };
    for(var k in v) r.style.setProperty(k, v[k]);
    r.setAttribute('data-gyd-cover', d.cover); r.setAttribute('data-gyd-logo', d.logo); r.setAttribute('data-gyd-pno', d.pageNumbers);
    r.setAttribute('data-gys-bar', s.bar === 'chapter' ? 'chapter' : 'fixed'); r.setAttribute('data-gys-logo', s.logo); r.setAttribute('data-gys-pno', s.pageNumbers);
    if(!document.getElementById('gy-brand-css')){
      var st = document.createElement('style'); st.id = 'gy-brand-css'; st.textContent = CSS;
      (document.head || document.documentElement).appendChild(st);
    }
  }
  /* WCAG contrast, used by the Brand agent to refuse text that blends into its background */
  function lum(h){ h = h.replace('#',''); var c = [0,2,4].map(function(i){ var x = parseInt(h.substr(i,2),16)/255; return x <= .03928 ? x/12.92 : Math.pow((x+.055)/1.055, 2.4); }); return .2126*c[0] + .7152*c[1] + .0722*c[2]; }
  function contrast(a, b){ var x = lum(a), y = lum(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); }
  window.GY_BRAND = {KEY:KEY, DEF:DEF, FONTS:FONTS, get:get, set:set, reset:reset, apply:apply, contrast:contrast};
  apply();
  window.addEventListener('storage', function(e){ if(e.key === KEY) apply(); });
})();
