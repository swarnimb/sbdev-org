# SBDev Organization Framework

This is the routing hub for all @ invocations. When an @ marker is used, find it here and follow the instructions.

## Routing Table

| Invocation | Type | Action | File to Read |
|------------|------|--------|--------------|
| `@cto` | Agent | Respond as technical co-founder | `agents/cto.md` |
| `@cpo` | Agent | Respond as product co-founder | `agents/cpo.md` |
| `@dev` | Agent | Implementation discipline | `agents/dev.md` |
| `@security` | Agent | Security audit authority | `agents/security.md` |
| `@designer` | Agent | Design decision authority | `agents/designer.md` |
| `@qa` | Agent | Quality authority and release sign-off | `agents/qa.md` |
| `@content-writer` | Agent | Personal brand content creation | `agents/content-writer.md` |
| `@demo-director` | Agent | Demo strategy advisor | `agents/demo-director.md` |
| `@kickoff` | Command | Interrogate and validate new project idea | `commands/kickoff.md` |
| `@recruit` | Command | Set up project framework | `commands/recruit.md` |
| `@assumptions` | Command | Validate critical dependencies before planning | `commands/assumptions.md` |
| `@plan` | Command | Create all planning documents | `commands/plan.md` |
| `@create-plan` | Command | Add new feature to existing project | `commands/create-plan.md` |
| `@modify-plan` | Command | Modify existing feature spec mid-build | `commands/modify-plan.md` |
| `@session-start` | Command | Open and orient a development session | `commands/session-start.md` |
| `@end-session` | Command | Close session and save handoff | `commands/end-session.md` |
| `@create-roadmap` | Command | Build project roadmap | `commands/create-roadmap.md` |
| `@build-demo` | Command | Build demo for a checkpoint | `commands/build-demo.md` |
| `@launch-prep` | Command | Pre-launch checklist and go/no-go | `commands/launch-prep.md` |
| `@code-review` | Skill | On-demand code standards review | `skills/code-review.md` |
| `@write-tests` | Skill | Write unit or integration tests | `skills/write-tests.md` |
| `@ui` | Skill | Build UI components | `skills/ui.md` |

## Invocation Hierarchy

- **Commands** are the primary entry points for structured workflows. They orchestrate agents, rules, and skills internally.
- **Agents** can be consulted directly. Expert advice — no file writes unless explicitly requested and approved.
- **Skills** are execution tools. Pure execution, no opinions or authority.
- **Rules** enforce at defined gates (task completion + `@code-review`). Never manually invoked.

**If invocation not found:** Tell the user it doesn't exist and show available options.

## Adding New Invocations

To add a new agent, command, or skill:
1. Create the .md file in the appropriate folder (agents/, commands/, skills/)
2. Add a row to the routing table above
3. Done - no other files need updating

## Current Phase: 1 (Pre-Seed)

See `organizational_growth_plan.md` for the full roadmap.
