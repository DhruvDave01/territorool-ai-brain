---
area: context
tags: [brain/context]
ref: "Approved words (glossary)"
---

# Territool Glossary — APPROVED 2026-09-15 (owner approved roles + Activity/Note, `brain/audits/03-parity.md` §7 BT-8)

> Owner rules:
> - **Activity** = the CRM timeline item (type + date + note text).
> - **Note** = only the text body of an Activity, never the object name.
> - `note_*` API/DB fields (`note_type`, `updatecompanynotes`, `company_notes`) are **legacy field names**.
> - **Log Meeting is not a separate concept**: it is an Activity with type Meeting (BT-7).
> - **Admin** is internal HQ only, never the field app (BT-1).

**How to use:** write the **Canonical term** in new UI copy, docs, test cases and reports. **Aliases** are what you'll find in existing code, DB and UI. Don't use them in new copy, but you may still need them to find things. **Existing identifiers are never renamed**: the V2 API is additive-only (rule W9), and old code is untouched (USER SAID).

Counts are occurrences found on 2026-09-15:
- `mob` = quoted strings in mobile `App/`
- `blade` = `resources/views/front` + `auth`
- `php` = `app/Api/V2` + `app/Http/Controllers`
- `portal` = `resources/manager-portal`

## Roles (canonical names USER SAID, Phase 0 Q6 / Phase 1 Q-M1)

| Canonical | Meaning | Platforms | Aliases found (don't use in new copy) | Source |
|---|---|---|---|---|
| **Admin** | Territool internal administrator | web only (`/hq`) | "HQ" | USER SAID; `CheckUserRole.php:23-31`, `routes/web.php:97` |
| **Sales Agent** | Individual sales rep (own account) | mobile + web | "Salesperson" (ambiguous), "sales rep" | USER SAID; role string in `V2/AuthController.php:140` |
| **Business Agent** | Manager of a sales team; owns the subscription | web only (manager portal `/manager`) | **"Manager"** (web 116, php 121, portal 85), **"Business Client"** (legacy: `BusinessclientController`, `Admin\BusinessclientController`; mobile Settings chip) | USER SAID; `EnsureManagerRole.php:17`, `Auth/LoginController.php:44-50` |
| **Business Sales Agent** | Sales rep created and managed by a Business Agent (`users.parent_id`) | mobile + web | `businesssalesperson` (`BusinesssalespersonController`), "Salespeople" (portal), "Sales Rep" (portal 12) | USER SAID; `EnsureManagerRole.php:19`, `Auth/LoginController.php:134-138` |

⚠ **"Salesperson"** means different things in different places: `SalespersonController` (Admin HQ management of Sales Agents) vs the portal's "Salespeople" (Business Sales Agents). Always write the canonical role.

## Core objects

| Canonical | Meaning | Storage / API | Aliases | Notes / source |
|---|---|---|---|---|
| **Company** | A business saved to a user's account | `companies`; `addcompany`, `companydetail` | "Address Book" (the *section* listing companies: mob 12, blade 8), "Account" (Salesforce) | `Models/Company.php` |
| **Lead** | A business found by search that is **not yet saved** | `user_ai_search`; `getAILeads*` | "Prospect", "AI leads" | Saving a lead creates a Company (FindMcp README: 1 credit per lead) |
| **Contact** | A person at a Company | `contacts`; `addcontact` | "People" (mob 22, find-contacts UI), "conatct" (typo in V1) | `Models/Contacts.php` |
| **Route** | Ordered set of Stops to visit | `user_routes`, `user_route_companies`, `user_route_clusters`; `createroute` | "Basic/Simple route" vs "Advanced/Cluster route" (`route_type`), `sessionroute` (web upload flow) | route types need owner confirmation |
| **Stop** | A Company within a Route | `user_route_companies` (`UserCompanies`) | **"Waypoint"** (mobile code/UI: mob 30), "user_company" | propose "Stop" in UI; mobile code keeps "waypoint" identifiers |
| **Start point / End point** | First/last Stop chosen when generating a route | request `startPoint`/`endPoint`, `start_point` | "CURRENT LOCATION" pseudo-company | `V2/RouteController.php:2780-2786` |
| **List** | Named collection of Companies (not ordered) | `user_lists`, `user_list_companies`; `createList` | — | can generate a Route (`generateroute`) |
| **Territory** | Geographic area a user works/searches in | `user_cities`; city/ZIP inputs | "City", "ZIP", "Lasso" (drawn area) | portal uses "Territory" (66) |

## Activity, notes, visits

| Canonical | Meaning | Storage / API | Aliases | Notes / source |
|---|---|---|---|---|
| **Activity** | Dated interaction or plan for a Company, with a type (Meeting, Call, Visit, Message, Email, Reminder, Appointment) | **`company_notes`** (`Models/Notes`); `addcompanyactivity`, `getcompanyactivities`, also `addnote`/`getnotes` | **"Note"** (blade 151), `note_type` | `recentActivityData.js:23-34`; `Support/ActivityNoteType.php` |
| **Activity note** | The free-text body of an Activity | `company_notes.note` | "Note" | use "note" only for the text field |
| **Log Meeting** | Legacy web meeting record | `log_meetings`; `getlogmeeting`, `addlogmeeting` (the mobile app defines both constants but calls neither, 2026-09-16) | "Meeting" | **Answered (Q-P7, BT-7):** not a separate concept. A meeting is an Activity of type Meeting; the separate table is legacy (KG-BT7) |
| **Activity feed** | System log of what a user did ("Created List", "Activity Created") | **`activities`** (`Models/Activity`); `getUserActivity` | "Recent activity", "user activity" | `Helper::addUserActivity` (`V2/CompanyController.php:1015`); **not** the same as Activity |
| **Visited** | Company marked as visited in the field | `companies.is_visited`, `visited_at` | "Mark Visited" CTA | company-wide flag (03-parity P8) |
| **Visit log** | Timestamped visit entries | `user_visited_companies`; `addcompanyvisittime` | "visit time" | |
| **Bookmark** | Stop flagged by the user on a route | `bookmarkroutecompany` | **"Mark / Unmark"** on route stops | ⚠ not the same as Visited |

## Money and access

| Canonical | Meaning | Storage / API | Aliases | Notes / source |
|---|---|---|---|---|
| **Plan** (UI) / **Package** (code/DB) | A subscription product | `packages` (the Plans); `user_packages` (each purchase) | "Package" (blade 334), "Subscription" | propose "Plan" in UI copy |
| **Subscription** | A user's active purchase of a Plan | **`user_packages`** row (model `App\Models\Subscription`), active when `status = 'enable'`; there is no `subscriptions` table (`Globals/Helper.php:2844, 3157`; corrected 2026-09-16, CR-01) | "Renewal" | web Stripe/PayPal; mobile RevenueCat |
| **Credits** | Balance spent on contacts and saved leads | `user_credits.total_credit/used_credit`; `businessclient_salesagent_credits` (manager-allocated) | "credit" | paid contact 2, free contact 1 (`CompanylController.php:2715-2720`) |
| **Find Contacts** (UI) | Search providers for people at a Company | `fetchAllContacts`, `get*Contact`, `fetchClaudeContact` | "fetch contacts", "enrich" | |
| **Buy contacts** | Confirm selected contacts and spend credits | `buyContacts`, `redeem*Contact` | "redeem", "unlock" | |
| **Report** | Flag bad company/contact data (refund on contacts) | `reportcompany`, `reportcontact` | — | |

## Status words (overloaded; always qualify)

| Canonical | Meaning | Storage / API | Aliases |
|---|---|---|---|
| **Company status / Contact status** (UI: "Tag") | User-defined label with colour on a company/contact | `user_status`; `getuserstatus`, `updateuserstatus`, `company_status_id`, `contact_status_id` | "Tags · Edit Status" (mobile Settings), "status" |
| **Contact stage** | Lifecycle stage of a contact | `getusercontactstage` | "stage" |
| **Account status** | User active or inactive | `users.status` = `Active`/`Inactive` | "status" |
| **Subscription status** | `enable` / otherwise | `user_packages.status` | "active/inactive" |
| **Response status** | API result flag: success = `1` | JSON `status` | USER SAID only `status: 1` means success |

## Features and integrations

| Canonical | Aliases / identifiers | Notes |
|---|---|---|
| **AI Find Leads** | "AI Lead Finder" (`AILeadFinderController`), `MultipleAIWaypoint`, `getAILeadsV2` | |
| **Find Leads (Places)** | `MultipleWaypoint` | mobile |
| **Yelp Leads** | `getYelpLeads` | web |
| **Cognism** | **`Congnism`** (misspelt in `getCongnismContact`, `URL_CONGNISUM_CONTACT`, `CongContact` screen) | identifiers can't be renamed |
| **Industry** | `getIndutriesType` (misspelt) | |
| **RevenueCat** | `revenuecate-success` (misspelt) | |
| **Customer MCP** | "TerriTool App MCP" (`/ai/mcp`), "Find MCP" (`/find-mcp/mcp`) | Claude/ChatGPT connectors |
| **Admin MCP** | "Sales desk" (`/ai/mcp-admin`) | internal |

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (41)

**Documents (23):** [[brain/audits/03-parity|Audit 3 – mobile vs web]] · [[_code/brain/brain/gates/scripts/static-checks.js|Automatic code checker]] · [[brain/context/brain-qa|Brain QA: questions the brain must answer correctly, and how it did]] · [[brain/README|brain/ - GENERATED OUTPUT. Do not hand-edit during build.]] · [[CLAUDE-CODE-BOOTSTRAP|Claude Code Bootstrap Prompt]] · [[workspace/handoff/2026-09-17-company-details/result|Company details mobile UI]] · [[brain/context/contradiction-register|Contradiction register: where two sources disagreed, and which won]] · [[brain/memory/entries/conflict/20260917-2f6a6f-cr-01-glossary-a-subscription-is-subscriptions-s|CR-01 — glossary: a Subscription is subscriptions.status = 'enable' (a subscriptions table) ↔ code: the Subscription…]] · [[brain/memory/entries/conflict/20260917-05d480-cr-03-glossary-log-meeting-owner-to-confirm-q-p7|CR-03 — glossary: Log Meeting "⚠ owner to confirm (Q-P7)" ↔ open-questions: Q-P7 answered → BT-7 (a meeting is an Act…]] · [[workspace/design-proposals/2026-09-15-manager-salespeople-audit/audit|Design audit – manager Salespeople page]] · [[brain/assets/docs/design-audits/2026-09-15-manager-salespeople-audit/audit|Design audit (Mode A): Manager portal · Salespeople]] · [[brain/memory/entries/bug/20260917-21bd5d-kg-gloss2-admin-hq-main-navigation-uses-the-reti|KG-GLOSS2 — Admin HQ main navigation uses the retired term "Business Client" (glossary: Business Agent). static-checks.js…]] · [[brain/context/known-fragile|Known problems & risky areas]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/roles-permissions|Roles and permissions: who can do what, where, and what enforces it]] · [[brain/context/conventions-shared|Rules for all code]] · [[brain/skills/territool-design/SKILL|Skill – design]] · [[brain/skills/territool-router/SKILL|Skill – task router (start of every task)]] · [[brain/skills/territool-code/SKILL|Skill – writing code]] · [[CLAUDE|Start here – brain overview]] · [[workspace/loop/20260916-ts2345-commonfunctions/state|TASK: ts2345-commonfunctions]] · [[brain/context/agent-brief|Territool brain — operating brief for any AI coding tool]] · [[workspace/handoff/2026-09-17-company-details-web/result|Web Company Details UI — handoff]]

**Coding rule (1):** [[_id/W9|API changes only add, never remove]]

**Owner decisions (5):** [[_id/BT-1|Block Admin on the mobile app]] · [[_id/BT-7|Log Meeting = a Meeting activity]] · [[_id/Q-P7|Question: is Log Meeting just an activity?]] · [[_id/Q-M1|Question: which roles use the mobile app?]] · [[_id/BT-8|Use the approved words]]

**Problem founds (2):** [[_id/KG-GLOSS2|Admin HQ main navigation uses the retired term…]] · [[_id/KG-BT7|Separate “Log Meeting” data]]

**Code files (10):** [[_code/web/app/Support/ActivityNoteType.php|ActivityNoteType]] · [[_code/web/app/Api/V2/Controllers/AuthController.php|AuthController]] · [[_code/web/app/Models/Company.php|Company]] · [[_code/web/app/Api/V2/Controllers/CompanyController.php|CompanyController]] · [[_code/web/app/Http/Controllers/CompanylController.php|CompanylController]] · [[_code/web/app/Models/Contacts.php|Contacts]] · [[_code/web/app/Globals/Helper.php|Helper]] · [[_code/web/app/Http/Controllers/Auth/LoginController.php|LoginController]] · [[_code/mobile/App/components/dashboard/recentActivityData.js|recentActivityData.js]] · [[_code/web/app/Api/V2/Controllers/RouteController.php|RouteController]]

%% brain-links:end %%
