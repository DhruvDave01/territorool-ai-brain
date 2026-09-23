---
area: workspace
tags: [brain/workspace]
ref: "TASK: ts2345-commonfunctions"
---

# TASK: ts2345-commonfunctions
status: PLANNED
iteration: 0 / 3
station: PLAN (analysis only — stopped at the PLAN exit condition by design)
started: 2026-09-16 10:44   updated: 2026-09-16 10:52

## REQUEST
verbatim:
> STEP 7 — Dry-run the loop. "Pick the smallest real, harmless task you can find in the repos — a
> missing type annotation, an unused import, one hardcoded colour value. Then run the loop on it in
> `analysis only` mode."

Subject chosen: the TypeScript error `mobile_types` reported during STEP 4 —
`App/utils/commonFunctions.ts(163,61): error TS2345: Argument of type 'unknown' is not assignable to
parameter of type 'AlertButton[] | undefined'.`

classified:  bug
platforms:   mobile [x] web [ ] backend [ ] db [ ] api [ ] integration [ ]
roles affected: none (see GROUND TRUTH — the code is unreachable)
criticality: LOW

## GROUND TRUTH

| claim | tier | source |
|---|---|---|
| `tsc --noEmit` exits 2 on an unmodified checkout, with exactly 2 errors | VERIFIED | ran 2026-09-16; `repos/mobile` at `e9fd05e`, 0 working-tree changes |
| The error is at `Alert.alert('Digital Avatar', 'Write permission err', err)` | VERIFIED | `repos/mobile/App/utils/commonFunctions.ts:163` |
| `err` comes from `catch (err)`, so TypeScript types it `unknown`; `Alert.alert`'s 3rd parameter is `AlertButton[] \| undefined` | VERIFIED | same file, lines 161–164 |
| The enclosing function is `requestExternalWritePermission`, exported at line 146 | VERIFIED | `commonFunctions.ts:146` |
| **`requestExternalWritePermission` has zero callers anywhere in `App/`** | VERIFIED | `grep -rn requestExternalWritePermission repos/mobile/App` → only the definition |
| `CaptureMediaFunction` (line 170) and `getMediaFromGalleryFunction` (line 205) also have zero callers | VERIFIED | same grep method |
| The string `'Digital Avatar'` appears 3× in this file and nowhere else in `App/` | VERIFIED | `grep -rn 'Digital Avatar' repos/mobile/App` → lines 163, 195, 243 |
| "Digital Avatar" is not a Territool term | VERIFIED | absent from `brain/context/glossary.md` |
| 40 files import `commonFunctions`, but for `scaledSize` / `ScreenWidth` / `IS_IOS`-style helpers, not for these three functions | VERIFIED | importer grep + caller grep above |
| The second `tsc` error (`__tests__/App.test.tsx` cannot resolve `'../App'`) is a separate defect in the test file | VERIFIED | `tsc` output, STEP 4 |
| Whether these three functions are dead on purpose (a media feature that was pulled) or dead by accident | **UNKNOWN** | no commit message or doc explains it — would need the owner or `git log --follow` |

conflicts found:
- None between the brain and the code. The brain never documented this module.

unknowns blocking progress:
- **Yes, one.** Whether the three unreachable functions should be repaired, removed, or left alone is a
  product decision, not a code decision. Under S0.2 (new code only) old code is not touched unless the
  task targets it — and this task was a dry run, not a mandate to change anything.

## IMPACT MAP
direct:            `repos/mobile/App/utils/commonFunctions.ts` (1 file)
callers of shared: **none for the affected symbols** — enumerated by grep, not assumed. The module is
                   imported by 40 files, but every one of them consumes layout/platform helpers; no file
                   references `requestExternalWritePermission`, `CaptureMediaFunction`, or
                   `getMediaFromGalleryFunction`.
flows at risk:     none. No flow in `brain/context/flows.md` reaches this code.
parity obligation: mobile-only — there is no web counterpart to a React Native permission prompt.

## PLAN
root cause / insertion point:
  `catch (err)` yields `unknown` under TS 5.8; the value is then passed as `Alert.alert`'s third
  argument, whose type is `AlertButton[] | undefined`. The type error is real. **The code path is not.**

files to change (+why each):
  **None.** Analysis-only mode forbids writes to `repos/`, and the finding argues against a change even
  if it were allowed:
  - A one-line type fix would silence `tsc` but keep three unreachable exports and a wrong product name
    in the codebase — it makes the gate green without making the product better.
  - Deleting the three functions is the change that actually resolves it, but that is a refactor of old
    code, which S0.2 forbids without a task that explicitly targets it.

files that must NOT change:
  Everything. `repos/mobile` and `repos/web` are untouched by this run.

expected behaviour after:
  No behavioural change. This run produces a recommendation, not a diff.

gates that must pass:
  N/A for analysis-only. For the eventual fix: `mobile_types` must go from 2 errors to 1 (the
  `App.test.tsx` error is out of scope), and `node brain/gates/scripts/static-checks.js --repo mobile`
  must stay clean on added lines.

## ITERATION LOG
### iter 0 — BUILD
changed: nothing — `analysis only` mode stops at the PLAN exit condition.
### iter 0 — VERIFY
not run — nothing was built. Per §6, an unrun gate cannot produce a PASS, so this task terminates as
`ANALYSIS`, not `PASS`.

## TERMINAL
status: **ANALYSIS**

unverified residue:
- Why the three functions are unreachable (deliberate removal vs. accidental orphan) — UNKNOWN.
- Whether `Alert.alert('Digital Avatar', …)` was ever user-visible in a shipped build — not checked
  against release history.
- The second `tsc` error in `__tests__/App.test.tsx` was not investigated; it is a separate task.

brain updates required:
- `brain/context/known-fragile.md`: add the dead-code cluster in `App/utils/commonFunctions.ts`
  (3 unreachable exports, 3 occurrences of a non-Territool product name).
- `brain/context/glossary.md`: no change — "Digital Avatar" is correctly absent; the code is wrong, not
  the glossary.

## RECOMMENDATION TO THE OWNER
Do not apply a type-level patch. Either (a) leave it — it is unreachable and harmless, or (b) raise an
explicit "remove dead media helpers from commonFunctions.ts" task, which would clear one `tsc` error,
three dead exports and a foreign product name in one reviewed change. **(b) is the better use of the
change budget, but it needs your go-ahead because it edits old code.**

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (11)

**Documents (9):** [[brain/context/glossary|Approved words (glossary)]] · [[_code/brain/brain/gates/scripts/static-checks.js|Automatic code checker]] · [[workspace/qa-reports/2026-09-17-knowledge-memory-audit|Knowledge memory audit — 2026-09-17]] · [[brain/context/known-fragile|Known problems & risky areas]] · [[brain/context/flows|Product features list]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/skills/territool-router/SKILL|Skill – task router (start of every task)]] · [[brain/skills/territool-loop/SKILL|TERRITOOL LOOP — superseded, moved to LOOP.md]] · [[brain/skills/territool-router/LOOP|The fix-until-done loop]]

**Coding rule (1):** [[_id/S0.2|Change new code only]]

**Code file (1):** [[_code/mobile/App/utils/commonFunctions.ts|commonFunctions.ts]]

%% brain-links:end %%
