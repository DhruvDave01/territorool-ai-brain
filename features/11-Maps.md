# 11 — Maps and Geocoding

## Purpose

Show companies, lists, and routes on a map; turn addresses into coordinates and cities; navigate to a stop.

## Who

Field users. Admin maintains the city catalog.

## What can be mapped

- Selected companies
- Entire Address Book
- Recently added companies
- One list
- One route (pins in visit order + path)
- Find Leads results
- Lasso an area to pick or discover stops

Pins use the company’s **status color**. Opening hours can filter open vs closed.

## Geocoding

- Places autocomplete on add-company and profile address (respects the user’s country)
- Address → lat/lng/city
- Reverse: lat/lng → address
- Cities in MySQL; users have assigned territory cities
- Failed geocode during CSV → error session (module 10)

## Navigation

- Open an address in Google Maps
- Directions on a published route
- **Navigate Me** on a stop (logged; managers see it in KPIs)
- Voice Mode (mobile, staging and dev builds): `ActiveRouteMap` has a mic before the filter button. While a session runs, the voice mini-bar sits below the map, not over it, because the map has no footer. See [22 — Voice Mode](22-Voice-Mode.md).

## Rules

- Every create-company path must store latitude, longitude, and city.
- Respect user country on autocomplete.

## Code

Company/route/list map actions, `Helper` city/lat-lng, Admin cities CRUD.

## Related

**Modules** — 03-Company-AddressBook, 05-Find-Leads, 06-Recently-Added, 07-Routes, 08-Lists, 10-Bulk-Upload, 17-Admin-HQ

**This feature** — Use cases, Flows

**MCP** — 20-MCP, tool contract in api-surfaces.md

**Code** — ROUTEMAP.md (look for `CompanylController`, `RoutesController`, `Admin\CitiesCrudController`), CODEMAP.md, engineering/README.md

**Terms / roles** — glossary.md, OVERVIEW.md

## Screens

Per surface. "File" is under `TerriTool/App/components/` for mobile; the full map is [mobile screens](../code/mobile-screens.md). Strings are copied from code on 2026-09-22; a loading cell that reads `screen.x.loading` is the `testID` on that screen's `ActivityIndicator`. Copy these strings; do not write new ones.

| Surface | Screen | File / still | Primary action | Loading | Empty | Error |
|---|---|---|---|---|---|---|
| Mobile | `ActiveRouteMap` | `activeroutemap/index.js` · [RouteFlow](<../screenshots/mobile-owner/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.02.12.png>) · [voice mini-bar render](voice-mode-mobile-map-minibar.png) | Next stop, navigate; the mic opens Voice Mode (staging and dev builds) | `screen.mapActive.loading`, polyline `screen.mapActive.polylineLoading` | "No Data found related to your filters." | "Check that location services are enabled and try again." |
| Mobile | `LassoMap` | `route/lassoMap.js` | Draw a lasso | `screen.mapLasso.loading` … `loadingC` | — | "Oops! Something went wrong. Please check your internet connection or try again." (toast) |
| Mobile | Address Book map | `company/list.js` map mode (`companylistmap`) | Tap a pin | `screen.companyList.loadingB` | "No companies match your filters." | "Oops! Something went wrong. Please check your internet connection or try again." (toast) |
| Manager | Territory map on `/manager/dashboard` and circles on `/manager/ai-find-leads` | [circles](../screenshots/web-stills/03-manager-ai-circles.png) | Draw circles | "Loading territory…", "Loading map…" | — | "Could not load map." |

Map circle colors in `AIFindLeads.jsx` are a fixed six-color list. Do not recolor mobile map markers to one teal.

## Generate from this brain

- UI rule: [UI/UX Guardian](../brains/ui-ux-guardian.md)
- Screenshot method: [screenshot review](../screenshots/REVIEW.md)
- Mobile implementation: [mobile code review](../code/mobile-review.md)
- Web implementation: [web code review](../code/web-review.md)
- Role: [User](../roles/user.md) · [Manager](../roles/manager.md) · [Admin](../roles/admin.md)
