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

## 3. Find Leads, then the company

- **From** — home card
- **Do** — search, then open the company in Address Book
- **Copy** — classic Find Leads, then the company list
- **Next** — contacts on that company, or a route
- **Stop** — do not use the manager Find Leads island on this page

Stills:

- [Find Leads](../screenshots/web/sales-agent/web_06_findleads_w1440.png)
- [Find Leads, short still](../screenshots/web-stills/05-classic-findleads.png)
- [Companies](../screenshots/web/sales-agent/web_03_company_w1440.png)
- [Company list, short still](../screenshots/web-stills/04-classic-company-list.png)
- [Contacts](../screenshots/web/sales-agent/web_04_contact_w1440.png)
- [Recently added](../screenshots/web/sales-agent/web_07_recent-company_w1440.png)

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
