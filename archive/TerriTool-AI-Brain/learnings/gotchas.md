---
title: "Gotchas"
---

# Gotchas

Durable traps. Add a row when you lose time to one. Densest traps also have a one-fact file in [../memory/MEMORY.md](../memory/MEMORY.md) — link it; do not paste the paragraph twice.

| Gotcha | Evidence | What to do |
|--------|----------|------------|
| Docs say Laravel 7; lockfile is 5.3.31 | `composer.lock`, OVERVIEW.md | PHP 7.2-safe; [memory](../memory/laravel-lockfile-5.3.md) |
| Two frontend stacks | `stack-migration-map.md` | `/manager` = React; else Blade/jQuery. [memory](../memory/two-frontend-stacks.md) |
| `CompanylController` spelling | CODEMAP | Do not rename. [memory](../memory/companylcontroller-spelling.md) |
| `Helper::saveAILead` lives in `app/Helpers/helpers.php` not only `Globals/Helper.php` | grep | Search both. [memory](../memory/helper-saveailead-location.md) |
| Subscription table is `user_packages` | data-model-reference | Don’t look for `subscriptions` |
| Notes table is `company_notes` | schema | |
| Route statuses include `failed`, `publish_pending`, `continue_edit` | `user_routes.status` | Don’t assume 3 states |
| MCP `create_route` publishes; web can draft | api-surfaces.md | [memory](../memory/mcp-create-route-publishes.md) |
| `save_ai_leads` ≠ `add_company`; `find_ai_leads` ≠ `search_companies` | api-surfaces collisions | [memory](../memory/save-ai-leads-not-add-company.md) |
| Customer MCP not in `.cursor/mcp.json` | mcp.json | OAuth to running app. [memory](../memory/customer-mcp-not-in-cursor-mcp.md) |
| `view_company` / `view_list` may be wrapper names | not in `territool_app.php` | Use `search_companies`, `view_lists` |
| FullEnrich config key missing from `config/services.php` | Helper vs services.php | UNKNOWN wiring |
| SQL dump stale; live DB has coffee/bookings | data-model-reference | Don’t import dump; don’t touch those tables. [memory](../memory/sql-dump-stale.md) |
| Manager bundle is a build artifact | `vite.config.js` | Edit JSX, `npm run build`. [memory](../memory/manager-bundle-build-artifact.md) |
| MySQL down looks like “empty product” | bug-repro-runbook | Start MySQL (often MAMP port 8889) — app URL is still `http://127.0.0.1:8000/login` |
| Do not QA at MAMP `/webterritool/public` | Human 2026-09-16 | Use `http://127.0.0.1:8000/login`; [memory](../memory/local-qa-url-artisan-serve.md) |
| Do not add a second `wiki/` vault | ADR-009, Karpathy LLM Wiki gist | This Brain **is** the wiki; [memory](../memory/llm-wiki-is-this-brain.md) |
| MAMP PHP 8.2 cannot run the legacy app cleanly | Historical Apache hit at `/webterritool/public/index.php/login` | Not the QA URL; if Apache is used anyway, PHP 7.2–7.4; [memory](../memory/mamp-php-version-compatibility.md) |
| Queue down looks like hung bulk buy | `npm run queue` | |
| `ExampleTest` is not smoke | visits `/` → login; login Blade hits MySQL via `Helper::userActiveSubscription` | Use `--filter Manager`. [memory](../memory/exampletest-not-smoke.md) |
| Guest pages throw `AuthUser is not defined` | `custom_picwa.js` assumes a global only set for logged-in users | Define `AuthUser` for guests (e.g. `null`) or guard in JS |
| Playwright MCP “Browser is already in use” | shared mcp-chrome profile | Close the other MCP browser or use `--isolated`; do not assume the tool is idle |
| `npm run test:e2e` looks runnable but is not coverage | `package.json` has the script; there is no Playwright config/spec; Node 14.19.3 fails because installed Playwright requires Node 20+ | Use real-browser QA today. Do not call the command green; [memory](../memory/playwright-test-unavailable.md) |
| Cursor rules don’t point at this Brain | `.cursor/rules` | **Fixed 2026-09-16** — `.cursor/rules/territool-ai-brain.mdc` alwaysApply; root `AGENTS.md` / `CLAUDE.md` |
| ChatGPT only 16 MCP tools | territorool_app.php | Lists tools may be missing |
| Eloquent relations often missing | data-model-reference | Write joins |
| `resources/js` is not the React app | only `revenuecat.js` | React is `resources/manager-portal/` |
