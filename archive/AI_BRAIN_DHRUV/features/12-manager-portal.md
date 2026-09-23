---
id: 12-manager-portal
parent: features
sources:
  - webterritool/package.json
related:
  - 06-users-and-roles.md
  - features/07-ai-find-leads.md
  - 14-mcp.md
  - design-web/MINI-DESIGN-BRAIN.md
  - screens/web-how-it-works.md
  - screens/manager-mcp-how-it-works.md
---
# Feature: Manager portal

Related: [06-users-and-roles](../06-users-and-roles.md) · [07-ai-find-leads](07-ai-find-leads.md) · [14-mcp](../14-mcp.md) · **web cockpit:** [screens/web-how-it-works.md](../screens/web-how-it-works.md) · **MCP assign/route/contacts:** [screens/manager-mcp-how-it-works.md](../screens/manager-mcp-how-it-works.md)

**Who:** Business Agent only (`manager.only` / `EnsureManagerRole`). BSA hitting `/manager/*` → `/dashboard`.

Stack: Vite + React 18 islands + Leaflet (`webterritool/package.json`). CSS vars in `public/css/manager-portal.css`. Controller: `Http/Controllers/Manager/ManagerDashboardController`. Chrome: [design-web/MINI-DESIGN-BRAIN.md](../design-web/MINI-DESIGN-BRAIN.md). Vite lists Bootstrap 5; islands do not import it — parent layout is still classic `front.layout` with `body.manager-portal`.

## Routes

| Path | Purpose |
|------|--------|
| `/manager/dashboard` | Team KPIs |
| `/manager/ai-find-leads` + POST `/manager/api/find-leads*` | Places **circle** hunt (not user V2 city/ZIP). Duplicate GET is live |
| `/manager/api/create-leads`, `create-leads-batch` | Assign saved hunt hits to reps |
| `/manager/salespeople*` | Team CRUD + `/{id}/details|routes|remove|resend-invitation` |
| `/manager/activity`, `/manager/support*`, `/reports`, `/settings` | Feed / tickets (create/reply still classic `/support*` POSTs) / Coming soon reports / settings |
| `/manager/api/{dashboard-data,kpis,team,feed,growth,insights,territory,sidebar-stats,rep/{id},rep/{id}/territory}` | JSON. `territory` = map coverage, **not** MCP `get_team_territories` |

Classic team UI still exists at `/businesssalesperson*` (invite, edit, credit).

## MCP (Business Agent extra)

User MCP **1.4.1** manager-only tools:

- `list_team`
- `get_team_territories`
- `recommend_lead_distribution` (proposal only — not the manager UI)
- `get_team_dashboard` (period `week` \| `month` \| `quarter`)
- `get_team_activity`

Optional `salesperson_id` on existing tools; omit = self / record owner. Scope = self + `users.parent_id`. Find MCP is **not** available to Business Agent.

`get_team_territories` / `recommend_lead_distribution` are **MCP-only**. The portal uses `/manager/api/territory` and `create-leads*` instead. Manager MCP hunt is the **same circle engine** as the portal map (`LeadsTools::findManagerPortalLeads`), then `save_ai_leads` — not `create-leads*` HTTP.

Find MCP README vs User MCP: Find MCP allowed roles are Sales Agent and BSA only.
