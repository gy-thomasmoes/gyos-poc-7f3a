/* gy-blueprints.js - every Blueprint and its Deliverables across the portfolio.
   Feeds the Portfolio Deliverables matrix (deliverables-portfolio.html):
   rows are Blueprints, columns are programmes, a cell is that programme's
   Deliverable built from that Blueprint.
   Evenlode cells come from gy-docs.js (the real Evenlode set); EV adds only
   what gy-docs does not carry (a decision waiting, a block, a pinned version).
   The other programmes are illustrative until they exist in the prototype.

   Cell code:  F final  |  N not started  |  R:3/9 running  |  D:3/9 decision
   waiting  |  B:3/9 blocked  |  ''  not used.  Add @1.2 for the pinned
   Blueprint version when it is behind the current one. */
(function(){

  var PROGRAMMES = [
    {k:'ev', name:'Evenlode',     ini:'EV', cls:'mxt-ev', phase:'Build',    href:'programme-overview.html'},
    {k:'bo', name:'Boothby',      ini:'BO', cls:'mxt-bo', phase:'Start'},
    {k:'sh', name:'Spains Hall',  ini:'SH', cls:'mxt-sh', phase:'Plan'},
    {k:'wa', name:'The Wash',     ini:'WA', cls:'mxt-wa', phase:'Plan'},
    {k:'ot', name:'Ock & Thame',  ini:'OT', cls:'mxt-ot', phase:'Discover'}
  ];

  var DEPTS = [
    {k:'prog',    name:'Programme-wide', c:'#8F8C84'},
    {k:'advisory',name:'Advisory',       c:'#639922'},
    {k:'capital', name:'Capital',        c:'#378ADD'},
    {k:'trade',   name:'Trade',          c:'#B75A40'}
  ];

  /* id, Blueprint name, department, current version, gy-docs id for Evenlode,
     cells for the other programmes */
  var BLUEPRINTS = [
    ['sdm',    'Customer Demand Mapping',   'prog',    '1.4', 'sdm',    {bo:'R:12/16@1.2', sh:'D:5/16',  wa:'R:3/16',  ot:'N'}],
    ['comm',   'Commercial Strategy',       'prog',    '0.3', 'comm',   {bo:'N'}],
    ['mra',    'Market Readiness',          'prog',    '1.0', 'mra',    {bo:'R:4/8',   sh:'R:2/8',  wa:'N'}],
    ['esv',    'Ecosystem Services Valuation','prog',  '1.1', 'esv',    {bo:'R:6/9'}],
    ['fm',     'Financial Model',           'prog',    '2.0', 'fm',     {bo:'D:7/10@1.6', sh:'N'}],
    ['bfp',    'Blended Finance Plan',      'prog',    '1.2', 'bfp',    {bo:'B:4/18'}],
    ['bid',    'Tender to Bid',             'prog',    '0.1', 'bid',    {bo:'F', sh:'F', wa:'R:6/12', ot:'D:3/12'}],
    ['cip',    'Catchment Investment Plan', 'prog',    '0.1', '',       {ot:'N'}],
    ['vis',    'Project Narrative',         'prog',    '1.0', 'vis',    {bo:'F', sh:'F', wa:'R:2/5', ot:'R:1/5'}],
    ['sow',    'Scope of Work',             'prog',    '1.0', 'sow',    {bo:'F', sh:'F', wa:'F', ot:'R:3/6'}],
    ['gdpr',   'Data Gathering',            'prog',    '1.1', 'gdpr',   {bo:'F', sh:'R:5/7', wa:'N', ot:'N'}],
    ['dmp',    'Data Management',           'prog',    '1.0', 'dmp',    {bo:'R:4/6', sh:'N'}],

    ['gov',    'Governance Setup',          'advisory','1.0', 'gov',    {bo:'F', sh:'R:3/6', wa:'N'}],

    ['iqa',    'Investor Q&amp;A Log',      'capital', '1.3', 'iqa',    {bo:'R:5/12@1.1'}],
    ['im',     'Information Memorandum',    'capital', '0.9', 'im',     {}],
    ['ifm',    'Investor Financial Model',  'capital', '1.0', 'ifm',    {bo:'N'}],
    ['dsm',    'Deal Structuring',          'capital', '1.0', 'dsm',    {bo:'R:3/7'}],
    ['chot',   'Capital Heads of Terms',    'capital', '1.0', 'chot',   {}],

    ['thot',   'Trade Heads of Terms',      'trade',   '1.1', 'thot',   {bo:'R:2/5'}],
    ['bdd',    'Buyer Due Diligence',       'trade',   '1.0', 'bdd',    {bo:'D:4/7'}],
    ['quote',  'Unit Quote',                'trade',   '2.1', 'quote',  {bo:'F', sh:'R:1/4@1.9'}],
    ['pdd',    'Unit Certification',        'trade',   '1.2', 'pdd',    {bo:'R:7/12'}],
    ['bngreg', 'Unit Registration',         'trade',   '1.0', 'bngreg', {bo:'F'}],
    ['bngpro', 'Technical Prospectus',      'trade',   '1.0', 'bngpro', {bo:'R:2/5'}],
    ['cfm',    'Carbon Financial Model',    'trade',   '1.0', 'cfm',    {}],
    ['repplan','Reporting Plan',            'trade',   '0.5', 'repplan',{}]
  ];

  /* what gy-docs.js does not carry for Evenlode */
  var EV = {sdm:'D', thot:'B', esv:'@1.0'};

  /* Lead per Blueprint where gy-docs has none, or where the settled model
     overrides it (Emily is Lead of Customer Demand Mapping, 5 Oct 2026). */
  var LEAD = {sdm:'Emily Norton', bid:'Millie Gray'};

  function parse(code, cur){
    var c = {kind:'none', done:0, steps:0, pin:cur};
    if(!code) return c;
    var at = code.indexOf('@');
    if(at >= 0){ c.pin = code.slice(at+1); code = code.slice(0, at); }
    var k = code.charAt(0);
    c.kind = {F:'final', N:'notstarted', R:'running', D:'decision', B:'blocked'}[k] || 'none';
    var m = code.match(/(\d+)\/(\d+)/);
    if(m){ c.done = +m[1]; c.steps = +m[2]; }
    return c;
  }

  function evCell(b){
    var x = null, D = window.GYD;
    if(D && b.ev) for(var i=0;i<D.items.length;i++) if(D.items[i].id===b.ev){ x = D.items[i]; break; }
    if(!x) return {kind:'none', done:0, steps:0, pin:b.ver};
    var c = {done:x.done||0, steps:x.steps||0, pin:b.ver, href:x.href||'', lead:x.by};
    if(x.state==='Not started' || !c.done) c.kind = 'notstarted';
    else if(c.done >= c.steps) c.kind = 'final';
    else c.kind = 'running';
    var o = EV[b.id] || '';
    if(o.indexOf('@') >= 0) c.pin = o.split('@')[1];
    if(o.charAt(0)==='D') c.kind = 'decision';
    if(o.charAt(0)==='B') c.kind = 'blocked';
    return c;
  }

  function rows(){
    return BLUEPRINTS.map(function(r){
      var b = {id:r[0], name:r[1], dept:r[2], ver:r[3], ev:r[4], cells:{}};
      var ev = evCell(b), lead = LEAD[b.id] || ev.lead || '';
      PROGRAMMES.forEach(function(p){
        var c = p.k==='ev' ? ev : parse(r[5][p.k], b.ver);
        c.lead = lead;
        c.behind = c.kind!=='none' && c.kind!=='final' && c.pin !== b.ver;
        b.cells[p.k] = c;
      });
      return b;
    });
  }

  window.GYB = {programmes:PROGRAMMES, depts:DEPTS, rows:rows};
})();
