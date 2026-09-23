---
title: "Services"
---

# Services

Most product logic is **not** in `app/Services`. Controllers + `Helper` own writes.

Use a service when one already exists for that job:

| Work | Class |
|------|--------|
| Manager KPIs / scoring | `App\Services\Manager\ManagerDashboardService` — PHPUnit |
| Manager Find Leads assign | `App\Services\Manager\ManagerFindLeadsService` — PHPUnit |
| Claude people search | `ClaudeContactFinderService` |
| Save AI lead / credit check | `Helper::saveAILead` in `app/Helpers/helpers.php` |
| Customer MCP dispatch | `AppMcpProtocolService` + `CustomerApiClient` + `*Tools` |
| User payload / credits | `UserDataService` |

Prefer extending Helper or an existing service over a new parallel class.

Deep table: [../code/services.md](code/services.md).
