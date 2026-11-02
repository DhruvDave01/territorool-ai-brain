# Web user flow — detail

Copy this shape when a new classic-web requirement arrives. Map: [web-user.md](web-user.md). Role: [User](../roles/user.md). Pixels: [screenshot review](../screenshots/REVIEW.md).

Sales Agent and Business Sales Agent both use this path. Stack is Blade and AdminLTE. Not the manager cockpit.

## 1. Login

- **From** — logged out
- **Do** — sign in, or open register
- **Copy** — the public login page
- **Next** — `/dashboard`
- **Stop** — do not send this role to `/manager` or `/hq`

Stills:

- [Login, desktop](../screenshots/web/public/web_auth_01_login_w1440.png)
- [Login, phone width](../screenshots/web/public/web_auth_01_login_w390.png)
- [Register](../screenshots/web/public/web_auth_02_register_w1440.png)
- [Reset password](../screenshots/web/public/web_auth_03_password-reset_w1440.png)

## 2. Home

- **From** — login
- **Do** — open a card: Find Leads, Routes, Recently Added, Address Book, Lists, or Upload
- **Copy** — white header, Upgrade, credits pill, icon sidebar, six cards, Activity, Tutorial
- **Next** — the card they picked
- **Stop** — do not drop a manager sidebar or a full-page takeover on this home

Stills:

- [Dashboard](../screenshots/web/sales-agent/web_01_dashboard_w1440.png)
- [Dashboard, phone width](../screenshots/web/sales-agent/web_01_dashboard_w390.png)
- [Business Sales Agent home, same layout](../screenshots/web/business-sales-agent/web_01_dashboard_w1440.png)

## 2b. Unlock credits

- **From** — about 24 hours after web signup, the email “50 more credits ready to redeem”. The button is “Redeem 50 Credits”. A signed-in user can also open `/reviews/credits` directly
- **Do** — “Leave a G2 review” (30) or “Leave a Product Hunt review” (20). The click opens that site and posts `type` `g2` or `ph`
- **Copy** — [desktop](../screenshots/web/sales-agent/review-credits-desktop.png) and [phone](../screenshots/web/sales-agent/review-credits-phone.png). Title “Unlock 50 free credits”. Crumb “Unlock Credits”. Same header, credits pill, and sidebar as home
- **Next** — the page stays here. The button becomes “Submitted” and the row shows “Pending verification”. The credit number comes off that row. Both submitted shows “Back to dashboard”. Both verified shows “You unlocked 50 credits. They are already in your balance.”
- **Stop** — do not add this panel to the home cards. Do not build it as a manager or HQ page. The POST records the attempt. It does not add the credits

## 2c. Calendar and Google Calendar sync

- **From** — home, the “Calendar” button in the header of the Activity panel. It shows on the Upcoming tab only
- **Do** — pick a day in “Calendar Activity”, or press “Sync”. Not connected: “Connect your calendar”, then “Continue with Google” (`GET /calendar/google/connect`), Google consent, and back to `/dashboard` (`/calendar/google/callback`), where the modal reopens with “Google Calendar connected. Click Sync to send meetings and appointments.” Connected: “Sync” posts `/calendar/google/sync`
- **Copy** — the modal “Calendar Activity”, “Your scheduled visits, calls, and reminders.”, a month grid, the day list, and “Times shown in your account timezone.” The connect modal has one provider, Google, and “Meetings and appointments only.” / “One-way sync from TerriTool.”
- **Next** — the status line under the title: “Google Calendar is up to date.” or “Google Calendar: {n} activities sent, {n} removed, {n} failed.” (only the non-zero parts), then “Last sync”. An expired Google connection shows “Connect Google Calendar again.” and the connect modal
- **Stop** — sync is one-way and on demand; only Meetings and Appointments with a date go to Google, while the grid shows every dated activity. There is no Settings entry and no disconnect. Do not add a Microsoft option; it is commented out. See [23 — Calendar Sync](../features/23-Calendar-Sync.md)

Stills:

- None of the modals yet. The [Dashboard](../screenshots/web/sales-agent/web_01_dashboard_w1440.png) still (15 September) predates the button; on the live page it sits before the “Activity” title (`front/dashboard.blade.php:759`).

## 3. Find Leads, then the company

- **From** — home card
- **Do** — search, then open the company in Address Book
- **Copy** — classic Find Leads, then the company list. The Search Multiple tab of `/findleads` is the city or ZIP form, headed “Set your selling territory — we’ll do the rest.” A chat version was added in late September and reverted on 2026-09-29 (`abe88426`), so these stills show the live page
- **Next** — contacts on that company, or a route
- **Stop** — do not use the manager Find Leads island on this page. Do not rebuild the reverted chat as if it were live

Stills:

- [Find Leads](../screenshots/web/sales-agent/web_06_findleads_w1440.png)
- [Find Leads, short still](../screenshots/web-stills/05-classic-findleads.png)
- [Companies](../screenshots/web/sales-agent/web_03_company_w1440.png)
- [Company list, short still](../screenshots/web-stills/04-classic-company-list.png)
- [Contacts](../screenshots/web/sales-agent/web_04_contact_w1440.png)
- [Recently added](../screenshots/web/sales-agent/web_07_recent-company_w1440.png)

## 3b. Find Contacts in bulk

- **From** — the “Find Contacts” button on route detail, list detail, or Address Book
- **Do** — Select Contacts on a company, tick people, then Add Contact(s). A company with no database match shows “Searching {source}…” while a Claude lookup runs
- **Copy** — the modal “Find Contacts”, “Prospect and manage leads within your selected company list.” All Companies is on the left, with counts and Load More Companies. Selected Contacts is on the right, with the contact and credit totals and Add Contact(s)
- **Next** — the progress card (“Aggregating contact data from multiple sources”, “You may exit this screen and contacts will load in the background”), then “Bulk contacts completed” with “Deducted credit”. If the modal is closed, a panel at the bottom right shows “Adding contacts” and “{n} of {total} saved”
- **Stop** — a contact costs 2 credits, or 1 on the Claude path. The modal’s progress bar is a timer, not real progress. The saved count is the real one. Insufficient credits opens Cancel / Upgrade. See [09 — Contact Enrichment](../features/09-Contact-Enrichment-Credits.md)

Stills:

- [Find Contacts modal, from a route](<../screenshots/web-owner/Salespeople/Screenshot 2026-09-15 at 12.58.37 PM.png>)
- [People at one company](<../screenshots/web-owner/Salespeople/Screenshot 2026-09-15 at 12.58.51 PM.png>)
- [Selected contacts and the credit total](<../screenshots/web-owner/Salespeople/Screenshot 2026-09-15 at 12.59.17 PM.png>)
- [Progress card](<../screenshots/web-owner/Salespeople/Screenshot 2026-09-15 at 12.59.26 PM.png>)
- [Bulk contacts completed](<../screenshots/web-owner/Salespeople/Screenshot 2026-09-15 at 1.04.44 PM.png>)
- [Insufficient credits: Cancel / Upgrade](<../screenshots/web-owner/Salespeople/Screenshot 2026-09-15 at 1.53.47 PM.png>)

## 4. Route or list

- **From** — companies already saved
- **Do** — create a route, or a list
- **Copy** — the routes page, then the route wizard, then lists
- **Next** — the route or the list they just made
- **Stop** — a list is not a driving order

Stills:

- [Routes](../screenshots/web/sales-agent/web_09_routes_w1440.png)
- [Routes, short still](../screenshots/web-stills/06-classic-routes-list.png)
- [Route wizard, step 1](../screenshots/web-stills/07-classic-route-wizard-step1.png)
- [Lists](../screenshots/web/sales-agent/web_10_lists_w1440.png)

## 5. Settings and support

- **From** — sidebar
- **Do** — edit the profile, or open a ticket
- **Copy** — the settings page, then support
- **Next** — back to home
- **Stop** — do not restyle these as manager pages

Stills:

- [Settings](../screenshots/web/sales-agent/web_11_salesperson-edit_w1440.png)
- [Support](../screenshots/web/sales-agent/web_02_support-create_w1440.png)

## New requirement

Write the new step in this same block. Point **Copy** at the nearest still above. Stay on classic Blade.
