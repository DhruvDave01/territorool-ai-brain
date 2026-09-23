---
title: "TerriTool AI Engineering Brain"
---

# TerriTool AI Engineering Brain

Agent entry point. Read this first. Do not invent architecture.

**This folder is the only Brain.** Do not create a parallel pack, bible, or `TT_Brain_Data`. Cursor rules (`.cursor/rules`, `.cursor/skills`) and Claude skills (`.claude/skills`) are pointers here — not a second knowledge system.

Cursor: `.cursor/rules/territool-ai-brain.mdc` + `.cursor/skills/territool-*`. Claude Code: `.claude/skills/territool-*`. Contract: [AGENTS.md](AGENTS.md). Wiki catalog: [index.md](index.md). Timeline: [log.md](log.md). Pattern: [operating/llm-wiki.md](operating/llm-wiki.md). Protocol: [loops/execution-protocol.md](loops/execution-protocol.md). Memory: [memory/MEMORY.md](memory/MEMORY.md). Discovery: [discovery-report.md](discovery-report.md).

```
TerriTool AI Brain/
  knowledge/          how it is built
    architecture.md   … api.md     short indexes
    architecture/                  system, frontend, backend, auth, db
    code/                          CODEMAP, ROUTEMAP, conventions, tests
  product/            what TerriTool is (overview, rules, terms)
  features/           required behavior per module (MODULE.md)
                      + evidence/ screenshots beside each module
  evidence/           unassigned screenshots + walkthrough videos
  use-cases/          template + cross-feature engineering traces (per-feature use-cases live in features/*/use-cases.md)
  ui-flows/           README + SCREEN-SPEC for new UI (per-feature flows live in features/*/flows.md)
  skills/             single capabilities (YAML frontmatter)
  loops/              feature / bug / UI / QA / refactor / PR
  memory/             one file per durable fact + MEMORY.md index
  index.md            wiki catalog (generated)
  log.md              wiki timeline (append-only)
  tools/              Playwright, git, wiki_index, brain-map
  learnings/          gotchas, successes, failures (per-feature known-issues/limits live in features/*/)
  operating/          Claude, Codex, LLM Wiki schema
```

Evidence: feature screenshots in `features/*/evidence/`; unassigned captures and walkthrough videos in [evidence/](evidence/README.md). All media lives in this folder.

---

## Start Here

TerriTool is a **field sales territory platform**. One account, one database. A company saved from Find Leads is the same company on the map, on a list, on a route, and in CRM sync.

It is **one product** on browser, iOS/Android, voice, and MCP. Do not build a “web version” and a “mobile version” of the same rule.

### Jobs this Brain supports

| Job | Open | Loop |
|-----|------|------|
| New functionality | Feature `MODULE.md` + UC | [feature-loop.md](loops/feature-loop.md) |
| New or redesigned UI | [SCREEN-SPEC.md](ui-flows/SCREEN-SPEC.md) + [design-ui.md](skills/design-ui.md) | Feature loop after the spec; [ui-loop.md](loops/ui-loop.md) |
| Update existing UI | `features/*/evidence/` + stack map | [ui-loop.md](loops/ui-loop.md) |
| Bugfix | `MODULE.md` expected + [bug-repro-runbook.md](knowledge/code/bug-repro-runbook.md) | [bug-loop.md](loops/bug-loop.md) |
| QA a flow or new feature | [ui-flows/README.md](ui-flows/README.md) | [qa-loop.md](loops/qa-loop.md) |
| Connect / maintain the wiki | [index.md](index.md) + [operating/llm-wiki.md](operating/llm-wiki.md) | [wiki.md](skills/wiki.md) |

| You need | Open |
|----------|------|
| What the product does | [product/overview.md](product/overview.md) |
| Terms | [product/glossary.md](product/glossary.md) |
| Who uses it | [product/roles.md](product/roles.md) |
| Journeys | [product/FLOWS.md](product/FLOWS.md) |
| Feature modules | [features/README.md](features/README.md) |
| How the system is built | [knowledge/architecture.md](knowledge/architecture.md), [architecture/system-overview.md](knowledge/architecture/system-overview.md) |
| Where the code lives | [knowledge/codebase.md](knowledge/codebase.md), [code/CODEMAP.md](knowledge/code/CODEMAP.md) |
| URL → controller | [code/ROUTEMAP.md](knowledge/code/ROUTEMAP.md) |
| A user job | [use-cases/README.md](use-cases/README.md) |
| A screen sequence | [ui-flows/README.md](ui-flows/README.md) |
| New or redesigned UI spec | [SCREEN-SPEC.md](ui-flows/SCREEN-SPEC.md) |
| QA a flow | [loops/qa-loop.md](loops/qa-loop.md) |
| Screenshots / video | [evidence/README.md](evidence/README.md), plus each feature `evidence.md` |
| How to work | [loops/execution-protocol.md](loops/execution-protocol.md), then a [loop](loops/README.md) |
| Wiki catalog / timeline | [index.md](index.md), [log.md](log.md), [operating/llm-wiki.md](operating/llm-wiki.md) |
| Durable one-fact traps | [memory/MEMORY.md](memory/MEMORY.md) |
| Business rules | [product/business-rules.md](product/business-rules.md) |

**Highest-severity conflict:** `composer.lock` installs **Laravel 5.3.31**. Copied product text still says Laravel 7 / PHP 7.4. Until a human resolves this, write PHP 7.2-compatible code and **do not** use Laravel 8+/PHP 8 features. See [memory/laravel-lockfile-5.3.md](memory/laravel-lockfile-5.3.md).

---

## Architecture

Monolith: Laravel web + Dingo API v2 + three in-app MCP modules + React Manager Portal.

| Area | Doc |
|------|-----|
| Knowledge indexes | [knowledge/README.md](knowledge/README.md) |
| System | [architecture/system-overview.md](knowledge/architecture/system-overview.md) |
| Frontend (two stacks) | [architecture/frontend.md](knowledge/architecture/frontend.md), [architecture/stack-migration-map.md](knowledge/architecture/stack-migration-map.md) |
| Backend | [architecture/backend.md](knowledge/architecture/backend.md) |
| Database | [architecture/database.md](knowledge/architecture/database.md), [code/data-model-reference.md](knowledge/code/data-model-reference.md) |
| Auth | [architecture/authentication.md](knowledge/architecture/authentication.md) |
| Integrations | [architecture/integrations.md](knowledge/architecture/integrations.md) |
| Deploy / CI | [architecture/deployment.md](knowledge/architecture/deployment.md) |
| Mobile (React Native, separate repo) | [architecture/mobile.md](knowledge/architecture/mobile.md) |

---

## Product

| Doc | Contents |
|-----|----------|
| [overview.md](product/overview.md) | What TerriTool is |
| [business-rules.md](product/business-rules.md) | Credits, wallets, one-product writes |
| [constraints.md](product/constraints.md) | Stack, data, and tooling hard limits |
| [concepts.md](product/concepts.md) | Company, list, route, credits, AI search |
| [glossary.md](product/glossary.md) / [terminology.md](product/terminology.md) | Canonical terms |
| [roles.md](product/roles.md) | Sales Agent, BSA, Business Agent, Admin |
| [FLOWS.md](product/FLOWS.md) | End-to-end journeys |
| [use-cases-overview.md](product/use-cases-overview.md) | UC index |
| [TerriTool_OverView.md](product/TerriTool_OverView.md) | Developer onboarding guide |

Credit rules (same on every client): search **0**; save AI lead **1**; FullEnrich buy **2**; Claude buy **1**. Buy is never free.

---

## Use Cases

Existing IDs are canonical (`UC-AUTH-01`, `UC-LEAD-01`, …). **Do not invent a parallel `UC-001` numbering.**

Index + engineering traces: [use-cases/README.md](use-cases/README.md).

Full catalog: [product/use-cases-overview.md](product/use-cases-overview.md).  
Per-feature: [use-cases/](use-cases/) and [features/*/use-cases.md](features/README.md).

---

## UI Flows

Index: [ui-flows/README.md](ui-flows/README.md).  
New or redesigned screen: [SCREEN-SPEC.md](ui-flows/SCREEN-SPEC.md) via [skills/design-ui.md](skills/design-ui.md).  
QA a named flow: [loops/qa-loop.md](loops/qa-loop.md).

Product journeys: [product/FLOWS.md](product/FLOWS.md).  
Per-feature: [ui-flows/](ui-flows/) and [features/*/flows.md](features/README.md).

---

## Code

| Doc | Contents |
|-----|----------|
| [code/README.md](knowledge/code/README.md) | Map of code docs |
| [repository-map.md](knowledge/code/repository-map.md) | Folders that matter |
| [CODEMAP.md](knowledge/code/CODEMAP.md) | Feature → controller |
| [ROUTEMAP.md](knowledge/code/ROUTEMAP.md) | 725 routes |
| [important-files.md](knowledge/code/important-files.md) | Gravity wells |
| [services.md](knowledge/code/services.md) | Services + MCP tool classes |
| [patterns.md](knowledge/code/patterns.md) | Real patterns |
| [coding-conventions.md](knowledge/code/coding-conventions.md) | Conventions as used |
| [testing.md](knowledge/code/testing.md) | What tests exist |
| [bug-repro-runbook.md](knowledge/code/bug-repro-runbook.md) | Repro loop |

---

## Skills

| Skill | File |
|-------|------|
| Understand repository | [skills/understand-repo.md](skills/understand-repo.md) |
| Trace feature | [skills/trace-feature.md](skills/trace-feature.md) |
| Investigate | [skills/investigate.md](skills/investigate.md) |
| Debug | [skills/debug.md](skills/debug.md) |
| Design UI | [skills/design-ui.md](skills/design-ui.md) |
| Implement | [skills/implement.md](skills/implement.md) |
| Test | [skills/test.md](skills/test.md) |
| Verify UI | [skills/verify-ui.md](skills/verify-ui.md) |
| Wiki ingest / query / lint | [skills/wiki.md](skills/wiki.md) |

Cursor auto-loads `.cursor/skills/territool-engineering` and the matching `territool-*-loop` / `territool-design-ui` / `territool-wiki` / `territool-learn` skills. Claude Code auto-loads the copies in `.claude/skills/`.

---

## Loops

| Loop | File | Owner (target) |
|------|------|----------------|
| Protocol | [loops/execution-protocol.md](loops/execution-protocol.md) | All |
| Feature | [loops/feature-loop.md](loops/feature-loop.md) | Claude |
| Bug | [loops/bug-loop.md](loops/bug-loop.md) | Claude |
| UI | [loops/ui-loop.md](loops/ui-loop.md) | Claude + Playwright |
| QA | [loops/qa-loop.md](loops/qa-loop.md) | Claude + Playwright |
| Refactor | [loops/refactoring-loop.md](loops/refactoring-loop.md) | Claude |
| PR / review | [loops/pr-loop.md](loops/pr-loop.md) | **Codex** |
| Release | [loops/release-loop.md](loops/release-loop.md) | Human + Claude (CI absent) |

Wiki ingest / query / lint is a **skill**, not a ship loop: [skills/wiki.md](skills/wiki.md).

---

## MCPs

| Tool | What it is for | Docs |
|------|----------------|------|
| Customer MCP (`territool-app`) | Drive the product as a rep | `{APP_URL}/ai/mcp` — [features/20-MCP/api-surfaces.md](features/20-MCP/api-surfaces.md) |
| Find MCP | Lead/contact subset | `{APP_URL}/find-mcp/mcp` |
| Admin MCP | Staff lookups | `{APP_URL}/ai/mcp-admin` or `php artisan mcp:stdio` |
| Playwright MCP | Browser verification | [skills/verify-ui.md](skills/verify-ui.md) |
| Sentry MCP | Production errors | org `territool`, project `territoolre-web` |

Tool map: [tools/README.md](tools/README.md). Cursor-only wiring to migrate: [cursor-exit.md](cursor-exit.md).

---

## Memory

Index (load first): [memory/MEMORY.md](memory/MEMORY.md). One file per durable fact. After a correction, add a memory — do not rely on chat history.

## Learnings

- How to record: [learnings/README.md](learnings/README.md)
- [gotchas.md](learnings/gotchas.md)
- [successful-patterns.md](learnings/successful-patterns.md)
- [recurring-bugs.md](learnings/recurring-bugs.md)
- [failed-approaches.md](learnings/failed-approaches.md)
- [operational-notes.md](learnings/operational-notes.md)
- Per-feature known-issues.md / limits.md live beside each module in `features/*/`

---

## Decisions

[decisions/README.md](decisions/README.md)

---

## Operating models

- Claude: [operating/claude.md](operating/claude.md)
- Codex: [operating/codex.md](operating/codex.md) + [loops/pr-loop.md](loops/pr-loop.md)
- LLM Wiki (this folder): [operating/llm-wiki.md](operating/llm-wiki.md)
- Cursor exit: [cursor-exit.md](cursor-exit.md)

---

## Validation

Three real tasks run against this Brain: [validation/README.md](validation/README.md).
