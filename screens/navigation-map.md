---
id: navigation-map
parent: screens
sources:
  - App/App.js
  - App/components/customfooter/index.js
  - App/components/register/postSignupPaywallFlow.js
  - App/utils/firstSignUpOnboarding.js
  - App/utils/subscriptionGate.js
  - App/components/route/index.js
related:
  - screens/how-it-works.md
  - 10-mobile-app.md
  - brains/mobile-code.md
  - design/04-User-Flows/README.md
  - 05-constraints-and-drift.md
  - ops/known-bugs.md
---
# Mobile navigation map

One flat `createNativeStackNavigator` in `App/App.js`. **46** `Stack.Screen` names. No nested stacks, tabs, or drawer. `CustomFooter` is fake tabs (indexes **1–6**). **Dashboard has no footer.**

Do not `navigate("ClusterList")` — that name is **not** registered.

## Cold start / auth

```
Launch → splash → JWT?
  no  → Login
  yes → trial inactive? SubscriptionGate : Dashboard

Login success → trial inactive? SubscriptionGate
             → first-signup incomplete? reset MultipleAIWaypoint (firstSignUpOnboarding)
             → else Dashboard

Register success → PostSignupPaywallFlow modal (in Register, not a stack screen)
  Goals → Role → Cost → Configuring → SubscriptionScreen
  purchase OK → Welcome → reset MultipleAIWaypoint onboarding
  skip / dismiss → reset MultipleAIWaypoint onboarding

SubscriptionGate purchase OK → reset Dashboard
EditStatus logout / session expired / force logout → reset Login
```

`PostSignupPaywallFlow`: `register/postSignupPaywallFlow.js`. Onboarding flag: `utils/firstSignUpOnboarding.js`. Gate: `utils/subscriptionGate.js`.

Nav state `@TerriTool_nav_state` is saved when logged in, **not** restored as `initialState`. Cold start is Dashboard or SubscriptionGate, not last deep screen.

## Hub and footer

| From | Control | To |
|------|---------|-----|
| Dashboard tile | AI Find Leads | `MultipleAIWaypoint` |
| Dashboard tile | Scan Card | `BusinessCard` |
| Dashboard tile | Add Company | `CreateCompany` |
| Dashboard tile | Routes / Lists / Address Book | `Routes` / `Lists` / `ListCompany` |
| Dashboard header | Settings | `EditStatus` |
| Dashboard | Calendar / View all recent | `CalendarActivity` / `RecentActivity` |
| Dashboard | Activity row | `ViewCompany` |
| Dashboard | QR | `QrCodeScanner` |
| Footer 1 | Home | `Dashboard` |
| Footer 2 | Find Leads | **push** `MultipleAIWaypoint` (lat/lng) |
| Footer 3–6 | Companies / Routes / Lists / Settings | `ListCompany` / `Routes` / `Lists` / **push** `EditStatus` |

Footer appears on module screens (`Routes`, `Lists`, `ListCompany`, `ViewCompany`, …), **not** on Dashboard or `aiFindLeads.js`.

## Module trees

**Routes:** `Routes` → `BasicRouteDetail` → `EditRoute` / `ActiveRouteMap` / `CompanyView`. Create: `CreateRoute` → `CreateCompany` \| `MultipleWaypoint` \| `LassoMap` \| `SelectStartEndPoints` → `PublishRoute` (poll until `published`) → reset `BasicRouteDetail` or `Dashboard`. Edit twin: `EditSelectStartEndPoints` → `EditPublishRoute`.

**Lists:** `Lists` → `ListsDetail` → `EditLists` / `ActiveRouteMap` / `CompanyView`. Create/edit can add via `CreateCompany` / `MultipleWaypoint` / `LassoMap`. List → route: `SelectStartEndPointsList` → replace `PublishRoute`.

**Companies:** `ListCompany` → `ViewCompany` (embeds `CustomCompany`) / `CreateCompany` / `ContactsView` / `ContactsCreate` / `MultipleWaypoint`. `CreateCompany` → `ViewCompany` / `BusinessCard`. Embedded `CustomCompany` → `CreateRoute` / `CreateLists` / `ListsDetail` / `ContactsCreate` / `EditCompany` / `CongContact` / `bizContacts`.

**Find Leads:** `MultipleAIWaypoint` (AI V2) → push `CreateRoute` / `CreateLists` / `Lists` / `EditSelectStartEndPoints`. Lists/Routes **Find Leads** buttons open classic `MultipleWaypoint` (Places), **not** AI V2. Onboarding: AI screen → `CreateRoute` → publish (no post-save modal).

**Driving:** `ActiveRouteMap` → `WaypointDetail` (embeds `CustomCompany`).

**Contacts:** `ContactsCreate` / `ContactsUpdate` / `ContactsView`. Enrichment: `CongContact` → `bizContacts` → `ViewCompany`.

**LassoMap:** push `CreateRoute` / `EditRoute` / `CreateLists` / `EditLists` with selected companies.

## Registered but not stack-navigated

| Screen | Fact |
|--------|------|
| `CustomCompany` | Embedded in `ViewCompany` / `CompanyView` / `WaypointDetail`. Do not push the stack name. |
| `FilterModule` | Inline modal on create/edit route/list, detail, map, Address Book. |
| `FilterList`, `FilterRoute` | Registered; no `navigate("FilterList"\|"FilterRoute")` in `App/`. |
| `RouteSwipe` | Registered (`route/basic/goswipe.js`); no navigate. |
| `Notifications` | Registered; no `navigate("Notifications")` (title string only). |

## Broken

`Routes` (`route/index.js`) and `utils/navigateToRouteDetail.js` call `navigate("ClusterList", …)` but **`ClusterList` is not a `Stack.Screen`**. Do not add a nested navigator to “fix” it unless a human asks. [known-bugs](../ops/known-bugs.md).

## Journeys

| Who | Path |
|-----|------|
| New user | Register → paywall modal → `MultipleAIWaypoint` onboarding → `CreateRoute` → `PublishRoute` → `BasicRouteDetail` or Dashboard |
| Returning | Login → Dashboard → footer / tiles |
| Expired trial | Login or cold start → `SubscriptionGate` → subscribe → Dashboard |
| Daily hunt | Dashboard/footer → AI Find Leads → save ≥2 → route or list → company → find contacts → activity / mark visited |

Step/API detail: [how-it-works.md](how-it-works.md). Visual flows (some stills skipped): [design/04-User-Flows](../design/04-User-Flows/README.md).
