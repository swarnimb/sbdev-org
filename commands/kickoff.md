# Command: @kickoff

## Purpose
The first interrogation. Challenges a project idea across 6 dimensions before any framework setup begins. Does not accept vague answers — but does not block on ignorance either. When the builder doesn't know an answer, provides options with trade-offs and a recommendation. The goal is enabling thinking, not demanding pre-existing knowledge.

Produces `docs/kickoff-brief.md` — the foundation for everything that follows.

---

## Pre-checks

None. `@kickoff` is the very first step — no framework exists yet.

---

## Philosophy

By the time `@kickoff` is invoked, the builder has already done initial brainstorming externally. They are not starting from zero. Acknowledge what they bring in and interrogate from there — do not re-explain their idea back to them.

**Coverage over depth.** The goal is to make the builder think of things they haven't thought of yet — not to demand precision they don't yet have.

**Interrogation behavior:**
- Push back once on a vague answer
- If the second answer is still vague: offer 2-3 concrete options with trade-offs, give a clear recommendation, let them choose
- Move on when the answer is defensible — not when it's perfect
- Never block progress on ignorance — unblock it

---

## Process

### Phase 1 — Interrogation across 6 dimensions

Work through each dimension in order. Don't rush — get a defensible answer before moving on. But don't over-index on one dimension at the expense of covering all six.

---

**Dimension 1: Problem**

What problem does this solve? Who has this problem and how badly?

Push on:
- Is this a real problem or a solution looking for a problem?
- How do people solve it today? What is wrong with that?
- Is it painful enough that someone would pay for a solution or change their behavior?

If vague: "Give me a specific person who has this problem. What did they do last week because of it?"

---

**Dimension 2: Users**

Who specifically is this for? Not "people who want X" — a real, describable person.

Push on:
- How old are they? What do they do? Where do they encounter this problem?
- How many of them exist? Is this a large audience or a specific niche?
- How technically sophisticated are they?

If vague: offer 2-3 specific user archetypes with descriptions. Ask which fits best or what is missing.

---

**Dimension 3: Scope**

What is in? What is explicitly out?

Push on:
- What is the one thing the MVP must do to be useful?
- What feels like scope creep? Name it explicitly and put it out of scope.
- If everything is in scope, nothing ships. Force a cut.

Produce an explicit In/Out list before moving on.

---

**Dimension 4: Risks**

What could make this fail? What assumptions could be wrong?

Push on:
- What are you assuming about the data, the users, the technology, or the market?
- What is the worst-case scenario if this assumption is wrong?
- What has already been tried and failed in this space?

Note: technical/data assumptions raised here will be formally validated by `@assumptions`. Flag them but don't resolve them here.

---

**Dimension 5: Platform and Stack**

Two mandatory questions. Get both answered before moving on.

**5a — Platform target (ask this first, explicitly):**

"What devices must this work on?" Present these options:

| Option | What it means | When to choose it |
|--------|--------------|-------------------|
| Web — desktop only | Browser on laptop/desktop. No mobile support needed. | Internal tools, dashboards, power-user apps |
| Web — mobile only | Browser on phone. Desktop ignored. | Consumer apps with simple flows, quick-access tools |
| Web — responsive | Works on both. Designed for one, adapted for the other. | Most web apps — broader reach, more build effort |
| Native mobile app | iOS/Android app. Completely different stack (React Native, Expo). | Needs device features (camera, GPS, push notifications), app store distribution |

Push on:
- If "responsive": which is primary — mobile or desktop? Design starts from one and adapts to the other.
- If "native mobile": confirm the builder understands this is a different stack and significantly more complexity than a web app.
- If unsure: give a recommendation based on the user type and use case from Dimensions 2 and 3.

This decision is recorded in the kickoff brief as `Platform Target` and flows directly to `@designer` and `@cto`. Do not leave it vague.

**5b — Stack:**

- Has a tech stack been decided? Why?
- If not decided: does it need to be decided now, or can it wait until `@recruit`?
- Any existing systems to integrate with?

If the builder doesn't know: offer 2-3 stack options appropriate to the platform target and project type with a recommendation. Make it clear `@recruit` and `@cto` will finalize the decision — the goal here is not to commit, but to identify what is already known.

---

**Dimension 6: Constraints**

What real-world constraints must this project work within?

Push on:
- Time constraints — is there a deadline or forcing event?
- Budget constraints — any costs that are prohibitive?
- Technical constraints — existing systems to integrate with, languages or platforms that must be used?
- Dependencies — any third-party services or data sources the project fundamentally depends on?

---

### Phase 2 — ASCII wireframe

After scope is clear (usually after Dimension 3 is complete), produce a simple ASCII wireframe of the core user flow.

**Purpose:** Confirm that the idea is understood correctly and challenge it visually. Show the primary screens or steps a user goes through from arrival to completing the core action.

```
Example format (adapt to project type):

[User lands] → [Core action] → [Result]

+------------------+     +------------------+     +------------------+
|  Screen/Step 1   | --> |  Screen/Step 2   | --> |  Screen/Step 3   |
|                  |     |                  |     |                  |
| [Key elements]   |     | [Key elements]   |     | [Key outcome]    |
+------------------+     +------------------+     +------------------+
```

Ask after presenting: "Does this match what you had in mind? What is missing or wrong?"

Revise once based on feedback.

---

### Phase 3 — Write the kickoff brief

After all 6 dimensions have defensible answers and the wireframe is confirmed:

Ask: "Ready to write the kickoff brief?"

On confirmation, write `docs/kickoff-brief.md` using the format below.

---

## Output: `docs/kickoff-brief.md`

```markdown
# Kickoff Brief: [Project Name]

**Date:** [date]

## One-Line Description
[What it does and who it's for — one sentence]

## Problem
[The specific problem being solved. For whom. How badly it hurts.]

## Target User
[Specific, describable user — not a category, a person]

## Core Scope

### In
- [Feature/capability 1]
- [Feature/capability 2]

### Explicitly Out
- [Exclusion 1]
- [Exclusion 2]

## Risks and Assumptions
[Risks identified during interrogation. Technical/data assumptions flagged for @assumptions to validate.]
- [Risk or assumption 1]
- [Risk or assumption 2]

## Platform Target
[Web desktop only / Web mobile only / Web responsive (primary: mobile or desktop) / Native mobile app]

## Stack
[Decided / TBD — what is known and what is deferred to @recruit/@cto]

## Constraints
[Time, budget, technical, dependency constraints]

## ASCII Wireframe
[Core user flow wireframe — agreed upon during interrogation]

## Open Questions
[Questions that came up but weren't resolved — need research, a decision, or @assumptions to address]
- [Question 1]
- [Question 2]
```

---

### Phase 4 — Closing direction

After `docs/kickoff-brief.md` is written:

**If the project has a UI component:**
"Kickoff brief written. This project has a UI component — consult `@designer` for design direction before running `@recruit`. `@designer` will define the visual direction that `@recruit` uses to configure your `@ui` skill."

**If the project has no UI (CLI tool, backend service, API):**
"Kickoff brief written. Run `@recruit` to set up your project framework."

---

## Rules

- Do not move to planning. `@kickoff` produces one document: `docs/kickoff-brief.md`. Nothing else.
- Do not write `docs/kickoff-brief.md` until all 6 dimensions have defensible answers and the wireframe is confirmed.
- Do not re-explain the builder's idea back to them — interrogate forward from what they already know.
- When the builder doesn't know an answer, offer options and a recommendation — never block on ignorance.

---

## What To Do If Pre-check Fails

No pre-checks. `@kickoff` always runs.
