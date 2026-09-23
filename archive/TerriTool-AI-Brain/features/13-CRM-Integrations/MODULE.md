---
title: "13 — CRM Integrations"
---

# 13 — CRM Integrations

## Purpose

Keep TerriTool companies/contacts (and HubSpot notes/meetings) in sync with an external CRM. Pipedrive is **not** implemented; do not assume it works.

## Who

Sales Agent, Business Sales Agent, from Settings.

## Salesforce

- Connect: username, password, security token
- Disconnect
- Sync companies
- Sync contacts
- Dataloader-style import
- Finish a CSV import into Salesforce
- Zapier can create a company or contact (legacy; treat as sensitive)

## HubSpot

- Connect with OAuth (contacts and companies read/write, owners read)
- First connect: **field mapping is required** before sync
- Disconnect
- Sync companies, contacts, or **both**
- Also notes and log meetings
- Last-sync timestamps
- Failed rows: list, delete, fix (same idea as CSV errors)
- Scheduled job can repeat company/contact sync

## KarmaCRM

- Connect with API key
- Disconnect
- Sync contacts
- Sync companies (geocoded into cities)

## Rules

- After HubSpot connect, always mapping first if it is not done.
- Sync is per user and must respect the mapping table.
- Never log tokens.
- Scheduled HubSpot sync must reuse the same insert/update as the manual sync.

## Code

`SfdcController`, `HubSpotController`, `KarmaCrmController`, `HubspotMapping`, `HubspotSyncDetail`, `SyncFailure`.

## Related

**Modules** — [02-Dashboard](../02-Dashboard/MODULE.md), [03-Company-AddressBook](../03-Company-AddressBook/MODULE.md), [04-Contacts](../04-Contacts/MODULE.md), [10-Bulk-Upload](../10-Bulk-Upload/MODULE.md), [14-Settings-Profile](../14-Settings-Profile/MODULE.md), [19-Cron-Jobs-Webhooks](../19-Cron-Jobs-Webhooks/MODULE.md)

**This feature** — [Use cases](use-cases.md), [Flows](flows.md), [Evidence](evidence.md)

**Code** — [ROUTEMAP.md](../../knowledge/code/ROUTEMAP.md) (look for `SfdcController`, `HubSpotController`, `KarmaCrmController`), [CODEMAP.md](../../knowledge/code/CODEMAP.md), [engineering/README.md](../../knowledge/code/README.md)

**Terms / roles** — [glossary.md](../../product/glossary.md), [OVERVIEW.md](../../product/OVERVIEW.md)
