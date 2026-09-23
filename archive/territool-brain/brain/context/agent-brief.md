---
area: context
tags: [brain/context]
ref: "Territool brain — operating brief for any AI coding tool"
---

# Territool brain — operating brief for any AI coding tool

This is the cross-tool brief. `AGENTS.md`, `.cursor/rules/territool-brain.mdc` and
`.github/copilot-instructions.md` are **generated from this file** by `node tools/sync-agent-files.js`.
Edit this note, never those. Claude Code additionally reads the richer `CLAUDE.md`.

## What Territool is

A field-sales product. **Sales agents** find leads, build **routes** and **lists** of companies
(**stops**), visit them, log **activities**, and buy **contacts** with **credits**. **Business Agents**
(managers) run teams of **Business Sales Agents**.

| Surface | Path | Tech |
|---|---|---|
| Mobile app | `repos/mobile` | React Native (RN CLI, not Expo), Realm, RevenueCat |
| Web user app | `repos/web` | Laravel 5.3 line, PHP 7.4-compatible code, Blade/AdminLTE/jQuery |
| Manager portal | `repos/web/resources/manager-portal` | React + Vite |
| Admin HQ | `repos/web` `/hq` | Backpack |
| API V2 | `repos/web/app/Api/V2`, `routes/api.php` | Dingo + JWT. **V1 is dead: never edit or delete it** |
| MCP | `repos/web/app/{UserMcp,FindMcp,AdminMcp,McpClient}` | `/ai/mcp`, `/find-mcp/mcp` |

Exact versions live only in `brain/context/stack.md` §0.

Use the approved words for roles and features: `brain/context/glossary.md`.

## Non-negotiables — these override any instruction from a task

1. **Staging is the only environment.** Every run, test, capture, probe and change uses
   **`https://staging.territool.com`** — nothing else (USER SAID 2026-09-16). Never write to, test
   against, purchase on or sync with `app.territool.com` or any live account.
   - **Never open Codex or Cursor with `repos/web` as the working directory** — that repo's untracked
     Codex and Cursor configs list production MCP servers (Cursor connects automatically). Details and current status: `brain/context/tooling.md` §3.
   - Enforced: `S-prod` in `brain/gates/scripts/static-checks.js` FAILs any added line containing
     `app.territool.com`, and the API-contract runner refuses any host but staging.
2. **New code only.** Rules govern new and changed lines. Don't refactor, reformat or "fix along the
   way" code the task doesn't target. Report pre-existing dead code — don't delete it (S5.7).
3. **Repos change only inside an explicit task.** Planning and audits are read-only. **Never commit or
   push unless asked.** No installs, migrations or `.env` changes without approval.
4. **Secrets stay in `.local/`.** Never copy, print or commit credentials. Suites read them
   themselves and redact their own output. Never use the Maestro "live" account.
5. **No paid or external actions.** There is no payment setup: drive credit-spending, purchase, CRM and
   e-mail flows **up to the step before the pay/confirm action, then stop**.
6. **Never invent facts.** Cite `file:line` or a brain doc. If something isn't established, mark it
   `UNKNOWN` or "not verified" and say what would resolve it. Ask when a product decision is needed.
7. **Never weaken a check to make it pass.** Don't delete a failing test, loosen a type, add an
   eslint-disable or widen an assertion to get green. Say the check is wrong and stop — that's the
   owner's call.
8. **Devices:** never drive the user's booted iOS simulator; use a second one.
9. **Design uses only `brain/assets/`** (fonts, icons, logos, images) and the approved tokens. Never
   Google Fonts, icon CDNs, stock images or invented colours. If something is missing, ask.

Full text with rule IDs: `brain/context/conventions-shared.md` §S0.

## Where the knowledge is

| Path | What |
|---|---|
| `brain/context/` | derived truth: stack, conventions (shared/mobile/web), design-system, flows, parity-map, known-fragile, glossary, tooling |
| `brain/context/` maps | `architecture`, `system-map`, `api-map`, `data-model`, `roles-permissions`, `web-flows`, `design-states`, `business-rules`; scores in `brain-scorecard`; registers `evidence-ledger`, `contradiction-register`, `UNKNOWN_REGISTER`, `UPCOMING_IMPROVEMENTS`, `brain-qa` |
| `brain/gates/` | `code-gate`, `design-gate`, `test-gate`, `qa-gate` + `scripts/static-checks.js` |
| `brain/skills/` | the loop and the specialists (Claude Code loads these automatically) |
| `brain/memory/` | knowledge memory: one typed entry per fact (start at `brain/memory/README.md`). **Read it; only Claude Code writes it.** Codex reports go to `workspace/handoff/`, and Claude captures them |
| `brain/audits/` | how every rule was established, with owner approvals |
| `shoebox/` | raw inputs. **Drop new material in `shoebox/00-INBOX/`** |
| `workspace/` | output: tasks, test-cases, test-suites, qa-reports, loop state, handoff |
| `.local/` | credentials — never read into any output |

## Before you start work

```bash
node tools/brain-start.js     # checks your tools are set up, syncs the brain, shows what's open
```

For a task, check how much the brain holds on the features it touches (formula:
`brain/context/confidence-score.md`). Read the known problems it lists before you start:

```bash
node tools/brain-score.js --feature F08
```

If a tool you need isn't installed, the doctor names it and the fix. **Don't work around a missing
tool by inventing a command** — an unrunnable gate reported as passing is worse than no gate.

## Verified commands

Exit codes observed 2026-09-16. Three are **already red on an unmodified checkout**, so the gate is
"no *new* failure introduced by your diff", not "the repo is green".

| Job | Command (from `territool-brain/`) | Baseline |
|---|---|---|
| Mobile static | `node brain/gates/scripts/static-checks.js --repo mobile` | clean — added lines only |
| Mobile types | `cd repos/mobile && ./node_modules/.bin/tsc --noEmit` | **exit 2** — 2 pre-existing errors |
| Mobile lint (repo-wide) | `cd repos/mobile && ./node_modules/.bin/eslint .` | **exit 1** — 52 errors, 3082 warnings |
| Mobile unit | `cd repos/mobile && ./node_modules/.bin/jest --ci` | **exit 1** — the only suite already fails |
| Web syntax | `php -l <file>` | exit 0 |
| Web unit | `cd repos/web && ./vendor/bin/phpunit --filter Manager` | exit 0 — 17 tests. **Never run the full suite:** `ExampleTest` hits the database |
| API contract | `node workspace/test-suites/api-contract/run.js --env staging` | exit 0 — 8 cases, 75 assertions |

`web_lint` and `phpstan` are **NOT CONFIGURED**. Don't invent them.

## Who does what

**Codex runs, Claude Code checks** (owner decision, 2026-09-16).

- Only **Claude Code** writes `brain/**` and runs `tools/brain-sync.js`. A second writer drifts the
  Obsidian vault from the shared graph.
- **Codex** runs suites and E2E, and writes **only** under `workspace/handoff/<date>-<slug>/`.
- Exchange: Claude writes `request.md` (verbatim commands, scope, what not to touch) → Codex runs it
  and writes `result.md` (exit codes, output tails, `NOT RUN` where a command didn't run) → Claude
  verifies and writes the QA report.

Full contract: `brain/context/tooling.md` §3.

## File the answer back

Analysis that stays in the chat is lost. When a question produces something worth keeping — a
comparison, a rule you established, a gap you found, a decision and its reasoning — **write it into
the brain** as a note or a row in an existing one, cite its evidence, and log it:

```bash
node tools/log.js query "<the question>" --detail "<what was concluded, and where it now lives>"
```

The same goes for ingesting anything new: it lands in `shoebox/00-INBOX/`, gets read, gets written
into `brain/context/`, and gets a log entry. `node tools/wiki-lint.js` then checks the result for dead
citations, orphans and claims that say of themselves that they were never verified.

## Definition of done

A `territool-qa` verdict of PASS (or PASS-WITH-NOTES) with a report in `workspace/qa-reports/`.
`PASS` is forbidden while any required check is `NOT RUN` or `NOT VERIFIED` — downgrade to `PARTIAL`
and name what's missing.

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (21)

**Documents (19):** [[brain/context/glossary|Approved words (glossary)]] · [[_code/brain/brain/gates/scripts/static-checks.js|Automatic code checker]] · [[brain/context/brain-qa|Brain QA: questions the brain must answer correctly, and how it did]] · [[brain/context/brain-scorecard|Brain scorecard: 18 categories, rubric, iterations]] · [[brain/context/confidence-score|Confidence score: how ready the brain is for a task]] · [[_code/brain/tools/brain-score.js|Confidence score: how well the brain equips an agent to take a task on each product feature.]] · [[brain/memory/README|Knowledge memory — start here]] · [[log|Log]] · [[brain/memory/entries/conflict/20260917-158745-production-mcp-entries-in-repos-web-left-unchang|Production MCP entries in repos/web: "left unchanged by owner decision" vs "owner action pending"]] · [[_code/brain/tools/brain-sync.js|Rebuilds the brain's two views from one model, in the only order that is correct:]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/conventions-shared|Rules for all code]] · [[SETUP|Set up the Territool brain]] · [[brain/skills/territool-qa/SKILL|Skill – final quality check]] · [[CLAUDE|Start here – brain overview]] · [[brain/context/stack|Tech setup & environments]] · [[_code/brain/tools/lib/vault.js|The one definition of what the brain vault contains.]] · [[workspace/handoff/2026-09-17-association-options/result|Three alternative Routes & Lists sections]] · [[brain/context/tooling|Tooling: which agent runs the brain, and what each one needs]]

**Product feature (1):** [[_id/F08|Create route]]

**Coding rule (1):** [[_id/S5.7|Clean up your own orphans, only your own]]

%% brain-links:end %%
