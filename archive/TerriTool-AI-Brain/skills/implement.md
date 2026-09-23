---
title: "Skill: Implement"
name: territorool-implement
description: >-
  Implement a TerriTool change. Use when building after a plan — PHP 7.2-safe,
  correct stack, Helper/v2 for shared writes.
---

# Skill: Implement

Workflow:

**Understand requirement → identify use case → (new/redesigned UI: screen spec) → trace implementation → identify affected components → propose plan → implement → test → verify → document in this Brain**

## Plan must list

- Clients in scope (web, v2, MCP, manager)
- Credit impact
- Frontend stack
- Files to change
- Tests to run
- UI verification steps (or [SCREEN-SPEC.md](../ui-flows/SCREEN-SPEC.md) if new UI)
- Brain files to update (**this folder only**)

## Implementation rules

- Laravel 5.3 / PHP 7.2 compatible (lockfile). No PHP 8.
- Minimal diff. Reuse Helper/models.
- If the rule is shared, put it where v2 already lives — not only in Blade.
- Do not add packages unless asked.
- Do not rename `CompanylController`.
- Manager: edit JSX, then `npm run build`.

## After code

1. PHPUnit if Manager services or you added tests
2. Verify UI/MCP
3. Update feature `MODULE.md` if behavior changed
4. Update this Brain if you found a durable fact (`learnings/` and, for one-fact traps, `memory/`)
5. If the human asked for QA, [../loops/qa-loop.md](../loops/qa-loop.md)
6. Hand off to [../loops/pr-loop.md](../loops/pr-loop.md) (Codex)
