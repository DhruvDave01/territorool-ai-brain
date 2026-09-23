---
title: "Validation — three real engineering tasks"
---

# Validation — three real engineering tasks

Ran 2026-09-16 against this Brain + the live repo. Local app servers were down. Playwright MCP browser profile was locked (`Browser is already in use`). Staging login was reachable.

Full flow QA (later the same day): [qa-full-2026-09-16.md](qa-full-2026-09-16.md) — MCP read tools pass; web authenticated chrome blocked; Brain UC/flow/evidence gaps for Maps/Clients/Cron/Team closed in docs. A later execution-readiness recheck is recorded in [qa-recheck-2026-09-16.md](qa-recheck-2026-09-16.md): Manager PHPUnit passes, but the declared Playwright command cannot run on Node 14 and no browser fixture/runtime was available.

Live auth rerun: [qa-auth-run-2026-09-16.md](qa-auth-run-2026-09-16.md) — MAMP PHP 7.4.33 renders the login page; the supplied local QA account was rejected cleanly, so valid-login and authenticated flows remain fixture-blocked.

Authenticated smoke: [qa-authenticated-smoke-2026-09-16.md](qa-authenticated-smoke-2026-09-16.md) — valid local Sales Agent login, dashboard, Find Leads search, lists, and settings render; route list/detail counts conflict and a missing `zipAutocomplete` plugin is logged. Paid/write/admin flows remain intentionally unrun.

Improvements from these tasks were written back into UC-LEAD-save, gotchas, recurring-bugs, verify-ui, important-files.

---

## Task A — Small feature

**Task:** Where is the 1-credit charge for saving an AI lead, and can an agent find it from the Brain alone?

**Starting context:** “Charge 1 credit when a rep saves Find Leads results.” No file path given.

**Information found (Brain):**

- Product rule: save AI lead = 1 credit (`README`, `product/overview.md`)
- UC: [use-cases/UC-LEAD-save.md](../use-cases/UC-LEAD-save.md)
- UI flow: FLOW-FIND-LEADS
- Files listed: `Helper::saveAILead` in `app/Helpers/helpers.php`, `AILeadFinderController@saveLeads`, V2 `saveAILeads`, `LeadsTools`

**Files identified (then verified in code):**

- `app/Helpers/helpers.php` — `Helper::saveAILead` (~1143): credit check then `used_credit += $insertedCompanyCount`
- `app/Http/Controllers/AILeadFinderController.php` — `saveLeads` delegates to Helper
- `app/Api/V2/Controllers/CompanyController.php` — `saveAILeads`
- `app/Http/Controllers/CompanylController.php` — `saveAILeads`
- `app/UserMcp/Services/Tools/LeadsTools.php` — `saveAiLeads`

**Use case:** UC-LEAD save path. **UI flow:** FLOW-FIND-LEADS.

**Tools required:** repo grep/read only (no running app needed for locate).

**Missing information (Brain before this pass):**

- BSA error string is `please contact to manager`, not the SA subscribe string
- `skipCreditBilling` option
- Package id 1 cap of 60 selected leads
- Bare `return;` when SA has no enabled subscription

**Incorrect information:** none on the primary location. Credit is charged per **inserted** count after the loop, not blindly per request count (check uses `count($companiesData)` up front).

**Outcome:** **Pass.** An agent following the Brain lands in the correct helper within one hop.

**Improvements made:** expanded failure modes on UC-LEAD-save.md.

---

## Task B — Real bug

**Task:** Reproduce/trace `ReferenceError: AuthUser is not defined` (listed in Brain learnings and `bug-repro-runbook.md`).

**Starting context:** console dumps in `.playwright-mcp/`.

**Information found:**

- Recurring-bugs pointed at login + Playwright logs
- FLOW-AUTH noted the same error
- Logs name the exact script: `http://127.0.0.1:8000/vendor/adminlte/dist/js/custom_picwa.js` line 24
- `login.blade.php` `@extends('front.layout')`
- `front.layout` defines `var AuthUser` only inside `@if(Auth::user())`
- `custom_picwa.js` line 24: `if(!AuthUser) { ... return false; }` — ReferenceError for guests
- Staging login HTML (2026-09-16): `custom_picwa.js` present, `var AuthUser` **absent** — bug still live

**Files identified:**

- `public/vendor/adminlte/dist/js/custom_picwa.js`
- `resources/views/front/layout.blade.php`
- `resources/views/auth/login.blade.php`

**Use case:** UC-AUTH-01 (guest). **UI flow:** FLOW-AUTH.

**Tools required:** Brain + source + staging HTML. Playwright MCP blocked; local server down. Reproduction is still evidenced by historical consoles + current staging HTML.

**Missing information:** Brain did not originally name `custom_picwa.js`.

**Incorrect information:** logs are not login-only; `/register` hits the same error.

**Outcome:** **Pass** for locate/root-cause. **Partial** for live browser reproduce this session.

**Improvements made:** recurring-bugs + gotchas + important-files.

**Fix (not applied — this phase does not change product behavior):** initialize `var AuthUser = null` on guest layouts, or wrap `custom_picwa.js` with `typeof AuthUser !== 'undefined'`.

---

## Task C — UI workflow

**Task:** Can the Brain tell an agent how to execute and verify FLOW-AUTH / Find Leads?

**Starting context:** [ui-flows/README.md](../ui-flows/README.md) + [skills/verify-ui.md](../skills/verify-ui.md).

**Information found:** start `/login`, local vs MAMP vs staging URLs, Playwright MCP vs Test.

**Execution this session:**

| Check | Result |
|-------|--------|
| `curl 127.0.0.1:8000/login` | fail (000) — `artisan serve` not running |
| `curl localhost:8888/webterritool/login` | fail (000) — MAMP not serving |
| Playwright MCP `browser_navigate` | fail — browser profile in use |
| `curl https://staging.territool.com/login` | **200**, title `TerriTool`, Sign In + email/password fields, Register present |

**Use case:** UC-AUTH-01. **UI flow:** FLOW-AUTH (starting point only).

**Tools required:** Playwright MCP (blocked), curl as substitute, staging.

**Missing information:** Brain did not document MCP “browser already in use”. No fixture credentials in repo (expected). Could not log in or reach Find Leads without a user.

**Incorrect information:** none on the flow shape. Local URL is documented as optional; this run proved both local options can be down simultaneously.

**Outcome:** **Partial pass.** The Brain’s verify-ui strategy is correct, but this session could only prove the **guest login page** on staging, not an authenticated Find Leads save. That limitation is now documented.

**Improvements made:** verify-ui environment failures; gotchas for Playwright profile lock.

---

## Score

| Task | Locate code | Right UC/flow | Execute | Brain quality after |
|------|-------------|---------------|---------|---------------------|
| A Save-lead credits | Yes | Yes | N/A (static) | Stronger failure modes |
| B AuthUser | Yes | Yes | HTML-level on staging | Named the JS file |
| C Login UI | Yes | Yes | Staging GET only | Env caveats |

The Brain is usable for investigation and planning. It is **not** yet sufficient for unattended UI verification without (1) a running local or staging session, (2) a test user, (3) a free Playwright MCP browser.

---

## Task D — Wire execution (2026-09-16, later)

**Task:** Connect the Brain to actual agent execution (Cursor rules/skills, protocol, learn-by-running).

**Ran:**

| Check | Result |
|-------|--------|
| `php -v` | 7.4.33 |
| `vendor/bin/phpunit --filter Manager` | 17 tests, 51 assertions, OK |
| `vendor/bin/phpunit` | 18 tests, 1 failure — `ExampleTest` login 500, MySQL connection refused |
| `curl 127.0.0.1:8000/login` | 000 |
| `curl localhost:8888/webterritool/login` | 000 |
| `curl https://staging.territool.com/login` | 200 |
| Playwright MCP navigate | fail — `Browser is already in use ... mcp-chrome-e7b663f` |

**Brain updates from this run:** `code/testing.md`, `learnings/gotchas.md`, `learnings/failed-approaches.md`, `learnings/successful-patterns.md`, Cursor wiring files.

**Outcome:** Execution layer is in the repo. Unattended UI still blocked (no local app, no fixture user, Playwright profile lock).
