# 05 — Find Leads (AI + Yelp)

## Purpose

Discover **new** businesses in a territory that are not already in the user’s Address Book. **Search is free. Saving costs 1 credit per company.** Managers have a separate “search then assign to a rep” path (module 16).

## Who

Sales Agent, Business Sales Agent. Sales Agents with no plan at all must subscribe first.

## AI Find Leads

### What the user enters

- Territory: **city** or **ZIP** (ZIP max 8 characters)
- What to find and what to exclude (sell description)
- Optional seed website to model the search

### Pipeline (one search at a time per user)

Starting a new search replaces the previous one. The user can leave and **resume**.

**Stage 1 — strategy (Gemini)**  
Produces search terms, hard filters (rating, price, business status), map center / bias (Places circle max 50 km), and whether qualitative refinement is needed.

**Stage 2 — Google Places**  
Text search per term, multiple pages, dedupe by place id, apply hard filters, drop businesses already in this user’s Address Book. Partial results show as they arrive (table, cards, map): name, address, phone, website, rating, reviews, hours, types, Maps link.

**Stage 3 — refine (optional)**  
Only if the strategy needs it (reviews, “exclude residential”, specialties). Batches of places are scored/filtered by Gemini.

**Complete**  
Results stored so they can be previewed later and saved.

### What the user can do with results

- Watch progress
- Filter / sort
- Select leads
- **Save** → Address Book, **1 credit each**; already-owned businesses are skipped
- Create a **route** from the selection
- Add to an **existing route**
- Add to a **list**
- **Find contacts** (website required)
- Last query is remembered for the next visit

Insufficient credits → Sales Agent: upgrade / add-on (or RevenueCat manage-plan). Business Sales Agent: "contact your manager"; credits come from the manager allocation, never Stripe ([roles/user.md](../roles/user.md)).

## Yelp Find Leads

Admin can turn Yelp on or off per user.

1. Location + industry
2. List of businesses
3. Select → save into the Address Book (same company object as AI save)

## Find leads on a route map

On the map the user can lasso an area, search leads there, create companies **as route stops**, then fetch contacts. The route usually needs **regenerate** after that.

## Rules

- Do not add a second AI pipeline; extend the existing stages.
- Places location bias must stay ≤ 50 km.
- Every save path must charge **1 credit** and skip duplicates.
- Manager “assign to rep” is not this module.

## Code

`AILeadFinderController`, `CompanylController` save/Yelp/legacy search, `Helper::saveAILead` / `getYelpLeads` / `saveYelpLead`, `UserAISearch`.

## Related

**Modules** — 03-Company-AddressBook, 07-Routes, 08-Lists, 09-Contact-Enrichment-Credits, 11-Maps, 12-Subscription-Payments, 16-Manager-Portal, 17-Admin-HQ

**This feature** — Use cases, Flows, Evidence, Limits, Known issues

**MCP** — 20-MCP, tool contract in api-surfaces.md

**Code** — ROUTEMAP.md (look for `AILeadFinderController`, `CompanylController`), CODEMAP.md, engineering/README.md

**Terms / roles** — glossary.md, roles.md, OVERVIEW.md

## Proposal 2026-09-22 — chat flow with one map circle

Same search, same results. The only change is how the two inputs are collected: the territory is a single circle on a map, the business description is a chat turn. One area per search, as today. Generated from the shipped stills with [render a still](../methods/render-still.md).

| Step | Mobile | Web (classic) |
|---|---|---|
| 1 — Circle the area | [mobile 1](find-leads-chat-mobile-1-circle-area.png) | [web 1](find-leads-chat-web-1-circle-area.png) |
| 2 — Describe businesses | [mobile 2](find-leads-chat-mobile-2-describe.png) | [web 2](find-leads-chat-web-2-describe.png) |
| 3 — Results as today | [mobile 3](find-leads-chat-mobile-3-results.png) | [web 3](find-leads-chat-web-3-results.png) |

Revised web layout, 2026-09-23: the map is on the left and the chat on the right for every step, and loaded leads sit on that map and in the existing grid under it. [web 1 map-left](find-leads-web-map-left-1-circle-area.png), [web 2 map-left](find-leads-web-map-left-2-describe.png), [web 3 map-left](find-leads-web-map-left-3-results.png). The earlier sketch is [find-leads-web-map-left.png](find-leads-web-map-left.png). Search stays free. Save stays 1 credit.

Rules kept: one circle (1–10 mi), no second area, "Type a city or ZIP instead" keeps the old path, search free, save 1 credit, results screen and Selected Leads unchanged.

## Screens

Per surface. "File" is under `TerriTool/App/components/` for mobile; the full map is [mobile screens](../code/mobile-screens.md). Strings are copied from code on 2026-09-22; a loading cell that reads `screen.x.loading` is the `testID` on that screen's `ActivityIndicator`. Copy these strings; do not write new ones.

| Surface | Screen | File / still | Primary action | Loading | Empty | Error |
|---|---|---|---|---|---|---|
| Mobile | `MultipleAIWaypoint` (AI Find Leads) | `findLeads/aiFindLeads.js` · [AIFindLeadsFlow](<../screenshots/mobile-owner/AIFindLeadsFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.42.05.png>) | Search, then Confirm Leads | "Loading your saved AI leads…", "Searching...", "Loading...", `screen.findLeadsAi.loading` … `loadingL` | "No matching results found..."; "No matching location found"; "No City Found"; "No ZipCode Found"; "No map locations"; "No selection"; "Nothing to clear" | "Oops! Something went wrong. Please check your internet connection or try again." (toast); "Please provide a value for searching industries."; "Oops! Could not create route, Please try again." |
| Mobile | `MultipleWaypoint` | `findLeads/index.js` | Search | `screen.findLeads.loading` … `loadingG` | "No matching results found..." | "Oops! Something went wrong. Please check your internet connection or try again." (toast) |
| Mobile | `LassoMap` | `route/lassoMap.js` | Draw, then confirm | `screen.mapLasso.loading` | — | "Oops! Something went wrong. Please check your internet connection or try again." (toast) |
| Classic web | `/findleads` | [web_06_findleads](../screenshots/web/sales-agent/web_06_findleads_w1440.png), [classic findleads](../screenshots/web-stills/05-classic-findleads.png) | Search, save | `#cover-spin` | Grid empty | Flash message |
| Manager | `/manager/ai-find-leads` | [Manager AI Find Leads](../screenshots/web-owner/Manager/AI-Find-Leads-TerriTool-09-15-2026_01_21_PM.png) | Circles on the map, then create leads | "Loading map…", "Loading current leads" | "No leads found."; lasso: "No leads found inside the lasso area." | "Could not load map."; "Could not assign leads." |

Search is free. Saving costs 1 per company through `saveAILeads`. The manager engine is separate (`hunt_engine=manager_portal`).

## Screenshots in this brain

Open the image before drawing UI. The filename is a capture time, not a layout spec. Pixels win.

- [IMG_4565.PNG](<../screenshots/feature-evidence/05-Find-Leads/evidence/IMG_4565.PNG>)
- [IMG_4566.PNG](<../screenshots/feature-evidence/05-Find-Leads/evidence/IMG_4566.PNG>)
- [IMG_4567.PNG](<../screenshots/feature-evidence/05-Find-Leads/evidence/IMG_4567.PNG>)
- [IMG_4568.PNG](<../screenshots/feature-evidence/05-Find-Leads/evidence/IMG_4568.PNG>)
- [IMG_4569.PNG](<../screenshots/feature-evidence/05-Find-Leads/evidence/IMG_4569.PNG>)
- [IMG_4570.PNG](<../screenshots/feature-evidence/05-Find-Leads/evidence/IMG_4570.PNG>)
- [IMG_4571.PNG](<../screenshots/feature-evidence/05-Find-Leads/evidence/IMG_4571.PNG>)
- [Screenshot 2026-09-15 at 1.53.08 PM.png](<../screenshots/feature-evidence/05-Find-Leads/evidence/Screenshot 2026-09-15 at 1.53.08 PM.png>)
- [Screenshot 2026-09-15 at 11.02.45 AM.png](<../screenshots/feature-evidence/05-Find-Leads/evidence/Screenshot 2026-09-15 at 11.02.45 AM.png>)
- [Screenshot 2026-09-15 at 11.02.58 AM.png](<../screenshots/feature-evidence/05-Find-Leads/evidence/Screenshot 2026-09-15 at 11.02.58 AM.png>)
- [Screenshot 2026-09-15 at 11.04.24 AM.png](<../screenshots/feature-evidence/05-Find-Leads/evidence/Screenshot 2026-09-15 at 11.04.24 AM.png>)
- [Screenshot 2026-09-15 at 9.56.30 AM.png](<../screenshots/feature-evidence/05-Find-Leads/evidence/Screenshot 2026-09-15 at 9.56.30 AM.png>)
- 51 more stills are in `../screenshots/feature-evidence/05-Find-Leads/`.

## Watched 2026-09-23

Two mobile Find Leads chromes are in [the oversized-video watch](../reviews/oversized-video-watch-2026-09-23.md). TestFlight says “AI Find Leads” and searches a city plus ideal businesses. App 42.32, opened from Address Book, says “Find Leads,” asks for a ZIP in “Find Leads by Zip Code,” and shows map pins. Its completion banner is “All data found for Coffee in this location.” A failed add toast starts “Some companies were not added as their dat…”

## Generate from this brain

- UI rule: [UI/UX Guardian](../brains/ui-ux-guardian.md)
- Screenshot method: [screenshot review](../screenshots/REVIEW.md)
- Mobile implementation: [mobile code review](../code/mobile-review.md)
- Web implementation: [web code review](../code/web-review.md)
- Role: [User](../roles/user.md) · [Manager](../roles/manager.md) · [Admin](../roles/admin.md)
