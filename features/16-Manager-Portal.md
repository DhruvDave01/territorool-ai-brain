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

## Changes since 29 September (read 2026-11-02)

No manager-portal code changed between the last training (`fcf62d0d`, 29 September) and master `d3f75449`: `ManagerDashboardController`, `app/Services/Manager/*`, `EnsureManagerRole`, `resources/views/front/manager/*`, `resources/manager-portal/*.jsx`, `public/js/manager-portal.js` and the `manager` route group are unchanged. Source: [live code 2026-11-02](../reviews/live-code-2026-11-02.md).

The new HQ tool `/hq/demo-data?email=…` (on master) rewrites the account, note, contact, route, list and visit data that `ManagerDashboardService` reads, for one manager's whole team. Never run it with a real customer's manager email on production: [warning in 17 — Admin HQ](17-Admin-HQ.md#danger-hqdemo-data-read-2026-11-02).

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

**Modules** — 01-Authentication-Onboarding, 05-Find-Leads, 09-Contact-Enrichment-Credits, 12-Subscription-Payments, 15-Support-Notifications, 17-Admin-HQ, 21-Business-Team

**This feature** — Use cases, Flows, Evidence

**Code** — ROUTEMAP.md (look for `Manager\ManagerDashboardController`), CODEMAP.md, engineering/README.md

**Terms / roles** — roles.md, OVERVIEW.md

## Screens

Per surface. "File" is under `TerriTool/App/components/` for mobile; the full map is [mobile screens](../code/mobile-screens.md). Strings are copied from code on 2026-09-22; a loading cell that reads `screen.x.loading` is the `testID` on that screen's `ActivityIndicator`. Copy these strings; do not write new ones.

| Surface | Screen | Still | Island root | Primary action |
|---|---|---|---|---|
| Manager | Dashboard | [Manager dashboard](../screenshots/web-owner/Manager/Manager-Dashboard-TerriTool-09-15-2026_01_20_PM.png) | `manager-dashboard-root` | Read KPIs, open a rep |
| Manager | AI Find Leads | [AI Find Leads](../screenshots/web-owner/Manager/AI-Find-Leads-TerriTool-09-15-2026_01_21_PM.png) | `manager-ai-find-leads-root` | Circles, create leads |
| Manager | Salespeople | [Salespeople](../screenshots/web-owner/Manager/Salespeople-TerriTool-09-15-2026_01_26_PM.png) | `manager-salespeople-root` | Add, edit, remove, resend |
| Manager | Add / edit salesperson | [Add](../screenshots/web-owner/Manager/Add-Salesperson-TerriTool-09-15-2026_01_26_PM.png), [Edit](../screenshots/web-owner/Manager/Edit-Salesperson-TerriTool-09-15-2026_01_27_PM.png) | `manager-salesperson-form-root` | Save |
| Manager | Salesperson detail | [Profile](../screenshots/web-owner/Manager/Anna-s-Profile-TerriTool-09-15-2026_01_27_PM.png) | `manager-salesperson-detail-root` | Allocate credits, view routes |
| Manager | Salesperson routes | [Route list](../screenshots/web-owner/Manager/Route-List-TerriTool-09-15-2026_01_28_PM.png) | `manager-salesperson-routes-root` | Open a route |
| Manager | Activity | [Activity](../screenshots/web-owner/Manager/Activity-TerriTool-09-15-2026_01_30_PM.png) | `manager-activity-root` | Filter the feed |
| Manager | Support | [Support](../screenshots/web-owner/Manager/Support-Tickets-TerriTool-09-15-2026_01_30_PM.png) | `manager-support-root`, `-create-root`, `-detail-root` | Open, reply |
| Manager | Settings | [Settings](../screenshots/web-owner/Manager/Settings-TerriTool-09-15-2026_01_30_PM.png) | `manager-settings-root` | Save |

States, copied from the JSX: loading is "Loading…", "Loading companies…", "Loading company details…", "Loading territory…", "Loading map…", "Loading current leads"; empty is "No companies found.", "No leads found.", "No leads found inside the lasso area."; error is "Failed to load dashboard data.", "Failed to load activity.", "Could not load companies. Please refresh the page.", "Could not load map.", "Could not assign leads.", shown as a toast on `#manager-toast-root`. Mount shape and CSS variables: [web code review](../code/web-review.md).

## Screenshots in this brain

Open the image before drawing UI. The filename is a capture time, not a layout spec. Pixels win.

- [AI-Find-Leads-TerriTool-09-15-2026_01_21_PM.png](<../screenshots/feature-evidence/16-Manager-Portal/evidence/AI-Find-Leads-TerriTool-09-15-2026_01_21_PM.png>)
- [AI-Find-Leads-TerriTool-09-15-2026_01_24_PM.png](<../screenshots/feature-evidence/16-Manager-Portal/evidence/AI-Find-Leads-TerriTool-09-15-2026_01_24_PM.png>)
- [Activity-TerriTool-09-15-2026_01_30_PM.png](<../screenshots/feature-evidence/16-Manager-Portal/evidence/Activity-TerriTool-09-15-2026_01_30_PM.png>)
- [Add-Salesperson-TerriTool-09-15-2026_01_26_PM.png](<../screenshots/feature-evidence/16-Manager-Portal/evidence/Add-Salesperson-TerriTool-09-15-2026_01_26_PM.png>)
- [Add-Support-Tickets-TerriTool-09-15-2026_01_30_PM.png](<../screenshots/feature-evidence/16-Manager-Portal/evidence/Add-Support-Tickets-TerriTool-09-15-2026_01_30_PM.png>)
- [Anna-s-Profile-TerriTool-09-15-2026_01_27_PM.png](<../screenshots/feature-evidence/16-Manager-Portal/evidence/Anna-s-Profile-TerriTool-09-15-2026_01_27_PM.png>)
- [Edit-Salesperson-TerriTool-09-15-2026_01_27_PM.png](<../screenshots/feature-evidence/16-Manager-Portal/evidence/Edit-Salesperson-TerriTool-09-15-2026_01_27_PM.png>)
- [Manager-Dashboard-TerriTool-09-15-2026_01_20_PM.png](<../screenshots/feature-evidence/16-Manager-Portal/evidence/Manager-Dashboard-TerriTool-09-15-2026_01_20_PM.png>)
- [Route-List-TerriTool-09-15-2026_01_28_PM.png](<../screenshots/feature-evidence/16-Manager-Portal/evidence/Route-List-TerriTool-09-15-2026_01_28_PM.png>)
- [Salespeople-TerriTool-09-15-2026_01_26_PM.png](<../screenshots/feature-evidence/16-Manager-Portal/evidence/Salespeople-TerriTool-09-15-2026_01_26_PM.png>)
- [Screenshot 2026-09-15 at 1.24.51 PM.png](<../screenshots/feature-evidence/16-Manager-Portal/evidence/Screenshot 2026-09-15 at 1.24.51 PM.png>)
- [Screenshot 2026-09-15 at 1.31.00 PM.png](<../screenshots/feature-evidence/16-Manager-Portal/evidence/Screenshot 2026-09-15 at 1.31.00 PM.png>)
- 3 more stills are in `../screenshots/feature-evidence/16-Manager-Portal/`.

## Generate from this brain

- UI rule: [UI/UX Guardian](../brains/ui-ux-guardian.md)
- Screenshot method: [screenshot review](../screenshots/REVIEW.md)
- Mobile implementation: [mobile code review](../code/mobile-review.md)
- Web implementation: [web code review](../code/web-review.md)
- Role: [User](../roles/user.md) · [Manager](../roles/manager.md) · [Admin](../roles/admin.md)
