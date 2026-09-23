---
title: "TerriTool — Developer Onboarding Guide"
---

# TerriTool — Developer Onboarding Guide

## 1. What TerriTool Is

TerriTool is a **field sales territory management platform** built for sales reps, business clients, and their teams. It helps sales professionals manage territories, discover leads, plan routes, and track companies and contacts — all from a web dashboard or companion mobile app.

### Target Users

| Role | Description |
|------|-------------|
| **Sales Agent** | Individual field sales rep who prospects, plans routes, and manages contacts |
| **Business Agent** | Business client owner who manages a team of sales reps |
| **Business Sales Agent** | Sales rep working under a Business Agent |
| **Admin** | TerriTool internal admin managing users, subscriptions, and settings |

---

## 2. What TerriTool Does

### Core Features

- **Company & Contact Management** — Add companies manually, via bulk CSV upload, or through AI-powered lead discovery. Each company can have contacts with phone, email, position, and notes.

- **AI Lead Finder** — Uses Google Gemini AI to plan search strategies, then queries the Google Places API (New) to find matching businesses in a given territory. Results stream to the browser via SSE (Server-Sent Events) for real-time feedback. An optional refinement stage uses Gemini to filter results by qualitative criteria (reviews, specialties, etc.).

- **Yelp Lead Finder** — Search for businesses using Yelp's API as an alternative lead source.

- **Contact Enrichment** — Fetch contact details (emails, phones, positions) using the two live services: **FullEnrich (2 credits per contact)** and **Claude (1 credit per contact)**. Buy/fetch is **not free**. Bulk Contacts lets users select multiple companies and enrich in one batch.

- **Route Planning** — Create optimized driving routes across companies for field visits. Supports simple routes, advanced routes (with clusters and optimization), and list-based route generation.

- **Lists** — Organize companies into named lists for grouping, bulk actions, and route generation.

- **CRM Sync** — Two-way sync with Salesforce, HubSpot, KarmaCRM, and Pipedrive. Import/export companies and contacts between TerriTool and external CRMs.

- **Subscriptions & Credits** — Monetized via Stripe, PayPal, and RevenueCat (mobile). Users purchase credits to unlock contact details. Promo codes and special discounts are supported.

- **Mobile App** — Native Android and iOS apps with a JWT-based REST API (Dingo API v2 + Laravel Passport).

---

## 3. How the Web App Works

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Laravel 7.x (PHP 7.2+) |
| **Database** | MySQL (primary), MongoDB (geographic data) |
| **Admin Panel** | Backpack for Laravel |
| **Frontend** | Blade templates, jQuery 2.x, Bootstrap 3, AdminLTE |
| **Maps** | Google Maps JavaScript API, Google Geocoding, Google Places API (New) |
| **AI** | Google Gemini API (gemini-2.5-flash) |
| **Payments** | Stripe, PayPal, RevenueCat (mobile) |
| **Auth** | Laravel Auth + Backpack PermissionManager (Spatie roles/permissions) |
| **API** | Dingo API v2 with JWT auth (for mobile app) |
| **Error Tracking** | Sentry (`sentry/sentry-laravel` in `composer.json`) |
| **Push Notifications** | Firebase Cloud Messaging (FCM) |

### Request Flow

```
Browser → routes/web.php → Middleware (auth, role) → Controller → Model/Helper → Blade View
Mobile  → routes/api.php → JWT Auth → API Controller → JSON Response
```

### Authentication & Authorization

- Web login uses Laravel's built-in auth (`Auth/LoginController`).
- Roles are enforced by `CheckUserRole` middleware:
  - **Admin** users are redirected to `/hq/dashboard`.
  - **Sales Agent / Business Agent / Business Sales Agent** users access the main app.
- The admin panel (`/hq/*`) is restricted to Admin role only.

### Key URL Patterns

| URL | Purpose |
|-----|---------|
| `/` | Dashboard |
| `/findleads` | AI + Yelp lead finder page |
| `/ai-lead-finder/stream` | SSE endpoint for AI lead search |
| `/company/*` | Company CRUD |
| `/contact/*` | Contact CRUD |
| `/route/*`, `/routes/*` | Route management |
| `/list/*` | List management |
| `/subscription/*` | Subscription management |
| `/sfdc/*` | Salesforce sync |
| `/hubspot/*` | HubSpot sync |
| `/hq/*` | Admin panel |

### AI Lead Finder Pipeline (SSE)

This is one of the most complex features. It uses a 3-stage pipeline:

```
Stage 1: Gemini Strategy Planner
  └─ Input: territory + sell description
  └─ Output: search_terms[], filters, refinement instructions

Stage 2: Google Places API Search
  └─ Parallel requests for each search term (up to 3 pages each)
  └─ Deduplication, hard filters (rating, price, business status)
  └─ SSE events stream partial results to the browser

Stage 3: Gemini Refinement (conditional)
  └─ Runs only when qualitative filtering is needed
  └─ Analyzes reviews/summaries to qualify leads
```

The frontend uses `fetch()` with a `ReadableStream` reader to process SSE events and progressively update a jqxGrid table and mobile card view.

---

## 4. Overall Code Structure

### Directory Layout

```
webterritool/
├── app/
│   ├── Api/                    # Mobile API controllers (v1, v2)
│   │   └── V2/Controllers/     # Auth, Company, Contact, Route, List, Webhook
│   ├── Console/                # Artisan commands
│   ├── Helpers/
│   │   └── helpers.php         # Static helper methods (geocoding, AI lead save, contact finders)
│   ├── Http/
│   │   ├── Controllers/        # Web controllers (see table below)
│   │   ├── Middleware/          # CheckUserRole, etc.
│   │   └── Requests/           # Form request validation
│   ├── Jobs/                   # Queue jobs (FullEnrich bulk)
│   ├── Mail/                   # Mailable classes
│   ├── Models/                 # Eloquent models (see table below)
│   ├── Providers/              # Service providers
│   └── Services/               # Service classes
├── config/                     # Laravel + package config
├── database/
│   ├── migrations/             # Schema migrations
│   └── seeds/                  # Database seeders
├── docs/                       # Internal documentation
├── public/
│   ├── css/custom.css          # Main custom stylesheet (~3700 lines)
│   ├── js/modalScript.js       # Shared modal logic (Bulk Contacts, contact fetch)
│   └── images/                 # Static assets
├── resources/
│   └── views/
│       ├── front/              # Main app blade templates
│       │   ├── layout.blade.php        # Master layout
│       │   ├── company/                # Company views + modal.blade.php (shared modals)
│       │   ├── route/                  # Route views + findleads.blade.php
│       │   ├── list/                   # List views
│       │   ├── contact/                # Contact views
│       │   ├── subscription/           # Subscription views
│       │   └── inc/                    # Partials (sidebar, stickybar, etc.)
│       ├── auth/               # Login, register, password reset
│       └── vendor/             # Backpack admin overrides
├── routes/
│   ├── web.php                 # Web routes (~544 lines)
│   └── api.php                 # API routes (Dingo v2, JWT)
└── packages/                   # Custom Laravel packages (Salesforce)
```

### Key Controllers

| Controller | File | Handles |
|------------|------|---------|
| `CompanylController` | ~7700 lines | Companies CRUD, bulk upload, AI/Yelp leads, Salesforce sync, contact providers, most of the core business logic |
| `AILeadFinderController` | ~660 lines | AI lead finder with SSE streaming (Gemini + Google Places pipeline) |
| `RoutesController` | ~2800 lines | Route CRUD, session uploads, optimization |
| `ListController` | ~800 lines | Lists CRUD, map view, route generation |
| `ContactController` | Contacts CRUD, uploads, search |
| `SubscriptionController` | Stripe/PayPal subscriptions, RevenueCat |
| `SfdcController` | Salesforce connect and sync |
| `HubSpotController` | HubSpot connect, sync, field mapping |
| `BusinesssalespersonController` | Business sales agent management |
| `HomeController` | Dashboard, landing page |
| `CronController` | Scheduled cron jobs |

### Key Models

| Model | Table | Purpose |
|-------|-------|---------|
| `Company` | companies | Business leads/companies |
| `Contacts` | contacts | People at companies |
| `UserRoute` | user_routes | Sales routes |
| `UserList` | user_lists | Company lists |
| `UserAISearch` | user_ai_searches | AI lead search history and results |
| `Subscription` | subscriptions | User subscription plans |
| `UserCredit` | user_credits | Contact credit balance |
| `UserContactsCredit` | user_contacts_credits | Per-contact credit usage |
| `UserCities` | user_cities | Assigned territories |
| `Package` | packages | Subscription packages |
| `SupportTicket` | support_tickets | Support tickets |

### Key Frontend Files

| File | Purpose |
|------|---------|
| `resources/views/front/layout.blade.php` | Master layout (sidebar, scripts, CSS) |
| `resources/views/front/route/findleads.blade.php` | AI + Yelp lead finder page (~4500 lines). Contains SSE handler, jqxGrid, map view, card view. |
| `resources/views/front/company/modal.blade.php` | Shared modals including Bulk Contacts modal |
| `public/js/modalScript.js` | Bulk Contacts logic, contact fetch, cart, buy flow (~2800 lines) |
| `public/css/custom.css` | All custom styles (~3700 lines) |
| `app/Helpers/helpers.php` | Shared utility methods (~1900 lines) |

### Third-Party Integrations

| Service | Purpose | Config |
|---------|---------|--------|
| **Google Maps JS API** | Map display, markers, directions | API key in layout |
| **Google Places API (New)** | Business search for AI leads | `GOOGLE_PLACES_API_KEY` |
| **Google Geocoding API** | Territory → lat/lng | Same key |
| **Google Gemini AI** | Search strategy + lead refinement | `GEMINI_API_KEY` |
| **FullEnrich** | Live contact fetch (**2 credits** per contact) | Webhook |
| **Claude** | Live contact fetch when FullEnrich is empty (**1 credit** per contact) | App config |
| **Apollo** | Not used for live fetch | — |
| **Cognism** | Not used for live fetch | — |
| **OpenCorporates** | Not used for live fetch | — |
| **Bizpedia** | Not used for live fetch | — |
| **Salesforce** | CRM sync | `SALESFORCE_*` env vars |
| **HubSpot** | CRM sync | `HUBSPOT_*` env vars |
| **KarmaCRM** | CRM sync | Config |
| **Stripe** | Payments | `STRIPE_KEY`, `STRIPE_SECRET` |
| **PayPal** | Payments | Config |
| **RevenueCat** | Mobile subscriptions | Webhook |
| **Firebase (FCM)** | Push notifications | `FCM_*` env vars |
| **Sentry** | Error tracking | `SENTRY_*` env vars |

### Development Notes

- **MAMP MySQL** is often the local database (port 8889). The browser app for QA is **`http://127.0.0.1:8000/login`** (`php artisan serve` / `npm run serve`), not `http://localhost:8888/webterritool/public`.
- The project uses **Laravel 7.x** — check [Laravel 7.x docs](https://laravel.com/docs/7.x) for framework reference.
- `CompanylController` (note the typo — "Companyl" not "Company") is the largest controller and contains most core logic. New features related to companies, leads, or contacts often end up here.
- The `Helper` class in `app/Helpers/helpers.php` contains static utility methods shared across controllers (geocoding, AI lead saving, data store, etc.).
- Frontend is jQuery-based (not a SPA). Blade templates mix HTML, inline JS, and inline CSS heavily — especially `findleads.blade.php`.
- The jqxGrid library (jqWidgets) is used for data tables in the find leads page.
- Git is initialized — use branches for feature work.

### Getting Started

1. Set up MAMP with PHP 7.2+ and MySQL.
2. Clone the repo and run `composer install`.
3. Copy `.env.example` to `.env` and configure database, API keys.
4. Run `php artisan key:generate`.
5. Import or migrate the database (`php artisan migrate` — though core tables may need a SQL dump).
6. Access the app at **`http://127.0.0.1:8000/login`** (`npm run serve`). Do not use `http://localhost:8888/webterritool/public`.
7. Login credentials will be provided by the team.
