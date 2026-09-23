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

**Modules** — 04-Contacts, 05-Find-Leads, 06-Recently-Added, 07-Routes, 08-Lists, 09-Contact-Enrichment-Credits, 10-Bulk-Upload, 11-Maps, 14-Settings-Profile, 13-CRM-Integrations

**This feature** — Use cases, Flows, Evidence, Known issues

**MCP** — 20-MCP, tool contract in api-surfaces.md

**Code** — ROUTEMAP.md (look for `CompanylController`), CODEMAP.md, engineering/README.md

**Terms / roles** — glossary.md, OVERVIEW.md

## Screens

Per surface. "File" is under `TerriTool/App/components/` for mobile; the full map is [mobile screens](../code/mobile-screens.md). Strings are copied from code on 2026-09-22; a loading cell that reads `screen.x.loading` is the `testID` on that screen's `ActivityIndicator`. Copy these strings; do not write new ones.

| Surface | Screen | File / still | Primary action | Loading | Empty | Error |
|---|---|---|---|---|---|---|
| Mobile | `ListCompany` (Address Book) | `company/list.js` · [AddressBookFlow](<../screenshots/mobile-owner/AddressBookFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.19.27.png>) | Open a company; header add menu (Add Company / Find Leads) | `screen.companyList.loading`, "Searching..." | "No companies found matching your filters." (`screen.companyList.loadingEmpty`); search: "No matching results found..." | "Oops! Something went wrong. Please check your internet connection or try again." (toast) |
| Mobile | `ViewCompany` | `company/view.js` · [AddressBookFlow](<../screenshots/mobile-owner/AddressBookFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.19.27.png>) | Status, notes, contacts, navigate | `screen.companyView.loading` | "No visit recorded yet"; contacts: `screen.companyList.loadingEmptyContacts` | "Oops! Something went wrong. Please check your internet connection or try again." (toast); "Unable to submit report. Please try again." |
| Mobile | `CreateCompany` | `company/create/index.js` · [AddCompany](<../screenshots/mobile-owner/AddCompany/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.51.04.png>) | Save | `screen.companyCreate.loading` | — | "Oops! Something went wrong. Please check your internet connection or try again." (toast); address validation lines |
| Mobile | `EditCompany` | `company/edit.js` | Save | — | — | "Oops! Something went wrong. Please check your internet connection or try again." (toast) |
| Classic web | `/company` | [web_03_company](../screenshots/web/sales-agent/web_03_company_w1440.png), [classic company list](../screenshots/web-stills/04-classic-company-list.png) | jqxGrid row actions | `#cover-spin` | jqxGrid "No data to display" | Flash message |
| Manager | Rep's companies inside `/manager/salespeople/{id}` | [Anna's profile](../screenshots/web-owner/Manager/Anna-s-Profile-TerriTool-09-15-2026_01_27_PM.png) | Open the rep | "Loading companies…" | "No companies found." | "Could not load companies. Please refresh the page." |

## Screenshots in this brain

Open the image before drawing UI. The filename is a capture time, not a layout spec. Pixels win.

- [IMG_4587.PNG](<../screenshots/feature-evidence/03-Company-AddressBook/evidence/IMG_4587.PNG>)
- [IMG_4588.PNG](<../screenshots/feature-evidence/03-Company-AddressBook/evidence/IMG_4588.PNG>)
- [IMG_4595.PNG](<../screenshots/feature-evidence/03-Company-AddressBook/evidence/IMG_4595.PNG>)
- [IMG_4732.PNG](<../screenshots/feature-evidence/03-Company-AddressBook/evidence/IMG_4732.PNG>)
- [Screenshot 2026-09-15 at 11.07.12 AM.png](<../screenshots/feature-evidence/03-Company-AddressBook/evidence/Screenshot 2026-09-15 at 11.07.12 AM.png>)
- [Screenshot 2026-09-15 at 11.07.26 AM.png](<../screenshots/feature-evidence/03-Company-AddressBook/evidence/Screenshot 2026-09-15 at 11.07.26 AM.png>)
- [Screenshot 2026-09-15 at 11.07.36 AM.png](<../screenshots/feature-evidence/03-Company-AddressBook/evidence/Screenshot 2026-09-15 at 11.07.36 AM.png>)
- [Screenshot 2026-09-15 at 11.08.09 AM.png](<../screenshots/feature-evidence/03-Company-AddressBook/evidence/Screenshot 2026-09-15 at 11.08.09 AM.png>)
- [Screenshot 2026-09-15 at 11.10.43 AM.png](<../screenshots/feature-evidence/03-Company-AddressBook/evidence/Screenshot 2026-09-15 at 11.10.43 AM.png>)
- [Screenshot 2026-09-15 at 11.10.56 AM.png](<../screenshots/feature-evidence/03-Company-AddressBook/evidence/Screenshot 2026-09-15 at 11.10.56 AM.png>)
- [Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.19.27.png](<../screenshots/feature-evidence/03-Company-AddressBook/evidence/mobile/AddressBookFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.19.27.png>)
- [Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.19.30.png](<../screenshots/feature-evidence/03-Company-AddressBook/evidence/mobile/AddressBookFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.19.30.png>)
- 27 more stills are in `../screenshots/feature-evidence/03-Company-AddressBook/`.

## Generate from this brain

- UI rule: [UI/UX Guardian](../brains/ui-ux-guardian.md)
- Screenshot method: [screenshot review](../screenshots/REVIEW.md)
- Mobile implementation: [mobile code review](../code/mobile-review.md)
- Web implementation: [web code review](../code/web-review.md)
- Role: [User](../roles/user.md) · [Manager](../roles/manager.md) · [Admin](../roles/admin.md)
