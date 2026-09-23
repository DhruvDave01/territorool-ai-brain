# Web code

Reviewed 2026-09-22 against `/Users/dhruvdave/Dhurv/Project_TerriTool/Territool_web/webterritool`. File-level notes: [code/web-review.md](../code/web-review.md). Pixels: [web design](web-design.md). HTTP: [API](api.md).

## Stack lock

`composer.lock` installs `laravel/framework` **v5.3.31**. `composer.json` require line is `"laravel/framework": "^7.0|5.3.31"` and `"php": "^7.2"`. New PHP must stay compatible with 7.2 and Laravel 5.3. Do not use typed properties, `match`, nullsafe `?->`, or Laravel 8+ helpers.

## Must follow

| Rule | Do this |
|---|---|
| Company web UI | `app/Http/Controllers/CompanylController.php` — the extra **l** is the live class name. |
| Mobile JSON | `app/Api/V2/Controllers/` and `routes/api.php` inside `$api->version('v2')`. JWT group middleware is `jwt.refresh`. The v1 group is commented. Do not revive it. |
| Helpers | `app/Helpers/helpers.php` (`App\Helpers\Helper`) is not `app/Globals/Helper.php` (`App\Globals\Helper`). |
| Classic AJAX | `FormData` with `contentType: false` and `processData: false`. |
| Tables | Address Book and Find Leads use jqxGrid. Route and list index pages use DataTables. Match the sibling page. |
| Manager | `routes/web.php` prefix `manager`, middleware `web`, `auth`, `manager.only`, namespace `Manager`. React islands in `resources/manager-portal/`, entry `main.jsx`. |
| HQ | `routes/web.php` prefix `hq`, middleware `web`, `role`, namespace `Admin`. Backpack. Not the manager portal. |
| Roles | Spatie roles. A manager may touch self plus users whose `parent_id` is that manager. |

## Where a new URL goes

| Task | File |
|---|---|
| Classic page | `routes/web.php` inside the authenticated `/` group. `/reviews/credits` is already there: GET `HomeController@reviewCredits`, POST `HomeController@recordReviewCredits`. |
| Manager page or `/manager/api/*` | the `prefix => manager` group |
| HQ | the `prefix => hq` group |
| Mobile v2 | `routes/api.php` v2 group |
| Manager island | a new JSX file registered from `resources/manager-portal/main.jsx` onto a `#manager-*-root` node |

Manager routes that exist today include `/manager/dashboard`, `/manager/ai-find-leads`, `/manager/salespeople`, `/manager/activity`, `/manager/support`, `/manager/settings`, and `/manager/api/dashboard-data`, `kpis`, `team`, `feed`, `territory`, `find-leads`.

## Review credits

`front/review_credits.blade.php` posts `{ type: g2|ph }` to `/reviews/credits`. `UserInvitee::recordReviewType` writes a `user_invitees` row with `verify` 0. A second click on the same type returns “Review already submitted.” and does not add another row. `verify` 1 is the verified state. This POST does not write the credit balance.

The day-two mail is `mails/reviewcredits.blade.php`, queued by `SendReviewCreditsEmail::scheduleAfterRegistration` from web registration (`RegisterController` and a salesperson create in `HomeController`). Delay is `REVIEW_CREDITS_EMAIL_DELAY_MINUTES`, default 1440. Subject “50 more credits ready to redeem”. CTA “Redeem 50 Credits” links to `/reviews/credits`. Config: `config/review_credits_email.php` (`g2_credits` 30, `ph_credits` 20). The mail does not grant credits.

G2 URL: `https://www.g2.com/contributor/territool-ai-field-sales-agent-review-collection-aace6d2c-4008-4c82-8232-6a0e40d5c9c6`. Product Hunt URL: `https://www.producthunt.com/products/territool-field-sales-ai?utm_source=twitter&utm_medium=social`. Logos: `/images/g2-logo.png`, `/images/producthunt-logo.png`.
