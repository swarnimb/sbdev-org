# Architecture: [Project Name]

> **This is a living context document — not a planning artifact.**
> It is loaded at every session start. It must be kept current as the project evolves.
> This is the technical source of truth for the project. If architecture changes and this file doesn't, this file is wrong — fix it.
>
> Updated by: `@cto` when architecture changes. Any meaningful deviation from this document made during implementation must be surfaced and this document updated before the next session.

---

## System Overview

[2-3 sentences: what the system does and how it works at a high level. Keep this current — update it when the system's fundamental approach changes.]

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | | |
| Backend | | |
| Database | | |
| Auth | | |
| Testing | | |
| Infrastructure | | |

---

## Directory Structure

```
[Project root]
├── [folder]/        # [Purpose]
├── [folder]/        # [Purpose]
└── [file]           # [Purpose]
```

---

## Architecture Diagram

```
[ASCII diagram of major components and how they connect]

┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│   API    │────▶│ Database │
└──────────┘     └──────────┘     └──────────┘
                      │
                      ▼
                ┌──────────┐
                │ External │
                │ Services │
                └──────────┘
```

---

## Components

### [Component Name]

**Purpose:** [What it does — one sentence]

**Location:** `[path/to/component]`

**Responsibilities:**
- [Responsibility 1]
- [Responsibility 2]

**Dependencies:**
- [What it depends on]

**Exposes:**
- [What it provides to other components]

---

[Repeat component block for each major component]

---

## Data Flow

### [Flow name — e.g., User Authentication]

```
1. [Step 1]
2. [Step 2]
3. [Step 3]
```

### [Flow name — e.g., Core business flow]

```
1. [Step 1]
2. [Step 2]
```

---

## Key Entities

- **[Entity]:** [One-line description]
- **[Entity]:** [One-line description]

---

## API Structure

**Approach:** [REST / GraphQL / RPC]

**Authentication:** [JWT / Sessions / API Keys]

**Error format:** [Brief description of error response structure]

---

## External Integrations

### [Service name — e.g., Stripe]

**Purpose:** [Why it is used]

**How it's used:** [Brief description]

**Key considerations:**
- [Webhooks, rate limits, etc.]

---

## Security Architecture

### Authentication
[How users are authenticated]

### Authorization
[How permissions are enforced — resource-level checks, not just middleware]

### Data Protection
[Encryption at rest, sensitive data handling, what is never stored]

---

## Infrastructure

### Environments

| Environment | Purpose | URL |
|-------------|---------|-----|
| Development | Local dev | localhost:[port] |
| Staging | Pre-prod testing | |
| Production | Live | |

### Deployment
[How the app is deployed — Docker, cloud provider, CI/CD pipeline]

---

## Known Constraints

[Technical limitations that all implementation must respect. If a constraint appears in `docs/constraints.md`, it must also be reflected here.]
-
-

---

## Quick Reference

**Key files:**
- Entry point: `[path]`
- Config: `[path]`
- Routes: `[path]`

**Common commands:**
```bash
# Start dev server
[command]

# Run tests
[command]

# Build for production
[command]
```

---

## Change Log

> Record significant architecture changes here. Date, what changed, why. Keep it brief.

| Date | Change | Reason |
|------|--------|--------|
| [date] | [What changed] | [Why] |
