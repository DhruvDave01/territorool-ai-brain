---
id: Routes
parent: design
---
# Routes

Stills: [Mobile screenshot flow](../06-Coverage/Mobile-Screenshot-Flow.md) (`ios/07-routes/`).

```
Routes Library (`ios/07-routes/01` Published · `02` Draft)
  → Published | Draft tabs (Draft still: “0 remaining drafts”)
  → row → BasicRouteDetail (`13`)
  → + → CreateRoute (`06`)
  → overflow sheet (`03`): route name, View On Map, Edit Route, Re-Route, Delete, Share Route
  → share (`04`)

CreateRoute / EditRoute (`06` / `08`)
  → header is the **route name** on edit; chips All / Selected / Find Leads (teal) / Map View (gold) / Select All / Next Step
  → Find Leads menu: Add Company | Find Leads (Places)
  → Map View → LassoMap (`ios/08-maps/01`, `ios/07-routes/07`)
  → Next → SelectStartEndPoints (`09`) / Edit Start/End Points (`10`, CTA **Create Route**)
  → generate → RoutePublishingLoader
        success: Plotting / Generating your sales route (IMG_4574 / VID1)
        this pack: **Generating Route Failed!!** (`11`) / **Creating Route Failed!!** (`12`) — Go Back & Try Again / Go to Dashboard

Detail (`13`)
  → Map → ActiveRouteMap (`15`)
  → tap stop → waypoint sheet Close / View details (`16`) → Waypoint Details (`ios/08-maps/02`: Mark + Mark Visited)
  → share → Share Route
  → pencil → EditRoute (`08`)
  → Find Contacts on a published route: “Nothing is charged until you confirm.”

First-route coaching (`17`): bottom sheet **Nice — that’s your day mapped out.** CTAs **Book a Coaching Session** / **Email me the quick-start guide**. Live, not deferred.

`14-route-swipe.png` is a **stub** (“Swipe back from left edge”) — not shipping chrome. `05-routes-filter.png` is **legacy FilterRoute** — do not copy; live filter is FilterModule.
```

Cluster-type rows may call `ClusterList` (**broken** — not in stack).
