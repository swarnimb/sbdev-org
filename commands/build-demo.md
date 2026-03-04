# Command: @build-demo

## Purpose
Builds a demo for a specific checkpoint and audience. Invoked throughout development — not only at launch. Loads `profile.md` automatically as the first step. Applies `@demo-director` reasoning to decide strategy, then captures screenshots and produces a structured demo asset set. Maintains a demo index for `@launch-prep`.

**Invocation:** `@build-demo [audience] [checkpoint]`

Examples:
- `@build-demo investor mvp-complete`
- `@build-demo developer-community auth-feature-done`
- `@build-demo general-public launch`

---

## Pre-checks

Before doing anything, verify:

- [ ] `profile.md` exists in the project root (copied from sbdev_org by `@recruit` during setup)

**If `profile.md` not found:**
"`profile.md` not found in this project root. It should have been copied from `sbdev_org/profile.md` during `@recruit`. Copy it manually to this project's root, then re-run `@build-demo`."

---

## Process

### Step 1 — Load `profile.md` (mandatory, always first)

Read `profile.md` in full before doing anything else. The demo narrative must reflect the builder's authentic story and voice — this cannot happen without loading the profile first.

---

### Step 2 — Load project context

Read:
- `docs/kickoff-brief.md` — the full project vision (what it is, who it's for, why it exists)
- `docs/session-handoff.md` — what has actually been built so far

The combination of kickoff (vision) and session-handoff (current reality) determines what can and cannot be shown. Never demo what isn't built yet.

If `[audience]` and `[checkpoint]` were not provided in the invocation, ask:
- "Who is the audience for this demo?" (investor, potential user, developer community, general public, personal network)
- "What checkpoint is this?" (early prototype, specific feature complete, MVP done, launch-ready)

Also ask or infer:
- What is actually working and demonstrable right now?
- What should NOT be shown — incomplete features, rough edges, things that would create the wrong impression?

---

### Step 3 — Apply `@demo-director` strategy reasoning

Read `agents/demo-director.md` and apply its Phase 1 strategy process:

1. Assess audience — what does this specific audience need to see to come away convinced?
2. Assess checkpoint — what level of polish and completeness is expected?
3. Cross-reference session-handoff against kickoff-brief — confirm what is actually demonstrable
4. Identify the narrative — what is the story of this checkpoint? (problem → solution → result)
5. Determine what to show and what NOT to show

Present the strategy to the builder before proceeding:

```
## Demo Strategy

**Audience:** [who]
**Checkpoint:** [what stage]
**Narrative:** [the story — one sentence on what the audience should believe after seeing this]

**Show:**
- [what to include and why]

**Do NOT show:**
- [what to exclude and why]

---
Proceed with this strategy? (yes / no / adjust)
```

Wait for confirmation before proceeding.

---

### Step 4 — Capture app screenshots

After strategy is approved, confirm the app is running. Check `docs/testing-setup.md` for the local dev URL, or ask the builder.

Using Playwright and Devtools MCPs:

1. Capture a full-page screenshot of the main view
2. For each key feature being shown (3–5 features, selected from the approved Show list):
   - Navigate to the feature
   - Inject a CSS highlight onto the key element before screenshotting:
     ```javascript
     document.querySelector('[selector]').style.outline = '3px solid #FF4D00';
     document.querySelector('[selector]').style.boxShadow = '0 0 0 6px rgba(255,77,0,0.2)';
     ```
   - Take screenshot with highlight visible
   - Note a text label describing what the highlight shows (this goes in the demo document, not on the image)

If Playwright/Devtools MCPs are not configured: skip screenshot capture and note explicitly in the demo document: "Screenshots not captured — no browser MCP configured. Manual screenshots recommended."

---

### Step 5 — Produce demo assets

Based on the approved strategy and captured screenshots, produce the full demo asset set.

**Asset 1 — Demo overview** (`demo-overview.md`):
```markdown
# Demo: [Project Name] — [Checkpoint]
**Audience:** [who] | **Date:** [date]

## The Problem
[The problem this product solves — from the audience's perspective, not the builder's]

## The Solution
[What the product does — in one paragraph, no jargon]

## What's Working
[Feature by feature — what was built, what it does, screenshot reference]

## What's Next
[Honest next steps — without over-promising]
```

**Asset 2 — Annotated feature pages** (`features/[feature-name].md`):
- One file per feature: `features/[feature-name].md`
- Contains: screenshot reference + callout description (what to point at and why it matters)
- 3–5 features maximum — pick the ones that best prove the demo narrative

**Asset 3 — Video scripts** (`video-scripts/`):
- `video-20s.md` — hook + one core thing + call to action. No more than 3 sentences spoken.
- `video-40s.md` — hook + problem + solution demo (one flow) + call to action
- `video-100s.md` — hook + problem + full demo walkthrough (2–3 flows) + what's next + call to action

Each script includes: what to say (narration), what to show on screen (actions), and timing markers.

Present all assets to the builder for review.

---

### Step 6 — Wait for approval

Do not write any files until the builder explicitly approves the demo assets.

If rejected: ask what needs to change — narrative, which features to show, tone, script length. Revise and re-present.

---

### Step 7 — Write demo files

After approval:

1. Create folder `content/[YYYY-MM-DD]/demo-[checkpoint]/` using today's date and the checkpoint slug
   - Slugify the checkpoint name (e.g., `mvp-complete`, `auth-feature-done`)

2. Write assets to the folder:
   - `content/[YYYY-MM-DD]/demo-[checkpoint]/demo-overview.md`
   - `content/[YYYY-MM-DD]/demo-[checkpoint]/features/[feature-name].md` (one per feature)
   - `content/[YYYY-MM-DD]/demo-[checkpoint]/video-scripts/video-20s.md`
   - `content/[YYYY-MM-DD]/demo-[checkpoint]/video-scripts/video-40s.md`
   - `content/[YYYY-MM-DD]/demo-[checkpoint]/video-scripts/video-100s.md`

3. Update `docs/demo-index.md`:
   - If it doesn't exist: create it
   - If it exists: append the new entry

`docs/demo-index.md` format:
```markdown
# Demo Index: [Project Name]

| Checkpoint | Audience | Date | Assets |
|---|---|---|---|
| [checkpoint name] | [audience] | [date] | `content/[YYYY-MM-DD]/demo-[checkpoint]/` |
```

Confirm: "Demo assets written to `content/[YYYY-MM-DD]/demo-[checkpoint]/`. Demo index updated."

Tell the builder: "To record the video scripts, use Loom (easiest), ClipChamp (Windows built-in), or Screen Studio (Mac). Follow the timing markers in each script."

---

### Step 8 — Content prompt (always last)

"Want to create a post about this demo? Invoke `@content-writer`."

This is always the final step. Do not skip it.

---

## Rules

- `profile.md` is loaded before anything else — no exceptions. The demo narrative cannot be authentic without it.
- `@demo-director` strategy is presented and approved before any assets are produced
- All assets are approved before being written to disk
- `docs/demo-index.md` is always maintained — every demo gets an entry. This is what `@launch-prep` checks.
- Content prompt is always the last step
- Does not deploy or publish anything — produces documents only

---

## What To Do If Pre-check Fails

**If `profile.md` not found:**
"`profile.md` not found in this project root. It should have been copied from `sbdev_org/profile.md` during `@recruit`. Copy it manually to this project's root, then re-run `@build-demo`."
