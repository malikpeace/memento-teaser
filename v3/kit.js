// kit.js: the landing mockups' shared parts. The real Memento card and Home backgrounds (engine.js = the Skins v2
// shaders the app was ported from), drawn from two WebGL contexts into ordinary 2D canvases; the featured looks;
// iPhone and iPad Home frames; the look picker; the sign-up sheet; the letter.
var K = (function () {
  // ?clean (local screenshots only): no mockup bar, so the page sits exactly as it would on mementoapp.co
  // MEMENTO_LIVE (set by the real mementoapp.co page): no mockup bar, and the real Beehiiv sign-up
  var LIVE = !!window.MEMENTO_LIVE, CLEAN = /clean/.test(location.search);
  var BAR = LIVE || CLEAN ? 0 : 38;
  if (!BAR) document.documentElement.style.setProperty('--bar', '0px');
  var DPR = Math.min(innerWidth < 700 ? 1.5 : 2, window.devicePixelRatio || 1);
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ccv = document.createElement('canvas'), CR = new MCE.GLR(ccv, true); if (CR && !CR.gl) CR = null;
  var wcv = document.createElement('canvas'), WR = new MCE.GLR(wcv, false); if (WR && !WR.gl) WR = null;
  var BG = {}; MCE.BGS.forEach(function (b) { BG[b.id] = b; });
  var HOUR = 17.6;   // Sundial follows the real hour in the app; the mockup holds late afternoon so it never reads black

  // The looks Malik picked (2026-10-14), each with the background that goes with it.
  var LOOKS = [
    { id: 'house', name: 'Default', sub: 'Where everyone starts', skin: 'house', style: 'light', bg: 'waterfall' },
    { id: 'midas', name: 'Midas', sub: 'Liquid gold', skin: 'Midas', style: 'midas', bg: 'pour' },
    { id: 'bismuth', name: 'Bismuth', sub: 'Liquid metal', skin: 'Bismuth', style: 'metal', bg: 'metalsea' },
    { id: 'glass', name: 'Liquid glass', sub: 'Clear glass', skin: 'Clear', style: 'g-clear', bg: 'beams', wallSkin: 'house' },
    { id: 'opal', name: 'Black Opal', sub: 'Opal', skin: 'Black Opal', style: 'opal', bg: 'aurora' },
    { id: 'thermal', name: 'Thermal', sub: 'Heat camera', skin: 'Thermal', style: 'thermal', bg: 'risingheat' },
    { id: 'neon', name: 'Neon Noir', sub: 'Lamp', skin: 'Neon Noir', style: 'lamp', bg: 'lava' },
    { id: 'blood', name: 'Blood Orange', sub: 'Satin', skin: 'Blood Orange', style: 'satin', bg: 'silk' },
    { id: 'titanium', name: 'Titanium', sub: 'Brushed metal', skin: 'Titanium', style: 'brushed', bg: 'fresnel' }
  ];
  var LBY = {}; LOOKS.forEach(function (l) { LBY[l.id] = l; });
  var EARNED = LOOKS.slice(1);

  // "Your name": the app's nameSkin (memento-native/src/skins/catalog.ts customSkin + nameHex), so a name gives the same
  // colour here as in the app
  function seedOf(n) { var x = 0; for (var i = 0; i < n.length; i++) x = (x * 31 + n.charCodeAt(i)) % 9973; return x / 9973; }
  function hexOf(v) { return '#' + v.map(function (x) { return ('0' + Math.round(Math.max(0, Math.min(1, x)) * 255).toString(16)).slice(-2); }).join(''); }
  function rgbaOf(v, a) { return 'rgba(' + v.map(function (x) { return Math.round(Math.max(0, Math.min(1, x)) * 255); }).join(',') + ',' + a + ')'; }
  function mixc(a, b, k) { return a.map(function (v, i) { return v + (b[i] - v) * k; }); }
  function hslHex(hd, s, l) {
    var c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((hd / 60) % 2 - 1)), m = l - c / 2, r = 0, g = 0, b = 0;
    if (hd < 60) { r = c; g = x; } else if (hd < 120) { r = x; g = c; } else if (hd < 180) { g = c; b = x; } else if (hd < 240) { g = x; b = c; } else if (hd < 300) { r = x; b = c; } else { r = c; b = x; }
    return hexOf([r + m, g + m, b + m]);
  }
  function nameSkin(name, styleId) {
    var hex = hslHex(Math.round(seedOf((name || '').trim() || 'memento') * 360), 0.72, 0.56);
    var st = MCE.SBY[styleId] || MCE.SBY.light, c = [1, 3, 5].map(function (i) { return parseInt(hex.substr(i, 2), 16) / 255; }), W = [1, 1, 1], Kk = [0, 0, 0];
    var lt = mixc(c, W, 0.45), dk = mixc(c, Kk, 0.35), sh = mixc(c, [c[1], c[2], c[0]], 0.25), fa = mixc(c, Kk, 0.86), fb = mixc(c, Kk, 0.94);
    var mid = mixc(fa, fb, 0.5), fl = 0.2126 * mid[0] + 0.7152 * mid[1] + 0.0722 * mid[2];
    var mark = fl > 0.55 ? rgbaOf(mixc(c, Kk, 0.55), 0.9) : rgbaOf(mixc(c, W, 0.9), 0.95);
    return { n: 'Your name', ownName: true, family: 'custom', style: styleId, hex: hex, sk1: rgbaOf(c, 1), sk2: rgbaOf(lt, 0.85), sk3: rgbaOf(dk, 1), sk4: rgbaOf(sh, 0.75),
      plat: '.15', face: 'linear-gradient(165deg,' + hexOf(fa) + ',' + hexOf(fb) + ')', mark: mark, ink: mark, tint: hexOf(mixc(c, W, 0.15)), gtint: [hex, 0.9], spec: 0, opal: 0, wall: st.wall, rim: st.edge };
  }
  var NAMED = {};
  function skinOf(n) {
    if (n === 'house') return MCE.HOUSE;
    if (typeof n === 'string' && n.indexOf('name:') === 0) { var k = n.slice(5); return NAMED[k] || (NAMED[k] = nameSkin(k.split('|')[0], k.split('|')[1] || 'light')); }
    return MCE.KBY[n] || MCE.HOUSE;
  }
  // a look for a typed name: the person's own colour in a style, on the Waterfall lit by that colour
  function nameLook(name, styleId) { var st = styleId || 'fused'; return { id: 'name', name: name, sub: 'Your name', skin: 'name:' + (name || '').trim() + '|' + st, style: st, bg: 'waterfall' }; }
  function inputsOf(lk) { return MCE.inputsFor(skinOf(lk.skin), lk.style, lk.style === 'sundial' ? HOUR : null); }
  var HOUSE_R = MCE.rolesOf(MCE.HOUSE);
  // a wall's light: the sun's for Sundial, otherwise the worn skin's (a glass card borrows the house's lights)
  function wallLight(bgId, skinName) {
    if (bgId === 'sundial') { var S = MCE.sunWall(HOUR); return { R: S.R, sun: S.sun }; }
    return { R: MCE.rolesOf(MCE.wallSkinOf(skinOf(skinName))), sun: null };
  }
  // the house roles with each light turned up or down (cyan, green, violet, white), for the story's colour journey
  function houseRoles(ch, gain) {
    var g = gain == null ? 1 : gain, R = HOUSE_R;
    var a = R.a.map(function (v) { return v * ch[0] * g; }), b = R.b.map(function (v) { return v * ch[1] * g; });
    var c = R.c.map(function (v) { return v * Math.max(ch[2], ch[0] * 0.4) * g; }), p = R.p.map(function (v) { return v * ch[3] * g; });
    // white-led steps light the wall in white: lend the white to the strong lights
    var w = ch[3] * (1 - Math.max(ch[0], ch[1]));
    a = a.map(function (v, i) { return v + R.p[i] * w * 0.85 * g; }); b = b.map(function (v, i) { return v + R.p[i] * w * 0.7 * g; });
    return { a: a, b: b, c: c, p: p, ta: R.ta, tb: R.tb };
  }

  // ---------------------------------------------------------------- cards
  var cards = [], walls = [], T0 = performance.now();
  function now() { return (performance.now() - T0) / 1000; }
  function card(host, o) {
    o = o || {};
    var c = { host: host, still: !!o.still, chan: o.chan || null, wall: o.wall || null, tiltK: o.tilt == null ? 1 : o.tilt, t0: o.t0 == null ? 8 + Math.random() * 30 : o.t0, alpha: 1, flash: 0 };
    c.cv = document.createElement('canvas'); c.cv.className = 'k-cv'; host.appendChild(c.cv); c.ctx = c.cv.getContext('2d');
    c.size = function (w) {
      c.w = w; var th = { skin: c.skin, style: c.lk.style, w: w }, h = w / MCE.ASPECT, pad = MCE.padOf(w, th);
      c.G = { w: w, h: h, pad: pad, dpr: DPR, rad: MCE.radOf(w), mbox: Math.min(124, w * 0.42) };
      c.cv.style.cssText = 'position:absolute;pointer-events:none;left:' + (-pad) + 'px;top:' + (-pad) + 'px;width:' + (w + 2 * pad) + 'px;height:' + (h + 2 * pad) + 'px';
      c.cv.width = Math.round((w + 2 * pad) * DPR); c.cv.height = Math.round((h + 2 * pad) * DPR);
      host.style.width = w + 'px'; host.style.height = h + 'px';
      drawCard(c, c.t0 + now() * 2.4);
    };
    c.set = function (lk, fade) {
      if (fade && c.lk && c.lk !== lk && !RM) ghost(c);
      c.lk = lk; c.skin = skinOf(lk.skin); c.I = inputsOf(lk);
      c.size(o.w && !c.w ? o.w : c.w || 240);
    };
    c.set(o.look || LOOKS[0]);
    cards.push(c);
    return c;
  }
  // a quick cross-fade when a card changes look: the old frame fades out over the new one
  function ghost(c) {
    var g = document.createElement('canvas'); g.width = c.cv.width; g.height = c.cv.height; g.getContext('2d').drawImage(c.cv, 0, 0);
    g.style.cssText = c.cv.style.cssText + ';transition:opacity .45s ease-out;opacity:1';
    c.host.appendChild(g);
    requestAnimationFrame(function () { requestAnimationFrame(function () { g.style.opacity = '0'; }); });
    setTimeout(function () { g.remove(); }, 520);
  }
  function backdropFor(c, t) {
    var w = c.wall; if (!w || !w.L) return null;
    var g = wallGeo(w); if (!g) return null;
    var r = c.cv.getBoundingClientRect();
    return { n: BG[w.bg].bg, R: w.L.R, view: [g.vx0 + (r.left - g.r.left) * g.k, (r.top - g.r.top) * g.k, r.width * g.k, r.height * g.k], t: wallT(w), box: w.box || [195, 524, 232], sun: w.L.sun };
  }
  function drawCard(c, t) {
    if (!CR) return;
    var I = c.I;
    if (c.chan) I = Object.assign({}, I, { c: I.c.map(function (x, i) { return [x[0], x[1], x[2], x[3] * c.chan[i]]; }) });
    var d = MCE.drift(t), tl = c.tiltV || [0, 0];
    var ti = (I.still || c.still) ? tl : [tl[0] + d[0] * 0.6 * c.tiltK, tl[1] + d[1] * 0.6 * c.tiltK];
    var B = (I.kind === 21 || I.kind === 51 || I.kind === 53) ? backdropFor(c, t) : null;
    var sz = CR.draw(I, c.G, t, ti, B); if (!sz) return;
    var x = c.ctx; x.clearRect(0, 0, c.cv.width, c.cv.height);
    x.globalAlpha = c.alpha; x.drawImage(ccv, 0, 0, sz[0], sz[1], 0, 0, c.cv.width, c.cv.height); x.globalAlpha = 1;
    if (c.fx) { var fa = (performance.now() - c.fx.t0) / 1000; if (fa > 1.5) c.fx = null; else charge(c, x, fa); }
    if (c.flash > 0.002) {   // the Evolve flash: white light on the face, inside the card's corners
      var p = c.G.pad * DPR, W = c.G.w * DPR, H = c.G.h * DPR, rr = c.G.rad * DPR;
      x.save(); x.globalAlpha = Math.min(1, c.flash); x.fillStyle = '#fff'; x.beginPath();
      if (x.roundRect) x.roundRect(p, p, W, H, rr); else x.rect(p, p, W, H);
      x.fill(); x.restore();
    }
  }

  // a chapter arriving: the new colour rises up through the card and a soft aura swells behind it, then settles.
  // The aura is a radial fade that reaches nothing before the canvas edge (edge-safe by construction).
  function charge(c, x, a) {
    var p = c.G.pad * DPR, W = c.G.w * DPR, H = c.G.h * DPR, rr = c.G.rad * DPR, col = c.fx.rgb, k = c.fx.k || 1;
    var rgb = function (al) { return 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + Math.max(0, al).toFixed(3) + ')'; };
    x.save(); x.globalCompositeOperation = 'lighter';
    var aura = 0.14 * k * Math.sin(Math.PI * Math.min(1, a / 1.3)), cx = p + W / 2, cy = p + H / 2, R = (p + W / 2) * 0.96;
    if (aura > 0.003) {
      x.save(); x.translate(cx, cy); x.scale(1, (p + H / 2) / (p + W / 2));
      var g = x.createRadialGradient(0, 0, W * 0.3, 0, 0, R); g.addColorStop(0, rgb(aura)); g.addColorStop(0.6, rgb(aura * 0.35)); g.addColorStop(1, rgb(0));
      x.fillStyle = g; x.beginPath(); x.arc(0, 0, R, 0, Math.PI * 2); x.fill(); x.restore();
    }
    var u = Math.min(1, a / 1.0), band = H * 0.6, y = p + H + band * 0.5 - (H + band) * (1 - Math.pow(1 - u, 2.2)), al = 0.16 * k * (1 - Math.max(0, (a - 0.8) / 0.7));
    if (al > 0.003) {
      x.beginPath(); if (x.roundRect) x.roundRect(p, p, W, H, rr); else x.rect(p, p, W, H); x.clip();
      var b = x.createLinearGradient(0, y - band / 2, 0, y + band / 2); b.addColorStop(0, rgb(0)); b.addColorStop(0.5, rgb(al)); b.addColorStop(1, rgb(0));
      x.fillStyle = b; x.fillRect(p, y - band / 2, W, band);
      x.fillStyle = rgb(al * 0.25 * u); x.fillRect(p, y, W, p + H - y);
    }
    x.restore();
  }

  // ---------------------------------------------------------------- walls (Home's backgrounds)
  function wall(host, o) {
    o = o || {};
    var w = { host: host, dprK: o.dprK || 0.6, card: o.card || null, gain: 1, t0: Math.random() * 20, still: !!o.still };
    w.cv = document.createElement('canvas'); w.cv.className = 'k-wall'; host.insertBefore(w.cv, host.firstChild); w.ctx = w.cv.getContext('2d');
    w.set = function (bgId, skinName, fade) {
      if (fade && w.bg && (w.bg !== bgId || w.skinName !== skinName) && !RM) wallGhost(w);
      w.bg = bgId; w.skinName = skinName; w.L = wallLight(bgId, skinName); w.rolesFn = null;
      drawWall(w, now());
    };
    w.look = function (lk, fade) { w.set(lk.bg, lk.wallSkin || lk.skin, fade); };
    w.set(o.bg || 'waterfall', o.skin || 'house');
    walls.push(w);
    return w;
  }
  function wallGhost(w) {
    var g = document.createElement('canvas'); g.width = w.cv.width; g.height = w.cv.height; g.getContext('2d').drawImage(w.cv, 0, 0);
    g.className = 'k-wall'; g.style.transition = 'opacity .6s ease-out'; w.host.insertBefore(g, w.cv.nextSibling);
    requestAnimationFrame(function () { requestAnimationFrame(function () { g.style.opacity = '0'; }); });
    setTimeout(function () { g.remove(); }, 680);
  }
  // the room is centred on the card, so a background built around the app's card (a pour, a reflection, a lamp, the
  // plumes) sits under it wherever the card is on the page
  function wallGeo(w) {
    var r = w.host.getBoundingClientRect(); if (!r.width || !r.height) return null;
    var k = 844 / r.height, vw = r.width * k, cx = r.width / 2;
    if (w.bg === 'beams') return { r: r, k: k, vw: vw, vx0: 0 };   // the beams come from the screen's own top-left corner
    if (w.card && w.card.host) { var cr = w.card.host.getBoundingClientRect(); if (cr.width) cx = cr.left + cr.width / 2 - r.left; }
    return { r: r, k: k, vw: vw, vx0: 195 - cx * k };
  }
  function wallT(w) { var b = BG[w.bg]; return b.t0 + 2 * b.speed + (w.t0 + now()) * b.speed; }
  function drawWall(w) {
    if (!WR) return;
    var g = wallGeo(w); if (!g) return;
    var d = w.dprK * Math.min(DPR, 2), pw = Math.max(2, Math.round(g.r.width * d)), ph = Math.max(2, Math.round(g.r.height * d));
    if (w.cv.width !== pw || w.cv.height !== ph) { w.cv.width = pw; w.cv.height = ph; }
    if (wcv.width < pw || wcv.height < ph) { wcv.width = Math.max(wcv.width, pw); wcv.height = Math.max(wcv.height, ph); }
    var box = [195, 524, 232];
    if (w.card) { var cr = w.card.host.getBoundingClientRect(); if (cr.width) box = [g.vx0 + (cr.left + cr.width / 2 - g.r.left) * g.k, (cr.bottom - g.r.top) * g.k, cr.width * g.k]; }
    w.box = box;
    var R = w.rolesFn ? w.rolesFn() : w.L.R;
    if (w.gain !== 1) R = { a: R.a.map(function (v) { return v * w.gain; }), b: R.b.map(function (v) { return v * w.gain; }), c: R.c.map(function (v) { return v * w.gain; }), p: R.p.map(function (v) { return v * w.gain; }), ta: R.ta, tb: R.tb };
    WR.gl.bindFramebuffer(WR.gl.FRAMEBUFFER, null);
    if (!WR.drawBgRaw(BG[w.bg].bg, R, [g.vx0, 0, g.vw, 844], pw, ph, wallT(w), box, w.L.sun, null)) return;
    w.ctx.clearRect(0, 0, pw, ph);
    w.ctx.drawImage(wcv, 0, wcv.height - ph, pw, ph, 0, 0, pw, ph);
  }

  // ---------------------------------------------------------------- the frame loop (only what is on screen)
  function onScreen(el) { var r = el.getBoundingClientRect(); return r.width > 0 && r.bottom > -40 && r.top < innerHeight + 40 && r.right > 0 && r.left < innerWidth; }
  var frame = 0;
  function loop() {
    frame++;
    walls = walls.filter(function (w) { return w.cv.isConnected; });
    cards = cards.filter(function (c) { return c.cv.isConnected; });
    var t = now();
    for (var i = 0; i < walls.length; i++) if (!walls[i].paused && onScreen(walls[i].host) && (!walls[i].still || frame % 30 === 1)) drawWall(walls[i], t);
    for (var j = 0; j < cards.length; j++) if (!cards[j].paused && onScreen(cards[j].host)) drawCard(cards[j], cards[j].t0 + t * 2.4);
    if (!RM) requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  function redrawAll() { var t = now(); walls.forEach(function (w) { drawWall(w, t); }); cards.forEach(function (c) { drawCard(c, c.t0 + t * 2.4); }); }

  // ---------------------------------------------------------------- small helpers
  function el(tag, cls, html, parent) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; }
  var M_PATH = 'M62 55 L256 249 L450 55 L450 457 L62 457 Z';
  function mark(fill) { return '<svg viewBox="42 40 428 432" aria-hidden="true"><path d="' + M_PATH + '" fill="' + (fill || 'currentColor') + '"/></svg>'; }
  function wordmark() { return '<span class="wm">' + mark() + '<span>emento</span></span>'; }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function lerpA(a, b, k) { return a.map(function (v, i) { return v + (b[i] - v) * k; }); }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function ease(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }

  // ---------------------------------------------------------------- devices: Home on iPhone and iPad
  var SB = '<span class="sb-t">9:41</span><span class="sb-i"><svg width="18" height="12" viewBox="0 0 18 12"><path d="M1 9h2v2H1zM5 7h2v4H5zM9 4h2v7H9zM13 1h2v10h-2z" fill="currentColor"/></svg><svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 2.5c2.4 0 4.6.9 6.2 2.5l1.1-1.1A10.3 10.3 0 0 0 8 1C5.2 1 2.6 2.1.7 3.9L1.8 5C3.4 3.4 5.6 2.5 8 2.5zm0 3c1.6 0 3 .6 4.1 1.6l1.1-1.1A7.4 7.4 0 0 0 8 4a7.4 7.4 0 0 0-5.2 2l1.1 1.1C5 6.1 6.4 5.5 8 5.5zm0 3c.8 0 1.5.3 2 .8L8 11.3 6 9.3c.5-.5 1.2-.8 2-.8z" fill="currentColor"/></svg><svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".45"/><rect x="2" y="2" width="20" height="9" rx="2.2" fill="currentColor"/></svg></span>';
  var FP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5a8.5 8.5 0 0 0-8.5 8.5M12 3.5a8.5 8.5 0 0 1 8.5 8.5M7.2 19.5A8.4 8.4 0 0 1 6 12a6 6 0 0 1 12 0c0 2.4-.4 4.6-1.2 6.6M9 20.5A11 11 0 0 1 8.6 12a3.4 3.4 0 0 1 6.8 0c0 3-.4 5.6-1.3 8M12 12c0 3.5-.5 6.5-1.7 9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  var ICON_THEME = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4.5 12a7.5 7.5 0 0 0 15 0z" fill="currentColor"/></svg>';
  var ICON_SEARCH = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15 15l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  // the Action box (Home page 1), the Consistency box (page 2) and the Clarity box, as Home draws them today
  function actionBox(o) {
    o = o || {};
    return '<div class="hb hb-action' + (o.done ? ' done' : '') + '"><div class="hb-k">Action' + (o.done ? '<span class="hb-done">Done</span>' : '') + '</div>' +
      '<div class="hb-t">' + (o.title || '3 hours of deep work on the product.') + '</div>' +
      '<div class="hb-s">' + (o.sub || 'open the file where you stopped yesterday.') + '</div>' +
      '<div class="hb-hold"><i class="fill" style="width:' + Math.round((o.hold || 0) * 100) + '%"></i><span>' + FP + (o.done ? 'Completed' : 'Hold to complete') + '</span></div></div>';
  }
  function consistencyBox(o) {
    o = o || {}; var n = o.n == null ? 4 : o.n, days = 'MTWTFSS'.split('');
    return '<div class="hb hb-cons"><div class="hb-k">Consistency</div><div class="hb-big"><b>' + n + '</b><span>of 5 this week</span></div>' +
      '<div class="hb-dots">' + days.map(function (d, i) { return '<span class="' + (i < n ? 'on' : '') + '"><i></i>' + d + '</span>'; }).join('') + '</div>' +
      '<div class="hb-s small">Five sessions make a full week. Rest days don’t count against you.</div></div>';
  }
  function clarityBox() {
    return '<div class="hb hb-clar"><div class="hb-k">Clarity</div><div class="hb-big"><b>$6,400</b><span>of $10,000</span></div><div class="hb-bar"><i style="width:64%"></i></div><div class="hb-s small">Up $600 this week.</div></div>';
  }
  // iPhone Home: a 390 x 844 screen scaled to fit `w` css px wide
  function phoneHome(parent, o) {
    o = o || {};
    var fig = el('div', 'dev dev-phone', null, parent), scr = el('div', 'scr', null, fig);
    var room = el('div', 'room', null, scr);
    el('div', 'sbar', SB, scr);
    var ui = el('div', 'home', null, scr);
    ui.innerHTML = '<div class="h-top"><span class="h-wm">' + mark() + '<span>emento</span></span><span class="h-av">' + (o.initial || 'M') + '</span></div>' +
      '<div class="h-hi">' + (o.hi || 'Good evening, Malik.') + '</div><div class="h-date">' + (o.date || 'Tuesday, October 13') + '</div>';
    var slot = el('div', 'h-card', null, ui), cardHost = el('div', 'k-host', null, slot);
    var pill = el('span', 'h-pill', '3 cards waiting', slot);
    var boxes = el('div', 'h-boxes', null, ui);
    el('div', 'h-bar', '<span class="gl circ">' + ICON_THEME + '</span><span class="gl dots"><i class="on"></i><i></i><i></i></span><span class="gl circ">' + ICON_SEARCH + '</span>', ui);
    var lk = o.look || LOOKS[0];
    var cd = card(cardHost, { look: lk, w: 209, chan: o.chan || null });
    var wl = wall(room, { bg: lk.bg, skin: lk.skin, card: cd, dprK: o.dprK || 0.5 });
    cd.wall = wl;
    boxes.innerHTML = o.boxes == null ? actionBox() : o.boxes;
    function fit(w) { fig.style.setProperty('--w', w + 'px'); fig.style.setProperty('--s', w / 390); }
    fit(o.w || 300);
    return { el: fig, scr: scr, ui: ui, card: cd, wall: wl, boxes: boxes, pill: pill, slot: slot, fit: fit,
      look: function (l, fade) { cd.set(l, fade); wl.look(l, fade); scr.dataset.look = l.id; } };
  }
  // iPad Home, held sideways: a 1180 x 820 screen. The card on the left half, the boxes stacked on the right.
  function padHome(parent, o) {
    o = o || {};
    var fig = el('div', 'dev dev-pad', null, parent), scr = el('div', 'scr', null, fig);
    var room = el('div', 'room', null, scr);
    el('div', 'sbar', '<span class="sb-t">9:41 AM&nbsp;&nbsp;Tue Oct 13</span><span class="sb-i">100%</span>', scr);
    var ui = el('div', 'home pad', null, scr);
    ui.innerHTML = '<div class="h-top"><span class="h-wm">' + mark() + '<span>emento</span></span><span class="h-av">' + (o.initial || 'M') + '</span></div>' +
      '<div class="h-hi">' + (o.hi || 'Good morning, Malik.') + '</div><div class="h-date">Tuesday, October 13 &middot; Day 41</div>';
    var left = el('div', 'p-left', null, ui), slot = el('div', 'h-card', null, left), cardHost = el('div', 'k-host', null, slot);
    var right = el('div', 'p-right', null, ui);
    right.innerHTML = actionBox({ title: 'Send three cold emails.', sub: 'start with the two who opened last week.' }) + '<div class="p-row">' + clarityBox() + consistencyBox({ n: 3 }) + '</div>';
    el('div', 'h-bar', '<span class="gl circ">' + ICON_THEME + '</span><span class="gl circ">' + ICON_SEARCH + '</span>', ui);
    var lk = o.look || LOOKS[0];
    var cd = card(cardHost, { look: lk, w: 300 });
    var wl = wall(room, { bg: lk.bg, skin: lk.skin, card: cd, dprK: o.dprK || 0.45 });
    cd.wall = wl;
    function fit(w) { fig.style.setProperty('--w', w + 'px'); fig.style.setProperty('--s', w / 1180); }
    fit(o.w || 760);
    return { el: fig, card: cd, wall: wl, fit: fit,
      look: function (l, fade) { cd.set(l, fade); wl.look(l, fade); scr.dataset.look = l.id; } };
  }

  // ---------------------------------------------------------------- the look picker (the earned looks)
  function swatchCss(lk) {
    var s = skinOf(lk.skin), I = inputsOf(lk), p = I.pal || [[.5, .5, .5], [.4, .4, .4], [.2, .2, .2]];
    var c = function (v, a) { return 'rgba(' + v.map(function (x) { return Math.round(x * 255); }).join(',') + ',' + a + ')'; };
    if (lk.id === 'glass') return 'linear-gradient(160deg,rgba(255,255,255,.55),rgba(255,255,255,.08) 55%,rgba(255,255,255,.3))';
    if (lk.id === 'titanium') return 'linear-gradient(160deg,#cfc9c1,#8e877e 60%,#b9b2a9)';
    if (lk.id === 'midas') return 'linear-gradient(160deg,#fff1b8,#d6a028 45%,#7a4f08 80%,#f3cf6a)';
    if (lk.id === 'bismuth') return 'linear-gradient(160deg,#e3a9ff,#57d2ff 35%,#ffd36b 65%,#ff6fa8)';
    if (lk.id === 'thermal') return 'linear-gradient(160deg,#1a0640,#8a1cd8 35%,#ff3d8f 60%,#ffb12c 85%,#fff6d8)';
    if (lk.id === 'house') return 'linear-gradient(160deg,#74eaff,#80a0ff 50%,#38ec47)';
    return 'linear-gradient(160deg,' + c(p[0], 1) + ',' + c(p[1], 1) + ' 55%,' + c(p[2], 1) + ')';
  }
  function picker(parent, o) {
    o = o || {};
    var list = o.withHouse ? LOOKS : EARNED, row = el('div', 'lk-row' + (o.cls ? ' ' + o.cls : ''), null, parent);
    row.setAttribute('role', 'group'); row.setAttribute('aria-label', 'Try a look');
    var btns = list.map(function (lk) {
      var b = el('button', 'lk', '<i style="background:' + swatchCss(lk) + '"></i><span><b>' + lk.name + '</b><small>' + lk.sub + '</small></span>', row);
      b.type = 'button'; b.dataset.id = lk.id;
      b.addEventListener('click', function () { o.onPick && o.onPick(lk, true); });
      return b;
    });
    return { el: row, mark: function (id) { btns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.id === id ? 'true' : 'false'); }); } };
  }

  // ---------------------------------------------------------------- sign-up sheet, letter, footer (copy from the live page)
  var BH_FORM = '00d2e169-0ad8-422d-bf41-f7ccbf944ca5', BH_PAGE = 'https://maliks-newsletter-59a34c.beehiiv.com/', DISCORD = 'https://discord.gg/UNbPAUc3y4';
  var SIGNUP_FORM = LIVE ? '<div class="bhwrap"><div class="bh"></div></div><a class="bh-fallback" href="' + BH_PAGE + '" target="_blank" rel="noopener noreferrer">Can’t see the form? Join here →</a>' :
    '<form class="su-form" novalidate><input type="email" placeholder="Email" aria-label="Email" autocomplete="off"><button type="submit">Join</button></form><p class="su-done" hidden>Mockup: nothing was sent.</p>';
  function wireForms(root) {
    // Beehiiv's loader draws its form (a cross-origin iframe) next to its own script tag
    root.querySelectorAll('.bh').forEach(function (b) {
      var sc = document.createElement('script'); sc.async = true; sc.src = 'https://subscribe-forms.beehiiv.com/v3/loader.js'; sc.setAttribute('data-beehiiv-form', BH_FORM); b.appendChild(sc);
    });
    root.querySelectorAll('.su-form').forEach(function (f) {
      f.addEventListener('submit', function (e) { e.preventDefault(); var d = f.nextElementSibling; if (d) d.hidden = false; });
    });
  }
  var sheet = null, opener = null;
  function closeSheet() { sheet.classList.remove('on'); if (opener && opener.focus) opener.focus({ preventScroll: true }); }
  function makeSheet() {
    if (!sheet) {
      sheet = el('div', 'sheet', '<div class="sheet-bg" data-x></div><div class="sheet-card glass"><button class="sheet-x" type="button" aria-label="Close" data-x>&times;</button>' +
        '<h2>Join for Updates + Discount.</h2><p class="lead">I never spam, don’t worry lol</p>' + SIGNUP_FORM +
        '<p class="small">Want to see it being built? Come hang out in the <a href="' + DISCORD + '" target="_blank" rel="noopener noreferrer">Discord</a>.</p><p class="small dim">You can unsubscribe anytime.</p></div>', document.body);
      sheet.addEventListener('click', function (e) { if (e.target.hasAttribute('data-x')) closeSheet(); });
      addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet.classList.contains('on')) closeSheet(); });
      wireForms(sheet);
    }
  }
  // live: the sheet (and its form) is built soon after load, so the form is ready the first time it opens
  if (LIVE) addEventListener('load', function () { setTimeout(makeSheet, 1200); });
  function openSheet() {
    makeSheet();
    opener = document.activeElement;
    requestAnimationFrame(function () { sheet.classList.add('on'); setTimeout(function () { var i = sheet.querySelector('input'); if (i && innerWidth > 979) i.focus({ preventScroll: true }); }, 320); });
  }
  function signupSection(parent, cls) {
    var s = el('section', 'su ' + (cls || ''), '<h2>Join for Updates + Discount.</h2><p class="lead">I never spam, don’t worry lol</p>' + SIGNUP_FORM +
      '<p class="small">Want to see it being built? Come hang out in the <a href="' + DISCORD + '" target="_blank" rel="noopener noreferrer">Discord</a>.</p><p class="small dim">You can unsubscribe anytime.</p>', parent);
    wireForms(s); return s;
  }
  function letter(parent, cls) {
    return el('section', 'letter ' + (cls || ''), '<h2>Personal Note:</h2><p class="hello">Hello :)</p>' +
      '<p>I’ve been building Memento in the background for months, to help you beyond just videos.</p>' +
      '<p>The modern world makes it easier and easier to fall into comfort and mediocrity, and most people never break out. If you’re reading this, I’d bet your biggest fear is leaving this world knowing you didn’t get the most out of your life.</p>' +
      '<p>We need a foundation, a Memento that keeps us going when we inevitably run into resistance. That’s what I’m building. I can’t wait for you to build your own.</p>' +
      '<p class="sig">- Malik Peace</p><p class="tag">#getthemostoutofyourexistence</p>', parent);
  }
  function footer(parent) { return el('footer', 'foot', '<span>Built by <a href="https://www.youtube.com/@malikpeace_" target="_blank" rel="noopener noreferrer">Malik Peace</a></span><nav><a href="https://mementoapp.co/privacy/">Privacy</a><a href="https://mementoapp.co/terms/">Terms</a></nav>', parent); }
  function header(parent, o) {
    o = o || {};
    return el('header', 'top', wordmark() + '<span class="top-r"><span class="beta"><i></i>Currently in private beta</span>' +
      (o.cta ? '<button class="cta cta-sm" type="button" data-join><span class="l-full">Join for Updates + Discount</span><span class="l-short">Join</span></button>' : '') + '</span>', parent);
  }
  // phones: the sign-up button never leaves the screen (it steps aside only while the sign-up form itself is showing)
  function stickyBar(parent, hideWhen) {
    var b = el('div', 'stickybar', '<button class="cta" type="button" data-join>Join for Updates + Discount</button>', parent);
    if (hideWhen && window.IntersectionObserver) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { b.classList.toggle('away', e.isIntersecting); }); }, { threshold: 0.35 });
      io.observe(hideWhen);
    }
    return b;
  }

  return { LOOKS: LOOKS, LBY: LBY, EARNED: EARNED, card: card, wall: wall, houseRoles: houseRoles, phoneHome: phoneHome, padHome: padHome,
    actionBox: actionBox, consistencyBox: consistencyBox, clarityBox: clarityBox, picker: picker, openSheet: openSheet, signupSection: signupSection,
    letter: letter, footer: footer, header: header, stickyBar: stickyBar, nameLook: nameLook, wordmark: wordmark, mark: mark, el: el, lerp: lerp, lerpA: lerpA, clamp: clamp, ease: ease,
    redrawAll: redrawAll, RM: RM, BAR: BAR, LIVE: LIVE, CLEAN: CLEAN, DPR: DPR, ok: !!(CR && WR), cards: function () { return cards; }, walls: function () { return walls; } };
})();
