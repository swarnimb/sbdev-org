# Rules: [Domain Name]

> Template for rules files. Every rule must be specific enough to apply without judgment.
> Test each rule against: "Can Claude apply this without asking a clarifying question?"
> If no, make it more specific. Vague rules drift. Unambiguous rules don't.
> Delete this header block when publishing the rules file.

---

> **Priority in conflict:** [This file's position in the hierarchy — e.g., "When rules in this file conflict with `security.md`, security takes precedence."]
>
> Full hierarchy: `security > error-handling > code-quality > documentation`. See `rules/code-quality.md`.

---

## Constraints

---

### [PREFIX]-01: [Constraint title]

**Constraint:** [The rule, stated precisely. Specific numbers, thresholds, and conditions. No "usually," "generally," or "should." Must be applicable without judgment.]

**Rationale:** [One sentence — why this rule exists. What failure it prevents.]

**Pass:**
```[language]
// Concrete code or pattern that satisfies the rule
```

**Fail:**
```[language]
// Concrete code or pattern that violates it
// Comment explaining what is wrong
```

---

### [PREFIX]-02: [Constraint title]

**Constraint:** [...]

**Rationale:** [...]

**Pass:**
```[language]
[example]
```

**Fail:**
```[language]
[example]
```

---

### [PREFIX]-03: [Constraint title]

[Add as many constraints as needed. Each follows the same four-element structure: Constraint / Rationale / Pass / Fail.]

---

## Priority

[This file's position in the conflict resolution hierarchy and how it interacts with other files. Be explicit about which files override this one and which files this one overrides.]

This file is [first / second / third / fourth] in the conflict resolution hierarchy:

`security > error-handling > code-quality > documentation`

**Specific conflict notes:** [If any constraints in this file interact with specific constraints in other files in a non-obvious way, document the resolution here. See `rules/error-handling.md` SEC-05 note as an example.]

---

## Enforcement

**Gate 1 — Task completion self-check:** Before marking any task done in `plan.md`, verify the task output meets every [PREFIX] constraint that applies. If a constraint is violated, do not mark done — surface the violation.

**Gate 2 — `@code-review` invocation:** `skills/code-review.md` runs all [PREFIX] constraints against the reviewed code. Findings are reported and must be addressed before the review passes.

[Add any domain-specific enforcement notes — e.g., which agent triggers which rules, which skill enforces this file.]

---

## Overrides

[What projects can do with these rules:]

Projects may tighten these rules (e.g., stricter limits, additional requirements). Projects may not [state what cannot be loosened]. Any project-level override must be documented in `docs/constraints.md`.
