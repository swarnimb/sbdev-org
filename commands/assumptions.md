# Command: @assumptions

## Purpose
Surfaces every critical dependency the project is taking for granted, determines how each can be resolved, and either validates it or accepts it as a known risk with a stated contingency. Sits between `@recruit` and `@plan`. Nothing invisible goes into `@plan`.

Produces `docs/assumptions.md` — loaded by `@session-start` every session.

---

## Origin

This command exists because of a specific failure mode: a project (Personal FA) failed mid-build when a critical data availability assumption — that a financial institution exposes historical portfolio values through its data aggregator — proved false after architecture had been committed. This wasn't discoverable by interrogation. It required testing. `@assumptions` exists to surface that class of problem before any planning document is written.

---

## Pre-checks

Before doing anything, verify:

- [ ] `manifest.md` exists in the project root
- [ ] `docs/kickoff-brief.md` exists

**If `manifest.md` not found:**
"`manifest.md` not found. Run `@recruit` first to set up your project framework, then re-run `@assumptions`."

**If `docs/kickoff-brief.md` not found:**
"`docs/kickoff-brief.md` not found. Run `@kickoff` first to document your project idea, then `@recruit` to set up the framework, then re-run `@assumptions`."

---

## Process

### Step 1 — Read context

Read:
- `docs/kickoff-brief.md` — understand the project's core dependencies and what it fundamentally requires to work
- `manifest.md` — understand what stack, services, and tools are planned
- Any risks or open questions noted in the kickoff brief
- `docs/assumptions.md` — **if it already exists**, read it before auditing

---

### Step 1.5 — Existing assumptions check (mid-build re-runs)

**If `docs/assumptions.md` was loaded in Step 1:**

- All items already marked **Resolved** or **Accepted Risk** are closed — do not re-audit them
- Any items still marked **Open** are in scope — include them in the audit below
- The audit in Step 2 covers only assumptions **not already present** in the file
- In Step 6, **append** new findings to the existing file — do not replace it

**If `docs/assumptions.md` does not exist (first run):**

- Proceed to Step 2 normally — full audit across all 5 categories

---

### Step 2 — Audit across 5 categories

For each category, identify every critical assumption the project depends on. A critical assumption is one where, if it proves false, the project cannot be built as planned.

Work through all five categories explicitly — do not skip any.

---

**Category 1: Data Availability**

Does the data source actually have what this project needs?

Not "can we access it?" — but "does the data exist at the source at all?"

Questions to ask:
- What data does this project fundamentally require to function?
- Where does that data come from? (user input, third-party API, data aggregator, public dataset)
- Has anyone confirmed that the source actually provides this specific data in the format needed?
- For financial data: does the institution expose the specific fields needed (e.g., historical portfolio values, transaction history, cost basis)?
- For external APIs: does the API return this exact field, or only a summary?

If uncertain: this is a critical assumption — determine resolution approach.

---

**Category 2: Service Capability**

Can the third-party service actually do what the project requires it to do?

Not "does an API exist?" — but "does this specific API provide this specific thing at this specific fidelity?"

Questions to ask:
- What third-party services does the project depend on?
- For each: what exactly does it need to do? (not generally — precisely)
- Has anyone tested that it can do this specific thing, not just that it has an API?
- What are the rate limits? Do they support the expected usage pattern?
- What are the terms of service implications?

---

**Category 3: User Behavior**

Will users actually perform the interaction the product is designed around?

Friction test: walk through exactly what a user does on day one. Count the steps. Would a real user do this every week? If the answer is "maybe," that is a risk.

Questions to ask:
- What does the user need to do before they get any value from the product?
- How many steps is that? (More than 3-4 steps before value = friction risk)
- Why would a user come back a second time? A third time?
- What competing habit or behavior is this product trying to replace?
- Is the assumption that "users will do X regularly" tested or just hoped for?

---

**Category 4: Technical Feasibility**

Can this be built with available tools and libraries?

Questions to ask:
- Is there any core feature that depends on something that hasn't been proven to work?
- Are there libraries or frameworks that are assumed to support a key capability — has that been confirmed?
- Any real-time, offline, or performance requirements that haven't been stress-tested?
- Any integration that has never been attempted between these two systems?

---

**Category 5: Cost**

Will this be affordable at real usage volume?

Not dev/test scale — actual users.

Questions to ask:
- What are the per-request or per-user costs for any paid services (AI APIs, data providers, cloud infrastructure)?
- At what user volume does the cost become problematic?
- Is there a free tier that will be relied upon that has limits?
- Has a back-of-envelope calculation been done for 100 users? 1,000 users?

---

**If no critical assumptions are identified across all 5 categories:** Confirm with the builder — "I audited all 5 categories and found no critical assumptions for this project. Does that match your read?" On confirmation, write a minimal `docs/assumptions.md` noting the clean audit result and proceed to `@plan`.

---

### Step 3 — Determine resolution approach per assumption

For each identified critical assumption, determine the resolution approach:

**Research** — look it up now, record the finding before proceeding.
- Acceptable when: the answer can be found in documentation, existing projects, or community resources
- Not acceptable when: the question requires hands-on testing to answer

**Spike** — write a minimal throwaway script (20-50 lines) testing exactly one assumption. User runs it. Result is recorded.
- Spike rules: one question per spike. Throwaway — never becomes part of the project. Result must be recorded in `docs/assumptions.md` before proceeding. The spike is not the answer — the result of running the spike is the answer.
- Acceptable when: the answer requires making an actual API call, testing an integration, or running code

**Accepted risk** — the assumption cannot be validated now. Explicitly state the assumption, why it cannot be validated, and what the contingency plan is if it proves false.
- Requirements: must have a specific contingency ("we'll deal with it" is not a contingency). Must state what the project falls back to if the assumption is wrong.
- Acceptable when: validation would require production data, significant time investment, or external access not available now — AND a specific, workable contingency exists

---

### Step 4 — Present assumptions for review

Present all identified critical assumptions grouped by category. For each:
- State the assumption
- State the resolution approach
- State the proposed next step (research now, write spike, or accept with stated contingency)

Ask for builder confirmation before proceeding with spikes.

---

### Step 5 — Execute resolution

**Research items:** Look up the answer now. Record it.

**Spike items:** Write the spike script. Present it to the builder to run. Record the result when they provide it.

**Accepted risks:** Confirm the contingency with the builder. Record it.

Work through all assumptions until none remain open (all are resolved or accepted with contingency).

---

### Step 6 — Write or update `docs/assumptions.md`

After all assumptions are resolved or accepted:

**If this is the first run** (file did not exist): Write `docs/assumptions.md` using `templates/assumptions.md` format.

**If this is a mid-build re-run** (file already existed): Append new findings to the existing file. Do not replace previously-resolved or accepted-risk items. Add new items below the existing content under a dated header: `## Added [date] — [brief reason, e.g., "new third-party dependency surfaced in Task 7"]`

Confirm: "Assumptions complete. [N] new: [N resolved, N accepted as known risk]. [N] previously closed carried forward. Write/update `docs/assumptions.md`?"

On confirmation, write or update the file.

Closing: "Assumptions documented. Run `@plan` to create your planning documents." (First run) / "Assumptions updated. Return to `@dev`, `@create-plan`, or `@modify-plan` — the new assumption is resolved." (Mid-build re-run)

---

## Done Condition

`@assumptions` is complete when every critical assumption is either:
- Validated (research or spike result recorded)
- Accepted as a known risk with a specific contingency

The measure is: **nothing is invisible.** A known risk is acceptable. An unexamined assumption is not.

`@plan` cannot run until `docs/assumptions.md` exists with all items either resolved or accepted.

---

## Rules

- Never skip a category — even if the project seems simple, all 5 must be audited
- Research results must be specific — "I looked it up and it seems to work" is not a result. Record what was found, where, and what the confirmed capability is.
- Spike code is throwaway — never import it into the project, never reference it in architecture.md
- Accepted risks must have contingencies — what happens if the assumption is wrong? Specific answer required.
- `@plan` is blocked until this command completes

---

## What To Do If Pre-check Fails

**If `manifest.md` not found:**
"`manifest.md` not found. `@assumptions` requires a project framework to exist first. Run `@recruit` to set up your framework, then re-run `@assumptions`."

**If `docs/kickoff-brief.md` not found:**
"`docs/kickoff-brief.md` not found. `@assumptions` needs the kickoff brief to understand what the project depends on. Run `@kickoff` first, then `@recruit`, then re-run `@assumptions`."
