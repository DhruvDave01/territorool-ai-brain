---
id: Maps-and-Active-Route
parent: design
related:
  - design/02-User-Interface/Maps.md
---
# Maps and active route

Stills: [Mobile screenshot flow](../06-Coverage/Mobile-Screenshot-Flow.md) (`ios/08-maps/` + `ios/07-routes/`).

```
BasicRouteDetail Map
  → ActiveRouteMap (`ios/07-routes/15`)
      → search waypoint
      → tap stop → Close / View details (`16`) → Waypoint Details (`ios/08-maps/02`: Mark, Mark Visited, loading contacts/activities, Call disabled)
Company Navigate → **Get directions** (`ios/04-companies/10`): Apple Maps / Google Maps / Not now
Create * Map View → LassoMap (`ios/08-maps/01` = `03-find-leads/03`): header **Lasso Selection**, Clear Lasso / Start Lasso / Next Step; draw gesture still missing
Places Find Leads (`ios/03-find-leads/08` / `ios/08-maps/03`): Map View / Selected Leads, Select Location, Search Industry, Select all / **Add Leads**
```

See [Maps.md](../02-User-Interface/Maps.md).
