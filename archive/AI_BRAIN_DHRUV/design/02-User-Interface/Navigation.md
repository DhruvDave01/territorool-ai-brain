---
id: Navigation
parent: design
---
# Navigation

## Root

- `@react-navigation/native` + `@react-navigation/native-stack` v7
- **No** bottom-tabs, drawer, or nested stacks
- Persistence key `@TerriTool_nav_state` — restore **does not** reopen last deep screen (`initialState` cleared)
- `headerShown: false` everywhere

## Cold start

```mermaid
flowchart TD
  A[Launch + JS splash] --> B{JWT in Realm?}
  B -->|No| L[Login]
  B -->|Yes| C[RevenueCat identify]
  C --> D[GET_CREDIT_INFO trial]
  D --> E{trial inactive + sub not active?}
  E -->|Yes| G[RevenueCat paywall - 08/09 same chrome]
  E -->|No or error| H[Dashboard]
```

Login success uses the same gate. Gesture back disabled on Login and Dashboard.

## Footer (not React Navigation tabs)

```mermaid
flowchart LR
  F[CustomFooter] --> T1[Dashboard]
  F --> T2[push MultipleAIWaypoint]
  F --> T3[ListCompany]
  F --> T4[Routes]
  F --> T5[Lists]
  F --> T6[push EditStatus]
```

Find Leads and Settings **push**; others **navigate**. Dashboard **does not render** the footer; Home still targets Dashboard.

iOS native **stack push animation** is visible in VID3 (`x3_t28s`): previous screen peeks from the left.

## Module map (in-scope)

```mermaid
flowchart TB
  Dash[Dashboard]
  Dash --> AI[MultipleAIWaypoint]
  Dash --> Scan[BusinessCard]
  Dash --> AddCo[CreateCompany]
  Dash --> R[Routes]
  Dash --> Ls[Lists]
  Dash --> AB[ListCompany]
  Dash --> Cal[CalendarActivity]
  Dash --> RA[RecentActivity]
  Dash --> QR[QrCodeScanner]
  Dash --> Set[EditStatus]

  AI --> CR[CreateRoute]
  AI --> CL[CreateLists]
  CR --> SEP[SelectStartEndPoints]
  SEP --> PR[PublishRoute]
  PR --> RD[BasicRouteDetail]
  RD --> ARM[ActiveRouteMap]
  RD --> CV[CompanyView]
  ARM --> WD[WaypointDetail]

  Ls --> LD[ListsDetail]
  LD --> CV
  CL --> LD

  AB --> VC[ViewCompany]
  AB --> AddCo
  AB --> CView[ContactsView]
  AB --> CNew[ContactsCreate]
  VC --> EditCo[EditCompany]
  VC --> CNew
  CV --> CNew
  CV --> Cong[CongContact]
  Cong --> Biz[bizContacts]
```

## Deep links / FCM

- Info.plist URL scheme is Facebook SDK, not in-app routing
- Referral Dynamic Link `https://territoolapp.page.link/App` is **share copy**, not a JS router
- FCM logs notification opens; **does not** `navigate("Notifications")`

**Needs Manual Verification:** native Firebase handling of Dynamic Links after install.

## Dead / broken

| Name | Issue |
| --- | --- |
| Notifications | Registered. Still empty + **405**. No Dashboard-bell still |
| RouteSwipe | Registered; still is a stub, not shipping chrome |
| FilterList / FilterRoute | **Legacy** stills exist; live filter is `FilterModule` — do not copy |
| ClusterList | Navigated, **not registered** |
| CustomCompany stack | Usually embedded |
