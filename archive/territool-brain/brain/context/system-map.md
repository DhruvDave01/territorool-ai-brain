---
status: REVALIDATED-STRUCTURE-2026-09-17
area: context
tags: [brain/context]
ref: "System map: role → platform → screen → action → API → data → result → next"
---

# System map: role → platform → screen → action → API → data → result → next

> [!check] Re-validated 2026-09-17 (structure) — the earlier NEEDS-REVALIDATION flag is closed
> `node tools/note-revalidate.js` resolved all 119 structural claims in this note (endpoints, screens, tables, files
> and line numbers, ids) against the current code and brain data (mobile `f20c5aa`, web `21d6348c`): 0 unresolved.
> Checked against: `brain/audits/data/api-map.json` (endpoints), `brain/audits/data/data-model.json` (tables), `repos/mobile/App/App.js` (screens), `repos/web/routes/web.php` (web routes), `brain/context/evidence-ledger.md` and the other registers (ids).
> **Not re-observed:** runtime (RT) and owner-capture claims keep their original 2026-09-16 date and tier.

One row per core user action, traced end to end. Use it to answer "what happens after X?", "what API
powers this screen?" and "what data does this touch?". Details live in `flows.md` (features),
`mobile-flows-captured.md` / `web-flows.md` (steps), `api-map.md` (endpoints), `data-model.md` (tables),
`roles-permissions.md` (who).

**Status column:** **RT** = the screen and step were seen at runtime on 2026-09-16 (no write submitted) ·
**RT-W** = the write itself was observed in owner captures or recordings · **Code** = traced in code only.
💳 = spends credits or money: never run by the brain (S6.4).

Roles: **SA** Sales Agent · **BSA** Business Sales Agent · **BA** Business Agent · **AD** Admin.

## 1. Mobile (SA, BSA)

| # | Role | Screen (`App/App.js` name) | Action | API (V2) | Data | Result | Next state | Status |
|---|---|---|---|---|---|---|---|---|
| M1 | SA, BSA | `Login` | submit email + password | `POST login` (+ `device_type`, `device_token`) | reads `users` + `role_users`; **inserts `usertoken`** | JWT + profile saved in Realm `JWTToken` | `Dashboard` (iOS may show "Save Password?") | RT |
| M2 | SA, BSA | `Dashboard` | open | `GET getusercredit`, `POST getUserActivity`, `POST getcompanyactivities`, `POST getversiondetails` (app-update modal) (`dashboard/index.js`) | `user_credits` (+ `businessclient_salesagent_credits` for a BSA), `user_packages`, `activities`, `company_notes` | credits pill, tile badges (unread routes/lists), Upcoming/Recent | any tile; QR (`QrCodeScanner`); settings (`EditStatus`) | RT |
| M3 | SA, BSA | `MultipleAIWaypoint` | search a territory + ideal customer | `POST getAILeads` / `getAILeadsV2`, then `POST resumeAILeadSearch` while in progress (`aiFindLeads.js:8184`; `config/index.js:96, 102-103`) | `user_ai_search`; Realm `AIFindLeads` (last search restored) | lead list (not saved yet) | select leads → Next step | RT (screen) · Code (search) |
| M4 | SA, BSA | `MultipleAIWaypoint` | save selected leads 💳 | `POST saveAILeads` (`URL_AI_BULK_COMPANIES_CREATE`, 1 credit per lead) | inserts `companies`; `user_credits.used_credit` += n | leads become Companies | `CreateRoute` or `CreateLists` with them selected | RT-W (owner captures AI-*) · Code |
| M5 | SA, BSA | `CreateRoute` → `SelectStartEndPoints` → `PublishRoute` | name, pick 2–400 stops, start/end, publish | `POST checkroutename`, `POST companylist`, `POST createroute` | `user_routes`, `user_route_companies` (Stops); cluster routes → `user_route_clusters`; advanced routes use a queued job (**KG-Q1**: staging queue not processed) | route in the Routes Library (Draft / Published) | `BasicRouteDetail` | RT-W (RT-01…21) · Code |
| M6 | SA, BSA | `Routes` | open the library | `GET routelist` | `user_routes` | draft + published lists | `BasicRouteDetail` | RT |
| M7 | SA, BSA | `BasicRouteDetail` / `ActiveRouteMap` | view / navigate | `POST simplerouteview` (sets `is_route_open`; **not owner-scoped on read**, UI-SEC-11), `GET getuseractiveroute` (**21.7 s** for the staging SA, UI-PERF-01) | `user_route_companies`, `companies`, `company_time` | ordered stops, map, hand-off to Maps | `WaypointDetail` / `CompanyView` | RT-W · Code |
| M8 | SA, BSA | `CompanyView` / `WaypointDetail` | Mark Visited | `POST companymarkedvisited` (Stop id) + `POST addcompanyvisittime` | **`companies.is_visited` / `visited_at`** (company-wide) + `user_visited_companies`. (The MCP `mark_visited` writes the stop-level `user_route_companies.is_visited` instead, CR-24) | visited state everywhere the company appears | back to the route | RT-W (RT-59) · Code (EV-C04) |
| M9 | SA, BSA | `Lists` → `CreateLists` / `ListsDetail` | create / open a list | `GET getlist`, `POST createList`, `POST updateList` | `user_lists`, `user_list_companies` | list with N companies | `SelectStartEndPointsList` → `POST generateroute` → a route (`user_list_route`) | RT (screen) · RT-W (LS-*) |
| M10 | BSA | `Lists` | (none: arrives) | — (created by the manager, W8) | `user_lists` "manager assigned leads – <date>" | the rep sees the manager's leads as a list | `ListsDetail` | RT |
| M11 | SA, BSA | `ListCompany` (Address Book) | browse / filter | `POST companylist` (page, filters; **raw SQL**, UI-SEC-05) | `companies` (the user's own) | company cards | `CustomCompany` / `ViewCompany` | RT |
| M12 | SA, BSA | `CreateCompany` / `EditCompany` | save a company | `POST addcompany` / `POST updatecompany` | `companies` | company in the Address Book | `CustomCompany` | RT-W (AC-*) · Code |
| M13 | SA, BSA | `ContactsCreate` | add a person by hand | `POST addcontact` | `contacts`; **charges 1 credit today** (KG-BT3; target: free) | contact on the company | `ContactsView` | RT-W · Code |
| M14 | SA, BSA | `CustomCompany` → Find Contacts | search providers | `POST fetchAllContacts` (Apollo, FullEnrich, Cognism, OpenCorporates, Claude) | provider calls; `claude_contact_lookups` | candidates with prices (2 credits paid, 1 name/position) | select → buy | RT-W (RT-34…44) · Code |
| M15 | SA, BSA | Find Contacts review | buy contacts 💳 | `POST buyContacts` (bulk: queued job, KG-Q1) | `contacts`; `user_credits` | contacts unlocked | `ContactsView` | RT-W (up to the confirm step) · Code |
| M16 | SA, BSA | `CustomCompany` (activity section) / `CalendarActivity` | log an activity (type + date + note) | `POST addcompanyactivity` / `updatecompanyactivity` | `company_notes` (Activity) + `activities` (feed row via `Helper::addUserActivity`) | Upcoming (future date) or Recent | Dashboard Activity | RT-W (RT-54…62) · Code |
| M17 | SA, BSA | `EditStatus` (Settings) | view / rename tags | `GET getuserstatus`, `POST updateuserstatus` | `user_status` (7 for SA, 6 for BSA) | tag list | back | RT (view) |
| M18 | SA | `EditStatus` → Upgrade / Buy extra credits 💳 | purchase | RevenueCat SDK → `POST revenuecate-success`; webhook `POST revenue-subscription-update` | `user_packages`, `user_credits` | plan or credits applied | Dashboard | RT (buttons only; hidden for BSA) · Code |
| M19 | SA, BSA | `BusinessCard` | scan a card | on-device Gemini → `POST addcompany` / `addcontact` | `companies`, `contacts` | new company/contact | `CustomCompany` | RT-W (SC-*) · Code |
| M20 | SA, BSA | `QrCodeScanner` | import a shared route | `POST scan-qr-code` | `user_routes` copy | the shared route in the library | `Routes` | RT-W (DB-04/05) · Code |
| M21 | SA, BSA | any | session expires / 401 | any JWT endpoint → 401 | Realm `JWTToken` cleared | "Session expired" modal | `Login` | Code |

## 2. Web (SA, BSA, BA, AD)

| # | Role | Page | Action | Route (web) | Data | Result | Next state | Status |
|---|---|---|---|---|---|---|---|---|
| W1 | all | `/login` (`/hq/login` for Admin, reCAPTCHA) | submit | `POST /login` → `CheckUserRole` / `manager.only` (BSA: parent + parent plan checked) | session; server calls `ip-api.com` for the time zone | role landing | SA/BSA `/dashboard` · BA `/manager/dashboard` · AD `/hq/dashboard` | RT (AD blocked by captcha) |
| W2 | SA, BSA | `/dashboard` | open a tile | GET pages | — | Find Leads, Routes, Recently Added, Address Book, Lists, Upload CSV, Activity, Tutorial | the chosen page | RT |
| W3 | SA, BSA | `/findleads` | search 💳 on save | `ai-lead-finder/*` POSTs | `user_ai_search`, `companies`, `user_credits` | leads → companies | `/route/step1` or `/list/step1` | RT (page) · Code |
| W4 | SA, BSA, (BA) | `/route/step1` | select companies → Save as Draft / publish | `POST /route/step1` → later steps | `user_routes`, `user_route_companies` (web rule: 150 per city, KG-BT5) | route | `/route/view/{id}` | RT (page) · Code |
| W5 | SA, BSA | `/company`, `/company/create` | browse / add | `POST /company/create` | `companies` | company | `/company/{id}/view` | RT (page) |
| W6 | SA, BSA | `/salesperson/edit` | edit profile, tags, categories; connect CRM/MCP | `POST /salesperson/edit`; `/sfdc`, `/save-hubspot-api-key`, `/save-karmacrm-api-key`; `salesperson/mcp/*` | `users`, `user_status`, `user_company_categories`, `user_mcp_connections` | saved settings | same page | RT (page) |
| W7 | SA (BSA sees Subscribe Now) | `/subscription` → Upgrade → plans → Pay 💳 | subscribe / add credits | `subscription/*` (Stripe, PayPal) | `user_packages`, `user_package_addons`, `user_credits` | plan / credits | `/dashboard` | RT (pages) · owner captures (SLS-60…62) |
| W8 | BA | `/manager/ai-find-leads` | find leads and **assign** to a rep 💳 | `POST /manager/api/find-leads*`, `POST /manager/api/create-leads(-batch)` | rep `companies`; rep `user_lists` "manager assigned leads – <date>"; manager credits down | leads in the rep's account | the rep sees them (M10) | RT (page) · Code · owner captures (MGR-03/04) |
| W9 | BA | `/manager/salespeople/create` | add a rep (uses a licence) | portal API | `users` (role BSA, `parent_id`) + credits allotment | new rep | `/manager/salespeople/{id}/details` | RT (page) · Code |
| W10 | BA | `/manager/dashboard`, `/manager/activity` | monitor | `GET /manager/api/{dashboard-data,kpis,team,feed,growth,insights,territory,sidebar-stats}` | reads the reps' `activities`, visits, routes, lists | KPIs, map, leaderboards, feed | rep detail | RT |
| W11 | AD | `/hq/*` | manage subscriptions, reps, managers, promo codes, settings | `/hq/*` (several state-changing GETs, UI-SEC-03) | `user_packages`, `user_credits`, `users`, `user_promocode`, `settings` | admin changes | — | owner captures (ADM-*) · Code |
| W12 | SA, BSA | `/notification` | broadcast a push ⚠ | `POST /notification` → `FCM::sendTo(all tokens)` | reads every `usertoken` | a push to **every** device | — | RT (page only) · Code (UI-SEC-04) |

## 3. Integrations and background

| # | Trigger | Path | Data | Result | Status |
|---|---|---|---|---|---|
| B1 | Claude/ChatGPT user calls `find_ai_leads`, `create_route`, `buy_contacts` … | `/ai/mcp` → `CustomerApiClient` → the V2 endpoints above as that user | same as M3–M16 | same results | Code |
| B2 | Apollo / FullEnrich finish an enrichment | `POST apollo-webhook`, `POST fullenrich-webhook/*` | `contacts` | contacts appear in the background ("you may exit this screen") | Code · owner capture SLS-46 |
| B3 | RevenueCat subscription change | `POST revenue-subscription-update` | `user_packages` | plan status | Code |
| B4 | Renewal and credit reset | cron **HTTP GET** URLs (`routes/web.php:30-35, 84, 86`) | `user_packages`, `user_credits` | renewals | Code (F04; never called by the brain) |
| B5 | Queued jobs (bulk contacts, route publish/PDF, emails) | database queue | various | **do not complete on staging** (KG-Q1) | Code + 2026-09-15 check |
| B6 | Push | `Globals/Helper.php` → FCM; the device shows it through Notifee | `usertoken` | notification (the in-app Notifications screen is unreachable, F27) | Code |

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (66)

**Documents (15):** [[brain/context/api-map|API map: every V2 endpoint, who calls it, and how it behaves]] · [[brain/context/mobile-flows-captured|App journeys from screenshots]] · [[brain/audits/10-brain-final-audit|Audit 10 — Territool AI Brain final audit]] · [[brain/context/brain-qa|Brain QA: questions the brain must answer correctly, and how it did]] · [[brain/context/brain-scorecard|Brain scorecard: 18 categories, rubric, iterations]] · [[brain/context/contradiction-register|Contradiction register: where two sources disagreed, and which won]] · [[brain/memory/entries/conflict/20260917-c4d213-cr-24-data-model-system-map-glossary-visited-is-|CR-24 — data-model / system-map / glossary: visited is on the Company ↔ architecture §6 and 03-parity: the MCP sets t…]] · [[brain/context/data-model|Data model: what Territool stores and where]] · [[brain/context/evidence-ledger|Evidence ledger: what was checked, how, and what it proves]] · [[brain/memory/entries/qa/20260917-75ee1f-four-flagged-context-notes-re-validated-structur|Four flagged context notes re-validated structurally (410 claims, 0 unresolved)]] · [[brain/context/flows|Product features list]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/roles-permissions|Roles and permissions: who can do what, where, and what enforces it]] · [[workspace/tasks/2026-09-16-brain-improvement-loop|Task brief: autonomous brain improvement loop to 90+]] · [[brain/context/web-flows|Web flows: every web page per role, and how the core features run on web]]

**Product features (2):** [[_id/F27|Notifications & push]] · [[_id/F04|Subscription & credit renewal]]

**Coding rules (32):** [[_id/W9|API changes only add, never remove]] · [[_id/W2|API status is 1 or 0]] · [[_id/W7|Business logic in services]] · [[_id/W3|Check input first]] · [[_id/M14|Don't grow the Global file]] · [[_id/M4|Every network call reports errors]] · [[_id/M11|Fix every copy of duplicated code]] · [[_id/W6|Get the user safely]] · [[_id/W12|Handle outside services safely]] · [[_id/M15|Ignore outdated responses]] · [[_id/W10|Limit list sizes]] · [[_id/M7|Loading, empty & error states]] · [[_id/M12|Meaningful test IDs]] · [[_id/M2|Network calls only through API.js]] · [[_id/M5|Never log users out on errors]] · [[_id/W1|New API routes in version 2]] · [[_id/M1|New screens as function components]] · [[_id/W4|No database queries built from text]] · [[_id/W11|No database queries in loops]] · [[_id/M8|No hard-coded colours or sizes]] · [[_id/M19|No new code-check errors]] · [[_id/M18|No new libraries without approval]] · [[_id/M16|No secrets in analytics]] · [[_id/M17|No secrets in the code]] · [[_id/M6|No silent error catching]] · [[_id/W5|Only the user's own data]] · [[_id/M13|Register screens properly]] · [[_id/M10|Search before creating]] · [[_id/S6.4|Staging test data rules]] · [[_id/M9|Styles in separate files]] · [[_id/M3|Success only when status is 1]] · [[_id/W8|Tests for new services]]

**Problem founds (3):** [[_id/KG-Q1|Background jobs not running on staging]] · [[_id/KG-BT3|Hand-added contact costs a credit]] · [[_id/KG-BT5|No route size limit on the server]]

**Screenshots (10):** [[_capture/SLS-60|**Plans & Packages** — Base $69/mo (or $720/yr, save 13%): unlimited routes, up to 50,000 records, mobile CRM, share routes & lists, 2-way CRM sync, **100 credits**. Pro $99/mo (or $999/yr, save 16%): everything in Base, unlimited records, dedicated onboarding, priority support, **180 credits**. Add Credits (non-recurring): 50=$25, 100=$45, 150=$57, 500=$150, 1000=$300]] · [[_capture/MGR-04|AI Find Leads — '5 leads assigned successfully' toast; credits fell 100 → 86 and the list went 264 → 250 (assignment consumes credits; the per-lead rate is not confirmed from this frame)]] · [[_capture/MGR-03|AI Find Leads Step 3 — 264 leads from 2 search areas; select by checkbox or Lasso/Pan, then 'Assign leads' to a salesperson; '100 credits remaining']] · [[_capture/DB-04|Allow camera pop-up]] · [[_capture/RT-34|Find contacts – checking each stop]] · [[_capture/SLS-46|Find Contacts — 'AGGREGATING CONTACT DATA FROM MULTIPLE SOURCES / **Finding data from Apollo**', 4%; 'You may exit this screen and contacts will load in the background']] · [[_capture/RT-54|Log an activity]] · [[_capture/RT-59|Marked as visited]] · [[_capture/DB-05|QR code scanner]] · [[_capture/RT-01|Routes library]]

**Code files (4):** [[_code/mobile/App/components/findLeads/aiFindLeads.js|aiFindLeads.js]] · [[_code/mobile/App/config/index.js|config/index.js]] · [[_code/mobile/App/components/dashboard/index.js|dashboard/index.js]] · [[_code/web/app/Globals/Helper.php|Helper]]

%% brain-links:end %%
