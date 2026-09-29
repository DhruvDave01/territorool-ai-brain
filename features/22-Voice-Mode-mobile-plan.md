# 22 — Voice Mode, mobile build plan

Written 2026-09-28. Scope is the React Native app only: `/Users/dhruvdave/Dhurv/Project_TerriTool/TerriTool`.

- Spec: `Project_TerriTool/aj_voice_demo/territool-voice-agent-main/MOBILE-VOICE-SPEC.md`
- Reference client: `local-demo/public/app.js` in the same repo
- Screens and stills: [22 — Voice Mode](22-Voice-Mode.md)

Rule from the spec: copy, do not redesign.

## Status, 2026-09-29

Mobile commit `49c6ad7f` on branch `VoiceAgent` builds Phases 0 to 4 and part of Phase 5. What shipped is on [22 — Voice Mode](22-Voice-Mode.md). This plan is kept below as written on 2026-09-28. Review: [live code 2026-09-29](../reviews/live-code-2026-09-29.md).

| Phase | State | What differs from the plan |
|---|---|---|
| 0 — audio stack | Built | Both libraries are in, and incall-manager is patched for the iOS `AudioInterruption` event. There is no separate dev test screen. In dev builds a long press on the orb asks the credits question instead. Not yet tested on real phones or in a car. |
| 1 — voice core | Built | All six files are in `App/voice/`, with the time limits above. Tests are `qa/voiceSession.regression.test.js` (committed) and `__tests__/voiceSession.test.js` (on disk only, because `.gitignore` excludes `__tests__`). |
| 2 — screen and cards | Built, changed | The pill reads the bare state (“Working”, “Paused”), and a hint line carries the rest. The stop row has no Navigate button and opens `WaypointDetail`. Activity rows open `ViewCompany`, not `CustomCompany`. Added: ACTIVITIES, RECENT, ROUTES, IN THE APP, CHECK BEFORE REPEATING. |
| 3 — phone realities | Built in code | Info.plist, background audio, Android permissions, the notifee microphone service, and `ensureMicrophonePermission()` are in. The Android notification reads “Voice Mode is on” / “TerriTool is listening while you drive.” The real-phone checks have not been run. |
| 4 — entry points | Built | Dashboard row, both route-header mics, mini-bar, first-run sheet, Settings card, `VoiceHistory`, Realm `VoiceTurn` at schema 19. Logout runs through the new `SIGNED_OUT_EVENT` from `deleteJWTToken`, which covers every path. |
| 5 — release | Part | Done: the flag (`VOICE_MODE_ENABLED`), both Maestro flows, and `captureSentryError(…, 'voice', …)`. Open: the Laravel `voice/session` and `voice/tool` endpoints (the app uses `VOICE_DEMO_URL` until then), store paperwork, the field test, and moving `GEMINI_API_KEY` out of `App/config/index.js`. |

Defaults, as decided in code:

1. **Mini-bar placement:** both places. Inside `CustomFooter` above the tabs, and below the navigator on screens without a footer (`VoiceMiniBarHost`).
2. **Footer on the voice screen:** index 4, with `onVoiceScreen` so tapping Routes still opens it.
3. **Auto-start:** a Settings switch, “Start when I open a route”, default off.
4. **Mini-bar on sign-in and paywall screens:** no (`NO_MINI_BAR`).
5. **Android notification wording:** decided, as above.
6. **Text fallback:** none. The dev-only `debugAsk` is for testing.

## How the pieces talk

The phone streams audio to and from OpenAI over WebRTC. OpenAI hears the rep, picks a tool, and speaks the answer. The phone asks Laravel for a 10-minute key (`voice/session`) and sends each tool call to Laravel (`voice/tool`). Laravel runs the MCP tool code in `app/UserMcp/Services/Tools`, which runs the existing `/api/v2` endpoints internally through `CustomerApiClient`, signed in as that rep.

The phone never calls the MCP server, the database, or the web demo in production.

## Outside this plan: what the app needs from the server

| Endpoint | Request | Response |
|---|---|---|
| `GET api/v2/voice/session` | Bearer login token | `client_secret`, `expires_at`, `model`, `rep` (`first_name`, `credits`), `history_scope`, `context`, `tool_names` |
| `POST api/v2/voice/tool` | Bearer login token, JSON `{ call_id, name, arguments }` | `{ call_id, result, for_model }` |

Rules the app depends on:

- A blocked tool returns HTTP 403 in that same body shape. It must not come back as a Laravel error with `status_code: 403` in the body. The app's request helper logs the rep out on that.
- The same `call_id` within 10 minutes returns the first answer. A reused `call_id` with different arguments is 409. A busy server is 503. A missing or invalid `call_id` is 400.
- These shapes are the demo server's (`server/index.mjs`, `server/tool-requests.mjs`). Laravel keeps them.

Until the Laravel endpoints are on staging, Phases 0 and 1 run against the voice demo server: its Vercel deployment `territool-voice-demo` if it is up, or a local run for the iOS simulator. The demo signs in with email and password and keeps a cookie. That needs a throwaway sign-in in dev builds only, with the staging test account. It never ships.

V1 tools the app will see (`server/brain.mjs`, `VOICE_TOOLS`): `get_credits`, `search_companies`, `view_company`, `set_company_status`, `add_contact`, `add_note`, `get_notes`, `create_list`, `add_activity`, `view_activities`, `edit_activity`, `create_route`, `create_route_from_list`, `view_routes`, `view_route`, `open_route`, `get_active_route`, `next_waypoint`, `last_stop`, `mark_visited`, `view_lists`, `view_list`.

## Phase 0 — Prove the audio stack (go/no-go)

Build:

- Add `react-native-webrtc` 124.0.8 and `react-native-incall-manager` 4.3.0, then `pod install`.
- Neither library is built as a New Architecture module. This app runs React Native 0.84.1 with the New Architecture on, so they run through React Native's compatibility layer. Build both platforms before anything else.
- A dev-only test screen: get a key, connect, and answer "How many credits do I have?" out loud.

Test on two real phones:

- Speakerphone. Does the assistant hear itself and stop mid-sentence?
- A Bluetooth headset or a car.
- Screen lock.
- An incoming call.

Done when both platforms answer out loud on speaker without cutting themselves off.

If a library fails here, stop and choose a fix before building screens.

## Phase 1 — Voice core in `App/voice/`

| File | Port of | Does |
|---|---|---|
| `voiceApi.js` | — | `session()` and `tool()`. Sends the Realm login token (`storage.getJWTToken('1')`) with JSON bodies. Does not use `API.post`. |
| `history.js` | `public/history.mjs` | Keeps the model context at 12 items. Copy as is; it has no browser code. |
| `transcript.js` | `public/transcript.mjs` | Places rep and assistant text by item id. Copy as is. |
| `VoiceSession.js` | `public/app.js` | One shared session outside navigation: connect, event handling, tool loop, pause, end, reconnect. |
| `audioSession.js` | — | incall-manager: loudspeaker unless Bluetooth or CarPlay is connected, never the earpiece. Pause on interruption. |
| `useVoice.js` | — | Lets screens and the mini-bar read the session state. |

`voiceApi.js` rules:

- Time limits: 30 s for the key, 15 s to connect to OpenAI, 45 s per tool, 210 s for `create_route` and `create_route_from_list`.
- Write them without `AbortSignal.any` or `AbortSignal.timeout`. The app's abort library (`abort-controller` 3.0.0) has neither.
- No global error toasts. A tool 403 never runs the session-expired logout.

Connect sequence, same as the web page:

1. `GET voice/session`.
2. `new RTCPeerConnection()`. Open the mic with `mediaDevices.getUserMedia`, with echo cancellation, noise suppression, and auto gain on. Add the track. Open the `oai-events` data channel.
3. Send the offer to `https://api.openai.com/v1/realtime/calls` with the key, and set the answer it returns.
4. When the data channel opens, the state is Listening. Remote audio plays by itself; incall-manager picks the output.

Events the web page handles, and the phone must too:

- `session.created`
- `input_audio_buffer.speech_started`, `input_audio_buffer.speech_stopped`
- `output_audio_buffer.started`, `output_audio_buffer.stopped`, `output_audio_buffer.cleared`
- `response.created`, `response.done`, `response.output_audio_transcript.delta`
- `conversation.item.added`, `conversation.item.created`
- `conversation.item.input_audio_transcription.delta`, `.completed`, `.failed`
- `error`, including `rate_limit_exceeded`

Events it sends: `conversation.item.create`, `conversation.item.delete`, `response.create`, `response.cancel`, `output_audio_buffer.clear`.

Tool loop:

- On `response.done`, run each `function_call` one at a time, in order.
- Send each result's `for_model` back as `function_call_output`. After the last one, send `response.create`.
- Cards use `result`. The model only ever sees `for_model`.
- If a tool request throws, tell the model the result is unknown and not to retry, and show the "may not have saved" card.
- On `rate_limit_exceeded`, wait the seconds the message names plus 300 ms (5 s if none), then send `response.create` again.

Session control:

- Pause turns the mic track off, sends `response.cancel` and `output_audio_buffer.clear`, and keeps the session.
- A connection drop longer than 5 s releases the mic and the connection, tries one silent reconnect, then shows the error state with Reconnect.
- At 55 minutes, get a new key and reconnect. The transcript continues.

Config: add `URL_VOICE_SESSION = 'voice/session'` and `URL_VOICE_TOOL = 'voice/tool'` to `App/config/index.js`.

Tests (Jest, beside `__tests__/bulkContactFetch.test.js`): history trimming, transcript order, tool calls run in order, and a thrown tool request that produces the "may not have saved" card.

Done when a phone on staging answers the credits question through this code.

## Phase 2 — Voice screen and result cards

Register `VoiceScreen` in `App/App.js`. Chrome is `CustomHeader`, the curved body from `App/styles/screenCurvedBody.js`, and `AppButton`. Pause is the main button and End sits beside it. No push-to-talk and no text box in V1.

States, as the orb and status pill show them:

| State | Pill |
|---|---|
| Off | First-run sheet, or Turn on |
| Connecting | Connecting… |
| Listening | Listening |
| Hearing you | Hearing you |
| Thinking | Thinking… |
| Working | Working · checking the route |
| Speaking | Speaking |
| Paused | Paused · mic is off |
| Error | Connection lost |

Cards, drawn from the full `result`:

| Card | From | Buttons |
|---|---|---|
| Stop | `next_waypoint`, `last_stop`, `mark_visited`, `open_route` | Navigate (`react-native-map-link`), Details (`WaypointDetail`) |
| Activity | `add_activity`, `edit_activity` | Opens `CustomCompany` |
| Route | `view_routes`, `get_active_route`, `view_route` | Open (`BasicRouteDetail`) |
| Hand-off | A lead or contact refusal | Open AI Find Leads |
| May not have saved | A tool request that threw after a possible write | Opens the company |

The spec lists the Stop card for `next_waypoint`, `mark_visited`, and `open_route`. `last_stop` is added here because the working still shows a last-stop row.

Opening a card never ends the session. `App.js` creates its navigation ref with `useNavigationContainerRef()`. Pass it to `VoiceSession` so cards and the mini-bar can open screens.

Done when the spec's drive loop works: next stop, last stop, "I went in…", all five activity types, editing an activity, and opening a route by name. Cards render from `result`.

## Phase 3 — Phone realities

iOS (`ios/TerriTool/Info.plist`):

- Rewrite `NSMicrophoneUsageDescription`. Today it says "TerriTool needs microphone access for video capture." Spec text: "TerriTool listens while Voice Mode is on so you can run your route hands-free".
- Add `audio` to `UIBackgroundModes`.

Android (`android/app/src/main/AndroidManifest.xml`):

- Add `RECORD_AUDIO`, `MODIFY_AUDIO_SETTINGS`, `FOREGROUND_SERVICE`, and `FOREGROUND_SERVICE_MICROPHONE`.
- Declare notifee's foreground service with `foregroundServiceType="microphone"`, and register it in the root `index.js`. notifee is installed; today it only shows push notifications (`App/utils/FCMHelper.js`).
- Show a persistent notification while voice runs, gated by the setting "Keep listening with the screen off" (default on).
- Check whether car Bluetooth on Android 12 and later also needs `BLUETOOTH_CONNECT`.

Microphone permission:

- Add `ensureMicrophonePermission()` to `App/utils/mediaPermissionAccess.js`, next to `ensureCameraPermission()`.
- Ask from the first-run sheet's button, never at app launch.
- On denial, use `confirmOpenAppSettings` from `App/utils/permissionSettingsAlert.js`.

Behavior to test:

- A phone call, Siri, or another app taking audio pauses the session. When it ends, resume silently.
- Airplane mode on and off: one silent reconnect, then Reconnect.
- The 55-minute renewal.
- Open Scan Card and the QR scanner while voice runs. Both open the camera and may take the audio session.

Done when the spec's M3 checks pass on two phones in a car, and replies start within 2 to 4 seconds.

## Phase 4 — Entry points, history, settings

- **Dashboard** (`App/components/dashboard/index.js`): the "Drive with Voice Mode" row under the credits banner, only while a route is active. Read the active route from `routelist` (`is_active`, `remainingpoints`). Never call `getuseractiveroute`; it takes about 9 seconds.
- **Route headers:** a 44 pt mic button in `ActiveRouteMap` (`App/components/activeroutemap/index.js`) and `BasicRouteDetail` (`App/components/route/basic/index.js`).
- **Mini-bar:** state dot, "Voice on · Listening", Pause, and expand. Shown on every other screen while a session runs.
- **First-run sheet:** "Voice for the drive", in the two variants the stills show: over Dashboard, and over the voice screen.
- **Settings** (`App/components/dashboard/editstatus.js`): a Voice Mode card between the profile card and Tags. It has the on switch, "Keep listening with the screen off", "Start when I open a route", and Voice history with Clear. The spec also lists a separate `VoiceSettings` screen; the Settings still covers it with this card.
- **`VoiceHistory` screen:** turns grouped by day, saved on this phone only.
- **Realm:** a `VoiceTurn` table (`scope`, `itemId`, `who`, `text`, `at`), scope `${URL_BASE}:${user_id}`, latest 500 kept. Add it to the schema list and raise `schemaVersion` from 18 to 19 in all three places in `App/storage/realm.js`.
- **Logout:** end the session and clear history on every path. That covers `SESSION_EXPIRED_EVENT` and `FORCE_LOGOUT_TO_LOGIN_EVENT` in `App/App.js`, and the logout code in `dashboard/index.js` and `editstatus.js`.

Done when the spec's M4 list works.

## Phase 5 — Release

- Keep voice behind a flag. Turn it on first for staging and dev builds (`IS_STAGING_OR_DEV_BUILD` in `App/config/index.js`).
- Add a Maestro flow in `.maestro/` for the first-run sheet, the permission prompt, and Pause. Speech itself is tested by hand.
- Report voice failures with `captureSentryError`, like the other screens.
- Store paperwork:
  - The App Store privacy label has to cover the audio sent to OpenAI.
  - The Play Console needs the foreground-service declaration for the microphone. The app targets Android SDK 36.
- Field test: three reps, one day each. Every bad turn becomes a new eval in `voice-brain/evals/` on the server.

Done when the spec's M5 field test passes.

## Defaults unless decided otherwise

1. **Mini-bar placement:** render it at the app root, not only inside `customfooter`. Dashboard and AI Find Leads have no footer, so a footer-only mini-bar would disappear there.
2. **Footer on the voice screen:** keep footer tab 4, as the stills show, so the rep can open Routes and leave voice running. `AIFindLeadsChat` has no footer, so this is a choice, not a copy.
3. **Auto-start when a route opens:** off in V1.
4. **Mini-bar on the Login and Subscription screens:** no. Logout ends the session.
5. **Android notification wording and icon:** not decided.
6. **Text fallback:** not in V1.

## Also

- Do not merge the `AIVOICE` branch. It is a June design on Gemini with `@react-native-voice/voice` and `react-native-tts`, and the spec says not to add those packages.
- While `App/config/index.js` is open, move the hardcoded `GEMINI_API_KEY` out of it.

## Files this plan touches

New:

- `App/voice/voiceApi.js`, `history.js`, `transcript.js`, `VoiceSession.js`, `audioSession.js`, `useVoice.js`
- The voice screen, the history screen, the mini-bar, the first-run sheet, and the result cards

Changed:

- `package.json`, `ios/Podfile.lock`
- `ios/TerriTool/Info.plist`, `android/app/src/main/AndroidManifest.xml`
- `index.js`, `App/App.js`, `App/config/index.js`, `App/storage/realm.js`
- `App/utils/mediaPermissionAccess.js`
- `App/components/dashboard/index.js`, `App/components/dashboard/editstatus.js`
- `App/components/activeroutemap/index.js`, `App/components/route/basic/index.js`
- `App/components/customfooter/index.js`, only if the mini-bar lives there
