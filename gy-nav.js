/* CARTO basemaps key. Paste the key from dashboard.basemaps.carto.com here
   and every map in the prototype picks it up. Basemap keys are client-side
   by design; restrict it by domain in the CARTO dashboard. */
window.GY_CARTO_KEY = 'cb1_3l0b_1_d2561eca2c443f93c5f9c741';
window.gyCartoTiles = function(style){
  var k = window.GY_CARTO_KEY || '';
  return 'https://{s}.basemaps.cartocdn.com/' + (style||'light_all') +
         '/{z}/{x}/{y}{r}.png' + (k ? '?key=' + k : '');
};

/* ── GY shared sidebar navigation ────────────────────────────────────────
   One nav, every POC. Include where the aside.snav used to be:

     script: window.GYNAV={active:'demand-mapping', arts:'demand'};
     then:   script src="gy-nav.js"

   config:
     active : 'library' | 'deliverables' | 'demand-mapping' | 'investor-qa'
              | 'meeting-notes' | 'documents' | 'home' | '' (nothing highlighted)
     arts   : 'demand' | 'investor' | null   → which Tools list to show
     artActive : label of the active Tool item (optional)

   Structure (v7 · Sep 2026 rail, altitude as scope):
     Personal spine (Home, Notifications, To-dos) then a single Workspace
     picker listing BOTH altitudes: Portfolio above a divider, the three
     Programmes below it. The picker is the way to move between altitudes;
     a back row to Portfolio stays as a shortcut inside a programme.
       Portfolio : Overview · Manage (Inventory [Search, BNG, Carbon],
                   Deals, Workflows) · Intelligence (Market Map, Outcome
                   Engine) · Records (Documents, Meeting notes, Activity)
       Programme : Overview · Manage (Inventory [BNG, Carbon], Projects,
                   Sites, Workflows) · Records (as above)
     Hive Mind Library and the profile are pinned as full-width footer rows.
     A subtle dark-mode toggle themes the sidebar. Scope persists via
     localStorage('gyScope'); dark via localStorage('gyDark').
──────────────────────────────────────────────────────────────────────── */
(function(){
  var cfg = window.GYNAV || {};
  var active = cfg.active || '';
  function on(k){ return active===k ? ' on' : ''; }
  var invActive = (active && active.indexOf('inv-')===0) || active==='pf-inventory';
  var progInv = active && active.indexOf('prog-inv')===0;
  /* Embed mode (?embed=1): hide the app sidebar so the canvas embeds cleanly,
     e.g. inside a Notion /embed block, showing just the scrollable board. */
  try{ var qp=new URLSearchParams(location.search);
    if(qp.get('embed')==='1') document.documentElement.classList.add('gyembed');
    /* bare=1: also hide the canvas's own chrome (chapter nav, About, Activity)
       for hosts that already show that state around the embed. */
    if(qp.get('bare')==='1') document.documentElement.classList.add('gybare');
  }catch(e){}

  window.gyToast = function(m){ if(window.toast) toast(m); };
  function gyStore(){ try{ return JSON.parse(localStorage.getItem('gyOpen')||'{}'); }catch(e){ return {}; } }
  function gyIsOpen(key,def){ var o=gyStore(); return key in o ? !!o[key] : def; }
  function gyCls(key,def){ return gyIsOpen(key,def) ? '' : ' closed'; }
  /* Clicking the parent row opens its accordion and goes to the first page
     inside it. The chevron stays a pure toggle. */
  window.gyOpenGo = function(a,s,href){
    var arr=document.getElementById(a), sub=document.getElementById(s);
    if(arr) arr.classList.remove('closed');
    if(sub) sub.classList.remove('closed');
    try{ var o=gyStore(); o[s]=true; localStorage.setItem('gyOpen',JSON.stringify(o)); }catch(e){}
    var here=(location.pathname.split('/').pop()||'');
    if(href && here!==href.split('?')[0]) location.href=href;
  };
  window.gyTgl = function(a,s){
    var arr=document.getElementById(a), sub=document.getElementById(s);
    if(arr) arr.classList.toggle('closed');
    if(sub) sub.classList.toggle('closed');
    try{ var o=gyStore(); o[s] = sub ? !sub.classList.contains('closed') : true; localStorage.setItem('gyOpen',JSON.stringify(o)); }catch(e){}
  };
  if(!window.toggleNav) window.toggleNav = function(){
    var hid = document.body.classList.toggle('navhid');
    var b = document.getElementById('expandBtn');
    if(b) b.style.display = hid ? '' : 'none';
  };

  var DELIVERABLES = [
    ['customer-demand-v2','Customer Demand Mapping v2',"location.href='customer-demand-mapping-v2-canvas.html'"],
    ['demand-mapping','Customer Demand Mapping',"location.href='demand-mapping-canvas-prototype.html'"],
    ['investor-qa','Investor Q&A Log',"location.href='investor-qa-log-canvas-prototype.html'"],
    ['tender-to-bid','Tender to Bid',"location.href='tender-to-bid-canvas-prototype.html'"],
    ['lead-demand-mapping','Lead Demand mapping',"location.href='lead-demand-mapping-canvas.html'"],
    ['market-readiness','Market Readiness',"gyToast('Market Readiness Assessment is not in this prototype yet')"],
    ['financial-model','Financial Model',"gyToast('Financial Model is not in this prototype yet')"],
    ['commercial-strategy','Commercial Strategy',"gyToast('Commercial Strategy is not in this prototype yet')"]
  ];
  var delActive = ['customer-demand-v2','demand-mapping','demand-textview','lead-mapping','upper-dee-mapping','upper-dee-executors','workflow-experiment-mapping','investor-qa','tender-to-bid','lead-demand-mapping','market-readiness','financial-model','commercial-strategy'].indexOf(active)>=0;
  /* Workflows accordion: open (respecting stored state) only when on a workflow page;
     always collapsed on first load of the programme layer / Overview. */
  var delCls = delActive ? gyCls('delSub', true) : ' closed';

  var ARTSETS = {
    demandv2: [
      ['Questionnaire · Project context',"location.href='questionnaire-editor.html'"],
      ['Agenda · Kick-off call',"location.href='artefact-editor.html?a=agenda'"],
      ['Email · Project context',"location.href='artefact-editor.html?a=qemail'"],
      ['Assistant · Pre-call brief',"location.href='artefact-editor.html?a=precall'"],
      ['Assistant · Gap summary',"location.href='artefact-editor.html?a=gapsum'"],
      ['Layer · Catchment mapping',"gyToast('Person-mediated through Katia. No editor yet.')"],
      ['Feed · GPAP planning scrape',"gyToast('Person-mediated through George. No editor yet.')"],
      ['Data · Abstraction licences',"gyToast('Person-mediated through Katia. No editor yet.')"],
      ['List · SBTi targets',"gyToast('Manual look-up on sciencebasedtargets.org')"],
      ['List · TNFD adopters',"gyToast('Manual look-up on tnfd.global')"],
      ['Shelf · Public funding sources',"gyToast('gov.uk, gov.scot and NatureScot')"],
      ['Library · Buyer sector profiles',"gyToast('Six buyer sectors. Standing store, refreshed Oct 2025.')"],
      ['Template · Buyer tables',"gyToast('Tool editors are not wired for this Workflow yet')"],
      ['Database · GY buyers',"location.href='artefact-editor.html?a=buyerdb'"],
      ['Library · ES rule books',"location.href='artefact-editor.html?a=rulebooks'"],
      ['Shelf · Supply registries',"location.href='artefact-editor.html?a=registries'"],
      ['Template · Evidence pack',"location.href='artefact-editor.html?a=evidence'"],
      ['Scoring · Market readiness',"location.href='artefact-editor.html?a=scoring'"],
      ['Template · Verdict pack',"location.href='artefact-editor.html?a=verdict'"],
      ['Schema · Data platform file',"gyToast('Handoff schema. No editor yet.')"]
    ],
    demand: [
      ['Questionnaire · Project context',"location.href='questionnaire-editor.html'"],
      ['Agenda · Kick-off call',"location.href='artefact-editor.html?a=agenda'"],
      ['Email · Project context',"location.href='artefact-editor.html?a=qemail'"],
      ['Assistant · Pre-call brief',"location.href='artefact-editor.html?a=precall'"],
      ['Assistant · Gap summary',"location.href='artefact-editor.html?a=gapsum'"],
      ['Library · ES rule books',"location.href='artefact-editor.html?a=rulebooks'"],
      ['Shelf · Supply registries',"location.href='artefact-editor.html?a=registries'"],
      ['Template · Evidence pack',"location.href='artefact-editor.html?a=evidence'"],
      ['Scoring · Supply side',"location.href='artefact-editor.html?a=scoring'"],
      ['Database · GY buyers',"location.href='artefact-editor.html?a=buyerdb'"],
      ['Template · Verdict pack',"location.href='artefact-editor.html?a=verdict'"]
    ],
    tender: [
      ['Tender pipeline',"gyToast('Tool editors are not wired for this Workflow yet')"],
      ['Requirements extract',"gyToast('Tool editors are not wired for this Workflow yet')"],
      ['Battenburg scorecard',"gyToast('Tool editors are not wired for this Workflow yet')"],
      ['Evidence map',"gyToast('Tool editors are not wired for this Workflow yet')"],
      ['Answer bank',"gyToast('Tool editors are not wired for this Workflow yet')"],
      ['Rate card',"gyToast('Tool editors are not wired for this Workflow yet')"],
      ['Lessons register',"gyToast('Tool editors are not wired for this Workflow yet')"]
    ],
    leaddemand: [
      ['Shelf · Spatial layers',"gyToast('Tool editors are not wired for this Workflow yet')"],
      ['Nat cap thresholds',"gyToast('Tool editors are not wired for this Workflow yet')"],
      ['Database · GY buyers',"location.href='artefact-editor.html?a=buyerdb'"],
      ['Top of funnel map',"gyToast('Tool editors are not wired for this Workflow yet')"],
      ['Template · Lead demand report',"gyToast('Tool editors are not wired for this Workflow yet')"],
      ['Email · Report to decision maker',"gyToast('Tool editors are not wired for this Workflow yet')"]
    ],
    investor: [
      ['Q&A Protocol',"gyToast('Tool editors are not wired for this Workflow yet')"],
      ['Q&A Log template',"gyToast('Tool editors are not wired for this Workflow yet')"],
      ['Answer Library',"gyToast('Tool editors are not wired for this Workflow yet')"],
      ['ELR Investor FAQs',"gyToast('Tool editors are not wired for this Workflow yet')"],
      ['Q&A pack · example Output',"location.href='investor-qa-pack-example.html'"]
    ]
  };

  function rows(list){
    return list.map(function(d){
      var isOn = active===d[0];
      return '<div class="sitem'+(isOn?' on':'')+'"'+(isOn?'':' onclick="'+d[2]+'"')+'>'+d[1]+'</div>';
    }).join('');
  }

  var artsHtml = '';
  if(cfg.arts && ARTSETS[cfg.arts]){
    artsHtml =
      '<div class="sitem" onclick="gyTgl(\'artArr\',\'artSub\')"><i class="ti ti-template"></i> Tools <i class="ti ti-chevron-down sarr'+gyCls('artSub',false)+'" id="artArr" onclick="event.stopPropagation();gyTgl(\'artArr\',\'artSub\')"></i></div>'
      +'<div class="ssub'+gyCls('artSub',false)+'" id="artSub">'
      +ARTSETS[cfg.arts].map(function(a){
        var isOn = cfg.artActive===a[0];
        return '<div class="sitem'+(isOn?' on':'')+'"'+(isOn?'':' onclick="'+a[1]+'"')+'>'+a[0]+'</div>';
      }).join('')
      +'</div>';
  }

  var INV_PROG =
    '<div class="ssub'+gyCls('invSub',progInv)+'" id="invSub">'
    +'<div class="sitem'+on('prog-inventory')+'"'+(active==='prog-inventory'?'':' onclick="location.href=\'inventory-overview.html\'"')+'>Overview</div>'
    +'<div class="sitem'+on('prog-inv-bng')+'"'+(active==='prog-inv-bng'?'':' onclick="location.href=\'inventory-bng-programme.html\'"')+'><span class="es-dot es-bng" style="margin-right:9px"></span>BNG</div>'
    +'<div class="sitem'+on('prog-inv-wcc')+'"'+(active==='prog-inv-wcc'?'':' onclick="location.href=\'inventory-wcc-programme.html\'"')+'><span class="es-dot es-wcc" style="margin-right:9px"></span>Woodland carbon</div>'
    +'<div class="sitem'+on('prog-inv-soc')+'"'+(active==='prog-inv-soc'?'':' onclick="location.href=\'inventory-soc-programme.html\'"')+'><span class="es-dot es-soc" style="margin-right:9px"></span>Soil carbon</div>'
    +'</div>';
  var INV_PF =
    '<div class="ssub'+gyCls('pfInvSub',invActive)+'" id="pfInvSub">'
    +'<div class="sitem'+on('pf-inventory')+'"'+(active==='pf-inventory'?'':' onclick="location.href=\'inventory-portfolio-overview.html\'"')+'>Overview</div>'
    +'<div class="sitem'+on('inv-bng')+'"'+(active==='inv-bng'?'':' onclick="location.href=\'inventory-bng-portfolio.html\'"')+'><span class="es-dot es-bng" style="margin-right:9px"></span>BNG</div>'
    +'<div class="sitem'+on('inv-wcc')+'"'+(active==='inv-wcc'?'':' onclick="location.href=\'inventory-wcc-portfolio.html\'"')+'><span class="es-dot es-wcc" style="margin-right:9px"></span>Woodland carbon</div>'
    +'</div>';

  /* Shared items - referenced by BOTH the advanced portfolio panel and the
     basic panel, so any edit here propagates to both. */
  var ITEM_INV_PF =
    '<div class="sitem" onclick="gyOpenGo(\'pfInvArr\',\'pfInvSub\',\'inventory-portfolio-overview.html\')"><i class="ti ti-packages"></i> Inventory <i class="ti ti-chevron-down sarr'+gyCls('pfInvSub',invActive)+'" id="pfInvArr" onclick="event.stopPropagation();gyTgl(\'pfInvArr\',\'pfInvSub\')"></i></div>'
    +INV_PF;
  var ITEM_INV_PROG =
    '<div class="sitem" onclick="gyOpenGo(\'invArr\',\'invSub\',\'inventory-overview.html\')"><i class="ti ti-packages"></i> Inventory <i class="ti ti-chevron-down sarr'+gyCls('invSub',progInv)+'" id="invArr" onclick="event.stopPropagation();gyTgl(\'invArr\',\'invSub\')"></i></div>'
    +INV_PROG;
  var ITEM_MARKETMAP =
    '<div class="sitem'+on('market-map')+'"'+(active==='market-map'?'':' onclick="location.href=\'market-map-kwame.html\'"')+'><i class="ti ti-map-2"></i> Market Map (Kwame)</div>';
  var ITEM_GENIE =
    '<div class="sitem" onclick="gyToast(\'Ask the data (Genie): natural-language questions over the data platform, not in this prototype yet\')"><i class="ti ti-sparkles"></i> Ask the data (Genie)</div>';
  var ITEM_WORKFLOWS =
    '<div class="sitem'+(active==='deliverables'||delActive?' on':'')+'"'+(active==='deliverables'?'':' onclick="location.href=\'deliverables-landing.html\'"')+'><i class="ti ti-hierarchy-2"></i> Workflows <i class="ti ti-chevron-down sarr'+delCls+'" id="delArr" onclick="event.stopPropagation();gyTgl(\'delArr\',\'delSub\')"></i></div>'
    +'<div class="ssub'+delCls+'" id="delSub">'+rows(DELIVERABLES)+artsHtml+'</div>';
  /* Simple version: only the live pilot, Demand Mapping, opened in its manual first version. */
  var DELIVERABLES_BASIC = [
    ['lead-mapping','Lead Customer Demand Mapping',"location.href='lead-supply-demand-mapping-canvas.html'"],
    ['upper-dee-mapping','Upper Dee: Customer Demand Mapping',"location.href='upper-dee-supply-demand-mapping-canvas.html'"],
    ['workflow-experiment-mapping','Workflow experiment: S&D Mapping',"location.href='workflow-experiment-supply-demand-mapping-canvas.html'"],
    ['demand-mapping','Customer Demand Mapping',"location.href='demand-mapping-canvas-prototype.html'"]
  ];
  var ITEM_WORKFLOWS_BASIC =
    '<div class="sitem'+(active==='deliverables'||delActive?' on':'')+'"'+(active==='deliverables'?'':' onclick="location.href=\'deliverables-landing.html\'"')+'><i class="ti ti-hierarchy-2"></i> Workflows <i class="ti ti-chevron-down sarr'+delCls+'" id="delArr" onclick="event.stopPropagation();gyTgl(\'delArr\',\'delSub\')"></i></div>'
    +'<div class="ssub'+delCls+'" id="delSub">'+rows(DELIVERABLES_BASIC)+'</div>';

  /* Basic POC: slimmed first-steps view, with bundle titles above the links.
     Market · Intelligence · Manage, showing Inventory, the two live Intelligence
     tools, and Workflows. No personal spine, no scope switcher, no programmes. */
  function basicPanel(){
    return ''
    +'<div class="gy-grp">Market</div>'
    +ITEM_INV_PF
    +'<div class="sitem" onclick="gyToast(\'Deals: the deal pipeline across programmes\')"><i class="ti ti-businessplan"></i> Deals</div>'
    +'<div class="gy-grp">Intelligence</div>'
    +ITEM_MARKETMAP
    +ITEM_GENIE
    +'<div class="gy-grp">Manage</div>'
    +ITEM_WORKFLOWS_BASIC;
  }

  var RECORDS =
    '<div class="gy-grp">Records</div>'
    +'<div class="sitem'+on('documents')+'" onclick="location.href=\'documents-overview.html\'"><i class="ti ti-file-text"></i> Documents <span class="scount" id="cntDocs"></span></div>'
    +'<div class="sitem'+on('meeting-notes')+'" onclick="location.href=\'meeting-notes.html\'"><i class="ti ti-note"></i> Meeting notes <span class="scount" id="cntNotes"></span></div>'
    +'<div class="sitem'+on('activity')+'"'+(active==='activity'?'':' onclick="location.href=\'activity-overview.html\'"')+'><i class="ti ti-activity"></i> Activity</div>';

  function progPanel(){
    return ''
    +'<div class="sitem'+on('overview')+'"'+(active==='overview'?'':' onclick="location.href=\'programme-overview.html\'"')+'><i class="ti ti-layout-dashboard"></i> Overview</div>'
    +'<div class="gy-grp">Manage</div>'
    +ITEM_INV_PROG
    +'<div class="sitem'+on('prog-projects')+'"'+(active==='prog-projects'?'':' onclick="location.href=\'projects.html\'"')+'><i class="ti ti-map"></i> Projects</div>'
    +'<div class="sitem'+on('prog-sites')+'"'+(active==='prog-sites'?'':' onclick="location.href=\'sites.html\'"')+'><i class="ti ti-map-pin"></i> Sites</div>'
    +ITEM_WORKFLOWS
    +RECORDS;
  }
  function pfPanel(){
    return ''
    +'<div class="sitem'+on('pf-overview')+'"'+(active==='pf-overview'?'':' onclick="location.href=\'portfolio-overview.html\'"')+'><i class="ti ti-layout-dashboard"></i> Overview</div>'
    +'<div class="gy-grp">Manage</div>'
    +ITEM_INV_PF
    +'<div class="sitem" onclick="gyToast(\'Deals: the deal pipeline across programmes\')"><i class="ti ti-businessplan"></i> Deals</div>'
    +'<div class="sitem" onclick="gyToast(\'Workflows: cross-programme, portfolio-level workflows live here\')"><i class="ti ti-hierarchy-2"></i> Workflows</div>'
    +'<div class="gy-grp">Intelligence</div>'
    +ITEM_MARKETMAP
    +RECORDS;
  }
  function scopeMeta(s){
    return s==='portfolio'
      ? {eye:'Portfolio', name:'Portfolio', ini:'GY', cls:'gy-ws-gy'}
      : {eye:'Programme', name:'Evenlode', ini:'EV', cls:'gy-ws-ev'};
  }
  function wsTile(ini,cls){
    return '<span class="gy-wstile '+cls+'">'+ini+'</span>';
  }
  /* One picker, both altitudes. Portfolio sits above a divider, the
     programmes below it, so the two levels read as different levels. */
  function pickerHtml(){
    var s = scope;
    function ck(x){ return s===x ? '<i class="ti ti-check gy-ck"></i>' : ''; }
    return '<div class="gy-pkhead">Portfolio</div>'
      +'<div class="gy-pk" onclick="gyGoPortfolio()">'+wsTile('GY','gy-ws-gy')+'Portfolio'+ck('portfolio')+'</div>'
      +'<div class="gy-pkdiv"></div>'
      +'<div class="gy-pkhead">Programmes</div>'
      +'<div class="gy-pk" onclick="gyGoProg()">'+wsTile('EV','gy-ws-ev')+'Evenlode'+ck('programme')+'</div>'
      +'<div class="gy-pk" onclick="gyToast(\'Spains Hall is not in this prototype yet\')">'+wsTile('SH','gy-ws-sh')+'Spains Hall</div>'
      +'<div class="gy-pk" onclick="gyToast(\'Boothby is not in this prototype yet\')">'+wsTile('BO','gy-ws-bo')+'Boothby</div>';
  }

  var scope = 'programme';
  try{ scope = localStorage.getItem('gyScope') || 'programme'; }catch(e){}
  var mode = 'advanced';
  try{ mode = localStorage.getItem('gyMode') || 'advanced'; }catch(e){}
  var invActive = (active && active.indexOf('inv-')===0) || active==='pf-inventory';
  if(cfg.scope==='portfolio' || active==='market-map' || active==='outcome-engine' || active==='pf-overview' || active==='pf-reports' || invActive) scope='portfolio';
  else if(cfg.scope==='programme') scope='programme';
  else if(active && active!=='library' && active!=='home' && active!=='inbox' && scope==='portfolio') scope='programme';
  var meta = scopeMeta(scope);

  var CSS =
    '.gy-grp{font-size:12px;color:#9C9A92;padding:14px 10px 5px}'
   +'body.gydark .gy-grp{color:#8A877F}'
   +'.gy-switch{display:flex;align-items:center;gap:11px;margin:0;padding:9px;border-radius:10px;border:1px solid #CFCDC5;font-size:14.5px;font-weight:500;color:#2C2C2A;cursor:pointer}'
   +'.gy-switch:hover{border-color:#B4B2A9}'
   +'.gy-switch>i:first-child{font-size:16px;color:#6B6A64}'
   +'.snav{overflow:hidden}'
   +'.gy-scopewrap{margin-top:4px;flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden}'
   +'@keyframes gyDeeper{from{opacity:0;transform:translateX(13px)}to{opacity:1;transform:none}}'
   +'@keyframes gyUp{from{opacity:0;transform:translateX(-13px)}to{opacity:1;transform:none}}'
   +'.gy-anim-in{animation:gyDeeper .22s ease}'
   +'.gy-anim-out{animation:gyUp .22s ease}'
   +'.gy-gap{height:14px}'
   /* Breadcrumb typography is canonical here, like the rail: one size, one
      colour, no per-page drift. The current page differs by weight only.
      No gydark variant on purpose: dark mode only restyles the rail, the
      topbar stays light, so light values are correct in both modes. */
   +'.crumbs .cr.gycr,.topbar .crumb.gycr,.row1 .crumb.gycr{font-size:16px;line-height:1.35;font-weight:400;letter-spacing:0;color:#766B62;white-space:nowrap;cursor:pointer}'
   +'.crumbs .cr.gycr:hover,.topbar .crumb.gycr:hover,.row1 .crumb.gycr:hover{color:#1A0C12}'
   +'.crumbs .sep.gycr-sep,.topbar .sep.gycr-sep,.row1 .sep.gycr-sep{font-size:14px;line-height:1.35;font-weight:400;color:#A79E8D}'
   +'.crumbs .cr.cur.gycr-leaf,.crumbs .cr.gycr-leaf,.topbar .title.gycr-leaf,.row1 .title.gycr-leaf,.crumbs .gycr-leaf,.topbar .gycr-leaf,.row1 .gycr-leaf{font-size:16px;line-height:1.35;font-weight:600;letter-spacing:-.01em;color:#1A0C12;white-space:nowrap;cursor:default}'
   +'.crumbs .cr.cur.gycr-leaf:hover,.crumbs .cr.gycr-leaf:hover{color:#1A0C12}'
   +'.gy-picker{position:absolute;left:0;right:0;background:#fff;border:1px solid #CFCDC5;border-radius:10px;box-shadow:0 8px 28px rgba(31,31,29,.16);padding:5px;z-index:30}'
   +'.gy-pk{display:flex;align-items:center;gap:10px;padding:8px 9px;border-radius:7px;cursor:pointer;font-size:14px;color:#2C2C2A}'
   +'.gy-pk:hover{background:#F1EFE8}'
   +'.gy-pk i{font-size:16px;color:#6B6A64}'
   +'.gy-pkhead{font-size:11px;color:#9C9A92;padding:8px 9px 3px}'
   +'.gy-pk .gy-ck{margin-left:auto;color:#185FA5}'
   +'.gy-modewrap{position:relative;display:inline-flex}'
   +'.gy-modemenu{position:absolute;bottom:calc(100% + 10px);left:50%;transform:translateX(-50%);width:196px;background:#fff;border:1px solid #CFCDC5;border-radius:11px;box-shadow:0 12px 34px rgba(31,31,29,.18);padding:5px;z-index:45}'
   +'.gy-modemenu .gy-pk{padding-left:14px}'
   +'.gy-modemenu .gy-pkhead{padding-left:14px}'
   +'body.gydark .gy-modemenu{background:#26252A;border-color:#3A393E}'
   +'.gy-wsmenu{position:absolute;left:4px;top:44px;width:236px;background:#fff;border:1px solid #CFCDC5;border-radius:12px;box-shadow:0 12px 34px rgba(31,31,29,.18);padding:6px;z-index:40}'
   +'.gy-usmenu{position:absolute;left:4px;right:4px;bottom:calc(100% + 6px);background:#fff;border:1px solid #CFCDC5;border-radius:12px;box-shadow:0 12px 34px rgba(31,31,29,.18);padding:6px;z-index:40}'
   +'body.gydark .gy-usmenu{background:#26252A;border-color:#3A393E}'
   +'.gy-wstop{display:flex;align-items:center;gap:10px;padding:6px 8px 10px}'
   +'.gy-ussub{display:block;font-size:12px;color:#9C9A92;margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
   +'.gy-wsname{display:block;font-size:14px;font-weight:600;color:#2C2C2A}'
   +'.gy-wssub{display:block;font-size:11px;color:#9C9A92}'
   +'.gy-pkdiv{height:1px;background:#E3E1DB;margin:5px -6px}'
   +'.gy-wstile{width:22px;height:22px;border-radius:6px;background:#EDEBE4;color:#4A4842;font-size:10px;font-weight:700;letter-spacing:.02em;display:flex;align-items:center;justify-content:center;flex:none}'
   +'.gy-ws-gy{background:#F9DD5A;color:#1A0C12}'
   +'.gy-ws-ev{background:#EAF1DE;color:#3F5A2B}'
   +'.gy-ws-sh{background:#E6F1FB;color:#185FA5}'
   +'.gy-ws-bo{background:#F7E7DE;color:#8A3F28}'
   +'body.gydark .gy-wstile{background:#33323A;color:#ECEAE4}'
   +'body.gydark .gy-ws-gy{background:#F9DD5A;color:#1A0C12}'
   +'body.gydark .gy-ws-ev{background:#2E3B26;color:#C4D8AC}'
   +'body.gydark .gy-ws-sh{background:#1F3149;color:#A8C7E6}'
   +'body.gydark .gy-ws-bo{background:#3B2B23;color:#E2B79F}'
   +'body.gydark .gy-wsmenu{background:#26252A;border-color:#3A393E}'
   +'body.gydark .gy-wsname{color:#ECEAE4}'
   +'body.gydark .gy-pkdiv{background:#3A393E}'
   +'.gy-fdiv{height:1px;background:#E3E1DB;margin:0 -12px;flex:none}'
   +'.gy-frow{display:flex;align-items:center;gap:11px;margin:0 -12px;padding:0 22px;height:60px;flex:none;box-sizing:border-box;font-size:15px;color:#2C2C2A;cursor:pointer}'
   +'.gy-frow>i:first-child{font-size:18px;color:#6B6A64}'
   +'.gy-frow:hover{background:#F3F2EE}'
   +'.gy-frow.on{background:#F1EFE8;font-weight:500}'
   +'.gy-fend{margin-left:auto;display:flex;gap:12px;align-items:center}'
   +'.gy-fend i{font-size:17px;color:#9C9A92;cursor:pointer}'
   /* dark mode - themes the sidebar only */
   +'body.gydark .snav{background:#1B1A1E;border-right-color:#2E2D31}'
   +'body.gydark .snav .sitem{color:#ECEAE4}'
   +'body.gydark .snav .sitem i{color:#B5B2AB}'
   +'body.gydark .snav .sitem:hover,body.gydark .snav .sitem.on{background:#26252A}'
   +'body.gydark .snav .ssub .sitem{color:#B5B2AB}'
   +'body.gydark .sworks b,body.gydark .sworks .ti{color:#ECEAE4}'
   +'body.gydark .scollapse{background:transparent;color:#B5B2AB}'
   +'body.gydark .scollapse:hover{background:#26252A;color:#ECEAE4}'
   +'body.gydark .gy-switch{border-color:#3A393E;color:#ECEAE4}'
   +'body.gydark .gy-switch>i:first-child{color:#B5B2AB}'
   +'body.gydark .gy-scopewrap{border-left-color:#33323A}'
   +'body.gydark .gy-fdiv{background:#2E2D31}'
   +'body.gydark .gy-frow{color:#ECEAE4}'
   +'body.gydark .gy-frow>i:first-child{color:#B5B2AB}'
   +'body.gydark .gy-frow:hover,body.gydark .gy-frow.on{background:#26252A}'
   +'body.gydark .gy-picker{background:#26252A;border-color:#3A393E}'
   +'body.gydark .gy-pk{color:#ECEAE4}'
   +'body.gydark .gy-pk:hover{background:#33323A}'
   +'body.gydark .sdiv{background:#2E2D31}'
   +'.gy-srow{display:flex;align-items:center;gap:8px;margin:0 0 10px}'
   +'.gy-search{flex:1;min-width:0;display:flex;align-items:center;gap:9px;padding:9px 11px;border:1px solid #CFCDC5;border-radius:11px;background:#fff;font-size:14.5px;color:#9C9A92;cursor:pointer}'
   +'.gy-notif{position:relative;width:38px;height:38px;flex:none;border:1px solid #CFCDC5;border-radius:11px;background:#fff;color:#6B6A64;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}'
   +'.gy-notif:hover{border-color:#B4B2A9;color:#1F1F1D}'
   +'.gy-notif i{font-size:17px}'
   +'.gy-ndot{position:absolute;top:7px;right:8px;width:8px;height:8px;border-radius:50%;background:#EF9F27;border:1.5px solid #fff}'
   +'body.gydark .gy-notif{background:#1B1A1E;border-color:#3A393E;color:#B5B2AB}'
   +'body.gydark .gy-notif:hover{border-color:#4A484F;color:#ECEAE4}'
   +'body.gydark .gy-ndot{border-color:#1B1A1E}'
   +'.gy-search:hover{border-color:#B4B2A9}'
   +'.gy-search i{font-size:16px;color:#9C9A92}'
   +'body.gydark .gy-search{background:#1B1A1E;border-color:#3A393E;color:#8A877F}'
   +'body.gydark .gy-search i{color:#8A877F}'
   +'body.gydark .gy-search:hover{border-color:#4A484F}'
   +'.snav{font-family:-apple-system,system-ui,"Inter","Segoe UI",sans-serif;font-size:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;background:#fff;border-right:1px solid #ECE7DB;padding:12px 12px 16px}'
   +'.snav .sitem{font-size:15px;font-weight:400;letter-spacing:normal;color:#1F1F1D;padding:8px 10px;border-radius:9px;gap:11px;margin-bottom:1px}'
   +'.snav .sitem>.ti{font-size:17px;color:#6B6A64}'
   +'.snav .sitem:hover{background:#F3F2EE}'
   +'.snav .sitem.on{background:#F1EFE8;font-weight:500}'
   +'.snav .ssub{margin:2px 0 4px 30px}'
   +'.snav .ssub .sitem{font-size:14.5px;font-weight:400;padding:6px 10px;color:#6B6A64}'
   +'.snav .ssub .sitem.on{color:#1F1F1D;font-weight:500}'
   +'.snav .sworks{gap:9px;padding:4px 6px 12px}'
   +'.snav .sworks .wtile{width:30px;height:30px;border-radius:9px;background:#F9DD5A;color:#1A0C12;font-size:13px;font-weight:700}'
   +'.snav .sworks b{font-size:15.5px;font-weight:600;color:#1F1F1D}'
   +'.snav .scount{font-size:11.5px;color:#9C9A92;font-weight:400;margin-left:auto;font-variant-numeric:tabular-nums}'
   +'.snav .sdiv{background:#E3E1DB}'
   +'.snav .sarr{color:#9C9A92}'
   +'.gy-smov{position:fixed;inset:0;background:rgba(31,31,29,.34);z-index:1270;display:none;align-items:flex-start;justify-content:center;padding:11vh 16px 16px}'
   +'.gy-smov.open{display:flex}'
   +'.gy-smbox{width:660px;max-width:100%;max-height:74vh;background:#fff;border:1px solid #E3E1DB;border-radius:16px;box-shadow:0 24px 70px rgba(31,31,29,.26);overflow:hidden;display:flex;flex-direction:column;font-family:-apple-system,system-ui,"Inter","Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}'
   +'.gy-smtop{display:flex;align-items:center;gap:11px;padding:15px 18px;border-bottom:1px solid #E3E1DB;flex:none}'
   +'.gy-smtop>i{font-size:18px;color:#9C9A92}'
   +'.gy-sminput{flex:1;min-width:0;border:none;outline:none;font:inherit;font-size:16px;color:#1F1F1D;background:transparent}'
   +'.gy-sminput::placeholder{color:#9C9A92}'
   +'.gy-smask{display:flex;align-items:center;gap:7px;font-size:13.5px;color:#9C9A92;cursor:pointer;white-space:nowrap}'
   +'.gy-smask:hover{color:#1F1F1D}'
   +'.gy-kbd{font-size:11px;color:#6B6A64;border:1px solid #E3E1DB;border-radius:5px;padding:1px 6px;background:#FBFAF5;font-family:inherit}'
   +'.gy-smlist{overflow:auto;padding:6px;flex:1}'
   +'.gy-smsec{font-size:12px;color:#9C9A92;padding:11px 12px 4px}'
   +'.gy-smitem{display:flex;align-items:center;gap:11px;padding:9px 12px;border-radius:9px;font-size:14.5px;color:#1F1F1D;cursor:pointer}'
   +'.gy-smitem>i{font-size:17px;color:#6B6A64;flex:none}'
   +'.gy-smitem .gy-smnm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
   +'.gy-smitem .gy-smtype{font-size:12.5px;color:#9C9A92;flex:none}'
   +'.gy-smitem.sel{background:#F1EFE8}'
   +'.gy-smempty{padding:30px 16px;text-align:center;color:#9C9A92;font-size:14.5px}'
   +'.gy-smfoot{display:flex;align-items:center;gap:16px;padding:11px 16px;border-top:1px solid #E3E1DB;background:#FBFAF5;font-size:13px;color:#9C9A92;flex:none}'
   +'.gy-nppop{position:fixed;width:372px;max-width:92vw;background:#fff;border:1px solid #E3E1DB;border-radius:14px;box-shadow:0 18px 48px rgba(31,31,29,.2);z-index:1260;overflow:hidden;font-family:-apple-system,system-ui,"Inter","Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}'
   +'.gy-nphd{padding:15px 16px 0;font-size:17px;font-weight:600;color:#1F1F1D}'
   +'.gy-nptabs{display:flex;gap:7px;padding:11px 16px 12px;border-bottom:1px solid #E3E1DB}'
   +'.gy-nptab{font:inherit;font-size:13.5px;padding:6px 12px;border-radius:9px;border:1px solid #E3E1DB;background:#fff;color:#6B6A64;cursor:pointer}'
   +'.gy-nptab.on{border-color:#185FA5;color:#185FA5;font-weight:500}'
   +'.gy-nplist{max-height:330px;overflow:auto;padding:6px}'
   +'.gy-npitem{display:flex;gap:11px;padding:11px 12px;border-radius:10px;cursor:pointer}'
   +'.gy-npitem>span:last-child{min-width:0;flex:1}'
   +'.gy-npitem:hover{background:#F3F2EE}'
   +'.gy-npico{width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex:none;font-size:16px}'
   +'.gy-nptitle{display:block;font-size:14.5px;font-weight:500;line-height:1.35;color:#1F1F1D}'
   +'.gy-npmeta{display:block;font-size:12.5px;color:#9C9A92;margin-top:3px}'
   +'.gy-npempty{padding:42px 20px;text-align:center}'
   +'.gy-npempty>i{font-size:38px;color:#DEDCD4}'
   +'.gy-npempty b{display:block;font-size:15px;margin-top:12px;color:#1F1F1D}'
   +'.gy-npempty p{font-size:13.5px;color:#9C9A92;margin-top:5px;line-height:1.45}'
   +'.gy-npfoot{padding:11px 16px;border-top:1px solid #E3E1DB;background:#FBFAF5;font-size:13.5px;color:#185FA5;cursor:pointer}'
   +'.es-bng{--esc:#1E8A63;--esbg:#E3F2EB}'
   +'.es-wcc{--esc:#C67F16;--esbg:#FAEEDA}'
   +'.es-soc{--esc:#7A6248;--esbg:#EFE9E1}'
   +'.es-nut{--esc:#1F6FB2;--esbg:#E4EFF8}'
   +'.es-nfm{--esc:#B5628F;--esbg:#F8E8F0}'
   +'.es-tile{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex:none;background:var(--esbg);color:var(--esc)}'
   +'.es-tile .ti{font-size:17px}'
   +'.es-tile.sm{width:26px;height:26px;border-radius:8px}'
   +'.es-tile.sm .ti{font-size:14px}'
   +'.es-dot{width:9px;height:9px;border-radius:3px;display:inline-block;flex:none;background:var(--esc)}'
   +'.es-chip{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:500;padding:3px 10px;border-radius:999px;background:var(--esbg);color:var(--esc)}'
   +'.meter{display:flex;gap:2px;height:8px;border-radius:999px;overflow:hidden;background:#EFEDE6;margin-top:9px}'
   +'.meter span{display:block;height:100%;border-radius:999px}'
   +'.meter .m1{background:var(--esc)}'
   +'.meter .m2{background:var(--esc);opacity:.34}'
   +'.meter .m3{background:#DCD9D0}'
   +'.meterlab{display:flex;gap:15px;font-size:12px;color:#9C9A92;margin-top:7px;flex-wrap:wrap}'
   +'.meterlab span{display:inline-flex;align-items:center;gap:5px}'
   +'.meterlab b{color:#1F1F1D;font-weight:500;font-variant-numeric:tabular-nums}'
   +'.meterlab i.k{width:8px;height:8px;border-radius:2px;display:inline-block}'
   /* Layer scale. The topbar is sticky at 1200 and therefore paints over
      ordinary page content, so ANYTHING that must cover the whole window
      belongs above it: action menu 1250, notifications 1260, search modal
      1270, drawer backdrop 1300 and drawer 1301. A new overlay built at the
      usual page-level 50 to 300 will silently slide under the topbar. */
   +'.topbar{position:sticky;top:0;z-index:1200}'
   /* Leaflet paints its panes and controls up to z-index 1000, which put the map
      over the sticky topbar. Giving the map container its own stacking context
      keeps every one of those layers inside the map. */
   +'.leaflet-container{position:relative;z-index:0}'
   /* gyMenu builds its popup in JS but had no styles anywhere, so the menu
      landed unpositioned at the foot of the page. These are its styles. */
   +'.gy-mpop{position:fixed;min-width:232px;background:var(--card);border:1px solid var(--line2);'
   +'border-radius:13px;box-shadow:0 16px 44px rgba(31,31,29,.18);padding:6px;z-index:1400}'
   +'.gy-mitem{display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:9px;'
   +'font-size:14px;color:var(--ink);cursor:pointer;white-space:nowrap}'
   +'.gy-mitem:hover{background:#F1EFE8}'
   +'.gy-mitem .ti{font-size:16px;color:var(--ink3)}'
   +'.gy-mlbl{font-size:10.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;'
   +'color:var(--ink3);padding:9px 11px 4px}'
   +'.gy-mdiv{height:1px;background:var(--line);margin:6px 8px}'
   /* ── top right action bar ────────────────────────────────────────────
      One bar for every page: Search, Filters, page buttons, Actions, then
      the primary button. Built by gyBar() so a new page cannot drift. */
   +'.abar{margin-left:auto;display:flex;align-items:center;gap:10px;position:relative}'
   +'.abtn{font:inherit;font-size:14px;font-weight:500;padding:9px 15px;border-radius:10px;cursor:pointer;'
   +'background:#fff;border:1px solid var(--line2);color:var(--ink);display:inline-flex;align-items:center;gap:7px;white-space:nowrap}'
   +'.abtn:hover{border-color:var(--ink3)}'
   +'.abtn .ti{font-size:16px;color:inherit}'
   +'.abtn.on{background:var(--ink);border-color:var(--ink);color:#fff}'
   +'.abtn.primary{background:var(--dark,#1F1F1D);border-color:var(--dark,#1F1F1D);color:#fff}'
   +'.abtn.primary:hover{opacity:.9}'
   +'.abtn .cnt{font-size:12px;font-weight:600;color:var(--ink3);font-variant-numeric:tabular-nums}'
   +'.abtn.on .cnt{color:rgba(255,255,255,.75)}'
   +'.apop{position:absolute;right:0;top:calc(100% + 9px);width:272px;background:var(--card);'
   +'border:1px solid var(--line2);border-radius:14px;box-shadow:0 16px 44px rgba(31,31,29,.18);'
   +'padding:7px;z-index:1400;display:none;text-align:left}'
   +'.apop.on{display:block}'
   +'.apop .ag{font-size:10.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--ink3);padding:9px 11px 4px}'
   +'.apop .ar{display:flex;align-items:center;gap:10px;padding:8px 11px;border-radius:9px;font-size:14px;color:var(--ink2);cursor:pointer}'
   +'.apop .ar:hover{background:#F1EFE8}'
   +'.apop .ar.on{color:var(--ink);font-weight:500}'
   +'.apop .ar .ti{font-size:16px;color:var(--ink3)}'
   +'.apop .ar .ck{margin-left:auto;font-size:16px;color:var(--greend,#2F6B3C);opacity:0}'
   +'.apop .ar.on .ck{opacity:1}'
   +'.apop .adiv{height:1px;background:var(--line);margin:6px 8px}'
   +'.asearch{display:none;align-items:center;gap:9px;width:100%;max-width:420px;margin:0 0 16px;'
   +'padding:10px 14px;background:var(--card);border:1px solid var(--line2);border-radius:11px}'
   +'.asearch.on{display:flex}'
   +'.asearch .ti{font-size:17px;color:var(--ink3)}'
   +'.asearch input{border:none;outline:none;background:transparent;font-family:inherit;font-size:14px;color:var(--ink);width:100%}'
   +'html.gyembed .snav,html.gyembed .snavpeek,html.gyembed #expandBtn,html.gyembed .scollapse{display:none!important}'
   +'html.gybare #chapnav{display:none!important}'
   +'html.gybare #floatR{display:none!important}'
   +'html.gybare .floatL .fpill:not(#toolsPill){display:none!important}'
   +'html.gybare .node .ns{display:none!important}'
   +'html.gybare #floatBL{display:none!important}'
   +'html.gybare .bandlab{font-size:12.5px;letter-spacing:.08em;color:#A7A49B}'
   +'html.gybare .bandlab.cur{color:#7C7970}'
   +'html.gybare .bandlab small{display:none}'
   +'html.gybare .band{background:rgba(255,255,255,.32)}'
   +'html.gybare .band.cur{border-width:1px;border-color:#DAD6CB;background:rgba(255,255,255,.62)}'
   +'html.gyembed body{--nav:0px}';

  /* keep the rail's to-do count in step with the shared store, on any page
     that loads gy-todos.js */
  function gyTodoCount(){
    if(!window.GYT) return;
    var el=document.getElementById('cntTodos');
    if(el) el.textContent = GYT.myOpen().length;
  }
  window.addEventListener('DOMContentLoaded', gyTodoCount);
  window.addEventListener('gy-todos-changed', gyTodoCount);
  setTimeout(gyTodoCount, 0);

  document.write(
    '<style>'+CSS+'</style>'
    +'<aside class="snav" id="snav">'
    +'<div class="sworks" style="position:relative">'
      +'<span class="wtile">GY</span>'
      +'<b id="gyWsBtn" onclick="gyWsMenu()" style="cursor:pointer">Great Yellow OS <i class="ti ti-chevron-down"></i></b>'
      +'<button class="scollapse" onclick="toggleNav()" title="Collapse sidebar"><i class="ti ti-layout-sidebar"></i></button>'
      +'<div class="gy-wsmenu" id="gyWsMenu" style="display:none">'
        +'<div class="gy-wstop"><span class="wtile" style="width:26px;height:26px;border-radius:8px;font-size:11px">GY</span><span><span class="gy-wsname">Great Yellow OS</span></span></div>'
        +'<div class="gy-pkhead">Admin</div>'
        +'<div class="gy-pk" onclick="gyToast(\'Settings: workspace configuration\')"><i class="ti ti-settings"></i>Settings</div>'
        +'<div class="gy-pk" onclick="gyToast(\'Members and access: Clerk plus Google Workspace\')"><i class="ti ti-users"></i>Members and access</div>'
        +'<div class="gy-pk" onclick="gyToast(\'Data sources and connections: managed connectors, API pulls, file volumes\')"><i class="ti ti-plug"></i>Data sources</div>'
        +'<div class="gy-pk" onclick="gyToast(\'Governance: Unity Catalog lineage, access, audit, discovery\')"><i class="ti ti-shield-check"></i>Governance</div>'
        +'<div class="gy-pkdiv"></div>'
        +'<div class="gy-pk" onclick="gyToast(\'Invite people to the workspace\')"><i class="ti ti-user-plus"></i>Invite people</div>'
        +'<div class="gy-pk" onclick="gyToast(\'Help and docs\')"><i class="ti ti-help-circle"></i>Help and docs</div>'
      +'</div>'
    +'</div>'

    /* search + notifications - shared chrome, both modes */
    +'<div class="gy-srow">'
      +'<div class="gy-search" onclick="gyOpenSearch()"><i class="ti ti-search"></i><span>Search</span></div>'
      +'<button class="gy-notif" id="gyNotifBtn" onclick="gyNotifPop()" title="Notifications" aria-label="Notifications"><i class="ti ti-bell"></i><span class="gy-ndot"></span></button>'
    +'</div>'

    /* personal spine - advanced only */
    +(mode==='advanced'
      ? '<div class="sitem'+on('home')+'"'+(active==='home'?'':' onclick="location.href=\'home.html\'"')+'><i class="ti ti-home"></i> Home</div>'
        +'<div class="sitem'+on('todos')+'"'+(active==='todos'?'':' onclick="location.href=\'todos.html\'"')+'><i class="ti ti-list-check"></i> To-dos <span class="scount" id="cntTodos"></span></div>'
      : '')

    /* workspace switcher - advanced only (the one way to move between altitudes) */
    +(mode==='advanced'
      ? '<div class="gy-grp">Workspace</div>'
        +'<div style="position:relative">'
          +'<div class="gy-switch" id="gySwitch" onclick="gyPicker()">'
            +'<span class="gy-wstile '+meta.cls+'" id="gyScIcon">'+meta.ini+'</span>'
            +'<span id="gyScName">'+meta.name+'</span>'
            +'<i class="ti ti-chevron-down" style="margin-left:auto;font-size:15px;color:#9C9A92"></i>'
          +'</div>'
          +'<div class="gy-picker" id="gyPicker" style="display:none">'+pickerHtml()+'</div>'
        +'</div>'
      : '')

    /* nested scope links - basic shows the slimmed panel */
    +'<div class="gy-scopewrap" id="gyScopeNav">'+(mode==='basic'?basicPanel():(scope==='portfolio'?pfPanel():progPanel()))+'</div>'

    /* pinned footer - library + profile, full-width rows */
    +'<div class="gy-fdiv" style="margin-top:auto"></div>'
    +'<div class="gy-frow'+on('library')+'"'+(active==='library'?'':' onclick="location.href=\'hive-mind-library.html\'"')+'><i class="ti ti-books"></i> Hive Mind Library</div>'
    +'<div class="gy-fdiv"></div>'
    +'<div id="gyUsWrap" style="position:relative;margin-bottom:-16px">'
      +'<div class="gy-frow" id="gyUsBtn" onclick="gyUsMenu()">'
        +'<span style="width:26px;height:26px;border-radius:50%;background:#E6F1FB;color:#185FA5;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:11px;flex:none">CC</span>'
        +'Caitlin'
        +'<span class="gy-fend">'
          +'<span class="gy-modewrap">'
            +'<i class="ti ti-stack-2" id="gyModeIcon" onclick="event.stopPropagation();gyModeMenu()" title="Switch view" aria-label="Switch between North Star and Simple version"></i>'
          +'</span>'
        +'</span>'
      +'</div>'
      +'<div class="gy-modemenu" id="gyModeMenu" style="display:none">'
        +'<div class="gy-pkhead">View</div>'
        +'<div class="gy-pk" onclick="event.stopPropagation();gySetMode(\'advanced\')"><span>North Star version</span>'+(mode==='advanced'?'<i class="ti ti-check gy-ck"></i>':'')+'</div>'
        +'<div class="gy-pk" onclick="event.stopPropagation();gySetMode(\'basic\')"><span>Simple version</span>'+(mode==='basic'?'<i class="ti ti-check gy-ck"></i>':'')+'</div>'
      +'</div>'
      +'<div class="gy-usmenu" id="gyUsMenu" style="display:none">'
        +'<div class="gy-wstop">'
          +'<span style="width:30px;height:30px;border-radius:50%;background:#E6F1FB;color:#185FA5;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:12px;flex:none">CC</span>'
          +'<span style="min-width:0"><span class="gy-wsname">Caitlin Ciceri</span><span class="gy-ussub">caitlin.ciceri@greatyellow.earth</span></span>'
        +'</div>'
        +'<div class="gy-pk" onclick="gyToast(\'Profile: your name, avatar and role\')"><i class="ti ti-user"></i>Profile</div>'
        +'<div class="gy-pk" onclick="gyToast(\'Preferences: language, defaults and display\')"><i class="ti ti-adjustments"></i>Preferences</div>'
        +'<div class="gy-pk" onclick="gyToast(\'Notifications: what reaches your Inbox and how\')"><i class="ti ti-bell"></i>Notifications</div>'
        +'<div class="gy-pkdiv"></div>'
        +'<div class="gy-pk" onclick="event.stopPropagation();gyDark()"><i class="ti ti-moon"></i>Toggle dark mode</div>'
        +'<div class="gy-pk" onclick="gyToast(\'Sign out\')"><i class="ti ti-logout"></i>Sign out</div>'
      +'</div>'
    +'</div>'

    +'<div class="snavgrip" id="snavgrip"></div>'
    +'</aside>'
  );

  window.gyScope = function(s){
    scope = s;
    try{ localStorage.setItem('gyScope', s); }catch(e){}
    var m = scopeMeta(s);
    var nm = document.getElementById('gyScName'); if(nm) nm.textContent = m.name;
    var ic = document.getElementById('gyScIcon'); if(ic){ ic.className = 'gy-wstile '+m.cls; ic.textContent = m.ini; }
    var nav = document.getElementById('gyScopeNav'); if(nav) nav.innerHTML = s==='portfolio'?pfPanel():progPanel();
    var pk = document.getElementById('gyPicker'); if(pk){ pk.innerHTML = pickerHtml(); pk.style.display='none'; }
    var dir = s==='portfolio' ? 'gy-anim-out' : 'gy-anim-in';
    [nav].forEach(function(e){ if(!e)return; e.classList.remove('gy-anim-in','gy-anim-out'); void e.offsetWidth; e.classList.add(dir); });
  };
  window.gyGoProg = function(){
    try{ localStorage.setItem('gyScope', 'programme'); }catch(e){}
    if(active==='overview'){ gyScope('programme'); var pk=document.getElementById('gyPicker'); if(pk)pk.style.display='none'; return; }
    location.href='programme-overview.html';
  };
  window.gyGoPortfolio = function(){
    try{ localStorage.setItem('gyScope', 'portfolio'); }catch(e){}
    if(active==='pf-overview'){ gyScope('portfolio'); return; }
    location.href='portfolio-overview.html';
  };
  window.gyPicker = function(){
    var p = document.getElementById('gyPicker'); if(!p) return;
    p.style.display = p.style.display==='none' ? 'block' : 'none';
  };
  window.gyWsMenu = function(){
    var m = document.getElementById('gyWsMenu'); if(!m) return;
    m.style.display = m.style.display==='none' ? 'block' : 'none';
  };
  window.gyUsMenu = function(){
    var m = document.getElementById('gyUsMenu'); if(!m) return;
    m.style.display = m.style.display==='none' ? 'block' : 'none';
  };
  window.gyDark = function(){
    var d = document.body.classList.toggle('gydark');
    var i = document.getElementById('gyDmIcon'); if(i) i.className = 'ti '+(d?'ti-sun':'ti-moon');
    try{ localStorage.setItem('gyDark', d?'1':'0'); }catch(e){}
  };
  /* North Star (advanced) vs Next steps (basic) POC view. The footer icon opens
     a small popup; picking a view persists it and reloads so the sidebar
     re-renders. Mode persists across pages via localStorage('gyMode'). */
  window.gyModeMenu = function(){
    var m = document.getElementById('gyModeMenu'); if(!m) return;
    m.style.display = m.style.display==='none' ? 'block' : 'none';
  };
  window.gySetMode = function(m){
    try{ localStorage.setItem('gyMode', m); }catch(e){}
    location.reload();
  };

  try{
    if(localStorage.getItem('gyDark')==='1'){
      document.body.classList.add('gydark');
      var di = document.getElementById('gyDmIcon'); if(di) di.className='ti ti-sun';
    }
  }catch(e){}

  document.addEventListener('click', function(e){
    var p = document.getElementById('gyPicker'), sw = document.getElementById('gySwitch');
    if(p && p.style.display!=='none' && sw && !sw.contains(e.target) && !p.contains(e.target)) p.style.display='none';
    var wm = document.getElementById('gyWsMenu'), wb = document.getElementById('gyWsBtn');
    if(wm && wm.style.display!=='none' && wb && !wb.contains(e.target) && !wm.contains(e.target)) wm.style.display='none';
    var um = document.getElementById('gyUsMenu'), ub = document.getElementById('gyUsBtn');
    if(um && um.style.display!=='none' && ub && !ub.contains(e.target) && !um.contains(e.target)) um.style.display='none';
    var mm = document.getElementById('gyModeMenu'), mb = document.getElementById('gyModeIcon');
    if(mm && mm.style.display!=='none' && mb && !mb.contains(e.target) && !mm.contains(e.target)) mm.style.display='none';
  });

  /* Sidebar width: persistent + identical across every page.
     Reads the shared 'gyNavW' width and wires the resize grip. Skipped in
     embed mode so the drawer's zero-width nav is never overridden. */
  try{
    if(!document.documentElement.classList.contains('embed')){
      var snav = document.getElementById('snav');
      var hidden = document.body.classList.contains('navhid') || (snav && snav.classList.contains('hid'));
      var saved = parseInt(localStorage.getItem('gyNavW')||'',10);
      if(saved && !hidden) document.body.style.setProperty('--nav', saved+'px');
      var grip = document.getElementById('snavgrip');
      if(grip && !grip.dataset.gyBound){
        grip.dataset.gyBound = '1';
        var drag = false;
        grip.addEventListener('mousedown', function(e){ drag=true; grip.classList.add('on'); document.body.style.userSelect='none'; e.preventDefault(); });
        window.addEventListener('mousemove', function(e){ if(!drag)return; var w=Math.min(420,Math.max(200,e.clientX)); document.body.style.setProperty('--nav', w+'px'); });
        window.addEventListener('mouseup', function(){ if(!drag)return; drag=false; grip.classList.remove('on'); document.body.style.userSelect=''; var w=parseInt(getComputedStyle(document.body).getPropertyValue('--nav'),10); if(w) localStorage.setItem('gyNavW', String(w)); });
      }
    }
  }catch(e){}

  /* ── Search modal ───────────────────────────────────────────────────────
     One box over everything the OS knows about: quick actions, destinations,
     workspaces and records. Cmd/Ctrl-K opens it, arrows move, Enter opens,
     Esc closes. Rows with a real page navigate; the rest toast. */
  var GY_SEARCH_ROWS = [
    ['Quick actions','ti-plus','Start a Workflow','Action','go:deliverables-landing.html'],
    ['Quick actions','ti-note','New meeting note','Action','toast:New meeting note: records the transcript and files it under the programme'],
    ['Quick actions','ti-file-text','Create a document','Action','toast:Create a document: a versioned document in this programme'],
    ['Quick actions','ti-businessplan','Log a deal','Action','toast:Log a deal: deals sit at Portfolio because they run across programmes'],
    ['Quick actions','ti-map-pin','Add a site','Action','toast:Add a site: a land parcel joins the programme it delivers for'],
    ['Quick actions','ti-user-plus','Invite someone','Action','toast:Invite people to the workspace'],

    ['Go to','ti-home','Home','Page','go:home.html'],
    ['Go to','ti-layout-dashboard','Programme overview','Page','go:programme-overview.html'],
    ['Go to','ti-layout-dashboard','Portfolio overview','Page','go:portfolio-overview.html'],
    ['Go to','ti-packages','Inventory','Page','go:inventory-overview.html'],
    ['Go to','ti-hierarchy-2','Workflows','Page','go:deliverables-landing.html'],
    ['Go to','ti-file-text','Documents','Page','go:documents-overview.html'],
    ['Go to','ti-note','Meeting notes','Page','go:meeting-notes.html'],
    ['Go to','ti-activity','Activity','Page','go:activity-overview.html'],
    ['Go to','ti-map-2','Market Map (Kwame)','Page','go:market-map-kwame.html'],
    ['Go to','ti-books','Hive Mind Library','Page','go:hive-mind-library.html'],

    ['Switch workspace','ti-building-bank','Portfolio','Workspace','go:portfolio-overview.html'],
    ['Switch workspace','ti-topology-star-3','Evenlode','Workspace','go:programme-overview.html'],
    ['Switch workspace','ti-topology-star-3','Spains Hall','Workspace','toast:Spains Hall is not in this prototype yet'],
    ['Switch workspace','ti-topology-star-3','Boothby','Workspace','toast:Boothby is not in this prototype yet'],

    ['Records','ti-hierarchy-2','Evenlode · Customer Demand Mapping','Workflow','go:demand-mapping-canvas-prototype.html'],
    ['Records','ti-file-search','Tender to Bid','Workflow','go:tender-to-bid-canvas-prototype.html'],
    ['Records','ti-note','Evenlode · Kick-off call notes','Meeting note','go:meeting-note-kickoff.html'],
    ['Records','ti-packages','Denton Reserve · BNG units','Inventory','go:inventory-denton-reserve.html'],
    ['Records','ti-packages','All BNG Portfolio','Inventory','go:inventory-bng-portfolio.html'],
    ['Records','ti-book','Ecosystem service rule books','Hive Mind','go:es-rule-book.html'],
    ['Records','ti-user','James Ruggles · Buyer contact','Person','toast:People are reached from a project, a note or a deal. No index page in this prototype.']
  ];

  function gySmRun(action){
    gySmClose();
    if(action.indexOf('go:')===0){ location.href = action.slice(3); return; }
    gyToast(action.slice(6));
  }
  function gySmRender(q){
    var list = document.getElementById('gySmList'); if(!list) return;
    q = (q||'').trim().toLowerCase();
    var rows = GY_SEARCH_ROWS.filter(function(r){
      return !q || (r[2]+' '+r[0]+' '+r[3]).toLowerCase().indexOf(q)>=0;
    });
    if(!rows.length){ list.innerHTML = '<div class="gy-smempty">Nothing matches that yet.</div>'; return; }
    var html = '', sec = '', i = 0;
    rows.forEach(function(r){
      if(r[0]!==sec){ sec = r[0]; html += '<div class="gy-smsec">'+sec+'</div>'; }
      html += '<div class="gy-smitem'+(i===0?' sel':'')+'" data-i="'+i+'" data-act="'+r[4].replace(/"/g,'&quot;')+'">'
        +'<i class="ti '+r[1]+'"></i><span class="gy-smnm">'+r[2]+'</span><span class="gy-smtype">'+r[3]+'</span></div>';
      i++;
    });
    list.innerHTML = html;
  }
  function gySmMove(d){
    var items = [].slice.call(document.querySelectorAll('#gySmList .gy-smitem'));
    if(!items.length) return;
    var cur = items.findIndex(function(e){ return e.classList.contains('sel'); });
    if(cur<0) cur = 0;
    items[cur].classList.remove('sel');
    var next = (cur + d + items.length) % items.length;
    items[next].classList.add('sel');
    items[next].scrollIntoView({block:'nearest'});
  }
  function gySmBuild(){
    if(document.getElementById('gySmOv')) return;
    var ov = document.createElement('div');
    ov.className = 'gy-smov'; ov.id = 'gySmOv';
    ov.innerHTML =
      '<div class="gy-smbox" id="gySmBox">'
      +'<div class="gy-smtop">'
        +'<i class="ti ti-search"></i>'
        +'<input class="gy-sminput" id="gySmIn" placeholder="Search workflows, documents, sites and inventory…" autocomplete="off">'
        +'<span class="gy-smask" onclick="gyToast(\'Ask the Hive Mind: put the question to what GY already knows\')">Ask the Hive Mind <span class="gy-kbd">Tab</span></span>'
      +'</div>'
      +'<div class="gy-smlist" id="gySmList"></div>'
      +'<div class="gy-smfoot">'
        +'<span><span class="gy-kbd">↑</span> <span class="gy-kbd">↓</span> Navigate</span>'
        +'<span><span class="gy-kbd">↵</span> Open</span>'
        +'<span><span class="gy-kbd">esc</span> Close</span>'
      +'</div>'
      +'</div>';
    document.body.appendChild(ov);
    ov.addEventListener('click', function(e){ if(e.target===ov) gySmClose(); });
    ov.addEventListener('mousemove', function(e){
      var it = e.target.closest && e.target.closest('.gy-smitem'); if(!it) return;
      var cur = document.querySelector('#gySmList .gy-smitem.sel');
      if(cur && cur!==it){ cur.classList.remove('sel'); it.classList.add('sel'); }
    });
    ov.addEventListener('click', function(e){
      var it = e.target.closest && e.target.closest('.gy-smitem');
      if(it) gySmRun(it.getAttribute('data-act'));
    });
    document.getElementById('gySmIn').addEventListener('input', function(){ gySmRender(this.value); });
  }
  window.gyOpenSearch = function(){
    gySmBuild();
    gySmRender('');
    var ov = document.getElementById('gySmOv'), inp = document.getElementById('gySmIn');
    ov.classList.add('open'); inp.value = ''; setTimeout(function(){ inp.focus(); }, 20);
  };
  window.gySmClose = function(){
    var ov = document.getElementById('gySmOv'); if(ov) ov.classList.remove('open');
  };
  document.addEventListener('keydown', function(e){
    var open = document.getElementById('gySmOv') && document.getElementById('gySmOv').classList.contains('open');
    if((e.metaKey||e.ctrlKey) && (e.key==='k'||e.key==='K')){ e.preventDefault(); open ? gySmClose() : gyOpenSearch(); return; }
    if(!open) return;
    if(e.key==='Escape'){ e.preventDefault(); gySmClose(); }
    else if(e.key==='ArrowDown'){ e.preventDefault(); gySmMove(1); }
    else if(e.key==='ArrowUp'){ e.preventDefault(); gySmMove(-1); }
    else if(e.key==='Tab'){ e.preventDefault(); gySmClose(); gyToast('Ask the Hive Mind: put the question to what GY already knows'); }
    else if(e.key==='Enter'){
      var sel = document.querySelector('#gySmList .gy-smitem.sel');
      if(sel){ e.preventDefault(); gySmRun(sel.getAttribute('data-act')); }
    }
  });

  /* ── Notifications pop-out ──────────────────────────────────────────────
     Anchored to the bell beside the search box. Two tabs: what happened to
     you, and what is waiting on you. Fixed position so the rail's overflow
     never clips it. */
  var GY_NOTIFS = [
    ['ti-checkup-list','#FAEEDA','#854F0B','Approval needed: send the questionnaire to James Ruggles','Evenlode · Customer Demand Mapping · 20m'],
    ['ti-at','#E6F1FB','#185FA5','Emily mentioned you on the catchment mapping layer','Evenlode · Documents · 2h'],
    ['ti-circle-check','#EAF3DE','#27500A','Lead Demand mapping finished its run','Spains Hall · Workflows · Yesterday'],
    ['ti-alert-triangle','#FAEEDA','#854F0B','Three BNG units are missing a vintage','Portfolio · Inventory · Yesterday']
  ];
  function gyNpTab(which){
    var body = document.getElementById('gyNpBody'); if(!body) return;
    [].slice.call(document.querySelectorAll('.gy-nptab')).forEach(function(t){
      t.classList.toggle('on', t.getAttribute('data-tab')===which);
    });
    if(which==='requests'){
      body.innerHTML = '<div class="gy-npempty"><i class="ti ti-inbox"></i><b>No requests</b>'
        +'<p>Access requests and sign-off asks from the team will show up here.</p></div>';
      return;
    }
    body.innerHTML = GY_NOTIFS.map(function(n){
      return '<div class="gy-npitem" onclick="gySmClose();gyNpHide();gyToast(\'This would open the item\')">'
        +'<span class="gy-npico" style="background:'+n[1]+';color:'+n[2]+'"><i class="ti '+n[0]+'"></i></span>'
        +'<span><span class="gy-nptitle">'+n[3]+'</span><span class="gy-npmeta">'+n[4]+'</span></span>'
      +'</div>';
    }).join('');
  }
  window.gyNpHide = function(){
    var p = document.getElementById('gyNpPop'); if(p) p.style.display = 'none';
  };
  window.gyNotifPop = function(){
    var p = document.getElementById('gyNpPop');
    if(!p){
      p = document.createElement('div');
      p.className = 'gy-nppop'; p.id = 'gyNpPop'; p.style.display = 'none';
      p.innerHTML =
        '<div class="gy-nphd">Notifications</div>'
        +'<div class="gy-nptabs">'
          +'<button class="gy-nptab on" data-tab="all" onclick="gyNpTab(\'all\')">Notifications ('+GY_NOTIFS.length+')</button>'
          +'<button class="gy-nptab" data-tab="requests" onclick="gyNpTab(\'requests\')">Requests (0)</button>'
        +'</div>'
        +'<div class="gy-nplist" id="gyNpBody"></div>'
        +'<div class="gy-npfoot" onclick="gyToast(\'Notification settings: what reaches you, and how\')">Notification settings</div>';
      document.body.appendChild(p);
      window.gyNpTab = gyNpTab;
      gyNpTab('all');
    }
    if(p.style.display==='block'){ p.style.display='none'; return; }
    var b = document.getElementById('gyNotifBtn'); if(!b) return;
    var r = b.getBoundingClientRect();
    p.style.display = 'block';
    p.style.top = Math.round(r.top) + 'px';
    p.style.left = Math.round(Math.min(r.right + 10, window.innerWidth - p.offsetWidth - 12)) + 'px';
  };
  document.addEventListener('click', function(e){
    var p = document.getElementById('gyNpPop'), b = document.getElementById('gyNotifBtn');
    if(p && p.style.display==='block' && b && !b.contains(e.target) && !p.contains(e.target)) p.style.display='none';
  });
  window.addEventListener('resize', function(){ gyNpHide(); });


  /* Ecosystem services as products. One icon and one colour per service, used
     wherever the service appears: the rail, the overviews, the inventory pages.
     Palette validated for colour-blind separation; the icon is the secondary
     encoding, so colour never carries identity on its own. */
  window.GY_ES = {
    bng: {name:'BNG units',          short:'BNG',      icon:'ti-butterfly', cls:'es-bng'},
    wcc: {name:'Woodland carbon',    short:'Carbon',   icon:'ti-trees',     cls:'es-wcc'},
    soc: {name:'Soil carbon',        short:'Soil',     icon:'ti-plant-2',  cls:'es-soc'},
    nut: {name:'Nutrient credits',   short:'Nutrient', icon:'ti-droplet',   cls:'es-nut'},
    nfm: {name:'Natural flood mgmt', short:'Flood',    icon:'ti-ripple',    cls:'es-nfm'}
  };
  window.gyEsTile = function(k, small){
    var e = GY_ES[k]; if(!e) return '';
    return '<span class="es-tile'+(small?' sm':'')+' '+e.cls+'"><i class="ti '+e.icon+'"></i></span>';
  };
  window.gyEsMeter = function(k, verified, available, sold){
    var e = GY_ES[k]; if(!e) return '';
    var tot = Math.max(verified, available + sold) || 1;
    var pend = Math.max(verified - available - sold, 0);
    function pc(n){ return (n/tot*100).toFixed(1)+'%'; }
    return '<div class="'+e.cls+'">'
      +'<div class="meter"><span class="m1" style="width:'+pc(sold)+'"></span>'
      +'<span class="m2" style="width:'+pc(available)+'"></span>'
      +'<span class="m3" style="width:'+pc(pend)+'"></span></div>'
      +'<div class="meterlab">'
        +'<span><i class="k" style="background:var(--esc)"></i>Sold <b>'+sold.toLocaleString()+'</b></span>'
        +'<span><i class="k" style="background:var(--esc);opacity:.34"></i>Available <b>'+available.toLocaleString()+'</b></span>'
        +(pend?'<span><i class="k" style="background:#DCD9D0"></i>Unallocated <b>'+pend.toLocaleString()+'</b></span>':'')
        +'<span style="margin-left:auto">of <b>'+verified.toLocaleString()+'</b> verified</span>'
      +'</div></div>';
  };


  /* ── Breadcrumbs ──────────────────────────────────────────────────────
     One table, one renderer, owned here for the same reason the rail CSS is:
     every page carried its own chain and they had drifted into four
     different roots for the same place.

     Shape: <altitude root> › <bucket> › <page>. The root is Portfolio at
     portfolio level and Portfolio › <workspace> inside a programme, so the
     breadcrumb states the full altitude. The page's own last crumb is never
     touched, so pages that set it from JS keep working. Spine pages (Home,
     To-dos) and the Hive Mind sit outside the altitudes and get no root.

     To add a page: one line in GY_CRUMB, keyed by filename. */
  var GY_CRUMB_HREF = {
    'Portfolio':'portfolio-overview.html',
    'Inventory':'inventory-overview.html',
    'Workflows':'deliverables-landing.html',
    'Documents':'documents-overview.html',
    'Meeting notes':'meeting-notes.html',
    'Hive Mind Library':'hive-mind-library.html',
    'Customer Demand Mapping':'demand-mapping-canvas-prototype.html',
    'Investor Q&A Log':'investor-qa-log-canvas-prototype.html'
  };
  var GY_PF_INV = 'inventory-portfolio-overview.html';

  /* alt: 'portfolio' | 'programme' | 'none'.  trail: buckets under the root. */
  var GY_CRUMB = {
    'home.html':                        {alt:'none'},
    'todos.html':                       {alt:'none'},
    'hive-mind-library.html':           {alt:'none'},
    'es-rule-book.html':                {alt:'none', trail:['Hive Mind Library','Rule books']},
    'es-rulebook.html':                 {alt:'none', trail:['Hive Mind Library','Rule books']},
    'carbon-rule-book.html':            {alt:'none', trail:['Hive Mind Library','Rule books']},

    'portfolio-overview.html':          {alt:'portfolio'},
    'portfolio-dashboard.html':         {alt:'portfolio'},
    'inventory-portfolio-overview.html':{alt:'portfolio'},
    'inventory-portfolio-dashboard.html':{alt:'portfolio', trail:['Inventory']},
    'inventory-bng-portfolio.html':     {alt:'portfolio', trail:['Inventory']},
    'inventory-wcc-portfolio.html':     {alt:'portfolio', trail:['Inventory']},
    'inventory-all.html':               {alt:'portfolio', trail:['Inventory']},
    'market-map-kwame.html':            {alt:'portfolio', trail:['Intelligence']},
    'outcome-engine.html':              {alt:'portfolio', trail:['Intelligence']},

    'programme-overview.html':          {alt:'programme'},
    'inventory-overview.html':          {alt:'programme'},
    'inventory-programme.html':         {alt:'programme', trail:['Inventory']},
    'inventory-bng-programme.html':     {alt:'programme', trail:['Inventory']},
    'inventory-wcc-programme.html':     {alt:'programme', trail:['Inventory']},
    'inventory-soc-programme.html':     {alt:'programme', trail:['Inventory']},
    'inventory-denton-reserve.html':    {alt:'programme', trail:['Inventory']},
    'projects.html':                    {alt:'programme'},
    'sites.html':                       {alt:'programme'},
    'deliverables-landing.html':        {alt:'programme'},
    'documents-overview.html':          {alt:'programme'},
    'document.html':                    {alt:'programme', trail:['Documents']},
    'meeting-notes.html':               {alt:'programme'},
    'meeting-notes-landing.html':       {alt:'programme'},
    'meeting-note-kickoff.html':        {alt:'programme', trail:['Meeting notes']},
    'meeting-note-buyer-review.html':   {alt:'programme', trail:['Meeting notes']},
    'activity-overview.html':           {alt:'programme'},

    'customer-demand-mapping-v2-canvas.html':     {alt:'programme', trail:['Workflows']},
    'demand-mapping-canvas-prototype.html':       {alt:'programme', trail:['Workflows']},
    'demand-mapping-text-view-canvas.html':       {alt:'programme', trail:['Workflows']},
    'lead-demand-mapping-canvas.html':            {alt:'programme', trail:['Workflows']},
    'lead-supply-demand-mapping-canvas.html':     {alt:'programme', trail:['Workflows']},
    'investor-qa-log-canvas-prototype.html':      {alt:'programme', trail:['Workflows']},
    'tender-to-bid-canvas-prototype.html':        {alt:'programme', trail:['Workflows']},
    'upper-dee-supply-demand-mapping-canvas.html':{alt:'programme', trail:['Workflows']},
    'upper-dee-canvas-list-sidebar.html':         {alt:'programme', trail:['Workflows']},
    'upper-dee-simple-drawer-canvas.html':        {alt:'programme', trail:['Workflows']},
    'upper-dee-executor-steps-canvas.html':       {alt:'programme', trail:['Workflows']},
    'upper-dee-deliverable-page.html':            {alt:'programme', trail:['Workflows']},
    'workflow-experiment-supply-demand-mapping-canvas.html':{alt:'programme', trail:['Workflows']},
    'artefact-editor.html':             {alt:'programme', trail:['Workflows','Customer Demand Mapping']},
    'questionnaire-editor.html':        {alt:'programme', trail:['Workflows','Customer Demand Mapping']},
    'demand-mapping-intake-poc.html':   {alt:'programme', trail:['Workflows','Customer Demand Mapping']},
    'investor-qa-pack-example.html':    {alt:'programme', trail:['Workflows','Investor Q&A Log']}
  };

  function gyCrumbTrail(){
    var file = (location.pathname.split('/').pop() || '').toLowerCase();
    var def = GY_CRUMB[file];
    if(!def) return null;
    var out = [];
    if(def.alt === 'portfolio' || def.alt === 'programme'){
      out.push(['Portfolio', 'portfolio-overview.html']);
      if(def.alt === 'programme') out.push([meta.name, 'programme-overview.html']);
    }
    (def.trail || []).forEach(function(t){
      var href = GY_CRUMB_HREF[t] || '';
      if(t === 'Inventory' && def.alt === 'portfolio') href = GY_PF_INV;
      out.push([t, href]);
    });
    return out;
  }

  function gyCrumbNode(label, href, cls){
    var el = document.createElement('span');
    el.className = cls + ' gycr';
    el.textContent = label;
    if(href){ el.style.cursor = 'pointer'; el.onclick = function(){ location.href = href; }; }
    return el;
  }
  function gySepNode(){
    var s = document.createElement('span');
    s.className = 'sep gycr-sep';
    s.textContent = '›';
    return s;
  }

  function gyRenderCrumbs(){
    var anc = gyCrumbTrail();
    if(!anc) return;

    /* Three container shapes are in the POC:
         .topbar > .crumbs > .cr        current
         .topbar > .crumb/.sep/.title   mid
         .row1   > .crumb/.sep/.title   older
       Only the ancestors are rebuilt; the page's own last crumb stays put. */
    var box = document.querySelector('.crumbs') || document.querySelector('.topbar') || document.querySelector('.row1');
    if(!box) return;
    var isNew = box.classList.contains('crumbs');

    var leaf;
    if(isNew){
      var crs = box.querySelectorAll('.cr');
      leaf = crs.length ? crs[crs.length - 1] : null;
      if(leaf) leaf.classList.add('cur');
    } else {
      leaf = box.querySelector('.title');
    }
    if(!leaf) return;
    leaf.classList.add('gycr-leaf');

    /* the leaf can sit inside a wrapper (the rule book's dropdown, say), so
       insert against whichever ancestor is the container's own child */
    var anchor = leaf;
    while(anchor && anchor.parentNode !== box) anchor = anchor.parentNode;
    if(!anchor) return;

    var kids = Array.prototype.slice.call(box.children);
    for(var i = 0; i < kids.length; i++){
      var k = kids[i];
      if(k === anchor) break;
      var cl = k.classList;
      var bare = k.tagName === 'SPAN' && !k.className && /^[›>/]$/.test((k.textContent || '').trim());
      /* decorative page icon: some topbars carried one before the first crumb
         and some did not, so the bar never lined up. Drop it everywhere. */
      var icon = k.tagName === 'I' && cl && cl.contains('ti');
      if((cl && (cl.contains('crumb') || cl.contains('cr') || cl.contains('sep'))) || bare || icon) box.removeChild(k);
    }

    anc.forEach(function(a){
      box.insertBefore(gyCrumbNode(a[0], a[1], isNew ? 'cr' : 'crumb'), anchor);
      box.insertBefore(gySepNode(), anchor);
    });
  }


  /* ── Action menus ───────────────────────────────────────────────────────
     One dropdown component for the page-level bulk operations that the
     Manage wireframe put on cards. Inventory, Projects and Sites all call
     it, so the idiom cannot drift page to page.
     rows: '-' a divider, ['label','Text'] a section label, or
     ['ti-icon','Label', 'toast text' | 'go:page.html' | function]. */
  var gyMOpen = null;
  function gyMClose(){
    if(gyMOpen && gyMOpen.parentNode) gyMOpen.parentNode.removeChild(gyMOpen);
    gyMOpen = null;
  }
  window.gyMenuClose = gyMClose;
  window.gyMenu = function(anchor, rows){
    var same = gyMOpen && gyMOpen._anc === anchor;
    gyMClose();
    if(same) return;
    var pop = document.createElement('div');
    pop.className = 'gy-mpop';
    pop._anc = anchor;
    rows.forEach(function(r){
      if(r === '-'){
        var d = document.createElement('div'); d.className = 'gy-mdiv'; pop.appendChild(d); return;
      }
      if(r[0] === 'label'){
        var l = document.createElement('div'); l.className = 'gy-mlbl'; l.textContent = r[1]; pop.appendChild(l); return;
      }
      var it = document.createElement('div');
      it.className = 'gy-mitem';
      it.innerHTML = '<i class="ti ' + r[0] + '"></i>';
      it.appendChild(document.createTextNode(r[1]));
      it.onclick = function(e){
        e.stopPropagation();
        gyMClose();
        var a = r[2];
        if(typeof a === 'function') a();
        else if(a.indexOf('go:') === 0) location.href = a.slice(3);
        else if(window.gyToast) gyToast(a);
      };
      pop.appendChild(it);
    });
    document.body.appendChild(pop);
    var b = anchor.getBoundingClientRect();
    var w = pop.offsetWidth, h = pop.offsetHeight;
    var left = (b.left + w > window.innerWidth - 12) ? b.right - w : b.left;
    var top  = b.bottom + 6;
    if(top + h > window.innerHeight - 8) top = Math.max(8, b.top - h - 6);
    pop.style.left = Math.max(8, left) + 'px';
    pop.style.top  = top + 'px';
    gyMOpen = pop;
    setTimeout(function(){ document.addEventListener('click', onDoc); }, 0);
    function onDoc(){ document.removeEventListener('click', onDoc); gyMClose(); }
  };
  /* ── gyBar: the top right action bar ────────────────────────────────────
     Call it once per page, after the markup exists:

       gyBar('abar', {
         search:  {placeholder:'Search projects', oninput:render},   // or {onclick:openSearch}
         filters: [['Stage',[['ti-circle-dot','All stages','all'],['ti-pencil','Draft','draft']]]],
         buttons: [{icon:'ti-layout-list', label:'All inventory', go:'inventory-all.html'}],
         actions: PROJ_ACTIONS,                                      // rows for gyMenu
         primary: {icon:'ti-plus', label:'Add project', onclick:fn}, // or onclick:'toast text'
         onfilter: function(group, value){ ... }
       });

     Button order is fixed: Search, Filters, page buttons, Actions, primary.
     A search with a placeholder gets its own field under the page header;
     a search with onclick just calls that (a drawer, say). Filters keeps one
     value per group and shows how many groups are off their default. */
  window.gyBar = function(host, cfg){
    var el = (typeof host === 'string') ? document.getElementById(host) : host;
    if(!el) return null;
    cfg = cfg || {};
    el.classList.add('abar');
    var bar = {cfg:cfg, filter:{}, search:null};

    function btn(cls, html, fn){
      var b=document.createElement('button');
      b.className='abtn'+(cls?' '+cls:''); b.innerHTML=html;
      b.onclick=function(e){ e.stopPropagation(); fn(b,e); };
      el.appendChild(b); return b;
    }
    function ico(i){ return i ? '<i class="ti '+i+'"></i>' : ''; }
    function run(a, b){
      if(typeof a === 'function') return a(b);
      if(typeof a === 'string'){
        if(a.indexOf('go:')===0) location.href = a.slice(3);
        else if(window.gyToast) gyToast(a);
        else if(window.toast) toast(a);
      }
    }

    /* search */
    if(cfg.search){
      var sb = btn('', ico('ti-search')+'<span>Search</span>', function(b){
        closePop();
        if(cfg.search.onclick) return run(cfg.search.onclick);
        var on = !bar.search.classList.contains('on');
        bar.search.classList.toggle('on', on);
        b.classList.toggle('on', on);
        var inp = bar.search.querySelector('input');
        if(on) inp.focus();
        else { inp.value=''; if(cfg.search.oninput) cfg.search.oninput(''); }
      });
      if(!cfg.search.onclick){
        var box=document.createElement('div');
        box.className='asearch';
        box.innerHTML='<i class="ti ti-search"></i><input placeholder="'+(cfg.search.placeholder||'Search')+'">';
        var head = el.closest('.phead') || el.parentNode;
        head.parentNode.insertBefore(box, head.nextSibling);
        box.querySelector('input').addEventListener('input', function(){
          if(cfg.search.oninput) cfg.search.oninput(this.value);
        });
        bar.search = box;
      }
      bar.searchBtn = sb;
    }

    /* filters */
    var pop=null, fbtn=null;
    function closePop(){ if(pop&&pop.classList.contains('on')){ pop.classList.remove('on'); fbtn.classList.remove('on'); } }
    if(cfg.filters && cfg.filters.length){
      pop=document.createElement('div'); pop.className='apop';
      cfg.filters.forEach(function(g,gi){
        if(gi){ var d=document.createElement('div'); d.className='adiv'; pop.appendChild(d); }
        var lab=document.createElement('div'); lab.className='ag'; lab.textContent=g[0]; pop.appendChild(lab);
        bar.filter[g[0]] = g[1][0][2];
        g[1].forEach(function(r,ri){
          var row=document.createElement('div');
          row.className='ar'+(ri===0?' on':'');
          row.setAttribute('data-g', g[0]);
          row.innerHTML=ico(r[0])+r[1]+'<i class="ti ti-check ck"></i>';
          row.onclick=function(e){
            e.stopPropagation();
            /* one value per group */
            [].forEach.call(pop.querySelectorAll('.ar[data-g="'+g[0]+'"]'), function(x){ x.classList.remove('on'); });
            row.classList.add('on');
            bar.filter[g[0]]=r[2];
            paintCount();
            if(cfg.onfilter) cfg.onfilter(g[0], r[2]);
            else run('Filter: '+g[0].toLowerCase()+' '+String(r[1]).toLowerCase());
          };
          pop.appendChild(row);
        });
      });
      fbtn = btn('', ico('ti-adjustments-horizontal')+'Filters<span class="cnt"></span>', function(b){
        b.classList.toggle('on', pop.classList.toggle('on'));
      });
      el.appendChild(pop);
      bar.pop = pop;
    }
    function paintCount(){
      if(!fbtn) return;
      var n=0;
      cfg.filters.forEach(function(g){ if(bar.filter[g[0]] !== g[1][0][2]) n++; });
      fbtn.querySelector('.cnt').textContent = n ? String(n) : '';
    }

    /* page buttons, then actions, then the primary */
    (cfg.buttons||[]).forEach(function(b){
      btn('', ico(b.icon)+b.label, function(el2){ closePop(); run(b.go ? 'go:'+b.go : b.onclick, el2); });
    });
    if(cfg.actions) btn('', 'Actions <i class="ti ti-chevron-down"></i>', function(b){
      closePop(); gyMenu(b, cfg.actions);
    });
    if(cfg.primary) btn('primary', ico(cfg.primary.icon||'ti-plus')+cfg.primary.label, function(b){
      closePop(); run(cfg.primary.onclick, b);
    });

    document.addEventListener('click', function(e){
      if(pop && !e.target.closest('.apop')) closePop();
    });
    return bar;
  };

  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') gyMClose(); });
  window.addEventListener('resize', gyMClose);

  if(document.readyState === 'loading') window.addEventListener('DOMContentLoaded', gyRenderCrumbs);
  else gyRenderCrumbs();


})();
