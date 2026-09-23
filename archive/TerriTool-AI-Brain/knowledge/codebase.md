---
title: "Codebase"
---

# Codebase

Monolith named `laravel/laravel` at the repo root.

| Path | Open when |
|------|-----------|
| `app/Http/Controllers/` | Blade / web feature |
| `app/Http/Controllers/CompanylController.php` | Companies, notes, visits, CSV, Find Leads page, buy contacts, maps |
| `app/Http/Controllers/AILeadFinderController.php` | AI search stages |
| `app/Api/V2/` | Mobile + MCP backing API |
| `app/Helpers/helpers.php` | `Helper::saveAILead` and credit checks |
| `app/Globals/Helper.php` | Extra Helper surface (geocode / enrich HTTP) |
| `app/Services/Manager/` | Manager Portal scoring / assign; **PHPUnit lives here** |
| `app/UserMcp/` `app/FindMcp/` `app/AdminMcp/` | MCP servers |
| `routes/web.php` `routes/api.php` | URL → method |
| `resources/views/front/` | Rep UI |
| `resources/manager-portal/` | Manager React **source** |
| `public/js/manager-portal.js` | Build output — never hand-edit |
| `public/js/modalScript.js` | Legacy shared JS |
| `tests/` | PHPUnit (Manager helpers + stale ExampleTest) |
| `TerriTool AI Brain/` | This Brain |
| `packages/davispeixoto/` | Salesforce toolkit |
| `database/migrations/` | Sparse; not full schema |

Ignore `vendor/`, `node_modules/`, `public/jqwidgets/`, `.playwright-mcp/` dumps unless debugging a specific session.

Feature → controller: [CODEMAP.md](code/CODEMAP.md).  
URL → method: [ROUTEMAP.md](code/ROUTEMAP.md) (725 routes; regenerate, do not hand-edit).  
Folder map: [../code/repository-map.md](code/repository-map.md).  
Gravity wells: [../code/important-files.md](code/important-files.md).
