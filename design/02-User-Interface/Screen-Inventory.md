# Screen inventory

Architecture: one **native stack** (`App/App.js`), `headerShown: false`. Overlay UI is not a stack route.

**Visual status keys:** Captured = Archive 2 still and/or video. Code-only = documented from source. Deferred = user asked to skip until later. Dead = registered or referenced but not a live destination.

Screenshot paths are relative to `Design-Brain/03-Assets/Screenshots/`.

---

## Auth / paywall

| Route | Source | Purpose | Visual | Notes |
| --- | --- | --- | --- | --- |
| `Login` | `App/components/login/` | Email/password, forgot (web), EULA, privacy, version | Captured `Archive-2/IMG_4604.PNG` | Cube logo vs JPG wordmark: **Needs Manual Verification** |
| `Register` | `register/index_register_split.js` | Signup + `PostSignupPaywallFlow` | **Deferred** | |
| `SubscriptionScreen` | `register/subscribe.js` | RevenueCat paywall | **Deferred** | |
| `SubscriptionGate` | `register/SubscriptionGate.js` | Blocked until subscribe | **Deferred** | Cold-start if trial inactive |

---

## Hub

| Route | Source | Purpose | Header / footer | Visual |
| --- | --- | --- | --- | --- |
| `Dashboard` | `dashboard/index.js` | Tile hub, credits, referral, activity | Custom header (logo, name, credits, QR, settings). **No CustomFooter** | `IMG_4563` empty Upcoming; `IMG_4605` Recent filled; VID3 loading overlay |
| `RecentActivity` | `dashboard/RecentActivityScreen.js` | Full recent list | CustomHeader, back | Dashboard “View All”; **no dedicated still** — tab on Dashboard captured |
| `CalendarActivity` | `dashboard/CalendarActivityScreen.js` | Month calendar + day events | Title “Calendar Activity” | `IMG_4608`; VID3 `v3_008_64s` |
| `Notifications` | `dashboard/NotificationsScreen.js` | Alert list API | — | **Dead as destination** — no `navigate("Notifications")` |
| `EditStatus` | `dashboard/editstatus.js` | **Settings** | Title “Settings”; CustomFooter index 6 | `IMG_4564`; VID3 `v3_009_72s` (v42.31) |
| `QrCodeScanner` | `dashboard/QrCodeScannerScreen.js` | Scan route QR | Dark camera chrome | `IMG_4609` |

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
| `Lists` | `list/index.js` | Library, search, +, overflow share | `IMG_4591`; VID3 Share List `v3_004_32s`; loading `x3_t28s` |
| `CreateLists` | `list/create.js` | Pick companies, name modal | `IMG_4592`–`4594`; VID3 `x3_t34s` Create New List |
| `EditLists` | `list/edit.js` | Edit list members | Code-only (no still) |
| `ListsDetail` | `list/basic/` | Companies on a list | `IMG_4610` (1/6 company on list, footer Lists) |
| `SelectStartEndPointsList` | `list/create/select-start-end-points.js` | List → generate route | Parallel to route start/end; route version captured `IMG_4573` |

Chips on create: **All / Selected (n) / Find Leads / Map View**. Footer: Select All + Next Step / Submit.

---

## Routes

| Route | Source | Purpose | Visual |
| --- | --- | --- | --- |
| `Routes` | `route/index.js` | Routes Library | `IMG_4589`; VID3 `v3_003_24s` |
| `CreateRoute` | `route/create.js` | Select companies | `IMG_4572` |
| `EditRoute` | `route/edit.js` | Edit members | Code-only |
| `BasicRouteDetail` | `route/basic/index.js` | Numbered stops, miles, share, map | `IMG_4575`; VID3 `v3_001_8s`; Share `IMG_4611` |
| `SelectStartEndPoints` | `route/create/select-start-end-points.js` | Green start / red end | `IMG_4573` |
| `EditSelectStartEndPoints` | `route/edit/edit-select-start-end-points.js` | Edit start/end | Code-only |
| `PublishRoute` | `route/create/publish-route.js` | Publish + loader | Loader `IMG_4574`; VID1 Preparing Route + fuel copy |
| `EditPublishRoute` | `route/edit/edit-publish-route.js` | Republish | Code-only |
| `RouteSwipe` | `route/basic/goswipe.js` | — | **Dead** — no navigate |
| `Contact` | `route/contact/` | Bulk contacts available | Code-only (working-tree feature) |
| `CompanyView` | `route/basic/company-view.js` | Company **on a route** (Mark / Mark Visited) | `IMG_4576`; VID3 `x3_t6s` |
| `LassoMap` | `route/lassoMap.js` | Draw territory | **No capture** — Map View chip exists; treat as code-only |

`ClusterList` is **navigated to** for cluster route types but **not registered** — broken. No capture.

---

## Companies / Address Book

| Route | Source | Purpose | Visual |
| --- | --- | --- | --- |
| `ListCompany` | `company/list.js` | Companies / Contacts tabs | `IMG_4595`–`4596`; filter VID3; contacts loading `x3_t52s` |
| `ViewCompany` | `company/view.js` | Embeds `CustomCompany`; **Add To** | VID2 Address Book company 1/3352 |
| `CreateCompany` | `company/create/` | Search vs Manual | `IMG_4587`–`4588`; VID2 autocomplete |
| `EditCompany` | `company/edit/` | Edit fields | VID2 (~t39s) |
| `BusinessCard` | `company/businessCard/` | Camera/Gallery + OCR review | `IMG_4586` empty; `IMG_4606`–`4607` filled |
| `CustomCompany` | `customcompany/index.js` | Workspace (usually **embedded**) | `IMG_4576`, `IMG_4578`, `IMG_4610` |

Company actions: More Info / **Mark or Add To** / Call / Navigate. Empty contacts + Add Contact / Find Contacts. Activity section + Mark Visited on route context only.

---

## Contacts

| Route | Source | Purpose | Visual |
| --- | --- | --- | --- |
| `ContactsCreate` | `contacts/create.js` | Add Contact form | `IMG_4599`–`4600`; VID1 validation toast |
| `ContactsUpdate` | `contacts/update.js` | Edit | Pencil on View Contact; code-only form |
| `ContactsView` | `contacts/view.js` | Profile, LinkedIn/Call/Email/Add To/Delete, notes | `IMG_4598`; VID3 `v3_007_56s` (Email disabled) |

---

## Map

| Route | Source | Purpose | Visual |
| --- | --- | --- | --- |
| `ActiveRouteMap` | `activeroutemap/` | Live route map | `IMG_4577`; VID3 Map + “Loading route on map…” |
| `WaypointDetail` | `activeroutemap/waypointdetail.js` | Stop detail embeds company | Code-only (company-on-route stills cover similar UI) |

---

## Find Leads

| Route | Source | Purpose | Visual |
| --- | --- | --- | --- |
| `MultipleWaypoint` | `findLeads/index.js` | Places Find Leads | Code-only (Create Route “Find Leads” chip) |
| `MultipleAIWaypoint` | `findLeads/aiFindLeads.js` | AI Find Leads | `IMG_4565`–`4571`, `IMG_4603`; VID1 full flow |

---

## Enrichment

| Route | Source | Purpose | Visual |
| --- | --- | --- | --- |
| `CongContact` | `route/congContact/` | Primary people list (Apollo/Cognism-style) | `IMG_4583`–`4585` |
| `bizContacts` | `route/bizContact/index.js` | Secondary people | VID1 Show Contacts |
| `bizCompanies` | `route/bizContact/bizCompanies.js` | Secondary company | Code-only |

---

## Filters (stack vs inline)

| Route | Source | Status |
| --- | --- | --- |
| `FilterModule` | `filterModule/index.js` | **Inline modal** on many screens. Stack entry unused. Visual: `IMG_4590`, VID3 Address Book filter |
| `FilterList` | `list/filter.js` | Unused stack screen |
| `FilterRoute` | `route/filter.js` | Unused stack screen |

Filter fields: City Name, Zip Code, Industry Type, Company Revenue, Company Employees, Sort By Order (A-Z/Z-A), Sort By Availability (N/A/Open/Close), Sort By Visit (hidden on create/address book via `visited` prop), Filter By Status, Clear Filter / Filter. “Scroll for more” hint.

---

## System

| Route | Source | Purpose | Visual |
| --- | --- | --- | --- |
| `Error` | `components/error/` | HubSpot sync error companies — **not** a crash page | No capture — code-only |

---

## Overlays (not stack routes)

| UI | Source | Visual |
| --- | --- | --- |
| AnimatedSplashScreen | `splash/AnimatedSplashScreen.js` | No capture |
| AppCrashFallback | `common/AppCrashFallback.js` | No capture |
| Session Expired | `App.js` + `AppConfirmModal` | No capture |
| Toast | `react-native-toast-message` | VID1/VID2 toasts |
| RoutePublishingLoader | `route/common/RoutePublishingLoader.js` | `IMG_4574`; VID1 extra copy |
| FindContactsFetchModal | `customcompany/FindContactsFetchModal.js` | `IMG_4581`–`4582`; VID1 stages |
| ReportContactModal | `common/ReportContactModal.js` | `IMG_4580` |
| ReferralInviteModal | `dashboard/ReferralInviteModal.js` | `IMG_4602` |
| AppConfirmModal | `common/AppConfirmModal.js` | `IMG_4601` logout |
| MapChooserPopup | `customcompany/MapChooserPopup.js` | Code-only (VID2 uses iOS Call sheet, not map chooser) |
| FindLeadsCompanyDetailModal | `findLeads/FindLeadsCompanyDetailModal.js` | Code-only |
| WhatsNewModal | `common/WhatsNewModal.js` | No capture |
| SpotlightTourModal | `common/SpotlightTourModal.js` | No capture |
| FirstRouteCoachingSheet / PatchQualifierSheet | `route/basic/firstRouteCoaching/` | No capture |
| PostSignupPaywallFlow | `register/postSignupPaywallFlow.js` | **Deferred** |
| SettingsPlanPaywall | Settings | **Deferred** |
| CancelAccountConfirmModal | `common/CancelAccountConfirmModal.js` | **Deferred** (payment-adjacent) |

---

## Per-screen chrome notes (captured)

### Login
Entry: cold start without JWT. Exit: Dashboard or SubscriptionGate (**deferred**). No footer. Fields Email / Password. Forgot Password → web reset. Register Here (**deferred**). Footer EULA + version + Privacy.

### Dashboard
Entry: login / footer Home / JWT. Exit: tiles, QR, settings, calendar, recent, referral. Activity date: stills **“Invalid Date PT”** vs videos valid weekday string — document both.

### Settings
Profile, subscription Cancel/Upgrade/credits (**payment deferred** for those actions), Tags/Edit Status, Rate the app, version, logout confirm. Footer Settings selected.

### Remaining screens
See [04-User-Flows](../04-User-Flows/README.md) for entry/exit and [06-Coverage](../06-Coverage/Functionality-Coverage-Matrix.md) for capture gaps.
