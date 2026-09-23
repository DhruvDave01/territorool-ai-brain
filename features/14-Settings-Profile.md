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

Connect external AI tools, refresh their tool list, chat, OAuth callback. Stored per user. That is **in-app custom MCP**, not native Salesforce. Customer Claude/Cursor tools and credit rules: 20-MCP, api-surfaces.md.

## Rules

- Never trust a user id in the URL for self-settings.
- Changing a status color must not break companies that still point at that status id.
- Manager save stays in the manager area.

## Code

Mobile: `App/components/dashboard/editstatus.js`. Classic: `SettingController@edit` and `@update` (`GET /settings`, `POST /setting/edit/{id}`). Manager: `Manager\ManagerDashboardController@settings` with the `manager-settings` island. `McpClient` connection UI on the classic page. `SalespersonController` is the manager's team CRUD, not self-settings.

## Related

**Modules** — 01-Authentication-Onboarding, 03-Company-AddressBook, 04-Contacts, 12-Subscription-Payments, 13-CRM-Integrations, 16-Manager-Portal

**This feature** — Use cases

**MCP** — 20-MCP, tool contract in api-surfaces.md

**Code** — [mobile screens](../code/mobile-screens.md), [web code review](../code/web-review.md), [API endpoints](../brains/api-endpoints.md)

**Terms / roles** — glossary.md, roles.md, OVERVIEW.md

## Screens

Per surface. "File" is under `TerriTool/App/components/` for mobile; the full map is [mobile screens](../code/mobile-screens.md). Strings are copied from code on 2026-09-22; a loading cell that reads `screen.x.loading` is the `testID` on that screen's `ActivityIndicator`. Copy these strings; do not write new ones.

| Surface | Screen | File / still | Primary action | Loading | Empty | Error |
|---|---|---|---|---|---|---|
| Mobile | `EditStatus` (Settings) | `dashboard/editstatus.js`, styles `editstatus.styles.js` · [Setting](<../screenshots/mobile-owner/Setting/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.23.png>) | Edit Status (Tags); Upgrade; Buy extra credits | `screen.editStatus.loading` | Tags line reads "0 status tags · Tap Edit Status to change" | HubSpot row `screen.editStatus.hubspotSyncErrorRow`; "Oops! Something went wrong. Please check your internet connection or try again." (toast) |
| Mobile | Edit Status sheet | same file · [Setting](<../screenshots/mobile-owner/Setting/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.50.png>) | Rename a tag, change a color, add | `screen.editStatus.rateUsLoading` on rate-us | — | Invalid hex rejected |
| Classic web | `/settings` | feature-evidence 14 (`TerriTool-09-15-2026_11_08_AM.png`) | Save profile, statuses, categories, stages, CRM | `#cover-spin` | — | Laravel validation |
| Manager | `/manager/settings` | [Manager settings](../screenshots/web-owner/Manager/Settings-TerriTool-09-15-2026_01_30_PM.png) | Save | "Loading…" | — | Toast on `#manager-toast-root` |
| HQ | Edit user | [Admin](../screenshots/web-owner/Admin/TerriTool-Admin-09-15-2026_01_35_PM.png) | Save | Backpack | — | Backpack validation |

What lives where: the phone shows profile, credits, subscription, and Tags only. Categories, contact stages, CRM connections, preferences, and MCP connections are web-only on `/settings` (classic) and `/manager/settings` (manager). A mobile mock that adds a CRM panel is wrong.

Generated picture for the totals request: [settings-mobile-totals.png](settings-mobile-totals.png) (Companies, Routes, Lists card between the profile card and Tags).

## Screenshots in this brain

Open the image before drawing UI. The filename is a capture time, not a layout spec. Pixels win.

- [IMG_4564.PNG](<../screenshots/feature-evidence/14-Settings-Profile/evidence/IMG_4564.PNG>)
- [TerriTool-09-15-2026_11_08_AM.png](<../screenshots/feature-evidence/14-Settings-Profile/evidence/TerriTool-09-15-2026_11_08_AM.png>)
- [Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.23.png](<../screenshots/feature-evidence/14-Settings-Profile/evidence/mobile/Setting/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.23.png>)
- [Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.29.png](<../screenshots/feature-evidence/14-Settings-Profile/evidence/mobile/Setting/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.29.png>)
- [Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.36.png](<../screenshots/feature-evidence/14-Settings-Profile/evidence/mobile/Setting/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.36.png>)
- [Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.50.png](<../screenshots/feature-evidence/14-Settings-Profile/evidence/mobile/Setting/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.50.png>)
- [Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.56.png](<../screenshots/feature-evidence/14-Settings-Profile/evidence/mobile/Setting/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.56.png>)
- [Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.38.01.png](<../screenshots/feature-evidence/14-Settings-Profile/evidence/mobile/Setting/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.38.01.png>)
- [Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.38.27.png](<../screenshots/feature-evidence/14-Settings-Profile/evidence/mobile/Setting/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.38.27.png>)

## Generate from this brain

- UI rule: [UI/UX Guardian](../brains/ui-ux-guardian.md)
- Screenshot method: [screenshot review](../screenshots/REVIEW.md)
- Mobile implementation: [mobile code review](../code/mobile-review.md)
- Web implementation: [web code review](../code/web-review.md)
- Role: [User](../roles/user.md) · [Manager](../roles/manager.md) · [Admin](../roles/admin.md)
