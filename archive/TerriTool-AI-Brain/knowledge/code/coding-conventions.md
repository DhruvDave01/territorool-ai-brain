---
title: "Coding conventions"
---

# Coding conventions

Reverse-engineered from the actual code on 2026-09-15 — not an aspirational style guide. There is **no** ESLint/Stylelint/PHPStan/`.editorconfig` in this repo (verified: none of those config files exist), so nothing here is enforced by tooling. Where the real code is inconsistent, this doc says so explicitly rather than inventing a rule that isn't actually followed — an agent should match the surrounding file, not a rule this doc made up.

## PHP / Laravel

- **Version ceiling is real and enforced by intent, not tooling:** Write PHP 7.2-safe code. `composer.lock` installs Laravel **5.3.31**. Product overviews that say Laravel 7 / PHP 7.4 are stale until a human confirms production. Do not introduce Laravel 8+ or PHP 8+-only syntax (typed properties with defaults, match expressions, nullsafe `?->`, named arguments, etc.) anywhere in `app/`.
- **Indentation is mixed, not clean 4-space PSR-12.** In `CompanylController.php` (the largest controller), space-indented lines outnumber tab-indented lines roughly 10:1, but both exist in the same file. Match the block you're editing; don't reformat a whole file to "fix" this as a side effect of a bug fix.
- **String quoting favors single quotes**, especially in array/response literals (`'message' => 'Insufficient credits...'`) — roughly 14:1 single vs double in `CompanylController.php`. Use double quotes only when you need interpolation.
- **Method naming is inconsistent — do not assume a pattern holds.** Real examples from one controller: `addCompanySessionNote`, `addCompanyNote` (camelCase) alongside `notescreate`, `notesEdit`, `notestore`, `notesUpdate` (mixed case, no consistent separator). When adding a new method, prefer camelCase (the majority pattern) but don't "fix" existing inconsistent names as a drive-by change — that breaks routes wired to them by string name.
- **`CompanylController` is a known typo, permanent by convention.** It is not "Company" + typo to be fixed; renaming it is a full refactor across routes, views, and JS that touch it by name. See [CODEMAP.md](CODEMAP.md).
- **Business logic concentrates in one controller per feature, not services.** `CompanylController` (~7,700 lines) owns companies, notes, visits, CSV, Find Leads page, buy contacts, maps, and route attachment. This is a known shape of the codebase, not a bug to fix opportunistically — a large PR that "extracts services" without being asked will conflict with how the rest of the team navigates the code.
- **Eloquent relationships are mostly not used.** Core models (`Company`, `Contacts`, `UserRoute`, `UserList`, `Subscription`, `SupportTicket`, etc.) define `protected $table` but generally do **not** define `hasMany`/`belongsTo`/`belongsToMany` methods — joins and related-record fetches are written manually in controllers/helpers instead of via Eloquent relations. Don't assume `$company->contacts` works as a relation unless you've checked that specific model.
- **Shared logic goes in `Helper` (`app/Helpers/helpers.php`, ~1,900 lines) or an existing service/job — not a second per-client copy.** This is explicit in the feature modules ([features/README.md](../../features/README.md)): "A change to credit math, save-lead, or mark-visited must stay identical for every client."
- **Response status codes are a specific, non-obvious convention:** `status: 1` = success, `status: 0` or `status: 2` = failure — and some legacy note/activity endpoints return `status: 0` with what is actually a *success* message (MCP normalizes this before it reaches an agent; a raw web/API consumer will not). See [api-surfaces.md](../../features/20-MCP/api-surfaces.md) §4. Never assume `status: 0` means failure without checking the message text on legacy endpoints.
- **Model table names often don't match the model name.** Confirmed from the actual model files, not a guess: `Subscription` → table `user_packages`; `SupportTicket` → table `support_ticket` (singular); `UserAISearch` → table `user_ai_search` (singular). Always check `protected $table` before writing a raw query against an assumed table name — see [data-model-reference.md](data-model-reference.md).

## Frontend — two separate stacks, don't mix them

This is the single most important convention in the repo right now. See [stack-migration-map.md](../architecture/stack-migration-map.md) for the full breakdown:

- **Legacy stack** (everything except the Manager Portal): Blade templates + jQuery + Bootstrap 3 + AdminLTE + jqxGrid, heavy inline `<script>`/`<style>` in the `.blade.php` files themselves (`findleads.blade.php` is ~4,500 lines this way). New field-rep/company/route/list features extend this stack.
- **New stack** (Manager Portal only): React 18 (via Vite), source in `resources/manager-portal/*.jsx`, built to a single `public/js/manager-portal.js`. Blade files under `resources/views/front/manager/` are thin shells — a mount `<div id="...-root">` plus a `<script type="application/json">` tag carrying server data, hydrated by React. Manager Portal features extend the `.jsx` components and the `/manager/api/*` JSON endpoints, **not** Blade/jQuery.
- Do not port a Manager Portal fix into jQuery, or a field-rep fix into React — check which folder you're in first.

## CSS

- `public/css/custom.css` (~3,700 lines) has **zero CSS custom properties** (`--token: value` count is 0) — colors, spacing, and sizes are hardcoded inline throughout. There is no design-token layer to reuse; a new UI element means matching nearby hardcoded values, not referencing a variable.

## Naming and IDs an agent will see everywhere

- Route/company "status" values are user-configurable labels (defaults: Active, High Priority, Idle, Potential, Reject, Unclassified, optional Gold) — never hardcode these as an enum in new code; read them from Settings. See [glossary.md](../../product/glossary.md).
- Credit fields differ by role: `total_credit`/`used_credit` (Sales Agent, on `user_credits`), `BusinessclientSalesagentCredit` (BSA, on `businessclient_salesagent_credits`). A credit change must write the field the rest of the app reads — see [17-Admin-HQ/MODULE.md](../../features/17-Admin-HQ/MODULE.md).

## What's still unverified

This doc is built from static reading, not a linter run or a live style-guide document from the team. If the team has an actual internal style guide (Confluence page, wiki, PR template with checklist), that supersedes this file — point me at it and I'll reconcile the two.
