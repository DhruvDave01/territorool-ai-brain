---
area: shoebox
tags: [brain/shoebox]
ref: "05 - Coding Standards"
---

# 05 - Coding Standards

## mobile-good/   (3-5 files)
Real files from the RN codebase you consider exemplary. A screen,
a reusable component, a hook, an API service, a type/model file.

## mobile-bad/    (2-3 files)
Files that embarrass you. Add a `WHY.md` saying what's wrong with each.
This teaches the brain your taste better than any rule list.

## web-good/ , web-bad/
Same for Laravel: a controller, a form request, a resource, a service
or action class, a model, a Blade/Inertia/Vue view.

## configs/
Drop the real files: .eslintrc, .prettierrc, tsconfig.json, babel.config.js,
pint.json, phpstan.neon, .editorconfig, composer.json, package.json,
phpunit.xml, and any CI config (.github/workflows/*).

Also create `rules.md` with anything not encoded in a config:
naming conventions, folder conventions, "never do X", commit message format,
branching strategy, how API errors must be handled, how loading states work.
