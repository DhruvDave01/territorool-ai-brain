---
title: "Laravel Lockfile 5.3"
name: laravel-lockfile-5.3
description: composer.lock is Laravel 5.3.31 — write PHP 7.2-safe code; ignore stale “Laravel 7” prose
type: project
---

Installed `laravel/framework` is **v5.3.31**. Write PHP **7.2**-compatible code. Do not use Laravel 8+ or PHP 8 syntax (`?->`, named arguments, typed property promotion, `match`).

Why: `composer.lock` vs copied product text that still says Laravel 7 / PHP 7.4. ADR-003: lockfile wins until a human confirms production.

How to apply: PHP 7.2-safe on every PHP change. Do not “modernize” syntax while touching a nearby file.
