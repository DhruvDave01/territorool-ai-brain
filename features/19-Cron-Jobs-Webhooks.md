# 19 — Background jobs and provider callbacks

## Purpose

Work that is not a user clicking a button: keep plans/credits true, finish route optimization, finish contact enrich, send mail/push, sync CRM, log to sheets.

## Scheduled work

Hit on a timer:

- Company sync batch
- Subscription status refresh
- HubSpot companies/contacts sync
- Stripe/RevenueCat status + credit grant (wrapper job)
- OpenCorporates credit alignment (legacy job; live contact fetch is FullEnrich + Claude only)
- User package updates
- Business client / manager subscription credits
- Route reminder notifications
- Remind expired users, renewals, expired users, expired free packages
- Lead-user sync
- Paid-API usage email (beta_react only; see below)

Laravel's scheduler is not used: `schedule()` in `app/Console/Kernel.php:25-29` holds only a commented-out `inspire`. Every cron is a public GET under `cron/` (`routes/web.php:41-46` on master), so something outside the repo must call these URLs; that scheduler is not in git. The URLs are unauthenticated — do not add destructive new crons without a secret.

## Paid-API usage report (beta_react only, read 2026-11-02)

Added in `dc07b901` (30 Oct 2026); not on master. Source: [live code 2026-11-02](../reviews/live-code-2026-11-02.md).

- **Route:** `GET cron/paid-api-usage` → `CronController@paidApiUsageReport` (`routes/web.php:46`, `CronController.php:732`).
- **What it does:** reads yesterday's `storage/logs/laravel-<Y-m-d>.log`, counts Google Places, GraphHopper, FullEnrich, Gemini and Claude log lines (`app/Services/PaidApiUsageReport.php`), adds FullEnrich credits remaining, and emails `SUPPORT_EMAIL_1` with the subject "Paid API usage — {date}".
- **Can send twice:** `encapsulationCron` (`cron/updatestripesubscriptionstatuscredit`) also calls it (`CronController.php:768`). If both URLs are scheduled, the email goes out twice a run.
- **Can report zeros:** `config/app.php:124` defaults `APP_LOG` to `single`, which writes only `laravel.log`. The `.env` in the repo sets `APP_LOG=daily`. If the server's `.env` does not, the dated file is missing and every count in the email is zero.

## Queue jobs

| Job | When |
|-----|------|
| Generate sample / basic-cluster route | Route processing |
| Create advanced route | Route processing |
| Generate advanced PDF | Export |
| Buy contacts bulk | Redeem batch |
| FullEnrich bulk redeem | Enrichment |
| Google Sheets | Log searches/credits |
| Welcome / onboarding emails | Signup |
| `SendReviewCreditsEmail` | About 24 hours after web signup (`REVIEW_CREDITS_EMAIL_DELAY_MINUTES`, default 1440). Does not grant credits. |
| Trial nudge push | Trial |

A route stays **processing** until generate jobs finish.

## Queue worker (read 2026-11-02)

Rechecked on master `d3f75449`; no change since 28 September. Source: [live code 2026-11-02](../reviews/live-code-2026-11-02.md).

- **One queue:** the local `.env` has `QUEUE_DRIVER=database`. `config/queue.php` `database` uses queue `default` and `retry_after` 900. No job sets `onQueue`, so route generation, route PDFs, bulk contact buys, emails and, outside local, Google Sheets all share that one queue.
- **Job limits are ignored:** Laravel 5.3 reads only the worker’s `--tries` and `--timeout`. Job properties such as `BuyContactsBulkJob::$tries = 1` and `$timeout = 7200` do nothing.
- **Reruns after 15 minutes:** a job still reserved after `retry_after` becomes available again. A second worker would run it a second time unless workers use `--tries=1`.
- **Killed after about a minute:** `queue:work` defaults to `--timeout=60`. As a daemon with pcntl loaded, it kills a job after about 63 seconds. That job is then retried after `retry_after`.
- **Worker command:** the `package.json` script `queue` is `php artisan queue:listen --tries=3 --timeout=0`. The production worker command is not in the repo. Check it before adding workers or long jobs.
- **FullEnrich webhooks:** `fullenrich-webhook/bulk/{jobId}` returns 200 on its first line, and the rest of that method never runs. `fullenrich-webhook/bulk/{jobId}/contact` saves one contact and charges for it. It is not idempotent.

## Where errors go (read 2026-11-02)

Triage steps and rules for production fixes: [On-call](../brains/on-call.md).

- **Caught errors stay in the log file.** Code that catches an error writes it with `Log::error` (about 154 calls under `app/` on master). Those never reach Sentry. Read them in `storage/logs/` (`laravel.log`, or `laravel-<date>.log` when `APP_LOG=daily`).
- **Uncaught exceptions** go through `app/Exceptions/Handler.php:35-46` on master: to Sentry, and also to PostHog when `services.posthog.enabled` is on. That is the only `captureException` call under `app/`. beta_react `929f0c7f` removes the PostHog half.
- **`BuyContactsBulkJob`** catches its own errors in `handle()`, logs "BuyContactsBulkJob failed: …" and writes "Job failed: {message}" to the progress cache (`BuyContactsBulkJob.php:437-443`). Its new `failed()` (`2d0f4d55`, `:461-464`) writes "Background purchase failed: " plus the exception class. Laravel 5.3 calls `failed()` only when the worker's `--tries` limit is reached, for example when a job killed by the timeout is picked up again; with no `--tries` it never runs.

## Inbound provider callbacks

- FullEnrich single company and bulk job/contact (live fetch, **2 credits**)
- Claude contact finder (live fetch when FullEnrich is empty, **1 credit**)
- RevenueCat subscription lifecycle and product change

TikTok ads events are marketing, not a user module.

## Rules

- Credit jobs must be idempotent. The FullEnrich `contact_finished` webhook is not today: a retried callback saves and charges again.
- FullEnrich callbacks must match bulk-job progress keys.

## Code

`CronController`, `UserauthController` (two scheduled methods), `app/Jobs/*`, `WebhookController`, `GoogleSheetsClient`, `TikTokEventsService`, `app/Exceptions/Handler.php`. beta_react only: `app/Services/PaidApiUsageReport.php`, `app/Mail/PaidApiUsageReportMail.php`.

## Related

**Modules** — 07-Routes, 09-Contact-Enrichment-Credits, 12-Subscription-Payments, 13-CRM-Integrations, 15-Support-Notifications, 18-Clients

**Code** — ROUTEMAP.md (look for `CronController`, `UserauthController`, `WebhookController` (**Cron / Webhooks** section)), CODEMAP.md, engineering/README.md

**Terms / roles** — glossary.md, OVERVIEW.md

## Screens

Per surface. "File" is under `TerriTool/App/components/` for mobile; the full map is [mobile screens](../code/mobile-screens.md). Strings are copied from code on 2026-09-22; a loading cell that reads `screen.x.loading` is the `testID` on that screen's `ActivityIndicator`. Copy these strings; do not write new ones.

No screen. Cron and webhook effects show up on the module pages (route status, credits, contact data).

## Generate from this brain

- UI rule: [UI/UX Guardian](../brains/ui-ux-guardian.md)
- Screenshot method: [screenshot review](../screenshots/REVIEW.md)
- Mobile implementation: [mobile code review](../code/mobile-review.md)
- Web implementation: [web code review](../code/web-review.md)
- Role: [User](../roles/user.md) · [Manager](../roles/manager.md) · [Admin](../roles/admin.md)
