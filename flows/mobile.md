# Mobile flow

Sales Agent and Business Sales Agent. Same screens. After login the home is Dashboard. Dashboard has no footer.

Who can do what: [User](../roles/user.md). Step shape: [mobile detail](mobile-detail.md). Pixel rules: [screenshot review](../screenshots/REVIEW.md).

The file name on these stills is a clock time. Open the image.

| Step | Screen | Still |
|---|---|---|
| 1 | Login | [Login](<../screenshots/mobile-owner/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.26.16.png>) |
| 2 | Home — six tiles, credits, “Want 50 more credits?”, no footer | [Dashboard](<../screenshots/mobile-owner/Dashboard/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-22 at 13.45.00.png>) |
| 2b | Review rewards — sheet from that banner. G2 30, Product Hunt 20 | [Ready](../screenshots/mobile-owner/Dashboard/review-rewards-ready.png) |
| 3 | AI Find Leads chat | [Find Leads, older city form](<../screenshots/mobile-owner/AIFindLeadsFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.42.05.png>) |
| 4 | Add company | [Add company](<../screenshots/mobile-owner/AddCompany/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.51.04.png>) |
| 5 | Scan card | [Scan card](<../screenshots/mobile-owner/ScanCardFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.49.27.png>) |
| 6 | Address Book | [Address Book](<../screenshots/mobile-owner/AddressBookFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.19.27.png>) |
| 7 | Routes | [Routes](<../screenshots/mobile-owner/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.02.12.png>) |
| 7b | Find Contacts for a whole route or list: the “Find Contacts” button on route or list detail, tick people per stop, then Review | [Find Contacts, route](<../screenshots/mobile-owner/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.08.32.png>) · [Review](<../screenshots/mobile-owner/RouteFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.09.05.png>) |
| 8 | Lists | [Lists](<../screenshots/mobile-owner/List/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 20.08.32.png>) |
| 9 | Activity and calendar | [Calendar](<../screenshots/mobile-owner/ActivityCalendar/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.40.14.png>) |
| 10 | Settings | [Settings](<../screenshots/mobile-owner/Setting/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.23.png>) |
| 11 | Voice Mode, staging and dev builds only. From the home row “Drive with Voice Mode” (active route only), the route-detail or map mic, or the Settings card. | [Voice Mode, listening](../screenshots/mobile-owner/VoiceMode/04-mobile-answers.jpg) · [mini-bar on route detail](../screenshots/mobile-owner/VoiceMode/15-auto-start.jpg) |

Home chrome to copy is the 2026-09-22 1:45 still. Black bezel, small island in the status bar. That still’s banner still says “Want 20 more credits?”. The live banner is “Want 50 more credits?” with “G2: 30 · Product Hunt: 20”, and it opens the review sheet. Ready, neither sent: [Review on G2 / Review on Product Hunt](../screenshots/mobile-owner/Dashboard/review-rewards-ready.png). Pending: [both submitted](../screenshots/mobile-owner/Dashboard/review-rewards-pending.png). After G2 is verified: [G2 review done](../screenshots/mobile-owner/Dashboard/review-rewards-g2-verified.png). The 19.36.33 still is the same home with activity rows. The 19.36.28 still is the location prompt, not the home.

Footer from the home tiles, in order: Find Leads, Address Book, Routes, Lists, Settings. Find Leads opens `AIFindLeadsChat` and has no footer. The still on step 3 is the older city and ZIP form, `MultipleAIWaypoint`. The live chat is one circle, 1–10 miles, then the business-type question, then that same results screen. Since 2026-09-29 the chat’s map-circle search fails on the server (web commit `abe88426`). “Type a city or ZIP instead” still works. See [05 — Find Leads](../features/05-Find-Leads.md).

Step 7b buys contacts in bulk through `Contact` → `BulkContactPeople` → `BulkContactReview`. Nothing is charged until the rep confirms. Each contact is bought in its own request, one after another, so a large selection takes minutes. See [09 — Contact Enrichment](../features/09-Contact-Enrichment-Credits.md).

Voice Mode (step 11) is one session that keeps running across screens. The voice screens show footer index 4 with Routes lit. On any other screen a mini-bar shows the state and the next stop: inside the footer, or below the screen where there is no footer. It is not a footer tab and not a Dashboard tile. See [22 — Voice Mode](../features/22-Voice-Mode.md).
