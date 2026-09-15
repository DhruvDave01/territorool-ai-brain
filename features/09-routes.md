---
id: 09-routes
parent: features
sources:
  - route/index.js
  - route/create.js
  - route/edit.js
  - basic/index.js
  - basic/company-view.js
  - basic/goswipe.js
  - activeroutemap/index.js
  - activeroutemap/waypointdetail.js
related:
  - features/08-lists.md
  - features/03-companies.md
  - 15-voice-policy.md
  - appendix-c-footer-tabs.md
  - screens/navigation-map.md
  - ops/known-bugs.md
---
# Feature: Routes and driving

Related: [08-lists](08-lists.md) · [03-companies](03-companies.md) · [15-voice-policy](../15-voice-policy.md) · [appendix-c-footer-tabs](../appendix-c-footer-tabs.md)

## What it does

Optimized driving runs of saved companies. Types: `basic` (MCP default), `regularcluster`, `smartcluster`. Workflow: `draft` / `processing` / `failed` / `published`. One route may be **active** (`is_active`).

Needs at least two stops for a useful run.

## Mobile screens

| Screen / file | Purpose |
|---------------|---------|
| `route/index.js` `RouteList` | Library; offline read via `getOFFLINERoute`; share email |
| `route/create.js` | Select companies, name |
| `route/edit.js` | Edit; `smartcluster` branch |
| `select-start-end-points.js` | Start/end; `routetypestate` (`basic` / `smartcluster`) |
| `publish-route.js` | `createroute` → poll `simplerouteview` until `published` |
| `basic/index.js` `BasicRouteDetail` | Waypoints, filters, share, active |
| `basic/company-view.js` | Hosts `CustomCompany` on route |
| `basic/goswipe.js` | `RouteSwipe` |
| `lassoMap.js` | Territory lasso |
| `activeroutemap/index.js` | Driving map + Mapbox polylines |
| `activeroutemap/waypointdetail.js` | Stop detail |

**No in-app PDF** on mobile (email share only). Web has TCPDF/dompdf.

`createOFFLINERoute` has **no call sites**; list still **reads** the Realm blob.

`route/index.js` and `utils/navigateToRouteDetail.js` call `navigate("ClusterList")` for cluster types, but **`ClusterList` is not a `Stack.Screen`**. Do not add a nested navigator unless a human asks. [known-bugs](../ops/known-bugs.md) · [navigation-map](../screens/navigation-map.md).

## APIs

Create/update: `createroute`, `updateroute`, `publishroute`, `routeremove`, `checkroutename`, `routeonboardingconversion`.  
Views: `routelist`, `simplerouteview`, `advancerouteview`.  
Active: `updaterouteactive`, `getuseractiveroute`, `getuseractiveroutev1`, `getactiveroutecompany`.  
Optimize: `routeRegenerate`, `reroute`.  
Share: `shareRouteList`, `getShareRouteListEmails`.  
QR: `scan-qr-code`.

## MCP

Before `create_route`, ask start company, end company, and route name. If skipped: omit start/end (MCP picks a short tour) and generate a name.

`create_route` **publishes** (Published tab, not Draft) and returns `route_url` — give that link to the user. Type **basic**. Optional GPS start. Cap 100 companies.

`add_company` with `route_id` re-optimizes and publishes that route, then returns `route_url`.

Drive: `get_active_route`, `next_waypoint`, `mark_visited`. Named route → `view_route` (name or `route_id`).
