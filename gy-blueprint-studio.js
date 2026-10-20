/* gy-blueprint-studio.js - one page template for every agent in the Hive Mind (15 Oct 2026).

   Agents, workflows and Deliverables are the same thing underneath: an agent
   (prompt, skills, tools, context) that may have a workflow attached. A
   Coordinator agent has one; an Expert agent does not. So every agent page
   gets the same tabs, and the Blueprint is edited on the agent's own page:

     Content    the agent definition (the page's own view)
     Workflow   chapters and steps, coordinator agents only
     Source     what the platform stores: blueprint.yaml, instructions.md,
                agent.yaml, prompt.md and one file per skill. Laid out like
                the Deliverable Document view: one sheet with a 1px border,
                a grouped file list on the grey canvas to the right. The
                sheet is directly editable.
     Settings   the six components (the page's own view)

   Beside the page title: the version dropdown and a quiet Edit.
   Edit turns the page into Blueprint Studio: the topbar turns GY
   yellow, the chat becomes the Blueprint agent, every change is a draft, and
   Save makes the next version. Typing in Source starts the studio too.

   Load after the page script and gy-agent-chat.js. Needs the page globals
   AG, VIEWS, TABS, TAB, openTab, paintTabs, LOG, paintChat, say, you, esc.
   The data for each page sits in STUDIO below, keyed by file name. */
(function(){
  if(!window.AG || !window.VIEWS || !window.TABS) return;
  var PAGE = (location.pathname.split('/').pop() || '').split('?')[0];

  /* ── data ─────────────────────────────────────────────────────────── */
  var EXPERT_USE = [{bp:'Customer Demand Mapping', v:4, step:'3.1 Research ecosystem services', href:'agent-demand-mapping.html'}];
  function expert(model, manager, versions){
    return {kind:'expert', model:model, manager:manager, usedIn:EXPERT_USE, versions:versions};
  }
  var STUDIO = {
    /* Customer Demand Mapping comes from gy-bp-cdm.js (20 Oct), the one source its Deliverables read too */
    'agent-demand-mapping.html': window.GY_BP_CDM ? (function(B){ return {
      kind:'coordinator', id:B.id, blueprint:B.name, owner:B.owner, model:B.model,
      roles:B.roles.map(function(r){ return r.slice(); }), rules:B.rules.slice(), wf:B.studioWf(),
      versions:B.versions.map(function(v){ return {v:v.v, date:v.date, by:v.by, note:v.note, runs:(v.runs||[]).slice()}; })
    }; })(window.GY_BP_CDM) : null,
    'agent-woodland-carbon.html': expert('Claude Sonnet 5.5', 'Solène Kechavarzi', [
      {v:1, date:'3 Oct 2026', by:'Thomas Moes', note:'First version, from the Woodland Carbon definition v0.1', runs:[['Upper Dee','deliverable-sketch-v8.html']]}]),
    'agent-bng.html': expert('Claude Sonnet 5.5', 'Emily Churchill', [
      {v:1, date:'8 Oct 2026', by:'Thomas Moes', note:'Placeholder from the Ecosystem Service agent template', runs:[]}]),
    'agent-peatland-carbon.html': expert('Claude Sonnet 5.5', '', [
      {v:1, date:'8 Oct 2026', by:'Thomas Moes', note:'Placeholder from the Ecosystem Service agent template', runs:[]}]),
    'agent-nutrient.html': expert('Claude Sonnet 5.5', '', [
      {v:1, date:'8 Oct 2026', by:'Thomas Moes', note:'Placeholder from the Ecosystem Service agent template', runs:[]}]),
    'agent-flood.html': expert('Claude Sonnet 5.5', '', [
      {v:1, date:'8 Oct 2026', by:'Thomas Moes', note:'Placeholder from the Ecosystem Service agent template', runs:[]}])
  };
  /* blueprint.html hands its Blueprint in as GY_STUDIO_DATA (from gy-blueprint-pages.js) */
  var D = window.GY_STUDIO_DATA || STUDIO[PAGE];
  if(!D) return;
  /* who has access (15 Oct). Admin edits Source and the Blueprint; Editor edits the Blueprint
     in the studio but not Source; Viewer reads and asks the agent. Names from the GY team directory. */
  var P = {
    tm:['Thomas Moes','TM','#5B4BA0'], an:['Andrew Rubie','AR','#B4551F'], to:['Toon Verbeek','TV','#0F6E56'],
    en:['Emily Churchill','EC','#378ADD'], cc:['Caitlin Ciceri','CC','#1D9E75'], ib:['Izzie Milligan','IM','#C46A1E'],
    hf:['Harry Forman','HF','#766B62'], so:['Sol\u00e8ne Kechavarzi','SK','#8A5A3B']
  };
  var LEVELS = [['Admin','Edits Source and the Blueprint'],['Editor','Edits the Blueprint'],['Viewer','Reads and asks the agent']];
  var ACCESS = {
    'agent-demand-mapping.html': [['an','Admin'],['to','Admin'],['tm','Admin'],['en','Editor'],['cc','Editor'],['ib','Viewer'],['hf','Viewer']],
    'agent-woodland-carbon.html': [['an','Admin'],['to','Admin'],['tm','Admin'],['so','Editor'],['en','Viewer'],['hf','Viewer']]
  }[PAGE] || [['an','Admin'],['to','Admin'],['tm','Admin'],['en','Editor'],['hf','Viewer']];
  ACCESS = D.access || ACCESS.map(function(a){ var p = P[a[0]]; return {name:p[0], ini:p[1], c:p[2], lvl:a[1]}; });
  /* versions are '2' or '0.3': the next one bumps the last number */
  function nextVer(v){ var p = String(v).split('.'); p[p.length-1] = String(+p[p.length-1] + 1); return p.join('.'); }
  var COORD = D.kind === 'coordinator';
  /* V1 scope (20 Oct): later features stay in the code but only show with ?later=1:
     opening and restoring old versions, the Admin/Editor split, editing People here */
  var LATER = /[?&]later=1/.test(location.search);
  function lvLabel(l){ return LATER ? l : (l === 'Viewer' ? 'Can view' : 'Can edit'); }
  var conf = {}; (AG.conf || []).forEach(function(c){ conf[c[0]] = c[4].slice(); });
  /* Skills on steps (20 Oct): a step file says what happens, who does it and which skills it uses;
     the method lives once in the skill (skills/*.md), so every step and Blueprint that uses it improves together.
     A skill file opens with a header listing the steps that use it. */
  var SKILLS = {steps:{}}; /* each step carries its own skills (Customer Demand Mapping: gy-bp-cdm.js) */
  (D.wf||[]).forEach(function(c){ c.s.forEach(function(st){ if(!st.sk) st.sk = (SKILLS.steps[st.t] || []).slice(); }); });
  function skillUse(sk){ var u = []; (D.wf||[]).forEach(function(c, ci){ c.s.forEach(function(st, i){ if((st.sk||[]).indexOf(sk) >= 0) u.push((ci+1)+'.'+(i+1)+' '+st.t); }); }); return u; }
  var SAVED = JSON.stringify({wf:D.wf, conf:conf, prompt:AG.purpose, access:ACCESS, owner:D.owner, manager:D.manager, readme:{}});
  /* People are edited in Blueprint Studio with gySel: load it on pages that do not (20 Oct) */
  if(!window.gySel){ var gs = document.createElement('script'); gs.src = 'gy-select.js'; gs.onload = function(){ if(window.TAB === 'settings') repaint(); }; document.head.appendChild(gs); }

  /* ── state ────────────────────────────────────────────────────────── */
  var S = {
    on:false, ver:D.versions[0].v, changes:[], fix:[], sel:null,
    file: COORD ? 'blueprint' : 'agent', grp:null,
    prompt: AG.purpose, edits:{}, stepErr:{}, readme:{}, agentLog:null, bpLog:null
  };
  var uid = 0;
  if(D.wf) D.wf.forEach(function(c){ c.s.forEach(function(s){ s.id = 's'+(++uid); }); });

  /* ── styles ───────────────────────────────────────────────────────── */
  var css = ''
    /* right side of the tab bar: version dropdown, Edit Blueprint, and in the studio the draft controls */
    /* right of the tab bar: version and Edit as two buttons; on the right of the topbar the studio controls */
    + '.bstitle{display:inline-flex;align-items:center;gap:8px;margin-left:auto;flex:none}'
    + '.bsverc,.bsedit{display:inline-flex;align-items:center;gap:6px;height:31px;box-sizing:border-box;border:1px solid var(--line2);background:var(--card);border-radius:10px;padding:0 12px;'
    +   'font:inherit;font-size:14px;font-weight:500;color:var(--ink);cursor:pointer;white-space:nowrap}'
    + '.bsverc:hover,.bsedit:hover{border-color:var(--ink3)}'
    + '.bsverc:hover,.bsedit:hover{position:relative;z-index:1;background:var(--graybg)}'
    + '.bsverc{padding:0 9px 0 12px;font-variant-numeric:tabular-nums}'
    + '.bsverc .ti{font-size:14px;color:var(--ink3)}'
    + '.bsedit .ti{font-size:16px;color:var(--ink2)}'
    + '.bsctl{display:none;align-items:center;gap:8px}'
    + 'body.bsdraft .bsctl,body.bsold .bsctl{display:inline-flex}'
    /* no yellow bar while drafting (20 Oct): the pill, Discard and Publish carry the draft state */
    + '.bspill{background:var(--graybg)!important}'
    + '.bspill{display:inline-flex;align-items:center;gap:7px;border:none;background:var(--card);color:var(--amberd);border-radius:999px;'
    +   'padding:6px 12px;font:inherit;font-size:13px;font-weight:500;cursor:pointer;white-space:nowrap}'
    + '.bspill i.d{width:7px;height:7px;border-radius:50%;background:var(--amber)}'
    + '.bspill.fix{color:var(--ink)}'
    + '.bspill.fix i.d{background:var(--ink)}'
    + '.bsbtn{display:inline-flex;align-items:center;gap:7px;border-radius:10px;padding:7px 13px;font:inherit;font-size:13.5px;font-weight:500;cursor:pointer;white-space:nowrap}'
    + '.bsbtn .ti{font-size:16px}'
    + '.bsbtn.out{background:transparent;border:1px solid rgba(26,12,18,.35);color:var(--ink)}'
    + '.bsbtn.out:hover{background:rgba(255,255,255,.45)}'
    + '.bsbtn.dark{background:var(--dark);border:1px solid var(--dark);color:#fff}'
    + '.bsbtn.dark:hover{background:#2C1B22}'
    + '.bsbtn[disabled]{opacity:.45;cursor:default}'
    + '.bsbtn.out.bsdisc.sure{background:var(--card);border-color:var(--ink);font-weight:600}'
    + '.bsstudio{display:none;align-items:center;gap:8px;font-size:16px}'
    + 'body.bson .bsstudio{display:inline-flex}'
    + 'body.bson .bsoff{display:none!important}'
    + 'body:not(.bson) .bsonly{display:none!important}'
    + '.bsstudio .sep{color:var(--ink3)}'
    + '.bsstudio b{font-weight:600}'
    /* Blueprint Studio: only the topbar turns GY yellow; everything on it is ink */
    /* 20 Oct: the tab bar (not the topbar) turns GY yellow and holds Done / Save; everything on it is ink */
    /* an old version is read only: the tab bar goes grey and says so */
    + 'body.bsold .v5tabs{background:var(--graybg)}'
    + 'body.bsold .v5tabs .v5tab.on,body.bsold .v5tabs .v8agt.on{background:var(--card)}'
    + '.bsrol{display:inline-flex;align-items:center;gap:6px;font-size:13.5px;color:var(--ink2);white-space:nowrap}'
    + '.bsrol .ti{font-size:15px}'
    /* always editable for Admins and Editors: controls stay quiet until you point at them */
    + 'body.bson .bsch:not(:hover) .bsadd{opacity:0}'
    + '.bsadd{transition:opacity .12s}'
    + '.bsprow:not(:hover) .bspsel .gyselbtn{border-color:transparent;background:none}'
    + '.bsprow:not(:hover) .bspsel .gyselcar{visibility:hidden}'
    + '.bsprow .bspsel .gyselbtn{justify-content:flex-end;text-align:right}'
    + '.bsvi.pick{cursor:pointer}.bsvi.pick:hover{background:var(--bg)}'
    + '.bschip.bsfold{display:inline-flex;align-items:center;gap:6px;border:none;font:inherit;cursor:pointer}.bschip.bsfold .ti{font-size:15px;color:var(--ink2)}.bschip.bsfold:hover{background:var(--curbg)}'
    + '.bspubh{font-family:var(--serif);font-size:20px;font-weight:500;color:var(--ink);padding:8px 10px 2px}'
    + '.bspubs{font-size:13.5px;color:var(--ink2);line-height:1.5;padding:0 10px 6px}'
    + '.bspubg{padding:0 10px}'
    + '.bspubg .w{font-size:12.5px;font-weight:600;color:var(--ink3);padding:8px 0 0}'
    + '.bspubn{display:block;width:calc(100% - 20px);margin:2px 10px 0;box-sizing:border-box;min-height:64px;resize:vertical;border:1px solid var(--line2);border-radius:10px;padding:9px 11px;font:inherit;font-size:14px;color:var(--ink);background:var(--card)}'
    + '.bspubn:focus{outline:none;border-color:var(--ink3)}'
    + '.bspuba{display:flex;justify-content:flex-end;gap:8px;padding:12px 10px 8px}'
    + '.bspuba .bsbtn.out{border-color:var(--line2)}'
    + '@media(max-width:760px){.bsstudio,.bstitle,.bspill{display:none!important}}'
    /* version dropdown */
    + '.bsvpop{position:fixed;z-index:1400;width:360px;max-width:calc(100vw - 24px);max-height:70vh;overflow:auto;background:var(--card);'
    +   'border:1px solid var(--line2);border-radius:13px;box-shadow:0 16px 44px rgba(31,31,29,.18);padding:8px}'
    + '.bsvpop .lbl{font-size:12.5px;font-weight:600;color:var(--ink3);padding:8px 10px 4px}'
    + '.bsvi{border-radius:10px;padding:10px 10px}'
    + '.bsvi + .bsvi{border-top:1px solid var(--line)}'
    + '.bsvi .h{display:flex;align-items:center;gap:8px;font-size:14.5px;font-weight:600;color:var(--ink)}'
    + '.bsvi .h .dt{margin-left:auto;font-weight:400;font-size:13px;color:var(--ink2)}'
    + '.bsvi .nt{font-size:14px;color:var(--ink);line-height:1.5;margin-top:3px}'
    + '.bsvi .by{font-size:13px;color:var(--ink2);margin-top:4px}'
    + '.bsvi .runs{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}'
    + '.bsvi .runs a,.bsvi .runs span{font-size:13px;border-radius:999px;padding:3px 10px;background:var(--graybg);color:var(--ink);text-decoration:none}'
    + '.bsvi .runs a:hover{background:var(--curbg)}'
    + '.bsvi.draft{background:var(--bg)}'
    + '.bschg{display:flex;align-items:flex-start;gap:10px;padding:7px 0;font-size:14px;line-height:1.45;color:var(--ink)}'
    + '.bschg .w{color:var(--ink2);font-size:13px}'
    + '.bsfixn{display:flex;gap:8px;align-items:flex-start;background:var(--graybg);border-radius:9px;padding:9px 11px;font-size:14px;margin-top:8px}'
    + '.bsvi .acts{display:flex;gap:8px;margin-top:10px}'
    + '.bsvi .acts .bsbtn.out{border-color:var(--line2)}'
    + '.bsvi .acts .bsbtn.out:hover{background:var(--graybg)}'
    + '.bsuse{font-size:14px;color:var(--ink);padding:4px 10px 8px;line-height:1.5}'
    + '.bsuse a{color:var(--ink)}'
    /* who has access: avatar pile beside Share, admins beside Editable in Source */
    + '.bspile{display:inline-flex;align-items:center;border:none;background:none;padding:2px 4px;border-radius:999px;cursor:pointer;margin-right:4px}'
    + '.bspile:hover{background:var(--graybg)}'
    + '.bsav{width:28px;height:28px;border-radius:50%;color:#fff;font-size:11px;font-weight:600;display:inline-flex;align-items:center;justify-content:center;flex:none;box-shadow:0 0 0 2px var(--bg);margin-left:-5px}'
    + '.bsav:first-child{margin-left:0}'
    + '.bsav.more{background:var(--graybg);color:var(--ink2)}'
    + '.bsav.sm{width:22px;height:22px;font-size:9px;box-shadow:0 0 0 2px #fff;margin-left:-4px}'
    + '.bsav.sm:first-child{margin-left:0}'
    + '.bsadm{display:inline-flex;align-items:center;margin-right:10px}'
    + '.bsacc .row{display:flex;align-items:center;gap:10px;padding:7px 10px;font-size:14px;color:var(--ink)}'
    + '.bsacc .row .bsav{margin-left:0;box-shadow:none}'
    + '.bsacc .row .nm{flex:1;min-width:0}'
    + '.bsacc .lv{font-size:13px;color:var(--ink2)}'
    + '.bsacc .lblh{display:flex;align-items:baseline;gap:8px;font-size:12.5px;font-weight:600;color:var(--ink3);padding:10px 10px 2px}'
    + '.bsacc .lblh span{font-weight:400}'
    /* workflow */
    + '.bswf .bsch{margin-top:44px}'
    + '.bswf .bsch:first-of-type{margin-top:0}'
    + '.bschh{display:flex;align-items:center;gap:11px;margin-bottom:14px}'
    + '.bschh .n{width:30px;height:30px;border-radius:9px;background:var(--dark);color:var(--yellow);flex:none;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600}'
    + '.bschh .t{font-family:var(--serif);font-size:22px;font-weight:500;letter-spacing:-.01em}'
    + '.bssteps{border:1px solid var(--line);border-radius:14px;background:var(--card);overflow:hidden}'
    + '.bsst{display:flex;align-items:center;gap:12px;padding:12px 16px;border-top:1px solid var(--line);font-size:14.5px;cursor:pointer;min-width:0}'
    + '.bsst:first-child{border-top:none}'
    + '.bsst:hover{background:var(--currow)}'
    + '.bsst.sel{background:var(--curbg)}'
    + '.bsst .k{flex:none;width:30px;color:var(--ink3);font-size:13px;font-variant-numeric:tabular-nums}'
    + '.bsst .ic{flex:none;width:26px;height:26px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;background:var(--graybg);color:var(--ink2)}'
    + '.bsst .ic.agent{background:var(--dark);color:var(--yellow)}'
    + '.bsst .ic.decision{background:var(--graybg);color:var(--ink)}'
    + '.bsst .nm{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:500}'
    + '.bsst .by{flex:none;color:var(--ink2);font-size:13px;white-space:nowrap}'
    + '.bsst .ch{flex:none;color:var(--ink3);font-size:15px}'
    + '.bstag{flex:none;font-size:12px;font-weight:600;border-radius:6px;padding:2px 7px;background:var(--graybg);color:var(--ink)}'
    + '.bstag.new{background:var(--greenbg);color:var(--greend)}'
    + '.bsadd{display:flex;align-items:center;gap:6px;padding:10px 14px;border-top:1px solid var(--line);background:var(--bg)}'
    + '.bsadd span{font-size:13px;color:var(--ink3);margin-right:4px}'
    + '.bsaddb{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);background:var(--card);border-radius:999px;padding:4px 11px;'
    +   'font:inherit;font-size:13px;color:var(--ink2);cursor:pointer}'
    + '.bsaddb:hover{border-color:var(--line2);color:var(--ink)}'
    /* drawer editor and previewer */
    + '.bsk{font-size:12.5px;font-weight:600;color:var(--ink3);margin:20px 0 7px}'
    + '.bsk:first-child{margin-top:0}'
    + '.bsselb{position:fixed;z-index:1500;display:inline-flex;align-items:center;gap:6px;border:none;background:var(--dark);color:#fff;border-radius:9px;padding:6px 11px;font:500 13px var(--sans);cursor:pointer;box-shadow:0 4px 14px rgba(26,12,18,.18)}'
    + '.bsselb .ti{font-size:15px}'
    + '.bsed{position:relative;flex:1 0 auto!important}'
    + '.bsdask{position:sticky;bottom:0;z-index:2;padding:12px 20px 16px;background:linear-gradient(to bottom, rgba(255,255,255,0), var(--card) 14px)}'
    + '.bsdbox{display:flex;align-items:center;gap:8px;border:1px solid var(--line2);border-radius:14px;background:var(--card);padding:7px 7px 7px 14px;box-shadow:0 2px 10px rgba(26,12,18,.06)}'
    + '.bsdbox:focus-within{border-color:var(--ink3)}'
    + '.bsdbox input{flex:1;min-width:0;border:none;outline:none;background:transparent;font:inherit;font-size:14.5px;color:var(--ink)}'
    + '.bsdbox .v5send{flex:none}'
    + '.bsq{display:flex;align-items:flex-start;gap:8px;background:var(--graybg);border-radius:10px;padding:8px 10px;margin:0 0 10px}'
    + '.bsq .bsqm{flex:1;min-width:0}'
    + '.bsq .x{flex:none;border:none;background:none;color:var(--ink3);cursor:pointer;padding:0;font-size:15px}.bsq .x:hover{color:var(--ink)}'
    + '.bsqm{display:flex;flex-direction:column;gap:2px;font-size:13px;line-height:1.45}'
    + '.bsqm .at{display:inline-flex;align-items:center;gap:4px;font-weight:600;color:var(--blued)}.bsqm .at .ti{font-size:14px}'
    + '.bsqm .qt{color:var(--ink2);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px}'
    + '.v5you .bsqm{margin-bottom:6px;padding-bottom:6px;border-bottom:1px solid rgba(26,12,18,.08)}'
    + 'mark.bsflash{background:var(--greenbg);color:inherit;border-radius:3px}'
    + '.bsgen{display:flex;align-items:center;gap:6px;font-size:12.5px;color:var(--ink3);margin:-4px 0 12px}'
    + '.callout + .bsgen{margin:8px 0 0}'
    + '.bsgen .ti{font-size:14px}.bsgen a{color:var(--blued);cursor:pointer;text-decoration:none}.bsgen a:hover{text-decoration:underline}'
    /* editable sections: no box around them (it doubled up with tables); a bar in the left margin instead */
    + 'body.bson .bsrdm,.bslive[contenteditable=true]{margin-left:-14px;padding-left:12px;border-left:2px solid transparent;transition:border-color .12s}'
    + 'body.bson .bsrdm:hover,.bslive[contenteditable=true]:hover{border-left-color:var(--line2)}'
    + 'body.bson .bsrdm:focus,.bslive[contenteditable=true]:focus{outline:none;border-left-color:var(--ink3)}'
    + '.bslive .todo{cursor:text}.bslive .tbox{cursor:pointer}.bslive .todo.done > span:last-child{color:var(--ink3);text-decoration:line-through}'
    + '.bslive .todo.done .tbox{background:var(--green);border-color:var(--green);color:#fff}'
    + '.bsstepv{padding:22px 24px 80px;max-width:760px}'
    + '.bsstepv .bsta{min-height:280px}'
    + '.bsstepv .bsro{white-space:pre-wrap}'
    + '.bsin,.bsta{width:100%;font:inherit;font-size:14.5px;color:var(--ink);background:var(--card);border:1px solid var(--line2);border-radius:10px;padding:9px 11px}'
    + '.bsta{min-height:120px;line-height:1.55;resize:vertical}'
    + '.bsin:focus,.bsta:focus{outline:none;border-color:var(--ink3)}'
    + '.bsseg{display:flex;gap:6px;flex-wrap:wrap}'
    + '.bsopt{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--line);background:var(--card);border-radius:999px;padding:5px 12px;'
    +   'font:inherit;font-size:13.5px;color:var(--ink2);cursor:pointer}'
    + '.bsopt.on{background:var(--dark);border-color:var(--dark);color:#fff}'
    + '.bsopt .ti{font-size:14px}'
    + '.bsro{font-size:14.5px;line-height:1.6;color:var(--ink)}'
    + '.bschips{display:flex;gap:6px;flex-wrap:wrap}'
    + '.bschip{font-size:13px;border-radius:999px;padding:3px 10px;background:var(--graybg);color:var(--ink)}'
    /* Source: the Document view of the Deliverable pages. One sheet with a 1px border flush to the
       canvas, the grouped file list on the grey canvas to the right */
    + 'body.bssrc .v5panel{padding-top:0!important}'
    + 'body.bssrc .v5body{padding:0!important;border-radius:0!important;background:var(--bg)!important;box-shadow:none!important}'
    + 'body.bssrc .v5bin{max-width:none!important;height:100%}'
    + '.bssrcw{display:flex;align-items:flex-start;min-height:100%}'
    + '.bssheet{flex:1;min-width:0;min-height:100%;background:#fff;border:1px solid #E9E4D8;border-top:none}'
    + '.bsfh{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:10px;padding:16px 28px;background:#fff;border-bottom:1px solid #F0ECE2}'
    + '.bsfh .fn{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:14px;font-weight:600;color:var(--ink)}'
    + '.bsfh .sp{flex:1}'
    + '.bsfh .st{display:inline-flex;align-items:center;gap:7px;font-size:13px;color:var(--ink2);white-space:nowrap}'
    + '.bsfh .st .ti{font-size:15px}'
    + '.bsfh .st.ed{color:var(--greend);font-weight:600}'
    + '.bsfh .st.ed i.d{width:7px;height:7px;border-radius:50%;background:var(--green)}'
    + '.bscode{margin:0;padding:28px 28px 120px;min-height:calc(100vh - 220px);font:15px/1.75 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--ink);'
    +   'white-space:pre-wrap;word-break:break-word;tab-size:2;outline:none;cursor:text;caret-color:var(--ink);border-left:3px solid transparent;transition:border-color .15s,background .15s}'
    + '.bscode:hover{background:#FDFCF8}'
    + '.bscode:focus{background:#fff;border-left-color:var(--dark)}'
    + '.bscode .yk{color:var(--ink2)}'
    + '.bscode .mh{font-weight:700}'
    + '.bscode .cm{color:var(--ink3)}'
    + '.bscode .chg{background:var(--greenbg);color:var(--greend);border-radius:3px}'
    + '.bstoc{flex:none;width:200px;position:sticky;top:0;padding:28px 0 40px;margin:0 32px 0 36px}'
    + '.bstoc .t{font-weight:600;font-size:14px;color:var(--ink);padding:0 0 12px}'
    + '.bstoc a,.bstoc .gh{display:flex;align-items:center;gap:9px;width:100%;border:none;background:none;font:inherit;font-size:13.5px;color:var(--ink2);'
    +   'padding:6px 10px;margin-left:-10px;border-radius:8px;cursor:pointer;text-align:left;min-width:0;text-decoration:none}'
    + '.bstoc a span,.bstoc .gh span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
    + '.bstoc a .ti{font-size:16px;color:var(--ink3);flex:none}'
    + '.bstoc a:hover,.bstoc .gh:hover{background:#F4F0E6;color:var(--ink)}'
    + '.bstoc a.on{background:#EFEBE1;color:var(--ink);font-weight:600}'
    + '.bstoc a.on .ti{color:var(--ink)}'
    + '.bstoc .gh{font-weight:600;margin-top:6px}'
    + '.bstoc .gh .cr{font-size:14px;width:16px;text-align:center;color:var(--ink3);transition:transform .15s;flex:none}'
    + '.bstoc .g.open .gh .cr{transform:rotate(90deg)}'
    + '.bstoc .g:not(.open) .gb{display:none}'
    + '.bstoc a .fd{flex:none;width:6px;height:6px;border-radius:50%;background:var(--green);margin-left:auto}'
    + '@container pane (max-width: 760px){.bstoc{display:none}.bsfh{padding:14px 18px}.bscode{padding:20px 18px 100px}}'
    + '.bsfsel{display:none}'
    + '@container pane (max-width: 760px){.bsfsel{display:flex;gap:6px;flex-wrap:wrap;padding:12px 18px;border-bottom:1px solid #F0ECE2}'
    +   '.bsfsel button{border:1px solid var(--line);background:var(--card);border-radius:999px;padding:4px 11px;font:inherit;font-size:13px;color:var(--ink2);cursor:pointer}'
    +   '.bsfsel button.on{background:var(--graybg);color:var(--ink);font-weight:600}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ── helpers ──────────────────────────────────────────────────────── */
  var IC = {agent:'ti-sparkles', person:'ti-user', decision:'ti-arrows-split-2'};
  /* AG text is page HTML: read it as plain text before it goes into a file */
  var _tx = document.createElement('textarea');
  function tx(s){ _tx.innerHTML = String(s == null ? '' : s).replace(/<[^>]+>/g, ''); return _tx.value; }
  function h(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function role(id){ var r = null; (D.roles||[]).forEach(function(x){ if(x[0] === id) r = x; }); return r; }
  function roleName(id){ var r = role(id); return r ? r[1] : 'Not set'; }
  function steps(){ var o = []; (D.wf||[]).forEach(function(c, ci){ c.s.forEach(function(s, si){ o.push({c:ci, i:si, s:s, k:(ci+1)+'.'+(si+1)}); }); }); return o; }
  function find(id){ var r = null; steps().forEach(function(x){ if(x.s.id === id) r = x; }); return r; }
  function slug(t){ return String(t).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }
  function chgFor(key){ var r = null; S.changes.forEach(function(c){ if(c.key === key) r = c; }); return r; }
  function addChange(key, kind, text, where){
    if(chgFor(key)) return;
    S.changes.push({key:key, kind:kind, text:text, where:where||''});
  }
  function validate(){
    S.fix = [];
    Object.keys(S.stepErr||{}).forEach(function(k){ S.fix = S.fix.concat(S.stepErr[k]); });
    steps().forEach(function(x){
      if(!String(x.s.t||'').trim()) S.fix.push('Step '+x.k+' has no title.');
      else if(!String(x.s.w||'').trim()) S.fix.push('Step '+x.k+' has no instructions.');
    });
  }

  /* the ask card of the Deliverable pages: a header band and numbered options */
  window.gyAskCard = function(label, opts, fn){
    return '<div class="v8ask gyqa"><div class="v8askh"><i class="ti ti-message-question" style="font-size:15px;color:var(--blued)"></i><span class="k">'+label+'</span></div>'
      + '<div class="v8aopts">' + opts.map(function(o, i){
          return '<button class="v8aopt'+(i===0?' pri':'')+'" onclick="'+fn+'(this.querySelector(\'.l\').textContent)"><span class="n">'+(i+1)+'</span>'
            + '<span class="l">'+h(o)+'</span>'+(i===0?'<i class="ti ti-arrow-right"></i>':'')+'</button>';
        }).join('') + '</div></div>';
  };

  /* ── topbar: version and Edit beside the title; studio controls before Share; the topbar turns yellow in the studio ── */
  var top = document.querySelector('.topbar');
  var crumbs = top && top.querySelector('.crumbs');
  function avh(p, cls){ return '<span class="bsav'+(cls?' '+cls:'')+'" style="background:'+p.c+'" data-tip="'+h(p.name)+', '+p.lvl+'">'+p.ini+'</span>'; }
  var shareBtn = top && top.querySelector('.btn-out');
  if(shareBtn){
    var shown = ACCESS.slice(0, 4), rest = ACCESS.length - shown.length;
    shareBtn.insertAdjacentHTML('beforebegin', '<button class="bspile" id="bsPile" onclick="bsAccess(this)" title="Who has access">'
      + shown.map(function(p){ return avh(p); }).join('') + (rest > 0 ? '<span class="bsav more">+'+rest+'</span>' : '') + '</button>');
  }

  function titleHtml(){
    return '<button class="bsverc" id="bsVerB" onclick="bsVersions(this)" title="Version history">v'+(S.view||S.ver)+'<i class="ti ti-chevron-down"></i></button>'
      + '<span class="bsctl" id="bsCtl"></span>';
  }
  function ctlHtml(){
    /* an old version: read only, with a way back and a way to restore it as a draft */
    if(S.view) return '<span class="bsrol"><i class="ti ti-lock"></i>Version '+h(S.view)+', read only</span>'
      + '<button class="bsbtn out" onclick="bsView(null)">Back to v'+S.ver+'</button>'
      + (S.on || canEdit() ? '<button class="bsbtn dark" onclick="bsRestore()"><i class="ti ti-history"></i>Restore as draft</button>' : '');
    validate();
    var n = S.changes.length, pill = '';
    if(S.fix.length) pill = '<button class="bspill fix" onclick="bsVersions(this)"><i class="d"></i>'+S.fix.length+' to fix</button>';
    else if(n) pill = '<button class="bspill" onclick="bsVersions(this)"><i class="d"></i>'+n+' unpublished change'+(n>1?'s':'')+'</button>';
    return pill
      + (n || S.fix.length ? '<button class="bsbtn out bsdisc" onclick="bsDiscardAsk(this)">Discard</button>' : '')
      + '<button class="bsbtn dark bspubb" onclick="bsPublish(this)"'+(n?'':' disabled')+'><i class="ti ti-upload"></i>Publish</button>';
  }
  /* Discard in the bar (20 Oct): two clicks, so a whole draft is never thrown away by accident */
  window.bsDiscardAsk = function(b){
    if(b.classList.contains('sure')){ bsDiscard(); return; }
    var n = S.changes.length;
    b.classList.add('sure'); b.textContent = 'Discard '+(n === 1 ? 'the change' : 'all '+n+' changes')+'?';
    clearTimeout(b._t); b._t = setTimeout(function(){ if(document.body.contains(b)){ b.classList.remove('sure'); b.textContent = 'Discard'; } }, 4000);
  };
  function paintTop(){
    var t = document.getElementById('bsTitle'); if(t) t.innerHTML = titleHtml();
    var c = document.getElementById('bsCtl'); if(c) c.innerHTML = ctlHtml();
    document.body.classList.toggle('bsdraft', !S.view && !!(S.changes.length || S.fix.length));
    document.body.classList.toggle('bsold', !!S.view);
  }

  /* ── tabs: Content, Workflow, Source, Settings ────────────────────── */
  var si = -1; TABS.forEach(function(t, i){ if(t[0] === 'settings') si = i; });
  var add = [];
  if(COORD) add.push(['workflow','ti-hierarchy-2','Workflow']);
  /* Source merged into Settings (16 Oct): files open in the large drawer */
  if(si >= 0) TABS.splice.apply(TABS, [si, 0].concat(add));

  var _paintTabs = window.paintTabs;
  window.paintTabs = function(){
    _paintTabs();
    var tabs = document.getElementById('tabs');
    /* on a Deliverable the chat is its coordinator: name it, so it is clear the agent lives inside the Deliverable */
    var b = tabs.querySelector('.v8agt');
    /* in Hive Mind the chat is always the Blueprint Agent; you talk to the coordinator inside a Deliverable (20 Oct) */
    if(b){ var ic = b.querySelector('.v8ava'); b.innerHTML = (ic ? ic.outerHTML : '') + 'Agent'; }
    var w = tabs.querySelector('.v5tab[onclick*="workflow"] .lb');
    if(w && COORD) w.insertAdjacentHTML('afterend', ' <span class="bscount" style="font-size:12px;color:var(--ink3)">'+steps().length+'</span>');
    /* version and Edit: two separate buttons, right-aligned on the tab bar (20 Oct) */
    tabs.insertAdjacentHTML('beforeend', '<span class="bstitle" id="bsTitle"></span>');
    paintTop();
  };
  var _openTab = window.openTab;
  window.openTab = function(k){
    document.body.classList.toggle('bssrc', k === 'source');
    /* switching tab closes the drawer: it belongs to the tab it was opened from (20 Oct) */
    if(k !== window.TAB) closeDrawerQuiet();
    _openTab(k); markOpen();
    if(k === 'content') decorateContent();
  };
  /* Content tab (20 Oct): three kinds of section. Facts that live in the agent's files are generated
     and read only here; the explanation is README.md, edited in place and published with the rest;
     open questions and next steps are live notes, saved at once and not versioned. */
  var GEN = {'c-purpose':['prompt.md','agent'], 'c-where':['agent.yaml','agent'], 'c-data':['Systems and Tools','settings']};
  var LIVE = {'c-open':1, 'c-next':1};
  function liveKey(id){ return 'gyLive:'+PAGE+':'+id; }
  function decorateContent(){
    [].forEach.call(document.querySelectorAll('section.v8sec'), function(sec){
      var id = sec.id, hd = sec.querySelector('.v5ch'), call = sec.querySelector('.callout');
      if(GEN[id]){
        var g = GEN[id], lnk = '<div class="bsgen"><i class="ti ti-link"></i>From '+g[0]+' &middot; <a onclick="'+(g[1]==='agent'?'openTab(\'settings\');bsOpenFile(\''+(id==='c-purpose'?'prompt':'agent')+'\')':'openTab(\'settings\')')+'">Edit in Settings</a></div>';
        (hd || call).insertAdjacentHTML('afterend', lnk);
        return;
      }
      var kids = [].slice.call(sec.children).filter(function(c){ return c !== hd && !c.classList.contains('bsgen'); });
      if(!kids.length) return;
      var wrap = document.createElement('div');
      kids[0].parentNode.insertBefore(wrap, kids[0]);
      kids.forEach(function(c){ wrap.appendChild(c); });
      if(LIVE[id]){
        wrap.className = 'bslive';
        try { var sv = localStorage.getItem(liveKey(id)); if(sv) wrap.innerHTML = sv; } catch(e){}
        if(hd) hd.insertAdjacentHTML('afterend', '<div class="bsgen"><i class="ti ti-bolt"></i>Live notes &middot; '+(canEdit()?'saved as you type, ':'')+'not versioned</div>');
        if(canEdit()){
          wrap.contentEditable = 'true';
          wrap.addEventListener('input', function(){ try { localStorage.setItem(liveKey(id), wrap.innerHTML); } catch(e){} });
          wrap.addEventListener('click', function(e){ var b = e.target.closest && e.target.closest('.tbox'); if(!b) return; b.parentNode.classList.toggle('done'); try { localStorage.setItem(liveKey(id), wrap.innerHTML); } catch(e){} });
        }
        return;
      }
      wrap.className = 'bsrdm';
      if(S.readme[id] != null) wrap.innerHTML = S.readme[id];
      if(S.on){
        wrap.contentEditable = 'true';
        wrap.addEventListener('input', function(){
          S.readme[id] = wrap.innerHTML;
          var t = hd ? (hd.querySelector('.v5cht')||hd).textContent : id;
          if(!chgFor('readme:'+id)) addChange('readme:'+id, 'Changed', 'README: '+t, 'README.md');
          paintTop();
        });
      }
    });
  }
  function repaint(){ var b = document.querySelector('.v5body'), y = b ? b.scrollTop : 0; openTab(window.TAB); if(b) b.scrollTop = y; paintTop(); markOpen(); }

  /* ── Workflow tab ─────────────────────────────────────────────────── */
  VIEWS.workflow = function(){
    var hh = '<div class="v8ttl bswft"><span>'+h(D.blueprint)+'</span></div><div class="bswf">';
    hh += D.wf.map(function(c, ci){
      return '<section class="bsch"><div class="bschh"><span class="n">'+(ci+1)+'</span><span class="t">'+h(c.t)+'</span></div><div class="bssteps">'
        + c.s.map(function(s, i){
            var k = (ci+1)+'.'+(i+1), cg = chgFor('step:'+s.id) || chgFor('new:'+s.id);
            var tag = s.isNew ? '<span class="bstag new">New</span>' : (cg ? '<span class="bstag">Changed</span>' : '');
            var by = s.ty === 'decision' ? roleName(s.by)+' decides' : roleName(s.by);
            return '<div class="bsst'+(S.sel===s.id?' sel':'')+'" onclick="bsStep(\''+s.id+'\')"><span class="k">'+k+'</span>'
              + '<span class="ic '+s.ty+'"><i class="ti '+IC[s.ty]+'"></i></span><span class="nm">'+(h(s.t)||'<span style="color:var(--ink3)">Untitled step</span>')+'</span>'
              + tag + '<span class="by">'+h(by)+'</span><i class="ti ti-chevron-right ch"></i></div>';
          }).join('')
        /* adding, removing and moving steps goes through the Blueprint Agent (20 Oct) */
        + ''
        + '</div></section>';
    }).join('');
    return hh + '</div>';
  };

  function openDrawer(title, body){
    document.getElementById('drtitle').textContent = title;
    document.getElementById('drbody').innerHTML = body;
    document.getElementById('dricon').classList.add('hide');
    drSize(false); S.file = null; markOpen();
    document.getElementById('drawer').classList.remove('hide');
  }
  var _close = window.closeDrawer;
  window.closeDrawer = function(){ S.sel = null; S.file = null; drSize(false); markOpen(); _close(); if(window.TAB === 'workflow') repaint(); };

  window.bsStep = function(id, view){
    var x = find(id); if(!x) return;
    S.sel = id; S.file = 'step:'+id; S.grp = 'Steps';
    S.stepView = view || 'step';
    if(window.TAB === 'workflow') repaint();
    paintStep();
  };
  window.bsStepView = function(v){ S.stepView = v; paintStep(); };
  function paintStep(){
    var x = find(S.sel); if(!x) return;
    var s = x.s, id = s.id, k = 'step:'+id;
    var who = (D.roles||[]).filter(function(r){ return s.ty === 'agent' ? r[2] === 'agent' : r[2] === 'person'; });
    var fchip = function(r){
      var f = (folderSpec() || []).filter(function(q){ return q.key === r; })[0];
      return f ? '<button class="bschip bsfold" onclick="bsFolder()" title="In the Deliverable folder"><i class="ti ti-folder"></i>'+h(f.n)+'</button>'
               : '<span class="bschip">'+h(r)+'</span>';
    };
    /* the step is its file (20 Oct): one editor, no form */
    var b = '<pre class="bscode" id="bsCode"'+(S.on?' contenteditable="plaintext-only" spellcheck="false" oninput="bsType(this)"':'')+'>'+lined(body(k))+'</pre>';
    document.getElementById('drtitle').textContent = x.k+' '+(s.t||'Untitled step');
    document.getElementById('dricon').classList.add('hide');
    document.getElementById('drbody').innerHTML = '<div class="bsed"><div class="bsfh"><span class="fn">'+h(stepPath(s))+'</span></div>'+b+drawerAsk()+'</div>';
    document.getElementById('drawer').classList.remove('hide');
    drSize(true); markOpen();
  }
  window.bsSet = function(id, f, v, rerender){
    var x = find(id); if(!x) return;
    x.s[f] = v;
    if(f === 'ty'){ var ok = (D.roles||[]).filter(function(r){ return v === 'agent' ? r[2]==='agent' : r[2]==='person'; }); if(ok.length && !ok.some(function(r){ return r[0]===x.s.by; })) x.s.by = ok[0][0]; }
    if(!x.s.isNew) addChange('step:'+id, 'Changed', 'Step '+x.k+' '+(x.s.t||''), D.wf[x.c].t);
    delete S.edits['step:'+id];
    if(rerender) paintStep();
    else { var t = document.getElementById('drtitle'); if(t) t.textContent = x.k+' '+(x.s.t||'Untitled step'); }
    if(window.TAB === 'workflow') repaint(); else paintTop();
  };
  window.bsAdd = function(ci, ty){
    var r = (D.roles||[]).filter(function(x){ return ty === 'agent' ? x[2]==='agent' : x[2]==='person'; })[0];
    var s = {id:'s'+(++uid), t:'', ty:ty, by:r ? r[0] : '', w:'', r:[], o:[], isNew:true};
    D.wf[ci].s.push(s);
    addChange('new:'+s.id, 'New', ({agent:'Agent step',person:'Person step',decision:'Decision'})[ty], D.wf[ci].t);
    repaint(); bsStep(s.id);
  };

  /* ── Source tab ───────────────────────────────────────────────────── */
  function y(k, v, ind){ return (ind||'') + '<span class="yk">'+k+':</span>' + (v === undefined ? '' : ' '+h(v)); }
  /* [key, label, file name, group, icon] */
  /* hand-written file contents (AG.md, keyed like files()); headings and yaml keys get the usual colours */
  function mdHtml(src){
    return String(src).split('\n').map(function(l){
      if(/^#/.test(l)) return '<span class="mh">'+h(l)+'</span>';
      var m = l.match(/^(\s*-?\s*)([a-z_]+):(.*)$/);
      if(m) return h(m[1])+'<span class="yk">'+m[2]+':</span>'+h(m[3]);
      return h(l);
    }).join('\n');
  }
  /* Deliverable folder (20 Oct): the Blueprint owns the folder's shape (gy-blueprints.js);
     each Deliverable gets its own Google Drive folder made from it */
  function folderSpec(){ return (COORD && window.GYB && GYB.folder) ? GYB.folder(D.id) : null; }
  function stepName(k){ var r = ''; steps().forEach(function(x){ if(x.k === k) r = x.k+' '+x.s.t; }); return r || k; }
  window.bsFolder = function(){ bsOpenFile('sys:folder'); };
  function stepPath(st){ return 'steps/'+(slug(st.t||'untitled step')||'untitled-step')+'.md'; }
  function files(){
    var f = [];
    if(COORD){
      f.push(['blueprint','Structure','blueprint.yaml','Blueprint','ti-hierarchy-2']);
      f.push(['instructions','Instructions','instructions.md','Blueprint','ti-list-details']);
      /* one file per step (20 Oct); the order lives in blueprint.yaml, so the file name has no number */
      steps().forEach(function(x){ f.push(['step:'+x.s.id, x.k+' '+(x.s.t||'Untitled step'), stepPath(x.s), 'Steps', IC[x.s.ty]]); });
    }
    f.push(['agent','Agent','agent.yaml','Agent','ti-adjustments-horizontal']);
    if(AG.secs) f.push(['readme','README','README.md','Agent','ti-file-text']);
    f.push(['prompt','Prompt','prompt.md','Agent','ti-message']);
    (conf.Skills||[]).forEach(function(sk){ f.push(['skill:'+sk, sk, 'skills/'+slug(sk)+'.md','Skills','ti-sparkles']); });
    (conf.Context||[]).forEach(function(x){ f.push(['know:'+x, tx(x), 'knowledge/'+slug(tx(x))+'.md','Knowledge','ti-book']); });
    (conf.Memory||[]).forEach(function(x){ f.push(['mem:'+x, tx(x), 'memory/'+slug(tx(x))+'.yaml','Memory','ti-history']); });
    (conf.Tools||[]).forEach(function(x){ f.push(['tool:'+x, tx(x), 'tools/'+slug(tx(x))+'.yaml','Tools','ti-tool']); });
    if(folderSpec()) f.push(['sys:folder', 'Deliverable folder', 'systems/deliverable-folder.yaml', 'Systems', 'ti-folder']);
    if(AG.conf){ f.push(['gov:dos', 'Do\'s and don\'ts', 'governance/dos-and-donts.yaml','Governance','ti-checklist']);
      f.push(['gov:audit', 'Audit', 'governance/audit.yaml','Governance','ti-list-check']);
      f.push(['gov:evals', 'Evals', 'governance/evals.yaml','Governance','ti-flask']); }
    return f;
  }
  function changedFile(k){
    if(S.edits[k] != null && chgFor('file:'+k)) return true;
    if(!S.changes.length) return false;
    if(k.indexOf('step:') === 0) return !!(chgFor('step:'+k.slice(5)) || chgFor('new:'+k.slice(5)));
    if(k === 'readme') return S.changes.some(function(c){ return /^readme:/.test(c.key); });
    if(k === 'blueprint') return S.changes.some(function(c){ return /^new:/.test(c.key); });
    if(k === 'instructions') return false;
    if(k === 'prompt') return !!chgFor('prompt');
    if(k === 'agent') return S.changes.some(function(c){ return /^conf:/.test(c.key); });
    if(k.indexOf('skill:') === 0) return !!chgFor('conf:Skills:'+k.slice(6));
    return false;
  }
  function body(k){
    if(S.edits[k] != null) return h(S.edits[k]);
    if(AG.md && AG.md[k]) return (k.indexOf('skill:') === 0 ? ['---', y('skill', k.slice(6)), y('used_in', '['+skillUse(k.slice(6)).map(h).join(', ')+']'), '---', ''].join('\n')+'\n' : '') + mdHtml(AG.md[k]);
    var L = [];
    if(k === 'blueprint'){
      L.push('---', y('id', D.id), y('version', S.changes.length ? nextVer(S.ver) : S.ver) + (S.changes.length ? '  <span class="cm"># draft</span>' : ''), y('title', D.blueprint), y('owner', D.owner), y('coordinator', AG.title));
      L.push(y('roles'));
      D.roles.forEach(function(r){ L.push('  - '+y('id', r[0]).trim(), y('title', r[1], '    '), y('kind', r[2], '    ')); });
      L.push(y('chapters'));
      D.wf.forEach(function(c, ci){
        L.push('  - '+y('title', c.t).trim(), y('steps', undefined, '    '));
        c.s.forEach(function(s, i){
          var ln = '      - '+h(stepPath(s))+'  <span class="cm"># '+(ci+1)+'.'+(i+1)+'</span>';
          L.push((s.isNew || chgFor('step:'+s.id)) ? '<span class="chg">'+ln+'</span>' : ln);
        });
      });
      L.push('---');
    } else if(k === 'instructions'){
      L.push('<span class="mh"># How to work</span>', '');
      D.rules.forEach(function(r){ L.push('- '+h(r)); });
      L.push('', '<span class="cm"># Each step\'s own instructions live in steps/</span>');
    } else if(k === 'readme'){
      var plain = function(html){ return tx(String(html).replace(/<svg[\s\S]*?<\/svg>/gi, '\n(diagram)\n').replace(/<\/(div|p|tr|li)>|<br\s*\/?>/gi, '\n').replace(/<\/t[dh]>/gi, '  ')).replace(/\n{3,}/g, '\n\n').trim(); };
      L.push('<span class="mh"># '+h(AG.title)+'</span>');
      (window.SECS||[]).forEach(function(sx){
        if(GEN[sx[0]] || LIVE[sx[0]]) return;
        var t = '<span class="mh">## '+h(sx[1])+'</span>\n\n'+h(plain(S.readme[sx[0]] != null ? S.readme[sx[0]] : sx[2]));
        L.push('', chgFor('readme:'+sx[0]) ? '<span class="chg">'+t+'</span>' : t);
      });
    } else if(k.indexOf('step:') === 0){
      var sx = find(k.slice(5));
      if(sx){
        var st = sx.s, list = function(a){ return '['+(a||[]).map(h).join(', ')+']'; };
        var fm = ['---', y('title', st.t), y('type', st.ty), y(st.ty === 'decision' ? 'decided_by' : 'done_by', roleName(st.by)),
                  y('skills', list(st.sk))].concat(st.uses ? [y('uses', list(st.uses))] : []).concat([y('reads', list(st.r)), y('writes', list(st.o)), '---', '', (h(st.w) || (S.on ? '' : '<span class="cm">(no instructions yet)</span>'))]).join('\n');
        L.push((st.isNew || chgFor('step:'+st.id)) ? '<span class="chg">'+fm+'</span>' : fm);
      }
    } else if(k === 'agent'){
      var pv = function(n){ var x = (AG.props||[]).filter(function(q){ return q[0] === n; })[0]; return x ? tx(x[1]) : ''; };
      var v0 = D.versions[0];
      L.push('---', y('name', AG.title), y('kind', COORD ? 'coordinator' : 'expert'), y('manager', D.owner || D.manager || 'none yet'), y('signs_off', pv('Signs off')),
             y('runs_on'), y('model', D.model, '  '), y('harness', 'GY OS', '  '),
             COORD ? y('blueprint', D.blueprint+' v'+S.ver, '  ') : y('called_by', pv('Called by'), '  '),
             y('version', 'v'+S.ver+', '+v0.date, '  '), y('status', pv('Status'), '  '));
      (AG.conf||[]).forEach(function(c){
        var list = conf[c[0]] || [];
        L.push(y(c[0].toLowerCase()));
        list.forEach(function(it){ var ln = '  - '+h(tx(it)); L.push(chgFor('conf:'+c[0]+':'+it) ? '<span class="chg">'+ln+'</span>' : ln); });
      });
      if(!COORD){ L.push(y('used_in')); D.usedIn.forEach(function(u){ L.push('  - '+h(u.bp)+' v'+u.v+', step '+h(u.step)); }); }
      L.push('---');
    } else if(k === 'sys:folder'){
      var fs = folderSpec() || [];
      L.push('---', y('system', 'Google Drive'), y('one_per', 'Deliverable'), y('made_at', 'New Deliverable, from this structure'),
             y('path', 'GY Programmes / {Programme} / {Programme}: '+D.blueprint), y('shared_with', 'the Deliverable team'),
             y('agent'), y('reads', 'every folder', '  '), y('writes', 'only the folders it fills', '  '), y('folders'));
      fs.forEach(function(f){
        L.push('  - '+y('name', f.n).trim(), y('filled_by', f.fill, '    '), y('holds', f.what, '    '));
        if(f.write.length) L.push(y('filled_at', '['+f.write.map(stepName).join(', ')+']', '    '));
        if(f.read.length) L.push(y('read_at', '['+f.read.map(stepName).join(', ')+']', '    '));
      });
      L.push('---');
    } else if(k === 'prompt'){
      var p = '<span class="mh"># '+h(AG.title)+'</span>\n\n'+h(tx(S.prompt));
      L.push(chgFor('prompt') ? '<span class="chg">'+p+'</span>' : p);
    } else if(k.indexOf('skill:') === 0){
      var sk = k.slice(6), use = skillUse(sk);
      L.push('---', y('skill', sk), y('used_in', '['+use.map(h).join(', ')+']'), '---', '',
             '<span class="mh"># '+h(sk)+'</span>', '', '<span class="mh">## When to use</span>', 'Whenever a step lists it under skills.', '');
      L.push(
             '<span class="mh">## Done when</span>', 'The result says where every fact came from, and how sure we are.', '',
             '<span class="mh">## Ask a person when</span>', 'The sources disagree, or a number is below medium confidence.');
    } else if(k.indexOf('know:') === 0){
      var kn = tx(k.slice(5));
      L.push('---', y('title', kn), y('owner', D.owner || D.manager || 'none yet'), y('used_by', AG.title), y('updated', D.versions[0].date), '---', '',
             '<span class="mh"># '+h(kn)+'</span>', '', '<span class="mh">## What it covers</span>', '<span class="cm">Written by the expert who owns it.</span>', '',
             '<span class="mh">## Where it comes from</span>', '<span class="cm">Each source, with its date.</span>', '',
             '<span class="mh">## How the agent uses it</span>', 'Read when a step needs '+h(kn.toLowerCase())+'. Quote the source; never guess past it.');
    } else if(k.indexOf('gov:') === 0 && window.bsGovData){
      var GD = window.bsGovData(), q = function(x){ return '"'+h(tx(x)).replace(/"/g,'\\"')+'"'; };
      L.push('---');
      if(k === 'gov:dos'){ L.push(y('do')); GD.appr.forEach(function(x){ L.push('  - '+q(x)); }); L.push(y('dont')); GD.never.forEach(function(x){ L.push('  - '+q(x)); }); }
      if(k === 'gov:audit'){ L.push(y('audit')); GD.audit.forEach(function(x){ L.push('  - '+q(x)); }); }
      if(k === 'gov:evals'){ L.push(y('evals')); GD.evals.forEach(function(e){ L.push('  - '+y('name', e[0]).trim(), y('passes_when', tx(e[1]), '    ')); }); }
      L.push(y('inherits', 'core-blueprint/governance.yaml') + ' <span class="cm"># rules every agent shares</span>', '---');
    } else if(k.indexOf('tool:') === 0){
      var tn = tx(k.slice(5)), lk = /lookup/i.test(tn), calc = /calculator|estimator|check|curve/i.test(tn),
          kind = lk ? 'lookup' : calc ? 'calculation' : 'action';
      L.push('---', y('name', tn), y('kind', kind));
      if(lk) L.push(y('reads', tn.replace(/\s*lookup$/i, '')), y('access', 'read only'), y('cache', 'none, fetched each run'));
      else if(calc) L.push(y('method', 'from the rule book') + ' <span class="cm"># same input, same answer</span>', y('access', 'no outside calls'));
      else if(/email|composer/i.test(tn)) L.push(y('access', 'drafts only') + ' <span class="cm"># never sends</span>', y('send', 'false'));
      else if(/save|database/i.test(tn)) L.push(y('access', 'writes to the GY buyer database'), y('needs', 'sign-off first'));
      else L.push(y('access', 'creates files in the Deliverable'));
      L.push(y('inputs') + ' <span class="cm"># filled in when the tool is built</span>', y('outputs'), y('used_by', AG.title), '---');
    } else if(k.indexOf('mem:') === 0){
      var mn = tx(k.slice(4)), runs = [];
      D.versions.forEach(function(v){ (v.runs||[]).forEach(function(r){ runs.push([r[0], v.v]); }); });
      L.push('---', y('name', mn), y('written_by', 'each run'), y('promoted_to', '[skills, knowledge]'), y('promoted_by', D.owner || D.manager || 'the manager'), y('entries'));
      if(runs.length) runs.forEach(function(r){ L.push('  - '+y('run', r[0]).trim(), y('blueprint', 'v'+r[1], '    '), y('note', undefined, '    ')+' <span class="cm"># added after the run</span>'); });
      else L.push('  <span class="cm"># empty until the first run</span>');
      L.push('---');
    }
    return L.join('\n');
  }
  function admins(){
    return '<span class="bsadm" data-tip="Admins edit Source">'+ACCESS.filter(function(p){ return p.lvl === 'Admin'; }).map(function(p){ return avh(p, 'sm'); }).join('')+'</span>';
  }
  function stHtml(k){
    return changedFile(k)
      ? '<span class="st ed" id="bsFst"><i class="d"></i>Edited, not saved</span>'
      : '<span class="st" id="bsFst"><i class="ti ti-pencil"></i>Editable</span>';
  }
  VIEWS.source = function(){
    var F = files(), cur = null;
    F.forEach(function(f){ if(f[0] === S.file) cur = f; });
    if(!cur){ cur = F[0]; S.file = cur[0]; }
    if(S.grp == null) S.grp = cur[3];
    var esc1 = function(k){ return h(k).replace(/'/g, "\\'"); };
    var A = function(f){ return '<a class="'+(f[0]===S.file?'on':'')+'" onclick="bsFile(\''+esc1(f[0])+'\')" title="'+h(f[2])+'"><i class="ti '+f[4]+'"></i><span>'+h(f[1])+'</span>'+(changedFile(f[0])?'<i class="fd"></i>':'')+'</a>'; };
    var groups = [], by = {};
    F.forEach(function(f){ if(!by[f[3]]){ by[f[3]] = []; groups.push(f[3]); } by[f[3]].push(f); });
    var toc = '<nav class="bstoc"><div class="t">Files</div>' + groups.map(function(g){
      return '<div class="g'+(S.grp===g?' open':'')+'" data-g="'+g+'"><button class="gh" onclick="bsGroup(\''+g+'\')"><i class="ti ti-caret-right-filled cr"></i><span>'+g+'</span></button>'
        + '<div class="gb">'+by[g].map(A).join('')+'</div></div>';
    }).join('') + '</nav>';
    var sel = '<div class="bsfsel">'+F.map(function(f){ return '<button class="'+(f[0]===S.file?'on':'')+'" onclick="bsFile(\''+esc1(f[0])+'\')">'+h(f[1])+'</button>'; }).join('')+'</div>';
    return '<div class="bssrcw"><div class="bssheet">'
      + '<div class="bsfh"><i class="ti ti-file-code" style="color:var(--ink3);font-size:17px"></i><span class="fn">'+h(cur[2])+'</span><span class="sp"></span>'+admins()+stHtml(cur[0])+'</div>'
      + sel
      + '<pre class="bscode" id="bsCode"'+(S.on?' contenteditable="plaintext-only" spellcheck="false" oninput="bsType(this)"':'')+'>'+lined(body(cur[0]))+'</pre>'
      + '</div>' + toc + '</div>';
  };
  window.bsFile = function(k){
    S.file = k;
    files().forEach(function(f){ if(f[0] === k) S.grp = f[3]; });
    repaint();
  };
  window.bsGroup = function(g){
    S.grp = S.grp === g ? '' : g;
    [].forEach.call(document.querySelectorAll('.bstoc .g'), function(el){ el.classList.toggle('open', el.dataset.g === S.grp); });
  };
  /* typing in a file is editing the Blueprint: it opens the studio without redrawing the sheet */
  /* one block per line with a hanging indent (20 Oct): a wrapped YAML value continues under its own text,
     not at the left edge. Text is unchanged, so innerText still reads back the file line for line. */
  function lined(html){
    return String(html).split('\n').map(function(l){
      var t = l.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' '), n = (t.match(/^ */) || [''])[0].length;
      var m = t.slice(n).match(/^(- |\d+\. )/), hang = n + (m ? m[0].length : 2);
      return '<span class="bsln" style="--h:'+hang+'ch">'+(l === '' ? '\u200b' : l)+'</span>';
    }).join('');
  }
  (function(){
    var st = document.createElement('style');
    st.textContent = '.bscode .bsln{display:block;white-space:pre-wrap;padding-left:var(--h);text-indent:calc(-1 * var(--h))}';
    document.head.appendChild(st);
  })();
  window.bsType = function(el){
    var k = S.file, name = '';
    var txt = el.innerText.replace(/\u200b/g, '');
    if(k && k.indexOf('step:') === 0){ stepTyped(k.slice(5), txt); return; }
    files().forEach(function(f){ if(f[0] === k) name = f[2]; });
    S.edits[k] = txt;
    if(!S.on) return;
    addChange('file:'+k, 'Changed', name+' edited by hand', 'Source');
    var s = document.getElementById('bsFst'); if(s) s.outerHTML = stHtml(k);
    var a = document.querySelector('.bstoc a.on'); if(a && !a.querySelector('.fd')) a.insertAdjacentHTML('beforeend', '<i class="fd"></i>');
    paintTop();
  };

  /* a step file typed by hand: read its header and body back into the step, so the
     Workflow list follows; a header the agent could not run on becomes a thing to fix */
  var TYPES = ['agent','person','decision'];
  function stepTyped(id, text){
    var x = find(id); if(!x || !S.on) return;
    var st = x.s, errs = [], lines = String(text).replace(/\r/g,'').split('\n'), fm = {}, bodyStart = 0;
    if((lines[0]||'').trim() === '---'){
      var end = -1; for(var i = 1; i < lines.length; i++) if(lines[i].trim() === '---'){ end = i; break; }
      if(end < 0) errs.push('Step '+x.k+': the header has no closing ---.');
      else { lines.slice(1, end).forEach(function(l){ var m = l.match(/^\s*([a-z_]+)\s*:\s*(.*)$/); if(m) fm[m[1]] = m[2].trim(); }); bodyStart = end + 1; }
    } else errs.push('Step '+x.k+': the file must start with a --- header.');
    var list = function(v){ v = String(v||'').trim().replace(/^\[|\]$/g,''); return v ? v.split(',').map(function(q){ return q.trim(); }).filter(Boolean) : []; };
    if(fm.title != null) st.t = fm.title;
    if(fm.type != null){ if(TYPES.indexOf(fm.type) >= 0) st.ty = fm.type; else errs.push('Step '+x.k+': type must be agent, person or decision.'); }
    var who = fm.done_by != null ? fm.done_by : fm.decided_by;
    if(who != null){
      var r = (D.roles||[]).filter(function(q){ return q[1].toLowerCase() === who.toLowerCase(); })[0];
      if(r) st.by = r[0]; else errs.push('Step '+x.k+': nobody called "'+who+'" in this Blueprint.');
    }
    if(fm.skills != null){
      var known = conf.Skills || [], sks = list(fm.skills);
      sks.forEach(function(q){ if(!known.some(function(n){ return n.toLowerCase() === q.toLowerCase(); })) errs.push('Step '+x.k+': no skill called "'+q+'" in Context.'); });
      st.sk = sks.map(function(q){ return known.filter(function(n){ return n.toLowerCase() === q.toLowerCase(); })[0] || q; });
    }
    if(fm.uses != null){
      var kn = (conf.Tools||[]).concat(conf.Connections||[]), us = list(fm.uses);
      us.forEach(function(q){ if(!kn.some(function(n){ return n.toLowerCase() === q.toLowerCase(); })) errs.push('Step '+x.k+': no tool or connection called "'+q+'".'); });
      st.uses = us.map(function(q){ return kn.filter(function(n){ return n.toLowerCase() === q.toLowerCase(); })[0] || q; });
    }
    if(fm.reads != null) st.r = list(fm.reads);
    if(fm.writes != null) st.o = list(fm.writes);
    if(bodyStart) st.w = lines.slice(bodyStart).join('\n').trim();
    S.stepErr[id] = errs;
    S.edits['step:'+id] = text;
    if(!st.isNew) addChange('step:'+id, 'Changed', 'Step '+x.k+' '+(st.t||''), D.wf[x.c].t);
    var t = document.getElementById('drtitle'); if(t) t.textContent = x.k+' '+(st.t||'Untitled step');
    if(window.TAB === 'workflow'){ var bd = document.querySelector('.v5body'), sy = bd ? bd.scrollTop : 0; _openTab('workflow'); if(bd) bd.scrollTop = sy; markOpen(); }
    paintTop();
  }

  /* ── large drawer: the drawer editor (16 Oct) ─────────────────────────
     Small drawer = previewer, large drawer = editor. The large drawer takes
     an equal half with the main content; the chat keeps its width. */
  function drSize(big){
    var d = document.getElementById('drawer'); if(!d) return;
    d.classList.toggle('lg', !!big); document.body.classList.toggle('bslg', !!big);
    var b = document.getElementById('bsDrSz');
    if(b){ b.innerHTML = '<i class="ti '+(big ? 'ti-arrows-diagonal-minimize-2' : 'ti-arrows-diagonal')+'"></i>'; b.setAttribute('aria-label', big ? 'Smaller drawer' : 'Larger drawer'); }
  }
  window.bsDrSize = function(){ var d = document.getElementById('drawer'); drSize(!d.classList.contains('lg')); };
  function markOpen(){
    [].forEach.call(document.querySelectorAll('.v8row[data-f],.v8agr[data-f]'), function(r){ r.classList.toggle('sel', !!S.file && r.getAttribute('data-f') === S.file); });
  }
  (function(){
    /* no size toggle on the drawer (20 Oct): a file always opens large, close is the only control */
  })();
  window.bsOpenFile = function(k){
    if(k.indexOf('step:') === 0){ bsStep(k.slice(5), 'source'); return; }
    var f = files().filter(function(x){ return x[0] === k; })[0]; if(!f) return;
    S.file = k; S.grp = f[3];
    var duo = (k === 'blueprint' || k === 'instructions') ? ['blueprint','instructions'] : (k === 'agent' || k === 'prompt') ? ['agent','prompt'] : null;
    var pair = duo
      ? '<span class="bsfsw">'+duo.map(function(o){ var g = files().filter(function(x){ return x[0] === o; })[0];
          return '<button class="'+(o===k?'on':'')+'" onclick="bsOpenFile(\''+o+'\')">'+h(g[2])+'</button>'; }).join('')+'</span>'
      : '<span class="fn">'+h(f[2])+'</span>';
    document.getElementById('drtitle').textContent = f[1];
    document.getElementById('dricon').classList.add('hide');
    document.getElementById('drbody').innerHTML = '<div class="bsed"><div class="bsfh">'+pair+'</div>'
      + '<pre class="bscode" id="bsCode"'+(S.on?' contenteditable="plaintext-only" spellcheck="false" oninput="bsType(this)"':'')+'>'+lined(body(k))+'</pre>'+drawerAsk()+'</div>';
    document.getElementById('drawer').classList.remove('hide');
    drSize(true); markOpen();
  };

  /* ── version dropdown ─────────────────────────────────────────────── */
  var VPOP = null;
  function vClose(){ if(VPOP){ VPOP.remove(); VPOP = null; document.removeEventListener('click', vOut, true); } }
  function vOut(e){ if(VPOP && !VPOP.contains(e.target) && !(e.target.closest && e.target.closest('#bsVerB,.bspill,#bsPile,.bspubb'))) vClose(); }
  window.bsVersions = function(anchor){
    if(VPOP){ var was = VPOP._k; vClose(); if(was === 'ver') return; }
    validate();
    var b = '';
    if(S.changes.length || S.fix.length){
      b += '<div class="lbl">Draft</div><div class="bsvi draft"><div class="h">Version '+nextVer(S.ver)+'<span class="dt">Not published</span></div>'
        + S.changes.map(function(c){
            return '<div class="bschg"><span class="bstag'+(c.kind==='New'?' new':'')+'">'+c.kind+'</span><div>'+h(c.text)+(c.where?'<div class="w">'+h(c.where)+'</div>':'')+'</div></div>';
          }).join('')
        + S.fix.map(function(f){ return '<div class="bsfixn"><i class="ti ti-alert-circle"></i><span>'+h(f)+'</span></div>'; }).join('')
        + '<div class="acts"><button class="bsbtn out" onclick="bsDiscard()">Discard</button></div></div>';
    }
    b += '<div class="lbl">Versions</div>' + D.versions.map(function(v, i){
      var cur = String(S.view || S.ver) === String(v.v), go = !LATER ? '' : i === 0 ? (S.view ? 'bsView(null)' : '') : (cur ? '' : 'bsView(\''+v.v+'\')');
      return '<div class="bsvi'+(go?' pick':'')+'"'+(go?' onclick="'+go+'"':'')+'><div class="h">Version '+v.v+(i===0?' <span class="bstag">Current</span>':'')+(S.view && cur?' <span class="bstag">Viewing</span>':'')+'<span class="dt">'+h(v.date)+'</span></div>'
        + '<div class="nt">'+h(v.note)+'</div><div class="by">'+h(v.by)+'</div>'
        + (v.runs.length ? '<div class="runs">'+v.runs.map(function(r){ return r[1] ? '<a href="'+r[1]+'">'+h(r[0])+'</a>' : '<span>'+h(r[0])+'</span>'; }).join('')+'</div>' : '')
        + '</div>';
    }).join('');
    if(!COORD) b += '<div class="lbl">Used in</div>' + D.usedIn.map(function(u){ return '<div class="bsuse"><a href="'+u.href+'">'+h(u.bp)+' v'+u.v+'</a>, step '+h(u.step)+'</div>'; }).join('');
    VPOP = document.createElement('div'); VPOP.className = 'bsvpop'; VPOP._k = 'ver'; VPOP.innerHTML = b;
    document.body.appendChild(VPOP);
    var r = anchor.getBoundingClientRect(), w = VPOP.offsetWidth;
    VPOP.style.left = Math.max(12, Math.min(r.right - w, window.innerWidth - w - 12)) + 'px';
    VPOP.style.top = (r.bottom + 6) + 'px';
    setTimeout(function(){ document.addEventListener('click', vOut, true); }, 0);
  };
  window.bsAccess = function(anchor){
    if(VPOP){ var was = VPOP._k; vClose(); if(was === 'acc') return; }
    var G = LATER ? LEVELS.map(function(l){ return [l[0], l[1], [l[0]]]; })
      : [['Can edit', 'Changes and publishes it', ['Admin','Editor']], ['Can view', 'Reads it and asks the Blueprint Agent', ['Viewer']]];
    var b = G.map(function(l){
      var ps = ACCESS.filter(function(p){ return l[2].indexOf(p.lvl) >= 0; });
      if(!ps.length) return '';
      return '<div class="lblh">'+l[0]+'<span>'+l[1]+'</span></div>' + ps.map(function(p){
        return '<div class="row">'+avh(p)+'<span class="nm">'+h(p.name)+'</span></div>';
      }).join('');
    }).join('');
    VPOP = document.createElement('div'); VPOP.className = 'bsvpop bsacc'; VPOP._k = 'acc'; VPOP.innerHTML = b;
    document.body.appendChild(VPOP);
    var r = anchor.getBoundingClientRect(), w = VPOP.offsetWidth;
    VPOP.style.left = Math.max(12, Math.min(r.right - w, window.innerWidth - w - 12)) + 'px';
    VPOP.style.top = (r.bottom + 6) + 'px';
    setTimeout(function(){ document.addEventListener('click', vOut, true); }, 0);
  };
  window.addEventListener('resize', vClose);
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') vClose(); });

  /* ── Blueprint Studio mode ────────────────────────────────────────── */
  var CHIPS = COORD
    ? ['Where could a person check the work?', 'Add a step after 2.4 where Trade checks the buyer list', 'Make the instructions shorter']
    : ['Make the prompt shorter', 'Add a skill for stacking rules', 'Which steps use this agent?'];
  var VCHIPS = COORD ? ['How does this Blueprint work?', 'Who does what?'] : ['What does this agent do?', 'Which steps use this agent?'];
  /* Quiet start (20 Oct): no intro text, no card. Two or three suggestions sit just above the input as plain
     rows and leave with the first question; the draft pill explains drafts when the first change happens. */
  function chips(){
    return '<div class="gyqa bsstart">' + (canEdit() ? CHIPS : VCHIPS).map(function(o){
      return '<button onclick="bsAsk(this.querySelector(\'.l\').textContent)"><i class="ti ti-corner-down-right"></i><span class="l">'+h(o)+'</span></button>';
    }).join('') + '</div>';
  }
  (function(){
    var st = document.createElement('style');
    st.textContent = 'body.bsfresh #chatlog{display:flex;flex-direction:column}body.bsfresh #chatin{margin-top:auto}'
      + '.bsstart{display:flex;flex-direction:column;gap:2px;margin:0 -10px 4px}'
      + '.bsstart button{display:flex;align-items:flex-start;gap:9px;width:100%;text-align:left;border:none;background:none;border-radius:10px;'
      +   'padding:8px 10px;font-family:inherit;font-size:14px;line-height:1.4;color:var(--ink2);cursor:pointer}'
      + '.bsstart button .ti{font-size:15px;color:var(--ink3);margin-top:1px;flex:none}'
      + '.bsstart button:hover{background:var(--graybg);color:var(--ink)}.bsstart button:hover .ti{color:var(--ink2)}';
    document.head.appendChild(st);
    var pc = window.paintChat;
    if(pc) window.paintChat = function(){ document.body.classList.toggle('bsfresh', LOG.length === 1 && LOG[0].indexOf('bsstart') >= 0); return pc.apply(this, arguments); };
  })();
  var _send = window.sendMsg;
  /* No Edit mode (20 Oct): Admins and Editors can always edit, Viewers never can. The first change starts
     a draft (the tab bar turns yellow) and nothing is live until it is published. ?as=viewer|editor|admin previews a role. */
  var ME = 'Thomas Moes';
  var asM = location.search.match(/[?&]as=(admin|editor|viewer)/i);
  function myLevel(){
    if(asM) return asM[1].charAt(0).toUpperCase() + asM[1].slice(1).toLowerCase();
    var a = ACCESS.filter(function(x){ return x.name === ME; })[0]; return a ? a.lvl : 'Viewer';
  }
  function canEdit(){ var l = myLevel(); return l === 'Admin' || l === 'Editor'; }
  function setEdit(){ S.on = canEdit() && !S.view; document.body.classList.toggle('bson', S.on); }
  window.bsEdit = function(){ setEdit(); paintTabs(); repaint(); };
  function chatToBlueprint(){
    LOG.length = 0;
    LOG.push(chips());
    var a = document.getElementById('ask'); if(a) a.placeholder = 'Ask the agent';
    window.sendMsg = bsSend; paintChat();
  }
  window.bsView = function(v){
    vClose();
    S.view = (v && String(v) !== String(S.ver)) ? String(v) : null;
    setEdit(); closeDrawerQuiet(); paintTabs(); repaint();
  };
  window.bsRestore = function(){
    var v = S.view; if(!v) return;
    S.view = null; setEdit();
    addChange('restore:'+v, 'Changed', 'Restored from version '+v, 'Whole '+(COORD?'Blueprint':'agent'));
    paintTabs(); repaint();
    gyToast('Version '+v+' is now your draft. Publish it to make it current.');
  };
  function closeDrawerQuiet(){ S.sel = null; S.file = null; drSize(false); markOpen(); document.getElementById('drawer').classList.add('hide'); }
  /* Ask the agent from the drawer (20 Oct): an input at the foot of the file. The question goes into the
     same Blueprint Agent conversation (left), with this file attached: the selected text if there is one,
     otherwise the step's instructions, otherwise the file as a whole. */
  function drawerAsk(){
    return '<div class="bsdask"><div class="bsdbox"><input id="bsAsk2" placeholder="Ask about this file" onkeydown="if(event.key===\'Enter\')bsAskFile()">'
      + '<button class="v5send" onclick="bsAskFile()" aria-label="Send"><i class="ti ti-arrow-up"></i></button></div></div>';
  }
  window.bsAskFile = function(){
    var inp = document.getElementById('bsAsk2'), v = (inp && inp.value || '').trim(); if(!v) return;
    inp.value = '';
    var k = S.file, sel = window.getSelection(), code = document.getElementById('bsCode'), t = '';
    if(code && sel && !sel.isCollapsed && code.contains(sel.anchorNode)) t = sel.toString().trim();
    else if(S.lastSel && S.lastSel.file === k) t = S.lastSel.text;
    S.lastSel = null; selHide();
    if(!t && k && k.indexOf('step:') === 0){ var x = find(k.slice(5)); if(x) t = x.s.w || ''; }
    if(!S.quote || S.quote.file !== k) S.quote = {file:k, label:fileLabel(k), text:t, whole:!t};
    document.body.classList.remove('pclosed');
    bsAsk(v);
  };
  function bsSend(){
    var inp = document.getElementById('ask'), v = (inp.value||'').trim(); if(!v) return;
    inp.value = ''; bsAsk(v);
  }
  window.bsAsk = function(q){
    for(var i = LOG.length - 1; i >= 0; i--) if(LOG[i].indexOf('gyqa') >= 0 || LOG[i].indexOf('class="gyq"') >= 0) LOG.splice(i, 1);
    var Q = S.quote; S.quote = null; paintQuote();
    LOG.push(you((Q ? quoteHtml(Q) : '') + esc(q))); paintChat();
    if(Q && S.on){ setTimeout(function(){ LOG.push(say(quoteAsk(q, Q))); paintChat(); paintTop(); }, 650); return; }
    if(!S.on){
      var ro = S.view ? 'You are looking at version '+S.view+', which is read only. Go back to v'+S.ver+' or restore this version as a draft to change it.'
                      : 'You have view access, so I can explain this '+(COORD?'Blueprint':'agent')+' but not change it. Ask the owner for edit access.';
      setTimeout(function(){ LOG.push(say(ro)); paintChat(); }, 650); return;
    }
    setTimeout(function(){ LOG.push(say(answer(q))); LOG.push(chips()); paintChat(); paintTabs(); repaint(); }, 650);
  };
  /* Mention a selection (20 Oct): select text in a file, "Ask the agent" puts it in the chat as an
     @mention, and the next message is about that text. The Blueprint Agent can shorten it, replace it,
     add to it, turn it into a list or remove it; the edit lands in the draft like any other. */
  function fileLabel(k){
    if(k && k.indexOf('step:') === 0){ var x = find(k.slice(5)); return x ? x.k+' '+(x.s.t||'Untitled step') : k; }
    var f = files().filter(function(z){ return z[0] === k; })[0]; return f ? f[2] : k;
  }
  function quoteHtml(Q){
    if(Q.whole) return '<span class="bsqm"><span class="at"><i class="ti ti-at"></i>'+h(Q.label)+'</span></span>';
    var t = Q.text.length > 90 ? Q.text.slice(0, 88)+'…' : Q.text;
    return '<span class="bsqm"><span class="at"><i class="ti ti-at"></i>'+h(Q.label)+'</span><span class="qt">“'+h(t)+'”</span></span>';
  }
  function paintQuote(){
    var old = document.getElementById('bsQ'); if(old) old.remove();
    var a = document.getElementById('ask'); if(!a) return;
    if(S.quote){
      a.insertAdjacentHTML('beforebegin', '<div class="bsq" id="bsQ">'+quoteHtml(S.quote)+'<button class="x" onclick="bsUnquote()" aria-label="Remove"><i class="ti ti-x"></i></button></div>');
      a.placeholder = S.on ? 'What should change in this text?' : 'What do you want to know about this text?';
    } else a.placeholder = 'Ask the agent';
  }
  window.bsUnquote = function(){ S.quote = null; paintQuote(); };
  var SELB = null;
  function selHide(){ if(SELB){ SELB.remove(); SELB = null; } }
  function selCheck(){
    var sel = window.getSelection(), code = document.getElementById('bsCode');
    if(code && sel && sel.isCollapsed && code.contains(sel.anchorNode)) S.lastSel = null;
    if(!code || !sel || sel.isCollapsed || !code.contains(sel.anchorNode) || !code.contains(sel.focusNode)){ selHide(); return; }
    var text = sel.toString().trim(); if(text.length < 3){ selHide(); return; }
    S.lastSel = {file:S.file, text:text};
    var r = sel.getRangeAt(0).getBoundingClientRect();
    if(!SELB){
      SELB = document.createElement('button'); SELB.className = 'bsselb';
      SELB.innerHTML = '<i class="ti ti-message-plus"></i>Ask the agent';
      SELB.addEventListener('mousedown', function(e){ e.preventDefault(); });
      SELB.addEventListener('click', function(){
        var t = window.getSelection().toString().trim(); if(!t) return;
        S.quote = {file:S.file, label:fileLabel(S.file), text:t};
        selHide(); paintQuote();
        document.body.classList.remove('pclosed');
        var a = document.getElementById('ask'); if(a) a.focus();
      });
      document.body.appendChild(SELB);
    }
    SELB.style.left = Math.max(12, Math.min(r.left, window.innerWidth - 180)) + 'px';
    SELB.style.top = Math.max(12, r.top - 42) + 'px';
  }
  document.addEventListener('mouseup', function(){ setTimeout(selCheck, 0); });
  document.addEventListener('keyup', function(e){ if(e.shiftKey || e.key === 'Escape') setTimeout(selCheck, 0); });
  document.addEventListener('scroll', selHide, true);
  function quoteAsk(q, Q){
    var k = Q.file, full = tx(body(k)), l = q.toLowerCase(), nw, m;
    if(Q.whole) return 'Which part of '+h(Q.label)+' should change? Select it in the file and ask again, or say what to do with the whole file.';
    if(full.indexOf(Q.text) < 0) return 'That text has changed since you selected it. Select it again and I will pick it up.';
    var sentences = function(t){ return t.match(/[^.!?]+[.!?]*/g) || [t]; };
    if((m = q.match(/(?:replace (?:it )?with|change (?:it )?to|make it say|rewrite (?:it )?as)\s*[:“"']?\s*(.+?)[”"']?\s*$/i))) nw = m[1];
    else if(/\b(remove|delete|drop)\b/.test(l)) nw = '';
    else if((m = q.match(/\b(?:add|append|also)\b\s*(?:that\s*)?[:“"']?\s*(.+?)[”"']?\s*$/i))) nw = Q.text.replace(/[.\s]*$/, '.') + ' ' + m[1].charAt(0).toUpperCase() + m[1].slice(1).replace(/[.]?$/, '.');
    else if(/\b(list|bullets?)\b/.test(l)) nw = sentences(Q.text).map(function(x){ return '- ' + x.trim(); }).join('\n');
    else if(/shorter|shorten|tighten|concise|one sentence|simpler/.test(l)){
      var ss = sentences(Q.text);
      nw = ss.length > 1 ? ss[0].trim() : Q.text.split(/,\s+(?:and|but|so)\s+/)[0].replace(/[.\s]*$/, '.');
      nw = nw.replace(/\s+in (?:one|two|three) sentences?/i, '');
    }
    if(nw == null) return 'I can do a few things with the selected text in '+h(Q.label)+': make it shorter, replace it with something you type, add a sentence to it, turn it into a list, or remove it. Which would you like?';
    var out = full.replace(Q.text, nw);
    if(k.indexOf('step:') === 0) stepTyped(k.slice(5), out);
    else { S.edits[k] = out; addChange('file:'+k, 'Changed', fileLabel(k)+' edited', 'Source'); }
    if(S.file === k){
      if(k.indexOf('step:') === 0) paintStep(); else bsOpenFile(k);
      var code = document.getElementById('bsCode');
      if(code && nw){ var e1 = h(nw).split('\n')[0]; code.innerHTML = code.innerHTML.replace(e1, '<mark class="bsflash">'+e1+'</mark>'); }
    }
    var lb = h(Q.label) + (/[?.!]$/.test(Q.label) ? '' : '.');
    return nw ? 'Changed it in '+lb+' The new text is highlighted on the right, and it is in the draft until you publish.'
              : 'Removed it from '+lb+' It is in the draft until you publish.';
  }

  /* structure changes by asking (20 Oct): add, remove or move a step; each lands in the draft */
  function stepAt(c, i){ var ch = D.wf[c-1]; return ch && ch.s[i-1] ? {ch:ch, ci:c-1, si:i-1, s:ch.s[i-1]} : null; }
  function structureAsk(q){
    var l = q.toLowerCase(), m;
    if((m = l.match(/(?:remove|delete)\s+(?:step\s+)?(\d+)\.(\d+)/))){
      var a = stepAt(+m[1], +m[2]); if(!a) return 'There is no step '+m[1]+'.'+m[2]+'.';
      a.ch.s.splice(a.si, 1); delete S.stepErr[a.s.id];
      addChange('del:'+a.s.id, 'Removed', 'Step '+m[1]+'.'+m[2]+' '+a.s.t, a.ch.t);
      return 'Removed '+m[1]+'.'+m[2]+' '+a.s.t+'. The steps after it move up a number. It is in the draft until you publish.';
    }
    if((m = l.match(/move\s+(?:step\s+)?(\d+)\.(\d+)\s+(after|before)\s+(?:step\s+)?(\d+)\.(\d+)/))){
      var from = stepAt(+m[1], +m[2]), to = stepAt(+m[4], +m[5]); if(!from || !to) return 'I could not find both steps.';
      from.ch.s.splice(from.si, 1);
      var ti = to.ch.s.indexOf(to.s); to.ch.s.splice(m[3] === 'after' ? ti + 1 : ti, 0, from.s);
      addChange('move:'+from.s.id, 'Changed', 'Moved '+from.s.t+' '+m[3]+' '+to.s.t, to.ch.t);
      return 'Moved '+from.s.t+' to '+find(from.s.id).k+'. It is in the draft until you publish.';
    }
    if(/\badd\b/.test(l) && /\b(step|check|review|decision)\b/.test(l)){
      var ci = D.wf.length - 1, at = D.wf[ci].s.length;
      if((m = l.match(/(after|before)\s+(?:step\s+)?(\d+)\.(\d+)/))){
        var ref = stepAt(+m[2], +m[3]); if(!ref) return 'There is no step '+m[2]+'.'+m[3]+'.';
        ci = ref.ci; at = m[1] === 'after' ? ref.si + 1 : ref.si;
      } else if((m = l.match(/(?:chapter|in)\s+(\d+)\b/)) && D.wf[+m[1]-1]){ ci = +m[1]-1; at = D.wf[ci].s.length; }
      var roles = D.roles || [], who = null;
      roles.forEach(function(r){ if(!who && l.indexOf(r[1].toLowerCase()) >= 0) who = r; });
      var ty = /decid|decision|approve|sign.?off|go or no/.test(l) ? 'decision' : (who && who[2] === 'person') || /person|review|by hand/.test(l) ? 'person' : 'agent';
      if(!who || (ty === 'agent') !== (who[2] === 'agent')) who = roles.filter(function(r){ return ty === 'agent' ? r[2] === 'agent' : r[2] === 'person'; })[0];
      var t = (q.match(/\b(?:where|that|to|which|so)\s+(.+)$/i) || [,''])[1].replace(/[.?!]+$/,'').trim();
      if(who) t = t.replace(new RegExp('^'+who[1]+'\\s+', 'i'), '');
      var said = t;
      t = t.replace(/^(\w{3,}[^s])s\b/i, '$1');
      t = t ? t.charAt(0).toUpperCase() + t.slice(1) : 'New step';
      if(t.split(' ').length > 7) t = t.split(' ').slice(0, 7).join(' ');
      var st = {id:'s'+(++uid), t:t, ty:ty, by:who ? who[0] : '', w:(who && said ? who[1]+' '+said : t)+'. Note what was checked and anything that needs a decision.', r:[], o:[], isNew:true};
      D.wf[ci].s.splice(at, 0, st);
      addChange('new:'+st.id, 'New', ({agent:'Agent step',person:'Person step',decision:'Decision'})[ty]+': '+t, D.wf[ci].t);
      setTimeout(function(){ bsStep(st.id); }, 700);
      return 'Added '+find(st.id).k+' '+t+', done by '+(who ? who[1] : 'nobody yet')+'. It is open on the right so you can tune the file. It is in the draft until you publish.';
    }
    return null;
  }
  function answer(q){
    var l = q.toLowerCase();
    if(COORD && S.on){ var sa = structureAsk(q); if(sa) return sa; }
    if(COORD && D.id !== 'customer-demand-mapping') return answerAny(l);
    if(COORD){
      if(/check|review|person|before the end/.test(l)){
        var c = D.wf[3], exists = c.s.some(function(s){ return s.t === 'Advisory reviews summary'; });
        if(!exists){
          var s = {id:'s'+(++uid), t:'Advisory reviews summary', ty:'person', by:'advisory', w:'Read the summary before the PDF is made. Correct anything the client should not see.', r:['summary'], o:['summary'], isNew:true};
          c.s.splice(1, 0, s);
          addChange('new:'+s.id, 'New', 'Person step: Advisory reviews summary', c.t);
        }
        return 'The summary goes straight from the agent to the PDF, so nobody reads it before the client does. I added <b>4.2 Advisory reviews summary</b>, a person step before <b>Generate PDF</b>. It is in the draft; you see it in Workflow and in Source.';
      }
      if(/short|clear|instruction|tighten/.test(l)){
        var n = 0;
        steps().forEach(function(x){
          if(x.s.ty === 'agent' && x.s.w && x.s.w.split('. ').length > 1 && !chgFor('step:'+x.s.id)){
            x.s.w = x.s.w.split('. ')[0].replace(/\.$/,'') + '.'; n++;
            addChange('step:'+x.s.id, 'Changed', 'Step '+x.k+' instructions shorter', D.wf[x.c].t);
          }
        });
        return n ? 'I cut '+n+' agent steps to one sentence each, keeping the first line, which is the instruction. Check that nothing you need is gone before you save.' : 'Every agent step is already one sentence.';
      }
      if(/document|write|no step|part/.test(l)){
        return 'Every chapter of the document has a step that writes it. One gap: the <b>caveats</b> the summary puts first are not written by any step; <b>4.1 Create summary</b> makes them up on the spot. Want me to add a step in Supply that writes them from the Ecosystem Service Cards?';
      }
      if(/yes|add it|do it|please/.test(l)){
        var sp = D.wf[2];
        if(!sp.s.some(function(s){ return s.t === 'Write caveats'; })){
          var s2 = {id:'s'+(++uid), t:'Write caveats', ty:'agent', by:'dm', w:'List what the numbers depend on, one line each, from the Ecosystem Service Cards.', r:['cards'], o:['caveats'], isNew:true};
          sp.s.splice(1, 0, s2);
          addChange('new:'+s2.id, 'New', 'Agent step: Write caveats', sp.t);
        }
        return 'Added <b>3.2 Write caveats</b>, an agent step before the decision on the numbers.';
      }
      return 'I can add, split or move steps, change who does a step, or tighten the instructions.';
    }
    if(/prompt|short/.test(l)){
      if(!chgFor('prompt')){ S.prompt = S.prompt.split('. ').slice(0, 2).join('. ').replace(/\.?$/, '.'); addChange('prompt', 'Changed', 'Prompt shorter', 'prompt.md'); }
      return 'I cut the prompt to its first two sentences: who the agent is and what it fills. See it in Source, Prompt.';
    }
    if(/skill|stack/.test(l)){
      var sk = 'Stacking rules';
      if((conf.Skills||[]).indexOf(sk) < 0){ (conf.Skills = conf.Skills || []).push(sk); addChange('conf:Skills:'+sk, 'New', 'Skill: '+sk, 'Skills'); }
      return 'Added the skill <b>Stacking rules</b>: which other ecosystem services this one can be sold alongside on the same land. It has its own file under Skills in Source.';
    }
    if(/step|use|where/.test(l)){
      return 'One Blueprint uses me: <b>Customer Demand Mapping v2</b>, step 3.1 Research ecosystem services. A change here reaches that Blueprint the next time a Deliverable starts.';
    }
    return 'I can change this agent’s prompt, skills, tools and connections.';
  }
  /* the Blueprint agent on any other Blueprint: the same three moves, found from the workflow itself */
  function answerAny(l){
    var last = D.wf[D.wf.length-1], people = (D.roles||[]).filter(function(r){ return r[2] === 'person'; });
    if(/check|review|person|before the end/.test(l)){
      var at = -1; last.s.forEach(function(s, i){ if(s.ty === 'agent' && at < 0) at = i; });
      var who = people[people.length > 1 ? 1 : 0] || ['', 'A person'];
      if(at >= 0 && !last.s.some(function(s){ return s.t === 'Review before it goes out'; })){
        var s = {id:'s'+(++uid), t:'Review before it goes out', ty:'person', by:who[0], w:'Read what the agent wrote before anyone outside GY sees it. Correct anything that is wrong.', r:[], o:[], isNew:true};
        last.s.splice(at, 0, s);
        addChange('new:'+s.id, 'New', 'Person step: Review before it goes out', last.t);
        return 'In <b>'+h(last.t)+'</b> the agent works straight through to the end. I added a person step, <b>Review before it goes out</b>, for '+h(who[1])+', before <b>'+h(last.s[at+1].t)+'</b>. It is in the draft; see it in Workflow and Source.';
      }
      return 'Every chapter already has a person or a decision before its end.';
    }
    if(/short|clear|instruction|tighten/.test(l)){
      var n = 0;
      steps().forEach(function(x){
        if(x.s.ty === 'agent' && x.s.w && x.s.w.split('. ').length > 1 && !chgFor('step:'+x.s.id)){
          x.s.w = x.s.w.split('. ')[0].replace(/\.$/,'') + '.'; n++;
          addChange('step:'+x.s.id, 'Changed', 'Step '+x.k+' instructions shorter', D.wf[x.c].t);
        }
      });
      return n ? 'I cut '+n+' agent steps to one sentence each. Check that nothing you need is gone before you save.' : 'Every agent step is already one sentence.';
    }
    if(/document|write|no step|part/.test(l)){
      var none = steps().filter(function(x){ return x.s.ty === 'agent' && !(x.s.o||[]).length; }).length;
      return none ? none+' agent steps do not say which part of the document they write. Name the part in each step, in Workflow, so the document fills step by step.' : 'Every agent step writes a named part of the document.';
    }
    return 'I can add, split or move steps, change who does a step, or tighten the instructions.';
  }
  /* Publish (20 Oct): with everything editable, publishing is the deliberate step, so it shows what changes first */
  var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  window.bsPublish = function(anchor){
    if(VPOP){ var was = VPOP._k; vClose(); if(was === 'pub') return; }
    validate();
    var nv = nextVer(S.ver), groups = {}, order = [];
    S.changes.forEach(function(c){ var w = c.where || 'Other'; if(!groups[w]){ groups[w] = []; order.push(w); } groups[w].push(c); });
    var b = '<div class="bspubh">Publish version '+nv+'</div>'
      + '<div class="bspubs">New Deliverables start on version '+nv+'. Running Deliverables stay on the version they started with.</div>'
      + '<div class="lbl">'+S.changes.length+' change'+(S.changes.length>1?'s':'')+'</div>'
      + order.map(function(w){
          return '<div class="bspubg"><div class="w">'+h(w)+'</div>' + groups[w].map(function(c){
            return '<div class="bschg"><span class="bstag'+(c.kind==='New'?' new':'')+'">'+c.kind+'</span><div>'+h(c.text)+'</div></div>';
          }).join('') + '</div>';
        }).join('')
      + (S.fix.length ? '<div class="bspubg">'+S.fix.map(function(f){ return '<div class="bsfixn"><i class="ti ti-alert-circle"></i><span>'+h(f)+'</span></div>'; }).join('')+'</div>' : '')
      + '<div class="lbl">Note</div><textarea class="bspubn" id="bsPubN" placeholder="What changed and why, for the version history"></textarea>'
      + '<div class="bspuba"><button class="bsbtn out" onclick="bsPubClose()">Cancel</button>'
      + '<button class="bsbtn dark" onclick="bsPublishNow()"'+(S.fix.length?' disabled':'')+'><i class="ti ti-upload"></i>Publish</button></div>';
    VPOP = document.createElement('div'); VPOP.className = 'bsvpop bspub'; VPOP._k = 'pub'; VPOP.innerHTML = b;
    document.body.appendChild(VPOP);
    var r = anchor.getBoundingClientRect(), w = VPOP.offsetWidth;
    VPOP.style.left = Math.max(12, Math.min(r.right - w, window.innerWidth - w - 12)) + 'px';
    VPOP.style.top = (r.bottom + 6) + 'px';
    setTimeout(function(){ document.addEventListener('click', vOut, true); var t = document.getElementById('bsPubN'); if(t) t.focus(); }, 0);
  };
  window.bsPubClose = function(){ vClose(); };
  window.bsPublishNow = function(){
    validate();
    if(S.fix.length || !S.changes.length) return;
    var t = document.getElementById('bsPubN'), note = t && t.value.trim();
    var d = new Date();
    S.ver = nextVer(S.ver);
    D.versions.unshift({v:S.ver, date:d.getDate()+' '+MON[d.getMonth()]+' '+d.getFullYear(), by:'You', note:note || S.changes.map(function(c){ return c.text; }).join('; '), runs:[]});
    steps().forEach(function(x){ delete x.s.isNew; });
    S.changes = [];
    SAVED = JSON.stringify({wf:D.wf, conf:conf, prompt:S.prompt, edits:S.edits, access:ACCESS, owner:D.owner, manager:D.manager, readme:S.readme});
    AG.purpose = S.prompt;
    vClose(); paintTabs(); repaint();
    gyToast('Published version '+S.ver+'. Running Deliverables stay on the version they started with.');
  };
  window.bsSave = function(){ var b = document.querySelector('.bspubb'); if(b) bsPublish(b); };
  window.bsDiscard = function(){
    var o = JSON.parse(SAVED);
    D.wf = o.wf; conf = o.conf; S.prompt = o.prompt; S.edits = o.edits || {}; S.changes = [];
    if(o.access){ ACCESS = o.access; D.owner = o.owner; D.manager = o.manager; }
    S.readme = o.readme || {}; S.stepErr = {};
    if(D.wf){ uid = 0; D.wf.forEach(function(c){ c.s.forEach(function(s){ s.id = 's'+(++uid); }); }); }
    vClose(); closeDrawerQuiet(); paintTabs(); repaint();
    gyToast('Draft discarded');
  };

  /* ── Settings: the GY OS components (16 Oct, v2) ────────────────────
     People, Context (Skills, Knowledge, Memory), Engine (the agents, as on
     the Deliverable's Agents card), Tools, Systems, Governance. Reads the
     page's AG.conf through the live studio copy (conf), so drafts show.
     Connections are GY's own stores (Systems); outside registers are reached
     through a lookup Tool, one row each (16 Oct). Guardrails and Evals move here from the Content tab, and
     Governance is grouped by kind: approvals, limits, audit, evals. */
  if(AG.conf){
    var GOV = {guard:[], evals:[]};
    if(window.SECS && AG.secs){
      AG.secs.forEach(function(s){
        if(s[0] === 'c-guard') s[2].forEach(function(b){ if(b[0] === 'bul') GOV.guard = GOV.guard.concat(b[1]); });
        if(s[0] === 'c-evals') s[2].forEach(function(b){ if(b[0] === 'tbl') GOV.evals = GOV.evals.concat(b[2]); });
      });
      for(var gi = SECS.length - 1; gi >= 0; gi--) if(SECS[gi][0] === 'c-guard' || SECS[gi][0] === 'c-evals') SECS.splice(gi, 1);
    }
    var st = document.createElement('style'); st.id = 'bsSet7';
    st.textContent = '.v8setw .v8row.wrap .nm{white-space:normal;overflow:visible;line-height:1.5}'
      + '.v8setw .v8row.kv.ev .nm{width:150px}'
      + '.v8setw .v8row.kv.ev .v{text-align:left;color:var(--ink2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
      + '.v8agr.self{box-shadow:inset 0 0 0 1.5px var(--ink)}'
      + '.v8agb + .v8sub{margin-top:4px}'
      + ''
      + '#drawer.lg{flex:1 1 0;width:auto;min-width:0}'
      + '#drawer.lg .v5drb{padding:0;display:flex;flex-direction:column}'
      + '.bsed{flex:1;display:flex;flex-direction:column;min-height:100%}'
      + '.bsed .bsfh{padding:12px 20px;border-radius:0}'
      + '.bsed .bsfh .fn{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
      + '#drawer:not(.lg) .bsed .bsadm{display:none}'
      + '.bsed .bscode{flex:1;min-height:0;padding:20px 20px 80px;font-size:14px;line-height:1.75;border-radius:0 0 16px 16px}'
      + '.bsfsw{display:inline-flex;gap:4px}'
      + '.bsfsw button{border:none;background:none;border-radius:8px;padding:5px 9px;font:600 13.5px ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--ink3);cursor:pointer}'
      + '.bsfsw button.on{background:var(--graybg);color:var(--ink)}'
      + '.v8setw .v8row.click.sel{background:var(--graybg)}'
      + '.v8agr.self{cursor:pointer}.v8agr.self.sel{box-shadow:inset 0 0 0 2px var(--ink)}'
      + '.bswft{display:flex;align-items:center;gap:14px}.bswft span{flex:1;min-width:0}'
      + '.bssrcb{flex:none;display:inline-flex;align-items:center;gap:7px;border:1px solid var(--line2);background:var(--card);border-radius:9px;padding:7px 12px;font:500 13.5px var(--sans);color:var(--ink);cursor:pointer;letter-spacing:0}'
      + '.bssrcb:hover{background:var(--graybg)}.bssrcb .ti{font-size:16px;color:var(--ink2)}'
      + '@media (max-width:1200px){body.bslg .v5panel{display:none}body.bslg #drawer.lg{padding-left:16px}}'
      + '.bsctx .fn{display:flex;align-items:center;gap:7px;font:13px ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--ink2);margin-bottom:10px}'
      + '.bsctx .fn .ti{font-size:15px;color:var(--ink3)}'
      + '.bsctx .bscode{min-height:0;padding:14px 16px;font-size:13px;line-height:1.7;border:1px solid var(--line);border-radius:10px;background:#FDFCF8;cursor:auto}'
      + '.bsctx .bscode:hover{background:#FDFCF8}'
      + '.bsctx .bsopen{margin-top:14px;display:inline-flex;align-items:center;gap:7px;border:1px solid var(--line2);background:var(--card);border-radius:9px;padding:7px 12px;font:inherit;font-size:13.5px;color:var(--ink);cursor:pointer}'
      + '.bsctx .bsopen:hover{background:var(--graybg)}'
      + '.bsctx .bsopen.sure{border-color:var(--ink);font-weight:600}'
      + '.bsctx .bschip b{font-weight:600}'
      + '.v8agr.sel{box-shadow:inset 0 0 0 2px var(--ink)}'
      + '.bsgov .v8sub{padding-left:0;padding-right:0}.bsgov .v8sub:first-child{border-top:none;padding-top:0}'
      + '.bsgov .v8row{padding:11px 0;align-items:flex-start;font-size:14.5px}'
      + '.bsgov .v8row .nm{white-space:normal;overflow:visible;line-height:1.5}'
      + '.bsgov .v8row .ic{margin-top:-1px}'
      + '.bsgov .v8row.kv .nm{flex:none;width:130px;color:var(--ink2)}'
      + '.bsgov .v8row.kv .v{flex:1;min-width:0;line-height:1.5;color:var(--ink)}'
      + '.bsprow .bsav{margin-left:0;box-shadow:none}'
      + '.bsprow .nm{font-size:14.5px;color:var(--ink)}'
      + '.bsprow .lv{flex:none;font-size:13.5px;color:var(--ink2)}'
      + '.bsprow .bspsel{flex:none}.bsprow .bspsel .gyselbtn{padding:6px 10px;font-size:13.5px}'
      + '.bsprow.add .bspsel .gyselbtn{border-style:dashed}'
      + '.bsav.plus{background:var(--graybg);color:var(--ink2);font-size:15px}'
      + '.bspg{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:2px;padding:10px 10px 12px;border-top:1px solid var(--line)}'
      + '.bspt{display:flex;align-items:center;gap:11px;min-width:0;padding:8px 10px;border-radius:12px}'
      + '.bspt:hover{background:var(--bg)}'
      + '.bspt .bsav{width:34px;height:34px;font-size:12px;margin-left:0;box-shadow:none}'
      + '.bspt .tx{display:flex;flex-direction:column;min-width:0;gap:1px}'
      + '.bspt .nm{font-size:14.5px;font-weight:500;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
      + '.bspt .rl{font-size:12.5px;color:var(--ink2)}'
      + '.bspt .rl.own{color:var(--ink)}'
      + '.bspt.own .bsav{box-shadow:0 0 0 2px var(--card),0 0 0 3.5px var(--ink3)}'
      + '.bsprl .gyselbtn,.bspadd .gyselbtn{border:none;background:none;padding:0;gap:5px;font-size:12.5px;color:var(--ink2);border-radius:0}'
      + '.bsprl .gyselbtn .gyselcar{width:6px;height:6px;opacity:0;margin-top:-3px}'
      + '.bspt:hover .bsprl .gyselcar{opacity:1}'
      + '.bsprl .gysellab{flex:none}.bsprl .gyselbtn{width:auto}'
      + '.bspt:hover .bsprl .gysellab{color:var(--ink)}'
      + '.bspadd .gyselbtn{font-size:14.5px}.bspadd .gyselbtn .gyselcar{display:none}'
      + '.bspt.add .bsav.plus{background:none;border:1.5px dashed var(--line2);color:var(--ink3);box-sizing:border-box}'
      + '.bspt.add{cursor:pointer}.bspt.add:hover .bsav.plus{border-color:var(--ink3);color:var(--ink2)}';
    document.head.appendChild(st);

    var SYS = /notion|google drive|hubspot|^gy /i;
    var C7 = {people:['People','ti-users'], context:['Context','ti-books'], engine:['Engine','ti-cpu'],
              tools:['Tools','ti-tool'], systems:['Systems','ti-database'], governance:['Governance','ti-shield-check']};
    var ORDER = ['people','context','engine','tools','systems','governance'];
    var LEAD = {f:'agent-demand-mapping.html', n:'Demand Mapping agent', ic:'ti-map-search'};
    var ESAG = [
      {f:'agent-peatland-carbon.html', n:'Peatland carbon agent', ic:'ti-plant-2', c:'#7A6248', bg:'#EFE9E1'},
      {f:'agent-woodland-carbon.html', n:'Woodland carbon agent', ic:'ti-trees', c:'#C67F16', bg:'#FAEEDA'},
      {f:'agent-bng.html', n:'BNG agent', ic:'ti-butterfly', c:'#1E8A63', bg:'#E3F2EB'},
      {f:'agent-nutrient.html', n:'Nutrient agent', ic:'ti-droplet', c:'#1F6FB2', bg:'#E4EFF8'},
      {f:'agent-flood.html', n:'Flood agent', ic:'ti-ripple', c:'#0F6E56', bg:'#E1F5EE'}
    ];
    var prop = function(k){ var p = (AG.props||[]).filter(function(x){ return x[0] === k; })[0]; return p ? p[1] : ''; };
    var kv = function(k,v,cls,tip){ return '<div class="v8row kv'+(cls?' '+cls:'')+'"'+(tip?' title="'+h(tip)+'"':'')+'><span class="nm">'+k+'</span><span class="v">'+v+'</span></div>'; };
    var row = function(ic,x,cls){ return '<div class="v8row'+(cls?' '+cls:'')+'"><span class="ic"><i class="ti '+ic+'"></i></span><span class="nm">'+x+'</span></div>'; };
    var sub = function(t){ return '<div class="v8sub">'+t+'</div>'; };
    var card = function(k, n, body){
      return '<div class="v8card" id="set-'+k+'"><div class="v8sh"><span class="t" style="color:var(--ink2)"><i class="ti '+C7[k][1]+'"></i></span><b>'+C7[k][0]+'</b><span>'+n+'</span></div>'+body+'</div>';
    };
    var ini = function(n){ return n.split(' ').map(function(w){ return w[0]; }).join('').slice(0,2).toUpperCase(); };
    /* Engine (20 Oct): the Coordinator agent, then the Expert agents with the steps that call them and the
       version this Blueprint uses. Rows open in the drawer; leaving for the agent's own page is a link there. */
    var esSteps = function(){
      if(COORD) return steps().filter(function(x){ return x.s.by === 'es'; }).map(function(x){ return x; });
      return [];
    };
    var agVer = function(a){ var d = STUDIO[a.f]; return d && d.versions && d.versions[0] ? 'v'+d.versions[0].v : ''; };
    window.bsAgentOpen = function(f){
      var a = f === LEAD.f ? LEAD : ESAG.filter(function(x){ return x.f === f; })[0]; if(!a) return;
      var lead = a === LEAD, ver = agVer(a), d = STUDIO[a.f] || {};
      var st = lead ? [] : esSteps();
      var stepsHtml = lead ? '<div class="bsro">Runs every step of this Blueprint and hands work to the Expert agents.</div>'
        : (st.length ? '<div class="bschips">'+st.map(function(x){ return '<button class="bschip bsfold" onclick="openTab(\'workflow\');bsStep(\''+x.s.id+'\')"><b>'+x.k+'</b>&nbsp;'+h(x.s.t)+'</button>'; }).join('')+'</div>'
                     : '<div class="bsro">'+EXPERT_USE.map(function(u){ return h(u.bp)+', step '+h(u.step); }).join('<br>')+'</div>');
      var y2 = function(k, v){ return '<span class="yk">'+k+':</span> '+h(v); };
      var yaml = ['---', y2('name', a.n), y2('kind', lead ? 'coordinator' : 'expert'), y2('manager', d.manager || 'none yet'),
                  y2('model', d.model || 'Claude Sonnet 5.5'), y2('version', ver || 'v1'), '---'].join('\n');
      var n = S.changes.length;
      var body = '<div class="v8dr bsctx">'
        + '<div class="bsk">'+(lead ? 'Role' : 'Called at')+'</div>' + stepsHtml
        + (ver ? '<div class="bsk">Version this Blueprint uses</div><div class="bsro">'+ver+'. A newer version of this agent reaches this Blueprint only when the Blueprint moves to it.</div>' : '')
        + '<div class="bsk">Definition</div><div class="fn"><i class="ti ti-file-code"></i>agent.yaml</div><pre class="bscode">'+yaml+'</pre>'
        + '<button class="bsopen" onclick="bsLeave(this, \''+a.f+'\')"><i class="ti ti-external-link"></i>Open agent page</button>'
        + '</div>';
      openDrawer(a.n, body); S.file = 'ag:'+f; markOpen();
    };
    window.bsLeave = function(b, f){
      var n = S.changes.length;
      if(!n || b.classList.contains('sure')){ location.href = f; return; }
      b.classList.add('sure'); b.innerHTML = '<i class="ti ti-alert-circle"></i>Leave and lose '+(n === 1 ? 'the unpublished change' : n+' unpublished changes')+'?';
    };
    var agRow = function(a, lead){
      var me = a.f === PAGE;
      var tile = lead ? '<span class="v8agi" style="background:var(--dark);color:var(--yellow)"><i class="ti '+a.ic+'"></i></span>'
                      : '<span class="v8agi" style="background:'+a.c+';color:#fff"><i class="ti '+a.ic+'"></i></span>';
      var meta = lead ? '' : (esSteps().map(function(x){ return x.k; }).join(', ') + (agVer(a) ? (esSteps().length ? ' &middot; ' : '') + agVer(a) : ''));
      return '<div class="v8agr'+(me?' self':'')+'" data-f="'+(me?'agent':'ag:'+a.f)+'" style="--t:'+(lead?'#E2E2E6':a.bg)+'" onclick="'+(me?'bsOpenFile(\'agent\')':'bsAgentOpen(\''+a.f+'\')')+'">'+tile
        + '<span class="nm">'+a.n+'</span>' + (me ? '<span class="m">This agent</span>' : (meta ? '<span class="m">'+meta+'</span>' : '')) + '<i class="ti ti-chevron-right ch"></i></div>';
    };

    var CTXK = [];
    var crow = function(k, ic, x){
      var i = CTXK.indexOf(k); if(i < 0){ CTXK.push(k); i = CTXK.length - 1; }
      return '<div class="v8row click" data-f="'+h(k)+'" onclick="bsCtx('+i+')"><span class="ic"><i class="ti '+ic+'"></i></span><span class="nm">'+x+'</span><i class="ti ti-chevron-right ch"></i></div>';
    };
    window.bsCtx = function(i){ bsOpenFile(CTXK[i]); };
    var GOVD = null;
    window.bsGovData = function(){ if(!GOVD) VIEWS.settings(); return GOVD; };
    window.bsGov = function(k){
      if(!GOVD) return;
      var li = function(ic, x){ return '<div class="v8row wrap"><span class="ic"><i class="ti '+ic+'"></i></span><span class="nm">'+x+'</span></div>'; };
      var body = '', t = '';
      if(k === 'dos'){ t = 'Do\'s and don\'ts';
        body = sub('Do') + GOVD.appr.map(function(x){ return li('ti-check', x); }).join('')
             + sub('Don\'t') + GOVD.never.map(function(x){ return li('ti-ban', x); }).join(''); }
      if(k === 'audit'){ t = 'Audit'; body = GOVD.audit.map(function(x){ return li('ti-list-check', x); }).join(''); }
      if(k === 'evals'){ t = 'Evals'; body = GOVD.evals.map(function(e){ return '<div class="v8row kv wrap"><span class="nm">'+e[0]+'</span><span class="v">'+e[1]+'</span></div>'; }).join(''); }
      openDrawer(t, '<div class="v8dr bsgov">'+body+'</div>');
    };
    /* People edits in Blueprint Studio: level, make owner, remove, add; each is a draft change (20 Oct) */
    window.bsPerson = function(who, v){
      var log = function(key, text){ var c = chgFor(key); if(c) c.text = text; else addChange(key, 'Changed', text, 'People'); };
      if(v === 'add'){
        var q = P[who]; if(!q) return;
        ACCESS = ACCESS.concat([{name:q[0], ini:q[1], c:q[2], lvl:'Viewer'}]);
        log('people:'+q[0], 'People: '+q[0]+' added as Viewer');
      } else if(v === 'remove'){
        ACCESS = ACCESS.filter(function(a){ return a.name !== who; });
        log('people:'+who, 'People: '+who+' removed');
      } else if(v === 'owner'){
        var was = D.owner || D.manager;
        if(D.manager && !D.owner) D.manager = who; else D.owner = who;
        ACCESS = ACCESS.map(function(a){ return a.name === who ? {name:a.name, ini:a.ini, c:a.c, lvl:'Admin'} : a; });
        if(was && !ACCESS.some(function(a){ return a.name === was; })){ var q2 = null; Object.keys(P).forEach(function(k){ if(P[k][0] === was) q2 = P[k]; });
          if(q2) ACCESS = ACCESS.concat([{name:was, ini:q2[1], c:q2[2], lvl:'Admin'}]); }
        log('people:owner', 'People: '+who+' is now '+(COORD?'owner':'manager'));
      } else {
        ACCESS = ACCESS.map(function(a){ return a.name === who ? {name:a.name, ini:a.ini, c:a.c, lvl:v} : a; });
        log('people:'+who, 'People: '+who+' now '+v);
      }
      repaint();
    };
    VIEWS.settings = function(){
      var conn = conf.Connections || [], sys = conn.filter(function(x){ return SYS.test(x); }), regs = conn.filter(function(x){ return !SYS.test(x); });
      var tools = conf.Tools || [], skills = conf.Skills || [], know = conf.Context || [], mem = conf.Memory || [];
      var mgr = D.owner || D.manager || '';
      var lv = {}; ACCESS.forEach(function(a){ lv[a.lvl] = (lv[a.lvl]||0) + 1; });
      var access = LEVELS.filter(function(l){ return lv[l[0]]; }).map(function(l){ return lv[l[0]]+' '+l[0]; }).join(', ');

      /* People */
      var roles = (D.roles||[]).filter(function(r){ return r[2] === 'person'; });
      /* People (20 Oct): just faces and names; the owner first, then everyone with access and their level */
      var byName = {}; Object.keys(P).forEach(function(k){ byName[P[k][0]] = P[k]; });
      var edit = S.on && LATER && window.gySel, PS = window.bsPpl = [];
      /* People as a compact grid of tiles (20 Oct): face, name, and the level underneath; in edit the level is the menu */
      var pTile = function(name, lvl, isOwner){
        var q = byName[name], a = ACCESS.filter(function(x){ return x.name === name; })[0];
        var av = '<span class="bsav" style="background:'+(a ? a.c : q ? q[2] : '#766B62')+'">'+(a ? a.ini : q ? q[1] : ini(name))+'</span>';
        var rl = '<span class="rl'+(isOwner?' own':'')+'">'+(isOwner ? lvl : lvLabel(lvl))+'</span>';
        if(edit && !isOwner){
          PS.push(name);
          rl = gySel('bsp'+PS.length, {value:lvl, cls:'bsprl',
            options:[['Admin','Admin'],['Editor','Editor'],['Viewer','Viewer'],['owner','Make '+(COORD?'owner':'manager')],['remove','Remove']],
            onchange:(function(n){ return function(v){ bsPerson(n, v); }; })(name)});
        }
        return '<div class="bspt'+(isOwner?' own':'')+'">'+av+'<span class="tx"><span class="nm">'+h(name)+'</span>'+rl+'</span></div>';
      };
      var pList = (mgr ? [pTile(mgr, COORD ? 'Owner' : 'Manager', true)] : [])
        .concat(ACCESS.filter(function(a){ return a.name !== mgr; }).map(function(a){ return pTile(a.name, a.lvl); }));
      var inList = function(n){ return n === mgr || ACCESS.some(function(a){ return a.name === n; }); };
      var addable = Object.keys(P).filter(function(k){ return !inList(P[k][0]); }).map(function(k){ return [k, P[k][0]]; });
      var addRow = (edit && addable.length) ? '<div class="bspt add"><span class="bsav plus"><i class="ti ti-plus"></i></span>'
        + gySel('bspadd', {value:'', placeholder:'Add person', cls:'bspadd', options:addable, onchange:function(k){ if(k) bsPerson(k, 'add'); }}) + '</div>' : '';
      var ppl = (mgr ? '' : kv(COORD ? 'Owner' : 'Manager', '<span style="color:var(--amberd)">No manager yet</span>'))
        + '<div class="bspg">' + pList.join('') + addRow + '</div>';

      /* Engine: the agents, then what they run on */
      var v0 = D.versions[0];
      var eng = '<div class="v8agb"><div class="v8agk">Coordinator agent</div>' + agRow(LEAD, true)
        + '<div class="v8agk">Expert agents</div>' + ESAG.map(function(a){ return agRow(a, false); }).join('') + '</div>'
        ;

      /* Governance, grouped so it scans: who approves, what it never does, what is recorded, how it is tested */
      var all = (conf.Governance||[]).concat(GOV.guard), seen = {};
      var G = {appr:[], never:[], audit:[]};
      all.forEach(function(x){
        var t = x.replace(/<[^>]+>/g,''), key = t.toLowerCase();
        if(/sign|approv|review/i.test(t)){ if(/sign-off|signs off/i.test(t) && G.appr.some(function(y){ return /sign/i.test(y); })) return; G.appr.push(x); }
        else if(/log|source/i.test(t)) G.audit.push(x);
        else if(!seen[key]) G.never.push(x);
        seen[key] = 1;
      });
      /* three bundles, one row each, like the Systems rows; the detail opens in the drawer previewer */
      GOVD = G; GOVD.evals = GOV.evals;
      var grow = function(k, ic, t, n){
        var fk = 'gov:'+k, i = CTXK.indexOf(fk); if(i < 0){ CTXK.push(fk); i = CTXK.length - 1; }
        return '<div class="v8row click" data-f="'+fk+'" onclick="bsCtx('+i+')"><span class="ic"><i class="ti '+ic+'"></i></span><span class="nm">'+t+'</span>'
          + '<span class="m">'+n+'</span><i class="ti ti-chevron-right ch"></i></div>';
      };
      var gov = grow('dos','ti-checklist','Do\'s and don\'ts', G.appr.length + G.never.length)
        + grow('audit','ti-list-check','Audit', G.audit.length)
        + grow('evals','ti-flask','Evals', GOV.evals.length);
      var nG = 3;

      var html = '<div class="v8ttl">Settings</div><div class="v8setw"><div class="v8setc"><div class="v8set">'
        + card('people', pList.length, ppl)
        + card('context', skills.length+know.length+mem.length, sub('Skills') + skills.map(function(x){ return crow('skill:'+x, 'ti-sparkles', x); }).join('')
            + sub('Knowledge') + know.map(function(x){ return crow('know:'+x, 'ti-book', x); }).join('')
            + sub('Memory') + mem.map(function(x){ return crow('mem:'+x, 'ti-history', x); }).join(''))
        + card('engine', 1 + ESAG.length, eng)
        + card('tools', tools.length+regs.length, tools.map(function(x){ return crow('tool:'+x, /lookup/i.test(x) ? 'ti-world-search' : 'ti-tool', x); }).join('')
            + regs.map(function(x){ return row('ti-world-search', x); }).join(''))
        + (function(){
            var fs = folderSpec(), list = sys.slice();
            if(fs && !list.some(function(x){ return /google drive/i.test(x); })) list.unshift('Google Drive');
            return card('systems', list.length, list.map(function(x){
              if(fs && /google drive/i.test(x))
                return '<div class="v8row click" data-f="sys:folder" onclick="bsFolder()"><span class="ic"><i class="ti ti-folder"></i></span>'
                  + '<span class="nm">Google Drive: Deliverable folder</span><span class="m">'+fs.length+' folders</span><i class="ti ti-chevron-right ch"></i></div>';
              return row('ti-database', x);
            }).join(''));
          })()
        + card('governance', nG, gov)
        + '</div></div>';
      return html + anchorNav(ORDER.map(function(k){ return ['set-'+k, C7[k][0], C7[k][1]]; })) + '</div>';
    };
  }

  S.file = null; /* no file is open until a row opens one in the large drawer */
  /* ── start ────────────────────────────────────────────────────────── */
  paintTabs();
  /* Content tab (20 Oct): titled with the Blueprint's name, like its Deliverables, with a Table of Contents label */
  if(VIEWS.content && !VIEWS.content._bs){
    var _vc = VIEWS.content;
    VIEWS.content = function(){
      var x = _vc.apply(this, arguments);
      if(COORD) x = x.replace('<div class="v5dt">'+AG.title+'</div>', '<div class="v5dt">'+h(D.blueprint)+'</div>');
      return x.replace('<nav class="v8anc" id="setnav"><div>', '<nav class="v8anc" id="setnav"><div><div class="csnavt">Table of Contents</div>');
    };
    VIEWS.content._bs = 1;
  }
  if(window.gyReaderOn) gyReaderOn(); /* reader layout on every tab (20 Oct), gy-nav.js */
  var qs = location.search;
  setEdit(); chatToBlueprint(); repaint();
  var m = qs.match(/[?&]tab=(\w+)/); if(m && m[1] === 'source') m[1] = 'settings'; if(m && VIEWS[m[1]]) openTab(m[1]);
  var mf = qs.match(/[?&]file=([^&]+)/);
  if(mf){ var fp = decodeURIComponent(mf[1]); files().forEach(function(f){ if(f[2] === fp){ if(window.TAB !== 'settings' && window.TAB !== 'workflow') openTab('settings'); bsOpenFile(f[0]); } }); }
})();
