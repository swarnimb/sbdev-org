# [Agent Name] — [Role Title]

> Template for agent files. Replace all bracketed placeholders.
> Technical agents (cto, security, qa, dev) must include the Founder Brief Format section.
> Non-technical agents (cpo, designer, content-writer, demo-director) may omit it.
> Delete this header block when publishing the agent file.

---

## Role
[One sentence: what this agent owns and is responsible for.]

## Domain
[Bullet list: specific areas this agent has authority over. Be precise — this is what prevents overlap with other agents.]
- [Domain area 1]
- [Domain area 2]
- [Domain area 3]

## Does Not Handle
[Explicit domain boundaries. Name the other agent or skill that owns each excluded area. This is as important as Domain — it prevents agents from overstepping.]
- [Excluded area] — that is `@[other-agent]`'s domain
- [Excluded area] — that is `@[other-agent]`'s domain

## Enforces
[Which rules files this agent applies to its output. List by file name. If this agent produces no output that rules apply to, write "None."]
- `rules/[filename].md` — [one sentence on what aspect of this agent's output this file governs]

## Authority
[One paragraph: what decisions this agent can make unilaterally, and what requires escalation or builder approval.]

## Escalates To
[Use the recommend-to-builder pattern — never direct cross-agent routing. Specific triggers.]
- When [trigger]: recommend invoking `@[other-agent]` before proceeding
- When [trigger]: recommend invoking `@[other-agent]` to resolve before proceeding

## Output Modes
[Exactly two or three modes. Always include a consultation default.]
- **[Mode name] (default):** [What this looks like — what is produced, what is NOT written to disk]
- **[Mode name]:** [What this looks like — when files are written, what triggers it]
- **Transition:** [How consultation becomes creation — what question to ask]

---

## Founder Brief Format
> Include this section for technical agents only: cto, security, qa, dev.
> Remove this section entirely for non-technical agents.

Every significant output leads with a Founder Brief. Do not bury it.

```
**Founder Brief**
**Decided:** [One sentence — what choice was made]
**Means for your product:** [How this affects what users experience or what you can build]
**Check before approving:** [Specific plain-language questions the builder can actually answer]
**What this closes off:** [What becomes harder or more expensive to change later]
```

---

## [Core Function or Process Section]
[Describe the agent's primary process — how it approaches problems, what it does before producing output, what it challenges or interrogates.]

## Documentation Responsibilities
[What files this agent writes or updates, when, and what triggers the write. If the agent writes nothing by default, state that.]
- `docs/[filename]` — [when updated, what it contains]

## Closing

[Explicit closing statement the agent produces when its primary output is complete. Two variants:]

- **[Output state — e.g., CLEAR / APPROVED]:** "[Done message. What the builder should do next — e.g., 'Run `@[next-command]` to proceed.']"
- **[Blocked state — e.g., BLOCKED / REJECTED]:** "[Blocked message. What must be resolved and how — e.g., 'Resolve [issues] before proceeding. Re-run `@[this-agent]` after fixes.']"
