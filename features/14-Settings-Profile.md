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

### Voice Mode (mobile, every `TT_80` build)

A card in `EditStatus`, between the profile card and Tags (`VoiceSettingsCard`). It is on in every `TT_80` build (`VOICE_MODE_ENABLED = true` since `ce2104d0`). `Production` has no voice code, so store users do not see it yet. Read against `TT_80` `daf50eeb` on 2026-11-02 ([live code, 2026-11-02](../reviews/live-code-2026-11-02.md)).

- **“Voice Mode”:** a “Beta” pill and an On / Off pill. Turning it on opens `VoiceScreen` with the first-run sheet. Off ends any session.
- **“Use the phone speaker”:** default on (`5fb2eae7`).
- **“Keep listening with the screen off”:** default on. Sub-line “Android: stays on while you drive. iPhone pauses when the screen locks so noise cannot log visits.”
- **“Start when I open a route”:** default off.
- **“Voice history”:** “500 latest turns · this phone only”, with Clear.

Settings live on the phone (AsyncStorage `voice.settings.v1`), not on the server. Still: [Settings card](../screenshots/mobile-owner/VoiceMode/14-settings-enabled.jpg), taken before the “Beta” pill and the speaker switch. See [22 — Voice Mode](22-Voice-Mode.md).

### Calendar sync (no Settings entry)

Google Calendar sync has no Settings entry on the phone or the web, and no disconnect. Connect and Sync start from the dashboard Activity panel (“Calendar”). See [23 — Calendar Sync](23-Calendar-Sync.md).

## Rules

- Never trust a user id in the URL for self-settings.
- Changing a status color must not break companies that still point at that status id.
- Manager save stays in the manager area.

## Code

Mobile: `App/components/dashboard/editstatus.js`. Classic: `SettingController@edit` and `@update` (`GET /settings`, `POST /setting/edit/{id}`). Manager: `Manager\ManagerDashboardController@settings` with the `manager-settings` island. `McpClient` connection UI on the classic page. `SalespersonController` is the manager's team CRUD, not self-settings.

## Related

**Modules** — 01-Authentication-Onboarding, 03-Company-AddressBook, 04-Contacts, 12-Subscription-Payments, 13-CRM-Integrations, 16-Manager-Portal, 23-Calendar-Sync

**This feature** — Use cases

**MCP** — 20-MCP, tool contract in api-surfaces.md

**Code** — [mobile screens](../code/mobile-screens.md), [web code review](../code/web-review.md), [API endpoints](../brains/api-endpoints.md)

**Terms / roles** — glossary.md, roles.md, OVERVIEW.md

## Screens

Per surface. "File" is under `TerriTool/App/components/` for mobile; the full map is [mobile screens](../code/mobile-screens.md). Strings are copied from code on 2026-09-22; a loading cell that reads `screen.x.loading` is the `testID` on that screen's `ActivityIndicator`. Copy these strings; do not write new ones.

| Surface | Screen | File / still | Primary action | Loading | Empty | Error |
|---|---|---|---|---|---|---|
| Mobile | `EditStatus` (Settings) | `dashboard/editstatus.js`, styles `editstatus.styles.js` · [Setting](<../screenshots/mobile-owner/Setting/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.23.png>) | Edit Status (Tags); Upgrade; Buy extra credits | `screen.editStatus.loading` | Tags line reads "0 status tags · Tap Edit Status to change" | HubSpot row `screen.editStatus.hubspotSyncErrorRow`; "Oops! Something went wrong. Please check your internet connection or try again." (toast) |
| Mobile | Voice Mode card (`TT_80` builds) | `voice/VoiceParts.js` `VoiceSettingsCard` · [Settings card](../screenshots/mobile-owner/VoiceMode/14-settings-enabled.jpg) | On / Off; Use the phone speaker; Keep listening; Start when I open a route; Clear history | — | “500 latest turns · this phone only” | Clear asks “Clear voice history?” / “This removes the Voice Mode chat saved on this phone.” |
| Mobile | Edit Status sheet | same file · [Setting](<../screenshots/mobile-owner/Setting/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.50.png>) | Rename a tag, change a color, add | `screen.editStatus.rateUsLoading` on rate-us | — | Invalid hex rejected |
| Classic web | `/settings` | feature-evidence 14 (`TerriTool-09-15-2026_11_08_AM.png`) | Save profile, statuses, categories, stages, CRM | `#cover-spin` | — | Laravel validation |
| Manager | `/manager/settings` | [Manager settings](../screenshots/web-owner/Manager/Settings-TerriTool-09-15-2026_01_30_PM.png) | Save | "Loading…" | — | Toast on `#manager-toast-root` |
| HQ | Edit user | [Admin](../screenshots/web-owner/Admin/TerriTool-Admin-09-15-2026_01_35_PM.png) | Save | Backpack | — | Backpack validation |

What lives where: the phone shows profile, credits, subscription, the Voice Mode card (`TT_80` builds only), and Tags. Categories, contact stages, CRM connections, preferences, and MCP connections are web-only on `/settings` (classic) and `/manager/settings` (manager). A mobile mock that adds a CRM connect panel is wrong. For CRM the phone has only a “HubSpot Sync” card, shown once HubSpot is connected on the web ([13 — CRM Integrations](13-CRM-Integrations.md)). Calendar sync has no Settings entry anywhere.

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

## Watched 2026-09-23

Classic web Settings opens MCP Chat with the badge “not connected,” actions Fetch, Send, and Update, and Connect new MCP. The same page shows Free Package and Subscription Status Active. Detail: [oversized-video watch](../reviews/oversized-video-watch-2026-09-23.md).

## Generate from this brain

- UI rule: [UI/UX Guardian](../brains/ui-ux-guardian.md)
- Screenshot method: [screenshot review](../screenshots/REVIEW.md)
- Mobile implementation: [mobile code review](../code/mobile-review.md)
- Web implementation: [web code review](../code/web-review.md)
- Role: [User](../roles/user.md) · [Manager](../roles/manager.md) · [Admin](../roles/admin.md)
