/* gy-todos.js - the single source of truth for to-dos across the GY OS prototype.
   Every page that shows a to-do reads from here, and ticking one anywhere is
   remembered in localStorage so the same state shows up on every other page. */
(function(){
  var TODAY = new Date(2026, 8, 14); // Mon 14 Sep 2026

  var ME = 'Caitlin Ciceri';

  var PEOPLE = {
    'Caitlin Ciceri':{ini:'CC',c:'#1D9E75'},
    'Emily Norton'  :{ini:'EN',c:'#378ADD'},
    'Harry Fox'     :{ini:'HF',c:'#EF9F27'},
    'Izzie Bell'    :{ini:'IB',c:'#7F77DD'},
    'Millie Gray'   :{ini:'MG',c:'#D4537E'},
    'Josh Read'     :{ini:'JR',c:'#639922'},
    'Vertical Lead' :{ini:'VL',c:'#5F5E5A'}
  };

  var DELIVERABLES = [
    {k:'sdm-ev', name:'Customer Demand', full:'Customer Demand Mapping', prog:'Evenlode',
     ic:'ti-checkup-list', bg:'var(--tealbg)',  fg:'var(--teald)',  href:'document.html?mode=deliverable'},
    {k:'iqa-ev', name:'Investor Q&A',    full:'Investor Q&A pack',      prog:'Evenlode',
     ic:'ti-checkup-list', bg:'var(--bluebg)',  fg:'var(--blued)',  href:'investor-qa-pack-example.html'},
    {k:'sdm-sh', name:'Customer Demand', full:'Customer Demand Mapping', prog:'Spains Hall',
     ic:'ti-checkup-list', bg:'var(--tealbg)',  fg:'var(--teald)',  href:null},
    {k:'bep-bo', name:'Baseline evidence',full:'Baseline evidence pack', prog:'Boothby',
     ic:'ti-checkup-list', bg:'var(--amberbg)', fg:'var(--amberd)', href:null},
    {k:'none',   name:'No deliverable',  full:'Not in a deliverable',   prog:'',
     ic:'ti-circle-dashed',bg:'var(--graybg)',  fg:'var(--grayd)',  href:null}
  ];

  /* on: due date. step: the workflow step it hangs off. node: canvas node id. */
  var ITEMS = [
    {id:'t01',t:'Kick-off meeting',                        who:ME,             d:'sdm-ev', on:'',           step:'1.1 Kick-off meeting',                      node:'kickoff',     done:true},
    {id:'t02',t:'Discovery information request',           who:ME,             d:'sdm-ev', on:'',           step:'1.2 Discovery information request',         node:'sendq',       done:true},
    {id:'t03',t:'Check: Information complete?',            who:ME,             d:'sdm-ev', on:'',           step:'1.3 Check: Information complete?',          node:'gate1',       done:true},
    {id:'t04',t:'GPAP Analysis',                           who:'Harry Fox',    d:'sdm-ev', on:'',           step:'2.1 GPAP Analysis',                         node:'registries',  done:true},
    {id:'t05',t:'Abstraction licences in catchment',       who:'Harry Fox',    d:'sdm-ev', on:'',           step:'2.2 Abstraction licences in catchment',     node:'desktop',     done:true},
    {id:'t06',t:'If Nature Finance: public funding scan',  who:'Izzie Bell',   d:'sdm-ev', on:'',           step:'2.3 If Nature Finance: public funding scan',node:'evidence',    done:true},
    {id:'t07',t:'Beneficiary map and Buyer list',          who:ME,             d:'sdm-ev', on:'2026-09-17', step:'2.4 Beneficiary map & Buyer list',          node:'shortbuyers', done:false},
    {id:'t08',t:'Check with Trade',                        who:'Emily Norton', d:'sdm-ev', on:'2026-09-18', step:'2.5 Check with Trade',                      node:'tradecheck',  done:false},
    {id:'t09',t:'Check: Information complete?',            who:ME,             d:'sdm-ev', on:'2026-09-21', step:'2.6 Check: Information complete?',          node:'gate3',       done:false},
    {id:'t23',t:'Research Ecosystem Services',             who:ME,             d:'sdm-ev', on:'',           step:'3.1 Research Ecosystem Services',           node:'shortes',     done:true},
    {id:'t24',t:'Check: Information complete?',            who:ME,             d:'sdm-ev', on:'',           step:'3.2 Check: Information complete?',          node:'gate2',       done:true},
    {id:'t25',t:'Create summary',                          who:ME,             d:'sdm-ev', on:'2026-09-24', step:'4.1 Create summary',                        node:'finalprep',   done:false},
    {id:'t26',t:'Generate PDF with summary',               who:ME,             d:'sdm-ev', on:'',           step:'4.2 Generate PDF with summary',             node:'verdict',     done:false},
    {id:'t27',t:'Share summary with customer',             who:ME,             d:'sdm-ev', on:'',           step:'4.3 Share summary with customer',           node:'share',       done:false},
    {id:'t28',t:'Send to Data platform',                   who:ME,             d:'sdm-ev', on:'',           step:'4.4 Send to Data platform',                 node:'platform',    done:false},
    {id:'t29',t:'Gather learnings',                        who:'Izzie Bell',   d:'sdm-ev', on:'',           step:'4.5 Gather learnings',                      node:'done',        done:false},

    {id:'t10',t:'Draft the answers to the six diligence questions',       who:ME,             d:'iqa-ev', on:'2026-09-21', step:'2.1 Draft answers',       node:null, done:false},
    {id:'t11',t:'Pull the latest unit pricing into the pack',             who:'Harry Fox',    d:'iqa-ev', on:'2026-09-21', step:'2.2 Evidence',            node:null, done:false},
    {id:'t12',t:'Confirm which investor questions are in scope',          who:ME,             d:'iqa-ev', on:'2026-09-16', step:'1.1 Scope call',          node:null, done:false},

    {id:'t13',t:'Re-run the BNG baseline after the hedgerow survey',      who:ME,             d:'sdm-sh', on:'2026-09-17', step:'2.1 Desktop research',    node:null, done:false},
    {id:'t14',t:'Get the tenancy schedule from the estate office',        who:'Millie Gray',  d:'sdm-sh', on:'2026-09-12', step:'1.3 Receive input',       node:null, done:false},
    {id:'t15',t:'Confirm the kick-off date with the landowner',           who:'Millie Gray',  d:'sdm-sh', on:'',           step:'1.1 Kick-off call',       node:null, done:true},

    {id:'t16',t:'Collect the peat depth survey from the contractor',      who:'Josh Read',    d:'bep-bo', on:'2026-09-23', step:'1.3 Receive input',       node:null, done:false},
    {id:'t17',t:'Check the WCC validation window before we commit',       who:ME,             d:'bep-bo', on:'2026-09-25', step:'2.1 Desktop research',    node:null, done:false},

    {id:'t18',t:'Prep talking points for the James call',                 who:ME,             d:'none',   on:'2026-09-14', step:'', node:null, done:false},
    {id:'t19',t:'Reply to the Boothby onboarding email',                  who:ME,             d:'none',   on:'2026-09-11', step:'', node:null, done:false},
    {id:'t20',t:'Book the quarterly review with the Vertical Lead',       who:ME,             d:'none',   on:'2026-09-22', step:'', node:null, done:false},
    {id:'t21',t:'Tidy the shared shelf of ES rule books',                 who:ME,             d:'none',   on:'',           step:'', node:null, done:false},
    {id:'t22',t:'Write up the Spains Hall handover note',                 who:'Emily Norton', d:'none',   on:'',           step:'', node:null, done:true}
  ];

  var KEY='gyTodoDone';
  function overrides(){ try{ return JSON.parse(localStorage.getItem(KEY)||'{}'); }catch(e){ return {}; } }
  function saveOverrides(o){ try{ localStorage.setItem(KEY, JSON.stringify(o)); }catch(e){} }

  var MONTH=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function parse(on){ if(!on) return null; var p=on.split('-'); return new Date(+p[0], +p[1]-1, +p[2]); }
  function days(on){ var d=parse(on); if(!d) return null; return Math.round((d-TODAY)/86400000); }

  var API = {
    me:ME, today:TODAY, people:PEOPLE, deliverables:DELIVERABLES,

    all:function(){
      var o=overrides();
      return ITEMS.map(function(x){
        var n={}; for(var k in x) n[k]=x[k];
        if(o.hasOwnProperty(x.id)) n.done=o[x.id];
        n.dayn=days(x.on);
        n.dstate = (n.done||n.dayn===null) ? '' : (n.dayn<0 ? 'over' : (n.dayn<=7 ? 'soon' : ''));
        n.due = x.on ? (parse(x.on).getDate()+' '+MONTH[parse(x.on).getMonth()]) : '';
        n.when = n.dayn===null ? '' : (n.dayn<0 ? (n.dayn===-1?'Yesterday':(-n.dayn)+' days ago')
               : n.dayn===0 ? 'Today' : n.dayn===1 ? 'Tomorrow'
               : n.dayn<=6 ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][parse(x.on).getDay()]
               : n.dayn<=13 ? 'Next week' : n.due);
        n.person = PEOPLE[x.who] || {ini:'?',c:'#9C9A92'};
        n.deliverable = DELIVERABLES.filter(function(d){return d.k===x.d;})[0];
        return n;
      });
    },
    mine:function(){ return API.all().filter(function(x){return x.who===ME;}); },
    forDeliverable:function(k){ return API.all().filter(function(x){return x.d===k;}); },
    stats:function(k){
      var l = k ? API.forDeliverable(k) : API.all();
      var d = l.filter(function(x){return x.done;}).length;
      return {done:d, total:l.length, open:l.length-d,
              pct: l.length ? Math.round(d/l.length*100) : 0,
              label: d+' of '+l.length};
    },
    myOpen:function(){ return API.mine().filter(function(x){return !x.done;}); },
    /* soonest first, undated last */
    bySoonest:function(list){
      return list.slice().sort(function(a,b){
        if(a.dayn===null && b.dayn===null) return 0;
        if(a.dayn===null) return 1;
        if(b.dayn===null) return -1;
        return a.dayn-b.dayn;
      });
    },
    toggle:function(id){
      var o=overrides(), cur=null;
      API.all().forEach(function(x){ if(x.id===id) cur=x.done; });
      o[id]=!cur; saveOverrides(o);
      try{ window.dispatchEvent(new CustomEvent('gy-todos-changed',{detail:{id:id,done:o[id]}})); }catch(e){}
      return o[id];
    },
    reset:function(){ saveOverrides({}); }
  };

  window.GYT = API;
})();
