/* ── GY shared sidebar navigation ────────────────────────────────────────
   One nav, every POC. Include where the aside.snav used to be:

     script: window.GYNAV={active:'demand-mapping', arts:'demand'};
     then:   script src="gy-nav.js"

   config:
     active : 'library' | 'deliverables' | 'demand-mapping' | 'investor-qa'
              | 'meeting-notes' | 'documents' | 'home' | '' (nothing highlighted)
     arts   : 'demand' | 'investor' | null   → which Tools list to show
     artActive : label of the active artefact item (optional)

   Structure (v6 · one OS, altitude as scope):
     Personal spine (Home, Inbox) → a single scope switcher (picker:
     Portfolio + Programmes) whose links sit nested beneath it. The
     switcher is the only way to move between altitudes.
       Programme : Overview, Inventory, Workflows, Reports · Documents,
                   Meeting Notes, Activity
       Portfolio : Overview, Inventory, Trade, Capital · Customers, Reports
     Hive Mind Library and the profile are pinned as full-width footer rows.
     A subtle dark-mode toggle themes the sidebar. Scope persists via
     localStorage('gyScope'); dark via localStorage('gyDark').
──────────────────────────────────────────────────────────────────────── */
(function(){
  var cfg = window.GYNAV || {};
  var active = cfg.active || '';
  function on(k){ return active===k ? ' on' : ''; }
  var invActive = active && active.indexOf('inv-')===0;

  window.gyToast = function(m){ if(window.toast) toast(m); };
  function gyStore(){ try{ return JSON.parse(localStorage.getItem('gyOpen')||'{}'); }catch(e){ return {}; } }
  function gyIsOpen(key,def){ var o=gyStore(); return key in o ? !!o[key] : def; }
  function gyCls(key,def){ return gyIsOpen(key,def) ? '' : ' closed'; }
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
    ['demand-mapping','Demand Mapping',"location.href='demand-mapping-canvas-prototype.html'"],
    ['investor-qa','Investor Q&A Log',"location.href='investor-qa-log-canvas-prototype.html'"],
    ['market-readiness','Market Readiness',"gyToast('Market Readiness Assessment is not in this prototype yet')"],
    ['financial-model','Financial Model',"gyToast('Financial Model is not in this prototype yet')"],
    ['commercial-strategy','Commercial Strategy',"gyToast('Commercial Strategy is not in this prototype yet')"]
  ];
  var delActive = ['demand-mapping','investor-qa','market-readiness','financial-model','commercial-strategy'].indexOf(active)>=0;
  /* Workflows accordion: open (respecting stored state) only when on a workflow page;
     always collapsed on first load of the programme layer / Overview. */
  var delCls = delActive ? gyCls('delSub', true) : ' closed';

  var ARTSETS = {
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
    investor: [
      ['Q&A Protocol',"gyToast('Artefact editors are not wired for this Workflow yet')"],
      ['Q&A Log template',"gyToast('Artefact editors are not wired for this Workflow yet')"],
      ['Answer Library',"gyToast('Artefact editors are not wired for this Workflow yet')"],
      ['ELR Investor FAQs',"gyToast('Artefact editors are not wired for this Workflow yet')"],
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
    '<div class="ssub'+gyCls('invSub',false)+'" id="invSub">'
    +'<div class="sitem" onclick="gyToast(\'Units: the stock list per ecosystem service\')">Units</div>'
    +'<div class="sitem" onclick="gyToast(\'Ecosystem services: the catalogue of unit types, rules and market context\')">Ecosystem services</div>'
    +'</div>';
  var esOpen = (active==='inv-bng'||active==='inv-wcc');
  var INV_PF =
    '<div class="ssub'+gyCls('pfInvSub',invActive)+'" id="pfInvSub">'
    +'<div class="sitem'+on('inv-portfolio')+'"'+(active==='inv-portfolio'?'':' onclick="location.href=\'inventory-portfolio-dashboard.html\'"')+'>Portfolio Dashboard</div>'
    +'<div class="sitem muted" onclick="gyToast(\'Search Inventory is not in this prototype yet\')">Search Inventory</div>'
    +'<div class="sitem'+on('inv-all')+'"'+(active==='inv-all'?'':' onclick="location.href=\'inventory-all.html\'"')+'>All Inventory</div>'
    +'<div class="sitem" onclick="gyTgl(\'esArr\',\'esSub\')">Ecosystem Services <i class="ti ti-chevron-down sarr'+gyCls('esSub',esOpen)+'" id="esArr" onclick="event.stopPropagation();gyTgl(\'esArr\',\'esSub\')"></i></div>'
    +'<div class="ssub ssub2'+gyCls('esSub',esOpen)+'" id="esSub">'
      +'<div class="sitem'+on('inv-bng')+'"'+(active==='inv-bng'?'':' onclick="location.href=\'inventory-bng-portfolio.html\'"')+'>All BNG Portfolio</div>'
      +'<div class="sitem'+on('inv-wcc')+'"'+(active==='inv-wcc'?'':' onclick="location.href=\'inventory-wcc-portfolio.html\'"')+'>All Woodland Carbon</div>'
    +'</div>'
    +'<div class="sitem" onclick="gyTgl(\'invProgArr\',\'invProgSub\')">Programmes <i class="ti ti-chevron-down sarr'+gyCls('invProgSub',active==='inv-denton')+'" id="invProgArr" onclick="event.stopPropagation();gyTgl(\'invProgArr\',\'invProgSub\')"></i></div>'
    +'<div class="ssub ssub2'+gyCls('invProgSub',active==='inv-denton')+'" id="invProgSub">'
      +'<div class="sitem'+on('inv-denton')+'"'+(active==='inv-denton'?'':' onclick="location.href=\'inventory-denton-reserve.html\'"')+'>Denton Reserve</div>'
      +'<div class="sitem" onclick="gyToast(\'ELR inventory is not in this prototype yet\')">ELR</div>'
      +'<div class="sitem" onclick="gyToast(\'Spains Hall Estate inventory is not in this prototype yet\')">Spains Hall Estate</div>'
      +'<div class="sitem" onclick="gyToast(\'Wendling Beck inventory is not in this prototype yet\')">Wendling Beck</div>'
    +'</div>'
    +'</div>';

  /* Shared items - referenced by BOTH the advanced portfolio panel and the
     basic panel, so any edit here propagates to both. */
  var ITEM_INV_PF =
    '<div class="sitem" onclick="gyTgl(\'pfInvArr\',\'pfInvSub\')"><i class="ti ti-packages"></i> Inventory <i class="ti ti-chevron-down sarr'+gyCls('pfInvSub',invActive)+'" id="pfInvArr" onclick="event.stopPropagation();gyTgl(\'pfInvArr\',\'pfInvSub\')"></i></div>'
    +INV_PF;
  var ITEM_MARKETMAP =
    '<div class="sitem'+on('market-map')+'"'+(active==='market-map'?'':' onclick="location.href=\'market-map-kwame.html\'"')+'><i class="ti ti-map-2"></i> Market Map (Kwame)</div>';
  var ITEM_GENIE =
    '<div class="sitem" onclick="gyToast(\'Ask the data (Genie): natural-language questions over the data platform, not in this prototype yet\')"><i class="ti ti-sparkles"></i> Ask the data (Genie)</div>';
  var ITEM_WORKFLOWS =
    '<div class="sitem'+(active==='deliverables'||delActive?' on':'')+'"'+(active==='deliverables'?'':' onclick="location.href=\'deliverables-landing.html\'"')+'><i class="ti ti-hierarchy-2"></i> Workflows <i class="ti ti-chevron-down sarr'+delCls+'" id="delArr" onclick="event.stopPropagation();gyTgl(\'delArr\',\'delSub\')"></i></div>'
    +'<div class="ssub'+delCls+'" id="delSub">'+rows(DELIVERABLES)+artsHtml+'</div>';

  /* Basic POC: slimmed first-steps view, with bundle titles above the links.
     Market · Intelligence · Manage, showing Inventory, the two live Intelligence
     tools, and Workflows. No personal spine, no scope switcher, no programmes. */
  function basicPanel(){
    return ''
    +'<div class="gy-grp">Market</div>'
    +ITEM_INV_PF
    +'<div class="gy-grp">Intelligence</div>'
    +ITEM_MARKETMAP
    +ITEM_GENIE
    +'<div class="gy-grp">Manage</div>'
    +ITEM_WORKFLOWS;
  }

  function progPanel(){
    return ''
    +'<div class="sitem'+on('overview')+'"'+(active==='overview'?'':' onclick="location.href=\'programme-overview.html\'"')+'><i class="ti ti-layout-dashboard"></i> Overview</div>'
    +'<div class="gy-grp">Market</div>'
    +'<div class="sitem'+on('prog-inventory')+'"'+(active==='prog-inventory'?'':' onclick="location.href=\'inventory-programme.html\'"')+'><i class="ti ti-packages"></i> Inventory</div>'
    +'<div class="gy-grp">Records</div>'
    +'<div class="sitem'+on('documents')+'" onclick="location.href=\'documents-overview.html\'"><i class="ti ti-file-text"></i> Documents <span class="scount" id="cntDocs"></span></div>'
    +'<div class="sitem'+on('meeting-notes')+'" onclick="location.href=\'meeting-notes-landing.html\'"><i class="ti ti-note"></i> Meeting Notes <span class="scount" id="cntNotes"></span></div>'
    +'<div class="sitem" onclick="gyToast(\'People: the stakeholders on this programme · landowners, agents, buyers, partners\')"><i class="ti ti-users"></i> People</div>'
    +'<div class="sitem" onclick="gyToast(\'Activity: a timeline of what has happened across this programme\')"><i class="ti ti-activity"></i> Activity</div>'
    +'<div class="gy-grp">Manage</div>'
    +ITEM_WORKFLOWS
    +'<div class="sitem" onclick="gyToast(\'Reports: programme reporting and insights\')"><i class="ti ti-chart-bar"></i> Reports</div>';
  }
  function pfPanel(){
    return ''
    +'<div class="sitem'+on('pf-overview')+'"'+(active==='pf-overview'?'':' onclick="location.href=\'portfolio-overview.html\'"')+'><i class="ti ti-layout-dashboard"></i> Overview</div>'
    +'<div class="gy-grp">Market</div>'
    +ITEM_INV_PF
    +'<div class="sitem" onclick="gyToast(\'Deals: the deal pipeline across programmes\')"><i class="ti ti-businessplan"></i> Deals</div>'
    +'<div class="sitem" onclick="gyToast(\'Customers: buyers and landowner clients across programmes\')"><i class="ti ti-users"></i> Customers</div>'
    +'<div class="gy-grp">Intelligence</div>'
    +ITEM_MARKETMAP
    +'<div class="sitem'+on('outcome-engine')+'"'+(active==='outcome-engine'?'':' onclick="location.href=\'outcome-engine.html\'"')+'><i class="ti ti-flask"></i> Outcome Engine (I2O)</div>'
    +ITEM_GENIE
    +'<div class="gy-grp">Manage</div>'
    +'<div class="sitem" onclick="gyToast(\'Workflows: cross-programme, portfolio-level workflows live here\')"><i class="ti ti-hierarchy-2"></i> Workflows</div>'
    +'<div class="sitem" onclick="gyToast(\'Reports: portfolio reporting and insights\')"><i class="ti ti-chart-bar"></i> Reports</div>';
  }
  function scopeMeta(s){
    return s==='portfolio'
      ? {eye:'Portfolio', name:'Portfolio', ic:'ti-building-bank'}
      : {eye:'Programme', name:'Evenlode', ic:'ti-topology-star-3'};
  }
  function pickerHtml(){
    var s = scope;
    function ck(x){ return s===x ? '<i class="ti ti-check gy-ck"></i>' : ''; }
    var progs = '<div class="gy-pk" onclick="gyGoProg()"><i class="ti ti-topology-star-3"></i>Evenlode'+ck('programme')+'</div>'
      +'<div class="gy-pk" onclick="gyToast(\'Spains Hall is not in this prototype yet\')"><i class="ti ti-topology-star-3"></i>Spains Hall</div>'
      +'<div class="gy-pk" onclick="gyToast(\'Boothby is not in this prototype yet\')"><i class="ti ti-topology-star-3"></i>Boothby</div>';
    /* portfolio: descend into a programme · programme: switch sibling (back row handles up) */
    return s==='portfolio'
      ? '<div class="gy-pkhead">Go to programme</div>'+progs
      : '<div class="gy-pkhead">Programmes</div>'+progs;
  }
  function backHtml(){
    return scope==='portfolio' ? ''
      : '<div class="gy-back" onclick="gyGoPortfolio()"><i class="ti ti-chevron-left"></i> Portfolio</div>';
  }

  var scope = 'programme';
  try{ scope = localStorage.getItem('gyScope') || 'programme'; }catch(e){}
  var mode = 'advanced';
  try{ mode = localStorage.getItem('gyMode') || 'advanced'; }catch(e){}
  var invActive = active && active.indexOf('inv-')===0;
  if(active==='market-map' || active==='outcome-engine' || active==='pf-overview' || active==='pf-reports' || invActive) scope='portfolio';
  else if(active && active!=='library' && active!=='home' && active!=='inbox' && scope==='portfolio') scope='programme';
  var meta = scopeMeta(scope);

  var CSS =
    '.gy-eyebrow{font-size:12px;color:#9C9A92;padding:16px 10px 6px}'
   +'.gy-grp{font-size:12px;color:#9C9A92;padding:14px 10px 5px}'
   +'body.gydark .gy-grp{color:#8A877F}'
   +'.gy-back{display:flex;align-items:center;gap:11px;padding:8px 10px;border-radius:9px;font-size:15px;color:#6B6A64;cursor:pointer;margin-top:2px}'
   +'.gy-back i{font-size:17px;color:#9C9A92}'
   +'.gy-back:hover{background:#F3F2EE;color:#1F1F1D}'
   +'body.gydark .gy-back{color:#B5B2AB}'
   +'body.gydark .gy-back i{color:#8A877F}'
   +'body.gydark .gy-back:hover{background:#26252A;color:#ECEAE4}'
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
   +'body.gydark .gy-eyebrow{color:#8A877F}'
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
   +'body.gydark .sdiv{background:#2E2D31}';

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

    /* personal spine - advanced only */
    +(mode==='advanced'
      ? '<div class="sitem'+on('home')+'"'+(active==='home'?'':' onclick="location.href=\'home.html\'"')+'><i class="ti ti-home"></i> Home</div>'
        +'<div class="sitem" onclick="gyToast(\'Inbox: notifications, approvals and to-dos, triaged in one place\')"><i class="ti ti-inbox"></i> Inbox <span class="scount" id="cntTodos"></span></div>'
      : '')

    /* scope switcher - advanced only (the one way to move between altitudes) */
    +(mode==='advanced'
      ? '<div id="gyBack">'+backHtml()+'</div>'
        +'<div class="gy-eyebrow" id="gyEye">'+meta.eye+'</div>'
        +'<div style="position:relative">'
          +'<div class="gy-switch" id="gySwitch" onclick="gyPicker()">'
            +'<i class="ti '+meta.ic+'" id="gyScIcon"></i>'
            +'<span id="gyScName">'+meta.name+'</span>'
            +'<i class="ti ti-selector" style="margin-left:auto;font-size:15px;color:#9C9A92"></i>'
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
        +'<span style="width:26px;height:26px;border-radius:50%;background:#E6F1FB;color:#185FA5;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:11px;flex:none">TM</span>'
        +'Thomas'
        +'<span class="gy-fend">'
          +'<span class="gy-modewrap">'
            +'<i class="ti ti-stack-2" id="gyModeIcon" onclick="event.stopPropagation();gyModeMenu()" title="Switch view" aria-label="Switch between North Star and Simple version"></i>'
          +'</span>'
          +'<i class="ti ti-moon" id="gyDmIcon" onclick="event.stopPropagation();gyDark()" title="Toggle dark mode" aria-label="Toggle dark mode"></i>'
          +'<i class="ti ti-settings"></i>'
        +'</span>'
      +'</div>'
      +'<div class="gy-modemenu" id="gyModeMenu" style="display:none">'
        +'<div class="gy-pkhead">View</div>'
        +'<div class="gy-pk" onclick="event.stopPropagation();gySetMode(\'advanced\')"><span>North Star version</span>'+(mode==='advanced'?'<i class="ti ti-check gy-ck"></i>':'')+'</div>'
        +'<div class="gy-pk" onclick="event.stopPropagation();gySetMode(\'basic\')"><span>Simple version</span>'+(mode==='basic'?'<i class="ti ti-check gy-ck"></i>':'')+'</div>'
      +'</div>'
      +'<div class="gy-usmenu" id="gyUsMenu" style="display:none">'
        +'<div class="gy-wstop">'
          +'<span style="width:30px;height:30px;border-radius:50%;background:#E6F1FB;color:#185FA5;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:12px;flex:none">TM</span>'
          +'<span style="min-width:0"><span class="gy-wsname">Thomas Moes</span><span class="gy-ussub">thomas.moes@greatyellow.earth</span></span>'
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
    var eye = document.getElementById('gyEye'); if(eye) eye.textContent = m.eye;
    var nm = document.getElementById('gyScName'); if(nm) nm.textContent = m.name;
    var ic = document.getElementById('gyScIcon'); if(ic) ic.className = 'ti '+m.ic;
    var nav = document.getElementById('gyScopeNav'); if(nav) nav.innerHTML = s==='portfolio'?pfPanel():progPanel();
    var bk = document.getElementById('gyBack'); if(bk) bk.innerHTML = backHtml();
    var pk = document.getElementById('gyPicker'); if(pk){ pk.innerHTML = pickerHtml(); pk.style.display='none'; }
    var dir = s==='portfolio' ? 'gy-anim-out' : 'gy-anim-in';
    [nav,bk].forEach(function(e){ if(!e)return; e.classList.remove('gy-anim-in','gy-anim-out'); void e.offsetWidth; e.classList.add(dir); });
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
})();
