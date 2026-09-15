// gy-canvas-engine.js
// Shared drawer, side panel and per-step task-list rendering engine for the Great Yellow Deliverable canvas prototypes.
// Canonical source: demand-mapping-canvas-prototype.html. Both prototypes load this after gy-canvas.js so these functions
// exist before each file's inline data and canvas code calls them. The engine reads host globals that each prototype
// defines at call time (NODES, MODE, SELECTED, RUN, ALIST, ARTEFACTS, TEAM, ACTIVITY, AVA, isPrev, setSide, openContentsDoc,
// sendDraft, toast, focusNode, renderNodes, DEMOSNAP). Host buildStamps() populates the STEPSTAMP and FLOW state declared here.
// No em-dashes anywhere in this file, by house rule.

// ---- shead ----
function shead(icon,tint,fg,title,sub,back){
  return `<div class="sh">
  <div class="ic" style="background:${tint};color:${fg}"><i class="ti ${icon}"></i></div>
  <div style="flex:1"><div class="nt">${title}</div>${sub?`<div class="ns">${sub}</div>`:''}</div>
  ${back?`<button class="x" onclick="sideDefault()" aria-label="Close"><i class="ti ti-x"></i></button>`:''}</div>`;
}

// ---- artBtns ----
function artBtns(ids){
  if(!ids||!ids.length)return '';
  return `<div class="flabel">Tools</div>`+ids.map(id=>{const a=ARTEFACTS.find(x=>x.id===id);
   return `<button class="abtn" onclick="svOpenEditor('${a.id}')"><span style="color:${a.ex?'var(--greend)':'var(--amberd)'}">${a.ex?'●':'✦'}</span> ${a.name}<i class="ti ti-chevron-right" style="margin-left:auto;color:var(--ink3)"></i></button>`}).join('');
}

// ---- sideDefault ----
function sideDefault(){
  SELECTED=null;renderNodes();
  setSide(false);
}

// ---- sideActivity / sideContents ----
function sideActivity(){
  setSide(true);
  const s=document.getElementById('side');
  if(isPrev()){
    s.innerHTML=shead('ti-history','var(--graybg)','var(--grayd)','Activity','nothing yet',true)
    +`<div class="sbody"><div class="pt">No run selected. Activity fills in live once a Programme runs this Workflow.</div></div>`;
    return;
  }
  let h='<div>';
  [...ACTIVITY].reverse().forEach(([day,items])=>{
    h+=`<div class="acday">${day}</div><div class="acbox"><div class="acwrap">`;
    [...items].reverse().forEach(([t,w,txt,bub])=>{
      const a=AVA[w];
      const av=a.ic?`<span class="acav" style="background:${a.bg};color:${a.fg}"><i class="ti ${a.ic}" style="font-size:11px"></i></span>`
                   :`<span class="acav" style="background:${a.bg};color:${a.fg}">${a.txt}</span>`;
      h+=`<div class="acrow">${av}<span class="actxt"><b>${a.name}</b> ${txt} <span class="mut">· ${t}</span></span></div>`;
      if(bub)h+=`<div class="acbub">${bub}</div>`;
    });
    h+='</div></div>';
  });
  h+='</div>';
  s.innerHTML=shead('ti-history','var(--graybg)','var(--grayd)','Activity','',true)
  +`<div class="sbody">${h}<div class="nsmall" style="margin-top:14px">Every entry links to its node and its under-the-hood log.</div></div>`;
}
function sideContents(){openContentsDoc();}

// ---- tlRow / tlToggle ----
function tlRow(state,badge,content,det){
  if(!det)return `<div class="tlrow ${state}"><span class="tln">${badge}</span><div class="tlc">${content}</div></div>`;
  return `<div class="tlrow ${state} has" onclick="tlToggle(this)"><span class="tln">${badge}</span>
    <div class="tlc"><div class="tlhead"><span>${content}</span><i class="ti ti-chevron-down tlch"></i></div>
    <div class="tldet">${det}</div></div></div>`;
}
function tlToggle(el){el.classList.toggle('open')}

// ---- STEPTYPES, whoIc, svOpenEditor, toolChipHtml, artChip, DEW, deemph, TLLAST, PAST/BASE/ACTORS, toPast/toActive, STEPSTAMP/FLOW state ----
const STEPTYPES={
  human:{label:'Human-led',ic:'ti-user'},
  agent:{label:'AI Assistant',ic:'ti-sparkles'},
  det:{label:'Fully Automated',ic:'ti-settings'}
};
function whoIc(sp){
  if(sp.who==='human'){
    const nm=sp.ownerN||'Caitlin';
    return `<span class="sav" style="background:#1D9E75;color:#fff" data-tip="${nm}">${nm[0]}</span>`;
  }
  if(sp.who==='det')return `<span class="sav" style="background:#7A776F;color:#fff" data-tip="Fully Automated"><i class="ti ti-settings" style="font-size:11px"></i></span>`;
  return `<span class="sav" style="background:#1F1F1D" data-tip="AI Assistant"><i class="ti ti-sparkles" style="font-size:11px;color:#F9DD5A"></i></span>`;
}
function svOpenEditor(id){
  const vid=(id==='checklist'||id==='intake')?'questionnaire':id;
  if(vid==='questionnaire')location.href='questionnaire-editor.html'+(MODE==='design'?'?edit=1':'');
  else location.href='artefact-editor.html?a='+id+(MODE==='design'?'&edit=1':'');
}
function toolChipHtml(id,opts){
  opts=opts||{};
  const vid=(id==='checklist'||id==='intake')?'questionnaire':id;
  const v=ALIST.find(x=>x.id===vid)||{name:id,ic:'ti-file'};
  const parts=(v.name||'').split(' · ');
  const ty=parts[0], nm=parts.slice(1).join(' · ');
  const bg=v.bg||'#EFEDE8', fg=v.fg||'#55534E';
  return `<span class="tchip${opts.cls?' '+opts.cls:''}"${opts.attr||''}${opts.onclick?` onclick="${opts.onclick}"`:''}>`
    +`<span class="tty" style="background:color-mix(in srgb, ${bg} 13%, #fff)"><span class="gtile" style="background:${bg};color:${fg}"><i class="ti ${v.ic}"></i></span>${ty}</span>`
    +(nm||opts.extra?`<span class="tnm">${nm}${opts.extra||''}</span>`:'')
    +`</span>`;
}
function artChip(id,extra,stepI,artK){
  const act=(stepI!==undefined)
    ?`openStepView(${stepI},${artK},true)`
    :`svOpenEditor('${id}')`;
  return toolChipHtml(id,{onclick:`event.stopPropagation();${act}`,extra:extra});
}
const DEW=new Set([
 'the','a','an','and','or','to','of','from','against','via','if','per','all','each','any','this','that','for','with','on','in','at','into','onto','who','when','what','by','out','onward','then',
 'drafts','draft','holds','hold','confirms','confirm','logs','log','prepares','prepare','approves','approve','send','sends','plans','plan','collects','collect','matches','match','flags','flag','checks','check','reviews','review','calls','call','restarts','restart','pulls','pull','scores','score','ranks','rank','writes','write','loads','load','decides','decide','preps','prep','queries','query','compiles','compile','renders','render','validates','validate','presents','present','files','file','runs','run','sends']);
function deemph(t){
  return t.replace(/[A-Za-z][A-Za-z'\-]*/g,w=>DEW.has(w.toLowerCase())?`<span class="dew">${w}</span>`:w);
}
const TLLAST={};
const PAST={drafts:'drafted',checks:'checked',collects:'collected',compiles:'compiled',confirms:'confirmed',flags:'flagged',loads:'loaded',logs:'logged',matches:'matched',prepares:'prepared',preps:'prepped',pulls:'pulled',queries:'queried',ranks:'ranked',renders:'rendered',scores:'scored',sends:'sent',validates:'validated',writes:'wrote',applies:'applied',approves:'approved',calls:'called',holds:'held',reviews:'reviewed',decides:'decided',presents:'presented',restarts:'restarted'};
const ACTORS=['AI Assistant','Trade rep','Trade team','Vertical Lead','Champion','Caitlin','Emily','Izzie','Millie','Harry','Josh'];
function toPast(t){
  return t.split(',').map((clause,ci)=>{
    let lead='', rest=clause;
    if(ci===0){for(const a of ACTORS){if(clause.startsWith(a)){lead=a;rest=clause.slice(a.length);break;}}}
    const m=rest.match(/^(\s*)([A-Za-z]+)([\s\S]*)$/);
    if(m&&PAST[m[2]])rest=m[1]+PAST[m[2]]+m[3];
    return lead+rest;
  }).join(',');
}
const BASE={drafts:'draft',checks:'check',collects:'collect',compiles:'compile',confirms:'confirm',flags:'flag',loads:'load',logs:'log',matches:'match',prepares:'prepare',preps:'prep',pulls:'pull',queries:'query',ranks:'rank',renders:'render',scores:'score',sends:'send',validates:'validate',writes:'write',applies:'apply',approves:'approve',calls:'call',holds:'hold',reviews:'review',decides:'decide',presents:'present',restarts:'restart'};
function toActive(t){
  let lead='', rest=t;
  for(const a of ACTORS){if(t.startsWith(a)){lead=a;rest=t.slice(a.length);break;}}
  const m=rest.match(/^(\s*)([A-Za-z]+)([\s\S]*)$/);
  if(m&&BASE[m[2]])rest=m[1]+'to '+BASE[m[2]]+m[3];
  return lead+rest;
}
let STEPSTAMP={}, FLOW=[];

// ---- stepStamp*, dateOnly, TASKACC, setTaskMode, task accordion, tl, step how, SVSTEP + sv* panel family, stepNav, openStepView, step editing, dd, sideStep, STEPCATALOG, sideStepPicker, stepCreate, sideNode ----
function stepStampFull(n,i){return (STEPSTAMP[n.id]||[])[i]||'';}
function stepStamp(n,i,sp){const f=stepStampFull(n,i);return f?f.split(' · ')[0]:'';}
function dateOnly(log){
  if(!log)return'';
  const d='Mon|Tue|Wed|Thu|Fri|Sat|Sun', mo='Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec';
  const re=new RegExp(`(?:${d})\\s+\\d{1,2}\\s+(?:${mo})|\\d{1,2}\\s+(?:${mo})|(?:${d})\\s+\\d{1,2}[:.]\\d{2}|(?:${d})|\\d{1,2}[:.]\\d{2}`);
  const m=log.match(re);
  return m?m[0]:'';
}
let TASKACC=true;
function setTaskMode(a){TASKACC=!!a;const n=NODES.find(x=>x.id===SELECTED);if(n)sideNode(n);}
function taskAcc(head){
  const row=head.closest('.tacc');if(!row)return;
  const open=row.classList.contains('open');
  const box=row.closest('.tlbox');
  if(box)box.querySelectorAll('.tacc.open').forEach(r=>r.classList.remove('open'));
  if(!open)row.classList.add('open');
}
function accDet(el){
  const d=el.parentNode.querySelector('.accdet');if(!d)return;
  const open=d.style.display==='none';
  d.style.display=open?'block':'none';
  el.classList.toggle('on',open);
}
function accStepState(n,i){
  const st=(MODE==='run'&&!isPrev())?(n.r.st||''):'';
  if(st==='done')return'd';
  if(st===''||st==='pending'||st==='none')return'';
  const p=n.r.prog??0,c=n.r.cur??-1;return i<p?'d':i===c?'a':'';
}
function accOpen(i,artId){
  const n=NODES.find(x=>x.id===SELECTED);if(!n||!n.form)return;
  const sp=n.form.steps[i];
  const s=accStepState(n,i);
  const work=svWork(n,sp,i,s);
  if(!work&&!sp.arts.length){toast('Prototype: this would run in the tool where the work lives');return;}
  const k=artId?Math.max(0,sp.arts.indexOf(artId)):0;
  SVSTEP={i:i,art:k,arts:sp.arts.slice(),pane:true};
  svPanelRender(n,sp,i,s,work);
  svSyncChips();
}
function accRowHtml(n,sp,i,s){
  const live=!isPrev();
  const bdg=s==='d'?`<span class="tn2 d">${i+1}</span>`:s==='a'?`<span class="tn2 a">${i+1}</span>`:`<span class="tn2">${i+1}</span>`;
  const who=sp.who==='human'?(sp.ownerN||'Caitlin'):sp.who==='det'?'Fully Automated':'AI Assistant';
  const rawTitle=s==='d'?toPast(sp.t):s==='a'?toActive(sp.t):sp.t;
  const stripped=rawTitle.replace(/^(AI Assistant|Caitlin|Emily|Izzie|Millie|Harry|Josh|Trade rep|Vertical Lead)\s+/,'');
  const title=stripped.charAt(0).toUpperCase()+stripped.slice(1);
  const pill=s==='a'?`<span class="tstat now">now</span>`:'';
  const stamp=s==='d'?stepStampFull(n,i):'';
  const work=svWork(n,sp,i,s);
  const canOpen=MODE==='run';
  const isHuman=sp.who==='human';
  const actLabel=isHuman
    ?(work?(s==='d'?'View the sent email':'Open the draft email'):(s==='d'?'View the result':'Open the tool'))
    :(s==='d'?'See what the Assistant did':s==='a'?'See it in progress':'Preview what it will do');
  const actClass=isHuman?'cta':'cta ghost';
  const actBtn=canOpen?`<div class="accact"><button class="${actClass}" style="margin:0" onclick="accOpen(${i})">${actLabel}</button></div>`:'';
  const how=stepHowHtml(n,sp);
  const whenText=i>0?`After task ${i} is completed`:'After previous step is completed';
  const toolChips=sp.arts.map(id=>toolChipHtml(id,{cls:'tclick',onclick:`event.stopPropagation();accOpen(${i},'${id}')`})).join('');
  const meta=stamp?('Completed on '+stamp):(s===''?('When: '+whenText):'');
  const det=[];
  if(toolChips)det.push(`<div class="accrow"><span class="acclab">Tools used</span><span class="acctools">${toolChips}</span></div>`);
  if(sp.prod)det.push(`<div class="accrow"><span class="acclab">Output</span><span class="outchip"><span class="dt" style="background:${n.t.fg}"></span>${sp.prod}</span></div>`);
  const isOpen=s==='a';
  return `<div class="tacc${s==='a'?' cur':''}${s==='d'?' done':''}${isOpen?' open':''}">
    <div class="acchead" onclick="taskAcc(this)">${bdg}<div class="tlc3">
      <div class="tlt"><span class="svgray">${whoIc(sp)}${who}</span><span class="accright">${pill}<i class="ti ti-chevron-down accch"></i></span></div>
      <div class="acctitle">${title}</div>
      ${meta?`<div class="tsub"><div class="tlog">${meta}</div></div>`:''}
    </div></div>
    <div class="accbody">
      <div class="accwhat">${how}</div>
      ${meta?`<div class="tsub"><div class="tlog">${meta}</div></div>`:''}
      ${actBtn}
      ${det.join('')}
    </div>
  </div>`;
}
function tl(n){
  const f=n.form;
  const st=MODE==='run'?(isPrev()?'pending':(n.r.st||'')):'';
  const acc=MODE==='run'&&TASKACC;
  let h=`<div class="tlsec${acc?' accmode':''}"><span class="rail"></span>`;
  if(MODE==='design'){
    const gap=i=>`<div class="tlgap" onclick="sideStepPicker(${i})" title="Add a task here"><span class="gl"></span><span class="gp"><i class="ti ti-plus" style="font-size:12px"></i> Add task</span><span class="gl"></span></div>`;
    f.steps.forEach((sp,i)=>{
      const stepChips=sp.arts.map(id=>artChip(id)).join('');
      const eWho=sp.who==='human'?(sp.ownerN||'Caitlin'):sp.who==='det'?'Fully Automated':'AI Assistant';
      const eTitle=(t=>t.charAt(0).toUpperCase()+t.slice(1))(sp.t.replace(/^(AI Assistant|Caitlin|Emily|Izzie|Millie|Harry|Josh|Trade rep|Vertical Lead)\s+/,''));
      h+=gap(i);
      h+=`<div class="tlrow2 ed" onclick="if(!event.target.closest('.gchip'))openStep(${i})">
        <span class="tn2">${i+1}</span>
        <div class="tlc3">
          <div class="tlt"><span class="svgray">${whoIc(sp)}${eWho}</span><i class="ti ti-chevron-right stepgo"></i></div>
          <div class="acctitle" style="margin-top:6px">${eTitle}</div>
          ${sp.guard?`<div class="tsub"><div class="tlog"><i class="ti ti-shield-check" style="font-size:11px"></i> ${sp.guard}</div></div>`:''}
          ${stepChips?`<div class="tchips">${stepChips}</div>`:''}
        </div></div>`;
    });
    h+=`<div class="tlghost" onclick="sideStepPicker(${f.steps.length})"><i class="ti ti-plus" style="font-size:13px"></i> Add task</div>`;
  } else {
    const live=!isPrev();
    const st2=i=>{if(!live)return'';if(st==='done')return'd';if(st===''||st==='pending'||st==='none')return'';
      const p=n.r.prog??0,c=n.r.cur??-1;return i<p?'d':i===c?'a':'';};
    const bdg=(i,s)=>s==='d'?`<span class="tn2 d">${i+1}</span>`
      :s==='a'?`<span class="tn2 a">${i+1}</span>`:`<span class="tn2">${i+1}</span>`;
    const curNow=st==='done'?-2:(n.r.cur??-1);
    const prevCur=TLLAST[n.id];
    TLLAST[n.id]=curNow;
    const moved=live&&prevCur!==undefined&&prevCur!==curNow;
    f.steps.forEach((sp,i)=>{
      const s=st2(i);
      if(acc){h+=accRowHtml(n,sp,i,s);return;}
      const anim=moved?(s==='a'?' stepin':(i===prevCur&&s==='d'?' stepdone':'')):'';
      h+=`<div class="tlrow2 rn${s==='a'?' cur':''}${anim}" onclick="if(!event.target.closest('.gchip'))openStepView(${i})">${bdg(i,s)}<div class="tlc3">
        <div class="tlt">${whoIc(sp)}<span class="ttx">${s==='d'?toPast(sp.t):s==='a'?toActive(sp.t):sp.t}</span>${s==='d'?`<span class="tstat done">done</span>`:s==='a'?`<span class="tstat now">now</span>`:''}</div>
        ${(()=>{const dt=s==='d'?stepStamp(n,i,sp):'';return dt?`<div class="tsub"><div class="tlog">${dt}</div></div>`:'';})()}
      </div></div>`;
    });
  }
  h+=`</div>`;
  const box=`<div class="tlbox${acc?' accbox':''}">${h}</div>`;
  const ed=MODE==='design'?' class="steptxt" contenteditable spellcheck="false" onblur="stepDoneEd(this)"':'';
  const done=f.done?`<div class="outdone"><span class="outico" style="background:${n.t.bg};color:${n.t.fg}"><i class="ti ti-flag-check"></i></span><span${ed}>${f.done}</span></div>`:'';
  const prodChips=f.produces.map(x=>`<span class="outchip"><span class="dt" style="background:${n.t.fg}"></span>${x}</span>`).join('');
  const outChips=`<div class="outlbl">Produces</div><div class="outgrid">${prodChips}</div>`;
  const outSec=`<div class="flabel">Output</div><div class="outbox">${done}${done&&f.produces.length?`<div class="outdiv"></div>`:''}${outChips}</div>`;
  return box+outSec;
}

function stepPlain(n,sp){
  if(sp.plain)return sp.plain;
  if(sp.inst)return sp.inst;
  return sp.who==='human'
    ? `${sp.ownerN||'Caitlin'} does this part personally. The run pauses here until it is confirmed done, so nothing important happens without a person behind it.`
    : 'The AI Assistant handles this automatically and logs exactly what it did. A person is only pulled in if something is flagged.';
}
function stepHowHtml(n,sp){
  const full=stepPlain(n,sp);
  const LIMIT=130;
  if(full.length<=LIMIT)return `<span style="color:var(--ink2)">${full}</span>`;
  let short=full.slice(0,LIMIT);
  short=short.slice(0,short.lastIndexOf(' ')).replace(/[,;:.\s]+$/,'');
  return `<span class="howwrap" style="color:var(--ink2)"><span class="howshort">${short}… </span><span class="howfull" style="display:none">${full} </span><span class="clink" onclick="howToggle(this)">read more</span></span>`;
}
function howToggle(el){
  const wrap=el.closest('.howwrap');
  const sh=wrap.querySelector('.howshort'), fu=wrap.querySelector('.howfull');
  const open=fu.style.display==='none';
  sh.style.display=open?'none':''; fu.style.display=open?'':'none';
  el.textContent=open?'read less':'read more';
}
let SVSTEP={i:0,art:0,arts:[]};
function svArt(id){
  const vid=(id==='checklist'||id==='intake')?'questionnaire':id;
  return {v:ALIST.find(x=>x.id===vid)||{name:id,ic:'ti-file',bg:'#EFEDE8',fg:'#55534E'},a:ARTEFACTS.find(x=>x.id===id)};
}
function svBigPrev(id){
  const {a}=svArt(id);
  const isQ=(id==='intake');
  return `<div class="svprev svbig"${isQ?' style="cursor:default"':` onclick="svOpenEditor('${id}')" title="Open in tool editor"`}>
    ${a&&a.prev?a.prev:'<div class="nsmall">Open to see this tool.</div>'}
  </div>`;
}
function svTab(k){
  SVSTEP.art=k;
  document.querySelectorAll('.svtabs .svtab').forEach((el,j)=>el.classList.toggle('on',j===k));
  const w=document.getElementById('svprevwrap');
  if(w)w.innerHTML=svBigPrev(SVSTEP.arts[k]);
  svSyncChips();
}
function svSyncChips(){
  const cur=(SVSTEP.pane&&SVSTEP.arts&&SVSTEP.arts.length)?SVSTEP.arts[SVSTEP.art]:null;
  document.querySelectorAll('#side .svtok[data-art]').forEach(el=>el.classList.toggle('sel',el.getAttribute('data-art')===cur));
}
function svMore(el){
  const d=el.parentNode.querySelector('.svsub');
  const open=d.style.display==='none';
  d.style.display=open?'block':'none';
  el.querySelector('i').style.transform=open?'rotate(180deg)':'';
}
function svTokClick(id){
  const k=SVSTEP.arts.indexOf(id);
  if(k<0){svOpenEditor(id);return;}
  if(!SVSTEP.pane){openStepView(SVSTEP.i,k,true);return;}
  if(SVSTEP.art===k){svPane(false);return;}
  openStepView(SVSTEP.i,k,true);
}
/* standalone dark work/preview panel: floats left of the drawer, opened on click */
function svPanelRender(n,sp,i,state,work){
  let el=document.getElementById('svpanel');
  if(!el){
    el=document.createElement('div');el.id='svpanel';el.className='svpanel';document.body.appendChild(el);
    window.addEventListener('resize',()=>{if(el.classList.contains('on'))svPanelPos(el);});
  }
  if(!SVSTEP.pane){el.classList.remove('on');return;}
  const arts=sp.arts;
  const curId=(!work&&arts.length)?arts[SVSTEP.art]:null;
  const closeBtn=`<button class="svnav dk" onclick="svPanelClose()" aria-label="Close preview"><i class="ti ti-x" style="font-size:14px"></i></button>`;
  let title,actions;
  if(curId){
    const {v}=svArt(curId);
    const isQ=(curId==='intake');
    title=`<span class="sphttl"><span class="gtile" style="background:${v.bg};color:${v.fg}"><i class="ti ${v.ic}"></i></span><span class="sphnm">${v.name}</span></span>`;
    const expandBtn=`<button class="svnav dk" title="${isQ?'Open in a new tab':'Open in tool editor'}" onclick="${isQ?`window.open('demand-mapping-intake-poc.html','_blank')`:`svOpenEditor('${curId}')`}" aria-label="Open tool"><i class="ti ${isQ?'ti-external-link':'ti-pencil'}" style="font-size:14px"></i></button>`;
    actions=expandBtn+closeBtn;
  }else if(work){
    const sent=(state==='d');
    title=`<span class="sphttl"><span class="gtile" style="background:#1D9E75;color:#fff"><i class="ti ti-mail"></i></span><span class="sphnm">Questionnaire for James</span><span class="sphsub">· ${sent?'sent':'draft'}</span></span>`;
    const minBtn=`<button class="svnav dk" onclick="svPaneMin()" title="Make smaller" aria-label="Make smaller"><i class="ti ti-arrows-diagonal-minimize-2" style="font-size:15px"></i></button>`;
    const maxBtn=`<button class="svnav dk" onclick="svPaneMax()" title="Make larger" aria-label="Make larger"><i class="ti ti-arrows-diagonal" style="font-size:15px"></i></button>`;
    actions=minBtn+maxBtn+closeBtn;
  }else{
    title=`<span class="svplab" style="margin:0;color:#8A867E">Preview</span>`;
    actions=closeBtn;
  }
  el.innerHTML=`<div class="sphead">${title}<span class="sphact">${actions}</span></div>
  <div class="spbody"><div id="svprevwrap" style="flex:1;display:flex;flex-direction:column">${work||(arts.length?svBigPrev(arts[SVSTEP.art]):`<div class="svempty"><i class="ti ti-eye-off"></i>Nothing to preview for this task</div>`)}</div></div>`;
  el.classList.remove('min','max');
  el.classList.add('on');
  svPanelPos(el);
}
function svPanelPos(el){
  const r=document.getElementById('side').getBoundingClientRect();
  el.style.bottom='';
  if(el.classList.contains('min')){
    const w=Math.min(420,window.innerWidth-32);
    el.style.width=w+'px';
    el.style.left=Math.round((window.innerWidth-w)/2)+'px';
    el.style.top='';
    el.style.height='';
    el.style.bottom='0px';
    return;
  }
  if(el.classList.contains('max')){
    const w=Math.min(940,window.innerWidth-48);
    el.style.width=w+'px';
    el.style.left=Math.max(24,(window.innerWidth-w)/2)+'px';
    el.style.top='24px';
    el.style.height=(window.innerHeight-48)+'px';
    return;
  }
  el.style.top=r.top+'px';
  const w=Math.min(520,Math.max(320,r.left-28));
  el.style.width=w+'px';
  el.style.left=(r.left-w-14)+'px';
  el.style.height=r.height+'px';
}
function svPanelHide(){const el=document.getElementById('svpanel');if(el)el.classList.remove('on');}
function svPanelClose(){const el=document.getElementById('svpanel');if(el)el.classList.remove('on');SVSTEP.pane=false;}
function svPane(open){openStepView(SVSTEP.i,SVSTEP.art,open);}
function svPaneMin(){const el=document.getElementById('svpanel');if(!el)return;el.classList.remove('max');el.classList.toggle('min');svPanelPos(el);}
function svPaneMax(){const el=document.getElementById('svpanel');if(!el)return;el.classList.remove('min');el.classList.toggle('max');svPanelPos(el);}
function svWork(n,sp,i,state){
  if(n.id==='sendq'&&sp.who==='human'&&(state==='a'||state==='d')){
    const sent=(state==='d');
    return `<div class="svprev svbig svact" style="cursor:default;display:flex;flex-direction:column;flex:1;padding:0;overflow:hidden">
      <div class="cprow"><span class="cplab">From</span><span class="cpchip"><span class="sav" style="background:#1D9E75;color:#fff;width:16px;height:16px;font-size:9px">C</span>Caitlin Ciceri &lt;caitlin@greatyellow.earth&gt;</span></div>
      <div class="cprow"><span class="cplab">To</span><span class="cpchip"><span class="sav" style="background:#0F6E56;color:#fff;width:16px;height:16px;font-size:9px">J</span>James Ruggles &lt;james@evenlode.earth&gt;</span></div>
      <div class="cprow"><span class="cplab">Subject</span><span class="cpval"${sent?'':' contenteditable'} spellcheck="false" style="outline:none;flex:1">Mapping the demand for Evenlode Landscape Recovery</span></div>
      <div class="cpbody"${sent?'':' contenteditable'} spellcheck="false">
        <p>Hi James, lovely speaking today.</p>
        <p>To map what Evenlode Landscape Recovery can sell and who would buy it, we need a few things from you. This link does most of the work, and anything you upload we read for you. It takes about ten minutes.</p>
        <p><span class="cpbtn" contenteditable="false" onclick="window.open('demand-mapping-intake-poc.html','_blank')">Open your questionnaire</span></p>
        <p>Anything unclear, just reply to this email.<br>Warm regards, Caitlin</p>
      </div>
      ${sent
        ?`<div class="cpbar" style="justify-content:flex-start"><span style="font-size:13px;color:var(--greend);display:inline-flex;align-items:center;gap:6px"><i class="ti ti-check" style="font-size:14px"></i>Sent Mon 14:20 · acknowledged by the client 15:02</span></div>`
        :`<div class="cpbar"><i class="ti ti-paperclip" onclick="toast('Attachments would ride along with the send')"></i><i class="ti ti-braces" onclick="toast('Merge fields were already filled by the run: project, contact, sender')"></i><button class="cpsend" onclick="sendDraft()">Send</button></div>`}
    </div>`;
  }
  return null;
}
function svStory(n,sp){
  if(!sp.story)return `<div class="pt" style="font-size:14px">${stepPlain(n,sp)}</div>`;
  const tok=t=>{
    if(!t)return'';
    const a=t.match(/^a:(.+)$/);
    if(a){const {v}=svArt(a[1]);
      return `<div class="schip">${toolChipHtml(a[1].replace(/^a:/,''),{cls:'svtok',onclick:`svTokClick('${a[1]}')`})}</div>`;}
    const c=t.match(/^c:(.+)$/);
    if(c)return `<div class="schip"><span class="svgray">${c[1]}</span></div>`;
    return'';
  };
  return `<div class="svstory2">${sp.story.map(r=>`<div class="srow"><div class="stxt">${r[0]}</div>${tok(r[1])}</div>`).join('')}</div>`;
}
function stepNav(dir){
  const n=NODES.find(x=>x.id===SELECTED); if(!n||!n.form||!n.form.steps)return;
  const i=SVSTEP.i, L=n.form.steps.length, fi=FLOW.indexOf(n.id);
  if(dir>0){
    if(i<L-1){openStepView(i+1);return;}
    const nx=FLOW[fi+1]; if(!nx)return;
    SELECTED=nx; renderNodes(); focusNode(nx); openStepView(0);
  } else {
    if(i>0){openStepView(i-1);return;}
    const pv=FLOW[fi-1]; if(!pv)return;
    const pn=NODES.find(x=>x.id===pv);
    SELECTED=pv; renderNodes(); focusNode(pv); openStepView(pn.form.steps.length-1);
  }
}
function openStepView(i,art,pane){
  const n=NODES.find(x=>x.id===SELECTED); if(!n||!n.form)return;
  const s=document.getElementById('side');
  const f=n.form, sp=f.steps[i];
  const st=(MODE==='run'&&!isPrev())?(n.r.st||''):'';
  const p=n.r.prog??0, c=n.r.cur??-1;
  const state=st==='done'?'d':(st===''||st==='pending'||st==='none')?'':(i<p?'d':i===c?'a':'');
  const work=svWork(n,sp,i,state);
  const paneOpen=pane!==undefined?!!pane:!!(work&&state==='a');
  SVSTEP={i:i,art:art||0,arts:sp.arts.slice(),pane:paneOpen};
  document.querySelector('.main .side').classList.remove('wide','xl');
  const executor=sp.who==='human'?(sp.ownerN||'Caitlin'):'AI Assistant';
  const statusTxt=state==='d'?(sp.log||'Done.')
    :state==='a'?(n.r.note||'Happening now.')
    :'Not started yet. It wakes automatically when the step before it finishes.';
  const stLabel=state==='d'?'Done':state==='a'?'In progress':'Queued';
  const stDot=state==='d'?'var(--green)':state==='a'?'var(--blue)':'var(--line2)';
  const primary=(state==='a'&&n.run&&n.run.cta&&!work)
    ?`<button class="cta" style="margin-top:8px" onclick="${n.run.cta==='View draft email'?'svPane(true)':`toast('Prototype: this would ${n.run.cta.toLowerCase()} in the tool where the work lives')`}">${n.run.cta}</button>`:'';
  const fi=FLOW.indexOf(n.id);
  const atFirst=(fi<=0&&i===0);
  const atLast=(fi===FLOW.length-1&&i===f.steps.length-1);
  const nav=`<span style="margin-left:auto;display:flex;gap:8px">
    <button class="svnav" ${atFirst?'disabled':`onclick="stepNav(-1)"`} aria-label="Previous task"><i class="ti ti-chevron-up"></i></button>
    <button class="svnav" ${atLast?'disabled':`onclick="stepNav(1)"`} aria-label="Next task"><i class="ti ti-chevron-down"></i></button>
  </span>`;
  const whenText=state==='d'?stepStampFull(n,i):state==='a'?'Now':(i>0?`After step ${i} is complete`:`After the previous step is complete`);
  const statusDD=`<div class="dd" style="margin-left:10px"><button class="ddbtn" style="width:auto;padding:4px 10px;font-size:13px;color:var(--ink2);gap:6px" onclick="ddToggle(this,event)"><span style="width:7px;height:7px;border-radius:50%;background:${stDot};flex:none"></span><span>${stLabel}</span><i class="ti ti-chevron-down car" style="font-size:12px"></i></button>
    <div class="ddmenu">${['Done','In progress','Queued'].map(l=>`<div class="ddrow ${l===stLabel?'on':''}" onclick="toast('Task state is set by the run itself, not by hand')">${l}${l===stLabel?'<i class="ti ti-check ddchk"></i>':''}</div>`).join('')}</div>
  </div>`;
  const act=(t=>t.charAt(0).toUpperCase()+t.slice(1))(sp.t.replace(/^(AI Assistant|Caitlin|Emily|Izzie|Millie|Harry|Josh|Trade rep|Vertical Lead)\s+/,''));
  const artChips=sp.arts.map(id=>{
    const {v}=svArt(id);
    return toolChipHtml(id,{cls:'svtok',attr:` data-art="${id}"`,onclick:`svTokClick('${id}')`});
  }).join('');
  const actLabel=work?(state==='d'?'View sent email':'Open the draft email')
    :(n.run&&n.run.cta)?n.run.cta
    :sp.arts.length?(state==='d'?'View result':'Run this task')
    :(sp.who==='human'?'Do this task':'Run this task');
  const actClick=work?'svPane(true)'
    :(n.run&&n.run.cta==='View draft email')?'svPane(true)'
    :sp.arts.length?`openStepView(${i},0,true)`
    :`toast('Prototype: this would ${actLabel.toLowerCase()} in the tool where the work lives')`;
  const rows=[
    ['Who',`<span class="svgray">${whoIc(sp)}${executor}</span>`],
    ['What',act],
    ['How',stepHowHtml(n,sp)],
    ['Actions',`<button class="cta" style="margin:0" onclick="${actClick}">${actLabel}</button>`],
    ['When',`<span style="color:var(--ink2)">${whenText}</span>`],
    artChips?['Tools used',artChips]:null,
    sp.prod?['Output',`<span class="outchip"><span class="dt" style="background:${n.t.fg}"></span>${sp.prod}</span>`]:null,
    sp.guard?['Guardrail',`<span style="color:var(--ink2)">${sp.guard}</span>`]:null
  ].filter(Boolean).map(r=>`<div class="svtr"><div class="svtl">${r[0]}</div><div class="svtv">${r[1]}</div></div>`).join('');
  const info=`
    <div style="display:flex;align-items:center;margin-bottom:12px">
      <div class="nt">Task ${i+1} / ${f.steps.length}</div>
      ${statusDD}
      ${nav}
    </div>
    <div class="svtbl">${rows}</div>`;
  // Slide in only when drilling down from the node view, not when paging next/prev
  const deep=!document.querySelector('#side .subslide');
  s.innerHTML=`<div class="subslide${deep?' slidein':''}"><div class="sh">
    <button class="x" onclick="stepBack()" aria-label="Back"><i class="ti ti-chevron-left"></i></button>
    <div style="flex:1;min-width:0"><div class="nt">${n.title}</div></div>
    <button class="x" onclick="stepClose()" aria-label="Close"><i class="ti ti-x"></i></button>
  </div>
  <div class="sbody nopane" style="display:flex;flex-direction:row"><div class="svleft" style="flex:1">${info}</div></div>
  </div>`;
  setSide(true);
  svPanelRender(n,sp,i,state,work);
  svSyncChips();
}
function stepBack(){
  document.querySelector('.main .side').classList.remove('wide','xl');
  svPanelHide();
  backToNode();
}
function stepClose(){
  document.querySelector('.main .side').classList.remove('wide','xl');
  svPanelHide();
  sideDefault();
}
function stepForm(){const n=NODES.find(x=>x.id===SELECTED);return n&&n.form}
function stepRefresh(){const n=NODES.find(x=>x.id===SELECTED);if(n)sideNode(n);}
function backToNode(){const n=NODES.find(x=>x.id===SELECTED);if(n){setSide(true);sideNode(n);}}
function openStep(i){const n=NODES.find(x=>x.id===SELECTED);if(n)sideStep(n,i);}
function stepDel(i){
  const f=stepForm(); if(!f)return;
  f.steps.splice(i,1);
  stepRefresh();
}
function stepDup(i){
  const f=stepForm(); if(!f)return;
  const c=JSON.parse(JSON.stringify(f.steps[i]));
  c.log=null;
  f.steps.splice(i+1,0,c);
  sideStep(NODES.find(x=>x.id===SELECTED),i+1);
}
function stepDoneEd(el){
  const f=stepForm(); if(!f)return;
  const t=el.textContent.trim();
  if(t)f.done=t; else el.textContent=f.done;
}
function stepRen(i,el){
  const f=stepForm(); if(!f)return;
  const t=el.textContent.trim();
  if(t)f.steps[i].t=t; else el.textContent=f.steps[i].t;
}
function stepSet(i,k,v){const f=stepForm();if(f&&f.steps[i])f.steps[i][k]=v;}
function stepSetWho(i,v){
  const f=stepForm(); if(!f)return;
  const sp=f.steps[i];
  if(v==='agent'||v==='det'){sp.who=v;}
  else{sp.who='human';sp.ownerN=v;}
  sideStep(NODES.find(x=>x.id===SELECTED),i);
}
function stepAddArt(i,id){
  const f=stepForm(); if(!f||!id)return;
  if(!f.steps[i].arts.includes(id))f.steps[i].arts.push(id);
  sideStep(NODES.find(x=>x.id===SELECTED),i);
}
function stepDelArt(i,id){
  const f=stepForm(); if(!f)return;
  f.steps[i].arts=f.steps[i].arts.filter(x=>x!==id);
  sideStep(NODES.find(x=>x.id===SELECTED),i);
}
function dragS(e,i){e.dataTransfer.setData('text/plain',String(i));e.dataTransfer.effectAllowed='move';}
function dragO(e,el){e.preventDefault();el.classList.add('dragover');}
function dropS(e,j,el){
  e.preventDefault();el.classList.remove('dragover');
  const i=parseInt(e.dataTransfer.getData('text/plain'),10);
  const f=stepForm(); if(!f||isNaN(i)||i===j)return;
  const [m]=f.steps.splice(i,1);
  f.steps.splice(i<j?j-1:j,0,m);
  stepRefresh();
}
function ownerAvatar(v){
  if(v==='agent')return `<span class="sav" style="background:#1F1F1D"><i class="ti ti-sparkles" style="font-size:11px;color:#F9DD5A"></i></span>`;
  if(v==='det')return `<span class="sav" style="background:#7A776F;color:#fff"><i class="ti ti-settings" style="font-size:11px"></i></span>`;
  const m=(typeof TEAM!=='undefined'?TEAM:[]).find(t=>t.n.split(' ')[0]===v);
  return `<span class="sav" style="background:${m?m.c:'#B9B6AC'};color:#fff">${v[0]}</span>`;
}
function ownerLabel(v){return v==='agent'?'AI Assistant':v==='det'?'Fully Automated system':v;}
function ddToggle(el,e){
  e.stopPropagation();
  const menu=el.nextElementSibling;
  document.querySelectorAll('.ddmenu.open').forEach(m=>{if(m!==menu)m.classList.remove('open')});
  menu.classList.toggle('open');
}
document.addEventListener('click',()=>document.querySelectorAll('.ddmenu.open').forEach(m=>m.classList.remove('open')));
function artOneLiner(a){
  let src=ARTEFACTS.find(x=>x.id===a.id);
  if(!src&&a.id==='questionnaire')src=ARTEFACTS.find(x=>x.id==='intake');
  const d=(src&&src.desc)||a.sub||'';
  const first=d.split(/(?<=\.)\s/)[0]||d;
  return first.length>92?first.slice(0,89)+'…':first;
}
function sideStep(n,i){
  const s=document.getElementById('side');
  const f=n.form, sp=f.steps[i];
  const ty=STEPTYPES[sp.who]||STEPTYPES.agent;
  const owner=sp.who==='human'?(sp.ownerN||'Caitlin'):sp.who;
  const ddrow=(v,sel,onclick)=>`<div class="ddrow ${sel?'on':''}" onclick="${onclick}">${ownerAvatar(v)}<span>${ownerLabel(v)}</span>${sel?'<i class="ti ti-check ddchk"></i>':''}</div>`;
  const ownerDD=`<div class="dd">
    <button class="ddbtn" onclick="ddToggle(this,event)">${ownerAvatar(owner)}<span>${ownerLabel(owner)}</span><i class="ti ti-chevron-down car"></i></button>
    <div class="ddmenu">
      <div class="ddsec">System</div>
      ${ddrow('agent',owner==='agent',`stepSetWho(${i},'agent')`)}
      ${ddrow('det',owner==='det',`stepSetWho(${i},'det')`)}
      <div class="ddsec">Team</div>
      ${['Caitlin','Emily','Izzie','Millie','Harry','Josh','Trade rep','Vertical Lead'].map(nm=>ddrow(nm,owner===nm,`stepSetWho(${i},'${nm}')`)).join('')}
    </div>
  </div>`;
  const artChips=sp.arts.map(id=>{
    const vid=(id==='checklist'||id==='intake')?'questionnaire':id;
    const v=ALIST.find(x=>x.id===vid)||{name:id,ic:'ti-file'};
    return toolChipHtml(id,{extra:`<i class="ti ti-x gx" onclick="stepDelArt(${i},'${id}')"></i>`});
  }).join('');
  const artRows=ALIST.filter(a=>!sp.arts.some(id=>((id==='checklist'||id==='intake')?'questionnaire':id)===a.id))
    .map(a=>`<div class="ddrow" onclick="stepAddArt(${i},'${a.id}')">
      <span class="ddtile" style="background:${a.bg};color:${a.fg}"><i class="ti ${a.ic}" style="font-size:15px"></i></span>
      <span style="flex:1;min-width:0;font-weight:500">${a.name}</span>
    </div>`).join('');
  const artDD=`<div class="dd">
    <button class="ddbtn" onclick="ddToggle(this,event)"><span class="ddtile sm" style="background:#EFEDE8;color:#55534E"><i class="ti ti-plus" style="font-size:14px"></i></span><span style="color:var(--ink3)">Attach a tool…</span><i class="ti ti-chevron-down car"></i></button>
    <div class="ddmenu">${artRows||'<div class="ddsec" style="padding-bottom:8px">Everything is already attached</div>'}</div>
  </div>`;
  const prodRow=(v,label,sel)=>`<div class="ddrow ${sel?'on':''}" onclick="stepSet(${i},'prod','${v}');sideStep(NODES.find(x=>x.id===SELECTED),${i})">
    ${v?`<span class="dt" style="background:${n.t.fg};width:7px;height:7px;border-radius:50%;flex:none"></span>`:`<span style="width:7px;flex:none"></span>`}<span>${label}</span>${sel?'<i class="ti ti-check ddchk"></i>':''}</div>`;
  const prodDD=`<div class="dd">
    <button class="ddbtn" onclick="ddToggle(this,event)">${sp.prod?`<span class="dt" style="background:${n.t.fg};width:7px;height:7px;border-radius:50%;flex:none"></span><span>${sp.prod}</span>`:`<span style="color:var(--ink3)">Not tied to an output</span>`}<i class="ti ti-chevron-down car"></i></button>
    <div class="ddmenu">
      ${prodRow('','Not tied to an output',!sp.prod)}
      ${f.produces.map(x=>prodRow(x.replace(/'/g,"\\'"),x,sp.prod===x)).join('')}
    </div>
  </div>`;
  const needChips=f.needs.map(x=>`<div class="mbx"><span style="color:var(--blued)">{ ${x[0]} › ${x[1]} }</span></div>`).join('');
  s.innerHTML=`<div class="subslide"><div class="sh">
    <button class="x" onclick="backToNode()" aria-label="Back"><i class="ti ti-chevron-left"></i></button>
    <div style="flex:1;min-width:0"><div class="nt"><span class="steptxt" contenteditable spellcheck="false" onblur="stepRen(${i},this)" onkeydown="if(event.key==='Enter'){event.preventDefault();this.blur()}">${sp.t}</span></div></div>
  </div>
  <div class="sbody">
    <div class="flabel">Who</div>
    ${ownerDD}
    <div class="flabel">How</div>
    <textarea class="farea" placeholder="What exactly happens in this step, in the owner's own words…" onblur="stepSet(${i},'inst',this.value)">${sp.inst||''}</textarea>
    <div class="flabel">When</div>
    <div class="nsmall" style="margin-bottom:2px">${i>0?`After step ${i} is complete`:'After the previous step is complete'} · set automatically by the run</div>
    <div class="flabel">Tools used</div>
    ${artChips?`<div class="tchips" style="margin:0 0 8px">${artChips}</div>`:''}
    ${artDD}
    <div class="flabel">Guardrail</div>
    <input class="finput" value="${(sp.guard||'').replace(/"/g,'&quot;')}" placeholder="e.g. client-facing sends need a human tap" onblur="stepSet(${i},'guard',this.value)">
    <div class="flabel">Output</div>
    ${prodDD}
    <div class="flabel">Needs</div>
    ${needChips||'<div class="nsmall">Nothing yet · inherits the step inputs</div>'}
    <div class="ctabar"><button class="cta" onclick="toast('The AI Assistant would apply this task spec to the blueprint and log the change');backToNode()">Save task</button></div>
  </div></div>`;
  setSide(true);
}
const STEPCATALOG=[
  ['Human-led',[
    ['human','ti-user','Human task','New human task'],
    ['human','ti-checkbox','Approval','Caitlin approves'],
    ['human','ti-mail','Client touchpoint','Contact the client']]],
  ['AI Assistant',[
    ['agent','ti-pencil','Draft','AI Assistant drafts a document'],
    ['agent','ti-search','Research','AI Assistant researches and cites sources'],
    ['agent','ti-list-check','Check','AI Assistant checks against a rule']]],
  ['Fully Automated',[
    ['det','ti-send','Send','Send to the client'],
    ['det','ti-link','Generate link','Mint a pre-filled link'],
    ['det','ti-database','Log / write','Write the record and log it']]]
];
function sideStepPicker(i){
  const s=document.getElementById('side');
  const rows=STEPCATALOG.map(([cat,items])=>`<div class="flabel" style="margin-top:18px">${cat}</div>`
    +items.map(([who,ic,label,t],j)=>`<div class="arow" style="margin-top:6px" onclick="stepCreate(${i},'${who}','${t.replace(/'/g,"\\'")}')">
      <span class="aic" style="width:30px;height:30px;border-radius:9px;background:${who==='human'?'#E4F0DC':who==='agent'?'#1F1F1D':'#EFEDE8'};color:${who==='human'?'#3F5C2E':who==='agent'?'#F9DD5A':'#55534E'}"><i class="ti ${ic}" style="font-size:15px"></i></span>
      <span style="flex:1;font-size:15px">${label}</span>
      <i class="ti ti-chevron-right chvw"></i></div>`).join('')).join('');
  s.innerHTML=`<div class="subslide"><div class="sh">
    <button class="x" onclick="backToNode()" aria-label="Back"><i class="ti ti-chevron-left"></i></button>
    <div style="flex:1"><div class="nt">Add a step</div></div>
  </div>
  <div class="sbody" style="padding-top:6px">${rows}</div></div>`;
  setSide(true);
}
function stepCreate(i,who,t){
  const f=stepForm(); if(!f)return;
  f.steps.splice(i,0,{t,who,ownerN:'Caitlin',arts:[],log:null,inst:'',guard:'',prod:''});
  sideStep(NODES.find(x=>x.id===SELECTED),i);
}
function sideNode(n){
  const s=document.getElementById('side');
  const sw=document.querySelector('.main .side'); if(sw)sw.classList.remove('wide','xl');
  if(window.svPanelHide)svPanelHide();
  const m=MODE==='design'?n.d:n.r;
  if(n.info&&!n.form){
    s.innerHTML=shead(n.t.ic,n.t.bg,n.t.fg,n.title,'',true)+`<div class="sbody"><div class="pt">${n.info}</div></div>`;
    return;
  }
  if(MODE==='design'){
    const f=n.form;
    s.innerHTML=shead(n.t.ic,n.t.bg,n.t.fg,n.title,'',true)
    +`<div class="sbody"><div class="flabel">What</div><textarea class="farea">${f.what}</textarea>`
    +`<div class="flabel">Tasks</div>`+tl(n)
    +`<div class="ctabar"><button class="cta" onclick="toast('The AI Assistant would apply your edits to the blueprint and log the change')">Save changes</button></div></div>`;
  } else {
    if(DEMOSNAP){
      s.innerHTML=shead(n.t.ic,n.t.bg,n.t.fg,n.title,'',true)
      +`<div class="sbody">`+(n.form?`<div class="flabel">What</div><div class="pt">${n.form.what}</div>`:'')+`<div class="flabel">Tasks</div>`+(n.form?tl(n):'')+`</div>`;
      return;
    }
    if(isPrev()){
      s.innerHTML=shead(n.t.ic,n.t.bg,n.t.fg,n.title,'',true)
      +`<div class="sbody"><div class="pt">This is the blueprint wearing its run view. Start a run from a Programme to see real state here.</div>`
      +(n.form?`<div class="flabel">Tasks</div>`+tl(n):'')+`</div>`;
      return;
    }
    const r=n.run;
    if(!r){
      s.innerHTML=shead(n.t.ic,n.t.bg,n.t.fg,n.title,'',true)
      +`<div class="sbody">`+(n.form?`<div class="flabel">What</div><div class="pt">${n.form.what}</div>`:'')
      +(n.form?`<div class="flabel">Tasks</div>`+tl(n):'')+`</div>`;
      return;
    }
    s.innerHTML=shead(n.t.ic,n.t.bg,n.t.fg,n.title,'',true)
    +`<div class="sbody"><div class="flabel">What</div><div class="pt">${n.form.what}</div>`
    +`<div class="flabel">Tasks</div>`+tl(n)+`</div>`;
  }
}

