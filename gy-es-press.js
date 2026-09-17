/* gy-es-press.js, an experiment. The rule book data from gy-rulebooks.js set as
   a press catalogue: one full bleed panel per ecosystem service, scroll snapped,
   each with a flat cover drawn in SVG. Serif throughout, two colours per book,
   no uppercase labels, no gradients. Reads window.GY_RULEBOOKS. */
(function(){

var CSS = `
.pr{--cream:#F4EFE6;--kraft:#D8C7AC;--cink:#2A2118;--paper:#FBF8F2;
  --ink:#1D1710;--ink2:#6A6158;--rule:#DED6C6}
.pr *{box-sizing:border-box}
.pr{font-family:var(--serif)}
body.presssnap .mainc{scroll-snap-type:y mandatory}

/* ── the full bleed panel ── */
.pr .panel{width:100%;min-height:calc(100vh - 61px);background:var(--field,var(--pc));
  color:var(--cream);display:flex;align-items:center;
  scroll-snap-align:start;scroll-snap-stop:always;scroll-margin-top:61px;padding:56px 0}
.pr .panelin{max-width:1180px;margin:0 auto;padding:0 56px;width:100%}
@media(max-width:860px){.pr .panelin{padding:0 24px}}
.pr .pgrid{display:grid;grid-template-columns:392px 1fr;gap:88px;align-items:center}
@media(max-width:1040px){.pr .pgrid{grid-template-columns:300px 1fr;gap:52px}}
@media(max-width:820px){.pr .pgrid{grid-template-columns:1fr;gap:38px}}

/* ── the cover ── */
.pr .escover{width:100%;display:block;filter:drop-shadow(0 20px 34px rgba(0,0,0,.28))}
.pr .escoverlink{display:block;cursor:pointer}

/* ── panel typography, five sizes and no more ── */
.pr .ptitle{font-size:clamp(33px,3.5vw,49px);font-weight:600;line-height:1.08;letter-spacing:-.02em}
.pr .pauthor{font-size:clamp(19px,1.6vw,23px);font-style:italic;line-height:1.3;
  margin-top:14px;opacity:.86}
.pr .phr{width:92px;height:1px;background:currentColor;opacity:.42;margin:30px 0}
.pr .pbody{font-size:19px;line-height:1.52;max-width:33em}
.pr .pbody + .pbody{margin-top:17px}

/* ── buttons as stylised blocks ── */
.pr .btn{font:inherit;font-size:17px;padding:14px 26px;cursor:pointer;color:inherit;
  background:transparent;border:1px solid currentColor;border-radius:0;margin-left:-1px;
  display:inline-flex;align-items:center;gap:14px;transition:background .15s,color .15s;
  -webkit-appearance:none;appearance:none}
.pr .btn:first-child{margin-left:0}
.pr .btn:hover{background:var(--cream);color:var(--field);position:relative;z-index:1}
.pr .btns{display:flex;flex-wrap:wrap;margin:32px 0 0}
.pr .btnwide{display:flex;margin-top:14px;max-width:560px}
.pr .btnwide .btn{flex:1;justify-content:space-between;font-size:17px;padding:15px 24px}
.pr .btnwide .btn .arw{opacity:.62;font-size:15px}

/* ── shelf chrome ── */
.pr .pmast{padding:16px 0 4px}
.pr .pmast .pm1{font-size:clamp(34px,4.4vw,60px);font-weight:600;letter-spacing:-.025em;line-height:1}
.pr .pmast .pm2{font-size:22px;font-style:italic;opacity:.78;margin-top:16px;max-width:30em;line-height:1.4}
.pr .pmast .pm3{font-size:16px;opacity:.5;margin-top:26px}
.pr .pcount{font-size:15px;opacity:.55;margin-top:34px}

/* ── the reading page below a hero ── */
.pr .doc{background:var(--paper);color:var(--ink);padding:88px 0 110px}
.pr .docin{max-width:1180px;margin:0 auto;padding:0 56px}
@media(max-width:860px){.pr .docin{padding:0 24px}}
.pr .col{max-width:34em}
.pr .dh{font-size:clamp(27px,2.8vw,37px);font-weight:600;letter-spacing:-.022em;line-height:1.1}
.pr .dsub{font-size:20px;font-style:italic;color:var(--ink2);margin-top:12px}
.pr .dp{font-size:19px;line-height:1.56;margin-top:17px}
.pr .sep{height:1px;background:var(--rule);margin:74px 0;max-width:38em}
.pr .lbl{font-size:19px;font-style:italic;color:var(--ink2);margin-top:30px}
.pr .lbl + .dp{margin-top:5px}
.pr .chapno{font-size:19px;font-style:italic;color:var(--ink2);margin-bottom:10px}

.pr .qs{columns:2;column-gap:64px;margin-top:8px}
@media(max-width:900px){.pr .qs{columns:1}}
.pr .q{break-inside:avoid;margin-bottom:38px;font-size:20px;line-height:1.46}
.pr .q cite{display:block;font-size:17px;font-style:italic;color:var(--ink2);margin-top:12px}

.pr .lst{max-width:34em}
.pr .lst li{list-style:none;font-size:19px;line-height:1.55;margin-top:20px;
  padding-left:26px;text-indent:-26px}
.pr .lst li::before{content:"\\2014\\00a0\\00a0";color:var(--ink2)}

.pr .tb{width:100%;max-width:38em;border-collapse:collapse;margin-top:10px}
.pr .tb td{padding:15px 0;border-bottom:1px solid var(--rule);font-size:18px;
  line-height:1.45;vertical-align:baseline}
.pr .tb td:first-child{width:12em;font-style:italic;color:var(--ink2)}
.pr .tb td.r{text-align:right;width:8em;font-style:italic;color:var(--ink2)}

.pr .foot{background:var(--field,var(--pc));color:var(--cream);padding:74px 0 84px}
.pr .footin{max-width:1180px;margin:0 auto;padding:0 56px}
.pr .strip{display:grid;grid-template-columns:repeat(7,1fr);gap:26px;margin-top:34px}
@media(max-width:900px){.pr .strip{grid-template-columns:repeat(3,1fr);gap:20px}}
.pr .strip .escover{filter:drop-shadow(0 12px 20px rgba(0,0,0,.3))}
.pr .strip .sn{font-size:16px;margin-top:13px;line-height:1.25;opacity:.9}
`;

var RLAB = {g:'Active', o:'Emerging', r:'Nascent'};
var CHAPTERS = [
  ['Supply', 'What it is, what generates it, how much there is'],
  ['Bridge', 'What makes it real and sellable'],
  ['Demand', 'Who buys it, how we sell it, what it costs'],
  ['Market', 'Readiness, dynamics, signals and risks']
];
/* only these inventory pages exist in the POC, so only these get the button */
var HASINV = {bng:1, wcc:1};

function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }
function pad(n){ return (n<10?'0':'')+n; }
function extent(d){ var n=0; JSON.stringify(d).replace(/[A-Za-z][A-Za-z'-]+/g,function(){n++;return '';}); return n; }

/* covers come from gy-es-covers.js, shared with the Hive Mind Library */

function injectCSS(){
  if(document.getElementById('gypressCSS')) return;
  var st = document.createElement('style');
  st.id = 'gypressCSS'; st.textContent = CSS;
  document.head.appendChild(st);
}

/* ─────────────── the shelf, one panel per book ─────────────── */
window.gyPressShelf = function(mountId){
  injectCSS();
  if(document.body) document.body.classList.add('presssnap');
  var B = window.GY_RULEBOOKS || [];
  var first = B[0] || {id:'carbon', name:'Carbon', type:'', col:'#C67F16'};

  var h = '<div class="pr">';

  h += '<section class="panel" style="--field:#1B1610;background:#1B1610">'
    + '<div class="panelin">'
    + '<div><div class="pmast">'
      + '<div class="pm1">Great Yellow Press</div>'
      + '<div class="pm2">Eight rule books on the markets for nature, one for each thing we can sell off a hectare.</div>'
      + '<div class="pm3">First edition, October 2025</div>'
      + '</div>'
      + '<div class="btns"><button class="btn" onclick="gyPressNext()">Start reading</button>'
      + '<button class="btn" onclick="location.href=\'hive-mind-library.html\'">Library</button></div>'
      + '<div class="pcount">Scroll to move through the list.</div>'
    + '</div></div></section>';

  h += B.map(function(d,i){
    return '<section class="panel" style="--pc:'+d.col+';--field:'+window.gyEsFieldCol(d.col)+'"><div class="panelin"><div class="pgrid">'
      + '<div>'+window.gyEsCover(d, i, 'es-press.html?es='+d.id)+'</div>'
      + '<div>'
        + '<div class="ptitle">'+d.name+'</div>'
        + '<div class="pauthor">'+d.type+'</div>'
        + '<div class="phr"></div>'
        + '<div class="pbody">'+d.identity.what+'</div>'
        + '<div class="btns">'
          + '<button class="btn" onclick="location.href=\'es-press.html?es='+d.id+'\'">Read the rule book</button>'
          + '<button class="btn" onclick="location.href=\'es-rulebook.html?es='+d.id+'\'">Reading room</button>'
        + '</div>'
        + '<div class="btnwide"><button class="btn" onclick="location.href=\'es-press.html?es='+d.id+'\'">'
          + '<span>'+d.vol+', '+d.volsub+'</span><span class="arw">&#8599;</span></button></div>'
      + '</div></div></div></section>';
  }).join('');

  h += '</div>';
  document.getElementById(mountId).outerHTML = h;
};

/* scroll to the next panel, used by the masthead button */
window.gyPressNext = function(){
  var sc = document.querySelector('.mainc') || document.scrollingElement;
  var ps = document.querySelectorAll('.panel');
  for(var i=0;i<ps.length;i++){
    if(ps[i].offsetTop > sc.scrollTop + 12){ sc.scrollTo({top:ps[i].offsetTop, behavior:'smooth'}); return; }
  }
};

/* ─────────────── one book ─────────────── */
window.gyPressBook = function(id, mountId){
  injectCSS();
  var B = window.GY_RULEBOOKS || [];
  var idx = -1;
  B.forEach(function(x,i){ if(x.id===id) idx = i; });
  if(idx < 0){ document.getElementById(mountId).outerHTML =
    '<div class="pr"><div class="doc"><div class="docin">Out of print.</div></div></div>'; return; }
  var D = B[idx];

  function f(label, body){ return '<div class="lbl">'+label+'</div><div class="dp">'+body+'</div>'; }
  function head(t, s){ return '<div class="dh">'+t+'</div>'+(s?'<div class="dsub">'+s+'</div>':''); }

  var h = '<div class="pr" style="--pc:'+D.col+';--field:'+window.gyEsFieldCol(D.col)+'">';

  /* the hero panel, same shape as a shelf panel */
  h += '<section class="panel"><div class="panelin"><div class="pgrid">'
    + '<div>'+window.gyEsCover(D, idx)+'</div>'
    + '<div>'
      + '<div class="ptitle">'+D.name+'</div>'
      + '<div class="pauthor">'+D.type+'</div>'
      + '<div class="phr"></div>'
      + '<div class="pbody">'+D.identity.what+'</div>'
      + '<div class="pbody">'+D.bridge.why+'</div>'
      + '<div class="btns">'
        + (D.product && HASINV[D.product] ? '<button class="btn" onclick="location.href=\'inventory-'+D.product+'-portfolio.html\'">Inventory</button>' : '')
        + '<button class="btn" onclick="location.href=\'es-rulebook.html?es='+D.id+'\'">Reading room</button>'
        + '<button class="btn" onclick="location.href=\'es-press-shelf.html\'">All eight</button>'
      + '</div>'
      + '<div class="btnwide"><button class="btn" onclick="document.querySelector(\'.doc\').scrollIntoView({behavior:\'smooth\'})">'
        + '<span>'+D.vol+', '+D.volsub+'</span><span class="arw">&#8595;</span></button></div>'
    + '</div></div></div></section>';

  /* the reading page */
  h += '<div class="doc"><div class="docin">';

  h += '<div class="col">' + head('Contents') + '</div>'
    + '<table class="tb">' + CHAPTERS.map(function(c,i){
        return '<tr><td>'+['One','Two','Three','Four'][i]+'</td><td>'+c[0]+'</td>'
             + '<td class="r">'+['Science','Machinery','Buyers','Assessment'][i]+'</td></tr>';
      }).join('') + '</table>';

  h += '<div class="sep"></div><div class="col">'
    + '<div class="chapno">Chapter one</div>' + head('Supply', CHAPTERS[0][1])
    + '<div class="dp">'+D.identity.what+'</div>'
    + f('How it is expressed', D.identity.expressed)
    + f('Where it sits', D.identity.sits)
    + f('What generates it', D.source.generates)
    + f('What has to be recorded', D.source.recorded)
    + f('Stacking position', D.source.stacking)
    + f('How uplift is calculated', D.quantity.calc)
    + f('Adjustments applied', D.quantity.adjust)
    + f('From uplift to offer', D.quantity.offer)
    + '</div>';

  h += '<div class="sep"></div><div class="col">'
    + '<div class="chapno">Chapter two</div>' + head('Bridge', CHAPTERS[1][1])
    + '<div class="dp">'+D.bridge.why+'</div>'
    + f('Scheme and standard', D.bridge.scheme)
    + f('Registry', D.bridge.registry)
    + f('MRV', D.bridge.mrv)
    + f('Legal wrapper', D.bridge.legal)
    + '</div>';

  h += '<div class="sep"></div><div class="col">'
    + '<div class="chapno">Chapter three</div>' + head('Demand', CHAPTERS[2][1])
    + '<div class="dp">'+D.demand.what+'</div>'
    + f('How we sell it', D.demand.how)
    + f('What it costs', D.demand.cost)
    + f('Caveat', D.demand.caveat)
    + '</div>';

  h += '<div class="sep"></div>'
    + '<div class="col"><div class="chapno">Chapter four</div>' + head('Market', CHAPTERS[3][1]) + '</div>';
  h += D.ready
    ? '<table class="tb">' + Object.keys(D.ready).map(function(k){
        return '<tr><td style="width:16em;font-style:normal;color:var(--ink)">'
             + '<span title="'+esc(window.GY_RB_CATDEF && GY_RB_CATDEF[k] || '')+'">'+k+'</span></td>'
             + '<td class="r" style="width:10em">'+RLAB[D.ready[k]]+'</td></tr>';
      }).join('') + '</table>'
    : '<div class="col"><div class="dp">Too nascent or bespoke to assess against the eight dimension '
      + 'framework. Sized per opportunity, one buyer at a time.</div></div>';

  var notices = (D.dyn||[]).map(function(q){ return [q,'Market dynamics']; })
    .concat((D.uk||[]).map(function(q){ return [q,'UK signals']; }));
  if(notices.length){
    h += '<div class="sep"></div><div class="col">' + head('Notices','What the market is saying') + '</div>'
      + '<div class="qs" style="margin-top:28px">' + notices.map(function(n){
          return '<div class="q">&#8220;'+n[0]+'&#8221;<cite>'+n[1]+', October 2025</cite></div>';
        }).join('') + '</div>';
  }

  if((D.risks||[]).length){
    h += '<div class="sep"></div><div class="col">' + head('Errata','Where this is most likely to be wrong')
      + '<ul class="lst" style="margin-top:12px">'
      + D.risks.map(function(r){ return '<li>'+r+'</li>'; }).join('') + '</ul></div>';
  }

  h += '<div class="sep"></div><div class="col">' + head('Details') + '</div>'
    + '<table class="tb">'
    + '<tr><td>Market type</td><td>'+D.type+'</td></tr>'
    + '<tr><td>Readiness</td><td>'+RLAB[D.status]+'</td></tr>'
    + '<tr><td>Size</td><td>'+D.vol+', '+D.volsub+'</td></tr>'
    + '<tr><td>Unit</td><td>'+D.identity.expressed+'</td></tr>'
    + '<tr><td>Legal wrapper</td><td>'+D.bridge.legal+'</td></tr>'
    + '<tr><td>Extent</td><td>'+extent(D).toLocaleString()+' words</td></tr>'
    + '<tr><td>Edition</td><td>First edition, October 2025</td></tr>'
    + '<tr><td>Series</td><td>Number '+pad(idx+1)+' of '+pad(B.length)+'</td></tr>'
    + '</table>';

  h += '<div class="sep"></div><div class="col">' + head('Bibliography') + '</div>'
    + '<table class="tb">' + (window.GY_RB_SOURCES||[]).map(function(r){
        return '<tr><td style="width:auto;font-style:normal;color:var(--ink)">'+r[0]+'</td>'
             + '<td class="r" style="width:9em">'+r[1]+'</td>'
             + '<td class="r" style="width:6em">'+r[2]+'</td></tr>';
      }).join('') + '</table>';

  h += '</div></div>';

  /* the footer shelf */
  var others = B.filter(function(x){ return x.id !== D.id; });
  h += '<div class="foot"><div class="footin">'
    + '<div class="ptitle" style="font-size:33px">Also from the press</div>'
    + '<div class="strip">' + others.map(function(x){
        var i = B.indexOf(x);
        return '<div>'+window.gyEsCover(x, i, 'es-press.html?es='+x.id)
             + '<div class="sn">'+x.name+'</div></div>';
      }).join('') + '</div>'
    + '</div></div>';

  h += '</div>';
  document.getElementById(mountId).outerHTML = h;
};

})();
