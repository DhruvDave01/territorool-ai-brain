---
id: 03-architecture
parent: core
sources:
  - TerriTool/init.js
  - TerriTool/App/App.js
  - webterritool/docs/MCP-Manager-Portal-Feature-Gap.md
  - "app/UserMcp/Services/Tools/{Account,Companies,Contacts,Leads,Manager,Routes}Tools.php"
  - app/UserMcp
related:
  - 10-mobile-app.md
  - 11-web-backend.md
  - 14-mcp.md
  - 18-cross-system-flows.md
  - appendix-c-footer-tabs.md
  - 07-vocabulary.md
  - 09-credits-billing.md
  - features/07-ai-find-leads.md
---
# 3. Architecture and data flows

Related: [10-mobile-app](10-mobile-app.md) · [11-web-backend](11-web-backend.md) · [14-mcp](14-mcp.md) · [18-cross-system-flows](18-cross-system-flows.md)

## 3.1 System map

```
Field rep / manager
  ├── iOS / Android (React Native)
  │     FormData + JWT ──► /index.php/api/{endpoint}
  │     Realm (JWT, tours, AI cache, offline route blob)
  │     RevenueCat ──► API revenuecate-success
  │     FCM / Notifee, Sentry, PostHog, Facebook SDK
  │
  ├── Browser (Blade + jQuery 2 + AdminLTE BS3)
  │     session cookie ──► routes/web.php
  │     Manager portal: Vite + React 18 under /manager/*
  │     HQ: Backpack /hq/* (Admin only)
  │
  └── AI clients (Cursor / Claude / ChatGPT)
        OAuth ──► User MCP /ai/mcp  ──► dispatch /api/v2 as that user
        Admin ──► /ai/mcp-admin (read-only TerriTool DB)
        Find  ──► /find-mcp/mcp (leads/contacts subset)

Laravel 7
  ├── app/Http/Controllers          web (CompanylController ~8.5k LOC)
  ├── app/Api/V2/Controllers         mobile JSON
  ├── app/UserMcp | AdminMcp | FindMcp
  ├── app/Helpers/helpers.php       Helper:: geocode, save AI leads, credits
  ├── MySQL (primary) + Mongo (cities/geo via moloquent)
  └── Stripe / PayPal / RevenueCat webhooks
```

## 3.2 Mobile startup

```
index.js
  └── import ./init.js     ATT, Sentry, PostHog, crash handlers, FCM, Facebook App ID
  └── AppRegistry 'TerriTool' → App/App.js

App/App.js
  └── JWT Realm id "1"?
        yes → RevenueCat identify → free-trial? SubscriptionGate : Dashboard
        no  → Login
```

Sources: `TerriTool/index.js`, `TerriTool/init.js`, `TerriTool/App/App.js`.

One **flat** `createNativeStackNavigator()` — no nested stacks, no React Navigation tabs. Module switching is `CustomFooter` (`selectedIndex` 1–6). See [appendix-c-footer-tabs.md](appendix-c-footer-tabs.md).

## 3.3 Web request flow

```
Browser → routes/web.php → middleware (auth, role, manager.only)
        → Controller → Model / Helper → Blade (or JSON for /manager/api/*)

Mobile  → routes/api.php  Dingo v2 + jwt.refresh → Api\V2\* → JSON
```

| Middleware | Class | Behavior |
|------------|-------|----------|
| `role` | `CheckUserRole` | Admin → `/hq/dashboard`. Sales / Business / BSA stay in the app |
| `manager.only` | `EnsureManagerRole` | Only Business Agent on `/manager/*`; BSA → `/dashboard` |
| `jwt.refresh` | `authJWT` | API auth group |

## 3.4 Core field data flow

```
1. Find leads     find_ai_leads / getAILeadsV2     FREE (search)
2. Save leads     save_ai_leads / saveAILeads      1 credit each (trial pkg 1 cap 60)
3. Find contacts  find_contacts / fetchAllContacts   FREE (discovery)
4. Buy contacts   buy_contacts                      2 paid / 1 free (Claude/biz)
5. Lists          createList                       FREE
6. Route          createroute / create_route       FREE; MCP publishes + activates
7. Drive          next_waypoint, mark_visited      FREE
8. Log            add_activity, add_note           FREE
```

**Saved vs new:** unsaved AI results are **leads**. Saved Address Book rows are **companies**. Never `search_companies` for brand-new prospects; never `add_company` for AI search hits (that skips credit + AI-save path).

See [07-vocabulary.md](07-vocabulary.md) and [09-credits-billing.md](09-credits-billing.md).

## 3.5 AI Find Leads pipeline (web V2)

```
Stage 1  Gemini strategy planner   territory + sell description → search_terms, filters
Stage 2  Google Places Text Search  parallel terms, paging, dedupe, hard filters, SSE
Stage 3  Gemini refinement          optional qualitative filter (reviews, specialties)
Persist  user_ai_search
Save     Helper::saveAILead → companies + used_credit
```

| Client | Sequence |
|--------|----------|
| Web SSE | `/ai-lead-finder/start\|stage1\|stage2\|stage3\|complete` + `GET status` |
| Mobile | `getAILeadsV2` → poll `resumeAILeadSearch` / `getAiLeadData` → `saveAILeads` |

**Second engine:** manager portal Places-circle hunt (`ai_search_by = manager_portal`) is **not** the same as user V2 city/ZIP. See `webterritool/docs/MCP-Manager-Portal-Feature-Gap.md` and [features/07-ai-find-leads.md](features/07-ai-find-leads.md).

## 3.6 MCP execution rule

User MCP **does not reimplement** business logic. Tools are either:

- `api` passthrough mapped onto `/api/v2`, or
- `handler` in `app/UserMcp/Services/Tools/{Account,Companies,Contacts,Leads,Manager,Routes}Tools.php` that still dispatches those APIs.

Delete `app/UserMcp` + unregister the provider to remove the customer MCP. Full catalog: [14-mcp.md](14-mcp.md).
