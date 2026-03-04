# Constraints: [Project Name]

> Per-project file. Seeded by `@plan` with binding decisions made during planning.
> Updated whenever a new binding decision is made during development.
> Loaded by `@session-start` every session.
>
> **What belongs here:** Active binding decisions only. Not history. Not rationale. Not options considered. Just what is locked and what it means in practice.
>
> **What does NOT belong here:** Decisions still being evaluated. Preferences. General good practices. Those live in `rules/` files or `docs/architecture.md`.
>
> **Distinct from `docs/assumptions.md`:** Assumptions are things to validate before planning. Constraints are decisions already made that close off future options.

---

## Active Constraints

---

### [CONSTRAINT-01] [Short title]

**Decision:** [What was decided — one sentence, specific]

**What it means in practice:** [What this constraint actually requires of every developer every session. What behavior is prohibited. What is required.]

**Who decided and when:** [@[agent or builder], [date]]

**What this closes off:** [What becomes harder or more expensive to change if this constraint is ever reversed]

---

### [CONSTRAINT-02] [Short title]

**Decision:** [...]

**What it means in practice:** [...]

**Who decided and when:** [...]

**What this closes off:** [...]

---

### [CONSTRAINT-03] [Short title]

**Decision:** [...]

**What it means in practice:** [...]

**Who decided and when:** [...]

**What this closes off:** [...]

---

## Summary Table

| # | Decision | Practical impact | Decided by | Date |
|---|---|---|---|---|
| 01 | [Short title] | [One-line impact] | [@agent / builder] | [date] |
| 02 | [Short title] | [One-line impact] | [@agent / builder] | [date] |

---

## How to Add a Constraint

A new constraint is added when:
- `@plan` makes a binding architectural or product philosophy decision
- `@cto` makes a decision during development that closes off future options
- The builder explicitly commits to a decision that future sessions must respect

Format: copy the constraint block above. State the decision plainly. State what it means for daily implementation. State who decided and when.

A constraint is removed only when the decision is explicitly reversed — and the reversal must be noted in `docs/session-log.md`.
