---
id: 09-credits-billing
parent: core
related:
  - features/10-credits-subscription.md
  - 14-mcp.md
  - 16-data-models.md
---
# 9. Credits, packages, billing

Related: [features/10-credits-subscription.md](features/10-credits-subscription.md) · [14-mcp](14-mcp.md) · [16-data-models](16-data-models.md)

| Action | Cost | Confirm? |
|--------|------|----------|
| AI search / resume / getAiLeadData | Free | No |
| Save AI lead | **1** / company | Yes. MCP preview + token. Trial package **1** select cap **60** |
| Contact discovery | Free | No |
| Buy paid contact (FE/Apollo/Cognism/…) | **2** | Yes |
| Buy free/Claude/biz contact | **1** | Yes |
| Manual `add_contact` / `add_company` | Free | No |
| Status, notes, activities, lists, routes, mark visited | Free | No |

**Always before spend:** `get_credits` → speak remaining + exact cost → wait for yes. If insufficient, stop.

## Tables

| Table | Role |
|-------|------|
| `user_credits` | `total_credit`, `used_credit` |
| `user_credit_charge` | Charge history |
| `user_contacts_credits` | Per-contact credit usage |
| `businessclient_salesagent_credits` | BSA pool under a manager |

## Packages (Admin MCP)

| Kind | Package IDs |
|------|-------------|
| Trial | `[1, 4]` |
| Paid | `[2, 5, 6]` |

## Payments

- Stripe (Cartalyst `cartalyst/stripe-laravel`)
- PayPal `paypalTrnComplete`
- RevenueCat (mobile `react-native-purchases` + web `@revenuecat/purchases-js`)
- HQ activate/extend
- Promo: `/hq/promocode`; special discounts; credits-addon `/subscription/credits-addon`
