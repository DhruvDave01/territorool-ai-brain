---
id: Tokens
parent: design-web
sources:
  - webterritool/
  - resources/views/front/layout.blade.php
  - resources/views/front/inc/menu.blade.php
  - config/backpack/base.php
  - resources/views/front/manager/_portal_layout.blade.php
  - resources/manager-portal/AIFindLeads.jsx
  - utils/googleMapsCircle.js
  - resources/views/auth/login.blade.php
related:
  - design-web/MINI-DESIGN-BRAIN.md
  - design-web/Token-Inconsistencies.md
---
# Web design tokens

Extracted from live CSS/Blade/JS. **Do not average stacks.** Related: [MINI](MINI-DESIGN-BRAIN.md) · [Token-Inconsistencies.md](Token-Inconsistencies.md).

Web root: `webterritool/`.

---

## Classic

Sources: `public/css/custom.css`, `public/css/company-list.css`, `public/css/route-list.css`, `public/css/list-list.css`, `resources/views/front/layout.blade.php`, `resources/views/front/inc/menu.blade.php`, `public/vendor/adminlte/dist/css/AdminLTE.min.css` (`@font-face`), `config/backpack/base.php` (`skin` => `skin-purple`).

### Color

| Role | Hex | Where it actually appears |
|------|-----|---------------------------|
| Primary blue | `#124ac6` | Sidebar toggle inline style; wizard `.completed-step`; credit badge; many borders/CTAs; `.btn-warning` fill |
| Leftover teal | `#16aa9d` | `.leftNav` / `.rightNav`, `.btn-floating`, `.cluster-title`, borders around 737 |
| List scoped teal | `#00a99d` (`--tt-teal`) | `#AddressBookPage`, `#RoutesListPage`, `#ListsListPage` only |
| Sky | `#00bcf0` | `.btn-info`; `--tt-sky` on list pages |
| Warning hover | `#4a90e4` | `.btn-warning:hover` |
| Switch | `#2196f3` | `.slider` checked (legacy Material) |
| Find Leads Search | `linear-gradient(90deg, #124ac6 0%, #2ec5e8 100%)` | `custom.css` ~4852 |
| Text on `.text-dark` sidebar labels | `#333333` | Duplicate text links |
| AdminLTE purple (unused visually on header) | `#605ca8` | `.skin-purple .main-header .navbar` in AdminLTE; overridden toward white header |
| Sidebar surface | `#ffffff` | `.skin-purple .main-sidebar` override in `custom.css` |

`#124ac6` appears ~32 times in `custom.css`; `#16aa9d` ~8 times. Counts are from a live grep, not a redesign target.

### Type

| Family | File | Use |
|--------|------|-----|
| Source Sans Pro | AdminLTE `@import` Google fonts | Default body |
| DIN 2014 Bold | `/fonts/DinBold.ttf` via AdminLTE.min.css | Credit badge, some titles |
| DIN 2014 Light | `/fonts/DinLight.ttf` | Body-ish classic accents, register badges |

Do not introduce Inter on classic app pages (Register already does — deferred).

### Radius / chrome

No single token. Live mix: 3 / 4 / 5 / 8 / 10 / 12 / 14 / 15 / 20 / 50 / 999. Wizard steps `15px`; credit badge `5px`; list-page cards follow `--tt-*` with ~8–14px. Match the **local** page.

Header logos: `url('/images/logo_blue.png')`, mini `url('/images/tt_smal_logo.png')`. Favicon `vendor/adminlte/dist/img/TTicon.ico`.

Icons: Font Awesome 4.4 + Ionicons 2 + PNG sidebar (`/images/dashboard2.png`, `addressbook1.png`, `findLeads1.png`, `recently-added1.png`, `routes-new1.png`, `lists-new1.png`, `setting1.png`).

---

## Manager

Sources: `public/css/manager-portal.css` (`#mgr-portal-dashboard-wrapper` custom properties), `public/css/manager-portal-responsive.css`, `public/css/manager-ai-find-leads.css`, `resources/views/front/manager/_portal_layout.blade.php`, `resources/manager-portal/AIFindLeads.jsx`.

### CSS variables (canonical)

```
--blue: #124ac6;
--blue-dark: #0e3da6;
--blue-light: #e6eefb;
--blue-glow: rgba(18,74,198,.08);
--teal: #00a99d;
--teal-light: #e0f7f5;
--sky: #00bcf0;
--sky-light: #e0f5fd;
--dark / --text: #1a1a1a;
--text-secondary: #6e6e8a;
--text-muted: #bfbfbf;
--bg: #f5f6fa;
--card: #ffffff;
--border: #e5e5e5;
--green / --green-light: #00a99d / #e0f7f5;  /* alias of teal */
--amber / --amber-light: #f59e0b / #fef3c7;
--red / --red-light: #ef4444 / #fee2e2;
--purple / --purple-light: #8b5cf6 / #ede9fe;
--sidebar-w: 260px;
--header-h: 64px;
--radius: 14px;
--radius-sm: 10px;
--shadow-sm: 0 1px 3px rgba(0,0,0,.06);
--shadow-md: 0 4px 16px rgba(0,0,0,.08);
--shadow-lg: 0 12px 40px rgba(0,0,0,.12);
```

Responsive layer sometimes uses `--sidebar-w, 220px` as a fallback — both exist. Copy the file you are in.

### Type

Google fonts on `_portal_layout`:

`DM+Sans:400;500;600;700` (body) · `Space+Grotesk:500;600;700` (h1–h6, brand title).

Sidebar brand title 18px / 700 Space Grotesk; subtitle 12px white 88%.

### Map circles (AI Find Leads)

`AIFindLeads.jsx` `COLORS = ['#2563eb', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b', '#06b6d4']`. Default radius limits live in `utils/googleMapsCircle.js` (server mirrors). Pin fill for current-rep leads: `#94a3b8`. Do not collapse these to `--blue`.

Brand card uses the **same 7-stop blue gradient** as mobile `CustomHeader`.

---

## Login (code-only; no Archive still)

`resources/views/auth/login.blade.php` hides `.main-header` / `.main-sidebar`. Split panel: left `linear-gradient(155deg, #2a5bef 0%, #1740c7 45%, #0b2483 100%)`, card radius **16**, fields 44px / radius 8 / border `#e2e8f0`. These blues are **not** `#124ac6`. Do not “fix” login to manager tokens without a capture + explicit ask.

---

## HQ (deferred)

`resources/views/vendor/backpack/base/layout.blade.php` — AdminLTE + `custom.css`, title “TerriTool HQ”. Do not invent pixels.
