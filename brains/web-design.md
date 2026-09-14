# 4. Web Design Brain

Hub for **as-shipped** web pixels. Two stacks — do not mix. Sibling: [Web Code Brain](web-code.md). Parent: [sub brains](README.md).

**Repo:** `webterritool/` Blade + `public/css/` + `resources/manager-portal/`. Short stills: `design-web/03-Assets/stills/`.

## Read first

1. This file (rules).
2. [design-web/MINI-DESIGN-BRAIN.md](../design-web/MINI-DESIGN-BRAIN.md).
3. Then: [Tokens.md](../design-web/Tokens.md), [Page-Inventory.md](../design-web/Page-Inventory.md), [Navigation.md](../design-web/Navigation.md), [Usage-Rules.md](../design-web/Usage-Rules.md).

Not a redesign. Product APIs stay in the [API Brain](api.md). HQ `/hq/*` pixels are **deferred**.

## Must follow

| Rule | Do this |
|------|---------|
| Classic `/dashboard`, `/company`, `/routes`, `/lists`, `/findleads` | `@extends('front.layout')`. AdminLTE + jQuery **2.2.0** + Bootstrap **3.3.5**. |
| Manager `/manager/*` | React islands. CSS vars on `#mgr-portal-dashboard-wrapper`. `body.manager-portal` hides AdminLTE gutters. |
| Shared primary | `#124ac6` on both stacks. |
| Classic leftover teal | `#16aa9d` (and list-page `--tt-teal` `#00a99d`). **Do not replace with manager teal.** |
| Manager `--teal` | `#00a99d`. Do not average with classic leftover. |
| Type | Classic: Source Sans Pro + DIN 2014. Manager: **DM Sans** / **Space Grotesk**. Do not put manager fonts on a new classic page. |
| Radius | Manager `--radius` **14px**. Classic boxes stay AdminLTE. |
| Sidebar | Leave duplicate icon + text `<a>` pairs in `inc/sidebar.blade.php`. |
| Vite Bootstrap 5 | Listed in `package.json`; manager JSX **does not import it**. |
| Register / paywall / HQ | Deferred visual scope. [Deferred-Scope.md](../design-web/Deferred-Scope.md). |

## New page recipe (short)

**Classic:** `after_styles` / `header` / `content` / `after_scripts`. PNotify toasts. `#cover-spin` loader. CSRF `X-CSRF-TOKEN`.

**Manager:** island root `#manager-*-root`. Do not add a new AdminLTE page for Business Agent.

Inconsistencies: [Token-Inconsistencies.md](../design-web/Token-Inconsistencies.md).
