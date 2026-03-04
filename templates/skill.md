# Skill: [Skill Name]

> Template for skill files. Skills are pure execution tools — no opinions, no authority, no standards ownership.
> Standards live in rules files. Authority lives in agent files. Skills apply and execute.
> Delete this header block when publishing the skill file.

---

## Purpose
[One or two sentences: what this skill does. What it executes. No opinions or decisions here — just what it produces.]

---

## Modes

### `@[skill-name]` (reference / no-arg invocation)
[What happens when invoked without arguments — show options, confirm state, or default behavior.]

### `@[skill-name] [mode]`
[Primary mode with argument — what it does, what it produces.]

### `@[skill-name] [mode] [target]`
[Target-specific mode — applies the skill to a specific file, function, or feature.]

---

## Pre-conditions

Before executing:
1. [What to read first — manifest.md, architecture.md, plan.md, etc.]
2. [What to confirm — tech stack, conventions, existing patterns]
3. [What must exist for this skill to run — if missing, what to say]

---

## Process

### [Mode 1 name]
1. [Step 1]
2. [Step 2]
3. [Step 3]

### [Mode 2 name]
1. [Step 1]
2. [Step 2]

---

## Approval Before Writing

[If this skill produces files: present the output to the builder for review before writing to disk. Do not write without confirmation. If the builder requests changes: revise and re-present.]

[If this skill produces no files (e.g., report only): remove this section.]

---

## Output Format

[How output is structured — file naming convention, format, what is included, where it goes.]

---

## When To Invoke

- [Specific trigger 1]
- [Specific trigger 2]
- [Specific trigger 3]

---

## When Not To Invoke

- [Scenario where this skill is the wrong tool — name what to use instead]
- [Scenario that is out of scope for this skill]

---

## Tools

[If this skill uses MCP tools (Playwright, devtools, etc.): describe how. Check `manifest.md` for `## Available MCPs` to determine if the tool is available for the current project.]

If no MCP tools apply: remove this section.

---

## Closing

[Explicit closing statement after execution is complete. What was produced, any key stats (N tests written, N violations found), and what the builder should do next.]
