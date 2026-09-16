---
id: Mobile-Screenshot-Flow
parent: design
related:
  - design/06-Coverage/Screenshot-Video-Index.md
  - design/06-Coverage/Deferred-Scope.md
  - design/06-Coverage/Needs-Manual-Verification.md
  - design/04-User-Flows/README.md
---
# Mobile screenshot flow (canonical pack)

**See also:** [Screenshot-Video-Index](Screenshot-Video-Index.md) · [Deferred-Scope](Deferred-Scope.md) · [Needs-Manual-Verification](Needs-Manual-Verification.md) · [User flows](../04-User-Flows/README.md) · [MINI](../MINI-DESIGN-BRAIN.md)

**Path (binaries not in git):** `/Users/dhruvdave/Dhurv/Project_TerriTool/untitled folder/screenshots/ios/`

Live iOS Simulator stills, mostly build **42.31 (1)**. Index in that folder: `SCREENSHOT_FLOW.md`. **Pixels win over filenames.** Cite as `ios/{folder}/{file}.png`.

`00-current.png` is a loose still at the pack root — not part of the numbered flow.

## Folder map

| Folder | What belongs here | Flow note |
|--------|-------------------|-----------|
| `00-splash/` | Native launch window | [App-Launch](../04-User-Flows/App-Launch.md) |
| `01-auth/` | Login, forgot (Safari), Register 1–6, paywall files | [Authentication](../04-User-Flows/Authentication.md) · [Onboarding](../04-User-Flows/Onboarding.md) · [Subscription](../04-User-Flows/Subscription.md) |
| `02-home/` | Dashboard, RecentActivity, Calendar, Notifications, QR | [Dashboard](../04-User-Flows/Dashboard.md) · [Calendar-and-Activity](../04-User-Flows/Calendar-and-Activity.md) |
| `03-find-leads/` | AI Find Leads + Places `MultipleWaypoint` | [Find-Leads](../04-User-Flows/Find-Leads.md) |
| `04-companies/` | Address Book, Create, ViewCompany overlays, Edit, bizCompanies | [Companies-and-Contacts](../04-User-Flows/Companies-and-Contacts.md) |
| `05-contacts/` | View / Create / Update, CongContact, bizContacts, Report | [Companies-and-Contacts](../04-User-Flows/Companies-and-Contacts.md) · [Enrichment-and-Credits](../04-User-Flows/Enrichment-and-Credits.md) |
| `06-lists/` | Lists library, overflow, create/edit, detail, start/end from list | [Lists](../04-User-Flows/Lists.md) |
| `07-routes/` | Published/Draft, overflow, share, create/edit, publish, detail, map, coaching | [Routes](../04-User-Flows/Routes.md) |
| `08-maps/` | LassoMap, WaypointDetail, MultipleWaypoint | [Maps-and-Active-Route](../04-User-Flows/Maps-and-Active-Route.md) |
| `09-settings/` | EditStatus, plan, web Upgrade, credits, cancel, logout, delete, update sheet, referral | [Settings](../04-User-Flows/Settings.md) |
| `10-other/` | BusinessCard, HubSpot `Error`, FilterModule, crash fallback | [Scan-Business-Card](../04-User-Flows/Scan-Business-Card.md) · [Error-and-Recovery](../04-User-Flows/Error-and-Recovery.md) |

Footer (not stack): Home → Find Leads → Address Book → Routes → Lists → Settings. `ClusterList` is still unregistered — skip.

## Filename vs pixels (do not trust the name)

| File | Filename claims | What the still actually is |
|------|-----------------|----------------------------|
| `02-home/02-dashboard-add-menu.png` | Dashboard + menu | **Address Book** + `HeaderAddMenu` (Add Company / Find Leads). Real Address Book + is `04-companies/04-address-book-add-menu.png` |
| `01-auth/08-subscription-gate.png` | `SubscriptionGate` | Same chrome as `09-subscription-screen.png` (RevenueCat paywall, **Log out (Dev)**). Not a distinct gate layout |
| `01-auth/01-login-forgot-password.png` | In-app modal | **Safari** `staging.territool.com` Reset Password (classic web). Matches code: Forgot Password opens the web reset URL |
| `03-find-leads/07-ai-save-to-list.png` | Save to list | **Selected Leads (2)** + Confirm Leads — not the add-to-list sheet |
| `09-settings/08-whats-new.png` | WhatsNew | **New Update Available** (same as Settings Preview App Update). Not a product changelog |
| `07-routes/14-route-swipe.png` | RouteSwipe | Stub: “Route Details / Swipe back from left edge (iOS)” — not shipping chrome |
| `07-routes/11-publish-route.png` | Publish loader | **Generating Route Failed!!** (error card) |
| `07-routes/12-edit-publish-route.png` | Edit publish loader | **Creating Route Failed!!** (ROUTE UPDATE) |
| `06-lists/03-lists-filter.png` / `07-routes/05-routes-filter.png` | Live filter | **Legacy** `FilterList` / `FilterRoute` (teal A–Z, red Clear, teal Filter/Next). Do **not** copy. Live filter is `FilterModule` (`10-other/03`, `04-companies/03`) |
| `09-settings/03-settings-plan-paywall.png` | In-app paywall | Web-billed **Manage your plan on the web** alert |
| `09-settings/04-settings-buy-credits.png` | In-app IAP | Safari **Buy Credit Add-Ons** on staging (50/$25 … 1000/$300) |

## Newly closed vs still missing

Captured here (pixels): Register 1–6, RevenueCat subscribe, crash fallback, HubSpot `Error` empty, Notifications empty + `405 Method Not Allowed`, first-route coaching sheet, Edit Route / Edit List (Create chrome + entity title), Edit Start/End, Draft tab, library overflow sheets, Places Find Leads map, Get directions chooser, Visited Times, Add to route/list sheet, company Activity Today/Upcoming/Past, Update Contact, Waypoint Details, buy-credits **web** page, delete-account sheet (`Cancel Account`), Route publish **failure** cards.

Still do **not** invent: a distinct `SubscriptionGate` layout, App Store Settings IAP (this account is web-billed), splash **Lottie** (this splash still is solid `#124ac6` + status bar), lasso **finger-draw**, session-expired modal, successful publish loader (this pack only has fail cards — older IMG_4574 / VID1 still have success).
