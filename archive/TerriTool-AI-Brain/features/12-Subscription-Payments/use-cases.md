---
title: "Subscription Payments — use cases"
---

# Subscription Payments — use cases

Part of [12-Subscription-Payments](MODULE.md). Verbatim from the former `03-Use-Cases/use-cases.md` (split 2026-09-16). Actors and global chrome: [use-cases-overview.md](../../product/use-cases-overview.md). Evidence times refer to [evidence.md](evidence.md) where that file exists.

## 11. Subscription & credits

### UC-BIL-01 View subscription history

Package name, amount, start/end, actions. Package Add-Ons history (credits purchases).

Evidence: 11:09:51 (Free Package, $0, 14–21 Sep 2026; no add-ons yet)

### UC-BIL-02 Upgrade plan

Upgrade → `/subscription/upgrade` (Stripe / RevenueCat). Success: `/subscription/success`, `/success-revenuecat`.

### UC-BIL-03 Buy credits add-on

`/subscription/credits-addon`. Does not change plan; adds lead credits.

### UC-BIL-04 Cancel subscription

Reason form → cancel Stripe or RevenueCat. Admin can extend trial / activate lifetime.

### UC-BIL-05 Trial expiry

After end date, Find Leads save and buy-contacts block until upgrade or add-on.
