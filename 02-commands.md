---
id: 02-commands
parent: core
sources:
  - TerriTool/package.json
  - TerriTool/.maestro/
  - webterritool/package.json
  - app/UserMcp/Console/
related:
  - 10-mobile-app.md
  - 11-web-backend.md
  - 19-testing-qa.md
  - 05-constraints-and-drift.md
  - 13-web-urls.md
---
# 2. Commands

Related: [10-mobile-app](10-mobile-app.md) · [11-web-backend](11-web-backend.md) · [19-testing-qa](19-testing-qa.md)

## 2.1 Mobile (`TerriTool/package.json`)

Requires **Node >= 22.11.0**, Java 17, iOS 15.5+, Android minSdk 24 / targetSdk 36.

```bash
# Install
yarn install                  # postinstall: patch-package
cd ios && pod install && cd ..

# Run
yarn start                    # Metro --reset-cache
yarn start:fresh              # kill :8081 then Metro
yarn ios
yarn android
yarn adb                      # adb reverse tcp:8081

# Lint
yarn lint
yarn lint:fix

# Bundles
yarn local_bundle             # iOS release jsbundle
yarn local_bundle_android

# Clean
yarn clean:node
yarn clean:ios
yarn clean:android
yarn clean                    # all three

# Assets
yarn link:assets              # react-native-asset

# Postman from config
yarn generate-collection
yarn enrich-collection

# Git promotion (destructive to remotes — do not run unless asked)
yarn merge:t2s                # TT_80 → Staging
yarn merge:s2p                # Staging → Production
yarn merge:release
```

### Maestro E2E (`package.json` `maestro:*`)

| Script | Notes |
|-------|--------|
| `maestro:login:staging:android` / `:ios` | `ann_new@yopmail.com` / `test@123` |
| `maestro:login:live:android` / `:ios` | `testim@yopmail.com` / `test@123` |
| `maestro:login:validation:android` | Validation only |
| `maestro:login:staging` / `:live` | Both platforms |
| `maestro:register:staging:android` / `:ios` | Unique `maestro.stage.$(date +%s)@yopmail.com` |
| `maestro:register:validation:android` | |
| `maestro:post-register:onboarding:android` | |
| `maestro:register:full-journey:android` | |

Flows live under `TerriTool/.maestro/`.

### Version fields

| Source | Value |
|--------|--------|
| `package.json` `version` | `0.0.1` |
| `package.json` `version_ios` | `7.1.49` |
| `package.json` `version_android` | `4.2.7` |
| Android Gradle (can drift) | `versionName` `4.4.70`, `versionCode` `361`, `applicationId` `com.picwa.territoolapp` |

See [05-constraints-and-drift.md](05-constraints-and-drift.md).

## 2.2 Web (`webterritool/package.json` + Composer)

PHP **^7.2**, Laravel **^7.0**. Local often MAMP.

```bash
composer install
cp .env.example .env && php artisan key:generate
# Core tables often come from a SQL dump, not a greenfield migrate

npm install   # or yarn
npm run dev   # Vite (manager portal React + some Vue 2)
npm run build
npm run serve # php artisan serve
npm run queue # php artisan queue:listen --tries=3 --timeout=0
npm run clear # config/cache/compiled/view
npm run clean
npm run cleanyarn
```

Composer post-install/update runs `php artisan optimize`. `composer.json` schedule is empty — **crons are HTTP GET routes**, not the Laravel scheduler. See [13-web-urls.md](13-web-urls.md).

### User MCP artisan (`app/UserMcp/Console/`)

Command prefix is `territool-app` (matches the product name).

```bash
php artisan territool-app:qa
php artisan territool-app:selftest
php artisan territool-app:qa-contacts
php artisan territool-app:qa-search
php artisan territool-app:logs
```

Examples from the command classes:

```bash
php artisan territool-app:selftest jane@example.com
php artisan territool-app:selftest 437 --tool=view_routes
php artisan territool-app:qa-contacts --user=784
php artisan territool-app:qa-search --user=784
php artisan territool-app:logs --user=156 --tool=create_route
```

Admin MCP stdio:

```bash
php artisan mcp:stdio
```
