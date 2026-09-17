/* gy-docs.js - the canonical document set for the Evenlode programme.
   Documents are browsed as a folder tree: department at the top level, topic
   folders beneath it. Department is still a field on every item, so the old
   filters keep working; the folder path is the field the browser reads.
   Anything identical across programmes lives in the Hive Mind Library and is
   deliberately absent here. Anything about the whole portfolio lives in
   Portfolio Records. */
(function(){

  var TODAY = '2026-09-17';

  var DEPTS = [
    {k:'prog',    name:'Programme-wide', bg:'var(--graybg)',  fg:'var(--grayd)'},
    {k:'nature',  name:'Nature Projects',bg:'var(--greenbg)', fg:'var(--greend)'},
    {k:'capital', name:'Capital',        bg:'var(--bluebg)',  fg:'var(--blued)'},
    {k:'trade',   name:'Trade',          bg:'#F6E7F0',        fg:'#8A3E6B'}
  ];

  /* The folder tree. Top level mirrors the departments, subfolders are topics.
     An item sits in exactly one folder, given by its p: path. */
  var FOLDERS = [
    {k:'prog', name:'Programme-wide', dept:'prog', kids:[
      {k:'strategy', name:'Strategy'},
      {k:'demand',   name:'Demand'},
      {k:'finance',  name:'Valuation and finance'},
      {k:'data',     name:'Data and governance'}
    ]},
    {k:'nature', name:'Nature Projects', dept:'nature', kids:[
      {k:'evidence', name:'Site evidence'}
    ]},
    {k:'capital', name:'Capital', dept:'capital', kids:[
      {k:'raise', name:'Raise'},
      {k:'deals', name:'Deals'}
    ]},
    {k:'trade', name:'Trade', dept:'trade', kids:[
      {k:'bng',       name:'BNG'},
      {k:'wcc',       name:'Woodland carbon'},
      {k:'reporting', name:'Reporting'}
    ]}
  ];

  /* the same people the to-do store uses, so an owner looks identical everywhere */
  var PEOPLE = {
    'Caitlin Ciceri':{ini:'CC',c:'#1D9E75'},
    'Emily Norton'  :{ini:'EN',c:'#378ADD'},
    'Harry Fox'     :{ini:'HF',c:'#EF9F27'},
    'Izzie Bell'    :{ini:'IB',c:'#7F77DD'},
    'Millie Gray'   :{ini:'MG',c:'#D4537E'},
    'Josh Read'     :{ini:'JR',c:'#639922'}
  };

  /* kind: deliverable = document + template + workflow + to-dos. document = just the document.
     es: the ecosystem service it belongs to, where it is product-specific.
     attach: what else it hangs off, for deliverables that belong to a deal or to inventory.
     p: folder path. by: owner. on: ISO date behind the upd label, for the Modified filter. */
  var ITEMS = [
    /* ---- Programme-wide ---- */
    {id:'sdm',   name:'Customer Demand Mapping',   kind:'deliverable', dept:'prog', p:['prog','demand'],   by:'Caitlin Ciceri', wf:'Demand Mapping',            steps:16, done:8,  state:'8 of 16',  upd:'Wed 09:05', on:'2026-09-16', href:'document.html?mode=deliverable', todos:'sdm-ev'},
    {id:'esv',   name:'Ecosystem Services Valuation',  kind:'deliverable', dept:'prog', p:['prog','finance'],  by:'Harry Fox',      wf:'ES Valuation',              steps:9,  done:3,  state:'3 of 9',   upd:'11 Sep', on:'2026-09-11'},
    {id:'dmp',   name:'Data Management Plan',          kind:'deliverable', dept:'prog', p:['prog','data'],     by:'Harry Fox',      wf:'Data Management',           steps:6,  done:2,  state:'2 of 6',   upd:'9 Sep',  on:'2026-09-09'},
    {id:'comm',  name:'Commercial Strategy',           kind:'deliverable', dept:'prog', p:['prog','strategy'], by:'Millie Gray',    wf:'Commercial Strategy',       steps:11, done:0,  state:'Not started', upd:'2 Sep', on:'2026-09-02', needs:'Customer Demand Mapping'},
    {id:'mra',   name:'Market Readiness Assessment',   kind:'deliverable', dept:'prog', p:['prog','strategy'], by:'Millie Gray',    wf:'Market Readiness',          steps:8,  done:0,  state:'Not started', upd:'1 Sep', on:'2026-09-01'},
    {id:'fm',    name:'Financial Model',               kind:'deliverable', dept:'prog', p:['prog','finance'],  by:'Josh Read',      wf:'Financial Model',           steps:10, done:0,  state:'Not started', upd:'1 Sep', on:'2026-09-01', needs:'Ecosystem Services Valuation'},
    {id:'bfp',   name:'Blended Finance Plan',          kind:'deliverable', dept:'prog', p:['prog','finance'],  by:'Josh Read',      wf:'Blended Finance Plan',      steps:18, done:0,  state:'Not started', upd:'1 Sep', on:'2026-09-01', needs:'Financial Model'},
    {id:'bid',   name:'Bid / Tender submission',       kind:'deliverable', dept:'prog', p:['prog','strategy'], by:'Millie Gray',    wf:'Tender to Bid',             steps:12, done:12, state:'Final',    upd:'20 Jun', on:'2026-06-20'},
    {id:'vis',   name:'Vision and Mission Statement',  kind:'deliverable', dept:'prog', p:['prog','strategy'], by:'Emily Norton',   wf:'Project Narrative',         steps:5,  done:5,  state:'Final',    upd:'4 Jul',  on:'2026-07-04'},
    {id:'sow',   name:'Scope of work',                 kind:'deliverable', dept:'prog', p:['prog','strategy'], by:'Emily Norton',   wf:'Scope of Work',             steps:6,  done:6,  state:'Final',    upd:'28 Jun', on:'2026-06-28'},
    {id:'gdpr',  name:'Data Gathering Plan (GDPR)',    kind:'deliverable', dept:'prog', p:['prog','data'],     by:'Harry Fox',      wf:'Data Gathering',            steps:7,  done:7,  state:'Final',    upd:'1 Jul',  on:'2026-07-01'},

    /* ---- Nature Projects ---- */
    {id:'gov',   name:'Governance structure deck',     kind:'deliverable', dept:'nature', p:['nature'],        by:'Emily Norton',   wf:'Governance Setup',          steps:6,  done:6,  state:'Final',    upd:'12 Jul', on:'2026-07-12'},

    /* ---- Capital ---- */
    {id:'iqa',   name:'Investor Q&amp;A pack',         kind:'deliverable', dept:'capital', p:['capital','raise'], by:'Millie Gray', wf:'Investor Q&amp;A Log',      steps:12, done:0,  state:'Not started', upd:'1 Jul', on:'2026-07-01', href:'investor-qa-pack-example.html', todos:'iqa-ev'},
    {id:'im',    name:'Information Memorandum',        kind:'deliverable', dept:'capital', p:['capital','raise'], by:'Millie Gray', wf:'Information Memorandum',    steps:14, done:0,  state:'Not started', upd:'1 Sep', on:'2026-09-01', needs:'Blended Finance Plan'},
    {id:'ifm',   name:'Investor grade Financial Model',kind:'deliverable', dept:'capital', p:['capital','raise'], by:'Josh Read',   wf:'Investor Financial Model',  steps:9,  done:0,  state:'Not started', upd:'1 Sep', on:'2026-09-01', needs:'Financial Model'},
    {id:'dsm',   name:'Deal Structuring Memo',         kind:'deliverable', dept:'capital', p:['capital','deals'], by:'Josh Read',   wf:'Deal Structuring',          steps:7,  done:0,  state:'Not started', upd:'1 Sep', on:'2026-09-01', attach:'Deal'},
    {id:'chot',  name:'Capital: Heads of Terms',       kind:'deliverable', dept:'capital', p:['capital','deals'], by:'Millie Gray', wf:'Capital Heads of Terms',    steps:5,  done:0,  state:'Not started', upd:'1 Sep', on:'2026-09-01', attach:'Deal'},

    /* ---- Trade ---- */
    {id:'thot',  name:'Heads of Terms',                kind:'deliverable', dept:'trade', p:['trade','bng'], es:'bng', by:'Izzie Bell', wf:'Trade Heads of Terms', steps:5, done:1, state:'1 of 5', upd:'8 Sep',  on:'2026-09-08', attach:'Deal'},
    {id:'bdd',   name:'Buyer DD Q&amp;A Log',          kind:'deliverable', dept:'trade', p:['trade','bng'], es:'bng', by:'Izzie Bell', wf:'Buyer Due Diligence',  steps:7, done:2, state:'2 of 7', upd:'10 Sep', on:'2026-09-10', attach:'Deal'},
    {id:'quote', name:'BNG Quote',                     kind:'deliverable', dept:'trade', p:['trade','bng'], es:'bng', by:'Izzie Bell', wf:'Unit Quote',           steps:4, done:3, state:'3 of 4', upd:'Wed',    on:'2026-09-16', attach:'Deal'},
    {id:'pdd',   name:'Unit certification / Carbon PDD',kind:'deliverable',dept:'trade', p:['trade','wcc'], es:'wcc', by:'Harry Fox',  wf:'Unit Certification',   steps:12,done:4, state:'4 of 12',upd:'5 Sep',  on:'2026-09-05', attach:'Inventory'},
    {id:'bngreg',name:'BNG Unit registration',         kind:'deliverable', dept:'trade', p:['trade','bng'], es:'bng', by:'Izzie Bell', wf:'Unit Registration',    steps:6, done:6, state:'Final',  upd:'22 Aug', on:'2026-08-22', attach:'Inventory'},
    {id:'bngpro',name:'BNG technical prospectus',      kind:'deliverable', dept:'trade', p:['trade','bng'], es:'bng', by:'Izzie Bell', wf:'Technical Prospectus', steps:5, done:5, state:'Final',  upd:'15 Aug', on:'2026-08-15'},
    {id:'cfm',   name:'Carbon Financial Model',        kind:'deliverable', dept:'trade', p:['trade','wcc'], es:'wcc', by:'Josh Read',  wf:'Carbon Financial Model',steps:8,done:0, state:'Not started', upd:'1 Sep', on:'2026-09-01'},
    {id:'repplan',name:'Reporting Plan to the projects',kind:'deliverable',dept:'trade', p:['trade','reporting'],     by:'Emily Norton',wf:'Reporting Plan',       steps:6, done:0, state:'Not started', upd:'1 Sep', on:'2026-09-01'},

    /* ---- plain documents: inputs, no template, workflow or to-dos ---- */
    {id:'emp',   name:'estate_management_plan.pdf',    kind:'document', dept:'prog',  p:['prog','demand'],    by:'Caitlin Ciceri', src:'Questionnaire', wf:'Demand Mapping', upd:'2 Jul',     on:'2026-07-02', href:'document.html?mode=plain'},
    {id:'sfi',   name:'sfi_agreement_2024.pdf',        kind:'document', dept:'prog',  p:['prog','demand'],    by:'Caitlin Ciceri', src:'Questionnaire', wf:'Demand Mapping', upd:'3 Jul',     on:'2026-07-03', href:'document.html?mode=plain'},
    {id:'tenure',name:'tenure_map.pdf',                kind:'document', dept:'prog',  p:['prog','demand'],    by:'Caitlin Ciceri', src:'Email reply',   wf:'Demand Mapping', upd:'Wed 08:52', on:'2026-09-16', href:'document.html?mode=plain'},
    {id:'peat',  name:'peat_depth_survey.xlsx',        kind:'document', dept:'nature', p:['nature','evidence'],by:'Emily Norton',  src:'Contractor',    wf:'Demand Mapping', upd:'6 Sep',     on:'2026-09-06'},
    {id:'bngcalc',name:'bng_metric_4.0.xlsx',          kind:'document', dept:'trade',  p:['trade','bng'],      by:'Izzie Bell',    src:'Registry',      wf:'Unit Registration', es:'bng', upd:'20 Aug', on:'2026-08-20'}
  ];

  function node(path){
    var list = FOLDERS, n = null;
    for(var i=0;i<path.length;i++){
      n = null;
      for(var j=0;j<list.length;j++) if(list[j].k===path[i]){ n=list[j]; break; }
      if(!n) return null;
      list = n.kids || [];
    }
    return n;
  }

  window.GYD = {
    depts:DEPTS,
    items:ITEMS,
    folders:FOLDERS,
    people:PEOPLE,
    today:TODAY,
    dept:function(k){ for(var i=0;i<DEPTS.length;i++) if(DEPTS[i].k===k) return DEPTS[i]; return DEPTS[0]; },
    person:function(n){ return PEOPLE[n] || {ini:'?',c:'#9C9A92'}; },
    /* the folder at a path, and the folders directly under it */
    node:node,
    children:function(path){ return path.length ? ((node(path)||{}).kids||[]) : FOLDERS; },
    /* items sitting exactly in this folder; deep:true walks the subfolders too */
    inFolder:function(path, deep){
      return ITEMS.filter(function(x){
        var p = x.p || [];
        if(deep){
          for(var i=0;i<path.length;i++) if(p[i]!==path[i]) return false;
          return true;
        }
        if(p.length!==path.length) return false;
        for(var k=0;k<path.length;k++) if(p[k]!==path[k]) return false;
        return true;
      });
    },
    /* every owner in use, in the order people first appear */
    owners:function(){
      var seen={}, out=[];
      ITEMS.forEach(function(x){ if(x.by && !seen[x.by]){ seen[x.by]=1; out.push(x.by); } });
      return out;
    },
    deliverables:function(){ return ITEMS.filter(function(x){return x.kind==='deliverable';}); },
    documents:function(){ return ITEMS.filter(function(x){return x.kind==='document';}); },
    /* deliverables whose workflow has not been run yet: drafts on the Workflows page */
    drafts:function(){ return ITEMS.filter(function(x){ return x.kind==='deliverable' && x.state==='Not started'; }); }
  };
})();
