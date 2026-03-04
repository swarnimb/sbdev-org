# [Project Name]

> [One-line description: What it does and who it's for]

---

## First: Read the Manifest

Read `manifest.md` before anything else. It defines which agents, rules, skills, and commands are active for this project. Do not invoke any component not listed in the manifest.

---

## New Project Workflow

If this project is new and planning documents don't exist yet, follow this sequence — in order, no skipping:

1. `@kickoff` — Interrogate the idea across 6 dimensions. Produces `docs/kickoff-brief.md`.
2. `@designer` (UI projects only) — Get design direction before framework setup. Produces `docs/design-decisions.md`.
3. `@recruit` — Set up the project framework. Produces `manifest.md` and `CLAUDE.md`.
4. `@assumptions` — Validate critical dependencies before planning. Produces `docs/assumptions.md`.
5. `@plan` — Create all planning documents. Produces `docs/prd.md`, `docs/architecture.md`, `docs/plan.md`.

Do not run `@plan` until `docs/assumptions.md` exists with all critical assumptions resolved or accepted.

---

## Session Auto-Start (MANDATORY)

At the start of every new conversation in this project — before responding to anything else — automatically run `@session-start`.

Do not wait to be asked. Do not manually orient by reading docs. `@session-start` loads the right context in the right order and confirms the next task before proceeding. Run it first, every time.

---

## Out of Scope

[Explicitly what is NOT being built — fill this in during @kickoff]
-
-

---

## Project-Specific Conventions

[Anything that differs from global standards in `~/.claude/CLAUDE.md` or from the rules files — fill this in during or after @plan]

---

## Auto-Logging (MANDATORY)

Append to `docs/session-log.md` after: task completion, decisions made, errors fixed, files created or changed, and agent/skill invocations.

**Format:** `## [YYYY-MM-DD HH:MM]` then: Action, Files affected, Decision (if any), Notes.

**Confirm with:** "Logged: [brief description]"

**Rule:** Log before `/clear`. A log written after `/clear` is never written. Files are the source of truth — conversational memory is not.

---

## Project Docs

| Doc | Purpose | Status |
|-----|---------|--------|
| `manifest.md` | Active components, MCPs, session protocol | [ ] Created |
| `docs/kickoff-brief.md` | Interrogated idea brief | [ ] Created |
| `docs/assumptions.md` | Validated critical assumptions | [ ] Created |
| `docs/constraints.md` | Binding decisions from planning | [ ] Created |
| `docs/prd.md` | Product specs — what is being built | [ ] Created |
| `docs/architecture.md` | Technical architecture — how it is built | [ ] Created |
| `docs/founder-brief.md` | Plain-language record of every architectural decision | [ ] Created |
| `docs/plan.md` | Task breakdown with acceptance criteria | [ ] Created |
| `docs/session-log.md` | Session work journal | [ ] Created |
| `docs/session-handoff.md` | Handoff for next session | [ ] Created |
