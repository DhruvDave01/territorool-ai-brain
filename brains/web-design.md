---
id: web-design
parent: brains
sources:
  - webterritool/
  - resources/views/front/layout.blade.php
  - resources/views/front/manager/_portal_layout.blade.php
related:
  - brains/web-code.md
  - brains/README.md
  - design-web/MINI-DESIGN-BRAIN.md
  - design-web/Tokens.md
  - design-web/Page-Inventory.md
  - design-web/Navigation.md
  - design-web/Usage-Rules.md
  - design-web/Deferred-Scope.md
---
# 4. Web Design Brain

Hub for **as-shipped** web pixels. Two stacks — do not mix. Sibling: [Web Code Brain](web-code.md). Parent: [sub brains](README.md).

**Repo:** `webterritool/` Blade + `public/css/` + `resources/manager-portal/`. Short stills: `design-web/03-Assets/stills/`. HQ `/hq/*` pixels **deferred**.

## Read first

1. This file.
2. [design-web/MINI-DESIGN-BRAIN.md](../design-web/MINI-DESIGN-BRAIN.md).
3. [Tokens.md](../design-web/Tokens.md) · [Page-Inventory.md](../design-web/Page-Inventory.md) · [Navigation.md](../design-web/Navigation.md) · [Usage-Rules.md](../design-web/Usage-Rules.md).

## Must follow

| Rule | Do this |
|------|---------|
| Classic `/dashboard`, `/company`, `/routes`, `/lists`, `/findleads` | `@extends('front.layout')`. AdminLTE + jQuery **2.2.0** + Bootstrap **3.3.5**. |
| Manager `/manager/*` | React islands. CSS vars on `#mgr-portal-dashboard-wrapper` (`public/css/manager-portal.css`). `body.manager-portal` hides AdminLTE header/sidebar. |
| Shared primary | `#124ac6` on both (`custom.css` and `--blue`). |
| Classic leftover teal | `#16aa9d` in `custom.css` (cluster titles, `.btn-floating`, nav chips). |
| Classic **list-page** vars | `--tt-teal: #00a99d` in `public/css/company-list.css`, `route-list.css`, `list-list.css` — third teal, still classic Blade. Do not convert those pages to islands. |
| Manager `--teal` / `--green` | `#00a99d` (same hex twice). Do not average with `#16aa9d`. |
| Manager radius | `--radius: 14px`, `--radius-sm: 10px`. Classic boxes stay AdminLTE. |
| Type | Classic: Source Sans Pro + **DIN 2014** (`/fonts/DinBold.ttf`, `/fonts/DinLight.ttf`). Manager: **DM Sans** / **Space Grotesk**. Do not put manager fonts on a new classic page. |
| Sidebar | Duplicate icon + text `<a>` pairs in `resources/views/front/inc/sidebar.blade.php`. Do not clean up. |
| Vite Bootstrap 5 | In `package.json`; manager JSX **does not import it**. |
| Manager map circles | `AIFindLeads.jsx` uses `['#2563eb', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b', '#06b6d4']` — **not** `--blue`. |
| Register / paywall / HQ | [Deferred-Scope.md](../design-web/Deferred-Scope.md). |

## New page recipe

**Classic:** sections `after_styles`, `header`, `content`, `after_scripts`. CSRF `X-CSRF-TOKEN`. PNotify. `#cover-spin`. jqxGrid vs DataTables — match the sibling page.

**Manager:** mount `#manager-*-root` listed in [Web Code Brain](web-code.md). Toasts: `#manager-toast-root`. Do not add a new AdminLTE page for Business Agent.

## Token files

| Stack | File |
|------|------|
| Classic | `public/css/custom.css` |
| Classic lists | `public/css/company-list.css`, `route-list.css`, `list-list.css` |
| Manager | `public/css/manager-portal.css` |
| Layout | `resources/views/front/layout.blade.php` |
| Manager shell | `resources/views/front/manager/_portal_layout.blade.php` |

Skin config `backpack.base.skin` = `skin-purple` but live header is **white** with blue logo.

## Trained if you can

- Extend classic vs manager without mixing fonts or teals.
- Keep `--tt-teal` list CSS on Blade list pages.
- Leave sidebar duplicate links and HQ un-redesigned.
