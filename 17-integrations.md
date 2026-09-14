# 17. Integrations

Related: [features/11-crm-sync.md](features/11-crm-sync.md) · [features/15-maps-and-geo.md](features/15-maps-and-geo.md) · [features/16-notifications.md](features/16-notifications.md)

| Service | Where | Notes |
|---------|--------|-------|
| Google Places (New) | Web AI leads, classic find leads | `GOOGLE_KEY` / `GOOGLE_PLACES_API_KEY` |
| Google Maps JS / Geocoding | Web | |
| Gemini | Web AI pipeline + mobile business card | `GEMINI_API_KEY`; flash 2.5 in older docs |
| Mapbox Directions | Mobile polylines | Public token in config; file named `googleDirections.js` |
| Apollo / Cognism / FullEnrich / OpenCorporates / Bizpedia / Claude | Contact enrich | Webhooks for FE + Apollo |
| Yelp | Web/API | HQ flag `users.yelp_leads`; not in mobile config |
| Stripe / PayPal / RevenueCat | Billing | |
| Salesforce / HubSpot / KarmaCRM / Pipedrive | CRM | |
| FCM | Push | |
| Sentry / PostHog / Crashlytics / Facebook | Telemetry | Facebook App ID `1863947981221180` |
| Dynamic Links | Referrals | `territoolapp.page.link/App` |
| Calendly | Demo booking | Mobile config URL |
| jqWidgets jqxGrid | Find leads web table | |
| Leaflet / Turf | Manager maps | |
