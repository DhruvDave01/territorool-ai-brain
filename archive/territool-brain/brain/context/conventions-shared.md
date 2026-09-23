---
area: context
tags: [brain/context]
ref: "Rules for all code"
---

# Territool — Shared Conventions (the shared spine)

These rules apply to **every** Territool change on mobile, web, API, manager portal and MCP. Platform specifics:
- `conventions-mobile.md` (M-rules).
- `conventions-web.md` (W-rules).

Sources:
- `A0…A5` = `brain/audits/0N-*.md`.
- `BT-n` = approved target behaviours (`A3` §7).
- `D-*` = approved decisions.

Where a shared rule and a platform rule overlap, the platform file only adds implementation detail.

## S0. Non-negotiables

| # | Rule | Source |
|---|---|---|
| **S0.1** | **Never change Territool production.** No data writes, config/deploy changes, test runs, purchases, syncs or sends against `app.territool.com` or live accounts. Staging or local only. Abort if a runner's host isn't staging. | USER SAID (A0 §13) **Staging URL is `https://staging.territool.com` and nothing else (USER SAID 2026-09-16).** `repos/web/.codex/config.toml` registers production MCP servers and is left unchanged by owner decision — never open Codex with `repos/web` as its working directory. |
| **S0.2** | **New code only.** Rules govern new and changed lines. **Don't refactor, reformat, convert or "fix along the way" old code** unless the task explicitly targets it. Report pre-existing problems as findings. Only exception: apply the task's *own* fix to every copy of a fork (S5.2). | USER SAID (A1 §11, A2 §11 DW5, A3 §7) |
| **S0.3** | **Repos change only inside an explicit task.** Audits and planning are read-only. **Never commit, push, merge or deploy unless the user asks in that task.** | bootstrap rule 1; global instructions |
| **S0.4** | **Secrets never leave `.local/`.** Never copy passwords, tokens or API keys into `brain/`, `workspace/`, reports, test cases or commit messages. Never print them. | USER SAID; M17, W15 |
| **S0.5** | **Never invent facts.** If code or the owner hasn't established something, mark it unverified and ask. | bootstrap rule 2 |
| **S0.6** | **API V1 is dead: don't use, edit or delete it.** | USER SAID (A2 §11 QW-V1) |
| **S0.7** | **Stop and ask** when a change needs a product/design decision not already recorded in the audits, or would touch a BLOCKER flow outside the task's scope. | A0 §13 loop safeguard; router `LOOP.md` |

## S1. Language and copy

| # | Rule | Source |
|---|---|---|
| S1.1 | Use the approved glossary (`brain/context/glossary.md`) in all new UI copy, docs, test cases and reports. Roles: **Admin, Sales Agent, Business Agent, Business Sales Agent**. **Activity** = timeline item (type + date + note); **Note** = only the text body; **Stop** (not Waypoint); **Plan** in UI, Package in code. | BT-8 (USER SAID) |
| S1.2 | Never rename existing identifiers to match the glossary (API fields and endpoints are a contract). Map them in the glossary instead. | W9; A3 §4 |
| S1.3 | Humanise data in UI: no raw enums ("hair_care" → "Hair care"), no "Invalid Date" (fallback "—"). | A4 §7.5 rules 7–8 |
| S1.4 | Dates/times (all platforms): relative ("18 min ago") under 24 h; `MMM D` in the current year, `MMM D, YYYY` otherwise; time `h:mm A`; timezone only on scheduled activities. | D-DS7 (USER SAID) |

## S2. The V2 API contract (mobile + UserMcp + FindMcp depend on it)

| # | Rule | Source |
|---|---|---|
| S2.1 | Success: `response()->json(['status' => 1, 'message' => …, 'data' => …])`, **int** `1`. | W2; USER SAID "only status: 1" |
| S2.2 | Handled failure: **HTTP 200** `{status: 0, message: <user-safe>, data: []}`, int `0`. Don't change existing endpoints' behaviour. | DW1 (USER SAID "okay don't change it") |
| S2.3 | **Additive only:** never rename/remove a request or response field, change a type, or change `status` semantics. No minimum app version exists, so old app builds keep calling. | W9; USER SAID (A0 §12 Q5) |
| S2.4 | Before changing any V2 endpoint, list its consumers: mobile (`App/config/index.js` constant + call sites), `app/UserMcp` / `app/FindMcp` (`'uri' =>`), web (if shared). | W9; A2 §4 |
| S2.5 | Clients treat success **only** as `status == 1`. | M3; USER SAID (A1 §11 Q-M4) |

## S3. Business rules (approved targets; implement server-side, mirror in clients)

Owner direction: "The API should match that" (BT-6). Clients may pre-validate, but **the server is the source of truth** so every client (older apps, MCP) gets the same rule. Existing code keeps today's behaviour until a task implements the target (S0.2).

| # | Rule (target) | Today | Source |
|---|---|---|---|
| S3.1 | **Mobile API rejects Admin** logins | admits Admin | BT-1 |
| S3.2 | **Business Sales Agent access follows the manager's plan** on mobile too (manager inactive/unsubscribed → blocked) | web only | BT-2 |
| S3.3 | **Hand-added contacts are free** on every surface; credits only for provider unlocks: **2 credits** paid provider contact (Cognism etc.), **1 credit** Claude/biz ("free contact" class) | API charges 1 for manual add | BT-3; `CompanylController.php:2715-2720` |
| S3.4 | **Visited is per company** (route/list is context: visit log + `last_visited_time`); web shows last visited but has no Mark Visited (intentional) | matches; MCP direct write + no owner check | BT-4 |
| S3.5 | **Routes: 2–400 companies**, no per-city cap | mobile only enforces; API none; web 150/city | BT-5 |
| S3.6 | **Activity requires type + date + note; time optional.** Future date = "Schedule", today/past = "Save" | web accepts no type/date | BT-6 |
| S3.7 | **Log Meeting = Activity with type Meeting**; no new separate model | separate table | BT-7 |
| S3.8 | Every query on user data is scoped to the authenticated user (Business Agent: plus team ownership) | many writes lack owner checks | W5; A3 P8 |
| S3.9 | **Offline mode is dropped.** No new offline caching/queuing of routes or data. Network loss is handled as an error state (no logout, retry), not as offline availability. The half-removed cache read stays until a task targets it (S0.2). | cache read without write (`route/index.js:707`) | BT-11 = **drop** (USER SAID 2026-09-15) |

## S4. Design (both platforms)

| # | Rule | Source |
|---|---|---|
| S4.1 | Use the **approved token set** in `brain/context/design-system.md`. Tokens are **additive**: new `App/styles/tokens.js` and `public/css/tt-tokens.css`; legacy `theme.js`/CSS values are frozen. | D-DS1 |
| S4.2 | Gray neutrals; **DIN only** everywhere (incl. manager portal); danger `#E94A5D` (+ `#B91C1C` for red text); disabled = 40% opacity; Find Leads / Map View style actions are outline action chips; web uses the same token names with smaller sizes. | D-DS2…D-DS8 |
| S4.3 | Every data screen/page has loading, empty, error (+ refreshing on mobile) states. | M7; A4 §7.5 |
| S4.4 | White text only on backgrounds with ≥ 4.5:1 contrast (≥ 3:1 for ≥ 17 pt/px bold labels). | A4 §5 |

## S5. Code hygiene (both platforms)

| # | Rule | Source |
|---|---|---|
| S5.1 | **Search before you create**: reuse inventories in `conventions-mobile.md` §4 and `conventions-web.md` §4. | M10, W7 |
| S5.2 | **Fork families:** a fix to a function that exists in several copies is applied to **all copies** in the same change (task's own fix only). | M11, W20; A1 §3.1; A2 §5.1 |
| S5.3 | No secrets or personal data in source; no production URLs in new code. | M17, W15; S0.1 |
| S5.4 | Telemetry and logs never contain passwords, tokens, request/response bodies or contact PII. | M16, W13 |
| S5.5 | No debug output (`console.log` outside `__DEV__` guards on mobile; `dd`/`dump`/`var_dump`/`print_r`/`exit` on web). | W14; `babel.config.js` strips console in prod |
| S5.6 | Handled errors are reported (`captureSentryError` on mobile; Sentry via `Handler` on web) and the UI resets its loading state. | M4, W12 |
| S5.7 | **Clean up your own orphans, only your own.** Imports, variables, functions and constants that *your* change left unused are removed **in the same change**. Pre-existing dead code is **reported, never deleted** (S0.2) — removing it needs its own task. | karpathy-guidelines §3 (external, 2026-09-16); resolves an ambiguity in S0.2 |
| S5.8 | **The change is proportionate to the problem.** Before handing over, re-read the diff: no abstraction for a single use, no configurability nobody asked for, no error handling for states that cannot occur. If it is much larger than the problem, rewrite it smaller first. | karpathy-guidelines §2 (external, 2026-09-16) |

## S6. Testing and QA (both platforms)

| # | Rule | Source |
|---|---|---|
| S6.1 | Every change goes through `territool-test` (cases + automation) and `territool-qa` (verdict) via `territool-router`. | bootstrap Phase 6 |
| S6.2 | Test cases use the approved format (`A5` §6): Markdown + CSV per flow in `workspace/test-cases/`. | D-T2 |
| S6.3 | Automation lives in `workspace/test-suites/{api-contract,web,mobile}`; runners are plain commands (Claude Code or Codex). | D-T1, D-T3 |
| S6.4 | Staging data: read-only by default; created data prefixed `QA-AUTO-YYYYMMDD-` and cleaned up; registration flows on demand. **No payment setup (USER SAID 2026-09-15):** use the existing staging accounts; payment/credit-spending flows are driven **up to the step before the confirm/pay action and stop there**; the confirm step is recorded `Waived (owner)`, not run. **Admin account (USER SAID 2026-09-16): read-only observation only**: login, navigate, inspect, screenshot. Never modify users, permissions, business data or settings. Admin cases that need a write stay `Waived (owner)`. | D-T5 (A5 §7); USER SAID |
| S6.5 | **Known gaps** (`brain/context/known-fragile.md` §4 / BT-n) don't fail a change unless it touches or worsens them. | D-T6 |
| S6.6 | Impacted flows come from the risk tiers in `known-fragile.md` §2–§3; any V2 change runs the API contract suite for mobile + MCP. | A5 §4.3 |
| S6.7 | Mobile E2E: iOS simulator first (second simulator); Android after a debug APK build is allowed. | D-T7 |

## S7. Definition of done

A task is done only when `territool-qa` issues **PASS** or **PASS-WITH-NOTES**. That means all applicable items in `brain/gates/code-gate.md`, `design-gate.md`, `test-gate.md` and `qa-gate.md` pass, with evidence, and the report is written to `workspace/qa-reports/`.

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (119)

**Documents (33):** [[brain/context/glossary|Approved words (glossary)]] · [[brain/audits/00-inventory|Audit 0 – what exists]] · [[brain/audits/01-mobile|Audit 1 – mobile app review]] · [[brain/audits/02-web|Audit 2 – web app review]] · [[brain/audits/03-parity|Audit 3 – mobile vs web]] · [[brain/audits/04-design|Audit 4 – design review]] · [[brain/audits/05-testing|Audit 5 – testing plan]] · [[brain/audits/07-validation|Audit 7 – proving the brain works]] · [[brain/context/brain-qa|Brain QA: questions the brain must answer correctly, and how it did]] · [[brain/gates/code-gate|Checklist – code]] · [[brain/gates/design-gate|Checklist – design]] · [[brain/gates/qa-gate|Checklist – final quality check]] · [[brain/gates/test-gate|Checklist – tests]] · [[CLAUDE-CODE-BOOTSTRAP|Claude Code Bootstrap Prompt]] · [[brain/context/contradiction-register|Contradiction register: where two sources disagreed, and which won]] · [[brain/memory/entries/conflict/20260917-f7d706-cr-04-stack-s6-4-claude-md-no-admin-account-admi|CR-04 — stack / S6.4 / CLAUDE.md: "no Admin account, Admin cases waived" ↔ owner 2026-09-16: an Admin account is prov…]] · [[brain/context/design-system|Design system (colours, fonts, spacing)]] · [[brain/context/known-fragile|Known problems & risky areas]] · [[log|Log]] · [[brain/context/conventions-mobile|Mobile app coding rules]] · [[brain/memory/entries/incident/20260917-ef8968-production-config-exposure|Production config near-miss: mobile API URL and production MCP servers (2026-09-17)]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[SETUP|Set up the Territool brain]] · [[brain/skills/territool-design/SKILL|Skill – design]] · [[brain/skills/territool-qa/SKILL|Skill – final quality check]] · [[brain/skills/territool-router/SKILL|Skill – task router (start of every task)]] · [[brain/skills/territool-test/SKILL|Skill – testing]] · [[brain/skills/territool-code/SKILL|Skill – writing code]] · [[brain/memory/SOURCE-OF-TRUTH|Source of truth — which source wins, per question]] · [[CLAUDE|Start here – brain overview]] · [[brain/context/agent-brief|Territool brain — operating brief for any AI coding tool]] · [[brain/skills/territool-router/LOOP|The fix-until-done loop]] · [[brain/context/conventions-web|Web app coding rules]]

**Coding rules (62):** [[_id/S3.6|Activity needs type, date & note]] · [[_id/W20|AI connectors reuse the API]] · [[_id/S2.3|API changes only add]] · [[_id/W9|API changes only add, never remove]] · [[_id/S2.2|API failure format]] · [[_id/W2|API status is 1 or 0]] · [[_id/S2.1|API success format]] · [[_id/S3.1|Block Admin on mobile]] · [[_id/W7|Business logic in services]] · [[_id/S0.2|Change new code only]] · [[_id/S2.4|Check who uses an API first]] · [[_id/S5.7|Clean up your own orphans, only your own]] · [[_id/S4.2|Design decisions]] · [[_id/S1.2|Don't rename code names]] · [[_id/S0.3|Edit apps only inside a task]] · [[_id/M4|Every network call reports errors]] · [[_id/S5.2|Fix all copies]] · [[_id/M11|Fix every copy of duplicated code]] · [[_id/S3.3|Hand-added contacts free]] · [[_id/W12|Handle outside services safely]] · [[_id/S6.7|iPhone first]] · [[_id/S6.5|Known problems don't fail]] · [[_id/M7|Loading, empty & error states]] · [[_id/S4.3|Loading, empty & error states]] · [[_id/S3.7|Log Meeting is an activity]] · [[_id/S0.5|Never invent facts]] · [[_id/S0.1|Never touch the live app]] · [[_id/W14|No debug output]] · [[_id/S5.5|No debug output]] · [[_id/M16|No secrets in analytics]] · [[_id/W13|No secrets in logs]] · [[_id/S5.4|No secrets in logs]] · [[_id/M17|No secrets in the code]] · [[_id/S5.3|No secrets or live URLs]] · [[_id/S3.9|Offline mode dropped]] · [[_id/S0.6|Old API V1 left alone]] · [[_id/W5|Only the user's own data]] · [[_id/S3.8|Only the user's own data]] · [[_id/S6.6|Re-test affected features]] · [[_id/S4.4|Readable contrast]] · [[_id/S5.6|Report handled errors]] · [[_id/S3.5|Routes 2–400 stops]] · [[_id/DW5|Rule scope]] · [[_id/S3.2|Sales reps follow manager's plan]] · [[_id/M10|Search before creating]] · [[_id/S5.1|Search before creating]] · [[_id/S0.4|Secrets stay private]] · [[_id/W15|Settings only in config]] · [[_id/S1.3|Show data in plain words]] · [[_id/S6.4|Staging test data rules]] · [[_id/S1.4|Standard date formats]] · [[_id/S0.7|Stop and ask when unsure]] · [[_id/M3|Success only when status is 1]] · [[_id/S2.5|Success only when status is 1]] · [[_id/S6.1|Test & check every change]] · [[_id/S6.2|Test case format]] · [[_id/S5.8|The change is proportionate to the problem]] · [[_id/S4.1|Use approved design tokens]] · [[_id/S1.1|Use approved words]] · [[_id/DW1|Validation/handled-failure format for new V2 endpoints]] · [[_id/S3.4|Visited per company]] · [[_id/S6.3|Where tests live]]

**Owner decisions (20):** [[_id/BT-4|“Visited” is per company]] · [[_id/BT-6|Activity needs type, date & note]] · [[_id/BT-1|Block Admin on the mobile app]] · [[_id/D-T1|Claude runs the tests]] · [[_id/D-DS2|Grey colour family]] · [[_id/BT-3|Hand-added contacts are free]] · [[_id/D-T6|Known problems don't fail a change]] · [[_id/BT-7|Log Meeting = a Meeting activity]] · [[_id/BT-11|Offline mode dropped]] · [[_id/D-DS1|Only add new design tokens]] · [[_id/Q-M4|Question: what counts as API success?]] · [[_id/BT-5|Routes have 2–400 stops]] · [[_id/BT-2|Sales reps follow their manager's plan]] · [[_id/D-T5|Staging test data rules]] · [[_id/D-DS7|Standard date formats]] · [[_id/D-T2|Test case format]] · [[_id/D-T7|Test on iPhone first]] · [[_id/BT-8|Use the approved words]] · [[_id/D-DS8|Web uses the same tokens, smaller sizes]] · [[_id/D-T3|Where test suites live]]

**Code files (4):** [[_code/web/app/Http/Controllers/CompanylController.php|CompanylController]] · [[_code/mobile/App/config/index.js|config/index.js]] · [[_code/mobile/App/components/route/index.js|route/index.js]] · [[_code/mobile/App/styles/theme.js|theme.js]]

%% brain-links:end %%
