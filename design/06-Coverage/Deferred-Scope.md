---
id: Deferred-Scope
parent: design
sources:
  - register/index_register_split.js
---
# Deferred scope (2026-09-11)

The owner asked to **skip Register, payment, and other missing packs** until they provide captures.

This is **visual scope**, not missing product code. Live JS: `PostSignupPaywallFlow`, `SubscriptionScreen`, `SubscriptionGate`, `firstSignUpOnboarding`. Map: [screens/navigation-map.md](../../screens/navigation-map.md).

| Area | Code | Why skipped |
| --- | --- | --- |
| Register / PostSignup steps 1–4 | `register/` + `postSignupPaywallFlow.js` | Captured Maestro `00`, `20`–`24` |
| PostSignup Configuring (step 5) | same | No still |
| SubscriptionScreen / SubscriptionGate | RevenueCat | Payment UI still uncaptured |
| SettingsPlanPaywall | Settings | Payment |
| Cancel / Upgrade / Buy extra credits **flows** | Settings buttons **are** visible in `IMG_4564` | Store/web purchase not recorded on mobile |
| CancelAccountConfirmModal | Settings | Payment-adjacent |
| First-signup AI hunt flag | `MultipleAIWaypoint` | No dedicated first-run hunt still (normal AI screen) |
| Android UI | — | Stills are iOS only |
| Native splash **Lottie overlay** | `AnimatedSplashScreen` | Maestro `19-splash.png` is solid `#124ac6` native window only |
| WhatsNewModal | | No capture |
| Spotlight / first-route coaching | | No capture |
| HubSpot `Error` screen | | No capture |
| Lasso draw | `LassoMap` | Chip exists; no draw video |
| Notifications screen | Dead nav | No capture |
| RouteSwipe | Dead nav | |
| ClusterList | Broken nav | |
| Session expired / crash fallback | | No capture |
| Edit Route / Edit List full screens | | No dedicated stills |
| Forgot-password **web** page | External | Captured: `untitled folder/screenshots/web/desktop/password-reset.png` |

When new archives arrive, extend flows and this matrix — do not invent UI.
