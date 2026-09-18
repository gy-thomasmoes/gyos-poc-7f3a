/* gy-select.js - the one dropdown field in GYOS.

   A native <select> renders the operating system's own list: system fonts,
   system blue highlight, system corner radius. It ignores every token in the
   design system, which is why no GYOS page uses one. This is a button plus a
   popover, self contained and styled from the same palette, so it can be
   dropped onto a standalone page that does not load gy-nav.js.

     gySel(key, cfg) registers the field and returns its markup, so a page
     that rebuilds its HTML from a string keeps working unchanged.

       cfg.options  array of 'label' or [value, label], or a function
                    returning one, read fresh on every open so a dependent
                    list needs no re-registering
       cfg.value    current value
       cfg.placeholder shown when the value is empty, and offered as the
                    first row so a choice can be cleared
       cfg.onchange fn(value), called after the value is set
       cfg.id       renders a hidden input with this id, so existing
                    document.getElementById(id).value reads keep working
       cfg.width    any CSS width; cfg.cls extra classes

   Reads and writes from outside: gySelGet(key), gySelSet(key, value). */
(function(){
  if(window.gySel) return;

  var CSS = ''
    + '.gysel{position:relative;display:inline-flex;vertical-align:middle;min-width:0}'
    + '.gyselbtn{display:flex;align-items:center;gap:9px;width:100%;border:1px solid #DED8CA;'
    +   'background:#fff;border-radius:10px;padding:9px 11px;font-family:inherit;font-size:13.5px;'
    +   'color:#1A0C12;cursor:pointer;text-align:left;min-width:0;-webkit-font-smoothing:antialiased}'
    + '.gyselbtn:hover,.gyselbtn.on{border-color:#A79E8D}'
    + '.gyselbtn.ph .gysellab{color:#A79E8D}'
    + '.gysellab{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
    + '.gyselbtn .gyselcar{flex:none;width:9px;height:9px;border-right:1.5px solid #A79E8D;'
    +   'border-bottom:1.5px solid #A79E8D;transform:rotate(45deg) translateY(-2px)}'
    + '.gyselpop{position:fixed;min-width:232px;max-height:340px;overflow:auto;background:#fff;'
    +   'border:1px solid #DED8CA;border-radius:13px;box-shadow:0 16px 44px rgba(31,31,29,.18);'
    +   'padding:6px;z-index:1600;font-family:inherit}'
    + '.gyselrow{display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:9px;'
    +   'font-size:14px;color:#1A0C12;cursor:pointer;white-space:nowrap;-webkit-font-smoothing:antialiased}'
    + '.gyselrow:hover{background:#F1EFE8}'
    + '.gyselrow .tick{flex:none;width:14px;color:#628147;font-weight:700;text-align:center}'
    + '.gyselrow.sel{font-weight:600}';
  var st = document.createElement('style');
  st.textContent = CSS;
  (document.head || document.documentElement).appendChild(st);

  var REG = {}, open = null;

  function list(cfg){
    var l = (typeof cfg.options === 'function') ? cfg.options() : (cfg.options || []);
    return l.map(function(o){
      return (o instanceof Array) ? [String(o[0]), String(o[1])] : [String(o), String(o)];
    });
  }
  function labelFor(cfg, val){
    var l = list(cfg);
    for(var i=0;i<l.length;i++) if(l[i][0] === val) return l[i][1];
    return '';
  }
  function esc(v){
    return String(v).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
  }
  function valueOf(host){
    var cfg = REG[host.getAttribute('data-k')] || {};
    var hid = cfg.id ? document.getElementById(cfg.id) : null;
    if(hid) return hid.value;
    return (cfg.value === undefined || cfg.value === null) ? '' : String(cfg.value);
  }
  /* idempotent, so a repaint is not itself a change */
  function paint(host){
    var cfg = REG[host.getAttribute('data-k')]; if(!cfg) return;
    var val = valueOf(host), lab = val ? (labelFor(cfg, val) || val) : '';
    var btn = host.querySelector('.gyselbtn'), el = btn && btn.querySelector('.gysellab');
    if(!el) return;
    var want = lab || cfg.placeholder || 'Select';
    if(el.textContent !== want) el.textContent = want;
    if(btn.classList.contains('ph') !== !lab) btn.classList.toggle('ph', !lab);
  }
  function set(host, val){
    var cfg = REG[host.getAttribute('data-k')]; if(!cfg) return;
    cfg.value = val;
    var hid = cfg.id ? document.getElementById(cfg.id) : null;
    if(hid) hid.value = val;
    paint(host);
    if(cfg.onchange) cfg.onchange(val);
  }

  /* One stable handler, always unbound on close. A row calls stopPropagation
     when picked, so a self-removing per-open closure never fires and never
     unbinds; the stale listener then closes the next field the instant it
     opens, and every field works exactly once. */
  function onDoc(e){
    if(open && e && e.target && open.contains(e.target)) return;
    close();
  }
  function close(){
    document.removeEventListener('click', onDoc);
    if(!open) return;
    if(open._btn) open._btn.classList.remove('on');
    if(open.parentNode) open.parentNode.removeChild(open);
    open = null;
  }
  function place(pop, btn){
    var b = btn.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight;
    pop.style.minWidth = Math.max(b.width, 232) + 'px';
    w = pop.offsetWidth;
    var left = (b.left + w > window.innerWidth - 12) ? b.right - w : b.left;
    var top = b.bottom + 6;
    if(top + h > window.innerHeight - 8) top = Math.max(8, b.top - h - 6);
    pop.style.left = Math.max(8, left) + 'px';
    pop.style.top = top + 'px';
  }

  window.gySelOpen = function(btn){
    var host = btn.parentNode, cfg = REG[host.getAttribute('data-k')];
    var same = open && open._btn === btn;
    close();
    if(same || !cfg) return;

    var pop = document.createElement('div');
    pop.className = 'gyselpop';
    pop._btn = btn;
    var cur = valueOf(host);

    function row(val, label){
      var r = document.createElement('div');
      r.className = 'gyselrow' + (val === cur ? ' sel' : '');
      var t = document.createElement('span');
      t.className = 'tick';
      t.textContent = val === cur ? '✓' : '';
      r.appendChild(t);
      r.appendChild(document.createTextNode(label));
      r.onclick = function(e){ e.stopPropagation(); close(); set(host, val); };
      pop.appendChild(r);
    }
    if(cfg.placeholder) row('', cfg.placeholder);
    list(cfg).forEach(function(o){ row(o[0], o[1]); });

    document.body.appendChild(pop);
    place(pop, btn);
    btn.classList.add('on');
    open = pop;
    setTimeout(function(){ document.addEventListener('click', onDoc); }, 0);
  };

  var queued = false;
  function soon(){
    if(queued) return;
    queued = true;
    var run = function(){ queued = false; gySelPaint(); };
    if(window.requestAnimationFrame) requestAnimationFrame(run); else setTimeout(run, 0);
  }

  window.gySel = function(key, cfg){
    cfg = cfg || {};
    REG[key] = cfg;
    soon();
    var val = (cfg.value === undefined || cfg.value === null) ? '' : String(cfg.value);
    var lab = val ? (labelFor(cfg, val) || val) : '';
    return '<span class="gysel' + (cfg.cls ? ' ' + cfg.cls : '') + '" data-k="' + esc(key) + '"'
      + (cfg.width ? ' style="width:' + esc(cfg.width) + '"' : '') + '>'
      + '<button type="button" class="gyselbtn' + (lab ? '' : ' ph') + '" onclick="gySelOpen(this)">'
      + '<span class="gysellab"></span><span class="gyselcar"></span></button>'
      + (cfg.id ? '<input type="hidden" id="' + esc(cfg.id) + '" value="' + esc(val) + '">' : '')
      + '</span>';
  };
  window.gySelPaint = function(root){
    [].forEach.call((root || document).querySelectorAll('.gysel'), paint);
  };
  window.gySelGet = function(key){
    var host = document.querySelector('.gysel[data-k="' + key + '"]');
    return host ? valueOf(host) : '';
  };
  window.gySelSet = function(key, val){
    var host = document.querySelector('.gysel[data-k="' + key + '"]');
    if(host) set(host, val);
  };
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });
  window.addEventListener('resize', close);
})();
