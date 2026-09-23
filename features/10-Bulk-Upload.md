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

**Modules** — 03-Company-AddressBook, 04-Contacts, 07-Routes, 11-Maps, 13-CRM-Integrations

**This feature** — Use cases, Flows

**Code** — ROUTEMAP.md (look for `CompanylController`, `ContactController`), CODEMAP.md, engineering/README.md

**Terms / roles** — glossary.md, OVERVIEW.md

## Screens

Per surface. "File" is under `TerriTool/App/components/` for mobile; the full map is [mobile screens](../code/mobile-screens.md). Strings are copied from code on 2026-09-22; a loading cell that reads `screen.x.loading` is the `testID` on that screen's `ActivityIndicator`. Copy these strings; do not write new ones.

| Surface | Screen | Still | Primary action | Loading | Empty | Error |
|---|---|---|---|---|---|---|
| Classic web | Upload companies and the errors grid | [upload errors](../screenshots/web/sales-agent/web_05_uploadcompany-uploaderrors_w1440.png) | Upload CSV, fix rows | `#cover-spin` | Grid empty | Row-level error text in the grid |

No mobile screen. The mobile app calls `bulk-companies-create` only from Find Leads.

## Screenshots in this brain

Open the image before drawing UI. The filename is a capture time, not a layout spec. Pixels win.

- [Screenshot 2026-09-15 at 1.05.25 PM.png](<../screenshots/feature-evidence/10-Bulk-Upload/evidence/Screenshot 2026-09-15 at 1.05.25 PM.png>)
- [Screenshot 2026-09-15 at 1.07.32 PM.png](<../screenshots/feature-evidence/10-Bulk-Upload/evidence/Screenshot 2026-09-15 at 1.07.32 PM.png>)
- [Screenshot 2026-09-15 at 1.07.45 PM.png](<../screenshots/feature-evidence/10-Bulk-Upload/evidence/Screenshot 2026-09-15 at 1.07.45 PM.png>)
- [Screenshot 2026-09-15 at 1.09.27 PM.png](<../screenshots/feature-evidence/10-Bulk-Upload/evidence/Screenshot 2026-09-15 at 1.09.27 PM.png>)
- [TerriTool-09-15-2026_01_07_PM (1).png](<../screenshots/feature-evidence/10-Bulk-Upload/evidence/TerriTool-09-15-2026_01_07_PM (1).png>)
- [TerriTool-09-15-2026_01_07_PM.png](<../screenshots/feature-evidence/10-Bulk-Upload/evidence/TerriTool-09-15-2026_01_07_PM.png>)
- [TerriTool-09-15-2026_01_09_PM.png](<../screenshots/feature-evidence/10-Bulk-Upload/evidence/TerriTool-09-15-2026_01_09_PM.png>)
- [12-upload-excel-csv.png](<../screenshots/feature-evidence/10-Bulk-Upload/flows/png/12-upload-excel-csv.png>)

## Generate from this brain

- UI rule: [UI/UX Guardian](../brains/ui-ux-guardian.md)
- Screenshot method: [screenshot review](../screenshots/REVIEW.md)
- Mobile implementation: [mobile code review](../code/mobile-review.md)
- Web implementation: [web code review](../code/web-review.md)
- Role: [User](../roles/user.md) · [Manager](../roles/manager.md) · [Admin](../roles/admin.md)
