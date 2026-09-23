---
id: env-inventory
parent: ops
related:
  - ops/release-flavor-matrix.md
  - 17-integrations.md
---
# Env / secrets inventory (names only)

Related: [ops/release-flavor-matrix.md](release-flavor-matrix.md) · [17-integrations](../17-integrations.md)

**Never copy values into this vault, chats, or git extras.** List names so agents know what exists. Live values live in `.env` (web) and `App/config/index.js` / native plists (mobile).

## Mobile (`TerriTool/App/config/index.js` + native)

| Name / constant | Purpose | Where |
|-----------------|---------|--------|
| `URL_BASE` | API host (comment-swap staging vs prod) | `config/index.js` |
| `SUBSCRIPTION_URL` | Web subscription | same |
| `POSTHOG_API_KEY` | Analytics (`phc_…`) | config |
| `POSTHOG_HOST` | PostHog host | config |
| `GOOGLE_API_KEY` | Places / Maps | config |
| `GEMINI_API_KEY` | Business card + related | config |
| `DIRECTION_APIKEY` | Legacy Google Directions name | config (polylines actually use Mapbox) |
| `MAPBOX_ACCESS_TOKEN` | Directions v5 | config |
| `REVENUECAT_KEY_IOS` | IAP (`appl_…`) | `RevenueCatService.js` |
| `REVENUECAT_KEY_ANDROID` | IAP (`goog_…`) | `RevenueCatService.js` |
| Facebook App ID | SDK / URL scheme `fb…` | `init.js`, `Info.plist` |
| Sentry DSN | Crash/error | `init.js` |
| Firebase | FCM / Crashlytics | `google-services.json`, `GoogleService-Info.plist` |

Staging vs prod is **not** `.env`: uncomment the STAGING `URL_BASE` block and comment PROD (or the reverse).

## Web Laravel (`env('…')`)

### App / DB

`APP_NAME`, `APP_ENV`, `APP_DEBUG`, `APP_URL`, `APP_KEY`, `APP_LOG`, `APP_LOG_LEVEL`, `LOG_MAX_FILES`, `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`, `SALES_DESK_DB_*`, `MONGO_DB_HOST`, `MONGO_DB_PORT`, `MONGO_DB_DATABASE`, `MONGO_DB_USERNAME`, `MONGO_DB_PASSWORD`, `REDIS_HOST`, `REDIS_PASSWORD`, `REDIS_PORT`, `QUEUE_DRIVER`, `SESSION_*`.

### Product APIs

`GEMINI_API_KEY`, `GOOGLE_KEY`, `COGNISM_API_KEY`, `OPENCORPORATES_API_KEY`, `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, `ANTHROPIC_VERSION`, `CLAUDE_CONTACT_FINDER_*`, `POSTHOG_API_KEY`, `POSTHOG_HOST`, `POSTHOG_ENVIRONMENT`.

### Billing / CRM

`STRIPE_KEY`, `STRIPE_SECRET`, `REVENUECAT_SECRET_API_KEY`, `HUBSPOT_CLIENT_ID`, `HUBSPOT_CLIENT_SECERET` (typo in config), `HUBSPOT_RETURN_URL`, `SALESFORCE_USERNAME`, `SALESFORCE_PASSWORD`, `SALESFORCE_TOKEN`, `SALESFORCE_WSDL`, `SALESFORCE_CLIENT_ID`, `SALESFORCE_REDIRECT_URI`.

### Mail / comms

`MAIL_*`, `MAILGUN_DOMAIN`, `MAILGUN_SECRET`, `SES_KEY`, `SES_SECRET`, `SPARKPOST_SECRET`, `LOOPS_API_KEY`, `LOOPS_TRANSACTIONAL_URL`, `SUPPORT_EMAIL_1` … `SUPPORT_EMAIL_10`, `SMARTLOOK`.

### MCP

`TERRITOOL_APP_MCP_*`, `TERRITOOL_FIND_MCP_*`, `MCP_OAUTH_*`, `MCP_PATH`, `MCP_API_KEY`, `MCP_READ_DB_CONNECTION`, `MCP_WRITE_DB_CONNECTION`, `MCP_OAUTH_EXTRA_REDIRECT_URIS`.

### AI Brain graph chat (`AI_BRAIN/.env` / Vercel)

`ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, `ANTHROPIC_VERSION`, `GRAPH_CHAT_SECRET` (optional lock on Ask), `GRAPH_CHAT_PORT`, `BRAIN_PUBLIC_URL`, `GMAIL_TOKEN_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GMAIL_REFRESH_PICWA`, `GMAIL_REFRESH_TERRITOOL`.

### Trials / sheets / TikTok config keys

`TRIAL_NUDGE_PUSH_*`, `TRIAL_EXTEND_*`, `TRIAL_EXPIRED_*`, `ONBOARDING_SEGMENT_EMAIL_*`, `GOOGLE_SHEETS_*`, `TIKTOK_PIXEL_ID`, `TIKTOK_EVENTS_ACCESS_TOKEN`, `JWT_SECRET`, `JWT_BLACKLIST_ENABLED`.

Public URL defaults in config (not secrets): Calendly, App Store, `https://app.territool.com/…`.
