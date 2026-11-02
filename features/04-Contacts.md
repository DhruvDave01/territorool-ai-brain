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

Not a separate “enrichment page”. Started from company detail, bulk selection, a route stop, or Find Leads. Live fetch: FullEnrich **2** credits / Claude **1** credit. Buy is not free. See [09](09-Contact-Enrichment-Credits.md).

- A website of “Not entered” counts as no website, so no FullEnrich search runs. Web `Helper::getFullEnrichContactSearch` blanks any domain containing “Not entered” and returns no contacts for an empty domain (`app/Globals/Helper.php:984-1001`, `0c969fd2`, `a651dba4`, on master). On TT_80 company detail also sends an empty `domain` (`customcompany/index.js:1478`, `ed2edffd`).
- While a bought contact is still being saved, the company's Contacts tab shows “{name} · Adding…” (or “Adding…”) and “This usually takes a moment. It will show up here when ready.” (`customcompany/index.js:4807-4833`, `a216adf3`, on Production).
- Route and list detail contact counts (`total_contacts` from `simplerouteview`) skip soft-deleted contacts since web `4a1856f4` (on master; `app/Api/V2/Controllers/RouteController.php:353`, `380`, `393`).
- The provider logos on the mobile Find Contacts loaders are in `App/images/fetchSources/`, mapped in `App/utils/findContactsFetchSourceLogos.js`.

Source: [live code 2026-11-02](../reviews/live-code-2026-11-02.md).

## Rules

- Phone cleaning must match CSV import.
- Company delete follows existing contact cleanup.

## Code

`ContactController`, `CompanylController` contact store/update/delete, `Contacts` model, contact and company modals.

## Related

**Modules** — 03-Company-AddressBook, 06-Recently-Added, 09-Contact-Enrichment-Credits, 10-Bulk-Upload, 13-CRM-Integrations, 14-Settings-Profile

**This feature** — Use cases, Evidence

**MCP** — 20-MCP, tool contract in api-surfaces.md

**Code** — ROUTEMAP.md (look for `ContactController`, `CompanylController`), CODEMAP.md, engineering/README.md

**Terms / roles** — glossary.md, OVERVIEW.md

## Screens

Per surface. "File" is under `TerriTool/App/components/` for mobile; the full map is [mobile screens](../code/mobile-screens.md). Strings are copied from code on 2026-09-22, and the mobile strings were checked again against TT_80 on 2026-11-02 ([live code 2026-11-02](../reviews/live-code-2026-11-02.md)); a loading cell that reads `screen.x.loading` is the `testID` on that screen's `ActivityIndicator`. Copy these strings; do not write new ones.

| Surface | Screen | File / still | Primary action | Loading | Empty | Error |
|---|---|---|---|---|---|---|
| Mobile | `ContactsView` | `contacts/view.js` · [AddressBookFlow](<../screenshots/mobile-owner/AddressBookFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.19.27.png>) | Call, email, buy details | `screen.contactsView.loading` | "No Contact"; "No notes yet."; "No status" | "Oops! Something went wrong. Please check your internet connection or try again." (toast); "Oops! Something went wrong. Please try again." |
| Mobile | `ContactsCreate` / `ContactsUpdate` | `contacts/create.js`, `contacts/update.js` | Save (free) | — | — | "Oops! Something went wrong. Please check your internet connection or try again." (toast) |
| Mobile | `BusinessCard` / `CustomCompany` | `company/businessCard/index.js`, `customcompany/index.js` · [ScanCardFlow](<../screenshots/mobile-owner/ScanCardFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.49.27.png>) | Scan, confirm, save | `screen.customCompany.loading` … `loadingH` | — | "We are trying to find a mobile number for you. Please try again."; "Could not load that route. Please try again." |
| Mobile | `bizContacts` / `bizCompanies` / `CongContact` | `route/bizContact/index.js`, `route/bizContact/bizCompanies.js`, `route/congContact/index.js` | Pick a contact to buy | `screen.bizContacts.loading`, `screen.bizCompanies.loading` | — (per field on `CongContact`: "No phone found", "No email found", "No LinkedIn found", `congContact/index.js:2622-2636`) | "Could not refresh contacts. Please try again."; "Could not save this contact. Please try again."; "Oops! Something went wrong. Please check your internet connection or try again." (`bizContact/index.js:355`, `:612`, `:712`) |
| Classic web | `/contact` | [web_04_contact](../screenshots/web/sales-agent/web_04_contact_w1440.png) | Grid row actions | `#cover-spin` | Grid empty | Flash message |

## Screenshots in this brain

Open the image before drawing UI. The filename is a capture time, not a layout spec. Pixels win.

- [IMG_4586.PNG](<../screenshots/feature-evidence/04-Contacts/evidence/IMG_4586.PNG>)
- [IMG_4596.PNG](<../screenshots/feature-evidence/04-Contacts/evidence/IMG_4596.PNG>)
- [IMG_4598.PNG](<../screenshots/feature-evidence/04-Contacts/evidence/IMG_4598.PNG>)
- [IMG_4599.PNG](<../screenshots/feature-evidence/04-Contacts/evidence/IMG_4599.PNG>)
- [IMG_4600.PNG](<../screenshots/feature-evidence/04-Contacts/evidence/IMG_4600.PNG>)
- [IMG_4606.PNG](<../screenshots/feature-evidence/04-Contacts/evidence/IMG_4606.PNG>)
- [IMG_4607.PNG](<../screenshots/feature-evidence/04-Contacts/evidence/IMG_4607.PNG>)
- [Screenshot 2026-09-15 at 11.07.54 AM.png](<../screenshots/feature-evidence/04-Contacts/evidence/Screenshot 2026-09-15 at 11.07.54 AM.png>)
- [Screenshot 2026-09-15 at 11.11.41 AM.png](<../screenshots/feature-evidence/04-Contacts/evidence/Screenshot 2026-09-15 at 11.11.41 AM.png>)
- [Screenshot 2026-09-15 at 12.58.37 PM.png](<../screenshots/feature-evidence/04-Contacts/evidence/Screenshot 2026-09-15 at 12.58.37 PM.png>)
- [Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.49.27.png](<../screenshots/feature-evidence/04-Contacts/evidence/mobile/ScanCardFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.49.27.png>)
- [Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.49.32.png](<../screenshots/feature-evidence/04-Contacts/evidence/mobile/ScanCardFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.49.32.png>)
- 9 more stills are in `../screenshots/feature-evidence/04-Contacts/`.

## Generate from this brain

- UI rule: [UI/UX Guardian](../brains/ui-ux-guardian.md)
- Screenshot method: [screenshot review](../screenshots/REVIEW.md)
- Mobile implementation: [mobile code review](../code/mobile-review.md)
- Web implementation: [web code review](../code/web-review.md)
- Role: [User](../roles/user.md) · [Manager](../roles/manager.md) · [Admin](../roles/admin.md)
