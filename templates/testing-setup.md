# Testing Setup: [Project Name]

> Required by `@qa` before browser workflow verification can run.
> Created once per project. This file is gitignored by default — `@recruit` adds it to `.gitignore` at project setup. Never commit credentials.

---

## Local Dev URL

**URL:** `http://localhost:[port]`

---

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Standard user | | |
| Admin user (if applicable) | | |

---

## Third-Party Test Values

| Service | Value | Purpose |
|---------|-------|---------|
| Stripe | `4242 4242 4242 4242` | Successful payment |
| Stripe | `4000 0000 0000 0002` | Declined payment |
| [Other service] | | |

---

## Seed / Reset Instructions

**To seed test data:**
```
[command or steps to populate database with test data]
```

**To reset to clean state:**
```
[command or steps to wipe and re-seed]
```

---

## Known Test Limitations

- [Any flows that cannot be tested in local environment and why]
- [Any third-party services that require special setup]
