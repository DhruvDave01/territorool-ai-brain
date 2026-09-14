# Web / backend code details

Related: [11-web-backend](../11-web-backend.md) · [13-web-urls](../13-web-urls.md) · [14-mcp](../14-mcp.md) · [16-data-models](../16-data-models.md)

Root: `/Users/dhruvdave/Dhurv/Project_TerriTool/Territool_web/webterritool`

This is a **file map** for coding. Product behavior lives in `features/`. Do not invent files that are not listed.

## Where to start

| Task | Open first |
|------|-----------|
| Company / leads / contacts (web UI) | `CompanylController` (note the extra **l**) |
| Mobile JSON | `app/Api/V2/Controllers/` + `routes/api.php` |
| New web URL | `routes/web.php` |
| MCP tool | `app/UserMcp/config/territool_app.php` then `Services/Tools/*Tools.php` |
| AI Find Leads SSE | `AILeadFinderController` + `resources/views/front/route/findleads.blade.php` |
| Shared PHP helpers | `app/Helpers/helpers.php` (`App\Helpers\Helper`) — not `App\Globals\Helper` |
| Manager portal | `Http/Controllers/Manager/` + `resources/views/front/manager/` |

## Directory tree

```
webterritool/
├── app/
│   ├── Http/Controllers/         # Blade app + HQ
│   ├── Api/V2/Controllers/        # Mobile JWT API
│   ├── Models/  Models/MongoDB/
│   ├── Helpers/helpers.php
│   ├── Globals/Helper.php, Routes.php
│   ├── Services/                 # Manager, Claude finder, UserData
│   ├── Jobs/
│   ├── UserMcp/  AdminMcp/  FindMcp/  McpClient/  McpOAuth/
│   ├── Mail/  Console/  Events/  Exceptions/
│   └── User.php  Package.php  BusinessClient.php …
├── routes/web.php  routes/api.php
├── resources/views/front/        # Classic Blade
├── public/js/modalScript.js     # Bulk contacts (~2800)
├── public/css/custom.css
├── packages/davispeixoto/      # Salesforce
└── docs/MCP-*.md  docs/qa-runs/
```

## Web controllers (`app/Http/Controllers/`)

| Class | Owns |
|-------|------|
| `CompanylController` | Companies CRUD, CSV wizard, AI/Yelp save, bulk contacts, findleads page (~8500 LOC) |
| `AILeadFinderController` | Gemini + Places stages / SSE |
| `RoutesController` | Session route wizard, lasso, PDFs, contact fetchers |
| `RouteController` | Route index/steps/view/map/share, published/draft |
| `SimpleRouteController` | Basic route views |
| `AdvancedRouteController` | Advanced route views |
| `ListController` | Lists CRUD, generate route, map, CSV |
| `ContactController` | Contacts CRUD, CSV, appointments |
| `SubscriptionController` | Stripe/PayPal/credits-addon/cancel/RevenueCat |
| `SfdcController` | Salesforce connect/sync/dataloader/Zapier |
| `HubSpotController` | HubSpot key, sync, field mapping |
| `KarmaCrmController` | KarmaCRM |
| `BusinesssalespersonController` | Classic team invite/edit/credit |
| `BusinessclientController` | Business client (app-side) |
| `SupportController` | Tickets |
| `HomeController` | Dashboard / landing |
| `SalespersonController` | Profile / salesperson edit |
| `UserauthController` | Extra auth helpers |
| `CronController` | HTTP cron GETs |
| `TourController` | Tours |
| `MailController` | Mail |
| `DownloadController` | Downloads |
| `Manager/ManagerDashboardController` | `/manager` JSON + pages |
| `Auth/LoginController` | Login (also MCP OAuth return) |
| `Auth/RegisterController` | Signup → Sales Agent |
| `Auth/B2bSignupController` | B2B |
| `Auth/PostRegistrationOnboardingController` | Onboarding |
| `Auth/ForgotPasswordController`, `ResetPasswordController` | Password |

### HQ (`Admin/`)

`HomeController`, `SalespersonController`, `BusinessclientController`, `SubscriptionController`, `SupportController`, `PromocodeController`, `SpecialdiscountController`, `SettingController`, `UserController`, `UserdevicesController`, `CitiesCrudController`.

## API V2 (`app/Api/V2/Controllers/`)

| Class | Owns |
|-------|------|
| `AuthController` | login, signup, mobileregistration, recovery, revenuecate-success |
| `CompanyController` | companies, notes, activities, enrichment, AI (~3470 LOC) |
| `RouteController` | routes, status, credits, notifications (~4400 LOC) |
| `ListController` | lists |
| `ContactSellController` | contact sell/buy paths |
| `WebhookController` | Apollo, FullEnrich, RevenueCat |
| `SupportController` | tickets |
| `UserDataController` | `getuserdata` |
| `InviteController` | invites / QR |
| `ProfileController` | profile |
| `CityController` | `citysearch` (public) |

## Middleware

| Alias / class | Role |
|--------------|------|
| `CheckUserRole` | Admin → `/hq`; others stay in app |
| `EnsureManagerRole` | Business Agent only on `/manager` |
| `authJWT` | API JWT group |
| `RedirectIfSubscribed` | Subscription redirect |
| `RedirectIfAuthenticated` | Guest |

## `App\Helpers\Helper` (autoloaded)

`app/Helpers/helpers.php` — surgical edits only.

| Method | Role |
|--------|------|
| `autofillAddress` | Upload-error address |
| `mergeContactWithCompany` | Merge |
| `deleteDuplicate` / `appendCompanies` | CSV repair |
| `resolveCityFromPassedData` / `getCityLatLongByAddress` | Geo |
| `getIndustryTypes` | Industries |
| `userActiveSubscription` / `shouldShowRevenueCatManagePlanModal` | Billing gates |
| `AILeadGoogleSearch` | Legacy Google search |
| `AILeadFinder` / `AITop50LeadFinder` | Legacy AI |
| `AILeadsContactFinder` / `ByWebsite` | Place contacts |
| `saveAILead` | Persist leads + **1 credit each** |
| `getYelpLeads` / `saveYelpLead` | Yelp |
| `aiLeadDataStore` / `getAiLeadData` | `user_ai_search` |
| `filterAiLeadSearchRowsAgainstUserCompanies` | Dedupe vs Address Book |
| `companyDetails` / `getCompanyTime` | Company helpers |
| `routePdfTitleFontSize` | PDF title |

Procedural: `mail_internal()`, `send_loops_transactional_email()`.

Do **not** confuse with `app/Globals/Helper.php`.

## Services / jobs

| Path | Role |
|------|------|
| `Services/Manager/ManagerDashboardService.php` | Manager KPIs |
| `Services/Manager/ManagerFindLeadsService.php` | Manager Places-circle hunt |
| `Services/ClaudeContactFinder/ClaudeContactFinderService.php` | Claude contacts |
| `Services/UserDataService.php` | User data blob |
| `Jobs/BuyContactsBulkJob.php` | FullEnrich bulk |
| `Jobs/SendTrialNudgePush.php` | Trial nudge |
| `Jobs/SendOnboardingSegmentEmail.php` | Onboarding email |
| `Jobs/SendWelcomeEmails.php` | Welcome |

## MCP modules (file map)

### User MCP — `app/UserMcp/`

| Path | Role |
|------|------|
| `config/territool_app.php` | Tool schemas, ChatGPT subsets, manager tools |
| `UserMcpServiceProvider.php` | Register |
| `Http/Controllers/AppMcpHttpController.php` | `/ai/mcp` |
| `Services/AppMcpProtocolService.php` | JSON-RPC |
| `Services/Tools/{Account,Companies,Contacts,Leads,Manager,Routes}Tools.php` | Handlers |
| `Services/McpUserScope.php` | parent_id team |
| `Services/CustomerApiClient.php` | Dispatch `/api/v2` |
| `Console/QaCommand.php` etc. | `territool-app:*` artisan |
| `Models/UserMcp{Request,Search,Tool}Log.php` | Audit |

### Admin MCP — `app/AdminMcp/`

`config/mcp.php`, `McpProtocolService`, read-only list services (`SalesAgentsService`, `ActiveSubscribersService`, `UserCreditsService`, …), Sales Desk HTTP controllers, `php artisan mcp:stdio`.

### Find MCP — `app/FindMcp/`

`config/territool_find.php`, `ContactsTools.php`, skills under `skills/find-leads` and `find-contacts`.

### Outbound McpClient — `app/McpClient/`

`SalespersonMcpController`, HubSpot/Salesforce MCP sync services, `/salesperson/mcp/*`.

## Blade / front (classic)

Master: `resources/views/front/layout.blade.php` (jQuery 2.2.0, AdminLTE BS3).

**Visual tokens / chrome:** [design-web/MINI-DESIGN-BRAIN.md](../design-web/MINI-DESIGN-BRAIN.md). Two stacks; do not modernize AdminLTE or drop manager UI into a new Blade AdminLTE page.

| Path | Role |
|------|------|
| `route/findleads.blade.php` | AI + Yelp (~4500 LOC), SSE + jqxGrid |
| `company/modal.blade.php` | Shared modals incl. Bulk Contacts |
| `company/listnewl.blade.php` | Company list |
| `inc/sidebar.blade.php`, `inc/stickybar.blade.php` | Chrome |
| `manager/*` | Vite/React portal shells |
| `public/js/modalScript.js` | Bulk Contacts JS |

Manager portal JS is Vite (`npm run dev`) — React 18 + Leaflet, not the jQuery stack.

## Models

See [16-data-models.md](../16-data-models.md). PHP files live in `app/Models/` plus root `app/User.php`, `Package.php`, `BusinessClient.php`.

## Coding rules (repeat)

- Laravel 7 / PHP 7.2. Giant controllers are normal — be surgical.
- AJAX often `FormData` with `contentType: false`.
- MCP must dispatch existing APIs; never fork credit math.
- Crons are HTTP GET routes, not `Kernel::schedule()`.
