---
id: web-code
parent: brains
sources:
  - webterritool/
  - app/Http/Controllers/CompanylController.php
  - app/Api/V2/Controllers/
  - routes/api.php
  - app/Globals/Helper.php
  - app/UserMcp/config/territool_app.php
  - "app/UserMcp/Services/Tools/{Account,Companies,Contacts,Leads,Manager,Routes}Tools.php"
  - UserMcp/Services/CustomerApiClient.php
related:
  - brains/web-design.md
  - brains/api.md
  - brains/README.md
  - code/web-code-details.md
  - 13-web-urls.md
  - 14-mcp.md
---
# 3. Web Code Brain

Hub for Laravel + Blade + manager React islands + MCP PHP. Sibling: [Web Design Brain](web-design.md) · [API Brain](api.md). Parent: [sub brains](README.md).

**Repo:** `webterritool/` (`composer.json` `laravel/framework` `^7.0`). Code wins.

## Read first

1. This file.
2. [code/web-code-details.md](../code/web-code-details.md) · [code/WEB_CODEBASE_BRAIN.md](../code/WEB_CODEBASE_BRAIN.md).
3. The controller / Blade / MCP handler.
4. URLs: [13-web-urls.md](../13-web-urls.md). Mobile JSON: [API Brain](api.md).
5. Pixels → [Web Design Brain](web-design.md). Stay on the **same stack**.

## Must follow

| Rule | Do this |
|------|---------|
| Company / leads / contacts web UI | `app/Http/Controllers/CompanylController.php` — extra **l**. Surgical. |
| Mobile JSON | `app/Api/V2/Controllers/` + `routes/api.php` version **`v2`**. JWT group middleware **`jwt.refresh`**. |
| Helpers | Autoloaded `app/Helpers/helpers.php` → `App\Helpers\Helper`. Distinct from `App\Globals\Helper` (`app/Globals/Helper.php`). Helpers import Globals as `GlobalHelper`. |
| Requests | CompanylController aliases `Request AS INPUT_REQUEST`. |
| MCP | Config `app/UserMcp/config/territool_app.php`, handlers `app/UserMcp/Services/Tools/{Account,Companies,Contacts,Leads,Manager,Routes}Tools.php`. Dispatch the same API. **Do not fork credit math.** Client: `UserMcp/Services/CustomerApiClient.php` (`/api/v2`). |
| Classic AJAX | `FormData` + `contentType: false` + `processData: false`. |
| Tables | Address Book + Find Leads = **jqxGrid**. Routes/lists **index** = DataTables. |
| Roles | Spatie `HasRoles`. Manager scope = self + `users.parent_id`. |
| HQ | `/hq/*` Backpack. Not `/manager`, not classic app. |
| Cron | Public GET on `CronController`, not `Kernel::schedule()`. |

## Open first

| Task | File |
|------|------|
| New web URL | `routes/web.php` |
| Mobile v2 URI | `routes/api.php` |
| AI Find Leads SSE (classic) | `AILeadFinderController` + `resources/views/front/route/findleads.blade.php` |
| Manager portal PHP | `app/Http/Controllers/Manager/` + `resources/views/front/manager/` |
| Manager islands | `resources/manager-portal/` entry `main.jsx`, `api.js` |
| User MCP HTTP | `{APP_URL}/ai/mcp` — `app/UserMcp/routes/app_mcp.php` (prefix `ai`, **not** defined in `routes/web.php`) |
| Admin MCP | `/ai/mcp-admin` — `app/AdminMcp/` |
| Find MCP | `/find-mcp/mcp` — `app/FindMcp/` (Sales Agent + BSA only, **not** Business Agent) |

## V2 controllers (`app/Api/V2/Controllers/`)

`AuthController`, `CompanyController`, `RouteController`, `ListController`, `ContactSellController`, `WebhookController`, `SupportController`, `UserDataController`, `InviteController`, `ProfileController`, `CityController`.

Giant web UI: `CompanylController`, `RoutesController`, `RouteController`, `SimpleRouteController`, `AdvancedRouteController`, `ListController`, `ContactController`, `SubscriptionController`, CRM (`SfdcController`, `HubSpotController`, `KarmaCrmController`).

## Manager islands (`resources/manager-portal/`)

Pages: `ManagerDashboard.jsx`, `ManagerActivity.jsx`, `Salespeople.jsx`, `SalespersonDetail.jsx`, `SalespersonForm.jsx`, `SalespersonRoutes.jsx`, `ConvertSalesperson.jsx`, `ManagerSettings.jsx`, `SupportTickets.jsx`, `SupportTicketForm.jsx`, `SupportTicketDetail.jsx`, `AIFindLeads.jsx`, `AIFindLeadsPage.jsx`, plus assign/modals.

Mount roots (Blade + `main.jsx`):

`#manager-dashboard-root`, `#manager-activity-root`, `#manager-salespeople-root`, `#manager-salesperson-detail-root`, `#manager-salesperson-form-root`, `#manager-salesperson-convert-root`, `#manager-salesperson-routes-root`, `#manager-settings-root`, `#manager-support-root`, `#manager-support-create-root`, `#manager-support-detail-root`, `#manager-ai-find-leads-root`, `#manager-toast-root`.

## User MCP tools (do not invent)

`search_companies`, `view_company`, `set_company_status`, `add_contact`, `add_company`, `get_credits`, `find_contacts`, `find_contacts_bulk`, `add_note`, `get_notes`, `find_ai_leads`, `resume_ai_lead_search`, `save_ai_leads`, `create_route`, `mark_visited`, `add_activity`, `buy_contacts`, `next_waypoint`, `get_ai_lead_search`, `view_lists`, `view_list`, `create_list`, `view_routes`, `view_route`, `get_active_route`, `create_route_from_list`, `view_activities`, `edit_activity`.

**Manager-only catalog** (`manager_tools` in `territool_app.php` **v1.4.1**): `list_team`, `get_team_territories`, `recommend_lead_distribution`, `get_team_dashboard`, `get_team_activity`. Full User MCP catalog is **33** tools. Many field tools also accept `salesperson_id` for managers (`manager_salesperson_id_tools`); handlers ignore it for reps.

Admin MCP (read-only HQ): `list_sales_agents`, `list_cancelled_subscribers`, `list_active_subscribers`, `list_active_trials`, `list_expired_trials`, `list_cancelled_trial_subscribers`, `list_user_credits`, `get_user_subscription_history`.

Operating rules: [14-mcp.md](../14-mcp.md).

## Two products

Classic Sales Agent / BSA = Blade + jQuery **2.2.0** + Bootstrap **3.3.5** AdminLTE (`front/layout.blade.php`).  
Business Agent `/manager/*` = Vite + React 18 islands; shells still `@extends('front.layout')` then `body.manager-portal` hides gutters.

Do not convert a classic page into an island unless that sibling already did.

## Trained if you can

- Add a v2 URI inside `jwt.refresh` (or leave it public if it is login/citysearch/webhooks).
- Edit company UI in `CompanylController` without “fixing” the class name.
- Add a manager island with a `#manager-*-root` and `main.jsx` mount.
- Call an existing MCP tool name only.
