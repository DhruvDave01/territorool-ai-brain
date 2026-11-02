# Features

One page per product module. Behavior below is the module spec. The four oversized recordings were watched on 2026-09-23: [oversized-video watch](../reviews/oversized-video-watch-2026-09-23.md). Screenshots sit beside each page. Each page has a **Screens** block: per surface, the file, the still, the primary action, and the loading, empty, and error strings copied from code.

| Module | Page |
|---|---|
| 01 — Authentication, Registration, Onboarding | [01-Authentication-Onboarding](01-Authentication-Onboarding.md) |
| 02 — Dashboard | [02-Dashboard](02-Dashboard.md) |
| 03 — Company (Address Book) | [03-Company-AddressBook](03-Company-AddressBook.md) |
| 04 — Contacts | [04-Contacts](04-Contacts.md) |
| 05 — Find Leads (AI + Yelp) | [05-Find-Leads](05-Find-Leads.md) |
| 06 — Recently Added | [06-Recently-Added](06-Recently-Added.md) |
| 07 — Routes | [07-Routes](07-Routes.md) |
| 08 — Lists | [08-Lists](08-Lists.md) |
| 09 — Contact Enrichment and Credits | [09-Contact-Enrichment-Credits](09-Contact-Enrichment-Credits.md) |
| 10 — Bulk Upload (Companies and Contacts) | [10-Bulk-Upload](10-Bulk-Upload.md) |
| 11 — Maps and Geocoding | [11-Maps](11-Maps.md) |
| 12 — Subscriptions and Payments | [12-Subscription-Payments](12-Subscription-Payments.md) |
| 13 — CRM Integrations | [13-CRM-Integrations](13-CRM-Integrations.md) |
| 14 — Settings and Profile | [14-Settings-Profile](14-Settings-Profile.md) |
| 15 — Support and Notifications | [15-Support-Notifications](15-Support-Notifications.md) |
| 16 — Manager Portal (Business Agent) | [16-Manager-Portal](16-Manager-Portal.md) |
| 17 — Admin HQ | [17-Admin-HQ](17-Admin-HQ.md) |
| 18 — One product, every client | [18-Clients](18-Clients.md) |
| 19 — Background jobs and provider callbacks | [19-Cron-Jobs-Webhooks](19-Cron-Jobs-Webhooks.md) |
| 20 — MCP and voice (Claude / Cursor / ChatGPT / voice) | [20-MCP](20-MCP.md) |
| 21 — Business Team (older screens) | [21-Business-Team](21-Business-Team.md) |
| 22 — Voice Mode (mobile, hands-free driving; on in every `TT_80` build, not in the store build yet) | [22-Voice-Mode](22-Voice-Mode.md) · [mobile build plan](22-Voice-Mode-mobile-plan.md) · [rep guide (PDF)](voice-mode-guide-2026-09-29.pdf) · [quick-start sheet](voice-mode-guide-2026-09-29-quick-start.jpg) |
| 23 — Calendar Sync (one-way push of meetings and appointments to Google Calendar; web on `master`, mobile on `TT_80` only) | [23-Calendar-Sync](23-Calendar-Sync.md) |

Full-flow sheets, one PNG per module and surface, with every step's shipped still and caption: [flows/README.md](flows/README.md).

Shared rules: [product overview](../product/overview.md) · [brains](../brains/README.md).

Review rewards (G2 30, Product Hunt 20) are part of [02 — Dashboard](02-Dashboard.md). Live pixels: the mobile sheet stills and the web unlock-credits stills linked from that page. The HTML files `dashboard-mobile.html`, `dashboard-review-credits.html`, `dashboard-review-credits-web.html`, and `dashboard-review-credits-email.html` are earlier layouts. When they disagree with those stills or with the live repos, the stills and the repos win.
