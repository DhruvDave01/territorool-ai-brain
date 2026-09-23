---
area: context
tags: [brain/context]
ref: "Tech setup & environments"
---

# Territool — Stack (derived truth)

Last verified **2026-09-15**; rows that mention 2026-09-16 were re-checked that day (Admin account, Maestro, API_DEBUG on staging, local mobile build). Every row cites its source:
- `A0…A5` = `brain/audits/00-inventory.md` … `05-testing.md` (§ = section).
- **USER SAID** = owner decision recorded in those audits.

Re-verify a row before relying on it when code may have changed.

## 0. Canonical versions — the only place a version number is maintained

Every other current-state note, skill and gate **links here instead of repeating a number** (owner decision,
2026-09-17). `node tools/wiki-lint.js` (check `version-drift`) compares each value with its source where the
source is readable, and flags any other current-state file that states a different value. Dated records (the
evidence ledger, audits, captures, QA reports, `log.md`) keep the value that was true when they were written.

| Key | Value | Checked against |
|---|---|---|
| `react-native` | 0.84.1 | `repos/mobile/package.json` |
| `react-mobile` | 19.2.3 | `repos/mobile/package.json` |
| `typescript` | ^5.8.3 | `repos/mobile/package.json` |
| `detox` | ^20.50.1 | `repos/mobile/package.json` |
| `laravel` | 5.3.31 | `repos/web/vendor/laravel/framework/src/Illuminate/Foundation/Application.php:28` |
| `php` | 7.4.33 | runtime target, USER SAID 2026-09-15 (BT-12) |
| `phpunit` | 5.7.27 | `repos/web/composer.lock` |
| `react-portal` | ^18.3.1 | `repos/web/package.json` |
| `maestro` | 2.10.0 | `~/.maestro` CLI, installed 2026-09-16 (D-T4) |
| `node-min` | 18 | `tools/doctor.js:52` |
| `mobile-build` | 42.32 (1) | debug build installed in the owner's simulator (A0 §13); captures record the build they were taken on |

## 1. Product and roles

| Fact | Value | Source |
|---|---|---|
| Product | Field sales territory platform: AI lead discovery, companies & contacts (Address Book), lists, routes with navigation and visits, activities, contact enrichment paid with credits, subscriptions, CRM sync, AI connectors (MCP) | `repos/mobile/README.md:7-8`; A2 §2.1; A3 §1 |
| **Admin** | Territool internal HQ; **web only** (`/hq`) | USER SAID (A0 §12 Q6, A1 §11 Q-M1); `CheckUserRole.php:20-40` |
| **Sales Agent** | Individual field rep; mobile + web | USER SAID; `V2/AuthController.php:140` |
| **Business Agent** ("Manager") | Team owner; **web only**, manager portal `/manager` | USER SAID; `EnsureManagerRole.php:10-27`; `Auth/LoginController.php:44-50` |
| **Business Sales Agent** | Rep created by a Business Agent (`users.parent_id`); mobile + web; can't buy credits ("contact your manager") | USER SAID; `Auth/LoginController.php:134-138` |

## 2. Environments

| Env | URLs | Rule | Source |
|---|---|---|---|
| **Staging** | web `https://staging.territool.com`; API `https://staging.territool.com/index.php/api/` | **All testing happens here** | USER SAID; `repos/mobile/App/config/index.js:8-9` |
| **Production** | `https://app.territool.com` | **NEVER touched**: no writes, config, tests, purchases | USER SAID (A0 §13 follow-up); `config/index.js:12-13` (commented) |
| Local web | `http://localhost:8888/webterritool/public/index.php/login` (MAMP Apache :8888, MySQL :8889, DB `territool_beta`); pretty URLs 404 | Unit/DB-free work only | A0 §13 |
| Local mobile | iOS Debug build (§0 `mobile-build`) installed in the owner's booted simulator (bundle `com.picwa.appterritool`; on 2026-09-16 DerivedData held no build products, so the brain copies the installed `.app` to a second simulator), Metro :8081 (the owner's process, shared read-only); simulators iPhone 17 Pro / 17 Pro Max (iOS 26.5); Android AVDs `Pixel_6_Pro`, `Pixel_7_Pro`, `Medium_Phone_API_36.1` (no APK built) | Drive a **second** simulator, never the user's booted one | A0 §13 |
| Test accounts | `territool-brain/.local/test-accounts.md` (Sales Agent, Business Sales Agent, Business Agent, Admin: read-only) | Staging only; never copy credentials anywhere | USER SAID; A0 §13 |

## 3. Mobile: `repos/mobile` → `~/Documents/ReactNative_Projects/TerriTool_Mobile`

| Concern | Value | Source |
|---|---|---|
| Git | GitHub `DhruvDave01/TerriTool_Mobile`; working branch `TT_80` → `Staging` → `Production` (npm `merge:*` scripts); audit baseline includes uncommitted bulk-contact work | A0 §3; USER SAID (A1 §11) |
| Framework | React Native + React (versions: §0), RN CLI (no Expo); iOS 7.1.49 / Android 4.2.7 store versions | `package.json`; A1 §1 |
| Language | JavaScript. `App/` has 234 files: 1 TypeScript source (`App/utils/commonFunctions.ts`) + 2 `.d.ts` declarations under `App/customPackage/`; TypeScript is installed (§0) but covers almost nothing, so no static types in practice. *(Corrected 2026-09-17: the old row said "1 `.ts`" and the loop skill said "3 .ts/.tsx"; both counted differently — `find App` on 2026-09-17.)* | A1 §1, §4; `find App` 2026-09-17 |
| Navigation | One native stack, 49 screens in `App/App.js:332-389`, lazy-loaded | A1 §1 |
| State | Screen `this.state`; cross-screen static class `App/utils/Global.js` (frozen, M14); events via `DeviceEventEmitter` | A1 §1 |
| HTTP | `App/utils/API.js` (`post`/`get`/`get_third_party`), multipart FormData, Bearer JWT; errors from **body** `status_code` (401/403 → logout; 400/404/500 → toast + throw) | `API.js:229-342`; A1 §1 |
| Auth storage | Realm `JWTToken` id "1" (unencrypted; init failure deletes the DB) | `storage/realm.js:29-50, 417-459` |
| Styling | `App/styles/theme.js` (legacy tokens, frozen values) + `*.styles.js`; DIN Condensed Bold + DIN Regular fonts (`styles/fonts.js`) | A1 §1; A4 §1 |
| Observability | Sentry 8.5, PostHog, Firebase Crashlytics + Messaging; RevenueCat billing | `init.js`; `package.json` |
| Tests | Maestro 8 flows (`repos/mobile/.maestro`), Detox 2 specs, Jest template (already failing); no CI. Commands and baselines: `brain/skills/territool-router/LOOP.md` §0.1 | A5 §1 |
| Lint | ESLint `@react-native`. Baseline counts are dated measurements kept with the gate commands in `LOOP.md` §0.1 (latest 2026-09-16) | A1 §1 |

## 4. Web: `repos/web` → `/Applications/MAMP/htdocs/webterritool`

| Concern | Value | Source |
|---|---|---|
| Git | Bitbucket `anujsinghsahni/webterritool`; branch **`beta_react`**; ignore `webterritool_firecrawl` | USER SAID (A0 §12 Q1); A0 §4 |
| Framework | **Laravel** (installed version: §0; not 7.x), PHP constraint `^7.2`, code uses PHP 7 syntax. **Runtime target PHP: §0** (local CLI, works; owner: staging PHP check skipped, it won't change) | `vendor/laravel/framework/.../Application.php:28`; A2 §12; USER SAID 2026-09-15 (BT-12 closed) |
| API | Dingo API v1.0.0-beta8, **only `v2` routed** (`routes/api.php:75-247`); **V1 dead, left untouched** | USER SAID; A2 §1 |
| API auth | `tymon/jwt-auth` 0.5.12 (**in `require-dev`**, a bug: BT-9); `jwt.refresh` = `app/Http/Middleware/authJWT.php` (refreshes server-side, never returns the new token → re-login ~28 days, **intended**) | A2 §1, §4; USER SAID (A2 §11 QW5) |
| Web auth / roles | Session guard; `role` (`CheckUserRole`), `manager.only` (`EnsureManagerRole`); no policies/gates | A2 §1 |
| UI | Blade + AdminLTE + Bootstrap 3 + jQuery (user app); React (§0 `react-portal`) + Vite **manager portal** `resources/manager-portal/` → `public/js/manager-portal.js`; DIN 2014 via `@font-face` in `public/vendor/adminlte/dist/css/AdminLTE.min.css:5, 9` | A2 §1; A4 §11 |
| DB | MySQL + MongoDB (Moloquent); only 8 framework migrations + MCP module migrations; 2019 SQL dump (no real data, USER SAID) | A2 §3 |
| Structure | Fat controllers (`CompanylController` 8,509 lines), `app/Globals/Helper.php` 4,831 lines; newer `app/Services/**` with PHPUnit tests | A2 §2 |
| Queue / cron | 9 queued jobs; `QUEUE_DRIVER` default `sync` (`config/queue.php:18`), local `.env` `database`; **staging queue not processed** (KG-Q1); cron **GET URLs** drive payments and credit renewal (USER SAID) | A2 §1, §11; `07-validation.md` §4 |
| Observability | Sentry + PostHog in `app/Exceptions/Handler.php`; `API_DEBUG`: the owner said off on staging/prod (A2 §11), but **staging returns Dingo `debug` blocks (file, line, trace) at runtime on 2026-09-16**, so it is on for staging. Production not checked (CR-06, UI-SEC-02) | A2 §1, §11; EV-A03 |
| Tests | PHPUnit (§0), 18 tests (Manager services only; `--filter Manager` ran 17 on 2026-09-16); no CI. Commands: `LOOP.md` §0.1 | A5 §1 |

## 5. MCP modules (in scope, USER SAID)

| Module | Purpose | Source |
|---|---|---|
| `app/UserMcp` | Customer MCP "TerriTool App" at `/ai/mcp`; tools call V2 endpoints internally via `CustomerApiClient` with a minted JWT | `UserMcp/Services/CustomerApiClient.php:9-18` |
| `app/FindMcp` | Customer MCP for find leads / find & buy contacts at `/find-mcp/mcp`; `skills/*.md` | `FindMcp/README.md` |
| `app/AdminMcp` | Internal sales-desk MCP `/ai/mcp-admin`, `/api/mcp/*` | A2 §2.1 |
| `app/McpClient` | Outbound MCP client: HubSpot/Salesforce sync, chat (`salesperson/mcp/*`) | A2 §2.1 |
| Consumers of V2 | mobile app, UserMcp, FindMcp (≥ 14 endpoints) | A2 §4 |

## 6. V2 API contract (as-is)

| Aspect | Value | Source |
|---|---|---|
| Success | `{status: 1, message, data}` HTTP 200 (some endpoints return `"1"`; `login` returns `"1"`) | A2 §4; A3 P10 |
| Handled failure | HTTP 200 `{status: 0 \| "0", message, data: []}`: **approved convention for new code: int `0`** | DW1 (USER SAID) |
| Exceptions | Dingo `{message, errors, code, status_code, debug}` (401 JWT, 422 validation exception) | `config/api.php:140-145` |
| Clients | mobile checks `status == 1`; manager portal accepts `1`/`'1'`; MCP decodes JSON | A1 §2; A2 §7 |

## 7. Brain tooling

| Tool | Location | Status | Source |
|---|---|---|---|
| Playwright 1.63 + Chromium | `territool-brain/tools/` (gitignored) | installed | A4 §10 |
| Web capture | `tools/capture-web.js` (staging-only, read-only guard, font probe) | working; 51 screenshots | A4 §11 |
| Dependency graphs | `brain/audits/data/{mobile,web}-graph.json` + generators `rngraph.js`, `phpgraph.js` | generated 2026-09-15 | A5 §4 |
| Static gate | `brain/gates/scripts/static-checks.js` | built Phase 6 | this build |
| Maestro | `~/.maestro` (CLI version: §0) | **installed 2026-09-16** under D-T4 (a); suites in `workspace/test-suites/mobile/` | A5 §10; this loop |
| Codex | `~/.codex` desktop app; **CLI on PATH at `~/.local/bin/codex` (seen 2026-09-17)** — the "no CLI" of 2026-09-15 is superseded. Production-MCP risk in the web repo: `tooling.md` §3 | optional (D-T1) | A0 §13; `which codex` 2026-09-17 |

## 8. Unverified or pending items (don't assume)

| Item | Status | Source |
|---|---|---|
| Staging PHP version | **closed**: not verified by decision; run/test with PHP 7.4.33 (BT-12) | USER SAID 2026-09-15 |
| Queue worker on staging | **Not processing** (read-only check 2026-09-15: 6 routes stuck "Processing" for 29–280 days; team comment in V2 `createRoute`). Owner to check `queue:work`/Supervisor on the server. Production never checked | `07-validation.md` §4 (KG-Q1) |
| `--no-dev` deploy vs jwt-auth | bug confirmed in `composer.json`; deploy method unknown (BT-9) | A3 §7 |
| Package ids 4–6 meaning | read staging `packages` table | A3 §7 |
| Offline route cache | **offline dropped** (BT-11 = drop, S3.9) | USER SAID 2026-09-15 |
| Admin test account | **provided 2026-09-16 for read-only observation** (stored in `.local/` only); write cases stay waived | USER SAID 2026-09-16 (supersedes 2026-09-15) |
| Staging test-payment setup | **skipped**: payment flows run up to the step before paying, then stop | USER SAID 2026-09-15 |

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (56)

**Documents (34):** [[brain/context/api-map|API map: every V2 endpoint, who calls it, and how it behaves]] · [[brain/context/architecture|Architecture: how Territool is built, end to end]] · [[brain/audits/00-inventory|Audit 0 – what exists]] · [[brain/audits/01-mobile|Audit 1 – mobile app review]] · [[brain/audits/02-web|Audit 2 – web app review]] · [[brain/audits/03-parity|Audit 3 – mobile vs web]] · [[brain/audits/04-design|Audit 4 – design review]] · [[brain/audits/05-testing|Audit 5 – testing plan]] · [[brain/audits/07-validation|Audit 7 – proving the brain works]] · [[_code/brain/brain/gates/scripts/static-checks.js|Automatic code checker]] · [[brain/README|brain/ - GENERATED OUTPUT. Do not hand-edit during build.]] · [[CLAUDE-CODE-BOOTSTRAP|Claude Code Bootstrap Prompt]] · [[brain/context/contradiction-register|Contradiction register: where two sources disagreed, and which won]] · [[brain/memory/entries/conflict/20260917-f7d706-cr-04-stack-s6-4-claude-md-no-admin-account-admi|CR-04 — stack / S6.4 / CLAUDE.md: "no Admin account, Admin cases waived" ↔ owner 2026-09-16: an Admin account is prov…]] · [[brain/memory/entries/conflict/20260917-dd1487-cr-06-stack-md-apidebug-off-on-staging-and-produ|CR-06 — stack.md: API_DEBUG off on staging and production (USER SAID) ↔ staging error responses carry Dingo debug (fi…]] · [[brain/memory/entries/conflict/20260917-f96991-cr-07-stack-md-a-business-sales-agent-can-t-buy-|CR-07 — stack.md: a Business Sales Agent "can't buy credits (contact your manager)"; mobile hides every purchase cont…]] · [[brain/memory/entries/conflict/20260917-6069cc-cr-14-stack-md-maestro-not-installed-maestro-2-1|CR-14 — stack.md: "Maestro not installed" ↔ Maestro 2.10.0 installed 2026-09-16 under D-T4]] · [[brain/memory/entries/conflict/20260917-de05ec-cr-20-stack-md-the-ios-debug-build-is-in-derived|CR-20 — stack.md: the iOS debug build is "in DerivedData" ↔ on 2026-09-16 DerivedData had no build products; the buil…]] · [[brain/memory/RULES|Knowledge memory — the laws]] · [[workspace/qa-reports/2026-09-17-knowledge-memory-audit|Knowledge memory audit — 2026-09-17]] · [[log|Log]] · [[workspace/qa-reports/2026-09-17-knowledge-memory-build|QA report: knowledge memory build and confidence loop (2026-09-17)]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/roles-permissions|Roles and permissions: who can do what, where, and what enforces it]] · [[brain/skills/territool-router/SKILL|Skill – task router (start of every task)]] · [[brain/memory/SOURCE-OF-TRUTH|Source of truth — which source wins, per question]] · [[CLAUDE|Start here – brain overview]] · [[brain/context/agent-brief|Territool brain — operating brief for any AI coding tool]] · [[brain/memory/entries/correction/20260917-7e9fc5-the-codex-cli-is-on-path-stack-md-said-it-was-no|The Codex CLI is on PATH; stack.md said it was not]] · [[brain/skills/territool-router/LOOP|The fix-until-done loop]] · [[_code/brain/tools/capture-web.js|Tool – take web screenshots]] · [[brain/context/tooling|Tooling: which agent runs the brain, and what each one needs]] · [[brain/memory/entries/correction/20260917-eaa29a-typescript-file-count-1-source-file-plus-2-decla|TypeScript file count: 1 source file plus 2 declarations, not "1" or "3"]] · [[brain/memory/entries/decision/20260917-1638cf-versions-have-one-home-stack-md-0-guarded-by-the|Versions have one home: stack.md §0, guarded by the version-drift lint]]

**Coding rules (4):** [[_id/M14|Don't grow the Global file]] · [[_id/S3.9|Offline mode dropped]] · [[_id/S6.4|Staging test data rules]] · [[_id/DW1|Validation/handled-failure format for new V2 endpoints]]

**Owner decisions (6):** [[_id/D-T1|Claude runs the tests]] · [[_id/D-T4|Install test tools when needed]] · [[_id/BT-9|Login library must ship with the app]] · [[_id/BT-11|Offline mode dropped]] · [[_id/Q-M1|Question: which roles use the mobile app?]] · [[_id/BT-12|Server PHP version]]

**Problem found (1):** [[_id/KG-Q1|Background jobs not running on staging]]

**Code files (11):** [[_code/mobile/App/utils/API.js|API.js]] · [[_code/web/app/Api/V2/Controllers/AuthController.php|AuthController]] · [[_code/mobile/App/utils/commonFunctions.ts|commonFunctions.ts]] · [[_code/mobile/App/config/index.js|config/index.js]] · [[_code/web/app/UserMcp/Services/CustomerApiClient.php|CustomerApiClient]] · [[_code/mobile/App/styles/fonts.js|fonts.js]] · [[_code/mobile/App/utils/Global.js|Global.js]] · [[_code/web/app/Globals/Helper.php|Helper]] · [[_code/web/app/Http/Controllers/Auth/LoginController.php|LoginController]] · [[_code/mobile/App/storage/realm.js|realm.js]] · [[_code/mobile/App/styles/theme.js|theme.js]]

%% brain-links:end %%
