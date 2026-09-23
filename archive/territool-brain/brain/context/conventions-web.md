---
area: context
tags: [brain/context]
ref: "Web app coding rules"
---

# Territool — Web Conventions (platform adapter: Laravel 5.3 + Blade + React portal + MCP)

Applies to `repos/web` (Laravel **5.3.31**, PHP 7.4-compatible). **New and changed code only** (S0.2).

Shared rules in `conventions-shared.md` always apply first. Source of every rule: `brain/audits/02-web.md` (approved §11) unless noted.

## 1. Surfaces and who uses them

| Surface | Path | Users | Source |
|---|---|---|---|
| Mobile/MCP API (Dingo **v2**) | `routes/api.php:75-247` → `app/Api/V2/Controllers/*` | mobile (Sales Agent, Business Sales Agent), UserMcp, FindMcp | A2 §4 |
| User web app (Blade/AdminLTE/Bootstrap 3/jQuery) | `routes/web.php` `/` group `[web, auth, role]` → `app/Http/Controllers/*`, `resources/views/front/**` | Sales Agent, Business Sales Agent (and Business Agent outside the portal) | A2 §2.1 |
| Manager portal (React 18 + Vite) | `/manager` `[web, auth, manager.only]` → `Manager/ManagerDashboardController`, `Services/Manager/*`, `resources/manager-portal/*` → `public/js/manager-portal.js` | **Business Agent** | A2 §1 |
| Admin HQ (Backpack) | `/hq` `[web, role]` → `Admin/*` | **Admin** | A2 §1 |
| Crons | GET `cron/*`, `businessClientUpdateCron`, `routenotifycron` | external scheduler: **payments and credit renewal** (USER SAID) | A2 §11 |
| MCP | `app/UserMcp`, `app/FindMcp`, `app/AdminMcp`, `app/McpClient`, `app/McpOAuth` | Claude/ChatGPT connectors; salesperson MCP chat/sync | A2 §2.1 |

## 2. Canonical examples

**A. API endpoint:** `app/Api/V2/Controllers/AuthController.php::getUserActivity` (`:845-875`):
- `\Auth::user()` set by `jwt.refresh`
- user-scoped Eloquent query
- `{status: 1, message, data}`

**Don't copy from `V2/CompanyController.php::getCompanyActivities` (`:911-982`):**
- request/response body logging (`:913`, `:980`)
- unvalidated `limit` (`:924-926`)
- unbounded `past` query
- `currentUser()` token parsing

**B. New server logic:** `app/Services/Manager/ManagerFindLeadsService.php` + `tests/ManagerFindLeadsServiceTest.php` (10 DB-free tests), called from a thin controller (`Http/Controllers/Manager/ManagerDashboardController.php`).

**C. New MCP tool:** reuse V2 through `UserMcp/Services/CustomerApiClient.php` (`:9-18`); document credit cost like `FindMcp/README.md`.

**D. New Business Agent UI:** React component in `resources/manager-portal/`, fetch via `utils/managerFetch.js`, rebuild `npm run build` → `public/js/manager-portal.js`.

## 3. Rules W1–W20 (approved)

| # | Rule | Check |
|---|---|---|
| W1 | New mobile/MCP endpoints go in `routes/api.php` inside `$api->version('v2')` and the **`jwt.refresh` group** (unless explicitly public); controllers in `app/Api/V2/Controllers/`. **Never add to or edit V1** | static-checks `W1` (any diff under `app/Api/V1/`); review route placement |
| W2 | Envelope: success `['status' => 1, 'message', 'data']`; handled failure HTTP 200 `['status' => 0, 'message', 'data' => []]`; `status` always int | static-checks `W2` |
| W3 | Validate every input first with `Validator::make($request->all(), […])`; failure → W2 with `$validator->errors()->first()`; cast ids/numbers, whitelist enums, clamp `limit`; request input never reaches `limit()`/`*Raw`/`DB::raw` uncast | review |
| W4 | **No string-built SQL**; raw expressions only with bindings | static-checks `W4` |
| W5 | Scope every query on user data to `$user->id` (Business Agent: verify rep `parent_id`) | review |
| W6 | In V2 get the user with **`\Auth::user()`**; no new `currentUser()` / `JWTAuth::parseToken()` / `refresh` in controllers | static-checks `W6` |
| W7 | New business logic in **`app/Services/<Domain>/`**, thin controllers. **Frozen files: never add methods** to `CompanylController.php`, `app/Globals/Helper.php`, `app/Helpers/helpers.php`, `app/Globals/Routes.php`. **Never call web controllers from API controllers** | static-checks `W7-frozen`, `W7-layer` |
| W8 | Service classes ship with **DB-free PHPUnit tests** `tests/<Name>Test.php` | `vendor/bin/phpunit tests/<Name>Test.php` passes |
| W9 | **The V2 contract is shared with mobile + UserMcp + FindMcp:** additive only; list consumers before changing | review + API contract suite |
| W10 | New list endpoints: validated `limit` (default + max ≤ 100) and `page` or date window; no unbounded history queries | review |
| W11 | No N+1 in new code: `->with()` / batched `whereIn` | review |
| W12 | Wrap third-party calls (Google, Gemini/Claude, Apollo, Cognism, FullEnrich, HubSpot, Salesforce, Stripe, PayPal, RevenueCat) in try/catch; report via `app('sentry')->captureException($e)`; return W2 failure; no empty catch | review |
| W13 | Logs never contain request bodies, responses, passwords, tokens, API keys or contact PII | static-checks `W13` |
| W14 | No `dd`, `dump`, `var_dump`, `print_r`, `exit`, `die` | static-checks `W14` |
| W15 | Config via `config('…')` backed by `.env`; `env()` only inside `config/` or a module's `config/`; no hardcoded API keys/paid-API URLs; tell the user which env var to set on **staging** | static-checks `W15-env`, `W15-secret` |
| W16 | Schema changes only via reversible migrations (`database/migrations/` or module `database/migrations/`); run on local/staging only | review |
| W17 | **PHP 7.4 + Laravel 5.3.31:** no `?->`, `match`, named args, promoted constructor properties, union/`mixed`, attributes; no `$request->validate()`, API Resources, `Http::` client, array-callable routes, `Route::view` | `php -l` (PHP 7.4) + static-checks `W17` |
| W18 | New web routes inside the right group: `/hq` (Admin), `/manager` (`manager.only`), `/` (`auth` + `role`); nothing new in the unauthenticated top section without approval; CSRF on POST | review route diff |
| W19 | New Business Agent UI → React portal via `managerFetch.js`, rebuild bundle with source; other UI extends `front/layout.blade.php`; **no new frontend libraries**; **no new inline `<script>`/`<style>` in Blade** | static-checks `W19` |
| W20 | New customer MCP tools reuse V2 via `CustomerApiClient`; fixes to duplicated functions go to every copy (§5) | review with §5 |

**Approved decisions** (A2 §11):
- **DW1:** handled failure = HTTP 200 `status 0`; don't change existing behaviour.
- **DW2:** V1 dead.
- **DW3:** Business Agent UI in the React portal.
- **DW4:** `app/Services/<Domain>/` + DB-free tests.
- **DW5:** new code only.

**Added by design approval** (A4 §10–§11):
- DIN only (new `tt-tokens.css` declares its own `@font-face` for `/fonts/DinBold.ttf`, `/fonts/DinLight.ttf`).
- Portal new screens stop using DM Sans / Space Grotesk.
- **Below 768 px the portal must provide a menu button / drawer.**

## 4. Reuse inventory

| Need | Use | Path |
|---|---|---|
| Current user in V2 | `\Auth::user()` | `V2/AuthController.php:846` |
| Call V2 from MCP | `CustomerApiClient::callFromDefinition` / `call` | `UserMcp/Services/CustomerApiClient.php`, `FindMcp/Services/CustomerApiClient.php` |
| Manager find-leads logic | `ManagerFindLeadsService` | `app/Services/Manager/` |
| Manager dashboard metrics | `ManagerDashboardService` | `app/Services/Manager/` |
| User data export (MCP/app) | `UserDataService` | `app/Services/UserDataService.php` |
| Claude contact lookup | `ClaudeContactFinderService` | `app/Services/ClaudeContactFinder/` |
| Google Sheets sync | `GoogleSheetsClient`, `GoogleSheetsJob` | `app/Services/GoogleSheets/`, `app/Jobs/` |
| Activity note types | `ActivityNoteType` | `app/Support/ActivityNoteType.php` |
| UTF-8 sanitising | `Utf8Sanitizer` | `app/Support/Utf8Sanitizer.php` |
| Portal fetch + toasts | `managerFetch`, `showToast` | `resources/manager-portal/utils/managerFetch.js`, `utils/toast.js` |
| Error reporting | `app/Exceptions/Handler.php` (Sentry + PostHog) | — |

(Legacy `Helper::` static methods exist for geocoding, AI lead saving and contact finders. Calling an existing one is allowed; **adding** to `Helper.php` is not: W7.)

## 5. Fork families

| Family | Copies | Source |
|---|---|---|
| MCP OAuth stack | `AdminMcp/Services/OAuth/*` ↔ `UserMcp/Services/OAuth/App*` ↔ `FindMcp/Services/OAuth/Find*` (+ authorize controllers, `stream`, `registerMigrations`) | A2 §5.1 |
| MCP customer clients | `UserMcp/Services/CustomerApiClient.php` ↔ `FindMcp/Services/CustomerApiClient.php`; `CustomerAuthenticator.php` pair | A2 §5.1 |
| Geocoding | `V2/CompanyController::getCityLatLongByAddress` (`:1353`) ↔ `RoutesController::getCityLatLongByAddress` (`:2986`) | A2 §5.1 |
| Helpers | `Globals/Helper.php::deleteDuplicate` (`:691`) ↔ `Helpers/helpers.php::deleteDuplicate` (`:354`); `V2/RouteController::getCompanyFilterByOpenClose` (`:4149`) ↔ `Helper::getCompanyFilterByOpenClose` (`:3957`) | A2 §5.1 |
| Routes pagination | `AdvancedRouteController::paginate_user_companies` ↔ `SimpleRouteController::paginate_user_companies` | A2 §5.1 |
| Distance | `BusinessclientController::calculateDistance` ↔ `SalespersonController::calculateDistance` | A2 §5.1 |
| `currentUser()` | 8 V2 controllers | A2 §5.1 |
| V1 ↔ V2 | **don't edit V1** (dead) | USER SAID |

## 6. Traps

| Trap | Detail | Source |
|---|---|---|
| Laravel 5.3 | Docs for 5.4+ don't apply; route actions are `'Controller@method'` strings | A2 §1 |
| Dingo errors | Exceptions become `{message, status_code, …}` (what mobile `API.js` reads) | `config/api.php:140-145` |
| JWT refresh | `authJWT` refreshes but doesn't return the new token (intended 28-day re-login) | `authJWT.php:30-57`; USER SAID |
| `jwt-auth` in `require-dev` | `composer install --no-dev` would break API auth (BT-9) | `composer.json:43` |
| API → web controller coupling | `V2/CompanyController` and `ContactSellController` call `CompanylController` (buy/report contacts); `SubscriptionController` references `RoutesController`. A web change can break mobile/MCP and billing | A3 P9; A5 §4.2 |
| Webhooks | `V2/WebhookController.php` handles Apollo/FullEnrich/RevenueCat (21 fix commits, reverts): BLOCKER F15/F03/F04 | A5 §4.2 |
| Status types | Legacy endpoints mix `1`/`"1"`/`true`; don't "fix" them (DW1) | A3 P10 |
| SQL injection path | `RoutesController::basic` → `saveBasicRoute` `orderByRaw` concat (don't copy; fix only when tasked) | A2 §3 |
| Validation drift | Company/contact/register/activity/list rules differ per surface | A3 P2–P7 |
| Built bundle | `public/js/manager-portal.js` is tracked and must be rebuilt with portal source changes | A2 §1 |
| DIN font | Loaded via vendor `AdminLTE.min.css`; new pages must not rely on the vendor file | A4 §10 |
| Local env | Local `.env` points `APP_URL` at staging; local MAMP exposes the repo directory over LAN (S5) | A0 §13 |
| Date formats | DD/MM and MM/DD both in use; new code uses D-DS7 month-name formats | A4 §11.2 |

## 7. Commands

| Purpose | Command (run from `territool-brain/`) |
|---|---|
| Static gate on current changes | `node brain/gates/scripts/static-checks.js --repo web` |
| PHP syntax (7.4) | `php -l <file>` |
| Unit tests | `cd repos/web && vendor/bin/phpunit tests/<Name>Test.php` |
| Portal build (only inside a task) | `cd repos/web && npm run build` |
| Web screenshots (staging, read-only) | `cd tools && PLAYWRIGHT_BROWSERS_PATH=$PWD/ms-playwright node capture-web.js` |
| Regenerate PHP graph | `node brain/audits/data/phpgraph.js repos/web brain/audits/data/web-graph.json` |

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (61)

**Documents (15):** [[brain/context/api-map|API map: every V2 endpoint, who calls it, and how it behaves]] · [[brain/audits/00-inventory|Audit 0 – what exists]] · [[brain/audits/02-web|Audit 2 – web app review]] · [[brain/audits/03-parity|Audit 3 – mobile vs web]] · [[brain/audits/04-design|Audit 4 – design review]] · [[brain/audits/05-testing|Audit 5 – testing plan]] · [[_code/brain/brain/gates/scripts/static-checks.js|Automatic code checker]] · [[brain/README|brain/ - GENERATED OUTPUT. Do not hand-edit during build.]] · [[CLAUDE-CODE-BOOTSTRAP|Claude Code Bootstrap Prompt]] · [[brain/context/known-fragile|Known problems & risky areas]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/conventions-shared|Rules for all code]] · [[brain/skills/territool-code/SKILL|Skill – writing code]] · [[_code/brain/tools/capture-web.js|Tool – take web screenshots]] · [[workspace/handoff/2026-09-17-company-details-web/result|Web Company Details UI — handoff]]

**Product features (3):** [[_id/F15|Find & buy contacts]] · [[_id/F03|Subscription / paywall / upgrade / cancel / credits…]] · [[_id/F04|Subscription & credit renewal]]

**Coding rules (26):** [[_id/W20|AI connectors reuse the API]] · [[_id/W9|API changes only add, never remove]] · [[_id/W2|API status is 1 or 0]] · [[_id/DW2|API V1]] · [[_id/W7|Business logic in services]] · [[_id/S0.2|Change new code only]] · [[_id/W3|Check input first]] · [[_id/W6|Get the user safely]] · [[_id/W12|Handle outside services safely]] · [[_id/DW3|Home for new Business Agent UI]] · [[_id/DW4|Home for new server logic]] · [[_id/W10|Limit list sizes]] · [[_id/W1|New API routes in version 2]] · [[_id/W4|No database queries built from text]] · [[_id/W11|No database queries in loops]] · [[_id/W14|No debug output]] · [[_id/W19|No inline scripts; portal via React]] · [[_id/W13|No secrets in logs]] · [[_id/W5|Only the user's own data]] · [[_id/W16|Reversible database changes]] · [[_id/DW5|Rule scope]] · [[_id/W15|Settings only in config]] · [[_id/W8|Tests for new services]] · [[_id/DW1|Validation/handled-failure format for new V2 endpoints]] · [[_id/W18|Web routes in the right group]] · [[_id/W17|Works on PHP 7.4]]

**Owner decisions (2):** [[_id/BT-9|Login library must ship with the app]] · [[_id/D-DS7|Standard date formats]]

**Code files (15):** [[_code/web/app/Support/ActivityNoteType.php|ActivityNoteType]] · [[_code/mobile/App/utils/API.js|API.js]] · [[_code/web/app/Api/V2/Controllers/AuthController.php|AuthController]] · [[_code/web/app/Api/V2/Controllers/CompanyController.php|CompanyController]] · [[_code/web/app/Http/Controllers/CompanylController.php|CompanylController]] · [[_code/web/app/UserMcp/Services/CustomerApiClient.php|CustomerApiClient]] · [[_code/web/app/FindMcp/Services/CustomerApiClient.php|CustomerApiClient]] · [[_code/web/app/Globals/Helper.php|Helper]] · [[_code/web/app/Helpers/helpers.php|helpers]] · [[_code/web/app/Http/Controllers/Manager/ManagerDashboardController.php|ManagerDashboardController]] · [[_code/web/app/Services/Manager/ManagerFindLeadsService.php|ManagerFindLeadsService]] · [[_code/web/app/Globals/Routes.php|Routes]] · [[_code/web/app/Services/UserDataService.php|UserDataService]] · [[_code/web/app/Support/Utf8Sanitizer.php|Utf8Sanitizer]] · [[_code/web/app/Api/V2/Controllers/WebhookController.php|WebhookController]]

%% brain-links:end %%
