/* Shared page behaviour for the landing mockups: scroll reveals, the name field
   (with an optional auto-typing demo until the visitor types), the Beehiiv fallback,
   and "scroll to the list" links. Requires memento-card.js. */
(function (ML) {
  'use strict';

  ML.reveal = function (sel) {
    var els = document.querySelectorAll(sel || '.rv');
    if (!('IntersectionObserver' in window) || ML.REDUCE) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  };

  /* Beehiiv injects a cross-origin iframe; only if it never shows do we offer the link */
  ML.beehiivFallback = function (box, link) {
    setTimeout(function () { if (!box.querySelector('iframe')) link.classList.add('is-on'); }, 5000);
  };

  ML.toList = function (sel, target) {
    document.querySelectorAll(sel).forEach(function (a) {
      a.addEventListener('click', function (e) {
        var t = document.querySelector(target); if (!t) return;
        e.preventDefault();
        t.scrollIntoView({ behavior: ML.REDUCE ? 'auto' : 'smooth', block: 'center' });
      });
    });
  };

  /* The name field. o = { card, sky, waterfall, onChange(info|null), demo:[names], empty(): what an empty field shows } */
  /* o.apply(info|null, isDemo), when given, decides what the card does (Evolve's story card
     only takes the name while its chapter is on screen). The page only re-colours for a name
     the visitor typed (or had saved), never for the demo cycling on its own. */
  ML.bindName = function (input, o) {
    var timer = null, demoOn = false, demoIdx = 0, stopped = false;
    function show(v, save, user) {
      var info = ML.nameInfo(v);
      if (user === undefined) user = save;
      if (o.apply) {
        o.apply(info, !user);
        ML.themeRoot(user ? info : null);
        if (save) { try { if (info) localStorage.setItem('mementoName', info.name); else localStorage.removeItem('mementoName'); } catch (e) {} }
        if (o.onChange) o.onChange(info, !user);
        return;
      }
      if (!info) {
        if (o.empty) o.empty(); else { o.card.cortex(false); o.card.house({ clar: 1, act: 1, cons: 1 }, 900); o.card.engrave(''); }
        ML.themeRoot(null);
        if (o.sky) o.sky.reset(1400);
        if (o.waterfall) o.waterfall.reset(1400);
        if (save) { try { localStorage.removeItem('mementoName'); } catch (e) {} }
        if (o.onChange) o.onChange(null);
        return;
      }
      ML.applyName(o.card, info, 900);
      ML.themeRoot(info);
      if (o.sky) o.sky.colors(info.sky, 1400);
      if (o.waterfall) o.waterfall.colors(info.sky, 1400);
      if (save) { try { localStorage.setItem('mementoName', info.name); } catch (e) {} }
      if (o.onChange) o.onChange(info, !save);
    }
    function stopDemo() {
      if (stopped) return; stopped = true; input.dataset.userTyped = '1';
      if (demoOn) { demoOn = false; input.value = ''; show('', false); }
    }
    input.addEventListener('focus', stopDemo);
    input.addEventListener('pointerdown', stopDemo);
    input.addEventListener('input', function () {
      stopDemo(); clearTimeout(timer);
      var v = input.value;
      timer = setTimeout(function () { show(v, true); }, v.trim() ? 220 : 0);
    });

    var saved = null; try { saved = localStorage.getItem('mementoName'); } catch (e) {}
    if (saved) { input.value = saved; stopped = true; input.dataset.userTyped = '1'; show(saved, false, true); return; }
    show('', false);
    if (o.demo && o.demo.length && !ML.REDUCE) {
      var run = function () {
        if (stopped) return; demoOn = true;
        ML.typeInto(input, o.demo[demoIdx++ % o.demo.length], function () {
          if (stopped) return;
          show(input.value, false);          /* the card changes once the name is complete */
          setTimeout(function () {
            if (stopped) return;
            (function erase() {
              if (stopped) return;
              input.value = input.value.slice(0, -1);
              if (input.value) setTimeout(erase, 38); else setTimeout(run, 380);
            })();
          }, 1900);
        });
      };
      setTimeout(run, o.demoDelay || 2200);
    }
  };

  /* Drifting rows of real Mementos, built to work on every phone.
     Each row used to be a ~5,500pt-wide strip of 49 canvases sliding across the screen. On a
     real iPhone that strip is a huge GPU layer, and Safari drops it under memory pressure, so
     the rows came in late or never. Now the whole thing is ONE screen-wide 2D canvas. Every
     card is rendered once into a small sprite (WebGL card, then the M and the name drawn on
     top), and each frame draws only the few cards that are on screen. Cards appear a few per
     frame over a colour stand-in, so the rows are never blank, and without WebGL the stand-ins
     simply stay. Drawing stops while the rows are off screen. */
  ML.drift = function (wrap, lists, o) {
    o = o || {};
    var SPEED = o.speeds || [43, -37], GAP = 18, ROWGAP = 24, TOP = 40, BOTTOM = 40;
    var M_PATH = new Path2D('M150 146 L256 252 L362 146 L362 366 L150 366 Z');
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var cv = document.createElement('canvas'); cv.setAttribute('aria-hidden', 'true');
    cv.style.cssText = 'display:block;width:100%';
    wrap.appendChild(cv);
    var ctx = cv.getContext('2d');
    var rows = lists.map(function (names) { return names.map(function (n) { return { info: ML.nameInfo(n), img: null, at: 0 }; }); });
    var W = 0, H = 0, cw = 0, ch = 0, pad = 0, fade = null, visible = true, gen = 0, t0 = performance.now();

    function cardW() { return Math.max(92, Math.min(innerWidth * 0.088, 124)); }
    function rrect(c, x, y, w, h, r) {
      c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
    }
    /* the M and the name, drawn the way the DOM card draws them */
    function decorate(c, info) {
      var s = 0.37 * cw / 512;
      c.save(); c.translate(pad + cw / 2 - 256 * s, pad + ch / 2 - 256 * s);
      c.save(); c.translate(0, 1); c.scale(s, s); c.fillStyle = 'rgba(255,255,255,0.3)'; c.fill(M_PATH); c.restore();
      c.save(); c.translate(0, -1); c.scale(s, s); c.fillStyle = 'rgba(0,0,0,0.55)'; c.fill(M_PATH); c.restore();
      c.scale(s, s); c.fillStyle = info.mark; c.fill(M_PATH);
      c.restore();
      var f = Math.max(4.5, Math.min(innerWidth * 0.0045, 6.2)), x = pad + 0.085 * cw, y = pad + ch * (1 - 0.052) - f * 0.28;
      c.font = '700 ' + f + 'px Arial, "Helvetica Neue", Helvetica, sans-serif';
      c.fillStyle = info.ink || 'rgba(236,240,246,.7)'; c.textBaseline = 'alphabetic';
      String(info.name).toUpperCase().split('').forEach(function (ch1) { c.fillText(ch1, x, y); x += c.measureText(ch1).width + f * 0.15; });
    }
    /* the stand-in: the material's own colour on a card shape */
    function standIn(x, y, info, a) {
      var tint = info.tint || '120,130,140', g = ctx.createRadialGradient(x + cw * 0.3, y + ch * 0.2, 0, x + cw * 0.3, y + ch * 0.2, ch);
      g.addColorStop(0, 'rgba(' + tint + ',0.55)'); g.addColorStop(0.6, 'rgba(' + tint + ',0.12)'); g.addColorStop(1, 'rgba(10,12,14,0.9)');
      ctx.globalAlpha = a; ctx.fillStyle = g; rrect(ctx, x, y, cw, ch, cw * 14 / 320); ctx.fill(); ctx.globalAlpha = 1;
    }
    function layout() {
      var ncw = cardW(), rebuild = Math.abs(ncw - cw) > 0.5;
      cw = ncw; ch = cw / ML.ASPECT; pad = Math.round(Math.max(28, cw * 0.18));
      W = wrap.clientWidth; H = Math.ceil(TOP + ch * 2 + ROWGAP + BOTTOM);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + 'px';
      fade = ctx.createLinearGradient(0, 0, W, 0);
      fade.addColorStop(0, 'rgba(0,0,0,0)'); fade.addColorStop(0.1, '#000'); fade.addColorStop(0.9, '#000'); fade.addColorStop(1, 'rgba(0,0,0,0)');
      if (rebuild) build();
    }
    function build() {
      var my = ++gen;
      rows.forEach(function (r) { r.forEach(function (c) { c.img = null; }); });
      var jobs = [], n = Math.max.apply(null, rows.map(function (r) { return r.length; }));
      for (var k = 0; k < n; k++) rows.forEach(function (r) { if (r[k]) jobs.push(r[k]); });   /* the cards in view on both rows first */
      var host = document.createElement('div'); host.style.cssText = 'position:fixed;left:-3000px;top:0;width:' + cw + 'px';
      document.body.appendChild(host);
      var snap = new ML.Card(host, {});
      if (!snap.gl) { host.remove(); return; }
      var sw = snap.cv.width, sh = snap.cv.height, sd = snap.dpr, i = 0;
      pad = snap.pad;
      (function batch() {
        if (my !== gen) { snap.destroy(); host.remove(); return; }
        for (var b = 0; b < 6 && i < jobs.length; b++, i++) {
          var j = jobs[i], sp = document.createElement('canvas'); sp.width = sw; sp.height = sh;
          var c = sp.getContext('2d');
          snap.cur = JSON.parse(JSON.stringify(j.info.inputs)); snap.to = null; snap.draw(20);
          c.drawImage(snap.cv, 0, 0); c.scale(sd, sd); decorate(c, j.info);
          j.img = sp; j.at = performance.now();
        }
        if (i < jobs.length) requestAnimationFrame(batch); else { snap.destroy(); host.remove(); }
      })();
    }
    function frame(now) {
      requestAnimationFrame(frame);
      if (!visible || !W) return;
      var t = ML.REDUCE ? 0 : (now - t0) / 1000, step = cw + GAP;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, H);
      rows.forEach(function (row, r) {
        var n = row.length, setW = n * step, off = ((SPEED[r] * t + r * step * 0.5) % setW + setW) % setW, y = TOP + r * (ch + ROWGAP);
        for (var i = Math.floor((off - pad) / step) - 1, x = i * step - off; x < W + pad; i++, x = i * step - off) {
          if (x + cw + pad < 0) continue;
          var c = row[((i % n) + n) % n], a = c.img ? Math.min(1, (now - c.at) / 450) : 0;
          if (a < 1) standIn(x, y, c.info, 1 - a);
          if (a > 0) { ctx.globalAlpha = a; ctx.drawImage(c.img, x - pad, y - pad, cw + 2 * pad, ch + 2 * pad); ctx.globalAlpha = 1; }
        }
      });
      ctx.globalCompositeOperation = 'destination-in'; ctx.fillStyle = fade; ctx.fillRect(0, 0, W, H);   /* soft left and right edges */
      ctx.globalCompositeOperation = 'source-over';
    }
    layout();
    var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(layout, 150); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { rootMargin: '200px' }).observe(wrap);
    requestAnimationFrame(frame);
  };

})(window.ML);
