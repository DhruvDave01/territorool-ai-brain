---
id: 13-web-urls
parent: core
sources:
  - webterritool/routes/web.php
related:
  - 11-web-backend.md
  - features/12-manager-portal.md
  - features/13-admin-hq.md
  - screens/web-how-it-works.md
---
# 13. Web URL catalog

Related: [11-web-backend](11-web-backend.md) · [features/12-manager-portal.md](features/12-manager-portal.md) · [features/13-admin-hq.md](features/13-admin-hq.md) · **flows:** [screens/web-how-it-works.md](screens/web-how-it-works.md)

Source: `webterritool/routes/web.php`. Prefixes are not journeys — use the flow note for landings and wizard steps.

## Landings (do not guess)

| Who | After login | Cite |
|-----|-------------|------|
| Business Agent | `/manager/dashboard` | `LoginController::redirectTo()`, `HomeController@dashboard` |
| Sales Agent / BSA | `/dashboard` | same; SA with **zero** subscription rows → RevenueCat from `/dashboard` and `/findleads` |
| Admin | `/hq/dashboard` | `CheckUserRole` |
| New SA (web register) | `/onboarding` or `/findleads` | `RegisterController::redirectPath()` |
| B2B | `/findleads` | `B2bSignupController` |
| BSA invite | `/businesssalesperson/activate/{userid}` | not self-register |

## Public / auth

`/`, `Auth::routes()`, `logout`, `register/checkemail`, `trial`, `registertool/{name}/{email}/{phone}`, `b2b`, `onboarding`, `onboarding/preferences`, `mobilelogin/{token}`, `mobilelogin/credits/{token}`, `special`, `accActivate/{userid}`, `businesssalesperson/activate/{userid}`. Also public `/manager-plugin*`.

## App (auth + role)

| Prefix | Feature |
|--------|---------|
| `/dashboard` | Home |
| `/company*` | CRUD, map, notes, visits |
| `/contact*` | Contacts |
| `/uploadcompany/step1–4`, `/uploadcontact/step1–4` | CSV (+ SFDC step 4) |
| `/uploaderror/*` | Autofill / merge / dedupe |
| `/list*`, `/lists` | Lists |
| `/route*`, `/routes*`, `/sessionroute/*`, `/simpleroute/*`, `/advancedroute/*` | Routes |
| `/findleads`, `/getAILeads`, `/saveAILeads`, `/getYelpLeads`, `/ai-lead-finder/*` | Leads |
| `/subscription*`, `/businessagent/subscription*` | Billing |
| `/businesssalesperson*` | Classic team |
| `/sfdc`, `/sync`, `/contactsync`, HubSpot, KarmaCRM | CRM |
| `/support*` | Tickets |
| `/salesperson/edit` | Profile |
| `/salesperson/mcp/*` | Outbound MCP client |

## Manager (`manager.only`)

Pages: `/manager/dashboard`, `/manager/ai-find-leads` (registered **twice**), `/manager/salespeople`, `/create`, `/{id}/edit|details|routes|remove|resend-invitation`, `/manager/activity`, `/manager/support`, `/create`, `/{id}`, `/manager/reports` (Coming soon Blade), `/manager/settings`.

Hunt/assign JSON: POST `/manager/api/find-leads/init|step`, `/manager/api/find-leads`, `create-leads`, `create-leads-batch`, `clear-saved-search`, `clear-assigned-leads`. GET `salespeople/{id}/companies`.

Dashboard JSON: `/manager/api/{dashboard-data,kpis,team,feed,growth,insights,territory,sidebar-stats,rep/{id},rep/{id}/territory}`.

`/manager/api/territory` is **UI coverage JSON**, not MCP `get_team_territories`.

## HQ (`/hq`, Admin)

Dashboards (`/hq`, `/hq/dashboard`, subscription dashboard, cancelled users / RevenueCat trials), salesperson (datatable, CRUD, convert, credit, aisearch, calculateroute), businessclient (nested salesperson, credits, resendinvitation), subscriptions (active/deactive/lifetime/business, `extend-days`, yelp flags), promocode, specialdiscount, support, settings, `user/{user}/edit`, `userdevices` CRUD, `user-activity/{id}`. HQ **writes**. Admin MCP does not.

## Cron (GET)

`cron/synccompanies/`, `updatesubscription/`, `syncHubspotCompaniesContacts`, `updatestripesubscriptionstatuscredit`, `opencorporatescreditupdate`, `usersubscriptionupdate`, plus `businessClientUpdateCron`, `routenotifycron`.

## MCP HTTP

| Server | Path |
|--------|------|
| User / manager | `/ai/mcp` |
| Admin | `/ai/mcp-admin` |
| Find | `/find-mcp/mcp` |

BA hunt/save/route/buy on `/ai/mcp`: [screens/manager-mcp-how-it-works.md](screens/manager-mcp-how-it-works.md).
