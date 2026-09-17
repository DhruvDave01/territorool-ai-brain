---
id: MOBILE_CODEBASE_BRAIN
parent: code
sources:
  - TerriTool/App/App.js
  - TerriTool/App/config/index.js
  - TerriTool/App/storage/realm.js
  - TerriTool/App/utils/contactBuyCredits.js
  - TerriTool/package.json
related:
  - code/mobile-code-details.md
  - brains/mobile-code.md
  - 10-mobile-app.md
  - 05-constraints-and-drift.md
  - 2026-09-17.md
---
# Mobile application — codebase brain

Live scan **2026-09-17** of `/Users/dhruvdave/Dhurv/Project_TerriTool/TerriTool`. Do not modify that repo from these notes. Chrome: [design/MINI-DESIGN-BRAIN.md](../design/MINI-DESIGN-BRAIN.md). File map: [mobile-code-details.md](mobile-code-details.md).

Status labels: **Confirmed** unless marked **Unknown** / **NMV**.

## 01. Documentation metadata

| Field | Value |
|-------|--------|
| Scan date | 2026-09-17 |
| RN / React | 0.84.1 / 19.2.3 |
| Node | `>= 22.11.0` |
| Marketing versions | `version_ios` 7.1.49, `version_android` 4.2.7 (`package.json`) |
| Stack screens | **46** |
| Realm | npm `^20.2.0`, `schemaVersion` **18** |

## 02. AI usage rules

Do not invent FormData keys, credits, or unregistered screens. Code wins. Distinguish Confirmed / Inferred / Unknown.

## 03. Executive overview

Class-component RN field-sales app. One native stack. Custom six-icon footer (not React Navigation tabs). Dashboard has **no** footer. State: class local + Realm JWT `"1"` + AsyncStorage. No Redux. No native-base package (`NativeBaseCompat.js`).

## 04. Technology stack

Confirmed: Navigation 7 native-stack, Realm, Maps, Sentry, RN Firebase, Notifee, RevenueCat, PostHog, Lottie, camera-kit. **Absent:** Redux, native-base npm, TikTok SDK file.

## 05. Repository structure

`index.js` → `init.js` → `App/App.js`. UI under `App/components/` (18 folders). `toast/` empty. `voiceAssistant.zip` is a zip file, not a folder. Config **only** `App/config/index.js` (no app `.env`).

## 06. Architecture

Single `createNativeStackNavigator`. `headerShown: false`. Footer is a `View`. API: `App/utils/API.js` multipart POST + Bearer.

## 07. Application startup

OS launch → native `#124ac6` window → JS `AnimatedSplashScreen` (`Image_splash.png` + Lottie, min ~3s) → JWT check → Login or RevenueCat identify → trial check → `SubscriptionGate` or Dashboard. **NMV:** Lottie overlay vs native-blue stills.

## 08–09. Flow and navigation

Footer 1–6: Dashboard, `MultipleAIWaypoint`, `ListCompany`, `Routes`, `Lists`, `EditStatus`. Map: [screens/navigation-map.md](../screens/navigation-map.md). `ClusterList` is **navigated** and **not registered**.

`gestureEnabled: false`: Login, SubscriptionGate, Dashboard, PublishRoute, EditPublishRoute, LassoMap, MultipleWaypoint, SelectStartEndPointsList.

## 10–12. Features and screens

46 `Stack.Screen` names (file order): Login, Register, SubscriptionScreen, SubscriptionGate, Dashboard, RecentActivity, CalendarActivity, Notifications, EditStatus, QrCodeScanner, Lists, CreateLists, EditLists, ListsDetail, RouteSwipe, Routes, CreateRoute, EditRoute, BasicRouteDetail, CreateCompany, BusinessCard, SelectStartEndPoints, EditSelectStartEndPoints, ViewCompany, ListCompany, EditCompany, PublishRoute, EditPublishRoute, ContactsCreate, ContactsUpdate, ContactsView, CompanyView, CustomCompany, ActiveRouteMap, WaypointDetail, LassoMap, Error, MultipleWaypoint, MultipleAIWaypoint, CongContact, bizCompanies, bizContacts, FilterList, FilterRoute, FilterModule, SelectStartEndPointsList.

**Registered, no `navigate()`:** Notifications, RouteSwipe, FilterList, FilterRoute. Live Address Book filter is imported `FilterModule` (stack entry unused). Inventory chrome: [design/02-User-Interface/Screen-Inventory.md](../design/02-User-Interface/Screen-Inventory.md).

## 13. User flows

Vault: [design/04-User-Flows/README.md](../design/04-User-Flows/README.md). Stills: [design/06-Coverage/Mobile-Screenshot-Flow.md](../design/06-Coverage/Mobile-Screenshot-Flow.md) (pixels win over filenames).

## 14. Components

`CustomHeader`, `CustomFooter`, `AppButton`, `AppConfirmModal`, `FilterModule` (inline), `ShareEmailField`. See design Components.

## 15. State management

Class `this.state`. `App/utils/Global.js`. Realm for JWT / offline route / AI find leads / FCM realm v1. **No Redux.**

## 16. Data models

Realm: `JWTToken`, `offlineRoute`, `TourSchema`, `AIFindLeads`. JWT fields: `id`, `value`, `name`, `notifi_count`, `user_id`, `email`, `country`, `domain`, `env`, `role`, `is_register`, `is_production`. Server tables: [data/database-columns.md](../data/database-columns.md).

## 17. API and networking

`URL_BASE` **live 2026-09-17 = staging** `https://staging.territool.com/index.php/api/`. Prod commented. Catalog: [12-mobile-api.md](../12-mobile-api.md). Keys: [data/formdata-dictionary.md](../data/formdata-dictionary.md).

Sample Confirmed append keys:

- Login: `email`, `password`, `device_token`, `device_type`
- Add company: `title`, `address`, `city_id`, `postal_code`, `website`, `annual_revenue`, `phone_number`, `linkedin_url`, `rating`, `latitude`, `longitude`, `place_id`, `number`, `company_status_id`, `user_latitude`, `user_longitude`, `note`, `contact_list`, `opening_hours`, `type` (+ optional `city_title`/`city_code`/`city_country`, `uc_category_id`)
- Create route (`createroute`): `route_name`, `company_id_csv`, `resume_page`=`simpleroute/step1`, `routetype`, `filter_with` (+ lat/lng if start id 0)

Publish is **not done** until `simplerouteview` → `route_status === "published"`.

## 18. Authentication

Login POST → store JWT row `"1"`. 401/403 → session expired modal → Login. **No refresh token.** Forgot password opens **web** `{API host}/password/reset`. Register: `PostSignupPaywallFlow` `TOTAL_STEPS = 6`. `SubscriptionGate` exists.

## 19. Storage

Realm main `schemaVersion` 18. FCM realm version 1. AsyncStorage for some flags (nav state key `@TerriTool_nav_state` saved but restore clears `initialState`).

## 20–21. Forms and design system

Theme `App/styles/theme.js`. Curved body `screenCurvedBody.js`. Do not average teals or the two danger reds. MINI: [design/MINI-DESIGN-BRAIN.md](../design/MINI-DESIGN-BRAIN.md).

## 22–25. Permissions, notifications, background, lifecycle

Location for Find Leads/maps; camera/photos for Scan Card and QR. FCM helper logs opens; does **not** route to `Notifications`. App lifecycle: Appearance may tint map polylines (NMV).

## 26–28. Errors, analytics, security

Sentry `captureSentryError`. PostHog keys **names** in config (never paste values into notes). JWT in Realm not Keychain-only — Confirmed storage choice.

## 29–30. Native Android / iOS

minSdk 24, target 36, Java 17. iOS 15.5+. Flavor is comment-swap `URL_BASE`, not `.env`.

## 31. Environment

No app `.env`. Tooling example names under `.cursor/credentials/mcp-secrets.env.example` (ASC, Google SA, Maestro, Gmail) — **names only**.

## 32. Third-party

Maps, Mapbox directions, RevenueCat, Firebase, Sentry, PostHog, FullEnrich/Apollo/Cognism/OpenCorporates/Claude via **API URL constants** (server does the fetch).

## 33. Testing

`yarn lint`. Maestro/e2e env names `E2E_EMAIL` / `E2E_PASSWORD` (do not store values here).

## 34–42. Maps (function, feature, data lifecycle, conditionals, events, traceability, file index, constants)

See [code/mobile-code-details.md](mobile-code-details.md), [screens/how-it-works.md](../screens/how-it-works.md), [12-mobile-api.md](../12-mobile-api.md). Credits constants: `CONTACT_BUY_CREDITS_*` = 2 / 2 / 1. AI search has **no** numeric cost in mobile (server/product: free). Save-lead cost is **server** 1 credit — not a mobile constant.

## 43–46. Edge cases, TODOs, dead code, unknown

| Item | Status |
|------|--------|
| `ClusterList` navigate without stack screen | Broken |
| Notifications / RouteSwipe / FilterList / FilterRoute | Registered, no navigate |
| `COLOR_PRIMARY` import in bizContact styles | Config does not export it — **NMV** runtime |
| Splash Lottie vs solid blue still | **NMV** |
| `createOFFLINERoute` | No call sites; list still reads blob |

## 47. Unknown / ambiguous

Find MCP vs User MCP `save_ai_leads` preview (Find has no token). Distinct `SubscriptionGate` chrome vs subscribe paywall stills. Store IAP vs web-billed Settings.

## 48. Glossary

Address Book = `ListCompany`. Settings = `EditStatus`. AI Find Leads = `MultipleAIWaypoint`. Places Find Leads = `MultipleWaypoint`. Companyl (web) is not a mobile class.

## 49. Summary

46 screens, staging `URL_BASE` as of this scan, no Redux, JWT no refresh, credits 2/1/1-save on server, FilterModule live vs dead stack filters.
