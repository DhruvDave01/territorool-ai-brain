---
title: "03 — Company (Address Book)"
---

# 03 — Company (Address Book)

## Purpose

The Address Book is the core object. Every lead from Find Leads, CSV, CRM, manual add, or AI tools becomes a **company**. Contacts, notes, visits, lists, and routes hang off companies. The same company record is what every client reads and writes.

## Who

Sales Agent, Business Sales Agent. Managers assign leads into a **rep’s** book; they do not use this grid as their own CRM.

## Functionality

### Browse companies

- Searchable, filterable list (name, address, phone, status, category, dates, LinkedIn, website).
- Filters: employees, annual revenue, status, open/closed hours, industry, sort.
- Select many (including select-all).
- Status color from the user’s status catalog.
- Open a company for full detail.

### Header actions

- Add Company
- Find Leads
- Find Contacts (bulk on selected / eligible companies)
- View import errors if a CSV session is still open

### Bulk actions

- Delete selected
- Add to an existing route or create a route
- View on map
- Add to an existing list or create a list

### Add / edit fields

**Required:** company name, address (Places fills latitude, longitude, postal code, place id). Name can be locked so autocomplete does not overwrite it.

**Optional:** annual revenue, website, industry, phone, LinkedIn, employees, status, category.

On save, the company can be attached to a list and/or a route immediately.

Duplicates are handled mainly in CSV import (merge / append / delete). Manual add creates a row unless existing checks fire.

Temp/import rows (`is_temp_company`) stay out of the live book until committed.

### Company detail

- Name, address (open in maps), website, phone, LinkedIn, industry, employees, revenue, hours
- Change status
- Contacts: view, add, edit, delete, report bad data
- Notes
- Activities / log meetings
- Mark as visited (and visit history)
- Social URLs
- Report incorrect company
- Activity timeline

### Notes

Create, edit, delete, list, bulk remove. Types include normal notes and reminder-style notes. Dated notes show on the Dashboard upcoming list.

### Visits

Mark visited, list history, delete a visit or all visits. Used heavily on a route stop as well as from the company itself.

### Activities (log meeting)

Types: Log Meeting, Call, Visit, Reminder, Appointment. Create, edit, delete, list, clear. Dated items feed Dashboard upcoming.

### Contacts on a company

Manual add/edit/delete, report, and **Find / buy contacts** (see module 09). Unassigned contacts (no company) are also supported.

### Maps

- Selected companies
- Entire Address Book
- Recently added set

### Add to route or list

From the list, detail, or Find Leads. Adding or removing route stops flags the route so it **must be regenerated**.

## Rules

- New fields must be saved on every create/update path (form, bulk, CRM, AI tools) so clients stay in sync.
- Delete must clean list membership and route stops the way existing delete already does.
- Live lists only include non-temp companies.

## Code

`CompanylController` (historical name), `Company` model, company list view, shared modals, `modalScript.js`.

## Related

**Modules** — [04-Contacts](../04-Contacts/MODULE.md), [05-Find-Leads](../05-Find-Leads/MODULE.md), [06-Recently-Added](../06-Recently-Added/MODULE.md), [07-Routes](../07-Routes/MODULE.md), [08-Lists](../08-Lists/MODULE.md), [09-Contact-Enrichment-Credits](../09-Contact-Enrichment-Credits/MODULE.md), [10-Bulk-Upload](../10-Bulk-Upload/MODULE.md), [11-Maps](../11-Maps/MODULE.md), [14-Settings-Profile](../14-Settings-Profile/MODULE.md), [13-CRM-Integrations](../13-CRM-Integrations/MODULE.md)

**This feature** — [Use cases](use-cases.md), [Flows](flows.md), [Evidence](evidence.md), [Known issues](known-issues.md)

**MCP** — [20-MCP](../20-MCP/MODULE.md), tool contract in [api-surfaces.md](../20-MCP/api-surfaces.md)

**Code** — [ROUTEMAP.md](../../knowledge/code/ROUTEMAP.md) (look for `CompanylController`), [CODEMAP.md](../../knowledge/code/CODEMAP.md), [engineering/README.md](../../knowledge/code/README.md)

**Terms / roles** — [glossary.md](../../product/glossary.md), [OVERVIEW.md](../../product/OVERVIEW.md)
