---
title: "17 — Admin HQ"
---

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
- HQ is never an MCP/voice surface — see [api-surfaces.md](../20-MCP/api-surfaces.md) §5.

## Verified routes

Extracted from `routes/web.php`, group `prefix('hq')`, `namespace('Admin')`. Grouped by feature, not file order. Use this table (not guesswork) when an agent or developer needs the real HQ path.

| Feature | Method + path | Controller@action |
|---|---|---|
| Dashboard | `GET /hq` | `HomeController@index` |
| Dashboard | `GET /hq/dashboard` | `HomeController@dashboard` |
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

## Evidence gap

21 browser captures of HQ exist in [evidence.md](evidence.md) (15 Sep 2026), but their filenames carry no screen name and nobody has matched them to the `UC-ADM-*` use cases in [use-cases.md](use-cases.md) — so they prove the screens were reachable, not what each one shows. The routes above are verified against `routes/web.php` directly; behavior details (form fields, validation copy) still need a catalogued walkthrough to confirm pixel-for-pixel.

## Code

`app/Http/Controllers/Admin/*` (`HomeController`, `PromocodeController`, `SalespersonController`, `BusinessclientController`, `SubscriptionController`, `SpecialdiscountController`, `SupportController`, `SettingController`, `UserController`, `UserdevicesController`, `CitiesCrudController`), Backpack views.

## Related

**Modules** — [05-Find-Leads](../05-Find-Leads/MODULE.md), [09-Contact-Enrichment-Credits](../09-Contact-Enrichment-Credits/MODULE.md), [11-Maps](../11-Maps/MODULE.md), [12-Subscription-Payments](../12-Subscription-Payments/MODULE.md), [15-Support-Notifications](../15-Support-Notifications/MODULE.md), [16-Manager-Portal](../16-Manager-Portal/MODULE.md), [21-Business-Team](../21-Business-Team/MODULE.md)

**This feature** — [Use cases](use-cases.md), [Evidence](evidence.md)

**MCP** — HQ is never a sales-rep MCP surface; the separate Admin MCP is described in [20-MCP](../20-MCP/MODULE.md) and [api-surfaces.md](../20-MCP/api-surfaces.md) §5

**Code** — [ROUTEMAP.md](../../knowledge/code/ROUTEMAP.md) (look for the **Admin HQ** section (`Admin\*`)), [CODEMAP.md](../../knowledge/code/CODEMAP.md), [engineering/README.md](../../knowledge/code/README.md)

**Terms / roles** — [roles.md](../../product/roles.md), [OVERVIEW.md](../../product/OVERVIEW.md)
