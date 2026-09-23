---
title: "UC-CT — Buy contacts (engineering trace)"
---

# UC-CT — Buy contacts (engineering trace)

**Product IDs:** UC-CT-01, UC-CT-02. Prose: `features/09-Contact-Enrichment-Credits/use-cases.md`.  
**UI flow:** FLOW-CONTACTS.

## User Goal

The sales rep wants named people at a saved company, and is willing to spend credits to redeem paid results.

## Preconditions

- Company in Address Book
- Credits: FullEnrich **2** / Claude **1** per buy
- Live providers only: FullEnrich then Claude

## Happy Path

1. Find contacts (`find_contacts` / web fetch) — **0** credits (counts/names preview rules in api-surfaces).
2. Confirm buy.
3. `buy_contacts` / `buyContacts` persists contact and decrements wallet.

## Alternative Paths

- Bulk async (`buyContactsAsync` / job progress) — “Contact purchase started.”
- Free rows path returns `Free contacts added.` — distinct from a buy; do not describe as free buy
- Claude fallback when FullEnrich empty (`fetchClaudeContact`)

## Failure Modes

- `Insufficient credits, please subscribe to add credits.`
- `Please select at least one contact to purchase.`
- Dead providers still registered on v2 — calling them is a failed approach

## Expected Result

- `contacts` row with `source` `fullenrich` or `claude`
- Credits reduced by 2 or 1 respectively
- Manual `add_contact` still 0 credits

## UI

Company profile contact panel; Find Contacts UI in Address Book / Find Leads context.

## API

`POST fetchAllContacts`, `POST fetchClaudeContact`, `POST buyContacts` (v2). Web: `CompanylController@buyContacts*`.

## Code

- `CompanylController` buy methods
- `app/Api/V2/Controllers/CompanyController.php` (credit check around `used_credit + 2`)
- `app/UserMcp/Services/Tools/ContactsTools.php`
- `ClaudeContactFinderService`
- Helper FullEnrich HTTP

## Tests

None for buy path. Manager credit helpers are a different wallet use.

## Verification

1. `get_credits`
2. Buy one FullEnrich contact → −2
3. Buy one Claude contact → −1
4. Confirm not 0
