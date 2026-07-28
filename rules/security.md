# Rules: Security

> **Priority in conflict:** Security wins over everything. When any rule in this file conflicts with rules in `code-quality.md`, `error-handling.md`, or `documentation-standards.md`, security takes precedence without exception.
>
> See `rules/code-quality.md` for the full conflict resolution hierarchy.

---

## Constraints

---

### SEC-01: No secrets in source code

**Constraint:** API keys, passwords, tokens, connection strings, private keys, and any credential must never appear in source code — not hardcoded, not in comments, not in test files. All secrets must be loaded from environment variables or a secrets manager at runtime.

**Rationale:** Secrets in code get committed to version control. Once in git history, they are compromised permanently — even after deletion.

**Pass:**
```python
import os
STRIPE_KEY = os.environ["STRIPE_SECRET_KEY"]
```

**Fail:**
```python
STRIPE_KEY = "sk_live_abc123xyz"  # hardcoded
# or
STRIPE_KEY = os.environ.get("STRIPE_KEY", "sk_live_abc123xyz")  # default is a real secret
```

**Enforcement note:** Any function that initializes an external service connection is checked at task completion. `.env.example` must list all required env vars without values.

---

### SEC-02: Validate and sanitize all user inputs at system boundaries

**Constraint:** Every input that crosses a system boundary (HTTP request, file upload, form field, URL parameter, CLI argument) must be validated for type, format, length, and allowed values before it touches any business logic, database query, or file operation. Validation happens at the boundary — not inside business logic.

**Rationale:** Input that reaches business logic unvalidated is the root cause of injection attacks, data corruption, and unexpected application state.

**Pass:**
```typescript
// At the route handler (system boundary)
const schema = z.object({ userId: z.string().uuid(), amount: z.number().positive().max(10000) });
const { userId, amount } = schema.parse(req.body); // throws if invalid
await processPayment(userId, amount); // business logic receives clean data
```

**Fail:**
```typescript
// Business logic receives raw input
async function processPayment(req) {
  const userId = req.body.userId; // no validation
  await db.query(`SELECT * FROM users WHERE id = '${userId}'`); // injection risk
}
```

---

### SEC-03: Use parameterized queries for all database operations

**Constraint:** Database queries must never concatenate user-controlled values into query strings. Use parameterized queries, prepared statements, or an ORM's query builder exclusively. This applies to every database operation — reads, writes, updates, deletes.

**Rationale:** String concatenation into SQL is the direct cause of SQL injection, which can expose or destroy entire databases.

**Pass:**
```python
cursor.execute("SELECT * FROM users WHERE email = %s AND active = %s", (email, True))
```
```typescript
await db.query('SELECT * FROM users WHERE id = $1', [userId])
```

**Fail:**
```python
cursor.execute(f"SELECT * FROM users WHERE email = '{email}'")
```
```typescript
await db.query(`SELECT * FROM users WHERE id = ${userId}`)
```

---

### SEC-04: Enforce authentication and authorization on every protected operation

**Constraint:** Every endpoint, function, or operation that accesses or modifies protected resources must verify (1) the caller is authenticated (valid session/token) and (2) the caller is authorized to perform this specific operation on this specific resource. Both checks are required. Auth middleware alone is not sufficient — resource-level authorization must also be implemented.

**Rationale:** Verifying identity without verifying permission enables horizontal privilege escalation — users accessing other users' data with their own valid credentials.

**Pass:**
```typescript
// Auth middleware confirms identity
// Resource-level check confirms ownership
async function getDocument(userId: string, documentId: string) {
  const doc = await db.documents.findUnique({ where: { id: documentId } });
  if (!doc) throw new NotFoundError();
  if (doc.ownerId !== userId) throw new ForbiddenError(); // resource-level authorization
  return doc;
}
```

**Fail:**
```typescript
// Only checks authentication — no resource ownership check
async function getDocument(userId: string, documentId: string) {
  // userId is authenticated but never checked against the document
  return await db.documents.findUnique({ where: { id: documentId } });
}
```

---

### SEC-05: Never log or expose sensitive data

**Constraint:** Passwords, tokens, full credit card numbers, SSNs, and raw PII must never appear in log output, error messages, API responses, or stack traces. Error responses to clients must contain only what is needed to describe the problem — not internal state, not stack traces, not database error details.

**Rationale:** Logs are often stored insecurely and accessed by more people than the application itself. Exposed internal errors reveal system structure to attackers.

**Pass:**
```typescript
// Client receives clean error
res.status(400).json({ error: "Invalid request" });
// Internal log has detail (without the sensitive value)
logger.error("Validation failed for field: email", { userId, field: "email" });
```

**Fail:**
```typescript
// Stack trace and db error exposed to client
res.status(500).json({ error: err.message, stack: err.stack });
// Password logged
logger.info("Login attempt", { email, password }); // never log credentials
```

---

### SEC-06: Use HTTPS and encrypt sensitive data at rest

**Constraint:** All HTTP communication must use HTTPS (enforce via redirect or HSTS). Sensitive data stored at rest (passwords, payment data, health data, government IDs) must be encrypted. Passwords must be hashed using bcrypt, argon2, or scrypt — never stored as plaintext or reversible encryption.

**Rationale:** Unencrypted transport exposes data to interception. Unencrypted storage exposes data if the database is breached.

**Pass:**
```python
import bcrypt
hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
# Store `hashed`, never `password`
```

**Fail:**
```python
# Reversible — not a hash
import base64
stored = base64.b64encode(password.encode())
```

---

### SEC-07: Never commit sensitive files to version control

**Constraint:** The following files must always be in `.gitignore` and must never be staged or committed:

- `docs/testing-setup.md` — contains test credentials, passwords, and API keys
- `docs/session-log.md` — operational session data
- `docs/session-handoff.md` — in-flight session state, may contain sensitive context
- `docs/framework-issues.md` — internal maintenance log
- `docs/qa-report.md` — QA findings are a map of untested surfaces and known weaknesses (added 2026-07-28, FI-06 follow-up; `@launch-prep` reads it from local disk — committing was never functionally required)
- `docs/security-report.md` — security findings are an attacker roadmap (same reasoning; most projects already ignored it by convention)
- `profile.md` — personal brand identity
- `content/` — personal brand content
- `CLAUDE.md` — project framework configuration
- `manifest.md` — project framework configuration
- `.env`, `.env.local`, `.env.*.local` — environment variables (`.env.example` is allowed — no real values)

Before staging any files for commit: verify none of the above are included. If accidentally staged, remove from staging before committing. A credential committed to git history is permanently compromised — deletion from the latest commit does not remove it from history.

**Rationale:** Version control history is permanent and often accessible to more people than the live codebase. One accidental commit of a real credential requires rotating that credential immediately.

**Pass:**
```
# .gitignore includes all sensitive files
# git status shows only application code and approved docs staged
```

**Fail:**
```
# docs/testing-setup.md staged for commit
# .env file committed with real API keys
# profile.md appears in git history
```

**Enforcement note:** `@recruit` creates `.gitignore` covering all files above during project setup. `@dev` verifies any new files created in a task are covered by `.gitignore` before marking the task done.

---

### SEC-08: Server Action exports are public — minimize the surface

**Constraint:** Every async function exported from a file with `'use server'` at the top becomes a Server Action callable from the client. Action IDs are emitted to `.next/server/server-reference-manifest.json` and referenced from client chunks. There is no module-private convention inside a `'use server'` file. Exactly one `'use server'` file per logical surface, exposing only the intended public entry points. Helpers that must throw or whose timing or error-shape is sensitive go in a separate file WITHOUT the `'use server'` directive (e.g., `lib/auth-internal.ts`).

**Applies to:** any Next.js project using Server Actions.

**Rationale:** A "helper" function colocated with a public Server Action is not private — it is a second public endpoint. Attackers calling it directly via the `Next-Action` header bypass any wrapper the public entry point relied on (timing floor, error catching, constant-time response). Iterative audit loops have shipped exactly this leak.

**Pass:**
```typescript
// app/auth/actions.ts
'use server'
import { attemptMagicLink } from '@/lib/auth-internal' // no 'use server' in this file

export async function signInWithMagicLink(formData: FormData) {
  // wraps the throwing helper with constant-time + uniform response
  await runConstantTime(() => attemptMagicLink(formData))
}
```

**Fail:**
```typescript
// app/auth/actions.ts
'use server'

// Both of these are publicly callable Server Actions.
export async function signInWithMagicLink(formData: FormData) { /* public */ }
export async function attemptMagicLink(formData: FormData) { /* NOT private — leaks */ }
```

**Enforcement note:** After `next build`, inspect `.next/server/server-reference-manifest.json`. It should list only the intended action IDs. If an "internal" helper appears alongside the entry point, the helper is publicly callable — refactor it into a non-`'use server'` module.

---

### SEC-09: Auth flows must be uniform across all observable channels

**Constraint:** "Uniform response" in an auth flow is not just UI text. An auth flow that distinguishes outcomes through any observable channel leaks registration or account state. Uniformity must be enforced across every channel below:

- **UI text:** the user-facing message is identical regardless of outcome.
- **Response body shape:** the wire-level response payload is identical (typically the Server Action returns `void`/`undefined` and never throws to the wire — throwing helpers are wrapped).
- **Response timing:** wall-clock response time is bounded by a constant-time floor (e.g., `MIN_DURATION_MS = 750`). Fast paths pad to the floor; slow paths run over.
- **Server Action surface:** exactly ONE Server Action ID per auth flow (sign-in, sign-out, etc.). Each flow contributes one ID; the union across all flows is the allowlist enforced by `tests/middleware.test.ts` S4. No "internal" helper accidentally exposed (see SEC-08).
- **Response headers:** `Set-Cookie` and other response headers are identical across outcomes. Watch for Supabase SSR PKCE behavior — switch to `flowType: 'implicit'` if the magic-link path does not need PKCE.
- **Status codes:** identical across outcomes.

**Applies to:** any auth flow (magic link, OAuth, password reset, email verification) that branches on email or account state.

**Rationale:** Closing one channel makes the next-quietest the dominant attacker oracle. Spec docs that say "uniform response" without enumerating channels lead to iterative audit loops where each fix introduces the next-layer leak. List the channels in spec acceptance criteria so they are designed for, not patched in.

**Pass:**
```
# Probe with two emails (one registered, one not):
#   UI text          → identical
#   Response body    → both return undefined
#   Timing           → both ≥ 750ms, within ±20ms
#   Action surface   → one action ID in server-reference-manifest.json
#   Set-Cookie       → identical headers
#   Status codes     → both 200
```

**Fail:**
```
# Any of:
#   Registered email → 200 + Set-Cookie: sb-pkce-verifier=...
#   Unregistered     → 200, no Set-Cookie         ← header leak
#   Registered       → 180ms response
#   Unregistered     → 740ms response             ← timing leak
#   Two action IDs in the build manifest          ← surface leak (see SEC-08)
```

**Enforcement note:** Auth flow specs must list the six channels in acceptance criteria. `@security` audit probes the endpoint with two emails (registered + unregistered) and compares all six channels. Any difference is a leak and blocks task completion.

---

## Priority

This file has **highest priority** in the conflict resolution hierarchy:

`security > error-handling > code-quality > documentation`

Any rule in this file overrides conflicting rules in other files. No exceptions.

---

## Enforcement

**Gate 1 — Task completion self-check:** Before marking any task done in `plan.md`, verify the task output meets every SEC constraint that applies. If a constraint is violated, do not mark done — surface the violation.

**Gate 2 — `@code-review` invocation:** `skills/code-review.md` runs all SEC constraints against the reviewed code. Security findings are always flagged, never deferred.

Security findings that are not fixed block task completion. They cannot be deferred as "nice to fix later."

---

## Overrides

Projects may tighten these rules (e.g., requiring field-level encryption in addition to SEC-06). Projects may not loosen them. A project rule that conflicts with a SEC constraint is invalid — the SEC constraint applies.

Domain-specific security rules (HIPAA, PCI-DSS, SOC2) are defined in project-level rules files by `@recruit` and stack on top of this file — they do not replace it.
