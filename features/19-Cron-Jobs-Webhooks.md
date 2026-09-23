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

HTTP cron URLs are currently unauthenticated — do not add destructive new crons without a secret. Artisan `inspire` is unused; real work is these jobs.

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

## Inbound provider callbacks

- FullEnrich single company and bulk job/contact (live fetch, **2 credits**)
- Claude contact finder (live fetch when FullEnrich is empty, **1 credit**)
- RevenueCat subscription lifecycle and product change

TikTok ads events are marketing, not a user module.

## Rules

- Credit jobs must be idempotent.
- FullEnrich callbacks must match bulk-job progress keys.

## Code

`CronController`, `UserauthController` (two scheduled methods), `app/Jobs/*`, `WebhookController`, `GoogleSheetsClient`, `TikTokEventsService`.

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
