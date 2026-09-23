---
area: audits
tags: [brain/audits]
ref: "Audit 2 – web app review"
---

# Phase 2 — Web Codebase Audit (`repos/web`)

- **Date:** 2026-09-15
- **Target:** `/Applications/MAMP/htdocs/webterritool`, branch `beta_react`, working tree (USER SAID, Phase 0 Q1). **MCP modules are in scope** (USER SAID, Q7).
- **Status:** STOPPED. Rules (§8), decisions (§9) and questions (§10) await approval.

## Method and coverage

| Done | How |
|---|---|
| Read end to end | `routes/api.php`, `app/Http/Kernel.php`, `app/Http/Middleware/{authJWT,CheckUserRole,EnsureManagerRole,VerifyCsrfToken}.php`, `app/Providers/RouteServiceProvider.php`, `app/Exceptions/Handler.php`, `resources/manager-portal/utils/managerFetch.js` |
| Read partially | `config/api.php`, `config/jwt.php`, `config/auth.php` (settings only); `.env` **only** the keys `API_PREFIX`, `API_VERSION`, `API_STRICT`, `API_DEBUG` (and in Phase 0 `APP_ENV`, `APP_URL`, `DB_HOST`, `DB_DATABASE`); `V2 AuthController::getUserActivity` (`:845-875`); `V2 CompanyController::getCompanyActivities` (`:911-982`) + header/`currentUser` (`:1-64`, `:1143-1155`); `UserMcp/Services/CustomerApiClient.php` (1–90); `FindMcp/README.md`; `routes/web.php` (route lines, groups) |
| Repo-wide measurement | pattern greps over `app/`, `routes/` (±5%) |
| Syntax | `php -l` (PHP 7.4.33) on all 395 PHP files in `app/ routes/ config/ database/`: **0 syntax errors** |
| Scans | Node script over `app/`: duplicated function bodies (≥ 8 lines), functions ≥ 300 lines, query calls inside loops (N+1 heuristic) |

**Not read end to end:** the large controllers (`CompanylController` 8,509 lines, `HubSpotController` 3,476, `RoutesController` 3,171, `V2/RouteController` 4,442, `V2/CompanyController` 3,371), `Globals/Helper.php`, the Manager services, the Blade views and the MCP tool implementations. Also not reviewed: `composer.lock` internals, `public/` JS/CSS, or the `database/webterritool.sql` contents (deliberately unopened).

---

## 1. Stack (verified)

| Concern | Finding | Source |
|---|---|---|
| Framework | **Laravel 5.3.31** (the overview doc's "7.x" is wrong) | `vendor/.../Application.php:28`, `composer.lock` |
| PHP | constraint `^7.2`; local CLI 7.4.33; code comments assume PHP 7.4 (`Exceptions/Handler.php:50`). **Staging/production PHP unknown** | `composer.json`, `php -v` |
| Mobile/MCP API | **Dingo API v1.0.0-beta8**, only `$api->version('v2')` is routed. `API_PREFIX=api`, `API_VERSION=v2`, `API_STRICT=false` (no Accept header needed), **`API_DEBUG=true` (local)** | `routes/api.php:75-247`, `.env` (4 keys) |
| API V1 | **All V1 routes are commented out** (`routes/api.php:22-71`). `app/Api/V1/Controllers/*` and `app/Api/V1/Model/*` are unreachable. The `app/Api/V2/Model/*` files wrongly declare `namespace App\Api\V1\Model` and have 0 importers | read, grep |
| API auth | JWT via `tymon/jwt-auth` 0.5.12, **listed in `require-dev`** yet used at runtime (`Kernel.php:55-56`, 53 `JWTAuth::` calls). HS256, `ttl` 10,080 min (7 d), `refresh_ttl` 40,320 min (28 d), `blacklist_enabled` defaults to false | `composer.json:43`, `config/jwt.php:36,50,64,113` |
| Token refresh | `jwt.refresh` = `App\Http\Middleware\authJWT`: when a token has expired it refreshes it **and only puts the new token on the incoming request; the new token is never returned to the client** | `authJWT.php:30-57` |
| Web auth | Session guard. Roles via Backpack PermissionManager `hasRole()`: `role` middleware sends Admin to `/hq`, other roles away from `/hq`; `manager.only` requires **Business Agent** | `CheckUserRole.php:20-40`, `EnsureManagerRole.php:10-27` |
| Authorization | **0 policies, 0 Gates.** Resource ownership is enforced by hand in queries (`where('user_id', $user->id)`) | grep, canonical trace |
| Admin panel | Backpack CRUD 3.2.27 under `/hq` (144 vendor view overrides) | `routes/web.php:97`, views |
| Web UI | **Blade + AdminLTE + Bootstrap 3 + jQuery 2.2.0, loaded twice** (CDN and a local copy) + jquery.validate, bootstrap-tour, pace, slimscroll, html2canvas; jqWidgets grids (bundled jQuery 1.11.2) | `resources/views/front/layout.blade.php` |
| Manager portal (Business Agent) | **React 18 + Vite 5**, source `resources/manager-portal/` (36 `.jsx`, 22 `.js`) built to `public/js/manager-portal.js` (the built bundle is tracked and currently modified). Calls `/manager/api/*` with session + CSRF through `utils/managerFetch.js` | `vite.config.js`, `managerFetch.js`, `routes/web.php:186-229` |
| Vue | Only Laravel/Passport scaffolding (`resources/assets/js/components/Example.vue`, `passport/*.vue`); `vue` + `@vitejs/plugin-vue2` in devDeps are effectively unused | `git ls-files '*.vue'` |
| DB | MySQL (local `territool_beta`) + MongoDB via Moloquent (`Models/MongoDB/{City,Country,Location}`) | `composer.json`, tree |
| Queue | 9 `ShouldQueue` jobs; `QUEUE_DRIVER=database` locally | `app/Jobs`, Phase 0 |
| Scheduler | `app/Console/Kernel.php` has **no scheduled commands**. Crons are **HTTP GET endpoints** (`routes/web.php:30-35, 84, 86`) | read |
| Observability | Sentry (`sentry-laravel` 2.5.1) + PostHog from `Exceptions/Handler.php:35-46`; 826 `Log::` calls | read, grep |
| Tests | PHPUnit 5.7.27. `tests/ManagerFindLeadsServiceTest.php` (10), `ManagerDashboardFieldSalesScoringTest.php` (5), `ManagerDashboardTerritoryVisitTest.php` (2): no DB; `ExampleTest.php` (1). **No API, controller or feature tests** | `tests/` |
| Lint / static analysis / CI | **None** (no phpstan, psalm, pint, php-cs-fixer, eslint; no CI) | root listing |

---

## 2. Architecture: how a feature is built

### 2.1 Layers as they actually exist

```
routes/web.php  (485 Route:: calls)                      routes/api.php (Dingo v2)
 ├─ top section: public + cron GET + mobilelogin/{token}  ├─ public:            :77-101  (login, signup, webhooks, citysearch…)
 ├─ /hq       [web, role]           → Admin\*              └─ jwt.refresh group: :103-246 (all app features)
 ├─ /manager  [web, auth, manager.only] → ManagerDashboardController → Services/Manager/*
 └─ /         [web, auth, role]     → CompanylController, RoutesController, ContactController, …

MCP modules (service providers, config/app.php:186-189)
 ├─ AdminMcp   /ai/mcp-admin  + /api/mcp/*  internal admin / sales-desk (OAuth or API key)       6,979 lines
 ├─ UserMcp    /ai/mcp        customer MCP "TerriTool App" (Claude/ChatGPT connectors)          11,508 lines
 ├─ FindMcp    /find-mcp/mcp  customer MCP: find leads + contacts, with SKILL.md files           3,167 lines
 ├─ McpClient  salesperson/mcp/*  OUTBOUND: connects HubSpot/Salesforce MCP servers, sync, chat   8,190 lines
 └─ McpOAuth   shared OAuth schema class
```

| Layer | What it holds | Size |
|---|---|---|
| Web controllers | Business logic + queries + rendering, "fat controller" style | 42 files, **35,846 lines**. `CompanylController` 8,509 (its `step2()` alone is 1,032 lines) |
| API V2 controllers | Same, for mobile/MCP | `RouteController` 4,442 · `CompanyController` 3,371 · `ContactSellController` 938 · `AuthController` 920 · `WebhookController` 603 · 5 small |
| Global helpers | Static utility classes used everywhere | `Globals/Helper.php` 4,831 (220 `Helper::` calls) · `Helpers/helpers.php` 1,978 (autoloaded by composer) · `Globals/Routes.php` 1,409 |
| Services (newer code) | Plain classes | `Services/Manager/ManagerDashboardService.php` 3,056 · `ManagerFindLeadsService.php` 2,016 · `UserDataService.php` 990 · `GoogleSheets/GoogleSheetsClient.php` 896 · `ClaudeContactFinder/…Service.php` 509 · 3 small |
| Models | Eloquent, thin (≤ 136 lines each) | 45 + 4 Mongo; 58 relationship definitions |
| Validation | Inline `Validator::make` (97), `$this->validate` (19). **0 FormRequests for the API**; 7 Backpack `*Request` for admin CRUD | grep |
| Response shaping | Hand-built arrays → `response()->json` (654), `json_encode` echo/return (50); **no Transformers or Resources** | grep |
| Jobs / Mail / Events | 9 jobs · 35 mailables · 1 listener (`AfterLoginEvent`) · 0 events · 0 policies | tree |

**Cross-layer coupling:** API controllers import web controllers (`V2/CompanyController.php` uses `App\Http\Controllers\CompanylController`, `RoutesController`, `AILeadFinderController`). Route logic is spread over **six** places: `V2/RouteController`, `RoutesController`, `RouteController`, `AdvancedRouteController`, `SimpleRouteController`, `Globals/Routes.php`.

**Newest code follows a different, better pattern.** The MCP modules and the Manager portal use service classes, service providers, their own config/routes/migrations, and (for Manager services) unit tests.

### 2.2 Canonical example: Activity, server side (pairs with mobile canonical `01-mobile.md` §2)

**A. `POST getUserActivity`** (mobile "Recent")

```
routes/api.php:243  $api->post('getUserActivity', 'App\Api\V2\Controllers\AuthController@getUserActivity')   [jwt.refresh group]
└─ authJWT middleware: parse Bearer JWT → authenticate (refresh if expired, new token NOT returned)   authJWT.php:30-57
   └─ AuthController::getUserActivity(Request $request)                                   V2/AuthController.php:845
      ├─ $user = \Auth::user()                                                            :846
      ├─ scope = strtolower(trim(input('scope','')))                                      :847
      ├─ Activity::where('user_id', $user->id)                  ← ownership scoping       :849
      ├─ 'recent' → latest 5 · 'week' → last 7 days · anything else → ALL rows            :851-860
      ├─ map rows + time_ago                                                               :862-867
      └─ response()->json(['status' => 1, 'message' => '…', 'data' => $data])            :869-873
```

**B. `POST getcompanyactivities`** (mobile "Upcoming")

```
routes/api.php:127 → V2/CompanyController::getCompanyActivities                           V2/CompanyController.php:911
   ├─ $user = $this->currentUser()   (re-parses/refreshes JWT; copy exists in 8 controllers)   :912, :1143-1155
   ├─ \Log::info('getCompanyActivities'.$user->id.' --'.json_encode($request->all()))   ← logs request body   :913
   ├─ Notes::where('user_id', $user->id) [->where('company_id', …)]   ← "activities" live in the Notes model   :916-920
   ├─ ->with(['company' => select id,title withTrashed])            ← eager load (good)        :921-923
   ├─ if limit given: ->limit($limit)                               ← unvalidated request input :924-926
   ├─ 4 cloned queries: today · upcoming · past (unbounded) · dashboard_upcoming             :944-964
   ├─ \Log::info('end getCompanyActivities'.json_encode($this->responseArr))  ← logs the full response  :980
   └─ response()->json($this->responseArr)   status default from private $responseArr    :64, :981
```

Mobile sends `scope=""` and no `company_id` to both (`RecentActivityScreen.js:189, 216`), so **both return the user's entire history** with no upper bound.

**Copy from A:** single responsibility, `\Auth::user()` from the middleware, user-scoped query, `{status, message, data}` envelope.
**Do not copy from B:** logging request bodies and whole responses, unvalidated `limit`, unbounded `past`, per-controller `currentUser()` token handling.

---

## 3. Database

| Topic | Finding | Evidence |
|---|---|---|
| Schema source of truth | **None reproducible.** Only 8 framework/Backpack migrations (2014–2018) + 5 MCP-module migrations (2026). Core tables exist only in `database/webterritool.sql`: a **26 MB phpMyAdmin dump generated 2019-05-24, 37 `CREATE TABLE`s**, last changed 2019-05-28, while the code has 45+ models | `ls database/migrations`, dump header |
| Query style | Mostly query builder: `DB::table` 645 · `::find` 463 · `DB::select/statement/raw/insert/update/delete` 168 · `where/select/orderBy/havingRaw` 103 | grep |
| Relationships / eager loading | 58 relationship definitions; eager loading exists (`->with` 79, `::with` 22) but is not the norm | grep |
| N+1 risk | **139 functions run queries inside loops** (heuristic). Worst: `CompanylController::BulkCompanyError` (9 loops, `:4939`), `SalespersonController::uploadrouts` (7, `:77`), `HubSpotController::sessionCompanyErrorFix` (5, `:2135`), `V2/CompanyController::companyList` (3, `:69`), `Globals/Routes.php::processSmartRoute` (3, `:991`), `RoutesController::saveAdvancedRoute` (3, `:747`), `SfdcController::autoSync` (3, `:314`), `V2/RouteController::bookmarkRouteCompany` (2, `:1216`) | scan |
| Pagination | No standard. `->paginate` 18 (web only), `->take` 128, `->limit` 43, 15 reads of `page/offset/limit` params, **no V2 pagination envelope** | grep |
| Raw SQL with variables | **SQL injection path (probable):** `RoutesController::basic()` takes `$request->all()` → `$start_point = $requestData['startPoint']` (`:1410-1411`) → `saveBasicRoute(…, $start_point, $end_point)` (`:1416`) → `orderByRaw(DB::raw("FIELD(user_companies_session.id," . $start_point . "," . $end_point . ")"))` (`:643`). Same pattern in `saveRoute` (`:852`). Also `V2/RouteController.php:3854` interpolates `$user->id` into `DB::raw` (server value, lower risk) | read |
| Mongo | City/Country/Location via Moloquent (27 refs); `mongobackups/02-09-18/` tracked in git | tree |

---

## 4. API layer (the contract mobile and MCP depend on)

| Aspect | Current behaviour | Evidence |
|---|---|---|
| URL | `{host}/index.php/api/<endpoint>` (mobile `URL_BASE`); Dingo prefix `api`, version `v2`, non-strict | `.env` API_*, mobile `config/index.js:8` |
| Methods | Mostly POST with form fields; some GET; several endpoints registered for both (`citysearch`, `getuseractiveroute`, `getuserdata`, `cancelSubscription`) | `routes/api.php` |
| Auth | `Authorization: Bearer <JWT>`; login at `POST login` (public). Protected endpoints in the `jwt.refresh` group | `routes/api.php:79, 103` |
| Token lifecycle | 7-day TTL; expired tokens are silently refreshed server-side for up to 28 days, **but the client keeps sending the old token**, so after 28 days → 401 → mobile logs the user out. Blacklist off by default, so logout doesn't invalidate a token | `authJWT.php`, `config/jwt.php` |
| Success envelope | `{"status": 1, "message": "...", "data": ...}`, HTTP 200. `status` is int `1` in API code; string `'1'` appears in 6 web files (`CompanylController`, `ContactController`, `HomeController`, `RoutesController`, `TourController`, `Helpers/helpers.php`); `true/false` in 3 web endpoints (`KarmaCrmController:46,53`, `Auth/RegisterController:499-518`, `HubSpotController:87,94` in `saveApiKey`, not the mobile sync APIs) | grep |
| Failure envelope (controller) | HTTP 200 with `status` **0 (int) or "0" (string)** and a message: `status=>0` 127×. Examples: `V2/ProfileController.php:52` `"0"` + first error; `V2/AuthController.php:115-117` `"0"` + generic message + `data: []`; `:759-761` `0` + first error | grep |
| Failure envelope (exceptions) | Dingo `errorFormat` → `{message, errors, code, status_code, debug}` with a real HTTP status. Used for JWT 401s and `ValidationHttpException` (422: `V2/AuthController.php:69, 613, 640, 668`). **This `status_code` body field is what mobile `API.js` reads.** With `API_DEBUG=true`, `debug` includes stack traces | `config/api.php:113-145` |
| Validation error format | **Four shapes** (the two above, "0"/0 with first error or generic text, 422 with `errors[]`) | grep |
| Response data | Raw model arrays + ad hoc keys; no transformers; field naming mixed (`total_contact` vs `contact_count`, see mobile `route/contact/index.js:51-69`) | grep, mobile |
| **Consumers of V2** | (1) **Mobile app**. (2) **UserMcp** and (3) **FindMcp**, which dispatch V2 endpoints internally through Dingo with a minted JWT (`UserMcp/Services/CustomerApiClient.php:9-18, 58-80`). MCP tool definitions reference at least 14 V2 endpoints: `getAILeadsV2`, `resumeAILeadSearch`, `saveAILeads`, `buyContacts`, `fetchAllContacts`, `getusercredit`, `routelist`, `getlist`, `createList`, `getnotes`, `addnote`, `getcompanyactivities`, `addcompanyactivity`, `updatecompanyactivity` | grep `'uri' =>` |
| Web vs API | Web Blade pages **do not** use the API. They have parallel implementations in web controllers (e.g. `routes/web.php` `company/report` → `CompanylController@reportCompany` vs API `reportcompany` → `V2/CompanyController@reportCompany`) → Phase 3 parity | routes |
| Rate limiting | Dingo `throttling` config is empty; whether Laravel's `api` group `throttle:60,1` (`Kernel.php:35-38`) applies to Dingo routes is unverified | config |

---

## 5. Reusability, type discipline, consistency

### 5.1 Duplicates (92 groups of identical function bodies ≥ 8 lines across files)

| Family | Examples (file:line) |
|---|---|
| **Three MCP OAuth stacks** (AdminMcp / UserMcp / FindMcp) | `refreshAccessToken` 49 lines ×3, `validateAuthorizationRequest` 47×3, `matchesLoopbackRedirect` 43×3, `clientAllowsRedirectUri` 31×3, `validateAccessToken` 27×3, `normalizeScopes` 24×3, `validateClientSecret`, `normalizeRedirectUris`, `authorizationErrorResponse`, `invalidateSession`, `stream` ×3; `exchangeAuthorizationCode` 59×2; MCP `handle` 59×2 (`AdminMcp/Http/Controllers/McpHttpController.php:35` ↔ `FindMcp/Http/Controllers/FindMcpHttpController.php:35`); `registerMigrations` ×3 providers; `domainFromWebsite` ×4 |
| **API ↔ web controllers** | `getCityLatLongByAddress` **181 lines** `V2/CompanyController.php:1353` ↔ `RoutesController.php:2986`; `getCompanyFilterByOpenClose` `V2/RouteController.php:4149` ↔ `Globals/Helper.php:3957` |
| **Two helper files** | `deleteDuplicate` `Globals/Helper.php:691` ↔ `Helpers/helpers.php:354` |
| **Route controllers** | `paginate_user_companies` 58 lines `AdvancedRouteController.php:109` ↔ `SimpleRouteController.php:108` |
| **Sales people** | `calculateDistance` `BusinessclientController.php:297` ↔ `SalespersonController.php:230` |
| **`currentUser()` token parse/refresh** | ×8 in V2 controllers (`CityController:64`, `CompanyController:1143`, `ContactSellController:924`, `InviteController:117`, `ListController:272`, `ProfileController:85`, `RouteController:4428`, `SupportController:248`) |
| **Date accessor** | 12-line date formatter ×6 (`Models/{Company,Contacts,LogMeeting,NotesSession,UserNavigateMe}.php`, `BusinesssalespersonController.php:899`) |
| **V1 ↔ V2 (V1 is dead)** | `companyList` 137, `sendIcalEvent` 75, `searchCompany`, `sendAppointmentContact`, `renewToken`, `reset`, `updateVisitedCompany`, `UserRoutes` |
| **UserMcp ↔ FindMcp** | `CustomerApiClient.php` (163 vs 126 lines, diverged), `CustomerAuthenticator.php` (113 lines each, different hashes) |

Very long functions: **21 functions ≥ 300 lines**, e.g. `CompanylController::step2` 1,032 · `::addresserror` 872 · `::BulkCompanyError` 753 · `SalespersonController::uploadrouts` 670 · `SubscriptionController::payment` 504 · `V2/CompanyController::getBizpediaContact` 437 · `CompanylController::buyContacts` 373 · `Jobs/BuyContactsBulkJob::handle` 357.

### 5.2 Type discipline

- `declare(strict_types=1)`: 0 files. Typed parameters: 598 (mostly `Request $request`). Return types: 83 (mostly MCP modules). `@param`: 1,024, `@return`: 814.
- No static analysis. `php -l` clean on PHP 7.4.
- Request input is read untyped and unvalidated in most places: `$request->input/get` 749, `Input::/Request::` facades 291, `$request->all()` 98, against 116 validator calls.

### 5.3 Consistency: where the codebase contradicts itself

| Area | Contradiction | Evidence |
|---|---|---|
| Where logic lives | Fat controllers + 4.8k-line static `Helper` (old) vs service classes with tests (Manager, MCP) | §2 |
| Getting the user in V2 | `\Auth::user()` (middleware-set) vs `$this->currentUser()` re-parsing and refreshing the token | `AuthController.php:846` vs `CompanyController.php:912` |
| Status type | int `1`/`0` vs string `"1"`/`"0"` vs bool | §4 |
| Validation | Dingo exception (422) vs `status "0"` vs `status 0` | §4 |
| Naming | `CompanylController` (typo), `BusinesssalespersonController` (triple s), `ContactSellController`, `getIndutriesType` endpoint, `revenuecate-success`, `upcomimg_dashboard` variable; endpoint URL casing mixed (`getUserActivity`, `getcompanyactivities`, `hubspot-last-sync`, `routeRegenerate/{id}`) | routes, files |
| Vocabulary | "activities" API → `Notes` model; "user activity" → `Activity` model; routes vs `UserRoute` vs `routes_session` → Phase 3 glossary | canonical trace |
| Config access | `env()` used outside config files (breaks `config:cache`): `Globals/Helper.php`, `McpClient/Http/Controllers/SalespersonMcpController.php` (3), `AdminMcp/Services/OAuth/McpOAuthClientService.php`, `AILeadFinderController.php` (2), `Services/Manager/ManagerFindLeadsService.php` | grep |
| HTTP clients | `curl_init` 82 · Ixudra `Curl::to` 10 · Guzzle 4 · `file_get_contents(http…)` 2 | grep |
| Debug output left in | **Active** `dd($exception)` `Globals/Helper.php:685`, `dd($ex->getMessage())` `RouteController.php:1638`, `dd($exception)` `CompanylController.php:5685`, `dump(...)` `CompanylController.php:6644, 6649` | grep (comment lines excluded) |
| Frontend | jQuery loaded twice (2.2.0 CDN + local) vs jqWidgets' jQuery 1.11.2 vs React 18 portal; Bootstrap 3 (AdminLTE) in Blade vs `bootstrap` 5.3.6 in npm devDeps | layout, `package.json` |

### 5.4 Security observations (recorded, not acted on)

- **S10 SQL injection path (probable)**: `RoutesController::basic` → `saveBasicRoute` `orderByRaw` concatenation (§3). Validation between `:1370` and `:1416` not seen; confirm in Phase 5.
- **S11 Hardcoded Google API keys**: 19 in PHP (`Globals/Helper.php:117, 494, 526`; `AILeadFinderController.php:41-42`; `RoutesController.php:1695, 1720, 1749, 1751, 1774, 2664`; `Helpers/helpers.php:83, 542, 726, 728, 810, 919, 1050`; `Services/Manager/ManagerFindLeadsService.php:59`) + 24 in Blade views. Values not copied.
- **S12 Request/response bodies logged**: 10 `Log::…($request->all())` sites, e.g. `V2/CompanyController.php:913`, plus the full response at `:980`.
- **S13 `API_DEBUG=true` locally**: Dingo error bodies then include debug traces. Value on staging/production unknown (QW1).
- **S14 Active `dd()`/`dump()`** in request paths (§5.3).
- **S15** `database/webterritool.sql` (26 MB, 2019) is tracked in git and may contain real data. Not opened.
- **S16** JWT blacklist off by default; logout doesn't revoke tokens.
- Still open from Phase 0: **S5** (`.env` downloadable over the LAN via MAMP) and the committed `.env`.

---

## 6. Comparison with `shoebox/05-standards`

`web-good/` and `web-bad/` are **empty**. The newest code shows where the team is heading: MCP modules (service provider + config + routes + services + migrations, Laravel 5.3-compatible), Manager services with DB-free unit tests, and a React portal with a single fetch wrapper. The rules in §8 follow that direction and freeze the legacy patterns.

---

## 7. Where web and mobile already diverge (input for Phase 3)

- **Success check:** mobile `status == 1` (loose, accepts `"1"`); manager portal `status === 1 || '1'` **or no status at all** (`managerFetch.js`, end of file).
- **Session expiry:** mobile reads the body `status_code` 401/403 (Dingo format); manager portal detects 419/HTML/redirects.
- **Business logic:** the same feature is implemented in web controllers and in V2 API controllers separately (report company, company lists, routes); MCP reuses V2.
- **Roles:** web enforces Admin (`/hq`) and Business Agent (`/manager`) by middleware; mobile only branches on "Business Sales Agent" (`01-mobile.md` §5). Consistent with USER SAID: Admin and Business Agent are web-only.

---

## 8. PROPOSED RULES: for approval

Scope: **new and changed code only** (same as the approved mobile scope; no refactoring of old code). "Codifies" means the team already does this in newer code; "Corrects" means it stops a pattern with evidence of harm.

| # | Rule | Check | Basis |
|---|---|---|---|
| **W1** | New endpoints for mobile/MCP go in `routes/api.php` inside `$api->version('v2')`, **inside the `jwt.refresh` group** unless explicitly public (login/webhook), with the controller in `app/Api/V2/Controllers/`. **Never add to or edit V1.** | New route line within `:103-246`; no diff under `app/Api/V1/` | Codifies |
| **W2** | **V2 response envelope:** success `response()->json(['status' => 1, 'message' => <string>, 'data' => <array\|object>])`; handled failure `['status' => 0, 'message' => <user-safe string>, 'data' => []]` with HTTP 200. `status` is **always an int**, never `"1"`, `"0"` or bool. | grep diff for `'status' =>` values | Codifies the majority + USER SAID "only status: 1" |
| **W3** | **Validate every input first** with `Validator::make($request->all(), [...])`; on failure return the W2 failure with `$validator->errors()->first()`. Cast ids and numbers (`(int)`), whitelist enums, clamp `limit`. Never pass raw request input to `limit()`, `orderByRaw`, `DB::raw`, `whereRaw`, `selectRaw`. | Each new action starts with a validator; no request variable reaches `*Raw`/`limit` uncast | Corrects `getCompanyActivities:914-926`, S10 |
| **W4** | **No string-built SQL.** Raw expressions only with bindings: `whereRaw('x = ?', [$v])`, `DB::select($sql, $bindings)`. | Diff has no `Raw\(`/`DB::raw\(`/`DB::select\(` with `.` concatenation or `"$var"` | Corrects S10 |
| **W5** | **Every query on user data is scoped** to the authenticated user (`where('user_id', $user->id)`). For Business Agent endpoints, also verify the target rep belongs to the manager (`parent_id`). No endpoint returns another user's rows by id alone. | Reviewer checklist: ownership predicate on each query | Codifies `getUserActivity:849` |
| **W6** | In V2, get the user with **`\Auth::user()`** (set by `jwt.refresh`). Don't add another `currentUser()` token-parsing copy or any JWT refresh logic in controllers. | Diff adds no `JWTAuth::parseToken`/`refresh` outside middleware | Codifies `AuthController:846`; corrects 8 copies |
| **W7** | **New business logic lives in a service class** under `app/Services/<Domain>/`, with the controller kept thin (validate → service → envelope). **Never add methods to** `CompanylController`, `Globals/Helper.php`, `Helpers/helpers.php`, `Globals/Routes.php`, and **never call a web controller from an API controller.** | New logic in `app/Services/**`; diff adds no methods to the frozen files; no `use App\Http\Controllers\…` in `app/Api/**` | Codifies Manager/MCP pattern; corrects `V2/CompanyController` imports |
| **W8** | **Service classes ship with DB-free PHPUnit tests** in `tests/<Name>Test.php`, runnable via `vendor/bin/phpunit tests/<Name>Test.php`. | Test file exists and passes | Codifies `tests/ManagerFindLeadsServiceTest.php` (10 tests) |
| **W9** | **The V2 API is a shared contract with mobile, UserMcp and FindMcp.** Before changing any V2 endpoint, check all consumers (mobile `App/config/index.js` + call sites; `'uri' =>` in `app/UserMcp`, `app/FindMcp`). Changes must be **additive only**: add optional fields; never rename or remove a request/response field, change a type, or change `status` semantics. There is no minimum app version, so old apps keep calling. | Consumer grep in change summary; no removed or renamed keys in diff | USER SAID Q5; §4 consumers |
| **W10** | **Bounded lists.** Every new list endpoint accepts a validated `limit` (default + max, e.g. ≤ 100) and `page` or a date window; no unbounded `->get()` on history-like tables (activity, notes, visits, notifications). | New list queries have `limit`/`take` + bound | Corrects both canonical endpoints returning full history |
| **W11** | **No N+1 in new code.** Load relations with `->with()` or batch `whereIn` before loops; no `DB::`/`::where`/`::find` calls inside `foreach`/`for`/`while`. | Scan heuristic shows 0 new loop-queries | Corrects 139 flagged functions |
| **W12** | **External calls and errors:** wrap third-party calls (Google, Gemini/Claude, Apollo, Cognism, FullEnrich, HubSpot, Salesforce, Stripe, PayPal, RevenueCat) in try/catch. Report unexpected exceptions with `app('sentry')->captureException($e)` (or rethrow to `Handler`) and return a W2 failure. **No empty catch.** | Diff: every external call wrapped; no `catch (...) {}` | Corrects |
| **W13** | **Logs never contain request bodies, responses, passwords, tokens, API keys or contact PII.** Log ids and event names only. | Diff has no `Log::` with `$request->all()`, `json_encode($response…)`, `password`, `token` | Corrects S12 |
| **W14** | **No debug output** in app code: no `dd`, `dump`, `var_dump`, `print_r`, `exit`, `die`. | grep diff = 0 | Corrects S14 |
| **W15** | **Config and secrets:** settings read via `config('…')` backed by `.env`; **`env()` only inside `config/*.php` or a module's `config/` directory**; never hardcode API keys or URLs to paid APIs. When a new key is needed, add it to a config file and tell the user which env var to set on **staging**. | Diff has no `env(` outside config dirs and no key-like literals (`AIza…`, `sk_…`) | Corrects S11, §5.3 |
| **W16** | **Schema changes only through migrations** (`database/migrations/` or a module's `database/migrations/`), each with a working `down()`. Never rely on or edit `database/webterritool.sql`. Run on local/staging only, **never production**. | Migration file present and reversible; no SQL dump edits | Corrects §3; hard rule |
| **W17** | **Compatibility: PHP 7.4 + Laravel 5.3.31.** No PHP 8 syntax (`?->`, `match`, named args, promoted constructor properties, union/`mixed` types). No Laravel ≥ 5.4 APIs (`$request->validate()`, API Resources, `Http::` client, array-callable route actions, `Route::view`). | `php -l` on PHP 7.4 passes; grep diff for `?->`, `match (`, `$request->validate(` | Codifies MCP route comments ("Laravel 5.3 has no array-callable…") |
| **W18** | **Web routes and roles:** new pages go in the matching group in `routes/web.php`: `/hq` (Admin, `role`), `/manager` (`auth` + `manager.only`, Business Agent), `/` (`auth` + `role`). Nothing new in the unauthenticated top section without explicit approval. Role checks use the existing middleware, not ad-hoc `hasRole` in views. All POSTs carry CSRF. | Route line inside a group; middleware present | Codifies `routes/web.php:97, 186, 230` |
| **W19** | **New UI:** Business Agent (Manager) features are React components in `resources/manager-portal/`, calling `/manager/api/*` only via `utils/managerFetch.js`. Source and rebuilt `public/js/manager-portal.js` change together (`npm run build`). Other web UI extends `front/layout.blade.php` using the already-loaded jQuery/Bootstrap 3. **No new frontend library** (no new jQuery/Bootstrap versions, Vue or CSS frameworks), and **no new inline `<script>`/`<style>` blocks in Blade.** | Diff location + no new `<script>`/`<style>` in `.blade.php` + no new `package.json` deps | Codifies manager portal; corrects `findleads.blade.php` (5,909 lines) |
| **W20** | **MCP modules and forks:** new customer MCP tools **reuse V2 endpoints via `CustomerApiClient`** instead of reimplementing logic, and document credit cost like `FindMcp/README.md`. A fix to a duplicated function must be applied to every copy in the same change (MCP OAuth ×3 across AdminMcp/UserMcp/FindMcp; `getCityLatLongByAddress`; `deleteDuplicate`; `getCompanyFilterByOpenClose`; `paginate_user_companies`; `calculateDistance`; UserMcp ↔ FindMcp `CustomerApiClient`/`CustomerAuthenticator`). V1 copies are dead and are not edited. | Duplicate-scan groups touched together | Codifies `CustomerApiClient.php:9-18`; mirrors mobile M11 |

## 9. DECISIONS NEEDED (the user's call)

| # | Decision | Options | Recommendation |
|---|---|---|---|
| **DW1** | Validation/handled-failure format for new V2 endpoints | (a) HTTP 200 `{status: 0, message, data: []}`; (b) Dingo `ValidationHttpException` → HTTP 422 `{message, errors, status_code}` | **(a)**. It's the majority today, mobile handles it via M3, and MCP decodes it simply |
| **DW2** | API V1 | (a) treat as dead code (routes are commented out) and never edit; (b) V1 is still used somewhere I can't see | **(a)**, unless you know of a consumer (see QW-V1) |
| **DW3** | Home for new Business Agent UI | (a) React manager portal; (b) Blade | **(a)** |
| **DW4** | Home for new server logic | (a) `app/Services/<Domain>/` + DB-free tests; (b) keep adding to controllers/`Helper` | **(a)** |
| **DW5** | Rule scope | new/changed code only (same as mobile D5) | **Same as mobile**: new code only, old code untouched |

## 10. OPEN QUESTIONS (need the user)

- **QW-V1** You said "both APIs V1 and V2", but **every V1 route in `routes/api.php:22-71` is commented out**, so no request can reach V1 today. Is V1 served from somewhere else (another server or branch), or is V1 effectively gone?
- **QW1** Which **PHP version** do staging and production run, and is **`API_DEBUG`** true there? (If true, error responses include stack traces.)
- **QW2** Are staging/production deployed with `composer install --no-dev`? `tymon/jwt-auth` is in `require-dev` but API auth depends on it.
- **QW3** What calls the **cron GET URLs** (`cron/*`, `businessClientUpdateCron`, `routenotifycron`)? An external scheduler? `app/Console/Kernel.php` schedules nothing.
- **QW4** Does a **queue worker** run on staging/production for the 9 queued jobs (bulk contact buying, Google Sheets, welcome emails, trial nudges)?
- **QW5** **JWT refresh:** expired tokens are refreshed server-side but the new token is never sent back, so mobile users are forced to log in again ~28 days after login. Is that intended?
- **QW6** Does `database/webterritool.sql` (26 MB, 2019) contain **real customer data**? I haven't opened it and won't.

---

## 11. APPROVAL RECORD (USER SAID, 2026-09-15)

- **Rules W1–W20:** approved together with the decisions (no objection raised).
- **DW1: APPROVED (a).** Handled failures return HTTP 200 `{status: 0, message, data: []}`. The user added "okay don't change it": existing behaviour stays as it is.
- **DW2: APPROVED.** V1 is dead code.
- **DW3: APPROVED.** New Business Agent (Manager) UI goes in the React manager portal.
- **DW4: APPROVED.** New server logic goes in `app/Services/<Domain>/` with DB-free tests.
- **DW5: "all code".** ⚠ **Ambiguous.** Interpreted as "same scope for all code on both platforms: rules govern new code; old code untouched", consistent with the explicit Phase 1 instruction "do not touch the old code". **Pending user confirmation.** Until confirmed, old code is NOT refactored.
- **QW-V1:** V1 is gone. **Do not delete or modify it; ignore it.**
- **QW1:** User says staging/production run **"5.something"** and **`API_DEBUG` is off** there. ⚠ **Conflict:** `composer.json`/`composer.lock` require PHP `^7.2`, and the code uses PHP 7-only syntax (§12). Possibly Laravel 5.3 was meant. **Pending confirmation** (e.g. `php -v` on staging). Rule W17 (PHP 7.4-compatible) stands until then.
- **QW2:** "yes" to "deployed with `composer install --no-dev`". ⚠ **Conflict:** `tymon/jwt-auth` (in `require-dev`) is required at runtime for API auth, so a `--no-dev` install would break the API. **Pending confirmation** of how `vendor/` reaches the servers (§12).
- **QW3:** The cron GET URLs drive **payments and credit renewal/updates**. They are payment-critical and become fragile-area / BLOCKER candidates.
- **QW4:** Queue worker on staging/production: **not answered yet**.
- **QW5:** Forced re-login ~28 days after login is **intended**.
- **QW6:** `database/webterritool.sql` contains **no real customer data**.
- Still open from Phase 1: whether the Q-M3 "Yes" means "offline route support dropped on purpose".

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (69)

**Documents (13):** [[brain/context/api-map|API map: every V2 endpoint, who calls it, and how it behaves]] · [[brain/context/architecture|Architecture: how Territool is built, end to end]] · [[brain/audits/01-mobile|Audit 1 – mobile app review]] · [[brain/audits/03-parity|Audit 3 – mobile vs web]] · [[CLAUDE-CODE-BOOTSTRAP|Claude Code Bootstrap Prompt]] · [[brain/context/design-assets|Design files & asset rules]] · [[shoebox/07-flows/flows|Original flow descriptions]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/conventions-shared|Rules for all code]] · [[brain/context/stack|Tech setup & environments]] · [[brain/memory/entries/question/20260917-48ae28-u-api-04-whether-laravel-s-throttle-60-1-applies|U-API-04 — Whether Laravel's throttle:60,1 applies to Dingo routes]] · [[brain/context/UNKNOWN_REGISTER|Unknown register: what the brain does not know yet]] · [[brain/context/conventions-web|Web app coding rules]]

**Coding rules (28):** [[_id/W20|AI connectors reuse the API]] · [[_id/W9|API changes only add, never remove]] · [[_id/W2|API status is 1 or 0]] · [[_id/DW2|API V1]] · [[_id/W7|Business logic in services]] · [[_id/W3|Check input first]] · [[_id/M11|Fix every copy of duplicated code]] · [[_id/W6|Get the user safely]] · [[_id/W12|Handle outside services safely]] · [[_id/DW3|Home for new Business Agent UI]] · [[_id/DW4|Home for new server logic]] · [[_id/W10|Limit list sizes]] · [[_id/W1|New API routes in version 2]] · [[_id/D5|New code only]] · [[_id/W4|No database queries built from text]] · [[_id/W11|No database queries in loops]] · [[_id/W14|No debug output]] · [[_id/W19|No inline scripts; portal via React]] · [[_id/W13|No secrets in logs]] · [[_id/W5|Only the user's own data]] · [[_id/W16|Reversible database changes]] · [[_id/DW5|Rule scope]] · [[_id/W15|Settings only in config]] · [[_id/M3|Success only when status is 1]] · [[_id/W8|Tests for new services]] · [[_id/DW1|Validation/handled-failure format for new V2 endpoints]] · [[_id/W18|Web routes in the right group]] · [[_id/W17|Works on PHP 7.4]]

**Owner decision (1):** [[_id/Q-M3|Question: were offline routes dropped on purpose?]]

**Code files (27):** [[_code/web/app/Http/Controllers/AdvancedRouteController.php|AdvancedRouteController]] · [[_code/web/app/Http/Controllers/AILeadFinderController.php|AILeadFinderController]] · [[_code/mobile/App/utils/API.js|API.js]] · [[_code/web/app/Api/V2/Controllers/AuthController.php|AuthController]] · [[_code/web/app/Http/Controllers/BusinessclientController.php|BusinessclientController]] · [[_code/web/app/Http/Controllers/BusinesssalespersonController.php|BusinesssalespersonController]] · [[_code/web/app/Api/V2/Controllers/CompanyController.php|CompanyController]] · [[_code/web/app/Http/Controllers/CompanylController.php|CompanylController]] · [[_code/mobile/App/config/index.js|config/index.js]] · [[_code/mobile/App/components/route/contact/index.js|contact/index.js]] · [[_code/web/app/UserMcp/Services/CustomerApiClient.php|CustomerApiClient]] · [[_code/web/app/FindMcp/Http/Controllers/FindMcpHttpController.php|FindMcpHttpController]] · [[_code/web/app/Services/GoogleSheets/GoogleSheetsClient.php|GoogleSheetsClient]] · [[_code/web/app/Globals/Helper.php|Helper]] · [[_code/web/app/Helpers/helpers.php|helpers]] · [[_code/web/app/Services/Manager/ManagerDashboardService.php|ManagerDashboardService]] · [[_code/web/app/Services/Manager/ManagerFindLeadsService.php|ManagerFindLeadsService]] · [[_code/web/app/AdminMcp/Http/Controllers/McpHttpController.php|McpHttpController]] · [[_code/web/app/AdminMcp/Services/OAuth/McpOAuthClientService.php|McpOAuthClientService]] · [[_code/mobile/App/components/dashboard/RecentActivityScreen.js|RecentActivityScreen.js]] · [[_code/web/app/Api/V2/Controllers/RouteController.php|RouteController]] · [[_code/web/app/Globals/Routes.php|Routes]] · [[_code/web/app/Http/Controllers/RoutesController.php|RoutesController]] · [[_code/web/app/Http/Controllers/SalespersonController.php|SalespersonController]] · [[_code/web/app/McpClient/Http/Controllers/SalespersonMcpController.php|SalespersonMcpController]] · [[_code/web/app/Http/Controllers/SimpleRouteController.php|SimpleRouteController]] · [[_code/web/app/Services/UserDataService.php|UserDataService]]

%% brain-links:end %%
