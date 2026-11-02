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
- Route names must be unique for the user. A taken name gets “Route name is already exist.” from `checkroutename` (web `app/Api/V2/Controllers/RouteController.php:3918-3929`). Mobile route create shows it under the name field (`route/create.js:1463-1482`); creating a route from AI Find Leads shows it as a toast (`findLeads/aiFindLeads.js:5916-5939`, `a216adf3`, on Production).

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

The user picks which published route is **active** for the day. “Next unvisited stop” and navigation use that route. Since web `65edbbd5` (on master), publishing a basic, regular cluster or smart cluster route also makes it the active route and clears `is_active` on the user's other routes (`app/Jobs/GenerateSampleRoutes.php:63-64`). The advanced job (`CreateAdvancedRoute`) does not change the active route.

Voice Mode (mobile, TT_80 only, not in the store build yet) runs the active route by voice: next stop, last stop, mark visited, open another route by name, and create a route from a list. Route detail has a mic beside back, and the map has one before filter. The Settings switch “Start when I open a route” starts voice when the rep opens the active route. What voice can and cannot do today is on [22 — Voice Mode](22-Voice-Mode.md).

## Add companies from elsewhere

Address Book, Find Leads, add-company with a route selected. Always regenerate after structural change.

## Notifications

When a route finishes generating (and related events), the user gets in-app notifications and push if a device is registered.

On TT_80, after a bulk contact buy, each stop that got contacts shows “+{n} New Contact” on route detail and list detail until the rep opens that stop (`route/basic/index.js:1109`, `list/basic/index.js:681`, `7e8984dd`). Storage and the device notification are on [15 — Support and Notifications](15-Support-Notifications.md).

While the existing first-route onboarding session is active, an owner viewing their first published **Basic** Route receives the mobile-app download popup. It has no credit impact.

## CSV route upload (older path)

Upload a file of stops → map columns → fix city/address errors → choose basic or advanced → generate. Unfinished sessions show under Route Session until discarded. Sample CSV is available.

## Lasso / map find leads

Draw an area, pick or discover companies, create them as stops, fetch contacts (FullEnrich **2** credits / Claude **1** credit). Then regenerate.

## Rules

- Minimum two companies to create.
- Never edit while processing.
- Adding/removing stops must regenerate.
- Creating a route from MCP / voice **publishes** it (not a silent draft). See api-surfaces.md.

## Code

`RouteController` (current wizard/view), `RoutesController` (CSV + map find), `SimpleRouteController`, `AdvancedRouteController`, jobs `GenerateSampleRoutes`, `CreateAdvancedRoute`, `GenerateAdvancedRoutePDF`, models `UserRoute`, `UserCompanies`, `UserRouteClusters`, `ShareRouteList`.

## Related

**Modules** — 03-Company-AddressBook, 04-Contacts, 05-Find-Leads, 08-Lists, 09-Contact-Enrichment-Credits, 11-Maps, 15-Support-Notifications, 19-Cron-Jobs-Webhooks, 18-Clients

**This feature** — Use cases, Flows, Evidence, Limits, Known issues

**MCP** — 20-MCP, tool contract in api-surfaces.md

**Code** — ROUTEMAP.md (look for `RouteController`, `RoutesController`, `SimpleRouteController`, `AdvancedRouteController`), CODEMAP.md, engineering/README.md

**Terms / roles** — glossary.md, OVERVIEW.md

## Screens

Per surface. "File" is under `TerriTool/App/components/` for mobile; the full map is [mobile screens](../code/mobile-screens.md). Strings are copied from code on 2026-09-22, and the mobile strings were checked again against TT_80 on 2026-11-02 ([live code 2026-11-02](../reviews/live-code-2026-11-02.md)); a loading cell that reads `screen.x.loading` is the `testID` on that screen's `ActivityIndicator`. Copy these strings; do not write new ones.

| Surface | Screen | File / still | Primary action | Loading | Empty | Error |
|---|---|---|---|---|---|---|
| Mobile | `Routes` (library) | `route/index.js` · [RouteFlow](<../screenshots/mobile-owner/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.02.12.png>) | Open a route; create | `screen.routes.loading` | "No Routes Found"; onboarding: "Build my first route" | "Oops! Something went wrong. Please check your internet connection or try again." (toast) |
| Mobile | `CreateRoute` → `SelectStartEndPoints` → `PublishRoute` | `route/create.js`, `route/create/select-start-end-points.js`, `route/create/publish-route.js` | Publish | `screen.routesCreate.loading`, `screen.routesSelectPoints.loading`, `screen.routesPublish.loading`, "Please wait... We are processing your Request." | "Filtered Companies not found." | "Creating Route Failed!!"; "Generating Route Failed!!"; "Oops! Something went wrong. Please try again." |
| Mobile | `EditRoute` → `EditSelectStartEndPoints` → `EditPublishRoute` | `route/edit.js`, `route/edit/edit-select-start-end-points.js`, `route/edit/edit-publish-route.js` | Re-publish | `screen.routesEditPublish.loading` | "Filtered Companies not found." | "Creating Route Failed!!" |
| Mobile | `BasicRouteDetail` / `CompanyView` | `route/basic/index.js`, `route/basic/company-view.js` · [with voice mic and mini-bar](../screenshots/mobile-owner/VoiceMode/15-auto-start.jpg) | Start route, mark visited; the mic opens Voice Mode (TT_80 only) | `screen.routesDetail.loading`, "Loading companies" | "Not visited yet"; "Not found" | "Oops! Something went wrong. Please check your internet connection or try again." (toast); "Unable to submit report. Please try again." |
| Mobile | `ActiveRouteMap` / `WaypointDetail` | `activeroutemap/index.js`, `activeroutemap/waypointdetail.js` | Navigate to next stop | `screen.mapActive.loading`, `screen.mapActive.polylineLoading` | "No Data found related to your filters." | "Check that location services are enabled and try again." |
| Mobile | `FilterModule` | `filterModule/index.js` | Apply | `screen.filterModule.loading` | "No matching results found..." | "Oops! Something went wrong." |
| Classic web | `/route` | [web_09_routes](../screenshots/web/sales-agent/web_09_routes_w1440.png), [classic routes](../screenshots/web-stills/06-classic-routes-list.png), [wizard step 1](../screenshots/web-stills/07-classic-route-wizard-step1.png) | DataTables row actions; wizard | `#cover-spin` | DataTables "No data available in table" | Flash message |
| Manager | `/manager/salespeople/{id}/routes` | [Route list](../screenshots/web-owner/Manager/Route-List-TerriTool-09-15-2026_01_28_PM.png) | Open a rep's route | "Loading…" | Empty table row | "Failed to load activity." (activity); toast elsewhere |

A route is done only when `simplerouteview` returns `route_status === "published"`. The failure cards above are the real stills, not placeholders.

## Screenshots in this brain

Open the image before drawing UI. The filename is a capture time, not a layout spec. Pixels win.

- [IMG_4572.PNG](<../screenshots/feature-evidence/07-Routes/evidence/IMG_4572.PNG>)
- [IMG_4573.PNG](<../screenshots/feature-evidence/07-Routes/evidence/IMG_4573.PNG>)
- [IMG_4574.PNG](<../screenshots/feature-evidence/07-Routes/evidence/IMG_4574.PNG>)
- [IMG_4575.PNG](<../screenshots/feature-evidence/07-Routes/evidence/IMG_4575.PNG>)
- [IMG_4576.PNG](<../screenshots/feature-evidence/07-Routes/evidence/IMG_4576.PNG>)
- [IMG_4577.PNG](<../screenshots/feature-evidence/07-Routes/evidence/IMG_4577.PNG>)
- [IMG_4578.PNG](<../screenshots/feature-evidence/07-Routes/evidence/IMG_4578.PNG>)
- [IMG_4579.PNG](<../screenshots/feature-evidence/07-Routes/evidence/IMG_4579.PNG>)
- [IMG_4580.PNG](<../screenshots/feature-evidence/07-Routes/evidence/IMG_4580.PNG>)
- [IMG_4589.PNG](<../screenshots/feature-evidence/07-Routes/evidence/IMG_4589.PNG>)
- [IMG_4590.PNG](<../screenshots/feature-evidence/07-Routes/evidence/IMG_4590.PNG>)
- [IMG_4609.PNG](<../screenshots/feature-evidence/07-Routes/evidence/IMG_4609.PNG>)
- 78 more stills are in `../screenshots/feature-evidence/07-Routes/`.

## Watched 2026-09-23

Classic web wizard: `/route/step1` names the route and selects companies. `/route/step2/{id}` picks start and end, then Save as Draft or Generate Route. The published table shows company quantity, distance, and time. Detail: [oversized-video watch](../reviews/oversized-video-watch-2026-09-23.md).

## Generate from this brain

- UI rule: [UI/UX Guardian](../brains/ui-ux-guardian.md)
- Screenshot method: [screenshot review](../screenshots/REVIEW.md)
- Mobile implementation: [mobile code review](../code/mobile-review.md)
- Web implementation: [web code review](../code/web-review.md)
- Role: [User](../roles/user.md) · [Manager](../roles/manager.md) · [Admin](../roles/admin.md)
