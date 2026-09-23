---
title: "Cursor exit checklist"
---

# Cursor exit checklist

Goal: operate TerriTool engineering with **Claude + Codex + MCPs**, without Cursor.

Classification:

- **KEEP** — still needed after Cursor
- **MIGRATE** — move to Claude/Codex/repo files
- **REPLACE** — different tool, same job
- **DELETE** — Cursor-only, no successor
- **UNKNOWN**

## Inventory

| Item | Path / what | Class | Action |
|------|-------------|-------|--------|
| Laravel/React coding rule | `.cursor/rules/TerriTool-Project.mdc` | MIGRATE | Fold into [AGENTS.md](AGENTS.md) (already summarized) + keep PHP 7.2/Laravel lockfile fact. Fix the “Laravel 7” claim when humans confirm version. |
| Sentry rule | `.cursor/rules/sentry.mdc` | MIGRATE | Copy org/project/region into Claude MCP + [architecture/integrations.md](knowledge/architecture/integrations.md) (done). |
| Cursor MCP: Sentry | `.cursor/mcp.json` | MIGRATE | Claude MCP config URL `https://mcp.sentry.dev/mcp/territool/territoolre-web` |
| Cursor MCP: Playwright | `.cursor/mcp.json` | MIGRATE | Claude MCP stdio `npx @playwright/mcp@latest` (or Claude built-in browser if equivalent) |
| User/Find/Admin MCP | Laravel HTTP OAuth — **not** in `.cursor/mcp.json` | KEEP | Point Claude connectors at `{APP_URL}/ai/mcp` etc. |
| Admin stdio | `php artisan mcp:stdio` | KEEP | Document in Claude MCP as optional local staff server |
| Playwright MCP dumps | `.playwright-mcp/` | KEEP (gitignore later?) | Evidence of prior runs; not a tool |
| Cursor rules alwaysApply | `.cursor/rules/*.mdc` | DELETE after migrate | Remove when Claude `AGENTS.md` / root `CLAUDE.md` is the entry |
| Cursor commands/prompts/hooks | absent | — | Nothing to migrate |
| This Engineering Brain | `TerriTool AI Brain/` | KEEP | **Only** knowledge system (ADR-008) and **LLM Wiki** (ADR-009: `index.md`, `log.md`). Product facts + skills + loops + UI specs + QA. Claude/Codex read this folder. Do not recreate `TT_Brain_Data` or a second `wiki/` vault. |
| Root `CLAUDE.md` | absent | MIGRATE | **Done 2026-09-16** — repo-root `CLAUDE.md` + `AGENTS.md` |
| Root `AGENTS.md` | absent | MIGRATE | **Done** — pointer to this Brain |
| Codex | absent | UNKNOWN | Install Codex; attach [operating/codex.md](operating/codex.md) |
| Cursor agent transcripts | machine-local | DELETE | Do not treat as product source |
| Item | Path / what | Class | Action |
|------|-------------|-------|--------|
| Project Cursor skills | `.cursor/skills/territool-*` | KEEP (also MIGRATE text into Claude) | **Done 2026-09-16** — copies in `.claude/skills/territool-*` |
| Sales-rep MCP namespace in Cursor | `user-territool-app` (session) | MIGRATE | Configure same OAuth MCP in Claude |
| `user-territool admin` / Salesforce plugin | session namespaces | UNKNOWN | Confirm if team still needs them outside Cursor |
| Undocumented developer knowledge | local URLs, test users, deploy steps | MIGRATE | Local QA URL is `http://127.0.0.1:8000/login`; deploy still UNKNOWN |

## Recommended migration order

1. Add repo-root `CLAUDE.md` pointing at `TerriTool AI Brain/README.md` — **done 2026-09-16** (`AGENTS.md` + `CLAUDE.md` + always-apply Brain rule). Verification commands added to `CLAUDE.md` the same day. `.claude/skills/` copies added 2026-09-16.
2. Add Claude MCP JSON: Playwright + Sentry + (optional) Admin stdio.
3. Connect Customer MCP OAuth in Claude (field verification).
4. Install Codex and run one PR through [loops/pr-loop.md](loops/pr-loop.md).
5. Stop using Cursor rules as the *only* coding standard; this Brain is canonical. Cursor rules now **point at** the Brain.
6. Delete `.cursor/rules` when Claude-only workflow is proven on two real PRs.

## What Cursor still uniquely provides today

- Always-on rules in the IDE
- Playwright MCP already wired
- Sentry MCP already wired
- Agent transcripts

None of these are irreplaceable. The **gap** is project MCP config that Claude/Codex auto-load, and a documented deploy/CI path (independent of Cursor).
