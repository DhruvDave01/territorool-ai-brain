# 02 — Dashboard

## Purpose

Home after login for reps. Shows what they did recently, what is coming up, and credit/upgrade status. Business Agents are sent to the **Manager Portal** instead of this screen.

## Who

Sales Agent, Business Sales Agent. Business Agent only if returning from HubSpot connect.

## Functionality

- Personalized welcome.
- **Recent activity**: notes, visits, status changes, routes for this user.
- **Upcoming notes**: reminders and appointments with date and type.
- Mobile Activity header: a live clock in Los Angeles time. TT_80 formats it `ddd, MMM DD · hh:mm A` (`App/utils/companyActivityPayload.js:115-118`, `35433ecc`); Production uses `ddd, MMM D · h:mm A` with “PT” after it. On the Upcoming tab the header button is “Calendar” (`screen.dashboard.calendarActivity`, icon `screen.dashboard.iconCalendarActivity`, `dashboard/index.js:1522-1557`), which opens `CalendarActivity`; on the Recent tab it is “View All”. On TT_80 a small badge beside “Calendar” shows a check when `getusercredit` returns `google_calendar_connected`, and `CalendarActivity` has the Google Calendar “Sync” button. The classic web dashboard's Activity header has a “Calendar” button too (`front/dashboard.blade.php:759`, partial `front/partials/calendar-sync-launch.blade.php`). Details: [23 — Calendar Sync](23-Calendar-Sync.md).
- **Credit balance** in the header (Sales Agent). Low credits → upgrade or, if billed through RevenueCat, manage-plan (not a second Stripe checkout). On TT_80 the credits pill shows a spinner while credits load (`screen.dashboard.creditsLoading`, `dashboard/index.js:1282-1287`, `fb5ab158`); Production shows a “Loading credits…” overlay instead.
- Shortcuts into Address Book, Find Leads, Routes, Lists. The six mobile tiles are AI Find Leads, Scan Card, Add Company, Routes, Lists, Address Book (`dashboard/index.js:171-213`). TT_80 removed the corner tags “LEADS & CONTACTS” and “Powered by AI” (`75839e87`); Production still shows them. Routes and Lists show an unread count and “New route ready” / “New list ready”. The tile highlight behind them was removed in `450bfb39` (on Production).
- In-app tutorial and PDF tutorial.
- After a RevenueCat purchase, a success screen.
- Mobile home banner, Production only: “Unlock 50 Credits.” opens `ReviewRewardsModal` (`dashboard/index.js:1347-1369` on Production, `e91a86c9`). Its “G2: 30 · Product Hunt: 20” line is commented out. TT_80 removed the banner in `fe2e3254`; the sheet is still mounted there, but nothing opens it. G2 is 30 credits, Product Hunt is 20. The sheet posts `invite-user` (`type` `g2` or `ph`) and then opens the review URL. Credits wait on `getusercredit` flags `has_pending_*` and `has_verified_*`. A tap does not grant credits.
- Mobile, TT_80 only (not in the store build): the first row above the six tiles is always “Voice Mode” with a “Beta” pill and “Best to use on Speaker mode instead of Bluetooth” (`voice/VoiceParts.js:333-359`). Since `fa925407` it no longer waits for an active route, and `VOICE_MODE_ENABLED` is `true` for every TT_80 build (`App/config/index.js:34`, `ce2104d0`). The row opens `VoiceScreen` through `openVoice` (`voice/VoiceParts.js:28-37`). See [22 — Voice Mode](22-Voice-Mode.md).
- Classic web page `/reviews/credits` (`HomeController@reviewCredits`, view `front.review_credits`). Same chrome as the rep dashboard. Title “Unlock 50 free credits”. G2 is 30, Product Hunt is 20. A click opens the review URL and POSTs `type` `g2` or `ph`. The row becomes “Submitted” and “Pending verification”. The POST writes a `user_invitees` row with `verify` 0. It does not add credits. Stills: [desktop](../screenshots/web/sales-agent/review-credits-desktop.png), [phone](../screenshots/web/sales-agent/review-credits-phone.png). The page is not a dashboard card.

### HubSpot connect return

If the user is coming back from HubSpot OAuth:

1. Store the refresh token on the user.
2. If fields are not mapped yet → field mapping.
3. Otherwise stay on home.

### When a Business Agent still hits this home

Team widgets can still show: visits, note updates, routes, status updates, navigate-me counts for a date range; licenses used vs remaining; team list with credit totals; plan/credit summary. The normal path is the manager cockpit (module 16).

## Rules

- Keep Business Agents on the manager cockpit except OAuth return.
- Activity is always scoped to the signed-in user (or that manager’s team on manager screens).

## Code

`HomeController`, dashboard view, sidebar, header menu (credits / upgrade).

## Related

**Modules** — 03-Company-AddressBook, 05-Find-Leads, 07-Routes, 08-Lists, 12-Subscription-Payments, 13-CRM-Integrations, 16-Manager-Portal, 15-Support-Notifications

**This feature** — Use cases, Evidence

**MCP** — 20-MCP, tool contract in api-surfaces.md

**Code** — ROUTEMAP.md (look for `HomeController`), CODEMAP.md, engineering/README.md

**Terms / roles** — glossary.md, roles.md, OVERVIEW.md

## Screens

Per surface. "File" is under `TerriTool/App/components/` for mobile; the full map is [mobile screens](../code/mobile-screens.md). Strings are copied from code on 2026-09-22, and the mobile strings were checked again against TT_80 on 2026-11-02 ([live code 2026-11-02](../reviews/live-code-2026-11-02.md)); a loading cell that reads `screen.x.loading` is the `testID` on that screen's `ActivityIndicator`. Copy these strings; do not write new ones.

| Surface | Screen | File / still | Primary action | Loading | Empty | Error |
|---|---|---|---|---|---|---|
| Mobile | `Dashboard` | `dashboard/index.js` · [Dashboard](<../screenshots/mobile-owner/Dashboard/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-22 at 13.45.00.png>) | Tap a tile (Find Leads first) | `screen.dashboard.loading`; TT_80 credits pill `screen.dashboard.creditsLoading` | "No upcoming activities yet." | "Oops! Something went wrong. Please check your internet connection or try again." (toast) |
| Mobile | Review rewards sheet (Production; no entry point on TT_80) | `dashboard/ReviewRewardsModal.js` · [ready](../screenshots/mobile-owner/Dashboard/review-rewards-ready.png) · [pending](../screenshots/mobile-owner/Dashboard/review-rewards-pending.png) · [G2 verified](../screenshots/mobile-owner/Dashboard/review-rewards-g2-verified.png) | Review on G2 or Review on Product Hunt | Button spinner while `invite-user` runs | Ready state has no status pill | "Couldn't start the G2 review." / "Couldn't open G2. Please try again." |
| Mobile | “Voice Mode” row and first-run sheet (TT_80 only) | `voice/VoiceParts.js` `DriveWithVoiceRow`, `FirstRunSheet` · [render](<Voice Mode/voice-mode-mobile-dashboard-entry.png>), which predates TT_80: it still shows “Want 50 more credits?”, “Drive with Voice Mode”, the corner tags and the tile highlight | Open Voice Mode | “Turn on Voice Mode” shows a spinner while the mic is asked | The row always shows on TT_80 (`screen.dashboard.voiceRow`) | OS prompt “Turn on the microphone” |
| Mobile | `RecentActivity` | `dashboard/RecentActivityScreen.js` · [ActivityCalendar](<../screenshots/mobile-owner/ActivityCalendar/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.40.14.png>) | Open an activity | `screen.recentActivity.loading` | "No recent activity yet." / "No upcoming activities yet." | "Oops! Something went wrong. Please check your internet connection or try again." (toast) |
| Mobile | `CalendarActivity` | `dashboard/CalendarActivityScreen.js` · [ActivityCalendar](<../screenshots/mobile-owner/ActivityCalendar/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.40.14.png>) | Pick a day; on TT_80 also "Sync" (Google Calendar, [23](23-Calendar-Sync.md)) | `screen.calendarActivity.loading` | "No activities today." (`screen.calendarActivity.monthEmpty`) | "Oops! Something went wrong. Please check your internet connection or try again." (toast) |
| Mobile | `Notifications` | `dashboard/NotificationsScreen.js` | Open a notification | `screen.notifications.loading` | — (list renders empty) | "Could not load notifications." (toast) |
| Mobile | `QrCodeScanner` | `dashboard/QrCodeScannerScreen.js` | Scan | — | — | OS camera permission sheet |
| Classic web | `/dashboard` | [web_01_dashboard](../screenshots/web/sales-agent/web_01_dashboard_w1440.png) | Open a module | `#cover-spin` | — | Flash message |
| Classic web | `/reviews/credits` | `front/review_credits.blade.php` · [desktop](../screenshots/web/sales-agent/review-credits-desktop.png) · [phone](../screenshots/web/sales-agent/review-credits-phone.png) | Leave a G2 review / Leave a Product Hunt review | Button stays until the POST returns | Eligible copy above | Invalid `type` returns status 0, “Please provide a valid type (g2 or ph).” |
| Manager | `/manager/dashboard` | [Manager dashboard](../screenshots/web-owner/Manager/Manager-Dashboard-TerriTool-09-15-2026_01_20_PM.png) | Read KPIs, open a rep | "Loading…" | KPI shows 0 | "Failed to load dashboard data." (toast on `#manager-toast-root`) |

On Production the home banner is review rewards, not the invite form. TT_80 has no home banner. Plan switch: "Unable to switch plans", "Missing subscription info. Try again later."

## Screenshots in this brain

Open the image before drawing UI. The filename is a capture time, not a layout spec. Pixels win.

Live review-rewards stills are the ones named in the Screens table above. The files under `feature-evidence/02-Dashboard/evidence/review-credits/` are the earlier design set. Use the live stills when the two disagree.

- [IMG_4563.PNG](<../screenshots/feature-evidence/02-Dashboard/evidence/IMG_4563.PNG>)
- [IMG_4605.PNG](<../screenshots/feature-evidence/02-Dashboard/evidence/IMG_4605.PNG>)
- [IMG_4608.PNG](<../screenshots/feature-evidence/02-Dashboard/evidence/IMG_4608.PNG>)
- [Screenshot 2026-09-15 at 11.10.02 AM.png](<../screenshots/feature-evidence/02-Dashboard/evidence/Screenshot 2026-09-15 at 11.10.02 AM.png>)
- [email.png](<../screenshots/feature-evidence/02-Dashboard/evidence/review-credits/email.png>)
- [g2-logo.png](<../screenshots/feature-evidence/02-Dashboard/evidence/review-credits/g2-logo.png>)
- [mobile-banner.png](<../screenshots/feature-evidence/02-Dashboard/evidence/review-credits/mobile-banner.png>)
- [mobile-sheet.png](<../screenshots/feature-evidence/02-Dashboard/evidence/review-credits/mobile-sheet.png>)
- [producthunt-logo.png](<../screenshots/feature-evidence/02-Dashboard/evidence/review-credits/producthunt-logo.png>)
- [web-complete.png](<../screenshots/feature-evidence/02-Dashboard/evidence/review-credits/web-complete.png>)
- [web-landing-mobile.png](<../screenshots/feature-evidence/02-Dashboard/evidence/review-credits/web-landing-mobile.png>)
- [web-landing.png](<../screenshots/feature-evidence/02-Dashboard/evidence/review-credits/web-landing.png>)
- 12 more stills are in `../screenshots/feature-evidence/02-Dashboard/`.

## Generate from this brain

- UI rule: [UI/UX Guardian](../brains/ui-ux-guardian.md)
- Screenshot method: [screenshot review](../screenshots/REVIEW.md)
- Mobile implementation: [mobile code review](../code/mobile-review.md)
- Web implementation: [web code review](../code/web-review.md)
- Role: [User](../roles/user.md) · [Manager](../roles/manager.md) · [Admin](../roles/admin.md)
