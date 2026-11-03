# Mobile code

Reviewed 2026-09-22 against `/Users/dhruvdave/Dhurv/Project_TerriTool/TerriTool`, again on 2026-09-28 and 2026-09-29 ([review](../reviews/live-code-2026-09-29.md)), and last on 2026-11-02 against `TT_80` `daf50eeb` (development, not in the stores yet) and `Production` `6973a30d` (the store build, 4.4.74) ([review](../reviews/live-code-2026-11-02.md)). Facts are for `TT_80` unless a line names `Production`. Full file-level notes: [code/mobile-review.md](../code/mobile-review.md). Screen name to file: [code/mobile-screens.md](../code/mobile-screens.md). Props: [code/mobile-components.md](../code/mobile-components.md). Chrome: [mobile UI](mobile-ui.md). Calls: [API](api.md). New UI: [Guardian](ui-ux-guardian.md) first.

## Must follow

| Rule | Do this |
|---|---|
| Entry | `index.js` → `init.js` → `App/App.js`. `init.js` runs `Sentry.init` and `index.js:15` registers `Sentry.wrap(App)`. |
| Screens | Class `Component` / `PureComponent` / `ValidationComponent`. Do not convert a class screen to hooks as a drive-by. The two voice screens, `VoiceScreen` and `VoiceHistory`, are function components that read `useVoice()`. They are the exception, not the pattern. |
| Navigation | One native stack in `App/App.js`. `headerShown: false`. No tab navigator, no drawer. Register every new screen there. |
| Footer | `App/components/customfooter/index.js`. Indexes 1–6. Dashboard does not render it. Footer index 2 pushes `MultipleAIWaypoint` (`findLeads/aiFindLeads.js`, `customfooter/index.js:283-287`). That screen has no footer of its own. `5865546a` (also on `Production`) removed `AIFindLeadsChat`. `VoiceScreen` and `VoiceHistory` render index 4 with `onVoiceScreen`. |
| State | Class state plus `App/utils/Global.js`. No Redux. |
| HTTP | `API.post(url, formdata, props, signal, options)` in `App/utils/API.js`. Multipart. `Authorization: Bearer` from Realm JWT row `"1"` (`API.js:241`). One attempt by default (`DEFAULT_MAX_ATTEMPTS = 1`, `API.js:10`); a call opts in to retries with `options.maxAttempts`. Exceptions: `App/voice/voiceApi.js` sends JSON with `fetch` to `voice/session` and `voice/tool`; `App/utils/calendarSync.js` posts JSON through `API.post(..., { asJson: true })` (`API.js:213`, `:262`); `App/utils/clientKeys.js` reads the app keys with a plain `fetch` GET. |
| Base URL | On `Production`, `App/config/index.js:12` exports `URL_BASE = 'https://app.territool.com/index.php/api/'` (production) and the staging line is commented at `:8`. On `TT_80` it is the other way round since `4bfea8b0` (2 November, the TestFlight upload). Developers swap the two lines to build: on `TT_80` it flipped in ten commits from 7 October to 2 November, six of them from 16 to 28 Oct (`5df33a2f`, `201e596a`, `d615df40`, `f766dcd2`, `7c389031`, `0ff59cdc`), then `4bfea8b0`. Check it before any test or build, test against staging, and do not commit the swap. `IS_STAGING_OR_DEV_BUILD` (`:27-29`) is true only when `URL_BASE` contains "staging", so a dev build pointed at production counts as production, and a release build pointed at staging reports to Sentry as `staging`. |
| Realm | `App/storage/realm.js` `schemaVersion: 20` on `TT_80` (`:500`, `:528`, `:536`). `AppKeys` (`:89-100`) was added after `VoiceTurn`. `Production` is at 18 and has neither table. A schema change raises it in all three places in that file. |
| Voice Mode | One shared session in `App/voice/VoiceSession.js`, outside navigation. `VOICE_MODE_ENABLED = true` (`App/config/index.js:34`), so every `TT_80` build has it. `Production` has no voice code. `VOICE_DEMO_URL` follows the build (`:43-45`): the staging voice host for a staging build, the production host otherwise. `VoiceMiniBarHost` wraps the navigator in `App.js`. Page: [22 — Voice Mode](../features/22-Voice-Mode.md). |
| Sign-out | Every path ends in `deleteJWTToken`, which now emits `SIGNED_OUT_EVENT` (`App/sessionExpiredEvent.js`). Listen for it to clear per-user state. |
| Publish | A route is not done until `simplerouteview` returns `route_status === "published"`. |
| Errors | Report with `captureSentryError` or `captureSentryMessage` from `App/utils/SentryHelper.js`. Both pass the context through `sanitizeForSentry`. Triage: [On-call](on-call.md). |
| Releases | There is no over-the-air update tool (no CodePush). A mobile fix reaches users only through a store release. |

`gestureEnabled: false` on Login, SubscriptionGate, Dashboard, PublishRoute, EditPublishRoute, LassoMap, MultipleWaypoint, SelectStartEndPointsList.

## Sentry and app keys

- `948c3f4d` (30 Oct, `TT_80` only) replaced PostHog with Sentry and deleted `App/utils/PostHogHelper.js` and `posthogClient.js`. `init.js:25-51` sets `enabled: !__DEV__` (dev builds send nothing), environment `development`, `staging` or `production` from `__DEV__` and `IS_STAGING_OR_DEV_BUILD` (`:19-23`), `sendDefaultPii: true`, session replay for 10% of sessions and every session with an error, with text, image and vector masking off, and traces and profiles at 0.2. The DSN is the `SENTRY_DSN` constant (`App/config/index.js:16-17`). `SENTRY_DEBUG_LOG` (`:24`) is false; set true, it samples everything, sends console lines, and makes `init.js:53-69` send sample metrics.
- `captureSentryError` (`SentryHelper.js:11-30`) has about 310 call sites in 62 files. `captureSentryMessage` (`:53-63`) has 24 in 10 files and sends usage events such as `dashboard_loaded`, `login_success` and `purchase_success` as info-level messages.
- Known leak: `recordApi` (`API.js:40-76`) sends every failed call (a body `status_code` of 400, 401, 403, 404 or 500, or a network failure) to Sentry with the raw headers, including the Bearer token, and the request and response bodies. `apiBody` (`:12-38`) only replaces files with their size, and `sanitizeForSentry` (`App/utils/sentrySanitize.js`) is not used there. A failed `google-calendar/connection` call therefore also carries the Google tokens. Crashlytics is still loaded in `API.js:4` and three other files.
- History: `Production` reports to an older Sentry org and to PostHog. `ae24921a` (9 Oct) removed Sentry from `TT_80`, so Android 4.4.76 to 4.4.79 (iOS 42.37 to 42.40) built before `948c3f4d` report to PostHog only. `948c3f4d` kept 4.4.79 (370).
- App keys: `85b58f60` (21 Oct) took the Google, Directions, Gemini and Mapbox keys out of `App/config/index.js`; `Production` still has them at `:203-218`. On `TT_80`, `App/utils/clientKeys.js` fetches `URL_APP_KEYS` (web `GET appkeys-<suffix>`) at cold start (`App.js:240`), after login and after register, and saves them in the Realm `AppKeys` row. It logs the Bearer header and the key payload with `console.log` (`:73-98`), a known issue; `babel.config.js` strips console calls from production bundles. Never quote the values.

## 51 stack screens

Reviewed again 2026-11-02. `5865546a` (30 Sep, also on `Production`) removed `AIFindLeadsChat`, and no screen was added. `Production` has 49: this list without `VoiceScreen` and `VoiceHistory`.

File for each one: [mobile screens](../code/mobile-screens.md).

Login, Register, SubscriptionScreen, SubscriptionGate, Dashboard, RecentActivity, CalendarActivity, Notifications, EditStatus, QrCodeScanner, Lists, CreateLists, EditLists, ListsDetail, RouteSwipe, Routes, CreateRoute, EditRoute, BasicRouteDetail, Contact, BulkContactPeople, BulkContactReview, CreateCompany, BusinessCard, SelectStartEndPoints, EditSelectStartEndPoints, ViewCompany, ListCompany, EditCompany, PublishRoute, EditPublishRoute, ContactsCreate, ContactsUpdate, ContactsView, CompanyView, CustomCompany, ActiveRouteMap, WaypointDetail, LassoMap, Error, MultipleWaypoint, MultipleAIWaypoint, CongContact, bizCompanies, bizContacts, FilterList, FilterRoute, FilterModule, SelectStartEndPointsList, VoiceScreen, VoiceHistory.

## Component folders

`activeroutemap`, `common`, `company`, `contacts`, `customcompany`, `customfooter`, `customheader`, `dashboard`, `error`, `filterModule`, `findLeads`, `list`, `login`, `register`, `route`, `splash`, `toast`, `voice`.

Voice Mode’s session code is not under `components`. It is in `App/voice/` (`VoiceSession.js`, `voiceApi.js`, `audioSession.js`, `history.js`, `transcript.js`, `useVoice.js`, and the phone-side tools `crmTool.js`, `goBack.js`, `repLocation.js` and `skipStops.js`). Its screens and pieces are in `App/components/voice/`.

Review rewards live in `dashboard/ReviewRewardsModal.js` and `ReviewRewardsModal.styles.js`. On `Production` the home banner "Unlock 50 Credits." (`dashboard/index.js:1348-1362`) opens that sheet. `fe2e3254` removed the banner on `TT_80`, where the sheet is still rendered (`:1917`) but nothing opens it. Logos are `App/images/review-rewards/G2.png` and `ProductHunt.png`. The post is `URL_INVITE_USER` (`invite-user`) with FormData `type` `g2` or `ph`.

## Footer targets

| Index | Opens |
|---|---|
| 1 | Home / Dashboard |
| 2 | `MultipleAIWaypoint` (AI Find Leads, city or ZIP) |
| 3 | `ListCompany` (Address Book) |
| 4 | `Routes` |
| 5 | `Lists` |
| 6 | `EditStatus` (Settings) |

Versions on the review date: React Native 0.84.1, React 19.2.3, Realm ^20.2.0, React Navigation ^7.1.33. Added for Voice Mode on 2026-09-29: `react-native-webrtc` 124.0.8 and `react-native-incall-manager` 4.3.0, pinned, with `patches/react-native-incall-manager+4.3.0.patch`. On 2026-11-02 `TT_80` has `@sentry/react-native` ^8.33.0 and no PostHog packages; `Production` has `@sentry/react-native` 8.5.0 and `posthog-react-native` ^4.61.4, and neither voice package.

The mobile repo has an always-on Cursor rule, `.cursor/rules/ponytail-lazy-senior.mdc`. It asks for the simplest working change, reuse before new code, and one runnable check for non-trivial logic. It agrees with [minimal change](../methods/minimal-change.md).
