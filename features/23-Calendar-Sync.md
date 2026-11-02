# 23 — Calendar Sync

## Purpose

A rep copies their scheduled meetings and appointments from TerriTool into their own Google Calendar. The copy goes one way, TerriTool to Google; nothing in Google comes back. It runs only when the rep presses Sync, or right after the phone connects. There is no schedule.

## Who

Sales Agent and Business Sales Agent, for their own activities. The web entry is on the classic rep home, `/dashboard`. The manager portal and Admin HQ have no calendar entry; outside the classic dashboard, nothing links to the calendar routes.

## Status, 2026-11-02

Read against web `master` `d3f75449` and `beta_react` `929f0c7f`, and mobile `TT_80` `daf50eeb` and `Production` `6973a30d`, on 2026-11-02. Source: [live code, 2026-11-02](../reviews/live-code-2026-11-02.md).

| Platform | Branch | State |
|---|---|---|
| Classic web | `master` (production), also `beta` and `beta_react` | Built in `9ab33695`, `8ac441de`, `8e41f587`, `4c9acb45` (22 Oct), `f1e78e6c` and `f88d3fe2` (26 Oct). The dashboard “Calendar” button was removed in `cce3594d` and restored in `9c971fcd` (both 27 Oct). `master` got the code in `994d669a` (27 Oct) with the button removed, and the button back in `d3f75449` (28 Oct). The calendar files are the same on `master` and `beta_react`. |
| Mobile | `TT_80`, `Calendar_Google_Microsoft` | Google sign-in and Sync on the `CalendarActivity` screen (`7cd1ccf6`, `4b502954`, `d9c95e73`, `72c09a06`, `7c389031`, 15 to 28 Oct). Store users do not have it yet. |
| Mobile | `Production` (store build) | The `CalendarActivity` screen only, with no sync. The screen has existed since `ce1d77c3` (May 2026). |

Whether the production database has the two calendar tables is not verified. The repo has no migration for them (see Data).

## What a sync does

The server does the work on both platforms: `App\Services\GoogleCalendarSync::push()`.

- **Sends:** the signed-in user’s `company_notes` rows whose type is Meeting or Appointment (case and surrounding spaces ignored) and that have a `date_time` (`GoogleCalendarSync.php:519-532`).
- **Event:** title “{company} — {type}”, or “Company #{id}” when the company has no title. The description is the note text without HTML, cut at 1,500 characters. A timed activity lasts one hour. An activity stored at 00:00 becomes an all-day event. Time zone `config('app.timezone')`, calendar `primary`, and a private property `territool_note_id` (`:539-595`).
- **Repeats:** an unchanged activity is skipped (content hash). A changed one is updated. An event the rep deleted in Google is created again on the next sync (`:269-321`, `:638-682`).
- **Removes:** the Google event, when its activity was deleted or is no longer a Meeting or Appointment. A Meeting or Appointment that loses its date keeps its old event (`:323-344`).
- **Never writes:** `company_notes`, credits or any other product table (class comment, `:15-18`).
- **When:** the web Sync button, the phone Sync button, and the sync the phone runs one second after connecting. No cron or job calls it (nothing under `app/Console` or `CronController` mentions the calendar).
- **Answer:** “Google Calendar is up to date.”, or “Google Calendar: {n} activities sent, {n} removed, {n} failed.” with only the non-zero parts (singular “1 activity sent”, “1 removed”, “1 failed”) (`:877-895`). Updated events count as sent. A sync that had failures still answers `ok` true.

## Where it starts

| Surface | Entry | File | Shown |
|---|---|---|---|
| Classic web | “Calendar” button in the header of the home Activity panel | `front/partials/calendar-sync-launch.blade.php`, included at `front/dashboard.blade.php:759` | On the Upcoming tab only (`public/js/calendar-sync-ui.js:355-362`). Opens “Calendar Activity”. |
| Mobile | “Calendar” button in the Dashboard Activity header | `dashboard/index.js:1522-1556` | On the Upcoming tab only. Opens `CalendarActivity`. On `TT_80` it carries a badge: a check when Google Calendar is connected (`google_calendar_connected` from `getusercredit`), a sync icon when not. `Production` has the button without the badge. |

There is no Settings entry on either platform, and no disconnect. See [02 — Dashboard](02-Dashboard.md) for the rest of the Activity panel.

## Screens

### Classic web

- **“Calendar Activity” modal** (`#ttCalSyncActivity`): “Your scheduled visits, calls, and reminders.”, a status line, the “Sync” button and “Last sync: {m/d/Y, g:i A}”. A month grid with “Today” and arrows, a day list, the legend “Scheduled activity” and “Outlined date = today”, and the foot “Times shown in your account timezone.” with “Close”. The grid shows dated activities of every type from `/dashboard/activities/calendar`; only Meetings and Appointments go to Google.
- **Sync, not connected:** “Sync” closes this modal and opens “Connect your calendar”.
- **Sync, connected:** the button reads “Syncing” while `POST /calendar/google/sync` runs, then the status line shows the server’s answer. After a sync in the same page view the label reads “Last sync {date}”. On `needs_auth` the line reads “Connect Google Calendar again.” and the connect modal opens.
- **“Connect your calendar” modal** (`#ttCalSyncConnect`): “Choose your calendar provider.”, one option “Google” (the Microsoft option is commented out), “Continue with Google”, and “Meetings and appointments only.” / “One-way sync from TerriTool.” The button goes to `/calendar/google/connect`.
- **Back from Google:** the callback redirects to `/dashboard` with a notice, and “Calendar Activity” opens with it. Success: “Google Calendar connected. Click Sync to send meetings and appointments.” Other notices: “Google Calendar connection was cancelled.”, “Google Calendar could not connect. Try again.”, “Google Calendar connection expired. Try again.”, “Google did not return a connection. Try again.”, “Google did not allow a saved connection. Remove TerriTool in your Google account and connect again.”, “Add the Google Calendar client id and secret, then connect again.” and “Google Calendar storage is not ready. Run the new migration, then connect again.” (`GoogleCalendarSync.php:25-145`).

### Mobile (`TT_80`)

- **`CalendarActivity`** (`dashboard/CalendarActivityScreen.js`): header “Calendar Activity” with a Sync button on the right, reading “Sync”, “Syncing...” or “Synced”, and the last sync date under it (“MMM D, h:mm A”) (`:717-760`). The list comes from `getcompanyactivities` and shows every type.
- **Sync, not connected:** opens `CalendarSyncPopup`.
- **Sync, connected:** `POST google-calendar/sync`, then the toast “Google Calendar synced.” On `needs_auth` the phone clears its saved tokens and opens the popup with the server’s message, “Connect Google Calendar again.” (`:325-366`).
- **`CalendarSyncPopup`** (`dashboard/CalendarSyncPopup.js`): “Connect your calendar”, “Sign in with Google to sync your calendar.” (or the message passed in), one option “Google” (“Google  ·  Connected” once tokens are on the phone), “Continue with Google”, and “Meetings and appointments only.” / “One-way sync from TerriTool.”
- **Continue with Google:** the browser opens Google sign-in with PKCE and the phone’s own client id (`App/utils/calendarSync.js:159-188`, `:613-643`). Google returns to the app, and the phone swaps the code for tokens itself (`:645-678`). It then posts the tokens to `google-calendar/connection`, closes the popup, waits one second and runs `google-calendar/sync` (`CalendarSyncPopup.js:55-104`).
- **Sign-in errors:** “Sign-in did not finish. Close the browser and try again.” (after 180 s), “Sign-in was cancelled.”, “Sign-in failed.” and “Could not connect.”

Since `7c389031` (28 Oct) the phone no longer writes to Google itself. `pushActivityToCalendars()` and `copyMeetingRows()` return without doing anything (`calendarSync.js:208-230`), so saving, editing or deleting an activity on the phone changes Google only at the next Sync, and only the server creates events. Before that commit the phone also wrote events with its own token and its own event map (AsyncStorage `territool.calendar.eventMap`), apart from the server’s map; the commit title calls this the duplicate sync issue.

## Screens (strings)

Copy these strings. Do not write new ones.

| Surface | Screen | File / still | Primary action | Loading | Empty | Error |
|---|---|---|---|---|---|---|
| Classic web | “Calendar Activity” modal | `front/partials/calendar-sync-modals.blade.php`, `public/js/calendar-sync-ui.js` · no still yet | Pick a day; Sync | Day list “Loading activities…”; button “Syncing” | “No activities scheduled for this date.” | “Could not load activities.” with “Try again”; “Could not sync Google Calendar. Try again.”; “Connect Google Calendar again.” |
| Classic web | “Connect your calendar” modal | same partial · no still yet | Continue with Google | — | — | The notices above, shown in “Calendar Activity” |
| Mobile (`TT_80`) | `CalendarActivity` | `dashboard/CalendarActivityScreen.js` · [before the Sync button](<../screenshots/mobile-owner/ActivityCalendar/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.40.27.png>) | Sync | `screen.calendarActivity.loading`; button “Syncing...” | “No activities in {Month YYYY}” | Toast with the server message, or “Could not sync Google Calendar.” |
| Mobile (`TT_80`) | `CalendarSyncPopup` | `dashboard/CalendarSyncPopup.js` · no still yet | Continue with Google | Spinner in the button | — | The sign-in errors above, under the button |

## Endpoints

| Method + path | Handler | Does |
|---|---|---|
| GET `/calendar/google/connect` | `GoogleCalendarController@connect` | Sends the user to Google: scope `https://www.googleapis.com/auth/calendar.events`, `access_type` offline, `prompt` consent, and a `state` kept in the session |
| GET `/calendar/google/callback` | `GoogleCalendarController@callback` | Checks `state`, swaps the code with the web client id and secret, stores the connection, redirects to `/dashboard` with a notice |
| POST `/calendar/google/sync` | `GoogleCalendarController@sync` | Runs the sync. JSON `ok`, `needs_auth`, `created`, `updated`, `removed`, `skipped`, `failed`, `message`, and `last_synced_at` on success |
| GET `/dashboard/activities/calendar?start=&end=` | `HomeController@dashboardCalendarNotes` | Read-only. Dated activities of every type grouped by day, for at most 45 days per request (`HomeController.php:534-594`) |
| v2 POST `google-calendar/connection` | `GoogleCalendarController@store` (API) | Stores tokens the phone already has: JSON `accessToken`, `refreshToken`, `expiresAt`. A Google `code` is still accepted when those are absent. Answers `{ status, message, data: { connected } }` |
| v2 POST `google-calendar/sync` | `GoogleCalendarController@sync` (API) | The same sync. Answers `{ status, message, data: { created, updated, removed, skipped, failed, needs_auth } }` |
| v2 GET `getusercredit` | `RouteController@getUserCredit` | Adds `google_calendar_connected` (status `connected` with a refresh token) and `google_calendar_last_sync` (“m/d/Y, g:i A”, app time zone) (`RouteController.php:3720-3748`) |

The web routes sit in the `web`, `auth`, `role` group: `routes/web.php:253-256` on `beta_react`, `:252-255` on `master`. The v2 routes sit in the `jwt.refresh` group at `routes/api.php:249-250` on both. The phone posts both v2 calls as JSON through `API.post(…, { asJson: true })` (`calendarSync.js:772-778`, `:790-792`), not as FormData.

## Data

| Store | Fields |
|---|---|
| `google_calendar_connections` (`App\Models\GoogleCalendarConnection`) | `user_id`, `calendar_id` (`primary`), `access_token` and `refresh_token` (encrypted with Laravel `Crypt`), `token_expires_at`, `status` (`connected` or `revoked`), `connected_at`, `last_synced_at` |
| `google_calendar_event_maps` (`App\Models\GoogleCalendarEventMap`) | `user_id`, `company_note_id`, `google_event_id`, `content_hash`, `last_error`, `synced_at` |
| Phone AsyncStorage (`calendarSync.js:16-18`) | `territool.calendar.tokens` (Google tokens on the phone), `territool.calendar.pendingAuth` (PKCE verifier and state during sign-in), `territool.calendar.eventMap` (used only by the paused phone-side copy) |

There is no migration for the two tables anywhere in the repo history. Before connecting or syncing, the server checks `Schema::hasTable` for both and answers “Google Calendar storage is not ready.” or “Google Calendar is not ready to sync yet.” when either is missing (`GoogleCalendarSync.php:380-388`). A revoked connection keeps its row with the tokens cleared.

## Config and env

- **Web:** `GOOGLE_CALENDAR_CLIENT_ID`, `GOOGLE_CALENDAR_CLIENT_SECRET` and `GOOGLE_CALENDAR_REDIRECT_URI` in `config/google_calendar.php:4-8`. An empty redirect URI means `url('/calendar/google/callback')`, and that URL must be listed on the Google OAuth client. Without the id and secret, the web connect and every sync refuse (`GoogleCalendarSync.php:360-363`).
- **Mobile:** `CALENDAR_GOOGLE_CLIENT_ID_IOS` and `CALENDAR_GOOGLE_CLIENT_ID_ANDROID` (`App/config/index.js:236-239`), `CALENDAR_MICROSOFT_CLIENT_ID` (empty, `:240`), `CALENDAR_MICROSOFT_REDIRECT` `territool://calendar-oauth` (`:241`), `URL_GOOGLE_CALENDAR_CONNECTION` and `URL_GOOGLE_CALENDAR_SYNC` (`:243`, `:245`). They are public client ids; there is no client secret on the phone.
- **Return to the app:** iOS URL types `calendar-oauth` (scheme `territool`) and `google-calendar-oauth` (the reversed iOS client id) in `ios/TerriTool/Info.plist`. Android intent filters for `territool://calendar-oauth` and `${calendarGoogleRedirectScheme}` (`AndroidManifest.xml:123`, `:129`), set in `android/app/build.gradle:178`.
- **Privacy page** for the Google review: `public/google-calendar/privacy/index.html` (`f88d3fe2`).

## Known issues

1. `calendarSync.js` logs the full Google access and refresh tokens with `console.log`: at `:107` (`describeGoogleConnection`), `:742` (`storeToken`) and `:768-771` (the `google-calendar/connection` request body, added in `7c389031`). Release builds strip `console` calls (`transform-remove-console` in `babel.config.js`), so this affects development builds and the machines that run them; issue 2 affects release builds too.
2. A failed `google-calendar/connection` call sends its request body, with both tokens, to Sentry. `API.post` passes the body to `recordApi` on a `status_code` 400, 401, 403, 404 or 500 answer and on a network error (`App/utils/API.js:40-71`, `:270-320`, `:346-366`).
3. Possible reconnect about an hour after connecting on the phone. Not verified on a device. The phone gets its tokens with the iOS or Android client id and sends them once, right after connecting. When that access token expires, the server refreshes it with the web client id and secret (`GoogleCalendarSync.php:473-478`). If Google refuses a refresh token that was issued to another client, the server revokes the connection (`unauthorized_client` handling since `f1e78e6c`, `:479-487`) and the phone asks the rep to connect again.
4. No Settings entry and no disconnect on either platform. No route or button removes a connection. The phone’s `disconnectCalendar()` only clears the tokens saved on the phone, after a `needs_auth` answer.
5. Microsoft cannot be reached. `CALENDAR_MICROSOFT_CLIENT_ID` is empty, the phone popup offers only Google (`CalendarSyncPopup.js:136-144`), and the web Microsoft option is commented out (`calendar-sync-modals.blade.php:46-52`).
6. The phone shows “Google Calendar synced.” for every successful answer, including one where some events failed. It does not show the server’s summary (`CalendarActivityScreen.js:335-342`).
7. The web modal says “Times shown in your account timezone.”, but the grid and the Google events both use the server’s `config('app.timezone')` (`HomeController.php:599-603`, `GoogleCalendarSync.php:864-867`).
8. The connect notice tells the user to “Run the new migration”, but the repo has none.

## Code map

| File | Does |
|---|---|
| `app/Services/GoogleCalendarSync.php` | Connect (web code or phone tokens), token refresh and revoke, `push()`, event body, summary |
| `app/Http/Controllers/GoogleCalendarController.php` | Web connect, callback and sync |
| `app/Api/V2/Controllers/GoogleCalendarController.php` | v2 `store` (phone tokens) and `sync` |
| `app/Http/Controllers/HomeController.php` | `dashboardCalendarNotes`, the month-grid data |
| `app/Api/V2/Controllers/RouteController.php` | `getUserCredit` connection fields |
| `app/Models/GoogleCalendarConnection.php`, `GoogleCalendarEventMap.php` | The two tables |
| `config/google_calendar.php` | Client id, secret and redirect URI from env |
| `resources/views/front/partials/calendar-sync-launch.blade.php`, `calendar-sync-modals.blade.php` | The “Calendar” button and both modals |
| `public/js/calendar-sync-ui.js`, `public/css/calendar-sync-ui.css` | Modal behaviour and styles |
| `App/utils/calendarSync.js` | Phone PKCE sign-in, token storage, the two v2 calls; the paused phone-side copy |
| `App/components/dashboard/CalendarActivityScreen.js` | The calendar screen and its Sync button |
| `App/components/dashboard/CalendarSyncPopup.js` | “Connect your calendar” on the phone |
| `App/components/dashboard/index.js` | The Dashboard “Calendar” button and its badge |

## Related

**Modules** — 02-Dashboard, 13-CRM-Integrations, 14-Settings-Profile, 19-Cron-Jobs-Webhooks

**Flows** — [web user](../flows/web-user.md) step 3c, [web user detail](../flows/web-user-detail.md) section 2c

**Code** — [mobile screens](../code/mobile-screens.md), [web code review](../code/web-review.md), [API endpoints](../brains/api-endpoints.md)

## Generate from this brain

- UI rule: [UI/UX Guardian](../brains/ui-ux-guardian.md)
- Screenshot method: [screenshot review](../screenshots/REVIEW.md)
- Mobile implementation: [mobile code review](../code/mobile-review.md)
- Web implementation: [web code review](../code/web-review.md)
- Role: [User](../roles/user.md) · [Manager](../roles/manager.md) · [Admin](../roles/admin.md)
