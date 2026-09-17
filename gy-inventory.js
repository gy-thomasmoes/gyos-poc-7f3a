/* gy-inventory.js - the Inventory overview figures for the programme: the
   pipeline per ecosystem service, how much of what is sellable sits in open
   deals, and the oversell risk per specific type or vintage.

   Available comes from gy-projects.js so this file can never disagree with the
   Projects page. Reserved, Sold and Carbon's registered tranche are earlier
   phases that have left project availability, so they are held here.
   Oversell risk splits each type three ways: units committed in deals against
   reserved inventory, units committed in deals against unreserved inventory,
   and units in no deal. The middle number is the exposure. */
(function(){

  /* units and value that are no longer in a Project's availability */
  var HISTORIC = {
    bng: {reserved:{u:90,  v:'£38k'}, sold:{u:120, v:'£52k'}, registered:null},
    wcc: {reserved:{u:110, v:'£33k'}, sold:{u:85,  v:'£26k'}, registered:{u:240, v:'£72k'}},
    soc: {reserved:{u:0,   v:''},     sold:{u:0,   v:''},     registered:null}
  };

  var DEALS = {
    bng: {open:6, inDeals:120, unreserved:{u:50, deals:2}, reserved:{u:70, deals:4}},
    wcc: {open:4, inDeals:75,  unreserved:{u:24, deals:1}, reserved:{u:51, deals:3}},
    soc: {open:0, inDeals:0,   unreserved:{u:0,  deals:0}, reserved:{u:0,  deals:0}}
  };

  /* [label, in deals against reserved, in deals against unreserved, in no deal] */
  var RISK = {
    bng: [
      ['Lowland meadow',                 34, 41, 30],
      ['Lowland calcareous grassland',   22, 38, 46],
      ['Mixed scrub',                    18, 30, 58],
      ['Broadleaved woodland',           26, 22, 64],
      ['Cover crops',                    14, 26, 72],
      ['Hedgerow',                       12, 18, 58],
      ['Watercourse',                     8, 14, 44],
      ['Modified grassland',              6, 11, 53]
    ],
    wcc: [
      ['2024 (PIU)', 20, 12, 28],
      ['2029 (PIU)', 15, 10, 45],
      ['2029 (WCU)', 10,  8, 42],
      ['2034 (WCU)',  4,  6, 58],
      ['2039 (WCU)',  2,  4, 66],
      ['2044 (WCU)',  0,  2, 48]
    ],
    soc: [
      ['Cropland',  0, 0, 96],
      ['Pasture',   0, 0, 72],
      ['Grassland', 0, 0, 42]
    ]
  };

  /* The inventory line items behind the table on inventory-programme.html.
     Each row is a batch of units of one type in one availability state. The
     per-service totals reconcile to the pipeline above, so the table and the
     dashboard can never disagree.
     [programme, es, availability, specific type or vintage, units, area ha, site,
      distinctiveness, condition, broad habitat, habitat id] */
  var ITEMS = [
    ['Evenlode','bng','Available','Lowland meadow',              105, 12.4,'Wychwood Edge Farm','High','Good',      'Grassland','WE-01'],
    ['Evenlode','bng','Available','Lowland calcareous grassland',106, 11.8,'Bruern Estate',     'High','Moderate',  'Grassland','BE-02'],
    ['Evenlode','bng','Available','Mixed scrub',                 106,  9.2,'Wychwood Edge Farm','Medium','Good',    'Heathland and shrub','WE-02'],
    ['Evenlode','bng','Available','Broadleaved woodland',        108, 10.6,'Coldron Mill',      'High','Moderate',  'Woodland','CM-01'],
    ['Evenlode','bng','Reserved', 'Cover crops',                  52,  6.8,'Ascott Farm, Kingham','Low','Poor',     'Cropland','AF-03'],
    ['Evenlode','bng','Reserved', 'Hedgerow',                     38,  2.1,'Bruern Estate',     'Medium','Good',    'Hedgerow','BE-03'],
    ['Evenlode','bng','Sold',     'Watercourse',                  66,  3.4,'Coldron Mill',      'High','Good',      'Watercourse','CM-02'],
    ['Evenlode','bng','Sold',     'Modified grassland',           54,  7.9,'Ascott Farm, Kingham','Low','Moderate', 'Grassland','AF-01'],
    ['Evenlode','bng','Projected','Lowland meadow',              240, 22.6,'Ascott Farm, Kingham','High','Poor',    'Grassland','AF-02'],
    ['Evenlode','bng','Projected','Cover crops',                 120, 11.3,'Fifield Manor Farm','Low','Poor',       'Cropland','FM-01'],
    ['Evenlode','bng','Projected','Mixed scrub',                 100,  7.1,'Fifield Manor Farm','Medium','Poor',    'Heathland and shrub','FM-02'],

    ['Evenlode','wcc','Available','2024 (WCU)', 130, 18.2,'Charlbury Down','','','',''],
    ['Evenlode','wcc','Available','2029 (WCU)', 110, 15.4,'Charlbury Down','','','',''],
    ['Evenlode','wcc','Reserved', '2029 (PIU)', 110, 14.1,'Bruern Estate', '','','',''],
    ['Evenlode','wcc','Sold',     '2024 (WCU)',  85, 11.0,'Bruern Estate', '','','',''],
    ['Evenlode','wcc','Projected','2034 (PIU)', 145, 19.6,'Bruern Estate', '','','',''],
    ['Evenlode','wcc','Projected','2039 (PIU)', 210, 24.8,'Charlbury Down','','','',''],

    ['Evenlode','soc','Projected','Cropland', 120, 12.2,'Charlbury Down','','','',''],
    ['Evenlode','soc','Projected','Pasture',   90,  9.4,'Bruern Estate', '','','',''],

    ['Spains Hall','bng','Projected','Floodplain grazing marsh', 210, 26.4,'Spains Hall Estate','High','Moderate','Grassland','SH-01'],
    ['Spains Hall','bng','Projected','Mixed scrub',              120, 11.9,'Spains Hall Estate','Medium','Poor','Heathland and shrub','SH-02'],
    ['Spains Hall','wcc','Projected','2032 (PIU)',               180, 21.7,'Spains Hall Estate','','','',''],
    ['Spains Hall','soc','Projected','Cropland',                 110, 12.8,'Spains Hall Estate','','','','']
  ];
  var LPA='West Oxfordshire DC', NCA='Cotswolds', LNRS='Oxfordshire';

  function proj(es){ return (window.GY_PROJECTS||[]).filter(function(p){return p.es===es;}); }
  function sumMoney(a,b){
    function n(x){ var m=/£([\d.]+)k/.exec(x||''); return m?parseFloat(m[1]):0; }
    var t=n(a)+n(b); return t ? '£'+Math.round(t)+'k' : '';
  }
  function money(list){
    var t = list.reduce(function(s,p){
      var m = /£([\d.]+)k/.exec(p.value||''); return s + (m ? parseFloat(m[1]) : 0); },0);
    return t ? '£'+Math.round(t)+'k' : '';
  }
  function plannedMoney(list){
    var t = list.reduce(function(s,p){
      var m = /£([\d.]+)k/.exec(p.planned||''); return s + (m ? parseFloat(m[1]) : 0); },0);
    return t ? '£'+Math.round(t)+'k' : '';
  }
  function units(list){ return list.reduce(function(s,p){return s+p.units;},0); }

  /* pipeline(es, prog): pass a programme name for that programme, or nothing
     for the portfolio total. Evenlode is the only programme with Projects, so
     its Available still comes from gy-projects.js; other programmes take their
     units from ITEMS, where everything they hold is still projected. */
  function pipeline(es, prog){
    if(prog === undefined){
      return PROGRAMMES.map(function(p){ return pipeline(es,p); })
        .reduce(function(a,b){
          function add(x,y){ return {u:x.u+y.u, v:sumMoney(x.v,y.v)}; }
          return {projected:add(a.projected,b.projected), available:add(a.available,b.available),
                  reserved:add(a.reserved,b.reserved), sold:add(a.sold,b.sold)};
        });
    }
    if(prog !== 'Evenlode'){
      function un(av){ return rows(prog).filter(function(r){
        return r.es===es && r.avail===av; }).reduce(function(t,r){return t+r.units;},0); }
      return {projected:{u:un('Projected'),v:''}, available:{u:un('Available'),v:''},
              reserved:{u:un('Reserved'),v:''},   sold:{u:un('Sold'),v:''}};
    }
    var all = proj(es);
    var sellable = all.filter(function(p){return !!p.value;});
    var future   = all.filter(function(p){return !p.value;});
    var h = HISTORIC[es] || {};
    var avail = {u: units(sellable), v: money(sellable)};
    if(h.registered){ avail = {u: avail.u + h.registered.u,
                               v: '£'+(parseFloat((money(sellable)||'£0k').slice(1)) + parseFloat(h.registered.v.slice(1)))+'k'}; }
    return {
      projected:  {u: units(future), v: plannedMoney(future)},
      available:  avail,
      reserved:   h.reserved || {u:0, v:''},
      sold:       h.sold     || {u:0, v:''}
    };
  }

  /* The deal register owns these figures. gy-deals.js derives them from the
     allocations, so the Deals page and this block can never disagree. DEALS
     below is only the fallback for pages that do not load gy-deals.js. */
  function deals(es, prog){
    var d = (window.GY_DEALS_API ? GY_DEALS_API.forService(es, prog) : null)
         || DEALS[es] || {open:0, inDeals:0, unreserved:{u:0,deals:0}, reserved:{u:0,deals:0}};
    var avail = pipeline(es, prog).available.u || 1;
    function pct(n){ return Math.round(n/avail*100); }
    return {open:d.open, inDeals:d.inDeals, available:avail,
            pct:pct(d.inDeals),
            unreserved:{u:d.unreserved.u, deals:d.unreserved.deals, pct:pct(d.unreserved.u)},
            reserved:  {u:d.reserved.u,   deals:d.reserved.deals,   pct:pct(d.reserved.u)}};
  }

  /* Programme scope. Every read takes an optional programme name; pass nothing
     for the portfolio total. The Evenlode pages pass 'Evenlode'. */
  var PROGRAMMES = ['Evenlode','Spains Hall','Boothby'];
  function rows(prog){
    return ITEMS.filter(function(r){ return !prog || r[0]===prog; }).map(function(r){
      return {prog:r[0], es:r[1], avail:r[2], type:r[3], units:r[4], ha:r[5], site:r[6],
              dist:r[7], cond:r[8], broad:r[9], hid:r[10],
              lpa:(r[1]==='bng'?LPA:''), nca:(r[1]==='bng'?NCA:''), lnrs:(r[1]==='bng'?LNRS:'')};
    });
  }

  window.GY_INV_API = {
    services:  function(){ return ['bng','wcc','soc']; },
    programmes:function(){ return PROGRAMMES.slice(); },
    rows:      rows,
    rowsFor:   function(es, prog){ return rows(prog).filter(function(r){return r.es===es;}); },
    unitsIn:   function(es, avail, prog){ return rows(prog).filter(function(r){
                 return r.es===es && (!avail || r.avail===avail); })
                 .reduce(function(s,r){return s+r.units;},0); },
    /* portfolio: units of one service split by programme, biggest first */
    byProgramme: function(es){
      return PROGRAMMES.map(function(p){
        var l=rows(p).filter(function(r){return r.es===es;});
        return {prog:p, units:l.reduce(function(t,r){return t+r.units;},0),
                avail:l.filter(function(r){return r.avail==='Available';})
                       .reduce(function(t,r){return t+r.units;},0)};
      }).filter(function(x){return x.units>0;}).sort(function(a,b){return b.units-a.units;});
    },
    pipeline:  pipeline,
    deals:     deals,
    total:     function(prog){ return rows(prog).reduce(function(t,r){return t+r.units;},0); },
    risk:      function(es){ return (RISK[es]||[]).map(function(r){
                 return {label:r[0], reserved:r[1], unreserved:r[2], free:r[3], total:r[1]+r[2]+r[3]}; }); },
    riskLabel: function(es){ return es==='bng' ? 'BNG specific type'
                                : es==='wcc' ? 'WCC vintage' : 'Soil carbon land type'; }
  };
})();
