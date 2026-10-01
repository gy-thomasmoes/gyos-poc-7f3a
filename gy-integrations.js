/* gy-integrations.js - the connections between the GY OS and the systems around it.
   Settings > Integrations renders from here; nothing else should hardcode a
   connector. One entry per system, with the flows it carries.

   Fields
     id        stable key, used in the drawer deep link (?i=hubspot)
     name      the system as people say it
     line      one factual line under the name: what flows, which way
     vendor    who runs it
     cat       registry | crm | mrv | map | data
     status    on | warn | off | avail     connected, needs attention, paused, available
     mark      two letters for the tile
     flows     [{dir, what, obj, when, last}]  dir: in | out | both, obj: a GY OS noun
     owners    {eng, method, ui}   the three hats agreed 9 Sep 2026
     fields    [mapped, total]
     last      last sync, as shown
     next      next run, as shown
     issue     one line, only when status is warn
     note      one line of context for the drawer
     runs      recent runs, newest first  [when, ok, detail]
*/
(function(){
  var CATS = {
    registry:{name:'Registries',     short:'Registry', icon:'ti-certificate',   bg:'#EAF1DE', fg:'#3F5A2B'},
    crm:     {name:'CRM',            short:'CRM',      icon:'ti-businessplan',  bg:'#FBF1DC', fg:'#8A5A10'},
    mrv:     {name:'MRV providers',  short:'MRV',      icon:'ti-ruler-measure', bg:'#DFF2EA', fg:'#1D6B52'},
    map:     {name:'Mapping',        short:'Mapping',  icon:'ti-map-2',         bg:'#E6F1FB', fg:'#185FA5'},
    data:    {name:'Data platform',  short:'Data',     icon:'ti-database',      bg:'#F3EFE1', fg:'#5F5850'}
  };

  var STATUS = {
    on:   {label:'Connected',       cls:'st-on'},
    warn: {label:'Needs attention', cls:'st-warn'},
    off:  {label:'Paused',          cls:'st-off'},
    avail:{label:'Available',       cls:'st-avail'}
  };

  var DIR = {
    'in':  {label:'Into GY OS',  icon:'ti-arrow-down-left'},
    'out': {label:'Out of GY OS',icon:'ti-arrow-up-right'},
    'both':{label:'Two-way',     icon:'ti-arrows-exchange'}
  };

  var PEOPLE = {
    'Charlie Rowe'  :{ini:'CR', c:'#5F5E5A'},
    'Harry Fox'     :{ini:'HF', c:'#EF9F27'},
    'Tom Nash'      :{ini:'TN', c:'#378ADD'},
    'Emily Norton'  :{ini:'EN', c:'#639922'},
    'Izzie Bell'    :{ini:'IB', c:'#7F77DD'},
    'Caitlin Ciceri':{ini:'CC', c:'#1D9E75'}
  };

  var ITEMS = [
    {id:'ne-bng', line:'Registered gain sites and allocations, in and out of Projects and Deals', name:'BNG Gain Site Register', vendor:'Natural England', cat:'registry', status:'on', mark:'NE',
     last:'06:00 today', next:'06:00 tomorrow', fields:[18,18],
     owners:{eng:'Charlie Rowe', method:'Emily Norton', ui:'Tom Nash'},
     note:'Registered gain sites and their allocations, matched to Projects by site reference. Allocations are written back when a deal closes.',
     flows:[
       {dir:'in',  what:'Registered sites and allocations', obj:'Projects',  when:'Daily 06:00', last:'4 sites, 1,120 units'},
       {dir:'in',  what:'Registration status',              obj:'Inventory', when:'Daily 06:00', last:'40 units verified'},
       {dir:'out', what:'Allocation records at sale',       obj:'Deals',     when:'On event',    last:'Bicester Gateway, 86 units'}
     ],
     runs:[['Today 06:00',true,'4 sites, 1,120 units'],['Sun 13 Sep 06:00',true,'No change'],['Sat 12 Sep 06:00',true,'No change'],['Fri 11 Sep 09:41',true,'40 units verified'],['Thu 10 Sep 06:00',true,'No change']]},

    {id:'ukl-carbon', line:'PIU and WCU issuance in, transfers and retirements out', name:'UK Land Carbon Registry', vendor:'S&P Global', cat:'registry', status:'on', mark:'LC',
     last:'06:00 today', next:'06:00 tomorrow', fields:[22,22],
     owners:{eng:'Charlie Rowe', method:'Emily Norton', ui:'Tom Nash'},
     note:'Woodland Carbon Code and Peatland Code. Issuance and verification arrive here; transfers and retirements leave from Deals.',
     flows:[
       {dir:'in',  what:'PIU and WCU issuance',      obj:'Inventory', when:'Daily 06:00', last:'2 projects, 620 units'},
       {dir:'in',  what:'Verification status',      obj:'Projects',  when:'Daily 06:00', last:'No change'},
       {dir:'out', what:'Transfers and retirements', obj:'Deals',     when:'On event',    last:'No transfers yet'}
     ],
     runs:[['Today 06:00',true,'2 projects, 620 units'],['Sun 13 Sep 06:00',true,'No change'],['Sat 12 Sep 06:00',true,'No change'],['Fri 11 Sep 06:00',true,'2029 PIUs issued, 110 units'],['Thu 10 Sep 06:00',true,'No change']]},

    {id:'isometric', line:'GHG entries and credit issuance for soil carbon', name:'Isometric Registry', vendor:'Isometric', cat:'registry', status:'avail', mark:'IS',
     last:'', next:'', fields:[0,16],
     owners:{eng:'', method:'', ui:''},
     note:'Soil carbon and other removals. On the roadmap as a future ecosystem service; nothing flows yet.',
     flows:[
       {dir:'in',  what:'GHG entries and credit issuance', obj:'Inventory', when:'Daily', last:''},
       {dir:'out', what:'Retirements',                     obj:'Deals',     when:'On event', last:''}
     ],
     runs:[]},

    {id:'hubspot', line:'Deals, stages, companies and contacts into Deals', name:'HubSpot', vendor:'HubSpot', cat:'crm', status:'on', mark:'HS',
     last:'20:15 today', next:'Every 15 minutes', fields:[23,25],
     owners:{eng:'Charlie Rowe', method:'Izzie Bell', ui:'Tom Nash'},
     note:'One way for now. HubSpot owns the deal, Great Yellow owns the units. Write-back of allocated units is scoped for the next cycle.',
     flows:[
       {dir:'in',  what:'Deals, stages and owners',    obj:'Deals', when:'Every 15 min', last:'7 deals, 1 stage change'},
       {dir:'in',  what:'Companies and contacts',      obj:'Deals', when:'Every 15 min', last:'No change'},
       {dir:'out', what:'Allocated units and value',   obj:'Deals', when:'Planned',      last:''}
     ],
     runs:[['Today 20:15',true,'7 deals, 1 stage change'],['Today 20:00',true,'No change'],['Today 19:45',true,'No change'],['Today 19:30',true,'Owner changed, Cotswold Homes'],['Today 19:15',true,'No change']]},

    {id:'attio', line:'People, companies and deals, two-way', name:'Attio', vendor:'Attio', cat:'crm', status:'avail', mark:'AT',
     last:'', next:'', fields:[0,25],
     owners:{eng:'', method:'', ui:''},
     note:'Candidate CRM engine, under evaluation. Would run headless behind GY OS with its own interface kept for sales-shaped work.',
     flows:[
       {dir:'both', what:'People, companies and deals', obj:'Deals', when:'Live', last:''}
     ],
     runs:[]},

    {id:'carbonquest', line:'Monitoring reports and soil carbon measurements', name:'CarbonQuest', vendor:'CarbonQuest', cat:'mrv', status:'on', mark:'CQ',
     last:'11 Sep', next:'On delivery', fields:[14,14],
     owners:{eng:'Charlie Rowe', method:'Emily Norton', ui:'Tom Nash'},
     note:'Monitoring reports land as documents and their verified quantities become progression events on the units they cover.',
     flows:[
       {dir:'in', what:'Monitoring reports',        obj:'Documents', when:'On delivery',  last:'2 reports'},
       {dir:'in', what:'Soil carbon measurements',  obj:'Inventory', when:'Per campaign', last:'Charlbury Soils, 12 plots'}
     ],
     runs:[['Thu 11 Sep 14:02',true,'2 reports, 12 plots'],['Mon 18 Aug 09:30',true,'1 report'],['Tue 22 Jul 11:15',true,'Baseline, 12 plots']]},

    {id:'renewearth', line:'Monitoring reports and verified quantities', name:'Renew Earth', vendor:'Renew Earth', cat:'mrv', status:'warn', mark:'RE',
     last:'12 Sep 14:20', next:'Blocked', fields:[9,23],
     owners:{eng:'Charlie Rowe', method:'Emily Norton', ui:'Tom Nash'},
     issue:'2 monitoring reports failed validation: 14 fields are not mapped to the GY schema.',
     note:'The reports are held in the intake queue. Nothing reaches Inventory until the mapping is completed and the reports pass.',
     flows:[
       {dir:'in', what:'Monitoring reports',   obj:'Documents', when:'On delivery', last:'2 held'},
       {dir:'in', what:'Verified quantities',  obj:'Inventory', when:'On delivery', last:'Blocked'}
     ],
     runs:[['Fri 12 Sep 14:20',false,'2 reports failed validation'],['Fri 12 Sep 14:18',false,'Schema mismatch, 14 fields'],['Wed 13 Aug 10:05',true,'1 report'],['Tue 8 Jul 16:40',true,'Baseline']]},

    {id:'treeconomy', line:'Canopy and biomass estimates per parcel', name:'Treeconomy', vendor:'Treeconomy', cat:'mrv', status:'off', mark:'TR',
     last:'2 Sep', next:'Paused', fields:[11,11],
     owners:{eng:'Charlie Rowe', method:'Emily Norton', ui:'Tom Nash'},
     note:'Paused in September 2026 while the partnership is reviewed. History is kept; nothing new arrives.',
     flows:[
       {dir:'in', what:'Canopy and biomass estimates', obj:'Inventory', when:'Quarterly', last:'Bruern Estate, 3 parcels'}
     ],
     runs:[['Tue 2 Sep 08:00',true,'Bruern Estate, 3 parcels'],['Mon 2 Jun 08:00',true,'3 parcels'],['Mon 3 Mar 08:00',true,'3 parcels']]},

    {id:'landapp', line:'Parcel boundaries in, inventory layer per parcel out', name:'Land App', vendor:'Land App', cat:'map', status:'on', mark:'LA',
     last:'02:00 today', next:'02:00 tomorrow', fields:[16,16],
     owners:{eng:'Charlie Rowe', method:'Emily Norton', ui:'Tom Nash'},
     note:'Parcel boundaries and the land schedule come in; the inventory on each parcel goes back as a layer the landowner can see.',
     flows:[
       {dir:'in',  what:'Parcel boundaries and land schedule', obj:'Sites',     when:'Nightly 02:00', last:'18 parcels, 187.8 ha'},
       {dir:'in',  what:'Plans and scheme layers',            obj:'Documents', when:'Nightly 02:00', last:'No change'},
       {dir:'out', what:'Inventory layer per parcel',         obj:'Sites',     when:'Nightly 02:00', last:'18 parcels'}
     ],
     runs:[['Today 02:00',true,'18 parcels, 187.8 ha'],['Sun 13 Sep 02:00',true,'No change'],['Sat 12 Sep 02:00',true,'Bruern split, 3 parcels'],['Fri 11 Sep 02:00',true,'No change'],['Thu 10 Sep 02:00',true,'No change']]},

    {id:'ea-flood', line:'Flood zones and river network, live on the Market Map', name:'Environment Agency', vendor:'Environment Agency', cat:'map', status:'on', mark:'EA',
     last:'Live', next:'Pulled on view', fields:[6,6],
     owners:{eng:'Charlie Rowe', method:'Harry Fox', ui:'Tom Nash'},
     note:'Flood zones and river network, pulled live from the EA API rather than stored. Shown on the Market Map.',
     flows:[
       {dir:'in', what:'Flood zones and river network', obj:'Intelligence', when:'Live', last:'On view'}
     ],
     runs:[['Today 18:52',true,'Layer served'],['Today 16:10',true,'Layer served'],['Today 11:33',true,'Layer served']]},

    {id:'arcgis', line:'Survey and habitat layers into Sites', name:'ArcGIS Online', vendor:'Esri', cat:'map', status:'avail', mark:'AG',
     last:'', next:'', fields:[0,12],
     owners:{eng:'', method:'', ui:''},
     note:'For programmes whose surveys arrive as ArcGIS layers. Import only; GY OS never replicates GIS.',
     flows:[
       {dir:'in', what:'Survey and habitat layers', obj:'Sites', when:'On upload', last:''}
     ],
     runs:[]},

    {id:'databricks', line:'Operational records out, curves and benchmarks in', name:'Databricks', vendor:'Unity Catalog', cat:'data', status:'on', mark:'DB',
     last:'09:00 today', next:'10:00 today', fields:[41,44],
     owners:{eng:'Charlie Rowe', method:'Harry Fox', ui:'Tom Nash'},
     note:'Operational records go out to bronze every hour. Curves and benchmarks are computed in dbt and read back from gold. The OS is a collection point, not the warehouse.',
     flows:[
       {dir:'out', what:'Inventory, deals and audit events', obj:'Inventory',    when:'Hourly',  last:'2,715 units, 7 deals, 31 events'},
       {dir:'in',  what:'Price curves and carbon curves',    obj:'Intelligence', when:'Weekly',  last:'Mon 14 Sep'},
       {dir:'in',  what:'Cost benchmarks',                   obj:'Intelligence', when:'Weekly',  last:'Mon 14 Sep'},
       {dir:'in',  what:'Planning applications and BNG scraper', obj:'Intelligence', when:'Monthly', last:'18,240 applications, 612 with BNG'},
       {dir:'in',  what:'Buyer database',                    obj:'Intelligence', when:'Weekly',  last:'1,184 organisations'}
     ],
     runs:[['Today 09:00',true,'2,715 units, 7 deals, 31 events'],['Today 08:00',true,'No change'],['Today 07:00',true,'Curves refreshed'],['Today 06:00',true,'No change'],['Today 05:00',true,'No change']]}
  ];

  var OBJECTS = ['Inventory','Deals','Projects','Sites','Documents','Intelligence'];

  function byId(id){ for(var i=0;i<ITEMS.length;i++) if(ITEMS[i].id===id) return ITEMS[i]; return null; }
  function dirOf(it){
    var hasIn=false, hasOut=false;
    it.flows.forEach(function(f){ if(f.dir==='in'||f.dir==='both') hasIn=true; if(f.dir==='out'||f.dir==='both') hasOut=true; });
    return hasIn && hasOut ? 'both' : hasIn ? 'in' : 'out';
  }
  function counts(){
    var c={on:0,warn:0,off:0,avail:0};
    ITEMS.forEach(function(i){ c[i.status]++; });
    return c;
  }
  function byCat(cat){ return ITEMS.filter(function(i){ return i.cat===cat; }); }
  function touching(obj){
    return ITEMS.filter(function(i){
      return i.status!=='avail' && i.flows.some(function(f){ return f.obj===obj; });
    });
  }
  function liveFlows(it){ return it.flows.filter(function(f){ return f.when!=='Planned'; }); }

  window.GY_INTEG_API = {
    all:function(){ return ITEMS.slice(); },
    byId:byId, byCat:byCat, counts:counts, dirOf:dirOf, touching:touching, liveFlows:liveFlows,
    cats:CATS, status:STATUS, dir:DIR, people:PEOPLE, objects:OBJECTS,
    lastSync:'20:15 today'
  };
})();
