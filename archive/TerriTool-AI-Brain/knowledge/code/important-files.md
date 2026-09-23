---
title: "Important files"
---

# Important files

Not every file. These are the files an agent actually needs for product changes.

## Gravity wells

| File | Does | Inputs | Outputs | Deps | Tests | UI | UCs |
|------|------|--------|---------|------|-------|-----|-----|
| `app/Http/Controllers/CompanylController.php` | Address Book, notes, visits, CSV, Find Leads page glue, buy contacts, maps | Web session + POST | Blade / JSON | Helper, models | none found | `/company`, `/findleads` | UC-CO-*, UC-LEAD-*, UC-CT-* |
| `app/Helpers/helpers.php` (`Helper::saveAILead`) | Persist AI/Yelp leads + credit charge | companies payload | JSON-ish via callers | `user_credits` / BSA table | none found | Find Leads save | UC-LEAD save |
| `app/Http/Controllers/AILeadFinderController.php` | Multi-stage AI search | territories, sell_description | JSON stages + SSE | Gemini, Places, `user_ai_search` | none | `/findleads`, `/ai-lead-finder/*` | UC-LEAD-01… |
| `app/Api/V2/Controllers/CompanyController.php` | Mobile/MCP companies, save leads, buy contacts, AI v2 | JWT | JSON | Helper, credits | none | Mobile, MCP | UC-LEAD, UC-CT, UC-CO |
| `app/Http/Controllers/RouteController.php` | Route list/view/share/export | session | Blade | `user_routes` | none | `/routes` | UC-RTE-* |
| `app/Http/Controllers/ListController.php` | Lists | session | Blade | `user_lists` | none | `/lists` | UC-LST-* |
| `app/Http/Controllers/Manager/ManagerDashboardController.php` | Manager pages + `/manager/api/*` | manager session | JSON + thin Blade | `ManagerDashboardService`, `ManagerFindLeadsService` | PHPUnit on services | `/manager/*` | UC-MGR-* |
| `app/UserMcp/Services/AppMcpProtocolService.php` | JSON-RPC dispatch | MCP messages | tool results | Tool classes, `CustomerApiClient` | `territool-app:qa` artisan, not PHPUnit | Claude/ChatGPT | 20-MCP |
| `app/UserMcp/Services/CustomerApiClient.php` | Internal Dingo v2 calls as the user | tool args | v2 JSON | JWT/Dingo | none | — | all MCP writes |
| `resources/manager-portal/main.jsx` | React mounts | root divs | UI | Vite bundle | none | Manager | UC-MGR-* |
| `public/js/modalScript.js` | Legacy company/map modals | DOM | DOM | jQuery | none | Address Book / maps | UC-CO-* |
| `routes/web.php` / `routes/api.php` | Entry | HTTP | dispatch | Kernel middleware | none | all | all |

## MCP tool classes

| File | Tools |
|------|-------|
| `app/UserMcp/Services/Tools/CompaniesTools.php` | search, status, notes, add company, activities |
| `app/UserMcp/Services/Tools/LeadsTools.php` | find/resume/get/save AI leads |
| `app/UserMcp/Services/Tools/ContactsTools.php` | find/buy/add contacts |
| `app/UserMcp/Services/Tools/RoutesTools.php` | create/view/active/visit/next/from-list |
| `app/UserMcp/Services/Tools/AccountTools.php` | credits |
| `app/UserMcp/config/territool_app.php` | Tool schemas, ChatGPT 16-tool subset, OAuth |

## Auth / billing / CRM (open when that feature is in scope)

- `app/Http/Controllers/Auth/*`
- `app/Http/Controllers/SubscriptionController.php`
- `app/Http/Controllers/SfdcController.php`, `HubSpotController.php`, `KarmaCrmController.php`
- `app/Http/Middleware/RedirectIfSubscribed.php`, `EnsureManagerRole.php`, `authJWT.php`

## Known gotcha files

- `CompanylController` — typo name; huge; easy to edit the wrong method
- `AILeadFinderController` — long-running stages; resume rules
- `config/googlemaps.php` — may contain a hardcoded key (do not copy into docs)
- `public/vendor/adminlte/dist/js/custom_picwa.js` — guest `AuthUser` ReferenceError
- `index.js` at repo root — unrelated; ignore

When you add a new gravity well, add a row here instead of expanding CODEMAP twice. CODEMAP remains the feature-owner table.
