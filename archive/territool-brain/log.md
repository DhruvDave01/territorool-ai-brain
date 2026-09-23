---
area: root
tags: [brain/root]
ref: "Log"
---

# Log

Append-only record of what has been done to this brain — ingests, questions worth keeping, lint runs,
builds, fixes and owner decisions. Newest first. Written by `node tools/log.js`; **never edit by hand
and never reorder** — the value is that entries are immutable once written.

```bash
grep "^## \[" log.md | head -10      # the last ten things that happened
grep "^## \[" log.md | grep ingest   # everything ever ingested
```

## [2026-09-17] fix | Sync kept OPEN incidents open; production URL_BASE now committed on TT_80 (5de027f)

Incident VAULT-20260917-ef8968 and bug 98c2b2 reopened with revalidation evidence; e1 counts unresolved incidents.
## [2026-09-17] build | Hub map view + clean Obsidian graph defaults

tools/hub-map.js draws the index as a tree (1,304 notes, 1,303 links) in views/hub-map/ and the page's Hub map button; main vault hides tags, attachments, code, screenshots, commit records. Decision VAULT-20260917-fd2483.
## [2026-09-17] build | Knowledge memory build + confidence loop closed (75.2/100, ceiling 91.2)

424 entries, 6/6 registers rendered, brain-check 17/17, API 109 (0 fail), web 63 (0 fail). Report: workspace/qa-reports/2026-09-17-knowledge-memory-build.md
## [2026-09-17] decision | Loop budget 3, conditional GROUND pause, loop stub; Lists filter decisions

USER SAID 2026-09-17. LOOP.md: budget 3 firm (strike 3 = strategy change then proceed or escalate); pause after GROUND only on P-UNKNOWN/P-CRIT/P-SHARED/P-FILES/P-CONFLICT/P-BEHIND, logged to state file + workspace/loop/PAUSES.md; INTAKE production-config check. territool-loop reduced to a redirect stub (original in 5d7214e), deleted after first commit. Design: interactive group = single intent + contiguous, purpose decides, stricter count default; D-DS9 filter trigger trails the search row; UI-UX-06 (List details defect), UI-DX-02 (shared filter button), UI-UX-07 (new list criteria on both platforms); parity-map F11 filter target = web exactly. Decision entry brain/memory/entries/decision/20260917-54748f-lists-library-filter-placement.md
## [2026-09-17] fix | Production config near-miss investigated (incident VAULT-20260917-ef8968)

Read-only. Mobile App/config/index.js points at production in uncommitted work (last write 13:00:54; also production before 11:35 when Codex switched it to staging for its tests). HEAD and last 60 commits: staging. Codex Maestro bulk-contact runs 11:53-12:41 hit staging only (emulator log: 148 staging, 0 production URLs). Tests mock API/config. Bulk fetch calls fetchAllContacts/fetchClaudeContact (paid provider lookups, reads customer records; no credit deduction in handlers). No Claude or Codex TerriTool MCP calls; Cursor connects to the production MCP servers listed in untracked repos/web/.cursor/mcp.json (handshakes on 5 days, no tool calls logged). Metro serves the working tree; emulator app in foreground. Nothing changed (Law 6). Entry: brain/memory/entries/incident/20260917-ef8968-production-config-exposure.md
## [2026-09-17] decision | Design skill: routing + PLACE mode; modes named

USER SAID 2026-09-17. territool-design now routes first (existing screen? same intent? complexity gate: second primary, >~7 interactive groups, fold, second scroll, new mental model) then runs AUDIT / PLACE / EXTEND / CREATE. Named instead of lettered because 'Mode A' already meant Audit in dated records; old letters mapped (A=AUDIT, B=EXTEND, C=CREATE); CLAUDE.md, router, probe-styles.js, design-states updated. Placement decision records queue for brain/memory. Worked example: workspace/design-proposals/2026-09-17-lists-library-filter/placement.md (PLACE; web /lists already has a grid filter row, mobile only searches by name).
## [2026-09-17] decision | Loop skills merged; one home for versions; QA coverage ranking

USER SAID 2026-09-17. territool-loop merged into brain/skills/territool-router/LOOP.md (the loop CLAUDE.md points at); old skill marked SUPERSEDED, deletion waits for owner approval (no deletions while the brain has uncommitted changes). Versions: canonical table brain/context/stack.md §0, copies in CLAUDE.md, agent-brief, tooling.md, loop replaced by links; tools/lib/versions.js + wiki-lint version-drift check (also compares §0 with package.json, Application.php, composer.lock, doctor.js). Production-MCP warning: canonical tooling.md §3. QA: N/A-with-reason (workspace/test-cases/coverage-na.json), coverage run/applicable, QA-COVERAGE.md ranking (F03, F02 first), F01 brought under the generator with its hand-written text as a verbatim appendix, wiki-lint qa-not-generated check, brain-score reads only the first verdict line. Overall score 68.4 -> 67.4. Audit miscount corrected: 10 PASS + 8 PWN before the fix, not 9 + 9. Videos in brain/assets/videos are the only copy of the visual ground truth.
## [2026-09-17] decision | Knowledge memory design decisions (owner)

USER SAID 2026-09-17: folder brain/memory/, commands /memory-*; convert registers link-preserving smallest first; evidence label mapping; keep tools/brain-sync.js, V2 reconciliation is /memory-sync; merge loop skills into the one CLAUDE.md references; no git hooks in product repos (pull-based git log scan); brain under git; do not ingest uncommitted mobile work, migrations stop on dirty tree; ids <YYYYMMDD>-<hash6>-<slug>; Codex boundary kept. Full record: workspace/qa-reports/2026-09-17-knowledge-memory-audit.md
## [2026-09-17] fix | QA verdicts made coverage-based; brain put under git

tools/qa-report.js: fixed stray Arabic char in the criticality regex (all 18 generated reports showed Criticality —) and reordered patterns; verdict is now PARTIAL unless every territool-test §2 coverage type has an executed case and parity has no open divergence. 18 reports regenerated: all PARTIAL (9 were PASS, 9 PASS-WITH-NOTES). brain-score overall 80.2 -> 68.4; TASK_CONFIDENCE_LOOP.md marked superseded. No other non-Latin/invisible characters found in brain code. git init, baseline 5d7214e, brain/assets/videos/ ignored. Four uncited context notes flagged NEEDS-REVALIDATION (warning kept visible); territool-test dead manual-checklist citation reworded as an explicit gap. Audit: workspace/qa-reports/2026-09-17-knowledge-memory-audit.md
## [2026-09-16] build | Codex CLI linked; doctor READY; full rebuild; brain-check 10/10

Symlinked the Codex CLI (codex-cli 0.153.4 from the desktop app plugin) into ~/.local/bin/codex; doctor now READY (2 optional misses). Normalised qa-report freshness compare to ignore sync frontmatter reflow; brain-check 10/10. Index rebuilt, graph+vault in parity.

**Refs:** tools/doctor.js, tools/qa-report.js, tools/brain-check.js
## [2026-09-16] build | Feature task-confidence loop: 54.8 → 80.2

19/32 features >=90 (F23 the flagged weakest now 100). Real evidence only: 17 per-feature QA reports from executed suites (tools/qa-report.js), 44 API + 9 web contract cases, 15 parity rows settled with runtime/code evidence, curated feature-code.json + web-screenshot->feature linking (real generator gaps). Evidence ceiling reached: 80.2/80.2 obtainable in this env (100% coverage); ~93.6 if payment/MCP-endpoint/device/captcha/graph blockers lifted. No app code changed; brain-score.js unchanged; no passwords/emails leaked. Docs: FEATURE_SCORE_MODEL.md, TASK_CONFIDENCE_LOOP.md.

**Refs:** TASK_CONFIDENCE_LOOP.md, FEATURE_SCORE_MODEL.md, tools/qa-report.js
## [2026-09-16] query | Brain QA 30 questions, two answerers

97% brain-only, identical answers, 3/3 unknowns handled; exposed 10 inconsistencies (CR-22..CR-29), all fixed. Secret remediation: account email removed from Maestro logs + web-explore.json + video-index.txt; runners hardened. No password/token/key leaked.

**Refs:** brain/context/brain-qa.md, workspace/qa-reports/2026-09-16-brain-improvement-loop.md
## [2026-09-16] build | Brain loop iteration 1: 67 → 92 average

New home notes: api-map, data-model, architecture, system-map, roles-permissions, web-flows, evidence-ledger, contradiction-register, UNKNOWN_REGISTER, UPCOMING_IMPROVEMENTS, brain-qa. Runtime: Maestro (SA, BSA), web-explore (SA, BSA, BA; Admin blocked by captcha), 26 API contract cases. New tools: api-map, data-model, web-explore, web-inventory, cite-check, test-cases-doc. Findings: UI-SEC-01/04/05/07 (critical/high). Lowest: QA coverage 75, Design 80, Maintainability 80.

**Refs:** brain/context/brain-scorecard.md
## [2026-09-16] decision | Admin account provided for read-only observation

Owner supplied an Admin login (stored only in .local/). Supersedes the 2026-09-15 waiver for observation; Admin write cases stay waived. /hq/login reCAPTCHA still blocks automated HQ observation (U-ADM-01).

**Refs:** stack.md, conventions-shared.md S6.4, CLAUDE.md, open-questions.md Q-T3
## [2026-09-16] decision | Confidence score approved and built

Owner approved a 0–100 per-feature score of what the brain holds (code, behaviour, parity, tests, QA; weighted by criticality). First reading 43/100. Printed by brain-start; per task via --feature.

**Refs:** tools/brain-score.js, brain/context/confidence-score.md
## [2026-09-16] build | index.md catalogue

143 written notes, one line each, grouped by area. Excluded from the graph like the _map hubs — it links to everything, so counting it would invent edges the shared view does not have.
## [2026-09-16] lint | first wiki-lint pass

0 fail, 9 warn, 19 info. Fixed what it found: two citations broken by yesterday's shoebox dedupe, the evidence-ladder examples in territool-loop that cited invented files, and four planned paths now marked as planned. Created brain/context/open-questions.md, which gave all 18 Q- ids a home and surfaced that six are still open.

**Refs:** tools/wiki-lint.js
## [2026-09-16] build | log.md and the wiki lint

Adopted the two disciplines from Karpathy's LLM Wiki gist that the brain genuinely lacked: an append-only timeline of what has been done, and a health check for the knowledge itself rather than only the code.

**Refs:** tools/log.js, tools/wiki-lint.js
## [2026-09-16] build | business-rules.md — gap W2 largely closed

Plans, credit costs, top-up pricing, trial terms, the paywall, manager licensing, admin levers and the enrichment provider (Apollo), each citing the screenshot it came from. Contact pricing matches mobile exactly, so F15 is confirmed at parity. Nothing in it has been verified against code yet — the note says so at the top.

**Refs:** brain/context/business-rules.md
## [2026-09-16] ingest | 101 owner web screenshots, all read and named

Admin 21, Manager 14, Salespeople 66. Every one was opened and described rather than left as a timestamp. Revealed that web is three different design languages, and produced the first hard business-rule evidence the brain has had.

**Refs:** ADM-/MGR-/SLS- ids, brain/context/web-screenshot-index.md, web-surfaces.md
## [2026-09-16] decision | Staging is the only environment

https://staging.territool.com and nothing else. repos/web/.codex/config.toml registers two production MCP servers and is left unchanged by owner decision, so Codex must never be opened with repos/web as its working directory. Already enforced in code by S-prod in static-checks.

**Refs:** conventions-shared S0.1
## [2026-09-16] fix | Shoebox deduplicated: 450.9 MB reclaimed

419 files were byte-identical to assets already in brain/assets. Removed only after each file's MD5 was re-verified against its twin immediately before unlink, and after repointing index-owner-screenshots.js and make-capture-thumbs.js at the library so the pipeline kept working. shoebox 431M → 116K.

**Refs:** tools/shoebox-dedupe.js
## [2026-09-16] ingest | 24 module-organised mobile screen recordings

30:12 across 10 modules, 1320×2868, build 42.32 (1) on staging, produced by Codex. 20 of 32 flows now have moving evidence — weakness W6 closed. Four new defects recorded, one (KG-UI8) with a root cause verified in code at contacts/view.js:1207. The footage itself has not been watched: ffmpeg is not installed, so the step descriptions are quoted from the capture manifest.

**Refs:** MV-01..MV-24, brain/context/mobile-videos.md
## [2026-09-16] build | brain-start, doctor and the INBOX

One command for a new member: asks which tools they use, verifies the setup actually exists and names the exact fix for anything missing, scans shoebox/00-INBOX for new material, rebuilds the brain and reports what is open.

**Refs:** tools/brain-start.js, doctor.js, inbox-scan.js
## [2026-09-16] decision | Tool-agnostic brain; Codex runs, Claude checks

Any coding tool may drive the brain. AGENTS.md, .cursor/rules and copilot-instructions are generated from one brief so they cannot drift. Only Claude Code writes brain/** and runs brain-sync; Codex runs suites and writes only under workspace/handoff/.

**Refs:** brain/context/tooling.md §3, agent-brief.md
## [2026-09-16] build | First end-to-end loop run: F01 API contract

Built the L3 API-contract suite (dependency-free node, staging-hardwired, credentials never printed) and drove one task through router → test → qa. Result: 7 passed, 1 blocked (no Admin credentials), 75 assertions. QG-8 became satisfiable for the first time. The loop found one defect — in the test, not the app — which was fixed in iteration 2.

**Refs:** workspace/qa-reports/2026-09-16-f01-login-api-contract.md
## [2026-09-16] build | One index, two views — with a parity check

brain-graph.js became the single extractor writing brain/audits/data/brain-index.json; obsidian-sync.js became a pure renderer of it; brain-parity.js proves the shared D3 page and the vault show the same nodes and edges. brain-sync.js runs all three in the only correct order.

**Refs:** tools/brain-sync.js, brain-parity.js
## [2026-09-16] build | Obsidian vault: the brain became browsable

Every note got area/tags properties and a managed Linked block turning backtick path citations into real wikilinks, plus _map/ hub notes. Bug found and fixed the same day: the strip regex matched the fence markers quoted in CLAUDE.md prose and truncated the file; restored from snapshot and covered by a self-test fixture.

**Refs:** tools/obsidian-sync.js
## [2026-09-15] decision | Owner decisions: no Admin login, no payment setup, offline dropped, PHP 7.4.33

Admin checks waived. Paid flows run up to the step before paying, then stop. Offline mode (BT-11) dropped. Staging PHP check skipped, target 7.4.33.

**Refs:** conventions-shared S3.9/S6.4, qa-gate waivers
## [2026-09-15] ingest | 51 staging web screenshots (Playwright)

Captured read-only against staging across public, Sales Agent, Business Sales Agent and Business Agent roles. Non-GET blocked except login; destructive-looking URLs blocked.

**Refs:** tools/capture-web.js
## [2026-09-15] ingest | 249 owner mobile screenshots

iPhone 17 Pro Max simulator, build 42.32 (1) development/staging, 10 flow folders. Given stable IDs (LR-, DB-, ST-, CAL-, AI-, SC-, AC-, RT-, LS-, AB-) and written up as 10 app journeys with shared parts S1–S12 and observations O1–O15.

**Refs:** brain/context/mobile-flows-captured.md, mobile-screenshot-index.md
## [2026-09-15] build | Bootstrap phases 0–7 completed and approved

Eight phases from inventory to validation, each stopped for owner approval. Produced brain/context (derived truth), brain/gates (4 gate files), brain/skills (5 skills) and brain/audits (the record of how every rule was established). Reconstructed from the audit files, not written at the time.

**Refs:** brain/audits/00-inventory.md … 07-validation.md

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (63)

**Documents (44):** [[brain/context/mobile-flows-captured|App journeys from screenshots]] · [[brain/audits/00-inventory|Audit 0 – what exists]] · [[brain/audits/07-validation|Audit 7 – proving the brain works]] · [[brain/context/brain-qa|Brain QA: questions the brain must answer correctly, and how it did]] · [[brain/context/brain-scorecard|Brain scorecard: 18 categories, rubric, iterations]] · [[brain/context/business-rules|Business rules: plans, credits and money]] · [[brain/context/confidence-score|Confidence score: how ready the brain is for a task]] · [[_code/brain/tools/brain-score.js|Confidence score: how well the brain equips an agent to take a task on each product feature.]] · [[workspace/qa-reports/2026-09-16-f01-login-api-contract|F01 QA report — Login & session]] · [[FEATURE_SCORE_MODEL|FEATURE_SCORE_MODEL — how tools/brain-score.js computes feature task confidence]] · [[workspace/qa-reports/2026-09-17-knowledge-memory-audit|Knowledge memory audit — 2026-09-17]] · [[brain/context/mobile-screenshot-index|List of all screenshots]] · [[brain/context/mobile-videos|Mobile screen recordings (owner, by module)]] · [[workspace/design-proposals/2026-09-17-lists-library-filter/placement|Placement walk-through: "add a filter to the Lists library"]] · [[brain/memory/entries/decision/20260917-54748f-lists-library-filter-placement|Placement: a filter on the Lists library (mobile LS-20)]] · [[brain/memory/entries/incident/20260917-ef8968-production-config-exposure|Production config near-miss: mobile API URL and production MCP servers (2026-09-17)]] · [[_code/brain/tools/brain-parity.js|Proves the two views of the brain show the same graph.]] · [[workspace/qa-reports/QA-COVERAGE|QA coverage ranking — what to test next]] · [[workspace/qa-reports/2026-09-16-brain-improvement-loop|QA report: autonomous brain improvement loop (iteration 1)]] · [[workspace/qa-reports/2026-09-17-knowledge-memory-build|QA report: knowledge memory build and confidence loop (2026-09-17)]] · [[brain/context/open-questions|Questions put to the owner, and what came back]] · [[_code/brain/tools/brain-sync.js|Rebuilds the brain's two views from one model, in the only order that is correct:]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/conventions-shared|Rules for all code]] · [[brain/skills/territool-design/SKILL|Skill – design]] · [[brain/skills/territool-router/SKILL|Skill – task router (start of every task)]] · [[brain/skills/territool-test/SKILL|Skill – testing]] · [[brain/memory/SOURCE-OF-TRUTH|Source of truth — which source wins, per question]] · [[CLAUDE|Start here – brain overview]] · [[workspace/tasks/2026-09-16-brain-improvement-loop|Task brief: autonomous brain improvement loop to 90+]] · [[TASK_CONFIDENCE_LOOP|TASK_CONFIDENCE_LOOP — feature-level task confidence]] · [[brain/context/stack|Tech setup & environments]] · [[brain/context/agent-brief|Territool brain — operating brief for any AI coding tool]] · [[brain/skills/territool-loop/SKILL|TERRITOOL LOOP — superseded, moved to LOOP.md]] · [[brain/skills/territool-router/LOOP|The fix-until-done loop]] · [[_code/brain/tools/lib/vault.js|The one definition of what the brain vault contains.]] · [[brain/context/web-surfaces|The three web surfaces, and how each one is built]] · [[_code/brain/tools/brain-graph.js|Tool – build this map]] · [[_code/brain/tools/make-capture-thumbs.js|Tool – make screenshot thumbnails]] · [[_code/brain/tools/probe-styles.js|Tool – measure page styles]] · [[_code/brain/tools/index-owner-screenshots.js|Tool – number the screenshots]] · [[_code/brain/tools/capture-web.js|Tool – take web screenshots]] · [[brain/context/tooling|Tooling: which agent runs the brain, and what each one needs]] · [[brain/context/web-screenshot-index|Web screenshots (owner, by role)]]

**Product features (6):** [[_id/F15|Find & buy contacts]] · [[_id/F11|Lists]] · [[_id/F01|Login & session]] · [[_id/F23|Manager portal]] · [[_id/F02|Registration & onboarding]] · [[_id/F03|Subscription / paywall / upgrade / cancel / credits…]]

**Coding rules (6):** [[_id/W2|API status is 1 or 0]] · [[_id/W6|Get the user safely]] · [[_id/S0.1|Never touch the live app]] · [[_id/S3.9|Offline mode dropped]] · [[_id/D3|Pressable for rows, AppButton for buttons]] · [[_id/S6.4|Staging test data rules]]

**Quality check (1):** [[_id/QG-8|API contract suite for mobile + MCP consumers when V2 /…]]

**Owner decisions (2):** [[_id/BT-11|Offline mode dropped]] · [[_id/Q-T3|Question: Admin login for Admin tests]]

**Problem found (1):** [[_id/KG-UI8|Delete-contact sheet survives navigation]]

**Screenshot (1):** [[_capture/LS-20|Lists library]]

%% brain-links:end %%
