---
title: "Subscription Payments — flows"
---

# Subscription Payments — flows

Part of [12-Subscription-Payments](MODULE.md). Source mermaid in `flows/mmd/`, rendered PNG in `flows/png/` (re-render with `mermaid is inlined in this file`). Product-level map: [FLOWS.md](../../product/FLOWS.md).

## Billing

![Billing](flows/png/10-billing.png)

```mermaid
flowchart TD
  Need{Need more access?} -->|Plan| Upgrade[Upgrade]
  Need -->|Credits only| Addon[Credits add-on]
  Need -->|Inspect| Hist[Subscription history]
  Upgrade --> Pay[Stripe / RevenueCat]
  Addon --> Pay
  Pay --> OK{Success?}
  OK -->|Yes| Active[Active subscription + credits]
  OK -->|No| Fail[Stay on current plan]
  Hist --> Cancel[Cancel with reason]
  Cancel --> End[Access until period end]
  Trial[7-day Free Package] --> Expire{End date passed?}
  Expire -->|Yes| BlockSave[Block save leads / buy contacts]
  BlockSave --> Upgrade
```
