---
title: "UC-MCP — Create a published route from tools (engineering trace)"
---

# UC-MCP — Create a published route from tools (engineering trace)

**Product:** `features/20-MCP/use-cases.md` + `features/20-MCP/api-surfaces.md`.  
**UI flow:** FLOW-MCP.

## User Goal

The rep (via Claude/ChatGPT/voice) wants a driveable published route and a link to open it.

## Preconditions

- OAuth as Sales Agent or BSA, `status == Active`
- Companies already in Address Book (or `add_company` during the turn)
- For `create_route`: agent should ask start company, end company, route name; if skipped, MCP picks a short tour and generates a name (namespace instructions)

## Happy Path

1. `search_companies` to resolve names → ids (not `find_ai_leads` for existing accounts).
2. `create_route` → internal `POST createroute` then **publish** + set active.
3. Return `route_url` (Published tab).
4. Optional: `get_active_route`, `next_waypoint`, `mark_visited`.

## Alternative Paths

- `create_route_from_list`
- ChatGPT 16-tool subset (may lack list tools)
- Find MCP **cannot** create routes (no route tools)

## Failure Modes

- Using `add_company` for AI search hits
- Expecting a Draft route from MCP (web-only behavior)
- Calling v2/curl instead of tools

## Expected Result

Published route owned by the user; same stops as web Published view; `route_url` works in browser.

## UI

Published route view in web app (Blade). MCP itself has no unique UI besides OAuth consent (`app/UserMcp/resources/views/oauth/`).

## API

v2 `createroute` + publish side effect in `RoutesTools`.

## Code

- `app/UserMcp/Services/Tools/RoutesTools.php`
- `app/UserMcp/Services/AppMcpProtocolService.php` handlers
- `app/UserMcp/config/territool_app.php`

## Tests

Artisan `territool-app:qa` (not PHPUnit).

## Verification

Call `create_route` on a staging/local user with ≥2 companies; open `route_url`; confirm Published, not Draft.
