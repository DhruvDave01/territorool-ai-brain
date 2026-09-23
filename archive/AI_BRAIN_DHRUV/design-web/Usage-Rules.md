---
id: Usage-Rules
parent: design-web
sources:
  - inc/sidebar.blade.php
  - resources/manager-portal/main.jsx
  - public/js/manager-portal.js
---
# Usage rules — new web page

Agent policy: [brains/ui-ux-guardian.md](../brains/ui-ux-guardian.md) — copy existing; major UX → ask.

To look like TerriTool **today**, pick a stack first. Never mix.

## Classic (`/dashboard`, companies, routes, lists, findleads, …)

1. `@extends('front.layout')`.
2. `@section('content')` inside AdminLTE `.content` (layout already wraps it). Use `.box` / `.panel` like the sibling page.
3. Scripts: jQuery **2.2.0** already on the layout. `$.ajaxSetup` already sends CSRF.
4. File upload / CSV / multipart: `var formdata = new FormData(form);` then `$.ajax({ contentType: false, processData: false, data: formdata })`.
5. Find Leads and Address Book tables: **jqxGrid** (`#company_list`). Include `jqwidgets` CSS/JS like `listnewl.blade.php` / `findleads.blade.php`. Do not introduce a React grid here.
6. Routes **index** is DataTables — match `/routes`, not Find Leads.
7. Async feedback: **PNotify**. Full-page wait: `PageLoaderShow()` / `#cover-spin`.
8. Do not load `manager-portal.css` or DM Sans unless the sibling (Address Book / Routes list / Lists list) already scopes `--tt-*` on a page id.
9. Leave `inc/sidebar.blade.php` duplicates alone.
10. Copy the nearest classic sibling. Do not restyle leftover `#16aa9d` to manager teal.
11. Auth split-panel (`/login`, `/register`, `/trial`) is **not** AdminLTE dashboard chrome. Password reset **is** classic header. Web Register is **3** steps; mobile is **6**. Do not unify.

## Manager (`/manager/*`)

1. `@extends('front.manager._portal_layout')`.
2. Empty mount: `<div id="manager-feature-root"></div>` plus `<script type="application/json" id="manager-feature-initial">`.
3. `createRoot` in `resources/manager-portal/main.jsx`. Rebuild `public/js/manager-portal.js` (`npm run build` / `npm run dev`).
4. JSON via `managerFetch`. Not FormData, not PNotify.
5. Tokens: `var(--blue)`, `var(--radius)` (14px), DM Sans / Space Grotesk **inside** `#mgr-portal-dashboard-wrapper`.
6. Add the nav row in `_mgr_sidebar.blade.php`.
7. Do **not** add a new AdminLTE page, a second sidebar, or Bootstrap 5 utility soup. Vite lists Bootstrap 5; islands do not import it.
8. Maps: Google Maps + existing circle/lasso helpers. Exclude `.gm-style` from the universal box-sizing reset (already in `manager-portal.css`).

## HQ (`/hq/*`)

Do not invent chrome. Backpack layout only. Visual work is deferred until captures exist.

## AJAX cheat sheet

| Stack | Pattern |
|-------|---------|
| Classic multipart | `new FormData` + `contentType: false` + `processData: false` |
| Classic simple form | `$('#form').serialize()` (SFDC/HubSpot on layout) |
| Manager | `fetch` / `managerFetch` JSON + CSRF meta |

## Tables cheat sheet

| Page | Widget |
|------|--------|
| `/findleads` | jqxGrid `#company_list` (and Yelp `#yelp_company_list`) |
| `/company` Address Book | jqxGrid `#company_list` |
| `/routes`, `/lists` | DataTables |
| Manager lists | React tables (`LeaderboardTable`, etc.) |

Deferred: do not restyle Register/paywall/HQ until that pack is in scope.
