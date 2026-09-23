---
title: "08 — Lists"
---

# 08 — Lists

## Purpose

A **List** is a named group of companies. It is not a driving order. Use it for territories, campaigns, or “today’s accounts”, then optionally **generate a route** from it.

## Who

Sales Agent, Business Sales Agent.

## Functionality

### Create

- List name (required)
- At least **one** company
- Map + picker (same location/status idea as routes)
- Logged as “Created List”

### Index

- Title (unread if never opened)
- Company count
- Totals: lists, unread lists, companies-on-lists
- View, edit, delete

### View

- Member companies (full company actions)
- Add more companies, or remove one / many
- Map
- Download CSV
- Generate route (copies members into a new route, then the same optimizer/publish path)

### Add to list from elsewhere

Address Book, Find Leads, company save: pick an existing list or create a new one.

Deleting a list does **not** delete the companies.

## Rules

- Do not store driving order on list membership.
- Generate-route must use the same optimize/publish path as a normal route.

## Code

`ListController`, `UserList`, `UserListCompanies`, `UserListRoute`.

## Related

**Modules** — [03-Company-AddressBook](../03-Company-AddressBook/MODULE.md), [05-Find-Leads](../05-Find-Leads/MODULE.md), [07-Routes](../07-Routes/MODULE.md), [11-Maps](../11-Maps/MODULE.md)

**This feature** — [Use cases](use-cases.md), [Flows](flows.md), [Evidence](evidence.md)

**MCP** — [20-MCP](../20-MCP/MODULE.md), tool contract in [api-surfaces.md](../20-MCP/api-surfaces.md)

**Code** — [ROUTEMAP.md](../../knowledge/code/ROUTEMAP.md) (look for `ListController`), [CODEMAP.md](../../knowledge/code/CODEMAP.md), [engineering/README.md](../../knowledge/code/README.md)

**Terms / roles** — [glossary.md](../../product/glossary.md), [OVERVIEW.md](../../product/OVERVIEW.md)
