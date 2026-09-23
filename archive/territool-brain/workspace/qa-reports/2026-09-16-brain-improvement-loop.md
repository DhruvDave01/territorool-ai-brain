---
area: workspace
tags: [brain/workspace]
ref: "QA report: autonomous brain improvement loop (iteration 1)"
---

# QA report: autonomous brain improvement loop (iteration 1)

**Verdict: PASS-WITH-NOTES.** All BLOCKER/HIGH gate items pass. The remaining items are one category held below
the 90 target by standing owner constraints (QA coverage 75: no payment sandbox, no CI), unchanged known gaps,
and owner-waived steps — each listed below. No repo file changed; no password, token or key leaked.

- **Task:** `workspace/tasks/2026-09-16-brain-improvement-loop.md`
- **Final audit:** `brain/audits/10-brain-final-audit.md`
- **Scorecard:** `brain/context/brain-scorecard.md` (avg 67 → 92; 17/18 ≥ 90)
- **Suites:** `workspace/test-suites/api-contract/last-run.json` (44 cases), `workspace/test-suites/web/last-run.json` (9), mobile Maestro flow
- **Brain QA:** `brain/context/brain-qa.md` (30 Qs × 2 answerers, 97%)

## Gate items

| ID | Check | Result |
|---|---|---|
| QG-1 | Impact map | ✅ this is a brain-only change; the "impact map" is the 18-category scorecard + the parity/flow notes. No repo modules touched |
| QG-2 | Production untouched | ✅ every runner hard-wires `staging.territool.com` and refuses other hosts; run logs show staging only; the owner's booted simulator was never driven |
| QG-3 | Code gate | N/A — no application code changed (repos == baseline). Brain tools are new; they carry self-tests (`api-map.selftest.js`, `brain-score.js --self-test`) |
| QG-4 | Design gate | N/A — no UI shipped. `design-system.md` re-verified against code; `design-states.md` added |
| QG-5 | Test gate | ✅ suites are staging-only, credentials read at run time, endpoints scanned for writes before use, created data avoided (read-only cases) |
| QG-6 | New functionality verified end-to-end | ✅ the "functionality" is the brain's knowledge: 30-question Brain QA answered from the brain alone by two agents, 97% each, identical, unknowns handled |
| QG-7 | Regression (impacted flows re-verified) | ✅ the 10 inconsistencies the QA run exposed were fixed and re-checked (CR-22…CR-29); `brain-parity` OK; `cite-check` 0 drift |
| QG-8 | API contract suite (mobile + MCP consumers) | ✅ 44 cases: 33 pass, 9 known gaps, 2 waived, **0 fail** |
| QG-9 | Parity check for shared flows | ✅ `parity-map.md` updated with runtime evidence; F20/F26/F27 moved off UNVERIFIED; 9 rows still UNVERIFIED and listed |
| QG-10 | Known gaps classified | ✅ pre-existing gaps stay in `known-fragile.md` §5; new findings are `UI-*` in `UPCOMING_IMPROVEMENTS.md`; none was worsened (all read-only) |
| QG-11 | Staging data cleaned up | ✅ no `QA-AUTO-` records created (all cases are reads; the only writes are `usertoken` rows from logins and Maestro's clearState, disclosed in the F01 suite) |
| QG-12 | No secrets in the report/outputs | ✅ **after remediation** — see the note below |

## Notes (the reasons this is PASS-WITH-NOTES, not PASS)

1. **QA coverage category = 75 (< 90 target).** Blocked by owner-level constraints, not by the brain: no staging
   payment sandbox (F03/F15 stop before Pay, `Waived (owner)`, U-PAY-01), no CI, and write flows are not run by
   the brain because they mutate data / spend credits. Gap→action for iteration 2 is in `brain-scorecard.md` §3.
2. **Secret remediation (QG-12).** The first mobile and web runs left the staging **account email** (never a
   password) in Maestro debug logs and in one truncated page heading in `web-explore.json`. Fixed:
   the debug logs were deleted (screenshots kept), the JSON files were scrubbed, a pre-existing owner file
   (`video-index.txt`) was scrubbed, and both runners were hardened (mobile `run.js` now deletes Maestro's logs;
   `web-explore.js` redacts truncated emails and local-parts). Final scan: **no password/token/key anywhere; no
   login email in any brain/context note or data file.**
   - *Residual (low):* the Settings screenshots under `workspace/qa-evidence/` show the staging account's own
     email as the app renders it. That is a staging test-account identifier displayed in-app, not a credential;
     `qa-evidence/` is not indexed into the brain graph. Left as evidence; flagged here for the owner.
3. **Waived (owner, unchanged):** payment/credit-spend confirm steps; Admin write actions (read-only observation
   only this cycle; `/hq` runtime still blocked by reCAPTCHA, U-ADM-01).
4. **Unchanged known gaps** carried, not worsened: `known-fragile.md` §5 (KG-BT1 runtime-confirmed).
5. **New application findings (not fixed, code freeze):** UI-SEC-01/04/07/08/09/10/11, UI-API-02/03/04,
   UI-PERF-01/02, UI-UX-01…05 in `UPCOMING_IMPROVEMENTS.md`. Two are Critical (push broadcast; unsigned webhooks).
6. **Environment:** the machine is still `NOT READY` in `doctor` because the Codex CLI is not on PATH; it did not
   block this brain work (Claude Code ran everything).

## Evidence of the code freeze

`diff` of `repos/{mobile,web}` HEAD + `git status` against `workspace/loop/2026-09-16-brain-loop/baseline-git.txt`
= **no change**.

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (32)

**Documents (13):** [[brain/audits/10-brain-final-audit|Audit 10 — Territool AI Brain final audit]] · [[brain/context/brain-qa|Brain QA: questions the brain must answer correctly, and how it did]] · [[brain/context/brain-scorecard|Brain scorecard: 18 categories, rubric, iterations]] · [[_code/brain/tools/brain-score.js|Confidence score: how well the brain equips an agent to take a task on each product feature.]] · [[brain/context/design-states|Design states: loading, empty, error and their variants per surface]] · [[brain/context/design-system|Design system (colours, fonts, spacing)]] · [[workspace/qa-reports/2026-09-16-f01-login-api-contract|F01 QA report — Login & session]] · [[brain/context/known-fragile|Known problems & risky areas]] · [[log|Log]] · [[brain/context/parity-map|Mobile vs web differences]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[workspace/tasks/2026-09-16-brain-improvement-loop|Task brief: autonomous brain improvement loop to 90+]] · [[brain/context/UPCOMING_IMPROVEMENTS|Upcoming improvements: application findings not fixed during the brain work]]

**Product features (6):** [[_id/F15|Find & buy contacts]] · [[_id/F01|Login & session]] · [[_id/F27|Notifications & push]] · [[_id/F20|Settings / status tags / stages]] · [[_id/F03|Subscription / paywall / upgrade / cancel / credits…]] · [[_id/F26|Support tickets]]

**Quality checks (12):** [[_id/QG-8|API contract suite for mobile + MCP consumers when V2 /…]] · [[_id/QG-3|Code gate passed]] · [[_id/QG-4|Design gate passed for UI changes]] · [[_id/QG-1|Impact map built]] · [[_id/QG-10|Known gaps classified]] · [[_id/QG-6|New functionality verified against the request / spec…]] · [[_id/QG-12|No secrets in the report]] · [[_id/QG-9|Parity check for shared flows]] · [[_id/QG-2|Production untouched during the task and tests]] · [[_id/QG-7|Regression: every impacted flow re-verified per tier…]] · [[_id/QG-11|Staging data cleaned up]] · [[_id/QG-5|Test gate passed]]

**Problem found (1):** [[_id/KG-BT1|Admin can log in to mobile]]

%% brain-links:end %%
