---
title: "System overview"
---

# System overview

Evidence: [../discovery-report.md](../../discovery-report.md). Do not assume extra services.

## Shape

One Laravel process serves:

1. **Web** — session cookie, `routes/web.php`
2. **JSON API v2** — JWT, Dingo, `routes/api.php`
3. **Customer / Find / Admin MCP** — HTTP JSON-RPC (+ Admin stdio)

React Manager Portal is a Vite bundle loaded by Blade shells, talking to `/manager/api/*` on the same app.

Mobile native apps are **clients of v2**, not this repo.

```
                    ┌─────────────────────────────────────┐
  Browser session ─►│  Laravel monolith                   │
  JWT mobile ──────►│   web.php │ api.php (v2) │ MCP HTTP │──► MySQL territorool
  MCP OAuth ───────►│   Helper / jobs / Eloquent          │──► Mongo (geo) UNKNOWN prod use
                    │   Manager JSON  │ Backpack /hq      │──► sales_desk (Admin MCP)
                    └─────────────────────────────────────┘
                              │
                    Google Places, Gemini, FullEnrich, Claude,
                    Stripe/PayPal/RevenueCat, SFDC/HubSpot/Karma,
                    FCM, Sentry, PostHog
```

## Rule: reuse v2 / Helper

Customer MCP is explicitly a façade over mobile v2 (`app/UserMcp/config/territool_app.php`). New field-rep behavior that only exists on a Blade page will **not** appear on phone or MCP until it is on v2 (or Helper used by both).

## Boundaries

| Do | Don't |
|----|-------|
| Add field-rep writes in Helper / v2, then web + MCP call them | Reimplement credit logic in a React component or MCP tool |
| Put Manager-only UX in `resources/manager-portal/` + `ManagerDashboardController` | Import React into Find Leads Blade |
| Treat Admin MCP as staff read models | Expose Address Book writes on Admin MCP |

## Generated map

725 routes (as of 2026-09-16): `knowledge/code/ROUTEMAP.md`.
