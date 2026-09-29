# Mobile code

Reviewed 2026-09-22 against `/Users/dhruvdave/Dhurv/Project_TerriTool/TerriTool`, then again on 2026-09-28 for the Find Leads chat, and on 2026-09-29 for Voice Mode (branch `VoiceAgent`, commit `49c6ad7f`, [review](../reviews/live-code-2026-09-29.md)). Full file-level notes: [code/mobile-review.md](../code/mobile-review.md). Screen name to file: [code/mobile-screens.md](../code/mobile-screens.md). Props: [code/mobile-components.md](../code/mobile-components.md). Chrome: [mobile UI](mobile-ui.md). Calls: [API](api.md). New UI: [Guardian](ui-ux-guardian.md) first.

## Must follow

| Rule | Do this |
|---|---|
| Entry | `index.js` → `init.js` → `App/App.js` |
| Screens | Class `Component` / `PureComponent` / `ValidationComponent`. Do not convert a class screen to hooks as a drive-by. The two voice screens, `VoiceScreen` and `VoiceHistory`, are function components that read `useVoice()`. They are the exception, not the pattern. |
| Navigation | One native stack in `App/App.js`. `headerShown: false`. No tab navigator, no drawer. Register every new screen there. |
| Footer | `App/components/customfooter/index.js`. Indexes 1–6. Dashboard does not render it. Footer index 2 opens `AIFindLeadsChat`. That screen has no footer of its own. `VoiceScreen` and `VoiceHistory` render index 4 with `onVoiceScreen`. |
| State | Class state plus `App/utils/Global.js`. No Redux. |
| HTTP | `API.post(url, formdata, props, signal, options)` in `App/utils/API.js`. Multipart. `Authorization: Bearer` from Realm JWT row `"1"`. The one exception is `App/voice/voiceApi.js`, which sends JSON with `fetch` to `voice/session` and `voice/tool`. |
| Base URL | `App/config/index.js` exports `URL_BASE = 'https://staging.territool.com/index.php/api/'`. The production line is commented. Voice calls go to `VOICE_DEMO_URL` instead, in staging and dev builds. |
| Realm | `App/storage/realm.js` `schemaVersion: 19` (`VoiceTurn` was added). A schema change raises it in all three places in that file. |
| Voice Mode | One shared session in `App/voice/VoiceSession.js`, outside navigation. It is behind `VOICE_MODE_ENABLED`, which is `IS_STAGING_OR_DEV_BUILD`. `VoiceMiniBarHost` wraps the navigator in `App.js`. Page: [22 — Voice Mode](../features/22-Voice-Mode.md). |
| Sign-out | Every path ends in `deleteJWTToken`, which now emits `SIGNED_OUT_EVENT` (`App/sessionExpiredEvent.js`). Listen for it to clear per-user state. |
| Publish | A route is not done until `simplerouteview` returns `route_status === "published"`. |

`gestureEnabled: false` on Login, SubscriptionGate, Dashboard, PublishRoute, EditPublishRoute, LassoMap, MultipleWaypoint, SelectStartEndPointsList.

## 52 stack screens

Reviewed again 2026-09-28. Four names were not in the 22 September list: `AIFindLeadsChat`, `Contact`, `BulkContactPeople`, `BulkContactReview`. On 2026-09-29 two more were added, both lazy: `VoiceScreen` and `VoiceHistory`.

File for each one: [mobile screens](../code/mobile-screens.md).

Login, Register, SubscriptionScreen, SubscriptionGate, Dashboard, RecentActivity, CalendarActivity, Notifications, EditStatus, QrCodeScanner, Lists, CreateLists, EditLists, ListsDetail, RouteSwipe, Routes, CreateRoute, EditRoute, BasicRouteDetail, Contact, BulkContactPeople, BulkContactReview, CreateCompany, BusinessCard, SelectStartEndPoints, EditSelectStartEndPoints, ViewCompany, ListCompany, EditCompany, PublishRoute, EditPublishRoute, ContactsCreate, ContactsUpdate, ContactsView, CompanyView, CustomCompany, ActiveRouteMap, WaypointDetail, LassoMap, Error, MultipleWaypoint, MultipleAIWaypoint, AIFindLeadsChat, CongContact, bizCompanies, bizContacts, FilterList, FilterRoute, FilterModule, SelectStartEndPointsList, VoiceScreen, VoiceHistory.

## Component folders

`activeroutemap`, `common`, `company`, `contacts`, `customcompany`, `customfooter`, `customheader`, `dashboard`, `error`, `filterModule`, `findLeads`, `list`, `login`, `register`, `route`, `splash`, `toast`, `voice`.

Voice Mode’s session code is not under `components`. It is in `App/voice/` (`VoiceSession.js`, `voiceApi.js`, `audioSession.js`, `history.js`, `transcript.js`, `useVoice.js`). Its screens and pieces are in `App/components/voice/`.

Review rewards live in `dashboard/ReviewRewardsModal.js` and `ReviewRewardsModal.styles.js`. The home banner in `dashboard/index.js` opens that sheet. Logos are `App/images/review-rewards/G2.png` and `ProductHunt.png`. The post is `URL_INVITE_USER` (`invite-user`) with FormData `type` `g2` or `ph`.

## Footer targets

| Index | Opens |
|---|---|
| 1 | Home / Dashboard |
| 2 | `AIFindLeadsChat` (AI Find Leads chat) |
| 3 | `ListCompany` (Address Book) |
| 4 | `Routes` |
| 5 | `Lists` |
| 6 | `EditStatus` (Settings) |

Versions on the review date: React Native 0.84.1, React 19.2.3, Realm ^20.2.0, React Navigation ^7.1.33. Added for Voice Mode on 2026-09-29: `react-native-webrtc` 124.0.8 and `react-native-incall-manager` 4.3.0, pinned, with `patches/react-native-incall-manager+4.3.0.patch`.

The mobile repo has an always-on Cursor rule, `.cursor/rules/ponytail-lazy-senior.mdc`. It asks for the simplest working change, reuse before new code, and one runnable check for non-trivial logic. It agrees with [minimal change](../methods/minimal-change.md).
