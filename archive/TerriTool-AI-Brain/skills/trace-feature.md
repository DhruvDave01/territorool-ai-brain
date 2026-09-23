---
title: "Skill: Trace feature"
name: territorool-trace-feature
description: >-
  Trace TerriTool behavior UI → frontend → API → backend → database → response.
  Use when you need the execution path and files.
---

# Skill: Trace feature

Trace requested behavior:

**UI → frontend → API → backend → database → response → UI**

## Output

- Execution path (ordered)
- Files
- Dependencies (Helper, jobs, providers)
- Tests
- Failure points (credits, queues, env keys)

## Procedure

1. Identify surface: web session, `/manager`, v2 JWT, User/Find/Admin MCP.
2. If web: URL → `ROUTEMAP.md` → controller method → `view()` or JSON.
3. If Manager: Blade root id → `main.jsx` → component → `/manager/api/*` → `ManagerDashboardController`.
4. If MCP: tool name → `AppMcpProtocolService::$handlers` or config `api` mapping → `CustomerApiClient` → v2 method.
5. If v2: `routes/api.php` → `app/Api/V2/Controllers/*`.
6. Open the method. Follow Helper/model/job calls. Note table writes.
7. Walk the JSON/HTML back to the UI state (loading/empty/error).
8. List tests (`tests/`, artisan MCP qa). Usually none.

## TerriTool shortcuts

| Symptom | First file |
|---------|------------|
| Save AI lead / credits | `Helper::saveAILead`, V2 `saveAILeads` |
| Find Leads stages | `AILeadFinderController` |
| Buy contact | V2 `CompanyController` buy + `ContactsTools` |
| Route publish from AI | `RoutesTools` |
| Manager KPI | `ManagerDashboardService` |
| Login gate | `Auth/LoginController`, V2 `AuthController@login` |

Do not skip the return path — many bugs are response-shape mismatches, not missing inserts.
