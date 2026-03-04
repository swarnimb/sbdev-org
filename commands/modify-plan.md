# Command: @modify-plan

## Purpose
Modifies an existing feature spec mid-build — requirements changed, user behavior revealed a different need, or the original spec proved wrong in implementation. Handles the change in a structured way: updates the PRD, supersedes obsolete tasks, creates replacement tasks.

This is NOT for adding new features (use `@create-plan`) and NOT for new projects (use `@plan`). Use this when a feature already in `docs/prd.md` needs to change.

---

## Pre-checks

Before doing anything, verify all three conditions:

- [ ] `manifest.md` exists in the project root
- [ ] `docs/prd.md` exists
- [ ] `docs/architecture.md` exists

**If `manifest.md` not found:**
"`manifest.md` not found. This project hasn't been set up. For a new project, run `@kickoff` → `@recruit` → `@assumptions` → `@plan`."

**If `docs/prd.md` not found:**
"`docs/prd.md` not found. `@modify-plan` requires an existing product spec to modify."

**If `docs/architecture.md` not found:**
"`docs/architecture.md` not found. `@modify-plan` requires an existing architecture document."

---

## Process

### Step 1 — Identify the feature and the change

Ask the builder:
1. Which feature in `docs/prd.md` is changing?
2. What specifically is changing? (behavior, scope, user flow, acceptance criteria, business logic)
3. Why is it changing? (user feedback, implementation reality, business decision, original spec was wrong)

Read the current feature spec from `docs/prd.md` in full. Do not proceed until both the current spec and the nature of the change are clearly understood.

---

### Step 2 — Interrogate the new spec

Think like `@cpo`. Challenge the proposed change — is this the right fix, or is it a patch on a larger problem?

- Is this change addressing the root cause, or a symptom?
- Does the new spec introduce edge cases the original spec didn't have?
- Does it conflict with any other features still in the PRD?
- What are the acceptance criteria for the new behavior? Are they specific and testable?
- What is explicitly out of scope in the new version?

Draft the updated feature spec:

```
## [Feature Name] (Revised)

### What Changed
[One sentence: what is different from the original spec, and why]

### Problem Statement
[What problem does this revised spec solve? For whom?]

### User Story
As a [user type], I want to [action] so that [benefit].

### User Flow
1. [Step 1]
2. [Step 2]

### Business Logic
- [Rule 1]

### Acceptance Criteria
- [ ] Given [context], when [action], then [result]

### Edge Cases
- [Edge case]: [How to handle]

### Out of Scope
- [Explicit exclusion]

### Success Metric
[How do we know this worked?]
```

**— Approval gate —**
Present the draft spec to the builder. Do not proceed to Step 3 until explicitly approved.

If rejected: ask what needs to change, revise, re-present.

---

### Step 3 — Assess task impact

Read `docs/plan.md` (or all plan files via `docs/plan-index.md`).

For each existing task related to this feature, classify it:

**Still valid** — unchanged by the new spec. No action needed.

**Partially valid** — needs modification. Note what changes are required.

**Superseded** — invalidated by the new spec. Will be marked `[~]`.

Superseded task format (from `@dev` standard):
```
[~] Task [N]: [title] — superseded: [reason, reference to updated spec in prd.md]
```

Also check before producing new tasks:

- **Architectural impact:** Does this spec change require an architectural change? If yes: stop. "This spec change has architectural implications: [what]. Consult `@cto` to resolve the architectural question before I can produce replacement tasks." Do not create tasks that depend on an undecided architectural question.

- **New assumptions:** Does this change introduce any dependency on a new third-party service, API, data source, or capability not already in `docs/assumptions.md`? If yes: stop. "This change introduces a new unexamined assumption: [what]. Run `@assumptions` to validate or accept it before I can proceed."

---

### Step 4 — Produce replacement task breakdown

For new tasks required by the updated spec, apply the one-shot-ready task standard from `@plan`. Task numbers continue from the last task number in `docs/plan.md` — do not restart from 1.

**Specialist check (do this first):** Read the manifest for active project-specific agents and skills. Keep a list of their domains. When producing replacement task breakdowns, for any task whose domain maps to a project-specific specialist, add a `**Specialist:**` field to that task — it tells `@dev` which component has primary responsibility for the implementation. Omit the field entirely if no relevant project-specific component is active.

```
## Task [N]: [Imperative title]

**Files:**
- `[exact/file/path.ts]` — [create / modify]

**Functions to implement:**
- `functionName(param: Type): ReturnType` — [what it does]

**Acceptance criteria:**
- [ ] [Specific, testable criterion]
- [ ] [Relevant rule embedded — e.g., SEC-01: no secrets in code]
- [ ] [Given X, when Y, then Z]

**Tests required:**
- `[describe]` → `[test: happy path]`
- `[describe]` → `[test: error case]`

**Depends on:** [Task N / None]
```

**— Approval gate —**
Present the full change summary for builder review:

```
## Spec Change: [Feature Name]

**Reason for change:** [one sentence]

**PRD update:** [summary of what changes in the spec]

**Task impact:**
- Still valid: Task [N], Task [N] (or "None")
- Superseded: Task [N] — [reason] (or "None")
- New tasks: Task [N], Task [N] (or "None — existing tasks cover the new spec")

**Architectural impact:** [None / Requires @cto review — [what the question is]]

---
Apply these changes? (yes / no)
```

Do not write anything until the builder explicitly approves.

If rejected: ask what needs to change. Revise and re-present.

---

### Step 5 — Write changes (after approval)

1. Update the relevant feature section in `docs/prd.md`:
   - Replace the old spec with the approved new spec
   - Add a change note at the top of the section: `> **Revised [date]:** [one sentence — what changed and why]`

2. In `docs/plan.md` (or the appropriate plan file):
   - Mark each superseded task with `[~]` and reason inline
   - Append new tasks (continuing task numbering from the current last task)

3. If `docs/roadmap.md` exists: "Your roadmap references tasks by number. The superseded and new tasks from this change may affect milestone scope. Re-run `@create-roadmap` to update it — or review the milestone the affected tasks belong to and update manually."

4. Log to `docs/session-log.md`: spec change applied to [feature], [N] tasks superseded, [N] new tasks added, reason: [from Step 1].

Confirm: "Changes applied. `docs/prd.md` updated. [N] task(s) superseded. [N] new task(s) added."

---

## Rules

- Pre-check is mandatory — all three conditions must pass
- New spec must be approved before task impact is assessed — do not jump to tasks
- Full change summary must be approved before any files are written
- One-shot-ready task standard applies to all new tasks
- Architectural questions must be resolved before task creation — do not plan tasks that depend on an undecided architectural question
- New assumptions must be escalated to `@assumptions` before proceeding — `@modify-plan` does not validate assumptions
- Never write to `docs/prd.md` or `docs/plan.md` without approval

---

## What To Do If Pre-check Fails

**`manifest.md` not found:**
"`manifest.md` not found. For a new project, run `@kickoff` → `@recruit` → `@assumptions` → `@plan`."

**`docs/prd.md` not found:**
"`docs/prd.md` not found. `@modify-plan` requires an existing product spec. For a new project, run `@plan` to create all planning documents from scratch."

**`docs/architecture.md` not found:**
"`docs/architecture.md` not found. Consult `@cto` to define the architecture first, then re-run `@modify-plan`."

## What To Do If Validation Fails During Execution

**Feature not in `docs/prd.md`:**
"Feature not found in `docs/prd.md`. `@modify-plan` only modifies features that are already specced. For a new feature, use `@create-plan`."

**Architectural conflict blocks task creation:**
"This spec change requires an architectural decision that hasn't been made: [what]. Consult `@cto` to resolve it, then re-run `@modify-plan`."

**New assumption blocks task creation:**
"This spec change introduces a new unexamined assumption: [what]. Run `@assumptions` to validate or accept it with a contingency, then re-run `@modify-plan`."
