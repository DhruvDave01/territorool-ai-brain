---
title: "11 — Maps and Geocoding"
---

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

## Rules

- Every create-company path must store latitude, longitude, and city.
- Respect user country on autocomplete.

## Code

Company/route/list map actions, `Helper` city/lat-lng, Admin cities CRUD.

## Related

**Modules** — [03-Company-AddressBook](../03-Company-AddressBook/MODULE.md), [05-Find-Leads](../05-Find-Leads/MODULE.md), [06-Recently-Added](../06-Recently-Added/MODULE.md), [07-Routes](../07-Routes/MODULE.md), [08-Lists](../08-Lists/MODULE.md), [10-Bulk-Upload](../10-Bulk-Upload/MODULE.md), [17-Admin-HQ](../17-Admin-HQ/MODULE.md)

**This feature** — [Use cases](use-cases.md), [Flows](flows.md)

**MCP** — [20-MCP](../20-MCP/MODULE.md), tool contract in [api-surfaces.md](../20-MCP/api-surfaces.md)

**Code** — [ROUTEMAP.md](../../knowledge/code/ROUTEMAP.md) (look for `CompanylController`, `RoutesController`, `Admin\CitiesCrudController`), [CODEMAP.md](../../knowledge/code/CODEMAP.md), [engineering/README.md](../../knowledge/code/README.md)

**Terms / roles** — [glossary.md](../../product/glossary.md), [OVERVIEW.md](../../product/OVERVIEW.md)
