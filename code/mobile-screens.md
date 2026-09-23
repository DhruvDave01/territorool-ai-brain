# Mobile screens — name to file

Generated 2026-09-22 from the `lazy(() => import(...))` lines and `<Stack.Screen>` registrations in `TerriTool/App/App.js`. When this page and that file disagree, the file wins. Regenerate by reading `App/App.js` again; do not edit by hand from memory.

Paths are under `TerriTool/App/components/`. Every screen is registered on the one native stack in `App/App.js` with `headerShown: false`. "Footer" is the `CustomFooter` index the screen renders, or "none". "Still" is the folder under `screenshots/mobile-owner/` to open first; [flows/mobile.md](../flows/mobile.md) names the first clean frame in each.

## Home, activity, settings — folder `dashboard/`

| Screen name | File | Footer | Still | Notes |
|---|---|---|---|---|
| `Dashboard` | `dashboard/index.js` | none | Dashboard | Six tiles. `gestureEnabled: false`. The banner “Want 50 more credits?” opens `dashboard/ReviewRewardsModal.js` on this screen. It is not its own stack screen. Tiles push `MultipleAIWaypoint`, `BusinessCard`, `CreateCompany`, `Routes`, `Lists`, `ListCompany`; header pushes `EditStatus`, `QrCodeScanner`, `RecentActivity`, `CalendarActivity`. |
| `RecentActivity` | `dashboard/RecentActivityScreen.js` | none | ActivityCalendar | |
| `CalendarActivity` | `dashboard/CalendarActivityScreen.js` | none | ActivityCalendar | |
| `Notifications` | `dashboard/NotificationsScreen.js` | none | — | |
| `QrCodeScanner` | `dashboard/QrCodeScannerScreen.js` | none | Dashboard | |
| `EditStatus` | `dashboard/editstatus.js` | 6 | Setting | **This is the Settings screen.** Profile, credits, subscription, Tags / Edit Status, app update, version. Styles in `dashboard/editstatus.styles.js`. |

## Auth and subscription — folders `login/`, `register/`

| Screen name | File | Footer | Still | Notes |
|---|---|---|---|---|
| `Login` | `login/index.js` | none | LoginRegistrationFlow | `gestureEnabled: false` |
| `Register` | `register/index_register_split.js` | none | LoginRegistrationFlow | Questionnaire with the 6-segment bar. Not `CustomHeader`. |
| `SubscriptionScreen` | `register/subscribe.js` | none | LoginRegistrationFlow | RevenueCat paywall |
| `SubscriptionGate` | `register/SubscriptionGate.js` | none | LoginRegistrationFlow | Same paywall layout as `SubscriptionScreen`. `gestureEnabled: false`. |
| (not a stack screen) | `register/SettingsPlanPaywall.js` | — | Setting | "Manage your plan on the web" sheet opened from Settings |

## Find Leads — folder `findLeads/`

| Screen name | File | Footer | Still | Notes |
|---|---|---|---|---|
| `MultipleAIWaypoint` | `findLeads/aiFindLeads.js` | none | AIFindLeadsFlow | Footer index 2 opens it; it renders no footer of its own |
| `MultipleWaypoint` | `findLeads/index.js` | none | AIFindLeadsFlow | Older multi-waypoint search. `gestureEnabled: false`. |

## Address Book — folder `company/`

| Screen name | File | Footer | Still | Notes |
|---|---|---|---|---|
| `ListCompany` | `company/list.js` | 3 | AddressBookFlow | Address Book list. Copy this for any logged-in list. |
| `ViewCompany` | `company/view.js` | 3 | AddressBookFlow | Company detail |
| `CreateCompany` | `company/create/index.js` | none | AddCompany | |
| `EditCompany` | `company/edit.js` | none | AddressBookFlow | |
| `BusinessCard` | `company/businessCard/index.js` | none | ScanCardFlow | Card scan |
| `CustomCompany` | `customcompany/index.js` | none | ScanCardFlow | Custom company from a scanned card |

## Contacts — folders `contacts/`, `route/bizContact/`, `route/congContact/`

| Screen name | File | Footer | Still | Notes |
|---|---|---|---|---|
| `ContactsCreate` | `contacts/create.js` | none | AddressBookFlow | Manual add is free |
| `ContactsUpdate` | `contacts/update.js` | none | AddressBookFlow | |
| `ContactsView` | `contacts/view.js` | 3 | AddressBookFlow | Contact detail, notes, buy |
| `CongContact` | `route/congContact/index.js` | none | — | Cognism contact result |
| `bizCompanies` | `route/bizContact/bizCompanies.js` | none | — | Business path company pick |
| `bizContacts` | `route/bizContact/index.js` | none | — | Business path contacts, 1 credit |

## Routes — folders `route/`, `activeroutemap/`

| Screen name | File | Footer | Still | Notes |
|---|---|---|---|---|
| `Routes` | `route/index.js` | 4 | RouteFlow | Route library. Import name in `App.js` is `RouteList`. |
| `CreateRoute` | `route/create.js` | none | RouteFlow | |
| `SelectStartEndPoints` | `route/create/select-start-end-points.js` | none | RouteFlow | |
| `PublishRoute` | `route/create/publish-route.js` | none | RouteFlow | `gestureEnabled: false`. Done when `simplerouteview` returns `route_status === "published"`. |
| `EditRoute` | `route/edit.js` | none | RouteFlow | |
| `EditSelectStartEndPoints` | `route/edit/edit-select-start-end-points.js` | none | RouteFlow | |
| `EditPublishRoute` | `route/edit/edit-publish-route.js` | none | RouteFlow | `gestureEnabled: false` |
| `BasicRouteDetail` | `route/basic/index.js` | 4 | RouteFlow | Import name is `RouteDetail` |
| `CompanyView` | `route/basic/company-view.js` | 4 | RouteFlow | Company inside a route. Not `ViewCompany`. |
| `RouteSwipe` | `route/basic/goswipe.js` | none | RouteFlow | Stub. Not shipping chrome. |
| `ActiveRouteMap` | `activeroutemap/index.js` | none | RouteFlow | Map. `gestureEnabled` default. |
| `WaypointDetail` | `activeroutemap/waypointdetail.js` | none | RouteFlow | |
| `LassoMap` | `route/lassoMap.js` | none | RouteFlow | `gestureEnabled: false` |
| `FilterModule` | `filterModule/index.js` | none | RouteFlow / List | The live filter |
| `FilterRoute` | `route/filter.js` | none | — | Legacy teal. Do not copy. |

## Lists — folder `list/`

| Screen name | File | Footer | Still | Notes |
|---|---|---|---|---|
| `Lists` | `list/index.js` | 5 | List | List library |
| `CreateLists` | `list/create.js` | none | List | |
| `SelectStartEndPointsList` | `list/create/select-start-end-points.js` | none | List | `gestureEnabled: false` |
| `EditLists` | `list/edit.js` | none | List | |
| `ListsDetail` | `list/basic/index.js` | 5 | List | |
| `FilterList` | `list/filter.js` | none | — | Legacy teal. Do not copy. |

## Other

| Screen name | File | Footer | Still | Notes |
|---|---|---|---|---|
| `Error` | `error/index.js` | none | — | Import name is `ErrorScreen`. Address-correction and failure screen. |
| (not a stack screen) | `splash/AnimatedSplashScreen.js` | — | — | Splash only |
| (not a stack screen) | `common/AppCrashFallback.js` | — | — | Crash boundary |

## Footer indexes

| Index | Screen name |
|---|---|
| 1 | `Dashboard` |
| 2 | `MultipleAIWaypoint` |
| 3 | `ListCompany` |
| 4 | `Routes` |
| 5 | `Lists` |
| 6 | `EditStatus` |

Screens that render `<CustomFooter>` on the review date: `company/list.js`, `company/view.js`, `contacts/view.js`, `dashboard/editstatus.js`, `list/index.js`, `list/basic/index.js`, `route/index.js`, `route/basic/index.js`, `route/basic/company-view.js`.

## Loading test IDs

Every data screen marks its loader with `testID="screen.<screenKey>.loading"` and a letter suffix for a second loader (`loadingB`, `loadingC`). Empty states that exist as test IDs: `screen.companyList.loadingEmpty`, `screen.companyList.loadingEmptyContacts`, `screen.calendarActivity.monthEmpty`. Keep the pattern on a new screen.
