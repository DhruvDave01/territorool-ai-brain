# 1. Mobile Code Brain

Hub for the React Native app. Sibling: [Mobile UI Brain](mobile-ui.md) · [API Brain](api.md). Parent: [sub brains](README.md).

**Repo:** `TerriTool/` — entry `index.js` → `init.js` → `App/App.js`.  
Code wins. Do not cite the workspace folder.

## Read first

1. This file.
2. [code/mobile-code-details.md](../code/mobile-code-details.md) — full file map.
3. The screen under `App/components/`.
4. New payload → [API Brain](api.md) + [formdata-dictionary](../data/formdata-dictionary.md).
5. Chrome/tokens → [Mobile UI Brain](mobile-ui.md).
6. Lifecycle (publish, AI V2, login) → [screens/how-it-works.md](../screens/how-it-works.md).

## Must follow

| Rule | Do this |
|------|---------|
| Screens | Almost all **class** `Component` / `PureComponent` / `ValidationComponent`. Do not casually convert to hooks. |
| Hook exceptions (OK as-is) | `RecentActivityScreen.js`, `CalendarActivityScreen.js`, `NotificationsScreen.js`, `QrCodeScannerScreen.js`, `splash/AnimatedSplashScreen.js`. `App.js` itself is `Sentry.wrap(function App()`. Header/footer export a function wrapper around `*Core` for insets. |
| Nav | One `createNativeStackNavigator`. `headerShown: false`. **No** nested navigators / tabs / drawer. Register every screen in `App/App.js`. |
| Footer | `App/components/customfooter/index.js` — fake tabs, indexes **1–6** (no 0). **Dashboard does not render CustomFooter.** `aiFindLeads.js` also has no footer. |
| State | Class local + `App/utils/Global.js`. **No Redux.** |
| NativeBase | **Gone.** `App/utils/NativeBaseCompat.js`. |
| API | `API.post(url, formdata, props, signal, options)` in `App/utils/API.js`. Multipart FormData. JWT header. 401/403 → session logout. |
| Config | **Only** `App/config/index.js`. Active `URL_BASE` is **prod** `https://app.territool.com/index.php/api/`. Staging is the commented block `https://staging.territool.com/index.php/api/`. `IS_STAGING_OR_DEV_BUILD` = `URL_BASE` contains `"staging"`. `APP_VERSION` `'2.0'`. |
| Persist | `App/storage/realm.js` `schemaVersion: 18`. JWT schema pk **`id`**, runtime row `"1"`. |
| Errors | `captureSentryError(screen, action)`. |
| Routes | `createroute` is not done until `simplerouteview` → `route_status === "published"` (`route/create/publish-route.js`). |
| testIDs | `screen.*`, `footer.*`, `modal.*`. |
| Maps | Polylines via **Mapbox** (`googleDirections.js`). Provider: `mapProvider.js`. |

`gestureEnabled: false` on: Login, SubscriptionGate, Dashboard, PublishRoute, EditPublishRoute, LassoMap, MultipleWaypoint, SelectStartEndPointsList.

## 46 registered screens (`App/App.js`)

Login, Register, SubscriptionScreen, SubscriptionGate, Dashboard, RecentActivity, CalendarActivity, Notifications, EditStatus, QrCodeScanner, Lists, CreateLists, EditLists, ListsDetail, RouteSwipe, Routes, CreateRoute, EditRoute, BasicRouteDetail, CreateCompany, BusinessCard, SelectStartEndPoints, EditSelectStartEndPoints, ViewCompany, ListCompany, EditCompany, PublishRoute, EditPublishRoute, ContactsCreate, ContactsUpdate, ContactsView, CompanyView, CustomCompany, ActiveRouteMap, WaypointDetail, LassoMap, Error, MultipleWaypoint, MultipleAIWaypoint, CongContact, bizCompanies, bizContacts, FilterList, FilterRoute, FilterModule, SelectStartEndPointsList.

Design pack still says 47 — **code wins (46)**. [05-constraints-and-drift.md](../05-constraints-and-drift.md).

## `App/components/` folders

`activeroutemap`, `common`, `company`, `contacts`, `customcompany`, `customfooter`, `customheader`, `dashboard`, `error`, `filterModule`, `findLeads`, `list`, `login`, `register`, `route`, `splash`, `toast`.

| Task | Open |
|------|------|
| Register a screen | `App/App.js` |
| API constant | `App/config/index.js` then `App/utils/API.js` |
| Shared company sheet | `App/components/customcompany/index.js` |
| Address Book | `company/list.js` |
| AI Find Leads V2 | `findLeads/aiFindLeads.js` |
| Classic map Find Leads | `findLeads/index.js` |
| Publish poll | `route/create/publish-route.js` |
| Driving | `activeroutemap/index.js` |
| Card scan | `company/businessCard/index.js` |
| Shared chrome | `customheader/index.js`, `customfooter/index.js`, `common/AppButton.js`, `common/AppConfirmModal.js` |
| Theme | `App/styles/theme.js` + `App/styles/screenCurvedBody.js` + co-located `*.styles.js` |

## Footer index → screen

| i | Tab | Screen | Icon constant → file |
|----|-----|--------|----------------------|
| 1 | Home | `Dashboard` | `ICON_HOME` → `images/icon_home.png` |
| 2 | Find leads | `MultipleAIWaypoint` | `ICON_FINDLEADS` → `images/Find_Leads.png` |
| 3 | Company | `ListCompany` | `ICON_COMPANY` → `images/icon_company.png` |
| 4 | Routes | `Routes` | `ICON_ROUTES` → `images/icon_routes.png` |
| 5 | Lists | `Lists` | `ICON_LISTS` → `images/Supply3.png` (**not** `icon_lists.png`) |
| 6 | Settings | `EditStatus` | `ICON_SETTING` → `images/setting.png` |

`ICON_HOME_ACTIVE` is imported and unused for the active home icon.

## Stack (live `package.json`)

RN **0.84.1**, React **19.2.3**, Navigation 7.x, Realm **20.2.0**. Android `applicationId` `com.picwa.territoolapp`. iOS deployment 15.5. Full table: [10-mobile-app.md](../10-mobile-app.md).

## Trained if you can

- Add a screen without nested navigators or Redux.
- Post with FormData + JWT and a dictionary key.
- Poll publish until `published`.
- Leave Dashboard without a footer.
