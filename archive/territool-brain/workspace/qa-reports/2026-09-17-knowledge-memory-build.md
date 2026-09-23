---
area: workspace
tags: [brain/workspace]
ref: "QA report: knowledge memory build and confidence loop (2026-09-17)"
---

# QA report: knowledge memory build and confidence loop (2026-09-17)

**Verdict: PASS-WITH-NOTES (brain gates) · task terminal state PARTIAL.** The brain side is complete and every brain check passes. The 90–95 target was not reached: the measured score is 75.2/100. The remaining 16 points depend only on owner actions (§5).

- Brief: `workspace/tasks/2026-09-17-knowledge-memory-build.md`
- Loop state: `workspace/loop/20260917-knowledge-memory/state.md` (3/3 iterations)

## 1. States (kept separate)

| Item | Implemented | Tested | Verified | Committed |
|---|---|---|---|---|
| `brain/memory/` (docs, 424 entries, 13 generated views) | yes | `memory.js --self-test` 19/19 | lint 0 errors; `render --check` and `reindex --check` current | **no** (owner commits) |
| 6 registers rendered from entries | yes | exact round-trip per register | `render --check` inside brain-check | no |
| Commit capture (90 days) | yes | sync run twice, second run added nothing (idempotent) | mobile 45+3 non-trigger / 48, web 153+4 / 157 | no |
| `/memory-*` commands (11) | yes | files present (d8) | not exercised by a second session | no |
| LOOP / QA gate / CLAUDE.md wiring | yes | d7 5/5 | read-through only | no |
| API suite, staging | 109 cases | 88 pass, 0 fail, 19 known gap, 2 blocked (owner waivers) | expectations read from controllers | no |
| Web suite, staging | 63 cases | 58 pass, 0 fail, 5 known gap | screenshots in `workspace/qa-evidence/2026-09-17/web-visual/` | no |
| Mobile runtime | — | **not run** | blocked: `URL_BASE` points at production (incident `VAULT-20260917-ef8968`) | — |
| `brain-confidence.js` | yes | computed from signals | total 75.2, ceiling 91.2 | no |

## 2. Gates

| Gate | Result |
|---|---|
| `node tools/brain-check.js --strict` | 17/17 |
| `node tools/memory.js lint --strict` | 0 errors |
| `node tools/note-revalidate.js` | 410 claims, 0 unresolved |
| `node tools/wiki-lint.js` (inside brain-sync) | report-only; no FAIL |
| QG-13 knowledge | PASS (checklist §3) |
| QG-14 environment pointers | **FAIL-REPORTED**: 3 production pointers are active (§4). Not changed, per Law 6 and owner instruction. |

## 3. KNOWLEDGE checklist (QG-13)

- [x] PRE-SYNC ran, and the memory was 0 behind before and after.
- [x] Each new fact has one canonical home. The six registers are generated from entries, and duplicated versions were replaced by links to `stack.md` §0.
- [x] Entries written this task (36 non-commit):
  - incident: `ef8968`
  - environment: `46c58f`, `8b198c`, `c24f7a`, `e2b9ed`
  - decisions: `0a51a8`, `11bade`, `1638cf`, `54748f`, `64a7b5`, `8d68b7`, `b1a00e`, `b29959`, `bcff7d`, `dda728`, `fd1df7`
  - corrections: `71a6a0`, `7e9fc5`, `ac83d3`, `eaa29a`
  - fixes: `442310`, `61522e`, `7ae23d`, `f09b51`
  - antipatterns: `376e30`, `caa8c2`
  - failed approach: `621568`
  - pattern: `17d25c`
  - qa: `252685`, `31b560`, `75ee1f`, `e58ccf`
  - questions: `b79358`, `d1f7ac`
  - bug: `98c2b2`
  - conflict: `158745`
  - Product rows UI-UX-08 and UI-UX-09 were added as register entries.
  - All IDs have the prefix `VAULT-20260917-`.
- [x] Every mistake was recorded as a correction, failed approach or antipattern, not silently fixed. Examples: the audit miscounts, the invented test expectations, and the screenshot generator dropping tags.
- [x] No secret is in memory (e4: 0 findings). Bug `98c2b2` cites the file and lines only.
- [x] Superseded rather than deleted. There were 0 deletions in the working tree, and the territool-loop skill is a stub, not removed.
- [x] Future-session test: a fresh session running `node tools/memory.js context F11` gets the Lists filter decision (`54748f`), D-DS9, the hold on implementation and the open incident, without this chat.

## 4. Environment pointers (QG-14)

| Pointer | Target | Status |
|---|---|---|
| `repos/mobile` `URL_BASE` (uncommitted, owner's work) | production | ACTIVE: blocks every mobile run |
| `repos/web/.codex/config.toml` (untracked) | production MCP servers | ACTIVE |
| `repos/web/.cursor/mcp.json` (untracked) | production MCP servers; Cursor handshakes seen, no tool calls logged | ACTIVE |
| claude.ai connectors "Territool User Live" / "Admin MCP" | failed to connect this session (404) | not used |

## 5. Why not 90–95

| Signal | Points | What closes it (owner) |
|---|---|---|
| c5 CI runs the suites | 3 | add a CI workflow that runs the API and web suites on staging |
| e1 no open incident | 3 | answer the incident questions, then close `VAULT-20260917-ef8968` |
| e2 no production pointer | 3 | point mobile `URL_BASE` and the Codex/Cursor MCP configs at staging |
| f2 tree committed | 3 | commit the brain (727 paths, 0 deletions) |
| f3 remote | 2 | add a private git remote and push |
| f5 video backup | 2 | confirm the `brain/assets/videos/` backup |

With all six, the score is **91.2**. The other 8.8 points are in C (verified behaviour, 13.8/25):
- **offline**: mobile runs are blocked by the production pointer;
- **regression**: no real previously-fixed defect exists to re-test, and it was deliberately not marked N/A;
- **F04**: crons have no safe test;
- **F12/F13 web parity**: `/company` never reaches network idle, so the browser probe times out.

Raising C further needs mobile runs after e2 is closed.

## 6. Disclosed slips (this session)

- **Credentials printed.** While inspecting `repos/mobile/App/config/index.js`, two Google/Gemini API key values and a code comment containing account credentials were printed into the session output. They were not written to any file. **Recommend rotating those keys and that password.** Rule now: repo config lines are never printed.
- **Invented test expectations.** Four test expectations were first written from assumption and then corrected from code (`621568`).

## 7. Open owner items

1. Incident details: whether the production `URL_BASE` was intended, and whether the app ran against production after 13:00.
2. The `-live` MCP entries: their status conflicts between sources (`158745`).
3. Deleting the territool-loop stub after your first commit.
4. The target of the "Territool User Live" connector.
5. The shared graph link: it is shared with anyone, so it will not be republished until you decide what to do about sensitive nodes.
6. The Lists filter: the spec may proceed, but implementation is held until the incident is closed.

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (16)

**Documents (9):** [[log|Log]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/skills/territool-router/SKILL|Skill – task router (start of every task)]] · [[CLAUDE|Start here – brain overview]] · [[workspace/tasks/2026-09-17-knowledge-memory-build|Task brief: build the knowledge memory and raise measured brain confidence]] · [[workspace/loop/20260917-knowledge-memory/state|TASK: knowledge-memory]] · [[brain/context/stack|Tech setup & environments]] · [[brain/skills/territool-loop/SKILL|TERRITOOL LOOP — superseded, moved to LOOP.md]] · [[brain/skills/territool-router/LOOP|The fix-until-done loop]]

**Product features (4):** [[_id/F12|Companies (Address Book)]] · [[_id/F13|Contacts]] · [[_id/F11|Lists]] · [[_id/F04|Subscription & credit renewal]]

**Quality checks (2):** [[_id/QG-14|Environment pointers checked before any run]] · [[_id/QG-13|Knowledge captured]]

**Code file (1):** [[_code/mobile/App/config/index.js|config/index.js]]

%% brain-links:end %%
