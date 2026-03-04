# Rules: Error Handling

> **Priority in conflict:** Error handling is second in the hierarchy. When rules in this file conflict with `code-quality.md` or `documentation-standards.md`, error-handling takes precedence. When rules in this file conflict with `security.md`, security takes precedence.
>
> Full hierarchy: `security > error-handling > code-quality > documentation`. See `rules/code-quality.md`.

---

## Constraints

---

### EH-01: Fail loud — errors must surface, never disappear

**Constraint:** Errors must never be silently swallowed. Every caught error must be either (a) handled visibly — with a user-facing message and/or a log entry — or (b) re-thrown so it surfaces to the caller. Empty catch blocks are prohibited. Catch blocks that only log without re-throwing or responding are acceptable only at the top-level error boundary (e.g., express error middleware, top-level async handler).

**Rationale:** Silent errors produce systems that fail in invisible ways. Debugging a silent failure requires reconstructing what went wrong — which is often impossible without the original error.

**Pass:**
```typescript
try {
  await sendEmail(user.email, template);
} catch (error) {
  logger.error("Failed to send welcome email", { userId: user.id, error });
  throw new ServiceError("Email delivery failed", { cause: error }); // re-thrown
}
```

```typescript
// At top-level boundary only — catch and respond, do not re-throw
app.use((error, req, res, next) => {
  logger.error("Unhandled request error", { path: req.path, error });
  res.status(500).json({ error: "Internal server error" });
});
```

**Fail:**
```typescript
try {
  await sendEmail(user.email, template);
} catch (error) {
  // empty — error disappears
}
```

```typescript
try {
  result = await riskyOperation();
} catch {
  result = null; // silent failure with a fallback that hides the problem
}
```

---

### EH-02: Errors must include context — what, where, and inputs

**Constraint:** Every error must include: (1) what operation failed, (2) what inputs were involved (sanitized — no passwords, no tokens), (3) where in the code it failed (use structured logging, not just a message string). Error messages must be actionable — a developer reading the log should know what to look at without running the code again.

**Rationale:** An error message of "something went wrong" has zero diagnostic value. An error with context can be traced and fixed without reproducing the failure.

**Pass:**
```typescript
logger.error("Payment processing failed", {
  operation: "stripe.charges.create",
  userId: user.id,
  amount: charge.amount,
  currency: charge.currency,
  stripeErrorCode: error.code,
  stripeMessage: error.message,
});
```

**Fail:**
```typescript
logger.error("Payment failed"); // no context — what payment? what user? what amount?
console.log(error); // raw error dump — may include sensitive data, no structure
```

---

### EH-03: Log all failures with stack traces

**Constraint:** Every caught exception must be logged with its full stack trace. The stack trace must be included as a structured field in the log entry — not just the error message. Logging frameworks must be configured to capture and persist stack traces.

**Rationale:** Error messages tell you what broke. Stack traces tell you where and how. Without a stack trace, root cause analysis on production failures requires guesswork.

**Pass:**
```typescript
// Using a structured logger (e.g., pino, winston)
logger.error("Database connection failed", {
  error: {
    message: error.message,
    stack: error.stack,
    name: error.name,
  },
  database: config.db.host,
});
```

**Fail:**
```typescript
logger.error(error.message); // message only — no stack trace
console.error("DB error:", error.message); // console log, no stack, not structured
```

---

### EH-04: User-facing errors are concise; internal errors are detailed

**Constraint:** Error responses sent to clients (HTTP responses, UI error messages) must be brief, clear, and actionable — they must not include stack traces, internal error codes, database messages, or system internals. The internal log entry for the same error must include full detail. Both must always exist — a detailed internal log and a clean client response.

**Rationale:** Exposing internals to clients is a security risk (SEC-05). Showing only a clean client error without internal logging makes debugging impossible. Both requirements must be met simultaneously.

**Pass:**
```typescript
// Client receives only what they need
res.status(422).json({
  error: "Invalid email address",
  field: "email"
});

// Internal log has full context — field name logged, not the value (SEC-05: email is PII)
logger.warn("Validation failure on registration", {
  field: "email",
  valueProvided: !!req.body.email, // presence only, not the actual value
  userId: null,
  ip: req.ip,
});
```

**Fail:**
```typescript
// Stack trace exposed to client
res.status(500).json({ error: err.message, stack: err.stack });

// Or client gets clean error but nothing is logged
res.status(400).json({ error: "Bad request" }); // no log — invisible failure
```

---

### EH-05: Define and use custom error types for distinct failure modes

**Constraint:** Each distinct failure mode that requires different handling must have its own named error class or error code. Do not use generic `Error` for all failures and pattern-match on message strings. Custom errors must extend the base `Error` class and include a descriptive name and any relevant context fields.

**Rationale:** Generic errors force callers to parse strings to determine what went wrong — which is brittle and breaks silently when messages change. Named errors are self-documenting and enable reliable programmatic handling.

**Pass:**
```typescript
class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} not found: ${id}`);
    this.name = "NotFoundError";
    this.resource = resource;
    this.id = id;
  }
}

class ValidationError extends Error {
  constructor(field: string, reason: string) {
    super(`Validation failed: ${field} — ${reason}`);
    this.name = "ValidationError";
    this.field = field;
  }
}

// Caller can handle reliably
if (error instanceof NotFoundError) { res.status(404)... }
if (error instanceof ValidationError) { res.status(422)... }
```

**Fail:**
```typescript
throw new Error("not found"); // caller must string-match
throw new Error("validation failed: email"); // brittle
```

---

## Priority

This file is **second** in the conflict resolution hierarchy:

`security > error-handling > code-quality > documentation`

Rules in `security.md` override rules in this file. Rules in this file override rules in `code-quality.md` and `documentation-standards.md`.

**Specific conflict note:** EH-02 requires logging error inputs. SEC-05 prohibits logging sensitive data. When both apply, SEC-05 takes precedence: log the inputs except any that are sensitive (passwords, tokens, full card numbers, SSNs). Log that sensitive fields were present but do not log their values.

---

## Enforcement

**Gate 1 — Task completion self-check:** Before marking any task done in `plan.md`, verify the task output meets every EH constraint that applies. Check specifically for empty catch blocks (EH-01), context-free error logging (EH-02), and missing stack traces (EH-03). If a constraint is violated, do not mark done — surface the violation.

**Gate 2 — `@code-review` invocation:** `skills/code-review.md` runs all EH constraints against the reviewed code. EH findings are reported and must be addressed before the review passes.

---

## Overrides

Projects may add additional requirements (e.g., all errors must also be sent to an external error tracking service). Projects may not remove or weaken EH constraints — in particular, EH-01 (no silent failures) and EH-03 (stack traces) are non-negotiable.
