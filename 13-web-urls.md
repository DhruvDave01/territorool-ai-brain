# 13. Web URL catalog

Related: [11-web-backend](11-web-backend.md) · [features/12-manager-portal.md](features/12-manager-portal.md) · [features/13-admin-hq.md](features/13-admin-hq.md)

Source: `webterritool/routes/web.php`.

## Public / auth

`/`, `Auth::routes()`, `logout`, `register/checkemail`, `trial`, `registertool/{name}/{email}/{phone}`, `b2b`, `onboarding`, `mobilelogin/{token}`, `special`, `accActivate/{userid}`.

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

`/manager/dashboard`, `/manager/ai-find-leads`, `/manager/api/find-leads*`, `/manager/salespeople*`, `/manager/activity`, `/support*`, `/reports`, `/settings`, `/manager/api/{dashboard-data,kpis,team,feed,growth,insights,territory,sidebar-stats,rep/{id}}`.

## HQ (`/hq`, Admin)

Dashboards, salesperson, businessclient, subscriptions, promocode, specialdiscount, support, settings, user-activity.

## Cron (GET)

`cron/synccompanies/`, `updatesubscription/`, `syncHubspotCompaniesContacts`, `updatestripesubscriptionstatuscredit`, `opencorporatescreditupdate`, `usersubscriptionupdate`, plus `businessClientUpdateCron`, `routenotifycron`.

## MCP HTTP

| Server | Path |
|--------|--------|
| User / manager | `/ai/mcp` |
| Admin | `/ai/mcp-admin` |
| Find | `/find-mcp/mcp` |
