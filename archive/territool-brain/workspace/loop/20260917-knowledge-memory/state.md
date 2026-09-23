---
area: workspace
tags: [brain/workspace]
ref: "TASK: knowledge-memory"
---

# TASK: knowledge-memory
status: DONE (terminal: PARTIAL — see TERMINAL)
iteration: 3 / 3
station: REPORT
started: 2026-09-17 ~15:20 IST   updated: 2026-09-17 16:35 IST
brief: workspace/tasks/2026-09-17-knowledge-memory-build.md

## REQUEST
verbatim: see brief
classified:  feature (brain) + test
platforms:   mobile [ ] web [x] portal [x] admin [x] api [x] mcp [x] system [ ]  (tests only; no product code)
roles affected: Sales Agent, Business Sales Agent, Business Agent, Admin (read-only), Public
criticality: HIGH (brain-wide)
parity decision: n/a (no product change)
pause:       none. P-CRIT and P-CONFLICT applied, but the owner instructed continuous execution
             ("you have all the permission"). Recorded here instead of pausing.
prod check:  mobile URL_BASE = **production** → no mobile run in this task (INTAKE production check); API and web suites are staging-guarded.
memory:      synced 2026-09-17T11:02:52Z · loaded HOT + context for F01–F31 · written 36 non-commit entries this task (ids in the QA report)

## GROUND TRUTH
| claim | tier | source |
|---|---|---|
| six registers parse into 188 ID rows | VERIFIED | `node tools/memory.js migrate` round-trip OK per register |
| 205 no-merge commits in 90 days (48 mobile, 157 web) | VERIFIED | `git rev-list --no-merges --since=2026-06-19` |
| createList/addcontact/addnote/addticket/updateuserstatus/scan-qr-code/addcompany/mobileRegister validate before writing | VERIFIED | controller lines cited in each case |
| createroute has no visible validation before building a route | INFERRED | `V2/RouteController.php:2737-2766` (NEEDS-VERIFICATION entry) |
| manager portal renders DM Sans; /register renders Inter | VERIFIED | runtime measurement; blade + css lines (UI-UX-08, UI-UX-09) |

conflicts found: audit counts (corrected), doctor.js "left unchanged by owner decision" vs tooling.md "owner action" (conflict entry, OPEN)
unknowns blocking progress: none for the brain; mobile runtime blocked by the production pointer

## IMPACT MAP
direct: tools/memory.js, tools/brain-confidence.js, tools/note-revalidate.js, tools/qa-report.js, tools/wiki-lint.js, tools/brain-check.js, tools/brain-sync.js, tools/lib/vault.js, tools/brain-graph.js, tools/obsidian-sync.js, tools/index-web-screenshots.js, brain/audits/data/phpgraph.js (+ web-graph.json, feature-code.json), brain/memory/**, brain/context (6 registers rendered, stack/tooling/agent-brief/design-system/parity-map/UPCOMING), brain/skills (router LOOP, design, test, qa, loop stub), brain/gates/qa-gate.md, CLAUDE.md, .claude/commands/memory-*.md, .claude/settings.json, workspace/test-suites/**
callers of shared: brain-sync (Stop hook), brain-check, brain-score (reads QA verdict first line)
flows at risk: none (no product code)
parity obligation: n/a

## PLAN
Build memory with a round-trip-proven generator; wire it; expand only read-only, code-verified tests; compute confidence from signals.
files that must NOT change: repos/** (Law 6, S0.3), brain/assets/videos/**, .local/**

## ITERATION LOG
| # | Date/time | Changes made (files) | Gates run | Failing items (IDs) | Verdict |
|---|---|---|---|---|---|
| 1 | 2026-09-17 15:20–15:50 | memory tool + migration + seed + docs + wiring | memory self-test, lint, brain-check | lint: 31 provenance/email errors; wiki-lint 44 dead citations, 103 orphans; qa-report stale | FAIL |
| 2 | 2026-09-17 15:50–16:15 | provenance resolver, email redaction, historical paths, orphan scope, confidence tool, extended suites | suites, brain-check, confidence | 2 API + 2 web test-expectation failures; vacuous Admin passes | FAIL |
| 3 | 2026-09-17 16:15–16:35 | test expectations corrected from code; visual + parity + gate suites; UI-UX-08/09 registered; note re-validation; MCP modules in code graph | API 109 (0 fail), web 63 (0 fail), brain-check 17/17, memory lint 0, note-revalidate 0 | none | PASS (brain gates) — task PARTIAL overall |

### iter 1 — DIAGNOSE
failure evidence: `memory.js lint` 31 errors; `wiki-lint` 44 FAIL
hypothesis: the provenance check ignored bare evidence file names and the verbatim row; commit entries cited paths that moved after their commit
### iter 2 — DIAGNOSE
failure evidence: TC-F05-006, TC-F12-006, TC-F22-001, TC-F25-004 failed; permission cases passed with "no data"
hypothesis: the expectations were written from assumption, not from the controllers and the runner's headers
why iter 1 hypothesis was not enough: it fixed the memory lint, but the test layer had its own invented expectations
strategy change (iter 3): read the controller before every new expectation; assert refusals themselves

## TERMINAL
status: PARTIAL
unverified residue:
- mobile runtime (offline, mobile visual) — blocked by the production `URL_BASE` (incident OPEN)
- regression type (no real previously-fixed defect re-tested)
- F04 crons (no safe test)
- createroute validation order (NEEDS-VERIFICATION)
- image personal-data review before any push
- confidence owner-only signals c5, e1, e2, f2, f3, f5
brain updates required: none outstanding (all written this task)

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (14)

**Documents (9):** [[brain/gates/qa-gate|Checklist – final quality check]] · [[workspace/qa-reports/2026-09-17-knowledge-memory-build|QA report: knowledge memory build and confidence loop (2026-09-17)]] · [[_code/brain/tools/brain-sync.js|Rebuilds the brain's two views from one model, in the only order that is correct:]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[CLAUDE|Start here – brain overview]] · [[workspace/tasks/2026-09-17-knowledge-memory-build|Task brief: build the knowledge memory and raise measured brain confidence]] · [[_code/brain/tools/lib/vault.js|The one definition of what the brain vault contains.]] · [[_code/brain/tools/brain-graph.js|Tool – build this map]] · [[brain/context/tooling|Tooling: which agent runs the brain, and what each one needs]]

**Product features (3):** [[_id/F01|Login & session]] · [[_id/F31|MCP client connections & chat]] · [[_id/F04|Subscription & credit renewal]]

**Coding rule (1):** [[_id/S0.3|Edit apps only inside a task]]

**Code file (1):** [[_code/web/app/Api/V2/Controllers/RouteController.php|RouteController]]

%% brain-links:end %%
