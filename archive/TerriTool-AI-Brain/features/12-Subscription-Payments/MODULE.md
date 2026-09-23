---
title: "12 — Subscriptions and Payments"
---

# 12 — Subscriptions and Payments

## Purpose

Sell plans and extra credits, keep status in sync, invoices, trial, upgrade, cancel. The **wallet and plan** are the same no matter how the user paid.

## Who

- Sales Agent — personal plan
- Business Agent — team licenses + credits
- Admin — force activate, extend, lifetime, Yelp flag
- System — Stripe / RevenueCat callbacks and scheduled jobs

## What the user can do

- See current plan, dates, status (active / canceled / inactive), credits
- Subscribe, pay, upgrade
- Buy a **credits add-on**
- Download invoices (plan and add-on)
- Apply a promo code or special discount
- Extend trial (when allowed)
- Cancel: short survey, then cancel with the same provider they paid with

Business Agents have the team-plan equivalents (subscribe / cancel) and see plan on manager settings.

## Providers

| Provider | Role |
|----------|------|
| **Stripe** | Card checkout, invoices, customer id |
| **PayPal** | Alternate checkout |
| **RevenueCat** | App Store / Play billing (and some hosted pay links) |
| **Promo / special discount** | Admin-created codes |

A user whose plan is **RevenueCat** is not sent through Stripe upgrade; they manage the plan on that provider.

## Packages

Credit-enabled IDs **1, 2, 4, 5, 6**. Trial/free-style **1 and 4**. Business and lifetime packages exist (admin).

Plan row: enable/disable, month/year, payment method, provider subscription id, dates. Add-on packs grant extra credits on the same wallet.

Credit window uses the subscription **anniversary day-of-month**, not always calendar day 1.

## Cancel

1. Cancel on Settings
2. Survey
3. Provider cancel
4. Jobs/webhooks flip status if the callback is delayed

HQ lists cancelled paid users and cancelled RevenueCat trials.

## Request upgrade

Field users can request a package upgrade (recorded for billing/ops).

## Rules

- Do not mix Stripe portal into RevenueCat users.
- Credit grants from webhooks/crons must be idempotent (no double grant).
- Add-on credits use the same `used` / `total` fields the rest of the product reads.

## Code

`SubscriptionController`, Admin subscription actions, `Package`, `Subscription`, `UserCredit`, RevenueCat webhook (`revenueSubscriptionUpdate`, product change).

## Related

**Modules** — [02-Dashboard](../02-Dashboard/MODULE.md), [09-Contact-Enrichment-Credits](../09-Contact-Enrichment-Credits/MODULE.md), [14-Settings-Profile](../14-Settings-Profile/MODULE.md), [17-Admin-HQ](../17-Admin-HQ/MODULE.md), [19-Cron-Jobs-Webhooks](../19-Cron-Jobs-Webhooks/MODULE.md), [21-Business-Team](../21-Business-Team/MODULE.md)

**This feature** — [Use cases](use-cases.md), [Flows](flows.md), [Evidence](evidence.md)

**Code** — [ROUTEMAP.md](../../knowledge/code/ROUTEMAP.md) (look for `SubscriptionController`, `Admin\SubscriptionController`), [CODEMAP.md](../../knowledge/code/CODEMAP.md), [engineering/README.md](../../knowledge/code/README.md)

**Terms / roles** — [glossary.md](../../product/glossary.md), [roles.md](../../product/roles.md), [OVERVIEW.md](../../product/OVERVIEW.md)
