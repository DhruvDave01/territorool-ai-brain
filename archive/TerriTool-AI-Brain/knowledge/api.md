---
title: "API surfaces"
---

# API surfaces

Four ways to hit the same product. Prefer the surface the user is on; do not invent a fifth.

| Surface | Auth | Entry | Who |
|---------|------|-------|-----|
| Browser | Session cookie | `routes/web.php` | All roles |
| Mobile / internal | JWT | Dingo **v2** `routes/api.php` | SA, BSA |
| Customer MCP | OAuth `territool:app` | `{APP_URL}/ai/mcp` | SA/BSA Active |
| Find MCP | OAuth | `{APP_URL}/find-mcp/mcp` | Lead/contact subset |
| Admin MCP | Separate | `{APP_URL}/ai/mcp-admin` or `php artisan mcp:stdio` | Staff, read-ish HQ |
| Manager JSON | Session + manager role | `/manager/api/*` | Business Agent |

V1 routes are commented. Ignore them.

## v2 names agents actually need

Prefix is Dingo `/api/v2/` (confirm in ROUTEMAP if unsure).

| Job | v2 |
|-----|-----|
| Login / renew | `login`, `renewtoken` |
| Add company | `POST addcompany` |
| Save AI leads | `POST saveAILeads` |
| Start/resume AI search | `POST getAILeadsV2`, `resumeAILeadSearch` |
| Buy contacts | `POST buyContacts` |
| Create route | `POST createroute` |
| Mark visited | `POST addcompanyvisittime` |
| Activity | `POST addcompanyactivity` |
| Credits | `getusercredit` |
| Webhooks | FullEnrich, RevenueCat (unauthenticated group) |

JSON convention: `status: 1` success. Some legacy endpoints return `status: 0` with a success message — MCP normalizes this.

## MCP vs v2

Customer MCP tools dispatch v2 via `CustomerApiClient` **or** write directly then publish. Product result must match the app.

| Intent | Tool | Never |
|--------|------|-------|
| New businesses | `find_ai_leads` | `search_companies`, `add_company` |
| Saved accounts | `search_companies` | `find_ai_leads` |
| Save search hits | `save_ai_leads` (preview, then confirm) | `add_company` |
| Driving tour | `create_route` (publishes) | Assume Draft |

Full MCP catalog: [../features/20-MCP/api-surfaces.md](../features/20-MCP/api-surfaces.md).  
Every registered route: [code/ROUTEMAP.md](code/ROUTEMAP.md).

When implementing: if the rule is shared, put it where v2 already runs.
