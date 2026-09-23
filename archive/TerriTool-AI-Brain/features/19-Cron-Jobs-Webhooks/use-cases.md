---
title: "Cron / webhooks — use cases"
---

# Cron / webhooks — use cases

Part of [19-Cron-Jobs-Webhooks](MODULE.md). **No user chrome.** Written 2026-09-16 from MODULE.md + `CronController` / `WebhookController` / `app/Jobs`. Do not QA these as FLOW-AUTH.

### UC-CRON-01 Route generate jobs

Create route → status **processing** until generate/cluster jobs finish → published or failed. Queue must be running (`npm run queue`).

### UC-CRON-02 Buy-contacts bulk jobs

Bulk FullEnrich redeem + `buyContactsJobProgress` poll. Credits already reserved by buy rules (2 / 1). Webhook must match bulk-job keys.

### UC-CRON-03 Subscription / credit refresh

Scheduled Stripe/RevenueCat/package jobs keep `user_packages` and credit rows true. Must be idempotent.

### UC-CRON-04 CRM and sheets

HubSpot sync jobs; Google Sheets log jobs. Not a field-rep screen.

### UC-CRON-05 HTTP cron URLs

Existing HTTP cron routes are unauthenticated. Do not add destructive new crons without a secret.

Failure: stuck **processing** route, bulk progress never completes, duplicate credit grants.
