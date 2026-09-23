---
title: "UC-RTE — Create and publish a route (engineering trace)"
---

# UC-RTE — Create and publish a route (engineering trace)

**Product IDs:** UC-RTE-*. Prose: `features/07-Routes/use-cases.md`.  
**UI flow:** FLOW-ROUTE.

## User Goal

The sales rep wants an optimized driving order for a set of companies so they can navigate stop-to-stop.

## Preconditions

- ≥2 companies (typical generate minimum — confirm in limits.md if changing)
- Authenticated subscriber
- Companies already in Address Book (or added during wizard)

## Happy Path (web)

1. Open Routes → create / wizard (`simpleroute` / `advancedroute` / CSV / lasso).
2. Generate → status processing → published (or remain draft if user saves draft on web).
3. View map, mark visited, next stop, share/export.

## Alternative Paths

- Create from a List (`generateroute` / MCP `create_route_from_list`)
- MCP `create_route`: **always publishes**, returns `route_url`, shows on Published tab — not Draft
- `add_company` with `route_id` re-optimizes and publishes
- Failed / `publish_pending` / `continue_edit` statuses exist in DB beyond the three bible states

## Failure Modes

See `../features/07-Routes/known-issues.md` and `../features/07-Routes/limits.md`. Optimization timeouts and <2 stops are typical.

## Expected Result

- `user_routes` row + `user_route_companies` ordered stops
- Web draft stays draft until publish
- MCP result is published + active as documented in api-surfaces.md

## UI

`/routes`, route wizard Blades (`front.simpleroute.*`, `front.advancedroute.*`), route view map.

## API

v2: `createroute`, `routelist`, `addcompanyvisittime`, etc. (names in api-surfaces.md).

## Code

- `RouteController`, `RoutesController`, `SimpleRouteController`, `AdvancedRouteController`
- `app/UserMcp/Services/Tools/RoutesTools.php` — `createRoute`, `createRouteFromList`, `markVisited`, `nextWaypoint`

## Tests

None found.

## Verification

Web: create route with 2+ companies → appears under expected tab (Draft vs Published).  
MCP: `create_route` → `route_url` opens Published view; `get_active_route` returns it.
