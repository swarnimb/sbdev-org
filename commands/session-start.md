# Command: @session-start

## Purpose
Opens every development session. Reads the project manifest, loads the minimum context needed for the current task, states the next task clearly, and asks for confirmation before proceeding. Orients the builder in under 60 seconds.

---

## Pre-checks

Before doing anything, verify:

- [ ] `manifest.md` exists in the project root

**If `manifest.md` is not found:**
"No `manifest.md` found. This project hasn't been set up yet. Run `@kickoff` to begin, or run `@recruit` if kickoff is already complete."

---

## Process

### Step 1 — Read the manifest

Read `manifest.md` in full.

Note:
- Which rules files are active
- Which agents are active
- Which commands and skills are active
- Available MCPs (`## Available MCPs` section)
- Current plan file path (`## Project Context` → "Current plan file")
- Session protocol

Do not load any component not listed in the manifest.

---

### Step 2 — Load session context

Load these files in this order:

1. `docs/architecture.md` — the technical source of truth. If it doesn't exist yet, note it and continue.
2. `docs/constraints.md` — binding decisions every session must respect. If it doesn't exist yet, note it and continue.
3. `docs/assumptions.md` — validated assumptions and known risks. If it doesn't exist yet, note it and continue.
4. `docs/session-handoff.md` — where the last session left off. Read every section. Note any in-flight decisions and next session constraints.
5. `docs/design-decisions.md` — if `@designer` is listed as Active in the manifest, load this. Design decisions are binding constraints for UI tasks. If it doesn't exist yet, note it and continue.

**Staleness check:** After loading `docs/session-handoff.md`, also check `docs/session-log.md`. If the session log exists and contains logged entries beyond the template header, check the date of the most recent entry:

- **If the most recent entry is from a prior date** — `@end-session` may have been skipped last session. Surface this before stating the next task:

  > "⚠ Session log has entries from [date] not captured in the handoff — `@end-session` may have been skipped last session. The handoff may be incomplete. You can: (a) run `@end-session` now to process the log before starting, or (b) continue with the current handoff and accept that some context may be missing."

  Wait for the builder to choose before proceeding.

- **If the most recent entry is from today** — the session is ongoing and the log is current. Do not surface the staleness warning. Continue normally.

**QA status check:** Check `docs/qa-report.md` if it exists. If Status is BLOCKED — surface this before stating the next task:

> "⚠ QA Status: BLOCKED. Resolve all blocking findings and re-run `@qa` before starting new features. If you are currently fixing QA issues, continue. When all fixes are done, re-run `@qa`."

If the file does not exist or Status is APPROVED: no action needed.

**Security status check:** Check `docs/security-report.md` if it exists. If Status is BLOCKED — surface this before stating the next task:

> "⚠ Security Status: BLOCKED. Resolve all Critical and High findings and re-run `@security` before proceeding. If you are currently mid-fix, continue. When all findings are resolved, re-run `@security`."

If the file does not exist or Status is CLEAR: no action needed.

Do not load `docs/prd.md` in full — it is large and not needed for task execution. Load only the section relevant to the current task if needed.

---

### Step 3 — Find the current task

If `manifest.md` references `docs/plan-index.md` as the current plan file:
- Read `docs/plan-index.md` to find which plan file is currently active
- Load the active plan file
- Find the first incomplete task (first unchecked `[ ]`) — skip any `[~]` superseded tasks

If `manifest.md` references `docs/plan.md`:
- Read `docs/plan.md`
- Find the first incomplete task (first unchecked `[ ]`) — skip any `[~]` superseded tasks

If no plan file exists yet:
- If `docs/assumptions.md` does not exist: "No plan file found and assumptions haven't been validated. Run `@assumptions` before planning — `@plan` requires validated assumptions."
- If `docs/assumptions.md` exists: "No plan file found. Run `@plan` to create planning documents."

If all tasks in the plan are `[x]` or `[~]` (no remaining `[ ]`):
"All tasks in the plan are complete. Run `@qa` for shippability sign-off before proceeding."

---

### Step 4 — State the session clearly

Output a brief session summary:

```
## Session Start

**Project:** [project name from manifest]
**Phase:** [current phase from manifest]

**Loaded context:**
- architecture.md: [loaded / not found]
- constraints.md: [loaded / not found — N active constraints]
- assumptions.md: [loaded / not found — N accepted risks]
- session-handoff.md: [loaded / summary of last session in 1 sentence]
- qa-report.md: [not present / APPROVED / **BLOCKED — resolve findings and re-run `@qa` before new features**]
- security-report.md: [not present / CLEAR / **BLOCKED — resolve all Critical/High findings and re-run `@security`**]

**In-flight decisions from last session:** [list, or "None"]
**Next session constraints:** [list, or "None"]

**Next task:**
[Task title and full task spec from plan.md — including files, function signatures, acceptance criteria]

---
Ready to begin? (yes / no, or tell me what to change first)
```

---

### Step 5 — Wait for confirmation

Do not start the task until the builder explicitly confirms.

If the builder says no or wants to start a different task: ask which task, load it, confirm again.

If there are open assumptions in `docs/assumptions.md`: note them — "N assumptions are still open. If any of these are critical to the current task, resolve them before proceeding."

---

## Rules

- Load minimum context only — do not load the full PRD, all planning docs, or unrelated files
- Do not start work before confirmation — the orientation step is not optional
- If any "next session constraints" exist in the handoff, state them explicitly before confirming the task
- Never skip reading `docs/session-handoff.md` — it is the only bridge between sessions
- Available MCPs noted in the manifest are available this session — components can use them

---

## What To Do If Pre-check Fails

**If `manifest.md` not found:**
"`manifest.md` not found. This project has no framework setup. Run `@kickoff` to begin your project brainstorm, or `@recruit` if you've already done kickoff and are ready to set up the framework."
