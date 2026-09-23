---
id: web-how-it-works
parent: screens
sources:
  - webterritool/routes/web.php
  - Auth/LoginController.php
  - Auth/RegisterController.php
  - Auth/B2bSignupController.php
  - Http/Middleware/CheckUserRole.php
  - Http/Middleware/EnsureManagerRole.php
  - Http/Controllers/HomeController.php
  - Http/Controllers/Manager/ManagerDashboardController.php
  - Http/Controllers/SimpleRouteController.php
related:
  - screens/how-it-works.md
  - design-web/Navigation.md
  - design-web/Page-Inventory.md
  - 13-web-urls.md
  - features/12-manager-portal.md
  - screens/manager-mcp-how-it-works.md
  - features/13-admin-hq.md
  - 06-users-and-roles.md
  - 18-cross-system-flows.md
---
# Web how it works (User / Manager / Admin)

Lifecycle agents still guess from URL prefixes. Source: live `webterritool/routes/web.php` + controllers (2026-09-18). Pixels: [design-web/MINI-DESIGN-BRAIN.md](../design-web/MINI-DESIGN-BRAIN.md). Mobile counterpart: [how-it-works.md](how-it-works.md).

**Three web products.** Do not mix stacks or landings.

| Who | `role_id` | Shell | After login |
|-----|-----------|--------|-------------|
| Sales Agent | 1 | Classic Blade `front.layout` | `/dashboard` (RevenueCat if zero subscription rows) |
| Business Sales Agent | 4 | Same classic app | `/dashboard` (no self-register; invite activate) |
| Business Agent | 3 | Manager React islands `/manager/*` | `/manager/dashboard` |
| Admin | 2 | Backpack `/hq/*` | `/hq/dashboard` (`CheckUserRole`) |

Do not invent HQ chrome. Register **web** is 3 steps — do not unify with mobile 6-step `PostSignupPaywallFlow`.

---

## Role gates (all three flows)

| Gate | File | Behavior |
|------|------|----------|
| `auth` | `routes/web.php` | Must be logged in |
| `role` → `CheckUserRole` | `app/Http/Middleware/CheckUserRole.php` | Unauthed → login. **Admin** on field paths → `hq/dashboard`. SA/BA/BSA on `hq/*` → `dashboard` |
| `manager.only` → `EnsureManagerRole` | `EnsureManagerRole.php` | Business Agent only. BSA with `parent_id > 0` → `/dashboard` + flash. Others → `/dashboard` |
| `subscriber` → `RedirectIfSubscribed` | controller-level (company/contact/route/list) | Session `subscription` must be `'active'`, else `/dashboard`. **Not** on support / settings / subscription pages |
| Session `subscription=active` | `AfterLoginEvent.php` | Own enable subscription **or** role Business Sales Agent |

`LoginController::redirectTo()`: Business Agent → `/manager/dashboard`; else `/dashboard`.

`HomeController@dashboard`: Business Agent (no `?connect`) → `/manager/dashboard`. Sales Agent with **zero** `subscriptions` rows → RevenueCat pay URL (prod vs sandbox in that method — do not copy the path into notes). BSA is **not** in that RevenueCat branch.

---

## 1. User flow (Sales Agent + BSA) — classic app

Chrome: [Navigation.md](../design-web/Navigation.md) branch 2 (BSA) / 3 (SA). Pages: [Page-Inventory.md](../design-web/Page-Inventory.md).

### 1.1 Landings

| Entry | Then |
|-------|------|
| `GET /login` → POST | Inactive rejected. BSA also fails if **parent BA** is not Active with enable subscription (`LoginController`). Then BA→manager, else `/dashboard`. `AfterLoginEvent` may also `redirect('dashboard')` and set session subscription |
| `GET /register` (3-step Blade) POST | `RegisterController@create` **`assignRole('Sales Agent')`**. `redirectPath()`: onboarding incomplete → `/onboarding`; else → `/findleads` |
| `GET /trial` | Form posts `/register` |
| `GET /b2b` POST | Login + **`/findleads`** (skips onboarding redirect) — `B2bSignupController` |
| `GET /onboarding` | If already completed → `/dashboard`. POST `/onboarding/preferences` then client goes `/findleads` |
| `GET /businesssalesperson/activate/{userid}` | Inactive BSA set-password. POST → Active → login. **Not** self-register |
| `GET /accActivate/{userid}` | Account activate |
| Forgot | Laravel `/password/reset` (classic header, not split-panel login) |

Web register ≠ mobile 6-step questionnaire. Do not send a new SA to `/manager/*`.

### 1.2 Happy path (SA): find leads → save → route

| Step | URL | What happens |
|------|-----|----------------|
| 1 | `/findleads` | `CompanylController@findleads`. SA with zero subscription rows → RevenueCat (same as dashboard). `subscriber` required |
| 2 | Hunt | Classic Find Leads = **user V2 city/ZIP** (`getAILeads` / `ai-lead-finder/*`), not manager Places circles. Status GET `ai-lead-finder/status/{searchId}` |
| 3 | POST `saveAILeads` | `Helper::saveAILead` — **1 credit each**. Optional attach to route/list. Never `add_company` for AI hits |
| 4a | `/route/step1` | Pick ≥2 companies → POST creates draft `UserRoute` → `/route/step2/{id}` |
| 4b | `/route/step2/{id}` | Dispatch generate → `/simpleroute/step3/{id}` |
| 4c | `/route/select_type/{id}` | basic/cluster → simpleroute; advanced → `/advancedroute/step3/{id}` |
| 5 | `/simpleroute/step3/{id}` | `published` → `/route/view/{id}`. `draft` → old step1. Else **wait** view (`SimpleRouteController@editstep3`). Same rule as mobile: not done until **published** |
| 6 | `/route/view/{id}` | Drive / map `/route/viewmap/{id}` |
| 7 | `/company/{id}/view` | Notes, contacts, mark visited, log meeting |

List-first: `/list/step1` → `/lists` → `/list/{id}/generateroute` → `/route/step2/{id}`.

Places (non-AI) find: `/routes/findleads`, `/routes/lasso`, `/findleads/route/step1` enter the wizard. Do not mix with `/manager/ai-find-leads`.

### 1.3 Other SA/BSA pages (exist; not one linear path)

| Family | URLs | Notes |
|--------|------|--------|
| Address Book | `/company`, `/company/{id}/edit\|view\|notes`, `/recent-company`, maps | jqxGrid. `CompanylController` extra **l** |
| Contacts | `/contact`, `/recent-contact`, `/company/contacts/{id}` | Buy contacts **2** paid / **1** Claude — same credit math |
| Lists | `/lists` (index) vs `/list/*` (CRUD) | Plural vs singular |
| Routes | `/routes` list; `/route/*` wizard; `/simpleroute/*`; `/advancedroute/*`; `/sessionroute/step1`–`step5` | **Four prefixes.** Do not collapse |
| CSV | `/uploadcompany/step1`–`step4` (+ preview, SFDC, errors); `/uploadcontact/step1`–`step4`; `/uploaderror/*` | FormData + `contentType: false` |
| Settings | `/salesperson/edit` (no id) | Profile |
| Billing | `/subscription*`, cancel under **`/subscriptions/`** (plural), `/extendTrial`, `/success-revenuecat` | Support/settings are **not** `subscriber`-gated |
| Support | `/support`, `/support/create`, `/support/view/{id}` | Classic tickets |
| CRM | `/sfdc*`, HubSpot, KarmaCRM | Outside settings |

BSA vs SA: same classic shell. BSA session subscription can be active **without** own sub. Credits often manager allotment. Find Leads sidebar label is “Find Leads” (BSA) vs “AI Find Leads” (SA).

---

## 2. Manager flow (Business Agent only)

Gate: `prefix manager` + `auth` + `manager.only` (`routes/web.php` ~189–231). Islands: `resources/manager-portal/main.jsx`. Duplicate `GET /manager/ai-find-leads` is **live** — do not delete unless asked.

Classic `/businesssalesperson*` still exists; BA without `?embed` is redirected into `/manager/salespeople*`.

### 2.1 Cockpit happy path

| Step | URL | Island | User does |
|------|-----|--------|-----------|
| 1 | `/manager/dashboard` | `ManagerDashboard.jsx` | Week KPIs / team. JSON: `/manager/api/{dashboard-data,kpis,team,feed,growth,insights,territory,sidebar-stats,rep/{id}}` |
| 2 | `/manager/ai-find-leads` | `AIFindLeadsPage.jsx` | **Places circle** hunt (not user V2 city/ZIP). POST `/manager/api/find-leads/init\|step` and `/manager/api/find-leads` |
| 3 | Same page | assign | POST `/manager/api/create-leads` or `create-leads-batch`. Clear: `clear-saved-search`, `clear-assigned-leads` |
| 4 | `/manager/salespeople` | `Salespeople.jsx` | Roster. Create `/salespeople/create`, edit `/{id}/edit`, detail `/{id}/details`, routes `/{id}/routes`, remove / resend-invitation |
| 5 | `/manager/activity` | `ManagerActivity.jsx` | Team feed (limit 100 in controller) |
| 6 | Optional | | Support `/manager/support*` (create/reply still POST classic `/support/create` and `/support/update`). Settings `/manager/settings` save → legacy `/salesperson/edit/{id}` |

`/manager/reports` = Blade **“Coming soon”** — no island.

Coverage map JSON is `/manager/api/territory` and `/manager/api/rep/{id}/territory`. That is **not** the MCP tools `get_team_territories` / `recommend_lead_distribution` (those exist only on User MCP).

Public `/manager-plugin*` is a separate plugin landing, not the cockpit.

### 2.2 Manager MCP (assign → route → contacts)

**Full step table:** [screens/manager-mcp-how-it-works.md](../screens/manager-mcp-how-it-works.md).

Business Agent on `{APP_URL}/ai/mcp` also gets: `list_team`, `get_team_territories`, `recommend_lead_distribution`, `get_team_dashboard`, `get_team_activity`. Pass `salesperson_id` from `list_team` for a named rep. Find MCP is **not** for BA.

Manager MCP `find_ai_leads` uses **`hunt_engine: manager_portal`** (same Places **circle** as `/manager/ai-find-leads`, `radius_miles` 1–10, default 1.0). It is **not** user V2 `getAILeadsV2`. Do not mix engines or `search_id`s.

`save_ai_leads`: first call never saves; **do not confirm in the same turn**; then `confirm_all` + `confirm_token` + same `salesperson_id`. `create_route` publishes and returns `route_url`. Then ask contact scope; `buy_contacts` paid payloads one-at-a-time if local 500s.

---

## 3. Admin flow (HQ)

Prefix `/hq`, middleware `web`+`role`, namespace `Admin`. Backpack `route_prefix` = `hq`. Custom CRUD is in `web.php` (no app `routes/backpack/custom.php`). Field roles hitting `/hq/*` → `/dashboard`. Admin hitting the field app → `/hq/dashboard`.

**HQ UI can write.** Admin MCP `/ai/mcp-admin` is **`read_only`** on TerriTool DB — cannot create users, credits, or subscriptions. Do not use User MCP as Admin.

### 3.1 Typical HQ path

| Step | URL | Write? |
|------|-----|--------|
| 1 | `/hq` or `/hq/dashboard` | Read counts |
| 2a | `/hq/salesperson` (+ datatable, create/edit/delete, convert, credit GET/POST, aisearch, calculateroute) | **Yes** — users and credits |
| 2b | `/hq/businessclient` (+ nested salesperson, credits, resendinvitation) | **Yes** |
| 3 | `/hq/subscription/index/{id}` + active/deactive/lifetime/business, `extend-days` POST, yelp flags | **Yes** |
| 4 | `/hq/promocode`, `/hq/specialdiscount` | **Yes** CRUD |
| 5 | `/hq/support` | **Yes** tickets |
| 6 | `/hq/settings`, `/hq/user-activity/{id}`, `user/{user}/edit`, `CRUD::resource('userdevices')` | Settings / devices |

Also: `/hq/subscription/dashboard`, cancelled-users, cancelled-revenuecat-trials. Backpack packages (Permission / Page / Log / Backup) may mount under the same `hq` prefix via vendor — do not restyle; pixels **deferred**.

Admin MCP tools (read only): `list_sales_agents`, `list_cancelled_subscribers`, `list_active_subscribers`, `list_active_trials`, `list_expired_trials`, `list_cancelled_trial_subscribers`, `list_user_credits`, `get_user_subscription_history`. Paid package ids in comments `[2,5,6]`, trial `[1,4]`.

---

## Do not

- Unify web Register (3 steps) with mobile Register (6 steps).
- Send BSA or SA to `/manager/*` (middleware bounces them).
- Treat `/manager/api/territory` as `get_team_territories`.
- Treat Admin MCP as a write API for credits/subs.
- Collapse `/route`, `/routes`, `/simpleroute`, `/advancedroute`, `/sessionroute` into one wizard.
- Invent HQ or Register steps 2–3 pixels ([Deferred-Scope.md](../design-web/Deferred-Scope.md)).
