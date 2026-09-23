---
title: "Memory index"
---

# Memory index

Load this file when a fact might apply. Open the linked file — do not rely on this one-line summary.

After a correction, write a **new memory file** (one fact) and add a row here. Also add a row to [../learnings/gotchas.md](../learnings/gotchas.md) if it is a trap. Do not copy the same paragraph into three places; link.

| Memory | When it applies |
|--------|-----------------|
| [single-brain.md](single-brain.md) | Any knowledge, spec, QA report, or “where do I write this?” |
| [llm-wiki-is-this-brain.md](llm-wiki-is-this-brain.md) | Wiki / ingest / “should I add a wiki folder?” |
| [laravel-lockfile-5.3.md](laravel-lockfile-5.3.md) | Any PHP / Laravel change |
| [two-frontend-stacks.md](two-frontend-stacks.md) | Any browser UI edit |
| [companylcontroller-spelling.md](companylcontroller-spelling.md) | Company / Address Book controllers |
| [helper-saveailead-location.md](helper-saveailead-location.md) | Save AI lead / credits |
| [mcp-create-route-publishes.md](mcp-create-route-publishes.md) | Routes from MCP vs web |
| [save-ai-leads-not-add-company.md](save-ai-leads-not-add-company.md) | AI search hits vs named accounts |
| [sql-dump-stale.md](sql-dump-stale.md) | Schema, migrations, SQL dumps |
| [manager-bundle-build-artifact.md](manager-bundle-build-artifact.md) | Manager Portal JS |
| [local-qa-url-artisan-serve.md](local-qa-url-artisan-serve.md) | Local browser / QA URL |
| [mamp-php-version-compatibility.md](mamp-php-version-compatibility.md) | MAMP PHP version if someone still hits Apache |
| [exampletest-not-smoke.md](exampletest-not-smoke.md) | PHPUnit / “all tests red” |
| [playwright-test-unavailable.md](playwright-test-unavailable.md) | `npm run test:e2e` / browser-test claims |
| [customer-mcp-not-in-cursor-mcp.md](customer-mcp-not-in-cursor-mcp.md) | Field-rep MCP from Cursor |

Template:

```markdown
---
name: short-kebab-name
description: One line — when to load this file
type: project
---

The fact.
Why: evidence (file, date, command).
How to apply: what the agent must do.
```
