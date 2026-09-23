---
id: 06-users-and-roles
parent: core
related:
  - 01-project-overview.md
  - 14-mcp.md
  - features/12-manager-portal.md
  - features/13-admin-hq.md
  - 09-credits-billing.md
  - screens/web-how-it-works.md
---
# 6. Users and roles

Related: [01-project-overview](01-project-overview.md) · [14-mcp](14-mcp.md) · [features/12-manager-portal.md](features/12-manager-portal.md) · [features/13-admin-hq.md](features/13-admin-hq.md) · [web flows](screens/web-how-it-works.md)

| Role | `role_id` | Web | Mobile | User MCP | Admin MCP | Find MCP |
|------|---------|-----|--------|----------|-----------|----------|
| Sales Agent | 1 | App | App | Field catalog | No | Yes |
| Business Sales Agent | 4 | App (`parent_id`) | App | Field catalog | No | Yes |
| Business Agent | 3 | App + `/manager/*` | App | Field + `list_team`, `get_team_territories`, `recommend_lead_distribution`, `get_team_dashboard`, `get_team_activity`; optional `salesperson_id` | No | **No** |
| Admin | HQ | `/hq/*` only | N/A | No | Yes, read-only | No |

## Gates

- User MCP `require_active_status` matches mobile login (`users.status == Active`).
- Signup: `RegisterController` assigns `Sales Agent`. Web register is 3 steps; then `/onboarding` or `/findleads`.
- BSA: invite + `/businesssalesperson/activate/{userid}` — not web register.
- Login landings: BA → `/manager/dashboard`; SA/BSA → `/dashboard`; Admin → `/hq/dashboard`.
- Web also has B2B / trial / onboarding / `registertool/{name}/{email}/{phone}`.
- Special mobile login: `apple@yopmail.com` sets `is_production` true on the JWT Realm row.

## Team model

- `User.parent_id` → Business Agent.
- Eloquent: `parent()` / `children()`.
- MCP `McpUserScope`: manager may only touch self + assigned reps. Never other users.
- BSA credits: often on manager / `businessclient_salesagent_credits`, not only `user_credits`. See [09-credits-billing.md](09-credits-billing.md).
