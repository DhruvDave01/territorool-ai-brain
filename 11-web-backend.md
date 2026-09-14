# 11. Web and backend

Related: [02-commands](02-commands.md) · [13-web-urls](13-web-urls.md) · [14-mcp](14-mcp.md)

## Stack

Laravel 7, PHP 7.2, MySQL + Mongo, Backpack, Dingo API, Passport, JWT 0.5, Blade/jQuery 2/AdminLTE, Vite+React 18 manager portal, Stripe, PayPal, RevenueCat, Gemini, Places, Sentry, PostHog, FCM, Excel, TCPDF/dompdf, Salesforce packages under `packages/davispeixoto/`.

**How a page looks:** [design-web/MINI-DESIGN-BRAIN.md](design-web/MINI-DESIGN-BRAIN.md) — classic AdminLTE vs manager islands, do not mix.

## Layout (ignore `vendor/`)

```
webterritool/
  app/Api/V2/Controllers/
  app/Http/Controllers/          CompanylController, RoutesController, RouteController,
                                  ListController, ContactController, SubscriptionController,
                                  SfdcController, HubSpotController, KarmaCrmController,
                                  BusinesssalespersonController, SupportController,
                                  CronController, HomeController, Manager/
  app/Helpers/helpers.php
  app/Models/  (+ Models/MongoDB/)
  app/UserMcp/  AdminMcp/  FindMcp/  McpClient/  McpOAuth/
  app/Jobs/  Mail/  Console/
  routes/web.php  routes/api.php
  resources/views/front/        company, route, list, contact, subscription, manager, …
  public/js/modalScript.js      Bulk Contacts (~2800)
  public/css/custom.css
  docs/MCP-*.md  docs/qa-runs/
```

## Giant controllers (touch carefully)

| Class | ~LOC | Owns |
|-------|------|------|
| `CompanylController` | 8500+ | Companies, CSV, AI/Yelp save, bulk contacts, findleads page |
| `AILeadFinderController` | 1180 | Gemini+Places stages |
| `RoutesController` | ~2800 | Session wizard, lasso, PDFs, contact fetchers |
| API `RouteController` | 4400+ | Mobile routes/status/credits/notifications |
| API `CompanyController` | 3470+ | Mobile company/notes/activities/enrichment/AI |

## Docs

`Prompts/TerriTool_Web_OverView.md` (in the **mobile** repo), `docs/MCP-Agent-QA-Playbook.md`, `docs/MCP-Manager-QA-Playbook.md`, `docs/MCP-Manager-Portal-Feature-Gap.md`, `app/FindMcp/README.md`, `app/FindMcp/skills/*/SKILL.md`.
