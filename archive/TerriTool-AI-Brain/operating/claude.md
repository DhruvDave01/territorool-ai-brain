---
title: "Claude operating model"
---

# Claude operating model

Claude is the primary:

- product understanding agent
- codebase investigation agent
- implementation agent
- debugging agent
- MCP operator (TerriTool User/Find/Admin when connected)
- Playwright operator
- verification agent
- knowledge-maintenance agent

Follow: **Understand → Plan → Execute → Verify → Learn**

Instructions file: [../AGENTS.md](../AGENTS.md). Protocol: [../loops/execution-protocol.md](../loops/execution-protocol.md) (includes subagent split). Memory: [../memory/MEMORY.md](../memory/MEMORY.md). Loops: feature, bug, [ui](../loops/ui-loop.md), [refactor](../loops/refactoring-loop.md). Claude skills: `.claude/skills/`.

## Evidence ranking

1. Running product  
2. Tests  
3. Source code  
4. This Engineering Brain  
5. Assumptions  

On conflict: investigate and update the stale layer.

## MCP usage

- Field work: Customer MCP tools (not PHP/curl). Confirm credits before `save_ai_leads` / `buy_contacts`.
- Preview `save_ai_leads` even for one company; wait for user; then `confirm_all` + `confirm_token` (product MCP rules).
- UI bugs: Playwright MCP per [../skills/verify-ui.md](../skills/verify-ui.md).
- Production errors: Sentry MCP (`territool` / `territoolre-web`).
- Admin lookups: Admin MCP only.

When Claude is not connected to User MCP (typical in Cursor today — `.cursor/mcp.json` only has Sentry + Playwright), use code + Playwright + artisan; do not fake tool results.

## Hand off to Codex

After verification, give Codex the packet defined in [../loops/pr-loop.md](../loops/pr-loop.md). Claude does not need to own PR polish if Codex is available; if Codex is not installed, Claude may open the PR but must still follow that checklist.

## Knowledge maintenance

If you learned something that will still be true next month (new status, new endpoint, broken assumption), patch **this Brain only**:

- the feature `MODULE.md` / `known-issues.md` if it is product behavior
- this Brain (`learnings/`, `memory/`, `code/important-files.md`, UC trace) if it is engineering
- a [SCREEN-SPEC](../ui-flows/SCREEN-SPEC.md) if a new screen shipped
- `LAST_VERIFIED.md` date only if you actually re-checked
- wiki ingest: [../skills/wiki.md](../skills/wiki.md) — [../log.md](../log.md) + `python3 tools/wiki_index.py`

Do not create a parallel pack. This folder **is** the LLM Wiki ([llm-wiki.md](llm-wiki.md)).
