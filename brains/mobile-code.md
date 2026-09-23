# Mobile code

Reviewed 2026-09-22 against `/Users/dhruvdave/Dhurv/Project_TerriTool/TerriTool`. Full file-level notes: [code/mobile-review.md](../code/mobile-review.md). Screen name to file: [code/mobile-screens.md](../code/mobile-screens.md). Props: [code/mobile-components.md](../code/mobile-components.md). Chrome: [mobile UI](mobile-ui.md). Calls: [API](api.md). New UI: [Guardian](ui-ux-guardian.md) first.

## Must follow

| Rule | Do this |
|---|---|
| Entry | `index.js` → `init.js` → `App/App.js` |
| Screens | Class `Component` / `PureComponent` / `ValidationComponent`. Do not convert a class screen to hooks as a drive-by. |
| Navigation | One native stack in `App/App.js`. `headerShown: false`. No tab navigator, no drawer. Register every new screen there. |
| Footer | `App/components/customfooter/index.js`. Indexes 1–6. Dashboard does not render it. Find Leads (`MultipleAIWaypoint`) is opened from the footer and also has no footer of its own. |
| State | Class state plus `App/utils/Global.js`. No Redux. |
| HTTP | `API.post(url, formdata, props, signal, options)` in `App/utils/API.js`. Multipart. `Authorization: Bearer` from Realm JWT row `"1"`. |
| Base URL | `App/config/index.js` exports `URL_BASE = 'https://staging.territool.com/index.php/api/'`. The production line is commented. |
| Realm | `App/storage/realm.js` `schemaVersion: 18`. |
| Publish | A route is not done until `simplerouteview` returns `route_status === "published"`. |

`gestureEnabled: false` on Login, SubscriptionGate, Dashboard, PublishRoute, EditPublishRoute, LassoMap, MultipleWaypoint, SelectStartEndPointsList.

## 46 stack screens

File for each one: [mobile screens](../code/mobile-screens.md).

Login, Register, SubscriptionScreen, SubscriptionGate, Dashboard, RecentActivity, CalendarActivity, Notifications, EditStatus, QrCodeScanner, Lists, CreateLists, EditLists, ListsDetail, RouteSwipe, Routes, CreateRoute, EditRoute, BasicRouteDetail, CreateCompany, BusinessCard, SelectStartEndPoints, EditSelectStartEndPoints, ViewCompany, ListCompany, EditCompany, PublishRoute, EditPublishRoute, ContactsCreate, ContactsUpdate, ContactsView, CompanyView, CustomCompany, ActiveRouteMap, WaypointDetail, LassoMap, Error, MultipleWaypoint, MultipleAIWaypoint, CongContact, bizCompanies, bizContacts, FilterList, FilterRoute, FilterModule, SelectStartEndPointsList.

## Component folders

`activeroutemap`, `common`, `company`, `contacts`, `customcompany`, `customfooter`, `customheader`, `dashboard`, `error`, `filterModule`, `findLeads`, `list`, `login`, `register`, `route`, `splash`, `toast`.

Review rewards live in `dashboard/ReviewRewardsModal.js` and `ReviewRewardsModal.styles.js`. The home banner in `dashboard/index.js` opens that sheet. Logos are `App/images/review-rewards/G2.png` and `ProductHunt.png`. The post is `URL_INVITE_USER` (`invite-user`) with FormData `type` `g2` or `ph`.

## Footer targets

| Index | Opens |
|---|---|
| 1 | Home / Dashboard |
| 2 | `MultipleAIWaypoint` (AI Find Leads) |
| 3 | `ListCompany` (Address Book) |
| 4 | `Routes` |
| 5 | `Lists` |
| 6 | `EditStatus` (Settings) |

Versions on the review date: React Native 0.84.1, React 19.2.3, Realm ^20.2.0, React Navigation ^7.1.33.
