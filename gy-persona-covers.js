/* gy-persona-covers.js, the buyer persona covers, drawn as inline SVG in the
   same grammar as the rule book covers. All personas share one dark blue
   (set per record in gy-personas.js); the figure motif, a circle over a
   dome, is what says "a person" rather than "a market".
   Needs gy-es-covers.js loaded first for the primitives and tone helpers.
   Exposes window.gyPersonaCover(p, idx, href). Ships no CSS, deliberately. */
(function(){

function pad(n){ return (n<10?'0':'')+n; }

/* up to three lines of about twenty characters, breaking on spaces */
function wrap3(name){
  var w = name.split(' '), lines = [], cur = '';
  w.forEach(function(x){
    if((cur+' '+x).trim().length > 20 && cur){ lines.push(cur); cur = x; }
    else cur = (cur+' '+x).trim();
  });
  if(cur) lines.push(cur);
  return lines.slice(0,3);
}

/* a person: head over shoulders */
function fig(P, x, y, s){
  return P.circ(x, y, s*0.27) + P.dome(x - s/2, y + s*0.44, s, s*0.56);
}

var ART = {
  c1:  function(P){ return fig(P,92,186,92) + P.bars(176,146,92,3,10,22) + P.rays(222,300,40,16) + P.dots(36,346,4,9,13); },
  c2a: function(P){ return P.grid(36,140,112,70,3,2) + fig(P,222,186,82) + P.bars(36,246,112,3,9,20) + P.dots(176,336,4,9,13); },
  c2b: function(P){ return fig(P,80,178,72) + fig(P,220,178,72) + P.wave(36,292,228,2,10) + P.dots(36,350,6,8,10); },
  c2c: function(P){ return fig(P,150,176,84) + P.lens(150,300,156,34) + P.dots(60,350,6,8,10); },
  c3:  function(P){ return fig(P,92,196,92) + P.rays(222,168,44,16) + P.grid(166,250,104,52,4,2) + P.dots(166,336,4,9,13); },
  c4:  function(P){ return P.wave(36,150,112,3,11) + fig(P,222,186,82) + P.grid(36,246,112,70,3,2) + P.dots(176,336,4,9,13); },
  b1:  function(P){ return fig(P,92,186,92) + P.lens(212,172,92,34) + P.grid(160,232,110,70,3,3) + P.dots(36,340,5,9,12); },
  b2:  function(P){ return P.diag(36,140,110,110) + fig(P,216,186,82) + P.bars(36,276,110,3,9,20) + P.dots(176,336,4,9,13); },
  b3:  function(P){ return fig(P,150,176,84) + P.grid(36,292,234,56,5,1) + P.dots(36,370,6,8,10); }
};

window.gyPersonaCover = function(p, idx, href){
  var P = window.gyEsPrims, esc = window.gyEsEsc;
  var art = (ART[p.id] || ART.c1)(P);
  var jc = window.gyEsJacketCol(p.col);
  var F = 'Manner, Spectral, Georgia, serif';
  var lines = wrap3(p.short || p.name);
  var svg = '<svg class="escover" viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg" role="img" '
    + 'aria-label="'+esc(p.name)+', buyer persona '+esc(p.code)+'">'
    + '<rect width="300" height="420" fill="'+jc+'"/>'
    + '<g fill="none" stroke="#F6F1E8" stroke-opacity=".82" stroke-width="2.2" stroke-linecap="square">'+art+'</g>'
    + '<rect x="243" y="20" width="37" height="37" fill="#F6F1E8"/>'
    + '<text x="261.5" y="45" text-anchor="middle" font-family="'+F+'" '
      + 'font-size="17" font-weight="600" fill="'+jc+'">GY</text>'
    + '<text x="26" y="40" font-family="'+F+'" font-size="12.5" font-weight="600" '
      + 'letter-spacing="1.1" fill="#F6F1E8" opacity=".72">PERSONA '+esc(p.code.toUpperCase())+'</text>'
    + lines.map(function(ln,i){
        return '<text x="26" y="'+(72+i*25)+'" font-family="'+F+'" font-size="22" '
          + 'font-weight="600" fill="#F6F1E8">'+esc(ln)+'</text>'; }).join('')
    + '<text x="26" y="'+(97+(lines.length-1)*25)+'" font-family="'+F+'" font-size="15" '
      + 'font-style="italic" fill="#F6F1E8" opacity=".86">'+esc((p.outcome==='bng'?'BNG':'Carbon')+' · '+p.role)+'</text>'
    + '<text x="150" y="398" text-anchor="middle" font-family="'+F+'" font-size="14" '
      + 'fill="#F6F1E8" opacity=".78">Great Yellow Press</text>'
    + '</svg>';
  return href ? '<a class="escoverlink" href="'+href+'">'+svg+'</a>' : svg;
};

})();
