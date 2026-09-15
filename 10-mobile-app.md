---
id: 10-mobile-app
parent: core
sources:
  - App/App.js
  - register/index_register_split.js
  - register/subscribe.js
  - route/basic/goswipe.js
  - route/basic/company-view.js
  - customcompany/index.js
  - findLeads/index.js
  - findLeads/aiFindLeads.js
related:
  - 02-commands.md
  - 04-style-guide.md
  - appendix-c-footer-tabs.md
  - 05-constraints-and-drift.md
---
# 10. Mobile app

Related: [02-commands](02-commands.md) · [04-style-guide](04-style-guide.md) · [appendix-c-footer-tabs](appendix-c-footer-tabs.md)

## Stack (live `package.json`)

React Native **0.84.1**, React **19.2.3**, Navigation 7.x, Realm **20.2.0**, Maps 1.27.2, Sentry 8.5.0, RN Firebase 24, Notifee, RevenueCat 9.12, PostHog, fbsdk-next, dayjs, geolib, Lottie 7.2.2, camera-kit, calendars, gesture-handler, screens, safe-area.

**Not present:** Redux, native-base package, TikTok npm package.

## Entry and nav

| File | Role |
|------|------|
| `index.js` | Register `TerriTool` |
| `init.js` | SDKs before UI |
| `App/App.js` | `Sentry.wrap`, splash, session-expired modal, stack |
| `CustomFooter` | Fake tabs |

**Footer index → screen:** 1 Dashboard, 2 `MultipleAIWaypoint`, 3 `ListCompany`, 4 `Routes`, 5 `Lists`, 6 `EditStatus` (settings). Dashboard itself is a tile grid (no footer).

**`gestureEnabled: false`:** Login, SubscriptionGate, Dashboard, PublishRoute, EditPublishRoute, LassoMap, MultipleWaypoint, SelectStartEndPointsList.

Nav state key `@TerriTool_nav_state` is **not** restored as `initialState` (intentional).

## Registered screens (`App/App.js`)

**Count:** 46 `Stack.Screen` entries. Design Brain still says 47 — [drift](05-constraints-and-drift.md).

| Name | Import |
|------|--------|
| Login | `components/login/` |
| Register | `register/index_register_split.js` |
| SubscriptionScreen | `register/subscribe.js` |
| SubscriptionGate | `register/SubscriptionGate` |
| Dashboard | `dashboard/` |
| RecentActivity | `dashboard/RecentActivityScreen` |
| CalendarActivity | `dashboard/CalendarActivityScreen` |
| Notifications | `dashboard/NotificationsScreen` |
| EditStatus | `dashboard/editstatus` |
| QrCodeScanner | `dashboard/QrCodeScannerScreen` |
| Lists, CreateLists, EditLists, ListsDetail | `list/*` |
| Routes, CreateRoute, EditRoute, BasicRouteDetail, RouteSwipe | `route/*`, `route/basic/goswipe.js` |
| SelectStartEndPoints, EditSelectStartEndPoints | `route/create\|edit/*` |
| PublishRoute, EditPublishRoute | `*-publish-route.js` |
| CreateCompany, BusinessCard, ViewCompany, ListCompany, EditCompany | `company/*` |
| ContactsCreate, ContactsUpdate, ContactsView | `contacts/*` |
| CompanyView | `route/basic/company-view.js` |
| CustomCompany | `customcompany/index.js` |
| ActiveRouteMap, WaypointDetail | `activeroutemap/*` |
| LassoMap | `route/lassoMap` |
| Error | `error/index` |
| MultipleWaypoint | `findLeads/index.js` |
| MultipleAIWaypoint | `findLeads/aiFindLeads.js` |
| CongContact | `route/congContact` |
| bizCompanies, bizContacts | `route/bizContact/*` |
| FilterList, FilterRoute, FilterModule | list/route/filterModule |
| SelectStartEndPointsList | `list/create/select-start-end-points.js` |

## State

| Layer | What |
|------|------|
| Component `this.state` | Screen data |
| `App/utils/Global.js` | `_advancedRoute`, `_contacts`, `_companies`, `_currentCompany`, `_basicRouteCompanies`, lasso filters, industry types, contact-migration events |
| Realm v18 | JWTToken, offlineRoute, TourSchema, AIFindLeads |
| FCM Realm v1 | FCMNotication (`notification_title`, `notification_desc`) |
| AsyncStorage | nav, onboarding, web-register review |

**JWTToken fields:** `id`, `value`, `name`, `notifi_count`, `user_id`, `email`, `country`, `domain`, `env`, `role`, `is_register`, `is_production`.

## API client (`App/utils/API.js`)

| Method | Use |
|-------|-----|
| `post` | `URL_BASE + url`, multipart, Bearer |
| `get` | Same headers |
| `get_third_party` | Absolute URL, no Bearer by default |
| 401/403 | `handleSessionExpired` → logout → modal |
| 400/404/500 | Toast + `handledApiError` |
| Network | `ConnectivityHelper` (default maxAttempts **1**) |

## Key files

| File | Why |
|------|------|
| `App/config/index.js` | All endpoint strings + keys |
| `App/utils/API.js` | HTTP |
| `App/storage/realm.js` | Local DB |
| `App/utils/Global.js` | Cross-screen |
| `App/utils/RevenueCatService.js` | IAP |
| `App/utils/geminiBusinessCard.js` | Card scan |
| `App/utils/contactBuyCredits.js` | 2 vs 1 credit |
| `App/utils/subscriptionGate.js` | Paywall |
| `App/components/customcompany/index.js` | Company sheet |
| `App/components/findLeads/aiFindLeads.js` | AI V2 UI |
| `App/components/findLeads/index.js` | Classic map leads (very large) |

## Docs to read next

`README.md`, `docs/API_REFERENCE.md`, `docs/web-services/01`–`09`, `docs/MOBILE_USER_FLOWS.md`, `docs/NAVIGATION_FULL_FLOW.md`, `docs/MCP_USER_COMMANDS.md`, `docs/VOICE_*`, `MCPFLOW/*.md`, `Prompts/TerriTool_OverView.md`.
