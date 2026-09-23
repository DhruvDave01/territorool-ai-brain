---
area: context
tags: [brain/context]
ref: "Product features list"
---

# Territool — Flows (approved index)

- **Criticality approved by the owner 2026-09-15** (`brain/audits/03-parity.md` §7).
- Full step-by-step definitions: `shoebox/07-flows/flows.md`.
- Parity status: `brain/context/parity-map.md`.
- Existing tests: `brain/audits/05-testing.md` §3.

Priority mapping for test cases: **BLOCKER = P0**, **HIGH = P1**, **MEDIUM = P2**, **LOW = P3**.

| Flow | Criticality | Platforms | Mobile screens (`App/App.js`) | Web / API / MCP entry points | Targets (BT) | Tests today |
|---|---|---|---|---|---|---|
| **F01** Login & session | **BLOCKER** | mobile, web, portal | `Login` (+ Session Expired modal) | API `login`, `logout`; web `Auth\LoginController` | BT-1, BT-2 | Maestro login ios/android + validation; Detox login |
| **F02** Registration & onboarding | **BLOCKER** | mobile, web | `Register` (+ `PostSignupPaywallFlow`) | API `mobileregistration`, `leads_user`, `updateUserPreferences`; web `register`, `onboarding`, `b2b` | (P2 validation drift) | Maestro register ios/android, validation, full journey |
| **F03** Subscription / paywall / upgrade / cancel / credits top-up | **BLOCKER** | mobile (RevenueCat), web (Stripe/PayPal) | `SubscriptionScreen`, `SubscriptionGate`, `EditStatus` | API `revenuecate-success`, `cancelSubscription`, `request-package-upgrade`, webhook `revenue-subscription-update`; web `subscription/*` | — | paywall steps inside Maestro register |
| **F04** Subscription & credit renewal (crons) | **BLOCKER** | system | — | web `cron/*`, `businessClientUpdateCron`, `routenotifycron` | BT-10 (worker) | none |
| **F05** Dashboard, activity feed, calendar | HIGH | mobile, web | `Dashboard`, `RecentActivity`, `CalendarActivity` | API `getUserActivity`, `getcompanyactivities`, `getusercredit`; web `/dashboard` | — | smoke (Maestro login) |
| **F06** AI Find Leads → save leads | HIGH | mobile, web, portal, MCP | `MultipleAIWaypoint` | API `getAILeads*`, `resumeAILeadSearch`, `saveAILeads`; web `/findleads`, `ai-lead-finder/*`; portal `/manager/ai-find-leads`; MCP `find_ai_leads` | — | Maestro onboarding; PHPUnit manager service |
| F07 Places / Yelp leads | MEDIUM | mobile (Places), web (Yelp) | `MultipleWaypoint` | API `getYelpLeads` | — | none |
| **F08** Create route | HIGH | mobile, web, MCP | `CreateRoute`, `LassoMap`, `SelectStartEndPoints`, `PublishRoute`, `EditRoute`, `EditSelectStartEndPoints`, `EditPublishRoute`, `Routes` | API `checkroutename`, `createroute`, `updateroute` (mobile's `PublishRoute` screen calls `createroute`; `publishroute` is registered but no mobile or MCP caller was found, 2026-09-16, CR-02); web `route/step1`, `sessionroute/*` | **BT-5** | Maestro onboarding (first route) |
| **F09** Route detail & navigation | HIGH | mobile, web view/PDF | `BasicRouteDetail`, `ActiveRouteMap`, `WaypointDetail`, `CompanyView` | API `simplerouteview`, `advancerouteview`, `getuseractiveroute*`; web `route/view/{id}` | — | minimal |
| **F10** Mark visited & visit log | HIGH | mobile, MCP (web display only) | `CompanyView`, `WaypointDetail` (`CustomCompany` route context) | API `companymarkedvisited`, `addcompanyvisittime`, `companyvisitremove` | **BT-4** | none |
| **F11** Lists | HIGH | mobile, web, MCP | `Lists`, `CreateLists`, `EditLists`, `ListsDetail`, `SelectStartEndPointsList` | API `getlist`, `createList`, `updateList`, `deleteList`, `generateroute`; web `lists`, `list/*` | (P7) | none |
| **F12** Companies (Address Book) | HIGH | mobile, web, admin | `ListCompany`, `CreateCompany`, `EditCompany`, `ViewCompany`, `CustomCompany`, `FilterModule` | API `companylist`, `addcompany`, `updatecompany`, `removeCompanies`; web `company/*` | (P3) | none |
| **F13** Contacts | HIGH | mobile, web, admin | `ContactsCreate`, `ContactsUpdate`, `ContactsView` | API `addcontact`, `updatecontact`, `deletecontact`, `contactlist`; web `contact/*` | **BT-3** | none |
| **F14** Activities / notes / log meetings | HIGH | mobile, web, MCP | activity section in `CustomCompany`; `CalendarActivity` | API `addcompanyactivity`, `updatecompanyactivity`, `getcompanyactivities`, `addnote`, `getlogmeeting`; web `note/*` | **BT-6, BT-7** | minimal |
| **F15** Find & buy contacts (credits) | **BLOCKER** | mobile, web, MCP | `CongContact`, `bizContacts`, `bizCompanies`, `Contact`, `BulkContactPeople`, `BulkContactReview` (+ `FindContactsFetchModal`) | API `fetchAllContacts`, `get*Contact`, `redeem*Contact`, `buyContacts`, `getusercredit`, webhooks `apollo-webhook`, `fullenrich-webhook/*`; web `company/buyContacts*`; MCP `buy_contacts` | S3.3 pricing | minimal |
| F16 Report company/contact | MEDIUM | mobile, web | (modals in company screens) | API `reportcompany`, `reportcontact` (→ `CompanylController`) | — | none |
| F17 Share route/list | MEDIUM | mobile, web | (share modals) | API `shareRouteList` | — | none |
| F18 Scan business card | MEDIUM | mobile | `BusinessCard` | on-device Gemini → `addcompany`/`addcontact` | — | manual only (camera) |
| F19 QR route import | MEDIUM | mobile | `QrCodeScanner` | API `scan-qr-code` | — | manual only (camera) |
| F20 Settings / status tags / stages | MEDIUM | mobile, web | `EditStatus` | API `getuserstatus`, `updateuserstatus`; web `salesperson/edit` | — | none |
| F21 CRM sync | MEDIUM | web (all), mobile (HubSpot), McpClient | `Error` (HubSpot errors) | API `hubspot-*`; web `sfdc`, `sync-hubspot-*`, `sync-karmacrm-*` | — | none |
| F22 Bulk CSV upload | MEDIUM | web | — | web `uploadcompany/*`, `uploadcontact/*` | — | none |
| **F23** Manager portal | HIGH | portal (Business Agent) | — | web `/manager/*`, `/manager/api/*` | 390 px nav rule | PHPUnit 17 service tests |
| **F24** Business Sales Agent management | HIGH | web / portal | — | web `businesssalesperson/*`, `/manager/salespeople/*`; API `invite-user` | — | none |
| F25 Admin HQ | MEDIUM | web (Admin) | — | web `/hq/*` | BT-1 | none |
| F26 Support tickets | LOW | web (+ API) | — | API `getticket`…; web `support/*` | — | none |
| F27 Notifications & push | LOW | mobile (push; the inbox screen is unreachable), web (**broadcast sender only**, UI-SEC-04) | `Notifications` (unreachable) | API `notificationlist`… | — | none |
| F28 Referral invites | LOW | mobile | (`ReferralInviteModal`) | API `invite-user` | — | none |
| F29 Customer MCP connectors | MEDIUM (HIGH if sold, Q-P9) | MCP | — | `/ai/mcp`, `/find-mcp/mcp` → V2 via `CustomerApiClient` | — | UserMcp QA artisan commands |
| F30 Admin MCP | LOW | MCP | — | `/ai/mcp-admin`, `/api/mcp/*` | — | none |
| F31 MCP client connections & chat | MEDIUM | web | — | web `salesperson/mcp/*` | — | none |
| F32 App launch, permissions, crash, offline | MEDIUM | mobile | splash, `AppCrashFallback` | — | BT-11 (offline **dropped**, S3.9) | none |

## Mobile step-level notes and evidence

Source: the mobile Design-Brain (iOS TestFlight 42.30/42.31 captures, 2026-09-11), reviewed in `brain/audits/08-design-brain-review.md`.

**Paths:**
- Flow notes: `brain/assets/brand/flow-notes/`
- Stills: `brain/assets/screenshots/mobile/Archive-2/`
- Videos: `brain/assets/videos/mobile/` (`VID1-AI-Find-Leads-to-Activity.mp4`, `VID2-Add-Company.mp4`, `VID3-Additional-Flows.mp4`)
- Frames: `brain/assets/screenshots/mobile/Video-Frames/`
- Full index: `brain/assets/brand/coverage-notes/Screenshot-Video-Index.md`

**Before relying on these notes:**
- Check each step against the code.
- Known errors: Confirm Leads is primary blue, not near-black; the Find Leads chip is `#44AADA`.
- The notes cover iOS only; web flows use `shoebox/07-flows/flows.md` and `brain/assets/screenshots/web/`.

| Flow | Flow notes | Stills | Video |
|---|---|---|---|
| F01 | `Authentication.md`, `App-Launch.md` | `IMG_4604`, `IMG_4601` | — |
| F02 | `Onboarding.md` (deferred) | — | — |
| F03 | `Subscription.md` (deferred), `Settings.md` | `IMG_4564` (buttons only) | VID3 ~72s |
| F05 | `Dashboard.md`, `Calendar-and-Activity.md` | `IMG_4563`, `IMG_4605`, `IMG_4608` | VID3 0s, 64s |
| F06 | `Find-Leads.md` | `IMG_4565`–`IMG_4571`, `IMG_4603` | VID1 |
| F07 | `Find-Leads.md` (Places, partial) | — | — |
| F08 | `Routes.md` | `IMG_4572`–`IMG_4575` | VID1 |
| F09 | `Routes.md`, `Maps-and-Active-Route.md` | `IMG_4575`, `IMG_4577` | VID3 8–16s |
| F10 | `Companies-and-Contacts.md` (Mark Visited) | `IMG_4576`, `IMG_4610` | VID1 |
| F11 | `Lists.md` | `IMG_4591`–`IMG_4594`, `IMG_4610` | VID3 28–34s |
| F12 | `Companies-and-Contacts.md` | `IMG_4576`, `IMG_4578`, `IMG_4587`, `IMG_4588`, `IMG_4595` | VID2 |
| F13 | `Companies-and-Contacts.md` | `IMG_4596`, `IMG_4598`–`IMG_4600` | VID1, VID3 56s |
| F14 | `Calendar-and-Activity.md` | `IMG_4608` | VID1 (Add Activity) |
| F15 | `Enrichment-and-Credits.md` | `IMG_4581`–`IMG_4585` | VID1 |
| F16 | `Enrichment-and-Credits.md` (report) | `IMG_4579`, `IMG_4580` | — |
| F17 | `Routes.md`, `Lists.md` (share) | `IMG_4611` | VID3 32s |
| F18 | `Scan-Business-Card.md` | `IMG_4586`, `IMG_4606`, `IMG_4607` | — |
| F19 | `Dashboard.md` (QR) | `IMG_4609` | — |
| F20 | `Settings.md` | `IMG_4564` | VID3 ~72s |
| F27 | `Main-Navigation.md` (Notifications screen unreachable) | — | — |
| F28 | `Dashboard.md` (referral) | `IMG_4602` | — |
| F32 | `App-Launch.md`, `Permissions.md`, `Error-and-Recovery.md` | — | — |

## Owner captures (iOS simulator, build 42.32 Development, staging, 2026-09-15)

**Where to look:**
- Step-by-step write-ups and shared sub-flows: `brain/context/mobile-flows-captured.md`
- ID → file: `brain/context/mobile-screenshot-index.md`
- Files: `brain/assets/screenshots/mobile-owner/`

These are the **newest mobile evidence**; prefer them over the 2026-09-11 TestFlight set above.

| Flow | Write-up | Key screenshot IDs |
|---|---|---|
| F01 | MF-01 | LR-01–03, LR-16–17 |
| F02 | MF-01 | LR-04–10, LR-18–21 |
| F03 | MF-01, MF-03 | LR-11–14, ST-01, ST-04–05, ST-07 |
| F05 | MF-02, MF-04 | DB-02–03, CAL-01–03 |
| F06 | MF-05 | AI-01–31 |
| F08 | MF-05, MF-08 | AI-32–43, RT-01–21 |
| F09 | MF-08 | RT-21–27, RT-74–76 |
| F10 | MF-08 (S6/S7) | RT-59, RT-76 |
| F11 | MF-05, MF-09 | AI-44–49, LS-20–42 |
| F12 | MF-07, MF-10 | AC-01–09, RT-46–50, AB-01–04, AB-12, AB-15–18 |
| F13 | MF-08, MF-10 | RT-51, RT-63–64, AB-02, AB-05–10 |
| F14 | MF-04, MF-08, MF-10 (S7) | CAL-02–04, RT-54–62, AB-13–14 |
| F15 | MF-08 (S8), MF-09 | RT-34–44, RT-52–53, RT-65, RT-67–71 |
| F16 | MF-08 (S6) | RT-48–50, RT-63 |
| F17 | MF-08, MF-09 (S9) | RT-28–32, LS-24–26 |
| F18 | MF-06 | SC-01–11 |
| F19 | MF-02 | DB-04–05 |
| F20 | MF-03 | ST-01–03 |
| F28 | MF-02 | DB-06–07 |
| F32 | S12 | LR-09, LR-16–17, RT-14, DB-01, DB-04, SC-02 |

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (329)

**Documents (53):** [[shoebox/07-flows/README|07 - Flows]] · [[brain/context/mobile-flows-captured|App journeys from screenshots]] · [[brain/assets/brand/flow-notes/App-Launch|App launch]] · [[brain/context/architecture|Architecture: how Territool is built, end to end]] · [[brain/audits/00-inventory|Audit 0 – what exists]] · [[brain/audits/03-parity|Audit 3 – mobile vs web]] · [[brain/audits/05-testing|Audit 5 – testing plan]] · [[brain/assets/brand/flow-notes/Authentication|Authentication (in-scope)]] · [[brain/context/brain-qa|Brain QA: questions the brain must answer correctly, and how it did]] · [[brain/README|brain/ - GENERATED OUTPUT. Do not hand-edit during build.]] · [[brain/assets/brand/flow-notes/Calendar-and-Activity|Calendar and activity]] · [[brain/gates/test-gate|Checklist – tests]] · [[brain/assets/brand/flow-notes/Companies-and-Contacts|Companies and contacts]] · [[brain/context/confidence-score|Confidence score: how ready the brain is for a task]] · [[_code/brain/tools/brain-score.js|Confidence score: how well the brain equips an agent to take a task on each product feature.]] · [[brain/context/contradiction-register|Contradiction register: where two sources disagreed, and which won]] · [[brain/memory/entries/conflict/20260917-15c35f-cr-02-flows-md-f08-api-entry-points-include-publ|CR-02 — flows.md: F08 API entry points include publishroute ↔ no mobile or MCP caller exists; mobile's PublishRoute s…]] · [[brain/memory/entries/conflict/20260917-8864f4-cr-19-flows-md-f27-notifications-web-suggests-an|CR-19 — flows.md F27 "Notifications: web ✅" (suggests an inbox) ↔ the web /notification page is a broadcast sender, n…]] · [[brain/memory/entries/conflict/20260917-dbc233-cr-27-parity-map-f20-f26-f27-unverified-runtime-|CR-27 — parity-map F20/F26/F27: UNVERIFIED ↔ runtime + code evidence now exists]] · [[brain/assets/brand/flow-notes/Dashboard|Dashboard]] · [[brain/assets/brand/flow-notes/Enrichment-and-Credits|Enrichment and credits]] · [[brain/assets/brand/flow-notes/Error-and-Recovery|Error and recovery]] · [[FEATURE_SCORE_MODEL|FEATURE_SCORE_MODEL — how tools/brain-score.js computes feature task confidence]] · [[brain/assets/brand/flow-notes/Find-Leads|Find Leads (AI)]] · [[shoebox/02-mobile/README|How to add mobile screenshots]] · [[brain/context/known-fragile|Known problems & risky areas]] · [[brain/context/mobile-screenshot-index|List of all screenshots]] · [[brain/assets/brand/flow-notes/Lists|Lists]] · [[brain/assets/brand/flow-notes/Main-Navigation|Main navigation]] · [[brain/assets/brand/flow-notes/Maps-and-Active-Route|Maps and active route]] · [[brain/context/parity-map|Mobile vs web differences]] · [[brain/assets/brand/flow-notes/Onboarding|Onboarding]] · [[shoebox/07-flows/flows|Original flow descriptions]] · [[brain/assets/brand/flow-notes/Permissions|Permissions]] · [[brain/memory/entries/fix/20260917-442310-qa-report-js-criticality-regex-had-a-stray-arabi|qa-report.js criticality regex had a stray Arabic character and a pattern-order bug]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/audits/08-design-brain-review|Review of the old Design-Brain]] · [[brain/assets/brand/flow-notes/Routes|Routes]] · [[brain/assets/brand/flow-notes/Scan-Business-Card|Scan Business Card]] · [[brain/assets/brand/coverage-notes/Screenshot-Video-Index|Screenshot and video index]] · [[brain/assets/brand/flow-notes/Settings|Settings]] · [[brain/skills/territool-design/SKILL|Skill – design]] · [[brain/skills/territool-qa/SKILL|Skill – final quality check]] · [[brain/skills/territool-router/SKILL|Skill – task router (start of every task)]] · [[brain/skills/territool-test/SKILL|Skill – testing]] · [[brain/assets/brand/flow-notes/Subscription|Subscription and payment]] · [[brain/context/system-map|System map: role → platform → screen → action → API → data → result → next]] · [[workspace/loop/20260916-ts2345-commonfunctions/state|TASK: ts2345-commonfunctions]] · [[brain/skills/territool-loop/SKILL|TERRITOOL LOOP — superseded, moved to LOOP.md]] · [[brain/skills/territool-router/LOOP|The fix-until-done loop]] · [[_code/brain/tools/brain-graph.js|Tool – build this map]] · [[brain/context/UPCOMING_IMPROVEMENTS|Upcoming improvements: application findings not fixed during the brain work]] · [[brain/context/web-flows|Web flows: every web page per role, and how the core features run on web]]

**Product features (32):** [[_id/F14|Activities / notes / log meetings]] · [[_id/F25|Admin HQ]] · [[_id/F30|Admin MCP]] · [[_id/F06|AI Find Leads → save leads]] · [[_id/F32|App launch, permissions, crash, offline]] · [[_id/F22|Bulk CSV upload]] · [[_id/F24|Business Sales Agent management]] · [[_id/F12|Companies (Address Book)]] · [[_id/F13|Contacts]] · [[_id/F08|Create route]] · [[_id/F21|CRM sync]] · [[_id/F29|Customer MCP connectors]] · [[_id/F05|Dashboard, activity feed, calendar]] · [[_id/F15|Find & buy contacts]] · [[_id/F11|Lists]] · [[_id/F01|Login & session]] · [[_id/F23|Manager portal]] · [[_id/F10|Mark visited & visit log]] · [[_id/F31|MCP client connections & chat]] · [[_id/F27|Notifications & push]] · [[_id/F07|Places / Yelp leads]] · [[_id/F19|QR route import]] · [[_id/F28|Referral invites]] · [[_id/F02|Registration & onboarding]] · [[_id/F16|Report company/contact]] · [[_id/F09|Route detail & navigation]] · [[_id/F18|Scan business card]] · [[_id/F20|Settings / status tags / stages]] · [[_id/F17|Share route/list]] · [[_id/F03|Subscription / paywall / upgrade / cancel / credits…]] · [[_id/F04|Subscription & credit renewal]] · [[_id/F26|Support tickets]]

**App journeys (15):** [[_id/MF-04|Activity & calendar]] · [[_id/MF-07|Add a company]] · [[_id/MF-10|Address book]] · [[_id/MF-05|AI Find Leads]] · [[_id/S6|Company page]] · [[_id/S8|Find contacts for a route or list]] · [[_id/MF-02|Home dashboard]] · [[_id/MF-09|Lists]] · [[_id/S7|Log an activity]] · [[_id/MF-01|Login, sign-up & plans]] · [[_id/S12|Pop-ups, permissions & errors]] · [[_id/MF-08|Routes]] · [[_id/MF-06|Scan a business card]] · [[_id/MF-03|Settings]] · [[_id/S9|Share by email]]

**Coding rules (2):** [[_id/S3.3|Hand-added contacts free]] · [[_id/S3.9|Offline mode dropped]]

**Owner decisions (10):** [[_id/BT-4|“Visited” is per company]] · [[_id/BT-6|Activity needs type, date & note]] · [[_id/BT-1|Block Admin on the mobile app]] · [[_id/BT-10|Check the background job worker]] · [[_id/BT-3|Hand-added contacts are free]] · [[_id/BT-7|Log Meeting = a Meeting activity]] · [[_id/BT-11|Offline mode dropped]] · [[_id/Q-P9|Question: is the customer AI connector sold?]] · [[_id/BT-5|Routes have 2–400 stops]] · [[_id/BT-2|Sales reps follow their manager's plan]]

**Screenshots (217):** [[_capture/AI-21|A lead's contacts – loading]] · [[_capture/AI-22|A lead's contacts – preview]] · [[_capture/CAL-03|Activity calendar – another day]] · [[_capture/CAL-02|Activity calendar – today]] · [[_capture/RT-62|Activity saved]] · [[_capture/AB-14|Activity saved]] · [[_capture/RT-58|Activity scheduled]] · [[_capture/AB-07|Add a note]] · [[_capture/AB-04|Add company]] · [[_capture/AC-06|Add company – details filled in]] · [[_capture/AC-03|Add company – more details]] · [[_capture/AC-04|Add company – no search results]] · [[_capture/AC-07|Add company – revenue and LinkedIn]] · [[_capture/AC-01|Add company – search]] · [[_capture/AC-05|Add company – search suggestions]] · [[_capture/AC-02|Add company – type it in]] · [[_capture/LS-32|Add company (from a list)]] · [[_capture/RT-13|Add company (from a route)]] · [[_capture/AB-05|Add contact]] · [[_capture/RT-51|Add contact form]] · [[_capture/AI-44|Add leads to a list]] · [[_capture/AI-28|Add leads to a route]] · [[_capture/AB-03|Add menu (company or find leads)]] · [[_capture/AB-09|Add to a route – loading]] · [[_capture/AI-45|Add to an existing list]] · [[_capture/AI-29|Add to an existing route]] · [[_capture/RT-70|Adding a contact]] · [[_capture/AB-01|Address book – companies]] · [[_capture/AB-02|Address book – contacts]] · [[_capture/AI-01|AI Find Leads – loading saved leads]] · [[_capture/AI-03|AI Find Leads – no leads found]] · [[_capture/AI-02|AI Find Leads – search by city]] · [[_capture/AI-04|AI Find Leads – search by ZIP code]] · [[_capture/AI-24|All 29 leads selected]] · [[_capture/RT-10|All 6,150 companies selected]] · [[_capture/LS-30|All 6,150 companies selected]] · [[_capture/RT-65|All contacts ready]] · [[_capture/DB-04|Allow camera pop-up]] · [[_capture/LR-16|Allow notifications pop-up]] · [[_capture/SC-02|Allow photo library pop-up]] · [[_capture/LR-17|Allow tracking pop-up]] · [[_capture/AI-31|Back on the search screen (app reloading)]] · [[_capture/AI-47|Back on the search screen (app reloading)]] · [[_capture/AI-42|Building the route – 15%]] · [[_capture/RT-20|Building the route – 20%]] · [[_capture/RT-19|Building the route – 5%]] · [[_capture/AI-41|Building the route – starting]] · [[_capture/ST-04|Cancel subscription – reasons]] · [[_capture/SC-09|Card details – company fields]] · [[_capture/SC-08|Card details – contact fields]] · [[_capture/SC-07|Card details read]] · [[_capture/AB-10|Choose a route]] · [[_capture/AI-40|Choose route start and end]] · [[_capture/RT-18|Choose route start and end]] · [[_capture/RT-46|Company – more info]] · [[_capture/RT-64|Company contacts]] · [[_capture/AC-09|Company created]] · [[_capture/CAL-04|Company opened from the calendar]] · [[_capture/AB-12|Company page]] · [[_capture/AB-06|Contact details]] · [[_capture/RT-71|Contact is being fetched]] · [[_capture/RT-53|Contact search result]] · [[_capture/LS-28|Create list – pick companies]] · [[_capture/AI-33|Create route – all companies]] · [[_capture/AI-32|Create route – leads added]] · [[_capture/AI-34|Create route – selected companies]] · [[_capture/SC-04|Crop the card]] · [[_capture/SC-05|Crop the card – adjusted]] · [[_capture/AB-18|Delete companies – confirm]] · [[_capture/AI-39|Draw an area – map]] · [[_capture/RT-16|Draw an area – map]] · [[_capture/LS-35|Draw an area – map]] · [[_capture/AI-38|Draw an area – map loading]] · [[_capture/RT-15|Draw an area – map loading]] · [[_capture/LS-34|Draw an area – map loading]] · [[_capture/RT-17|Drawing an area]] · [[_capture/AI-17|Drawing an area on the map]] · [[_capture/RT-47|Edit company]] · [[_capture/ST-03|Edit status tags]] · [[_capture/RT-14|Error screen (design reference)]] · [[_capture/LR-09|Error screen (developer test button)]] · [[_capture/AI-37|Filter – sort and status]] · [[_capture/RT-05|Filter – sort and status]] · [[_capture/AB-16|Filter – sort and status]] · [[_capture/AI-36|Filter companies]] · [[_capture/RT-04|Filter companies]] · [[_capture/AB-15|Filter companies]] · [[_capture/RT-40|Find contacts – 2 people selected]] · [[_capture/RT-35|Find contacts – all stops checked]] · [[_capture/RT-34|Find contacts – checking each stop]] · [[_capture/RT-67|Find contacts – more sources]] · [[_capture/LS-33|Find Leads menu]] · [[_capture/AI-35|Find Leads menu (add company or find leads)]] · [[_capture/RT-52|Finding contacts for a company]] · [[_capture/RT-44|Getting contact details in the background]] · [[_capture/DB-01|Home – allow location pop-up]] · [[_capture/DB-03|Home – recent activity]] · [[_capture/DB-02|Home dashboard]] · [[_capture/DB-06|Invite a friend by email]] · [[_capture/DB-07|Invite a friend by phone]] · [[_capture/AI-26|Leads confirmed]] · [[_capture/AI-07|Leads found – list]] · [[_capture/AI-18|Leads inside the drawn area selected]] · [[_capture/AI-08|Leads list – counting contacts]] · [[_capture/AI-20|Leads list with contact counts]] · [[_capture/AI-16|Leads on the map]] · [[_capture/LS-41|List – filter]] · [[_capture/LS-42|List – filter options]] · [[_capture/LS-37|List details]] · [[_capture/LS-40|List details – menu]] · [[_capture/LS-39|List details – search]] · [[_capture/LS-21|List menu]] · [[_capture/LS-23|List updated]] · [[_capture/AI-48|Lists – leads added]] · [[_capture/LS-20|Lists library]] · [[_capture/RT-07|Loading companies]] · [[_capture/RT-61|Log a past activity – confirm]] · [[_capture/RT-54|Log an activity]] · [[_capture/AB-13|Log an activity]] · [[_capture/RT-55|Log an activity – choose type]] · [[_capture/RT-56|Log an activity – pick date]] · [[_capture/RT-57|Log an activity – pick time]] · [[_capture/RT-60|Log an activity – type missing]] · [[_capture/LR-02|Login – password missing message]] · [[_capture/LR-03|Login – wrong email or password]] · [[_capture/LR-01|Login screen]] · [[_capture/ST-05|Manage plan on the website]] · [[_capture/AI-19|Map zoomed in]] · [[_capture/RT-59|Marked as visited]] · [[_capture/SC-11|Message: company already exists]] · [[_capture/AI-23|Message: select at least 2 leads]] · [[_capture/RT-69|More sources – results]] · [[_capture/AI-46|Name a new list]] · [[_capture/AI-30|Name a new route]] · [[_capture/ST-02|New app update available]] · [[_capture/LS-27|New list – enter a name]] · [[_capture/AI-49|New list details]] · [[_capture/RT-02|New route – enter a name]] · [[_capture/RT-03|New route – name already used]] · [[_capture/AI-43|New route details]] · [[_capture/AB-08|Note saved]] · [[_capture/SC-03|Pick a photo]] · [[_capture/ST-07|Plan and credits details]] · [[_capture/LR-12|Plans – 7-day free trial turned on]] · [[_capture/LR-13|Plans – Apple purchase sign-in]] · [[_capture/LR-11|Plans – Base Plan (free trial off)]] · [[_capture/LR-14|Plans – free trial selected]] · [[_capture/DB-05|QR code scanner]] · [[_capture/AI-10|Rate the app pop-up]] · [[_capture/SC-06|Reading the card]] · [[_capture/CAL-01|Recent activity list]] · [[_capture/LS-22|Rename list]] · [[_capture/RT-50|Report – reason chosen]] · [[_capture/RT-49|Report a company problem]] · [[_capture/RT-63|Report a contact problem]] · [[_capture/RT-41|Review – 2 contacts for 4 credits]] · [[_capture/RT-43|Review – 3 contacts for 5 credits]] · [[_capture/RT-27|Route details – filter]] · [[_capture/RT-21|Route details – list of stops]] · [[_capture/RT-26|Route details – menu]] · [[_capture/RT-25|Route details – search stops]] · [[_capture/RT-48|Route info for this company]] · [[_capture/RT-23|Route map]] · [[_capture/RT-24|Route map – filter]] · [[_capture/RT-22|Route map – loading]] · [[_capture/RT-74|Route map – Los Angeles route]] · [[_capture/RT-01|Routes library]] · [[_capture/SC-10|Saving the company]] · [[_capture/LS-36|Saving the list]] · [[_capture/AC-08|Scan a card from Add company]] · [[_capture/SC-01|Scan business card – start]] · [[_capture/RT-06|Search companies]] · [[_capture/AI-14|Searching – first results appear]] · [[_capture/AI-13|Searching by ZIP code – 24%]] · [[_capture/AI-12|Searching by ZIP code – 6%]] · [[_capture/AI-06|Searching for leads – 34%]] · [[_capture/AI-05|Searching for leads – 9%]] · [[_capture/RT-68|Searching more sources]] · [[_capture/AB-17|Select companies to delete]] · [[_capture/LS-31|Selected companies (2)]] · [[_capture/RT-12|Selected companies (4)]] · [[_capture/AI-11|Selected leads – ready to confirm]] · [[_capture/AI-25|Selected leads (29) – confirm]] · [[_capture/RT-11|Selected: 6,150 companies]] · [[_capture/RT-09|Selecting all companies]] · [[_capture/LS-29|Selecting all companies]] · [[_capture/ST-01|Settings]] · [[_capture/LS-24|Share list]] · [[_capture/LS-25|Share list – person is not a user]] · [[_capture/LS-26|Share list – sent]] · [[_capture/LS-38|Share list (from details)]] · [[_capture/RT-28|Share route]] · [[_capture/RT-30|Share route – email entered]] · [[_capture/RT-29|Share route – person is not a user]] · [[_capture/RT-32|Share route – sent]] · [[_capture/RT-31|Share route – sharing]] · [[_capture/LR-20|Sign-up – email already used]] · [[_capture/LR-21|Sign-up – invalid email message]] · [[_capture/LR-19|Sign-up – invalid password message]] · [[_capture/LR-18|Sign-up – residential sellers not supported]] · [[_capture/LR-04|Sign-up step 1 – choose your goals]] · [[_capture/LR-05|Sign-up step 1 – goals picked]] · [[_capture/LR-06|Sign-up step 2 – your role and customers]] · [[_capture/LR-07|Sign-up step 3 – tools you use today]] · [[_capture/LR-08|Sign-up step 4 – create your account]] · [[_capture/LR-10|Sign-up step 5 – setting up your account]] · [[_capture/RT-36|Stop 2 – people found]] · [[_capture/RT-38|Stop 3 – people with prices]] · [[_capture/RT-37|Stop 3 – searching for contacts]] · [[_capture/RT-39|Stop 3 – two people picked]] · [[_capture/RT-42|Stop 4 – searching for contacts]] · [[_capture/RT-76|Stop details]] · [[_capture/RT-75|Stop on the map – pop-up]] · [[_capture/RT-08|Three companies selected]] · [[_capture/AI-09|Two leads selected]] · [[_capture/AI-27|What next? Route, list or home]] · [[_capture/AI-15|ZIP code results – list]]

%% brain-links:end %%
