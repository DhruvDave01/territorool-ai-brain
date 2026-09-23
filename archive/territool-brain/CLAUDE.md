---
area: root
tags: [brain/root]
ref: "Start here – brain overview"
---

# Territool brain: start here

## What Territool is

Territool is a field-sales product.
- **Sales agents** find leads (AI Find Leads, Places/Yelp) and build **routes** and **lists** of companies (**stops**).
- They visit companies and log **activities**.
- They buy **contacts** with **credits**.
- **Business Agents** (managers) run teams of **Business Sales Agents**.

Platforms (details: `brain/context/stack.md`; exact versions only in its §0):

| Surface | Repo (symlink) | Tech |
|---|---|---|
| Mobile app (Sales Agent, Business Sales Agent) | `repos/mobile` → `ReactNative_Projects/TerriTool_Mobile` | React Native (JS), Realm, RevenueCat |
| Web user app (all roles) | `repos/web` → `/Applications/MAMP/htdocs/webterritool` (branch `beta_react`) | Laravel 5.3 line, PHP 7.4-compatible, Blade/AdminLTE/jQuery |
| Manager portal "TerriTool Cockpit" (Business Agent) | `repos/web/resources/manager-portal` | React + Vite |
| Admin HQ (Admin) | `repos/web` `/hq` | Backpack |
| API V2 (mobile + MCP) | `repos/web/app/Api/V2`, `routes/api.php` | Dingo API, JWT. **V1 is dead: ignore, never edit or delete** |
| MCP | `repos/web/app/{UserMcp,FindMcp,AdminMcp,McpClient}` | `/ai/mcp`, `/find-mcp/mcp`, admin, client |

Roles and terms: `brain/context/glossary.md`. Use them in all copy.

## Non-negotiable rules

Full text: `brain/context/conventions-shared.md` §S0.

1. **Never touch production.** Never write to, configure, test against, purchase on or sync with `app.territool.com` or live accounts. Staging (`staging.territool.com`) or local only.
2. **New code only.** Rules apply to new code. Don't refactor or fix old code unless the task targets it.
3. **Repos:** edit only inside an explicit task. **Never commit or push unless asked.** No installs, migrations or `.env` changes without approval. The LAN-exposed `.env` is not changed without OK.
4. **Secrets:** credentials live only in `.local/test-accounts.md` (gitignored, chmod 600). Never copy or print them. Never use the Maestro "live" account.
5. **Paid/external actions** (buy contacts, credit-spending AI lead saves, purchases, CRM/MCP sync, emails): there is no payment setup. Test with the existing staging accounts **up to the step before paying, then stop** (USER SAID 2026-09-15).
6. **Don't invent facts.** Cite `file:line` or a brain doc. Say "not verified" when unknown. Ask when a product decision is needed.
7. **Devices:** never drive the user's booted iOS simulator; use a second one.
8. **Design uses only the brain's own design library** `brain/assets/` (fonts, icon fonts, logos, app icons, images, themes, styles, screenshots) and the approved tokens. Never Google Fonts or other external fonts, icon CDNs, stock images or invented colours. If something is missing, ask (USER SAID 2026-09-15; rules in `brain/context/design-assets.md`).
9. **Code comes from the live repos, never from copies:**
   - Use `repos/mobile` / `repos/web`.
   - If a symlink is missing or looks stale, ask the owner for the local folder path, or use the git remotes: mobile `github.com/DhruvDave01/TerriTool_Mobile` (`TT_80`), web `bitbucket.org/anujsinghsahni/webterritool` (`beta_react`).

## How to use the brain

**Every Territool task starts with the `territool-router` skill.** It classifies the task, detects platforms, forces the parity check, builds the impact map, routes to the specialists and runs the loop.

| Skill | Use for |
|---|---|
| `territool-router` (+ `LOOP.md`) | entry point, sequencing, fix loop until gates pass, escalation |
| `territool-code` | implementation with pre-flight search, conventions, post-flight code gate |
| `territool-design` | routing first (existing screen? same intent?), then AUDIT · PLACE (add to an existing screen) · EXTEND (new screen in an existing flow) · CREATE (new flow) → `workspace/design-proposals/`. Old letters: Mode A = AUDIT, B = EXTEND, C = CREATE |
| `territool-test` | test cases (owner format) + API / Playwright / Maestro suites + exact commands |
| `territool-qa` | final gate → PASS / PASS-WITH-NOTES / FAIL → `workspace/qa-reports/` |

Skills are in `brain/skills/` and linked at `.claude/skills`.

**Definition of done:** `territool-qa` verdict PASS (or PASS-WITH-NOTES per `LOOP.md`), with a report in `workspace/qa-reports/`, **and the KNOWLEDGE checklist (QG-13) complete**.

## Knowledge memory is mandatory (owner decision 2026-09-17)

`brain/memory/` is the project's permanent, append-only memory. Start at `brain/memory/README.md`; the laws are in
`brain/memory/RULES.md`.

```
KNOWLEDGE MEMORY IS MANDATORY.

Before substantial work: targeted pre-sync (node tools/memory.js sync), load HOT.md plus matched
entries only (node tools/memory.js context <feature|file>), never the whole memory; inspect the
current implementation; evaluate history and impact (memory.js impact / history).

During work: follow verified project patterns, preserve intentional decisions, make the minimum safe
change, and note new knowledge as it appears.

After meaningful work: test, QA, regression check, knowledge impact check; update memory
(memory.js new / supersede), preserve history, update relationships, reindex + lint, and run the
completion gate (QG-13), at every terminal state including BLOCKED and FAILED.

Never rely on conversation memory as permanent project knowledge.
Never destroy useful historical knowledge.
Never treat inferred as verified, or deprecated as current.
Never invent missing project knowledge.
Never overwrite manual developer work missing from memory.
Never claim testing, QA, or sync that did not occur.
A task is not complete until its knowledge requirements are complete.
```

- **Slash commands:** `/memory-status` · `/memory-context` · `/memory-impact` · `/memory-learn` ·
  `/memory-history` · `/memory-sync` · `/memory-audit` · `/memory-ingest` · `/memory-promote` ·
  `/memory-reindex` · `/memory-supersede`.
- **Registers:** the six registers in `brain/context/` are rendered from memory entries. Edit the entry, then run
  `node tools/memory.js render`.
- **Single writer:** only Claude Code writes `brain/memory/`. Codex's `result.md` is captured by Claude.

## Where everything lives

| Path | Contents |
|---|---|
| `brain/context/` | derived truth: `confidence-score`, `brain-scorecard`, `architecture`, `system-map`, `api-map`, `data-model`, `roles-permissions`, `web-flows`, `design-states`, `evidence-ledger`, `contradiction-register`, `UNKNOWN_REGISTER`, `UPCOMING_IMPROVEMENTS`, `brain-qa`, `business-rules`, `stack`, `conventions-shared/-mobile/-web`, `design-system`, `flows`, `parity-map`, `known-fragile`, `glossary` |
| `brain/gates/` | `code-gate`, `design-gate`, `test-gate`, `qa-gate` checklists; `scripts/static-checks.js` (+ `.selftest.js`) |
| `brain/skills/` | the five skills |
| `brain/memory/` | **knowledge memory**: typed entries (decisions, bugs, fixes, conflicts, questions, evidence, incidents, commits), `RULES`, `SCHEMA`, `SOURCE-OF-TRUTH`, `LAST-SYNC`, `_generated/` views (HOT, INDEX, BY-FEATURE, FRESHNESS, GAPS…) |
| `brain/audits/` | Phase 0–5 audits with owner approval records (source of every rule); `data/` dependency graphs + generators |
| `shoebox/` | raw inputs: flows, web screenshots, known issues (drafts marked) |
| `workspace/` | output: `tasks/`, `design-proposals/`, `test-cases/`, `test-suites/{api-contract,web,mobile}`, `qa-reports/` |
| `tools/` | Playwright + `capture-web.js` (staging-only capture) |
| `brain/assets/` | **self-contained design library** (tokens, fonts, icon fonts, icons, brand, images, themes, styles, colours, screenshots, videos, docs, artifacts); `README.md` + `MANIFEST.md` |
| `brain/audits/data/brain-index.json` | **the model** both views are drawn from (generated) |
| `_map/` · `_id/` · `_capture/` · `_code/` | **generated** Obsidian notes: hubs, then one note per index node |
| `.obsidian/` | Obsidian vault config (graph colours per area, ignore filters) |
| `views/hub-map/` | **generated** second vault: the same brain as hubs and spokes, one link per note (open as its own vault; `brain/context/tooling.md` §4c) |
| `tools/lib/vault.js` | the one definition of what the vault contains (shared by both generators) |
| `shoebox/00-INBOX/` | **drop zone** — put any new doc, image, video or export here |
| `workspace/handoff/` | Claude ⇄ Codex exchange (`request.md` / `result.md`) |
| `AGENTS.md`, `.cursor/`, `.github/` | **generated** tool instruction files — never hand-edit |
| `.local/` | credentials (never read into outputs) |

## Quick commands (from this folder)

```bash
node brain/gates/scripts/static-checks.js --repo mobile      # gate on added lines (also --repo web)
node brain/gates/scripts/static-checks.selftest.js           # verify the gate script itself
cd tools && PLAYWRIGHT_BROWSERS_PATH="$PWD/ms-playwright" node capture-web.js   # staging web screenshots
node tools/brain-graph.js                                    # rebuild the Obsidian-style brain graph (workspace/brain-graph/)
node tools/make-capture-thumbs.js                            # screenshot thumbnails for the graph page (after index-owner-screenshots)
node tools/sync-design-assets.js                             # refresh the design library brain/assets/ from both apps
node tools/index-owner-screenshots.js                        # give new shoebox mobile captures stable IDs (index in brain/context/)
node tools/brain-start.js                                    # THE first command: profile -> doctor -> inbox -> sync -> status
node tools/doctor.js --all                                   # is this machine set up for the work? exact fix per miss
node tools/brain-score.js --feature F08                      # confidence score for a task's features (no flag = all; brain/context/confidence-score.md)
node tools/brain-check.js --strict                           # run every brain self-check (generators current, parity, citations, lint, self-tests)
node tools/api-map.js && node tools/data-model.js            # regenerate the API and data-model tables from live code (read-only)
node tools/web-explore.js  # (from tools/, staging) read-only per-role web crawl → web-flows.md via web-inventory.js
node workspace/test-suites/web/run.js --env staging          # web/manager-portal contract suite
node workspace/test-suites/mobile/run.js --device <UDID> --role "Sales Agent" workspace/test-suites/mobile/F01-login-main-nav.yaml --out <dir>  # mobile Maestro (second simulator)
node tools/inbox-scan.js                                     # what was dropped into shoebox/00-INBOX/ since last look
node tools/sync-agent-files.js                               # re-render AGENTS.md / .cursor / copilot from the brief
node workspace/test-suites/api-contract/run.js --env staging # L3 API contract suite (mobile + MCP consumers; QG-8)
node tools/memory.js status                                  # knowledge memory health (counts only); also: sync | context | impact | history | new | supersede | lint
node tools/brain-confidence.js                               # the brain confidence score, computed from measured signals (brain/context/brain-confidence.md)
node tools/brain-sync.js                                     # THE one command: memory render + views -> index -> D3 graph -> vault -> parity -> wiki lint
node tools/log.js <type> "<title>" --detail "..."            # append to log.md (ingest|query|lint|build|fix|decision)
node tools/log.js --last 10                                  # what happened recently
node tools/wiki-lint.js                                      # health of the knowledge: dead citations, orphans, unverified claims
node tools/brain-parity.js                                   # prove the shared graph and the vault still match
node tools/hub-map.js                                        # the simple hub-and-spoke picture: views/hub-map/ vault + the page's Hub map button
node tools/obsidian-sync.js --self-test                      # regression fixtures for the vault renderer
```

## The wiki disciplines

Three habits, adopted from Karpathy's *LLM Wiki* pattern, that the brain was missing:

- **`log.md`** — append-only timeline of every ingest, kept answer, lint, build, fix and decision. Newest first, greppable: `grep "^## \[" log.md | head -10`. Written by `tools/log.js`; **never edit or reorder it.**
- **`index.md`** — generated catalogue of every written note, one line each. `_map/` is the map, `index.md` is the catalogue, `log.md` is the timeline.
- **File the answer back.** A question that produces a rule, a comparison or a gap gets written into `brain/context/` and logged — not left in chat where it dies.

`tools/wiki-lint.js` then checks the knowledge the way `static-checks.js` checks the code: dead citations, broken links, orphans, uncited derived-truth notes, IDs with no defining page, and claims that say of themselves they were never verified. It runs inside `brain-sync` and is **report-only** — a stale claim should surface, not block a rebuild.

## Two views, one model

The brain is drawn twice from a single index. They are kept identical on purpose, and a check proves it.

```
notes + audits/data/*.json
        │  node tools/brain-graph.js
        ▼
brain/audits/data/brain-index.json      ← the model (counts: `node tools/brain-parity.js`)
        ├─► workspace/brain-graph/       D3 page  → published Artifact  (for other people)
        └─► the Obsidian vault           notes    → open territool-brain/ (for the owner)
```

| | Shared link (D3) | Obsidian vault |
|---|---|---|
| Who | anyone the owner sends the link to | the owner |
| Source | `graph-data.js` | the same index, rendered as notes |
| Shows | every node and edge | the same nodes and edges |

**Always run `node tools/brain-sync.js`** — it rebuilds the index, then the D3 page, then the vault, then checks parity. Running `obsidian-sync.js` alone after editing notes renders a *stale* graph; that is the drift this exists to prevent. A **Stop hook** (`.claude/settings.json`) runs it after every turn.

- **Shared link:** https://claude.ai/artifact/UYXhPL4BQdUfsEAUYYktnj — private until the owner shares it from the page's share menu. It does **not** refresh itself: ask Claude to republish after the brain changes.
- **Graph colours:** 19 groups keyed on the `brain/kind/*` tags, matching the shared page. The centre is the white `_map/Brain Home.md`; the default filter hides code + screenshots (clear it to see every node). **Obsidian empties `colorGroups` whenever its graph settings are opened** — the sync puts them back; see `brain/context/tooling.md` §4b.
- **Vault layout:** real notes stay where they are and keep their prose. Generated notes mirror the rest of the index — `_id/` (rules, checks, decisions, gaps, features, journeys, screens), `_capture/` (owner screenshots, image embedded), `_code/` (repo + brain source files), `_map/` (hubs; start at `_map/Brain Home.md`).
- **Managed regions** are fenced by `brain-links` markers and rewritten every run. **Never hand-edit inside them**, and treat `_id/`, `_capture/`, `_code/`, `_map/` as output. Prose outside the fence is never touched.
- `_map/` hubs are navigation and are the **only** links in the vault with no counterpart in the shared graph. Everything else matches node-for-node; `node tools/brain-parity.js` fails if it ever stops matching.
- `repos/`, `tools/`, `node_modules/` and **`.local/`** are in the vault's ignore filters. `.local/` still sits on disk inside the vault folder — Obsidian de-indexes it, it cannot hard-block it.

## Any tool can drive this brain

The brain is tool-agnostic: every gate and suite is a plain shell command (D-T1). Only the entry file differs, and all of them are **generated** from `brain/context/agent-brief.md`:

| Tool | Reads | |
|---|---|---|
| Claude Code | `CLAUDE.md` + `.claude/skills/` | hand-written (this file) |
| Codex | `AGENTS.md` | **generated** |
| Cursor | `.cursor/rules/territool-brain.mdc` | **generated** |
| Copilot / VS Code | `.github/copilot-instructions.md` | **generated** |

**Never hand-edit the generated three.** Edit the brief and run `node tools/sync-agent-files.js`.

**Ask before assuming.** When someone starts work, ask which tool they code with and which runs tests, then run `node tools/doctor.js` to check that setup actually exists. If something is missing, say what and how to fix it — never invent a command to work around it. Answers are remembered per member in `.local/profile.json`.

**Codex runs, Claude checks** (USER SAID 2026-09-16). Only Claude Code writes `brain/**` and runs `brain-sync`; a second writer drifts the vault from the shared graph. Codex runs suites and writes only under `workspace/handoff/<date>-<slug>/`. Contract: `brain/context/tooling.md` §3.

**New material** goes in `shoebox/00-INBOX/` — anything at all. `brain-start` reports what is new and suggests where it belongs; nothing is filed automatically.

**New members:** `SETUP.md`.

## Owner decisions 2026-09-15 (Phases 6 and 7 approved: bootstrap complete)

- ~~No Admin login for now.~~ **Superseded 2026-09-16:** an Admin account is provided for **read-only observation** (login, navigate, inspect, screenshot); Admin write cases stay waived.
- **No payment setup.** Flows stop before the pay step.
- **Offline mode dropped** (S3.9).
- **PHP target 7.4.33.** The staging check is skipped.
- **Loop safeguards approved.**
- **Queue worker check** requested (BT-10).

## Open owner items (don't assume)

- `fragile.md` review
- Q-T1..Q-T5
- Q-P9 (customer MCP sold?)
- S5 LAN `.env` exposure fix

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (60)

**Documents (49):** [[brain/context/glossary|Approved words (glossary)]] · [[brain/audits/07-validation|Audit 7 – proving the brain works]] · [[brain/audits/09-external-sources|Audit 9 — external sources reviewed for the brain]] · [[_code/brain/brain/gates/scripts/static-checks.js|Automatic code checker]] · [[brain/context/brain-confidence|Brain confidence score: how much an agent can trust this brain today]] · [[brain/context/brain-qa|Brain QA: questions the brain must answer correctly, and how it did]] · [[brain/context/brain-scorecard|Brain scorecard: 18 categories, rubric, iterations]] · [[CLAUDE-CODE-BOOTSTRAP|Claude Code Bootstrap Prompt]] · [[brain/context/confidence-score|Confidence score: how ready the brain is for a task]] · [[_code/brain/tools/brain-score.js|Confidence score: how well the brain equips an agent to take a task on each product feature.]] · [[brain/context/contradiction-register|Contradiction register: where two sources disagreed, and which won]] · [[brain/memory/entries/conflict/20260917-f7d706-cr-04-stack-s6-4-claude-md-no-admin-account-admi|CR-04 — stack / S6.4 / CLAUDE.md: "no Admin account, Admin cases waived" ↔ owner 2026-09-16: an Admin account is prov…]] · [[brain/memory/entries/conflict/20260917-d6605e-cr-05-claude-md-1-228-nodes-9-899-edges-all-1-27|CR-05 — CLAUDE.md: "1,228 nodes, 9,899 edges", "all 1,275" ↔ brain-parity.js: 1,383+ nodes]] · [[brain/context/design-assets|Design files & asset rules]] · [[brain/assets/MANIFEST|Design library manifest (generated: do not edit)]] · [[brain/memory/README|Knowledge memory — start here]] · [[brain/memory/RULES|Knowledge memory — the laws]] · [[workspace/qa-reports/2026-09-17-knowledge-memory-audit|Knowledge memory audit — 2026-09-17]] · [[shoebox/09-known-issues/fragile|Known issues draft]] · [[log|Log]] · [[_code/brain/tools/brain-parity.js|Proves the two views of the brain show the same graph.]] · [[workspace/qa-reports/2026-09-17-knowledge-memory-build|QA report: knowledge memory build and confidence loop (2026-09-17)]] · [[_code/brain/tools/brain-sync.js|Rebuilds the brain's two views from one model, in the only order that is correct:]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/conventions-shared|Rules for all code]] · [[_code/brain/brain/gates/scripts/static-checks.selftest.js|Self-test for the code checker]] · [[SETUP|Set up the Territool brain]] · [[brain/skills/territool-design/SKILL|Skill – design]] · [[brain/skills/territool-qa/SKILL|Skill – final quality check]] · [[brain/skills/territool-router/SKILL|Skill – task router (start of every task)]] · [[brain/skills/territool-test/SKILL|Skill – testing]] · [[brain/skills/territool-code/SKILL|Skill – writing code]] · [[workspace/tasks/2026-09-17-knowledge-memory-build|Task brief: build the knowledge memory and raise measured brain confidence]] · [[workspace/loop/20260917-knowledge-memory/state|TASK: knowledge-memory]] · [[brain/context/stack|Tech setup & environments]] · [[brain/context/agent-brief|Territool brain — operating brief for any AI coding tool]] · [[brain/skills/territool-loop/SKILL|TERRITOOL LOOP — superseded, moved to LOOP.md]] · [[brain/memory/entries/decision/20260917-64a7b5-territool-loop-merged-into-territool-router-loop|territool-loop merged into territool-router LOOP.md; the old skill is a redirect stub]] · [[brain/skills/territool-router/LOOP|The fix-until-done loop]] · [[_code/brain/tools/lib/vault.js|The one definition of what the brain vault contains.]] · [[workspace/handoff/2026-09-17-association-options/result|Three alternative Routes & Lists sections]] · [[_code/brain/tools/brain-graph.js|Tool – build this map]] · [[_code/brain/tools/sync-design-assets.js|Tool – copy design files]] · [[_code/brain/tools/make-capture-thumbs.js|Tool – make screenshot thumbnails]] · [[_code/brain/tools/index-owner-screenshots.js|Tool – number the screenshots]] · [[_code/brain/tools/capture-web.js|Tool – take web screenshots]] · [[brain/context/tooling|Tooling: which agent runs the brain, and what each one needs]] · [[brain/memory/entries/decision/20260917-1638cf-versions-have-one-home-stack-md-0-guarded-by-the|Versions have one home: stack.md §0, guarded by the version-drift lint]] · [[brain/context/web-flows|Web flows: every web page per role, and how the core features run on web]]

**Product feature (1):** [[_id/F08|Create route]]

**Coding rules (3):** [[_id/S3.9|Offline mode dropped]] · [[_id/D3|Pressable for rows, AppButton for buttons]] · [[_id/S6.4|Staging test data rules]]

**Quality checks (2):** [[_id/QG-8|API contract suite for mobile + MCP consumers when V2 /…]] · [[_id/QG-13|Knowledge captured]]

**Owner decisions (5):** [[_id/BT-10|Check the background job worker]] · [[_id/D-T1|Claude runs the tests]] · [[_id/Q-T1|Question: are the automated app tests run today?]] · [[_id/Q-T5|Question: does staging have test payments?]] · [[_id/Q-P9|Question: is the customer AI connector sold?]]

%% brain-links:end %%
