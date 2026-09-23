---
title: "QA recheck — execution readiness and flow contract (2026-09-16)"
---

# QA recheck — execution readiness and flow contract (2026-09-16)

QA loop: [../loops/qa-loop.md](../loops/qa-loop.md). This is a fresh source, test, and browser-environment recheck. It does **not** replace the earlier [full flow pass](qa-full-2026-09-16.md): authenticated browser paths still require an approved fixture user and a working application endpoint.

## Environment and automated checks

| Check | Result | Meaning |
|---|---|---|
| `vendor/bin/phpunit --filter Manager` | **pass** — 17 tests, 51 assertions | Manager service helper coverage is executable. |
| `npm run test:e2e` | **blocked** — installed Node is 14.19.3; Playwright requires Node 20+ | This script is not an executable suite in this checkout; there is also no Playwright config or spec. |
| `http://127.0.0.1:8000/login` | **blocked (env)** — connection refused | The short-lived Artisan server could not stay available to the browser. |
| MAMP browser URL | **blocked (env)** — direct Laravel entry point loaded only PHP deprecations, no login form | MAMP maps the project at `/webterritool/public`, but is configured for PHP **8.2.20**. Laravel 5.3 emits compatibility errors before FLOW-AUTH can start. |
| staging login | **blocked (env)** — hostname did not resolve from this sandbox | No guest screenshot was captured because no TerriTool page rendered. |

## Flow contract review

| Flow | Canonical UCs / expected result | Current check | Result |
|---|---|---|---|
| FLOW-AUTH | UC-AUTH-01; sign-in and role landing | Source confirms a defect: `custom_picwa.js` reads `AuthUser` but `front.layout` omits it for guests. | **fail (source-confirmed)** |
| FLOW-ONB / HOME | UC-ONB-01…03, UC-HOME-01…04; role home and chrome | No authenticated fixture/browser route. Earlier evidence remains the only UI proof. | **blocked (env)** |
| FLOW-FIND-LEADS / AB / CONTACTS | UC-LEAD-*, UC-CO-*, UC-CT-*; free search, save −1, buy −2/−1 | Save, credit and duplicate code paths remain mapped; no safe live credit-spend run. | **blocked (fixture/credits)** |
| FLOW-LIST / ROUTE / FIELD | UC-LST-*, UC-RTE-*; web draft, MCP publish, active visits | Contract remains present in routes/tools/source; no authenticated web or MCP fixture in this run. | **blocked (fixture)** |
| FLOW-UPLOAD / BILLING / SETTINGS / SUPPORT | UC-UPL-*, UC-BIL-*, UC-SET-*, UC-SUP-* | No authenticated browser environment. | **blocked (env)** |
| FLOW-MANAGER | UC-MGR-01…05; React root and manager lead assignment | PHPUnit proves service helpers only; browser root/API paths untested. | **partial pass (unit only)** |
| FLOW-HQ / MAPS / CRON / TEAM / MCP | UC-ADM-*, UC-MAP-*, UC-CRON-*, UC-TEAM-* and MCP contract | Source/Brain maps exist; no live admin, map, queue, invite, or OAuth session. | **blocked (fixture/env)** |

## Defect and missing QA capability

1. **P0 — local runtime incompatibility:** MAMP PHP **8.2.20** renders the Laravel 5.3 application unusable, showing deprecation notices from `vendor/laravel/framework/src/Illuminate/Container/Container.php` and never reaching login. Use the project's PHP 7.2-compatible runtime (CLI currently reports PHP 7.4.33) before UI QA. Screenshot captured in this pass, but kept out of feature evidence because it is an environment failure, not a product screen.
2. **P1 — guest console error:** `public/vendor/adminlte/dist/js/custom_picwa.js:24` uses `if (!AuthUser)`, while `resources/views/front/layout.blade.php` only declares `AuthUser` inside `@if(Auth::user())`. Login and registration extend this layout. Define it as `null` for guests or guard the vendor script with `typeof AuthUser !== 'undefined'`, then browser-test `/login` and `/register`.
3. **Execution gap:** `package.json` exposes `test:e2e`, but the repository contains neither a Playwright config nor specs, and this machine's Node 14 cannot launch the installed Playwright version. The command must remain documented as unavailable—not as test coverage—until Node 20+ and real specs are deliberately added.
4. **Fixture gap:** no documented non-production Sales Agent, Business Agent, or credit-safe data fixture exists. This blocks end-to-end verification of every write, cross-client side effect, and role landing.
5. **Runtime gap:** the documented MAMP URL is not enough to guarantee a usable project runtime. Record the actual local host, document root, **PHP version**, and database readiness before starting a browser pass.

## Diagrams and screenshots

The Brain already contains the product-wide and per-module Mermaid source plus 21 rendered flow PNGs. No new diagram was needed: the missing capability is environment/fixture setup, not an undocumented product branch. No TerriTool screenshot was captured in this pass because the only browser result was a MAMP 404; recording it as product evidence would be misleading.

## Required next pass

Switch MAMP to a PHP 7.2–7.4-compatible runtime (or provide a usable staging URL) with MySQL and queue available; provide fixture credentials for a Sales Agent and Business Agent with an explicit disposable credit budget; then run the QA-loop smoke set, capture each final UI state, and compare web writes with MCP reads.
