---
title: "Backend"
---

# Backend

## Runtime conflict

| Source | Claim |
|--------|--------|
| `composer.lock` | `laravel/framework` **v5.3.31** |
| `composer.json` | `"^7.0\|5.3.31"`, PHP `^7.2` |
| Cursor rules + bible | Laravel 7 / PHP 7.4 |

Treat **installed lockfile as fact** for this checkout. Write PHP 7.2-safe, Laravel 5.3-compatible code unless a human confirms production is Laravel 7.

Laravel 5.3 implications that bite Laravel-7-trained agents:

- No automatic package discovery as in later Laravel (providers are in `config/app.php`)
- Middleware / exception / string helper APIs differ
- Do not use `optional()`-era or PHP 8 constructor property promotion

**UNKNOWN:** whether other environments deploy a different lockfile.

## Layout

| Path | Role |
|------|------|
| `app/Http/Controllers/` | Web + most product writes (`CompanylController` is the gravity well) |
| `app/Http/Controllers/Admin/` | HQ Backpack |
| `app/Http/Controllers/Manager/` | Manager JSON + page shells |
| `app/Http/Controllers/Auth/` | Login, register, trial, onboarding |
| `app/Api/V2/Controllers/` | Mobile + MCP-backing API |
| `app/Api/V1/` | Dead (routes commented) |
| `app/Globals/Helper.php` + `app/Helpers/helpers.php` | Shared geocode, AI save, credits, etc. (`Helper::saveAILead` is in `helpers.php`) |
| `app/Services/` | Manager, Claude finder, invites, UserData, Google Sheets, TikTok |
| `app/UserMcp` `FindMcp` `AdminMcp` `McpClient` | MCP servers + in-app client |
| `app/Jobs/` | **UNKNOWN density** — queue is used (`npm run queue`); inspect per feature |
| `routes/web.php` `api.php` `console.php` | Entry |

Providers for MCP are registered in `config/app.php`.

## Request flow (web)

Route in `web.php` → middleware (`web`, `auth`, `subscriber`, `role`, `manager.only`) → controller method → Eloquent / raw queries / Helper → Blade `view()` or JSON.

## Request flow (MCP)

HTTP JSON-RPC → `AppMcpHttpController` → `AppMcpProtocolService` → tool class **or** `CustomerApiClient` internal Dingo call to v2 → same controller as mobile.

## Controllers (feature owners)

Copied from CODEMAP (verify in `knowledge/code/CODEMAP.md` if stale):

`CompanylController`, `AILeadFinderController`, `ContactController`, `RouteController`, `RoutesController`, `SimpleRouteController`, `AdvancedRouteController`, `ListController`, `SubscriptionController`, `SalespersonController`, `BusinesssalespersonController`, `ManagerDashboardController`, `HomeController`, CRM trio, `SupportController`, `CronController`, `Api\V2\*`, `Admin\*`.
