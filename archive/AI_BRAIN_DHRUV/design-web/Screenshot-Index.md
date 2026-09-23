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

---

## 2026-09-15 Playwright pack

Path: `/Users/dhruvdave/Dhurv/Project_TerriTool/untitled folder/screenshots/web/` (desktop 1440×900 + some phone-viewport public pages). Live web, **Sales Agent** PNG sidebar on authenticated pages. Do not copy names, emails, credit balances, or invoice rows.

| File | URL (from capture script) | What it proves |
|------|---------------------------|----------------|
| `desktop/login.png` | `/login` | Split-panel auth: blue left (TERRITOOL wordmark, “The AI Sales App For Field Reps”, QR) + white right. **Welcome** with wave emoji. Remember Me, Forgot, filled Login, outline Create Account. Page bg light gray, not AdminLTE |
| `desktop/register.png` | `/register` | Same shell. **Step 1 of 3** (not mobile’s 6). Same goals checkboxes as mobile. Left copy mentions 7-day trial + 60 lead credits. Testimonial card under the panel. Continue washed until a pick |
| `desktop/b2b.png` | `/b2b` | Same chrome as register step 1 in this still |
| `desktop/trial.png` | `/trial` | Same shell, **Create your account** (Name, Phone, Email, Password, reCAPTCHA, Start Free Trial). No step bar |
| `desktop/password-reset.png` | `/password/reset` | **Not** split-panel. Classic header (logo, QR, store badges, Login/Register) + gray content, Email + Send Password Reset Link |
| `desktop/dashboard.png` and `onboarding.png` | `/dashboard` | **Sales Agent** hub (filename `onboarding` is misleading). PNG sidebar. Welcome + tiles: Find Leads, Routes, Recently Added, Address Book, Lists, Upload Excel/CSV, Activity (empty “No upcoming notes.”), Tutorial. **0 Credits** pill |
| `desktop/settings.png` | `/salesperson/edit` | SA Settings: MCP pills, statuses + hex, Cancel (red) / Upgrade (blue), classic boxes |
| `desktop/subscription.png` | `/subscription*` | AdminLTE **history** tables (packages + add-ons), not the Upgrade cards |
| `desktop/subscription-subscribe.png` | Upgrade | “Upgrade Your Plan”: Pro $99 / Base $69 / credit add-ons, **Pay Now** near-black. Web only — do not copy onto iOS RevenueCat |

Phone-viewport twins exist under `web/mobile/` for login, register, trial, b2b, password-reset.

`screenshots/mobile/` next to this pack is **not** web — HTML replicas of the native app. Ignore for web chrome.
