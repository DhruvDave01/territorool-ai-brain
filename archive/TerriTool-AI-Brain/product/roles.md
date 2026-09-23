---
title: "TerriTool roles"
---

# TerriTool roles

One product, four roles. After login they land on different homes; credits and CRM still follow these rules.

## Landing

| Role | After login |
|------|-------------|
| Sales Agent | Rep Dashboard |
| Business Sales Agent | Rep Dashboard |
| Business Agent | Manager cockpit |
| Admin | HQ (`/hq`) |
| Guest | Login |

## What each role can do

| Capability | Sales Agent | BSA | Business Agent | Admin |
|------------|:-----------:|:---:|:--------------:|:-----:|
| Own Address Book, routes, lists, Find Leads | yes | yes | no (assigns into a **rep’s** book) | inspect users |
| Save AI lead (**1** credit) | own wallet | manager allocation | manager Find Leads uses **manager** credits | grant credits |
| Buy contact (**2** / **1**) | own wallet | manager allocation | — | grant credits |
| Empty wallet | Upgrade / add-on | **Contact manager** (not Stripe) | Buy licenses / allocate | Grant / extend |
| Subscribe, add-on, cancel | own plan | no personal Stripe (unless converted) | team plan | Force activate, extend, lifetime |
| Native CRM connect | yes | yes | — | — |
| Create / invite salespeople | no | no | yes (license cap) | yes (all users) |
| Assign AI leads to a rep | no | no | yes | — |
| Team KPIs / reports | no | no | yes | HQ dashboards |
| Support tickets | own | own | own + team context | answer all |
| HQ settings, promo, devices, cities | no | no | no | yes |
| Customer MCP / voice tools | yes if Active | yes if Active | no | Admin MCP instead |

## Credit ownership

- **Sales Agent** — `total_credit` / `used_credit` on their subscription window. Paid plans refresh on the **anniversary day-of-month**.
- **Business Sales Agent** — spends `BusinessclientSalesagentCredit` allocated by the manager. Insufficient → tell them to contact the manager.
- **Business Agent** — buys team licenses and credits; manager Find Leads assigns companies with `user_id` = **the rep**.
- **Admin** — grant/edit credits on the same wallet fields the app reads.

## Customer MCP / voice

Allowed roles: **Sales Agent**, **Business Sales Agent**, `status == Active`.

Not for Business Agent cockpit work. Not for HQ.

## Do not mix

- Do not send a BSA to Stripe checkout for contact/lead credits.
- Do not put a Business Agent on the rep Find Leads page as if it were their CRM.
- Do not expose `/hq` to any non-Admin role.
- RevenueCat-billed Sales Agents manage the plan on RevenueCat, not the Stripe portal.
