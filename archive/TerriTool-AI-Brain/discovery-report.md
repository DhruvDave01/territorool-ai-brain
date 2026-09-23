---
title: "Discovery report"
---

# Discovery report

**Created:** 2026-09-16  
**Method:** Inspected the live repository (composer.lock, routes, controllers, MCP modules, tests, Cursor config, and copied product/engineering markdown now in this folder). Not a live runtime probe of staging or a running local server.  
**Rule:** Facts below are from files. Anything not proven is marked `UNKNOWN — needs verification`.

This Engineering Brain lives in `/TerriTool AI Brain`. Product facts, use cases, flows, MCP contract, code maps, skills, and loops are **all in this folder**.

---

## Repository

| Fact | Evidence |
|------|----------|
| Single Laravel monolith named `laravel/laravel` | `composer.json` |
| Installed framework: **Laravel 5.3.31** | `composer.lock` (`laravel/framework` version `v5.3.31`) |
| `composer.json` allows `"laravel/framework": "^7.0\|5.3.31"` and `"php": "^7.2"` | `composer.json` |
| Cursor rules and product docs say **Laravel 7 / PHP 7.4** | `.cursor/rules/TerriTool-Project.mdc`, `product/overview.md` |
| Root `readme.md` is the stock Laravel framework readme — not a product readme | `readme.md` |
| No `.env.example` | glob: missing |
| No Docker / docker-compose | glob: missing |
| No project CI (no `.github/`, no Bitbucket/GitLab/Circle configs) | glob: missing |
| `scripts/` directory is empty | listing |
| Mobile app source is **not** in this repo; APK + Play Store pointer exist | `public/territool.apk`, `version.json` (`com.picwa.territoolapp`) |

### Applications / services in this repo

| Application | Location | Role |
|-------------|----------|------|
| Web app (Blade + jQuery) | `app/`, `resources/views/`, `routes/web.php` | Primary field-rep + HQ UI |
| Manager Portal (React) | `resources/manager-portal/` → `public/js/manager-portal.js` | Business Agent cockpit |
| Mobile JSON API (Dingo v2 + JWT) | `routes/api.php`, `app/Api/V2/` | iOS/Android + internal MCP reuse |
| Customer MCP (`territool-app`) | `app/UserMcp/` | Sales Agent / BSA tools at `{APP_URL}/ai/mcp` |
| Find MCP | `app/FindMcp/` | Lead/contact subset at `{APP_URL}/find-mcp/mcp` |
| Admin MCP | `app/AdminMcp/` | Staff read-only HQ tools at `{APP_URL}/ai/mcp-admin`; also `php artisan mcp:stdio` |
| In-app MCP client | `app/McpClient/` | Settings → connect a *remote* MCP (not the three servers) |
| Local Salesforce packages | `packages/davispeixoto/` | CRM integration |
| This Engineering Brain | `TerriTool AI Brain/` | Product facts, use cases, flows, MCP contract, code maps, skills |

**Not in this repo:** iOS/Android source, production deploy pipeline, Playwright Test specs.

### Frontend / backend technologies

| Layer | Tech | Evidence |
|-------|------|----------|
| Backend | PHP `^7.2`, **installed Laravel 5.3.31** | `composer.json`, `composer.lock` |
| Admin | Backpack CRUD 3.x | `composer.json`, `app/Http/Controllers/Admin/` |
| API | Dingo API, JWT (`tymon/jwt-auth`), Passport present | `composer.json`, `config/api.php`, `config/auth.php` |
| Legacy UI | Blade + jQuery + Bootstrap 3 + AdminLTE + jqxGrid | `resources/views/front/`, `public/js/`, `architecture/stack-migration-map.md` |
| Manager UI | React 18 + Vite 5 | `package.json`, `vite.config.js` |
| Legacy Vue | Vue 2 + Laravel Elixir (`gulpfile.js`); Passport Vue components | `resources/assets/js/` |
| Maps | Leaflet, Turf, Google Maps PHP client | `package.json`, `config/googlemaps.php` |
| Payments JS | RevenueCat JS | `package.json`, `resources/js/revenuecat.js` (load path **UNKNOWN**) |

### Packages (notable Composer)

Backpack suite, Google Maps, TCPDF/DomPDF, Pipedrive, Maatwebsite Excel, Dingo, Passport, Stripe, PayPal, Moloquent, FCM, Sentry, Captcha, Google API client, PostHog.

---

## Architecture

### Major components

```
Browser (session) ──► routes/web.php ──► Controllers ──► MySQL (territool)
                         │                      │
                         │                      ├─ Helper / jobs / services
                         │                      └─ Blade views (legacy) or Manager JSON
                         │
Mobile / MCP ──► Dingo /api/v2 (JWT) ──► app/Api/V2 ──► same models / Helper
                         ▲
Customer/Find MCP HTTP OAuth ──► AppMcpProtocolService ──► CustomerApiClient (internal v2 dispatch)
```

Evidence: `app/UserMcp/config/territool_app.php` (comment: every tool dispatches existing mobile `/api/v2` via Dingo). Composite tools listed in `app/UserMcp/Services/AppMcpProtocolService.php`.

### Architectural boundaries (real)

1. **One product, three clients** — web session, mobile JWT, MCP OAuth — should share credit/route/company rules via v2 + Helper, not a second implementation.
2. **Two frontend stacks** — everything except Manager Portal is Blade/jQuery; Manager Portal is React/Vite only (`stack-migration-map.md`, `vite.config.js`).
3. **MCP modules are deletable packages** — unregister provider in `config/app.php` (stated in `territool_app.php`).
4. **Admin MCP is a different product surface** — HQ lookups, not Address Book writes (`app/AdminMcp/config/mcp.php`).
5. **V1 API is dead** — fully commented in `routes/api.php`.
6. **HQ vs Manager vs Rep** — `/hq` Backpack admin, `/manager` Business Agent, unprefixed web = field rep.

### Data flow (canonical happy path, from product docs + routes)

Guest → trial/login → onboarding (field vs manager) → Dashboard → Find Leads (free search) → save (1 credit) → Address Book company → List and/or Route → publish route → visit / activity → optional CRM sync.

Evidence: `product/FLOWS.md`, `routes/web.php`, `routes/api.php`.

### Databases

| Store | Role | Evidence |
|-------|------|----------|
| MySQL `territool` (default) | Product data | `config/database.php`; live schema documented in `code/data-model-reference.md` (83 tables as of 2026-09-15) |
| MySQL `sales_desk` | Admin MCP / Sales Desk | `config/database.php` |
| MongoDB (Moloquent) | Geo collections (`cities_collection`, etc.) | `app/Models/MongoDB/*`, `config/database.php` |
| Redis | Configured | `config/database.php` — **UNKNOWN** whether used in production vs array/file cache |

**Do not trust** `database/webterritool.sql` (2021, 37 tables). Live DB also contains unrelated `coffee_*` / `bookings` tables — out of scope.

### Dependencies between surfaces

| From | To | How |
|------|----|-----|
| UserMcp tools | Dingo v2 | `CustomerApiClient` |
| FindMcp tools | Same v2 subset | `app/FindMcp/` |
| Manager Portal | `/manager/api/*` | `ManagerDashboardController` |
| Web Find Leads | `AILeadFinderController` + `Helper::saveAILead` | `routes/web.php`, `AILeadFinderController@saveLeads` |
| Mobile save leads | `CompanyController@saveAILeads` | `routes/api.php` |

---

## Product

Source of truth for *behavior*: `features/*/MODULE.md`.  
Source of truth for *terms*: `product/glossary.md`.

### What TerriTool does

Field sales territory platform. One account, one database. A company saved from Find Leads is the same company on the map, list, route, and CRM sync.

### Major capabilities

1. Address Book (companies, contacts, notes, status)
2. Find Leads (AI: Google Places + Gemini; also Yelp path)
3. Contact find/buy (FullEnrich 2 credits, Claude 1 credit)
4. Lists
5. Optimized Routes (draft → processing → published; extra statuses exist in DB)
6. Visits, activities, meetings
7. CRM: Salesforce, HubSpot, KarmaCRM
8. Subscription + credits (Stripe, PayPal, RevenueCat)
9. Manager Portal (team, assign leads, KPIs)
10. Admin HQ
11. MCP / voice as another client of the same product

### Primary workflows

See `product/FLOWS.md`. Engineering index: [ui-flows/README.md](ui-flows/README.md).

### Credit rules (must not silently change)

| Action | Credits |
|--------|---------|
| Search / browse / contact counts | 0 |
| Save one AI lead | 1 |
| Buy contact via FullEnrich | 2 |
| Buy contact via Claude | 1 |

Buy is never free. Live fetch is FullEnrich then Claude only.

---

## UI

### Major screens (rep, subscription active)

From `resources/views/front/inc/sidebar.blade.php` + OVERVIEW:

- Dashboard `/dashboard`
- Address Book `/company`
- Find Leads `/findleads`
- Recently Added `/recent-company`
- Routes `/routes`
- Lists `/lists`
- Settings (salesperson profile)

### Manager screens (React mounts)

Dashboard, AI Find Leads, Salespeople, Activity, Support, Settings. Blade shells under `resources/views/front/manager/` with root divs listed in `stack-migration-map.md`.

`reports.blade.php` mount path: **UNKNOWN — needs verification**.

### HQ

`/hq/*` Backpack admin. Evidence screenshots exist but are not fully UC-mapped (`LAST_VERIFIED.md`).

### Navigation / permissions

- `auth`, `subscriber`, `role`, `manager.only` middleware (`app/Http/Kernel.php`)
- Sales Agent with no plan → paywall before Dashboard / Find Leads (product docs)
- MCP: Sales Agent + Business Sales Agent, `status == Active` only

---

## Testing

| Kind | Status | Evidence |
|------|--------|----------|
| PHPUnit ~5 | Present, **4 real tests + 1 example** | `phpunit.xml`, `tests/*.php` |
| Manager unit-style | `ManagerDashboardTerritoryVisitTest`, `ManagerDashboardFieldSalesScoringTest`, `ManagerFindLeadsServiceTest` | `tests/` |
| `ExampleTest` | Hits `/` expecting "Laravel" — likely stale vs real home | `tests/ExampleTest.php` |
| Playwright Test (`npm run test:e2e`) | Script + dep exist; **no `playwright.config.*`, no specs** | `package.json` |
| Playwright MCP | Configured in Cursor; session dumps in `.playwright-mcp/` | `.cursor/mcp.json` |
| Jest / Vitest | Absent | `package.json` |
| MCP / API / React tests | Absent | glob |

**Gap:** Almost no automated regression. UI/credit/MCP changes must be verified by running the product (see [skills/verify-ui.md](skills/verify-ui.md)).

---

## MCP

### Existing (in-app, Laravel HTTP)

| Server | Endpoint | Tools (config) |
|--------|----------|----------------|
| UserMcp | `{APP_URL}/ai/mcp` | 26 tools in `app/UserMcp/config/territool_app.php` including search/add company, AI leads, routes, lists, visits, credits, contacts |
| FindMcp | `{APP_URL}/find-mcp/mcp` | `find_ai_leads`, `resume_ai_lead_search`, `save_ai_leads`, `search_companies`, `find_contacts`, `buy_contacts`, `get_credits` |
| AdminMcp | `{APP_URL}/ai/mcp-admin` | Read-only subscriber/trial/credit lookups; stdio via `php artisan mcp:stdio` |

Customer MCP composite handlers: `app/UserMcp/Services/AppMcpProtocolService.php` `$handlers`.

**Note:** Cursor/Claude session tools include `view_company` / `view_list` (singular) in the MCP namespace instructions. Those names are **not** in `territool_app.php`. Live tools are `search_companies`, `view_lists`, `view_route`. Treat catalog docs as source of truth over chat-tool wrappers.

### Existing (Cursor-only)

| Server | Config | Purpose |
|--------|--------|---------|
| Sentry | `.cursor/mcp.json` URL `https://mcp.sentry.dev/mcp/territool/territoolre-web` | Error investigation |
| Playwright MCP | `.cursor/mcp.json` → `npx @playwright/mcp@latest` | Browser verification |

### Missing MCP capabilities (for Claude+Codex without Cursor)

- Project-level MCP config that is **not** Cursor-only (no root `.mcp.json`, no `claude_desktop_config.json` in repo)
- User/Find/Admin MCP not registered in `.cursor/mcp.json` (they are OAuth HTTP against the running app)
- Playwright **Test** suite (distinct from Playwright MCP)
- CI MCP / GitHub MCP
- Codex-specific MCP wiring — **UNKNOWN** (no `.codex/` in repo)

---

## AI tooling

| Item | Status |
|------|--------|
| `.cursor/rules/TerriTool-Project.mdc` | Always-on Laravel 7 + React conventions (conflicts with lockfile 5.3.31) |
| `.cursor/rules/sentry.mdc` | Sentry org/project slugs |
| `.cursor/mcp.json` | Sentry + Playwright MCP only |
| Cursor commands / prompts / hooks | **Absent** |
| `CLAUDE.md` / `AGENTS.md` at repo root | **Absent** (this Brain adds `TerriTool AI Brain/AGENTS.md`) |
| Codex config | **Absent** |
| Copilot / GitHub agents | **Absent** (no `.github/`) |
| `TerriTool AI Brain/` | Product + engineering maps + skills (this folder) |
| `code/tooling-proposal.md` | Draft lint/CI — **not installed** |
| In-repo `docs/` | **Empty / missing** |

---

## Environment / configuration conventions

No `.env.example`. Inferred categories from config `env()` usage (values not recorded):

- App, log, captcha
- `DB_*`, `SALES_DESK_DB_*`, `MONGO_DB_*`
- Cache / session / queue / redis
- `API_PREFIX`, `API_VERSION`, `JWT_SECRET`
- Stripe, RevenueCat, PayPal (PayPal used in controller; no `config/paypal.php`)
- HubSpot, Salesforce, Pipedrive, Google Maps/Sheets, FCM, Sentry, PostHog, TikTok
- Anthropic / Claude contact finder, Cognism, OpenCorporates, Gemini
- FullEnrich: code reads `config('services.fullenrich.api_key')` in `app/Globals/Helper.php` but **that key is not defined in `config/services.php`** — UNKNOWN how it is actually injected
- MCP OAuth (`TERRITOOL_APP_MCP_*`, `MCP_*`)

Local QA URL: **`http://127.0.0.1:8000/login`** (`npm run serve`). Do not use MAMP `http://localhost:8888/webterritool` or `/webterritool/public`. MySQL often `127.0.0.1:8889` (database only).

---

## Important scripts

| Script | File | What it does |
|--------|------|----------------|
| `npm run dev` / `build` | `package.json` | Vite Manager Portal |
| `npm run serve` | `package.json` | `php artisan serve` |
| `npm run queue` | `package.json` | `php artisan queue:listen` |
| `npm run clear` | `package.json` | artisan config/cache/view clear |
| `npm run test:e2e` | `package.json` | `playwright test` — **not runnable without config/specs** |
| `php artisan mcp:stdio` | AdminMcp | stdio Admin MCP |
| `php artisan territorool-app:qa` (and related) | UserMcp Console | MCP QA helpers |

---

## Documentation in this Brain

| Path | Use it for |
|------|------------|
| `product/` | Product overview, glossary, roles, journeys |
| `features/` | Per-feature MODULE, UCs, flows, limits, errors |
| `code/CODEMAP.md` | Feature → controller owners |
| `code/ROUTEMAP.md` | 725 routes → controller → view (generated snapshot) |
| `code/data-model-reference.md` | Live schema |
| `architecture/stack-migration-map.md` | Which UI stack owns a screen |
| `code/bug-repro-runbook.md` | Playwright MCP repro loop |
| `LAST_VERIFIED.md` | Freshness ledger |
| `mcp/` | Customer MCP contract |
| `app/FindMcp/README.md` | Find MCP tools (in the Laravel app, not this folder) |

---

## Unknowns (need human clarification)

1. **Is production actually Laravel 5.3.31 or has Laravel 7 been deployed from a different lockfile?** Lockfile in this checkout is 5.3.31; docs/rules say 7. This is the highest-severity knowledge conflict.
2. **Production/staging deploy process** — no CI, Docker, Forge, or Envoyer files in repo.
3. **Where mobile source lives** and how it is released (`version.json` / Play Store only here).
4. **FullEnrich API key wiring** — missing from `config/services.php`.
5. **Whether Passport OAuth routes are enabled** — package present; `AuthServiceProvider` does not call `Passport::routes()`.
6. **MongoDB production use** vs leftover.
7. **`revenuecat.js` load path** — possibly dead.
8. **Manager `reports` screen** mount.
9. **Codex CLI availability** on this team — no repo config.
10. **Canonical local URL** — **`http://127.0.0.1:8000/login`**. MAMP `/webterritool/public` is not the QA host.
11. **Whether Cursor MCP `view_company` is a wrapper** around `search_companies` or a stale catalog.
12. **Shared MySQL with coffee/bookings** — who owns that DB and whether it will be split.
13. **Target date for Cursor removal** and whether Claude Desktop vs Claude Code vs Claude.ai is the operator.
14. **Staging credentials / seed users** for automated UI verification — not in repo (correctly).

---

## What this Brain contains

**Includes:** product overview/glossary/roles/flows, feature MODULE + use cases + limits + known issues, MCP contract, CODEMAP/ROUTEMAP/schema, assigned screenshots in `features/*/evidence/`, agent skills, engineering loops (including QA and UI spec), Claude/Codex operating model, Cursor-exit checklist, verification strategy.

**Does not include:** a second knowledge pack, invented architecture, Playwright Test installation, CI pipelines, or production behavior changes. Unassigned captures live in `evidence/` in this same folder.
