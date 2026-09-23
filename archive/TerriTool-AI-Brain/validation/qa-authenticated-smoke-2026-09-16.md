---
title: "QA — authenticated Sales Agent smoke (2026-09-16)"
---

# QA — authenticated Sales Agent smoke (2026-09-16)

QA loop: [../loops/qa-loop.md](../loops/qa-loop.md). Local MAMP / Apache / PHP 7.4.33. A user-supplied local Sales Agent fixture was used; no credential values or customer data are recorded here.

| Flow / UC | Steps run | Expected | Actual | Credits | Result |
|---|---|---|---|---|---|
| FLOW-AUTH / UC-AUTH-01 | Submit valid local credentials | Sales Agent → `/dashboard` | Redirected to `/dashboard`; authenticated chrome rendered. | 0 → 0 | **pass** |
| FLOW-HOME / UC-HOME-01 | Open dashboard | Home tiles and navigation | Dashboard rendered with Find Leads, Routes, Address Book, Lists, Upload and Settings. | 0 → 0 | **pass** |
| FLOW-AB / UC-CO-* | Open `/company` | Address Book screen and safe actions | Screen rendered; company grid is asynchronous. No company was created/modified. | n/a | **pass (render only)** |
| FLOW-FIND-LEADS / UC-LEAD-01 | Open Find Leads and run existing local ZIP/business search | Search is free; results display | 142 results and AI prospect summary displayed; balance stayed 0. Nothing was selected or saved. | 0 → 0 | **pass (search only)** |
| FLOW-ROUTE / UC-RTE-07 | Open Published list, then view `Top 25` | List count agrees with route stops | List says 25 companies; after a 5-second settle the route detail still says **0 total stops** while showing 77.70 mi / 2h29m. | n/a | **fail** |
| FLOW-LIST / UC-LST-* | Open Lists and wait for grid | Counts and list rows render | Summary 25 lists / 214 companies; grid loaded 25 rows after its initial loader. No list modified. | n/a | **pass** |
| FLOW-SETTINGS / UC-SET-01 | Open profile/settings | Profile and integrations render | Screen eventually rendered, but server/debug bar reported 12.62 s for `GET salesperson/edit`. | n/a | **pass with performance concern** |
| FLOW-CONTACTS / UPLOAD / BILLING / SUPPORT / FIELD / MANAGER / HQ / MCP / CRON / TEAM | Not run | Respective write, privileged, or integration flows | Not safe to exercise from this zero-credit Sales Agent fixture without an explicit disposable-data and credit-spend plan. | n/a | **blocked (scope/fixture)** |

## Findings

1. **P1 — route data mismatch:** `GET /routes` presents route **Top 25** with 25 companies; `GET /route/view/1581` keeps the stop grid/stat at 0 after settling. The route has non-zero distance/time, so the presented driving data conflicts with the stop list. Browser screenshots captured during this run. Trace: `resources/views/front/route/view_basic_route.blade.php` initializes the count at 0 and waits for grid `loadComplete`.
2. **P2 — missing jQuery plugin on loaded screens:** browser console logs `TypeError: $(...).zipAutocomplete is not a function` from `public/js/modalScript.js:2354`. The plugin exists at `public/js/plugins/city-autocomplete-google-places-api/jquery.zipcode-autocomplete.js`, but several views load `modalScript.js` without loading the plugin (for example `resources/views/front/list/findleads.blade.php`).
3. **P2 — settings latency:** `GET /salesperson/edit` completed but took 12.62 seconds locally. Needs a repeatable network/database profile before assigning root cause.
4. **Known P1 remains:** guest routes still log `AuthUser is not defined`; authenticated browser log history contains that original guest-page error.

## Safe next pass

Use a dedicated fixture with at least 3 disposable credits and at least two disposable companies. With explicit approval, exercise: save one lead (−1), buy one contact by supported provider (−1/−2), web draft route, publish/visit a route, create a list, upload a harmless fixture CSV, and submit/delete a disposable support ticket. Use a separate Business Agent fixture for FLOW-MANAGER and team operations.
