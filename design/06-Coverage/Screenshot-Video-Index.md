---
id: Screenshot-Video-Index
parent: design
sources:
  - dashboard/index.js
  - dashboard/editstatus.js
  - findLeads/aiFindLeads.js
  - route/create.js
  - route/create/select-start-end-points.js
  - route/common/RoutePublishingLoader.js
  - route/basic/index.js
  - route/basic/company-view.js
related:
  - design/06-Coverage/Needs-Manual-Verification.md
  - design/05-Design-System/Token-Inconsistencies.md
---
# Screenshot and video index

**Capture set:** `/Users/dhruvdave/Downloads/Design-Brain/03-Assets/` (stills + videos; not copied into this vault). Same PNGs split as:

| Folder | Files |
| --- | --- |
| `/Users/dhruvdave/Downloads/Archive 2/` | `IMG_4563`–`IMG_4600` (no `IMG_4597`) |
| `/Users/dhruvdave/Downloads/Archive 3/` | `IMG_4601`–`IMG_4604` |
| `/Users/dhruvdave/Downloads/Archive 4/` | `IMG_4605`–`IMG_4611` |

Splash / logo / app-icon stills previously lived at `/Users/dhruvdave/Downloads/Archive/Assets/`. **As of 2026-09-16 that path is the Simulator flow pack below.** Runtime splash: `TerriTool/App/assets/lottie/Image_splash.png`. Brand-book HTML location after the overwrite is unknown — do not invent a path.

**2026-09-16 Simulator flow pack** (not copied into this vault): `/Users/dhruvdave/Downloads/Archive/` — iPhone 17 Pro Max, build **42.32 (1)**, 249 PNGs.

| Folder | Count | Use for |
|--------|-------|---------|
| `LoginRegistrationFlow/` | 21 | Login toasts, steps 1–6, crash fallback, RevenueCat, push prompt |
| `Dashboard/` | 7 | Location, QR, referral, Invalid Date PT |
| `Setting/` | 7 | Plan accordion, cancel sheet, web Upgrade, tags, logout |
| `ActivityCalendar/` | 4 | Activity list + Calendar |
| `AIFindLeadsFlow/` | 49 | Loading overlay, search %, Fetching, Confirm Leads, Start/End |
| `ScanCardFlow/` | 11 | Intro, crop, OCR save |
| `AddCompany/` | 9 | Search autocomplete, success toast |
| `RouteFlow/` | 81 | Library, select-all, detail, bulk Find Contacts, Add Activity types |
| `AddressBookFlow/` | 18 | Tabs, empty activity, delete confirm |
| `List/` | 42 | Library, Lasso Selection, Filter By |

Cite stills as `Folder/HH.MM.SS` (filename `Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at HH.MM.SS.png`). Do not copy the PNGs into git. Do not treat folder names as code screen names.

**2026-09-16 numbered iOS flow pack** (not copied): `/Users/dhruvdave/Dhurv/Project_TerriTool/untitled folder/screenshots/ios/` — 00-splash … 10-other, ~93 PNGs. **Canonical map + filename mismatches:** [Mobile-Screenshot-Flow.md](Mobile-Screenshot-Flow.md).

Older Maestro filenames (`00-onboarding.png`, `01-login.png`, …) from this same `ios/` folder were **replaced** by that numbered tree. Do not look for `19-splash.png` / `20-subscribe.png` there anymore.

**Web Playwright** still lives under `untitled folder/screenshots/web/`. **`screenshots/mobile/`** = HTML replicas — ignore.

Device: iPhone TestFlight, screenshots 1170×2532, videos 1290×2796. Account Testim / Business Client.

Original video names:

| Stable name | Original |
| --- | --- |
| `Videos/VID1-AI-Find-Leads-to-Activity.mp4` | `ScreenRecording_09-11-2026 12-58-12_1.MP4` (~291s) |
| `Videos/VID2-Add-Company.mp4` | `ScreenRecording_09-11-2026 13-07-07_1.MP4` (~75s) |
| `Videos/VID3-Additional-Flows.mp4` | `ScreenRecording_09-11-2026 13-09-50_1.MP4` (~74s) |

No `IMG_4597` in the archive.

---

## Stills → screen → code → flow

| File | Screen / state | Route / UI | Code | Flow |
| --- | --- | --- | --- | --- |
| IMG_4563 | Dashboard empty Upcoming, Invalid Date PT, badges 15/7 | Dashboard | `dashboard/index.js` | Dashboard |
| IMG_4564 | Settings | EditStatus | `dashboard/editstatus.js` | Settings |
| IMG_4565 | AI Find Leads form, Next disabled | MultipleAIWaypoint | `findLeads/aiFindLeads.js` | Find-Leads |
| IMG_4566 | AI map pink pins | same | same | Find-Leads |
| IMG_4567 | Selected Leads + Confirm Leads | same | same | Find-Leads |
| IMG_4568 | Leads confirmed 100% | modal | same | Find-Leads |
| IMG_4569 | Add to route/list/dashboard | sheet | same | Find-Leads |
| IMG_4570–4571 | Add leads to route | modal | same | Find-Leads / Routes |
| IMG_4572 | Create Route Selected(5) | CreateRoute | `route/create.js` | Routes |
| IMG_4573 | Start/End Points | SelectStartEndPoints | `route/create/select-start-end-points.js` | Routes |
| IMG_4574 | Generating sales route | RoutePublishingLoader | `route/common/RoutePublishingLoader.js` | Routes |
| IMG_4575 | Route detail R122rtt | BasicRouteDetail | `route/basic/index.js` | Routes |
| IMG_4576 | Company on route 1/5, Mark | CompanyView + CustomCompany | `route/basic/company-view.js` | Companies |
| IMG_4577 | Active route map | ActiveRouteMap | `activeroutemap/` | Maps |
| IMG_4578 | More Info sheet | CustomCompany | `customcompany/` | Companies |
| IMG_4579 | (i) Report Company | same | same | Enrichment |
| IMG_4580 | Report radios | ReportContactModal | `common/ReportContactModal.js` | Enrichment |
| IMG_4581 | Finding contacts Apollo | FindContactsFetchModal | `customcompany/FindContactsFetchModal.js` | Enrichment |
| IMG_4582 | Fetch empty Done | same | same | Enrichment |
| IMG_4583–4585 | Find Contacts list / checking / saved | CongContact / bizContacts | `route/congContact`, `bizContact` | Enrichment |
| IMG_4586 | Scan Card Camera/Gallery | BusinessCard | `company/businessCard/` | Scan-Business-Card |
| IMG_4587–4588 | Add Company Search / Manual | CreateCompany | `company/create/` | Companies |
| IMG_4589 | Routes Library | Routes | `route/index.js` | Routes |
| IMG_4590 | Filter By (partial) | FilterModule | `filterModule/` | Lists/Routes/AB |
| IMG_4591 | Lists library | Lists | `list/index.js` | Lists |
| IMG_4592–4594 | Create List | CreateLists | `list/create.js` | Lists |
| IMG_4595–4596 | Address Book Companies / Contacts | ListCompany | `company/list.js` | Companies |
| IMG_4598 | View Contact | ContactsView | `contacts/view.js` | Companies |
| IMG_4599–4600 | Add Contact | ContactsCreate | `contacts/create.js` | Companies |
| IMG_4601 | Log out? | AppConfirmModal | `common/AppConfirmModal.js` | Authentication |
| IMG_4602 | Share the app | ReferralInviteModal | `dashboard/ReferralInviteModal.js` | Dashboard |
| IMG_4603 | AI results + contact chips | MultipleAIWaypoint | `aiFindLeads.js` | Find-Leads |
| IMG_4604 | Login | Login | `login/` | Authentication |
| IMG_4605 | Dashboard Recent populated | Dashboard | `dashboard/index.js` | Dashboard |
| IMG_4606–4607 | Scan Card preview + OCR fields | BusinessCard | `businessCard/` | Scan-Business-Card |
| IMG_4608 | Calendar Activity | CalendarActivity | `dashboard/CalendarActivityScreen.js` | Calendar |
| IMG_4609 | Scan QR code | QrCodeScanner | `dashboard/QrCodeScannerScreen.js` | Dashboard |
| IMG_4610 | List company 1/6 Mark | ListsDetail + CustomCompany | `list/basic`, `customcompany` | Lists |
| IMG_4611 | Share Route | ShareEmailField | `common/ShareEmailField.js` | Routes |
| *(not IMG)* Archive `Assets/splash/Image_splash.png` | JS splash background | AnimatedSplashScreen | `splash/AnimatedSplashScreen.js` + `App/assets/lottie/Image_splash.png` | App-Launch |
| `ios/00-splash/00-splash.png` | Native solid `#124ac6` + status bar | Launch | storyboard | App-Launch |
| `ios/01-auth/01-login-forgot-password.png` | Safari staging Reset Password | web | `{API host}/password/reset` | Authentication |
| `ios/01-auth/08` ≈ `09` | RevenueCat paywall (not a distinct gate) | SubscriptionScreen | `register/subscribe.js` | Subscription |
| `ios/02-home/02-dashboard-add-menu.png` | **Address Book** HeaderAddMenu | ListCompany | `customheader/` | Companies |
| `ios/02-home/05-notifications.png` | Empty + toast 405 | Notifications | `dashboard/NotificationsScreen.js` | Dashboard |
| `ios/07-routes/14-route-swipe.png` | Stub, not shipping | RouteSwipe | `route/basic/goswipe.js` | Routes |
| `ios/07-routes/17-first-route-coaching.png` | Coaching sheet | FirstRouteCoachingSheet | `route/basic/firstRouteCoaching/` | Routes |
| `ios/09-settings/08-whats-new.png` | New Update Available | Preview App Update | Settings | Settings |
| `ios/10-other/02-error.png` | HubSpot Error empty | Error | `components/error/` | Error-and-Recovery |
| Numbered pack remainder | One still per stack/overlay | see folder map | — | [Mobile-Screenshot-Flow.md](Mobile-Screenshot-Flow.md) |
| Archive `LoginRegistrationFlow/19.28.39` | AppCrashFallback | overlay | crash UI | Error-and-Recovery |
| Archive `LoginRegistrationFlow/19.29.28` | Configuring step 5/6 | PostSignupPaywallFlow | `register/` | Onboarding |
| Archive `LoginRegistrationFlow/19.29.34`–`19.29.49` | RevenueCat SubscriptionScreen | SubscriptionScreen | `register/subscribe.js` | Subscription |
| Archive `Setting/19.37.50` | Cancel subscription sheet | CancelAccountConfirmModal | Settings | Subscription |
| Archive `Setting/19.37.56` | Manage plan on the web | Upgrade handoff | Settings | Subscription |
| Archive `List/20.33.08` | Lasso Selection | LassoMap | `LassoMap` | Lists / Routes |
| Archive `List/20.34.41` | Filter By (status + visit) | FilterModule | `filterModule/` | Lists |

---

## Video 1 (~4:51) — AI Find Leads → route → contacts → activity

Frames under `Screenshots/Video-Frames/VID1/` (if present) plus analysis from `/tmp` extract.

```
Dashboard → AI Find Leads (keyboard)
  → search loading (logos, %)
  → results + Confirming N leads
  → add to route → Create Route (partial toast)
  → publish loader (Preparing Route + fuel copy)
  → company on route
  → Add Contact validation toast
  → Find Contacts (Still working / Taking longer)
  → secondary sources → Show Contacts
  → Add Activity → Mark Visited
  → (i) info → Dashboard
```

States **not in stills**: search-in-progress, Confirming N, partial toast, keyboard, validation toast, Still working, Taking longer, secondary carousel, Call sheet, Add Activity, Mark Visited toast.

---

## Video 2 (~1:15) — Add Company

```
Dashboard → Add Company Search → autocomplete
  → pick Google NYC / Amazon - Doppler
  → save toast → Address Book company (Add To, 1/3352)
  → More Info hours → iOS Call → Edit Company → Dashboard
```

---

## Video 3 (~1:14) — hub + libraries + share/filter

Frames: `Screenshots/Video-Frames/VID3/`

| Time | State |
| --- | --- |
| 0s | Dashboard loading overlay |
| 6s | Route company pager spinner, empty activity |
| 8s | Route detail numbered stops + native transition |
| 12–16s | Active map loading + search |
| 24s | Routes Library list |
| 28s | Push animation Dashboard → Lists loading |
| 32s | Share List |
| 34s | Create New List name modal (teal Find Leads, gold Map View) |
| 40–48s | Address Book Filter By (A-Z, scroll) |
| 52s | Contacts tab loading |
| 56s | View Contact Email disabled |
| 64s | Calendar selected other day + Today chip |
| 72s | Settings v42.31 |

---

## Code vs capture (do not pick one)

See [Needs-Manual-Verification.md](Needs-Manual-Verification.md) and [Token-Inconsistencies.md](../05-Design-System/Token-Inconsistencies.md).
