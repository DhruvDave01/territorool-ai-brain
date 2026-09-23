---
title: "14 — Settings and Profile"
---

# 14 — Settings and Profile

## Purpose

The signed-in user’s profile, labels (statuses, categories, stages), subscription controls, CRM, preferences, and optional AI-tool connections.

## Who

- Sales Agent / Business Sales Agent — own settings
- Business Agent — manager settings (same save, manager home)
- Admin can edit a user in HQ

Always the **signed-in** user. A user id in the URL is ignored or forbidden (IDOR).

## Functionality

### Profile

Name, email, phone, address, country (drives Places country), password.

### Subscription panel

Plan name, dates, status, cancel (correct provider), credits for the current window, invoices, upgrade / add credits (RevenueCat users get manage-plan, not Stripe).

### Company statuses

Defaults: Active, High Priority, Idle, Potential, Reject, Unclassified (optional Gold). Rename labels, change colors, add extra statuses. Invalid hex is rejected. These colors drive the Address Book, maps, filters, and status updates everywhere.

### Company categories

User-defined types (e.g. Prospect). Set on each company.

### Contact stages

User-defined pipeline; used on contacts and HubSpot mapping.

### CRM

Connect/sync Salesforce, HubSpot, KarmaCRM — module 13.

### Preferences

JSON on the user (onboarding, hide tour, AI defaults). Can be updated from Settings or after signup.

### MCP connections (if enabled)

Connect external AI tools, refresh their tool list, chat, OAuth callback. Stored per user. That is **in-app custom MCP**, not native Salesforce. Customer Claude/Cursor tools and credit rules: [20-MCP](../20-MCP/MODULE.md), [api-surfaces.md](../20-MCP/api-surfaces.md).

## Rules

- Never trust a user id in the URL for self-settings.
- Changing a status color must not break companies that still point at that status id.
- Manager save stays in the manager area.

## Code

`SalespersonController`, settings view, `McpClient` connection UI.

## Related

**Modules** — [01-Authentication-Onboarding](../01-Authentication-Onboarding/MODULE.md), [03-Company-AddressBook](../03-Company-AddressBook/MODULE.md), [04-Contacts](../04-Contacts/MODULE.md), [12-Subscription-Payments](../12-Subscription-Payments/MODULE.md), [13-CRM-Integrations](../13-CRM-Integrations/MODULE.md), [16-Manager-Portal](../16-Manager-Portal/MODULE.md)

**This feature** — [Use cases](use-cases.md)

**MCP** — [20-MCP](../20-MCP/MODULE.md), tool contract in [api-surfaces.md](../20-MCP/api-surfaces.md)

**Code** — [ROUTEMAP.md](../../knowledge/code/ROUTEMAP.md) (look for `SalespersonController`), [CODEMAP.md](../../knowledge/code/CODEMAP.md), [engineering/README.md](../../knowledge/code/README.md)

**Terms / roles** — [glossary.md](../../product/glossary.md), [roles.md](../../product/roles.md), [OVERVIEW.md](../../product/OVERVIEW.md)
