---
area: workspace
tags: [brain/workspace]
ref: "Knowledge memory audit — 2026-09-17"
---

# Knowledge memory audit — 2026-09-17

**Verdict: AUDIT (read-only).** Run against the "Knowledge Vault — Install / Audit Prompt (V2)". Branch taken:
**AUDIT**, because vault-shaped content already exists under other names. Nothing was changed during the audit.
Owner decisions that followed are recorded at the end (USER SAID 2026-09-17, owner: aj@territool.com).

The four `Master Claude AI Brain — Mandatory Knowledge Vault & Continuous Brain Sync*.md` files in the owner's
Downloads are the V1 prompt split in four (sections 1–74); V2 supersedes it. V1 §47 (PR knowledge check) was
dropped by V2 and is re-adopted below.

## 1. Existing vault-shaped content (STEP 0)

| V2 concept | Existing home | Size on 2026-09-17 |
|---|---|---|
| evidence entries | `brain/context/evidence-ledger.md` (EV-ids, append-only) | 51 rows |
| `conflict` | `brain/context/contradiction-register.md` (CR-ids) | 29 rows; 0 exactly `Open`, 6 with an unparsed status |
| `bug` / `antipattern` | `brain/context/known-fragile.md` (KG-ids) + draft `shoebox/09-known-issues/fragile.md` | 45 rows |
| unfixed findings | `brain/context/UPCOMING_IMPROVEMENTS.md` (UI-ids) | 23 rows |
| `question` | `brain/context/open-questions.md` (Q-ids, 6 open) · `brain/context/UNKNOWN_REGISTER.md` (U-ids) | 18 + 19 rows |
| `decision` / `product` | owner approvals in `brain/audits/*.md` (BT-, D-, S-ids), `conventions-*.md` | 10 audit files |
| timeline | `log.md` (written by `tools/log.js`) | 23 entries: 11 build, 5 decision, 4 ingest, 1 fix, 1 lint, 1 query |
| `qa` / `testing` | `workspace/qa-reports/`, suites, `workspace/loop/*/state.md` | 20 reports |
| LAST-SYNC | `workspace/loop/2026-09-16-brain-loop/baseline-git.txt` | mobile `f20c5aa`, web `21d6348c` |
| index | `brain/audits/data/brain-index.json` | 1,443 nodes, 11,609 edges |
| repo-side docs | mobile `docs/` (Code-Audit-Report-2026-07-06, RELEASE_AND_QA_*, navigation audit, deep-linking, RevenueCat guide), `App/docs/ICON_AUDIT.md`, `.cursor/clarity-mcp/knowledge/purchase-flows.json` | not yet treated as memory input |

No ADR folder, CHANGELOG, CLAUDE.md or AGENTS.md in either repo. Claude's project memory folder is empty.

## 2. Audit checks

| Check | Result |
|---|---|
| Typed V2 entries | 0 (`brain/vault/` does not exist) |
| Entries ever deleted | **NOT RUN** — the brain folder was not a git repository |
| Overwritten instead of superseded | **UNKNOWN** — same reason |
| Supersession chains | not structured; appears in the ledger's rule text and once in `log.md` prose |
| VERIFIED with unresolvable source | full source walk not run; `wiki-lint`: 0 fail · 12 warn (4 uncited derived-truth notes: `brain-qa`, `design-states`, `system-map`, `web-screenshot-index`; dead link to the planned, not-yet-created manual checklist in workspace/test-cases) |
| Duplicate clusters | `known-fragile.md` ⊃ `fragile.md` draft; build/version facts in `territool-loop` §0, `stack.md`, `tooling.md`; production-MCP warning in `tooling.md` and the loop skill |
| Empty implications | not measurable (no such field) |
| Orphans | no V2-style tracking; wiki-lint covers dead links only |
| Secrets (text) | none found; password-shaped hits were variable reads, deliberate wrong-password tests and `example.invalid`; yopmail addresses are not staging logins. **Images and videos not scanned.** |
| Capture rate, 90 days (short SHA mentioned anywhere in the brain) | mobile **4 / 52** · web **4 / 175** |
| Commits behind HEAD | 0 / 0 against the saved baselines |
| Manual changes since baseline | mobile uncommitted: `App/utils/bulkContactFetch.js`, `App/components/route/contact/people.js`, two tests, `android/app/build.gradle` — no memory entry (owner: in progress, do not ingest) |
| Commands / hooks | none; only the brain-sync Stop hook |

### Findings

1. **QA verdicts overclaim.** 9 features were `PASS` (F08, F11, F13, F14, F16, F24, F26, F27, F28) on 1–2 read-only
   happy cases; F11 was `PASS` while its report records "accidentally different" parity.
   > **CORRECTION 2026-09-17 (later the same day):** the count was wrong. Re-running the pre-fix generator on the
   > same run data gives **10 PASS** (the list above plus **F23**, 7 cases) and **8 generated PASS-WITH-NOTES**
   > (F02, F03, F05, F06, F09, F10, F12, F20), plus the hand-written F01 report (PASS-WITH-NOTES). The finding
   > itself stands. Original sentence kept above (Law 1).
2. **Generator bug.** `tools/qa-report.js:30` had an Arabic `\س` where `\s` belongs; all 18 generated reports showed
   `Criticality: —`.
3. **Evidence labels differ** between the ledger (Verified-RT/Code/Owner/Inferred) and V2
   (VERIFIED/VISUAL/DOCUMENTED/INFERRED/UNKNOWN).

## 3. Conflicts between V2 and the brain (raised) → decisions

| # | Conflict | Owner decision (USER SAID 2026-09-17) |
|---|---|---|
| Q1 | "vault" already means the Obsidian vault | Folder is **`brain/memory/`**; commands are `/memory-*` |
| Q2 | two id systems (Law 3) | **Convert registers**, link-preserving, smallest first: open-questions → UNKNOWN_REGISTER → UPCOMING_IMPROVEMENTS → known-fragile (+ fold `fragile.md`) → contradiction-register (resolve 6 statuses) → evidence-ledger. Old table files are regenerated from entries at the same paths with the same id columns; any broken citation = wrong migration |
| — | evidence labels | `Verified-RT → VERIFIED`, `Verified-Code → VERIFIED`, `Verified-Owner → DOCUMENTED` + `origin: user-statement`, `Inferred → INFERRED`; anything else → `NEEDS-REVALIDATION` |
| Q3 | `/brain-sync` name clash | keep `tools/brain-sync.js`; V2's reconciliation is **`/memory-sync`** |
| Q4 | two loop skills | merge into the one `CLAUDE.md` references, delete the other, record the merge as a memory entry |
| Q5 | git hooks in product repos | **dropped**; `/memory-sync` and loop INTAKE run `git log <baseline>..HEAD` on demand |
| Q6 | brain not under git | **`git init` now**, large videos ignored, initial commit = Law 1 baseline |
| Q7 | uncommitted `bulkContactFetch` work | owner's, in progress; do not ingest; every migration run first checks the working tree is clean and stops if not |
| F8 | id collisions across clones | ids are `<YYYYMMDD>-<6-char content hash>-<slug>` |
| Codex | Codex cannot write memory | boundary kept: Codex writes only `workspace/handoff/`; Claude captures from `result.md`; if Codex opens PRs, the PR knowledge check is the capture path |

Accepted additions to the schema: build ↔ commit mapping · PR knowledge check (read-only Bitbucket/GitHub) ·
feature confidence tied to entry freshness · images/videos as evidence (stable paths, size limits, personal-data
check before any GitHub push) · staging state by name only · approver identity on USER SAID · coverage on QA
results.

## 4. Queued for the first memory entries (step 5)

Recorded here until `brain/memory/` exists; each becomes one entry, nothing is dropped.

| Queued entry | Type | Source |
|---|---|---|
| `tools/qa-report.js` criticality regex: stray Arabic `\س` + pattern order hid criticality in every report. Implication: audit generated tooling for non-ASCII in pattern strings, and test the scanner on the character it targets | bug + fix | `log.md` 2026-09-17 fix |
| QA verdicts overclaimed (10 PASS + 8 PWN on 1–3 types); coverage-based verdicts, N/A-with-reason, coverage ranking | decision | this report §3; USER SAID 2026-09-17 |
| `brain-score.js` read any verdict line, not the first (documented) one | bug + fix | `tools/brain-score.js` self-test "only the first verdict line counts" |
| Loop skills merged into `territool-router/LOOP.md`; `territool-loop` superseded, deletion pending owner | decision | Q4 |
| One home for versions: `stack.md` §0 + `version-drift` lint | decision | step 3 |
| TypeScript count conflict (1 vs 3) resolved: 1 `.ts` source + 2 `.d.ts` | correction | `stack.md` §3 |
| `stack.md` said "no Codex CLI"; `codex` is on PATH | correction | `stack.md` §7 |
| Production MCP warning: canonical home `tooling.md` §3; brief and SETUP link to it. **Open:** brief said "left unchanged by owner decision", tooling says "owner action, until then" | conflict | step 3 |
| Mobile uncommitted bulk-contact work (owner's, in progress) — do not ingest | question / environment | Q7 |
| Capture-rate baseline: mobile 4/52, web 4/175 (90 days) | qa (measurement) | §2 |
| `brain/assets/videos/` is the **only copy of the visual ground truth**; frames can be re-extracted, videos cannot be regenerated; outside git; owner backs up | environment | USER SAID 2026-09-17 |
| Loop open questions: iteration budget (3 vs until-100%), mandatory pause after GROUND | question | `LOOP.md` §9, §13 |
| Design modes renamed AUDIT / PLACE / EXTEND / CREATE (letters clashed); routing + complexity gate added | decision | `territool-design` SKILL, USER SAID 2026-09-17 |
| Placement: Lists library filter → PLACE, trailing filter button, groups 7 → 8; web already filters (grid filter row) — parity gap | decision | `workspace/design-proposals/2026-09-17-lists-library-filter/placement.md` |

## 5. Build order (approved)

0. Fix the QA layer (regex, other non-ASCII in tool regexes/strings, coverage-based verdicts).
1. `git init` the brain.
2. Flag the four uncited notes `NEEDS-REVALIDATION`; fix the dead manual-checklist link.
   **Stop and show the regenerated QA reports.**
3. Merge loop skills; one canonical home for duplicated facts.
4. Build `brain/memory/`; migrate register 1 and prove the round-trip.
5. Seed first entries from this audit.

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (50)

**Documents (29):** [[brain/memory/entries/correction/20260917-71a6a0-audit-miscounts-10-pass-reports-not-9-4-open-con|Audit miscounts: 10 PASS reports (not 9), 4 open contradictions (not 0), MCP warning not in the loop skill]] · [[brain/memory/entries/qa/20260917-e58ccf-commit-capture-baseline-before-memory-existed-mo|Commit capture baseline before memory existed: mobile 4/52, web 4/175 (90 days)]] · [[_code/brain/tools/brain-score.js|Confidence score: how well the brain equips an agent to take a task on each product feature.]] · [[brain/context/contradiction-register|Contradiction register: where two sources disagreed, and which won]] · [[brain/context/evidence-ledger|Evidence ledger: what was checked, how, and what it proves]] · [[brain/memory/README|Knowledge memory — start here]] · [[shoebox/09-known-issues/fragile|Known issues draft]] · [[brain/context/known-fragile|Known problems & risky areas]] · [[log|Log]] · [[workspace/design-proposals/2026-09-17-lists-library-filter/placement|Placement walk-through: "add a filter to the Lists library"]] · [[brain/memory/entries/incident/20260917-ef8968-production-config-exposure|Production config near-miss: mobile API URL and production MCP servers (2026-09-17)]] · [[brain/memory/entries/decision/20260917-b29959-qa-verdicts-are-coverage-based-n-a-needs-a-speci|QA verdicts are coverage-based; N/A needs a specific reason; coverage ranks what to test next]] · [[brain/memory/entries/fix/20260917-442310-qa-report-js-criticality-regex-had-a-stray-arabi|qa-report.js criticality regex had a stray Arabic character and a pattern-order bug]] · [[brain/context/open-questions|Questions put to the owner, and what came back]] · [[_code/brain/tools/brain-sync.js|Rebuilds the brain's two views from one model, in the only order that is correct:]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/skills/territool-design/SKILL|Skill – design]] · [[brain/skills/territool-router/SKILL|Skill – task router (start of every task)]] · [[CLAUDE|Start here – brain overview]] · [[TASK_CONFIDENCE_LOOP|TASK_CONFIDENCE_LOOP — feature-level task confidence]] · [[workspace/loop/20260916-ts2345-commonfunctions/state|TASK: ts2345-commonfunctions]] · [[brain/context/stack|Tech setup & environments]] · [[brain/skills/territool-loop/SKILL|TERRITOOL LOOP — superseded, moved to LOOP.md]] · [[brain/skills/territool-router/LOOP|The fix-until-done loop]] · [[brain/memory/entries/decision/20260917-dda728-the-owner-s-uncommitted-bulk-contact-work-is-in-|The owner's uncommitted bulk-contact work is in progress and must not be ingested]] · [[workspace/handoff/2026-09-17-association-options/result|Three alternative Routes & Lists sections]] · [[brain/context/tooling|Tooling: which agent runs the brain, and what each one needs]] · [[brain/context/UNKNOWN_REGISTER|Unknown register: what the brain does not know yet]] · [[brain/context/UPCOMING_IMPROVEMENTS|Upcoming improvements: application findings not fixed during the brain work]]

**Product features (19):** [[_id/F14|Activities / notes / log meetings]] · [[_id/F06|AI Find Leads → save leads]] · [[_id/F24|Business Sales Agent management]] · [[_id/F12|Companies (Address Book)]] · [[_id/F13|Contacts]] · [[_id/F08|Create route]] · [[_id/F05|Dashboard, activity feed, calendar]] · [[_id/F11|Lists]] · [[_id/F01|Login & session]] · [[_id/F23|Manager portal]] · [[_id/F10|Mark visited & visit log]] · [[_id/F27|Notifications & push]] · [[_id/F28|Referral invites]] · [[_id/F02|Registration & onboarding]] · [[_id/F16|Report company/contact]] · [[_id/F09|Route detail & navigation]] · [[_id/F20|Settings / status tags / stages]] · [[_id/F03|Subscription / paywall / upgrade / cancel / credits…]] · [[_id/F26|Support tickets]]

**Code files (2):** [[_code/mobile/App/utils/bulkContactFetch.js|bulkContactFetch.js]] · [[_code/mobile/App/components/route/contact/people.js|people.js]]

%% brain-links:end %%
