/* gy-projects.js - the single source of truth for Projects in the prototype.
   projects.html renders the full grouped table from this; programme-overview.html
   renders the top slice of the same list, so the two can never drift.
   rank = selling priority across the whole programme, not within the group.
   The land a Project sits on lives in gy-sites.js, not here. */
(function(){
  var ITEMS = [
    {id:'wychwood', rank:1, name:'Wychwood Edge',    es:'bng', units:180,
     stage:'Registered · assessment due',            value:'£74k',  planned:'£186k',
     next:'Add assessment',       note:'£74k available',  top:true},
    {id:'ascott',   rank:2, name:'Ascott Floodplain', es:'bng', units:340,
     stage:'Pending (submitted) · s106 signed',      value:'',      planned:'£268k',
     next:'Mark registered',      note:'registers next',  top:true},
    {id:'bruern',   rank:3, name:'Bruern Banks',      es:'bng', units:150,
     stage:'Registered',                              value:'£105k', planned:'£105k',
     next:'',                     note:'£105k available', top:true},
    {id:'coldron',  rank:4, name:'Coldron Mill',      es:'bng', units:95,
     stage:'Registered',                              value:'£40k',  planned:'£40k',
     next:'',                     note:'£40k available',  top:false},
    {id:'charlbury',rank:5, name:'Charlbury Meadows', es:'wcc', units:210,
     stage:'PIU pending · 2028 window opens 1 Sep',  value:'',      planned:'£84k',
     next:'Submit PIU application', note:'PIU pending',  top:false},
    {id:'fifield',  rank:6, name:'Fifield Pastures',  es:'bng', units:120,
     stage:'Draft · parcels not yet allocated',      value:'',      planned:'£39k',
     next:'Allocate parcels',     note:'draft',           top:false},
    {id:'lyneham',  rank:7, name:'Lyneham Heath',     es:'wcc', units:145,
     stage:'Draft',                                   value:'',      planned:'£58k',
     next:'',                     note:'draft',           top:false},
    {id:'charlbury-soils', rank:8, name:'Charlbury Soils', es:'soc', units:120,
     stage:'Baselining · first sampling round booked', value:'',      planned:'£36k',
     next:'Book sampling',        note:'baselining',      top:false},
    {id:'bruern-soils',    rank:9, name:'Bruern Soils',    es:'soc', units:90,
     stage:'Draft · awaiting baseline method',        value:'',      planned:'£27k',
     next:'Choose method',        note:'draft',           top:false}
  ];

  window.GY_PROJECTS = ITEMS;
  window.GY_PROJECTS_API = {
    all:    function(){ return ITEMS.slice(); },
    byRank: function(){ return ITEMS.slice().sort(function(a,b){return a.rank-b.rank;}); },
    top:    function(n){ return window.GY_PROJECTS_API.byRank().slice(0, n||3); },
    forEs:  function(k){ return ITEMS.filter(function(p){return p.es===k;}); },
    count:  function(k){ return k ? window.GY_PROJECTS_API.forEs(k).length : ITEMS.length; },
    units:  function(k){ return (k?window.GY_PROJECTS_API.forEs(k):ITEMS)
                           .reduce(function(s,p){return s+p.units;},0); }
  };
})();
