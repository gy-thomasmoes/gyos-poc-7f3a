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
  var EXPERT_USE = [{bp:'Customer Demand Mapping', v:2, step:'3.1 Research ecosystem services', href:'agent-demand-mapping.html'}];
  function expert(model, manager, versions){
    return {kind:'expert', model:model, manager:manager, usedIn:EXPERT_USE, versions:versions};
  }
  var STUDIO = {
    'agent-demand-mapping.html': {
      kind:'coordinator', id:'customer-demand-mapping', blueprint:'Customer Demand Mapping',
      owner:'Emily Churchill', model:'Claude Sonnet 5.5',
      roles:[['champion','Champion','person'],['trade','Trade','person'],['analysis','Analysis','person'],['advisory','Advisory lead','person'],
             ['dm','Demand Mapping agent','agent'],['es','Ecosystem Service agents','agent']],
      rules:['Write in short, plain sentences. No jargon a land manager would not use.',
             'Never make up a buyer, a figure or a source. If you do not know, say so.',
             'Draft, never send. A person signs off anything that leaves GY.'],
      wf:[
        {t:'Project context', s:[
          {t:'Kick-off meeting', ty:'person', by:'champion', w:'Hold the kick-off with the estates and upload the notes.', r:['inputs'], o:['context']},
          {t:'Discovery information request', ty:'agent', by:'dm', w:'Read the kick-off notes and list what is missing. Draft one email to the client asking for it.', r:['inputs','context'], o:['context']},
          {t:'Context complete?', ty:'decision', by:'champion', w:'Recommend in two sentences whether the context is complete enough to start on demand.', r:['context']}]},
        {t:'Demand', s:[
          {t:'GPAP analysis', ty:'agent', by:'dm', w:'Find planned developments near the site in the GPAP planning register and note who would need offsets.', r:['context'], o:['demand']},
          {t:'Abstraction licences', ty:'agent', by:'dm', w:'Find who takes water from the catchment and how much, from the SEPA abstraction licences.', r:['context'], o:['demand']},
          {t:'Public funding scan', ty:'agent', by:'dm', w:'List public funding that fits the planned interventions, with deadlines.', r:['context'], o:['demand']},
          {t:'Beneficiary map and buyer list', ty:'agent', by:'dm', w:'Match beneficiaries with the GY buyer database. One row per buyer: why relevant, hook, relationship.', r:['demand'], o:['buyers']},
          {t:'Check with Trade', ty:'person', by:'trade', w:'Confirm the relationship and hook of each buyer. Update the table with what Trade says.', r:['buyers'], o:['buyers']},
          {t:'Demand complete?', ty:'decision', by:'champion', w:'Recommend whether demand is strong enough to move on to supply.', r:['demand','buyers']}]},
        {t:'Supply', s:[
          {t:'Research ecosystem services', ty:'agent', by:'es', w:'Ask each Ecosystem Service agent what the land can sell. Each fills one Ecosystem Service Card.', r:['context'], o:['cards']},
          {t:'Numbers reliable enough?', ty:'decision', by:'analysis', w:'Flag every number below medium confidence before the decision.', r:['cards']}]},
        {t:'Summary', s:[
          {t:'Create summary', ty:'agent', by:'dm', w:'Rank the markets by strength of demand. Caveats first, one paragraph per market, end with the next step.', r:['demand','buyers','cards'], o:['summary']},
          {t:'Generate PDF', ty:'agent', by:'dm', w:'Render the four chapters into the GY report template.', r:['summary'], o:['pdf']},
          {t:'Share with customer', ty:'person', by:'advisory', w:'Send the PDF to the client and log the date.', r:['pdf']},
          {t:'Send to data platform', ty:'agent', by:'dm', w:'Save buyers and cards to the GY Data platform.', r:['buyers','cards']},
          {t:'Gather learnings', ty:'agent', by:'dm', w:'List corrections people made in this run and propose them to the Blueprint agent.', r:['summary']}]}
      ],
      versions:[
        {v:2, date:'1 Oct 2026', by:'Emily Churchill', note:'One Ecosystem Service agent per service; Trade checks buyers before the decision', runs:[['Upper Dee','deliverable-sketch-v8.html'],['The Wash','']]},
        {v:1, date:'18 Sep 2026', by:'Thomas Moes', note:'First version, from the Notion Blueprint', runs:[['Boothby','']]}
      ]
    },
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
  var conf = {}; (AG.conf || []).forEach(function(c){ conf[c[0]] = c[4].slice(); });
  var SAVED = JSON.stringify({wf:D.wf, conf:conf, prompt:AG.purpose});

  /* ── state ────────────────────────────────────────────────────────── */
  var S = {
    on:false, ver:D.versions[0].v, changes:[], fix:[], sel:null,
    file: COORD ? 'blueprint' : 'agent', grp:null,
    prompt: AG.purpose, edits:{}, agentLog:null, bpLog:null
  };
  var uid = 0;
  if(D.wf) D.wf.forEach(function(c){ c.s.forEach(function(s){ s.id = 's'+(++uid); }); });

  /* ── styles ───────────────────────────────────────────────────────── */
  var css = ''
    /* right side of the tab bar: version dropdown, Edit Blueprint, and in the studio the draft controls */
    /* beside the page title: version chip and a quiet Edit; on the right of the topbar the studio controls */
    + '.bstitle{display:inline-flex;align-items:center;gap:0;margin-left:14px;flex:none}'
    + '.bsverc,.bsedit{display:inline-flex;align-items:center;gap:6px;height:31px;box-sizing:border-box;border:1px solid var(--line2);background:var(--card);border-radius:10px;padding:0 12px;'
    +   'font:inherit;font-size:14px;font-weight:500;color:var(--ink);cursor:pointer;white-space:nowrap}'
    + '.bsverc:hover,.bsedit:hover{border-color:var(--ink3)}'
    + '.bsverc{border-radius:10px 0 0 10px}.bsedit{border-radius:0 10px 10px 0;margin-left:-1px}'
    + 'body.bson .bsverc{border-radius:10px}'
    + '.bsverc:hover,.bsedit:hover{position:relative;z-index:1;background:var(--graybg)}'
    + '.bsverc{padding:0 9px 0 12px;font-variant-numeric:tabular-nums}'
    + '.bsverc .ti{font-size:14px;color:var(--ink3)}'
    + '.bsedit .ti{font-size:16px;color:var(--ink2)}'
    + '.bsctl{display:none;align-items:center;gap:8px;margin-right:10px}'
    + 'body.bson .bsctl{display:inline-flex}'
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
    + '.bsstudio{display:none;align-items:center;gap:8px;font-size:16px}'
    + 'body.bson .bsstudio{display:inline-flex}'
    + 'body.bson .bsoff{display:none!important}'
    + 'body:not(.bson) .bsonly{display:none!important}'
    + '.bsstudio .sep{color:var(--ink3)}'
    + '.bsstudio b{font-weight:600}'
    /* Blueprint Studio: only the topbar turns GY yellow; everything on it is ink */
    + 'body.bson .topbar{background:var(--yellow);border-bottom-color:#E3C64A}'
    + 'body.bson .topbar .cr,body.bson .topbar .crumbs,body.bson .topbar .bsstudio .sep{color:var(--ink)}'
    + 'body.bson .bsverc{border-color:rgba(26,12,18,.35);color:var(--ink)}'
    + 'body.bson .bsverc:hover{background:rgba(255,255,255,.45)}'
    + 'body.bson .bsav{box-shadow:0 0 0 2px var(--yellow)}'
    + 'body.bson .bsav.more{background:rgba(255,255,255,.6);color:var(--ink)}'
    + 'body.bson .bspile:hover{background:rgba(26,12,18,.08)}'
    + 'body.bson .topbar .v5keb,body.bson .topbar .scollapse{color:var(--ink)}'
    + '@media(max-width:760px){.bsstudio,.bsedit,.bspill{display:none!important}}'
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
  if(crumbs) crumbs.insertAdjacentHTML('afterend', '<span class="bstitle" id="bsTitle"></span>');
  function avh(p, cls){ return '<span class="bsav'+(cls?' '+cls:'')+'" style="background:'+p.c+'" data-tip="'+h(p.name)+', '+p.lvl+'">'+p.ini+'</span>'; }
  var shareBtn = top && top.querySelector('.btn-out');
  if(shareBtn){
    var shown = ACCESS.slice(0, 4), rest = ACCESS.length - shown.length;
    shareBtn.classList.add('bsoff');
    shareBtn.insertAdjacentHTML('beforebegin', '<span class="bsctl" id="bsCtl"></span><button class="bspile" id="bsPile" onclick="bsAccess(this)" title="Who has access">'
      + shown.map(function(p){ return avh(p); }).join('') + (rest > 0 ? '<span class="bsav more">+'+rest+'</span>' : '') + '</button>');
  }

  function titleHtml(){
    return '<button class="bsverc" id="bsVerB" onclick="bsVersions(this)" title="Version history">v'+S.ver+'<i class="ti ti-chevron-down"></i></button>'
      + '<button class="bsedit bsoff" onclick="bsEdit(true)" title="Edit the Blueprint"><i class="ti ti-pencil"></i>Edit</button>';
  }
  function ctlHtml(){
    validate();
    var n = S.changes.length, pill = '';
    if(S.fix.length) pill = '<button class="bspill fix" onclick="bsVersions(this)"><i class="d"></i>'+S.fix.length+' to fix</button>';
    else if(n) pill = '<button class="bspill" onclick="bsVersions(this)"><i class="d"></i>'+n+' change'+(n>1?'s':'')+' not saved</button>';
    return pill
      + '<button class="bsbtn out" onclick="bsEdit(false)">Done</button>'
      + '<button class="bsbtn dark" onclick="bsSave()"'+(n?'':' disabled')+'><i class="ti ti-device-floppy"></i>Save version '+nextVer(S.ver)+'</button>';
  }
  function paintTop(){
    var t = document.getElementById('bsTitle'); if(t) t.innerHTML = titleHtml();
    var c = document.getElementById('bsCtl'); if(c) c.innerHTML = ctlHtml();
  }

  /* ── tabs: Content, Workflow, Source, Settings ────────────────────── */
  var si = -1; TABS.forEach(function(t, i){ if(t[0] === 'settings') si = i; });
  var add = [];
  if(COORD) add.push(['workflow','ti-hierarchy-2','Workflow']);
  add.push(['source','ti-file-code','Source']);
  if(si >= 0) TABS.splice.apply(TABS, [si, 0].concat(add));

  var _paintTabs = window.paintTabs;
  window.paintTabs = function(){
    _paintTabs();
    var tabs = document.getElementById('tabs');
    var w = tabs.querySelector('.v5tab[onclick*="workflow"] .lb');
    if(w && COORD) w.insertAdjacentHTML('afterend', ' <span class="bscount" style="font-size:12px;color:var(--ink3)">'+steps().length+'</span>');
    paintTop();
  };
  var _openTab = window.openTab;
  window.openTab = function(k){
    document.body.classList.toggle('bssrc', k === 'source');
    _openTab(k);
  };
  function repaint(){ var b = document.querySelector('.v5body'), y = b ? b.scrollTop : 0; openTab(window.TAB); if(b) b.scrollTop = y; paintTop(); }

  /* ── Workflow tab ─────────────────────────────────────────────────── */
  VIEWS.workflow = function(){
    var hh = '<div class="v8ttl">'+h(D.blueprint)+'</div><div class="bswf">';
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
        + '<div class="bsadd bsonly"><span>Add</span>'
        +   '<button class="bsaddb" onclick="bsAdd('+ci+',\'agent\')"><i class="ti ti-sparkles"></i>Agent step</button>'
        +   '<button class="bsaddb" onclick="bsAdd('+ci+',\'person\')"><i class="ti ti-user"></i>Person step</button>'
        +   '<button class="bsaddb" onclick="bsAdd('+ci+',\'decision\')"><i class="ti ti-arrows-split-2"></i>Decision</button></div>'
        + '</div></section>';
    }).join('');
    return hh + '</div>';
  };

  function openDrawer(title, body){
    document.getElementById('drtitle').textContent = title;
    document.getElementById('drbody').innerHTML = body;
    document.getElementById('dricon').classList.add('hide');
    document.getElementById('drawer').classList.remove('hide');
  }
  var _close = window.closeDrawer;
  window.closeDrawer = function(){ S.sel = null; _close(); if(window.TAB === 'workflow') repaint(); };

  window.bsStep = function(id){
    var x = find(id); if(!x) return;
    var s = x.s; S.sel = id;
    if(window.TAB === 'workflow') repaint();
    var who = (D.roles||[]).filter(function(r){ return s.ty === 'agent' ? r[2] === 'agent' : r[2] === 'person'; });
    var b;
    if(S.on){
      b = '<div class="bsk">Title</div><input class="bsin" value="'+h(s.t)+'" oninput="bsSet(\''+id+'\',\'t\',this.value)">'
        + '<div class="bsk">Type</div><div class="bsseg">'
        + ['agent','person','decision'].map(function(t){ return '<button class="bsopt'+(s.ty===t?' on':'')+'" onclick="bsSet(\''+id+'\',\'ty\',\''+t+'\',1)"><i class="ti '+IC[t]+'"></i>'+({agent:'Agent step',person:'Person step',decision:'Decision'})[t]+'</button>'; }).join('')
        + '</div><div class="bsk">'+(s.ty==='decision'?'Decided by':'Done by')+'</div><div class="bsseg">'
        + who.map(function(r){ return '<button class="bsopt'+(s.by===r[0]?' on':'')+'" onclick="bsSet(\''+id+'\',\'by\',\''+r[0]+'\',1)">'+h(r[1])+'</button>'; }).join('')
        + '</div><div class="bsk">Instructions</div><textarea class="bsta" oninput="bsSet(\''+id+'\',\'w\',this.value)">'+h(s.w)+'</textarea>';
    } else {
      b = '<div class="bsk">'+(s.ty==='decision'?'Decided by':'Done by')+'</div><div class="bsro">'+h(roleName(s.by))+'</div>'
        + '<div class="bsk">Instructions</div><div class="bsro">'+(h(s.w)||'<span style="color:var(--ink3)">None yet</span>')+'</div>';
    }
    if((s.r||[]).length) b += '<div class="bsk">Reads</div><div class="bschips">'+s.r.map(function(r){ return '<span class="bschip">'+h(r)+'</span>'; }).join('')+'</div>';
    if((s.o||[]).length) b += '<div class="bsk">Writes</div><div class="bschips">'+s.o.map(function(r){ return '<span class="bschip">'+h(r)+'</span>'; }).join('')+'</div>';
    openDrawer(x.k+' '+(s.t||'Untitled step'), b);
  };
  window.bsSet = function(id, f, v, rerender){
    var x = find(id); if(!x) return;
    x.s[f] = v;
    if(f === 'ty'){ var ok = (D.roles||[]).filter(function(r){ return v === 'agent' ? r[2]==='agent' : r[2]==='person'; }); if(ok.length && !ok.some(function(r){ return r[0]===x.s.by; })) x.s.by = ok[0][0]; }
    if(!x.s.isNew) addChange('step:'+id, 'Changed', 'Step '+x.k+' '+(x.s.t||''), D.wf[x.c].t);
    if(rerender) bsStep(id);
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
  function files(){
    var f = [];
    if(COORD){
      f.push(['blueprint','Structure','blueprint.yaml','Blueprint','ti-hierarchy-2']);
      f.push(['instructions','Instructions','instructions.md','Blueprint','ti-list-details']);
    }
    f.push(['agent','Agent','agent.yaml','Agent','ti-adjustments-horizontal']);
    f.push(['prompt','Prompt','prompt.md','Agent','ti-message']);
    (conf.Skills||[]).forEach(function(sk){ f.push(['skill:'+sk, sk, 'skills/'+slug(sk)+'.md','Skills','ti-sparkles']); });
    return f;
  }
  function changedFile(k){
    if(S.edits[k] != null && chgFor('file:'+k)) return true;
    if(!S.changes.length) return false;
    if(k === 'blueprint' || k === 'instructions') return S.changes.some(function(c){ return /^(step|new):/.test(c.key); });
    if(k === 'prompt') return !!chgFor('prompt');
    if(k === 'agent') return S.changes.some(function(c){ return /^conf:/.test(c.key); });
    if(k.indexOf('skill:') === 0) return !!chgFor('conf:Skills:'+k.slice(6));
    return false;
  }
  function body(k){
    if(S.edits[k] != null) return h(S.edits[k]);
    var L = [];
    if(k === 'blueprint'){
      L.push('---', y('id', D.id), y('version', S.changes.length ? nextVer(S.ver) : S.ver) + (S.changes.length ? '  <span class="cm"># draft</span>' : ''), y('title', D.blueprint), y('owner', D.owner), y('coordinator', AG.title));
      L.push(y('roles'));
      D.roles.forEach(function(r){ L.push('  - '+y('id', r[0]).trim(), y('title', r[1], '    '), y('kind', r[2], '    ')); });
      L.push(y('chapters'));
      D.wf.forEach(function(c, ci){
        L.push('  - '+y('title', c.t).trim(), y('steps', undefined, '    '));
        c.s.forEach(function(s, i){
          var line = ['      - '+y('id', '"'+(ci+1)+'.'+(i+1)+'"').trim(), y('title', s.t, '        '), y('kind', s.ty, '        '), y('role', s.by, '        ')];
          if((s.r||[]).length) line.push(y('reads', '['+s.r.join(', ')+']', '        '));
          if((s.o||[]).length) line.push(y('writes', '['+s.o.join(', ')+']', '        '));
          var mark = s.isNew || chgFor('step:'+s.id);
          L.push(mark ? '<span class="chg">'+line.join('\n')+'</span>' : line.join('\n'));
        });
      });
      L.push('---');
    } else if(k === 'instructions'){
      L.push('<span class="mh"># How to work</span>', '');
      D.rules.forEach(function(r){ L.push('- '+h(r)); });
      steps().forEach(function(x){
        var t = '<span class="mh">## '+x.k+' '+h(x.s.t)+'</span>\n\n'+(h(x.s.w) || '<span class="cm">(no instructions yet)</span>');
        L.push('', (x.s.isNew || chgFor('step:'+x.s.id)) ? '<span class="chg">'+t+'</span>' : t);
      });
    } else if(k === 'agent'){
      L.push('---', y('name', AG.title), y('kind', COORD ? 'coordinator' : 'expert'), y('model', D.model), y('manager', D.manager || 'none yet'), y('version', S.ver));
      (AG.conf||[]).forEach(function(c){
        var list = conf[c[0]] || [];
        L.push(y(c[0].toLowerCase()));
        list.forEach(function(it){ var ln = '  - '+h(tx(it)); L.push(chgFor('conf:'+c[0]+':'+it) ? '<span class="chg">'+ln+'</span>' : ln); });
      });
      if(!COORD){ L.push(y('used_in')); D.usedIn.forEach(function(u){ L.push('  - '+h(u.bp)+' v'+u.v+', step '+h(u.step)); }); }
      L.push('---');
    } else if(k === 'prompt'){
      var p = '<span class="mh"># '+h(AG.title)+'</span>\n\n'+h(tx(S.prompt));
      L.push(chgFor('prompt') ? '<span class="chg">'+p+'</span>' : p);
    } else if(k.indexOf('skill:') === 0){
      var sk = k.slice(6);
      L.push('<span class="mh"># '+h(sk)+'</span>', '', '<span class="mh">## When to use</span>', 'Whenever a step asks for '+h(sk.toLowerCase())+'.', '',
             '<span class="mh">## Done when</span>', 'The result says where every fact came from, and how sure we are.', '',
             '<span class="mh">## Ask a person when</span>', 'The sources disagree, or a number is below medium confidence.');
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
      + '<pre class="bscode" id="bsCode" contenteditable="plaintext-only" spellcheck="false" oninput="bsType(this)">'+body(cur[0])+'</pre>'
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
  window.bsType = function(el){
    var k = S.file, name = '';
    files().forEach(function(f){ if(f[0] === k) name = f[2]; });
    S.edits[k] = el.innerText;
    if(!S.on) bsEdit(true, true);
    addChange('file:'+k, 'Changed', name+' edited by hand', 'Source');
    var s = document.getElementById('bsFst'); if(s) s.outerHTML = stHtml(k);
    var a = document.querySelector('.bstoc a.on'); if(a && !a.querySelector('.fd')) a.insertAdjacentHTML('beforeend', '<i class="fd"></i>');
    paintTop();
  };

  /* ── version dropdown ─────────────────────────────────────────────── */
  var VPOP = null;
  function vClose(){ if(VPOP){ VPOP.remove(); VPOP = null; document.removeEventListener('click', vOut, true); } }
  function vOut(e){ if(VPOP && !VPOP.contains(e.target) && !(e.target.closest && e.target.closest('#bsVerB,.bspill,#bsPile'))) vClose(); }
  window.bsVersions = function(anchor){
    if(VPOP){ var was = VPOP._k; vClose(); if(was === 'ver') return; }
    validate();
    var b = '';
    if(S.on && (S.changes.length || S.fix.length)){
      b += '<div class="lbl">Draft</div><div class="bsvi draft"><div class="h">Version '+nextVer(S.ver)+'<span class="dt">Not saved</span></div>'
        + S.changes.map(function(c){
            return '<div class="bschg"><span class="bstag'+(c.kind==='New'?' new':'')+'">'+c.kind+'</span><div>'+h(c.text)+(c.where?'<div class="w">'+h(c.where)+'</div>':'')+'</div></div>';
          }).join('')
        + S.fix.map(function(f){ return '<div class="bsfixn"><i class="ti ti-alert-circle"></i><span>'+h(f)+'</span></div>'; }).join('')
        + '<div class="acts"><button class="bsbtn out" onclick="bsDiscard()">Discard</button></div></div>';
    }
    b += '<div class="lbl">Versions</div>' + D.versions.map(function(v, i){
      return '<div class="bsvi"><div class="h">Version '+v.v+(i===0?' <span class="bstag">Current</span>':'')+'<span class="dt">'+h(v.date)+'</span></div>'
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
    var b = LEVELS.map(function(l){
      var ps = ACCESS.filter(function(p){ return p.lvl === l[0]; });
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
    ? ['Where could a person check the work before the end?', 'Make every step’s instructions shorter and clearer.', 'Which parts of the document does no step write?']
    : ['Make the prompt shorter.', 'Add a skill for stacking rules.', 'Which steps use this agent?'];
  function chips(){ return gyAskCard('Ask the Blueprint agent', CHIPS, 'bsAsk'); }
  var _send = window.sendMsg;
  window.bsEdit = function(on, keepPanel){
    if(on === S.on) return;
    S.on = on; vClose();
    document.body.classList.toggle('bson', on);
    document.body.classList.remove('pclosed');
    if(on){
      S.agentLog = LOG.slice();
      if(!S.bpLog) S.bpLog = [say('I am the Blueprint agent. Ask me to change '+(COORD?'this Blueprint: add a check, split a step or tighten the instructions.':'this agent: its prompt, skills or tools.')+' Every change goes into a draft you see on the page, and nothing is live until you save a new version.'), chips()];
      LOG.length = 0; S.bpLog.forEach(function(x){ LOG.push(x); });
      document.getElementById('ask').placeholder = 'Ask the Blueprint agent';
      window.sendMsg = bsSend;
      if(!keepPanel && COORD && window.TAB === 'content') openTab('workflow');
    } else {
      S.bpLog = LOG.slice();
      LOG.length = 0; S.agentLog.forEach(function(x){ LOG.push(x); });
      document.getElementById('ask').placeholder = 'Ask the agent';
      window.sendMsg = _send;
      if(S.changes.length) gyToast('Your draft is kept. Edit Blueprint picks it up again.');
    }
    paintChat(); paintTabs();
    if(!keepPanel){ repaint(); closeDrawerQuiet(); }
  };
  function closeDrawerQuiet(){ S.sel = null; document.getElementById('drawer').classList.add('hide'); }
  function bsSend(){
    var inp = document.getElementById('ask'), v = (inp.value||'').trim(); if(!v) return;
    inp.value = ''; bsAsk(v);
  }
  window.bsAsk = function(q){
    for(var i = LOG.length - 1; i >= 0; i--) if(LOG[i].indexOf('gyqa') >= 0 || LOG[i].indexOf('class="gyq"') >= 0) LOG.splice(i, 1);
    LOG.push(you(esc(q))); paintChat();
    setTimeout(function(){ LOG.push(say(answer(q))); LOG.push(chips()); paintChat(); paintTabs(); repaint(); }, 650);
  };
  function answer(q){
    var l = q.toLowerCase();
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
  window.bsSave = function(){
    validate(); vClose();
    if(S.fix.length){ gyToast('Fix '+S.fix.length+' thing'+(S.fix.length>1?'s':'')+' before you save'); bsVersions(document.getElementById('bsVerB')); return; }
    if(!S.changes.length) return;
    S.ver = nextVer(S.ver);
    D.versions.unshift({v:S.ver, date:'15 Oct 2026', by:'You', note:S.changes.map(function(c){ return c.text; }).join('; '), runs:[]});
    steps().forEach(function(x){ delete x.s.isNew; });
    S.changes = [];
    SAVED = JSON.stringify({wf:D.wf, conf:conf, prompt:S.prompt, edits:S.edits});
    AG.purpose = S.prompt;
    bsEdit(false);
    gyToast('Saved as version '+S.ver+'. Running Deliverables stay on the version they started with.');
  };
  window.bsDiscard = function(){
    var o = JSON.parse(SAVED);
    D.wf = o.wf; conf = o.conf; S.prompt = o.prompt; S.edits = o.edits || {}; S.changes = [];
    if(D.wf){ uid = 0; D.wf.forEach(function(c){ c.s.forEach(function(s){ s.id = 's'+(++uid); }); }); }
    vClose(); closeDrawerQuiet(); paintTabs(); repaint();
    gyToast('Draft discarded');
  };

  /* ── start ────────────────────────────────────────────────────────── */
  paintTabs();
  var qs = location.search;
  if(/[?&]edit=1/.test(qs)) bsEdit(true);
  var m = qs.match(/[?&]tab=(\w+)/); if(m && VIEWS[m[1]]) openTab(m[1]);
})();
