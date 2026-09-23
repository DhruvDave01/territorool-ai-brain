---
title: "22 — Development reference"
---

# 22 — Development reference

For a URL → `Controller@method` → Blade view lookup across all 725 registered routes, see [ROUTEMAP.md](ROUTEMAP.md) (generated from `php artisan route:list`; regenerate, don't hand-edit). This file is the feature-owner summary.

## Conventions

- Write PHP 7.2-safe code. Installed lockfile is Laravel **5.3.31** (product overviews that say Laravel 7 are stale until confirmed)
- `CompanylController` name is historical; do not rename without a full refactor
- Put shared rules in `Helper` / existing jobs — not a second copy per client
- After changing behavior, update the matching Bible module's `MODULE.md`

## Controllers (feature owners)

| Controller | Owns |
|------------|------|
| `CompanylController` | Companies, notes, visits, meetings, CSV, Find Leads page, AI/Yelp save, buy contacts, maps, add to route |
| `AILeadFinderController` | AI search stages |
| `ContactController` | Contacts + contact CSV |
| `RouteController` | Route list, current wizard, view, share, CSV export |
| `RoutesController` | CSV route session, lasso, map find-leads, contact fetch |
| `SimpleRouteController` / `AdvancedRouteController` | After-generate steps |
| `ListController` | Lists |
| `SubscriptionController` | Billing |
| `SalespersonController` | Settings |
| `BusinesssalespersonController` | Older team screens |
| `Manager\ManagerDashboardController` | Manager cockpit |
| `HomeController` | Dashboard |
| `SfdcController` / `HubSpotController` / `KarmaCrmController` | CRM |
| `SupportController` | Tickets |
| `CronController` | Scheduled HTTP jobs |
| `Api\V2\*` | Same features for token clients |
| `Admin\*` | HQ |

## Helpers / services

`Helper` (geocode, AI, Yelp, credits, first-route onboarding), Claude finder, Manager dashboard + find-leads, invite rewards, onboarding classifier.

## Hot UI files

Layout, sidebar, header, company modals, Find Leads, route step1, route view, `modalScript.js`, `custom.css`, `manager-portal.js`.

## Integrations

Google Maps/Places, Gemini, FullEnrich, Claude (contact fetch). Salesforce, HubSpot, KarmaCRM, Stripe, PayPal, RevenueCat, FCM, Sentry. Live contact fetch is **FullEnrich (2 credits)** and **Claude (1 credit)** only.

## Regression checklist (one product)

1. Register / trial / paywall / onboarding
2. Each role lands on the correct home
3. Add company (Places) → Address Book + map
4. Add contact → list + company
5. Find Leads → save (1 credit) → company exists on every client that lists companies
6. Yelp save if enabled
7. Find Contacts → buy (FullEnrich **2** / Claude **1**; never free)
8. Bulk contacts → progress → saved
9. List → CSV → generate route
10. Route ≥2 companies → process → map → visited → regenerate → set active
11. Share route; export
12. CSV import → repair → success
13. Status color in Settings → pins/list update
14. HubSpot connect → mapping → sync both
15. Subscribe / add-on / cancel survey
16. Manager: create salesperson, assign leads, KPIs
17. Admin: grant credits, extend days
18. Sign in on phone: same companies, active route, mark visited, credits
19. MCP/voice: same credits and publish rules ([20-MCP/api-surfaces.md](../../features/20-MCP/api-surfaces.md))

## Other in-repo prompts

`docs/` has implementation prompts (AI lead finder, bulk contacts, manager portal, MCP). The feature modules under [features/](../../features/README.md) are the **product** index.
