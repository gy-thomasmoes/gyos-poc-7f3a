/* gy-sites.js - the land record for the programme. A Site is a farm or estate
   with an address and a contact; it carries no scheme, stage or units, because
   those belong to the Project its parcels are allocated to. Land is entered
   once and any ecosystem service can draw on it, which is why Bruern Estate
   feeds a BNG Project and a WCC one.
   Project ids match gy-projects.js. sites.html and programme-overview.html
   both read from here, so the land never has two versions. */
(function(){
  var SITES = [
    {id:'ascott-farm',   name:'Ascott Farm, Kingham', addr:'Kingham OX7 6YD · Land Title ON 384112',
     parcels:3, ha:42.3, use:'Mixed',   contact:'Rob Hartley',
     alloc:[{project:'ascott', parcels:3}], note:''},
    {id:'wychwood-edge', name:'Wychwood Edge Farm',   addr:'Leafield OX29 9PJ',
     parcels:3, ha:31.5, use:'Pasture', contact:'Jane Amory',
     alloc:[{project:'wychwood', parcels:3}], note:''},
    {id:'bruern-estate', name:'Bruern Estate',        addr:'Milton-under-Wychwood OX7 6PA',
     parcels:3, ha:38.0, use:'Mixed',   contact:'Estate office',
     alloc:[{project:'bruern', parcels:1},{project:'lyneham', parcels:1},{project:'bruern-soils', parcels:1}], note:''},
    {id:'coldron-mill',  name:'Coldron Mill',         addr:'Shipton-under-Wychwood OX7 6DA',
     parcels:1, ha:12.8, use:'Pasture', contact:'Peter Whitlock',
     alloc:[{project:'coldron', parcels:1}], note:''},
    {id:'fifield-manor', name:'Fifield Manor Farm',   addr:'Fifield OX7 6HL',
     parcels:2, ha:18.4, use:'Arable',  contact:'Sarah Dunne',
     alloc:[], note:'Fifield Pastures is in Draft'},
    {id:'charlbury-down',name:'Charlbury Down',       addr:'Charlbury OX7 3HH',
     parcels:4, ha:29.6, use:'Arable',  contact:'Tom Ashby',
     alloc:[{project:'charlbury', parcels:3},{project:'charlbury-soils', parcels:1}], note:''},
    {id:'kingham-hill',  name:'Kingham Hill',         addr:'Kingham OX7 6TH',
     parcels:2, ha:15.2, use:'Arable',  contact:'Kingham Hill Trust',
     alloc:[], note:'added 3 Sep · no Project yet'}
  ];

  /* Approximate boundaries in the Evenlode valley, west Oxfordshire.
     Indicative shapes for the prototype, not surveyed parcels. */
  var GEO = {"ascott-farm":[[-1.63356,51.912],[-1.63542,51.914],[-1.63911,51.915],[-1.64161,51.91307],[-1.64232,51.91072],[-1.639,51.90929],[-1.63552,51.91008],[-1.63356,51.912]],"wychwood-edge":[[-1.53091,51.836],[-1.53288,51.83764],[-1.53589,51.8384],[-1.53811,51.83692],[-1.53813,51.83507],[-1.53588,51.83361],[-1.53216,51.8338],[-1.53091,51.836]],"bruern-estate":[[-1.59412,51.878],[-1.59548,51.87995],[-1.59904,51.88082],[-1.60269,51.87939],[-1.60215,51.87677],[-1.59896,51.8754],[-1.59472,51.87546],[-1.59412,51.878]],"coldron-mill":[[-1.58782,51.868],[-1.58817,51.86942],[-1.59054,51.86945],[-1.59204,51.86861],[-1.59202,51.8674],[-1.59054,51.86654],[-1.58819,51.8666],[-1.58782,51.868]],"fifield-manor":[[-1.64224,51.867],[-1.643,51.86855],[-1.64573,51.86897],[-1.64768,51.8678],[-1.64786,51.86615],[-1.64559,51.86542],[-1.64336,51.86573],[-1.64224,51.867]],"charlbury-down":[[-1.48646,51.874],[-1.48737,51.87603],[-1.49086,51.87632],[-1.49333,51.87499],[-1.49368,51.87291],[-1.49087,51.87166],[-1.48771,51.87223],[-1.48646,51.874]],"kingham-hill":[[-1.62986,51.926],[-1.6311,51.92747],[-1.63357,51.92755],[-1.63563,51.92678],[-1.63558,51.92523],[-1.63372,51.92406],[-1.63108,51.92452],[-1.62986,51.926]]};

  function esOf(s){
    /* the services drawing on this site, via the Projects its parcels feed */
    var out=[];
    s.alloc.forEach(function(a){
      var p = (window.GY_PROJECTS||[]).filter(function(x){return x.id===a.project;})[0];
      if(p && out.indexOf(p.es)<0) out.push(p.es);
    });
    return out;
  }
  function sum(list, f){ return list.reduce(function(t,x){return t+f(x);},0); }
  function r1(n){ return Math.round(n*10)/10; }

  window.GY_SITES = SITES;
  window.GY_SITES_API = {
    all:        function(){ return SITES.slice(); },
    get:        function(id){ return SITES.filter(function(s){return s.id===id;})[0]; },
    count:      function(){ return SITES.length; },
    parcels:    function(){ return sum(SITES, function(s){return s.parcels;}); },
    area:       function(){ return r1(sum(SITES, function(s){return s.ha;})); },
    unallocated:function(){ return SITES.filter(function(s){return !s.alloc.length;}); },
    unallocatedParcels: function(){ return sum(window.GY_SITES_API.unallocated(), function(s){return s.parcels;}); },
    unallocatedArea:    function(){ return r1(sum(window.GY_SITES_API.unallocated(), function(s){return s.ha;})); },
    forProject: function(pid){ return SITES.filter(function(s){
                  return s.alloc.some(function(a){return a.project===pid;}); }); },
    parcelsByEs:function(k){ return sum(SITES, function(s){
                  return sum(s.alloc.filter(function(a){
                    var p=(window.GY_PROJECTS||[]).filter(function(x){return x.id===a.project;})[0];
                    return p && p.es===k;
                  }), function(a){return a.parcels;}); }); },
    es:         esOf,
    geo:        function(){ return {type:'FeatureCollection', features: SITES.map(function(s){
                  var e = esOf(s);
                  return {type:'Feature',
                          properties:{id:s.id, name:s.name, ref:s.name.split(/[ ,]/)[0], es:(e[0]||'none'), mixed:e.length>1},
                          geometry:{type:'Polygon', coordinates:[GEO[s.id]]}};
                }) }; }
  };
})();
