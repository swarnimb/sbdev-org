# Skill: Write Tests

> **React + framework-agnostic.** This skill adapts to whatever test runner the project uses (Jest, Vitest, pytest, etc.). Check `manifest.md` or `docs/architecture.md` for the project's test tooling before writing tests.

---

## Purpose
Pure execution — writes unit or integration tests for a specified target. No opinions on what should be tested (that is `@qa`'s domain). No standards authorship (those live in `rules/testing-standards.md`). Applies `rules/testing-standards.md` constraints to every test written.

---

## Modes

### `@write-tests unit [target]`
Writes unit tests for the specified function, module, or component.

- All external dependencies are mocked or stubbed (per TS-03)
- Tests run without network or database connections
- Happy path + at least one error case per function (per TS-01)
- Additional error cases for auth, payment, and data-handling functions (per TS-01)
- Test names describe behavior, not implementation (per TS-02)
- Each test is isolated — no shared mutable state between tests (per TS-05)

### `@write-tests integration [target]`
Writes integration tests for the specified flow, endpoint, or feature.

- May use real external services, test databases, or test environments
- Clearly separated from unit tests — different command, different directory
- Focuses on the interaction between components, not individual unit behavior
- Critical paths (per TS-04) are always covered in integration tests when applicable

---

## Pre-conditions

Before writing tests:
1. Read the target code — understand what the function/module/component does
2. Read the task's acceptance criteria from `plan.md` (if it exists) — tests must validate the acceptance criteria
3. Check `manifest.md` or `docs/architecture.md` for:
   - Test runner being used (Jest, Vitest, pytest, etc.)
   - Test file location conventions
   - Mock library conventions
4. Check existing tests for this module (if any) to match style

---

## Process

### Unit tests
1. Identify all functions or components in the target
2. For each function: identify happy path inputs/outputs and failure modes
3. Write happy path test
4. Write error case test(s)
5. For auth, payment, or data-handling functions: write at least two error case tests
6. Verify: all external dependencies are mocked, tests are isolated, names describe behavior

### Integration tests
1. Identify the flow or feature to test
2. Define the entry point (API endpoint, UI action, CLI command)
3. Define the expected outcome (response, database state, UI state)
4. Write test that starts from entry point and verifies outcome
5. Include at least one failure path (invalid input, auth failure, external service failure)

---

## Approval Before Writing

After completing tests (unit or integration), present the full test content to the builder for review before writing to disk. Do not write without confirmation.

If the builder requests changes: revise and re-present. Do not write until approved.

---

## Output Format

Tests are written in the project's test file convention. If no convention exists, place tests adjacent to the source file:
- `user.service.ts` → `user.service.test.ts`
- `user.py` → `test_user.py`

Each test file includes at the top:
```
// Tests for: [target file or module]
// Coverage: [list of functions/flows covered]
// Rules enforced: rules/testing-standards.md
```

---

## When To Invoke

- After implementing a function or module (part of task completion per `@dev`)
- When adding tests to existing untested code
- When `@qa` identifies coverage gaps
- When `rules/testing-standards.md` TS-04 critical path requirements are not yet met

---

## When Not To Invoke

- To decide what should be tested — consult `@qa` for coverage decisions
- For E2E tests — E2E test tooling is project-specific. Check project-specific agent or skill files.
- For load or performance testing — out of scope for this skill

---

## Tools

If the project's `manifest.md` lists a test runner MCP or CLI tool, use it to run the tests after writing them and confirm they pass before reporting complete.

---

## Closing

After tests are written and confirmed passing: "Tests written for [target]. [N] tests — [happy paths] happy path(s), [error cases] error case(s). All pass."

If tests fail after writing: fix them before reporting complete. Do not hand back failing tests.
