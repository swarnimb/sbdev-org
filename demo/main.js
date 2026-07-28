/* ============================================================
   Claude Code Magic — scroll-cinematic
   © 2026 Swarnim Bagre — All rights reserved.

   ONE continuous pinned cinematic. A single clay "spine" line is the
   through-thread: it appears under the premise headline, travels down,
   elbows into a horizontal rail, the Discipline stations light along it,
   then they recede and the Pipeline emerges on the SAME rail and runs.

   Structure of this file:
     1. DATA            — phase / agent model (verbatim from prototype)
     2. GEOMETRY        — stage layout constants
     3. BUILD DOM       — spine path, rails, spines, hubs, labels, chips,
                          discipline stations, popovers
     4. INTERACTION     — hover / tap agent cards (spotlight dim)
     5. SMOOTH SCROLL   — Lenis wired to GSAP ScrollTrigger
     6. MASTER TIMELINE — premise → spine → elbow → discipline → hand-off
                          → pipeline (all on one pinned, scrubbed stage)
     7. PAYOFF / CTA    — normal scroll-reveal sections after the pin
     8. RESPONSIVE      — scale the fixed-size pinned stage to the viewport
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover:none)').matches;

/* ============================================================
   1. DATA — exact phase/agent data from the prototype.
   ============================================================ */
const PHASES = [
  { label: 'Idea', x: 180, agents: [
    { n: '@kickoff', r: 'Interrogates & validates the raw idea', out: 'kickoff-brief.md', to: '@plan' },
    { n: '@cpo',     r: 'Product strategy & user value',         out: 'product direction', to: '@plan' },
    { n: '@cto',     r: 'Technical feasibility call',            out: 'feasibility note',  to: '@plan' },
  ]},
  { label: 'Plan', x: 450, agents: [
    { n: '@plan',     r: 'Turns the brief into specs & roadmap', out: 'plan + roadmap',    to: '@dev' },
    { n: '@cto',      r: 'Architecture & stack decisions',       out: 'architecture spec', to: '@dev' },
    { n: '@designer', r: 'Design system & UX decisions',         out: 'design specs',      to: '@ui' },
  ]},
  { label: 'Build', x: 720, agents: [
    { n: '@dev',      r: 'Implements features to spec',  out: 'working code',     to: '@code-review' },
    { n: '@ui',       r: 'Builds the interface components', out: 'UI components',  to: '@qa' },
    { n: '@security', r: 'Audits for vulnerabilities',   out: 'audit findings',   to: '@dev' },
    { n: '@qa',       r: 'Tests & signs off the release', out: 'release sign-off', to: '@demo-dir' },
  ]},
  { label: 'Ship', x: 990, agents: [
    { n: '@demo-director',  r: 'Plans the demo & launch story', out: 'demo build',    to: 'launch' },
    { n: '@content-writer', r: 'Writes the brand content',      out: 'content posts', to: 'launch' },
  ]},
];

const CMD_TEXT = '@kickoff "an app that helps people save money"';

// the 4 discipline gates, mapped onto the same x-positions as the phase hubs
const GATES = ['Brainstorm', 'Plan', 'Approve', 'Execute'];

/* ============================================================
   2. GEOMETRY — must match the stage viewBox (1140 x 680).
   Every element in a phase column aligns to PHASES[i].x.
   ============================================================ */
const HUBY  = 240;   // y of the horizontal rail & hubs
const CHIP0 = 300;   // y of the first chip in a column
const STEP  = 62;    // vertical spacing between chips
const LABEL_Y = 168; // y of phase labels

// the spine path: starts top-center, runs down, elbows into the rail,
// then runs left to the first hub (PHASES[0].x). One <path>.
const SPINE_TOP_X = 570;            // stage center x
const SPINE_TOP_Y = 96;             // a little below the terminal
const ELBOW_Y     = HUBY;           // rail height
const RAIL_LEFT   = PHASES[0].x;    // 180
// Cubic: starts top-centre (below the hero), drifts LEFT as it descends, and
// arrives moving straight DOWN into the rail's left start. All the horizontal
// motion is absorbed into the fall — the token never slides along the rail.
const SPINE_D = `M ${SPINE_TOP_X} 36 C ${SPINE_TOP_X} 150, ${RAIL_LEFT} 120, ${RAIL_LEFT} ${ELBOW_Y}`;

/* ============================================================
   3. BUILD DOM
   ============================================================ */
const SVGNS  = 'http://www.w3.org/2000/svg';
const stage  = document.getElementById('stage');
const rails  = document.getElementById('rails');
const spines = document.getElementById('spines');
const layer  = document.getElementById('layer');
const dLayer = document.getElementById('disciplineLayer');
const tokenEl = document.getElementById('token');
const cmdEl   = document.querySelector('.cmd');
const spinePath = document.getElementById('spinePath');

function svgline(parent, x1, y1, x2, y2, cls) {
  const l = document.createElementNS(SVGNS, 'line');
  l.setAttribute('x1', x1); l.setAttribute('y1', y1);
  l.setAttribute('x2', x2); l.setAttribute('y2', y2);
  l.setAttribute('class', cls);
  parent.appendChild(l);
  return l;
}

// 3a. the spine path + its draw length (for stroke-dashoffset draw-on)
spinePath.setAttribute('d', SPINE_D);
const SPINE_LEN = spinePath.getTotalLength();
spinePath.style.strokeDasharray = SPINE_LEN;
spinePath.style.strokeDashoffset = SPINE_LEN; // hidden until drawn

// 3b. horizontal rail segments between consecutive hubs (base + hot overlay)
const segs = [];
PHASES.forEach((ph, i) => {
  if (i < PHASES.length - 1) {
    const nextX = PHASES[i + 1].x;
    svgline(rails, ph.x, HUBY, nextX, HUBY, 'rail');
    const hot = svgline(rails, ph.x, HUBY, nextX, HUBY, 'rail-hot');
    const len = nextX - ph.x;
    hot.style.strokeDasharray = len;
    hot.style.strokeDashoffset = len;
    segs.push(hot);
  }
});

// 3c. DISCIPLINE stations — one per phase x, sitting ON the rail.
//     A dot on the rail + a label below it. Built hidden; lit by the timeline.
const dstations = [], dwords = [], ddots = [];
GATES.forEach((g, i) => {
  const st = document.createElement('div');
  st.className = 'dstation';
  st.style.left = PHASES[i].x + 'px';
  st.style.top  = (HUBY - 6) + 'px';
  st.innerHTML = `<span class="ddot"></span><span class="dword">${g}</span>`;
  dLayer.appendChild(st);
  dstations.push(st);
  dwords.push(st.querySelector('.dword'));
  ddots.push(st.querySelector('.ddot'));
});

// discipline caption (centered above the rail)
const dLabel = document.createElement('div');
dLabel.className = 'dlabel';
dLabel.style.top = LABEL_Y + 'px';
dLabel.innerHTML = `<span class="dk">The Discipline</span>Every idea moves through all four. <b>Nothing skips.</b>`;
dLayer.appendChild(dLabel);

// 3d. per-phase spine + label + hub + chips, all aligned to ph.x (PIPELINE)
const hubs = [], plabels = [], phaseChips = [], phaseSpines = [];
PHASES.forEach((ph, i) => {
  const lastY = CHIP0 + (ph.agents.length - 1) * STEP;

  // vertical spine running down through the chips
  svgline(spines, ph.x, HUBY + 8, ph.x, lastY, 'spine');
  const spineHot = svgline(spines, ph.x, HUBY + 8, ph.x, lastY, 'spine-hot');
  const slen = lastY - (HUBY + 8);
  spineHot.style.strokeDasharray = slen;
  spineHot.style.strokeDashoffset = slen;
  phaseSpines.push(spineHot);

  // phase label (centred on column via CSS translateX(-80px))
  const lb = document.createElement('div');
  lb.className = 'plabel mono';
  lb.style.left = ph.x + 'px';
  lb.style.top = LABEL_Y + 'px';
  lb.innerHTML = `<span class="n">PHASE 0${i + 1}</span>${ph.label}`;
  layer.appendChild(lb);
  plabels.push(lb);

  // hub node
  const hb = document.createElement('div');
  hb.className = 'hub';
  hb.style.left = ph.x + 'px';
  hb.style.top = HUBY + 'px';
  layer.appendChild(hb);
  hubs.push(hb);

  // agent chips (last column opens popovers to the left to stay in-stage)
  const cs = [];
  ph.agents.forEach((a, j) => {
    const c = document.createElement('div');
    c.className = 'chip' + (i === PHASES.length - 1 ? ' left' : '');
    c.style.left = ph.x + 'px';
    c.style.top = (CHIP0 + j * STEP) + 'px';
    c.innerHTML =
      `<div class="nm">${a.n}</div><div class="role">${a.r}</div>
       <div class="pop">
         <div class="pn">${a.n}</div>
         <div class="pd">${a.r}</div>
         <div class="div"></div>
         <div class="kv"><span class="k">Delivers</span><span class="v acc">${a.out}</span></div>
         <div class="kv"><span class="k">Hands to</span><span class="v">${a.to}</span></div>
       </div>`;
    layer.appendChild(c);
    cs.push(c);
    wireChip(c);
  });
  phaseChips.push(cs);
});

/* ============================================================
   4. INTERACTION — hover (desktop) / tap (touch) with spotlight.
   On touch, tapping a chip toggles its card and dims the rest;
   tapping empty space clears.
   ============================================================ */
function wireChip(c) {
  if (isTouch) {
    c.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.chip.tap').forEach((o) => { if (o !== c) o.classList.remove('tap'); });
      c.classList.toggle('tap');
      stage.classList.toggle('focus', c.classList.contains('tap'));
    });
  } else {
    c.addEventListener('mouseenter', () => stage.classList.add('focus'));
    c.addEventListener('mouseleave', () => stage.classList.remove('focus'));
  }
}
if (isTouch) {
  document.addEventListener('click', () => {
    document.querySelectorAll('.chip.tap').forEach((o) => o.classList.remove('tap'));
    stage.classList.remove('focus');
  });
}

/* token helper — moves the travelling idea token.
   setToken(x): place on the horizontal rail at x.
   setTokenAt(len): place along the spine path by arc-length (for the
   draw-down + elbow), so the token rides the exact curve. */
function setToken(x) { tokenEl.setAttribute('transform', `translate(${x},${HUBY})`); }
function setTokenAt(len) {
  const pt = spinePath.getPointAtLength(Math.max(0, Math.min(SPINE_LEN, len)));
  tokenEl.setAttribute('transform', `translate(${pt.x},${pt.y})`);
}
setTokenAt(0);
cmdEl.textContent = CMD_TEXT;

/* ============================================================
   REDUCED MOTION — short-circuit.
   No pin/scrub. We reparent the premise headline + discipline gate OUT of
   the (fixed-size, absolutely-laid-out) stage so they stack cleanly ABOVE
   the pipeline diagram with zero overlap. CSS paints everything in its final
   lit state; the stage keeps its fixed diagram coords for the pipeline.
   "ready" makes the agent cards tappable.
   ============================================================ */
if (REDUCED) {
  // No pin/scrub: hide the spine + token, drop the discipline overlay, and let
  // the pipeline diagram paint in its default (visible) state, cards tappable.
  stage.classList.add('ready');
  dLayer.style.display = 'none';
  spinePath.style.display = 'none';
} else {
  initMotion();
}

/* ============================================================
   5. SMOOTH SCROLL + 6. MASTER TIMELINE + 7. PAYOFF/CTA + 8. RESPONSIVE
   ============================================================ */
function initMotion() {
  /* ----- initial hidden states (tweened, so scrub reverses cleanly) ----- */
  gsap.set('#pipeKicker', { opacity: 0 });
  gsap.set('#term', { opacity: 0 });
  gsap.set('.cmd', { maxWidth: 0 });
  gsap.set('#flowcap', { opacity: 0 });

  // pipeline elements hidden until the hand-off
  gsap.set(plabels, { opacity: 0 });
  gsap.set(hubs, { opacity: 0 });
  gsap.set(phaseChips.flat(), { opacity: 0, y: 10 });

  // discipline elements hidden until the spine reaches the rail
  gsap.set(dstations, { opacity: 0, y: 6 });
  gsap.set(dLabel, { opacity: 0, y: 6 });

  const LIT_CHIP = { borderColor: 'rgba(217,119,87,.55)', boxShadow: '0 0 18px -4px rgba(217,119,87,.4)' };
  const LIT_HUB  = { borderColor: 'var(--accent)', boxShadow: '0 0 0 4px rgba(217,119,87,.12),0 0 14px rgba(217,119,87,.5)' };
  const LIT_DOT  = { borderColor: 'var(--accent)', boxShadow: '0 0 0 3px rgba(217,119,87,.12),0 0 10px rgba(217,119,87,.5)' };

  /* ---------- 5. Lenis smooth scroll, wired to ScrollTrigger ----------
     ONE smoothing source: lerp (inertial). scrub:true on the pinned
     timeline ties tweens directly to scroll position so we don't stack a
     second lag on top of Lenis. Guarded so a CDN hiccup degrades to native
     scroll instead of throwing and killing every animation below. */
  if (typeof Lenis === 'function') {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    console.error('[demo] Lenis failed to load — falling back to native scroll. Check the CDN URL.');
  }

  /* ---------- 6. THE MASTER TIMELINE — pinned + scrubbed ----------
     scrub:true ties the timeline 1:1 to scroll position (Lenis smooths).
     end:+=4200 gives the long timeline room so no beat feels rushed. */
  const cmdWidth = cmdEl.scrollWidth;

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: '.cinematic', start: 'top top', end: '+=3400', pin: true, scrub: true,
      onEnter:     () => stage.classList.add('ready'),
      onEnterBack: () => stage.classList.add('ready'),
      onLeave:     () => stage.classList.remove('ready'),
      onLeaveBack: () => stage.classList.remove('ready'),
    },
  });

  /* gentle intro on load — hero headline settles in before scroll */
  gsap.from('#hero .inner > *', {
    y: 28, opacity: 0, duration: 1, stagger: .14, ease: 'power3.out', delay: .2,
  });
  // scroll hint fades out as the hero scrolls away
  gsap.to('#scrollhint', {
    opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom 65%', scrub: true },
  });

  /* --- BEAT 1 · THE LINE DROPS IN: just below the hero, the clay spine draws
         down and settles to the LEFT start of the rail; the idea token rides it
         down. ONE downward motion — no sideways sweeping. --- */
  tl.to('#token', { opacity: 1, duration: .3 }, 0);
  tl.to(spinePath, { strokeDashoffset: 0, duration: 2.0, ease: 'power1.inOut' }, 0);
  tl.to({ l: 0 }, {
    l: SPINE_LEN, duration: 2.0, ease: 'power1.inOut',
    onUpdate() { setTokenAt(this.targets()[0].l); },
  }, 0);

  /* --- BEAT 2 · THE DISCIPLINE: the token PARKS at the rail start; the four
         gates light in order (left → right) WITHOUT moving the token. --- */
  tl.to(dLabel, { opacity: 1, y: 0, duration: .6 }, '>');
  GATES.forEach((g, i) => {
    tl.to(dstations[i], { opacity: 1, y: 0, duration: .4 }, i === 0 ? '>' : '>-.12')
      .to(dwords[i], { color: 'var(--accent-soft)', duration: .4 }, '<')
      .to(ddots[i], { ...LIT_DOT, duration: .4 }, '<');
  });

  /* --- BEAT 3 · HAND-OFF MORPH: the Discipline recedes (fade + lift) and the
         Pipeline emerges on the SAME rail. The token stays put at the start —
         no glide back. Dissolve-then-emerge: two distinct concepts. --- */
  tl.addLabel('handoff', '>+.4');
  tl.to([...dstations, dLabel], { opacity: 0, y: -16, duration: .6, stagger: .04 }, 'handoff');
  tl.to(spinePath, { opacity: .15, duration: .6 }, 'handoff');
  tl.to('#pipeKicker', { opacity: 1, duration: .5 }, 'handoff+=.25');
  tl.to('#term', { opacity: 1, duration: .4 }, 'handoff+=.35');
  tl.to('#flowcap', { opacity: 1, duration: .5 }, 'handoff+=.6');

  /* --- BEAT 6 · THE PIPELINE RUNS (reused from the prototype exactly).
         Terminal types the command, then for each phase: charge the inbound
         rail + travel the token, then light the column (hub/label/spine/chips).
         All via tweens so scrub reverses cleanly. --- */
  tl.addLabel('pipeline', 'handoff+=1.0');
  tl.to('.cmd', { maxWidth: cmdWidth, duration: 1.0, ease: 'steps(40)' }, 'pipeline');

  PHASES.forEach((ph, i) => {
    if (i > 0) {
      tl.to(segs[i - 1], { strokeDashoffset: 0, duration: 1 }, '+=.1')
        .to({}, {
          duration: 1,
          onUpdate() {
            const p = this.progress();
            setToken(PHASES[i - 1].x + (ph.x - PHASES[i - 1].x) * p);
          },
        }, '<');
    }
    tl.to(hubs[i], { opacity: 1, ...LIT_HUB, duration: .4 }, i === 0 ? '+=.2' : '>-.2')
      .to(plabels[i], { opacity: 1, color: '#e8a87c', duration: .4 }, '<')
      .to(phaseSpines[i], { strokeDashoffset: 0, duration: .5 }, '<')
      .to(phaseChips[i], { opacity: 1, y: 0, ...LIT_CHIP, duration: .5, stagger: .18, ease: 'power2.out' }, '<.1');
  });

  /* --- BEAT 7 · HOLD before the pin releases --- */
  tl.to({}, { duration: 1.0 });

  /* ---------- 7. PAYOFF + CTA: normal scroll-reveal (after the pin) ---------- */
  gsap.from('.payoff .kick', { y: 24, opacity: 0, duration: .7,
    scrollTrigger: { trigger: '.payoff', start: 'top 70%' } });
  gsap.from('.arts .art', { y: 24, opacity: 0, duration: .6, stagger: .1, ease: 'power2.out',
    scrollTrigger: { trigger: '.arts', start: 'top 78%' } });
  gsap.from('.product', { scale: .85, opacity: 0, duration: .8, ease: 'back.out(1.4)',
    scrollTrigger: { trigger: '.product', start: 'top 82%' } });
  gsap.from('.cta .inner > *', { y: 22, opacity: 0, duration: .7, stagger: .12, ease: 'power2.out',
    scrollTrigger: { trigger: '.cta', start: 'top 80%' } });

  /* ---------- 8. RESPONSIVE — scale the fixed 1140x680 stage to fit ---------- */
  function fit() {
    // leave a small margin so the stage never kisses the viewport edges
    const s = Math.min(window.innerWidth / 1200, window.innerHeight / 740, 1);
    document.querySelector('.stage-wrap').style.transform = `scale(${s})`;
    ScrollTrigger.refresh();
  }
  window.addEventListener('resize', fit);
  window.addEventListener('load', fit);
  fit();

  // fonts load async and shift layout — recompute pin/scrub measurements once ready
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}
