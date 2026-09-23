---
area: context
tags: [brain/context]
ref: "Roles and permissions: who can do what, where, and what enforces it"
---

# Roles and permissions: who can do what, where, and what enforces it

Answers "which role can access X?", "is X available on mobile for this role?" and "what stops them?".
Canonical role names come from `glossary.md`. The raw per-page access matrix is generated in `web-flows.md` §4.

**Evidence labels:** **RT** = observed at runtime on staging, 2026-09-16 (mobile = second iOS simulator,
build 42.32 (1); web = `tools/web-explore.js`; API = `workspace/test-suites/api-contract`). **Code** = read in
the repos (file:line). **Owner** = USER SAID. **—** = not available to that role.

## 1. How roles are stored and enforced

| Layer | Mechanism | Evidence |
|---|---|---|
| Storage | Spatie roles: `roles` + the `role_users` pivot; `User::hasRole()` | Code `app/User.php:9, 16`; `config/laravel-permission.php:116` |
| Team link | a Business Sales Agent's `users.parent_id` = its Business Agent | Code `app/User.php:62, 66`; RT (`getuserdata.profile.parent_id` is a number for the BSA, null for the SA) |
| Web: Admin vs others | `role` middleware (`CheckUserRole`): Admin is kept to `/hq/*`; every other role is sent away from `/hq/*` | Code `CheckUserRole.php:20-40`; RT (§3) |
| Web: manager portal | `manager.only` (`EnsureManagerRole`): only a Business Agent reaches `/manager/*`; the portal JSON API answers a Sales Agent with a redirect and an anonymous caller with **401 `{error}`**; `/manager/api/rep/{id}` is limited to the manager's own team (404 otherwise) | Code `EnsureManagerRole.php:10-27`; `ManagerDashboardController.php:440-455`; RT (EV-A13) |
| Web: BSA login | a BSA may log in only when active, when its parent exists and is active, and, if the parent is a Business Agent, when the parent has an `enable` subscription | Code `Auth/LoginController.php:139-190` |
| Web: Admin login | `/hq/login` has a **reCAPTCHA**; the shared `/login` refuses an Admin | RT |
| Mobile API: login | admits **Sales Agent, Business Sales Agent and Admin**; refuses a Business Agent | Code `V2/AuthController.php:136-140`; RT `TC-F01-001/006/007/008` |
| Mobile API: after login | **no role gate**: every JWT endpoint serves any role; ownership is hand-written per query. Runtime probes (2026-09-16): `companydetail` and `getnotes` are owner-scoped; **`getlastvisitedentry` and `simplerouteview` are not**: another user's visit log (UI-SEC-10) and another user's whole route with its stops (UI-SEC-11) were read; several writes lack it (S3.8, KG-BT4) | Code `routes/api.php:103`; `api-map.md` §1 |
| Mobile UI | the role string in Realm hides features for a BSA (`editstatus.js:1810, 2232, 2510`); an App Store review account (the App Store review account (address hard-coded in `repos/mobile/App/components/login/index.js`)) also hides plan features | Code `login/index.js:690-691` |
| MCP | the customer connector acts as the connected user through V2, so the V2 rules apply | Code `UserMcp/Services/CustomerApiClient.php:9-60` |

## 2. Role × surface

| Surface | Sales Agent | Business Sales Agent | Business Agent | Admin |
|---|---|---|---|---|
| Mobile app | ✅ RT | ✅ RT | — (API refuses login; RT `TC-F01-007`) | **admitted by the API** (RT `TC-F01-008`); product rule says web only (Owner, BT-1) |
| Web user app (Blade) | ✅ RT | ✅ RT (smaller menu) | partial: its landing pages redirect to the portal, yet it can open `/company`, `/routes`, `/lists`, `/contact`, `/findleads`, `/subscription` (RT) | — (redirected to `/hq`; Code) |
| Manager portal `/manager` | — (redirect to `/dashboard`, RT) | — (redirect, RT) | ✅ RT | — (Code) |
| Admin HQ `/hq` | — (redirect, RT) | — (redirect, RT) | — (redirect, RT) | ✅ (Code + owner screenshots; live login blocked by captcha) |
| Customer MCP connectors | ✅ (acts as the user) | ✅ | not verified | not verified |

## 3. Role × capability

| Capability | Sales Agent | Business Sales Agent | Business Agent | Admin | Evidence |
|---|---|---|---|---|---|
| Own credit balance | ✅ `user_credits` | allotment from the manager (`alloted_credits`) | own balance, spent when assigning leads | edits anyone's balance | RT `TC-F05-001/002`; `business-rules.md` §3, §7 |
| Credits pill in the web top bar | ✅ | — | n/a | n/a | RT |
| See plan, renewal, **Cancel/Upgrade, Buy extra credits** on mobile Settings | ✅ | **— (hidden)** | n/a | n/a | RT (screens EV-M07, EV-M09); Code `editstatus.js:1808-1815` |
| Upgrade / subscribe on web | ✅ (Upgrade, Cancel Subscription) | **shown**: "Upgrade" in the top bar and "Subscribe Now" on `/subscription`, although a BSA "can't buy credits" (Owner). Recorded as CR-07 | Cancel on `/manager/settings` and `/businessagent/subscription` | levers: deactivate, extend days, Yelp, credit edit | RT; `stack.md` §1 |
| Status tags (company/contact) | **7** incl. Gold | **6** (no Gold) | n/a | Admin edit shows 6 (`KG-UI9`) | RT mobile + web + API (`TC-F20-001/002`) |
| "Companies With Errors" (web) | ✅ | — | n/a | n/a | RT |
| AI Find Leads | ✅ ("AI Find Leads") | ✅ (web label "Find Leads"; mobile tile "AI Find Leads") | ✅ portal version, **assigns** leads to reps | view a rep's AI search log | RT; `ManagerFindLeadsService.php:771` |
| Receive leads from a manager | — | ✅ arrive as a list "manager assigned leads – <date>" | — | — | RT (BSA lists); Code `ManagerFindLeadsService.php:760-780` |
| Companies, contacts, routes, lists, activities | ✅ own | ✅ own | via the rep pages and the portal (read-mostly) | via HQ | RT; Code |
| Mark visited | ✅ mobile, MCP | ✅ mobile | — | — | `parity-map.md` F10 |
| Manage reps (add, edit, credits, routes) | — | — | ✅ `/manager/salespeople*` (a licence per rep) | ✅ `/hq/businessclient/{id}/salesperson` | RT; Code |
| MCP connections / chat / sync (web Settings) | ✅ | ✅ | not verified | — | RT |
| Web "Push Notification" broadcast page | ⚠ **reachable** (RT) | ⚠ same route group, so reachable (Code; not probed) | same group, but a Business Agent is redirected from most Blade landing pages (not probed) | n/a | RT (SA); Code `RouteController.php:1978`, UI-SEC-04 |
| Support tickets | ✅ web, API (no mobile screen) | ✅ | ✅ portal | ✅ answers in HQ | RT; `TC-F26-001/002` |
| Mobile login | ✅ | ✅ (web additionally checks the manager's plan; mobile does not, BT-2) | — | admitted today (BT-1) | RT; Code |

## 4. Known permission gaps (product, not brain)

| ID | Gap | Target | Evidence |
|---|---|---|---|
| KG-BT1 | the API admits Admin | refuse Admin on mobile (BT-1) | RT `TC-F01-008` (Admin receives a token) |
| KG-BT2 | the mobile API does not tie a BSA to its manager's plan | follow the web rule (BT-2) | Code |
| KG-BT4 / S3.8 | writes without an ownership check (visits and more) | scope every write to the owner | Code |
| UI-SEC-01 | public `getUsers` returns today's new users' personal data | require auth / remove | Code |
| UI-SEC-04 | any web user can broadcast a push notification to every device | Admin only, or remove | Code + RT reachability |
| UI-SEC-10 / UI-SEC-11 | any logged-in API user can read another user's visit log and routes by id | scope reads to the owner | RT (EV-A10, EV-A14) |
| CR-07 | BSA sees purchase entry points on web but not on mobile | owner to decide | RT |

## 5. Not verified

- Admin HQ pages at runtime (captcha); Business Agent on the customer MCP; what a Business Agent sees on the
  Blade pages it can still open (only headings were captured). Listed in `UNKNOWN_REGISTER.md`.

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (45)

**Documents (29):** [[brain/memory/entries/correction/20260917-ac83d3-an-app-store-review-account-address-was-removed-|An App Store review account address was removed from the brain (personal data)]] · [[brain/context/api-map|API map: every V2 endpoint, who calls it, and how it behaves]] · [[brain/context/glossary|Approved words (glossary)]] · [[brain/audits/10-brain-final-audit|Audit 10 — Territool AI Brain final audit]] · [[brain/context/brain-qa|Brain QA: questions the brain must answer correctly, and how it did]] · [[brain/context/brain-scorecard|Brain scorecard: 18 categories, rubric, iterations]] · [[brain/context/business-rules|Business rules: plans, credits and money]] · [[brain/context/contradiction-register|Contradiction register: where two sources disagreed, and which won]] · [[brain/memory/entries/conflict/20260917-f96991-cr-07-stack-md-a-business-sales-agent-can-t-buy-|CR-07 — stack.md: a Business Sales Agent "can't buy credits (contact your manager)"; mobile hides every purchase cont…]] · [[brain/memory/entries/conflict/20260917-399e9d-cr-18-my-own-api-map-draft-jwt-refresh-group-at-|CR-18 — my own api-map draft: jwt.refresh group at routes/api.php:100 ↔ the group starts at :103]] · [[brain/memory/entries/qa/20260917-604cea-ev-a02-the-mobile-api-issues-a-token-to-admin-bt|EV-A02 — The mobile API issues a token to Admin (BT-1 confirmed at runtime)]] · [[brain/memory/entries/qa/20260917-5be3d5-ev-a07-credits-the-bsa-row-has-allotedcredits-an|EV-A07 — Credits: the BSA row has alloted_credits and no package; status tags 7 vs 6; getIndutriesType 182 vs 70 items…]] · [[brain/memory/entries/qa/20260917-743e74-ev-a11-ownership-holds-for-companydetail-and-get|EV-A11 — Ownership holds for companydetail and getnotes: the owner reads data, the other user gets none]] · [[brain/memory/entries/qa/20260917-2b5e57-ev-a13-portal-json-api-the-ba-reads-kpis-team-fe|EV-A13 — Portal JSON API: the BA reads kpis/team/feed/sidebar-stats/dashboard-data (200); a SA is redirected; anonymou…]] · [[brain/memory/entries/qa/20260917-6d7a2e-ev-c08-isproduction-in-realm-is-true-only-for-ap|EV-C08 — is_production in Realm is true only for the App Store review account (address hard-coded in repos/mobile/App/components/login/index.js) (App Store review account) and hides plan features]] · [[brain/memory/entries/qa/20260917-e4efa7-ev-m01-a-staging-login-lands-on-the-dashboard-th|EV-M01 — A staging login lands on the Dashboard; the iOS "Save Password?" sheet then covers the app until it is dismis…]] · [[brain/memory/entries/qa/20260917-6d4475-ev-m07-settings-profile-credits-remaining-plan-r|EV-M07 — Settings: profile, Credits Remaining, plan + renewal ("Pro Package · Monthly · Active"), Cancel/Upgrade, Buy…]] · [[brain/memory/entries/qa/20260917-ddf921-ev-m08-bsa-login-works-the-dashboard-shows-its-o|EV-M08 — BSA login works; the Dashboard shows its own credit count and the empty state "No upcoming activities yet."]] · [[brain/memory/entries/qa/20260917-473c2b-ev-m09-bsa-settings-shows-only-the-profile-6-sta|EV-M09 — BSA Settings shows only the profile, "6 status tags" and the version: no credits, plan, Cancel/Upgrade or Buy…]] · [[brain/memory/entries/qa/20260917-65842f-ev-w02-the-access-matrix-reps-are-redirected-fro|EV-W02 — The access matrix: reps are redirected from /manager/* and /hq/*; a Business Agent is redirected from /dashbo…]] · [[brain/memory/entries/qa/20260917-93f24b-ev-w06-subscription-and-businessagent-subscripti|EV-W06 — /subscription and /businessagent/subscription show the user's own history; the SA sees Cancel/Download Invoic…]] · [[brain/context/evidence-ledger|Evidence ledger: what was checked, how, and what it proves]] · [[brain/context/parity-map|Mobile vs web differences]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/system-map|System map: role → platform → screen → action → API → data → result → next]] · [[workspace/tasks/2026-09-16-brain-improvement-loop|Task brief: autonomous brain improvement loop to 90+]] · [[brain/context/stack|Tech setup & environments]] · [[brain/context/UNKNOWN_REGISTER|Unknown register: what the brain does not know yet]] · [[brain/context/web-flows|Web flows: every web page per role, and how the core features run on web]]

**Product feature (1):** [[_id/F10|Mark visited & visit log]]

**Coding rule (1):** [[_id/S3.8|Only the user's own data]]

**Owner decisions (2):** [[_id/BT-1|Block Admin on the mobile app]] · [[_id/BT-2|Sales reps follow their manager's plan]]

**Problem founds (4):** [[_id/KG-BT1|Admin can log in to mobile]] · [[_id/KG-UI9|Admin HQ "Edit salesperson" exposes 6 status slots,…]] · [[_id/KG-BT2|Sales rep not tied to manager's plan]] · [[_id/KG-BT4|Visits saved without owner check]]

**Code files (8):** [[_code/web/app/Api/V2/Controllers/AuthController.php|AuthController]] · [[_code/web/app/UserMcp/Services/CustomerApiClient.php|CustomerApiClient]] · [[_code/mobile/App/components/dashboard/editstatus.js|editstatus.js]] · [[_code/mobile/App/components/login/index.js|login/index.js]] · [[_code/web/app/Http/Controllers/Auth/LoginController.php|LoginController]] · [[_code/web/app/Http/Controllers/Manager/ManagerDashboardController.php|ManagerDashboardController]] · [[_code/web/app/Services/Manager/ManagerFindLeadsService.php|ManagerFindLeadsService]] · [[_code/web/app/User.php|User]]

%% brain-links:end %%
