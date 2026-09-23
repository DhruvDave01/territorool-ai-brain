---
id: Screen-Inventory
parent: design
sources:
  - App/App.js
  - App/components/login/
  - register/index_register_split.js
  - register/subscribe.js
  - register/SubscriptionGate.js
  - dashboard/index.js
  - dashboard/RecentActivityScreen.js
  - dashboard/CalendarActivityScreen.js
related:
  - design/04-User-Flows/README.md
  - design/06-Coverage/Functionality-Coverage-Matrix.md
---
# Screen inventory

Architecture: one **native stack** (`App/App.js`), **46** `Stack.Screen` names, `headerShown: false`. Overlay UI is not a stack route. From→to: [screens/navigation-map.md](../../screens/navigation-map.md). Stills: [Mobile-Screenshot-Flow](../06-Coverage/Mobile-Screenshot-Flow.md).

**Visual status keys:** Captured = Archive 2 still and/or video. Code-only = documented from source. Deferred = user asked to skip until later. Dead = registered or referenced but not a live destination.

Screenshot paths are relative to `Design-Brain/03-Assets/Screenshots/`.

---

## Auth / paywall

| Route | Source | Purpose | Visual | Notes |
| --- | --- | --- | --- | --- |
| `Login` | `App/components/login/` | Email/password, forgot (web), EULA, privacy, version | `IMG_4604` + `ios/01-auth/00-login.png` | Cube JPG; 42.30 vs 42.31 vs 42.32 |
| `Register` | `register/index_register_split.js` + `postSignupPaywallFlow.js` | Signup questionnaire 6 steps | `ios/01-auth/02`–`07` | Light questionnaire, no CustomHeader |
| `SubscriptionScreen` | `register/subscribe.js` | RevenueCat paywall | `ios/01-auth/09` | $69 / 7-day trial; **Log out (Dev)** is dev |
| `SubscriptionGate` | `register/SubscriptionGate.js` | Blocked until subscribe | **No distinct still** | `08-subscription-gate.png` is the subscribe paywall |

---

## Hub

| Route | Source | Purpose | Header / footer | Visual |
| --- | --- | --- | --- | --- |
| `Dashboard` | `dashboard/index.js` | Tile hub, credits, referral, activity | Custom header (logo, name, credits, QR, settings). **No CustomFooter** | `IMG_4563` empty Upcoming; `IMG_4605` Recent filled; VID3 loading overlay |
| `RecentActivity` | `dashboard/RecentActivityScreen.js` | Full recent list | CustomHeader, back | `ios/02-home/03-recent-activity.png` |
| `CalendarActivity` | `dashboard/CalendarActivityScreen.js` | Month calendar + day events | Title “Calendar Activity” | `IMG_4608`; `ios/02-home/04` |
| `Notifications` | `dashboard/NotificationsScreen.js` | Alert list API | — | `ios/02-home/05`: empty **No notifications yet.** + toast **405 Method Not Allowed**. No Dashboard-bell still |
| `EditStatus` | `dashboard/editstatus.js` | **Settings** | Title “Settings”; CustomFooter index 6 | `IMG_4564`; `ios/09-settings/` |
| `QrCodeScanner` | `dashboard/QrCodeScannerScreen.js` | Scan route QR | Dark camera chrome | `IMG_4609`; `ios/02-home/06` |

### Dashboard tiles (from code + `IMG_4563`)

| Label | Tag | Badge | Navigate |
| --- | --- | --- | --- |
| AI Find Leads | LEADS & CONTACTS | — | `MultipleAIWaypoint` |
| Scan Card | Powered by AI | — | `BusinessCard` |
| Add Company | — | — | `CreateCompany` |
| Routes | Powered by AI | unread count (15 in still) | `Routes` |
| Lists | — | unread (7) | `Lists` |
| Address Book | — | — | `ListCompany` |

Also: referral banner “Want 20 more credits?”, Activity Upcoming/Recent, Calendar button, “New route ready” / “New list ready” on tiles.

---

## Lists

| Route | Source | Purpose | Visual |
| --- | --- | --- | --- |
| `Lists` | `list/index.js` | Library, search, +, overflow | `IMG_4591`; `ios/06-lists/01` + overflow `02` |
| `CreateLists` | `list/create.js` | Pick companies, name modal | `IMG_4592`–`4594`; `ios/06-lists/04` |
| `EditLists` | `list/edit.js` | Edit list members | `ios/06-lists/06` (Create chrome + list name title) |
| `ListsDetail` | `list/basic/` | Companies on a list | `IMG_4610`; `ios/06-lists/07` |
| `SelectStartEndPointsList` | `list/create/select-start-end-points.js` | List → generate route | `ios/06-lists/08` |

Chips on create: **All / Selected (n) / Find Leads / Map View**. Footer: Select All + Next Step / Submit.

---

## Routes

| Route | Source | Purpose | Visual |
| --- | --- | --- | --- |
| `Routes` | `route/index.js` | Routes Library Published/Draft | `IMG_4589`; `ios/07-routes/01`–`02` |
| `CreateRoute` | `route/create.js` | Select companies | `IMG_4572`; `ios/07-routes/06` |
| `EditRoute` | `route/edit.js` | Edit members | `ios/07-routes/08` (Create chrome + route name title) |
| `BasicRouteDetail` | `route/basic/index.js` | Numbered stops, miles, share, map | `IMG_4575`; `ios/07-routes/13` |
| `SelectStartEndPoints` | `route/create/select-start-end-points.js` | Green start / red end | `IMG_4573`; `ios/07-routes/09` |
| `EditSelectStartEndPoints` | `route/edit/edit-select-start-end-points.js` | Edit start/end | `ios/07-routes/10` |
| `PublishRoute` | `route/create/publish-route.js` | Publish + loader | Success IMG_4574; this pack **Generating Route Failed!!** `11` |
| `EditPublishRoute` | `route/edit/edit-publish-route.js` | Republish | **Creating Route Failed!!** `12` |
| `RouteSwipe` | `route/basic/goswipe.js` | — | Stub still `14` — not shipping chrome |
| `Contact` | `route/contact/` | Bulk contacts available | Code-only (working-tree feature) |
| `CompanyView` | `route/basic/company-view.js` | Company **on a route** (Mark / Mark Visited) | `IMG_4576`; Navigate `ios/04-companies/10` |
| `LassoMap` | `route/lassoMap.js` | Draw territory | Chrome `ios/08-maps/01`; finger-draw missing |

`ClusterList` is **navigated to** for cluster route types but **not registered** — broken. No capture.

---

## Companies / Address Book

| Route | Source | Purpose | Visual |
| --- | --- | --- | --- |
| `ListCompany` | `company/list.js` | Companies / Contacts tabs | `IMG_4595`–`4596`; `ios/04-companies/01`–`04` |
| `ViewCompany` | `company/view.js` | Embeds `CustomCompany`; **Add To** | `ios/04-companies/08`–`16` |
| `CreateCompany` | `company/create/` | Search vs Manual | `IMG_4587`–`4588`; `ios/04-companies/05`–`06` |
| `EditCompany` | `company/edit/` | Edit fields | `ios/04-companies/19` |
| `BusinessCard` | `company/businessCard/` | Camera/Gallery + OCR review | `IMG_4586`; `ios/10-other/01` |
| `CustomCompany` | `customcompany/index.js` | Workspace (usually **embedded**) | `IMG_4576`, `ios/04-companies/17` |

Company actions: More Info / **Mark or Add To** / Call / Navigate. Empty contacts + Add Contact / Find Contacts. Activity section + Mark Visited on route context only.

---

## Contacts

| Route | Source | Purpose | Visual |
| --- | --- | --- | --- |
| `ContactsCreate` | `contacts/create.js` | Add Contact form | `IMG_4599`–`4600`; `ios/05-contacts/02` |
| `ContactsUpdate` | `contacts/update.js` | Edit | `ios/05-contacts/03` **Update Contact** |
| `ContactsView` | `contacts/view.js` | Profile, LinkedIn/Call/Email/Add To/Delete, notes | `IMG_4598`; `ios/05-contacts/01` |

---

## Map

| Route | Source | Purpose | Visual |
| --- | --- | --- | --- |
| `ActiveRouteMap` | `activeroutemap/` | Live route map | `IMG_4577`; `ios/07-routes/15`–`16` |
| `WaypointDetail` | `activeroutemap/waypointdetail.js` | Stop detail | `ios/08-maps/02` **Waypoint Details** (Mark + Mark Visited) |

---

## Find Leads

| Route | Source | Purpose | Visual |
| --- | --- | --- | --- |
| `MultipleWaypoint` | `findLeads/index.js` | Places Find Leads | `ios/03-find-leads/08` / `ios/08-maps/03` |
| `MultipleAIWaypoint` | `findLeads/aiFindLeads.js` | AI Find Leads | `IMG_4565`–`4571`; `ios/03-find-leads/01`–`07` |

---

## Enrichment

| Route | Source | Purpose | Visual |
| --- | --- | --- | --- |
| `CongContact` | `route/congContact/` | Primary people list (Apollo/Cognism-style) | `IMG_4583`–`4585`; `ios/05-contacts/04` |
| `bizContacts` | `route/bizContact/index.js` | Secondary people | VID1; `ios/05-contacts/05` |
| `bizCompanies` | `route/bizContact/bizCompanies.js` | Secondary company | `ios/04-companies/20` empty **Company Contact** |

---

## Filters (stack vs inline)

| Route | Source | Status |
| --- | --- | --- |
| `FilterModule` | `filterModule/index.js` | **Inline modal**. Visual: `IMG_4590`, `ios/10-other/03`, `ios/04-companies/03` |
| `FilterList` | `list/filter.js` | **Legacy** stack still `ios/06-lists/03` — do not copy |
| `FilterRoute` | `route/filter.js` | **Legacy** stack still `ios/07-routes/05` — do not copy |

Filter fields: City Name, Zip Code, Industry Type, Company Revenue, Company Employees, Sort By Order (A-Z/Z-A), Sort By Availability (N/A/Open/Close), Sort By Visit (hidden on create/address book via `visited` prop), Filter By Status, Clear Filter / Filter. “Scroll for more” hint.

---

## System

| Route | Source | Purpose | Visual |
| --- | --- | --- | --- |
| `Error` | `components/error/` | HubSpot sync error companies — **not** a crash page | `ios/10-other/02` empty; teal **Fix selected** / pink **Delete selected** |

---

## Overlays (not stack routes)

| UI | Source | Visual |
| --- | --- | --- |
| AnimatedSplashScreen | `splash/AnimatedSplashScreen.js` | Native blue `ios/00-splash/00-splash.png`. Lottie overlay NMV |
| AppCrashFallback | `common/AppCrashFallback.js` | Archive `19.28.39` + `ios/10-other/04` |
| Session Expired | `App.js` + `AppConfirmModal` | No capture |
| Toast | `react-native-toast-message` | VID1/VID2; Notifications **405** (`ios/02-home/05`) |
| RoutePublishingLoader | `route/common/RoutePublishingLoader.js` | Success `IMG_4574`; fail cards `ios/07-routes/11`–`12` |
| FindContactsFetchModal | `customcompany/FindContactsFetchModal.js` | `IMG_4581`–`4582`; VID1 stages |
| ReportContactModal | `common/ReportContactModal.js` | `IMG_4580`; `ios/05-contacts/06` |
| ReferralInviteModal | `dashboard/ReferralInviteModal.js` | `IMG_4602`; `ios/09-settings/09` |
| AppConfirmModal | `common/AppConfirmModal.js` | `IMG_4601` logout; `ios/09-settings/06` |
| MapChooserPopup | `customcompany/MapChooserPopup.js` | `ios/04-companies/10` Get directions |
| FindLeadsCompanyDetailModal | `findLeads/FindLeadsCompanyDetailModal.js` | `ios/03-find-leads/06` |
| WhatsNewModal | `common/WhatsNewModal.js` | `08-whats-new.png` is **update sheet**, not changelog |
| SpotlightTourModal | `common/SpotlightTourModal.js` | No capture |
| FirstRouteCoachingSheet / PatchQualifierSheet | `route/basic/firstRouteCoaching/` | Coaching `ios/07-routes/17` |
| PostSignupPaywallFlow | `register/postSignupPaywallFlow.js` | `ios/01-auth/02`–`07` |
| SettingsPlanPaywall | Settings | Web-billed `ios/09-settings/03` (not store IAP) |
| CancelAccountConfirmModal | `common/CancelAccountConfirmModal.js` | `ios/09-settings/05` / `07` |

---

## Per-screen chrome notes (captured)

### Login
Entry: cold start without JWT. Exit: Dashboard or RevenueCat paywall (`ios/01-auth/08`/`09`, same chrome). No footer. Fields Email / Password. Forgot Password → Safari web reset (`ios/01-auth/01`). Register Here → onboarding step 1. Footer EULA + version + Privacy.

### Register / PostSignupPaywallFlow
Light questionnaire, 6-step bar, no footer. Captured steps 1–6 (`ios/01-auth/02`–`07`, [Onboarding.md](../04-User-Flows/Onboarding.md)). Dev “Test crash screen” on Register — do not copy.

### Dashboard
Entry: login / footer Home / JWT. Exit: tiles, QR, settings, calendar, recent, referral. Activity date: stills **“Invalid Date PT”** vs videos valid weekday string — document both. Maestro `02-home.png` is a populated hub (referral “Want 20 more credits?”) vs empty `IMG_4563`.

### Settings
Profile, subscription Cancel/Upgrade/credits (web-billed Upgrade + Safari credit add-ons captured; store IAP not), Tags/Edit Status, Rate the app, version, logout confirm. Footer Settings selected. `ios/09-settings/08` is New Update Available, not a changelog.

### Remaining screens
See [04-User-Flows](../04-User-Flows/README.md) for entry/exit and [06-Coverage](../06-Coverage/Functionality-Coverage-Matrix.md) for capture gaps.
