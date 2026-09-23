# 08 — Lists

## Purpose

A **List** is a named group of companies. It is not a driving order. Use it for territories, campaigns, or “today’s accounts”, then optionally **generate a route** from it.

## Who

Sales Agent, Business Sales Agent.

## Functionality

### Create

- List name (required)
- At least **one** company
- Map + picker (same location/status idea as routes)
- Logged as “Created List”

### Index

- Title (unread if never opened)
- Company count
- Totals: lists, unread lists, companies-on-lists
- View, edit, delete

### View

- Member companies (full company actions)
- Add more companies, or remove one / many
- Map
- Download CSV
- Generate route (copies members into a new route, then the same optimizer/publish path)

### Add to list from elsewhere

Address Book, Find Leads, company save: pick an existing list or create a new one.

Deleting a list does **not** delete the companies.

## Rules

- Do not store driving order on list membership.
- Generate-route must use the same optimize/publish path as a normal route.

## Code

`ListController`, `UserList`, `UserListCompanies`, `UserListRoute`.

## Related

**Modules** — 03-Company-AddressBook, 05-Find-Leads, 07-Routes, 11-Maps

**This feature** — Use cases, Flows, Evidence

**MCP** — 20-MCP, tool contract in api-surfaces.md

**Code** — ROUTEMAP.md (look for `ListController`), CODEMAP.md, engineering/README.md

**Terms / roles** — glossary.md, OVERVIEW.md

## Screens

Per surface. "File" is under `TerriTool/App/components/` for mobile; the full map is [mobile screens](../code/mobile-screens.md). Strings are copied from code on 2026-09-22; a loading cell that reads `screen.x.loading` is the `testID` on that screen's `ActivityIndicator`. Copy these strings; do not write new ones.

| Surface | Screen | File / still | Primary action | Loading | Empty | Error |
|---|---|---|---|---|---|---|
| Mobile | `Lists` (library) | `list/index.js` · [List](<../screenshots/mobile-owner/List/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.08.32.png>) | Open a list; create | `screen.lists.loading` | "No lists yet. Create one to get started."; search: "No lists found." | "Oops! Something went wrong. Please check your internet connection or try again." (toast); "Oops! Something went wrong, Please try after sometimes." |
| Mobile | `CreateLists` / `EditLists` | `list/create.js`, `list/edit.js` | Save | "Please wait" | — | "Oops! Something went wrong. Please check your internet connection or try again." (toast) |
| Mobile | `ListsDetail` | `list/basic/index.js` | Create route from list; open company | `screen.listsDetail.loading`, "Loading companies...", "Fetching all companies from server..." | "Filtered Companies not found."; "Not visited yet" | "Oops! Could not create route, Please try again." |
| Mobile | `SelectStartEndPointsList` | `list/create/select-start-end-points.js` | Confirm start and end | `screen.listsSelectPoints.loading` | — | "Oops! Something went wrong. Please check your internet connection or try again." (toast) |
| Classic web | `/list` | [web_10_lists](../screenshots/web/sales-agent/web_10_lists_w1440.png) | DataTables row actions | `#cover-spin` | DataTables "No data available in table" | Flash message |

`FilterList` (`list/filter.js`) is the legacy teal filter. Copy `FilterModule` instead.

## Screenshots in this brain

Open the image before drawing UI. The filename is a capture time, not a layout spec. Pixels win.

- [IMG_4591.PNG](<../screenshots/feature-evidence/08-Lists/evidence/IMG_4591.PNG>)
- [IMG_4592.PNG](<../screenshots/feature-evidence/08-Lists/evidence/IMG_4592.PNG>)
- [IMG_4593.PNG](<../screenshots/feature-evidence/08-Lists/evidence/IMG_4593.PNG>)
- [IMG_4594.PNG](<../screenshots/feature-evidence/08-Lists/evidence/IMG_4594.PNG>)
- [Screenshot 2026-09-15 at 11.04.35 AM.png](<../screenshots/feature-evidence/08-Lists/evidence/Screenshot 2026-09-15 at 11.04.35 AM.png>)
- [Screenshot 2026-09-15 at 11.04.55 AM.png](<../screenshots/feature-evidence/08-Lists/evidence/Screenshot 2026-09-15 at 11.04.55 AM.png>)
- [Screenshot 2026-09-15 at 11.05.13 AM.png](<../screenshots/feature-evidence/08-Lists/evidence/Screenshot 2026-09-15 at 11.05.13 AM.png>)
- [Screenshot 2026-09-15 at 11.05.33 AM.png](<../screenshots/feature-evidence/08-Lists/evidence/Screenshot 2026-09-15 at 11.05.33 AM.png>)
- [Screenshot 2026-09-15 at 11.05.52 AM.png](<../screenshots/feature-evidence/08-Lists/evidence/Screenshot 2026-09-15 at 11.05.52 AM.png>)
- [Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.08.32.png](<../screenshots/feature-evidence/08-Lists/evidence/mobile/List/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.08.32.png>)
- [Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.08.36.png](<../screenshots/feature-evidence/08-Lists/evidence/mobile/List/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.08.36.png>)
- [Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.08.42.png](<../screenshots/feature-evidence/08-Lists/evidence/mobile/List/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.08.42.png>)
- 40 more stills are in `../screenshots/feature-evidence/08-Lists/`.

## Generate from this brain

- UI rule: [UI/UX Guardian](../brains/ui-ux-guardian.md)
- Screenshot method: [screenshot review](../screenshots/REVIEW.md)
- Mobile implementation: [mobile code review](../code/mobile-review.md)
- Web implementation: [web code review](../code/web-review.md)
- Role: [User](../roles/user.md) · [Manager](../roles/manager.md) · [Admin](../roles/admin.md)
