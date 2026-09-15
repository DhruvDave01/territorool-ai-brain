---
id: 01-project-overview
parent: core
sources:
  - TerriTool/App/config/index.js
related:
  - 06-users-and-roles.md
  - 03-architecture.md
  - 07-vocabulary.md
  - 12-mobile-api.md
  - 14-mcp.md
---
# 1. Project overview

Related: [06-users-and-roles](06-users-and-roles.md) · [03-architecture](03-architecture.md) · [07-vocabulary](07-vocabulary.md)

TerriTool is a field-sales CRM: reps find businesses, save them to an Address Book, enrich decision-maker contacts (credits), group them into lists, build optimized driving routes, mark stops visited, and log activities. The same customer data is served by a React Native iOS/Android app, a Laravel 7 web app, a JWT `/api/v2` layer, and three MCP servers so Cursor/Claude/ChatGPT can drive the product as the signed-in user.

## Who it is for

| Role | `role_id` | What they do |
|------|-----------|----------------|
| Sales Agent | 1 | Individual field rep (default signup) |
| Business Agent | 3 | Manager / business client; team via `users.parent_id`; `/manager/*` + extra MCP tools |
| Business Sales Agent | 4 | Rep under a Business Agent |
| Admin | HQ | Internal staff; `/hq/*` and Admin MCP only |

Details: [06-users-and-roles.md](06-users-and-roles.md).

## Repos (do not mix them up)

| Path | What it is |
|------|-----------|
| `TerriTool/` | React Native mobile app |
| `Territool_web/webterritool/` | Laravel web + Dingo API + MCP modules + Backpack HQ |

## Live URLs

| Env | Web / API | MCP (user) |
|-----|-----------|------------|
| Production | `https://app.territool.com` | `https://app.territool.com/ai/mcp` |
| Staging | `https://staging.territool.com` | `https://staging.territool.com/ai/mcp` |
| Local web | `http://localhost:8888` (MAMP; `.env` `APP_URL`) | `{APP_URL}/ai/mcp` |

**Mobile API base** (currently **prod** in `TerriTool/App/config/index.js`): `https://app.territool.com/index.php/api/`  
Staging (commented in the same file): `https://staging.territool.com/index.php/api/`

## Auth at a glance

- Protected APIs: `Authorization: Bearer {JWT}`.
- Mobile posts **FormData**.
- Some MCP/voice clients send JSON.
- User MCP internally dispatches the same Dingo `/api/v2` endpoints.

See [12-mobile-api.md](12-mobile-api.md) and [14-mcp.md](14-mcp.md).
