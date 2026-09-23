---
title: "16 — Manager Portal (Business Agent)"
---

# 16 — Manager Portal (Business Agent)

## Purpose

Cockpit for **Business Agents**: licenses, team, KPIs, assign AI leads to reps, activity, support, settings. Older team screens still exist for invites (module 21). New manager work belongs here.

## Who

Business Agent only.

## Navigation

Dashboard, AI Find Leads, Salespeople, Activity, Support, Settings.

Sidebar also shows credits remaining, team size, average score, active today, licenses used / total.

## Dashboard

KPI cards, team table, activity feed, growth, insights, territory coverage, per-rep detail and territory. Filterable by time period.

Reports page is a dedicated reporting view of the same team data.

## Salespeople

- Create: name, email, phone, territory/cities, credit allocation
- Cannot exceed license count
- Invite email → they set a password → Business Sales Agent
- Convert an existing Sales Agent onto the team
- Edit, resend invite, remove from team
- Detail: that rep’s companies, notes, contacts, routes
- Credits: `BusinessclientSalesagentCredit`

## Manager AI Find Leads

Not the rep Find Leads screen. The manager searches, then **assigns** companies into a **rep’s** Address Book (manager credits, not the rep’s Stripe wallet).

- Start / step / run search
- Create leads for one rep or a batch
- Scratchpad of assignments; clear search or clear assignments

## Activity, support, settings

- Team activity feed
- Tickets (same support system)
- Profile / plan settings (same profile save as Settings, manager home)

## Rules

- New manager screens stay Business Agent only.
- Creating a salesperson must respect licenses and send the same activate email as the older team screens.
- Assigned leads’ `user_id` is the **rep**, not the manager.

## Verified routes

Extracted from `routes/web.php`, group `prefix(‘manager’)`, controller `ManagerDashboardController` unless noted.

| Feature | Method + path | Action |
|---|---|---|
| Dashboard (page) | `GET /manager/dashboard` | `dashboard` |
| Dashboard data | `GET /manager/api/dashboard-data` | `dashboardData` |
| KPI cards | `GET /manager/api/kpis` | `kpis` |
| Team table | `GET /manager/api/team` | `team` |
| Activity feed | `GET /manager/api/feed` | `feed` |
| Growth | `GET /manager/api/growth` | `growth` |
| Insights | `GET /manager/api/insights` | `insights` |
| Territory coverage map | `GET /manager/api/territory` | `territory` |
| Sidebar stats (credits, team size, licenses) | `GET /manager/api/sidebar-stats` | `sidebarStats` |
| Rep detail | `GET /manager/api/rep/{id}` | `repDetail` |
| Rep territory | `GET /manager/api/rep/{id}/territory` | `repTerritoryApi` |
| Manager AI Find Leads (page) | `GET /manager/ai-find-leads` | `aiFindLeads` |
| Find Leads: init / step / run | `POST /manager/api/find-leads/init`, `/step`, `/find-leads` | `findLeadsInitApi` / `findLeadsStepApi` / `findLeadsApi` |
| Create leads for one rep | `POST /manager/api/create-leads` | `createLeadsApi` |
| Create leads for a batch of reps | `POST /manager/api/create-leads-batch` | `createLeadsBatchApi` |
| Clear saved search | `POST /manager/api/clear-saved-search` | `clearSavedSearchApi` |
| Clear assigned leads | `POST /manager/api/clear-assigned-leads` | `clearAssignedLeadsApi` |
| Salespeople (list) | `GET /manager/salespeople` | `salespeople` |
| Salespeople: create | `GET/POST /manager/salespeople/create` | `salespersonCreate` / `salespersonStore` |
| Salespeople: edit | `GET /manager/salespeople/{id}/edit`, `POST /manager/salespeople/{id}/edit` | `salespersonEdit` / `salespersonUpdate` |
| Salespeople: detail | `GET /manager/salespeople/{id}/details` | `salespersonDetail` |
| Salespeople: that rep’s routes | `GET /manager/salespeople/{id}/routes` | `salespersonRoutes` |
| Salespeople: that rep’s companies | `GET /manager/api/salespeople/{id}/companies` | `salespersonCompanies` |
| Salespeople: remove | `GET /manager/salespeople/{id}/remove` | `salespersonRemove` |
| Salespeople: resend invitation | `GET /manager/salespeople/{id}/resend-invitation` | `salespersonResendInvitation` |
| Activity (page) | `GET /manager/activity` | `activity` |
| Reports (page) | `GET /manager/reports` | `reports` |
| Support (list / create / detail) | `GET /manager/support`, `/support/create`, `/support/{id}` | `support` / `supportCreate` / `supportDetail` |
| Settings (page) | `GET /manager/settings` | `settings` |

All `{id}` route params on this prefix are constrained `->where(‘id’, ‘[0-9]+’)`.

## Code

`ManagerDashboardController`, `ManagerDashboardService`, `ManagerFindLeadsService`, `EnsureManagerRole`, manager views, `manager-portal.js`.

## Related

**Modules** — [01-Authentication-Onboarding](../01-Authentication-Onboarding/MODULE.md), [05-Find-Leads](../05-Find-Leads/MODULE.md), [09-Contact-Enrichment-Credits](../09-Contact-Enrichment-Credits/MODULE.md), [12-Subscription-Payments](../12-Subscription-Payments/MODULE.md), [15-Support-Notifications](../15-Support-Notifications/MODULE.md), [17-Admin-HQ](../17-Admin-HQ/MODULE.md), [21-Business-Team](../21-Business-Team/MODULE.md)

**This feature** — [Use cases](use-cases.md), [Flows](flows.md), [Evidence](evidence.md)

**Code** — [ROUTEMAP.md](../../knowledge/code/ROUTEMAP.md) (look for `Manager\ManagerDashboardController`), [CODEMAP.md](../../knowledge/code/CODEMAP.md), [engineering/README.md](../../knowledge/code/README.md)

**Terms / roles** — [roles.md](../../product/roles.md), [OVERVIEW.md](../../product/OVERVIEW.md)
