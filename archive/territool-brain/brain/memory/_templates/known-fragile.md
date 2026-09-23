---
area: context
tags: [brain/context]
ref: "Known problems & risky areas"
---

# Territool — Known Fragile Areas, Risk Tiers, Known Gaps

> [!info] Rendered from `brain/memory/` — edit the entries, not this table
> Each ID row below is stored verbatim in its memory entry (`node tools/memory.js context known-fragile`). Prose outside the tables lives in `brain/memory/_templates/known-fragile.md`. Rebuild: `node tools/memory.js render`.

Sources:
- `shoebox/09-known-issues/fragile.md` (**DRAFT, owner review pending**: §2 "caught before release?", §3, §7)
- `brain/audits/05-testing.md` §4 (graphs: `brain/audits/data/*.json`)
- `brain/audits/01…04`
- `brain/audits/03-parity.md` §7 (BT targets)

Used by `territool-router` (impact) and `territool-qa` (regression selection, known-gap classification).

## 1. How to compute impact for a change

1. List changed files (`git -C repos/<repo> diff --name-only <base>` + untracked).
2. **Mobile:** look each file up in `brain/audits/data/mobile-graph.json` → `moduleToScreens[<file>]` → screens → flows via `brain/context/flows.md` "Mobile screens".
3. **Web:** look each class up in `brain/audits/data/web-graph.json` → dependent `api` / `web` route URIs → flows via `flows.md` entry points. Also apply §3 direct-referrer rows (the transitive graph is dominated by `Helper.php`).
4. Apply the tier rules in §4. Regenerate graphs if files were added or moved (commands in `conventions-mobile.md` §7 / `conventions-web.md` §7).

## 2. Mobile risk tiers

| Tier | Modules | Re-verify |
|---|---|---|
| **T0** (47–49 of 49 screens) | `App/App.js`, `utils/API.js`, `utils/Globalfunction.js`, `utils/ConnectivityHelper.js`, `config/index.js`, `storage/{realm,index,fcmrealm}.js`, `utils/{SentryHelper,PostHogHelper,posthogClient,RevenueCatService,FCMHelper,crashRecovery,sentrySanitize,commonFunctions.ts}`, `sessionExpiredEvent.js`, `init.js`, `styles/{theme,platformText,fonts}.js`, `styles/tokens.js` (when created), `package.json`, `patches/*`, `android/app/build.gradle`, `ios/**/project.pbxproj` | **All mobile BLOCKERs (F01, F02, F03, F15) + smoke of every HIGH flow** |
| **T1** (9–43 screens) | `styles/common.js` (43), `utils/Global.js` (36), `components/customheader/*` (34), `customPackage/react-native-select-dropdown/*` (24), `utils/locationAccess.js` (12), `styles/commonStyles.js` (12), `components/common/AppButton.js` (11), **`utils/contactBuyCredits.js` (11, F15)**, `components/filterModule/*` (10), `components/customfooter/*` (9) | all flows whose screens import it (graph) + BLOCKER smoke |
| **T2: company workspace** | `customcompany/index.js` (7,603 ln; 13 fix commits), `customcompany.styles.js`, `ActivityDateTimePickerField.js`, `common/ReportContactModal.js`, `common/SpotlightTourModal.js` | F09, F10, F12, F13, F14, **F15**, F16 |
| **T2: find contacts** | `customcompany/FindContactsFetchModal.js`, `utils/findContactsFetch*.js`, `utils/fetchFirstContactApi.js` | **F15** |
| **T2: bulk contacts** | `utils/bulkContact*.js`, `components/route/contact/*` | **F15**, F09, F11 |
| T2: activities | `utils/companyActivityPayload.js` | F05, F14 |
| T2: subscription | `register/subscribe.js` (+ styles) | **F02, F03**, F20 |
| T2: route/list forks | `route/create.styles.js`, `route/common/RoutePublishingLoader.js`, list/route create/edit/select-start-end-points | F08 **and** F11 |
| T2: leads | `findLeads/FindLeadsCompanyDetailModal.js`, `findLeads/aiFindLeads.styles.js` | F06, F07, F02, F18 |
| **T3 hotspots** (1 screen each) | `findLeads/aiFindLeads.js` (24 fix), `dashboard/index.js` (14), `register/index_register_split.js` (13), `dashboard/editstatus.js` (12), `route/create.js` (12), `route/basic/index.js` (12), `company/list.js` (12), `route/index.js` (11), `route/congContact/index.js` (10), `findLeads/index.js` (10), `activeroutemap/index.js` (10), `login/index.js` (9) | own flow + downstream: aiFindLeads → F06 → F08/F11; register → **F02/F03**; editstatus → F20/**F03**; congContact → **F15**; login → **F01** |

## 3. Web / API / MCP risk tiers

| Tier | Class / file | Re-verify |
|---|---|---|
| **T0** | `routes/api.php`, `routes/web.php`, `app/Http/Kernel.php`, `app/Http/Middleware/{authJWT,CheckUserRole,EnsureManagerRole}.php`, `config/{api,jwt,auth}.php`, `composer.json/lock`, `app/Exceptions/Handler.php`, `app/User.php`, models `Company`, `Contacts`, `UserRoute`, `UserCompanies`, `Notes`, `UserCredit`, `Subscription` | **All BLOCKERs on web + mobile (via API) + API contract suite (mobile + MCP)** |
| **T0: `app/Globals/Helper.php`** | 26 direct referrers (6 V2 controllers, 13 web controllers, bulk jobs, `ManagerFindLeadsService`) | same as T0 |
| T1 | `app/Helpers/helpers.php` (global autoload) | same as T0 |
| **T1** | **`Http/Controllers/CompanylController.php`**: 110 web routes **+ mobile/MCP buy/report contacts** + bulk jobs + `findleads.blade.php` | **F15 (all clients)**, F16, F12, F13, web F06, F22 |
| **T1** | **`Http/Controllers/RoutesController.php`**: referenced by `SubscriptionController`, `Admin\Subscription`, `Admin\Specialdiscount`, `V2/CompanyController`, `List`, `Route` | F08, F09, F11, **F03** |
| T1 | `app/Globals/Routes.php` (route controllers + `CreateAdvancedRoute`, `GenerateAdvancedRoutePDF`, `GenerateSampleRoutes` jobs) | F08, F09, F11, F02 |
| **T1** | **`Api/V2/Controllers/WebhookController.php`** (Apollo, FullEnrich, RevenueCat) | **F15, F03, F04** |
| T1 | `Api/V2/Controllers/RouteController.php` | F05, F08–F13, F20, F27, F29 + API contract |
| T1 | `Api/V2/Controllers/CompanyController.php` | F06, F12, F14, **F15**, F16, F22, F29 + API contract |
| T1 | `Api/V2/Controllers/AuthController.php` | **F01, F02**, F05, F19 + API contract |
| T1 | `Http/Controllers/{SubscriptionController,CronController,UserauthController}.php` | **F03, F04** |
| T2 | `app/Jobs/{BuyContactsBulkJob,RedeemFullEnrichBulkJob}.php` | **F15** (needs queue worker, BT-10) |
| T2 | `app/UserMcp/**`, `app/FindMcp/**` (`CustomerApiClient`, `Tools/*`) | F29 + any V2 endpoint it dispatches |
| T2 | `app/Services/Manager/*`, `Manager/ManagerDashboardController.php`, `resources/manager-portal/*`, `public/js/manager-portal.js` | F23, F24 (+ PHPUnit manager tests) |
| T2 | `resources/views/front/route/findleads.blade.php` (44 fix), `public/js/modalScript.js` (18), `front/company/modal.blade.php`, `public/css/custom.css` (visual all Blade), `front/route/{step1,view_basic_route}.blade.php`, `front/list/{step1,view_list}.blade.php`, `auth/{register,freetrial}.blade.php` | web F06, F15, F13, F08, F09, F11, **F02** |

## 4. Gate rules (approved, `05-testing.md` §4.3)

1. **T0** touched → full BLOCKER suite on each affected platform + API contract suite.
2. **T1** touched → every flow in its row + all BLOCKER smoke tests.
3. Any change under `app/Api/V2/**`, `Helper.php`, `CompanylController.php` or core models → **API contract suite for mobile + MCP consumers**.
4. One member of a fork family changed → run the flows of **all** members (`conventions-mobile.md` §5, `conventions-web.md` §5).
5. **Known gaps** (§5) don't fail a change unless it touches them, worsens them, or the task is to fix them (D-T6).

## 5. Known gaps (pre-existing; classify, don't fail, unless touched or worsened)

| ID | Gap | Evidence | Flow |
|---|---|---|---|
<!-- memory-row: KG-C2 -->
<!-- memory-row: KG-H22 -->
<!-- memory-row: KG-H23 -->
<!-- memory-row: KG-H24 -->
<!-- memory-row: KG-H31 -->
<!-- memory-row: KG-H32 -->
<!-- memory-row: KG-UNDEF -->
<!-- memory-row: KG-SEC1 -->
<!-- memory-row: KG-BT1 -->
<!-- memory-row: KG-BT2 -->
<!-- memory-row: KG-BT3 -->
<!-- memory-row: KG-BT4 -->
<!-- memory-row: KG-BT5 -->
<!-- memory-row: KG-BT6 -->
<!-- memory-row: KG-BT7 -->
<!-- memory-row: KG-BT9 -->
<!-- memory-row: KG-BT11 -->
<!-- memory-row: KG-P2 -->
<!-- memory-row: KG-P3 -->
<!-- memory-row: KG-S10 -->
<!-- memory-row: KG-UI1 -->
<!-- memory-row: KG-UI2 -->
<!-- memory-row: KG-UI3 -->
<!-- memory-row: KG-UI4 -->
<!-- memory-row: KG-SEC2 -->
<!-- memory-row: KG-Q1 -->
<!-- memory-row: KG-REF1 -->
<!-- memory-row: KG-REF2 -->
<!-- memory-row: KG-REF3 -->
<!-- memory-row: KG-UI5 -->
<!-- memory-row: KG-NAV1 -->
<!-- memory-row: KG-UI6 -->
<!-- memory-row: KG-CRASH1 -->
<!-- memory-row: KG-SEL1 -->
<!-- memory-row: KG-UI7 -->
<!-- memory-row: KG-GLOSS1 -->
<!-- memory-row: KG-GLOSS2 -->
<!-- memory-row: KG-COPY3 -->
<!-- memory-row: KG-COPY4 -->
<!-- memory-row: KG-UI9 -->
<!-- memory-row: KG-COPY1 -->
<!-- memory-row: KG-UI8 -->
<!-- memory-row: KG-COPY2 -->
<!-- memory-row: KG-RT2 -->
<!-- memory-row: KG-SEL2 -->

## 6. Recent regression history (why these tiers exist)

- Web bulk-contact process: 8 fixes + revert (2026-02-13/16).
- "bulk contact production error fix" (2026-03-23).
- "AI Find Leads prod issue" (2026-04-13, 2026-05-01).
- Mobile "production crashes" (2026-06-15).
- "App hang … Permission popup" (2026-05-13).
- AI Find Leads contact modal revert (2026-07-31).
- User MCP revert (2026-09-01).

Details and owner questions: `shoebox/09-known-issues/fragile.md` §2.
