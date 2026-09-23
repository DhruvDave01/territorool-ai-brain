---
id: Deferred-Scope
parent: design
sources:
  - register/index_register_split.js
---
# Deferred scope (updated 2026-09-16, numbered iOS pack)

Visual scope only. Live JS is not “missing.” Map: [screens/navigation-map.md](../../screens/navigation-map.md). Screenshot map: [Mobile-Screenshot-Flow.md](Mobile-Screenshot-Flow.md).

| Area | Code | Status |
| --- | --- | --- |
| Register / PostSignup steps 1–6 | `register/` | **Captured** — `ios/01-auth/02`–`07` + Archive LoginRegistrationFlow |
| `SubscriptionScreen` | RevenueCat | **Captured** — `ios/01-auth/09` (and `08`, same chrome) |
| `SubscriptionGate` **distinct** layout | RevenueCat | **No distinct still** — `08-subscription-gate.png` is the subscribe paywall |
| Settings Upgrade when **App Store** billed | Settings | **No still** (packs show web-billed “Manage your plan on the web”) |
| Buy extra credits | Settings | **Web** Safari Credit Add-Ons (`ios/09-settings/04`) — not in-app IAP |
| Android UI | — | Stills are iOS only |
| Native splash **Lottie overlay** | `AnimatedSplashScreen` | `ios/00-splash/00-splash.png` is solid `#124ac6` + status bar |
| WhatsNew **changelog** | | `08-whats-new.png` is **New Update Available**, not a tour |
| Lasso **finger-draw** | `LassoMap` | Chrome captured (`03`/`06`/`07`/`08` lasso stills); no draw video |
| RouteSwipe | stack | Stub still only — not shipping chrome |
| ClusterList | Broken nav | Skip |
| Session expired | | No capture |
| Publish **success** loader | PublishRoute | This numbered pack has **fail** cards; success still IMG_4574 / VID1 |
| Forgot-password **web** | External | `ios/01-auth/01-login-forgot-password.png` (staging Safari) + web Playwright |

When new archives arrive, extend flows and this matrix — do not invent UI. Do not copy `FilterList` / `FilterRoute` stills into new screens.
