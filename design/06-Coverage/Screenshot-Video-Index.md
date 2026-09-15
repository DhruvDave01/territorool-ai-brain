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

Splash / logo / app-icon stills (not TestFlight screenshots): `/Users/dhruvdave/Downloads/Archive/Assets/`.

**2026-09-15 Maestro + Playwright pack** (not copied into this vault): `/Users/dhruvdave/Dhurv/Project_TerriTool/untitled folder/screenshots/`

| Subfolder | Trust | Use for |
|-----------|-------|---------|
| `ios/` | Live iOS Simulator via Maestro | Register/onboarding steps 1–4, login 42.31, populated Dashboard |
| `web/desktop/` and `web/mobile/` | Live web (localhost:8888 / staging / prod) | Classic SA dashboard, auth split-panel, password reset, trial, subscription history, Upgrade |
| `mobile/` | **HTML replicas** (`TerriTool/docs/User-Interface/screens.html`) | Do **not** treat as shipping UI |

Maestro `11-qr-scan.png` is a **simulator camera placeholder**, not shipping QR chrome — prefer `IMG_4609`. `20-subscribe.png` is Goals with a box checked, not RevenueCat. `24-subscribe-preview.png` duplicates `23-register.png`.

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
| Maestro `ios/00-onboarding.png` | Goals step 1/6, Continue disabled | PostSignupPaywallFlow | `register/postSignupPaywallFlow.js` | Onboarding |
| Maestro `ios/01-login.png` | Login 42.31 | Login | `login/` | Authentication |
| Maestro `ios/02-home.png` | Dashboard populated, referral banner | Dashboard | `dashboard/index.js` | Dashboard |
| Maestro `ios/19-splash.png` | Native solid `#124ac6` | Launch | storyboard / windowBackground | App-Launch |
| Maestro `ios/20-subscribe.png` | Goals, one box checked | PostSignupPaywallFlow | same | Onboarding |
| Maestro `ios/21-subscribe-role.png` | Role step 2/6 | same | same | Onboarding |
| Maestro `ios/22-subscribe-cost.png` | Tools step 3/6 | same | same | Onboarding |
| Maestro `ios/23-register.png` | Sign Up step 4/6 (+ dev buttons) | Register | `register/index_register_split.js` | Onboarding |
| Maestro `ios/24-subscribe-preview.png` | Duplicate of 23 | Register | same | Onboarding |

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
