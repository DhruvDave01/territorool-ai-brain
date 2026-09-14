# Feature: Contacts

Related: [03-companies](03-companies.md) · [09-credits-billing](../09-credits-billing.md) · [14-mcp](../14-mcp.md)

## What it does

People at companies. Manual CRUD is free. Discovery is free. Buying unlocked details costs credits (2 paid / 1 free-Claude).

## Mobile

| Piece | File / API |
|--------|------------|
| CRUD | `contacts/create\|update\|view.js` |
| Find UI | `FindContactsFetchModal` → `fetchAllContacts` → `CongContact` / `bizContacts` |
| Buy credits helper | `App/utils/contactBuyCredits.js` — name/pos or email/phone: **2**; Claude/biz: **1** |
| Report | `reportcontact` |

## APIs

CRUD: `contactlist`, `companycontactlist`, `addcontact`, `updatecontact`, `getContactDetail`, `deletecontact`, `unassigncontactlist`, `updatecontactnotes`.

Find: `fetchAllContacts` (FullEnrich primary, then OpenCorporates, Claude, Apollo, Cognism, Bizpedia). MCP spoken order: FullEnrich → OpenCorporates → Claude.

Buy/redeem: `buyContacts`, `redeemFullEnrichContact`, `redeemApolloContact`, `redeemCongnismContact`.

Provider fetch: `getApolloContact`, `getCongnismContact`, `getOpencorporatesCompany`, `getOpencorporatesContact`, `fetchClaudeContact`, `getBizpediaContact`.

Stages: `getusercontactstage` / table `user_contact_stage`.

Webhooks: `fullenrich-webhook/{company_id}`, bulk job, contact; `apollo-webhook`. Jobs: FullEnrich bulk.

## MCP

| Tool | Rule |
|-------|------|
| `find_contacts` | Free names for one company |
| `find_contacts_bulk` | **Counts only**, max 10/page, not names |
| `add_contact` | Named person the user already knows — **free** |
| `buy_contacts` | After `get_credits` + explicit yes; 2 paid / 1 free |

Never substitute `add_note` for a person.
