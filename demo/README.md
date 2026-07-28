# Claude Code Magic — scroll-cinematic

An animated, scroll-driven showcase for **Claude Code Magic** (aka SBDev): one solo,
non-technical builder orchestrating a team of AI specialist agents through a single
disciplined pipeline (Brainstorm → Plan → Approve → Execute).

It's a personal-brand piece — the framework itself has no UI, so this demo *is* its
visual identity. Linked from [swarnimbagre.com](https://swarnimbagre.com).

## What you'll see

Five scroll beats, top to bottom:

1. **Premise** — "One builder. A full company."
2. **The Discipline** — the four-stage gate lights up in order. Nothing skips.
3. **The Pipeline** — the centerpiece. A pinned, scroll-scrubbed stage where a `@kickoff`
   command sends an idea token down a rail through Idea → Plan → Build → Ship, lighting
   each phase's agents as it arrives. Hover (or tap on mobile) any agent to see what it
   ships and who picks it up.
4. **The Payoff** — the produced artifacts assemble into a shipped product.
5. **CTA** — routes to the (forthcoming) `/walkthrough`.

## Run locally

It's a static site — no build step. Any static server works:

```bash
# from this demo/ folder
python -m http.server 8000
# then open http://localhost:8000
```

(Opening `index.html` via `file://` mostly works, but a local server is recommended so
fonts and CDN scripts load cleanly.)

## Tech

- **GSAP + ScrollTrigger** — pin + scrub timeline.
- **Lenis** — inertial smooth scroll, wired to ScrollTrigger via the GSAP ticker.
- All CDN-loaded; no package install required.
- Respects `prefers-reduced-motion`: pin/scrub is disabled and every beat renders as a
  static, fully readable diagram.

## Deployment

Deploys via **GitHub Pages** served from this `demo/` folder.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Markup for the five beats + the pinned stage shell |
| `styles.css` | Command-deck design system, layout, reduced-motion fallbacks |
| `main.js`    | Data → DOM build → interaction → smooth scroll → timelines → responsive fit |
| `LICENSE`    | CC BY-NC-ND 4.0 |

## License

© 2026 Swarnim Bagre. Licensed under
[Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International](LICENSE)
(CC BY-NC-ND 4.0).
