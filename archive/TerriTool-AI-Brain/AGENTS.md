---
title: "Agent instructions — TerriTool Engineering Brain"
---

# Agent instructions — TerriTool Engineering Brain

You are an engineering agent working on TerriTool. **`TerriTool AI Brain/` is the only knowledge system** — do not start a second pack. Cursor will eventually be removed. Operate as if **Claude + MCPs + Codex** are the long-term toolchain.

## Required sequence

1. Read [`README.md`](README.md) and the wiki catalog [`index.md`](index.md). Follow [`loops/execution-protocol.md`](loops/execution-protocol.md). Schema: [`operating/llm-wiki.md`](operating/llm-wiki.md).
2. Find the relevant **use case** in [`use-cases/README.md`](use-cases/README.md) and the matching `features/*/use-cases.md`.
3. Find the relevant **UI flow** in [`ui-flows/README.md`](ui-flows/README.md) and `features/*/flows.md`. New or redesigned screen: fill [`ui-flows/SCREEN-SPEC.md`](ui-flows/SCREEN-SPEC.md) via [`skills/design-ui.md`](skills/design-ui.md) **before** coding.
4. Trace **actual code** with [`skills/trace-feature.md`](skills/trace-feature.md). Cite files. Use [`code/ROUTEMAP.md`](knowledge/code/ROUTEMAP.md) and [`code/CODEMAP.md`](knowledge/code/CODEMAP.md).
5. **Never invent architecture.** If it is not in code or this Brain, write `UNKNOWN — needs verification`.
6. Verify important assumptions against running product, tests, or source — in that order of preference.
7. Run tests that exist. Prefer `vendor/bin/phpunit --filter Manager` when MySQL is down. Full `vendor/bin/phpunit` includes `ExampleTest`, which 500s on `/login` without MySQL. Do not pretend Playwright Test exists; it does not.
8. When UI behavior matters, use Playwright MCP (or a real browser) per [`skills/verify-ui.md`](skills/verify-ui.md) and [`loops/ui-loop.md`](loops/ui-loop.md). If the human asked to QA a flow, use [`loops/qa-loop.md`](loops/qa-loop.md).
9. When the change is ready, hand off to Codex via [`loops/pr-loop.md`](loops/pr-loop.md).
10. Update **this Brain** when you discover durable knowledge (wiki **ingest**): [`skills/wiki.md`](skills/wiki.md). Record in [`learnings/`](learnings/README.md) and, for one-fact traps, [`memory/MEMORY.md`](memory/MEMORY.md). Update the matching `features/*/MODULE.md`. Append [`log.md`](log.md). Refresh `index.md` with `python3 tools/wiki_index.py`. Do not start a second pack.

## Evidence ranking (when sources conflict)

1. Running product
2. Automated tests
3. Source code
4. This Engineering Brain
5. Assumptions

Investigate the conflict. Fix the stale doc. Do not silently pick a side.

## Hard product rules

- One product on every client. Credits, route publish rules, and company identity must match.
- Save AI lead = **1** credit. FullEnrich buy = **2**. Claude buy = **1**. Search is free. Buy is never free.
- MCP `create_route` **publishes**. Web can save Draft. Do not mix those behaviors.
- `save_ai_leads` is not `add_company`. `find_ai_leads` is not `search_companies`.
- Do not query or migrate `coffee_*` / `bookings` tables.
- Do not trust `database/webterritool.sql`.
- Do not edit `public/js/manager-portal.js` by hand — rebuild from `resources/manager-portal/`.
- PHP 7.2-safe. No Laravel 8+ / PHP 8 syntax. Lockfile is Laravel **5.3.31**. Some copied product files still say Laravel 7 until production is confirmed.

## Stack check before any UI edit

1. Route starts with `/manager` or file is under `resources/manager-portal/` → **React + Vite**.
2. Everything else in the browser → **Blade + jQuery**. Do not introduce React there.

## What not to do

- Do not rewrite the app or add packages unless asked.
- Do not call raw PHP/SQL/curl against production from an MCP sales-rep conversation; use MCP tools.
- Do not invent Codex CLI flags that are not in the repo.

## Loop selection

| Work | Loop |
|------|------|
| New behavior | [`loops/feature-loop.md`](loops/feature-loop.md) |
| New or redesigned screen (spec first) | [`skills/design-ui.md`](skills/design-ui.md) then feature-loop |
| Defect | [`loops/bug-loop.md`](loops/bug-loop.md) |
| UI change / verify | [`loops/ui-loop.md`](loops/ui-loop.md) |
| QA a flow or new feature | [`loops/qa-loop.md`](loops/qa-loop.md) |
| Restructure | [`loops/refactoring-loop.md`](loops/refactoring-loop.md) |
| Ready to merge | [`loops/pr-loop.md`](loops/pr-loop.md) |
| Wiki ingest / lint | [`skills/wiki.md`](skills/wiki.md) |
