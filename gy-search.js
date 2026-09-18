/* gy-search.js - a search is not a filter panel, it is a Requirement: what a
   buyer needs, written down. A Requirement holds a scope (service, geography,
   programme) and one or more Lines. A Line is one thing: a type, how certain
   it has to be, how many, and the most you will pay. Running it produces
   Matches, and a Match knows how well it answers its Line.

   The certainty ladder is the second axis. Availability in gy-inventory.js is
   commercial (Projected, Available, Reserved, Sold); the ladder is how far
   through its own regime a line has got. Each service names the rungs
   differently, so the ladder is per service and the answer is always a floor:
   at least this certain. */
(function(){

  /* [key, label, label in a sentence]. The third form exists because
     lowercasing "Validated, PIU" mangles the acronym. */
  var LADDER = {
    bng: [['feasibility','Feasibility','feasibility'], ['designed','Designed','designed'],
          ['secured','Legally secured','legally secured'], ['registered','Registered','registered'],
          ['available','Available now','available now']],
    wcc: [['projected','Projected','projected'], ['validated','Validated, PIU','validated (PIU)'],
          ['verified','Verified, WCU','verified (WCU)'], ['available','Available now','available now']],
    soc: [['projected','Projected','projected'], ['validated','Validated','validated'],
          ['verified','Verified','verified'], ['available','Available now','available now']]
  };

  function ladder(es){
    return (LADDER[es] || []).map(function(r, i){ return {key:r[0], label:r[1], lc:r[2], rank:i}; });
  }
  function rankOfKey(es, key){
    var l = LADDER[es] || [];
    for(var i=0;i<l.length;i++) if(l[i][0]===key) return i;
    return 0;
  }
  function topKey(es){ var l = LADDER[es] || []; return l.length ? l[l.length-1][0] : ''; }
  function labelOf(es, key){
    var l = LADDER[es] || [];
    for(var i=0;i<l.length;i++) if(l[i][0]===key) return l[i][1];
    return key;
  }
  function lcOf(es, key){
    var l = LADDER[es] || [];
    for(var i=0;i<l.length;i++) if(l[i][0]===key) return l[i][2];
    return key;
  }
  /* a line that is sellable today sits on the top rung whatever its registry
     stage says, because that is what the buyer actually cares about */
  function rankOfRow(r){
    return r.avail === 'Available' ? rankOfKey(r.es, 'available') : rankOfKey(r.es, r.stage);
  }

  /* -- the requirement ---------------------------------------------------- */

  function newLine(es){
    return {es:es, type:'', cond:'', floor:topKey(es), units:'', pmax:''};
  }
  /* prog is the page's altitude: 'Evenlode' on a programme page, '' at
     portfolio. scope.prog is the buyer's own constraint, which only exists at
     portfolio, where '' means every programme. */
  function newReq(es, prog){
    es = es || 'bng';
    return {es:es, prog:prog || '', scope:{lpa:'', nca:'', lnrs:'', prox:'', prog:''},
            name:'', lines:[newLine(es)]};
  }
  /* which programme a run is scoped to: the page's, else the buyer's, else all */
  function progOf(req, prog){ return prog || (req && req.scope && req.scope.prog) || ''; }
  function setService(req, es){
    req.es = es;
    req.lines = req.lines.map(function(){ return newLine(es); });
    return req;
  }

  /* -- matching ----------------------------------------------------------- */

  function priceOf(es, type){
    var p = window.GY_DEALS_API ? window.GY_DEALS_API.price(es, type) : null;
    return p ? p.modelled : null;
  }
  /* the broad habitat of a type, read from every row rather than from what is
     sellable, so a type with nothing available still knows its neighbours */
  function broadOf(es, type, prog){
    var all = window.GY_INV_API ? window.GY_INV_API.rows(prog) : [];
    var r = all.filter(function(x){ return x.es===es && x.type===type; })[0];
    return r ? r.broad : '';
  }
  /* Reserved and Sold units are not for sale, so search never sees them */
  function supply(es, prog){
    return (window.GY_INV_API ? window.GY_INV_API.rows(prog) : []).filter(function(r){
      return r.es === es && (r.avail === 'Available' || r.avail === 'Projected');
    });
  }

  function fitOf(line, r, broad){
    var typeOk = !line.type || r.type === line.type;
    var condOk = !line.cond || !r.cond || r.cond === line.cond;
    if(typeOk && condOk) return r.avail === 'Available' ? 'exact' : 'partial';
    if(!line.type) return null;
    if(r.es === 'bng') return (broad && r.broad === broad) ? 'substitute' : null;
    return 'substitute';   /* carbon: another vintage of the same service */
  }

  var FIT_ORDER = {exact:0, partial:1, substitute:2};

  function runLine(req, line, prog){
    var floorRank = rankOfKey(line.es, line.floor);
    var broad = line.type ? broadOf(line.es, line.type, prog) : '';
    var pool = supply(line.es, prog).filter(function(r){
      if(rankOfRow(r) < floorRank) return false;
      if(req.scope.lpa && r.lpa && r.lpa !== req.scope.lpa) return false;
      if(req.scope.nca && r.nca && r.nca !== req.scope.nca) return false;
      if(req.scope.lnrs && r.lnrs && r.lnrs !== req.scope.lnrs) return false;
      if(line.pmax){ var p = priceOf(line.es, r.type); if(p && p > +line.pmax) return false; }
      return true;
    });

    var scored = [];
    pool.forEach(function(r){
      var f = fitOf(line, r, broad);
      if(f) scored.push({row:r, fit:f, price:priceOf(line.es, r.type)});
    });
    scored.sort(function(a,b){
      var d = FIT_ORDER[a.fit] - FIT_ORDER[b.fit];
      return d || (b.row.units - a.row.units);
    });

    var need = line.units ? +line.units : 0;
    var got = 0, taken = [];
    scored.forEach(function(m){
      /* substitutes only appear once the real thing has run out */
      if(m.fit === 'substitute' && need && got >= need) return;
      if(m.fit === 'substitute' && !need) return;
      var take = need ? Math.min(m.row.units, Math.max(need - got, 0)) : m.row.units;
      if(need && take <= 0) return;
      got += take;
      taken.push({row:m.row, fit:m.fit, price:m.price, units:take});
    });

    return {line:line, matches:taken, need:need, got:got,
            short: need ? Math.max(need - got, 0) : 0};
  }

  function run(req, prog){
    var p = progOf(req, prog);
    var lines = req.lines.map(function(l){ return runLine(req, l, p); });
    return {lines:lines,
            rows:   lines.reduce(function(s,l){ return s + l.matches.length; }, 0),
            units:  lines.reduce(function(s,l){ return s + l.got; }, 0),
            need:   lines.reduce(function(s,l){ return s + l.need; }, 0),
            short:  lines.reduce(function(s,l){ return s + l.short; }, 0)};
  }

  /* -- helpers the pages need --------------------------------------------- */

  function typesFor(es, prog){
    var out = [];
    supply(es, prog).forEach(function(r){ if(out.indexOf(r.type) < 0) out.push(r.type); });
    return out.sort();
  }
  function condsFor(prog){
    var out = [];
    supply('bng', prog).forEach(function(r){ if(r.cond && out.indexOf(r.cond) < 0) out.push(r.cond); });
    return ['Poor','Moderate','Good','Excellent'].filter(function(c){ return out.indexOf(c) >= 0; });
  }
  function chips(req){
    var c = [];
    if(req.scope.prog) c.push(['Programme', req.scope.prog]);
    if(req.scope.lpa)  c.push(['LPA', req.scope.lpa]);
    if(req.scope.nca)  c.push(['NCA', req.scope.nca]);
    if(req.scope.lnrs) c.push(['LNRS', req.scope.lnrs]);
    req.lines.forEach(function(l, i){
      var bits = [l.type || 'Any type'];
      if(l.cond) bits.push(l.cond);
      bits.push('at least ' + lcOf(l.es, l.floor));
      if(l.units) bits.push(l.units + ' units');
      if(l.pmax)  bits.push('max £' + (+l.pmax).toLocaleString());
      c.push(['Line ' + (i+1), bits.join(' · ')]);
    });
    return c;
  }

  /* one requirement travels between the drawer and the page */
  var LS = 'gyRequirement';
  function save(req){ try{ localStorage.setItem(LS, JSON.stringify(req)); }catch(e){} }
  function load(){
    try{ var v = localStorage.getItem(LS); return v ? JSON.parse(v) : null; }catch(e){ return null; }
  }
  function clear(){ try{ localStorage.removeItem(LS); }catch(e){} }

  window.GY_SEARCH_API = {
    ladder:ladder, labelOf:labelOf, lcOf:lcOf, rankOfRow:rankOfRow, topKey:topKey,
    newReq:newReq, newLine:newLine, setService:setService, progOf:progOf,
    run:run, runLine:runLine, supply:supply,
    typesFor:typesFor, condsFor:condsFor, chips:chips, priceOf:priceOf,
    save:save, load:load, clear:clear
  };
})();
