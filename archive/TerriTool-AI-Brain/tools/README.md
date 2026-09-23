---
title: "Tool layer"
---

# Tool layer

The Brain is useless if agents do not run tools. Prefer the real environment.

## Playwright MCP

Browser automation, UI exploration, regression checks, screenshots, reproducing flows.

Wired in `.cursor/mcp.json` as `npx @playwright/mcp@latest`. Skill: [../skills/verify-ui.md](../skills/verify-ui.md). Loop: [../loops/ui-loop.md](../loops/ui-loop.md).

Not the same as Playwright Test. No `playwright.config.*` in this repo.

## Git / GitHub

Before changes: `git status`, branch, recent commits.  
Before finish: `git diff`, `git status`, no accidental files.

Commit only when the user asks. PR via `gh` when the user asks. There is **no** `.github/` CI — say so; do not invent green checks.

## Terminal

| Command | Use |
|---------|-----|
| `vendor/bin/phpunit --filter Manager` | Real suite (no MySQL) |
| `vendor/bin/phpunit` | Full; `ExampleTest` needs MySQL |
| `npm run serve` | **`http://127.0.0.1:8000/login`** (canonical local QA) |
| `npm run build` | After Manager JSX |
| `npm run queue` | Bulk buy / some CRM |
| `php artisan list` | MCP QA commands (`territool-app:*`) |
| `php artisan route:list` | Regenerate ROUTEMAP input |
| `python3 tools/wiki_index.py` | Rebuild [../index.md](../index.md) wiki catalog |
| `python3 tools/wiki_index.py --lint` | Feature completeness (MODULE / UC / FLOW / evidence.md) |

## Product MCPs (not in `.cursor/mcp.json`)

Customer / Find / Admin are Laravel OAuth servers on a **running** app. In Cursor today, typically use code + Playwright + artisan unless those connectors are attached.

Sentry MCP: org `territool`, project `territoolre-web`.

## Wiki catalog / graph

Pattern: [../operating/llm-wiki.md](../operating/llm-wiki.md). Graph: [brain-map/](brain-map/) (`dist/territool-ai-brain-map.html`) or Obsidian on this folder.

## Cursor exit

Long-term: Claude + Codex + MCPs. Checklist: [../cursor-exit.md](../cursor-exit.md).
