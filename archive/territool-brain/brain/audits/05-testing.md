---
area: audits
tags: [brain/audits]
ref: "Audit 5 – testing plan"
---

# Phase 5 — Testing & QA Audit

- **Date:** 2026-09-15
- **Status:** STOPPED. Execution design (§2), test-case format (§6), staging data policy (§7) and decisions D-T1–D-T7 await owner approval.
- **Inputs:**
  - Both repos (read-only)
  - `shoebox/06-testing/` (empty)
  - `shoebox/09-known-issues/fragile.md` (**DRAFT created in this phase**, owner to confirm)
  - `shoebox/07-flows/flows.md` (criticality approved)
  - Phases 1–4
- **No tests were executed** in this phase (repos read-only). Execution is proposed below and will be exercised in Phase 7 with approval.

---

## 1. Test infrastructure today

| Layer | What exists | Last changed | Actually run? | Evidence |
|---|---|---|---|---|
| Mobile unit | `__tests__/App.test.tsx` (RN template render test), Jest `preset: react-native` | 2026-03-17 (initial commit) | No sign of use; no tests beyond the template | `__tests__/`, `jest.config.js` |
| Mobile E2E: Detox | `.detoxrc.js` (iPhone 17 Pro Max sim, `Pixel_9_Pro_XL` AVD, **which doesn't exist locally**), `e2e/auth/login.e2e.js`, `e2e/login-flow.e2e.js` | 2026-04-29 | Unknown; the docs call it "optional"; `detox` CLI not installed | `e2e/README.md`, `docs/RELEASE_AND_QA_PROCESS.md:256` |
| Mobile E2E: Maestro | 8 flows (1,004 lines): login ios/android, login validation (android), register staging ios/android, register validation (android), post-register onboarding (android, 313 lines), full journey (android); npm scripts `maestro:*` | 2026-09-03 | Unknown; `maestro` CLI not installed on this machine | `.maestro/README.md`, `package.json:29-40` |
| Mobile static QA | `scripts/audit-missing-testids.js`, `inject-automatic-testids.js`, `qa-ui-parity-check.js` (static Android/iOS parity checks) | 2026-05/06 | Unknown | `scripts/` |
| Mobile manual QA | Release checklist (auth, dashboard, routes, companies, lists, platform, release) with sign-off table; **no filled sheet committed**; `qa-screenshots/` referenced but not in repo | June 2026 | Process defined; execution evidence missing | `docs/RELEASE_AND_QA_PROCESS.md:145-211` |
| Web unit | PHPUnit **5.7.27**; 4 files, **18 tests**: `ManagerFindLeadsServiceTest` (10), `ManagerDashboardFieldSalesScoringTest` (5), `ManagerDashboardTerritoryVisitTest` (2), `ExampleTest` (1). Base `TestCase` boots the full app | tests 2026-08-25; `phpunit.xml` 2019 | Unknown; no CI | `tests/`, `phpunit.xml` |
| Web E2E / API tests | **None** | — | — | — |
| MCP QA | Artisan commands: `territool-app:qa` ("transaction-safe, multi-user User MCP QA"), `territool-app:qa-contacts`, `territool-app:qa-search`, `territool-app:selftest`, `territool-app:logs` | 2026-09-07 | Probably run during MCP work (13 commits) | `app/UserMcp/Console/*.php` |
| CI | **None** in either repo | — | — | root listings |
| Issue tracker link | Jira project `TT1` exists but is referenced by only **1** commit (web 2026-08-25) | — | — | git log |
| Codex | Codex desktop app config at `~/.codex` (browser/chrome/computer-use plugins); **no `codex` CLI on PATH**; repo `.codex/config.toml` only defines 2 MCP server URLs. Owner: "not working properly" | — | No | Phase 0 §13 |

**Selector quality:** Maestro flows rely partly on auto-injected, order-based testIDs such as `screen.customCompany.pressTouchableOpacityDup7` and `screen.congContact.pressTouchableOpacityC` (from `scripts/inject-automatic-testids.js`). Adding or reordering a button silently retargets them, so **these flows are brittle**. Rule M12 (semantic testIDs) applies to new code.

**testID readiness per screen** (automation needs stable IDs):
- **0 testIDs:** `BusinessCard` (1,631 lines), `WaypointDetail`, `QrCodeScanner`, `Error`, `RouteSwipe`.
- **Very low:** `ContactsCreate` 7, `ContactsUpdate` 7, `CalendarActivity` 5, `RecentActivity` 5, `PublishRoute` 6, `Contact` 6, `SubscriptionGate` 1.
- **Good:** `CustomCompany` 145, `MultipleAIWaypoint` 105, `Routes` 54, `EditStatus` 46.

---

## 2. Test execution design (the "Codex" question)

**Owner intent (USER SAID):**
- The Codex setup doesn't work, and the brain must set up test execution properly.
- No test cases exist; create them from screenshots, videos and flow descriptions.
- The loop runs change → test → fix until 100%.
- Production is never touched.

**How I understand execution will work (for confirmation):**

1. **Runner-agnostic suites.** Every suite is a plain shell command, so **Claude Code runs them inside the QA loop**. The same commands work unchanged in a Codex terminal if you later want Codex to run them. Codex is **not required** (D-T1).
2. Six layers, each tied to gates:

| Layer | Tool | Target | Runs when | Command (exact) |
|---|---|---|---|---|
| L1 Static | ESLint (M19), `php -l` PHP 7.4 (W17), grep gates for W4/W13/W14/W15, `node scripts/audit-missing-testids.js` (M12) | changed files | every change | `repos/mobile/node_modules/.bin/eslint <files>` · `php -l <file>` · `node workspace/gates/static-checks.js --changed <files>` (to be built in Phase 6) |
| L2 Unit | Jest (new pure JS utils/mappers); PHPUnit 5.7 (new service classes, W8) | code | every change touching logic | `cd repos/mobile && npx jest <path>` · `cd repos/web && vendor/bin/phpunit tests/<Name>Test.php` |
| L3 **API contract** (new) | Node script: log in per role on **staging**, call V2 endpoints used by mobile + MCP (≥ 14 MCP URIs + key mobile endpoints), assert envelope/`status`/field presence against a recorded baseline (W2, W9) | staging API | any change under `app/Api/V2`, `Helper.php`, `CompanylController`, models, routes | `node workspace/test-suites/api-contract/run.js --env staging --role "Sales Agent" [--only F15]` |
| L4 Web E2E + visual | **Playwright** (installed: `tools/`); page flows per role; screenshot comparison for the design gate | staging web | web UI / controller changes | `cd tools && PLAYWRIGHT_BROWSERS_PATH=$PWD/ms-playwright npx playwright test ../workspace/test-suites/web --grep @F08` (needs `@playwright/test`, D-T4) |
| L5 Mobile E2E + visual | **Maestro** on iOS Simulator (a **second** simulator, not the user's booted one) and Android emulator (`Pixel_7_Pro` AVD); `takeScreenshot` for design checks; existing `.maestro` flows reused | staging build of the app | mobile changes | `maestro --device <UDID> test -e LOGIN_EMAIL=… -e LOGIN_PASSWORD=… workspace/test-suites/mobile/F01-login.yaml` (needs Maestro install, D-T4) |
| L6 Manual | Checklist items that can't be automated: camera scan (F18), QR (F19), push, real store purchase, physical device | device | release candidates | `workspace/test-cases/manual-checklist.md` (not created yet) (generated from §6 format) |

3. **Credentials** are read by runners from `territool-brain/.local/test-accounts.md` and never printed or written to reports.
4. **Where automation lives:** `territool-brain/workspace/test-suites/{api-contract,web,mobile}` (outside the repos, consistent with the read-only rule) until the owner asks to commit suites into the repos (D-T3).
5. **Test cases** (human-readable) live in `territool-brain/workspace/test-cases/` in the §6 format; each automatable case links to its suite file.

---

## 3. BLOCKER and HIGH flows: does a test exist?

| Flow | Crit. | Mobile | Web | API / MCP | Coverage verdict |
|---|---|---|---|---|---|
| F01 Login & session | BLOCKER | Maestro login ios/android + validation (android); Detox login ×2 | none | none | **Partial.** Happy path + validation on mobile only; no web login, no session-expiry, **no role-gate tests (BT-1, BT-2)** |
| F02 Register & onboarding | BLOCKER | Maestro register ios/android, validation (android), full journey (android) | none | none | **Partial.** Mobile only; API validation drift (P2) untested; web register (reCAPTCHA) untested |
| F03 Subscription & paywall | BLOCKER | Paywall/payment steps inside Maestro register flows (android) | none | none | **Minimal.** Cancel/upgrade/credits top-up untested; needs staging test payment setup |
| F04 Renewal crons | BLOCKER | — | none | none | **None** |
| F15 Find & buy contacts | BLOCKER | Maestro post-register onboarding reaches Find Contacts (asserts screen IDs only; no credit assertion) | none | MCP `territool-app:qa-contacts` (contact search vs `fetchAllContacts`, local DB) | **Minimal.** Credit math (2 paid / 1 free) and insufficient-credit paths untested |
| F05 Dashboard | HIGH | Maestro login asserts `screen.dashboard`, `dashboard.welcome` | none | none | Smoke only |
| F06 AI Find Leads | HIGH | Maestro post-register onboarding (search → first route) | none | PHPUnit `ManagerFindLeadsServiceTest` (manager variant only); MCP `qa-search` | Partial (mobile happy path) |
| F08 Create route | HIGH | Maestro onboarding creates the first route | none | none | Partial; 2–400 limits (BT-5) untested |
| F09 Route detail & nav | HIGH | Maestro onboarding opens company on route | none | none | Minimal |
| F10 Mark visited | HIGH | — | n/a (intentional) | PHPUnit `ManagerDashboardTerritoryVisitTest` (manager dashboard logic only) | **None** for the field action |
| F11 Lists | HIGH | — | none | none | **None** |
| F12 Companies | HIGH | — | none | MCP `qa-search` | **None** (app) |
| F13 Contacts | HIGH | — | none | none | **None**; BT-3 credit defect untested |
| F14 Activities | HIGH | Maestro onboarding adds a company activity (note field) | none | PHPUnit scoring tests count activities | Minimal; BT-6 untested |
| F23 Manager portal | HIGH | n/a | none | PHPUnit 17 service tests (scoring, territory, find leads) | Service logic only; no UI test; 390 px nav defect |
| F24 BSA management | HIGH | n/a | none | none | **None** |

**Summary:** of 16 BLOCKER/HIGH flows, **0 are fully covered**, 8 have partial or minimal mobile E2E, and **6 have no test at all** (F04, F10, F11, F12, F13, F24). Web has no functional tests, and the V2 API contract that three clients depend on has none.

---

## 4. Regression risk map (derived from imports and call graphs)

Method:
- **Mobile:** import graph of all 234 JS/TS files resolved from `import`/`require`/lazy `import()`, closure computed per `Stack.Screen` (49 screens).
- **Web:** PHP class graph (302 classes; `use`, static calls, `new`, `app(X::class)`) with route → controller mapping (145 API + 468 web routes). Direct referrers counted separately because the transitive closure is dominated by `Helper.php`.
- **Machine-readable output:** `brain/audits/data/mobile-graph.json` (screen → file, module → screens) and `brain/audits/data/web-graph.json` (class → dependent API/web routes).
- Screen → flow mapping uses `shoebox/07-flows/flows.md`.

### 4.1 Mobile

| Tier | Module(s) | Screens depending | Flows to re-verify |
|---|---|---|---|
| **T0: full mobile regression** | `App/App.js`, `utils/API.js`, `utils/Globalfunction.js`, `utils/ConnectivityHelper.js`, `config/index.js`, `storage/realm.js` (+ `index.js`, `fcmrealm.js`), `utils/SentryHelper.js`, `PostHogHelper.js`, `posthogClient.js`, `RevenueCatService.js`, `FCMHelper.js`, `sessionExpiredEvent.js`, `utils/crashRecovery.js`, `init.js`, `styles/theme.js`, `platformText.js`, `fonts.js`, `utils/commonFunctions.ts`, `package.json`, `patches/*`, `android/app/build.gradle`, `ios/*.pbxproj` | 47–49 of 49 | **All** (F01–F32 mobile); BLOCKERs first |
| **T1: broad** | `styles/common.js` (43), `utils/Global.js` (36), `components/customheader/*` (34), `customPackage/react-native-select-dropdown/*` (24), `utils/locationAccess.js` (12), `styles/commonStyles.js` (12), `components/common/AppButton.js` (11), **`utils/contactBuyCredits.js` (11)**, `components/filterModule/*` (10), `components/customfooter/*` (9) | 9–43 | F05, F06, F08, F09, F11, F12, F13, F15; **`contactBuyCredits` → F15 BLOCKER** |
| **T2: company workspace** | **`components/customcompany/index.js`** (7,603 ln, 13 fix commits), `customcompany.styles.js`, `ActivityDateTimePickerField.js`, `common/ReportContactModal.js`, `common/SpotlightTourModal.js` | `CompanyView`, `CustomCompany`, `ViewCompany`, `WaypointDetail` | F09, F10, F12, F13, F14, **F15**, F16 |
| **T2: find-contacts pipeline** | `customcompany/FindContactsFetchModal.js`, `utils/findContactsFetch{Messages,Sources,SourceLogos,ModalController}.js`, `utils/fetchFirstContactApi.js` | 6–8 incl. `CongContact`, `bizContacts`, `BulkContactPeople`, `Contact` | **F15 BLOCKER** |
| **T2: bulk contacts** (uncommitted) | `utils/bulkContact{Fetch,Progress,Select,Session}.js`, `components/route/contact/*` | `BasicRouteDetail`, `ListsDetail`, `Contact`, `BulkContactPeople`, `BulkContactReview` | **F15**, F09, F11 |
| T2: activities | `utils/companyActivityPayload.js` | 8 (`Dashboard`, `RecentActivity`, `CalendarActivity`, company screens, `ContactsView`) | F05, F14 |
| T2: subscription | `register/subscribe.js` (+ styles) | `EditStatus`, `Register`, `SubscriptionGate`, `SubscriptionScreen` | **F02, F03**, F20 |
| T2: route/list forks | `route/create.styles.js`, `route/common/RoutePublishingLoader.js`, list/route `create`/`edit`/`select-start-end-points` | `CreateRoute`, `CreateLists`, `EditRoute`, `EditLists`, `PublishRoute`, `EditPublishRoute` | F08 **and** F11 together (M11) |
| T2: leads | `findLeads/FindLeadsCompanyDetailModal.js`, `aiFindLeads.styles.js` (7 screens incl. `Register`, `BusinessCard`) | `MultipleAIWaypoint`, `MultipleWaypoint`, … | F06, F07, F02 (onboarding), F18 |
| T3: single-screen hotspots | `findLeads/aiFindLeads.js` (24 fix), `dashboard/index.js` (14), `register/index_register_split.js` (13), `dashboard/editstatus.js` (12), `route/create.js` (12), `route/basic/index.js` (12), `company/list.js` (12), `route/index.js` (11), `route/congContact/index.js` (10), `findLeads/index.js` (10), `activeroutemap/index.js` (10), `login/index.js` (9) | 1 each | own flow + downstream: aiFindLeads → F06 → F08/F11; register → **F02/F03**; editstatus → F20/**F03**; congContact → **F15**; login → **F01** |

Heaviest screens (most transitive dependencies, so most ways to break): `WaypointDetail` 147, `CompanyView` 144, `ViewCompany` 143, `CongContact` 140, `CustomCompany` 138, `bizContacts` 122, `Contact` 118, `BulkContactPeople` 117.

### 4.2 Web / API / MCP

| Tier | Class / file | Direct referrers / routes | Flows to re-verify |
|---|---|---|---|
| **T0: full web + API regression** | `routes/api.php`, `routes/web.php`, `app/Http/Kernel.php`, middleware `authJWT` / `CheckUserRole` / `EnsureManagerRole`, `config/api.php`, `config/jwt.php`, `composer.json/lock`, `app/Exceptions/Handler.php`, `app/User.php` (141 API / 359 web routes transitively), core models `Company`, `Contacts`, `UserRoute`, `UserCompanies`, `Notes`, `UserCredit`, `Subscription` (125–141 API routes) | all | All API flows + MCP F29 + web flows |
| **T0: `app/Globals/Helper.php`** | 26 direct referrers: V2 `Auth`, `Company`, `ContactSell`, `List`, `Route`, `Webhook` controllers; web `Companyl`, `Contact`, `Home`, `List`, `Route`, `Routes`, `Salesperson`, `Businesssalesperson`, `Subscription`, `AILeadFinder`, `Auth\Register`, `Admin\Salesperson`; jobs `BuyContactsBulkJob`, `RedeemFullEnrichBulkJob`, `SendTrialNudgePush`; `Services/Manager/ManagerFindLeadsService` | ~125 API routes transitively | Effectively all; BLOCKERs F01, F02, F03, F15 first |
| T1: `app/Helpers/helpers.php` | autoloaded globally (composer `files`) | all | all web/API |
| T1: **`CompanylController.php`** | 110 web routes; **called by** V2 `CompanyController` and `ContactSellController` (buy/report contacts) and `AILeadFinderController`; dispatches `BuyContactsBulkJob`, `RedeemFullEnrichBulkJob`; renders `findleads.blade.php` | web company/contact/find-leads pages + mobile/MCP `buyContacts`, `reportcompany`, `reportcontact` | **F15 (mobile, web, MCP)**, F16, F12, F13, F06 (web), F22 |
| T1: **`RoutesController.php`** | 36 web routes; referenced by V2 `CompanyController`, web `ListController`, `RouteController`, **`SubscriptionController`**, `Admin\SubscriptionController`, `Admin\SpecialdiscountController` | route pages + subscription pages | F08, F09, F11, **F03** |
| T1: `app/Globals/Routes.php` | web `AdvancedRoute`, `List`, `Route`, `Routes`, `SimpleRoute` controllers; jobs `CreateAdvancedRoute`, `GenerateAdvancedRoutePDF`, `GenerateSampleRoutes` | route generation | F08, F09, F11, F02 (sample routes on signup) |
| T1: **`Api/V2/Controllers/WebhookController.php`** | public webhooks `apollo-webhook`, `fullenrich-webhook/*`, `revenue-subscription-update` | external callers | **F15, F03, F04** |
| T1: `Api/V2/Controllers/RouteController.php` (4,443 ln) | ~75 V2 endpoints (routes, companies, contacts, visits, notifications, credits, status) | mobile + MCP | F05, F08, F09, F10, F11, F12, F13, F20, F27, F29 |
| T1: `Api/V2/Controllers/CompanyController.php` (3,371 ln) | ~45 V2 endpoints (add/update company, notes/activities, AI leads, enrichment, buy contacts) | mobile + MCP | F06, F12, F14, **F15**, F16, F22, F29 |
| T1: `Api/V2/Controllers/AuthController.php` | login, logout, registration, preferences, user activity, QR | mobile | **F01, F02**, F05, F19 |
| T1: `SubscriptionController.php`, `CronController.php`, `UserauthController.php` (crons) | 36 + 6 + 6 web routes | web billing + crons | **F03, F04** |
| T2: jobs `BuyContactsBulkJob`, `RedeemFullEnrichBulkJob` | via `CompanylController` | queue (worker status unknown, BT-10) | **F15** |
| T2: MCP `UserMcp/Services/CustomerApiClient.php` + `Tools/*`, `FindMcp/*` | 11 referrers; dispatch ≥ 14 V2 endpoints | MCP | F29; **any V2 change** re-runs the MCP contract suite |
| T2: Manager `ManagerDashboardService`, `ManagerFindLeadsService`, `ManagerDashboardController`, `resources/manager-portal/*` → `public/js/manager-portal.js` | 36 web routes | portal | F23, F24 (PHPUnit exists for services) |
| T2: frontend `resources/views/front/route/findleads.blade.php` (44 fix), `public/js/modalScript.js` (18), `front/company/modal.blade.php` (10), `public/css/custom.css` (18), `front/route/step1`, `view_basic_route`, `front/list/step1`, `view_list`, `auth/register.blade.php`, `auth/freetrial.blade.php` | web pages | browser | web F06, F15, F13, F08, F09, F11, **F02** (+ visual regression for all Blade pages when `custom.css` changes) |

### 4.3 Gate rules derived from the map (for Phase 6)

1. A change touching any **T0** module runs the **full BLOCKER suite on both affected platforms** plus the API contract suite.
2. A change touching a **T1** module runs every flow in its row plus all BLOCKER smoke tests.
3. Any change under `app/Api/V2/**`, `Helper.php`, `CompanylController.php` or models runs the **API contract suite for mobile and MCP consumers** (W9).
4. A change to one member of a fork family runs the flows of **all** members (M11, W20).
5. Pre-existing defects in `fragile.md` §6 are **known gaps**. The gate fails only if a change makes them worse or touches them without fixing them as instructed (D-T6).

---

## 5. `fragile.md` status

`shoebox/09-known-issues/fragile.md` was **drafted** from verified evidence:
- 14 hotspot areas with fix-commit counts.
- 9 dated regressions, 4 of which reached production per their commit messages.
- 6 oversized modules.
- Owner-approved debt and intentional behaviour.
- 17 verified open defects with file:line.

Owner input needed: "caught before release?", modules avoided, incidents not in git.

---

## 6. PROPOSED test-case format (no format existed; USER SAID create them)

**Files:**
- `workspace/test-cases/<Fxx>-<flow-slug>.md` (readable table).
- A matching `<Fxx>-<flow-slug>.csv` with the same columns, importable into Google Sheets, Jira or TestRail.
- One file per flow.

| Column | Meaning / allowed values |
|---|---|
| `ID` | `TC-F01-001` (flow + sequence) |
| `Flow` | `F01`… from `flows.md` |
| `Title` | one line, starts with the role + action |
| `Platform` | `ios` · `android` · `web` · `portal` · `api` · `mcp` |
| `Role` | Sales Agent · Business Sales Agent · Business Agent · Admin · Public |
| `Priority` | `P0` (BLOCKER) · `P1` (HIGH) · `P2` (MEDIUM) · `P3` (LOW), inherited from flow criticality |
| `Type` | `happy` · `validation` · `permission` · `negative` · `offline` · `edge-data` · `regression` · `parity` · `visual` · `security` |
| `Preconditions` | account state, data, feature flags |
| `Test data` | reference to `.local` account role / QA data prefix (never raw passwords) |
| `Steps` | numbered, one action per step, using on-screen labels |
| `Expected result` | observable outcome (UI text, API field, credit change) |
| `Rule / target refs` | e.g. `M3`, `W2`, `BT-1`, `P4`, `D-DS7` |
| `Known gap` | `BT-n` / `fragile §6 ID` if today's behaviour differs from target, else blank |
| `Evidence` | screenshot filename / API response field |
| `Automation` | `maestro:workspace/test-suites/mobile/F01-login.yaml` · `playwright:…` · `api:…` · `phpunit:…` · `manual` |
| `Status` | `Not run` · `Pass` · `Fail` · `Blocked` · `Known gap` |
| `Last run` | date + build (e.g. `2026-09-15 · iOS 42.31 staging`) |

**Example rows (F01 Login):**

| ID | Title | Platform | Role | Priority | Type | Preconditions | Steps | Expected result | Refs | Known gap | Automation |
|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-F01-001 | Sales Agent logs in with valid credentials | ios | Sales Agent | P0 | happy | Logged out; staging build | 1. Open app 2. Enter email 3. Enter password 4. Tap **Login** | Dashboard shows "Welcome"; credits pill visible | M3 | — | maestro: F01-login.yaml |
| TC-F01-002 | Invalid password shows error and stays on Login | android | Sales Agent | P0 | negative | Logged out | 1. Enter valid email 2. Enter wrong password 3. Tap **Login** | Toast "Please provide valid login details." (`V2/AuthController.php:121-124`); still on Login | W2 | — | maestro: F01-login-validation.yaml |
| TC-F01-003 | Admin cannot log in to mobile | api | Admin | P0 | permission | Admin account | 1. POST `login` with Admin credentials | `status` 0 with a not-authorized message | BT-1 | **BT-1** (API admits Admin today) | api: F01-login-roles.js |
| TC-F01-004 | Business Sales Agent with lapsed manager plan is blocked on mobile | api | Business Sales Agent | P0 | permission | Manager subscription disabled (staging) | 1. POST `login` | `status` 0, message matching web (`auth.expire`) | BT-2 | **BT-2** | api: F01-login-roles.js |
| TC-F01-005 | Business Agent logs in on web and lands on manager portal | web | Business Agent | P0 | happy | Logged out | 1. Open `/login` 2. Enter credentials 3. Click **Login** | URL `/manager/dashboard`; "Manager's Dashboard" heading | — | — | playwright: F01-login.spec.js |

Coverage checklist the test skill must satisfy per flow: **happy path**, **validation** (every required field and format, per platform), **permissions per role**, **offline / network failure**, **edge data** (empty, long text, special characters, max counts such as 400 stops), **parity** (same rule on mobile/web/API), **visual** (tokens per `04-design.md` §7).

---

## 7. PROPOSED staging test-data & safety policy

1. **Environment:** staging only (`staging.territool.com`, local MAMP for unit/DB-free tests). Runners abort if the host isn't staging (as `tools/capture-web.js` does).
2. **Accounts:** `.local/test-accounts.md` roles only; never the Maestro "live" account.
3. **Read-only by default.** Suites that create data use the prefix **`QA-AUTO-YYYYMMDD-`** for names (companies, lists, routes, contacts, activities) and delete what they create in teardown.
4. **Paid or credit-spending actions** (buy contacts, save AI leads, subscription purchase/upgrade/cancel, CRM/MCP sync, invites/emails) run **only** once the approved staging test-payment setup exists, and are tagged `@spends-credits` so they can be excluded.
5. **Registration flows** create a new staging user per run (`maestro.stage.<timestamp>@yopmail.com`), so they run on demand only, not in every loop iteration.
6. **Devices:** never drive the user's booted simulator; use a dedicated second simulator and emulator.

---

## 8. DECISIONS NEEDED (owner)

| # | Decision | Options | Recommendation |
|---|---|---|---|
| **D-T1** | Test runner | (a) Claude Code runs runner-agnostic suites (same commands usable in Codex); (b) Codex must be the runner | **(a)** |
| **D-T2** | Test-case format | §6 (Markdown + CSV per flow) or your own format | **§6** |
| **D-T3** | Where automated suites live | (a) `territool-brain/workspace/test-suites/` now, commit to repos later on request; (b) inside repos now (breaks read-only) | **(a)** |
| **D-T4** | Installs | (a) install **Maestro** CLI (`~/.maestro`) and add **`@playwright/test`** to `territool-brain/tools`; (b) defer | **(a)** |
| **D-T5** | Staging data policy | §7 as written | **approve §7** |
| **D-T6** | Known-gap handling in the QA verdict | (a) pre-existing defects in `fragile.md` §6 / BT-n don't fail a change unless it touches or worsens them; (b) any failing test fails the change | **(a)**, matches "don't touch old code" |
| **D-T7** | Platforms for mobile E2E | (a) iOS simulator first, Android once a debug APK build is allowed (writes `repos/mobile/android/app/build`, gitignored); (b) both now | **(a)** |

## 9. QUESTIONS (owner)

- **Q-T1** Are the Maestro and Detox flows run today (who, when, before each release)? Is there a filled manual QA sheet or `qa-screenshots/` somewhere outside the repo?
- **Q-T2** Keep Detox, or treat Maestro as the only mobile E2E tool for new tests? (Recommendation: Maestro only for new tests; leave Detox files untouched.)
- **Q-T3** Admin login for Admin-role tests (F01 BT-1, F25).
- **Q-T4** Please review `shoebox/09-known-issues/fragile.md` §2 ("caught before release?"), §3 and §7.
- **Q-T5** Does staging have store sandbox / RevenueCat test configuration for the register-payment Maestro flows, or is that part of the planned test-payment setup?

---

## 10. APPROVAL RECORD (USER SAID "approve for phase 6", 2026-09-15)

- **D-T1–D-T7 approved with the recommended options:**
  - D-T1: Claude Code runs runner-agnostic suites; Codex optional.
  - D-T2: §6 test-case format.
  - D-T3: suites in `territool-brain/workspace/test-suites/`.
  - D-T4: install Maestro + `@playwright/test` when first needed.
  - D-T5: §7 staging data policy.
  - D-T6: known gaps don't fail a change unless touched or worsened.
  - D-T7: iOS simulator first, Android after a debug APK build is allowed.
- §4 risk map and §4.3 gate rules adopted for Phase 6.
- **Still open:** Q-T1 … Q-T5 and the `fragile.md` owner review (§2 caught-before-release, §3, §7).

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (222)

**Documents (96):** [[workspace/test-suites/api-contract/README|API contract suite (layer L3)]] · [[brain/context/architecture|Architecture: how Territool is built, end to end]] · [[brain/audits/04-design|Audit 4 – design review]] · [[_code/brain/brain/gates/scripts/static-checks.js|Automatic code checker]] · [[brain/gates/test-gate|Checklist – tests]] · [[CLAUDE-CODE-BOOTSTRAP|Claude Code Bootstrap Prompt]] · [[brain/context/design-assets|Design files & asset rules]] · [[shoebox/09-known-issues/fragile|Known issues draft]] · [[brain/context/known-fragile|Known problems & risky areas]] · [[brain/context/conventions-mobile|Mobile app coding rules]] · [[shoebox/07-flows/flows|Original flow descriptions]] · [[brain/context/flows|Product features list]] · [[brain/memory/entries/question/20260917-e73edb-q-t1-are-the-maestro-and-detox-flows-actually-ru|Q-T1 — Are the Maestro and Detox flows actually run today — by whom, when, before each release? Is there a filled ma…]] · [[brain/memory/entries/question/20260917-ed8b53-q-t2-keep-detox-or-treat-maestro-as-the-only-mob|Q-T2 — Keep Detox, or treat Maestro as the only mobile E2E tool?]] · [[brain/memory/entries/question/20260917-3cdb21-q-t3-admin-login-for-admin-role-tests-f01-bt-1-f|Q-T3 — Admin login for Admin-role tests (F01 BT-1, F25). Partly answered 2026-09-16: a read-only Admin account was p…]] · [[brain/memory/entries/question/20260917-75acdd-q-t4-review-shoebox-09-known-issues-fragile-md-2|Q-T4 — Review shoebox/09-known-issues/fragile.md §2 ("caught before release?"), §3 and §7.]] · [[brain/memory/entries/question/20260917-903338-q-t5-does-staging-have-a-store-sandbox-revenueca|Q-T5 — Does staging have a store sandbox / RevenueCat test configuration for the register-payment flows, or is that…]] · [[brain/context/open-questions|Questions put to the owner, and what came back]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/conventions-shared|Rules for all code]] · [[brain/skills/territool-test/SKILL|Skill – testing]] · [[brain/context/stack|Tech setup & environments]] · [[workspace/test-cases/F01-login-extended|Test cases — F01 Login (extended edge data) (P0)]] · [[workspace/test-cases/F01-login-parity|Test cases — F01 Login (mobile API ↔ web parity) (P0)]] · [[workspace/test-cases/F01-login|Test cases — F01 Login & session (BLOCKER, P0)]] · [[workspace/test-cases/F01-login-visual|Test cases — F01 Login page (visual, design-gate §B) (P0)]] · [[workspace/test-cases/F01-mobile-login-main-nav|Test cases — F01/F05 mobile login and main navigation (P0/P1)]] · [[workspace/test-cases/F02-registration-extended|Test cases — F02 Registration (extended, no account is ever created) (P0)]] · [[workspace/test-cases/F02-registration-validation|Test cases — F02 Registration (validation-only contract) (P0)]] · [[workspace/test-cases/F02-register-visual|Test cases — F02 Registration page (visual, design-gate §B) (P0)]] · [[workspace/test-cases/F03-subscription-extended|Test cases — F03 Subscription / credits (extended read contract) (P0)]] · [[workspace/test-cases/F03-subscription-visual|Test cases — F03 Subscription page (visual, design-gate §B) (P0)]] · [[workspace/test-cases/F03-subscription-read|Test cases — F03 Subscription state (read contracts; purchase waived) (P0)]] · [[workspace/test-cases/F05-dashboard-extended|Test cases — F05 Dashboard (extended read contract) (P1)]] · [[workspace/test-cases/F05-dashboard-visual|Test cases — F05 Dashboard (visual, design-gate §B) (P1)]] · [[workspace/test-cases/F05-dashboard-read|Test cases — F05 Dashboard, activity feed (read contracts) (P1)]] · [[workspace/test-cases/F06-ai-leads-extended|Test cases — F06 AI Find Leads (extended read contract) (P1)]] · [[workspace/test-cases/F06-ai-leads-read|Test cases — F06 AI Find Leads (read contract; search and save waived) (P1)]] · [[workspace/test-cases/F06-findleads-visual|Test cases — F06 AI Find Leads page (visual, design-gate §B) (P1)]] · [[workspace/test-cases/F07-yelp-gate|Test cases — F07 Places / Yelp leads (auth gate; provider never called) (P2)]] · [[workspace/test-cases/F08-routes-parity|Test cases — F08 Routes (mobile API ↔ web parity) (P1)]] · [[workspace/test-cases/F08-routes-extended|Test cases — F08 Routes library (extended read contract) (P1)]] · [[workspace/test-cases/F08-routes-read|Test cases — F08 Routes library (read contract) (P1)]] · [[workspace/test-cases/F08-routes-visual|Test cases — F08 Routes library (visual, design-gate §B) (P1)]] · [[workspace/test-cases/F09-route-detail-extended|Test cases — F09 Route detail (extended read contract) (P1)]] · [[workspace/test-cases/F09-route-detail-read|Test cases — F09 Route detail (read contract + ownership probe) (P1)]] · [[workspace/test-cases/F10-visits-read|Test cases — F10 Visit log (read contract + ownership probe) (P1)]] · [[workspace/test-cases/F10-visits-extended|Test cases — F10 Visits (extended read contract) (P1)]] · [[workspace/test-cases/F11-lists-extended|Test cases — F11 Lists (extended read contract) (P1)]] · [[workspace/test-cases/F11-lists-parity|Test cases — F11 Lists (mobile API ↔ web parity) (P1)]] · [[workspace/test-cases/F11-lists-read|Test cases — F11 Lists (read contract) (P1)]] · [[workspace/test-cases/F11-lists-visual|Test cases — F11 Lists library (visual, design-gate §B) (P1)]] · [[workspace/test-cases/F12-companies-visual|Test cases — F12 Address Book (visual, design-gate §B) (P1)]] · [[workspace/test-cases/F12-companies-extended|Test cases — F12 Companies (extended read contract) (P1)]] · [[workspace/test-cases/F12-companies-read|Test cases — F12 Companies / Address Book (read contract) (P1)]] · [[workspace/test-cases/F13-contacts-extended|Test cases — F13 Contacts (extended read contract) (P1)]] · [[workspace/test-cases/F13-contacts-read|Test cases — F13 Contacts (read contract) (P1)]] · [[workspace/test-cases/F13-contacts-visual|Test cases — F13 Contacts (visual, design-gate §B) (P1)]] · [[workspace/test-cases/F14-activities-read|Test cases — F14 Activities (read contracts + ownership probe) (P1)]] · [[workspace/test-cases/F14-activities-extended|Test cases — F14 Activities / notes (extended read contract) (P1)]] · [[workspace/test-cases/F15-contacts-gate|Test cases — F15 Find contacts (auth gate; provider never called) (P0)]] · [[workspace/test-cases/F16-report-extended|Test cases — F16 Report company/contact (extended, nothing is submitted) (P2)]] · [[workspace/test-cases/F16-report-validation|Test cases — F16 Report company/contact (validation-only contract) (P2)]] · [[workspace/test-cases/F17-share-gate|Test cases — F17 Share route/list (auth gate; nothing sent) (P2)]] · [[workspace/test-cases/F18-business-card-server|Test cases — F18 Scan business card (server side; nothing created) (P2)]] · [[workspace/test-cases/F19-qr-gate|Test cases — F19 QR route import (auth gate and validation; no route copied) (P2)]] · [[workspace/test-cases/F20-settings-visual|Test cases — F20 Settings (visual, design-gate §B) (P2)]] · [[workspace/test-cases/F20-settings-extended|Test cases — F20 Settings / status tags (extended read contract) (P2)]] · [[workspace/test-cases/F20-settings-read|Test cases — F20 Settings / status tags (read contracts) (P2)]] · [[workspace/test-cases/F21-crm-gate|Test cases — F21 CRM sync (auth gate; HubSpot never called) (P2)]] · [[workspace/test-cases/F22-upload-gate|Test cases — F22 Bulk CSV upload (auth gate) (P2)]] · [[workspace/test-cases/F23-manager-portal-extended|Test cases — F23 Manager portal (extended read contract) (P1)]] · [[workspace/test-cases/F23-manager-portal-read|Test cases — F23 Manager portal API and role gate (read contracts) (P1)]] · [[workspace/test-cases/F23-manager-dashboard-visual|Test cases — F23 Manager portal dashboard (visual, design-gate §B) (P1)]] · [[workspace/test-cases/F24-manager-salespeople-visual|Test cases — F24 Manager portal Salespeople (visual, design-gate §B) (P1)]] · [[workspace/test-cases/F24-rep-management-extended|Test cases — F24 Rep management (extended read contract) (P1)]] · [[workspace/test-cases/F24-rep-management-read|Test cases — F24 Rep management (read contracts) (P1)]] · [[workspace/test-cases/F25-admin-hq-gate|Test cases — F25 Admin HQ (role gate) (P2)]] · [[workspace/test-cases/F25-hq-login-visual|Test cases — F25 Admin HQ login page (visual, design-gate §B) (P2)]] · [[workspace/test-cases/F26-support-extended|Test cases — F26 Support tickets (extended read contract) (P3)]] · [[workspace/test-cases/F26-support-parity|Test cases — F26 Support tickets (mobile API ↔ web parity) (P3)]] · [[workspace/test-cases/F26-support-read|Test cases — F26 Support tickets (read contracts) (P3)]] · [[workspace/test-cases/F26-support-visual|Test cases — F26 Support tickets (visual, design-gate §B) (P3)]] · [[workspace/test-cases/F27-notifications-extended|Test cases — F27 Notifications (extended read contract) (P3)]] · [[workspace/test-cases/F27-notifications-read|Test cases — F27 Notifications (read contract) (P3)]] · [[workspace/test-cases/F27-notification-page-visual|Test cases — F27 Push notification page (visual, design-gate §B) (P3)]] · [[workspace/test-cases/F28-referral-validation|Test cases — F28 Referral invite (validation-only contract) (P3)]] · [[workspace/test-cases/F28-referral-extended|Test cases — F28 Referral invites (extended, nothing is sent) (P3)]] · [[workspace/test-cases/F29-customer-mcp-gate|Test cases — F29 Customer MCP connectors (auth gate, staging) (P2)]] · [[workspace/test-cases/F30-admin-mcp-gate|Test cases — F30 Admin MCP (auth gate, staging) (P3)]] · [[workspace/test-cases/F31-mcp-client-gate|Test cases — F31 MCP client connections (auth gate) (P2)]] · [[workspace/test-cases/F31-mcp-connections-read|Test cases — F31 MCP connections (read contract) (P2)]] · [[_code/brain/tools/capture-web.js|Tool – take web screenshots]] · [[brain/context/tooling|Tooling: which agent runs the brain, and what each one needs]] · [[brain/context/UPCOMING_IMPROVEMENTS|Upcoming improvements: application findings not fixed during the brain work]] · [[brain/context/conventions-web|Web app coding rules]]

**Product features (32):** [[_id/F14|Activities / notes / log meetings]] · [[_id/F25|Admin HQ]] · [[_id/F30|Admin MCP]] · [[_id/F06|AI Find Leads → save leads]] · [[_id/F32|App launch, permissions, crash, offline]] · [[_id/F22|Bulk CSV upload]] · [[_id/F24|Business Sales Agent management]] · [[_id/F12|Companies (Address Book)]] · [[_id/F13|Contacts]] · [[_id/F08|Create route]] · [[_id/F21|CRM sync]] · [[_id/F29|Customer MCP connectors]] · [[_id/F05|Dashboard, activity feed, calendar]] · [[_id/F15|Find & buy contacts]] · [[_id/F11|Lists]] · [[_id/F01|Login & session]] · [[_id/F23|Manager portal]] · [[_id/F10|Mark visited & visit log]] · [[_id/F31|MCP client connections & chat]] · [[_id/F27|Notifications & push]] · [[_id/F07|Places / Yelp leads]] · [[_id/F19|QR route import]] · [[_id/F28|Referral invites]] · [[_id/F02|Registration & onboarding]] · [[_id/F16|Report company/contact]] · [[_id/F09|Route detail & navigation]] · [[_id/F18|Scan business card]] · [[_id/F20|Settings / status tags / stages]] · [[_id/F17|Share route/list]] · [[_id/F03|Subscription / paywall / upgrade / cancel / credits…]] · [[_id/F04|Subscription & credit renewal]] · [[_id/F26|Support tickets]]

**Coding rules (13):** [[_id/W20|AI connectors reuse the API]] · [[_id/W9|API changes only add, never remove]] · [[_id/W2|API status is 1 or 0]] · [[_id/M11|Fix every copy of duplicated code]] · [[_id/M12|Meaningful test IDs]] · [[_id/W4|No database queries built from text]] · [[_id/W14|No debug output]] · [[_id/M19|No new code-check errors]] · [[_id/W13|No secrets in logs]] · [[_id/W15|Settings only in config]] · [[_id/M3|Success only when status is 1]] · [[_id/W8|Tests for new services]] · [[_id/W17|Works on PHP 7.4]]

**Owner decisions (19):** [[_id/BT-6|Activity needs type, date & note]] · [[_id/BT-1|Block Admin on the mobile app]] · [[_id/BT-10|Check the background job worker]] · [[_id/D-T1|Claude runs the tests]] · [[_id/BT-3|Hand-added contacts are free]] · [[_id/D-T4|Install test tools when needed]] · [[_id/D-T6|Known problems don't fail a change]] · [[_id/Q-T3|Question: Admin login for Admin tests]] · [[_id/Q-T1|Question: are the automated app tests run today?]] · [[_id/Q-T5|Question: does staging have test payments?]] · [[_id/Q-T2|Question: keep Detox or only Maestro?]] · [[_id/Q-T4|Question: review the known-issues draft]] · [[_id/BT-5|Routes have 2–400 stops]] · [[_id/BT-2|Sales reps follow their manager's plan]] · [[_id/D-T5|Staging test data rules]] · [[_id/D-DS7|Standard date formats]] · [[_id/D-T2|Test case format]] · [[_id/D-T7|Test on iPhone first]] · [[_id/D-T3|Where test suites live]]

**Code files (62):** [[_code/mobile/App/components/activeroutemap/index.js|activeroutemap/index.js]] · [[_code/mobile/App/components/customcompany/ActivityDateTimePickerField.js|ActivityDateTimePickerField.js]] · [[_code/mobile/App/components/findLeads/aiFindLeads.js|aiFindLeads.js]] · [[_code/mobile/App/components/findLeads/aiFindLeads.styles.js|aiFindLeads.styles.js]] · [[_code/mobile/App/utils/API.js|API.js]] · [[_code/mobile/App/components/common/AppButton.js|AppButton.js]] · [[_code/web/app/Api/V2/Controllers/AuthController.php|AuthController]] · [[_code/mobile/App/components/route/basic/index.js|basic/index.js]] · [[_code/mobile/App/styles/common.js|common.js]] · [[_code/mobile/App/utils/commonFunctions.ts|commonFunctions.ts]] · [[_code/mobile/App/styles/commonStyles.js|commonStyles.js]] · [[_code/mobile/App/utils/companyActivityPayload.js|companyActivityPayload.js]] · [[_code/web/app/Api/V2/Controllers/CompanyController.php|CompanyController]] · [[_code/web/app/Http/Controllers/CompanylController.php|CompanylController]] · [[_code/mobile/App/config/index.js|config/index.js]] · [[_code/mobile/App/components/route/congContact/index.js|congContact/index.js]] · [[_code/mobile/App/utils/ConnectivityHelper.js|ConnectivityHelper.js]] · [[_code/mobile/App/utils/contactBuyCredits.js|contactBuyCredits.js]] · [[_code/mobile/App/utils/crashRecovery.js|crashRecovery.js]] · [[_code/mobile/App/components/route/create.js|create.js]] · [[_code/mobile/App/components/route/create.styles.js|create.styles.js]] · [[_code/web/app/Http/Controllers/CronController.php|CronController]] · [[_code/mobile/App/components/customcompany/customcompany.styles.js|customcompany.styles.js]] · [[_code/mobile/App/components/customcompany/index.js|customcompany/index.js]] · [[_code/web/app/UserMcp/Services/CustomerApiClient.php|CustomerApiClient]] · [[_code/mobile/App/components/dashboard/index.js|dashboard/index.js]] · [[_code/mobile/App/components/dashboard/editstatus.js|editstatus.js]] · [[_code/mobile/App/utils/FCMHelper.js|FCMHelper.js]] · [[_code/mobile/App/storage/fcmrealm.js|fcmrealm.js]] · [[_code/mobile/App/utils/fetchFirstContactApi.js|fetchFirstContactApi.js]] · [[_code/mobile/App/components/customcompany/FindContactsFetchModal.js|FindContactsFetchModal.js]] · [[_code/mobile/App/components/findLeads/index.js|findLeads/index.js]] · [[_code/mobile/App/components/findLeads/FindLeadsCompanyDetailModal.js|FindLeadsCompanyDetailModal.js]] · [[_code/mobile/App/styles/fonts.js|fonts.js]] · [[_code/mobile/App/utils/Global.js|Global.js]] · [[_code/mobile/App/utils/Globalfunction.js|Globalfunction.js]] · [[_code/web/app/Globals/Helper.php|Helper]] · [[_code/web/app/Helpers/helpers.php|helpers]] · [[_code/mobile/App/components/register/index_register_split.js|index_register_split.js]] · [[_code/mobile/App/components/company/list.js|list.js]] · [[_code/mobile/App/utils/locationAccess.js|locationAccess.js]] · [[_code/mobile/App/components/login/index.js|login/index.js]] · [[_code/mobile/App/styles/platformText.js|platformText.js]] · [[_code/mobile/App/utils/posthogClient.js|posthogClient.js]] · [[_code/mobile/App/utils/PostHogHelper.js|PostHogHelper.js]] · [[_code/mobile/App/storage/realm.js|realm.js]] · [[_code/mobile/App/components/common/ReportContactModal.js|ReportContactModal.js]] · [[_code/mobile/App/utils/RevenueCatService.js|RevenueCatService.js]] · [[_code/mobile/App/components/route/index.js|route/index.js]] · [[_code/web/app/Api/V2/Controllers/RouteController.php|RouteController]] · [[_code/mobile/App/components/route/common/RoutePublishingLoader.js|RoutePublishingLoader.js]] · [[_code/web/app/Globals/Routes.php|Routes]] · [[_code/web/app/Http/Controllers/RoutesController.php|RoutesController]] · [[_code/mobile/App/utils/SentryHelper.js|SentryHelper.js]] · [[_code/mobile/App/sessionExpiredEvent.js|sessionExpiredEvent.js]] · [[_code/mobile/App/components/common/SpotlightTourModal.js|SpotlightTourModal.js]] · [[_code/mobile/App/components/register/subscribe.js|subscribe.js]] · [[_code/web/app/Http/Controllers/SubscriptionController.php|SubscriptionController]] · [[_code/mobile/App/styles/theme.js|theme.js]] · [[_code/web/app/User.php|User]] · [[_code/web/app/Http/Controllers/UserauthController.php|UserauthController]] · [[_code/web/app/Api/V2/Controllers/WebhookController.php|WebhookController]]

%% brain-links:end %%
