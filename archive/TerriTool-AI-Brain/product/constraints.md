---
title: "Constraints"
---

# Constraints

Hard limits on what an engineering change may do.

## Stack

- PHP 7.2-safe. This checkout’s lockfile is Laravel **5.3.31**. Local CLI observed **PHP 7.4.33**. No Laravel 8+ / PHP 8 syntax.
- No new Composer/npm packages unless the user asks.
- No Docker/CI/deploy pipeline in-repo — do not invent one in a feature PR.
- Do not install Playwright Test unless asked (`ADR-004`).

## Frontend

- Only Manager Portal is React. Field-rep screens stay Blade + jQuery.
- Never hand-edit `public/js/manager-portal.js`.
- Do not rename `CompanylController`.

## Data

- Do not trust `database/webterritool.sql`.
- Do not query or migrate `coffee_*`, `bookings`, `booking_*`, `stocks`.
- Do not delete or rewrite existing customer data without explicit instruction.
- Schema truth is live MySQL; migrations are incomplete.

## Product

- Do not change credit amounts without an explicit product decision.
- Do not make a paid action free to “fix” an error.
- Do not implement shared writes on only one client.
- MCP `create_route` must remain publish-not-draft unless product changes the contract.
- Admin MCP is not Address Book.

## Secrets / PII

- Never commit `.env`, keys, or customer lists into the Brain or git.
- Test users are **UNKNOWN** in-repo — a human must provide them.

## Tooling honesty

- `npm run test:e2e` has no config/specs.
- `ExampleTest` is not a smoke test of the product home.
- Full PHPUnit red with MySQL down is often **only** `ExampleTest` (login 500). Manager tests can still pass.
