---
title: "04 — Contacts"
---

# 04 — Contacts

## Purpose

People at companies. They can be added by hand, CSV, CRM sync, or redeemed from enrichment. Same contact record everywhere.

## Who

Sales Agent, Business Sales Agent.

## Functionality

### Contact list

- All contacts for the signed-in user
- Company name, phone, email, position, stage
- Open, edit, delete, bulk delete
- Jump to the parent company

### Create / edit

- Name
- Email
- Phone (normalized the same way as CSV import)
- Position / title
- Contact stage
- Company (optional — unassigned contacts are allowed)
- Notes
- LinkedIn / extra fields as on the form

Default stage if none is chosen.

### Stages (per user, editable in Settings)

Default set: Subscriber, Lead, Marketing Qualified Lead, Sales Qualified Lead, Opportunity, Customer, Evangelist, Other. HubSpot mapping uses these.

### Appointment email

From contact detail, send an appointment / outreach email.

### Report contact

Flag a wrong or bad person (same idea as report company).

### Recently added contacts

Shortcut list of newest people (module 06).

### Find / buy contacts

Not a separate “enrichment page”. Started from company detail, bulk selection, a route stop, or Find Leads. Live fetch: FullEnrich **2** credits / Claude **1** credit. Buy is not free. See **09**.

## Rules

- Phone cleaning must match CSV import.
- Company delete follows existing contact cleanup.

## Code

`ContactController`, `CompanylController` contact store/update/delete, `Contacts` model, contact and company modals.

## Related

**Modules** — [03-Company-AddressBook](../03-Company-AddressBook/MODULE.md), [06-Recently-Added](../06-Recently-Added/MODULE.md), [09-Contact-Enrichment-Credits](../09-Contact-Enrichment-Credits/MODULE.md), [10-Bulk-Upload](../10-Bulk-Upload/MODULE.md), [13-CRM-Integrations](../13-CRM-Integrations/MODULE.md), [14-Settings-Profile](../14-Settings-Profile/MODULE.md)

**This feature** — [Use cases](use-cases.md), [Evidence](evidence.md)

**MCP** — [20-MCP](../20-MCP/MODULE.md), tool contract in [api-surfaces.md](../20-MCP/api-surfaces.md)

**Code** — [ROUTEMAP.md](../../knowledge/code/ROUTEMAP.md) (look for `ContactController`, `CompanylController`), [CODEMAP.md](../../knowledge/code/CODEMAP.md), [engineering/README.md](../../knowledge/code/README.md)

**Terms / roles** — [glossary.md](../../product/glossary.md), [OVERVIEW.md](../../product/OVERVIEW.md)
