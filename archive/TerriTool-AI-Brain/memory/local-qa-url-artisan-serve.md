---
title: "Local QA URL — Artisan Serve"
name: local-qa-url-artisan-serve
description: Local browser QA is http://127.0.0.1:8000/login — not MAMP /webterritool/public
type: project
---

Canonical local QA URL is **`http://127.0.0.1:8000/login`** (`npm run serve` / `php artisan serve`). Do not open `http://localhost:8888/webterritool/public` (or `/webterritool/public/index.php/login`) for Brain UI/QA.

Why: human instruction 2026-09-16. The running local project is artisan on port 8000. The MAMP `/public` path is not the QA host.

How to apply: Playwright, verify-ui, and qa-loop start at `http://127.0.0.1:8000/login`. Staging fallback remains `https://staging.territool.com/login`. MySQL may still be MAMP on `127.0.0.1:8889` — that is the database, not the app URL.
