# Web code

Reviewed 2026-09-22 against `/Users/dhruvdave/Dhurv/Project_TerriTool/Territool_web/webterritool`, and again on 2026-11-02 against `master` `d3f75449` (production) and `beta_react` `929f0c7f` (development) ([review](../reviews/live-code-2026-11-02.md)). Facts are for `master` unless a line names `beta_react`. The local checkout can be stale: read with `git show "origin/master:<path>"`. File-level notes: [code/web-review.md](../code/web-review.md). Pixels: [web design](web-design.md). HTTP: [API](api.md).

## Stack lock

`composer.lock` installs `laravel/framework` **v5.3.31**. `composer.json` require line is `"laravel/framework": "^7.0|5.3.31"` and `"php": "^7.2"`. New PHP must stay compatible with 7.2 and Laravel 5.3. Do not use typed properties, `match`, nullsafe `?->`, or Laravel 8+ helpers.

## Must follow

| Rule | Do this |
|---|---|
| Company web UI | `app/Http/Controllers/CompanylController.php` — the extra **l** is the live class name. |
| Mobile JSON | `app/Api/V2/Controllers/` and `routes/api.php` inside `$api->version('v2')`. JWT group middleware is `jwt.refresh`. The v1 group is commented. Do not revive it. |
| Helpers | `app/Helpers/helpers.php` (`App\Helpers\Helper`) is not `app/Globals/Helper.php` (`App\Globals\Helper`). |
| Classic AJAX | `FormData` with `contentType: false` and `processData: false`. The Search Multiple tab of `/findleads` is the older city or ZIP form. The chat include was reverted on 2026-09-29 (`abe88426`). |
| Tables | Address Book and Find Leads use jqxGrid. Route and list index pages use DataTables. Match the sibling page. |
| Manager | `routes/web.php` prefix `manager`, middleware `web`, `auth`, `manager.only`, namespace `Manager`. React islands in `resources/manager-portal/`, entry `main.jsx`. |
| HQ | `routes/web.php` prefix `hq`, middleware `web`, `role`, namespace `Admin`. Backpack. Not the manager portal. |
| Roles | Spatie roles. A manager may touch self plus users whose `parent_id` is that manager. |
| Errors | `routes/web.php:14-16` turns off notices and warnings on PHP 7.2 and later, so an undefined variable fails silently. Most caught failures only call `Log::error`. See Error reporting below. |
| Crons | `app/Console/Kernel.php:25-29` `schedule()` is empty. Every cron is a public GET in `routes/web.php` (for example `:41-46`) that an outside scheduler calls. Opening one runs the job. |

## Where a new URL goes

| Task | File |
|---|---|
| Classic page | `routes/web.php` inside the authenticated `/` group. `/reviews/credits` is already there: GET `HomeController@reviewCredits`, POST `HomeController@recordReviewCredits`. |
| Manager page or `/manager/api/*` | the `prefix => manager` group |
| HQ | the `prefix => hq` group |
| Mobile v2 | `routes/api.php` v2 group |
| Manager island | a new JSX file registered from `resources/manager-portal/main.jsx` onto a `#manager-*-root` node |

Manager routes that exist today include `/manager/dashboard`, `/manager/ai-find-leads`, `/manager/salespeople`, `/manager/activity`, `/manager/support`, `/manager/settings`, and `/manager/api/dashboard-data`, `kpis`, `team`, `feed`, `territory`, `find-leads`.

## Error reporting

- `sentry/sentry-laravel` 2.5.1 with `sentry/sentry` 3.2.1 (`composer.lock`), in the app since `441954f0` (2021). `config/sentry.php` takes the DSN from `SENTRY_LARAVEL_DSN` or `SENTRY_DSN` (`:5`), leaves `release` commented out (`:8`), and sets `sql_bindings` true (`:21`), `send_default_pii` false (`:48`) and `traces_sample_rate` 1.0 (`:50`).
- `master`: `app/Exceptions/Handler.php:35-46` sends reported exceptions to Sentry and, when `POSTHOG_API_KEY` is set (`config/services.php:61-67`), to PostHog. The front layouts load the PostHog browser snippet (`front/layout.blade.php:118`, `front/company/layout_main.blade.php:56`, `front/android_layout.blade.php:59`). `UserMcpTelemetry` sends MCP usage to PostHog (`app/UserMcp/Services/UserMcpTelemetry.php:96-114`).
- `beta_react` (`929f0c7f`, 2 Nov) removes PostHog from the handler, `AppServiceProvider`, `config/services.php` and the layouts. It adds browser Sentry with session replay in `front/partials/sentry_replay.blade.php`, with text, input and media masking off (`:13-17`), 10% of sessions and every session with an error by default (`config/services.php:59-61`). It is included at `front/layout.blade.php:118` and `front/company/layout_main.blade.php:56`; manager portal pages extend `front.layout`. `UserMcpTelemetry` sends a Sentry `captureMessage` instead (`:95-119`), switched by `USER_MCP_SENTRY_ENABLED` and `USER_MCP_SENTRY_QUERY_ENABLED` (`config/services.php:68-70`).
- `app/` has about 154 `Log::error` calls and one `captureException` (`Handler.php:38`). A failure that is caught and logged reaches only the Laravel log in `storage/logs/` (`config/app.php:124`, default `single`). Triage: [On-call](on-call.md).

## Hard-coded key fallbacks

Do not copy these. Move them to `.env`. The values are deliberately not recorded here.

- Gemini: `app/Helpers/helpers.php:919` and `:1050` (`:952` and `:1085` on `beta_react`), and the `env()` default at `app/Http/Controllers/AILeadFinderController.php:44`.
- Google Maps Platform (Places, Address Validation): `app/Helpers/helpers.php:83`, `:542`, `:726`, `:728`, `:810` (in the request URLs), the `env('GOOGLE_KEY', …)` defaults at `AILeadFinderController.php:45` and `app/Services/Manager/ManagerFindLeadsService.php:63`, and `config/googlemaps.php:17`.
- FullEnrich: `config('services.fullenrich.api_key', …)` defaults at `app/Globals/Helper.php:1007`, `:2282`, `:2332`, `:2915`, `:3282`, and `app/Services/PaidApiUsageReport.php:124` (`beta_react` only).
- Others: the `JWT_SECRET` default at `config/jwt.php:24`, the `TIKTOK_EVENTS_ACCESS_TOKEN` default at `config/tiktok.php:19`, and `dataerror_ai_key` at `config/settings.php:23`.

## Review credits

`front/review_credits.blade.php` posts `{ type: g2|ph }` to `/reviews/credits`. `UserInvitee::recordReviewType` writes a `user_invitees` row with `verify` 0. A second click on the same type returns “Review already submitted.” and does not add another row. `verify` 1 is the verified state. This POST does not write the credit balance.

The day-two mail is `mails/reviewcredits.blade.php`, queued by `SendReviewCreditsEmail::scheduleAfterRegistration` from web registration (`RegisterController` and a salesperson create in `HomeController`). Delay is `REVIEW_CREDITS_EMAIL_DELAY_MINUTES`, default 1440. Subject “50 more credits ready to redeem”. CTA “Redeem 50 Credits” links to `/reviews/credits`. Config: `config/review_credits_email.php` (`g2_credits` 30, `ph_credits` 20). The mail does not grant credits.

G2 URL: `https://www.g2.com/contributor/territool-ai-field-sales-agent-review-collection-aace6d2c-4008-4c82-8232-6a0e40d5c9c6`. Product Hunt URL: `https://www.producthunt.com/products/territool-field-sales-ai?utm_source=twitter&utm_medium=social`. Logos: `/images/g2-logo.png`, `/images/producthunt-logo.png`.
