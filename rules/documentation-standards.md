# Rules: Documentation Standards

> **Priority in conflict:** Documentation is the lowest priority in the hierarchy. When any rule in this file conflicts with `security.md`, `error-handling.md`, or `code-quality.md`, those files take precedence.
>
> Full hierarchy: `security > error-handling > code-quality > documentation`. See `rules/code-quality.md`.
>
> **Practical implication:** If meeting a documentation standard would require writing insecure code (e.g., a "full usage example" that includes a real credential), omit that part of the documentation. Security wins.

---

## Constraints

---

### DS-01: Every public function or API endpoint must have a doc comment

**Constraint:** Every function that is exported from a module, and every API endpoint handler, must have a doc comment that states: (1) what the function does (one sentence), (2) what each parameter represents and its expected type/format, (3) what it returns and under what conditions, (4) what errors it throws or what failure responses it returns. Internal private functions with self-evident names are exempt. Comments must be accurate — an outdated comment is worse than no comment.

**Rationale:** Public functions are the contracts between modules. Callers cannot safely use a function whose contract is undocumented. Outdated comments actively mislead.

**Pass:**
```typescript
/**
 * Creates a new user account and sends a verification email.
 * @param email - Valid email address. Must be unique in the system.
 * @param password - Plaintext password (minimum 8 chars). Will be hashed before storage.
 * @returns The created User object with id, email, and createdAt. Password is not returned.
 * @throws ValidationError if email format is invalid or already in use.
 * @throws ServiceError if email delivery fails (user is still created).
 */
export async function createUser(email: string, password: string): Promise<User> { }
```

**Fail:**
```typescript
// No comment — caller doesn't know what this throws or what `User` contains
export async function createUser(email: string, password: string): Promise<User> { }

// Outdated comment that says the wrong thing
/** @returns user ID as string */
export async function createUser(...): Promise<User> { } // actually returns User, not string
```

---

### DS-02: Architecture decisions must be documented before implementation

**Constraint:** Any architectural decision (tech stack choice, database schema design, API design pattern, third-party service selection, deployment approach) must be documented in `docs/architecture.md` or `docs/constraints.md` before code that depends on it is written. The documentation must state: what was decided, why (what alternatives were considered and rejected), and what this closes off for future changes.

**Rationale:** Code written before architecture is documented encodes undocumented assumptions. Future changes become reverse-engineering exercises. `@plan` embeds this into task creation — architecture docs come before implementation tasks.

**Pass:**
```
# docs/architecture.md
## Authentication
**Decision:** JWT stateless tokens (not session-based)
**Why:** Stateless tokens eliminate server-side session storage, making horizontal scaling simpler.
**Rejected:** Session-based auth — requires shared session store, adds infrastructure.
**Closes off:** Per-device token invalidation without a token blacklist (added complexity if needed later).
```

**Fail:**
```
// No architecture doc — JWT implementation just appears in code
// Future developer has to infer why JWT was chosen from the code itself
```

---

### DS-03: Session handoff must be complete before `/clear`

**Constraint:** Before clearing context at the end of any task, `docs/session-log.md` must be updated with: what was completed this task, what decisions were made (including why), what is still in progress, and any deviations from the plan. The handoff must be written before `/clear` is issued — not after, not as a combined last step. This is a hard sequence requirement.

**Rationale:** Session logs are the memory bridge between sessions. An incomplete or missing log means the next session starts blind. "I'll log it next session" means it never gets logged.

**Pass:**
```
1. Complete the task
2. Write session-log.md entry (this step)
3. Mark task done in plan.md
4. /clear
```

**Fail:**
```
1. Complete the task
2. /clear  ← session log never written — next session has no context
```

---

### DS-04: Design decisions must be documented when @designer produces output

**Constraint:** When `@designer` produces a visual direction, component approach, or interaction decision, that output must be saved to `docs/design-decisions.md` before `@recruit` uses it to configure the `@ui` skill. `@recruit` reads `docs/design-decisions.md` — if it doesn't exist when `@recruit` runs for a UI project, `@recruit` must halt and ask for it.

**Rationale:** Design decisions made in conversation and not written down evaporate. `@ui` skill needs them to be explicit and persistent, not inferred from memory.

**Pass:**
```
# docs/design-decisions.md
## Visual Direction
Type: SaaS dashboard
Vibe: Clean, focused, minimal
Primary library: shadcn/ui
Accent: None (no landing page)
Color approach: Neutral base, single accent color for CTAs
Motion: Subtle transitions only — no animations
Reference: Linear dashboard
```

**Fail:**
```
// Designer gave direction in chat — never written down
// @recruit asks "what's the design direction?" — context was lost in /clear
```

---

### DS-05: `README.md` must exist and must be accurate

**Constraint:** Every project must have a `README.md` at the root. It must contain: (1) what the project does (one paragraph), (2) how to run it locally (exact commands), (3) required environment variables (names only, not values — reference `.env.example`), (4) how to run tests. The `README.md` must be updated whenever the setup process changes. An outdated README is a documentation failure, not a minor issue.

**Rationale:** `README.md` is the entry point for anyone (including future you) setting up or resuming work on the project. If it's wrong, setup fails and time is wasted.

**Pass:**
```markdown
# ProjectName
[One paragraph description]

## Setup
cp .env.example .env
npm install
npm run dev

## Environment Variables
See `.env.example` for required variables.

## Tests
npm test
```

**Fail:**
```markdown
# ProjectName
TODO: Add README
```

```markdown
# ProjectName
Run `python main.py`  // project moved to TypeScript six months ago — README never updated
```

---

## What Must Be Documented

| What | Where | When |
|---|---|---|
| Public functions and API endpoints | Inline doc comments | Before merging |
| Architecture decisions | `docs/architecture.md` or `docs/constraints.md` | Before implementation |
| Session work and decisions | `docs/session-log.md` | Before `/clear` |
| Design direction | `docs/design-decisions.md` | Before `@recruit` for UI projects |
| Project setup | `README.md` | On creation, updated when setup changes |

## What Does NOT Need to Be Documented

- Private internal functions with self-evident names
- Framework boilerplate with standard behavior
- Temporary spike code (explicitly throwaway — document the result, not the code)
- Code that is fully self-explanatory from naming alone (CQ-06 handles naming)

---

## Priority

This file is **lowest priority** in the conflict resolution hierarchy:

`security > error-handling > code-quality > documentation`

---

## Enforcement

**Gate 1 — Task completion self-check:** Before marking any task done in `plan.md`, verify DS-03 (session log written). For tasks that add public functions or API endpoints, verify DS-01. For tasks that implement an architecture decision, verify DS-02.

**Gate 2 — `@code-review` invocation:** `skills/code-review.md` checks DS constraints. Missing doc comments on public functions are flagged. Outdated documentation is flagged.

---

## Overrides

Projects may increase documentation requirements (e.g., require ADR files for every decision, not just architecture docs). Projects may not remove DS-03 (session handoff) — it is required for the framework to function. DS-01 (public function comments) may be relaxed for internal tools where no external consumers exist — this must be noted in `manifest.md`.
