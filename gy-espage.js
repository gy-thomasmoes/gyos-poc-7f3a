/* gy-espage.js - one ecosystem-service product page, used at both altitudes.
   Portfolio scope aggregates across programmes. Programme scope is one place.
   The layout, the cover and the four pipeline states are identical; what
   changes is what the middle band breaks the numbers down by. */
(function(){

var ES = {
  bng:{name:'BNG units',       short:'BNG',  icon:'ti-butterfly', unit:'units',
       c:'#1E8A63', dark:'#145F45', lite:'#3FA87E', bg:'#E3F2EB'},
  wcc:{name:'Woodland carbon', short:'WCC',  icon:'ti-trees',     unit:'credits',
       c:'#C67F16', dark:'#8A5510', lite:'#DFA249', bg:'#FAEEDA'},
  soc:{name:'Soil carbon',     short:'Soil', icon:'ti-stack-2',   unit:'credits',
       c:'#8A6B3D', dark:'#5F4826', lite:'#B08E5C', bg:'#F2EADF'}
};

var CSS = `
.cover{position:relative;overflow:hidden;color:#fff;padding:34px 0 30px;background:var(--pc)}
.coverin{max-width:1080px;margin:0 auto;padding:0 32px;position:relative;z-index:1}
.covtop{display:flex;align-items:center;gap:15px}
.covico{width:52px;height:52px;border-radius:15px;background:rgba(255,255,255,.16);
  display:flex;align-items:center;justify-content:center;flex:none}
.covico .ti{font-size:27px}
.coveyebrow{font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.7)}
.covname{font-family:var(--serif);font-weight:500;font-size:36px;letter-spacing:-.02em;line-height:1.05;margin-top:3px}
.covstats{display:flex;gap:34px;flex-wrap:wrap;margin-top:26px}
.cs .csv{font-size:25px;font-weight:600;letter-spacing:-.02em;font-variant-numeric:tabular-nums;line-height:1}
.cs .csv small{font-size:13px;font-weight:500;color:rgba(255,255,255,.72);margin-left:4px}
.cs .csl{font-size:11.5px;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.66);margin-top:6px;font-weight:600}
.covacts{position:absolute;right:32px;top:0;display:flex;gap:9px}
.covbtn{font:inherit;font-size:13.5px;font-weight:500;padding:8px 14px;border-radius:10px;cursor:pointer;
  background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.25);color:#fff;display:inline-flex;align-items:center;gap:7px}
.covbtn:hover{background:rgba(255,255,255,.24)}
.covbtn.solid{background:#fff;border-color:#fff;color:var(--pc-dark)}

.sectrow{display:flex;align-items:baseline;gap:12px;margin:30px 0 12px}
.sectrow .sect{margin:0}
.sectrow .sn{font-size:13px;color:var(--ink3)}
.sectrow .act{margin-left:auto;font-size:13.5px;color:var(--ink2);cursor:pointer}
.sectrow .act:hover{color:var(--ink)}
.srow{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
@media(max-width:900px){.srow{grid-template-columns:repeat(2,1fr)}}
.stt{position:relative;border-radius:14px;padding:15px 17px;background:var(--pc-bg);overflow:hidden}
.stt .lab{font-size:11px;letter-spacing:.055em;text-transform:uppercase;color:var(--ink2);font-weight:600}
.stt .val{font-size:25px;font-weight:600;letter-spacing:-.02em;margin-top:8px;line-height:1;font-variant-numeric:tabular-nums}
.stt .val small{font-size:13px;font-weight:500;color:var(--ink2);margin-left:4px}
.stt .gauge{position:absolute;right:13px;top:13px;bottom:13px;width:7px;border-radius:99px;background:rgba(26,12,18,.07)}
.stt .gfill{position:absolute;left:0;right:0;bottom:0;border-radius:99px;background:var(--pc-lite)}
.stt.total{background:var(--pc);color:#fff}
.stt.total .lab{color:rgba(255,255,255,.82)}
.stt.total .val small{color:rgba(255,255,255,.82)}
.stt.total .gauge{display:none}

.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px 18px;margin-top:12px}
.card h3{font-size:14px;font-weight:600;letter-spacing:-.01em;display:flex;align-items:center;gap:9px;margin-bottom:12px}
.card h3 .n{margin-left:auto;font-size:12.5px;color:var(--ink3);font-weight:400;font-variant-numeric:tabular-nums}
.two{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px;align-items:start}
.two .card{margin-top:0}
@media(max-width:900px){.two{grid-template-columns:1fr}}

.brow{display:flex;align-items:center;gap:14px;padding:9px 0}
.brow+.brow{border-top:1px solid var(--line)}
.brow .bn{font-size:13.5px;font-weight:500;width:170px;flex:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}
.brow .bn:hover{color:var(--pc-dark)}
.bbar{flex:1;height:22px;border-radius:7px;background:#EFEDE6;overflow:hidden;display:flex}
.bseg{height:100%;display:flex;align-items:center;padding:0 8px;font-size:11.5px;font-weight:600;color:var(--ink2);min-width:0}
.bseg.f{background:color-mix(in srgb, var(--pc) 22%, #fff)}
.bseg.a{background:color-mix(in srgb, var(--pc) 45%, #fff)}
.bseg.r{background:color-mix(in srgb, var(--pc) 70%, #fff)}
.bseg.s{background:var(--pc);color:#fff}
.brow .bt{font-size:12.5px;color:var(--ink3);white-space:nowrap;font-variant-numeric:tabular-nums}
.blegend{display:flex;gap:16px;margin-top:11px;font-size:11.5px;color:var(--ink3);flex-wrap:wrap}
.blegend i{width:9px;height:9px;border-radius:3px;display:inline-block;margin-right:6px}

#esMap{height:236px;border-radius:12px;overflow:hidden;background:#EFEDE6}
.maplab{display:flex;gap:14px;font-size:11.5px;color:var(--ink3);margin-top:10px;flex-wrap:wrap}
.maplab i{width:9px;height:9px;border-radius:50%;background:var(--pc);display:inline-block;margin-right:5px}

.drow{display:flex;align-items:center;gap:11px;padding:9px 0;font-size:13.5px}
.drow+.drow{border-top:1px solid var(--line)}
.drow .dn{font-weight:500;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.drow .du{color:var(--ink3);font-variant-numeric:tabular-nums;white-space:nowrap}
.drow .dst{font-size:11.5px;font-weight:600;padding:2px 9px;border-radius:999px;white-space:nowrap}
.dst.hot{background:var(--pc-bg);color:var(--pc-dark)}
.dst.neg{background:#FAEEDA;color:#854F0B}
.dst.early{background:#F1EFE8;color:#5F5E5A}
.drow .dv{font-weight:600;font-variant-numeric:tabular-nums;white-space:nowrap}

.rrow{display:flex;align-items:flex-start;gap:11px;padding:10px 0}
.rrow+.rrow{border-top:1px solid var(--line)}
.rrow .rd{width:9px;height:9px;border-radius:50%;flex:none;margin-top:5px}
.rrow .rd.hi{background:#A3342B}.rrow .rd.md{background:#EF9F27}.rrow .rd.lo{background:#639922}
.rrow .rt{font-size:13.5px;font-weight:500;line-height:1.35}
.rrow .rx{font-size:12.5px;color:var(--ink3);line-height:1.45;margin-top:2px}

.invhead{display:flex;align-items:center;gap:12px;margin:30px 0 0;position:relative}
/* grouped rows: one band per vintage, with what the band adds up to */
.dtbl tr.grp td{background:var(--graybg);font-size:12.5px;font-weight:600;color:var(--ink2);
  padding:9px 14px;cursor:pointer;border-bottom:1px solid var(--line)}
.dtbl tr.grp td .gv{color:var(--ink)}
.dtbl tr.grp td .gs{font-weight:400;color:var(--ink3);margin-left:9px;font-variant-numeric:tabular-nums}
.dtbl tr.grp td .ti{float:right;font-size:15px;color:var(--ink3);transition:transform .15s}
.dtbl tr.grp.closed td .ti{transform:rotate(-90deg)}
.dtbl tr.hid{display:none}
/* record drawer */
.recov{position:fixed;inset:0;background:rgba(31,31,29,.20);z-index:1300;display:none}
.recov.on{display:block}
.recdr{position:fixed;top:0;right:0;bottom:0;width:430px;max-width:92vw;background:var(--card);
  border-left:1px solid var(--line);box-shadow:-18px 0 50px rgba(31,31,29,.14);z-index:1310;
  transform:translateX(100%);transition:transform .18s ease;display:flex;flex-direction:column}
.recdr.on{transform:none}
.recdr .rh{padding:18px 22px 15px;border-bottom:1px solid var(--line);background:var(--pc-bg)}
.recdr .rk{font-size:11px;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:var(--pc-dark)}
.recdr .rn{font-family:var(--serif);font-size:23px;font-weight:500;letter-spacing:-.01em;margin-top:4px}
.recdr .rx{position:absolute;right:16px;top:15px;width:30px;height:30px;border-radius:9px;border:none;background:transparent;
  cursor:pointer;color:var(--ink2);font-size:17px;display:flex;align-items:center;justify-content:center}
.recdr .rx:hover{background:rgba(31,31,29,.07)}
.recdr .rb{flex:1;overflow:auto;padding:6px 22px 26px}
.recf{display:flex;gap:14px;padding:11px 0;border-bottom:1px solid var(--line);font-size:13.5px}
.recf .fk{width:132px;flex:none;color:var(--ink3)}
.recf .fv{font-weight:500;font-variant-numeric:tabular-nums}
.recdr .rfoot{padding:14px 22px;border-top:1px solid var(--line);display:flex;gap:9px}
.invhead .sect{margin:0}
.invhead .sn{font-size:13px;color:var(--ink3)}
.invhead .spacer{flex:1}
.invdiv{height:1px;background:var(--line);margin:13px 0 16px}
.fbtn2{font:inherit;font-size:13.5px;font-weight:500;padding:7px 14px;border-radius:999px;border:1px solid var(--line);
  background:var(--card);color:var(--ink2);cursor:pointer;display:inline-flex;align-items:center;gap:7px;white-space:nowrap;flex:none}
.fbtn2:hover{border-color:var(--line2);color:var(--ink)}
.fbtn2.on{background:var(--ink);border-color:var(--ink);color:#fff}
.fbtn2 .ti{font-size:15px;color:inherit}
.fbtn2 .cnt{font-size:12px;color:var(--ink3);font-variant-numeric:tabular-nums}
.fbtn2.on .cnt{color:rgba(255,255,255,.7)}
#cPop .fr .ck{margin-left:auto;font-size:16px;color:var(--greend);opacity:0}
#cPop .fr.on .ck{opacity:1}
#cPop .fr{color:var(--ink3)}
#cPop .fr.on{color:var(--ink)}
.fpop{position:absolute;right:0;top:calc(100% + 9px);width:290px;background:var(--card);border:1px solid var(--line2);
  border-radius:14px;box-shadow:0 14px 40px rgba(31,31,29,.16);padding:7px;z-index:40;display:none}
.fpop.on{display:block}
.fpop .fg{font-size:10.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--ink3);padding:9px 11px 4px}
.fpop .fr{display:flex;align-items:center;gap:10px;padding:8px 11px;border-radius:9px;font-size:14px;cursor:pointer}
.fpop .fr:hover{background:#F1EFE8}
.fpop .fr .v{margin-left:auto;font-size:12.5px;color:var(--ink3)}
.fpop .fr .ti{font-size:16px;color:var(--ink3)}
.fpop .fsep{height:1px;background:var(--line);margin:6px 8px}
`;

function n(x){ return typeof x==='number' ? x.toLocaleString() : x; }

window.gyEsPage = function(cfg){
  var es = ES[cfg.es], D = cfg;
  var st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st);

  var host = document.getElementById('espage');
  var pipe = D.pipeline;
  var max = Math.max(pipe.future, pipe.available, pipe.reserved, pipe.sold, 1);
  function tile(lab,v,cls){
    return '<div class="stt '+(cls||'')+'"><div class="lab">'+lab+'</div>'
      +'<div class="val">'+n(v)+'<small>'+es.unit+'</small></div>'
      +(cls?'':'<div class="gauge"><div class="gfill" style="height:'+Math.round(v/max*100)+'%"></div></div>')+'</div>';
  }

  var h = '';
  /* ── cover ── */
  h += '<div class="cover" style="--pc:'+es.c+';--pc-dark:'+es.dark+';--pc-lite:'+es.lite+';--pc-bg:'+es.bg+'">'
    +'<div class="coverin">'
      +'<div class="covacts">'
        +'<button class="covbtn" onclick="toast(\'Export this inventory as a spreadsheet\')"><i class="ti ti-download"></i> Export</button>'
        +'<button class="covbtn solid" onclick="toast(\'Add '+es.short+' to a project\')"><i class="ti ti-plus"></i> Add</button>'
      +'</div>'
      +'<div class="covtop"><span class="covico"><i class="ti '+es.icon+'"></i></span>'
        +'<div><div class="coveyebrow">Ecosystem service &middot; '+(D.scope==='portfolio'?'Portfolio':D.programme)+'</div>'
        +'<div class="covname">'+es.name+'</div></div></div>'
      +'<div class="covstats">'+D.cover.map(function(c){
          return '<div class="cs"><div class="csv">'+c[0]+'<small>'+(c[2]||es.unit)+'</small></div><div class="csl">'+c[1]+'</div></div>';
        }).join('')+'</div>'
    +'</div></div>';

  h += '<div class="wrap" style="padding-top:22px;--pc:'+es.c+';--pc-dark:'+es.dark+';--pc-lite:'+es.lite+';--pc-bg:'+es.bg+'">';

  /* ── overview ── */
  h += '<div class="sectrow"><div class="sect">Overview</div>'
     + '<span class="act" onclick="location.href=\''+D.allServicesHref+'\'">All services</span></div>'
     + '<div class="srow">'
       + tile('Future',pipe.future) + tile('Available',pipe.available)
       + tile('Reserved',pipe.reserved) + tile('Sold',pipe.sold)
       + tile('Total planned',pipe.total,'total')
     + '</div>';

  /* the one band that differs by altitude */
  h += '<div class="card"><h3><i class="ti '+(D.scope==='portfolio'?'ti-topology-star-3':'ti-map-pin')+'"></i>'
     + D.breakdown.title + '<span class="n">'+D.breakdown.rows.length+'</span></h3>'
     + D.breakdown.rows.map(function(r){
         var t=r.f+r.a+r.r+r.s;
         function seg(v,c,lab){ return v? '<div class="bseg '+c+'" style="width:'+(v/r.max*100)+'%">'+(v/r.max>0.07?n(v):'')+'</div>':''; }
         return '<div class="brow"><span class="bn" onclick="'+(r.go?'location.href=\''+r.go+'\'':'toast(\''+r.n+' is not in this prototype yet\')')+'">'+r.n+'</span>'
           +'<div class="bbar">'+seg(r.f,'f')+seg(r.a,'a')+seg(r.r,'r')+seg(r.s,'s')+'</div>'
           +'<span class="bt">'+n(t)+' '+es.unit+'</span></div>';
       }).join('')
     + '<div class="blegend">'
       +'<span><i style="background:color-mix(in srgb, var(--pc) 22%, #fff)"></i>Future</span>'
       +'<span><i style="background:color-mix(in srgb, var(--pc) 45%, #fff)"></i>Available</span>'
       +'<span><i style="background:color-mix(in srgb, var(--pc) 70%, #fff)"></i>Reserved</span>'
       +'<span><i style="background:var(--pc)"></i>Sold</span></div></div>';

  h += '<div class="two">'
     + '<div class="card"><h3><i class="ti ti-map-2"></i>'+D.map.title+'<span class="n">'+D.map.points.length+'</span></h3>'
       + '<div id="esMap"></div><div class="maplab"><span><i></i>Circle size is planned '+es.unit+'</span></div></div>'
     + '<div class="card"><h3><i class="ti ti-file-dollars"></i>Open deals<span class="n">'+D.deals.note+'</span></h3>'
       + D.deals.rows.map(function(d){
           return '<div class="drow"><span class="dn">'+d[0]+'</span><span class="du">'+d[1]+'</span>'
             +'<span class="dst '+d[3]+'">'+d[2]+'</span><span class="dv">'+d[4]+'</span></div>';
         }).join('') + '</div>'
     + '</div>';

  h += '<div class="two">'
     + '<div class="card"><h3><i class="ti ti-alert-triangle"></i>Risk<span class="n">'+D.risk.note+'</span></h3>'
       + D.risk.rows.map(function(r){ return '<div class="rrow"><span class="rd '+r[0]+'"></span><div><div class="rt">'+r[1]+'</div><div class="rx">'+r[2]+'</div></div></div>'; }).join('') + '</div>'
     + '<div class="card"><h3><i class="ti ti-chart-arrows-vertical"></i>Delivery<span class="n">next 12 months</span></h3>'
       + D.delivery.map(function(r){ return '<div class="rrow"><span class="rd '+r[0]+'"></span><div><div class="rt">'+r[1]+'</div><div class="rx">'+r[2]+'</div></div></div>'; }).join('') + '</div>'
     + '</div>';

  /* ── inventory ── */
  h += '<div class="invhead"><div class="sect">Inventory</div><span class="sn">'+n(D.table.total)+' records</span>'
     + '<span class="spacer"></span>'
     + '<button class="fbtn2" onclick="toast(\'Search this inventory\')"><i class="ti ti-search"></i> Search</button>'
     + '<button class="fbtn2" id="fBtn" onclick="gyFPop()"><i class="ti ti-adjustments-horizontal"></i> Filters</button>'
     + '<button class="fbtn2" id="cBtn" onclick="gyCPop(event)"><i class="ti ti-columns-3"></i> Columns</button>'
     + '<button class="fbtn2" onclick="location.href=\''+D.allInventoryHref+'\'"><i class="ti ti-layout-list"></i> All inventory</button>'
     + '<div class="fpop" id="cPop"><div class="fg">Show columns</div>'
       + D.table.cols.map(function(c,i){
           return '<div class="fr" id="col'+i+'" onclick="gyColTog('+i+',event)">'+c+'<i class="ti ti-check ck"></i></div>';
         }).join('')
     + '</div>'
     + '<div class="fpop" id="fPop">'
       + D.filters.map(function(g){
           return '<div class="fg">'+g[0]+'</div>' + g[1].map(function(f){
             return '<div class="fr" onclick="toast(\'Filter by '+f[1].toLowerCase()+'\')"><i class="ti '+f[0]+'"></i>'+f[1]+'<span class="v">'+f[2]+'</span></div>';
           }).join('');
         }).join('<div class="fsep"></div>')
     + '</div></div><div class="invdiv"></div>';

  function cell(v,i){
    if(i===D.table.badge) return '<td><span class="badge '+({Available:'avail',Sold:'sold',Future:'future',Reserved:'future'}[v]||'future')+'">'+v+'</span></td>';
    return '<td>'+(v===0?'<span class="dash">&mdash;</span>':n(v))+'</td>';
  }
  function tr(r,ri,g){
    return '<tr class="rec'+(g!=null?' g'+g:'')+'" onclick="gyRec('+ri+')"><td><span class="chkbox"></span></td>'
      + r.map(cell).join('') + '</tr>';
  }
  var body='';
  var G = D.table.group;
  if(G){
    /* one band per value of the grouped column, with the band's own total */
    var keys=[], byk={};
    D.table.rows.forEach(function(r,ri){
      var k=r[G.col]; if(!byk[k]){ byk[k]=[]; keys.push(k); } byk[k].push(ri);
    });
    keys.sort();
    keys.forEach(function(k,gi){
      var sum=byk[k].reduce(function(t,ri){ var v=D.table.rows[ri][G.sum]; return t+(typeof v==='number'?v:0); },0);
      body += '<tr class="grp" onclick="gyGrp('+gi+',event)"><td colspan="'+(D.table.cols.length+1)+'">'
        + (G.label||D.table.cols[G.col]) + ' <span class="gv">' + k + '</span>'
        + '<span class="gs">' + n(sum) + ' ' + (G.suffix||es.unit) + '</span>'
        + '<i class="ti ti-chevron-down"></i></td></tr>';
      byk[k].forEach(function(ri){ body += tr(D.table.rows[ri],ri,gi); });
    });
  } else {
    body = D.table.rows.map(function(r,ri){ return tr(r,ri,null); }).join('');
  }
  h += '<div class="tblwrap"><table class="dtbl" id="esTbl"><thead><tr><th><span class="chkbox"></span></th>'
     + D.table.cols.map(function(c){return '<th>'+c+'</th>';}).join('')
     + '</tr></thead><tbody>' + body + '</tbody></table></div>'
     + '<div class="pager"><span>Page 1 of '+Math.ceil(D.table.total/20)+'</span>'
     + '<button class="pgbtn"><i class="ti ti-chevrons-left"></i></button><button class="pgbtn"><i class="ti ti-chevron-left"></i></button>'
     + '<button class="pgbtn" onclick="toast(\'Paging is not wired up in this prototype\')"><i class="ti ti-chevron-right"></i></button>'
     + '<button class="pgbtn" onclick="toast(\'Paging is not wired up in this prototype\')"><i class="ti ti-chevrons-right"></i></button></div>';

  h += '</div>';
  h += '<div class="recov" id="recOv" onclick="gyRecClose()"></div>'
     + '<aside class="recdr" id="recDr" style="--pc:'+es.c+';--pc-bg:'+es.bg+';--pc-dark:'+es.dark+'">'
     + '<div class="rh"><button class="rx" onclick="gyRecClose()"><i class="ti ti-x"></i></button>'
     + '<div class="rk" id="recK"></div><div class="rn" id="recN"></div></div>'
     + '<div class="rb" id="recB"></div>'
     + '<div class="rfoot"><button class="fbtn2" onclick="toast(\'Evidence is not in this prototype yet\')"><i class="ti ti-paperclip"></i> Evidence</button>'
     + '<button class="fbtn2" onclick="toast(\'Deals are not in this prototype yet\')"><i class="ti ti-file-dollar"></i> Add to deal</button></div></aside>';
  host.outerHTML = h;
  window.__GYES = {D:D, es:es, hidden:(D.table.hide||[]).slice()};
  gyColApply();

  /* map */
  var mh=document.getElementById('esMap');
  if(mh){
    if(!window.L){ mh.innerHTML='<div style="padding:26px;color:var(--ink3);font-size:13px">Map needs a connection</div>'; }
    else{
      var map=L.map(mh,{scrollWheelZoom:false, zoomSnap:0.25, attributionControl:false});
      L.tileLayer(window.gyCartoTiles?gyCartoTiles('light_all'):'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        {subdomains:'abcd',maxZoom:19}).addTo(map);
      var g=[];
      D.map.points.forEach(function(x){
        var m=L.circleMarker(x.ll,{radius:7+Math.sqrt(x.u)*(D.map.scale||1.5),color:es.c,weight:2,fillColor:es.c,fillOpacity:.28}).addTo(map);
        m.bindTooltip(x.n+' &middot; '+n(x.u)+' '+es.unit,{direction:'top'});
        m.on('click',function(){ x.go ? location.href=x.go : toast(x.n+' is not in this prototype yet'); });
        g.push(x.ll);
      });
      map.fitBounds(L.latLngBounds(g).pad(D.map.pad||0.35));
    }
  }
};

window.gyGrp = function(gi,e){
  if(e) e.stopPropagation();
  var head=document.querySelectorAll('#esTbl tr.grp')[gi];
  var on=head.classList.toggle('closed');
  [].forEach.call(document.querySelectorAll('#esTbl tr.g'+gi),function(r){ r.classList.toggle('hid',on); });
};
window.gyCPop = function(e){
  if(e) e.stopPropagation();
  var el=document.getElementById('cPop'), b=document.getElementById('cBtn');
  document.getElementById('fPop').classList.remove('on');
  document.getElementById('fBtn').classList.remove('on');
  b.classList.toggle('on', el.classList.toggle('on'));
};
window.gyColTog = function(i,e){
  if(e) e.stopPropagation();
  var st=window.__GYES, k=st.hidden.indexOf(i);
  if(k<0) st.hidden.push(i); else st.hidden.splice(k,1);
  gyColApply();
};
/* hidden columns are a view setting, so they are painted, never rebuilt */
window.gyColApply = function(){
  var st=window.__GYES; if(!st) return;
  var tbl=document.getElementById('esTbl'); if(!tbl) return;
  st.D.table.cols.forEach(function(c,i){
    var off = st.hidden.indexOf(i)>=0;
    var row=document.getElementById('col'+i); if(row) row.classList.toggle('on',!off);
    [].forEach.call(tbl.querySelectorAll('tr:not(.grp) > *:nth-child('+(i+2)+')'),function(cel){
      cel.style.display = off ? 'none' : '';
    });
  });
  var b=document.getElementById('cBtn');
  if(b) b.innerHTML='<i class="ti ti-columns-3"></i> Columns <span class="cnt">'
    +(st.D.table.cols.length-st.hidden.length)+' of '+st.D.table.cols.length+'</span>';
};
window.gyRec = function(ri){
  var st=window.__GYES, D=st.D, r=D.table.rows[ri];
  document.getElementById('recK').textContent = st.es.name;
  document.getElementById('recN').textContent = r[0];
  document.getElementById('recB').innerHTML = D.table.cols.map(function(c,i){
    if(i===0) return '';
    var v=r[i]; if(v===0||v===''||v==null) v='&mdash;';
    else if(typeof v==='number') v=v.toLocaleString();
    return '<div class="recf"><span class="fk">'+c+'</span><span class="fv">'+v+'</span></div>';
  }).join('');
  document.getElementById('recOv').classList.add('on');
  document.getElementById('recDr').classList.add('on');
};
window.gyRecClose = function(){
  document.getElementById('recOv').classList.remove('on');
  document.getElementById('recDr').classList.remove('on');
};
window.gyFPop = function(){
  var el=document.getElementById('fPop'), b=document.getElementById('fBtn');
  var on=el.classList.toggle('on'); b.classList.toggle('on',on);
};
document.addEventListener('click',function(e){
  if(!e.target.closest('#cPop')&&!e.target.closest('#cBtn')){
    var c=document.getElementById('cPop');
    if(c){ c.classList.remove('on'); var cb=document.getElementById('cBtn'); if(cb) cb.classList.remove('on'); }
  }
  if(e.target.closest('#fPop')||e.target.closest('#fBtn'))return;
  var el=document.getElementById('fPop'); if(el){el.classList.remove('on');var b=document.getElementById('fBtn');if(b)b.classList.remove('on');}
});
window.GY_ESPAGE = ES;
})();
