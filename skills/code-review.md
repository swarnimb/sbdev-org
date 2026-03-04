# Skill: Code Review

> Pure execution. Reviews code against the rules files. No standards authorship — standards live in the rules files. This skill applies them.

---

## Purpose
On-demand review of code against framework standards. Invoke at meaningful project milestones or when you want to verify recent work meets quality standards. This is Gate 2 enforcement for all rules files.

---

## Modes

### `@code-review [scope]`
Reviews the specified scope (recent changes, specific files, or a feature) against all active rules files.

### `@code-review` (no scope)
Reviews the most recent task's output against all active rules files.

---

## Pre-conditions

Before reviewing:
1. Read `manifest.md` — identify which rules files are active for this project
2. Identify the scope — what code is being reviewed?
3. Read the relevant source files

---

## Process

1. Read `rules/security.md` — run SEC constraints against all code in scope
2. Read `rules/error-handling.md` — run EH constraints against all code in scope
3. Read `rules/code-quality.md` — run CQ constraints against all code in scope
4. Read `rules/testing-standards.md` — run TS constraints: are critical paths tested, do tests exist for new code?
5. Read `rules/documentation-standards.md` — run DS constraints: doc comments on public functions, inline comments for non-obvious logic, API documentation for public interfaces
6. Check against `docs/architecture.md` — does the code match the defined architecture?
7. Report findings using the format below

---

## Report Format

```
## Code Review

**Scope:** [what was reviewed — files, feature, or task]
**Rules applied:** security.md, error-handling.md, code-quality.md, testing-standards.md, documentation-standards.md

### Security (rules/security.md)
[PASS] / [FAIL — SEC-XX: specific issue found]

### Error Handling (rules/error-handling.md)
[PASS] / [FAIL — EH-XX: specific issue found]

### Code Quality (rules/code-quality.md)
[PASS] / [FAIL — CQ-XX: specific issue found]

### Testing (rules/testing-standards.md)
[PASS] / [FAIL — TS-XX: specific issue found]

### Documentation (rules/documentation-standards.md)
[PASS] / [FAIL — DS-XX: specific issue found]

### Architecture Consistency
[PASS — matches architecture.md] / [DEVIATION: what differs and why]

---

### Issues Found

[List each issue with: rule violated, file and line, what is wrong, how to fix]

Or: "None"

---

### Overall: PASS / FAIL
[PASS — no violations found] / [FAIL — [N] violations, listed above. Address before marking task done.]
```

---

## When Issues Are Found

**Fixable now:** List what needs fixing. Fix it with approval.

**Not fixable now:** Flag explicitly:
- What is wrong
- Why it cannot be fixed now (valid reason, not "later")
- What would be needed to fix it

**Security findings:** Always escalate to the builder before proceeding. Security violations are not deferred. If any SEC violation is found, also recommend invoking `@security` for a full vulnerability audit — `@code-review` runs SEC constraints as a basic pass; `@security` runs a deeper audit covering attack vectors and vulnerability patterns beyond the rules file.

**Uncertain:** Flag as uncertain. Do not pretend confidence. "I believe this violates SEC-02 but I'm not certain — verify before proceeding."

---

## When To Invoke

- At meaningful milestones (feature complete, phase complete)
- Before `@qa` review (avoid QA surfacing basic quality issues)
- When `@dev` self-check at task completion found a potential issue worth a second look
- Explicitly by the builder at any time

---

## Closing

After the report is produced:

- **If PASS:** "Review complete — no violations found. You're good to proceed to the next phase."
- **If FAIL:** "Review complete — [N] violation(s) found, listed above. Fix all violations before starting the next phase. Code review fixes do not require a `docs/plan.md` task — invoke `@dev` directly with the violation description and the required fix. Re-run `@code-review` after all fixes to confirm."

---

## When Not To Invoke

- Continuously during implementation — rules are enforced at task completion by `@dev`, not mid-task
- As a replacement for `@qa` — code review checks standards; QA checks shippability and user flows
- As a replacement for `@security` — code review runs SEC constraints as a basic check; `@security` runs a full vulnerability audit
