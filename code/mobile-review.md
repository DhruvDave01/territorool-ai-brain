# Mobile code review

Reviewed 2026-09-22 by reading `/Users/dhruvdave/Dhurv/Project_TerriTool/TerriTool`. Voice Mode was read on 2026-09-29 (branch `VoiceAgent`, commit `49c6ad7f`). When this page and that tree disagree, the tree wins. Hub: [mobile code brain](../brains/mobile-code.md). UI: [mobile UI brain](../brains/mobile-ui.md). Screen files: [mobile screens](mobile-screens.md). Props: [mobile components](mobile-components.md).

## How to add a screen

1. Create a class component under the nearest folder in `App/components/`.
2. Register `<Stack.Screen>` in `App/App.js` on the existing native stack. Leave `headerShown: false`.
3. Use `CustomHeader`, `screenCurvedBody` (radius 25, fill `#F6F7FB`), and `AppButton`.
4. If the screen is a main section, add a footer index only by editing `customfooter`. Dashboard and the Find Leads screen do not show the footer.
5. Load data with `API.post` and a `FormData` body. Read the sibling screen’s `formdata.append` keys and reuse them. Do not invent keys.
6. Persist session in Realm (`App/storage/realm.js`, schema 19). Do not add Redux. A new table raises `schemaVersion` in all three places in that file.
7. While a voice session runs, a screen with no footer shows the voice mini-bar under it (`VoiceMiniBarHost`). Add the screen name to `NO_MINI_BAR` in `voice/VoiceParts.js` only for sign-in and paywall screens.

## Layout of the app

| Path | Role |
|---|---|
| `App/App.js` | Stack registration. 52 screens. `VoiceMiniBarHost` wraps `NavigationContainer`. |
| `App/config/index.js` | `URL_BASE` and path constants. Voice: `VOICE_MODE_ENABLED`, `URL_VOICE_SESSION`, `URL_VOICE_TOOL`, `VOICE_DEMO_URL`. |
| `App/utils/API.js` | `API.post` — multipart, Bearer JWT, session logout on 401/403 |
| `App/utils/contactBuyCredits.js` | 2 / 2 / 1 credit constants |
| `App/utils/Global.js` | Shared mutable state |
| `App/storage/realm.js` | Local DB, schemaVersion 19, JWT row id `"1"`. `VoiceTurn` holds voice history. `deleteJWTToken` clears it and emits `SIGNED_OUT_EVENT`. |
| `App/sessionExpiredEvent.js` | `SESSION_EXPIRED_EVENT`, `FORCE_LOGOUT_TO_LOGIN_EVENT`, `SIGNED_OUT_EVENT` |
| `App/voice/` | Voice Mode session: `VoiceSession.js`, `voiceApi.js` (JSON over `fetch`), `audioSession.js`, `history.js`, `transcript.js`, `useVoice.js` |
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
| `dashboard` | Home, recent activity, calendar, notifications |
| `findLeads` | AI Find Leads chat (`AIFindLeadsChat`) and the older city/ZIP screen (`MultipleAIWaypoint`) |
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
| Home | 1 | Dashboard. Banner opens `ReviewRewardsModal` on the same screen. |
| Find Leads | 2 | `nav.push("AIFindLeadsChat", { fromDashboard: true, latitude, longitude })` |
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

`API.post` sets `Content-Type: multipart/form-data` and `Authorization: Bearer` plus the Realm token. Default is one attempt. Pass `{ maxAttempts }` only when the sibling call already retries.

`URL_BASE` is staging. Do not uncomment `https://app.territool.com/index.php/api/` as part of a feature.

Voice Mode is the one exception to this shape. `App/voice/voiceApi.js` calls `voice/session` (GET) and `voice/tool` (POST, JSON body) with `fetch`. It does not use `API.post`, because a tool the server bars by voice answers 403 on purpose, and `API.post` logs the rep out on 403. Keep new voice calls in that file. Do not add JSON calls anywhere else.

## Versions

`package.json`: React Native 0.84.1, React 19.2.3, Realm ^20.2.0, `@react-navigation/native` ^7.1.33. The app is React Native CLI, not Expo. Voice Mode adds `react-native-webrtc` 124.0.8 and `react-native-incall-manager` 4.3.0, both pinned. incall-manager has a patch in `patches/`.

## Generate checklist

- [ ] New screen is a class component in the sibling folder.
- [ ] Registered in `App/App.js`.
- [ ] Header, body, button, and modal match [mobile UI](../brains/mobile-ui.md).
- [ ] FormData keys copied from a sibling, not invented. Path checked in [API endpoints](../brains/api-endpoints.md).
- [ ] Loading, empty, and error strings copied from the feature page's Screens block.
- [ ] Credit cost matches [API](../brains/api.md) if the action spends credits.
- [ ] A still from [screenshot review](../screenshots/REVIEW.md) was opened first.
