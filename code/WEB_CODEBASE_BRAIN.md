---
id: WEB_CODEBASE_BRAIN
parent: code
sources:
  - webterritool/composer.json
  - webterritool/app/UserMcp/config/territool_app.php
  - webterritool/app/Http/Controllers/CompanylController.php
  - webterritool/routes/api.php
  - webterritool/routes/web.php
related:
  - code/web-code-details.md
  - brains/web-code.md
  - 11-web-backend.md
  - 14-mcp.md
  - 2026-09-17.md
---
# Web / API / MCP — codebase brain

Live scan **2026-09-17** of `/Users/dhruvdave/Dhurv/Project_TerriTool/Territool_web/webterritool`. No product code changed. No env **values**. UI: [design-web/MINI-DESIGN-BRAIN.md](../design-web/MINI-DESIGN-BRAIN.md). File map: [web-code-details.md](web-code-details.md).

## 01. Metadata

| Field | Value |
|-------|--------|
| PHP / Laravel | `^7.2` / `^7.0` |
| Dingo | `1.0.*@dev`, routes `version('v2')` |
| JWT | `tymon/jwt-auth` `0.5.*` require-dev |
| Backpack | base `^0.7.5`, crud `^3.1`, prefix **`hq`** |
| Manager UI | Vite 5 + React 18 → `public/js/manager-portal.js` |
| Node engines | **Unknown** (unpinned) |
| `.env.example` | **Missing** — names from `env()` only |

## 02. AI usage rules

Do not invent MCP tools. User MCP catalog is `app/UserMcp/config/territool_app.php` **v1.4.1** (33 tools). Dispatch Dingo `/api/v2`; do not fork credit math.

## 03–06. Overview, stack, structure, architecture

Classic app: Blade + jQuery 2.2 + Bootstrap 3 AdminLTE. Manager: Blade shell + React islands. HQ: Backpack `/hq`. Giant web controller: `CompanylController.php` (**8510** lines, extra **l**). API companies: `app/Api/V2/Controllers/CompanyController.php` (different class). Helper autoload `app/Helpers/helpers.php` vs `App\Globals\Helper` — do not mix.

Dingo v1 block commented. Protected APIs: `jwt.refresh`. Public URL prefix **Unknown** at runtime (`API_PREFIX` may be null). Mobile uses `/index.php/api/`.

## 07. Startup / request path

Web: `public/index.php` → Laravel kernel → `routes/web.php` (session) or Dingo `routes/api.php`. MCP: `{APP_URL}/ai/mcp`, `/ai/mcp-admin`, `/find-mcp/mcp`.

## 08–11. Roles, features, pages

Roles SQL: 1 Sales Agent, 2 Admin, 3 Business Agent, 4 Business Sales Agent. `/manager/*` requires Business Agent (`EnsureManagerRole`). Admin hitting HQ stays `/hq`; field roles hitting HQ redirect `/dashboard`.

Page inventory: [design-web/Page-Inventory.md](../design-web/Page-Inventory.md). URLs: [13-web-urls.md](../13-web-urls.md).

## 12–17. API, auth, data, credits

Important Dingo names: `login`, `getusercredit`, `createroute`, `simplerouteview`, `publishroute`, `getAILeadsV2`, `resumeAILeadSearch`, `saveAILeads` (**not** `saveai`), `buyContacts`, `addcompany`, `addcontact`, `addnote`, `fetchAllContacts`, `routelist`, `getlist`.

Credits (Confirmed in PHP):

| Action | Credits | Where |
|--------|---------|--------|
| Paid / FE / DA redeem | 2 | `CompanylController` ~2715–2720; `Helper::applyCreditsForBulkRedeem` |
| Free / Claude / OpenCorporates redeem | 1 | same |
| Save AI lead | 1 each | `helpers.php` `used_credit + insertedCompanyCount` |

Packages checked in helpers: ids `1, 2, 4, 5, 6`. Admin MCP comments paid `[2,5,6]`, trial `[1,4]`.

## 18–20. MCP

**User** `territool-app` **1.4.1**, write, roles SA/BSA/BA. Tools (33): search_companies, view_company, set_company_status, add_contact, add_company, get_credits, find_contacts, find_contacts_bulk, add_note, get_notes, find_ai_leads, resume_ai_lead_search, save_ai_leads, create_route, mark_visited, add_activity, buy_contacts, next_waypoint, get_ai_lead_search, view_lists, view_list, create_list, view_routes, view_route, get_active_route, create_route_from_list, view_activities, edit_activity, list_team, get_team_territories, recommend_lead_distribution, get_team_dashboard, get_team_activity.

Manager-only: `list_team`, `get_team_territories`, `recommend_lead_distribution`, `get_team_dashboard`, `get_team_activity`.

`create_route` / `create_route_from_list`: POST `createroute` then `finishPublishedRoute` → status **published** + `route_url` (`RoutesTools.php`). Type **basic**.

`save_ai_leads` (User MCP): first call never saves; `confirm_token` + `confirm_all`; then `saveAILeads`.

**Admin** read_only, 8 list_* tools, `hq/login`.

**Find** field-rep only (not BA). 7 tools. `save_ai_leads` **no** preview token.

ChatGPT truncated lists exist (`chatgpt_tools` 19, `chatgpt_manager_tools` 25); clients may still drop to ~16.

## 21–33. Front, env, tests, native N/A

Do not mix classic leftover teal with manager CSS variables. Env **names**: [ops/env-inventory.md](../ops/env-inventory.md). QA artisan: `territool-app:qa` / `selftest` / `qa-contacts` / `qa-search`.

## 34–49. Maps and leftovers

File map: [web-code-details.md](web-code-details.md). HubSpot secret env key is misspelled `HUBSPOT_CLIENT_SECERET` in `config/app.php` — document, do not “fix” in notes. Vue 2 is in `package.json` but is **not** the manager Vite entry.

**Unknown:** Node version; public Dingo URL shape; Sales Desk write APIs mentioned in Admin MCP comments but not in Admin `tools` array.
