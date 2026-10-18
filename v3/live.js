// live.js: boots the landing page on mementoapp.co (the mockup's switcher, minus the switcher)
(function () {
  var cur = DIR_A.build(document.getElementById('app'));
  addEventListener('scroll', function () { cur && cur.onScroll && cur.onScroll(); }, { passive: true });
  var rt = 0; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { cur && cur.onResize && cur.onResize(); }, 120); });
  window.__built = true;
})();
