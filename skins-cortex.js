/* Verbatim from teaser/index.html (itself verbatim from the app's js/08): the 52
   name-coded materials and the name hash, plus Codex's Cortex material for the
   dopamine egg. Do not edit here; edit the source and re-extract. */
var CARD_SKINS = [
 /* ── tier one ─────────────────────────────────────────────── */
 {n:'Solar Flare', sk1:'rgba(255,170,0,1)', sk2:'rgba(255,230,120,1)', sk3:'rgba(255,120,0,1)', sk4:'rgba(255,200,60,.95)',
  plat:'.22', face:'linear-gradient(165deg,#3a2003,#1d0f01)', mark:'rgba(255,248,232,.97)', ink:'rgba(255,240,214,.9)'},
 {n:'Voltage',     sk1:'rgba(255,238,0,1)',   sk2:'rgba(190,255,60,.95)', sk3:'rgba(255,196,0,1)',  sk4:'rgba(230,255,120,.85)',
  plat:'.16', face:'linear-gradient(165deg,#1d1e04,#0d0e02)', mark:'rgba(255,253,230,.95)', ink:'rgba(252,255,214,.9)'},
 {n:'Obsidian Violet', sk1:'rgba(120,40,220,.9)', sk2:'rgba(40,10,90,.9)', sk3:'rgba(170,80,255,.75)', sk4:'rgba(20,6,40,.95)',
  plat:'.02', face:'linear-gradient(165deg,#08040e,#030106)', mark:'rgba(240,230,255,.95)', ink:'rgba(226,208,255,.8)'},
 {n:'Gold', sk1:'rgba(255,208,60,1)', sk2:'rgba(255,246,200,1)', sk3:'rgba(220,160,20,1)', sk4:'rgba(255,228,130,.95)',
  plat:'.52', face:'linear-gradient(165deg,#imagined,#000)'.replace('#imagined','#4a3608').replace('#000','#241a03'),
  mark:'rgba(40,28,2,.92)', ink:'rgba(58,42,6,.8)'},
 {n:'Matte Black', sk1:'none',sk2:'none',sk3:'none',sk4:'none',
  plat:'0', face:'linear-gradient(168deg,#1c1d20 0%,#141518 55%,#101113 100%)',
  mark:'rgba(244,246,250,.97)', ink:'rgba(226,231,240,.75)', cls:'flat',
  edge:'rgba(255,255,255,.92)', halo:'rgba(238,244,255,.40)', lift:'rgba(255,255,255,.05)'},
 {n:'Matte White', sk1:'none',sk2:'none',sk3:'none',sk4:'none',
  plat:'0', face:'linear-gradient(168deg,#f0f1f2 0%,#e7e8e9 55%,#dfe0e2 100%)',
  mark:'rgba(62,67,74,.95)', ink:'rgba(52,57,64,.7)', cls:'flat',
  edge:'rgba(255,255,255,.95)', halo:'rgba(240,244,252,.42)', lift:'rgba(255,255,255,.5)'},
 {n:'Pure Glass', sk1:'rgba(255,255,255,.5)', sk2:'rgba(255,255,255,.35)', sk3:'rgba(210,240,255,.45)', sk4:'rgba(255,255,255,.3)',
  plat:'.30', face:'linear-gradient(165deg,rgba(232,244,252,.55),rgba(206,226,242,.42))',
  mark:'rgba(96,120,140,.75)', ink:'rgba(48,72,92,.65)', cls:'glass',
  edge:'rgba(255,255,255,1)', halo:'rgba(210,238,255,.5)'},
 {n:'Void', sk1:'none',sk2:'none',sk3:'none',sk4:'none',
  plat:'0', face:'#000000',
  mark:'rgba(244,246,250,.97)', ink:'rgba(150,155,164,.62)', cls:'flat void',
  edge:'rgba(0,0,0,1)', halo:'rgba(0,0,0,1)', haloR:'70px', lift:'rgba(0,0,0,0)'},
 {n:'Emerald',     sk1:'rgba(0,220,130,1)',   sk2:'rgba(120,255,200,.9)', sk3:'rgba(0,150,90,1)',   sk4:'rgba(40,255,160,.85)',
  plat:'.12', face:'linear-gradient(165deg,#03150e,#010806)', mark:'rgba(232,255,246,.95)', ink:'rgba(214,255,238,.9)'},
 {n:'Crimson',     sk1:'rgba(255,30,70,1)',   sk2:'rgba(255,110,120,.9)', sk3:'rgba(150,0,40,1)',   sk4:'rgba(255,70,90,.9)',
  plat:'.10', face:'linear-gradient(165deg,#1c0308,#0b0103)', mark:'rgba(255,228,232,.95)', ink:'rgba(255,220,226,.85)'},
 {n:'Ice', sk1:'rgba(60,190,255,1)', sk2:'rgba(220,248,255,.9)', sk3:'rgba(0,140,220,.95)', sk4:'rgba(140,225,255,.9)',
  plat:'.46', face:'linear-gradient(165deg,#dff1fb,#c9e5f5)', mark:'rgba(20,58,80,.9)', ink:'rgba(14,48,68,.78)'},
 {n:'Magenta',     sk1:'rgba(255,0,170,1)',   sk2:'rgba(255,120,215,.9)', sk3:'rgba(170,0,140,1)',  sk4:'rgba(255,70,190,.9)',
  plat:'.10', face:'linear-gradient(165deg,#1a0316,#0a010a)', mark:'rgba(255,224,246,.95)', ink:'rgba(255,214,242,.85)'},
 /* ── tier two, behind View more ───────────────────────────── */
 {n:'Cobalt', sk1:'rgba(0,120,255,1)', sk2:'rgba(120,200,255,.95)', sk3:'rgba(0,60,220,1)', sk4:'rgba(60,160,255,.95)',
  plat:'.28', face:'linear-gradient(165deg,#031a4d,#010c26)', mark:'rgba(232,242,255,.96)', ink:'rgba(220,234,255,.88)'},
 {n:'Copper', sk1:'rgba(212,106,58,1)', sk2:'rgba(150,64,30,.95)', sk3:'rgba(240,150,100,.85)', sk4:'rgba(120,50,24,.9)',
  plat:'.34', face:'linear-gradient(165deg,#4a2415,#2a130a)', mark:'rgba(255,236,222,.95)', ink:'rgba(255,226,208,.85)'},
 {n:'Jade Gold',   sk1:'rgba(0,200,160,1)',   sk2:'rgba(255,215,90,.85)', sk3:'rgba(0,140,120,1)',  sk4:'rgba(120,255,210,.8)',
  plat:'.16', face:'linear-gradient(165deg,#04140f,#010706)', mark:'rgba(224,255,244,.95)', ink:'rgba(210,255,238,.85)'},
 {n:'Aurora',      sk1:'rgba(0,255,190,.95)', sk2:'rgba(150,90,255,.85)', sk3:'rgba(40,200,255,.9)', sk4:'rgba(255,90,200,.7)',
  plat:'.08', face:'linear-gradient(165deg,#050b12,#02040a)', mark:'rgba(238,246,255,.95)', ink:'rgba(222,238,255,.85)'},
 {n:'Sunset', sk1:'rgba(255,150,40,1)', sk2:'rgba(255,110,120,.95)', sk3:'rgba(255,200,90,.9)', sk4:'rgba(230,70,90,.9)',
  plat:'.40', face:'linear-gradient(165deg,#40130c,#1d0705)', mark:'rgba(255,244,234,.97)', ink:'rgba(255,232,216,.9)'},
 {n:'Sapphire', sk1:'rgba(20,40,180,1)', sk2:'rgba(60,20,150,.9)', sk3:'rgba(0,20,120,1)', sk4:'rgba(40,60,200,.9)',
  plat:'.05', face:'linear-gradient(165deg,#050726,#020310)', mark:'rgba(226,232,255,.95)', ink:'rgba(210,220,255,.82)'},
 {n:'Bone', sk1:'none',sk2:'none',sk3:'none',sk4:'none',
  plat:'0', face:'linear-gradient(168deg,#f4f0e8 0%,#ece7dc 55%,#e3ddd0 100%)',
  mark:'rgba(78,71,60,.94)', ink:'rgba(66,60,50,.72)', cls:'flat',
  edge:'rgba(255,253,246,.9)', halo:'rgba(246,238,222,.38)', lift:'rgba(255,255,255,.45)'},
 {n:'Toxic',       sk1:'rgba(180,255,0,1)',   sk2:'rgba(0,255,140,.9)', sk3:'rgba(120,200,0,1)',  sk4:'rgba(220,255,80,.85)',
  plat:'.10', face:'linear-gradient(165deg,#0f1603,#050801)', mark:'rgba(246,255,224,.95)', ink:'rgba(238,255,200,.9)'},
 {n:'Titanium', sk1:'rgba(226,232,240,.9)', sk2:'rgba(255,255,255,.95)', sk3:'rgba(150,162,178,.85)', sk4:'rgba(200,210,224,.8)',
  plat:'.80', face:'linear-gradient(165deg,#c9cfd8,#b3bac4)', mark:'rgba(52,58,66,.92)', ink:'rgba(44,50,58,.75)', cls:'glass'},
 {n:'Blush',       sk1:'rgba(255,180,200,.95)', sk2:'rgba(255,225,235,.9)', sk3:'rgba(240,140,175,.9)', sk4:'rgba(255,205,220,.85)',
  plat:'.58', face:'linear-gradient(165deg,#fbeef2,#f4e2e8)', mark:'#6b4a55', ink:'rgba(70,44,52,.75)'},
 {n:'Ultraviolet', sk1:'rgba(160,60,255,1)', sk2:'rgba(220,160,255,1)', sk3:'rgba(120,0,255,1)', sk4:'rgba(190,110,255,.95)',
  plat:'.30', face:'linear-gradient(165deg,#1d0640,#0c0220)', mark:'rgba(248,240,255,.97)', ink:'rgba(240,224,255,.9)'},
 {n:'Matte Clay', sk1:'none',sk2:'none',sk3:'none',sk4:'none', plat:'0',
  face:'linear-gradient(168deg,#6d3a2c,#5c3024 55%,#4c261c)', mark:'rgba(255,238,230,.95)', ink:'rgba(252,230,220,.75)',
  cls:'flat', edge:'rgba(255,226,212,.42)', halo:'rgba(220,140,110,.16)'},
 {n:'Matte Forest', sk1:'none',sk2:'none',sk3:'none',sk4:'none', plat:'0',
  face:'linear-gradient(168deg,#14311f,#0e2617 55%,#091c11)', mark:'rgba(236,250,240,.96)', ink:'rgba(222,242,228,.7)',
  cls:'flat', edge:'rgba(180,232,196,.4)', halo:'rgba(100,200,140,.14)'},
 {n:'Matte Navy', sk1:'none',sk2:'none',sk3:'none',sk4:'none', plat:'0',
  face:'linear-gradient(168deg,#3a5a94,#2f4a7d 55%,#264066)', mark:'rgba(240,246,255,.96)', ink:'rgba(228,238,255,.78)',
  cls:'flat', edge:'rgba(226,238,255,.6)', halo:'rgba(150,190,255,.24)'},
 {n:'Matte Sand', sk1:'none',sk2:'none',sk3:'none',sk4:'none',
  plat:'0', face:'linear-gradient(168deg,#dccBa8 0%,#d2c09a 55%,#c7b48d 100%)',
  mark:'rgba(52,44,30,.92)', ink:'rgba(48,40,26,.72)', cls:'flat',
  edge:'rgba(255,250,238,.7)', halo:'rgba(244,228,196,.3)', lift:'rgba(255,255,255,.28)'},
 {n:'Midnight',    sk1:'rgba(30,60,140,.9)',  sk2:'rgba(70,110,190,.8)', sk3:'rgba(10,25,70,.9)', sk4:'rgba(50,90,170,.8)',
  plat:'.08', face:'linear-gradient(165deg,#060a16,#02030a)', mark:'rgba(226,234,250,.92)', ink:'rgba(212,224,246,.8)'},
 /* ── tier three: 20 more ──────────────────────────────────── */
 {n:'Nebula', sk1:'rgba(80,40,200,1)', sk2:'rgba(30,14,70,.98)', sk3:'rgba(210,60,255,.85)', sk4:'rgba(20,10,50,.98)',
  plat:'.03', face:'linear-gradient(165deg,#07051a,#02010a)', mark:'rgba(238,232,255,.96)', ink:'rgba(220,208,255,.8)'},
 {n:'Oil Slick', sk1:'rgba(0,190,140,.95)', sk2:'rgba(180,140,40,.85)', sk3:'rgba(60,40,140,.8)', sk4:'rgba(0,140,150,.85)',
  plat:'.04', face:'linear-gradient(165deg,#080a09,#020303)', mark:'rgba(236,244,240,.96)', ink:'rgba(214,232,226,.8)'},
 {n:'Blood Orange', sk1:'rgba(255,40,10,1)', sk2:'rgba(190,0,30,.95)', sk3:'rgba(255,90,0,.9)', sk4:'rgba(140,0,20,.95)',
  plat:'.06', face:'linear-gradient(165deg,#160203,#070001)', mark:'rgba(255,232,226,.96)', ink:'rgba(255,214,206,.85)'},
 {n:'Moss', sk1:'none',sk2:'none',sk3:'none',sk4:'none', plat:'0',
  face:'linear-gradient(168deg,#8a9a52,#7a8946 55%,#6c7a3c)', mark:'rgba(30,34,16,.9)', ink:'rgba(34,38,18,.75)',
  cls:'flat', edge:'rgba(244,250,220,.6)', halo:'rgba(200,222,140,.24)'},
 {n:'Porcelain', sk1:'rgba(255,255,255,.95)', sk2:'rgba(255,255,255,1)', sk3:'rgba(250,250,252,.9)', sk4:'rgba(255,255,255,.9)',
  plat:'.99', face:'linear-gradient(165deg,#ffffff,#fafbfc)', mark:'rgba(120,126,134,.85)', ink:'rgba(88,94,104,.7)'},
 {n:'Graphite', sk1:'none',sk2:'none',sk3:'none',sk4:'none', plat:'0',
  face:'linear-gradient(168deg,#8a9098,#787e86 55%,#686e76)', mark:'rgba(28,32,38,.9)', ink:'rgba(30,34,40,.72)',
  cls:'flat', edge:'rgba(255,255,255,.75)', halo:'rgba(226,232,240,.3)', lift:'rgba(255,255,255,.18)'},
 {n:'Neon Noir', sk1:'rgba(255,0,120,1)', sk2:'rgba(0,0,0,0)', sk3:'rgba(0,240,255,1)', sk4:'rgba(0,0,0,0)',
  plat:'0', face:'linear-gradient(165deg,#050506,#010102)', mark:'rgba(255,255,255,.98)', ink:'rgba(255,220,240,.9)',
  edge:'rgba(255,60,160,.5)', halo:'rgba(255,0,120,.2)'},
 {n:'Champagne', sk1:'rgba(226,192,120,.95)', sk2:'rgba(250,234,196,.9)', sk3:'rgba(198,158,86,.9)', sk4:'rgba(238,214,160,.85)',
  plat:'.44', face:'linear-gradient(165deg,#efe2c8,#e2d0ad)', mark:'rgba(84,66,38,.9)', ink:'rgba(70,54,30,.75)'},
 {n:'Storm', sk1:'rgba(40,60,90,.95)', sk2:'rgba(90,120,160,.6)', sk3:'rgba(10,18,32,.95)', sk4:'rgba(60,86,124,.7)',
  plat:'.04', face:'linear-gradient(165deg,#0d1219,#05070b)', mark:'rgba(226,236,250,.95)', ink:'rgba(204,220,242,.75)'},
 {n:'Coral', sk1:'rgba(255,140,120,.95)', sk2:'rgba(255,210,196,.9)', sk3:'rgba(255,110,90,.85)', sk4:'rgba(255,180,164,.85)',
  plat:'.62', face:'linear-gradient(165deg,#ffeae4,#ffd9cf)', mark:'rgba(120,54,42,.9)', ink:'rgba(102,44,34,.75)'},
 {n:'Deep Sea', sk1:'rgba(0,180,170,.95)', sk2:'rgba(0,90,110,.9)', sk3:'rgba(0,230,200,.7)', sk4:'rgba(0,60,80,.95)',
  plat:'.04', face:'linear-gradient(165deg,#01100f,#000606)', mark:'rgba(220,248,244,.95)', ink:'rgba(200,242,236,.8)'},
 {n:'Terracotta', sk1:'none',sk2:'none',sk3:'none',sk4:'none', plat:'0',
  face:'linear-gradient(168deg,#c9764f,#b56541 55%,#a25835)', mark:'rgba(255,246,240,.96)', ink:'rgba(255,238,230,.8)',
  cls:'flat', edge:'rgba(255,242,232,.65)', halo:'rgba(255,196,160,.26)'},
 {n:'Prism', sk1:'rgba(255,0,80,.95)', sk2:'rgba(255,230,0,.9)', sk3:'rgba(0,220,120,.9)', sk4:'rgba(60,90,255,.95)',
  plat:'.30', face:'linear-gradient(165deg,#fbfcff,#eef1f7)', mark:'rgba(50,56,68,.9)', ink:'rgba(36,42,54,.78)', cls:'glass'},
 {n:'Ink', sk1:'none',sk2:'none',sk3:'none',sk4:'none', plat:'0',
  face:'linear-gradient(168deg,#0d1426,#08101e 55%,#050a15)', mark:'rgba(232,240,255,.96)', ink:'rgba(206,222,250,.72)',
  cls:'flat', edge:'rgba(150,190,255,.4)', halo:'rgba(90,140,255,.16)'},
 {n:'Peach',       sk1:'rgba(255,180,140,.95)', sk2:'rgba(255,224,200,.9)', sk3:'rgba(255,140,170,.85)', sk4:'rgba(255,200,170,.85)',
  plat:'.6', face:'linear-gradient(165deg,#fdf0e8,#f8e2d6)', mark:'rgba(110,72,58,.9)', ink:'rgba(90,58,46,.72)'},
 {n:'Volcanic', sk1:'rgba(255,90,0,1)', sk2:'rgba(40,10,6,.95)', sk3:'rgba(255,180,40,.85)', sk4:'rgba(20,6,4,.98)',
  plat:'0', face:'linear-gradient(168deg,#0d0403,#050101 60%,#020101)', mark:'rgba(255,226,200,.95)', ink:'rgba(255,200,164,.8)',
  edge:'rgba(255,140,60,.45)', halo:'rgba(255,110,20,.22)'},
 {n:'Mint', sk1:'rgba(80,255,200,1)', sk2:'rgba(200,255,236,.9)', sk3:'rgba(0,200,150,.95)', sk4:'rgba(140,255,220,.85)',
  plat:'.40', face:'linear-gradient(165deg,#d8f7ec,#c2eddd)', mark:'rgba(16,72,56,.9)', ink:'rgba(12,62,48,.78)'},
 {n:'Oxblood',     sk1:'none',sk2:'none',sk3:'none',sk4:'none', plat:'0',
  face:'linear-gradient(168deg,#5c1a20,#4a1419 55%,#3c0f14)', mark:'rgba(255,238,238,.96)', ink:'rgba(250,224,224,.75)',
  cls:'flat', edge:'rgba(255,224,224,.5)', halo:'rgba(255,150,150,.18)'},
 {n:'Solar Wind', sk1:'rgba(255,236,180,.95)', sk2:'rgba(255,180,90,.9)', sk3:'rgba(255,255,240,.8)', sk4:'rgba(255,210,140,.85)',
  plat:'.50', face:'linear-gradient(165deg,#2a2013,#140f08)', mark:'rgba(255,250,240,.97)', ink:'rgba(255,244,224,.88)'},
 {n:'Pearl', sk1:'rgba(255,170,215,.85)', sk2:'rgba(170,225,255,.85)', sk3:'rgba(255,240,170,.8)', sk4:'rgba(200,180,255,.85)',
  plat:'.52', face:'linear-gradient(165deg,#fbf7ff,#eef4fb)', mark:'rgba(92,84,106,.9)', ink:'rgba(70,62,86,.72)', cls:'glass'},
 {n:'Thermal',     sk1:'rgba(30,60,255,1)', sk2:'rgba(0,220,255,.95)', sk3:'rgba(255,230,0,1)', sk4:'rgba(255,110,0,1)',
  plat:'.06', face:'linear-gradient(165deg,#04061a,#01020a)', mark:'rgba(240,246,255,.97)', ink:'rgba(226,238,255,.88)',
  edge:'rgba(120,180,255,.5)', halo:'rgba(60,120,255,.26)'},
 {n:'Heat Rise',   sk1:'rgba(255,150,0,1)', sk2:'rgba(255,60,0,.9)', sk3:'rgba(255,230,140,.85)', sk4:'rgba(10,6,4,.98)',
  plat:'0', face:'linear-gradient(0deg,#f08a10 -18%,#3a1200 16%,#0a0503 44%,#050303 100%)',
  mark:'rgba(255,248,240,.97)', ink:'rgba(255,232,204,.85)', edge:'rgba(255,180,90,.32)', halo:'rgba(255,140,20,.2)'},
 {n:'Density',     sk1:'rgba(60,40,255,1)', sk2:'rgba(20,10,120,.95)', sk3:'rgba(120,220,255,.95)', sk4:'rgba(10,4,60,.98)',
  plat:'.04', face:'linear-gradient(165deg,#04021a,#010008)', mark:'rgba(232,240,255,.96)', ink:'rgba(190,214,255,.85)',
  edge:'rgba(120,160,255,.45)', halo:'rgba(60,60,255,.22)'},
 {n:'Elevation',   sk1:'rgba(255,190,90,.9)', sk2:'rgba(150,200,235,.85)', sk3:'rgba(120,205,175,.85)', sk4:'rgba(240,120,110,.8)',
  plat:'.46', face:'linear-gradient(165deg,#e9e6dc,#dcd8cc)', mark:'rgba(70,74,86,.9)', ink:'rgba(56,60,72,.78)'},
];
function _skHash(s){ let h=2166136261; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; }
function skinForName(name){
  const h=_skHash(String(name||'memento').trim().toLowerCase());
  const sk=CARD_SKINS[h % CARD_SKINS.length];
  return Object.assign({}, sk, { rot: ((h>>>7) % 22) - 11 });
}

const CORTEX_VERT=`attribute vec2 position; varying vec2 uv; void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const CORTEX_FRAG=`precision highp float;
varying vec2 uv; uniform float time; uniform float kind; uniform float darkness;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 r=mat2(.8,.6,-.6,.8);for(int i=0;i<4;i++){v+=a*noise(p);p=r*p*2.03+13.1;a*=.5;}return v;}
vec3 spectrum(float t){
 t=clamp(t,0.,1.);vec3 b=vec3(.025,.12,.96),c=vec3(0.,.8,1.),g=vec3(0.,.94,.39),y=vec3(.81,.9,.08),o=vec3(1.,.35,.05),m=vec3(.89,.055,.60),v=vec3(.45,.055,.88);
 if(t<.16)return mix(b,c,t/.16);if(t<.34)return mix(c,g,(t-.16)/.18);if(t<.49)return mix(g,y,(t-.34)/.15);if(t<.65)return mix(y,o,(t-.49)/.16);if(t<.83)return mix(o,m,(t-.65)/.18);return mix(m,v,(t-.83)/.17);
}
void main(){
 vec2 p=vec2((uv.x-.5)*1.52,(uv.y-.5)*2.);float t=time*.095;
 vec2 q=vec2(fbm(p*2.2+vec2(t*.6,0.)),fbm(p*2.2+vec2(4.8,-t*.45)));
 vec2 w=p+1.05*(q-.5);float f=fbm(w*4.0+vec2(t*.22,-t*.3));
 float small=fbm(w*12.3+2.1);float light=0.,color=0.;
 if(kind<-.5){float a=fbm(p*1.6+vec2(t,4.));gl_FragColor=vec4(vec3(.24,.31,.37)*smoothstep(.18,.8,a),1.);return;}
 if(kind<.5){
  float lobes=max(1.-length((w-vec2(-.36,.27))*vec2(1.28,1.02)),1.-length((w-vec2(.47,-.43))*vec2(1.35,1.12)));
  float fissure=abs(w.x+.31*sin(w.y*3.+t*.22));float tissue=lobes+f*.40-.16;
  light=smoothstep(.24+darkness*.23,.52+darkness*.2,tissue)*smoothstep(.028,.14,fissure);
  color=fract(f*2.5+small*.32);light*=.7+.3*smoothstep(.17,.6,small);
 }else if(kind<1.5){
  float edge=max(abs(p.x)/.76,abs(p.y));float wave=.07*sin(p.y*8.+q.x*5.+t)+.05*sin(p.x*8.-t);
  light=smoothstep(.57+darkness*.25,.85+darkness*.07,edge+wave);
  color=fract(f*1.6+atan(p.y,p.x)*.23+t*.05);light*=.65+.35*sin(f*18.)*sin(f*18.);
 }else if(kind<2.5){
  float river=abs(w.x*.95+w.y*.6+.15*sin(w.y*4.+t));
  light=(1.-smoothstep(.10+(1.-darkness)*.10,.24+(1.-darkness)*.18,river))*(.68+.32*small);
  color=fract(f*1.8+w.y*.20);float echo=exp(-abs(river-.42)*75.);light=max(light,echo*.65);
 }else if(kind<3.5){
  float a=length((w-vec2(-.40,.60))*vec2(1.45,1.4));float b=length((w-vec2(.48,.05))*vec2(1.7,1.5));float c=length((w-vec2(-.24,-.73))*vec2(1.55,1.8));
  float pools=min(a,min(b,c))-.10*sin(f*28.);light=1.-smoothstep(.26+(1.-darkness)*.12,.54+(1.-darkness)*.14,pools);
  color=fract(f*2.1+small*.25);light*=.75+.25*small;
 }else{
  float bands=sin((w.x*.6+w.y*.2+f*.65)*32.+t*.32);float region=1.-smoothstep(.52,.85,length(w*vec2(1.,.8)));
  light=pow(max(0.,bands),2.+darkness*5.)*region;color=fract(f*1.7+w.y*.26+.13);light*=.85;
 }
 light=smoothstep(.055,.91,light);vec3 rgb=spectrum(color)*light;
 float grain=(hash(gl_FragCoord.xy)-.5)*.07;rgb*=1.+grain;
 float boundary=min(min(uv.x,1.-uv.x),min(uv.y,1.-uv.y));float rim=exp(-boundary*270.);rgb+=spectrum(fract(uv.y*.7+uv.x*.5+t*.04))*.7*rim;
 gl_FragColor=vec4(clamp(rgb,0.,1.),1.);
}`;
function createCortex(canvas){
 const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power',preserveDrawingBuffer:true});if(!gl)throw Error('WebGL unavailable');
 const shaders=[];function compile(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));shaders.push(s);return s;}
 const program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,CORTEX_VERT));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,CORTEX_FRAG));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const pos=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
 const uniforms={time:gl.getUniformLocation(program,'time'),kind:gl.getUniformLocation(program,'kind'),darkness:gl.getUniformLocation(program,'darkness')};
 let state={variant:0,speed:2.5,paused:true,dim:.5},elapsed=7,last=0,frame,dirty=true,visible=true,destroyed=false;
 const resize=new ResizeObserver(()=>{const r=canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.max(1,Math.round(r.width*ratio));canvas.height=Math.max(1,Math.round(r.height*ratio));dirty=true});resize.observe(canvas);
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;dirty=true});observer.observe(canvas);
 /* the floor reflection is drawn from the real frame, a few times a second */
 let mirrors=[],ticks=0;
 function tick(now){if(destroyed)return;frame=requestAnimationFrame(tick);if(document.hidden||!visible){last=now;return}if(now-last<32&&!dirty)return;const dt=Math.min((now-last)/1000,.05);last=now;if(!state.paused){elapsed+=dt*state.speed;dirty=true}if(!dirty)return;dirty=false;gl.viewport(0,0,canvas.width,canvas.height);gl.uniform1f(uniforms.time,elapsed);gl.uniform1f(uniforms.kind,state.variant);gl.uniform1f(uniforms.darkness,state.dim);gl.drawArrays(gl.TRIANGLES,0,6);
  if(mirrors.length&&(ticks++%4)===0&&canvas.width){for(const m of mirrors){m.ctx.drawImage(canvas,0,0,m.c.width,m.c.height)}}}
 frame=requestAnimationFrame(tick);
 return{update(next){state={...state,...next};dirty=true},mirrorTo(c,w,h){c.width=w;c.height=h;mirrors.push({c:c,ctx:c.getContext('2d')})},destroy(){destroyed=true;cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();gl.deleteBuffer(buffer);gl.deleteProgram(program);shaders.forEach(s=>gl.deleteShader(s));const lose=gl.getExtension('WEBGL_lose_context');if(lose)lose.loseContext()}};
}
