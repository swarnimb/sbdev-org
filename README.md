# SBDev Organization Framework

A lightweight framework for solo builders using Claude Code. It provides thinking discipline through structured phases, documentation, and quality checks.

## What This Framework Is

**Is:** A thinking discipline that forces clarity before building
**Not:** A simulation of a real company with bureaucracy

The framework separates:
- **WHAT** to build (Product thinking → PRD)
- **HOW** to build it (Technical thinking → Architecture)
- **TASKS** to complete (Planning → Plan)
- **QUALITY** checks (Code review, QA, Testing)
- **DESIGN** guidance (UI component selection, design consistency)

---

## Project Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                        PROJECT START                             │
│  Create project folder → Copy project-CLAUDE.md template        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                        BRAINSTORM                                │
│  Just talk to Claude. No invocations. Explore ideas freely.      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                         KICKOFF                                  │
│  @kickoff → Interrogates idea across 6 dimensions                │
│  Produces docs/kickoff-brief.md                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  DESIGN DIRECTION (UI projects only)             │
│  @designer → Defines visual direction and component approach     │
│  Produces docs/design-decisions.md                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     SET UP FRAMEWORK                             │
│  @recruit → Selects and generates project-specific components    │
│  Produces manifest.md and project-CLAUDE.md                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    VALIDATE ASSUMPTIONS                          │
│  @assumptions → Surfaces and resolves critical dependencies      │
│  Produces docs/assumptions.md                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                          PLAN                                    │
│  @plan → Creates all planning documents                          │
│  Produces docs/prd.md, docs/architecture.md, docs/plan.md,       │
│  docs/constraints.md                                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                          BUILD                                   │
│  Per task:                                                       │
│    1. @session-start → Load context, confirm next task           │
│    2. @ui [type] → Set design mode (if UI work)                  │
│    3. @dev → Implement, log, mark done in plan.md, /clear        │
│                                                                  │
│  At feature or phase completion:                                 │
│    4. @code-review → Verify standards before next phase          │
│    5. @security → Audit (if phase included auth/payment/data)    │
│                                                                  │
│  At milestone or shippability checkpoint:                        │
│    6. @qa → Shippability sign-off                                │
│    7. Commit                                                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       END SESSION                                │
│  @end-session → Updates handoff, constraints, architecture       │
└─────────────────────────────────────────────────────────────────┘
```

---

## When to Use Each Invocation

### Agents (Expert Consultation)

| Invocation | When to Use | Output |
|------------|-------------|--------|
| `@cto [topic]` | Discuss technical approach, feasibility | Conversation (no file changes) |
| `@cpo [topic]` | Discuss product ideas, scope, priorities | Conversation (no file changes) |
| `@dev` | Execute a task from plan.md | Implements code, logs session, marks done |
| `@security` | Audit auth, payments, or user data features | Security audit report |
| `@designer` | Define visual direction before building UI | Creates `docs/design-decisions.md` |
| `@qa` | Quality review and release sign-off | Creates `docs/qa-report.md` |
| `@content-writer` | Write brand content — posts, write-ups, portfolio | Content draft |
| `@demo-director` | Strategy for what to show and how | Demo strategy recommendation |

### Commands (Workflows)

| Invocation | When to Use | Output |
|------------|-------------|--------|
| `@kickoff` | First step for any new project idea | Creates `docs/kickoff-brief.md` |
| `@recruit` | After kickoff, to set up project framework | Creates `manifest.md`, `project-CLAUDE.md` |
| `@assumptions` | After recruit, before planning | Creates `docs/assumptions.md` |
| `@plan` | After assumptions validated — new project | Creates PRD, architecture, plan, constraints |
| `@create-plan` | Adding a new feature to an existing project | Appends tasks to `docs/plan.md` |
| `@session-start` | Start of every development session | Orients context, confirms next task |
| `@end-session` | End of every work session | Updates handoff, constraints, architecture |
| `@create-roadmap` | When a project roadmap is needed | Creates `docs/roadmap.md` |
| `@build-demo [audience] [checkpoint]` | At demo checkpoints throughout development | Creates `docs/demo-[checkpoint].md` |
| `@launch-prep` | Before any production release | GO / NO-GO recommendation |

### Skills (Execution)

| Invocation | When to Use | Output |
|------------|-------------|--------|
| `@ui [project-type]` | Before building UI for a feature | Sets design mode and component sources |
| `@ui` | Need design guidance reference | Shows project types and principles |
| `@write-tests unit [target]` | After writing code for a feature | Unit tests for that code |
| `@write-tests integration [target]` | After writing an integration flow | Integration tests for that flow |
| `@code-review` | After code + tests written, before QA | Reviews code against all rules files |

---

## Cadence: When to Do What

### Once Per Project
- [ ] Create project folder and copy `templates/project-CLAUDE.md` → `project/CLAUDE.md`
- [ ] Brainstorm the idea (no invocations)
- [ ] `@kickoff` — interrogate the idea across 6 dimensions
- [ ] `@designer` — design direction (UI projects only)
- [ ] `@recruit` — set up project framework
- [ ] `@assumptions` — validate critical dependencies
- [ ] `@plan` — create all planning documents

### Once Per Feature (Existing Projects)
- [ ] `@cpo [new feature]` if adding to PRD
- [ ] `@cto` if architecture changes needed
- [ ] `@create-plan` to add tasks to `docs/plan.md`

### Per Task (During Build)
- [ ] `@session-start` — load context and confirm next task
- [ ] `@ui [type]` — set design mode (if UI work)
- [ ] `@dev` — implement, log, mark done in plan.md, /clear

### At Feature or Phase Completion
- [ ] `@code-review` — verify standards before starting next phase
- [ ] `@security` — audit if phase included auth, payments, or user data

### At Milestone or Shippability Checkpoint
- [ ] `@qa` — shippability sign-off
- [ ] Commit

### Per Session
- **Start:** `@session-start`
- **During:** Auto-logging happens automatically
- **End:** `@end-session`

### When Needed
- `@security` — after implementing auth, payments, or user data features (`@dev` triggers this automatically)
- `@create-roadmap` — when a roadmap is needed
- `@build-demo` — at meaningful checkpoints throughout development
- `@content-writer` — for brand content (posts, write-ups, portfolio pieces)
- `@demo-director` — for demo strategy advice

---

## File Reference

### Always Loaded
| File | Purpose |
|------|---------|
| `~/.claude/CLAUDE.md` | Global standards (applies to all projects) |
| `project/CLAUDE.md` | Project-specific context |

### Created at Project Setup
| File | Created By | Purpose |
|------|------------|---------|
| `docs/kickoff-brief.md` | `@kickoff` | Interrogated project idea — problem, users, scope, risks |
| `docs/design-decisions.md` | `@designer` | Visual direction and component approach (UI projects) |
| `manifest.md` | `@recruit` | Active components, MCPs, session protocol |
| `docs/assumptions.md` | `@assumptions` | Validated assumptions and accepted risks |

### Created During Planning
| File | Created By | Purpose |
|------|------------|---------|
| `docs/prd.md` | `@plan` / `@cpo` | Product specs (WHAT) |
| `docs/architecture.md` | `@plan` / `@cto` | Technical design (HOW) |
| `docs/constraints.md` | `@plan` | Binding decisions every session must respect |
| `docs/plan.md` | `@plan` / `@create-plan` | Task breakdown with acceptance criteria |
| `docs/testing-setup.md` | `@plan` | Local dev URL, test credentials, seed instructions — required by `@qa` |

### Created During Development
| File | Created By | Purpose |
|------|------------|---------|
| `docs/session-log.md` | Auto-logging | Work journal (written before every `/clear`) |
| `docs/session-handoff.md` | `@end-session` | Summary and context for next session |
| `docs/roadmap.md` | `@create-roadmap` | Milestone-based roadmap |
| `docs/qa-report.md` | `@qa` | QA findings and APPROVED / BLOCKED status |
| `docs/demo-index.md` | `@build-demo` | Index of all demo documents |
| `docs/demo-[checkpoint].md` | `@build-demo` | Demo document for a specific checkpoint |

---

## Quick Start

### New Project
```
1. Create folder: my-project/
2. Copy templates/project-CLAUDE.md → my-project/CLAUDE.md
3. Create my-project/docs/
4. Start talking to Claude about your idea (no @ invocations yet)
5. When idea is clear: @kickoff
6. For UI projects: @designer
7. @recruit
8. @assumptions
9. @plan
10. @session-start → begin building
```

### Continuing Session
```
1. @session-start
2. Confirm next task
3. Work on task
4. @end-session when done
```

---

## Framework Philosophy

1. **Brainstorm freely, then formalize** — No @ invocations during exploration
2. **Interrogate before executing** — Four progressive layers before building: kickoff → recruit → assumptions → plan
3. **Nothing invisible** — Every critical assumption is validated or explicitly accepted as a known risk before planning commits
4. **WHAT before HOW** — PRD before architecture
5. **Plan before build** — Architecture before plan
6. **Quality before commit** — Code review → QA → Commit
7. **Document as you go** — Auto-logging + end-session
8. **Files are truth** — Documentation survives context clearing
