---
id: MINI-DESIGN-BRAIN
parent: design
sources:
  - App/App.js
  - App/styles/theme.js
  - App/assets/fonts/
  - App/images/fetchSources/
related:
  - design/README.md
  - design/01-Brand-Guidelines/Colors.md
  - design/02-User-Interface/Screen-Inventory.md
  - design/02-User-Interface/Components.md
  - design/05-Design-System/Token-Inconsistencies.md
  - design/06-Coverage/Deferred-Scope.md
  - design/06-Coverage/Needs-Manual-Verification.md
  - design/01-Brand-Guidelines/README.md
---
# TerriTool Mobile — Mini Design Brain

One-file distillation of the full [Design Brain](README.md). Read this first; follow the linked files only when you need a source citation, a screenshot reference, or detail this file compresses away.

**Same ground rules as the full brain:**
- Describes the app **as it ships today**. Not a redesign. Not a license to change production code.
- Where tokens/screens are inconsistent, **match the nearest existing screen** — do not average or "fix" inconsistencies (see §10).
- Register, payment/paywall, and Android pixels are **deferred** — documented as code-only, not visually (§11).

---

## 1. App in one paragraph

TerriTool is a field-sales app (routes, lists, companies, contacts, AI leads, maps). RN 0.84.1 / React 19.2.3, New Architecture. Entry `index.js` → `init.js` → `App/App.js`. It is **one flat native stack** (`@react-navigation/native-stack` v7, `headerShown: false`, no bottom-tabs/drawer) with **46** `Stack.Screen` names (older pack said 47). Module switching is a custom **six-icon `CustomFooter`**, not React Navigation tabs. **Dashboard is a tile hub with no footer.** State is class-component local + Realm JWT + AsyncStorage — no Redux. Styling tokens live in `App/styles/theme.js`, with many leftover raw hexes outside it. Live `App/config/index.js` `URL_BASE` is **prod**; staging is the commented block.

---

## 2. Brand tokens (condensed — full tables in `01-Brand-Guidelines/`)

### Colors

| Role | Hex | Notes |
| --- | --- | --- |
| **Primary** | `#124ac6` | Headers, selected footer tint, filled CTAs, links. Native splash / Android `colorPrimary` too. |
| Secondary/info | `#4A90E4` | Token exists, little live use vs primary |
| Teal family (**not one token**) | `#00A99D` (`primaryDark`), `#12AA9D` (`ttGreen`), `#3E918B` (`ttTab`), `#12A090` (`boldActive`) | Used interchangeably across tabs/accents — do not consolidate |
| Danger (modal) | `#E94A5D` | `theme.colors.danger` — AppConfirmModal, Settings Cancel |
| Danger (button) | `#CF5B51` | `AppButton` `danger` variant — **different hex than above, both live** |
| Warning / gold chip | `#FF8B28` / `#FFB800` (`ttYellow`) | Map View chip is gold, not primary |
| Success | `#4CAF50` | |
| Near-black CTA | `#1a1a1a` | e.g. "Confirm Leads" in capture — inconsistent with primary-blue CTAs elsewhere, both live |
| Body surface | `#F6F7FB` (`ccSurface`) | Curved screen body, footer shell |
| Cards | `#FFFFFF` | |
| Input bg | `#FAFBFC` | |
| Text primary / secondary | `#111827` / `#6B7280` | |
| Border | `#E5E7EB` (cards), `#E2E4E9` (login fields) | |
| Gradient (header) | 7-stop `#124ac6 → #164fca → #1b54cf → #2059d3 → #255ed7 → #2963db → #124ac6` | `CustomHeader` LinearGradient |
| Dark mode | **None app-wide.** Exceptions: QR scanner (full dark camera chrome), `ActiveRouteMap` polylines may follow `Appearance` (NMV) | |

Full table incl. overlays/map/legacy hexes: [`01-Brand-Guidelines/Colors.md`](01-Brand-Guidelines/Colors.md).

### Typography

- **Custom font: DIN Condensed** (not a system font). Files: [`03-Assets/Fonts/DIN-Condensed-Bold.ttf`](03-Assets/Fonts/DIN-Condensed-Bold.ttf) and [`03-Assets/Fonts/DIN-Condensed-Regular.ttf`](03-Assets/Fonts/DIN-Condensed-Regular.ttf). Canonical: `App/assets/fonts/`.
- JS aliases: `dinBold` (`DINCondensed-Bold` on iOS / `DIN-Condensed-Bold` on Android) and `dinLight` (`DIN-Regular` on iOS / `DIN-Condensed-Regular` on Android — Regular, *not* a true light cut).
- `Inter-Medium.ttf` / `Inter-Regular.ttf` are copied in the same Fonts folder but are **unused** — don't reach for them.
- Scale baseline **393×852** via `scaledSize()`; Android also runs `androidTextFix`.

| Token | Size / LH | Weight | Use |
| --- | --- | --- | --- |
| `display` | 24/30 | Bold | Large titles |
| `title` | 22/28 | Bold | Modal titles |
| `heading` | 20/25 | Bold | Section headings |
| `subheading` | 17/21 | Bold | Subheads |
| `buttonLabel` | 17/19 | Bold | CTAs, tabs |
| `body` | 16/20 | Regular | Body |
| `bodyBold` | 16/20 | Bold | Emphasis |
| `caption` / `captionBold` | 14/18 | Reg/Bold | Secondary, chips |
| `micro` / `microBold` | 12/15 | Reg/Bold | Meta, tags |

Many screens still set raw `fontWeight: "600"/"700"` on top of DIN — condensed families often ignore it on iOS. **Don't normalize.**

### Spacing / radius / shadow

| Spacing (`theme.spacing`, scaled) | Radius (`theme.radius`, scaled) | Shadow (`theme.shadows`) |
| --- | --- | --- |
| `xxs` 4 · `xs` 6 · `sm` 8 · `md` 12 · `lg` 16 · `xl` 20 · `xxl` 24 | `xxs` 4 · `xs` 8 · `sm` 10 · `md` 12 · `lg` 16 · `xl` 20 · `xxl` 24 | `sm` opacity .08/radius 2 (Android elev 2) · `md` .12/4 (elev 4) · `lg` .16/8 (elev 8) |

**Unscaled specials:** screen-body top radius **25** (`SCREEN_BODY_TOP_RADIUS`), `AppButton`/inputs **12**, `AppConfirmModal` card **16** (shadow instead: iOS 0/8 .12/24, Android elev 8), confirm icon circle **24**. Many screens still hardcode raw `padding: 10` etc. — match the *local* screen, only reach for tokens where that screen already does.

### Icons

- **CustomFooter (6, icon-only, 28×28):** Home (`icon_home.png`) · Find Leads (`Find_Leads.png`) · Address Book (`icon_company.png`) · Routes (`icon_routes.png`) · Lists (**`Supply3.png`**, not the unused `icon_lists.png`) · Settings (`setting.png`). Active tint `#124ac6` on `#eeeeee` bg; inactive `#9B9B9B`.
- **Dashboard tiles:** AI Find Leads, Scan Card, Add Company, Routes (badge), Lists (badge), Address Book — all render blue on white cards.
- **Chrome:** Ionicons (`react-native-vector-icons/Ionicons`) for back/search/add/call/etc., 18–26px, 44pt hit target.
- **Fetch-source logos** (Apollo, ZoomInfo, Manta, Yelp, …) in `App/images/fetchSources/` power the AI Find Leads and Find Contacts loading UI.

### Logo

Code uses `TerriTool_logo_NEW.jpg` (~300×110, `resizeMode="contain"`) for Login/Dashboard/WhatsNew. **TestFlight captures instead show a 3D "TT cube" mark** at Login and Dashboard header — which asset actually ships is **Needs Manual Verification**, don't assume one over the other.

---

## 3. Screen shell recipe — copy this for any new screen

1. Register a flat `Stack.Screen` in `App/App.js` (no new navigator type).
2. `CustomHeader` (gradient LinearGradient, white DIN-Bold title, back chevron) → full-bleed primary `#124ac6` behind it (`primaryBleed`).
3. Body sheet: `screenCurvedBodyStyles`, `#F6F7FB`, **25pt** top corners, uncscaled.
4. White cards on the sheet: hairline `#E5E7EB`, radius ~12.
5. `CustomFooter` **only if** the screen belongs to a footer module (not Dashboard, not deep-stack detail screens).
6. Primary actions: `AppButton` `primary` `#124ac6`, radius 12, DIN Bold, minHeight 50 (Login uses 54). Secondary: white fill, 2px `#124ac6` outline border.
7. Confirms → `AppConfirmModal` (never a native `Alert`). Async results → top `Toast` (success/error/info/danger).
8. Empty/loading/error states are required — short centered gray copy for empty (see §7).
9. Copy is DIN Condensed. Do not introduce Inter.
10. Match **"Mark/Unmark, Mark Visited"** (route/list company context) vs **"Add To"** (Address Book context) to the `parent_screen` — they are not interchangeable.
11. Don't "fix" mixed teal/gold chips or the two danger reds — copy the nearest sibling screen instead.

Reuse order for new UI: `CustomHeader` + `screenCurvedBodyStyles` → `CustomFooter` (if modular) → `AppButton` → `AppConfirmModal` → `Toast.show` → `FilterModule` (company filters) → `ShareEmailField` (share-by-email) → `SearchGlyph` (search bars). Do not add `@react-navigation/bottom-tabs`; do not create a second header gradient.

---

## 4. Navigation architecture

- Root: `@react-navigation/native` + `native-stack` v7. Nav-state persistence key `@TerriTool_nav_state`, but restore **clears `initialState`** — cold start never reopens the last deep screen.
- **Cold start:** native `#124ac6` window → JS splash (Lottie, min ~3s) → JWT check → no JWT → Login; JWT → RevenueCat identify → credit/trial check → `SubscriptionGate` (code live; **pixels** deferred) or Dashboard.
- **Footer targets:** 1 Dashboard (navigate) · 2 push `MultipleAIWaypoint` · 3 `ListCompany` (navigate) · 4 `Routes` (navigate) · 5 `Lists` (navigate) · 6 push `EditStatus`. Already-on-tab and offline both show a toast.
- Gesture-back is disabled on Login and Dashboard.

**Dead / broken — do not wire new features through these:**

| Screen/path | Issue |
| --- | --- |
| `Notifications` | Registered, nothing ever navigates to it (not even the bell) |
| `RouteSwipe` | Registered, never navigated |
| `FilterList` / `FilterRoute` | Unused stack screens; the live pattern is the inline `FilterModule` |
| `ClusterList` | Navigated to for cluster route types but **not registered** — crash risk |
| FCM taps | Logged only, never routed to `Notifications` |
| Referral Dynamic Link | Share copy only, not a JS router |

---

## 5. Screen inventory (condensed — full per-screen chrome notes in [`02-User-Interface/Screen-Inventory.md`](02-User-Interface/Screen-Inventory.md))

| Module | Screens | Status |
| --- | --- | --- |
| Auth | Login | Documented |
| Auth (pixels skipped) | Register, SubscriptionScreen, SubscriptionGate | Code live; no stills |
| Hub | Dashboard (no footer), RecentActivity, CalendarActivity, EditStatus (= Settings), QrCodeScanner | Documented |
| Hub | Notifications | **Dead** |
| Lists | Lists, CreateLists, ListsDetail, SelectStartEndPointsList | Documented |
| Lists | EditLists | Partial (code-only) |
| Routes | Routes, CreateRoute, BasicRouteDetail, SelectStartEndPoints, PublishRoute, CompanyView | Documented |
| Routes | EditRoute, EditSelectStartEndPoints, EditPublishRoute, LassoMap | Partial / code-only |
| Routes | RouteSwipe | **Dead** |
| Routes | `Contact` (bulk contacts) | Partial — working-tree feature, code-only in Design Brain pass |
| Companies | ListCompany, ViewCompany, CreateCompany, BusinessCard, CustomCompany | Documented |
| Companies | EditCompany | Partial |
| Contacts | ContactsCreate, ContactsView | Documented |
| Contacts | ContactsUpdate | Partial (code-only) |
| Map | ActiveRouteMap | Documented |
| Map | WaypointDetail | Partial |
| Find Leads | MultipleAIWaypoint | Documented |
| Find Leads | MultipleWaypoint (Places) | Partial |
| Enrichment | CongContact (primary), bizContacts (secondary) | Documented |
| Enrichment | bizCompanies | Code-only |
| Filters | `FilterModule` (inline, live) | Documented |
| Filters | `FilterList`, `FilterRoute` (stack) | **Dead/unused** |
| System | `Error` (HubSpot sync errors — **not** a crash page) | Code-only |

Stack total per source: **46 screens** + **15+** overlay UIs (not stack routes — see §8). Code map: [`screens/navigation-map.md`](../screens/navigation-map.md).

---

## 6. Shared components (full API in [`02-User-Interface/Components.md`](02-User-Interface/Components.md))

| Component | Notes |
| --- | --- |
| `AppButton` | Variants `primary` `#124ac6` (pressed `#0d4bb8`) / `danger` `#CF5B51` / `neutral` `#374151` / `dark` `#1a1a1a` / `ghost`. Radius 12, minHeight 50. Handles `loading` + `disabled`. Many screens still hand-roll `Pressable`/`TouchableOpacity` instead (Dashboard tiles, company action pills) — that's existing, not a bug to fix. |
| `CustomHeader` | Gradient, white DIN-Bold title, back chevron, optional credits pill / custom right content. Toolbar 56 (72 with subtitle). |
| `CustomFooter` | 6 icon tabs, offline toast, already-on-tab toast, subscription-expired intercept (deferred). |
| `AppConfirmModal` | Centered card, radius 16, `primaryTone` `danger` or `brand`, backdrop opacity **0.45**. Use for every confirm — never native `Alert`. |
| `Toast` (`react-native-toast-message`) | Mounted in `App.js`, **top** position, types success/error/info/`danger`. |
| `FilterModule` | Modal: dropdowns + segmented A–Z + checkboxes; City/Zip/Industry/Revenue/Employees/Sort/Status. iOS control height 48, Android 42. |
| `ShareEmailField` / `ShareEmailError` | Share Route / Share List forms. |
| `HeaderAddMenu` | Small dropdown (not full sheet) — Address Book only: "Add Company" / "Find Leads". |
| `NativeBaseCompat` | Legacy Container/Content/Icon/Toast shims — prefer `AppButton`/`Toast` in new code, don't extend this. |

No generic `AppCard` exists — screens implement white cards locally; match the nearest one rather than inventing a shared card component.

---

## 7. States (cross-cutting)

| State | Pattern |
| --- | --- |
| Default | Gradient header + curved body + white cards |
| Pressed | AppButton darkens ~12%; tile/press overlay tints |
| Disabled | Gray CTA fill, gray chip |
| Loading (screen) | Dim overlay + spinner ("LOADING.", "Loading credits…") |
| Loading (inline) | Spinner + copy ("Loading lists…", "Loading route on map…") |
| Empty | Short, centered, gray copy ("No contacts found.", "No upcoming activities yet.") |
| Success / error | Top Toast |
| Validation | Inline or toast before submit; submit stays disabled until valid (e.g. Report Company reason) |
| Offline | Footer top toast "No Internet Connection!!" |
| Session expired | `AppConfirmModal` → Login |
| Permission | Location (Find Leads/maps), camera/photos (Scan Card, QR) |

Not every screen has a skeleton loader — don't assume one exists where it isn't in code.

---

## 8. Patterns worth knowing before you design

- **Modals:** centered confirms follow `AppConfirmModal` (16 radius); taller sheets (Filter, Share, Create List name) are dimmed white cards over content. Two shadow languages only — `AppConfirmModal`-style or `FilterModule`-style. Don't invent a third.
- **Forms:** field bg `#FAFBFC`, border `#E2E4E9`/`#E5E7EB`, radius 12, minHeight ~48, label above (often with an Ionicon), placeholder `#9CA3AF`.
- **Maps:** full-bleed under the blue header; numbered stop pins, green start / red end / blue waypoint / pink AI-lead pins; locate + zoom FABs; loading pill copy ("Loading route on map…").
- **Company CTAs are context-specific** — Address Book (`ViewCompany`) shows **Add To**; a company reached via a route/list stop (`CompanyView`) shows **Mark/Unmark** + **Mark Visited**. Shared: More Info, Call, Navigate, Add Contact, Find Contacts, Add Activity.
- **Enrichment / credits:** Find Contacts checks the primary source first (Apollo-style, `FindContactsFetchModal` → `CongContact`); if that returns 0 it offers secondary sources → `bizContacts`. Credits pill in the header decrements live (captured: 2947 → 2943).
- **Voice:** headers are plain nouns ("AI Find Leads", "Routes Library", "Address Book"); CTAs are verbs ("Next step", "Confirm Leads", "Create Route", "Find Contacts", "Mark Visited"); empty states are one short sentence.

---

## 9. Do / Do not

**Do:** use `#124ac6` for headers/CTAs/links · DIN Condensed Bold (titles/CTAs) + Regular (body) · gradient header + curved `#F6F7FB` 25pt body · `CustomFooter` for module switching (Dashboard excluded) · `AppConfirmModal` for confirms · top `Toast` for async · outline-Cancel + filled-primary on dual-action sheets · short centered gray empty copy.

**Do not:** add a React Navigation tab/drawer navigator · introduce a dark app theme · use the Inter TTFs · use `icon_lists.png` for the Lists tab (live asset is `Supply3.png`) · assume Address Book and route-stop company CTAs match · silently "fix" mixed teal/green/gold chips or the two danger reds — copy the nearest existing screen instead.

---

## 10. Known inconsistencies — do not normalize

| Item | Two live values |
| --- | --- |
| Danger | Modal `#E94A5D` vs `AppButton` danger `#CF5B51` |
| "Confirm Leads" CTA | Captured near-black, while most "Next step" CTAs are primary blue |
| Lists tab icon | Live `Supply3.png` vs unused `icon_lists.png` |
| Teal naming | `primaryDark` token is actually teal (`#00A99D`); several near-teal hexes used interchangeably |
| Map View chip | Gold `#FFB800`, outside the primary palette |
| Font weight | DIN family alongside leftover numeric `fontWeight` 600/700 |
| Login logo | JPG wordmark (~300×110) in styles vs TT cube seen in TestFlight capture |
| App version | `package.json` marketing 7.1.49 vs TestFlight build 42.30/42.31 |
| `HIDE_SUBSCRIPTION_ACTIONS_ON_ANDROID` | Comment implies hiding; value is currently `false` (shows on both platforms) |
| `COLOR_PRIMARY` import | `bizContactScreens.styles.js` imports it; current `config/index.js` doesn't export it — **Needs Manual Verification** it isn't crashing at runtime |

Full list: [`05-Design-System/Token-Inconsistencies.md`](05-Design-System/Token-Inconsistencies.md).

---

## 11. Deferred scope

Not visually documented anywhere in the Design Brain (code exists, no captures) — **do not invent UI for these**: Register + `PostSignupPaywallFlow`, `SubscriptionScreen` (RevenueCat), `SubscriptionGate`, `SettingsPlanPaywall`, the Cancel/Upgrade/Buy-extra-credits *purchase* flows (the Settings buttons themselves **are** captured), `CancelAccountConfirmModal`, first-signup onboarding, Android UI (Archive 2 is iOS-only), native splash/Lottie timing, `WhatsNewModal`, spotlight/coaching sheets, HubSpot `Error` screen, lasso drawing, `Notifications`/`RouteSwipe`/`ClusterList` (dead/broken anyway), Edit Route/Edit List full screens, the forgot-password web page. Full list: [`06-Coverage/Deferred-Scope.md`](06-Coverage/Deferred-Scope.md).

## 12. Top "Needs Manual Verification" items

Login logo (cube vs JPG) · who actually sees "Rate the app" · Dynamic Link behavior post-install · Scan Card's post-save destination screen · Filter "By Status" checkboxes (below the fold in capture) · Android visual parity (no Android archive at all) · the `COLOR_PRIMARY` import above. Full list: [`06-Coverage/Needs-Manual-Verification.md`](06-Coverage/Needs-Manual-Verification.md).

---

## 13. Go deeper

| Need | File |
| --- | --- |
| Full color/type/spacing/shadow/icon/logo tables with sources | [`01-Brand-Guidelines/`](01-Brand-Guidelines/README.md) |
| Full screen-by-screen chrome notes, states, forms, modals, maps, platform diffs | [`02-User-Interface/`](02-User-Interface/README.md) |
| Raw screenshots / video frames / logos / icons / **custom font TTFs** | [`03-Assets/`](03-Assets/README.md) · [`03-Assets/Fonts/`](03-Assets/Fonts/README.md) |
| Step-by-step flows per feature (`Start → action → screen → result`) | [`04-User-Flows/`](04-User-Flows/README.md) |
| Component API detail, states, usage checklist, full inconsistency list | [`05-Design-System/`](05-Design-System/README.md) |
| Coverage matrix, screenshot/video index, deferred scope, open questions | [`06-Coverage/`](06-Coverage/README.md) |
| Everything above as originally written (longer, more links) | [`MASTER-DESIGN-BRAIN.md`](MASTER-DESIGN-BRAIN.md) |
