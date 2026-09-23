---
title: "Maps — use cases"
---

# Maps — use cases

Part of [11-Maps](MODULE.md). Written 2026-09-16 from MODULE.md + `ROUTEMAP.md` (`company/viewmap`, `list/viewmap/{id}`, `route/viewmap/{id}`). **No UC IDs existed before.** Not a live Playwright walk this session (browser MCP locked; web login blocked locally).

Map screens share `front.company.viewmap`. Pins use company status color.

### UC-MAP-01 View Address Book on map

From Address Book / Recently Added → View on Map (`company/viewmap`, `viewmapallcompany`, `viewmapWithRecentCompany`). Pins for saved companies. Empty: map with no pins.

### UC-MAP-02 View one list or route on map

List → View on Map (`list/viewmap/{id}`). Published route → map (`route/viewmap/{id}`). Route pins follow visit order + path. Evidence: existing route map captures in [07-Routes](../07-Routes/evidence.md) (11:06:34).

### UC-MAP-03 Lasso / filter on map while building

Create-route or create-list map: lasso an area, filter open/closed hours, optional Find Leads. Evidence: [07-Routes](../07-Routes/evidence.md) 11:03:25; [08-Lists](../08-Lists/evidence.md) 11:04:55.

### UC-MAP-04 Geocode on add / edit company

Places autocomplete respects user country. Save must store lat, lng, city. Failed CSV geocode → module 10 error session.

### UC-MAP-05 Open in Google Maps / Navigate Me

Address opens in Google Maps. **Navigate Me** on a stop is logged; managers see it in KPIs. Mobile deep-link scheme: **UNKNOWN — needs verification**.
