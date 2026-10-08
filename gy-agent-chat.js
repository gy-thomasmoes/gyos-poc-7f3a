/* gy-agent-chat.js (8 Oct 2026): lets you talk to an agent on its page.
   Scripted, no model: the agent answers from its own page, read from the
   rendered Content and Settings views. Load after the page script.
   ?chat=1 opens the chat and focuses the box; ?ask=... asks a question. */
(function(){
  if(!window.VIEWS || !window.LOG) return;
  var css = '.gyq{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 14px}'
    + '.gyq button{font:inherit;font-size:13.5px;color:var(--ink);background:var(--card);border:1px solid var(--line2);border-radius:999px;padding:6px 13px;cursor:pointer;text-align:left}'
    + '.gyq button:hover{background:var(--graybg)}'
    + '.v5say ul.gya{margin:6px 0 0;padding-left:20px}.v5say ul.gya li{margin:3px 0}'
    + '.v5say .gysrc{display:block;margin-top:8px;font-size:13px;color:var(--ink2)}'
    + '.v5say .gydots{display:inline-flex;gap:4px}.v5say .gydots i{width:6px;height:6px;border-radius:50%;background:var(--ink3);animation:gyb 1s infinite}'
    + '.v5say .gydots i:nth-child(2){animation-delay:.15s}.v5say .gydots i:nth-child(3){animation-delay:.3s}'
    + '@keyframes gyb{0%,80%,100%{opacity:.3}40%{opacity:1}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function txt(el){ return el ? (el.textContent || '').replace(/\s+/g,' ').trim() : ''; }

  /* read the page into a small knowledge base */
  var KB = {name:'', secs:[], props:{}, conf:{}};
  (function(){
    var d = document.createElement('div'); d.innerHTML = VIEWS.content();
    KB.name = txt(d.querySelector('.v5dt'));
    [].forEach.call(d.querySelectorAll('section'), function(s){
      var h = s.querySelector('.v5cht');
      var o = {title: h ? txt(h) : 'Purpose', id: s.id, text: [], head: [], rows: [], items: []};
      [].forEach.call(s.querySelectorAll('.pblk, .dcap, .callout > span, .dnote:not(.q) > div'), function(e){ o.text.push(txt(e).replace(/^Purpose\.\s*/,'')); });
      [].forEach.call(s.querySelectorAll('thead th'), function(e){ o.head.push(txt(e)); });
      [].forEach.call(s.querySelectorAll('tbody tr'), function(r){ o.rows.push([].map.call(r.querySelectorAll('td'), txt)); });
      [].forEach.call(s.querySelectorAll('.bul > span:last-child, .todo > span:last-child, .dnote.q li'), function(e){ o.items.push(txt(e)); });
      KB.secs.push(o);
    });
    var c = document.createElement('div'); c.innerHTML = VIEWS.settings();
    [].forEach.call(c.querySelectorAll('.v8card'), function(card){
      var t = txt(card.querySelector('.v8sh b'));
      if(t === 'Agent'){
        [].forEach.call(card.querySelectorAll('.v8row.kv'), function(r){ var v = r.querySelector('.v').cloneNode(true); [].forEach.call(v.querySelectorAll('.bpav'), function(x){ x.remove(); }); KB.props[txt(r.querySelector('.nm'))] = txt(v); });
      } else {
        KB.conf[t] = [].map.call(card.querySelectorAll('.v8row .nm'), txt);
      }
    });
  })();

  function sec(re){ for(var i=0;i<KB.secs.length;i++) if(re.test(KB.secs[i].title)) return KB.secs[i]; return null; }
  function ul(list){ return '<ul class="gya">'+list.map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ul>'; }
  function src(s){ return s ? '<span class="gysrc">From my page: '+s.title+'</span>' : ''; }
  function lc(s){ return s.charAt(0).toLowerCase()+s.slice(1); }
  var mgr = function(){ var m = KB.props['Manager'] || ''; return (!m || /^no manager/i.test(m)) ? 'my manager, once I have one' : m; };

  var INTENTS = [
    [/(who (manages|owns|runs|looks after) you|\bmanag|\bowner\b|\bboss\b|sign(s)? (you )?off|responsible for you)/, function(){
      var p = KB.props, out = [];
      if(p['Manager']) out.push('My manager: <b>'+p['Manager']+'</b>.');
      if(p['Signs off']) out.push('Signs off: '+p['Signs off']+'.');
      return out.join(' ') || 'I have no manager yet.';
    }],
    [/\b(can'?t|cannot|never|not allowed|guardrail|limit|rules?)\b/, function(){
      var s = sec(/Guardrail/); return s ? 'What I never do:'+ul(s.items)+src(s) : null;
    }],
    [/\b(job|jobs|do you do|what do you|can you do|purpose|for what|role)\b/, function(){
      var s = sec(/^Jobs/);
      var p = sec(/^Purpose/);
      return (p && p.text[0] ? p.text[0]+'<br><br>' : '') + (s ? 'My jobs:'+ul(s.rows.map(function(r){ return '<b>'+r[0]+'</b>: '+lc(r[1] || ''); }))+src(s) : '');
    }],
    [/\b(open|unsure|unknown|gaps?|question|undecided|not sure)\b/, function(){
      var s = sec(/Open question/); return s ? 'Still open:'+ul(s.items)+src(s) : null;
    }],
    [/\b(next|todo|to-do|plan|roadmap|step)s?\b/, function(){
      var s = sec(/Next step/); return s ? 'Next steps:'+ul(s.items)+src(s) : null;
    }],
    [/\b(evals?|tests?|trust|quality)\b/, function(){
      var s = sec(/^Evals/); return s ? 'I am trusted only as far as I pass these:'+ul(s.rows.map(function(r){ return '<b>'+r[0]+'</b>: '+lc(r[1]); }))+src(s) : null;
    }],
    [/\b(card|phase|discover|plan phase|confidence)\b/, function(){
      var s = sec(/Card by phase/); if(!s) return null;
      return (s.text[0] ? s.text[0] : '') + ul(s.rows.map(function(r){ return '<b>'+r[0]+'</b>: '+lc(r[1])+' ('+lc(r[2])+' confidence, '+lc(r[3])+')'; })) + src(s);
    }],
    [/\b(schema|field)s?\b/, function(){
      var s = sec(/schema/i); return s ? 'A Blueprint has these fields:'+ul(s.rows.map(function(r){ return '<b>'+r[0]+'</b>: '+lc(r[1]); }))+src(s) : null;
    }],
    [/\b(data|source|read|databricks|numbers?)\b/, function(){
      var s = sec(/Data it reads/);
      if(s) return 'I read these, never copy them:'+ul(s.rows.map(function(r){ return '<b>'+r[0]+'</b>: '+lc(r[1])+' ('+lc(r[2])+')'; }))+src(s);
      return KB.conf['Connections'] ? 'I can reach: '+KB.conf['Connections'].join(', ')+'.' : null;
    }],
    [/\b(tools?)\b/, function(){ return KB.conf['Tools'] ? 'Tools I may use:'+ul(KB.conf['Tools'])+'<span class="gysrc">From my Settings</span>' : null; }],
    [/\b(skills?|method)\b/, function(){ return KB.conf['Skills'] ? 'Skills I load:'+ul(KB.conf['Skills'])+'<span class="gysrc">From my Settings</span>' : null; }],
    [/\b(context|know|knowledge|rule ?books?)\b/, function(){ return KB.conf['Context'] ? 'Context I read:'+ul(KB.conf['Context'])+'<span class="gysrc">From my Settings</span>' : null; }],
    [/\b(memory|remember)\b/, function(){ return KB.conf['Memory'] ? 'What I remember:'+ul(KB.conf['Memory'])+'<span class="gysrc">From my Settings</span>' : null; }],
    [/\b(connect|connection|systems?|notion|hubspot|drive|slack)/, function(){ return KB.conf['Connections'] ? 'I can reach:'+ul(KB.conf['Connections'])+'<span class="gysrc">From my Settings</span>' : null; }],
    [/\b(governance|permission|audit|log)\b/, function(){ return KB.conf['Governance'] ? 'Governance:'+ul(KB.conf['Governance'])+'<span class="gysrc">From my Settings</span>' : null; }],
    [/\b(why|matter|value|point)\b/, function(){ var s = sec(/Why it matters/); return s ? s.text.join(' ')+src(s) : null; }],
    [/(how (do|does) (you|it) work|how it works|\bflow\b|\bprocess\b|\bloop\b)/, function(){ var s = sec(/How it works/); return s ? s.text.join(' ')+src(s) : null; }],
    [/\b(where|fit|sits?|relat|other agents?)\b/, function(){ var s = sec(/Where it sits/); return s ? s.text.join(' ')+src(s) : null; }],
    [/\b(talk|team|ask you|conversation)\b/, function(){ var s = sec(/talks to the team/); return s ? s.text.concat([]).join(' ')+ul(s.items)+src(s) : null; }],
    [/\b(status|ready|built|live|version)\b/, function(){ return 'Status: <b>'+(KB.props['Status'] || 'unknown')+'</b>.'+(KB.props['Source'] ? ' Source: '+KB.props['Source']+'.' : ''); }],
    [/^(hi|hello|hey|hoi|hallo)\b/, function(){ return 'Hi. Ask me about my jobs, who manages me, what I never do, or what is still open.'; }]
  ];

  var STOP = /^(the|and|for|you|your|are|what|does|with|this|that|have|how|why|who|can|about|from|into|which|when|will|would|should|there|their|them|then|than|been|being|its|our|any)$/;
  function search(q){
    var words = q.toLowerCase().replace(/[^a-z0-9 ]+/g,' ').split(/\s+/).filter(function(w){ return w.length > 2 && !STOP.test(w); });
    if(!words.length) return null;
    var best = [], stem = function(w){ return w.replace(/(ing|es|s|ed)$/,''); };
    KB.secs.forEach(function(s){
      var cands = s.text.concat(s.items, s.rows.map(function(r){ return r.join(': '); }));
      cands.forEach(function(c){
        var l = c.toLowerCase(), sc = 0;
        words.forEach(function(w){ if(l.indexOf(stem(w)) >= 0) sc++; });
        if(sc) best.push([sc, c, s]);
      });
    });
    Object.keys(KB.conf).forEach(function(k){ KB.conf[k].forEach(function(c){
      var l = c.toLowerCase(), sc = 0; words.forEach(function(w){ if(l.indexOf(stem(w)) >= 0) sc++; });
      if(sc) best.push([sc, k+': '+c, {title:'Settings'}]);
    }); });
    if(!best.length) return null;
    best.sort(function(a,b){ return b[0]-a[0]; });
    var top = best.slice(0,3).filter(function(b){ return b[0] >= best[0][0] - 0; });
    return 'This is what my page says:'+ul(top.map(function(b){ return b[1]; }))+src(top[0][2]);
  }

  function answer(q){
    var l = q.toLowerCase();
    for(var i=0;i<INTENTS.length;i++){
      if(INTENTS[i][0].test(l)){ var a = INTENTS[i][1](); if(a) return a; }
    }
    return search(q) || 'That is not in my definition yet. I will note it as an open question for '+mgr()+'.';
  }

  var SUGG = ['What are your jobs?','Who manages you?','What do you never do?','What is still open?'];
  function chips(){
    return '<div class="gyq">'+SUGG.map(function(s){ return '<button onclick="gyAsk(this.textContent)">'+s+'</button>'; }).join('')+'</div>';
  }

  var busy = false;
  window.gyAsk = function(v){
    v = (v||'').trim(); if(!v || busy) return;
    busy = true;
    LOG = LOG.filter(function(x){ return x.indexOf('class="gyq"') < 0; });
    LOG.push(you(esc(v))); LOG.push('<div class="v5say gytyping"><span class="gydots"><i></i><i></i><i></i></span></div>'); paintChat();
    setTimeout(function(){
      LOG.pop(); LOG.push(say(answer(v))); LOG.push(chips()); paintChat(); busy = false;
    }, 650);
  };
  window.sendMsg = function(){
    var inp = document.getElementById('ask'); var v = inp.value; inp.value = ''; gyAsk(v);
  };

  LOG.push(chips()); paintChat();

  var qs = new URLSearchParams(location.search);
  if(qs.get('chat') || qs.get('ask')){
    document.body.classList.remove('pclosed'); if(window.paintTabs) paintTabs();
    var inp = document.getElementById('ask'); if(inp) inp.focus();
    if(qs.get('ask')) gyAsk(qs.get('ask'));
  }
})();
