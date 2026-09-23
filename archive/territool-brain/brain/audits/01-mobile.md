---
area: audits
tags: [brain/audits]
ref: "Audit 1 – mobile app review"
---

# Phase 1 — Mobile Codebase Audit (`repos/mobile`)

- **Date:** 2026-09-15
- **Target:** `TT_80` working tree **including uncommitted code** (USER SAID, Phase 0 §12 Q2). This includes the untracked `App/components/route/contact/` and `App/utils/bulkContact*.js`.
- **Status:** STOPPED. The rule list (§8) and decisions (§9) await approval.

## Method and coverage (read this first)

| Done | How |
|---|---|
| Read end to end | `App/App.js`, `App/utils/API.js`, `App/utils/Global.js`, `App/utils/Globalfunction.js`, `App/storage/realm.js`, `App/storage/index.js`, `App/config/index.js`, `App/styles/theme.js`, `init.js`, `App/components/dashboard/RecentActivityScreen.js` |
| Read partially | `recentActivityData.js` (1–110), `route/contact/index.js` (1–160), `list/index.js` (1–230), `scripts/lib/semanticTestIdPolicy.js` (1–80), `docs/Code-Audit-Report-2026-07-06.md` (1–90 + headings) |
| Repo-wide measurement | pattern greps over `App/` excluding `customPackage/` (counts are pattern-based, so treat them as ±5%) |
| Lint | `node_modules/.bin/eslint App init.js index.js` read-only; report kept outside the repo (scratchpad) |
| Duplicate scan | Node script hashing whitespace-normalised function bodies of ≥ 6 lines across files |
| Prior-audit check | 11 findings from the July audit re-checked at their file locations |

**Not read end to end:** the large class screens (`findLeads/aiFindLeads.js` 10,609 lines, `customcompany/index.js` 7,602, `findLeads/index.js` 6,714, `register/postSignupPaywallFlow.js` 5,314, `dashboard/editstatus.js` 3,436, etc.). They are covered only through greps, lint, the duplicate scan and the July audit. Also not audited: native `ios/`/`android/` code, `patches/`, and the vendored `App/customPackage/` forks.

---

## 1. Stack (verified)

| Concern | Finding | Source |
|---|---|---|
| Framework | React Native 0.84.1, React 19.2.3, RN CLI (no Expo) | `package.json` |
| Language | JavaScript. `App/` has **1 TypeScript file** (`utils/commonFunctions.ts`); `tsconfig.json` only includes `*.ts/*.tsx`, so `tsc` checks one file | file counts, `tsconfig.json` |
| Navigation | **One native stack, 49 screens**, `headerShown: false`, ~45 lazy-loaded via `React.lazy` behind one `Suspense`. No tabs or drawer; bottom nav is the custom `components/customfooter` | `App/App.js:48-110, 332-389` |
| Navigation calls | `this.props.navigation.navigate("Name")` with string literals (137), `route.params` (318); no route-name constants; `useNavigation` unused (0) | grep |
| Nav state persistence | Written to AsyncStorage `@TerriTool_nav_state` on every change but **never restored**: `initialState` is always set to `undefined` | `App/App.js:112, 215-217, 277` |
| App-wide state | No store library. Per-screen `this.state` (2,213 `setState` calls). Cross-screen data lives in the **static mutable class `App/utils/Global.js`** (323 references), `DeviceEventEmitter` events, and one Context (`SplashVisibilityContext`) | `Global.js`, `App.js:157-199`, grep |
| HTTP | `App/utils/API.js` static class: `post`, `get`, `get_third_party`. 266 call sites in 48 files | `API.js:213-570`, grep |
| API contract (client side) | Every request is `multipart/form-data` (GET too) to `URL_BASE + endpoint` with `Authorization: Bearer <jwt>`. **HTTP status is never read**; errors come from the body's `status_code`: 401/403 → logout, 400/404/500 → generic toast + throw. Any other code (e.g. 422) is returned as success. Screens then test `status == 1` | `API.js:232-317, 361-434` |
| Auth | JWT stored in Realm object `JWTToken` id `"1"` (value, user_id, email, role, country, domain, env, is_production, notifi_count), read synchronously per request. Realm is **not encrypted** (no `encryptionKey`). Session expiry: `logout()` → `SESSION_EXPIRED_EVENT` → modal → reset to Login | `storage/realm.js:29-50, 119-136, 417-459`; `Globalfunction.js`; `App.js:171-199, 401-429` |
| Local storage | Realm schemaVersion 18: `JWTToken`, `offlineRoute`, `TourSchema`, `AIFindLeads` (+ `fcmrealm.js`). If Realm init fails, the file is **deleted and recreated**, which silently logs the user out. AsyncStorage: 32 call sites | `realm.js:417-459` |
| Offline | `getOFFLINERoute("1")` is read in `route/index.js:707`, but **nothing calls `createOFFLINERoute`**, so the offline route cache is never written | grep |
| Forms | No form library in practice: manual state + `new FormData()` (152) / `.append` (663); `react-native-form-validator` in 4 files | grep |
| Styling | Tokens in `App/styles/theme.js`: ~110 colours, spacing/radius `xxs–xxl` (scaled), typography via `makeTypography`, `shadows.sm/md/lg`, `layout.minTouchTarget`, `hitSlop`. Co-located `*.styles.js` (49). Legacy 760-line `styles/common.js`; `scaledSize()` 306 uses | `theme.js:22-292` |
| UI primitives | Legacy NativeBase replaced by **shim `utils/NativeBaseCompat.js`** (Container, Header, Footer, Text, Icon, Spinner, Toast, Tabs…), imported by 33 files **including the newest code** (`route/contact/index.js:13`, `RecentActivityScreen.js:13`). `TouchableOpacity` 471 · `Pressable` 112 · `AppButton` in 12 files | `NativeBaseCompat.js:69-349`, grep |
| Overlapping libraries | Dropdowns ×3 (forked `customPackage/react-native-select-dropdown` in 19 files, `react-native-dropdown-picker` 6, `@react-native-picker/picker` 1). Dates ×2: **`moment` in 18 files but NOT declared in `package.json`** (only installed transitively); `dayjs` declared, used in 1. Image pickers ×2. `react-native-ui-datepicker` declared + patched, 0 imports. `underscore` via `require()` inside functions in 32 files | grep, `package.json` |
| Feedback | `Toast.show` 354 · `Alert.alert` 15 · `AppConfirmModal` | grep |
| Observability | Sentry + PostHog + Crashlytics. Every API failure reports to all three. `captureSentryError(error, screen, action, context, level)` is the helper. Global handlers route **unhandled promise rejections to the full-screen crash UI** | `init.js:78-178`, `API.js:83-134`, `utils/SentryHelper.js:34`, `utils/crashRecovery.js:253-290` |
| Test hooks | Semantic testID policy `screen.<key>.<element>` / `component.<key>.<element>` with audit/injection scripts. 1,406 `testID`s, 326 `accessibilityLabel`s | `scripts/lib/semanticTestIdPolicy.js:10-68`, `scripts/audit-missing-testids.js` |
| Lint | `@react-native` default config. **50 errors / 3,074 warnings in 97 of 235 files.** Top: `no-inline-styles` 1,229, `eqeqeq` 1,203, `no-unused-vars` 324. No CI runs it | ESLint run |
| i18n | None: all copy is hardcoded English | grep (0 hits) |

---

## 2. Architecture: how a feature is built

Two generations coexist.

| | Gen 1: legacy (most of the code by size) | Gen 2: current direction (all new code) |
|---|---|---|
| Component | `class X extends Component`, 1.5k–10.6k lines, one per screen | function component + hooks (`useFocusEffect`, `useRoute`) |
| Where logic lives | state, API calls, business rules, rendering all in the screen | screen plus extracted pure helpers/mappers and `utils/*` modules |
| Shared data | `Global.js` getters/setters | route params, module-level stores with subscribe (`utils/bulkContactSession.js`), events |
| Reuse | copy-paste forks (§3) | shared `common/`, `customheader/`, `utils/` |
| Evidence | 42 class files, e.g. `list/index.js:81` | **0 class components added since 2026-05-15.** Every component file added since then is a function (hooks or stateless): `common/AppCrashFallback.js`, `customheader/HeaderAddMenu.js`, `dashboard/{CalendarActivity,Notifications,QrCodeScanner}Screen.js`, `customcompany/FindContactsFetchModal.js`, `route/contact/*` … |

**There is no hook/service layer.** The brief's "screen → hook → service → API → type" chain does not exist here. There are no data hooks (only 3 local animation hooks: `RoutePublishingLoader.js:80`, `FindContactsFetchModal.js:329,435`), no per-domain service modules, and no types. API calls live inside screens. The real chain is **screen → FormData → `API.js` → endpoint constant → response mapper (optional) → render.**

### Canonical example: Activity (Recent / Upcoming)

```
Stack.Screen "RecentActivity"                       App/App.js:345 (lazy :49)
└─ RecentActivityScreen({ navigation })             components/dashboard/RecentActivityScreen.js:156
   ├─ state: items, loading ×2, refreshing           :159-168
   ├─ useFocusEffect → load()                        :250-258
   ├─ load(): new FormData(); append("scope","")     :188-189, :215-216
   ├─ API.post(URL_GET_COMPANY_ACTIVITIES, fd, {navigation})   :190  → config/index.js:132 'getcompanyactivities'
   ├─ API.post(URL_GET_USER_ACTIVITY,     fd, {navigation})    :217  → config/index.js:45  'getUserActivity'
   │    └─ utils/API.js _postOnce                    :229-342
   │        Bearer JWT (Realm) · POST URL_BASE+endpoint · body status_code 401/403 → logout · 400/404/500 → toast+throw
   ├─ success test: data?.status == 1                :223  (else toast data.message, empty list)
   ├─ mapping: mapUserActivityApiResponse(...)       dashboard/recentActivityData.js
   │    JSDoc typedef DashboardActivityItem          recentActivityData.js:13-16  ← the only "type" layer
   ├─ errors: captureSentryError(e, "activity_screen", "fetch_recent")   :208, :238 + reset list
   ├─ .finally → clear loading flags                 :211-213, :241-243
   └─ render: initial spinner / tab loader / FlatList + pull-to-refresh + ListEmptyComponent + testIDs   :343-373
```

The server side of `getUserActivity` / `getcompanyactivities` is traced in Phases 2–3.

**Copy this structure. Do not copy these parts of the same file:**
- inline style objects and hand-built `"#000"` shadows (`:63-71`, `:112-133`; `theme.shadows` exists)
- the commented-out JSX block (`:328-341`)
- magic spacing numbers (`:42-45`)
- `Container` from the NativeBase shim (`:13`, `:318`; see D2)

---

## 3. Reusability audit: concrete duplicates

The scan found **92 groups** of identical function bodies (≥ 6 lines) spread across files. The July audit proves these forks have already drifted into different bugs (H32, H33, H34).

### 3.1 Fork families

| Family | Duplicated functions (examples, file:line) |
|---|---|
| **Lists ↔ Routes** (`list/` vs `route/`: create, edit, filter, select-start-end-points) | `outputFilterModal` 66 lines `list/edit.js:959` ↔ `route/edit.js:1087` · `renderSkeletonRow` 65 `list/create.js:1033` ↔ `route/create.js:1037` · `getCurrentCoordinates` 48 `list/create/select-start-end-points.js:237` ↔ `route/create/select-start-end-points.js:182` · `removeWaypoint`, `openAllStartWaypointSelection`, `openAllEndWaypointSelection`, `_hasActiveFiltersFromAppliedValues`, `addInSelectedTab`, `clearCompanyFilter`, `filterCityChanged` · `setcompanyvalue` ×4 and `renderFooter` ×4 (list+route create/edit) · `submitShareEmail` ×4 (`list/basic`, `list/index`, `route/basic`, `route/index`) · `getMapRegionFromWaypoints`, `zoomMapIn`, `zoomMapOut` ×3 |
| **Find Leads ↔ AI Find Leads ↔ Lasso** | `onCreatePolygon` ×3 (`aiFindLeads.js:2250`, `findLeads/index.js:1191`, `route/lassoMap.js:212`) · `getDistanceFromLatLonInKm` ×3 (twice inside `aiFindLeads.js` itself: `:1682`, `:5494`), even though `geolib` is a declared dependency · `backToPostSaveChoiceModal` · `selectFilterCity`/`changeopenSort` ×3 incl. `lassoMap.js` · `CityAutocompleteScrollResults` also in `company/businessCard/index.js:187` |
| **Dashboard ↔ archived copy** | `dashboard/AppCue/Archive/index.js` is a full old copy of `dashboard/index.js` (`syncUpdateApi`, `syncValueApi`, `hydrateNativeVersionDisplay`, `fetchRecentActivity`, `fetchUpcomingActivity`, `logoutUser`) plus `Archive.zip`. It's imported nowhere but still ships lint errors |
| **Contacts create ↔ update** | `safeStringCompanyName` (`contacts/create.js:39` ↔ `update.js:29`), `selectFilterCity` |
| **Two company views** | `closeReportCompanyModal` (`company/view.js:270` ↔ `route/basic/company-view.js:205`) |
| **Start/end point modals** | `openStartEndPOintSelectionModal` / `hideStartEndPointSelectionModal` ×5 (`activeroutemap/index.js:756`, list+route create/edit select-points, `lassoMap.js:1018`) |
| **Legal links** | `EULALink`/`PPLink` in 4 files (`login/index.js:178`, `register/index_register_split.js:631`, `register/SettingsPlanPaywall.js:790`, `register/subscribe.js:1897`). `common/AuthLegalFooter.js` renders the labels but receives the press handlers, so the link-opening logic is still copied |
| **API.js internals** | `_postOnce` / `_getOnce` / `_getThirdPartyOnce` are ~90% identical bodies (`API.js:229-569`) |

Accepted duplicate: `captureRealmSentryError` in `storage/realm.js:4` is intentional, to avoid a circular import (documented at `:3`).

### 3.2 "Search before you create": what already exists

| Need | Use | Path |
|---|---|---|
| Confirm / destructive dialog | `AppConfirmModal` | `components/common/AppConfirmModal.js` |
| Primary/secondary button | `AppButton` | `components/common/AppButton.js` |
| Screen header, add button, add menu, icon button | `CustomHeader`, `HeaderAddButton`, `HeaderAddMenu`, `HeaderIconButton` | `components/customheader/` |
| Bottom navigation | `CustomFooter` | `components/customfooter/index.js` |
| Share-by-email field + error | `ShareEmailField`, `ShareEmailError` | `components/common/` |
| Report contact / company | `ReportContactModal`, `ReportContactInfoModal`, `utils/reportCompany.js`, `utils/reportContact.js` | |
| Crash fallback, what's-new, spotlight tour, scroll hint, search glyph | `AppCrashFallback`, `WhatsNewModal`, `SpotlightTourModal`, `ScrollHintArrow`, `SearchGlyph` | `components/common/` |
| Route publishing loader, waypoint pin | `RoutePublishingLoader`, `RouteWaypointPinIcon` | `components/route/common/`, `route/shared/` |
| Activity date/time field, map app chooser, find-contacts progress | `ActivityDateTimePickerField`, `MapChooserPopup`, `FindContactsFetchModal` | `components/customcompany/` |
| Open company / route detail | `navigateToViewCompanyById`, `navigateToRouteDetail` | `utils/` |
| Permissions, location, media | `permissionPrompts`, `permissionSettingsAlert`, `locationAccess`, `mediaPermissionAccess` | `utils/` |
| Connectivity / retry | `ConnectivityHelper`; `API.post(..., signal, { maxAttempts })` | `utils/ConnectivityHelper.js`, `API.js:140-211` |
| Error reporting | `captureSentryError` | `utils/SentryHelper.js:34` |
| Subscription gating | `fetchFreeTrialStatus`, `shouldRedirectToSubscriptionGate` | `utils/subscriptionGate.js` |
| Tokens, curved screen body, platform text fixes | `theme`, `screenCurvedBodyStyles`, `makeTypography` | `styles/theme.js`, `styles/screenCurvedBody.js`, `styles/platformText.js` |
| Distance between coordinates | `geolib` (already declared) | — |

---

## 4. Type discipline

- **No static types.** 234 JS files; the one TS file uses `any` (`commonFunctions.ts:102 commonApiHeaders: any`, and that export has 0 callers). No PropTypes (0), no `@ts-check` (0).
- **Props are untyped everywhere.** Best existing documentation is the JSDoc on `API.js` methods (`:214-220`) and the typedefs in `recentActivityData.js:13-16`. There are 128 `@param` tags repo-wide.
- **API responses are untyped, and consumers defend against shape drift.** For example, `route/contact/index.js:51-69` reads `total_contact ?? data.total_contact ?? contact_count ?? data.contact_count` and checks `status == 0 || status === "0"`. There are 215 loose `status == 1` checks and 1,203 `eqeqeq` warnings. This points at an inconsistent server contract (to verify in Phase 2/3).
- **ESLint errors that are real runtime bugs** (ES modules are strict, so undefined identifiers throw):

| Rule | Location | Effect |
|---|---|---|
| `no-undef` | `list/create.js:380-386` (`jsonObject`, `uniqueSet`, `uniqueArray`), `route/create.js:403-413` (same) | ReferenceError when that branch runs |
| `no-undef` | `route/create.js:724` `filterCompaniesLength` | July H23: throws on every successful company-list response |
| `no-undef` | `list/edit.js:288` and **`route/edit.js:302`** `Toast` (only `RNToast` imported) | ReferenceError instead of an error toast. The `route/edit.js` instance is **not in the July audit** |
| `no-undef` | `route/basic/index.js:1970` `PATCH_QUALIFIER_CLOSE_MS` | July H22 |
| `no-undef` | `customcompany/index.js:1989` `d` | ReferenceError (reachability not verified) |
| `no-dupe-class-members` | `findLeads/aiFindLeads.js:4971, 4975, 5032, 5494, 5511, 5577, 6003`; `findLeads/index.js:2885`; `activeroutemap/index.js:567` | the later definition silently replaces the earlier one |
| `no-dupe-keys` | `company/list.js:153`, `route/basic/index.js:220`, `route/lassoMap.js:326, 370` | the earlier value is silently lost |

---

## 5. Consistency: where the codebase contradicts itself

| Area | Contradiction | Evidence |
|---|---|---|
| Component style | 42 class vs 23 hook files; new code is 100% functions | §2 |
| File naming | Five conventions in `components/`: `index.js` (20), PascalCase (38), lowercase (24, e.g. `editstatus.js`, `goswipe.js`), camelCase (11, e.g. `aiFindLeads.js`), snake/kebab (`index_register_split.js`, `select-start-end-points.js`, `company-view.js`). Folder casing also mixed (`customcompany`, `findLeads`, `activeroutemap`, `bizContact`) | `find` |
| Names vs files | `list/index.js:81` declares `class RouteList` for the **Lists** screen; stack names mostly PascalCase except `bizCompanies`, `bizContacts` (`App.js:383-384`) | read |
| Styling | Theme tokens (1,761 `theme.colors.*` refs) vs **1,329 hardcoded hex** vs 913 inline `style={{}}`; `styles/common.js` and `styles/commonStyles.js` both exist. The most-hardcoded hexes **already exist as tokens**: `#6B7280`×163 = `textSecondary`, `#111827`×130 = `textPrimary`, `#9CA3AF`×79 = `disabled`, `#E5E7EB`×65 = `border`, `#374151`×45 = `textMuted`, `#F3F4F6`×39 = `surfaceMuted`. Near-duplicate tokens inside the theme: `secondary`/`info` `#4A90E4` vs `blue` `#4a90e2`; `black`/`textBlackPure`/`shadowBlack` all `#000000`; `primaryDark` is teal `#00A99D` (not a dark primary) → Phase 4 | grep, `theme.js:25-101` |
| Imports | No ordering convention (theme first in `list/index.js:1`, React first in `RecentActivityScreen.js:1`); `require()` inside functions (32 files for `underscore`); an import placed after code (`App.js:17-20`) | read |
| Error handling | Four patterns: (a) `.catch` → `captureSentryError` + reset (good, `RecentActivityScreen.js:207-213`); (b) **`.catch` → `logout()`, which logs users out on a network blip**: `route/create.js:1467`, `route/filter.js:199`, `list/create.js:1423`, `list/filter.js:193`, `findLeads/index.js:3148`, `aiFindLeads.js:5855`; (c) **34 empty `catch {}`** (mostly telemetry in utils, but also `customcompany/index.js:611, 793, 3807`, `route/basic/index.js:303, 370`, `lassoMap.js:274`); (d) no catch: 226 `.then(` vs 246 `.catch(` overall, and the July audit lists specific missing ones (H7, H10) | grep |
| Loading / empty / error | Hand-rolled per screen (112 `ActivityIndicator`, 40 `ListEmptyComponent`); no shared state components. July audit: loaders set before a request and never reset on failure (H6–H11, H35) | grep, July audit |
| Retry / offline | `API.js` defaults to 1 attempt with opt-in retries; `NetInfo.fetch()` checks scattered in screens (`customfooter/index.js:84`, `route/create.js:1331`, `list/create.js:1299`); offline route cache never written (§1) | grep |
| Roles | Mobile only branches on **"Business Sales Agent"** (`dashboard/index.js:258, 285`; `customfooter/index.js:177`; `editstatus.js:1810, 2232, 2510`). No checks for Sales Agent, Business Agent (Manager) or Admin | grep |
| Dead code | `dashboard/AppCue/Archive/` + `Archive.zip`; ~362 commented-out code lines; `commonApiHeaders` (0 callers); nav-state persistence (written, never read); `react-native-ui-datepicker` (declared + patched, 0 imports); `list/index.js:95-102` `_sharedEmails` (6 internal staff emails, assigned and never read) | grep |

### Security and privacy (recorded, not acted on)

The user is aware of committed secrets in general (Phase 0 Q10). These are listed so the brain never repeats them.

- **S6** Billable API keys bundled in the client (`App/config/index.js:201, 208, 212, 216`: Google, Gemini, Directions, Mapbox) and **plaintext account credentials in a comment at `:215`**. Still present; July audit C1/H3.
- **S7** Release Sentry config: `sendDefaultPii: true`, **100% unmasked session replay** (`maskAllText/Images/Vectors: false`), traces and profiles at 1.0, plus a `captureMessage` "heartbeat" on every launch (`init.js:56-60, 81, 94, 99-100, 110, 163`). Still present; July H2.
- **S8** On POST failure the raw `FormData`, including `password` from login/register, is `JSON.stringify`'d into Sentry context (`API.js:244` → `:331-338`). The redactor `formDataToObject()` (`API.js:20`) exists but is unused. Still present; July H1.
- **S9** The JWT and profile are stored in unencrypted Realm (`realm.js:419`).

---

## 6. Comparison with `shoebox/05-standards`

`05-standards/mobile-good/` and `mobile-bad/` are **empty**, so no comparison is possible. The closest signal of team intent is the team's own work: the July code audit, `Prompts/INLINE_STYLE_AUDIT.md`, `Prompts/CodebaseAudit_ClassVsFunction.md`, the semantic testID scripts, and the Gen 2 files. They all point the same way: function components, theme tokens, semantic testIDs, central error reporting. The rules in §8 follow that direction rather than inventing a new one.

---

## 7. July 2026 audit (`docs/Code-Audit-Report-2026-07-06.md`): still valid?

Re-checked 2026-09-15 at the cited locations (line numbers have shifted slightly):

| ID | Finding | Status |
|---|---|---|
| C1 | Plaintext credentials in config comment | **Present** (`config/index.js:215`) |
| C2 | Network error during route creation → logout | **Present** (`findLeads/index.js:3148`, `aiFindLeads.js:5855`) |
| H1 | Raw FormData incl. password to Sentry | **Present** (`API.js:244`) |
| H2 | Sentry PII + unmasked replay | **Present** (`init.js`) |
| H4 | `route/filter.js` catch → logout | **Present** (`:199`) |
| H5 | `route/create.js` / `list/create.js` catch → logout | **Present** (`:1467` / `:1423`) |
| H22 | `PATCH_QUALIFIER_CLOSE_MS` undefined | **Present** (`route/basic/index.js:1970`) |
| H23 | `filterCompaniesLength` undefined | **Present** (`route/create.js:724`) |
| H24 | BackHandler never removed | **Present** (`edit-publish-route.js:276-277`) |
| H31 | `Toast` not imported in `list/edit.js` | **Present** (`:288`); same bug also in `route/edit.js:302` |
| H32 | Double page increment in `list/edit.js` | **Present** (`:336` + `:346`; `route/edit.js` has one) |
| H12 | Cancel-subscription message precedence | Not confirmed (my search pattern didn't match; needs a manual read) |

**Conclusion:** every finding I could check is still present. The report is a trustworthy input for `fragile.md` (B2) and the Phase 5 regression map.

---

## 8. PROPOSED RULES: for approval

Scope: these apply to **new and changed lines**. They do not authorise mass refactors. Each rule has an objective check. "Codifies" means the team already does this in new code; "Corrects" means it stops a pattern the audit shows is causing bugs.

| # | Rule | Check | Basis |
|---|---|---|---|
| **M1** | New screens and components are **function components with hooks**. Never add a class component. Edit existing class screens in place; don't convert them unless conversion is the task. | New file contains no `extends Component` | Codifies. 0 class files added since 2026-05-15 |
| **M2** | All network calls go through **`App/utils/API.js`** (`API.post`/`API.get`; `get_third_party` for absolute external URLs). Endpoint paths are **exported constants in `App/config/index.js`**. No raw `fetch(` in `App/components/`. | `grep 'fetch('` in changed component files = 0 | Codifies (266 call sites). Existing exceptions: `findLeads/fetchingResults.js`, `common/WhatsNewModal.js` |
| **M3** | Request bodies are `FormData`. Pass `{ navigation }` as the 3rd argument so session expiry can reset navigation. A response is successful **only when `data?.status == 1`**; otherwise show `data.message` if present, then put the screen in its empty or error state. | Canonical pattern present; no other success test | Codifies `RecentActivityScreen.js:188-236` (see Q-M4 on the loose `==`) |
| **M4** | Every API promise chain has error handling that **(a) calls `captureSentryError(error, "<screen>", "<action>")` and (b) resets every loading/pressed/disabled flag set before the call (use `.finally`)**. | Each `API.` call in the diff has a `.catch` + `.finally` or try/catch/finally | Corrects July H6–H11, H35 |
| **M5** | **Never call `logout()` from an error handler.** Session expiry is handled centrally by `API.js` (401/403). `logout()` only runs from an explicit user sign-out action. | `grep 'logout('` in diff only in sign-out handlers | Corrects the 6 sites in §5 (July C2, H4, H5) |
| **M6** | **No empty `catch {}` in `App/components/`.** Empty catches are allowed only around best-effort telemetry (Sentry/PostHog/Crashlytics) in `App/utils/`. | regex `catch *(\([^)]*\))? *\{ *\}` = 0 in changed component files | Corrects 34 sites |
| **M7** | Every data screen renders four explicit states: **initial loading** (`ActivityIndicator`, `theme.colors.primary`), **refreshing** (pull-to-refresh), **empty** (`ListEmptyComponent` with copy), **error** (toast + a state the user can retry from). None may leave a spinner forever. | Reviewer checklist: four states visible in JSX; failure path clears loading | Codifies `RecentActivityScreen.js:343-373` |
| **M8** | **No hardcoded design values in new/changed lines:** colours, spacing, radii, font sizes/families and shadows come from `theme` (`App/styles/theme.js`). If a token is missing, add it to `theme.js`; never inline it. Token *names* may change after Phase 4; the rule doesn't. | Diff has no `#[0-9A-Fa-f]{3,8}`/`rgba(` outside `theme.js`, no `fontSize: <number>`, no hand-built `shadowColor` | Corrects 1,329 hex (most already duplicate tokens) |
| **M9** | Styles live in a co-located **`<File>.styles.js` using `StyleSheet.create`**. `style={{…}}` literals are allowed only for values computed at render time (insets, animation, measured sizes). | ESLint `react-native/no-inline-styles`: 0 new warnings in changed files | Codifies 49 `*.styles.js`; corrects 1,229 warnings |
| **M10** | **Search before you create.** Before adding a component, util or style, check the §3.2 inventory and grep `components/common`, `components/customheader`, `App/utils`, `App/styles`. The change summary must state what was searched and why nothing fit. | "Searched:" line in change summary; no new file duplicating a §3.2 capability | Corrects 92 duplicate groups |
| **M11** | **No new forks, and fix all known forks together.** When changing a function that exists in a fork family from §3.1 (Lists ↔ Routes, Find Leads ↔ AI Find Leads ↔ Lasso, Contacts create ↔ update, the two company views), apply the same change to every copy in the same change set, or extract it into a shared module. | Duplicate-scan groups touched in the diff are touched in all members | Corrects July H32–H34 drift |
| **M12** | Every screen root and interactive element gets a **semantic testID** `screen.<screenKey>.<element>` or `component.<componentKey>.<element>`. New screen/component files are added to `FILE_RULES` in `scripts/lib/semanticTestIdPolicy.js`. | `node scripts/audit-missing-testids.js` shows no new missing IDs for changed files | Codifies 1,406 testIDs + policy |
| **M13** | Screens are registered in **`App/App.js`** as a `Stack.Screen` with a **PascalCase name**, lazy-loaded via `React.lazy`. Function screens receive `{ navigation }` and read params with `useRoute()`/`route.params?.x` plus a default. Navigate only to registered names. | New `Stack.Screen name` matches `/^[A-Z]/`; lazy import present | Codifies `App.js:48-110`, `RecentActivityScreen.js:156-158` |
| **M14** | **Don't add fields to `App/utils/Global.js`.** New cross-screen state goes through route params, or a small module with explicit `get`/`set`/`subscribe` that returns an unsubscribe (e.g. `utils/bulkContactSession.js`). Screens unsubscribe on blur/unmount. | Diff adds no `static _x` to `Global.js` | Corrects Global-seeded wrong-record bugs (July H26) |
| **M15** | When a screen can fire overlapping requests (typing search, stepper next/prev, re-focus), **ignore stale responses**: pass an `AbortController` `signal` to `API.post/get` or compare a request id before `setState`. | Reviewer checklist for search/stepper/focus fetches | Corrects July H25; pattern exists in `company/list.js` (`_companyListRequestId`) |
| **M16** | **Telemetry never contains secrets or PII payloads.** Report handled errors only via `captureSentryError(error, screen, action, context)`. Never `JSON.stringify` a `FormData`, request body, password, token or email into telemetry; use `formDataToObject()` redaction. | Diff has no `JSON.stringify(formdata)` or password/token keys in Sentry/PostHog context | Corrects S8 (July H1) |
| **M17** | **No secrets, credentials or personal data in source.** Never add API keys, tokens, passwords, test-account logins or staff emails to `App/config/index.js`, `package.json` or any file. Existing ones are known issues; don't copy or extend them. | Secret-pattern grep on diff (`AIza`, `pk.ey`, `phc_`, `password`, `@picwa`) = 0 | Corrects S6, `list/index.js:95-102` |
| **M18** | **Dependencies:** import only packages declared in `package.json`. Don't add a second library for a job already covered: dropdown = `customPackage/react-native-select-dropdown`; modal = `react-native-modal` / `AppConfirmModal`; toast = `react-native-toast-message`; distance = `geolib`; dates = see D1. Adding any dependency needs user approval. | Every new import resolves to a declared dependency; no new entries in `package.json` without approval | Corrects undeclared `moment`, 3 dropdown libs |
| **M19** | **Lint gate.** Changed files must not add ESLint errors. `no-undef`, `no-dupe-class-members`, `no-dupe-keys` and `react-hooks/exhaustive-deps` are **blocking**, because in this codebase they are real runtime bugs (§4). | `node_modules/.bin/eslint <changed files>` shows no new errors | Corrects the 50 current errors |

## 9. DECISIONS NEEDED (the user's call, not Claude's)

| # | Decision | Options | Recommendation |
|---|---|---|---|
| **D1** | Date library for new code | (a) `moment`: used in 18 files but **undeclared**, so declare it; (b) `dayjs`: declared, used in 1 file | **(a)** Declare `moment` and use it; don't migrate. It's the de facto standard here and the lowest-risk option |
| **D2** | `utils/NativeBaseCompat.js` in new code | (a) allow everything (current practice, even in the newest files); (b) allow only layout `Container`; ban shim `Text`/`Icon`/`Toast`/`Button`/`Spinner`; (c) ban entirely | **(b)** |
| **D3** | Touchables in new code | (a) keep `TouchableOpacity`; (b) `Pressable` for rows/icons + `AppButton` for CTAs | **(b)** |
| **D4** | File naming for **new** files (existing files keep their names) | (a) components `PascalCase.js` + `PascalCase.styles.js`, utils `camelCase.js`, screens in existing feature folders; (b) leave unregulated | **(a)** |
| **D5** | Rule scope | (a) new/changed lines only; (b) also refactor while touching a file | **(a)**, because the files are huge and the July audit shows fixes easily break forks |

## 10. OPEN QUESTIONS (need the user; the code can't answer)

- **Q-M1 Roles on mobile.** The app only branches on "Business Sales Agent". Can **Admin** and **Business Agent (Manager)** log in on mobile? If so, should they see anything different from a Sales Agent?
- **Q-M2 `dashboard/AppCue/Archive/` + `Archive.zip`.** Can the brain treat these as dead (excluded from reuse, lint and QA), or are they kept deliberately?
- **Q-M3 Offline mode.** `getOFFLINERoute` is read (`route/index.js:707`) but never written. Was offline route support dropped on purpose, or is this a regression the QA gate should catch?
- **Q-M4 `status` type.** Rule M3 keeps `status == 1` (loose) because responses seem to mix `1` and `"1"`. I'll confirm the server side in Phase 2. Is there any known endpoint that returns `true`/`"success"` instead?

---

## 11. APPROVAL RECORD (USER SAID, 2026-09-15)

- **Rules M1–M19: APPROVED** as written.
- **Decisions D1–D5: APPROVED** with the recommended options:
  - D1: declare and use `moment`.
  - D2: only layout `Container` from the NativeBase compatibility shim.
  - D3: `Pressable` for rows/icons and `AppButton` for main actions.
  - D4: PascalCase component files, camelCase util files, for new files only.
  - D5: new/changed code only.
- **Scope, reinforced by the user:** "just use for the new code, do not touch the old code." The rules govern new code only. Existing code is **not** refactored, reformatted or "fixed along the way" unless a task explicitly targets it.
- **Q-M1:** **Admin and Business Agent (Manager) do not log in to mobile; web only.** Mobile users are **Sales Agent** and **Business Sales Agent**, which matches the code only branching on "Business Sales Agent".
- **Q-M2:** Yes. `dashboard/AppCue/Archive/` and `Archive.zip` are dead code, excluded from reuse, lint gating and QA.
- **Q-M3:** ~~Interpreted as "dropped on purpose"~~. **Corrected by the owner (2026-09-15): accidental half-removal.** Writes are gone (`createOFFLINERoute` never called); the read remains (`route/index.js:707`). Product decision pending: keep (restore the snapshot save) or drop (remove the read path + Realm schema). Tracked as BT-11 in `03-parity.md` §7.
- **Q-M4:** Success is **only `status: 1`**; no endpoint uses `true`/`"success"`. Rule M3 stands. Whether it arrives as `1` or `"1"` is checked server-side in Phase 2.

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (111)

**Documents (18):** [[brain/context/architecture|Architecture: how Territool is built, end to end]] · [[brain/audits/02-web|Audit 2 – web app review]] · [[brain/audits/03-parity|Audit 3 – mobile vs web]] · [[brain/audits/04-design|Audit 4 – design review]] · [[CLAUDE-CODE-BOOTSTRAP|Claude Code Bootstrap Prompt]] · [[brain/context/design-assets|Design files & asset rules]] · [[brain/assets/docs/mobile-ui-prompts/INLINE_STYLE_AUDIT|Inline CSS / Style Audit Report]] · [[shoebox/09-known-issues/fragile|Known issues draft]] · [[brain/context/conventions-mobile|Mobile app coding rules]] · [[brain/context/parity-map|Mobile vs web differences]] · [[shoebox/07-flows/flows|Original flow descriptions]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/conventions-shared|Rules for all code]] · [[brain/skills/territool-design/SKILL|Skill – design]] · [[brain/skills/territool-router/SKILL|Skill – task router (start of every task)]] · [[brain/context/stack|Tech setup & environments]] · [[brain/skills/territool-router/LOOP|The fix-until-done loop]] · [[_code/brain/tools/brain-graph.js|Tool – build this map]]

**Coding rules (24):** [[_id/M14|Don't grow the Global file]] · [[_id/M4|Every network call reports errors]] · [[_id/D4|File naming]] · [[_id/M11|Fix every copy of duplicated code]] · [[_id/M15|Ignore outdated responses]] · [[_id/M7|Loading, empty & error states]] · [[_id/M12|Meaningful test IDs]] · [[_id/M2|Network calls only through API.js]] · [[_id/M5|Never log users out on errors]] · [[_id/D5|New code only]] · [[_id/M1|New screens as function components]] · [[_id/M8|No hard-coded colours or sizes]] · [[_id/M19|No new code-check errors]] · [[_id/M18|No new libraries without approval]] · [[_id/M16|No secrets in analytics]] · [[_id/M17|No secrets in the code]] · [[_id/M6|No silent error catching]] · [[_id/D2|Only Container from NativeBase]] · [[_id/D3|Pressable for rows, AppButton for buttons]] · [[_id/M13|Register screens properly]] · [[_id/M10|Search before creating]] · [[_id/M9|Styles in separate files]] · [[_id/M3|Success only when status is 1]] · [[_id/D1|Use moment for dates]]

**Owner decisions (5):** [[_id/BT-11|Offline mode dropped]] · [[_id/Q-M2|Question: is the AppCue archive dead code?]] · [[_id/Q-M3|Question: were offline routes dropped on purpose?]] · [[_id/Q-M4|Question: what counts as API success?]] · [[_id/Q-M1|Question: which roles use the mobile app?]]

**Code files (64):** [[_code/mobile/App/components/activeroutemap/index.js|activeroutemap/index.js]] · [[_code/mobile/App/components/findLeads/aiFindLeads.js|aiFindLeads.js]] · [[_code/mobile/App/utils/API.js|API.js]] · [[_code/mobile/App/components/common/AppButton.js|AppButton.js]] · [[_code/mobile/App/components/common/AppConfirmModal.js|AppConfirmModal.js]] · [[_code/mobile/App/components/common/AuthLegalFooter.js|AuthLegalFooter.js]] · [[_code/mobile/App/components/route/basic/index.js|basic/index.js]] · [[_code/mobile/App/utils/bulkContactSession.js|bulkContactSession.js]] · [[_code/mobile/App/components/company/businessCard/index.js|businessCard/index.js]] · [[_code/mobile/App/styles/common.js|common.js]] · [[_code/mobile/App/utils/commonFunctions.ts|commonFunctions.ts]] · [[_code/mobile/App/styles/commonStyles.js|commonStyles.js]] · [[_code/mobile/App/components/route/basic/company-view.js|company-view.js]] · [[_code/mobile/App/config/index.js|config/index.js]] · [[_code/mobile/App/utils/ConnectivityHelper.js|ConnectivityHelper.js]] · [[_code/mobile/App/components/route/contact/index.js|contact/index.js]] · [[_code/mobile/App/utils/crashRecovery.js|crashRecovery.js]] · [[_code/mobile/App/components/list/create.js|create.js]] · [[_code/mobile/App/components/route/create.js|create.js]] · [[_code/mobile/App/components/contacts/create.js|create.js]] · [[_code/mobile/App/components/customcompany/index.js|customcompany/index.js]] · [[_code/mobile/App/components/customfooter/index.js|customfooter/index.js]] · [[_code/mobile/App/components/dashboard/index.js|dashboard/index.js]] · [[_code/mobile/App/components/route/edit/edit-publish-route.js|edit-publish-route.js]] · [[_code/mobile/App/components/list/edit.js|edit.js]] · [[_code/mobile/App/components/route/edit.js|edit.js]] · [[_code/mobile/App/components/dashboard/editstatus.js|editstatus.js]] · [[_code/mobile/App/storage/fcmrealm.js|fcmrealm.js]] · [[_code/mobile/App/components/findLeads/fetchingResults.js|fetchingResults.js]] · [[_code/mobile/App/components/route/filter.js|filter.js]] · [[_code/mobile/App/components/list/filter.js|filter.js]] · [[_code/mobile/App/components/customcompany/FindContactsFetchModal.js|FindContactsFetchModal.js]] · [[_code/mobile/App/components/findLeads/index.js|findLeads/index.js]] · [[_code/mobile/App/utils/Global.js|Global.js]] · [[_code/mobile/App/utils/Globalfunction.js|Globalfunction.js]] · [[_code/mobile/App/components/route/basic/goswipe.js|goswipe.js]] · [[_code/mobile/App/components/customheader/HeaderAddMenu.js|HeaderAddMenu.js]] · [[_code/mobile/App/components/register/index_register_split.js|index_register_split.js]] · [[_code/mobile/App/components/route/lassoMap.js|lassoMap.js]] · [[_code/mobile/App/components/company/list.js|list.js]] · [[_code/mobile/App/components/list/index.js|list/index.js]] · [[_code/mobile/App/components/login/index.js|login/index.js]] · [[_code/mobile/App/utils/NativeBaseCompat.js|NativeBaseCompat.js]] · [[_code/mobile/App/styles/platformText.js|platformText.js]] · [[_code/mobile/App/components/register/postSignupPaywallFlow.js|postSignupPaywallFlow.js]] · [[_code/mobile/App/storage/realm.js|realm.js]] · [[_code/mobile/App/components/dashboard/recentActivityData.js|recentActivityData.js]] · [[_code/mobile/App/components/dashboard/RecentActivityScreen.js|RecentActivityScreen.js]] · [[_code/mobile/App/utils/reportCompany.js|reportCompany.js]] · [[_code/mobile/App/utils/reportContact.js|reportContact.js]] · [[_code/mobile/App/components/route/index.js|route/index.js]] · [[_code/mobile/App/components/route/common/RoutePublishingLoader.js|RoutePublishingLoader.js]] · [[_code/mobile/App/styles/screenCurvedBody.js|screenCurvedBody.js]] · [[_code/mobile/App/components/list/create/select-start-end-points.js|select-start-end-points.js]] · [[_code/mobile/App/components/route/create/select-start-end-points.js|select-start-end-points.js]] · [[_code/mobile/App/utils/SentryHelper.js|SentryHelper.js]] · [[_code/mobile/App/components/register/SettingsPlanPaywall.js|SettingsPlanPaywall.js]] · [[_code/mobile/App/storage/index.js|storage/index.js]] · [[_code/mobile/App/components/register/subscribe.js|subscribe.js]] · [[_code/mobile/App/utils/subscriptionGate.js|subscriptionGate.js]] · [[_code/mobile/App/styles/theme.js|theme.js]] · [[_code/mobile/App/components/contacts/update.js|update.js]] · [[_code/mobile/App/components/company/view.js|view.js]] · [[_code/mobile/App/components/common/WhatsNewModal.js|WhatsNewModal.js]]

%% brain-links:end %%
