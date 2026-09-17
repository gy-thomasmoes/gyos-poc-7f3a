/* gy-es-covers.js , the ecosystem service book covers, drawn as inline SVG.
   One file so the Hive Mind Library and the press pages draw the same artwork.
   Needs only {id, name, type, col} on the record it is given.
   Exposes window.gyEsCover(d, idx, href) and the two tone helpers. */
(function(){

function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }
function pad(n){ return (n<10?'0':'')+n; }

/* deterministic colour mixing, so nothing depends on color-mix support */
function hx(h){ return [1,3,5].map(function(i){ return parseInt(h.slice(i,i+2),16); }); }
function mixhex(a,b,p){ var A=hx(a), B=hx(b);
  return '#'+A.map(function(v,i){
    return Math.round(v*p+B[i]*(1-p)).toString(16).replace(/^(.)$/,'0$1'); }).join(''); }

/* the two tones every book is built from: a vivid jacket, a deeper field behind it.
   Both ratios are measured, not chosen by eye. Cream #F6F1E8 clears 3.6:1 on every
   jacket and each jacket clears 1.9:1 against its own field. Changing either number
   breaks one of those, so re-measure before you do. */
window.gyEsJacketCol = function(c){ return mixhex(c,'#241608',0.85); };
window.gyEsFieldCol  = function(c){ return mixhex(c,'#0F0904',0.45); };

/* the cover title wraps to two lines rather than truncating */
function wrapTitle(name){
  if(name.length <= 20) return [name];
  var w = name.split(' '), best = 0, mid = name.length/2, i, len = 0, diff, bd = 1e9;
  for(i=0;i<w.length-1;i++){ len += w[i].length + 1; diff = Math.abs(len - mid);
    if(diff < bd){ bd = diff; best = i; } }
  return [w.slice(0,best+1).join(' '), w.slice(best+1).join(' ')];
}

/* ── stroke only primitives on a 300 x 420 stage ── */
var P = {
  circ: function(x,y,r){ return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'"/>'; },
  dome: function(x,y,w,h){ var r=w/2;
    return '<path d="M'+(x)+' '+(y+h)+' L'+(x)+' '+(y+r)+' A'+r+' '+r+' 0 0 1 '+(x+w)+' '+(y+r)+' L'+(x+w)+' '+(y+h)+'"/>'; },
  grid: function(x,y,w,h,c,r){ var s='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'"/>', i;
    for(i=1;i<c;i++) s+='<line x1="'+(x+w/c*i)+'" y1="'+y+'" x2="'+(x+w/c*i)+'" y2="'+(y+h)+'"/>';
    for(i=1;i<r;i++) s+='<line x1="'+x+'" y1="'+(y+h/r*i)+'" x2="'+(x+w)+'" y2="'+(y+h/r*i)+'"/>';
    return s; },
  rays: function(x,y,r,n){ var s='',i,a;
    for(i=0;i<n;i++){ a=Math.PI*2*i/n;
      s+='<line x1="'+(x+Math.cos(a)*r*.22).toFixed(1)+'" y1="'+(y+Math.sin(a)*r*.22).toFixed(1)
        +'" x2="'+(x+Math.cos(a)*r).toFixed(1)+'" y2="'+(y+Math.sin(a)*r).toFixed(1)+'"/>'; }
    return s; },
  lens: function(x,y,w,h){ return '<path d="M'+(x-w/2)+' '+y+' Q'+x+' '+(y-h)+' '+(x+w/2)+' '+y
    +' Q'+x+' '+(y+h)+' '+(x-w/2)+' '+y+'Z"/>'; },
  diag: function(x,y,w,h){ return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'"/>'
    +'<line x1="'+x+'" y1="'+(y+h)+'" x2="'+(x+w)+'" y2="'+y+'"/>'; },
  dots: function(x,y,n,r,gap){ var s='',i;
    for(i=0;i<n;i++) s+='<circle cx="'+(x+i*(r*2+gap)+r)+'" cy="'+y+'" r="'+r+'"/>';
    return s; },
  wave: function(x,y,w,n,amp){ var s='',i,seg=w/4,d,j;
    for(i=0;i<n;i++){ d='M'+x+' '+(y+i*(amp+9));
      for(j=0;j<4;j++) d+=' q'+(seg/2)+' '+((j%2?1:-1)*amp)+' '+seg+' 0';
      s+='<path d="'+d+'"/>'; }
    return s; },
  bars: function(x,y,w,n,gap,hh){ var s='',i;
    for(i=0;i<n;i++) s+='<rect x="'+x+'" y="'+(y+i*(hh+gap))+'" width="'+w+'" height="'+hh+'"/>';
    return s; }
};

/* one fixed composition per service: same grammar, different arrangement,
   the way a single illustrator would work a series */
var ART = {
  carbon: function(){ return P.rays(78,176,44,16) + P.bars(150,140,120,3,10,26)
    + P.circ(96,290,50) + P.grid(166,232,104,52,4,2) + P.dots(166,320,4,9,14); },
  bng: function(){ return P.circ(206,178,50) + P.lens(96,180,86,34)
    + P.grid(36,232,110,80,3,3) + P.dome(172,240,72,72) + P.dots(172,330,4,9,13); },
  volbio: function(){ return P.dome(52,140,84,84) + P.circ(206,178,44)
    + P.dots(40,268,5,10,12) + P.diag(160,240,110,76) + P.lens(88,318,88,26); },
  nn: function(){ return P.wave(36,152,228,3,13) + P.circ(84,248,46)
    + P.grid(152,216,118,66,3,2) + P.dots(152,318,4,9,13) + P.lens(84,330,84,24); },
  nfm: function(){ return P.diag(36,140,116,116) + P.circ(216,182,44)
    + P.wave(36,282,228,3,11) + P.dots(36,348,6,8,10); },
  wq: function(){ return P.lens(150,172,178,54) + P.circ(150,172,26)
    + P.grid(36,230,110,84,2,3) + P.wave(160,244,104,3,10) + P.dots(160,326,3,10,14); },
  rm: function(){ return P.dome(96,136,108,96) + P.wave(36,254,228,4,10)
    + P.circ(72,344,32) + P.grid(150,312,120,62,3,2); },
  scr: function(){ return P.grid(36,140,234,60,5,1) + P.circ(74,250,38)
    + P.diag(132,214,72,72) + P.bars(220,214,50,3,9,18) + P.dots(36,336,6,9,10); }
};

window.gyEsCover = function(d, idx, href){
  var art = (ART[d.id] || ART.carbon)();
  var jc = window.gyEsJacketCol(d.col);
  var F = 'Manner, Spectral, Georgia, serif';
  var svg = '<svg class="escover" viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg" role="img" '
    + 'aria-label="'+esc(d.name)+', rule book number '+pad(idx+1)+'">'
    + '<rect width="300" height="420" fill="'+jc+'"/>'
    + '<g fill="none" stroke="#F6F1E8" stroke-opacity=".82" stroke-width="2.2" stroke-linecap="square">'+art+'</g>'
    + '<rect x="243" y="20" width="37" height="37" fill="#F6F1E8"/>'
    + '<text x="261.5" y="45" text-anchor="middle" font-family="'+F+'" '
      + 'font-size="17" font-weight="600" fill="'+jc+'">GY</text>'
    + '<text x="26" y="40" font-family="'+F+'" font-size="12.5" font-weight="600" '
      + 'letter-spacing="1.1" fill="#F6F1E8" opacity=".72">RULE BOOK '+pad(idx+1)+'</text>'
    + wrapTitle(d.name).map(function(ln,i){
        return '<text x="26" y="'+(72+i*25)+'" font-family="'+F+'" font-size="22" '
          + 'font-weight="600" fill="#F6F1E8">'+esc(ln)+'</text>'; }).join('')
    + '<text x="26" y="'+(97+(wrapTitle(d.name).length-1)*25)+'" font-family="'+F+'" font-size="15" '
      + 'font-style="italic" fill="#F6F1E8" opacity=".86">'+esc(d.type||'')+'</text>'
    + '<text x="150" y="398" text-anchor="middle" font-family="'+F+'" font-size="14" '
      + 'fill="#F6F1E8" opacity=".78">Great Yellow Press</text>'
    + '</svg>';
  return href ? '<a class="escoverlink" href="'+href+'">'+svg+'</a>' : svg;
};

})();
