# TerriTool Web — Mini Design Brain

One-file distillation. Read this first; follow the linked files only when you need a source citation or a screenshot.

**Same ground rules as the mobile pack:** describes the app **as it ships today**. Not a redesign. Where tokens/pages are inconsistent, **match the nearest existing page on the same stack** — do not average or “fix.”

The web app is **two products in one repo**. Agents that only see URLs and controllers guess Blade chrome or “modernize” AdminLTE. Use this pack instead.

---

## 1. Two-stack rule (do not mix)

| Surface | Stack | Source of truth |
|--------|--------|-----------------|
| **Classic** `/dashboard`, `/company`, `/routes`, `/lists`, `/findleads` | Blade + **jQuery 2.2.0** + Bootstrap **3.3.5** AdminLTE | `webterritool/resources/views/front/layout.blade.php` + `public/css/custom.css` |
| **Manager** `/manager/*` | Vite + React **18** islands. CSS vars on `#mgr-portal-dashboard-wrapper` | `resources/manager-portal/` + `public/css/manager-portal.css` |
| **HQ** `/hq/*` | Backpack + AdminLTE | `resources/views/vendor/backpack/` — pixels **deferred** |

Manager shells still `@extends('front.layout')` via `front.manager._portal_layout`. `body.manager-portal` then **hides** AdminLTE header/sidebar gutters. Do not swap that parent to Bootstrap 5. Vite `package.json` lists `bootstrap@^5.3.6`; **manager JSX does not import it**.

Classic list pages (`company-list.css`, `route-list.css`, `list-list.css`) already use `--tt-*` CSS vars **inside Blade**. That is still the classic stack — do not convert those pages into React islands.

---

## 2. Brand tokens (do not average)

Shared primary blue is `#124ac6` on both stacks. Teals are **not** one token.

### Classic (`custom.css` + AdminLTE)

| Role | Hex | Notes |
|------|-----|--------|
| Primary | `#124ac6` | Header toggle, completed wizard steps, credit badge, many CTAs. **~32** hits in `custom.css` |
| Leftover teal | `#16aa9d` | Cluster titles, `.btn-floating`, left/right nav chips. **Do not replace with manager teal** |
| List-page vars (`--tt-teal`) | `#00a99d` | Address Book / Routes / Lists **page CSS only** (`company-list.css` etc.) — third teal, live |
| Sky / `.btn-info` | `#00bcf0` | Find Leads / Map View outline buttons |
| Warning restyle | `.btn-warning` → `#124ac6` (hover `#4a90e4`) | Bootstrap 3 warning is not orange here |
| Switch leftover | `#2196f3` | `.slider` checked state in `custom.css` |
| Search CTA gradient | `#124ac6` → `#2ec5e8` | Classic Find Leads **Search** button |
| Skin | `config('backpack.base.skin')` = `skin-purple` | AdminLTE navbar default `#605ca8`; live header is **white** with blue logo |
| Body font | Source Sans Pro (AdminLTE Google import) | Plus **DIN 2014 Bold / Light** (`/fonts/DinBold.ttf`, `/fonts/DinLight.ttf`) |
| Credit badge | `'DIN 2014 Bold'`, `#124ac6` fill, radius 5 | `inc/menu.blade.php` |
| Logos | `/images/logo_blue.png` (header lg), `/images/tt_smal_logo.png` (mini) | |

### Manager (`manager-portal.css` `:root` on `#mgr-portal-dashboard-wrapper`)

| Var | Value |
|-----|--------|
| `--blue` | `#124ac6` |
| `--blue-dark` / `--blue-light` | `#0e3da6` / `#e6eefb` |
| `--teal` / `--green` | `#00a99d` (same hex twice) |
| `--sky` | `#00bcf0` |
| `--dark` / `--text` | `#1a1a1a` |
| `--text-secondary` / `--text-muted` | `#6e6e8a` / `#bfbfbf` |
| `--bg` / `--card` / `--border` | `#f5f6fa` / `#ffffff` / `#e5e5e5` |
| `--radius` / `--radius-sm` | **14px** / 10px |
| `--sidebar-w` / `--header-h` | 260px / 64px |
| Body / headings | **DM Sans** / **Space Grotesk** (Google fonts on `_portal_layout`) |
| Brand card gradient | 7-stop `#124ac6 → #164fca → #1b54cf → #2059d3 → #255ed7 → #2963db → #124ac6` | Same stops as mobile `CustomHeader` |
| Map circle colors (AI Find Leads) | `['#2563eb', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b', '#06b6d4']` | `AIFindLeads.jsx` — **not** `--blue`. Do not restyle to `#124ac6` |

Full tables: [Tokens.md](Tokens.md).

---

## 3. New page recipe

### Classic (Sales Agent / BSA)

1. `@extends('front.layout')`. Sections: `after_styles`, `header`, `content`, `after_scripts`.
2. Keep AdminLTE: `.content-wrapper` → `section.content` → `.box` / `.panel`.
3. jQuery **2.2.0** (CDN, fallback `vendor/adminlte/plugins/jQuery/jQuery-2.2.0.min.js`). CSRF via `$.ajaxSetup` `X-CSRF-TOKEN`.
4. Multipart AJAX: `new FormData(form)` + `contentType: false` + `processData: false` (wizard CSV steps). Comment in Blade: `// high importance!`
5. Company / Find Leads **tables are jqxGrid** (`#company_list`), not DataTables. Routes **list** is DataTables. Do not swap.
6. Toasts: **PNotify**. Page loader: `#cover-spin`.
7. Do not import DM Sans / Space Grotesk / manager CSS vars onto a new classic page unless that sibling page already does (Address Book / Routes / Lists list CSS).
8. Sidebar: leave duplicate icon + text `<a>` pairs in `inc/sidebar.blade.php`. Do not “clean up.”

### Manager (Business Agent)

1. Add a Blade shell `@extends('front.manager._portal_layout')` with an empty `#manager-…-root` div.
2. Mount the island in `resources/manager-portal/main.jsx` (`createRoot` + `readJsonScript('…-initial')`).
3. Pass initial JSON via `<script type="application/json" id="manager-…-initial">`.
4. Load `public/js/manager-portal.js` (Vite build). Styles: `manager-portal.css` + `manager-portal-responsive.css` (already on the portal layout). AI Find Leads also loads `manager-ai-find-leads.css`.
5. Fetch JSON with `managerFetch` — **not** jQuery FormData.
6. Toasts: `ToastHost` on `#manager-toast-root`, `showToast`.
7. Nav item goes in `front.manager._mgr_sidebar` (Cockpit), not the classic AdminLTE sidebar.
8. Do not create a new AdminLTE page for a manager feature.

Reuse order: classic → `front.layout` + `custom.css` + existing `.box` / jqxGrid / PNotify. Manager → portal layout + island + CSS vars. HQ → Backpack only (do not restyle without captures).

---

## 4. Navigation (role-split — leave duplicates)

Classic chrome: collapsed AdminLTE sidebar (`sidebar-collapse`) + top header. Source: `inc/sidebar.blade.php`. Each item is **two** `<a>` tags (icon/`menu-main` + `.text-dark` label). That is live. Captured on BA visiting `/company`: icon rail + labels.

| Role | Sidebar |
|------|---------|
| **Business Agent** | Classic: Dashboard → `/manager/dashboard`, Salespeople, Support (if subscription active), Settings, Logout. **Plus** manager Cockpit (`_mgr_sidebar`) on `/manager/*`: Dashboard, AI Find Leads, Salespeople, Activity, Support, Settings + Team Overview / License / Subscription panels |
| **Business Sales Agent** | PNG icons: Dashboard, Address Book (tree: Companies / Contacts / errors), Find Leads, Recently Added, Routes, Lists, Settings |
| **Sales Agent** (else) | Same PNG set as BSA, but Find Leads label is **“AI Find Leads”**. Extra **Route Session** if `RoutesSession` rows exist. Address Book splits `mobileComp-menu` vs `deskComp-menu` |
| **Admin** | `/hq/*` only — deferred |

BA hitting `/dashboard` **redirects** to `/manager/dashboard` (`HomeController@dashboard`). BSA hitting `/manager/*` → `/dashboard`.

Header (classic, not manager): logo, optional Upgrade / QR “Scan to download the app”, credits pill (Sales Agent), Play/App Store, Report Bug, Logout. Sticky mobile app bar: `inc/stickybar.blade.php` (skipped on findleads, login, register, onboarding, manager).

Full: [Navigation.md](Navigation.md).

---

## 5. Page inventory (condensed)

| URL | View | Stack | Notes |
|-----|------|-------|-------|
| `/dashboard` | `front.dashboard` | Classic | SA/BSA: “Welcome {name}” + recent-activity panel. **BA redirected to manager** — SA still **not captured** |
| `/company` | `front.company.listnewl` | Classic | Address Book + jqxGrid `#company_list`. Still: `04-classic-company-list.png` |
| `/findleads` | `front.route.findleads` | Classic | City/ZIP AI search + jqxGrid. Still: `05-classic-findleads.png` |
| `/routes` | `front.route.list` | Classic | DataTables, Published/Draft. Still: `06-classic-routes-list.png` |
| `/route/step1` | `front.route.step1` | Classic | Wizard “Step 1 of 2”. Still: `07-classic-route-wizard-step1.png` |
| `/lists` | `front.list.list` | Classic | Same list-page tokens as routes |
| `/manager/dashboard` | `#manager-dashboard-root` | Manager island | KPI cards + territory map. Still: `01-manager-dashboard.png` |
| `/manager/ai-find-leads` | `#manager-ai-find-leads-root` | Manager island | Places **circles**, not classic city/ZIP. Stills: `02` / `03` |
| Other `/manager/*` | see [Page-Inventory.md](Page-Inventory.md) | Islands | salespeople, activity, settings, support, reports (placeholder) |
| `/login` | `auth.login` | Classic chrome hidden | Split-panel; login-only blues `#2a5bef` / `#1740c7` — **no still** |
| `/register`, `/trial`, `/b2b`, paywall | auth Blade | — | **Deferred** (Inter on register) |
| `/hq/*` | `backpack::layout` | Backpack | **Deferred** |

Manager mounts (from `main.jsx`): `#manager-toast-root`, `#manager-ai-find-leads-root`, `#manager-dashboard-root`, `#manager-activity-root`, `#manager-salespeople-root`, `#manager-salesperson-detail-root`, `#manager-settings-root`, `#manager-salesperson-routes-root`, `#manager-support-root`, `#manager-support-create-root`, `#manager-support-detail-root`, `#manager-salesperson-form-root`, `#manager-salesperson-convert-root`.

---

## 6. Do / Do not

**Do:** `@extends('front.layout')` for new classic pages · FormData + `contentType: false` for classic multipart · jqxGrid on Find Leads / Address Book · new manager UI as a React island on `_portal_layout` · `#124ac6` primary · copy the nearest sibling on **that** stack.

**Do not:** mix AdminLTE into manager islands (beyond the existing hidden parent layout) · add DM Sans to classic chrome · replace `#16aa9d` with `#00a99d` “to be consistent” · delete duplicate sidebar `<a>` tags · replace jqxGrid with a React table on `/findleads` · build manager AI Find Leads as a Blade copy of `/findleads` · invent Register / paywall / HQ UI.

---

## 7. Known inconsistencies — do not normalize

| Item | Live values |
|------|------------|
| Teal | Classic leftover `#16aa9d` vs manager `--teal: #00a99d` vs list-page `--tt-teal: #00a99d` |
| Bootstrap | Classic BS3 in layout; Vite lists BS5 unused by manager JSX |
| jQuery | Layout 2.2.0; `package.json` also has jquery 3.7.1 for Vite (unused by classic) |
| Find Leads | Classic city/ZIP + jqxGrid vs manager Places circles + JSON |
| Skin | Config `skin-purple` vs painted-white header + `#124ac6` |
| `.btn-warning` | Restyled to primary blue |
| Route wizard status placeholder | **“Please Chooae:”** typo is live |
| BA on classic URLs | `/company` etc. still work; sidebar stays BA (Home/Salespeople/…), not SA PNG set |
| Manager reports | `front.manager.reports` is a “Coming soon” Blade stub, no island |

Full: [Token-Inconsistencies.md](Token-Inconsistencies.md).

---

## 8. Deferred visual scope

Do **not** invent UI for: Register / trial / B2B (Inter), onboarding, subscription/paywall/RevenueCat purchase, HQ Backpack pages, Sales Agent dashboard still (this Archive used a **Business Agent** session; `/dashboard` redirects). Same rule as mobile Register/paywall. [Deferred-Scope.md](Deferred-Scope.md).

---

## 9. Go deeper

| Need | File |
|------|------|
| Hex / type / radius with sources | [Tokens.md](Tokens.md) |
| Route ↔ Blade ↔ island | [Page-Inventory.md](Page-Inventory.md) |
| Role sidebars | [Navigation.md](Navigation.md) |
| New-page checklist | [Usage-Rules.md](Usage-Rules.md) |
| Archive stills | [Screenshot-Index.md](Screenshot-Index.md) |
| URLs / controllers | [13-web-urls.md](../13-web-urls.md), [code/web-code-details.md](../code/web-code-details.md) |
| Mobile chrome (do not copy DIN-on-native patterns onto web manager) | [../design/MINI-DESIGN-BRAIN.md](../design/MINI-DESIGN-BRAIN.md) |
