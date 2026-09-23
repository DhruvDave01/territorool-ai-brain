---
area: context
tags: [brain/context]
ref: "Data model: what Territool stores and where"
---

# Data model: what Territool stores and where

Answers "where is X stored?", "what links to what?" and "which store does this feature use?". The repo has
**no schema for most tables**: there are only 8 framework migrations and the MCP modules' own. The model classes
and the query-builder calls are therefore the best description available, and the generated tables below are
built from them (`node tools/data-model.js`; `--check` proves they are current).

**Status:** everything in §1–§3 is **VERIFIED (code)** unless marked otherwise. Nothing was read from a live
database. The local `territool_beta` database is a 2019 dump with no real data (USER SAID), so it is not
used as evidence.

## 1. Stores

| Store | Used for | Evidence |
|---|---|---|
| **MySQL** (default connection) | everything transactional: users, companies, contacts, routes, lists, activities, credits, subscriptions, MCP logs | `config/database.php`; 62 of 66 models |
| **MongoDB** (`mongodb` connection, Moloquent) | reference geography only: `cities_collection`, `countries_collection`, `locations_collection` (+ a `TestModel`) | `app/Models/MongoDB/*.php`; `config/database.php:115-124` |
| **Realm** (on the phone) | the JWT and session profile, the onboarding tour flags, the saved AI Find Leads search, FCM notifications, and the **unused** offline route cache (offline dropped, S3.9) | §4 (Realm table) |
| Files | route PDFs (`generated` disk), uploaded CSVs (`user_session`) | `V2/CompanyController.php:221`; `Models/UserSession.php` |

## 2. Core entities and how they link

```
users ──< role_users >── roles            (Spatie HasRoles; role names: Admin, Sales Agent, Business Agent, Business Sales Agent)
users ──< users (parent_id)               (a Business Sales Agent's parent_id is its Business Agent)
users ──< companies (user_id)             (every Company belongs to ONE user: companies are not shared between users)
companies ──< contacts (company_id)
companies ──< company_notes (company_id)  (= Activity; note_type = the activity type; "note" = its text)
companies ──< log_meetings                (legacy separate meeting record; BT-7 target: an Activity of type Meeting)
companies ──< company_time                (opening hours per weekday)
users ──< user_routes ──< user_route_companies (route_id)  (= Stops; model App\Models\UserCompanies)
user_routes ──< user_route_clusters       (advanced/cluster routes)
user_route_companies >── companies (company_id)
users ──< user_lists ──< user_list_companies >── companies
user_lists ──< user_list_route >── user_routes             (a List that generated a Route)
user_visited_companies (company_id, route_id, visit_time)   (= the visit log)
users ──< user_credits (total_credit, used_credit)          (the spendable balance)
users ──< businessclient_salesagent_credits                 (credits a Business Agent allotted to a rep)
users ──< user_packages (package_id, status='enable')  >── packages   (= Subscription; model App\Models\Subscription)
users ──< user_package_addons, user_credit_charge            (add-on / top-up purchases)
users ──< activities                                         (= the Activity FEED, not an Activity)
users ──< user_ai_search                                     (saved AI Find Leads searches and their results)
```

| Fact | Evidence |
|---|---|
| Roles are **Spatie permission roles**: `User` uses `HasRoles`; the pivot table is `role_users`; checks are `hasRole('Admin')` etc. | `app/User.php:9, 16`; `config/laravel-permission.php:77, 116`; `Middleware/CheckUserRole.php` |
| A Business Sales Agent is a `users` row whose `parent_id` is its Business Agent (`businessClient()` / reps via `hasMany(parent_id)`) | `app/User.php:24, 62, 66` |
| **"Visited" is stored at two levels.** The mobile endpoint `companymarkedvisited` receives a Stop id, loads the Stop, and sets **`companies.is_visited` / `visited_at`** on its Company (company-wide, the owner-approved rule BT-4). A stop-level **`user_route_companies.is_visited`** also exists: the same endpoint *reads* it to count a cluster's visited stops, and the customer MCP `mark_visited` *writes* it (plus a visit-log row) instead of the company flag. So the two writers update **different fields** (KG-BT4, CR-24) | `V2/RouteController.php:1275-1312`; `UserMcp/Services/Tools/RoutesTools.php:404-413` |
| **Subscriptions are rows in `user_packages`**, not a `subscriptions` table; "active" means `status = 'enable'`. A Business Sales Agent's access follows its parent's subscription on web | `Models/Subscription.php`; `Globals/Helper.php:2844, 3157, 4057` |
| The user's company/contact **status tags** live in `user_status` (the most-used table without a model: 171 query-builder calls) | §4 |
| Contact stages: `user_contact_stage`; company categories: `user_company_categories`; mobile push tokens: `usertoken` | §4 |
| **Three copies** of `Company`, `Contacts` and `UserCompanies` exist (`app/Api/V1/Model`, `app/Api/V2/Model`, `app/Models`). The V2 controllers import `App\Models\*`. The `Api/V2/Model/UserCompanies` copy points at the **legacy `user_companies`** table | `V2/RouteController.php:24, 26`; §4 (Models table) |
| MCP connection secrets (bearer token, OAuth client secret and refresh token) are stored in `user_mcp_connections` | `McpClient/UserMcpConnection.php` |

## 3. What is not known

- **Column types, indexes and foreign keys.** There is no schema file. The columns listed are the models' `$fillable`
  arrays, which are a subset of the real columns.
- The columns of the 13 tables that are used without a model (§4).
- Whether `user_contacts_credits` / `user_contacts_credit_charge` are still written, or are legacy next to `user_credits`. Not traced.
- Production data volumes. Staging figures from Admin HQ are in `business-rules.md` §9.

## 4. Generated from the code

<!-- data-model:start (generated by tools/data-model.js; do not edit inside) -->
**66 model classes** (4 on MongoDB) · **43 tables reached through `DB::table()`**, of which 13 have no model · 9 migration files define 10 tables · 5 Realm schemas on mobile

### Models

| Model | Table | Store | Declared? | Fillable (first 8) | Relations | File |
|---|---|---|---|---|---|---|
| `Activity` | `activities` | mysql (default) | yes | user_id, title, description, module | — | `app/Models/Activity.php:9` |
| `BusinessClient` | `business_clients` | mysql (default) | inferred | name, email, password, place_id, preferences, tour_info, amount_of_licenses, parent_id +6 | — | `app/BusinessClient.php:10` |
| `BusinessclientSalesagentCredit` | `businessclient_salesagent_credits` | mysql (default) | yes | user_id, total_credit, used_credit, date, alloted_credits | — | `app/Models/BusinessclientSalesagentCredit.php:8` |
| `Cities` | `cities` | mysql (default) | yes | — | users → hasMany(User) | `app/Cities.php:8` |
| `Cities` | `cities` | mysql (default) | yes | — | users → hasMany(User) | `app/Models/Cities.php:8` |
| `City` | `cities_collection` | mongodb | yes | title, city_code, longitude, latitude | locations → hasMany(Location); country → belongsTo(Country) | `app/Models/MongoDB/City.php:17` |
| `ClaudeContactLookup` | `claude_contact_lookups` | mysql (default) | yes | lookup_hash, company_name, address, response_json, name_address_match, owners_count, hit_count | — | `app/Models/ClaudeContactLookup.php:7` |
| `CompaniesSession` | `companies_session` | mysql (default) | yes | user_id, hs_object_id, user_session_id, title, address, city_id, addressofsheet, city +16 | — | `app/Models/CompaniesSession.php:10` |
| `Company` | `companies` | mysql (default) | yes | title, address, city_id, postal_code, website, phone_number, linkedin_url | user → belongsTo(User); city → belongsTo(Cities) | `app/Api/V1/Model/Company.php:10` |
| `Company` | `companies` | mysql (default) | yes | title, address, city_id, postal_code, website, phone_number | user → belongsTo(User); city → belongsTo(Cities) | `app/Api/V2/Model/Company.php:10` |
| `Company` | `companies` | mysql (default) | yes | user_id, sf_id, title, address, city_id, postal_code, website, company_email +21 | user → belongsTo(User); city → belongsTo(Cities); contacts → hasMany(Contacts) | `app/Models/Company.php:11` |
| `CompanyTime` | `company_time` | mysql (default) | yes | company_id, day, status, open_time, close_time, created_at, updated_at | company → belongsTo(Company) | `app/Models/CompanyTime.php:9` |
| `Contacts` | `contacts` | mysql (default) | yes | company_id, first_name, last_name, company, user_id, position, city_id, email +4 | company → belongsTo(UserCompanies) | `app/Api/V1/Model/Contacts.php:9` |
| `Contacts` | `contacts` | mysql (default) | yes | company_id, contact_name, company, user_id, position, city_id, email, phone_no +3 | company → belongsTo(UserCompanies) | `app/Api/V2/Model/Contacts.php:9` |
| `Contacts` | `contacts` | mysql (default) | yes | company_id, cognism_id, sfdc_id, contact_name, position, city_id, city, state +18 | company → belongsTo(Company) | `app/Models/Contacts.php:10` |
| `ContactsSession` | `contacts_session` | mysql (default) | yes | user_id, sfdc_id, user_session_id, company_id, contact_name, company, position, city_id +8 | — | `app/Models/ContactsSession.php:8` |
| `Countries` | `countries` | mysql (default) | yes | — | — | `app/Models/Countries.php:8` |
| `Country` | `countries_collection` | mongodb | yes | title, country_code | cities → hasMany(City) | `app/Models/MongoDB/Country.php:17` |
| `DiscountSpecial` | `special_discount` | mysql (default) | yes | email, discount, expirydate, validity, type | — | `app/Models/DiscountSpecial.php:8` |
| `HubspotMapping` | `hubspot_mappings` | mysql (default) | inferred | user_id, company_mapping, contact_mapping | — | `app/Models/HubspotMapping.php:9` |
| `HubspotSyncDetail` | `hubspot_sync_details` | mysql (default) | inferred | user_id, sync_type | — | `app/Models/HubspotSyncDetail.php:9` |
| `Location` | `locations_collection` | mongodb | yes | title, street_number, route, postal_code, latitude, longitude, source_type, data | — | `app/Models/MongoDB/Location.php:17` |
| `LogMeeting` | `log_meetings` | mysql (default) | yes | user_id, company_id, meeting_datetime, meeting_duration, description, created_at, updated_at, hs_object_id +1 | company → belongsTo(Company) | `app/Models/LogMeeting.php:9` |
| `Notes` | `company_notes` | mysql (default) | yes | user_id, company_id, note, note_type, date_time, hs_object_id, hs_associated_company_id, updated_at | company → belongsTo(Company) | `app/Models/Notes.php:10` |
| `NotesSession` | `company_notes_session` | mysql (default) | yes | user_id, company_id, note, date_time, hs_object_id, hs_associated_company_id, updated_at | company → belongsTo(Company) | `app/Models/NotesSession.php:9` |
| `Package` | `packages` | mysql (default) | yes | title, amount, duration, status | — | `app/Models/Package.php:9` |
| `Package` | `packages` | mysql (default) | inferred | title, amount, duration, status | — | `app/Package.php:6` |
| `PackageAddOns` | `packages_addons` | mysql (default) | yes | amount, credit | — | `app/Models/PackageAddOns.php:9` |
| `Roles` | `roles` | mysql (default) | yes | — | users → hasMany(User) | `app/Models/Roles.php:8` |
| `RoleUsers` | `role_users` | mysql (default) | yes | — | — | `app/Models/RoleUsers.php:8` |
| `RoutesSession` | `user_companies_session` | mysql (default) | yes | company_name, company_id, user_id, notes, company_status, distance, excel_file, session_status +2 | — | `app/Models/RoutesSession.php:8` |
| `Sfdc` | `sfdc` | mysql (default) | yes | username, password_sfdc, security_token | — | `app/Sfdc.php:4` |
| `ShareRouteList` | `share_route_list` | mysql (default) | yes | user_id, route_id, list_id, shared_by, new_route_id | — | `app/Models/ShareRouteList.php:8` |
| `Subscription` | `user_packages` | mysql (default) | yes | user_id, package_id, start_date, end_date, amount, payment_info, promo_id | salesperson → belongsTo(User); package → belongsTo(Package) | `app/Models/Subscription.php:9` |
| `SupportTicket` | `support_ticket` | mysql (default) | yes | — | users → hasMany(User) | `app/Models/SupportTicket.php:8` |
| `SyncFailure` | `google_sheet_sync_failures` | mysql (default) | yes | user_id, operation, field_name, field_value, error_message, retry_count, created_at, resolved_at | — | `app/Models/SyncFailure.php:10` |
| `TestModel` | `locations_collections` | mongodb | yes | user_name | — | `app/Models/MongoDB/TestModel.php:8` |
| `User` | `users` | mysql (default) | inferred | name, email, password, amount_of_licenses, monthly_cost, cost_per_user, payment_period, billing_name +5 | skills → belongsToMany(Skill); docs → belongsToMany(User) | `app/Api/User.php:13` |
| `User` | `users` | mysql (default) | inferred | name, email, password, phone, amount_of_licenses, monthly_cost, cost_per_user, payment_period +13 | businessClient → belongsTo(static); businessClientSalesperson → hasMany(static) | `app/User.php:12` |
| `UserAISearch` | `user_ai_search` | mysql (default) | yes | user_id, website, city, ideal_prospects, search_result, sell_description, ai_search_by, status +9 | — | `app/Models/UserAISearch.php:9` |
| `UserCities` | `user_cities` | mysql (default) | yes | — | — | `app/Models/UserCities.php:8` |
| `UserCities` | `user_cities` | mysql (default) | yes | — | — | `app/UserCities.php:8` |
| `UserCompanies` | `user_companies` | mysql (default) | yes | company_id, user_id, notes, company_status, distance, excel_file | user → belongsTo(User); company → belongsTo(Company) | `app/Api/V1/Model/UserCompanies.php:8` |
| `UserCompanies` | `user_companies` | mysql (default) | yes | company_id, user_id, notes, company_status, distance, excel_file | user → belongsTo(User); company → belongsTo(Company) | `app/Api/V2/Model/UserCompanies.php:8` |
| `UserCompanies` | `user_route_companies` | mysql (default) | yes | company_id, user_id, company_status, route_id, cluster_id, company_status_id, is_visited, route_order +3 | user → belongsTo(User); company → belongsTo(Company); userRoute → belongsTo(UserRoute); cluster → belongsTo(UserRouteClusters) | `app/Models/UserCompanies.php:8` |
| `UserContactsCredit` | `user_contacts_credits` | mysql (default) | yes | user_id, total_credit, used_credit, date | — | `app/Models/UserContactsCredit.php:9` |
| `UserContactsCreditCharge` | `user_contacts_credit_charge` | mysql (default) | yes | user_id, payment_info | — | `app/Models/UserContactsCreditCharge.php:9` |
| `UserCredit` | `user_credits` | mysql (default) | yes | user_id, total_credit, used_credit, date, package_credits_applied | — | `app/Models/UserCredit.php:9` |
| `UserCreditCard` | `user_credit_card` | mysql (default) | yes | user_id, cc_no, cc_id | — | `app/Models/UserCreditCard.php:9` |
| `UserCreditCharge` | `user_credit_charge` | mysql (default) | yes | user_id, payment_info | — | `app/Models/UserCreditCharge.php:9` |
| `Userdevices` | `user_devices` | mysql (default) | yes | user_id, device_id, device_type, status | user → belongsTo(User) | `app/Models/Userdevices.php:9` |
| `UserInvitee` | `user_invitee` | mysql (default) | yes | user_id, email_id, phone | — | `app/Models/UserInvitee.php:8` |
| `UserList` | `user_lists` | mysql (default) | yes | user_id, title, is_list_open | listCompanies → hasMany(UserListCompanies) | `app/Models/UserList.php:8` |
| `UserListCompanies` | `user_list_companies` | mysql (default) | yes | company_id, user_id, list_id | user → belongsTo(User); company → belongsTo(Company); userList → belongsTo(UserList) | `app/Models/UserListCompanies.php:8` |
| `UserListRoute` | `user_list_route` | mysql (default) | yes | list_id, route_id | — | `app/Models/UserListRoute.php:8` |
| `UserMcpConnection` | `user_mcp_connections` | mysql (default) | yes | user_id, name, url, bearer_token, oauth_client_id, oauth_client_secret, oauth_refresh_token, oauth_state +4 | — | `app/McpClient/UserMcpConnection.php:7` |
| `UserMcpRequestLog` | `user_mcp_request_logs` | mysql (default) | yes | user_id, session_id, client, method, tool, jsonrpc_id, http_status, request +5 | — | `app/UserMcp/Models/UserMcpRequestLog.php:7` |
| `UserMcpSearchLog` | `user_mcp_search_logs` | mysql (default) | yes | user_id, search_id, territories, sell_description, ai_search_by, status, lead_count, results +1 | — | `app/UserMcp/Models/UserMcpSearchLog.php:7` |
| `UserMcpToolLog` | `user_mcp_tool_logs` | mysql (default) | yes | user_id, session_id, client, tool, arguments, result, result_summary, search_id +5 | — | `app/UserMcp/Models/UserMcpToolLog.php:7` |
| `UserNavigateMe` | `user_navigate_me` | mysql (default) | yes | company_id, user_id | — | `app/Models/UserNavigateMe.php:9` |
| `UserPackageAddOns` | `user_package_addons` | mysql (default) | yes | user_id, amount, payment_info, date | — | `app/Models/UserPackageAddOns.php:9` |
| `UserPromocode` | `user_promocode` | mysql (default) | yes | stripe_id, code, discount, validity, repeating_months, usagelimit, special_discount, type | — | `app/Models/UserPromocode.php:8` |
| `UserRoute` | `user_routes` | mysql (default) | yes | user_id, title, route_type, file_name, status, meta_data, total_distance, total_time +7 | routeCompanies → hasMany(UserCompanies) | `app/Models/UserRoute.php:8` |
| `UserRouteClusters` | `user_route_clusters` | mysql (default) | yes | route_id, title, is_visited, cities | userRoute → belongsTo(UserRoute) | `app/Models/UserRouteClusters.php:8` |
| `UserSession` | `user_session` | mysql (default) | yes | user_id, type, file_name, mapping_data, progress_percentage | — | `app/Models/UserSession.php:10` |
| `UserVisitedCompanies` | `user_visited_companies` | mysql (default) | yes | company_id, route_id, visit_time | — | `app/Models/UserVisitedCompanies.php:8` |

### Tables used without a model (query builder only; columns UNKNOWN unless read in the calling code)

| Table | Uses | Connection | Files (first 3) |
|---|---|---|---|
| `user_status` | 171 | default | `app/Api/V2/Controllers/AuthController.php`, `app/Api/V2/Controllers/CompanyController.php`, `app/Api/V2/Controllers/RouteController.php` +21 |
| `user_contact_stage` | 29 | default | `app/Api/V2/Controllers/AuthController.php`, `app/Api/V2/Controllers/RouteController.php`, `app/Globals/Helper.php` +8 |
| `user_company_categories` | 21 | default | `app/Api/V2/Controllers/AuthController.php`, `app/Api/V2/Controllers/CompanyController.php`, `app/Api/V2/Controllers/RouteController.php` +4 |
| `usertoken` | 17 | default | `app/AdminMcp/Services/SalesAgentsService.php`, `app/Api/V2/Controllers/AuthController.php`, `app/Api/V2/Controllers/RouteController.php` +8 |
| `notification_master` | 12 | default | `app/Api/V2/Controllers/AuthController.php`, `app/Api/V2/Controllers/RouteController.php`, `app/Globals/Helper.php` +3 |
| `leads_user` | 5 | default | `app/Api/V2/Controllers/AuthController.php`, `app/Http/Controllers/Auth/RegisterController.php`, `app/Http/Controllers/CronController.php` +1 |
| `settings` | 4 | default | `app/Api/V2/Controllers/RouteController.php`, `app/Http/Controllers/Admin/SettingController.php` |
| `sessions` | 2 | default | `app/Http/Controllers/Admin/SalespersonController.php`, `app/Http/Controllers/BusinesssalespersonController.php` |
| `oauth_access_tokens` | 2 | default | `app/Http/Controllers/Admin/SalespersonController.php`, `app/Http/Controllers/BusinesssalespersonController.php` |
| `app_oauth_clients` | 1 | default | `app/UserMcp/database/migrations/2026_07_08_120000_consolidate_mcp_oauth_shared_schema.php` |
| `app_oauth_access_tokens` | 1 | default | `app/UserMcp/database/migrations/2026_07_08_120000_consolidate_mcp_oauth_shared_schema.php` |
| `app_oauth_authorization_codes` | 1 | default | `app/UserMcp/database/migrations/2026_07_08_120000_consolidate_mcp_oauth_shared_schema.php` |
| `app_oauth_refresh_tokens` | 1 | default | `app/UserMcp/database/migrations/2026_07_08_120000_consolidate_mcp_oauth_shared_schema.php` |

### Schema definitions in the repo (migrations)

| File | Creates |
|---|---|
| `database/migrations/2014_10_12_000000_create_users_table.php` | `users` |
| `database/migrations/2014_10_12_100000_create_password_resets_table.php` | `password_resets` |
| `database/migrations/2015_08_04_131614_create_settings_table.php` | `settings` |
| `database/migrations/2016_05_25_121918_create_pages_table.php` | `pages` |
| `database/migrations/2018_04_06_083803_create_jobs_table.php` | `jobs` |
| `database/migrations/2018_04_17_130401_create_failed_jobs_table.php` | `failed_jobs` |
| `app/McpClient/database/migrations/2026_08_14_112600_create_user_mcp_connections_table.php` | `user_mcp_connections` |
| `app/UserMcp/database/migrations/2026_08_17_151500_create_user_mcp_audit_tables.php` | `user_mcp_tool_logs`, `user_mcp_search_logs` |
| `app/UserMcp/database/migrations/2026_08_17_153000_create_user_mcp_request_logs_table.php` | `user_mcp_request_logs` |

### Mobile local storage (Realm)

| Schema | Primary key | Properties | File |
|---|---|---|---|
| `FCMNotication` | id | id, notification_title, notification_desc | `App/storage/fcmrealm.js:24` |
| `JWTToken` | id | id, value, name, notifi_count, user_id, email, country, domain, env, role, is_register, is_production | `App/storage/realm.js:34` |
| `offlineRoute` | id | id, value, data | `App/storage/realm.js:58` |
| `TourSchema` | id | id, create_route, edit_route, company_detail, fetch_contact, notes | `App/storage/realm.js:73` |
| `AIFindLeads` | id | id, website, city, territoryMode, sellDetails, aiResponse, aiLeads | `App/storage/realm.js:91` |
<!-- data-model:end -->

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (90)

**Documents (19):** [[brain/context/architecture|Architecture: how Territool is built, end to end]] · [[brain/audits/10-brain-final-audit|Audit 10 — Territool AI Brain final audit]] · [[brain/context/brain-qa|Brain QA: questions the brain must answer correctly, and how it did]] · [[brain/context/brain-scorecard|Brain scorecard: 18 categories, rubric, iterations]] · [[brain/context/business-rules|Business rules: plans, credits and money]] · [[workspace/handoff/2026-09-17-company-details/result|Company details mobile UI]] · [[brain/context/contradiction-register|Contradiction register: where two sources disagreed, and which won]] · [[brain/memory/entries/conflict/20260917-3e9552-cr-15-02-web-roles-via-backpack-permissionmanage|CR-15 — 02-web: roles via "Backpack PermissionManager hasRole()" ↔ code: User uses Spatie HasRoles]] · [[brain/memory/entries/conflict/20260917-c4d213-cr-24-data-model-system-map-glossary-visited-is-|CR-24 — data-model / system-map / glossary: visited is on the Company ↔ architecture §6 and 03-parity: the MCP sets t…]] · [[brain/memory/entries/qa/20260917-50e098-ev-c04-visited-is-written-on-the-company-reached|EV-C04 — "Visited" is written on the Company, reached through the Stop id]] · [[brain/memory/entries/qa/20260917-1814bb-ev-c05-roles-are-spatie-roles-hasroles-the-pivot|EV-C05 — Roles are Spatie roles (HasRoles); the pivot table is configured in config/laravel-permission.php:116]] · [[brain/memory/entries/qa/20260917-8a566a-ev-c12-66-model-classes-43-query-builder-tables-|EV-C12 — 66 model classes, 43 query-builder tables (13 without a model), 5 Realm schemas]] · [[brain/context/evidence-ledger|Evidence ledger: what was checked, how, and what it proves]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/memory/SOURCE-OF-TRUTH|Source of truth — which source wins, per question]] · [[brain/context/system-map|System map: role → platform → screen → action → API → data → result → next]] · [[workspace/tasks/2026-09-16-brain-improvement-loop|Task brief: autonomous brain improvement loop to 90+]] · [[brain/memory/entries/question/20260917-3d03bc-u-dat-01-real-column-types-indexes-and-foreign-k|U-DAT-01 — Real column types, indexes and foreign keys]] · [[brain/context/UNKNOWN_REGISTER|Unknown register: what the brain does not know yet]]

**Coding rule (1):** [[_id/S3.9|Offline mode dropped]]

**Owner decisions (2):** [[_id/BT-4|“Visited” is per company]] · [[_id/BT-7|Log Meeting = a Meeting activity]]

**Problem found (1):** [[_id/KG-BT4|Visits saved without owner check]]

**Code files (67):** [[_code/web/app/Models/Activity.php|Activity]] · [[_code/web/app/Api/V2/Controllers/AuthController.php|AuthController]] · [[_code/web/app/Models/BusinessclientSalesagentCredit.php|BusinessclientSalesagentCredit]] · [[_code/web/app/Http/Controllers/BusinesssalespersonController.php|BusinesssalespersonController]] · [[_code/web/app/Models/Cities.php|Cities]] · [[_code/web/app/Models/MongoDB/City.php|City]] · [[_code/web/app/Models/ClaudeContactLookup.php|ClaudeContactLookup]] · [[_code/web/app/Models/CompaniesSession.php|CompaniesSession]] · [[_code/web/app/Api/V2/Model/Company.php|Company]] · [[_code/web/app/Models/Company.php|Company]] · [[_code/web/app/Api/V2/Controllers/CompanyController.php|CompanyController]] · [[_code/web/app/Models/CompanyTime.php|CompanyTime]] · [[_code/web/app/Api/V2/Model/Contacts.php|Contacts]] · [[_code/web/app/Models/Contacts.php|Contacts]] · [[_code/web/app/Models/ContactsSession.php|ContactsSession]] · [[_code/web/app/Models/Countries.php|Countries]] · [[_code/web/app/Models/MongoDB/Country.php|Country]] · [[_code/web/app/Http/Controllers/CronController.php|CronController]] · [[_code/web/app/Models/DiscountSpecial.php|DiscountSpecial]] · [[_code/mobile/App/storage/fcmrealm.js|fcmrealm.js]] · [[_code/web/app/Globals/Helper.php|Helper]] · [[_code/web/app/Models/HubspotMapping.php|HubspotMapping]] · [[_code/web/app/Models/HubspotSyncDetail.php|HubspotSyncDetail]] · [[_code/web/app/Models/MongoDB/Location.php|Location]] · [[_code/web/app/Models/LogMeeting.php|LogMeeting]] · [[_code/web/app/Models/Notes.php|Notes]] · [[_code/web/app/Models/NotesSession.php|NotesSession]] · [[_code/web/app/Package.php|Package]] · [[_code/web/app/Models/PackageAddOns.php|PackageAddOns]] · [[_code/mobile/App/storage/realm.js|realm.js]] · [[_code/web/app/Http/Controllers/Auth/RegisterController.php|RegisterController]] · [[_code/web/app/Models/Roles.php|Roles]] · [[_code/web/app/Models/RoleUsers.php|RoleUsers]] · [[_code/web/app/Api/V2/Controllers/RouteController.php|RouteController]] · [[_code/web/app/Models/RoutesSession.php|RoutesSession]] · [[_code/web/app/UserMcp/Services/Tools/RoutesTools.php|RoutesTools]] · [[_code/web/app/AdminMcp/Services/SalesAgentsService.php|SalesAgentsService]] · [[_code/web/app/Http/Controllers/SalespersonController.php|SalespersonController]] · [[_code/web/app/Http/Controllers/Admin/SettingController.php|SettingController]] · [[_code/web/app/Sfdc.php|Sfdc]] · [[_code/web/app/Models/ShareRouteList.php|ShareRouteList]] · [[_code/web/app/Models/Subscription.php|Subscription]] · [[_code/web/app/Models/SupportTicket.php|SupportTicket]] · [[_code/web/app/Models/SyncFailure.php|SyncFailure]] · [[_code/web/app/User.php|User]] · [[_code/web/app/Models/UserAISearch.php|UserAISearch]] · [[_code/web/app/UserCities.php|UserCities]] · [[_code/web/app/Api/V2/Model/UserCompanies.php|UserCompanies]] · [[_code/web/app/Models/UserCompanies.php|UserCompanies]] · [[_code/web/app/Models/UserContactsCredit.php|UserContactsCredit]] · [[_code/web/app/Models/UserContactsCreditCharge.php|UserContactsCreditCharge]] · [[_code/web/app/Models/UserCredit.php|UserCredit]] · [[_code/web/app/Models/UserCreditCard.php|UserCreditCard]] · [[_code/web/app/Models/UserCreditCharge.php|UserCreditCharge]] · [[_code/web/app/Models/UserInvitee.php|UserInvitee]] · [[_code/web/app/Models/UserList.php|UserList]] · [[_code/web/app/Models/UserListCompanies.php|UserListCompanies]] · [[_code/web/app/Models/UserListRoute.php|UserListRoute]] · [[_code/web/app/McpClient/UserMcpConnection.php|UserMcpConnection]] · [[_code/web/app/UserMcp/Models/UserMcpSearchLog.php|UserMcpSearchLog]] · [[_code/web/app/Models/UserNavigateMe.php|UserNavigateMe]] · [[_code/web/app/Models/UserPackageAddOns.php|UserPackageAddOns]] · [[_code/web/app/Models/UserPromocode.php|UserPromocode]] · [[_code/web/app/Models/UserRoute.php|UserRoute]] · [[_code/web/app/Models/UserRouteClusters.php|UserRouteClusters]] · [[_code/web/app/Models/UserSession.php|UserSession]] · [[_code/web/app/Models/UserVisitedCompanies.php|UserVisitedCompanies]]

%% brain-links:end %%
