---
title: "Screen spec — Company detail: associated routes and lists"
---

# Screen spec — Company detail: associated routes and lists

Filled from [SCREEN-SPEC.md](../../../ui-flows/SCREEN-SPEC.md). **Not implemented.** Do not file generated mocks as evidence.

> Previous version of this file only said "Copy-from: evidence 11:07:12 (SORA Craft Kitchen popup)" with no embedded image and no layout description — an agent asked to design from it had nothing to anchor on and generated a screen unrelated to the real one. This version embeds the actual screenshot and describes the current, live layout field by field so that doesn't happen again.

## Current screen (baseline — do not redesign this part)

![Company detail popup — SORA Craft Kitchen](<../evidence/Screenshot 2026-09-15 at 11.07.12 AM.png>)

| Field | Value |
|-------|-------|
| Goal | View and manage everything about one company without leaving the grid it was opened from |
| User / role | Sales Agent, BSA, Business Agent — any role that can open the Address Book / Recently Added grid |
| UC ID | UC-CO-04 (view), UC-CO-05 (edit), UC-CO-06 (status), UC-ACT-01 (activity) — existing, unchanged |
| FLOW ID | FLOW-AB (Address Book) |
| URL | No dedicated URL — a Bootstrap modal (`#findleadsModal1`) opened over `/company`, `/recent-company`, or `/list/{id}` etc. Data loaded via `POST {api_base}/company/details` (`CompanylController@companyDetails`), rendered by `public/js/modalScript.js` |
| Stack | Blade + jQuery. View: `resources/views/front/common/modal.blade.php` (+ `front.common.company_detail_activity_block` partial). Not `/manager` — do not touch React. |
| Layout (top → bottom, from the screenshot) | 1. Header: company name + status pill (dropdown), address, close (×) 2. Action row (top-right): **Add to Route**, **Add to List**, **Edit**, **Report Company** 3. Meta row: Company Phone (icon) + Website (icon) side by side 4. Hours chips: Mon–Sun, "Closed" or time range per day 5. **Read More** toggle → reveals Revenue / Rating / Employees / Review Count / Company LinkedIn / Industry grid 6. **Contacts** section: title + "Manage organization contacts and links." subtitle, Report / Create Contact / Find Contacts buttons, table (Contact / Position / Location / Mobile No. / Email / LinkedIn / Action), empty state "No Contact Found" 7. **Activity (N)** section: + Add Activity button, Today / Upcoming / Past tabs with counts, table (Date / Type / Detail / Action), empty state "No Activity Found" |
| States | Loading: fields blank until `company/details` resolves. Empty: "No Contact Found" / "No Activity Found" (existing literal strings — reuse this pattern, don't invent new empty copy). Error / permission: not yet documented — check `known-issues.md` before inventing new copy. |

## Proposed addition — Associated Routes & Lists (needs product confirmation before build)

Goal: let the rep see, from inside this same modal, every route and list this company is already part of, instead of hunting for it in Routes/Lists separately.

| Field | What to put |
|-------|-------------|
| Placement | New section between **Contacts** and **Activity**, same visual pattern as those two (title + subtitle + table + empty state) — do not invent a new card style |
| Table columns | Type (Route / List) · Name (link to that route/list) · Status (route: Draft/Processing/Published; list: —) |
| Empty state | Match existing tone: "Not in any route or list yet" |
| Data source (verified, no schema change needed) | Routes: `App\Models\UserCompanies` (table `user_route_companies`, has `company_id` + `route_id`) — `UserRoute::routeCompanies()` is the existing relationship, just needs a `company_id` filter instead of `route_id`. Lists: `App\Models\UserListCompanies` (table `user_list_companies`, has `company_id` + `list_id`) — same, already has a `company()` belongsTo. |
| API / web methods | Extend `CompanylController@companyDetails` (`POST company/details`) to add `routes: []` and `lists: []` arrays to its JSON response — reuse the existing endpoint the modal already calls, do not add a second round-trip. `modalScript.js` renders the new table the same way it renders Contacts/Activity today. |
| Actions | Click a route/list name → navigate to that route/list (existing route/list view pages) |
| Credit impact | None — this is a read of existing associations |
| One-product | Read-only display; no write path changes. If MCP's `view_company` tool should also expose this, that's a separate, later decision — do not couple it to this UI change. |
| QA | Happy: company in 2 routes + 1 list shows 3 rows. Empty: company in nothing shows the empty state. Both must survive a page refresh (data re-fetched via `company/details`, not cached client-side). |

**Not decided yet — confirm before implementing:** exact section title/copy, whether Draft routes should show here or only Published, and whether this needs a UC ID of its own (`UC-CO-11` is free if so).
