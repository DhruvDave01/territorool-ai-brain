---
title: "Business rules"
---

# Business rules

Rules that must not silently change. Feature details live in `features/*/MODULE.md`.

## One product

A company saved from Find Leads is the same company on the map, list, route, CRM sync, mobile, and MCP. Do not implement a “web-only” version of a shared write.

## Credits

| Action | Credits |
|--------|---------|
| Search / browse / contact counts | **0** |
| Save one AI lead | **1** |
| Buy contact via FullEnrich | **2** |
| Buy contact via Claude | **1** |
| Manual add company / add contact / notes / visits / lists / routes | **0** |

Buy is **never** free. Live people fetch is FullEnrich, then Claude if empty. Historical Apollo/Cognism routes are not live fetch.

Charge save-lead on **inserted** companies (`Helper::saveAILead`), after an up-front count check. BSA errors say contact the manager — not Stripe. SA with no enabled subscription can hit a bare `return`. Package id **1** caps selected leads at **60**. `skipCreditBilling` exists — do not use it to make paid actions free.

## Wallets

- Sales Agent: `user_credits` (`total_credit` / `used_credit`). Remaining = total − used.
- Business Sales Agent: manager-allocated `businessclient_salesagent_credits`. Empty → contact manager.
- Business Agent Find Leads assigns into a **rep’s** book and spends **manager** credits.
- Credit-enabled package IDs: **1, 2, 4, 5, 6**. **1 and 4** are trial/free-style.

## Access

- Many features require an active subscription (`subscriber` middleware).
- Sales Agent with **no plan** is sent to pay (RevenueCat checkout) before Dashboard / Find Leads.
- Customer MCP: SA or BSA with `status == Active` only. Not Business Agent cockpit. Not HQ.

## Routes vs lists

- List = named group. Not driving order.
- Route = optimized order. Web may stay **Draft**. MCP `create_route` / `create_route_from_list` **publish** and return `route_url`.
- Need enough stops (product: typically ≥2) or create fails.

## Writes that are not interchangeable

| Intent | Write |
|--------|--------|
| I was there | Visit |
| Log a meeting/call | Activity |
| Remember this | Note |
| Gold / High Priority | Status (`set_company_status`) |
| AI search hit into Address Book | `save_ai_leads` / `Helper::saveAILead` (`source=aileads`) |
| Manual account | `add_company` (free) |

## Manager vs rep

Business Agent does not use the rep Address Book as personal CRM. Assigned companies have `user_id` = the salesperson.

Roles: [roles.md](roles.md).
