/* gy-persona-press.js, one buyer persona set as a press page: a hero panel in
   the outcome colour, then a paper reading page. Same CSS as the rule books
   (gy-es-press.js injects it, exposed as window.gyPressCSS), same five type
   sizes, same block buttons. Reads window.GY_PERSONAS and GY_PERSONA_NOTES. */
(function(){

var EXTRA = `
.pr .strip.s8{grid-template-columns:repeat(8,1fr)}
@media(max-width:900px){.pr .strip.s8{grid-template-columns:repeat(4,1fr)}}
.pr .kw{font-size:19px;line-height:1.7;margin-top:8px;max-width:34em;font-style:italic;color:var(--ink2)}
`;

function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }
function pad(n){ return (n<10?'0':'')+n; }
var OUT = {carbon:'Carbon', bng:'Biodiversity Net Gain'};

function injectExtra(){
  if(document.getElementById('gypersonaCSS')) return;
  var st = document.createElement('style');
  st.id = 'gypersonaCSS'; st.textContent = EXTRA;
  document.head.appendChild(st);
}

window.gyPersonaPage = function(id, mountId){
  window.gyPressCSS(); injectExtra();
  var B = window.GY_PERSONAS || [], N = window.GY_PERSONA_NOTES || {};
  var idx = -1;
  B.forEach(function(x,i){ if(x.id===id) idx = i; });
  if(idx < 0){ document.getElementById(mountId).outerHTML =
    '<div class="pr"><div class="doc"><div class="docin">Out of print.</div></div></div>'; return; }
  var D = B[idx], notes = N[D.outcome] || {};

  function f(label, body){ return body ? '<div class="lbl">'+label+'</div><div class="dp">'+body+'</div>' : ''; }
  function head(t, s){ return '<div class="dh">'+t+'</div>'+(s?'<div class="dsub">'+s+'</div>':''); }
  function list(items){ return (items&&items.length) ? '<ul class="lst" style="margin-top:12px">'
    + items.map(function(r){ return '<li>'+r+'</li>'; }).join('') + '</ul>' : ''; }
  function section(t, s, body){ return body ? '<div class="sep"></div><div class="col">'+head(t,s)+body+'</div>' : ''; }
  function quote(q, by){ return q ? '<div class="qs" style="columns:1;margin-top:22px"><div class="q">&#8220;'+q+'&#8221;'
    + '<cite>'+(by||'From the validation sessions')+'</cite></div></div>' : ''; }

  var outName = OUT[D.outcome] || D.outcome;
  var h = '<div class="pr" style="--pc:'+D.col+';--field:'+window.gyEsFieldCol(D.col)+'">';

  /* the hero panel, same shape as a rule book */
  h += '<section class="panel"><div class="panelin"><div class="pgrid">'
    + '<div>'+window.gyPersonaCover(D, idx)+'</div>'
    + '<div>'
      + '<div class="ptitle">'+D.name+'</div>'
      + '<div class="pauthor">'+outName+' buyer persona '+D.code+', '+D.role.toLowerCase()+'</div>'
      + '<div class="phr"></div>'
      + '<div class="pbody">'+D.who+'</div>'
      + '<div class="btns">'
        + '<button class="btn" onclick="location.href=\'hive-mind-library.html#personas\'">All personas</button>'
        + '<button class="btn" onclick="location.href=\'es-press.html?es='+D.es+'\'">Rule book</button>'
        + '<button class="btn" onclick="window.open(\''+D.source.url+'\',\'_blank\')">Source in Notion</button>'
      + '</div>'
      + '<div class="btnwide"><button class="btn" onclick="document.querySelector(\'.doc\').scrollIntoView({behavior:\'smooth\'})">'
        + '<span>'+D.priority+', '+D.track+'</span><span class="arw">&#8595;</span></button></div>'
    + '</div></div></div></section>';

  /* the reading page */
  h += '<div class="doc"><div class="docin">';

  h += '<div class="col">' + head('Who they are') + '<div class="dp">'+D.who+'</div></div>';

  h += section('What they are trying to solve', '', D.solving ? '<div class="dp">'+D.solving+'</div>' + quote(D.quote, D.quoteby) : '');
  if(!D.solving && D.quote) h += section('In their words', '', quote(D.quote, D.quoteby));

  h += section('Why they matter to Great Yellow', '', D.why ? '<div class="dp">'+D.why+'</div>' : '');
  h += section('Decision drivers', 'What has to be true before they say yes', list(D.drivers));
  h += section('Messaging', 'What we lead with', list(D.messaging));
  h += section('Keywords', 'For posts, decks and one-pagers', (D.keywords&&D.keywords.length) ? '<div class="kw">'+D.keywords.join(' · ')+'</div>' : '');
  h += section('Call to action', '', D.cta ? '<div class="dp">'+D.cta+'</div>' : '');
  h += section('Examples', '', D.examples ? '<div class="dp">'+D.examples+'</div>' : '');
  h += section('Note', '', D.note ? '<div class="dp">'+D.note+'</div>' : '');

  /* the shared notes for this outcome */
  if(D.outcome === 'carbon'){
    h += section('How carbon is segmented', '', '<div class="dp">'+notes.method+'</div>' + list(notes.messages));
    if(notes.roles) h += section(notes.roles.title, 'Who has to say yes inside the buyer',
      '<div class="dp">'+notes.roles.intro+'</div>' + list(notes.roles.list) + f('Sequencing', notes.roles.seq));
    if(notes.dynamics) h += '<div class="sep"></div><div class="col">' + head('Cross-cutting dynamics', 'What runs across every carbon segment')
      + notes.dynamics.map(function(d){ return f(d.t, d.a) + '<div class="dp"><i>Our stance.</i> '+d.s+'</div>'; }).join('') + '</div>';
  } else {
    h += section('How BNG is segmented', '', '<div class="dp">'+notes.method+'</div>' + f('Twin track', notes.tracks));
    h += section('Materials', 'What is being made for these personas', list(notes.materials));
  }

  h += '<div class="sep"></div><div class="col">' + head('Details') + '</div>'
    + '<table class="tb">'
    + '<tr><td>Outcome</td><td>'+outName+'</td></tr>'
    + '<tr><td>Segment</td><td>'+D.code+', '+D.name+'</td></tr>'
    + '<tr><td>Role</td><td>'+D.role+'</td></tr>'
    + '<tr><td>Priority</td><td>'+D.priority+'</td></tr>'
    + '<tr><td>Track</td><td>'+D.track+'</td></tr>'
    + '<tr><td>Owner</td><td>Millie Davey, Marketing</td></tr>'
    + '<tr><td>Source</td><td><a href="'+D.source.url+'" target="_blank" rel="noopener" style="color:inherit">'+D.source.label+'</a></td></tr>'
    + '<tr><td>Refreshed</td><td>'+D.refreshed+'</td></tr>'
    + '<tr><td>Walked through</td><td>7 September 2026, buyer segmentation walkthrough</td></tr>'
    + '<tr><td>Series</td><td>Number '+pad(idx+1)+' of '+pad(B.length)+'</td></tr>'
    + '</table>';

  h += '</div></div>';

  /* the footer strip */
  var others = B.filter(function(x){ return x.id !== D.id; });
  h += '<div class="foot"><div class="footin">'
    + '<div class="ptitle" style="font-size:33px">Also in the series</div>'
    + '<div class="strip s8">' + others.map(function(x){
        var i = B.indexOf(x);
        return '<div>'+window.gyPersonaCover(x, i, 'persona.html?p='+x.id)
             + '<div class="sn">'+x.name+'</div></div>';
      }).join('') + '</div>'
    + '</div></div>';

  h += '</div>';
  document.getElementById(mountId).outerHTML = h;
};

})();
