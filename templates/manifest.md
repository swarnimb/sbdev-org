# Manifest: [Project Name]

> Per-project file. Created by `@recruit`. Updated as the project evolves.
> This is the activation record for the project. `@session-start` reads this first.
> Only components listed here are active for this project. Everything else is inactive.

---

## Project Identity

**Name:** [Project name]
**Description:** [One line — what it does and who it's for]
**Phase:** [Pre-build / Build / Launch / Maintain]
**Type:** [Web app / API / CLI tool / Mobile app / AI service / Other]

---

## Always Active

> Loaded at every session start. These are the baseline components for this project.

### Rules
- `rules/security.md`
- `rules/error-handling.md`
- `rules/code-quality.md`
- `rules/testing-standards.md`
- `rules/documentation-standards.md`
- [project-specific rules files, if any — e.g., `rules/cost-limits.md`]

### Agents
- `agents/cto.md` — architecture and technical decisions
- `agents/cpo.md` — product specs and scope
- `agents/dev.md` — implementation
- [Add only what this project actually uses]
- [e.g., `agents/security.md` — add if security reviews are in scope]
- [e.g., `agents/qa.md` — add if QA reviews are in scope]
- [e.g., `agents/designer.md` — add if UI is in scope]

### Commands
- `commands/session-start.md`
- `commands/end-session.md`
- `commands/create-plan.md`
- [Add others as needed]

---

## On-Demand

> Loaded when relevant. Not part of the baseline session context.

### Agents
- [e.g., `agents/content-writer.md` — invoked when creating brand content]
- [e.g., `agents/demo-director.md` — invoked when planning a demo]

### Commands
- [e.g., `commands/build-demo.md` — invoked at demo checkpoints]
- [e.g., `commands/launch-prep.md` — invoked before release]
- [e.g., `commands/create-roadmap.md` — invoked when roadmap is needed]

### Skills
- `skills/code-review.md` — invoked at milestones and before QA
- [e.g., `skills/write-tests.md` — invoked when writing tests]
- [e.g., `skills/ui.md` — invoked for UI work (React + Tailwind projects only)]

---

## Inactive

> Explicitly excluded from this project with reason. This list prevents confusion — if it's not here, it's not missing, it's intentionally off.

| Component | Reason |
|---|---|
| [e.g., `agents/designer.md`] | [e.g., CLI tool — no UI in scope] |
| [e.g., `skills/ui.md`] | [e.g., Backend API — no frontend] |
| [e.g., `agents/demo-director.md`] | [e.g., Internal tool — no demos planned] |

---

## Available MCPs

> MCP tools configured for this project. `@dev`, `@ui`, and other agents check this section to know what tools are available. If a tool is not listed here, it is not available — do not assume it exists.

| Tool | MCP Name | Purpose |
|---|---|---|
| [e.g., Playwright] | [e.g., playwright] | [e.g., UI visual verification, screenshot testing] |
| [e.g., Supabase] | [e.g., supabase] | [e.g., Database management and queries] |
| [e.g., GitHub] | [e.g., github] | [e.g., Issue tracking and PR management] |

*If no MCPs are configured: "None configured for this project."*

---

## Project Context

> Key facts that inform all session work. Keep this current — if it changes, update it.

**Stack:**
- Frontend: [e.g., Next.js 14, React, Tailwind CSS]
- Backend: [e.g., Next.js API routes]
- Database: [e.g., Supabase (PostgreSQL)]
- Auth: [e.g., Supabase Auth]
- Deployment: [e.g., Vercel]

**Key constraints:**
- [e.g., No server-side sessions — JWT only]
- [e.g., Mobile-first — all UI reviewed on 375px viewport]
- [Binding decisions from docs/constraints.md that every session must know]

**Current plan file:** [e.g., `docs/plan.md` | `docs/plan-index.md` for complex projects]

---

## Session Protocol

> How sessions work for this project.

1. Run `@session-start` at the start of every session — do not skip
2. Read manifest (this file) → load architecture + constraints + assumptions + handoff → confirm next task
3. Complete one task per session where possible
4. After each task: log → mark done → `/clear`
5. Run `@end-session` before ending

**Manifest accuracy:** This file must reflect the current state of the project. If components are added, removed, or changed, update this file before ending the session.
