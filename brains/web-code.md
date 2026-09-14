# 3. Web Code Brain

Hub for Laravel + Blade + manager React islands + MCP PHP. Sibling: [Web Design Brain](web-design.md) · [API Brain](api.md). Parent: [sub brains](README.md).

**Repo:** `/Users/dhruvdave/Dhurv/Project_TerriTool/Territool_web/webterritool`  
**Do not cite the workspace folder as a source.**

## Read first

1. This file (rules).
2. [code/web-code-details.md](../code/web-code-details.md) — file map.
3. The controller / Blade / MCP handler you will edit.
4. New URL: [13-web-urls.md](../13-web-urls.md). New mobile JSON: [API Brain](api.md).
5. If the page **looks** wrong: [Web Design Brain](web-design.md), then stay on the same stack (classic vs manager).

## Must follow

| Rule | Do this |
|------|---------|
| Company / leads / contacts UI | `CompanylController` — extra **l**. Surgical edits; ~8500 LOC. |
| Mobile JSON | `app/Api/V2/Controllers/` + `routes/api.php`. |
| Helpers | `app/Helpers/helpers.php` → `App\Helpers\Helper`. Not `App\Globals\Helper`. |
| Requests | CompanylController aliases `Request AS INPUT_REQUEST`. |
| MCP | `app/UserMcp/config/territool_app.php` then `Services/Tools/*Tools.php`. Dispatch the same API; **do not fork credit math**. |
| Classic AJAX | `FormData` + `contentType: false` + `processData: false`. |
| Tables | Address Book + Find Leads = **jqxGrid**. Routes/lists index = DataTables. Do not swap. |
| Roles | Spatie `HasRoles`. Manager scope = self + `users.parent_id`. |
| HQ | `/hq/*` Backpack. Do not mix into `/manager` or classic app. |

## Open first

| Task | File |
|------|--------|
| New web URL | `routes/web.php` |
| Mobile v2 URI | `routes/api.php` |
| AI Find Leads SSE | `AILeadFinderController` + `resources/views/front/route/findleads.blade.php` |
| Manager portal | `Http/Controllers/Manager/` + `resources/views/front/manager/` + `resources/manager-portal/` |
| User MCP | `app/UserMcp/` — HTTP `/ai/mcp` |
| Admin MCP | `app/AdminMcp/` — `/ai/mcp-admin` |
| Find MCP | `app/FindMcp/` — `/find-mcp/mcp` |

## Two products in one repo

Classic Sales Agent / BSA = Blade + jQuery 2.2.0 + Bootstrap 3 AdminLTE.  
Business Agent `/manager/*` = Vite + React 18 islands.  
Do not convert a classic page into an island (or the reverse) unless that sibling page already did.

Full controller / V2 / MCP tables: [11-web-backend.md](../11-web-backend.md) · [14-mcp.md](../14-mcp.md).
