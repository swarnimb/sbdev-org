# Command: @plan

## Purpose
The deepest interrogation layer. Takes the validated project framework and produces all planning documents needed to begin development. Challenges specs at execution level — does not produce a document section until it is specified tightly enough to execute without asking clarifying questions during development.

Produces: `docs/prd.md`, `docs/architecture.md`, `docs/plan.md`, `docs/constraints.md`, and supporting documents when needed.

---

## Pre-checks

Before doing anything, verify:

- [ ] `manifest.md` exists in the project root
- [ ] `docs/assumptions.md` exists
- [ ] `docs/assumptions.md` has no open assumptions (all items must be Resolved or Accepted risk — none remaining Open)
- [ ] If the project has a UI component (`@designer` listed as Active in `manifest.md`): `docs/design-decisions.md` exists

**If `manifest.md` not found:**
"`manifest.md` not found. Run `@recruit` to set up your project framework before planning."

**If `docs/assumptions.md` not found:**
"`docs/assumptions.md` not found. Run `@assumptions` before planning. `@plan` cannot commit to an architecture that hasn't had its critical assumptions validated."

**If open assumptions remain in `docs/assumptions.md`:**
"N assumptions in `docs/assumptions.md` are still open (status: Open). Resolve or accept them before running `@plan`. Unexamined assumptions going into planning is how projects fail mid-build."

**If `@designer` is Active but `docs/design-decisions.md` not found:**
"`docs/design-decisions.md` not found. This project has a UI component but design direction is missing. Consult `@designer` to produce design direction first — component library choices and UI architecture in `@plan` Phase 2 depend on it."

---

## Decision Classification Rule

Before making any significant decision during `@plan`, classify it:

**Technical decision** — proceed with the decision, then present the Founder Brief for approval.
Examples: which ORM to use, database technology, caching approach, API design pattern, file structure.

**Product philosophy decision** — surface as a question, wait for builder answer, then decide.
Examples: offline-first vs. online-only, mobile-first vs. desktop-first, optimize for speed vs. cost, user data ownership model, single-tenant vs. multi-tenant, free vs. paid tier structure.

When uncertain which category a decision is: surface it as a question. The cost of asking is low; the cost of deciding a product philosophy question unilaterally is high.

---

## Process

### Phase 1 — Product spec interrogation

**Think like `@cpo`.** Challenge feature scope, user flows, edge cases, and acceptance criteria. The goal: produce a PRD that is specific enough to execute without clarifying questions during development.

Steps:
1. Read `docs/kickoff-brief.md` — understand the validated project idea
2. Read `docs/assumptions.md` — understand what has been validated and what risks are accepted
3. For each feature or capability in scope: interrogate the spec
   - What exactly does the user do? (step by step — not "user completes checkout" but each click and field)
   - What happens when it goes wrong? (error states, edge cases, invalid inputs)
   - What is explicitly excluded? (name it — ambiguity becomes scope creep)
   - What are the acceptance criteria? (Given/When/Then — specific and testable)
4. For each acceptance criterion: ask "Could a developer mark this done without asking me a clarifying question?" If no, make it more specific.
5. Identify any product philosophy decisions embedded in the spec — surface them as questions before proceeding

**— Approval gate —**
Present the PRD draft for builder review. Do not proceed to Phase 2 until the builder explicitly approves.

If rejected: ask what needs to change, revise, re-present. Do not proceed until approved.

---

### Phase 2 — Technical spec interrogation

**Think like `@cto`.** Challenge architectural decisions, data model, API design, and feasibility.

All architectural outputs in this phase must include a Founder Brief. Non-negotiable.

Steps:
1. Read the approved PRD draft from Phase 1. If the project has a UI component, also read `docs/design-decisions.md` — the component architecture in Step 6 must reflect the design direction already established.
2. Classify every significant decision (technical vs. product philosophy) before making it
3. Determine tech stack (confirm or finalize what was started in `@recruit`)
4. Define data model — entities, relationships, key fields
5. Define API structure — endpoints, request/response contracts, authentication approach
6. Define component architecture — how the system is structured, key files and modules
7. Define infrastructure and deployment approach
8. Define security architecture — authentication model, authorization approach, data protection

For each significant architectural decision, present a Founder Brief:

```
**Founder Brief**
**Decided:** [one sentence — what architectural choice was made]
**Means for your product:** [how this affects what users experience or what you can build]
**Check before approving:** [specific plain-language questions the builder can actually answer]
**What this closes off:** [what becomes harder or more expensive to change later]
```

**Complexity thresholds — produce supporting documents when:**
- Database has >5 entity types with relationships → produce `docs/data-model.md`
- API has >8 endpoints → produce `docs/api-spec.md`

**— Approval gate —**
Present `docs/architecture.md` (and supporting documents if produced) for builder review. Do not proceed to Phase 3 until explicitly approved.

If rejected: identify whether the rejection is a product philosophy disagreement (ask builder for direction first) or a technical one (revise and re-present). Do not proceed until approved.

---

### Phase 3 — Task breakdown

Produce a granular task plan. Every task must be **one-shot-ready** — a developer must be able to execute the task without asking clarifying questions.

**Specialist check (do this first):** Read the manifest for active project-specific agents and skills. Keep a list of their domains. When producing task breakdowns, for any task whose domain maps to a project-specific specialist, add a `**Specialist:**` field to that task — it tells `@dev` which component has primary responsibility for the implementation.

**One-shot-ready standard:**

```
## Task [N]: [Imperative title]

**Files:**
- `[exact/file/path.ts]` — [create / modify]
- `[exact/file/path.ts]` — [create / modify]

**Functions to implement:**
- `functionName(param: Type, param: Type): ReturnType` — [what it does]
- `functionName(param: Type): ReturnType` — [what it does]

**Acceptance criteria:**
- [ ] [Specific, testable, unambiguous. Embeds relevant rules.]
- [ ] [SEC-01: No credentials hardcoded — all secrets from environment variables]
- [ ] [EH-01: All error paths throw with context — no silent catches]
- [ ] [CQ-01: No function exceeds 50 lines]
- [ ] [Given X, when Y, then Z — functional criterion]

**Tests required:**
- `[describe block]` → `[test: happy path description]`
- `[describe block]` → `[test: error case description]`

**Depends on:** Task [N] (if applicable)
**Specialist:** @[name] — omit this field entirely if no relevant project-specific component is active in the manifest
```

**What makes a task NOT one-shot-ready:**
- "Build the auth module" — too large, no file/function specifics
- "Add validation" — which fields? which rules? which file?
- Acceptance criteria that require judgment ("make it look good," "handle errors appropriately")

If a task still requires Claude to ask clarifying questions to execute it, the task is not complete — go back and specify it further.

**Embed rules in acceptance criteria:**
Every task that involves code must have relevant rules embedded directly in its acceptance criteria. Do not leave rules as general guidelines — make them task-specific checkboxes.

**Complexity thresholds — split the plan when:**
- More than 30 tasks → split into phase files (e.g., `docs/plan-phase1.md`, `docs/plan-phase2.md`)
- More than 3 distinct deployment phases → split by phase
- When split: produce `docs/plan-index.md` listing all plan files, their scope, and active status

**— Approval gate —**
Present the full task plan for builder review. Do not write any files until explicitly approved.

If rejected: ask what needs to change. Individual tasks can be revised without re-doing the full plan.

---

### Phase 4 — Write all approved documents

After all three phases are approved:

1. Write `docs/prd.md` (or split files if PRD has >4 major features: `docs/prd-[domain].md`)
2. Write `docs/architecture.md`
3. Write `docs/founder-brief.md` — compile every Founder Brief produced during Phase 2 into a single document, one entry per architectural decision. Each entry links to its corresponding section in `docs/architecture.md`. Format per entry: date, decision title, architecture section reference, and the four Founder Brief fields (Decided / Means for your product / Check before approving / What this closes off). This is the builder's plain-language record of every architectural decision. `docs/architecture.md` cannot change without a corresponding update to this file.
4. Write `docs/data-model.md` (if produced in Phase 2)
5. Write `docs/api-spec.md` (if produced in Phase 2)
6. Write `docs/plan.md` (or split files + `docs/plan-index.md` if thresholds met)
7. Write `docs/constraints.md` using `templates/constraints.md` — seeded with all binding decisions made during Phase 2
8. Write `docs/testing-setup.md` using `templates/testing-setup.md` — shell only. Tell the builder: "Fill in local dev URL, test credentials, and seed instructions before running `@qa`."

Confirm: "Planning complete. [N] files written: [list]."

Closing: "Planning complete. For projects with more than 10 tasks, run `@create-roadmap` to organize tasks into milestones before beginning development — this makes progress trackable and surfaces sequencing risks early. Then run `@session-start` to begin development."

---

## Output Summary

| Document | Always produced | Condition |
|---|---|---|
| `docs/prd.md` | Yes | Always (or split by domain if >4 major features) |
| `docs/architecture.md` | Yes | Always |
| `docs/founder-brief.md` | Yes | Always — plain-language record of every Phase 2 architectural decision |
| `docs/plan.md` | Yes | Always (or split by phase if >30 tasks) |
| `docs/constraints.md` | Yes | Always — seeded from Phase 2 decisions |
| `docs/data-model.md` | No | >5 entity types with relationships |
| `docs/api-spec.md` | No | >8 API endpoints |
| `docs/plan-index.md` | No | Plan is split into multiple files |
| `docs/testing-setup.md` | Yes | Always — shell created at planning, builder fills credentials before `@qa` |

---

## Rules

- Three phases. Approval gate between each. Cannot skip or merge phases.
- Every architectural output in Phase 2 includes a Founder Brief.
- Product philosophy decisions are never decided unilaterally — always surface as a question first.
- Task acceptance criteria must embed relevant rule codes (SEC-XX, EH-XX, CQ-XX, etc.) — not vague references to "follow best practices."
- No files are written until all three phases are approved.
- Ends pointing to `@session-start`, not to starting work directly.

---

## What To Do If Pre-check Fails

**If `manifest.md` not found:**
"`manifest.md` not found. The project framework hasn't been set up yet. Run `@kickoff` → `@recruit` → `@assumptions` → then re-run `@plan`."

**If `docs/assumptions.md` not found:**
"`docs/assumptions.md` not found. Run `@assumptions` before planning. Building from unvalidated assumptions is how projects fail mid-build — `@plan` won't proceed without it."

**If open assumptions remain:**
"[N] assumptions in `docs/assumptions.md` are still Open. `@plan` cannot proceed until they are resolved or explicitly accepted as known risks with contingencies. Re-run `@assumptions` to close them."
