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

**Modules** — 02-Dashboard, 09-Contact-Enrichment-Credits, 14-Settings-Profile, 17-Admin-HQ, 19-Cron-Jobs-Webhooks, 21-Business-Team

**This feature** — Use cases, Flows, Evidence

**Code** — ROUTEMAP.md (look for `SubscriptionController`, `Admin\SubscriptionController`), CODEMAP.md, engineering/README.md

**Terms / roles** — glossary.md, roles.md, OVERVIEW.md

## Screens

Per surface. "File" is under `TerriTool/App/components/` for mobile; the full map is [mobile screens](../code/mobile-screens.md). Strings are copied from code on 2026-09-22; a loading cell that reads `screen.x.loading` is the `testID` on that screen's `ActivityIndicator`. Copy these strings; do not write new ones.

| Surface | Screen | File / still | Primary action | Loading | Empty | Error |
|---|---|---|---|---|---|---|
| Mobile | `SubscriptionScreen` / `SubscriptionGate` | `register/subscribe.js`, `register/SubscriptionGate.js` · [LoginRegistrationFlow](<../screenshots/mobile-owner/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.26.47.png>) | Subscribe (RevenueCat) | "Retry loading subscription plans" | — | "Unable to connect to the store. Please check your internet connection."; "Your payment was processed, but we couldn't…"; "Try again in a moment or contact support." |
| Mobile | Subscription card on Settings | `dashboard/editstatus.js` · [Setting](<../screenshots/mobile-owner/Setting/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.23.png>) | Cancel (danger) / Upgrade (primary) / Buy extra credits | `screen.editStatus.loading` | — | "Unable to switch plans"; "Missing subscription info. Try again later." |
| Mobile | `SettingsPlanPaywall` | `register/SettingsPlanPaywall.js` · [Setting](<../screenshots/mobile-owner/Setting/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.36.png>) | "Manage your plan on the web" | — | — | RevenueCat offerings failure |
| Classic web | `/subscription` | feature-evidence 12 flows | Upgrade, add credits, invoices | `#cover-spin` | — | Stripe error text |

RevenueCat users get manage-plan, not Stripe. Business Sales Agents are told to contact the manager.

## Screenshots in this brain

Open the image before drawing UI. The filename is a capture time, not a layout spec. Pixels win.

- [IMG_4731.PNG](<../screenshots/feature-evidence/12-Subscription-Payments/evidence/IMG_4731.PNG>)
- [Screenshot 2026-09-15 at 1.18.55 PM.png](<../screenshots/feature-evidence/12-Subscription-Payments/evidence/Screenshot 2026-09-15 at 1.18.55 PM.png>)
- [Screenshot 2026-09-15 at 11.09.51 AM.png](<../screenshots/feature-evidence/12-Subscription-Payments/evidence/Screenshot 2026-09-15 at 11.09.51 AM.png>)
- [TerriTool-09-15-2026_01_18_PM (1).png](<../screenshots/feature-evidence/12-Subscription-Payments/evidence/TerriTool-09-15-2026_01_18_PM (1).png>)
- [TerriTool-09-15-2026_01_18_PM.png](<../screenshots/feature-evidence/12-Subscription-Payments/evidence/TerriTool-09-15-2026_01_18_PM.png>)
- [10-billing.png](<../screenshots/feature-evidence/12-Subscription-Payments/flows/png/10-billing.png>)

## Generate from this brain

- UI rule: [UI/UX Guardian](../brains/ui-ux-guardian.md)
- Screenshot method: [screenshot review](../screenshots/REVIEW.md)
- Mobile implementation: [mobile code review](../code/mobile-review.md)
- Web implementation: [web code review](../code/web-review.md)
- Role: [User](../roles/user.md) · [Manager](../roles/manager.md) · [Admin](../roles/admin.md)
