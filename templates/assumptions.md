# Assumptions: [Project Name]

> Per-project file. Produced by `@assumptions` command.
> Loaded by `@session-start` alongside `architecture.md` and `constraints.md`.
> This file is complete when every critical assumption is either validated or explicitly accepted as a known risk with a contingency. Nothing invisible. A known risk is acceptable. An unexamined assumption is not.

---

## Status

**Overall:** [ ] Open — critical assumptions remain unresolved | [ ] Complete — all assumptions resolved or accepted

**Last updated:** [Date]

---

## Assumption Categories

Five categories are audited by `@assumptions`. Each critical assumption found falls into one:

1. **Data availability** — Does the data source actually have what this project needs?
2. **Service capability** — Can the third-party service do what the project requires?
3. **User behavior** — Will users actually perform the interaction the product is designed around?
4. **Technical feasibility** — Can this be built with available tools and libraries?
5. **Cost** — Will this be affordable at real usage volume?

---

## Assumptions Log

---

### [ASSUMPTION-01] [Short title]

**Category:** [Data availability / Service capability / User behavior / Technical feasibility / Cost]

**Assumption:** [The assumption stated plainly. What are we taking for granted?]

**Why it's critical:** [What breaks if this assumption is false?]

**Resolution approach:** [Research / Spike / Accepted risk]

**Resolution detail:**
- *If research:* [What was looked up, where, what was found]
- *If spike:* [What the spike tested, what code was written (20-50 lines, throwaway), what result was recorded]
- *If accepted risk:* [Why it cannot be validated now. What the contingency plan is if it proves false. Must be specific — "we'll deal with it" is not a contingency.]

**Outcome:** [What was found or decided — specific, not vague]

**Status:** [ ] Open | [x] Resolved | [x] Accepted risk

---

### [ASSUMPTION-02] [Short title]

**Category:** [...]

**Assumption:** [...]

**Why it's critical:** [...]

**Resolution approach:** [Research / Spike / Accepted risk]

**Resolution detail:** [...]

**Outcome:** [...]

**Status:** [ ] Open | [x] Resolved | [x] Accepted risk

---

## Summary

| # | Assumption | Category | Approach | Status |
|---|---|---|---|---|
| 01 | [Short title] | [Category] | [Research / Spike / Accepted risk] | Open / Resolved / Accepted |
| 02 | [Short title] | [Category] | [Research / Spike / Accepted risk] | Open / Resolved / Accepted |

**Open count:** [N] — `@plan` cannot run until this reaches 0.

---

## Spike Notes

> Spike code is never part of the project. Its only job is to answer one question. Once run and result recorded, the spike is discarded.

[If any spikes were written during `@assumptions`, summarize the question each answered and the result. Do not include the code here — it was throwaway.]

| Spike | Question answered | Result |
|---|---|---|
| [Spike 1] | [What it tested] | [What it found] |
