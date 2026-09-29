# Mobile screens — name to file

Generated 2026-09-22 from the `lazy(() => import(...))` lines and `<Stack.Screen>` registrations in `TerriTool/App/App.js`. Updated 2026-09-29: 52 screens, with the two Voice Mode screens and the three bulk-contact screens (`Contact`, `BulkContactPeople`, `BulkContactReview`). When this page and that file disagree, the file wins. Regenerate by reading `App/App.js` again; do not edit by hand from memory.

Paths are under `TerriTool/App/components/`. Every screen is registered on the one native stack in `App/App.js` with `headerShown: false`. "Footer" is the `CustomFooter` index the screen renders, or "none". "Still" is the folder under `screenshots/mobile-owner/` to open first; [flows/mobile.md](../flows/mobile.md) names the first clean frame in each.

## Home, activity, settings — folder `dashboard/`

| Screen name | File | Footer | Still | Notes |
|---|---|---|---|---|
| `Dashboard` | `dashboard/index.js` | none | Dashboard | Six tiles. `gestureEnabled: false`. The banner “Want 50 more credits?” opens `dashboard/ReviewRewardsModal.js`. The AI Find Leads tile calls `navigation.navigate("AIFindLeadsChat")`. Other tiles push `BusinessCard`, `CreateCompany`, `Routes`, `Lists`, `ListCompany`. In staging and dev builds, while a route is active, the first scroll row is “Drive with Voice Mode” (`DriveWithVoiceRow`). The first-run sheet opens over this screen. |
| `RecentActivity` | `dashboard/RecentActivityScreen.js` | none | ActivityCalendar | |
| `CalendarActivity` | `dashboard/CalendarActivityScreen.js` | none | ActivityCalendar | |
| `Notifications` | `dashboard/NotificationsScreen.js` | none | — | |
| `QrCodeScanner` | `dashboard/QrCodeScannerScreen.js` | none | Dashboard | |
| `EditStatus` | `dashboard/editstatus.js` | 6 | Setting | **This is the Settings screen.** Profile, credits, subscription, Tags / Edit Status, app update, version. Styles in `dashboard/editstatus.styles.js`. In staging and dev builds, the Voice Mode card (`VoiceSettingsCard`) sits between the profile card and Tags. |

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
| `MultipleAIWaypoint` | `findLeads/aiFindLeads.js` | none | AIFindLeadsFlow | Older city/ZIP search. Still registered. The chat screen links here with “Type a city or ZIP instead”. No footer. |
| `AIFindLeadsChat` | `findLeads/aiFindLeadsChat.js` | none | — | Default AI Find Leads. Dashboard tile and footer index 2 open it. Lazy-loaded in `App.js`. No footer. |
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
| `Contact` | `route/contact/index.js` | none | — | Bulk contacts, header “Find Contacts”. Opened from `BasicRouteDetail` and `ListsDetail`. Pushes `BulkContactPeople`. Lazy. |
| `BulkContactPeople` | `route/contact/people.js` | none | — | People at one company. Header is the company title with the address as `subText`. Goes to `BulkContactReview`. |
| `BulkContactReview` | `route/contact/review.js` | none | — | Header “Review”. Picked people and credits, “Credits are used only when you confirm.” Buys through `buyQueuedBulkContacts` in `utils/bulkContactProgress.js`. |

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
| `BasicRouteDetail` | `route/basic/index.js` | 4 | RouteFlow | Import name is `RouteDetail`. In staging and dev builds the header’s left slot is back plus the voice mic (`VoiceHeaderButton`). |
| `CompanyView` | `route/basic/company-view.js` | 4 | RouteFlow | Company inside a route. Not `ViewCompany`. |
| `RouteSwipe` | `route/basic/goswipe.js` | none | RouteFlow | Stub. Not shipping chrome. |
| `ActiveRouteMap` | `activeroutemap/index.js` | none | RouteFlow | Map. `gestureEnabled` default. In staging and dev builds the header’s right slot is the voice mic, then filter. |
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

## Voice Mode — folder `voice/`

Both are lazy in `App.js`, and both are function components that read `useVoice()`. Staging and dev builds only (`VOICE_MODE_ENABLED`). Page: [22 — Voice Mode](../features/22-Voice-Mode.md).

| Screen name | File | Footer | Still | Notes |
|---|---|---|---|---|
| `VoiceScreen` | `voice/VoiceScreen.js` | 4 (`onVoiceScreen`) | VoiceMode | Header “Voice Mode” with a history button. State card, transcript and cards, then End with Pause / Resume / Reconnect. `{ start: true }` connects, or shows the first-run sheet if voice was never turned on. |
| `VoiceHistory` | `voice/VoiceHistory.js` | 4 (`onVoiceScreen`) | VoiceMode | Header “Voice history” with a trash button. Turns by day, from Realm `VoiceTurn`. |

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
| 2 | `AIFindLeadsChat` |
| 3 | `ListCompany` |
| 4 | `Routes` |
| 5 | `Lists` |
| 6 | `EditStatus` |

Screens that render `<CustomFooter>` on 2026-09-29: `company/list.js`, `company/view.js`, `contacts/view.js`, `dashboard/editstatus.js`, `list/index.js`, `list/basic/index.js`, `route/index.js`, `route/basic/index.js`, `route/basic/company-view.js`, `voice/VoiceScreen.js`, `voice/VoiceHistory.js`. On these the voice mini-bar docks inside the footer. On every other screen, apart from sign-in and paywall, it sits below the navigator.

## Loading test IDs

Every data screen marks its loader with `testID="screen.<screenKey>.loading"` and a letter suffix for a second loader (`loadingB`, `loadingC`). Empty states that exist as test IDs: `screen.companyList.loadingEmpty`, `screen.companyList.loadingEmptyContacts`, `screen.calendarActivity.monthEmpty`. Keep the pattern on a new screen.

Voice Mode test IDs, as the Maestro flows use them:

- **Screens:** `screen.voice`, `screen.voiceHistory`.
- **State:** `voice.state`, `voice.orb`.
- **Action bar:** `voice.turnOn`, `voice.end`, `voice.pause`, `voice.resume`, `voice.reconnect`.
- **History:** `voice.historyButton`, `voiceHistory.clear`.
- **Mini-bar:** `voice.miniBar`, `voice.miniBar.pause`.
- **Header mic:** `voice.headerButton`.
- **First-run sheet:** `voice.firstRun`, `voice.firstRun.notNow`, `voice.firstRun.turnOn`.
- **Cards:** `voice.stopRow`, `voice.unknownWrite`, `voice.handOff.open`.
- **Dashboard and Settings:** `screen.dashboard.voiceRow`, `screen.editStatus.voiceCard`, `screen.editStatus.voiceToggle`, `screen.editStatus.voiceKeepListening`, `screen.editStatus.voiceAutoStart`, `screen.editStatus.voiceClear`.
