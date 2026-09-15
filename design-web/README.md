---
id: README
parent: design-web
sources:
  - resources/views/front/layout.blade.php
related:
  - design/README.md
  - data/formdata-dictionary.md
  - design-web/MINI-DESIGN-BRAIN.md
  - design-web/Deferred-Scope.md
  - design-web/Tokens.md
  - design-web/Page-Inventory.md
  - design-web/Navigation.md
  - design-web/Usage-Rules.md
---
# Design pack (web UI as it ships)

Sibling of the mobile pack at [`../design/`](../design/README.md). Extracted from **live** Blade, CSS, and manager islands the same way [FormData](../data/formdata-dictionary.md) was scanned from `formdata.append` — cite the file, do not invent.

This is **not** a redesign brief. Code still wins over captures. **Do not mix the two stacks.**

**Read first:** [MINI-DESIGN-BRAIN.md](MINI-DESIGN-BRAIN.md)

Product / API / credits stay in the rest of `AI_BRAIN/` and the root frontal lobe. Use this folder when the task is **how a web page looks**, tokens, chrome, or “match the nearest existing page.”

## Two products, one repo

| Surface | Stack (do not mix) | Source of truth |
|--------|--------------------|-----------------|
| Classic app (`/dashboard`, companies, routes, lists, findleads) | Blade + jQuery 2.2 + Bootstrap 3 AdminLTE | `resources/views/front/layout.blade.php` + `public/css/custom.css` |
| Manager (`/manager/*`) | Vite + React 18 islands + CSS vars | `resources/manager-portal/` + `public/css/manager-portal.css` |
| HQ (`/hq/*`) | Backpack | `resources/views/vendor/backpack/` — **pixels deferred** |

## What is here vs what is not

| In this vault | Not invented |
|---|---|
| MINI, tokens, page inventory, nav, usage, inconsistencies, deferred | HQ pixels; web Register steps 2–3; iOS RevenueCat |
| Short Archive stills (~1.5 MB, 7 PNGs) + Playwright web pack | 264 MB videos — never |

Stills: [03-Assets/stills/](03-Assets/stills/) (BA Archive) plus `/Users/dhruvdave/Dhurv/Project_TerriTool/untitled folder/screenshots/web/` (SA Playwright). Filenames in these notes refer to those folders. Do not invent missing pixels. Do not use `screenshots/mobile/` (HTML replicas).

## Ground rules

- Match the **nearest existing page on the same stack**. Do not average classic leftover teal `#16aa9d` with manager `--teal: #00a99d`.
- Do not “modernize” AdminLTE into a React SPA. Do not add a new AdminLTE page for a manager feature.
- Register / remaining paywall / HQ pixels — [Deferred-Scope.md](Deferred-Scope.md).

## Folder map

| File | Contents |
|------|----------|
| [MINI-DESIGN-BRAIN.md](MINI-DESIGN-BRAIN.md) | Two-stack rule, tokens, new-page recipe |
| [Tokens.md](Tokens.md) | Classic vs manager hex/type/radius (do not average) |
| [Page-Inventory.md](Page-Inventory.md) | Blade routes ↔ views + manager `#…-root` mounts |
| [Navigation.md](Navigation.md) | Role-split sidebars; duplicate links are live |
| [Usage-Rules.md](Usage-Rules.md) | New classic page vs new manager island |
| [Token-Inconsistencies.md](Token-Inconsistencies.md) | Live drift — do not normalize |
| [Deferred-Scope.md](Deferred-Scope.md) | HQ, web Register steps 2–3, iOS RevenueCat |
| [Screenshot-Index.md](Screenshot-Index.md) | BA Archive + 2026-09-15 SA Playwright pack |
