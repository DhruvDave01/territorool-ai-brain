# Deferred scope (2026-09-11)

The owner asked to **skip Register, payment, and other missing packs** until they provide captures.

Documented as **exists in code, out of visual scope**:

| Area | Code | Why skipped |
| --- | --- | --- |
| Register | `register/index_register_split.js` | No captures |
| PostSignupPaywallFlow | Goals → Role → Cost → Configuring → Welcome | Payment/onboarding |
| SubscriptionScreen | RevenueCat | Payment |
| SubscriptionGate | Cold-start gate | Payment |
| SettingsPlanPaywall | Settings | Payment |
| Cancel / Upgrade / Buy extra credits **flows** | Settings buttons **are** visible in `IMG_4564` | Store/web purchase not recorded |
| CancelAccountConfirmModal | Settings | Payment-adjacent |
| First-signup AI onboarding flag | `MultipleAIWaypoint` | No first-run capture |
| Android UI | — | Archive 2 is iOS only |
| Native splash / Lottie | `AnimatedSplashScreen` | No capture |
| WhatsNewModal | | No capture |
| Spotlight / first-route coaching | | No capture |
| HubSpot `Error` screen | | No capture |
| Lasso draw | `LassoMap` | Chip exists; no draw video |
| Notifications screen | Dead nav | No capture |
| RouteSwipe | Dead nav | |
| ClusterList | Broken nav | |
| Session expired / crash fallback | | No capture |
| Edit Route / Edit List full screens | | No dedicated stills |
| Forgot-password **web** page | External | Out of app |

When new archives arrive, extend flows and this matrix — do not invent UI.
