// mementoapp.co, refined (round 5, Malik 2026-10-17). The story runs on the LIVE page's card (memento-card.js: its colours
// build up chapter by chapter, Evolve turns it Frost Aurora) over the app's real Home backgrounds; the looks and the
// name run on the app's skins card (engine.js). Sign-up reachable everywhere (header button on wide screens, a bar that
// never leaves the screen on phones). Keep Going burns the app's Consistency fire (fire.js); Evolve's room is an
// Aurora lit in the card's own Frost Aurora colours.
var DIR_A = (function () {
  var E = K.el;
  var STEPS = [
    { id: 'hero', scale: 1, big: true }, { id: 'who', scale: 1 }, { id: 'blank', scale: 1 }, { id: 'clarity', scale: 1 }, { id: 'action', scale: 1 },
    { id: 'keep', scale: 1 }, { id: 'evolve', scale: 1 }, { id: 'looks', scale: 1 }, { id: 'name', scale: 1 }
  ];
  var TEXT = {
    hero: '<h1 class="sr">Memento</h1><div class="a-wmslot" aria-hidden="true"></div><button class="cta a-cta-d" type="button" data-join>Join for Updates + Discount</button>',
    who: '<h2>Who This Is For:</h2><p>Memento is for people who are actually serious about getting more out of their life and are ready to do something about it.</p>',
    blank: '<h2>First, It’s Blank.</h2><p>Your Memento starts like this.</p>',
    clarity: '<h2>Then, You Find Clarity.</h2><p>We find exactly what you want, why you want it, in detail.</p>',
    action: '<h2>Next, You Take Action.</h2><p>We find the single highest-leverage actions you can do today to move you towards your goal. Adjustable to make sure you actually do them.</p>',
    keep: '<h2>Finally, You Keep Going.</h2><p>Memento tracks all of your actions and progress and helps keep you going.</p>',
    evolve: '<h2>Evolve.</h2><p>Your Memento evolves with you as you continue to make progress and achieve more.</p>',
    looks: '<h2>Make Memento Yours.</h2><p>As you continue to show up, more Memento styles will be unlocked to show how far you’ve come.</p>',
    name: '<h2>See What Yours Looks Like.</h2><p>Type your name to see your Memento.</p>'
  };
  // Who Memento is for: one small line icon per kind of person (stroke icons, currentColor)
  // Who Memento is for, three ways (Malik 2026-10-17: the icons may read cheap, and "you" repeats nine times)
  var ST = ' fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"';
  var WHO_ICONS = [
    ['<path d="M5.5 2.5h9M5.5 17.5h9"' + ST + '/><path d="M6.5 2.5v1.6c0 2.3 3.5 3.7 3.5 5.9 0 2.2-3.5 3.6-3.5 5.9v1.6M13.5 2.5v1.6c0 2.3-3.5 3.7-3.5 5.9 0 2.2 3.5 3.6 3.5 5.9v1.6"' + ST + '/><path d="M8.2 15.6c.6-1.1 1.2-1.6 1.8-1.6s1.2.5 1.8 1.6z" fill="currentColor"/>', 'You understand <b>life is limited</b> and want to maximize it.'],
    ['<path d="M2 10h3l1.6-4 2.2 8 1.7-4H18"' + ST + '/>', 'You fear living a <b>mediocre life</b>.'],
    ['<circle cx="10" cy="10" r="7"' + ST + ' opacity=".35"/><path d="M10 3a7 7 0 0 1 2.4.42"' + ST + '/><circle cx="10" cy="10" r="1" fill="currentColor"/>', 'You’re ambitious, but <b>struggle to get started</b>.'],
    ['<circle cx="10" cy="10" r="7.2"' + ST + '/><circle cx="10" cy="10" r="4.2"' + ST + '/><circle cx="10" cy="10" r="1.2" fill="currentColor"/>', 'You know what to do, but <b>can’t stay focused</b>.'],
    ['<circle cx="12.6" cy="5.4" r="1.7"' + ST + '/><path d="M11.2 7.6c-1.7.4-3.3 1.6-3.9 3.3l-.6 1.9M10.3 9.6l.4 3.3-1.6 4.6M10.7 12.9l2.5 1.6.6 3M7.6 9.8l-2.4 1.4"' + ST + '/>', 'You start strong, then <b>fall off after a week</b>.'],
    ['<path d="M10 2.6a5.2 5.2 0 0 0-3.1 9.4c.6.5 1 1.2 1 2v.5h4.2V14c0-.8.4-1.5 1-2A5.2 5.2 0 0 0 10 2.6zM8.1 17.3h3.8"' + ST + '/>', 'You have a <b>creative mind</b> and/or want to do something <b>entrepreneurial</b>.'],
    ['<path d="M1.8 8.2L10 4.2l8.2 4-8.2 4z"' + ST + '/><path d="M5 9.8v3.4c0 1.1 2.2 2.3 5 2.3s5-1.2 5-2.3V9.8M18.2 8.2v4.3"' + ST + '/>', 'You’re in school and want to be at the <b>top of your class</b>.'],
    ['<rect x="5.8" y="2.3" width="8.4" height="15.4" rx="2.2"' + ST + '/><path d="M8.8 14.9h2.4"' + ST + '/>', 'You want to <b>reduce your screen time</b> to gain years back of your life.'],
    ['<path d="M11.3 2.2L4.4 11.3h5.1l-1 6.5 7-9.3h-5.2z"' + ST + '/>', 'You just want a little <b>more motivation</b> to keep going.']
  ];
  // Malik's list (2026-10-17), word for word: never shorten or reword it ([[never-rewrite-his-copy]])
  var WHO_GROUPS = [
    ['', ['You understand life is limited and want to maximize it.', 'You fear living a mediocre life.', 'You’re ambitious, but struggle to get started.',
      'You know what to do, but can’t stay focused.', 'You start strong, then fall off after a week.', 'You have a creative mind and/or want to do something entrepreneurial.',
      'You’re in school and want to be at the top of your class.', 'You want to reduce your screen time to gain years back of your life.', 'You just want a little more motivation to keep going.']]
  ];
  var CHECK = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 8.4l2.6 2.6L12 5.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var WHO_LINES = {
    none: '<b>If you’re any of these, Memento is directly for you.</b> Here’s how it works:',
    want: '<b>Since this is you, Memento helps you directly.</b> Here’s how it works:',
    hard: '<b>Since this is you, Memento helps you directly.</b> Here’s how it works:'
  };
  // iOS Settings-style grouped lists: each group's heading sits right on its card; one card per group, inset separators,
  // no bullets; a tapped line turns green with a check on the right
  // "Specifically for:" is a glass row that opens the full list (Malik 2026-10-18: minimal, less wordy); his words unchanged inside
  var CHEV = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5.5 8l4.5 4.5L14.5 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function whoView() {
    var lines = WHO_GROUPS[0][1];
    return '<div class="who-wrap"><button type="button" class="who-toggle glass" aria-expanded="false" aria-controls="whoDrop"><span>Specifically for:</span>' + CHEV + '</button>' +
      '<div class="who-drop" id="whoDrop"><ul class="who-card glass">' + lines.map(function (t) {
        return '<li class="wr"><button type="button" class="wli" data-g="0" aria-pressed="false"><span>' + t + '</span><i>' + CHECK + '</i></button></li>'; }).join('') + '</ul>' +
      '<p class="who-tap wr">Tap all that apply</p><p class="a-who-end" data-whoend>' + WHO_LINES.none + '</p></div></div>';
  }
  // a ring split in five, three of them lit: "3 of 5 days this week"
  var TICKS = 44, GOAL = 80, SCORE = 86;   // the consistency score: rate against their own goal, out of 100
  var SEG5 = (function () {
    var r = 8, C = 2 * Math.PI * r, seg = C / 5, gap = 2.6, out = '<svg class="a-ring" viewBox="0 0 20 20" aria-hidden="true">';
    for (var k = 0; k < 5; k++) out += '<circle cx="10" cy="10" r="' + r + '" fill="none" stroke="' + (k < 3 ? '#3fd94e' : 'rgba(255,255,255,0.16)') + '" stroke-width="2.6" stroke-dasharray="' + (seg - gap).toFixed(2) + ' ' + (C - seg + gap).toFixed(2) + '" stroke-dashoffset="' + (-k * seg).toFixed(2) + '" transform="rotate(-90 10 10)"/>';
    return out + '</svg>';
  })();
  var RING = '<svg class="a-ring" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="3"/><circle class="arc" cx="18" cy="18" r="15" fill="none" stroke="#f3f6f9" stroke-width="3" stroke-linecap="round" stroke-dasharray="94.2" stroke-dashoffset="34" transform="rotate(-90 18 18)"/></svg>';
  var SI = ' fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
  // coming soon: store-style badges (black, hairline border, mark + two lines, like the stores' own). At launch these become the
  // stores' official, unmodified badges.
  var APPLE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>';
  var GPLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z"/></svg>';
  var SOON = '<div class="a-soon"><div class="a-soon-b"><span class="a-badge">' + APPLE + '<span><small>Coming soon to the</small><b>App Store</b></span></span><span class="a-badge">' + GPLAY + '<span><small>Coming soon to</small><b>Google Play</b></span></span></div><p class="a-also">Also coming to iPadOS, macOS and the web.</p></div>';
  var PANELS = {
    hero: SOON,
    who: whoView(),

    clarity: '<div class="a-clar2"><div class="a-seg glass" role="group" aria-label="Examples"><i class="a-seg-pill"></i>' + ['Fitness', 'Screen time', 'Business', 'School', 'Creator'].map(function (n, i) { return '<button type="button" data-p="' + i + '">' + n + '</button>'; }).join('') + '</div>' +
      '<div class="a-cbody glass a-cbox"><div class="a-cq"><small>What do you actually want?</small><b data-what></b></div><div class="a-cq"><small>Why does that matter to you?</small><b data-why></b></div>' +
      '</div><div class="a-cbody glass a-cbox a-cstage"><div class="a-cpath"><small>Your stages</small><div data-stages></div></div></div></div>',
    action: '<ul class="a-acts glass">' +
      '<li class="auto"><i class="ic chk"><svg viewBox="0 0 20 20"><path d="M5 10.5l3.2 3.2L15 6.8" fill="none" stroke="#06210b" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></i><span>Send three cold emails</span><em>Today</em></li>' +
      '<li class="timer"><i class="ic">' + RING + '</i><span>Deep work on the product</span><em class="clock" data-clock>1:12:40</em></li>' +
      '<li><i class="ic cal"><svg viewBox="0 0 20 20"><rect x="3.5" y="4.5" width="13" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3.5 8.5h13M7 2.8v3M13 2.8v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></i><span>Go for a 3 mile run</span><em class="chip">Tomorrow, 6:30 AM</em></li>' +
      '<li><i class="ic">' + SEG5 + '</i><span>Phone away by 10pm</span><em>3 of 5 days</em></li></ul>',
    keep: '<div class="a-keep glass"><div class="a-k-top"><span>Total actions completed</span><b><svg class="a-flame" viewBox="0 0 16 20" aria-hidden="true"><path d="M8 1.5c.6 3-2.6 4.6-2.6 8 0 1 .4 1.8 1 2.4-.2-1.8.9-3 2.1-3.9-.1 2.3 2.6 3.3 2.6 5.6 0 2-1.6 3.4-3.1 3.4C4.6 17 2.5 14.8 2.5 12c0-5 5.5-6.4 5.5-10.5z" fill="#3fd94e"/><path d="M11.8 7.2c1.2 1.2 1.9 2.9 1.9 4.8 0 2.4-1.4 4.4-3.5 5.1.9-.8 1.4-1.9 1.4-3.1 0-2.6-2-3.6-1.6-6.1.6.4 1.2.9 1.8 1.6z" fill="#9dff9f" opacity=".85"/></svg><span data-acts>0</span></b></div>' +
      '<div class="a-score"><span>Consistency score</span><b><span data-score>0</span><small> / 100</small></b></div>' +
      '<div class="a-ticks" data-ticks>' + new Array(TICKS + 1).join('<i></i>') + '<u class="a-goal" style="left:' + GOAL + '%"></u></div>' +
      '<div class="a-k-cap"><span>Up from 50</span><span>Your goal: ' + GOAL + '</span></div>' +
      '<div class="a-k-row first"><span>Run 3x a week</span><span class="a-k-runs" data-runs><i></i><i></i><i></i></span><b data-runsv>0 of 3</b></div>' +
      '<div class="a-k-row"><span>Lose 10 lbs by Dec 1</span><span class="a-k-bar"><i data-lbs></i></span><b data-lbsv>0 of 10 lbs</b></div>' +
      '<div class="a-k-row"><span>Screen time under 2h</span><span class="a-k-bar"><i data-rate></i></span><b data-ratev>0% rate</b></div></div>',
    looks: '<div class="a-now"><div class="a-now-t"><b data-ln></b></div><div class="a-dots">' + K.EARNED.map(function () { return '<i></i>'; }).join('') + '</div></div>',
    name: '<input class="a-name" type="text" placeholder="Your name" aria-label="Your name" autocomplete="given-name" maxlength="24" spellcheck="false"><button class="cta a-name-cta" type="button" data-join>Join for Updates + Discount</button>'
  };
  // the live page's looks (index.html on mementoapp.co, verbatim)
  // black glass for Who This Is For: a near-black face with a faint aurora sheen, the M white (Malik 2026-10-18)
  var BLACKGLASS = { c1: [0.2, 0.95, 0.82, 0.16], c2: [0.5, 0.48, 1, 0.12], c3: [0.16, 0.78, 1, 0.14], c4: [1, 1, 1, 0.1], fa: [0.05, 0.055, 0.065], fb: [0.012, 0.014, 0.018], plat: 0.12, fk: 1 };
  var PLATINUM = { c1: [0.96, 0.98, 1, 1], c2: [0.86, 0.9, 0.97, 0.9], c3: [1, 1, 1, 0.85], c4: [0.8, 0.86, 0.95, 0.8], fa: [0.8, 0.82, 0.86], fb: [0.56, 0.59, 0.65], plat: 0.65 };
  var AURORA = { c1: [0, 1, 190 / 255, 0.95], c2: [150 / 255, 90 / 255, 1, 0.85], c3: [40 / 255, 200 / 255, 1, 0.9], c4: [1, 90 / 255, 200 / 255, 0.7],
                 fa: [5 / 255, 11 / 255, 18 / 255], fb: [2 / 255, 4 / 255, 10 / 255], plat: 0.08, fk: 1 };
  // Evolve's room: the Aurora background lit in the card's own Frost Aurora colours (cyan, sky blue, violet, a little pink)
  function tint(c) { var m = Math.max(c[0], c[1], c[2]); return c.map(function (v) { return 1 + (v / m - 1) * 0.45; }); }
  var AURORA_ROLES = (function () {
    var a = [0, 1, 0.75].map(function (v) { return v * 0.9; }), b = [0.16, 0.78, 1].map(function (v) { return v * 0.9; }),
      c = [0.59, 0.35, 1].map(function (v) { return v * 0.75; }), p = [1, 0.35, 0.78].map(function (v) { return v * 0.45; });
    return { a: a, b: b, c: c, p: p, ta: tint(a), tb: tint(b) };
  })();
  // the beams in the Frost Aurora card's own colours, a touch brighter than the aurora room
  var BEAM_ROLES = { a: AURORA_ROLES.a.map(function (v) { return v * 1.15; }), b: AURORA_ROLES.b.map(function (v) { return v * 1.15; }), c: AURORA_ROLES.c, p: AURORA_ROLES.p, ta: AURORA_ROLES.ta, tb: AURORA_ROLES.tb };
  var WHAT = 'To run my own business by 25.', WHY = 'So my family never has to stress about money again.';
  function sm(a, b, x) { x = Math.max(0, Math.min(1, (x - a) / (b - a))); return x * x * (3 - 2 * x); }

  function build(app) {
    var root = E('div', 'a', null, app);
    K.header(root, { cta: true });
    var wallHost = E('div', 'a-wall', null, root), beamsHost = E('div', 'a-beams', null, root), fireHost = E('div', 'a-fire', null, root);
    var story = E('section', 'a-story', null, root);
    var stage = E('div', 'a-stage', null, story);
    var textBox = E('div', 'a-text', null, stage);
    var cardArea = E('div', 'a-cardarea', null, stage);
    var slot = E('div', 'a-slot', null, cardArea);
    var grow = E('div', 'a-grow', '<div class="a-halo"></div>', slot);
    var lwrap = E('div', 'a-lwrap', null, grow), lhost = E('div', 'a-lcard', null, lwrap), lflash = E('div', 'a-lflash', null, lwrap);
    var vwrap = E('div', 'a-vwrap', null, grow), vhost = E('div', 'k-host', null, vwrap), engr = E('div', 'a-engr', '', vhost);
    var panelBox = E('div', 'a-panel', null, stage);
    var bigwm = E('div', 'a-bigwm', K.mark() + '<span>emento</span>', root), hdrWm = root.querySelector('.top .wm'), hdrEl = root.querySelector('.top'), wmStart = null;
    var snaps = STEPS.concat([{}]).map(function () { return E('div', 'a-snap', null, story); }), extra = 0, whoQ = 0;
    document.documentElement.style.scrollSnapType = 'y proximity';
    var days = E('div', 'a-days-full', '<canvas class="a-days-cv" aria-hidden="true"></canvas><div class="a-days-scrim"></div><i class="a-today" aria-hidden="true"></i>' +
      '<div class="a-days-in"><p class="a-days-num">~27,000 days.</p><p class="a-days-line">That’s what the average person gets. <span class="nw">At <span data-age>25</span>,</span> you have about <span data-left>17,700</span> left.</p>' +
      '<p class="a-days-sol">Memento is here to make sure you get the most out of them.</p>' +
      '<label class="a-days-age"><span>Your age</span><input type="range" min="13" max="70" step="1" value="25" aria-label="Your age"><b data-age2>25</b></label></div>', stage);
    var whoShade = E('div', 'a-whoshade', null, stage);
    var hint = E('div', 'a-hint hint', '<svg viewBox="0 0 14 14"><path d="M3 5l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Scroll to see how it works', stage);
    var texts = STEPS.map(function (s) { return E('div', 'a-t a-t-' + s.id, TEXT[s.id], textBox); });
    var panels = STEPS.map(function (s) { return E('div', 'a-p a-p-' + s.id, PANELS[s.id] || '', panelBox); });

    // the two cards: the live page's for the story, the app's skins card for the looks and the name
    var lc = new ML.Card(lhost, { spill: 1.5 });
    lc.set(ML.DARK, 0);
    var house = K.LOOKS[0], mode = 'story', cycleI = 0, cycleT = 0, typed = '';
    var cd = K.card(vhost, { look: house, w: 300 });
    var lcRef = { host: lhost };
    var wl = K.wall(wallHost, { bg: 'waterfall', skin: 'house', card: lcRef, dprK: innerWidth < 700 ? 0.55 : 0.5 });
    cd.wall = wl;
    var beams = window.BEAMS ? BEAMS.make(beamsHost, { dprK: innerWidth < 700 ? 0.55 : 0.5, amp: innerWidth < 700 ? 0.85 : 0.7, tint: 0.88, c1: [0.2, 0.95, 0.82], c2: [0.5, 0.48, 1] }) : null, beamsOp = 1;
    var fire = window.FIRE ? FIRE.make(fireHost, { dprK: innerWidth < 700 ? 0.5 : 0.45, sparks: 44, flare: 0.6 }) : null;
    var L = { clar: 0, act: 0, cons: 0 }, wallMode = '', boostT = 0;
    function boost() { if (!boostT) return 1; var a = (performance.now() - boostT) / 1000; return 1 + 0.22 * Math.max(0, Math.sin(Math.PI * Math.min(1, a / 1.4))); }
    function storyWall(kind) {
      if (wallMode === kind) return; wallMode = kind;
      if (kind === 'beams') { wl.set('beams', 'house', true); wl.rolesFn = function () { return BEAM_ROLES; }; return; }
      if (kind === 'aurora') { wl.set('aurora', 'house', true); wl.rolesFn = function () { return AURORA_ROLES; }; return; }
      if (kind === 'plat') { wl.set('waterfall', 'house', true); wl.rolesFn = function () { return K.houseRoles([0.1, 0.06, 0.14, 1], 0.5); }; return; }
      wl.set('waterfall', 'house', true);
      wl.rolesFn = function () { var g = 0.06 + 0.94 * Math.max(L.clar, L.act, L.cons); return K.houseRoles([L.clar, L.cons, L.clar * 0.3, L.act], g * boost()); };
    }
    storyWall('beams');

    // the looks cycle by themselves (nothing to pick); the name cycles Default, Fused, Mesh and Frost in its own colour
    var nowName = panels[7].querySelector('[data-ln]'), dots = panels[7].querySelectorAll('.a-dots i');
    function showLook(lk) {
      cd.chan = null; cd.set(lk, true); wl.card = cd; wl.look(lk, true); wallMode = 'look';
      nowName.textContent = lk.name;
      var i = K.EARNED.indexOf(lk); dots.forEach(function (d, j) { d.classList.toggle('on', j === i); });
    }
    var nameIn = panels[8].querySelector('.a-name'), nameT = 0, NAME_STYLES = ['light', 'fused', 'mesh', 'frost'], nameI = 0, nameCycleT = 0;
    function showName(fade) {
      var n = typed.trim(); wl.card = cd; wallMode = 'name';
      engr.textContent = n; engr.classList.toggle('on', !!n);
      if (!n) { cd.chan = [1, 1, 1, 1]; cd.set(house, fade); wl.set('waterfall', 'house', fade); wl.rolesFn = function () { return K.houseRoles([1, 1, 1, 1], 1); }; return; }
      var lk = K.nameLook(n, NAME_STYLES[nameI % NAME_STYLES.length]); cd.chan = null; cd.set(lk, fade); wl.look(lk, fade);
      nameCycleT = performance.now();
    }
    nameIn.addEventListener('input', function () { typed = nameIn.value; clearTimeout(nameT); nameT = setTimeout(function () { if (mode === 'name') showName(true); }, 140); });

    // Clarity: five people, one after another. Each one's what and why type in, then their stages appear (the app's
    // path: done, the one they're on, the goal); a beat later the next person.
    var PEOPLE = [
      { what: 'Lose 20 lbs by March, from 212 to 192.', why: 'So I feel good in my body again.', st: [['205 lbs', 'done'], ['199 lbs', 'cur'], ['195 lbs', ''], ['192 lbs by March', 'goal']] },
      { what: 'Get my screen time under 2 hours a day.', why: 'So I get my evenings back for what I actually care about.', st: [['Under 6 hours', 'done'], ['Under 4 hours', 'cur'], ['Under 3 hours', ''], ['Under 2 hours a day', 'goal']] },
      { what: 'To run my own business by 25.', why: 'So my family never has to stress about money again.', st: [['Pick what to sell', 'done'], ['Land the first paying customer', 'cur'], ['$1,000 a month', ''], ['Run my own business by 25', 'goal']] },
      { what: 'Finish the semester with a 3.8 GPA.', why: 'So I get into the program I actually want.', st: [['Set a study schedule', 'done'], ['Ace the midterms', 'cur'], ['Every assignment in early', ''], ['3.8 GPA this semester', 'goal']] },
      { what: 'Grow my book page to $10k a month.', why: 'So books are the job, not the thing squeezed in after a shift.', st: [['Pivot the account to books', 'done'], ['Post on a steady schedule', 'cur'], ['Land regular brand deals', ''], ['$10k a month', 'goal']] }
    ];
    var tWhat = panels[3].querySelector('[data-what]'), tWhy = panels[3].querySelector('[data-why]'), stBox = panels[3].querySelector('[data-stages]'), cDots = panels[3].querySelectorAll('.a-seg button'), segPill = panels[3].querySelector('.a-seg-pill');
    var typeT = 0, person = 0, clarOn = false, typedOnce = false, NOTE = { done: 'Done', cur: 'You’re on this one', goal: 'Goal' }, ST_CHECK = '<svg viewBox="0 0 12 12"><path d="M3 6.2l2 2L9 4" fill="none" stroke="#04131a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    function stagesOf(P) { return P.st.map(function (x) { return '<div class="a-st ' + x[1] + '"><i>' + (x[1] === 'done' ? ST_CHECK : '') + '</i><span>' + x[0] + '</span>' + (NOTE[x[1]] ? '<em>' + NOTE[x[1]] + '</em>' : '') + '</div>'; }).join(''); }
    function movePill(j) { var b = cDots[j]; if (!b || !b.offsetWidth) return; segPill.style.width = b.offsetWidth + 'px'; segPill.style.transform = 'translateX(' + b.offsetLeft + 'px)'; }
    function typeInto(el, text, done) { var k = 0; el.textContent = ''; (function ty() { k += 2; el.textContent = text.slice(0, k); if (k < text.length) typeT = setTimeout(ty, 16); else if (done) typeT = setTimeout(done, 90); })(); }
    function showPerson(full) {
      var P = PEOPLE[person % PEOPLE.length]; cDots.forEach(function (d, j) { d.setAttribute('aria-pressed', j === person % PEOPLE.length ? 'true' : 'false'); }); movePill(person % PEOPLE.length);
      stBox.innerHTML = stagesOf(P); var rows = stBox.querySelectorAll('.a-st');
      if (full) { tWhat.textContent = P.what; tWhy.textContent = P.why; rows.forEach(function (r) { r.classList.add('in'); }); return; }
      var box = panels[3].querySelector('.a-clar2');
      function after() {
        rows.forEach(function (r, i) { setTimeout(function () { r.classList.add('in'); }, i * 60); });
        typeT = setTimeout(function () { if (!clarOn) return; box.classList.add('swap'); typeT = setTimeout(function () { person++; if (clarOn) showPerson(false); }, 180); }, 2600);
      }
      if (!typedOnce) {   // the very first time: typed
        typedOnce = true; box.classList.remove('swap'); tWhy.textContent = '';
        typeInto(tWhat, P.what, function () { typeInto(tWhy, P.why, after); });
      } else {            // after that: a quick fade
        tWhat.textContent = P.what; tWhy.textContent = P.why;
        requestAnimationFrame(function () { box.classList.remove('swap'); }); after();
      }
    }
    function clarityIn() { clarOn = true; clearTimeout(typeT); if (K.CLEAN) { showPerson(true); return; } showPerson(false); }   // ?clean captures: already typed
    function clarityOut() { clarOn = false; clearTimeout(typeT); panels[3].querySelector('.a-clar2').classList.remove('swap'); showPerson(true); }
    clarityOut();
    cDots.forEach(function (b) { b.addEventListener('click', function () { clearTimeout(typeT); typedOnce = true; person = +b.dataset.p; if (!clarOn) { showPerson(true); return; } var box = panels[3].querySelector('.a-clar2'); box.classList.add('swap'); typeT = setTimeout(function () { showPerson(false); }, 140); }); });
    // Who: the lines come in one after another when the chapter arrives
    var whoRows = panels[1].querySelectorAll('.wr'), whoT = [];
    function whoIn() { whoT.forEach(clearTimeout); whoRows.forEach(function (r, i) { r.classList.remove('in'); whoT.push(setTimeout(function () { r.classList.add('in'); }, K.BAR ? 80 + i * 55 : 0)); }); }
    function whoOut() { whoT.forEach(clearTimeout); whoRows.forEach(function (r) { r.classList.add('in'); }); }
    whoOut();
    var whoEnd = panels[1].querySelector('[data-whoend]'), whoKind = 'none', whoWrap = panels[1].querySelector('.who-wrap'), whoBtn = panels[1].querySelector('.who-toggle');
    whoBtn.addEventListener('click', function () {
      var open = !whoWrap.classList.contains('open'); whoWrap.classList.toggle('open', open); whoBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) whoIn();
      STEPS[1].phoneHide = open; root.classList.add('who-moving'); layout(); setTimeout(function () { root.classList.remove('who-moving'); }, 420);
    });
    panels[1].querySelectorAll('.wli').forEach(function (b) {
      b.addEventListener('click', function () {
        var on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on ? 'true' : 'false');
        var picked = panels[1].querySelectorAll('.wli[aria-pressed="true"]'), hard = [].some.call(picked, function (x) { return x.dataset.g === '1'; });
        var kind = !picked.length ? 'none' : hard ? 'hard' : 'want';
        if (kind !== whoKind) { whoKind = kind; whoEnd.classList.add('swap'); setTimeout(function () { whoEnd.innerHTML = WHO_LINES[kind]; whoEnd.classList.toggle('yes', kind !== 'none'); whoEnd.classList.remove('swap'); }, 160); }
      });
    });
    // every day of an average life (~26,800, about 73 years) as a mark. The days already lived follow the age through a
    // spring (they lag a beat, ease in, carry a little tension, ease out), drift up and fade at a soft edge; the numbers
    // tick with them. On arrival the whole life draws in from the top, then the lived days fall away to the age.
    var LIFE = 26800, dcv = days.querySelector('canvas'), dctx = dcv.getContext('2d'), ageIn = days.querySelector('input'), dGeo = null;
    var mcv = document.createElement('canvas'), mctx = mcv.getContext('2d'), tcv = document.createElement('canvas'), tctx = tcv.getContext('2d'), maskL = -1;
    var Lx = 0, Lv = 0, LT = 25 * 365.25, reveal = 1, revealT0 = 0, fallT0 = 0, dRaf = 0, dLast = 0, pulseT0 = performance.now(), shownAge = -1;
    var todayEl = days.querySelector('.a-today'), ageSpan = days.querySelector('[data-age]'), leftSpan = days.querySelector('[data-left]'), ageVal = days.querySelector('[data-age2]');
    function dLayout() {
      var w = days.clientWidth, h = days.clientHeight; if (!w || !h) return;
      var dpr = Math.min(2, window.devicePixelRatio || 1), pad = 0, top = 0, W = w, H = h;
      var sz = Math.sqrt(W * H / LIFE), cols = Math.floor(W / sz), rows = Math.ceil(LIFE / cols);
      while (rows * sz > H) { sz *= 0.985; cols = Math.floor(W / sz); rows = Math.ceil(LIFE / cols); }
      [dcv, mcv, tcv].forEach(function (c) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); });
      dcv.style.width = w + 'px'; dcv.style.height = h + 'px';
      dGeo = { w: w, h: h, dpr: dpr, s: sz, cols: cols, rows: rows, x0: (w - cols * sz) / 2, y0: top + (H - rows * sz) / 2, d: Math.max(1, sz * 0.56) };
      maskL = -1; drawDays(performance.now());
    }
    function px(i) { return dGeo.x0 + (i % dGeo.cols) * dGeo.s; }
    function py(i) { return dGeo.y0 + Math.floor(i / dGeo.cols) * dGeo.s; }
    // the days left, as a white mask (rebuilt only when the lived count moves a whole day)
    function buildMask(L) {
      var g = dGeo; mctx.setTransform(g.dpr, 0, 0, g.dpr, 0, 0); mctx.clearRect(0, 0, g.w, g.h); mctx.fillStyle = '#fff';
      for (var j = L; j < LIFE; j++) mctx.fillRect(px(j), py(j), g.d, g.d);
      maskL = L;
      window.__days = { marks: LIFE, cols: dGeo.cols, rows: Math.ceil(LIFE / dGeo.cols), sizePx: +dGeo.d.toFixed(2), pitchPx: +dGeo.s.toFixed(2) };
    }
    function drawDays(now) {
      if (!dGeo) return;
      var g = dGeo, x = dctx, L = Math.max(0, Math.round(Lx)), band = Math.round(g.cols * 1.6);
      if (L !== maskL) buildMask(L);
      x.setTransform(g.dpr, 0, 0, g.dpr, 0, 0); x.clearRect(0, 0, g.w, g.h);
      // the days already lived: barely there
      x.fillStyle = 'rgba(243,246,249,0.06)';
      for (var i = 0, e = Math.max(0, L - band); i < e; i++) x.fillRect(px(i), py(i), g.d, g.d);
      // the edge: the days just lost drift up and fade
      for (var k = Math.max(0, L - band); k < L; k++) {
        var t = (L - k) / band, a = 0.06 + 0.5 * (1 - t) * (1 - t);
        x.fillStyle = 'rgba(243,246,249,' + a.toFixed(3) + ')'; x.fillRect(px(k), py(k) - t * g.s * 1.4, g.d, g.d);
      }
      // the days left
      x.globalAlpha = 0.3; x.drawImage(mcv, 0, 0, mcv.width, mcv.height, 0, 0, g.w, g.h); x.globalAlpha = 1;
      // today: the one day in focus, drawn sharp above the blurred days
      todayEl.style.transform = 'translate(' + (px(L) + g.d / 2).toFixed(1) + 'px,' + (py(L) + g.d / 2).toFixed(1) + 'px)';
      // arriving: the whole life draws in from the top
      if (reveal < 1) {
        var ry = g.y0 + reveal * (g.rows * g.s + 60), fade = x.createLinearGradient(0, ry - 60, 0, ry);
        fade.addColorStop(0, 'rgba(0,0,0,0)'); fade.addColorStop(1, 'rgba(0,0,0,1)');
        x.fillStyle = fade; x.fillRect(0, ry - 60, g.w, 60); x.fillStyle = '#000'; x.fillRect(0, ry, g.w, g.h - ry);
      }
    }
    function tickNumbers() {
      var moving = Math.abs(LT - Lx) > 3 || Math.abs(Lv) > 3, left = Math.max(0, LIFE - Lx);
      leftSpan.textContent = (moving ? Math.round(left / 10) * 10 : Math.round(left / 100) * 100).toLocaleString('en-US');
      var a = Math.round(Lx / 365.25);
      if (a !== shownAge) { shownAge = a; ageSpan.textContent = a; ageSpan.classList.remove('tick'); void ageSpan.offsetWidth; ageSpan.classList.add('tick'); }
    }
    function dLoop(now) {
      dRaf = 0; if (!root.isConnected) return;
      var dt = Math.min(1.5, (now - (dLast || now)) / 1000); dLast = now;
      if (revealT0) { reveal = K.ease((now - revealT0) / 1100); if (reveal >= 1) { reveal = 1; revealT0 = 0; } }
      if (now >= fallT0) {   // a critically damped spring on real time (small steps, so a slow frame rate never slows it down)
        var kS = 9, cS = 2 * Math.sqrt(kS);
        for (var left = dt; left > 0; left -= 1 / 120) { var h = Math.min(left, 1 / 120); Lv += (kS * (LT - Lx) - cS * Lv) * h; Lx += Lv * h; }
        if (Math.abs(LT - Lx) < 1 && Math.abs(Lv) < 2) { Lx = LT; Lv = 0; }
      }
      tickNumbers(); drawDays(now);
      var busy = revealT0 || now < fallT0 || Lx !== LT || Lv !== 0;
      if (busy && days.style.visibility !== 'hidden') dRaf = requestAnimationFrame(dLoop);
    }
    function dRun() { if (!dRaf) { dLast = 0; dRaf = requestAnimationFrame(dLoop); } }
    function dArrive() {   // the life draws in, then the lived days fall away to the age
      if (K.RM) { Lx = LT; Lv = 0; reveal = 1; tickNumbers(); drawDays(performance.now()); return; }
      if (!touched) setAge(18 + Math.floor(Math.random() * 12), true);   // nobody set an age yet: show one between 18 and 29
      Lx = 0; Lv = 0; reveal = 0; revealT0 = performance.now(); fallT0 = revealT0 + 1000; shownAge = -1; dRun();
    }
    var touched = false;
    function setAge(a, auto) {
      if (!auto) touched = true;
      a = Math.max(13, Math.min(70, a)); ageIn.value = a; ageVal.textContent = a;
      LT = a * 365.25;
      if (K.RM) { Lx = LT; tickNumbers(); drawDays(performance.now()); return; }
      dRun();
    }
    ageIn.addEventListener('input', function () { setAge(+ageIn.value); });
    setAge(18 + Math.floor(Math.random() * 12), true); Lx = LT; tickNumbers();
    // Action: tap any move to tick it; the deep work timer runs while you watch
    panels[4].querySelectorAll('li').forEach(function (li) { li.addEventListener('click', function () { li.classList.toggle('done'); }); });
    var clockEl = panels[4].querySelector('[data-clock]'), arc = panels[4].querySelector('.arc'), clockS = 1 * 3600 + 12 * 60 + 40;
    // Keep Going: the live page's box
    var tickEls = panels[5].querySelectorAll('[data-ticks] i'), runEls = panels[5].querySelectorAll('[data-runs] i');
    var $k = function (s) { return panels[5].querySelector(s); };

    // after the story: the sign-up and the letter
    var after = E('div', 'a-after', null, root);
    var su = K.signupSection(after); su.insertAdjacentHTML('beforeend', SOON);
    K.letter(after);
    K.footer(after);
    var stick = K.stickyBar(root, su);
    root.querySelectorAll('[data-join]').forEach(function (b) { b.addEventListener('click', K.openSheet); });

    var wallNear = 1, lastStep = -1, platOn = false, auroraOn = false, holdUntil = 0, lastKey = '', kickT = 0, spring = 0, fitY = [], fitS = [], fitX = [], fitR = [], fitZ = [], baseT = '', slotScale = 1, cwNow = 300;
    var intro = K.RM ? 1 : 0, introT0 = performance.now(), pNow = 0;
    function layout() {
      var vw = document.documentElement.clientWidth, vh = innerHeight - K.BAR, phone = vw < 980, two = !phone;
      root.classList.toggle('is-phone', phone); root.classList.toggle('two', two);
      cwNow = phone ? Math.round(Math.min(vw * 0.66, 300)) : Math.round(Math.max(230, Math.min(360, vh * 0.4)));
      lhost.style.width = cwNow + 'px'; cd.size(cwNow);
      fitY = []; fitS = []; fitX = []; fitR = []; fitZ = [];
      var ch = cwNow * 452 / 320;
      if (phone) {
        // each chapter is ONE group (words, card, box) centred in the room between the header and the sign-up bar,
        // with even gaps; the card shrinks only when the group would not fit
        // the real room: from under the logo to just above the sign-up button (a short phone, the app's own bars and
        // the home indicator all take from it, so it is measured, never assumed)
        var hb = hdrWm.getBoundingClientRect(), sbtn = root.querySelector('.stickybar .cta'), sb = sbtn ? sbtn.getBoundingClientRect() : null;
        var top0 = Math.max(60, hb.bottom - K.BAR + 24), botHero = (sb && sb.height ? sb.top - K.BAR : vh - 80) - 14, bot0 = vh - 34, avail = bot0 - top0;
        STEPS.forEach(function (st, i) {
          texts[i].dataset.k = 1; panels[i].dataset.k = 1;
          var avail = (i === 0 ? botHero : bot0) - top0;
          var th = texts[i].offsetHeight, ph = panels[i].firstElementChild ? panels[i].offsetHeight : 0;
          var gT = th ? 20 : 0, gP = ph ? 18 : 0;
          if (st.big) {   // the first screen: the name high and big, the card large, the "coming soon" row under it
            var hintTop = hint.offsetHeight ? hint.offsetTop : botHero, hBot = Math.min(botHero - 34, hintTop - 28);   // the group ends clear of the scroll hint
            var hTop = top0 - 14, gW = 24, gS = 28, soonH = ph ? ph + gS : 0, room0 = hBot - hTop - th - gW - soonH, big = Math.min(room0 / ch, (vw - 140) / cwNow, 1.2);
            var gH = th + gW + ch * big + soonH, hy = hTop + Math.max(0, (hBot - hTop - gH) * 0.5);   // the group sits centred
            texts[i].style.top = hy + 'px'; panels[i].style.top = (hy + th + gW + ch * big + gS) + 'px';
            fitS.push(big); fitY.push(hy + th + gW + ch * big / 2 - vh / 2); fitX.push(0); fitR.push(0); fitZ.push(0); return;
          }
          if (st.tilt) {   // Who: the card upright and large, high behind the frosted header; the words in front, low
            var k2 = Math.max(0.8, Math.min(1, avail / Math.max(1, th + gP + ph))); texts[i].dataset.k = k2; panels[i].dataset.k = k2; th *= k2; ph *= k2; gP *= k2;
            var G2 = th + gP + ph, y2 = top0 + Math.max(0, (avail - G2) * 0.88), whoS = (vw - 36) / cwNow, mY = (y2 - top0 + 24) >= 120 ? (top0 - 24 + y2) / 2 - 6 : y2 + G2 * 0.55;   // the M in the clear space above the words, or (short phones) behind the list
            texts[i].style.top = y2 + 'px'; panels[i].style.top = (y2 + th + gP) + 'px'; whoShade.style.top = (y2 - 90) + 'px';
            fitS.push(whoS / (st.scale || 1)); fitY.push(mY - vh / 2); fitX.push(0); fitR.push(0); fitZ.push(0); return;
          }
          fitX.push(0); fitR.push(0); fitZ.push(0);
          var gk = st.id === 'evolve' ? 1.12 : 1;   // Evolve's card grows in its moment: leave it the room
          var minS = 0.42, sc = st.phoneHide ? 0 : Math.max(0, Math.min(1, (avail - th - ph - gT - gP) / (ch * gk))), k = 1;
          if (st.phoneHide) { gT = 0; k = Math.min(1, (avail - gP) / Math.max(1, th + ph)); }
          else if (sc < minS) { sc = minS; k = Math.min(1, (avail - ch * gk * minS - gT - gP) / Math.max(1, th + ph)); }
          k = Math.max(0.7, k);   // words and box shrink a little before anything is cut
          texts[i].dataset.k = k; panels[i].dataset.k = k;
          var thk = th * k, phk = ph * k, room = ch * sc * gk, G = thk + gT + room + gP + phk, y0 = top0 + Math.max(0, (avail - G) / 2);
          texts[i].style.top = y0 + 'px'; panels[i].style.top = (y0 + thk + gT + room + gP) + 'px';
          if (st.phoneHide) { var pTop = y0 + thk + gT + room + gP, bx = panels[i].querySelector('.who-wrap'), bh = bx ? bx.offsetHeight * k : phk, bTop = pTop + (bx ? bx.offsetTop * k : 0), behind = Math.min(1, bh * 0.8 / ch); fitS.push(behind / (st.scale || 1)); fitY.push(bTop + bh / 2 - vh / 2); }
          else { fitS.push(sc / (st.scale || 1)); fitY.push(y0 + thk + gT + room / 2 - vh / 2); }
        });
      } else if (two) {
        // two sides: each chapter's words with its box under them, centred as one group on the left; the card on the right
        var top1 = 84, avail1 = vh - top1 - 56;
        STEPS.forEach(function (st, i) {
          texts[i].dataset.k = 1; panels[i].dataset.k = 1;
          var th = texts[i].offsetHeight, ph = panels[i].firstElementChild ? panels[i].offsetHeight : 0, gP = ph ? 28 : 0;
          var G = th + gP + ph, k = Math.max(0.72, Math.min(1, avail1 / Math.max(1, G))), y0 = top1 + Math.max(0, (avail1 - G * k) / 2);
          texts[i].dataset.k = k; panels[i].dataset.k = k;
          texts[i].style.top = y0 + 'px'; panels[i].style.top = (y0 + (th + gP) * k) + 'px';
        });
      } else { texts.forEach(function (t) { t.style.top = ''; t.dataset.k = 1; }); panels.forEach(function (t) { t.style.top = ''; t.dataset.k = 1; }); }
      // the big wordmark starts where the hero's slot is and ends as the header's
      var slotEl = texts[0].querySelector('.a-wmslot'); bigwm.style.fontSize = getComputedStyle(hdrWm).fontSize;
      var hr = hdrWm.getBoundingClientRect();
      wmStart = { slot: slotEl, hx: hr.left, hy: hr.top, hw: hr.width, hh: hr.height, phone: phone };
      extra = 0;
      story.style.height = (vh * 0.85 * (STEPS.length - 1 + extra) + vh) + 'px';
      dLayout(); movePill(person % PEOPLE.length);
      // the fire burns under the card (a wider sheet, centred on it, when the card sits to the right)
      var car = cardArea.getBoundingClientRect(), fcx = car.left + car.width / 2, W = document.documentElement.clientWidth;
      if (two) { fireHost.style.left = Math.round(fcx - W * 0.7) + 'px'; fireHost.style.right = 'auto'; fireHost.style.width = Math.round(W * 1.4) + 'px'; }
      else { fireHost.style.left = ''; fireHost.style.right = ''; fireHost.style.width = ''; }
      // a gentle snap: each chapter's resting point is a snap point (proximity, so a fast swipe still flies past)
      snaps.forEach(function (m, i) { m.style.display = i < STEPS.length + extra ? '' : 'none'; m.style.top = (i * vh * 0.85) + 'px'; });
      onScroll();
    }
    function onScroll() {
      var vh = innerHeight - K.BAR, r = story.getBoundingClientRect(), stepLen = vh * 0.85;
      var raw = (K.BAR - r.top) / stepLen;
      if (!isFinite(raw)) raw = 0;   // a window with no height yet (a hidden tab, some in-app browsers at load) reads as the top
      if (extra) { whoQ = K.clamp(raw - 1, 0, 1); raw = raw <= 1 ? raw : raw <= 2 ? 1 : raw - 1; } else whoQ = 0;
      var p = K.clamp(raw, 0, STEPS.length - 1); pNow = p;
      // the Who chapter's two beats on a phone: what they want, then what's hard (picks carry over)
      var gA = panels[1].querySelector('.who-grp'), gB = panels[1].querySelectorAll('.who-grp')[1];
      if (gA && gB) {
        var aq = extra ? 1 - K.ease((whoQ - 0.22) / 0.26) : 1, bq = extra ? K.ease((whoQ - 0.52) / 0.26) : 1;   // one out, then the other in: never both
        gA.style.opacity = aq.toFixed(3); gA.style.transform = extra ? 'translateY(' + (-(1 - aq) * 14).toFixed(1) + 'px)' : ''; gA.style.pointerEvents = aq > 0.5 ? '' : 'none';
        gB.style.opacity = bq.toFixed(3); gB.style.transform = extra ? 'translateY(' + ((1 - bq) * 14).toFixed(1) + 'px)' : ''; gB.style.pointerEvents = bq > 0.5 ? '' : 'none';
      }
      var i0 = Math.floor(p), i1 = Math.min(STEPS.length - 1, i0 + 1), f = K.ease((p - i0 - 0.2) / 0.6);
      function fade(list, dy) { list.forEach(function (t, i) { var d = p - i, op = K.clamp(1 - Math.abs(d) * 2.4, 0, 1); t.style.opacity = op; t.style.transform = 'translateY(' + (-d * dy).toFixed(1) + 'px)' + (t.dataset.k && t.dataset.k != 1 ? ' scale(' + (+t.dataset.k).toFixed(3) + ')' : ''); t.style.visibility = op > 0.01 ? 'visible' : 'hidden'; t.style.pointerEvents = op > 0.6 ? 'auto' : 'none'; }); }
      fade(texts, 26); fade(panels, 18);
      hint.style.opacity = K.clamp(1 - p * 3, 0, 1);
      if (stick) stick.classList.toggle('past-hero', p > 0.35);
      whoShade.style.opacity = 0;
      var step = Math.round(p);
      var sc = K.lerp(STEPS[i0].scale, STEPS[i1].scale, f), ty = 0;
      var tx = 0, rY = 0, rZ = 0;
      if (fitS.length) { sc *= K.lerp(fitS[i0], fitS[i1], f); ty = K.lerp(fitY[i0], fitY[i1], f); }
      if (fitX.length) { tx = K.lerp(fitX[i0], fitX[i1], f); rY = K.lerp(fitR[i0], fitR[i1], f); rZ = K.lerp(fitZ[i0], fitZ[i1], f); }
      baseT = 'perspective(1100px) translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px) ' + (rY ? 'rotateY(' + rY.toFixed(2) + 'deg) ' : '') + (rZ ? 'rotate(' + rZ.toFixed(2) + 'deg) ' : ''); slotScale = sc;
      slot.style.transform = baseT + 'scale(' + (sc * (1 + spring)).toFixed(4) + ')';
      // which card shows: the live one through Evolve, the app's skins card for the looks and the name
      var skins = step >= 7;
      var whoNear = K.clamp(1 - Math.abs(p - 1) * 2, 0, 1);
      lwrap.style.opacity = skins ? 0 : (1 - 0.22 * whoNear).toFixed(3); vwrap.style.opacity = skins ? 1 : 0;
      var ph1 = root.classList.contains('is-phone'), hideA = STEPS[i0].full || (ph1 && STEPS[i0].phoneHide) ? 0 : 1, hideB = STEPS[i1].full || (ph1 && STEPS[i1].phoneHide) ? 0 : 1;
      // the days chapter takes the whole screen: its marks and statement fade in as the card steps out
      var dv = 0; days.style.opacity = dv.toFixed(3); days.style.visibility = dv > 0.01 ? 'visible' : 'hidden'; days.style.pointerEvents = dv > 0.6 ? 'auto' : 'none';
      if (dv > 0.01) dRun();
      days.querySelector('.a-days-in').style.transform = 'translateY(' + (-(p - 1) * 26).toFixed(1) + 'px)';
      // next to the days chapter, one thing on screen at a time: the card leaves before the days arrive, and comes back after they go
      var fH = STEPS[i0].full ? K.ease((p - i0 - 0.42) / 0.4) : STEPS[i1].full ? K.ease((p - i0 - 0.18) / 0.36) : f;
      var cardOp = K.lerp(hideA, hideB, fH); cardArea.style.opacity = cardOp.toFixed(3);
      wallNear = STEPS[i0].full || STEPS[i1].full ? 0.1 + 0.9 * cardOp : 1;   // the room goes dark with the card, so nothing of it hangs on alone
      hdrEl.classList.toggle('solid', p > 0.38);   // phones: the header's glass pill arrives with the name
      if (wmStart) {   // Memento's name, big on the first screen, rises into the header as you start to scroll
        var sr = wmStart.slot.getBoundingClientRect(), s0 = sr.height / wmStart.hh;   // measured live, so it never drifts
        wmStart.s = s0; wmStart.x = sr.left + (wmStart.phone ? (sr.width - wmStart.hw * s0) / 2 : 0); wmStart.y = sr.top;
        var k = K.ease(K.clamp(p / 0.55, 0, 1)), sx = K.lerp(wmStart.s, 1, k);
        bigwm.style.left = wmStart.hx + 'px'; bigwm.style.top = wmStart.hy + 'px';
        bigwm.style.transform = 'translate(' + ((wmStart.x - wmStart.hx) * (1 - k)).toFixed(1) + 'px,' + ((wmStart.y - wmStart.hy) * (1 - k)).toFixed(1) + 'px) scale(' + sx.toFixed(4) + ')';
      }
      if (step !== lastStep) {
        if ([3, 4, 5].indexOf(step) >= 0 && step > lastStep && lastStep >= 0) { kickT = performance.now(); boostT = kickT; }
        grow.classList.toggle('evolved', step === 6);
        if (step === 6 && lastStep < 6) { lflash.classList.remove('go'); void lflash.offsetWidth; lflash.classList.add('go'); }
        if (step === 3) clarityIn(); else if (lastStep === 3) clarityOut();
        if (step === 1 && lastStep !== 1) whoIn();
        if (step === 7) { mode = 'looks'; engr.classList.remove('on'); cycleT = performance.now(); showLook(K.EARNED[cycleI % K.EARNED.length]); }
        else if (step === 8) { mode = 'name'; showName(true); }
        else { if (mode !== 'story') { mode = 'story'; wl.card = lcRef; wallMode = ''; } storyWall(step === 6 ? 'aurora' : step === 1 ? 'plat' : step === 0 ? 'beams' : 'house'); }
        lastStep = step;
      }
      // Keep Going's box fills with the scroll (the live page's numbers)
      var kp = sm(4.4, 5.0, p), sc = Math.round(SCORE * kp), lit = Math.round(TICKS * sc / 100);
      tickEls.forEach(function (d, j) { var on = j < lit; d.classList.toggle('on', on); d.style.background = on ? 'rgb(' + Math.round(58 + (63 - 58) * j / TICKS) + ',' + Math.round(217) + ',' + Math.round(245 + (78 - 245) * j / TICKS) + ')' : ''; });
      $k('[data-score]').textContent = sc; $k('[data-acts]').textContent = Math.round(34 * kp);
      var rn = Math.round(kp * 3); runEls.forEach(function (d, j) { d.classList.toggle('on', j < rn); }); $k('[data-runsv]').textContent = rn + ' of 3';
      $k('[data-lbs]').style.width = (60 * kp).toFixed(1) + '%'; $k('[data-lbsv]').textContent = Math.round(6 * kp) + ' of 10 lbs';
      $k('[data-rate]').style.width = (92 * kp).toFixed(1) + '%'; $k('[data-ratev]').textContent = Math.round(92 * kp) + '% rate';
      panels[4].querySelector('.auto').classList.toggle('done', p > 3.85);
      wl.paused = r.bottom < 0;
      beamsOp = K.clamp(1 - Math.max(0, p - 1) * 2, 0, 1); beamsHost.style.opacity = beamsOp.toFixed(3);
      wallHost.style.opacity = (K.clamp(r.bottom / (vh * 0.6), 0, 1) * wallNear * (1 - beamsOp)).toFixed(3);
    }
    // the live card's house look, with the blank card pressed toward true black while no light has come in yet
    function setHouse(L, dur) {
      var I = ML.houseInputs(L), m = Math.max(L.clar, L.act, L.cons), k = (1 - m) * 0.8;
      I.fa = I.fa.map(function (v) { return v * (1 - k); }); I.fb = I.fb.map(function (v) { return v * (1 - k); }); I.plat = I.plat * (1 - k * 0.85);
      lc.set(I, dur); lc.mark(L.act > 0.41 ? 'rgba(20,29,40,0.62)' : 'rgba(255,255,255,0.5)');
    }
    function tick(now) {
      if (!root.isConnected) return;
      requestAnimationFrame(tick);
      var p = pNow, n = Math.round(p);
      // the live page's card, driven exactly as on mementoapp.co: its lights come in on load, then build up chapter by chapter
      if (intro < 1) intro = Math.max(0, Math.min(1, (now - introT0 - 250) / 1150));
      var ci = sm(0, 0.45, intro), ai = sm(0.25, 0.7, intro), si = sm(0.5, 1, intro), rewind = 1 - sm(0.45, 0.95, p);   // gone before the white card, so white goes straight to black
      L = { clar: Math.max(ci * rewind, sm(2.45, 2.95, p)), act: Math.max(ai * rewind, sm(3.45, 3.95, p)), cons: Math.max(si * rewind, sm(4.45, 4.95, p)) };
      if (n === 1) { if (!platOn) { platOn = true; lc.set(BLACKGLASS, 800); lc.mark('rgba(238,246,255,0.95)'); holdUntil = now + 820; } }
      else if (platOn) { platOn = false; setHouse(L, 700); holdUntil = now + 720; lastKey = ''; }
      if (n >= 6 || n === 0) { if (!auroraOn) { auroraOn = true; lc.set(AURORA, 1000); lc.mark('rgba(238,246,255,0.95)'); holdUntil = now + 1020; } }
      else if (auroraOn) { auroraOn = false; if (n !== 1) setHouse(L, 700); holdUntil = now + 720; lastKey = ''; }
      lc.spill += ((n === 6 ? 1.8 : 1.5) - lc.spill) * 0.08; lc.edge += ((n === 6 ? 1.15 : 1) - lc.edge) * 0.08;
      if (n !== 1 && n !== 0 && n < 6 && now > holdUntil) { var key = L.clar.toFixed(3) + L.act.toFixed(3) + L.cons.toFixed(3); if (key !== lastKey) { lastKey = key; setHouse(L, 0); } }
      // a chapter arriving: a small breath in the card
      var sp = 0;
      if (kickT) { var b = (now - kickT) / 1000; sp = 0.01 * (b / 0.35) * Math.exp(1 - b / 0.35); if (b > 2.2) kickT = 0; }
      if (sp || spring) { spring = sp; slot.style.transform = baseT + 'scale(' + (slotScale * (1 + spring)).toFixed(4) + ')'; }
      // the fire rises behind Keep Going
      var fv = sm(4.45, 4.9, p) * (1 - sm(5.15, 5.6, p));
      fireHost.style.opacity = fv.toFixed(3);
      if (beams && beamsOp > 0.01) beams.draw();
      if (fire && fv > 0.01) fire.draw(root.classList.contains('is-phone') ? 0.74 : 0.52);   // taller on phones, where the box sits low
      // Action's deep work timer counts down while it is on screen
      if (n === 4) { var s = Math.max(0, clockS - Math.floor((now - introT0) / 1000) % 3600), h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, ss = s % 60;
        clockEl.textContent = h + ':' + (m < 10 ? '0' : '') + m + ':' + (ss < 10 ? '0' : '') + ss; arc.setAttribute('stroke-dashoffset', (94.2 * (1 - s / 7200)).toFixed(1)); }
      if (mode === 'looks' && now - cycleT > 2600) { cycleT = now; cycleI++; showLook(K.EARNED[cycleI % K.EARNED.length]); }
      if (mode === 'name' && typed.trim() && now - nameCycleT > 2600) { nameI++; showName(true); }
    }
    requestAnimationFrame(tick);
    layout();
    return { onScroll: onScroll, onResize: layout };
  }
  return { build: build, name: 'New' };
})();
