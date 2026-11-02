# Web user flow

Sales Agent and Business Sales Agent. Both land on `/dashboard`. Classic Blade and AdminLTE. Not the manager cockpit and not HQ.

Who can do what: [User](../roles/user.md). Step shape: [web user detail](web-user-detail.md). Pixel rules: [screenshot review](../screenshots/REVIEW.md).

| Step | Screen | Still |
|---|---|---|
| 1 | Login | [Login](../screenshots/web/public/web_auth_01_login_w1440.png) |
| 2 | Register | [Register](../screenshots/web/public/web_auth_02_register_w1440.png) |
| 3 | Home — Welcome, six cards, Activity, Tutorial | [Dashboard](../screenshots/web/sales-agent/web_01_dashboard_w1440.png) |
| 3b | Unlock 50 free credits — day-two email, not a home card | [Unlock credits](../screenshots/web/sales-agent/review-credits-desktop.png) |
| 3c | Calendar Activity and Google Calendar sync — the “Calendar” button in the home Activity panel | No still yet (the Dashboard still predates the button) |
| 4 | AI Find Leads — the city or ZIP form (a chat version was reverted on 2026-09-29) | [Find Leads](../screenshots/web/sales-agent/web_06_findleads_w1440.png) |
| 5 | Address Book — companies | [Companies](../screenshots/web/sales-agent/web_03_company_w1440.png) |
| 6 | Contacts | [Contacts](../screenshots/web/sales-agent/web_04_contact_w1440.png) |
| 7 | Routes | [Routes](../screenshots/web/sales-agent/web_09_routes_w1440.png) |
| 7b | Find Contacts in bulk — the modal from route detail, list detail or Address Book | [Find Contacts](<../screenshots/web-owner/Salespeople/Screenshot 2026-09-15 at 12.58.37 PM.png>) · [Bulk contacts completed](<../screenshots/web-owner/Salespeople/Screenshot 2026-09-15 at 1.04.44 PM.png>) |
| 8 | Lists | [Lists](../screenshots/web/sales-agent/web_10_lists_w1440.png) |
| 9 | Recently added companies | [Recently added](../screenshots/web/sales-agent/web_07_recent-company_w1440.png) |
| 10 | Settings | [Settings](../screenshots/web/sales-agent/web_11_salesperson-edit_w1440.png) |
| 11 | Support | [Support](../screenshots/web/sales-agent/web_02_support-create_w1440.png) |

A Business Sales Agent uses this same home. Their wallet is the manager’s allocation. Still of that home: [BSA dashboard](../screenshots/web/business-sales-agent/web_01_dashboard_w1440.png).

Step 4 is the live page. A chat version (map left, chat right) was on the Search Multiple tab in late September and was reverted on 2026-09-29 by web commit `abe88426`. See [05 — Find Leads](../features/05-Find-Leads.md).

Step 7b is the Find Contacts modal (`#bulkContactsModal`). Pick people at each company, add them to the cart, then Add Contact(s). It ends on “Bulk contacts completed” with the deducted credit. Detail: [web user detail](web-user-detail.md) and [09 — Contact Enrichment](../features/09-Contact-Enrichment-Credits.md).

Step 3b is `/reviews/credits` inside the same AdminLTE chrome. G2 is 30, Product Hunt is 20. Phone width: [unlock credits](../screenshots/web/sales-agent/review-credits-phone.png). The home cards stay the six modules above.

Step 3c opens the “Calendar Activity” modal from the Activity panel’s Upcoming tab. “Sync” connects Google Calendar the first time (“Connect your calendar”, “Continue with Google”) and then sends Meetings and Appointments one way to the rep’s Google Calendar. It reached `master` (production) on 27 October with the button hidden, and the button is back since `d3f75449` (28 October). Detail: [web user detail](web-user-detail.md) and [23 — Calendar Sync](../features/23-Calendar-Sync.md).

Shorter classic stills of the same pages: [company list](../screenshots/web-stills/04-classic-company-list.png), [Find Leads](../screenshots/web-stills/05-classic-findleads.png), [routes](../screenshots/web-stills/06-classic-routes-list.png), [route wizard](../screenshots/web-stills/07-classic-route-wizard-step1.png).
