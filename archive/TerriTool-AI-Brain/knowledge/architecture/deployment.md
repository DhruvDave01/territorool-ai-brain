---
title: "Deployment"
---

# Deployment

**Fact:** this repository has **no** Docker, Forge, Envoyer, GitHub Actions, or deploy scripts.

Release process is therefore **UNKNOWN — needs verification** from whoever ships staging/production.

## What exists locally

| Mechanism | Evidence |
|-----------|----------|
| `php artisan serve` / `npm run serve` | **Canonical local QA:** `http://127.0.0.1:8000/login` |
| MAMP MySQL | Workspace path `/Applications/MAMP/htdocs/webterritool`; DB often port **8889**. Do **not** QA in the browser at `/webterritool/public` |
| `npm run build` | Required after Manager Portal JSX changes |
| `npm run queue` | Async bulk enrich / some CRM jobs |
| `npm run clear` | Artisan caches |
| Composer `post-install` | `artisan optimize`; copies vendored captcha |

## Staging / production URLs

Evidence screenshots (original capture set) were taken against **`https://staging.territool.com`**. Production host: **UNKNOWN** from repo files (Play Store package `com.picwa.territoolapp` in `version.json`).

## CI

None in-repo. Draft proposal only: `knowledge/code/tooling-proposal.md` (not installed).

Until CI exists, “green checks” are not a gate. The PR loop must still run PHPUnit and UI verification locally. See [../loops/release-loop.md](../../loops/release-loop.md).

## Mobile

APK at `public/territool.apk`. Source repo: `https://github.com/DhruvDave01/TerriTool_Mobile` (production branch checked out locally at `/Applications/MAMP/htdocs/TerriTool_Mobile-Production`, added 2026-09-17). Full stack/build/integrations: [mobile.md](mobile.md).
