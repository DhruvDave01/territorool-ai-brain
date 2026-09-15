---
id: Screenshot-Index
parent: design-web
related:
  - design-web/Deferred-Scope.md
---
# Screenshot index (web Archive, short pass)

Captured 2026-09-14 from `http://127.0.0.1:8000/` (local `php artisan serve`). Session: **Business Agent** (Cockpit). No videos.

Stills live in [03-Assets/stills/](03-Assets/stills/). ~1.5 MB total.

| File | URL | What it proves |
|------|------|----------------|
| `01-manager-dashboard.png` | `/manager/dashboard` | Cockpit: gradient brand card, DM Sans / Space Grotesk, KPI cards radius ~14, period pills, territory map. AdminLTE chrome gone (`body.manager-portal`) |
| `02-manager-ai-find-leads.png` | `/manager/ai-find-leads` | Circle hunt Step 1–2, How it works, Search / Next Step. Not classic city/ZIP |
| `03-manager-ai-circles.png` | `/manager/ai-find-leads` | Search Area 1 overlay (blue circle, drag/resize copy). Palette is `AIFindLeads.jsx` `COLORS`, not `--blue` |
| `04-classic-company-list.png` | `/company` | AdminLTE + Address Book `--tt-*` header, jqxGrid, BA **duplicate** icon sidebar (Home / Salespeople / Support / Settings / Logout), white header, QR + store badges |
| `05-classic-findleads.png` | `/findleads` | Search Multiple, gradient Search CTA, Ideal Prospects callout, **jqxGrid** “46 Leads Found”, Map View / Next Step |
| `06-classic-routes-list.png` | `/routes` | DataTables (not jqxGrid), Published/Draft tabs, stat cards, Create Route |
| `07-classic-route-wizard-step1.png` | `/route/step1` | Create Routes wizard, All/Selected tabs, Map View / Find Leads / Next Step, live typo **Please Chooae:** |

Not captured (see [Deferred-Scope.md](Deferred-Scope.md)): Sales Agent dashboard, SA PNG sidebar, login, register/paywall, HQ, manager team CRUD.

Local QA data (rep names, emails, credits) appears in stills. Do not copy per-rep values into other brain notes.
