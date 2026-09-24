/* Memento landing engine (mockups). Shared by all three landing pages.
   - Card: the app's living-light Memento, a WebGL port of
     memento-native/src/memento/cardLightSkSL.ts (Today's light + the Caught light edge),
     with the bare M, the engraved name, smooth material morphs, and the dopamine egg
     (Codex's Cortex material, verbatim, in skins-cortex.js).
   - Sky: the app's aurora (memento-native/src/ui/ribbonSkSL.ts), recolourable.
   - Waterfall: Home's light pouring from the card (memento-native/src/home/waterfallSkSL.ts).
   - Name engine: the 52 name-coded materials (CARD_SKINS / skinForName, verbatim).
   Requires skins-cortex.js first. */
/* test hook, inert without ?hiddenpane: the preview pane throttles timers and frames while
   hidden, so this swaps in a MessageChannel frame clock for automated screenshots */
if (/[?&]hiddenpane/.test(location.search)) (function () {
  var ch = new MessageChannel(), q = [];
  ch.port1.onmessage = function () { var now = performance.now(), due = q.filter(function (x) { return now >= x.t; }); q = q.filter(function (x) { return now < x.t; }); due.forEach(function (x) { x.f(now); }); if (q.length) ch.port2.postMessage(0); };
  window.__tick = function (f, ms) { q.push({ f: f, t: performance.now() + ms }); if (q.length === 1) ch.port2.postMessage(0); };
  window.requestAnimationFrame = function (f) { window.__tick(f, 16); return 1; };
  try { Object.defineProperty(Document.prototype, 'hidden', { get: function () { return false; }, configurable: true }); } catch (e) {}
  window.__sleep = function (ms) { return new Promise(function (r) { window.__tick(r, ms); }); };
  /* swap every WebGL canvas for a still image of its current frame (screenshots only) */
  window.__freeze = function () {
    window.__thaw();
    document.querySelectorAll('canvas').forEach(function (c) {
      if (!c.width || !c.getBoundingClientRect().width) return;
      var img = document.createElement('img'); img.className = c.className + ' __frz'; img.style.cssText = c.style.cssText;
      try { img.src = c.toDataURL(); } catch (e) { return; }
      img.style.maxWidth = 'none'; c.parentNode.insertBefore(img, c.nextSibling); c.style.visibility = 'hidden'; c.__frz = img;
    });
  };
  window.__thaw = function () { document.querySelectorAll('img.__frz').forEach(function (i) { i.remove(); }); document.querySelectorAll('canvas').forEach(function (c) { c.style.visibility = ''; }); };
})();
(function (root) {
  'use strict';
  var TEST = /[?&]hiddenpane/.test(location.search);   /* keeps frames for screenshots in the hidden preview */
  var REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ASPECT = 320 / 452;            // DayCard CARD_ASPECT
  var TIME_SCALE = 2.4;              // CARD_TIME_SCALE

  /* ------------------------------------------------------------------ GL utils */
  function program(gl, vs, fs) {
    function sh(type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(s));
      return s;
    }
    var p = gl.createProgram();
    gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(p));
    gl.useProgram(p);
    var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var a = gl.getAttribLocation(p, 'a'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    var cache = {};
    return function U(n) { return n in cache ? cache[n] : (cache[n] = gl.getUniformLocation(p, n)); };
  }
  var VERT = 'attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }';

  /* ------------------------------------------------------------------ the card shader
     cardLightSkSL.ts, line for line; the only changes are GLSL ES spelling and the
     WebGL coordinate flip (Skia's fc is top-left in points, gl_FragCoord is bottom-left px). */
  var CARD_FRAG = [
    'precision highp float;',
    'uniform vec2 res; uniform float dpr; uniform vec2 card; uniform float t; uniform float kind;',
    'uniform vec4 c1; uniform vec4 c2; uniform vec4 c3; uniform vec4 c4;',
    'uniform vec3 fa; uniform vec3 fb; uniform float plat; uniform float edge; uniform float spill; uniform float fk;',
    'float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }',
    'float noise(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y); }',
    'float fbm(vec2 p){ float v = 0.0; float a = 0.5; for (int i = 0; i < 4; i++){ v += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; } return v; }',
    'vec3 screen(vec3 a, vec3 b){ return 1.0 - (1.0 - a) * (1.0 - b); }',
    'vec3 roll(vec3 acc, float k){ return 1.0 - exp(-acc * k); }',
    'float blob(vec2 uv, vec2 c, vec2 r){ vec2 d = (uv - c) / r; return exp(-dot(d, d) * 2.2); }',
    'float sdBox(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }',
    'float ribbon(vec2 uv, float ph, float wx, float cy, float sx, float sy){',
    '  vec2 q = uv - 0.5; float a = -0.26; q = vec2(q.x * cos(a) - q.y * sin(a), q.x * sin(a) + q.y * cos(a)) + 0.5;',
    '  vec2 c = vec2(0.5 + 0.40 * sin(t * wx + ph), cy + 0.08 * sin(t * wx * 1.7 + ph * 1.3));',
    '  float dx = q.x - c.x;',
    '  float dy = q.y - c.y - 0.07 * sin(q.x * 4.0 + t * 0.23 + ph) - 0.03 * sin(q.x * 9.0 - t * 0.19 + ph * 2.0);',
    '  return exp(-(dx * dx) / (sx * sx) - (dy * dy) / (sy * sy));',
    '}',
    'float breath(){ return 0.5 + 0.5 * sin(t * 0.375); }',
    'vec3 sheen(vec2 uv, float speed, float amt){',
    '  float s = dot(uv - 0.5, normalize(vec2(0.8, 0.6)));',
    '  float pos = 0.9 * sin(t * speed);',
    '  return vec3(1.0) * amt * exp(-pow((s - pos) / 0.28, 2.0));',
    '}',
    'vec3 lookLight(vec2 uv, vec3 face, vec3 C1, vec3 C2, vec3 C3, vec3 C4){',
    '  vec3 acc = C1 * 0.85 * blob(uv, vec2(0.35, 0.22), vec2(0.55, 0.42))',
    '           + C2 * 0.56 * blob(uv, vec2(0.50, 0.52), vec2(0.85, 0.70))',
    '           + C3 * 0.75 * blob(uv, vec2(0.66, 0.78), vec2(0.55, 0.45))',
    '           + C4 * 0.70 * blob(uv, vec2(0.36, 0.67), vec2(0.42, 0.34))',
    '           + C2 * 0.50 * blob(uv, vec2(0.64, 0.55), vec2(0.38, 0.32));',
    '  return screen(face, roll(acc * 0.72, 1.1));',
    '}',
    'vec3 lookMesh(vec2 uv, vec3 face, vec3 C1, vec3 C2, vec3 C3, vec3 C4){',
    '  vec2 p1 = vec2(0.24 + 0.10 * sin(t * 0.11), 0.22 + 0.08 * cos(t * 0.09));',
    '  vec2 p2 = vec2(0.78 + 0.08 * cos(t * 0.08 + 1.0), 0.36 + 0.10 * sin(t * 0.10 + 2.0));',
    '  vec2 p3 = vec2(0.70 + 0.10 * sin(t * 0.07 + 3.0), 0.82 + 0.06 * cos(t * 0.12));',
    '  vec2 p4 = vec2(0.26 + 0.08 * cos(t * 0.09 + 4.0), 0.68 + 0.10 * sin(t * 0.08 + 5.0));',
    '  vec2 k = vec2(0.72, 1.0); float s2 = 0.42 * 0.42;',
    '  float w1 = exp(-dot((uv - p1) * k, (uv - p1) * k) / s2); float w2 = exp(-dot((uv - p2) * k, (uv - p2) * k) / s2);',
    '  float w3 = exp(-dot((uv - p3) * k, (uv - p3) * k) / s2); float w4 = exp(-dot((uv - p4) * k, (uv - p4) * k) / s2);',
    '  float ws = w1 + w2 + w3 + w4 + 0.0001;',
    '  vec3 m = (C1 * w1 + C2 * w2 + C3 * w3 + C4 * w4) / ws;',
    '  vec2 l1 = vec2(0.34 + 0.16 * sin(t * 0.05), 0.30 + 0.12 * cos(t * 0.04));',
    '  vec2 l2 = vec2(0.68 + 0.14 * cos(t * 0.045 + 2.0), 0.74 + 0.10 * sin(t * 0.05 + 1.0));',
    '  float I = 0.04 + 0.96 * clamp(blob(uv, l1, vec2(0.80, 0.60)) + 0.75 * blob(uv, l2, vec2(0.74, 0.56)), 0.0, 1.0);',
    '  vec3 col = screen(face, pow(roll(m * I * 0.95, 1.1), vec3(1.15)) * (0.94 + 0.06 * breath()));',
    '  return screen(col, sheen(uv, 0.16, 0.07));',
    '}',
    'vec3 lookFrost(vec2 uv, vec3 face, vec3 C1, vec3 C2, vec3 C3, vec3 C4){',
    '  vec3 acc = C1 * 0.75 * ribbon(uv, 0.0, 0.050, 0.30, 0.66, 0.26)',
    '           + C2 * 0.45 * ribbon(uv, 4.0, 0.057, 0.55, 0.62, 0.24)',
    '           + C3 * 0.65 * ribbon(uv, 2.1, 0.041, 0.78, 0.58, 0.24);',
    '  vec3 col = screen(face, roll(acc, 1.1) * (0.92 + 0.08 * breath()));',
    '  col = screen(col, sheen(uv, 0.14, 0.05));',
    '  return col + (hash(floor(uv * vec2(480.0, 680.0))) - 0.5) * 0.022;',
    '}',
    'void main(){',
    '  vec2 size = res / dpr; vec2 fc = gl_FragCoord.xy / dpr; fc.y = size.y - fc.y;',
    '  vec2 q = fc - size * 0.5; vec2 hb = card * 0.5;',
    '  float d = sdBox(q, hb, 14.0);',
    '  float w = -d;',
    '  vec2 uv = clamp((q + hb) / card, 0.0, 1.0);',
    '  vec3 C1 = c1.rgb * c1.a; vec3 C2 = c2.rgb * c2.a; vec3 C3 = c3.rgb * c3.a; vec3 C4 = c4.rgb * c4.a;',
    '  vec2 d165 = normalize(vec2(sin(radians(165.0)), -cos(radians(165.0))));',
    '  vec3 face = mix(fa, fb, clamp(dot(uv - 0.5, vec2(d165.x, -d165.y)) + 0.5, 0.0, 1.0));',
    '  vec3 inner;',
    '  if (kind < 1.5) inner = lookLight(uv, face, C1, C2, C3, C4);',
    '  else if (kind < 2.5) inner = lookMesh(uv, face, C1, C2, C3, C4);',
    '  else inner = lookFrost(uv, face, C1, C2, C3, C4);',
    /* fk: a smooth blend into the Frost inside, so a look can morph into it instead of snapping */
    '  if (fk > 0.001 && kind < 2.5) inner = mix(inner, lookFrost(uv, face, C1, C2, C3, C4), fk);',
    '  float L = dot(inner, vec3(0.2126, 0.7152, 0.0722));',
    '  float L2 = (1.0 - exp(-L * 2.4)) / (1.0 - exp(-2.4));',
    '  inner = clamp(inner * (L2 / max(L, 0.0001)), 0.0, 1.0);',
    '  float ins = smoothstep(0.75, -0.75, d);',
    '  float il = max(max(inner.r, inner.g), inner.b);',
    '  float lightHere = smoothstep(0.10, 0.60, il - max(max(face.r, face.g), face.b) * 0.8);',
    '  float br = breath();',
    '  vec3 col = inner;',
    '  vec3 lit = clamp(inner * 2.3 + 0.05, 0.0, 1.0);',
    '  float band = smoothstep(3.2, 0.0, w) * edge;',
    '  col = mix(col, lit, band * 0.85);',
    '  col = screen(col, lit * exp(-max(w, 0.0) / 7.0) * 0.18 * edge);',
    '  float top = smoothstep(0.15, -0.95, q.y / hb.y);',
    '  col = screen(col, vec3(1.0) * smoothstep(1.1, 0.1, abs(w - 0.6)) * top * 0.45 * edge);',
    '  col += (hash(fc + fract(t)) - 0.5) * 0.02;',
    '  float od = max(d, 0.0);',
    /* spill: the app's 22pt / 8pt throw; the landing hero may widen it (spill > 1) */
    '  vec3 glow = inner * lightHere * exp(-pow(od / (22.0 * spill), 2.0)) * 0.11 * spill;',
    '  glow = screen(glow, lit * lightHere * exp(-pow(od / 8.0, 2.0)) * 0.30 * (0.85 + 0.15 * br));',
    '  glow *= edge;',
    '  float ga = clamp(max(glow.r, max(glow.g, glow.b)), 0.0, 1.0);',
    '  vec3 outC = clamp(col, 0.0, 1.0) * ins + glow * (1.0 - ins);',
    '  float outA = ins + ga * (1.0 - ins);',
    '  gl_FragColor = vec4(outC, outA);',
    '}'
  ].join('\n');

  /* ------------------------------------------------------------------ colour helpers */
  function tok(v) {
    if (!v || v === 'none') return null;
    var hex = String(v).match(/^#([0-9a-f]{6})$/i);
    if (hex) return [parseInt(hex[1].slice(0, 2), 16) / 255, parseInt(hex[1].slice(2, 4), 16) / 255, parseInt(hex[1].slice(4, 6), 16) / 255, 1];
    var m = String(v).match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?/);
    return m ? [m[1] / 255, m[2] / 255, m[3] / 255, m[4] === undefined ? 1 : Number(m[4])] : null;
  }
  function faceStops(face) {
    var all = String(face || '').match(/#[0-9a-f]{6}|rgba?\([^)]*\)/gi) || [];
    var a = tok(all[0]) || [0.04, 0.05, 0.07, 1], b = tok(all[all.length - 1]) || a;
    return [a.slice(0, 3), b.slice(0, 3)];
  }
  var ZERO = [0, 0, 0, 0];
  function scaleA(c, k) { return c ? [c[0], c[1], c[2], c[3] * k] : ZERO.slice(); }

  /* the app's cardLightInputs(): a material at full evolution */
  function materialInputs(sk) {
    var flat = !sk.sk1 || sk.sk1 === 'none';
    var s1 = sk.sk1, s2 = sk.sk2, s3 = sk.sk3, s4 = sk.sk4 && sk.sk4 !== 'none' ? sk.sk4 : sk.sk1;
    if (flat) { s1 = sk.edge; s2 = sk.halo; s3 = sk.halo; s4 = sk.edge; }   /* flat materials keep a little light on the landing page (decision #2, 2026-08-09) */
    var f = faceStops(sk.face);
    return {
      c1: scaleA(tok(s1), flat ? 0.45 : 1), c2: scaleA(tok(s2), flat ? 0.6 : 1), c3: scaleA(tok(s3), flat ? 0.35 : 1), c4: scaleA(tok(s4), flat ? 0.3 : 1),
      fa: f[0], fb: f[1], plat: Number(sk.plat) || 0
    };
  }
  /* the house card: cyan (Clarity), white (Action), green (Consistency), periwinkle (the mix) */
  function houseInputs(L) {
    var mix = Math.max(Math.min(L.clar, L.cons) * 0.75, L.clar * 0.34);
    return {
      c1: [116 / 255, 234 / 255, 1, 1 * L.clar], c2: [236 / 255, 239 / 255, 1, 0.8 * L.act],
      c3: [56 / 255, 236 / 255, 71 / 255, 1 * L.cons], c4: [128 / 255, 150 / 255, 1, 0.85 * mix],
      fa: [16 / 255, 20 / 255, 24 / 255], fb: [7 / 255, 9 / 255, 12 / 255], plat: 0.35
    };
  }
  var DARK = { c1: ZERO.slice(), c2: ZERO.slice(), c3: ZERO.slice(), c4: ZERO.slice(), fa: [0, 0, 0], fb: [0, 0, 0], plat: 0 };

  function rgbStr(a) { return Math.round(a[0] * 255) + ',' + Math.round(a[1] * 255) + ',' + Math.round(a[2] * 255); }
  function tintOf(sk) {
    var pick = [sk && sk.sk1, sk && sk.edge, sk && sk.sk2].filter(function (v) { return v && v !== 'none'; })[0];
    var t = tok(pick); return t ? rgbStr(t) : '226,232,240';
  }
  /* WCAG-solved button colours (teaser buttonPair): the button wears the material, the label is always readable */
  function _lin(v) { v = (parseInt(v, 10) || 0) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
  function _lum(rgb) { var p = String(rgb).split(','); return 0.2126 * _lin(p[0]) + 0.7152 * _lin(p[1]) + 0.0722 * _lin(p[2]); }
  function _ratio(a, b) { var x = _lum(a), y = _lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function buttonPair(tint) {
    var bg = tint;
    for (var i = 0; i < 24; i++) {
      var dr = _ratio(bg, '10,10,14'), lr = _ratio(bg, '255,255,255');
      if (Math.max(dr, lr) >= 4.5) return { bg: bg, ink: dr >= lr ? '#0a0a0e' : '#ffffff' };
      bg = String(bg).split(',').map(function (n) { return Math.round((parseInt(n, 10) || 0) * 0.88); }).join(',');
    }
    return { bg: bg, ink: '#ffffff' };
  }

  /* ------------------------------------------------------------------ Card */
  var M_PATH = 'M150 146 L256 252 L362 146 L362 366 L150 366 Z';
  var ease = function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  var cards = [];

  function Card(host, opts) {
    opts = opts || {};
    this.host = host; this.kind = opts.look || 0; this.spill = opts.spill || 1; this.edge = 1;
    this.visible = true; this.cur = JSON.parse(JSON.stringify(DARK)); this.from = null; this.to = null; this.t0 = 0; this.dur = 0;
    host.classList.add('mcard');
    host.innerHTML =
      '<canvas class="mcard__gl" aria-hidden="true"></canvas>' +
      '<div class="mcard__cortex" aria-hidden="true"></div>' +
      '<svg class="mcard__m" viewBox="0 0 512 512" aria-hidden="true"><path d="' + M_PATH + '"/></svg>' +
      '<span class="mcard__name" aria-hidden="true"></span>';
    this.cv = host.querySelector('.mcard__gl');
    this.mEl = host.querySelector('.mcard__m');
    this.nameEl = host.querySelector('.mcard__name');
    this.cortexHost = host.querySelector('.mcard__cortex');
    this.mirrors = [];
    var gl = this.cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, preserveDrawingBuffer: TEST });
    if (!gl) { host.classList.add('mcard--nogl'); return; }
    this.gl = gl;
    try { this.U = program(gl, VERT, CARD_FRAG); } catch (e) { console.error(e); host.classList.add('mcard--nogl'); this.gl = null; return; }
    gl.clearColor(0, 0, 0, 0);
    var self = this;
    this.ro = new ResizeObserver(function () { self.layout(); }); this.ro.observe(host);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { self.visible = es[0].isIntersecting; }, { rootMargin: '160px' }).observe(host);
    this.layout();
    cards.push(this);
  }
  Card.prototype.layout = function () {
    var w = this.host.clientWidth, h = w / ASPECT;
    var pad = Math.round(Math.max(28, w * 0.18) * (this.spill > 1 ? 1.6 : 1));
    this.pad = pad; this.w = w; this.h = h;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var cw = w + pad * 2, ch = h + pad * 2;
    var s = this.cv.style; s.left = -pad + 'px'; s.top = -pad + 'px'; s.width = cw + 'px'; s.height = ch + 'px';
    this.cv.width = Math.round(cw * dpr); this.cv.height = Math.round(ch * dpr); this.dpr = dpr;
    if (this.gl) {
      this.gl.viewport(0, 0, this.cv.width, this.cv.height);
      this.gl.uniform2f(this.U('res'), this.cv.width, this.cv.height); this.gl.uniform1f(this.U('dpr'), dpr);
      this.gl.uniform2f(this.U('card'), w, h);
    }
    this.host.style.setProperty('--card-w', w + 'px');
    this.dirty = true;
  };
  /* morph to a new set of inputs; dur 0 = instant */
  Card.prototype.set = function (inputs, dur) {
    if (!dur || REDUCE) { this.cur = JSON.parse(JSON.stringify(inputs)); this.to = null; this.dirty = true; return; }
    this.from = JSON.parse(JSON.stringify(this.cur)); this.to = inputs; this.t0 = performance.now(); this.dur = dur;
  };
  Card.prototype._step = function (now) {
    if (!this.to) return;
    var k = Math.min(1, (now - this.t0) / this.dur), e = ease(k), f = this.from, t = this.to, c = this.cur;
    ['c1', 'c2', 'c3', 'c4', 'fa', 'fb'].forEach(function (key) { for (var i = 0; i < t[key].length; i++) c[key][i] = f[key][i] + (t[key][i] - f[key][i]) * e; });
    c.plat = f.plat + (t.plat - f.plat) * e;
    c.fk = (f.fk || 0) + ((t.fk || 0) - (f.fk || 0)) * e;
    if (k >= 1) this.to = null;
    this.dirty = true;
  };
  Card.prototype.mark = function (color, ink) {
    this.mEl.style.fill = color;
    var m = tok(color), dark = m && (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) < 0.5;
    this.host.classList.toggle('mcard--darkmark', !!dark);
    if (ink) this.nameEl.style.color = ink;
  };
  Card.prototype.engrave = function (text) {
    this.nameEl.textContent = text || '';
    this.nameEl.classList.toggle('is-on', !!text);
  };
  Card.prototype.house = function (L, dur) {
    this.set(houseInputs(L), dur);
    this.mark(L.act > 0.41 ? 'rgba(20,29,40,0.62)' : 'rgba(255,255,255,0.55)', 'rgba(236,240,246,0.72)');
  };
  Card.prototype.draw = function (t) {
    if (!this.gl) return;
    var gl = this.gl, U = this.U, c = this.cur;
    gl.uniform1f(U('t'), t); gl.uniform1f(U('kind'), this.kind); gl.uniform1f(U('edge'), this.edge); gl.uniform1f(U('spill'), this.spill);
    gl.uniform4fv(U('c1'), c.c1); gl.uniform4fv(U('c2'), c.c2); gl.uniform4fv(U('c3'), c.c3); gl.uniform4fv(U('c4'), c.c4);
    gl.uniform3fv(U('fa'), c.fa); gl.uniform3fv(U('fb'), c.fb); gl.uniform1f(U('plat'), c.plat); gl.uniform1f(U('fk'), c.fk || 0);
    gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 3);
    for (var i = 0; i < this.mirrors.length; i++) {
      var m = this.mirrors[i]; m.ctx.clearRect(0, 0, m.c.width, m.c.height); m.ctx.drawImage(this.cv, 0, 0, m.c.width, m.c.height);
    }
  };
  /* render one still frame of any inputs and return it as an image (galleries) */
  Card.prototype.snapshot = function (inputs) {
    this.cur = JSON.parse(JSON.stringify(inputs)); this.to = null;
    this.draw(20); return this.cv.toDataURL('image/png');
  };
  Card.prototype.destroy = function () {
    var i = cards.indexOf(this); if (i >= 0) cards.splice(i, 1);
    if (this.ro) this.ro.disconnect();
    if (this.gl) { var l = this.gl.getExtension('WEBGL_lose_context'); if (l) l.loseContext(); this.gl = null; }
  };
  /* a 2D canvas that receives a copy of every frame (for reflections) */
  Card.prototype.mirrorTo = function (c2d) { this.mirrors.push({ c: c2d, ctx: c2d.getContext('2d') }); };

  /* the dopamine egg: Codex's Cortex material, clipped to the card */
  Card.prototype.cortex = function (on) {
    if (on && !this._cortex && typeof createCortex === 'function') {
      var cv = document.createElement('canvas'); this.cortexHost.appendChild(cv);
      try { this._cortex = createCortex(cv); this._cortex.update({ variant: 0, speed: 2.5, dim: 0.5, paused: REDUCE }); }
      catch (e) { cv.remove(); this._cortex = null; }
    }
    if (!on && this._cortex) { var old = this._cortex, host = this.cortexHost; this._cortex = null; setTimeout(function () { try { old.destroy(); } catch (e) {} host.innerHTML = ''; }, 700); }
    this.host.classList.toggle('mcard--cortex', !!on && !!this._cortex);
  };

  /* one clock for every card on the page */
  var T0 = performance.now(), lastT = 0;
  function loop(now) {
    requestAnimationFrame(loop);
    if (document.hidden) return;
    var t = 20 + (REDUCE ? 0 : ((now - T0) / 1000) * TIME_SCALE);
    var draw30 = now - lastT > 32;
    for (var i = 0; i < cards.length; i++) {
      var cd = cards[i]; cd._step(now);
      if (!cd.visible && !cd.dirty) continue;
      if (cd.dirty || draw30) { cd.draw(t); cd.dirty = false; }
    }
    if (draw30) lastT = now;
  }
  requestAnimationFrame(loop);

  /* ------------------------------------------------------------------ tilt + glare */
  function tilt(wrap, opts) {
    opts = opts || {};
    /* gentle by default (Malik: the first version tilted far too much) */
    var max = opts.max || 3, rx = 0, ry = 0, tx = 0, ty = 0, over = false, gl = null;
    if (REDUCE) return;
    function onMove(e) {
      var r = wrap.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      tx = -y * max; ty = x * max; over = true;
      if (gl) { gl.style.setProperty('--gx', (x + 0.5) * 100 + '%'); gl.style.setProperty('--gy', (y + 0.5) * 100 + '%'); gl.style.opacity = '1'; }
    }
    (opts.area || wrap).addEventListener('pointermove', onMove);
    (opts.area || wrap).addEventListener('pointerleave', function () { over = false; if (gl) gl.style.opacity = '0'; });
    var t0 = performance.now();
    (function f(now) {
      requestAnimationFrame(f);
      var s = (now - t0) / 1000;
      var sw = opts.sway == null ? 0.8 : opts.sway;
      var ax = over ? tx : Math.sin(s * 0.45) * sw * 0.6, ay = over ? ty : Math.sin(s * 0.31) * sw * 1.6;
      rx += (ax - rx) * 0.08; ry += (ay - ry) * 0.08;
      wrap.style.transform = 'perspective(1400px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
    })(t0);
  }

  /* ------------------------------------------------------------------ Sky (the aurora) */
  var ONBOARDING = [
    [0, 0.95, 0.0, 0.050, 0.110, 0.26, 0.42, 0.12], [1, 0.48, 2.1, 0.041, 0.090, 0.31, 0.36, 0.09],
    [2, 0.66, 4.0, 0.057, 0.070, 0.22, 0.40, 0.13], [0, 0.60, 5.3, 0.036, 0.130, 0.16, 0.30, 0.09],
    [1, 0.30, 1.2, 0.062, 0.080, 0.36, 0.28, 0.07], [3, 0.22, 3.3, 0.045, 0.100, 0.30, 0.20, 0.06]
  ];
  function skyFrag(o) {
    var sum = ONBOARDING.map(function (l) {
      var col = ['a1', 'a2', 'a3', 'vec3(0.90, 0.968, 1.0) * wl'][l[0]];
      return '  acc += ' + col + ' * ' + l[1].toFixed(2) + ' * light(uv, ' + l[2].toFixed(2) + ', ' + l[3].toFixed(3) + ', ' + l[4].toFixed(3) + ', ' + (o.floor ? (0.56 - l[5] * 0.9).toFixed(3) : l[5].toFixed(3)) + ', ' + l[6].toFixed(2) + ', ' + l[7].toFixed(2) + ');';
    }).join('\n');
    return [
      'precision highp float;',
      'uniform vec2 res; uniform float t; uniform float amp; uniform vec3 a1; uniform vec3 a2; uniform vec3 a3; uniform float contrast; uniform float gain; uniform float wl;',
      'float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }',
      'float light(vec2 uv, float ph, float wx, float wy, float cy, float sx, float sy){',
      '  vec2 c = vec2(0.5 + 0.42 * sin(t * wx + ph), cy + 0.07 * sin(t * wy + ph * 1.7));',
      '  float dx = uv.x - c.x;',
      '  float dy = uv.y - c.y - 0.06 * sin(uv.x * 4.2 + t * 0.21 + ph) - 0.025 * sin(uv.x * 9.0 - t * 0.17 + ph * 2.0);',
      '  return exp(-(dx * dx) / (sx * sx) - (dy * dy) / (sy * sy));',
      '}',
      'void main(){',
      '  vec2 fc = gl_FragCoord.xy; vec2 uv = vec2(fc.x / res.x, 1.0 - fc.y / res.y);',
      o.floor ? '  uv.y = 1.0 - uv.y;' : '',
      '  vec3 acc = vec3(0.0);',
      sum,
      '  vec3 col = 1.0 - exp(-acc * 1.25);',
      '  col = pow(col, vec3(contrast));',
      '  col *= gain * smoothstep(' + (o.fadeFrom || 0.92) + ', ' + (o.fadeTo || 0.45) + ', uv.y) * amp;',
      '  col += (hash(fc + fract(t)) - 0.5) / 255.0;',
      '  gl_FragColor = vec4(max(col, 0.0), 1.0);',
      '}'
    ].join('\n');
  }
  var CYAN = [58 / 255, 217 / 255, 245 / 255], GREEN = [63 / 255, 217 / 255, 78 / 255], BLUE = [120 / 255, 160 / 255, 1];
  var PLAT = [[178 / 255, 226 / 255, 238 / 255], [232 / 255, 238 / 255, 244 / 255], [196 / 255, 206 / 255, 218 / 255]];
  function Sky(canvas, o) {
    o = o || {};
    var gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power', preserveDrawingBuffer: TEST });
    if (!gl) return { colors: function () {}, amp: function () {} };
    var U = program(gl, VERT, skyFrag(o));
    var platinum = o.preset === 'platinum';
    var cur = platinum ? PLAT.map(function (c) { return c.slice(); }) : [CYAN.slice(), GREEN.slice(), BLUE.slice()];
    var from = null, to = null, t0 = 0, dur = 1200, amp = o.amp == null ? 1 : o.amp, ampTo = amp, wl = 1;
    gl.uniform1f(U('contrast'), platinum ? 1.45 : 1.0); gl.uniform1f(U('gain'), o.gain || (platinum ? 0.74 : 0.78));
    var scale = o.scale || 0.5, T = performance.now(), last = 0;
    function size() {
      var w = Math.max(1, Math.round(canvas.clientWidth * scale)), h = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); gl.uniform2f(U('res'), w, h); }
    }
    (function f(now) {
      requestAnimationFrame(f);
      if (document.hidden || now - last < 32) return; last = now;
      if (to) { var k = Math.min(1, (now - t0) / dur), e = ease(k); for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) cur[i][j] = from[i][j] + (to[i][j] - from[i][j]) * e; if (k >= 1) to = null; }
      amp += (ampTo - amp) * 0.06;
      size();
      gl.uniform1f(U('t'), 20 + (REDUCE ? 0 : (now - T) / 1000));
      gl.uniform1f(U('amp'), amp); gl.uniform1f(U('wl'), wl);
      gl.uniform3fv(U('a1'), cur[0]); gl.uniform3fv(U('a2'), cur[1]); gl.uniform3fv(U('a3'), cur[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    })(T);
    return {
      colors: function (list, d) { from = cur.map(function (c) { return c.slice(); }); to = list; t0 = performance.now(); dur = d || 1200; },
      /* instant: for pages that steer the sky every frame (Evolve follows the card's own lights) */
      set: function (list, a, w) { to = null; for (var i = 0; i < 3; i++) cur[i] = list[i].slice(); if (a != null) { amp = ampTo = a; } if (w != null) wl = w; },
      reset: function (d) { this.colors(platinum ? PLAT : [CYAN, GREEN, BLUE], d); },
      amp: function (a) { ampTo = a; }
    };
  }
  /* three sky colours from a card's inputs (brightest lights first) */
  function skyColors(inputs) {
    var ls = [inputs.c1, inputs.c2, inputs.c3, inputs.c4].filter(function (c) { return c[3] > 0.05; })
      .map(function (c) { var m = Math.max(c[0], c[1], c[2]) || 1; return [c[0] / m, c[1] / m, c[2] / m]; });
    if (!ls.length) { var f = inputs.fa; var m = Math.max(f[0], f[1], f[2]) || 1; ls = [[f[0] / m, f[1] / m, f[2] / m]]; }
    while (ls.length < 3) ls.push(ls[ls.length % ls.length]);
    return [ls[0], ls[2] || ls[1], ls[1]];
  }

  /* ------------------------------------------------------------------ Waterfall (Home's light) */
  var WATER_FRAG = [
    'precision highp float;',
    'uniform vec2 res; uniform float t; uniform float amp; uniform float cx; uniform float vw; uniform float top;',
    'uniform vec3 a1; uniform vec3 a2; uniform vec3 a3;',
    'float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }',
    'float light(vec2 uv, float ph, float wx, float wy, float cy, float sx, float sy){',
    '  vec2 c = vec2(0.5 + 0.42 * sin(t * wx + ph), cy + 0.07 * sin(t * wy + ph * 1.7));',
    '  float dx = uv.x - c.x;',
    '  float dy = uv.y - c.y - 0.06 * sin(uv.x * 4.2 + t * 0.21 + ph) - 0.025 * sin(uv.x * 9.0 - t * 0.17 + ph * 2.0);',
    '  return exp(-(dx * dx) / (sx * sx) - (dy * dy) / (sy * sy));',
    '}',
    'void main(){',
    '  vec2 fc = vec2(gl_FragCoord.x, res.y - gl_FragCoord.y);',
    '  vec2 uv = vec2(fc.x / res.x, 1.0 - fc.y / res.y);',
    '  vec3 acc = vec3(0.0);',
    '  acc += a1 * 0.95 * light(uv, 0.0, 0.050, 0.110, 0.10, 0.42, 0.12);',
    '  acc += a2 * 0.48 * light(uv, 2.1, 0.041, 0.090, 0.15, 0.36, 0.09);',
    '  acc += a3 * 0.66 * light(uv, 4.0, 0.057, 0.070, 0.06, 0.40, 0.13);',
    '  acc += a1 * 0.60 * light(uv, 5.3, 0.036, 0.130, 0.02, 0.30, 0.09);',
    '  acc += a2 * 0.30 * light(uv, 1.2, 0.062, 0.080, 0.20, 0.28, 0.07);',
    '  acc += vec3(0.9, 0.97, 1.0) * 0.20 * light(uv, 3.3, 0.045, 0.100, 0.12, 0.20, 0.06);',
    '  vec3 floorCol = (1.0 - exp(-acc * 1.25)) * smoothstep(0.40, 0.0, uv.y);',
    '  float d = (fc.y - top) / max(1.0, res.y - top);',
    '  float dd = max(d, 0.0);',
    '  float hw = 0.5 * vw * (0.72 + 0.95 * dd);',
    '  float u = (fc.x - cx) / hw;',
    '  float sheet = exp(-(u * u) / 0.30) * (0.62 + 0.38 * sin(dd * 5.0 - t * 0.75)) * (0.80 + 0.20 * sin(u * 3.0 + t * 0.23));',
    '  float fall = smoothstep(-0.004, 0.03, d) * exp(-dd * 1.7);',
    '  vec3 veilCol = mix(a1, mix(a2, a3, 0.5 + 0.5 * sin(t * 0.07)), smoothstep(0.0, 0.8, dd));',
    '  float lip = exp(-(dd * dd) / 0.0016) * exp(-(u * u) / 0.5);',
    '  vec3 veil = (veilCol * sheet * 0.44 + mix(vec3(1.0), a1, 0.5) * lip * 0.26) * fall;',
    '  vec3 col = (floorCol * 0.70 + (1.0 - exp(-veil * 1.4))) * amp;',
    '  col += (hash(fc + fract(t)) - 0.5) / 255.0;',
    '  gl_FragColor = vec4(max(col, 0.0), 1.0);',
    '}'
  ].join('\n');
  function Waterfall(canvas, cardEl, o) {
    o = o || {};
    var gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power', preserveDrawingBuffer: TEST });
    if (!gl) return { colors: function () {} };
    var U = program(gl, VERT, WATER_FRAG);
    var cur = [CYAN.slice(), GREEN.slice(), BLUE.slice()], from = null, to = null, t0 = 0, dur = 1200, amp = o.amp || 0.9;
    var scale = 0.5, T = performance.now(), last = 0;
    (function f(now) {
      requestAnimationFrame(f);
      if (document.hidden || now - last < 32) return; last = now;
      var w = Math.max(1, Math.round(canvas.clientWidth * scale)), h = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); gl.uniform2f(U('res'), w, h); }
      if (to) { var k = Math.min(1, (now - t0) / dur), e = ease(k); for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) cur[i][j] = from[i][j] + (to[i][j] - from[i][j]) * e; if (k >= 1) to = null; }
      var r = cardEl.getBoundingClientRect(), cr = canvas.getBoundingClientRect();
      gl.uniform1f(U('cx'), (r.left + r.width / 2 - cr.left) * scale);
      gl.uniform1f(U('vw'), r.width * scale);
      gl.uniform1f(U('top'), (r.bottom - cr.top) * scale);
      gl.uniform1f(U('t'), 20 + (REDUCE ? 0 : (now - T) / 1000));
      gl.uniform1f(U('amp'), amp);
      gl.uniform3fv(U('a1'), cur[0]); gl.uniform3fv(U('a2'), cur[1]); gl.uniform3fv(U('a3'), cur[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    })(T);
    return { colors: function (list, d) { from = cur.map(function (c) { return c.slice(); }); to = list; t0 = performance.now(); dur = d || 1200; },
             reset: function (d) { this.colors([CYAN, GREEN, BLUE], d); } };
  }

  /* ------------------------------------------------------------------ Name engine */
  /* Applies a name to a card: the same material the app gives that name, or Cortex for
     "dopamine". Returns what the page needs to theme itself. Text is only ever set with
     textContent (injection-safe). */
  function nameInfo(name) {
    var n = String(name || '').trim();
    if (!n) return null;
    if (n.toLowerCase() === 'dopamine') {
      return { name: n, egg: true, material: 'Dopamine', inputs: DARK, mark: '#eef6fa', ink: 'rgba(237,244,245,.8)', tint: '40,110,255',
               sky: [[40 / 255, 110 / 255, 1], [0, 238 / 255, 186 / 255], [230 / 255, 60 / 255, 1]] };
    }
    var sk = skinForName(n), inputs = materialInputs(sk);
    return { name: n, egg: false, material: sk.n, inputs: inputs, mark: sk.mark, ink: sk.ink, tint: tintOf(sk), sky: skyColors(inputs) };
  }
  function applyName(card, info, dur) {
    if (!info) return;
    card.cortex(info.egg);
    card.set(info.inputs, dur == null ? 900 : dur);
    card.mark(info.mark, info.ink);
    card.engrave(info.name);
  }
  function themeRoot(info) {
    var r = document.documentElement.style;
    if (!info) { ['--skin', '--btn-bg', '--btn-ink'].forEach(function (k) { r.removeProperty(k); }); return; }
    var bp = buttonPair(info.tint);
    r.setProperty('--skin', info.tint); r.setProperty('--btn-bg', 'rgb(' + bp.bg + ')'); r.setProperty('--btn-ink', bp.ink);
  }

  /* types a string into an input like a person would (for the auto demo) */
  function typeInto(input, text, cb, speed) {
    var i = 0; input.value = '';
    (function next() {
      if (input.dataset.userTyped) return;
      input.value = text.slice(0, ++i);
      input.dispatchEvent(new Event('demo-input'));
      if (i < text.length) setTimeout(next, (speed || 85) + Math.random() * 60); else cb && cb();
    })();
  }

  root.ML = {
    REDUCE: REDUCE, ASPECT: ASPECT, Card: Card, tilt: tilt, Sky: Sky, Waterfall: Waterfall, skyColors: skyColors,
    materialInputs: materialInputs, houseInputs: houseInputs, DARK: DARK, nameInfo: nameInfo, applyName: applyName,
    themeRoot: themeRoot, buttonPair: buttonPair, typeInto: typeInto, tok: tok,
    colors: { CYAN: CYAN, GREEN: GREEN, BLUE: BLUE, PLAT: PLAT }
  };
})(window);
