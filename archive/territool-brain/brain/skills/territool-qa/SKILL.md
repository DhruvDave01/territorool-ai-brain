---
name: territool-qa
description: Final QA gate for any Territool change (mobile app, web app, manager portal, API V2, MCP). Use it after territool-code and territool-test. It builds the impact map, verifies the new functionality, re-verifies every impacted existing flow, checks the design at token level against the spec, checks mobile/web/API parity and the API contract for mobile + MCP consumers, and issues PASS / PASS-WITH-NOTES / FAIL with evidence in workspace/qa-reports/.
area: skills
tags: [brain/skills]
ref: "Skill – final quality check"
---

# territool-qa

**Load:**
- `brain/gates/qa-gate.md` (items + verdict rules)
- `code-gate.md`, `design-gate.md`, `test-gate.md`
- `brain/context/known-fragile.md`, `parity-map.md`, `flows.md`
- the task brief and spec

**QA is independent.** Re-run commands yourself; don't trust the summaries from earlier steps.

## Safety

- Staging / local only. Never production. No `@spends-credits` or `@creates-user` actions unless their preconditions are met (see `territool-test`).
- Read-only on repos: QA never edits code. Defects go back through `territool-router/LOOP.md`.

## Procedure (each step → a report section)

1. **Change set.** Record `git -C repos/<repo> status --short`, `git -C repos/<repo> diff --stat`, and the untracked files, for each repo touched. Separate task changes from pre-existing uncommitted work (compare with the task brief's file list). Pre-existing work is out of scope, but note it.
2. **Impact map (QG-1).**
   - Files → modules → screens (mobile graph) / routes (web graph) → flows → tier → re-verify set.
   - Use the lookups in `territool-test` §1 and the direct-referrer rows in `known-fragile.md` §3.
   - Apply §4 rules: T0 → all BLOCKERs + contract; T1 → row flows + BLOCKER smoke; forks → all members; V2 / `Helper.php` / `CompanylController.php` / models → contract for mobile + MCP.
3. **Production check (QG-2).** Grep the run logs and commands for `app.territool.com`; confirm runner guards were active.
4. **Code gate (QG-3).**
   - Run `node brain/gates/scripts/static-checks.js --repo <repo>` again.
   - Re-check every REVIEW item in `code-gate.md` against the diff, with evidence.
5. **Design gate (QG-4)** (UI changes).
   - **Token-level check:** for each spec element, expected token → actual value.
   - Web: Playwright `getComputedStyle` (colour, font-family, font-size, padding, border-radius) at 1440/768/390.
   - Mobile: the code references the token + screenshot pixel sample (`sips` → BMP) matches the token hex within ±2 per channel.
   - Screenshot every spec state, then compare untouched screens in the tier with the baseline (DG-B9).
6. **Test gate (QG-5).** Verify TG-1…TG-13 on the case files and suites.
7. **New functionality (QG-6).** For each acceptance criterion: test ID(s) → result → evidence (screenshot path / API field / credit delta).
8. **Regression (QG-7).** Run the re-verify set, BLOCKER flows first. Record per flow: platform, tests run, pass/fail, evidence.
9. **API contract (QG-8)** when triggered: `node workspace/test-suites/api-contract/run.js --env staging …` for each role involved. Diff fields vs baseline; any removed/renamed/type-changed field = FAIL.
10. **Parity (QG-9).** For each shared flow touched: the same rule → result on mobile / web / API / MCP, or the parity-map row that makes the difference intentional.
11. **Known gaps (QG-10).** Every failing check → `new defect` / `worsened known gap` (both FAIL) / `unchanged known gap KG-*` (note).
12. **Cleanup (QG-11).** Confirm `QA-AUTO-*` data created in this run is deleted (list the teardown output).
13. **Secrets (QG-12).** `grep -rniE "bearer |eyJ[a-zA-Z0-9]{10,}|@yopmail\.com|@territool\.com" <report folder>` → nothing (account emails count as credentials here).
14. **Environment pointers (QG-14).** Run `node tools/memory.js sync` and read the pointer table in
    `brain/memory/_generated/CHANGES.md`. A production mobile `URL_BASE`, or a Codex/Cursor session opened in
    `repos/web` while `*-live` MCP servers are configured, means `BLOCKED` for any run that depends on it.
15. **Knowledge (QG-13).**
    - Capture what this task taught with `node tools/memory.js new …` (decision / fix / failed-approach /
      regression-link / correction).
    - Supersede what it disproved (`memory.js supersede`).
    - Then `memory.js reindex && memory.js lint --strict`.
    - Fill the KNOWLEDGE block of the report with the entry ids, and answer the future-session test.
16. **Verdict** per `qa-gate.md` rules. Blocked BLOCKER/HIGH verification = FAIL unless the owner waived it in writing.

## Output

- `workspace/qa-reports/<YYYY-MM-DD>-<slug>.md` from `report-template.md`
- evidence in `workspace/qa-reports/<YYYY-MM-DD>-<slug>/evidence/`
- On FAIL: the **Defects** table is the hand-off to `territool-router` (responsible specialist per `LOOP.md`).
- Append the iteration row to the **Iteration log**. In later iterations, update the same report (don't create a new one per iteration).

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (44)

**Documents (24):** [[_code/brain/brain/gates/scripts/static-checks.js|Automatic code checker]] · [[brain/README|brain/ - GENERATED OUTPUT. Do not hand-edit during build.]] · [[brain/gates/code-gate|Checklist – code]] · [[brain/gates/design-gate|Checklist – design]] · [[brain/gates/qa-gate|Checklist – final quality check]] · [[brain/gates/test-gate|Checklist – tests]] · [[CLAUDE-CODE-BOOTSTRAP|Claude Code Bootstrap Prompt]] · [[brain/context/confidence-score|Confidence score: how ready the brain is for a task]] · [[brain/context/known-fragile|Known problems & risky areas]] · [[brain/memory/LAST-SYNC|LAST-SYNC — when memory last reconciled with the repos]] · [[brain/context/parity-map|Mobile vs web differences]] · [[brain/context/flows|Product features list]] · [[brain/skills/territool-qa/report-template|Quality report template]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/conventions-shared|Rules for all code]] · [[brain/skills/territool-router/SKILL|Skill – task router (start of every task)]] · [[brain/skills/territool-test/SKILL|Skill – testing]] · [[brain/skills/territool-code/SKILL|Skill – writing code]] · [[CLAUDE|Start here – brain overview]] · [[workspace/tasks/2026-09-16-prove-the-loop-f01|Task brief: prove the loop end to end on F01 (API contract)]] · [[brain/context/agent-brief|Territool brain — operating brief for any AI coding tool]] · [[brain/skills/territool-router/LOOP|The fix-until-done loop]] · [[_code/brain/tools/probe-styles.js|Tool – measure page styles]] · [[workspace/README|Work output folders]]

**Product feature (1):** [[_id/F01|Login & session]]

**Quality checks (17):** [[_id/QG-8|API contract suite for mobile + MCP consumers when V2 /…]] · [[_id/QG-3|Code gate passed]] · [[_id/QG-4|Design gate passed for UI changes]] · [[_id/QG-14|Environment pointers checked before any run]] · [[_id/QG-1|Impact map built]] · [[_id/QG-13|Knowledge captured]] · [[_id/QG-10|Known gaps classified]] · [[_id/QG-6|New functionality verified against the request / spec…]] · [[_id/QG-12|No secrets in the report]] · [[_id/QG-9|Parity check for shared flows]] · [[_id/QG-2|Production untouched during the task and tests]] · [[_id/QG-7|Regression: every impacted flow re-verified per tier…]] · [[_id/QG-11|Staging data cleaned up]] · [[_id/TG-13|Suites were executed at least once and results recorded…]] · [[_id/TG-1|Test cases written in the approved format]] · [[_id/QG-5|Test gate passed]] · [[_id/DG-B9|Visual regression on untouched screens in the change's…]]

**Code files (2):** [[_code/web/app/Http/Controllers/CompanylController.php|CompanylController]] · [[_code/web/app/Globals/Helper.php|Helper]]

%% brain-links:end %%
