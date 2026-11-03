# Mobile code review

Reviewed 2026-09-22 by reading `/Users/dhruvdave/Dhurv/Project_TerriTool/TerriTool`. Voice Mode was read on 2026-09-29 (commit `49c6ad7f`). Read again on 2026-11-02 against `TT_80` `daf50eeb` (development) and `Production` `6973a30d` (store build) ([review](../reviews/live-code-2026-11-02.md)); facts are for `TT_80` unless a line names `Production`. When this page and that tree disagree, the tree wins. Hub: [mobile code brain](../brains/mobile-code.md). UI: [mobile UI brain](../brains/mobile-ui.md). Screen files: [mobile screens](mobile-screens.md). Props: [mobile components](mobile-components.md).

## How to add a screen

1. Create a class component under the nearest folder in `App/components/`.
2. Register `<Stack.Screen>` in `App/App.js` on the existing native stack. Leave `headerShown: false`.
3. Use `CustomHeader`, `screenCurvedBody` (radius 25, fill `#F6F7FB`), and `AppButton`.
4. If the screen is a main section, add a footer index only by editing `customfooter`. Dashboard and the Find Leads screen do not show the footer.
5. Load data with `API.post` and a `FormData` body. Read the sibling screen’s `formdata.append` keys and reuse them. Do not invent keys.
6. Persist session in Realm (`App/storage/realm.js`, schema 20 on `TT_80`, 18 on `Production`). Do not add Redux. A new table raises `schemaVersion` in all three places in that file.
7. While a voice session runs, a screen with no footer shows the voice mini-bar under it (`VoiceMiniBarHost`). Add the screen name to `NO_MINI_BAR` in `voice/VoiceParts.js` only for sign-in and paywall screens.

## Layout of the app

| Path | Role |
|---|---|
| `App/App.js` | Stack registration. 51 screens (49 on `Production`). `VoiceMiniBarHost` wraps `NavigationContainer`. Loads the app keys at cold start (`:240`). |
| `init.js` | `Sentry.init` (`:25-51`), crash handlers, FCM listeners |
| `App/config/index.js` | `URL_BASE` and path constants. Voice: `VOICE_MODE_ENABLED`, `URL_VOICE_SESSION`, `URL_VOICE_TOOL`, `VOICE_DEMO_URL`. Sentry: `SENTRY_DSN`, `SENTRY_DEBUG_LOG`. Keys: `URL_APP_KEYS`. Calendar: `URL_GOOGLE_CALENDAR_CONNECTION`, `URL_GOOGLE_CALENDAR_SYNC` and the `CALENDAR_*` client ids (`:236-245`). |
| `App/utils/API.js` | `API.post` — multipart, Bearer JWT, session logout on 401/403. `asJson` option. `recordApi` (`:40-76`) sends failures to Sentry with raw headers and bodies. |
| `App/utils/SentryHelper.js`, `sentrySanitize.js` | `captureSentryError`, `captureSentryMessage`, `addAuthBreadcrumb`, `setSentryUserFromJwt` (user id, email, name). `sanitizeForSentry` redacts keys that contain password, token, authorization, secret or value; only `SentryHelper.js` uses it. |
| `App/utils/clientKeys.js` | Loads `URL_APP_KEYS` into the Realm `AppKeys` row; `getGoogleApiKey`, `getDirectionApiKey`, `getGeminiApiKey`, `getMapboxAccessToken` read it back |
| `App/utils/calendarSync.js` | Google Calendar sign-in (PKCE in the browser, `:159-189`), tokens in AsyncStorage, JSON posts to `google-calendar/connection` and `google-calendar/sync` (`:757-795`). `pushActivityToCalendars` is paused (`:208-212`). Page: [23 — Calendar Sync](../features/23-Calendar-Sync.md). |
| `App/utils/FCMHelper.js` | Push listeners. `showLocalContactNotification` (`:206-247`) shows a notifee notification after a contact save and never asks for permission. Also on `Production`. |
| `App/utils/ConnectivityHelper.js` | `scheduleOnlineRetry(host, key, run)` (`:162`) reruns a screen load once the device is online; `cancelOnlineRetry(host)` on unmount |
| `App/utils/contactBuyCredits.js` | 2 / 2 / 1 credit constants |
| `App/utils/Global.js` | Shared mutable state |
| `App/storage/realm.js` | Local DB, schemaVersion 20, JWT row id `"1"`. `VoiceTurn` holds voice history. `AppKeys` (row `"1"`) holds the map and AI keys. `deleteJWTToken` (`:228-236`) deletes the voice history and the JWT row and emits `SIGNED_OUT_EVENT`; the `AppKeys` row stays. |
| `android/sentry.properties`, `ios/sentry.properties` | Org `territool-llc`, project `mobile-app`. Android applies the Sentry Gradle plugin 6.25.0 (`android/build.gradle:20`) and `sentry.gradle` (`android/app/build.gradle:6-15`). iOS runs `sentry-xcode.sh` in "Bundle React Native code and images" and has an "Upload Debug Symbols to Sentry" phase. Release builds upload with `SENTRY_AUTH_TOKEN`. Since `4bfea8b0` both iOS phases skip the upload, and the build still succeeds, when neither that variable nor a `.env.sentry-build-plugin` file at the repo root (git-ignored) is present. On `Production` both files point at the older org and commit an `auth.token` line (`:2`); do not copy it. |
| `App/sessionExpiredEvent.js` | `SESSION_EXPIRED_EVENT`, `FORCE_LOGOUT_TO_LOGIN_EVENT`, `SIGNED_OUT_EVENT` |
| `App/voice/` | Voice Mode session: `VoiceSession.js`, `voiceApi.js` (JSON over `fetch`), `audioSession.js`, `history.js`, `transcript.js`, `useVoice.js`. Phone-side tools: `crmTool.js`, `goBack.js`, `repLocation.js`, `skipStops.js`. |
| `App/components/voice/` | `VoiceScreen.js`, `VoiceHistory.js`, `VoiceParts.js` (mini-bar, header mic, Dashboard row, first-run sheet, Settings card), `voice.styles.js` |
| `App/styles/theme.js` | Color tokens. Primary `#124ac6`. |
| `App/styles/screenCurvedBody.js` | Body radius and surface |
| `App/styles/fonts.js` | Platform font names. Screens use `theme.font.dinBold` / `theme.font.dinLight`, not this file directly. |
| `App/components/customheader` | Gradient header |
| `App/components/customfooter` | Six icon tabs |
| `App/components/common/AppButton.js` | primary, danger `#CF5B51`, neutral, dark, ghost |
| `App/components/common/AppConfirmModal.js` | Confirms |

## Component folders and what belongs there

| Folder | Put here |
|---|---|
| `login`, `register` | Auth and onboarding |
| `dashboard` | Home, recent activity, calendar, notifications. `CalendarSyncPopup.js` is the Google Calendar connect sheet. |
| `findLeads` | AI Find Leads (`MultipleAIWaypoint`, `aiFindLeads.js`) and `MultipleWaypoint` (`index.js`). The chat screen `AIFindLeadsChat` was removed in `5865546a`. |
| `company` | Address Book list, create, view, edit |
| `contacts` | Contact create, update, view, buy |
| `list` | Lists library and detail |
| `route` | Route library, create, edit, publish, detail |
| `activeroutemap` | Map and waypoint detail |
| `filterModule` | The live filter. `FilterList` and `FilterRoute` are the old teal screens. Do not copy those. |
| `customcompany` | Business-card / custom company path |
| `error` | Error screen |
| `splash` | Splash only |
| `voice` | Voice Mode screens and the pieces other screens mount. The session itself is in `App/voice/`. |

## Footer wiring (from `customfooter/index.js`)

| Index | `selectedIndex` | Navigation |
|---|---|---|
| Home | 1 | Dashboard. On `Production` the "Unlock 50 Credits." banner opens `ReviewRewardsModal` on the same screen; `TT_80` removed the banner (`fe2e3254`). |
| Find Leads | 2 | `nav.push("MultipleAIWaypoint", { fromDashboard: true, latitude, longitude })` |
| Address Book | 3 | `ListCompany` |
| Routes | 4 | `Routes` |
| Lists | 5 | `Lists` |
| Settings | 6 | `EditStatus` |

Icons are images, not a label row. Active tint comes from the footer styles. Keep indexes 1–6. There is no index 0.

## HTTP shape

```javascript
const formdata = new FormData();
formdata.append("key_from_the_sibling_screen", value);
await API.post(URL_FROM_CONFIG, formdata, this.props);
```

`API.post` sets `Content-Type: multipart/form-data` and `Authorization: Bearer` plus the Realm token. Default is one attempt. Pass `{ maxAttempts }` only when the sibling call already retries. `{ asJson: true }` sends a JSON body instead (`API.js:213`, `:227-237`, `:262`).

On `Production`, `URL_BASE` is committed pointing at production, `https://app.territool.com/index.php/api/` (`App/config/index.js:12`), with the staging line commented at `:8`. On `TT_80` it is the other way round since `4bfea8b0` (2 November, the TestFlight upload); the committed value changes whenever someone builds. Check it before a test or a build, test against staging, and do not commit the switch as part of a feature.

Voice Mode is one exception to this shape. `App/voice/voiceApi.js` calls `voice/session` (GET) and `voice/tool` (POST, JSON body) with `fetch`. It does not use `API.post`, because a tool the server bars by voice answers 403 on purpose, and `API.post` logs the rep out on 403. Keep new voice calls in that file. The other two exceptions are on `TT_80` only: `App/utils/calendarSync.js` posts JSON through `API.post` with `asJson` to `google-calendar/connection` and `google-calendar/sync` (`:757-795`), and `App/utils/clientKeys.js` reads `URL_APP_KEYS` with `fetch` (`:119-122`). Do not add JSON calls anywhere else.

## Versions

`package.json`: React Native 0.84.1, React 19.2.3, Realm ^20.2.0, `@react-navigation/native` ^7.1.33. The app is React Native CLI, not Expo. Voice Mode adds `react-native-webrtc` 124.0.8 and `react-native-incall-manager` 4.3.0, both pinned. incall-manager has a patch in `patches/`. `TT_80` has `@sentry/react-native` ^8.33.0 and no PostHog packages; `Production` has `@sentry/react-native` 8.5.0 with the PostHog packages and no voice packages. `babel.config.js` applies `transform-remove-console` to production bundles on both branches.

## Generate checklist

- [ ] New screen is a class component in the sibling folder.
- [ ] Registered in `App/App.js`.
- [ ] Header, body, button, and modal match [mobile UI](../brains/mobile-ui.md).
- [ ] FormData keys copied from a sibling, not invented. Path checked in [API endpoints](../brains/api-endpoints.md).
- [ ] Loading, empty, and error strings copied from the feature page's Screens block.
- [ ] Credit cost matches [API](../brains/api.md) if the action spends credits.
- [ ] A still from [screenshot review](../screenshots/REVIEW.md) was opened first.
