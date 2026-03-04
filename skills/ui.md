# Skill: UI

> **React + Tailwind only.** This skill is not applicable to non-React projects. For Vue, Svelte, vanilla JS, or mobile (React Native excluded pending project-specific skill), do not invoke this skill — the project's `manifest.md` will reference a project-specific UI skill if one exists.

---

## Purpose
Pure execution — builds UI components and features using the project's design direction and component libraries. Follows `@designer`'s direction. Does not make design decisions — applies them.

---

## Modes

### `@ui` (reference)
Shows active project type and design direction from `docs/design-decisions.md`. If no design decisions doc exists, asks: "Has `@designer` been consulted? Design direction is needed before building UI."

### `@ui [project-type]`
Sets active UI mode for the session. Applies that project type's component rules to all UI work until changed.

### `@ui [project-type] [feature]`
Builds the specified feature using that project type's rules.

---

## Pre-conditions

Before building any UI:
1. Check `manifest.md` — check whether Playwright or devtools MCP is configured (for visual verification)
2. Read `docs/design-decisions.md` — confirm design direction exists. If not, prompt: "Consult `@designer` before building UI — design direction is needed." Also check the **Platform Target** field and apply the platform constraints below.
3. Confirm the project uses React + Tailwind — if not, this skill does not apply
4. Read the task spec from `plan.md` — understand exactly what component or feature to build

### Platform Constraints (from `docs/design-decisions.md`)

Apply the constraint set that matches the project's Platform Target:

| Platform Target | Constraints to apply |
|---|---|
| Web responsive | Mobile-first CSS. All components must work at 320px viewport and up. No hover-only interactions. |
| Web mobile only | 48px minimum touch targets everywhere. No hover-only interactions. Test at mobile viewport (375px). |
| Web desktop only | Hover interactions allowed. Dense layouts acceptable. Mobile behavior is secondary. |
| Native mobile app | This skill does not apply — use the project-specific mobile UI skill. |

If Platform Target is not set in `docs/design-decisions.md`: apply **Web responsive** constraints as the safe default and note: "Platform target not found in design-decisions.md — applied responsive constraints by default."

---

## Project Types

### `@ui saas`
**For:** Apps where users log in and do work (dashboards, tools, portals)
**Vibe:** Clean, professional, minimal distractions
**Goal:** Comfortable for hours of use

| Element | Source | Notes |
|---------|--------|-------|
| All components | shadcn/ui | Consistency is king |
| Icons | Lucide (bundled with shadcn) | Simple, consistent |
| Charts | shadcn charts or Recharts | Clean data viz |

**Principles:**
- White space is intentional
- Muted colors, accent used sparingly
- No animations except subtle transitions
- Information density over flash

**Reference:** Linear, Notion, Stripe Dashboard

---

### `@ui landing`
**For:** Marketing pages that sell the product
**Vibe:** Impressive, eye-catching, conversion-focused
**Goal:** Make visitors understand and want to sign up

| Element | Source | Notes |
|---------|--------|-------|
| Base components | shadcn/ui | Forms, buttons, navigation |
| Hero sections | Aceternity UI | Animated backgrounds, spotlight effects |
| Scroll animations | Aceternity UI | Reveal effects |
| CTA buttons | Magic UI | Shimmer, glow effects |
| Social proof | Magic UI | Animated testimonials, marquees |

**Principles:**
- Hero must communicate the value proposition in under 3 seconds
- One clear CTA per section
- Animation supports message, never distracts
- Mobile must work perfectly

**Reference:** Vercel, Linear marketing site, Raycast

---

### `@ui consumer`
**For:** Apps regular people use daily (lifestyle, finance, social)
**Vibe:** Playful, satisfying, has personality
**Goal:** Delightful to use, builds habits

| Element | Source | Notes |
|---------|--------|-------|
| Base components | shadcn/ui | Foundation |
| Buttons/Toggles | Magic UI, uiverse.io | Micro-interactions |
| Loaders | uiverse.io | Satisfying wait states |
| Success states | Magic UI | Celebrate completions |

**Principles:**
- Micro-interactions on every meaningful action
- Celebrate user wins
- Personality in empty states and error messages
- Touch targets generous for mobile

**Reference:** Duolingo, Cash App, Headspace

---

### `@ui internal`
**For:** Admin panels, back-office tools, team-only apps
**Vibe:** Functional, fast, no-nonsense
**Goal:** Get work done efficiently

| Element | Source | Notes |
|---------|--------|-------|
| All components | shadcn/ui | Simple, accessible |
| Tables | shadcn/ui data table | Sorting, filtering built-in |
| Forms | shadcn/ui | Standard patterns |

**Principles:**
- Function over form
- Dense information display is fine
- No decorative animations
- Keyboard shortcuts for power users

**Reference:** Standard admin templates, Retool

---

## Component Libraries Reference

### shadcn/ui (Primary for all project types)
- **URL:** https://ui.shadcn.com/
- **Use for:** Foundation of everything — forms, buttons, dialogs, navigation, data display
- **Tech:** React + Tailwind (copy-paste, not npm install)

### Aceternity UI (Landing pages)
- **URL:** https://ui.aceternity.com/components
- **Use for:** Hero sections, scroll animations, background effects, spotlights
- **Tech:** React + Tailwind + Framer Motion

### Magic UI (Accents and delight)
- **URL:** https://magicui.design/
- **Use for:** Animated buttons, text effects, loaders, marquees, particles
- **Tech:** React + Tailwind

### uiverse.io (Community components)
- **URL:** https://uiverse.io/
- **Use for:** Creative buttons, toggles, loaders, checkboxes, cards
- **Tech:** Pure CSS/HTML (adapt to React + Tailwind)

---

## Tools

### Visual Verification (if configured in manifest)
If the project's `manifest.md` lists Playwright MCP or devtools MCP under `## Available MCPs`:

After building a component or feature:
1. Use the MCP to take a screenshot of the rendered component
2. Verify it matches the design direction in `docs/design-decisions.md`
3. If it does not match: identify the gap, fix, screenshot again
4. Report: "Built [component]. Screenshot taken — visual implementation matches design direction." or "Screenshot taken — [specific gap found], fixed."

If no visual MCP is configured: report the component as built and note: "No visual MCP configured — visual verification skipped."

---

## Process

### When `@ui [type]` is invoked:
1. Acknowledge the active mode and confirmed platform constraints
2. Apply that type's rules to all UI work this session until told otherwise
3. For each component: use the source table for that project type, follow the principles, reference the example sites for decisions, apply platform constraints from Pre-conditions
4. Present the component code to the builder for review before writing to disk. Do not write without confirmation.
5. After approval and writing: take a screenshot if Playwright or devtools MCP is available and verify against design-decisions.md

### When uncertain:
- Default to shadcn/ui (always safe)
- Ask: "Want me to add [effect] from [library] here, or keep it simple?"

---

## Switching Modes

To change UI mode mid-session: invoke `@ui [different-type]` — new rules apply from that point forward.

To turn off UI mode: `@ui off` or start a new session.

---

## Closing

After building, approval, writing, and visual verification: "Built [component name] — [project type] mode, [platform target] constraints applied. [Screenshot match / No visual MCP configured]."

---

## Project-Specific UI Skill

`@recruit` creates a project-specific `@ui` skill file based on the project's stack and `@designer`'s direction. That file overrides this one for that project. Check `manifest.md` — if a project-specific UI skill is listed, use it instead.
