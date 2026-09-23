---
title: "Dependencies"
---

# Dependencies

Facts from `composer.lock` / `composer.json` / `package.json` as of the 2026-09-16 discovery pass. Do not add packages unless asked.

## Runtime (PHP)

| Fact | Value |
|------|--------|
| PHP constraint | `^7.2` (this machine's CLI: **7.4.33**) |
| Installed Laravel | **5.3.31** (`composer.lock`) |
| `composer.json` allows | `"^7.0\|5.3.31"` |

Notable Composer: Backpack 3.x, Dingo API, JWT (`tymon/jwt-auth` in require-dev), Passport, Stripe, PayPal SDK, Maatwebsite Excel 2, Moloquent, FCM, Sentry Laravel 2.5, PostHog, Google API client, Google Maps PHP, TCPDF/DomPDF, Pipedrive, Captcha.

Salesforce lives in `packages/davispeixoto/`, not Packagist.

PHPUnit **5.7.27**.

## Frontend (npm)

| Fact | Value |
|------|--------|
| Manager | React 18 + Vite 5 (`resources/manager-portal/`) |
| Maps | Leaflet + Turf |
| Payments JS | RevenueCat JS |
| Legacy | Blade + jQuery + Bootstrap 3 + AdminLTE + jqxGrid |
| Leftover | Vue 2 + Elixir/`gulpfile.js` (Passport Vue); not the Manager app |

`package.json` has `"test:e2e": "playwright test"` and `@playwright/test`, but **no** `playwright.config.*` and no specs. Do not report that script as a passing suite.

## Integrations (keys in env)

Google Places / Maps, Gemini, FullEnrich, Anthropic/Claude, Stripe, PayPal, RevenueCat, Salesforce, HubSpot, KarmaCRM, FCM, Sentry, PostHog.

FullEnrich key is **not** in `config/services.php` — wiring UNKNOWN. Pipedrive may be leftover.

Deep: [../architecture/integrations.md](architecture/integrations.md).
