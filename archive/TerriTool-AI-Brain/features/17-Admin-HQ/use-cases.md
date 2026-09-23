---
title: "Admin HQ — use cases"
---

# Admin HQ — use cases

Part of [17-Admin-HQ](MODULE.md). Verbatim from the former `03-Use-Cases/use-cases.md` (split 2026-09-16). Actors and global chrome: [use-cases-overview.md](../../product/use-cases-overview.md). Evidence times refer to [evidence.md](evidence.md) where that file exists.

## 16. Admin (back office)

No screenshot/video evidence exists yet (the 15 Sep capture set is field-rep only). Every UC below is grounded in `routes/web.php` (`prefix('hq')`) — see [17-Admin-HQ verified routes](MODULE.md#verified-routes) for exact paths. Treat these as route-verified, not pixel-verified.

### UC-ADM-01 Staff sign-in and dashboard

Actor: Admin. `CheckUserRole` sends Admin accounts straight to `/hq/dashboard` on login — never the rep Dashboard. Tiles: active users, new users, routes created, activity counts over a date range.

### UC-ADM-02 Subscription dashboard and cancellations

`/hq/subscription/dashboard` (paid/trial mix). `/hq/subscription/cancelled-users` and `/hq/subscription/cancelled-revenuecat-trials` (+ `/data` feed) list churned accounts for review.

### UC-ADM-03 Manage salespeople (all field users)

`/hq/salesperson`: server-side paged table. Create / edit / delete a Sales Agent or BSA. Convert a user's role (`/salesperson/{id}/convert`). Grant or edit credits (`/salesperson/credit/{id}`) — writes the same `total_credit`/`used_credit` fields the app reads. Inspect a user's AI search history (`/salesperson/aisearch/{id}`) and activity log (`/user-activity/{id}`). Route calculator helper for support (`/salesperson/calculateroute/{id}`).

### UC-ADM-04 Manage business clients (managers)

`/hq/businessclient`: create/edit/delete a manager account. View that manager's team (`/businessclient/{id}/salesperson`) and grant/edit team credits (`/businessclient/salesperson-credit/{id}`) — the `BusinessclientSalesagentCredit` pool BSAs spend from. Resend a manager's invitation.

### UC-ADM-05 Plans and billing overrides

Per user (`/hq/subscription/index/{id}`): activate/deactivate a plan, toggle lifetime access, activate a business plan, extend the billing window by days (`extend-days`), toggle Yelp Find Leads on/off. These change the same subscription row the rep's own Settings/Billing screen reads.

Exception: a RevenueCat-billed Sales Agent is still managed here for admin overrides, but routine plan changes on their side happen on RevenueCat, not Stripe — see [roles.md](../../product/roles.md).

### UC-ADM-06 Promo codes and special discounts

`/hq/promocode` and `/hq/specialdiscount`: create/edit/delete codes redeemable at subscribe time.

### UC-ADM-07 Support tickets (admin queue)

`/hq/support`: same ticket system as the rep and manager Support screens (module 15), answered from the Admin queue.

### UC-ADM-08 Global settings, users, devices, cities

`/hq/settings` (app-wide settings), `/hq/user/{id}/edit` (edit any user), device tokens for push (`UserdevicesController`, Backpack CRUD), city lat/lng maintenance (`CitiesCrudController`, Backpack CRUD).

### UC-ADM-09 MCP is out of scope for HQ

Admin has a separate **Admin MCP** server (HQ-style lookup: agents, plans, credits) — it is not the customer Address Book and not the sales-rep MCP catalog. See [api-surfaces.md](../20-MCP/api-surfaces.md) §1 and §5. Never expose `/hq/*` routes as sales-rep MCP tools.
