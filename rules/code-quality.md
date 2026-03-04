# Rules: Code Quality

> **Conflict Resolution Hierarchy — defined here, applied everywhere:**
>
> `security > error-handling > code-quality > documentation`
>
> When rules from different files conflict, higher priority wins without exception. This hierarchy is the single source of truth. All rules files reference this file for conflict resolution.

---

## Constraints

---

### CQ-01: Function length limit

**Constraint:** Functions must not exceed 50 lines. If a function exceeds 50 lines, split it into named sub-functions with clear single responsibilities. Security and validation functions may extend to 80 lines maximum — no further.

**Rationale:** Long functions hide complexity, resist testing, and make bugs harder to isolate. A function that does one thing is testable; a function that does five things is not.

**Pass:**
```typescript
function processOrder(order: Order) {
  validateOrder(order);        // named sub-function
  const total = calculateTotal(order);  // named sub-function
  return saveOrder(order, total);  // named sub-function
}

function validateOrder(order: Order) { /* < 50 lines */ }
function calculateTotal(order: Order) { /* < 50 lines */ }
function saveOrder(order: Order, total: number) { /* < 50 lines */ }
```

**Fail:**
```typescript
function processOrder(order) {
  // 80 lines of inline validation, calculation, and saving mixed together
}
```

---

### CQ-02: File length limit

**Constraint:** Service files must not exceed 300 lines. Component files must not exceed 200 lines. If a file exceeds its limit, split it into focused modules with clear single responsibilities. Each module exports one primary concern.

**Rationale:** Large files signal that a module is doing too many things. Splitting forces clarity on what each unit of code is responsible for.

**Pass:**
```
src/
  services/
    auth.service.ts         // 180 lines — token generation, validation
    auth.session.ts         // 140 lines — session management
    auth.password.ts        // 90 lines — hashing, reset flow
```

**Fail:**
```
src/
  services/
    auth.service.ts         // 420 lines — everything auth-related in one file
```

---

### CQ-03: Single responsibility per module

**Constraint:** Each file must have one primary reason to change. If a file would need to change for two different reasons (e.g., a change to database schema AND a change to business logic), it is doing two jobs and must be split. Name each file by what it is responsible for — the name must accurately describe its single purpose.

**Rationale:** Modules that mix concerns become tightly coupled. When concerns change independently, mixed modules force unnecessary changes and introduce regression risk.

**Pass:**
```
user.repository.ts    // only changes when data access logic changes
user.service.ts       // only changes when user business logic changes
user.controller.ts    // only changes when HTTP interface changes
```

**Fail:**
```
user.ts              // handles HTTP, business logic, and database — changes for all three reasons
```

---

### CQ-04: No hardcoded configuration values

**Constraint:** Values that may differ between environments (URLs, ports, timeouts, feature flags, limits, thresholds) must not be hardcoded in source code. They must be loaded from environment variables, a configuration file, or constants defined in a dedicated config module. Magic numbers must be named constants with a comment explaining the value.

**Rationale:** Hardcoded config values make environment changes require code changes, which increases risk and forces re-deployment for operational adjustments.

**Pass:**
```typescript
// config.ts
export const MAX_RETRIES = 3; // max retries before circuit break
export const REQUEST_TIMEOUT_MS = parseInt(process.env.REQUEST_TIMEOUT_MS ?? "5000");
```

**Fail:**
```typescript
// Scattered magic numbers
if (retries > 3) { /* why 3? */ }
setTimeout(fn, 5000); // why 5000?
fetch(`https://api.example.com/v1/...`) // hardcoded URL
```

---

### CQ-05: No dead code, no debug artifacts

**Constraint:** Committed code must contain no: commented-out code blocks, `console.log` / `print` debug statements (unless explicitly part of a CLI tool's intended output), unused variables, unused imports, unused function parameters, or `TODO` comments older than the current session. Remove them or file a task to address them — do not commit them.

**Rationale:** Dead code and debug artifacts obscure intent, confuse future readers, and indicate incomplete work. If it matters, it ships. If it doesn't ship, it doesn't exist in the codebase.

**Pass:**
```typescript
import { createUser } from "./user.service"; // used
export async function registerHandler(req, res) { /* clean, no debug logs */ }
```

**Fail:**
```typescript
import { createUser, deleteUser } from "./user.service"; // deleteUser never used
// const old = await legacyCreateUser(data); // old approach, commented out
console.log("DEBUG req body:", req.body); // debug log left in
export async function registerHandler(req, res) { ... }
```

---

### CQ-06: Explicit naming — no abbreviations, no ambiguity

**Constraint:** Variable, function, class, and file names must be explicit and descriptive. Single-letter variables are allowed only in loop indices (`i`, `j`) and mathematical formulas where convention demands it. Abbreviations are prohibited unless the abbreviated form is universally understood in the domain (e.g., `url`, `id`, `api`, `http`). Boolean variables and functions must start with `is`, `has`, `can`, or `should`.

**Rationale:** Ambiguous names require the reader to hold context in their head. Explicit names make code self-documenting without comments.

**Pass:**
```typescript
const isUserAuthenticated = checkAuthToken(token);
const activeSubscriptions = await fetchSubscriptionsByStatus("active");
function calculateMonthlyRevenue(transactions: Transaction[]): number { }
```

**Fail:**
```typescript
const auth = checkTok(t);      // abbreviations
const subs = getSubs("active"); // ambiguous
function calcRev(txs) { }       // unclear abbreviations
const flag = true;              // non-descriptive boolean
```

---

### CQ-07: DRY — No duplicated logic

**Constraint:** Logic that appears in two or more places must be extracted into a named, shared function or module. Copy-pasted code with minor variations is a violation. When logic is used once, inline is acceptable. When used twice or more, extract.

**Rationale:** Duplicated logic means bugs must be fixed in multiple places and behavior diverges silently when one copy is updated and the other isn't.

**Pass:**
```typescript
// shared utility used in two places
function formatCurrency(amount: number, currency: string): string { ... }

const displayPrice = formatCurrency(order.total, order.currency);
const displayRefund = formatCurrency(refund.amount, refund.currency);
```

**Fail:**
```typescript
// same logic copy-pasted
const displayPrice = `${order.currency} ${order.total.toFixed(2)}`;
const displayRefund = `${refund.currency} ${refund.amount.toFixed(2)}`;
```

---

### CQ-08: Algorithmic efficiency — no unnecessary work

**Constraint:** Code must not perform unnecessary computation. Specifically:
- No nested loops where a single pass or a lookup structure achieves the same result
- No repeated computation of the same value — compute once, store in a named variable
- No fetching data that is not used
- Prefer built-in language and framework methods over manual re-implementations

**Rationale:** Inefficient algorithms compound at scale. Unnecessary work at the code level is a design decision, not an optimization — it should be caught before it ships.

**Pass:**
```typescript
// O(n) lookup with a Map instead of O(n²) nested find
const userMap = new Map(users.map(u => [u.id, u]));
const enriched = orders.map(o => ({ ...o, user: userMap.get(o.userId) }));
```

**Fail:**
```typescript
// O(n²) — find() inside a map
const enriched = orders.map(o => ({
  ...o,
  user: users.find(u => u.id === o.userId) // scans full array per order
}));
```

---

## Priority

This file is **third** in the conflict resolution hierarchy:

`security > error-handling > code-quality > documentation`

Rules in `security.md` and `error-handling.md` override rules in this file when they conflict. Rules in this file override rules in `documentation-standards.md`.

---

## Enforcement

**Gate 1 — Task completion self-check:** Before marking any task done in `plan.md`, verify the task output meets every CQ constraint that applies. If a constraint is violated, do not mark done — surface the violation.

**Gate 2 — `@code-review` invocation:** `skills/code-review.md` runs all CQ constraints against the reviewed code. CQ findings are reported and must be addressed before the review passes.

---

## Overrides

Projects may tighten these rules (e.g., stricter file length limits for a performance-critical service). Projects may not loosen the core limits (function < 50 lines, file < 300/200 lines) unless a specific, documented technical constraint requires it — and the override must be noted in `docs/constraints.md`.
