# Command: @create-plan

## Purpose
Adds a new feature task breakdown to an existing project — where PRD and architecture already exist and a task plan is needed for a specific new feature. This command is NOT for new projects. For new projects, use `@kickoff` → `@recruit` → `@assumptions` → `@plan`.

---

## New Feature Mid-Build? Start with `@cpo`

`@create-plan` requires the feature to already be specced in `docs/prd.md`. It does not spec features — it plans them.

**If the feature you want to build is not yet in `docs/prd.md`:**

1. Consult `@cpo` first — it will interrogate the feature (problem, user flow, acceptance criteria, edge cases, out of scope)
2. `@cpo` will ask: "Want me to update `docs/prd.md` with this?" — say yes
3. Once the spec is in `docs/prd.md`, return here and run `@create-plan`

Do not skip this step. Unspecced features produce tasks that fail mid-implementation because the acceptance criteria were never defined.

---

## Pre-checks

Before doing anything, verify all three conditions:

- [ ] `manifest.md` exists in the project root
- [ ] `docs/prd.md` exists
- [ ] `docs/architecture.md` exists

**If `manifest.md` not found:**
"`manifest.md` not found. This project hasn't been set up. For a new project, run `@kickoff` → `@recruit` → `@assumptions` → `@plan`."

**If `docs/prd.md` not found:**
"`docs/prd.md` not found. `@create-plan` requires an existing product spec. For a new project, run `@plan` to create all planning documents from scratch."

**If `docs/architecture.md` not found:**
"`docs/architecture.md` not found. `@create-plan` requires an existing architecture document. Consult `@cto` to define the architecture first, then re-run `@create-plan`."

---

## Process

### Step 1 — Identify the feature

Ask the builder: "Which feature in `docs/prd.md` are we planning tasks for?"

Read `docs/prd.md` and confirm the feature exists and has complete specs (user flow, business logic, acceptance criteria, edge cases). If the spec is incomplete: "The spec for [feature] in `docs/prd.md` is missing [what]. Consult `@cpo` to complete the spec before task planning."

---

### Step 2 — Read architecture

Read `docs/architecture.md` to understand:
- Tech stack and patterns
- Directory structure and component organization
- Existing code patterns to follow
- How the new feature fits into the current system

If the project has a UI component, also read `docs/design-decisions.md` — task breakdown for UI features must reflect the established design direction.

---

### Step 3 — Read existing plan

Read `docs/plan.md` (or `docs/plan-index.md` if it exists) to:
- Understand what has already been built
- Identify dependencies the new feature has on existing tasks
- Confirm no task for this feature already exists

---

### Step 4 — Technical analysis

Before producing tasks:
- Identify which files will be created or modified
- Identify how the feature interacts with existing components
- Flag any risks or dependencies on incomplete existing tasks
- Check: does this feature require any architectural changes? If yes, surface to `@cto` before proceeding — do not create tasks that depend on an undecided architectural question.
- Check: does this feature introduce any critical assumptions not already covered in `docs/assumptions.md`? New third-party services, new data sources, new integrations, or unproven technical capabilities are critical assumptions. If yes: "This feature depends on [assumption] which is not in `docs/assumptions.md`. Add it and resolve it before task breakdown — unvalidated assumptions produce tasks that fail mid-implementation." Do not proceed until the assumption is resolved or accepted with a contingency.

---

### Step 5 — Produce task breakdown

Apply the one-shot-ready task standard from `@plan`. Each task must include:

Task numbers continue from the last task number in `docs/plan.md` — do not restart from 1.

**Specialist check (do this first):** Read the manifest for active project-specific agents and skills. For any task whose domain is covered by a project-specific specialist, add a `**Specialist:**` field to that task — it tells `@dev` which component has primary responsibility for the implementation.

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
**Specialist:** @[name] — omit this field entirely if no relevant project-specific component is active in the manifest
```

Present for approval:

```
## Plan: [Feature Name]

**Source:** docs/prd.md — [feature section]

**Tasks:**
[list of tasks]

**Dependencies:** [task order notes]

**Risks:** [any risks identified during analysis]

---
Add these tasks to docs/plan.md? (yes / no)
```

---

### Step 6 — Wait for approval

Do not write to `docs/plan.md` until the builder explicitly approves.

If rejected: ask what needs to change, revise, re-present.

---

### Step 7 — Write to plan (after approval)

Append the approved tasks to `docs/plan.md` (or the appropriate plan file if split).

If `docs/plan-index.md` exists: check whether the new tasks belong in an existing plan file or require a new one. Ask the builder if unclear.

Confirm: "Added [N] tasks to `docs/plan.md` for [feature name]. If you have a `docs/roadmap.md`, re-run `@create-roadmap` to incorporate these tasks into your milestone structure."

---

## Rules

- Pre-check is mandatory and all three conditions must pass — no exceptions
- Feature must be specced in `docs/prd.md` before task planning — unspecced features produce bad tasks
- Apply the same one-shot-ready task standard as `@plan` — tasks must be executable without clarifying questions
- Embed relevant rules in acceptance criteria (SEC-XX, EH-XX, CQ-XX)
- Never write to plan.md without approval

---

## What To Do If Pre-check Fails

**`manifest.md` not found:**
"`manifest.md` not found. This project hasn't been set up. For a new project, run `@kickoff` → `@recruit` → `@assumptions` → `@plan`."

**`docs/prd.md` not found:**
"`docs/prd.md` not found. `@create-plan` requires an existing product spec. For a new project, run `@plan` to create all planning documents from scratch."

**`docs/architecture.md` not found:**
"`docs/architecture.md` not found. Consult `@cto` to define the architecture first, then re-run `@create-plan`."

## What To Do If Validation Fails During Execution

**Feature not in `docs/prd.md`:**
"Feature not found in `docs/prd.md`. `@create-plan` only plans features that are already specced. Consult `@cpo` to spec the feature first — then re-run `@create-plan`."

**Spec incomplete for the feature:**
"The spec for [feature] in `docs/prd.md` is incomplete — [what is missing]. Consult `@cpo` to complete the spec, then re-run `@create-plan`."

**Architectural question blocks task creation:**
"This feature requires an architectural decision that hasn't been made: [what the question is]. Consult `@cto` to resolve it, then re-run `@create-plan`."
