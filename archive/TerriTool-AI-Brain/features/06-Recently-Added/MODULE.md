---
title: "06 — Recently Added"
---

# 06 — Recently Added

## Purpose

Work the newest companies and contacts without scanning the full Address Book.

## Who

Sales Agent, Business Sales Agent.

## Functionality

### Recent companies

- Same actions as Address Book: status, filters, add to list/route, find contacts, delete
- Map of this recent set only
- Ordered by newest `created_at` for this user

### Recent contacts

- Newest people
- Open parent company, edit, delete

Nav: Recently Added → Companies / Contacts.

## Rules

- Filters stay aligned with the main Address Book so behavior does not drift.
- Always this user’s records only.

## Code

`CompanylController` recent list/map, `ContactController` recent list.

## Related

**Modules** — [03-Company-AddressBook](../03-Company-AddressBook/MODULE.md), [04-Contacts](../04-Contacts/MODULE.md), [11-Maps](../11-Maps/MODULE.md)

**This feature** — [Use cases](use-cases.md), [Evidence](evidence.md)

**MCP** — [20-MCP](../20-MCP/MODULE.md), tool contract in [api-surfaces.md](../20-MCP/api-surfaces.md)

**Code** — [ROUTEMAP.md](../../knowledge/code/ROUTEMAP.md) (look for `CompanylController`, `ContactController`), [CODEMAP.md](../../knowledge/code/CODEMAP.md), [engineering/README.md](../../knowledge/code/README.md)

**Terms / roles** — [glossary.md](../../product/glossary.md), [OVERVIEW.md](../../product/OVERVIEW.md)
