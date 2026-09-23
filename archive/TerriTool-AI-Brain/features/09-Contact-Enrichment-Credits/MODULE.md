---
title: "09 — Contact Enrichment and Credits"
---

# 09 — Contact Enrichment and Credits

## Purpose

Look up people at a company and **buy/fetch** them with credits. Buy contacts is **not free**. The same credit wallet is used to save AI leads.

**Live fetch services (only these two):**

| Service | Credits per contact |
|---------|---------------------|
| **FullEnrich** | **2** |
| **Claude** | **1** |

No other contact-fetch provider is running (not Apollo, Cognism, OpenCorporates, or Bizpedia).

## Who

Sales Agent (own credits). Business Sales Agent (credits allocated by the manager).

## Credit economics (identical on every client)

| Action | Credits |
|--------|---------|
| Save AI lead | 1 per company |
| Fetch/buy contact via **FullEnrich** | **2** per person |
| Fetch/buy contact via **Claude** | **1** per person |
| Search leads, list companies, bulk **counts** | 0 |

There is **no free redeem**. Claude at 1 credit is still a paid buy.

If `used + cost > total` → Sales Agent: upgrade / add-on. Business Sales Agent: contact manager. Remaining credits = total − used.

## Where Find Contacts starts

- Company detail (website required; user is asked to add one if missing)
- Address Book bulk selection
- A route stop
- A Find Leads result
- MCP / voice (`find_contacts` then `buy_contacts`; see [api-surfaces.md](../20-MCP/api-surfaces.md))

## Providers (live)

| Provider | Role | Credits |
|----------|------|---------|
| **FullEnrich** | Primary lookup by domain/address; can complete later via webhook | **2** per contact bought |
| **Claude** | Secondary when FullEnrich returns nobody | **1** per contact bought |

## Single company

1. Find Contacts
2. Need website → save it → retry
3. Preview people (name, title, email, phone, location) from FullEnrich, or Claude if FullEnrich is empty
4. Load More pages as needed
5. Select → confirm credits (**2** FullEnrich / **1** Claude) → buy
6. Contacts saved (default Unclassified), credits deducted

Redeem can run in the background; the user waits on progress until the provider webhook finishes.

## Bulk Contacts

1. Select companies
2. See available contact **counts** (counts are not a buy)
3. Optional Claude counts
4. Pick companies/people
5. Buy as a batch with progress (**2** FullEnrich / **1** Claude)
6. Primary vs secondary contact marking is supported

## Wallet

- `total_credit` / `used_credit` on a billing window (`date`)
- Paid plans refresh on the subscription anniversary day-of-month
- Extra packs: credits add-on
- Admin or manager can grant credits

## Rules

- Never treat buy/fetch contacts as free.
- FullEnrich buy = **2** credits; Claude buy = **1** credit; apply on **every** redeem path.
- FullEnrich is async; wait for progress + webhook.
- BSA empty wallet → manager message, not Stripe.

## Code

`CompanylController` buy/bulk/Claude, `RoutesController` fetch-on-map, `ClaudeContactFinderService`, `BuyContactsBulkJob`, `RedeemFullEnrichBulkJob`, FullEnrich webhooks, `UserCredit`, `UserContactsCredit`.

## Related

**Modules** — [03-Company-AddressBook](../03-Company-AddressBook/MODULE.md), [04-Contacts](../04-Contacts/MODULE.md), [05-Find-Leads](../05-Find-Leads/MODULE.md), [07-Routes](../07-Routes/MODULE.md), [12-Subscription-Payments](../12-Subscription-Payments/MODULE.md), [16-Manager-Portal](../16-Manager-Portal/MODULE.md), [17-Admin-HQ](../17-Admin-HQ/MODULE.md), [19-Cron-Jobs-Webhooks](../19-Cron-Jobs-Webhooks/MODULE.md), [18-Clients](../18-Clients/MODULE.md)

**This feature** — [Use cases](use-cases.md), [Flows](flows.md), [Limits](limits.md), [Known issues](known-issues.md)

**MCP** — [20-MCP](../20-MCP/MODULE.md), tool contract in [api-surfaces.md](../20-MCP/api-surfaces.md)

**Code** — [ROUTEMAP.md](../../knowledge/code/ROUTEMAP.md) (look for `CompanylController`, `RoutesController`, `WebhookController`), [CODEMAP.md](../../knowledge/code/CODEMAP.md), [engineering/README.md](../../knowledge/code/README.md)

**Terms / roles** — [glossary.md](../../product/glossary.md), [roles.md](../../product/roles.md), [OVERVIEW.md](../../product/OVERVIEW.md)
