/* gy-calendar.js - the meetings of the programme, past and upcoming, and the
   meeting notes generated from them. One list, read by Home's Today rail, the
   Meeting notes page and the Programme Overview, so a meeting never appears
   with two different times or two different sets of attendees.

   note:  the page the generated note lives on, or '' when nothing was written
   state: 'noted'    a note exists
          'pending'  the meeting has happened, the note has not been written
          'upcoming' still to come; a note will be generated from the call
   step:  the workflow step the meeting hangs off, matching gy-todos.js
   node:  canvas node id, so a meeting can open the step it belongs to */
(function(){
  var TODAY = new Date(2026, 8, 15); // Tue 15 Sep 2026

  var ITEMS = [
    {id:'m-standup', title:'Evenlode standup',           on:'2026-09-15', at:'09:30', mins:30,
     prog:'Evenlode', deliverable:'', who:['Caitlin Ciceri','Emily Norton','Harry Fox'],
     note:'', state:'upcoming', step:'', node:''},
    {id:'m-trade',   title:'Trade check-in',             on:'2026-09-15', at:'11:00', mins:45,
     prog:'Evenlode', deliverable:'Customer Demand Mapping', who:['Caitlin Ciceri','Emily Norton'],
     note:'', state:'upcoming', step:'2.5 Check with Trade', node:'tradecheck'},
    {id:'m-james',   title:'Client call · James Ruggles', on:'2026-09-15', at:'14:00', mins:60,
     prog:'Evenlode', deliverable:'Customer Demand Mapping', who:['Caitlin Ciceri','James Ruggles'],
     note:'', state:'upcoming', step:'2.4 Beneficiary map & Buyer list', node:'shortbuyers'},

    {id:'m-buyers',  title:'Buyer list review',          on:'2026-09-11', at:'10:00', mins:45,
     prog:'Evenlode', deliverable:'Customer Demand Mapping', who:['Caitlin Ciceri','Emily Norton','Izzie Bell'],
     note:'meeting-note-buyer-review.html', state:'noted', step:'2.4 Beneficiary map & Buyer list', node:'shortbuyers'},
    {id:'m-es',      title:'Ecosystem services walkthrough', on:'2026-09-08', at:'15:00', mins:60,
     prog:'Evenlode', deliverable:'Customer Demand Mapping', who:['Caitlin Ciceri','Harry Fox'],
     note:'', state:'pending', step:'3.1 Research Ecosystem Services', node:'shortes'},
    {id:'m-landowner', title:'Landowner visit · Kingham Hill', on:'2026-09-03', at:'11:30', mins:90,
     prog:'Evenlode', deliverable:'', who:['Caitlin Ciceri','Kingham Hill Trust'],
     note:'', state:'pending', step:'', node:''},
    {id:'m-kickoff', title:'Demand Mapping kick-off call', on:'2026-07-01', at:'10:00', mins:60,
     prog:'Evenlode', deliverable:'Customer Demand Mapping', who:['Caitlin Ciceri','James Ruggles','Millie Gray'],
     note:'meeting-note-kickoff.html', state:'noted', step:'1.1 Kick-off meeting', node:'kickoff'},

    {id:'m-review',  title:'Quarterly review',           on:'2026-09-22', at:'13:00', mins:60,
     prog:'Evenlode', deliverable:'', who:['Caitlin Ciceri','Vertical Lead'],
     note:'', state:'upcoming', step:'', node:''}
  ];

  var MONTH=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var DAY=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  function parse(on){ var p=on.split('-'); return new Date(+p[0], +p[1]-1, +p[2]); }
  function days(on){ return Math.round((parse(on)-TODAY)/86400000); }

  function decorate(x){
    var n={}; for(var k in x) n[k]=x[k];
    var d=parse(x.on), dn=days(x.on);
    n.dayn=dn;
    n.date = d.getDate()+' '+MONTH[d.getMonth()];
    n.when = dn===0 ? 'Today' : dn===1 ? 'Tomorrow' : dn===-1 ? 'Yesterday'
           : (dn>1 && dn<=6) ? DAY[d.getDay()] : (dn<0 && dn>=-6) ? 'Last '+DAY[d.getDay()]
           : n.date;
    n.today = dn===0;
    n.past  = dn<0;
    n.attendees = x.who.length<=2 ? x.who.map(function(w){return w.split(' ')[0];}).join(' and ')
                : x.who.slice(0,2).map(function(w){return w.split(' ')[0];}).join(', ')+' +'+(x.who.length-2);
    return n;
  }
  function all(){ return ITEMS.map(decorate); }
  function byTime(list){ return list.slice().sort(function(a,b){
    return a.on===b.on ? a.at.localeCompare(b.at) : a.on.localeCompare(b.on); }); }

  window.GY_CAL_API = {
    today:      TODAY,
    all:        function(){ return byTime(all()); },
    get:        function(id){ return all().filter(function(m){return m.id===id;})[0]; },
    forToday:   function(){ return byTime(all().filter(function(m){return m.today;})); },
    upcoming:   function(n){ var l=byTime(all().filter(function(m){return m.dayn>0;})); return n?l.slice(0,n):l; },
    past:       function(n){ var l=byTime(all().filter(function(m){return m.past;})).reverse(); return n?l.slice(0,n):l; },
    withNotes:  function(){ return byTime(all().filter(function(m){return m.state==='noted';})).reverse(); },
    awaitingNote:function(){ return all().filter(function(m){return m.state==='pending';}); },
    forStep:    function(step){ return all().filter(function(m){return m.step===step;}); }
  };
})();
