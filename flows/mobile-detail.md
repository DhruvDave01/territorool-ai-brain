# Mobile flow — detail

Copy this shape when a new mobile requirement arrives. Map: [mobile.md](mobile.md). Role: [User](../roles/user.md). Pixels: [screenshot review](../screenshots/REVIEW.md).

Each step is **From → Do → Copy → Next → Stop**, then the stills. The file name is a clock time. Open the image.

## 1. Login

- **From** — app launch
- **Do** — sign in
- **Copy** — login chrome, not the home header
- **Next** — home
- **Stop** — do not put the six-tile home on this screen

Stills:

- [Login](<../screenshots/mobile-owner/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.26.16.png>)
- [Next in the same capture](<../screenshots/mobile-owner/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.26.38.png>)
- [Next in the same capture](<../screenshots/mobile-owner/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.26.47.png>)

## 2. Home

- **From** — login
- **Do** — pick a tile, or tap the banner
- **Copy** — blue header, credits pill, banner “Want 50 more credits?” and “G2: 30 · Product Hunt: 20”, six tiles, no footer. The 1:45 still is the chrome. Its banner line is the old “Want 20 more credits?”
- **Next** — the review sheet, or Find Leads, Address Book, Routes, Lists, or Settings
- **Stop** — do not add the footer here. Do not grant the 50 credits from the banner tap alone

Stills:

- [Home, 2026-09-22 1:45](<../screenshots/mobile-owner/Dashboard/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-22 at 13.45.00.png>)
- [Review rewards, both pending](../screenshots/mobile-owner/Dashboard/review-rewards-pending.png)
- [Review rewards, G2 verified](../screenshots/mobile-owner/Dashboard/review-rewards-g2-verified.png)
- [Home tiles, earlier, with activity rows](<../screenshots/mobile-owner/Dashboard/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.36.33.png>)
- [Location prompt, not the home](<../screenshots/mobile-owner/Dashboard/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.36.28.png>)
- [Camera prompt](<../screenshots/mobile-owner/Dashboard/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.36.48.png>)
- [Activity on the home](<../screenshots/mobile-owner/Dashboard/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.00.png>)

## 2b. Review rewards

- **From** — the home banner
- **Do** — “Review on G2” (30) or “Review on Product Hunt” (20). The tap posts `invite-user` with `type` `g2` or `ph`, then opens the review URL
- **Copy** — sheet title “Unlock 50 credits”. Ready, neither sent: [Review on G2 / Review on Product Hunt](../screenshots/mobile-owner/Dashboard/review-rewards-ready.png). Pending is [both Submitted](../screenshots/mobile-owner/Dashboard/review-rewards-pending.png). Verified is [G2 review done](../screenshots/mobile-owner/Dashboard/review-rewards-g2-verified.png). Fine print: “Honest feedback is welcome, whatever your rating.”
- **Next** — stay on home. The button reads “Submitted” while pending, then “G2 review done” or “PH review done”
- **Stop** — a tap does not add the credits. Flags come back on `getusercredit`. Do not ask for a positive rating

## 3. AI Find Leads

- **From** — home tile or footer index 2. Both open `AIFindLeadsChat`
- **Do** — drag the one circle over the area (1–10 miles), tap Confirm area, describe the businesses, then pick and save leads. “Type a city or ZIP instead” switches to a typed area on the same screen
- **Copy** — the chat on `AIFindLeadsChat`, then the existing Search Leads / Selected Leads results. This screen has no footer
- **Next** — the saved companies are in Address Book
- **Stop** — search is free. Saving costs 1 credit per lead. Do not save with the manual add-company action. Since 2026-09-29 the map-circle search fails on the server (web commit `abe88426`). Typed city or ZIP still works. See [05 — Find Leads](../features/05-Find-Leads.md)

Stills. These show the older city and ZIP form (`MultipleAIWaypoint`), which the chat can still switch to. There is no still of the chat yet:

- [Find Leads](<../screenshots/mobile-owner/AIFindLeadsFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.42.05.png>)
- [Same flow](<../screenshots/mobile-owner/AIFindLeadsFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.42.09.png>)
- [Same flow](<../screenshots/mobile-owner/AIFindLeadsFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.42.15.png>)

## 4. Save into a route or a list

- **From** — a company that already exists
- **Do** — put it on a route (driving order) or a list (a named group)
- **Copy** — the route library, then the list library
- **Next** — route detail, or list detail
- **Stop** — a list is not a route

Stills:

- [Routes](<../screenshots/mobile-owner/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.02.12.png>)
- [Routes, next frame](<../screenshots/mobile-owner/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.02.16.png>)
- [Lists](<../screenshots/mobile-owner/List/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.08.32.png>)
- [Lists, next frame](<../screenshots/mobile-owner/List/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.08.36.png>)

## 4b. Find Contacts for a route or list (bulk)

- **From** — route detail or list detail, the “Find Contacts” button
- **Do** — the screen checks every stop (“Finding contacts · 0 of 4 stops”, “Checking FullEnrich…”). Tap View on a stop, tick people (the price sits on each person), then Review, then confirm
- **Copy** — `Contact` (“Find Contacts”, “{route} · N stops”), then `BulkContactPeople` (the company and its address), then `BulkContactReview` (“Review”, “Credits are used only when you confirm.”)
- **Next** — “Getting details for N contacts”, then “All N contacts ready”. The contacts appear under each company
- **Stop** — nothing is charged until the rep confirms. A contact costs 2 credits, or 1 on the Claude path. Each contact is bought in its own request, one after another, so a large selection takes minutes. See [09 — Contact Enrichment](../features/09-Contact-Enrichment-Credits.md)

Stills:

- [Find Contacts, checking each stop](<../screenshots/mobile-owner/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.08.32.png>)
- [Stops checked](<../screenshots/mobile-owner/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.08.36.png>)
- [People at a stop](<../screenshots/mobile-owner/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.08.53.png>)
- [Ticked, with the credit total](<../screenshots/mobile-owner/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.08.56.png>)
- [Review](<../screenshots/mobile-owner/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.09.05.png>)
- [Getting details](<../screenshots/mobile-owner/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.10.05.png>)
- [All contacts ready](<../screenshots/mobile-owner/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.13.18.png>)

## 5. Address Book and add company

- **From** — home, or after a save
- **Do** — open a company, or add one by hand
- **Copy** — Address Book, then the add-company screen
- **Next** — company detail, or back to the list
- **Stop** — hand add is not an AI save

Stills:

- [Address Book](<../screenshots/mobile-owner/AddressBookFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.19.27.png>)
- [Address Book, next frame](<../screenshots/mobile-owner/AddressBookFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.19.30.png>)
- [Add company](<../screenshots/mobile-owner/AddCompany/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.51.04.png>)
- [Scan card](<../screenshots/mobile-owner/ScanCardFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.49.27.png>)

## 6. Settings

- **From** — home header or footer
- **Do** — open plan, credits, or account
- **Copy** — the settings stills
- **Next** — back to home
- **Stop** — a web-billed account manages the plan on the web, not in an App Store sheet

Stills:

- [Settings](<../screenshots/mobile-owner/Setting/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.23.png>)
- [Settings, next frame](<../screenshots/mobile-owner/Setting/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.29.png>)
- [Calendar, if the requirement is activity](<../screenshots/mobile-owner/ActivityCalendar/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.40.14.png>)

## 7. Voice Mode (staging and dev builds)

- **From** — the home row “Drive with Voice Mode” (only while a route is active), the mic in the route-detail or map header, or the Voice Mode card in Settings
- **Do** — the first time, “Turn on Voice Mode” on the sheet “Voice for the drive” (the mic permission is asked here). Then talk: next stop, last stop, “I went in…”, log or edit an activity, notes, saved companies, lists, routes. Pause keeps the session. End closes it.
- **Copy** — the shipped VoiceMode stills: state card, transcript, section cards, End with Pause. Footer index 4 with Routes lit. The mini-bar on other screens.
- **Next** — a card opens `WaypointDetail`, `ViewCompany`, `BasicRouteDetail`, or `AIFindLeadsChat`, and voice keeps running. The history button opens “Voice history”.
- **Stop** — no push-to-talk and no text box. Voice does not find new leads, look up new contacts, delete, edit routes or lists, share, or spend credits. It hands off to the app instead.

Stills:

- [Listening, refusal hand-off, last stop](../screenshots/mobile-owner/VoiceMode/04-mobile-answers.jpg)
- [Speaking, next stop](../screenshots/mobile-owner/VoiceMode/09-route-switch-result.jpg)
- [Check before repeating](../screenshots/mobile-owner/VoiceMode/12-unknown-write.jpg)
- [Connection lost: End / Reconnect](../screenshots/mobile-owner/VoiceMode/10-connection-error.jpg)
- [Voice history](../screenshots/mobile-owner/VoiceMode/16-fixed-clean-history.jpg) · [empty](../screenshots/mobile-owner/VoiceMode/02-history-empty.jpg)
- [Settings card](../screenshots/mobile-owner/VoiceMode/14-settings-enabled.jpg)
- [Route detail with the mic and the mini-bar](../screenshots/mobile-owner/VoiceMode/15-auto-start.jpg)
- No shipped still yet for the home row or the first-run sheet. Use the [22 — Voice Mode](../features/22-Voice-Mode.md) renders and strings.

Rep-facing journeys and example phrases: [Voice Mode guide](../features/voice-mode-guide-2026-09-29.pdf) (pages 3–5, six journeys) and its [quick-start sheet](../features/voice-mode-guide-2026-09-29-quick-start.jpg). They are for help and onboarding copy, not pixels. Where they differ from the app is listed on the feature page.

## New requirement

Write the new step in this same block. Point **Copy** at the nearest still above. If no still shows that screen, stop and ask.
