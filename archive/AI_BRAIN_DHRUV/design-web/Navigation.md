---
id: Navigation
parent: design-web
sources:
  - resources/views/front/inc/sidebar.blade.php
  - front/inc/menu.blade.php
  - front/inc/stickybar.blade.php
  - front/manager/_mgr_sidebar.blade.php
  - front/layout.blade.php
  - inc/sidebar.blade.php
  - inc/menu.blade.php
---
# Web navigation

Source: `resources/views/front/inc/sidebar.blade.php`, `front/inc/menu.blade.php`, `front/inc/stickybar.blade.php`, `front/manager/_mgr_sidebar.blade.php`, `front/layout.blade.php`.

**Do not “clean up” duplicate icon + text links.** Each classic sidebar item is two `<a>` elements: `menu-main` (icon or PNG) and `.text-dark` (label). Accessibility snapshots show Home/Salespeople/… twice. That is production.

Manager `/manager/*` **does not render** `inc/sidebar.blade.php` (`layout.blade.php` skips it when `Request::is('manager/*')`). Cockpit nav is `_mgr_sidebar`.

---

## Classic AdminLTE sidebar (`inc/sidebar.blade.php`)

`aside.main-sidebar` → `ul.sidebar-menu`. Body class `sidebar-collapse sidebar-mini`. White sidebar (`custom.css` overrides all AdminLTE skin sidebar backgrounds to `#ffffff`).

### Branch 1 — `hasRole('Business Agent')`

Header: `trans('Business Agent')`.

| Label | URL | Icon |
|-------|-----|------|
| Dashboard | `/manager/dashboard` | `fa fa-dashboard` |
| Salespeople | `/manager/salespeople` | `fa fa-location-arrow` (only if `Session::get('subscription') == 'active'`) |
| Support | `/manager/support` | `fa fa-support` (same subscription gate) |
| Settings | `/manager/settings` | `fa fa-cogs` |
| Logout | `/logout` | `fa fa-sign-out` |

Support markup has a stray `</span>` inside the duplicate text link — live.

### Branch 2 — `hasRole('Business Sales Agent')`

Header: `trans('backpack::base.salesperson')`. PNG `sidebar-icon`s.

| Label | URL | Asset |
|-------|-----|------|
| Dashboard | `/dashboard` | `dashboard2.png` |
| Address Book | `/company` | `addressbook1.png` · tree: Companies, Contacts, Companies With Errors (if CSV session) |
| Find Leads | `/findleads` | `findLeads1.png` · tree: Add Company (`/company?create=true`), Find Leads. Duplicate text link `href="#"` |
| Recently Added | `/recent-company` | `recently-added1.png` · tree: Companies / Contacts. Text link `href="#"` |
| Routes | `/routes` | `routes-new1.png`. Text link `href="#"` |
| Lists | `/lists` | `lists-new1.png` (note `images//lists-new1.png`) |
| Settings | `/salesperson/edit` | `setting1.png` |

### Branch 3 — else (Sales Agent)

Same PNG set as BSA with these diffs:

- Find Leads label is **“AI Find Leads”** (not “Find Leads”).
- Address Book: extra `mobileComp-menu` (single link) + `deskComp-menu` tree (desktop).
- Companies / Contacts / Find Leads / Recently Added / Routes / Lists gated by `Session::get('subscription') == 'active'`.
- Optional **Route Session** tree (`fa fa-location-arrow`) if `RoutesSession` count &gt; 0 → `/sessionroute/success`, `/sessionroute/error`.
- Commented-out Subscription / Support / Notification / Logout items remain in the file. Do not revive unless asked.

---

## Manager Cockpit (`_mgr_sidebar.blade.php`)

Only if `Auth::user()->hasRole('Business Agent')`. Gradient brand card (“TerriTool Cockpit” / “Sales Intelligence Hub”), credits, then:

| Label | URL | Icon |
|-------|------|------|
| Dashboard | `/manager/dashboard` | `fa fa-bar-chart` |
| AI Find Leads | `/manager/ai-find-leads` | `fa fa-magic` |
| Salespeople | `/manager/salespeople` | `fa fa-users` |
| Activity | `/manager/activity` | `fa fa-bolt` |
| Support | `/manager/support` | `fa fa-life-ring` |
| Settings | `/manager/settings` | `fa fa-cog` |

Lower panels: Team Overview, License Usage, Subscription. Logout is a separate control in the CSS (responsive file), not the same duplicate-`<a>` pattern.

Logo in the brand card: `/images/tt_smal_logo.png`.

---

## Header (`layout` + `inc/menu.blade.php`)

Skipped on `embed` and on `manager/*`.

- Logo → `/`.
- Trial/upgrade: `#cs-subscription` or RevenueCat modal vs `/subscription/subscribe`.
- Else: QR `/images/qrcode.png` + “Scan to download the app”.
- Hamburger: inline `background-color:#124ac6` (classic).
- Credits pill (Sales Agent): `.creditBadgeDesktop` DIN Bold `#124ac6`.
- Play Store / App Store images.
- Guest: Login / Register.

## Sticky bar

`inc/stickybar.blade.php` — mobile-only “Download the App…”. Omitted on findleads, register, login, special, trial, b2b, `route/step2/*`, onboarding.

---

## Redirects (nav behavior)

| From | Who | To |
|------|-----|-----|
| `/dashboard` | Business Agent | `/manager/dashboard` |
| `/manager/*` | not Business Agent | `/dashboard` (`EnsureManagerRole`) |
| `/hq/*` | Sales Agent / BA / BSA | `/dashboard` |
| anything else | Admin | `/hq/dashboard` |

Step-by-step journeys: [screens/web-how-it-works.md](../screens/web-how-it-works.md).
