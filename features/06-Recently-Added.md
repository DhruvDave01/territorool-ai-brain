# 06 — Recently Added

## Purpose

Work the newest companies and contacts without scanning the full Address Book.

## Who

Sales Agent, Business Sales Agent.

## Functionality

### Recent companies

- Same actions as Address Book: status, filters, add to list/route, find contacts, delete
- Map of this recent set only
- Ordered by newest `created_at` for this user

### Recent contacts

- Newest people
- Open parent company, edit, delete

Nav: Recently Added → Companies / Contacts.

## Rules

- Filters stay aligned with the main Address Book so behavior does not drift.
- Always this user’s records only.

## Code

`CompanylController` recent list/map, `ContactController` recent list.

## Related

**Modules** — 03-Company-AddressBook, 04-Contacts, 11-Maps

**This feature** — Use cases, Evidence

**MCP** — 20-MCP, tool contract in api-surfaces.md

**Code** — ROUTEMAP.md (look for `CompanylController`, `ContactController`), CODEMAP.md, engineering/README.md

**Terms / roles** — glossary.md, OVERVIEW.md

## Screens

Per surface. "File" is under `TerriTool/App/components/` for mobile; the full map is [mobile screens](../code/mobile-screens.md). Strings are copied from code on 2026-09-22; a loading cell that reads `screen.x.loading` is the `testID` on that screen's `ActivityIndicator`. Copy these strings; do not write new ones.

| Surface | Screen | File / still | Primary action | Loading | Empty | Error |
|---|---|---|---|---|---|---|
| Mobile | Recently Added tile | `dashboard/index.js` pushes `CreateCompany` (add) and `ListCompany` (browse) · [Dashboard](<../screenshots/mobile-owner/Dashboard/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-22 at 13.45.00.png>) | Open the newest companies | as Address Book | as Address Book | as Address Book |
| Classic web | `/recent-company`, `/recent-contact` | [web_07_recent-company](../screenshots/web/sales-agent/web_07_recent-company_w1440.png), [web_08_recent-contact](../screenshots/web/sales-agent/web_08_recent-contact_w1440.png) | Grid row actions | `#cover-spin` | Grid empty | Flash message |

There is no separate mobile "Recently Added" screen. Copy the Address Book list.

## Screenshots in this brain

Open the image before drawing UI. The filename is a capture time, not a layout spec. Pixels win.

- [Screenshot 2026-09-15 at 11.07.00 AM.png](<../screenshots/feature-evidence/06-Recently-Added/evidence/Screenshot 2026-09-15 at 11.07.00 AM.png>)
- [Screenshot 2026-09-15 at 11.11.52 AM.png](<../screenshots/feature-evidence/06-Recently-Added/evidence/Screenshot 2026-09-15 at 11.11.52 AM.png>)

## Generate from this brain

- UI rule: [UI/UX Guardian](../brains/ui-ux-guardian.md)
- Screenshot method: [screenshot review](../screenshots/REVIEW.md)
- Mobile implementation: [mobile code review](../code/mobile-review.md)
- Web implementation: [web code review](../code/web-review.md)
- Role: [User](../roles/user.md) · [Manager](../roles/manager.md) · [Admin](../roles/admin.md)
