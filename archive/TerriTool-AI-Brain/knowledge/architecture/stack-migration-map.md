---
title: "Frontend stack migration map"
---

# Frontend stack migration map

TerriTool is running **two different frontend stacks at once**, split by feature area, not by a gradual per-component migration. Verified 2026-09-15 by reading `vite.config.js`, `resources/manager-portal/`, and every `resources/views/front/manager/*.blade.php` file. This is the single fact most likely to cause a wrong fix if an agent doesn't know it — get this right before touching any UI.

## The two stacks

| | Legacy stack | New stack |
|---|---|---|
| **Scope** | Everything except Manager Portal: Dashboard, Address Book, Find Leads, Routes, Lists, Contacts, Settings, Subscription, Support, plus Admin HQ (Backpack) | **Manager Portal only** (Business Agent cockpit, module 16) |
| **Tech** | Blade templates + jQuery 2.x + Bootstrap 3 + AdminLTE + jqxGrid | React 18, built with Vite |
| **Where the code lives** | `resources/views/front/**/*.blade.php` (HTML/JS/CSS heavily inlined — `findleads.blade.php` alone is ~4,500 lines), `public/js/modalScript.js` (~2,800 lines), `public/css/custom.css` (~3,700 lines) | `resources/manager-portal/*.jsx` (dashboard, salespeople, AI find leads, activity, support, settings — one `.jsx` file per screen, plus a `components/` and `utils/` folder) |
| **How it reaches the browser** | Directly referenced `<script>`/`<link>` tags in Blade views, no build step | `vite.config.js` builds `resources/manager-portal/main.jsx` → single bundle `public/js/manager-portal.js` (with a `.map` file). Build with `npm run build`; dev with `npm run dev` (Vite dev server) |
| **How data reaches the page** | Server-rendered Blade variables directly in HTML/inline JS | Blade view is a **thin shell**: a mount `<div id="manager-<screen>-root">` plus a `<script type="application/json" id="...">` tag carrying the initial payload (JSON-escaped via `Utf8Sanitizer`), which React reads on mount, then calls `/manager/api/*` JSON endpoints for everything after |
| **New-feature entry point** | Add/extend a Blade view + controller action in `routes/web.php` (no `manager` prefix) | Add/extend a `.jsx` component in `resources/manager-portal/`, wire it in `main.jsx` (`createRoot(...).render(...)` per root div), add/extend a `/manager/api/*` endpoint in `ManagerDashboardController` |

## Verified mount pattern (every Manager Portal screen)

Confirmed by grepping every file in `resources/views/front/manager/`:

| Blade view | Root div id |
|---|---|
| `dashboard.blade.php` | `manager-dashboard-root` |
| `salespeople.blade.php` | `manager-salespeople-root` |
| `salesperson-form.blade.php` | `manager-salesperson-form-root` |
| `salesperson-detail.blade.php` | `manager-salesperson-detail-root` |
| `salesperson-routes.blade.php` | `manager-salesperson-routes-root` |
| `salesperson-convert.blade.php` | `manager-salesperson-convert-root` |
| `ai-find-leads.blade.php` | `manager-ai-find-leads-root` |
| `activity.blade.php` | `manager-activity-root` |
| `support.blade.php` | `manager-support-root` |
| `support-create.blade.php` | `manager-support-create-root` |
| `support-detail.blade.php` | `manager-support-detail-root` |
| `settings.blade.php` | `manager-settings-root` |
| `_portal_layout.blade.php` (shared shell) | `manager-toast-root` (global toast host) |

Each id is mounted in `resources/manager-portal/main.jsx` via `document.getElementById(...)` + `createRoot(...).render(<Component />)`.

**Open question, not yet confirmed:** `reports.blade.php` extends `_portal_layout` but has no dedicated root div of its own in the file — it may render through the dashboard's existing root/tab rather than mounting separately. Confirm this with a staging screenshot before assuming a `manager-reports-root` exists.

## Rules for any agent touching either stack

1. **Check which folder you're in before writing code.** If the file is under `resources/manager-portal/` or the route starts with `/manager/`, you're in React-land — do not add jQuery, Blade partials, or AdminLTE markup there. Everywhere else, do not introduce React/JSX — it has no build/mount path outside the Manager Portal bundle.
2. **A Manager Portal fix means editing the `.jsx` source and rebuilding**, not hand-editing `public/js/manager-portal.js` — that file (and its `.map`) is a Vite build artifact. (It shows as modified in `git status` because it's committed as a build output, not because it's meant to be edited directly.)
3. **New Manager Portal data needs a `/manager/api/*` endpoint**, not a page reload with server-rendered HTML — the screen only re-renders through its React state.
4. **Legacy-stack screens still take server-rendered Blade + inline jQuery** — that's not "old code to modernize" as a side effect of a bug fix; it's the intentional, current pattern for every non-Manager-Portal screen today.
5. **`resources/js/revenuecat.js` is neither of these two builds** — no `<script>` reference to it was found in any Blade view during this pass, and it isn't part of the Vite manager-portal bundle. Confirm its actual load path before assuming it's dead code or wiring anything new through it.

## Why this exists (context, not to act on yet)

The presence of a fresh React/Vite/Bootstrap-5 toolchain (`package.json`) alongside the legacy jQuery/Bootstrap-3 stack, scoped precisely to Manager Portal, on branch `beta_react`, reads as a **deliberate, contained pilot** of the new stack — not a repo-wide migration in progress. Do not assume other areas (Find Leads, Routes, Address Book) are "next" for a React port unless the team says so explicitly.
