---
title: "Two Frontend Stacks"
name: two-frontend-stacks
description: /manager is React + Vite; every other browser screen is Blade + jQuery
type: project
---

Two frontend stacks. Route starts with `/manager` or file is under `resources/manager-portal/` → **React + Vite**. Everything else in the browser → **Blade + jQuery**. Do not introduce React on field-rep Blade screens.

Why: `knowledge/architecture/stack-migration-map.md`, `knowledge/architecture/frontend.md`.

How to apply: check the stack before any UI edit. Never hand-edit `public/js/manager-portal.js`.
