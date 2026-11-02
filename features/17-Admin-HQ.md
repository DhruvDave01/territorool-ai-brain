# 17 — Admin HQ

## Purpose

Internal TerriTool staff tools. **Admin role only.** Other roles never see HQ.

## Who

Admin.

## Functionality

### Dashboard

Active users, new users, routes created, activity counts in a date range. Subscription dashboard for paid/trial mix.

### Cancelled billing

- Cancelled paid subscriptions
- Cancelled RevenueCat trials (with a data feed)

### Salespeople (all field users)

List (server-side table), create, edit, delete, convert type, grant/edit credits, inspect AI searches, user activity log, helper to calculate a route.

### Business clients

Create/edit/delete managers, see their team, team credits, resend invitation, calculate a route for one of their reps.

### Plans

View a user's packages. Activate / deactivate, lifetime on/off, business plan, extend days, Yelp on/off.

### Promo and special discount

Create/edit/delete codes used at subscribe.

### Support

Answer tickets.

### Global settings, users, devices, cities

App settings, edit a user, device tokens for push, city lat/lng maintenance.

## Rules

- Never expose HQ without Admin.
- Credit grants must write the same wallet fields the product reads.
- Keep salesperson table paging/filters on the server.
- HQ is never an MCP/voice surface — see api-surfaces.md §5.

## Verified routes

Extracted from `routes/web.php`, group `prefix('hq')`, `namespace('Admin')`. Grouped by feature, not file order. Use this table (not guesswork) when an agent or developer needs the real HQ path.

| Feature | Method + path | Controller@action |
|---|---|---|
| Dashboard | `GET /hq` | `HomeController@index` |
| Dashboard | `GET /hq/dashboard` | `HomeController@dashboard` |
| Manager demo data (rewrites a team's data; see [warning](#danger-hqdemo-data-read-2026-11-02)) | `GET /hq/demo-data?email={manager email}` | `ManagerDemoDataController@run` |
| Subscription dashboard | `GET /hq/subscription/dashboard` | `HomeController@subscriptionDashboard` |
| Cancelled billing | `GET /hq/subscription/cancelled-users` | `HomeController@cancelledSubscriptionUsers` |
| Cancelled billing | `GET /hq/subscription/cancelled-revenuecat-trials` | `HomeController@cancelledRevenueCatTrialUsers` |
| Cancelled billing (data feed) | `GET /hq/subscription/cancelled-revenuecat-trials/data` | `HomeController@cancelledRevenueCatTrialUsersData` |
| Promo codes | `GET /hq/promocode` | `PromocodeController@index` |
| Promo codes | `GET/POST /hq/promocode/create` | `PromocodeController@create` / `@store` |
| Promo codes | `GET/POST /hq/promocode/{id}/edit`, `promocode/edit/{id}` | `PromocodeController@edit` / `@update` |
| Promo codes | `GET /hq/promocode/delete/{id}` | `PromocodeController@delete` |
| Salespeople | `GET /hq/salesperson` | `SalespersonController@index` |
| Salespeople (server-side table) | `GET /hq/salesperson/datatable` | `SalespersonController@datatableJson` |
| Salespeople | `GET/POST /hq/salesperson/create` | `SalespersonController@create` / `@store` |
| Salespeople | `GET/POST /hq/salesperson/{id}/edit`, `salesperson/edit/{id}` | `SalespersonController@edit` / `@update` |
| Salespeople | `GET /hq/salesperson/delete/{id}` | `SalespersonController@delete` |
| Convert role (e.g. Sales Agent → BSA) | `GET/POST /hq/salesperson/{id}/convert` | `SalespersonController@convertView` / `@convertStore` |
| Grant / edit credits | `GET/POST /hq/salesperson/credit/{id}` | `SalespersonController@creditindex` / `@creditupdate` |
| Inspect AI searches | `GET /hq/salesperson/aisearch/{id}` | `SalespersonController@aisearchindex` |
| Route calculator (support tool) | `GET /hq/salesperson/calculateroute/{salesPersonId}` | `SalespersonController@calculateroute` |
| User activity log | `GET /hq/user-activity/{id}` | `SalespersonController@userActivity` |
| Business clients | `GET /hq/businessclient` | `BusinessclientController@index` |
| Business clients | `GET/POST /hq/businessclient/create` | `BusinessclientController@create` / `@store` |
| Business clients | `GET/POST /hq/businessclient/{id}/edit` | `BusinessclientController@edit` / `@update` |
| Business clients | `GET /hq/businessclient/delete/{id}` | `BusinessclientController@delete` |
| See a manager's team | `GET /hq/businessclient/{id}/salesperson` | `BusinessclientController@salesperson` |
| Team credits | `GET/POST /hq/businessclient/salesperson-credit/{id}` | `BusinessclientController@salespersonCreditindex` / `@salespersonCreditupdate` |
| Resend invitation | `GET /hq/businessclient/resendinvitation/{id}` | `BusinessclientController@resendinvitation` |
| Route calculator for a rep | `GET /hq/businessclient/calculateroute/{salesPersonId}` | `BusinessclientController@calculateroute` |
| Plans: view | `GET /hq/subscription/index/{salesPersonId}` | `SubscriptionController@index` |
| Plans: activate / deactivate | `GET /hq/subscription/active/{id}`, `/deactive/{id}` | `SubscriptionController@active` / `@deactive` |
| Plans: lifetime on/off | `GET /hq/subscription/lifetimeactive/{id}`, `/lifetimedeactive/{id}` | `SubscriptionController@lifetimeactive` / `@lifetimedeactive` |
| Plans: business plan | `GET /hq/subscription/activebusiness/{id}` | `SubscriptionController@activebusiness` |
| Plans: extend days | `POST /hq/subscription/extend-days` | `SubscriptionController@extendDays` |
| Yelp on/off | `GET /hq/subscription/activeyelp/{id}`, `/deactiveyelp/{id}` | `SubscriptionController@activeyelp` / `@deactiveyelp` |
| Special discounts | `GET /hq/specialdiscount` | `SpecialdiscountController@index` |
| Special discounts | `GET/POST /hq/specialdiscount/create` | `SpecialdiscountController@create` / `@store` |
| Special discounts | `GET/POST /hq/specialdiscount/{id}/edit` | `SpecialdiscountController@edit` / `@update` |
| Special discounts | `GET /hq/specialdiscount/delete/{id}` | `SpecialdiscountController@delete` |
| Support | `GET /hq/support` | `SupportController@index` |
| Support | `GET/POST /hq/support/create` | `SupportController@create` |
| Support | `GET/POST /hq/support/view/{id}` | `SupportController@view` |
| Support | `POST /hq/support/update` | `SupportController@update` |
| Global settings | `GET /hq/settings` | `SettingController@edit` |
| Global settings | `POST /hq/setting/edit/{id}` | `SettingController@update` |
| Edit a user | `GET/POST /hq/user/{user}/edit`, `user/edit/{user}` | `UserController@edit` / `@update` |

Device tokens and city lat/lng maintenance exist as separate controllers (`UserdevicesController`, `CitiesCrudController`) reached from the Settings / Cities menu in Backpack; not itemized above since they follow standard Backpack CRUD routes.

## Rules (spend integrity)

- A credit grant here must write `total_credit` / `used_credit` (or `BusinessclientSalesagentCredit` for a manager's team) — the same fields `SalespersonController@creditupdate` reads, and the same fields the app reads elsewhere. Do not add a parallel credit field.
- `SubscriptionController@extendDays` and the activate/deactivate actions change the same subscription row the rep's own Settings/Billing screen reads — a change here must be visible there immediately, not just in HQ.

## Danger: `/hq/demo-data` (read 2026-11-02)

**Never open `/hq/demo-data?email=…` with a real customer's manager email on production. It rewrites that team's data at once and cannot be undone.**

Added by Mehul on 28 Oct 2026 in `0456a72a`, then `046876c8` and `b1730c6c`. It is on master (production) and beta_react. Source: [live code 2026-11-02](../reviews/live-code-2026-11-02.md). File: `app/Http/Controllers/Admin/ManagerDemoDataController.php`.

- **Gate:** `routes/web.php:115`, inside the `hq` group with middleware `['web','role']` (`routes/web.php:109`). `run()` aborts with 403 "Admin login required." unless the user is an Admin (`ManagerDemoDataController.php:21-23`). It is a plain GET with no confirmation step, no environment check and no backup, so opening the link runs it. Without `email` it shows a help page.
- **Who:** the user with that email must have `role_id` 3 (manager). Every user whose `parent_id` is that manager is changed, all in one `DB::beginTransaction()` (`:42-86`).
- **Dates:** every third rep by id, starting with the first, keeps its dates. For the others, 5–10 or 10–15 of their oldest accounts get a new `created_at` and `updated_at` in `companies`. Each re-dated account's latest `company_notes` row (`date_time`) and up to two of its `contacts` (`created_at`) get the same date, and the rep's first two `user_routes` and first two `user_lists` are re-dated too (`:88-130`, `:243-318`). Some dates fall later in the current quarter, which can be in the future (`:372-375`).
- **Visits, for every rep:** each company on the rep's routes is set visited (`companies.is_visited`, `visited_at`, `user_route_companies.is_visited`). Its `user_visited_companies` rows are updated or inserted, its rows for other route IDs are deleted, and notes dated after the visit are moved back to it. Every other company the rep owns is set not visited, and all of its `user_visited_companies` rows are deleted (`:135-238`).
- The summary page says accounts not on a route "were left unvisited" (`:416`). In fact their visited flags were cleared and their visit history deleted.

## Evidence gap

21 browser captures of HQ exist in evidence.md (15 Sep 2026), but their filenames carry no screen name and nobody has matched them to the `UC-ADM-*` use cases in use-cases.md — so they prove the screens were reachable, not what each one shows. The routes above are verified against `routes/web.php` directly; behavior details (form fields, validation copy) still need a catalogued walkthrough to confirm pixel-for-pixel.

## Code

`app/Http/Controllers/Admin/*` (`HomeController`, `PromocodeController`, `SalespersonController`, `BusinessclientController`, `SubscriptionController`, `SpecialdiscountController`, `SupportController`, `SettingController`, `UserController`, `UserdevicesController`, `CitiesCrudController`, `ManagerDemoDataController`), Backpack views.

## Related

**Modules** — 05-Find-Leads, 09-Contact-Enrichment-Credits, 11-Maps, 12-Subscription-Payments, 15-Support-Notifications, 16-Manager-Portal, 21-Business-Team

**This feature** — Use cases, Evidence

**MCP** — HQ is never a sales-rep MCP surface; the separate Admin MCP is described in 20-MCP and api-surfaces.md §5

**Code** — ROUTEMAP.md (look for the **Admin HQ** section (`Admin\*`)), CODEMAP.md, engineering/README.md

**Terms / roles** — roles.md, OVERVIEW.md

## Screens

Per surface. "File" is under `TerriTool/App/components/` for mobile; the full map is [mobile screens](../code/mobile-screens.md). Strings are copied from code on 2026-09-22; a loading cell that reads `screen.x.loading` is the `testID` on that screen's `ActivityIndicator`. Copy these strings; do not write new ones.

| Surface | Screen | Still | Primary action |
|---|---|---|---|
| HQ | Dashboard | [HQ](../screenshots/web-owner/Admin/TerriTool-HQ-09-15-2026_01_34_PM.png) | Open a table |
| HQ | Users and salespeople | [Admin](../screenshots/web-owner/Admin/TerriTool-Admin-09-15-2026_01_35_PM.png) | Backpack CRUD |
| HQ | More tables | [Admin folder](../screenshots/web-owner/Admin/) | Backpack CRUD |

States are Backpack's: DataTables "No data available in table", the Backpack loader, and Backpack validation alerts. Do not build HQ screens with manager islands.

## Screenshots in this brain

Open the image before drawing UI. The filename is a capture time, not a layout spec. Pixels win.

- [Screenshot 2026-09-15 at 1.39.45 PM.png](<../screenshots/feature-evidence/17-Admin-HQ/evidence/Screenshot 2026-09-15 at 1.39.45 PM.png>)
- [TerriTool-Admin-09-15-2026_01_35_PM.png](<../screenshots/feature-evidence/17-Admin-HQ/evidence/TerriTool-Admin-09-15-2026_01_35_PM.png>)
- [TerriTool-Admin-09-15-2026_01_36_PM (1).png](<../screenshots/feature-evidence/17-Admin-HQ/evidence/TerriTool-Admin-09-15-2026_01_36_PM (1).png>)
- [TerriTool-Admin-09-15-2026_01_36_PM (2).png](<../screenshots/feature-evidence/17-Admin-HQ/evidence/TerriTool-Admin-09-15-2026_01_36_PM (2).png>)
- [TerriTool-Admin-09-15-2026_01_36_PM.png](<../screenshots/feature-evidence/17-Admin-HQ/evidence/TerriTool-Admin-09-15-2026_01_36_PM.png>)
- [TerriTool-Admin-09-15-2026_01_37_PM (1).png](<../screenshots/feature-evidence/17-Admin-HQ/evidence/TerriTool-Admin-09-15-2026_01_37_PM (1).png>)
- [TerriTool-Admin-09-15-2026_01_37_PM (2).png](<../screenshots/feature-evidence/17-Admin-HQ/evidence/TerriTool-Admin-09-15-2026_01_37_PM (2).png>)
- [TerriTool-Admin-09-15-2026_01_37_PM.png](<../screenshots/feature-evidence/17-Admin-HQ/evidence/TerriTool-Admin-09-15-2026_01_37_PM.png>)
- [TerriTool-Admin-09-15-2026_01_38_PM (1).png](<../screenshots/feature-evidence/17-Admin-HQ/evidence/TerriTool-Admin-09-15-2026_01_38_PM (1).png>)
- [TerriTool-Admin-09-15-2026_01_38_PM (2).png](<../screenshots/feature-evidence/17-Admin-HQ/evidence/TerriTool-Admin-09-15-2026_01_38_PM (2).png>)
- [TerriTool-Admin-09-15-2026_01_38_PM (3).png](<../screenshots/feature-evidence/17-Admin-HQ/evidence/TerriTool-Admin-09-15-2026_01_38_PM (3).png>)
- [TerriTool-Admin-09-15-2026_01_38_PM.png](<../screenshots/feature-evidence/17-Admin-HQ/evidence/TerriTool-Admin-09-15-2026_01_38_PM.png>)
- 9 more stills are in `../screenshots/feature-evidence/17-Admin-HQ/`.

## Generate from this brain

- UI rule: [UI/UX Guardian](../brains/ui-ux-guardian.md)
- Screenshot method: [screenshot review](../screenshots/REVIEW.md)
- Mobile implementation: [mobile code review](../code/mobile-review.md)
- Web implementation: [web code review](../code/web-review.md)
- Role: [User](../roles/user.md) · [Manager](../roles/manager.md) · [Admin](../roles/admin.md)
