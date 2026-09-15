---
id: 18-cross-system-flows
parent: core
related:
  - 03-architecture.md
  - 14-mcp.md
  - features/07-ai-find-leads.md
---
# 18. Cross-system flows

Related: [03-architecture](03-architecture.md) · [14-mcp](14-mcp.md) · [features/07-ai-find-leads.md](features/07-ai-find-leads.md)

## Login

1. Mobile `POST login` → JWT in Realm id `"1"` → RevenueCat identify → free-trial? `SubscriptionGate` : `Dashboard`.
2. Web `Auth::routes()`.
3. MCP OAuth → same login page → consent → token bound to `user_id`.

401/403 on mobile: session expired modal, JWT deleted.

## Plan a day (mobile, web, MCP)

1. Territory + who I sell to.
2. `find_ai_leads` / `getAILeadsV2` (free).
3. Resume until complete.
4. Credits check → save N leads (`save_ai_leads` / `saveAILeads`).
5. Optional find/buy contacts.
6. `create_route` or list → route (MCP publishes + `route_url`).
7. `next_waypoint` / `ActiveRouteMap`.
8. Visit → `mark_visited` + `add_activity`.

If companies are already saved in that city: skip find/save → `search_companies` → route.

## Enrichment waterfall

Discovery (`fetchAllContacts` / `find_contacts`) is free and may return mixed providers. Buying charges **2** (paid) or **1** (Claude/biz). `reportcontact` can refund.

## HubSpot

Last sync timestamp → companies and/or contacts → error list → fix or delete session errors. Mobile and web share API names. Mobile exclusivity: `hubspotSyncFlight.js`.
