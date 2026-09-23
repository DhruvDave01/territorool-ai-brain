---
title: "Mobile"
---

# Mobile

**Source repo (local checkout):** `/Applications/MAMP/htdocs/TerriTool_Mobile-Production` — production branch, added to this machine 2026-09-17. Not a git clone on this checkout (no `.git`); upstream is `https://github.com/DhruvDave01/TerriTool_Mobile`. This is a **separate repo from `webterritool`** — do not expect mobile source inside this Laravel checkout. The one artifact that does live in `webterritool` is a build output: `public/territool.apk`.

Same product, same rules as web/MCP: credits, publish-on-create, one-product writes (see [`product/business-rules.md`](../../product/business-rules.md)) apply to every mobile write exactly as they do to web.

## Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native **0.84.1**, React **19.2.3** (JS; TypeScript for editor tooling only) |
| Navigation | React Navigation 7 (native stack ~7.14) |
| Local DB | Realm ~20.2 |
| Networking | `App/utils/API.js` + `App/storage`; base URL and ~150 endpoint-path constants in `App/config/index.js` |
| UI | Gesture Handler, Screens, Safe Area, Modals, Toast, Lottie (splash), Vector Icons |

Store versions (`package.json` / README): iOS **7.1.49** · Android **4.2.7**. Bundle IDs: Android `com.picwa.territoolapp`, iOS "TerriTool App" (per `features/18-Clients/MODULE.md`).

## API base

`App/config/index.js`:

```js
// PROD (active)
URL_BASE = 'https://app.territool.com/index.php/api/'
SUBSCRIPTION_URL = 'https://app.territool.com/subscription'
// STAGING (commented, swap to test)
// URL_BASE = 'https://staging.territool.com/index.php/api/'
```

Note the literal path is `/index.php/api/` — **not** `/index.php/api/v2/`. Cross-check against [`knowledge/api.md`](../api.md) before trusting either doc's prefix; this is exactly the "api.md wrong prefix" item already flagged open in the 2026-09-16 audit (see `memory/reference_ai_brain_audit_artifact.md` in the user's own memory, not this Brain). `App/config/index.js` has ~150 more endpoint-path constants (contacts, credits, referral, subscription, activity, MCP-adjacent) worth mining next time the v2 surface doc needs verifying.

## Integrations

| | Evidence |
|--|--|
| Firebase (`@react-native-firebase` ^24.0.0) | App bootstrap, **Crashlytics** (crash reporting), **Cloud Messaging** (push) — config in `firebase.json` |
| Sentry (`@sentry/react-native` 8.5.0) | Errors + mobile session replay, configured in root `init.js` (`enabled: !__DEV__`) and `sentry.options.json` (DSN present in that file — do not copy the literal DSN into this Brain) |
| RevenueCat (`react-native-purchases` ^9.12.0) | Subscriptions. Guide already in-repo: `docs/TerriTool-RevenueCat-Subscriptions-Guide.md/.pdf` |
| PostHog | Analytics, client-safe key in `App/config/index.js` (`POSTHOG_API_KEY`, `phc_...` prefix — public/write-only token, not a secret) |
| `react-native-maps` + in-repo clustering (`App/customPackage/react-native-map-clustering`) | Map screens |
| Facebook SDK, TikTok Business SDK | Social / ad attribution (`init.js`, `App/utils/TikTokHelper`) |

## Build / run (from the mobile repo's own README — do not re-derive, just point here)

- Prereqs: Node ≥22.11, Ruby + Bundler (CocoaPods via `bundle install` in `ios/`), Xcode, Android Studio, Java 17
- `yarn install` (postinstall runs `patch-package`)
- `yarn android` / `yarn ios` → `react-native run-android` / `run-ios`
- `yarn start` / `yarn start:fresh` → Metro (fresh kills anything on :8081 first)
- `yarn clean` → nukes `node_modules` + both native build dirs, reinstalls

## Testing (real, unlike web's phantom `test:e2e`)

- **Maestro** E2E flows exist and are wired into `package.json` scripts: `maestro:login:staging:android`, `maestro:login:live:ios`, `maestro:register:full-journey:android`, `maestro:post-register:onboarding:android`, etc. — flow YAML lives in `.maestro/` in the mobile repo.
- **Detox** is configured (`.detoxrc.js`, `e2e/`) alongside Maestro.
- Jest unit tests: `__tests__/`, `jest.config.js`.

## Existing docs in the mobile repo (do not re-transcribe into this Brain — link out)

- `docs/NAVIGATION_FULL_FLOW.md`, `docs/TERRITOOL MOBILE - NAVIGATION AUDIT REPO.md` — screen/navigation map
- `docs/RELEASE_AND_QA_PROCESS.md`, `docs/RELEASE_AND_QA_CLIENT_GUIDE.md` — release + QA process
- `docs/Code-Audit-Report-2026-07-06.md` — prior code audit
- `docs/user-guide/` — end-user facing docs
- `postman/TerriTool-API-from-config.postman_collection.json` + `TerriTool-Staging.postman_environment.json` — generated API collection; good next cross-check against `features/20-MCP/api-surfaces.md` (not done yet — see [`log.md`](../../log.md) 2026-09-17 entries)

## Screens / evidence

230 flow-wise screenshots (Archive, triaged 2026-09-17), copied to `features/<module>/evidence/mobile/<FlowName>/` and described step-by-step in each feature's `flows.md`, with an index table in each `evidence.md`. Source archive: `/Users/picwa/Downloads/Archive (3)/<FlowName>/` (outside both repos, user's own machine — not in either git tree).

| Archive folder | Files | Feature |
|---|---|---|
| `LoginRegistrationFlow` | 21 | [01-Authentication-Onboarding](../../features/01-Authentication-Onboarding/flows.md) |
| `Dashboard` | 7 | [02-Dashboard](../../features/02-Dashboard/flows.md) |
| `ActivityCalendar` | 4 | [02-Dashboard](../../features/02-Dashboard/flows.md) — reached from Dashboard's Activity card; last screen crosses into company detail |
| `AddCompany` | 9 | [03-Company-AddressBook](../../features/03-Company-AddressBook/flows.md) |
| `AddressBookFlow` | 18 | [03-Company-AddressBook](../../features/03-Company-AddressBook/flows.md) |
| `ScanCardFlow` | 11 | [04-Contacts](../../features/04-Contacts/flows.md) — no UC id yet |
| `AIFindLeadsFlow` | 49 | [05-Find-Leads](../../features/05-Find-Leads/flows.md) |
| `List` | 42 | [08-Lists](../../features/08-Lists/flows.md) — first ~19 frames are the bulk Find Contacts flow, shared with Routes |
| `RouteFlow` | 81 total, 62 unique | [07-Routes](../../features/07-Routes/flows.md) — 19 frames were byte-identical duplicates of `List`'s bulk Find Contacts flow and were removed, not re-described |
| `Setting` | 7 | [14-Settings-Profile](../../features/14-Settings-Profile/flows.md) |

230 unique images total. Every file is linked from its feature's `flows.md` and/or `evidence.md` — verified with a completeness sweep (0 unlinked).
