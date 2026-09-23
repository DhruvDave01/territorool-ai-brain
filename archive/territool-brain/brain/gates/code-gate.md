---
area: gates
tags: [brain/gates]
ref: "Checklist – code"
---

# Code Gate

Run by `territool-code` (post-flight) and re-checked by `territool-qa`. Every item is objectively checkable.

Check types:
- **AUTO** = reported by `node brain/gates/scripts/static-checks.js --repo <mobile|web>` (added lines only).
- **CMD** = run the command.
- **REVIEW** = inspect the diff against the named rule and record the evidence line.

**Result per item:** PASS / FAIL / N/A, each with evidence (file:line or command output). **The gate passes only if no item is FAIL.**

## A. Scope and safety (all changes)

| ID | Check | Type | Pass criterion |
|---|---|---|---|
| CG-A1 | Diff touches only files needed for the task; no reformatting/refactoring of unrelated old code (S0.2) | REVIEW | every hunk maps to a task requirement or the fork rule |
| CG-A2 | No production URL or production config switch added (S0.1) | AUTO `S-prod` | 0 findings |
| CG-A3 | No secrets/credentials/test accounts/staff emails added (M17, W15, S0.4) | AUTO `M17` / `W15-secret` | 0 findings |
| CG-A4 | No commit/push/merge performed unless the user asked in this task (S0.3) | REVIEW | `git log` unchanged or user request quoted |
| CG-A5 | API V1 untouched (S0.6) | AUTO `W1` | 0 findings |
| CG-A6 | Fork families: the task's fix applied to all copies (S5.2) | REVIEW | list of copies + hunks |
| CG-A7 | "Searched before creating": change summary names existing modules checked (M10, W7) | REVIEW | summary present |
| CG-A8 | Glossary terms in new user-facing copy (S1.1) | AUTO `S-glossary` (warn) + REVIEW | no "Waypoint", "Business Client", "notes" (for activities), "Salesperson/Manager" as role names in new copy |
| CG-A9 | **Credits and money side effects** (grants, deductions, rewards, refunds): the rule exists in `conventions-shared.md` S3 or the owner approval is quoted; the same event can't apply twice (idempotency key or consumed flag); a missing balance row is handled (no silent no-op); covered by a test | REVIEW + CMD (test) | all four shown with file:line (added Phase 7: referral reward retrospective) |
| CG-A10 | **Copy matches behaviour:** user-facing text claims only what the code does ("sent" only if something is sent; "saved" only after `status 1`) | REVIEW | each success/error string traced to the code path (added Phase 7) |
| CG-A11 | **No orphans from this change** (S5.7): every import, variable, function or constant the change left unused is removed. Pre-existing dead code is listed in the change summary, **not** deleted | REVIEW | `no-unused-vars` on added lines — note ESLint reports it at **warn** level here, so `static-checks.js` will not FAIL on it; check it by eye |

## B. Mobile (`repos/mobile`)

| ID | Rule | Type | Pass criterion |
|---|---|---|---|
| CG-M1 | New components are function components | AUTO `M1` | 0 FAIL |
| CG-M2 | No raw `fetch(` in components; endpoints via `App/config/index.js` constants | AUTO `M2` + REVIEW | 0 findings |
| CG-M3 | Success tested only as `status == 1`; FormData + `{ navigation }` | REVIEW | each new API call matches the canonical example |
| CG-M4 | Every new API call: `.catch` with `captureSentryError` + `.finally` resetting flags | REVIEW | each call listed with its handlers |
| CG-M5 | No new `logout()` in error handlers | AUTO `M5` + REVIEW | 0 new calls outside explicit sign-out |
| CG-M6 | No empty catch in components | AUTO `M6` | 0 findings |
| CG-M7 | Loading / refreshing / empty / error states present for data screens | REVIEW | each state named in JSX |
| CG-M8 | No hardcoded colours / font sizes in new lines | AUTO `M8-color`, `M8-fontsize` | 0 FAIL |
| CG-M9 | Styles in `*.styles.js`; inline only for render-time values | AUTO `M9` (warn) + REVIEW | warnings justified |
| CG-M12 | Semantic testIDs on new screens/interactive elements; no order-based IDs | CMD `node scripts/audit-missing-testids.js` + REVIEW | no new missing IDs in changed files |
| CG-M13 | Screen registration PascalCase + lazy | REVIEW | — |
| CG-M14 | `Global.js` not extended | AUTO `M14` | 0 findings |
| CG-M15 | Stale-response guard for overlapping requests | REVIEW | signal/request id present where applicable |
| CG-M16 | No bodies/passwords/tokens in telemetry | AUTO `M16` | 0 findings |
| CG-M18 | No undeclared or duplicate-purpose dependencies; new deps approved | REVIEW `package.json` diff | approval quoted |
| CG-M19 | No new ESLint errors on added lines | AUTO `M19` | 0 findings |

## C. Web (`repos/web`)

| ID | Rule | Type | Pass criterion |
|---|---|---|---|
| CG-W1 | New API routes in `v2` + `jwt.refresh` (unless public by design) | REVIEW `routes/api.php` diff | placement correct |
| CG-W2 | Envelope int `status` 1/0 | AUTO `W2` | 0 FAIL |
| CG-W3 | Validation first; casts/clamps; no raw input to limit/Raw | REVIEW | validator shown for each new action |
| CG-W4 | No string-built SQL | AUTO `W4` | 0 findings |
| CG-W5 | Queries scoped to the user / team | REVIEW | ownership predicate per query |
| CG-W6 | `\Auth::user()`; no JWT parsing in controllers | AUTO `W6` | 0 findings |
| CG-W7 | No new methods in frozen files; no web controller in API layer; logic in `app/Services` | AUTO `W7-frozen`, `W7-layer` + REVIEW | 0 findings |
| CG-W8 | New services have DB-free PHPUnit tests that pass | CMD `vendor/bin/phpunit tests/<Name>Test.php` | green |
| CG-W9 | V2 changes additive; consumers listed | REVIEW + API contract suite | no removed/renamed fields |
| CG-W10 | Bounded lists | REVIEW | limit + max present |
| CG-W11 | No query in loops; **no unbounded full-table load into PHP for a lookup** (e.g. `User::whereNotNull('phone')->get()` then loop). Match in SQL on a normalised/indexed column or bounded query | REVIEW | each new query shows its `where` + bound (added Phase 7) |
| CG-W12 | **External provider calls** (cURL, Guzzle, SDK): timeout set; wrapped in try/catch (`\Throwable`); defined fallback result; reported via log/Sentry **without** keys or bodies; behaviour when the key is **missing** is defined; the caller shows a user-safe state | REVIEW + test (TG-4 provider failure) | all six shown per call (tightened Phase 7: `fe1cfde2` production error) |
| CG-W13 | No request bodies/secrets in logs | AUTO `W13` | 0 findings |
| CG-W14 | No debug output | AUTO `W14` | 0 findings |
| CG-W15 | `env()` only in config; no key literals | AUTO `W15-env`, `W15-secret` | 0 findings |
| CG-W16 | Reversible migrations only; not run on production | REVIEW | `down()` present |
| CG-W17 | PHP 7.4 / Laravel 5.3 compatible | AUTO `W17` + CMD `php -l` (run by static-checks) | 0 findings; syntax OK |
| CG-W18 | Web routes in the right group | REVIEW `routes/web.php` diff | — |
| CG-W19 | No new inline `<script>`/`<style>` in Blade; portal bundle rebuilt with source | AUTO `W19` + REVIEW | 0 findings |
| CG-W20 | MCP tools reuse V2 via `CustomerApiClient` | REVIEW | — |

## D. Evidence to attach

1. Output of `static-checks.js` (Markdown table).
2. List of consumers for any V2 change (S2.4).
3. For each REVIEW item: file:line or a short quote.

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (90)

**Documents (10):** [[brain/audits/07-validation|Audit 7 – proving the brain works]] · [[brain/audits/09-external-sources|Audit 9 — external sources reviewed for the brain]] · [[_code/brain/brain/gates/scripts/static-checks.js|Automatic code checker]] · [[brain/README|brain/ - GENERATED OUTPUT. Do not hand-edit during build.]] · [[brain/gates/qa-gate|Checklist – final quality check]] · [[CLAUDE-CODE-BOOTSTRAP|Claude Code Bootstrap Prompt]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/conventions-shared|Rules for all code]] · [[brain/skills/territool-qa/SKILL|Skill – final quality check]] · [[brain/skills/territool-code/SKILL|Skill – writing code]]

**Coding rules (30):** [[_id/W2|API status is 1 or 0]] · [[_id/W7|Business logic in services]] · [[_id/S0.2|Change new code only]] · [[_id/S2.4|Check who uses an API first]] · [[_id/S5.7|Clean up your own orphans, only your own]] · [[_id/M14|Don't grow the Global file]] · [[_id/S0.3|Edit apps only inside a task]] · [[_id/S5.2|Fix all copies]] · [[_id/W6|Get the user safely]] · [[_id/M2|Network calls only through API.js]] · [[_id/M5|Never log users out on errors]] · [[_id/S0.1|Never touch the live app]] · [[_id/W1|New API routes in version 2]] · [[_id/M1|New screens as function components]] · [[_id/W4|No database queries built from text]] · [[_id/W14|No debug output]] · [[_id/M8|No hard-coded colours or sizes]] · [[_id/W19|No inline scripts; portal via React]] · [[_id/M19|No new code-check errors]] · [[_id/M16|No secrets in analytics]] · [[_id/W13|No secrets in logs]] · [[_id/M17|No secrets in the code]] · [[_id/M6|No silent error catching]] · [[_id/S0.6|Old API V1 left alone]] · [[_id/M10|Search before creating]] · [[_id/S0.4|Secrets stay private]] · [[_id/W15|Settings only in config]] · [[_id/M9|Styles in separate files]] · [[_id/S1.1|Use approved words]] · [[_id/W17|Works on PHP 7.4]]

**Quality checks (48):** [[_id/CG-A7|"Searched before creating"]] · [[_id/CG-W6|\Auth::user()]] · [[_id/CG-A5|API V1 untouched]] · [[_id/CG-W10|Bounded lists]] · [[_id/CG-W12|Code gate REVIEW]] · [[_id/CG-A10|Copy matches behaviour]] · [[_id/TG-4|Coverage per changed behaviour]] · [[_id/CG-A9|Credits and money side effects]] · [[_id/CG-A1|Diff touches only files needed for the task]] · [[_id/CG-W15|env() only in config]] · [[_id/CG-W2|Envelope int status 1/0]] · [[_id/CG-M4|Every new API call]] · [[_id/CG-A6|Fork families]] · [[_id/CG-M14|Global.js not extended]] · [[_id/CG-A8|Glossary terms in new user-facing copy]] · [[_id/CG-M7|Loading / refreshing / empty / error states present for…]] · [[_id/CG-W20|MCP tools reuse V2 via CustomerApiClient]] · [[_id/CG-W1|New API routes in v2 + jwt.refresh]] · [[_id/CG-M1|New components are function components]] · [[_id/CG-W8|New services have DB-free PHPUnit tests that pass]] · [[_id/CG-M16|No bodies/passwords/tokens in telemetry]] · [[_id/CG-A4|No commit/push/merge performed unless the user asked in…]] · [[_id/CG-W14|No debug output]] · [[_id/CG-M6|No empty catch in components]] · [[_id/CG-M8|No hardcoded colours / font sizes in new lines]] · [[_id/CG-M19|No new ESLint errors on added lines]] · [[_id/CG-W19|No new inline / in Blade]] · [[_id/CG-M5|No new logout() in error handlers]] · [[_id/CG-W7|No new methods in frozen files]] · [[_id/CG-A11|No orphans from this change]] · [[_id/CG-A2|No production URL or production config switch added]] · [[_id/CG-W11|No query in loops]] · [[_id/CG-M2|No raw fetch( in components]] · [[_id/CG-W13|No request bodies/secrets in logs]] · [[_id/CG-A3|No secrets/credentials/test accounts/staff emails added]] · [[_id/CG-W4|No string-built SQL]] · [[_id/CG-M18|No undeclared or duplicate-purpose dependencies]] · [[_id/CG-W17|PHP 7.4 / Laravel 5.3 compatible]] · [[_id/CG-W5|Queries scoped to the user / team]] · [[_id/CG-W16|Reversible migrations only]] · [[_id/CG-M13|Screen registration PascalCase + lazy]] · [[_id/CG-M12|Semantic testIDs on new screens/interactive elements]] · [[_id/CG-M15|Stale-response guard for overlapping requests]] · [[_id/CG-M9|Styles in *.styles.js]] · [[_id/CG-M3|Success tested only as status == 1]] · [[_id/CG-W9|V2 changes additive]] · [[_id/CG-W3|Validation first]] · [[_id/CG-W18|Web routes in the right group]]

**Code files (2):** [[_code/mobile/App/config/index.js|config/index.js]] · [[_code/mobile/App/utils/Global.js|Global.js]]

%% brain-links:end %%
