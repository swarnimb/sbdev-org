# Command: @end-session

## Purpose
Close out a development session properly. Reviews work, summarizes changes, checks framework health, and updates documentation — with approval before any writes.

---

## Process

### Step 1 — Read session log

Read `docs/session-log.md` to see what was done this session:
- Tasks completed
- Decisions made
- Files created or changed
- Errors encountered and fixed

This is the source of truth for what happened. If the session log is sparse or missing, note it — and log what you know before proceeding.

---

### Step 2 — Technical review

Review the session from a technical perspective:
- What was built or changed?
- Any architecture changes that need to be reflected in `docs/architecture.md`?
- Any significant technical decisions made that should go in `docs/constraints.md`?
- Any technical debt introduced?
- If `docs/architecture.md` is being updated: a corresponding Founder Brief entry is required for `docs/founder-brief.md`. `docs/architecture.md` cannot change without this file also updating — they are the technical and plain-language views of the same decision.

---

### Step 3 — Product review

Review the session from a product perspective:
- Any scope decisions made?
- Any requirements clarified or changed?
- Any changes that affect `docs/prd.md`?

---

### Step 4 — Check for conflicts

Before generating the summary:
- Do any updates conflict with existing documentation?
- Are there inconsistencies between what was done and what docs say?
- If yes, surface the conflict and options to resolve

---

### Step 5 — Framework issues check

Ask the builder: "Did any framework component give bad output this session? If yes, I'll note it in `docs/framework-issues.md`."

If yes: record the component, what it did wrong, and what the correct behavior should be.

**Two-strikes rule:** If you are logging a framework issue, check whether the same issue has already been logged in `docs/framework-issues.md`. If it has appeared before, this is a framework problem — flag it explicitly: "This issue has appeared before. The framework file needs to be fixed, not the conversation. Which file should we update?"

---

### Step 6 — Profile update check

Ask: "Does `profile.md` need updating? Did you ship a new project, hit a milestone, or has something changed about your story or the narrative behind your work?"

If yes: note what to update. The builder updates `profile.md` directly — this command does not modify it.

---

### Step 7 — Manifest accuracy check

Review the manifest against what happened this session:
- Any new MCPs added or removed?
- Any components activated or deactivated?
- Any stack or convention changes?

Note any inaccuracies. Ask: "Is the manifest still accurate? If not, I'll flag what needs updating."

---

### Step 8 — Generate documentation summary

Prepare a concise summary of what needs to be written:

```
## Session Closeout Summary

### Completed This Session
- [item 1]
- [item 2]

### Documentation Updates Needed

**session-handoff.md:**
- [what will be added or updated]

**architecture.md:**
- [changes to document, if any — or "no changes"]

**founder-brief.md:**
- [new Founder Brief entry for each architecture change, if any — or "no changes"]

**constraints.md:**
- [new binding decisions to add, if any — or "no changes"]

**docs/framework-issues.md:**
- [issue logged, if any — or "none this session"]

### In-Flight Decisions
[Decisions started but not finalized — or "None"]

### Next Session Constraints
[Specific constraints the next session must respect — or "None"]

### Manifest Status
[Accurate / Needs update: what changed]

### Conflicts Detected
[None, or list conflicts and proposed resolution]

### Next Session Should
1. [first priority]
2. [second priority]

---
Approve these documentation updates? (yes / no)
```

---

### Step 9 — Wait for approval

Do not make any file changes until the builder approves.

If rejected or revisions requested: ask what should change, revise the summary, wait for approval again.

---

### Step 10 — Execute updates (after approval only)

Once approved:
1. Update `docs/session-handoff.md`
2. Update `docs/architecture.md` if architecture changed
3. Update `docs/founder-brief.md` if architecture changed — append a new entry per decision using the Founder Brief format (date, decision title, architecture section reference, Decided / Means for your product / Check before approving / What this closes off)
4. Update `docs/constraints.md` if binding decisions were made
5. Update `docs/framework-issues.md` if issues were flagged
6. Update `manifest.md` if changes were identified in Step 7 — stale manifests cause `@session-start` to load wrong context
7. Reset `docs/session-log.md` back to its template header — the log has been processed and is now redundant
8. Confirm: "Updated: [list of files]"

---

### Step 11 — Content prompt and close (last)

"Want to create a post about what you accomplished this session? Invoke `@content-writer`."

After the builder responds (yes or no): "Session closed. `/clear` to start fresh."

This is always the last step. Do not skip it.

---

## Output After Completion

```
Session closed.

Updated:
- [list of files updated]

Next session: [first priority]

Want to write a post about this session? → @content-writer
```

---

## Rules

- Never update docs without approval
- Log before `/clear` — if the session log is not written, it is never written
- Keep summaries concise — headlines, not essays
- If nothing changed in a doc category, state that explicitly
- Flag anything uncertain for builder decision
- Two-strikes rule: if a framework issue appears in `docs/framework-issues.md` a second time, fix the framework file — do not log it again and move on
