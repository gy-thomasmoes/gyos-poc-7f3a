/* gy-docs.js - the canonical document set for the Evenlode programme.
   Department is a field, not a folder: Documents is one list, filtered.
   Anything identical across programmes lives in the Hive Mind Library and is
   deliberately absent here. Anything about the whole portfolio lives in
   Portfolio Records. */
(function(){

  var DEPTS = [
    {k:'prog',    name:'Programme-wide', bg:'var(--graybg)',  fg:'var(--grayd)'},
    {k:'nature',  name:'Nature Projects',bg:'var(--greenbg)', fg:'var(--greend)'},
    {k:'capital', name:'Capital',        bg:'var(--bluebg)',  fg:'var(--blued)'},
    {k:'trade',   name:'Trade',          bg:'#F6E7F0',        fg:'#8A3E6B'}
  ];

  /* kind: deliverable = document + template + workflow + to-dos. document = just the document.
     es: the ecosystem service it belongs to, where it is product-specific.
     attach: what else it hangs off, for deliverables that belong to a deal or to inventory. */
  var ITEMS = [
    /* ---- Programme-wide ---- */
    {id:'sdm',   name:'Customer Demand Mapping',   kind:'deliverable', dept:'prog', wf:'Demand Mapping',            steps:16, done:8,  state:'8 of 16',  upd:'Wed 09:05', href:'document.html?mode=deliverable', todos:'sdm-ev'},
    {id:'esv',   name:'Ecosystem Services Valuation',  kind:'deliverable', dept:'prog', wf:'ES Valuation',              steps:9,  done:3,  state:'3 of 9',   upd:'11 Sep'},
    {id:'dmp',   name:'Data Management Plan',          kind:'deliverable', dept:'prog', wf:'Data Management',           steps:6,  done:2,  state:'2 of 6',   upd:'9 Sep'},
    {id:'comm',  name:'Commercial Strategy',           kind:'deliverable', dept:'prog', wf:'Commercial Strategy',       steps:11, done:0,  state:'Not started', upd:'2 Sep', needs:'Customer Demand Mapping'},
    {id:'mra',   name:'Market Readiness Assessment',   kind:'deliverable', dept:'prog', wf:'Market Readiness',          steps:8,  done:0,  state:'Not started', upd:'1 Sep'},
    {id:'fm',    name:'Financial Model',               kind:'deliverable', dept:'prog', wf:'Financial Model',           steps:10, done:0,  state:'Not started', upd:'1 Sep', needs:'Ecosystem Services Valuation'},
    {id:'bfp',   name:'Blended Finance Plan',          kind:'deliverable', dept:'prog', wf:'Blended Finance Plan',      steps:18, done:0,  state:'Not started', upd:'1 Sep', needs:'Financial Model'},
    {id:'bid',   name:'Bid / Tender submission',       kind:'deliverable', dept:'prog', wf:'Tender to Bid',             steps:12, done:12, state:'Final',    upd:'20 Jun'},
    {id:'vis',   name:'Vision and Mission Statement',  kind:'deliverable', dept:'prog', wf:'Project Narrative',         steps:5,  done:5,  state:'Final',    upd:'4 Jul'},
    {id:'sow',   name:'Scope of work',                 kind:'deliverable', dept:'prog', wf:'Scope of Work',             steps:6,  done:6,  state:'Final',    upd:'28 Jun'},
    {id:'gdpr',  name:'Data Gathering Plan (GDPR)',    kind:'deliverable', dept:'prog', wf:'Data Gathering',            steps:7,  done:7,  state:'Final',    upd:'1 Jul'},

    /* ---- Nature Projects ---- */
    {id:'gov',   name:'Governance structure deck',     kind:'deliverable', dept:'nature', wf:'Governance Setup',        steps:6,  done:6,  state:'Final',    upd:'12 Jul'},

    /* ---- Capital ---- */
    {id:'iqa',   name:'Investor Q&amp;A pack',         kind:'deliverable', dept:'capital', wf:'Investor Q&amp;A Log',   steps:12, done:0,  state:'Not started', upd:'1 Jul', href:'investor-qa-pack-example.html', todos:'iqa-ev'},
    {id:'im',    name:'Information Memorandum',        kind:'deliverable', dept:'capital', wf:'Information Memorandum', steps:14, done:0,  state:'Not started', upd:'1 Sep', needs:'Blended Finance Plan'},
    {id:'ifm',   name:'Investor grade Financial Model',kind:'deliverable', dept:'capital', wf:'Investor Financial Model',steps:9, done:0,  state:'Not started', upd:'1 Sep', needs:'Financial Model'},
    {id:'dsm',   name:'Deal Structuring Memo',         kind:'deliverable', dept:'capital', wf:'Deal Structuring',       steps:7,  done:0,  state:'Not started', upd:'1 Sep', attach:'Deal'},
    {id:'chot',  name:'Capital: Heads of Terms',       kind:'deliverable', dept:'capital', wf:'Capital Heads of Terms', steps:5,  done:0,  state:'Not started', upd:'1 Sep', attach:'Deal'},

    /* ---- Trade ---- */
    {id:'thot',  name:'Heads of Terms',                kind:'deliverable', dept:'trade', es:'bng', wf:'Trade Heads of Terms', steps:5, done:1, state:'1 of 5', upd:'8 Sep',  attach:'Deal'},
    {id:'bdd',   name:'Buyer DD Q&amp;A Log',          kind:'deliverable', dept:'trade', es:'bng', wf:'Buyer Due Diligence',  steps:7, done:2, state:'2 of 7', upd:'10 Sep', attach:'Deal'},
    {id:'quote', name:'BNG Quote',                     kind:'deliverable', dept:'trade', es:'bng', wf:'Unit Quote',           steps:4, done:3, state:'3 of 4', upd:'Wed',    attach:'Deal'},
    {id:'pdd',   name:'Unit certification / Carbon PDD',kind:'deliverable',dept:'trade', es:'wcc', wf:'Unit Certification',   steps:12,done:4, state:'4 of 12',upd:'5 Sep',  attach:'Inventory'},
    {id:'bngreg',name:'BNG Unit registration',         kind:'deliverable', dept:'trade', es:'bng', wf:'Unit Registration',    steps:6, done:6, state:'Final',  upd:'22 Aug', attach:'Inventory'},
    {id:'bngpro',name:'BNG technical prospectus',      kind:'deliverable', dept:'trade', es:'bng', wf:'Technical Prospectus', steps:5, done:5, state:'Final',  upd:'15 Aug'},
    {id:'cfm',   name:'Carbon Financial Model',        kind:'deliverable', dept:'trade', es:'wcc', wf:'Carbon Financial Model',steps:8,done:0, state:'Not started', upd:'1 Sep'},
    {id:'repplan',name:'Reporting Plan to the projects',kind:'deliverable',dept:'trade', wf:'Reporting Plan',                 steps:6, done:0, state:'Not started', upd:'1 Sep'},

    /* ---- plain documents: inputs, no template, workflow or to-dos ---- */
    {id:'emp',   name:'estate_management_plan.pdf',    kind:'document', dept:'prog',  src:'Questionnaire', wf:'Demand Mapping', upd:'2 Jul',      href:'document.html?mode=plain'},
    {id:'sfi',   name:'sfi_agreement_2024.pdf',        kind:'document', dept:'prog',  src:'Questionnaire', wf:'Demand Mapping', upd:'3 Jul',      href:'document.html?mode=plain'},
    {id:'tenure',name:'tenure_map.pdf',                kind:'document', dept:'prog',  src:'Email reply',   wf:'Demand Mapping', upd:'Wed 08:52',  href:'document.html?mode=plain'},
    {id:'peat',  name:'peat_depth_survey.xlsx',        kind:'document', dept:'nature', src:'Contractor',   wf:'Demand Mapping', upd:'6 Sep'},
    {id:'bngcalc',name:'bng_metric_4.0.xlsx',          kind:'document', dept:'trade',  src:'Registry',     wf:'Unit Registration', es:'bng', upd:'20 Aug'}
  ];

  window.GYD = {
    depts:DEPTS,
    items:ITEMS,
    dept:function(k){ for(var i=0;i<DEPTS.length;i++) if(DEPTS[i].k===k) return DEPTS[i]; return DEPTS[0]; },
    deliverables:function(){ return ITEMS.filter(function(x){return x.kind==='deliverable';}); },
    documents:function(){ return ITEMS.filter(function(x){return x.kind==='document';}); },
    /* deliverables whose workflow has not been run yet: drafts on the Workflows page */
    drafts:function(){ return ITEMS.filter(function(x){ return x.kind==='deliverable' && x.state==='Not started'; }); }
  };
})();
