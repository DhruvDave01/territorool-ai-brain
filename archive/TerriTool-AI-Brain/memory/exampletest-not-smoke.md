---
title: "ExampleTest Not Smoke"
name: exampletest-not-smoke
description: Full PHPUnit red with MySQL down is usually only ExampleTest — use --filter Manager
type: project
---

`ExampleTest` visits `/` → `/login`. Login Blade hits MySQL via `Helper::userActiveSubscription`. If MySQL is refused, that test **500s**. That is not “the whole suite is broken.”

Why: `tests/ExampleTest.php` + login layout. Manager tests can still pass.

How to apply: prefer `vendor/bin/phpunit --filter Manager` when MySQL is down or when Manager helpers changed. Do not install Playwright Test unless asked (`ADR-004`).
