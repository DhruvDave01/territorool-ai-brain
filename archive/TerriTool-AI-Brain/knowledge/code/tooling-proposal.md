---
title: "Tooling proposal — DRAFT, NOT INSTALLED"
---

# Tooling proposal — DRAFT, NOT INSTALLED

None of this is active. No `.eslintrc`, `.stylelintrc`, `phpstan.neon`, `.editorconfig`, or `.github/workflows/*` exist in the repo (verified 2026-09-15) — that's still true after writing this file. These are starting-point drafts calibrated to the *real* codebase (mixed tabs/spaces, jQuery globals, Bootstrap 3 + Tailwind-slate color split, a 7,700-line controller) so that turning them on doesn't immediately produce thousands of pre-existing violations. **Do not add these files to the repo root or touch `composer.json`/`package.json` dev dependencies without explicit sign-off** — that's a real change to the team's workflow, not a documentation update.

## Why calibrated-loose, not strict

A strict default config (PSR-12, Airbnb ESLint, PHPStan level 8) would flag nearly everything in `CompanylController.php` and `modalScript.js` on day one, which trains everyone to ignore the linter rather than fix real issues. The goal here is "catch new mistakes," not "retroactively grade the existing codebase."

## `.editorconfig` (proposed)

```ini
root = true

[*]
end_of_line = lf
insert_final_newline = true
charset = utf-8
trim_trailing_whitespace = true

[*.php]
indent_style = space
indent_size = 4

[*.{js,jsx}]
indent_style = space
indent_size = 2

[*.blade.php]
indent_style = space
indent_size = 4

[resources/manager-portal/**]
indent_style = space
indent_size = 2
```

Note: this only affects *new* lines in most editors — it won't reformat the mixed indentation already in `CompanylController.php`, which is the point (see [coding-conventions.md](coding-conventions.md)).

## PHPStan (proposed, `phpstan.neon`, level 2 — deliberately low)

```yaml
parameters:
    level: 2
    paths:
        - app
    excludePaths:
        - app/Models/MongoDB/*
    checkMissingIterableValueType: false
    checkGenericClassInNonGenericObjectType: false
```

Level 2 catches real bugs (undefined variables, wrong argument counts, unreachable code) without demanding full type coverage on a PHP 7.4/Laravel 7 codebase that was never written with strict types in mind. Raise the level gradually per-directory later if the team wants to, rather than repo-wide on day one.

## ESLint (proposed, `.eslintrc.json` — legacy jQuery-aware)

```json
{
  "env": { "browser": true, "jquery": true, "es2021": true },
  "parserOptions": { "ecmaVersion": 2021, "sourceType": "script" },
  "extends": "eslint:recommended",
  "rules": {
    "no-unused-vars": "warn",
    "no-undef": "error",
    "no-console": "off"
  },
  "overrides": [
    {
      "files": ["resources/manager-portal/**/*.jsx"],
      "parserOptions": { "sourceType": "module", "ecmaFeatures": { "jsx": true } },
      "env": { "browser": true, "es2021": true },
      "extends": ["eslint:recommended", "plugin:react/recommended"],
      "rules": { "react/prop-types": "off" }
    }
  ]
}
```

Two profiles, matching [stack-migration-map.md](../architecture/stack-migration-map.md): the legacy jQuery scripts (`public/js/*.js`, inline `<script>` in Blade) get a loose, non-module, jQuery-aware config; `resources/manager-portal/*.jsx` gets a real React-aware config since that code is new and worth holding to a higher bar immediately.

## Stylelint (proposed, `.stylelintrc.json` — loose)

```json
{
  "extends": "stylelint-config-standard",
  "rules": {
    "selector-class-pattern": null,
    "color-hex-length": null,
    "no-descending-specificity": null,
    "declaration-block-no-duplicate-properties": true,
    "no-duplicate-selectors": null
  }
}
```

`selector-class-pattern` and `no-duplicate-selectors` are off because `custom.css` (5,693 lines) almost certainly violates both extensively — this catches genuine mistakes (duplicate property declarations) without blocking on the existing file's structure.

## CI proposal (`.github/workflows/lint.yml` — draft, not committed)

```yaml
name: Lint
on: [pull_request]
jobs:
  php-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with: { php-version: '7.4' }
      - run: composer install --no-interaction
      - run: vendor/bin/phpstan analyse --error-format=github
  js-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npx eslint resources/manager-portal public/js/modalScript.js
```

This only lints changed-relevant code on PRs — it does not run the (currently near-nonexistent) test suite, since [bug-repro-runbook.md](bug-repro-runbook.md) already flags that only 5 PHPUnit files exist and Playwright e2e has no spec files yet. Add a test job once there's something real for it to run.

## Adoption plan, if you decide to proceed

1. Add `.editorconfig` first — zero risk, affects only new edits.
2. Add PHPStan at level 2, run it once locally, fix or explicitly baseline (`phpstan.neon`'s `ignoreErrors` / a generated baseline file) whatever it finds in existing code — don't let day-one noise block the first real PR.
3. Add ESLint/Stylelint the same way — run once, baseline existing violations, don't mass-reformat.
4. Wire the CI workflow last, once local runs are clean, so the first PR against it isn't red for unrelated reasons.

This is a decision for the team, not something to switch on unilaterally — flag when you want to move on any of these steps.
