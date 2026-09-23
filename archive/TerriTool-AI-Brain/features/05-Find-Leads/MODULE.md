---
title: "05 — Find Leads (AI + Yelp)"
---

# 05 — Find Leads (AI + Yelp)

## Purpose

Discover **new** businesses in a territory that are not already in the user’s Address Book. **Search is free. Saving costs 1 credit per company.** Managers have a separate “search then assign to a rep” path (module 16).

## Who

Sales Agent, Business Sales Agent. Sales Agents with no plan at all must subscribe first.

## AI Find Leads

### What the user enters

- Territory: **city** or **ZIP** (ZIP max 8 characters)
- What to find and what to exclude (sell description)
- Optional seed website to model the search

### Pipeline (one search at a time per user)

Starting a new search replaces the previous one. The user can leave and **resume**.

**Stage 1 — strategy (Gemini)**  
Produces search terms, hard filters (rating, price, business status), map center / bias (Places circle max 50 km), and whether qualitative refinement is needed.

**Stage 2 — Google Places**  
Text search per term, multiple pages, dedupe by place id, apply hard filters, drop businesses already in this user’s Address Book. Partial results show as they arrive (table, cards, map): name, address, phone, website, rating, reviews, hours, types, Maps link.

**Stage 3 — refine (optional)**  
Only if the strategy needs it (reviews, “exclude residential”, specialties). Batches of places are scored/filtered by Gemini.

**Complete**  
Results stored so they can be previewed later and saved.

### What the user can do with results

- Watch progress
- Filter / sort
- Select leads
- **Save** → Address Book, **1 credit each**; already-owned businesses are skipped
- Create a **route** from the selection
- Add to an **existing route**
- Add to a **list**
- **Find contacts** (website required)
- Last query is remembered for the next visit

Insufficient credits → upgrade / add-on (or RevenueCat manage-plan).

## Yelp Find Leads

Admin can turn Yelp on or off per user.

1. Location + industry
2. List of businesses
3. Select → save into the Address Book (same company object as AI save)

## Find leads on a route map

On the map the user can lasso an area, search leads there, create companies **as route stops**, then fetch contacts. The route usually needs **regenerate** after that.

## Rules

- Do not add a second AI pipeline; extend the existing stages.
- Places location bias must stay ≤ 50 km.
- Every save path must charge **1 credit** and skip duplicates.
- Manager “assign to rep” is not this module.

## Code

`AILeadFinderController`, `CompanylController` save/Yelp/legacy search, `Helper::saveAILead` / `getYelpLeads` / `saveYelpLead`, `UserAISearch`.

## Related

**Modules** — [03-Company-AddressBook](../03-Company-AddressBook/MODULE.md), [07-Routes](../07-Routes/MODULE.md), [08-Lists](../08-Lists/MODULE.md), [09-Contact-Enrichment-Credits](../09-Contact-Enrichment-Credits/MODULE.md), [11-Maps](../11-Maps/MODULE.md), [12-Subscription-Payments](../12-Subscription-Payments/MODULE.md), [16-Manager-Portal](../16-Manager-Portal/MODULE.md), [17-Admin-HQ](../17-Admin-HQ/MODULE.md)

**This feature** — [Use cases](use-cases.md), [Flows](flows.md), [Evidence](evidence.md), [Limits](limits.md), [Known issues](known-issues.md)

**MCP** — [20-MCP](../20-MCP/MODULE.md), tool contract in [api-surfaces.md](../20-MCP/api-surfaces.md)

**Code** — [ROUTEMAP.md](../../knowledge/code/ROUTEMAP.md) (look for `AILeadFinderController`, `CompanylController`), [CODEMAP.md](../../knowledge/code/CODEMAP.md), [engineering/README.md](../../knowledge/code/README.md)

**Terms / roles** — [glossary.md](../../product/glossary.md), [roles.md](../../product/roles.md), [OVERVIEW.md](../../product/OVERVIEW.md)
