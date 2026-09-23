---
title: "Integrations"
---

# Integrations

Configured or called from this repo. Keys live in env/config — never commit secrets into the Brain.

| Integration | Config / code | Used for |
|-------------|---------------|----------|
| Google Maps / Places | `config/googlemaps.php`, Helper, AILeadFinder | Geocode, Find Leads, add company |
| Gemini | `AILeadFinderController` | AI search stages |
| FullEnrich | `Helper` HTTP to `app.fullenrich.com`; webhooks in `routes/api.php` | Paid contact fetch (2 credits). **`services.fullenrich.api_key` not in `config/services.php`** — UNKNOWN injection |
| Anthropic / Claude | `config/services.php`, `config/claude_contact_finder.php`, `ClaudeContactFinderService` | Contact fetch (1 credit) |
| Stripe | `cartalyst/stripe-laravel`, `config/services.php` | Web billing |
| PayPal | REST SDK; `SubscriptionController` | Web billing. No `config/paypal.php` |
| RevenueCat | `config/services.php`, JS package, API webhooks | Mobile/web paywall |
| Salesforce | `config/salesforce.php`, `packages/davispeixoto/`, `SfdcController` | CRM |
| HubSpot | env `HUBSPOT_*`, `HubSpotController`, mapping models | CRM |
| KarmaCRM | `KarmaCrmController` | CRM |
| Pipedrive | `config/services.php` | **UNKNOWN** current product use vs leftover |
| FCM | `config/fcm.php` | Push |
| Sentry | `config/sentry.php` | Errors. MCP: org `territool`, project `territoolre-web` |
| PostHog | `config/services.php` | Analytics |
| TikTok | `config/tiktok.php`, `TikTokEventsService` | Ads events |
| Google Sheets | `config/google_sheets.php` | Ops export |
| Cognism / Apollo / OpenCorporates | env + dead/legacy v2 routes | Historical contact sources — not live fetch |

Webhook routes (api.php) include FullEnrich, RevenueCat, leftover Apollo.

When adding an integration: put config in `config/services.php` (or dedicated file), do not scatter new env reads in Blade.
