---
area: audits
tags: [brain/audits]
ref: "Audit 0 – what exists"
---

# Phase 0 — Inventory & Gap Report

- **Date:** 2026-09-15
- **Scope:** structure only. Manifests, configs, file counts, git metadata. No deep reads of source.
- **Method:** read-only commands (`find`, `git log/ls-files/status`, reading manifests). Nothing in `repos/` was modified. No installs or fetches. No secret files were opened (`.env`, `.cursor/credentials/`, Postman env values, config key values).
- **Status:** STOPPED, awaiting approval to start Phase 1.

---

## 1. Shoebox — provided vs requested

The shoebox contains only the scaffold READMEs. **Nothing has been provided yet.**

| Folder | Requested | Provided |
|---|---|---|
| `00-INDEX.md` | Status + notes for Claude | Scaffold only (I ticked `repos/mobile` and `repos/web`) |
| `01-context/` | `product.md`: product, roles, mobile vs web, key flow, roadmap, vocabulary | ❌ nothing |
| `02-mobile/screenshots` | `<flow>_<step>_<screen>.png`, incl. empty/loading/error states | ❌ nothing |
| `02-mobile/videos` | `<flow>_full.mp4` + `.md` timestamps | ❌ nothing |
| `02-mobile/notes` | gestures, offline, permissions, deep links | ❌ nothing |
| `03-web/screenshots` | consistent viewport + 3 tablet/mobile widths | ❌ nothing |
| `03-web/videos`, `notes` | as mobile | ❌ nothing |
| `04-design/tokens` | real, messy tokens for both platforms | ❌ nothing |
| `04-design/figma`, `references` | Figma link / exports; inspiration + why | ❌ nothing |
| `05-standards/*-good`, `*-bad` | 3–5 good, 2–3 bad files per platform + `WHY.md` | ❌ nothing |
| `05-standards/configs` + `rules.md` | real config files + unwritten rules | ❌ nothing |
| `06-testing/existing-tests` | sample tests or `NONE.md` | ❌ nothing |
| `06-testing/formats` | real example of the test case output format | ❌ nothing |
| `06-testing/codex/codex-setup.md` | Codex product, invocation, execution ability, targets | ❌ nothing |
| `07-flows/flows.md` | every flow with platform, steps, criticality, screens, endpoints | ❌ nothing |
| `08-api/` | OpenAPI/Postman/route list + auth, errors, pagination, uploads | ❌ nothing |
| `09-known-issues/fragile.md` | fragile areas, past regressions, intentional oddities | ❌ nothing |
| `repos/mobile` | code | ✅ symlink → `~/Documents/ReactNative_Projects/TerriTool_Mobile` |
| `repos/web` | code | ✅ symlink → `/Applications/MAMP/htdocs/webterritool` (linked during Phase 0; **needs confirmation**, see Q1) |

---

## 2. Prior material found outside the shoebox (unverified)

The repos already contain a lot of material that overlaps with what the shoebox asks for. **None of it is a trusted source yet.** Section 6 shows the one overview I spot-checked is already out of date. Treat these as leads to verify against code, not as facts.

### In `repos/mobile`

| Path | What it is | Overlaps with |
|---|---|---|
| `Design-Brain/` (**gitignored**: local only, uncommitted `.gitignore` change) | 60 markdown files (~2,260 lines) + assets, dated 2026-09-11 | 04-design, 07-flows, 02-mobile |
| `Design-Brain/01-Brand-Guidelines/` | Colors, Typography, Spacing, Radius, Shadows, Icons, Logos, Brand-Usage-Rules | 04-design/tokens |
| `Design-Brain/02-User-Interface/` | Components, Forms, Maps, Modals, Navigation, States, Platform-Differences, Screen-Inventory (192 lines) | 02-mobile/notes, 04-design |
| `Design-Brain/04-User-Flows/` | 18 flow docs: App-Launch, Authentication, Calendar-and-Activity, Companies-and-Contacts, Dashboard, Enrichment-and-Credits, Error-and-Recovery, Find-Leads, Lists, Main-Navigation, Maps-and-Active-Route, Onboarding, Permissions, Routes, Scan-Business-Card, Settings, Subscription | 07-flows (mobile only, no criticality) |
| `Design-Brain/05-Design-System/` | Design-Tokens, **Token-Inconsistencies**, Components, Component-States, Usage-Rules | 04-design/tokens |
| `Design-Brain/06-Coverage/` | Functionality-Coverage-Matrix, Needs-Manual-Verification, Deferred-Scope, Screenshot-Video-Index | coverage gaps |
| `Design-Brain/03-Assets/Screenshots/Archive-2/` | 48 screenshots named `IMG_4563.PNG`… (not flow-named) | 02-mobile/screenshots |
| `Design-Brain/03-Assets/Videos/` | `VID1-AI-Find-Leads-to-Activity.mp4` (156 MB), `VID2-Add-Company.mp4` (39 MB), `VID3-Additional-Flows.mp4` (69 MB) | 02-mobile/videos |
| `Design-Brain/03-Assets/Screenshots/Video-Frames/` | 46 frames already extracted: VID1 8, vid1x 8, VID2 2, vid2x 2, VID3 26 | 02-mobile/frames |
| `Design-Brain/MASTER-DESIGN-BRAIN.md`, `MINI-DESIGN-BRAIN.md` | earlier design-brain attempt | — |
| `docs/` | `Code-Audit-Report-2026-07-06.md`, `NAVIGATION_FULL_FLOW.md`, navigation audit, `RELEASE_AND_QA_PROCESS.md`, `RELEASE_AND_QA_CLIENT_GUIDE.md`, RevenueCat guide, end-user guide | 06-testing, 09-known-issues |
| `Prompts/` | 29 earlier audit/migration prompts incl. `TerriTool_OverView.md`, `TerriTool_Web_OverView.md`, `INLINE_STYLE_AUDIT.md`, `navigation_audit.md`, cost audits | 01-context |
| `postman/TerriTool-API-from-config.postman_collection.json` | **114 requests**, generated from `App/config/index.js`, so it reflects what the *mobile app calls*, not what the web API defines | 08-api |
| `.maestro/` | 8 Maestro flows: login (android/ios), login validation, register (android/ios), register validation, post-register onboarding, register full journey | 06-testing |
| `e2e/` | Detox: `auth/login.e2e.js`, `login-flow.e2e.js` | 06-testing |
| `scripts/` | `audit-missing-testids.js`, `inject-automatic-testids.js`, `qa-ui-parity-check.js`, `check-platform-font-splits.js` | 06-testing |

Postman folders by request count: Routes 19, Companies 19, Contacts 11, Auth & registration 9, Cognism/Apollo/OpenCorporates 9, AI leads 8, User profile & status 8, HubSpot sync 7, Credits & subscription 5, Lists 4, Notes 4, Search & misc 3, Notifications & tickets 3, Meetings 2, Web (outside URL_BASE) 2, Google reference 1.

### In `repos/web`

| Path | What it is |
|---|---|
| `.codex/config.toml` (untracked) | Some Codex configuration exists in the web repo. Contents not read. |
| `tests/` | 5 files: `ExampleTest.php`, `TestCase.php`, `ManagerDashboardFieldSalesScoringTest.php`, `ManagerDashboardTerritoryVisitTest.php`, `ManagerFindLeadsServiceTest.php` |
| `app/FindMcp/skills/` | skill definitions inside the app (not inspected) |

---

## 3. `repos/mobile`: structural summary

| Item | Value | Source |
|---|---|---|
| Real path | `~/Documents/ReactNative_Projects/TerriTool_Mobile` | symlink |
| Remote | `github.com/DhruvDave01/TerriTool_Mobile` | `git remote -v` |
| Current branch | `TT_80` | `git branch` |
| Promotion path | `TT_80` → `Staging` → `Production` | `package.json` scripts `merge:t2s`, `merge:s2p` |
| History | 485 commits; first commit 2026-03-17 "Initial commit" | `git rev-list`, `git log --reverse` |
| Last 50 commits | Dhruv Dave 31 (+1 as "Dhruv"), Rahul Singh 18; 2026-06-19 → 2026-09-10 | `git log -50` |
| Tracked files | 559 | `git ls-files` |
| Working tree | 9 modified (`App/App.js`, `route/basic`, `route/bizContact`, `route/congContact`, `list/basic`, `App/config/index.js`, `.gitignore`, iOS pbxproj) + 5 untracked (`App/components/route/contact/`, `App/utils/bulkContact{Fetch,Progress,Select,Session}.js`). ~680 insertions of uncommitted bulk-contact work | `git status`, `git diff --stat` |
| Store versions | iOS 7.1.49, Android 4.2.7 | `package.json` |

### Stack (from manifests only, to be confirmed in Phase 1)

| Concern | Finding | Source |
|---|---|---|
| Framework | React Native **0.84.1**, React **19.2.3** | `package.json` |
| CLI vs Expo | RN CLI (`@react-native-community/cli` 20.1.0; no Expo packages) | `package.json` |
| Language | **JavaScript**: `App/` has 231 `.js`, 3 `.ts`, 0 `.tsx`. `tsconfig.json` only includes `*.ts/*.tsx` | file counts, `tsconfig.json` |
| Navigation | `@react-navigation/native` 7 + `native-stack` | `package.json` |
| State management | No Redux/Zustand/MobX/React Query in deps; `App/SplashVisibilityContext.js` suggests Context | `package.json`, tree |
| HTTP | `App/utils/API.js`; no axios in deps. Base URL in `App/config/index.js` (staging active, production commented) | tree, `App/config/index.js:8-13` |
| Storage | Realm 20.2 (`App/storage/realm.js`, `fcmrealm.js`) + AsyncStorage | `package.json`, tree |
| Forms | `react-native-form-validator` | `package.json` |
| Styling | co-located `*.styles.js` + `App/styles/{theme,common,commonStyles,fonts,platformText}.js` | tree |
| Observability | Sentry 8.5.0, Firebase Crashlytics + Messaging 24, PostHog | `package.json` |
| Payments | RevenueCat (`react-native-purchases`) | `package.json` |
| Lint/format | ESLint `@react-native` default config (no custom rules); Prettier 2.8.8 (`singleQuote`, `trailingComma: all`, `arrowParens: avoid`) | `.eslintrc.js`, `.prettierrc.js` |
| Patches | 7 `patch-package` patches incl. `react-native+0.84.1.patch` | `patches/` |
| Unit tests | 1 file: `__tests__/App.test.tsx` (RN template) | tree |
| E2E | Detox config (iPhone 17 Pro Max sim, Pixel_9_Pro_XL AVD), login only; Maestro 8 flows | `.detoxrc.js`, `.maestro/` |
| CI | **None found** (no `.github`, fastlane, bitbucket/gitlab config) | `ls` |

### Layout and size

`App/` JS/TS files by folder: `utils` 55, `components/route` 41, `customPackage/react-native-select-dropdown` 18, `components/common` 18, `components/dashboard` 17, `components/company` 10, `components/list` 9, `components/register` 8, `components/findLeads` 8, `styles` 7, `components/contacts` 6, remainder ≤ 5 each. Total ≈ **134,500 lines** of JS in `App/`.

Largest files (lines): `components/findLeads/aiFindLeads.js` **10,609** · `components/customcompany/index.js` 7,602 · `components/findLeads/index.js` 6,714 · `components/register/postSignupPaywallFlow.js` 5,314 · `components/dashboard/editstatus.js` 3,436 · `components/route/congContact/index.js` 3,002 · `components/company/create/index.js` 2,846 · `components/route/basic/index.js` 2,745.

Most-touched areas in last 50 commits (file touches): `components/dashboard` 41, `ios` 29, `components/route` 28, `android` 27, `components/customCalendar` 22, `components/register` 18, `docs` 17, `components/customcompany` 17, `components/findLeads` 16, `App/config/index.js` 15.

---

## 4. `repos/web`: structural summary

| Item | Value | Source |
|---|---|---|
| Real path | `/Applications/MAMP/htdocs/webterritool` | found via Cursor project paths; `artisan` present |
| Remote | `bitbucket.org/anujsinghsahni/webterritool` | `git remote -v` |
| Current branch | `beta_react` | `git branch` |
| Other branches | `master` (2026-08-13), `beta` (2026-08-11), `theme`, `staging` (2024-05-14), several stale 2019–2023 | `git branch -r` (no fetch; may be stale) |
| History | 3,037 commits; first 2019-05-24 "init webterritool on git" | `git log` |
| Last 50 commits | Mehul 34, Rahul Singh 16; 2026-08-19 → 2026-09-10; dominated by MCP work | `git log -50` |
| Tracked files | 5,251 (1,685 png, 1,083 js, 987 php, 299 css, 221 xlsx, 176 pdf) | `git ls-files` |
| Working tree | modified: `.env`, `bootstrap/cache/services.php`, `public/js/manager-portal.js(.map)`; untracked `.codex/`, `.cursor/` | `git status` |
| Second copy | `/Applications/MAMP/htdocs/webterritool_firecrawl`: same remote, `beta_react`, last commit 2026-07-22, 22 uncommitted changes. **Not linked.** Also `webterritool.zip` in htdocs | `git -C` |

### Stack (from manifests only, to be confirmed in Phase 2)

| Concern | Finding | Source |
|---|---|---|
| Laravel | **5.3.31** installed (`composer.json` constraint `"^7.0\|5.3.31"`) | `composer.lock`, `vendor/laravel/framework/src/Illuminate/Foundation/Application.php:28` |
| PHP | constraint `^7.2`; CLI on PATH is 7.4.33; MAMP ships 7.3–8.5 | `composer.lock` platform, `php -v` |
| API | Dingo API **v1.0.0-beta8**; `app/Api/V1` (8 files), `app/Api/V2` (14 files) | `composer.lock`, tree |
| Auth | Laravel Passport 1.0.18; `tymon/jwt-auth` 0.5.12 **listed under `require-dev`** | `composer.json`, `composer.lock` |
| Admin | Backpack CRUD 3.2.27 + PermissionManager; 144 `vendor/backpack` view overrides | `composer.lock`, views |
| DB | MySQL + MongoDB (`moloquent`; `app/Models/MongoDB` 4 files; `mongobackups/` tracked). **Only 8 migrations** | `composer.json`, tree |
| Frontend (main app) | Blade: `front/company` 35, `front/` 27, `front/routes` 22, `front/contact` 21, `front/subscription` 18, `front/manager` 17 … ; jQuery + jqWidgets under `public/` | tree |
| Frontend (manager portal) | **React 18** built by **Vite 5** from `resources/manager-portal/main.jsx` (36 `.jsx` + 22 `.js`) → `public/js/manager-portal.js` | `vite.config.js`, `package.json` |
| Other frontend | `@vitejs/plugin-vue2` + `vue` 2.7 in devDeps, legacy `gulpfile.js`, `resources/assets/sass`; bootstrap 5.3.6 / jquery 3.7.1 in npm, but `public/jqwidgets/scripts/jquery-1.11.2.js` vendored. Which one is actually loaded is unknown | `package.json`, tree |
| App folders | `Http/Controllers` 42, `Models` 45, `Mail` 35, `Jobs` 9, `Http/Requests` 7, `Http/Middleware` 7, `Globals/Helper.php`, `Helpers/`, `Services/{ClaudeContactFinder,GoogleSheets,Manager}` | tree |
| MCP modules | `AdminMcp`, `UserMcp`, `FindMcp`, `McpClient`, `McpOAuth` (~110 PHP files together) | tree |
| Routes | `routes/web.php` 634 lines, `routes/api.php` 247 lines | `wc -l` |
| Tests | PHPUnit 5.7.27; 5 files in `tests/` | `composer.lock`, `phpunit.xml` |
| Lint/static analysis | **None found** (no pint, phpstan, php-cs-fixer, eslint, prettier, editorconfig) | root listing |
| CI | **None found** | root listing |

Largest files (lines): `app/Http/Controllers/CompanylController.php` **8,509** · `public/js/modalScript.js` 6,285 · `resources/views/front/route/findleads.blade.php` 5,909 · `public/css/custom.css` 5,693 · `app/Globals/Helper.php` 4,831 · `app/Api/V2/Controllers/RouteController.php` 4,442 · `public/css/manager-portal-responsive.css` 4,014 · `resources/views/front/company/sessionerror.blade.php` 3,888 · `front/list/step1.blade.php` 3,530 · `app/Http/Controllers/HubSpotController.php` 3,476 · `app/Api/V2/Controllers/CompanyController.php` 3,371.

Most-touched in last 50 commits: `app/UserMcp/Services` 33, `app/McpClient/Services` 27, `resources/views/front` 19, `app/UserMcp/Console` 14, `app/UserMcp/config` 11, `app/McpClient/{resources,Http}` 10 each.

---

## 5. Videos and frames

- `shoebox/*/videos/`: **0 videos**, so there was nothing to extract.
- `ffmpeg` is **not installed** (`command not found`; Homebrew is available).
- Outside the shoebox, `repos/mobile/Design-Brain/03-Assets/Videos/` has 3 videos with 46 frames already extracted (rate unknown). I did not re-extract. The bootstrap scopes extraction to the shoebox, and ffmpeg is missing anyway.

---

## 6. Documentation drift detected already

A spot-check of `repos/mobile/Prompts/TerriTool_Web_OverView.md` and `repos/mobile/README.md` against manifests and line counts:

| Claim | Doc says | Code says |
|---|---|---|
| Laravel version | 7.x (`TerriTool_Web_OverView.md:48`) | **5.3.31** (`vendor/.../Application.php:28`) |
| `CompanylController` size | ~7,700 lines | 8,509 |
| `findleads.blade.php` size | ~4,500 lines | 5,909 |
| `routes/web.php` size | ~544 lines | 634 |
| `custom.css` size | ~3,700 lines | 5,693 |
| `modalScript.js` size | ~2,800 lines | 6,285 |
| Web frontend | "Blade, jQuery 2.x, Bootstrap 3" | Blade + jQuery/jqWidgets **plus** a React 18/Vite manager portal |
| Mobile Firebase | 23.x (`README.md:39`) | 24.0.0 (`package.json`) |
| Mobile TikTok helper | `App/utils/TikTokHelper` (`README.md:43`) | not present in `App/utils/` |

**Consequence:** everything in `Prompts/`, `docs/`, the READMEs and `Design-Brain/` is a lead, not a source. Any of it that goes into `brain/context/` must be re-verified against code.

---

## 7. Security observations (recorded, not acted on)

These files were noticed and deliberately **not opened**. No values from them will ever be copied into `brain/`.

1. **`webterritool/.env` is tracked in git** (`git ls-files .env` returns it) and is locally modified. Environment secrets are probably in Bitbucket history.
2. `repos/mobile/package.json:29-40` has plaintext credentials for Maestro test accounts on **staging and live**.
3. `repos/mobile/.cursor/credentials/` exists. Only `.gitignore` and `mcp-secrets.env.example` are tracked.
4. `android/app/google-services.json` and `ios/**/GoogleService-Info.plist` are tracked (common practice; noted only).

---

## 8. MISSING — BLOCKING

A gap is blocking if the named phase cannot produce a trustworthy result without it.

| # | Gap | Blocks | Why it can't be derived | Partial substitute found |
|---|---|---|---|---|
| B1 | `07-flows/flows.md` with **criticality** and platform | Phases 3, 5, 6 | Criticality (BLOCKER/HIGH…) is a business judgement; the parity map and regression gate are organised by flow | 18 mobile flow docs in `Design-Brain/04-User-Flows/` (no criticality, no web, unverified) |
| B2 | `09-known-issues/fragile.md` | Phases 5, 7 | Past regressions and "intentional oddities" only exist in people's heads | `docs/Code-Audit-Report-2026-07-06.md` (unread), Jira ticket IDs in commits (e.g. `TT1-1295`) |
| B3 | `06-testing/formats/` test case example | Phase 5, test skill | The brief says "match exactly"; the format can't be guessed | none |
| B4 | `06-testing/codex/codex-setup.md` | Phase 5, test skill | Execution capability decides whether the skill writes runnable code or prose | `webterritool/.codex/config.toml` exists (unread); Maestro + Detox exist in mobile |
| B5 | `03-web/screenshots` | Phase 4 (web half) | "Extract the real design system from screenshots": there are zero web screenshots | none |
| B6 | Confirmation of which web copy/branch is canonical (Q1) | Phase 2 | Two local clones exist; the audit target must be right | `webterritool` on `beta_react` is newest |

**Phase 1 (mobile audit) is not blocked.** It is code-driven. Only its "compare against good/bad files" step is degraded (see D5).

---

## 9. MISSING — DEGRADING

| # | Gap | Effect | Partial substitute |
|---|---|---|---|
| D1 | `01-context/product.md` | Roles, vocabulary and roadmap would be guessed, so the brain drifts generic | Web overview lists 4 roles (unverified); READMEs |
| D2 | `02-mobile/screenshots` named by flow and state | Design audit can't tie screens to flows or check empty/loading/error states | 48 `IMG_####.PNG` + `Screenshot-Video-Index.md` in Design-Brain |
| D3 | Flow videos (mobile + web) with timestamp notes | Transitions and interaction behaviour invisible | 3 mobile videos in Design-Brain |
| D4 | `04-design/tokens` (both platforms), Figma, references | Can't diff claimed vs actual tokens for web; no target direction | `Design-Brain/05-Design-System/Design-Tokens.md` + `Token-Inconsistencies.md` (mobile) |
| D5 | `05-standards` good/bad files + `WHY.md` + `rules.md` | Rules will reflect what the code *does*, not what the team *wants* | none (configs are near-default; I can copy them from repos myself) |
| D6 | `06-testing/existing-tests` | Low: I can sample from repos directly | `.maestro/`, `e2e/`, `tests/` |
| D7 | `08-api` contract notes (auth/refresh, error shape, pagination, uploads) | Must be reverse-engineered from code | Postman collection (114 mobile-side requests), `routes/api.php` |
| D8 | `ffmpeg` not installed | Can't extract frames from future videos | `brew install ffmpeg` (needs your OK) |
| D9 | `maestro` and `detox` CLIs not on PATH | Phase 7 can't *run* existing E2E flows, only read them | — |

---

## 10. OPEN QUESTIONS

Only questions the code can't answer. Things I can resolve myself are in §11.

1. **Web repo.** Is `/Applications/MAMP/htdocs/webterritool` on `beta_react` the right audit target? What is `webterritool_firecrawl` (22 uncommitted changes, stale since 2026-07-22)? Which web branch is live in production: `master`, `beta`, `beta_react`?
2. **Mobile snapshot.** Should I audit `TT_80` HEAD, or the working tree including the uncommitted bulk-contact work in `route/`?
3. **Prior material.** Who wrote `Design-Brain/`, `Prompts/` and `docs/`, and how much do you trust them? May I use them to **pre-draft** `flows.md`, tokens and screenshot mapping for you to correct, with each claim still re-verified?
4. **Laravel version.** The overview says 7.x, but 5.3.31 is installed. Is an upgrade in progress somewhere, or is the doc just wrong?
5. **API consumers.** Does the current app use only Dingo **V2**? Are **V1** endpoints still hit by old app versions in the field? Is there a minimum supported app version? This decides whether API changes can break users.
6. **Roles.** The overview lists Sales Agent, Business Agent, Business Sales Agent and Admin, and the code also has a "Manager" portal. Is Manager a fifth role or the Business Agent's UI? Which roles use mobile, web, or both?
7. **MCP modules.** Most recent web commits are in `UserMcp`/`McpClient`/`AdminMcp`/`FindMcp`. In scope for the brain, or out of scope for now?
8. **Codex.** Is `webterritool/.codex/config.toml` your Codex setup (the OpenAI Codex CLI)? Can it run iOS Simulator / Android emulator and a browser? Is **Maestro** the E2E runner you want Codex to drive?
9. **Test cases today.** Where do test cases live now (Jira project `TT1`? `docs/RELEASE_AND_QA_PROCESS.md`?), and in what format?
10. **Secrets.** `.env` is committed in the web repo, and live test credentials are in the mobile `package.json`. Are these known and accepted? I'll record them as known issues only and won't touch them.
11. **Carried over from setup.** Is the built-in Claude Code `/loop` skill the "loops skill" you meant? And what is the design-artifact URL whose spec format the design skill should match?

---

## 11. To verify myself in later phases (not questions for the user)

- Why `App/components/customCalendar` appears in 22 recent file touches but not in the current `App/components/` tree (moved, renamed, or deleted?) → Phase 1
- State management approach (Context only?) and whether `App/utils/API.js` is the single HTTP entry point → Phase 1
- The 3 `.ts` files in a JS codebase: intentional migration start or stragglers → Phase 1
- `tymon/jwt-auth` in `require-dev` vs Passport: which one actually authenticates the mobile API → Phase 2
- Only 8 migrations: where the real schema is defined → Phase 2
- Which jQuery/Bootstrap build the Blade layout actually loads → Phase 2/4
- Postman collection (mobile-derived) vs `routes/api.php` (server-defined): endpoints on one side only → Phase 3

---

## 12. Answers received (USER SAID, 2026-09-15)

| Q | Answer (paraphrased faithfully) | Effect on the build |
|---|---|---|
| 1 | Web = `/Applications/MAMP/htdocs/webterritool` on `beta_react`. **Ignore `webterritool_firecrawl`.** | B6 resolved. `repos/web` symlink confirmed. |
| 2 | Mobile = `TT_80` **including uncommitted code**. | Audit the working tree, not just HEAD. |
| 3 | Yes, use `Design-Brain/`/`Prompts/`/`docs/` to pre-draft. Some screenshots/videos are missing; the user will add more later. | Drafts allowed; every claim still verified against code. |
| 4 | No Laravel upgrade has started. The overview doc is just an overview. | Laravel **5.3.31** is the truth; the doc's "7.x" is wrong. |
| 5 | **No minimum supported app version.** Both API **V1 and V2** are in play. | API changes must stay backward compatible with V1 and V2 callers; both in scope. |
| 6 | Web has all roles. **Admin** = Admin. **Sales Agent** = individual sales rep. **Business Agent** = "Manager" (the manager portal is theirs). **Business Sales Agent** = a sales rep created by a Manager. | Canonical role glossary seed. Mobile role coverage to be derived from code. |
| 7 | **MCP modules and "other things" are in scope.** Add everything to the project. | `AdminMcp`, `UserMcp`, `FindMcp`, `McpClient`, `McpOAuth`, manager portal, CRM sync etc. all get audited. |
| 8 | The Codex setup **does not work properly**; the brain must set up test execution properly. | B4 becomes a build task, not an input. |
| 9 | **No test cases exist.** Create them from screenshots, videos and flow descriptions. | B3 becomes a format *proposal* for approval, not an input. |
| 10 | Aware of the committed `.env` and plaintext test credentials. | Recorded as known issues only. |
| 11 | The loop means: make the change → test it → if something breaks, fix it → repeat **until 100%** on UI, functionality, testing and QA. | Replaces the bootstrap's "cap at 3" (see §13 for the proposed safeguard). |

---

## 13. Can Claude run the apps and capture screenshots itself? (checked 2026-09-15)

### Environment evidence

| Capability | Status | Evidence |
|---|---|---|
| iOS Simulator | ✅ Xcode 26.6; iPhone 17 Pro Max (iOS 26.5) **booted**; 8 more iPhone sims available | `xcodebuild -version`, `xcrun simctl list` |
| iOS app build | ✅ `TerriTool.app` Debug build from 2026-09-15 08:42 in DerivedData; installed as `com.picwa.appterritool`; Metro running on :8081 (serves the working tree incl. uncommitted code) | DerivedData, `simctl listapps`, `lsof :8081` |
| iOS screenshot | ✅ **Captured** the live sim (Find Contacts screen, logged in to staging) | `xcrun simctl io … screenshot` |
| iOS UI driving (tap/type/scroll) | ❌ no driver installed (`maestro`, `idb` not found) | `which` |
| Android | ⚠️ SDK + Java 17 + AVDs `Pixel_6_Pro`, `Pixel_7_Pro`, `Medium_Phone_API_36.1`; **no emulator running, no APK built**. Detox config expects `Pixel_9_Pro_XL`, which doesn't exist | `emulator -list-avds`, `adb devices` |
| Local web | ✅ MAMP Apache :8888 + MySQL :8889 running. App works at **`http://localhost:8888/webterritool/public/index.php/login`** (200). Pretty URLs 404 because `AllowOverride None`. Local DB `territool_beta` @127.0.0.1; `APP_URL` points at staging | `curl`, `.env` keys `APP_ENV/APP_URL/DB_HOST/DB_DATABASE` only |
| Web screenshot | ✅ headless Chrome works (needs a hard timeout, otherwise it hangs) | `probe/web-local-*.png` |
| Web UI driving (login, click through) | ❌ nothing installed yet (no Playwright) | — |
| Staging / production web | reachable: `staging.territool.com/login` 200, `app.territool.com/login` 200 | `curl` status only |
| Codex | Codex desktop app config exists at `~/.codex` (browser, chrome, computer-use plugins enabled); **no `codex` CLI on PATH**. Repo `.codex/config.toml` only defines 2 MCP servers (`territool-admin`, `territool-app`), with no test execution setup | key names only |
| ffmpeg | ❌ not installed | `which` |

### NEW security finding S5 (live, local network)

MAMP Apache listens on **all interfaces** (`Listen 8888`, `*:8888`) with `Options Indexes`, and the whole repo is the served directory:
- `http://192.168.1.8:8888/webterritool/.env` → **200, 4,023 bytes** (same size as the file), so it can be downloaded by anyone on the same Wi-Fi/LAN
- `/webterritool/.git/config` → 200, and the full directory listing is visible

Only status codes were requested; no contents were read. This is separate from "`.env` is committed" (which the user knew). The fix is machine config, not repo code: bind Apache to `127.0.0.1:8888` and/or point the document root at `public/`. **Not changed; needs user OK.**

### B1–B6 status after answers

| # | Gap | New status | What it needs |
|---|---|---|---|
| B1 | `flows.md` | **Claude can draft** from `Design-Brain/04-User-Flows` (18) + `routes/web.php`/`api.php` + MCP modules | User sets/approves **criticality** per flow |
| B2 | `fragile.md` | **Claude can draft** from git history (fix/revert commits, Jira `TT1-*` refs), `docs/Code-Audit-Report-2026-07-06.md`, crash-recovery code | User confirms; adds what only people know |
| B3 | Test format | **Claude proposes** a format (none exists) | User approves once |
| B4 | Test execution | **Claude builds it**: Maestro for mobile (team already has `.maestro/` flows) + Playwright for web, run directly by Claude Code inside the loop | User confirms Codex is not required as the runner; approves installs |
| B5 | Web screenshots | **Claude can capture** with Playwright on local MAMP | Test logins per role; installs |
| B6 | Canonical web copy | ✅ resolved (Q1) | — |

### What a self-run screenshot pass can and cannot cover

- **Can:** every screen reachable by navigation, per role; empty states (fresh test user); validation errors; loading states (throttled network in web; timed captures in mobile); long-content states; web at 1440/768/390 px widths; iOS; Android once an APK is built.
- **Cannot, or only partly:** camera flows (business-card scan, QR scan: the simulator has no camera, so only permission and fallback screens); real push notifications (can be simulated with `simctl push`); real purchases (StoreKit/RevenueCat sandbox only); third-party OAuth screens (HubSpot/Salesforce login); anything behind paid actions (see guardrails).

### Guardrails proposed for any self-run (need approval)

1. **Never confirm paid or external side-effect actions:** enrichment/contact purchase (Apollo, Cognism, FullEnrich), AI Find Leads runs (Gemini + Google Places cost), subscription purchase, CRM sync/upload (HubSpot, Salesforce, Pipedrive, Karma), MCP sync, emails/invites to real addresses. Capture up to the confirm step only, unless the user allows a specific one.
2. **Don't disturb the user's booted simulator:** install the same build on a second simulator (e.g. iPhone 17 Pro, iOS 26.5) and drive that one.
3. **Use dedicated test accounts** (one per role) on staging (mobile) and local `territool_beta` (web), never real customer accounts. The live account in `package.json` is off-limits.
4. Tools installed **outside `repos/`**: Maestro to `~/.maestro`, Playwright + Chromium under `territool-brain/tools/`, ffmpeg via Homebrew. An Android debug build would write build artifacts inside `repos/mobile/android/app/build` (gitignored), which is an exception to the read-only rule and needs explicit OK.
5. Screenshots land in `shoebox/02-mobile/screenshots/<flow>/` and `shoebox/03-web/screenshots/<flow>/` using the README naming, plus a `CAPTURED-BY-CLAUDE.md` manifest (date, build, account role, URL/screen) so they're traceable.

### Follow-up from user (USER SAID, 2026-09-15)

- Items 1–5 above (test logins, installs, paid-action rules, Codex runner, loop safeguard) are **deferred**. The user will create users and setups and provide them later.
- **HARD RULE: no change to production, ever.** Once access exists, Claude may create **test payment setups on staging** to test with.
- S5 (LAN-exposed `.env`) is unanswered and remains unchanged.
- **Staging test accounts provided** for Sales Agent, Business Sales Agent and Business Agent (Manager). **Admin is pending.** Credentials are stored only in `territool-brain/.local/test-accounts.md` (gitignored, owner-only permissions) and must never be copied into `brain/`, `workspace/` or reports. They haven't been used to log in yet.
- Phase 1 started on the basis that it needs none of the deferred items.

### Proposed loop safeguard (adapting Q11)

No fixed iteration cap. The loop runs until every gate item passes, **but** it stops and escalates to the user when (a) the same gate item fails in 3 consecutive iterations with no measurable progress, (b) a fix needs a product/design decision, or (c) a fix would touch a BLOCKER flow outside the change's scope. This keeps "until 100%" without letting it spin forever or quietly widen scope.

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (41)

**Documents (18):** [[CLAUDE-CODE-BOOTSTRAP|Claude Code Bootstrap Prompt]] · [[brain/assets/brand/design-system-notes/Design-Tokens|Design tokens]] · [[brain/assets/docs/mobile-ui-prompts/INLINE_STYLE_AUDIT|Inline CSS / Style Audit Report]] · [[shoebox/00-INDEX|Inputs checklist]] · [[shoebox/09-known-issues/fragile|Known issues draft]] · [[log|Log]] · [[shoebox/07-flows/flows|Original flow descriptions]] · [[brain/context/flows|Product features list]] · [[brain/memory/entries/incident/20260917-ef8968-production-config-exposure|Production config near-miss: mobile API URL and production MCP servers (2026-09-17)]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/conventions-shared|Rules for all code]] · [[brain/assets/brand/coverage-notes/Screenshot-Video-Index|Screenshot and video index]] · [[brain/context/stack|Tech setup & environments]] · [[brain/assets/brand/design-brain-root/MASTER-DESIGN-BRAIN|TerriTool Mobile — Master Design Brain]] · [[brain/assets/brand/design-brain-root/MINI-DESIGN-BRAIN|TerriTool Mobile — Mini Design Brain]] · [[brain/assets/brand/design-system-notes/Token-Inconsistencies|Token inconsistencies (do not normalize)]] · [[brain/context/conventions-web|Web app coding rules]] · [[brain/assets/screenshots/web/CAPTURED-BY-CLAUDE|Web screenshots — CAPTURED BY CLAUDE]]

**Coding rules (5):** [[_id/D4|File naming]] · [[_id/D5|New code only]] · [[_id/D2|Only Container from NativeBase]] · [[_id/D3|Pressable for rows, AppButton for buttons]] · [[_id/D1|Use moment for dates]]

**Code files (18):** [[_code/mobile/App/components/findLeads/aiFindLeads.js|aiFindLeads.js]] · [[_code/mobile/App/utils/API.js|API.js]] · [[_code/mobile/App/components/route/basic/index.js|basic/index.js]] · [[_code/web/app/Api/V2/Controllers/CompanyController.php|CompanyController]] · [[_code/web/app/Http/Controllers/CompanylController.php|CompanylController]] · [[_code/mobile/App/config/index.js|config/index.js]] · [[_code/mobile/App/components/route/congContact/index.js|congContact/index.js]] · [[_code/mobile/App/components/company/create/index.js|create/index.js]] · [[_code/mobile/App/components/customcompany/index.js|customcompany/index.js]] · [[_code/mobile/App/components/dashboard/editstatus.js|editstatus.js]] · [[_code/mobile/App/storage/fcmrealm.js|fcmrealm.js]] · [[_code/mobile/App/components/findLeads/index.js|findLeads/index.js]] · [[_code/web/app/Globals/Helper.php|Helper]] · [[_code/web/app/Http/Controllers/HubSpotController.php|HubSpotController]] · [[_code/mobile/App/components/register/postSignupPaywallFlow.js|postSignupPaywallFlow.js]] · [[_code/mobile/App/storage/realm.js|realm.js]] · [[_code/web/app/Api/V2/Controllers/RouteController.php|RouteController]] · [[_code/mobile/App/SplashVisibilityContext.js|SplashVisibilityContext.js]]

%% brain-links:end %%
