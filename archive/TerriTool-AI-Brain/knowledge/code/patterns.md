---
title: "Patterns (as used, not as wished)"
---

# Patterns (as used, not as wished)

Details: `code/coding-conventions.md`.

## PHP

- Laravel 5.3-era controllers: large methods, mixed JSON/HTML, `INPUT_REQUEST` type hints in places
- Shared rules belong in `Helper` / existing jobs — bible rule
- Transactions: used for some credit+insert paths; not universal — check the method
- Validation: mix of `Validator::make`, Form Requests (`RoutesRequest`), and ad hoc
- JSON shape is inconsistent (`status` 0/1 vs HTTP codes). Match the endpoint you are on
- `CompanylController` name is frozen

## Frontend

- Legacy: jQuery events in the Blade file itself or `modalScript.js`
- Manager: functional React + fetch to `/manager/api/*`; initial payload in JSON script tags (`Utf8Sanitizer`)
- Do not share a component library across stacks — there isn’t one. Design tokens stopgap: `design-tokens-stopgap.md`

## MCP

- Prefer config-driven tool → v2 mapping; composite tools only when listed in `$handlers`
- Confirm-token pattern for `save_ai_leads` and bulk buys (see api-surfaces.md)
- Audit logging via `AppMcpAuditLogger`

## What “good” looks like in this repo

A change that:

1. Updates web + v2 (or Helper used by both)
2. Keeps credit numbers identical
3. Leaves the other frontend stack alone
4. Updates the feature `MODULE.md` + this Brain if a durable fact changed

## Inconsistencies to tolerate

- Two contact buy methods (`buyContacts`, `buyContactsV2`, async variants)
- `activities` vs `log_meetings`
- Route status enum richer than product copy
- Dead v2 enrich endpoints still registered
