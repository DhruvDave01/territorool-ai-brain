# 22 — Voice Mode (mobile)

## Purpose

A rep turns Voice Mode on for a drive and runs the active route by talking: next stop, last stop, tick a stop off, log or edit an activity, notes, saved-company lookups, lists and routes. V1 is the driving scope only. Finding new leads and looking up new contacts are refused by the assistant and blocked by the voice server (403). Voice never spends credits in V1.

## Status, 2026-09-29

Built in mobile commit `49c6ad7f` on branch `VoiceAgent`. It is not merged to `main`. Review: [live code 2026-09-29](../reviews/live-code-2026-09-29.md).

- Only staging and dev builds show it: `VOICE_MODE_ENABLED = IS_STAGING_OR_DEV_BUILD` in `App/config/index.js`. A production build shows no row, mic, card or mini-bar.
- In those builds the voice server is the reference demo, `VOICE_DEMO_URL = 'https://territool-voice-demo.vercel.app/'`. Laravel does not serve `voice/session` or `voice/tool` yet. There is no route in `routes/api.php`, and staging answered 404 on 2026-09-28.
- QA ran on the iOS simulator against staging on 2026-09-28: `TerriTool/qa/voice-mode-2026-09-28/REPORT.md`. All 22 tools ran. Open issues are listed below.
- A rep guide and quick-start sheet dated 2026-09-29 are below. They describe one uncommitted setting, “Use the phone speaker”.

Design and architecture: `Project_TerriTool/aj_voice_demo/territool-voice-agent-main/MOBILE-VOICE-SPEC.md`. Build plan, and what the build changed from it: [22-Voice-Mode-mobile-plan](22-Voice-Mode-mobile-plan.md).

## How a turn travels

Audio goes between the phone and OpenAI Realtime over WebRTC (`https://api.openai.com/v1/realtime/calls`). The phone asks the voice server for a 10-minute key (`GET voice/session`). It sends each tool call to the same server (`POST voice/tool`, JSON `{ call_id, name, arguments }`, reply `{ call_id, result, for_model }`). The demo server runs the tool against the TerriTool v2 API as that rep. Cards read `result`. The model only hears `for_model`.

`App/voice/voiceApi.js` sends JSON with `fetch`, not `API.post`. A barred tool answers 403 on purpose, and `API.post` would log the rep out on that.

- **Sign-in:** with `VOICE_DEMO_URL` set, it signs in with a `voice_session` cookie (base64 JSON of the Realm JWT and profile). Without it, it sends `Authorization: Bearer`.
- **Time limits:** 30 s for the key, 15 s to connect to OpenAI, 45 s per tool, and 210 s for `create_route` and `create_route_from_list`.

## Where it starts

| Entry | Screen | File | Shown |
|---|---|---|---|
| “Drive with Voice Mode” row | `Dashboard` | `dashboard/index.js`, `DriveWithVoiceRow` | Only while a route is active (`routelist`, `is_active` 1). First row above the six tiles. Sub-line “{route} is active · {n} stops left”. |
| Mic, 44 pt | `BasicRouteDetail` | `route/basic/index.js` | Left slot, beside back. Share and edit fill the right slot. |
| Mic, 44 pt | `ActiveRouteMap` | `activeroutemap/index.js` | Right slot, before the filter button |
| Voice Mode card | `EditStatus` (Settings) | `dashboard/editstatus.js`, `VoiceSettingsCard` | Between the profile card and Tags |
| Mini-bar | Every other screen while a session runs | `VoiceMiniBar` inside `CustomFooter`, or `VoiceMiniBarHost` below the navigator | Not on `VoiceScreen`, `VoiceHistory`, `Login`, `Register`, `SubscriptionGate`, `SubscriptionScreen` |

The Dashboard row opens the first-run sheet over Dashboard if Voice Mode was never turned on. Otherwise it opens `VoiceScreen` with `{ start: true }`, which connects. The header mic and the Settings pill (when Off) open `VoiceScreen` with `{ start: true }`. That screen shows the first-run sheet if Voice Mode was never turned on.

## Screens

### `VoiceScreen` — `voice/VoiceScreen.js`

Layout, top to bottom:

- Header “Voice Mode” with back, and a history button (MaterialCommunityIcons `history`) that opens `VoiceHistory`.
- The curved body, holding the state card (orb, pill, hint), then the exchange (tool chips, transcript, cards), then the action bar.
- `CustomFooter` index 4 with `onVoiceScreen`. Routes is lit, and tapping Routes still opens it, so voice keeps running.

| State | Pill | Hint |
|---|---|---|
| Off | Off | Turn on Voice Mode to start. |
| Connecting | Connecting… | Getting the line ready. |
| Listening | Listening | Just talk. No button to hold. Interrupt any time. |
| Hearing you | Hearing you | Go ahead. I’m listening. |
| Thinking | Thinking… | One moment. While rate-limited: Busy. Trying again in a moment. |
| Working | Working | One line per tool, for example “Checking the route.”, “Logging it.”, “Building the route. This can take a minute.” |
| Speaking | Speaking | Talk over it to interrupt. |
| Paused | Paused | The microphone is off. The session stays open. |
| Error | Connection lost | Tap Reconnect to carry on. Your history is kept. While retrying: Reconnecting. Your history is kept. |

**Buttons:** Off shows “Turn on Voice Mode”. Every other state shows “End” (danger) plus “Pause”, “Resume” when paused, or “Reconnect” on error. There is no push-to-talk and no text box.

**Greeting before the first turn:** “Voice is on, {first name}. You’re on {route}. Ask for the next stop or tell me what happened.” With no active route, it ends “Ask for your routes, or tell me what happened.”

Cards come from the latest exchange only:

| Section | From | Rows | Tap |
|---|---|---|---|
| Tool chips | Every call | `name`, then `name · 1.2 s` with ✓ or ✗ | — |
| LOGGED | `add_activity`, `edit_activity` | “{type} · {company}”, when, quoted note | `ViewCompany` |
| ACTIVITIES | `view_activities` | Today and upcoming, plus past when a company or date was asked. Up to 20 (“20 OF n”). | `ViewCompany` |
| RECENT | `recent_activity` | The Dashboard Recent rows | — Shows only once the server has `recent_activity`. The demo server does not have it. |
| ROUTE / ROUTES | `view_routes` (newest three), `get_active_route`, `view_route` | “{n} stops · {m} left”, button Open | `BasicRouteDetail` |
| IN THE APP | An assistant line matching “can’t search for new leads” or “can’t look up new contacts” | AI Find Leads, “Voice keeps running while you search.”, button Open | `AIFindLeadsChat` |
| CHECK BEFORE REPEATING | A write tool whose request was lost | “That last one may not have saved”, then “The network dropped while “{what was said}” was running. Open the company before saying it again.” | “Open {company}” or “Open Address Book” |
| NEXT STOP / LAST STOP / ACTIVE ROUTE | Otherwise. From `next_waypoint`, `last_stop`, `mark_visited`, `open_route`, or the first unvisited stop. ACTIVE ROUTE while Off. | The route-detail stop row, compact. Right label “{left} OF {total} LEFT” or “VISITED h:mm”. | `WaypointDetail` |

In dev builds, a long press on the orb asks “How many credits do I have?” through the live session (`debugAsk`).

### `VoiceHistory` — `voice/VoiceHistory.js`

- **Header:** “Voice history”, with a trash button. It confirms with “Clear voice history?” / “This removes the Voice Mode chat saved on this phone.” and the buttons Cancel and Clear.
- **Turns:** grouped by day, with headers such as “TODAY · {route}”, “YESTERDAY” or “MON 09/28”.
- **Empty:** “Nothing yet. Try “What’s next?””.
- **Foot:** “Saved on this phone for you only. The latest 500 turns are kept.”
- **Footer:** index 4 with `onVoiceScreen`.

### First-run sheet — `FirstRunSheet`

- **Title:** “Voice for the drive”, sub-line “Talk to TerriTool. Keep your eyes on the road.”
- **Three rows:**
  - “What’s next, and what the last stop was”: “Reads the active route. Ticks stops off when you say you’ve been in.”
  - “Log a visit, call, meeting, reminder or appointment”: ““Nobody there, back next Tuesday at ten” logs both.”
  - “Your chat stays on this phone”: “New leads and contacts stay in the app.”
- **Note:** “TerriTool needs the microphone while Voice Mode is on. The mic stays open, so you never press to talk.”
- **Buttons:** “Not now” (danger) and “Turn on Voice Mode”. The microphone permission is asked on that button, never at launch.

### Mini-bar — `VoiceMiniBar`

- **Dot:** teal while live, grey when paused, red when the connection is lost.
- **Text:** “Voice on · {state}”, then “Next: {n} · {stop}”.
- **Buttons:** pause, resume or reconnect, and an expand chevron that opens `VoiceScreen`.
- **Placement:** on a screen with `CustomFooter`, it docks inside the footer above the tabs. On a screen without one, `VoiceMiniBarHost` puts it below the navigator and gives it the bottom safe area, so it never covers the screen.

### Settings card — `VoiceSettingsCard`

- **Header:** “Voice Mode” with an On / Off pill. Turning it Off ends the session.
- **“Keep listening with the screen off”:** “Runs as background audio while you drive”. Default on.
- **“Start when I open a route”:** “Only for the active route”. Default off.
- **“Voice history”:** “500 latest turns · this phone only”, with a Clear button. It uses the same confirm as the history screen.
- **Storage:** AsyncStorage `voice.settings.v1`.

## Session rules — `App/voice/VoiceSession.js`

- **One session:** it serves the whole app and lives outside navigation. Opening a card or another screen never ends it.
- **Open mic:** Pause turns the mic track off, cancels the reply, and keeps the session. Talking over the assistant interrupts it.
- **Tool order:** tool calls run one at a time, in order. The model context is cut to 12 items (`history.js`).
- **Rate limit:** wait the seconds OpenAI names plus 300 ms (5 s if it names none), then ask again.
- **Drops and renewal:** a drop longer than 5 s gets one silent reconnect, then “Connection lost” with Reconnect. At 55 minutes the key is renewed and the session reconnects. The transcript carries on.
- **Lost writes:** when the request for a write tool is lost, the model is told the result is unknown, and CHECK BEFORE REPEATING appears. The write tools are `set_company_status`, `add_contact`, `add_note`, `create_list`, `add_activity`, `edit_activity`, `create_route`, `create_route_from_list`, `open_route` and `mark_visited`.
- **Interruptions:** a call, Siri or another app taking the audio pauses the session, and it resumes when they finish. With “Keep listening” off, going to the background pauses it too.
- **Audio output:** the loudspeaker unless Bluetooth, CarPlay or a headset is connected. Never the earpiece. This is incall-manager media `video`.
- **Android screen off:** a notifee microphone foreground service keeps listening. Its notification reads “Voice Mode is on” / “TerriTool is listening while you drive.” on the channel “Voice Mode”.
- **History storage:** Realm `VoiceTurn`, scope `${URL_BASE}:${user_id}`, latest 500 kept. Signing out on any path deletes every `VoiceTurn` row on the phone and ends the session (`SIGNED_OUT_EVENT` from `deleteJWTToken`).

## Tools the voice server allows (V1)

Twenty-two, from `local-demo/server/brain.mjs` `VOICE_TOOLS`: `get_credits`, `search_companies`, `view_company`, `set_company_status`, `add_contact`, `add_note`, `get_notes`, `create_list`, `add_activity`, `view_activities`, `edit_activity`, `create_route`, `create_route_from_list`, `view_routes`, `view_route`, `open_route`, `get_active_route`, `next_waypoint`, `last_stop`, `mark_visited`, `view_lists`, `view_list`.

Anything else answers 403 “{name} is not in the voice whitelist.” or “{name} is not allowed by voice.” (`local-demo/server/tools.mjs`).

## Rules that shape the screens

- No push-to-talk. The mic stays open, and Pause is the only control. Talking over the assistant interrupts it.
- Cards are drawn from the full tool JSON the phone has. The model only hears the trimmed shape.
- “What’s next” always calls `next_waypoint`. Never answered from memory.
- Deletes, route edits, list edits, sharing and billing are barred by voice (403 on the server).
- Voice never spends credits in V1.
- A new screen without a footer gets the mini-bar under it. Add the screen name to `NO_MINI_BAR` in `VoiceParts.js` only if it must never show a session (sign-in and paywall screens).

## Known issues

From the QA report of 2026-09-28 and the code:

1. Unticking a visit (`mark_visited` with `visited: false`) fails on the demo server path, and on the web reference too.
2. After another client switches the route, the phone’s cached route can disagree with `get_active_route`. `applyStopResult()` does not refresh for that tool. `open_route` does.
3. There is no “Open the route” card after `create_route` or `create_route_from_list`.
4. A contact-lookup refusal hands off to AI Find Leads, because one refusal matcher covers both. It is not a contact flow.
5. Not certified: real speech, road noise, Bluetooth and CarPlay, calls, screen lock, background audio, and the 55-minute renewal.
6. `GEMINI_API_KEY` is still hard-coded in `App/config/index.js`. The plan item to move it is open.

## Screens (strings)

Copy these strings. Do not write new ones.

| Surface | Screen | File / still | Primary action | Loading | Empty | Error |
|---|---|---|---|---|---|---|
| Mobile | `VoiceScreen` | `voice/VoiceScreen.js` · [listening](../screenshots/mobile-owner/VoiceMode/04-mobile-answers.jpg) | Talk; Pause / Resume; End | Pill “Connecting…”, hint “Getting the line ready.” | Greeting bubble before the first turn | Pill “Connection lost” and the hints above. The detail line can also read “No signal right now. Tap Reconnect when you have one.”, “Voice took too long to connect.”, “Voice could not start ({status}).” or “Sign in again to use Voice Mode.” |
| Mobile | `VoiceHistory` | `voice/VoiceHistory.js` · [history](../screenshots/mobile-owner/VoiceMode/16-fixed-clean-history.jpg) · [empty](../screenshots/mobile-owner/VoiceMode/02-history-empty.jpg) | Clear | — | “Nothing yet. Try “What’s next?”” | — |
| Mobile | First-run sheet | `voice/VoiceParts.js` `FirstRunSheet` | Turn on Voice Mode | Button spinner while the mic is asked | — | OS settings prompt: “Turn on the microphone” / “Microphone access is turned off for TerriTool. Open Settings to enable it, then return to the app.” |
| Mobile | Mini-bar | `VoiceMiniBar` · [on route detail](../screenshots/mobile-owner/VoiceMode/15-auto-start.jpg) | Pause / Resume / Reconnect; expand | “Voice on · Connecting” | — | “Voice on · Connection lost” |
| Mobile | Settings card | `VoiceSettingsCard` · [Settings](../screenshots/mobile-owner/VoiceMode/14-settings-enabled.jpg) | On / Off; two switches; Clear | — | — | — |

## Shipped stills

Captured on the iOS simulator against staging during QA on 2026-09-28. Folder: [screenshots/mobile-owner/VoiceMode](../screenshots/mobile-owner/VoiceMode). They are 368 × 800. The “Refreshing…” strip at the top of several is the dev build’s refresh banner. It is not part of the design.

| Still | Shows |
|---|---|
| [04-mobile-answers](../screenshots/mobile-owner/VoiceMode/04-mobile-answers.jpg) | Listening; a contact refusal; IN THE APP hand-off; LAST STOP “VISITED 8:02”; End / Pause; footer 4 lit |
| [09-route-switch-result](../screenshots/mobile-owner/VoiceMode/09-route-switch-result.jpg) | Speaking; an “open the route” answer; NEXT STOP “1 OF 2 LEFT” |
| [07-live-mobile-write](../screenshots/mobile-owner/VoiceMode/07-live-mobile-write.jpg) | Speaking; a long reply after several writes |
| [11-reconnected](../screenshots/mobile-owner/VoiceMode/11-reconnected.jpg) | Greeting “Voice is on, Ann. You’re on …”; NEXT STOP “92 OF 99 LEFT” |
| [10-connection-error](../screenshots/mobile-owner/VoiceMode/10-connection-error.jpg) | End / Reconnect. The refresh strip covers the state card. |
| [12-unknown-write](../screenshots/mobile-owner/VoiceMode/12-unknown-write.jpg) | CHECK BEFORE REPEATING with “Open CineOpera” |
| [16-fixed-clean-history](../screenshots/mobile-owner/VoiceMode/16-fixed-clean-history.jpg) | Voice history, “TODAY · 123-XYZ 1789123946” |
| [02-history-empty](../screenshots/mobile-owner/VoiceMode/02-history-empty.jpg) | Voice history, empty |
| [14-settings-enabled](../screenshots/mobile-owner/VoiceMode/14-settings-enabled.jpg) | Settings Voice Mode card: On, both switches on, Clear |
| [15-auto-start](../screenshots/mobile-owner/VoiceMode/15-auto-start.jpg) | Route detail with the mic beside back; mini-bar “Voice on · Listening” / “Next: 6 · CineOpera” docked above the footer |

## Rep guide and quick-start sheet, 2026-09-29

Two files, supplied on 2026-09-29 and checked against the code the same day:

- [Voice Mode guide](voice-mode-guide-2026-09-29.pdf): a 7-page A4 PDF, “Voice Mode, from start to finish”, for field reps, product teams and engineering. Page 1 is the quick-start sheet. Pages 2–7 cover the nine states, six journeys, the architecture, settings and release limits.
- [Quick-start sheet](voice-mode-guide-2026-09-29-quick-start.jpg): page 1 on its own, 682 × 1024. It reads “TerriTool Voice Mode · Your field day, one conversation.” It has a speaker tip, four steps (Turn it on, Speak naturally, Hear it. See it., Pause or finish), a state strip (Listening, Working, Speaking, Paused), and the line “Voice stays on as you move between TerriTool screens. New lead and contact searches happen in the app.”

Use them for help, onboarding and sales copy about Voice Mode. They are not UI specs. The phones on the sheet are generated illustrations with sample data (Harbor HVAC, Anaheim Tuesday). For pixels, use the shipped stills above.

The six journeys in the guide. The guide says its phrases are illustrative, and that a successful backend result decides whether a change was saved.

| Journey | Example phrases | Result |
|---|---|---|
| 01 First use to first answer | “What’s my next stop?” | A spoken answer and the next-stop card |
| 02 Prepare for a visit, then log it | “Tell me about CineOpera.” “Read its latest notes.” “Log a visit at CineOpera. The owner asked for pricing.” “Mark CineOpera visited on my active route.” | A LOGGED card, then the next stop refreshes. Logging and marking visited are separate operations. |
| 03 Save a follow-up and review it | “Find my saved company CineOpera.” “Add a note to CineOpera: interested in the premium package.” “Add a reminder for CineOpera on October 6 at 10 AM to follow up on pricing.” “What activities are scheduled for CineOpera?” | The note and the activity are saved on the company |
| 04 Build a route from saved accounts | “Create a list called Tuesday Visits with CineOpera and Baroo.” “Create a route from Tuesday Visits, starting at CineOpera and ending at Baroo.” “Open the Tuesday Visits route.” | Working while the route builds. Ask to show the route to get its card. |
| 05 Move between voice and app screens | “Find new bakeries in Anaheim.” | A refusal, then AI Find Leads › Open. The mini-bar keeps voice running. |
| 06 Screen off, interruption or lost signal | — | Pause on interruption, Reconnect, CHECK BEFORE REPEATING. A reconnect starts a fresh model context. |

Checked against the code on 2026-09-29. Both files match commit `49c6ad7f` and the QA report, except in five places:

1. **Phone speaker:** the guide’s “Use the phone speaker” setting (default on) and the sheet’s “Use your phone speaker & mic” banner describe uncommitted work (below). The committed app has no such setting.
2. **Onboarding sentence:** the guide’s “For the best Voice Mode experience, use your phone’s speaker and microphone. Bluetooth or car audio may affect recognition and response time.” is a suggestion. The app’s own line, also uncommitted, is “Voice hears you better than over Bluetooth or car audio. Change it in Settings.”
3. **Sheet step 3:** it shows the hint “Note saved for Harbor HVAC.” and a “Note saved · Send pricing” row. The app has neither. While speaking, the hint is “Talk over it to interrupt.” `add_note` shows only its tool chip and the spoken answer.
4. **Stop rows on the sheet:** they use a map-pin icon. The app’s stop row shows the route-order number and “Not visited yet”.
5. **Error state:** the guide calls it “Error”. The pill on screen reads “Connection lost”.

The state strip colours on the sheet match `TONES`: Listening teal, Working amber, Speaking blue, and Paused as a red pill on a grey orb.

### Phone speaker setting — uncommitted on 2026-09-29

This is in the mobile working tree, not in `49c6ad7f` (files `VoiceParts.js`, `VoiceScreen.js`, `VoiceSession.js`, `audioSession.js`). The strings are recorded here because the guide describes them. Treat them as live only once they are committed.

- **Settings switch:** “Use the phone speaker”, default on (`settings.speaker`), test ID `screen.editStatus.voiceSpeaker`.
  - Sub-line when on: “Voice hears you better than over Bluetooth or car audio”.
  - Sub-line when off: “Uses Bluetooth when connected — responses may be a little slow”.
- **First-run sheet:** a fourth row, “Uses the phone speaker and mic” / “Voice hears you better than over Bluetooth or car audio. Change it in Settings.”
- **Hints while Bluetooth is connected:**
  - The Listening hint reads “Using the phone mic and speaker. Just talk.” with the setting on, or “Bluetooth is on — responses may be a little slow.” with it off.
  - The greeting adds “Using the phone mic and speaker to talk — Bluetooth is connected.” or “Bluetooth is on — responses may be a little slow.”
- **Behaviour:** with the setting on, `InCallManager.setForceSpeakerphoneOn(true)` keeps the phone’s own speaker and mic even with Bluetooth connected. The code comment says Voice mishears over Bluetooth’s phone-call audio.
- **Also uncommitted:** a microphone permission check on every connect the rep starts.

## Design renders, 2026-09-28 (before the build)

Rendered with [render a still](../methods/render-still.md) before the code existed. Where a render and a shipped still differ, the shipped still wins. There are no shipped stills yet of the Dashboard row, the first-run sheet, the Working and Paused states, or the map mini-bar. Use these renders for those, with the strings above.

Chrome is cropped from the owner stills (Settings 19.37.23 for the header and footer, Route detail 20.07.14 for the Routes footer, Map 20.16.46, Dashboard 19.36.33). Only the voice regions are drawn, with the two DIN files and the app icons from `assets/`.

| Still | Screen | Region |
|---|---|---|
| [Overview sheet](voice-mode-mobile-all.png) | the eleven renders below, at once | |
| [dashboard-entry](voice-mode-mobile-dashboard-entry.png) | `Dashboard` | “Drive with Voice Mode” row, shown only while a route is active. The live row is the first row above the six tiles. |
| [first-run-voice-screen](voice-mode-mobile-first-run-voice-screen.png) | sheet over `VoiceScreen` (Off) | The first-run sheet. Opened from a route header or Settings. Over Dashboard it is the same sheet; there is no separate render of that variant. |
| [listening](voice-mode-mobile-listening.png) | `VoiceScreen` | State card, transcript, next-stop row, End / Pause |
| [working](voice-mode-mobile-working.png) | `VoiceScreen` | Tool chip while a call runs; last-stop row. The live pill reads “Working”, and the hint line carries the tool. |
| [logged](voice-mode-mobile-logged.png) | `VoiceScreen` | One sentence logs a Visit and an Appointment, then the next stop |
| [paused](voice-mode-mobile-paused.png) | `VoiceScreen` | Mic off, session kept, Resume. The live pill reads “Paused”. |
| [refusal](voice-mode-mobile-refusal.png) | `VoiceScreen` | Lead-search refusal with the hand-off card to AI Find Leads |
| [connection-lost](voice-mode-mobile-connection-lost.png) | `VoiceScreen` | “May not have saved” card, Reconnect |
| [map-minibar](voice-mode-mobile-map-minibar.png) | `ActiveRouteMap` | Mini-bar at the bottom while a session runs elsewhere |
| [history](voice-mode-mobile-history.png) | `VoiceHistory` | Turns grouped by day, saved on this phone only |
| [settings](voice-mode-mobile-settings.png) | `EditStatus` | Voice Mode card between the profile card and Tags |

## Consistency — Voice Mode

- **KNOWN (shipped)** — tones and card style are in `voice/voice.styles.js`. The table is on [mobile UI](../brains/mobile-ui.md#voice-mode).
  - Primary is `#124ac6`, the surface is `#F6F7FB`, and the danger button is `#CF5B51`.
  - The rep bubble is primary blue. The assistant bubble is white with a `sparkles` avatar.
- **KNOWN (shipped)** — the stop row reuses `BASIC_ROUTE_COMPANY_ROW` from `route/basic/index.styles.js`.
- **RESOLVED** — the icons are Ionicons `mic-outline`, `mic`, `mic-off`, `pause`, `play`, `refresh`, `sparkles`, `chevron-up`, `trash-outline`, and MaterialCommunityIcons `history`, `wifi-off`, `map-marker-path`.
- **RESOLVED** — the Android notification copy is above.
- **RESOLVED** — the footer on the voice screens is index 4 with `onVoiceScreen`.

## Code map

| File | Does |
|---|---|
| `App/voice/VoiceSession.js` | The one session: connect, events, tool loop, pause, end, reconnect, renewal, settings, history, active route |
| `App/voice/voiceApi.js` | `session()` and `tool()`, JSON over `fetch`, time limits |
| `App/voice/audioSession.js` | incall-manager output and interruptions; Android microphone foreground service |
| `App/voice/history.js` | Keeps the model context at 12 items |
| `App/voice/transcript.js` | Places rep and assistant text by item id |
| `App/voice/useVoice.js` | `useSyncExternalStore` over the session, for screens and the mini-bar |
| `App/components/voice/VoiceScreen.js` | The voice screen and its cards |
| `App/components/voice/VoiceHistory.js` | The history screen |
| `App/components/voice/VoiceParts.js` | Mini-bar and its host, header mic, Dashboard row, first-run sheet, Settings card, `ActionButton`, `Bubble`, `MicBadge`, `openVoice` |
| `App/components/voice/voice.styles.js` | `VOICE` and `TONES` tokens, card, outline button, orb |
| `App/storage/realm.js` | `VoiceTurn`, `getVoiceTurns`, `saveVoiceTurn`, `clearVoiceTurns`; schema 19 |
| `App/utils/mediaPermissionAccess.js` | `ensureMicrophonePermission()` |
| `qa/voiceSession.regression.test.js` | Committed regression tests for history clearing |
| `.maestro/voice-mode-ios.yaml`, `.maestro/voice-mode-android.yaml` | First-run sheet, microphone prompt, Pause / Resume / End |
