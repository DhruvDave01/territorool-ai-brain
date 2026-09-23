---
title: "Repository map"
---

# Repository map

Ignore `vendor/`, `node_modules/`, `public/jqwidgets/`, `public/packages/`, `storage/logs`, `.playwright-mcp/` dumps unless debugging a specific session.

| Path | What it is | When you open it |
|------|------------|------------------|
| `app/Http/Controllers/` | Web/HQ controllers | Feature change on Blade/web |
| `app/Api/V2/` | Mobile + MCP backing API | Phone, MCP, shared writes |
| `app/Helpers/helpers.php` | `Helper::saveAILead` and other static helpers | Credits, AI save |
| `app/Globals/Helper.php` | Additional Helper surface | Geocode / enrich HTTP |
| `app/Services/` | Manager, Claude finder, etc. | Manager Portal, contact Claude |
| `app/Models/` | Eloquent (+ MongoDB subfolder) | Schema/behavior |
| `app/User.php` | Web user model | Roles, auth |
| `app/UserMcp/` | Customer MCP | Tool contract, OAuth |
| `app/FindMcp/` | Find-only MCP | Smaller tool set |
| `app/AdminMcp/` | Staff MCP | HQ lookups |
| `app/McpClient/` | In-app remote MCP chat | Settings connector |
| `routes/web.php` | Session routes | URL → controller |
| `routes/api.php` | Dingo v2 | Mobile/MCP |
| `resources/views/front/` | Legacy UI | Almost all rep screens |
| `resources/manager-portal/` | React source | Manager UI |
| `public/js/manager-portal.js` | **Build output** | Never hand-edit |
| `public/js/modalScript.js` | Legacy shared JS | Modals, maps, company UI |
| `public/css/custom.css` | Legacy CSS | Styling |
| `config/` | Laravel + integrations | Env wiring |
| `tests/` | PHPUnit | Manager helpers only |
| `TerriTool AI Brain/` | This Engineering Brain | Product, knowledge, skills, loops |
| `.cursor/` | Cursor rules + MCP | To migrate (see cursor-exit) |
| `packages/davispeixoto/` | Salesforce toolkit | CRM |
| `database/migrations/` | Incomplete history | MCP tables; not full schema |
| `index.js` | Unrelated HTML titled “Rocket Stock Data” | Ignore unless asked |

Feature → file: `knowledge/code/CODEMAP.md`.  
URL → method: `knowledge/code/ROUTEMAP.md`.
