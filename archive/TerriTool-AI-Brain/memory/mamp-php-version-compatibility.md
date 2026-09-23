---
title: "MAMP PHP Version Compatibility"
name: mamp-php-version-compatibility
description: MAMP's selected PHP version can prevent the Laravel 5.3 app from reaching a browser flow.
type: project
---

MAMP was configured for PHP 8.2.20 on 2026-09-16. Opening `http://localhost:8888/webterritool/public/index.php/login` showed Laravel 5.3/Symfony deprecation notices from vendor code and never rendered the login form. The project's CLI PHP was 7.4.33; the lockfile installs Laravel 5.3.31 and project code must remain PHP 7.2-safe.

Why: live browser QA screenshot and `php artisan --version`, 2026-09-16.

How to apply: **Do not use the MAMP Apache URL for local QA.** Canonical login is `http://127.0.0.1:8000/login` ([local-qa-url-artisan-serve.md](local-qa-url-artisan-serve.md)). If someone still opens MAMP `/webterritool/public`, PHP must be 7.2–7.4 or Laravel 5.3 will dump deprecations instead of login. Do not place compatibility-error captures in a feature's product evidence folder.
