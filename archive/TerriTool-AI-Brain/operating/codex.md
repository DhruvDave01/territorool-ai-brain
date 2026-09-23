---
title: "Codex operating model"
---

# Codex operating model

Codex is the **PR / review / delivery** agent, not the product-explorer.

There is **no** Codex config or CLI wrapper in this repository. Do not invent commands (`codex review`, etc.) until they exist. Bind this document to real invocations when installed.

## Role

| Claude | Codex |
|--------|-------|
| Understand product, trace, implement, run the app, MCP, Playwright | Review diff, run static+PHPUnit, write PR, chase CI, small review fixes |
| Update bible/Brain with product facts | Check that those updates exist (`MODULE.md`, `log.md`, regenerated `index.md`) |

Workflow: [../loops/pr-loop.md](../loops/pr-loop.md).

## Inputs Codex should demand

- Stated UC + flow
- Verification evidence
- Credit impact
- Stack (legacy vs React)

If missing, send back to Claude — do not explore the product from scratch unless asked.

## Outputs

- Review comments (blocking vs nit)
- PR title/body with test plan
- Explicit “CI: none in repo” until Actions exist
