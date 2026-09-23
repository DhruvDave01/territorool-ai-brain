---
name: territool-test
description: Territool test specialist. Use it to write functional test cases in the owner-approved format (Markdown + CSV per flow) and runnable E2E/API suites (API contract Node runner, Playwright web, Maestro mobile) for a change or a whole flow. It selects full-flow or impacted-only scope from the regression risk map, covers happy/validation/permission-per-role/negative/offline/edge/parity/visual cases, enforces staging-only and the test-data policy, runs the suites and gives the exact commands (usable by Claude Code or Codex).
area: skills
tags: [brain/skills]
ref: "Skill – testing"
---

# territool-test

**Load:**
- `brain/audits/05-testing.md` §2 (execution layers), §6 (format), §7 (data policy)
- `brain/context/flows.md`, `known-fragile.md`, `parity-map.md`, `conventions-shared.md` S3
- `brain/gates/test-gate.md`

## Safety (non-negotiable)

- **Staging only.** Every runner hard-codes and checks the staging host (`staging.territool.com`) and aborts otherwise, as `tools/capture-web.js` does. Never production. Never the Maestro "live" account.
- **Credentials** are read at runtime from `territool-brain/.local/test-accounts.md` (table: role → email → password). Never write them into cases, suites, logs or reports. Reuse the parser in `tools/capture-web.js` (`readAccounts()`) via a shared `workspace/test-suites/lib/accounts.js` (not created yet).
- **Read-only by default.** Created data is named `QA-AUTO-YYYYMMDD-…` and deleted in teardown.
- **`@spends-credits`**: any buy contacts / AI lead save that costs credits / purchase / upgrade / cancel / CRM or MCP sync / invite or email.
  - **No payment setup (USER SAID 2026-09-15).** Log in with the existing staging accounts and drive the flow **up to the step before the confirm/pay action**. Assert everything visible there (price, credit cost, balance, copy, validation), then stop.
  - Mark the confirm step `Waived (owner)`. The runner must never click or call the confirm action.
- **Admin:** no account for now, so Admin cases are `Waived (owner)`.
- **`@creates-user`**: registration (`maestro.stage.<timestamp>@yopmail.com`). On demand only, not every loop iteration.
- **Devices:** a dedicated second iOS simulator / Android emulator; never the user's booted simulator.
- Don't install tools without approval. Approved when needed (D-T4): Maestro, `@playwright/test`.

## 1. Scope selector

| Scope | When | Flows included |
|---|---|---|
| **Full flow** | new flow, "test F08", release check, owner asks | all cases for the named flow(s) on all their platforms |
| **Impacted-only** | a code change in the loop | flows derived from `known-fragile.md` §1–§4: changed files → tier → re-verify set (T0 → all BLOCKERs + contract suite; T1 → listed flows + BLOCKER smoke; fork families → all members' flows; V2 / `Helper.php` / `CompanylController.php` / core models → API contract for mobile + MCP) |

Graph lookups (from `territool-brain/`):

```bash
# mobile: screens affected by a file
node -e 'const g=require("./brain/audits/data/mobile-graph.json");for(const f of process.argv.slice(1))console.log(f,"→",(g.moduleToScreens[f]||["(not in graph — regenerate)"]).join(", "))' App/utils/contactBuyCredits.js
# web: API/web routes depending on a class
node -e 'const g=require("./brain/audits/data/web-graph.json");for(const f of process.argv.slice(1)){const e=g[f];console.log(f,e?`api ${e.api.length}: ${e.api.join(", ")}\nweb ${e.web.length}`:"(not in graph — direct referrers only)")}' app/Api/V2/Controllers/ListController.php
```

Map screens / routes to flows with `brain/context/flows.md`. State the scope and the reason for each included flow at the top of the case file.

## 2. Coverage per changed behaviour (all required, or N/A + reason)

| Type | Minimum |
|---|---|
| `happy` | each role that can use it, each platform carrying it |
| `validation` | every required field + format + limits, **per platform** (mobile, web, API) |
| `permission` | Sales Agent · Business Sales Agent · Business Agent · Admin (BT-1: Admin blocked on mobile; BT-2: BSA follows manager plan) |
| `negative` | API `status 0` messages, expired JWT (session expired modal), no credits, expired subscription |
| `offline` | offline mode is **dropped** (S3.9): test network off / timeout mid-request → no logout (M5), error state, retry; never expect offline data |
| `edge-data` | empty, very long text, special characters/emoji, max counts (route 2–400 stops, BT-5), duplicates, timezone/date formats (D-DS7) |
| `parity` | same business rule result on mobile / web / API / MCP (S3) |
| `regression` | impacted flows from the scope selector (smoke per flow at least) |
| `visual` | design-gate §B checks tied to screenshots at mobile 390 pt, web 1440/768/390 |
| `security` | ownership (another user's IDs rejected), no secrets in responses |

**N/A (owner rule, 2026-09-17):** a type may be N/A for a feature only with a specific written reason, recorded in
`workspace/test-cases/coverage-na.json` as `{ "F23": { "offline": "<why this type cannot apply to this feature>" } }`.
`tools/qa-report.js` counts coverage as **run ÷ applicable**; a missing, generic ("not applicable", "n/a") or
shorter-than-25-character reason is rejected and counts as **not run**. A type that actually ran counts even if
declared N/A. Coverage, not the verdict, ranks what to test next: `workspace/qa-reports/QA-COVERAGE.md`.

Known gaps: put the `KG-*` / `BT-n` ID in `Known gap` when today's behaviour differs from the target. The expected result is always the **target** behaviour.

## 3. Test cases (format: 05-testing.md §6, exact columns)

- **Sources for steps, on-screen labels and expected results:**
  - **Mobile:**
    - **start with the owner captures:** `brain/context/mobile-flows-captured.md` (build 42.32; step tables with screenshot IDs, shared sub-flows S1–S12, observations O1–O15) + `brain/context/mobile-screenshot-index.md`
    - flow notes `brain/assets/brand/flow-notes/*.md`
    - screen inventory, captured states and validation copy: `brain/assets/brand/ui-notes/{Screen-Inventory,States,Forms}.md`
    - stills and videos, located via `brain/assets/brand/coverage-notes/Screenshot-Video-Index.md` (map per flow in `brain/context/flows.md`)
  - **Web:** `shoebox/07-flows/flows.md` + `brain/assets/screenshots/web/`.
  - Confirm every step in code before using it (`brain/audits/08-design-brain-review.md` lists known errors).
- Files: `workspace/test-cases/<Fxx>-<flow-slug>.md` and `.csv` (template: `test-case-template.csv`).
- IDs `TC-Fxx-NNN`, stable. Append new cases, never renumber.
- Priority inherited from flow criticality: BLOCKER P0, HIGH P1, MEDIUM P2, LOW P3.
- Steps use on-screen labels; expected results are observable (UI text, API field, credit delta).
- Camera (F18, F19), push, real store purchase, physical device → `Automation: manual`, listed in the task's own case file (Markdown + CSV). There is no shared manual checklist yet: the planned one (workspace/test-cases/manual-checklist.md, format in `brain/audits/05-testing.md` §6) is an open gap, so never cite it as if it existed.

## 4. Suites (created on first need; one file per flow; tags `@Fxx @P0.. @spends-credits @creates-user`)

| Layer | Location | Runner shape |
|---|---|---|
| L3 API contract | `workspace/test-suites/api-contract/run.js` + `cases/Fxx-*.js` + `baseline/*.json` | Node (built-in `fetch`): staging guard → log in per role (`login` V2, FormData) → call endpoints → assert HTTP 200, int `status`, required `data` fields/types vs baseline → teardown `QA-AUTO-*` → JSON + Markdown summary |
| L4 Web E2E + visual | `workspace/test-suites/web/Fxx-*.spec.js` + `playwright.config.js` (`baseURL` staging, request guard like `capture-web.js`) | Playwright Test from `tools/` |
| L5 Mobile E2E + visual | `workspace/test-suites/mobile/Fxx-*.yaml` | Maestro on the second simulator; semantic testIDs only (TG-12); reuse/adapt `repos/mobile/.maestro` flows by copying, not editing the repo |
| L2 Unit | Jest next to new mobile utils; PHPUnit `repos/web/tests/<Name>Test.php` | written with the code (task scope) |
| L1 Static | `brain/gates/scripts/static-checks.js` | run by territool-code |

Before the first mobile run, confirm the installed build points at staging (API base in `repos/mobile/App/config/index.js` for that build). If it points at production, **stop**.

## 5. Exact commands (put the filled-in versions in the case file and QA report)

```bash
# from territool-brain/
node brain/gates/scripts/static-checks.js --repo mobile|web
node workspace/test-suites/api-contract/run.js --env staging --role "Sales Agent" --only F15
cd tools && PLAYWRIGHT_BROWSERS_PATH="$PWD/ms-playwright" npx playwright test ../workspace/test-suites/web --grep "@F08" --grep-invert "@spends-credits"
maestro --device <SECOND_SIM_UDID> test workspace/test-suites/mobile/F01-login.yaml   # env vars injected by a wrapper that reads .local; never typed inline
cd repos/mobile && npx jest <path>
cd repos/web && vendor/bin/phpunit tests/<Name>Test.php
```

Mobile credentials: use a wrapper script `workspace/test-suites/mobile/run.sh <flow.yaml>` that reads `.local/test-accounts.md` and passes `-e LOGIN_EMAIL -e LOGIN_PASSWORD` without echoing them.

## 6. Run, record, self-check

1. Run the selected suites.
2. Fill `Status` (`Pass` / `Fail` / `Blocked` / `Known gap`) and `Last run` (`YYYY-MM-DD · <platform build> staging`) for every case.
3. Evidence files go in `workspace/qa-reports/<report>/evidence/`.
4. Check the output files for secrets: `grep -rniE "password|passwd|bearer |eyJ[a-zA-Z0-9]{10,}" workspace/test-cases workspace/test-suites workspace/qa-reports` → must be empty (except the word "password" in field labels/steps).
5. Self-check `brain/gates/test-gate.md` TG-1…TG-13. Any FAIL → fix before handing to `territool-qa`.

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (102)

**Documents (59):** [[brain/context/mobile-flows-captured|App journeys from screenshots]] · [[brain/audits/05-testing|Audit 5 – testing plan]] · [[brain/audits/07-validation|Audit 7 – proving the brain works]] · [[_code/brain/brain/gates/scripts/static-checks.js|Automatic code checker]] · [[brain/context/brain-confidence|Brain confidence score: how much an agent can trust this brain today]] · [[brain/README|brain/ - GENERATED OUTPUT. Do not hand-edit during build.]] · [[brain/gates/test-gate|Checklist – tests]] · [[CLAUDE-CODE-BOOTSTRAP|Claude Code Bootstrap Prompt]] · [[workspace/qa-reports/2026-09-16-f01-login-api-contract|F01 QA report — Login & session]] · [[workspace/qa-reports/2026-09-16-f02-registration-onboarding|F02 QA report — Registration & onboarding]] · [[workspace/qa-reports/2026-09-16-f03-subscription-paywall-upgrade-cancel-cred|F03 QA report — Subscription / paywall / upgrade / cancel / credits top-up]] · [[workspace/qa-reports/2026-09-16-f05-dashboard-activity-feed-calendar|F05 QA report — Dashboard, activity feed, calendar]] · [[workspace/qa-reports/2026-09-16-f06-ai-find-leads-save-leads|F06 QA report — AI Find Leads → save leads]] · [[workspace/qa-reports/2026-09-16-f07-places-yelp-leads|F07 QA report — Places / Yelp leads]] · [[workspace/qa-reports/2026-09-16-f08-create-route|F08 QA report — Create route]] · [[workspace/qa-reports/2026-09-16-f09-route-detail-navigation|F09 QA report — Route detail & navigation]] · [[workspace/qa-reports/2026-09-16-f10-mark-visited-visit-log|F10 QA report — Mark visited & visit log]] · [[workspace/qa-reports/2026-09-16-f11-lists|F11 QA report — Lists]] · [[workspace/qa-reports/2026-09-16-f12-companies-address-book|F12 QA report — Companies (Address Book)]] · [[workspace/qa-reports/2026-09-16-f13-contacts|F13 QA report — Contacts]] · [[workspace/qa-reports/2026-09-16-f14-activities-notes-log-meetings|F14 QA report — Activities / notes / log meetings]] · [[workspace/qa-reports/2026-09-16-f15-find-buy-contacts-credits|F15 QA report — Find & buy contacts (credits)]] · [[workspace/qa-reports/2026-09-16-f16-report-company-contact|F16 QA report — Report company/contact]] · [[workspace/qa-reports/2026-09-16-f17-share-route-list|F17 QA report — Share route/list]] · [[workspace/qa-reports/2026-09-16-f18-scan-business-card|F18 QA report — Scan business card]] · [[workspace/qa-reports/2026-09-16-f19-qr-route-import|F19 QA report — QR route import]] · [[workspace/qa-reports/2026-09-16-f20-settings-status-tags-stages|F20 QA report — Settings / status tags / stages]] · [[workspace/qa-reports/2026-09-16-f21-crm-sync|F21 QA report — CRM sync]] · [[workspace/qa-reports/2026-09-16-f22-bulk-csv-upload|F22 QA report — Bulk CSV upload]] · [[workspace/qa-reports/2026-09-16-f23-manager-portal|F23 QA report — Manager portal]] · [[workspace/qa-reports/2026-09-16-f24-business-sales-agent-management|F24 QA report — Business Sales Agent management]] · [[workspace/qa-reports/2026-09-16-f25-admin-hq|F25 QA report — Admin HQ]] · [[workspace/qa-reports/2026-09-16-f26-support-tickets|F26 QA report — Support tickets]] · [[workspace/qa-reports/2026-09-16-f27-notifications-push|F27 QA report — Notifications & push]] · [[workspace/qa-reports/2026-09-16-f28-referral-invites|F28 QA report — Referral invites]] · [[workspace/qa-reports/2026-09-16-f29-customer-mcp-connectors|F29 QA report — Customer MCP connectors]] · [[workspace/qa-reports/2026-09-16-f30-admin-mcp|F30 QA report — Admin MCP]] · [[workspace/qa-reports/2026-09-16-f31-mcp-client-connections-chat|F31 QA report — MCP client connections & chat]] · [[brain/context/known-fragile|Known problems & risky areas]] · [[brain/context/mobile-screenshot-index|List of all screenshots]] · [[log|Log]] · [[brain/context/parity-map|Mobile vs web differences]] · [[shoebox/07-flows/flows|Original flow descriptions]] · [[brain/context/flows|Product features list]] · [[workspace/qa-reports/QA-COVERAGE|QA coverage ranking — what to test next]] · [[brain/memory/entries/decision/20260917-b29959-qa-verdicts-are-coverage-based-n-a-needs-a-speci|QA verdicts are coverage-based; N/A needs a specific reason; coverage ranks what to test next]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/audits/08-design-brain-review|Review of the old Design-Brain]] · [[brain/context/conventions-shared|Rules for all code]] · [[brain/assets/brand/coverage-notes/Screenshot-Video-Index|Screenshot and video index]] · [[brain/skills/territool-qa/SKILL|Skill – final quality check]] · [[brain/skills/territool-router/SKILL|Skill – task router (start of every task)]] · [[brain/skills/territool-code/SKILL|Skill – writing code]] · [[CLAUDE|Start here – brain overview]] · [[workspace/tasks/2026-09-16-prove-the-loop-f01|Task brief: prove the loop end to end on F01 (API contract)]] · [[TASK_CONFIDENCE_LOOP|TASK_CONFIDENCE_LOOP — feature-level task confidence]] · [[brain/skills/territool-router/LOOP|The fix-until-done loop]] · [[_code/brain/tools/capture-web.js|Tool – take web screenshots]] · [[workspace/README|Work output folders]]

**Product features (30):** [[_id/F14|Activities / notes / log meetings]] · [[_id/F25|Admin HQ]] · [[_id/F30|Admin MCP]] · [[_id/F06|AI Find Leads → save leads]] · [[_id/F22|Bulk CSV upload]] · [[_id/F24|Business Sales Agent management]] · [[_id/F12|Companies (Address Book)]] · [[_id/F13|Contacts]] · [[_id/F08|Create route]] · [[_id/F21|CRM sync]] · [[_id/F29|Customer MCP connectors]] · [[_id/F05|Dashboard, activity feed, calendar]] · [[_id/F15|Find & buy contacts]] · [[_id/F11|Lists]] · [[_id/F01|Login & session]] · [[_id/F23|Manager portal]] · [[_id/F10|Mark visited & visit log]] · [[_id/F31|MCP client connections & chat]] · [[_id/F27|Notifications & push]] · [[_id/F07|Places / Yelp leads]] · [[_id/F19|QR route import]] · [[_id/F28|Referral invites]] · [[_id/F02|Registration & onboarding]] · [[_id/F16|Report company/contact]] · [[_id/F09|Route detail & navigation]] · [[_id/F18|Scan business card]] · [[_id/F20|Settings / status tags / stages]] · [[_id/F17|Share route/list]] · [[_id/F03|Subscription / paywall / upgrade / cancel / credits…]] · [[_id/F26|Support tickets]]

**Coding rules (2):** [[_id/M5|Never log users out on errors]] · [[_id/S3.9|Offline mode dropped]]

**Quality checks (3):** [[_id/TG-12|Mobile selectors use semantic testIDs]] · [[_id/TG-13|Suites were executed at least once and results recorded…]] · [[_id/TG-1|Test cases written in the approved format]]

**Owner decisions (5):** [[_id/BT-1|Block Admin on the mobile app]] · [[_id/D-T4|Install test tools when needed]] · [[_id/BT-5|Routes have 2–400 stops]] · [[_id/BT-2|Sales reps follow their manager's plan]] · [[_id/D-DS7|Standard date formats]]

**Code files (3):** [[_code/web/app/Http/Controllers/CompanylController.php|CompanylController]] · [[_code/mobile/App/config/index.js|config/index.js]] · [[_code/web/app/Globals/Helper.php|Helper]]

%% brain-links:end %%
