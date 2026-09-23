---
id: release-flavor-matrix
parent: ops
sources:
  - App/config/index.js
related:
  - 02-commands.md
  - ops/env-inventory.md
---
# Release / flavor matrix

Related: [02-commands](../02-commands.md) · [ops/env-inventory.md](env-inventory.md)

## How environments are selected

| Surface | Mechanism |
|---------|----------|
| Mobile API | **Comment swap** in `App/config/index.js`: STAGING vs PROD `URL_BASE` / `SUBSCRIPTION_URL` |
| `IS_STAGING_OR_DEV_BUILD` | `URL_BASE` hostname contains `"staging"` (or Metro dev) |
| Sentry env | `__DEV__` → development; else staging if URL has staging; else production |
| Web | `.env` `APP_URL`, `APP_ENV`, DB names |
| MCP | Same `APP_URL` + `/ai/mcp`, `/ai/mcp-admin`, `/find-mcp/mcp` |

There are **no** Android `productFlavors` observed. `applicationId` is always `com.picwa.territoolapp`.

## Hosts

| Env | Web | Mobile `URL_BASE` |
|-----|-----|-------------------|
| Production | `https://app.territool.com` | `https://app.territool.com/index.php/api/` |
| Staging | `https://staging.territool.com` | `https://staging.territool.com/index.php/api/` |
| Local web | `.env` often `http://localhost:8888` | — |

## Version numbers (live files, they **drift**)

| Source | Value |
|--------|--------|
| `package.json` `version` | `0.0.1` |
| `package.json` `version_ios` | `7.1.49` |
| `package.json` `version_android` | `4.2.7` |
| Android `versionName` | `4.4.70` |
| Android `versionCode` | `361` |
| Android minSdk / target / compile | 24 / 36 / 36 |
| iOS `IPHONEOS_DEPLOYMENT_TARGET` | `15.5` |
| iOS `MARKETING_VERSION` (pbxproj) | `42.31` (can disagree with package.json) |
| iOS `CURRENT_PROJECT_VERSION` | `1` |
| API check string `APP_VERSION` | `'2.0'` |
| User MCP server | `territool-app` **1.4.1** |
| Web `version.json` | `versionName` `1.0.0` |

When quoting “the app version” to QA, say **which file** you used.

## Git promotion (mobile `package.json` scripts)

Destructive to remotes — do not run unless asked.

| Script | Meaning |
|--------|--------|
| `merge:t2s` | `TT_80` → `Staging` |
| `merge:s2p` | `Staging` → `Production` |
| `merge:release` | both |

## Maestro test accounts (scripts, not secrets for prod)

Staging login: `ann_new@yopmail.com`. Live login: `testim@yopmail.com`. Password in scripts: `test@123`. Register uses generated `maestro.stage.$(date +%s)@yopmail.com`.
