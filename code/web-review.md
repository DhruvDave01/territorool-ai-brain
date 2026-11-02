# Web code review

Reviewed 2026-09-22 by reading `/Users/dhruvdave/Dhurv/Project_TerriTool/Territool_web/webterritool`. Read again on 2026-11-02 from `origin/master` `d3f75449` (production) and `origin/beta_react` `929f0c7f` (development) ([review](../reviews/live-code-2026-11-02.md)); facts are for `master` unless a line names `beta_react`. When this page and that tree disagree, the tree wins. Hub: [web code brain](../brains/web-code.md). Pixels: [web design](../brains/web-design.md).

## Lockfile

`composer.lock` name `laravel/framework` version **v5.3.31** (around the laravel/framework package entry). `composer.json` says `"php": "^7.2"` and `"laravel/framework": "^7.0|5.3.31"`. Write PHP 7.2. Do not add scalar type hints that 7.2 rejects in a way the file’s neighbors don’t already use, and do not use PHP 8 or Laravel 8+ APIs.

API package in use: Dingo (`dingo/api` 1.0) in `routes/api.php`.

Sentry: `sentry/sentry-laravel` 2.5.1 and `sentry/sentry` 3.2.1 (`composer.json:32` asks for `^2.5`). Settings and the PostHog split between `master` and `beta_react`: [web code brain](../brains/web-code.md#error-reporting).

## How to add a classic page

1. Add the route in `routes/web.php` inside `Route::group(['prefix' => '/', 'middleware' => ['web', 'auth','role']], ...)`.
2. Put the method on the controller that already owns that noun. Companies and uploads go to `CompanylController` (spelled with the extra l).
3. Blade extends `front.layout`. Copy the sibling view’s sections, grid, and AJAX `FormData` call.
4. Stay on Bootstrap 3.3.5 and jQuery 2.2.0. Do not import the manager CSS.

## How to add a manager page

1. Add the route in the group at `routes/web.php` lines that set `'prefix' => 'manager'` and `'middleware' => ['web', 'auth', 'manager.only']`.
2. Controller under `app/Http/Controllers/Manager/`.
3. If the page is an island, add a JSX file in `resources/manager-portal/` and mount it from `main.jsx` the same way `ManagerDashboard`, `AIFindLeadsPage`, `Salespeople`, `ManagerActivity`, `ManagerSettings`, and the support screens are mounted.
4. Style with variables already in `public/css/manager-portal.css` (`--blue`, `--teal`, `--radius`). Do not add a new primary blue.

`main.jsx` reads JSON from a script tag via `readJsonScript` and uses `react-dom/client` `createRoot`. Follow that mount style.

## How to add a mobile endpoint

1. Add it inside `$api->version('v2')` in `routes/api.php`.
2. If the phone must be logged in, put it in the `jwt.refresh` group.
3. Implement in `app/Api/V2/Controllers/`.
4. Add a constant in `TerriTool/App/config/index.js` and call it with `API.post` and FormData. Do not return a different shape than the sibling endpoint.

The v1 block in `routes/api.php` is commented out. Leave it commented.

## Controllers that already own the nouns

| Noun | Controller |
|---|---|
| Companies, uploads, address errors | `CompanylController.php` |
| Contacts, contact CSV | `ContactController.php` |
| Lists | `ListController.php` |
| Routes | `RouteController.php`, `RoutesController.php`, `SimpleRouteController.php`, `AdvancedRouteController.php` |
| Classic Find Leads | `AILeadFinderController.php` |
| Home / dashboard, and `/reviews/credits` | `HomeController.php` (`dashboard`, `reviewCredits`, `recordReviewCredits`) |
| Subscription | `SubscriptionController.php` |
| Support | `SupportController.php` |
| Manager cockpit | `app/Http/Controllers/Manager/ManagerDashboardController.php` |
| HQ | `app/Http/Controllers/Admin/` |
| HQ demo data | `Admin/ManagerDemoDataController.php`, `GET /hq/demo-data?email=` (`routes/web.php:115`). Warning: Admin-only, but it rewrites dates and deletes visit history for one manager's whole team in one transaction, with no confirmation and no environment check, and it is live on `master`. [17 — Admin HQ](../features/17-Admin-HQ.md). |
| Cron | `CronController.php`. Every cron is a public GET in `routes/web.php`; `app/Console/Kernel.php:25-29` `schedule()` is empty. `cron/paid-api-usage` (`routes/web.php:46`, `beta_react` only, `dc07b901`) runs `paidApiUsageReport` (`:732-762`), which counts yesterday's paid API calls from `storage/logs/laravel-<date>.log` with `app/Services/PaidApiUsageReport.php` and mails `app.support_email_1`. That file exists only when `APP_LOG` is `daily`; `config/app.php:124` defaults to `single`. |
| Google Calendar | `GoogleCalendarController.php` (web connect, callback, sync), `app/Api/V2/Controllers/GoogleCalendarController.php` (`store`, `sync`), `app/Services/GoogleCalendarSync.php`, `app/Models/GoogleCalendarConnection.php`, `GoogleCalendarEventMap.php`, `config/google_calendar.php` (`GOOGLE_CALENDAR_CLIENT_ID`, `GOOGLE_CALENDAR_CLIENT_SECRET`, `GOOGLE_CALENDAR_REDIRECT_URI`). No migration is committed for `google_calendar_connections` or `google_calendar_event_maps`; `GoogleCalendarSync.php:380-388` checks they exist. [23 — Calendar Sync](../features/23-Calendar-Sync.md). |
| Mobile app keys | `config/appkeys.php` and `AuthController@appKeys` (`app/Api/V2/Controllers/AuthController.php:921-930`), v2 `GET appkeys-<suffix>` |
| User MCP | `app/UserMcp/`. `Services/McpOperationGuard.php` makes `find_ai_leads`, `save_ai_leads`, `buy_contacts`, `create_route` and `create_route_from_list` safe to retry with an `idempotency_key` claim in `user_mcp_operations` (`:13-72`). Its migration is `app/UserMcp/database/migrations/2026_10_05_120000_create_user_mcp_operations_table.php`, outside `database/migrations`, applied with `--path` (`docs/plugin-submission/README.md:27-33`). Without the table, `save_ai_leads` and `buy_contacts` return `server_misconfigured` and the free tools run unguarded (`:34-44`). |
| ChatGPT and Claude plugins | `ChatGptPluginController.php`, `ClaudePluginController.php` and `ManagerPluginController.php` serve the HTML pages in `public/chatgpt-plugin/`, `public/claude-plugin/` and `public/manager-plugin/` (`routes/web.php:20-30`). Packages are in `plugins/` (marketplace `plugins/.claude-plugin/marketplace.json`), built by `scripts/build_chatgpt_plugin.py` and `scripts/build_claude_plugin.py`. `/.well-known/openai-apps-challenge` is in `app/UserMcp/routes/app_mcp_wellknown.php:42`. |

v2 controllers present: `AuthController`, `CityController`, `CompanyController`, `ContactSellController`, `GoogleCalendarController`, `InviteController`, `ListController`, `ProfileController`, `RouteController`, `SupportController`, `UserDataController`, `WebhookController`.

## Manager routes present

`/manager/dashboard`, `/manager/ai-find-leads`, `/manager/salespeople` (list, create, edit, remove, resend, routes, details), `/manager/activity`, `/manager/support`, `/manager/reports`, `/manager/settings`, and JSON under `/manager/api/` for dashboard-data, kpis, team, feed, growth, insights, territory, sidebar-stats, find-leads, create-leads.

There are two identical `Route::get('/ai-find-leads', ...)` lines. Do not add a third. Do not “clean up” the duplicate as part of an unrelated task.

Classic review credits: GET and POST `/reviews/credits` in the authenticated `/` group. View `resources/views/front/review_credits.blade.php`. Mail `resources/views/mails/reviewcredits.blade.php`, job `app/Jobs/SendReviewCreditsEmail.php`, config `config/review_credits_email.php`. Rows are `user_invitees` with `type` `g2` or `ph`. `verify` 1 means verified. The POST does not write the credit balance.

## Generate checklist

- [ ] Named the stack: classic, manager, or HQ.
- [ ] Route added in the matching group only.
- [ ] Controller is the sibling that already owns the noun (`CompanylController` for companies).
- [ ] Blade page copies a sibling view; manager page copies a sibling JSX mount.
- [ ] CSS file matches the stack ([web design](../brains/web-design.md)).
- [ ] A still from [screenshot review](../screenshots/REVIEW.md) was opened first.
- [ ] PHP stays on the 5.3.31 / PHP 7.2 side of the lockfile.

## Contracts — copy these shapes

### Classic Blade page

`resources/views/front/layout.blade.php` yields, in page order: `before_styles`, `after_styles`, `after_styles_select2`, `header`, `content`, `before_scripts`, `after_scripts`, `after_scripts_gmaps`, `after_scripts_subscribe`, `custom_scripts`, `cancel_import_scripts`, `bootstrap-tour`. A list page such as `front/company/companyview.blade.php` fills `header`, `content`, `after_styles`, `after_scripts`, and `custom_scripts` only.

```blade
@extends('front.layout')
@section('header') … page title row … @endsection
@section('content') … jqxGrid or DataTables markup … @endsection
@section('after_styles') … page CSS links … @endsection
@section('after_scripts') … vendor JS … @endsection
@section('custom_scripts')
<script>
  $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') } });
  var fd = new FormData(); fd.append('key_from_sibling', value);
  $('#cover-spin').show();
  $.ajax({ url: '/company/…', type: 'POST', data: fd, contentType: false, processData: false })
    .always(function () { $('#cover-spin').hide(); });
</script>
@endsection
```

### Manager island

Blade extends `front.manager._portal_layout` and fills `mgr_content` and `mgr_after_scripts` (and `mgr_after_styles` if needed). The layout loads `css/manager-portal.css` and `css/manager-portal-responsive.css` and `js/manager-portal-drawer.js`. The page puts server data in a JSON script tag and an empty root:

```blade
@extends('front.manager._portal_layout')
@section('mgr_after_scripts')
  <script type="application/json" id="manager-settings-initial">{!! $settingsFullJson !!}</script>
  <script src="{{ asset('js/manager-portal.js') }}?ver={{ @filemtime(public_path('js/manager-portal.js')) ?: '1' }}"></script>
@endsection
@section('mgr_content')
  <div id="manager-settings-root"></div>
@endsection
```

`resources/manager-portal/main.jsx` mounts each island the same way. Copy this block for a new one and change the three names:

```jsx
const settingsEl = document.getElementById('manager-settings-root')
if (settingsEl) {
  const initial = readJsonScript('manager-settings-initial')
  createRoot(settingsEl).render(<ManagerSettings initial={initial} />)
}
```

Islands on the review date: `manager-ai-find-leads`, `manager-dashboard`, `manager-activity`, `manager-salespeople`, `manager-salesperson-detail`, `manager-settings`, `manager-salesperson-routes`, `manager-support`, `manager-support-create`, `manager-support-detail`, `manager-salesperson-form`, `manager-salesperson-convert`. Toasts mount on `#manager-toast-root` and read `manager-flash-initial`.

### Manager CSS variables (`public/css/manager-portal.css` `:root`)

| Group | Variables |
|---|---|
| Blue | `--blue #124ac6`, `--blue-dark #0e3da6`, `--blue-light #e6eefb`, `--blue-glow rgba(18,74,198,.08)`, `--mgr-icon-blue-filter` |
| Teal / sky | `--teal #00a99d`, `--teal-light #e0f7f5`, `--green #00a99d`, `--green-light #e0f7f5`, `--sky #00bcf0`, `--sky-light #e0f5fd` |
| Status | `--amber #f59e0b`, `--amber-light #fef3c7`, `--red #ef4444`, `--red-light #fee2e2`, `--purple #8b5cf6`, `--purple-light #ede9fe` |
| Text / surface | `--dark #1a1a1a`, `--text #1a1a1a`, `--text-secondary #6e6e8a`, `--text-muted #bfbfbf`, `--bg #f5f6fa`, `--card #ffffff`, `--border #e5e5e5` |
| Layout | `--sidebar-w 260px`, `--header-h 64px`, `--radius 14px`, `--radius-sm 10px`, `--shadow-sm`, `--shadow-md`, `--shadow-lg` |

Use a variable. Do not add a hex to a manager JSX file.

### Web settings pages

| Surface | Route | Controller |
|---|---|---|
| Classic self-settings | `GET /settings`, `POST /setting/edit/{id}` | `SettingController@edit`, `@update` |
| Manager settings | `GET /manager/settings` | `Manager\ManagerDashboardController@settings`, island `manager-settings` |
| Manager's salespeople CRUD | `/salesperson/*` | `SalespersonController` (this is the team screen, not self-settings) |
