---
area: audits
tags: [brain/audits]
ref: "Audit 3 – mobile vs web"
---

# Phase 3 — Cross-Platform Parity Audit

- **Date:** 2026-09-15
- **Inputs:** `shoebox/07-flows/flows.md` (**DRAFT by Claude**, criticality proposed), `01-mobile.md`, `02-web.md`, both repos.
- **Status:** STOPPED. Decisions in §6 and criticality sign-off await the owner.
- **Draft outputs:** `brain/context/parity-map.md`, `brain/context/glossary.md` (both marked DRAFT until approved).
- **No code was changed.** Per DW1 ("don't change it") and "do not touch the old code", every divergence below is a **finding for future decisions**, not a fix.

## Method and coverage

I compared business rules by reading the actual request handlers on each surface for the flows where divergence is most likely to cause real bugs: login, registration, company, contact, activity, route, list, visited, buy/report contacts. Evidence is file:line from both repos.

**Deep-compared:** F01, F02, F08, F10, F11, F12, F13, F14, F15, F16.
**Mapped but not rule-compared (marked UNVERIFIED in the parity map):** F03, F05, F06, F07, F09, F17, F19–F21, F26–F28.

---

## 1. Flow → surface map (summary)

Full screen and endpoint lists per flow are in `shoebox/07-flows/flows.md`.

| Flow | Mobile | Web (user) | Manager portal | Admin HQ | MCP |
|---|---|---|---|---|---|
| F01 Login/session | ✅ | ✅ | ✅ (session) | ✅ | OAuth consent |
| F02 Register/onboarding | ✅ | ✅ | — | — | — |
| F03 Subscription/paywall | ✅ RevenueCat | ✅ Stripe/PayPal | — | packages/promos | — |
| F06 AI Find Leads | ✅ | ✅ (SSE) | ✅ | — | ✅ |
| F08 Create route | ✅ | ✅ | — | — | ✅ (RoutesTools) |
| F10 Mark visited | ✅ | list/delete only | — | — | ✅ |
| F11 Lists | ✅ | ✅ | — | — | ✅ |
| F12 Companies | ✅ | ✅ | view | ✅ Backpack | search |
| F13 Contacts | ✅ | ✅ | view | ✅ Backpack | ✅ |
| F14 Activities | ✅ | ✅ (+ Log Meeting) | feed | — | ✅ |
| F15 Find/Buy contacts | ✅ | ✅ | — | — | ✅ |
| F23 Manager portal | — (by design) | — | ✅ | — | — |
| F25 Admin HQ | — (by design) | — | — | ✅ | Admin MCP |

---

## 2. Business-rule divergences (verified)

### P1 — Mobile login role gate does not match "Admin and Business Agent are web-only" (F01)
| Surface | Rule | Evidence |
|---|---|---|
| API (mobile) | Allows **Sales Agent, Business Sales Agent and Admin**. Blocks every other role, i.e. **Business Agent**: "You are not authorized to login". The "not active" check applies only to Sales Agent / Business Sales Agent, **not Admin** | `V2/AuthController.php:135-141, 167-171` |
| Web | Blocks any **Inactive** user. Blocks a **Business Sales Agent whose parent (Business Agent) is inactive or has no enabled subscription** | `Auth/LoginController.php:112-119, 134-185` |
| Mobile app | No role check client-side; stores `data.data.role` | `login/index.js:684-701` |

**Accidentally different:**
1. **Admin can log in on mobile**, contradicting USER SAID (Admin is web-only).
2. **A Business Sales Agent whose manager's subscription lapsed is blocked on web but allowed on mobile.**
3. An **inactive Admin** is not blocked by the API.

### P2 — Registration validation is much weaker on the API than on web (F02)
| Field | Mobile client | API `mobileRegister` | Web `RegisterController` |
|---|---|---|---|
| name | required (toast) | `required` | `required\|max:255\|no_special_chars` |
| email | regex `^[\w.+-]+@[\w-]+\.[\w.-]+$` | `required\|unique:users` (**no format check**) | `required\|email\|max:255\|unique:users\|blocked_domain` |
| phone | exactly 10 digits | **none** | `required` |
| password | no length rule found | `required` (**no minimum**) | `required\|min:6` |
| bot protection | — | — | `g-recaptcha-response` required |
| Evidence | `register/index_register_split.js:622, 655-669` | `V2/AuthController.php:267-274` | `Auth/RegisterController.php:167-177` |

**Accidentally different:** an API client (or an older app build) can register with a 1-character password, a blocked email domain, or no phone number.

### P3 — Add company: required fields differ on all four surfaces (F12)
| Field | Mobile | API `addcompany` | Web `store` (+ Blade) | Admin HQ (Backpack) |
|---|---|---|---|---|
| title | required | required | required | required, min 2, max 255 |
| address | required + "precise address" | required | required | required, min 2, max 255 |
| city_id | derived | required | required | required |
| postal_code / latitude / longitude | derived ("precise address") | **required** | not required (geocoded) | required |
| status | required | `company_status_id` required | derived server-side | — |
| phone | no rule | no rule | Blade regex `^[- +()]*[0-9][- +()0-9]*$` | `numeric` (digits only) |
| website | — | — | Blade `validUrl` | `url` |
| duplicate check | — | title LIKE + address LIKE per user → "Company already exists" | duplicate handling present | — |
| Evidence | `company/create/index.js:223-259` | `V2/CompanyController.php:235-245, 264-265, 434` | `CompanylController.php:211-215`; `front/company/createl.blade.php:267-282` | `app/Http/Requests/CompanyRequest.php:27-35` |

**Accidentally different:** the same phone number can be valid on web (`+1 (555) 123`) and invalid in the admin panel (non-digits).

### P4 — Add contact: required fields and credit cost differ (F13)
| Rule | Mobile Contacts → Create | Mobile inline (company create) | API `addcontact` | Web `contactStore` (+ Blade) | Admin HQ |
|---|---|---|---|---|---|
| name | required | required | `contact_name` required | `contact_name` required | `first_name` required min 2 max 255 |
| position | **required** | not required | not required | Blade **required**; server not required | — |
| status | required | required | `contact_status_id` **required** | not required | — |
| phone / mobile | `minlength 6, maxlength 12, numbers`, but the message says **"7-12 digits"** | same | none | Blade regex, any length | — |
| email | valid if present | valid if present ("vaild" typo) | none | Blade regex | — |
| **credit charged for manual add** | — | — | **+1 `used_credit`** for packages `1,2,5,6` | **none** | — |
| Evidence | `contacts/create.js:130-193` | `company/create/index.js:828-864` | `ContactSellController.php:57-61, 156-185` | `CompanylController.php:7140-7144` (no credit lines in `:7139-7294`); `front/contact/create.blade.php:257-290` | `ContactRequest.php:28` |

**Accidentally different, and involves money:**
1. Adding a contact by hand **costs 1 credit on mobile/API but is free on web**.
2. The **credit-package id list differs**: API `addContact` uses `['1','2','5','6']` (`ContactSellController.php:158`), while web `buyContacts` uses `['1','2','4','5','6']` (`CompanylController.php:2698`). Package 4 is billed differently depending on the path.
3. Mobile itself disagrees on whether `position` is required.

### P5 — Add activity: web accepts activities without type or date (F14)
| Rule | Mobile | API `addcompanyactivity` | Web `note/store` (`companynotestore`) |
|---|---|---|---|
| company | implicit | `company_id` required | `com_id` required |
| note | required ("Please enter a note.") | required | required |
| type | required ("Please select an activity type.") | `note_type` required | **not required** |
| date | required ("Please select a date."), time optional | `date` required | **not required** |
| ownership check on company | — | **none** (`Company::find($company_id)`) | **none** |
| Evidence | `customcompany/index.js:3449-3610` | `V2/CompanyController.php:983-1026` | `CompanylController.php:7497-7514` |

**Accidentally different:** a web-created activity with no date lands in mobile's **"past"** bucket (`whereNull('date_time')`, `V2/CompanyController.php:955-959`) and never appears as upcoming. The failure `status` is string `"0"` at `:1005` but int `0` at `:1021`.

### P6 — Route size limits: three different rules (F08)
| Surface | Rule | Evidence |
|---|---|---|
| Mobile | **2 to 400** companies, client-side only | `route/create.js:1335-1336, 1389-1391` |
| API `createroute` | **no count limit, no route-name validation** (name uniqueness is a separate endpoint the client must call first) | `V2/RouteController.php:2737-2800` |
| Web basic route | **150 companies per city** ("Too many companies for below cities, allowed: 150") | `RoutesController.php:1421-1424` |
| Name uniqueness | API `checkroutename`: exact `title` match per user; mobile calls it before create | `V2/RouteController.php:3884-3905`; `route/create.js:1446` |

**Accidentally different:** the business limit depends on which surface creates the route. MCP `create_route` inherits the API's "no limit".

### P7 — Lists: minimum companies and name check (F11)
| Surface | Rule | Evidence |
|---|---|---|
| Mobile | at least 1 company (client); **list name is checked against the route-name endpoint** (`URL_CHECK_ROUTE_NAME`, which queries `user_routes`) | `list/create.js:1356, 1395-1402` |
| API `createList` | `list_title required\|max:255` only; **empty list allowed** | `V2/ListController.php:97-103, 116-124` |
| Web `list/step1` | `list_title required\|max:255` **and** `selected_companies_selected required\|min:1` | `ListController.php:113-125` |

**Accidentally different:**
1. An API/MCP client can create an empty list.
2. Mobile rejects a list name that matches an existing **route** name, and never checks against existing **list** names.

### P8 — "Visited" is a company-wide flag with three writers and no web writer (F10)
| Writer | What it writes | Evidence |
|---|---|---|
| API `companymarkedvisited` | `companies.is_visited` (on the **Company**, not the route stop) + `visited_at`; looks up `UserCompanies::find($userCompanyId)` **without checking the owner** | `V2/RouteController.php:1272-1290` |
| API `addcompanyvisittime` (flag=1) | `user_visited_companies` row + `companies.is_visited = "1"`; **no owner check** | `V2/RouteController.php:3961-3981` |
| UserMcp `RoutesTools` | writes `$stop->is_visited = '1'` **directly**, not through the V2 endpoint that other clients use | `UserMcp/Services/Tools/RoutesTools.php:412` |
| Web | **no code sets visited = 1** (only `RouteController.php:1111` initialises `'0'`); web can list and delete visits | grep; `routes/web.php:338, 342` |

**Findings:**
- (a) Marking a company visited on one route marks it visited everywhere it appears. Is that intended? (Q-P4)
- (b) The MCP path can drift from the API behaviour (`visited_at`, activity log, Salesforce sync).
- (c) Visit writes lack ownership checks (rule W5 violation in legacy code).

### P9 — Buy contacts and report company/contact: shared implementation (F15, F16) ✅
- API `buyContacts`, `reportcompany`, `reportcontact` **delegate to the web controller** (`V2/CompanyController.php:3216-3240`, `V2/ContactSellController.php:788-798` → `CompanylController`). The rules are **identical by construction**.
- Credit cost is consistent: paid contact = 2 credits (pre-check `CompanylController.php:2495, 2521`; charge `$rate = 2` at `:2715-2719`); free contact = 1 (`:2720`). This matches `FindMcp/README.md` ("2 credits paid / 1 credit free").
- Quirks: the report endpoints return `status: 200` on success, which the API maps to `1`; validation failures return **HTTP 422** with `status: 0` (`CompanylController.php:3437, 3443`). That's a legacy exception to DW1, but mobile still handles it (422 isn't in `API.js`'s list, so the body flows through and `status != 1` shows the message).
- Layering is inverted: the API depends on a web controller (rule W7 forbids this for new code).

### P10 — Success/failure `status` type differs by endpoint (all shared flows)
| Endpoint | Success | Failure | Evidence |
|---|---|---|---|
| `login` | `"1"` (string) | `"0"` | `V2/AuthController.php:114-171` |
| `getUserActivity` | `1` (int) | — | `V2/AuthController.php:869-873` |
| `addcompanyactivity` | default `1` | `"0"` and `0` | `V2/CompanyController.php:1005, 1021` |
| `createList` | default | `0` | `V2/ListController.php:107` |
| web `RoutesController::basic` | `'1'` | `'0'` | `RoutesController.php:1433-1442` |

Mobile tolerates all of these with a loose `== 1`; the manager portal accepts `1` or `'1'` (`managerFetch.js`). USER SAID success is "only status: 1", which is true in meaning but not in type.

---

## 3. Logic in the wrong place

| # | Finding | Where | Risk |
|---|---|---|---|
| L1 | **Business limits enforced only in the mobile client:** route 2–400, list ≥ 1, contact phone length, register phone 10 digits, contact position | P2, P4, P6, P7 | Any other client (older app builds, MCP, scripts) bypasses them |
| L2 | **Client-side AI with a bundled key:** business-card parsing calls Gemini from the device | `App/utils/geminiBusinessCard.js`; key in `App/config/index.js:208` | Key extraction/abuse (S6); server already has AI services (`Services/ClaudeContactFinder`) |
| L3 | **Client talks to Google directly:** Places/Geocoding/Directions from mobile (`findLeads/fetchingResults.js`, `utils/googleDirections.js`, `utils/googlePlacesPlaceId.js`) while the server also calls Google for the same features (`Globals/Helper.php`, `RoutesController.php`) | both | Different results/filters for the same territory; two quota consumers |
| L4 | **Response-shape guessing in the client:** mobile probes `total_contact ?? data.total_contact ?? contact_count ?? data.contact_count` | `route/contact/index.js:51-69` | The API should return one field |
| L5 | **API depends on web controllers** (buy/report contacts) | P9 | Web changes silently change the mobile/MCP contract |
| L6 | **MCP bypasses the API** for mark-visited | P8 | MCP behaviour drifts from mobile |
| L7 | **Three AI-lead-finding code paths** exist: web `AILeadFinderController` (SSE), API `getAILeads/getAILeadsV2/resumeAILeadSearch` in `V2/CompanyController`, Manager `Services/Manager/ManagerFindLeadsService.php`. Whether they share the core pipeline is **not verified** | file existence; `V2/CompanyController.php` imports `AILeadFinderController` | Possible triple implementation of the same flow; verify in Phase 5 |

---

## 4. Vocabulary drift (full table in `brain/context/glossary.md`)

Most consequential:
1. **Roles.** One role has 3–4 names. **Business Agent** = "Manager" (portal/web) = "Business Client" (legacy controllers `BusinessclientController`, `Admin\BusinessclientController`; the mobile Settings package chip shows "Business Client"). **Business Sales Agent** = `businesssalesperson` (web controller) = "Salespeople" (manager portal). **"Salesperson"** is ambiguous: `SalespersonController` serves Admin HQ user management, while the portal's "Salespeople" are Business Sales Agents.
2. **Activity vs Note vs Log Meeting.** The UI says "Activity"; the table is `company_notes`, the model `Notes`, and the endpoints both `addnote` and `addcompanyactivity`. "Log Meeting" is a separate web-only table (`log_meetings`). Meanwhile "user activity" (`activities` table, `getUserActivity`) is a different concept: the audit feed.
3. **Company vs Lead vs Waypoint vs Stop.** A saved business is a Company (`companies`). AI results are "Leads". Mobile code calls route stops "Waypoint(s)" (30 occurrences); the web UI says "Stop" (37).
4. **Visited vs Mark vs Bookmark.** "Mark Visited" sets `companies.is_visited`. "Mark/Unmark" on a route stop is the **bookmark** (`bookmarkroutecompany`).
5. **Status** is overloaded: company/contact status (`user_status`, shown as "Tags · Edit Status"), contact stage (`getusercontactstage`), user account status (`Active`/`Inactive`), subscription status (`enable`).
6. **Misspellings baked into the API contract:** `Congnism` (Cognism), `getIndutriesType`, `revenuecate-success`, `CompanylController`, `BusinesssalespersonController`. These can't be renamed under W9 (additive-only), so the glossary maps them.

---

## 5. What stays intentionally different (proposed; owner to confirm)

| Area | Difference | Why it's plausibly intended |
|---|---|---|
| Billing rails | Mobile RevenueCat vs web Stripe/PayPal | App Store/Play rules |
| Manager portal, BSA management, Admin HQ, bulk CSV upload, CRM field mapping | Web only | USER SAID Admin & Business Agent are web-only; desktop workflows |
| Scan business card, QR route import, active-route navigation, mark visited | Mobile only (web can view/delete visits) | Field actions |
| Session model | Mobile JWT (forced re-login ~28 days, USER SAID intended) vs web session | Platform norms |

---

## 6. DECISIONS / QUESTIONS for the owner

None of these will be changed in existing code without an explicit task. The answers become parity-map statuses and future rules.

- **Q-P1 Criticality.** Please confirm or change the proposed values in `shoebox/07-flows/flows.md`:
  - BLOCKER: F01, F03, F04, F15
  - HIGH: F02, F05, F06, F08, F09, F10, F11, F12, F13, F14, F23, F24, F29
  - MEDIUM: F07, F16–F22, F25, F31, F32
  - LOW: F26–F28, F30
- **Q-P2 Mobile login gate (P1).** Should the API reject **Admin** on mobile (you said Admin is web-only)? And should the web rule "Business Sales Agent is blocked when the manager is inactive or unsubscribed" also apply on mobile?
- **Q-P3 Manual contact credit (P4).** Should adding a contact **by hand** cost 1 credit (mobile/API today) or be free (web today)? And is package **4** a credit package or not?
- **Q-P4 Visited (P8).** Is "visited" meant to be **per company everywhere**, or **per route stop**? And is it intentional that web users can't mark visited?
- **Q-P5 Route limits (P6).** Which is the real business rule: **2–400 companies** (mobile), **150 per city** (web), or **no limit** (API/MCP)?
- **Q-P6 Activity rules (P5).** Must every activity have a **type and date** (mobile/API), or are undated notes valid (web)?
- **Q-P7 Log Meeting.** Is a web "Log Meeting" a separate concept, or just an activity of type Meeting?
- **Q-P8 Glossary.** Approve the proposed canonical terms in `brain/context/glossary.md` (especially the role names and Activity/Note).

---

## 7. APPROVAL RECORD (USER SAID, 2026-09-15)

### Criticality (Q-P1): final
- **BLOCKER:** F01 login, **F02 registration** (raised from HIGH: "new users cannot start without it"), F03 subscriptions, F04 renewal crons, F15 buying contacts.
- **HIGH:** F05, F06, F08, F09, F10, F11, F12, F13, F14, F23, F24.
- **MEDIUM:** **F29 customer MCP** (lowered from HIGH, "unless it is already a sold, customer-facing product" → open question Q-P9), F07, F16–F22, F25, F31, F32.
- **LOW:** F26, F27, F28, F30.

### Approved target behaviours (product rules)
These are **not implemented**. Existing code changes only when a task explicitly asks (USER SAID "do not touch the old code"). Each becomes a gate/test item in Phases 5–6.

| ID | Target behaviour (USER SAID) | Current code (verified) | Gap |
|---|---|---|---|
| **BT-1** | Mobile API **rejects Admin** ("Admins should use web HQ, not JWT field APIs") | API admits Admin (`V2/AuthController.php:135`) | defect |
| **BT-2** | **Business Sales Agent access on mobile follows the manager's plan**, same as web | Web checks parent status + subscription (`Auth/LoginController.php:134-185`); API doesn't | defect |
| **BT-3** | **Hand-added contacts are free** on every surface (Contacts create, company create, business card). Credits only for provider unlocks. Owner: 1 credit for Claude/biz sources, 2 credits for Cognism and other paid providers | API `addcontact` charges +1 credit for packages 1,2,5,6 (`ContactSellController.php:156-185`). Web is free. Unlock pricing in code: paid contact `$rate = 2` (`CompanylController.php:2715`); the code's "free contact" class costs 1 (`:2720`) | defect (API manual add) |
| **BT-4** | **Visited is per company**; the route/list is only context for when it happened. Web without Mark Visited is **intentional**; web should display last-visited if the API returns it. Don't make visited per-stop | Company-level `companies.is_visited` + `visited_at` + `user_visited_companies` log (`V2/RouteController.php:1272-1290, 3961-3981`) | matches. Remaining issues: no owner check on visit writes; MCP writes directly (`RoutesTools.php:412`) |
| **BT-5** | **Route size: 2–400 companies globally, no per-city cap.** The 150-per-city rule is leftover unless ops has a hard reason | Mobile 2–400 client-only; API/MCP **no cap**; web session-route flow **150 per city** (`RoutesController.php:1421-1424`, a web controller, not the API) | API/MCP lack enforcement; web legacy cap |
| **BT-6** | **Activity requires type + date + note; time optional.** Future date = "Schedule", today/past = "Save" | Mobile & API match (`V2/CompanyController.php:997-1002`); web `note/store` requires only `com_id` + `note` (`CompanylController.php:7497-7514`) | defect (web) |
| **BT-7** | **"Log Meeting" is the same thing as an Activity with type Meeting.** No separate model for new work | Separate `log_meetings` table + endpoints `getlogmeeting`/`addlogmeeting` + web views | legacy split; consolidating existing data needs a future task |
| **BT-8** | Glossary approved: Sales Agent, Business Agent, Business Sales Agent, Admin (HQ only), **Activity** = timeline item (type + date + note text), **Note** = only the text body; `note_*` are legacy field names | `brain/context/glossary.md` | adopted |

### Earlier-phase items resolved
- **DW5:** confirmed. "All new API/app code", **not** rewriting the legacy app. Rules govern new code only.
- **PHP / framework (QW1):** owner: staging must be PHP 7.2+; 5.x would be a server misconfiguration to verify. ⚠ Owner also wrote "Laravel 7", but the **installed framework is Laravel 5.3.31** (`vendor/laravel/framework/src/Illuminate/Foundation/Application.php:28`, `composer.lock`), and the owner's Phase 0 answer said no upgrade has started. **Rule W17 (PHP 7.4 + Laravel 5.3 compatible) stays.**
- **JWT dependency (QW2):** owner: "real bug if true". **It is true:** `tymon/jwt-auth` is in `require-dev` (`composer.json:43`) while API auth uses it at runtime. Target (**BT-9**): JWT must be a production (`require`) dependency and servers install via Composer. Not changed yet.
- **Queue worker (QW4):** unknown from the repo. **Ops check needed** (**BT-10**): confirm `php artisan queue:work`/Supervisor runs on staging and production, otherwise bulk jobs (e.g. `BuyContactsBulkJob`, `RedeemFullEnrichBulkJob`) never run.
- **Q-M3 offline routes:** owner: **accidental half-removal**. Writes are gone (`createOFFLINERoute` never called), the read remains (`route/index.js:707`). **Product decision pending (BT-11):** keep offline (restore snapshot save after a successful route-list fetch) or drop it (remove the read path and the Realm schema).
- **Staging PHP binary (BT-12):** verify `php -v` on staging.

### Verification of owner statements (2026-09-15)
- **BT-4 `last_visited_time`:** confirmed. It's an **API response field** computed from the latest `user_visited_companies.visit_time` (`V2/RouteController.php:455, 1135, 1765, 2210`), not a `companies` column. Mobile shows it as "Visited MM/DD, hh:mm a" (`route/edit.js:761-762`, `route/create.js:1018`).
- **BT-3 package 4:** the only schema/data snapshot in the repo (`database/webterritool.sql`, 2019) defines packages **1** "Free Package" (SalesAgent), **2** "Delux Package" (SalesAgent), **3** "Deluxe Business" (BusinessClient). Packages 4–6 were added later. Their meaning must be read from the **staging** `packages` table (owner agrees it's a DB question).

### New open question
- **Q-P9:** Is the customer MCP (Claude/ChatGPT connectors, F29) sold to customers today? If yes, F29 goes back to HIGH.

Still pending from earlier phases (superseded by §7 above):
- DW5 "all code": is my new-code-only reading correct?
- QW1: staging PHP version (the code requires PHP 7+).
- QW2: `--no-dev` deploy vs jwt-auth.
- QW4: queue worker.
- Q-M3: offline routes dropped on purpose?

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (108)

**Documents (19):** [[brain/context/glossary|Approved words (glossary)]] · [[brain/context/architecture|Architecture: how Territool is built, end to end]] · [[brain/audits/01-mobile|Audit 1 – mobile app review]] · [[brain/audits/02-web|Audit 2 – web app review]] · [[CLAUDE-CODE-BOOTSTRAP|Claude Code Bootstrap Prompt]] · [[brain/context/design-assets|Design files & asset rules]] · [[brain/memory/entries/parity/20260917-df02db-kg-p3-company-contact-list-validation-drift|KG-P3 — company/contact/list validation drift]] · [[shoebox/09-known-issues/fragile|Known issues draft]] · [[brain/context/known-fragile|Known problems & risky areas]] · [[brain/context/parity-map|Mobile vs web differences]] · [[shoebox/07-flows/flows|Original flow descriptions]] · [[workspace/design-proposals/2026-09-17-lists-library-filter/placement|Placement walk-through: "add a filter to the Lists library"]] · [[brain/context/flows|Product features list]] · [[brain/memory/entries/question/20260917-2aa36e-q-p9-is-the-customer-mcp-claude-chatgpt-connecto|Q-P9 — Is the customer MCP (Claude/ChatGPT connectors, F29) sold to customers today?]] · [[brain/context/open-questions|Questions put to the owner, and what came back]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/conventions-shared|Rules for all code]] · [[brain/context/stack|Tech setup & environments]] · [[brain/context/conventions-web|Web app coding rules]]

**Product features (30):** [[_id/F14|Activities / notes / log meetings]] · [[_id/F25|Admin HQ]] · [[_id/F30|Admin MCP]] · [[_id/F06|AI Find Leads → save leads]] · [[_id/F32|App launch, permissions, crash, offline]] · [[_id/F22|Bulk CSV upload]] · [[_id/F24|Business Sales Agent management]] · [[_id/F12|Companies (Address Book)]] · [[_id/F13|Contacts]] · [[_id/F08|Create route]] · [[_id/F21|CRM sync]] · [[_id/F29|Customer MCP connectors]] · [[_id/F05|Dashboard, activity feed, calendar]] · [[_id/F15|Find & buy contacts]] · [[_id/F11|Lists]] · [[_id/F01|Login & session]] · [[_id/F23|Manager portal]] · [[_id/F10|Mark visited & visit log]] · [[_id/F31|MCP client connections & chat]] · [[_id/F27|Notifications & push]] · [[_id/F07|Places / Yelp leads]] · [[_id/F19|QR route import]] · [[_id/F28|Referral invites]] · [[_id/F02|Registration & onboarding]] · [[_id/F16|Report company/contact]] · [[_id/F09|Route detail & navigation]] · [[_id/F17|Share route/list]] · [[_id/F03|Subscription / paywall / upgrade / cancel / credits…]] · [[_id/F04|Subscription & credit renewal]] · [[_id/F26|Support tickets]]

**Coding rules (6):** [[_id/W9|API changes only add, never remove]] · [[_id/W7|Business logic in services]] · [[_id/W5|Only the user's own data]] · [[_id/DW5|Rule scope]] · [[_id/DW1|Validation/handled-failure format for new V2 endpoints]] · [[_id/W17|Works on PHP 7.4]]

**Owner decisions (22):** [[_id/BT-4|“Visited” is per company]] · [[_id/BT-6|Activity needs type, date & note]] · [[_id/BT-1|Block Admin on the mobile app]] · [[_id/BT-10|Check the background job worker]] · [[_id/BT-3|Hand-added contacts are free]] · [[_id/BT-7|Log Meeting = a Meeting activity]] · [[_id/BT-9|Login library must ship with the app]] · [[_id/BT-11|Offline mode dropped]] · [[_id/Q-P8|Question: approve the glossary words]] · [[_id/Q-P2|Question: block Admin on mobile?]] · [[_id/Q-P3|Question: do hand-added contacts cost a credit?]] · [[_id/Q-P1|Question: how important is each feature?]] · [[_id/Q-P4|Question: is “visited” per company or per stop?]] · [[_id/Q-P7|Question: is Log Meeting just an activity?]] · [[_id/Q-P9|Question: is the customer AI connector sold?]] · [[_id/Q-P6|Question: must activities have a type & date?]] · [[_id/Q-M3|Question: were offline routes dropped on purpose?]] · [[_id/Q-P5|Question: what is the real route size limit?]] · [[_id/BT-5|Routes have 2–400 stops]] · [[_id/BT-2|Sales reps follow their manager's plan]] · [[_id/BT-12|Server PHP version]] · [[_id/BT-8|Use the approved words]]

**Problem found (1):** [[_id/KG-P3|Validation differs between apps]]

**Code files (30):** [[_code/mobile/App/utils/API.js|API.js]] · [[_code/web/app/Api/V2/Controllers/AuthController.php|AuthController]] · [[_code/web/app/Api/V2/Controllers/CompanyController.php|CompanyController]] · [[_code/web/app/Http/Controllers/CompanylController.php|CompanylController]] · [[_code/web/app/Http/Requests/CompanyRequest.php|CompanyRequest]] · [[_code/mobile/App/config/index.js|config/index.js]] · [[_code/mobile/App/components/route/contact/index.js|contact/index.js]] · [[_code/web/app/Http/Requests/ContactRequest.php|ContactRequest]] · [[_code/web/app/Api/V2/Controllers/ContactSellController.php|ContactSellController]] · [[_code/mobile/App/components/contacts/create.js|create.js]] · [[_code/mobile/App/components/route/create.js|create.js]] · [[_code/mobile/App/components/list/create.js|create.js]] · [[_code/mobile/App/components/company/create/index.js|create/index.js]] · [[_code/mobile/App/components/customcompany/index.js|customcompany/index.js]] · [[_code/mobile/App/components/route/edit.js|edit.js]] · [[_code/mobile/App/components/findLeads/fetchingResults.js|fetchingResults.js]] · [[_code/mobile/App/utils/geminiBusinessCard.js|geminiBusinessCard.js]] · [[_code/mobile/App/utils/googleDirections.js|googleDirections.js]] · [[_code/mobile/App/utils/googlePlacesPlaceId.js|googlePlacesPlaceId.js]] · [[_code/web/app/Globals/Helper.php|Helper]] · [[_code/mobile/App/components/register/index_register_split.js|index_register_split.js]] · [[_code/web/app/Api/V2/Controllers/ListController.php|ListController]] · [[_code/mobile/App/components/login/index.js|login/index.js]] · [[_code/web/app/Http/Controllers/Auth/LoginController.php|LoginController]] · [[_code/web/app/Services/Manager/ManagerFindLeadsService.php|ManagerFindLeadsService]] · [[_code/web/app/Http/Controllers/Auth/RegisterController.php|RegisterController]] · [[_code/mobile/App/components/route/index.js|route/index.js]] · [[_code/web/app/Api/V2/Controllers/RouteController.php|RouteController]] · [[_code/web/app/Http/Controllers/RoutesController.php|RoutesController]] · [[_code/web/app/UserMcp/Services/Tools/RoutesTools.php|RoutesTools]]

%% brain-links:end %%
