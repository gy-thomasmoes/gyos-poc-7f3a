/* gy-versions.js
   A corner pill that steps between the versions of one sketch. Include it after
   gy-nav.js on every page of a set; the set is the list below and nothing else
   on the page changes. The current page is filled, the rest are links.
   Keys: [ previous version, ] next version (ignored while typing).
   Styles ship with the script. Pages not in any set get nothing. */
(function(){
  var SETS = [
    { name: 'Deliverable', pages: [
      ['deliverable-sketch-v3.html',      'v3'],
      ['deliverable-sketch-v4.html',      'v4'],
      ['deliverable-sketch-v4-doc.html',  'v4 doc'],
      ['deliverable-sketch-v4-chat.html', 'v4 chat'],
      ['deliverable-sketch-v5.html',      'v5'],
      ['deliverable-sketch-v6.html',      'v6'],
      ['deliverable-sketch-v7.html',      'v7']
    ]}
  ];

  var here = (location.pathname.split('/').pop() || '').toLowerCase();
  var set = null, idx = -1;
  for(var s = 0; s < SETS.length && !set; s++){
    for(var p = 0; p < SETS[s].pages.length; p++){
      if(SETS[s].pages[p][0].toLowerCase() === here){ set = SETS[s]; idx = p; break; }
    }
  }
  if(!set) return;

  var css = ''
    +'.gy-vers{position:fixed;right:14px;bottom:14px;z-index:1250;display:flex;align-items:center;gap:1px;padding:3px;'
    +'background:rgba(255,255,255,.92);border:1px solid #E3E1DB;border-radius:999px;box-shadow:0 4px 16px rgba(31,31,29,.08);'
    +'font-family:var(--sans,-apple-system,system-ui,"Inter","Segoe UI",sans-serif);font-size:11px;line-height:1;'
    +'opacity:.55;transition:opacity .15s;-webkit-font-smoothing:antialiased}'
    +'.gy-vers:hover,.gy-vers:focus-within{opacity:1}'
    +'.gy-vers a{display:block;padding:5px 8px;border-radius:999px;color:#7A7770;text-decoration:none;white-space:nowrap}'
    +'.gy-vers a:hover{color:#1F1F1D;background:#F3EFE1}'
    +'.gy-vers a.on{color:#1F1F1D;background:#ECE7DB;font-weight:600}'
    +'@media print{.gy-vers{display:none}}';

  function mount(){
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var el = document.createElement('nav'); el.className = 'gy-vers'; el.setAttribute('aria-label', set.name + ' sketch versions');
    el.innerHTML = set.pages.map(function(pg, i){
      return '<a href="' + pg[0] + '"' + (i === idx ? ' class="on" aria-current="page"' : '') + ' title="' + pg[0] + '">' + pg[1] + '</a>';
    }).join('');
    document.body.appendChild(el);
  }
  if(document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

  document.addEventListener('keydown', function(e){
    if(e.key !== '[' && e.key !== ']') return;
    if(e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target, tag = ((t && t.tagName) || '').toLowerCase();
    if(tag === 'input' || tag === 'textarea' || tag === 'select' || (t && t.isContentEditable)) return;
    var n = idx + (e.key === ']' ? 1 : -1);
    if(n < 0 || n >= set.pages.length) return;
    location.href = set.pages[n][0];
  });
})();
