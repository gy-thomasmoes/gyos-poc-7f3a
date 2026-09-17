/* gy-deals.js - the deal register and, more importantly, the allocations
   underneath it. A deal is a claim on scarce supply, so the object that
   carries the value is not the deal but the allocation: N units of one
   inventory line, committed to one deal, at one price, in one state.

   Everything a person types lives in DEALS and ALLOC. Everything else is
   derived: deal status, programmes, ecosystem services, units, value and
   the five issue types. Deal status is NEVER stored. The CRM side of a deal
   (owner, stage, pipeline, amount, dates, contacts) is a read only mirror of
   Hubspot; the inventory side is ours.

   gy-inventory.js reads this file for its Deals block, so the Deals page and
   the Inventory overview can never disagree. */
(function(){

  var CRM = 'Hubspot';
  var SYNC = '20.15 today';

  var STAGES = ['Scoped/qualified','Proposal sent','Quote confirmed or rejected',
                'Due diligence','Commercial negotiation','Reservation/option agreed',
                'Closed Won','Closed Lost'];

  var OWNERS = ['Izzie Bell','Millie Gray','Harry Fox','Jane Amory','Caitlin Ciceri'];
  var ME = 'Izzie Bell';

  /* Prices per ecosystem service and specific type or vintage.
     modelled = what our model says, floor = the sales restriction, achieved =
     average of closed deals. Per unit, on the same scale as gy-projects.js. */
  var PRICE = {
    'bng|Lowland meadow':               {modelled:560, floor:470, achieved:528},
    'bng|Lowland calcareous grassland': {modelled:610, floor:520, achieved:585},
    'bng|Mixed scrub':                  {modelled:430, floor:360, achieved:402},
    'bng|Broadleaved woodland':         {modelled:700, floor:600, achieved:664},
    'bng|Cover crops':                  {modelled:390, floor:330, achieved:371},
    'bng|Hedgerow':                     {modelled:520, floor:450, achieved:498},
    'bng|Watercourse':                  {modelled:660, floor:560, achieved:640},
    'bng|Modified grassland':           {modelled:410, floor:350, achieved:388},
    'bng|Floodplain grazing marsh':     {modelled:450, floor:380, achieved:428},
    'wcc|2024 (WCU)':                   {modelled:460, floor:400, achieved:442},
    'wcc|2029 (WCU)':                   {modelled:420, floor:360, achieved:405},
    'wcc|2029 (PIU)':                   {modelled:340, floor:290, achieved:326},
    'wcc|2034 (PIU)':                   {modelled:300, floor:260, achieved:288},
    'wcc|2039 (PIU)':                   {modelled:270, floor:230, achieved:258}
  };

  /* CRM side. amount is Hubspot's figure and is deliberately allowed to
     disagree with what the allocations add up to. */
  var DEALS = [
    {slug:'cotswold-homes', name:'Cotswold Homes', ref:'REF-10507', buyer:'Cotswold Homes Ltd',
     owner:'Izzie Bell', stage:'Commercial negotiation', pipeline:'BNG deals',
     amount:9500, created:'12 Apr 2026', close:'30 Oct 2026',
     contacts:['Priya Raman','Tom Selby'],
     note:'Two phases of housing east of Chipping Norton, both inside the Cotswolds NCA. Wants everything local to the LPA.'},

    {slug:'wychwood-developments', name:'Wychwood Developments', ref:'REF-10579', buyer:'Wychwood Developments',
     owner:'Izzie Bell', stage:'Quote confirmed or rejected', pipeline:'BNG deals',
     amount:7200, created:'21 Apr 2026', close:'14 Nov 2026',
     contacts:['Alan Frost'],
     note:'Repeat buyer. Took cover crop units last year and asked for the same again at the same price.'},

    {slug:'thameside-living', name:'Thameside Living', ref:'REF-10742', buyer:'Thameside Living plc',
     owner:'Millie Gray', stage:'Due diligence', pipeline:'BNG deals',
     amount:8500, created:'06 May 2026', close:'28 Nov 2026',
     contacts:['Nadia Okonjo','Rob Vance'],
     note:'Hedgerow units for a linear scheme. Their ecologist is checking condition evidence before exchange.'},

    {slug:'barnwell-regeneration', name:'Barnwell Regeneration', ref:'REF-10853', buyer:'Barnwell Regeneration',
     owner:'Harry Fox', stage:'Proposal sent', pipeline:'BNG deals',
     amount:7400, created:'19 May 2026', close:'11 Dec 2026',
     contacts:['Gemma Wallis'],
     note:'Price was cut to win the scheme and is now under the floor. Needs a decision before the proposal expires.'},

    {slug:'oxford-north-partners', name:'Oxford North Partners', ref:'REF-11055', buyer:'Oxford North Partners LLP',
     owner:'Jane Amory', stage:'Proposal sent', pipeline:'BNG deals',
     amount:10900, created:'02 Jun 2026', close:'22 Dec 2026',
     contacts:['Sean Whitlock','Ada Perry'],
     note:'Large mixed use scheme. Quoted against cover crop units that two other deals are already holding.'},

    {slug:'kingham-estates', name:'Kingham Estates', ref:'REF-11140', buyer:'Kingham Estates',
     owner:'Izzie Bell', stage:'Scoped/qualified', pipeline:'BNG deals',
     amount:12000, created:'17 Jun 2026', close:'30 Jan 2027',
     contacts:['Martha Deane'],
     note:'Early conversation off the back of the Kwame planning list. Lowland meadow is the only match in range.'},

    {slug:'meridian-carbon', name:'Meridian Carbon Fund', ref:'REF-11303', buyer:'Meridian Carbon Fund',
     owner:'Caitlin Ciceri', stage:'Reservation/option agreed', pipeline:'Carbon deals',
     amount:7600, created:'28 Apr 2026', close:'09 Oct 2026',
     contacts:['Ingrid Halvorsen','Peter Adeyemi'],
     note:'Option agreed on the 2029 PIU tranche. Wants first refusal on the next vintage as well.'},

    {slug:'ardent-insurance', name:'Ardent Insurance Group', ref:'REF-11388', buyer:'Ardent Insurance Group',
     owner:'Millie Gray', stage:'Due diligence', pipeline:'Carbon deals',
     amount:5700, created:'11 May 2026', close:'20 Nov 2026',
     contacts:['Laura Benn'],
     note:'Corporate buyer with a net zero commitment dated 2030. Legal review is the only open item.'},

    {slug:'northbrook-logistics', name:'Northbrook Logistics', ref:'REF-11402', buyer:'Northbrook Logistics',
     owner:'Harry Fox', stage:'Commercial negotiation', pipeline:'Carbon deals',
     amount:6300, created:'03 Jun 2026', close:'18 Dec 2026',
     contacts:['Ellis Carrow','Sam Tiller'],
     note:'Two depots in the Midlands. The CRM amount still carries the original ask, not the current basket.'},

    {slug:'halcyon-asset', name:'Halcyon Asset Management', ref:'REF-11455', buyer:'Halcyon Asset Management',
     owner:'Caitlin Ciceri', stage:'Proposal sent', pipeline:'Carbon deals',
     amount:11000, created:'24 Jun 2026', close:'06 Feb 2027',
     contacts:['Rania Aslam'],
     note:'Fund buying verified units only. Nothing reserved yet, so the units are still open to other deals.'},

    {slug:'fairhaven-group', name:'Fairhaven Group', ref:'REF-11510', buyer:'Fairhaven Group',
     owner:'Jane Amory', stage:'Reservation/option agreed', pipeline:'BNG deals',
     amount:18000, created:'08 Jul 2026', close:'25 Sep 2026',
     contacts:['Douglas Mayne','Tanvi Shah'],
     note:'A reservation has been agreed in the CRM and no units have been attached. This is the one to fix first.'},

    {slug:'sable-infrastructure', name:'Sable Infrastructure', ref:'REF-11577', buyer:'Sable Infrastructure',
     owner:'Izzie Bell', stage:'Scoped/qualified', pipeline:'Carbon deals',
     amount:9000, created:'02 Sep 2026', close:'31 Mar 2027',
     contacts:['Yusuf Karam'],
     note:'Enquiry against future Spains Hall vintages. Nothing to allocate until the PIU application lands.'},

    {slug:'bicester-gateway', name:'Bicester Gateway Developments', ref:'REF-10188', buyer:'Bicester Gateway Developments',
     owner:'Izzie Bell', stage:'Closed Won', pipeline:'BNG deals',
     amount:51000, created:'14 Jan 2026', close:'22 May 2026',
     contacts:['Helen Prosser','Marcus Quill'],
     note:'First deal to span two programmes. Watercourse units from Evenlode and grazing marsh from Spains Hall.'},

    {slug:'chipping-norton-homes', name:'Chipping Norton Homes', ref:'REF-10244', buyer:'Chipping Norton Homes',
     owner:'Millie Gray', stage:'Closed Won', pipeline:'BNG deals',
     amount:21300, created:'29 Jan 2026', close:'03 Jun 2026',
     contacts:['Owen Bright'],
     note:'Completed in June. The units are still sitting as reserved rather than sold.'},

    {slug:'vale-regeneration', name:'Vale Regeneration', ref:'REF-10399', buyer:'Vale Regeneration',
     owner:'Harry Fox', stage:'Closed Lost', pipeline:'BNG deals',
     amount:18000, created:'25 Feb 2026', close:'30 Jul 2026',
     contacts:['Cerys Lloyd'],
     note:'Lost on price to a habitat bank inside the same LPA. Units went back to the pool in July.'}
  ];

  /* [deal, programme, es, specific type or vintage, units, price per unit, state]
     state: reserved | unreserved | sold */
  var ALLOC = [
    ['cotswold-homes',        'Evenlode','bng','Cover crops',                 24, 395,'reserved'],
    ['wychwood-developments', 'Evenlode','bng','Cover crops',                 18, 402,'reserved'],
    ['thameside-living',      'Evenlode','bng','Hedgerow',                    16, 530,'reserved'],
    ['barnwell-regeneration', 'Evenlode','bng','Hedgerow',                    12, 430,'reserved'],

    ['oxford-north-partners', 'Evenlode','bng','Cover crops',                 28, 388,'unreserved'],
    ['kingham-estates',       'Evenlode','bng','Lowland meadow',              22, 545,'unreserved'],

    ['meridian-carbon',       'Evenlode','wcc','2029 (PIU)',                  22, 345,'reserved'],
    ['ardent-insurance',      'Evenlode','wcc','2029 (PIU)',                  17, 338,'reserved'],
    ['northbrook-logistics',  'Evenlode','wcc','2029 (PIU)',                  12, 352,'reserved'],

    ['halcyon-asset',         'Evenlode','wcc','2024 (WCU)',                  24, 455,'unreserved'],

    ['bicester-gateway',      'Evenlode','bng','Watercourse',                 66, 645,'sold'],
    ['bicester-gateway',      'Spains Hall','bng','Floodplain grazing marsh', 20, 430,'sold'],
    ['chipping-norton-homes', 'Evenlode','bng','Modified grassland',          54, 395,'reserved'],

    ['vale-regeneration',     'Evenlode','bng','Lowland calcareous grassland',30, 600,'unreserved']
  ];

  /* how many units of each inventory line exist. Read from gy-inventory.js
     when that file is present, so the two never disagree. */
  var SUPPLY_FALLBACK = {
    'Evenlode|bng|Cover crops':52, 'Evenlode|bng|Hedgerow':38,
    'Evenlode|bng|Lowland meadow':105, 'Evenlode|bng|Lowland calcareous grassland':106,
    'Evenlode|bng|Watercourse':66, 'Evenlode|bng|Modified grassland':54,
    'Evenlode|wcc|2029 (PIU)':110, 'Evenlode|wcc|2024 (WCU)':130,
    'Spains Hall|bng|Floodplain grazing marsh':210
  };

  /* -- what the review page has changed ---------------------------------
     Accepting an issue is a judgement a person made, so it persists. The
     fixes write an override on top of ALLOC rather than editing it, so the
     canonical demo data is always one Reset away. Both live in this browser
     only, the same idiom as the workflow favourites. */
  var LS_ACC = 'gyDealsAccepted', LS_OVR = 'gyDealsOverrides';
  function lsGet(k, d){
    try{ var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; }
  }
  function lsSet(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
  var ACCEPTED = lsGet(LS_ACC, []);
  var OVR      = lsGet(LS_OVR, {});
  function save(){ lsSet(LS_ACC, ACCEPTED); lsSet(LS_OVR, OVR); }

  /* -- derivation ------------------------------------------------------- */

  function lineKey(a){ return a.prog+'|'+a.es+'|'+a.type; }
  function allocKey(r){ return r[0]+'|'+r[1]+'|'+r[2]+'|'+r[3]; }

  var ROWS = [];
  function build(){
    ROWS = ALLOC.map(function(r){
      var k = allocKey(r), o = OVR[k] || {};
      var units = o.units !== undefined ? o.units : r[4];
      var price = o.price !== undefined ? o.price : r[5];
      var state = o.state || r[6];
      var p = PRICE[r[2]+'|'+r[3]] || {modelled:price, floor:0, achieved:price};
      return {key:k, deal:r[0], prog:r[1], es:r[2], type:r[3], units:units,
              price:price, state:state, total:units*price, ref:p};
    });
  }
  build();

  function byId(slug){
    for(var i=0;i<DEALS.length;i++) if(DEALS[i].slug===slug) return DEALS[i];
    return null;
  }
  function allocOf(slug){ return ROWS.filter(function(a){ return a.deal===slug; }); }
  function isOpen(d){ return d.stage!=='Closed Won' && d.stage!=='Closed Lost'; }

  function statusOf(d){
    if(d.stage==='Closed Won')  return 'Closed Won';
    if(d.stage==='Closed Lost') return 'Closed Lost';
    var a = allocOf(d.slug);
    if(!a.length) return 'Open (No inventory)';
    return a.some(function(x){ return x.state==='unreserved'; })
      ? 'Open (Unreserved inventory)' : 'Open (Reserved inventory)';
  }

  /* only what is sellable today counts as supply. Projected units are not
     yet registered and Sold units have left, so a claim cannot be measured
     against either. */
  function supplyOf(key){
    if(window.GY_INV_API){
      var t = GY_INV_API.rows().filter(function(r){
        return r.prog+'|'+r.es+'|'+r.type === key
            && (r.avail === 'Available' || r.avail === 'Reserved'); })
        .reduce(function(s,r){ return s+r.units; }, 0);
      if(t) return t;
    }
    return SUPPLY_FALLBACK[key] || 0;
  }

  function units(slug){ return allocOf(slug).reduce(function(s,a){return s+a.units;},0); }
  function value(slug){ return allocOf(slug).reduce(function(s,a){return s+a.total;},0); }
  function progs(slug){
    var out=[]; allocOf(slug).forEach(function(a){ if(out.indexOf(a.prog)<0) out.push(a.prog); });
    return out;
  }
  function esOf(d){
    var out=[]; allocOf(d.slug).forEach(function(a){ if(out.indexOf(a.es)<0) out.push(a.es); });
    if(!out.length) out = [d.pipeline==='Carbon deals' ? 'wcc' : 'bng'];
    return out;
  }

  var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function daysTo(dateStr){
    var p = String(dateStr).split(' ');
    var m = MONTHS.indexOf(p[1]);
    if(p.length !== 3 || m < 0) return null;
    var then = new Date(+p[2], m, +p[0]);
    return Math.round((then - new Date()) / 86400000);
  }

  /* -- issues ------------------------------------------------------------
     Canonical and de-duplicated. Contention belongs to an inventory line, so
     three deals standing on one line is ONE issue naming three deals, not
     three issues. Severity is a property, not a rendering accident: money at
     risk first, then time pressure, then housekeeping, then hygiene. */

  var ISSUE = {
    contested:{label:'Units claimed by another deal', icon:'ti-alert-triangle', sev:1},
    price:    {label:'Price below the floor',         icon:'ti-currency-pound', sev:2},
    stagegap: {label:'Stage ahead of inventory',      icon:'ti-arrow-bounce',   sev:3},
    marksold: {label:'Closed won, units not sold',    icon:'ti-flag',           sev:4},
    amount:   {label:'CRM amount and value differ',   icon:'ti-scale',          sev:5}
  };
  var ISSUE_ORDER = ['contested','price','stagegap','marksold','amount'];

  function contestedGroups(){
    var by = {};
    ROWS.forEach(function(a){
      var d = byId(a.deal); if(!d || !isOpen(d)) return;
      var k = lineKey(a); (by[k] = by[k] || []).push(a);
    });
    return Object.keys(by).map(function(k){
      var claims = by[k];
      return {key:k, claims:claims, supply:supplyOf(k),
              claimed:claims.reduce(function(s,x){ return s+x.units; }, 0)};
    }).filter(function(g){ return g.supply && g.claimed > g.supply; });
  }

  function issues(){
    var out = [];

    contestedGroups().forEach(function(g){
      var p = g.key.split('|');
      var names = g.claims.map(function(c){ return byId(c.deal).name; });
      out.push({id:'contested:'+g.key, type:'contested', sev:1,
        title:p[2]+' in '+p[0]+' is claimed by '+g.claims.length+' deals',
        detail:g.claimed+' units claimed against '+g.supply+' available, with '+names.join(', '),
        deals:g.claims.map(function(c){ return c.deal; }),
        line:{prog:p[0], es:p[1], type:p[2]},
        ev:{supply:g.supply, claimed:g.claimed, over:g.claimed-g.supply, claims:g.claims}});
    });

    ROWS.forEach(function(a){
      if(a.ref.floor && a.price < a.ref.floor){
        out.push({id:'price:'+a.key, type:'price', sev:2,
          title:a.type+' on '+byId(a.deal).name+' is priced under the floor',
          detail:'£'+a.price+' against a floor of £'+a.ref.floor,
          deals:[a.deal], line:{prog:a.prog, es:a.es, type:a.type},
          ev:{alloc:a, price:a.price, floor:a.ref.floor, gap:a.ref.floor-a.price,
              modelled:a.ref.modelled, achieved:a.ref.achieved, units:a.units}});
      }
    });

    DEALS.forEach(function(d){
      var a = allocOf(d.slug), st = statusOf(d), rank = STAGES.indexOf(d.stage);

      var gap = (rank >= STAGES.indexOf('Commercial negotiation') && rank < 6
                 && st === 'Open (No inventory)')
             || (d.stage === 'Reservation/option agreed'
                 && st === 'Open (Unreserved inventory)');
      if(gap){
        out.push({id:'stagegap:'+d.slug, type:'stagegap', sev:3,
          title:d.name+' is at '+d.stage+' without the inventory to match',
          detail:st === 'Open (No inventory)' ? 'Nothing allocated'
                                              : 'Reservation agreed and the units are not reserved',
          deals:[d.slug],
          ev:{stage:d.stage, status:st, close:d.close, days:daysTo(d.close), es:esOf(d)[0]}});
      }

      if(d.stage === 'Closed Won' && a.some(function(x){ return x.state !== 'sold'; })){
        out.push({id:'marksold:'+d.slug, type:'marksold', sev:4,
          title:d.name+' was won with units still held as reserved',
          detail:'Won on '+d.close,
          deals:[d.slug],
          ev:{units:a.filter(function(x){ return x.state !== 'sold'; })
                     .reduce(function(s,x){ return s+x.units; }, 0), close:d.close}});
      }

      var v = value(d.slug);
      if(v && d.amount && Math.abs(d.amount - v) / v > 0.1){
        out.push({id:'amount:'+d.slug, type:'amount', sev:5,
          title:d.name+' amount and unit value differ',
          detail:'Hubspot says £'+d.amount.toLocaleString()
                 +', the units add up to £'+v.toLocaleString(),
          deals:[d.slug], ev:{amount:d.amount, value:v, delta:d.amount - v}});
      }
    });

    out.forEach(function(i){ i.accepted = ACCEPTED.indexOf(i.id) >= 0; });
    return out.sort(function(a,b){ return a.sev - b.sev; });
  }

  function open_(){ return issues().filter(function(i){ return !i.accepted; }); }
  function issuesOf(slug){
    return open_().filter(function(i){ return i.deals.indexOf(slug) >= 0; });
  }
  function dealsNeedingReview(){
    var s = {};
    open_().forEach(function(i){ i.deals.forEach(function(d){ s[d] = 1; }); });
    return Object.keys(s);
  }
