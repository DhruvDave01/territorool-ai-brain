---
title: "19 — Background jobs and provider callbacks"
---

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

**Modules** — [07-Routes](../07-Routes/MODULE.md), [09-Contact-Enrichment-Credits](../09-Contact-Enrichment-Credits/MODULE.md), [12-Subscription-Payments](../12-Subscription-Payments/MODULE.md), [13-CRM-Integrations](../13-CRM-Integrations/MODULE.md), [15-Support-Notifications](../15-Support-Notifications/MODULE.md), [18-Clients](../18-Clients/MODULE.md)

**Code** — [ROUTEMAP.md](../../knowledge/code/ROUTEMAP.md) (look for `CronController`, `UserauthController`, `WebhookController` (**Cron / Webhooks** section)), [CODEMAP.md](../../knowledge/code/CODEMAP.md), [engineering/README.md](../../knowledge/code/README.md)

**Terms / roles** — [glossary.md](../../product/glossary.md), [OVERVIEW.md](../../product/OVERVIEW.md)
