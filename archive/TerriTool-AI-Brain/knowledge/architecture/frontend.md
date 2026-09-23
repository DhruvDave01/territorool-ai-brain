---
title: "Frontend"
---

# Frontend

**Must-read:** [stack-migration-map.md](stack-migration-map.md)

TerriTool runs **two frontend stacks by feature area**, not a gradual migration.

## Legacy stack (default)

- **Scope:** Dashboard, Address Book, Find Leads, Routes, Lists, Contacts, Settings, Subscription, Support, Admin HQ
- **Tech:** Blade + jQuery 2 + Bootstrap 3 + AdminLTE + jqxGrid
- **Where:** `resources/views/front/**`, `public/js/modalScript.js`, `public/css/custom.css`
- **Data:** server-rendered variables + inline JS + form POSTs / `$.ajax`
- **No Vite build** for these screens

Hot files: `findleads` Blade is huge (~4500 lines per stack map); `modalScript.js` ~2800 lines.

## Manager Portal stack

- **Scope:** `/manager/*` only
- **Tech:** React 18, Vite 5 (`vite.config.js` root = `resources/manager-portal`)
- **Build:** `npm run build` → `public/js/manager-portal.js` (committed artifact; **do not hand-edit**)
- **Mount:** Blade thin shell + `<div id="manager-*-root">` + JSON payload script tags
- **Subsequent data:** `/manager/api/*`

Mount IDs: `stack-migration-map.md`.

`reports.blade.php`: **UNKNOWN — needs verification** (no dedicated root div found).

## Other JS

| Path | Status |
|------|--------|
| `resources/assets/js/` Vue 2 + Elixir `gulpfile.js` | Legacy Passport Vue components; not the Manager Portal |
| `resources/js/revenuecat.js` | **UNKNOWN** load path — not in Vite input |
| `package.json` `@vitejs/plugin-vue2` | Listed; **not enabled** in `vite.config.js` |

## Agent rule

If the URL is `/manager/...` or the file is `.jsx` under `resources/manager-portal/`, use React hooks and `/manager/api/*`. Otherwise keep Blade/jQuery. Do not “modernize” a Blade screen as a side effect of a bug fix.
