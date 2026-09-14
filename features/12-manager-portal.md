# Feature: Manager portal

Related: [06-users-and-roles](../06-users-and-roles.md) · [07-ai-find-leads](07-ai-find-leads.md) · [14-mcp](../14-mcp.md)

**Who:** Business Agent only (`manager.only` / `EnsureManagerRole`). BSA hitting `/manager/*` → `/dashboard`.

Stack: Vite + React 18 islands + Leaflet (`webterritool/package.json`). CSS vars in `public/css/manager-portal.css`. Controller: `Http/Controllers/Manager/ManagerDashboardController`. Chrome: [design-web/MINI-DESIGN-BRAIN.md](../design-web/MINI-DESIGN-BRAIN.md). Vite lists Bootstrap 5; islands do not import it — parent layout is still classic `front.layout` with `body.manager-portal`.

## Routes

| Path | Purpose |
|------|--------|
| `/manager/dashboard` | Team KPIs |
| `/manager/ai-find-leads` + `/manager/api/find-leads*` | Places **circle** hunt + assign (not user V2 city/ZIP) |
| `/manager/salespeople*` | Team CRUD |
| `/manager/activity`, `/support*`, `/reports`, `/settings` | Feed / tickets / settings |
| `/manager/api/{dashboard-data,kpis,team,feed,growth,insights,territory,sidebar-stats,rep/{id}}` | JSON |

Classic team UI still exists at `/businesssalesperson*` (invite, edit, credit).

## MCP (Business Agent extra)

- `list_team`
- `get_team_dashboard` (period `week` \| `month` \| `quarter`)
- `get_team_activity`

Optional `salesperson_id` on existing tools; omit = self / record owner. Scope = self + `users.parent_id`. Find MCP is **not** available to Business Agent.

Find MCP README vs User MCP: Find MCP allowed roles are Sales Agent and BSA only.
