# Command: @[command-name]

> Template for command files. Commands are the only user entry points.
> They orchestrate agents, rules, and skills internally.
> Approval gates between phases are hard stops — the command must wait for explicit approval before proceeding.
> Every pre-check failure must have a specific "what to do next" message. Never just "pre-check failed."
> Delete this header block when publishing the command file.

---

## Purpose
[One or two sentences: what this command does, what it produces, when a builder would invoke it.]

---

## Pre-checks

Before doing anything, verify:

- [ ] [Required file or state — e.g., `manifest.md` must exist]
- [ ] [Required file or state — e.g., `docs/assumptions.md` must exist with all items resolved]
- [ ] [Other prerequisite]

**If any pre-check fails:** [Exact message telling the builder what to do — not "pre-check failed." E.g.: "`manifest.md` not found. Run `@recruit` first to set up your project framework, then re-run `@[command-name]`."]

---

## Process

### Phase 1 — [Phase Name]

[What this phase does. What it interrogates, produces, or decides.]

Steps:
1. [Step 1 — what to read or assess]
2. [Step 2 — what to produce or decide]
3. [Step 3]

**— Approval gate —**
Present [what is produced] for builder review. Do not proceed to Phase 2 until explicit approval is given.

If rejected: [How to handle rejection — what to ask, how to revise, when to re-present.]

---

### Phase 2 — [Phase Name]

[What this phase does.]

Steps:
1. [Step 1]
2. [Step 2]

**— Approval gate —**
Present [what is produced] for builder review. Do not proceed to Phase 3 until explicit approval is given.

---

### Phase 3 — [Phase Name]

[What this phase does.]

Steps:
1. [Step 1]
2. [Step 2]

**— Approval gate —**
Present [what is produced] for builder review. Do not write any files until explicit approval is given.

---

### Phase 4 — Write Approved Output

After all phases are approved:
1. Write [file 1] to `docs/[filename]`
2. Write [file 2] to `docs/[filename]`
3. Confirm: "[N] files written: [list]"

Closing: "[Done message. What the builder should do next — e.g., 'Run `@[next-command]` to proceed.']"

---

## Output

| Document | Always produced | Condition |
|---|---|---|
| `docs/[filename]` | Yes | Always |
| `docs/[filename]` | No | [When it is produced] |

---

## Rules

- [Rule specific to this command — e.g., "Phase 1 must complete before Phase 2 begins — never merge phases."]
- [Rule — e.g., "Never write files without explicit approval."]
- [Rule — e.g., "Pre-check failures always include a specific next step, not just an error message."]

---

## What To Do If Pre-check Fails

[For each pre-check, exact failure message and instructions:]

**If [pre-check condition] is not met:**
"[Exact message. What is missing. What to do to resolve it. Which command or agent to invoke first.]"
