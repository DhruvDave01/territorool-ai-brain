---
name: territool-router
description: Entry point for every Territool task (React Native mobile app, Laravel web app, manager portal, Admin HQ, MCP modules, API V2). Use it first for any feature, bug fix, design, test or QA request on Territool. It detects the platform(s), forces a parity check for shared flows, builds the impact map, routes the work to territool-code / territool-design / territool-test / territool-qa in order, and runs the fix loop until the gates pass.
area: skills
tags: [brain/skills]
ref: "Skill – task router (start of every task)"
---

# territool-router

Read first, every time:
1. `brain/context/conventions-shared.md` §S0 (non-negotiables)
2. `brain/context/glossary.md`

Load the rest only when a step needs it.

## Step 0: Non-negotiables check (stop if any would be violated)

- **Production is never touched** (S0.1): no writes, tests, purchases, syncs or config against `app.territool.com` or live accounts. Staging or local only.
- **New code only** (S0.2): don't refactor or fix old code unless the task targets it.
- **Repos** (S0.3): edits only inside an explicit task; **never commit/push unless the user asks**.
- **Secrets** (S0.4): never read credentials into outputs; they stay in `.local/`.
- **Paid/external actions** (buy contacts, AI lead saves that cost credits, purchases, CRM/MCP sync, emails): only after the staging test-payment setup exists.
- **V1 API** (S0.6): ignore it; never edit or delete.

## Step 1: Classify the request

| Field | How to decide |
|---|---|
| **Type** | `feature` · `bug` · `design` (audit/new screen/flow) · `tests-only` · `qa-only` · `question` |
| **Platform(s)** | Use the table below. If still ambiguous → **ask the user** (one question, with the options) |
| **Flow(s)** | Match screens/endpoints/keywords to `brain/context/flows.md`; record F-ids and criticality |
| **Business rule?** | Does it change a rule in `conventions-shared.md` S3 (credits, visits, route limits, activities, roles)? |

**Platform detection**

| Signal | Platform |
|---|---|
| Paths `App/**`, `android/**`, `ios/**`, `.maestro/**`; words "app", "iOS", "Android", "screen" + mobile screen names (`App/App.js`) | **mobile** |
| Paths `app/Http/**`, `resources/views/**`, `routes/web.php`, `public/js|css/**`; words "web", "Blade", "browser", "dashboard page" | **web (Blade user app)** |
| Paths `resources/manager-portal/**`, `app/Services/Manager/**`, `/manager/*`; words "manager portal", "Cockpit", Business Agent dashboard | **portal** |
| Paths `app/Admin/**`, Backpack, `/hq/*`; "Admin" | **admin HQ** |
| Paths `app/Api/V2/**`, `routes/api.php`; "endpoint", "API" | **API** → consumers: mobile + MCP (S2.4) |
| Paths `app/UserMcp/**`, `app/FindMcp/**`, `app/AdminMcp/**`, `app/McpClient/**`; "MCP", "connector", "Claude/ChatGPT tool" | **MCP** |
| `app/Console/**`, cron routes, jobs, webhooks | **system** (F04, F15, F03) |

## Step 2: Forced parity check (mandatory when a flow exists on more than one platform)

For each flow, open `brain/context/parity-map.md` and write:

1. **Platforms carrying this flow** (mobile / web / portal / API / MCP).
2. **Current parity status** and the BT target, if any.
3. **Decision:** `mirror on <platforms>` · `this platform only — intentional (cite parity-map row)` · `needs owner decision`.
   - Business rules (S3) are **server-side** and must hold for API + web + MCP together ("The API should match that", S3).
   - UI differences are fine only when the parity map says so.

If the decision is "needs owner decision", **stop and ask**. Don't guess.

## Step 3: Impact map

Follow `brain/context/known-fragile.md` §1:
- changed / to-be-changed files → modules → screens / routes → flows
- tier T0–T3 and the re-verify set per §4
- known gaps (§5) inside the area

## Step 4: Route

| Type | Sequence |
|---|---|
| feature (with UI) | `territool-design` (routing → PLACE, EXTEND or CREATE spec) → **user approves spec** → `territool-code` → `territool-test` → `territool-qa` |
| feature (no UI) | `territool-code` → `territool-test` → `territool-qa` |
| bug | `territool-test` (write the failing reproduction case first) → `territool-code` → `territool-test` (run) → `territool-qa` |
| design audit | `territool-design` AUDIT (formerly Mode A) → report (no code) |
| tests-only | `territool-test` → run → report |
| qa-only | `territool-qa` on the given diff / build |
| question | answer from `brain/context` with citations; say "not verified" when the brain doesn't know |

Write a task brief to `workspace/tasks/<YYYY-MM-DD>-<slug>.md` using this template:
- Request (quoted)
- Type
- Platforms
- Flows + criticality
- Parity decision
- Impact map (tiers, re-verify set, known gaps)
- Sequence
- Acceptance criteria (numbered, testable)
- Open questions

## Step 5: Run the loop

See `LOOP.md` — the only loop (state file, stations, gate commands, budgets, escalation; merged from the former `territool-loop` skill on 2026-09-17). The task is done only when `territool-qa` returns **PASS** (or **PASS-WITH-NOTES** under the conditions in `LOOP.md`), with the report in `workspace/qa-reports/`.

## Final message to the user (always)

- Verdict + report path
- What changed (files)
- What was verified (flows, platforms)
- What was **not** verified, and why
- Any escalations
- Reminder that nothing was committed (unless asked)

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (46)

**Documents (36):** [[brain/context/glossary|Approved words (glossary)]] · [[brain/audits/01-mobile|Audit 1 – mobile app review]] · [[brain/audits/07-validation|Audit 7 – proving the brain works]] · [[brain/audits/09-external-sources|Audit 9 — external sources reviewed for the brain]] · [[brain/README|brain/ - GENERATED OUTPUT. Do not hand-edit during build.]] · [[brain/gates/qa-gate|Checklist – final quality check]] · [[CLAUDE-CODE-BOOTSTRAP|Claude Code Bootstrap Prompt]] · [[brain/context/contradiction-register|Contradiction register: where two sources disagreed, and which won]] · [[brain/context/design-system|Design system (colours, fonts, spacing)]] · [[workspace/qa-reports/2026-09-16-f01-login-api-contract|F01 QA report — Login & session]] · [[brain/memory/entries/decision/20260917-bcff7d-iteration-budget-is-3-at-strike-3-change-strateg|Iteration budget is 3; at strike 3 change strategy, then proceed or escalate]] · [[brain/memory/README|Knowledge memory — start here]] · [[workspace/qa-reports/2026-09-17-knowledge-memory-audit|Knowledge memory audit — 2026-09-17]] · [[brain/context/known-fragile|Known problems & risky areas]] · [[brain/context/mobile-screenshot-index|List of all screenshots]] · [[log|Log]] · [[brain/context/parity-map|Mobile vs web differences]] · [[brain/memory/entries/decision/20260917-8d68b7-pause-after-ground-only-on-six-conditions-and-lo|Pause after GROUND only on six conditions, and log which one triggered]] · [[brain/context/flows|Product features list]] · [[workspace/qa-reports/2026-09-17-knowledge-memory-build|QA report: knowledge memory build and confidence loop (2026-09-17)]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/conventions-shared|Rules for all code]] · [[brain/skills/territool-design/SKILL|Skill – design]] · [[brain/skills/territool-qa/SKILL|Skill – final quality check]] · [[brain/skills/territool-test/SKILL|Skill – testing]] · [[brain/skills/territool-code/SKILL|Skill – writing code]] · [[CLAUDE|Start here – brain overview]] · [[workspace/loop/20260916-ts2345-commonfunctions/state|TASK: ts2345-commonfunctions]] · [[brain/context/stack|Tech setup & environments]] · [[brain/skills/territool-loop/SKILL|TERRITOOL LOOP — superseded, moved to LOOP.md]] · [[brain/memory/entries/decision/20260917-64a7b5-territool-loop-merged-into-territool-router-loop|territool-loop merged into territool-router LOOP.md; the old skill is a redirect stub]] · [[brain/skills/territool-router/LOOP|The fix-until-done loop]] · [[brain/context/tooling|Tooling: which agent runs the brain, and what each one needs]] · [[brain/memory/entries/correction/20260917-eaa29a-typescript-file-count-1-source-file-plus-2-decla|TypeScript file count: 1 source file plus 2 declarations, not "1" or "3"]] · [[brain/context/UPCOMING_IMPROVEMENTS|Upcoming improvements: application findings not fixed during the brain work]] · [[workspace/README|Work output folders]]

**Product features (4):** [[_id/F15|Find & buy contacts]] · [[_id/F01|Login & session]] · [[_id/F03|Subscription / paywall / upgrade / cancel / credits…]] · [[_id/F04|Subscription & credit renewal]]

**Coding rules (6):** [[_id/S0.2|Change new code only]] · [[_id/S2.4|Check who uses an API first]] · [[_id/S0.3|Edit apps only inside a task]] · [[_id/S0.1|Never touch the live app]] · [[_id/S0.6|Old API V1 left alone]] · [[_id/S0.4|Secrets stay private]]

%% brain-links:end %%
