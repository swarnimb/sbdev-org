# Claude Code Magic — Demo Build Plan

**Source of truth for this build. Read this first when resuming in a new session.**

---

## 1. Goal

An animated **scroll-cinematic** that explains the SBDev framework ("Claude Code Magic")
— a solo builder orchestrating a team of AI specialist agents through a disciplined
pipeline. The framework has no UI, so this demo *is* its visual identity.

- **Lives on** swarnimbagre.com → project card "Claude Code magic" as a **third link**
  (alongside the GitHub repo and the detailed writeup).
- **Quality bar:** Stripe / Linear / Apple product-page. Explicitly **NOT "AI slop."**

---

## 2. Locked Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Aesthetic | **"Command Deck"** — near-black `#0a0a0c`, clay accent `#d97757`, Space Grotesk + JetBrains Mono, terminal-native | Premium, restrained, true to Claude Code |
| Format | **Scroll-cinematic** — pin + scrub, Lenis smooth-scroll | User-paced, cinematic, recordable |
| Continuity | **One continuous line spine** + **hand-off morph** (not literal) | Threads beats into one story; keeps Discipline vs Pipeline distinct |
| Phasing | **Phase 1** = concept overview (this). **Phase 2** = real walkthrough at `/walkthrough` | Ship value early; CTA climaxes into the proof |
| Repo | Build in this repo's `demo/`. Plan: rename `sbdev-org` → `claude-code-magic`, serve via **GitHub Pages** at `swarnimb.github.io/claude-code-magic/demo/` | Matches existing demo pattern; clean URL |
| Privacy | **Do NOT make `sbdev-private` public.** 2 repos total: `sbdev-private` (workshop) + public `claude-code-magic` | Keep the workshop private |
| Protection | **No watermark** (pointless for static site). Use **signature + CC-BY-NC-ND license** | Live site is always copyable; protect via branding + legal |

---

## 3. Architecture

- **Static site, no backend.** Hosts free on GitHub Pages.
- **Files:** `demo/index.html` + `styles.css` + `main.js` + `LICENSE` + `README.md`
- **Libraries (CDN):**
  - GSAP + ScrollTrigger — cdnjs
  - **Lenis — jsdelivr** (`https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js`)
    ⚠️ The cdnjs Lenis URL **404s** — do not use it. Init is **guarded** (`typeof Lenis === 'function'`)
    so a CDN failure degrades to native scroll instead of killing every animation.
- **One pinned, scrubbed master GSAP timeline** in `main.js` drives the whole cinematic.
- **Smooth scroll:** Lenis `lerp: 0.1` (single smoothing source) + ScrollTrigger `scrub: true`
  (do NOT stack `scrub: 1` on top of Lenis — that was the jitter bug).

---

## 4. Beats (current structure)

```
[1] HERO            normal scroll · "One builder. A full company."
                    ↓ (scroll away; scroll-hint fades)
[2] CINEMATIC       PINNED + SCRUBBED — one master timeline:
      a. Line drops in   clay spine draws center-top → settles to rail start (180,240);
                         idea token rides it down. ONE downward motion.
      b. Discipline      token parks; gates light in place L→R:
                         Brainstorm → Plan → Approve → Execute · "Nothing skips."
      c. Hand-off morph  discipline recedes (fade+lift); Pipeline emerges on SAME rail.
      d. Pipeline runs   token travels L→R through Idea→Plan→Build→Ship; each column
                         lights (hub/label/spine/chips); hover/tap agent → card.
                    ↓ unpin
[3] PAYOFF          artifacts → "Shipped product" card.   ⚠️ TO FOLD into [2d] (see §6)
[4] CTA             "Watch it build something real →"  → /walkthrough (Phase 2)
```

**Motion rule:** the token moves in **one direction only** — drop down, then run right.
No left/right reversals. (The earlier multi-sweep bug is fixed.)

---

## 5. Agent / Phase Data (source of truth — do not invent agents)

| Phase | Agents (name · delivers · hands to) |
|-------|--------------------------------------|
| **Idea** | `@kickoff` kickoff-brief.md → @plan · `@cpo` product direction → @plan · `@cto` feasibility note → @plan |
| **Plan** | `@plan` plan + roadmap → @dev · `@cto` architecture spec → @dev · `@designer` design specs → @ui |
| **Build** | `@dev` working code → @code-review · `@ui` UI components → @qa · `@security` audit findings → @dev · `@qa` release sign-off → @demo-dir |
| **Ship** | `@demo-director` demo build → launch · `@content-writer` content posts → launch |

Terminal command shown: `@kickoff "an app that helps people save money"`

---

## 6. Open Decisions (resolve before continuing)

1. **Fold the Payoff into the cinematic.** The "Shipped product" should be the **final beat
   of the pinned animation** (artifacts assemble at the Ship end → product), not a separate
   screen. Then unpin straight to the CTA. *(User requested — not yet built.)*

2. **Phase 2 `/walkthrough` — "how do we show an actual run?"** Options:
   - **(A) Curated replay of a REAL Claude Code session** *(recommended)* — real `@` commands
     and real artifacts from a session you actually ran, presented as a designed, paced
     playback. Authentic + premium, **no backend**.
   - (B) Embedded screen recording (asciinema/video) — most authentic, least designed.
   - (C) Live interactive run — visitor types an idea, it really runs Claude Code via an API
     backend. Most "magic" but **expensive + risky** (API cost, abuse protection, security).
     Likely overkill for a portfolio piece.
   - **Decision: NOT YET MADE.** Recommend (A).

---

## 7. Known Issues / To Tune (Phase 1)

- **Smoothness:** improved, but user wants more "buttery." Tune Lenis `lerp` / beat pacing.
- **Pacing:** pin length `end: '+=3400'` — tune per-beat room after visual review.
- **Spine entry balance:** drops from center-top to the left rail start — confirm it reads
  balanced, not left-heavy. (Alternative: straight drop at the left.)
- **Responsive + reduced-motion:** implemented; needs real device QA.
- **`prefers-reduced-motion`:** hides spine/token + discipline, shows pipeline static & tappable.

---

## 8. Roadmap

- **Phase 1 (in progress):** concept overview → fold payoff (§6.1), tune motion, responsive QA, deploy.
- **Phase 2 (later):** build `/walkthrough` real-run page (§6.2).

### Deploy checklist (when Phase 1 is ready)
1. Rename GitHub repo `sbdev-org` → `claude-code-magic` (GitHub auto-redirects old links).
2. `git remote set-url` in local clones.
3. Enable GitHub Pages (serve from root); demo at `/demo/`.
4. Update the website project-card link to the new URL.

---

## 9. File Map

```
demo/
  index.html        production
  styles.css        production
  main.js           production
  LICENSE           CC-BY-NC-ND
  README.md         how to run / deploy
  PLAN.md           ← this file (source of truth)
```

> Early pilot folders (`command-deck`, `blueprint`, `command-deck-flow`, `scroll-proof`)
> were deleted after they served their purpose (choosing the direction). The chosen
> aesthetic + mechanics now live in the production files above.

---

## 10. Current State (last updated this session)

- Phase 1 build **exists and runs** — verified: no console errors, Lenis active, pin works.
- **Just fixed:** the broken multi-sweep token travel + hero-trapped-in-pin. Now a single
  drop→right flow; hero is its own scroll-away section. Verified by geometry (spine end =
  rail start `180,240`). **Pending user visual confirmation on reload.**
- **Next:** user to review the fixed motion → then resolve §6 open decisions → continue.
