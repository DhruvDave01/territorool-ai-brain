---
title: "Skill: Verify UI"
name: territorool-verify-ui
description: >-
  Verify TerriTool UI in a real browser (Playwright MCP). Use for screens,
  credits-visible UX, login, Find Leads, routes, lists, Manager Portal.
---

# Skill: Verify UI

Static reading is not enough for UI or credit-visible behavior. **Executable understanding** means running the app.

## Distinguish two Playwrights

| | Playwright MCP | Playwright Test (`npm run test:e2e`) |
|--|----------------|--------------------------------------|
| Purpose | Agent drives a real browser now | Committed regression suite |
| Status | **Installed for Cursor** via `.cursor/mcp.json` (`npx @playwright/mcp@latest`). Session dumps in `.playwright-mcp/` | **Not configured** (no `playwright.config.*`, no specs) |
| This phase | **Use it** (or a real browser) | Do **not** silently install a suite |

When Cursor is gone, Playwright MCP (or Claude’s browser tool) must be configured in Claude’s MCP file. See [../cursor-exit.md](../cursor-exit.md).

## Workflow

1. **Launch** — `npm run serve` / `php artisan serve`. Open **`http://127.0.0.1:8000/login`**. Do **not** use `http://localhost:8888/webterritool/public`. Confirm MySQL (often `127.0.0.1:8889`).
2. **Build** — if Manager Portal files changed: `npm run build` (or `npm run dev`).
3. **Queue** — if the flow is bulk buy / some CRM: `npm run queue`.
4. **Navigate** — start at the flow’s starting point ([../ui-flows/README.md](../ui-flows/README.md)).
5. **Act** as the user (click, type, submit).
6. **Observe** result + loading/empty/error.
7. **Inspect** console and network (Playwright MCP console/network tools).
8. **Confirm state** — DB-visible effects: company exists, credits changed, route tab.
9. **Capture evidence** — screenshot, URL, credit before/after, console errors.
10. **Report** pass/fail against the UC expected result. If the human asked for QA, use the table in [../loops/qa-loop.md](../loops/qa-loop.md).

A single screenshot of a render is **not** verification.

## How an agent executes major workflows

| Flow | Tool | Success evidence | Common failure |
|------|------|------------------|----------------|
| Login | Playwright MCP | Redirect to role home; session cookie | `AuthUser is not defined` on `/login`; wrong landing |
| Find Leads save | Playwright or Customer MCP | Balance −1; company in Address Book | Save with 0 credits; search charged |
| Buy contact | Playwright or MCP | −2 or −1; contact row | Treated as free; queue not running for bulk |
| Create route (web) | Playwright | Draft or Published per UI | Timeout; <2 stops |
| Create route (MCP) | Customer MCP | `route_url` Published | Agent saved draft; used `add_company` for AI hits |
| Manager dashboard | Playwright | React root filled | Blank root; stale `manager-portal.js` |
| Assign leads | Playwright + credits | BSA has companies; manager credits down | Wrong wallet table |

## Environment failures (not product bugs)

- Canonical local QA is `http://127.0.0.1:8000/login`. `http://localhost:8888/webterritool/public` is **not** the QA host. If `127.0.0.1:8000` is down, staging `https://staging.territool.com/login` may still be 200.
- Playwright MCP may error `Browser is already in use ... mcp-chrome-... use --isolated`. List/close tabs or retry isolated; don’t treat that as an app outage.

## Local vs staging

- Local: `http://127.0.0.1:8000/login` via `npm run serve`. Needs `.env`, MySQL (often MAMP on `8889` — DB only), API keys for Places/Gemini/FullEnrich. Missing keys ≠ product bug.
- Staging: `https://staging.territool.com` — compare to `feature evidence.md catalogs (screenshots not copied)`.
- Credentials: **UNKNOWN** in repo (correct). Human provides a test user.

## Recommended integration (not done in this phase)

1. Keep Playwright MCP as the agent browser.
2. Add a project-level MCP config (Claude) pointing at the same server.
3. Later: add Playwright Test for FLOW-AUTH, FLOW-FIND-LEADS save, FLOW-MANAGER smoke — only after sign-off.
4. Document a fixture user + seed — currently missing.

## Sentry

If the bug is production-only: Sentry MCP, org `territool`, project `territoolre-web`.
