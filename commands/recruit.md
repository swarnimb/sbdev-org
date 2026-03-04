# Command: @recruit

## Purpose
Sets up a complete project framework after `@kickoff` is done. Reads the kickoff brief, interrogates from a new angle (framework and build requirements), selects and generates the right components, and produces `manifest.md` and `CLAUDE.md`.

Produces framework files only — no PRD, no architecture, no task plan. Those are `@plan`'s job.

---

## Pre-checks

Before doing anything, verify:

- [ ] `docs/kickoff-brief.md` exists

**If `docs/kickoff-brief.md` not found:**
"`docs/kickoff-brief.md` not found. Run `@kickoff` first to document and interrogate your project idea, then re-run `@recruit`."

---

## Designer Slot Check (UI projects)

Before interrogating framework needs, determine if the project has a UI component.

Read `docs/kickoff-brief.md` — if the project includes a user interface:

Ask: "This project has a UI component. Have you consulted `@designer` for design direction? I'll use that direction to configure the `@ui` skill for this project. If you haven't consulted `@designer` yet, do that first and come back."

- If builder confirms `@designer` has been consulted: verify `docs/design-decisions.md` exists, then proceed.
- If builder has not consulted `@designer`: stop. Do not proceed until design direction exists.
- If the project has no UI (CLI tool, API, backend service): skip this check and proceed.

---

## Process

### Phase 1 — Framework interrogation

`@kickoff` already covered the 6 product dimensions. Do NOT re-interrogate those.

`@recruit` interrogates from a new angle: **what does this project actually need to succeed from a build and framework perspective?**

Questions to work through:

**Complexity**
- How many distinct deployment targets or environments will this project have?
- Are there multiple integrations that each require specialized knowledge?
- Will this project have any real-time features, background jobs, or scheduled tasks?

**Over-engineering check**
- Is anything being proposed that is more complex than the project actually needs?
- Is there a simpler approach that gets to the same outcome?
- What is the simplest version of the framework that makes this project buildable?

**Under-thinking check**
- What aspects of the project are being taken for granted that deserve dedicated framework support?
- Are there domains (security, cost management, data integrity) that seem simple but will become complex at scale?
- What will be the hardest part to build, and does the current framework plan support it?

Do not move forward until framework needs are clear and defensible.

---

### Phase 2 — Select global components

Based on the kickoff brief and framework interrogation, select which global framework components are appropriate for this project type.

**Starting hypotheses by project type** (propose and validate with builder — these are starting points, not presets):

| Project type | @designer | @ui | @security | @qa | Other |
|---|---|---|---|---|---|
| Web app / SaaS | Active | Active (React+Tailwind) | Active | Active | db agent likely |
| AI service | Inactive | Inactive | Active | Active | ai-engineer likely, cost rules likely |
| CLI tool | Inactive | Inactive | Active | Active | — |
| Mobile app | Active | Inactive | Active | Active | mobile-developer likely |
| Backend API | Inactive | Inactive | Active | Active | — |

Present the proposed baseline with rationale. Ask builder to confirm, reject, or modify each selection.

---

### Phase 3 — Identify and propose project-specific components

Two passes. Run both before presenting proposals.

---

**Pass 1 — Active domain scan**

Check the project against known high-value specialization domains. For each domain present in this project, a specialized component is proposed by default — not only when a gap is spotted. These domains consistently produce meaningfully better output than `@dev` + rules alone:

| Domain | Propose a component when... |
|--------|----------------------------|
| Payment processing (Stripe, Paddle, etc.) | Any payment feature exists |
| AI/LLM integration (OpenAI, Anthropic, etc.) | Any AI feature exists |
| Authentication system (Auth0, Supabase Auth, NextAuth, etc.) | Auth more complex than simple username/password |
| Real-time features (WebSockets, Supabase Realtime, Pusher, etc.) | Any live or collaborative feature |
| File storage (S3, Cloudinary, Supabase Storage, etc.) | Any file upload or media feature |
| Email delivery (Resend, SendGrid, Postmark, etc.) | Any transactional or marketing email |
| Background jobs / queues (Inngest, Bull, trigger.dev, etc.) | Any async processing |
| Specific ORM or database pattern (Prisma, Drizzle, etc.) | Data model has >5 entities or complex relationships |
| UI design system | Any UI project with a defined visual direction from `@designer` |
| Complex third-party API integration | Non-obvious integration patterns, significant surface area |

---

**Pass 2 — Gap identification**

After the domain scan, identify anything the project needs that is not covered by the global roster or the domain scan above. Same threshold applies.

---

**Threshold — only propose a component if all three are true:**

1. The domain has non-obvious patterns that `@dev` + rules won't naturally produce
2. It will be touched across multiple tasks — not a one-off
3. The specialization meaningfully changes implementation quality or output consistency

If a domain is present but the threshold isn't met (e.g., one simple Stripe payment with no webhooks): note it, explain why it doesn't meet the threshold, and skip the proposal.

---

**Type selection:**

- **Skill** — the need is "implement X correctly every time." Pure execution, no decisions. The right choice for most implementation-focused domains.
- **Agent** — the need is "make decisions about how to use X." Expertise with opinion, consulted before implementation. The right choice when domain choices (not just code) affect the outcome.

---

**Proposal format for each component:**

```
**Proposed: @[name]** — [skill / agent]
**Domain:** [one tight sentence — what it knows that @dev doesn't]
**What @dev gets wrong without it:** [specific — not vague "better output"]
**Active on:** [which features or tasks it will be invoked for]
**Type rationale:** [why skill vs. agent for this domain]
```

Present all proposals together. Ask builder to approve or reject each.

If rejected:
- Ask why — a rejection often signals a scope correction ("we're not building that") or a complexity correction ("that's simpler than I thought")
- Adjust remaining proposals accordingly

---

### Phase 4 — Generate approved components

For each approved project-specific component:

1. Use the corresponding template from `templates/`:
   - New agent → `templates/agent.md`
   - New skill → `templates/skill.md`
   - New rules file → `templates/rules.md`
   - New command → `templates/command.md`

2. Generate the file with the specific context for this project

3. Present the generated file to the builder for review

4. Wait for approval or revision requests before moving to the next file

**Project-specific `@ui` skill:** If the project has a UI component and `@designer` has produced direction, generate a project-specific `skills/ui-[project-name].md` that:
- References the design decisions in `docs/design-decisions.md`
- Specifies the component libraries for this project's specific type and audience
- Is registered in the manifest under `## On-Demand → Skills`

---

### Phase 5 — Generate `manifest.md`

Generate `manifest.md` using `templates/manifest.md`.

Fill in:
- Project identity (from kickoff brief)
- Always Active: all confirmed global and project-specific rules, agents, commands
- On-Demand: content-writer, demo-director, build-demo, launch-prep, create-roadmap (as appropriate)
- Inactive: explicitly list any global components not being used and why
- Available MCPs: list any MCPs the builder has configured or will configure for this project
- Project Context: stack (from kickoff brief and decisions made during recruit), current plan file
- Session Protocol: standard session protocol

Present to builder for review. Update until approved.

---

### Phase 6 — Generate `CLAUDE.md`

Generate `CLAUDE.md` using `templates/project-CLAUDE.md`. This file is placed in the project root as `CLAUDE.md` — not `project-CLAUDE.md`. Claude Code auto-reads `CLAUDE.md` at session start, which is what triggers `@session-start` automatically on every new session.

Fill in:
- Project name and description
- Out of scope (from kickoff brief)
- Project-specific conventions (from design decisions and framework choices)
- Update the Project Docs table to reflect which docs are planned vs. already created

Present to builder for review. Update until approved.

---

### Phase 7 — Write all approved files

After all components, manifest, and CLAUDE.md are approved:

Write all files to the project root or appropriate subdirectory.

Also copy `profile.md` from the sbdev_org framework root into the project root. This is how brand components (`@content-writer`, `@build-demo`) find it — they load it from the project root, not the framework root. No path navigation required.

Generate `.gitignore` in the project root covering all files listed in SEC-07 (`rules/security.md`):

```
# Claude framework — never commit
CLAUDE.md
manifest.md
profile.md
content/
docs/testing-setup.md
docs/session-log.md
docs/session-handoff.md
docs/framework-issues.md

# Environment variables
.env
.env.local
.env.*.local
# .env.example is allowed — no real values
```

Generate `.env.example` in the project root as a placeholder:

```
# Add required environment variables here as they are discovered during planning and implementation.
# Never put real values in this file — it is committed to version control.
# Copy to .env and fill in real values locally.
```

Generate `README.md` in the project root as a skeleton (per DS-05):

```markdown
# [Project Name]

[One paragraph description — what it does and who it's for. Fill in after @plan.]

## Setup

cp .env.example .env
# Fill in real values in .env

[Add install and run commands after stack is confirmed in @plan.]

## Environment Variables

See `.env.example` for required variables.

## Tests

[Add test command after stack is confirmed in @plan.]
```

Confirm: "Framework ready. Files written: [list] — including `CLAUDE.md` (project session instructions) + `profile.md` copied from sbdev_org + `.gitignore` with SEC-07 exclusions + `.env.example` placeholder + `README.md` skeleton."

Closing: "Framework ready. Run `@assumptions` to validate critical dependencies before planning."

---

## What Recruit Does NOT Produce

- `docs/prd.md` — that is `@plan`
- `docs/architecture.md` — that is `@plan`
- `docs/plan.md` — that is `@plan`
- `docs/assumptions.md` — that is `@assumptions`
- Application source code — that is `@dev`

---

## Edge Cases

**Builder rejects a proposed component:**
Ask why. The reason usually reveals either a scope correction ("we're not building that after all") or a complexity correction ("that's simpler than I thought"). Adjust remaining proposals accordingly.

**Builder doesn't know the stack:**
Provide 2-3 options with trade-offs and a clear recommendation. Note the decision in `manifest.md` as tentative — `@cto` will confirm during `@plan`. Do not block on a stack decision that doesn't need to be made yet.

**Builder has already created some framework files manually:**
Read them, validate they match the v2 templates and standards, flag any gaps. Do not silently generate duplicate files.

---

## Rules

- Never re-interrogate the 6 kickoff dimensions — those are done
- Never produce planning documents — those are `@plan`'s job
- Never write files without builder approval on each generated component
- Designer check is mandatory for UI projects — do not skip it
- Ends pointing to `@assumptions`, not `@plan`

---

## What To Do If Pre-check Fails

**If `docs/kickoff-brief.md` not found:**
"`docs/kickoff-brief.md` not found. `@recruit` needs the kickoff brief to understand the project before setting up the framework. Run `@kickoff` first — it will interrogate the idea and produce the brief. Then re-run `@recruit`."
