# Command: @create-roadmap

## Purpose
Builds a project roadmap from the approved plan. Applies roadmap-builder reasoning internally — no separate agent needed. Challenges at least one prioritization assumption before producing output. Produces `docs/roadmap.md`.

---

## Pre-checks

Before doing anything, verify:

- [ ] `docs/plan.md` exists (or `docs/plan-index.md` for split plans)

**If `docs/plan.md` not found:**
"`docs/plan.md` not found. A roadmap is built from an approved task plan. Run `@plan` first to create the planning documents, then re-run `@create-roadmap`."

---

## Process

### Step 1 — Read context

Read:
- `docs/plan.md` (or all plan files via `docs/plan-index.md`)
- `docs/prd.md` — understand what was scoped in and out
- `docs/assumptions.md` — understand accepted risks that may affect sequencing
- `docs/constraints.md` — understand binding decisions that affect sequencing

---

### Step 2 — Challenge at least one prioritization assumption

Before producing any roadmap output, challenge at least one prioritization assumption. This is not optional.

Questions to interrogate:

**Sequencing**
- Is this task order driven by technical dependency, or by assumed user value? Are those the same thing?
- Is there a task that appears later in the plan but would unlock disproportionate value if moved earlier?
- Is there anything planned early that the user actually doesn't need until much later?

**Scope at each milestone**
- What is the minimum set of tasks that produces something demonstrable or testable?
- Is there a milestone where feedback from real users could inform subsequent tasks?
- Are there tasks in the plan that should be cut from V1 entirely — not deferred, cut?

**Risk positioning**
- Are the riskiest or most uncertain tasks sequenced early (good) or late (bad)?
- If a late-stage task proves impossible, does it invalidate earlier work?

Present the challenged assumption explicitly: "I want to question one assumption before building the roadmap: [assumption]. Here's why it matters: [reasoning]. Does the current plan reflect this correctly, or should we adjust?"

Wait for builder response before producing the roadmap.

---

### Step 3 — Produce roadmap draft

Organize tasks into milestones. When listing tasks in milestone task lists, exclude any task marked `[~]` (superseded). Only `[ ]` (pending) and `[x]` (done) tasks belong in milestone scope — superseded tasks are no longer part of the plan.

Each milestone must be:
- Deliverable — something concrete exists at the end of it (even if it's an internal test build)
- Scoped — a clear set of tasks with a defined end condition
- Named — a milestone name that describes what is true when it is complete, not a generic "Phase 1"

```markdown
# Roadmap: [Project Name]

**Built from:** docs/plan.md
**Date:** [date]

---

## Milestone 1: [Name describing what is true when complete]

**Goal:** [One sentence — what can be done or demonstrated when this milestone is complete]
**Tasks:**
- [ ] Task [N]: [title]
- [ ] Task [N]: [title]

**Done when:** [Specific, observable condition — not "when we feel it's ready"]
**Known risks at this milestone:** [Any accepted-risk assumptions from assumptions.md that could affect this milestone]

---

## Milestone 2: [Name]

**Goal:** [...]
**Tasks:**
- [ ] Task [N]: [title]

**Done when:** [...]
**Known risks:** [...]

---

[Continue for each milestone]

---

## What's Not in V1

[Features or tasks explicitly deferred — from docs/prd.md Out of Scope section and any tasks cut during roadmap planning]

---

## Sequencing Rationale

[1-2 sentences per milestone on why this order. Not a repeat of the milestone goals — the reasoning behind the sequence.]

---

## Open Risks

[Accepted-risk assumptions from docs/assumptions.md that could materially change the roadmap if they prove false. Each listed with: the risk, which milestone it affects, and the contingency.]
```

Present for builder review.

---

### Step 4 — Wait for approval

Do not write `docs/roadmap.md` until the builder explicitly approves.

If rejected: ask what needs to change — milestone scope, ordering, naming, or the sequencing rationale. Revise and re-present.

---

### Step 5 — Write `docs/roadmap.md`

After approval, write the roadmap to `docs/roadmap.md`.

Confirm: "Roadmap written to `docs/roadmap.md`. Review the milestone structure and sequencing — when you're satisfied, run `@session-start` to begin development."

---

## Rules

- Must challenge at least one prioritization assumption before output — this is the value of the command, not a formality
- Milestones must be named by outcome, not by number or phase label
- Every milestone must have a specific "done when" condition — not a vague readiness assessment
- Accepted risks from `docs/assumptions.md` must be surfaced against the milestones they affect
- Does not write files without approval
- On re-run: always regenerates from scratch using current `docs/plan.md` state — does not preserve or merge the existing `docs/roadmap.md`. Task completion is tracked in `docs/plan.md`, not in the roadmap.
- Milestone task checkboxes (`[ ]`) in the roadmap are visual reference only — they show which tasks belong to which milestone. Mark them `[x]` manually when a milestone is complete if useful, but they are not authoritative. On re-run, all checkboxes reset. `docs/plan.md` is the single source of truth for task status.

---

## Edge Cases

**`docs/roadmap.md` already exists (re-run):**
Regenerate from scratch using current `docs/plan.md`. Do not read or merge the existing roadmap — it is replaced. Notify the builder: "Existing `docs/roadmap.md` will be replaced. The new roadmap reflects the current state of `docs/plan.md`." Proceed only after confirmation.

---

## What To Do If Pre-check Fails

**If `docs/plan.md` not found:**
"`docs/plan.md` not found. `@create-roadmap` builds from an approved task plan. Run `@plan` to create the planning documents first, then re-run `@create-roadmap`."
