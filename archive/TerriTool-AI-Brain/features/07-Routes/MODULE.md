---
title: "07 — Routes"
---

# 07 — Routes

## Purpose

An optimized driving sequence of companies (stops). Create, process, publish, run in the field, share, export, and regenerate when stops change.

There is a current create-wizard and an older CSV-upload path. Both still work. New work should follow the current wizard unless you are fixing the CSV path.

## Who

Sales Agent, Business Sales Agent. Managers can view a team member’s routes.

## Route list

- Published vs draft counts
- Unfinished drafts to resume
- Unread published routes
- View, resume edit, delete, regenerate, map, CSV
- Route names must be unique for the user

## Create a route

1. **Name + companies** — at least **two** companies. Map picker with the same filters as Address Book. Save as draft or continue.
2. **Start and end** companies (defaults: geographic north/south). Save draft or continue.
3. **Type**
   - **Basic** — simple optimized order (default when ≤ 150 stops)
   - **Regular / smart cluster** — clusters; smart cluster auto if > 150 stops
   - **Advanced** — heavier optimizer
4. Status becomes **processing**. Edits are blocked. Jobs: basic/cluster vs advanced.
5. When done: **published**. First published route can show a short onboarding.

## Route statuses

| Status | Meaning |
|--------|---------|
| draft / continue_edit | Not finished |
| processing | Optimizer running; do not edit |
| published | Ready for the field; can be the **active** route |

Start/end live in route metadata JSON.

## Using a published route

- Ordered stops with status colors
- Map + directions
- Open any stop as a full company (contacts, notes, find contacts, hours)
- **Mark visited / unvisited** (and visit time)
- Bookmark a stop
- Change company status
- Add or remove stops → must **regenerate** (stale order/distance is not allowed)
- Select-all companies on the route
- Navigate to a stop (counts as Navigate Me for manager KPIs)
- Share by email
- Download CSV / PDF
- Keep an **offline** copy of the active route for field use
- Compressed payload of the active route for the field client

## Active route

The user picks which published route is **active** for the day. “Next unvisited stop” and navigation use that route.

## Add companies from elsewhere

Address Book, Find Leads, add-company with a route selected. Always regenerate after structural change.

## Notifications

When a route finishes generating (and related events), the user gets in-app notifications and push if a device is registered.

While the existing first-route onboarding session is active, an owner viewing their first published **Basic** Route receives the mobile-app download popup. It has no credit impact.

## CSV route upload (older path)

Upload a file of stops → map columns → fix city/address errors → choose basic or advanced → generate. Unfinished sessions show under Route Session until discarded. Sample CSV is available.

## Lasso / map find leads

Draw an area, pick or discover companies, create them as stops, fetch contacts (FullEnrich **2** credits / Claude **1** credit). Then regenerate.

## Rules

- Minimum two companies to create.
- Never edit while processing.
- Adding/removing stops must regenerate.
- Creating a route from MCP / voice **publishes** it (not a silent draft). See [api-surfaces.md](../20-MCP/api-surfaces.md).

## Code

`RouteController` (current wizard/view), `RoutesController` (CSV + map find), `SimpleRouteController`, `AdvancedRouteController`, jobs `GenerateSampleRoutes`, `CreateAdvancedRoute`, `GenerateAdvancedRoutePDF`, models `UserRoute`, `UserCompanies`, `UserRouteClusters`, `ShareRouteList`.

## Related

**Modules** — [03-Company-AddressBook](../03-Company-AddressBook/MODULE.md), [04-Contacts](../04-Contacts/MODULE.md), [05-Find-Leads](../05-Find-Leads/MODULE.md), [08-Lists](../08-Lists/MODULE.md), [09-Contact-Enrichment-Credits](../09-Contact-Enrichment-Credits/MODULE.md), [11-Maps](../11-Maps/MODULE.md), [15-Support-Notifications](../15-Support-Notifications/MODULE.md), [19-Cron-Jobs-Webhooks](../19-Cron-Jobs-Webhooks/MODULE.md), [18-Clients](../18-Clients/MODULE.md)

**This feature** — [Use cases](use-cases.md), [Flows](flows.md), [Evidence](evidence.md), [Limits](limits.md), [Known issues](known-issues.md)

**MCP** — [20-MCP](../20-MCP/MODULE.md), tool contract in [api-surfaces.md](../20-MCP/api-surfaces.md)

**Code** — [ROUTEMAP.md](../../knowledge/code/ROUTEMAP.md) (look for `RouteController`, `RoutesController`, `SimpleRouteController`, `AdvancedRouteController`), [CODEMAP.md](../../knowledge/code/CODEMAP.md), [engineering/README.md](../../knowledge/code/README.md)

**Terms / roles** — [glossary.md](../../product/glossary.md), [OVERVIEW.md](../../product/OVERVIEW.md)
