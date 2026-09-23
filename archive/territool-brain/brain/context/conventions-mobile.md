---
area: context
tags: [brain/context]
ref: "Mobile app coding rules"
---

# Territool — Mobile Conventions (platform adapter: React Native)

Applies to `repos/mobile` (React Native 0.84.1, JavaScript). **New and changed code only** (S0.2).

Shared rules in `conventions-shared.md` always apply first. Source of every rule: `brain/audits/01-mobile.md` (approved §11) unless noted.

## 1. Who uses mobile

Sales Agent and Business Sales Agent only. Admin and Business Agent are web-only (USER SAID, A1 §11). The only role branch in code today is `"Business Sales Agent"` (`dashboard/index.js:258, 285`; `customfooter/index.js:177`; `editstatus.js:1810, 2232, 2510`).

## 2. Canonical example to copy

**Activity screen:** `App/components/dashboard/RecentActivityScreen.js` + `recentActivityData.js`:
- function component, `useFocusEffect` load (`:250-258`)
- `FormData` + `API.post(ENDPOINT_CONSTANT, formData, { navigation })` (`:188-194`, `:215-221`)
- success test `data?.status == 1` (`:223`)
- mapper with JSDoc typedef (`recentActivityData.js:13-16`)
- `captureSentryError` + `.finally` reset (`:207-213`)
- loading / refreshing / empty states + semantic testIDs (`:343-373`)

**Don't copy from it:** inline style objects and raw `#000` shadows (`:63-71`, `:112-133`), commented-out JSX (`:328-341`), magic spacing (`:42-45`).

There is **no hook/service layer**. The real chain is screen → FormData → `API.js` → endpoint constant → mapper → render (A1 §2).

## 3. Rules M1–M19 (approved)

| # | Rule | Check |
|---|---|---|
| M1 | New screens/components are **function components with hooks**; never add a class component; edit class screens in place without converting | new file has no `extends Component` (static-checks `M1`) |
| M2 | All network calls via **`App/utils/API.js`**; endpoint paths are exported constants in **`App/config/index.js`**; no raw `fetch(` in `App/components/` | static-checks `M2` |
| M3 | Requests are `FormData`; pass `{ navigation }` as the 3rd argument; success **only** when `data?.status == 1`, else show `data.message` and set the empty/error state | review against canonical example |
| M4 | Every API promise has `.catch` (or try/catch) calling `captureSentryError(error, "<screen>", "<action>")` **and** resets every loading/pressed flag (`.finally`) | review; each `API.` call in diff |
| M5 | **Never call `logout()` from an error handler**; session expiry is handled in `API.js` (401/403) | static-checks `M5` (warn) + review |
| M6 | No empty `catch {}` in `App/components/` (utils telemetry only) | static-checks `M6` |
| M7 | Data screens render **initial loading, refreshing, empty, error**; no endless spinner | review + E2E offline case |
| M8 | **No hardcoded design values** in new lines: colours, font sizes/families, spacing, radii, shadows come from tokens (`App/styles/tokens.js`, approved set in `design-system.md`; legacy `theme` allowed only where the approved token doesn't exist yet) | static-checks `M8-color`, `M8-fontsize` |
| M9 | Styles in co-located `<File>.styles.js` with `StyleSheet.create`; `style={{…}}` only for render-time values | ESLint `react-native/no-inline-styles` on added lines; static-checks `M9` (warn) |
| M10 | **Search before you create** (inventory §4); change summary lists what was searched | review |
| M11 | Fork families (§5): the same fix in every copy, or extract to a shared module | review with §5 |
| M12 | Semantic testIDs `screen.<screenKey>.<element>` / `component.<key>.<element>` on screen roots and interactive elements; add new files to `FILE_RULES` in `scripts/lib/semanticTestIdPolicy.js`; **no order-based auto IDs** (`…Dup7`) in new code | `node scripts/audit-missing-testids.js` for changed files |
| M13 | Register screens in `App/App.js` as PascalCase `Stack.Screen`, lazy-loaded; function screens take `{ navigation }` + `useRoute()`; params read with defaults | review |
| M14 | **Don't add fields to `App/utils/Global.js`**; shared state via route params or a module store with get/set/subscribe that returns an unsubscribe (e.g. `utils/bulkContactSession.js`) | static-checks `M14` |
| M15 | Ignore stale responses for overlapping requests (search, stepper, re-focus): `AbortController` `signal` to `API.post/get` or a request id | review |
| M16 | Telemetry never includes `FormData`/bodies/passwords/tokens; use `formDataToObject()` redaction | static-checks `M16` |
| M17 | No secrets, credentials, test accounts or staff emails in source | static-checks `M17` |
| M18 | Import only declared deps; no second library for a covered job (dropdown: `customPackage/react-native-select-dropdown`; modal: `react-native-modal`/`AppConfirmModal`; toast: `react-native-toast-message`; distance: `geolib`; dates: `moment` per D1). New deps need owner approval | review of `package.json` diff |
| M19 | Changed files add **no ESLint errors**; `no-undef`, `no-dupe-class-members`, `no-dupe-keys`, `react-hooks/exhaustive-deps` are blocking | static-checks runs ESLint on added lines |

**Approved decisions** (A1 §11):
- **D1:** use `moment` and declare it in `package.json` when a task first needs it.
- **D2:** from `utils/NativeBaseCompat.js` only the layout `Container` is allowed in new code.
- **D3:** `Pressable` for rows/icons; `AppButton` for CTAs.
- **D4:** new component files `PascalCase.js` + `PascalCase.styles.js`; utils `camelCase.js`.
- **D5:** new/changed code only.

## 4. Reuse inventory ("search before you create")

| Need | Use | Path |
|---|---|---|
| Confirm / destructive dialog | `AppConfirmModal` | `components/common/AppConfirmModal.js` |
| Buttons | `AppButton` (variants primary, danger, neutral, dark, ghost; new code uses approved 5-variant rules in `design-system.md`) | `components/common/AppButton.js` |
| Header / add button / add menu / icon button | `CustomHeader`, `HeaderAddButton`, `HeaderAddMenu`, `HeaderIconButton` | `components/customheader/` |
| Bottom navigation | `CustomFooter` | `components/customfooter/index.js` |
| Share by email | `ShareEmailField`, `ShareEmailError` | `components/common/` |
| Report contact / company | `ReportContactModal`, `ReportContactInfoModal`, `utils/reportCompany.js`, `utils/reportContact.js` | |
| Crash / what's new / tour / scroll hint / search glyph | `AppCrashFallback`, `WhatsNewModal`, `SpotlightTourModal`, `ScrollHintArrow` (don't overlap content), `SearchGlyph` | `components/common/` |
| Route publishing loader, waypoint pin | `RoutePublishingLoader`, `RouteWaypointPinIcon` | `components/route/common/`, `route/shared/` |
| Activity date/time field, map chooser, find-contacts progress | `ActivityDateTimePickerField`, `MapChooserPopup`, `FindContactsFetchModal` | `components/customcompany/` |
| Navigate to company / route detail | `navigateToViewCompanyById`, `navigateToRouteDetail` | `utils/` |
| Permissions / location / media | `permissionPrompts`, `permissionSettingsAlert`, `locationAccess`, `mediaPermissionAccess` | `utils/` |
| Connectivity / retry | `ConnectivityHelper`; `API.post(url, fd, props, signal, { maxAttempts })` | `utils/ConnectivityHelper.js`, `API.js:140-211` |
| Error reporting | `captureSentryError(error, screen, action, context, level)` | `utils/SentryHelper.js:34` |
| Subscription gating | `fetchFreeTrialStatus`, `shouldRedirectToSubscriptionGate` | `utils/subscriptionGate.js` |
| Credits for contact buys | `contactBuyCredits` | `utils/contactBuyCredits.js` (F15 BLOCKER, 11 screens) |
| Activity payload helpers | `companyActivityPayload` | `utils/companyActivityPayload.js` |
| Curved screen body, platform text | `screenCurvedBodyStyles`, `makeTypography` | `styles/screenCurvedBody.js`, `styles/platformText.js` |
| Async feedback | `Toast.show` (`react-native-toast-message`, top) | mounted `App/App.js:400`; `utils/API.js:153` |
| Company filters | `FilterModule` inline modal (`FILTER_CONTROL_HEIGHT` 48 iOS / 42 Android) | `components/filterModule/` |
| Company workspace | `CustomCompany` embedded with `parent_screen`: `ViewCompany` → Add To; `CompanyView` / `ClusterCompany` → Mark/Unmark + Mark Visited | `customcompany/index.js:4816-4835` |
| As-shipped UI reference | Screen inventory, states, forms, flows, screenshot index (Design-Brain copy) | `brain/assets/brand/**` (read with `brain/audits/08-design-brain-review.md`) |

## 5. Fork families (fix all copies)

| Family | Files | Source |
|---|---|---|
| Lists ↔ Routes | `components/list/{create,edit,filter}.js`, `list/create/select-start-end-points.js` ↔ `components/route/{create,edit,filter}.js`, `route/create/select-start-end-points.js`, `route/edit/edit-select-start-end-points.js` | A1 §3.1 |
| Find Leads ↔ AI Find Leads ↔ Lasso | `findLeads/index.js` ↔ `findLeads/aiFindLeads.js` ↔ `route/lassoMap.js` (+ `company/businessCard/index.js` city autocomplete) | A1 §3.1 |
| Company views | `company/view.js` ↔ `route/basic/company-view.js` | A1 §3.1 |
| Contacts | `contacts/create.js` ↔ `contacts/update.js` | A1 §3.1 |
| Contact enrichment | `route/congContact/` ↔ `route/bizContact/` | July audit (A1 §7) |
| Legal links | `EULALink`/`PPLink` in `login/index.js`, `register/index_register_split.js`, `register/SettingsPlanPaywall.js`, `register/subscribe.js` | A1 §3.1 |

## 6. Traps (read before editing)

| Trap | Detail | Source |
|---|---|---|
| API errors | `API.js` ignores HTTP status, reads body `status_code`; 422 passes through as JSON; 400/404/500 already toast, so don't double-toast | `API.js:269-303` |
| Session | 401/403 → `logout()` → `SESSION_EXPIRED_EVENT` modal. Never call `logout()` yourself (M5) | `Globalfunction.js`; `App.js:171-199` |
| `Global.js` | Mutable static state seeded once; `setAdvancedRouteCurrentCompany` guard is inverted (dead write) | `Global.js:76-93` |
| Realm | Schema change needs a version bump + migration; init failure **deletes the DB** (logs the user out) | `realm.js:417-459` |
| Nav state | Persisted to AsyncStorage but never restored; don't rely on it | `App.js:112, 215-217, 277` |
| Unhandled rejections | Routed to the full-screen crash UI; missing `.catch` = "crash" | `utils/crashRecovery.js:253-290` |
| System font | Dashboard tiles/activity rows, referral modal, calendar rows and QR scanner render SF Pro; don't copy | A4 §1.2 M-3 |
| Auto testIDs | Order-based IDs (`pressTouchableOpacityDup7`) are brittle; Maestro flows depend on some | A5 §1 |
| Screens without testIDs | `BusinessCard`, `WaypointDetail`, `QrCodeScanner`, `Error`, `RouteSwipe` | A5 §1 |
| Dead / known broken | `dashboard/AppCue/Archive/` dead (USER SAID); `FilterList`/`FilterRoute`/`Notifications`/`RouteSwipe` unreachable; `ClusterList` navigated but not registered; offline route cache half-removed (BT-11) | A1 §5; Design-Brain `Screen-Inventory.md` |
| Config | `App/config/index.js` points at staging; production URL commented. **Never switch it to production** | S0.1 |
| `COLOR_PRIMARY` | `route/bizContact/bizContactScreens.styles.js` imports `COLOR_PRIMARY`, which config no longer exports (undefined colours). Don't copy the pattern; use tokens | KG-UI6 |
| Design-Brain docs | Right on shell/components/flows. **Wrong** on the Confirm Leads colour (it's primary) and the Find Leads chip (it's `#44AADA`); out of date on screen count (49). Its "don't normalize" rule is superseded by approved tokens for new code | `brain/audits/08-design-brain-review.md` §4 |

## 7. Commands

| Purpose | Command (run from `territool-brain/`) |
|---|---|
| Static gate on current changes | `node brain/gates/scripts/static-checks.js --repo mobile` |
| ESLint specific files | `cd repos/mobile && node_modules/.bin/eslint <files>` |
| Missing testIDs audit | `cd repos/mobile && node scripts/audit-missing-testids.js` |
| Screenshot the booted/second simulator | `xcrun simctl io <UDID> screenshot <out.png>` |
| Maestro (after install) | `maestro --device <UDID> test -e LOGIN_EMAIL=… -e LOGIN_PASSWORD=… <flow.yaml>` (credentials from `.local`, never echoed) |
| Regenerate import graph | `node brain/audits/data/rngraph.js repos/mobile brain/audits/data/mobile-graph.json` |

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (83)

**Documents (13):** [[brain/audits/01-mobile|Audit 1 – mobile app review]] · [[brain/audits/04-design|Audit 4 – design review]] · [[brain/audits/05-testing|Audit 5 – testing plan]] · [[_code/brain/brain/gates/scripts/static-checks.js|Automatic code checker]] · [[brain/README|brain/ - GENERATED OUTPUT. Do not hand-edit during build.]] · [[CLAUDE-CODE-BOOTSTRAP|Claude Code Bootstrap Prompt]] · [[brain/context/design-system|Design system (colours, fonts, spacing)]] · [[brain/context/known-fragile|Known problems & risky areas]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/audits/08-design-brain-review|Review of the old Design-Brain]] · [[brain/context/conventions-shared|Rules for all code]] · [[brain/assets/brand/ui-notes/Screen-Inventory|Screen inventory]] · [[brain/skills/territool-code/SKILL|Skill – writing code]]

**Product feature (1):** [[_id/F15|Find & buy contacts]]

**Coding rules (26):** [[_id/S0.2|Change new code only]] · [[_id/M14|Don't grow the Global file]] · [[_id/M4|Every network call reports errors]] · [[_id/D4|File naming]] · [[_id/M11|Fix every copy of duplicated code]] · [[_id/M15|Ignore outdated responses]] · [[_id/M7|Loading, empty & error states]] · [[_id/M12|Meaningful test IDs]] · [[_id/M2|Network calls only through API.js]] · [[_id/M5|Never log users out on errors]] · [[_id/S0.1|Never touch the live app]] · [[_id/D5|New code only]] · [[_id/M1|New screens as function components]] · [[_id/M8|No hard-coded colours or sizes]] · [[_id/M19|No new code-check errors]] · [[_id/M18|No new libraries without approval]] · [[_id/M16|No secrets in analytics]] · [[_id/M17|No secrets in the code]] · [[_id/M6|No silent error catching]] · [[_id/D2|Only Container from NativeBase]] · [[_id/D3|Pressable for rows, AppButton for buttons]] · [[_id/M13|Register screens properly]] · [[_id/M10|Search before creating]] · [[_id/M9|Styles in separate files]] · [[_id/M3|Success only when status is 1]] · [[_id/D1|Use moment for dates]]

**Owner decision (1):** [[_id/BT-11|Offline mode dropped]]

**Problem found (1):** [[_id/KG-UI6|Missing colour on Find Contacts screens]]

**Code files (41):** [[_code/mobile/App/components/findLeads/aiFindLeads.js|aiFindLeads.js]] · [[_code/mobile/App/utils/API.js|API.js]] · [[_code/mobile/App/components/common/AppButton.js|AppButton.js]] · [[_code/mobile/App/components/common/AppConfirmModal.js|AppConfirmModal.js]] · [[_code/mobile/App/components/route/bizContact/bizContactScreens.styles.js|bizContactScreens.styles.js]] · [[_code/mobile/App/utils/bulkContactSession.js|bulkContactSession.js]] · [[_code/mobile/App/components/company/businessCard/index.js|businessCard/index.js]] · [[_code/mobile/App/components/route/basic/company-view.js|company-view.js]] · [[_code/mobile/App/utils/companyActivityPayload.js|companyActivityPayload.js]] · [[_code/mobile/App/config/index.js|config/index.js]] · [[_code/mobile/App/utils/ConnectivityHelper.js|ConnectivityHelper.js]] · [[_code/mobile/App/utils/contactBuyCredits.js|contactBuyCredits.js]] · [[_code/mobile/App/utils/crashRecovery.js|crashRecovery.js]] · [[_code/mobile/App/components/contacts/create.js|create.js]] · [[_code/mobile/App/components/customcompany/index.js|customcompany/index.js]] · [[_code/mobile/App/components/customfooter/index.js|customfooter/index.js]] · [[_code/mobile/App/components/dashboard/index.js|dashboard/index.js]] · [[_code/mobile/App/components/route/edit/edit-select-start-end-points.js|edit-select-start-end-points.js]] · [[_code/mobile/App/components/dashboard/editstatus.js|editstatus.js]] · [[_code/mobile/App/components/findLeads/index.js|findLeads/index.js]] · [[_code/mobile/App/utils/Global.js|Global.js]] · [[_code/mobile/App/utils/Globalfunction.js|Globalfunction.js]] · [[_code/mobile/App/components/register/index_register_split.js|index_register_split.js]] · [[_code/mobile/App/components/route/lassoMap.js|lassoMap.js]] · [[_code/mobile/App/components/login/index.js|login/index.js]] · [[_code/mobile/App/utils/NativeBaseCompat.js|NativeBaseCompat.js]] · [[_code/mobile/App/styles/platformText.js|platformText.js]] · [[_code/mobile/App/storage/realm.js|realm.js]] · [[_code/mobile/App/components/dashboard/recentActivityData.js|recentActivityData.js]] · [[_code/mobile/App/components/dashboard/RecentActivityScreen.js|RecentActivityScreen.js]] · [[_code/mobile/App/utils/reportCompany.js|reportCompany.js]] · [[_code/mobile/App/utils/reportContact.js|reportContact.js]] · [[_code/mobile/App/styles/screenCurvedBody.js|screenCurvedBody.js]] · [[_code/mobile/App/components/list/create/select-start-end-points.js|select-start-end-points.js]] · [[_code/mobile/App/components/route/create/select-start-end-points.js|select-start-end-points.js]] · [[_code/mobile/App/utils/SentryHelper.js|SentryHelper.js]] · [[_code/mobile/App/components/register/SettingsPlanPaywall.js|SettingsPlanPaywall.js]] · [[_code/mobile/App/components/register/subscribe.js|subscribe.js]] · [[_code/mobile/App/utils/subscriptionGate.js|subscriptionGate.js]] · [[_code/mobile/App/components/contacts/update.js|update.js]] · [[_code/mobile/App/components/company/view.js|view.js]]

%% brain-links:end %%
