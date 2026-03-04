# Rules: Testing Standards

> **Priority in conflict:** Testing standards are treated as part of code-quality. When rules in this file conflict with `security.md` or `error-handling.md`, those files take precedence.
>
> Full hierarchy: `security > error-handling > code-quality > documentation`. See `rules/code-quality.md`.

---

## Constraints

---

### TS-01: Minimum coverage per function

**Constraint:** Every function that contains business logic must have a minimum of (1) one test for the happy path and (1) one test for a failure or error case. Functions that are purely delegation (pass-through wrappers with no logic) are exempt. Functions that handle auth, payments, or user data require a minimum of two error case tests.

**Rationale:** A function with no tests can break silently. A function with only a happy path test hides failure mode bugs until production.

**Pass:**
```typescript
describe("createUser", () => {
  it("creates a user when email is valid and unique", async () => { /* happy path */ });
  it("throws ValidationError when email is invalid", async () => { /* error case */ });
});

describe("processPayment", () => {
  it("processes payment when card is valid", async () => { /* happy path */ });
  it("throws PaymentError when card is declined", async () => { /* error case 1 */ });
  it("throws PaymentError when amount exceeds limit", async () => { /* error case 2 */ });
  // (payment function requires 2 error case tests)
});
```

**Fail:**
```typescript
describe("createUser", () => {
  it("creates a user", async () => { /* happy path only */ });
  // missing error case
});
```

---

### TS-02: Test naming must state behavior, not implementation

**Constraint:** Test names must describe the behavior being verified in plain language. Format: `[function or component] [does X] when [condition]`. Test names must not reference implementation details (variable names, method internals, line numbers). A developer who hasn't read the source code must be able to understand what the test verifies from its name alone.

**Rationale:** Tests named by implementation break when refactoring even if behavior is preserved. Tests named by behavior document the spec and survive refactoring.

**Pass:**
```
"creates a user when email is valid and unique"
"throws ValidationError when email format is invalid"
"returns empty array when no active subscriptions exist"
"redirects to login when user is not authenticated"
```

**Fail:**
```
"test 1"
"happy path"
"createUser works"
"checks the email regex"        // implementation detail
"line 47 validation branch"     // implementation detail
```

---

### TS-03: Tests must not depend on external services in unit tests

**Constraint:** Unit tests must mock or stub all external dependencies: databases, APIs, file systems, email services, payment processors. Unit tests must run without a network connection. Integration tests may use real external services or test environments — but must be clearly separated from unit tests and must not be run as part of the standard unit test command.

**Rationale:** Unit tests that hit real external services are slow, flaky, and environment-dependent. They fail for infrastructure reasons, not code reasons — which erodes trust in the test suite.

**Pass:**
```typescript
// Unit test — database mocked
jest.mock("./user.repository");
const mockFindUser = userRepository.findByEmail as jest.Mock;
mockFindUser.mockResolvedValue(null); // email not found
await expect(createUser(data)).rejects.toThrow(ValidationError);
```

**Fail:**
```typescript
// Unit test hitting real database
it("creates a user", async () => {
  await db.connect(); // real connection — slow, flaky, environment-dependent
  const user = await createUser(data);
  expect(user.id).toBeDefined();
});
```

---

### TS-04: Critical paths always get tested

**Constraint:** The following always require tests, regardless of project type or timeline pressure: (1) authentication flows — sign up, login, logout, token refresh, session expiry; (2) payment flows — creation, failure handling, webhook processing; (3) data write operations — create, update, delete; (4) access control — verify that protected resources reject unauthorized access. These are non-negotiable. Shipping any of these without tests is a blocker.

**Rationale:** These are the paths where failure causes the most damage: security breaches, data loss, financial errors. They also tend to be the most complex with the most edge cases.

**Pass:**
```typescript
describe("auth: login flow", () => {
  it("issues JWT on valid credentials");
  it("rejects on invalid password");
  it("rejects on nonexistent email");
  it("blocks after 5 failed attempts");
});

describe("access control: document endpoint", () => {
  it("returns document when user is owner");
  it("returns 403 when user is not owner");
  it("returns 401 when user is not authenticated");
});
```

**Fail:**
```
"Auth is tested manually, it works."
// No tests committed for auth or payment flows
```

---

### TS-05: Tests must be isolated — no shared state between tests

**Constraint:** Each test must set up its own preconditions and clean up after itself. Tests must not rely on execution order. Tests must not share mutable state (global variables, database records created by a previous test, module-level objects modified by one test and read by another). Use `beforeEach`/`afterEach` for setup and teardown.

**Rationale:** Tests that depend on execution order fail intermittently when the order changes (parallel execution, test runner updates). Shared state makes failures impossible to isolate.

**Pass:**
```typescript
describe("processOrder", () => {
  let mockDb;
  beforeEach(() => {
    mockDb = createMockDb(); // fresh mock for each test
  });
  afterEach(() => {
    jest.clearAllMocks(); // clean up
  });
  it("saves order when valid", async () => { /* uses mockDb, no shared state */ });
  it("throws when total is zero", async () => { /* uses fresh mockDb */ });
});
```

**Fail:**
```typescript
let savedOrderId; // shared mutable state
it("creates order", async () => {
  savedOrderId = await createOrder(data); // sets shared state
});
it("retrieves order", async () => {
  const order = await getOrder(savedOrderId); // depends on previous test
});
```

---

## What Always Gets Tested (summary)

- Auth flows (sign up, login, logout, token refresh, session expiry)
- Payment flows (creation, failure, webhook processing)
- All data write operations (create, update, delete)
- Access control on every protected resource
- Every function containing business logic: 1 happy path + 1 error case minimum

## What Is Exempt from Unit Testing

- Pure delegation wrappers (pass-through functions with zero logic)
- Framework boilerplate (e.g., standard Express router setup with no custom logic)
- Simple config file exports (no logic, just values)

---

## Priority

This file is treated as part of code-quality in the conflict resolution hierarchy:

`security > error-handling > code-quality > documentation`

---

## Enforcement

**Gate 1 — Task completion self-check:** Before marking any task done in `plan.md`, verify that all required tests for that task exist and pass. For tasks involving auth, payments, or data writes, verify TS-04 requirements are met. A task is not done until its tests pass.

**Gate 2 — `@code-review` invocation:** `skills/code-review.md` checks TS constraints. Missing critical path tests are a review blocker.

**`@write-tests` skill:** Use `@write-tests unit [target]` or `@write-tests integration [target]` to generate tests. The skill enforces this file.

---

## Overrides

Projects may require higher coverage minimums (e.g., 2 error case tests for all functions, not just auth/payments). Projects may use different test runners (pytest, vitest, mocha) — these constraints apply regardless of tooling. Projects may not lower the critical path testing requirements in TS-04.
