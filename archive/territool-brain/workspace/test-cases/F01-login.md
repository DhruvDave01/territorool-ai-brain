---
area: workspace
tags: [brain/workspace]
ref: "Test cases — F01 Login & session (BLOCKER, P0)"
---

# Test cases — F01 Login & session (BLOCKER, P0)

Format: `brain/audits/05-testing.md` §6. Platform **api** = V2 endpoint `POST login`, consumed by the mobile app and the MCP modules (S2.4).

**Contract source:** `repos/web/app/Api/V2/Controllers/AuthController.php` `login()`, routed in `repos/web/routes/api.php` (v2 group). Every handled outcome returns **HTTP 200** with `status` as the **string** `"1"` or `"0"` (web §11), which is why the envelope itself is asserted and not only the values.

**Exact command (from `territool-brain/`):**

```bash
node workspace/test-suites/api-contract/run.js --env staging --only F01
```

Add `--json workspace/test-suites/api-contract/last-run.json` to record a machine-readable run, `--role "Sales Agent"` for one role, `--list` to see the cases without calling staging.

**Environment and safety:** staging only — the runner refuses any other host and refuses to call outside the staging API base. Credentials are read from `.local/test-accounts.md` at run time and never printed (verified by scan, QG-12). No credit-spending, purchase, or delete endpoint is called, and no user is created.

**Disclosed side effect:** a *successful* login INSERTs one row into `usertoken` (device token), so this suite is not purely read-only. Runs use the device token `QA-AUTO-contract` so those rows are identifiable. Nothing is deleted in teardown because the suite has no delete rights.

## Cases

| ID | Flow | Title | Platform | Role | Priority | Type | Preconditions | Test data | Steps | Expected result | Rule / target refs | Known gap | Evidence | Automation | Status | Last run |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-F01-001 | F01 | Sales Agent logs in with valid credentials | api | Sales Agent | P0 | happy | Account Active with a role of Sales Agent | `.local` role "Sales Agent" (never raw) | 1. POST `login` with email + password + device_type + device_token | HTTP 200; `status` "1"; `message` "You have successfully logged-in."; `data.token` a JWT; `data.role` Sales Agent; `subscription_status` active|inactive; `free_trial_status` boolean; `unread_notification_count` integer | M3, S2.4 | — | last-run.json TC-F01-001 (9 assertions) | api: workspace/test-suites/api-contract/cases/F01-login.js | Pass | 2026-09-16 · staging API v2 |
| TC-F01-002 | F01 | Wrong password is rejected without leaking whether the account exists | api | Sales Agent | P0 | negative | Known-good email | `.local` role "Sales Agent" + a literal wrong password | 1. POST `login` with the real email and a wrong password | HTTP 200; `status` "0"; `message` "Please provide valid login details."; `data` `[]`; no token anywhere in the body | W2 | — | last-run.json TC-F01-002 (8 assertions) | api: workspace/test-suites/api-contract/cases/F01-login.js | Pass | 2026-09-16 · staging API v2 |
| TC-F01-003 | F01 | Unknown account gets the same message as a wrong password | api | Public | P0 | security | None | Literal address on `example.invalid` | 1. POST `login` with an address that does not exist | HTTP 200; `status` "0"; `message` identical to TC-F01-002 — no account enumeration | W2 | — | last-run.json TC-F01-003 (8 assertions) | api: workspace/test-suites/api-contract/cases/F01-login.js | Pass | 2026-09-16 · staging API v2 |
| TC-F01-004 | F01 | Missing password is rejected by validation | api | Public | P0 | validation | None | Literal address on `example.invalid` | 1. POST `login` with `email` only | HTTP 200; `status` "0"; `message` "Please provide valid login details." | W2 | — | last-run.json TC-F01-004 (8 assertions) | api: workspace/test-suites/api-contract/cases/F01-login.js | Pass | 2026-09-16 · staging API v2 |
| TC-F01-005 | F01 | Missing email is rejected by validation | api | Public | P0 | validation | None | Literal wrong password | 1. POST `login` with `password` only | HTTP 200; `status` "0"; `message` "Please provide valid login details." | W2 | — | last-run.json TC-F01-005 (8 assertions) | api: workspace/test-suites/api-contract/cases/F01-login.js | Pass | 2026-09-16 · staging API v2 |
| TC-F01-006 | F01 | Business Sales Agent logs in and is always treated as in free trial | api | Business Sales Agent | P0 | happy | BSA account Active under a Manager | `.local` role "Business Sales Agent" | 1. POST `login` with email + password + device_type + device_token | HTTP 200; `status` "1"; `data.role` Business Sales Agent; `free_trial_status` **true** (forced for BSA in AuthController); a JWT is issued | S2.4 | — | last-run.json TC-F01-006 (10 assertions) | api: workspace/test-suites/api-contract/cases/F01-login.js | Pass | 2026-09-16 · staging API v2 |
| TC-F01-007 | F01 | Business Agent (Manager) cannot log in to the mobile API | api | Business Agent | P0 | permission | Manager account exists | `.local` role "Business Agent" | 1. POST `login` with the Manager email + password | HTTP 200; `status` "0"; `message` "You are not authorized to login. Kindly contact administrator."; no token | BT-1, S2.4 | — | last-run.json TC-F01-007 (9 assertions) | api: workspace/test-suites/api-contract/cases/F01-login.js | Pass | 2026-09-16 · staging API v2 |
| TC-F01-008 | F01 | Admin is blocked on the mobile API (BT-1 target behaviour) | api | Admin | P0 | permission | Admin account (read-only use, USER SAID 2026-09-16) | `.local` role "Admin" (never raw) | 1. POST `login` with Admin email + password + device_type + device_token (as the app sends them) | HTTP 200; `status` "0" and no token — Admin refused. **Today the API admits Admin and issues a token** (runtime 2026-09-16), so this is a known gap until BT-1 is built | BT-1 | **BT-1** (API admits Admin) | last-run.json TC-F01-008 | api: workspace/test-suites/api-contract/cases/F01-login.js | Known gap | 2026-09-16 · staging API v2 |
| TC-F01-009 | F01 | A login without a device token fails cleanly, not with an SQL error | api | Sales Agent | P0 | negative | Sales Agent account | `.local` role "Sales Agent" (never raw) | 1. POST `login` with email + password only | A handled failure (HTTP 200 `status` "0", or 4xx) with no SQL text. **Today: HTTP 500 with the `usertoken` insert SQL** (validation does not require `device_token`) | W12, S5.4 | **UI-API-04** | last-run.json TC-F01-009 | api: workspace/test-suites/api-contract/cases/F01-login.js | Known gap | 2026-09-16 · staging API v2 |

## Coverage against the §6 checklist

| Required | Covered | Note |
|---|---|---|
| happy path | ✅ | TC-F01-001, TC-F01-006 |
| validation | ✅ | TC-F01-004, TC-F01-005 |
| permissions per role | ✅ | TC-F01-006/007 pass; TC-F01-008 (Admin) runs and reports the BT-1 known gap (2026-09-16) |
| negative | ✅ | TC-F01-002, plus TC-F01-003 for account enumeration |
| offline / network failure | n/a | dropped by the owner (S3.9) |
| edge data | ❌ | not covered: long/unicode email, oversized password |
| parity | ⚠️ partial | This file is API only. Web `/login` (all four roles, `tools/web-explore.js`) and the mobile login UI (Sales Agent + Business Sales Agent, `workspace/test-suites/mobile/F01-login-main-nav.yaml`) were exercised at runtime on 2026-09-16 (EV-W01–W04, EV-M01, EV-M08) |
| visual | n/a | no UI in this layer |

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (17)

**Documents (7):** [[brain/audits/05-testing|Audit 5 – testing plan]] · [[brain/context/contradiction-register|Contradiction register: where two sources disagreed, and which won]] · [[brain/memory/entries/conflict/20260917-cbaa2f-cr-12-tc-f01-008-f01-test-cases-blocked-no-admin|CR-12 — TC-F01-008 / F01 test cases: "BLOCKED, no Admin password" ↔ the Admin account now exists]] · [[brain/memory/entries/conflict/20260917-245c3b-cr-13-f01-login-md-quotes-intact-f01-login-csv-e|CR-13 — F01-login.md (quotes intact) ↔ F01-login.csv: every " replaced by the text undefined]] · [[workspace/qa-reports/2026-09-16-f01-login-api-contract|F01 QA report — Login & session]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[workspace/tasks/2026-09-16-prove-the-loop-f01|Task brief: prove the loop end to end on F01 (API contract)]]

**Product feature (1):** [[_id/F01|Login & session]]

**Coding rules (6):** [[_id/W2|API status is 1 or 0]] · [[_id/S2.4|Check who uses an API first]] · [[_id/W12|Handle outside services safely]] · [[_id/S5.4|No secrets in logs]] · [[_id/S3.9|Offline mode dropped]] · [[_id/M3|Success only when status is 1]]

**Quality check (1):** [[_id/QG-12|No secrets in the report]]

**Owner decision (1):** [[_id/BT-1|Block Admin on the mobile app]]

**Code file (1):** [[_code/web/app/Api/V2/Controllers/AuthController.php|AuthController]]

%% brain-links:end %%
