# Command: @launch-prep

## Purpose
Pre-launch gate command. Runs a structured checklist against the project's actual state — not self-reported status. Produces an explicit GO or NO-GO recommendation with every unresolved item listed. The builder must acknowledge each failed item before the result is finalized.

This command does not deploy anything. It confirms readiness and produces a recommendation.

---

## Pre-checks

Before doing anything, verify:

- [ ] `manifest.md` exists in the project root

**If `manifest.md` not found:**
"`manifest.md` not found. `@launch-prep` needs the project manifest to understand what was built and what components were active. Run `@recruit` to set up the framework if this hasn't been done."

---

## Process

### Step 1 — Read project context

Read:
- `manifest.md` — what was built, what components were active
- `docs/plan.md` (or plan files) — what was planned vs. what is complete
- `docs/assumptions.md` — which risks were accepted; any that materialized?
- `docs/constraints.md` — binding decisions that affect launch scope

---

### Step 2 — Run the launch checklist

Work through each checklist item. For every item, **read the actual file or evidence** — do not accept self-reported status. If the file doesn't exist or the status is wrong, the item fails.

---

#### Item 1: QA Sign-Off

**Check:** Does `docs/qa-report.md` exist? Does it have status: APPROVED?

- [ ] PASS — `docs/qa-report.md` exists with `Status: APPROVED`
- [ ] FAIL — File missing, or status is BLOCKED, or status is missing

**Fail message:** "`docs/qa-report.md` does not exist or status is not APPROVED. Run `@qa` to conduct a quality review and get sign-off before launch."

**Note:** "QA was done informally" or "we tested it manually" does not satisfy this item. The file must exist with an explicit APPROVED status field.

---

#### Item 2: Security Audit

**Check:** Does `docs/security-report.md` exist with `Status: CLEAR`?

- [ ] PASS — `docs/security-report.md` exists with `Status: CLEAR` (no unresolved Critical or High findings)
- [ ] FAIL — File missing, or status is BLOCKED, or unresolved Critical/High findings are listed

**Fail message:** "`docs/security-report.md` does not exist or status is not CLEAR. Run `@security` to audit the codebase — it will write this file automatically. Resolve all Critical and High findings before launch."

---

#### Item 3: Demo Exists

**Check:** Does `docs/demo-index.md` exist with at least one entry?

- [ ] PASS — `docs/demo-index.md` exists with at least one demo documented
- [ ] FAIL — No demo index, or index is empty

**Fail message:** "No demo documented. Run `@build-demo` to create a demo for the launch audience before proceeding."

---

#### Item 4: Content Drafted

**Check:** Does at least one piece of launch content exist? (Post, write-up, announcement, or portfolio piece in `content/`)

- [ ] PASS — At least one content file exists in `content/`
- [ ] FAIL — No content drafted

**Fail message:** "No launch content drafted. Invoke `@content-writer` to write at least one post or write-up for the launch before proceeding. Content is saved to `content/[YYYY-MM-DD]/[platform].md`."

---

#### Item 5: Critical Paths Tested

**Check:** Do tests exist for all critical paths? (auth flows, payment flows, data writes, access control — per `rules/testing-standards.md` TS-04)

- [ ] PASS — Tests exist for all critical paths and pass
- [ ] FAIL — Missing critical path tests or tests are failing

**Fail message:** "Critical path tests are missing or failing. Run `@write-tests` to add missing tests, or fix failing tests. See `rules/testing-standards.md` TS-04 for the full list of required critical path tests."

---

#### Item 6: Known Issues Documented

**Check:** Are all known issues, bugs, and limitations documented somewhere accessible?

- [ ] PASS — Known issues are documented (in `docs/plan.md` as deferred tasks, or in a dedicated `docs/known-issues.md`)
- [ ] FAIL — Known issues exist but are only in memory or conversation — not written down

**Fail message:** "Known issues are not documented. List all known bugs and limitations in `docs/known-issues.md` before launch. Undocumented issues become surprises."

---

#### Item 7: Deployment Plan Confirmed

**Check:** Is there a confirmed, written deployment plan? (How the app gets from local to production — specific steps, not "we'll figure it out")

- [ ] PASS — Deployment steps are documented in `docs/architecture.md` (Infrastructure/Deployment section) or a dedicated `docs/deployment.md`
- [ ] FAIL — No written deployment plan

**Fail message:** "No deployment plan documented. Add the deployment steps to `docs/architecture.md` (Infrastructure → Deployment section) or create `docs/deployment.md`. Deploying without a written plan is how things break in production."

---

### Step 3 — Present checklist results

```
## Launch Prep Checklist: [Project Name]

| Item | Status | Notes |
|---|---|---|
| QA sign-off | PASS / FAIL | [detail if fail] |
| Security audit | PASS / FAIL | [detail if fail] |
| Demo exists | PASS / FAIL | [detail if fail] |
| Content drafted | PASS / FAIL | [detail if fail] |
| Critical paths tested | PASS / FAIL | [detail if fail] |
| Known issues documented | PASS / FAIL | [detail if fail] |
| Deployment plan confirmed | PASS / FAIL | [detail if fail] |

---

**Unresolved items:** [N]

[List each failed item with its fail message and what must be done to resolve it]

---

**Recommendation:** GO / NO-GO

[GO: All items pass. The project is ready to launch.]
[NO-GO: [N] items failed. Resolve the items above before launching. Each item listed below must be acknowledged.]
```

---

### Step 4 — Builder acknowledgment of failed items (NO-GO only)

If the recommendation is NO-GO:

For each failed item, ask the builder to explicitly acknowledge it:
"Acknowledge [item]: [what must be done to resolve it]? (yes — I'll resolve this / skip — I'm accepting this risk)"

Do not skip this step. If a builder chooses to skip a failed item, record it explicitly: "Builder accepted launch risk: [item] — [what was unresolved]."

Do not auto-proceed. Do not bundle acknowledgments. One at a time.

---

### Step 5 — Profile update check

Ask: "Does `profile.md` need updating? You're launching — did you ship a new project, hit a milestone, or has your story changed?"

If yes: note what to update. The builder updates `profile.md` directly — this command does not modify it.

---

### Step 6 — Final recommendation

After all items are acknowledged:

**If all items PASS:**
"**GO.** All launch checklist items pass. You are ready to launch. Good luck."

**If items were skipped:**
"**GO with accepted risks.** [N] checklist items were skipped. Accepted risks: [list]. These are documented — resolve them post-launch if possible."

**If items remain unresolved:**
"**NO-GO.** [N] items are unresolved and were not acknowledged. Resolve them before launching."

---

## Rules

- Every checklist item reads actual files — self-reported status is not accepted
- Builder must acknowledge each failed item explicitly — no bundled acknowledgments
- Does not deploy anything — produces a recommendation only
- Accepted risks on skipped items are recorded, not silently ignored

---

## What To Do If Pre-check Fails

**If `manifest.md` not found:**
"`manifest.md` not found. `@launch-prep` needs the project manifest. Run `@recruit` to set up the project framework if it hasn't been done."
