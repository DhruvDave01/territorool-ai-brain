---
title: "Architecture"
---

# Architecture

One Laravel process. Three clients of the **same** product rules.

```
Browser session  →  routes/web.php     →  controllers / Helper  →  MySQL territorool
JWT mobile/MCP   →  Dingo /api/v2      →  app/Api/V2            →  same models
MCP OAuth        →  User/Find/Admin MCP → CustomerApiClient → v2
Manager React    →  /manager/api/*     →  ManagerDashboardController
HQ               →  /hq                →  Backpack
```

## Boundaries that matter for engineering

1. Field-rep **writes** (credits, save lead, visit, route publish) must live in Helper / v2 so web, phone, and MCP cannot drift.
2. Two frontend stacks: `/manager` is React + Vite; all other browser UI is Blade + jQuery.
3. MCP modules are façades, not a second app. Customer MCP at `{APP_URL}/ai/mcp`.
4. V1 API is commented out. Ignore it.
5. Admin MCP is staff lookup (`sales_desk` + HQ), not Address Book writes.

## What is not in this repo

iOS/Android source, Docker, GitHub Actions, deploy scripts, Playwright Test specs.

Deep: [system-overview.md](architecture/system-overview.md), [backend.md](architecture/backend.md), [frontend.md](architecture/frontend.md), [authentication.md](architecture/authentication.md), [discovery-report.md](../discovery-report.md).
