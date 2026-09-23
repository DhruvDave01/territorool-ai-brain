---
area: context
tags: [brain/context]
ref: "API map: every V2 endpoint, who calls it, and how it behaves"
---

# API map: every V2 endpoint, who calls it, and how it behaves

The mobile app and the customer MCP connectors depend on these endpoints, so a web-side change can
break either one. This note answers "what API powers this?" and "who breaks if I change it?".

- **Source of the table:** the live code, regenerated with `node tools/api-map.js`. Run
  `node tools/api-map.js --check` to prove the table is current. The same data is in
  `brain/audits/data/api-map.json`.
- **V1 is dead** (S0.6). Its routes are commented out in `routes/api.php` and are not listed.
- **Status labels:** each claim below is marked **VERIFIED (runtime)**, **VERIFIED (code)**,
  **INFERRED** or **UNKNOWN**.

## 1. How the API works

| Aspect | Behaviour | Status | Evidence |
|---|---|---|---|
| Base URL | `https://staging.territool.com/index.php/api/` (pretty URLs without `index.php` are not used by the app) | VERIFIED (code + runtime) | `repos/mobile/App/config/index.js:8`; the F01 contract suite ran against it (`workspace/test-suites/api-contract/last-run.json`) |
| Versioning | Dingo API; only `v2` is routed. The client sends no version header; Dingo's default version is used | VERIFIED (code) | `routes/api.php:75`; `config/api.php` |
| Auth | Bearer JWT in `Authorization`. `login` returns the token. Routes inside the `jwt.refresh` group need it | VERIFIED (code + runtime) | `routes/api.php:103` (group start); `Http/Kernel.php:56` |
| Token lifetime | `ttl` 10080 min (7 days); `refresh_ttl` 40320 min (28 days) | VERIFIED (code) | `config/jwt.php:36, 50` |
| Expired token | `authJWT` refreshes an expired token **server-side for that request only** and never returns the new one. The client keeps sending the old token until the refresh window (28 days) closes, then gets a 401 and logs out. This is intended (USER SAID) | VERIFIED (code) | `app/Http/Middleware/authJWT.php:29-55`; `stack.md` §4 |
| Invalid token | 401 `UnauthorizedHttpException` in Dingo's error shape | VERIFIED (code) | `authJWT.php:38` |
| Request body | `POST` with form fields (the mobile app sends `multipart/form-data`); `GET` reads use query strings | VERIFIED (code) | `repos/mobile/App/utils/API.js:229-342` |
| Success envelope | HTTP 200 `{status: 1, message, data}`. Some endpoints return the string `"1"` (`login` does) | VERIFIED (code + runtime for `login`) | `stack.md` §6; F01 QA report |
| Handled failure | HTTP 200 `{status: 0 or "0", message, data: []}`. New code uses int `0` (DW1) | VERIFIED (code) | `stack.md` §6 |
| Exceptions | Dingo `{message, errors, code, status_code, debug}`; 401 for JWT, 422 for validation exceptions | VERIFIED (code) | `config/api.php:140-145` |
| Client error handling | Mobile reads `status_code` from the **body**: 401/403 → logout; 400/404/500 → toast and throw | VERIFIED (code) | `API.js:229-342` |
| Pagination | **No shared convention.** Each list endpoint reads its own parameters (for example `companylist` takes `listof` = `recently_added` or the Address Book, plus page/search fields read inside the action) | VERIFIED (code) for `companylist`; the rest UNKNOWN until each is read | `V2/RouteController.php:1519` |
| Rate limiting | Dingo `throttling` config is empty; whether the Laravel `api` group `throttle:60,1` applies to Dingo routes is not verified | UNKNOWN | `02-web.md` §4; `Http/Kernel.php:35-38` |
| Role gate | **Only at login**: `login` admits Sales Agent, Business Sales Agent **and Admin**, and refuses a Business Agent. **After login there is no role check**; any valid JWT reaches every endpoint (BT-1 target: refuse Admin) | VERIFIED (code + runtime: TC-F01-007/008) | `V2/AuthController.php:140`; KG-BT1 |
| Ownership | Many writes do not check that the record belongs to the caller (S3.8) | VERIFIED (code) for the visit writes; not checked endpoint by endpoint | KG-BT4 |

## 2. Public endpoints (no token): read these first

These run without authentication. Each one was read in code on 2026-09-16. Only the harmless reads `getrestrictuser`, `getcategories` and `getusercontactstage` were called (no token; see §6). Nothing that writes or returns user data was called.

| Endpoint | What it does | Risk | Evidence |
|---|---|---|---|
| `GET getUsers` | Returns **id, name, email, phone, created_at** of every Active user **created today** | **High: personal data without authentication.** Recorded as `UI-SEC-01` in `UPCOMING_IMPROVEMENTS.md` | `V2/AuthController.php:251-257` |
| `GET zapierCompanyCreate`, `GET zapierContactCreate` | Create a company / contact from query parameters (Zapier integration) | **the target user is simply `user_id` from the request; there is no key or token**, so anyone can add records to any account (UI-SEC-08) | `routes/api.php:87-88` → `SfdcController.php:811-814` |
| `POST leads_user` | Inserts `{name, phone}` into `leads_user` if the phone is new | unauthenticated write; spam risk | `V2/AuthController.php:235-250` |
| `GET getrestrictuser` | Returns the `is_registration` setting | low | `V2/RouteController.php:4126-4138` |
| `GET getcategories`, `GET getusercontactstage` | Category and contact-stage lists | low: **without a token they return HTTP 500 "token could not be parsed" and no data** (runtime, TC-F20-003/004); with a token they return only the caller's rows (UI-API-03) | `routes/api.php:89-90` |
| `POST downloadpdf` | Calls `currentUser()` outside the JWT group, so it cannot identify a user | INFERRED: fails without a token | `V2/CompanyController.php:209-221` |
| `authenticate`, `login`, `signup`, `mobileregistration`, `renewtoken`, `recovery`, `reset`, `validate-phone`, `citysearch` | Auth and registration | expected to be public | `routes/api.php:77-86` |
| `apollo-webhook`, `fullenrich-webhook/*`, `revenue-subscription-update`, `revenuecate-success` | Provider callbacks (Apollo, FullEnrich, RevenueCat) | **no signature, secret or token is checked** (no constructor or middleware either). `apollo-webhook` updates contacts for the `user_id`/`company_id` in the query string; `revenue-subscription-update` creates or renews a `Subscription` for the user id parsed from `app_user_id`; `revenuecate-success` grants the free package to the user id it is given (UI-SEC-07) | `routes/api.php:94-101` (`apollo-webhook`, `revenue-subscription-update`, `fullenrich-webhook`, `revenuecate-success`) |

## 3. Consumers

| Consumer | How it calls | Evidence |
|---|---|---|
| **Mobile app** | `URL_*` constants in `App/config/index.js` (101 of them) → `App/utils/API.js` `post`/`get` | VERIFIED (code) |
| **UserMcp** (`/ai/mcp`, "TerriTool App") | `CustomerApiClient::call()` mints a short-lived JWT for the customer and dispatches **internally** through Dingo, so the same `jwt.refresh` middleware applies | VERIFIED (code) `UserMcp/Services/CustomerApiClient.php:9-60` |
| **FindMcp** (`/find-mcp/mcp`) | the same client pattern, for find leads and find/buy contacts | VERIFIED (code) `FindMcp/Services/Tools/ContactsTools.php:147, 166, 213` |
| **UserMcp direct writes** | `mark_visited` writes the database directly instead of calling V2 (KG-BT4) | VERIFIED (code) `UserMcp/Services/Tools/RoutesTools.php:412` |
| **Manager portal** | does **not** use V2. It calls the web session routes `/manager/api/*` | VERIFIED (code) `routes/web.php` manager group; `conventions-web.md` §1 |
| **Web user app (Blade)** | does not use V2. It uses session routes in `routes/web.php` | VERIFIED (code) |

## 4. Every V2 endpoint

"Kind" is inferred from the name, to help triage; open the action before relying on it. "Mobile files"
counts the files under `App/` that reference the endpoint (via its `URL_*` constant or a literal).

<!-- api-map:start (generated by tools/api-map.js; do not edit inside) -->
**145 v2 routes** · 25 public · 120 behind `jwt.refresh` · mobile uses 96 · customer MCP uses 20 · with no consumer found in mobile or MCP: 47

| # | Method | URI | Auth | Kind *(inferred)* | Action | Features | Mobile files | MCP |
|---|---|---|---|---|---|---|---|---|
| 1 | POST | `authenticate` | **public** | write | `app/Api/V2/Controllers/AuthController.php:40` | — | — | — |
| 2 | POST | `logout` | **public** | write | `app/Api/V2/Controllers/AuthController.php:201` | F01 | 2 (`URL_USER_LOGIN_LOGOUT`) | — |
| 3 | POST | `login` | **public** | write | `app/Api/V2/Controllers/AuthController.php:59` | F01 | 3 (`URL_USER_LOGIN`) | — |
| 4 | POST | `signup` | **public** | write | `app/Api/V2/Controllers/AuthController.php:603` | — | — | — |
| 5 | POST | `mobileregistration` | **public** | write | `app/Api/V2/Controllers/AuthController.php:259` | F02 | 1 (`URL_USER_REGISTER`) | — |
| 6 | POST | `renewtoken` | **public** | write | `app/Api/V2/Controllers/AuthController.php:688` | — | — | — |
| 7 | POST | `recovery` | **public** | external side effect | `app/Api/V2/Controllers/AuthController.php:633` | — | — | — |
| 8 | POST | `reset` | **public** | external side effect | `app/Api/V2/Controllers/AuthController.php:655` | — | 1 | — |
| 9 | POST | `citysearch` | **public** | read | `app/Api/V2/Controllers/CityController.php:35` | — | 20 (`URL_SEARCH_CITY`) | — |
| 10 | GET | `citysearch` | **public** | read | `app/Api/V2/Controllers/CityController.php:35` | — | 20 (`URL_SEARCH_CITY`) | — |
| 11 | POST | `downloadpdf` | **public** | write | `app/Api/V2/Controllers/CompanyController.php:209` | — | — | — |
| 12 | GET | `zapierCompanyCreate` | **public** | external side effect | `app/Http/Controllers/SfdcController.php:811` | — | — | — |
| 13 | GET | `zapierContactCreate` | **public** | external side effect | `app/Http/Controllers/SfdcController.php:994` | — | — | — |
| 14 | GET | `getcategories` | **public** | read | `app/Api/V2/Controllers/RouteController.php:4096` | — | 2 (`URL_GET_USER_CATEGORY_DETAILS`) | — |
| 15 | GET | `getusercontactstage` | **public** | read | `app/Api/V2/Controllers/RouteController.php:4111` | — | 2 (`URL_GET_USER_LIFE_STAGE_DETAILS`) | — |
| 16 | GET | `getrestrictuser` | **public** | read | `app/Api/V2/Controllers/RouteController.php:4126` | — | 2 (`USER_RESTRICT`) | — |
| 17 | POST | `apollo-webhook` | **public** | webhook | `app/Api/V2/Controllers/WebhookController.php:26` | F15 | — | — |
| 18 | POST | `leads_user` | **public** | write | `app/Api/V2/Controllers/AuthController.php:235` | F02 | 1 (`URL_USER_REGISTER_STORE`) | — |
| 19 | GET | `getUsers` | **public** | read | `app/Api/V2/Controllers/AuthController.php:251` | — | — | — |
| 20 | POST | `revenue-subscription-update` | **public** | webhook | `app/Api/V2/Controllers/WebhookController.php:79` | F03 | — | — |
| 21 | POST | `validate-phone` | **public** | write | `app/Api/V2/Controllers/AuthController.php:721` | — | — | — |
| 22 | POST | `fullenrich-webhook/{company_id}` | **public** | webhook | `app/Api/V2/Controllers/WebhookController.php:385` | F15 | — | — |
| 23 | POST | `fullenrich-webhook/bulk/{jobId}` | **public** | webhook | `app/Api/V2/Controllers/WebhookController.php:397` | F15 | — | — |
| 24 | POST | `fullenrich-webhook/bulk/{jobId}/contact` | **public** | webhook | `app/Api/V2/Controllers/WebhookController.php:475` | F15 | — | — |
| 25 | POST | `revenuecate-success` | **public** | webhook | `app/Api/V2/Controllers/AuthController.php:502` | F03 | 2 (`URL_REVENUECAT_SUCCESS`) | — |
| 26 | POST | `notifications` | JWT | external side effect | `app/Api/V2/Controllers/RouteController.php:3435` | — | 1 | — |
| 27 | GET | `notificationlist` | JWT | read | `app/Api/V2/Controllers/RouteController.php:3560` | F27 | 1 (`URL_USER_ALERT_LIST`) | — |
| 28 | POST | `notificationmarkread` | JWT | write | `app/Api/V2/Controllers/RouteController.php:3600` | — | 0 (`URL_ALERT_MARKED_READ` defined, unused) | — |
| 29 | POST | `notificationremove` | JWT | delete | `app/Api/V2/Controllers/RouteController.php:3625` | — | — | — |
| 30 | GET | `newreleasenotify` | JWT | external side effect | `app/Api/V2/Controllers/RouteController.php:3640` | — | — | — |
| 31 | POST | `getversiondetails` | JWT | read | `app/Api/V2/Controllers/RouteController.php:3824` | — | 2 (`URL_GET_VERSION_DETAILS`) | — |
| 32 | POST | `addcompany` | JWT | write | `app/Api/V2/Controllers/CompanyController.php:233` | F12, F18 | 3 (`URL_ADD_COMPANY`) | — |
| 33 | POST | `routecompanyremove` | JWT | delete | `app/Api/V2/Controllers/RouteController.php:2585` | — | — | — |
| 34 | POST | `companymarkedvisited` | JWT | write | `app/Api/V2/Controllers/RouteController.php:1272` | F10 | 3 (`URL_COMPANY_MARKED_VISITED`) | — |
| 35 | POST | `companylist` | JWT | read | `app/Api/V2/Controllers/RouteController.php:1517` | F12 | 10 (`URL_USER_COMPANY_LIST`) | — |
| 36 | POST | `companylistmap` | JWT | read | `app/Api/V2/Controllers/RouteController.php:1842` | — | 1 (`URL_USER_COMPANY_LIST_MAP`) | — |
| 37 | POST | `companydetail` | JWT | read | `app/Api/V2/Controllers/RouteController.php:2140` | — | 3 (`URL_COMPANY_DETAILS`) | — |
| 38 | POST | `companynamelist` | JWT | read | `app/Api/V2/Controllers/RouteController.php:2255` | — | 2 (`URL_COMPANY_NAME_LIST`) | — |
| 39 | POST | `updatecompanystatus` | JWT | write | `app/Api/V2/Controllers/RouteController.php:2287` | — | 1 (`URL_UPDATE_COMPANY_STATUS`) | — |
| 40 | POST | `updatecompanynotes` | JWT | write | `app/Api/V2/Controllers/RouteController.php:2317` | — | 0 (`URL_UPDATE_COMPANY_NOTES` defined, unused) | — |
| 41 | POST | `updatecompany` | JWT | write | `app/Api/V2/Controllers/CompanyController.php:518` | F12 | 2 (`URL_UPDATE_COMPANY`) | — |
| 42 | POST | `reportcompany` | JWT | write | `app/Api/V2/Controllers/CompanyController.php:3230` | F16 | 3 (`URL_REPORT_COMPANY`) | — |
| 43 | POST | `removeCompanies` | JWT | delete | `app/Api/V2/Controllers/CompanyController.php:3245` | F12 | 1 (`URL_REMOVE_COMPANIES`) | — |
| 44 | POST | `getnotes` | JWT | read | `app/Api/V2/Controllers/CompanyController.php:826` | — | 0 (`URL_GET_COMPANY_NOTE` defined, unused) | UserMcp |
| 45 | POST | `addnote` | JWT | write | `app/Api/V2/Controllers/CompanyController.php:837` | F14 | 0 (`URL_SAVE_NOTE` defined, unused) | UserMcp |
| 46 | POST | `getcompanyactivities` | JWT | read | `app/Api/V2/Controllers/CompanyController.php:911` | F05, F14 | 7 (`URL_GET_COMPANY_ACTIVITIES`) | UserMcp |
| 47 | POST | `addcompanyactivity` | JWT | write | `app/Api/V2/Controllers/CompanyController.php:983` | F14 | 1 (`URL_ADD_COMPANY_ACTIVITY`) | UserMcp |
| 48 | POST | `updatecompanyactivity` | JWT | write | `app/Api/V2/Controllers/CompanyController.php:1032` | F14 | 2 (`URL_UPDATE_COMPANY_ACTIVITY`) | UserMcp |
| 49 | POST | `updatenote` | JWT | write | `app/Api/V2/Controllers/CompanyController.php:880` | — | 0 (`URL_UPDATE_NOTES` defined, unused) | — |
| 50 | POST | `deletenote` | JWT | delete | `app/Api/V2/Controllers/CompanyController.php:902` | — | 2 (`URL_DELETE_NOTES`) | — |
| 51 | POST | `getlogmeeting` | JWT | read | `app/Api/V2/Controllers/CompanyController.php:1076` | F14 | 0 (`URL_GET_LOG_MEET` defined, unused) | — |
| 52 | POST | `addlogmeeting` | JWT | write | `app/Api/V2/Controllers/CompanyController.php:1099` | — | 0 (`URL_SAVE_LOG_MEET` defined, unused) | — |
| 53 | GET | `getlist` | JWT | read | `app/Api/V2/Controllers/ListController.php:51` | F11 | 4 (`URL_USER_LIST`) | UserMcp |
| 54 | POST | `createList` | JWT | read | `app/Api/V2/Controllers/ListController.php:84` | F11 | 3 (`URL_CREATE_LIST`) | UserMcp |
| 55 | POST | `updateList` | JWT | read | `app/Api/V2/Controllers/ListController.php:144` | F11 | 4 (`URL_UPDATE_LIST`) | — |
| 56 | POST | `deleteList` | JWT | read | `app/Api/V2/Controllers/ListController.php:208` | F11 | 2 (`URL_DELETE_LIST`) | — |
| 57 | POST | `generateroute` | JWT | write | `app/Api/V2/Controllers/ListController.php:240` | F11 | 1 (`URL_CREATE_LIST_ROUTE`) | UserMcp |
| 58 | POST | `contactlist` | JWT | read | `app/Api/V2/Controllers/RouteController.php:2388` | F13 | 1 (`URL_USER_CONTACT_LIST`) | — |
| 59 | POST | `companycontactlist` | JWT | read | `app/Api/V2/Controllers/RouteController.php:2635` | — | 2 (`URL_USER_COMPANY_CONTACT_LIST`) | — |
| 60 | POST | `addcontact` | JWT | write | `app/Api/V2/Controllers/ContactSellController.php:54` | F13, F18 | 5 (`URL_USER_ADD_CONTACT`) | — |
| 61 | POST | `updatecontact` | JWT | write | `app/Api/V2/Controllers/ContactSellController.php:320` | F13 | 1 (`URL_USER_UPDATE_CONTACT`) | — |
| 62 | POST | `updatecontactnotes` | JWT | write | `app/Api/V2/Controllers/ContactSellController.php:564` | — | 1 (`URL_UPDATE_CONTACT_NOTES`) | — |
| 63 | POST | `deletecontact` | JWT | delete | `app/Api/V2/Controllers/ContactSellController.php:768` | F13 | 1 (`URL_DELETE_CONTACT`) | — |
| 64 | POST | `reportcontact` | JWT | write | `app/Api/V2/Controllers/ContactSellController.php:788` | F16 | 1 (`URL_REPORT_CONTACT`) | — |
| 65 | POST | `getContactDetail` | JWT | read | `app/Api/V2/Controllers/RouteController.php:2617` | — | 1 (`URL_CONTACT_DETAILS`) | — |
| 66 | GET | `routelist` | JWT | read | `app/Api/V2/Controllers/RouteController.php:63` | — | 5 (`URL_USER_ROUTE_LIST`) | UserMcp |
| 67 | GET | `routeRegenerate/{id}` | JWT | write (GET) | `app/Api/V2/Controllers/RouteController.php:201` | — | — | — |
| 68 | POST | `simplerouteview` | JWT | read | `app/Api/V2/Controllers/RouteController.php:227` | F09 | 13 (`URL_GET_BASIC_ROUTE`) | UserMcp |
| 69 | POST | `advancerouteview` | JWT | read | `app/Api/V2/Controllers/RouteController.php:1020` | F09 | 0 (`URL_GET_ADVANCED_ROUTE` defined, unused) | — |
| 70 | POST | `createroute` | JWT | write | `app/Api/V2/Controllers/RouteController.php:2737` | F08 | 1 (`URL_CREATE_BASIC_ROUTE`) | UserMcp |
| 71 | POST | `updateroute` | JWT | write | `app/Api/V2/Controllers/RouteController.php:3195` | F08 | 2 (`URL_USER_ROUTE_UPDATE`) | — |
| 72 | POST | `reroute` | JWT | write | `app/Api/V2/Controllers/RouteController.php:2993` | — | 3 (`URL_REROUTE`) | — |
| 73 | POST | `publishroute` | JWT | write | `app/Api/V2/Controllers/RouteController.php:3398` | F08 | — | — |
| 74 | POST | `routeonboardingconversion` | JWT | write | `app/Api/V2/Controllers/RouteController.php:4419` | — | 2 (`URL_ROUTE_ONBOARDING_CONVERSION`) | — |
| 75 | POST | `updaterouteactive` | JWT | write | `app/Api/V2/Controllers/RouteController.php:3370` | — | 2 (`URL_UPDATE_ROUTE_ACTIVE`) | — |
| 76 | GET | `getuseractiveroute` | JWT | read | `app/Api/V2/Controllers/RouteController.php:592` | F09 | 1 (`URL_GET_USER_ACTIVE_ROUTE`) | — |
| 77 | POST | `getuseractiveroute` | JWT | read | `app/Api/V2/Controllers/RouteController.php:592` | F09 | 1 (`URL_GET_USER_ACTIVE_ROUTE`) | — |
| 78 | POST | `getuseractiveroutev1` | JWT | read | `app/Api/V2/Controllers/RouteController.php:757` | F09 | 1 (`URL_GET_USER_ACTIVE_ROUTE_V1`) | — |
| 79 | POST | `getactiveroutecompany` | JWT | read | `app/Api/V2/Controllers/RouteController.php:922` | — | 1 (`URL_GET_ACTIVE_ROUTE_COMPANY`) | — |
| 80 | GET | `getuserstatusdetails` | JWT | read | `app/Api/V2/Controllers/RouteController.php:563` | — | 22 (`URL_GET_USER_STATUS_DETAILS`) | — |
| 81 | POST | `routeremove` | JWT | delete | `app/Api/V2/Controllers/RouteController.php:3506` | — | 2 (`URL_ROUTE_REMOVE`) | — |
| 82 | POST | `checkroutename` | JWT | read | `app/Api/V2/Controllers/RouteController.php:3884` | F08 | 4 (`URL_CHECK_ROUTE_NAME`) | — |
| 83 | POST | `bookmarkroutecompany` | JWT | write | `app/Api/V2/Controllers/RouteController.php:1216` | — | 1 (`COMPANY_BOOKMARK`) | — |
| 84 | GET | `getuserstatus` | JWT | read | `app/Api/V2/Controllers/RouteController.php:3909` | F20 | 1 (`GET_USER_STATUS_LIST`) | — |
| 85 | POST | `updateuserstatus` | JWT | write | `app/Api/V2/Controllers/RouteController.php:3934` | F20 | 1 (`UPDATE_USER_STATUS`) | — |
| 86 | POST | `addcompanyvisittime` | JWT | write | `app/Api/V2/Controllers/RouteController.php:3962` | F10 | 1 (`URL_ADD_COMPANY_VISIT_TIME`) | UserMcp |
| 87 | POST | `companyvisitremove` | JWT | delete | `app/Api/V2/Controllers/RouteController.php:4032` | F10 | 1 (`URL_DELETE_COMPANY_VISIT`) | — |
| 88 | POST | `selectallcompany` | JWT | write | `app/Api/V2/Controllers/RouteController.php:1374` | — | 6 (`URL_SELECT_ALL_COMPANY_LIST`) | — |
| 89 | POST | `getlastvisitedentry` | JWT | read | `app/Api/V2/Controllers/RouteController.php:4014` | — | 2 (`URL_GET_LAST_VISITED_ENTRY`) | — |
| 90 | POST | `getticket` | JWT | read | `app/Api/V2/Controllers/SupportController.php:132` | F26 | — | — |
| 91 | POST | `getticketdetail` | JWT | read | `app/Api/V2/Controllers/SupportController.php:165` | — | — | — |
| 92 | POST | `addticket` | JWT | external side effect | `app/Api/V2/Controllers/SupportController.php:35` | — | — | — |
| 93 | POST | `updateticket` | JWT | write | `app/Api/V2/Controllers/SupportController.php:91` | — | — | — |
| 94 | POST | `unreadticketcount` | JWT | read | `app/Api/V2/Controllers/SupportController.php:232` | — | 0 (`URL_UNREAD_TICKET_COUNT` defined, unused) | — |
| 95 | POST | `unassigncontactlist` | JWT | read | `app/Api/V2/Controllers/RouteController.php:2505` | — | 1 (`URL_UNASSIGN_CONTACT_LIST`) | — |
| 96 | POST | `companynavigateme` | JWT | write | `app/Api/V2/Controllers/RouteController.php:4069` | — | 1 (`COMPANY_NAVIGATE_ME`) | — |
| 97 | POST | `hubspot-contacts-sync` | JWT | external side effect | `app/Http/Controllers/HubSpotController.php:141` | F21 | 2 (`URI_CONTACT_SYNC`) | — |
| 98 | POST | `hubspot-companies-sync` | JWT | external side effect | `app/Http/Controllers/HubSpotController.php:462` | F21 | 2 (`URI_COMPANIES_SYNC`) | — |
| 99 | GET | `hubspot-last-sync` | JWT | external side effect | `app/Http/Controllers/HubSpotController.php:1821` | F21 | 2 (`URL_LAST_SYNC`) | — |
| 100 | POST | `hubspot-both-sync` | JWT | external side effect | `app/Http/Controllers/HubSpotController.php:1978` | F21 | 2 (`URI_BOTH_SYNC`) | — |
| 101 | GET | `hubspot-sync-error-list` | JWT | external side effect | `app/Http/Controllers/HubSpotController.php:2070` | F21 | 1 (`URL_HUBSPOT_ERROR_COMP`) | — |
| 102 | POST | `hubspotSessionCompanyDelete` | JWT | delete | `app/Http/Controllers/HubSpotController.php:2106` | — | 1 (`URL_HUBSPOT_ERROR_COMP_DEL`) | — |
| 103 | POST | `hubspotSessionCompanyErrorFix` | JWT | write | `app/Http/Controllers/HubSpotController.php:2135` | — | 1 (`URL_HUBSPOT_ERROR_COMP_FIX`) | — |
| 104 | POST | `bulk-companies-create` | JWT | write | `app/Api/V2/Controllers/CompanyController.php:1178` | — | 1 (`URL_BULK_COMPANIES_CREATE`) | — |
| 105 | GET | `getusercredit` | JWT | read | `app/Api/V2/Controllers/RouteController.php:3711` | F05, F15 | 12 (`GET_CREDIT_INFO`) | UserMcp, FindMcp |
| 106 | GET | `getuserdata` | JWT | read | `app/Api/V2/Controllers/UserDataController.php:20` | — | — | — |
| 107 | POST | `getuserdata` | JWT | read | `app/Api/V2/Controllers/UserDataController.php:20` | — | — | — |
| 108 | GET | `uploaderror/autofill-address` | JWT | read | `app/Api/V2/Controllers/CompanyController.php:1540` | — | — | — |
| 109 | GET | `uploaderror/autofill-company` | JWT | read | `app/Api/V2/Controllers/CompanyController.php:1552` | — | — | — |
| 110 | POST | `uploaderror/merge-contacts-with-company` | JWT | write | `app/Api/V2/Controllers/CompanyController.php:1536` | — | — | — |
| 111 | GET | `uploaderror/append-companies` | JWT | write (GET) | `app/Api/V2/Controllers/CompanyController.php:1544` | — | — | — |
| 112 | GET | `uploaderror/delete-duplicate` | JWT | write (GET) | `app/Api/V2/Controllers/CompanyController.php:1548` | — | — | — |
| 113 | POST | `getCongnismContact` | JWT | read (provider call; may cost) | `app/Api/V2/Controllers/CompanyController.php:1648` | — | 0 (`URL_CONGNISUM_CONTACT` defined, unused) | — |
| 114 | POST | `redeemCongnismContact` | JWT | paid/billing | `app/Api/V2/Controllers/CompanyController.php:1820` | — | 0 (`URL_SAVE_CONGNISUM_CONTACT` defined, unused) | — |
| 115 | POST | `redeemFullEnrichContact` | JWT | paid/billing | `app/Api/V2/Controllers/CompanyController.php:1709` | — | 0 (`URL_SAVE_FULL_ENRICH_CONTACT` defined, unused) | — |
| 116 | POST | `getApolloContact` | JWT | read (provider call; may cost) | `app/Api/V2/Controllers/CompanyController.php:1583` | — | 3 (`URL_APOLLO_CONTACT`) | UserMcp |
| 117 | POST | `redeemApolloContact` | JWT | paid/billing | `app/Api/V2/Controllers/CompanyController.php:1927` | — | 0 (`URL_SAVE_APOLLO_CONTACT` defined, unused) | — |
| 118 | POST | `fetchAllContacts` | JWT | read (provider call; may cost) | `app/Api/V2/Controllers/CompanyController.php:3157` | F15 | 4 (`URL_FETCH_FIRST_CONTACT`) | UserMcp, FindMcp |
| 119 | POST | `fetchOpencorporatesCompany` | JWT | read (provider call; may cost) | `app/Api/V2/Controllers/CompanyController.php:3166` | — | — | — |
| 120 | POST | `fetchClaudeContact` | JWT | read (provider call; may cost) | `app/Api/V2/Controllers/CompanyController.php:3175` | — | 5 (`URL_FETCH_OPENCORPORATES_COMPANY`) | UserMcp, FindMcp |
| 121 | POST | `buyContacts` | JWT | paid/billing | `app/Api/V2/Controllers/CompanyController.php:3216` | F15 | 3 (`URL_SAVE_COMPANY_CONTACT`) | UserMcp, FindMcp |
| 122 | GET | `cancelSubscription` | JWT | paid/billing | `app/Api/V2/Controllers/RouteController.php:4207` | F03 | 1 (`CANCEL_SUBSCRIPTION`) | — |
| 123 | POST | `cancelSubscription` | JWT | paid/billing | `app/Api/V2/Controllers/RouteController.php:4207` | F03 | 1 (`CANCEL_SUBSCRIPTION`) | — |
| 124 | POST | `request-package-upgrade` | JWT | paid/billing | `app/Api/V2/Controllers/RouteController.php:4241` | F03 | 1 (`CHANGE_SUBSCRIPTION`) | — |
| 125 | POST | `getBizpediaContact` | JWT | read (provider call; may cost) | `app/Api/V2/Controllers/CompanyController.php:2036` | — | — | — |
| 126 | POST | `getOpencorporatesCompany` | JWT | read (provider call; may cost) | `app/Api/V2/Controllers/CompanyController.php:2474` | — | 1 (`URL_OPENCORPORATES_COMPANY`) | — |
| 127 | POST | `getOpencorporatesContact` | JWT | read (provider call; may cost) | `app/Api/V2/Controllers/CompanyController.php:2667` | — | 1 (`URL_OPENCORPORATES_CONTACT`) | — |
| 128 | POST | `updateName` | JWT | write | `app/Api/V2/Controllers/CompanyController.php:1555` | — | 2 (`URL_EDIT_NAME`) | — |
| 129 | POST | `getroutedata` | JWT | read | `app/Api/V2/Controllers/RouteController.php:4288` | — | — | — |
| 130 | GET | `getIndutriesType` | JWT | read | `app/Api/V2/Controllers/CompanyController.php:2853` | — | 5 (`GET_INDUSTRY_TYPES`) | — |
| 131 | POST | `shareRouteList` | JWT | external side effect | `app/Api/V2/Controllers/RouteController.php:4318` | F17 | 4 (`SHARE_ROUTE_LIST`) | — |
| 132 | POST | `getShareRouteListEmails` | JWT | external side effect | `app/Api/V2/Controllers/RouteController.php:4408` | — | 2 (`GET_SHARED_EMAIL_LIST`) | — |
| 133 | POST | `getAILeads` | JWT | read (provider call; may cost) | `app/Api/V2/Controllers/CompanyController.php:2862` | F06 | 1 (`URL_GET_AI_COMPANIES`) | — |
| 134 | POST | `getTop50AILeads` | JWT | read (provider call; may cost) | `app/Api/V2/Controllers/CompanyController.php:2981` | — | 0 (`URL_GET_TOP50_AI_COMPANIES` defined, unused) | — |
| 135 | POST | `saveAILeads` | JWT | paid/billing | `app/Api/V2/Controllers/CompanyController.php:3021` | F06 | 1 (`URL_AI_BULK_COMPANIES_CREATE`) | UserMcp, FindMcp |
| 136 | POST | `AILeadsContactFinder` | JWT | write | `app/Api/V2/Controllers/CompanyController.php:3096` | — | 4 (`URL_GET_AI_COMPANIES_CONTACT_LIST`) | — |
| 137 | POST | `getYelpLeads` | JWT | read (provider call; may cost) | `app/Api/V2/Controllers/CompanyController.php:3127` | F07 | — | — |
| 138 | POST | `getAILeadsV2` | JWT | read (provider call; may cost) | `app/Api/V2/Controllers/CompanyController.php:2903` | F06 | 2 (`URL_GET_AI_COMPANIES_V2`) | UserMcp, FindMcp |
| 139 | POST | `resumeAILeadSearch` | JWT | write | `app/Api/V2/Controllers/CompanyController.php:2933` | F06 | 2 (`URL_GET_AI_COMPANIES_LIST_V2`) | UserMcp, FindMcp |
| 140 | GET | `getAiLeadData` | JWT | read | `app/Api/V2/Controllers/CompanyController.php:3150` | — | 1 (`URL_GET_AI_LEAD_DATA`) | — |
| 141 | POST | `aiLeadGoogleSearch` | JWT | write | `app/Api/V2/Controllers/CompanyController.php:3064` | — | 0 (`URL_GET_AI_COMPANIES_LIST` defined, unused) | — |
| 142 | POST | `updateUserPreferences` | JWT | write | `app/Api/V2/Controllers/AuthController.php:744` | F02 | 1 (`URI_UPDATE_USER_PREFERENCES`) | — |
| 143 | POST | `getUserActivity` | JWT | read | `app/Api/V2/Controllers/AuthController.php:845` | F05 | 3 (`URL_GET_USER_ACTIVITY`) | — |
| 144 | POST | `invite-user` | JWT | external side effect | `app/Api/V2/Controllers/InviteController.php:25` | F24, F28 | 1 (`URL_INVITE_USER`) | — |
| 145 | POST | `scan-qr-code` | JWT | write | `app/Api/V2/Controllers/AuthController.php:876` | F19 | 1 (`URL_SCAN_QR_CODE`) | — |
<!-- api-map:end -->

## 5. What is still unknown

- Request and response fields per endpoint beyond those asserted by the F01 contract suite. The observed
  shapes of the safe read endpoints are recorded in §6 as they are captured.
- How webhook callers are authenticated (§2).
- ~~Whether the public list endpoints leak data~~: they do not (runtime, §6).

## 6. Observed responses (runtime, staging)

Read-only calls on 2026-09-16 (`workspace/test-suites/api-contract`, EV-A01…A09). Shapes only; no values recorded.

| Endpoint | Role | HTTP · `status` | Shape (top level) | Notes |
|---|---|---|---|---|
| `POST login` | SA, BSA, Admin | 200 · `"1"` (string) | `status, message, data{token, role, subscription_status, free_trial_status, …}, unread_notification_count, is_subscription_expired` | Admin is admitted (BT-1). No `device_token` → 500 + SQL text (UI-API-04) |
| `GET getusercredit` | SA / BSA | 200 · `1` | `data{0, leads{total_credit, used_credit, package_name, …}}, is_subscription_expired, unread_route_count, unread_list_count, ios_version, android_version, package_isupgrade` | the BSA row has `alloted_credits` and no `package_name` |
| `GET getuserstatus` | SA / BSA | 200 · `1` | `data[{id, name, colorcode}]` | 7 rows for SA, 6 for BSA |
| `GET routelist` | SA / BSA | 200 · `1` | `data{draft_routes[], published_routes[]}` | — |
| `GET getlist` | SA / BSA | 200 · `1` | `data{lists[]}` | — |
| `POST companylist` | SA | 200 · `1` with `page=0`; **500** with an empty body | `data` | empty body → MySQL error text + `debug` (UI-API-02) |
| `GET notificationlist` | SA / BSA | 200 · `1` | `data[{id, title, description, is_read, created_at, created_at_date, created_at_time, user_route}], unread_count` | not paginated (1,088 items for the SA) |
| `GET getuserdata` | SA / BSA | 200 · `1` | `data{profile, subscription, credits, counts, routes, lists, companies, contacts, notes, activities, ai_searches, preferences, statuses, categories, contact_stages, active_route, onboarding_completed}` | 3.2 s for the SA; used by no mobile or MCP caller |
| `GET getuseractiveroute` | SA / BSA | 200 · `1` | `data{route_details[]}` | **21.7 s** for the SA (UI-PERF-01) |
| `POST getUserActivity` | SA / BSA | 200 · `1` | `data[]` (≤ 5 for `scope=recent`) | — |
| `POST getticket` | SA / BSA | 200 · `1` | **`tickets[]` at the top level** (not under `data`) | — |
| `GET getIndutriesType` | SA / BSA | 200 · `1` | `data[string]` | 182 items for the SA, 70 for the BSA (per-account list) |
| `GET getcategories`, `getusercontactstage` (no token) | Public | **500** | Dingo `{message, status_code, debug}` | no data leaked (UI-API-03) |
| `GET getusercredit` (no token) | Public | 401 | Dingo `{message, status_code, debug}` | `debug` = class, file, line, trace (UI-SEC-02) |
| `GET getrestrictuser` | Public | 200 · `1` | `data{key, value, name, description, …}` | the `is_registration` setting |

**Envelope reality:** read endpoints return `status` as the **number** 1; `login` returns the **string** "1". Clients
compare loosely (`== 1`), so both work today.

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (73)

**Documents (26):** [[brain/context/architecture|Architecture: how Territool is built, end to end]] · [[brain/audits/10-brain-final-audit|Audit 10 — Territool AI Brain final audit]] · [[brain/audits/02-web|Audit 2 – web app review]] · [[brain/context/brain-qa|Brain QA: questions the brain must answer correctly, and how it did]] · [[brain/context/brain-scorecard|Brain scorecard: 18 categories, rubric, iterations]] · [[brain/context/contradiction-register|Contradiction register: where two sources disagreed, and which won]] · [[brain/memory/entries/conflict/20260917-399e9d-cr-18-my-own-api-map-draft-jwt-refresh-group-at-|CR-18 — my own api-map draft: jwt.refresh group at routes/api.php:100 ↔ the group starts at :103]] · [[brain/memory/entries/conflict/20260917-70e842-cr-25-qa-report-2026-09-16-status-is-always-a-st|CR-25 — QA report 2026-09-16: status is always a string ↔ read endpoints return the number 1]] · [[brain/memory/entries/conflict/20260917-d246dd-cr-26-api-map-1-no-role-gate-any-authenticated-u|CR-26 — api-map §1: "no role gate; any authenticated user including Admin is admitted" ↔ login refuses a Business Age…]] · [[brain/memory/entries/qa/20260917-37d3b8-ev-a01-42-api-contract-cases-32-pass-8-known-gap|EV-A01 — 42 API contract cases: 32 pass, 8 known gaps, 2 waived (purchase, search), 0 fail; plus 9 web contract cases…]] · [[brain/memory/entries/qa/20260917-316f8d-ev-a09-read-endpoints-return-status-as-the-numbe|EV-A09 — Read endpoints return status as the number 1; login returns the string "1"]] · [[brain/memory/entries/qa/20260917-eb2197-ev-c11-145-v2-routes-25-public-96-used-by-mobile|EV-C11 — 145 v2 routes (25 public); 96 used by mobile, 20 by the customer MCP, 47 with no consumer found]] · [[brain/context/evidence-ledger|Evidence ledger: what was checked, how, and what it proves]] · [[workspace/qa-reports/2026-09-16-f01-login-api-contract|F01 QA report — Login & session]] · [[brain/context/parity-map|Mobile vs web differences]] · [[workspace/design-proposals/2026-09-17-lists-library-filter/placement|Placement walk-through: "add a filter to the Lists library"]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/roles-permissions|Roles and permissions: who can do what, where, and what enforces it]] · [[brain/memory/entries/question/20260917-d1f7ac-scan-business-card-f18-has-no-known-api-or-web-e|Scan business card (F18) has no known API or web endpoint in the brain]] · [[brain/context/system-map|System map: role → platform → screen → action → API → data → result → next]] · [[workspace/tasks/2026-09-16-brain-improvement-loop|Task brief: autonomous brain improvement loop to 90+]] · [[brain/context/stack|Tech setup & environments]] · [[brain/memory/entries/api/20260917-c0fcec-ui-api-05-publishroute-and-46-other-routes-have-|UI-API-05 — publishroute and 46 other routes have no caller in mobile or the customer MCP]] · [[brain/memory/entries/product/20260917-c9b432-ui-ux-07-lists-can-t-be-filtered-by-shared-with-|UI-UX-07 — Lists can't be filtered by "shared with me", "unread" (web shows an Unread tile) or "assigned by manager" on…]] · [[brain/context/UPCOMING_IMPROVEMENTS|Upcoming improvements: application findings not fixed during the brain work]] · [[brain/context/conventions-web|Web app coding rules]]

**Product features (24):** [[_id/F14|Activities / notes / log meetings]] · [[_id/F06|AI Find Leads → save leads]] · [[_id/F24|Business Sales Agent management]] · [[_id/F12|Companies (Address Book)]] · [[_id/F13|Contacts]] · [[_id/F08|Create route]] · [[_id/F21|CRM sync]] · [[_id/F05|Dashboard, activity feed, calendar]] · [[_id/F15|Find & buy contacts]] · [[_id/F11|Lists]] · [[_id/F01|Login & session]] · [[_id/F10|Mark visited & visit log]] · [[_id/F27|Notifications & push]] · [[_id/F07|Places / Yelp leads]] · [[_id/F19|QR route import]] · [[_id/F28|Referral invites]] · [[_id/F02|Registration & onboarding]] · [[_id/F16|Report company/contact]] · [[_id/F09|Route detail & navigation]] · [[_id/F18|Scan business card]] · [[_id/F20|Settings / status tags / stages]] · [[_id/F17|Share route/list]] · [[_id/F03|Subscription / paywall / upgrade / cancel / credits…]] · [[_id/F26|Support tickets]]

**Coding rules (3):** [[_id/S0.6|Old API V1 left alone]] · [[_id/S3.8|Only the user's own data]] · [[_id/DW1|Validation/handled-failure format for new V2 endpoints]]

**Owner decision (1):** [[_id/BT-1|Block Admin on the mobile app]]

**Problem founds (2):** [[_id/KG-BT1|Admin can log in to mobile]] · [[_id/KG-BT4|Visits saved without owner check]]

**Code files (17):** [[_code/mobile/App/utils/API.js|API.js]] · [[_code/web/app/Api/V2/Controllers/AuthController.php|AuthController]] · [[_code/web/app/Api/V2/Controllers/CityController.php|CityController]] · [[_code/web/app/Api/V2/Controllers/CompanyController.php|CompanyController]] · [[_code/mobile/App/config/index.js|config/index.js]] · [[_code/web/app/Api/V2/Controllers/ContactSellController.php|ContactSellController]] · [[_code/web/app/FindMcp/Services/Tools/ContactsTools.php|ContactsTools]] · [[_code/web/app/UserMcp/Services/CustomerApiClient.php|CustomerApiClient]] · [[_code/web/app/Http/Controllers/HubSpotController.php|HubSpotController]] · [[_code/web/app/Api/V2/Controllers/InviteController.php|InviteController]] · [[_code/web/app/Api/V2/Controllers/ListController.php|ListController]] · [[_code/web/app/Api/V2/Controllers/RouteController.php|RouteController]] · [[_code/web/app/UserMcp/Services/Tools/RoutesTools.php|RoutesTools]] · [[_code/web/app/Http/Controllers/SfdcController.php|SfdcController]] · [[_code/web/app/Api/V2/Controllers/SupportController.php|SupportController]] · [[_code/web/app/Api/V2/Controllers/UserDataController.php|UserDataController]] · [[_code/web/app/Api/V2/Controllers/WebhookController.php|WebhookController]]

%% brain-links:end %%
