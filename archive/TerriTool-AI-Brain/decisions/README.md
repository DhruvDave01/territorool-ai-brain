---
title: "Decisions"
---

# Decisions

Record durable engineering choices here. Product behavior lives in [features/*/MODULE.md](../features/README.md).

## ADR-006 — Canonical folder is `TerriTool AI Brain/`

**Decision:** One Engineering Brain at `/TerriTool AI Brain`. Media (staging screenshots, mobile captures, walkthrough videos, flow PNGs) lives **in this folder**. `TT_Brain_Data` was copied in on 2026-09-16 and removed; do not recreate it or treat any leftover path as a second rule set.

**Status:** Accepted (2026-09-16; folder renamed from `terri-engineering-brain` the same day). Reaffirmed 2026-09-16 as the **only** knowledge system (ADR-008).

## ADR-001 — This folder is self-contained

**Decision:** Copy product, use-case, flow, MCP, and engineering-map markdown **into** `/TerriTool AI Brain`. Agents must not need a second knowledge pack to operate.

**Why:** Pointing out to another folder made the Brain incomplete. The operating system (skills, loops, Claude/Codex) and the product facts now sit together.

**Status:** Accepted (2026-09-16). Screenshots, videos, and flow PNGs now live only in this folder.

## ADR-002 — Keep existing UC IDs

**Decision:** Do not introduce UC-001… numbering.

**Why:** `UC-LEAD-01` etc. already index features. A parallel scheme would desync.

**Status:** Accepted.

## ADR-003 — Laravel version: lockfile wins until proven otherwise

**Decision:** Treat installed `laravel/framework` **v5.3.31** as fact for this checkout; still forbid Laravel 8+/PHP 8. Copied overview text still says Laravel 7 — prefer the lockfile.

**Status:** Accepted pending human confirmation of production.

## ADR-004 — Do not install Playwright Test in this phase

**Decision:** Document the gap; use Playwright MCP.

**Status:** Accepted.

## ADR-005 — MCP is a client of v2, not a second app

**Decision:** New field-rep writes go through Helper/v2 so MCP/mobile inherit them.

**Status:** Existing; restated.

## ADR-007 — Memory files + Claude Code skills

**Decision:** Durable one-fact traps live in `TerriTool AI Brain/memory/` with index `MEMORY.md`. Claude Code loads `.claude/skills/territool-*` (thin copies of Cursor loop skills + pointers at Brain `skills/`). Root `CLAUDE.md` carries verification commands. Large tasks dispatch explore vs implement vs review ([loops/execution-protocol.md](../loops/execution-protocol.md)).

**Why:** Align with a short always-on instruction file, one-file-per-fact memory, auto-picked skills, and subagent split — without adopting a separate multi-LLM runtime or design-to-code product.

**Status:** Accepted (2026-09-16).

## ADR-008 — Single Brain for feature, UI, bug, and QA

**Decision:** `TerriTool AI Brain/` is the only knowledge system for new functionality, UI design/update, bugfix, and QA. Screen specs live in [`ui-flows/SCREEN-SPEC.md`](../ui-flows/SCREEN-SPEC.md). QA reports follow [`loops/qa-loop.md`](../loops/qa-loop.md). Cursor/Claude skill files are **pointers**, not a second bible.

**Why:** A parallel pack (`TT_Brain_Data`, a second docs tree, or chat-only specs) desyncs agents. Feature, UI, bug, and QA already share MODULE.md + UC + FLOW; they must keep writing back here.

**Status:** Accepted (2026-09-16).

## ADR-009 — LLM Wiki is this Brain (not a second vault)

**Decision:** Instantiate [Karpathy’s LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) **as** `TerriTool AI Brain/`. Catalog [`index.md`](../index.md), timeline [`log.md`](../log.md), operations [`operating/llm-wiki.md`](../operating/llm-wiki.md) + [`skills/wiki.md`](../skills/wiki.md). Do not add a parallel `wiki/` directory.

**Why:** The Brain already is the compounding markdown layer. A second wiki would desync MODULE.md the same way a leftover product pack did.

**Status:** Accepted (2026-09-16).
