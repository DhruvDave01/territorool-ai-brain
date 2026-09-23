---
title: "Skill: Test"
name: territorool-test
description: >-
  Run the tests that exist for TerriTool. Use after a code change — PHPUnit
  Manager filter; there is no Playwright Test suite.
---

# Skill: Test

## Automated (exists)

```bash
vendor/bin/phpunit --filter Manager
vendor/bin/phpunit
```

Relevant today mainly for `app/Services/Manager/*`. Full suite includes `ExampleTest`, which needs MySQL (login layout queries `user_packages`).

UserMcp QA artisan commands: run `php artisan list` and use `territool-app:*` where applicable.

## Automated (does not exist)

- Playwright Test (`npm run test:e2e`) — **no config or specs**; on 2026-09-16 it also failed before discovery because Node 14.19.3 is below Playwright's Node 20+ requirement. Do not report it as a passing suite.
- Jest/Vitest — absent.

## What to add (when you write tests)

- Prefer PHPUnit around pure helpers (credit math, filters) — matches existing style.
- Do not add a fake test that asserts `true`.
- HTTP/MCP tests are valuable but need fixtures; only add if the task includes them.

## Mapping

| Change area | Run |
|-------------|-----|
| Manager scoring / find-leads helpers | PHPUnit |
| Blade/jQuery UI | Playwright MCP / browser ([verify-ui.md](verify-ui.md)) |
| Credits | PHPUnit if isolated **and** UI/MCP balance check |
| MCP tools | Artisan qa + side effect in UI |
