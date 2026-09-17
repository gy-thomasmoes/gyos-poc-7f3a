/* gy-esdata.js - the content behind each ecosystem-service product page.
   Keyed <es>.<scope>. Portfolio aggregates across programmes; programme is
   one place and breaks down by project instead. */
window.GY_ESDATA = {

/* ─────────────── BNG ─────────────── */
'bng.portfolio':{
  es:'bng', scope:'portfolio',
  allServicesHref:'inventory-portfolio-overview.html', allInventoryHref:'inventory-all.html',
  cover:[['124','Total planned'],['80.6','Available'],['37.4','Available in future'],['6','Sold'],['£28k','Min price / unit','avg']],
  pipeline:{future:37.4, available:80.6, reserved:0, sold:6, total:124},
  breakdown:{title:'By programme', rows:[
    {n:'Wendling Beck',              f:22,   a:57,   r:0, s:6, max:85, go:null},
    {n:'Evenlode Landscape Recovery',f:19,   a:24,   r:0, s:0, max:85, go:'programme-overview.html'},
    {n:'Spains Hall Estate',         f:15.4, a:23.6, r:0, s:0, max:85, go:null},
    {n:'Boothby',                    f:14.6, a:0,    r:0, s:0, max:85, go:null}
  ]},
  map:{title:'Where the units are', points:[
    {n:'Wendling Beck',u:85,ll:[52.6870,0.9260]},
    {n:'Spains Hall Estate',u:39,ll:[51.9463,0.4609]},
    {n:'Evenlode Landscape Recovery',u:43,ll:[51.8800,-1.5300],go:'programme-overview.html'},
    {n:'Boothby',u:15,ll:[52.8500,-0.5500]}
  ]},
  deals:{note:'5 · 46 units', rows:[
    ['Barratt Homes · Chelmsford','12 units','Heads of terms','hot','£372k'],
    ['Essex County Council','18 units','In negotiation','neg','£513k'],
    ['Bloor Homes · Norfolk','6 units','In negotiation','neg','£168k'],
    ['Redrow · Oxfordshire','8 units','Qualified','early','£232k'],
    ['Anglian Water','2 units','Qualified','early','£58k']
  ]},
  risk:{note:'1 high', rows:[
    ['hi','Buyer concentration','68% of open value sits with two buyers, both in Essex. A single withdrawal moves the forecast by £885k.'],
    ['md','Condition downgrade at Evenlode','EV-W-03 surveyed as Poor. 19 projected units are at risk until the planting plan is revised.'],
    ['md','Spatial multiplier exposure','37.4 future units depend on staying inside the same LPA as their buyers.'],
    ['lo','Registration backlog','All available units are registered. No Natural England queue at present.']
  ]},
  delivery:[
    ['lo','80.6 units available now','Across 12 parcels and 4 programmes, all with habitat references issued.'],
    ['md','37.4 units unlock on planting','Spains Hall woodland spring 2027, Wendling Beck river restoration autumn 2027.'],
    ['lo','30-year management secured','Section 106 or conservation covenant in place on every available parcel.']
  ],
  filters:[
    ['Inventory',[['ti-topology-star-3','Programme','All 4'],['ti-progress','Availability','Any'],['ti-coin','Price','Any']]],
    ['BNG',[['ti-stars','Distinctiveness','Any'],['ti-heartbeat','Condition','Any'],['ti-leaf','Habitat','Any']]],
    ['Designations',[['ti-building-bank','LPA','Any'],['ti-map-2','NCA','Any'],['ti-plant','LNRS','Any']]]
  ],
  table:{total:125, badge:1,
    cols:['Programme','Availability','Specific type','Distinctiveness','Condition','Broad habitat','Habitat ref','LPA','Area','Projected','Available','Sold','Parcels','Min price'],
    rows:[
     ['Spains Hall Estate','Available','Other neutral grassland','Medium','Moderate','Grassland','SHE-G-01','Braintree','12.4 ha',18.6,18.6,0,3,'£28,000'],
     ['Spains Hall Estate','Available','Lowland meadows','High','Good','Grassland','SHE-G-04','Braintree','4.1 ha',9.2,9.2,0,1,'£34,000'],
     ['Spains Hall Estate','Future','Lowland mixed deciduous woodland','High','Fairly good','Woodland and forest','SHE-W-02','Braintree','8.8 ha',15.4,0,0,2,'£31,500'],
     ['Wendling Beck','Available','Other neutral grassland','Medium','Good','Grassland','WB-G-11','Breckland','26.5 ha',42.0,36.0,6,7,'£26,500'],
     ['Wendling Beck','Available','Species-rich hedgerow','Medium','Moderate','Hedgerow','WB-H-03','Breckland','3.6 ha',9.0,9.0,0,4,'£22,000'],
     ['Wendling Beck','Available','Reedbeds','High','Good','Wetland','WB-WL-02','Breckland','5.2 ha',12.0,12.0,0,2,'£38,000'],
     ['Wendling Beck','Future','Other rivers and streams','High','Fairly good','Rivers and lakes','WB-R-05','Breckland','3.1 ha',22.0,0,0,3,'£36,000'],
     ['Evenlode Landscape Recovery','Available','Other neutral grassland','Medium','Moderate','Grassland','EV-G-02','West Oxfordshire','18.9 ha',24.0,24.0,0,5,'£29,000'],
     ['Evenlode Landscape Recovery','Future','Lowland mixed deciduous woodland','High','Poor','Woodland and forest','EV-W-03','West Oxfordshire','11.2 ha',19.0,0,0,2,'£32,000'],
     ['Boothby','Future','Lowland meadows','High','Fairly good','Grassland','BO-G-01','South Kesteven','9.4 ha',14.6,0,0,2,'£30,000']
    ]}
},

'bng.programme':{
  es:'bng', scope:'programme', programme:'Evenlode',
  allServicesHref:'inventory-overview.html', allInventoryHref:'inventory-programme.html',
  cover:[['43','Total planned'],['24','Available'],['19','Available in future'],['0','Sold'],['£29k','Min price / unit','avg']],
  pipeline:{future:19, available:24, reserved:0, sold:0, total:43},
  breakdown:{title:'By project', rows:[
    {n:'East parcels restoration', f:0,  a:24, r:0, s:0, max:24, go:null},
    {n:'Woodland creation',        f:19, a:0,  r:0, s:0, max:24, go:null},
    {n:'Riparian buffers',         f:0,  a:0,  r:0, s:0, max:24, go:null}
  ]},
  map:{title:'Where the units are', scale:2.6, pad:0.25, points:[
    {n:'B1 · East grassland',u:11,ll:[51.9505,0.4490]},
    {n:'B2 · River corridor',u:9, ll:[51.9510,0.4790]},
    {n:'B3 · Hedgerow network',u:4,ll:[51.9455,0.4770]},
    {n:'W1 · New woodland',u:19,ll:[51.9560,0.4620]}
  ]},
  deals:{note:'1 · 8 units', rows:[
    ['Redrow · Oxfordshire','8 units','Qualified','early','£232k'],
    ['West Oxfordshire DC','&mdash;','Early contact','early','&mdash;']
  ]},
  risk:{note:'1 medium', rows:[
    ['md','Condition downgrade','EV-W-03 surveyed as Poor. 19 projected units are at risk until the planting plan is revised.'],
    ['lo','Single LPA','All units sit in West Oxfordshire, which matches the buyers we are talking to.'],
    ['lo','Baseline agreed','Metric 4.0 baseline signed off by the landowner on 12 July.']
  ]},
  delivery:[
    ['lo','24 units available now','Across 5 parcels, all with habitat references issued.'],
    ['md','19 units unlock on planting','Woodland creation begins spring 2027.'],
    ['lo','30-year management secured','Conservation covenant in place across the holding.']
  ],
  filters:[
    ['Inventory',[['ti-map','Project','All 3'],['ti-progress','Availability','Any'],['ti-coin','Price','Any']]],
    ['BNG',[['ti-stars','Distinctiveness','Any'],['ti-heartbeat','Condition','Any'],['ti-leaf','Habitat','Any']]],
    ['Designations',[['ti-building-bank','LPA','West Oxon'],['ti-map-2','NCA','Cotswolds'],['ti-plant','LNRS','Any']]]
  ],
  table:{total:14, badge:1,
    cols:['Project','Availability','Specific type','Distinctiveness','Condition','Broad habitat','Habitat ref','Site','Area','Projected','Available','Sold','Parcels','Min price'],
    rows:[
     ['East parcels restoration','Available','Other neutral grassland','Medium','Moderate','Grassland','EV-G-02','B1','18.9 ha',24.0,24.0,0,5,'£29,000'],
     ['East parcels restoration','Available','Species-rich hedgerow','Medium','Good','Hedgerow','EV-H-01','B3','2.8 ha',6.4,6.4,0,3,'£23,500'],
     ['Woodland creation','Future','Lowland mixed deciduous woodland','High','Poor','Woodland and forest','EV-W-03','W1','11.2 ha',19.0,0,0,2,'£32,000'],
     ['Riparian buffers','Future','Other rivers and streams','High','Fairly good','Rivers and lakes','EV-R-01','B2','3.4 ha',7.2,0,0,2,'£36,000']
    ]}
},

/* ─────────────── Woodland carbon ─────────────── */
'wcc.portfolio':{
  es:'wcc', scope:'portfolio',
  allServicesHref:'inventory-portfolio-overview.html', allInventoryHref:'inventory-all.html',
  cover:[['77,300','Total planned'],['55,300','Available'],['20,400','Available in future'],['1,600','Sold'],['£24','Min price / credit','avg']],
  pipeline:{future:20400, available:55300, reserved:0, sold:1600, total:77300},
  breakdown:{title:'By programme', rows:[
    {n:'Wendling Beck',              f:12000, a:42000, r:0, s:1600, max:55600, go:null},
    {n:'Evenlode Landscape Recovery',f:4100,  a:9000,  r:0, s:0,    max:55600, go:'programme-overview.html'},
    {n:'Spains Hall Estate',         f:2800,  a:4300,  r:0, s:0,    max:55600, go:null},
    {n:'Boothby',                    f:1500,  a:0,     r:0, s:0,    max:55600, go:null}
  ]},
  map:{title:'Where the credits are', scale:0.06, points:[
    {n:'Wendling Beck',u:55600,ll:[52.6870,0.9260]},
    {n:'Spains Hall Estate',u:7100,ll:[51.9463,0.4609]},
    {n:'Evenlode Landscape Recovery',u:13100,ll:[51.8800,-1.5300],go:'programme-overview.html'},
    {n:'Boothby',u:1500,ll:[52.8500,-0.5500]}
  ]},
  deals:{note:'3 · 18,500 credits', rows:[
    ['Aviva · net zero portfolio','12,000 credits','Heads of terms','hot','£312k'],
    ['Suffolk Constabulary','4,500 credits','In negotiation','neg','£113k'],
    ['Norfolk brewery group','2,000 credits','Qualified','early','£48k']
  ]},
  risk:{note:'1 high', rows:[
    ['hi','Validation window','Wendling Beck must be validated within 3 years of planting. 12,000 future credits depend on the autumn window.'],
    ['md','Price softening','Woodland Carbon Code pricing fell 8% in Q2. Two open deals were quoted before the shift.'],
    ['md','Permanence buffer','The scheme requires a 20% buffer pool. Available figures are net of it, projected figures are not.'],
    ['lo','Registry status','All available credits are on the UK Woodland Carbon Registry.']
  ]},
  delivery:[
    ['lo','55,300 credits available now','Issued as Pending Issuance Units across 3 programmes.'],
    ['md','20,400 credits unlock on planting','Wendling Beck autumn 2027, Boothby spring 2028.'],
    ['md','First verification at year 5','2030 for Wendling Beck. PIUs convert to WCUs only after verification.']
  ],
  filters:[
    ['Inventory',[['ti-topology-star-3','Programme','All 4'],['ti-progress','Availability','Any'],['ti-coin','Price','Any']]],
    ['Woodland carbon',[['ti-certificate','Status','Any'],['ti-calendar','Vintage','Any'],['ti-trees','Species mix','Any']]],
    ['Designations',[['ti-building-bank','LPA','Any'],['ti-map-2','NCA','Any'],['ti-shield-check','Buffer pool','Included']]]
  ],
  table:{total:64, badge:1,
    cols:['Programme','Availability','Status','Vintage','Species mix','Scheme ref','Area','Projected','Available','Sold','Parcels','Min price'],
    rows:[
     ['Wendling Beck','Available','Validated','2026','Oak, birch, hazel','WCC-WB-0114','78 ha',42000,42000,1600,6,'£24'],
     ['Wendling Beck','Future','Registered','2028','Mixed native broadleaf','WCC-WB-0119','31 ha',12000,0,0,3,'£26'],
     ['Evenlode Landscape Recovery','Available','Validated','2026','Oak, field maple','WCC-EV-0042','22 ha',9000,9000,0,2,'£25'],
     ['Evenlode Landscape Recovery','Future','Registered','2027','Riparian willow, alder','WCC-EV-0051','9 ha',4100,0,0,2,'£27'],
     ['Spains Hall Estate','Available','Validated','2025','Oak, hornbeam','WCC-SHE-0008','11 ha',4300,4300,0,2,'£23'],
     ['Spains Hall Estate','Future','Registered','2027','Mixed native broadleaf','WCC-SHE-0012','7 ha',2800,0,0,1,'£26'],
     ['Boothby','Future','Under validation','2028','Upland mixed','WCC-BO-0003','5 ha',1500,0,0,1,'£28']
    ]}
},

'wcc.programme':{
  es:'wcc', scope:'programme', programme:'Evenlode',
  allServicesHref:'inventory-overview.html', allInventoryHref:'inventory-programme.html',
  cover:[['13,100','Total planned'],['9,000','Available'],['4,100','Available in future'],['0','Sold'],['£25','Min price / credit','avg']],
  pipeline:{future:4100, available:9000, reserved:0, sold:0, total:13100},
  breakdown:{title:'By project', rows:[
    {n:'Woodland creation', f:0,    a:9000, r:0, s:0, max:9000, go:null},
    {n:'Riparian buffers',  f:4100, a:0,    r:0, s:0, max:9000, go:null}
  ]},
  map:{title:'Where the credits are', scale:0.09, pad:0.25, points:[
    {n:'W1 · New woodland',u:9000,ll:[51.9560,0.4620]},
    {n:'B2 · River corridor',u:4100,ll:[51.9510,0.4790]}
  ]},
  deals:{note:'1 · 2,000 credits', rows:[
    ['Oxfordshire logistics group','2,000 credits','Qualified','early','£50k']
  ]},
  risk:{note:'1 medium', rows:[
    ['md','Validation window','Riparian planting must be validated within 3 years. 4,100 credits depend on the 2027 window.'],
    ['lo','Registry status','9,000 credits on the UK Woodland Carbon Registry as Pending Issuance Units.'],
    ['lo','Species mix agreed','Oak and field maple signed off with the landowner.']
  ]},
  delivery:[
    ['lo','9,000 credits available now','Validated 2026 vintage across 2 parcels.'],
    ['md','4,100 credits unlock on planting','Riparian willow and alder, spring 2027.'],
    ['md','First verification at year 5','2031. PIUs convert to WCUs only after verification.']
  ],
  filters:[
    ['Inventory',[['ti-map','Project','All 2'],['ti-progress','Availability','Any'],['ti-coin','Price','Any']]],
    ['Woodland carbon',[['ti-certificate','Status','Any'],['ti-calendar','Vintage','Any'],['ti-trees','Species mix','Any']]],
    ['Designations',[['ti-building-bank','LPA','West Oxon'],['ti-map-2','NCA','Cotswolds'],['ti-shield-check','Buffer pool','Included']]]
  ],
  table:{total:8, badge:1,
    group:{col:3, sum:8, label:'Vintage', suffix:'credits'},
    hide:[5,6,10],
    cols:['Project','Availability','Status','Vintage','Species mix','Scheme ref','Site','Area','Projected','Available','Sold','Min price'],
    rows:[
     ['Woodland creation','Available','Validated','2025','Oak, field maple','WCC-EV-0031','W1','9 ha',3600,3600,0,'£24'],
     ['Hedgerow planting','Available','Validated','2025','Hawthorn, blackthorn','WCC-EV-0034','H3','4 ha',900,900,0,'£24'],
     ['Woodland creation','Available','Validated','2026','Oak, field maple','WCC-EV-0042','W1','13 ha',5400,5400,0,'£25'],
     ['Shelterbelts','Available','Validated','2026','Alder, hazel','WCC-EV-0044','S2','6 ha',1800,1800,0,'£26'],
     ['Scrub mosaic','Reserved','Validated','2026','Mixed native scrub','WCC-EV-0047','M1','5 ha',1400,0,0,'£26'],
     ['Riparian buffers','Future','Registered','2027','Riparian willow, alder','WCC-EV-0051','B2','9 ha',4100,0,0,'£27'],
     ['Woodland creation','Future','Registered','2027','Oak, small-leaved lime','WCC-EV-0055','W4','11 ha',4600,0,0,'£27'],
     ['Floodplain woodland','Future','In preparation','2028','Willow, alder, birch','WCC-EV-0060','F1','7 ha',2800,0,0,'£29']
    ]}
},

/* ─────────────── Soil carbon ─────────────── */
'soc.programme':{
  es:'soc', scope:'programme', programme:'Evenlode',
  allServicesHref:'inventory-overview.html', allInventoryHref:'inventory-programme.html',
  cover:[['5,400','Total planned'],['0','Available'],['5,400','Available in future'],['0','Sold'],['&mdash;','Min price / credit','']],
  pipeline:{future:5400, available:0, reserved:0, sold:0, total:5400},
  breakdown:{title:'By project', rows:[
    {n:'East parcels restoration', f:5400, a:0, r:0, s:0, max:5400, go:null}
  ]},
  map:{title:'Where the credits are', scale:0.11, pad:0.25, points:[
    {n:'B1 · East grassland',u:5400,ll:[51.9505,0.4490]}
  ]},
  deals:{note:'none open', rows:[
    ['No open deals','&mdash;','Not registered','early','&mdash;']
  ]},
  risk:{note:'1 high', rows:[
    ['hi','No accepted code','Soil carbon has no UK code with buyer acceptance yet. Nothing here can be sold until one exists.'],
    ['md','Baseline sampling','Sampling completed on 3 parcels. A repeat at year 5 is needed to claim anything.'],
    ['lo','Landowner agreement','The management change is already covered by the existing covenant.']
  ]},
  delivery:[
    ['md','5,400 credits projected','Modelled from the baseline sampling. Not registered and not sellable.'],
    ['md','Depends on a code emerging','Track the market rather than the run. Revisit at the next quarterly review.'],
    ['lo','No cost to holding it','The management change is already funded by the BNG and carbon work on the same parcels.']
  ],
  filters:[
    ['Inventory',[['ti-map','Project','All 1'],['ti-progress','Availability','Any'],['ti-coin','Price','Any']]],
    ['Soil carbon',[['ti-certificate','Code','None yet'],['ti-calendar','Baseline year','2026'],['ti-flask','Sampling','Complete']]]
  ],
  table:{total:3, badge:1,
    cols:['Project','Availability','Code','Baseline year','Sampling','Site','Area','Projected','Available','Sold','Min price'],
    rows:[
     ['East parcels restoration','Future','None yet','2026','Complete','B1','18.9 ha',5400,0,0,'&mdash;']
    ]}
}
};
