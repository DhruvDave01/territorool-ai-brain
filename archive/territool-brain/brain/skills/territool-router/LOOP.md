---
area: skills
tags: [brain/skills]
ref: "The fix-until-done loop"
---

# The Territool Loop: change → gates → test → QA → fix → repeat

**This is the only loop.** `CLAUDE.md` names `territool-router` (+ this file) as the entry point, so the
separate `territool-loop` skill was merged in here on 2026-09-17 (owner decision Q4, USER SAID 2026-09-17).
Section numbers from the old skill are kept in brackets, e.g. **[L§5]**, so older citations still resolve.
The old file is now a redirect stub (body removed 2026-09-17; original in commit `5d7214e`), deleted after the owner's first commit.

**Owner intent (USER SAID):** "do the changes, test the changes, if it breaks something you need to solve it and repeat the loop till we get the 100% result with all UI, functionality, testing and QA".

- **Iteration budget: 3, firmly (USER SAID 2026-09-17).** This supersedes the 2026-09-15 override "loop until
  100%". The reasons: there is no measurable 100% to run until, and attempt four is rarely smarter than attempt
  three, only more willing. The escalation safeguards below (approved with Phase 6, 2026-09-15) still apply; they
  only ever stop and ask, never skip work. The quote above is kept as the original intent: iterate to a verified
  result, within the budget.

You are a state machine that happens to be able to write code. Reliability comes from the state file and
the gates, not from confidence. **[L intro]**

---

## 0. Config [L§0]

Facts are **referenced, not copied**, so a change in the canonical note changes it everywhere.

| Setting | Value / where it lives |
|---|---|
| Product, platforms, versions | `brain/context/stack.md` §3 (mobile), §4 (web), §7 (brain tooling). **Never restate a version here.** |
| API contract | `workspace/test-suites/api-contract/` + `repos/web/routes/api.php`. No OpenAPI/Swagger spec exists; the suite **is** the executable contract |
| Context | `brain/context/` (stack, conventions, design-system, flows, parity-map, known-fragile, glossary) |
| Gates | `brain/gates/` |
| State root | `workspace/loop/` |
| Repos | `repos/mobile`, `repos/web` (symlinks; targets in `stack.md` §3–§4) |

### 0.1 Gate commands — canonical home of the commands and their baseline results

Read the baseline before trusting a gate: three of these are **already red on an unmodified checkout**, so
"whole repo must be green" is not an achievable gate. Use the diff-scoped commands marked **(USE THIS)** for
pass/fail; the repo-wide ones are context only. `VERIFIED` = run on the date shown, exit code observed.

```yaml
mobile_types: cd repos/mobile && ./node_modules/.bin/tsc --noEmit
              # VERIFIED 2026-09-16 · EXIT 2 on a clean checkout — 2 pre-existing errors
              # (__tests__/App.test.tsx cannot resolve '../App'; App/utils/commonFunctions.ts:163 TS2345).
              # tsconfig includes only **/*.ts(x): App has 1 .ts source file + 2 .d.ts of 234 files
              # (checked 2026-09-17), so typecheck covers almost nothing. Treat as: no NEW error from the diff.
mobile_lint:  node brain/gates/scripts/static-checks.js --repo mobile      # (USE THIS) added lines only
              # VERIFIED 2026-09-16 · ESLint on changed files + the M/W regex rules; this is the real gate.
              # Repo-wide `./node_modules/.bin/eslint .` = VERIFIED 2026-09-16 · EXIT 1 · 52 errors, 3,082 warnings
              # (earlier count 50 / 3,074 on 2026-09-15, A1 §1). `--max-warnings=0` would be a fake gate.
mobile_test:  cd repos/mobile && ./node_modules/.bin/jest --ci
              # VERIFIED 2026-09-16 · EXIT 1 — the single existing suite (__tests__/App.test.tsx) ALREADY FAILS.
              # No `test` script in package.json. New tests must not be judged against a red baseline.
mobile_e2e:   node workspace/test-suites/mobile/run.js --device <UDID> --role "Sales Agent" <flow.yaml> --out <dir>
              # Maestro is installed (stack.md §7); runs on a SECOND simulator only (S0.7).
              # repos/mobile/.maestro has the team's own flows; Detox config also present (NOT RUN).
              # NOTE: the maestro:*:live:* npm scripts point at PRODUCTION accounts — never run those (S0.1).
web_static:   php -l <changed file>                                          # (USE THIS)
              # VERIFIED 2026-09-16 · EXIT 0 on app/Api/V2/Controllers/AuthController.php. Wired into
              # static-checks.js. phpstan: NOT CONFIGURED (no phpstan.neon).
web_lint:     NOT CONFIGURED
              # No pint.json, no .php-cs-fixer.php, no lint script in composer.json. Do not invent one.
web_test:     cd repos/web && ./vendor/bin/phpunit --filter Manager
              # VERIFIED 2026-09-16 · EXIT 0 · 17 tests, 51 assertions.
              # The FULL suite is NOT SAFE: tests/ExampleTest.php does $this->visit('/'), which boots the app
              # against the configured database. Keep the --filter until a test DB exists.
api_contract: node workspace/test-suites/api-contract/run.js --env staging    # (USE THIS) L3
              # Last run 2026-09-16 15:25 UTC: 48 cases · 37 pass · 0 fail · 9 known gap · 2 blocked
              # (last-run.json). Staging only; credentials never printed.
web_e2e:      node workspace/test-suites/web/run.js --env staging            # web / manager-portal contract
              # Last run 2026-09-16 14:30 UTC: 9 cases · 9 pass (last-run.json). Playwright lives in tools/.
qa_reports:   node tools/qa-report.js            # regenerates per-feature reports from the two last-run files
```

### 0.2 Budgets

```yaml
max_fix_iterations:      3      # firm (USER SAID 2026-09-17); at strike 3 change strategy, then proceed or escalate (§9)
max_diagnose_depth:      3      # strikes before a strategy change is mandatory
max_files_touched:       10     # exceeding this requires owner approval
stop_on_unknown_blocker: true
memory_behind_threshold: 20     # commits behind HEAD before INTAKE warns and GROUND pauses (§13)
```

---

## 1. Non-negotiables for the loop [L§1]

Project-wide rules are `brain/context/conventions-shared.md` §S0. The loop adds:

1. **Never claim a check passed unless you ran it and saw the result.** Every gate item carries one of:
   `PASS` `FAIL` `NOT RUN` `N/A` `BLOCKED` `NOT VERIFIED`. An unstamped item is `NOT RUN`, and `NOT RUN`
   cannot produce an overall PASS.
2. **Never weaken a check to make it pass.** Do not delete a failing test, loosen a type, add an
   eslint-disable, lower a phpstan level, or widen an assertion to get green. If the check is genuinely
   wrong, say so and stop — that is the owner's decision.
3. **Never invent Territool facts.** No invented endpoints, fields, components, permissions, statuses,
   business rules, or design values. Missing evidence is `UNKNOWN`, with a line saying what would resolve it.
4. **Minimum safe change.** Large enough to fix the root cause, no larger. No drive-by refactors, renames,
   formatting sweeps, or dependency bumps.
5. **Shared code is radioactive.** Before touching anything used by both platforms or by more than one flow,
   enumerate its callers. That list becomes the regression scope.
6. **Persist before you think.** Write to the state file after every station. Assume context will be lost.
7. **Stop is a valid outcome.** `BLOCKED` with a clear reason beats a confident half-fix.

---

## 2. State file — the spine [L§2]

At INTAKE, create `workspace/loop/<YYYYMMDD>-<short-slug>/state.md` and keep it current. It is the only
memory you trust. On any restart, resume from it rather than from conversation history. The router's task
brief (`workspace/tasks/<YYYY-MM-DD>-<slug>.md`) is written at the same time and linked from the state file.

```markdown
# TASK: <slug>
status: INTAKE | GROUNDING | PLANNED | BUILDING | VERIFYING | DIAGNOSING | DONE | BLOCKED | FAILED
iteration: 0 / 3
station: <current>
started: <ts>   updated: <ts>
brief: workspace/tasks/<file>.md

## REQUEST
verbatim:
classified:  bug | feature | design | refactor | test | qa | investigation
platforms:   mobile [ ] web [ ] portal [ ] admin [ ] api [ ] mcp [ ] system [ ]
roles affected:
criticality: BLOCKER | HIGH | MEDIUM | LOW
parity decision: (router Step 2)
pause:       none | P-UNKNOWN P-CRIT P-SHARED P-FILES P-CONFLICT P-BEHIND  (§13)
prod check:  mobile URL_BASE = staging? (§13 INTAKE production check)
memory:      synced <LAST-SYNC at> · loaded <ids> · written <ids>

## GROUND TRUTH
| claim | tier | source |
|---|---|---|
|  | VERIFIED / VISUAL / DOCUMENTED / INFERRED / UNKNOWN | path:line or screenshot filename |

conflicts found:
unknowns blocking progress:

## IMPACT MAP
direct:            <files>
callers of shared: <files — enumerated, not guessed>
flows at risk:     <from known-fragile.md + parity-map.md; tier T0–T3>
parity obligation: identical | may differ (reason) | mobile-only | web-only

## PLAN
root cause / insertion point:
files to change (+why each):
files that must NOT change:
expected behaviour after:
gates that must pass:

## ITERATION LOG
| # | Date/time | Changes made (files) | Gates run | Failing items (IDs) | Verdict |
|---|---|---|---|---|---|
### iter 1 — DIAGNOSE
failure evidence:
hypothesis:
why the previous hypothesis was wrong:
strategy change (mandatory at iter 3):

## TERMINAL
status:
unverified residue:
brain updates required:
```

The QA report carries a copy of the iteration-log table.

---

## 3. Evidence ladder [L§3]

Every claim you act on is tagged. Nothing promotes itself upward.

| Tier | Means | Example |
|---|---|---|
| `VERIFIED` | You read the current code, or ran it and observed the result | `repos/mobile/App/components/contacts/view.js:1207` (the KG-UI8 root cause) |
| `VISUAL` | Confirmed from an approved screenshot or extracted video frame | `LR-01` (owner capture, indexed in `brain/context/mobile-screenshot-index.md`) |
| `DOCUMENTED` | Stated in `brain/context/*` or the shoebox | `brain/context/flows.md` F08 row |
| `INFERRED` | Reasonable from repeated patterns elsewhere, not confirmed here | "all other services throw ApiError, so this one probably does" |
| `UNKNOWN` | No evidence exists | — |

Rules:
- `INFERRED` may guide a plan. It may never justify a `PASS`.
- A bug report means current behaviour is **not** automatically the intended behaviour. When code and
  requirement conflict, surface the conflict; don't pick.
- When two sources disagree, record the conflict in the state file before proceeding.

---

## 4. Stations, and which specialist runs each [L§4]

```
        INTAKE ──► GROUND ──► IMPACT ──► PLAN ──► BUILD ──► VERIFY
                                           ▲                   │
                                           │              PASS │ FAIL
                                           │                   │
                                     DIAGNOSE ◄────────────────┤
                                           │                   ▼
                                    (3 strikes)            REGRESS
                                           │                   │
                                           ▼              PASS │ FAIL
                                       ESCALATE ◄──────────────┘
                                                                │
                                                                ▼
                                                             REPORT
```

| Station | Done by | Exit condition |
|---|---|---|
| INTAKE | router Step 0–1 | request written down unambiguously, platforms + criticality set |
| GROUND | router (reads `brain/context`) | every GROUND TRUTH claim tiered; no plan-changing `UNKNOWN` |
| IMPACT | router Step 2–3 | regression scope is a concrete list of flows and files |
| PLAN | router Step 4 (+ `territool-design` spec, **user approves**, for UI features) | a plan a second engineer could execute without asking |
| BUILD | `territool-code` (+ `territool-design` §B check for UI) | diff matches the plan, file for file |
| VERIFY | `territool-test` then `territool-qa`, in a clean context (§7) | every gate item stamped |
| REGRESS | `territool-qa` (re-verify set) | every flow in the impact map stamped |
| DIAGNOSE | the specialist that owns the failing item (§6) | hypothesis recorded before code |
| ESCALATE / REPORT | router | §9 message / §10 report |

### INTAKE
Restate the request in your own words. Classify it. Create the state file. If the request is ambiguous in a
way that changes the implementation — ask. One question, then wait.

**Memory PRE-SYNC.** This is automatic, targeted, and needs no permission.
- Run `node tools/memory.js sync`. It captures new commits, lists uncommitted work, records environment pointers
  and marks outdated entries.
- If memory is behind HEAD by more than `memory_behind_threshold` commits, warn before proceeding (`P-BEHIND`).
- A production pointer → the INTAKE production check (§13).

### GROUND
Read before you search, search before you assume. Pull the relevant `brain/context/*` files. Trace the
feature end to end in **both** codebases if it's shared:

```
UI → state → validation → service → API → controller → business logic → DB → response → state → UI
```

If an `UNKNOWN` would change the plan → `BLOCKED`, name the missing evidence, stop.

**Memory context.**
- Read `brain/memory/_generated/HOT.md`.
- Run `node tools/memory.js context <F-id | file | word>` for each feature and file of the task. It returns at most
  25 entries; never load `INDEX.md` whole.
- Record the loaded entry ids in the state file (`memory loaded:`).
- Prior knowledge is evidence and is tiered like any other claim. A commit entry is DOCUMENTED, not VERIFIED.

### IMPACT
Enumerate callers by actually grepping, not by memory. Cross-reference `parity-map.md` and
`known-fragile.md` §1. If `files to change > max_files_touched`, stop and show the owner the plan first.
Run `node tools/memory.js impact <files>`. A relationship found here that memory lacks is written back
immediately as a `regression-link` entry.

### PLAN
Root cause (bugs) or insertion point (features). File-by-file, with justification. Explicitly list what must
*not* change.
**Before proposing an approach**, list the risk entries `impact` returned:
- `incident`, `failed-approach`, `antipattern`, and high-`occurrences` `bug` / `fix` entries;
- for example, "we tried this in March and it broke background sync".

A plan that repeats a recorded failed approach must say why this attempt differs.

### BUILD
Implement the plan. Nothing outside the plan. If the plan turns out wrong mid-build, **stop building** and
return to GROUND — don't improvise. Pre-flight before creating anything new:
- Does a component/hook/service/util that does this already exist? Grep first.
- Does the design system already define this token/spacing/state? Don't invent one.
- Does the other platform already solve this? Match it or record why you didn't.

### VERIFY — the adversarial station
Run the real commands from §0.1. Exit codes decide, not opinions. Gate order — cheapest first, stop at the
first FAIL:

```
1. static    types / lint / php -l                 → exit code          (code-gate)
2. unit      tests touching changed units           → exit code
3. integration / API contract                       → exit code          (QG-8)
4. functional test cases (the matrix)               → per-case stamp     (test-gate)
5. E2E (Codex may run it, §7)                       → per-scenario stamp
6. visual QA vs approved screenshots                → per-element stamp, or NOT VERIFIED (design-gate §B)
7. parity QA (shared flows only)                    → per-rule stamp     (QG-9)
```

Any `FAIL` → DIAGNOSE. Any `NOT RUN` on a required item → not done; run it or mark the task `PARTIAL`.

### REGRESS
Only after VERIFY passes. Walk outward:
```
changed unit → direct dependents → shared components → related flows
→ the other platform's counterpart → every BLOCKER-criticality flow
```

### DIAGNOSE — on any failure
Do **not** patch speculatively:
```
capture exact failure output  →  reproduce minimally  →  trace to origin
→  compare against ground truth  →  state a hypothesis  →  state why the
   previous hypothesis was wrong  →  plan the minimum fix  →  BUILD
```
Write the hypothesis into the state file *before* writing code.

**Three-strike rule:** at iteration 3 you may not change code again until you have changed *strategy*.
Re-open the requirement, re-verify the ground truth, re-trace the flow, question the assumed root cause,
check environment and config, check whether the failing test is itself wrong. Write the revised diagnosis.
Then proceed with the new strategy or ESCALATE (§9).

---

## 5. One iteration (the specialists in order)

```
1. territool-code      implement / fix  →  code-gate (static-checks.js + review)
2. territool-design    (UI) check implementation vs spec → design-gate §B
3. territool-test      update cases + suites → run → test-gate
4. territool-qa        impact map, new + regression + parity + contract → qa-gate → verdict
```

Every iteration appends a row to the **Iteration log** (state file, copied into the QA report).

## 6. Routing a FAIL back (defect → responsible specialist)

| Failing item | Goes to | With |
|---|---|---|
| `CG-*` (code gate) | `territool-code` | rule ID, file:line, static-checks row |
| `DG-A*` (spec incomplete / wrong) | `territool-design` | missing state/token, screen |
| `DG-B*` (implementation doesn't match spec) | `territool-code` | spec section vs screenshot, token expected vs found |
| `TG-*` (test cases/suites incomplete) | `territool-test` | missing coverage type / command / guard |
| `QG-6` functional defect | `territool-test` adds or adjusts a reproducing case, then `territool-code` fixes | test ID, expected vs actual, evidence |
| `QG-7` regression in an impacted flow | `territool-code` (fix the new code, **not** by editing unrelated old code) | flow, test ID, evidence |
| `QG-8` contract break (mobile/MCP) | `territool-code` (make the change additive) | endpoint, field diff |
| `QG-9` parity mismatch | router Step 2 again → `territool-code` on the missing platform, or escalate if it's a product decision | parity row |
| `QG-2`/`QG-12` production touched / secret exposed | **Stop immediately and escalate** | what happened |

**The specialist fixes only the listed defects.** Then QA re-runs the full qa-gate (not only the failing
item), because fixes can cause regressions.

## 7. Verification independence [L§5]

Self-critique from inside the building context is the weakest link. VERIFY runs in a context that never saw
the build reasoning — either a fresh subagent, or **Codex** through `workspace/handoff/` (owner split "Codex
runs, Claude checks", `brain/context/tooling.md` §3). The controller keeps only the state file, the plan and
the verdicts.

| Work | Runner | Sees |
|---|---|---|
| Codebase discovery / caller enumeration | scanner | repo paths, grep results |
| Cross-platform parity comparison | comparator | both implementations, parity-map |
| Gate verification | **checker** (subagent or Codex) | diff + plan + gate only — never the build reasoning |
| Visual QA | visual | screenshots + rendered output + design-system.md |
| Regression sweep | regressor | impact map + test commands |

## 8. Terminal states and QA verdicts [L§6]

| Loop terminal state | Meaning | QA verdict it requires |
|---|---|---|
| `PASS` | Every required gate ran and passed. Regression clean. | `PASS`, or `PASS-WITH-NOTES` under the exit rule below |
| `PARTIAL` | Works, but something required could not be run or verified. **Name it.** | `PARTIAL` (any required item `NOT RUN` / `NOT VERIFIED`) |
| `BLOCKED` | Cannot proceed without evidence, access, or an owner decision | — |
| `FAILED` | Attempted, could not make it work, budget spent | `FAIL` |
| `ANALYSIS` | Analysis-only mode; no code changed by design | — |

`PASS` is forbidden if any required gate item is `NOT RUN` or `NOT VERIFIED` — downgrade to `PARTIAL`.
Overconfident termination is the single most common loop failure.

**POST-SYNC runs at every terminal state, including BLOCKED and FAILED.** Failed attempts are the most valuable
entries and the ones most often lost.
- Capture with `node tools/memory.js new …`.
- Then `reindex` and `lint --strict`.
- `PASS` is also forbidden while any KNOWLEDGE item below is unmet (QG-13):

```
[ ] Knowledge impact assessed
[ ] New knowledge captured, deduped, classified
[ ] Superseded knowledge linked, not deleted
[ ] Bugs / fixes / decisions / failed approaches recorded where applicable
[ ] Regression relationships updated
[ ] Indexes regenerated (memory.js reindex) and lint clean
[ ] LAST-SYNC updated by a real memory.js sync (real commit SHAs)
[ ] Manual changes reconciled (listed, not ingested)
[ ] Conflicts and unknowns recorded
[ ] FUTURE-SESSION TEST passed: a new session with only the repo + brain/memory understands what changed, why, and what to watch
```

Report each state separately: IMPLEMENTED ≠ TESTED ≠ QA VERIFIED ≠ VISUALLY VERIFIED ≠ RUNTIME VERIFIED ≠
KNOWLEDGE SYNCED.

**Exit rule per QA verdict:**

| Verdict | Loop action |
|---|---|
| **PASS** | Done. Report to user. |
| **PASS-WITH-NOTES** | If a note is **in scope and fixable** (caused by this task) → run another iteration. Stop when the only remaining notes are: unchanged pre-existing known gaps, or checks blocked by environment (e.g. no test-payment setup, no Admin account, Maestro/device unavailable), each named in the report. |
| **PARTIAL** | Run what is missing, or record why it can't run and stop as `PARTIAL`. |
| **FAIL** | Next iteration, unless an escalation trigger applies. |

## 9. Iteration budget and escalation

**Budget: 3 iterations (USER SAID 2026-09-17).** The earlier conflict between "loop until 100%" and the
`territool-loop` budget is resolved in favour of 3.
- Strike 3 is **not** giving up. At strike 3 the loop must change **strategy**, not code: re-open the
  requirement, re-verify ground truth, re-trace the flow, question whether the failing test is itself wrong.
- Then it either proceeds on the new strategy or escalates.
- An escalation with a clear diagnosis is a successful outcome.

Escalation triggers (stop and ask the user with the blocker):

1. **No progress:** the same gate item fails in **3 consecutive iterations** with no measurable progress (same evidence).
2. **Product decision needed:** the fix requires choosing behaviour not defined in `conventions-shared.md` S3, `parity-map.md` or the spec.
3. **Scope breach:** the fix would require changing old code outside the task (S0.2), a frozen file (W7), a T0 module not in the plan, an unrelated BLOCKER flow, or more than `max_files_touched` files.
4. **Forbidden action needed:** production access, a paid/external action without the staging test-payment setup, a commit/push, a new dependency, changing the LAN-exposed `.env`, or touching V1.
5. **Environment missing:** a BLOCKER/HIGH verification can't run (missing device, build, staging down). BLOCKER/HIGH unverified = FAIL unless the owner waives it in writing. Standing waivers, which don't trigger escalation (see `qa-gate.md`): payment/credit-spend confirm steps and Admin role checks.
6. **Budget spent:** iteration 3 ended without PASS and the strategy change did not produce a new plan.

Escalation message: task · iteration # · what is blocking (gate item + evidence) · what was tried · what was
learned · options (with a recommendation) · what evidence or decision would unblock it · what stays
unverified. Escalating is a successful outcome, not a failure.

## Never, to make the loop pass

- Weaken, skip or delete a test or gate item.
- Relabel a new defect as a known gap.
- Mark a BLOCKER/HIGH check N/A without a reason the gate allows.
- Point tests at production.
- Edit old code "while you're there".

---

## 10. Report format [L§7]

Generated **from the state file**, not from recollection. The router's "final message" (SKILL.md) is the
short form of this.

```
STATUS: PASS | PARTIAL | BLOCKED | FAILED | ANALYSIS
iterations used: n/3

REQUEST
UNDERSTANDING
ROOT CAUSE / INSERTION POINT
EVIDENCE            (claim → tier → source)

CHANGES             (file → what → why)
NOT CHANGED         (what you deliberately left alone, and why)

PLATFORMS
  mobile:  changed | unaffected | NEEDS FOLLOW-UP
  web:     ...
  portal / admin / api / mcp / system: ...
  parity:  identical | intentionally different (reason) | DRIFT INTRODUCED ⚠

GATES
  static / unit / integration / functional / e2e / visual / parity
  → each with PASS | FAIL | NOT RUN | N/A | NOT VERIFIED and the command used

REGRESSION          (flow → stamp)
BRAIN UPDATES       (which brain/context/* files are now stale, and why)
UNVERIFIED RESIDUE  (everything you could not confirm — be exhaustive here)
KNOWLEDGE           (the §8 checklist with entry ids; memory loaded; memory written)
STATES              IMPLEMENTED / TESTED / QA VERIFIED / VISUALLY VERIFIED / RUNTIME VERIFIED / KNOWLEDGE SYNCED
NOTHING COMMITTED   (unless the owner asked)
NEXT                (what the owner should do or decide)
```

## 11. Modes [L§8]

Say the mode name to switch. Default is the full loop.

- **`analysis only`** — INTAKE → GROUND → IMPACT → PLAN, then stop. No writes to `repos/`. Return the plan and wait.
- **`qa only`** — no product code changes. Establish ground truth, execute checks, capture actual vs expected,
  assign severity with evidence. Never adjust the expected behaviour to match what the code does.
- **`design only`** — read `brain/context/design-system.md` and the approved screenshots first, reuse existing
  components, enumerate every state (default, loading, empty, error, success, disabled, focus, selected,
  long-content), then visual-QA against evidence. No approved visual → `Visual QA: NOT VERIFIED`.
- **`bug`** — reproduce before theorising. The reproduction becomes a permanent regression test.
- **`feature`** — find the closest existing Territool feature and follow its pattern before designing a new one.

## 12. Brain self-correction [L§9]

When verified evidence contradicts something in `brain/context/*`:

1. Do not silently follow the code and move on.
2. Record the conflict in the state file (and `contradiction-register.md`).
3. Determine which is correct — the brain doc, or the implementation (source-of-truth order in the register).
4. Correct the brain doc, with the evidence and date appended. Also write a `correction` memory entry that holds
   **both** the old and the new claim: `node tools/memory.js new --type correction …`.
5. Never edit a brain doc to make a failed implementation look correct.

The brain is allowed to be wrong. It is not allowed to stay wrong silently.

## 13. Start [L§10]

On receiving a Territool task, after router Step 0, output:

```
LOOP START
task:       <slug>
state:      workspace/loop/<path>/state.md
classified: <type> | platforms: <list> | criticality: <level>
plan for GROUND (3 lines):
```

Then execute INTAKE → GROUND. **Pausing after GROUND is conditional (USER SAID 2026-09-17)**, replacing the
old "always stop at the GROUND exit condition". Pause and show the ground-truth table when **any** of these is true:

| Code | Pause when |
|---|---|
| `P-UNKNOWN` | an `UNKNOWN` remains that would change the plan |
| `P-CRIT` | criticality is BLOCKER or HIGH |
| `P-SHARED` | shared code is touched, or both platforms are affected |
| `P-FILES` | files to change > `max_files_touched` |
| `P-CONFLICT` | a conflict was found between sources |
| `P-BEHIND` | the memory is behind HEAD by more than `memory_behind_threshold` commits |

Otherwise go straight to PLAN, and put the ground-truth table in the final report.

**Log every pause.** Write `pause: <codes>` into the state file. Also append one row to `workspace/loop/PAUSES.md` (not created yet)
(date · task · codes; the first pause creates the file). If one code causes nearly every pause, it is miscalibrated,
and the owner wants to see that in this data.

### INTAKE production check (incident `VAULT-20260917-ef8968`)

Before any task that runs the mobile app, read `repos/mobile/App/config/index.js`. If the active `URL_BASE` is not
staging → `BLOCKED`, report it, and change nothing.
- The file is the owner's (Law 6).
- A running Metro serves the working tree live, so every debug build follows it.
- Also refuse to start Codex or Cursor with `repos/web` as the working directory (`tooling.md` §3).

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (49)

**Documents (32):** [[brain/audits/01-mobile|Audit 1 – mobile app review]] · [[brain/audits/07-validation|Audit 7 – proving the brain works]] · [[brain/audits/09-external-sources|Audit 9 — external sources reviewed for the brain]] · [[_code/brain/brain/gates/scripts/static-checks.js|Automatic code checker]] · [[brain/gates/qa-gate|Checklist – final quality check]] · [[brain/context/contradiction-register|Contradiction register: where two sources disagreed, and which won]] · [[brain/context/design-system|Design system (colours, fonts, spacing)]] · [[workspace/qa-reports/2026-09-16-f01-login-api-contract|F01 QA report — Login & session]] · [[brain/memory/entries/decision/20260917-bcff7d-iteration-budget-is-3-at-strike-3-change-strateg|Iteration budget is 3; at strike 3 change strategy, then proceed or escalate]] · [[brain/memory/README|Knowledge memory — start here]] · [[workspace/qa-reports/2026-09-17-knowledge-memory-audit|Knowledge memory audit — 2026-09-17]] · [[brain/context/known-fragile|Known problems & risky areas]] · [[brain/context/mobile-screenshot-index|List of all screenshots]] · [[log|Log]] · [[brain/context/parity-map|Mobile vs web differences]] · [[brain/memory/entries/decision/20260917-8d68b7-pause-after-ground-only-on-six-conditions-and-lo|Pause after GROUND only on six conditions, and log which one triggered]] · [[brain/context/flows|Product features list]] · [[workspace/qa-reports/2026-09-17-knowledge-memory-build|QA report: knowledge memory build and confidence loop (2026-09-17)]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/conventions-shared|Rules for all code]] · [[brain/skills/territool-design/SKILL|Skill – design]] · [[brain/skills/territool-qa/SKILL|Skill – final quality check]] · [[brain/skills/territool-router/SKILL|Skill – task router (start of every task)]] · [[brain/skills/territool-test/SKILL|Skill – testing]] · [[brain/skills/territool-code/SKILL|Skill – writing code]] · [[CLAUDE|Start here – brain overview]] · [[workspace/loop/20260916-ts2345-commonfunctions/state|TASK: ts2345-commonfunctions]] · [[brain/context/stack|Tech setup & environments]] · [[brain/skills/territool-loop/SKILL|TERRITOOL LOOP — superseded, moved to LOOP.md]] · [[brain/memory/entries/decision/20260917-64a7b5-territool-loop-merged-into-territool-router-loop|territool-loop merged into territool-router LOOP.md; the old skill is a redirect stub]] · [[brain/context/tooling|Tooling: which agent runs the brain, and what each one needs]] · [[brain/memory/entries/correction/20260917-eaa29a-typescript-file-count-1-source-file-plus-2-decla|TypeScript file count: 1 source file plus 2 declarations, not "1" or "3"]]

**Product features (2):** [[_id/F08|Create route]] · [[_id/F01|Login & session]]

**Coding rules (4):** [[_id/W7|Business logic in services]] · [[_id/S0.2|Change new code only]] · [[_id/S0.1|Never touch the live app]] · [[_id/S0.7|Stop and ask when unsure]]

**Quality checks (7):** [[_id/QG-8|API contract suite for mobile + MCP consumers when V2 /…]] · [[_id/QG-13|Knowledge captured]] · [[_id/QG-6|New functionality verified against the request / spec…]] · [[_id/QG-12|No secrets in the report]] · [[_id/QG-9|Parity check for shared flows]] · [[_id/QG-2|Production untouched during the task and tests]] · [[_id/QG-7|Regression: every impacted flow re-verified per tier…]]

**Problem found (1):** [[_id/KG-UI8|Delete-contact sheet survives navigation]]

**Screenshot (1):** [[_capture/LR-01|Login screen]]

**Code files (2):** [[_code/mobile/App/config/index.js|config/index.js]] · [[_code/mobile/App/components/contacts/view.js|view.js]]

%% brain-links:end %%
