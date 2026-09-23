---
area: context
tags: [brain/context]
ref: "Architecture: how Territool is built, end to end"
---

# Architecture: how Territool is built, end to end

This is the one-page view that the audits lacked. It **summarises and points to** the detailed evidence in
`brain/audits/01-mobile.md` (mobile), `02-web.md` (web, API, MCP), `stack.md` (versions and environments),
`api-map.md` (endpoints) and `data-model.md` (storage). If this page and an audit disagree, the audit's
cited line wins; record the disagreement in `contradiction-register.md`.

Status: **VERIFIED (code)** unless marked otherwise. Runtime checks are named where they exist.

## 1. The system in one picture

```
 iOS / Android app (React Native)          Browser                                   Claude / ChatGPT
   Sales Agent, Business Sales Agent        ├─ Web user app  (Blade)  all field roles   customer connectors
        │  Bearer JWT, multipart POST       ├─ Manager portal (React) Business Agent        │ OAuth
        ▼                                   └─ Admin HQ (Backpack)   Admin                  ▼
 /index.php/api/*  Dingo v2  ◄────────────────── internal dispatch (minted JWT) ─── /ai/mcp (UserMcp)
   V2 controllers                          session + CSRF                              /find-mcp/mcp (FindMcp)
        │                                        │                                     /ai/mcp-admin (AdminMcp)
        └────────────► Laravel 5.3 app (one codebase: repos/web, branch beta_react) ◄──┘
                         ├─ web controllers (fat) · V2 controllers · Services/* (newer) · Globals/Helper.php
                         ├─ MySQL (all business data) · MongoDB (geography) · files (PDF, CSV)
                         ├─ queue: 9 jobs (staging worker not processing, KG-Q1) · crons = HTTP GET URLs
                         └─ outbound: Google Maps/Places/Roads/Address, Gemini, Anthropic, Apollo, FullEnrich,
                            Cognism, OpenCorporates, HubSpot, Salesforce, KarmaCRM, Stripe, PayPal, RevenueCat,
                            FCM push, mail (Mailgun/SES/SparkPost/Loops), PostHog, Sentry
```

Evidence: `routes/api.php`, `routes/web.php`, `config/services.php` (mailgun, ses, sparkpost, stripe,
revenuecat, pipedrive, anthropic, loops, posthog), and the hosts called from `app/` and `config/`
(scan 2026-09-16: `maps.googleapis.com` ×33, `opencorporates.com` ×27, `api.hubapi.com` ×18,
`app.fullenrich.com` ×6, `generativelanguage.googleapis.com` ×5, `places.googleapis.com` ×4,
`api.stripe.com` ×4, `api.apollo.io` ×4, `app.cognism.com` ×3, `fcm.googleapis.com` ×2,
`app.karmacrm.com` ×2, `api.revenuecat.com` ×2, `api.anthropic.com` ×2, Salesforce login ×2).
`pipedrive` has a services entry, but no call site was traced (UNKNOWN whether it is live).

## 2. Repositories and branches

| Repo | Branch flow | Build / release | Evidence |
|---|---|---|---|
| `repos/mobile` (GitHub `DhruvDave01/TerriTool_Mobile`) | `TT_80` → `Staging` → `Production`, merged by the npm scripts `merge:t2s`, `merge:s2p` and `merge:release` | `react-native run-ios/android`. No fastlane and no CI in the repo. **How store builds are produced is UNKNOWN** | `package.json` scripts |
| `repos/web` (Bitbucket `anujsinghsahni/webterritool`) | `beta_react` | Composer + Vite (the manager portal builds to `public/js/manager-portal.js`, which is committed). **The deploy method is UNKNOWN** (BT-9 depends on it) | `vite.config.js`; `stack.md` §8 |

## 3. Mobile

| Concern | How it works | Evidence |
|---|---|---|
| Shell | One native stack of 49 screens, `headerShown: false`, most loaded with `React.lazy`. There is no tab navigator; the bottom bar is the custom `customfooter` on inner screens. **The dashboard has no footer** (VERIFIED runtime 2026-09-16) | `App/App.js:332-389`; EV-M02 |
| Start-up | `initialRouteName` = the logged-in route when a JWT is in Realm, else `Login`. Navigation state is saved but never restored | `App.js:215, 333`; `01-mobile.md` §1 |
| Footer | six buttons: Dashboard · AI Find Leads (`MultipleAIWaypoint`) · Address Book (`ListCompany`) · Routes · Lists · Settings (`EditStatus`) | `customfooter/index.js:243-341`; runtime screenshot EV-M04 |
| State | per-screen `this.state`; cross-screen static class `utils/Global.js`; `DeviceEventEmitter`; one Context. No store library | `01-mobile.md` §1 |
| Networking | `utils/API.js` (`post`, `get`, `get_third_party`): multipart, Bearer JWT from Realm, errors read from the **body** `status_code` | `API.js:229-342` |
| Auth | JWT in the unencrypted Realm `JWTToken`. A 401/403 fires `SESSION_EXPIRED_EVENT`, which shows a modal and resets to Login | `storage/realm.js:29-50`; `App.js:171-199` |
| Local data | Realm: `JWTToken`, `TourSchema`, `AIFindLeads`, `FCMNotication`; `offlineRoute` is read but never written (offline dropped) | `data-model.md` §4 |
| Payments | RevenueCat (`utils/RevenueCatService.js`); the paywall flow is `register/postSignupPaywallFlow.js` (Goals → Role → Cost → configuring → subscribe) | `index_register_split.js:536` |
| Push | Firebase Messaging + Notifee on the device; the server sends through FCM from `Globals/Helper.php`. **The Notifications screen is unreachable** (F27) | `package.json`; `flows.md` F27 |
| Maps and navigation | `react-native-maps`, `react-native-map-link` (hands off to Apple/Google Maps) | `package.json` |
| Camera | `react-native-camera-kit` (QR, F19; business card, F18). Card fields are extracted on-device with Gemini | `flows.md` F18 |
| Observability | Sentry, PostHog, Crashlytics; unhandled rejections route to the crash fallback screen | `init.js:78-178`; `utils/crashRecovery.js` |
| Environments | `config/index.js` hard-codes the staging `URL_BASE`; the production line is commented out, and switching means editing and rebuilding. The debug build shows a "Development (S)" banner on inner screens (VERIFIED runtime) | `config/index.js:8-13`; EV-M04 |
| Feature build pattern | Gen 1 = class screens with API calls inline; Gen 2 = function components + `utils/*` helpers. No hook or service layer | `01-mobile.md` §2 |

## 4. Web (one Laravel app, three surfaces)

| Concern | How it works | Evidence |
|---|---|---|
| Surfaces | Blade user app `/` (all field roles) · manager portal `/manager` (React, Business Agent) · Admin HQ `/hq` (Backpack, Admin). Each has its own look | `web-surfaces.md` |
| Request path | `routes/web.php` → middleware (`web`, `auth`, `role`, `manager.only`) → controller → query builder / Eloquent → Blade view or JSON | `02-web.md` §2.1 |
| Role routing | `role` (`CheckUserRole`) sends Admin to `/hq/dashboard` and every other role away from `/hq/*`; `manager.only` (`EnsureManagerRole`) admits only Business Agents to `/manager` | `CheckUserRole.php:20-40`; `EnsureManagerRole.php:10-27` |
| Roles | Spatie `HasRoles` with the `role_users` pivot | `data-model.md` §2 |
| Authorization | no policies or gates; ownership is a hand-written `where('user_id', …)`; many writes lack it (S3.8) | `02-web.md` §1 |
| Business logic | fat controllers (`CompanylController` 8.5k lines), `Globals/Helper.php` 4.8k, and newer `Services/*` classes with PHPUnit tests (Manager) | `02-web.md` §2.1 |
| Manager portal | React 18 + Vite; `utils/managerFetch.js` calls `/manager/api/*` with the session cookie and CSRF token; the server side is `ManagerDashboardController` → `Services/Manager/*` | `routes/web.php:186-229` |
| Admin HQ | Backpack CRUD 3.2 under `/hq`, with `Auth::routes()` inside the group (its login is `/hq/login`). **Several HQ GET routes change data** (`subscription/active/{id}`, `deactive`, `lifetimeactive`, `delete/{id}`, `resendinvitation`, `calculateroute`), so a crawler or prefetcher could trigger them | `routes/web.php:97-180`; `UPCOMING_IMPROVEMENTS.md` UI-SEC-03 |
| Jobs and crons | 9 queued jobs; crons are public HTTP GET routes. The staging worker is not processing jobs (KG-Q1) | `stack.md` §4 |
| Errors | `Exceptions/Handler.php` reports to Sentry and PostHog; API errors use Dingo's format | `02-web.md` §1 |

## 5. API V2

See `api-map.md`: 145 routes, 25 public, JWT for the rest, no role gate, no shared pagination
convention, and two envelope types (`status` 1/"1" vs Dingo exceptions).

## 6. MCP modules

| Module | Role | How it reaches data | Evidence |
|---|---|---|---|
| `UserMcp` `/ai/mcp` | customer connector "TerriTool App" | `CustomerApiClient` mints a JWT and dispatches V2 **internally**, so it inherits every V2 rule. `mark_visited` writes directly (KG-BT4) | `CustomerApiClient.php:9-60`; `UserMcp/Services/Tools/RoutesTools.php:404-413` (calls `addcompanyvisittime`, then sets the stop's `is_visited` itself) |
| `FindMcp` `/find-mcp/mcp` | customer connector: find leads, find and buy contacts | the same client pattern; `skills/*.md` guide the model | `FindMcp/README.md` |
| `AdminMcp` `/ai/mcp-admin`, `/api/mcp/*` | internal sales desk | its own services (for example `RevenueCatSubscriberClient`) | `02-web.md` §2.1 |
| `McpClient` `salesperson/mcp/*` | **outbound**: the user connects HubSpot/Salesforce MCP servers; sync and chat | secrets in `user_mcp_connections` | `data-model.md` §2 |

## 7. Cross-cutting

| Concern | State | Evidence |
|---|---|---|
| Validation | inline `Validator::make`; rules differ per surface (P2, P3, P4, P5, P7) | `03-parity.md` §2 |
| Response envelope | `status` 1 / "1" / true across endpoints (P10) | `stack.md` §6 |
| i18n | none; English only (both apps) | `01-mobile.md` §1 |
| Tests | Maestro (8 repo flows + brain suites), Detox (2), PHPUnit (18, Manager only), brain API contract suite (F01) | `05-testing.md` §1; `workspace/test-suites/` |
| CI | none in either repo | `02-web.md` §1; `01-mobile.md` §1 |
| Security posture | see `known-fragile.md` KG-SEC* and `UPCOMING_IMPROVEMENTS.md` §Security | — |

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (44)

**Documents (23):** [[brain/context/api-map|API map: every V2 endpoint, who calls it, and how it behaves]] · [[brain/audits/01-mobile|Audit 1 – mobile app review]] · [[brain/audits/10-brain-final-audit|Audit 10 — Territool AI Brain final audit]] · [[brain/audits/02-web|Audit 2 – web app review]] · [[brain/audits/03-parity|Audit 3 – mobile vs web]] · [[brain/audits/05-testing|Audit 5 – testing plan]] · [[brain/context/brain-qa|Brain QA: questions the brain must answer correctly, and how it did]] · [[brain/context/brain-scorecard|Brain scorecard: 18 categories, rubric, iterations]] · [[brain/context/contradiction-register|Contradiction register: where two sources disagreed, and which won]] · [[brain/context/data-model|Data model: what Territool stores and where]] · [[brain/memory/entries/qa/20260917-c57936-ev-m02-the-dashboard-has-no-footer-header-name-c|EV-M02 — The Dashboard has no footer: header (name, credits pill, QR, settings), "Want 20 more credits?", six tiles (A…]] · [[brain/memory/entries/qa/20260917-3debcc-ev-m04-routes-library-search-cards-with-n-waypoi|EV-M04 — Routes Library: search, cards with "N Waypoints remaining M Total" (KG-GLOSS1), miles, hours; a six-button…]] · [[brain/memory/entries/qa/20260917-5e3399-ev-m11-the-post-signup-paywall-flow-step-1-of-6-|EV-M11 — The post-signup paywall flow ("Step 1 of 6 · What's the win you're chasing?", "Back to Login") can be reached…]] · [[brain/context/evidence-ledger|Evidence ledger: what was checked, how, and what it proves]] · [[brain/context/known-fragile|Known problems & risky areas]] · [[brain/context/flows|Product features list]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[workspace/tasks/2026-09-16-brain-improvement-loop|Task brief: autonomous brain improvement loop to 90+]] · [[brain/context/stack|Tech setup & environments]] · [[brain/context/web-surfaces|The three web surfaces, and how each one is built]] · [[brain/memory/entries/question/20260917-500f45-u-dep-01-how-mobile-store-builds-and-the-web-dep|U-DEP-01 — How mobile store builds and the web deploy are produced (CI? manual? --no-dev?)]] · [[brain/context/UNKNOWN_REGISTER|Unknown register: what the brain does not know yet]] · [[brain/context/UPCOMING_IMPROVEMENTS|Upcoming improvements: application findings not fixed during the brain work]]

**Product features (4):** [[_id/F01|Login & session]] · [[_id/F27|Notifications & push]] · [[_id/F19|QR route import]] · [[_id/F18|Scan business card]]

**Coding rule (1):** [[_id/S3.8|Only the user's own data]]

**Owner decision (1):** [[_id/BT-9|Login library must ship with the app]]

**Problem founds (4):** [[_id/KG-Q1|Background jobs not running on staging]] · [[_id/KG-SEC|KG-SEC]] · [[_id/KG-GLOSS1|Old word “Waypoint” shown]] · [[_id/KG-BT4|Visits saved without owner check]]

**Code files (11):** [[_code/mobile/App/utils/API.js|API.js]] · [[_code/mobile/App/config/index.js|config/index.js]] · [[_code/mobile/App/utils/crashRecovery.js|crashRecovery.js]] · [[_code/mobile/App/components/customfooter/index.js|customfooter/index.js]] · [[_code/mobile/App/utils/Global.js|Global.js]] · [[_code/web/app/Globals/Helper.php|Helper]] · [[_code/mobile/App/components/register/index_register_split.js|index_register_split.js]] · [[_code/mobile/App/components/register/postSignupPaywallFlow.js|postSignupPaywallFlow.js]] · [[_code/mobile/App/storage/realm.js|realm.js]] · [[_code/mobile/App/utils/RevenueCatService.js|RevenueCatService.js]] · [[_code/web/app/UserMcp/Services/Tools/RoutesTools.php|RoutesTools]]

%% brain-links:end %%
