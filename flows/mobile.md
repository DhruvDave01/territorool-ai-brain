# Mobile flow

Sales Agent and Business Sales Agent. Same screens. After login the home is Dashboard. Dashboard has no footer.

Who can do what: [User](../roles/user.md). Step shape: [mobile detail](mobile-detail.md). Pixel rules: [screenshot review](../screenshots/REVIEW.md).

The file name on these stills is a clock time. Open the image.

| Step | Screen | Still |
|---|---|---|
| 1 | Login | [Login](<../screenshots/mobile-owner/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.26.16.png>) |
| 2 | Home — six tiles, credits, Activity with the “Calendar” button, no footer. TT_80 adds the “Voice Mode” row and has no banner; Production shows “Unlock 50 Credits.” | [Dashboard](<../screenshots/mobile-owner/Dashboard/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-22 at 13.45.00.png>) |
| 2b | Review rewards — sheet from the Production banner. G2 30, Product Hunt 20. No entry point on TT_80 | [Ready](../screenshots/mobile-owner/Dashboard/review-rewards-ready.png) |
| 3 | AI Find Leads (`MultipleAIWaypoint`) | [Find Leads](<../screenshots/mobile-owner/AIFindLeadsFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.42.05.png>) |
| 4 | Add company | [Add company](<../screenshots/mobile-owner/AddCompany/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.51.04.png>) |
| 5 | Scan card | [Scan card](<../screenshots/mobile-owner/ScanCardFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.49.27.png>) |
| 6 | Address Book | [Address Book](<../screenshots/mobile-owner/AddressBookFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.19.27.png>) |
| 7 | Routes | [Routes](<../screenshots/mobile-owner/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.02.12.png>) |
| 7b | Find Contacts for a whole route or list: the “Find Contacts” button on route or list detail, tick people per stop, then Review | [Find Contacts, route](<../screenshots/mobile-owner/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.08.32.png>) · [Review](<../screenshots/mobile-owner/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.09.05.png>) |
| 8 | Lists | [Lists](<../screenshots/mobile-owner/List/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.08.32.png>) |
| 9 | Activity and calendar. The “Calendar” button on the home Upcoming tab opens `CalendarActivity`; on TT_80 it has the Google Calendar “Sync” button ([23 — Calendar Sync](../features/23-Calendar-Sync.md)) | [Calendar](<../screenshots/mobile-owner/ActivityCalendar/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.40.14.png>) |
| 10 | Settings | [Settings](<../screenshots/mobile-owner/Setting/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.23.png>) |
| 11 | Voice Mode, TT_80 only (not in the store build). From the home row “Voice Mode” (always shown), the route-detail or map mic, or the Settings card. | [Voice Mode, listening](../screenshots/mobile-owner/VoiceMode/04-mobile-answers.jpg) · [mini-bar on route detail](../screenshots/mobile-owner/VoiceMode/15-auto-start.jpg) |

Home chrome to copy is the 2026-09-22 1:45 still. Black bezel, small island in the status bar. That still’s banner says “Want 20 more credits?”. Read against TT_80 on 2026-11-02 ([live code 2026-11-02](../reviews/live-code-2026-11-02.md)): TT_80 has no banner (`fe2e3254`), its first row is “Voice Mode” with a “Beta” pill, and its tiles have no corner tags. Production’s banner reads “Unlock 50 Credits.” and opens the review sheet. Ready, neither sent: [Review on G2 / Review on Product Hunt](../screenshots/mobile-owner/Dashboard/review-rewards-ready.png). Pending: [both submitted](../screenshots/mobile-owner/Dashboard/review-rewards-pending.png). After G2 is verified: [G2 review done](../screenshots/mobile-owner/Dashboard/review-rewards-g2-verified.png). The 19.36.33 still is the same home with activity rows. The 19.36.28 still is the location prompt, not the home.

Footer from the home tiles, in order: Find Leads, Address Book, Routes, Lists, Settings. Find Leads opens `MultipleAIWaypoint` and has no footer. The chat screen `AIFindLeadsChat` was removed on 30 Sep (`5865546a`, on both branches), so the step 3 still is the live screen: city or ZIP, then ideal businesses, then the Search Leads / Selected Leads results. Mobile sends no map circle or radius. See [05 — Find Leads](../features/05-Find-Leads.md).

Step 7b buys contacts in bulk through `Contact` → `BulkContactPeople` → `BulkContactReview`. Nothing is charged until the rep confirms. After Confirm the app returns to route or list detail, and the buy keeps running in the background, still one contact at a time (`route/contact/review.js:154-168`, both branches). See [09 — Contact Enrichment](../features/09-Contact-Enrichment-Credits.md).

Voice Mode (step 11) is one session that keeps running across screens. The voice screens show footer index 4 with Routes lit. On any other screen a mini-bar shows the state and the next stop: inside the footer, or below the screen where there is no footer. It is not a footer tab and not a Dashboard tile. See [22 — Voice Mode](../features/22-Voice-Mode.md).
