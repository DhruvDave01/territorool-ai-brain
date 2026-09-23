---
title: "10 — Bulk Upload (Companies and Contacts)"
---

# 10 — Bulk Upload (Companies and Contacts)

## Purpose

Import many companies or contacts from CSV/Excel, map columns, preview, commit, then repair rows that failed (geocode, duplicates, missing fields). Work sits in a **session** until success or discard.

## Who

Sales Agent, Business Sales Agent. Nav shows “companies with errors” while a company session exists.

## Company import

1. Download sample (current or older format)
2. Upload file
3. Map columns to TerriTool fields
4. Preview
5. Validate / geocode into the session
6. Finish (optional Salesforce finish)
7. Discard the whole session or delete one bad row

## Repair failed company rows

Typical problems: missing/invalid address, failed geocode, duplicate, bad phone, missing name, unknown city.

Actions:

- Edit one row or bulk-fix
- Autofill address from Google
- Autofill company from Places
- Delete duplicate
- Merge contacts onto an existing company
- Append as a new company anyway
- Bulk delete error rows

## Contact import

Same pattern: upload → map → validate → finish (optional Salesforce) → success or error list. Phones and titles are cleaned the same way as manual add.

## Related behavior

- Salesforce dataloader-style company/contact import
- HubSpot sync failures use the same idea: list errors, delete, fix
- Successful company import can be sent into **create route**

## Rules

- Do not skip geocode. No lat/lng means maps and routes break.
- Keep sample files in sync with mapper keys.
- Discarding a session must remove session rows and temp files.

## Code

`CompanylController` / `ContactController` step + error methods, `Helper` autofill/merge/append/duplicate, `UserSession`, `CompaniesSession`, `ContactsSession`.

## Related

**Modules** — [03-Company-AddressBook](../03-Company-AddressBook/MODULE.md), [04-Contacts](../04-Contacts/MODULE.md), [07-Routes](../07-Routes/MODULE.md), [11-Maps](../11-Maps/MODULE.md), [13-CRM-Integrations](../13-CRM-Integrations/MODULE.md)

**This feature** — [Use cases](use-cases.md), [Flows](flows.md)

**Code** — [ROUTEMAP.md](../../knowledge/code/ROUTEMAP.md) (look for `CompanylController`, `ContactController`), [CODEMAP.md](../../knowledge/code/CODEMAP.md), [engineering/README.md](../../knowledge/code/README.md)

**Terms / roles** — [glossary.md](../../product/glossary.md), [OVERVIEW.md](../../product/OVERVIEW.md)
