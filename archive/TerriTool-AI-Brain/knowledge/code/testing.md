---
title: "Testing"
---

# Testing

## What exists

Run from repo root:

```bash
vendor/bin/phpunit --filter Manager   # 17 tests, no MySQL required
vendor/bin/phpunit                    # 18 tests; ExampleTest needs MySQL
```

`phpunit.xml`: suite `./tests` suffix `Test.php`; `APP_ENV=testing`; array cache/session; sync queue.

Observed 2026-09-16 on this checkout (PHP 7.4.33, PHPUnit 5.7.27):

| Command | Result |
|---------|--------|
| `vendor/bin/phpunit --filter Manager` | **17 tests, 51 assertions, OK** — no MySQL |
| `vendor/bin/phpunit` | 18 tests, 1 failure: `ExampleTest` GET `/` redirects to `/login`, which 500s (`PDOException` connection refused). Login Blade calls `Helper::userActiveSubscription` even for guests |

## Tests in the repo

| File | Covers |
|------|--------|
| `tests/ManagerDashboardTerritoryVisitTest.php` | Visit/meeting qualification helpers |
| `tests/ManagerDashboardFieldSalesScoringTest.php` | Leaderboard scoring |
| `tests/ManagerFindLeadsServiceTest.php` | Radius, chips, credit validation helpers |
| `tests/ExampleTest.php` | GET `/` contains “Laravel” — likely **stale** vs real home |
| `tests/TestCase.php` | `baseUrl = http://localhost` |

## What does not exist

- Feature/HTTP tests for web or v2
- MCP protocol tests (there **are** artisan QA commands under UserMcp)
- React component tests
- Playwright Test config/specs. `package.json` exposes `npm run test:e2e`, but this checkout has neither a Playwright config nor specs. It was rechecked on 2026-09-16: Node **14.19.3** cannot launch the installed Playwright, which requires Node **20+**. Do not report this command as test coverage.

**Do not install Playwright Test in this phase** unless a human asks. UI verification today = Playwright **MCP** or a real browser ([../skills/verify-ui.md](../../skills/verify-ui.md)).

## MCP QA (not PHPUnit)

UserMcp console commands (names from discovery): `territool-app:selftest`, `:qa`, `:logs`, `:qa-contacts`, `:qa-search`. Exact signatures: `php artisan list` on a running checkout.

## Agent rules

- Run PHPUnit after Manager service changes — those tests are real. Prefer `--filter Manager` if MySQL is down.
- For credits, routes, MCP: write a focused PHPUnit test **if** you can hit a pure helper without HTTP/DB gymnastics; otherwise verify via UI/MCP and say so.
- Never claim e2e coverage that isn’t in the repo.
- `ExampleTest` failing is not proof the app is down; check what `/` actually renders.
