---
title: "QA — FLOW-AUTH live browser run (2026-09-16)"
---

# QA — FLOW-AUTH live browser run (2026-09-16)

QA loop: [../loops/qa-loop.md](../loops/qa-loop.md). **Superseded local QA URL:** use `http://127.0.0.1:8000/login` going forward — not this MAMP `/public` path ([../memory/local-qa-url-artisan-serve.md](../memory/local-qa-url-artisan-serve.md)).

This run used: MAMP, Apache, PHP **7.4.33**, `http://localhost:8888/webterritool/public/index.php/login`.

| Field | Value |
|---|---|
| Flow / UC | FLOW-AUTH / UC-AUTH-01 |
| Role / URL | Guest / local login |
| Steps run | Opened the login screen; submitted the user-supplied non-production QA credentials once. |
| Expected | Login form renders; valid credentials redirect to the role-appropriate home; invalid credentials show a form error and retain the email. |
| Actual | The login form rendered under PHP 7.4.33. Submission stayed on login, retained the email, and displayed `These credentials do not match our records.` No password is recorded in this report. |
| Credits before → after | n/a |
| Console / network | Laravel Debugbar is visible locally; this is a local debug configuration observation, not production evidence. |
| Result | **pass** for guest render and invalid-credentials handling; **blocked (fixture)** for the valid-login redirect and all authenticated flows. |

## Evidence and implications

- The PHP 8.2 compatibility blocker in [qa-recheck-2026-09-16.md](qa-recheck-2026-09-16.md) is resolved when MAMP uses PHP 7.4.33.
- A read-only local database check confirmed that the supplied QA email exists, while a password-hash verification did **not** match the supplied password. Treat this as a fixture/credential mismatch, not a product authentication failure; do not repeatedly retry or reset the account without direction. No credential values are recorded here.
- A valid local Sales Agent and Business Agent fixture are still required to complete the QA smoke set. Any flow that saves leads, buys contacts, creates routes, uploads data, sends tickets, or changes team state remains unrun to avoid unintended writes or credit consumption.
