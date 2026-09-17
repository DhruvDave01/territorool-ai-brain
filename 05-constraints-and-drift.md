---
id: 05-constraints-and-drift
parent: core
sources:
  - App/App.js
  - App/config/index.js
related:
  - 04-style-guide.md
  - 20-how-to-update.md
  - screens/navigation-map.md
  - ops/known-bugs.md
  - code/MOBILE_CODEBASE_BRAIN.md
  - code/WEB_CODEBASE_BRAIN.md
  - 2026-09-17.md
---
# 5. Durable facts, constraints, known drift

Related: [04-style-guide](04-style-guide.md) · [20-how-to-update](20-how-to-update.md) · [screens/navigation-map](screens/navigation-map.md) · [MOBILE_CODEBASE_BRAIN](code/MOBILE_CODEBASE_BRAIN.md) · [WEB_CODEBASE_BRAIN](code/WEB_CODEBASE_BRAIN.md) · [ingest 2026-09-17](2026-09-17.md)

Code wins over Prompts and old docs. When they disagree, add a row here.

## 5.1 Constraints

| Constraint | Fact |
|------------|------|
| Mobile Node | `>= 22.11.0` |
| iOS deployment | 15.5 |
| Android | minSdk 24, target 36, Java 17 |
| Web PHP / Laravel | 7.2 / 7.x |
| Front classic | jQuery 2.2.0, Bootstrap 3 |
| Front manager | Vite + React 18 islands; parent layout still AdminLTE (`body.manager-portal`) |
| JWT | `tymon/jwt-auth` 0.5 (require-dev) + Dingo + Passport also registered |
| Cron | Public GET URLs on `CronController`, not `Kernel::schedule()` |
| README web | Stock Laravel README — **not** product docs |
| Single-user device | One JWT row id `"1"` |
| ChatGPT MCP | ~16 tools / ~5000 tokens; truncated catalogs |
| Two AI engines | User V2 city/ZIP vs manager Places circles |

## 5.2 Known drift (docs vs live code)

| Claim in old docs | Live truth |
|-------------------|------------|
| ~30 screens | `App/App.js` registers **46** `Stack.Screen` names (Design Brain pack still says 47 — code wins) |
| Realm “schema 20” | npm package is Realm **20.2.0**; `App/storage/realm.js` **`schemaVersion: 18`**. `fcm.realm` is version **1** |
| Mobile JWT refresh | **None** in `App/utils/API.js` — Bearer from Realm `"1"` only. Web Dingo still has `jwt.refresh` |
| Onboarding / paywall “deferred” | **Visual pack skipped captures.** Live JS: Register `PostSignupPaywallFlow`, `SubscriptionGate`, `firstSignUpOnboarding` → `MultipleAIWaypoint`. Map: [screens/navigation-map.md](screens/navigation-map.md) |
| `ClusterList` | `route/index.js` and `navigateToRouteDetail.js` `navigate("ClusterList")` — **not registered** in `App.js` |
| TikTok SDK / `TikTokHelper.js` | README/Prompts mention it; **file missing**. AI UI copy may say “Scanning TikTok” |
| Redux | **None** |
| Mobile route PDF | **No** in-app PDF; email share only. Web has TCPDF/dompdf |
| `createOFFLINERoute` | **No call sites**; list screen still **reads** offline blob |
| Yelp on mobile | No Yelp constant in `App/config/index.js`; web/API have `getYelpLeads` |
| MCP playbook “no create company/contact” | **Stale.** User MCP now has `add_company` / `add_contact` |
| Company statuses hard-coded in mobile | **Server-driven** `user_status` / `getuserstatusdetails` |
| Prompts `App.tsx` | Entry is `App/App.js` (JS) |
| package.json Android 4.2.7 | Gradle may be `4.4.70` |
| “Name-only contact buy = 1 credit” | Live `contactBuyCredits.js`: `CONTACT_BUY_CREDITS_NAME_POSITION_ONLY` and `…_WITH_EMAIL_OR_PHONE` are both **2**. Claude/biz remains **1** (`CONTACT_BUY_CREDITS_BIZ_CLAUDE`) |
| Design MINI “API in this tree points at staging” / older notes “URL_BASE is prod” | **2026-09-17 live:** `URL_BASE` is **staging** `https://staging.territool.com/index.php/api/` (comment: `STAGING — temporary for screenshot login`). Prod block is commented. `IS_STAGING_OR_DEV_BUILD` is true while staging is active. |
| User MCP `1.4.0` | Live `territool_app.php` version **`1.4.1`**. Extra manager-only tools: `get_team_territories`, `recommend_lead_distribution` (33 tools total). |

## 5.3 Do not

- Do not use `add_note` for a named person, a status, or a visit-as-CRM-event.
- Do not use `set_company_status` as a note.
- Do not `buy_contacts` for a person the user already knows — `add_contact` is free.
- Do not `add_company` for AI Find Leads hits — `save_ai_leads` (credits).
- Do not tell a voice user to “scroll” or “see next page”.
- Do not point MCP `create_route` at Draft — it **publishes** and returns `route_url`.
- Do not act as Admin tools on the user MCP, or write TerriTool DB from Admin MCP (`read_only`).
