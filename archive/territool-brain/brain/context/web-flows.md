---
area: context
tags: [brain/context]
ref: "Web flows: every web page per role, and how the core features run on web"
---

# Web flows: every web page per role, and how the core features run on web

The web counterpart of `mobile-flows-captured.md`. §1–§3 are hand-written from runtime observation plus code;
§4 is generated from the runtime exploration (`node tools/web-explore.js`, then `node tools/web-inventory.js`).

**Status labels:** **VERIFIED (runtime)** = the page was loaded as that role on staging on 2026-09-16.
**VERIFIED (code)** = read in `repos/web`. **Not run** = the step writes data, spends credits or pays; per S6.4
it was not submitted. The explorer blocks every non-GET request, so data that a page loads by POST
(DataTables, find-leads search) does not appear in its screenshot.

## 1. The three web surfaces, per role

| Role | Lands on after login | Surface | Evidence |
|---|---|---|---|
| Sales Agent | `/dashboard` | Blade user app | VERIFIED (runtime) |
| Business Sales Agent | `/dashboard` | Blade user app, with a smaller menu (below) | VERIFIED (runtime) |
| Business Agent | `/manager/dashboard` | React manager portal ("TerriTool Cockpit"). It can still open the Blade `/company`, `/routes`, `/lists`, `/contact`, `/findleads` and `/subscription` pages directly | VERIFIED (runtime), access matrix §4 |
| Admin | `/hq/dashboard` | Backpack Admin HQ. **Login needs a reCAPTCHA at `/hq/login`**, which automation does not solve; the shared `/login` refuses Admin ("Sorry, you are not authorize to access this page") | VERIFIED (runtime) for both login pages; HQ pages from the owner's `ADM-*` screenshots and code |

### Blade menu differences (runtime)

| Menu item | Sales Agent | Business Sales Agent |
|---|---|---|
| Credits pill in the top bar (e.g. "8310 Credits") | ✅ | **—** (credits are the manager's allotment) |
| Home · Address Book (Companies, Contacts) · Add Company · Recently Added · Routes · Lists · Settings | ✅ | ✅ |
| Address Book → **Companies With Errors** | ✅ | **—** |
| Leads entry | **AI Find Leads** | **Find Leads** |
| Report Bug · Logout | ✅ | ✅ |

### Settings (`/salesperson/edit`) differences (runtime)

| Part | Sales Agent | Business Sales Agent |
|---|---|---|
| Profile: name, email, phone, password + confirm | ✅ | ✅ |
| Status slots (name + colour, all required) | **7**: Gold, Active, High Priority, Idle, Potential, Reject, Unclassified | **6**: no Gold |
| Categories | ✅ | ✅ |
| MCP Connections · MCP Chat · MCP Sync, "+ Connect new MCP" | ✅ | ✅ |
| Subscription block with Cancel (reason modal "Submit request / Nevermind") | ✅ | the modal markup is present; the plan block differs (not inspected further) |

The same 7 vs 6 split shows on mobile (Settings → Tags: "7 status tags" vs "6 status tags") and in the API
(`getuserstatus` returns 7 vs 6), so it is **consistent across all three surfaces** (VERIFIED runtime,
`TC-F20-001/002`). It likely also explains `KG-UI9` (Admin HQ shows 6 slots), but that is INFERRED, not checked.

## 2. Core web flows (step level)

Each row is one step. "Page" is the URL the step happens on.

### W-F01 Login and session

| # | Step | Page | Status |
|---|---|---|---|
| 1 | Email + password form. No captcha on `/login`; **reCAPTCHA on `/hq/login`** | `/login` | VERIFIED (runtime) |
| 2 | Submit → `CheckUserRole` routes by role: Admin → `/hq/dashboard`, the others away from `/hq/*`; `manager.only` sends a Business Agent into `/manager/*` | → role landing (§1) | VERIFIED (runtime + code `CheckUserRole.php:20-40`) |
| 3 | A signed-in user who opens `/login` or `/` is sent to their landing page | `/login` → `/dashboard` | VERIFIED (runtime) |
| 4 | The login also resolves the time zone by calling `ip-api.com` from the server on every login | — | VERIFIED (code) `Auth/LoginController.php:87-95` |

### W-F05 Dashboard (Sales Agent / Business Sales Agent)

`/dashboard`: "Welcome <name>" with tiles **Find Leads** (Add Company, Find Leads) · **Routes** (View, Create) ·
**Recently Added** (Companies, Contacts) · **Address Book** (Companies, Contacts) · **Lists** (View, Create) ·
**Upload Excel/CSV** (Upload) · **Activity** (Upcoming / Recent tabs) · **Tutorial** (View Guide). The
Business Sales Agent sees the same tiles and the empty state "No upcoming activities". VERIFIED (runtime).

### W-F12 / W-F13 Address Book

| # | Step | Page | Status |
|---|---|---|---|
| 1 | Company list with filters (employee, revenue, status, order, open/close, industry) | `/company` | VERIFIED (runtime) |
| 2 | Add Company form (33 fields) | `/company/create` | VERIFIED (runtime); **submit not run** |
| 3 | Company detail, notes (Activities), contacts | `/company/{id}/view`, `/company/{id}/notes`, `/company/contacts/{id}` | VERIFIED (code, `routes/web.php`) |
| 4 | Contact list; Add contact (13 fields); Upload contacts | `/contact`, `/contact/create` | VERIFIED (runtime); **submit not run** |
| 5 | Map of all / recently added companies | `/company/viewmapallcompany`, `/recent-company/viewmaprecentcompany` | VERIFIED (runtime) |

### W-F06 AI Find Leads

`/findleads` ("AI Find Leads › Create Leads"): Search and **Draw Lasso** controls with an 11-field search form.
The search runs over POST, so results were not observed. Saving leads spends credits (1 per lead,
`business-rules.md` §3), so **saving is never run**. The old `/ai-lead-finder` path returns **404**. VERIFIED (runtime).

### W-F08 / W-F09 Routes

| # | Step | Page | Status |
|---|---|---|---|
| 1 | Routes list with Create Route | `/routes` | VERIFIED (runtime) |
| 2 | Create Route: select companies (40-field form), **Save as Draft**, **Map View** | `/route/step1` | VERIFIED (runtime); **submit not run** |
| 3 | Route view ("Basic Route View") with Back to Routes / Edit; route map | `/route/view/{id}`, `/route/viewmap/{id}` | VERIFIED (runtime) |
| 4 | Edit an existing route: reuses step 1 | `/route/step1/{id}` | VERIFIED (runtime) |
| 5 | Web has **no Mark Visited** (display only; intentional, owner-confirmed) | — | `parity-map.md` F10 |

### W-F11 Lists

`/lists` (Create List, Delete) → `/list/step1` "New List" (select companies, View on Map) → `/list/{id}/view`
→ `/list/viewmap/{id}` → `/list/{id}/edit` "Update List". The Business Sales Agent's lists include
**"manager assigned leads – <date>"** lists created when its manager assigns leads (F06 manager → F24).
VERIFIED (runtime), `/list/596/view`.

### W-F03 Subscription (stops before paying, S6.4)

`/subscription`: "Subscription history of <name>" and "Package Add-Ons history" tables (Package Name,
Amount, Start Date, End Date, Actions) with **Download Invoice**. The Sales Agent gets **Cancel
Subscription**; the Business Sales Agent gets **Subscribe Now** instead (on `/businessagent/subscription`
too). The invoice links (`/subscription/invoice/{id}`, `/subscription/addon/invoice/{id}`) are downloads
(no page). Plans and payment steps are in `business-rules.md` §1–§5 (owner screenshots); **payment is never
submitted**. VERIFIED (runtime).

### W-F26 Support

`/support` (tickets table, Add Ticket, View Detail) → `/support/create` (3 fields). Viewing a ticket is
not crawled, because opening it may mark it read. VERIFIED (runtime).

### W-F27 Push Notification page (reachable by every signed-in web user)

`/notification` ("Push Notification") shows a 2-field form (title, description). **Its POST sends a push
notification to every device token in `usertoken` — every user's phone** (`RouteController.php:1978-2008`),
and the route sits in the general `[web, auth, role]` group (`routes/web.php:230, 570-571`). The page loads
for a Sales Agent (VERIFIED runtime); **the form was not submitted**. Recorded as **UI-SEC-04 (critical)**
in `UPCOMING_IMPROVEMENTS.md`.

### W-F23 / W-F24 Manager portal (Business Agent)

| Page | What it is | Status |
|---|---|---|
| `/manager/dashboard` | "Manager's Dashboard / Sales Team Performance & Insights": This Week / This Month / Quarter, refresh, map segments Zones / Visited / Accounts, KPI cards, leaderboards | VERIFIED (runtime); layout in `web-surfaces.md` §1 |
| `/manager/ai-find-leads` | manager AI Find Leads with a map (draw, undo, zoom); assigning leads to reps spends manager credits (`MGR-03` → `MGR-04`) | VERIFIED (runtime); **assign not run** |
| `/manager/salespeople` | "Your Salespeople" table (Name, Phone, Email, Country, Total Credits …), + Add Salesperson | VERIFIED (runtime) |
| `/manager/salespeople/create` | Add Salesperson (6 fields, colour choice) | VERIFIED (runtime); **submit not run** (it consumes a licence) |
| `/manager/salespeople/{id}/details` | "<rep>'s Profile": list / map of the rep's companies with sorts | VERIFIED (runtime) |
| `/manager/activity` | "Real-Time Sales Rep Activity" feed: All / Visits / Activity / Routes / Lists | VERIFIED (runtime) |
| `/manager/reports` | "Reports": **an empty placeholder page** | VERIFIED (runtime) |
| `/manager/support`, `/manager/support/create` | tickets table; Add Support Ticket | VERIFIED (runtime) |
| `/manager/settings` | Edit Profile (name, email, phone, password), subscription status, **Cancel** with a reason modal | VERIFIED (runtime); **cancel not run** |
| `/businessagent/subscription` | Blade page: subscription history + "Active Subscription Detail" (package, e.g. Deluxe Business) + Cancel Subscription | VERIFIED (runtime) |
| Legacy Blade `/businesssalesperson` | redirects a Business Agent to `/manager/salespeople` | VERIFIED (runtime) |

### W-F25 Admin HQ (read-only; live login blocked by reCAPTCHA)

From code (`routes/web.php:97-180`) and the owner's `ADM-01`…`ADM-21` screenshots: Home dashboard ·
Subscription Dashboard · Cancelled subscribers (+ RevenueCat trials) · Sales Agents (`/hq/salesperson`:
list, create, edit, credits, convert to manager, AI search log, activity) · Business Client
(`/hq/businessclient`: list, create, edit, its salespeople, credits, resend invitation) · Promotion
Codes · Special discounts · Settings · Support · User devices. **Several HQ GET URLs change data**
(activate/deactivate subscription, lifetime, delete, resend invitation, calculate route): see UI-SEC-03.

## 3. What is not covered yet

- Admin HQ at runtime (captcha; needs a person to sign in; see `UNKNOWN_REGISTER.md` U-ADM-01).
- Result pages that load by POST (find-leads results, DataTables contents).
- Web registration (`/register`, `/trial`, `/b2b`), deliberately not crawled because it creates accounts.
- Bulk CSV upload steps (F22) past the upload page.

## 4. Runtime inventory (generated)

<!-- web-inventory:start (generated by tools/web-inventory.js; do not edit inside) -->
Captured **2026-09-16 13:46 UTC** on staging by `tools/web-explore.js` (read-only guard). Screenshots: `workspace/qa-evidence/2026-09-16/web/<role>/`.

### Login outcome per role

| Role | Login page | Captcha | Result | Landed on |
|---|---|---|---|---|
| Sales Agent | `/login` | no | OK | `/dashboard` |
| Business Sales Agent | `/login` | no | OK | `/dashboard` |
| Business Agent | `/login` | no | OK | `/manager/dashboard` |
| Admin | `/hq/login` | **yes** | **BLOCKED** | `/hq/login` |
| Sales Agent (run `web-explore.paths-sales-agent_business-sales-agent.json`) | `/login` | no | OK | `/dashboard` |
| Business Sales Agent (run `web-explore.paths-sales-agent_business-sales-agent.json`) | `/login` | no | OK | `/dashboard` |
| Admin (run `web-explore.roles-admin.json`) | `/login` | no | **BLOCKED**: Please fix the following errors: We are not able to connect with your credential, Please e | `/login` |

### Access matrix (each role requested each path; where it landed)

| Path | Sales Agent | Business Sales Agent | Business Agent |
|---|---|---|---|
| `/dashboard` | ✅ 200 | ✅ 200 | ↪ `/manager/dashboard` |
| `/company` | ✅ 200 | ✅ 200 | ✅ 200 |
| `/routes` | ✅ 200 | ✅ 200 | ✅ 200 |
| `/lists` | ✅ 200 | ✅ 200 | ✅ 200 |
| `/contact` | ✅ 200 | ✅ 200 | ✅ 200 |
| `/findleads` | ✅ 200 | ✅ 200 | ✅ 200 |
| `/salesperson/edit` | ✅ 200 | ✅ 200 | ↪ `/manager/settings` |
| `/subscription` | ✅ 200 | ✅ 200 | ✅ 200 |
| `/businessagent/subscription` | ✅ 200 | ✅ 200 | ✅ 200 |
| `/businesssalesperson` | ✅ 200 | ✅ 200 | ↪ `/manager/salespeople` |
| `/support` | ✅ 200 | ✅ 200 | ↪ `/manager/support` |
| `/manager/dashboard` | ↪ `/dashboard` | ↪ `/dashboard` | ✅ 200 |
| `/manager/salespeople` | ↪ `/dashboard` | ↪ `/dashboard` | ✅ 200 |
| `/manager/settings` | ↪ `/dashboard` | ↪ `/dashboard` | ✅ 200 |
| `/hq` | ↪ `/dashboard` | ↪ `/dashboard` | ↪ `/manager/dashboard` |
| `/hq/dashboard` | ↪ `/dashboard` | ↪ `/dashboard` | ↪ `/manager/dashboard` |
| `/hq/salesperson` | ↪ `/dashboard` | ↪ `/dashboard` | ↪ `/manager/dashboard` |
| `/hq/businessclient` | ↪ `/dashboard` | ↪ `/dashboard` | ↪ `/manager/dashboard` |
| `/hq/settings` | ↪ `/dashboard` | ↪ `/dashboard` | ↪ `/manager/dashboard` |

### Sales Agent: pages reached (30)

**Menu:** 8310 Credits · Report Bug · Logout · How To Generate Security Token? · Home · Address Book · Companies · Contacts · Companies With Errors · AI Find Leads · Add Company · Recently Added · Routes · Lists · Settings

| # | Requested → final | HTTP | Heading | Main actions | Page forms (fields) | Tables (columns) |
|---|---|---|---|---|---|---|
| 1 | `/dashboard` | 200 | Welcome Ann | Add Company / Find Leads / Find Contacts / View / Create / Companies | — | — |
| 2 | `/company` | 200 | Address Book | Add Company / Find Leads / Find Contacts / Delete / Add to Route / View on Map | — | 7, 4 |
| 3 | `/recent-company` | 200 | Recently Added | Add Company / Find Leads / Delete / Add to Route / View on Map / Add to List | — | 7, 4 |
| 4 | `/routes` | 200 | Routes | Create Route / Cancel / OK / Apply | — | 7, 6, 3 |
| 5 | `/lists` | 200 | Lists | Create List / Delete / Cancel | — | 3 |
| 6 | `/contact` | 200 | Contacts All contacts in the database | Add contact / Upload contacts / Delete / Edit / Cancel / Update | — | — |
| 7 | `/salesperson/edit` | 200 | Settings | MCP Connections / MCP Chat / MCP Sync / View Invoice / Cancel / Add New Status | POST `/salesperson/edit` (21) | — |
| 8 | `/subscription` | 200 | subscriptions All subscriptions in the database | Back / Download Invoice / Continue Web App / Continue with FindLeads / Submit | GET `subscriptions/cancelsubscribereason` (1) | 5, 5, 4, 4 |
| 9 | `/support` | 200 | Support Tickets All tickets in the database | Add Ticket / View Detail | — | 7, 7 |
| 10 | `/notification` | 200 | Push Notification | Cancel | POST `/notification` (2) | — |
| 11 | `/findleads` | 200 | AI Find Leads | Search / Draw Lasso / Clear Lasso / Add Leads / Select All / Confirm to Add Leads | — | — |
| 12 | `/ai-lead-finder` | 404 | — | Go to Homepage | — | — |
| 13 | `/route/step1` | 200 | Create Routes | Save as Draft / Map View / Find Leads / Filter / Next Step / View selected companies | POST `/route/step1` (40) | 9, 8, 7, 4 |
| 14 | `/list/step1` | 200 | New List | View on Map / Company / Find Leads / Filter / Next Step / Search | POST `/list/step1` (40) | 9, 8, 7, 4 |
| 15 | `/company/create` | 200 | Add Company | Add / Cancel | POST `/company/create` (33) | — |
| 16 | `/contact/create` | 200 | Add Contact | Add / Cancel | POST `/contact/create` (13) | — |
| 17 | `/` → `/dashboard` | 200 | Welcome Ann | Add Company / Find Leads / Find Contacts / View / Create / Companies | — | — |
| 18 | `/support/create` | 200 | Add Support Tickets | Add / Cancel | POST `/support/create` (3) | — |
| 19 | `/recent-contact` | 200 | Recently Added All contacts in the database | Add contact / Upload contacts / Delete / Edit / Cancel / Update | — | — |
| 20 | `/company/viewmapallcompany` | 200 | View All Companies (Map) | Back / Apply Filter / Clear Filter / Create Lasso / Clear Lasso / Confirm | — | 7, 4 |
| 21 | `/recent-company/viewmaprecentcompany` | 200 | View Recently Added Companies (Map) | Back / Apply Filter / Clear Filter / Create Lasso / Clear Lasso / Confirm | — | 7, 4 |
| 22 | `/route/view/3910` | 200 | Fresh AI | Back Back to Routes / Edit / Back to Routes / Download PDF / Edit Route / Export CSV | — | 7, 4, 3 |
| 23 | `/route/step1/3910` | 200 | Create Routes | Save as Draft / Map View / Find Leads / Add Company / Filter / Next Step | POST `/route/step1/3910` (40) | 9, 8, 7, 4 |
| 24 | `/route/viewmap/3910` | 200 | View Route On Map | Back / Apply Filter / Clear Filter / Create Lasso / Clear Lasso / Confirm | — | 7, 4 |
| 25 | `/list/598/view` | 200 | Fresh Demo List | Back Back to Lists / Back to Lists / Filter / Add Company / Find Leads / Find Contacts | — | 7, 4, 3 |
| 26 | `/list/viewmap/598` | 200 | View List On Map | Back / Apply Filter / Clear Filter / Create Lasso / Clear Lasso / Confirm | — | 7, 4 |
| 27 | `/list/598/edit` | 200 | Update List | View on Map / Company / Find Leads / Filter / Next Step / Search | POST `/list/598/edit` (40) | 9, 8, 7, 4 |
| 28 | `/subscription/invoice/118` → `/list/598/edit` | — | Update List | View on Map / Company / Find Leads / Filter / Next Step / Search | POST `/list/598/edit` (40) | 9, 8, 7, 4 |
| 29 | `/subscription/addon/invoice/75` → `/list/598/edit` | — | Update List | View on Map / Company / Find Leads / Filter / Next Step / Search | POST `/list/598/edit` (40) | 9, 8, 7, 4 |
| 30 | `/login` → `/dashboard` | 200 | Welcome Ann | Add Company / Find Leads / Find Contacts / View / Create / Companies | — | — |

### Business Sales Agent: pages reached (22)

**Menu:** Report Bug · Logout · How To Generate Security Token? · Home · Address Book · Companies · Contacts · Find Leads · Add Company · Recently Added · Routes · Lists · Settings

| # | Requested → final | HTTP | Heading | Main actions | Page forms (fields) | Tables (columns) |
|---|---|---|---|---|---|---|
| 1 | `/dashboard` | 200 | Welcome Anna | Add Company / Find Leads / Find Contacts / View / Create / Companies | — | — |
| 2 | `/company` | 200 | Address Book | Add Company / Find Leads / Find Contacts / Delete / Add to Route / View on Map | — | 7, 4 |
| 3 | `/routes` | 200 | Routes | Create Route / Cancel / OK / Apply | — | 7, 6, 3 |
| 4 | `/lists` | 200 | Lists | Create List / Delete / Cancel | — | 3 |
| 5 | `/contact` | 200 | Contacts All contacts in the database | Add contact / Upload contacts / Delete / Edit / Cancel / Update | — | — |
| 6 | `/salesperson/edit` | 200 | Settings | MCP Connections / MCP Chat / MCP Sync / View Invoice / Add New Status / Save Changes | POST `/salesperson/edit` (18) | — |
| 7 | `/subscription` | 200 | subscriptions All subscriptions in the database | Subscribe Now / Back / Continue Web App / Continue with FindLeads / Submit | GET `subscriptions/cancelsubscribereason` (1) | 5, 5, 4, 4 |
| 8 | `/support` | 200 | Support Tickets All tickets in the database | Add Ticket | — | 7, 7 |
| 9 | `/findleads` | 200 | AI Find Leads | Search / Draw Lasso / Clear Lasso / Add Leads / Select All / Confirm to Add Leads | — | — |
| 10 | `/` → `/dashboard` | 200 | Welcome Anna | Add Company / Find Leads / Find Contacts / View / Create / Companies | — | — |
| 11 | `/support/create` | 200 | Add Support Tickets | Add / Cancel | POST `/support/create` (3) | — |
| 12 | `/recent-company` | 200 | Recently Added | Add Company / Find Leads / Delete / Add to Route / View on Map / Add to List | — | 7, 4 |
| 13 | `/recent-contact` | 200 | Recently Added All contacts in the database | Add contact / Upload contacts / Delete / Edit / Cancel / Update | — | — |
| 14 | `/route/step1` | 200 | Create Routes | Save as Draft / Map View / Find Leads / Filter / Next Step / View selected companies | POST `/route/step1` (40) | 9, 8, 7, 4 |
| 15 | `/list/step1` | 200 | New List | View on Map / Company / Find Leads / Filter / Next Step / Search | POST `/list/step1` (40) | 9, 8, 7, 4 |
| 16 | `/company/viewmapallcompany` | 200 | View All Companies (Map) | Back / Apply Filter / Clear Filter / Create Lasso / Clear Lasso / Confirm | — | 7, 4 |
| 17 | `/route/view/3902` | 200 | Test Brain 0002 | Back Back to Routes / Edit / Back to Routes / Download PDF / Edit Route / Export CSV | — | 7, 4, 3 |
| 18 | `/route/step1/3902` | 200 | Create Routes | Save as Draft / Map View / Find Leads / Add Company / Filter / Next Step | POST `/route/step1/3902` (40) | 9, 8, 7, 4 |
| 19 | `/route/viewmap/3902` | 200 | View Route On Map | Back / Apply Filter / Clear Filter / Create Lasso / Clear Lasso / Confirm | — | 7, 4 |
| 20 | `/list/596/view` | 200 | manager assigned leads - Tue, Sep 15, 2026 - 9:16 pm | Back Back to Lists / Back to Lists / Filter / Add Company / Find Leads / Find Contacts | — | 7, 4, 3 |
| 21 | `/list/viewmap/596` | 200 | View List On Map | Back / Apply Filter / Clear Filter / Create Lasso / Clear Lasso / Confirm | — | 7, 4 |
| 22 | `/list/596/edit` | 200 | Update List | View on Map / Company / Find Leads / Filter / Next Step / Search | POST `/list/596/edit` (40) | 9, 8, 7, 4 |

### Business Agent: pages reached (17)

**Menu:** React sidebar (not matched by the menu selector; see `web-surfaces.md` §1)

| # | Requested → final | HTTP | Heading | Main actions | Page forms (fields) | Tables (columns) |
|---|---|---|---|---|---|---|
| 1 | `/manager/dashboard` | 200 | Manager's Dashboard | This Week / This Month / Quarter / 🔄 / Zones / Visited | — | 9, 7 |
| 2 | `/manager/ai-find-leads` | 200 | AI Find Leads | Clear / Keyboard shortcuts / Undo last edit / Toggle fullscreen view / Zoom in / Zoom out | — | — |
| 3 | `/manager/salespeople` | 200 | Your Salespeople | + Add Salesperson / Name↕ / Phone↕ / Email↕ / Country↕ / Total Credits↕ | — | 8 |
| 4 | `/manager/salespeople/create` | 200 | Add Salesperson | Use color #124ac6 / Use color #8b5cf6 / Use color #00a99d / Use color #f59e0b / Use color #ef4444 / Use color #00bcf0 | — | — |
| 5 | `/manager/activity` | 200 | Activity | 🔄 / All / Visits / Activity / Routes / Lists | — | — |
| 6 | `/manager/reports` | 200 | Reports | — | — | — |
| 7 | `/manager/support` | 200 | Support Tickets | + Add Ticket / #Ticket No.↕ / Title↕ / Description↕ / Status↕ / Created Date↕ | — | 7 |
| 8 | `/manager/support/create` | 200 | Add Support Ticket | Cancel / Add Ticket | — | — |
| 9 | `/manager/settings` | 200 | Settings | Toggle password / Toggle confirmation / Cancel / Save Changes / Submit request / Nevermind, I don't want to cancel. | — | — |
| 10 | `/businesssalesperson` → `/manager/salespeople` | 200 | Your Salespeople | + Add Salesperson / Name↕ / Phone↕ / Email↕ / Country↕ / Total Credits↕ | — | 8 |
| 11 | `/businessagent/subscription` | 200 | subscriptions All subscriptions in the database | Cancel Subscription / Download Invoice / Submit | GET `subscriptions/cancelsubscribereason` (1) | 5, 5 |
| 12 | `/dashboard` → `/manager/dashboard` | 200 | Manager's Dashboard | This Week / This Month / Quarter / 🔄 / Zones / Visited | — | 9, 7 |
| 13 | `/manager/salespeople/1671/details` | 200 | Anna's Profile | Apply / List / Map / Sort Company / Sort Address / Sort Phone No | — | 8 |
| 14 | `/subscription` | 200 | subscriptions All subscriptions in the database | Back / Download Invoice / Continue Web App / Continue with FindLeads / Submit | GET `subscriptions/cancelsubscribereason` (1) | 5, 5, 4, 4 |
| 15 | `/` → `/manager/dashboard` | 200 | Manager's Dashboard | This Week / This Month / Quarter / 🔄 / Zones / Visited | — | 9, 7 |
| 16 | `/support/create` → `/manager/support/create` | 200 | Add Support Ticket | Cancel / Add Ticket | — | — |
| 17 | `/subscription/invoice/2566` → `/manager/support/create` | — | Add Support Ticket | Cancel / Add Ticket | — | — |
<!-- web-inventory:end -->

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (42)

**Documents (29):** [[brain/context/mobile-flows-captured|App journeys from screenshots]] · [[brain/audits/10-brain-final-audit|Audit 10 — Territool AI Brain final audit]] · [[brain/context/brain-qa|Brain QA: questions the brain must answer correctly, and how it did]] · [[brain/context/brain-scorecard|Brain scorecard: 18 categories, rubric, iterations]] · [[brain/context/business-rules|Business rules: plans, credits and money]] · [[brain/context/contradiction-register|Contradiction register: where two sources disagreed, and which won]] · [[brain/memory/entries/conflict/20260917-8864f4-cr-19-flows-md-f27-notifications-web-suggests-an|CR-19 — flows.md F27 "Notifications: web ✅" (suggests an inbox) ↔ the web /notification page is a broadcast sender, n…]] · [[brain/memory/entries/qa/20260917-342f73-ev-c09-the-web-login-calls-ip-api-com-on-every-l|EV-C09 — The web login calls ip-api.com on every login to set the time zone]] · [[brain/memory/entries/qa/20260917-9df437-ev-m10-bsa-lists-include-manager-assigned-leads-|EV-M10 — BSA lists include "manager assigned leads – " lists]] · [[brain/memory/entries/qa/20260917-759d7d-ev-w01-69-pages-reached-with-no-data-written-eve|EV-W01 — 69 pages reached with no data written (every non-GET aborted); per-page headings, actions, forms and tables]] · [[brain/memory/entries/qa/20260917-d2352b-ev-w03-hq-login-shows-a-recaptcha-automated-admi|EV-W03 — /hq/login shows a reCAPTCHA; automated Admin login is BLOCKED]] · [[brain/memory/entries/qa/20260917-0b70e5-ev-w04-the-shared-login-refuses-an-admin-sorry-y|EV-W04 — The shared /login refuses an Admin ("Sorry, you are not authorize to access this page")]] · [[brain/memory/entries/qa/20260917-c9ece8-ev-w05-menu-the-bsa-has-no-credits-pill-sees-fin|EV-W05 — Menu: the BSA has no credits pill, sees "Find Leads" (not "AI Find Leads") and no "Companies With Errors". Se…]] · [[brain/memory/entries/qa/20260917-1beb34-ev-w08-manager-reports-is-an-empty-placeholder-t|EV-W08 — /manager/reports is an empty placeholder; the portal pages and their controls are listed]] · [[brain/memory/entries/qa/20260917-6de1cf-ev-w09-ai-lead-finder-returns-404-findleads-is-t|EV-W09 — /ai-lead-finder returns 404; /findleads is the AI Find Leads page]] · [[brain/context/evidence-ledger|Evidence ledger: what was checked, how, and what it proves]] · [[brain/context/parity-map|Mobile vs web differences]] · [[workspace/design-proposals/2026-09-17-lists-library-filter/placement|Placement walk-through: "add a filter to the Lists library"]] · [[brain/context/flows|Product features list]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/roles-permissions|Roles and permissions: who can do what, where, and what enforces it]] · [[CLAUDE|Start here – brain overview]] · [[brain/context/system-map|System map: role → platform → screen → action → API → data → result → next]] · [[workspace/test-cases/F25-admin-hq-gate|Test cases — F25 Admin HQ (role gate) (P2)]] · [[brain/context/web-surfaces|The three web surfaces, and how each one is built]] · [[brain/memory/entries/product/20260917-c9b432-ui-ux-07-lists-can-t-be-filtered-by-shared-with-|UI-UX-07 — Lists can't be filtered by "shared with me", "unread" (web shows an Unread tile) or "assigned by manager" on…]] · [[brain/context/UNKNOWN_REGISTER|Unknown register: what the brain does not know yet]] · [[brain/context/UPCOMING_IMPROVEMENTS|Upcoming improvements: application findings not fixed during the brain work]] · [[workspace/handoff/2026-09-17-company-details-web/result|Web Company Details UI — handoff]]

**Product features (6):** [[_id/F25|Admin HQ]] · [[_id/F06|AI Find Leads → save leads]] · [[_id/F22|Bulk CSV upload]] · [[_id/F24|Business Sales Agent management]] · [[_id/F10|Mark visited & visit log]] · [[_id/F27|Notifications & push]]

**Coding rule (1):** [[_id/S6.4|Staging test data rules]]

**Problem found (1):** [[_id/KG-UI9|Admin HQ "Edit salesperson" exposes 6 status slots,…]]

**Screenshots (4):** [[_capture/ADM-01|Admin HQ Home — leaderboard + timeframe stats (Logged In, Created Routes, Activity, New Users)]] · [[_capture/ADM-21|Admin login — E-Mail, Password, **reCAPTCHA 'I'm not a robot'**, Remember Me, Forgot Your Password]] · [[_capture/MGR-04|AI Find Leads — '5 leads assigned successfully' toast; credits fell 100 → 86 and the list went 264 → 250 (assignment consumes credits; the per-lead rate is not confirmed from this frame)]] · [[_capture/MGR-03|AI Find Leads Step 3 — 264 leads from 2 search areas; select by checkbox or Lasso/Pan, then 'Assign leads' to a salesperson; '100 credits remaining']]

**Code file (1):** [[_code/web/app/Http/Controllers/Auth/LoginController.php|LoginController]]

%% brain-links:end %%
