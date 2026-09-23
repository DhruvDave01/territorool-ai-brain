---
name: territool-code
description: Implements or fixes Territool code (React Native mobile app in repos/mobile, Laravel web app / API V2 / manager portal / MCP in repos/web) following the approved conventions. Use it for any code change after territool-router has classified the task. It runs pre-flight search (existing module, canonical example, parity map), applies the M/W/S rules to new code only, and finishes with a self-review against brain/gates/code-gate.md, including static-checks.js.
area: skills
tags: [brain/skills]
ref: "Skill – writing code"
---

# territool-code

**Inputs:**
- task brief `workspace/tasks/<date>-<slug>.md` (from `territool-router`)
- approved spec (`workspace/design-proposals/…`, if UI)
- defect list (if in a loop iteration)

**Load:**
- `brain/context/conventions-shared.md`
- `conventions-mobile.md` and/or `conventions-web.md`
- `glossary.md`
- `design-system.md` (UI only)

## Hard limits

- Edit repos **only for this task**. **New code only**: don't reformat, rename or "clean up" old code you're not asked to change (S0.2).
- **Never commit, push, merge, install packages, run migrations or change `.env`** unless the user asked in this task.
- No production URLs, accounts or config (S0.1). No secrets in code (S0.4). Never touch API V1 (S0.6).
- In a loop iteration: fix **only** the listed defects.

## 1. Pre-flight (write the answers into the change summary)

1. **Search before creating.** Look for an existing component / util / service / endpoint that already does it:
   - Mobile: `grep -rn "<keyword>" repos/mobile/App --include='*.js' | grep -v customPackage`, then check the reuse inventory in `conventions-mobile.md` §4.
   - Web: `grep -rn "<keyword>" repos/web/app repos/web/resources/views repos/web/resources/manager-portal`, then check the reuse inventory in `conventions-web.md` §4.
   - Endpoint already exists? Check `repos/mobile/App/config/index.js` and `grep -n "<uri>" repos/web/routes/api.php`.
2. **Canonical example.**
   - Mobile screens/data: `RecentActivityScreen` (`conventions-mobile.md` §2).
   - Web: examples A–D in `conventions-web.md` §2 (pick the one matching the surface: V2 endpoint, service + test, Blade page, portal).
   - Copy its structure, not old neighbours.
3. **Parity map.** Open `brain/context/parity-map.md` for the flow and implement the router's parity decision. Business rules (S3) go server-side, so API + web + MCP stay consistent.
4. **Consumers** (any V2 change): list mobile call sites (`App/config/index.js` constant + `grep -rn CONSTANT App`) and MCP tools (`grep -rn "'uri' => '<uri>'" repos/web/app/UserMcp repos/web/app/FindMcp`). Changes must be **additive** (S2.3).
5. **Fork family.** If the file belongs to a family (`conventions-mobile.md` §5 / `conventions-web.md` §5), list all members. The fix goes to every member that has the same defect **for this task**.
6. **Risk tier and known gaps.** Look up the files in `brain/context/known-fragile.md` §2–§3 and §5. Don't "fix" a known gap unless the task targets it. If your change touches one, say so.

## 2. Standards while writing

| Area | Mobile (`conventions-mobile.md`) | Web / API / portal / MCP (`conventions-web.md`) |
|---|---|---|
| **Types** | JS codebase: data shapes documented with JSDoc `@typedef` as in `recentActivityData.js:13-16`. In `.ts` files, no `any`. Props documented on the component. | PHP 7.4-compatible (W17). Parameter and return type hints OK. No PHP 8 syntax. Portal: follow the existing portal source conventions. |
| **Naming / placement** | M10, M11, M13: screens PascalCase + lazy in `App/App.js`; styles in `*.styles.js`; utils in `App/utils/` | W7: logic in `app/Services/**`, thin controllers; V2 controllers in `app/Api/V2/Controllers/`; new API routes in `v2` + `jwt.refresh` (W1) |
| **API / data** | M2, M3: `API.js` + FormData, `status == 1`, endpoint constants | W2, W3, W5, W9: int status, validate first, scope to user/team, additive |
| **Errors** | M4, M5, M6: `.catch` → `captureSentryError`, `.finally` resets flags, no `logout()` on network errors, no empty catch | W12, W13: wrap external calls, report without bodies/secrets |
| **States** | M7: loading, refreshing, empty, error on every data screen | Blade/portal: loading, empty, error, validation messages |
| **Design values** | M8: tokens only (`App/styles/tokens.js`, created from `brain/assets/tokens/tokens.js`; add missing tokens there, D-DS1). Fonts `fonts.dinCondensed*`; icons from already-imported vector-icon sets; images from `App/images` (library copy `brain/assets/images/mobile`) | `--tt-*` from `public/css/tt-tokens.css` (created from `brain/assets/tokens/tt-tokens.css`); DIN 2014 faces only; no new font/icon CDN links (DG-B13); W19: no inline `<script>/<style>` |
| **Duplication** | Reuse before creating (pre-flight 1); no new copies of fork-family files | No new methods in frozen files (W7); reuse services |
| **Strings (i18n-safe)** | No translation layer exists (only `react-native-localize` for locale/crash helpers). Keep new user-facing copy as whole strings (no concatenated sentence fragments), glossary terms, humanised enums through a map. | Blade has `resources/lang/en` and many views use the lang helpers: new Blade copy follows the surrounding view (lang key if the view uses them). Never build sentences from fragments. Glossary terms. |
| **Testability** | M12: semantic `testID` on new screens and interactive elements | W8: new services get DB-free PHPUnit tests |
| **Telemetry / secrets** | M16, M17 | W13, W15 |

## 3. Post-flight (mandatory before handing to territool-test)

Run from `territool-brain/` and paste the outputs into the change summary:

```bash
node brain/gates/scripts/static-checks.js --repo mobile        # if mobile changed
node brain/gates/scripts/static-checks.js --repo web           # if web changed (runs php -l)
cd repos/mobile && node scripts/audit-missing-testids.js       # mobile UI changes (M12)
cd repos/web && vendor/bin/phpunit tests/<Name>Test.php        # new/changed services (W8)
```

Portal source changed? Rebuild the bundle as described in `conventions-web.md` §7 (the command is listed there). If a build would modify tracked build output the task didn't ask for, ask first.

Then self-review against **`brain/gates/code-gate.md`**:
- Every applicable item gets PASS / FAIL / N/A with evidence (file:line, command output).
- Any FAIL → fix → re-run post-flight. Don't hand over with a FAIL.

## 4. Output: change summary (append to the task brief)

```markdown
## Code change — iteration <n>
- Files changed: <path> (+added/-removed) …
- Pre-flight: searched <terms> → reused <modules> / created <new> because <reason>
- Canonical example followed: <file>
- Parity decision implemented: <platforms>
- V2 consumers checked: <mobile constants/call sites>, <MCP tools> — additive: yes/no
- Fork family members updated: <list or N/A>
- Known gaps touched: <KG ids or none>
- static-checks: <FAIL n / WARN n> (table below)
- Code gate: <all items with PASS/FAIL/N/A + evidence>
- Not committed.
```

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (56)

**Documents (20):** [[brain/context/glossary|Approved words (glossary)]] · [[brain/audits/07-validation|Audit 7 – proving the brain works]] · [[brain/audits/09-external-sources|Audit 9 — external sources reviewed for the brain]] · [[_code/brain/brain/gates/scripts/static-checks.js|Automatic code checker]] · [[brain/README|brain/ - GENERATED OUTPUT. Do not hand-edit during build.]] · [[brain/gates/code-gate|Checklist – code]] · [[CLAUDE-CODE-BOOTSTRAP|Claude Code Bootstrap Prompt]] · [[brain/context/design-system|Design system (colours, fonts, spacing)]] · [[brain/context/known-fragile|Known problems & risky areas]] · [[brain/context/conventions-mobile|Mobile app coding rules]] · [[brain/context/parity-map|Mobile vs web differences]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/conventions-shared|Rules for all code]] · [[brain/skills/territool-qa/SKILL|Skill – final quality check]] · [[brain/skills/territool-router/SKILL|Skill – task router (start of every task)]] · [[brain/skills/territool-test/SKILL|Skill – testing]] · [[CLAUDE|Start here – brain overview]] · [[workspace/tasks/2026-09-16-prove-the-loop-f01|Task brief: prove the loop end to end on F01 (API contract)]] · [[brain/skills/territool-router/LOOP|The fix-until-done loop]] · [[brain/context/conventions-web|Web app coding rules]]

**Product feature (1):** [[_id/F01|Login & session]]

**Coding rules (30):** [[_id/S2.3|API changes only add]] · [[_id/W9|API changes only add, never remove]] · [[_id/W2|API status is 1 or 0]] · [[_id/W7|Business logic in services]] · [[_id/S0.2|Change new code only]] · [[_id/W3|Check input first]] · [[_id/M4|Every network call reports errors]] · [[_id/M11|Fix every copy of duplicated code]] · [[_id/W12|Handle outside services safely]] · [[_id/M7|Loading, empty & error states]] · [[_id/M12|Meaningful test IDs]] · [[_id/M2|Network calls only through API.js]] · [[_id/M5|Never log users out on errors]] · [[_id/S0.1|Never touch the live app]] · [[_id/W1|New API routes in version 2]] · [[_id/M8|No hard-coded colours or sizes]] · [[_id/W19|No inline scripts; portal via React]] · [[_id/M16|No secrets in analytics]] · [[_id/W13|No secrets in logs]] · [[_id/M17|No secrets in the code]] · [[_id/M6|No silent error catching]] · [[_id/S0.6|Old API V1 left alone]] · [[_id/W5|Only the user's own data]] · [[_id/M13|Register screens properly]] · [[_id/M10|Search before creating]] · [[_id/S0.4|Secrets stay private]] · [[_id/W15|Settings only in config]] · [[_id/M3|Success only when status is 1]] · [[_id/W8|Tests for new services]] · [[_id/W17|Works on PHP 7.4]]

**Quality check (1):** [[_id/DG-B13|No new external design dependencies in changed code]]

**Owner decision (1):** [[_id/D-DS1|Only add new design tokens]]

**Code files (3):** [[_code/mobile/App/utils/API.js|API.js]] · [[_code/mobile/App/config/index.js|config/index.js]] · [[_code/mobile/App/components/dashboard/recentActivityData.js|recentActivityData.js]]

%% brain-links:end %%
