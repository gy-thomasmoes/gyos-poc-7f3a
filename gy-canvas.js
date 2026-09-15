/* ── Great Yellow — shared Deliverable canvas behaviours ─────────────────
   One script, every Deliverable / workflow. Load it right after gy-nav.js:

     <script>window.GYNAV={active:'...',arts:'...'};</script>
     <script src="gy-nav.js"></script>
     <script src="gy-canvas.js"></script>

   Owns the shell behaviours that are identical across every Deliverable and
   are NOT already handled by gy-nav.js (which injects the sidebar and wires
   the resize grip):
     · toast(msg)      — bottom-centre toast
     · toggleNav()     — collapse / expand the sidebar (persists gyNavHid)
     · nav-hide restore + hover-peek zone

   Canvas panning, zooming, tool switching and the content-rendering engine
   stay in each Deliverable's own <script> because they read that
   Deliverable's coordinate + data state (Z, TOOL, DRAGGED, nodes, steps).
   The look of all four zones is fully shared via gy-canvas.css; this file
   shares the shell behaviour on top of it.
──────────────────────────────────────────────────────────────────────── */
(function(){
  if(window.__gyCanvasInit) return;   /* guard against double-include */
  window.__gyCanvasInit = true;

  /* Toast — transient message, auto-hides. */
  window.toast = function(msg){
    var t = document.getElementById('toast'); if(!t) return;
    t.textContent = msg; t.style.display = 'block';
    clearTimeout(t._h); t._h = setTimeout(function(){ t.style.display = 'none'; }, 3600);
  };

  /* Collapse / expand the sidebar. Width + hidden state persist so the nav
     looks the same on every page. */
  window.toggleNav = function(){
    document.body.classList.remove('navpeek');
    var hid = document.body.classList.toggle('navhid');
    var b = document.getElementById('expandBtn');
    if(b) b.style.display = hid ? 'flex' : 'none';
    if(hid){
      document.body.style.setProperty('--nav','0px');
    } else {
      var saved = parseInt(localStorage.getItem('gyNavW')||'',10);
      document.body.style.setProperty('--nav',(saved||264)+'px');
    }
    try{ localStorage.setItem('gyNavHid', hid ? '1' : '0'); }catch(e){}
  };

  function init(){
    /* Restore collapsed sidebar from last visit. */
    try{
      if(localStorage.getItem('gyNavHid')==='1'){
        document.body.classList.add('navhid');
        var b = document.getElementById('expandBtn'); if(b) b.style.display='flex';
        document.body.style.setProperty('--nav','0px');
      }
    }catch(e){}

    /* Hover-peek: slide the sidebar back in when the mouse hits the left edge
       while it is collapsed. */
    if(!document.querySelector('.snavpeek')){
      var zone = document.createElement('div');
      zone.className = 'snavpeek';
      document.body.appendChild(zone);
      zone.addEventListener('mouseenter', function(){
        if(document.body.classList.contains('navhid')) document.body.classList.add('navpeek');
      });
      var nav = document.querySelector('.snav');
      if(nav) nav.addEventListener('mouseleave', function(){ document.body.classList.remove('navpeek'); });
      zone.addEventListener('mouseleave', function(e){
        if(!(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.snav')))
          document.body.classList.remove('navpeek');
      });
    }
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
