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

**Modules** — 02-Dashboard, 03-Company-AddressBook, 04-Contacts, 10-Bulk-Upload, 14-Settings-Profile, 19-Cron-Jobs-Webhooks

**This feature** — Use cases, Flows, Evidence

**Code** — ROUTEMAP.md (look for `SfdcController`, `HubSpotController`, `KarmaCrmController`), CODEMAP.md, engineering/README.md

**Terms / roles** — glossary.md, OVERVIEW.md

## Screens

Per surface. "File" is under `TerriTool/App/components/` for mobile; the full map is [mobile screens](../code/mobile-screens.md). Strings are copied from code on 2026-09-22; a loading cell that reads `screen.x.loading` is the `testID` on that screen's `ActivityIndicator`. Copy these strings; do not write new ones.

| Surface | Screen | Still | Primary action | Loading | Empty | Error |
|---|---|---|---|---|---|---|
| Classic web | CRM panel on `/settings` | feature-evidence 13 flows | Connect, sync | `#cover-spin` | Not connected | Sync error list |
| Mobile | HubSpot error row on Settings | `dashboard/editstatus.js`, `screen.editStatus.hubspotSyncErrorRow` | Fix or delete the failed company | — | Row hidden | Row text from `hubspot-sync-error-list` |

Connecting a CRM is web-only. The phone only surfaces sync errors.

## Screenshots in this brain

Open the image before drawing UI. The filename is a capture time, not a layout spec. Pixels win.

- [Screenshot 2026-09-15 at 1.15.42 PM.png](<../screenshots/feature-evidence/13-CRM-Integrations/evidence/Screenshot 2026-09-15 at 1.15.42 PM.png>)
- [Screenshot 2026-09-15 at 1.16.19 PM.png](<../screenshots/feature-evidence/13-CRM-Integrations/evidence/Screenshot 2026-09-15 at 1.16.19 PM.png>)
- [Screenshot 2026-09-15 at 1.16.26 PM.png](<../screenshots/feature-evidence/13-CRM-Integrations/evidence/Screenshot 2026-09-15 at 1.16.26 PM.png>)
- [Screenshot 2026-09-15 at 1.16.55 PM.png](<../screenshots/feature-evidence/13-CRM-Integrations/evidence/Screenshot 2026-09-15 at 1.16.55 PM.png>)
- [Screenshot 2026-09-15 at 11.09.14 AM.png](<../screenshots/feature-evidence/13-CRM-Integrations/evidence/Screenshot 2026-09-15 at 11.09.14 AM.png>)
- [Screenshot 2026-09-15 at 11.09.24 AM.png](<../screenshots/feature-evidence/13-CRM-Integrations/evidence/Screenshot 2026-09-15 at 11.09.24 AM.png>)
- [Screenshot 2026-09-15 at 11.09.35 AM.png](<../screenshots/feature-evidence/13-CRM-Integrations/evidence/Screenshot 2026-09-15 at 11.09.35 AM.png>)
- [09-settings-mcp-crm.png](<../screenshots/feature-evidence/13-CRM-Integrations/flows/png/09-settings-mcp-crm.png>)

## Generate from this brain

- UI rule: [UI/UX Guardian](../brains/ui-ux-guardian.md)
- Screenshot method: [screenshot review](../screenshots/REVIEW.md)
- Mobile implementation: [mobile code review](../code/mobile-review.md)
- Web implementation: [web code review](../code/web-review.md)
- Role: [User](../roles/user.md) · [Manager](../roles/manager.md) · [Admin](../roles/admin.md)
