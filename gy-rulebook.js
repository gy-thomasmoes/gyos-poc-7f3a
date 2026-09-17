/* gy-rulebook.js - one ecosystem service rule book: a productised cover on top
   of a plain reading page. The cover matches the ES inventory pages; everything
   below is a single-column document. */
(function(){

var CSS = `
.cover{position:relative;overflow:hidden;color:#fff;padding:32px 0 28px;background:var(--pc)}
.coverin{max-width:720px;margin:0 auto;padding:0 32px;position:relative;z-index:1}
.covtop{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-bottom:16px}
.covico{width:52px;height:52px;border-radius:15px;background:rgba(255,255,255,.16);
  display:flex;align-items:center;justify-content:center;flex:none}
.covico .ti{font-size:27px}
.coveyebrow{font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.7)}
.covname{font-family:var(--serif);font-weight:500;font-size:34px;letter-spacing:-.02em;line-height:1.05;margin-top:3px}
.covstats{display:flex;gap:30px;flex-wrap:wrap;margin-top:24px}
.cs .csv{font-size:25px;font-weight:600;letter-spacing:-.02em;line-height:1}
.cs .csl{font-size:11.5px;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.66);margin-top:6px;font-weight:600}
.covacts{display:flex;gap:9px;flex:none}
.covbtn{font:inherit;font-size:13.5px;font-weight:500;padding:8px 14px;border-radius:10px;cursor:pointer;
  background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.25);color:#fff;display:inline-flex;align-items:center;gap:7px}
.covbtn:hover{background:rgba(255,255,255,.24)}
.covbtn.solid{background:#fff;border-color:#fff;color:var(--pc)}

/* ---- the body is a document, not a dashboard ---- */
.rbdoc{max-width:720px;margin:0 auto;padding:30px 32px 110px}
.rbh2{font-family:var(--serif);font-size:27px;font-weight:500;letter-spacing:-.02em;line-height:1.15;
  margin:52px 0 0;padding-top:26px;border-top:1px solid var(--line)}
.rbh2:first-child{margin-top:8px;padding-top:0;border-top:none}
.rbh2 .n{color:var(--pc);margin-right:10px}
.rbkicker{font-size:14.5px;color:var(--ink3);font-style:italic;margin-top:7px}
.rbh3{font-size:12px;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:var(--pc);margin:34px 0 0}
.rbk{font-size:15.5px;font-weight:600;letter-spacing:-.01em;margin-top:22px}
.rbp{font-size:16px;line-height:1.65;color:var(--ink2);margin-top:5px}
.rbnote{font-size:13.5px;line-height:1.6;color:var(--ink3);font-style:italic;margin-top:14px;
  padding-left:14px;border-left:2px solid var(--line)}
.rbul{margin-top:10px}
.rbul li{font-size:16px;line-height:1.6;color:var(--ink2);margin-top:9px;padding-left:20px;position:relative;list-style:none}
.rbul li::before{content:"";position:absolute;left:3px;top:10px;width:5px;height:5px;border-radius:50%;background:var(--pc)}
.rbempty{font-size:15px;color:var(--ink3);margin-top:8px}

.rbtbl{width:100%;border-collapse:collapse;font-size:15px;margin-top:14px}
.rbtbl th{text-align:left;font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;
  color:var(--ink3);padding:0 0 9px;border-bottom:1px solid var(--line)}
.rbtbl td{padding:10px 0;border-bottom:1px solid var(--line);color:var(--ink2)}
.rbtbl td:first-child{color:var(--ink)}
.rbtbl td:last-child,.rbtbl th:last-child{text-align:right}
.rbdim{cursor:help;border-bottom:1px dotted var(--line2)}
.rbs{font-size:12px;font-weight:700;padding:2px 10px;border-radius:999px;white-space:nowrap}
.rbs.g{background:#EAF3DE;color:#27500A}
.rbs.o{background:#FAEEDA;color:#854F0B}
.rbs.r{background:#FBE6E3;color:#A3342B}
.rbgrade{font-size:12px;font-weight:600;padding:2px 9px;border-radius:999px;background:#F1EFE8;color:#5F5E5A}
.rbgrade.Gold{background:#FAEEDA;color:#854F0B}
.rbgrade.Bronze{background:#F3E7DF;color:#8A5510}
`;

window.gyRuleBook = function(id){
  var D = (window.GY_RULEBOOKS||[]).filter(function(x){return x.id===id;})[0];
  if(!D){ document.getElementById('rbpage').innerHTML='<div class="rbdoc">Rule book not found.</div>'; return; }
  var st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st);

  var RLAB={g:'Active',o:'Emerging',r:'Nascent'};
  function f(k,v){ return '<div class="rbk">'+k+'</div><div class="rbp">'+v+'</div>'; }
  function h2(n,t,k){ return '<h2 class="rbh2"><span class="n">'+n+'</span>'+t+'</h2><div class="rbkicker">'+k+'</div>'; }
  function h3(t){ return '<div class="rbh3">'+t+'</div>'; }
  function ul(a){ return a && a.length
      ? '<ul class="rbul">'+a.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul>'
      : '<div class="rbempty">Nothing logged yet.</div>'; }

  var h = '<div class="cover" style="--pc:'+D.col+'"><div class="coverin">'
    +'<div class="covtop"><span class="covico"><i class="ti '+D.ic+'"></i></span>'
      +'<div class="covacts">'
        +(D.product?'<button class="covbtn" onclick="location.href=\'inventory-'+D.product+'-portfolio.html\'"><i class="ti ti-packages"></i> Inventory</button>':'')
        +'<button class="covbtn solid" onclick="location.href=\'hive-mind-library.html\'"><i class="ti ti-arrow-left"></i> Library</button>'
      +'</div></div>'
    +'<div class="coveyebrow">Rule book &middot; '+D.type+'</div>'
    +'<div class="covname">'+D.name+'</div>'
    +'<div class="covstats">'
      +'<div class="cs"><div class="csv">'+D.vol+'</div><div class="csl">'+D.volsub+'</div></div>'
      +'<div class="cs"><div class="csv">'+RLAB[D.status]+'</div><div class="csl">Market readiness</div></div>'
      +'<div class="cs"><div class="csv">Oct 2025</div><div class="csl">Last refreshed</div></div>'
    +'</div></div></div>';

  h += '<div class="rbdoc" style="--pc:'+D.col+'">';

  h += h2(1,'Supply','What it is, what generates it, how much there is')
    + h3('Identity')
    + f('What it is',D.identity.what) + f('How it is expressed',D.identity.expressed) + f('Where it sits',D.identity.sits)
    + h3('Source')
    + f('What generates it',D.source.generates) + f('What has to be recorded',D.source.recorded) + f('Stacking position',D.source.stacking)
    + h3('Quantity')
    + f('How uplift is calculated',D.quantity.calc) + f('Adjustments applied',D.quantity.adjust) + f('From uplift to offer',D.quantity.offer);

  h += h2(2,'Bridge','What makes it real and sellable')
    + f('Scheme and standard',D.bridge.scheme) + f('Registry',D.bridge.registry) + f('MRV',D.bridge.mrv)
    + f('Legal wrapper',D.bridge.legal) + f('Why it matters commercially',D.bridge.why);

  h += h2(3,'Demand','Who buys it, how we sell it, what it costs')
    + f('What it is',D.demand.what) + f('How we sell it',D.demand.how) + f('What it costs',D.demand.cost)
    + '<div class="rbnote">'+D.demand.caveat+'</div>';

  h += h2(4,'Market','Readiness, dynamics, signals and risks') + h3('Readiness');
  h += D.ready
    ? '<table class="rbtbl"><thead><tr><th>Dimension</th><th>Score</th></tr></thead><tbody>'
      + Object.keys(D.ready).map(function(k){
          return '<tr><td><span class="rbdim" title="'+(GY_RB_CATDEF[k]||'').replace(/"/g,'&quot;')+'">'+k+'</span></td>'
               + '<td><span class="rbs '+D.ready[k]+'">'+RLAB[D.ready[k]]+'</span></td></tr>';
        }).join('') + '</tbody></table>'
    : '<div class="rbempty">Too nascent or bespoke to assess against the eight-dimension framework. Sized per opportunity.</div>';

  h += h3('Dynamics') + ul(D.dyn)
    + h3('UK signals') + ul(D.uk)
    + h3('Risks') + ul(D.risks)
    + h3('Sources')
    + '<table class="rbtbl"><thead><tr><th>Source</th><th style="text-align:left">Type</th><th>Grade</th></tr></thead><tbody>'
    + GY_RB_SOURCES.map(function(r){
        return '<tr><td>'+r[0]+'</td><td style="text-align:left">'+r[1]+'</td><td><span class="rbgrade '+r[2]+'">'+r[2]+'</span></td></tr>';
      }).join('')
    + '</tbody></table>';

  h += '</div>';
  document.getElementById('rbpage').outerHTML = h;
};
})();
