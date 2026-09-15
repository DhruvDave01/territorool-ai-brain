---
id: Routes
parent: design
---
# Routes

```
Routes Library (IMG_4589)
  → row → BasicRouteDetail
  → + → CreateRoute
  → overflow … → share / edit (library)

CreateRoute (IMG_4572)
  → All / Selected / Find Leads / Map View
  → Find Leads menu: Add Company | Find Leads (Places)
  → Map View → LassoMap (no capture)
  → filter sheet
  → Next (2–400 selected) → SelectStartEndPoints (IMG_4573)
  → generate → RoutePublishingLoader
        still: Plotting / Generating your sales route (IMG_4574)
        video: Preparing Route… + “saves 12% of fuel”
  → BasicRouteDetail (IMG_4575)

Detail
  → Map → ActiveRouteMap
  → stop row / pager → CompanyView (Mark, Mark Visited)
  → share → Share Route (IMG_4611)
  → pencil → EditRoute (no still)
```

Cluster-type rows may call `ClusterList` (**broken** — not in stack).
