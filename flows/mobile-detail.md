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

- **From** — home tile or footer
- **Do** — search, then confirm selected leads
- **Copy** — Find Leads chrome. This screen has no footer
- **Next** — the saved companies are in Address Book
- **Stop** — search is free. Do not charge it. Do not save with the manual add-company action

Stills:

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

## New requirement

Write the new step in this same block. Point **Copy** at the nearest still above. If no still shows that screen, stop and ask.
