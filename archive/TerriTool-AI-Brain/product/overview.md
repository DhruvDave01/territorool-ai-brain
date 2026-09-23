---
title: "00 — TerriTool Overview"
---

# 00 — TerriTool Overview

End-to-end journeys across modules: [FLOWS.md](FLOWS.md). UI flow index: [../ui-flows/README.md](../ui-flows/README.md). Use cases: [use-cases-overview.md](use-cases-overview.md). Feature modules: [features/README.md](../features/README.md).

## What TerriTool is

TerriTool is a **field sales territory platform**. One account, one database. A company saved from Find Leads is the same company on the map, on a list, on a route, and in CRM sync.

Users:

1. Build an **Address Book** of companies and contacts
2. Discover **new leads** (AI via Google Places + Gemini, or Yelp)
3. **Find people** at those companies and redeem them with credits
4. Group companies into **Lists**
5. Plan optimized driving **Routes**
6. Track **visits, notes, meetings, and status**
7. **Sync** with Salesforce, HubSpot, or KarmaCRM
8. Pay with a **subscription and credits**

All of that is the same product on browser, phone, voice, and AI assistants.

## Roles and home after login

| Role | After login they land on |
|------|--------------------------|
| Sales Agent | Dashboard (rep home) |
| Business Sales Agent | Dashboard (rep home) |
| Business Agent | Manager cockpit |
| Admin | HQ admin |

Guests hitting the site go to login.

## Navigation a rep sees (subscription active)

- Dashboard
- Address Book (Companies, Contacts; plus “companies with errors” if a CSV import is unfinished)
- Find Leads (and Add Company)
- Recently Added
- Routes
- Lists
- Settings

A Business Agent sees: Dashboard, AI Find Leads (assign to team), Salespeople, Activity, Support, Settings.

## Core objects (shared)

| Object | Meaning |
|--------|---------|
| Company | Lead/account with address, map pin, status, website |
| Contact | Person at a company (or unassigned) |
| Note | Free-text on a company (including reminders) |
| Activity | Meeting, Call, Visit, Reminder, Appointment |
| Visit | Mark-as-visited history |
| Route | Ordered stops: draft → processing → published |
| List | Named group of companies (not driving order) |
| Credits | Wallet for saving leads and redeeming contacts |
| Subscription | Plan (Stripe, PayPal, RevenueCat, or admin) |
| AI search | One active lead-search per user (can be resumed) |
| Status / category / contact stage | Per-user labels used on companies and contacts |

## Subscription and credits (shared rules)

- Many features require an **active subscription**.
- A Sales Agent with **no plan at all** is sent to pay (RevenueCat checkout) before Dashboard / Find Leads.
- Credit-enabled packages: IDs **1, 2, 4, 5, 6**. **1 and 4** are trial/free-style.
- Business Sales Agents spend **manager-allocated** credits, not their own Stripe wallet.

## Compatibility

Write PHP 7.2-safe code. This checkout’s `composer.lock` is Laravel **5.3.31** (overviews that say Laravel 7 / PHP 7.4 are stale until a human confirms production). Reuse `Helper`, models, existing save/redeem/route jobs. After a feature change, update this Bible.
