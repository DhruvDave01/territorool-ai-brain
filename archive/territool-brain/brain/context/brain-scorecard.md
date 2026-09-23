---
area: context
tags: [brain/context]
ref: "Brain scorecard: 18 categories, rubric, iterations"
---

# Brain scorecard: 18 categories, rubric, iterations

**What this scores:** how well the brain equips an agent to know, answer and act on Territool correctly. It
does **not** score the product. A known product defect that the brain documents accurately does **not**
lower a score (owner instruction 2026-09-16, "Existing TerriTool issues").

**Companion score:** `confidence-score.md` measures readiness per *feature*. This scorecard measures the
brain per *knowledge category*. Both are evidence-based. Neither is inflated to reach a target.

**Target (owner, 2026-09-16):** every category ≥ 90, or its blocker named here and in `UNKNOWN_REGISTER.md`.

## 1. Rubric

Each category is scored on five checks, 20 points each. A check earns **20** only when its evidence exists
**and** has been checked against a source. It earns **15** when it is complete except for a gap that is named
in `UNKNOWN_REGISTER.md` and needs access or an owner decision (so the brain cannot close it alone). It earns
**10** when the evidence is partial, or only code-read where runtime was needed. It earns **0** when missing.
(The 15 step was added in iteration 1, before any iteration-1 score was set.)

| # | Category | Five checks (20 each) |
|---|---|---|
| 1 | Product understanding | (a) product purpose + roles defined · (b) all features F01–F32 listed with criticality · (c) business rules documented with evidence · (d) system map USER→…→NEXT STATE exists · (e) glossary current, with no stale rows |
| 2 | Mobile flow knowledge | (a) step-level write-ups for the core flows · (b) screenshots/video per flow · (c) screen inventory tied to code · (d) **runtime-verified by the agent** this cycle · (e) known mobile defects linked to flows |
| 3 | Web flow knowledge | (a) page inventory per role · (b) screenshots per role · (c) step-level web flows for the core features · (d) runtime-verified by the agent this cycle · (e) web defects linked to flows |
| 4 | Role & permission knowledge | (a) roles defined with the code that enforces them · (b) role × surface matrix · (c) role × capability matrix · (d) access **probed at runtime** · (e) API-layer gaps (no role gate, ownership) documented |
| 5 | Design brain | (a) approved tokens · (b) component rules with when/why · (c) per-surface patterns (mobile, portal, HQ, Blade) · (d) states (loading/empty/error) documented · (e) design claims verified against code/screens, inferred ones labelled |
| 6 | Architecture knowledge | (a) system overview · (b) mobile architecture · (c) web/portal/HQ architecture · (d) MCP + integrations · (e) build/deploy/env + cross-cutting concerns |
| 7 | API knowledge | (a) complete endpoint list · (b) auth/envelope/error rules · (c) consumers per endpoint · (d) request/response shapes for key endpoints · (e) runtime-observed responses |
| 8 | Data/model knowledge | (a) stores · (b) entity list with tables · (c) relationships · (d) where each feature's data lives · (e) unknowns (no schema) stated |
| 9 | Cross-platform mapping | (a) parity per feature · (b) business-rule divergences with evidence · (c) intentional vs accidental classified · (d) UNVERIFIED rows reduced with evidence · (e) mobile ↔ web ↔ API ↔ data traced for core features |
| 10 | QA coverage | (a) test strategy + gates · (b) test cases per BLOCKER/HIGH feature · (c) runnable suites (API, web, mobile) · (d) suites actually run with recorded results · (e) QA reports with verdicts |
| 11 | Evidence quality | (a) claims cite file:line/screenshot · (b) evidence ledger exists · (c) VERIFIED/INFERRED/UNKNOWN labelling · (d) runtime evidence where runtime matters · (e) evidence dated and re-checkable (commands) |
| 12 | Documentation completeness | (a) every category has a home note · (b) every feature has entry points · (c) registers (unknowns, improvements, contradictions) exist · (d) nothing important only in chat · (e) change log per iteration |
| 13 | Documentation accuracy | (a) sample of claims re-verified this cycle · (b) contradictions found were fixed · (c) no stale counts/dates in hand-written notes · (d) generated tables provably current (`--check`) · (e) wiki-lint 0 fail |
| 14 | Brain consistency | (a) contradiction register exists · (b) all open contradictions resolved or owned · (c) two views in parity · (d) the same question gets the same answer (Brain QA repeat) · (e) terms used consistently (glossary gate) |
| 15 | Unknown/uncertainty handling | (a) unknown register · (b) owner questions tracked · (c) UNVERIFIED markers on unproven rows · (d) "do not assume" rules enforced in skills · (e) Brain QA answers say "not verified" when they should |
| 16 | Maintainability | (a) generated parts have generators · (b) `--check`/parity/lint tooling · (c) one sync command · (d) self-tests for tools · (e) ownership rules (who writes the brain) |
| 17 | Searchability/navigation | (a) entry file + router · (b) index/graph · (c) hub notes · (d) every note reachable · (e) consistent note names and refs |
| 18 | Future developer usefulness | (a) setup + doctor · (b) conventions + canonical examples · (c) impact map/risk tiers · (d) gates runnable by any tool · (e) Brain QA shows an agent can answer real questions from the brain alone |

## 2. Iterations

| Category | It. 0 (found) | It. 1 | It. 2 | It. 3 |
|---|---:|---:|---:|---:|
| 1 Product understanding | 70 | 95 | | |
| 2 Mobile flow knowledge | 80 | 95 | | |
| 3 Web flow knowledge | 60 | 95 | | |
| 4 Role & permission | 50 | 95 | | |
| 5 Design brain | 80 | 80 | | |
| 6 Architecture | 70 | 95 | | |
| 7 API | 50 | 95 | | |
| 8 Data/model | 40 | 95 | | |
| 9 Cross-platform mapping | 70 | 90 | | |
| 10 QA coverage | 40 | 75 | | |
| 11 Evidence quality | 70 | 95 | | |
| 12 Documentation completeness | 60 | 95 | | |
| 13 Documentation accuracy | 70 | 90 | | |
| 14 Brain consistency | 60 | 95 | | |
| 15 Uncertainty handling | 70 | 95 | | |
| 16 Maintainability | 90 | 80 | | |
| 17 Searchability | 90 | 90 | | |
| 18 Future developer usefulness | 80 | 95 | | |
| **Average** | **67** | **92** | | |
| **Lowest** | 40 | **75** (QA) | | |

### Iteration 0: how the starting scores were reached (2026-09-16, before this loop)

| Category | Checks earned | Missing |
|---|---|---|
| 1 | a 20 · b 20 · c 10 (business rules read from screenshots, not code) · d 0 (no system map) · e 20 | system map; rules not checked against code |
| 2 | a 20 · b 20 · c 20 · d 0 (no agent runtime run) · e 20 | runtime verification |
| 3 | a 10 (page list only in screenshot indexes) · b 20 · c 0 (no step-level web flows) · d 10 (the 2026-09-15 capture only) · e 20 | web flow write-ups, page inventory per role |
| 4 | a 20 · b 10 · c 0 · d 10 (the 2026-09-15 capture landed each role) · e 10 | capability matrix, runtime probe |
| 5 | a 20 · b 20 · c 20 · d 10 · e 10 | states per surface; some inferred rules unlabelled |
| 6 | a 0 · b 20 · c 20 · d 20 · e 10 | one-page system view; build/deploy |
| 7 | a 0 · b 20 · c 10 · d 10 · e 10 | endpoint map; consumers per endpoint |
| 8 | a 10 · b 10 · c 10 · d 10 · e 0 | a data-model note at all |
| 9 | a 20 · b 20 · c 20 · d 0 · e 10 | 11 UNVERIFIED parity rows |
| 10 | a 20 · b 0 (F01 only) · c 10 · d 10 · e 0 (one report) | test cases for BLOCKER/HIGH; runs |
| 11 | a 20 · b 0 · c 10 · d 20 · e 20 | ledger; consistent labels |
| 12 | a 10 · b 20 · c 0 · d 10 · e 20 (`log.md`) | registers, home notes for API/data/architecture |
| 13 | a 10 · b 10 · c 10 · d 20 · e 20 | a re-verification pass |
| 14 | a 0 · b 0 · c 20 · d 20 · e 20 | a contradiction register |
| 15 | a 0 · b 20 · c 20 · d 20 · e 10 | an unknown register |
| 16 | a 20 · b 20 · c 20 · d 20 · e 10 | the writer rule is only partly enforced (two writers seen 2026-09-16) |
| 17 | a 20 · b 20 · c 20 · d 20 · e 10 | mixed note naming |
| 18 | a 20 · b 20 · c 20 · d 20 · e 0 | Brain QA never run |

### Iteration 1 (2026-09-16): checks earned

Maintainability drops from 90 to 80 because iteration 1 **added** generators whose checks are not yet wired into
one command, and because two writers edited the brain at the same time today. The rubric was applied
honestly, not smoothed.

| Category | Checks earned | Evidence | Still missing |
|---|---|---|---|
| 1 | a 20 · b 20 · c 15 · d 20 · e 20 | `system-map.md`; `business-rules.md` §10 (code-verified rules); glossary CR-01/CR-03 fixed | plan credit figures disagree (CR-22, owner/DB) |
| 2 | a 20 · b 20 · c 20 · d 15 · e 20 | Maestro runs, both roles (EV-M01…M12) | the brain's own runs are navigation-only; writes rely on owner captures |
| 3 | a 20 · b 20 · c 20 · d 15 · e 20 | `web-flows.md` (69 pages, W-F01…W-F27) | Admin HQ runtime (captcha, U-ADM-01) |
| 4 | a 20 · b 20 · c 20 · d 15 · e 20 | `roles-permissions.md`; access matrix; TC-F01-006/007/008 | Admin HQ runtime (U-ADM-01) |
| 5 | a 20 · b 20 · c 20 · d 10 · e 10 | unchanged this iteration | a state catalogue per surface; a verification pass on design claims |
| 6 | a 20 · b 20 · c 20 · d 20 · e 15 | `architecture.md` | build/deploy process (U-DEP-01, owner) |
| 7 | a 20 · b 20 · c 20 · d 15 · e 20 | `api-map.md` §1–§6; 26 contract cases | write-endpoint request fields (U-API-01) |
| 8 | a 20 · b 20 · c 20 · d 15 · e 20 | `data-model.md` (generated + prose) | F21/F22/F28 data not traced |
| 9 | a 20 · b 20 · c 20 · d 10 · e 20 | parity rows F20/F26/F27 settled; system map | 9 rows still UNVERIFIED (F03, F05, F06, F07, F09, F17, F19, F21, F28) |
| 10 | a 20 · b 10 · c 15 · d 20 · e 10 | 26 API cases + 1 Maestro flow, run and recorded | cases for F02, F06, F09, F10, F13, F14, F15, F23, F24; web assertions; a current QA report |
| 11 | a 20 · b 20 · c 15 · d 20 · e 20 | `evidence-ledger.md` (EV-M/W/A/C) | older notes are not uniformly labelled |
| 12 | a 20 · b 20 · c 20 · d 20 · e 15 | registers + 7 new home notes | the iteration log entry (written at the end of the iteration) |
| 13 | a 20 · b 20 · c 20 · d 20 · e 10 | `cite-check.js` (0 drift after fixes); `--check` generators | wiki-lint: 2 fails (the final report files are not written yet) |
| 14 | a 20 · b 20 · c 20 · d 15 · e 20 | CR-01…CR-29; Brain QA 30/30 consistent | a second QA run after the fixes |
| 15 | a 20 · b 20 · c 15 · d 20 · e 20 | `UNKNOWN_REGISTER.md`; Q13/Q14/Q20 answered "unknown" | older notes' unlabelled claims |
| 16 | a 20 · b 20 · c 10 · d 10 · e 10 | 4 new generators with `--check` | one command that runs every check; self-tests for the new tools; the single-writer rule was broken today |
| 17 | a 20 · b 20 · c 15 · d 20 · e 15 | vault parity OK; new notes indexed | new notes not listed in `CLAUDE.md`/`agent-brief.md`; UPPERCASE register names (owner-specified) |
| 18 | a 15 · b 20 · c 20 · d 20 · e 20 | Brain QA 97% brain-only | doctor NOT READY (Codex CLI not on PATH) |

## 3. Gap → action (latest iteration)

| Category | Score | Missing | Brain action (iteration 2) | New score |
|---|---:|---|---|---:|
| 10 QA coverage | 75 | cases for most BLOCKER/HIGH features; web assertions; current QA report | add read-only/validation-only contract cases (F02, F06, F09, F10, F13, F14, F15), a manager-portal read suite (F23, F24), mobile test-case doc, QA report | |
| 5 Design brain | 80 | state catalogue; verification of design claims | build a per-surface state catalogue from runtime + owner screenshots; verify design-system claims against code | |
| 16 Maintainability | 80 | one check command; self-tests; writer rule | `tools/brain-check.js` running every `--check`; self-tests for the generators | |
| 9 Cross-platform | 90 | 9 UNVERIFIED rows | settle the rows the code can settle | |
| 13 Documentation accuracy | 90 | wiki-lint fails | write the final reports; rerun | |
| 17 Searchability | 90 | new notes not in entry files | list them in `CLAUDE.md` and `agent-brief.md` | |

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (41)

**Documents (18):** [[brain/context/api-map|API map: every V2 endpoint, who calls it, and how it behaves]] · [[brain/context/architecture|Architecture: how Territool is built, end to end]] · [[brain/audits/10-brain-final-audit|Audit 10 — Territool AI Brain final audit]] · [[brain/context/brain-qa|Brain QA: questions the brain must answer correctly, and how it did]] · [[brain/context/business-rules|Business rules: plans, credits and money]] · [[brain/context/confidence-score|Confidence score: how ready the brain is for a task]] · [[brain/context/data-model|Data model: what Territool stores and where]] · [[brain/context/evidence-ledger|Evidence ledger: what was checked, how, and what it proves]] · [[log|Log]] · [[workspace/qa-reports/2026-09-16-brain-improvement-loop|QA report: autonomous brain improvement loop (iteration 1)]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/roles-permissions|Roles and permissions: who can do what, where, and what enforces it]] · [[CLAUDE|Start here – brain overview]] · [[brain/context/system-map|System map: role → platform → screen → action → API → data → result → next]] · [[workspace/tasks/2026-09-16-brain-improvement-loop|Task brief: autonomous brain improvement loop to 90+]] · [[brain/context/agent-brief|Territool brain — operating brief for any AI coding tool]] · [[brain/context/UNKNOWN_REGISTER|Unknown register: what the brain does not know yet]] · [[brain/context/web-flows|Web flows: every web page per role, and how the core features run on web]]

**Product features (22):** [[_id/F14|Activities / notes / log meetings]] · [[_id/F06|AI Find Leads → save leads]] · [[_id/F32|App launch, permissions, crash, offline]] · [[_id/F22|Bulk CSV upload]] · [[_id/F24|Business Sales Agent management]] · [[_id/F13|Contacts]] · [[_id/F21|CRM sync]] · [[_id/F05|Dashboard, activity feed, calendar]] · [[_id/F15|Find & buy contacts]] · [[_id/F01|Login & session]] · [[_id/F23|Manager portal]] · [[_id/F10|Mark visited & visit log]] · [[_id/F27|Notifications & push]] · [[_id/F07|Places / Yelp leads]] · [[_id/F19|QR route import]] · [[_id/F28|Referral invites]] · [[_id/F02|Registration & onboarding]] · [[_id/F09|Route detail & navigation]] · [[_id/F20|Settings / status tags / stages]] · [[_id/F17|Share route/list]] · [[_id/F03|Subscription / paywall / upgrade / cancel / credits…]] · [[_id/F26|Support tickets]]

**Coding rule (1):** [[_id/M12|Meaningful test IDs]]

%% brain-links:end %%
